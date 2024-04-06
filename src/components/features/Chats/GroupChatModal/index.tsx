import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure } from "@chakra-ui/react";
import UserListItem from "../../UserListItem";
import { Chat, User } from "../../../../interfaces/types.lib";
import { Controller, useForm } from "react-hook-form";
import TextInput from "../../../ui/TextInput";
import { useEffect, useState } from "react";
import { useApiRequest } from "../../../../hooks/useApiRequestService";
import { AppConfig } from "../../../../api/endpoints";
import UserBadgeItem from "../../UserBadgeItem";
import { useChatContext } from "../../../../context/chatProvider";
import { getLoggedUser, watchObjectKeysValues } from "../../../../lib/utils.lb";

type FormValues = {
    chatName: string;
    userList: User[]
};

const GroupChatModal = ({ open, onClose, edit = false, chatDetails }: { open: boolean; onClose: () => void; edit: boolean; chatDetails?: Chat }) => {
    const { formState, handleSubmit, control, setValue, trigger, reset } = useForm<FormValues>({
        mode: "onSubmit",
        reValidateMode: "onChange",
        defaultValues: {
            chatName: '',
            userList: []
        }
    });
    const { errors, defaultValues } = formState;
    const { apiData: usersList, loading, apiRequestService } = useApiRequest()
    const { loading: groupLoading, apiRequestService: groupChatService } = useApiRequest()
    const { loading: deleteProgress, apiRequestService: deleteGroupChatService } = useApiRequest()
    const { fetchChats, changeCurrentChat } = useChatContext()
    const [selectedUsers, setSelectedUsers] = useState<User[]>([])
    const loggedUserId = getLoggedUser()

    useEffect(() => {
        if (edit && chatDetails) {
            reset({
                chatName: chatDetails.chatName,
                userList: chatDetails.users
            })
            setSelectedUsers(chatDetails.users.filter(c => c.id !== loggedUserId))
        }
    }, [chatDetails, edit])

    const handleGroupItem = (user: User) => {
        const member = selectedUsers.some(item => item.id === user.id)
        if (!member) {
            const newList = [...selectedUsers, user]
            setSelectedUsers(newList)
            setValue("userList", newList)
            trigger("userList")
        }
    }

    const handleDelete = (userId: string) => {
        const updatedList = selectedUsers.filter((sel) => sel.id !== userId)
        setSelectedUsers(updatedList)
        setValue("userList", updatedList)
        trigger("userList")
    }


    const handleSearch = async (e: any) => {
        const query = e.target.value
        if (!query) return
        return await apiRequestService<null, User[]>({
            url: `${AppConfig.endpoints.user}?search=${query}`,
            method: "get",
        });
    }

    const onSubmit = async (data: FormValues) => {
        const unChangedFieldKeys = watchObjectKeysValues(
            defaultValues as FormValues,
            data
        );
        let payload = {
            chatName: data.chatName,
            users: data.userList.map(item => item.id),
            chatId: chatDetails?.id
        }
        for (const val of unChangedFieldKeys) {
            if (val === 'userList') delete payload['users' as keyof typeof payload]
            else delete payload[val as keyof typeof payload];
        }
        if (!edit) {
            delete payload['chatId']
        }
        else if (edit && Array.isArray(payload.users)) {
            payload = {
                ...payload,
                users: [...payload.users, loggedUserId]
            }
        }
        const response = await groupChatService<{
            chatName: string;
            users: string[];
            chatId?: string
        }, Chat[]>({
            method: edit ? 'put' : 'post',
            url: AppConfig.endpoints.groupChats.create,
            body: payload
        })
        if (response?.success) {
            fetchChats();
            HandleClose()
        }
    }

    const handleDeleteGroup = async () => {
        await deleteGroupChatService<{
            chatId: string | undefined
        }, {}>({
            method: 'put',
            url: AppConfig.endpoints.groupChats.remove,
            body: {
                chatId: chatDetails?.id
            }
        })
        fetchChats();
        changeCurrentChat(undefined)
        HandleClose()
    }

    const HandleClose = () => {
        onClose()
        reset(defaultValues, { keepDefaultValues: true })
        setSelectedUsers(edit ? (chatDetails?.users ?? []).filter(c => c.id !== loggedUserId) : [])
    }

    return (
        <Modal size={"sm"} onClose={HandleClose} isOpen={open} isCentered>
            <ModalOverlay />
            <form onSubmit={handleSubmit(onSubmit)}>
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent="center"
                    >
                        {edit ? defaultValues?.chatName : "Create Group Chat"}
                    </ModalHeader>
                    <ModalBody display="flex" flexDir="column" alignItems="center">
                        <Controller
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Please enter the chat name",
                                },
                            }}
                            render={({ field: { onChange, value } }) => {
                                return (
                                    <FormControl isInvalid={Boolean(errors.chatName?.message)}>
                                        <TextInput
                                            label=""
                                            input={{
                                                placeholder: "Enter Chat Name",
                                                size: "md",
                                                onChange: onChange,
                                                value: value
                                            }}
                                            errorMsg={errors?.chatName?.message}
                                        />
                                    </FormControl>
                                )
                            }}
                            name="chatName"
                        />

                        <Controller
                            control={control}
                            rules={{
                                required: {
                                    value: true,
                                    message: "Please add users to the group",
                                },
                                validate: (val) => val.length < 2 ? 'atleast 2 member need to be added in a group' : true
                            }}
                            render={() => {
                                return (
                                    <FormControl isInvalid={Boolean(errors.userList?.message)}>
                                        <TextInput
                                            label=""
                                            input={{
                                                placeholder: "Add Users eg: John, Piyush, Jane",
                                                size: "md",
                                                mb: 1,
                                                onChange: handleSearch
                                            }}
                                            errorMsg={errors?.userList?.message}
                                        />
                                    </FormControl>
                                )
                            }}
                            name="userList"
                        />

                        <Box w="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((u) => (
                                <UserBadgeItem
                                    key={u.id}
                                    user={u}
                                    handleFunction={() => handleDelete(u.id)}
                                    admin={chatDetails?.groupAdmin?.id ?? ''}
                                />
                            ))}
                        </Box>
                        {loading && <Spinner m="auto" display="flex" />}
                        {usersList
                            ?.slice(0, 4)
                            .map((user: User) => (
                                <UserListItem
                                    key={user.id}
                                    user={user}
                                    handleFunction={() => handleGroupItem(user)}
                                />
                            ))}
                    </ModalBody>
                    <ModalFooter>
                        <Button type="submit" colorScheme="blue" mr={2} isLoading={groupLoading}>
                            {edit ? "Update Group" : "Create Group"}
                        </Button>
                        {edit && <Button colorScheme="red" isLoading={deleteProgress} onClick={handleDeleteGroup}>
                            Leave Group
                        </Button>}
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default GroupChatModal