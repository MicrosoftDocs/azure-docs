---
title: Authentication and password management API reference for on-premises management consoles - Microsoft Defender for IoT
description: Learn about the authentication and password management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.
ms.date: 06/13/2022
ms.topic: reference
---

# Authentication and password management API reference for on-premises management consoles

This article lists the authentication and password management REST APIs supported for Microsoft Defender for IoT on-premises management consoles.

Authentication and password management
Devices - inventory + includes connections, cves
Alerts - alerts and events, pcap
Vulnerabilities reports - all 4

## set_password (Change password)

Use this API to let users change their own passwords. All Defender for IoT user roles can work with the API.

You don't need a Defender for IoT access token to use this API.

**URI**: `/external/authentication/set_password`

**Method**: POST

# [Request](#tab/request-set-password)

**Type**: JSON

**Request example**:

```rest
request:

{

    "username": "test",

    "password": "Test12345\!",

    "new_password": "Test54321\!"

}

```

# [Response](#tab/response-set-password)

**Type**: JSON


Message string with the operation status details:

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: Password does not match security policy

**Response example**:

```rest
response:

{

    "error": {

        "userDisplayErrorMessage": "User authentication failure"

    }

}

```

**Device fields**:

| **Name** | **Type** | **Required / Optional** |
|--|--|--|
| **username** | String | Required |
| **password** | String | Required |
| **new_password** | String | Required |

# [Curl command](#tab/set-password-curl)

**Type**: POST

**API**:

```
curl -k -d '{"username": "<USER_NAME>","password": "<CURRENT_PASSWORD>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/external/authentication/set_password
```

**Example**:

```rest
curl -k -d '{"username": "myUser","password": "1234@abcd","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/external/authentication/set_password
```
---

## set_password_by_admin (User password update by system admin)

Use this API to let system administrators change passwords for specified users. Defender for IoT admin user roles can work with the API.

You don't need a Defender for IoT access token to use this API.

**URI**: /external/authentication/set_password_by_admin

### POST

# [Request](#tab/set-password-by-admin-request)

**Type**: JSON

**Request example**:

```rest
request:

{

    "username": "test",

    "password": "Test12345\!",

    "new_password": "Test54321\!"

}
```

# [Response](#tab/set-password-by-admin-response)

**Type**: JSON

Message string with the operation status details:

- **Success – msg**: Password has been replaced

- **Failure – error**: User authentication failure

- **Failure – error**: User does not exist

- **Failure – error**: Password doesn't match security policy

- **Failure – error**: User does not have the permissions to change password

**Response example**

```rest
response:

{

    "error": {

        "userDisplayErrorMessage": "The user 'test_user' doesn't exist",

        "internalSystemErrorMessage": "The user 'yoavfe' doesn't exist"

    }

}

```

**Device fields**

| **Name** | **Type** | **Required / Optional** |
|--|--|--|
| **admin_username** | String | Required |
| **admin_password** | String | Required |
| **username** | String | Required |
| **new_password** | String | Required |

# [Curl command](#tab/set-password-by-admin-curl)

**Type**: POST

**API**:

```rest
curl -k -d '{"admin_username":"<ADMIN_USERNAME>","admin_password":"<ADMIN_PASSWORD>","username": "<USER_NAME>","new_password": "<NEW_PASSWORD>"}' -H 'Content-Type: application/json'  https://<IP_ADDRESS>/external/authentication/set_password_by_admin
```

**Example**:

```rest
curl -k -d '{"admin_user":"adminUser","admin_password": "1234@abcd","username": "myUser","new_password": "abcd@1234"}' -H 'Content-Type: application/json'  https://127.0.0.1/external/authentication/set_password_by_admin
```
---


## validation (Authenticate user credentials)

Use this API to validate user credentials. All Defender for IoT user roles can work with the API. You don't need a Defender for IoT access token to use this API.

**URI**: `/external/authentication/validation`

### POST

# [Request](#tab/validation-request)

**Type**: JSON

**Request example**:

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

- **Success – msg**: Authentication succeeded

- **Failure – error**: Credentials Validation Failed

**Device fields**:

| **Name** | **Type** | **Required / Optional** |
|--|--|--|
| **username** | String | Required |
| **password** | String | Required |

**Response example**:

```rest
response:

{

    "msg": "Authentication succeeded."

}
```

# [Curl command](#tab/validation-curl)

**Type**: POST

**APIs**:

```rest
curl -k -d '{"username":"<USER_NAME>","password":"PASSWORD"}' 'https://<IP_ADDRESS>/external/authentication/validation'
```

**Example**:

```rest
curl -k -d '{"username":"myUser","password":"1234@abcd"}' 'https://127.0.0.1/external/authentication/validation
```
---

<!--need to find another place for this - it doesn't belong in API
## QRadar alerts

QRadar integration helps you to identify and action alerts generated by Defender for IoT. QRadar receives the data from Defender for IoT, and then contacts the public API on-premises management console.

To send the data discovered by Defender for IoT to QRadar, define a forwarding rule in the Defender for IoT system and select the **Remote support alert handling** option. With this option selected, the following additional fields appear in QRadar:

- **UUID**: Unique alert identifier, such as 1-1555245116250.

- **Site**: The site where the alert was discovered.

- **Zone**: The zone where the alert was discovered.

For example:

```rest
<9>May 5 12:29:23 sensor_Agent LEEF:1.0|CyberX|CyberX platform|2.5.0|CyberX platform Alert|devTime=May 05 2019 15:28:54 devTimeFormat=MMM dd yyyy HH:mm:ss sev=2 cat=XSense Alerts title=Device is Suspected to be Disconnected (Unresponsive) score=81 reporter=192.168.219.50 rta=0 alertId=6 engine=Operational senderName=sensor Agent UUID=5-1557059334000 site=Site zone=Zone actions=handle dst=192.168.2.2 dstName=192.168.2.2 msg=Device 192.168.2.2 is suspected to be disconnected (unresponsive).
```
-->


## Next steps

For more information, see the [Defender for IoT API reference overview](references-work-with-defender-for-iot-apis.md).
