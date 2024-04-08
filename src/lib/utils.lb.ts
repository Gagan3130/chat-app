import { User } from "../interfaces/types.lib";
import { AppConstants } from "./constants";

export const cookiesStore = {
  set: function ({
    key,
    value,
    path = "/",
  }: {
    key: string;
    value: string | Object | undefined;
    path?: string;
  }) {
    if (typeof document !== "undefined") {
      let expires = "";
      const date = new Date();
      date.setTime(date.getTime() + 365 * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
      document.cookie =
        key + "=" + (JSON.stringify(value) || "") + expires + "; path=" + path;
    }
  },
  get: function ({ key }: { key: string }) {
    if (typeof document !== "undefined") {
      let cookie = document.cookie.match(
        "(^|;)\\s*" + key + "\\s*=\\s*([^;]+)"
      );
      return cookie ? JSON.parse(cookie.pop() ?? "") : "";
    }
  },
  delete: function ({ key, path = "/" }: { key: string; path?: string }) {
    if (typeof document !== "undefined") {
      let expires = "";
      const date = new Date();
      date.setTime(date.getTime() + 0);
      expires = "; expires=" + date.toUTCString();
      document.cookie = key + "=" + "" + expires + "; path=" + path;
    }
  },
  deleteAll: function ({ path = "/" }: { path?: string }) {
    document.cookie.split(";").forEach(function (c) {
      let expires = "";
      const date = new Date();
      date.setTime(date.getTime() + 0);
      expires = "; expires=" + date.toUTCString();
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=" + expires + ";path=" + path);
    });
  },
};

export function configHeaders(binaryData: boolean) {
  const contentType = {
    "Content-Type": binaryData ? "multipart/form-data" : "application/json",
  };
  const { token } = cookiesStore.get({ key: AppConstants.cookieKeys.TOKEN });

  if (!token) return contentType;
  return {
    ...contentType,
    Authorization: `Bearer ${token}`,
  };
}

// export function debounce<ParamType, ReturnType>(
//   callBack: (param: ParamType) => ReturnType
// ) {
//   let inProgress = false;
//   let data: ParamType;
//   return async (param: ParamType) => {
//     if (!inProgress) {
//       inProgress = true;
//       data = param;
//       setTimeout(() => {
//         inProgress = false;
//         callBack(data);
//       }, 1000);
//     } else {
//       data = param;
//     }
//   };
// }

export const getLoggedUser = () => {
  const { id: userId } = cookiesStore.get({
    key: AppConstants.cookieKeys.TOKEN,
  });
  return userId;
};

export const getSender = (loggedUser: string, users: User[] = []) => {
  return users[0]?.id === loggedUser ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser: string, users: User[]) => {
  return users[0].id === loggedUser ? users[1] : users[0];
};

export const watchObjectKeysValues = <Q extends object>(
  obj1: Q,
  obj2: Q
): (string | null)[] => {
  const arr: string[] = [];
  for (const keys in obj1) {
    if (JSON.stringify(obj1[keys]) === JSON.stringify(obj2[keys])) {
      arr.push(keys);
    }
  }
  return arr;
};

export function getBackgroundColor(name: string): string {
  const hashCode = name
    .split("")
    .reduce(
      (acc, char) => char.charCodeAt(0) + (acc << 6) + (acc << 16) - acc,
      0
    );

  // Use the hash code to determine the hue
  const hue = Math.abs(hashCode % 360);

  // Set a constant saturation and lightness for simplicity
  const saturation = 50; // 0-100
  const lightness = 50; // 0-100

  // Return the HSL color string
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export const getChatTime = (dateTime: Date) => {
  const date = new Date(dateTime);
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
};

export const getMessageDay = (dateTime: Date) => {
  const date = new Date(dateTime);
  const todayDate = new Date();
  const diffDays = todayDate.getDate() - date.getDate();
  const diffMonths = todayDate.getMonth() - date.getMonth();
  const diffYears = todayDate.getFullYear() - date.getFullYear();
  if (diffYears === 0 && diffDays === 0 && diffMonths === 0) {
    return "Today";
  } else if (diffYears === 0 && diffDays === 1 && diffMonths === 0)
    return "Yesterday";
  else if (diffYears === 0 && diffMonths === 0 && diffDays < 7)
    return date.toLocaleDateString("en-IN", { weekday: "long" });
  else return date.toLocaleDateString();
};

export const chatLastTimeAndDay = (dateTime: Date) => {
  if(!dateTime) return ''
  const d = getMessageDay(dateTime);
  if (d === "Today") {
    return getChatTime(dateTime);
  } else return d;
};

export function debounce<ParamType, ReturnType>(
  callBack: (param: ParamType) => ReturnType, delay?: number
) {
  let inProgress = false;
  let data: ParamType;
  return async (param: ParamType) => {
    if (!inProgress) {
      inProgress = true;
      data = param;
      setTimeout(() => {
        inProgress = false;
        callBack(data);
      }, (delay ?? 1000));
    } else {
      data = param;
    }
  };
}

export const getSlicedSubstring = (str: string, sliceLength?: number) => {
  if (!sliceLength) {
    sliceLength = 50;
  }
  return str?.length > sliceLength
    ? str?.substring(0, sliceLength + 1) + "..."
    : str;
};
