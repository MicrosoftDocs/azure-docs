---
title: Support of Azure AD for custom Teams endpoint
titleSuffix: An Azure Communication Services concept document
description: This article discusses the supported features of Azure AD for a custom Teams endpoint.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---
# Available Azure Active Directory features

[!INCLUDE [Public Preview](../includes/public-preview-include-document.md)]

Teams user utilizing custom Teams calling experience are authenticating against their Azure Active Directory tenant. This tenant can have configured security features for the user based and the applicaiton. The following table shows availability of the features for custom Teams calling experience:

|Category                     | Azure Active Directory capability                                                    | Supported  |
|-----------------------------|--------------------------------------------------------------------------------------|------------|
|Authentication               | Multi-factor authentication                                                          |   ✔️      |
|                             | Single-Sign-on                                                                       |   ❌      |
|                             | Conditional access                                                                   |   ❌      |
|                             | Passwordless                                                                         |   ✔️      |
|                             | Microsoft Authenticator app                                                          |   ✔️      |
|Identity                     | Azure AD user                                                                        |   ✔️      |
|                             | Managed identities                                                                   |   ✔️      |
|                             | External identities                                                                  |   ❌      |
|Logs                         | Audit logs                                                                           |   ✔️      |
|                             | Sign-in logs                                                                         |   ✔️      |
|Devices                      | Managed devices                                                                      |   ✔️      |
|Application security         | Tenant restrictions                                                                  |   ✔️      |
|Continuous access evaluation | Critical event evaluation                                                            |   ✔️      |
|                             | Conditional Access policy                                                            |   ✔️      |
|                             | Client-side claim challenge                                                          |   ✔️      |
|                             | IP address enforcement                                                               |   ✔️      |


## Next steps

The following articles might be of interest to you:

- Learn more about [custom Teams endpoint authentication](./custom-teams-endpoint-authentication-overview.md).
- Try [quickstart for authentication of Teams users](../../quickstarts/manage-teams-identity.md).
- Try [quickstart for calling to a Teams user](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).
