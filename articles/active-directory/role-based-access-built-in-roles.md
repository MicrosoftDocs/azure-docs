<properties
	pageTitle="RBAC: Built-in Roles | Microsoft Azure"
	description="This topic describes the built in roles for role-based access control (RBAC)."
	services="active-directory"
	documentationCenter=""
	authors="kgremban"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="05/20/2016"
	ms.author="kgremban"/>

#RBAC: Built-in roles

Azure Role-Based Access Control (RBAC) comes with the following built-in roles that can be assigned to users, groups, and services. You can’t modify the definitions of built-in roles. However, you can create [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md) to fit the specific needs of your organization.

## Roles in Azure

The table below provides brief descriptions of the built-in roles. Click the role name to see the detailed list of **actions** and **notactions** for the role. The **actions** property specifies the allowed actions on Azure resources. Action strings can use wildcard characters. The **notactions** property specifies the actions that are excluded from the allowed actions.

>[AZURE.NOTE] The Azure role definitions are constantly evolving. This article is kept as up to date as possible, but you can always find the latest roles definitions in Azure PowerShell. Use the cmdlets `(get-azurermroledefinition "<role name>").actions` or `(get-azurermroledefinition "<role name>").notactions` as applicable.

| Role name | Description |
| --------- | ----------- |
| [API Management Service Contributor](#api-management-service-contributor) | Can manage API Management services |
| [Application Insights Component Contributor](#application-insights-component-contributor) | Can manage Application Insights components |
| [Automation Operator](#automation-operator) | Able to start, stop, suspend, and resume jobs |
| [BizTalk Contributor](#biztalk-contributor) | Can manage BizTalk services |
| [ClearDB MySQL DB Contributor](#cleardb-mysql-db-contributor) | Can manage ClearDB MySQL databases |
| [Contributor](#contributor) | Can manage everything except access. |
| [Data Factory Contributor](#data-factory-contributor) | Can manage data factories |
| [DevTest Labs User](#devtest-labs-user) | Can view everything and connect, start, restart, and shutdown virtual machines |
| [DocumentDB Account Contributor](#documentdb-account-contributor) | Can manage DocumentDB accounts |
| [Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) | Can manage Intelligent Systems accounts |
| [Network Contributor](#network-contributor) | Can manage all network resources |
| [New Relic APM Account Contributor](#new-relic-apm-account-contributor) | Can manage New Relic Application Performance Management accounts and applications |
| [Owner](#owner) | Can manage everything, including access |
| [Reader](#reader) | Can view everything, but can't make changes |
| [Redis Cache Contributor](#redis-cache-contributor]) | Can manage Redis caches |
| [Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) | Can manage scheduler job collections |
| [Search Service Contributor](#search-service-contributor) | Can manage search services |
| [Security Manager](#security-manager) | Can manage security components, security policies, and virtual machines |
| [SQL DB Contributor](#sql-db-contributor) | Can manage SQL databases, but not their security related policies |
| [SQL Security Manager](#sql-security-manager) | Can manage the security related policies of SQL servers and databases |
| [SQL Server Contributor](#sql-server-contributor) | Can manage SQL servers and databases, but not their security-related policies |
| [Classic Storage Account Contributor](#classic-storage-account-contributor) | Can manage classic storage accounts |
| [Storage Account Contributor](#storage-account-contributor) | Can manage storage accounts |
| [User Access Administrator](#user-access-administrator) | Can manage user access to Azure resources |
| [Classic Virtual Machine Contributor](#classic-virtual-machine-contributor) | Can manage classic virtual machines, but not the virtual network or storage account to which they are connected |
| [Virtual Machine Contributor](#virtual-machine-contributor) | Can manage virtual machines, but not the virtual network or storage account to which they are connected |
| [Classic Network Contributor](#classic-network-contributor) | Can manage classic virtual networks and reserved IPs |
| [Web Plan Contributor](#web-plan-contributor) | Can manage web plans |
| [Website Contributor](#website-contributor) | Can manage websites, but not the web plans to which they are connected |

## Role permissions
The following tables describe the specific permissions given to each role. This can include **Actions** which give permissions and **NotActions** which restrict them.

### API Management Service Contributor
Can manage API Management services

| **Actions** | |
| ------- | ------ |
| Microsoft.ApiManagement/Service/* | Create and manage API Management Services |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |
| Microsoft.Support/* | Create and manage support tickets |

### Application Insights Component Contributor
Can manage Application Insights components

| **Actions** | |
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.Insights/webtests/* | Create and manage web tests |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### Automation Operator
Able to start, stop, suspend, and resume jobs

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Automation/automationAccounts/jobs/read | Read automation account jobs |
| Microsoft.Automation/automationAccounts/jobs/resume/action | Resume an automation account job |
| Microsoft.Automation/automationAccounts/jobs/stop/action | Stop an automation account job |
| Microsoft.Automation/automationAccounts/jobs/streams/read | Read automation account job streams |
| Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspend an automation account job |
| Microsoft.Automation/automationAccounts/jobs/write | Write automation account jobs |
| Microsoft.Automation/automationAccounts/jobSchedules/read | Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/jobSchedules/write | Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/read | Read automation accounts |
| Microsoft.Automation/automationAccounts/runbooks/read | Read automation runbooks |
| Microsoft.Automation/automationAccounts/schedules/read | Read automation account schedules |
| Microsoft.Automation/automationAccounts/schedules/write | Write automation account schedules |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### BizTalk Contributor
Can manage BizTalk services

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.BizTalkServices/BizTalk/* | Create and manage BizTalk services |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### ClearDB MySQL DB Contributor
Can manage ClearDB MySQL databases

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |
| successbricks.cleardb/databases/* | Create and manage ClearDB MySQL databases |

### Contributor
Can manage everything except access

| **Actions** ||
| ------- | ------ |
| * | Create and manage resources of all types |

| **NotActions** ||
| ------- | ------ |
| Microsoft.Authorization/*/Write | Can’t create roles and role assignments |
| Microsoft.Authorization/*/Delete | Can’t delete roles and role assignments |

### Data Factory Contributor
Can manage data factories

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.DataFactory/dataFactories/* | Manage data factories |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### DevTest Labs User
Can view everything and connect, start, restart, and shutdown virtual machines

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Compute/availabilitySets/read | Read the properties of availability sets |
| Microsoft.Compute/virtualMachines/*/read | Read the properties of a virtual machine (VM sizes, runtime status, VM extensions, etc.) |
| Microsoft.Compute/virtualMachines/deallocate/action | Deallocate virtual machines |
| Microsoft.Compute/virtualMachines/read | Read the properties of a virtual machine |
| Microsoft.Compute/virtualMachines/restart/action | Restart virtual machines |
| Microsoft.Compute/virtualMachines/start/action | Start virtual machines |
| Microsoft.DevTestLab/*/read | Read the properties of a lab |
| Microsoft.DevTestLab/labs/createEnvironment/action | Create a lab environment |
| Microsoft.DevTestLab/labs/formulas/delete | Delete formulas |
| Microsoft.DevTestLab/labs/formulas/read | Read formulas |
| Microsoft.DevTestLab/labs/formulas/write | Add or modify forumulas |
| Microsoft.DevTestLab/labs/policySets/evaluatePolicies/action | Evaluate lab policies |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Join a load balancer backend address pool |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Join a load balancer inbound NAT rule |
| Microsoft.Network/networkInterfaces/*/read | Read the properties of a network interface (e.g. all the load balancers that the network interface is a part of) |
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

### DocumentDB Account Contributor
Can manage DocumentDB accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.DocumentDb/databaseAccounts/* | Create and manage DocumentDB accounts |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### Intelligent Systems Account Contributor
Can manage Intelligent Systems accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.IntelligentSystems/accounts/* | Create and manage intelligent systems accounts |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### Network Contributor
Can manage all network resources

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Network/* | Create and manage networks |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### New Relic APM Account Contributor
Can manage New Relic Application Performance Management accounts and applications

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |
| NewRelic.APM/accounts/* | Create and manage New Relic application performance management accounts |

### Owner
Can manage everything, including access

| **Actions** ||
| ------- | ------ |
| * | Create and manage resources of all types |

### Reader
Can view everything, but can't make changes

| **Actions** ||
| ------- | ------ |
| */read | Read resources of all types, except secrets. |

### Redis Cache Contributor
Can manage Redis caches

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Cache/redis/* | Create and manage Redis caches |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Support/* | Create and manage support tickets |

### Scheduler Job Collections Contributor
Can manage Scheduler job collections

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Scheduler/jobcollections/* | Create and manage job collections |
| Microsoft.Support/* | Create and manage support tickets  |

### Search Service Contributor
Can manage Search services

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Search/searchServices/* | Create and manage search services |
| Microsoft.Support/* | Create and manage support tickets  |

### Security Manager
Can manage security components, security policies and virtual machines

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.ClassicCompute/*/read | Read configuration information classic compute virtual machines |
| Microsoft.ClassicCompute/virtualMachines/*/write | Write configuration for virtual machines |
| Microsoft.ClassicNetwork/*/read | Read configuration information about classic network  |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Security/* | Create and manage security components and policies |
| Microsoft.Support/* | Create and manage support tickets  |

### SQL DB Contributor
Can manage SQL databases but not their security related policies

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Sql/servers/databases/* | Create and manage SQL databases |
| Microsoft.Sql/servers/read | Read SQL Servers |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** ||
| ------- | ------ |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit audit policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Can't edit audit settings |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Can't edit connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Can't edit data masking policies |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Can't edit security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Can't edit security metrics |

### SQL Security Manager
Can manage the security related policies of SQL servers and databases

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read Microsoft authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Sql/servers/auditingPolicies/* | Create and manage SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* | Create and manage SQL server auditing setting |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Create and manage SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Create and manage SQL server database auditing settings |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Create and manage SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Create and manage SQL server database data masking policies |
| Microsoft.Sql/servers/databases/read | Read SQL databases |
| Microsoft.Sql/servers/databases/schemas/read | Read SQL server database schemas |
| Microsoft.Sql/servers/databases/schemas/tables/columns/read | Read SQL server database table columns |
| Microsoft.Sql/servers/databases/schemas/tables/read | Read SQL server database tables |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Create and manage SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Create and manage SQL server database security metrics |
| Microsoft.Sql/servers/read | Read SQL Servers |
| Microsoft.Sql/servers/securityAlertPolicies/* | Create and manage SQL server security alert policies |
| Microsoft.Support/* | Create and manage support tickets |

### SQL Server Contributor
Can manage SQL servers and databases but not their security related policies

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read authorization|
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Sql/servers/* | Create and manage SQL servers |
| Microsoft.Support/* | Create and manage support tickets |

| **NotActions** ||
| ------- | ------ |
| Microsoft.Sql/servers/auditingPolicies/* | Can't edit SQL server auditing policies |
| Microsoft.Sql/servers/auditingSettings/* | Can't edit SQL server auditing settings |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit SQL server database auditing policies |
| Microsoft.Sql/servers/databases/auditingSettings/* | Can't edit SQL server database auditing settings |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Can't edit SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Can't edit SQL server database data masking policies |
| Microsoft.Sql/servers/databases/securityAlertPolicies/* | Can't edit SQL server database security alert policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Can't edit SQL server database security metrics |
| Microsoft.Sql/servers/securityAlertPolicies/* | Can't edit SQL server security alert policies |

### Classic Storage Account Contributor
Can manage classic storage accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicStorage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Support/* | Create and manage support tickets |

### Storage Account Contributor
Can manage storage accounts, but not acccess to them.

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read all authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/diagnosticSettings/* | Manage diagnostic settings |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Storage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

### User Access Administrator
Can manage user access to Azure resources

| **Actions** ||
| ------- | ------ |
| */read | Read resources of all Types, except secrets. |
| Microsoft.Authorization/* | Manage authorization |
| Microsoft.Support/* | Create and manage support tickets |

### Classic Virtual Machine Contributor
Can manage classic virtual machines but not the virtual network or storage account to which they are connected

| **Actions** ||
| ------- | ------ |
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
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Support/* | Create and manage support tickets |

### Virtual Machine Contributor
Can manage virtual machines but not the virtual network or storage account to which they are connected

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Compute/availabilitySets/* | Create and manage compute availability sets |
| Microsoft.Compute/locations/* | Create and manage compute locations |
| Microsoft.Compute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.Compute/virtualMachineScaleSets/* | Create and manage virtual machine scale sets |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Network/applicationGateways/backendAddressPools/join/action | Join network application gateway backend address pools |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Join load balancer backend address pools |
| Microsoft.Network/loadBalancers/inboundNatPools/join/action | Join load balancer inbound NAT pools |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Join load balancer inbound NAT ules |
| Microsoft.Network/loadBalancers/read | Read load balancers |
| Microsoft.Network/locations/* | Create and manage network locations |
| Microsoft.Network/networkInterfaces/* | Create and manage network interfaces |
| Microsoft.Network/networkSecurityGroups/join/action | Join network security groups |
| Microsoft.Network/networkSecurityGroups/read | Read network security groups |
| Microsoft.Network/publicIPAddresses/join/action | Join network public IP addresses |
| Microsoft.Network/publicIPAddresses/read | Read network public IP addresses |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.Network/virtualNetworks/subnets/join/action | Join virtual network subnets |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Storage/storageAccounts/listKeys/action | List storage account keys |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Support/* | Create and manage support tickets |

### Classic Network Contributor
Can manage classic virtual networks and reserved IPs

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.ClassicNetwork/* | Create and manage classic networks |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Support/* | Create and manage support tickets |

### Web Plan Contributor
Can manage web plans

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/serverFarms/* | Create and manage server farms |

### Website Contributor
Can manage websites but not the web plans to which they are connected

| **Actions** ||
| ------- | ------ |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.ResourceHealth/availabilityStatuses/read | Read health of the resources |
| Microsoft.Resources/deployments/* | Create and manage resource group deployments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups | Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Web/certificates/* | Create and manage website certificates |
| Microsoft.Web/listSitesAssignedToHostName/read | Read sites assigned to a host name |
| Microsoft.Web/serverFarms/join/action | Join server farms |
| Microsoft.Web/serverFarms/read | Read server farms |
| Microsoft.Web/sites/* | Create and manage websites |

## See also
- [Role-Based Access Control](role-based-access-control-configure.md): Get started with RBAC in the Azure portal.
- [Custom roles in Azure RBAC](role-based-access-control-custom-roles.md): Learn how to create custom roles to fit your access needs.
- [Create an access change history report](role-based-access-control-access-change-history-report.md): Keep track of changing role assignments in RBAC.
- [Role-Based Access Control troubleshooting](role-based-access-control-troubleshooting.md): Get suggestions for fixing common issues.
