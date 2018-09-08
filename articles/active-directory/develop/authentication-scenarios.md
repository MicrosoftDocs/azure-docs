---
title: Authentication in Azure AD | Microsoft Docs
description: Provides an overview of the five most common authentication scenarios for Azure Active Directory (Azure AD)
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.assetid: 0c84e7d0-16aa-4897-82f2-f53c6c990fd9
ms.service: active-directory
ms.component: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 07/26/2018
ms.author: celested
ms.reviewer: saeeda, jmprieur, andret, nacanuma, hirsin
ms.custom: aaddev
#Customer intent: As an application developer, I can learn about the basic authentication concepts in Azure Active Directory so I understand what I need to do when I create apps that integrate Microsoft Sign-in.
---

# What is authentication?

> [!NOTE]
> CelesteD is actively rewriting this topic in this branch. Expect some weirdness and churn.

*Authentication* is the act of challenging a party for legitimate credentials, providing the basis for creation of a security principal to be used for identity and access control. In simpler terms, it's the process of proving you are who you say you are. Authentication is sometimes shortened to AuthN.

*Authorization* is the act of granting an authenticated security principal permission to do something. It specifies what data you're allowed to access and what you can do with it. Authorization is sometimes shortened to AuthZ.

Azure Active Directory (Azure AD) simplifies authentication for application developers by providing identity as a service, with support for industry-standard protocols such as OAuth 2.0 and OpenID Connect, as well as open-source libraries for different platforms to help you start coding quickly.

There are two primary use cases in the Azure AD programming model:

* During an OAuth 2.0 authorization grant flow - when the resource owner grants authorization to the client application, allowing the client to access the resource owner's resources.
* During resource access by the client - as implemented by the resource server, using the claims values present in the access token to make access control decisions based upon them.

## Authentication basics in Azure AD

Consider the most basic scenario where identity is required: a user in a web browser needs to authenticate to a web application. The following diagram shows this scenario:

![Overview of sign-on to web application](./media/authentication-scenarios/basics_of_auth_in_aad.png)

Here’s what you need to know about the various components shown in the diagram:

* Azure AD is the identity provider. The identity provider is responsible for verifying the identity of users and applications that exist in an organization’s directory, and issues security tokens upon successful authentication of those users and applications.
* An application that wants to outsource authentication to Azure AD must be registered in Azure AD. Azure AD registers and uniquely identifies the app in the directory.
* Developers can use the open-source Azure AD authentication libraries to make authentication easy by handling the protocol details for you. For more info, see Azure AD [v2.0 authentication libaries](reference-v2-libraries.md) and [v1.0 authentication libraries](active-directory-authentication-libraries.md).
* Once a user has been authenticated, the application must validate the user’s security token to ensure that authentication was successful. You can find quickstarts, tutorials, and code samples in a variety of languages and frameworks which show what the application must do.
  * To quickly build an app and add functionality like getting tokens, refreshing tokens, signing in a user, displaying some user info, and more, see the **Quickstarts** section of the documentation.
  * To get in-depth, scenario-based procedures for top auth developer tasks like obtaining access tokens and using them in calls to the Microsoft Graph API and other APIs, implementing sign-in with Microsoft with a traditional web browser-based app using OpenID Connect, and more, see the **Tutorials** section of the documentation.
  * To download code samples, go to [GitHub](https://github.com/Azure-Samples?q=active-directory).
* The flow of requests and responses for the authentication process is determined by the authentication protocol that you used, such as OAuth 2.0, OpenID Connect, WS-Federation, or SAML 2.0. For more info about protocols, see the **Concepts > Protocols** section of the documentation.

Now that you have an overview of the basics, read on to understand the identity app model and API.

## App model and API

In the example scenario above, you can classify the apps according to these two roles:

* Apps that need to securely access resources
* Apps that play the role of the resource itself

TBD

Now that you have an overview of the basics, read on to understand how provisioning works in Azure AD and the common scenarios that Azure AD supports.

## Claims in Azure AD security tokens

Security tokens (access and ID tokens) issued by Azure AD contain claims, or assertions of information about the subject that has been authenticated. These claims can be used by the application for various tasks. For example, applications can use claims to validate the token, identify the subject's directory tenant, display user information, determine the subject's authorization, and so on. The claims present in any given security token are dependent upon the type of token, the type of credential used to authenticate the user, and the application configuration. A brief description of each type of claim emitted by Azure AD is provided in the table below. For more information, refer to [Supported token and claim types](v1-id-and-access-tokens.md).

| Claim | Description |
| --- | --- |
| Application ID | Identifies the application that is using the token. |
| Audience | Identifies the recipient resource the token is intended for. |
| Application Authentication Context Class Reference | Indicates how the client was authenticated (public client vs. confidential client). |
| Authentication Instant | Records the date and time when the authentication occurred. |
| Authentication Method | Indicates how the subject of the token was authenticated (password, certificate, etc.). |
| First Name | Provides the given name of the user as set in Azure AD. |
| Groups | Contains object IDs of Azure AD groups that the user is a member of. |
| Identity Provider | Records the identity provider that authenticated the subject of the token. |
| Issued At | Records the time at which the token was issued, often used for token freshness. |
| Issuer | Identifies the STS that emitted the token as well as the Azure AD tenant. |
| Last Name | Provides the surname of the user as set in Azure AD. |
| Name | Provides a human readable value that identifies the subject of the token. |
| Object ID | Contains an immutable, unique identifier of the subject in Azure AD. |
| Roles | Contains friendly names of Azure AD Application Roles that the user has been granted. |
| Scope | Indicates the permissions granted to the client application. |
| Subject | Indicates the principal about which the token asserts information. |
| Tenant ID | Contains an immutable, unique identifier of the directory tenant that issued the token. |
| Token Lifetime | Defines the time interval within which a token is valid. |
| User Principal Name | Contains the user principal name of the subject. |
| Version | Contains the version number of the token. |

## Basics of registering an application in Azure AD

Any application that outsources authentication to Azure AD must be registered in a directory. This step involves telling Azure AD about your application, including the URL where it’s located, the URL to send replies after authentication, the URI to identify your application, and more. This information is required for a few key reasons:

* Azure AD needs to communicate with the application when handling sign-on or exchanging tokens. The information passed between Azure AD and the application includes the following:
  
  * **Application ID URI** - The identifier for an application. This value is sent to Azure AD during authentication to indicate which application the caller wants a token for. Additionally, this value is included in the token so that the application knows it was the intended target.
  * **Reply URL** and **Redirect URI** - For a web API or web application, the Reply URL is the location where Azure AD will send the authentication response, including a token if authentication was successful. For a native application, the Redirect URI is a unique identifier to which Azure AD will redirect the user-agent in an OAuth 2.0 request.
  * **Application ID** - The ID for an application, which is generated by Azure AD when the application is registered. When requesting an authorization code or token, the Application ID and Key are sent to Azure AD during authentication.
  * **Key** - The key that is sent along with an Application ID when authenticating to Azure AD to call a web API.
* Azure AD needs to ensure the application has the required permissions to access your directory data, other applications in your organization, and so on.

Provisioning becomes clearer when you understand that there are two categories of applications that can be developed and integrated with Azure AD:

* **Single tenant application** - A single tenant application is intended for use in one organization. These are typically line-of-business (LoB) applications written by an enterprise developer. A single tenant application only needs to be accessed by users in one directory, and as a result, it only needs to be provisioned in one directory. These applications are typically registered by a developer in the organization.
* **Multi-tenant application** - A multi-tenant application is intended for use in many organizations, not just one organization. These are typically software-as-a-service (SaaS) applications written by an independent software vendor (ISV). Multi-tenant applications need to be provisioned in each directory where they will be used, which requires user or administrator consent to register them. This consent process starts when an application has been registered in the directory and is given access to the Graph API or perhaps another web API. When a user or administrator from a different organization signs up to use the application, they are presented with a dialog that displays the permissions the application requires. The user or administrator can then consent to the application, which gives the application access to the stated data, and finally registers the application in their directory. For more information, see [Overview of the Consent Framework](quickstart-v1-integrate-apps-with-azure-ad.md#overview-of-the-consent-framework).

### Additional considerations when developing single tenant or multi-tenant apps

Some additional considerations arise when developing a multi-tenant application instead of a single tenant application. For example, if you are making your application available to users in multiple directories, you need a mechanism to determine which tenant they’re in. A single tenant application only needs to look in its own directory for a user, while a multi-tenant application needs to identify a specific user from all the directories in Azure AD. To accomplish this task, Azure AD provides a common authentication endpoint where any multi-tenant application can direct sign-in requests, instead of a tenant-specific endpoint. This endpoint is https://login.microsoftonline.com/common for all directories in Azure AD, whereas a tenant-specific endpoint might be https://login.microsoftonline.com/contoso.onmicrosoft.com. The common endpoint is especially important to consider when developing your application because you’ll need the necessary logic to handle multiple tenants during sign-in, sign-out, and token validation.

If you are currently developing a single tenant application but want to make it available to many organizations, you can easily make changes to the application and its configuration in Azure AD to make it multi-tenant capable. In addition, Azure AD uses the same signing key for all tokens in all directories, whether you are providing authentication in a single tenant or multi-tenant application.

Each scenario listed in this document includes a subsection that describes its provisioning requirements. For more in-depth information about provisioning an application in Azure AD and the differences between single and multi-tenant applications, see [Integrating applications with Azure Active Directory](quickstart-v1-integrate-apps-with-azure-ad.md) for more information. Continue reading to understand the common application scenarios in Azure AD.

<!--- existing content

 This article will help you understand the various scenarios Azure AD supports and show you how to get started. It’s divided into the following sections:

* [Basics of authentication in Azure AD](#basics-of-authentication-in-azure-ad)
* [Claims in Azure AD security tokens](#claims-in-azure-ad-security-tokens)
* [Basics of registering an application in Azure AD](#basics-of-registering-an-application-in-azure-ad)
* [Application types and scenarios](#application-types-and-scenarios)

  * [Web browser to web application](#web-browser-to-web-application)
  * [Single Page Application (SPA)](#single-page-application-spa)
  * [Native application to web API](#native-application-to-web-api)
  * [Web application to web API](#web-application-to-web-api)
  * [Daemon or server application to web API](#daemon-or-server-application-to-web-api)

## Basics of authentication in Azure AD

If you are unfamiliar with basic concepts of authentication in Azure AD, read this section. Otherwise, you may want to skip down to [Application types and scenarios](#application-types-and-scenarios).

Let’s consider the most basic scenario where identity is required: a user in a web browser needs to authenticate to a web application. This scenario is described in greater detail in the [Web browser to web application](#web-browser-to-web-application) section, but it’s a useful starting point to illustrate the capabilities of Azure AD and conceptualize how the scenario works. Consider the following diagram for this scenario:

![Overview of sign-on to web application](./media/authentication-scenarios/basics_of_auth_in_aad.png)

With the diagram above in mind, here’s what you need to know about its various components:

* Azure AD is the identity provider, responsible for verifying the identity of users and applications that exist in an organization’s directory, and ultimately issuing security tokens upon successful authentication of those users and applications.
* An application that wants to outsource authentication to Azure AD must be registered in Azure AD, which registers and uniquely identifies the app in the directory.
* Developers can use the open-source Azure AD authentication libraries to make authentication easy by handling the protocol details for you. For more information, see [Azure Active Directory Authentication Libraries](active-directory-authentication-libraries.md).
* Once a user has been authenticated, the application must validate the user’s security token to ensure that authentication was successful. We have samples of what the application must do in a variety of languages and frameworks on [GitHub](https://github.com/Azure-Samples?q=active-directory). If you're building a web app in ASP.NET, see the [add sign-in for an ASP.NET web app guide](https://docs.microsoft.com/azure/active-directory/develop/guidedsetups/active-directory-aspnetwebapp). If you’re building a web API resource in ASP.NET, see the [web API getting started guide](https://docs.microsoft.com/azure/active-directory/develop/active-directory-devquickstarts-webapi-dotnet).
* The flow of requests and responses for the authentication process is determined by the authentication protocol that was used, such as OAuth 2.0, OpenID Connect, WS-Federation, or SAML 2.0. These protocols are discussed in more detail in the [Azure Active Directory authentication protocols](active-directory-authentication-protocols.md) article and in the sections below.

> [!NOTE]
> Azure AD supports the OAuth 2.0 and OpenID Connect standards that make extensive use of bearer tokens, including bearer tokens represented as JWTs. A *bearer token* is a lightweight security token that grants the “bearer” access to a protected resource. In this sense, the “bearer” is any party that can present the token. Though a party must first authenticate with Azure AD to receive the bearer token, if the required steps are not taken to secure the token in transmission and storage, it can be intercepted and used by an unintended party. While some security tokens have a built-in mechanism for preventing unauthorized parties from using them, bearer tokens do not have this mechanism and must be transported in a secure channel such as transport layer security (HTTPS). If a bearer token is transmitted in the clear, a man-in-the-middle attack can be used by a malicious party to acquire the token and use it for an unauthorized access to a protected resource. The same security principles apply when storing or caching bearer tokens for later use. Always ensure that your application transmits and stores bearer tokens in a secure manner. For more security considerations on bearer tokens, see [RFC 6750 Section 5](http://tools.ietf.org/html/rfc6750).

Now that you have an overview of the basics, read the sections below to understand how provisioning works in Azure AD and the common scenarios that Azure AD supports.

## Claims in Azure AD security tokens

Security tokens (access and ID tokens) issued by Azure AD contain claims, or assertions of information about the subject that has been authenticated. These claims can be used by the application for various tasks. For example, applications can use claims to validate the token, identify the subject's directory tenant, display user information, determine the subject's authorization, and so on. The claims present in any given security token are dependent upon the type of token, the type of credential used to authenticate the user, and the application configuration. A brief description of each type of claim emitted by Azure AD is provided in the table below. For more information, refer to [Supported token and claim types](v1-id-and-access-tokens.md).

| Claim | Description |
| --- | --- |
| Application ID | Identifies the application that is using the token. |
| Audience | Identifies the recipient resource the token is intended for. |
| Application Authentication Context Class Reference | Indicates how the client was authenticated (public client vs. confidential client). |
| Authentication Instant | Records the date and time when the authentication occurred. |
| Authentication Method | Indicates how the subject of the token was authenticated (password, certificate, etc.). |
| First Name | Provides the given name of the user as set in Azure AD. |
| Groups | Contains object IDs of Azure AD groups that the user is a member of. |
| Identity Provider | Records the identity provider that authenticated the subject of the token. |
| Issued At | Records the time at which the token was issued, often used for token freshness. |
| Issuer | Identifies the STS that emitted the token as well as the Azure AD tenant. |
| Last Name | Provides the surname of the user as set in Azure AD. |
| Name | Provides a human readable value that identifies the subject of the token. |
| Object ID | Contains an immutable, unique identifier of the subject in Azure AD. |
| Roles | Contains friendly names of Azure AD Application Roles that the user has been granted. |
| Scope | Indicates the permissions granted to the client application. |
| Subject | Indicates the principal about which the token asserts information. |
| Tenant ID | Contains an immutable, unique identifier of the directory tenant that issued the token. |
| Token Lifetime | Defines the time interval within which a token is valid. |
| User Principal Name | Contains the user principal name of the subject. |
| Version | Contains the version number of the token. |

## Basics of registering an application in Azure AD

Any application that outsources authentication to Azure AD must be registered in a directory. This step involves telling Azure AD about your application, including the URL where it’s located, the URL to send replies after authentication, the URI to identify your application, and more. This information is required for a few key reasons:

* Azure AD needs to communicate with the application when handling sign-on or exchanging tokens. The information passed between Azure AD and the application includes the following:
  
  * **Application ID URI** - The identifier for an application. This value is sent to Azure AD during authentication to indicate which application the caller wants a token for. Additionally, this value is included in the token so that the application knows it was the intended target.
  * **Reply URL** and **Redirect URI** - For a web API or web application, the Reply URL is the location where Azure AD will send the authentication response, including a token if authentication was successful. For a native application, the Redirect URI is a unique identifier to which Azure AD will redirect the user-agent in an OAuth 2.0 request.
  * **Application ID** - The ID for an application, which is generated by Azure AD when the application is registered. When requesting an authorization code or token, the Application ID and Key are sent to Azure AD during authentication.
  * **Key** - The key that is sent along with an Application ID when authenticating to Azure AD to call a web API.
* Azure AD needs to ensure the application has the required permissions to access your directory data, other applications in your organization, and so on.

Provisioning becomes clearer when you understand that there are two categories of applications that can be developed and integrated with Azure AD:

* **Single tenant application** - A single tenant application is intended for use in one organization. These are typically line-of-business (LoB) applications written by an enterprise developer. A single tenant application only needs to be accessed by users in one directory, and as a result, it only needs to be provisioned in one directory. These applications are typically registered by a developer in the organization.
* **Multi-tenant application** - A multi-tenant application is intended for use in many organizations, not just one organization. These are typically software-as-a-service (SaaS) applications written by an independent software vendor (ISV). Multi-tenant applications need to be provisioned in each directory where they will be used, which requires user or administrator consent to register them. This consent process starts when an application has been registered in the directory and is given access to the Graph API or perhaps another web API. When a user or administrator from a different organization signs up to use the application, they are presented with a dialog that displays the permissions the application requires. The user or administrator can then consent to the application, which gives the application access to the stated data, and finally registers the application in their directory. For more information, see [Overview of the Consent Framework](quickstart-v1-integrate-apps-with-azure-ad.md#overview-of-the-consent-framework).

### Additional considerations when developing single tenant or multi-tenant apps
Some additional considerations arise when developing a multi-tenant application instead of a single tenant application. For example, if you are making your application available to users in multiple directories, you need a mechanism to determine which tenant they’re in. A single tenant application only needs to look in its own directory for a user, while a multi-tenant application needs to identify a specific user from all the directories in Azure AD. To accomplish this task, Azure AD provides a common authentication endpoint where any multi-tenant application can direct sign-in requests, instead of a tenant-specific endpoint. This endpoint is https://login.microsoftonline.com/common for all directories in Azure AD, whereas a tenant-specific endpoint might be https://login.microsoftonline.com/contoso.onmicrosoft.com. The common endpoint is especially important to consider when developing your application because you’ll need the necessary logic to handle multiple tenants during sign-in, sign-out, and token validation.

If you are currently developing a single tenant application but want to make it available to many organizations, you can easily make changes to the application and its configuration in Azure AD to make it multi-tenant capable. In addition, Azure AD uses the same signing key for all tokens in all directories, whether you are providing authentication in a single tenant or multi-tenant application.

Each scenario listed in this document includes a subsection that describes its provisioning requirements. For more in-depth information about provisioning an application in Azure AD and the differences between single and multi-tenant applications, see [Integrating applications with Azure Active Directory](quickstart-v1-integrate-apps-with-azure-ad.md) for more information. Continue reading to understand the common application scenarios in Azure AD.

## Application Types and Scenarios

Each of the scenarios described here can be developed using various languages and platforms. They are all backed by complete code samples available in the [Code Samples guide](sample-v1-code.md), or directly from the corresponding [GitHub sample repositories](https://github.com/Azure-Samples?q=active-directory). In addition, if your application needs a specific piece or segment of an end-to-end scenario, in most cases that functionality can be added independently. For example, if you have a native application that calls a web API, you can easily add a web application that also calls the web API. The following diagram illustrates these scenarios and application types, and how different components can be added:

![Application Types and scenarios](./media/authentication-scenarios/application_types_and_scenarios.png)

These are the five primary application scenarios supported by Azure AD:

* [Web browser to web application](#web-browser-to-web-application): A user needs to sign in to a web application that is secured by Azure AD.
* [Single Page Application (SPA)](#single-page-application-spa): A user needs to sign in to a single page application that is secured by Azure AD.
* [Native application to web API](#native-application-to-web-api): A native application that runs on a phone, tablet, or PC needs to authenticate a user to get resources from a web API that is secured by Azure AD.
* [Web application to web API](#web-application-to-web-api): A web application needs to get resources from a web API secured by Azure AD.
* [Daemon or server application to web API](#daemon-or-server-application-to-web-api): A daemon application or a server application with no web user interface needs to get resources from a web API secured by Azure AD.


### Daemon or server application to web API

This section describes a daemon or server application that needs to get resources from a web API. There are two sub-scenarios that apply to this section: A daemon that needs to call a web API, built on OAuth 2.0 client credentials grant type; and a server application (such as a web API) that needs to call a web API, built on OAuth 2.0 On-Behalf-Of draft specification.

For the scenario when a daemon application needs to call a web API, it’s important to understand a few things. First, user interaction is not possible with a daemon application, which requires the application to have its own identity. An example of a daemon application is a batch job, or an operating system service running in the background. This type of application requests an access token by using its application identity and presenting its Application ID, credential (password or certificate), and application ID URI to Azure AD. After successful authentication, the daemon receives an access token from Azure AD, which is then used to call the web API.

For the scenario when a server application needs to call a web API, it’s helpful to use an example. Imagine that a user has authenticated on a native application, and this native application needs to call a web API. Azure AD issues a JWT access token to call the web API. If the web API needs to call another downstream web API, it can use the on-behalf-of flow to delegate the user’s identity and authenticate to the second-tier web API.

#### Diagram

![Daemon or Server Application to Web API diagram](./media/authentication-scenarios/daemon_server_app_to_web_api.png)

#### Description of protocol flow

##### Application identity with OAuth 2.0 client credentials grant

1. First, the server application needs to authenticate with Azure AD as itself, without any human interaction such as an interactive sign-on dialog. It makes a request to Azure AD’s token endpoint, providing the credential, Application ID, and application ID URI.
1. Azure AD authenticates the application and returns a JWT access token that is used to call the web API.
1. Over HTTPS, the web application uses the returned JWT access token to add the JWT string with a “Bearer” designation in the Authorization header of the request to the web API. The web API then validates the JWT token, and if validation is successful, returns the desired resource.

##### Delegated user identity with OAuth 2.0 On-Behalf-Of Draft Specification

The flow discussed below assumes that a user has been authenticated on another application (such as a native application), and their user identity has been used to acquire an access token to the first-tier web API.

1. The native application sends the access token to the first-tier web API.
1. The first-tier web API sends a request to Azure AD’s token endpoint, providing its Application ID and credentials, as well as the user’s access token. In addition, the request is sent with an on_behalf_of parameter that indicates the web API is requesting new tokens to call a downstream web API on behalf of the original user.
1. Azure AD verifies that the first-tier web API has permissions to access the second-tier web API and validates the request, returning a JWT access token and a JWT refresh token to the first-tier web API.
1. Over HTTPS, the first-tier web API then calls the second-tier web API by appending the token string in the Authorization header in the request. The first-tier web API can continue to call the second-tier web API as long as the access token and refresh tokens are valid.

#### Code samples

See the code samples for Daemon or Server Application to Web API scenarios. And, check back frequently -- new samples are added frequently. [Server or Daemon Application to Web API](sample-v1-code.md#daemon-applications-accessing-web-apis-with-the-applications-identity)

#### Registering

* Single Tenant: For both the application identity and delegated user identity cases, the daemon or server application must be registered in the same directory in Azure AD. The web API can be configured to expose a set of permissions, which are used to limit the daemon or server’s access to its resources. If a delegated user identity type is being used, the server application needs to select the desired permissions from the “Permissions to Other Applications” drop-down menu in the Azure portal. This step is not required if the application identity type is being used.
* Multi-Tenant: First, the daemon or server application is configured to indicate the permissions it requires to be functional. This list of required permissions is shown in a dialog when a user or administrator in the destination directory gives consent to the application, which makes it available to their organization. Some applications only require user-level permissions, which any user in the organization can consent to. Other applications require administrator-level permissions, which a user in the organization cannot consent to. Only a directory administrator can give consent to applications that require this level of permissions. When the user or administrator consents, both of the web APIs are registered in their directory.

#### Token expiration

When the first application uses its authorization code to get a JWT access token, it also receives a JWT refresh token. When the access token expires, the refresh token can be used to re-authenticate the user without prompting for credentials. This refresh token is then used to authenticate the user, which results in a new access token and refresh token.

## See Also

[Azure Active Directory Developer's Guide](azure-ad-developers-guide.md)

[Azure Active Directory Code Samples](sample-v1-code.md)

[Important Information About Signing Key Rollover in Azure AD](active-directory-signing-key-rollover.md)

[OAuth 2.0 in Azure AD](https://msdn.microsoft.com/library/azure/dn645545.aspx)
--->