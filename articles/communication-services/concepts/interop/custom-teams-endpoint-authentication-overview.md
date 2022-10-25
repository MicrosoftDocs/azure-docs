---
title: Authentication for apps with Teams users
description: Explore single-tenant and multi-tenant authentication use cases for applications supporting Teams users. Also learn about authentication artifacts.
author: tomaschladek
manager: nmurav
services: azure-communication-services
ms.author: tchladek
ms.date: 06/08/2022
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
ms.custom: kr2b-contr-experiment
---

# Single-tenant and multi-tenant authentication for Teams users

 This article gives you insight into the authentication process for single-tenant and multi-tenant, *Azure Active Directory* (Azure AD) applications. You can use authentication when you build calling experiences for Teams users with the *Calling software development kit* (SDK) that *Azure Communication Services* makes available. Use cases in this article also break down individual authentication artifacts.

## Case 1: Example of a single-tenant application
The Fabrikam company has built a custom, Teams calling application for internal company use. All Teams users are managed by Azure Active Directory. Access to Azure Communication Services is controlled by *Azure role-based access control (Azure RBAC)*.


![A diagram that outlines the authentication process for Fabrikam's calling application for Teams users and its Azure Communication Services resource.](./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac-overview.svg)

The following sequence diagram details single-tenant authentication.

:::image type="content" source="./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac.svg" alt-text="A sequence diagram that details authentication of Fabrikam Teams users. The client application gets an Azure Communication Services access token for a single tenant Azure A D application." lightbox="./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac.svg":::

Before we begin:
- Alice or her Azure AD administrator needs to give the custom Teams application consent, prior to the first attempt to sign in. Learn more about [consent](../../../active-directory/develop/consent-framework.md).
- The Azure Communication Services resource admin needs to grant Alice permission to perform her role. Learn more about [Azure RBAC role assignment](../../../role-based-access-control/role-assignments-portal.md).

Steps:
1. Authenticate Alice using Azure Active Directory: Alice is authenticated using a standard OAuth flow with *Microsoft Authentication Library (MSAL)*. If authentication is successful, the client application receives an Azure AD access token, with a value of 'A1' and an Object ID of an Azure AD user with a value of 'A2'. Tokens are outlined later in this article. Authentication from the developer perspective is explored in this [quickstart](../../quickstarts/manage-teams-identity.md).
1. Get an access token for Alice: The application for Teams users performs control plane logic, using artifacts 'A1', 'A2' and 'A3'. This produces Azure Communication Services access token 'D' and gives Alice access. This access token can also be used for data plane actions in Azure Communication Services, like Calling.
1. Call Bob: Alice makes a call to Teams user Bob, with Fabrikam's app. The call takes place via the Calling SDK with an Azure Communication Services access token. Learn more about [developing custom Teams clients](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).

Artifacts:
- Artifact A1
  - Type: Azure AD access token
  - Audience: _`Azure Communication Services`_ — control plane
  - Azure AD application ID: Fabrikam's _`Azure AD application ID`_
  - Permissions: _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_, _`https://auth.msft.communication.azure.com/Teams.ManageChats`_
- Artifact A2
  - Type: Object ID of an Azure AD user
  - Azure AD application ID: Fabrikam's _`Azure AD application ID`_
- Artifact A3
  - Type: Azure AD application ID
  - Azure AD application ID: Fabrikam's _`Azure AD application ID`_
- Artifact D
  - Type: Azure Communication Services access token
  - Audience: _`Azure Communication Services`_ — data plane
  - Azure Communication Services Resource ID: Fabrikam's _`Azure Communication Services Resource ID`_
  
## Case 2: Example of a multi-tenant application
The Contoso company has built a custom Teams calling application for external customers. This application uses custom authentication within Contoso's own infrastructure. Contoso uses a connection string to retrieve tokens from Fabrikam's application.

![A sequence diagram that demonstrates how the Contoso application authenticates Fabrikam users with Contoso's own Azure Communication Services resource.](./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac-overview.svg)

The following sequence diagram details multi-tenant authentication.

:::image type="content" source="./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac.svg" alt-text="A sequence diagram that details authentication of Teams users and Azure Communication Services access tokens for multi-tenant Azure AD applications." lightbox="./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac.svg":::

Before we begin:
- Alice or her Azure AD administrator needs to give Contoso's Azure Active Directory application consent before the first attempt to sign in. Learn more about [consent](../../../active-directory/develop/consent-framework.md).

Steps:
1. Authenticate Alice using the Fabrikam application: Alice is authenticated through Fabrikam's application. A standard OAuth flow with Microsoft Authentication Library (MSAL) is used. If authentication is successful, the client application, the Contoso app in this case, receives an Azure AD access token with a value of 'A1' and an Object ID of an Azure AD user with a value of 'A2'. Token details are outlined below. Authentication from the developer perspective is explored in this [quickstart](../../quickstarts/manage-teams-identity.md).
1. Get an access token for Alice: The Contoso application performs control plane logic, using artifacts 'A1', 'A2' and 'A3'. This generates Azure Communication Services access token 'D' for Alice within the Contoso application. This access token can be used for data plane actions in Azure Communication Services, like Calling.
1. Call Bob: Alice makes a call to Teams user Bob, with Fabrikam's application. The call takes place via the Calling SDK with an Azure Communication Services access token. Learn more about developing custom, Teams apps [in this quickstart](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).


Artifacts:
- Artifact A1
  - Type: Azure AD access token
  - Audience: Azure Communication Services — control plane
  - Azure AD application ID: Contoso's _`Azure AD application ID`_
  - Permission: _`https://auth.msft.communication.azure.com/Teams.ManageCalls`_, _`https://auth.msft.communication.azure.com/Teams.ManageChats`_
- Artifact A2
  - Type: Object ID of an Azure AD user
  - Azure AD application ID: Fabrikam's _`Azure AD application ID`_
- Artifact A3
  - Type: Azure AD application ID
  - Azure AD application ID: Contoso's _`Azure AD application ID`_
- Artifact B
  - Type: Custom Contoso authentication artifact
- Artifact C
  - Type: Hash-based Message Authentication Code (HMAC) (based on Contoso's _`connection string`_)
- Artifact D
  - Type: Azure Communication Services access token
  - Audience: _`Azure Communication Services`_ — data plane
  - Azure Communication Services Resource ID: Contoso's _`Azure Communication Services Resource ID`_

## Next steps

The following articles may be of interest to you:

- Learn more about [authentication](../authentication.md).
- Try this [quickstart to authenticate Teams users](../../quickstarts/manage-teams-identity.md).
- Try this [quickstart to call a Teams user](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).
