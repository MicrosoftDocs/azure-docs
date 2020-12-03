This article lists the versions and features of Azure Active Directory Connect Provisioning Agent that have been released. The Azure AD team regularly updates the Provisioning Agent with new features and functionality. The Provisioning Agent is updated automatically when a new version is released. 

Microsoft provides direct support for the latest agent version and one version before.

## 1.1.281.0

### Release status

November 23, 2020: Released for download

### New features and improvements

* Support for [gMSA](../articles/active-directory/cloud-provisioning/how-to-prerequisites.md#group-managed-service-accounts)
* Support for groups up to size less than 1500 members during incremental or delta sync cycle. This is applicable when using group scoping filter
* Support for large groups with member size up to 15K
* Initial sync improvements
* Advanced verbose logging
* Introduction of [AADCloudSyncTools PowerShell module](../articles/active-directory/cloud-provisioning/reference-powershell.md)
* Fixed limitations to allow agent to be installed in non-English server
* Support for PHS filtering only for objects in scope (Originally, we were syncing password hashes for all objects)
* Fixed the memory leak issue in the agent
* Improved provisioning logs


## 1.1.96.0

### Release status

December 4, 2019: Released for download

### New features and improvements

* Includes support for [Azure AD Connect cloud provisioning](../articles/active-directory/cloud-provisioning/what-is-cloud-provisioning.md) to synchronize user, contact and group data from on-premises Active Directory to Azure AD


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
* Added support for automatic agent updates


