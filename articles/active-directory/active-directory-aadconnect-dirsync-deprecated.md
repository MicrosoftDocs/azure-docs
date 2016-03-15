<properties
	pageTitle="DirSync and Azure AD Sync are now deprecated | Microsoft Azure"
	description="Explains how Azure AD Connect sync works and how to customize."
	services="active-directory"
	documentationCenter=""
	authors="andkjell"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.workload="identity"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/11/2016"
	ms.author="andkjell"/>


# Windows Azure Active Directory Sync (“DirSync”) and Azure Active Directory Sync (“AAD Sync”) deprecation

The older identity synchronization tools are deprecated and customers must move to Azure AD Connect to be able to continue synchronization with Azure AD and Office 365. The last release of DirSync was released in July 2014 and the last release of AAD Sync was released in May 2015.

## What is Azure AD Connect
Azure AD Connect is the successor to DirSync and Azure AD Sync. It combines all scenarios these two supported. You can read more about it in [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

## Deprecation schedule

|Date | Comment |
| --- | --- |
| March 15, 2016 | Windows Azure Active Directory Sync (“DirSync”) and Azure Active Directory Sync (“AAD Sync”) are announced as deprecated. |
| April 1, 2017 | Support ends. Customers will no longer be able to open a support case without upgrading to Azure AD Connect first. |
| April 1, 2017 | DirSync and AAD Sync will no longer be able to connect and synchronize identity data to Azure AD and Office 365. |

## How to transition to Azure AD Connect

| Solution | Scenario |
| ----- | ----- |
| [Upgrade from DirSync](active-directory-aadconnect-dirsync-upgrade-get-started.md) | <li>If you have an existing DirSync server already running.</li>
| [Upgrade from Azure AD Sync](active-directory-aadconnect-upgrade-previous-version.md)| <li>If you are moving from Azure AD Sync.</li>

## If you need help to transition to Azure AD Connect

(Is there anything we can offer to help in the transition? Open a support case?)

## FAQ
**Q: What about the Azure AD Connector for FIM/MIM?**  
The Azure AD Connector for FIM/MIM has **not** been announced as deprecated. It is at **feature freeze**; no new functionality is added and it receives no bug fixes. Microsoft recommends customers using it to plan to move from it to Azure AD Connect. It is strongly recommended to not start any new deployments using it. This Connector will be announced deprecated in the future.

## Additional Resources

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
