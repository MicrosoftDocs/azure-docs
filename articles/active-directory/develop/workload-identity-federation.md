---
title: Worload identity federation | Azure
titleSuffix: Microsoft identity platform
description: Learn about workload identity federation, which allows developers to use a token from another identity provider (such as GitHub) as the credential for accessing Azure resources.  This eliminates the need for storing and maintaining long-lived secrets outside of Azure.
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
#As a developer, I want to workload identity federation is used 
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


## Federated identity credential
First, create the trust between the external identity provider and Microsoft identity platform. Configure a federated identity credential on the application object in Azure AD with the following properties. 

The *issuer* and *subject* are the key pieces which setup the trust relationship. *issuer* is the URL of the incoming "trusted" issuer (STS). Matches the issuer claim of an access token. For Azure AD, this is: 
- Azure AD (global service): "https://login.microsoftonline.com/{tenantid}/v2.0 " 
- Azure AD for US Government: "https://login.microsoftonline.us/{tenantid}/v2.0 " 
- Azure AD Germany: "https://login.microsoftonline.de/{tenantid}/v2.0 " 
- Azure AD China operated by 21Vianet: "https://login.chinacloudapi.cn/{tenantid}/v2.0 " 

*subject* For AAD issuer, the objectId of the servicePrincipal (can represent a managed identity) that can impersonate the app. The object associated with this guid needs to exist in the tenant. For all other issuers, a string with no additional validation 

It says that Azure AD should trust the issuer for this particular application registration, and if the incoming token is issued by the issuer and has the matching subject claim, then Azure AD should accept that as the secret for this application and satisfy any requests for access tokens. The combination of *issuer* and *subject* must be unique on the app. 

The *name* is the unique identifier for the federated identity.

The *audiences* is optional, and defaults to `api://AzureADTokenExchange`. It says what Azure AD should accept in the audience claim in the incoming token. If GitHub, Kubernetes, and other scenarios allow the developer to configure the audience for the token issued by them, then the guidance would be for developers to configure those with `api://AzureADTokenExchange` and then not supply an audience when creating the federated identity credential. However, if the issuer does not have the flexibility for the developer to configure the audience in the token, then the developer can configure the audience that will show up in the token when creating the federated identity credential. 

*description* is the user-provided description of what the federated identity credential is used for.

For more information, see *Create a new federated identity credential*.

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

