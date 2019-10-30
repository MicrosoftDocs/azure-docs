---
title: Microsoft identity platform Android quickstart | Azure
description: Learn how Android applications can call an API that requires access tokens by Microsoft identity platform endpoint.
services: active-directory
documentationcenter: dev-center-name
author: TylerMSFT
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 09/16/2019
ms.author: twhitney
ms.custom: aaddev, identityplatformtop40, scenarios:getting-started, languages:Android
#Customer intent: As an application developer, I want to learn how Android native apps can call protected APIs that require login and access tokens using the Microsoft identity platform endpoint.
ms.collection: M365-identity-device-management
---

# Quickstart: Sign in users and call the Microsoft Graph API from an Android app

This quickstart uses a code sample to demonstrate how an Android application can sign in personal, work, or school accounts using the Microsoft identity platform, and then get an access token and call the Microsoft Graph API.

![Screenshoft of the sample app](media/quickstart-v2-android/android-intro.svg)

> [!NOTE]
> **Prerequisites**
> * Android Studio 
> * Android 16+ is required

## Step 1: Get the sample app

[Clone the code](https://github.com/Azure-Samples/ms-identity-android-java.git).

## Step 2: Register your application

To register an application object, and add that application object's registration information to the sample project manually, follow these steps:

1. Go to the [Azure portal](https://aka.ms/MobileAppReg).
1. Open the [App registrations blade](https://portal.azure.com/?feature.broker=true#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps) and click **+New registration**.
1. Enter a **Name** for your app registration and then, without setting a Redirect URI, click **Register**.
1. In the **Manage** section, select **Authentication** > **+ Add a platform** > **Android**. (You may have to select **Try out the new experience** near the top of the blade to see this screen)
1. Enter your project's **Package Name**, which is `com.azuresamples.msalandroidapp`.
1. In the **Signature hash** section of the **Configure your Android app** page, click **Generating a development Signature Hash**, and copy the KeyTool command to use for the platform you're using to develop your Android app.

   > [!Note]
   > KeyTool.exe is installed as part of the Java Development Kit (JDK). You must also install the OpenSSL tool to execute the KeyTool command.  You'll need keytool, and the OpenSSL\bin directory, in your path.

1. Run the keytool command you copied from the portal in a terminal window.
1. Enter the generated signature hash into the Portal under **Signature hash**.
1. Click `Configure` and make a copy of the **MSAL Configuration**. You'll copy and paste this into a config file in the next step. Click **Done**.

## Step 3: Add your app registration

1. Open the sample project in Android Studio.
1. Inside **app** > **res** > **raw**, open **auth_config_multiple_account.json**.  Paste the contents of the MSAL Configuration. This adds the client ID, tenant ID, and redirect_uri from the portal. It will look something like this, but with the values filled in for the client ID, tenant ID, and redirect_uri:

    ```json
    {
      "client_id" : "<your_client_id_here>",
      "authorization_user_agent" : "DEFAULT",
      "redirect_uri" : "<your_redirect_uri_here>",
      "account_mode" : "MULTIPLE",
      "broker_redirect_uri_registered": true,
      "authorities" : [
        {
          "type": "AAD",
          "audience": {
            "type": "AzureADandPersonalMicrosoftAccount",
            "tenant_id": "common"
          }
        }
      ]
    }
    ```

1. Open **app** > **res** > **raw**, open **auth_config_single_account.json**, and paste the contents of the MSAL Configuration. It will look like the **auth_config_multiple_account.json** file above.
1. In **app** > **manifests** > **AndroidManifest.xml**, find the `BrowserTabActivity` activity. This entry allows Microsoft to call back to your application after it completes the authentication:

    ```xml
    ...
    <activity android:name="com.microsoft.identity.client.BrowserTabActivity">
                <intent-filter>
                    <action android:name="android.intent.action.VIEW" />
    
                    <category android:name="android.intent.category.DEFAULT" />
                    <category android:name="android.intent.category.BROWSABLE" />
    
                    <!--
                        Add in your scheme/host from registered redirect URI
                        note that the leading "/" is required for android:path
                        For Example:
                        <data
                            android:host="com.azuresamples.msalandroidapp"
                            android:path="/1wIqXSqBj7w+h11ZifsnqwgyKrY="
                            android:scheme="msauth" />
                    -->
    
                    <data
                        android:host="YOUR_PACKAGE_NAME - must be registered at https://aka.ms/MobileAppReg"
                        android:path="/YOUR_DECODED_SIGNATURE_HASH - must be registered at https://aka.ms/MobileAppReg"
                        android:scheme="msauth" />
                </intent-filter>
            </activity>
    ```
    
1. Substitute the package name with what you registered in the Azure portal for the `android:host=` value.  In this case, it will be: `com.azuresamples.msalandroidapp`.

    > [!IMPORTANT]
    > The **android:path** value **must** have a leading "/" character, or you'll get a red line beneath the value and the sample app won't run.
     
1. Substitute the key hash you got by running keytool earlier and entered in the Azure portal, for the `android:path=` value. The Signature Hash should not be URL encoded.

## Step 4: Run the sample app

Select your emulator or device from Android Studio's **available devices** dropdown and run the app.

The sample app starts on the **Single Account Mode** screen. A default scope, **user.read**, is provided by default, which is used when reading your own profile data during the Microsoft Graph API call. The URL for the Microsoft Graph API call is provided by default. You can change both of these if you wish.

![MSAL sample app showing single and multiple account usage](./media/quickstart-v2-android/quickstart-sample-app.png)

Use the app menu to change between single and multiple account modes.

In single account mode, sign in using a work or home account:

1. Select **Get graph data interactively** to prompt the user for their credentials. You'll see the output from the call to the Microsoft Graph API in the bottom of the screen.
2. Once signed in, select **Get graph data silently** to make a call to the Microsoft Graph API without prompting the user for credentials again. You'll see the output from the call to the Microsoft Graph API in the bottom of the screen.

In multiple account mode, you can repeat the same steps.  Additionally, you can remove the signed-in account, which also removes the cached tokens for that account.

## How the sample works

The code is organized into fragments that show how to write a single and multiple accounts MSAL app. The code files are organized as follows:

| File  | Demonstrates  |
|---------|---------|
| MainActivity | Manages the UI |
| MSGraphRequestWrapper  | Calls the Microsoft Graph API using the token provided by MSAL |
| MultipleAccountModeFragment  | Initializes a multi-account application, loads a user account, and gets a token to call the Microsoft Graph API |
| SingleAccountModeFragment | Initializes a single-account application, loads a user account, and gets a token to call the Microsoft Graph API |
| res/auth_config_multiple_account.json  | The multiple account configuration file |
| res/auth_config_single_account.json  | The single account configuration file |
| Gradle Scripts/build.grade (Module:app) | The MSAL library dependencies are added here |

We'll now look at these files in more detail and call out the MSAL-specific code in each.

### Add MSAL to the app

MSAL ([com.microsoft.identity.client](https://javadoc.io/doc/com.microsoft.identity.client/msal)) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. Gradle 3.0+ installs the library when you add the following to **Gradle Scripts** > **build.gradle (Module: app)** under **Dependencies**:

```gradle  
implementation 'com.microsoft.identity.client:msal:1.0.0'
```

You can see this in the sample project in build.gradle (Module: app):

```java
dependencies {
    ...
    implementation 'com.microsoft.identity.client:msal:1.0.0-RC7'
    ...
}
```

This instructs Gradle to download and build MSAL from maven central.

### MSAL imports

The imports that are relevant to the MSAL library are `com.microsoft.identity.client.*`.  For example, you'll see `import com.microsoft.identity.client.PublicClientApplication;` which is the namespace for the `PublicClientApplication` class, which represents your public client application.

### SingleAccountModeFragment.java

This file demonstrates how to create a single account MSAL app and call a Microsoft Graph API.

Single account apps are only used by a single user.  For example, you might just have one account that you sign into your mapping app with.

#### Single account MSAL initialization

In `onCreateView()`, a single account `PublicClientApplication` is created using the config information stored in the `auth_config_single_account.json` file.  This is how you initialize the MSAL library for use in a single-account MSAL app:

```java
...
// Creates a PublicClientApplication object with res/raw/auth_config_single_account.json
PublicClientApplication.createSingleAccountPublicClientApplication(getContext(),
        R.raw.auth_config_single_account,
        new IPublicClientApplication.ISingleAccountApplicationCreatedListener() {
            @Override
            public void onCreated(ISingleAccountPublicClientApplication application) {
                /**
                    * This test app assumes that the app is only going to support one account.
                    * This requires "account_mode" : "SINGLE" in the config json file.
                    **/
                mSingleAccountApp = application;
                loadAccount();
            }

            @Override
            public void onError(MsalException exception) {
                displayError(exception);
            }
        });
```

#### Sign in a user

The code to sign in a user is in `initializeUI()`, in the `signInButton` click handler.

Call `signIn()` before trying to acquire tokens. `signIn()` behaves as though `acquireToken()` is called, resulting in an interactive prompt for the user to sign in.

Signing in a user is an asynchronous operation. A callback is passed that calls the Microsoft Graph API and update the UI once the user signs in:

```java
mSingleAccountApp.signIn(getActivity(), null, getScopes(), getAuthInteractiveCallback());
```

#### Sign out a user

The code to sign out a user is in `initializeUI()`, in the `signOutButton` click handler.  Signing a user out is an asynchronous operation. Signing the user out also clears the token cache for that account. A callback is created to update the UI once the user account is signed out:

```java
mSingleAccountApp.signOut(new ISingleAccountPublicClientApplication.SignOutCallback() {
    @Override
    public void onSignOut() {
        updateUI(null);
        performOperationOnSignOut();
    }

    @Override
    public void onError(@NonNull MsalException exception) {
        displayError(exception);
    }
});
```

#### Get a token interactively or silently

To present the fewest number of prompts to the user, you'll typically get a token silently. Then, if there's an error, attempt to get to token interactively. The first time the app calls `signIn()`, it effectively acts as a call to `acquireToken()`, which will prompt the user for credentials.

Some situations when the user may be prompted to select their account, enter their credentials, or consent to the permissions your app has requested are:

* The first time the user signs in to the application
* If a user resets their password, they'll need to enter their credentials
* If consent is revoked
* If your app explicitly requires consent
* When your application is requesting access to a resource for the first time
* When MFA or other Conditional Access policies are required

The code to get a token interactively, that is with UI that will involve the user, is in `initializeUI()`, in the `callGraphApiInteractiveButton` click handler:

```java
/**
 * If acquireTokenSilent() returns an error that requires an interaction (MsalUiRequiredException),
 * invoke acquireToken() to have the user resolve the interrupt interactively.
 *
 * Some example scenarios are
 *  - password change
 *  - the resource you're acquiring a token for has a stricter set of requirement than your Single Sign-On refresh token.
 *  - you're introducing a new scope which the user has never consented for.
 */
mSingleAccountApp.acquireToken(getActivity(), getScopes(), getAuthInteractiveCallback());
```

If the user has already signed in, `acquireTokenSilentAsync()` allows apps to request tokens silently as shown in `initializeUI()`, in the `callGraphApiSilentButton` click handler:

```java
/**
  * Once you've signed the user in,
  * you can perform acquireTokenSilent to obtain resources without interrupting the user.
  */
  mSingleAccountApp.acquireTokenSilentAsync(getScopes(), AUTHORITY, getAuthSilentCallback());
```

#### Load an account

The code to load an account is in `loadAccount()`.  Loading the user's account is an asynchronous operation, so callbacks to handle when the account loads, changes, or an error occurs is passed to MSAL.  The following code also handles `onAccountChanged()`, which occurs when an account is removed, the user changes to another account, and so on.

```java
private void loadAccount() {
    ...

    mSingleAccountApp.getCurrentAccountAsync(new ISingleAccountPublicClientApplication.CurrentAccountCallback() {
        @Override
        public void onAccountLoaded(@Nullable IAccount activeAccount) {
            // You can use the account data to update your UI or your app database.
            updateUI(activeAccount);
        }

        @Override
        public void onAccountChanged(@Nullable IAccount priorAccount, @Nullable IAccount currentAccount) {
            if (currentAccount == null) {
                // Perform a cleanup task as the signed-in account changed.
                performOperationOnSignOut();
            }
        }

        @Override
        public void onError(@NonNull MsalException exception) {
            displayError(exception);
        }
    });
```

#### Call Microsoft Graph

When a user is signed in, the call to Microsoft Graph is made via an HTTP request by `callGraphAPI()`. This function is a wrapper that simplifies the sample by doing some tasks such as getting the access token from the `authenticationResult` and packaging the call to the MSGraphRequestWrapper, and displaying the results of the call.

```java
private void callGraphAPI(final IAuthenticationResult authenticationResult) {
    MSGraphRequestWrapper.callGraphAPIUsingVolley(
            getContext(),
            graphResourceTextView.getText().toString(),
            authenticationResult.getAccessToken(),
            new Response.Listener<JSONObject>() {
                @Override
                public void onResponse(JSONObject response) {
                    /* Successfully called graph, process data and send to UI */
                    ...
                }
            },
            new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    ...
                }
            });
}
```

### auth_config_single_account.json

This is the configuration file for a MSAL app that uses a single account.

See [Understand  the Android MSAL configuration file ](msal-configuration.md) for an explanation of these fields.

Note the presence of `"account_mode" : "SINGLE"`, which configures this app to use a single account.

```json
{
  "client_id" : "<your_client_id_here>",
  "authorization_user_agent" : "DEFAULT",
  "redirect_uri" : "<your_redirect_uri_here>",
  "account_mode" : "SINGLE",
  "broker_redirect_uri_registered": true,
  "authorities" : [
    {
      "type": "AAD",
      "audience": {
        "type": "AzureADandPersonalMicrosoftAccount",
        "tenant_id": "common"
      }
    }
  ]
}
```

### MultipleAccountModeFragment.java

This file demonstrates how to create a multiple account MSAL app and call a Microsoft Graph API. 

An example of a multiple account app is a mail app that allows you to work with multiple user accounts such as a work account and a personal account.

#### Multiple account MSAL initialization

In `onCreateView()`, a multiple account app object (`IMultipleAccountPublicClientApplication`) is created using the config information stored in the `auth_config_multiple_account.json file`:

```java
// Creates a PublicClientApplication object with res/raw/auth_config_single_account.json
PublicClientApplication.createMultipleAccountPublicClientApplication(getContext(),
        R.raw.auth_config_multiple_account,
        new IPublicClientApplication.IMultipleAccountApplicationCreatedListener() {
            @Override
            public void onCreated(IMultipleAccountPublicClientApplication application) {
                mMultipleAccountApp = application;
                loadAccount();
            }

            @Override
            public void onError(MsalException exception) {
                ...
            }
        });
```

The created `MultipleAccountPublicClientApplication` object is stored in a class member variable so that it can be used to interact with the MSAL library to acquire tokens and load and remove the user account.

#### Load an account

Multiple account apps usually call `GetAccounts()` to select the account to use for MSAL operations. The code to load an account is in `loadAccount()`.  Loading the user's account is an asynchronous operation. So a callback handles the situations when the account is loaded, changes, or an error occurs.

```java
/**
    * Load the currently signed-in account, if there's any.
    * In the shared device mode, if the user is signed out from the device, the app can also perform the clean-up work in onAccountChanged().
    */
private void loadAccount() {
    ...
    mMultipleAccountApp.getAccounts(new IPublicClientApplication.LoadAccountsCallback() {
        @Override
        public void onTaskCompleted(final List<IAccount> result) {
            // You can use the account data to update your UI or your app database.
            accountList = result;
            updateUI(accountList);
        }

        @Override
        public void onError(MsalException exception) {
            displayError(exception);
        }
    });
}
```

#### Get a token interactively or silently

Some situations when the user may be prompted to select their account, enter their credentials, or consent to the permissions your app has requested are:

* The first time users sign in to the application
* If a user resets their password, they'll need to enter their credentials 
* If consent is revoked 
* If your app explicitly requires consent 
* When your application is requesting access to a resource for the first time
* When MFA or other Conditional Access policies are required

Multiple account apps should typically acquire tokens interactively, that is with UI that involves the user, with a call to `acquireToken()`.  The code to get a token interactively is in `initializeUI()`, in the `callGraphApiInteractiveButton` click handler:

```java
/**
 * Acquire token interactively. It will also create an account object for the silent call as a result (to be obtained by getAccount()).
 *
 * If acquireTokenSilent() returns an error that requires an interaction,
 * invoke acquireToken() to have the user resolve the interrupt interactively.
 *
 * Some example scenarios are
 *  - password change
 *  - the resource you're acquiring a token for has a stricter set of requirement than your SSO refresh token.
 *  - you're introducing a new scope which the user has never consented for.
 */
mMultipleAccountApp.acquireToken(getActivity(), getScopes(), getAuthInteractiveCallback());
```

Apps shouldn't require the user to sign in every time they request a token. If the user has already signed in, `acquireTokenSilentAsync()` allows apps to request tokens without prompting the user, as shown in `initializeUI()` in the `callGraphApiSilentButton` click handler:

```java
/**
 * Performs acquireToken without interrupting the user.
 *
 * This requires an account object of the account you're obtaining a token for.
 * (can be obtained via getAccount()).
 */
mMultipleAccountApp.acquireTokenSilentAsync(getScopes(),
accountList.get(accountListSpinner.getSelectedItemPosition()),
AUTHORITY,
getAuthSilentCallback());
```

#### Remove an account

The code to remove an account, and any cached tokens for the account, is in `initializeUI()` in the handler for the remove account button. Before you can remove an account, you need an account object, which you obtain from MSAL functions like `getAccounts()` and `acquireToken()`. Because removing an account is an asynchronous operation, the `onRemoved` callback is supplied to update the UI.

```java
/**
  * Removes the selected account and cached tokens from this app (or device, if the device is in shared mode).
  */
mMultipleAccountApp.removeAccount(accountList.get(accountListSpinner.getSelectedItemPosition()),
        new IMultipleAccountPublicClientApplication.RemoveAccountCallback() {
            @Override
            public void onRemoved() {
                ...
                /* Reload account asynchronously to get the up-to-date list. */
                loadAccount();
            }

            @Override
            public void onError(@NonNull MsalException exception) {
                displayError(exception);
            }
        });
```

### auth_config_multiple_account.json

This is the configuration file for a MSAL app that uses multiple accounts.

See [Understand  the Android MSAL configuration file ](msal-configuration.md) for an explanation of these fields.

Unlike the [auth_config_single_account.json](#auth_config_single_accountjson) configuration file, this config file has `"account_mode" : "MULTIPLE"` instead of `"account_mode" : "SINGLE"` because this is a multiple account app.

```json
{
  "client_id" : "<your_client_id_here>",
  "authorization_user_agent" : "DEFAULT",
  "redirect_uri" : "<your_redirect_uri_here>",
  "account_mode" : "MULTIPLE",
  "broker_redirect_uri_registered": true,
  "authorities" : [
    {
      "type": "AAD",
      "audience": {
        "type": "AzureADandPersonalMicrosoftAccount",
        "tenant_id": "common"
      }
    }
  ]
}
```

## Next steps

### Learn the steps to create the application used in this quickstart

Try out the Android tutorial for a complete step-by-step guide on building applications and new features, including a full explanation of this quickstart.

> [!div class="nextstepaction"]
> [Call Graph API Android tutorial](https://docs.microsoft.com/azure/active-directory/develop/guidedsetups/active-directory-android)

### MSAL for Android library wiki

Read more information about MSAL library for Android:

> [!div class="nextstepaction"]
> [MSAL for Android library wiki](https://github.com/AzureAD/microsoft-authentication-library-for-android/wiki)

[!INCLUDE [Help and support](../../../includes/active-directory-develop-help-support-include.md)]

Help us improve the Microsoft identity platform. Tell us what you think by completing a short two-question survey.

> [!div class="nextstepaction"]
> [Microsoft identity platform survey](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbRyKrNDMV_xBIiPGgSvnbQZdUQjFIUUFGUE1SMEVFTkdaVU5YT0EyOEtJVi4u)
