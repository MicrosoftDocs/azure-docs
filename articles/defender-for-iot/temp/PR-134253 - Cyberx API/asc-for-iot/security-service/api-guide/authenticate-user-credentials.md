---
title: Authenticate user credentials
description: Use this API to validate user credentials.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Authenticate user credentials

Use this API to validate user credentials. All CyberX user roles can work with the API. You do not need a CyberX access token to use this API.

## /external/authentication/validation

### Method

**POST**

### Request type

**JSON**

### Request example

```rest
request:

{

    "username": "test",

    "password": "Test12345\!"

}
```

### Response type

**JSON**

### Response content

Message string with the operation status details:

- *Success – msg*: Authentication succeeded

- *Failure – error*: Credentials Validation Failed

### Asset fields

| **Name** | **Type** | **Nullable** |
| -------- | -------- | ------------ |
| username | String   | No           |
| password | String   | No           |

### Response example

```rest
response:

{

    "msg": "Authentication succeeded."

}
```