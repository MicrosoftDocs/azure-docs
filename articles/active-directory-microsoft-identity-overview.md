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

# Introducing Microsoft Identity (Preview)
Microsoft Identity is the union of the Microsoft Account and Azure Active Directory cloud authentication services.  Microsoft Identity allows developers to write their identity code once and accept user sign-ins from both personal and work/school accounts.

> [AZURE.NOTE]
This information applies to the Microsoft Identity Public Preview.  For instructions on how to integrate with the generally available Azure AD service, please refer to the [Azure Active Directory Developer Guide](active-directory-developers-guide.md).

## Overview

In the past, an app developer who wanted to support both Microsoft Accounts and Azure Active Directory accounts was required to integrate with two completely separate systems.  With Microsoft Identity, you can sign users in with both MSA and AAD accounts by performing a single integration, using OAuth 2.0 or OpenID Connect. You'll only need one app registration, one set of endpoints, and one auth library.

Your apps can also consume a [unified set of Microsoft REST APIs]() using either type of account, including:
- Files through OneDrive and OneDrive for Business
- Mail, Contacts, and Calendars through Outlook.com and Office 365
- Users, Groups, and Company Info through Azure AD

With more Microsoft Online services to be added in the near future.  You write your code once and can immediately reach an audience that spans millions of consumer and enterprise users.  

## Getting Started
To get your own Microsoft Identity integrated app up & running, try out one of our quick start tutorials below.  

[AZURE.INCLUDE [active-directory-msid-quickstart-table](../includes/active-directory-msid-quickstart-table.md)]

## What's new
Check back here often to learn about future changes to the Microsoft Identity Preview.
- Learn about the [currently supported authentication flows](active-directory-microsoft-identity-scenarios.md).
- For developers familiar with Azure Active Directory, check out [Azure AD vs. Microsoft Identity](active-directory-microsoft-identity-compare.md).

## Reference
These links will be useful for exploring the platform in depth:

- [ADAL Library Reference]()
- [Microsoft Identity Protocol Reference]()
- [Microsoft Identity FAQs](active-directory-microsoft-identity-faq.md)
- [Office 365 Rest API Reference]()
- [Scopes and Resources in Microsoft Identity](active-directory-microsoft-identity-scopes.md)
