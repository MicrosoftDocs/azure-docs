<properties
	pageTitle="Conditional access FAQs | Microsoft Azure"
	description="Frequently asked questions for conditional access "
	services="active-directory"
	documentationCenter=""
	authors="femila"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="02/10/2016"
	ms.author="femila"/>

# Conditional access FAQs

**Can I use the device conditions in Azure AD if I am using mobile device management for Office 365?**
 
With MDM for O365, all the device policies are maintained as part of Office 365. To avoid conflicting policies between what is set in Office 365 and what is set in Azure AD, we currently disallow setting these policies in Azure AD if you are using MDM for O365.


