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
   ms.date="06/22/2016"
   ms.author="bryanla"/>

# Azure Active Directory developer glossary
This article contains definitions for a list of core Azure Active Directory (AD) development concepts, which are helpful when learning about application developer for Azure AD.

## Glossary

### **access token**  
A type of [security token](#security-token) issued by the [token endpoint](#token-endpoint) on an [authorization server](#authorization-server) and used by a [client application](#client-application) in order to access a [protected resource server](#resource-server). Typically in the form of a [JSON Web Token (JWT)][JWT], the token embodies the permission(s) granted to the client by the [resource owner](#resource-owner). The token contains all applicable [claims](#claim) about the subject, enabling the client application to use it as a form of credential when accessing a given resource. 

When a client uses the ["authorization code" authorization grant](#authorization-grant), an end-user authenticates as the resource owner and the client authenticates to obtain the access token, so the token can sometimes be referred to more specifically as an "App+User" token. Similarly, when a client uses the ["client credentials" authorization grant](#authorization-grant), the client is also functioning as the resource-owner, so the token can sometimes be referred to as an "App-Only" token.

### **application manifest**  
An [Azure classic portal][AZURE-classic-portal] feature, which provides a JSON representation of the application's identity configuration, used as a mechanism for updating its associated [application][AAD-Graph-App-Entity] and [service principal][AAD-Graph-Sp-Entity] entities. See [Understanding the Azure Active Directory application manifest][AAD-App-Manifest] for more details.

### **application object**  
An Azure AD application is an overarching concept, *defined* by it's one and only application object which lives in the Azure AD tenant where the application was registered. The application object serves as the application's identity configuration, and is the template from which it's corresponding [service principal](#service-principal) object(s) are *derived* for use at run-time. The Azure AD Graph [application entity][AAD-Graph-App-Entity] defines the schema for an application object. The tenant in which the application object lives is considered the application's "home" tenant.

The application object therefore has a 1:1 relationship with the application, and a 1:*n* relationship with it's corresponding service principal object(s). A single-tenant application will have only 1 service principal (in its home tenant) symmetric with it's application object; a [multi-tenant application](#multi-tenant-application) will have the same, plus a service principal in each tenant where the application has been given consent to access resources. 

When you register/update an application in the [Azure classic portal][AZURE-classic-portal], the portal creates/updates both the application object and it's corresponding service principal object for that tenant. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.

### **application registration**  
In order to allow an application to integrate with and delegate identity management functions to Azure AD, it must be registered with an Azure AD tenant. When you register your application with Azure AD, you are essentially providing an identity configuration for your application, allowing it to participate in the authentication and authorization services provided by Azure AD on behalf of a user (resource owner), to access the user's data in a protected resource server.

We will focus on using the Azure classic portal for registration tasks, but please note that you can also register an application through other means, including the Azure AD Graph API, PowerShell cmdlets, and various tools that wrap them. Using the Azure classic portal for registration will create both the application and service principal object.

[TODO]: Sign-on and Reply URL for Web clients? Redirect URI for Native clients?

### **authentication**
The act of challenging a party for legitimate credentials, providing the identity to be used during acquisition of an access token. Typically the party authenticating is filling the role of either resource owner or client application.

### **authorization**
The act of granting an authenticated security principal permission to perform a given operation. There are two uses in the Azure AD programming model:

- During the [authorization grant](#authorization-grant) flow: when the [resource owner](#resource-owner) authorizes an authenticated [client application](#client-application) to access a resource on behalf of the resource owner. Also known as delegated authorization.
- During resource access:  as implemented by the [resource server](#resource-server), using the claim values present in the [access token](#access-token) to make access control decisions based upon them.

### **authorization code**
A secure code provided to a *client application*, in response to authentication of a [resource owner](#resource-owner) during an "authorization code" grant, indicating that resource owner has delegated permission to the client application to access resources on behalf of the resource owner. The code is later redeemed for an [access token](#access-token).

### **authorization endpoint**
Provides an [authorization code](#authorization-code) to a [client application](#client-application), during the [authorization code grant](#authorization-grant) flow, upon successful authentication (and consent) of the [resource owner](#resource-owner). The client uses the authorization code later in the flow, to obtain an [access token](#access-token) from the [token endpoint](#token-endpoint), in exchange for the authorization code.

### **authorization grant**
A credential representing the resource owner's authorization to access its protected resources, used by a [client application](#client-application) to acquire an [access token](#access-token). The OAuth2 spec [currently defines four types][OAuth2-AuthZ-Grant-Types] : authorization code, client credentials, implicit, and resource owner password credentials.

### **authorization server**
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], the server issuing access tokens to the client after successfully authenticating the resource owner and obtaining its authorization. In the case of Azure AD application integration, Azure AD implements the authorization server. Note, as in the case of Azure AD, some authorization servers also function as a resource server, implementing APIs that can be access via an access token (ie: the Azure AD Graph API).


### **claim**
An [access token](#access-token) contain claims. Claims are assertions (facts) about the subject (the principal that was authenticated by the [authorization server](#authorization-server), ie: Azure AD). The claims present in a given security token are dependent upon the type of token, the type of credential used to authenticate the subject, and the application configuration. 

For example, the "scope" (scp) claim provides the permission(s) granted to a delegated client application, limiting the operations the client application can perform on behalf of the resource owner. The actual values contained in the scope claim are based on the list of space-delimited case-sensitive strings defined by resource server. 

See [Supported Tokens and Claims][AAD-Tokens-Claims] for more details.

### **client application**  
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], an application that makes protected resource requests on behalf of the resource owner and with its authorization. The term "client" does not imply any particular hardware implementation characteristics (e.g., whether the application executes on a server, a desktop, or other devices).  

A client application requests authorization from a resource owner to participate in an [OAuth2 authorization grant](#authorization-grant) flow, to access APIs/data on its behalf. Examples include a [Web client](#web-client) application accessed from a browser, and a [native client](#native-client) application installed on a device, both of which could access Azure AD Graph API protecting the resource owner's tenant, to access directory data on behalf of the signed in user.

### **consent**
The process of a resource owner granting authorization to the client application, allowing the application to access protected resources, on behalf of the resource owner. Note that both an administrator and user can consent to allow access to their organization/individual data respectively. During multi-tenant consent, the application's [service principal](#service-principal) is also recorded in the tenant of the consenting user.

### **ID token**
An [OpenID Connect security token][OpenIDConnect-ID-Token]] that contains [claims](#claim) pertaining to the authentication of an end-user resource owner by an [authorization server](#authorization-server), when using a client application to access resources), by an Authorization Server, and potentially other requested claims. Like an access token, ID tokens are also represented as a [JSON Web Token (JWT)][JWT]. 

### **multi-tenant application**
A class of client application registered in Azure AD, that is designed to permit sign ins from user accounts that are provisioned in any Azure AD tenant, including ones other than the one where the application itself is registered. By contrast, an application registered as single-tenant, would only allow sign-ins from user accounts provisioned in the same tenant as the one where the application is registered. 

### **native client**
A type of [client application](#client-application) that is installed natively on a device. This type of client executes all code on the client, and is therefore considered a "public" client due to it's lack of ability to store credentials privately/confidentially. See [OAuth2 client types and profiles](https://tools.ietf.org/html/rfc6749#section-2.1) for more details.

Sometimes referred to as an "active client", which is a client that generates/renders its user interface, or possibly has no user interface at all. Compared to a "passive client" which is synonymous with the definition of a [Web client](#web-client)

### **permissions / scopes [TODO-break up]**
When we refer to permissions in general, or permission scopes in particular, we are referring to the available permissions that a Web API has declared through it's Azure AD configuration. These are the same permission definitions a client application must declare in it's Azure AD configuration in order to access the API. <br/><br/>These permissions will be surfaced to the resource owner/user during the consent process, so they know what they are granting the client permission to access on their behalf. For a detailed discussion of the permission scopes exposed by Azure AD's Graph API, see [Graph API Permission Scopes][AAD-Graph-Perm-Scopes].

### **resource owner**
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], an entity capable of granting access to a protected resource. When the resource owner is a person, it is referred to as an end-user.

### **resource server**
As defined by the [OAuth2 Authorization Framework][OAuth2-Role-Def], the server hosting the protected resources, capable of accepting and responding to protected resource requests by [client applications](#client-applications) using access tokens. Also known as a protected resource server, or resource application.

A resource server exposes APIs and enforces the scopes that allow client applications to access it's protected resources, using the OAuth 2.0 Authorization Framework. Examples include the Azure AD Graph API that provides access to Azure AD tenant data, and the Office 365 APIs the provide access to data such as mail, calendar, and documents.  

Just like a client application, a Web API (aka: resource) application's identity configuration is established via registration in an Azure AD tenant, providing both the application and service principal object. (note: there are special considerations for Microsoft-provided APIs such as the Azure AD Graph API, as it's service principal object is made available in all tenants by default)

### security token
A generic term for a token used in a security context. In the case of an OAuth 2.0 [authorization grant](#authorization-grant), an [access token](#access-token) (OAuth2) and an [ID Token](OpenID Connect) are a type of security token, both of which are implemented as a [JSON Web Token (JWT)][JWT].

### **service principal**
The [application object](#application-object) serves as the template for an application's identity configuration, from which its service principal object(s) are *derived*. It is the service principal object to which policy and permissions are applied, for use at run-time by the tenant in which it lives. A service principal object is required in each tenant for which an instance of the application must be represented, governing access to resources protected by user accounts from that tenant.

When you register/update an application in the [Azure classic portal][AZURE-classic-portal], the portal creates/updates both the application object and it's corresponding service principal object for that tenant. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.

For a [multi-tenant](#multi-tenant-application) [Web application](#web-application), the service principal object is created in the end-user's Azure AD tenant after successful consent, acknowledging permission to access a protected resource on behalf of the user. Going forward, the service principal object will be consulted for future authorization requests. 

### **sign-in**
The process of a [client application](#client-application) initiating end-user authentication and capturing related state following authentication, for the purpose of acquiring an [access token](#access-token) and scoping the application session to that state. State can include artifacts such as user tenant and profile information, and the permissions granted to the client by the end-user. 

The sign-in function of an application is typically used to implement single-sign-on (SSO), and augmented by a prerequisite "sign-up" function which is the entry point for an end-user to gain access to an application (upon first sign-in). The sign-up function is used to gather and store additional state specific to the user, such as credential and profile info, and is used to drive the [application consent experience](#consent) after sign-up.

### **sign-out**
The process of unauthenticating an end-user, detaching the user state associated with the [client application](#client-application) session during [sign-in](#sign-in)

### **tenant**
An instance of Azure AD is referred to as an Azure AD tenant. It provides a variety of features, including a registry service for integrated applications, authentication of user accounts and registered applications, and the [OAuth 2.0 authorization server](#authorization server) that brokers the interactions between the [OAuth2 Authorization Framework roles][OAuth2-Role-Def]. Azure AD also happens to function as a [protected resource server](#resource-server), providing the Azure AD Graph API to enable querying/updating of it's directory data.

### **token endpoint**
Provides an [access token](#access-token) in exchange for an [authorization code](#authorization-code), during the [authorization code grant](#authorization-grant) flow. The [client application](#client-application) obtains the authorization code earlier in the flow, from the [authorization endpoint](#authorization-endpoint).

### **Web client**
A type of [client application](#client-application) that runs as a Web application on a Web server. This type of client executes all code on the server, projecting it's user interface through a client-installed browser, and is therefore considered a "confidential" client due to it's ability to store credentials privately/confidentially on the server. See [OAuth2 client types and profiles](https://tools.ietf.org/html/rfc6749#section-2.1) for more details.

Sometimes referred to as a "passive client", which is a client that has a user interface that is projected to a Web browser from a Web application. A browser is a passive client in the sense that it has little control over content; it typically just renders what the Web application tells it to render. Compared to an "active client" which has which has a user interface that is rendered by a [native application](#native-application), or where there is no user interface at all. 

## Next steps
The [Azure AD Developer's Guide][AAD-Dev-Guide] is the portal to use for all Azure AD development related topics, including an overview of [application integration][AAD-How-To-Integrate] and the basics of [Azure AD authentication and supported authentication scenarios][AAD-Auth-Scenarios]. 

Please use the Disqus comments section below to provide feedback and help us refine and shape our content.

<!--Image references-->

<!--Reference style links -->
[AAD-App-Manifest]: ./active-directory-application-manifest.md
[AAD-App-SP-Objects]: ./active-directory-application-objects.md
[AAD-Auth-Scenarios]: ./active-directory-authentication-scenarios.md
[AAD-Dev-Guide]: ./active-directory-developers-guide.md
[AAD-Graph-Perm-Scopes]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/graph-api-permission-scopes
[AAD-Graph-App-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#ApplicationEntity
[AAD-Graph-Sp-Entity]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/entity-and-complex-type-reference#serviceprincipalentity
[AAD-How-To-Integrate]: ./active-directory-how-to-integrate.md
[AAD-Security-Token-Claims]: ./active-directory-authentication-scenarios/#claims-in-azure-ad-security-tokens
[AAD-Tokens-Claims]: ./active-directory-token-and-claims.md
[AZURE-classic-portal]: https://manage.windowsazure.com
[JWT]: https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32
[OAuth2-AuthZ-Code-Grant-Flow]: https://msdn.microsoft.com/library/azure/dn645542.aspx
[OAuth2-AuthZ-Grant-Types]: https://tools.ietf.org/html/rfc6749#section-1.3 
[OAuth2-Role-Def]: https://tools.ietf.org/html/rfc6749#page-6
[OpenIDConnect-ID-Token]: http://openid.net/specs/openid-connect-core-1_0.html#IDToken














