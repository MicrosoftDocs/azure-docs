This article lists the versions and features of Azure Active Directory Connect Provisioning Agent that have been released. The Azure AD team regularly updates the Provisioning Agent with new features and functionality. 
> [!NOTE]
> All new Provisioning Agent releases are made available through auto upgrade for existing installations and can be downloaded for new installations.

>[!NOTE]
> Azure Active Directory (Azure AD) Connect Provisioning agent follows the [Modern Lifecycle Policy](/lifecycle/policies/modern). Changes for products and services  under the Modern Lifecycle Policy may be more frequent and require customers to be alert for forthcoming modifications to their product or service.
>
> Products governed by the Modern Policy follow a [continuous support and servicing model](/lifecycle/overview/product-end-of-support-overview). Customers must take the latest update to remain supported. 
>
> For products and services governed by the Modern Lifecycle Policy, Microsoft's policy is to provide a minimum 30 days' notification when customers are required to take action in order to avoid significant degradation to the normal use of the product or service.

## Download link
Go to the [Azure AD Connect - Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_AAD_Connect_Provisioning/AADConnectMenuBlade/~/GetStarted) click on the "Manage" tab to download the "Provisioning Agent".

Get notified about when to revisit this page for updates by copying and pasting this URL: `https://aka.ms/cloudsyncrss` into your ![RSS feed reader icon](media/active-directory-cloud-sync-version-history/feed-icon-16x16.png) feed reader.

## 1.1.1365.0

Release date: September 8th, 2023

### New or changed functionality

- Added support for Applications Kerberos Key synchronization to Provisioning Agent
- Added support for Web Service, Windows PowerShell and custom ECMA2 connectors
- **Query attribute** of ECMA2Host is no longer in use and removed from the ECMA2 Configuration wizard
- Update AADCloudSyncTools module with function to disable DirSyncConfiguration Accidental Deletion Prevention

### Fixed issues
- Fixed an issue with jobs going into quarantine if an OR name attribute value points to a non-existent object
- Fixed an issue that caused customizations to AADConnectProvisioningAgent.exe.config to reset when the agent is updated
- Fixed provisioning agent incorrect creds if NTLM traffic is set to 'Deny-All'
- Fixed incorrect file path to trace log
- Fixed an issue that caused Provisioning Agent installer crashing from duplicate schema objects
- Update Windows Server Version check as per documented prerequisites
- Fixed for install page links visibility in 'high contrast black' mode
- Fixed case sensitive comparison and add logging for UPN / role id checks
- Accessibility fixes for ECMA2 Configuration wizard






## 1.1.1107.0

Release date: December 16, 2022

### New or changed functionality
-	We added support for [on-premises application provisioning](/azure/active-directory/app-provisioning/on-premises-application-provisioning-architecture) (SCIM, SQL, LDAP) 

## 1.1.977.0

Release date: September 23, 2022

### New or changed functionality
 - We added support for [cloud sync Self Service Password Reset](../articles/active-directory/authentication/tutorial-enable-cloud-sync-sspr-writeback.md) General Availability.
 - We added support for password writeback in disconnected forests.
 
### Fixed issues

 - We fixed various bug fixes to support SSPR with cloud sync

## 1.1.972.0

Release date: August 8, 2022

### New or changed functionality

 - We added a new cmdlet to enable and disable writeback of passwords. For more information about this cmdlet and its use, see [Enable password writeback in Azure AD Connect cloud sync](../articles/active-directory/authentication/tutorial-enable-cloud-sync-sspr-writeback.md#enable-password-writeback-in-sspr).
 - We now return more info in the 'Get-AADCloudSyncDomains' cmdlet. 
 - We updated new cmdlets of CloudSync PowerShell module in the unattended agent install script. 
 - We have added support for the installation of the provisioning agent using the commandline. 
 - We added support for EX and RX environments.
  
### Fixed issues

 - After the Newtonsoft.Json upgrade, AADConnectProvisioningAgent.exe.config isn't updated after install, which results in a failure of sync. We now remove the app.config file on upgrade of the agent.
 - We fixed an issue with DC affinity after an OU is renamed.
 - We fixed several issues in the PowerShell module.
 - We fixed a memory leak due to not disposing HTTP client.
 - We fixed a bug in the code for granting the "logon as a service" right to the GMSA.
 - We refined the permissions on the GMSA for CloudHR.
 - We now uninstall the cloud sync agent when the bundle is uninstalled.
 - We fixed a bug that prevents deletion of the Service Principal if not all Jobs are deleted.
 - We fixed an issue with updating of the password of a user with 'User must change password at next logon'.
 - We fixed an issue with the agent GMSA folder permissions.
 - We fixed an issue where group membership updates aren't always correct.

## 1.1.818.0

April 18, 2022 - released for download

New features and improvements

 - Fixed bug where granting logon as a service right to a gMSA would fail.
 - Updated the agent to honor the preferred Domain Controller list that is configured in the agent to also be used for the Self Service Password Reset feature.

## 1.1.587.0

November 2, 2021 - released for download

New features and improvements

- We added a cmdlet to configure Password Writeback


## 1.1.584.0 

August 20, 2021 - released for download

### Fixed issues

- We fixed a bug where, when a domain is renamed, Password Hash Sync would fail with an error indicating "a specified cast is not valid" in the Event log. This error is a regression from earlier builds.

## 1.1.582.0

August 8, 2021 - released for download

>[!NOTE] 
>This is a security update release of Azure AD Connect. 
>This release addresses a vulnerability as documented in [this CVE](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-36949). For more information about this vulnerability, see the CVE.

## 1.1.359.0

### New features and improvements
- GMSA Cmdlets to set/reset permission

### Fixed issues
- GMSA folder permission bug fix (originally, the issue resulted in bootstrap issues)
- Bug fix for handling multiple changes to a single value reference attribute (for example, manager)
- Bug fix for failure in Initial Enumeration, plus enhanced tracing of the failure
- Optimize group membership updates to a Scoping Group. With this update, customers now can sync a group of up to 50 K members using group scoping filter. 
- Support retrieving a single object by DN with Scoping used by Provisioning On Demand to obey Scoping logic

## 1.1.354.0

January 20, 2021: Released for download

### New features and improvements
- Improvement to GMSA experience including support for pre-custom created GMSA Account
- [PowerShell cmdlets](../articles/active-directory/cloud-sync/how-to-gmsa-cmdlets.md) support for GMSA setup
- [CLI support](../articles/active-directory/cloud-sync/how-to-install-pshell.md) for agent install (silent installation)
- More diagnostics for agent source quarantine issues
- Bug fixes that include reducing of memory usage of OU scoping filters, running PHS only for in-scope users, handling of nested objects in OU when using OU scoping etc. 


### Fixed issues
-	 Prevent quarantine when scoping group is out of scope
-	when scoping filters are configured - PHS job now only operates for in-scope users
-	Agent would sometime stop responding during upgrade
-	Initial Sync for objects in nested OUs when using OU scoping
-	Make the Repair-AADCloudSyncToolsAccount more robust
-	Reduce large memory usage of OU scoping filters
-	Admin role check fails if the role members contain a security group
-	Fix GMSA folder permission issue, which prevents Agent Cert renewal

## 1.1.281.0

### Release status

November 23, 2020: Released for download

### New features and improvements

* Support for [gMSA](../articles/active-directory/cloud-sync/how-to-prerequisites.md#group-managed-service-accounts)
* Support for groups up to size less than 1500 members during incremental or delta sync cycle. This change is applicable when using group scoping filter
* Support for large groups with member size up to 15 K
* Initial sync improvements
* Advanced verbose logging
* Introduction of [AADCloudSyncTools PowerShell module](../articles/active-directory/cloud-sync/reference-powershell.md)
* Fixed limitations to allow agent to be installed in non-English server
* Support for PHS filtering only for objects in scope (Originally, we were syncing password hashes for all objects)
* Fixed the memory leak issue in the agent
* Improved provisioning logs
* Support for configuring [LDAP connection timeout](../articles/active-directory/cloud-sync/how-to-manage-registry-options.md#configure-ldap-connection-timeout) 
* Support for configuring [referral chasing](../articles/active-directory/cloud-sync/how-to-manage-registry-options.md#configure-referral-chasing) 


## 1.1.96.0

### Release status

December 4, 2019: Released for download

### New features and improvements

* Includes support for [Azure AD Connect cloud sync](../articles/active-directory/cloud-sync/what-is-cloud-sync.md) to synchronize user, contact and group data from on-premises Active Directory to Azure AD


## 1.1.67.0

### Release status

September 9, 2019: Released for auto update

### New features and improvements

* Ability to configure more tracing and logging for debugging Provisioning Agent issues
* Ability to fetch only those Azure AD attributes that are configured in the mapping to improve performance of sync

### Fixed issues

* Fixed a bug wherein the agent went into an unresponsive state if there were issues with Azure AD connection failures
* Fixed a bug that caused issues when binary data was read from Azure Active Directory
* Fixed a bug wherein the agent failed to renew trust with the cloud hybrid identity service

## 1.1.30.0

### Release status

January 23, 2019: Released for download

### New features and improvements

* Revamped the Provisioning Agent and connector architecture for better performance, stability, and reliability 
* Simplified the Provisioning Agent configuration using UI-driven installation wizard
