---
title: Call setup issues - Failed to create CallAgent
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot failed to create CallAgent.
author: sloanster
ms.author: micahvivion

services: azure-communication-services
ms.date: 04/10/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Failed to create CallAgent

In order to make or receive a call, a user needs a call agent (`CallAgent`).
To create a call agent, the application needs a valid ACS communication token credential. With the token, the application invokes `CallClient.createCallAgent` API to create an instance of `CallAgent`.
It's important to note that multiple call agents aren't currently supported in one `CallClient` object.

## How to detect errors

The `CallClient.createCallAgent` API throws an error if SDK detects an error when creating a call agent.

The possible error code/subcode are

|Code                         | Subcode| Message      | Error category|
|-----------------------------|------- |--------------|---------------|
| 409 (Conflict)              |  40228 | Failed to create CallAgent, an instance of CallAgent associated with this identity already exists. | ExpectedError|
| 408 (Request Timeout)       | 40104 | Failed to create CallAgent, timeout during initialization of the calling user stack.| UnexpectedClientError|
| 500 (Internal Server Error) | 40216 | Failed to create CallAgent.| UnexpectedClientError |
| 401 (Unauthorized)          | 44110 | Failed to get AccessToken | UnexpectedClientError |
| 408 (Request Timeout)       | 40114 | Failed to connect to Azure Communication Services infrastructure, timeout during initialization. | UnexpectedClientError |
| 403 (Forbidden)             | 40229 | CallAgent must be created only with ACS token | ExpectedError |
| 408 (Request Timeout)       | 40114 | Failed to connect to Azure Communication Services infrastructure, timeout during initialization. | UnexpectedClientError |
| 403 (Forbidden)             | 40229 | CallAgent must be created only with ACS token | ExpectedError | 
| 412 (Precondition Failed)   | 40115 | Failed to create CallAgent, unable to initialize connection to Azure Communication Services infrastructure.| UnexpectedClientError |
| 403 (Forbidden)             | 40231 | TeamsCallAgent must be created only with Teams token | ExpectedError |
| 401 (Unauthorized)          | 44114 | Wrong AccessToken scope format. Scope is expected to be a string that contains `voip` | ExpectedError | 
| 400 (Bad Request)           | 44214 | Teams users can't set display name. | ExpectedError | 
| 500 (Internal Server Error) | 40102 | Failed to create CallAgent, failure during initialization of the calling base stack.| UnexpectedClientError |

## How to mitigate or resolve

The application should catch errors thrown by `createCallAgent` API and display a warning message.
Depending on the reason for the error, the application may need to retry the operation or fix the error before proceeding.
In general, if the error category is `UnexpectedClientError`, it's still possible to create a call agent successfully after a retry.
However, if the error category is `ExpectedError`, there may be errors in the precondition or the data passed in the parameter that need to be fixed on application's side before a call agent can be created.
