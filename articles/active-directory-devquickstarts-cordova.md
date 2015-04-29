<properties
	pageTitle="Azure AD Cordova Getting Started | Microsoft Azure"
	description="How to build a Cordova application that integrates with Azure AD for sign in and calls Azure AD protected APIs using OAuth."
	services="active-directory"
	documentationCenter=""
	authors="vibronet"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="javascript"
	ms.topic="article"
	ms.date="04/28/2015"
	ms.author="vittorib"/>

# Integrate Azure AD with an Apache Cordova app
Apache Cordova makes it possible for you to develop HTML5/JavaScript applications which can run on mobile devices as full-fledged native applications.
With Azure AD, you can add enterprise grade authentication capabilities to your Cordova applications. Thanks to a Cordova plugin wrapping Azure AD's native SDKs on iOS, Android, Windows Store and Windows Phone, you can enhance your application to support sign on with your users' AD accounts, gain access to Office 365 and Azure API, and even protect calls to your own custom Web API.

In this tutorial we will use the Apache Cordova plugin for Active Directory Authentication Library (ADAL) to improve a simple app with the following features:

-	With just few lines of code, authenticate an AD user and obtain a token for calling the Azure AD Graph API.
-	Use that token to invoke the Graph API to query that directory and display the results  
-	Leverage the ADAL token cache for minimizing the authentication prompts for the user.

In order to do this, you’ll need to:

2. Register an application with Azure AD
2. Add code to your app to request tokens
3. Add code to use the token for querying the Graph API and display results.
4. Create the Cordova deployment project with all the platforms you want to target, and the Cordova ADAL plugin and test the solution in emulators.

## *0.	Prerequisites*

To complete this tutorial you will need:

- An Azure AD tenant where you have an account with app development rights
- A development environment configured to use Apache Cordova  

If you have both already set up, please proceed directly to step 1.

If you don't have an Azure AD tenant, you can find [instructions on how to get one here](active-directory-howto-tenant.md).

If you don't have Apache Cordova set up on your machine, please install the following:

- [Git](http://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [NodeJS](https://nodejs.org/download/)
- [Cordova CLI](https://cordova.apache.org/)
  (can be easily installed via NPM package manager: `npm install -g cordova`)

Note that those should work both on the PC and on the Mac.

Each target platform has different prerequisites.

- To build and run Windows Tablet/PC or Phone app version
	- [Visual Studio 2013 for Windows with Update 2 or later](http://www.visualstudio.com/downloads/download-visual-studio-vs#d-express-windows-8) (Express or another version).
- To build and run for iOS
	-   Xcode 5.x or greater. Download it at http://developer.apple.com/downloads or the [Mac App Store](http://itunes.apple.com/us/app/xcode/id497799835?mt=12)
	-   [ios-sim](https://www.npmjs.org/package/ios-sim) – allows you to launch iOS apps into the iOS Simulator from the command line (can be easily installed via the terminal: `npm install -g ios-sim`)

- To build and run application for Android
	- Install [Java Development Kit (JDK) 7](http://www.oracle.com/technetwork/java/javase/downloads/jdk7-downloads-1880260.html) or later. Make sure `JAVA_HOME` (Environment Variable) is correctly set according to JDK installation path (for example C:\Program Files\Java\jdk1.7.0_75).
	- Install [Android SDK](http://developer.android.com/sdk/installing/index.html?pkg=tools) and add `<android-sdk-location>\tools` location (for example, C:\tools\Android\android-sdk\tools) to your `PATH` Environment Variable.
	- Open Android SDK Manager (for example, via terminal: `android`) and install
    - *Android 5.0.1 (API 21)* platform SDK
    - *Android SDK Build-tools* version 19.1.0 or higher
    - *Android Support Repository* (Extras)

  Android sdk doesn't provide any default emulator instance. Create a new one by running `android avd` from terminal and then selecting *Create...* if you want to run Android app on emulator. Recommended *Api Level* is 19 or higher, see [AVD Manager] (http://developer.android.com/tools/help/avd-manager.html) for more information about Android emulator and creation options.


## *1.	Register an application with Azure AD*

Note: this step is optional. The tutorial provided pre-provisioned values that will allow you to see the sample in action without doing any provisioning in your own tenant. However it is recommended that you do perform this step and become familiar with the process, as it will be required when you will create your own applications.

Azure AD will only issue tokens to known applications. Before you can use Azure AD from your app, you need to create an entry for it in your tenant.  To register a new application in your tenant,

- Sign into the Azure Management Portal
- In the left hand nav, click on Active Directory
- Select the tenant where you wish to register the application
- Click the Applications tab, and click add in the bottom drawer.
- Follow the prompts and create a new “Native Client Application”
    - The name of the application will describe your application to end-users
    -	The “Redirect URI” is the URI used to return tokens to your app. Enter `http://MyDirectorySearcherApp`.

Once you’ve completed registration, AAD will assign your app a unique client identifier.  You’ll need this value in the next sections: you can find it in the Configure tab of the newly created app.

## *2. Clone the repositories required for the tutorial*

From your shell or command line, type the following command:

    git clone https://github.com/AzureAD/azure-activedirectory-library-for-cordova.git
    git clone -b skeleton https://github.com/AzureADQuickStarts/NativeClient-MultiTarget-Cordova.git

## *3. Create the Cordova app*

There are multiple ways of creating Cordova applications. In this tutorial we will use the Cordova command line interface (CLI).
From your shell or command line, type the following command:


     cordova create DirSearchClient --copy-from="NativeClient-MultiTarget-Cordova/DirSearchClient"

That will create the folder structure and scaffolding for the Cordova project, copying the content of the starter project in the www subfolder.
Move to the new DirSearchClient folder.

    cd .\DirSearchClient

Add the whitelist plugin, necessary for invoking the Graph API.

     cordova plugin add https://github.com/apache/cordova-plugin-whitelist.git

Next, add all of the platforms you want to support. In order to have a working sample, you will need to execute at least one of the commands below. Note that you will not be able to emulate iOS on Windows, or Windows/Windows Phone on a Mac.

    cordova platform add android@97718a0a25ec50fedf7b023ae63bfcffbcfafb4b
    cordova platform add ios
    cordova platform add windows

Finally, you can add the ADAL for Cordova plugin to your project.

    cordova plugin add ../azure-activedirectory-library-for-cordova

## *3. Add code to authenticate users and obtain tokens from AAD*

The application you are developing in this tutorial will provide a bare-bone directory search feature, where the end user can type the alias of any user in the directory and visualize some basic attributes.  The starter project contains the definition of the basic user interface of the app (in www/index.html) and the scaffolding that wires up basic app event cycles, user interface bindings and results display logic (in www/js/index.js). The only thing left out for you is to add the logic implementing identity tasks.

The very first thing you need to do is to introduce in your code the protocol values that are used by AAD for identifying your app and the resources you target. Those values will be used to construct the token requests later on. Insert the snippet below at the very top of the index.js file.

```javascript
    var authority = "https://login.windows.net/common",
    redirectUri = "http://MyDirectorySearcherApp",
    resourceUri = "https://graph.windows.net",
    clientId = "a5d92493-ae5a-4a9f-bcbf-9f1d354067d3",
    graphApiVersion = "2013-11-08";
```

The `redirectUri` and `clientId` values should match the values describing your app in AAD. You can find those from the Configure tab in the Azure portal, as described in step 1 earlier in this tutorial.
Note: if you opted for not registering a new app in your own tenant, you can simply paste the pre-configured values above as is - that will allow you to see the sample running, though you should always create your own entry for your apps meant for production.

Next, we need to add the actual token request code. Insert the following snippet between the `search `and `renderdata `definitions.

```javascript
    // Shows user authentication dialog if required.
    authenticate: function (authCompletedCallback) {

        app.context = new Microsoft.ADAL.AuthenticationContext(authority);
        app.context.tokenCache.readItems().then(function (items) {
            if (items.length > 0) {
                authority = items[0].authority;
                app.context = new Microsoft.ADAL.AuthenticationContext(authority);
            }
            // Attempt to authorize user silently
            app.context.acquireTokenSilentAsync(resourceUri, clientId)
            .then(authCompletedCallback, function () {
                // We require user cridentials so triggers authentication dialog
                app.context.acquireTokenAsync(resourceUri, clientId, redirectUri)
                .then(authCompletedCallback, function (err) {
                    app.error("Failed to authenticate: " + err);
                });
            });
        });

    },
```
Let's examine that function by breaking it down in its two main parts.
This sample is designed to work with any tenant, as opposed to be tied to a particular one. It uses the "/common" endpoint, which allows the user to enter any account at authentication time and directs the request to the tenant it belongs.
This first part of the method inspects the ADAL cache to see if there is already a stored token - and if there is, it uses the tenants it came from for re-initializing ADAL. This is necessary to avoid extra prompts, as the use of "/common" always results in asking the user to enter a new account.
```javascript
        app.context = new Microsoft.ADAL.AuthenticationContext(authority);
        app.context.tokenCache.readItems().then(function (items) {
            if (items.length > 0) {
                authority = items[0].authority;
                app.context = new Microsoft.ADAL.AuthenticationContext(authority);
            }
```
The second part of the method performs the proper tokewn request.
The `acquireTokenSilentAsync` method asks to ADAL to return a token for the specified resource without showing any UX. That can happen if the cache already has a suitable access token stored, or if there is a refresh token that can be used to get a new access token without shwoing any prompt.
If that attempt fails, we fall back on `acquireTokenAsync` - which will visibly prompt the user to authenticate.
```javascript
            // Attempt to authorize user silently
            app.context.acquireTokenSilentAsync(resourceUri, clientId)
            .then(authCompletedCallback, function () {
                // We require user cridentials so triggers authentication dialog
                app.context.acquireTokenAsync(resourceUri, clientId, redirectUri)
                .then(authCompletedCallback, function (err) {
                    app.error("Failed to authenticate: " + err);
                });
            });
```
Now that we have the token, we can finally invoke the Graph API and perform the search query we want. Insert the following snippet right below the `authenticate` definition.

```javascript
// Makes Api call to receive user list.
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
The starting point files supplied a barebone UX for entering a user's alias in a textbox. This method uses that value to construct a query, combine it with the access token, send it to the Graph, and parse the results. The renderData method, already present in the starting point file, takes care to visualize the results.

## *4. Run*
Your app is finally ready to run! Operating it is very simple: once the app starts, enter in the text box the alias of the user you want to look up - then click the button. You will be prompted for authentication. Upon successful authentication and successful search, the attributes of the searched user will be displayed. Subsequent runs will perform the search without showing any prompt, thanks to the presence in cache of the token previously acquired.
The concrete steps for running the app vary by platform.


##### To build and run Windows Tablet/PC application version

   `cordova run windows`

   __Note__: During first run you may be asked to sign in for a developer license. See [Developer license]( https://msdn.microsoft.com/library/windows/apps/hh974578.aspx) for more details.


##### To build and run application on Windows Phone 8.1

   To run on connected device: `cordova run windows --device -- --phone`

   To run on default emulator: `cordova emulate windows -- --phone`

   Use `cordova run windows --list -- --phone` to see all available targets and `cordova run windows --target=<target_name> -- --phone` to run application on specific device or emulator (for example,  `cordova run windows --target="Emulator 8.1 720P 4.7 inch" -- --phone`).
##### To build and run on Android device

   To run on connected device: `cordova run android --device`

   To run on default emulator: `cordova emulate android`

   __Note__: Make sure you've created emulator instance using *AVD Manager* as it is showed in *Prerequisites* section.

   Use `cordova run android --list` to see all available targets and `cordova run android --target=<target_name>` to run application on specific device or emulator (for example,  `cordova run android --target="Nexus4_emulator"`).

##### To build and run on iOS device

   To run on connected device: `cordova run ios --device`

   To run on default emulator: `cordova emulate ios`

   __Note__: Make sure you have `ios-sim` package installed to run on emulator. See *Prerequisites* section for more details.

    Use `cordova run ios --list` to see all available targets and `cordova run ios --target=<target_name>` to run application on specific device or emulator (for example,  `cordova run android --target="iPhone-6"`).

Use `cordova run --help` to see additional build and run options.

For reference, the completed sample (without your configuration values) is provided here.  You can now move on to more advanced (ok, and more interesting) scenarios.  You may want to try:

[Secure a Node.js Web API with Azure AD >>](active-directory-devquickstarts-webapi-nodejs.md)

For additional resources, check out:
- [AzureADSamples on GitHub >>](https://github.com/AzureAdSamples)
- [CloudIdentity.com >>](https://cloudidentity.com)
- Azure AD documentation on [Azure.com >>](http://azure.microsoft.com/documentation/services/active-directory/)
