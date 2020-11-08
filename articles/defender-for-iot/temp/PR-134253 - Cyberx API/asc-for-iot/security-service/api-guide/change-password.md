---
title: Change password
description: Use this API to let users to change their own passwords.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Change password

Use this API to let users to change their own passwords. All CyberX user roles can work with the API. You do not need a CyberX access token to use this API.

## /external/authentication/set_password

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

- *Failure – error*: password does not match security policy  

### Response example

```rest
response:

{

    "error": {
    
        "userDisplayErrorMessage": "User authentication failure"
    
    }

}

```

### Asset fields

| **Name**      | **Type** | **Nullable** |
| ------------- | -------- | ------------ |
| username      | String   | No           |
| password      | String   | No           |
| new_password | String   | No           |