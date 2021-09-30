---
title: Worload identity federation | Azure
titleSuffix: Microsoft identity platform
description: Learn about workload identity federation, which allows developers to exchange a token from another identity provider (such as GitHub) for an access token in order to access Azure resources.  This eliminates the need for storing and maintaining long-lived secrets outside of Azure.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.workload: identity
ms.topic: conceptual
ms.date: 09/28/2021
ms.author: ryanwi
ms.reviewer: keyam, udayh, vakarand
ms.custom: 
#As a developer, I want to learn what workload identity federation is and what it's used for. 
---

# Workload identity federation (preview)

A workload identity is an identity used by a software workload (such as an application, service, script, or container) that needs to authenticate and access services and resources. Some examples of workload identities in Azure Active Directory (Azure AD) are:
- application identities that allow delegated access to user data in Microsoft Graph 
- managed identities used by developers in Azure
- service principals used by developers to provision CI/CD in GitHub Actions.  

Typically, a software workload needs the unique identifier and credential (a secret or certificate) of it's identity in order to authenticate.  A software workload running outside of Azure that needs to access Azure resources usually stores it's identity credentials outside of Azure.  Manually managing credentials outside of Azure introduces a maintenance burden on the developer and introduces the risk of leaking secrets or having certificates expire.

Workload identity federation creates a new type of credential (federated identity credential) which allows Azure AD workload identities to impersonate apps outside of Azure. A workload identity (an app in Azure AD) can be configured to trust tokens from an external identity provider (for example, GitHub) and exchange foreign tokens for access tokens from Microsoft identity platform.  Using that access token, the external app can now access resources on Azure. This eliminates the maintenance burden of manually managing credentials and eliminates the risk of leaking secrets or having certificates expire. 

## Primary scenarios enabled by workload identity federation
Workload identity federation enables a variety of scenarios:

Setup a GitHub Actions CI/CD to deploy to Azure without storing service principal secrets in GitHub.  GitHub tokens are exchanged for access tokens from Microsoft identity platform. 


## Generic pattern of exchanging tokens and accessing Azure 
Each scenario has different methods for exchanging a foreign token for an access token and accessing Azure resources, but the underlying pattern remains the same. The following steps show the end-to-end workflow at runtime, after the federated identity credential is created and the trust relationship between identity providers is established.  

:::image type="content" source="media/workload-identity-federation/workflow.png" alt-text="Shows a foreign token exchanged for an access token and accessing Azure" border="false":::

1. Request a token from the external identity provider
1. Get the token: {subject: `id`, audience: `Azure AD`}
1. Request the token from Microsoft identity platform using the foreign token. Azure AD will support an OAuth Confidential Client with a token as a client assertion. This will allow anyone to send the foreign token as a client assertion when requesting an Azure AD token
1. Identity platform checks the trust on the app and validates the incoming token.
1. Identity platform issues an access token: {sub: `app-id`, aud: `aud`}
1. Access Azure resources using the access token. 

 
## Next steps

