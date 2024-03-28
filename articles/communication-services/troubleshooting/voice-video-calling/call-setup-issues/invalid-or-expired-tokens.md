---
title: Call setup issues - Invalid or expired tokens
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot token issues
author: enricohuang
ms.author: enricohuang

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Invalid or expired tokens
Invalid or expired tokens can prevent the ACS Calling SDK from accessing its service. To avoid this issue, your application must use a valid user access token.
Note that access tokens have an expiration time of 24 hours by default.
If necessary, you can adjust the lifespan of tokens issued for your application by creating a short-lived token.
However, if you have a long-running call that could exceed the lifetime of the token, you will need to implement refreshing logic in your application.

## How to detect
### SDK
When the application calls `createCallAgent` API, if the token is expired, SDK throws an error.
The error code/subcode is

| error            |                                                       |
|------------------|-------------------------------------------------------|
| code             | 401 (UNAUTHORIZED)                                    |
| subcode          | 40235                                                 |
| message          | AccessToken expired                                   |
| resultCategories | Expected                                              |

TODO: what is the behavior when token expires during the call

## How to monitor
### Azure log
...
### CDC
...

## How to mitigate or resolve
If you have a long-running call that could exceed the lifetime of the token, you will need to implement refreshing logic in your application.
For handling the token refresh, please see [Credentials in Communication SDKs](../../../concepts/credentials-best-practices.md)

If you encounter this error while creating callAgent, you need to review the token creation logic in your application.
