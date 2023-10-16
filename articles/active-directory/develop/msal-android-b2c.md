---
title: Azure AD B2C (MSAL Android)
description: Learn about specific considerations when using Azure AD B2C with the Microsoft Authentication Library for Android (MSAL.Android)
services: active-directory
author: henrymbuguakiarie
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 9/18/2019
ms.author: henrymbugua
ms.reviewer: rapong, iambmelt
ms.custom: aaddev
#Customer intent: As an application developer, I want to learn about specific considerations when using Azure AD B2C and MSAL.Android so I can decide if this platform meets my application development needs and requirements.
---

# Use MSAL for Android with B2C

The Microsoft Authentication Library (MSAL) enables application developers to authenticate users with social and local identities by using [Azure Active Directory B2C (Azure AD B2C)](../../active-directory-b2c/index.yml). Azure AD B2C is an identity management service. Use it to customize and control how customers sign up, sign in, and manage their profiles when they use your applications.

## Choosing a compatible authorization_user_agent
The B2C identity management system supports authentication with a number of social account providers such as Google, Facebook, Twitter, and Amazon. If you plan to support such account types in your app, it is recommended that you configure your MSAL public client application to use either the `DEFAULT` or `BROWSER` value when specifying your manifest's [`authorization_user_agent`](msal-configuration.md#authorization_user_agent) due to restrictions prohibiting use of WebView-based authentication with some external identity providers.

## Configure known authorities and redirect URI

In MSAL for Android, B2C policies (user journeys) are configured as individual authorities.

Given a B2C application that has two policies:
- Sign-up / Sign-in
    * Called `B2C_1_SISOPolicy`
- Edit Profile
    * Called `B2C_1_EditProfile`

The configuration file for the app would declare two `authorities`. One for each policy. The `type` property of each authority is `B2C`.

>Note: The `account_mode` must be set to **MULTIPLE** for B2C applications. Refer to the documentation for more information about [multiple account public client apps](./single-multi-account.md#multiple-account-public-client-application).

### `app/src/main/res/raw/msal_config.json`

```json
{
  "client_id": "<your_client_id_here>",
  "redirect_uri": "<your_redirect_uri_here>",
  "account_mode" : "MULTIPLE",
  "authorization_user_agent" : "DEFAULT",
  "authorities": [
    {
      "type": "B2C",
      "authority_url": "https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_SISOPolicy/",
      "default": true
    },
    {
      "type": "B2C",
      "authority_url": "https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_EditProfile/"
    }
  ]
}
```

The `redirect_uri` must be registered in the app configuration, and also in  `AndroidManifest.xml` to support redirection during the [authorization code grant flow](../../active-directory-b2c/authorization-code-flow.md).

## Initialize IPublicClientApplication

`IPublicClientApplication` is constructed by a factory method to allow the application configuration to be parsed asynchronously.

```java
PublicClientApplication.createMultipleAccountPublicClientApplication(
    context, // Your application Context
    R.raw.msal_config, // Id of app JSON config
    new IPublicClientApplication.ApplicationCreatedListener() {
        @Override
        public void onCreated(IMultipleAccountPublicClientApplication pca) {
            // Application has been initialized.
        }

        @Override
        public void onError(MsalException exception) {
            // Application could not be created.
            // Check Exception message for details.
        }
    }
);
```

## Interactively acquire a token

To acquire a token interactively with MSAL, build an `AcquireTokenParameters` instance and supply it to the `acquireToken` method. The token request below uses the `default` authority.

```java
IMultipleAccountPublicClientApplication pca = ...; // Initialization not shown

AcquireTokenParameters parameters = new AcquireTokenParameters.Builder()
    .startAuthorizationFromActivity(activity)
    .withScopes(Arrays.asList("https://contoso.onmicrosoft.com/contosob2c/read")) // Provide your registered scope here
    .withPrompt(Prompt.LOGIN)
    .callback(new AuthenticationCallback() {
        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) {
            // Token request was successful, inspect the result
        }

        @Override
        public void onError(MsalException exception) {
            // Token request was unsuccessful, inspect the exception
        }

        @Override
        public void onCancel() {
            // The user cancelled the flow
        }
    }).build();

pca.acquireToken(parameters);
```

## Silently renew a token

To acquire a token silently with MSAL, build an `AcquireTokenSilentParameters` instance and supply it to the `acquireTokenSilentAsync` method. Unlike the `acquireToken` method, the `authority` must be specified to acquire a token silently.

```java
IMultipleAccountPublicClientApplication pca = ...; // Initialization not shown
AcquireTokenSilentParameters parameters = new AcquireTokenSilentParameters.Builder()
    .withScopes(Arrays.asList("https://contoso.onmicrosoft.com/contosob2c/read")) // Provide your registered scope here
    .forAccount(account)
    // Select a configured authority (policy), mandatory for silent auth requests
    .fromAuthority("https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_SISOPolicy/")
    .callback(new SilentAuthenticationCallback() {
        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) {
            // Token request was successful, inspect the result
        }

        @Override
        public void onError(MsalException exception) {
            // Token request was unsuccessful, inspect the exception
        }
    })
    .build();

pca.acquireTokenSilentAsync(parameters);
```

## Specify a policy

Because policies in B2C are represented as separate authorities, invoking a policy other than the default is achieved by specifying a `fromAuthority` clause when constructing `acquireToken` or `acquireTokenSilent` parameters.  For example:

```java
AcquireTokenParameters parameters = new AcquireTokenParameters.Builder()
    .startAuthorizationFromActivity(activity)
    .withScopes(Arrays.asList("https://contoso.onmicrosoft.com/contosob2c/read")) // Provide your registered scope here
    .withPrompt(Prompt.LOGIN)
    .callback(...) // provide callback here
    .fromAuthority("<url_of_policy_defined_in_configuration_json>")
    .build();
```

## Handle password change policies

The local account sign-up or sign-in user flow shows a '**Forgot password?**' link. Clicking this link doesn't automatically trigger a password reset user flow.

Instead, the error code `AADB2C90118` is returned to your app. Your app should  handle this error code by running a specific user flow that resets the password.

To catch a password reset error code, the following implementation can be used inside your `AuthenticationCallback`:

```java
new AuthenticationCallback() {

    @Override
    public void onSuccess(IAuthenticationResult authenticationResult) {
        // ..
    }

    @Override
    public void onError(MsalException exception) {
        final String B2C_PASSWORD_CHANGE = "AADB2C90118";

        if (exception.getMessage().contains(B2C_PASSWORD_CHANGE)) {
            // invoke password reset flow
        }
    }

    @Override
    public void onCancel() {
        // ..
    }
}
```

## Use IAuthenticationResult

A successful token acquisition results in a `IAuthenticationResult` object. It contains the access token, user claims, and metadata.

### Get the access token and related properties

```java
// Get the raw bearer token
String accessToken = authenticationResult.getAccessToken();

// Get the scopes included in the access token
String[] accessTokenScopes = authenticationResult.getScope();

// Gets the access token's expiry
Date expiry = authenticationResult.getExpiresOn();

// Get the tenant for which this access token was issued
String tenantId = authenticationResult.getTenantId();
```

### Get the authorized account

```java
// Get the account from the result
IAccount account = authenticationResult.getAccount();

// Get the id of this account - note for B2C, the policy name is a part of the id
String id = account.getId();

// Get the IdToken Claims
//
// For more information about B2C token claims, see reference documentation
// https://learn.microsoft.com/azure/active-directory-b2c/active-directory-b2c-reference-tokens
Map<String, ?> claims = account.getClaims();

// Get the 'preferred_username' claim through a convenience function
String username = account.getUsername();

// Get the tenant id (tid) claim through a convenience function
String tenantId = account.getTenantId();
```

### IdToken claims

Claims returned in the IdToken are populated by the Security Token Service (STS), not by MSAL. Depending on the identity provider (IdP) used, some claims may be absent. Some IdPs don't currently provide the `preferred_username` claim. Because this claim is used by MSAL for caching, a placeholder value, `MISSING FROM THE TOKEN RESPONSE`, is used in its place. For more information on B2C IdToken claims, see [Overview of tokens in Azure Active Directory B2C](../../active-directory-b2c/tokens-overview.md#claims).

## Managing accounts and policies

B2C treats each policy as a separate authority. Thus the access tokens, refresh tokens, and ID tokens returned from each policy are not interchangeable. This means each policy returns a separate `IAccount` object whose tokens can't be used to invoke other policies.

Each policy adds an `IAccount` to the cache for each user. If a user signs in to an application and invokes two policies, they'll have two `IAccount`s. To remove this user from the cache, you must call `removeAccount()` for each policy.

When you renew tokens for a policy with `acquireTokenSilent`, provide the same `IAccount` that was returned from previous invocations of the policy to  `AcquireTokenSilentParameters`. Providing an account returned by another policy will result in an error.

## Next steps

Learn more about Azure Active Directory B2C (Azure AD B2C) at [What is Azure Active Directory B2C?](../../active-directory-b2c/overview.md)
