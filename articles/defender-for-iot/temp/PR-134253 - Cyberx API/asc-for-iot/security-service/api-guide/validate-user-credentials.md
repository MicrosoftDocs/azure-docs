---
title: Validate user credentials
description: Use this API to validate a CyberX username and password.
author: mlottner
ms.author: mlottner
ms.date: 08/31/2020
ms.topic: article
ms.service: azure
---

# Validate user credentials

Use this API to validate a CyberX username and password. All CyberX user roles can work with the API.

You do not need a CyberX access token to use this API.

## /api/external/authentication/validation

### Method

**POST**

### Request type

**JSON**

### Query params

| **Name** | **Type** | **Nullable** |
| -------- | -------- | ------------ |
| username | String   | No           |
| password | String   | No           |

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

- *Success* – msg: Authentication succeeded

- *Failure* – error: Credentials Validation Failed

### Response example

```rest
response:

{

    "msg": "Authentication succeeded."

}

```