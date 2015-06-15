<properties
	pageTitle="Registering a Microsoft App | Microsoft Azure"
	description="How to register an applicaion with Microsoft for enabling sign in and integrating apps with Microsoft Identity."
	services="active-directory"
	documentationCenter=""
	authors="dstrockis"
	manager="mbaldwin"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="06/15/2015"
	ms.author="dastrock"/>

#How to Register an App with Microsoft

To build an app that accepts both MSA & Azure AD sign in, you'll first need to
register an app with Microsoft.  You won't be able to use any existing app you
may have with Azure AD or MSA - it's time to create a brand new one.

> [AZURE.NOTE]
These instructions apply to the Microsoft Identity Public Preview.  For instructions on how to register an app with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Visit the Microsoft Application Registration Portal
First things first - navigate to [https://apps.dev.microsoft.com](https://apps.dev.microsoft.com).  This is the new app registration portal where you can manage anything & everything about your Microsoft apps.

Sign in with a Microsoft Identity - that is, either your MSA or Azure AD/Office 365 account.  If you don't have either, sign up for a new account. Go ahead, it won't take long - we'll wait here.

Done? You should now be looking at your list of Microsoft apps, which is probably empty.  Let's change that now.

Click **Add an app**, and give it a name.  The portal will assign your app a
globally unique Application Id that you'll use later in your code.  If your app includes a server-side component that needs access tokens for calling APIs
(think: Office, Azure, or 3rd party), you'll want to create an [Application
Secret](http://learnmoreaboutappsecrets) here as well.

Next, add the Platforms that your app will use.
- For web/browser based apps, provide a **Redirect URI** where sign in messages can be sent.
- For an iOS app, provide your **Bundle Id** and **App Store Id** if you have one.
- For Android...
- For Windows...

Optionally, you can customize the look and feel of your sign in page in the
Profile section.  Make sure to click **Save** before moving on.

## Build a Quick Start App
Now that you have a Microsoft app, you can complete one of our quick start
tutorials to get up & running with Microsoft Identity.  Here are a few
recommendations:

Call O365 Rest APIs: [AZURE.INCLUDE [active-directory-devquickstarts-platforms](../includes/active-directory-devquickstarts-platforms.md)]

Add Microsoft Identity Sign In: [AZURE.INCLUDE [active-directory-devquickstarts-platforms](../includes/active-directory-devquickstarts-platforms.md)]

Secure A Custom Web API: [AZURE.INCLUDE [active-directory-devquickstarts-platforms](../includes/active-directory-devquickstarts-platforms.md)]
