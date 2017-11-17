---
title: Migrating from Azure Access Control Service (ACS)
description: Options for moving apps & services off of Azure Access Control Service | Microsoft Azure
services: active-directory
documentationcenter: dev-center-name
author: dstrockis
manager: mbaldwin
editor: ''

ms.assetid: 820acdb7-d316-4c3b-8de9-79df48ba3b06
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 11/14/2017
ms.author: dastrock
---


# Migrating from Azure Access Control Service (ACS)

Microsoft Azure Active Directory Access Control (also known as Access Control Service or ACS) is being retired in November 2018.  Applications & services currently using ACS need to fully migrate to a different authentication mechanism before this date. This document describes recommendations for current customers as they plan to deprecate their use of ACS. If you are not currently using ACS, you do not need to take any action.


## Brief ACS Overview

ACS is a cloud authentication service that provides an easy way of authenticating and authorizing users to gain access to your web applications and services while allowing many features of authentication and authorization to be factored out of your code. It is used primarily by developers & architects of .NET clients, ASP.NET web applications & WCF web services.

The use cases for ACS can be broken down into three main categories:

- Authenticating to certain Microsoft cloud services, including Azure Service Bus, Dynamics CRM, and others. Client applications could obtain tokens from ACS that can be used to authenticate to these services to perform various actions.
- Adding authentication to web applications, both of the custom built variety & of the pre-packaged variety (such as Sharepoint). Using ACS "passive" authentication, web applications could support login with accounts from Google, Facebook, Yahoo, Microsoft account (Live ID), Azure Active Directory, and ADFS.
- Securing custom built web services with tokens issued by ACS. Using "active" authentication, web services could ensure that they only allow access from known clients that have authenticated with ACS.

Each of these use cases and their recommended migration strategies is discussed in the following sections. In the vast majority of cases, significant code changes are required to migrate existing apps & services to newer technologies. It is recommended that you begin planning & executing your migration immediately to avoid any potential for outages or downtime.

> [!WARNING]
> In the majority of cases, significant code changes are required to migrate existing apps & services to newer technologies. It is recommended that you begin planning & executing your migration immediately to avoid any potential for outages or downtime.

Architecturally, ACS is entirely comprised of the following components:

- A secure token service (STS), which receives authentication requests & issues security tokens in return.
- The classic Azure portal, which is used for creating, deleting, and enabling/disabling ACS namespaces.
- A separate ACS management portal, which is used for customizing & configuring the behavior of an ACS namespace.
- A management service, which can be used to automate the functions of the portals.
- A token transformation rule engine, which can be used to define complex logic for manipulating the output format of tokens issued by ACS.

To use these components, you must create one or more ACS **namespaces**. A namespace is a dedicated instance of ACS that your applications & services communicate with; it is isolated from all other ACS customers, who use their own namespaces. A namespace in ACS has a dedicated URL, like:

```HTTP
https://mynamespace.accesscontrol.windows.net
```

All communication with the STS and management operations are done at this URL, with different paths for different purposes. To determine if your applications or services use ACS, monitor for any traffic to `https://{namespace}.accesscontrol.windows.net`.  Any traffic to this URL is traffic that is handled by ACS and needs to be discontinued.  The one exception is any traffic to `https://accounts.accesscontrol.windows.net` - traffic to this URL is already handled by a different service and is not affected by ACS deprecation.  You should also be sure to login to the Azure classic portal and check for any ACS namespaces in the subscriptions that you own.  ACS namespaces are listed in the **Active Directory** service, under the **Access Control Namespaces** tab.

For more information on ACS, see [this archived documentation on MSDN](https://msdn.microsoft.com/en-us/library/hh147631.aspx).

## Retirement Schedule

As of November 2017, all ACS components are fully supported & operational. The only restriction is that [new ACS namespaces cannot be created via the classic Azure portal](https://azure.microsoft.com/blog/acs-access-control-service-namespace-creation-restriction/).

The timeline for deprecation of these components follows this schedule:

- **November 2017**:  The Azure AD admin experience in the classic Azure portal [is retired](https://blogs.technet.microsoft.com/enterprisemobility/2017/09/18/marching-into-the-future-of-the-azure-ad-admin-experience-retiring-the-azure-classic-portal/). At this point, namespace management for ACS will be available at this new, dedicated URL: `http://manage.windowsazure.com?restoreClassic=true`. This is to allow you to view your existing namespaces, enable/disable them, and delete them entirely if you wish.
- **April 2018**: ACS namespace management is no longer be available at this dedicated URL. At this point in time, you are not able to disable/enable, delete, or enumerate your ACS namespaces. The ACS management portal, however, is fully functional and located at `https://{namespace}.accesscontrol.windows.net`. All other components of ACS continue to operate normally as well.
- **November 2018**: All ACS components are shut down permanently. This includes the ACS management portal, the management service, STS, and token transformation rule engine. At this point, any requests sent to ACS (located at `{namespace}.accesscontrol.windows.net`) fail. You should have migrated all existing apps & services to other technologies well before this time period.


## Migration Strategies

The following sections describe high level recommendations for migrating off of ACS to other Microsoft technologies.

### Clients of Microsoft cloud services

Each of the Microsoft cloud services that accept tokens issued by ACS now supports at least one alternate form of authentication. The correct authentication mechanism varies for each service, so we recommend referring to the specific documentation of each service for official guidance. For convenience, each set of documentation is provided here:

| Service | Guidance |
| ------- | -------- |
| Azure Service Bus | [Migrate to Shared Access Signatures](https://docs.microsoft.com/azure/service-bus-messaging/service-bus-migrate-acs-sas) |
| Azure Relay | [Migrate to Shared Access Signatures](https://docs.microsoft.com/azure/service-bus-relay/relay-migrate-acs-sas) |
| Azure Cache | [Migrate to Azure Redis Cache](https://docs.microsoft.com/azure/redis-cache/cache-faq#which-azure-cache-offering-is-right-for-me) |
| Azure Data Market | [Migrate to the Cognitive Services APIs](https://docs.microsoft.com/azure/machine-learning/studio/datamarket-deprecation) |
| BizTalk Services | [Migrate to Azure Logic Apps](https://docs.microsoft.com/azure/machine-learning/studio/datamarket-deprecation) |
| Azure Media Services | [Migrate to Azure AD authentication](https://azure.microsoft.com/en-us/blog/azure-media-service-aad-auth-and-acs-deprecation/) |
| Azure Backup | [Upgrade the Azure Backup Agent](https://docs.microsoft.com/azure/backup/backup-azure-file-folder-backup-faq) |

<!-- Dynamics CRM: Migrate to new SDK, Dynamics team handling privately -->
<!-- Azure RemoteApp deprecated in favor of Citrix: http://www.zdnet.com/article/microsoft-to-drop-azure-remoteapp-in-favor-of-citrix-remoting-technologies/ -->
<!-- Exchange push notifications are moving, customers don't need to move -->
<!-- Retail federation services are moving, customers don't need to move -->
<!-- Azure StorSimple: TODO -->
<!-- Azure SiteRecovery: TODO -->


### Web applications using passive authentication

For web applications using ACS for user authentication, ACS provided the following features & capabilities to developers & architects of web applications:

- Deep integration with Windows Identity Foundation (WIF).
- Federation with Google, Facebook, Yahoo, Microsoft account (Live ID), Azure Active Directory, and ADFS.
- Support for the following authentication protocols: OAuth 2.0 draft 13, Ws-Trust, and Ws-Federation.
- Support for the following token formats: JSON web token (JWT), SAML 1.1, SAML 2.0, and Simple web token (SWT).
- A home-realm discovery experience, integrated into WIF, that allowed users to pick the type of account they use to sign in. This experience was hosted by the web application and fully customizable.
- Token transformation that allowed rich customization of the claims received by the web application from ACS, including:
    - passing through claims from identity providers
    - adding additional custom claims
    - simple if-then logic to issue claims under certain conditions

Unfortunately, there is not one service that provides all of these equivalent capabilities.  You should evaluate which capabilities of ACS you need, and then choose between using [**Azure Active Directory**](https://azure.microsoft.com/develop/identity/signin/) (Azure AD), [**Azure AD B2C**](https://azure.microsoft.com/services/active-directory-b2c/), or another cloud authentication service.

#### Migrating to Azure Active Directory

One path to consider is integrating your apps & services directly with Azure Active Directory. Azure AD is the cloud based identity provider for Microsoft work & school accounts - it is the identity provider for Office 365, Azure, and much more. It provides similar federated authentication capabilities to ACS, but does not support all ACS features. The primary example is federation with social identity providers, such as Facebook, Google, and Yahoo. If your users sign in with these types of credentials, Azure AD is not for you. It also does not necessarily support the exact same authentication protocols as ACS - while both ACS & Azure AD support OAuth, for instance, there are subtle differences between each implementation that require you to modify code as part of migration.

Azure AD does however provide several potential advantages to customers of ACS. It natively supports Microsoft work & school accounts hosted in the cloud, which are commonly used by ACS customers.  An Azure AD tenant can also be federated to one or more instances of on-prem Active Directory via ADFS, allowing your app to authenticate both cloud-based users and users hosted on premises.  It also supports the Ws-Federation protocol, which makes it relatively straightforward to integrate with a web application using Windows Identity Foundation (WIF).

The following table compares the features of ACS relevant to web applications with those available in Azure AD. At a high level, **Azure Active Directory is probably the proper choice for your migration if you only let users sign-in with their Microsoft work & school accounts**.

| Capability | ACS Support | Azure AD Support |
| ---------- | ----------- | ---------------- |
| **Types of Accounts** | | |
| Microsoft work & school accounts | Supported | Supported |
| Accounts from Windows Server Active Directory & ADFS | Supported via federation with an Azure AD tenant <br /> Supported via direct federation with ADFS | Only supported via federation with an Azure AD tenant | 
| Accounts from other enterprise identity management systems | Possible via federation with an Azure AD tenant <br />Supported via direct federation | Possible via federation with an Azure AD tenant |
| Microsoft accounts for personal use (Windows Live ID) | Supported | Supported via Azure AD's v2.0 OAuth protocol, but not over any other protocols. | 
| Facebook, Google, Yahoo accounts | Supported | Not supported whatsoever. |
| **Protocols & SDK Compatibility** | | |
| Windows Identity Foundation (WIF) | Supported | Supported, but limited instructions available. |
| Ws-Federation | Supported | Supported |
| OAuth 2.0 | Support for Draft 13 | Support for RFC 6749, the most modern specification. |
| Ws-Trust | Supported | Not supported |
| **Token Formats** | | |
| Json Web Tokens (JWTs) | Supported In Beta | Supported |
| SAML 1.1 tokens | Supported | Supported |
| SAML 2.0 tokens | Supported | Supported |
| Simple Web Tokens (SWT) | Supported | Not Supported |
| **Customizations** | | |
| Customizable home realm discovery/account picking UI | Downloadable code that can be incorporated into apps | Not supported |
| Upload custom token signing certificates | Supported | Supported |
| Customize claims in tokens | Passthrough input claims from identity providers<br />Get access token from identity provider as a claim<br />Issue output claims based on values of input claims<br />Issue output claims with constant values | Cannot passthrough claims from federated identity providers<br />Cannot get access token from identity provider as a claim<br />Cannot issue output claims based on values of input claims<br />Can issue output claims with constant values<br />Can issue output claims based on properties of users synched to Azure AD |
| **Automation** | | |
| Automate configuration/management tasks | Supported via ACS Management Service | Supported via Microsoft Graph & Azure AD Graph API. |

If you decide that Azure AD is the proper path forward for your applications & services, you should be aware of two ways to integrate your app with Azure AD.

To use Ws-Federation/WIF to integrate with Azure AD, we recommend following [the approach described in this article](https://docs.microsoft.com/azure/active-directory/application-config-sso-how-to-configure-federated-sso-non-gallery). The article refers to configuring Azure AD for SAML-based single sign-on, but works for configuring Ws-Federation as well. Following this approach requires an Azure AD Premium license, but has two advantages:

- You get the full flexibility of Azure AD token customization. This allows you to customize the claims issued by Azure AD to match those issued by ACS, especially including the user ID or Name Identifier claim. You need to ensure that the user IDs issued by Azure AD match those issued by ACS, so that you continue to receive consistent user IDentifiers for your users even after changing technologies.
- You can configure a token signing certificate specific to your application, whose lifetime you control.

<!--

Possible nameIdentifiers from ACS (via AAD or ADFS):
- ADFS - Whatever ADFS is configured to send (email, UPN, employeeID, what have you)
- Default from AAD using App Registrations, or Custom Apps before ClaimsIssuance policy: subject/persistent ID
- Default from AAD using Custom apps nowadays: UPN
- Kusto can't tell us distribution, it's redacted

-->

> [!NOTE]
> Going with this approach requires an Azure AD Premium license. If you are an ACS customer and you require a premium license for setting up single-sign on for an application, reach out to us and we'll be happy to provide developer licenses for your use.

An alternative approach is to follow [this code sample](https://github.com/Azure-Samples/active-directory-dotnet-webapp-wsfederation), which gives slightly different instructions on how to set up Ws-Federation. This code sample does not use WIF, but rather, the ASP.NET 4.5 OWIN middleware. However, the instructions for app registration are valid for apps using WIF, and do not require an Azure AD Premium license.  If you choose this approach, you heneed to understand [signing key rollover in Azure AD](https://docs.microsoft.com/azure/active-directory/develop/active-directory-signing-key-rollover). This approach uses the Azure AD global signing key to issue tokens. By default, WIF does not automatically refresh signing keys. When Azure AD rotates its global signing keys, your WIF implementation needs to be prepared to accept the changes.

If you are able to integrate with Azure AD via the OpenID Connect or OAuth protocols, we recommend doing so.  We have extensive documentation and guidance for how to integrate Azure AD into your web application available in our [Azure AD developer guide](http://aka.ms/aaddev).

<!-- TODO: If customers ask about authZ, let's put a blurb on role claims here -->

#### Migrating to Azure AD B2C

The other migration path to consider is Azure AD B2C.  B2C is a cloud authentication service that, similar to ACS, allows developers to outsource their authentication and identity management logic to a cloud service.  It is a paid service (with free & premium tiers) designed for consumer facing applications that can have up to millions of active users.

Like ACS, one of the most attractive features of B2C is that is supports many different types of accounts. With B2C, you can sign-in users with their Facebook, Google, Microsoft, LinkedIn, GitHub, Yahoo accounts, and more. B2C additionally supports "local accounts", or username & passwords that users create specifically for your application. Azure AD B2C also provides rich extensibility that you can use to customize your login flows. It does not, however, support the breadth of authentication protocols & token formats that ACS customers may require. It also cannot be used to get tokens & query additional information about the user from the identity provider, Microsoft or otherwise.

The following table compares the features of ACS relevant to web applications with those available in Azure AD B2C. At a high level, **Azure AD B2C is probably the right choice for your migration if your application is consumer facing, or if it supports many different types of accounts.**

| Capability | ACS Support | Azure AD B2C Support |
| ---------- | ----------- | ---------------- |
| **Types of Accounts** | | |
| Microsoft work & school accounts | Supported | Supported via custom policies  |
| Accounts from Windows Server Active Directory & ADFS | Supported via direct federation with ADFS | Supported via SAML federation using custom policies |
| Accounts from other enterprise identity management systems | Supported via direct federation over Ws-Federation | Supported via SAML federation using custom policies |
| Microsoft accounts for personal use (Windows Live ID) | Supported | Supported | 
| Facebook, Google, Yahoo accounts | Supported | Facebook & Google supported natively, Yahoo supported via OpenID Connect federation using custom policies |
| **Protocols & SDK Compatibility** | | |
| Windows Identity Foundation (WIF) | Supported | Not supported. |
| Ws-Federation | Supported | Not supported. |
| OAuth 2.0 | Support for Draft 13 | Support for RFC 6749, the most modern specification. |
| Ws-Trust | Supported | Not supported. |
| **Token Formats** | | |
| Json Web Tokens (JWTs) | Supported In Beta | Supported |
| SAML 1.1 tokens | Supported | Not supported |
| SAML 2.0 tokens | Supported | Not supported |
| Simple Web Tokens (SWT) | Supported | Not supported |
| **Customizations** | | |
| Customizable home realm discovery/account picking UI | Downloadable code that can be incorporated into apps | Fully customizable UI via custom CSS. |
| Upload custom token signing certificates | Supported | Custom signing keys, not certificates, supported via custom policies. |
| Customize claims in tokens | Passthrough input claims from identity providers<br />Get access token from identity provider as a claim<br />Issue output claims based on values of input claims<br />Issue output claims with constant values | Can passthrough claims from identity providers. Custom policies required for some claims.<br />Cannot get access token from identity provider as a claim<br />Can issue output claims based on values of input claims via custom policies<br />Can issue output claims with constant values via custom policies |
| **Automation** | | |
| Automate configuration/management tasks | Supported via ACS Management Service | Creation of users allowed via Azure AD Graph API. Cannot create B2C tenants, applications, or policies programmatically. |

If you decide that Azure AD B2C is the proper path forward for your applications & services, you should begin with the following resources:

- [Azure AD B2C Documentation](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-overview)
- [Azure AD B2C Custom Policies](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-overview-custom)
- [Azure AD B2C Pricing](https://azure.microsoft.com/en-us/pricing/details/active-directory-b2c/)


#### Other Migration Options

If neither Azure AD nor Azure AD B2C meets the needs of your web application, please reach out to us and we can help you identify the best path forward.

<!--

#### Migrating to Ping Identity or Auth0

In some cases, you may find that neither Azure AD nor Azure AD B2C is sufficient to replace ACS in your web applications without making major code changes.  Some common examples might include:

- web applications using WIF and/or WS-Federation for sign-in with social identity providers such as Google or Facebook.
- web applications performing direct federation to an enterprise IDP over the Ws-Federation protocol.
- web applications that require the access token issued by a social identity provider (such as Google or Facebook) as a claim in the tokens issued by ACS.
- web applications with complex token transformation rules that Azure AD or Azure AD B2C cannot reproduce.

In these cases, you may want to consider migrating your web application to another cloud authentication service. We recommend exploring the following options, as each provides capabilities similar to ACS:

- [Auth0](https://auth0.com/) has created [high-level migration guidance for customers of ACS](https://auth0.com/blog/windows-azure-acs-alternative-replacement/), and provides a feature-by-feature comparison of ACS vs. Auth0.
- Enterprise customers should consider [Ping Identity](https://www.pingidentity.com) as well. Reach out to us and we can connect you with a representative from Ping who is prepared to help identify potential solutions.

Our aim in working with Ping Identity & Auth0 is to ensure that all ACS customers have a path forward for their apps & services that minimizes the amount of work required to move off of ACS.

-->

<!--

## Sharepoint 2010, 2013, 2016

TODO: AAD only, use AAD SAML 1.1 tokens, when we bring it back online.
Other IDPs: use Auth0? https://auth0.com/docs/integrations/sharepoint.

-->

### Web services using active authentication

For web services secured with tokens issued by ACS, ACS provided the following features & capabilities:

- Ability to register one or more **service identities** in your ACS namespace that can be used to request tokens.
- Support for the OAuth WRAP & OAuth 2.0 Draft 13 protocols for requesting tokens, using the following types of credentials:
    - A simple password created for the service identity
    - A signed SWT using a symmetric key or X509 certificate
    - A SAML token issued by a trusted identity provider (typically an ADFS instance)
- Support for the following token formats: JSON web token (JWT), SAML 1.1, SAML 2.0, and Simple web token (SWT).
- Simple token transformation rules

Service identities in ACS are typically used for implementing server-to-server (S2S) like authentication.  

#### Migrating to Azure Active Directory

Our recommendation for this type of authentication flow is to migrate to [**Azure Active Directory**](https://azure.microsoft.com/develop/identity/signin/) (Azure AD). Azure AD is the cloud based identity provider for Microsoft work & school accounts - it is the identity provider for Office 365, Azure, and much more. But it can also be used for server to server authentication using Azure AD's implementation of the OAuth client credentials grant.  The following table compares the capabilities of ACS in server to server authentication with those available in Azure AD.

| Capability | ACS Support | Azure AD Support |
| ---------- | ----------- | ---------------- |
| How to register a web service | Create a relying party in the ACS management portal. | Create an Azure AD web application in the Azure portal. |
| How to register a client | Create a service identity in ACS management portal. | Create another Azure AD web application in the Azure portal. |
| Protocol used | OAuth WRAP protocol<br />OAuth 2.0 Draft 13 client credentials grant | OAuth 2.0 client credentials grant |
| Client authentication methods | Simple password<br />Signed SWT<br />SAML token from federated IDP | Simple password<br />Signed JWT |
| Token formats | JWT<br />SAML 1.1<br />SAML 2.0<br />SWT<br /> | JWT only |
| Token transformation | Add custom claims<br />Simple if-then claim issuance logic | Add custom claims | 
| Automate configuration/management tasks | Supported via ACS Management Service | Supported via Microsoft Graph & Azure AD Graph API. |

For guidance on implementing server-to-server scenarios, refer to the following resources:

- [Service-to-Service section of the Azure AD developer guide](https://aka.ms/aaddev).
- [Daemon code sample using simple password client credentials](https://github.com/Azure-Samples/active-directory-dotnet-daemon)
- [Daemon code sample using certificate client credentials](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential)

#### Other Migration Options

If Azure AD does not meet the needs of your web service, please leave a comment and we can help you identify the best plan for your specific case.

<!--

#### Migrating to Ping Identity or Auth0

In some cases, you may find that neither Azure AD's client credentials OAuth grant implementation is not sufficient to replace ACS in your architecture without major code changes.  Some common examples might include:

- server-to-server authentication using token formats other than JWTs.
- server-to-server authentication using an input token provided by an external identity provider.
- server-to-server authentication with token transformation rules that Azure AD cannot reproduce.

In these cases, you may want to consider migrating your web application to another cloud authentication service. We recommend exploring the following options, as each provides capabilities similar to ACS:

- [Auth0](https://auth0.com/) has created [high-level migration guidance for customers of ACS](https://auth0.com/blog/windows-azure-acs-alternative-replacement/), and provides a feature-by-feature comparison of ACS vs. Auth0.
- Enterprise customers should consider [Ping Identity](https://www.pingidentity.com) as well. Reach out to us and we can connect you with a representative from Ping who is prepared to help identify potential solutions.

Our aim in working with Ping Identity & Auth0 is to ensure that all ACS customers have a path forward for their apps & services that minimizes the amount of work required to move off of ACS.

-->

## Questions, Concerns, & Feedback

We understand that many ACS customers will not find a clear migration path after reading this article, and may need some assistance or guidance in determining the right plan. If you would like to discuss your migration scenarios & questions, leave a comment on this page.
