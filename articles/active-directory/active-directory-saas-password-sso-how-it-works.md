<properties
	pageTitle="Security Guidance for Password-Based Single Sign-On in Azure AD | Microsoft Azure"
	description="Learn how to customize the expiration date for your federation certificates, and how to renew certificates that will soon expire."
	services="active-directory"
	documentationCenter=""
	authors="liviodlc"
	manager="terrylan"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="01/27/2015"
	ms.author="liviodlc"/>

#Password-Based Single Sign-On: How it Works

- for apps that don't support federation, can still enjoy convenience of single sign-on
- how it works
	- Azure AD can help manage your users' passwords to apps
	- store passwords in Azure AD, access them from anywhere
	- available for ie, chrome, firefox
	- mobile app
- benefits
	- guards against phishing attacks
	- users are less likely to write down passwords
	- easily share team creds
	- automated password rollover (preview)
- deployment considerations
	- deploy extension with group policy vs. 
	- disable "remember password" prompt using group policy
	- training users
	- removing access to apps
		- still need to deprovision users in the app
		- viability of keeping passwords secret from users