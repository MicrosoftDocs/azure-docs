---
title: Call setup issues - Invalid or expired tokens
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot token issues.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 04/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Invalid or expired tokens
Invalid or expired tokens can prevent the ACS Calling SDK from accessing its service. To avoid this issue, your application must use a valid user access token.
It's important to note that access tokens have an expiration time of 24 hours by default.
If necessary, you can adjust the lifespan of tokens issued for your application by creating a short-lived token.
However, if you have a long-running call that could exceed the lifetime of the token, you need to implement refreshing logic in your application.

## How to detect using the SDK
When the application calls `createCallAgent` API, if the token is expired, SDK throws an error.
The error code/subcode is

| error            | Details                                               |
|------------------|-------------------------------------------------------|
| code             | 401 (UNAUTHORIZED)                                    |
| subcode          | 40235                                                 |
| message          | AccessToken expired                                   |

When the signaling layer detects the access token expiry, it might change its connection state.
The application can subscribe to the [connectionStateChanged](/javascript/api/azure-communication-services/%40azure/communication-calling/callagent#@azure-communication-calling-callagent-on-2) event. If the connection state changes due to the token expiry, you can see the `reason` field in the `connectionStateChanged` event is `invalidToken`.

## How to mitigate or resolve
If you have a long-running call that could exceed the lifetime of the token, you need to implement refreshing logic in your application.
For handling the token refresh, see [Credentials in Communication SDKs](../../../../concepts/credentials-best-practices.md).

If you encounter this error while creating callAgent, you need to review the token creation logic in your application.
