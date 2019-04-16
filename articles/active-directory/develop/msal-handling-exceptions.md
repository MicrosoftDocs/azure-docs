---
title: Claims challenge exceptions (MSAL.NET) | Azure
description: Learn how to handle claims challenge exceptions in MSAL.NET applications.
services: active-directory
documentationcenter: dev-center-name
author: rwike77
manager: celested
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

## Handling exceptions and errors using MSAL:
Exceptions in Microsoft Authentication Library (MSAL) are intended for app developers to troubleshoot and not for displaying to end-users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions.  For a list of error codes, see [Authentication and authorization error codes](reference-aadsts-error-codes.md).

### .NET
When processing exceptions, you can use the exception type itself and the `ErrorCode` member to distinguish between exceptions. The values of `ErrorCode` are constants of type [MsalError](/dotnet/api/microsoft.identity.client.msalerror?view=azure-dotnet#fields).

You can also have a look at the fields of [MsalClientException](/dotnet/api/microsoft.identity.client.msalexception?view=azure-dotnet#fields), [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet#fields), [MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet#fields).

In the case of `MsalServiceException`, the error code might contain a code which you can find in [Authentication and authorization error codes](reference-aadsts-error-codes.md).

#### MsalUiRequiredException
The `MsalUiRequiredException` exception, a sub-type of `MsalServiceException`, is returned when a UI is required. This means you have attempted to use a non-interactive method of acquiring a token (for example, AcquireTokenSilent), but MSAL could not do it silently. Possible reasons are:

* you need to sign-in
* you need to consent
* you need to go through a multi-factor authentication experience.

The remediation is to call the `AcquireTokenInteractive` method:

```csharp
try
{ 
 app.AcquireTokenXXX(scopes, account)
   .WithYYYY(...)
   .ExecuteAsync()
}
catch(MsalUiRequiredException ex)
{
 app.AcquireTokenInteractive(scopes)
    .WithAccount(account)
    .WithClaims(ex.Claims)
    .ExecuteAsync();
}
```

### JavaScript
When processing exceptions, you can use the exception type itself and the `ErrorCode` member to distinguish between exceptions. The values of `ErrorCode` are constants of type [MsalError](/dotnet/api/microsoft.identity.client.msalerror?view=azure-dotnet#fields).

#### UI required errors
An error is returned when a UI is required. This means you have attempted to use a non-interactive method of acquiring a token (for example, `acquireTokenSilent`), but MSAL could not do it silently. Possible reasons are:

* you need to sign-in
* you need to consent
* you need to go through a multi-factor authentication experience.

The remediation is to call the `AcquireTokenPopup` method:

```javascript
//Call acquireTokenSilent (iframe) to obtain a token for Microsoft Graph
myMSALObj.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
    callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback);
}, function (error) {
    console.log(error);
    // Call acquireTokenPopup (popup window) in case of acquireTokenSilent failure due to consent or interaction required ONLY
    if (error.indexOf("consent_required") !== -1 || error.indexOf("interaction_required") !== -1 || error.indexOf("login_required") !== -1) {
        myMSALObj.acquireTokenPopup(applicationConfig.graphScopes).then(function (accessToken) {
            callMSGraph(applicationConfig.graphEndpoint, accessToken, graphAPICallback);
        }, function (error) {
            console.log(error);
        });
    }
});
```

## Handling conditional access and claims challenges
When getting tokens silently, your application may receive errors when a [conditional access claims challenge](conditional-access-dev-guide.md#scenario-single-page-app-spa-using-adaljs) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to interactively aquire a token using MSAL. This prompts the user and gives them the opportunity to satisfy the required CA policy.

In certain cases when calling an API requiring conditional access, you can receive a claims challenge in the error from the API. For instance if the conditional access policy is to have a managed device (Intune) the error will be something like [AADSTS53000: Your device is required to be managed to access this resource](reference-aadsts-error-codes.md) or something similar. In this case, you can pass the claims in the acquire token call so that the user is prompted to satisfy the appropriate policy.

### .NET
When calling an API requiring conditional access from MSAL.NET, your application will need to handle claim challenge exceptions. This will appear as an `MsalServiceException` where the `Claims` property won't be empty. 

To handle the claim challenge, you will need to use the `.WithClaim()` method of the `PublicClientApplicationBuilder` class.

### JavaScript
When getting tokens silently (using `acquireTokenSilent`) using MSAL.js, your application may receive errors when a [conditional access claims challenge](conditional-access-dev-guide.md#scenario-single-page-app-spa-using-adaljs) such as MFA policy is required by an API you are trying to access.

The pattern to handle this error is to make an interactive `acquireToken` call in MSAL.js such as `acquireTokenPopup` or `acquireTokenRedirect` as in the following example:

```javascript
this.acquireTokenSilent(applicationConfig.graphScopes).then(function (accessToken) {
    updateUI();
}, function (error) {
    console.log(error);
    this.acquireTokenPopup(applicationConfig.graphScopes).then(function (accessToken) {
        updateUI();
    }, function (error) {
        console.log(error);
    });
});
```

This prompts the user and gives them the opportunity to satisfy the required CA policy.

When calling an API requiring conditional access, you can receive a claims challenge in the error from the API. In this case, you can pass the claims as `extraQueryParameters` in the `acquireToken` call so that the user is prompted to satisfy the appropriate policy:

```javascript
acquireTokenPopup(applicationConfig.graphScopes, null, null, "&claims=" + claims);
```

## Retrying after errors and exceptions

### HTTP error codes 500-600
MSAL.NET implements a simple retry-once mechanism for errors with HTTP error codes 500-600.

### HTTP 429
When the Service Token Server (STS) is too busy because of “too many requests”, it returns an HTTP error 429 with a hint about when you can try again (the Retry-After response field) as a delay in seconds, or a date. 

#### .NET
`MsalServiceException` surfaces `System.Net.Http.Headers.HttpResponseHeaders` as a property `namedHeaders`. You can therefore leverage additional information from the error code to improve the reliability of your applications. In the case we just described, you can use the `RetryAfterproperty` (of type `RetryConditionHeaderValue`) and compute when to retry.

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