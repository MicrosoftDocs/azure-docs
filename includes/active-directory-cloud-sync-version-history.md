This article lists the versions and features of Azure Active Directory Connect Provisioning Agent that have been released. The Azure AD team regularly updates the Provisioning Agent with new features and functionality. 

Microsoft provides direct support for the latest agent version and one version before.

## 1.1.582.0

August 8th, 2021 - released for download

>[!NOTE] 
>This is a security update release of Azure AD Connect. 
>This release addresses a vulnerability as documented in [this CVE](https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-36949). For more information about this vulnerability please refer to the CVE.
>You can download this release using [this link](https://download.msappproxy.net/Subscription/d3c8b69d-6bf7-42be-a529-3fe9c2e70c90/Connector/provisioningAgentInstaller).

## 1.1.359.0

### New features and improvements
- GMSA Cmdlets to set/reset permission

### Fixed issues
- GMSA folder permission bug fix (originally, the issue resulted in bootstrap issues)
- Bug fix for handling multiple changes to a single value reference attribute (e.g. manager)
- Bug fix for failure in Initial Enumeration, plus enhanced tracing of the failure
- Optimize group membership updates to a Scoping Group. With this, customers now can sync a group of up to 50K members using group scoping filter. 
- Support retrieving a single object by DN with Scoping used by Provisioning On Demand to obey Scoping logic





## 1.1.354.0

January 20, 2021: Released for download

### New features and improvements
- Improvement to GMSA experience including support for pre-custom created GMSA Account
- [PowerShell cmdlets](../articles/active-directory/cloud-sync/how-to-gmsa-cmdlets.md) support for GMSA setup
- [CLI support](../articles/active-directory/cloud-sync/how-to-install-pshell.md) for agent install (silent installation)
- Additional diagnostics for agent source quarantine issues
- Bug fixes that include reducing of memory usage of OU scoping filters, running PHS only for in-scope users, handling of nested objects in OU when using OU scoping etc. 


### Fixed issues
-	 Prevent quarantine when scoping group is out of scope
-	when scoping filters are configured - PHS job now only operates for in-scope users
-	Agent would sometime hang during upgrade
-	Initial Sync for objects in nested OUs when using OU scoping
-	Make the Repair-AADCloudSyncToolsAccount more robust
-	Reduce large memory usage of OU scoping filters
-	Admin role check fails if the role members contain a security group
-	Fix GMSA folder permission issue which prevents Agent Cert renewal







## 1.1.281.0

### Release status

November 23, 2020: Released for download

### New features and improvements

* Support for [gMSA](../articles/active-directory/cloud-sync/how-to-prerequisites.md#group-managed-service-accounts)
* Support for groups up to size less than 1500 members during incremental or delta sync cycle. This is applicable when using group scoping filter
* Support for large groups with member size up to 15K
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

* Ability to configure additional tracing and logging for debugging Provisioning Agent issues
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
