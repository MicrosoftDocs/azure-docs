<properties
	pageTitle="RBAC: Built in Roles | Microsoft Azure"
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
	ms.date="01/21/2016"
	ms.author="kgremban"/>

#RBAC: Built-in roles

## Built-in roles

Azure Role-Based Access Control (RBAC) comes with the following built-in roles that can be assigned to users, groups, and services. You can’t modify the definition of built-in roles. In an upcoming release of Azure RBAC, you will be able to define custom roles by composing a set of actions from a list of available actions that can be performed on Azure resources.

Click the links below to see the **actions** and **not actions** properties of a role definition. The **actions** property specifies the allowed actions on Azure resources. Action strings can use wildcard characters. The **not actions** property of a role definition specifies the actions that must be excluded from the allowed actions.


| Role Name | Description |
| --------- | ----------- |
| [API-Management Service Contributor](#api-management-service-contributor) | Can manage API Management services |
| [Application Insights Component Contributor](#application-insights-component-contributor) | Can manage Application Insights components |
| [Automation Operator](#automation-operator) | Able to start, stop, suspend, and resume jobs |
| [BizTalk Contributor](#biztalk-contributor) | Can manage BizTalk services |
| [ClearDB MySQL DB Contributor](#cleardb-mysql-db-contributor) | Can manage ClearDB MySQL databases |
| [Contributor](#contributor) | Can manage everything except access. |
| [Data Factory Contributor](#data-factory-contributor) | Can manage data factories |
| [DevTest Lab User](#devtest-lab-user) | Can view everything and connect, start, restart, and shutdown virtual machines |
| [Document DB Account Contributor](#document-db-account-contributor) | Can manage Document DB accounts |
| [Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) | Can manage Intelligent Systems accounts |
| [Network Contributor](#network-contributor) | Can manage all network resources |
| [NewRelic APM Account Contributor](#newrelic-apm-account-contributor) | Can manage NewRelic Application Performance Management accounts and applications |
| [Owner](#owner) | Can manage everything, including access |
| [Reader](#reader) | Can view everything, but can't make changes |
| [Redis Cache Contributor](#redis-cache-contributor]) | Can manage Redis caches |
| [Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) | Can manage scheduler job collections |
| [Search Service Contributor](#search-service-contributor) | Can manage search services |
| [Security Manager](#security-manager) | Can manage security components, security policies, and virtual machines |
| [SQL DB Contributor](#sql-db-contributor) | Can manage SQL databases but not their security related policies |
| [SQL Security Manager](#sql-security-manager) | Can manage the security related policies of SQL servers and databases |
| [SQL Server Contributor](#sql-server-contributor) | Can manage SQL servers and databases but not their security-related policies |
| [Classic Storage Account Contributor](#classic-storage-account-contributor) | Can manage classic storage accounts |
| [Storage Account Contributor](#storage-account-contributor) | Can manage storage accounts |
| [User Access Administrator](#user-access-administrator) | Can manage user access to Azure resources |
| [Classic Virtual Machine Contributor](#classic-virtual-machine-contributor) | Can manage classic virtual machines but not the virtual network or storage account to which they are connected |
| [Virtual Machine Contributor](#virtual-machine-contributor) | Can manage virtual machines but not the virtual network or storage account to which they are connected |
| [Classic Network Contributor](#classic-network-contributor) | Can manage classic virtual networks and reserved IPs |
| [Web Plan Contributor](#web-plan-contributor) | Can manage web plans |
| [Website Contributor](#website-contributor) | Can manage websites but not the web plans to which they are connected |

### API Management Service Contributor
Can manage API Management services

| **Actions** | |
| ------- | ------ |
| Microsoft.ApiManagement/Services/* | Create and manage API Management Services  |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read roles and role assignments |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Application Insights Component Contributor
Can manage Application Insights components

| **Actions** | |
| ------- | ------ |
| Microsoft.Insights/components/* | Create and manage Insights components |
| Microsoft.Insights/webtests/* | Create and manage web tests |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments  |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Automation Operator
Able to start, stop, suspend, and resume jobs

| **Actions** ||
| ------- | ------ |
| Microsoft.Automation/automationAccounts/read | Read automation accounts |
| Microsoft.Automation/automationAccounts/runbooks/read | Read automation runbooks |
| Microsoft.Automation/automationAccounts/schedules/read | Read automation account schedules |
| Microsoft.Automation/automationAccounts/schedules/write | Write automation account schedules |
| Microsoft.Automation/automationAccounts/jobs/read | Read automation account jobs |
| Microsoft.Automation/automationAccounts/jobs/write | Write automation account jobs |
| Microsoft.Automation/automationAccounts/jobs/stop/action | Stop an automation account job |
| Microsoft.Automation/automationAccounts/jobs/suspend/action | Suspend an automation account job |
| Microsoft.Automation/automationAccounts/jobs/resume/action | Resume an automation account job |
| Microsoft.Automation/automationAccounts/jobSchedules/read | Read an automation account job schedule |
| Microsoft.Automation/automationAccounts/jobSchedules/write | Read an automation account job schedule |

### BizTalk Contributor
Can manage BizTalk services

| **Actions** ||
| ------- | ------ |
| Microsoft.BizTalkServices/BizTalk/* | Create and manage BizTalk services |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### ClearDB MySQL DB Contributor
Can manage ClearDB MySQL databases

| **Actions** ||
| ------- | ------ |
| successbricks.cleardb/databases/* | Create and manage ClearDB MySQL databases |
| Microsoft.Authorization/*/read | Read roles and role assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Contributor
Can manage everything except access

| **Actions** ||
| ------- | ------ |
| * | Create and manage resources of all types |

| **Not Actions** |  |
| ------- | ------ |
| Microsoft.Authorization/*/Write | Can’t create roles and role assignments |
| Microsoft.Authorization/*/Delete | Can’t delete roles and role assignments |

### Data Factory Contributor
Can manage data factories

| **Actions** ||
| ------- | ------ |
| Microsoft.DataFactory/dataFactories/* | Create and manage data factories |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### DevTest Lab User
Can view everything and connect, start, restart, and shutdown virtual machines

| **Actions** ||
| ------- | ------ |
| */read | Read resources of all types |
| Microsoft.DevTestLab/labs/labStats/action | Read lab stats |
| Microsoft.DevTestLab/Environments/* | Create and manage environments |
| Microsoft.DevTestLab/labs/createEnvironment/action | Create a lab environment |
| Microsoft.Compute/virtualMachines/start/action | Start virtual machines |
| Microsoft.Compute/virtualMachines/restart/action | Restart virtual machines |
| Microsoft.Compute/virtualMachines/deallocate/action | Deallocate virtual machines |
| Microsoft.Storage/storageAccounts/listKeys/action | List storage account keys |
| Microsoft.Network/virtualNetworks/join/action | Join virtual networks |
| Microsoft.Network/loadBalancers/join/action | Join load balancers |
| Microsoft.Network/publicIPAddresses/link/action | Link to publisc IP addresses |
| Microsoft.Network/networkInterfaces/link/action | Link to network interfaces |
| Microsoft.Network/networkInterfaces/write | Write network interfaces |

### Document DB Account Contributor
Can manage Document DB accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.DocumentDb/databaseAccounts/* | Create and manage DocumentDB accounts |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### Intelligent Systems Account Contributor
Can manage Intelligent Systems accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.IntelligentSystems/accounts/* | Create and manage intelligent systems accounts |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### Network Contributor
Can manage all network resources

| **Actions** ||
| ------- | ------ |
| Microsoft.Network/* | Create and manage networks |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### NewRelic APM Account Contributor
Can manage NewRelic Application Performance Management accounts and applications

| **Actions** ||
| ------- | ------ |
| NewRelic.APM/accounts/* | Create and manage NewRelic application performance management accounts |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Owner
Can manage everything, including access

| **Actions** ||
| ------- | ------ |
| * | Create and manage resources of all types |

### Reader
Can view everything, but can't make changes

| **Actions** ||
| ------- | ------ |
| */read | Read resources of all Types, except secrets. |

### Redis Cache Contributor
Can manage Redis caches

| **Actions** ||
| ------- | ------ |
| Microsoft.Cache/redis/* | Create and manage Redis caches |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### Scheduler Job Collections Contributor
Can manage Scheduler job collections

| **Actions** ||
| ------- | ------ |
| Microsoft.Scheduler/jobcollections/* | Create and manage job collections |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### Search Service Contributor
Can manage Search services

| **Actions** ||
| ------- | ------ |
| Microsoft.Search/searchServices/* | Create and manage search services |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### Security Manager
Can manage security components, security policies and virtual machines

| **Actions** ||
| ------- | ------ |
| Microsoft.ClassicNetwork/*/read | Read configuration information about classic network  |
| Microsoft.ClassicCompute/*/read | Read configuration information classic compute virtual machines |
| Microsoft.ClassicCompute/virtualMachines/*/write | Write configuration for virtual machines |
| Microsoft.Security/* | Create and manage security components and policies |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

### SQL DB Contributor
Can manage SQL databases but not their security related policies

| **Actions** ||
| ------- | ------ |
| Microsoft.Sql/servers/read | Read SQL Servers |
| Microsoft.Sql/servers/databases/* | Create and manage SQL databases |
| Microsoft.Authorization/*/read | Read roles and role Assignments |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage alert rules |
| Microsoft.Support/* | Create and manage support tickets  |

| **Not Actions** |  |
| ------- | ------ |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit audit policies |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Can't edit connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Can't edit data masking policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Can't edit security metrics |

### SQL Security Manager
Can manage the security related policies of SQL servers and databases

| **Actions** ||
| ------- | ------ |
| Microsoft.Sql/servers/read | Read SQL Servers |
| Microsoft.Sql/servers/auditingPolicies/* | Create and manage SQL server auditing policies |
| Microsoft.Sql/servers/databases/read | Read SQL databases |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Create and manage SQL server database auditing policies |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Create and manage SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Create and manage SQL server database data masking policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Create and manage SQL server database security metrics |
| Microsoft.Authorization/*/read | Read Microsoft authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscriptions resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Sql/servers/databases/schemas/read | Read SQL server database schemas |
| Microsoft.Sql/servers/databases/schemas/tables/read | Read SQL server database tables |
| Microsoft.Sql/servers/databases/schemas/tables/columns/read | Read SQL server database table columns |

### SQL Server Contributor
Can manage SQL servers and databases but not their security related policies

| **Actions** ||
| ------- | ------ |
| Microsoft.Sql/servers/* | Create and manage SQL servers |
| Microsoft.Authorization/*/read | Read authorization|
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource group resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscriptions resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

| **Not Actions** | |
| ------- | ------ |
| Microsoft.Sql/servers/auditingPolicies/* | Can't edit SQL server auditing policies |
| Microsoft.Sql/servers/databases/auditingPolicies/* | Can't edit SQL server database auditing policies |
| Microsoft.Sql/servers/databases/connectionPolicies/* | Can't edit SQL server database connection policies |
| Microsoft.Sql/servers/databases/dataMaskingPolicies/* | Can't edit SQL server database data masking policies |
| Microsoft.Sql/servers/databases/securityMetrics/* | Can't edit SQL server database security metrics |

### Classic Storage Account Contributor
Can manage classic storage accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.ClassicStorage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resources/read | Read subscription resources |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Storage Account Contributor
Can manage storage accounts

| **Actions** ||
| ------- | ------ |
| Microsoft.Storage/storageAccounts/* | Create and manage storage accounts |
| Microsoft.Authorization/*/read | Read all authorization |
| Microsoft.Resources/subscriptions/resources/read | Read subscription resources |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### User Access Administrator
Can manage user access to Azure resources

| **Actions** ||
| ------- | ------ |
| */read | Read resources of all Types, except secrets. |
| Microsoft.Authorization/* | Read authorization |
| Microsoft.Support/* | Create and manage support tickets |

### Classic Virtual Machine Contributor
Can manage classic virtual machines but not the virtual network or storage account to which they are connected

| **Actions** ||
| ------- | ------ |
| Microsoft.ClassicStorage/storageAccounts/read | Read classic storage accounts |
| Microsoft.ClassicStorage/storageAccounts/listKeys/action | List storage account keys |
| Microsoft.ClassicStorage/storageAccounts/disks/read | Read storage account disks |
| Microsoft.ClassicStorage/storageAccounts/images/read | Read storage account images |
| Microsoft.ClassicNetwork/virtualNetworks/read | Read virtual networks |
| Microsoft.ClassicNetwork/reservedIps/read | Read reserved IP addresses |
| Microsoft.ClassicNetwork/virtualNetworks/join/action | Join virtual networks |
| Microsoft.ClassicNetwork/reservedIps/link/action | Link reserved IPs |
| Microsoft.ClassicCompute/domainNames/* | Create and manage classic compute domain names |
| Microsoft.ClassicCompute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Virtual Machine Contributor
Can manage virtual machines but not the virtual network or storage account to which they are connected

| **Actions** ||
| ------- | ------ |
| Microsoft.Storage/storageAccounts/read | Read storage accounts |
| Microsoft.Storage/storageAccounts/listKeys/action | List storage account keys |
| Microsoft.Network/virtualNetworks/read | Read virtual networks |
| Microsoft.Network/virtualNetworks/subnets/join/action | Join virtual network subnets |
| Microsoft.Network/loadBalancers/read | Read load balancers |
| Microsoft.Network/loadBalancers/backendAddressPools/join/action | Join load balancer backend address pools |
| Microsoft.Network/loadBalancers/inboundNatRules/join/action | Join load balancer inbound NAT Rules |
| Microsoft.Network/publicIPAddresses/read | Read network public IP addresses |
| Microsoft.Network/publicIPAddresses/join/action | Join network public IP addresses |
| Microsoft.Network/networkSecurityGroups/read | Read network security groups |
| Microsoft.Network/networkSecurityGroups/join/action | Join network security groups |
| Microsoft.Network/networkInterfaces/* | Create and manage network interfaces |
| Microsoft.Network/locations/* | Create and manage network locations |
| Microsoft.Network/applicationGateways/backendAddressPools/join/action | Join network application gateway backend address pools |
| Microsoft.Compute/virtualMachines/* | Create and manage virtual machines |
| Microsoft.Compute/availabilitySets/* | Create and manage compute availability sets |
| Microsoft.Compute/locations/* | Create and manage compute locations |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Classic Network Contributor
Can manage classic virtual networks and reserved IPs

| **Actions** ||
| ------- | ------ |
| Microsoft.ClassicNetwork/* | Create and manage classic networks |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Web Plan Contributor
Can manage web plans

| **Actions** ||
| ------- | ------ |
| Microsoft.Web/serverFarms/* | Create and manage server farms |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |

### Website Contributor
Can manage websites but not the web plans to which they are connected

| **Actions** ||
| ------- | ------ |
| Microsoft.Web/serverFarms/read | Read server farms |
| Microsoft.Web/serverFarms/join/action | Join server farms |
| Microsoft.Web/sites/* | Create and manage websites |
| Microsoft.Web/certificates/* | Create and manage website certificates |
| Microsoft.Web/listSitesAssignedToHostName/read | Read sites assigned to a host name |
| Microsoft.Authorization/*/read | Read authorization |
| Microsoft.Resources/subscriptions/resourceGroups/read | Read subscription resource groups |
| Microsoft.Resources/subscriptions/resourceGroups/resources/read | Read subscription resource groups resources |
| Microsoft.Resources/subscriptions/resourceGroups/deployments/* | Create and manage subscription resource group deployments |
| Microsoft.Insights/alertRules/* | Create and manage Insights alert rules |
| Microsoft.Support/* | Create and manage support tickets |
| Microsoft.Insights/components/* | Create and manage Insights components |

## RBAC Topics
[AZURE.INCLUDE [role-based-access-control-toc.md](../../includes/role-based-access-control-toc.md)]
