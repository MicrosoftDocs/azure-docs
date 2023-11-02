---
title: Enable authentication in an Android app - Azure AD B2C
description:  Enable authentication in an Android application using Azure Active Directory B2C building blocks. Learn how to use Azure AD B2C to sign in and sign up users in an Android application.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 09/16/2021
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support, has-adal-ref"
---

# Enable authentication in your own Android app by using Azure AD B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own Android mobile application. 

Use this article with [Configure authentication in a sample Android app by using Azure AD B2C](./configure-authentication-sample-android-app.md), substituting the sample Android app with your own Android app. After you've completed the instructions in this article, your application will accept sign-ins via Azure AD B2C.

## Prerequisites

Review the prerequisites and integration instructions in [Configure authentication in a sample Android app by using Azure AD B2C](configure-authentication-sample-android-app.md).

## Create an Android app project

If you don't already have an Android application, set up a new project by doing the following:

1. In Android Studio, select **Start a new Android Studio project**.
1. Select **Basic Activity**, and then select **Next**.
1. Name your application.
1. Save the package name. You'll enter it later in the Azure portal.
1. Change the language from **Kotlin** to **Java**.
1. Set the **Minimum API level** to **API 19** or higher, and then select **Finish**.
1. In the project view, choose **Project** in the dropdown list to display source and non-source project files, open **app/build.gradle**, and then set **targetSdkVersion** to **28**.

## Step 1: Install the dependencies

In the Android Studio project window, go to **app** > **build.gradle**, and then add the following:

```gradle
apply plugin: 'com.android.application'

allprojects {
    repositories {
    mavenCentral()
    google()
    mavenLocal()
    maven {
        url 'https://pkgs.dev.azure.com/MicrosoftDeviceSDK/DuoSDK-Public/_packaging/Duo-SDK-Feed/maven/v1'
    }
    maven {
        name "vsts-maven-adal-android"
        url "https://identitydivision.pkgs.visualstudio.com/_packaging/AndroidADAL/maven/v1"
        credentials {
            username System.getenv("ENV_VSTS_MVN_ANDROIDADAL_USERNAME") != null ? System.getenv("ENV_VSTS_MVN_ANDROIDADAL_USERNAME") : project.findProperty("vstsUsername")
            password System.getenv("ENV_VSTS_MVN_ANDROIDADAL_ACCESSTOKEN") != null ? System.getenv("ENV_VSTS_MVN_ANDROIDADAL_ACCESSTOKEN") : project.findProperty("vstsMavenAccessToken")
        }
    }
    jcenter()
    }
}
dependencies{
    implementation 'com.microsoft.identity.client:msal:2.+'
    }
packagingOptions{
    exclude("META-INF/jersey-module-version")
}
```


## Step 2: Add the authentication components

The [sample code](configure-authentication-sample-android-app.md#step-3-get-the-android-mobile-app-sample) is made up of the following components. Add these components from the sample Android app to your own app. 

|Component  |Type  | Source |Description  |
|---------|---------|---------|---------|
| B2CUser| Class| [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/blob/master/app/src/main/java/com/azuresamples/msalandroidkotlinapp/B2CUser.kt) [Java](https://github.com/Azure-Samples/ms-identity-android-java/blob/master/app/src/main/java/com/azuresamples/msalandroidapp/B2CUser.java)| Represents a B2C user. This class allows users to sign in with multiple policies. | 
| B2CModeFragment | Fragment class| [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/blob/master/app/src/main/java/com/azuresamples/msalandroidkotlinapp/B2CModeFragment.kt) [Java](https://github.com/Azure-Samples/ms-identity-android-java/blob/master/app/src/main/java/com/azuresamples/msalandroidapp/B2CModeFragment.java)| A fragment represents a modular portion of the sign-in with the Azure AD B2C user interface within your main activity. This fragment contains most of the authentication code. |
| fragment_b2c_mode.xml | Fragment layout| [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/blob/master/app/src/main/res/layout/fragment_b2c_mode.xml) [Java](https://github.com/Azure-Samples/ms-identity-android-java/blob/master/app/src/main/res/layout/fragment_b2c_mode.xml) | Defines the structure for a user interface for the B2CModeFragment fragment component. |
| B2CConfiguration| Class| [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/blob/master/app/src/main/java/com/azuresamples/msalandroidkotlinapp/B2CConfiguration.kt) [Java](https://github.com/Azure-Samples/ms-identity-android-java/blob/master/app/src/main/java/com/azuresamples/msalandroidapp/B2CConfiguration.java)| A configuration file contains information about your Azure AD B2C identity provider. The mobile app uses this information to establish a trust relationship with Azure AD B2C, sign users in and out, acquire tokens, and validate them. For more configuration settings, see the auth_config_b2c.json file.  | 
|auth_config_b2c.json | JSON file| [Kotlin](https://github.com/Azure-Samples/ms-identity-android-kotlin/blob/master/app/src/main/res/raw/auth_config_b2c.json) [Java](https://github.com/Azure-Samples/ms-identity-android-java/blob/master/app/src/main/res/raw/auth_config_b2c.json)| A configuration file contains information about your Azure AD B2C identity provider. The mobile app uses this information to establish a trust relationship with Azure AD B2C, sign users in and out, acquire tokens, and validate them. For more configuration settings, see the B2CConfiguration class. |
| | | 

## Step 3: Configure your Android app

After you [add the authentication components](#step-2-add-the-authentication-components), configure your Android app with your Azure AD B2C settings. Azure AD B2C identity provider settings are configured in the *auth_config_b2c.json* file and B2CConfiguration class. 

For guidance, see [Configure the sample mobile app](configure-authentication-sample-android-app.md#step-5-configure-the-sample-mobile-app).

## Step 4: Set the redirect URI

Configure where your application listens to the Azure AD B2C token response. 

1. Generate a new development signature hash. This will change for each development environment.
    
    For Windows:
    
    ```
    keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl base64
    ```
    
    For iOS:
    
    ```dotnetcli
    keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
    ```
    
    For a production environment, use the following command:
    
    ```
    keytool -exportcert -alias SIGNATURE_ALIAS -keystore PATH_TO_KEYSTORE | openssl sha1 -binary | openssl base64
    ```

    For more help with signing your apps, see [Sign your Android app](https://developer.android.com/studio/publish/app-signing). 

1. Select **app** > **src** > **main** > **AndroidManifest.xml**, and then add the following `BrowserTabActivity` activity to the application body:
    
    ```xml
    <!--Intent filter to capture System Browser or Authenticator calling back to our app after sign-in-->
    <activity
        android:name="com.microsoft.identity.client.BrowserTabActivity">
        <intent-filter>
            <action android:name="android.intent.action.VIEW" />
            <category android:name="android.intent.category.DEFAULT" />
            <category android:name="android.intent.category.BROWSABLE" />
            <data android:scheme="msauth"
                android:host="Package_Name"
                android:path="/Signature_Hash" />
        </intent-filter>
    </activity>
    ```
1. Replace `Signature_Hash` with the hash you generated.
1. Replace `Package_Name` with your Android package name.
 
To update the mobile app registration with your app redirect URI, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. If you have access to multiple tenants, select the **Settings** icon in the top menu to switch to your Azure AD B2C tenant from the **Directories + subscriptions** menu.
1. Search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select the application you registered in [Step 2.3: Register the mobile app](configure-authentication-sample-android-app.md#step-23-register-the-mobile-app).
1. Select **Authentication**.
1. Under **Android**, select **Add URI**.
1. Enter the **Package name** and **Signature hash**.
1. Select **Save**.

Your redirect URI and the `BrowserTabActivity` activity should look similar to the following sample: 

#### [Kotlin](#tab/kotlin)

The redirect URL for the sample Android looks like this:

```
msauth://com.azuresamples.msalandroidkotlinapp/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D
```

The intent filter uses the same pattern, as shown in the following XML snippet:

```xml
<activity android:name="com.microsoft.identity.client.BrowserTabActivity">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data
            android:host="com.azuresamples.msalandroidkotlinapp"
            android:path="/1wIqXSqBj7w+h11ZifsnqwgyKrY="
            android:scheme="msauth" />
    </intent-filter>
</activity>
```



#### [Java](#tab/java)

The redirect URL for the sample Android looks like this:

```
msauth://com.azuresamples.msalandroidapp/1wIqXSqBj7w%2Bh11ZifsnqwgyKrY%3D
```

The intent filter uses the same pattern, as shown in the following XML snippet:

```xml
<activity android:name="com.microsoft.identity.client.BrowserTabActivity">
<intent-filter>
    <action android:name="android.intent.action.VIEW" />

    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />

    <data
        android:host="com.azuresamples.msalandroidapp"
        android:path="/1wIqXSqBj7w+h11ZifsnqwgyKrY="
        android:scheme="msauth" />
</intent-filter>
</activity>
```

--- 

## Step 5: Customize your code building blocks

This section describes the code building blocks that enable authentication for your Android app. The following table lists the B2CModeFragment methods and how to customize your code. 

### Step 5.1: Instantiate a public client application

Public client applications aren't trusted to safely keep application secrets, and they don't have client secrets. In [onCreate](https://developer.android.com/reference/android/app/Fragment#onCreate(android.os.Bundle)) or [onCreateView](https://developer.android.com/reference/android/app/Fragment#onCreateView(android.view.LayoutInflater,%20android.view.ViewGroup,%20android.os.Bundle)), instantiate the MSAL by using the multiple-account public client application object.

The `MultipleAccountPublicClientApplication` class is used to create MSAL-based apps that allow multiple accounts to be signed in at the same time. The class allows sign-in with multiple Azure AD B2C user flows or custom policies. For example, users sign in with a [sign-up or sign-in](add-sign-up-and-sign-in-policy.md) user flow and later, they run an [edit profile](add-profile-editing-policy.md) user flow. 

The following code snippet demonstrates how to initiate the MSAL library with the `auth_config_b2c.json` configuration JSON file.

#### [Kotlin](#tab/kotlin)


```kotlin
PublicClientApplication.createMultipleAccountPublicClientApplication(context!!,
    R.raw.auth_config_b2c,
    object : IMultipleAccountApplicationCreatedListener {
        override fun onCreated(application: IMultipleAccountPublicClientApplication) {
            // Set the MultipleAccountPublicClientApplication to the class member b2cApp
            b2cApp = application
            // Load the account (if there is any)
            loadAccounts()
        }

        override fun onError(exception: MsalException) {
            // Error handling
            displayError(exception)
        }
    })
```

#### [Java](#tab/java)

```java
PublicClientApplication.createMultipleAccountPublicClientApplication(getContext(),
    R.raw.auth_config_b2c,
    new IPublicClientApplication.IMultipleAccountApplicationCreatedListener() {
        @Override
        public void onCreated(IMultipleAccountPublicClientApplication application) {
            // Set the MultipleAccountPublicClientApplication to the class member b2cApp
            b2cApp = application;

            // Load the account (if there is any)
            loadAccounts();
        }

        @Override
        public void onError(MsalException exception) {
            // Error handling
            displayError(exception);
        }
    });
```

--- 

### Step 5.2: Load accounts

When the app comes to the foreground, the app loads the existing account to determine whether users are signed in. Use this method to update the UI with the authentication state. For example, you can enable or disable the sign-out button.

The following code snippet demonstrates how to load the accounts.

#### [Kotlin](#tab/kotlin)


```kotlin
private fun loadAccounts() {
    if (b2cApp == null) {
        return
    }
    b2cApp!!.getAccounts(object : LoadAccountsCallback {
        override fun onTaskCompleted(result: List<IAccount>) {
            users = B2CUser.getB2CUsersFromAccountList(result)
            updateUI(users)
        }
    
        override fun onError(exception: MsalException) {
            displayError(exception)
        }
    })
    }
```

#### [Java](#tab/java)

```java
private void loadAccounts() {
    if (b2cApp == null) {
        return;
    }

    b2cApp.getAccounts(new IPublicClientApplication.LoadAccountsCallback() {
        @Override
        public void onTaskCompleted(final List<IAccount> result) {
            users = B2CUser.getB2CUsersFromAccountList(result);
            updateUI(users);
        }

        @Override
        public void onError(MsalException exception) {
            displayError(exception);
        }
    });
}
```

--- 

### Step 5.3: Start an interactive authorization request

An interactive authorization request is a flow where users are prompted to sign up or sign in. The `initializeUI` method configures the `runUserFlowButton` click event. When users select the **Run User Flow** button, the app takes them to Azure AD B2C to complete the sign-in flow. 

The `runUserFlowButton.setOnClickListener` method prepares the `AcquireTokenParameters` object with relevant data about the authorization request. The `acquireToken` method then prompts users to complete the sign-up or sign-in flow. 

The following code snippet demonstrates how to start the interactive authorization request: 

#### [Kotlin](#tab/kotlin)


```kotlin
val parameters = AcquireTokenParameters.Builder()
        .startAuthorizationFromActivity(activity)
        .fromAuthority(getAuthorityFromPolicyName(policy_list.getSelectedItem().toString()))
        .withScopes(B2CConfiguration.scopes)
        .withPrompt(Prompt.LOGIN)
        .withCallback(authInteractiveCallback)
        .build()

b2cApp!!.acquireToken(parameters)
```

#### [Java](#tab/java)

```java
AcquireTokenParameters parameters = new AcquireTokenParameters.Builder()
        .startAuthorizationFromActivity(getActivity())
        .fromAuthority(B2CConfiguration.getAuthorityFromPolicyName(policyListSpinner.getSelectedItem().toString()))
        .withScopes(B2CConfiguration.getScopes())
        .withPrompt(Prompt.LOGIN)
        .withCallback(getAuthInteractiveCallback())
        .build();

b2cApp.acquireToken(parameters);
```

--- 

 
### Step 5.4: Make an interactive authorization request callback

After users finish the authorization flow, whether successfully or unsuccessfully, the result is returned to the `getAuthInteractiveCallback()` callback method. 

The callback method passes the `AuthenticationResult` object, or an error message in the `MsalException` object. Use this method to:

- Update the mobile app UI with information after the sign-in has finished.
- Reload the accounts object.
- Call a web API service with an access token.
- Handle authentication errors.

The following code snippet demonstrates the use of the interactive authentication callback.

#### [Kotlin](#tab/kotlin)


```kotlin
private val authInteractiveCallback: AuthenticationCallback
    private get() = object : AuthenticationCallback {
        override fun onSuccess(authenticationResult: IAuthenticationResult) {
            /* Successfully got a token, use it to call a protected resource; web API  */
            Log.d(TAG, "Successfully authenticated")

            /* display result info */
            displayResult(authenticationResult)

            /* Reload account asynchronously to get the up-to-date list. */
            loadAccounts()
        }

        override fun onError(exception: MsalException) {
            val B2C_PASSWORD_CHANGE = "AADB2C90118"
            if (exception.message!!.contains(B2C_PASSWORD_CHANGE)) {
                txt_log!!.text = """
                    Users click the 'Forgot Password' link in a sign-up or sign-in user flow.
                    Your application needs to handle this error code by running a specific user flow that resets the password.
                    """.trimIndent()
                return
            }

            /* Failed to acquireToken */Log.d(TAG, "Authentication failed: $exception")
            displayError(exception)
            if (exception is MsalClientException) {
                /* Exception inside MSAL, more info inside MsalError.java */
            } else if (exception is MsalServiceException) {
                /* Exception when communicating with the STS, likely config issue */
            }
        }

        override fun onCancel() {
            /* User canceled the authentication */
            Log.d(TAG, "User cancelled login.")
        }
    }
```

#### [Java](#tab/java)

```java
private AuthenticationCallback getAuthInteractiveCallback() {
    return new AuthenticationCallback() {

        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) {
            /* Successfully got a token, use it to call a protected resource - MSGraph */
            Log.d(TAG, "Successfully authenticated");

            /* display result info */
            displayResult(authenticationResult);

            /* Reload account asynchronously to get the up-to-date list. */
            loadAccounts();
        }

        @Override
        public void onError(MsalException exception) {
            final String B2C_PASSWORD_CHANGE = "AADB2C90118";
            if (exception.getMessage().contains(B2C_PASSWORD_CHANGE)) {
                logTextView.setText("Users click the 'Forgot Password' link in a sign-up or sign-in user flow.\n" +
                        "Your application needs to handle this error code by running a specific user flow that resets the password.");
                return;
            }

            /* Failed to acquireToken */
            Log.d(TAG, "Authentication failed: " + exception.toString());
            displayError(exception);

            if (exception instanceof MsalClientException) {
                /* Exception inside MSAL, more info inside MsalError.java */
            } else if (exception instanceof MsalServiceException) {
                /* Exception when communicating with the STS, likely config issue */
            }
        }

        @Override
        public void onCancel() {
            /* User canceled the authentication */
            Log.d(TAG, "User cancelled login.");
        }
    };
}
```

--- 

## Step 6: Call a web API

To call a [token-based authorization web API](enable-authentication-web-api.md), the app needs to have a valid access token. The app does the following:


1. Acquires an access token with the required permissions (scopes) for the web API endpoint.
1. Passes the access token as a bearer token in the authorization header of the HTTP request by using this format:

```http
Authorization: Bearer <access-token>
```

When users [sign in interactively](#step-53-start-an-interactive-authorization-request), the app gets an access token in the `getAuthInteractiveCallback` callback method. For consecutive web API calls, use the acquire token silent procedure as described in this section. 

Before you call a web API, call the `acquireTokenSilentAsync` method with the appropriate scopes for your web API endpoint. The MSAL library does the following:

1. Attempts to fetch an access token with the requested scopes from the token cache. If the token is present, the token is returned. 
1. If the token isn't present in the token cache, MSAL attempts to use its refresh token to acquire a new token. 
1. If the refresh token doesn't exist or has expired, an exception is returned. We recommend that you prompt the user to [sign in interactively](#step-53-start-an-interactive-authorization-request).  

The following code snippet demonstrates how to acquire an access token:

#### [Kotlin](#tab/kotlin)

The `acquireTokenSilentButton` button click event acquires an access token with the provided scopes. 

```kotlin
btn_acquireTokenSilently.setOnClickListener(View.OnClickListener {
    if (b2cApp == null) {
        return@OnClickListener
    }
    val selectedUser = users!![user_list.getSelectedItemPosition()]
    selectedUser.acquireTokenSilentAsync(b2cApp!!,
            policy_list.getSelectedItem().toString(),
            B2CConfiguration.scopes,
            authSilentCallback)
})
```

The `authSilentCallback` callback method returns an access token and calls a web API:

```kotlin
private val authSilentCallback: SilentAuthenticationCallback
    private get() = object : SilentAuthenticationCallback {
        override fun onSuccess(authenticationResult: IAuthenticationResult) {
            Log.d(TAG, "Successfully authenticated")

            /* Call your web API here*/
            callWebAPI(authenticationResult)
        }

        override fun onError(exception: MsalException) {
            /* Failed to acquireToken */
            Log.d(TAG, "Authentication failed: $exception")
            displayError(exception)
            if (exception is MsalClientException) {
                /* Exception inside MSAL, more info inside MsalError.java */
            } else if (exception is MsalServiceException) {
                /* Exception when communicating with the STS, likely config issue */
            } else if (exception is MsalUiRequiredException) {
                /* Tokens expired or no session, retry with interactive */
            }
        }
    }
```

The following example demonstrates how to call a protected web API with a bearer token:

```kotlin
@Throws(java.lang.Exception::class)
private fun callWebAPI(authenticationResult: IAuthenticationResult) {
    val accessToken = authenticationResult.accessToken
    val thread = Thread {
        try {
            val url = URL("https://your-app-service.azurewebsites.net/helo")
            val conn = url.openConnection() as HttpsURLConnection
            conn.setRequestProperty("Accept", "application/json")
            
            // Set the bearer token
            conn.setRequestProperty("Authorization", "Bearer $accessToken")
            if (conn.responseCode == HttpURLConnection.HTTP_OK) {
                val br = BufferedReader(InputStreamReader(conn.inputStream))
                var strCurrentLine: String?
                while (br.readLine().also { strCurrentLine = it } != null) {
                    Log.d(TAG, strCurrentLine)
                }
            }
            conn.disconnect()
        } catch (e: IOException) {
            e.printStackTrace()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
    thread.start()
}
```

#### [Java](#tab/java)

The `acquireTokenSilentButton` button click event acquires an access token with the provided scopes. 

```java
acquireTokenSilentButton.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        if (b2cApp == null) {
            return;
        }

        final B2CUser selectedUser = users.get(b2cUserList.getSelectedItemPosition());
        selectedUser.acquireTokenSilentAsync(b2cApp,
                policyListSpinner.getSelectedItem().toString(),
                B2CConfiguration.getScopes(),
                getAuthSilentCallback());
    }
});
```

The `authSilentCallback` callback method returns an access token and calls a web API:

```java
private SilentAuthenticationCallback getAuthSilentCallback() {
    return new SilentAuthenticationCallback() {

        @Override
        public void onSuccess(IAuthenticationResult authenticationResult) {
            Log.d(TAG, "Successfully authenticated");

            /* Call your web API here*/
            callWebAPI(authenticationResult);
        }

        @Override
        public void onError(MsalException exception) {
            /* Failed to acquireToken */
            Log.d(TAG, "Authentication failed: " + exception.toString());
            displayError(exception);

            if (exception instanceof MsalClientException) {
                /* Exception inside MSAL, more info inside MsalError.java */
            } else if (exception instanceof MsalServiceException) {
                /* Exception when communicating with the STS, likely config issue */
            } else if (exception instanceof MsalUiRequiredException) {
                /* Tokens expired or no session, retry with interactive */
            }
        }
    };
}
```

The following example demonstrates how to call a protected web API with a bearer token:

```java
private void callWebAPI(IAuthenticationResult authenticationResult) throws Exception {
    final String accessToken = authenticationResult.getAccessToken();
    
    
    Thread thread = new Thread(new Runnable() {
    
        @Override
        public void run() {
            try {
                URL url = new URL("https://your-app-service.azurewebsites.net/helo");
                HttpsURLConnection conn = (HttpsURLConnection)url.openConnection();
                conn.setRequestProperty("Accept", "application/json");
                
                // Set the bearer token
                conn.setRequestProperty("Authorization", "Bearer " +  accessToken);
    
                if (conn.getResponseCode() == HttpURLConnection.HTTP_OK) {
                    BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()));
                    String strCurrentLine;
                    while ((strCurrentLine = br.readLine()) != null) {
                        Log.d(TAG, strCurrentLine);
                    }
                }
                conn.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    });
    
    thread.start();
    
    }
```

--- 

### Add permission to perform network operations

To perform network operations in your application, add the following permission to your manifest. For more information, see [Connect to the network](https://developer.android.com/training/basics/network-ops/connecting).

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

## Next steps

Learn how to:
* [Configure authentication options in an Android app by using Azure AD B2C](enable-authentication-android-app-options.md)
* [Enable authentication in your own web API by using Azure AD B2C](enable-authentication-web-api.md)
