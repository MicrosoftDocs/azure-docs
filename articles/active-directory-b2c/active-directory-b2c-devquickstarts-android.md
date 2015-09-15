<properties
	pageTitle="pageTitle="Azure AD B2C Preview | Microsoft Azure""
	description="HHow to build an Android application that calls a web API using Azure AD B2C."
	services="active-directory"
	documentationCenter="android"
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="mobile-android"
	ms.devlang="java"
	ms.topic="article"
	ms.date="07/17/2015"
	ms.author="brandwe"/>

# Azure AD B2C Preview: Calling a Web API from an Android application

With Azure AD B2C, you can add powerful self-service identity managment features to your iOS apps and web apis in a few short steps.  This article will show you how to create an Android "To-Do List" app that calls a node.js web API using OAuth 2.0 bearer tokens. Both the iOS app and web api use Azure AD B2C to manage user identities
and authenticate users.

> [AZURE.NOTE]
	This information applies to the Azure AD B2C preview.  For information on how to integrate with the generally available Azure AD service, 
	please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).
	
> [AZURE.NOTE]
	This quickstart has a pre-requisite that you have a Web API protected by Azure AD with B2C in order to work fully. We have built one for both .Net and node.js for you to use. This walk-through assumes the node.js Web-API sample is configured. 
	please refer to the [Azure Active Directory Web-API for Node.js sample](active-directory-b2c-devquickstarts-api-node.md`
).

> [AZURE.NOTE]
	This article does not cover how to implement sign-in, sign-up and profile management with Azure AD B2C.  It focuses on calling web APIs after the user is already authenticated.
If you haven't already, you should start with the [.NET Web App getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md) to learn about the basics of Azure AD B2C.

For Android clients that need to access protected resources, Azure AD provides the Active Directory Authentication Library, or ADAL.  ADAL’s sole purpose in life is to make it easy for your app to get access tokens.  To demonstrate just how easy it is, here we’ll build an Android To-Do List application that:

-	Gets access tokens for calling a To-Do List API using the [OAuth 2.0 authentication protocol](https://msdn.microsoft.com/library/azure/dn645545.aspx).
-	Gets a user's To-Do List
-	Signs users out.



## 1. Get an Azure AD B2C directory

Before you can use Azure AD B2C, you must create a directory, or tenant.  A directory is a container for all your users, apps, groups, and so on.  If you don't have
one already, go [create a B2C directory](active-directory-b2c-get-started.md) before moving on.

## 2. Create an application

Now you need to create an app in your B2C directory, which gives Azure AD some information that it needs to securely communicate with your app.  Both the app and web API will be represented by a single **Application ID** in this case, since they comprise one logical app.  To create an app,
follow [these instructions](active-directory-b2c-app-registration.md).  Be sure to

- Include a **web app/web api** in the application
- Enter `http://localhost:3000/auth/openid/return` as a **Reply URL** - it is the default URL for this code sample.
- Create an **Application Secret** for your application and copy it down.  You will need it shortly.
- Copy down the **Application ID** that is assigned to your app.  You will also need it shortly.

## 3. Create your policies

In Azure AD B2C, every user experience is defined by a [**policy**](active-directory-b2c-reference-policies.md).  This app contains three 
identity experiences - sign-up, sign-in, and sign-in with Facebook.  You will need to create one policy of each type, as described in the 
[policy reference article](active-directory-b2c-reference-policies.md#how-to-create-a-sign-up-policy).  When creating your three policies, be sure to:

- Choose the **Display Name** and a few other sign-up attributes in your sign-up policy.
- Choose the **Display Name** and **Object ID** application claims in every policy.  You can choose other claims as well.
- Copy down the **Name** of each policy after you create it.  It should have the prefix `b2c_1_`.  You'll need those policy names shortly. 

Once you have your three policies successfully created, you're ready to build your app.

Note that this article does not cover how to use the policies you just created.  If you want to learn about how policies work in Azure AD B2C,
you should start with the [.NET Web App getting started tutorial](active-directory-b2c-devquickstarts-web-dotnet.md).

## 4. Download the code

The code for this tutorial is maintained [on GitHub](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android).  To build the sample as you go, you can 
[download a skeleton project as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton https://github.com/AzureADQuickStarts/B2C-NativeClient-Android.git
```

> [AZURE.NOTE] **Downloading the skeleton is required for completing this tutorial.** Due to the complexity of implementing a fully functioning application on iOS, the **skeleton** has UX code that will run once you've completed the tutorial below. This is a time saving measure for the developer. The UX code is not germane to the topic of adding B2C to an iOS application.

The completed app is also [available as a .zip](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android/archive/complete.zip) or on the
`complete` branch of the same repo.


To build with Maven, you can use the pom.xml at top level


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

To download a copy of the source code, click "Download ZIP" on the right side of the page or click [here](https://github.com/AzureAD/azure-activedirectory-library-for-android/archive/v1.1.9.tar.gz).

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
    compile('com.microsoft.aad:adal:1.1.9') {
        exclude group: 'com.android.support'
    } // Recent version is 1.1.9
}
```

####Option 4: aar via Maven

If you are using the m2e plugin in Eclipse, you can specify the dependency in your pom.xml file:

```xml
<dependency>
    <groupId>com.microsoft.aad</groupId>
    <artifactId>adal</artifactId>
    <version>1.1.9</version>
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

### Step 6: Add code to call ADAL for Android

Create an instance of AuthenticationContext at your main Activity. The details of this call are beyond the scope of this README, but you can get a good start by looking at the [Android Native Client Sample](https://github.com/AzureADQuickStart/B2C-NativeClient-Android). Below is an example:

    ```Java
    // Authority is in the form of https://login.microsoftonline.com/yourtenant.onmicrosoft.com
    mContext = new AuthenticationContext(MainActivity.this, authority, true); // This will use SharedPreferences as            default cache
    ```
  * NOTE: mContext is a field in your activity

Next, copy this code block to handle the end of AuthenticationActivity after user enters credentials and receives authorization code:

    ```Java
     @Override
     protected void onActivityResult(int requestCode, int resultCode, Intent data) {
         super.onActivityResult(requestCode, resultCode, data);
         if (mContext != null) {
             mContext.onActivityResult(requestCode, resultCode, data);
         }
     }
    ```

Next, let's define our callback:

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
     mContext.acquireToken(MainActivity.this, scopes, clientId, redirect, policy, user_loginhint, PromptBehavior.Auto, "",
                    callback);
    ```

Explanation of the parameters:

  * ***Scopes*** is required and is the scopes you are trying to reqeust access for. For the B2C preview this is the same as the Clientid but will change in the future.
  * ***Clientid*** is required and comes from the AzureAD Portal.
  * You can setup redirectUri as your packagename. It is not required to be provided for the acquireToken call.
  * ***user_loginhint*** is the way we look up if the user is already in the cache and prompt the user if they are not found or the access token is invalid.
  * ***PromptBehavior*** helps to ask for credentials to skip cache and cookie.
  * ***Policy*** is the policy for while you wish to authenticate the user.
  * ***Callback*** will be called after authorization code is exchanged for a token.

  The Callback will have an object of AuthenticationResult which has accesstoken, date expired, and idtoken info.

Optional:  **acquireTokenSilent**

You can call **acquireTokenSilent** to handle caching, and token refresh. It provides sync version as well. It accepts userid as paremeter.

    ```java
     mContext.acquireTokenSilent(resource, clientid, userId, callback );
    ```

11. **Broker**:
  Microsoft Intune's Company portal app provides the broker component and may be installed on the user's device. Developers should be prepared to allow for it's use as it provides SSO across all applications on the device. ADAL for Android will use the broker account if there is one user account created in the Authenticator.

 To use the broker, the developer needs to register a special redirectUri for broker usage. RedirectUri is in the format of msauth://packagename/Base64UrlencodedSignature. You can get your redirecturi for your app using the script `brokerRedirectPrint.ps1` or use API call `mContext.getBrokerRedirectUri()`. The signature is related to your signing certificates from the Google Play store.

 A Developer can skip the broker user with:

    ```java
     AuthenticationSettings.Instance.setSkipBroker(true);
    ```
> [AZURE.WARNING] In order to reduce the complexity of this B2C Quickstart, we have opted in our sample to skip the broker. However, this is not recommended.


Your app manifest should have permissions to use AccountManager accounts: http://developer.android.com/reference/android/accounts/AccountManager.html

 * GET_ACCOUNTS
 * USE_CREDENTIALS
 * MANAGE_ACCOUNTS


### Step 7. Call the Task API

Next let's use the access token we get above to call our Task API:

```
 /**
     * Simple get request for test
     */
    class RequestTask extends AsyncTask<Void, String, String> {

        private String mUrl;

        private String mToken;

        public RequestTask(String url, String token) {
            mUrl = url;
            mToken = token;
        }

        @Override
        protected String doInBackground(Void... empty) {

            HttpClient httpclient = new DefaultHttpClient();
            HttpResponse httpResponse;
            String responseString = "";

            try {
                HttpGet getRequest = new HttpGet(mUrl);
                getRequest.addHeader(AUTHORIZATION_HEADER, AUTHORIZATION_HEADER_BEARER + mToken);
                getRequest.addHeader("Accept", "application/json");

                httpResponse = httpclient.execute(getRequest);
                StatusLine statusLine = httpResponse.getStatusLine();

                if (statusLine.getStatusCode() == HttpStatus.SC_OK) {
                    // negative for unknown
                    if (httpResponse.getEntity().getContentLength() != 0) {
                        ByteArrayOutputStream out = new ByteArrayOutputStream();
                        httpResponse.getEntity().writeTo(out);
                        out.close();
                        responseString = out.toString();
                    }
                } else {
                    // Closes the connection.
                    httpResponse.getEntity().getContent().close();
                    throw new IOException(statusLine.getReasonPhrase());
                }
            } catch (ClientProtocolException e) {
                responseString = e.getMessage();
            } catch (IOException e) {
                responseString = e.getMessage();
            }
            return responseString;
        }

        @Override
        protected void onPostExecute(String result) {
            super.onPostExecute(result);

            textViewStatus.setText("");
            if (result != null && !result.isEmpty()) {
                textViewStatus.setText(TOKEN_USED);
            }
        }
    }

}
```

Note that we add the access token to the request in the following code:

```
                getRequest.addHeader(AUTHORIZATION_HEADER, AUTHORIZATION_HEADER_BEARER + mToken);
                getRequest.addHeader("Accept", "application/json");
```



### Step 8: Run the sample app

Finally, build and run both the app in Android Studio or Eclipse.  Sign up or sign into the app, and create tasks for the signed in user.  Sign out, and sign back in as a different user, creating tasks for that user.

Notice how the tasks are stored per-user on the API, since the API extracts the user's identity from the access token it receives.

For reference, the completed sample [is provided as a .zip here](https://github.com/AzureADQuickStarts/B2C-NativeClient-Android/archive/complete.zip),
or you can clone it from GitHub:

```git clone --branch complete https://github.com/AzureADQuickStarts/B2C-NativeClient-Android```

### Next Steps

You can now move onto more advanced B2C topics.  You may want to try:

[Calling a node.js Web API from a node.js Web App >>]()

[Customizing the your B2C App's UX >>]()

### Important Information


#### Encryption

ADAL encrypts the tokens and store in SharedPreferences by default. You can look at the StorageHelper class to see the details. Android introduced AndroidKeyStore for 4.3(API18) secure storage of private keys. ADAL uses that for API18 and above. If you want to use ADAL for lower SDK versions, you need to provide secret key at AuthenticationSettings.INSTANCE.setSecretKey

#### Session cookies in Webview

Android webview does not clear session cookies after app is closed. You can handle this with sample code below:
```java
CookieSyncManager.createInstance(getApplicationContext());
CookieManager cookieManager = CookieManager.getInstance();
cookieManager.removeSessionCookie();
CookieSyncManager.getInstance().sync();
```
More about cookies: http://developer.android.com/reference/android/webkit/CookieSyncManager.html
 