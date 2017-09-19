---
title: Azure AD Android Getting Started | Microsoft Docs
description: How to build an Android application that integrates with Azure AD for sign-in and calls Azure AD protected APIs by using OAuth.
services: active-directory
documentationcenter: android
author: danieldobalian
manager: mbaldwin
editor: ''

ms.assetid: da1ee39f-89d3-4d36-96f1-4eabbc662343
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: mobile-android
ms.devlang: java
ms.topic: article
ms.date: 01/07/2017
ms.author: dadobali
ms.custom: aaddev

---
# Integrate Azure AD into an Android app
[!INCLUDE [active-directory-devquickstarts-switcher](../../../includes/active-directory-devquickstarts-switcher.md)]

> [!TIP]
> Try the preview of our new [developer portal](https://identity.microsoft.com/Docs/Android), which will help you get up and running with Azure AD in just a few minutes. The developer portal will walk you through the process of registering an app and integrating Azure AD into your code. When you’re finished, you'll have a simple application that can authenticate users in your tenant and a back end that can accept tokens and perform validation.
>
>

If you're developing a desktop application, Azure Active Directory (Azure AD) makes it simple and straightforward for you to authenticate your users by using their on-premises Active Directory accounts. It also enables your application to securely consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For Android clients that need to access protected resources, Azure AD provides the Active Directory Authentication Library (ADAL). The sole purpose of ADAL is to make it easy for your app to get access tokens. To demonstrate how easy it is, we’ll build an Android To-Do List application that:

* Gets access tokens for calling a To-Do List API by using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
* Gets a user's to-do list.
* Signs out users.

To get started, you need an Azure AD tenant in which you can create users and register an application. If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## Step 1: Download and run the Node.js REST API TODO sample server
The Node.js REST API TODO sample is written specifically to work against our existing sample for building a single-tenant To-Do REST API for Azure AD. This is a prerequisite for the Quick Start.

For information on how to set this up, see our existing samples in [Microsoft Azure Active Directory Sample REST API Service for Node.js](active-directory-devquickstarts-webapi-nodejs.md).


## Step 2: Register your web API with your Azure AD tenant
Active Directory supports adding two types of applications:

- Web APIs that offer services to users
- Applications (running either on the web or on a device) that access those web APIs

In this step, you're registering the web API that you're running locally for testing this sample. Normally, this web API is a REST service that's offering functionality that you want an app to access. Azure AD can help protect any endpoint.

We're assuming that you're registering the TODO REST API referenced earlier. But this works for any web API that you want Azure Active Directory to help protect.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account. In the **Directory** list, choose the Azure AD tenant where you want to register your application.
3. Click **More Services** in the left pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. Enter a friendly name for the application (for example, **TodoListService**), select **Web Application and/or Web API**, and click **Next**.
6. For the sign-on URL, enter the base URL for the sample. By default, this is `https://localhost:8080`.
7. Click **OK** to complete the registration.
8. While still in the Azure portal, go to your application page, find the application ID value, and copy it. You'll need this later when configuring your application.
9. From the **Settings** -> **Properties** page, update the app ID URI - enter `https://<your_tenant_name>/TodoListService`. Replace `<your_tenant_name>` with the name of your Azure AD tenant.

## Step 3: Register the sample Android Native Client application
You must register your web application in this sample. This allows your application to communicate with the just-registered web API. Azure AD will refuse to even allow your application to ask for sign-in unless it's registered. That's part of the security of the model.

We're assuming that you're registering the sample application referenced earlier. But this procedure works for any app that you're developing.

> [!NOTE]
> You might wonder why you're putting both an application and a web API in one tenant. As you might have guessed, you can build an app that accesses an external API that is registered in Azure AD from another tenant. If you do that, your customers will be prompted to consent to the use of the API in the application. Active Directory Authentication Library for iOS takes care of this consent for you. As we explore more advanced features, you'll see that this is an important part of the work needed to access the suite of Microsoft APIs from Azure and Office, as well as any other service provider. For now, because you registered both your web API and your application under the same tenant, you won't see any prompts for consent. This is usually the case if you're developing an application just for your own company to use.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account. In the **Directory** list, choose the Azure AD tenant where you want to register your application.
3. Click **More Services** in the left pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. Enter a friendly name for the application (for example, **TodoListClient-Android**), select **Native Client Application**, and click **Next**.
6. For the redirect URI, enter `http://TodoListClient`. Click **Finish**.
7. From the application page, find the application ID value and copy it. You'll need this later when configuring your application.
8. From the **Settings** page, select **Required Permissions** and select **Add**.  Locate and select TodoListService, add the **Access TodoListService** permission under **Delegated Permissions**, and click **Done**.

To build with Maven, you can use pom.xml at the top level:

1. Clone this repo into a directory of your choice:

  `$ git clone git@github.com:AzureADSamples/NativeClient-Android.git`  
2. Follow the steps in the [prerequisites to set up your Maven environment for Android](https://github.com/MSOpenTech/azure-activedirectory-library-for-android/wiki/Setting-up-maven-environment-for-Android).
3. Set up the emulator with SDK 19.
4. Go to the root folder where you cloned the repo.
5. Run this command: `mvn clean install`
6. Change the directory to the Quick Start sample: `cd samples\hello`
7. Run this command: `mvn android:deploy android:run`

   You should see the app starting.
8. Enter test user credentials to try.

JAR packages will be submitted beside the AAR package.

## Step 4: Download the Android ADAL and add it to your Eclipse workspace
We've made it easy for you to have multiple options to use ADAL in your Android project:

* You can use the source code to import this library into Eclipse and link to your application.
* If you're using Android Studio, you can use the AAR package format and reference the binaries.

### Option 1: Source Zip
To download a copy of the source code, click **Download ZIP** on the right side of the page. Or you can [download from GitHub](https://github.com/AzureAD/azure-activedirectory-library-for-android/archive/v1.0.9.tar.gz).

### Option 2: Source via Git
To get the source code of the SDK via Git, type:

    git clone git@github.com:AzureAD/azure-activedirectory-library-for-android.git
    cd ./azure-activedirectory-library-for-android/src

### Option 3: Binaries via Gradle
You can get the binaries from the Maven central repo. The AAR package can be included as follows in your project in Android Studio:

```gradle
repositories {
    mavenCentral()
    flatDir {
        dirs 'libs'
    }
    maven {
        url "YourLocalMavenRepoPath\\.m2\\repository"
    }
}
dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    compile('com.microsoft.aad:adal:1.1.1') {
        exclude group: 'com.android.support'
    } // Recent version is 1.1.1
}
```

### Option 4: AAR via Maven
If you're using the M2Eclipse plug-in, you can specify the dependency in your pom.xml file:

```xml
<dependency>
    <groupId>com.microsoft.aad</groupId>
    <artifactId>adal</artifactId>
    <version>1.1.1</version>
    <type>aar</type>
</dependency>
```


### Option 5: JAR package inside the libs folder
You can get the JAR file from the Maven repo and drop it into the **libs** folder in your project. You need to copy the required resources to your project as well, because the JAR packages don't include them.

## Step 5: Add references to Android ADAL to your project
1. Add a reference to your project and specify it as an Android library. If you're uncertain how to do this, you can get more information on the [Android Studio site](http://developer.android.com/tools/projects/projects-eclipse.html).
2. Add the project dependency for debugging into your project settings.
3. Update your project's AndroidManifest.xml file to include:

        <uses-permission android:name="android.permission.INTERNET" />
        <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
        <application
            android:allowBackup="true"
            android:debuggable="true"
            android:icon="@drawable/ic_launcher"
            android:label="@string/app_name"
            android:theme="@style/AppTheme" >

            <activity
                android:name="com.microsoft.aad.adal.AuthenticationActivity"
                android:label="@string/title_login_hello_app" >
            </activity>
            ....
        <application/>

4. Create an instance of AuthenticationContext at your main activity. The details of this call are beyond the scope of this topic, but you can get a good start by looking at the [Android Native Client sample](https://github.com/AzureADSamples/NativeClient-Android). In the following example, SharedPreferences is the default cache, and Authority is in the form of `https://login.microsoftonline.com/yourtenant.onmicrosoft.com`:

    `mContext = new AuthenticationContext(MainActivity.this, authority, true); // mContext is a field in your activity`

5. Copy this code block to handle the end of AuthenticationActivity after the user enters credentials and receives an authorization code:

        @Override
         protected void onActivityResult(int requestCode, int resultCode, Intent data) {
             super.onActivityResult(requestCode, resultCode, data);
             if (mContext != null) {
                mContext.onActivityResult(requestCode, resultCode, data);
             }
         }

6. To ask for a token, define a callback:

        private AuthenticationCallback<AuthenticationResult> callback = new AuthenticationCallback<AuthenticationResult>() {

            @Override
            public void onError(Exception exc) {
                if (exc instanceof AuthenticationException) {
                    textViewStatus.setText("Cancelled");
                    Log.d(TAG, "Cancelled");
                } else {
                    textViewStatus.setText("Authentication error:" + exc.getMessage());
                    Log.d(TAG, "Authentication error:" + exc.getMessage());
                }
            }

            @Override
            public void onSuccess(AuthenticationResult result) {
                mResult = result;

                if (result == null || result.getAccessToken() == null
                        || result.getAccessToken().isEmpty()) {
                    textViewStatus.setText("Token is empty");
                    Log.d(TAG, "Token is empty");
                } else {
                    // request is successful
                    Log.d(TAG, "Status:" + result.getStatus() + " Expired:"
                            + result.getExpiresOn().toString());
                    textViewStatus.setText(PASSED);
                }
            }
        };

7. Finally, ask for a token by using that callback:

    `mContext.acquireToken(MainActivity.this, resource, clientId, redirect, user_loginhint, PromptBehavior.Auto, "",
                   callback);`

Here's an explanation of the parameters:

* *resource* is required and is the resource you're trying to access.
* *clientid* is required and comes from Azure AD.
* *RedirectUri* is not required to be provided for the acquireToken call. You can set it up as your package name.
* *PromptBehavior* helps to ask for credentials to skip the cache and cookie.
* *callback* is called after the authorization code is exchanged for a token. It has an object of AuthenticationResult, which has access token, date expired, and ID token information.
* *acquireTokenSilent* is optional. You can call it to handle caching and token refresh. It also provides the sync version. It accepts *userId* as a parameter.

        mContext.acquireTokenSilent(resource, clientid, userId, callback );

By using this walkthrough, you should have what you need to successfully integrate with Azure Active Directory. For more examples of this working, visit the AzureADSamples/ repository on GitHub.

## Important information
### Customization
Your application resources can overwrite library project resources. This happens when your app is being built. For this reason, you can customize authentication activity layout the way you want. Be sure to keep the ID of the controls that ADAL uses (WebView).

### Broker
The Microsoft Intune Company Portal app provides the broker component. The account is created in AccountManager. The account type is "com.microsoft.workaccount." AccountManager allows only a single SSO account. It creates an SSO cookie for the user after completing the device challenge for one of the apps.

ADAL uses the broker account if one user account is created at this authenticator and you choose not to skip it. You can skip the broker user with:

   `AuthenticationSettings.Instance.setSkipBroker(true);`

You need to register a special RedirectUri for broker usage. RedirectUri is in the format of `msauth://packagename/Base64UrlencodedSignature`. You can get your RedirectUri for your app by using the script brokerRedirectPrint.ps1 or the API call mContext.getBrokerRedirectUri. The signature is related to your signing certificates.

The current broker model is for one user. AuthenticationContext provides the API method to get the broker user.

   `String brokerAccount =  mContext.getBrokerUser(); //Broker user is returned if account is valid.`

Your app manifest should have the following permissions to use AccountManager accounts. For details, see the [AccountManager information on the Android site](http://developer.android.com/reference/android/accounts/AccountManager.html).

* GET_ACCOUNTS
* USE_CREDENTIALS
* MANAGE_ACCOUNTS

### Authority URL and AD FS
Active Directory Federation Services (AD FS) is not recognized as production STS, so you need to turn of instance discovery and pass false at the AuthenticationContext constructor.

The authority URL needs an STS instance and a [tenant name](https://login.microsoftonline.com/yourtenant.onmicrosoft.com).

### Querying cache items
ADAL provides a default cache in SharedPreferences with some simple cache query functions. You can get the current cache from AuthenticationContext by using:

    ITokenCacheStore cache = mContext.getCache();

You can also provide your cache implementation, if you want to customize it.

    mContext = new AuthenticationContext(MainActivity.this, authority, true, yourCache);

### Prompt behavior
ADAL provides an option to specify prompt behavior. PromptBehavior.Auto will show the UI if the refresh token is invalid and user credentials are required. PromptBehavior.Always will skip the cache usage and always show the UI.

### Silent token request from cache and refresh
A silent token request does not use the UI pop-up and does not require an activity. It returns a token from the cache if available. If the token is expired, this method tries to refresh it. If the refresh token is expired or failed, it returns AuthenticationException.

    Future<AuthenticationResult> result = mContext.acquireTokenSilent(resource, clientid, userId, callback );

You can also make a sync call by using this method. You can set null to callback or use acquireTokenSilentSync.

### Diagnostics
These are the primary sources of information for diagnosing issues:

* Exceptions
* Logs
* Network traces

Note that correlation IDs are central to the diagnostics in the library. You can set your correlation IDs on a per-request basis if you want to correlate an ADAL request with other operations in your code. If you don't set a correlation ID, ADAL will generate a random one. All log messages and network calls will then be stamped with the correlation ID. The self-generated ID changes on each request.

#### Exceptions
Exceptions are the first diagnostic. We try to provide helpful error messages. If you find one that is not helpful, please file an issue and let us know. Include device information such as model and SDK number.

#### Logs
You can configure the library to generate log messages that you can use to help diagnose issues. You configure logging by making the following call to configure a callback that ADAL will use to hand off each log message as it's generated.

    Logger.getInstance().setExternalLogger(new ILogger() {
        @Override
        public void Log(String tag, String message, String additionalMessage, LogLevel level, ADALError errorCode) {
        ...
        // You can write this to log file depending on level or error code.
        writeToLogFile(getApplicationContext(), tag +":" + message + "-" + additionalMessage);
        }
    }

Messages can be written to a custom log file, as shown in the following code. Unfortunately, there is no standard way of getting logs from a device. There are some services that can help you with this. You can also invent your own, such as sending the file to a server.

    private syncronized void writeToLogFile(Context ctx, String msg) {
       File directory = ctx.getDir(ctx.getPackageName(), Context.MODE_PRIVATE);
       File logFile = new File(directory, "logfile");
       FileOutputStream outputStream = new FileOutputStream(logFile, true);
       OutputStreamWriter osw = new OutputStreamWriter(outputStream);
       osw.write(msg);
       osw.flush();
       osw.close();
    }

These are the logging levels:
* Error (exceptions)
* Warn (warning)
* Info (information purposes)
* Verbose (more details)

You set the log level like this:

    Logger.getInstance().setLogLevel(Logger.LogLevel.Verbose);

 All log messages are sent to logcat, in addition to any custom log callbacks.
 You can get a log to a file from logcat as follows:

    adb logcat > "C:\logmsg\logfile.txt"

 For details about adb commands, see the [logcat information on the Android site](https://developer.android.com/tools/debugging/debugging-log.html#startingLogcat).

#### Network traces
You can use various tools to capture the HTTP traffic that ADAL generates.  This is most useful if you're familiar with the OAuth protocol or if you need to provide diagnostic information to Microsoft or other support channels.

Fiddler is the easiest HTTP tracing tool. Use the following links to set it up to correctly record ADAL network traffic. For a tracing tool like Fiddler or Charles to be useful, you must configure it to record unencrypted SSL traffic.  

> [!NOTE]
> Traces generated in this way might contain highly privileged information such as access tokens, usernames, and passwords. If you're using production accounts, do not share these traces with third parties. If you need to supply a trace to someone in order to get support, reproduce the issue by using a temporary account with usernames and passwords that you don't mind sharing.

* From the Telerik website: [Setting Up Fiddler For Android](http://docs.telerik.com/fiddler/configure-fiddler/tasks/ConfigureForAndroid)
* From GitHub: [Configure Fiddler Rules For ADAL](https://github.com/AzureAD/azure-activedirectory-library-for-android/wiki/How-to-listen-to-httpUrlConnection-in-Android-app-from-Fiddler)

### Dialog mode
The acquireToken method without activity supports a dialog prompt.

### Encryption
ADAL encrypts the tokens and store in SharedPreferences by default. You can look at the StorageHelper class to see the details. Android introduced Android Keystore for 4.3 (API 18) secure storage of private keys. ADAL uses that for API 18 and higher. If you want to use ADAL for lower SDK versions, you need to provide a secret key at AuthenticationSettings.INSTANCE.setSecretKey.

### OAuth2 bearer challenge
The AuthenticationParameters class provides functionality to get authorization_uri from the OAuth2 bearer challenge.

### Session cookies in WebView
Android WebView does not clear session cookies after the app is closed. You can handle that by using this sample code:

    CookieSyncManager.createInstance(getApplicationContext());
    CookieManager cookieManager = CookieManager.getInstance();
    cookieManager.removeSessionCookie();
    CookieSyncManager.getInstance().sync();

For details about cookies, see the [CookieSyncManager information on the Android site](http://developer.android.com/reference/android/webkit/CookieSyncManager.html).

### Resource overrides
The ADAL library includes English strings for ProgressDialog messages. Your application should overwrite them if you want localized strings.

     <string name="app_loading">Loading...</string>
     <string name="broker_processing">Broker is processing</string>
     <string name="http_auth_dialog_username">Username</string>
     <string name="http_auth_dialog_password">Password</string>
     <string name="http_auth_dialog_title">Sign In</string>
     <string name="http_auth_dialog_login">Login</string>
     <string name="http_auth_dialog_cancel">Cancel</string>

### NTLM dialog box
ADAL version 1.1.0 supports an NTLM dialog box that is processed through the onReceivedHttpAuthRequest event from WebViewClient. You can customize the layout and strings for the dialog box.

### Cross-app SSO
Learn [how to enable cross-app SSO on Android by using ADAL](active-directory-sso-android.md).  

[!INCLUDE [active-directory-devquickstarts-additional-resources](../../../includes/active-directory-devquickstarts-additional-resources.md)]
