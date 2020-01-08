---
title: Password protection agent release history - Azure Active Directory
description: Documents version release and behavior change history

services: active-directory
ms.service: active-directory
ms.subservice: authentication
ms.topic: article
ms.date: 11/21/2019

ms.author: iainfou
author: iainfoulds
manager: daveba
ms.reviewer: jsimmons

ms.collection: M365-identity-device-management
---
# Azure AD Password Protection agent version history

## 1.2.125.0

Release date: 3/22/2019

* Fix minor typo errors in event log messages
* Update EULA agreement to final General Availability version

> [!NOTE]
> Build 1.2.125.0 is the General Availability build. Thank you again to everyone has provided feedback on the product!

## 1.2.116.0

Release date: 3/13/2019

* The Get-AzureADPasswordProtectionProxy and Get-AzureADPasswordProtectionDCAgent cmdlets now report software version and the current Azure tenant with the following limitations:
  * Software version and Azure tenant data are only available for DC agents and proxies running version 1.2.116.0 or later.
  * Azure tenant data may not be reported until a re-registration (or renewal) of the proxy or forest has occurred.
* The Proxy service now requires that .NET 4.7 is installed.
  * .NET 4.7 should already be installed on a fully updated Windows Server. If this is not the case, download and run the installer found at [The .NET Framework 4.7 offline installer for Windows](https://support.microsoft.com/help/3186497/the-net-framework-4-7-offline-installer-for-windows).
  * On Server Core systems it may be necessary to pass the /q flag to the .NET 4.7 installer to get it to succeed.
* The Proxy service now supports automatic upgrade. Automatic upgrade uses the Microsoft Azure AD Connect Agent Updater service which is installed side-by-side with the Proxy service. Automatic upgrade is on by default.
* Automatic upgrade can be enabled or disabled using the Set-AzureADPasswordProtectionProxyConfiguration cmdlet. The current setting can be queried using the Get-AzureADPasswordProtectionProxyConfiguration cmdlet.
* The service binary for the DC agent service has been renamed to AzureADPasswordProtectionDCAgent.exe.
* The service binary for the Proxy service has been renamed to AzureADPasswordProtectionProxy.exe. Firewall rules may need to be modified accordingly if a third-party firewall is in-use.
  * NOTE: if an http proxy config file was being used in a previous Proxy install, it will need to be renamed (from *proxyservice.exe.config* to *AzureADPasswordProtectionProxy.exe.config*) after this upgrade.
* All time-limited functionality checks have been removed from the DC agent.
* Minor bugs fixes and logging improvements.

## 1.2.65.0

Release date: 2/1/2019

Changes:

* DC agent and proxy service are now supported on Server Core. Mininimum OS requirements are unchanged from before: Windows Server 2012 for DC agents, and Windows Server 2012 R2 for proxies.
* The Register-AzureADPasswordProtectionProxy and Register-AzureADPasswordProtectionForest cmdlets now support device-code-based Azure authentication modes.
* The Get-AzureADPasswordProtectionDCAgent cmdlet will ignore mangled and/or invalid service connection points. This fixes the bug where domain controllers would sometimes show up multiple times in the output.
* The Get-AzureADPasswordProtectionSummaryReport cmdlet will ignore mangled and/or invalid service connection points. This fixes the bug where domain controllers would sometimes show up multiple times in the output.
* The Proxy powershell module is now registered from %ProgramFiles%\WindowsPowerShell\Modules. The machine's PSModulePath environment variable is no longer modified.
* A new Get-AzureADPasswordProtectionProxy cmdlet has been added to aid in discovering registered proxies in a forest or domain.
* The DC agent uses a new folder in the sysvol share for replicating password policies and other files.

   Old folder location:

   `\\<domain>\sysvol\<domain fqdn>\Policies\{4A9AB66B-4365-4C2A-996C-58ED9927332D}`

   New folder location:

   `\\<domain>\sysvol\<domain fqdn>\AzureADPasswordProtection`

   (This change was made to avoid false-positive "orphaned GPO" warnings.)

   > [!NOTE]
   > No migration or sharing of data will be done between the old folder and the new folder. Older DC agent versions will continue to use the old location until upgraded to this version or later. Once all DC agents are running version 1.2.65.0 or later, the old sysvol folder may be manually deleted.

* The DC agent and proxy service will now detect and delete mangled copies of their respective service connection points.
* Each DC agent will periodically delete mangled and stale service connection points in its domain, for both DC agent and proxy service connection points. Both DC agent and proxy service connection points are considered stale if its heartbeat timestamp is older than seven days.
* The DC agent will now renew the forest certificate as needed.
* The Proxy service will now renew the proxy certificate as needed.
* Updates to password validation algorithm: the global banned password list and customer-specific banned password list (if configured) are combined prior to password validations. A given password may now be rejected (fail or audit-only) if it contains tokens from both the global and customer-specific list. The event log documentation has been updated to reflect this; please see [Monitor Azure AD Password Protection](howto-password-ban-bad-on-premises-monitor.md).
* Performance and robustness fixes
* Improved logging

> [!WARNING]
> Time-limited functionality:  the DC agent service in this release (1.2.65.0) will stop processing password validation requests as of September 1st 2019.  DC agent services in prior releases (see list below) will stop processing as of July 1st 2019. The DC agent service in all versions will log 10021 events to the Admin event log in the two months leading up these deadlines. All time-limit restrictions will be removed in the upcoming GA release. The Proxy agent service is not time-limited in any version but should still be upgraded to the latest version in order to take advantage of all subsequent bug fixes and other improvements.

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
* The Proxy service now requires .NET version 4.6.2.
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

[Deploy Azure AD Password Protection](howto-password-ban-bad-on-premises-deploy.md)
