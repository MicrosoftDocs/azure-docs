<properties
	pageTitle="App Model v2.0 | Microsoft Azure"
	description="How to register an  app with Microsoft for enabling sign-in and integrating apps with app model v2.0."
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
	ms.date="08/12/2015"
	ms.author="dastrock"/>

# App model v2.0 preview: How to register an app with Microsoft

To build an app that accepts both MSA & Azure AD sign-in, you'll first need to register an app with Microsoft.  You won't be able to use any existing app you may have with Azure AD or MSA - it's time to create a brand new one.

> [AZURE.NOTE]
	This information applies to the v2.0 app model public preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Visit the Microsoft  App Registration Portal
First things first - navigate to [https://apps.dev.microsoft.com](https://apps.dev.microsoft.com).  This is the new app registration portal where you can manage anything & everything about your Microsoft apps.

Sign in with either a personal or work or school Microsoft account.  If you don't have either, sign up for a new personal account. Go ahead, it won't take long - we'll wait here.

Done? You should now be looking at your list of Microsoft apps, which is probably empty.  Let's change that.

<!-- TODO: Verify strings here -->
Click **Add an app**, and give it a name.  The portal will assign your app a
globally unique  Application Id that you'll use later in your code.  If your app includes a server-side component that needs access tokens for calling APIs
(think: Office, Azure, or 3rd party), you'll want to create an ** Application
Secret** here as well.
<!-- TODO: Link for app secrets -->

Next, add the Platforms that your app will use.
- For web based apps, provide a **Redirect URI** where sign-in messages can be sent.
- For mobile apps, copy down the default redirect uri automatically created for you.

Optionally, you can customize the look and feel of your sign-in page in the Profile section.  Make sure to click **Save** before moving on.

## Build a Quick Start App
Now that you have a Microsoft app, you can complete one of our quick start
tutorials to get up & running with app model v2.0.  Here are a few
recommendations:

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-v2-quickstart-table.md)]
