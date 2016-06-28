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
	
## Get security updates for our product

We encourage you to get notifications of when security incidents occur by visiting [this page](https://technet.microsoft.com/security/dd252948) and subscribing to Security Advisory Alerts.

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
- Copy down the **Redirect URI** from the portal. You must use the default value of `urn:ietf:wg:oauth:2.0:oob`.


## Download the third party library nxoauth2 and launch a workspace

For this walkthrough we will use the OAuth2Client from GitHub, an OAuth2 library for Mac OS X & iOS (Cocoa & Cocoa touch). This library is based on draft 10 of the OAuth2 spec. It implements the native application profile and supports the end-user authorization endpoint. These are all the things we'll need in order to integrat with The microsoft identity platform.

### Adding the library to your project using CocoaPods