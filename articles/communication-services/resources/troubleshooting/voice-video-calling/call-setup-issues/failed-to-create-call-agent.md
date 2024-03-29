---
title: Call setup issues - Failed to create CallAgent
titleSuffix: Azure Communication Services - Troubleshooting Guide
description: Learn how to troubleshoot failed to create CallAgent.

services: azure-communication-services
ms.date: 02/24/2024
ms.topic: troubleshooting
ms.service: azure-communication-services
ms.subservice: calling
---

# Failed to create CallAgent
For a user to make or receive a call, they need a call agent.
To create a call agent, the application needs a valid ACS communication token credential and invokes `CallClient.createCallAgent` API.
It's important to note that multiple call agents aren't currently supported in one `CallClient` object.

## How to detect
### SDK
The `CallClient.createCallAgent` API throws an error if SDK detects an error when creating a call agent.

The possible error code/subcode are

| error            |                                                       |
|------------------|-------------------------------------------------------|
| code             | 409 (Conflict)                                        |
| subcode          | 40228                                                 |
| message          | Failed to create CallAgent, an instance of CallAgent associated with this identity already exists.|
| resultCategories | ExpectedError                                         |
| error            |                                                       |
| code             | 408 (Request Timeout)                                 |
| subcode          | 40104                                                 |
| message          | Failed to create CallAgent, timeout during initialization of the calling user stack.|
| resultCategories | UnexpectedClientError                                 |
| error            |                                                       |
| code             | 500 (Internal Server Error)                           |
| subcode          | 40216                                                 |
| message          | Failed to create CallAgent.                           |
| resultCategories | UnexpectedClientError                                 |
| error            |                                                       |
| code             | 401 (Unauthorized)                                    |
| subcode          | 44110                                                 |
| message          | Failed to get AccessToken                             |
| resultCategories | UnexpectedClientError                                 |
| error            |                                                       |
| code             | 408 (Request Timeout)                                 |
| subcode          | 40114                                                 |
| message          | Failed to connect to Azure Communication Services infrastructure, timeout during initialization.|
| resultCategories | UnexpectedClientError                                 |
| error            |                                                       |
| code             | 403 (Forbidden)                                       |
| subcode          | 40229                                                 |
| message          | CallAgent must be created only with ACS token         |
| resultCategories | ExpectedError                                         |
| error            |                                                       |
| code             | 412 (Precondition Failed)                             |
| subcode          | 40115                                                 |
| message          | Failed to create CallAgent, unable to initialize connection to Azure Communication Services infrastructure.|
| resultCategories | UnexpectedClientError                                 |
| error            |                                                       |
| code             | 403 (Forbidden)                                       |
| subcode          | 40231                                                 |
| message          | TeamsCallAgent must be created only with Teams token  |
| resultCategories | ExpectedError                                         |
| error            |                                                       |
| code             | 401 (Unauthorized)                                    |
| subcode          | 44114                                                 |
| message          | Wrong AccessToken scope format. Scope is expected to be a string that contains `voip` |
| resultCategories | ExpectedError                                         |
| error            |                                                       |
| code             | 400 (Bad Request)                                     |
| subcode          | 44214                                                 |
| message          | Display name is not allowed to be set for Teams users.|
| resultCategories | ExpectedError                                         |
| error            |                                                       |
| code             | 500 (Internal Server Error)                           |
| subcode          | 40102                                                 |
| message          | Failed to create CallAgent, failure during initialization of the calling base stack.|
| resultCategories | UnexpectedClientError                                 |

## How to mitigate or resolve
The application should catch an error thrown by createCallAgent API and display a warning message.
Depending on the reason for the error, the application may need to retry the operation or fix the error before proceeding.
In general, if the result category is `UnexpectedClientError`, it's still possible to create a call agent successfully after a retry.
However, if the result category is `ExpectedError`, there may be errors in the precondition or the data passed in the parameter that need to be fixed on application's side before a call agent can be created.

