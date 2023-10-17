---
title: Convert single-tenant app to multi-tenant on Microsoft Entra ID
description: Shows how to convert an existing single-tenant app to a multi-tenant app that can sign in a user from any Microsoft Entra tenant.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 10/20/2022
ms.author: cwerner
ms.reviewer: marsma, jmprieur, lenalepa, sureshja, kkrishna
ms.custom: aaddev, engagement-fy23
#Customer intent: As an Azure user, I want to convert a single tenant app to a Microsoft Entra multi-tenant app so any Microsoft Entra user can sign in,
---

# Making your application multi-tenant

If you offer a Software as a Service (SaaS) application to many organizations, you can configure your application to accept sign-ins from any Microsoft Entra tenant by converting it to multi-tenant. Users in any Microsoft Entra tenant will be able to sign in to your application after consenting to use their account with your application.

For existing apps with its own account system (or other sign-ins from other cloud providers), you should add sign-in code via OAuth2, OpenID Connect, or SAML, and put a ["Sign in with Microsoft" button][AAD-App-Branding] in your application. 

In this how-to guide, you'll undertake the four steps needed to convert a single tenant app into a Microsoft Entra multi-tenant app:

1. [Update your application registration to be multi-tenant](#update-registration-to-be-multi-tenant)
2. [Update your code to send requests to the `/common` endpoint](#update-your-code-to-send-requests-to-common)
3. [Update your code to handle multiple issuer values](#update-your-code-to-handle-multiple-issuer-values)
4. [Understand user and admin consent and make appropriate code changes](#understand-user-and-admin-consent-and-make-appropriate-code-changes)

You can also refer to the sample; [Build a multi-tenant SaaS web application that calls Microsoft Graph using Microsoft Entra ID and OpenID Connect](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/2-WebApp-graph-user/2-3-Multi-Tenant/README.md). This how-to assumes familiarity with building a single-tenant application for Microsoft Entra ID. If not, start with one of the quickstarts on the [developer guide homepage][AAD-Dev-Guide].

## Update registration to be multi-tenant

By default, web app/API registrations in Microsoft Entra ID are single-tenant upon creation. To make the registration multi-tenant, look for the **Supported account types** section on the **Authentication** pane of the application registration in the [Azure portal]. Change the setting to **Accounts in any organizational directory**.

When a single-tenant application is created via the Azure portal, one of the items listed on the **Overview** page is the **Application ID URI**. This is one of the ways an application is identified in protocol messages, and can be added at any time. The App ID URI for single tenant apps can be globally unique within that tenant. In contrast, for multi-tenant apps it must be globally unique across all tenants, which ensures that Microsoft Entra ID can find the app across all tenants.

For example, if the name of your tenant was `contoso.onmicrosoft.com` then a valid App ID URI would be `https://contoso.onmicrosoft.com/myapp`. If the App ID URI doesn’t follow this pattern, setting an application as multi-tenant fails.

## Update your code to send requests to `/common`

With a multi-tenant application, because the application can't immediately tell which tenant the user is from, requests can't be sent to a tenant’s endpoint. Instead, requests are sent to an endpoint that multiplexes across all Microsoft Entra tenants: `https://login.microsoftonline.com/common`.

Edit your code and change the value for your tenant to `/common`. It's important to note that this endpoint isn't a tenant or an issuer itself. When the Microsoft identity platform receives a request on the `/common` endpoint, it signs the user in, thereby discovering which tenant the user is from. This endpoint works with all of the authentication protocols supported by the Microsoft Entra ID (OpenID Connect, OAuth 2.0, SAML 2.0, WS-Federation).

The sign-in response to the application then contains a token representing the user. The issuer value in the token tells an application what tenant the user is from. When a response returns from the `/common` endpoint, the issuer value in the token corresponds to the user’s tenant.

> [!NOTE]
> There are, in reality 2 authorities for multi-tenant applications: 
> - `https://login.microsoftonline.com/common` for applications processing accounts in any organizational directory (any Microsoft Entra directory) and personal Microsoft accounts (e.g. Skype, XBox).
> - `https://login.microsoftonline.com/organizations` for applications processing accounts in any organizational directory (any Microsoft Entra directory):
> 
> The explanations in this document use `common`. But you can replace it by `organizations` if your application doesn't support Microsoft personal accounts.

## Update your code to handle multiple issuer values

Web applications and web APIs receive and validate tokens from the Microsoft identity platform. Native client applications don't validate access tokens and must treat them as opaque. They instead request and receive tokens from the Microsoft identity platform, and do so to send them to APIs, where they're then validated. 

Multi-tenant applications must perform additional checks when validating a token. A multi-tenant application is configured to consume keys metadata from `/organizations` or `/common` keys URLs. The application must validate that the `issuer` property in the published metadata matches the `iss` claim in the token, in addition to the usual check that the `iss` claim in the token contains the tenant ID (`tid`) claim. For more information see [Validate tokens](access-tokens.md#validate-tokens).

## Understand user and admin consent and make appropriate code changes

For a user to sign in to an application in Microsoft Entra ID, the application must be represented in the user’s tenant. This allows the organization to do things like apply unique policies when users from their tenant sign in to the application. For a single-tenant application, one can use the registration via the [Azure portal].

For a multi-tenant application, the initial registration for the application resides in the Microsoft Entra tenant used by the developer. When a user from a different tenant signs in to the application for the first time, Microsoft Entra ID asks them to consent to the permissions requested by the application. If they consent, then a representation of the application called a *service principal* is created in the user’s tenant, and sign-in can continue. A delegation is also created in the directory that records the user’s consent to the application. For details on the application's Application and ServicePrincipal objects, and how they relate to each other, see [Application objects and service principal objects][AAD-App-SP-Objects].

![Diagram which illustrates a user's consent to a single-tier app.][Consent-Single-Tier]

This consent experience is affected by the permissions requested by the application. The Microsoft identity platform supports two kinds of permissions, app-only and delegated.

* A delegated permission grants an application the ability to act as a signed in user for a subset of the things the user can do. For example, you can grant an application the delegated permission to read the signed in user’s calendar.
* An app-only permission is granted directly to the identity of the application. For example, you can grant an application the app-only permission to read the list of users in a tenant, regardless of who is signed in to the application.

Some permissions can be consented to by a regular user, while others require a tenant administrator’s consent.

To learn more about user and admin consent, see [Configure the admin consent workflow](../manage-apps/configure-admin-consent-workflow.md).

### Admin consent

App-only permissions always require a tenant administrator’s consent. If your application requests an app-only permission and a user tries to sign in to the application, an error message is displayed saying the user isn’t able to consent.

Certain delegated permissions also require a tenant administrator’s consent. For example, the ability to write back to Microsoft Entra ID as the signed in user requires a tenant administrator’s consent. Like app-only permissions, if an ordinary user tries to sign in to an application that requests a delegated permission that requires administrator consent, the app receives an error. Whether a permission requires admin consent is determined by the developer that published the resource, and can be found in the documentation for the resource. The permissions documentation for the [Microsoft Graph API][MSFT-Graph-permission-scopes] indicate which permissions require admin consent.

If your application uses permissions that require admin consent, consider adding a button or link where the admin can initiate the action. The request your application sends for this action is the usual OAuth2/OpenID Connect authorization request that also includes the `prompt=consent` query string parameter. Once the admin has consented and the service principal is created in the customer’s tenant, subsequent sign-in requests don't need the `prompt=consent` parameter. Since the administrator has decided the requested permissions are acceptable, no other users in the tenant are prompted for consent from that point forward.

A tenant administrator can disable the ability for regular users to consent to applications. If this capability is disabled, admin consent is always required for the application to be used in the tenant. If you want to test your application with end-user consent disabled, you can find the configuration switch in the [Azure portal] in the **[User settings](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/UserSettings/menuId/)** section under **Enterprise applications**.

The `prompt=consent` parameter can also be used by applications that request permissions that don't require admin consent. An example of when this would be used is if the application requires an experience where the tenant admin “signs up” one time, and no other users are prompted for consent from that point on.

If an application requires admin consent and an admin signs in without the `prompt=consent` parameter being sent, when the admin successfully consents to the application it will apply **only for their user account**. Regular users will still not be able to sign in or consent to the application. This feature is useful if you want to give the tenant administrator the ability to explore your application before allowing other users access.

### Consent and multi-tier applications

Your application may have multiple tiers, each represented by its own registration in Microsoft Entra ID. For example, a native application that calls a web API, or a web application that calls a web API. In both of these cases, the client (native app or web app) requests permissions to call the resource (web API). For the client to be successfully consented into a customer’s tenant, all resources to which it requests permissions must already exist in the customer’s tenant. If this condition isn’t met, Microsoft Entra ID returns an error that the resource must be added first.

#### Multiple tiers in a single tenant

This can be a problem if your logical application consists of two or more application registrations, for example a separate client and resource. How do you get the resource into the customer tenant first? Microsoft Entra ID covers this case by enabling client and resource to be consented in a single step. The user sees the sum total of the permissions requested by both the client and resource on the consent page. To enable this behavior, the resource’s application registration must include the client’s App ID as a `knownClientApplications` in its [application manifest][AAD-App-Manifest]. For example:

```json
"knownClientApplications": ["94da0930-763f-45c7-8d26-04d5938baab2"]
```

This is demonstrated in a multi-tier native client calling web API sample in the [Related content](#related-content) section at the end of this article. The following diagram provides an overview of consent for a multi-tier app registered in a single tenant.

![Diagram which illustrates consent to multi-tier known client app.][Consent-Multi-Tier-Known-Client]

#### Multiple tiers in multiple tenants

A similar case happens if the different tiers of an application are registered in different tenants. For example, consider the case of building a native client application that calls the Exchange Online API. To develop the native application, and later for the native application to run in a customer’s tenant, the Exchange Online service principal must be present. In this case, the developer and customer must purchase Exchange Online for the service principal to be created in their tenants.

If it's an API built by an organization other than Microsoft, the developer of the API needs to provide a way for their customers to consent the application into their customers' tenants. The recommended design is for the third-party developer to build the API such that it can also function as a web client to implement sign-up. To do this:

1. Follow the earlier sections to ensure the API implements the multi-tenant application registration/code requirements.
2. In addition to exposing the API's scopes/roles, make sure the registration includes the "Sign in and read user profile" permission (provided by default).
3. Implement a sign-in/sign-up page in the web client and follow the [admin consent](#admin-consent) guidance.
4. Once the user consents to the application, the service principal and consent delegation links are created in their tenant, and the native application can get tokens for the API.

The following diagram provides an overview of consent for a multi-tier app registered in different tenants.

![Diagram which illustrates consent to multi-tier multi-party app.][Consent-Multi-Tier-Multi-Party]

### Revoking consent

Users and administrators can revoke consent to your application at any time:

* Users revoke access to individual applications by removing them from their [Access Panel Applications][AAD-Access-Panel] list.
* Administrators revoke access to applications by removing them using the [Enterprise applications](https://portal.azure.com/#blade/Microsoft_AAD_IAM/StartboardApplicationsMenuBlade/AllApps) section of the [Azure portal].

If an administrator consents to an application for all users in a tenant, users can't revoke access individually. Only the administrator can revoke access, and only for the whole application.

## Multi-tenant applications and caching access tokens

Multi-tenant applications can also get access tokens to call APIs that are protected by Microsoft Entra ID. A common error when using the Microsoft Authentication Library (MSAL) with a multi-tenant application is to initially request a token for a user using `/common`, receive a response, then request a subsequent token for that same user also using `/common`. Because the response from Microsoft Entra ID comes from a tenant, not `/common`, MSAL caches the token as being from the tenant. The subsequent call to `/common` to get an access token for the user misses the cache entry, and the user is prompted to sign in again. To avoid missing the cache, make sure subsequent calls for an already signed in user are made to the tenant’s endpoint.

## Related content

* [Multi-tenant application sample](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/blob/master/2-WebApp-graph-user/2-3-Multi-Tenant/README.md)
* [Multi-tier multi-tenant application sample](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/blob/main/6-AdvancedScenarios/2-call-api-mt/README.md)
* [Branding guidelines for applications][AAD-App-Branding]
* [Application objects and service principal objects][AAD-App-SP-Objects]
* [Integrating applications with Microsoft Entra ID][AAD-Integrating-Apps]
* [Overview of the Consent Framework][AAD-Consent-Overview]
* [Microsoft Graph API permission scopes][MSFT-Graph-permission-scopes]
* [Access tokens](access-tokens.md)

## Next steps

In this article, you learned how to convert a single tenant application to a multi-tenant application. After enabling single sign-on (SSO) between your app and Microsoft Entra ID, update your app to access APIs exposed by Microsoft resources like Microsoft 365. This lets you offer a personalized experience in your application, such as showing contextual information to the users, for example, profile pictures and calendar appointments.

To learn more about making API calls to Microsoft Entra ID and Microsoft 365 services like Exchange, SharePoint, OneDrive, OneNote, and more, visit [Microsoft Graph API][MSFT-Graph-overview].

<!--Reference style links IN USE -->
[AAD-Access-Panel]:  https://myapps.microsoft.com
[AAD-App-Branding]:howto-add-branding-in-apps.md
[AAD-App-Manifest]:./reference-app-manifest.md
[AAD-App-SP-Objects]:app-objects-and-service-principals.md
[AAD-Auth-Scenarios]:./authentication-vs-authorization.md
[AAD-Consent-Overview]:./application-consent-experience.md
[AAD-Dev-Guide]:./index.yml
[AAD-Integrating-Apps]:./quickstart-register-app.md
[AAD-Samples-MT]: /samples/browse/?products=azure-active-directory
[AAD-Why-To-Integrate]: ./how-to-integrate.md
[MSFT-Graph-overview]: /graph/
[MSFT-Graph-permission-scopes]: /graph/permissions-reference

<!--Image references-->
[AAD-Sign-In]: ./media/devhowto-multi-tenant-overview/sign-in-with-microsoft-light.png
[Consent-Single-Tier]: ./media/howto-convert-app-to-be-multi-tenant/consent-flow-single-tier.svg
[Consent-Multi-Tier-Known-Client]: ./media/howto-convert-app-to-be-multi-tenant/consent-flow-multi-tier-known-clients.svg
[Consent-Multi-Tier-Multi-Party]: ./media/howto-convert-app-to-be-multi-tenant/consent-flow-multi-tier-multi-party.svg

<!--Reference style links -->
[AAD-App-Manifest]:./reference-app-manifest.md
[AAD-App-SP-Objects]:app-objects-and-service-principals.md
[AAD-Auth-Scenarios]:./authentication-vs-authorization.md
[AAD-Integrating-Apps]:./quickstart-register-app.md
[AAD-Dev-Guide]:./configure-app-multi-instancing.md
[AAD-How-To-Integrate]: ./how-to-integrate.md
[AAD-Security-Token-Claims]: ./authentication-vs-authorization.md#claims-in-azure-ad-security-tokens
[AAD-Tokens-Claims]:access-tokens.md
[AAD-V2-Dev-Guide]: v2-overview.md
[Azure portal]: https://portal.azure.com
[Duyshant-Role-Blog]: http://www.dushyantgill.com/blog/2014/12/10/roles-based-access-control-in-cloud-applications-using-azure-ad/
[JWT]: https://tools.ietf.org/html/draft-ietf-oauth-json-web-token-32
[O365-Perm-Ref]: /graph/permissions-reference
[OAuth2-Access-Token-Scopes]: https://tools.ietf.org/html/rfc6749#section-3.3
[OAuth2-AuthZ-Grant-Types]: https://tools.ietf.org/html/rfc6749#section-1.3
[OAuth2-Client-Types]: https://tools.ietf.org/html/rfc6749#section-2.1
[OAuth2-Role-Def]: https://tools.ietf.org/html/rfc6749#page-6
[OpenIDConnect]: https://openid.net/specs/openid-connect-core-1_0.html
[OpenIDConnect-ID-Token]: https://openid.net/specs/openid-connect-core-1_0.html#IDToken
