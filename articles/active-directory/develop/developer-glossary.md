---
title: Microsoft identity platform developer glossary | Azure
description: A list of terms for commonly used Microsoft identity platform developer concepts and features.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 04/24/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: jmprieur, saeeda, jesakowi, nacanuma
---

# Microsoft identity platform developer glossary

This article contains definitions for some of the core developer concepts and terminology, which are helpful when learning about application development using Microsoft identity platform.

## access token

A type of [security token](#security-token) issued by an [authorization server](#authorization-server), and used by a [client application](#client-application) in order to access a [protected resource server](#resource-server). Typically in the form of a [JSON Web Token (JWT)][JWT], the token embodies the authorization granted to the client by the [resource owner](#resource-owner), for a requested level of access. The token contains all applicable [claims](#claim) about the subject, enabling the client application to use it as a form of credential when accessing a given resource. This also eliminates the need for the resource owner to expose credentials to the client.

Access tokens are only valid for a short period of time and cannot be revoked. An authorization server may also issue a [refresh token](#refresh-token) when the access token is issued. Refresh tokens are typically provided only to confidential client applications.

Access tokens are sometimes referred to as "User+App" or "App-Only", depending on the credentials being represented. For example, when a client application uses the:

* ["Authorization code" authorization grant](#authorization-grant), the end user authenticates first as the resource owner, delegating authorization to the client to access the resource. The client authenticates afterward when obtaining the access token. The token can sometimes be referred to more specifically as a "User+App" token, as it represents both the user that authorized the client application, and the application.
* ["Client credentials" authorization grant](#authorization-grant), the client provides the sole authentication, functioning without the resource-owner's authentication/authorization, so the token can sometimes be referred to as an "App-Only" token.

See the [Microsoft identity platform Token Reference][AAD-Tokens-Claims] for more details.

## application ID (client ID)

The unique identifier Azure AD issues to an application registration that identifies a specific application and the associated configurations. This application ID ([client ID](https://tools.ietf.org/html/rfc6749#page-15)) is used when performing authentication requests and is provided to the authentication libraries in development time. The application ID (client ID) is not a secret.

## application manifest

A feature provided by the [Azure portal][AZURE-portal], which produces a JSON representation of the application's identity configuration, used as a mechanism for updating its associated [Application][Graph-App-Resource] and [ServicePrincipal][Graph-Sp-Resource] entities. See [Understanding the Azure Active Directory application manifest][AAD-App-Manifest] for more details.

## application object

When you register/update an application in the [Azure portal][AZURE-portal], the portal creates/updates both an application object and a corresponding [service principal object](#service-principal-object) for that tenant. The application object *defines* the application's identity configuration globally (across all tenants where it has access), providing a template from which its corresponding service principal object(s) are *derived* for use locally at run-time (in a specific tenant).

For more information, see [Application and Service Principal Objects][AAD-App-SP-Objects].

## application registration

In order to allow an application to integrate with and delegate Identity and Access Management functions to Azure AD, it must be registered with an Azure AD [tenant](#tenant). When you register your application with Azure AD, you are providing an identity configuration for your application, allowing it to integrate with Azure AD and use features such as:

* Robust management of Single Sign-On using Azure AD Identity Management and [OpenID Connect][OpenIDConnect] protocol implementation
* Brokered access to [protected resources](#resource-server) by [client applications](#client-application), via OAuth 2.0 [authorization server](#authorization-server)
* [Consent framework](#consent) for managing client access to protected resources, based on resource owner authorization.

See [Integrating applications with Azure Active Directory][AAD-Integrating-Apps] for more details.

## authentication

The act of challenging a party for legitimate credentials, providing the basis for creation of a security principal to be used for identity and access control. During an [OAuth2 authorization grant](#authorization-grant) for example, the party authenticating is filling the role of either [resource owner](#resource-owner) or [client application](#client-application), depending on the grant used.

## authorization

The act of granting an authenticated security principal permission to do something. There are two primary use cases in the Azure AD programming model:

* During an [OAuth2 authorization grant](#authorization-grant) flow: when the [resource owner](#resource-owner) grants authorization to the [client application](#client-application), allowing the client to access the resource owner's resources.
* During resource access by the client: as implemented by the [resource server](#resource-server), using the [claim](#claim) values present in the [access token](#access-token) to make access control decisions based upon them.

## authorization code

A short lived "token" provided to a [client application](#client-application) by the [authorization endpoint](#authorization-endpoint), as part of the "authorization code" flow, one of the four OAuth2 [authorization grants](#authorization-grant). The code is returned to the client application in response to authentication of a [resource owner](#resource-owner), indicating the resource owner has delegated authorization to access the requested resources. As part of the flow, the code is later redeemed for an [access token](#access-token).

## authorization endpoint

One of the endpoints implemented by the [authorization server](#authorization-server), used to interact with the [resource owner](#resource-owner) in order to provide an [authorization grant](#authorization-grant) during an OAuth2 authorization grant flow. Depending on the authorization grant flow used, the actual grant provided can vary, including an [authorization code](#authorization-code) or [security token](#security-token).

See the OAuth2 specification's [authorization grant types][OAuth2-AuthZ-Grant-Types] and [authorization endpoint][OAuth2-AuthZ-Endpoint] sections, and the [OpenIDConnect specification][OpenIDConnect-AuthZ-Endpoint] for more details.

## authorization grant

A credential representing the [resource owner's](#resource-owner) [authorization](#authorization) to access its protected resources, granted to a [client application](#client-application). A client application can use one of the [four grant types defined by the OAuth2 Authorization Framework][OAuth2-AuthZ-Grant-Types] to obtain a grant, depending on client type/requirements: "authorization code grant", "client credentials grant", "implicit grant", and "resource owner password credentials grant". The credential returned to the client is either an [access token](#access-token), or an [authorization code](#authorization-code) (exchanged later for an access token), depending on the type of authorization grant used.

## authorization server

As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], the server responsible for issuing access tokens to the [client](#client-application) after successfully authenticating the [resource owner](#resource-owner) and obtaining its authorization. A [client application](#client-application) interacts with the authorization server at runtime via its [authorization](#authorization-endpoint) and [token](#token-endpoint) endpoints, in accordance with the OAuth2 defined [authorization grants](#authorization-grant).

In the case of the Microsoft identity platform application integration, the Microsoft identity platform implements the authorization server role for Azure AD applications and Microsoft service APIs, for example [Microsoft Graph APIs][Microsoft-Graph].

## claim

A [security token](#security-token) contains claims, which provide assertions about one entity (such as a [client application](#client-application) or [resource owner](#resource-owner)) to another entity (such as the [resource server](#resource-server)). Claims are name/value pairs that relay facts about the token subject (for example, the security principal that was authenticated by the [authorization server](#authorization-server)). The claims present in a given token are dependent upon several variables, including the type of token, the type of credential used to authenticate the subject, the application configuration, etc.

See the [Microsoft identity platform token reference][AAD-Tokens-Claims] for more details.

## client application

As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], an application that makes protected resource requests on behalf of the [resource owner](#resource-owner). The term "client" does not imply any particular hardware implementation characteristics (for instance, whether the application executes on a server, a desktop, or other devices).

A client application requests [authorization](#authorization) from a resource owner to participate in an [OAuth2 authorization grant](#authorization-grant) flow, and may access APIs/data on the resource owner's behalf. The OAuth2 Authorization Framework [defines two types of clients][OAuth2-Client-Types], "confidential" and "public", based on the client's ability to maintain the confidentiality of its credentials. Applications can implement a [web client (confidential)](#web-client) which runs on a web server, a [native client (public)](#native-client) installed on a device, or a [user-agent-based client (public)](#user-agent-based-client) which runs in a device's browser.

## consent

The process of a [resource owner](#resource-owner) granting authorization to a [client application](#client-application), to access protected resources under specific [permissions](#permissions), on behalf of the resource owner. Depending on the permissions requested by the client, an administrator or user will be asked for consent to allow access to their organization/individual data respectively. Note, in a [multi-tenant](#multi-tenant-application) scenario, the application's [service principal](#service-principal-object) is also recorded in the tenant of the consenting user.

See [consent framework](consent-framework.md) for more information.

## ID token

An [OpenID Connect][OpenIDConnect-ID-Token] [security token](#security-token) provided by an [authorization server's](#authorization-server) [authorization endpoint](#authorization-endpoint), which contains [claims](#claim) pertaining to the authentication of an end user [resource owner](#resource-owner). Like an access token, ID tokens are also represented as a digitally signed [JSON Web Token (JWT)][JWT]. Unlike an access token though, an ID token's claims are not used for purposes related to resource access and specifically access control.

See the [Microsoft identity platform token reference][AAD-Tokens-Claims] for more details.

## Microsoft identity platform

The Microsoft identity platform is an evolution of the Azure Active Directory (Azure AD) identity service and developer platform. It allows developers to build applications that sign in all Microsoft identities, get tokens to call Microsoft Graph, other Microsoft APIs, or APIs that developers have built. It’s a full-featured platform that consists of an authentication service, libraries, application registration and configuration, full developer documentation, code samples, and other developer content. The Microsoft identity platform supports industry standard protocols such as OAuth 2.0 and OpenID Connect.

## multi-tenant application

A class of application that enables sign in and [consent](#consent) by users provisioned in any Azure AD [tenant](#tenant), including tenants other than the one where the client is registered. [Native client](#native-client) applications are multi-tenant by default, whereas [web client](#web-client) and [web resource/API](#resource-server) applications have the ability to select between single or multi-tenant. By contrast, a web application registered as single-tenant, would only allow sign-ins from user accounts provisioned in the same tenant as the one where the application is registered.

See [How to sign in any Azure AD user using the multi-tenant application pattern][AAD-Multi-Tenant-Overview] for more details.

## native client

A type of [client application](#client-application) that is installed natively on a device. Since all code is executed on a device, it is considered a "public" client due to its inability to store credentials privately/confidentially. See [OAuth2 client types and profiles][OAuth2-Client-Types] for more details.

## permissions

A [client application](#client-application) gains access to a [resource server](#resource-server) by declaring permission requests. Two types are available:

* "Delegated" permissions, which specify [scope-based](#scopes) access using delegated authorization from the signed-in [resource owner](#resource-owner), are presented to the resource at run-time as ["scp" claims](#claim) in the client's [access token](#access-token).
* "Application" permissions, which specify [role-based](#roles) access using the client application's credentials/identity, are presented to the resource at run-time as ["roles" claims](#claim) in the client's access token.

They also surface during the [consent](#consent) process, giving the administrator or resource owner the opportunity to grant/deny the client access to resources in their tenant.

Permission requests are configured on the **API permissions** page for an application in the [Azure portal][AZURE-portal], by selecting the desired "Delegated Permissions" and "Application Permissions" (the latter requires membership in the Global Admin role). Because a [public client](#client-application) can't securely maintain credentials, it can only request delegated permissions, while a [confidential client](#client-application) has the ability to request both delegated and application permissions. The client's [application object](#application-object) stores the declared permissions in its [requiredResourceAccess property][Graph-App-Resource].

## refresh token

A type of [security token](#security-token) issued by an [authorization server](#authorization-server), and used by a [client application](#client-application) in order to request a new [access token](#access-token) before the access token expires. Typically in the form of a [JSON Web Token (JWT)][JWT].

Unlike access tokens, refresh tokens can be revoked. If a client application attempts to request a new access token using a refresh token that has been revoked, the authorization server will deny the request, and the client application will no longer have permission to access the [resource server](#resource-server) on behalf of the [resource owner](#resource-owner).

## resource owner

As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], an entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end user. For example, when a [client application](#client-application) wants to access a user's mailbox through the [Microsoft Graph API][Microsoft-Graph], it requires permission from the resource owner of the mailbox.

## resource server

As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], a server that hosts protected resources, capable of accepting and responding to protected resource requests by [client applications](#client-application) that present an [access token](#access-token). Also known as a protected resource server, or resource application.

A resource server exposes APIs and enforces access to its protected resources through [scopes](#scopes) and [roles](#roles), using the OAuth 2.0 Authorization Framework. Examples include the [Microsoft Graph API][Microsoft-Graph] which provides access to Azure AD tenant data, and the Microsoft 365 APIs that provide access to data such as mail and calendar.

Just like a client application, resource application's identity configuration is established via [registration](#application-registration) in an Azure AD tenant, providing both the application and service principal object. Some Microsoft-provided APIs, such as the Microsoft Graph API, have pre-registered service principals made available in all tenants during provisioning.

## roles

Like [scopes](#scopes), roles provide a way for a [resource server](#resource-server) to govern access to its protected resources. There are two types: a "user" role implements role-based access control for users/groups that require access to the resource, while an "application" role implements the same for [client applications](#client-application) that require access.

Roles are resource-defined strings (for example "Expense approver", "Read-only", "Directory.ReadWrite.All"), managed in the [Azure portal][AZURE-portal] via the resource's [application manifest](#application-manifest), and stored in the resource's [appRoles property][Graph-Sp-Resource]. The Azure portal is also used to assign users to "user" roles, and configure client [application permissions](#permissions) to access an "application" role.

For a detailed discussion of the application roles exposed by the Microsoft Graph API, see [Graph API Permission Scopes][Graph-Perm-Scopes]. For a step-by-step implementation example, see [Add or remove Azure role assignments using the Azure portal][AAD-RBAC].

## scopes

Like [roles](#roles), scopes provide a way for a [resource server](#resource-server) to govern access to its protected resources. Scopes are used to implement [scope-based][OAuth2-Access-Token-Scopes] access control, for a [client application](#client-application) that has been given delegated access to the resource by its owner.

Scopes are resource-defined strings (for example "Mail.Read", "Directory.ReadWrite.All"), managed in the [Azure portal][AZURE-portal] via the resource's [application manifest](#application-manifest), and stored in the resource's [oauth2Permissions property][Graph-Sp-Resource]. The Azure portal is also used to configure client application [delegated permissions](#permissions) to access a scope.

A best practice naming convention, is to use a "resource.operation.constraint" format. For a detailed discussion of the scopes exposed by Microsoft Graph API, see [Graph API Permission Scopes][Graph-Perm-Scopes]. For scopes exposed by Microsoft 365 services, see [Microsoft 365 API permissions reference][O365-Perm-Ref].

## security token

A signed document containing claims, such as an OAuth2 token or SAML 2.0 assertion. For an OAuth2 [authorization grant](#authorization-grant), an [access token](#access-token) (OAuth2), [refresh token](#refresh-token), and an [ID Token](https://openid.net/specs/openid-connect-core-1_0.html#IDToken) are types of security tokens, all of which are implemented as a [JSON Web Token (JWT)][JWT].

## service principal object

When you register/update an application in the [Azure portal][AZURE-portal], the portal creates/updates both an [application object](#application-object) and a corresponding service principal object for that tenant. The application object *defines* the application's identity configuration globally (across all tenants where the associated application has been granted access), and is the template from which its corresponding service principal object(s) are *derived* for use locally at run-time (in a specific tenant).

For more information, see [Application and Service Principal Objects][AAD-App-SP-Objects].

## sign-in

The process of a [client application](#client-application) initiating end-user authentication and capturing related state, for the purpose of acquiring a [security token](#security-token) and scoping the application session to that state. State can include artifacts such as user profile information, and information derived from token claims.

The sign-in function of an application is typically used to implement single-sign-on (SSO). It may also be preceded by a "sign-up" function, as the entry point for an end user to gain access to an application (upon first sign-in). The sign-up function is used to gather and persist additional state specific to the user, and may require [user consent](#consent).

## sign-out

The process of unauthenticating an end user, detaching the user state associated with the [client application](#client-application) session during [sign-in](#sign-in)

## tenant

An instance of an Azure AD directory is referred to as an Azure AD tenant. It provides several features, including:

* a registry service for integrated applications
* authentication of user accounts and registered applications
* REST endpoints required to support various protocols including OAuth2 and SAML, including the [authorization endpoint](#authorization-endpoint), [token endpoint](#token-endpoint) and the "common" endpoint used by [multi-tenant applications](#multi-tenant-application).

Azure AD tenants are created/associated with Azure and Microsoft 365 subscriptions during sign-up, providing Identity & Access Management features for the subscription. Azure subscription administrators can also create additional Azure AD tenants via the Azure portal. See [How to get an Azure Active Directory tenant][AAD-How-To-Tenant] for details on the various ways you can get access to a tenant. See [Associate or add an Azure subscription to your Azure Active Directory tenant][AAD-How-Subscriptions-Assoc] for details on the relationship between subscriptions and an Azure AD tenant, and for instructions on how to associate or add a subscription to an Azure AD tenant.

## token endpoint

One of the endpoints implemented by the [authorization server](#authorization-server) to support OAuth2 [authorization grants](#authorization-grant). Depending on the grant, it can be used to acquire an [access token](#access-token) (and related "refresh" token) to a [client](#client-application), or [ID token](#id-token) when used with the [OpenID Connect][OpenIDConnect] protocol.

## User-agent-based client

A type of [client application](#client-application) that downloads code from a web server and executes within a user-agent (for instance, a web browser), such as a single-page application (SPA). Since all code is executed on a device, it is considered a "public" client due to its inability to store credentials privately/confidentially. For more information, see [OAuth2 client types and profiles][OAuth2-Client-Types].

## user principal

Similar to the way a service principal object is used to represent an application instance, a user principal object is another type of security principal, which represents a user. The Microsoft Graph [User resource type][Graph-User-Resource] defines the schema for a user object, including user-related properties such as first and last name, user principal name, directory role membership, etc. This provides the user identity configuration for Azure AD to establish a user principal at run-time. The user principal is used to represent an authenticated user for Single Sign-On, recording [consent](#consent) delegation, making access control decisions, etc.

## web client

A type of [client application](#client-application) that executes all code on a web server, and able to function as a "confidential" client by securely storing its credentials on the server. For more information, see [OAuth2 client types and profiles][OAuth2-Client-Types].

## Next steps

The [Microsoft identity platform Developer's Guide][AAD-Dev-Guide] is the landing page to use for all the Microsoft identity platform development-related topics, including an overview of [application integration][AAD-How-To-Integrate] and the basics of the [Microsoft identity platform authentication and supported authentication scenarios][AAD-Auth-Scenarios]. You can also find code samples & tutorials on how to get up and running quickly on [GitHub](https://github.com/azure-samples?utf8=%E2%9C%93&q=active%20directory&type=&language=).

Use the following comments section to provide feedback and help to refine and shape this content, including requests for new definitions or updating existing ones!

<!--Image references-->

<!--Reference style links -->
[AAD-App-Manifest]:reference-app-manifest.md
[AAD-App-SP-Objects]:app-objects-and-service-principals.md
[AAD-Auth-Scenarios]:authentication-scenarios.md
[AAD-Dev-Guide]:azure-ad-developers-guide.md
[Graph-Perm-Scopes]: /graph/permissions-reference
[Graph-App-Resource]: /graph/api/resources/application
[Graph-Sp-Resource]: /graph/api/resources/serviceprincipal
[Graph-User-Resource]: /graph/api/resources/user
[AAD-How-Subscriptions-Assoc]:../fundamentals/active-directory-how-subscriptions-associated-directory.md
[AAD-How-To-Integrate]: ./active-directory-how-to-integrate.md
[AAD-How-To-Tenant]:quickstart-create-new-tenant.md
[AAD-Integrating-Apps]:quickstart-v1-integrate-apps-with-azure-ad.md
[AAD-Multi-Tenant-Overview]:howto-convert-app-to-be-multi-tenant.md
[AAD-Security-Token-Claims]: ./active-directory-authentication-scenarios/#claims-in-azure-ad-security-tokens
[AAD-Tokens-Claims]:access-tokens.md
[AZURE-portal]: https://portal.azure.com
[AAD-RBAC]: ../../role-based-access-control/role-assignments-portal.md
[JWT]: https://tools.ietf.org/html/rfc7519
[Microsoft-Graph]: https://developer.microsoft.com/graph
[O365-Perm-Ref]: /graph/permissions-reference
[OAuth2-Access-Token-Scopes]: https://tools.ietf.org/html/rfc6749#section-3.3
[OAuth2-AuthZ-Endpoint]: https://tools.ietf.org/html/rfc6749#section-3.1
[OAuth2-AuthZ-Grant-Types]: https://tools.ietf.org/html/rfc6749#section-1.3
[OAuth2-Client-Types]: https://tools.ietf.org/html/rfc6749#section-2.1
[OAuth2-Role-Def]: https://tools.ietf.org/html/rfc6749#page-6
[OpenIDConnect]: https://openid.net/specs/openid-connect-core-1_0.html
[OpenIDConnect-AuthZ-Endpoint]: https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
[OpenIDConnect-ID-Token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
