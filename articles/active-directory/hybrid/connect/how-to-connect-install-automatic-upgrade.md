---
title: 'Microsoft Entra Connect: Automatic upgrade'
description: This topic describes the built-in automatic upgrade feature in Microsoft Entra Connect Sync.
services: active-directory
documentationcenter: ''
author: billmath
manager: amycolannino
editor: ''

ms.assetid: 6b395e8f-fa3c-4e55-be54-392dd303c472
ms.service: active-directory
ms.topic: how-to
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 01/26/2023
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Microsoft Entra Connect: Automatic upgrade
Microsoft Entra Connect automatic upgrade is a feature that regularly checks for newer versions of Microsoft Entra Connect. If your server is enabled for automatic upgrade and a newer version is found for which your server is eligible, it will perform an automatic upgrade to that newer version.
Note that for security reasons the agent that performs the automatic upgrade validates the new build of Microsoft Entra Connect based on the digital signature of the downloaded version.

>[!NOTE]
> Microsoft Entra Connect follows the [Modern Lifecycle Policy](/lifecycle/policies/modern). Changes for products and services  under the Modern Lifecycle Policy may be more frequent and require customers to be alert for forthcoming modifications to their product or service.
>
> Product governed by the Modern Policy follow a [continuous support and servicing model](/lifecycle/overview/product-end-of-support-overview). Customers must take the latest update to remain supported. 
>
> For products and services governed by the Modern Lifecycle Policy, Microsoft's policy is to provide a minimum 30 days' notification when customers are required to take action in order to avoid significant degradation to the normal use of the product or service.

## Overview
Making sure your Microsoft Entra Connect installation is always up to date has never been easier with the **automatic upgrade** feature. This feature is enabled by default for express installations and DirSync upgrades. When a new version is released, your installation is automatically upgraded.
Automatic upgrade is enabled by default for the following:

* Express settings installation and DirSync upgrades.
* Using SQL Express LocalDB, which is what Express settings always use. DirSync with SQL Express also use LocalDB.
* The AD account is the default MSOL_ account created by Express settings and DirSync.
* Have less than 100,000 objects in the metaverse.

The current state of automatic upgrade can be viewed with the PowerShell cmdlet `Get-ADSyncAutoUpgrade`. It has the following states:

| State | Comment |
| --- | --- |
| Enabled |Automatic upgrade is enabled. |
| Suspended |Set by the system only. The system is **not currently** eligible to receive automatic upgrades. |
| Disabled |Automatic upgrade is disabled. |

You can change between **Enabled** and **Disabled** with `Set-ADSyncAutoUpgrade`. Only the system should set the state **Suspended**.  Prior to 1.1.750.0 the Set-ADSyncAutoUpgrade cmdlet would block Autoupgrade if the auto-upgrade state was set to Suspended. This functionality has now changed so it does not block AutoUpgrade.

Automatic upgrade is using Microsoft Entra Connect Health for the upgrade infrastructure. For automatic upgrade to work, make sure you have opened the URLs in your proxy server for **Microsoft Entra Connect Health** as documented in [Office 365 URLs and IP address ranges](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).


If the **Synchronization Service Manager** UI is running on the server, then the upgrade is suspended until the UI is closed.

>[!NOTE]
> Not all releases of Microsoft Entra Connect are made available for auto upgrade. The release status indicates if a release is available for auto upgrade or for download only. If auto upgrade was enabled on your Microsoft Entra Connect server then that server will automatically upgrade to the latest version of Microsoft Entra Connect released for auto upgrade if **your configuration is [eligible](#auto-upgrade-eligibility)** for auto upgrade. For more information, see the article [Microsoft Entra Connect: Version release history](reference-connect-version-history.md).

## Auto-upgrade eligibility
In order to eligible for an automatic upgrade, you must not meet any one of the following conditions:

| Result Message | Description |
| --- | --- |
|UpgradeNotSupportedCustomizedSyncRules|You have added your own custom rules to the configuration.|
|UpgradeNotSupportedInvalidPersistedState|The installation is not an Express settings or a DirSync upgrade.|
|UpgradeNotSupportedNonLocalDbInstall|You are not using a SQL Server Express LocalDB database.|
|UpgradeNotSupportedLocalDbSizeExceeded|Local DB size is greater than or equal to 8 GB|
|UpgradeNotSupportedAADHealthUploadDisabled|Health data uploads have been disabled from the portal|



## Troubleshooting
If your Connect installation does not upgrade itself as expected, then follow these steps to find out what could be wrong.

First, you should not expect the automatic upgrade to be attempted the first day a new version is released. There is an intentional randomness before an upgrade is attempted so don't be alarmed if your installation isn't upgraded immediately.

If you think something is not right, then first run `Get-ADSyncAutoUpgrade` to ensure automatic upgrade is enabled.

If the state is suspended, you can use the `Get-ADSyncAutoUpgrade -Detail` to view the reason.  The suspension reason can contain any string value but will usually contain the string value of the UpgradeResult, that is, `UpgradeNotSupportedNonLocalDbInstall` or `UpgradeAbortedAdSyncExeInUse`.  A compound value may also be returned, such as `UpgradeFailedRollbackSuccess-GetPasswordHashSyncStateFailed`.

It is also possible to get a result that is not an UpgradeResult i.e. 'AADHealthEndpointNotDefined' or 'DirSyncInPlaceUpgradeNonLocalDb'.

Then, make sure you have opened the required URLs in your proxy or firewall. Automatic update is using Microsoft Entra Connect Health as described in the [overview](#overview). If you use a proxy, make sure Health has been configured to use a [proxy server](how-to-connect-health-agent-install.md#configure-azure-ad-connect-health-agents-to-use-http-proxy). Also test the [Health connectivity](how-to-connect-health-agent-install.md#test-connectivity-to-azure-ad-connect-health-service) to Microsoft Entra ID.

With the connectivity to Microsoft Entra ID verified, it is time to look into the eventlogs. Start the event viewer and look in the **Application** eventlog. Add an eventlog filter for the source **Microsoft Entra Connect Upgrade** and the event ID range **300-399**.  
![Screenshot that shows the "Filter Current Log" window with "Event sources" and the "Include/Exclude" Event IDs box highlighted.](./media/how-to-connect-install-automatic-upgrade/eventlogfilter.png)  

You can now see the eventlogs associated with the status for automatic upgrade.  
![Eventlog filter for automatic upgrade](./media/how-to-connect-install-automatic-upgrade/eventlogresult.png)  

The result code has a prefix with an overview of the state.

| Result code prefix | Description |
| --- | --- |
| Success |The installation was successfully upgraded. |
| UpgradeAborted |A temporary condition stopped the upgrade. It will be retried again and the expectation is that it succeeds later. |
| UpgradeNotSupported |The system has a configuration that is blocking the system from being automatically upgraded. It will be retried to see if the state is changing, but the expectation is that the system must be upgraded manually. |

Here is a list of the most common messages you find. It does not list all, but the result message should be clear with what the problem is.

| Result Message | Description |
| --- | --- |
| **UpgradeAborted** | |
| UpgradeAbortedCouldNotSetUpgradeMarker |Could not write to the registry. |
| UpgradeAbortedInsufficientDatabasePermissions |The built-in administrators group does not have permissions to the database. Manually upgrade to the latest version of Microsoft Entra Connect to address this issue. |
| UpgradeAbortedInsufficientDiskSpace |There is not enough disc space to support an upgrade. |
| UpgradeAbortedSecurityGroupsNotPresent |Could not find and resolve all security groups used by the sync engine. |
| UpgradeAbortedServiceCanNotBeStarted |The NT Service **Microsoft Entra ID Sync** failed to start. |
| UpgradeAbortedServiceCanNotBeStopped |The NT Service **Microsoft Entra ID Sync** failed to stop. |
| UpgradeAbortedServiceIsNotRunning |The NT Service **Microsoft Entra ID Sync** is not running. |
| UpgradeAbortedSyncCycleDisabled |The SyncCycle option in the [scheduler](how-to-connect-sync-feature-scheduler.md) has been disabled. |
| UpgradeAbortedSyncExeInUse |The [synchronization service manager UI](how-to-connect-sync-service-manager-ui.md) is open on the server. |
| UpgradeAbortedSyncOrConfigurationInProgress |The installation wizard is running or a sync was scheduled outside the scheduler. |
| **UpgradeNotSupported** | |
| UpgradeNotSupportedCustomizedSyncRules |You have added your own custom rules to the configuration. |
| UpgradeNotSupportedInvalidPersistedState |The installation is not an Express settings or a DirSync upgrade. |
| UpgradeNotSupportedNonLocalDbInstall |You are not using a SQL Server Express LocalDB database. |
|UpgradeNotSupportedLocalDbSizeExceeded|Local DB size is greater than or equal to 8 GB|
|UpgradeNotSupportedAADHealthUploadDisabled|Health data uploads have been disabled from the portal|

## Next steps
Learn more about [Integrating your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).
