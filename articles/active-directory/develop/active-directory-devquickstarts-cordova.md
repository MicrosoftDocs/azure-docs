---
title: Azure AD Cordova Getting Started | Microsoft Docs
description: How to build a Cordova application that integrates with Azure AD for sign-in and calls Azure AD-protected APIs by using OAuth.
services: active-directory
documentationcenter: ''
author: vibronet
manager: mbaldwin
editor: ''

ms.assetid: b1a8d7bd-7ad6-44d5-8ccb-5255bb623345
ms.service: active-directory
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: javascript
ms.topic: article
ms.date: 01/07/2017
ms.author: vittorib
ms.custom: aaddev

---
# Integrate Azure AD with an Apache Cordova app
[!INCLUDE [active-directory-devquickstarts-switcher](../../../includes/active-directory-devquickstarts-switcher.md)]

[!INCLUDE [active-directory-devguide](../../../includes/active-directory-devguide.md)]

You can use Apache Cordova to develop HTML5/JavaScript applications that can run on mobile devices as full-fledged native applications. With Azure Active Directory (Azure AD), you can add enterprise-grade authentication capabilities to your Cordova applications.

A Cordova plug-in wraps Azure AD native SDKs on iOS, Android, Windows Store, and Windows Phone. By using that plug-in, you can enhance your application to support sign-in with your users' Windows Server Active Directory accounts, gain access to Office 365 and Azure APIs, and even help protect calls to your own custom web API.

In this tutorial, we'll use the Apache Cordova plug-in for Active Directory Authentication Library (ADAL) to improve a simple app by adding the following features:

* With just a few lines of code, authenticate a user and obtain a token.
* Use that token to invoke the Graph API to query that directory and display the results.  
* Use the ADAL token cache to minimize authentication prompts for the user.

To make those improvements, you need to:

1. Register an application with Azure AD.
2. Add code to your app to request tokens.
3. Add code to use the token for querying the Graph API and display results.
4. Create the Cordova deployment project with all the platforms you want to target, add the Cordova ADAL plug-in, and test the solution in emulators.

## Prerequisites
To complete this tutorial, you need:

* An Azure AD tenant where you have an account with app development rights.
* A development environment that's configured to use Apache Cordova.  

If you have both already set up, proceed directly to step 1.

If you don't have an Azure AD tenant, use the [instructions on how to get one](active-directory-howto-tenant.md).

If you don't have Apache Cordova set up on your machine, install the following:

* [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
* [Node.js](https://nodejs.org/download/)
* [Cordova CLI](https://cordova.apache.org/)
  (can be easily installed via NPM package manager: `npm install -g cordova`)

The preceding installations should work both on the PC and on the Mac.

Each target platform has different prerequisites:

* To build and run an app for Windows Tablet/PC or Windows Phone:
  * Install [Visual Studio 2013 for Windows with Update 2 or later](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-8) (Express or another version) or [Visual Studio 2015](https://www.visualstudio.com/downloads/download-visual-studio-vs#d-community).

* To build and run an app for iOS:

  * Install Xcode 6.x or later. Download it from the [Apple Developer site](http://developer.apple.com/downloads) or the [Mac App Store](http://itunes.apple.com/us/app/xcode/id497799835?mt=12).
  * Install [ios-sim](https://www.npmjs.org/package/ios-sim). You can use it to start iOS apps in iOS Simulator from the command line. (You can easily install it via the terminal: `npm install -g ios-sim`.)
* To build and run an app for Android:

  * Install [Java Development Kit (JDK) 7](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) or later. Make sure `JAVA_HOME` (environment variable) is correctly set according to the JDK installation path (for example, C:\Program Files\Java\jdk1.7.0_75).
  * Install [Android SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools) and add the `<android-sdk-location>\tools` location (for example, C:\tools\Android\android-sdk\tools) to your `PATH` environment variable.
  * Open Android SDK Manager (for example, via the terminal: `android`) and install:
    * *Android 5.0.1 (API 21)* platform SDK
    * *Android SDK Build Tools* version 19.1.0 or later
    * *Android Support Repository* (Extras)

  The Android SDK doesn't provide any default emulator instance. Create one by running `android avd` from the terminal and then selecting **Create**, if you want to run the Android app on an emulator. We recommend an API level of 19 or higher. For more information about the Android emulator and creation options, see [AVD Manager](http://developer.android.com/tools/help/avd-manager.html) on the Android site.

## Step 1: Register an application with Azure AD
This step is optional. This tutorial provides pre-provisioned values that you can use to see the sample in action without doing any provisioning in your own tenant. However, we recommend that you do perform this step and become familiar with the process, because it will be required when you create your own applications.

Azure AD issues tokens to only known applications. Before you can use Azure AD from your app, you need to create an entry for it in your tenant. To register a new application in your tenant:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. On the top bar, click your account. In the **Directory** list, choose the Azure AD tenant where you want to register your application.
3. Click **More Services** in the left pane, and then select **Azure Active Directory**.
4. Click **App registrations**, and then select **Add**.
5. Follow the prompts and create a **Native Client Application**. (Although Cordova apps are HTML based, we're creating a native client application here. The **Native Client Application** option must be selected, or the application won't work.)
  * **Name** describes your application to users.
  * **Redirect URI** is the URI that's used to return tokens to your app. Enter **http://MyDirectorySearcherApp**.

After you finish registration, Azure AD assigns a unique application ID to your app. You’ll need this value in the next sections. You can find it on the application tab of the newly created app.

To run `DirSearchClient Sample`, grant the newly created app permission to query the Azure AD Graph API:

1. From the **Settings** page, select **Required Permissions**, and then select **Add**.  
2. For the Azure Active Directory application, select **Microsoft Graph** as the API and add the **Access the directory as the signed-in user** permission under **Delegated Permissions**.  This enables your application to query the Graph API for users.

## Step 2: Clone the sample app repository
From your shell or command line, type the following command:

    git clone -b skeleton https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-Cordova.git

## Step 3: Create the Cordova app
There are multiple ways to create Cordova applications. In this tutorial, we'll use the Cordova command-line interface (CLI).

1. From your shell or command line, type the following command:

        cordova create DirSearchClient

   That command creates the folder structure and scaffolding for the Cordova project.

2. Move to the new DirSearchClient folder:

        cd .\DirSearchClient

3. Copy the content of the starter project in the www subfolder by using a file manager or the following command in your shell:

  * Windows: `xcopy ..\NativeClient-MultiTarget-Cordova\DirSearchClient www /E /Y`
  * Mac: `cp -r  ../NativeClient-MultiTarget-Cordova/DirSearchClient/* www`

4. Add the whitelist plug-in. This is necessary for invoking the Graph API.

        cordova plugin add cordova-plugin-whitelist

5. Add all the platforms that you want to support. To have a working sample, you need to execute at least one of the following commands. Note that you won't be able to emulate iOS on Windows or emulate Windows on a Mac.

        cordova platform add android
        cordova platform add ios
        cordova platform add windows

6. Add the ADAL for Cordova plug-in to your project:

        cordova plugin add cordova-plugin-ms-adal

## Step 4: Add code to authenticate users and obtain tokens from Azure AD
The application that you're developing in this tutorial will provide a simple directory search feature. The user can then type the alias of any user in the directory and visualize some basic attributes. The starter project contains the definition of the basic user interface of the app (in www/index.html) and the scaffolding that wires up basic app event cycles, user interface bindings, and results display logic (in www/js/index.js). The only task left for you is to add the logic that implements identity tasks.

The first thing you need to do in your code is introduce the protocol values that Azure AD uses for identifying your app and the resources that you target. Those values will be used to construct the token requests later on. Insert the following snippet at the top of the index.js file:

```javascript
var authority = "https://login.microsoftonline.com/common",
    redirectUri = "http://MyDirectorySearcherApp",
    resourceUri = "https://graph.windows.net",
    clientId = "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3",
    graphApiVersion = "2013-11-08";
```

The `redirectUri` and `clientId` values should match the values that describe your app in Azure AD. You can find those from the **Configure** tab in the Azure portal, as described in step 1 earlier in this tutorial.

> [!NOTE]
> If you opted for not registering a new app in your own tenant, you can simply paste the preconfigured values as is. You can then see the sample running, though you should always create your own entry for your apps that are meant for production.

Next, add the token request code. Insert the following snippet between the `search` and `renderData` definitions:

```javascript
    // Shows the user authentication dialog box if required
    authenticate: function (authCompletedCallback) {

        app.context = new Microsoft.ADAL.AuthenticationContext(authority);
        app.context.tokenCache.readItems().then(function (items) {
            if (items.length > 0) {
                authority = items[0].authority;
                app.context = new Microsoft.ADAL.AuthenticationContext(authority);
            }
            // Attempt to authorize the user silently
            app.context.acquireTokenSilentAsync(resourceUri, clientId)
            .then(authCompletedCallback, function () {
                // We require user credentials, so this triggers the authentication dialog box
                app.context.acquireTokenAsync(resourceUri, clientId, redirectUri)
                .then(authCompletedCallback, function (err) {
                    app.error("Failed to authenticate: " + err);
                });
            });
        });

    },
```
Let's examine that function by breaking it down in its two main parts.
This sample is designed to work with any tenant, as opposed to being tied to a particular one. It uses the "/common" endpoint, which allows the user to enter any account at authentication time and directs the request to the tenant where it belongs.

This first part of the method inspects the ADAL cache to see if a token is already stored. If so, the method uses the tenants where the token came from for reinitializing ADAL. This is necessary to avoid extra prompts, because the use of "/common" always results in asking the user to enter a new account.

```javascript
        app.context = new Microsoft.ADAL.AuthenticationContext(authority);
        app.context.tokenCache.readItems().then(function (items) {
            if (items.length > 0) {
                authority = items[0].authority;
                app.context = new Microsoft.ADAL.AuthenticationContext(authority);
            }
```
The second part of the method performs the proper token request. The `acquireTokenSilentAsync` method asks ADAL to return a token for the specified resource without showing any UX. That can happen if the cache already has a suitable access token stored, or if a refresh token can be used to get a new access token without showing any prompt. If that attempt fails, we fall back on `acquireTokenAsync`--which will visibly prompt the user to authenticate.

```javascript
            // Attempt to authorize the user silently
            app.context.acquireTokenSilentAsync(resourceUri, clientId)
            .then(authCompletedCallback, function () {
                // We require user credentials, so this triggers the authentication dialog box
                app.context.acquireTokenAsync(resourceUri, clientId, redirectUri)
                .then(authCompletedCallback, function (err) {
                    app.error("Failed to authenticate: " + err);
                });
            });
```
Now that we have the token, we can finally invoke the Graph API and perform the search query that we want. Insert the following snippet below the `authenticate` definition:

```javascript
// Makes an API call to receive the user list
    requestData: function (authResult, searchText) {
        var req = new XMLHttpRequest();
        var url = resourceUri + "/" + authResult.tenantId + "/users?api-version=" + graphApiVersion;
        url = searchText ? url + "&$filter=mailNickname eq '" + searchText + "'" : url + "&$top=10";

        req.open("GET", url, true);
        req.setRequestHeader('Authorization', 'Bearer ' + authResult.accessToken);

        req.onload = function(e) {
            if (e.target.status >= 200 && e.target.status < 300) {
                app.renderData(JSON.parse(e.target.response));
                return;
            }
            app.error('Data request failed: ' + e.target.response);
        };
        req.onerror = function(e) {
            app.error('Data request failed: ' + e.error);
        }

        req.send();
    },

```
The starting-point files supplied a simple UX for entering a user's alias in a text box. This method uses that value to construct a query, combine it with the access token, send it to Microsoft Graph, and parse the results. The `renderData` method, already present in the starting-point file, takes care of visualizing the results.

## Step 5: Run the app
Your app is finally ready to run. Operating it is simple: when the app starts, enter the alias of the user you want to look up, and then click the button. You're prompted for authentication. Upon successful authentication and successful search, the attributes of the searched user are displayed.

Subsequent runs will perform the search without showing any prompt, thanks to the presence of the previously acquired token in cache.

The concrete steps for running the app vary by platform.

### Windows 10
   Tablet/PC: `cordova run windows --archs=x64 -- --appx=uap`

   Mobile (requires a Windows 10 Mobile device connected to a PC): `cordova run windows --archs=arm -- --appx=uap --phone`

   > [!NOTE]
   > During the first run, you might be asked to sign in for a developer license. For more information, see [Developer license](https://msdn.microsoft.com/library/windows/apps/hh974578.aspx).

### Windows 8.1 Tablet/PC
   `cordova run windows`

   > [!NOTE]
   > During the first run, you might be asked to sign in for a developer license. For more information, see [Developer license](https://msdn.microsoft.com/library/windows/apps/hh974578.aspx).

### Windows Phone 8.1
   To run on a connected device: `cordova run windows --device -- --phone`

   To run on the default emulator: `cordova emulate windows -- --phone`

   Use `cordova run windows --list -- --phone` to see all available targets and `cordova run windows --target=<target_name> -- --phone` to run the application on a specific device or emulator (for example, `cordova run windows --target="Emulator 8.1 720P 4.7 inch" -- --phone`).

### Android
   To run on a connected device: `cordova run android --device`

   To run on the default emulator: `cordova emulate android`

   Make sure you've created an emulator instance by using AVD Manager, as described earlier in the "Prerequisites" section.

   Use `cordova run android --list` to see all available targets and `cordova run android --target=<target_name>` to run the application on a specific device or emulator (for example, `cordova run android --target="Nexus4_emulator"`).

### iOS
   To run on a connected device: `cordova run ios --device`

   To run on the default emulator: `cordova emulate ios`

   > [!NOTE]
   > Make sure you have the `ios-sim` package installed to run on the emulator. For more information, see the "Prerequisites" section.

    Use `cordova run ios --list` to see all available targets and `cordova run ios --target=<target_name>` to run the application on specific device or emulator (for example, `cordova run android --target="iPhone-6"`).

    Use `cordova run --help` to see additional build and run options.

## Next steps
For reference, the completed sample (without your configuration values) is available in [GitHub](https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-Cordova/tree/complete/DirSearchClient).

You can now move on to more advanced (and more interesting) scenarios. You might want to try: [Secure a Node.js Web API with Azure AD](active-directory-devquickstarts-webapi-nodejs.md).

[!INCLUDE [active-directory-devquickstarts-additional-resources](../../../includes/active-directory-devquickstarts-additional-resources.md)]
