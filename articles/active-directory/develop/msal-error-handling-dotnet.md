---
title: Handle errors and exceptions in MSAL.NET
description: Learn how to handle errors and exceptions, Conditional Access claims challenges, and retries in MSAL.NET.
services: active-directory
author: Dickson-Mwendia
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 01/25/2023
ms.author: dmwendia
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---
# Handle errors and exceptions in MSAL.NET

[!INCLUDE [Active directory error handling introduction](../../../includes/active-directory-develop-error-handling-introduction.md)]

## Error handling in MSAL.NET

### Exception types
[MsalClientException](/dotnet/api/microsoft.identity.client.msalexception) is thrown when the library itself detects an error state, such as a bad configuration.

[MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) is thrown when the Identity Provider (Azure AD) returns an error. It's a translation of the server error.

[MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception) is type of [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) and indicates that user interaction is required, for example because MFA is required or because the user has changed their password and a token can't be acquired silently. 


### Processing exceptions
When processing .NET exceptions, you can use the exception type itself and the `ErrorCode` member to distinguish between exceptions. `ErrorCode` values are constants of type [MsalError](/dotnet/api/microsoft.identity.client.msalerror).

You can also have a look at the fields of [MsalClientException](/dotnet/api/microsoft.identity.client.msalexception), [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception), and [MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception).

If [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) is thrown, try [Authentication and authorization error codes](reference-error-codes.md) to see if the code is listed there.

If [MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception) is thrown, it's an indication that an interactive flow needs to happen for the user to resolve the issue. In public client apps such as desktop and mobile app, this is resolved by calling `AcquireTokenInteractive`, which displays a browser. In confidential client apps, web apps should redirect the user to the authorization page, and web APIs should return an HTTP status code and header indicative of the authentication failure (401 Unauthorized and a WWW-Authenticate header).

### Common .NET exceptions

Here are the common exceptions that might be thrown and some possible mitigations:  

| Exception | Error code | Mitigation|
| --- | --- | --- |
| [MsalUiRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception) | AADSTS65001: The user or administrator hasn't consented to use the application with ID '{appId}' named '{appName}'. Send an interactive authorization request for this user and resource.| Get user consent first. If you aren't using .NET Core (which doesn't have any Web UI), call (once only) `AcquireTokeninteractive`. If you're using .NET core or don't want to do an `AcquireTokenInteractive`, the user can navigate to a URL to give consent: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=user.read`. to call `AcquireTokenInteractive`: `app.AcquireTokenInteractive(scopes).WithAccount(account).WithClaims(ex.Claims).ExecuteAsync();`|
| [MsalUiRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception) | AADSTS50079: The user is required to use [multi-factor authentication (MFA)](../authentication/concept-mfa-howitworks.md).| There's no mitigation. If MFA is configured for your tenant and Azure Active Directory (Azure AD) decides to enforce it, fall back to an interactive flow such as `AcquireTokenInteractive`.|
| [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) |AADSTS90010: The grant type isn't supported over the */common* or */consumers* endpoints. Use the */organizations* or tenant-specific endpoint. You used */common*.| As explained in the message from Azure AD, the authority needs to have a tenant or otherwise */organizations*.|
| [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) | AADSTS70002: The request body must contain the following parameter: `client_secret or client_assertion`.| This exception can be thrown if your application wasn't registered as a public client application in Azure AD. In the Azure portal, edit the manifest for your application and set `allowPublicClient` to `true`. |
| [MsalClientException](/dotnet/api/microsoft.identity.client.msalclientexception)| `unknown_user Message`: Couldn't identify logged in user| The library was unable to query the current Windows logged-in user or this user isn't AD or Azure AD joined (work-place joined users aren't supported). Mitigation 1: on UWP, check that the application has the following capabilities: Enterprise Authentication, Private Networks (Client and Server), User Account Information. Mitigation 2: Implement your own logic to fetch the username (for example, john@contoso.com) and use the `AcquireTokenByIntegratedWindowsAuth` form that takes in the username.|
| [MsalClientException](/dotnet/api/microsoft.identity.client.msalclientexception)|integrated_windows_auth_not_supported_managed_user| This method relies on a protocol exposed by Active Directory (AD). If a user was created in Azure AD without AD backing ("managed" user), this method will fail. Users created in AD and backed by Azure AD ("federated" users) can benefit from this non-interactive method of authentication. Mitigation: Use interactive authentication.|

### `MsalUiRequiredException`

One of common status codes returned from MSAL.NET when calling `AcquireTokenSilent()` is `MsalError.InvalidGrantError`. This status code means that the application should call the authentication library again, but in interactive mode (AcquireTokenInteractive or AcquireTokenByDeviceCodeFlow for public client applications, do have a challenge in Web apps). This is because additional user interaction is required before authentication token can be issued.

Most of the time when `AcquireTokenSilent` fails, it is because the token cache doesn't have tokens matching your request. Access tokens expire in 1 hour, and `AcquireTokenSilent` will try to fetch a new one based on a refresh token (in OAuth2 terms, this is the "Refresh Token' flow). This flow can also fail for various reasons, for example if a tenant admin configures more stringent login policies. 

The interaction aims at having the user do an action. Some of those conditions are easy for users to resolve (for example, accept Terms of Use with a single click), and some can't be resolved with the current configuration (for example, the machine in question needs to connect to a specific corporate network). Some help the user setting-up multi-factor authentication, or install Microsoft Authenticator on their device.

### `MsalUiRequiredException` classification enumeration

MSAL exposes a `Classification` field, which you can read to provide a better user experience. For example to tell the user that their password expired or that they'll need to provide consent to use some resources. The supported values are part of the [`UiRequiredExceptionClassification`](/dotnet/api/microsoft.identity.client.uirequiredexceptionclassification) enum:

| Classification    | Meaning           | Recommended handling |
|-------------------|-------------------|----------------------|
| BasicAction | Condition can be resolved by user interaction during the interactive authentication flow. | Call AcquireTokenInteractively(). |
| AdditionalAction | Condition can be resolved by additional remedial interaction with the system, outside of the interactive authentication flow. | Call AcquireTokenInteractively() to show a message that explains the remedial action. Calling application may choose to hide flows that require additional_action if the user is unlikely to complete the remedial action. |
| MessageOnly      | Condition can't be resolved at this time. Launching interactive authentication flow will show a message explaining the condition. | Call AcquireTokenInteractively() to show a message that explains the condition. AcquireTokenInteractively() will return UserCanceled error after the user reads the message and closes the window. Calling application may choose to hide flows that result in message_only if the user is unlikely to benefit from the message.|
| ConsentRequired  | User consent is missing, or has been revoked. | Call AcquireTokenInteractively() for user to give consent. |
| UserPasswordExpired | User's password has expired. | Call AcquireTokenInteractively() so that user can reset their password. |
| PromptNeverFailed| Interactive Authentication was called with the parameter prompt=never, forcing MSAL to rely on browser cookies and not to display the browser. This has failed. | Call AcquireTokenInteractively() without Prompt.None |
| AcquireTokenSilentFailed | MSAL SDK doesn't have enough information to fetch a token from the cache. This can be because no tokens are in the cache or an account wasn't found. The error message has more details.  | Call AcquireTokenInteractively(). |
| None    | No further details are provided. Condition may be resolved by user interaction during the interactive authentication flow. | Call AcquireTokenInteractively(). |

## .NET code example

```csharp
AuthenticationResult res;
try
{
 res = await application.AcquireTokenSilent(scopes, account)
        .ExecuteAsync();
}
catch (MsalUiRequiredException ex) when (ex.ErrorCode == MsalError.InvalidGrantError)
{
 switch (ex.Classification)
 {
  case UiRequiredExceptionClassification.None:
   break;
  case UiRequiredExceptionClassification.MessageOnly:
  // You might want to call AcquireTokenInteractive(). Azure AD will show a message
  // that explains the condition. AcquireTokenInteractively() will return UserCanceled error
  // after the user reads the message and closes the window. The calling application may choose
  // to hide features or data that result in message_only if the user is unlikely to benefit 
  // from the message
  try
  {
      res = await application.AcquireTokenInteractive(scopes).ExecuteAsync();
  }
  catch (MsalClientException ex2) when (ex2.ErrorCode == MsalError.AuthenticationCanceledError)
  {
   // Do nothing. The user has seen the message
  }
  break;

  case UiRequiredExceptionClassification.BasicAction:
  // Call AcquireTokenInteractive() so that the user can, for instance accept terms
  // and conditions

  case UiRequiredExceptionClassification.AdditionalAction:
  // You might want to call AcquireTokenInteractive() to show a message that explains the remedial action. 
  // The calling application may choose to hide flows that require additional_action if the user 
  // is unlikely to complete the remedial action (even if this means a degraded experience)

  case UiRequiredExceptionClassification.ConsentRequired:
  // Call AcquireTokenInteractive() for user to give consent.
  
  case UiRequiredExceptionClassification.UserPasswordExpired:
  // Call AcquireTokenInteractive() so that user can reset their password
  
  case UiRequiredExceptionClassification.PromptNeverFailed:
  // You used WithPrompt(Prompt.Never) and this failed
  
  case UiRequiredExceptionClassification.AcquireTokenSilentFailed:
  default:
  // May be resolved by user interaction during the interactive authentication flow.
  res = await application.AcquireTokenInteractive(scopes)
                         .ExecuteAsync(); break;
 }
}
```
[!INCLUDE [Active directory error handling claims challenges](../../../includes/active-directory-develop-error-handling-claims-challenges.md)]

When calling an API requiring Conditional Access from MSAL.NET, your application will need to handle claim challenge exceptions. This will appear as an [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) where the [Claims](/dotnet/api/microsoft.identity.client.msalserviceexception.claims) property won't be empty.

To handle the claim challenge, you'll need to use the `.WithClaim()` method of the [`PublicClientApplicationBuilder`](/dotnet/api/microsoft.identity.client.publicclientapplicationbuilder) class.

[!INCLUDE [Active directory error handling retries](../../../includes/active-directory-develop-error-handling-retries.md)]

### HTTP error codes 500-600

MSAL.NET implements a simple retry-once mechanism for errors with HTTP error codes 500-600.

[MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception) surfaces `System.Net.Http.Headers.HttpResponseHeaders` as a property `namedHeaders`. You can use additional information from the error code to improve the reliability of your applications. In the case described, you can use the `RetryAfterproperty` (of type `RetryConditionHeaderValue`) and compute when to retry.

Here's an example for a daemon application using the client credentials flow. You can adapt this to any of the methods for acquiring a token.

```csharp

bool retry = false;
do
{
    TimeSpan? delay;
    try
    {
         result = await publicClientApplication.AcquireTokenForClient(scopes, account).ExecuteAsync();
    }
    catch (MsalServiceException serviceException)
    {
         if (serviceException.ErrorCode == "temporarily_unavailable")
         {
             RetryConditionHeaderValue retryAfter = serviceException.Headers.RetryAfter;
             if (retryAfter.Delta.HasValue)
             {
                 delay = retryAfter.Delta;
             }
             else if (retryAfter.Date.HasValue)
             {
                 delay = (retryAfter.Date.Value – DateTimeOffset.Now).TotalMilliseconds;
             }
         }
    }
    // . . .
    if (delay.HasValue)
    {
        Thread.Sleep((int)delay.Value.TotalMilliseconds); // sleep or other
        retry = true;
    }
} while (retry);
```

## Next steps

Consider enabling [Logging in MSAL.NET](msal-logging-dotnet.md) to help you diagnose and debug issues.
