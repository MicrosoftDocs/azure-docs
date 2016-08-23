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
   ms.date="06/27/2016"
   ms.author="andkjell"/>

# Azure AD Connect: Automatic upgrade
This feature was introduced with build 1.1.105.0 (released February 2016).

## Overview
Making sure your Azure AD Connect installation is always up to date has never been easier with the **automatic upgrade** feature. This feature is enabled by default for express installations and DirSync upgrades. When a new version is released, your installation is automatically upgraded.

Automatic upgrade is enabled by default for the following:

- Express settings installation and DirSync upgrades.
- Using SQL Express LocalDB, which is what Express settings will always use. DirSync with SQL Express will also use LocalDB.
- The AD account is the default MSOL_ account created by Express settings and DirSync.
- Have less than 100,000 objects in the metaverse.

The current state of automatic upgrade can be viewed with the PowerShell cmdlet `Get-ADSyncAutoUpgrade`. It has the following states:

State | Comment
---- | ----
Enabled | Automatic upgrade is enabled.
Suspended | Set by the system only. The system is no longer eligible to receive automatic upgrades.
Disabled | Automatic upgrade is disabled.

You can change between **Enabled** and **Disabled** with `Set-ADSyncAutoUpgrade`. Only the system should set the state **Suspended**.

Automatic upgrade is using Azure AD Connect Health for the upgrade infrastructure. For automatic upgrade to correctly work, make sure you have opened the URLs in your proxy server for **Azure AD Connect Health** as documented in [Office 365 URLs and IP address ranges ](https://support.office.com/article/Office-365-URLs-and-IP-address-ranges-8548a211-3fe7-47cb-abb1-355ea5aa88a2).

If the **Synchronization Service Manager** UI is running on the server, then the upgrade will be suspended until the UI is closed.

## Troubleshooting
If your Connect installation does not upgrade itself as expected, then follow these steps to find out what could be wrong.

First, you should not expect the automatic upgrade to be attempted the first day a new version is released. There is an intentional randomness before an upgrade is attempted so don't be alarmed if your installation isn't upgraded immediately.

If you think something is not right, then first run `Get-ADSyncAutoUpgrade` to ensure automatic upgrade is enabled.

Start the event viewer and look in the **Application** eventlog. Add an eventlog filter for the source **Azure AD Connect Upgrade** and the event id range **300-399**.  
![Eventlog filter for automatic upgrade](./media/active-directory-aadconnect-feature-automatic-upgrade/eventlogfilter.png)  

You will now see the eventlogs associated with the status for automatic upgrade.  
![Eventlog filter for automatic upgrade](./media/active-directory-aadconnect-feature-automatic-upgrade/eventlogresult.png)  

The result code has a prefix with an overview of the state.

Result code prefix | Description
--- | ---
Success | The installation was successfully upgraded.
UpgradeAborted | A temporary condition stopped the upgrade. It will be retried again and the expectation is that it will succeed later.
UpgradeNotSupported | The system has a configuration that is blocking the system from being automatically upgraded. It will be retried to see if the state is changing, but the expectation is that the system must be upgraded manually.

Here is a list of the most common messages you will find. It does not list all, but the result message should be clear with what the problem is.

Result Message | Description
--- | ---
**UpgradeAborted** |
UpgradeAbortedCouldNotSetUpgradeMarker | Could not write to the registry.
UpgradeAbortedInsufficientDatabasePermissions | The built-in administrators group does not have permissions to the database. Manually upgrade to the latest version of Azure AD Connect to address this issue.
UpgradeAbortedInsufficientDiskSpace | There is not enough disc space to support an upgrade.
UpgradeAbortedSecurityGroupsNotPresent | Could not find and resolve all security groups used by the sync engine.
UpgradeAbortedServiceCanNotBeStarted | The NT Service **Microsoft Azure AD Sync** failed to start.
UpgradeAbortedServiceCanNotBeStopped | The NT Service **Microsoft Azure AD Sync** failed to stop.
UpgradeAbortedServiceIsNotRunning | The NT Service **Microsoft Azure AD Sync** is not running.
UpgradeAbortedSyncCycleDisabled | The SyncCycle option in the [scheduler](active-directory-aadconnectsync-feature-scheduler.md) has been disabled.
UpgradeAbortedSyncExeInUse | The [synchronization service manager UI](active-directory-aadconnectsync-service-manager-ui.md) is open on the server.
UpgradeAbortedSyncOrConfigurationInProgress | The installation wizard is running or a sync was scheduled outside the scheduler.
**UpgradeNotSupported** |
UpgradeNotSupportedCustomizedSyncRules | You have added your own custom rules to the configuration.
UpgradeNotSupportedDeviceWritebackEnabled | You have enabled the [device writeback](active-directory-aadconnect-feature-device-writeback.md) feature.
UpgradeNotSupportedGroupWritebackEnabled | You have enabled the [group writeback](active-directory-aadconnect-feature-preview.md#group-writeback) feature.
UpgradeNotSupportedInvalidPersistedState | The installation is not an Express settings or a DirSync upgrade.
UpgradeNotSupportedMetaverseSizeExceeeded | You have more than 100,000 objects in the metaverse.
UpgradeNotSupportedMultiForestSetup | You are connecting to more than one forest. Express setup will only connect to one forest.
UpgradeNotSupportedNonLocalDbInstall | You are not using a SQL Server Express LocalDB database.
UpgradeNotSupportedNonMsolAccount | The [AD Connector account](active-directory-aadconnect-accounts-permissions.md#active-directory-account) is not the default MSOL_ account anymore.
UpgradeNotSupportedStagingModeEnabled | The server is set to be in [staging mode](active-directory-aadconnectsync-operations.md#staging-mode).
UpgradeNotSupportedUserWritebackEnabled | You have enabled the [user writeback](active-directory-aadconnect-feature-preview.md#user-writeback) feature.

## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](active-directory-aadconnect.md).
