---
title: Developer Guidance for Conditional Access | Microsoft Docs
description: 
services: active-directory
keywords: 
author: danieldobalian
manager: mbaldwin
editor: PatAltimore
ms.author: dadobali
ms.date: 07/19/2017
ms.assetid: 115bdab2-e1fd-4403-ac15-d4195e24ac95
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
---

# Developer Guidance for Conditional Access

## Introduction

Azure Active Directory (AD) offers several great ways to secure your app and protect a service.  One of these unique features is Conditional Access.  Conditional Access enables developers and enterprise customers to protect services in a multitude of ways including Multi-Factor Authentication, only allowing Intune enrolled devices to access specific services, restricting user locations and ip ranges, and several other factors.   
For more information on the full capabilities of Conditional Access, checkout [Conditional Access in Azure Active Directory](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access). 
In this article, we'll be focusing on what Conditional Access means to developers building apps for Azure AD.  It assumes knowledge of [single](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-integrating-applications) & [multi-tenanted](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-devhowto-multi-tenant-overview) apps and [common authentication patterns](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios).  
We'll dive into the impact of accessing resources you don't have control over that may have conditional access policies applied.  Moreover, we will explore the implications of Conditional Access in the On-Behalf-Of flow, Web Apps, accessing the Microsoft Graph, and calling API's.

## How does conditional access impact an app

### App topologies impacted

In most common cases, conditional access will not change an app's behavior or will require any changes from the developer.  Only in certain cases when an app indirectly requests tokens for a service will an app require any code changes to handle conditional access "challenges".

Specifically, the following scenarios require code to handle conditional access "challenges":

* Single Page Apps using ADAL.js
* Apps Accessing Multiple Services/Resources
* Apps Performing the On-behalf-of flow
* Apps Accessing the Microsoft Graph

Conditional Access policies can be applied to the app, but also can be applied to a web API your app accesses. To learn more about how to configure a conditional access policy, please see [Configuring conditional access](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-azuread-connected-apps#configure-per-application-access-rules).  

Depending on the scenario, an enterprise customer can apply and remove conditional access policies at any time.  In order for your app to continue functioning when a new policy is applied, you'll need to implement the "challenge" handling.  We'll walk through how to do this. 

### Conditional access examples

As we said above, some scenarios require code changes to handle conditional access whereas others will just work.  Here's a few scenarios using Conditional Access to do multi-factor authentication that give some insight into the difference.

* We're building a single-tenant iOS app and apply a CA policy.  This app signs in a user and doesn't request access to an API.  When the user signs in, the policy will be automatically invoked and the user will need to perform multi-factor auth, (MFA). 
* We're building a multi-tenant web app that uses the Microsoft Graph to access Exchange, among other services.  An enterprise customer who adopts this app sets a policy on SharePoint Online.  When the web app requests a token for MS Graph, a policy on any Microsoft Service will be applied (specifically services that can be accessed through graph).  This end user will be prompted for MFA. In the case the end-user is signed in with valid tokens, a claims "challenge" will be returned to the web app.  
* We're building a native app that uses a middle tier service to access the Microsoft graph.  An enterprise customer at the company using this app applies a policy to Exchange Online.  When an end-user signs in, the native app will request access to the middle tier and send the token.  The middle tier can then perform on-behalf-of to request access to the MS Graph.  At this point, a claims "challenge" will be presented to the middle tier. The middle tier sends this back to the native app which will need to "step-up" the token.

### Complying with a conditional access policy

For a number of different app topologies, a CA policy is evaluated when the session is established.  As a CA policy operates on the granularity of apps and services, the point at which it is invoked depends heavily on the scenario you're trying to accomplish.
 
When your app attempts to access a service with a CA policy, it may encounter a conditional access challenge.  This challenge is encoded in the `claims` parameter that comes in a response from Azure AD in the form of a `AADSTS500xxx` error.  It can be returned from either the /authorize or /token endpoints.

Here's an example: 

```
claims={"access_token":{"polids":{"essential":true,"Values":["<GUID>"]}}}
```

Developers can take this challenge and append it onto a new request to Azure AD.  Passing this state will prompt the end user to perform any action necessary to comply with the conditional access policy. 

## Scenarios

### Prerequisites

Azure AD Conditional Access is a feature included in [Azure AD Premium](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-editions).  You can learn more about licensing requirements in the [unlicensed usage report](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access-unlicensed-usage-report).  Developers can join the [Microsoft Developer Network](https://msdn.microsoft.com/en-us/dn308572.aspx) which includes a free subscription to the Enterprise Mobility Suite which includes Azure AD Premium.

### Considerations for specific scenarios

The following information only applies in these conditional access scenarios:

* Single Page Apps using ADAL.js
* Apps Accessing Multiple Services/Resources
* Apps Performing the On-behalf-of flow
* Apps Accessing the Microsoft Graph

In some of the following sections, we'll dive into some common scenarios in which this can get slightly more complex.  The core operating principle is Conditional Access policies are evaluated at the time the token is requested for that service. In the scenarios to follow, we will obtain tokens for a service that does not necessarily require conditional access and normally could use the same session or On-Behalf-Of to get a new token, but with the difference being this new token will require a new token to comply with the conditional access policy.

### Scenario: Single Page App (SPA) using ADAL.js

In this scenario, we will walk through the case when we have a single page app, (SPA) using ADAL.js to call a CA-protected Web API.  This is a fairly simple architecture, but has some nuances that need to be taken into account when developing around Conditional Access.

In ADAL.js, there's two functions that will obtain tokens: `login()` and `acquireToken(resource, callback)`.  The former obtains an id token through an interactive sign-in request, but does not obtain access tokens for any service (including our CA-protected Web API).  The latter obtains an access token and is a "silent" request meaning it will never be interactive.  If the token session is expired or we need to "step-up" our token, then the *acquireToken* function call will fail and we'll need to call `login()` again.

![Single page app using ADAL flow diagram](media/active-directory-conditional-access/spa-using-adal-scenario.png)

Let's walk through an example with our CA scenario.  The end user just landed on the site and doesn’t have a session.  We perform a *login()* call, get an id token without MFA.  Then the user hits a button that requires the app to request data from a Web API.  The app will try to do an `acquireToken()` call, but will fail since the user has not performed MFA yet and needs to "step-up" their token.

Azure AD will send back the following HTTP response: 

```
HTTP 400; Bad Request 
error=interaction_required
error_description=AADSTS50076: Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to access '<Web API App/Client ID>'.
claims={"access_token":{"polids":{"essential":true,"Values":["<GUID>"]}}}
```

Our app will need to catch the `error=interaction_required`, and extract the claims challenge inside the `acquireToken()` callback.  The application can then perform a custom `login()`.  This customized `login()` has ADAL.js construct a URL to request the new id token, but will give us the freedom to modify and append the `claims`.  The user will sign in again and be forced to do a multi-factor authentication. Once these steps are completed, the app can redo the original `acquireToken()` call to get an access token for our CA-protected Web API.

If we want to force all users to invoke the CA  policy when they first enter the app, we can follow the strategy of modifying the `login()` call to request the Web API service. This forces the CA policy to trigger and we would get a "stepped-up" token.

To try out this scenario, checkout our [code sample]().  This code sample uses the CA policy and Web API you registered earlier with a JS SPA to demonstrate this scenario.  It will show how to properly handle the claims challenge and get an access token that can be used for your Web API.

### Scenario: App accessing multiple services

In this scenario, we will walk through the case in which a web app accesses two services one of which has a CA policy assigned.  Depending on your app logic, there may exist a path in which your app will not require access to both web services.  In this scenario, the order in which you request a token plays an important role in the end user experience.

Let's assume we have web service A and B and web service B has our CA policy applied.  While the initial interactive auth request will require consent for both services, the CA policy will not be required in all cases.  If the app requests a token for web service B, then the policy will be invoked and subsequent requests for web service A will also succeed as seen below.

![App accessing multiple services flow diagram](media/active-directory-conditional-access/app-accessing-multiple-services-scenario.png)

Alternatively, if the app initially requests a token for web service A, the end user will not invoke the CA policy.  This allows the app developer to control the end user experience and not force the CA policy to be invoked in all cases. The tricky case is if the app subsequently requests a token for web service B. At this point, the end user needs to "step-up" their token.  When the app tries to `acquireToken`, it will fail and pass back the claims challenge in the HTTP error below: 

```
HTTP 400; Bad Request
error=interaction_required
error_description=AADSTS50076: Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to access '<Web API App/Client ID>'.
claims={"access_token":{"polids":{"essential":true,"Values":["<GUID>"]}}}
``` 

Just as in the SPA case, we can then request a new token with the claims challenge which will invoke the CA policy as seen in the flow below. 

![App accessing multiple services requesting a new token](media/active-directory-conditional-access/app-accessing-multiple-services-new-token.png)

For help with this scenario, refer to the [SPA sample]() for ADAL.js or the [On-behalf-of sample](https://github.com/Azure-Samples/active-directory-dotnet-webapi-onbehalfof-ca) for ADAL .NET. These samples don't do this scenario exactly, but provide the code necessary to handle the claims challenge in the case of the second diagram.

### Scenario: App performing the on-behalf-of flow

In this scenario, we will walk through the case in which a native app calls a Web Service/API.  In turn, this service does [the "on-behalf-of" flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/active-directory-authentication-scenarios#application-types-and-scenarios) to call a downstream service.  In our case, we've applied our Conditional Access policy to the downstream service (Web API 2) and are using a native app rather than a server/daemon app. 

![App performing the on-behalf-of flow diagram](media/active-directory-conditional-access/app-performing-on-behalf-of-scenario.png)

The initial token request for Web API 1 will not prompt the end user for MFA as Web API 1 may not always hit the downstream API.  Once Web API 1 tries to request a token on-behalf-of the user for Web API 2, the request will fail since the user has not signed in with MFA.

Azure AD will return a HTTP response with some interesting data: 

```
HTTP 400; Bad Request 
error=interaction_required
error_description=AADSTS50076: Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to access '<Web API 2 App/Client ID>'.
claims={"access_token":{"polids":{"essential":true,"Values":["<GUID>"]}}}
```

In our Web API 1, we catch the error `error=interaction_required`, and send back the `claims` challenge to the desktop app.  At that point, the desktop app can make a new [acquireToken()](https://docs.microsoft.com/en-us/active-directory/adal/microsoft.identitymodel.clients.activedirectory.authenticationcontext#Microsoft_IdentityModel_Clients_ActiveDirectory_AuthenticationContext_AcquireTokenAsync_System_String_System_String_System_Uri_Microsoft_IdentityModel_Clients_ActiveDirectory_IPlatformParameters_Microsoft_IdentityModel_Clients_ActiveDirectory_UserIdentifier_System_String_)  call and append the `claims`challenge as an extra query string parameter.  This new request will require the user to do MFA and then send this new token back to Web API 1 and complete the on-behalf-of flow.

To try out this scenario, checkout our [.NET code sample](https://github.com/Azure-Samples/active-directory-dotnet-webapi-onbehalfof-ca).  It demonstrates how to pass the claims challenge back from Web API 1 to the native app and construct a new request inside the client app. 

### Scenario: App accessing the Microsoft Graph

In this scenario, we will walk through the case when a web app requests access to the Microsoft Graph. The CA policy in this case could be assigned to SharePoint, Exchange, or some other service that is accessed through Graph.  This scenario is quite similar to the multiple service scenario, but unique because the services we're accessing is done through Microsoft Graph.

The app first requests authorization to some API without Conditional Access.  This succeeds without invoking the policy.  Your app then requests a token to the Microsoft Graph using the refresh token.  At this point, Azure AD will send back the claims challenge since the end user will need to "step-up", and the pattern becomes something we recognize.

Once presented with the HTTP response like below: 

```
HTTP 400; Bad Request 
error=interaction_required
error_description=AADSTS50076: Due to a configuration change made by your administrator, or because you moved to a new location, you must use multi-factor authentication to access '<Web API App/Client ID>'.
claims={"access_token":{"polids":{"essential":true,"Values":["<GUID>"]}}}
```

We can catch the `error=interaction_required` and extract the claims challenge for the next request.  Once it's appended to the new request, AzureAD will know to evaluate the CA policy when signing in the user and the token will be properly "stepped-up".

If MS Graph is the first interactive request to the end-user, the app will not be presented with a claims challenge because Azure AD will invoke the policy automatically.

It doesn't matter what service the Microsoft Graph is accessing, requesting access to Graph will invoke a CA policy applied to any service Graph is accessing on your behalf. For example, if the policy is applied to SharePoint Online and our app only requests scopes for Exchange, we will still be required to comply with the SharePoint Online policy.

For code samples that demonstrate how to handle the claims challenge, refer to the [SPA sample]() for ADAL.js or the [On-behalf-of sample](https://github.com/Azure-Samples/active-directory-dotnet-webapi-onbehalfof-ca) for ADAL .NET.

## See also

* To learn more about the capabilities, checkout [CA in AzureAD](https://docs.microsoft.com/en-us/azure/active-directory/active-directory-conditional-access).
* For more great AzureAD code samples, checkout our [Github repo of samples](https://github.com/azure-samples?utf8=%E2%9C%93&q=active-directory). 

