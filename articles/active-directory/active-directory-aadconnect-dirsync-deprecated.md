<properties
	pageTitle="Upgrade from DirSync and Azure AD Sync | Microsoft Azure"
	description="Describes how to upgrade from DirSync and Azure AD Sync to Azure AD Connect."
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
	ms.date="06/27/2016"
	ms.author="andkjell"/>


# Upgrade Windows Azure Active Directory Sync (“DirSync”) and Azure Active Directory Sync (“Azure AD Sync”)
Azure AD Connect is the best way to connect your on-premises directory with Azure AD and Office 365. This is a great time to upgrade to Azure AD Connect from Windows Azure Active Directory Sync (DirSync) or Azure AD Sync as these tools are now deprecated and will reach end of support on April 13, 2017.

The two identity synchronization tools that are deprecated were offered for single forest customers (DirSync) and for multi-forest and other advanced customers (Azure AD Sync). These older tools have been replaced with a single solution that is available for all scenarios: Azure AD Connect. It offers new functionality, feature enhancements, and support for new scenarios. To be able to continue to synchronize your on-premises identity data to Azure AD and Office 365, we strongly recommend that you upgrade to Azure AD Connect.

The last release of DirSync was released in July 2014 and the last release of Azure AD Sync was released in May 2015.

## What is Azure AD Connect
Azure AD Connect is the successor to DirSync and Azure AD Sync. It combines all scenarios these two supported. You can read more about it in [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).

## Deprecation schedule

Date | Comment
 --- | ---
April 13, 2016 | Windows Azure Active Directory Sync (“DirSync”) and Microsoft Azure Active Directory Sync (“Azure AD Sync”) are announced as deprecated.
April 13, 2017 | Support ends. Customers will no longer be able to open a support case without upgrading to Azure AD Connect first.

## How to transition to Azure AD Connect
If you are running DirSync there are two ways you can upgrade: In-place upgrade and parallel deployment. An in-place upgrade is recommended for most customers and if you have a recent operating system and less than 50,000 objects. In other cases it is recommended to do a parallel deployment where your DirSync configuration is moved to a new server running Azure AD Connect.

If you use Azure AD Sync an in-place upgrade is recommended. If you want to, it is possible to install a new Azure AD Connect server in parallel and do a swing migration from your Azure AD Sync server to Azure AD Connect.

Solution | Scenario
----- | -----
[Upgrade from DirSync](active-directory-aadconnect-dirsync-upgrade-get-started.md) | <li>If you have an existing DirSync server already running.</li>
[Upgrade from Azure AD Sync](active-directory-aadconnect-upgrade-previous-version.md)| <li>If you are moving from Azure AD Sync.</li>

If you want to see how to do an in-place upgrade from DirSync to Azure AD Connect, then please see this Channel 9 video:

> [AZURE.VIDEO azure-active-directory-connect-in-place-upgrade-from-legacy-tools]

## FAQ
**Q: I have received an email notification from the Azure Team and/or a message from the Office 365 message center, but I am using Connect.**  
The notification was also sent to customers using Azure AD Connect with a build number 1.0.\*.0 (using a pre-1.1 release). Microsoft recommends customers to stay current with Azure AD Connect releases. With 1.1 the [automatic upgrade](active-directory-aadconnect-feature-automatic-upgrade.md) feature will make it really easy to always have a recent version of Azure AD Connect installed.

**Q: Will DirSync/Azure AD Sync stop working on April 13, 2017?**  
No. The date for when these will no longer be able to communicate with Azure AD will be announced at a later date. You will be able to find that information in this topic when available.

**Q: Which DirSync versions can I upgrade from?**  
It is supported to upgrade from any DirSync release currently being used.

**Q: What about the Azure AD Connector for FIM/MIM?**  
The Azure AD Connector for FIM/MIM has **not** been announced as deprecated. It is at **feature freeze**; no new functionality is added and it receives no bug fixes. Microsoft recommends customers using it to plan to move from it to Azure AD Connect. It is strongly recommended to not start any new deployments using it. This Connector will be announced deprecated in the future.

## Additional Resources

* [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md)
