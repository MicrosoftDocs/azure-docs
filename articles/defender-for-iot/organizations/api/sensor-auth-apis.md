---
title: Authentication and password management API reference for OT monitoring sensors - Microsoft Defender for IoT
description: Learn about the authentication and password management REST APIs supported for Microsoft Defender for IoT OT monitoring sensors.
ms.date: 06/13/2022
ms.topic: reference
---

# Authentication and password management API reference for OT monitoring sensors

This article lists the authentication and password management APIs supported for Defender for IoT OT sensors.

## set_password (Change your password)

Use this API to let users change their own passwords.

You don't need a Defender for IoT access token to use this API.

**URI**: `/external/authentication/set_password`

### POST

# [Request](#tab/set-password-request)

**Type**: JSON

**Example**:

```rest
request:

{
    "username": "test",
    "password": "Test12345\!",
    "new_password": "Test54321\!"
}
```

#### Request parameters

| **Name** | **Type** | **Required / Optional** |
|--|--|--|
| **username** | String | Required |
| **password** | String | Required |
| **new_password** | String | Required |

# [Response](#tab/set-password-response)


**Type**: JSON

Message string with the operation status details:

|Message  |Description  |
|---------|---------|
|**Success – msg**     |   Password has been replaced      |
|**Failure – error**     |   User authentication failure      |
|**Failure – error**     |   Password does not match security policy      |


**Example**:

```rest
response:

{
    "error": {
        "userDisplayErrorMessage": "User authentication failure"
    }
}
```

# [cURL command](#tab/set-password-curl)

**Type**: POST

**API**:

```rest
curl -k -X POST -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password
```

**Example**:

```rest
curl -k -X POST -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/api/external/authentication/set_password
```

---

## set_password_by_admin (Update a user password by admin)

Use this API to let system administrators change passwords for specified users. Defender for IoT administrator user roles can work with the API.

You don't need a Defender for IoT access token to use this API.

**URI**: `/external/authentication/set_password_by_admin`

### POST

# [Request](#tab/set-password-by-admin-request)

**Type**: JSON

#### Request example

```rest
request:

{
    "admin_username": "admin",
    "admin_password: "Test0987"
    "username": "test",
    "new_password": "Test54321\!"
}
```

#### Request parameters

| **Name** | **Type** | **Required / Optional** |
|--|--|--|
| **admin_username** | String | Required |
| **admin_password** | String | Required |
| **username** | String | Required |
| **new_password** | String | Required |

# [Response](#tab/set-password-by-admin-response)

**Type**: JSON

Message string with the operation status details:

|Message  |Description  |
|---------|---------|
|**Success – msg**     |   Password has been replaced      |
|**Failure – error**     |   User authentication failure      |
|**Failure – error**     |  User does not exist       |
|**Failure – error**     | Password doesn't match security policy        |
|**Failure – error**     |  User does not have the permissions to change password       |

#### Response example

```rest
response:

{
    "error": {
        "userDisplayErrorMessage": "The user 'test_user' doesn't exist",
        "internalSystemErrorMessage": "The user 'test_user' doesn't exist"
    }
}

```
# [cURL command](#tab/set-password-by-admin-curl)


**Type**: POST

**API**:

```rest
curl -k -X POST -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/api/external/authentication/set_password_by_admin
```

**Example**:

```rest
curl -k -X POST -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/api/external/authentication/set_password_by_admin
```

---


## validation (Validate user credentials)

Use this API to validate a Defender for IoT username and password.

You don't need a Defender for IoT access token to use this API.

**URI**: `/api/external/authentication/validation`

### POST

# [Request](#tab/validation-request)

**Request type**: JSON

#### Query parameters

| **Name** | **Type** | **Required/Optional** |
|--|--|--|
| **username** | String | Required |
| **password** | String | Required |

#### Request example:

```rest
request:
{
    "username": "test",
    "password": "Test12345\!"
}
```

# [Response](#tab/validation-response)

**Type**: JSON

Message string with the operation status details:

|Message  |Description  |
|---------|---------|
|**Success - msg**     |  Authentication succeeded       |
|**Failure - error**     |  Credentials validation failed       |

#### Response example

```rest
response:
{
    "msg": "Authentication succeeded."
}
```

# [cURL command](#tab/validation-curl)

**Type**: POST

**API**:

```rest
curl -k -X POST -H "Authorization: <AUTH_TOKEN>" -H "Content-Type: application/json" -d '{"username": <USER NAME>, "password": <PASSWORD>}' https://<IP_ADDRESS>/api/external/authentication/validation
```

**Example**:

```rest
curl -k -X POST -H "Authorization: 1234b734a9244d54ab8d40aedddcabcd" -H "Content-Type: application/json" -d '{"username": "test", "password": "test"}' https://127.0.0.1/api/external/authentication/validation
```
---

## Next steps

For more information, see the [Defender for IoT API reference overview](../references-work-with-defender-for-iot-apis.md).
