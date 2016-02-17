<properties
   pageTitle="Azure AD Connect: Automatic upgrade | Microsoft Azure"
   description="This topic describes the built-in automatic upgrade feature in Azure AD Connect sync."
   services="active-directory"
   documentationCenter=""
   authors="AndKjell"
   manager="StevenPo"
   editor=""/>

<tags
   ms.service="active-directory"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="identity"
   ms.date="02/16/2016"
   ms.author="andkjell"/>

# Azure AD Connect: Automatic upgrade
This feature was introduced with build 1.1.105.0 (released February 2016).

## Overview
Making sure your Azure AD Connect installation is always up to date has never been easier with the **automatic upgrade** feature. This feature is enabled by default for express installations and will make sure that when a new version is released, your installation is automatically upgraded.

Automatic upgrade is enabled by default for the following:

- Express settings installation
- Using SQL Express LocalDB , which is what Express settings will always use
- The AD account is the default MSOL_ account created by Express settings
- Have less than 100,000 objects in the metaverse

The current state of automatic upgrade can be viewed with the PowerShell cmdlet `Get-ADSyncAutoUpgrade`. It has the following states:

| State | Comment |
| ---- | ---- |
| Enabled | Automatic upgrade is enabled. |
| Suspended | Set by the system only. The system is no longer eligible to receive automatic upgrades. |
| Disabled | Automatic upgrade is disabled. |

You can change between **Enabled** and **Disabled** with `Set-ADSyncAutoUpgrade`. Only the system should set the state **Suspended**.

Automatic upgrade is using Azure AD Connect Health as the upgrade infrastructure. For automatic upgrade to correctly work, make sure you have opened the URLs in the proxy for **Azure AD Connect Health** as documented in [Office 365 URLs and IP address ranges ](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).

If the **Synchronization Service Manager** UI is running on the server, then the upgrade will be suspended until the UI is closed.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
