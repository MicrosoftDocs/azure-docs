---
title: Authentication for customized Teams apps
description: Explore single-tenant and multi-tenant authentication use cases for customized Teams applications. Also learn about authentication artifacts.
author: tomaschladek
manager: nmurav
services: azure-communication-services

ms.author: tchladek
ms.date: 06/30/2021
ms.topic: conceptual
ms.service: azure-communication-services
ms.subservice: teams-interop
---

# Single-tenant and multi-tenant authentication flow for Teams

You can build customized Teams calling experiences with the *Calling software development kit* (SDK) that *Azure Communication Services* makes available.This article gives you insight into the authentication process for single-tenant and multi-tenant, *Azure Active Directory* (Azure AD) applications. The use cases in this article also break down individual authentication artifacts.

## Case 1: Example of a single-tenant application
The Fabrikam company has built a custom, Teams calling application for internal company use. All Teams users are managed by Azure Active Directory. Access to Azure Communication Services is controlled by *Azure role-based access control (Azure RBAC)*.


![A diagram that outlines the authentication process for Fabrikam;s customized Teams calling application and its Azure Communication Services resource.](./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac-overview.svg)

The following sequence diagram details single-tenant authentication:

:::image type="content" source="./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac.svg" alt-text="A sequence diagram that details authentication of Fabrikam Teams users. The client application gets an Azure Communication Services access token for a single tenant Azure A D application." lightbox="./media/custom-teams-endpoint/authentication-case-single-tenant-azure-rbac.svg":::

Prerequisites:
- Alice or her Azure AD administrator needs to give the custom Teams application consent, prior to the first attempt to sign in. Learn more about [consent flow](../../../active-directory/develop/consent-framework.md).
- The Azure Communication Services resource admin must grant Alice permission to perform her role. Learn more about [Azure RBAC role assignment](../../../role-based-access-control/role-assignments-portal.md).

Steps:
1. Authenticate Alice using Azure Active Directory: Alice is authenticated using a standard OAuth flow with *Microsoft Authentication Library (MSAL)*. If authentication is successful, the client application receives an Azure AD access token, with a value of 'A'. Tokens are outlined later in this article. Authentication from the developer perspective is outlined in this [quickstart](../../quickstarts/manage-teams-identity.md).
1. Get an access token for Alice: The customized Teams application performs control plane logic, using artifact 'A'. This produces Azure Communication Services access token 'D' and gives Alice access. This access token can also be used for data plane actions in Azure Communication Services, such as calling. Token are outlined later in this article. The developer perspective is outlined in the [quickstart](../../quickstarts/manage-teams-identity.md).
1. Start a call to Bob from Fabrikam: Alice is using Azure Communication Services access token to make a call to Teams user Bob via Communication Services calling SDK. Learn more about [developing custom Teams clients](../../quickstarts/voice-video-calling/get-started-with-voice-video-calling-custom-teams-client.md).

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
  
## Case 2: Example of a multi-tenant application
The Contoso company has built a custom Teams calling application for external customers. This application uses custom authentication within Contoso's own infrastructure. Contoso uses a connection string to retrieve tokens from Fabrikam's customized Teams application.

![A sequence diagram that demonstrates how the Contoso application authenticates Fabrikam users with Contoso's own Azure Communication Services resource.](./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac-overview.svg)

The following sequence diagram details multi-tenant authentication:

:::image type="content" source="./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac.svg" alt-text="A sequence diagram that details authentication of Teams users and Azure Communication Services access tokens for multi-tenant, Azure AD applications." lightbox="./media/custom-teams-endpoint/authentication-case-multiple-tenants-hmac.svg":::

Prerequisites:
- Alice or her Azure AD administrator needs to give Contoso's Azure Active Directory application consent before the first attempt to sign in. Learn more about [consent flow](../../../active-directory/develop/consent-framework.md).

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