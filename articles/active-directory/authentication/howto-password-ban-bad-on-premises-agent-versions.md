---
title: On-premises Azure AD password protection agent version release history
description: Documents version release and behavior change history

services: active-directory
ms.service: active-directory
ms.component: authentication
ms.topic: article
ms.date: 11/01/2018

ms.author: joflore
author: MicrosoftGuyJFlo
manager: mtillman
ms.reviewer: jsimmons
---

# Preview:  Azure AD password protection agent version history

|     |
| --- |
| Azure AD password protection is a public preview feature of Azure Active Directory. For more information about previews, see  [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/)|
|     |

## 1.2.25.0

Release date: 11/01/2018

Fixes:

* DC agent and proxy service should no longer fail due to certificate trust failures.
* DC agent and proxy service have additional fixes for FIPS-compliant machines.
* Proxy service will now work properly in a TLS 1.2-only networking environment.
* Minor performance and robustness fixes
* Improved logging

Changes:

* The minimum required OS level for the Proxy service is now Windows Server 2012 R2. The minimum required OS level for the DC agent service remains at Windows Server 2012.
* The password validation algorithm uses an expanded character normalization table. This may result in passwords being rejected that were accepted in prior versions.

## 1.2.10.0

Release date: 8/17/2018

Fixes:

* Register-AzureADPasswordProtectionProxy and Register-AzureADPasswordProtectionForest now support multi-factor authentication
* Register-AzureADPasswordProtectionProxy requires a WS2012 or later domain controller in the domain to avoid encryption errors.
* DC agent service is more reliable about requesting a new password policy from Azure on startup.
* DC agent service will request a new password policy from Azure every hour if necessary, but will now do so on a randomly selected start time.
* DC agent service will no longer cause an indefinite delay in new DC advertisement when installed on a server prior to its promotion as a replica.
* DC agent service will now honor the “Enable password protection on Windows Server Active Directory” configuration setting
* Both DC agent and proxy installers will now support in-place upgrade when upgrading to future versions.

> [!WARNING]
> In-place upgrade from version 1.1.10.3 is not supported and will result in an installation error. To upgrade to version 1.2.10 or later, you must first completely uninstall the DC agent and proxy service software, then install the new version from scratch. Re-registration of the Azure AD password protection Proxy service is required.  It is not required to re-register the forest.

> [!NOTE]
> In-place upgrades of the DC agent software will require a reboot.

* DC agent and proxy service now support running on a server configured to only use FIPS-compliant algorithms.
* Minor performance and robustness fixes
* Improved logging

## 1.1.10.3

Release date: 6/15/2018

Initial public preview release

## Next steps

[Deploy Azure AD password protection](howto-password-ban-bad-on-premises-deploy.md)
