---
title: Authentication of custom Teams endpoint
titleSuffix: An Azure Communication Services concept document
description: This article discusses authentication of a custom Teams endpoint.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Authentication flow cases

Azure Communication Services provides developers the ability to build custom Teams calling experience with Communication Services calling software development kit (SDK). This article provides insights into the process of authentication and describes individual authentication artifacts. In the following use cases, we'll demonstrate authentication for single and multi-tenant Azure Active Directory (Azure AD) applications.

## Case 1: Single-tenant application
The following scenario shows an example of the company Fabrikam, which has built custom Teams calling application for internal use within a company. All Teams users are managed by Azure Active Directory. The access to the Azure Communication Services is controlled via Azure role-based access control (Azure RBAC).


![Diagram of the process for authenticating Teams user for accessing Fabrikam client application and Fabrikam Azure Communication Services resource.](./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac-overview.svg)

The following sequence diagram is showing detailed steps of the authentication:

:::image type="content" source="./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac.svg" alt-text="Sequence diagram is describing detailed set of steps, that happens to authenticate Teams user. In the end, client application retrieves an Azure Communication Services access token for single tenant Azure AD application." lightbox="./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac.svg":::

Prerequisites:
- Alice or her Azure AD Administrator needs to provide consent to the Fabrikam's Azure Active Directory Application before first sign in. To learn more about [consent flow](../../../active-directory/develop/consent-framework.md).
- The admin of the Azure Communication Services resource must grant Alice permission to perform this action. You can learn about the [Azure RBAC role assignment](../../../role-based-access-control/role-assignments-portal.md).

Steps:
1. Authentication of Alice from Fabrikam against Fabrikam's Azure Active Directory: This step is standard OAuth flow leveraging Microsoft Authentication Library (MSAL) to authenticate against Fabrikam's Azure Active Directory. Alice is authenticating for Fabrikam's Azure AD application. If the authentication of Alice is successful, Fabrikam's Client application receives Azure AD access token 'A'. Details of the token are captured below. Developer experience is captured in the [quickstart](../../quickstarts/manage-teams-identity.md). 
1. Get access token for Alice: This flow is initiated from the Fabrikam's Client application and performs control plane logic authorized by artifact 'A' to retrieve Fabrikam's Azure Communication Services access token 'D' for Alice. Details of the token are captured below. This access token can be used for data plane actions in Azure Communication Services such as calling. Developer experience is captured in the [quickstart](../../quickstarts/manage-teams-identity.md). 
1. Start a call to Bob from Fabrikam: Alice is using Azure Communication Services access token to make a call to Teams user Bob via Communication Services calling SDK. You can learn more about the [developer experience in the quickstart](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).

Artifacts:
- Artifact A
  - Type: Azure AD access token
  - Audience: _`Azure Communication Services`_ — control plane
  - Azure AD application ID: Fabrikam's _`Azure AD application ID`_
  - Permission: _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_
- Artifact D
  - Type: Azure Communication Services access token
  - Audience: _`Azure Communication Services`_ — data plane
  - Azure Communication Services Resource ID: Fabrikam's _`Azure Communication Services Resource ID`_
  
## Case 2: Multi-tenant application
The following scenario shows an example of company Contoso, which has built custom Teams calling application for external customers, such as the company Fabrikam. Contoso infrastructure uses custom authentication within the Contoso infrastructure. Contoso infrastructure is using a connection string to retrieve the token for Fabrikam's Teams user.

![Diagram of the process for authenticating Fabrikam Teams user for accessing Contoso client application and Contoso Azure Communication Services resource.](./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac-overview.svg)

The following sequence diagram is showing detailed steps of the authentication:

:::image type="content" source="./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac.svg" alt-text="Sequence diagram is describing detailed set of steps, that happens to authenticate Teams user and retrieve Azure Communication Services access token for multi-tenant Azure AD application." lightbox="./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac.svg":::

Prerequisites:
- Alice or her Azure AD Administrator needs to provide consent to the Contoso's Azure Active Directory Application before first sign in. To learn more about [consent flow](../../../active-directory/develop/consent-framework.md).

Steps:
1. Authentication of Alice from Fabrikam against Fabrikam's Azure Active Directory: This step is standard OAuth flow using Microsoft Authentication Library (MSAL) to authenticate against Fabrikam's Azure Active Directory. Alice is authenticating for Contoso's Azure AD application. If the authentication of Alice is successful, Contoso's Client application receives Azure AD access token 'A'. Details of the token are captured below. Developer experience is captured in the [quickstart](../../quickstarts/manage-teams-identity.md). 
1. Get access token for Alice: This flow is initiated from Contoso's client application and performs control plane logic authorized by artifact 'A' to retrieve Contoso's Azure Communication Services access token 'D' for Alice.  Details of the token are captured below. This access token can be used for data plane actions in Azure Communication Services such as calling. Developer experience is captured in the [quickstart](../../quickstarts/manage-teams-identity.md). (https://docs.microsoft.com/azure/role-based-access-control/role-assignments-portal).
1. Start a call to Bob from Fabrikam: Alice is using Azure Communication Services access token to make a call to Teams user Bob via Communication Services calling SDK. You can learn more about the [developer experience in the quickstart](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).


Artifacts:
- Artifact A
  - Type: Azure AD access token
  - Audience: Azure Communication Services — control plane
  - Azure AD application ID: Contoso's _`Azure AD application ID`_
  - Permission: _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_
- Artifact B
  - Type: Custom Contoso authentication artifact
- Artifact C
  - Type: Hash-based Message Authentication Code (HMAC) (based on Contoso's _`connection string`_)
- Artifact D
  - Type: Azure Communication Services access token
  - Audience: _`Azure Communication Services`_ — data plane
  - Azure Communication Services Resource ID: Contoso's _`Azure Communication Services Resource ID`_

## Next steps

The following articles might be of interest to you:

- Learn more about [authentication](../authentication.md).
- Try [quickstart for authentication of Teams users](../../quickstarts/manage-teams-identity.md).
- Try [quickstart for calling to a Teams user](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).