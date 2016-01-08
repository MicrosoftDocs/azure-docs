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
	ms.date="12/09/2015"
	ms.author="dastrock"/>

# How to register a v2.0 app

To build an app that accepts both MSA & Azure AD sign-in, you'll first need to register a v2.0 app with Microsoft.  At this time, you won't be able to use any existing apps you may have with Azure AD or MSA - you'll need to create a brand new one.

> [AZURE.NOTE]
	Not all Azure Active Directory scenarios & features are supported by v2.0 apps.  To determine if you should create a v2.0 app, read about [v2.0 limitations](active-directory-v2-limitations.md).

## Visit the Microsoft App Registration Portal
First things first - navigate to [https://apps.dev.microsoft.com](https://apps.dev.microsoft.com).  This is a new app registration portal where you can manage your Microsoft apps.

Sign in with either a personal or work or school Microsoft account.  If you don't have either, sign up for a new personal account. Go ahead, it won't take long - we'll wait here.

Done? You should now be looking at your list of Microsoft apps, which is probably empty.  Let's change that.

Click **Add an app**, and give it a name.  The portal will assign your app a globally unique  Application Id that you'll use later in your code.  If your app includes a server-side component that needs access tokens for calling APIs (think: Office, Azure, or your own web API), you'll want to create an **Application Secret** here as well.
<!-- TODO: Link for app secrets -->

Next, add the Platforms that your app will use.

- For web based apps, provide a **Redirect URI** where sign-in messages can be sent.
- For mobile apps, copy down the default redirect uri automatically created for you.

Optionally, you can customize the look and feel of your sign-in page in the Profile section.  Make sure to click **Save** before moving on.

## Build a Quick Start App
Now that you have a Microsoft app, you can complete one of our v2.0 quick start tutorials.  Here are a few recommendations:

[AZURE.INCLUDE [active-directory-v2-quickstart-table](../../includes/active-directory-v2-quickstart-table.md)]
