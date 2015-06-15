<properties
	pageTitle="Microsoft Identity | Microsoft Azure"
	description="An introduction to developing apps that integrate with Microsoft Identity."
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

# Introducing Microsoft Identity
Microsoft Identity is the union of the Microsoft Account and Azure Active Directory cloud authentication services.  With Microsoft Identity you can write your identity code once and accept sign-ins from both types of accounts.  

> [AZURE.NOTE]
This information applies to the Microsoft Identity Public Preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Overview

In the past, an app developer who wanted to support both Microsoft Accounts and Azure Active Directory accounts in their app was required to integrate with two completely separate systems.  Now, Microsoft Identity gives you the ability to sign users into your apps using both AAD and MSA accounts with a single app registration, a single library, and a single integration.

You can now quickly reach an audience that spans millions of consumer and enterprise users, who will see a single sign in page and a simplified user experience.  And of course, you can restrict this audience down to specific sets of users, if you wish.

In addition, your apps will be able to consume a single set of Microsoft APIs using either type of account, including OneDrive, OneDrive for Business, Outlook, Exchange, OneNote, and more.  You write your code once and get immediate integration to both the business and consumer worlds.

For more information, you might want to check out our [Microsoft Identity FAQs](active-directory-microsoft-identity-faq.md).

## Getting Started
To get your own Microsoft Identity integrated app up & running, try out one of our quick start tutorials:

| Microsoft Identity + Office 365 | Microsoft Identity Sign In |
| ----------------------- | ------------------------------- |
| [Call O365 Rest APIs - iOS]()| [Add sign in to an iOS app]()   |
| [Call O365 Rest APIs - Android]()| [Add sign in to an Android app]()   |
| [Call O365 Rest APIs - Windows]()| [Add sign in to a Windows app]()   |
| [Call O365 Rest APIs - SPA]()| [Add sign in to an single page app]()   |
| | [Secure a custom Web API]()  |

## Reference
These links will be useful for exploring the platform in depth:

- [ADAL Library Reference]()
- [Microsoft Identity Protocol Reference]()
- [Microsoft Identity FAQs](active-directory-microsoft-identity-faq.md)
- [Office 365 Rest API Reference]()
- [Scopes and Resources in Microsoft Identity](active-directory-microsoft-identity-scopes.md)
