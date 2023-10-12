---
title: 'Microsoft Entra Connect: Version release history'
description: This article lists all releases of Microsoft Entra Connect and Azure AD Sync.
author: billmath
ms.assetid: ef2797d7-d440-4a9a-a648-db32ad137494
ms.service: active-directory
manager: amycolannino
ms.topic: reference
ms.workload: identity
ms.date: 7/6/2022
ms.subservice: hybrid
ms.author: billmath
ms.custom: has-adal-ref, has-azure-ad-ps-ref
ms.collection: M365-identity-device-management
---

# Microsoft Entra Connect: Version release history

The Microsoft Entra team regularly updates Microsoft Entra Connect with new features and functionality. Not all additions apply to all audiences.

This article helps you keep track of the versions that have been released and understand what the changes are in the latest version.

## Looking for the latest versions?

You can upgrade your Microsoft Entra Connect server from all supported versions with the latest versions:

You can download the latest version of Microsoft Entra Connect 2.0 from the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=47594). See the [release notes for the latest V2.0 release](reference-connect-version-history.md#21200).\

Get notified about when to revisit this page for updates by copying and pasting this URL: `https://aka.ms/aadconnectrss` into your ![RSS feed reader icon](media/reference-connect-version-history/feed-icon-16x16.png) feed reader.

The following table lists related topics:

Topic |  Details
--------- | --------- |
Steps to upgrade from Microsoft Entra Connect | Different methods to [upgrade from a previous version to the latest](how-to-upgrade-previous-version.md) Microsoft Entra Connect release.
Required permissions | For permissions required to apply an update, see [Microsoft Entra Connect: Accounts and permissions](reference-connect-accounts-permissions.md#upgrade).

<a name='retiring-azure-ad-connect-1x-versions'></a>

## Retiring Microsoft Entra Connect 1.x versions
> [!IMPORTANT]
> Action required: Synchronization will stop working on October 1, 2023, for any customers still running Microsoft Entra Connect Sync V1.  Customers using cloud sync or Microsoft Entra Connect V2 will remain fully operational with no action required. For more information and next step guidance, see [Decommission Azure AD Connect V1](https://aka.ms/DecommissionAADConnectV1) if an upgrade is required.

<a name='retiring-azure-ad-connect-2x-versions'></a>

## Retiring Microsoft Entra Connect 2.x versions
> [!IMPORTANT]
> We will begin retiring past versions of Microsoft Entra Connect Sync 2.x 12 months from the date they are superseded by a newer version. 
> This policy will go into effect on 15 March 2023, when we will retire all versions that are superseded by a newer version on 15 March 2022.
> 
> Currently only builds 2.1.16.0 (release August 8th 2022) or later are supported.
> 
> If you are not already using the latest release version of Microsoft Entra Connect Sync, you should upgrade your Microsoft Entra Connect Sync software before that date. 


If you run a retired version of Microsoft Entra Connect, it might unexpectedly stop working. You also might not have the latest security fixes, performance improvements, troubleshooting and diagnostic tools, and service enhancements. If you require support, we might not be able to provide you with the level of service your organization needs.

To learn more about what has changed in V2.0 and how this change affects you, see [Microsoft Entra Connect V2.0](whatis-azure-ad-connect-v2.md).

To learn more about how to upgrade Microsoft Entra Connect to the latest version, see [Microsoft Entra Connect: Upgrade from a previous version to the latest](./how-to-upgrade-previous-version.md).

For version history information on retired versions, see [Microsoft Entra Connect: Version release history archive](reference-connect-version-history-archive.md).

> [!NOTE]
> Releasing a new version of Microsoft Entra Connect requires several quality-control steps to ensure the operation functionality of the service. While we go through this process, the version number of a new release and the release status are updated to reflect the most recent state.

Not all releases of Microsoft Entra Connect are made available for autoupgrade. The release status indicates whether a release is made available for autoupgrade or for download only. If autoupgrade was enabled on your Microsoft Entra Connect server, that server automatically upgrades to the latest version of Microsoft Entra Connect that's released for autoupgrade. Not all Microsoft Entra Connect configurations are eligible for autoupgrade.

Auto-upgrade is meant to push all important updates and critical fixes to you. It isn't necessarily the latest version because not all versions will require or include a fix to a critical security issue. (This example is just one of many.) Critical issues are usually addressed with a new version provided via autoupgrade. If there are no such issues, there are no updates pushed out by using autoupgrade. In general, if you're using the latest autoupgrade version, you should be good.

If you want all the latest features and updates, check this page and install what you need.

To read more about autoupgrade, see [Microsoft Entra Connect: Automatic upgrade](how-to-connect-install-automatic-upgrade.md).

## 2.2.1.0

### Release status
6/19/2023: Released for download.

### Functional Changes
 - We have enabled Auto Upgrade for tenants with custom synchronization rules. Note that deleted (not disabled) default rules will be re-created and enabled upon Auto Upgrade.
 - We have added Microsoft Entra Connect Agent Updater service to the install. This new service will be used for future auto upgrades.
 - We have removed the Synchronization Service WebService Connector Config program from the install.
 - Default sync rule “In from AD – User Common” was updated to flow the employeeType attribute.

### Bug Fixes
 - We have made improvements to accessibility.
 - We have made the Microsoft Privacy Statement accessible in more places.





## 2.1.20.0

### Release status: 
11/9/2022: Released for download

### Bug fixes

- We fixed a bug where the new employeeLeaveDateTime attribute wasn't syncing correctly in version 2.1.19.0. Note that if the incorrect attribute was already used in a rule, then the rule must be updated with the new attribute and any objects in the Microsoft Entra connector space that have the incorrect attribute must be removed with the "Remove-ADSyncCSObject" cmdlet, and then a full sync cycle must be run.

## 2.1.19.0

### Release status: 
11/2/2022: Released for download

### Functional changes

- We added a new attribute 'employeeLeaveDateTime' for syncing to Microsoft Entra ID. To learn more about how to use this attribute to manage your users' life cycles, please refer to [this article](../../governance/how-to-lifecycle-workflow-sync-attributes.md)

### Bug fixes

- we fixed a bug where Microsoft Entra Connect Password writeback stopped with error code "SSPR_0029 ERROR_ACCESS_DENIED"

## 2.1.18.0

### Release status: 
10/5/2022: Released for download

### Bug fixes
 - we fixed a bug where upgrade from version 1.6 to version 2.1 got stuck in a loop due to IsMemberOfLocalGroup enumeration.
 - we fixed a bug where the Microsoft Entra Connect Configuration Wizard was sending incorrect credentials (username format) while validating if Enterprise Admin. 

## 2.1.16.0

### Release status
8/2/2022: Released for download and autoupgrade.

### Bug fixes
- We fixed a bug where autoupgrade fails when the service account is in "UPN" format.

## 2.1.15.0

### Release status
7/6/2022: Released for download, will be made available for autoupgrade soon.

> [!IMPORTANT] 
> We have discovered a security vulnerability in the Microsoft Entra Connect Admin Agent. If you have installed the Admin Agent previously it is important that you update your Microsoft Entra Connect server(s) to this version to mitigate the vulnerability.

### Functional changes
 - We have removed the public preview functionality for the Admin Agent from Microsoft Entra Connect. We won't provide this functionality going forward.
 - We added support for two new attributes: employeeOrgDataCostCenter and employeeOrgDataDivision.
 - We added CertificateUserIds attribute to Microsoft Entra Connector static schema.
 - The Microsoft Entra Connect wizard will now abort if write event logs permission is missing.
 - We updated the AADConnect health endpoints to support the US government clouds.
 - We added new cmdlets “Get-ADSyncToolsDuplicateUsersSourceAnchor and Set-ADSyncToolsDuplicateUsersSourceAnchor“ to fix bulk "source anchor has changed" errors. When a new forest is added to AADConnect with duplicate user objects, the objects are running into bulk "source anchor has changed" errors. This is happening due to the mismatch between msDsConsistencyGuid & ImmutableId. More information about this module and the new cmdlets can be found in [this article](./reference-connect-adsynctools.md).

### Bug fixes
 - We fixed a bug that prevented localDB upgrades in some Locales.
 - We fixed a bug to prevent database corruption when using localDB.
 - We added timeout and size limit errors to the connection log.
 - We fixed a bug where, if child domain has a user with same name as parent domain user that happens to be an enterprise admin, the group membership failed.
 - We updated the expressions used in the "In from Microsoft Entra ID - Group SOAInAAD" rule to limit the description attribute to 448 characters.
 - We made a change to set extended rights for "Unexpire Password" for Password Reset.
 - We modified the AD connector upgrade to refresh the schema – we no longer show constructed and non-replicated attributes in the Wizard during upgrade.
 - We fixed a bug in ADSyncConfig functions ConvertFQDNtoDN and ConvertDNtoFQDN - If a user decides to set variables called '$dn' or '$fqdn', these variables will no longer be used inside the script scope.
 - We made the following Accessibility fixes:
   - Fixed a bug where Focus is lost during keyboard navigation on Domain and OU Filtering page.
   - We updated the accessible name of Clear Runs drop down.
   - We fixed a bug where the tooltip of the "Help" button isn't accessible through keyboard if navigated with arrow keys. 
   - We fixed a bug where the underline of hyperlinks was missing on the Welcome page of the wizard.
   - We fixed a bug in Sync Service Manager's About dialog where the Screen reader isn't announcing the information about the data appearing under the "About" dialog box.
   - We fixed a bug where the Management Agent Name wasn't mentioned in logs when an error occurred while validating MA Name.
   - We fixed several accessibility issues with the keyboard navigation and custom control type fixes. The Tooltip of the "help" button isn't collapsing by pressing "Esc" key. There was an Illogical keyboard focus on the User Sign In radio buttons and there was an invalid control type on the help popups.
   - We fixed a bug where an empty label was causing an accessibility error.

## 2.1.1.0

### Release status
3/24/2022: Released for download only, not available for auto upgrade

### Bug fixes
 - Fixed an issue where some sync rule functions weren't parsing surrogate pairs properly.
 - Fixed an issue where, under certain circumstances, the sync service wouldn't start due to a model db corruption. You can read more about the model db corruption issue in [this article](/troubleshoot/azure/active-directory/resolve-model-database-corruption-sqllocaldb)

## 2.0.91.0

### Release status

01/19/2022: Released for download only, not available for auto upgrade

### Functional changes

- We updated the Microsoft Entra Connect Health component in this release from version 3.1.110.0 to version 3.2.1823.12. This new version provides compliance of the Microsoft Entra Connect Health component with the [Federal Information Processing Standards (FIPS)](https://www.nist.gov/standardsgov/compliance-faqs-federal-information-processing-standards-fips) requirements. 

## 2.0.89.0

### Release status

12/22/2021: Released for download only, not available for auto upgrade

### Bug fixes

- We fixed a bug in version 2.0.88.0 where, under certain conditions, linked mailboxes of disabled users and mailboxes of certain resource objects, were getting deleted.
- We fixed an issue which causes upgrade to Microsoft Entra Connect version 2.x to fail, when using SQL localdb along with a VSA service account for ADSync.

## 2.0.88.0

> [!NOTE]
> This release requires Windows Server 2016 or newer. It fixes a vulnerability that's present in version 2.0 of Microsoft Entra Connect and other bug fixes and minor feature updates.

### Release status

12/15/2021: Released for download only, not available for autoupgrade

### Bug fixes

- We upgraded the version of Microsoft.Data.OData from 5.8.1 to 5.8.4 to fix a vulnerability.
- Accessibility fixes:
  - We made the Microsoft Entra Connect wizard resizable to account for different zoom levels and screen resolutions.
  - We named elements to satisfy accessibility requirements.
- We fixed a bug where miisserver failed because of a null reference.
- We fixed a bug to ensure the desktop SSO value persists after upgrading Microsoft Entra Connect to a newer version.
- We modified the inetorgperson sync rules to fix an issue with account/resource forests.
- We fixed a radio button test to display a **Link More** link.

### Functional changes

- We made a change so that group writeback DN is now configurable with the display name of the synced group.
- We removed the hard requirement for exchange schema when you enable group writeback.
- Microsoft Entra Kerberos changes:
  - We extended the PowerShell command to support custom top-level names for trusted object creation.
  - We made a change to set an official brand name for the Microsoft Entra Kerberos feature.

## 1.6.16.0

> [!NOTE]
> This release is an update release of Microsoft Entra Connect. This version is intended to be used by customers who are running an older version of Windows Server and can't upgrade their server to Windows Server 2016 or newer at this time. You can't use this version to update a Microsoft Entra Connect V2.0 server.
>
> Don't install this release on Windows Server 2016 or newer. This release includes SQL Server 2012 components and will be retired on August 31, 2022. Upgrade your Server OS and Microsoft Entra Connect version before that date.
>
> When you upgrade to this V1.6 build or any newer builds, the group membership limit resets to 50,000. When a server is upgraded to this build, or any newer 1.6 builds, reapply the rule changes you applied when you initially increased the group membership limit to 250,000 before you enable sync for the server.

### Release status

10/13/2021: Released for download and autoupgrade

### Bug fixes

- We fixed a bug where the autoupgrade process attempted to upgrade Microsoft Entra Connect servers that are running older Windows OS version 2008 or 2008 R2 and failed. These versions of Windows Server are no longer supported. In this release, we only attempt autoupgrade on machines that run Windows Server 2012 or newer.
- We fixed an issue where, under certain conditions, miisserver failed because of an access violation exception.

### Known issues

When you upgrade to this V1.6 build or any newer builds, the group membership limit resets to 50,000. When a server is upgraded to this build, or any newer 1.6 builds, reapply the rule changes you applied when you initially increased the group membership limit to 250,000 before you enable sync for the server.

## 2.0.28.0

> [!NOTE]
> This release is a maintenance update release of Microsoft Entra Connect. It requires Windows Server 2016 or newer.

### Release status

9/30/2021: Released for download only, not available for autoupgrade

### Bug fixes

- We removed a download button for a PowerShell script on the **Group Writeback Permissions** page in the wizard. We also changed the text on the wizard page to include a **Learn More** link that links to an online article where the PowerShell script can be found.
- We fixed a bug where the wizard was incorrectly blocking the installation when the .NET version on the server was greater than 4.6 because of missing registry keys. Those registry keys aren't required and should only block installation if they're intentionally set to false.
- We fixed a bug where an error was thrown if phantom objects were found during the initialization of a sync step. This bug blocked the sync step or removed transient objects. The phantom objects are now ignored.

  A phantom object is a placeholder for an object that isn't there or hasn't been seen yet. For example, if a source object has a reference for a target object that isn't there, we create the target object as a phantom.

### Functional changes

A change was made that allows a user to deselect objects and attributes from the inclusion list, even if they're in use. Instead of blocking this action, we now provide a warning.

## 1.6.14.2

> [!NOTE]
> This release is an update release of Microsoft Entra Connect. This version is intended to be used by customers who are running an older version of Windows Server and can't upgrade their server to Windows Server 2016 or newer at this time. You can't use this version to update a Microsoft Entra Connect V2.0 server.

We'll begin auto-upgrading eligible tenants when this version is available for download. Auto-upgrade will take a few weeks to complete.

When you upgrade to this V1.6 build or any newer builds, the group membership limit resets to 50,000. When a server is upgraded to this build, or any newer 1.6 builds, reapply the rule changes you applied when you initially increased the group membership limit to 250,000 before you enable sync for the server.

### Release status

9/21/2021: Released for download and autoupgrade

### Functional changes

- We added the latest versions of Microsoft Identity Manager (MIM) Connectors (1.1.1610.0). For more information, see the [release history page of the MIM Connectors](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-version-history#1116100-september-2021).
- We added a configuration option to disable the Soft Matching feature in Microsoft Entra Connect. We recommend that you disable Soft Matching unless you need it to take over cloud-only accounts. To disable Soft Matching, see [this reference article](../../hybrid/connect/how-to-connect-install-existing-tenant#hard-match-vs-soft-match).

### Bug fixes

- We fixed a bug where the desktop single sign-on settings weren't persisted after upgrade from a previous version.
- We fixed a bug that caused the Set-ADSync\*Permission cmdlets to fail.

## 2.0.25.1

> [!NOTE]
> This release is a hotfix update release of Microsoft Entra Connect. This release requires Windows Server 2016 or newer. It fixes a security issue that's present in version 2.0 of Microsoft Entra Connect and includes other bug fixes.

### Release status

9/14/2021: Released for download only, not available for autoupgrade

### Bug fixes

- We fixed a security issue where an unquoted path was used to point to the Microsoft Entra Connect service. This path is now a quoted path.
- We fixed an import configuration issue with writeback enabled when you use the existing Microsoft Entra Connector account.
- We fixed an issue in Set-ADSyncExchangeHybridPermissions and other related cmdlets, which were broken from V1.6 because of an invalid inheritance type.
- We fixed an issue with the cmdlet we published in a previous release to set the TLS version. The cmdlet overwrote the keys, which destroyed any values that were in them. Now a new key is created only if one doesn't already exist. We added a warning to let users know the TLS registry changes aren't exclusive to Microsoft Entra Connect and might affect other applications on the same server.
- We added a check to enforce autoupgrade for V2.0 to require Windows Server 2016 or newer.
- We added the Replicating Directory Changes permission in the Set-ADSyncBasicReadPermissions cmdlet.
- We made a change to prevent UseExistingDatabase and import configuration from being used together because they could contain conflicting configuration settings.
- We made a change to allow a user with the Application Admin role to change the App Proxy service configuration.
- We removed the (Preview) label from the labels of **Import/Export** settings. This functionality is generally available.
- We changed some labels that still referred to Company Administrator. We now use the role name Global Administrator.
- We created new Microsoft Entra Kerberos PowerShell cmdlets (\*-AADKerberosServer) to add a Claims Transform rule to the Microsoft Entra service principal.

### Functional changes

- We added the latest versions of MIM Connectors (1.1.1610.0). For more information, see the [release history page of the MIM Connectors](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-version-history#1116100-september-2021).
- We added a configuration option to disable the Soft Matching feature in Microsoft Entra Connect. We recommend that you disable Soft Matching unless you need it to take over cloud-only accounts. To disable Soft Matching, see [this reference article](/powershell/module/msonline/set-msoldirsyncfeature#example-2--block-soft-matching-for-the-tenant).

## 2.0.10.0

### Release status

8/19/2021: Released for download only, not available for autoupgrade

> [!NOTE]
> This is a hotfix update release of Microsoft Entra Connect. This release requires Windows Server 2016 or newer. This hotfix addresses an issue that's present in version 2.0 and in Microsoft Entra Connect version 1.6. If you're running Microsoft Entra Connect on an older Windows server, install the [1.6.13.0](#16130) build instead.

### Release status

8/19/2021: Released for download only, not available for autoupgrade

### Known issues

Under certain circumstances, the installer for this version displays an error that states TLS 1.2 isn't enabled and stops the installation. This issue occurs because of an error in the code that verifies the registry setting for TLS 1.2. We'll correct this issue in a future release. If you see this issue, follow the instructions to enable TLS 1.2 in [TLS 1.2 enforcement for Microsoft Entra Connect](reference-connect-tls-enforcement.md).

### Bug fixes

We fixed a bug that occurred when a domain was renamed and Password Hash Sync failed with an error that indicated "a specified cast isn't valid" in the Event log. This regression is from earlier builds.

## 1.6.13.0

> [!NOTE]
> This release is a hotfix update release of Microsoft Entra Connect. It's intended to be used by customers who are running Microsoft Entra Connect on a server with Windows Server 2012 or 2012 R2.

8/19/2021: Released for download only, not available for autoupgrade

### Bug fixes

We fixed a bug that occurred when a domain was renamed and Password Hash Sync failed with an error that indicated "a specified cast isn't valid" in the Event log. This regression is from earlier builds.

### Functional changes

There are no functional changes in this release.

## 2.0.9.0

### Release status

8/17/2021: Released for download only, not available for autoupgrade

### Bug fixes

> [!NOTE]
> This release is a hotfix update release of Microsoft Entra Connect. This release requires Windows Server 2016 or newer. It addresses an issue that's present in version 2.0.8.0. This issue isn't present in Microsoft Entra Connect version 1.6.

We fixed a bug that occurred when you synced a large number of Password Hash Sync transactions and the Event log entry length exceeded the maximum-allowed length for a Password Hash Sync event entry. We now split the lengthy log entry into multiple entries.

## 2.0.8.0

> [!NOTE]
> This release is a security update release of Microsoft Entra Connect. This release requires Windows Server 2016 or newer. If you're using an older version of Windows Server, use [version 1.6.11.3](#16113).

This release addresses a vulnerability as documented in [this CVE](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-36949). For more information about this vulnerability, see the CVE.

To download the latest version of Microsoft Entra Connect 2.0, see the [Microsoft Download Center](https://www.microsoft.com/download/details.aspx?id=47594).

### Release status

8/10/2021: Released for download only, not available for autoupgrade

### Functional changes

There are no functional changes in this release.

## 1.6.11.3

> [!NOTE]
> This release is a security update release of Microsoft Entra Connect. It's intended to be used by customers who are running an older version of Windows Server and can't upgrade their server to Windows Server 2016 or newer at this time. You can't use this version to update a Microsoft Entra Connect V2.0 server.

This release addresses a vulnerability as documented in [this CVE](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-36949). For more information about this vulnerability, see the CVE.

### Release status

8/10/2021: Released for download only, not available for autoupgrade

### Functional changes

There are no functional changes in this release.

## 2.0.3.0

> [!NOTE]
> This release is a major release of Microsoft Entra Connect. For more information, see [Introduction to Microsoft Entra Connect V2.0](whatis-azure-ad-connect-v2.md).

### Release status

7/20/2021: Released for download only, not available for autoupgrade

### Functional changes

- We upgraded the LocalDB components of SQL Server to SQL 2019.
- This release requires Windows Server 2016 or newer because of the requirements of SQL Server 2019. An in-place upgrade of Windows Server on a Microsoft Entra Connect server isn't supported. For this reason, you might need to use a [swing migration](how-to-upgrade-previous-version.md#swing-migration).
- We enforce the use of TLS 1.2 in this release. If you enabled your Windows Server for TLS 1.2, Microsoft Entra Connect uses this protocol. If TLS 1.2 isn't enabled on the server, you'll see an error message when you attempt to install Microsoft Entra Connect. The installation won't continue until you've enabled TLS 1.2. You can use the new Set-ADSyncToolsTls12 cmdlets to enable TLS 1.2 on your server.
- We made a change so that with this release, you can use the Hybrid Identity Administrator role to authenticate when you install Microsoft Entra Connect. You no longer need to use the Global Administrator role.
- We upgraded the Visual C++ runtime library to version 14 as a prerequisite for SQL Server 2019.
- We updated this release to use the Microsoft Authentication Library for authentication. We removed the older Azure AD Authentication Library, which will be retired in 2022.
- We no longer apply permissions on AdminSDHolders following Windows security guidance. We changed the parameter SkipAdminSdHolders to IncludeAdminSdHolders in the ADSyncConfig.psm1 module.
- We made a change so that passwords are now reevaluated when an expired password is "unexpired," no matter if the password itself is changed. If the password is set to "Must change password at next logon" for a user, and this flag is cleared (which "unexpires" the password), the unexpired status and the password hash are synced to Microsoft Entra ID. In Microsoft Entra ID, when the user attempts to sign in, they can use the unexpired password.
To sync an expired password from Active Directory to Microsoft Entra ID, use the feature in Microsoft Entra Connect to [synchronize temporary passwords](how-to-connect-password-hash-synchronization.md#synchronizing-temporary-passwords-and-force-password-change-on-next-logon). Enable password writeback to use this feature so that the password the user updates is written back to Active Directory.
- We added two new cmdlets to the ADSyncTools module to enable or retrieve TLS 1.2 settings from the Windows Server:
  - Get-ADSyncToolsTls12
  - Set-ADSyncToolsTls12

You can use these cmdlets to retrieve the TLS 1.2 enablement status or set it as needed. TLS 1.2 must be enabled on the server for the installation or Microsoft Entra Connect to succeed.

- We revamped ADSyncTools with several new and improved cmdlets. The [ADSyncTools article](reference-connect-adsynctools.md) has more details about these cmdlets.
  The following cmdlets have been added or updated:
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
- We now use the V2 endpoint for import and export. We fixed an issue in the Get-ADSyncAADConnectorExportApiVersion cmdlet. To learn more about the V2 endpoint, see [Microsoft Entra Connect Sync V2 endpoint](how-to-connect-sync-endpoint-api-v2.md).
- We added the following new user properties to sync from on-premises Active Directory to Microsoft Entra ID:
  - employeeType
  - employeeHireDate
    >[!NOTE]
    > There's no corresponding EmployeeHireDate or EmployeeLeaveDateTime attribute in Active Directory. If you're importing from on-premises AD, you'll need to identify an attribute in AD that can be used. This attribute must be a string.  For more information see, [Synchronizing lifecycle workflow attributes](../../governance/how-to-lifecycle-workflow-sync-attributes.md)

- This release requires PowerShell version 5.0 or newer to be installed on the Windows server. This version is part of Windows Server 2016 and newer.
- We increased the group sync membership limits to 250,000 with the new V2 endpoint.
- We updated the Generic LDAP Connector and the Generic SQL Connector to the latest versions. To learn more about these connectors, see the reference documentation for:
  - [Generic LDAP Connector](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericldap)
  - [Generic SQL Connector](/microsoft-identity-manager/reference/microsoft-identity-manager-2016-connector-genericsql)
- In the Microsoft 365 admin center, we now report the Microsoft Entra Connect client version whenever there's export activity to Microsoft Entra ID. This reporting ensures that the Microsoft 365 admin center always has the most up-to-date Microsoft Entra Connect client version, and that it can detect when you're using an outdated version.

### Bug fixes

- We fixed an accessibility bug where the screen reader announced an incorrect role of the **Learn More** link.
- We fixed a bug where sync rules with large precedence values (for example, 387163089) caused an upgrade to fail. We updated the sproc mms_UpdateSyncRulePrecedence to cast the precedence number as an integer prior to incrementing the value.
- We fixed a bug where group writeback permissions weren't set on the sync account if a group writeback configuration was imported. We now set the group writeback permissions if group writeback is enabled on the imported configuration.
- We updated the Microsoft Entra Connect Health agent version to 3.1.110.0 to fix an installation failure.
- We're seeing an issue with nondefault attributes from exported configurations where directory extension attributes are configured. In the process of importing these configurations to a new server or installation, the attribute inclusion list is overridden by the directory extension configuration step. As a result, after import, only default and directory extension attributes are selected in the sync service manager. Nondefault attributes aren't included in the installation, so the user must manually reenable them from the sync service manager if they want their imported sync rules to work. We now refresh the Microsoft Entra Connector before configuring the directory extension to keep existing attributes from the attribute inclusion list.
- We fixed an accessibility issue where the page header's font weight was set as Light. Font weight is now set to Bold for the page title, which applies to the header of all pages.
- We renamed the function Get-AdObject in ADSyncSingleObjectSync.ps1 to Get-AdDirectoryObject to prevent ambiguity with the Active Directory cmdlet.
- We removed the condition that allowed duplicate rule precedence. The SQL function mms_CheckSynchronizationRuleHasUniquePrecedence had allowed duplicates precedence on outbound sync rules on different connectors.
- We fixed a bug where the Single Object Sync cmdlet fails if the attribute flow data is null. An example is on exporting a delete operation.
- We fixed a bug where the installation fails because the ADSync bootstrap service can't be started. We now add Sync Service Account to the Local Builtin User Group before starting the bootstrap service.
- We fixed an accessibility issue where the active tab on Microsoft Entra Connect wizard wasn't showing the correct color on High Contrast theme. The selected color code was being overwritten because of a missing condition in the normal color code configuration.
- We addressed an issue where you were allowed to deselect objects and attributes used in sync rules by using the UI and PowerShell. We now show friendly error messages if you try to deselect any attribute or object that's used in any sync rules.
- We made some updates to the "migrate settings code" to check and fix backward compatibility issues when the script runs on an older version of Microsoft Entra Connect.
- We fixed a bug that occurred when PHS tried to look up an incomplete object. It didn't use the same algorithm to resolve the DC as it used originally to fetch the passwords. In particular, it ignored affinitized DC information. The Incomplete object lookup should use the same logic to locate the DC in both instances.
- We fixed a bug where Microsoft Entra Connect can't read Application Proxy items by using Microsoft Graph because of a permissions issue with calling Microsoft Graph directly based on the Microsoft Entra Connect client identifier. To fix this issue, we removed the dependency on Microsoft Graph and instead use Azure AD PowerShell to work with the App Proxy Application objects.
- We removed the writeback member limit from the Out to AD - Group SOAInAAD Exchange sync rule.
- We fixed a bug that occurred when you changed connector account permissions. If an object came in scope that hadn't changed since the last delta import, a delta import wouldn't import it. We now display a warning to alert you of the issue.
- We fixed an accessibility issue where the screen reader wasn't reading the radio button position. We added positional text to the radio button accessibility text field.
- We updated the Pass-Thru Authentication Agent bundle. The older bundle didn't have the correct reply URL for the HIP's first-party application in US Government.
- We fixed a bug where a stopped-extension-dll-exception error on Microsoft Entra Connector exported after clean installing the Microsoft Entra Connect version 1.6.X.X, which defaulted to using DirSyncWebServices API V2, by using an existing database. Previously, the setting export version to V2 was only being done for upgrades. We changed it so that it's set on clean install.
- We removed the ADSyncPrep.psm1 module from the installation because it's no longer used.

### Known issues

- The Microsoft Entra Connect wizard shows the **Import Synchronization Settings** option as **Preview**, although this feature is generally available.
- Some Active Directory connectors might be installed in a different order when you use the output of the migrate settings script to install the product.
- The **User Sign In** options page in the Microsoft Entra Connect wizard mentions Company Administrator. This term is no longer used and needs to be replaced by Global Administrator.
- The **Export settings** option is broken when the **Sign In** option has been configured to use PingFederate.
- While Microsoft Entra Connect can now be deployed by using the Hybrid Identity Administrator role, configuring Self-Service Password Reset, Passthru Authentication, or single sign-on still requires a user with the Global Administrator role.
- When you import the Microsoft Entra Connect configuration while you deploy to connect with a different tenant than the original Microsoft Entra Connect configuration, directory extension attributes aren't configured correctly.

## 1.6.4.0

> [!NOTE]
> The Microsoft Entra Connect Sync V2 endpoint API is now available in these Azure environments:
>
> - Azure Commercial
> - Microsoft Azure operated by 21Vianet
> - Azure US Government cloud
>
> This release won't be made available in the Azure German cloud.

### Release status

3/31/2021: Released for download only, not available for autoupgrade

### Bug fixes

This release fixes a bug that occurred in version 1.6.2.4. After upgrade to that release, the Microsoft Entra Connect Health feature wasn't registered correctly and didn't work. If you deployed build 1.6.2.4, update your Microsoft Entra Connect server with this build to register the Health feature correctly.

## 1.6.2.4

> [!IMPORTANT]
> Update per March 30, 2021: We've discovered an issue in this build. After installation of this build, the Health services aren't registered. We recommend that you not install this build. We'll release a hotfix shortly.
> If you already installed this build, you can manually register the Health services by using the cmdlet, as shown in [Microsoft Entra Connect Health agent installation](./how-to-connect-health-agent-install.md#manually-register-azure-ad-connect-health-for-sync).

- This release will be made available for download only.
- The upgrade to this release will require a full synchronization because of sync rule changes.
- This release defaults the Microsoft Entra Connect server to the new V2 endpoint.

### Release status

3/19/2021: Released for download, not available for autoupgrade

### Functional changes

- We updated default sync rules to limit membership in writeback groups to 50,000 members.
  - We added new default sync rules for limiting the membership count in group writeback (Out to AD - Group Writeback Member Limit) and group sync to Microsoft Entra ID (Out to Microsoft Entra ID - Group Writeup Member Limit) groups.
  - We added a member attribute to the Out to AD - Group SOAInAAD - Exchange rule to limit members in writeback groups to 50,000.
- We updated sync rules to support group writeback V2:
    - If the In from Microsoft Entra ID - Group SOAInAAD rule is cloned and Microsoft Entra Connect is upgraded:
        - The updated rule will be disabled by default, so targetWritebackType will be null.
        - Microsoft Entra Connect will write back all Cloud Groups (including Microsoft Entra Security Groups enabled for writeback) as Distribution Groups.
    - If the Out to AD - Group SOAInAAD rule is cloned and Microsoft Entra Connect is upgraded:
        - The updated rule will be disabled by default. A new sync rule, Out to AD - Group SOAInAAD - Exchange, which is added will be enabled.
        - Depending on the Cloned Custom Sync Rule's precedence, Microsoft Entra Connect will flow the Mail and Exchange attributes.
    - If the Cloned Custom Sync Rule doesn't flow some Mail and Exchange attributes, the new Exchange Sync Rule will add those attributes.
- We added support for [Selective Password Hash Synchronization](./how-to-connect-selective-password-hash-synchronization.md).
- We added the new [Single Object Sync cmdlet](./how-to-connect-single-object-sync.md). Use this cmdlet to troubleshoot your Microsoft Entra Connect Sync configuration.
- Microsoft Entra Connect now supports the Hybrid Identity Administrator role for configuring the service.
- We updated the Microsoft Entra Connect Health agent to 3.1.83.0.
- We introduced a new version of the [ADSyncTools PowerShell module](./reference-connect-adsynctools.md), which has several new or improved cmdlets:
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

- We updated error logging for token acquisition failures.
- We updated **Learn More** links on the configuration page to give more detail on the linked information.
- We removed the **Explicit** column from the **CS Search** page in the old sync UI.
- We added to the UI for the group writeback flow to prompt users for credentials or to configure their own permissions by using the ADSyncConfig module if credentials weren't already provided in an earlier step.
- We added the ability to autocreate a managed service account for an ADSync service account on a DC.
- We added the ability to set and get the Microsoft Entra DirSync feature group writeback V2 in the existing cmdlets:

  - Set-ADSyncAADCompanyFeature
  - Get-ADSyncAADCompanyFeature
- We added two cmdlets to read the AWS API version:

  - Get-ADSyncAADConnectorImportApiVersion: To get the import AWS API version
  - Get-ADSyncAADConnectorExportApiVersion: To get the export AWS API version

- We updated change tracking so that changes made to synchronization rules are now tracked to assist troubleshooting changes in the service. The cmdlet Get-ADSyncRuleAudit retrieves tracked changes.
- We updated the Add-ADSyncADDSConnectorAccount cmdlet in the [ADSyncConfig PowerShell module](./how-to-connect-configure-ad-ds-connector-account.md#using-the-adsyncconfig-powershell-module) to allow a user in the ADSyncAdmin group to change the Active Directory Domain Services Connector account.

### Bug fixes

- We updated disabled foreground color to satisfy luminosity requirements on a white background. We added more conditions for the navigation tree to set the foreground text color to white when a disabled page is selected to satisfy luminosity requirements.
- We increased granularity for Set-ADSyncPasswordHashSyncPermissions cmdlet.
- We updated the PHS permissions script (Set-ADSyncPasswordHashSyncPermissions) to include an optional ADobjectDN parameter.
- We made an accessibility bug fix. The screen reader now describes the UX element that holds the list of forests as **Forests list** instead of **Forest List list**.
- We updated screen reader output for some items in the Microsoft Entra Connect wizard. We updated the button hover color to satisfy contrast requirements. We updated Synchronization Service Manager title color to satisfy contrast requirements.
- We fixed an issue with installing Microsoft Entra Connect from exported configuration having custom extension attributes.
- We added a condition to skip checking for extension attributes in the target schema while applying the sync rule.
- We added appropriate permissions on installation if the group writeback feature is enabled.
- We fixed duplicate default sync rule precedence on import.
- We fixed an issue that caused a staging error during V2 API delta import for a conflicting object that was repaired via the Health portal.
- We fixed an issue in the sync engine that caused Connector Spaces objects to have an inconsistent link state.
- We added import counters to Get-ADSyncConnectorStatistics output.
- We fixed an unreachable domain de-selection (selected previously) issue in some corner cases during the pass2 wizard.
- We modified policy import and export to fail if custom rule has duplicate precedence.
- We fixed a bug in the domain selection logic.
- We fixed an issue with build 1.5.18.0 if you use mS-DS-ConsistencyGuid as the source anchor and have cloned the In from AD - Group Join rule.
- Fresh Microsoft Entra Connect installations will use the Export Deletion Threshold stored in the cloud if there's one available and if there isn't a different one passed in.
- We fixed an issue where Microsoft Entra Connect wouldn't read Active Directory displayName changes of hybrid-joined devices.

## 1.5.45.0

### Release status

07/29/2020: Released for download

### Functional changes

This is a bug fix release. There are no functional changes in this release.

### Fixed issues

- We fixed an issue where admin can't enable seamless single sign-on if the AZUREADSSOACC computer account is already present in Active Directory.
- We fixed an issue that caused a staging error during V2 API delta import for a conflicting object that was repaired via the Health portal.
- We fixed an issue in the import/export configuration where a disabled custom rule was imported as enabled.

## Next steps

Learn more about how to [integrate your on-premises identities with Microsoft Entra ID](../whatis-hybrid-identity.md).

