---
title: Errors and exceptions (MSAL) 
titleSuffix: Microsoft identity platform
description: Learn how to handle errors and exceptions, Conditional Access, and claims challenges in MSAL applications.
services: active-directory
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 05/18/2020
ms.author: marsma
ms.reviewer: saeeda, jmprieur
ms.custom: aaddev
---

# Handle MSAL exceptions and errors

This article gives an overview of the different types of errors and recommendations for handling common sign-in errors.

## MSAL error handling basics

Exceptions in Microsoft Authentication Library (MSAL) are intended for app developers to troubleshoot--not for displaying to end users. Exception messages are not localized.

When processing exceptions and errors, you can use the exception type itself and the error code to distinguish between exceptions.  For a list of error codes, see [Authentication and authorization error codes](reference-aadsts-error-codes.md).

During the sign-in experience, you may encounter errors about consents, Conditional Access (MFA, Device Management, Location-based restrictions), token issuance and redemption, and user properties.

See the following section that matches the language you are using for more details about error handling for your app.

## [.NET](#tab/dotnet)

When processing .NET exceptions, you can use the exception type itself and the `ErrorCode` member to distinguish between exceptions. `ErrorCode` values are constants of type [MsalError](/dotnet/api/microsoft.identity.client.msalerror?view=azure-dotnet).

You can also have a look at the fields of [MsalClientException](/dotnet/api/microsoft.identity.client.msalexception?view=azure-dotnet), [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet), and [MsalUIRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet).

If [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) is thrown, try [Authentication and authorization error codes](reference-aadsts-error-codes.md) to see if the code is listed there.

### Common .NET exceptions

Here are the common exceptions that might be thrown and some possible mitigations:  

| Exception | Error code | Mitigation|
| --- | --- | --- |
| [MsalUiRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet) | AADSTS65001: The user or administrator has not consented to use the application with ID '{appId}' named '{appName}'. Send an interactive authorization request for this user and resource.| You need to get user consent first. If you aren't using .NET Core (which doesn't have any Web UI), call (once only) `AcquireTokeninteractive`. If you are using .NET core or don't want to do an `AcquireTokenInteractive`, the user can navigate to a URL to give consent: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id={clientId}&response_type=code&scope=user.read`. to call `AcquireTokenInteractive`: `app.AcquireTokenInteractive(scopes).WithAccount(account).WithClaims(ex.Claims).ExecuteAsync();`|
| [MsalUiRequiredException](/dotnet/api/microsoft.identity.client.msaluirequiredexception?view=azure-dotnet) | AADSTS50079: The user is required to use [multi-factor authentication (MFA)](../authentication/concept-mfa-howitworks.md).| There is no mitigation. If MFA is configured for your tenant and Azure Active Directory (AAD) decides to enforce it, you need to fall back to an interactive flow such as `AcquireTokenInteractive` or `AcquireTokenByDeviceCode`.|
| [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) |AADSTS90010: The grant type isn't supported over the */common* or */consumers* endpoints. Use the */organizations* or tenant-specific endpoint. You used */common*.| As explained in the message from Azure AD, the authority needs to have a tenant or otherwise */organizations*.|
| [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) | AADSTS70002: The request body must contain the following parameter: `client_secret or client_assertion`.| This exception can be thrown if your application was not registered as a public client application in Azure AD. In the Azure portal, edit the manifest for your application and set `allowPublicClient` to `true`. |
| [MsalClientException](/dotnet/api/microsoft.identity.client.msalclientexception?view=azure-dotnet)| `unknown_user Message`: Could not identify logged in user| The library was unable to query the current Windows logged-in user or this user isn't AD or AAD joined (work-place joined users aren't supported). Mitigation 1: on UWP, check that the application has the following capabilities: Enterprise Authentication, Private Networks (Client and Server), User Account Information. Mitigation 2: Implement your own logic to fetch the username (for example, john@contoso.com) and use the `AcquireTokenByIntegratedWindowsAuth` form that takes in the username.|
| [MsalClientException](/dotnet/api/microsoft.identity.client.msalclientexception?view=azure-dotnet)|integrated_windows_auth_not_supported_managed_user| This method relies on a protocol exposed by Active Directory (AD). If a user was created in Azure Active Directory without AD backing ("managed" user), this method will fail. Users created in AD and backed by AAD ("federated" users) can benefit from this non-interactive method of authentication. Mitigation: Use interactive authentication.|

### `MsalUiRequiredException`

One of common status codes returned from MSAL.NET when calling `AcquireTokenSilent()` is `MsalError.InvalidGrantError`. This status code means that the application should call the authentication library again, but in interactive mode (AcquireTokenInteractive or AcquireTokenByDeviceCodeFlow for public client applications, and do a challenge in Web apps). This is because additional user interaction is required before authentication token can be issued.

Most of the time when `AcquireTokenSilent` fails, it is because the token cache doesn't have tokens matching your request. Access tokens expire in 1 hour, and `AcquireTokenSilent` will try to fetch a new one based on a refresh token (in OAuth2 terms, this is the "Refresh Token' flow). This flow can also fail for various reasons, for example if a tenant admin configures more stringent login policies. 

The interaction aims at having the user do an action. Some of those conditions are easy for users to resolve (for example, accept Terms of Use with a single click), and some can't be resolved with the current configuration (for example, the machine in question needs to connect to a specific corporate network). Some help the user setting-up multi-factor authentication, or install Microsoft Authenticator on their device.

### `MsalUiRequiredException` classification enumeration

MSAL exposes a `Classification` field, which you can read to provide a better user experience, for example to tell the user that their password expired or that they'll need to provide consent to use some resources. The supported values are part of the `UiRequiredExceptionClassification` enum:

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

## [JavaScript](#tab/javascript)

MSAL.js provides error objects that abstract and classify the different types of common errors. It also provides interface to access specific details of the errors such as error messages to handle them appropriately.

### Error object

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
- `AuthError.message`:  Same as the `errorMessage`.
- `AuthError.stack`: Stack trace for thrown errors.

### Error types

The following error types are available:

- `AuthError`: Base error class for the MSAL.js library, also used for unexpected errors.

- `ClientAuthError`: Error class, which denotes an issue with Client authentication. Most errors that come from the library will be ClientAuthErrors. These errors result from things like calling a login method when login is already in progress, the user cancels the login, and so on.

- `ClientConfigurationError`: Error class, extends `ClientAuthError` thrown before requests are made when the given user config parameters are malformed or missing.

- `ServerError`: Error class, represents the error strings sent by the authentication server. These may be errors such as invalid request formats or parameters, or any other errors that prevent the server from authenticating or authorizing the user.

- `InteractionRequiredAuthError`: Error class, extends `ServerError` to represent server errors, which require an interactive call. This error is thrown by `acquireTokenSilent` if the user is required to interact with the server to provide credentials or consent for authentication/authorization. Error codes include `"interaction_required"`, `"login_required"`, and `"consent_required"`.

For error handling in authentication flows with redirect methods (`loginRedirect`, `acquireTokenRedirect`), you'll need to register the callback, which is called with success or failure after the redirect using `handleRedirectCallback()` method as follows:

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

### Errors that require interaction

An error is returned when you attempt to use a non-interactive method of acquiring a token such as `acquireTokenSilent`, but MSAL couldn't do it silently.

Possible reasons are:

- you need to sign in
- you need to consent
- you need to go through a multi-factor authentication experience.

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

## [Python](#tab/python)

In MSAL for Python, most errors are conveyed as a return value from the API call. The error is represented as a dictionary containing the JSON response from the Microsoft identity platform.

* A successful response contains the `"access_token"` key. The format of the response is defined by the OAuth2 protocol. For more information, see [5.1 Successful Response](https://tools.ietf.org/html/rfc6749#section-5.1)
* An error response contains `"error"` and usually `"error_description"`. The format of the response is defined by the OAuth2 protocol. For more information, see [5.2 Error Response](https://tools.ietf.org/html/rfc6749#section-5.2)

When an error is returned, the `"error_description"` key contains a human-readable message; which in turn typically contains a Microsoft identity platform error code. For details about the various error codes, see [Authentication and authorization error codes](https://docs.microsoft.com/azure/active-directory/develop/reference-aadsts-error-codes).

In MSAL for Python, exceptions are rare because most errors are handled by returning an error value. The `ValueError` exception is only thrown when there is an issue with how you are attempting to use the library--such as when API parameter(s) are malformed.

## [Java](#tab/java)

In MSAL for Java, there are three types of exceptions: `MsalClientException`, `MsalServiceException`, and `MsalInteractionRequiredException`; all which inherit from `MsalException`.

- `MsalClientException` is thrown when an error occurs that is local to the library or device.
- `MsalServiceException` is thrown when the secure token service (STS) returns an error response or another networking error occurs.
- `MsalInteractionRequiredException` is thrown when UI interaction is required for authentication to succeed.

### MsalServiceException

`MsalServiceException` exposes HTTP headers returned in the requests to the STS. Access them via `MsalServiceException.headers()`

### MsalInteractionRequiredException

One of common status codes returned from MSAL for Java when calling `AcquireTokenSilently()` is `InvalidGrantError`. This means that additional user interaction is required before an authentication token can be issued. Your application should call the authentication library again, but in interactive mode by sending `AuthorizationCodeParameters` or `DeviceCodeParameters` for public client applications.

Most of the time when `AcquireTokenSilently` fails, it's because the token cache doesn't have a token matching your request. Access tokens expire in one hour, and `AcquireTokenSilently` will try to get a new one based on a refresh token. In OAuth2 terms, this is the Refresh Token flow. This flow can also fail for various reasons such as when a tenant admin configures more stringent login policies.

Some conditions that result in this error are easy for users to resolve. For example, they may need to accept Terms of Use. Or perhaps the request can't be fulfilled with the current configuration because the machine needs to connect to a specific corporate network.

MSAL exposes a `reason` field, which you can use to provide a better user experience. For example, the `reason` field may lead you to tell the user that their password expired or that they'll need to provide consent to use some resources. The supported values are part of the  `InteractionRequiredExceptionReason` enum:

| Reason | Meaning | Recommended Handling |
|---------|-----------|-----------------------------|
| `BasicAction` | Condition can be resolved by user interaction during the interactive authentication flow | Call `acquireToken` with interactive parameters |
| `AdditionalAction` | Condition can be resolved by additional remedial interaction with the system outside of the interactive authentication flow. | Call `acquireToken` with interactive parameters to show a message that explains the remedial action to take. The calling app may choose to hide flows that require additional action if the user is unlikely to complete the remedial action. |
| `MessageOnly` | Condition can't be resolved at this time. Launch interactive authentication flow to show a message explaining the condition. | Call `acquireToken` with interactive parameters to show a message that explains the condition. `acquireToken` will return the `UserCanceled` error after the user reads the message and closes the window. The app may choose to hide flows that result in message if the user is unlikely to benefit from the message. |
| `ConsentRequired`| User consent is missing, or has been revoked. |Call `acquireToken` with interactive parameters so that the user can give consent. |
| `UserPasswordExpired` | User's password has expired. | Call `acquireToken` with interactive parameter so the user can reset their password |
| `None` |  Further details are provided. The condition may be resolved by user interaction during the interactive authentication flow. | Call `acquireToken` with interactive parameters |

### Code Example

```java
        IAuthenticationResult result;
        try {
            PublicClientApplication application = PublicClientApplication
                    .builder("clientId")
                    .b2cAuthority("authority")
                    .build();

            SilentParameters parameters = SilentParameters
                    .builder(Collections.singleton("scope"))
                    .build();

            result = application.acquireTokenSilently(parameters).join();
        }
        catch (Exception ex){
            if(ex instanceof MsalInteractionRequiredException){
                // AcquireToken by either AuthorizationCodeParameters or DeviceCodeParameters
            } else{
                // Log and handle exception accordingly
            }
        }
```

## [iOS/macOS](#tab/iosmacos)

The complete list of MSAL for iOS and macOS errors is listed in [MSALError enum](https://github.com/AzureAD/microsoft-authentication-library-for-objc/blob/master/MSAL/src/public/MSALError.h#L128).

All MSAL produced errors are returned with `MSALErrorDomain` domain.

For system errors, MSAL returns the original `NSError` from the system API. For example, if token acquisition fails because of a lack of network connectivity, MSAL returns an error with the `NSURLErrorDomain` domain and `NSURLErrorNotConnectedToInternet` code.

We recommend that you handle at least the following two MSAL errors on the client side:

- `MSALErrorInteractionRequired`: The user must do an interactive request. There are many conditions that can lead to this error such as an expired authentication session or the need for additional authentication requirements. Call the MSAL interactive token acquisition API to recover. 

- `MSALErrorServerDeclinedScopes`: Some or all scopes were declined. Decide whether to continue with only the granted scopes, or stop the sign-in process.

> [!NOTE]
> The `MSALInternalError` enum should only be used for reference and debugging. Do not try to automatically handle these errors at runtime. If your app encounters any of the errors that fall under `MSALInternalError`, you may want to show a generic user facing message explaining what happened.

For example, `MSALInternalErrorBrokerResponseNotReceived` means that user didn't complete authentication and manually returned to the app. In this case, your app should show a generic error message explaining that authentication didn't complete and suggest that they try to authenticate again.

The following Objective-C sample code demonstrates best practices for handling some common error conditions:

```objc
    MSALInteractiveTokenParameters *interactiveParameters = ...;
    MSALSilentTokenParameters *silentParameters = ...;
    
    MSALCompletionBlock completionBlock;
    __block __weak MSALCompletionBlock weakCompletionBlock;
    
    weakCompletionBlock = completionBlock = ^(MSALResult *result, NSError *error)
    {
        if (!error)
        {
            // Use result.accessToken
            NSString *accessToken = result.accessToken;
            return;
        }
        
        if ([error.domain isEqualToString:MSALErrorDomain])
        {
            switch (error.code)
            {
                case MSALErrorInteractionRequired:
                {
                    // Interactive auth will be required
                    [application acquireTokenWithParameters:interactiveParameters
                                            completionBlock:weakCompletionBlock];
                    
                    break;
                }
                    
                case MSALErrorServerDeclinedScopes:
                {
                    // These are list of granted and declined scopes.
                    NSArray *grantedScopes = error.userInfo[MSALGrantedScopesKey];
                    NSArray *declinedScopes = error.userInfo[MSALDeclinedScopesKey];
                    
                    // To continue acquiring token for granted scopes only, do the following
                    silentParameters.scopes = grantedScopes;
                    [application acquireTokenSilentWithParameters:silentParameters
                                                  completionBlock:weakCompletionBlock];
                    
                    // Otherwise, instead, handle error fittingly to the application context
                    break;
                }
                    
                case MSALErrorServerProtectionPoliciesRequired:
                {
                    // Integrate the Intune SDK and call the
                    // remediateComplianceForIdentity:silent: API.
                    // Handle this error only if you integrated Intune SDK.
                    // See more info here: https://aka.ms/intuneMAMSDK
                    
                    break;
                }
                    
                case MSALErrorUserCanceled:
                {
                    // The user cancelled the web auth session.
                    // You may want to ask the user to try again.
                    // Handling of this error is optional.
                    
                    break;
                }
                    
                case MSALErrorInternal:
                {
                    // Log the error, then inspect the MSALInternalErrorCodeKey
                    // in the userInfo dictionary.
                    // Display generic error message to the end user
                    // More detailed information about the specific error
                    // under MSALInternalErrorCodeKey can be found in MSALInternalError enum.
                    NSLog(@"Failed with error %@", error);
                    
                    break;
                }
                    
                default:
                    NSLog(@"Failed with unknown MSAL error %@", error);
                    
                    break;
            }
            
            return;
        }
        
        // Handle no internet connection.
        if ([error.domain isEqualToString:NSURLErrorDomain] && error.code == NSURLErrorNotConnectedToInternet)
        {
            NSLog(@"No internet connection.");
            return;
        }
        
        // Other errors may require trying again later,
        // or reporting authentication problems to the user.
        NSLog(@"Failed with error %@", error);
    };
    
    // Acquire token silently
    [application acquireTokenSilentWithParameters:silentParameters
                                  completionBlock:completionBlock];

     // or acquire it interactively.
     [application acquireTokenWithParameters:interactiveParameters
                             completionBlock:completionBlock];
```

```swift
    let interactiveParameters: MSALInteractiveTokenParameters = ...
    let silentParameters: MSALSilentTokenParameters = ...
            
    var completionBlock: MSALCompletionBlock!
    completionBlock = { (result: MSALResult?, error: Error?) in
                
        if let result = result
        {
            // Use result.accessToken
            let accessToken = result.accessToken
            return
        }

        guard let error = error as NSError? else { return }

        if error.domain == MSALErrorDomain, let errorCode = MSALError(rawValue: error.code)
        {
            switch errorCode
            {
                case .interactionRequired:
                    // Interactive auth will be required
                    application.acquireToken(with: interactiveParameters, completionBlock: completionBlock)

                case .serverDeclinedScopes:
                    let grantedScopes = error.userInfo[MSALGrantedScopesKey]
                    let declinedScopes = error.userInfo[MSALDeclinedScopesKey]

                    if let scopes = grantedScopes as? [String] {
                        silentParameters.scopes = scopes
                        application.acquireTokenSilent(with: silentParameters, completionBlock: completionBlock)
                    }
                        
                    case .serverProtectionPoliciesRequired:
                        // Integrate the Intune SDK and call the
                        // remediateComplianceForIdentity:silent: API.
                        // Handle this error only if you integrated Intune SDK.
                        // See more info here: https://aka.ms/intuneMAMSDK
                        break
                        
                    case .userCanceled:
                       // The user cancelled the web auth session.
                       // You may want to ask the user to try again.
                       // Handling of this error is optional.
                       break
                        
                    case .internal:
                        // Log the error, then inspect the MSALInternalErrorCodeKey
                        // in the userInfo dictionary.
                        // Display generic error message to the end user
                        // More detailed information about the specific error
                        // under MSALInternalErrorCodeKey can be found in MSALInternalError enum.
                        print("Failed with error \(error)");
                        
                    default:
                        print("Failed with unknown MSAL error \(error)")
            }
        }
                
        // Handle no internet connection.
        if error.domain == NSURLErrorDomain && error.code == NSURLErrorNotConnectedToInternet
        {
            print("No internet connection.")
            return
        }
                
        // Other errors may require trying again later,
        // or reporting authentication problems to the user.
        print("Failed with error \(error)");    
    }
   
    // Acquire token silently
    application.acquireToken(with: interactiveParameters, completionBlock: completionBlock)
 
    // or acquire it interactively.
    application.acquireTokenSilent(with: silentParameters, completionBlock: completionBlock)
```

---

## Conditional Access and claims challenges

When getting tokens silently, your application may receive errors when a [Conditional Access claims challenge](../azuread-dev/conditional-access-dev-guide.md) such as MFA policy is required by an API you're trying to access.

The pattern for handling this error is to interactively acquire a token using MSAL. Interactively acquiring a token prompts the user and gives them the opportunity to satisfy the required Conditional Access policy.

In certain cases when calling an API requiring Conditional Access, you can receive a claims challenge in the error from the API. For instance if the Conditional Access policy is to have a managed device (Intune) the error will be something like [AADSTS53000: Your device is required to be managed to access this resource](reference-aadsts-error-codes.md) or something similar. In this case, you can pass the claims in the acquire token call so that the user is prompted to satisfy the appropriate policy.

### .NET

When calling an API requiring Conditional Access from MSAL.NET, your application will need to handle claim challenge exceptions. This will appear as an [MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) where the [Claims](/dotnet/api/microsoft.identity.client.msalserviceexception.claims?view=azure-dotnet) property won't be empty.

To handle the claim challenge, you'll need to use the `.WithClaim()` method of the `PublicClientApplicationBuilder` class.

### JavaScript

When getting tokens silently (using `acquireTokenSilent`) using MSAL.js, your application may receive errors when a [Conditional Access claims challenge](../azuread-dev/conditional-access-dev-guide.md) such as MFA policy is required by an API you're trying to access.

The pattern to handle this error is to make an interactive call to acquire token in MSAL.js such as `acquireTokenPopup` or `acquireTokenRedirect` as in the following example:

```javascript
myMSALObj.acquireTokenSilent(accessTokenRequest).then(function (accessTokenResponse) {
    // call API
}).catch( function (error) {
    if (error instanceof InteractionRequiredAuthError) {
        // Extract claims from error message
        accessTokenRequest.claimsRequest = extractClaims(error.errorMessage);
        // call acquireTokenPopup in case of InteractionRequiredAuthError failure
        myMSALObj.acquireTokenPopup(accessTokenRequest).then(function (accessTokenResponse) {
            // call API
        }).catch(function (error) {
            console.log(error);
        });
    }
});
```

Interactively acquiring the token prompts the user and gives them the opportunity to satisfy the required Conditional Access policy.

When calling an API requiring Conditional Access, you can receive a claims challenge in the error from the API. In this case, you can pass the claims returned in the error to the `claimsRequest` field of the `AuthenticationParameters.ts` class to satisfy the appropriate policy. 

See [Requesting Additional Claims](active-directory-optional-claims.md) for more detail.

### MSAL for iOS and macOS

MSAL for iOS and macOS allows you to request specific claims in both interactive and silent token acquisition scenarios.

To request custom claims, specify `claimsRequest` in `MSALSilentTokenParameters` or `MSALInteractiveTokenParameters`.

See [Request custom claims using MSAL for iOS and macOS](request-custom-claims.md) for more info.

## Retrying after errors and exceptions

You're expected to implement you own retry policies when calling MSAL. MSAL makes HTTP calls to the AAD service, and occasional failures can occur, for example the network can go down or the server is overloaded.  

### HTTP error codes 500-600

MSAL.NET implements a simple retry-once mechanism for errors with HTTP error codes 500-600.

### HTTP 429

When the Service Token Server (STS) is overloaded with too many requests, it returns HTTP error 429 with a hint about how long until you can try again in the `Retry-After` response field.

### .NET

[MsalServiceException](/dotnet/api/microsoft.identity.client.msalserviceexception?view=azure-dotnet) surfaces `System.Net.Http.Headers.HttpResponseHeaders` as a property `namedHeaders`. You can use additional information from the error code to improve the reliability of your applications. In the case described, you can use the `RetryAfterproperty` (of type `RetryConditionHeaderValue`) and compute when to retry.

Here is an example for a daemon application using the client credentials flow. You can adapt this to any of the methods for acquiring a token.

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
