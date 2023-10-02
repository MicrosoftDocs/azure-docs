---
title: Migrate from the Azure Access Control Service
description: Learn about the options for moving apps and services from the Azure Access Control Service (ACS).
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: azuread-dev
ms.custom: aaddev 
ms.topic: how-to
ms.workload: identity
ms.date: 10/03/2018
ms.author: ryanwi
ms.reviewer: marsma, ludwignick
ROBOTS: NOINDEX
---

# How to: Migrate from the Azure Access Control Service

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

Microsoft Azure Access Control Service (ACS), a service of Azure Active Directory (Azure AD), will be retired on November 7, 2018. Applications and services that currently use Access Control must be fully migrated to a different authentication mechanism by then. This article describes recommendations for current customers, as you plan to deprecate your use of Access Control. If you don't currently use Access Control, you don't need to take any action.

## Overview

Access Control is a cloud authentication service that offers an easy way to authenticate and authorize users for access to your web applications and services. It allows many features of authentication and authorization to be factored out of your code. Access Control is primarily used by developers and architects of Microsoft .NET clients, ASP.NET web applications, and Windows Communication Foundation (WCF) web services.

Use cases for Access Control can be broken down into three main categories:

- Authenticating to certain Microsoft cloud services, including Azure Service Bus and Dynamics CRM. Client applications obtain tokens from Access Control to authenticate to these services to perform various actions.
- Adding authentication to web applications, both custom and prepackaged (like SharePoint). By using Access Control "passive" authentication, web applications can support sign-in with a Microsoft account (formerly Live ID), and with accounts from Google, Facebook, Yahoo, Azure AD, and Active Directory Federation Services (AD FS).
- Securing custom web services with tokens issued by Access Control. By using "active" authentication, web services can ensure that they allow access only to known clients that have authenticated with Access Control.

Each of these use cases and their recommended migration strategies are discussed in the following sections.

> [!WARNING]
> In most cases, significant code changes are required to migrate existing apps and services to newer technologies. We recommend that you immediately begin planning and executing your migration to avoid any potential outages or downtime.

Access Control has the following components:

- A secure token service (STS), which receives authentication requests and issues security tokens in return.
- The Azure classic portal, where you create, delete, and enable and disable Access Control namespaces.
- A separate Access Control management portal, where you customize and configure Access Control namespaces.
- A management service, which you can use to automate the functions of the portals.
- A token transformation rule engine, which you can use to define complex logic to manipulate the output format of tokens that Access Control issues.

To use these components, you must create one or more Access Control namespaces. A *namespace* is a dedicated instance of Access Control that your applications and services communicate with. A namespace is isolated from all other Access Control customers. Other Access Control customers use their own namespaces. A namespace in Access Control has a dedicated URL that looks like this:

```HTTP
https://<mynamespace>.accesscontrol.windows.net
```

All communication with the STS and management operations are done at this URL. You use different paths for different purposes. To determine whether your applications or services use Access Control, monitor for any traffic to https://&lt;namespace&gt;.accesscontrol.windows.net. Any traffic to this URL is handled by Access Control, and needs to be discontinued. 

The exception to this is any traffic to `https://accounts.accesscontrol.windows.net`. Traffic to this URL is already handled by a different service and **is not** affected by the Access Control deprecation. 

For more information about Access Control, see [Access Control Service 2.0 (archived)](/previous-versions/azure/azure-services/hh147631(v=azure.100)).

## Find out which of your apps will be impacted

Follow the steps in this section to find out which of your apps will be impacted by ACS retirement.

### Download and install ACS PowerShell

1. Go to the PowerShell Gallery and download [Acs.Namespaces](https://www.powershellgallery.com/packages/Acs.Namespaces/1.0.2).
2. Install the module by running

    ```powershell
    Install-Module -Name Acs.Namespaces
    ```

3. Get a list of all possible commands by running

    ```powershell
    Get-Command -Module Acs.Namespaces
    ```

    To get help on a specific command, run:

    ```
     Get-Help [Command-Name] -Full
    ```
    
    where `[Command-Name]` is the name of the ACS command.

### List your ACS namespaces

1. Connect to ACS using the **Connect-AcsAccount** cmdlet.
  
    You may need to run `Set-ExecutionPolicy -ExecutionPolicy Bypass` before you can execute commands and be the admin of those subscriptions in order to execute the commands.

2. List your available Azure subscriptions using the **Get-AcsSubscription** cmdlet.
3. List your ACS namespaces using the **Get-AcsNamespace** cmdlet.

### Check which applications will be impacted

1. Use the namespace from the previous step and go to `https://<namespace>.accesscontrol.windows.net`

    For example, if one of the namespaces is contoso-test, go to `https://contoso-test.accesscontrol.windows.net`

2. Under **Trust relationships**, select **Relying party applications** to see the list of apps that will be impacted by ACS retirement.
3. Repeat steps 1-2 for any other ACS namespace(s) that you have.

## Retirement schedule

As of November 2017, all Access Control components are fully supported and operational. The only restriction is that you [can't create new Access Control namespaces via the Azure classic portal](https://azure.microsoft.com/blog/acs-access-control-service-namespace-creation-restriction/).

Here's the schedule for deprecating Access Control components:

- **November 2017**: The Azure AD admin experience in the Azure classic portal [is retired](https://blogs.technet.microsoft.com/enterprisemobility/2017/09/18/marching-into-the-future-of-the-azure-ad-admin-experience-retiring-the-azure-classic-portal/). At this point, namespace management for Access Control is available at a new, dedicated URL: `https://manage.windowsazure.com?restoreClassic=true`. Use this URL to view your existing namespaces, enable and disable namespaces, and to delete namespaces, if you choose to.
- **April 2, 2018**: The Azure classic portal is completely retired, meaning Access Control namespace management is no longer available via any URL. At this point, you can't disable or enable, delete, or enumerate your Access Control namespaces. However, the Access Control management portal will be fully functional and located at `https://<namespace>.accesscontrol.windows.net`. All other components of Access Control continue to operate normally.
- **November 7, 2018**: All Access Control components are permanently shut down. This includes the Access Control management portal, the management service, STS, and the token transformation rule engine. At this point, any requests sent to Access Control (located at `<namespace>.accesscontrol.windows.net`) fail. You should have migrated all existing apps and services to other technologies well before this time.

> [!NOTE]
> A policy disables namespaces that have not requested a token for a period of time. As of early September 2018, this period of time is currently at 14 days of inactivity, but this will be shortened to 7 days of inactivity in the coming weeks. If you have Access Control namespaces that are currently disabled, you can [download and install ACS PowerShell](#download-and-install-acs-powershell) to re-enable the namespace(s).

## Migration strategies

The following sections describe high-level recommendations for migrating from Access Control to other Microsoft technologies.

### Clients of Microsoft cloud services

Each Microsoft cloud service that accepts tokens that are issued by Access Control now supports at least one alternate form of authentication. The correct authentication mechanism varies for each service. We  recommend that you refer to the specific documentation for each service for official guidance. For convenience, each set of documentation is provided here:

| Service | Guidance |
| ------- | -------- |
| Azure Service Bus | [Migrate to shared access signatures](../../service-bus-messaging/service-bus-sas.md) |
| Azure Service Bus Relay | [Migrate to shared access signatures](../../azure-relay/relay-migrate-acs-sas.md) |
| Azure Managed Cache | [Migrate to Azure Cache for Redis](../../azure-cache-for-redis/cache-faq.yml) |
| Azure DataMarket | [Migrate to the Azure AI services APIs](https://azure.microsoft.com/services/cognitive-services/) |
| BizTalk Services | [Migrate to the Logic Apps feature of Azure App Service](https://azure.microsoft.com/services/cognitive-services/) |
| Azure Media Services | [Migrate to Azure AD authentication](https://azure.microsoft.com/blog/azure-media-service-aad-auth-and-acs-deprecation/) |
| Azure Backup | [Upgrade the Azure Backup agent](../../backup/backup-azure-file-folder-backup-faq.yml) |

<!-- Dynamics CRM: Migrate to new SDK, Dynamics team handling privately -->
<!-- Azure RemoteApp deprecated in favor of Citrix: https://www.zdnet.com/article/microsoft-to-drop-azure-remoteapp-in-favor-of-citrix-remoting-technologies/ -->
<!-- Exchange push notifications are moving, customers don't need to move -->
<!-- Retail federation services are moving, customers don't need to move -->
<!-- Azure StorSimple: TODO -->
<!-- Azure SiteRecovery: TODO -->

### SharePoint customers

SharePoint 2013, 2016, and SharePoint Online customers have long used ACS for authentication purposes in cloud, on premises, and hybrid scenarios. Some SharePoint features and use cases will be affected by ACS retirement, while others will not. The below table summarizes migration guidance for some of the most popular SharePoint feature that leverage ACS:

| Feature | Guidance |
| ------- | -------- |
| Authenticating users from Azure AD | Previously, Azure AD did not support SAML 1.1 tokens required by SharePoint for authentication, and ACS was used as an intermediary that made SharePoint compatible with Azure AD token formats. Now, you can [connect SharePoint directly to Azure AD using Azure AD App Gallery SharePoint on premises app](../saas-apps/sharepoint-on-premises-tutorial.md). |
| [App authentication & server-to-server authentication in SharePoint on premises](/SharePoint/security-for-sharepoint-server/authentication-overview) | Not affected by ACS retirement; no changes necessary. | 
| [Low trust authorization for SharePoint add-ins (provider hosted and SharePoint hosted)](/sharepoint/dev/sp-add-ins/three-authorization-systems-for-sharepoint-add-ins) | Not affected by ACS retirement; no changes necessary. |
| [SharePoint cloud hybrid search](/archive/blogs/spses/cloud-hybrid-search-service-application) | Not affected by ACS retirement; no changes necessary. |

### Web applications that use passive authentication

For web applications that use Access Control for user authentication, Access Control provides the following features and capabilities to web application developers and architects:

- Deep integration with Windows Identity Foundation (WIF).
- Federation with Google, Facebook, Yahoo, Azure Active Directory, and AD FS accounts, and Microsoft accounts.
- Support for the following authentication protocols: OAuth 2.0 Draft 13, WS-Trust, and Web Services Federation (WS-Federation).
- Support for the following token formats: JSON Web Token (JWT), SAML 1.1, SAML 2.0, and Simple Web Token (SWT).
- A home realm discovery experience, integrated into WIF, that allows users to pick the type of account they use to sign in. This experience is hosted by the web application and is fully customizable.
- Token transformation that allows rich customization of the claims received by the web application from Access Control, including:
    - Pass through claims from identity providers.
    - Adding additional custom claims.
    - Simple if-then logic to issue claims under certain conditions.

Unfortunately, there isn't one service that offers all of these equivalent capabilities. You should evaluate which capabilities of Access Control you need, and then choose between using [Microsoft Entra ID](https://azure.microsoft.com/develop/identity/signin/), [Azure Active Directory B2C](https://azure.microsoft.com/services/active-directory-b2c/) (Azure AD B2C), or another cloud authentication service.

<a name='migrate-to-azure-active-directory'></a>

#### Migrate to Microsoft Entra ID

A path to consider is integrating your apps and services directly with Microsoft Entra ID. Microsoft Entra ID is the cloud-based identity provider for Microsoft work or school accounts. Microsoft Entra ID is the identity provider for Microsoft 365, Azure, and much more. It provides similar federated authentication capabilities to Access Control, but doesn't support all Access Control features. 

The primary example is federation with social identity providers, such as Facebook, Google, and Yahoo. If your users sign in with these types of credentials, Microsoft Entra ID is not the solution for you. 

Microsoft Entra ID also doesn't necessarily support the exact same authentication protocols as Access Control. For example, although both Access Control and Microsoft Entra ID support OAuth, there are subtle differences between each implementation. Different implementations require you to modify code as part of a migration.

However, Microsoft Entra ID does provide several potential advantages to Access Control customers. It natively supports Microsoft work or school accounts hosted in the cloud, which are commonly used by Access Control customers. 

A Microsoft Entra tenant can also be federated to one or more instances of on-premises Active Directory via AD FS. This way, your app can authenticate cloud-based users and users that are hosted on-premises. It also supports the WS-Federation protocol, which makes it relatively straightforward to integrate with a web application by using WIF.

The following table compares the features of Access Control that are relevant to web applications with those features that are available in Microsoft Entra ID. 

At a high level, *Microsoft Entra ID is probably the best choice for your migration if you let users sign in only with their Microsoft work or school accounts*.

| Capability | Access Control support | Microsoft Entra ID support |
| ---------- | ----------- | ---------------- |
| **Types of accounts** | | |
| Microsoft work or school accounts | Supported | Supported |
| Accounts from Windows Server Active Directory and AD FS |- Supported via federation with a Microsoft Entra tenant <br />- Supported via direct federation with AD FS | Only supported via federation with a Microsoft Entra tenant | 
| Accounts from other enterprise identity management systems |- Possible via federation with a Microsoft Entra tenant <br />- Supported via direct federation | Possible via federation with a Microsoft Entra tenant |
| Microsoft accounts for personal use | Supported | Supported via the Microsoft Entra v2.0 OAuth protocol, but not over any other protocols | 
| Facebook, Google, Yahoo accounts | Supported | Not supported whatsoever |
| **Protocols and SDK compatibility** | | |
| WIF | Supported | Supported, but limited instructions are available |
| WS-Federation | Supported | Supported |
| OAuth 2.0 | Support for Draft 13 | Support for RFC 6749, the most modern specification |
| WS-Trust | Supported | Not supported |
| **Token formats** | | |
| JWT | Supported In Beta | Supported |
| SAML 1.1 | Supported | Preview |
| SAML 2.0 | Supported | Supported |
| SWT | Supported | Not supported |
| **Customizations** | | |
| Customizable home realm discovery/account-picking UI | Downloadable code that can be incorporated into apps | Not supported |
| Upload custom token-signing certificates | Supported | Supported |
| Customize claims in tokens |- Pass through input claims from identity providers<br />- Get access token from identity provider as a claim<br />- Issue output claims based on values of input claims<br />- Issue output claims with constant values |- Cannot pass through claims from federated identity providers<br />- Cannot get access token from identity provider as a claim<br />- Cannot issue output claims based on values of input claims<br />- Can issue output claims with constant values<br />- Can issue output claims based on properties of users synced to Microsoft Entra ID |
| **Automation** | | |
| Automate configuration and management tasks | Supported via Access Control Management Service | Supported using the Microsoft Graph API |

If you decide that Microsoft Entra ID is the best migration path for your applications and services, you should be aware of two ways to integrate your app with Microsoft Entra ID.

To use WS-Federation or WIF to integrate with Microsoft Entra ID, we recommend following the approach described in [Configure federated single sign-on for a non-gallery application](../develop/single-sign-on-saml-protocol.md). The article refers to configuring Microsoft Entra ID for SAML-based single sign-on, but also works for configuring WS-Federation. Following this approach requires a Microsoft Entra ID P1 or P2 license. This approach has two advantages:

- You get the full flexibility of Microsoft Entra token customization. You can customize the claims that are issued by Microsoft Entra ID to match the claims that are issued by Access Control. This especially includes the user ID or Name Identifier claim. To continue to receive consistent user IDentifiers for your users after you change technologies, ensure that the user IDs issued by Microsoft Entra ID match those issued by Access Control.
- You can configure a token-signing certificate that is specific to your application, and with a lifetime that you control.

> [!NOTE]
> This approach requires a Microsoft Entra ID P1 or P2 license. If you are an Access Control customer and you require a premium license for setting up single-sign on for an application, contact us. We'll be happy to provide developer licenses for you to use.

An alternative approach is to follow [this code sample](https://github.com/Azure-Samples/active-directory-dotnet-webapp-wsfederation), which gives slightly different instructions for setting up WS-Federation. This code sample does not use WIF, but rather, the ASP.NET 4.5 OWIN middleware. However, the instructions for app registration are valid for apps using WIF, and don't require a Microsoft Entra ID P1 or P2 license. 

If you choose this approach, you need to understand [signing key rollover in Microsoft Entra ID](../develop/signing-key-rollover.md). This approach uses the Microsoft Entra global signing key to issue tokens. By default, WIF does not automatically refresh signing keys. When Microsoft Entra ID rotates its global signing keys, your WIF implementation needs to be prepared to accept the changes. For more information, see [Important information about signing key rollover in Microsoft Entra ID](/previous-versions/azure/dn641920(v=azure.100)).

If you can integrate with Microsoft Entra ID via the OpenID Connect or OAuth protocols, we recommend doing so. We have extensive documentation and guidance about how to integrate Microsoft Entra ID into your web application available in our [Microsoft Entra developer guide](../develop/index.yml).

#### Migrate to Azure Active Directory B2C

The other migration path to consider is Azure AD B2C. Azure AD B2C is a cloud authentication service that, like Access Control, allows developers to outsource their authentication and identity management logic to a cloud service. It's a paid service (with free and premium tiers) that is designed for consumer-facing applications that might have up to millions of active users.

Like Access Control, one of the most attractive features of Azure AD B2C is that it supports many different types of accounts. With Azure AD B2C, you can sign in users by using their Microsoft account, or Facebook, Google, LinkedIn, GitHub, or Yahoo accounts, and more. Azure AD B2C also supports "local accounts," or username and passwords that users create specifically for your application. Azure AD B2C also provides rich extensibility that you can use to customize your sign-in flows. 

However, Azure AD B2C doesn't support the breadth of authentication protocols and token formats that Access Control customers might require. You also can't use Azure AD B2C to get tokens and query for additional information about the user from the identity provider, Microsoft or otherwise.

The following table compares the features of Access Control that are relevant to web applications with those that are available in Azure AD B2C. At a high level, *Azure AD B2C is probably the right choice for your migration if your application is consumer facing, or if it supports many different types of accounts.*

| Capability | Access Control support | Azure AD B2C support |
| ---------- | ----------- | ---------------- |
| **Types of accounts** | | |
| Microsoft work or school accounts | Supported | Supported via custom policies  |
| Accounts from Windows Server Active Directory and AD FS | Supported via direct federation with AD FS | Supported via SAML federation by using custom policies |
| Accounts from other enterprise identity management systems | Supported via direct federation through WS-Federation | Supported via SAML federation by using custom policies |
| Microsoft accounts for personal use | Supported | Supported | 
| Facebook, Google, Yahoo accounts | Supported | Facebook and Google supported natively, Yahoo supported via OpenID Connect federation by using custom policies |
| **Protocols and SDK compatibility** | | |
| Windows Identity Foundation (WIF) | Supported | Not supported |
| WS-Federation | Supported | Not supported |
| OAuth 2.0 | Support for Draft 13 | Support for RFC 6749, the most modern specification |
| WS-Trust | Supported | Not supported |
| **Token formats** | | |
| JWT | Supported In Beta | Supported |
| SAML 1.1 | Supported | Not supported |
| SAML 2.0 | Supported | Not supported |
| SWT | Supported | Not supported |
| **Customizations** | | |
| Customizable home realm discovery/account-picking UI | Downloadable code that can be incorporated into apps | Fully customizable UI via custom CSS |
| Upload custom token-signing certificates | Supported | Custom signing keys, not certificates, supported via custom policies |
| Customize claims in tokens |- Pass through input claims from identity providers<br />- Get access token from identity provider as a claim<br />- Issue output claims based on values of input claims<br />- Issue output claims with constant values |- Can pass through claims from identity providers; custom policies required for some claims<br />- Cannot get access token from identity provider as a claim<br />- Can issue output claims based on values of input claims via custom policies<br />- Can issue output claims with constant values via custom policies |
| **Automation** | | |
| Automate configuration and management tasks | Supported via Access Control Management Service |- Creation of users allowed using the Microsoft Graph API<br />- Cannot create B2C tenants, applications, or policies programmatically |

If you decide that Azure AD B2C is the best migration path for your applications and services, begin with the following resources:

- [Azure AD B2C documentation](../../active-directory-b2c/overview.md)
- [Azure AD B2C custom policies](../../active-directory-b2c/custom-policy-overview.md)
- [Azure AD B2C pricing](https://azure.microsoft.com/pricing/details/active-directory-b2c/)

#### Migrate to Ping Identity or Auth0

In some cases, you might find that Microsoft Entra ID and Azure AD B2C aren't sufficient to replace Access Control in your web applications without making major code changes. Some common examples might include:

- Web applications that use WIF or WS-Federation for sign-in with social identity providers such as Google or Facebook.
- Web applications that perform direct federation to an enterprise identity provider over the WS-Federation protocol.
- Web applications that require the access token issued by a social identity provider (such as Google or Facebook) as a claim in the tokens issued by Access Control.
- Web applications with complex token transformation rules that Microsoft Entra ID or Azure AD B2C can't reproduce.
- Multi-tenant web applications that use ACS to centrally manage federation to many different identity providers

In these cases, you might want to consider migrating your web application to another cloud authentication service. We recommend exploring the following options. Each of the following options offer capabilities similar to Access Control:

![This image shows the Auth0 logo](./media/active-directory-acs-migration/rsz-auth0.png) 

[Auth0](https://auth0.com/access-management) is a flexible cloud identity service that has created [high-level migration guidance for customers of Access Control](https://auth0.com/access-management), and supports nearly every feature that ACS does.

![This image shows the Ping Identity logo](./media/active-directory-acs-migration/rsz-ping.png)

[Ping Identity](https://www.pingidentity.com) offers two solutions similar to ACS. PingOne is a cloud identity service that supports many of the same features as ACS, and PingFederate is a similar on premises identity product that offers more flexibility. Refer to Ping's ACS retirement guidance for more details on using these products.

Our aim in working with Ping Identity and Auth0 is to ensure that all Access Control customers have a migration path for their apps and services that minimizes the amount of work required to move from Access Control.

<!--

## SharePoint 2010, 2013, 2016

TODO: Azure AD only, use Azure AD SAML 1.1 tokens, when we bring it back online.
Other IDPs: use Auth0? https://auth0.com/docs/integrations/sharepoint.

-->

### Web services that use active authentication

For web services that are secured with tokens issued by Access Control, Access Control offers the following features and capabilities:

- Ability to register one or more *service identities* in your Access Control namespace. Service identities can be used to request tokens.
- Support for the OAuth WRAP and OAuth 2.0 Draft 13 protocols for requesting tokens, by using the following types of credentials:
    - A simple password that's created for the service identity
    - A signed SWT by using a symmetric key or X509 certificate
    - A SAML token issued by a trusted identity provider (typically, an AD FS instance)
- Support for the following token formats: JWT, SAML 1.1, SAML 2.0, and SWT.
- Simple token transformation rules.

Service identities in Access Control are typically used to implement server-to-server authentication. 

<a name='migrate-to-azure-active-directory'></a>

#### Migrate to Microsoft Entra ID

Our recommendation for this type of authentication flow is to migrate to [Microsoft Entra ID](https://azure.microsoft.com/develop/identity/signin/). Microsoft Entra ID is the cloud-based identity provider for Microsoft work or school accounts. Microsoft Entra ID is the identity provider for Microsoft 365, Azure, and much more. 

You can also use Microsoft Entra ID for server-to-server authentication by using the Microsoft Entra implementation of the OAuth client credentials grant. The following table compares the capabilities of Access Control in server-to-server authentication with those that are available in Microsoft Entra ID.

| Capability | Access Control support | Microsoft Entra ID support |
| ---------- | ----------- | ---------------- |
| How to register a web service | Create a relying party in the Access Control management portal | Create a Microsoft Entra web application in the Azure portal |
| How to register a client | Create a service identity in Access Control management portal | Create another Microsoft Entra web application in the Azure portal |
| Protocol used |- OAuth WRAP protocol<br />- OAuth 2.0 Draft 13 client credentials grant | OAuth 2.0 client credentials grant |
| Client authentication methods |- Simple password<br />- Signed SWT<br />- SAML token from a federated identity provider |- Simple password<br />- Signed JWT |
| Token formats |- JWT<br />- SAML 1.1<br />- SAML 2.0<br />- SWT<br /> | JWT only |
| Token transformation |- Add custom claims<br />- Simple if-then claim issuance logic | Add custom claims | 
| Automate configuration and management tasks | Supported via Access Control Management Service | Supported using the Microsoft Graph API |

For guidance about implementing server-to-server scenarios, see the following resources:

- Service-to-Service section of the [Microsoft Entra developer guide](../develop/index.yml)
- [Daemon code sample by using simple password client credentials](https://github.com/Azure-Samples/active-directory-dotnet-daemon)
- [Daemon code sample by using certificate client credentials](https://github.com/Azure-Samples/active-directory-dotnet-daemon-certificate-credential)

#### Migrate to Ping Identity or Auth0

In some cases, you might find that the Microsoft Entra client credentials and the OAuth grant implementation aren't sufficient to replace Access Control in your architecture without major code changes. Some common examples might include:

- Server-to-server authentication using token formats other than JWTs.
- Server-to-server authentication using an input token provided by an external identity provider.
- Server-to-server authentication with token transformation rules that Microsoft Entra ID cannot reproduce.

In these cases, you might consider migrating your web application to another cloud authentication service. We recommend exploring the following options. Each of the following options offer capabilities similar to Access Control:

![This image shows the Auth0 logo](./media/active-directory-acs-migration/rsz-auth0.png)

[Auth0](https://auth0.com/access-management) is a flexible cloud identity service that has created [high-level migration guidance for customers of Access Control](https://auth0.com/access-management), and supports nearly every feature that ACS does.

![This image shows the Ping Identity logo](./media/active-directory-acs-migration/rsz-ping.png)
[Ping Identity](https://www.pingidentity.com) offers two solutions similar to ACS. PingOne is a cloud identity service that supports many of the same features as ACS, and PingFederate is a similar on premises identity product that offers more flexibility. Refer to Ping's ACS retirement guidance for more details on using these products.

Our aim in working with Ping Identity and Auth0 is to ensure that all Access Control customers have a migration path for their apps and services that minimizes the amount of work required to move from Access Control.

#### Passthrough authentication

For passthrough authentication with arbitrary token transformation, there is no equivalent Microsoft technology to ACS. If that is what your customers need, Auth0 might be the one who provides the closest approximation solution.

## Questions, concerns, and feedback

We understand that many Access Control customers won't find a clear migration path after reading this article. You might need some assistance or guidance in determining the right plan. If you would like to discuss your migration scenarios and questions, please leave a comment on this page.
