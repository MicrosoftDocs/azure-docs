---
title: Errors and exceptions (MSAL) | Azure
description: Learn how to handle errors and exceptions, Conditional Access, and claims challenge in MSAL applications.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 04/10/2019
ms.author: ryanwi
ms.reviewer: saeeda
ms.custom: aaddev
---

# Handling exceptions and errors using MSAL
Exceptions in Microsoft Authentication Library (MSAL) are intended for app developers to troubleshoot and not for displaying to end users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions.  For a list of error codes, see [Authentication and authorization error codes](reference-aadsts-error-codes.md).

## .NET exceptions
When processing exceptions, you can use the exception type itself and the `ErrorCode` member to distinguish between exceptions. The values of `ErrorCode` are constants of type [MsalError](/dotnet/api/microsoft.identity.client.msalerror?view=azure-dotnet).

You can also have a look at the fields of [MsalClientException](/dotnet/api/microsoft.identity.client.msalexception?view=azure-dotnet), [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet), [MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet).

If [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) is thrown, the error code might contain a code that you can find in [Authentication and authorization error codes](reference-aadsts-error-codes.md).

### Common exceptions
Here are the common exceptions that might be thrown and some possible mitigations.

| Exception | Error code | Mitigation|
| --- | --- | --- |
| [MsalUiRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet) | AADSTS65001: The user or administrator has not consented to use the application with ID '{appId}' named '{appName}'. Send an interactive authorization request for this user and resource.| You need to get user consent first. If you are not using .NET Core (which does not have any Web UI), call (once only) `AcquireTokeninteractive`. If you are using .NET core or don't want to do an `AcquireTokenInteractive`, the user can navigate to a URL to give consent: https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=user.read . To call `AcquireTokenInteractive`: `app.AcquireTokenInteractive(scopes).WithAccount(account).WithClaims(ex.Claims).ExecuteAsync();`|
| [MsalUiRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet) | AADSTS50079: The user is required to use multi-factor authentication.| There is no mitigation - if MFA is configured for your tenant and AAD decides to enforce it, you need to fallback to an interactive flow such as `AcquireTokenInteractive` or `AcquireTokenByDeviceCode`.|
| [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) |AADSTS90010: The grant type is not supported over the */common* or */consumers* endpoints. Use the */organizations* or tenant-specific endpoint. You used */common*.| As explained in the message from Azure AD, the authority needs to have a tenant or otherwise */organizations*.|
| [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) | AADSTS70002: The request body must contain the following parameter: 'client_secret or client_assertion'.| This can happen if your application was not registered as a public client application in Azure AD. In the Azure portal, edit the manifest for your application and set the `allowPublicClient` to `true`. |
| [MsalClientException](/dotnet/api/microsoft.identity.client.msalclientexception?view=azure-dotnet)| unknown_user Message: Could not identify logged in user| The library was unable to query the current Windows logged-in user or this user is not AD or AAD joined (work-place joined users are not supported). Mitigation 1: on UWP, check that the application has the following capabilities: Enterprise Authentication, Private Networks (Client and Server), User Account Information. Mitigation 2: Implement your own logic to fetch the username (for example, john@contoso.com) and use the `AcquireTokenByIntegratedWindowsAuth` form that takes in the username.|
| [MsalClientException](/dotnet/api/microsoft.identity.client.msalclientexception?view=azure-dotnet)|integrated_windows_auth_not_supported_managed_user| This method relies on a protocol exposed by Active Directory (AD). If a user was created in Azure Active Directory without AD backing ("managed" user), this method will fail. Users created in AD and backed by AAD ("federated" users) can benefit from this non-interactive method of authentication. Mitigation: Use interactive authentication.|

## JavaScript errors

MSAL.js provides Error objects that abstract and classify the different types of common errors and have an interface to access specific details of the errors such as error messages to handle them appropriately.

**Error object**

```javascript                                
export class AuthError extends Error {
    // This is a short code describing the error
    errorCode: string;
    // This is a descriptive string of the error,
    // and may also contain the mitigation strategy
    errorMessage: string;
    // Name of the error class
    this.name = "AuthError";
}
```                
By extending the error class, you have access to the following properties:
* **AuthError.message:** This is the same as errorMessage.
* **AuthError.stack:** Stack trace for thrown errors. Allows tracing to origin point of error.

**Error Types**

The following error types are available:

* *AuthError:* Base error class for the MSAL.js library, also used for unexpected errors.

* *ClientAuthError:* Error class which denotes an issue with Client authentication. Most errors that come from the library will be ClientAuthErrors. These may be errors such as calling a login method when login is in progress, users canceling login, etc.

* *ClientConfigurationError:* Error class extending ClientAuthError thrown before requests are made when the given user config parameters is malformed or missing.

* *ServerError:* Error class to represent the error strings sent by the authentication server. These may be errors such as invalid request formats or parameters, or any other errors that prevent the server from authenticating or authorizing the user.

* *InteractionRequiredAuthError:* Error class extending ServerError to represent server errors which require an interactive call. This is thrown by `acquireTokenSilent` if the user is required to interact with the server to provide credentials or consent for authentication/authorization. Error codes include "interaction_required", "login_required", "consent_required".

For error handling in authentication flows with redirect methods (`loginRedirect`, `acquireTokenRedirect`), you will need to register the callback which is called with success or failure after the redirect using `handleRedirectCallback()` method as follows:

```javascript
function authCallback(error, response) {
    //handle redirect response
}


var myMSALObj = new Msal.UserAgentApplication(msalConfig);

// Register Callbacks for redirect flow
myMSALObj.handleRedirectCallback(authCallback);

myMSALObj.acquireTokenRedirect(request);
```

The methods for pop-up experience (`loginPopup`, `acquireTokenPopup`) return promises, so you can use the promise pattern (.then and .catch) to handle them as shown:

```javascript
myMSALObj.acquireTokenPopup(request).then(
    function (response) {
        // success response
    }).catch(function (error) {
        console.log(error);
    });
```

### Interaction required errors

An error is returned when a UI interaction is required. This means you have attempted to use a non-interactive method of acquiring a token (for example, `acquireTokenSilent`), but MSAL could not do it silently. Possible reasons are:

* you need to sign in
* you need to consent
* you need to go through a multi-factor authentication experience.

The remediation is to call an interactive method such as `acquireTokenPopup` or `acquireTokenRedirect`:

```javascript
// Request for Access Token
myMSALObj.acquireTokenSilent(request).then(function (response) {
    // call API
}).catch( function (error) {
    // call acquireTokenPopup in case of acquireTokenSilent failure
    // due to consent or interaction required
    if (error.errorCode === "consent_required"
    || error.errorCode === "interaction_required"
    || error.errorCode === "login_required") {
        myMSALObj.acquireTokenPopup(request).then(
            function (response) {
                // call API
            }).catch(function (error) {
                console.log(error);
            });
    }
});
```

## Conditional Access and claims challenges
When getting tokens silently, your application may receive errors when a [Conditional Access claims challenge](conditional-access-dev-guide.md) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to interactively acquire a token using MSAL. Interactively acquiring a token prompts the user and gives them the opportunity to satisfy the required Conditional Access policy.

In certain cases when calling an API requiring Conditional Access, you can receive a claims challenge in the error from the API. For instance if the Conditional Access policy is to have a managed device (Intune) the error will be something like [AADSTS53000: Your device is required to be managed to access this resource](reference-aadsts-error-codes.md) or something similar. In this case, you can pass the claims in the acquire token call so that the user is prompted to satisfy the appropriate policy.

### .NET
When calling an API requiring Conditional Access from MSAL.NET, your application will need to handle claim challenge exceptions. This will appear as an [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) where the [Claims](/dotnet/api/microsoft.identity.client.msalserviceexception.claims?view=azure-dotnet) property won't be empty.

To handle the claim challenge, you will need to use the `.WithClaim()` method of the `PublicClientApplicationBuilder` class.

### JavaScript
When getting tokens silently (using `acquireTokenSilent`) using MSAL.js, your application may receive errors when a [Conditional Access claims challenge](conditional-access-dev-guide.md) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to make an interactive call to acquire token in MSAL.js such as `acquireTokenPopup` or `acquireTokenRedirect` as in the following example:

```javascript
myMSALObj.acquireTokenSilent(accessTokenRequest).then(function (accessTokenResponse) {
    // call API
}).catch( function (error) {
    // call acquireTokenPopup in case of acquireTokenSilent failure
    myMSALObj.acquireTokenPopup(accessTokenRequest).then(
        function (accessTokenResponse) {
            // call API
        }).catch(function (error) {
            console.log(error);
        });
});
```

Interactively acquiring the token prompts the user and gives them the opportunity to satisfy the required Conditional Access policy.

When calling an API requiring Conditional Access, you can receive a claims challenge in the error from the API. In this case, you can pass the claims returned in the error as `extraQueryParameters` in the call to acquire tokens so that the user is prompted to satisfy the appropriate policy:

```javascript
var request = {
    scopes: ["user.read"],
    extraQueryParameters: {claims: claims}
}

myMSALObj.acquireTokenPopup(request);
```

## Retrying after errors and exceptions

### HTTP error codes 500-600
MSAL.NET implements a simple retry-once mechanism for errors with HTTP error codes 500-600.

### HTTP 429
When the Service Token Server (STS) is too busy because of “too many requests”, it returns an HTTP error 429 with a hint about when you can try again (the Retry-After response field) as a delay in seconds, or a date.

#### .NET
The [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) exception surfaces `System.Net.Http.Headers.HttpResponseHeaders` as a property `namedHeaders`. You can therefore leverage additional information from the error code to improve the reliability of your applications. In the case we just described, you can use the `RetryAfterproperty` (of type `RetryConditionHeaderValue`) and compute when to retry.

Here is an example for a daemon application (using the client credentials flow), but you could adapt that to any of the methods acquiring a token.

```csharp
do
{
 retry = false;
 TimeSpan? delay;
 try
 {
  result = await publicClientApplication.AcquireTokenForClient(scopes, account)
                                        .ExecuteAsync();
 }
 catch (MsalServiceException serviceException)
 {
  if (ex.ErrorCode == "temporarily_unavailable")
  {
   RetryConditionHeaderValue retryAfter = serviceException.Headers.RetryAfter;
   if (retryAfter.Delta.HasValue)
   {
    delay = retryAfter.Delta;
   }
   else if (retryAfter.Date.HasValue)
   {
    delay = retryAfter.Date.Value.Offset;
   }
  }
 }

    …
 if (delay.HasValue)
 {
  Thread.Sleep((int)delay.Value.TotalMilliseconds); // sleep or other
  retry = true;
 }
} while (retry);
```
