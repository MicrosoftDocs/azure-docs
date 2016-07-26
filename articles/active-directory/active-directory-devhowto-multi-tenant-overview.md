<properties
   pageTitle="How to build an application that can sign in any Azure Active Directory user| Microsoft Azure"
   description="Step by step instructions for building an application that can sign in a user from any Azure Active Directory tenant, also known as a multi-tenant application."
   services="active-directory"
   documentationCenter=""
   authors="skwan"
   manager="mbaldwin"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="07/22/2016"
   ms.author="skwan;bryanla"/>

# How to sign in any Azure Active Directory (AD) user using the multi-tenant application pattern
If you offer a Software as a Service application to many organizations, you can configure your application to accept sign-ins from any Azure AD tenant.  In Azure AD this is called making your application multi-tenant.  Users in any Azure AD tenant will be able to sign in to your application after consenting to use their account with your application.  

If you have an existing application that has its own account system, or supports other kinds of sign in from other cloud providers, adding Azure AD sign in from any tenant is as simple as registering your app, adding sign in code via OAuth2, OpenID Connect, or SAML, and putting a Sign In with Microsoft button on your application. Click the button below to learn more about branding your application.

[![Sign in button][AAD-Sign-In]][AAD-App-Branding]


This article assumes you’re already familiar with building a single tenant application for Azure AD.  If you’re not, head back up to the [developer guide homepage][AAD-Dev-Guide] and try one of our quick starts!

There are four simple steps to convert your application into an Azure AD multi-tenant app:

1.	Update your application registration to be multi-tenant
2.	Update your code to send requests to the /common endpoint 
3.	Update your code to handle multiple issuer values
4.	Understand user and admin consent and make appropriate code changes

Let’s look at each step in detail. You can also jump straight to [this list of multi-tenant samples][AAD-Samples-MT].

## Update registration to be multi-tenant
By default, web app/API registrations in Azure AD are single tenant.  You can make your registration multi-tenant by finding the “Application is Multi-Tenant” switch on the configuration page of your application registration in the [Azure classic portal][AZURE-classic-portal] and setting it to “Yes”.

Note: Before an application can be made multi-tenant, Azure AD requires the App ID URI of the application to be globally unique. The App ID URI is one of the ways an application is identified in protocol messages.  For a single tenant app, it is sufficient for the App ID URI to be unique within that tenant.  For a multi-tenant application, it must be globally unique so Azure AD can find the application across all tenants.  Global uniqueness is enforced by requiring the App ID URI to have a host name that matches a verified domain of the Azure AD tenant.  For example, if the name of your tenant was contoso.onmicrosoft.com then a valid App ID URI would be `https://contoso.onmicrosoft.com/myapp`.  If your tenant had a verified domain of `contoso.com`, then a valid App ID URI would also be `https://contoso.com/myapp`.  Setting an application as multi-tenant will fail if the App ID URI doesn’t follow this pattern.

Native client registrations are multi-tenant by default.  You don’t need to take any action to make a native client application registration multi-tenant.

## Update your code to send requests to /common
In a single tenant application, sign in requests are sent to the tenant’s sign in endpoint.   For example, for contoso.onmicrosoft.com the endpoint would be:

    https://login.microsoftonline.com/contoso.onmicrosoft.com

Requests sent to a tenant’s endpoint can sign in users (or guests) in that tenant to applications in that tenant.  With a multi-tenant application, the application doesn’t know up front what tenant the user is from, so you can’t send requests to a tenant’s endpoint.  Instead, requests are sent to an endpoint that multiplexes across all Azure AD tenants:

    https://login.microsoftonline.com/common

When Azure AD receives a request on the /common endpoint, it signs the user in and as a consequence discovers which tenant the user is from.  The /common endpoint works with all of the authentication protocols supported by Azure AD:  OpenID Connect, OAuth 2.0, SAML 2.0, and WS-Federation.

The sign in response to the application then contains a token representing the user.  The issuer value in the token tells an application what tenant the user is from.  When a response returns from the /common endpoint, the issuer value in the token will correspond to the user’s tenant.  It’s important to note the /common endpoint is not a tenant and is not an issuer, it’s just a multiplexer.  When using /common, the logic in your application to validate tokens needs to be updated to take this into account. 

As mentioned earlier, multi-tenant applications should also provide a consistent sign-in experience for users, following the Azure AD application branding guidelines. Click the button below to learn more about branding your application.

[![Sign in button][AAD-Sign-In]][AAD-App-Branding]

Let’s take a look at the use of the /common endpoint and your code implementation in more detail.

## Update your code to handle multiple issuer values
Web applications and web APIs receive and validate tokens from Azure AD.  

> [AZURE.NOTE] While native client applications request and receive tokens from Azure AD, they do so to send them to APIs, where they are validated.  Native applications do not validate tokens and must treat them as opaque.

Let’s look at how an application validates tokens it receives from Azure AD.  A single tenant application will normally take an endpoint value like:

    https://login.microsoftonline.com/contoso.onmicrosoft.com

and use it to construct a metadata URL (in this case, OpenID Connect) like:

    https://login.microsoftonline.com/contoso.onmicrosoft.com/.well-known/openid-configuration

to download two critical pieces of information that are used to validate tokens:  the tenant’s signing keys and issuer value.  Each Azure AD tenant has a unique issuer value of the form:

    https://sts.windows.net/31537af4-6d77-4bb9-a681-d2394888ea26/

where the GUID value is the rename-safe version of the tenant ID of the tenant.  If you click on the metadata link above for `contoso.onmicrosoft.com`, you can see this issuer value in the document.

When a single tenant application validates a token, it checks the signature of the token against the signing keys from the metadata document, and makes sure the issuer value in the token matches the one that was found in the metadata document.

Since the /common endpoint doesn’t correspond to a tenant and isn’t an issuer, when you examine the issuer value in the metadata for /common it has a templated URL instead of an actual value:

    https://sts.windows.net/{tenantid}/

Therefore, a multi-tenant application can’t validate tokens just by matching the issuer value in the metadata with the `issuer` value in the token.  A multi-tenant application needs logic to decide which issuer values are valid and which are not, based on the tenant ID portion of the issuer value.  

For example, if a multi-tenant application only allows sign in from specific tenants who have signed up for their service, then it must check either the issuer value or the `tid` claim value in the token to make sure that tenant is in their list of subscribers.  If a multi-tenant application only deals with individuals and doesn’t make any access decisions based on tenants, then it can ignore the issuer value altogether.

In the multi-tenant samples you’ll find in the [Related Content](#related-content) section at the end of this article, issuer validation is disabled to enable any Azure AD tenant to sign in.

Now let’s look at the user experience for users that are signing in to multi-tenant applications.

## Understanding user and admin consent
For a user to sign in to an application in Azure AD, the application must be represented in the user’s tenant.  This allows the organization to do things like apply unique policies when users from their tenant sign in to the application.  For a single tenant application this registration is simple; it’s the one that happens when you register the application in the [Azure classic portal][AZURE-classic-portal].

For a multi-tenant application, the initial registration for the application lives in the Azure AD tenant used by the developer.  When a user from a different tenant signs in to the application for the first time, Azure AD asks them to consent to the permissions requested by the application.  If they consent, then a representation of the application called a *service principal* is created in the user’s tenant, and sign in can continue. A delegation is also created in the directory that records the user’s consent to the application. See [Application Objects and Service Principal Objects][AAD-App-SP-Objects] for details on the application's Application and ServicePrincipal objects, and how they relate to each other.

![Consent to single-tier app][Consent-Single-Tier] 

This consent experience is affected by the permissions requested by the application.  Azure AD supports two kinds of permissions, app-only and delegated:

- A delegated permission grants an application the ability to act as a signed in user for a subset of the things the user can do.  For example, you can grant an application the delegated permission to read the signed in user’s calendar.
- An app-only permission is granted directly to the identity of the application.  For example, you can grant an application the app-only permission to read the list of users in a tenant, and it will be able to do this regardless of who is signed in to the application.

Some permissions can be consented to by a regular user, while others require a tenant administrator’s consent. 

### Admin consent
App-only permissions always require a tenant administrator’s consent.  If your application requests an app-only permission and a normal user tries to sign in to the application, your application will get an error message saying the user isn’t able to consent.

Certain delegated permissions also require a tenant administrator’s consent.  For example, the ability to write back to Azure AD as the signed in user requires a tenant administrator’s consent.  Like app-only permissions, if an ordinary user tries to sign in to an application that requests a delegated permission that requires administrator consent, your application will receive an error.  Whether or not a permission requires admin consent is determined by the developer that published the resource, and can be found in the documentation for the resource.  Links to topics describing the available permissions for the Azure AD Graph API and Microsoft Graph API are in the [Related Content](#related-content) section of this article.

If your application uses permissions that require admin consent, you need to have a gesture in your application such as a button or link where the admin can initiate the action.  The request your application sends for this action is a usual OAuth2/OpenID Connect authorization request, but that also includes the `prompt=admin_consent` query string parameter.  Once the admin has consented and the service principal is created in the customer’s tenant, subsequent sign in requests do not need the `prompt=admin_consent` parameter.   Since the administrator has decided the requested permissions are acceptable, no other users in the tenant will be prompted for consent from that point forward.

The `prompt=admin_consent` parameter can also be used by applications that request permissions that do not require admin consent, but want to give an experience where the tenant admin “signs up” for the application one time, and no other users are prompted for consent from that point on.

If an application requires administrator consent, and the administrator signs in to the application but the `prompt=admin_consent` parameter is not sent, the admin will be able to successfully consent to the application but they will only consent for their user account.  Regular users will still not be able to sign in and consent to the application.  This is useful if you want to give the tenant administrator the ability to explore your application before allowing other users access.

A tenant administrator can disable the ability for regular users to consent to applications.  If this capability is disabled, admin consent is always required for the application to be set up in the tenant.  If you want to test your application with regular user consent disabled, you can find the configuration switch in the Azure AD tenant configuration section of the [Azure classic portal][AZURE-classic-portal].

> [AZURE.NOTE] Some applications want an experience where regular users are able to consent initially, and later the application can involve the administrator and request permissions that require admin consent.  There is no way to do this with a single application registration in Azure AD today.  The upcoming Azure AD v2 endpoint will allow applications to request permissions at runtime, instead of at registration time, which will enable this scenario.  For more information, see the [Azure AD App Model v2 Developer Guide][AAD-V2-Dev-Guide].

### Consent and multi-tier applications
Your application may have multiple tiers, each represented by its own registration in Azure AD.  For example, a native application that calls a web API, or a web application that calls a web API.  In both of these cases, the client (native app or web app) requests permissions to call the resource (web API).  For the client to be successfully consented into a customer’s tenant, all resources to which it requests permissions must already exist in the customer’s tenant.  If this condition isn’t met, Azure AD will return an error that the resource must be added first.

This can be a problem if your logical application consists of two or more application registrations, for example a separate client and resource.  How do you get the resource into the customer tenant first?  Azure AD covers this case by enabling client and resource to be consented in a single step, where the user sees the sum total of the permissions requested by both the client and resource on the consent page.  To enable this behavior, the resource’s application registration must include the client’s App ID as a `knownClientApplications` in its application manifest.  For example:

    knownClientApplications": ["94da0930-763f-45c7-8d26-04d5938baab2"]

This property can be updated via the resource [application’s manifest][AAD-App-Manifest], and is demonstrated in a multi-tier native client calling web API sample in the [Related Content](#related-content) section at the end of this article. The diagram below provides an overview of consent for a multi-tier app:

![Consent to multi-tier known client app][Consent-Multi-Tier-Known-Client] 

A similar case happens if the different tiers of an application are registered in different tenants.  For example, consider the case of building a native client application that calls the Office 365 Exchange Online API.  To develop the native application, and later for the native application to run in a customer’s tenant, the Exchange Online service principal must be present.  In this case the customer has to purchase Exchange Online for the service principal to be created in their tenant.  In the case of an API built by an organization other than Microsoft, the developer of the API needs to provide a way for their customers to consent their application into a customer tenant, for example a web page that drives consent using the mechanisms described in this article.  After the service principal is created in the tenant, the native application can get tokens for the API.

The diagram below provides an overview of consent for a multi-tier app registered in different tenants:

![Consent to multi-tier multi-party app][Consent-Multi-Tier-Multi-Party] 

### Revoking Consent
Users and administrators can revoke consent to your application at any time:

- Users revoke access to individual applications by removing them from their [Access Panel Applications][AAD-Access-Panel] list.
- Administrators revoke access to applications by removing them from Azure AD using the Azure AD management section of the [Azure classic portal][AZURE-classic-portal].

If an administrator consents to an application for all users in a tenant, users cannot revoke access individually.  Only the administrator can revoke access, and only for the whole application.

### Consent and Protocol Support
Consent is supported in Azure AD via the OAuth, OpenID Connect, WS-Federation, and SAML protocols.  The SAML and WS-Federation protocols do not support the `prompt=admin_consent` parameter, so admin consent is only possible via OAuth and OpenID Connect.

## Multi-Tenant Applications and Caching Access Tokens
Multi-tenant applications can also get access tokens to call APIs that are protected by Azure AD.  A common error when using the Active Directory Authentication Library (ADAL) with a multi-tenant application is to initially request a token for a user using /common, receive a response, and then request a subsequent token for that same user also using /common.  Since the response from Azure AD comes from a tenant, not /common, ADAL caches the token as being from the tenant. The subsequent call to /common to get an access token for the user misses the cache entry, and the user is prompted to sign in again.  To avoid missing the cache, make sure subsequent calls for an already signed in user are made to the tenant’s endpoint.

## Related content

- [Multi-tenant application samples][AAD-Samples-MT]
- [Branding Guidelines for Applications][AAD-App-Branding]
- [Azure AD Developer's Guide][AAD-Dev-Guide]
- [Application Objects and Service Principal Objects][AAD-App-SP-Objects]
- [Integrating Applications with Azure Active Directory][AAD-Integrating-Apps]
- [Overview of the Consent Framework][AAD-Consent-Overview]
- [Microsoft Graph API Permission Scopes][MSFT-Graph-AAD]
- [Azure AD Graph API Permission Scopes][AAD-Graph-Perm-Scopes]

Please use the Disqus comments section below to provide feedback and help us refine and shape our content.

<!--Reference style links IN USE -->
[AAD-Access-Panel]:  https://myapps.microsoft.com
[AAD-App-Branding]: ./active-directory-branding-guidelines.md
[AAD-App-Manifest]: ./active-directory-application-manifest.md
[AAD-App-SP-Objects]: ./active-directory-application-objects.md
[AAD-Auth-Scenarios]: ./active-directory-authentication-scenarios.md
[AAD-Consent-Overview]: ./active-directory-integrating-applications.md#overview-of-the-consent-framework
[AAD-Dev-Guide]: ./active-directory-developers-guide.md
[AAD-Graph-Overview]: https://azure.microsoft.com/en-us/documentation/articles/active-directory-graph-api/
[AAD-Graph-Perm-Scopes]: https://msdn.microsoft.com/library/azure/ad/graph/howto/azure-ad-graph-api-permission-scopes
[AAD-Integrating-Apps]: ./active-directory-integrating-applications.md
[AAD-Samples-MT]: https://azure.microsoft.com/documentation/samples/?service=active-directory&term=multitenant
[AAD-Why-To-Integrate]: ./active-directory-how-to-integrate.md
[AZURE-classic-portal]: https://manage.windowsazure.com
[MSFT-Graph-AAD]: https://graph.microsoft.io/en-us/docs/authorization/permission_scopes

<!--Image references-->
[AAD-Sign-In]: ./media/active-directory-devhowto-multi-tenant-overview/sign-in-with-microsoft-light.png
[Consent-Single-Tier]: ./media/active-directory-devhowto-multi-tenant-overview/consent-flow-single-tier.png
[Consent-Multi-Tier-Known-Client]: ./media/active-directory-devhowto-multi-tenant-overview/consent-flow-multi-tier-known-clients.png
[Consent-Multi-Tier-Multi-Party]: ./media/active-directory-devhowto-multi-tenant-overview/consent-flow-multi-tier-multi-party.png

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
[AAD-Security-Token-Claims]: ./active-directory-authentication-scenarios/#claims-in-azure-ad-security-tokens
[AAD-Tokens-Claims]: ./active-directory-token-and-claims.md
[AAD-V2-Dev-Guide]: ./active-directory-appmodel-v2-overview.md
[AZURE-classic-portal]: https://manage.windowsazure.com
[Duyshant-Role-Blog]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/
[JWT]: https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32
[O365-Perm-Ref]: https://msdn.microsoft.com/en-us/office/office365/howto/application-manifest
[OAuth2-Access-Token-Scopes]: https://tools.ietf.org/html/rfc6749#section-3.3
[OAuth2-AuthZ-Code-Grant-Flow]: https://msdn.microsoft.com/library/azure/dn645542.aspx
[OAuth2-AuthZ-Grant-Types]: https://tools.ietf.org/html/rfc6749#section-1.3 
[OAuth2-Client-Types]: https://tools.ietf.org/html/rfc6749#section-2.1
[OAuth2-Role-Def]: https://tools.ietf.org/html/rfc6749#page-6
[OpenIDConnect]: http://openid.net/specs/openid-connect-core-1_0.html
[OpenIDConnect-ID-Token]: http://openid.net/specs/openid-connect-core-1_0.html#IDToken














