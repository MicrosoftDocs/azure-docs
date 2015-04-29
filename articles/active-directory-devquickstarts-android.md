<properties
	pageTitle="Azure AD Android Getting Started | Microsoft Azure"
	description="How to build an Android application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter="android"
	authors="brandwe"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="brandwe"/>

# Integrate Azure AD into an Android App
If you're developing a desktop application, Azure AD makes it simple and straightforward for you to authenticate your users with their Active Directory accounts.  It also enables your application to securely consume any web API protected by Azure AD, such as the Office 365 APIs or the Azure API.

For Android clients that need to access protected resources, Azure AD provides the Active Directory Authentication Library, or ADAL.  ADAL’s sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we’ll build an Android To-Do List application that:

-	Gets access tokens for calling a To-Do List API using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
-	Gets a user's To-Do List
-	Signs users out.

To get started, you'll need an Azure AD tenant in which you can create users and register an application.  If you don't already have a tenant, [learn how to get one](active-directory-howto-tenant.md).

## Step 1: Download and run the Node.js REST API TODO Sample Server

This sample is written specifically to work against our existing sample for building a single tenant To-Do REST API for Microsoft Azure Active Directory. This is a pre-requisite for the Quick Start.

For information on how to set this up, visit our existing samples here:

* [Microsoft Azure Active Directory Sample REST API Service for Node.js](active-directory-devquickstarts-webapi-nodejs.md)

## Step 2: Register your Web API with your Microsoft Azure AD Tenant

**What am I doing?**

*Microsoft Active Directory supports adding two types of applications. Web APIs that offer services to users and applications (either on the web or an applicaiton running on a device) that access those Web APIs. In this step you are registering the Web API you are running locally for testing this sample. Normally this Web API would be a REST service that is offering functionaltiy you want an app to access. Microsoft Azure Active Directory can protect any endpoint!*

*Here we are assuming you are registering the TODO REST API referenced above, but this works for any Web API you'd want Azure Active Directory to protect.*

Steps to register a Web API with Microsoft Azure AD

1. Sign in to the [Azure management portal](https://manage.windowsazure.com).
2. Click on Active Directory in the left hand nav.
3. Click the directory tenant where you wish to register the sample application.
4. Click the Applications tab.
5. In the drawer, click Add.
6. Click "Add an application my organization is developing".
7. Enter a friendly name for the application, for example "TodoListService", select "Web Application and/or Web API", and click next.
8. For the sign-on URL, enter the base URL for the sample, which is by default `https://localhost:8080`.
9. For the App ID URI, enter `https://<your_tenant_name>/TodoListService`, replacing `<your_tenant_name>` with the name of your Azure AD tenant.  Click OK to complete the registration.
10. While still in the Azure portal, click the Configure tab of your application.
11. **Find the Client ID value and copy it aside**, you will need this later when configuring your application.

## Step 3: Register the sample Android Native Client application

Registering your web application is the first step. Next, you'll need to tell Azure Active Directory about your application as well. This allows your application to communicate with the just registered Web API

**What am I doing?**  

*As stated above, Microsoft Azure Active Directory supports adding two types of applications. Web APIs that offer services to users and applications (either on the web or an applicaiton running on a device) that access those Web APIs. In this step you are registering the application in this sample. You must do that in order for this application to be able to request to access the Web API you just registered. Azure Active Directory will refuse to even allow your application to ask for sign-in unless it's registered! That's part of the security of the model.*

*Here we are assuming you are registering this sample application referenced above, but this works for any app you are developing.*

**Why am I putting both an application and a Web API in one tenant?**

*As you might have guessed, you could build an app that accesses an external API that is registered in Azure Active Directory from another tenant. If you do that, your customers will be prompted to consent to the use of the API in the application. The nice part is, Active Directory Authentication Library for iOS takes care of this consent for you! As we get in to more advanced features, you'll see this is an important part of the work needed to access the suite of Microsoft APIs from Azure and Office as well as any other service provider. For now, because you registered both your Web API and application under the same tenant you won't see any prompts for consent. This is usually the case if you are developing an application just for your own company to use.*

1. Sign in to the [Azure management portal](https://manage.windowsazure.com).
2. Click on Active Directory in the left hand nav.
3. Click the directory tenant where you wish to register the sample application.
4. Click the Applications tab.
5. In the drawer, click Add.
6. Click "Add an application my organization is developing".
7. Enter a friendly name for the application, for example "TodoListClient-Android", select "Native Client Application", and click next.
8. For the Redirect URI, enter `http://TodoListClient`.  Click finish.
9. Click the Configure tab of the application.
10. Find the Client ID value and copy it aside, you will need this later when configuring your application.
11. In "Permissions to Other Applications", click "Add Application."  Select "Other" in the "Show" dropdown, and click the upper check mark.  Locate & click on the TodoListService, and click the bottom check mark to add the application.  Select "Access TodoListService" from the "Delegated Permissions" dropdown, and save the configuration.



To build with Maven, you can use the pom.xml at top level

  * Clone this repo in to a directory of your choice:

  `$ git clone git@github.com:AzureADSamples/NativeClient-Android.git`  

  * Follow the steps at [Prerequests section to setup your maven for android](https://github.com/MSOpenTech/azure-activedirectory-library-for-android/wiki/Setting-up-maven-environment-for-Android)
  * Setup emulator with SDK 19
  * Go to the root folder where you cloned the repo
  * Run the command: mvn clean install
  * Change the directory to the Quick Start sample: cd samples\hello
  * Run the command: mvn android:deploy android:run
  * You should see app launching
  * Enter test user credentials to try!

Jar packages will be also submitted beside the aar package.

### Step 4: Download the Android ADAL and add it to your Eclipse Workspace

We've made it easy for you to have multiple options to use this library in your Android project:

* You can use the source code to import this library into Eclipse and link to your application.
* If using Android Studio, you can use *aar* package format and reference the binaries.

####Option 1: Source Zip

To download a copy of the source code, click "Download ZIP" on the right side of the page or click [here](https://github.com/AzureAD/azure-activedirectory-library-for-android/archive/v1.0.9.tar.gz).

####Option 2: Source via Git

To get the source code of the SDK via git just type:

    git clone git@github.com:AzureAD/azure-activedirectory-library-for-android.git
    cd ./azure-activedirectory-library-for-android/src

####Option 3: Binaries via Gradle

You can get the binaries from Maven central repo. AAR package can be included as follows in your project in AndroidStudio:

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

####Option 4: aar via Maven

If you are using the m2e plugin in Eclipse, you can specify the dependency in your pom.xml file:

```xml
<dependency>
    <groupId>com.microsoft.aad</groupId>
    <artifactId>adal</artifactId>
    <version>1.1.1</version>
    <type>aar</type>
</dependency>
```


####Option 5: jar package inside libs folder
You can get the jar file from maven the repo and drop into the *libs* folder in your project. You need to copy the required resources to your project as well since the jar packages don't include them.


### Step 5: Add references to Android ADAL to your project


2. Add a reference to your project and specify it as an Android library. If you are uncertain how to do this, [click here for more information] (http://developer.android.com/tools/projects/projects-eclipse.html)

3. Add the project dependency for debugging in to your project settings

4. Update your project's AndroidManifest.xml file to include:

    ```Java
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
    ```

7. Create an instance of AuthenticationContext at your main Activity. The details of this call are beyond the scope of this README, but you can get a good start by looking at the [Android Native Client Sample](https://github.com/AzureADSamples/NativeClient-Android). Below is an example:

    ```Java
    // Authority is in the form of https://login.windows.net/yourtenant.onmicrosoft.com
    mContext = new AuthenticationContext(MainActivity.this, authority, true); // This will use SharedPreferences as            default cache
    ```
  * NOTE: mContext is a field in your activity

8. Copy this code block to handle the end of AuthenticationActivity after user enters credentials and receives authorization code:

    ```Java
     @Override
     protected void onActivityResult(int requestCode, int resultCode, Intent data) {
         super.onActivityResult(requestCode, resultCode, data);
         if (mContext != null) {
             mContext.onActivityResult(requestCode, resultCode, data);
         }
     }
    ```

9. To ask for a token, you define a callback

    ```Java
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
    ```
10. Finally, ask for a token using that callback:

    ```Java
     mContext.acquireToken(MainActivity.this, resource, clientId, redirect, user_loginhint, PromptBehavior.Auto, "",
                    callback);
    ```

Explanation of the parameters:

  * Resource is required and is the resource you are trying to access.
  * Clientid is required and comes from the AzureAD Portal.
  * You can setup redirectUri as your packagename. It is not required to be provided for the acquireToken call.
  * PromptBehavior helps to ask for credentials to skip cache and cookie.
  * Callback will be called after authorization code is exchanged for a token.

  The Callback will have an object of AuthenticationResult which has accesstoken, date expired, and idtoken info.

Optional:  **acquireTokenSilent**

You can call **acquireTokenSilent** to handle caching, and token refresh. It provides sync version as well. It accepts userid as paremeter.

    ```java
     mContext.acquireTokenSilent(resource, clientid, userId, callback );
    ```

11. **Broker**:
  Microsoft Intune's Company portal app will provide the broker component. Adal will use the broker account, if there is one user account is created at this authenticator and Developer choose not to skip it. Developer can skip the broker user with:

    ```java
     AuthenticationSettings.Instance.setSkipBroker(true);
    ```

 Developer needs to register special redirectUri for broker usage. RedirectUri is in the format of msauth://packagename/Base64UrlencodedSignature. You can get your redirecturi for your app using the script "brokerRedirectPrint.ps1" or use API call mContext.getBrokerRedirectUri. Signature is related to your signing certificates.

 Current broker model is for one user. AuthenticationContext provides API method to get the broker user.

 ```java
 String brokerAccount =  mContext.getBrokerUser();
 ```
 Broker user will be returned if account is valid.

 Your app manifest should have permissions to use AccountManager accounts: http://developer.android.com/reference/android/accounts/AccountManager.html

 * GET_ACCOUNTS
 * USE_CREDENTIALS
 * MANAGE_ACCOUNTS


Using this walkthrough, you should have what you need to successfully integrate with Azure Active Directory. For more examples of this working, viist the AzureADSamples/ repository on GitHub.

## Important Information

### Customization

Library project resources can be overwritten by your application resources. This happens when your app is building. For this reason, you can customize Authentication Activity layout the way you want. You need to make sure to keep the id of the controls that ADAL uses(Webview).

### Broker

Broker component will be delivered with Intune's Company portal app. Account will be created in Account Manager. Account type is "com.microsoft.workaccount". It only allows single SSO account. It will create SSO cookie for this user after completing device challange for one of the apps.

### Authority Url and ADFS

ADFS is not recognized as production STS, so you need to turn of instance discovery and pass false at AuthenticationContext constructor.

Authority url needs STS instance and tenant name: https://login.windows.net/yourtenant.onmicrosoft.com

### Querying cache items

ADAL provides Default cache in SharedPrefrecens with some simple cache query fucntions. You can get the current cache from AuthenticationContext with:
```Java
 ITokenCacheStore cache = mContext.getCache();
```
You can also provide your cache implementation, if you want to customize it.
```Java
mContext = new AuthenticationContext(MainActivity.this, authority, true, yourCache);
```

### PromptBehavior

ADAL provides option to specifiy prompt behavior. PromptBehavior.Auto will pop up UI if refresh token is invalid and user credentials are required. PromptBehavior.Always will skip the cache usage and always show UI.

### Silent token request from cache and refresh

This method does not use UI pop up and not require an activity. It will return token from cache if available. If token is expired, it will try to refresh it. If refresh token is expired or failed, it will return AuthenticationException.

    ```Java
    Future<AuthenticationResult> result = mContext.acquireTokenSilent(resource, clientid, userId, callback );
    ```

You can also make sync call with this method. You can set null to callback or use acquireTokenSilentSync.

### Diagnostics

The following are the primary sources of information for diagnosing issues:

+ Exceptions
+ Logs
+ Network traces

Also, note that correlation IDs are central to the diagnostics in the library. You can set your correlation IDs on a per request basis if you want to correlate an ADAL request with other operations in your code. If you don't set a correlations id then ADAL will generate a random one and all log messages and network calls will be stamped with the correlation id. The self generated id changes on each request.

#### Exceptions

This is obviously the first diagnostic. We try to provide helpful error messages. If you find one that is not helpful please file an issue and let us know. Please also provide device information such as model and SDK#.

#### Logs

You can configure the library to generate log messages that you can use to help diagnose issues. You configure logging by making the following call to configure a callback that ADAL will use to hand off each log message as it is generated.


 ```Java
 Logger.getInstance().setExternalLogger(new ILogger() {
     @Override
     public void Log(String tag, String message, String additionalMessage, LogLevel level, ADALError errorCode) {
      ...
      // You can write this to logfile depending on level or errorcode.
      writeToLogFile(getApplicationContext(), tag +":" + message + "-" + additionalMessage);
     }
 }
 ```
Messages can be written to a custom log file as seen below. Unfortunately, there is no standard way of getting logs from a device. There are some services that can help you with this. You can also invent your own, such as sending the file to a server.

```Java
private syncronized void writeToLogFile(Context ctx, String msg) {
       File directory = ctx.getDir(ctx.getPackageName(), Context.MODE_PRIVATE);
       File logFile = new File(directory, "logfile");
       FileOutputStream outputStream = new FileOutputStream(logFile, true);
       OutputStreamWriter osw = new OutputStreamWriter(outputStream);
       osw.write(msg);
       osw.flush();
       osw.close();
}
```

##### Logging Levels

+ Error(Exceptions)
+ Warn(Warning)
+ Info(Information purposes)
+ Verbose(More details)

You set the log level like this:
```Java
Logger.getInstance().setLogLevel(Logger.LogLevel.Verbose);
 ```

 All log messages are sent to logcat in addition to any custom log callbacks.
 You can get log to a file form logcat as shown belog:

 ```
  adb logcat > "C:\logmsg\logfile.txt"
 ```
 More examples about adb cmds: https://developer.android.com/tools/debugging/debugging-log.html#startingLogcat

#### Network Traces

You can use various tools to capture the HTTP traffic that ADAL generates.  This is most useful if you are familiar with the OAuth protocol or if you need to provide diagnostic information to Microsoft or other support channels.

Fiddler is the easiest HTTP tracing tool.  Use the following links to setup it up to correctly record ADAL network traffic.  In order to be useful it is necessary to configure fiddler, or any other tool such as Charles, to record unencrypted SSL traffic.  NOTE: Traces generated in this way may contain highly privileged information such as access tokens, usernames and passwords.  If you are using production accounts, do not share these traces with 3rd parties.  If you need to supply a trace to someone in order to get support, reproduce the issue with a temporary account with usernames and passwords that you don't mind sharing.

+ [Setting Up Fiddler For Android](http://docs.telerik.com/fiddler/configure-fiddler/tasks/ConfigureForAndroid)
+ [Configure Fiddler Rules For ADAL](https://github.com/AzureAD/azure-activedirectory-library-for-android/wiki/How-to-listen-to-httpUrlConnection-in-Android-app-from-Fiddler)


### Dialog mode
acquireToken method without activity supports dialog prompt.

### Encryption

ADAL encrypts the tokens and store in SharedPreferences by default. You can look at the StorageHelper class to see the details. Android introduced AndroidKeyStore for 4.3(API18) secure storage of private keys. ADAL uses that for API18 and above. If you want to use ADAL for lower SDK versions, you need to provide secret key at AuthenticationSettings.INSTANCE.setSecretKey

### Oauth2 Bearer challange

AuthenticationParameters class provides functionality to get the authorization_uri from Oauth2 bearer challange.

### Session cookies in Webview

Android webview does not clear session cookies after app is closed. You can handle this with sample code below:
```java
CookieSyncManager.createInstance(getApplicationContext());
CookieManager cookieManager = CookieManager.getInstance();
cookieManager.removeSessionCookie();
CookieSyncManager.getInstance().sync();
```
More about cookies: http://developer.android.com/reference/android/webkit/CookieSyncManager.html

### Resource Overrides

The ADAL library includes English strings for the following two ProgressDialog messages.

Your application should overwrite them if localized strings are desired.

```Java
<string name="app_loading">Loading...</string>
<string name="broker_processing">Broker is processing</string>
<string name="http_auth_dialog_username">Username</string>
<string name="http_auth_dialog_password">Password</string>
<string name="http_auth_dialog_title">Sign In</string>
<string name="http_auth_dialog_login">Login</string>
<string name="http_auth_dialog_cancel">Cancel</string>
```

=======

### NTLM dialog
Adal version 1.1.0 supports NTLM dialog that is processed through onReceivedHttpAuthRequest event from WebViewClient. Dialog layout and strings can be customized.### Step 5: Download the iOS Native Client Sample code
