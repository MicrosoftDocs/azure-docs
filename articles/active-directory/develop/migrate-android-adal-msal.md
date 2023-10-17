---
title: ADAL to MSAL migration guide for Android
description: Learn how to migrate your Azure Active Directory Authentication Library (ADAL) Android app to the Microsoft Authentication Library (MSAL).
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.tgt_pltfrm: Android
ms.workload: identity
ms.date: 10/14/2020
ms.author: henrymbugua
ms.reviewer: shoatman
ms.custom: aaddev, has-adal-ref
# Customer intent: As an Android application developer, I want to learn how to migrate my v1 ADAL app to v2 MSAL.
---

# ADAL to MSAL migration guide for Android

This article highlights changes you need to make to migrate an app that uses the Azure Active Directory Authentication Library (ADAL) to use the Microsoft Authentication Library (MSAL).

## Difference highlights

ADAL works with the Azure AD v1.0 endpoint. The Microsoft Authentication Library (MSAL) works with the Microsoft identity platform, formerly known as the Azure AD v2.0 endpoint. The Microsoft identity platform differs from Azure AD v1.0 in that it:

Supports:
  - Organizational Identity (Microsoft Entra ID)
  - Non-organizational identities such as Outlook.com, Xbox Live, and so on
  - (Azure AD B2C only) Federated login with Google, Facebook, Twitter, and Amazon

- Is standards compatible with:
  - OAuth v2.0
  - OpenID Connect (OIDC)

The MSAL public API introduces important changes, including:

- A new model for accessing tokens:
  - ADAL provides access to tokens via the `AuthenticationContext`, which represents the server. MSAL provides access to tokens via the `PublicClientApplication`, which represents the client. Client developers don't need to create a new `PublicClientApplication` instance for every Authority they need to interact with. Only one `PublicClientApplication` configuration is required.
  - Support for requesting access tokens using scopes in addition to resource identifiers.
  - Support for incremental consent. Developers can request scopes as the user accesses more and more functionality in the app, including those not included during app registration.
  - Authorities are no longer validated at run-time. Instead, the developer declares a list of 'known authorities' during development.
- Token API changes:
  - In ADAL, `AcquireToken()` first makes a silent request. Failing that, it makes an interactive request. This behavior resulted in some developers relying only on `AcquireToken`, which resulted in the user being unexpectedly prompted for credentials at times. MSAL requires developers be intentional about when the user receives a UI prompt.
    - `AcquireTokenSilent` always results in a silent request that either succeeds or fails.
    - `AcquireToken` always results in a request that prompts the user via UI.
- MSAL supports sign in from either a default browser or an embedded web view:
  - By default, the default browser on the device is used. This allows MSAL to use authentication state (cookies) that may already be present for one or more signed in accounts. If no authentication state is present, authenticating during authorization via MSAL results in authentication state (cookies) being created for the benefit of other web applications that will be used in the same browser.
- New exception Model:
  - Exceptions more clearly define the type of error that occurred and what the developer needs to do to resolve it.
- MSAL supports parameter objects for `AcquireToken` and `AcquireTokenSilent` calls.
- MSAL supports declarative configuration for:
  - Client ID, Redirect URI.
  - Embedded vs Default Browser
  - Authorities
  - HTTP settings such as read and connection timeout

## Your app registration and migration to MSAL

You don't need to change your existing app registration to use MSAL. If you want to take advantage of incremental/progressive consent, you may need to review the registration to identify the specific scopes that you want to request incrementally. More information on scopes and incremental consent follows.

In your app registration in the portal, you will see an **API permissions** tab. This provides a list of the APIs and permissions (scopes) that your app is currently configured to request access to. It also shows a list of the scope names associated with each API permission.

### User consent

With ADAL and the Azure AD v1.0 endpoint, user consent to resources they own was granted on first use. With MSAL and the Microsoft identity platform, consent can be requested incrementally. Incremental consent is useful for permissions that a user may consider high privilege, or may otherwise question if not provided with a clear explanation of why the permission is required. In ADAL, those permissions may have resulted in the user abandoning signing in to your app.

> [!TIP]
> Use incremental consent to provide additional context to your users about why your app needs a permission.

### Admin consent

Organization administrators can consent to permissions your application requires on behalf of all of the members of their organization. Some organizations only allow admins to consent to applications. Admin consent requires that you include all API permissions and scopes used by your application in your app registration.

> [!TIP]
> Even though you can request a scope using MSAL for something not included in your app registration, we recommend that you update your app registration to include all resources and scopes that a user could ever grant permission to.

## Migrating from resource IDs to scopes

### Authenticate and request authorization for all permissions on first use

If you're currently using ADAL and don't need to use incremental consent, the simplest way to start using MSAL is to make an `acquireToken` request using the new `AcquireTokenParameter` object and setting the resource ID value.

> [!CAUTION]
> It's not possible to set both scopes and a resource id. Attempting to set both will result in an `IllegalArgumentException`.

This will result in the same v1 behavior that you are used. All permissions requested in your app registration are requested from the user during their first interaction.

### Authenticate and request permissions only as needed

To take advantage of incremental consent, make a list of permissions (scopes) that your app uses from your app registration, and organize them into two lists based on:

- Which scopes you want to request during the user's first interaction with your app during sign-in.
- The permissions that are associated with an important feature of your app that you will also need to explain to the user.

Once you've organized the scopes, organize each list by which resource (API) you want to request a token for. As well as any other scopes that you wish the user to authorize at the same time.

The parameters object used to make your request to MSAL supports:

- `Scope`: The list of scopes that you want to request authorization for and receive an access token.
- `ExtraScopesToConsent`: An additional list of scopes that you want to request authorization for while you're requesting an access token for another resource. This list of scopes allows you to minimize the number of times that you need to request user authorization. Which means fewer user authorization or consent prompts.

## Migrate from AuthenticationContext to PublicClientApplications

### Constructing PublicClientApplication

When you use MSAL, you instantiate a `PublicClientApplication`. This object models your app identity and is used to make requests to one or more authorities. With this object you will configure your client identity, redirect URI, default authority, whether to use the device browser vs. embedded web view, the log level, and more.

You can declaratively configure this object with JSON, which you either provide as a file or store as a resource within your APK.

Although this object is not a singleton, internally it uses shared `Executors` for both interactive and silent requests.

### Business to Business

In ADAL, every organization that you request access tokens from requires a separate instance of the `AuthenticationContext`. In MSAL, this is no longer a requirement. You can specify the authority from which you want to request a token as part of your silent or interactive request.

### Migrate from authority validation to known authorities

MSAL does not have a flag to enable or disable authority validation. Authority validation is a feature in ADAL, and in the early releases of MSAL, that prevents your code from requesting tokens from a potentially malicious authority. MSAL now retrieves a list of authorities known to Microsoft and merges that list with the authorities that you've specified in your configuration.

> [!TIP]
> If you're an Azure Business to Consumer (B2C) user, this means you no longer have to disable authority validation. Instead, include each of the your supported Azure AD B2C policies as authorities in your MSAL configuration.

If you attempt to use an authority that isn't known to Microsoft, and isn't included in your configuration, you will get an `UnknownAuthorityException`.

### Logging
You can now declaratively configure logging as part of your configuration, like this:

```json
"logging": {
  "pii_enabled": false,
  "log_level": "WARNING",
  "logcat_enabled": true
}
```

## Migrate from UserInfo to Account

In ADAL, the `AuthenticationResult` provides a `UserInfo` object used to retrieve information about the authenticated account. The term "user", which meant a human or software agent, was applied in a way that made it difficult to communicate that some apps support a single user (whether a human or software agent) that has  multiple accounts.

Consider a bank account. You may have more than one account at more than one financial institution. When you open an account, you (the user) are issued credentials, such as an ATM Card & PIN, that are used to access your balance, bill payments, and so on, for each account. Those credentials can only be used at the financial institution that issued them.

By analogy, like accounts at a financial institution, accounts in the Microsoft identity platform are accessed using credentials. Those credentials are either registered with, or issued by, Microsoft. Or by Microsoft on behalf of an organization.

Where the Microsoft identity platform differs from a financial institution, in this analogy, is that the Microsoft identity platform provides a framework that allows a user to use one account, and its associated credentials, to access resources that belong to multiple individuals and organizations. This is like being able to use a card issued by one bank, at yet another financial institution. This works because all of the organizations in question are using the Microsoft identity platform, which allows one account to be used across multiple organizations. Here's an example:

Sam works for Contoso.com but manages Azure virtual machines that belong to Fabrikam.com. For Sam to manage Fabrikam's virtual machines, he needs to be authorized to access them. This access can be granted by adding Sam's account to Fabrikam.com, and granting his account a role that allows him to work with the virtual machines. This would be done with the Azure portal.

Adding Sam's Contoso.com account as a member of Fabrikam.com would result in the creation of a new record in Fabrikam.com's Microsoft Entra ID for Sam. Sam's record in Microsoft Entra ID is known as a user object. In this case, that user object would point back to Sam's user object in Contoso.com. Sam's Fabrikam user object is the local representation of Sam, and would be used to store information about the account associated with Sam in the context of Fabrikam.com. In Contoso.com, Sam's title is Senior DevOps Consultant. In Fabrikam, Sam's title is Contractor-Virtual Machines. In Contoso.com, Sam is not responsible, nor authorized, to manage virtual machines. In Fabrikam.com, that's his only job function. Yet Sam still only has one set of credentials to keep track of, which are the credentials issued by Contoso.com.

Once a successful `acquireToken` call is made, you will see a reference to an `IAccount` object that can be used in later `acquireTokenSilent` requests.

### IMultiTenantAccount

If you have an app that accesses claims about an account from each of the tenants in which the account is represented, you can cast `IAccount` objects to `IMultiTenantAccount`. This interface provides a map of `ITenantProfiles`, keyed by tenant ID, that allows you to access the claims that belong to the account in each of the tenants you've requested a token from, relative to the current account.

The claims at the root of the `IAccount` and `IMultiTenantAccount` always contain the claims from the home tenant. If you have not yet made a request for a token within the home tenant, this collection will be empty.

## Other changes

### Use the new AuthenticationCallback

```java
// Existing ADAL Interface
public interface AuthenticationCallback<T> {

    /**
     * This will have the token info.
     *
     * @param result returns <T>
     */
    void onSuccess(T result);

    /**
     * Sends error information. This can be user related error or server error.
     * Cancellation error is AuthenticationCancelError.
     *
     * @param exc return {@link Exception}
     */
    void onError(Exception exc);
}
```

```java
// New Interface for Interactive AcquireToken
public interface AuthenticationCallback {

    /**
     * Authentication finishes successfully.
     *
     * @param authenticationResult {@link IAuthenticationResult} that contains the success response.
     */
    void onSuccess(final IAuthenticationResult authenticationResult);

    /**
     * Error occurs during the authentication.
     *
     * @param exception The {@link MsalException} contains the error code, error message and cause if applicable. The exception
     *                  returned in the callback could be {@link MsalClientException}, {@link MsalServiceException}
     */
    void onError(final MsalException exception);

    /**
     * Will be called if user cancels the flow.
     */
    void onCancel();
}

// New Interface for Silent AcquireToken
public interface SilentAuthenticationCallback {

    /**
     * Authentication finishes successfully.
     *
     * @param authenticationResult {@link IAuthenticationResult} that contains the success response.
     */
    void onSuccess(final IAuthenticationResult authenticationResult);

    /**
     * Error occurs during the authentication.
     *
     * @param exception The {@link MsalException} contains the error code, error message and cause if applicable. The exception
     *                  returned in the callback could be {@link MsalClientException}, {@link MsalServiceException} or
     *                  {@link MsalUiRequiredException}.
     */
    void onError(final MsalException exception);
}
```

## Migrate to the new exceptions

In ADAL, there's one type of exception, `AuthenticationException`, which includes a method for retrieving the `ADALError` enum value.
In MSAL, there's a hierarchy of exceptions, and each has its own set of associated specific error codes.

| Exception                                        | Description                                                         |
|--------------------------------------------------|---------------------------------------------------------------------|
| `MsalArgumentException`                          | Thrown if one or more inputs arguments are invalid.                 |
| `MsalClientException`                            | Thrown if the error is client side.                                 |
| `MsalDeclinedScopeException`                     | Thrown if one or more requested scopes were declined by the server. |
| `MsalException`                                  | Default checked exception thrown by MSAL.                           |
| `MsalIntuneAppProtectionPolicyRequiredException` | Thrown if the resource has MAMCA protection policy enabled.         |
| `MsalServiceException`                           | Thrown if the error is server side.                                 |
| `MsalUiRequiredException`                        | Thrown if the token can't be refreshed silently.                    |
| `MsalUserCancelException`                        | Thrown if the user canceled the authentication flow.                |

### ADALError to MsalException translation

| If you're catching these errors in ADAL...  | ...catch these MSAL exceptions:                                                         |
|--------------------------------------------------|---------------------------------------------------------------------|
| *No equivalent ADALError* | `MsalArgumentException`                          |
| <ul><li>`ADALError.ANDROIDKEYSTORE_FAILED`<li>`ADALError.AUTH_FAILED_USER_MISMATCH`<li>`ADALError.DECRYPTION_FAILED`<li>`ADALError.DEVELOPER_AUTHORITY_CAN_NOT_BE_VALIDED`<li>`ADALError.DEVELOPER_AUTHORITY_IS_NOT_VALID_INSTANCE`<li>`ADALError.DEVELOPER_AUTHORITY_IS_NOT_VALID_URL`<li>`ADALError.DEVICE_CONNECTION_IS_NOT_AVAILABLE`<li>`ADALError.DEVICE_NO_SUCH_ALGORITHM`<li>`ADALError.ENCODING_IS_NOT_SUPPORTED`<li>`ADALError.ENCRYPTION_ERROR`<li>`ADALError.IO_EXCEPTION`<li>`ADALError.JSON_PARSE_ERROR`<li>`ADALError.NO_NETWORK_CONNECTION_POWER_OPTIMIZATION`<li>`ADALError.SOCKET_TIMEOUT_EXCEPTION`</ul> | `MsalClientException`                            |
| *No equivalent ADALError* | `MsalDeclinedScopeException`                     |
| <ul><li>`ADALError.APP_PACKAGE_NAME_NOT_FOUND`<li>`ADALError.BROKER_APP_VERIFICATION_FAILED`<li>`ADALError.PACKAGE_NAME_NOT_FOUND`</ul> | `MsalException`                                  |
| *No equivalent ADALError* | `MsalIntuneAppProtectionPolicyRequiredException` |
| <ul><li>`ADALError.SERVER_ERROR`<li>`ADALError.SERVER_INVALID_REQUEST`</ul> | `MsalServiceException`                           |
| <ul><li>`ADALError.AUTH_REFRESH_FAILED_PROMPT_NOT_ALLOWED` | `MsalUiRequiredException`</ul>                        |
| *No equivalent ADALError* | `MsalUserCancelException`                        |

### ADAL Logging to MSAL Logging

```java
// Legacy Interface
    StringBuilder logs = new StringBuilder();
    Logger.getInstance().setExternalLogger(new ILogger() {
            @Override
            public void Log(String tag, String message, String additionalMessage, LogLevel logLevel, ADALError errorCode) {
                logs.append(message).append('\n');
            }
        });
```

```java
// New interface
  StringBuilder logs = new StringBuilder();
  Logger.getInstance().setExternalLogger(new ILoggerCallback() {
      @Override
      public void log(String tag, Logger.LogLevel logLevel, String message, boolean containsPII) {
          logs.append(message).append('\n');
      }
  });

// New Log Levels:
public enum LogLevel
{
    /**
     * Error level logging.
     */
    ERROR,
    /**
     * Warning level logging.
     */
    WARNING,
    /**
     * Info level logging.
     */
    INFO,
    /**
     * Verbose level logging.
     */
    VERBOSE
}
```
