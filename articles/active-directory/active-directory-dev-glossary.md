<properties
   pageTitle="Azure Active Directory Developer Glossary | Microsoft Azure"
   description="A list of terms for commonly used Azure Active Directory developer concepts and features."
   services="active-directory"
   documentationCenter=""
   authors="bryanla"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/18/2016"
   ms.author="bryanla"/>

# Azure Active Directory developer glossary
This article contains definitions for a list of core Azure Active Directory (AD) developer concepts, which are helpful when learning about application development for Azure AD.

## access token 
A type of [security token](#security-token) issued by an [authorization server](#authorization-server), and used by a [client application](#client-application) in order to access a [protected resource server](#resource-server). Typically in the form of a [JSON Web Token (JWT)][JWT], the token embodies the authorization granted to the client by the [resource owner](#resource-owner) for a requested level of access. The token contains all applicable [claims](#claim) about the subject, enabling the client application to use it as a form of credential when accessing a given resource, in lieu of the resource owner needing to expose its credentials to the client. 

Access tokens are sometimes referred to as "User+App" or "App-Only", depending on the credentials being represented. For example, when a client application uses the:

- ["Authorization code" authorization grant](#authorization-grant), the end-user authenticates first as the resource owner, delegating authorization to the client to access the resource. The client authenticates afterward when obtaining the access token. The token can sometimes be referred to more specifically as an "User+App" token, as it represents both the user that authorized the client application, and the  application. 
- ["Client credentials" authorization grant](#authorization-grant), the client provides the sole authentication, functioning without the resource-owner's authentication/authorization, so the token can sometimes be referred to as an "App-Only" token.

See [Supported Tokens and Claims][AAD-Tokens-Claims] for more details.

## application manifest  
A feature provided by the [Azure classic portal][AZURE-classic-portal], which produces a JSON representation of the application's identity configuration, used as a mechanism for updating its associated [Application][AAD-Graph-App-Entity] and [ServicePrincipal][AAD-Graph-Sp-Entity] entities. See [Understanding the Azure Active Directory application manifest][AAD-App-Manifest] for more details.

## application object  
When you register/update an application in the [Azure classic portal][AZURE-classic-portal], the portal creates/updates both an application object and a corresponding [service principal](#service-principal-object) object for that tenant. The application object *defines* the application's identity configuration globally (across all tenants where it has access), and is the template from which its corresponding service principal object(s) are *derived* for use locally at run-time (in a specific tenant).

See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.

## application registration  
In order to allow an application to integrate with and delegate Identity and Access Management functions to Azure AD, it must be registered with an Azure AD [tenant](#tenant). When you register your application with Azure AD, you are providing an identity configuration for your application, allowing it to integrate with Azure AD and use features such as:

- Robust management of Single Sign-On using Azure AD Identity Management and [OpenID Connect][OpenIDConnect] protocol implementation
- Brokered access to [protected resources](#resource-server) by [client applications](#client-application), via Azure AD's OAuth 2.0 [authorization server](#authorization-server) implementation
- [Consent framework](#consent) for managing multi-tenant client access to resources outside of its home tenant

See [Integrating applications with Azure Active Directory][AAD-Integrating-Apps] for more details.

## authentication
The act of challenging a party for legitimate credentials, providing the basis for creation of a security principal to be used for identity and access control. During an OAuth2 [OAuth2 authorization grant](#authorization-grant) for example, the party authenticating is filling the role of either [resource owner](#resource-owner) or [client application](#client-application), depending on the grant used.

## authorization
The act of granting an authenticated security principal permission to do something. There are two primary use cases in the Azure AD programming model:

- During an [OAuth2 authorization grant](#authorization-grant) flow: when the [resource owner](#resource-owner) grants authorization to the [client application](#client-application), allowing the client to access the resource owner's resources.
- During resource access by the client: as implemented by the [resource server](#resource-server), using the [claim](#claim) values present in the [access token](#access-token) to make access control decisions based upon them.

## authorization code
A short lived "token" provided to a [client application](#client-application) by the [authorization endpoint](#authorization-endpoint), as part of the "authorization code" flow, one of the four OAuth2 [authorization grants](#authorization-grant). The code is returned to the client application in response to authentication of a [resource owner](#resource-owner), indicating the resource owner has delegated authorization to the client application to access resources on its behalf. As part of the flow, the code is later redeemed for an [access token](#access-token).

## authorization endpoint
One of the endpoints implemented by the [authorization server](#authorization-server), used to interact with the [resource owner](#resource-owner) in order to provide an [authorization grant](#authorization-grant) during an OAuth2 [authorization grant flow](#authorization-grant). Depending on the authorization grant flow used, the actual grant provided can vary, including an [authorization code](#authorization-code) or [security token](#security-token).

See the OAuth2 specification's [authorization grant types][OAuth2-AuthZ-Grant-Types] and [authorization endpoint][OAuth2-AuthZ-Endpoint] sections, and the [OpenIDConnect specification][OpenIDConnect-AuthZ-Endpoint] for more details.

## authorization grant
A credential representing the [resource owner's](#resource-owner) [authorization](#authorization) to access its protected resources, granted to a [client application](#client-application). A client application can use one of the [four grant types defined by the OAuth2 Authorization Framework][OAuth2-AuthZ-Grant-Types] to obtain a grant, depending on client type/requirements: "authorization code grant", "client credentials grant", "implicit grant", and "resource owner password credentials grant". The credential returned to the client is either an [access token](#access-token), or an [authorization code](#authorization-code) (which is later exchanged for an access token), depending on the type of authorization grant flow used. 

## authorization server
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], the server responsible for issuing access tokens to the [client](#client-application) after successfully authenticating the [resource owner](#resource-owner) and obtaining its authorization. A [client application](#client-applicatoin) interacts with the authorization server at runtime via its [authorization](#authorization-endpoint) and [token](#token-endpoint) endpoints, in accordance with the OAuth2 defined [authorization grants](#authorization grant).

In the case of Azure AD application integration, Azure AD implements the authorization server role for Azure AD applications and Microsoft service APIs, for example [Microsoft Graph APIs][Microsoft-Graph].

## claim
A [security token](#security-token) contain claims, which provide assertions about one entity (eg: a [client application](#client-application) or [resource owner](#resource-owner)) to another entity (eg: the [resource server](#resource-server)). Claims are name/value pairs that relay facts about the token subject (eg: the security principal that was authenticated by the [authorization server](#authorization-server)). The claims present in a given token are dependent upon several variables, including the type of token, the type of credential used to authenticate the subject, the application configuration, etc.

See [Supported Tokens and Claims][AAD-Tokens-Claims] for more details.

## client application  
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], an application that makes protected resource requests on behalf of the [resource owner](#resource-owner). The term "client" does not imply any particular hardware implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices).  

A client application requests [authorization](#authorization) from a resource owner to participate in an [OAuth2 authorization grant](#authorization-grant) flow, and may access APIs/data on the resource owner's behalf. The OAuth2 Authorization Framework [defines two types of clients][OAuth2-Client-Types], "confidential" and "public", based on the client's ability to maintain the confidentiality of its credentials. Applications can implement a [web client (confidential)](#web-client) which runs on a web server, a [native client (public)](#native-client) application installed on a device, and a [user-agent-based client (public)](#user-agent-based) which runs in a device's browser.

## consent
The process of a [resource owner](#resource-owner) granting authorization to a [client application](#client-application), specific [permissions](#permissions) to access protected resources, on behalf of the resource owner. Depending on the permissions requested by the client, an administrator or user will be asked to consent to allow access to their organization/individual data respectively. Note, in a [multi-tenant](#multi-tenant-application) scenario, the application's [service principal](#service-principal-object) is also recorded in the tenant of the consenting user.

## ID token
An [OpenID Connect][OpenIDConnect-ID-Token] [security token](#security-token) provided by an [authorization server's](#authorization-server) [authorization endpoint](#authorization-endpoint), which contains [claims](#claim) pertaining to the authentication of an end-user [resource owner](#resource-owner). Like an access token, ID tokens are also represented as a digitally signed [JSON Web Token (JWT)][JWT]. Unlike an access token though, an ID token's claims are not used for purposes related to resource access and specifically access control.

See [Supported Tokens and Claims][AAD-Tokens-Claims] for more details.

## multi-tenant application
A class of [client application](#client-application) registered in Azure AD, designed to permit sign in and [consent](#consent) from user accounts that are provisioned in any Azure AD [tenant](#tenant), including tenants other than the one in which the client was originally registered. By contrast, an application registered as single-tenant, would only allow sign-ins from user accounts provisioned in the same tenant as the one where the application is registered. [Native client](#native-client) applications are multi-tenant by default, whereas [web client](#web-client) applications have the ability to select between single and multi-tenant.

See [How to sign in any Azure AD user using the multi-tenant application pattern][AAD-Multi-Tenant-Overview] for more details.

## native client
A type of [client application](#client-application) that is installed natively on a device. Since all code is executed on a device, it is considered a "public" client due to its inability to store credentials privately/confidentially. See [OAuth2 client types and profiles][OAuth2-Client-Types] for more details.

## permissions
A [client application](#client-application) gains access to a [resource server](#resource-server) by declaring permission requests. Two types are available: 

- "Delegated" permissions, which request [scope-based](#scopes) access under delegated authorization from the signed-in [resource owner](#resource-owner), and manifest at run-time as ["scp" claims](#claim) in the client's [access token](#access-token).
- "Application" permissions, which request [role-based ](#roles) access under the client application's credentials/identity, and manifest at run-time as ["roles" claims](#claim) in the client's access token. 

They also surface during the [consent](#consent) process, giving the administrator or resource owner the opportunity to grant/deny the client access to resources in their tenant.

Permission requests are configured on the "Applications" / "Configure" tab in the [Azure classic portal][AZURE-classic-portal], under "Permissions to other applications", by selecting the desired "Delegated Permissions" and "Application Permissions" (the latter requires membership in the Global Admin role). Because a [public client](#client-application) can't maintain credentials, it can only request delegated permissions, while a [confidential client](#client-application) has the ability to request both delegated and application permissions. The client's [application object](#application-object) stores the declared permissions in its [requiredResourceAccess property][AAD-Graph-App-Entity].

## resource owner
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], an entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user. For example, when a [client application](#client-application) wants to access a user's mailbox through the [Microsoft Graph API][Microsoft-Graph], it requires permission from the resource owner of the mailbox.

## resource server
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], the server hosting the protected resources, capable of accepting and responding to protected resource requests by [client applications](#client-application) using access tokens. Also known as a protected resource server, or resource application.

A resource server exposes APIs and enforces access to its protected resources through [scopes](#scopes) and [roles](#roles), using the OAuth 2.0 Authorization Framework. Examples include the Azure AD Graph API that provides access to Azure AD tenant data, and the Office 365 APIs that provide access to data such as mail, calendar, and documents.  

Just like a client application, resource application's identity configuration is established via registration in an Azure AD tenant, providing both the application and service principal object. (Note: some Microsoft-provided APIs such as the Azure AD Graph API have pre-registered service principals made available in all tenants during provisioning.)

## roles
Like [scopes](#scopes), roles provide a way for a [resource server](#resource-server) to govern access to its protected resources. There are two types: a "user" role implements role-based access control for users/groups that require access to the resource, while an "application" role implements the same for [client applications](#client-application) that require access. 

Roles are resource-defined strings (ie: "Expense approver" or "Read-only"), managed in the [Azure classic portal][AZURE-classic-portal] via the resource's [application manifest](#application-manifest), and stored in the resource's [appRoles property][AAD-Graph-Sp-Entity]. A client application requests [permission](#permissions) to access an "application" role, which is presented to the resource at run-time in the ["roles" claim](#claim) of the client's [access token](#access-token). Azure AD administrators can assign users to "user" roles via the [Azure classic portal][AZURE-classic-portal].

For a detailed discussion of the application roles exposed by Azure AD's Graph API, see [Graph API Permission Scopes][AAD-Graph-Perm-Scopes]. For a step-by-step implementation example, see [Role based access control in cloud applications using Azure AD][Duyshant-Role-Blog]. 

## scopes
Like [roles](#roles), scopes provide a way for a [resource server](#resource-server) to govern access to its protected resources. Scopes are used to implement [scope-based][OAuth2-Access-Token-Scopes] access control, for a [client application](#client-application) that has been given delegated access to the resource by its owner. 

Scopes are resource-defined strings (ie: "Mail.Read" or "Directory.ReadWrite.All"), managed in the [Azure classic portal][AZURE-classic-portal] via the resource's [application manifest](#application-manifest), and stored in the resource's [oauth2Permissions property][AAD-Graph-Sp-Entity]. A client application requests [permission](#permissions) to access, which is presented to the resource at run-time in the ["scp" claim](#claim) of the client's [access token](#access-token).

A best practice naming convention, is to use a "resource.operation.constraint" format. For a detailed discussion of the scopes exposed by Azure AD's Graph API, see [Graph API Permission Scopes][AAD-Graph-Perm-Scopes]. For scopes exposed by Office 365 services, see [Office 365 API permissions reference][O365-Perm-Ref]. 

## security token
A signed document containing claims, such as an OAuth2 token or SAML 2.0 assertion. In the case of an OAuth 2.0 [authorization grant](#authorization-grant), an [access token](#access-token) (OAuth2) and an [ID Token](OpenID Connect) are a type of security token, both of which are implemented as a [JSON Web Token (JWT)][JWT].

## service principal object
When you register/update an application in the [Azure classic portal][AZURE-classic-portal], the portal creates/updates both an [application object](#application-object) and a corresponding service principal object for that tenant. The application object *defines* the application's identity configuration globally (across all tenants where it has access), and is the template from which its corresponding service principal object(s) are *derived* for use locally at run-time (in a specific tenant).

See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.

## sign-in
The process of a [client application](#client-application) initiating end-user authentication and capturing related state following authentication, for the purpose of acquiring a [security token](#security-token) and scoping the application session to that state. State can include artifacts such as user profile information, and information derived from token claims. 

The sign-in function of an application is typically used to implement single-sign-on (SSO), and may be preceded by a "sign-up" function which is the entry point for an end-user to gain access to an application (upon first sign-in). The sign-up function is used to gather and store additional state specific to the user.

## sign-out
The process of un-authenticating an end-user, detaching the user state associated with the [client application](#client-application) session during [sign-in](#sign-in)

## tenant
An instance of an Azure AD directory is referred to as an Azure AD tenant. It provides a variety of features, including a registry service for integrated applications, authentication of user accounts and registered applications, and the REST endpoints required to support various protocols including OAuth2 and SAML. Endpoints include the [authorization endpoint](#authorization-endpoint), [token endpoint](#token-endpoint) and the "common" endpoint used by [multi-tenant applications](#multi-tenant-application).

See [How to get an Azure Active Directory tenant][AAD-How-To-Tenant] for details on the various ways you can get access to a tenant.

## token endpoint
One of the endpoints implemented by the [authorization server](#authorization-server) to support OAuth2 [authorization grants](#authorization-grant). 

In the case of the [authorization code grant](#authorization-grant), it's used to provide an [access token](#access-token) (and potentially a "refresh" token) in exchange for an [authorization code](#authorization-code). The [client application](#client-application) obtains the authorization code earlier in the flow, from the [authorization endpoint](#authorization-endpoint). It can also provide an [ID token](#ID-token) when the authorization code grant is used in conjunction with the [OpenID Connect][OpenIDConnect] protocol.

## User-agent-based client
A type of [client application](#client-application) that downloads code from a web server and executes within a user-agent (e.g., web browser) such as a Single Page Application (SPA). Since all code is executed on a device, it is considered a "public" client due to its inability to store credentials privately/confidentially. See [OAuth2 client types and profiles][OAuth2-Client-Types] for more details.

## user principal
Similar to the way a service principal object is used to represent an application instance, a user principal object is another type of security principal, which represents a user. The Azure AD Graph [User entity][AAD-Graph-User-Entity] defines the schema for a user principal object. The User entity consists of user-related properties such as first and last name, user principal name, membership in directory roles, etc. providing the necessary user identity configuration for Azure AD to establish a user principal at run-time. The user principal is used to represent an authenticated user when recording [consent](#consent) actions, making access control decisions, etc.

## Web client
A type of [client application](#client-application) that executes all code on a web server, and is therefore considered a "confidential" client due to its ability to store credentials privately/confidentially on the server. See [OAuth2 client types and profiles][OAuth2-Client-Types] for more details.

## Next steps
The [Azure AD Developer's Guide][AAD-Dev-Guide] is the portal to use for all Azure AD development related topics, including an overview of [application integration][AAD-How-To-Integrate] and the basics of [Azure AD authentication and supported authentication scenarios][AAD-Auth-Scenarios]. 

Please use the Disqus comments section below to provide feedback and help us refine and shape our content.

<!--Image references-->

<!--Reference style links -->
[AAD-App-Manifest]: ./active-directory-application-manifest.md
[AAD-App-SP-Objects]: ./active-directory-application-objects.md
[AAD-Auth-Scenarios]: ./active-directory-authentication-scenarios.md
[AAD-Integrating-Apps]: ./active-directory-integrating-applications.md
[AAD-Dev-Guide]: ./active-directory-developers-guide.md
[AAD-Graph-Perm-Scopes]: https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-graph-api-permission-scopes
[AAD-Graph-App-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#ApplicationEntity
[AAD-Graph-Sp-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipalentity
[AAD-Graph-User-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#userentity
[AAD-How-To-Integrate]: ./active-directory-how-to-integrate.md
[AAD-How-To-Tenant]: active-directory-howto-tenant.md
[AAD-Multi-Tenant-Overview]: active-directory-devhowto-multi-tenant-overview.md
[AAD-Security-Token-Claims]: ./active-directory-authentication-scenarios/#claims-in-azure-ad-security-tokens
[AAD-Tokens-Claims]: ./active-directory-token-and-claims.md
[AZURE-classic-portal]: https://manage.windowsazure.com
[Duyshant-Role-Blog]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/
[JWT]: https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32
[Microsoft-Graph]: https://graph.microsoft.io
[O365-Perm-Ref]: https://msdn.microsoft.com/en-us/office/office365/howto/application-manifest
[OAuth2-Access-Token-Scopes]: https://tools.ietf.org/html/rfc6749#section-3.3
[OAuth2-AuthZ-Endpoint]: https://tools.ietf.org/html/rfc6749#section-3.1
[OAuth2-AuthZ-Grant-Types]: https://tools.ietf.org/html/rfc6749#section-1.3 
[OAuth2-Client-Types]: https://tools.ietf.org/html/rfc6749#section-2.1
[OAuth2-Role-Def]: https://tools.ietf.org/html/rfc6749#page-6
[OpenIDConnect]: http://openid.net/specs/openid-connect-core-1_0.html
[OpenIDConnect-AuthZ-Endpoint]: http://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
[OpenIDConnect-ID-Token]: http://openid.net/specs/openid-connect-core-1_0.html#IDToken














