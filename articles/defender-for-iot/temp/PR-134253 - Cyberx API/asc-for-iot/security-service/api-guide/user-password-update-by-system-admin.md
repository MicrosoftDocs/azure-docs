---
title: User password update by system admin
description: Use this API to let system administrators change passwords for specified users.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# User password update by system admin

Use this API to let system administrators change passwords for specified users. CyberX Admin user roles can work with the API. You do not need a CyberX access token to use this API.

## /external/authentication/set_password_by_admin

### Method

**POST**

### Request type

**JSON**

### Request example

```rest
request:

{

    "username": "test",
    
    "password": "Test12345\!",
    
    "new_password": "Test54321\!"

}
```

### Response type

**JSON**

### Response content

Message string with the operation status details:

- *Success – msg*: password has been replaced

- *Failure – error*: user authentication failure

- *Failure – error*: user does not exist

- *Failure – error*: password doesn’t match security policy

- *Failure – error*: User does not have the permissions to change password

### Response example

```rest
response:

{

    "error": {
    
        "userDisplayErrorMessage": "The user 'test_user' doesn't exist",
        
        "internalSystemErrorMessage": "The user 'yoavfe' doesn't exist"
    
    }

}

```

### Asset fields

| **Name**        | **Type** | **Nullable** |
| --------------- | -------- | ------------ |
| admin_username | String   | No           |
| admin_password | String   | No           |
| username        | String   | No           |
| new_password   | String   | No           |