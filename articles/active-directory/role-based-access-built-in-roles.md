---
title: Built-in roles for Azure role-based access control (RBAC) | Microsoft Docs
description: This topic describes the built in roles for role-based access control (RBAC). The roles are continuously added, so check the documentation freshness.
services: active-directory
documentationcenter: ''
author: rolyon
manager: mtillman
editor: ''

ms.service: active-directory
ms.devlang:
ms.topic: article
ms.tgt_pltfrm:
ms.workload: identity
ms.date: 03/06/2018
ms.author: rolyon
ms.reviewer: rqureshi

ms.custom: it-pro
---
# Built-in roles for Azure role-based access control
Azure Role-Based Access Control (RBAC) comes with the following built-in roles that can be assigned to users, groups, and services. You can’t modify the definitions of built-in roles. However, you can create [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md) to fit the specific needs of your organization.

## Built-in role descriptions
The following table provides brief descriptions of the built-in roles. Click the role name to see the detailed list of **actions** and **notactions** for the role. The **actions** property specifies the allowed actions on Azure resources. Action strings can use wildcard characters. The **notactions** property specifies the actions that are excluded from the allowed actions.

The action defines what type of operations you can perform on a given resource type. For example:
- **Write** enables you to perform PUT, POST, PATCH, and DELETE operations.
- **Read** enables you to perform GET operations.

This article only addresses the different roles that exist today. When you assign a role to a user, though, you can limit the allowed actions further by defining a scope. This is helpful if you want to make someone a Website Contributor, but only for one resource group.

> [!NOTE]
> The Azure role definitions are constantly evolving. This article is kept as up to date as possible, but you can always find the latest roles definitions in Azure PowerShell. Use the [Get-AzureRmRoleDefinition](/powershell/module/azurerm.resources/get-azurermroledefinition) cmdlet to list all current roles. You can dive in to a specific role using `(get-azurermroledefinition "<role name>").actions` or `(get-azurermroledefinition "<role name>").notactions` as applicable. Use [Get-AzureRmProviderOperation](/powershell/module/azurerm.resources/get-azurermprovideroperation) to list operations of specific Azure resource providers.


| Built-in role | Description |
| --- | --- |
| [Owner](#owner) | Can manage everything, including access |
| [Contributor](#contributor) | Can manage everything except access |
| [Reader](#reader) | Can view everything, but can't make changes |
| [API Management Service Contributor](#api-management-service-contributor) | Can manage API Management services |
| [API Management Service Operator Role](#api-management-service-operator-role) | Can manage API Management services |
| [API Management Service Reader Role](#api-management-service-reader-role) | Can manage API Management services |
| [Application Insights Component Contributor](#application-insights-component-contributor) | Can manage Application Insights components |
| [Application Insights Snapshot Debugger](#application-insights-snapshot-debugger) | Gives user permission to use Application Insights Snapshot Debugger features |
| [Automation Job Operator](#automation-job-operator) | Create and Manage Jobs using Automation Runbooks. |
| [Automation Operator](#automation-operator) | Able to start, stop, suspend, and resume jobs |
| [Automation Runbook Operator](#automation-runbook-operator) | Read Runbook properties - to be able to create Jobs of the runbook. |
| [Azure Stack Registration Owner](#azure-stack-registration-owner) | Lets you manage Azure Stack registrations. |
| [Backup Contributor](#backup-contributor) | Can manage all backup management actions, except creating Recovery Services vault and giving access to others |
| [Backup Operator](#backup-operator) | Can manage all backup management actions except creating vaults, removing backup and giving access to others |
| [Backup Reader](#backup-reader) | Can monitor backup management in Recovery Services vault |
| [Billing Reader](#billing-reader) | Can view all Billing information |
| [BizTalk Contributor](#biztalk-contributor) | Can manage BizTalk services |
| [CDN Endpoint Contributor](#cdn-endpoint-contributor) | Can manage CDN endpoints, but can’t grant access to other users. |
| [CDN Endpoint Reader](#cdn-endpoint-reader) | Can view CDN endpoints, but can’t make changes. |
| [CDN Profile Contributor](#cdn-profile-contributor) | Can manage CDN profiles and their endpoints, but can’t grant access to other users. |
| [CDN Profile Reader](#cdn-profile-reader) | Can view CDN profiles and their endpoints, but can’t make changes. |
| [Classic Network Contributor](#classic-network-contributor) | Can manage classic virtual networks and reserved IPs |
| [Classic Storage Account Contributor](#classic-storage-account-contributor) | Can manage classic storage accounts |
| [Classic Storage Account Key Operator Service Role](#classic-storage-account-key-operator-service-role) | Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts |
| [Classic Virtual Machine Contributor](#classic-virtual-machine-contributor) | Can manage classic virtual machines but not the virtual network or storage account to which they are connected |
| [ClearDB MySQL DB Contributor](#cleardb-mysql-db-contributor) | Can manage ClearDB MySQL databases |
| [Cosmos DB Account Reader Role](#cosmos-db-account-reader-role) | Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts. |
| [Data Factory Contributor](#data-factory-contributor) | Create and manage data factories, and child resources within them. |
| [Data Lake Analytics Developer](#data-lake-analytics-developer) | Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts. |
| [DevTest Labs User](#devtest-labs-user) | Can view everything and connect, start, restart, and shutdown virtual machines |
| [DNS Zone Contributor](#dns-zone-contributor) | Can manage DNS zones and records. |
| [DocumentDB Account Contributor](#documentdb-account-contributor) | Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB. |
| [Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) | Can manage Intelligent Systems accounts |
| [Key Vault Contributor](#key-vault-contributor) | Lets you manage key vaults, but not access to them. |
| [Lab Creator](#lab-creator) | Lets you create, manage, delete your managed labs under your Azure Lab Accounts. |
| [Log Analytics Contributor](#log-analytics-contributor) | Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; creating and configuring Automation accounts; adding solutions; and configuring Azure diagnostics on all Azure resources. |
| [Log Analytics Reader](#log-analytics-reader) | Log Analytics Reader can view and search all monitoring data as well as and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources. |
| [Logic App Contributor](#logic-app-contributor) | Lets you manage logic app, but not access to them. |
| [Logic App Operator](#logic-app-operator) | Lets you read, enable and disable logic app. |
| [Managed Identity Contributor](#managed-identity-contributor) | Create, Read, Update, and Delete User Assigned Identity |
| [Managed Identity Operator](#managed-identity-operator) | Read and Assign User Assigned Identity |
| [Monitoring Contributor](#monitoring-contributor) | Can read all monitoring data and edit monitoring settings. See also [Get started with roles, permissions, and security with Azure Monitor](../monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles). |
| [Monitoring Reader](#monitoring-reader) | Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](../monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles). |
| [Network Contributor](#network-contributor) | Can manage all network resources |
| [New Relic APM Account Contributor](#new-relic-apm-account-contributor) | Lets you manage New Relic Application Performance Management accounts and applications, but not access to them. |
| [Redis Cache Contributor](#redis-cache-contributor) | Can manage Redis caches |
| [Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) | Can manage Scheduler job collections |
| [Search Service Contributor](#search-service-contributor) | Can manage Search services |
| [Security Admin](#security-admin) | In Security Center only: Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations |
| [Security Manager](#security-manager) | Can manage security components, security policies, and virtual machines |
| [Security Reader](#security-reader) | In Security Center only: Can view recommendations and alerts, view security policies, view security states, but cannot make changes |
| [Site Recovery Contributor](#site-recovery-contributor) | Can manage all Site Recovery management actions, except creating Recovery Services vault and assigning access rights to other users |
| [Site Recovery Operator](#site-recovery-operator) | Can Failover and Failback but can not perform other Site Recovery management actions or assign access to other users |
| [Site Recovery Reader](#site-recovery-reader) | Can monitor Site Recovery status in Recovery Services vault and raise Support tickets |
| [SQL DB Contributor](#sql-db-contributor) | Can manage SQL databases but not their security-related policies |
| [SQL Security Manager](#sql-security-manager) | Can manage the security-related policies of SQL servers and databases |
| [SQL Server Contributor](#sql-server-contributor) | Can manage SQL servers and databases but not their security-related policies |
| [Storage Account Contributor](#storage-account-contributor) | Can manage storage accounts, but not access to them. |
| [Storage Account Key Operator Service Role](#storage-account-key-operator-service-role) | Storage Account Key Operators are allowed to list and regenerate keys on Storage Accounts |
| [Support Request Contributor](#support-request-contributor) | Can create and manage support tickets at the subscription scope |
| [Traffic Manager Contributor](#traffic-manager-contributor) | Lets you manage Traffic Manager profiles, but does not let you control who has access to them. |
| [User Access Administrator](#user-access-administrator) | Can manage user access to Azure resources |
| [Virtual Machine Administrator Login](#virtual-machine-administrator-login) | -	Users with this role have the ability to login to a virtual machine with Windows administrator or Linux root user privileges. |
| [Virtual Machine Contributor](#virtual-machine-contributor) | Can manage virtual machines but not the virtual network or storage account to which they are connected |
| [Virtual Machine User Login](#virtual-machine-user-login) | Users with this role have the ability to login to a virtual machine as a regular user. |
| [Web Plan Contributor](#web-plan-contributor) | Can manage web plans |
| [Website Contributor](#website-contributor) | Can manage websites but not the web plans to which they are connected |

The following tables describe the specific permissions given to each role. This can include **Actions**, which give permissions, and **NotActions**, which restrict them.

## Owner
Can manage everything, including access

| **Actions** |  |
| --- | --- |
| * | Create and manage resources of all types |

## Contributor
Can manage everything except access

| **Actions** |  |
| --- | --- |
| * | Create and manage resources of all types |

| **NotActions** |  |
| --- | --- |
| Microsoft.Authorization/*/Delete | Can't delete roles and role assignments |
| Microsoft.Authorization/*/Write | Can't create roles and role assignments |
| Microsoft.Authorization/elevateAccess/Action | Grants the caller User Access Administrator access at the tenant scope |

## Reader
Can view everything, but can't make changes

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |

## API Management Service Contributor
Can manage API Management services

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/* | Create and manage API Management service |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |
| Microsoft.Support/* | Create and manage support tickets |

## API Management Service Operator Role
Can manage API Management services

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/*/read | Read API Management Service instances |
| Microsoft.ApiManagement/service/backup/action | Back up API Management Service to the specified container in a user provided storage account |
| Microsoft.ApiManagement/service/delete | Delete an API Management Service instance |
| Microsoft.ApiManagement/service/managedeployments/action | Change SKU/units; add or remove regional deployments of API Management Service |
| Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
| Microsoft.ApiManagement/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
| Microsoft.ApiManagement/service/updatecertificate/action | Upload SSL certificate for an API Management Service |
| Microsoft.ApiManagement/service/updatehostname/action | Set up, update, or remove custom domain names for an API Management Service |
| Microsoft.ApiManagement/service/write | Create a new instance of API Management Service |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/users/keys/read | Get list of user keys |

## API Management Service Reader Role
Can manage API Management services

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/*/read | Read API Management Service instances |
| Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/users/keys/read | Get list of user keys |

## Application Insights Component Contributor
Can manage Application Insights components

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.Insights/webtests/* | Create and manage web tests |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Application Insights Snapshot Debugger
Gives user permission to use Application Insights Snapshot Debugger features

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/components/*/read |  |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Automation Job Operator
Create and Manage Jobs using Automation Runbooks.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
| Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
| Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
| Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Automation Operator
Able to start, stop, suspend, and resume jobs

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Automation/automationAccounts/jobs/read | Read automation account jobs |
| Microsoft.Automation/automationAccounts/jobs/resume/action | Resume an automation account job |
| Microsoft.Automation/automationAccounts/jobs/stop/action | Stop an automation account job |
| Microsoft.Automation/automationAccounts/jobs/streams/read | Read automation account job streams |
| Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspend an automation account job |
| Microsoft.Automation/automationAccounts/jobs/write | Write automation account jobs |
| Microsoft.Automation/automationAccounts/jobSchedules/read | Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/jobSchedules/write | Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
| Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
| Microsoft.Automation/automationAccounts/read | Read automation accounts |
| Microsoft.Automation/automationAccounts/runbooks/read | Read automation runbooks |
| Microsoft.Automation/automationAccounts/schedules/read | Read automation account schedules |
| Microsoft.Automation/automationAccounts/schedules/write | Write automation account schedules |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Automation Runbook Operator
Read Runbook properties - to be able to create Jobs of the runbook.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Azure Stack Registration Owner
Lets you manage Azure Stack registrations.

| **Actions** |  |
| --- | --- |
| Microsoft.AzureStack/registrations/products/listDetails/action | Retrieves extended details for an Azure Stack Marketplace product |
| Microsoft.AzureStack/registrations/products/read | Gets the properties of an Azure Stack Marketplace product |
| Microsoft.AzureStack/registrations/read | Gets the properties of an Azure Stack registration |

## Backup Contributor
Can manage all backup management actions, except creating Recovery Services vault and giving access to others

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/* | Manage results of operation on backup management |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/* | Create and manage backup containers inside backup fabrics of Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export backup jobs into an excel |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/* | Create and manage meta data related to backup management |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
| Microsoft.RecoveryServices/Vaults/backupPolicies/* | Create and manage backup policies |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/* | Create and manage backed up items |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/* | Create and manage containers holding backup items |
| Microsoft.RecoveryServices/Vaults/certificates/* | Create and manage certificates related to backup in Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | Read recovery services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/* | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/* | Create and manage registered identities |
| Microsoft.RecoveryServices/Vaults/usages/* | Create and manage usage of Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/* |  |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
| Microsoft.RecoveryServices/Vaults/storageConfig/* |  |
| Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/* |  |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/operationResults/read | Returns the Result of Export Job Operation. |
| Microsoft.RecoveryServices/Vaults/backupSecurityPIN/* |  |
| Microsoft.Support/* | Create and manage support tickets |

## Backup Operator
Can manage all backup management actions except creating vaults, removing backup and giving access to others

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Read results of operation on backup management |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ operationResults/read | Read operation results on protection containers |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/backup/action | Perform on-demand backup operation on a backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationResults/read | Read result of operation performed on backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/read | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/read | Read recovery point of a backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/restore/action | Perform a restore operation using a recovery point of a backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/write | Create a backup item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Read containers holding backup item |
| Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action | Cancel the Job |
| Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
| Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export backup jobs into an excel |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read | Read meta data related to backup management |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Read results of operations performed on backup policies |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read | Read backup policies |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/read | Returns list of all Protectable Items. |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Read backed up containers holding backup items |
| Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/extendedInformation/write | Write extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | Read recovery services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/* | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | Read results of operation performed on Registered items of the vault |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | Read registered items of the vault |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/write | Write registered items to vault |
| Microsoft.RecoveryServices/Vaults/usages/read | Read usage of the Recovery Services vault |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/provisionInstantItemRecovery/action | Provision Instant Item Recovery for Protected Item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/revokeInstantItemRecovery/action | Revoke Instant Item Recovery for Protected Item |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/* |  |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
| Microsoft.RecoveryServices/Vaults/storageConfig/* |  |
| Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/* |  |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/operationResults/read | Returns the Result of Export Job Operation. |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationStatus/read |  |
| Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
| Microsoft.Support/* | Create and manage support tickets |

## Backup Reader
Can monitor backup management in Recovery Services vault

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Read results of operation on backup management |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ operationResults/read | Read operation results on protection containers |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationResults/read | Read result of operation performed on backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/read | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Read containers holding backup item |
| Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Read results of backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobs/read | Read backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export backup jobs into an excel |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read | Read meta data related to backup management |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/read | Read backup management operation results |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Read results of operations performed on backup policies |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read | Read backup policies |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Read backed up containers holding backup items |
| Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | Read recovery services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read | Read result of discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | Read results of operation performed on Registered items of the vault |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | Read registered items of the vault |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read |  |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
| Microsoft.RecoveryServices/Vaults/storageConfig/read |  |
| Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/read |  |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/operationResults/read | Returns the Result of Export Job Operation. |
| Microsoft.RecoveryServices/Vaults/usages/read | Read usage of the Recovery Services vault |

## Billing Reader
Can view all Billing information

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Billing/*/read | Read Billing information |
| Microsoft.Consumption/*/read |  |
| Microsoft.Commerce/*/read |  |
| Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
| Microsoft.Support/* | Create and manage support tickets |

## BizTalk Contributor
Can manage BizTalk services

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.BizTalkServices/BizTalk/* | Create and manage BizTalk services |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## CDN Endpoint Contributor
Can manage CDN endpoints, but can’t grant access to other users.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Cdn/edgenodes/read |  |
| Microsoft.Cdn/operationresults/* |  |
| Microsoft.Cdn/profiles/endpoints/* |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## CDN Endpoint Reader
Can view CDN endpoints, but can’t make changes.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Cdn/edgenodes/read |  |
| Microsoft.Cdn/operationresults/* |  |
| Microsoft.Cdn/profiles/endpoints/*/read |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## CDN Profile Contributor
Can manage CDN profiles and their endpoints, but can’t grant access to other users.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Cdn/edgenodes/read |  |
| Microsoft.Cdn/operationresults/* |  |
| Microsoft.Cdn/profiles/* |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## CDN Profile Reader
Can view CDN profiles and their endpoints, but can’t make changes.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Cdn/edgenodes/read |  |
| Microsoft.Cdn/operationresults/* |  |
| Microsoft.Cdn/profiles/*/read |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Classic Network Contributor
Can manage classic virtual networks and reserved IPs

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicNetwork/* | Create and manage classic networks |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Classic Storage Account Contributor
Can manage classic storage accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicStorage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Classic Storage Account Key Operator Service Role
Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts

| **Actions** |  |
| --- | --- |
| Microsoft.ClassicStorage/storageAccounts/listkeys/action | Lists the access keys for the storage accounts. |
| Microsoft.ClassicStorage/storageAccounts/regeneratekey/action | Regenerates the existing access keys for the storage account. |

## Classic Virtual Machine Contributor
Can manage classic virtual machines but not the virtual network or storage account to which they are connected

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicCompute/domainNames/* | Create and manage classic compute domain names |
| Microsoft.ClassicCompute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.ClassicNetwork/networkSecurityGroups/join/action | Join network security groups |
| Microsoft.ClassicNetwork/reservedIps/link/action | Link reserved IPs |
| Microsoft.ClassicNetwork/reservedIps/read | Read reserved IP addresses |
| Microsoft.ClassicNetwork/virtualNetworks/join/action | Join virtual networks |
| Microsoft.ClassicNetwork/virtualNetworks/read | Read virtual networks |
| Microsoft.ClassicStorage/storageAccounts/disks/read | Read storage account disks |
| Microsoft.ClassicStorage/storageAccounts/images/read | Read storage account images |
| Microsoft.ClassicStorage/storageAccounts/listKeys/action | List storage account keys |
| Microsoft.ClassicStorage/storageAccounts/read | Read classic storage accounts |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## ClearDB MySQL DB Contributor
Can manage ClearDB MySQL databases

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |
| successbricks.cleardb/databases/* | Create and manage ClearDB MySQL databases |

## Cosmos DB Account Reader Role
Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments, can read permissions given to each user |
| Microsoft.DocumentDB/*/read | Read any collection |
| Microsoft.DocumentDB/databaseAccounts/readonlykeys/action | Read the readonly keys pane |
| Microsoft.Insights/MetricDefinitions/read | Read metrics definitions |
| Microsoft.Insights/Metrics/read | Read account metrics |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Data Factory Contributor
Create and manage data factories, and child resources within them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.DataFactory/dataFactories/* | Create and manage data factories, and child resources within them. |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Data Lake Analytics Developer
Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.BigAnalytics/accounts/* |  |
| Microsoft.DataLakeAnalytics/accounts/* |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.BigAnalytics/accounts/Delete |  |
| Microsoft.BigAnalytics/accounts/TakeOwnership/action |  |
| Microsoft.BigAnalytics/accounts/Write |  |
| Microsoft.DataLakeAnalytics/accounts/Delete | Delete a DataLakeAnalytics account. |
| Microsoft.DataLakeAnalytics/accounts/TakeOwnership/action | Grant permissions to cancel jobs submitted by other users. |
| Microsoft.DataLakeAnalytics/accounts/Write | Create or update a DataLakeAnalytics account. |
| Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/Write | Create or update a linked DataLakeStore account of a DataLakeAnalytics account. |
| Microsoft.DataLakeAnalytics/accounts/dataLakeStoreAccounts/Delete | Unlink a DataLakeStore account from a DataLakeAnalytics account. |
| Microsoft.DataLakeAnalytics/accounts/storageAccounts/Write | Create or update a linked Storage account of a DataLakeAnalytics account. |
| Microsoft.DataLakeAnalytics/accounts/storageAccounts/Delete | Unlink a Storage account from a DataLakeAnalytics account. |
| Microsoft.DataLakeAnalytics/accounts/firewallRules/Write | Create or update a firewall rule. |
| Microsoft.DataLakeAnalytics/accounts/firewallRules/Delete | Delete a firewall rule. |
| Microsoft.DataLakeAnalytics/accounts/computePolicies/Write | Create or update a compute policy. |
| Microsoft.DataLakeAnalytics/accounts/computePolicies/Delete | Delete a compute policy. |

## DevTest Labs User
Can view everything and connect, start, restart, and shutdown virtual machines

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Compute/availabilitySets/read | Read the properties of availability sets |
| Microsoft.Compute/virtualMachines/*/read | Read the properties of a virtual machine (VM sizes, runtime status, VM extensions, etc.) |
| Microsoft.Compute/virtualMachines/deallocate/action | Deallocate virtual machines |
| Microsoft.Compute/virtualMachines/read | Read the properties of a virtual machine |
| Microsoft.Compute/virtualMachines/restart/action | Restart virtual machines |
| Microsoft.Compute/virtualMachines/start/action | Start virtual machines |
| Microsoft.DevTestLab/*/read | Read the properties of a lab |
| Microsoft.DevTestLab/labs/createEnvironment/action | Create a lab environment |
| Microsoft.DevTestLab/labs/claimAnyVm/action | Claim a random claimable virtual machine in the lab. |
| Microsoft.DevTestLab/labs/formulas/delete | Delete formulas |
| Microsoft.DevTestLab/labs/formulas/read | Read formulas |
| Microsoft.DevTestLab/labs/formulas/write | Add or modify formulas |
| Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action | Evaluate lab policies |
| Microsoft.DevTestLab/labs/virtualMachines/claim/action | Take ownership of an existing virtual machine |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Join a load balancer backend address pool |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Join a load balancer inbound NAT rule |
| Microsoft.Network/networkInterfaces/*/read | Read the properties of a network interface (for example, all the load balancers that the network interface is a part of) |
| Microsoft.Network/networkInterfaces/join/action | Join a Virtual Machine to a network interface |
| Microsoft.Network/networkInterfaces/read | Read network interfaces |
| Microsoft.Network/networkInterfaces/write | Write network interfaces |
| Microsoft.Network/publicIPAddresses/*/read | Read the properties of a public IP address |
| Microsoft.Network/publicIPAddresses/join/action | Join a public IP address |
| Microsoft.Network/publicIPAddresses/read | Read network public IP addresses |
| Microsoft.Network/virtualNetworks/subnets/join/action | Join a virtual network |
| Microsoft.Resources/deployments/operations/read | Read deployment operations |
| Microsoft.Resources/deployments/read | Read deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/listKeys/action | List storage account keys |

| **NotActions** |  |
| --- | --- |
| Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |

## DNS Zone Contributor
Can manage DNS zones and records.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/dnsZones/* | Create and manage DNS zones and records |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read the health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage Support tickets |

## DocumentDB Account Contributor
Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.DocumentDb/databaseAccounts/* | Create and manage Azure Cosmos DB accounts |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Intelligent Systems Account Contributor
Can manage Intelligent Systems accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.IntelligentSystems/accounts/* | Create and manage intelligent systems accounts |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Key Vault Contributor
Lets you manage key vaults, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.KeyVault/* |  |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.KeyVault/locations/deletedVaults/purge/action | Purge a soft deleted key vault |
| Microsoft.KeyVault/hsmPools/* |  |

## Lab Creator
Lets you create, manage, delete your managed labs under your Azure Lab Accounts.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.ManagedLab/labAccounts/createLab/action | Create a lab in a lab account. |
| Microsoft.ManagedLab/labAccounts/*/read |  |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Log Analytics Contributor
Log Analytics Contributor can read all monitoring data and edit monitoring settings. Editing monitoring settings includes adding the VM extension to VMs; reading storage account keys to be able to configure collection of logs from Azure Storage; creating and configuring Automation accounts; adding solutions; and configuring Azure diagnostics on all Azure resources.

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |
| Microsoft.Automation/automationAccounts/* |  |
| Microsoft.ClassicCompute/virtualMachines/extensions/* |  |
| Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
| Microsoft.Compute/virtualMachines/extensions/* |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
| Microsoft.OperationalInsights/* |  |
| Microsoft.OperationsManagement/* |  |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourcegroups/deployments/* |  |
| Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
| Microsoft.Support/* | Create and manage support tickets |

## Log Analytics Reader
Log Analytics Reader can view and search all monitoring data as well as and view monitoring settings, including viewing the configuration of Azure diagnostics on all Azure resources.

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |
| Microsoft.OperationalInsights/workspaces/analytics/query/action | Search using new engine. |
| Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.OperationalInsights/workspaces/sharedKeys/read | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |

## Logic App Contributor
Lets you manage logic app, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
| Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/diagnosticSettings/* | Creates, updates, or reads the diagnostic setting for Analysis Server |
| Microsoft.Insights/logdefinitions/* | This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
| Microsoft.Insights/metricDefinitions/* | Read metric definitions (list of available metric types for a resource). |
| Microsoft.Logic/* | Manages Logic Apps resources. |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
| Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/connectionGateways/* | Create and manages a Connection Gateway. |
| Microsoft.Web/connections/* | Create and manages a Connection. |
| Microsoft.Web/customApis/* | Creates and manages a Custom API. |
| Microsoft.Web/serverFarms/join/action |  |
| Microsoft.Web/serverFarms/read | Get the properties on an App Service Plan |
| Microsoft.Web/sites/functions/listSecrets/action | List Secrets Web Apps Functions. |

## Logic App Operator
Lets you read, enable and disable logic app.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/*/read | Read Insights alert rules |
| Microsoft.Insights/diagnosticSettings/*/read | Gets diagnostic settings for Logic Apps |
| Microsoft.Insights/metricDefinitions/*/read | Gets the available metrics for Logic Apps. |
| Microsoft.Logic/*/read | Reads Logic Apps resources. |
| Microsoft.Logic/workflows/disable/action | Disables the workflow. |
| Microsoft.Logic/workflows/enable/action | Enables the workflow. |
| Microsoft.Logic/workflows/validate/action | Validates the workflow. |
| Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
| Microsoft.Resources/subscriptions/operationresults/read | Get the subscription operation results. |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/connectionGateways/*/read | Read Connection Gateways. |
| Microsoft.Web/connections/*/read | Read Connections. |
| Microsoft.Web/customApis/*/read | Read Custom API. |
| Microsoft.Web/serverFarms/read | Get the properties on an App Service Plan |

## Managed Identity Contributor
Create, Read, Update, and Delete User Assigned Identity

| **Actions** |  |
| --- | --- |
| Microsoft.ManagedIdentity/userAssignedIdentities/*/read |  |
| Microsoft.ManagedIdentity/userAssignedIdentities/*/write |  |
| Microsoft.ManagedIdentity/userAssignedIdentities/*/delete |  |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Support/* | Create and manage support tickets |

## Managed Identity Operator
Read and Assign User Assigned Identity

| **Actions** |  |
| --- | --- |
| Microsoft.ManagedIdentity/userAssignedIdentities/*/read |  |
| Microsoft.ManagedIdentity/userAssignedIdentities/*/assign/action |  |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Support/* | Create and manage support tickets |

## Monitoring Contributor
Can read all monitoring data and edit monitoring settings. See also [Get started with roles, permissions, and security with Azure Monitor](../monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles).

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |
| Microsoft.AlertsManagement/alerts/* |  |
| Microsoft.AlertsManagement/alertsSummary/* |  |
| Microsoft.Insights/AlertRules/* | Read/write/delete alert rules. |
| Microsoft.Insights/components/* | Read/write/delete Application Insights components. |
| Microsoft.Insights/DiagnosticSettings/* | Read/write/delete diagnostic settings. |
| Microsoft.Insights/eventtypes/* | List Activity Log events (management events) in a subscription. This permission is applicable to both programmatic and portal access to the Activity Log. |
| Microsoft.Insights/LogDefinitions/* | This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
| Microsoft.Insights/MetricDefinitions/* | Read metric definitions (list of available metric types for a resource). |
| Microsoft.Insights/Metrics/* | Read metrics for a resource. |
| Microsoft.Insights/Register/Action | Register the Microsoft.Insights provider. |
| Microsoft.Insights/webtests/* | Read/write/delete Application Insights web tests. |
| Microsoft.OperationalInsights/workspaces/intelligencepacks/* | Read/write/delete Log Analytics solution packs. |
| Microsoft.OperationalInsights/workspaces/savedSearches/* | Read/write/delete Log Analytics saved searches. |
| Microsoft.OperationalInsights/workspaces/search/action | Search Log Analytics workspaces. |
| Microsoft.OperationalInsights/workspaces/sharedKeys/action | List keys for a Log Analytics workspace. |
| Microsoft.OperationalInsights/workspaces/storageinsightconfigs/* | Read/write/delete Log Analytics storage insight configurations. |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.WorkloadMonitor/workloads/* |  |

## Monitoring Reader
Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](../monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles).

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |
| Microsoft.OperationalInsights/workspaces/search/action | Search Log Analytics data |
| Microsoft.Support/* | Create and manage support tickets |

## Network Contributor
Can manage all network resources

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/* | Create and manage networks |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## New Relic APM Account Contributor
Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |
| NewRelic.APM/accounts/* |  |

## Redis Cache Contributor
Can manage Redis caches

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Cache/redis/* | Create and manage Redis caches |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

## Scheduler Job Collections Contributor
Can manage Scheduler job collections

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Scheduler/jobcollections/* | Create and manage job collections |
| Microsoft.Support/* | Create and manage support tickets |

## Search Service Contributor
Can manage Search services

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Search/searchServices/* | Create and manage search services |
| Microsoft.Support/* | Create and manage support tickets |

## Security Admin
In Security Center only: Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Authorization/policyAssignments/* | Create and manage policy assignments |
| Microsoft.Authorization/policyDefinitions/* | Create and manage policy definitions |
| Microsoft.Authorization/policySetDefinitions/* | Create and manage policy sets |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.operationalInsights/workspaces/*/read | View Log Analytics data |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Security/*/read | Read security components and policies |
| Microsoft.Security/locations/alerts/dismiss/action | Dismiss a security alert |
| Microsoft.Security/locations/tasks/dismiss/action | Dismiss a security recommendation |
| Microsoft.Security/policies/write | Updates the security policy |
| Microsoft.Support/* | Create and manage support tickets |

## Security Manager
Can manage security components, security policies, and virtual machines

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.ClassicCompute/*/read | Read configuration information classic virtual machines |
| Microsoft.ClassicCompute/virtualMachines/*/write | Write configuration for classic virtual machines |
| Microsoft.ClassicNetwork/*/read | Read configuration information about classic network |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Security/* | Create and manage security components and policies |
| Microsoft.Support/* | Create and manage support tickets |

## Security Reader
In Security Center only: Can view recommendations and alerts, view security policies, view security states, but cannot make changes

| **Actions** |  |
| --- | --- |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.operationalInsights/workspaces/*/read | View Log Analytics data |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Security/*/read | Read security components and policies |

## Site Recovery Contributor
Can manage all Site Recovery management actions, except creating Recovery Services vault and assigning access rights to other users

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/certificates/write | Updates the vault credential certificate |
| Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | Read Recovery Services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/* | Create and manage registered identities |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/* | Create or Update replication alert settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read | Read replication events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/* | Create and manage replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationJobs/* | Create and manage replication jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/* | Create and manage replication policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/* | Create and manage recovery plans |
| Microsoft.RecoveryServices/Vaults/storageConfig/* | Create and manage storage configuration of Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Read Recovery Services vault token information |
| Microsoft.RecoveryServices/Vaults/usages/read | Read usage details of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read | Read Recovery services vault notification configuration |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

## Site Recovery Operator
Can Failover and Failback but can not perform other Site Recovery management actions or assign access to other users

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | Read Recovery Services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | Read operation status and result for a submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | Read containers registered for a resource |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read replication alert settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read | Read replication events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action | Check consistency of the fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action | Re-associate replication gateway |
| Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action | Renew replication fabric certificate |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read replication fabric networks |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationNetworks/replicationNetworkMappings/read | Read replication fabric network mapping |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/read | Read protection containers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectableItems/read | Get list of all protectable items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/read | Get list of all protected items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Get list of available recovery points |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/reProtect/action | Start re-protect for a protected item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/testFailover/action | Start test failover of a protected item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectionContainerMappings/read | Read protection container mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationRecoveryServicesProviders/read | Read Recovery Services providers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationRecoveryServicesProviders/refreshProvider/action | Refresh Recovery Services provider |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/read | Read storage classifications for replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/replicationStorageClassificationMappings/read | Read storage classification mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read registered vCenter information |
| Microsoft.RecoveryServices/vaults/replicationJobs/* | Create and manage replication jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read replication policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action | Commit failover for recovery plan failover |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action | Start failover of a recovery plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read recovery plans |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action | Start re-protect of a recovery plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action | Start test failover of a recovery plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Start cleanup of a recovery plan test failover |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action | Start unplanned failover of a recovery plan |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read | Read Recovery services vault notification configuration |
| Microsoft.RecoveryServices/Vaults/storageConfig/read | Read storage configuration of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Read Recovery Services vault token information |
| Microsoft.RecoveryServices/Vaults/usages/read | Read usage details of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

## Site Recovery Reader
Can monitor Site Recovery status in Recovery Services vault and raise Support tickets

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read | Read Recovery services vault notification configuration |
| Microsoft.RecoveryServices/Vaults/read | Read Recovery Services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | Read operation status and result for a submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | Read containers registered for a resource |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read replication alert settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read | Read replication events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read replication fabric networks |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationNetworks/replicationNetworkMappings/read | Read replication fabric network mapping |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/read | Read protection containers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectableItems/read | Get list of all protectable items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/read | Get list of all protected items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Get list of available recovery points |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectionContainerMappings/read | Read protection container mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationRecoveryServicesProviders/read | Read Recovery Services providers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/read | Read storage classifications for replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/replicationStorageClassificationMappings/read | Read storage classification mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read registered vCenter information |
| Microsoft.RecoveryServices/vaults/replicationJobs/read | Read status of replication jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read replication policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read recovery plans |
| Microsoft.RecoveryServices/Vaults/storageConfig/read | Read storage configuration of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Read Recovery Services vault token information |
| Microsoft.RecoveryServices/Vaults/usages/read | Read usage details of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
| Microsoft.Support/* | Create and manage support tickets |

## SQL DB Contributor
Can manage SQL databases but not their security-related policies

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Sql/locations/*/read |  |
| Microsoft.Sql/servers/databases/* | Create and manage SQL databases |
| Microsoft.Sql/servers/read | Read SQL Servers |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit audit policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Can't edit audit settings |
| Microsoft.Sql/servers/databases/auditRecords/read | Can't read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Can't edit connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Can't edit data masking policies |
| Microsoft.Sql/servers/databases/extendedAuditingSettings/* |  |
| Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Can't edit security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Can't edit security metrics |
| Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |

## SQL Security Manager
Can manage the security-related policies of SQL servers and databases

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read Microsoft authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Sql/servers/auditingPolicies/* | Create and manage SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* | Create and manage SQL server auditing setting |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Create and manage SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Create and manage SQL server database auditing settings |
| Microsoft.Sql/servers/databases/auditRecords/read | Read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Create and manage SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Create and manage SQL server database data masking policies |
| Microsoft.Sql/servers/databases/read | Read SQL databases |
| Microsoft.Sql/servers/databases/schemas/read | Read SQL server database schemas |
| Microsoft.Sql/servers/databases/schemas/tables/columns/read | Read SQL server database table columns |
| Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/schemas/tables/read | Read SQL server database tables |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Create and manage SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Create and manage SQL server database security metrics |
| Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |
| Microsoft.Sql/servers/firewallRules/* |  |
| Microsoft.Sql/servers/read | Read SQL Servers |
| Microsoft.Sql/servers/securityAlertPolicies/* | Create and manage SQL server security alert policies |
| Microsoft.Support/* | Create and manage support tickets |

## SQL Server Contributor
Can manage SQL servers and databases but not their security-related policies

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Sql/locations/*/read |  |
| Microsoft.Sql/servers/* | Create and manage SQL servers |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.Sql/servers/auditingPolicies/* | Can't edit SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* | Can't edit SQL server auditing settings |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Can't edit SQL server database auditing settings |
| Microsoft.Sql/servers/databases/auditRecords/read | Can't read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Can't edit SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Can't edit SQL server database data masking policies |
| Microsoft.Sql/servers/databases/extendedAuditingSettings/* |  |
| Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Can't edit SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Can't edit SQL server database security metrics |
| Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |
| Microsoft.Sql/servers/extendedAuditingSettings/* |  |
| Microsoft.Sql/servers/securityAlertPolicies/* | Can't edit SQL server security alert policies |

## Storage Account Contributor
Can manage storage accounts, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read all authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/diagnosticSettings/* | Manage diagnostic settings |
| Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

## Storage Account Key Operator Service Role
Storage Account Key Operators are allowed to list and regenerate keys on Storage Accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
| Microsoft.Storage/storageAccounts/regeneratekey/action | Regenerates the access keys for the specified storage account. |

## Support Request Contributor
Can create and manage support tickets at the subscription scope

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |
| Microsoft.Support/* | Create and manage support tickets |

## Traffic Manager Contributor
Lets you manage Traffic Manager profiles, but does not let you control who has access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Network/trafficManagerProfiles/* |  |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## User Access Administrator
Can manage user access to Azure resources

| **Actions** |  |
| --- | --- |
| */read | Read resources of all Types, except secrets. |
| Microsoft.Authorization/* | Manage authorization |
| Microsoft.Support/* | Create and manage support tickets |

## Virtual Machine Administrator Login
-	Users with this role have the ability to login to a virtual machine with Windows administrator or Linux root user privileges.

| **Actions** |  |
| --- | --- |
| Microsoft.Compute/virtualMachines/loginAsAdmin/action |  |
| Microsoft.Compute/virtualMachines/login/action |  |
| Microsoft.Compute/virtualMachine/loginAsAdmin/action |  |
| Microsoft.Compute/virtualMachine/logon/action |  |

## Virtual Machine Contributor
Can manage virtual machines but not the virtual network or storage account to which they are connected

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Compute/availabilitySets/* | Create and manage compute availability sets |
| Microsoft.Compute/locations/* | Create and manage compute locations |
| Microsoft.Compute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.Compute/virtualMachineScaleSets/* | Create and manage virtual machine scale sets |
| Microsoft.DevTestLab/schedules/* |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Network/applicationGateways/backendAddressPools/join/action | Join network application gateway backend address pools |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Join load balancer backend address pools |
| Microsoft.Network/loadBalancers/inboundNatPools/join/action | Join load balancer inbound NAT pools |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Join load balancer inbound NAT rules |
| Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. |
| Microsoft.Network/loadBalancers/read | Read load balancers |
| Microsoft.Network/locations/* | Create and manage network locations |
| Microsoft.Network/networkInterfaces/* | Create and manage network interfaces |
| Microsoft.Network/networkSecurityGroups/join/action | Join network security groups |
| Microsoft.Network/networkSecurityGroups/read | Read network security groups |
| Microsoft.Network/publicIPAddresses/join/action | Join network public IP addresses |
| Microsoft.Network/publicIPAddresses/read | Read network public IP addresses |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.Network/virtualNetworks/subnets/join/action | Join virtual network subnets |
| Microsoft.RecoveryServices/locations/* |  |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/*/read |  |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/read | Returns object details of the Protected Item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/write | Create a backup Protected Item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/backupProtectionIntent/write | Create a backup Protection Intent |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
| Microsoft.RecoveryServices/Vaults/backupPolicies/write | Creates Protection Policy |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/write | Create Vault operation creates an Azure resource of type 'vault' |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/listKeys/action | List storage account keys |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

## Virtual Machine User Login
Users with this role have the ability to login to a virtual machine as a regular user.

| **Actions** |  |
| --- | --- |
| Microsoft.Compute/virtualMachines/login/action |  |
| Microsoft.Compute/virtualMachine/logon/action |  |

## Web Plan Contributor
Can manage web plans

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/serverFarms/* | Create and manage server farms |

## Website Contributor
Can manage websites but not the web plans to which they are connected

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/certificates/* | Create and manage website certificates |
| Microsoft.Web/listSitesAssignedToHostName/read | Read sites assigned to a host name |
| Microsoft.Web/serverFarms/join/action | Join server farms |
| Microsoft.Web/serverFarms/read | Read server farms |
| Microsoft.Web/sites/* | Create and manage websites (site creation also requires write permissions to the associated App Service Plan) |

## See also
* [Role-Based Access Control](role-based-access-control-configure.md): Get started with RBAC in the Azure portal.
* [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md): Learn how to create custom roles to fit your access needs.
* [Create an access change history report](role-based-access-control-access-change-history-report.md): Keep track of changing role assignments in RBAC.
* [Role-Based Access Control troubleshooting](role-based-access-control-troubleshooting.md): Get suggestions for fixing common issues.
* [Permissions in Azure Security Center](../security-center/security-center-permissions.md)
