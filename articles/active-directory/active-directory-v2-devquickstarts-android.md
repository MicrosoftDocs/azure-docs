<properties
	pageTitle="Azure AD v2.0 Android App | Microsoft Azure"
	description="How to build an Android app that signs users in with both personal Microsoft Account and work or school accounts and calls the Graph API using third party libraries."
	services="active-directory"
	documentationCenter=""
	authors="brandwe"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/31/2016"
	ms.author="brandwe"/>

#  Add sign-in to an Android app using a third party library with Graph API using the v2.0 endpoint

The microsoft identity platform uses open standards such as OAuth2 and OpenID Connect. This allows developers to leverage any library they wish to integrate with our services. To aid developers in using our platform with other libraries we've written a few walkthroughs like this one to demonstate how to configure third party libraries to connect to the microsoft identity platform. Most libraries that implement [the RFC6749 OAuth2 spec](https://tools.ietf.org/html/rfc6749) will be able to connect to the Microsoft Identity platform.

This application will allow a user to sign-in to their organization and then search for yourself in your organization using the Graph API.


> [AZURE.NOTE]
	Some features of our platform that do have an expression in these standards, such as Conditional Access and Intune policy management, require you to use our open source Microsoft Azure Identity Libraries. 


> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by the v2.0 endpoint.  To determine if you should use the v2.0 endpoint, read about [v2.0 limitations](active-directory-v2-limitations.md).


## Download
The code for this tutorial is maintained [on GitHub](git@github.com:Azure-Samples/active-directory-android-native-oidcandroidlib-v2.git).  To follow along, you can [download the app's skeleton as a .zip](git@github.com:Azure-Samples/active-directory-android-native-oidcandroidlib-v2.git/archive/skeleton.zip) or clone the skeleton:

```
git clone --branch skeleton git@github.com:Azure-Samples/active-directory-android-native-oidcandroidlib-v2.git
```

Or just download and get started right away:

```
git@github.com:Azure-Samples/active-directory-android-native-oidcandroidlib-v2.git
```

## Register an app
Create a new app at [apps.dev.microsoft.com](https://apps.dev.microsoft.com), or follow these [detailed steps](active-directory-v2-app-registration.md).  Make sure to:

- Copy down the **Application Id** assigned to your app, you'll need it soon.
- Add the **Mobile** platform for your app.
- Copy down the **Redirect URI** from the portal. You must use the default value of `https://login.microsoftonline.com/common/oauth2/nativeclient`.


## Download the third party library nxoauth2 and launch a workspace

For this walkthrough we will use the OIDCAndroidLib from GitHub, an OAuth2 library based on Google's OpenID Connect code. It implements the native application profile and supports the end-user authorization endpoint. These are all the things we'll need in order to integrat with the Microsoft identity platform.

*  Clone

Start by cloning the OIDCAndroidLib repo down to your computer. 

```
git@github.com:kalemontes/OIDCAndroidLib.git
```

<img src="https://help.github.com/assets/images/help/repository/remotes-url.png" alt="Git Clone" width="300px"/>

### Set Up Your Android Studio Environment

*  Create the project 
Create a new AndroidStudio Project and follow the default wizzard.

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample1.PNG" alt="AndroidStudio New Project" width="600px"/>

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample2.PNG" alt="AndroidStudio Wizard Target Devices" width="600px"/>

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample3.PNG" alt="AndroidStudio Wizard Start Activity" width="600px"/>

*  Set up your project modules
I think that the easiest way to set the modules is by moving the cloned repo to the project location. You can also start by creating the project then cloning directly to the project location.

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample4_1.PNG" alt="Project Directory Structure showing the moved repo" width="200px"/>

Next, open the project modules settings from the contextual menu or using the `Ctrl + Alt + Maj + S` shortcut.

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample4.PNG" alt="AndroidStudio Module Settings" width="600px"/>

Remove the default app module as we only want the project container settings.

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample5.PNG" alt="AndroidStudio Project Structure Properties" width="600px"/>

Now we need to import modules from the cloned repo to the current project

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample6.PNG" alt=AndroidStudio Wizard New Module" width="600px"/>
<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample7.PNG" alt="AndroidStudio Wizard New Module" width="600px"/>

> Repeat these steps for the `oidlib-sample` mobule

Check the oidclib dependencies on the `oidlib-sample` module

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample8.PNG" alt="AndroidStudio Project Structure Dependencies" width="600px"/>

Click "OK" and Wait for gradle sync

Your settings.gradle should look like 

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample8_1.PNG" alt="Generated settings.gradle file" width="600px"/>

*  Build the sample app to make sure you have the sample running correctly.

You won't be able to use this with Azure Active Directory yet. We'll need to configure some endpoints first. This is to ensure you don't have an Android Studio issues before we start customizing the sample app.

Build and run `oidlib-sample` as the target in Android Studio

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample9.png" alt="OidcAndroidLib Sample Screeshot" width="300px"/>

*  Clean Up

You can safely delete the `app ` directory that was left when removing module from the project as AndroidStudio doesn't delete it for safety.

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample12.PNG" alt="Project dir explorer" width="200px"/>

Also you can remove the run configuration that was also left when removing module from the project by opening the "Edit Configurations" menu.

<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample10.PNG" alt="AndroidStudio Edit Configurations" width="600px"/>
<img src="https://github.com/kalemontes/OIDCAndroidLib/wiki/images/SetUpSample11.PNG" alt="AndroidStudio Edit Configurations" width="600px"/>

## Configure the endpoints of the sample

Now that you have the `oidlib-sample` running successfully, let's go edit some endpoints to get this working with Azure Active Directory.

* Configure your client

Open the `oidc_clientconf.xml` file and make the following changes:

1. Since we are using only OAuth2 flows to get a token and call the Graph API, let's set the client to do OAuth2 only. Using OIDC will come in a later example.

```xml
    <bool name="oidc_oauth2only">true</bool>
```

2. Configure your Client ID that you received from the registration portal.

```xml
    <string name="oidc_clientId">86172f9d-a1ae-4348-aafa-7b3e5d1b36f5</string>
    <string name="oidc_clientSecret"></string>
```

3. Configure your redirect URI that you received from the registration portal.

```xml
    <string name="oidc_redirectUrl">https://login.microsoftonline.com/common/oauth2/nativeclient</string>
```

4. Configure your scopes that you need in order to access the Graph API.

```xml
    <string-array name="oidc_scopes">
        <item>openid</item>
        <item>https://graph.microsoft.com/User.ReadBasic.All</item>
        <item>offline_access</item>
    </string-array>
```

* Configure your client endpoints

Open the `oidc_endpoints.xml` file and make the following changes:

```xml
<!-- Stores OpenID Connect provider endpoints. -->
<resources>
    <string name="op_authorizationEnpoint">https://login.microsoftonline.com/common/oauth2/v2.0/authorize</string>
    <string name="op_tokenEndpoint">https://login.microsoftonline.com/common/oauth2/v2.0/token</string>
    <string name="op_userInfoEndpoint">https://www.example.com/oauth2/userinfo</string>
    <string name="op_revocationEndpoint">https://www.example.com/oauth2/revoketoken</string>
</resources>
```

> [AZURE.NOTE] 
the endpoints for userInfoEndpoint and revocationEndpoint are currently not supported by Azure Active Directory so we will leave these with the default valiues of example.com which will provide a helpful reminder that it is not avaialble in the sample :-)


## Configure a Graph API call

Open the `HomeActivity.java` file and make the following changes:

```Java
   //TODO: set your protected resource url
    private static final String protectedResUrl = "https://graph.microsoft.com/v1.0/me/";
```

## You're Done!

That's all the changes you need to do! Run the application `oidlib-sample` and click sign-in. O

nce you've successfully authenticated, press the "Request Protected Resource" button to test your call to the Graph API.

## Get security updates for our product

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.

