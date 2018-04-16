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
Azure Role-Based Access Control (RBAC) comes with the following built-in roles that can be assigned to users, groups, and services. You can’t modify the definitions of built-in roles. However, you can create [Custom roles in Azure RBAC](custom-roles.md) to fit the specific needs of your organization.

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
| [Owner](#owner) | Lets you manage everything, including access to resources. |
| [Contributor](#contributor) | Lets you manage everything except access to resources. |
| [Reader](#reader) | Lets you view everything, but not make any changes. |
| [API Management Service Contributor](#api-management-service-contributor) | Can manage service and the APIs |
| [API Management Service Operator Role](#api-management-service-operator-role) | Can manage service but not the APIs |
| [API Management Service Reader Role](#api-management-service-reader-role) | Read-only access to service and APIs |
| [Application Insights Component Contributor](#application-insights-component-contributor) | Can manage Application Insights components |
| [Application Insights Snapshot Debugger](#application-insights-snapshot-debugger) | Gives user permission to use Application Insights Snapshot Debugger features |
| [Automation Job Operator](#automation-job-operator) | Create and Manage Jobs using Automation Runbooks. |
| [Automation Operator](#automation-operator) | Automation Operators are able to start, stop, suspend, and resume jobs |
| [Automation Runbook Operator](#automation-runbook-operator) | Read Runbook properties - to be able to create Jobs of the runbook. |
| [Azure Stack Registration Owner](#azure-stack-registration-owner) | Lets you manage Azure Stack registrations. |
| [Backup Contributor](#backup-contributor) | Lets you manage backup service,but can't create vaults and give access to others |
| [Backup Operator](#backup-operator) | Lets you manage backup services, except removal of backup, vault creation and giving access to others |
| [Backup Reader](#backup-reader) | Can view backup services, but can't make changes |
| [Billing Reader](#billing-reader) | Allows read access to billing data |
| [BizTalk Contributor](#biztalk-contributor) | Lets you manage BizTalk services, but not access to them. |
| [CDN Endpoint Contributor](#cdn-endpoint-contributor) | Can manage CDN endpoints, but can’t grant access to other users. |
| [CDN Endpoint Reader](#cdn-endpoint-reader) | Can view CDN endpoints, but can’t make changes. |
| [CDN Profile Contributor](#cdn-profile-contributor) | Can manage CDN profiles and their endpoints, but can’t grant access to other users. |
| [CDN Profile Reader](#cdn-profile-reader) | Can view CDN profiles and their endpoints, but can’t make changes. |
| [Classic Network Contributor](#classic-network-contributor) | Lets you manage classic networks, but not access to them. |
| [Classic Storage Account Contributor](#classic-storage-account-contributor) | Lets you manage classic storage accounts, but not access to them. |
| [Classic Storage Account Key Operator Service Role](#classic-storage-account-key-operator-service-role) | Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts |
| [Classic Virtual Machine Contributor](#classic-virtual-machine-contributor) | Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to. |
| [ClearDB MySQL DB Contributor](#cleardb-mysql-db-contributor) | Lets you manage ClearDB MySQL databases, but not access to them. |
| [Cosmos DB Account Reader Role](#cosmos-db-account-reader-role) | Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts. |
| [Data Factory Contributor](#data-factory-contributor) | Create and manage data factories, as well as child resources within them. |
| [Data Lake Analytics Developer](#data-lake-analytics-developer) | Lets you submit, monitor, and manage your own jobs but not create or delete Data Lake Analytics accounts. |
| [DevTest Labs User](#devtest-labs-user) | Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs. |
| [DNS Zone Contributor](#dns-zone-contributor) | Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them. |
| [DocumentDB Account Contributor](#documentdb-account-contributor) | Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB. |
| [Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) | Lets you manage Intelligent Systems accounts, but not access to them. |
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
| [Network Contributor](#network-contributor) | Lets you manage networks, but not access to them. |
| [New Relic APM Account Contributor](#new-relic-apm-account-contributor) | Lets you manage New Relic Application Performance Management accounts and applications, but not access to them. |
| [Redis Cache Contributor](#redis-cache-contributor) | Lets you manage Redis caches, but not access to them. |
| [Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) | Lets you manage Scheduler job collections, but not access to them. |
| [Search Service Contributor](#search-service-contributor) | Lets you manage Search services, but not access to them. |
| [Security Admin](#security-admin) | In Security Center only: Can view security policies, view security states, edit security policies, view alerts and recommendations, dismiss alerts and recommendations |
| [Security Manager](#security-manager) | Lets you manage security components, security policies and virtual machines |
| [Security Reader](#security-reader) | In Security Center only: Can view recommendations and alerts, view security policies, view security states, but cannot make changes |
| [Site Recovery Contributor](#site-recovery-contributor) | Lets you manage Site Recovery service except vault creation and role assignment |
| [Site Recovery Operator](#site-recovery-operator) | Lets you failover and failback but not perform other Site Recovery management operations |
| [Site Recovery Reader](#site-recovery-reader) | Lets you view Site Recovery status but not perform other management operations |
| [SQL DB Contributor](#sql-db-contributor) | Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers. |
| [SQL Security Manager](#sql-security-manager) | Lets you manage the security-related policies of SQL servers and databases, but not access to them. |
| [SQL Server Contributor](#sql-server-contributor) | Lets you manage SQL servers and databases, but not access to them, and not their security -related policies. |
| [Storage Account Contributor](#storage-account-contributor) | Lets you manage storage accounts, but not access to them. |
| [Storage Account Key Operator Service Role](#storage-account-key-operator-service-role) | Storage Account Key Operators are allowed to list and regenerate keys on Storage Accounts |
| [Support Request Contributor](#support-request-contributor) | Lets you create and manage Support requests |
| [Traffic Manager Contributor](#traffic-manager-contributor) | Lets you manage Traffic Manager profiles, but does not let you control who has access to them. |
| [User Access Administrator](#user-access-administrator) | Lets you manage user access to Azure resources. |
| [Virtual Machine Administrator Login](#virtual-machine-administrator-login) | -	Users with this role have the ability to login to a virtual machine with Windows administrator or Linux root user privileges. |
| [Virtual Machine Contributor](#virtual-machine-contributor) | Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to. |
| [Virtual Machine User Login](#virtual-machine-user-login) | Users with this role have the ability to login to a virtual machine as a regular user. |
| [Web Plan Contributor](#web-plan-contributor) | Lets you manage the web plans for websites, but not access to them. |
| [Website Contributor](#website-contributor) | Lets you manage websites (not web plans), but not access to them. |

The following tables describe the specific permissions given to each role. This can include **Actions**, which give permissions, and **NotActions**, which restrict them.

## Owner
Lets you manage everything, including access to resources.

| **Actions** |  |
| --- | --- |
| * | Create and manage resources of all types |

## Contributor
Lets you manage everything except access to resources.

| **Actions** |  |
| --- | --- |
| * | Create and manage resources of all types |

| **NotActions** |  |
| --- | --- |
| Microsoft.Authorization/*/Delete | Can't delete roles and role assignments |
| Microsoft.Authorization/*/Write | Can't create roles and role assignments |
| Microsoft.Authorization/elevateAccess/Action | Grants the caller User Access Administrator access at the tenant scope |

## Reader
Lets you view everything, but not make any changes.

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |

## API Management Service Contributor
Can manage service and the APIs

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/* | Create and manage API Management service |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## API Management Service Operator Role
Can manage service but not the APIs

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/*/read | Read API Management Service instances |
| Microsoft.ApiManagement/service/backup/action | Backup API Management Service to the specified container in a user provided storage account |
| Microsoft.ApiManagement/service/delete | Delete API Management Service instance |
| Microsoft.ApiManagement/service/managedeployments/action | Change SKU/units, add/remove regional deployments of API Management Service |
| Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
| Microsoft.ApiManagement/service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
| Microsoft.ApiManagement/service/updatecertificate/action | Upload SSL certificate for an API Management Service |
| Microsoft.ApiManagement/service/updatehostname/action | Setup, update or remove custom domain names for an API Management Service |
| Microsoft.ApiManagement/service/write | Create a new instance of API Management Service |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/users/keys/read | Get list of user keys |

## API Management Service Reader Role
Read-only access to service and APIs

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/service/*/read | Read API Management Service instances |
| Microsoft.ApiManagement/service/read | Read metadata for an API Management Service instance |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Automation Operators are able to start, stop, suspend, and resume jobs

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Automation/automationAccounts/jobs/read | Gets an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/resume/action | Resumes an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/stop/action | Stops an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/streams/read | Gets an Azure Automation job stream |
| Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspends an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobs/write | Creates an Azure Automation job |
| Microsoft.Automation/automationAccounts/jobSchedules/read | Gets an Azure Automation job schedule |
| Microsoft.Automation/automationAccounts/jobSchedules/write | Creates an Azure Automation job schedule |
| Microsoft.Automation/automationAccounts/linkedWorkspace/read | Gets the workspace linked to the automation account |
| Microsoft.Automation/automationAccounts/hybridRunbookWorkerGroups/read | Reads Hybrid Runbook Worker Resources |
| Microsoft.Automation/automationAccounts/read | Gets an Azure Automation account |
| Microsoft.Automation/automationAccounts/runbooks/read | Gets an Azure Automation runbook |
| Microsoft.Automation/automationAccounts/schedules/read | Gets an Azure Automation schedule asset |
| Microsoft.Automation/automationAccounts/schedules/write | Creates or updates an Azure Automation schedule asset |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Lets you manage backup service,but can't create vaults and give access to others

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/* | Manage results of operation on backup management |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/* | Create and manage backup containers inside backup fabrics of Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/* | Create and manage meta data related to backup management |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
| Microsoft.RecoveryServices/Vaults/backupPolicies/* | Create and manage backup policies |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/* | Create and manage backed up items |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/* | Create and manage containers holding backup items |
| Microsoft.RecoveryServices/Vaults/certificates/* | Create and manage certificates related to backup in Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/refreshContainers/* | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/* | Create and manage registered identities |
| Microsoft.RecoveryServices/Vaults/usages/* | Create and manage usage of Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/* |  |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
| Microsoft.RecoveryServices/Vaults/storageConfig/* |  |
| Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/* |  |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/operationResults/read | Returns the Result of Export Job Operation. |
| Microsoft.RecoveryServices/Vaults/backupSecurityPIN/* |  |
| Microsoft.Support/* | Create and manage support tickets |

## Backup Operator
Lets you manage backup services, except removal of backup, vault creation and giving access to others

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ operationResults/read | Gets result of Operation performed on Protection Container. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/backup/action | Performs Backup for Protected Item. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/read | Returns object details of the Protected Item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/restore/action | Restore Recovery Points for Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/write | Create a backup Protected Item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
| Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobs/cancel/action | Cancel the Job |
| Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
| Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read | Returns Backup Management Metadata for Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/read | Returns list of all Protectable Items. |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
| Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
| Microsoft.RecoveryServices/Vaults/extendedInformation/write | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/refreshContainers/* | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/write | The Register Service Container operation can be used to register a container with Recovery Service. |
| Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
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
Can view backup services, but can't make changes

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Returns status of the operation |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ operationResults/read | Gets result of Operation performed on Protection Container. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationResults/read | Gets Result of Operation Performed on Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/operationsStatus/read | Returns the status of Operation performed on Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/read | Returns object details of the Protected Item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Returns all registered containers |
| Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read | Returns the Result of Job Operation. |
| Microsoft.RecoveryServices/Vaults/backupJobs/read | Returns all Job Objects |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export Jobs |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read | Returns Backup Management Metadata for Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/read | Returns Backup Operation Result for Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Get Results of Policy Operation. |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read | Returns all Protection Policies |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Returns the list of all Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Returns all containers belonging to the subscription |
| Microsoft.RecoveryServices/Vaults/backupUsageSummaries/read | Returns summaries for Protected Items and Protected Servers for a Recovery Services . |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read |  |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
| Microsoft.RecoveryServices/Vaults/storageConfig/read |  |
| Microsoft.RecoveryServices/Vaults/backupconfig/vaultconfig/read |  |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/ protectedItems/recoveryPoints/read | Get Recovery Points for Protected Items. |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/operationResults/read | Returns the Result of Export Job Operation. |
| Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |

## Billing Reader
Allows read access to billing data

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Billing/*/read | Read Billing information |
| Microsoft.Consumption/*/read |  |
| Microsoft.Commerce/*/read |  |
| Microsoft.Management/managementGroups/read | List management groups for the authenticated user. |
| Microsoft.Support/* | Create and manage support tickets |

## BizTalk Contributor
Lets you manage BizTalk services, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.BizTalkServices/BizTalk/* | Create and manage BizTalk services |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Lets you manage classic networks, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicNetwork/* | Create and manage classic networks |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Classic Storage Account Contributor
Lets you manage classic storage accounts, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicStorage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Classic Storage Account Key Operator Service Role
Classic Storage Account Key Operators are allowed to list and regenerate keys on Classic Storage Accounts

| **Actions** |  |
| --- | --- |
| Microsoft.ClassicStorage/storageAccounts/listkeys/action | Lists the access keys for the storage accounts. |
| Microsoft.ClassicStorage/storageAccounts/regeneratekey/action | Regenerates the existing access keys for the storage account. |

## Classic Virtual Machine Contributor
Lets you manage classic virtual machines, but not access to them, and not the virtual network or storage account they're connected to.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicCompute/domainNames/* | Create and manage classic compute domain names |
| Microsoft.ClassicCompute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.ClassicNetwork/networkSecurityGroups/join/action |  |
| Microsoft.ClassicNetwork/reservedIps/link/action | Link a reserved Ip |
| Microsoft.ClassicNetwork/reservedIps/read | Gets the reserved Ips |
| Microsoft.ClassicNetwork/virtualNetworks/join/action | Joins the virtual network. |
| Microsoft.ClassicNetwork/virtualNetworks/read | Get the virtual network. |
| Microsoft.ClassicStorage/storageAccounts/disks/read | Returns the storage account disk. |
| Microsoft.ClassicStorage/storageAccounts/images/read | Returns the storage account image. |
| Microsoft.ClassicStorage/storageAccounts/listKeys/action | Lists the access keys for the storage accounts. |
| Microsoft.ClassicStorage/storageAccounts/read | Return the storage account with the given account. |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## ClearDB MySQL DB Contributor
Lets you manage ClearDB MySQL databases, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |
| successbricks.cleardb/databases/* | Create and manage ClearDB MySQL databases |

## Cosmos DB Account Reader Role
Can read Azure Cosmos DB account data. See [DocumentDB Account Contributor](#documentdb-account-contributor) for managing Azure Cosmos DB accounts.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments, can read permissions given to each user |
| Microsoft.DocumentDB/*/read | Read any collection |
| Microsoft.DocumentDB/databaseAccounts/readonlykeys/action | Reads the database account readonly keys. |
| Microsoft.Insights/MetricDefinitions/read | Read metric definitions |
| Microsoft.Insights/Metrics/read | Read metrics |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Data Factory Contributor
Create and manage data factories, as well as child resources within them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.DataFactory/dataFactories/* | Create and manage data factories, and child resources within them. |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Lets you connect, start, restart, and shutdown your virtual machines in your Azure DevTest Labs.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Compute/availabilitySets/read | Get the properties of an availability set |
| Microsoft.Compute/virtualMachines/*/read | Read the properties of a virtual machine (VM sizes, runtime status, VM extensions, etc.) |
| Microsoft.Compute/virtualMachines/deallocate/action | Powers off the virtual machine and releases the compute resources |
| Microsoft.Compute/virtualMachines/read | Get the properties of a virtual machine |
| Microsoft.Compute/virtualMachines/restart/action | Restarts the virtual machine |
| Microsoft.Compute/virtualMachines/start/action | Starts the virtual machine |
| Microsoft.DevTestLab/*/read | Read the properties of a lab |
| Microsoft.DevTestLab/labs/createEnvironment/action | Create virtual machines in a lab. |
| Microsoft.DevTestLab/labs/claimAnyVm/action | Claim a random claimable virtual machine in the lab. |
| Microsoft.DevTestLab/labs/formulas/delete | Delete formulas. |
| Microsoft.DevTestLab/labs/formulas/read | Read formulas. |
| Microsoft.DevTestLab/labs/formulas/write | Add or modify formulas. |
| Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action | Evaluates lab policy. |
| Microsoft.DevTestLab/labs/virtualMachines/claim/action | Take ownership of an existing virtual machine |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule |
| Microsoft.Network/networkInterfaces/*/read | Read the properties of a network interface (for example, all the load balancers that the network interface is a part of) |
| Microsoft.Network/networkInterfaces/join/action | Joins a Virtual Machine to a network interface |
| Microsoft.Network/networkInterfaces/read | Gets a network interface definition.  |
| Microsoft.Network/networkInterfaces/write | Creates a network interface or updates an existing network interface.  |
| Microsoft.Network/publicIPAddresses/*/read | Read the properties of a public IP address |
| Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address |
| Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |
| Microsoft.Resources/deployments/operations/read | Gets or lists deployment operations. |
| Microsoft.Resources/deployments/read | Gets or lists deployments. |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |

| **NotActions** |  |
| --- | --- |
| Microsoft.Compute/virtualMachines/vmSizes/read | Lists available sizes the virtual machine can be updated to |

## DNS Zone Contributor
Lets you manage DNS zones and record sets in Azure DNS, but does not let you control who has access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/dnsZones/* | Create and manage DNS zones and records |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage Support tickets |

## DocumentDB Account Contributor
Can manage Azure Cosmos DB accounts. Azure Cosmos DB is formerly known as DocumentDB.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.DocumentDb/databaseAccounts/* | Create and manage Azure Cosmos DB accounts |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Intelligent Systems Account Contributor
Lets you manage Intelligent Systems accounts, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.IntelligentSystems/accounts/* | Create and manage intelligent systems accounts |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
| Microsoft.Insights/Register/Action | Register the microsoft insights provider |
| Microsoft.Insights/webtests/* | Read/write/delete Application Insights web tests. |
| Microsoft.OperationalInsights/workspaces/intelligencepacks/* | Read/write/delete Log Analytics solution packs. |
| Microsoft.OperationalInsights/workspaces/savedSearches/* | Read/write/delete Log Analytics saved searches. |
| Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
| Microsoft.OperationalInsights/workspaces/sharedKeys/action | Retrieves the shared keys for the workspace. These keys are used to connect Microsoft Operational Insights agents to the workspace. |
| Microsoft.OperationalInsights/workspaces/storageinsightconfigs/* | Read/write/delete Log Analytics storage insight configurations. |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.WorkloadMonitor/workloads/* |  |

## Monitoring Reader
Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](../monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles).

| **Actions** |  |
| --- | --- |
| */read | Read resources of all types, except secrets. |
| Microsoft.OperationalInsights/workspaces/search/action | Executes a search query |
| Microsoft.Support/* | Create and manage support tickets |

## Network Contributor
Lets you manage networks, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/* | Create and manage networks |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Lets you manage Redis caches, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Cache/redis/* | Create and manage Redis caches |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |

## Scheduler Job Collections Contributor
Lets you manage Scheduler job collections, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Scheduler/jobcollections/* | Create and manage job collections |
| Microsoft.Support/* | Create and manage support tickets |

## Search Service Contributor
Lets you manage Search services, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Security/*/read | Read security components and policies |
| Microsoft.Security/locations/alerts/dismiss/action | Dismiss a security alert |
| Microsoft.Security/locations/tasks/dismiss/action | Dismiss a security recommendation |
| Microsoft.Security/policies/write | Updates the security policy |
| Microsoft.Support/* | Create and manage support tickets |

## Security Manager
Lets you manage security components, security policies and virtual machines

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.ClassicCompute/*/read | Read configuration information classic virtual machines |
| Microsoft.ClassicCompute/virtualMachines/*/write | Write configuration for classic virtual machines |
| Microsoft.ClassicNetwork/*/read | Read configuration information about classic network |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Security/*/read | Read security components and policies |

## Site Recovery Contributor
Lets you manage Site Recovery service except vault creation and role assignment

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/certificates/write | The Update Resource Certificate operation updates the resource/vault credential certificate. |
| Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/* | Create and manage registered identities |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/* | Create or Update replication alert settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read | Read Any Events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/* | Create and manage replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationJobs/* | Create and manage replication jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/* | Create and manage replication policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/* | Create and manage recovery plans |
| Microsoft.RecoveryServices/Vaults/storageConfig/* | Create and manage storage configuration of Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Returns token information for Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read |  |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
| Microsoft.Support/* | Create and manage support tickets |

## Site Recovery Operator
Lets you failover and failback but not perform other Site Recovery management operations

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/locations/allocateStamp/action | AllocateStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read Any Alerts Settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read | Read Any Events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/checkConsistency/action | Checks Consistency of the Fabric |
| Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read Any Fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/reassociateGateway/action | Reassociate Gateway |
| Microsoft.RecoveryServices/vaults/replicationFabrics/renewcertificate/action | Renew Certificate for Fabric |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read Any Networks |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationNetworks/replicationNetworkMappings/read | Read Any Network Mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/read | Read Any Protection Containers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectableItems/read | Read Any Protectable Items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply Recovery Point |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Failover Commit |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Planned Failover |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/read | Read Any Protected Items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read Any Replication Recovery Points |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/reProtect/action | ReProtect Protected Item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/testFailover/action | Test Failover |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Test Failover Cleanup |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Failover |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update Mobility Service |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectionContainerMappings/read | Read Any Protection Container Mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationRecoveryServicesProviders/read | Read Any Recovery Services Providers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationRecoveryServicesProviders/refreshProvider/action | Refresh Provider |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/read | Read Any Storage Classifications |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/replicationStorageClassificationMappings/read | Read Any Storage Classification Mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read Any Jobs |
| Microsoft.RecoveryServices/vaults/replicationJobs/* | Create and manage replication jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read Any Policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/failoverCommit/action | Failover Commit Recovery Plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/plannedFailover/action | Planned Failover Recovery Plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read Any Recovery Plans |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/reProtect/action | ReProtect Recovery Plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailover/action | Test Failover Recovery Plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/testFailoverCleanup/action | Test Failover Cleanup Recovery Plan |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/unplannedFailover/action | Failover Recovery Plan |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/* | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read |  |
| Microsoft.RecoveryServices/Vaults/storageConfig/read |  |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Returns token information for Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
| Microsoft.Support/* | Create and manage support tickets |

## Site Recovery Reader
Lets you view Site Recovery status but not perform other management operations

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.RecoveryServices/locations/allocatedStamp/read | GetAllocatedStamp is internal operation used by service |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | The Get Extended Info operation gets an object's Extended Info representing the Azure resource of type ?vault? |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read | Gets the alerts for the Recovery services vault. |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/ notificationConfiguration/read |  |
| Microsoft.RecoveryServices/Vaults/read | The Get Vault operation gets an object representing the Azure resource of type 'vault' |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read |  |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read | The Get Operation Results operation can be used get the operation status and result for the asynchronously submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read | The Get Containers operation can be used get the containers registered for a resource. |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read Any Alerts Settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read | Read Any Events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/read | Read Any Fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read | Read Any Networks |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationNetworks/replicationNetworkMappings/read | Read Any Network Mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/read | Read Any Protection Containers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectableItems/read | Read Any Protectable Items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/read | Read Any Protected Items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Read Any Replication Recovery Points |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationProtectionContainers/replicationProtectionContainerMappings/read | Read Any Protection Container Mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationRecoveryServicesProviders/read | Read Any Recovery Services Providers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/read | Read Any Storage Classifications |
| Microsoft.RecoveryServices/vaults/replicationFabrics/ replicationStorageClassifications/replicationStorageClassificationMappings/read | Read Any Storage Classification Mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read | Read Any Jobs |
| Microsoft.RecoveryServices/vaults/replicationJobs/read | Read Any Jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/read | Read Any Policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read | Read Any Recovery Plans |
| Microsoft.RecoveryServices/Vaults/storageConfig/read |  |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Returns token information for Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/usages/read | Returns usage details for a Recovery Services Vault. |
| Microsoft.RecoveryServices/Vaults/vaultTokens/read | The Vault Token operation can be used to get Vault Token for vault level backend operations. |
| Microsoft.Support/* | Create and manage support tickets |

## SQL DB Contributor
Lets you manage SQL databases, but not access to them. Also, you can't manage their security-related policies or their parent SQL servers.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Sql/locations/*/read |  |
| Microsoft.Sql/servers/databases/* | Create and manage SQL databases |
| Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit audit policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Can't edit audit settings |
| Microsoft.Sql/servers/databases/auditRecords/read | Retrieve the database blob audit records |
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
Lets you manage the security-related policies of SQL servers and databases, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read Microsoft authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Sql/servers/auditingPolicies/* | Create and manage SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* | Create and manage SQL server auditing setting |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Create and manage SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Create and manage SQL server database auditing settings |
| Microsoft.Sql/servers/databases/auditRecords/read | Read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Create and manage SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Create and manage SQL server database data masking policies |
| Microsoft.Sql/servers/databases/read | Return the list of databases or gets the properties for the specified database. |
| Microsoft.Sql/servers/databases/schemas/read | Retrieve list of schemas of a database |
| Microsoft.Sql/servers/databases/schemas/tables/columns/read | Retrieve list of columns of a table |
| Microsoft.Sql/servers/databases/schemas/tables/columns/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/schemas/tables/read | Retrieve list of tables of a database |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Create and manage SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Create and manage SQL server database security metrics |
| Microsoft.Sql/servers/databases/sensitivityLabels/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessments/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentScans/* |  |
| Microsoft.Sql/servers/databases/vulnerabilityAssessmentSettings/* |  |
| Microsoft.Sql/servers/firewallRules/* |  |
| Microsoft.Sql/servers/read | Return the list of servers or gets the properties for the specified server. |
| Microsoft.Sql/servers/securityAlertPolicies/* | Create and manage SQL server security alert policies |
| Microsoft.Support/* | Create and manage support tickets |

## SQL Server Contributor
Lets you manage SQL servers and databases, but not access to them, and not their security -related policies.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Lets you manage storage accounts, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read all authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/diagnosticSettings/* | Manage diagnostic settings |
| Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action | Joins resource such as storage account or SQL database to a subnet. |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

## Storage Account Key Operator Service Role
Storage Account Key Operators are allowed to list and regenerate keys on Storage Accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Storage/storageAccounts/listkeys/action | Returns the access keys for the specified storage account. |
| Microsoft.Storage/storageAccounts/regeneratekey/action | Regenerates the access keys for the specified storage account. |

## Support Request Contributor
Lets you create and manage Support requests

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
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
Lets you manage user access to Azure resources.

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
Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they're connected to.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Compute/availabilitySets/* | Create and manage compute availability sets |
| Microsoft.Compute/locations/* | Create and manage compute locations |
| Microsoft.Compute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.Compute/virtualMachineScaleSets/* | Create and manage virtual machine scale sets |
| Microsoft.DevTestLab/schedules/* |  |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Network/applicationGateways/backendAddressPools/join/action | Joins an application gateway backend address pool |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Joins a load balancer backend address pool |
| Microsoft.Network/loadBalancers/inboundNatPools/join/action | Joins a load balancer inbound nat pool |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Joins a load balancer inbound nat rule |
| Microsoft.Network/loadBalancers/probes/join/action | Allows using probes of a load balancer. For example, with this permission healthProbe property of VM scale set can reference the probe. |
| Microsoft.Network/loadBalancers/read | Gets a load balancer definition |
| Microsoft.Network/locations/* | Create and manage network locations |
| Microsoft.Network/networkInterfaces/* | Create and manage network interfaces |
| Microsoft.Network/networkSecurityGroups/join/action | Joins a network security group |
| Microsoft.Network/networkSecurityGroups/read | Gets a network security group definition |
| Microsoft.Network/publicIPAddresses/join/action | Joins a public ip address |
| Microsoft.Network/publicIPAddresses/read | Gets a public ip address definition. |
| Microsoft.Network/virtualNetworks/read | Get the virtual network definition |
| Microsoft.Network/virtualNetworks/subnets/join/action | Joins a virtual network |
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
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Storage/storageAccounts/listKeys/action | Returns the access keys for the specified storage account. |
| Microsoft.Storage/storageAccounts/read | Returns the list of storage accounts or gets the properties for the specified storage account. |
| Microsoft.Support/* | Create and manage support tickets |

## Virtual Machine User Login
Users with this role have the ability to login to a virtual machine as a regular user.

| **Actions** |  |
| --- | --- |
| Microsoft.Compute/virtualMachines/login/action |  |
| Microsoft.Compute/virtualMachine/logon/action |  |

## Web Plan Contributor
Lets you manage the web plans for websites, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/serverFarms/* | Create and manage server farms |

## Website Contributor
Lets you manage websites (not web plans), but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.ResourceHealth/availabilityStatuses/read | Gets the availability statuses for all resources in the specified scope |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Gets or lists resource groups. |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/certificates/* | Create and manage website certificates |
| Microsoft.Web/listSitesAssignedToHostName/read | Get names of sites assigned to hostname. |
| Microsoft.Web/serverFarms/join/action |  |
| Microsoft.Web/serverFarms/read | Get the properties on an App Service Plan |
| Microsoft.Web/sites/* | Create and manage websites (site creation also requires write permissions to the associated App Service Plan) |

## See also
* [Role-Based Access Control](role-assignments-portal.md): Get started with RBAC in the Azure portal.
* [Custom roles in Azure RBAC](custom-roles.md): Learn how to create custom roles to fit your access needs.
* [Create an access change history report](change-history-report.md): Keep track of changing role assignments in RBAC.
* [Role-Based Access Control troubleshooting](troubleshooting.md): Get suggestions for fixing common issues.
* [Permissions in Azure Security Center](../security-center/security-center-permissions.md)
