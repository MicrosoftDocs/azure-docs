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
   ms.date="06/21/2016"
   ms.author="bryanla"/>

# Azure Active Directory developer glossary

This article contains definitions for a list of core Azure Active Directory (AD) development concepts. These are helpful during when learning about Azure AD [application development][AAD-Dev-Guide], including [application integration][AAD-How-To-Integrate] and the basics of [Azure AD authentication and supported authentication scenarios][AAD-Auth-Scenarios]. 

### access token  
A type of security token used by a [client application](#client-application) to access a protected resource, serving as a form of credential, typically in the form of a JSON Web Token (JWT). The token embodies/encapsulates delegated permissions from the **resource owner** and the applicable claims about the subject, enabling the client application to use it as a form of credential in order to access a given resource. 

### active / passive client  
Used to define whether the client application is involved in generating the user interface:  

- active client: The user interface that is rendered by a native application, or where there is no user interface at all 
- passive client: The user interface is projected to a Web browser from a Web application. A browser is a passive client in the sense that it has little control over content; it typically just renders what the Web application tells it to render.

### application manifest  
An Azure classic portal concept, which provides a JSON representation of the application's identity configuration, and used as a mechanism for updating the application entity and it's related service principal entity. See [Understanding the Azure Active Directory application manifest][AAD-App-Manifest] for more details.

### application object  
An application's one and only application object lives in the Azure AD tenant where the application was registered. Think of it as a design-time concept that expresses the application's identity configuration data, the template from which it's corresponding service principal object(s) are later derived for use at run-time. <br/><br/>For our scenario, we will create an application object during registration of the client application, in the developer tenant. We will discuss this later during application registration, but also note that many types of applications are supported by Azure AD, including both a client application (which can have multiple profiles), and a resource server that exposes a Web API. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information. 

**An Application object**, which represents the base *definition* of the application. The one-and-only Application object therefore has a 1:1 relationship with the application, and is the basis from which the application's Service Principal(s) are derived. Your tenant is considered the application's "home" tenant.

**application registration**  
In order to allow an application to integrate with and delegate identity management functions to Azure AD, it must be registered with an Azure AD tenant. When you register your application with Azure AD, you are essentially providing an identity configuration for your application, allowing it to participate in the authentication and authorization services provided by Azure AD on behalf of a user (resource owner), to access the user's data in a protected resource server.

We will focus on using the Azure classic portal for registration tasks, but please note that you can also register an application through other means, including the Azure AD Graph API, PowerShell cmdlets, and various tools that wrap them. Using the Azure classic portal for registration will create both the application and service principal object.

**authentication**  
The act of challenging a party for for legitimate credentials, to be used during acquisition of an access token. Typically the part is filling the role of either resource owner or client.

**authorization**  
The act of granting permission to perform a given operation. There are two uses in the Azure AD programming model:

- During **authorization grant**: Resource owner authorizes client to access a resource on behalf of resource owner. Also known as delegated authorization.
- During resource access:  Implemented by the **resource server**, using the claim values present in the **access token** to make access control decisions based upon them 

**authorization code**
A secure code provided to a *client application*, in response to authentication of a **resource owner** during an "authorization code" grant, indicating that resource owner has delegated permission to the client application to access resources on behalf of the resource owner. The code is later redeemed for an **access token**.

**authorization grant**  
A credential representing the resource owner's authorization to access its protected resources, used by a **client applicatio** in order to obtain an **access token**. The OAuth2 spec [currently defines four types][OAuth2-AuthZ-Grant-Types] :  

- authorization code: RO authenticates, RO owns the resource(s) -> App+User Access Token
- client credentials: App authenticates,Client owns the resource(s) -> App-Only Access Token
- implicit: used by SPA, simplified Authorization Code, client gets Access Token directly, no Authorization Code
- resource owner password credentials (aka: user Ccedentials) : RO provides username/password to Client to get token directly; only supported in AAD for native clients

## claim
An **access token** contain claims. Claims are assertions about the subject that have been authenticated by the **authorization server** (ie: Azure AD). The claims present in a given security token are dependent upon the type of token, the type of credential used to authenticate the subject, and the application configuration. Examples of claims include:  

- Authentication Methods References (amr): provided by OpenID Connect, specifies authentication method identifiers
- Scope (scp): scope of desired access specified by delegated client, limiting what the resource owner can do when operating through client; list of space-delimited case-sensitive strings defined by resource server (can use to identify an App+User token, delegated client) 

See [Supported Tokens and Claims][AAD-Tokens-Claims] for more details.

## client application  
 The SaaS application that requests authorization from a resource owner to participate in an OAuth2 authorization grant flow, to access APIs/data on their behalf. We will cover examples of both a Web client application accessed from a browser, and a Native client application installed on a device, which need to access the customer tenant's Graph API to access directory data on behalf of the signed in user. 

We will use the [OAuth 2.0 "Authorization Code" grant flow][OAuth2-AuthZ-Code-Grant-Flow] in this article, as it allows the resource owner to delegate authorization to the client application, but please note there are other types of OAuth2 grant flows.

**consent**  
The process of a resource owner granting authorization to the client application, allowing the application to access protected resources, on behalf of the resource owner. Note that both an administrator and user can consent to allow access to their organization/individual data respectively. We will discuss the entire process in more detail later when we break down the Azure AD consent framework, including how you can add a "sign up" feature to your application to manage user registration and consent.

**multi-tenant application**  
A type of client application registered in Azure AD, that is designed to permit sign ins from user accounts that are provisioned in any Azure AD tenant, including ones other than the one where the application itself is registered. By contrast, an application registered as single-tenant, would only allow sign-ins from user accounts provisioned in the same tenant as the one where the application is registered. 

**permissions / scopes**  
When we refer to permissions in general, or permission scopes in particular, we are referring to the available permissions that a Web API has declared through it's Azure AD configuration. These are the same permission definitions a client application must declare in it's Azure AD configuration in order to access the API. <br/><br/>These permissions will be surfaced to the resource owner/user during the consent process, so they know what they are granting the client permission to access on their behalf. For a detailed discussion of the permission scopes exposed by Azure AD's Graph API, see [Graph API Permission Scopes][AAD-Graph-Perm-Scopes].

**resource application**  
Exposes APIs and enforces the permissions scopes that allow client applications to access it's protected resources through the APIs, using the OAuth 2.0 Authorization Framework. Examples include the Azure AD Graph API that provides access to Azure AD tenant data, and the Office 365 APIs the provide access to data such as mail, calendar, and documents.  

Just like a client application, a Web API (aka: resource) application's identity configuration is established via registration in an Azure AD tenant, providing both the application and service principal object. (note: there are special considerations for Microsoft-provided APIs such as the Azure AD Graph API, as it's service principal object is made available in all tenants by default)

**service principal object**  
The client application is registered in the developer tenant via the [Azure classic portal][AZURE-Azure-classic-portal], which will create both it's application and service principal objects. We mentioned that the application object is more like a template, and the service principal object is *derived* from the application object. It's important to also note that it is the service principal object to which policy and permissions are applied, so think of it as a concept that is also applicable at run-time. When the application object is modified, the corresponding service principal object in it's tenant is also kept in sync. 

As mentioned above, a service principal object for the client application will also be created in the customer tenant during consent by the signed in customer user, acknowledging permission to access a protected resource on behalf of the user. Think of the service principal object as representing persisted consent from the user, where it can be used for future authorization requests. We will discuss this later during application registration. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.

**A Service Principal (SP) object**, which represents the identity configuration used by a specific application *instance*, from an Azure AD tenant's perspective. This identity configuration is used to govern the instance's access to resources secured by the tenant where the SP lives. More specifically, the SP is the security principal that represents the identity configuration of the application instance at runtime, much like a user principal represents a user at runtime. The identity configuration is derived from the application's Application object at the point in time at which the Service Principal is created, including the access policies required. You can apply policies to Service Principal objects, such as assigning permissions, allowing it to reflect the type of access (scope-based or role-based) required by the application instance. 

**tenant**  
An Azure AD tenant provides a variety of features, of which we will focus on a subset: registry services for integrated applications, authentication of user accounts and registered applications, and the OAuth 2.0 Authorization Server that brokers the interactions between a user (resource owner), a client application, and Web API(s) exposed by a protected resource server. Note that Azure AD also happens to function as a protected resource server, providing the Graph API to enable querying/updating of it's directory data.<br/><br/> We will create two Azure AD tenants, supporting the IDMaaS needs of a customer that wants to grant a SaaS client application limited access to data secured by their Azure AD tenant, and a SaaS developer that built the client application:<br/><br/>The **customer tenant** authenticates it's user accounts that sign in to the client application, and uses consent to secure the client application's access to the data *provided* by the Web API(s) registered in it. It also *consumes* the client application's application object from the developer tenant, which defines the access intent of the client (via permission scopes), among other things. Once consent is given, a service principal object is derived from the same application object, and persisted in the customer tenant for future use.<br/><br/>The **developer tenant** stores the client application's identity configuration (embodied in the application object). Among other things, it contains the credentials it uses to authenticate with Azure AD and a declaration of the APIs it is interesting in accessing, allowing it to obtain authorization from the authenticated user to access data secured by the customer tenant. It *provides* the client application's application object, and *consumes* the definition of the desired Web APIs and related permission scopes implemented by the customer tenant. 


|  Concept                 | Definition |
| -------------------------- | --------------------------------------------|
| term | definition <br/><br/> |
| access token | A form of credentials used by a client application to a access protected resource, typically in the form of a JSON Web Token (JWT). The token itself embodies/encapsulates delegated permissions from the resource owner and the applicable claims about the subject, enabling the client application to access a given resource. Examples of claims: <br/><br/>•	Authentication Methods References (amr): provided by OpenID Connect, specifies authentication method identifiers<br/><br/>•	Scope (scp): scope of desired access specified by delegated client, limiting what the RO can do when operating through Client; list of space-delimited case-sensitive strings defined by AS (can use to identify an App+User token, delegated client) |
| active/passive client | active client: The user interface that is rendered by a native application, or where there is no user interface at all<br/><br/>passive client: The user interface is projected to a Web browser from a Web application. A browser is a passive client in the sense that it has little control over content; it typically renders what the Web application tells it to render. |
| application manifest        | An Azure classic portal concept, which provides a JSON representation of the application's identity configuration, and used as a mechanism for updating the application entity and it's related service principal entity. See [Understanding the Azure Active Directory application manifest][AAD-App-Manifest] for more details. |
| application object        | An application's one and only application object lives in the Azure AD tenant where the application was registered. Think of it as a design-time concept that expresses the application's identity configuration data, the template from which it's corresponding service principal object(s) are later derived for use at run-time. <br/><br/>For our scenario, we will create an application object during registration of the client application, in the developer tenant. We will discuss this later during application registration, but also note that many types of applications are supported by Azure AD, including both a client application (which can have multiple profiles), and a resource server that exposes a Web API. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.   <br/><br/> **An Application object**, which represents the base *definition* of the application. The one-and-only Application object therefore has a 1:1 relationship with the application, and is the basis from which the application's Service Principal(s) are derived. Your tenant is considered the application's "home" tenant. |
| application registration        | In order to allow an application to integrate with and delegate identity management functions to Azure AD, it must be registered with an Azure AD tenant. When you register your application with Azure AD, you are essentially providing an identity configuration for your application, allowing it to participate in the authentication and authorization services provided by Azure AD on behalf of a user (resource owner), to access the user's data in a protected resource server <br/><br/>We will focus on using the Azure classic portal for registration tasks, but please note that you can also register an application through other means, including the Azure AD Graph API, PowerShell cmdlets, and various tools that wrap them. Using the Azure classic portal for registration will create both the application and service principal object. |
| authentication | The act of challenging a party for for legitimate credentials, to be used during acquisition of an access token. Typically the part is filling the role of either resource owner<sup>1</sup> or client<sup>1</sup>. |
| authorization | The act of determining whether a client<sup>1</sup> is capable of performing a given operation. Implemented by the resource server<sup>1</sup> /, using the claim values in the token, and decisions made using them (ie: RBAC, etc.) |
| Azure AD tenants           | An Azure AD tenant provides a variety of features, of which we will focus on a subset: registry services for integrated applications, authentication of user accounts and registered applications, and the OAuth 2.0 Authorization Server that brokers the interactions between a user (resource owner), a client application, and Web API(s) exposed by a protected resource server. Note that Azure AD also happens to function as a protected resource server, providing the Graph API to enable querying/updating of it's directory data.<br/><br/> We will create two Azure AD tenants, supporting the IDMaaS needs of a customer that wants to grant a SaaS client application limited access to data secured by their Azure AD tenant, and a SaaS developer that built the client application:<br/><br/>The **customer tenant** authenticates it's user accounts that sign in to the client application, and uses consent to secure the client application's access to the data *provided* by the Web API(s) registered in it. It also *consumes* the client application's application object from the developer tenant, which defines the access intent of the client (via permission scopes), among other things. Once consent is given, a service principal object is derived from the same application object, and persisted in the customer tenant for future use.<br/><br/>The **developer tenant** stores the client application's identity configuration (embodied in the application object). Among other things, it contains the credentials it uses to authenticate with Azure AD and a declaration of the APIs it is interesting in accessing, allowing it to obtain authorization from the authenticated user to access data secured by the customer tenant. It *provides* the client application's application object, and *consumes* the definition of the desired Web APIs and related permission scopes implemented by the customer tenant. |
| client application         | The SaaS application that requests authorization from a resource owner to participate in an OAuth2 grant flow, to access APIs/data on their behalf. We will cover examples of both a Web client application accessed from a browser, and a Native client application installed on a device, which need to access the customer tenant's Graph API to access directory data on behalf of the signed in user. <br/><br/>We will use the [OAuth 2.0 "Authorization Code" grant flow][OAuth2-AuthZ-Code-Grant-Flow] in this article, as it allows the resource owner to delegate authorization to the client application, but please note there are other types of OAuth2 grant flows.  |
| consent         | The process of a resource owner granting authorization to the client application, allowing the application to access protected resources, on behalf of the resource owner. Note that both an administrator and user can consent to allow access to their organization/individual data respectively. We will discuss the entire process in more detail later when we break down the Azure AD consent framework, including how you can add a "sign up" feature to your application to manage user registration and consent. |
| multi-tenant application   | A type of client application registered in Azure AD, that is designed to permit sign ins from user accounts that are provisioned in any Azure AD tenant, including ones other than the one where the application itself is registered. By contrast, an application registered as single-tenant, would only allow sign-ins from user accounts provisioned in the same tenant as the one where the application is registered. 
| permission scopes  | When we refer to permissions in general, or permission scopes in particular, we are referring to the available permissions that a Web API has declared through it's Azure AD configuration. These are the same permission definitions a client application must declare in it's Azure AD configuration in order to access the API. <br/><br/>These permissions will be surfaced to the resource owner/user during the consent process, so they know what they are granting the client permission to access on their behalf. For a detailed discussion of the permission scopes exposed by Azure AD's Graph API, see [Graph API Permission Scopes][AAD-Graph-Perm-Scopes].  |
| service principal object        | The client application is registered in the developer tenant via the [Azure classic portal][AZURE-Azure-classic-portal], which will create both it's application and service principal objects. We mentioned that the application object is more like a template, and the service principal object is *derived* from the application object. It's important to also note that it is the service principal object to which policy and permissions are applied, so think of it as a concept that is also applicable at run-time. When the application object is modified, the corresponding service principal object in it's tenant is also kept in sync. <br/><br/>As mentioned above, a service principal object for the client application will also be created in the customer tenant during consent by the signed in customer user, acknowledging permission to access a protected resource on behalf of the user. Think of the service principal object as representing persisted consent from the user, where it can be used for future authorization requests. We will discuss this later during application registration. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for more information.  <br/><br/>   **A Service Principal (SP) object**, which represents the identity configuration used by a specific application *instance*, from an Azure AD tenant's perspective. This identity configuration is used to govern the instance's access to resources secured by the tenant where the SP lives. More specifically, the SP is the security principal that represents the identity configuration of the application instance at runtime, much like a user principal represents a user at runtime. The identity configuration is derived from the application's Application object at the point in time at which the Service Principal is created, including the access policies required. You can apply policies to Service Principal objects, such as assigning permissions, allowing it to reflect the type of access (scope-based or role-based) required by the application instance. |
| Web API application    | Exposes APIs and enforces the permissions scopes that allow client applications to access it's protected resources through the APIs, using the OAuth 2.0 Authorization Framework. Examples include the Azure AD Graph API that provides access to Azure AD tenant data, and the Office 365 APIs the provide access to data such as mail, calendar, and documents.  <br/><br/> Just like a client application, a Web API (aka: resource) application's identity configuration is established via registration in an Azure AD tenant, providing both the application and service principal object. (note: there are special considerations for Microsoft-provided APIs such as the Azure AD Graph API, as it's service principal object is made available in all tenants by default)|

* <sub>1</sub> See [OAuth 2.0 role definitions][OAuth2-Role-Def] for role definitions

## Next steps
Please use the Disqus comments section below to provide feedback and help us refine and shape our content.

<!--Image references-->

<!--Reference style links -->
[AAD-App-Manifest]: ./active-directory-application-manifest.md
[AAD-App-SP-Objects]: ./active-directory-application-objects.md

[AAD-Auth-Scenarios]: ./active-directory-authentication-scenarios.md

[AAD-Dev-Guide]: ./active-directory-developers-guide.md
[AAD-Graph-Perm-Scopes]: https://msdn.microsoft.com/Library/Azure/Ad/Graph/api/graph-api-permission-scopes
[AAD-How-To-Integrate]: ./active-directory-how-to-integrate.md

[AAD-Tokens-Claims]: ./active-directory-token-and-claims.md

[AZURE-Azure-classic-portal]: https://manage.windowsazure.com

[OAuth2-AuthZ-Code-Grant-Flow]: https://msdn.microsoft.com/library/azure/dn645542.aspx
[OAuth2-AuthZ-Grant-Types]: https://tools.ietf.org/html/rfc6749#section-1.3 
[OAuth2-Role-Def]: https://tools.ietf.org/html/rfc6749#page-6















