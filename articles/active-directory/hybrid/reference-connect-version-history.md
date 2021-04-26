---
title: 'Azure AD Connect: Version release history | Microsoft Docs'
description: This article lists all releases of Azure AD Connect and Azure AD Sync.
services: active-directory
author: billmath
manager: daveba
ms.assetid: ef2797d7-d440-4a9a-a648-db32ad137494
ms.service: active-directory
ms.topic: reference
ms.workload: identity
ms.date: 03/16/2021
ms.subservice: hybrid
ms.author: billmath

ms.collection: M365-identity-device-management
---
# Azure AD Connect: Version release history
The Azure Active Directory (Azure AD) team regularly updates Azure AD Connect with new features and functionality. Not all additions are applicable to all audiences.

This article is designed to help you keep track of the versions that have been released, and to understand what the changes are in the latest version.



This table is a list of related topics:

Topic |  Details
--------- | --------- |
Steps to upgrade from Azure AD Connect | Different methods to [upgrade from a previous version to the latest](how-to-upgrade-previous-version.md) Azure AD Connect release.
Required permissions | For permissions required to apply an update, see [accounts and permissions](reference-connect-accounts-permissions.md#upgrade).
Download| [Download Azure AD Connect](https://go.microsoft.com/fwlink/?LinkId=615771).

>[!NOTE]
>Releasing a new version of Azure AD Connect is a process that requires several quality control step to ensure the operation functionality of the service, and while we go through this process the version number of a new release as well as the release status will be updated to reflect the most recent state.
While we go through this process, the version number of the release will be shown with an "X" in the minor release number position, as in "1.3.X.0" - this indicates that the release notes in this document are valid for all versions beginning with "1.3.". As soon as we have finalized the release process the release version number will be updated to the most recently released version and the release status will be updated to "Released for download and auto upgrade".
Not all releases of Azure AD Connect will be made available for auto upgrade. The release status will indicate whether a release is made available for auto upgrade or for download only. If auto upgrade was enabled on your Azure AD Connect server then that server will automatically upgrade to the latest version of Azure AD Connect that is released for auto upgrade. Note that not all Azure AD Connect configurations are eligible for auto upgrade. 

To clarify the use of Auto Upgrade, it is meant to push all important updates and critical fixes to you. This is not necessarily the latest version because not all versions will require/include a fix to a critical security issue (just one example of many). An issue like that would be addressed with a new version provided via Auto Upgrade. If there are no such issues, there are no updates pushed out using Auto Upgrade, and in general if you are using the latest auto upgrade version you should be good.
However, if you’d like all the latest features and updates, the best way to see if there are any is to check this page and install them as you see fit. 

Please follow this link to read more about [auto upgrade](how-to-connect-install-automatic-upgrade.md)

>[!IMPORTANT]
> Starting on April 1st, 2024, we will retire versions of Azure AD Connect that were released before May 1st, 2018 - version 1.1.751.0 and older. 
>
> You need to make sure you are running a recent version of Azure AD Connect to receive an optimal support experience. 
>
>If you run a retired version of Azure AD Connect you may not have the latest security fixes, performance improvements, troubleshooting and diagnostic tools and service enhancements, and if you require support we may not be able to provide you with the level of service your organization needs.
>

>
>Please refer to [this article](./how-to-upgrade-previous-version.md) to learn more about how to upgrade Azure AD Connect to the latest version.
>
>For version history information on retired versions, see [Azure AD Connect version release history archive](reference-connect-version-history-archive.md)

## 1.6.4.0

>[!NOTE]
> The Azure AD Connect sync V2 endpoint API is now available in these Azure environments:
> - Azure Commercial
> - Azure China cloud
> - Azure US Government cloud
> It will not be made available in the Azure German cloud

### Release status
3/31/2021: Released for download only, not available for auto upgrade

### Bug fixes
- This release fixes a bug in version 1.6.2.4 where, after upgrade to that release, the Azure AD Connect Health feature was not registered correctly and did not work. Customers who have deployed build 1.6.2.4 are requested to update their Azure AD Connect server with this build, which will correctly register the Health feature. 

## 1.6.2.4
>[!IMPORTANT]
> Update per March 30, 2021: we have discovered an issue in this build. After installation of this build, the Health services are not registered. We recommend not installing this build. We will release a hotfix shortly.
> If you already installed this build, you can manually register the Health services by using the cmdlet as shown in [this article](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-health-agent-install#manually-register-azure-ad-connect-health-for-sync)

>[!NOTE]
> - This release will be made available for download only.
> - The upgrade to this release will require a full synchronization due to sync rule changes.
> - This release defaults the AADConnect server to the new V2 end point. Note that this end point is not supported in the German national cloud and if you need to deploy this version in this environment you need to follow [these instructions](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-sync-endpoint-api-v2#rollback) to switch back to the V1 end point. Failure to do so will result in errors in synchronization.

### Release status
3/19/2021: Released for download, not available for auto upgrade

### Functional changes

 - Updated default sync rules to limit membership in written back groups to 50k members.
   - Added new default sync rules for limiting membership count in group writeback (Out to AD - Group Writeback Member Limit) and group sync to Azure Active Directory (Out to AAD - Group Writeup Member Limit) groups.
   - Added member attribute to the 'Out to AD - Group SOAInAAD - Exchange' rule to limit members in written back groups to 50k
 - Updated Sync Rules to support Group Writeback v2
   -If the “In from AAD - Group SOAInAAD” rule is cloned and AADConnect is upgraded.
     -The updated rule will be disabled by default and so the targetWritebackType will be null.
     - AADConnect will writeback all Cloud Groups (including Azure Active Directory Security Groups enabled for writeback) as Distribution Groups.
   -If the “Out to AD - Group SOAInAAD” rule is cloned and AADConnect is upgraded.
     - The updated rule will be disabled by default. However, a new sync rule “Out to AD - Group SOAInAAD - Exchange” which is added will be enabled.
     - Depending on the Cloned Custom Sync Rule's precedence, AADConnect will flow the Mail and Exchange attributes.
     - If the Cloned Custom Sync Rule does not flow some Mail and Exchange attributes, then new Exchange Sync Rule will add those attributes.
 - Added support for [Selective Password hash Synchronization](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-selective-password-hash-synchronization)
 - Added the new [Single Object Sync cmdlet](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-single-object-sync). Use this cmdlet to troubleshoot your Azure AD Connect sync configuration. 
 -  Azure AD Connect now supports the Hybrid Identity Administrator role for configuring the service.
 - Updated AADConnectHealth agent to 3.1.83.0
 - New version of the [ADSyncTools PowerShell module](https://docs.microsoft.com/azure/active-directory/hybrid/reference-connect-adsynctools), which has several new or improved cmdlets. 
 
   - Clear-ADSyncToolsMsDsConsistencyGuid
   - ConvertFrom-ADSyncToolsAadDistinguishedName
   - ConvertFrom-ADSyncToolsImmutableID
   - ConvertTo-ADSyncToolsAadDistinguishedName
   - ConvertTo-ADSyncToolsCloudAnchor
   - ConvertTo-ADSyncToolsImmutableID
   - Export-ADSyncToolsAadDisconnectors
   - Export-ADSyncToolsObjects
   - Export-ADSyncToolsRunHistory
   - Get-ADSyncToolsAadObject
   - Get-ADSyncToolsMsDsConsistencyGuid
   - Import-ADSyncToolsObjects
   - Import-ADSyncToolsRunHistory
   - Remove-ADSyncToolsAadObject
   - Search-ADSyncToolsADobject
   - Set-ADSyncToolsMsDsConsistencyGuid
   - Trace-ADSyncToolsADImport
   - Trace-ADSyncToolsLdapQuery

 - Updated error logging for token acquisition failures.
 - Updated 'Learn more' links on the configuration page to give more detail on the linked information.
 - Removed Explicit column from CS Search page in the Old Sync UI
 - Additional UI has been added to the Group Writeback flow to prompt the user for credentials or to configure their own permissions using the ADSyncConfig module if credentials have not already been provided in an earlier step.
 - Auto-create MSA for ADSync Service Account on a DC. 
 - 	Added ability to set and get Azure Active Directory DirSync feature Group Writeback V2 in the existing cmdlets:
    - Set-ADSyncAADCompanyFeature
    - Get-ADSyncAADCompanyFeature
 - Added 2 cmdlets to read AWS API version
    - Get-ADSyncAADConnectorImportApiVersion - to get import AWS API version
    - Get-ADSyncAADConnectorExportApiVersion - to get export AWS API version

 - Changes made to synchronization rules are now tracked to assist troubleshooting changes in the service. The cmdlet "Get-ADSyncRuleAudit" will retrieve tracked changes.
 - Updated the Add-ADSyncADDSConnectorAccount cmdlet in the the [ADSyncConfig PowerShell module](https://docs.microsoft.com/azure/active-directory/hybrid/how-to-connect-configure-ad-ds-connector-account#using-the-adsyncconfig-powershell-module) to allow a user in ADSyncAdmin group to change the AD DS Connector account. 

### Bug fixes
 - Updated disabled foreground color to satisfy luminosity requirements on a white background. Added additional conditions for navigation tree to set foreground text color to white when a disabled page is selected to satisfy luminosity requirements.
 - Increase granularity for Set-ADSyncPasswordHashSyncPermissions cmdlet - Updated PHS permissions script (Set-ADSyncPasswordHashSyncPermissions) to include an optional "ADobjectDN" parameter. 
 - Accessibility bug fix. The screen reader would now describe the UX element that holds the list of forests as "**Forests list**" instead of "**Forest List list**"
 - Updated screen reader output for some items in the Azure AD Connect wizard. Updated button hover color to satisfy contrast requirements. Updated Synchronization Service Manager title color to satisfy contrast requirements.
 - Fixed an issue with installing AADConnect from exported configuration having custom extension attributes - Added a condition to skip checking for extension attributes in the target schema while applying the sync rule.
 - Appropriate permissions are added on install if the Group Writeback feature is enabled.
 - Fix duplicate default sync rule precedence on import
 - Fixed an issue that caused a staging error during V2 API delta import for a conflicting object that was repaired via the health portal.
 - Fixed an issue in the sync engine that caused CS objects to have an inconsistent link state
 - Added import counters to Get-ADSyncConnectorStatistics output.
 - Fixed unreachable domain de-selection(selected previously) issue in some corner cases during pass2 wizard.
 - Modified policy import and export to fail if custom rule has duplicate precedence 
 - Fixed a bug in the domain selection logic.
 - Fixes an issue with build 1.5.18.0 if you use mS-DS-ConsistencyGuid as the source anchor and have clone the In from AD - Group Join rule.
 - Fresh AADConnect installs will use the Export Deletion Threshold stored in the cloud if there is one available and there is not a different one passed in.
 - Fixed issue where AADConnect does not read AD displayName changes of hybrid-joined devices

## 1.5.45.0

### Release status
07/29/2020: Released for download

### Functional changes
This is a bug fix release. There are no functional changes in this release.

### Fixed issues

- Fixed an issue where admin can’t enable “Seamless Single Sign On” if AZUREADSSOACC computer account is already present in the “Active Directory”.
- Fixed an issue that caused a staging error during V2 API delta import for a conflicting object that was repaired via the health portal.
- Fixed an issue in the import/export configuration where disabled custom rule was imported as enabled.

## 1.5.42.0

### Release status
07/10/2020: Released for download

### Functional changes
This release includes a public preview of the functionality to export the configuration of an existing Azure AD Connect server into a .JSON file which can then be used when installing a new Azure AD Connect server to create a copy of the original server.

A detailed description of this new feature can be found in [this article](./how-to-connect-import-export-config.md)

### Fixed issues
- Fixed a bug where there would be a false warning about the local DB size on the localized builds during upgrade.
- Fixed a bug where there would be a false error in the app events for the account name/domain name swap.
- Fixed an error where Azure AD Connect would fail to install on a DC, giving error "member not found".


## 1.5.30.0

### Release status
05/07/2020: Released for download

### Fixed issues
This hotfix build fixes an issue where unselected domains were getting incorrectly selected from the wizard UI if only grandchild containers were selected.


>[!NOTE]
>This version includes the new Azure AD Connect sync V2 endpoint API.  This new V2 endpoint is currently in public preview.  This version or later is required to use the new V2 endpoint API.  However, simply installing this version does not enable the V2 endpoint. You will continue to use the V1 endpoint unless you enable the V2 endpoint.  You need to follow the steps under [Azure AD Connect sync V2 endpoint API (public preview)](how-to-connect-sync-endpoint-api-v2.md) in order to enable it and opt-in to the public preview.  

## 1.5.29.0

### Release status
04/23/2020: Released for download

### Fixed issues
This hotfix build fixes an issue introduced in build 1.5.20.0 where a tenant administrator with MFA was not able to enable DSSO.

## 1.5.22.0

### Release status
04/20/2020: Released for download

### Fixed issues
This hotfix build fixes an issue in build 1.5.20.0 if you have cloned the **In from AD - Group Join** rule and have not cloned the **In from AD - Group Common** rule.

## 1.5.20.0

### Release status
04/09/2020: Released for download

### Fixed issues
- This hotfix build fixes an issue with build 1.5.18.0 if you have the Group Filtering feature enabled and use mS-DS-ConsistencyGuid as the source anchor.
- Fixed an issue in the ADSyncConfig PowerShell module, where invoking DSACLS command used in all the Set-ADSync* Permissions cmdlets would cause one of the following errors:
     - `GrantAclsNoInheritance : The parameter is incorrect.   The command failed to complete successfully.`
     - `GrantAcls : No GUID Found for computer …`

> [!IMPORTANT]
> If you have cloned the **In from AD - Group Join** sync rule and have not cloned the **In from AD - Group Common** sync rule and plan to upgrade, complete the following steps as part of the upgrade:
> 1. During Upgrade, uncheck the option **Start the synchronization process when configuration completes**.
> 2. Edit the cloned join sync rule and add the following two transformations:
>     - Set direct flow `objectGUID` to `sourceAnchorBinary`.
>     - Set expression flow `ConvertToBase64([objectGUID])` to `sourceAnchor`.     
> 3. Enable the scheduler using `Set-ADSyncScheduler -SyncCycleEnabled $true`.



## 1.5.18.0

### Release status
04/02/2020: Released for download

### Functional changes ADSyncAutoUpgrade 

- Added support for the mS-DS-ConsistencyGuid feature for group objects. This allows you to move groups between forests or reconnect groups in AD to Azure AD where the AD group objectID has changed, e.g. when an AD server is rebuilt after a calamity. For more information see [Moving groups between forests](how-to-connect-migrate-groups.md).
- The mS-DS-ConsistencyGuid attribute is automatically set on all synced groups and you do not have to do anything to enable this feature. 
- Removed the Get-ADSyncRunProfile because it is no longer in use. 
- Changed the warning you see when attempting to use an Enterprise Admin or Domain Admin account for the AD DS connector account to provide more context. 
- Added a new cmdlet to remove objects from the connector space the old CSDelete.exe tool is removed, and it is replaced with the new Remove-ADSyncCSObject cmdlet. The Remove-ADSyncCSObject cmdlet takes a CsObject as input. This object can be retrieved by using the Get-ADSyncCSObject cmdlet.

>[!NOTE]
>The old CSDelete.exe tool has been removed and replaced with the new Remove-ADSyncCSObject cmdlet 

### Fixed issues

- Fixed a bug in the group writeback forest/OU selector on rerunning the Azure AD Connect wizard after disabling the feature. 
- Introduced a new error page that will be displayed if the required DCOM registry values are missing with a new help link. Information is also written to log files. 
- Fixed an issue with the creation of the Azure Active Directory synchronization account where enabling Directory Extensions or PHS may fail because the account has not propagated across all service replicas before attempted use. 
- Fixed a bug in the sync errors compression utility that was not handling surrogate characters correctly. 
- Fixed a bug in the auto upgrade which left the server in the scheduler suspended state. 

## 1.4.38.0
### Release status
12/9/2019: Release for download. Not available through auto-upgrade.
### New features and improvements
- We updated Password Hash Sync for Azure AD Domain Services to properly account for padding in Kerberos hashes.  This will provide a performance improvement during password synchronization from Azure AD to Azure AD Domain Services.
- We added support for reliable sessions between the authentication agent and service bus.
- This release enforces TLS 1.2 for communication between authentication agent and cloud services.
- We added a DNS cache for websocket connections between authentication agent and cloud services.
- We added the ability to target specific agent from cloud to test for agent connectivity.

### Fixed issues
- Release 1.4.18.0 had a bug where the PowerShell cmdlet for DSSO was using the login windows credentials instead of the admin credentials provided while running ps. As a result of which it was not possible to enable DSSO in multiple forest through the Azure AD Connect user interface. 
- A fix was made to enable DSSO simultaneously in all forest through the Azure AD Connect user interface

## 1.4.32.0
### Release status
11/08/2019: Released for download. Not available through auto-upgrade.

>[!IMPORTANT]
>Due to an internal schema change in this release of Azure AD Connect, if you manage AD FS trust relationship configuration settings using MSOnline PowerShell then you must update your MSOnline PowerShell module to version 1.1.183.57 or higher

### Fixed issues

This version fixes an issue with existing Hybrid Azure AD joined devices. This release contains a new device sync rule that corrects this issue.
Note that this rule change may cause deletion of obsolete devices from Azure AD. This is not a cause for concern, as these device objects are not used by Azure AD during Conditional Access authorization. For some customers, the number of devices that will be deleted through this rule change can exceed the deletion threshold. If you see the deletion of device objects in Azure AD exceeding the Export Deletion Threshold, it is advised to allow the deletions to go through. [How to allow deletes to flow when they exceed the deletion threshold](how-to-connect-sync-feature-prevent-accidental-deletes.md)

## 1.4.25.0

### Release status
9/28/2019: Released for auto-upgrade to select tenants. Not available for download.

This version fixes a bug where some servers that were auto-upgraded from a previous version to 1.4.18.0 and experienced issues with Self-service password reset (SSPR) and Password Writeback.

### Fixed issues

Under certain circumstances, servers that were auto upgraded to version 1.4.18.0 did not re-enable Self-service password reset and Password Writeback after the upgrade was completed. This auto upgrade release fixes that issue and re-enables Self-service password reset and Password Writeback.

We fixed a bug in the sync errors compression utility that was not handling surrogate characters correctly.

## 1.4.18.0

>[!WARNING]
>We are investigating an incident where some customers are experiencing an issue with existing Hybrid Azure AD joined devices after upgrading to this version of Azure AD Connect. We advise customers who have deployed Hybrid Azure AD join to postpone upgrading to this version until the root cause of these issues are fully understood and mitigated. More information will be provided as soon as possible.

>[!IMPORTANT]
>With this version of Azure AD Connect some customers may see some or all of their Windows devices disappear from Azure AD. This is not a cause for concern, as these device identities are not used by Azure AD during Conditional Access authorization. For more information see [Understanding Azure AD Connect 1.4.xx.x device disappearnce](reference-connect-device-disappearance.md)


### Release status
9/25/2019: Released for auto-upgrade only.

### New features and improvements
- New troubleshooting tooling helps troubleshoot "user not syncing", "group not syncing" or "group member not syncing" scenarios.
- Add support for national clouds in Azure AD Connect troubleshooting script.
- Customers should be informed that the deprecated WMI endpoints for MIIS_Service have now been removed. Any WMI operations should now be done via PS cmdlets.
- Security improvement by resetting constrained delegation on AZUREADSSOACC object.
- When adding/editing a sync rule, if there are any attributes used in the rule that are in the connector schema but not added to the connector, the attributes automatically added to the connector. The same is true for the object type the rule affects. If anything is added to the connector, the connector will be marked for full import on the next sync cycle.
- Using an Enterprise or Domain admin as the connector account is no longer supported in new Azure AD Connect Deployments. Current Azure AD Connect deployments using an Enterprise or Domain admin as the connector account will not be affected by this release.
- In the Synchronization Manager a full sync is run on rule creation/edit/deletion. A popup will appear on any rule change notifying the user if full import or full sync is going to be run.
- Added mitigation steps for password errors to 'connectors > properties > connectivity' page.
- Added a deprecation warning for the sync service manager on the connector properties page. This warning notifies the user that changes should be made through the Azure AD Connect wizard.
- Added new error for issues with a user's password policy.
- Prevent misconfiguration of  group filtering by domain and OU filters. Group filtering will show an error when the domain/OU of the entered group is already filtered out and keep the user from moving forward until the issue is resolved.
- Users can no longer create a connector for Active Directory Domain Services or Windows Azure Active Directory in the Synchronization Service Manager UI.
- Fixed accessibility of custom UI controls in the Synchronization Service Manager.
- Enabled six federation management tasks for all sign-in methods in Azure AD Connect.  (Previously, only the “Update AD FS TLS/SSL certificate” task was available for all sign-ins.)
- Added a warning when changing the sign-in method from federation to PHS or PTA that all Azure AD domains and users will be converted to managed authentication.
- Removed token-signing certificates from the “Reset Azure AD and AD FS trust” task and added a separate sub-task to update these certificates.
- Added a new federation management task called “Manage certificates” which has sub-tasks to update the TLS or token-signing certificates for the AD FS farm.
- Added a new federation management sub-task called “Specify primary server” which allows administrators to specify a new primary server for the AD FS farm.
- Added a new federation management task called “Manage servers” which has sub-tasks to deploy an AD FS server, deploy a Web Application Proxy server, and specify primary server.
- Added a new federation management task called “View federation configuration” that displays the current AD FS settings.  (Because of this addition, AD FS settings have been removed from the “Review your solution” page.)

### Fixed issues
- Resolved sync error issue for the scenario where a user object taking over its corresponding contact object has a self-reference (e.g. user is their own manager).
- Help popups now show on keyboard focus.
- For Auto upgrade, if any conflicting app is running from 6 hours, kill it and continue with upgrade.
- Limit the number of attributes a customer can select to 100 per object when selecting directory extensions. This will prevent the error from occurring during export as Azure has a maximum of 100 extension attributes per object.
- Fixed a bug to make the AD Connectivity script more robust.
- Fixed a bug to make Azure AD Connect install on a machine using an existing Named Pipes WCF service more robust.
- Improved diagnostics and troubleshooting around group policies that do not allow the ADSync service to start when initially installed.
- Fixed a bug where display name for a Windows computer was written incorrectly.
- Fix a bug where OS type for a Windows computer was written incorrectly.
- Fixed a bug where non-Windows 10 computers were syncing unexpectedly. Note that the effect of this change is that non-Windows-10 computers that were previously synced will now be deleted. This does not affect any features as the sync of Windows computers is only used for Hybrid Azure AD domain join, which only works for Windows-10 devices.
- Added several new (internal) cmdlets to the ADSync PowerShell module.


## 1.3.21.0
>[!IMPORTANT]
>There is a known issue with upgrading Azure AD Connect from an earlier version to 1.3.21.0 where the Microsoft 365 portal does not reflect the updated version even though Azure AD Connect upgraded successfully.
>
> To resolve this, you need to import the **AdSync** module and then run the `Set-ADSyncDirSyncConfiguration` PowerShell cmdlet on the Azure AD Connect server.  You can use the following steps:
>
>1.	Open PowerShell in administrator mode.
>2.	Run `Import-Module "ADSync"`.
>3.	Run `Set-ADSyncDirSyncConfiguration -AnchorAttribute ""`.
 
### Release status 

05/14/2019: Released for download

### Fixed issues 

- Fixed an elevation of privilege vulnerability that exists in Microsoft Azure Active Directory Connect build 1.3.20.0.  This vulnerability, under certain conditions, may allow an attacker to execute two PowerShell cmdlets in the context of a privileged account, and perform privileged actions.  This security update addresses the issue by disabling these cmdlets. For more information see [security update](https://portal.msrc.microsoft.com/security-guidance/advisory/CVE-2019-1000).


## Next steps
Learn more about [Integrating your on-premises identities with Azure Active Directory](whatis-hybrid-identity.md).
