---
title: Actions and NotActions - Azure role-based access control (RBAC) | Microsoft Docs
description: This topic describes the built in roles for role-based access control (RBAC). The roles are continuously added, so check the documentation freshness.
services: active-directory
documentationcenter: ''
author: curtand
manager: femila
editor: ''

ms.assetid: b547c5a5-2da2-4372-9938-481cb962d2d6
ms.service: active-directory
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 06/28/2017
ms.author: curtand
ms.reviewer:

ms.custom: H1Hack27Feb2017
---
# Built-in roles for Azure role-based access control
Azure Role-Based Access Control (RBAC) comes with the following built-in roles that can be assigned to users, groups, and services. You can’t modify the definitions of built-in roles. However, you can create [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md) to fit the specific needs of your organization.

## Roles in Azure
The following table provides brief descriptions of the built-in roles. Click the role name to see the detailed list of **actions** and **notactions** for the role. The **actions** property specifies the allowed actions on Azure resources. Action strings can use wildcard characters. The **notactions** property specifies the actions that are excluded from the allowed actions.

The action defines what type of operations you can perform on a given resource type. For example:
- **Write** enables you to perform PUT, POST, PATCH, and DELETE operations.
- **Read** enables you to perform GET operations.

This article only addresses the different roles that exist today. When you assign a role to a user, though, you can limit the allowed actions further by defining a scope. This is helpful if you want to make someone a Website Contributor, but only for one resource group.

> [!NOTE]
> The Azure role definitions are constantly evolving. This article is kept as up to date as possible, but you can always find the latest roles definitions in Azure PowerShell. Use the [Get-AzureRmRoleDefinition](/powershell/module/azurerm.resources/get-azurermroledefinition) cmdlet to list all current roles. You can dive in to a specific role using `(get-azurermroledefinition "<role name>").actions` or `(get-azurermroledefinition "<role name>").notactions` as applicable. Use [Get-AzureRmProviderOperation](/powershell/module/azurerm.resources/get-azurermprovideroperation) to list operations of specific Azure resource providers.


| Role name | Description |
| --- | --- |
| [API Management Service Contributor](#api-management-service-contributor) |Can manage API Management service and the APIs |
| [API Management Service Operator Role](#api-management-service-operator-role) | Can manage API Management service, but not the APIs themselves |
| [API Management Service Reader Role](#api-management-service-reader-role) | Read-only access to API Management service and APIs |
| [Application Insights Component Contributor](#application-insights-component-contributor) |Can manage Application Insights components |
| [Automation Operator](#automation-operator) |Able to start, stop, suspend, and resume jobs |
| [Backup Contributor](#backup-contributor) | Can manage backup in Recovery Services vault |
| [Backup Operator](#backup-operator) | Can manage backup except removing backup, in Recovery Services vault |
| [Backup Reader](#backup-reader) | Can view all backup management services  |
| [Billing Reader](#billing-reader) | Can view all billing information  |
| [BizTalk Contributor](#biztalk-contributor) |Can manage BizTalk services |
| [ClearDB MySQL DB Contributor](#cleardb-mysql-db-contributor) |Can manage ClearDB MySQL databases |
| [Contributor](#contributor) |Can manage everything except access. |
| [Data Factory Contributor](#data-factory-contributor) |Can create and manage data factories, and child resources within them. |
| [DevTest Labs User](#devtest-labs-user) |Can view everything and connect, start, restart, and shutdown virtual machines |
| [DNS Zone Contributor](#dns-zone-contributor) |Can manage DNS zones and records |
| [Azure Cosmos DB Account Contributor](#documentdb-account-contributor) |Can manage Azure Cosmos DB accounts |
| [Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) |Can manage Intelligent Systems accounts |
| Logic App Contributor | Can manage all aspects of a Logic App, but not create a new one. |
| Logic App Operator |Can start and stop workflows defined within a Logic App. |
| [Monitoring Reader](#monitoring-reader) |Can read all monitoring data |
| [Monitoring Contributor](#monitoring-contributor) |Can read monitoring data and edit monitoring settings |
| [Network Contributor](#network-contributor) |Can manage all network resources |
| [New Relic APM Account Contributor](#new-relic-apm-account-contributor) |Can manage New Relic Application Performance Management accounts and applications |
| [Owner](#owner) |Can manage everything, including access |
| [Reader](#reader) |Can view everything, but can't make changes |
| [Redis Cache Contributor](#redis-cache-contributor) |Can manage Redis caches |
| [Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) |Can manage scheduler job collections |
| [Search Service Contributor](#search-service-contributor) |Can manage search services |
| [Security Manager](#security-manager) |Can manage security components, security policies, and virtual machines |
| [Site Recovery Contributor](#site-recovery-contributor) | Can manage Site Recovery in Recovery Services vault |
| [Site Recovery Operator](#site-recovery-operator) | Can manage failover and failback operations Site Recovery in Recovery Services vault |
| [Site Recovery Reader](#site-recovery-reader) | Can view all Site Recovery management operations  |
| [SQL DB Contributor](#sql-db-contributor) |Can manage SQL databases, but not their security-related policies |
| [SQL Security Manager](#sql-security-manager) |Can manage the security-related policies of SQL servers and databases |
| [SQL Server Contributor](#sql-server-contributor) |Can manage SQL servers and databases, but not their security-related policies |
| [Classic Storage Account Contributor](#classic-storage-account-contributor) |Can manage classic storage accounts |
| [Storage Account Contributor](#storage-account-contributor) |Can manage storage accounts |
| [Support Request Contributor](#support-request-contributor) | Can create and manage support requests |
| [User Access Administrator](#user-access-administrator) |Can manage user access to Azure resources |
| [Classic Virtual Machine Contributor](#classic-virtual-machine-contributor) |Can manage classic virtual machines, but not the virtual network or storage account to which they are connected |
| [Virtual Machine Contributor](#virtual-machine-contributor) |Can manage virtual machines, but not the virtual network or storage account to which they are connected |
| [Classic Network Contributor](#classic-network-contributor) |Can manage classic virtual networks and reserved IPs |
| [Web Plan Contributor](#web-plan-contributor) |Can manage web plans |
| [Website Contributor](#website-contributor) |Can manage websites, but not the web plans to which they are connected |

## Role permissions
The following tables describe the specific permissions given to each role. This can include **Actions**, which give permissions, and **NotActions**, which restrict them.

### API Management Service Contributor
Can manage API Management services

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/Service/* |Create and manage API Management service |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read roles and role assignments |
| Microsoft.Support/* |Create and manage support tickets |

### API Management Service Operator Role
Can manage API Management services

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/Service/*/read | Read API Management Service instances |
| Microsoft.ApiManagement/Service/backup/action | Back up API Management Service to the specified container in a user provided storage account |
| Microsoft.ApiManagement/Service/delete | Delete an API Management Service instance |
| Microsoft.ApiManagement/Service/managedeployments/action | Change SKU/units; add or remove regional deployments of API Management Service |
| Microsoft.ApiManagement/Service/read | Read metadata for an API Management Service instance |
| Microsoft.ApiManagement/Service/restore/action | Restore API Management Service from the specified container in a user provided storage account |
| Microsoft.ApiManagement/Service/updatehostname/action | Set up, update, or remove custom domain names for an API Management Service |
| Microsoft.ApiManagement/Service/write | Create a new instance of API Management Service |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read roles and role assignments |
| Microsoft.Support/* |Create and manage support tickets |

### API Management Service Reader Role
Can manage API Management services

| **Actions** |  |
| --- | --- |
| Microsoft.ApiManagement/Service/*/read | Read API Management Service instances |
| Microsoft.ApiManagement/Service/read | Read metadata for an API Management Service instance |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read roles and role assignments |
| Microsoft.Support/* |Create and manage support tickets |

### Application Insights Component Contributor
Can manage Application Insights components

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.Insights/components/* |Create and manage Insights components |
| Microsoft.Insights/webtests/* |Create and manage web tests |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Automation Operator
Able to start, stop, suspend, and resume jobs

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role assignments |
| Microsoft.Automation/automationAccounts/jobs/read |Read automation account jobs |
| Microsoft.Automation/automationAccounts/jobs/resume/action |Resume an automation account job |
| Microsoft.Automation/automationAccounts/jobs/stop/action |Stop an automation account job |
| Microsoft.Automation/automationAccounts/jobs/streams/read |Read automation account job streams |
| Microsoft.Automation/automationAccounts/jobs/suspend/action |Suspend an automation account job |
| Microsoft.Automation/automationAccounts/jobs/write |Write automation account jobs |
| Microsoft.Automation/automationAccounts/jobSchedules/read |Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/jobSchedules/write |Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/read |Read automation accounts |
| Microsoft.Automation/automationAccounts/runbooks/read |Read automation runbooks |
| Microsoft.Automation/automationAccounts/schedules/read |Read automation account schedules |
| Microsoft.Automation/automationAccounts/schedules/write |Write automation account schedules |
| Microsoft.Insights/components/* |Create and manage Insights components |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Backup Contributor
Can manage all backup management actions, except creating Recovery Services vault and giving access to others

| **Actions** | |
| --- | --- |
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
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* |Create and manage support tickets |

### Backup Operator
Can manage all backup management actions except creating vaults, removing backup and giving access to others

| **Actions** | |
| --- | --- |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read | Read results of operation on backup management |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read | Read operation results on protection containers |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/backup/action | Perform on-demand backup operation on a backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read | Read result of operation performed on backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationStatus/read | Read status of operation performed on backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/read | Read recovery point of a backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/recoveryPoints/restore/action | Perform a restore operation using a recovery point of a backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/write | Create a backup item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read | Read containers holding backup item |
| Microsoft.RecoveryServices/Vaults/backupJobs/* | Create and manage backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export backup jobs into an excel |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read | Read meta data related to backup management |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/* | Create and manage Results of backup management operations |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read | Read results of operations performed on backup policies |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read | Read backup policies |
| Microsoft.RecoveryServices/Vaults/backupProtectableItems/* | Create and manage items which can be backed up |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/read | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read | Read backed up containers holding backup items |
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
| Microsoft.Support/* | Create and manage support tickets |

### Backup Reader
Can monitor backup management in Recovery Services vault

| **Actions** | |
| --- | --- |
| Microsoft.RecoveryServices/Vaults/backupFabrics/operationResults/read  | Read results of operation on backup management |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/operationResults/read  | Read operation results on protection containers |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationResults/read  | Read result of operation performed on backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/operationStatus/read  | Read status of operation performed on backed up item |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/protectedItems/read  | Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupFabrics/protectionContainers/read  | Read containers holding backup item |
| Microsoft.RecoveryServices/Vaults/backupJobs/operationResults/read  | Read results of backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobs/read  | Read backup jobs |
| Microsoft.RecoveryServices/Vaults/backupJobsExport/action | Export backup jobs into an excel |
| Microsoft.RecoveryServices/Vaults/backupManagementMetaData/read  | Read meta data related to backup management |
| Microsoft.RecoveryServices/Vaults/backupOperationResults/read  | Read backup management operation results |
| Microsoft.RecoveryServices/Vaults/backupPolicies/operationResults/read  | Read results of operations performed on backup policies |
| Microsoft.RecoveryServices/Vaults/backupPolicies/read  | Read backup policies |
| Microsoft.RecoveryServices/Vaults/backupProtectedItems/read  |  Read backed up items |
| Microsoft.RecoveryServices/Vaults/backupProtectionContainers/read  | Read backed up containers holding backup items |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read  | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/read  | Read recovery services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read  | Read result of discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read  | Read results of operation performed on Registered items of the vault |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read  | Read registered items of the vault |
| Microsoft.RecoveryServices/Vaults/usages/read  |  Read usage of the Recovery Services vault |

### Billing Reader
Can view all Billing information

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role assignments |
| Microsoft.Billing/*/read |Read Billing information |
| Microsoft.Support/* |Create and manage support tickets |

### BizTalk Contributor
Can manage BizTalk services

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role assignments |
| Microsoft.BizTalkServices/BizTalk/* |Create and manage BizTalk services |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### ClearDB MySQL DB Contributor
Can manage ClearDB MySQL databases

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |
| successbricks.cleardb/databases/* |Create and manage ClearDB MySQL databases |

### Contributor
Can manage everything except access

| **Actions** |  |
| --- | --- |
| * |Create and manage resources of all types |

| **NotActions** |  |
| --- | --- |
| Microsoft.Authorization/*/Delete |Can’t delete roles and role assignments |
| Microsoft.Authorization/*/Write |Can’t create roles and role assignments |

### Data Factory Contributor
Create and manage data factories, and child resources within them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.DataFactory/dataFactories/* |Create and manage data factories, and child resources within them. |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### DevTest Labs User
Can view everything and connect, start, restart, and shutdown virtual machines

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Compute/availabilitySets/read |Read the properties of availability sets |
| Microsoft.Compute/virtualMachines/*/read |Read the properties of a virtual machine (VM sizes, runtime status, VM extensions, etc.) |
| Microsoft.Compute/virtualMachines/deallocate/action |Deallocate virtual machines |
| Microsoft.Compute/virtualMachines/read |Read the properties of a virtual machine |
| Microsoft.Compute/virtualMachines/restart/action |Restart virtual machines |
| Microsoft.Compute/virtualMachines/start/action |Start virtual machines |
| Microsoft.DevTestLab/*/read |Read the properties of a lab |
| Microsoft.DevTestLab/labs/createEnvironment/action |Create a lab environment |
| Microsoft.DevTestLab/labs/formulas/delete |Delete formulas |
| Microsoft.DevTestLab/labs/formulas/read |Read formulas |
| Microsoft.DevTestLab/labs/formulas/write |Add or modify formulas |
| Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action |Evaluate lab policies |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action |Join a load balancer backend address pool |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action |Join a load balancer inbound NAT rule |
| Microsoft.Network/networkInterfaces/*/read |Read the properties of a network interface (for example, all the load balancers that the network interface is a part of) |
| Microsoft.Network/networkInterfaces/join/action |Join a Virtual Machine to a network interface |
| Microsoft.Network/networkInterfaces/read |Read network interfaces |
| Microsoft.Network/networkInterfaces/write |Write network interfaces |
| Microsoft.Network/publicIPAddresses/*/read |Read the properties of a public IP address |
| Microsoft.Network/publicIPAddresses/join/action |Join a public IP address |
| Microsoft.Network/publicIPAddresses/read |Read network public IP addresses |
| Microsoft.Network/virtualNetworks/subnets/join/action |Join a virtual network |
| Microsoft.Resources/deployments/operations/read |Read deployment operations |
| Microsoft.Resources/deployments/read |Read deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Storage/storageAccounts/listKeys/action |List storage account keys |

### DNS Zone Contributor
Can manage DNS zones and records.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/\*/read |Read roles and role assignments |
| Microsoft.Insights/alertRules/\* |Create and manage alert rules |
| Microsoft.Network/dnsZones/\* |Create and manage DNS zones and records |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read the health of the resources |
| Microsoft.Resources/deployments/\* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/\* |Create and manage Support tickets |

### Azure Cosmos DB Account Contributor
Can manage Azure Cosmos DB accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.DocumentDb/databaseAccounts/* |Create and manage DocumentDB accounts |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Intelligent Systems Account Contributor
Can manage Intelligent Systems accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.IntelligentSystems/accounts/* |Create and manage intelligent systems accounts |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Monitoring Reader
Can read all monitoring data (metrics, logs, etc.). See also [Get started with roles, permissions, and security with Azure Monitor](/monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles).

| **Actions** |  |
| --- | --- |
| */read |Read resources of all types, except secrets. |
| Microsoft.OperationalInsights/workspaces/search/action |Search Log Analytics data |
| Microsoft.Support/* |Create and manage support tickets |

### Monitoring Contributor
Can read all monitoring data and edit monitoring settings. See also [Get started with roles, permissions, and security with Azure Monitor](/monitoring-and-diagnostics/monitoring-roles-permissions-security.md#built-in-monitoring-roles).

| **Actions** |  |
| --- | --- |
| */read |Read resources of all types, except secrets. |
| Microsoft.Insights/AlertRules/* |Read/write/delete alert rules. |
| Microsoft.Insights/components/* |Read/write/delete Application Insights components. |
| Microsoft.Insights/DiagnosticSettings/* |Read/write/delete diagnostic settings. |
| Microsoft.Insights/eventtypes/* |List Activity Log events (management events) in a subscription. This permission is applicable to both programmatic and portal access to the Activity Log. |
| Microsoft.Insights/LogDefinitions/* |This permission is necessary for users who need access to Activity Logs via the portal. List log categories in Activity Log. |
| Microsoft.Insights/MetricDefinitions/* |Read metric definitions (list of available metric types for a resource). |
| Microsoft.Insights/Metrics/* |Read metrics for a resource. |
| Microsoft.Insights/Register/Action |Register the Microsoft.Insights provider. |
| Microsoft.Insights/webtests/* |Read/write/delete Application Insights web tests. |
| Microsoft.OperationalInsights/workspaces/intelligencepacks/* |Read/write/delete Log Analytics solution packs. |
| Microsoft.OperationalInsights/workspaces/savedSearches/* |Read/write/delete Log Analytics saved searches. |
| Microsoft.OperationalInsights/workspaces/search/action |Search Log Analytics workspaces. |
| Microsoft.OperationalInsights/workspaces/sharedKeys/action |List keys for a Log Analytics workspace. |
| Microsoft.OperationalInsights/workspaces/storageinsightconfigs/* |Read/write/delete Log Analytics storage insight configurations. |

### Network Contributor
Can manage all network resources

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.Network/* |Create and manage networks |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### New Relic APM Account Contributor
Can manage New Relic Application Performance Management accounts and applications

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |
| NewRelic.APM/accounts/* |Create and manage New Relic application performance management accounts |

### Owner
Can manage everything, including access

| **Actions** |  |
| --- | --- |
| * |Create and manage resources of all types |

### Reader
Can view everything, but can't make changes

| **Actions** |  |
| --- | --- |
| */read |Read resources of all types, except secrets. |

### Redis Cache Contributor
Can manage Redis caches

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Cache/redis/* |Create and manage Redis caches |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Scheduler Job Collections Contributor
Can manage Scheduler job collections

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Scheduler/jobcollections/* |Create and manage job collections |
| Microsoft.Support/* |Create and manage support tickets |

### Search Service Contributor
Can manage Search services

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Search/searchServices/* |Create and manage search services |
| Microsoft.Support/* |Create and manage support tickets |

### Security Manager
Can manage security components, security policies, and virtual machines

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.ClassicCompute/*/read |Read configuration information classic compute virtual machines |
| Microsoft.ClassicCompute/virtualMachines/*/write |Write configuration for virtual machines |
| Microsoft.ClassicNetwork/*/read |Read configuration information about classic network |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Security/* |Create and manage security components and policies |
| Microsoft.Support/* |Create and manage support tickets |

### Site Recovery Contributor
Can manage all Site Recovery management actions, except creating Recovery Services vault and assigning access rights to other users

| **Actions** | |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/Vaults/certificates/write | Updates the vault credential certificate |
| Microsoft.RecoveryServices/Vaults/extendedInformation/* | Create and manage extended info related to vault |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/*  | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read  | Read Recovery services vault notification configuration |
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
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* |Create and manage support tickets |

### Site Recovery Operator
Can Failover and Failback but can not perform other Site Recovery management actions or assign access to other users

| **Actions** | |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/*  | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read  | Read Recovery services vault notification configuration |
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
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read | Read replication fabric network mapping |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read | Read protection containers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read | Get list of all protectable items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/applyRecoveryPoint/action | Apply a specific recovery point |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/failoverCommit/action | Commit failover for a failed over item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/plannedFailover/action | Start planned failover for a protected item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read | Get list of all protected items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read | Get list of available recovery points |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/repairReplication/action | Repair replication for a protected item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/reProtect/action | Start re-protect for a protected item|
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailover/action | Start test failover of a protected item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/testFailoverCleanup/action | Start cleanup of a test failover |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/unplannedFailover/action | Start unplanned failover of a protected item |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/updateMobilityService/action | Update the mobility service |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read | Read protection container mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read | Read Recovery Services providers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/refreshProvider/action | Refresh Recovery Services provider |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read | Read storage classifications for replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read | Read storage classification mappings |
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
| Microsoft.RecoveryServices/Vaults/storageConfig/read | Read storage configuration of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read | Read Recovery Services vault token information |
| Microsoft.RecoveryServices/Vaults/usages/read | Read usage details of a Recovery Services vault |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

### Site Recovery Reader
Can monitor Site Recovery status in Recovery Services vault and raise Support tickets

| **Actions** | |
| --- | --- |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.RecoveryServices/Vaults/extendedInformation/read  | Read extended info related to vault |
| Microsoft.RecoveryServices/Vaults/monitoringAlerts/read  | Read alerts for the Recovery services vault |
| Microsoft.RecoveryServices/Vaults/monitoringConfigurations/notificationConfiguration/read  | Read Recovery services vault notification configuration |
| Microsoft.RecoveryServices/Vaults/read  | Read Recovery Services vaults |
| Microsoft.RecoveryServices/Vaults/refreshContainers/read  | Manage discovery operation for fetching newly created containers |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/operationResults/read  | Read operation status and result for a submitted operation |
| Microsoft.RecoveryServices/Vaults/registeredIdentities/read  | Read containers registered for a resource |
| Microsoft.RecoveryServices/vaults/replicationAlertSettings/read | Read replication alert settings |
| Microsoft.RecoveryServices/vaults/replicationEvents/read  | Read replication events |
| Microsoft.RecoveryServices/vaults/replicationFabrics/read  | Read replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/read  | Read replication fabric networks |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationNetworks/replicationNetworkMappings/read  | Read replication fabric network mapping |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/read  |  Read protection containers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectableItems/read  | Get list of all protectable items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/read  | Get list of all protected items |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectedItems/recoveryPoints/read  | Get list of available recovery points |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationProtectionContainers/replicationProtectionContainerMappings/read  | Read protection container mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationRecoveryServicesProviders/read  | Read Recovery Services providers |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/read  | Read storage classifications for replication fabrics |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationStorageClassifications/replicationStorageClassificationMappings/read  |  Read storage classification mappings |
| Microsoft.RecoveryServices/vaults/replicationFabrics/replicationvCenters/read  |  Read registered vCenter information |
| Microsoft.RecoveryServices/vaults/replicationJobs/read  |  Read status of replication jobs |
| Microsoft.RecoveryServices/vaults/replicationPolicies/read  |  Read replication policies |
| Microsoft.RecoveryServices/vaults/replicationRecoveryPlans/read  |  Read recovery plans |
| Microsoft.RecoveryServices/Vaults/storageConfig/read  |  Read storage configuration of a Recovery Services vault |
| Microsoft.RecoveryServices/Vaults/tokenInfo/read  |  Read Recovery Services vault token information |
| Microsoft.RecoveryServices/Vaults/usages/read  |  Read usage details of a Recovery Services vault |
| Microsoft.Support/*  |  Create and manage support tickets |

### SQL DB Contributor
Can manage SQL databases but not their security-related policies

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read roles and role Assignments |
| Microsoft.Insights/alertRules/* |Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Sql/servers/databases/* |Create and manage SQL databases |
| Microsoft.Sql/servers/read |Read SQL Servers |
| Microsoft.Support/* |Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.Sql/servers/databases/auditingPolicies/* |Can't edit audit policies |
| Microsoft.Sql/servers/databases/auditingSettings/* |Can't edit audit settings |
| Microsoft.Sql/servers/databases/auditRecords/read |Can't read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* |Can't edit connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* |Can't edit data masking policies |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* |Can't edit security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* |Can't edit security metrics |

### SQL Security Manager
Can manage the security-related policies of SQL servers and databases

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read Microsoft authorization |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Sql/servers/auditingPolicies/* |Create and manage SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* |Create and manage SQL server auditing setting |
| Microsoft.Sql/servers/databases/auditingPolicies/* |Create and manage SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* |Create and manage SQL server database auditing settings |
| Microsoft.Sql/servers/databases/auditRecords/read |Read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* |Create and manage SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* |Create and manage SQL server database data masking policies |
| Microsoft.Sql/servers/databases/read |Read SQL databases |
| Microsoft.Sql/servers/databases/schemas/read |Read SQL server database schemas |
| Microsoft.Sql/servers/databases/schemas/tables/columns/read |Read SQL server database table columns |
| Microsoft.Sql/servers/databases/schemas/tables/read |Read SQL server database tables |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* |Create and manage SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* |Create and manage SQL server database security metrics |
| Microsoft.Sql/servers/read |Read SQL Servers |
| Microsoft.Sql/servers/securityAlertPolicies/* |Create and manage SQL server security alert policies |
| Microsoft.Support/* |Create and manage support tickets |

### SQL Server Contributor
Can manage SQL servers and databases but not their security-related policies

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Sql/servers/* |Create and manage SQL servers |
| Microsoft.Support/* |Create and manage support tickets |

| **NotActions** |  |
| --- | --- |
| Microsoft.Sql/servers/auditingPolicies/* |Can't edit SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* |Can't edit SQL server auditing settings |
| Microsoft.Sql/servers/databases/auditingPolicies/* |Can't edit SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* |Can't edit SQL server database auditing settings |
| Microsoft.Sql/servers/databases/auditRecords/read |Can't read audit records |
| Microsoft.Sql/servers/databases/connectionPolicies/* |Can't edit SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* |Can't edit SQL server database data masking policies |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* |Can't edit SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* |Can't edit SQL server database security metrics |
| Microsoft.Sql/servers/securityAlertPolicies/* |Can't edit SQL server security alert policies |

### Classic Storage Account Contributor
Can manage classic storage accounts

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.ClassicStorage/storageAccounts/* |Create and manage storage accounts |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Storage Account Contributor
Can manage storage accounts, but not access to them.

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read all authorization |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.Insights/diagnosticSettings/* |Manage diagnostic settings |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Storage/storageAccounts/* |Create and manage storage accounts |
| Microsoft.Support/* |Create and manage support tickets |

### Support Request Contributor
Can create and manage support tickets at the subscription scope

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |

### User Access Administrator
Can manage user access to Azure resources

| **Actions** |  |
| --- | --- |
| */read |Read resources of all Types, except secrets. |
| Microsoft.Authorization/* |Manage authorization |
| Microsoft.Support/* |Create and manage support tickets |

### Classic Virtual Machine Contributor
Can manage classic virtual machines but not the virtual network or storage account to which they are connected

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.ClassicCompute/domainNames/* |Create and manage classic compute domain names |
| Microsoft.ClassicCompute/virtualMachines/* |Create and manage virtual machines |
| Microsoft.ClassicNetwork/networkSecurityGroups/join/action |Join network security groups |
| Microsoft.ClassicNetwork/reservedIps/link/action |Link reserved IPs |
| Microsoft.ClassicNetwork/reservedIps/read |Read reserved IP addresses |
| Microsoft.ClassicNetwork/virtualNetworks/join/action |Join virtual networks |
| Microsoft.ClassicNetwork/virtualNetworks/read |Read virtual networks |
| Microsoft.ClassicStorage/storageAccounts/disks/read |Read storage account disks |
| Microsoft.ClassicStorage/storageAccounts/images/read |Read storage account images |
| Microsoft.ClassicStorage/storageAccounts/listKeys/action |List storage account keys |
| Microsoft.ClassicStorage/storageAccounts/read |Read classic storage accounts |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Virtual Machine Contributor
Can manage virtual machines but not the virtual network or storage account to which they are connected

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Compute/availabilitySets/* |Create and manage compute availability sets |
| Microsoft.Compute/locations/* |Create and manage compute locations |
| Microsoft.Compute/virtualMachines/* |Create and manage virtual machines |
| Microsoft.Compute/virtualMachineScaleSets/* |Create and manage virtual machine scale sets |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.Network/applicationGateways/backendAddressPools/join/action |Join network application gateway backend address pools |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action |Join load balancer backend address pools |
| Microsoft.Network/loadBalancers/inboundNatPools/join/action |Join load balancer inbound NAT pools |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action |Join load balancer inbound NAT rules |
| Microsoft.Network/loadBalancers/read |Read load balancers |
| Microsoft.Network/locations/* |Create and manage network locations |
| Microsoft.Network/networkInterfaces/* |Create and manage network interfaces |
| Microsoft.Network/networkSecurityGroups/join/action |Join network security groups |
| Microsoft.Network/networkSecurityGroups/read |Read network security groups |
| Microsoft.Network/publicIPAddresses/join/action |Join network public IP addresses |
| Microsoft.Network/publicIPAddresses/read |Read network public IP addresses |
| Microsoft.Network/virtualNetworks/read |Read virtual networks |
| Microsoft.Network/virtualNetworks/subnets/join/action |Join virtual network subnets |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Storage/storageAccounts/listKeys/action |List storage account keys |
| Microsoft.Storage/storageAccounts/read |Read storage accounts |
| Microsoft.Support/* |Create and manage support tickets |

### Classic Network Contributor
Can manage classic virtual networks and reserved IPs

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.ClassicNetwork/* |Create and manage classic networks |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |

### Web Plan Contributor
Can manage web plans

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |
| Microsoft.Web/serverFarms/* |Create and manage server farms |

### Website Contributor
Can manage websites but not the web plans to which they are connected

| **Actions** |  |
| --- | --- |
| Microsoft.Authorization/*/read |Read authorization |
| Microsoft.Insights/alertRules/* |Create and manage Insights alert rules |
| Microsoft.Insights/components/* |Create and manage Insights components |
| Microsoft.ResourceHealth/availabilityStatuses/read |Read health of the resources |
| Microsoft.Resources/deployments/* |Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read |Read resource groups |
| Microsoft.Support/* |Create and manage support tickets |
| Microsoft.Web/certificates/* |Create and manage website certificates |
| Microsoft.Web/listSitesAssignedToHostName/read |Read sites assigned to a host name |
| Microsoft.Web/serverFarms/join/action |Join server farms |
| Microsoft.Web/serverFarms/read |Read server farms |
| Microsoft.Web/sites/* |Create and manage websites (site creation also requires write permissions to the associated App Service Plan) |

## See also
* [Role-Based Access Control](role-based-access-control-configure.md): Get started with RBAC in the Azure portal.
* [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md): Learn how to create custom roles to fit your access needs.
* [Create an access change history report](role-based-access-control-access-change-history-report.md): Keep track of changing role assignments in RBAC.
* [Role-Based Access Control troubleshooting](role-based-access-control-troubleshooting.md): Get suggestions for fixing common issues.
