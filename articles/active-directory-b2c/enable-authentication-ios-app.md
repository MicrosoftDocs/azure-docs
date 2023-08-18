---
title: Enable authentication in an iOS Swift app by using Azure AD B2C
description:  This article discusses how to enable authentication in an iOS Swift application by using Azure Active Directory B2C building blocks. Learn how to use Azure AD B2C to sign in and sign up users in an iOS Swift application.
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG
ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 03/24/2023
ms.author: kengaderdus
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Enable authentication in your own iOS Swift app by using Azure AD B2C

This article shows you how to add Azure Active Directory B2C (Azure AD B2C) authentication to your own iOS Swift mobile application. Learn how to integrate an iOS Swift application with the [Microsoft Authentication Library (MSAL) for iOS](https://github.com/AzureAD/microsoft-authentication-library-for-objc). 

Use this article with [Configure authentication in a sample iOS Swift application](./configure-authentication-sample-ios-app.md), substituting the sample iOS Swift app with your own iOS Swift app. After you've completed the instructions in this article, your application will accept sign-ins via Azure AD B2C.

## Prerequisites

Review the prerequisites and integration instructions in [Configure authentication in a sample iOS Swift app by using Azure AD B2C](configure-authentication-sample-ios-app.md).

## Create an iOS Swift app project

If you don't already have an iOS Swift application, set up a new project by doing the following steps:

1. Open [Xcode](https://developer.apple.com/xcode/), and then select **File** > **New** > **Project**.
1. For iOS apps, select **iOS** > **App**, and then select **Next**.
1. For **Choose options for your new project**, provide the following:
    1. **Product name**, such as `MSALiOS`.
    1. **Organization identifier**, such as `contoso.com`.
    1. For the **Interface**, select **Storyboard**.
    1. For the **Life cycle**, select **UIKit App Delegate**.
    1. For the **Language**, select **Swift**. 
1. Select **Next**.
1. Select a folder in which to create your app, and then select **Create**.


## Step 1: Install the MSAL library

1. Use [CocoaPods](https://cocoapods.org/) to install the MSAL library. In the same folder as your project's *.xcodeproj* file, if the *podfile* file doesn't exist, create an empty file and name it *podfile*. Add the following code to the *podfile* file:

   ```
   use_frameworks!

   target '<your-target-here>' do
      pod 'MSAL'
   end
   ```

1. Replace `<your-target-here>` with the name of your project (for example, `MSALiOS`). For more information, see [Podfile Syntax Reference](https://guides.cocoapods.org/syntax/podfile.html#podfile).
1. In a terminal window, go to the folder that contains the *podfile* file, and then run *pod install* to install the MSAL library.
1. After you run the `pod install` command, a *\<your project name>.xcworkspace* file is created. To reload the project in Xcode, close Xcode, and then open the *\<your project name>.xcworkspace* file.

## Step 2: Set the app URL scheme

When users authenticate, Azure AD B2C sends an authorization code to the app by using the redirect URI configured on the Azure AD B2C application registration. 

The MSAL default redirect URI format is `msauth.[Your_Bundle_Id]://auth`. An example would be `msauth.com.microsoft.identitysample.MSALiOS://auth`, where `msauth.com.microsoft.identitysample.MSALiOS` is the URL scheme.

In this step, register your URL scheme by using the `CFBundleURLSchemes` array. Your application listens on the URL scheme for the callback from Azure AD B2C. 

In Xcode, open the [*Info.plist* file](https://developer.apple.com/library/archive/documentation/General/Reference/InfoPlistKeyReference/Introduction/Introduction.html) as a source code file. In the `<dict>` section, add the following XML snippet: 

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>msauth.com.microsoft.identitysample.MSALiOS</string>
        </array>
    </dict>
</array>
<key>LSApplicationQueriesSchemes</key>
<array>
    <string>msauthv2</string>
    <string>msauthv3</string>
</array>
```

## Step 3: Add the authentication code

The [sample code](configure-authentication-sample-ios-app.md#step-4-get-the-ios-mobile-app-sample) is made up of a `UIViewController` class. The class:

- Defines the structure for a user interface.
- Contains information about your Azure AD B2C identity provider. The app uses this information to establish a trust relationship with Azure AD B2C. 
- Contains the authentication code to authenticate users, acquire tokens, and validate them.

Choose a `UIViewController` where users authenticate.  In your `UIViewController`, merge the code with the [code that's provided in GitHub](https://github.com/Azure-Samples/active-directory-b2c-ios-swift-native-msal/blob/vNext/MSALiOS/ViewController.swift). 

## Step 4: Configure your iOS Swift app

After you [add the authentication code](#step-3-add-the-authentication-code), configure your iOS Swift app with your Azure AD B2C settings. Azure AD B2C identity provider settings are configured in the `UIViewController` class that was chosen in the previous section. 

To learn how to configure your iOS Swift app, see [Configure authentication in a sample iOS Swift app by using Azure AD B2C](configure-authentication-sample-ios-app.md#step-5-configure-the-sample-mobile-app).

## Step 5: Run and test the mobile app

1. Build and run the project with a [simulator of a connected iOS device](https://developer.apple.com/documentation/xcode/running-your-app-in-simulator-or-on-a-device).
1. Select **Sign In**, and then sign up or sign in with your Azure AD B2C local or social account.
1. After you've authenticated successfully, you'll see your display name in the navigation bar.

## Step 6: Customize your code building blocks

This section describes the code building blocks that enable authentication for your iOS Swift app. It lists the UIViewController's methods and discusses how to customize your code. 

### Step 6.1: Instantiate a public client application

Public client applications aren't trusted to safely keep application secrets, and they don't have client secrets. In [viewDidLoad](https://developer.apple.com/documentation/uikit/uiviewcontroller/1621495-viewdidload), instantiate an MSAL by using a public client application object.

The following Swift code snippet demonstrates how to initialize the MSAL with a `MSALPublicClientApplicationConfig` configuration object. 

The configuration object provides information about your Azure AD B2C environment. For example, it provides the client ID, redirect URI, and authority to build authentication requests to Azure AD B2C. For information about the configuration object, see [Configure the sample mobile app](configure-authentication-sample-ios-app.md#step-5-configure-the-sample-mobile-app).

```swift
do {

    let signinPolicyAuthority = try self.getAuthority(forPolicy: self.kSignupOrSigninPolicy)
    let editProfileAuthority = try self.getAuthority(forPolicy: self.kEditProfilePolicy)
    
    let pcaConfig = MSALPublicClientApplicationConfig(clientId: kClientID, redirectUri: kRedirectUri, authority: signinPolicyAuthority)
    pcaConfig.knownAuthorities = [signinPolicyAuthority, editProfileAuthority]
    
    self.applicationContext = try MSALPublicClientApplication(configuration: pcaConfig)
    self.initWebViewParams()
    
    } catch {
        self.updateLoggingText(text: "Unable to create application \(error)")
    }
```

The `initWebViewParams` method configures the [interactive authentication](../active-directory/develop/customize-webviews.md) experience. 

The following Swift code snippet initializes the `webViewParameters` class member with the system web view. For more information, see [Customize browsers and WebViews for iOS/macOS](../active-directory/develop/customize-webviews.md).

```swift
func initWebViewParams() {
    self.webViewParameters = MSALWebviewParameters(authPresentationViewController: self)
    self.webViewParameters?.webviewType = .default
}
```

### Step 6.2: Start an interactive authorization request

An interactive authorization request is a flow where users are prompted to sign up or sign in by using the system web view. When users select the **Sign In** button, the `authorizationButton` method is called.

The `authorizationButton` method prepares the `MSALInteractiveTokenParameters` object with relevant data about the authorization request. The `acquireToken` method uses the  `MSALInteractiveTokenParameters` to authenticate users via the system web view.

The following code snippet demonstrates how to start the interactive authorization request: 

```swift
let parameters = MSALInteractiveTokenParameters(scopes: kScopes, webviewParameters: self.webViewParameters!)
parameters.promptType = .selectAccount
parameters.authority = authority

applicationContext.acquireToken(with: parameters) { (result, error) in

// On error code    
guard let result = result else {
    self.updateLoggingText(text: "Could not acquire token: \(error ?? "No error information" as! Error)")
    return
}

// On success code
self.accessToken = result.accessToken
self.updateLoggingText(text: "Access token is \(self.accessToken ?? "Empty")")
}
```
 
After users finish the authorization flow, either successfully or unsuccessfully, the result is returned to the [closure](https://docs.swift.org/swift-book/LanguageGuide/Closures.html) of the `acquireToken` method. 

The `acquireToken` method returns the `result` and `error` objects. Use this closure to:

- Update the mobile app UI with information after the authentication is completed.
- Call a web API service with an access token.
- Handle authentication errors (for example, when a user cancels the sign-in flow).
 
### Step 6.3: Call a web API

To call a [token-based authorization web API](enable-authentication-web-api.md), the app needs a valid access token. The app does the following:

1. Acquires an access token with the required permissions (scopes) for the web API endpoint.
1. Passes the access token as a bearer token in the authorization header of the HTTP request by using this format:

```http
Authorization: Bearer <access-token>
```

When users [authenticate interactively](#step-62-start-an-interactive-authorization-request), the app gets an access token in the `acquireToken` closure. For subsequent web API calls, use the acquire token silent (`acquireTokenSilent`) method, as described in this section. 

The `acquireTokenSilent` method does the following actions:

1. It attempts to fetch an access token with the requested scopes from the token cache. If the token is present and hasn't expired, the token is returned. 
1. If the token isn't present in the token cache or it has expired, the MSAL library attempts to use the refresh token to acquire a new access token. 
1. If the refresh token doesn't exist or has expired, an exception is returned. In this case, you should prompt the user to [sign in interactively](#step-62-start-an-interactive-authorization-request).  

The following code snippet demonstrates how to acquire an access token:

```swift
do {

// Get the authority using the sign-in or sign-up user flow
let authority = try self.getAuthority(forPolicy: self.kSignupOrSigninPolicy)

// Get the current account from the application context
guard let thisAccount = try self.getAccountByPolicy(withAccounts: applicationContext.allAccounts(), policy: kSignupOrSigninPolicy) else {
    self.updateLoggingText(text: "There is no account available!")
    return
}

// Configure the acquire token silent parameters
let parameters = MSALSilentTokenParameters(scopes: kScopes, account:thisAccount)
parameters.authority = authority
parameters.loginHint = "username"

// Acquire token silent
self.applicationContext.acquireTokenSilent(with: parameters) { (result, error) in
    if let error = error {
        
        let nsError = error as NSError
        
        // interactionRequired means we need to ask the user to sign in. This usually happens
        // when the user's Refresh Token is expired or if the user has changed their password
        // among other possible reasons.
        
        if (nsError.domain == MSALErrorDomain) {
            
            if (nsError.code == MSALError.interactionRequired.rawValue) {
                
                // Start an interactive authorization code
                // Notice we supply the account here. This ensures we acquire token for the same account
                // as we originally authenticated.
                
                ...
            }
        }
        
        self.updateLoggingText(text: "Could not acquire token: \(error)")
        return
    }
    
    guard let result = result else {
        
        self.updateLoggingText(text: "Could not acquire token: No result returned")
        return
    }
    
    // On success, set the access token to the accessToken class member. 
    // The callGraphAPI method uses the access token to call a web API  
    self.accessToken = result.accessToken
    ...
}
} catch {
self.updateLoggingText(text: "Unable to construct parameters before calling acquire token \(error)")
}
```

The `callGraphAPI` method retrieves the access token and calls the web API, as shown here:

```swift
@objc func callGraphAPI(_ sender: UIButton) {
    guard let accessToken = self.accessToken else {
        self.updateLoggingText(text: "Operation failed because could not find an access token!")
        return
    }
    
    let sessionConfig = URLSessionConfiguration.default
    sessionConfig.timeoutIntervalForRequest = 30
    let url = URL(string: self.kGraphURI)
    var request = URLRequest(url: url!)
    request.setValue("Bearer \(accessToken)", forHTTPHeaderField: "Authorization")
    let urlSession = URLSession(configuration: sessionConfig, delegate: self, delegateQueue: OperationQueue.main)
    
    self.updateLoggingText(text: "Calling the API....")
    
    urlSession.dataTask(with: request) { data, response, error in
        guard let validData = data else {
            self.updateLoggingText(text: "Could not call API: \(error ?? "No error information" as! Error)")
            return
        }
        
        let result = try? JSONSerialization.jsonObject(with: validData, options: [])
        
        guard let validResult = result as? [String: Any] else {
            self.updateLoggingText(text: "Nothing returned from API")
            return
        }
        
        self.updateLoggingText(text: "API response: \(validResult.debugDescription)")
        }.resume()
}
```

### Step 6.4: Sign out users

Signing out with MSAL removes all known information about users from the application. Use the sign-out method to sign out users and update the UI. For example, you can hide protected UI elements, hide the sign-out button, or show the sign-in button.

The following code snippet demonstrates how to sign out users:

```swift
@objc func signoutButton(_ sender: UIButton) {
do {
    
    
    let thisAccount = try self.getAccountByPolicy(withAccounts: applicationContext.allAccounts(), policy: kSignupOrSigninPolicy)
    
    if let accountToRemove = thisAccount {
        try applicationContext.remove(accountToRemove)
    } else {
        self.updateLoggingText(text: "There is no account to signing out!")
    }
    
    ...
    
} catch  {
    self.updateLoggingText(text: "Received error signing out: \(error)")
}
}
```

## Next steps

Learn how to:
* [Configure authentication options in an iOS Swift app by using Azure AD B2C](enable-authentication-ios-app-options.md)
* [Enable authentication in your own web API by using Azure AD B2C](enable-authentication-web-api.md)
