---
title: Single and multiple account public client apps
description: An overview of single and multiple account public client apps.
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.workload: identity
ms.date: 09/26/2019
ms.author: cwerner
ms.custom: aaddev, has-adal-ref
ms.reviewer: shoatman
---

# Single and multiple account public client apps

This article will help you understand the types used in single and multiple account public client apps, with a focus on single account public client apps. 

The Microsoft Authentication Library (MSAL) models your client application. The majority of Android apps are considered public clients. A public client is an app that can't securely keep a secret.  

MSAL specializes the API surface of `PublicClientApplication` to simplify and clarify the development experience for apps that allow only one account to be used at a time. `PublicClientApplication` is subclassed by `SingleAccountPublicClientApplication` and `MultipleAccountPublicClientApplication`.  The following diagram shows the relationship between these classes.

![SingleAccountPublicClientApplication UML Class Diagram](./media/single-multi-account/single-and-multiple-account.png)

## Single account public client application

The `SingleAccountPublicClientApplication` class allows you to create an MSAL-based app that only allows a single account to be signed in at a time. `SingleAccountPublicClientApplication` differs from `PublicClientApplication` in the following ways:

- MSAL tracks the currently signed-in account.
  - If your app is using a broker (the default during Azure portal app registration) and is installed on a device where a broker is present, MSAL will verify that the account is still available on the device.
- `signIn` allows you to sign in an account explicitly and separately from requesting scopes.
- `acquireTokenSilent` doesn't require an account parameter.  If you do provide an account, and the account you provide doesn't match the current account tracked by MSAL, an `MsalClientException` is thrown.
- `acquireToken` doesn't allow the user to switch accounts. If the user attempts to switch to a different account, an exception is thrown.
- `getCurrentAccount` returns a result object that provides the following:
  - A boolean indicating whether the account changed. An account may be changed as a result of being removed from the device, for example.
  - The prior account. This is useful if you need to do any local data cleanup when the account is removed from the device or when a new account is signed in.
  - The currentAccount.
- `signOut` removes any tokens associated with your client from the device.  

When an Android Authentication broker such as Microsoft Authenticator or Intune Company Portal is installed on the device and your app is configured to use the broker, `signOut` won't remove the account from the device.

## Single account scenario

The following pseudo code illustrates using `SingleAccountPublicClientApplication`.

```java
// Construct Single Account Public Client Application
ISingleAccountPublicClientApplication app = PublicClientApplication.createSingleAccountPublicClientApplication(getApplicationContext(), R.raw.msal_config);

String[] scopes = {"User.Read"};
IAccount mAccount = null;

// Acquire a token interactively
// The user will get a UI prompt before getting the token.
app.signIn(getActivity(), scopes, new AuthenticationCallback()
{

        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) 
        {
            mAccount = authenticationResult.getAccount();
        }

        @Override
        public void onError(MsalException exception)
        {
        }

        @Override
        public void onCancel()
        {
        }
    }
);

// Load Account Specific Data
getDataForAccount(account);

// Get Current Account
ICurrentAccountResult currentAccountResult = app.getCurrentAccount();
if (currentAccountResult.didAccountChange())
{
    // Account Changed Clear existing account data
    clearDataForAccount(currentAccountResult.getPriorAccount());
    mAccount = currentAccountResult.getCurrentAccount();
    if (account != null)
    {
        //load data for new account
        getDataForAccount(account);
    }
}

// Sign out
if (app.signOut())
{
    clearDataForAccount(mAccount);
    mAccount = null;
}
```

## Multiple account public client application

The `MultipleAccountPublicClientApplication` class is used to create MSAL-based apps that allow multiple accounts to be signed in at the same time. It allows you to get, add, and remove accounts as follows:

### Add an account

Use one or more accounts in your application by calling `acquireToken` one or more times.  

### Get accounts

- Call `getAccount` to get a specific account.
- Call `getAccounts`to get a list of accounts currently known to the app.

Your app won't be able to enumerate all the Microsoft identity platform accounts on the device known to the broker app. It can only enumerate accounts that have been used by your app.  Accounts that have been removed from the device won't be returned by these functions.

### Remove an account

Remove an account by calling `removeAccount` with an account identifier.

If your app is configured to use a broker, and a broker is installed on the device, the account won't be removed from the broker when you call `removeAccount`.  Only tokens associated with your client are removed.

## Multiple account scenario

The following pseudo code shows how to create a multiple account app, list accounts on the device, and acquire tokens.

```java
// Construct Multiple Account Public Client Application
IMultipleAccountPublicClientApplication app = PublicClientApplication.createMultipleAccountPublicClientApplication(getApplicationContext(), R.raw.msal_config);

String[] scopes = {"User.Read"};
IAccount mAccount = null;

// Acquire a token interactively
// The user will be required to interact with a UI to obtain a token
app.acquireToken(getActivity(), scopes, new AuthenticationCallback()
 {

        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) 
        {
            mAccount = authenticationResult.getAccount();
        }

        @Override
        public void onError(MsalException exception)
        {
        }

        @Override
        public void onCancel()
        {
        }
 });

...

// Get the default authority
String authority = app.getConfiguration().getDefaultAuthority().getAuthorityURL().toString();

// Get a list of accounts on the device
List<IAccount> accounts = app.getAccounts();

// Pick an account to obtain a token from without prompting the user to sign in
IAccount selectedAccount = accounts.get(0);

// Get a token without prompting the user
app.acquireTokenSilentAsync(scopes, selectedAccount, authority, new SilentAuthenticationCallback()
{

        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) 
        {
            mAccount = authenticationResult.getAccount();
        }

        @Override
        public void onError(MsalException exception)
        {
        }
});
```
