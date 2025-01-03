import { EditUserFields } from "@/components/pages/ProfilePage/EditProfileForm/EditProfileForm";
import { UserDB } from "dataTypes";

const endpoint = import.meta.env.VITE_HTTP_MONGO_SERVER;

type checkUserType = {
  uid: string;
};

export type AvatarPayload = {
  avatarUrl: string;
  id: string;
};

export type FindUserPayload = {
  value: string;
};

export function checkUser(payload: checkUserType) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/exists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

export function registerUser(payload: UserDB) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

//  Delete user -- USES THE GOOGLE-AUTH UID
export function deleteUser(id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/${id}`, {
      method: "DELETE",
    })
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

export function updateUser(payload: EditUserFields, id: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resolve(resp))
      .catch((err) => reject(err));
  });
}

export function updateAvatar(payload: AvatarPayload) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/${payload.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resolve(resp))
      .catch((err) => reject(err));
  });
}

export function getAllUsers() {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data.users))
      .catch((err) => reject(err));
  });
}

export function findUser(searchValue: string) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/find-user/${searchValue}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

type chatUsersPayload = {
  users: string[];
};

export function getChatUsers(payload: chatUsersPayload) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/get-chat-users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}

export type ChangeEmailPrivatePayload = {
  userId: string;
  value: boolean;
};

export function changeEmailSetting(payload: ChangeEmailPrivatePayload) {
  return new Promise((resolve, reject) => {
    fetch(`${endpoint}/users/change-email-privacy`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((resp) => resp.json())
      .then((data) => resolve(data))
      .catch((err) => reject(err));
  });
}
