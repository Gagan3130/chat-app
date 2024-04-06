import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/layout";
import { User } from "../../../interfaces/types.lib";

type propType = {
    user: User;
    handleFunction: ()=>void;
    admin: string
}

const UserBadgeItem = (props: propType) => {
    const { user, handleFunction, admin } = props
    return (
        <Badge
            px={2}
            py={1}
            borderRadius="lg"
            m={1}
            mb={2}
            variant="solid"
            fontSize={12}
            colorScheme="purple"
            cursor="pointer"
        >
            {user.name}
            {admin === user.id && <span> (Admin)</span>}
            <CloseIcon pl={1} onClick={handleFunction} />
        </Badge>
    );
};

export default UserBadgeItem;