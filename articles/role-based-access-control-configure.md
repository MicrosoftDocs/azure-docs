<properties 
	pageTitle="Role-based access control in the Microsoft Azure portal" 
	description="Describes how role based access control works and how to set it up" 
	services="" 
	documentationCenter="" 
	authors="Justinha" 
	manager="terrylan" 
	editor=""/>

<tags 
	ms.service="multiple" 
	ms.devlang="dotnet" 
	ms.topic="article" 
	ms.tgt_pltfrm="Ibiza" 
	ms.workload="infrastructure-services" 
	ms.date="05/05/2015" 
	ms.author="justinha"/>

# Role-based access control in the Microsoft Azure portal 

We’ve added support for role-based access control (RBAC) in the Microsoft Azure portal to help organizations meet their access management requirements simply and precisely. The [blog post](http://go.microsoft.com/fwlink/?LinkId=511576) will give you a quick introduction of the feature and get you started. This topic describes the concepts in detail and covers additional use cases.


## RBAC in Azure
                                                                   
Every Azure subscription is associated with an Azure Active Directory. Users and services that access resources of the subscription using the Microsoft Azure Management Portal or Azure Resource Manager API first need to authenticate with that Azure Active Directory.

![][1] 

Azure role-based access control allows you to grant appropriate access to Azure AD users, groups, and services, by assigning roles to them on a subscription or resource group or individual resource level. The assigned role defines the level of access that the users, groups, or services have on the Azure resource. 

### Role

A role is a collection of actions that can be performed on Azure resources. A user or a service is allowed to perform an action on an Azure resource if they have been assigned a role that contains that action. For a list of built-in roles and **their** actions and **not actions** properties, see [Built-in roles](#builtinroles).

### Role Assignment

Access is granted to Azure AD users and services by assigning the appropriate role to them on an Azure resource. 

#### Azure AD Security Principals

Roles can be assigned to the following types of Azure AD security principals:

+ **Users**: roles can be assigned to organizational users that are in the Azure AD with which the Azure subscription is associated. Roles can also be assigned to external Microsoft account users (such as joe@outlook.com) by using the Invite action to assign the user to a role in the Azure portal. Assigning a role to an external Microsoft account user causes a guest account to be created in the Azure AD for it. If this guest account is disabled in the directory, the external user won’t be allowed to access any Azure resource that the user has been granted access to.
+ **Groups**: roles can be assigned to Azure AD security groups. A user is automatically granted access to a resource if the user becomes a member of a group that has access. The user also automatically loses access to the resource after getting removed from the group. Managing access via groups by assigning roles to groups and adding users to those groups is the best practice, instead of assigning roles directly to users. Azure RBAC does not allow assigning roles to distribution lists.
	The ability to assign roles to groups lets an organization extend its existing access control model from its on-premises directory to the cloud, so security groups that are already established to control access on-premises can be re-used to control access to resources in the Azure portal. For more information about different options for synchronizing users and groups from an on-premises directory, see [Directory integration](http://technet.microsoft.com/library/jj573653.aspx). Azure AD Premium also offers a [delegated group management feature](http://msdn.microsoft.com/library/azure/dn641267.aspx) with which the ability to create and manage groups can be delegated to non-administrator users from Azure AD.
+ **Service principals**: service identities are represented as service principals in the directory. They authenticate with Azure AD and securely communicate with one another. Services can be granted access to Azure resources by assigning roles via the Azure module for Windows PowerShell to the Azure AD service principal representing that service. 

#### Resource scope

Access does not need to be granted to the entire subscription. Roles can also be assigned for resource groups as well as for individual resources. In Azure RBAC, a resource inherits role assignments from its parent resources. So if a user, group, or service is granted access to only a resource group within a subscription, they will be able to access only that resource group and resources within it, and not the other resources groups within the subscription. As another example, a security group can be added to the Reader role for a resource group, but be added to the Contributor role for a database within that resource group.

![][2]

## Co-existence of RBAC with subscription co-administrators

Subscription administrator and co-admins will continue to have full access to the Azure portals and management APIs. In the RBAC model, they are assigned the Owner role at the subscription level.  
However, the new RBAC model is supported only by the Azure portal and Azure Resource Manager APIs. Users and services that are assigned RBAC roles cannot access the Azure Management Portal and the Service Management APIs. Adding a user to the Owner role of a subscription in the Azure portal does not make that user a co-administrator of the subscription in the full Azure portal.

If you wish to grant access to a user to an Azure Resource that isn’t yet available to be managed via the Azure portal, you should add them to the subscription co-administrators using the Azure Management Portal. Service Bus and Cloud Services are examples of resources that today cannot be managed by using RBAC.

## Authorization for management versus data operations

Role-based access control is supported only for management operations of the Azure resources in Azure portal and Azure Resource Manager APIs. Not all data level operations for Azure resources can be authorized via RBAC. For instance, create/read/update/delete of Storage Accounts can be controlled via RBAC, but create/read/update/delete of blobs or tables within the Storage Account cannot yet be controlled via RBAC. Similarly, create/read/update/delete of a SQL DB can be controlled via RBAC but create/read/update/delete of SQL tables within the DB cannot yet be controlled via RBAC.

## How to add and remove access

Let’s take a look at an example of how a resource owner in an organization can manage access. In this scenario, you have multiple people working on a variety of test and production projects that are built using Azure resources. You want to follow best practices for granting access. Users should have access to all resources that they need, but no additional access. You want to re-use all the investments you have made in processes and tooling to use security groups that are mastered in an on-premises Active Directory. These sections cover how you set up access to these resources:

* [Add access](#add-access)
* [Remove access](#remove-access)
* [Add or remove access for external user](#add-or-remove-access-for-external-user)

### Add access

Here is a summary of the access requirements and how they are set up in Azure.

User/Group  | Access requirement  | role and scope for access	
------------- | -------------  | ------------
All of Jill Santos’ team  | Read all Azure resources  | Add the AD group that represents Jill Santos’ team to Reader role for the Azure subscription
All of Jill Santos’ team  | Create and manage all resources in the Test resource group  | Add the AD group that represents Jill Santos’ team to Contributor role for the Test resource group
Brock  | Create and manage all resources in the Prod resource group  | Add Brock to Contributor role for the Prod resource group


First, let’s add Read access for all resources of the subscription. Click **Browse > Everything > Subscriptions**.

![][3] 

Click *name of your subscription* ** > Reader > Add**. From the list of users and groups, select or type the name of the Active Directory group.

![][4]

Then add the same team to the Contributor role of the Test resource group. Click the resource group to open its property blade. Under **Roles**, click **Contributor > Add** and type the name of the team.

![][5]

To add Brock to the Contributor role of the Prod resource group, click the resource group click **Contributor > Add** and type Brock’s name. 

![][6]

Role assignments can also be managed by using the Microsoft Azure module for Windows PowerShell. Here is an example of adding Brock's account by using the New-AzureRoleAssignment cmdlet rather than the portal:

	PS C:\> New-AzureRoleAssignment -Mail brockh@contoso.com -RoleDefinitionName Contributor -ResourceGroupName ProdDB

For more information about using Windows PowerShell to add and remove access, see [Managing role-based access control with Windows PowerShell](role-based-access-control-powershell.md). 

### Remove access

You can also remove assignments easily. Let’s say you want to remove a user named Brad Adams from the Reader role for a resource group named TestDB. Open the resource group blade, click **Reader > Brad Adams > Remove**.

![][7]

Here is an example of how to remove Brad Adams by using the Remove-AzureRoleAssignment cmdlet:

	PS C:\> Remove-AzureRoleAssignment -Mail badams@contoso.com -RoleDefinitionName Reader -ResourceGroupName TestDB

### Add or remove access for external user

The **Configure** tab of a directory includes options to control access for external users. These options can be changed only in the UI (there is no Windows PowerShell or API method) in the full Azure portal by a directory global administrator. 
To open the **Configure** tab in the Azure portal, click **Active Directory**, and then click the name of the directory.

![][10]

Then you can edit the options to control access for external users. 

![][8]

By default, guests cannot enumerate the contents of the directory, so they do not see any users or groups in the **Member List**. They can search for a user by typing the user's full email address, and then grant access. The set of default restrictions for guests are:

- They cannot enumerate users and groups in the directory.
- They can see limited details of a user if they know the user's email address.
- They can see limited details of a group when they know the group name.

The ability for guests to see limited details of a user or group allows them to invite other people and see some details of people with whom they are collaborating.  

Let’s step through the process to add access for an external user. We’ll add an external user to the same Reader role for TestDB resource group so that user can help debug an error. Open the resource group blade, click **Reader > Add > Invite** and type the email address of the user you want to add. 

![][9]

When you add an external user, a guest is created in the directory. Thereafter, that guest can be added to a group or removed from a group, or you can add or remove it individually from a role just like you would for any other directory users. 

You can also remove a guest from any role, just as you would remove any user. Removing the guest from a role on a resource does not remove the guest from the directory. 
 
## Known issues when using role-based access control

If you encounter a problem when you use role based access control feature, see [Troubleshooting role-based access control](role-based-access-control-troubleshooting.md) for any known issues that may be related to the problem.


## Built-in roles

Azure role-based access control comes with the following built-in roles that can be assigned to users, groups, and services. You can’t modify the definition of built-in roles. In an upcoming release of Azure RBAC, you will be able to define custom roles by composing a set of actions from a list of available actions that can be performed on Azure resources.

Click the corresponding link to see the **actions** and **not actions** properties of a role definition. The **actions** property specifies the allowed actions on Azure resources. Action strings can use wildcard characters. The **not actions** property of a role definition specifies the actions that must be excluded from the allowed actions. 


Role name  | Description  	
------------- | -------------  
[API Management Service Contributor](#api-management-service-contributor) | Lets you manage API Management service, but not access to them.
[Application Insights Component Contributor](#application-insights-component-contributor) | Lets you manage Application Insights components, but not access to them.
[BizTalk Contributor](#biztalk-contributor) | Lets you manage BizTalk services, but not access to them.
[ClearDB MySQL DB Contributor](#cleardb-mysql-db-contributor) | Lets you manage ClearDB MySQL databases, but not access to them.
[Contributor](#contributor) | Contributors can manage everything except access.
[Data Factory Contributor](#data-factory-contributor) | Lets you manage data factories, but not access to them.
[Document DB Account Contributor](#document-db-account-contributor) | Lets you manage DocumentDB accounts, but not access to them.
[Intelligent Systems Account Contributor](#intelligent-systems-account-contributor) | Lets you manage Intelligent Systems accounts, but not access to them.
[NewRelic APM Account Contributor](#newrelic-apm-account-contributor) | Lets you manage New Relic Application Performance Management accounts and applications, but not access to them.
[Owner](#owner) | Owner can manage everything, including access.
[Reader](#reader) | Readers can view everything, but can't make changes.
[Redis Cache Contributor](#redis-cache-contributor) | Lets you manage Redis caches, but not access to them.
[SQL DB Contributor](#sql-db-contributor) | Lets you manage SQL databases, but not access to them. Also, you can’t manage their security-related policies or their parent SQL servers.
[SQL Security Manager](#sql-security-manager) | Lets you manage the security-related policies of SQL servers and databases, but not access to them.
[SQL Server Contributor](#sql-server-contributor) | Lets you manage SQL servers and databases, but not access to them, and not their security-related policies.
[Scheduler Job Collections Contributor](#scheduler-job-collections-contributor) | Lets you manage Scheduler job collections, but not access to them.
[Search Service Contributor](#search-service-contributor) | Lets you manage Search services, but not access to them.
[Storage Account Contributor](#storage-account-contributor) | Lets you manage storage accounts, but not access to them.
[User Access Administrator](#user-access-administrator) | Lets you manage user access to Azure resources.
[Virtual Machine Contributor](#virtual-machine-contributor) | Lets you manage virtual machines, but not access to them, and not the virtual network or storage account they’re connected to.
[Virtual Network Contributor](#virtual-network-contributor) | Lets you manage virtual networks, but not access to them.
[Web Plan Contributor](#web-plan-contributor) | Lets you manage the web plans for websites, but not access to them.
[Website Contributor](#website-contributor) | Lets you manage websites (not web plans), but not access to them.


### API Management Service Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.ApiManagement/Services/*</td>
<td>Create and Manage API Management Services</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Application Insights Component Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Insights/components/*</td>
<td>Create and Manage Insights Components</td>
</tr>
<tr>
<td>Microsoft.Insights/webtests/*</td>
<td>Create and Manage Web Tests</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### BizTalk Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.BizTalkServices/BizTalk/*</td>
<td>Create and Manage BizTalk Services</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### ClearDB MySQL DB Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>successbricks.cleardb/databases/*</td>
<td>Create and Manage ClearDB MySQL Databases</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>*</td>
<td>Create and Manage Resources of All Types</td>
</tr>
<tr>
<th colspan="2">Not Actions</th>
</tr>
<tr>
<td>Microsoft.Authorization/*/Write</td>
<td>Can’t Create Roles and Role Assignments </td>
</tr>
<tr>
<td>Microsoft.Authorization/*/Delete</td>
<td>Can’t Delete Roles and Role Assignments</td>
</tr>
</table>

### Data Factory Contributor

<table style=width:100%">
<tr>
<td>Microsoft.DataFactory/dataFactories/*</td>
<td>Create and Manage Data Factories</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Document DB Account Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.DocumentDb/databaseAccounts/*</td>
<td>Create and Manage DocumentDB Accounts</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Intelligent Systems Account Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.IntelligentSystems/accounts/*</td>
<td>Create and Manage Intelligent Systems Accounts</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### NewRelic APM Account Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>NewRelic.APM/accounts/*</td>
<td>Create and Manage NewRelic Application Performance Management Accounts</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Owner

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>*</td>
<td>Create and Manage Resources of All Types</td>
</tr>
</table>

### Reader

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>*/read</td>
<td>Read Resources of All Types. Can’t read secrets though.</td>
</tr>
</table>

### Redis Cache Contributor

<table style=width:100%">
<tr>
<td>Microsoft.Cache/redis/*</td>
<td>Create and Manage Redis Caches</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### SQL DB Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Sql/servers/read</td>
<td>Read SQL Servers</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/*</td>
<td>Create and Manage SQL Databases</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
<tr>
<th colspan="2">Not Actions</th>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/auditingPolicies/*</td>
<td>Can’t Manage SQL Database Auditing Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/connectionPolicies/*</td>
<td>Can’t Manage SQL Database Connection Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/dataMaskingPolicies/*</td>
<td>Can’t Manage SQL Database Data Masking Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/securityMetrics/*</td>
<td>Can’t Manage SQL Database Security Metrics</td>
</tr>
</table>

### SQL Security Manager

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Sql/servers/read</td>
<td>Read SQL Servers</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/auditingPolicies/*</td>
<td>Create and Manage SQL Server Auditing Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/read</td>
<td>Read SQL Databases</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/auditingPolicies/*</td>
<td>Create and Manage SQL Database Auditing Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/connectionPolicies/*</td>
<td>Create and Manage SQL Database Connection Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/dataMaskingPolicies/*</td>
<td>Create and Manage SQL Database Data Masking Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/securityMetrics/*</td>
<td>Create and Manage SQL Database Security Metrics</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### SQL Server Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.ApiManagement/Services/*</td>
<td>Create and Manage API Management Services</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
<tr>
<th colspan="2">Not Actions</th>
</tr>
<tr>
<td>Microsoft.Sql/servers/auditingPolicies/*</td>
<td>Can’t Manage SQL Server Auditing Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/auditingPolicies/*</td>
<td>Can’t Manage SQL Database Auditing Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/connectionPolicies/*</td>
<td>Can’t Manage SQL Database Connection Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/dataMaskingPolicies/*</td>
<td>Can’t Manage SQL Database Data Masking Policies</td>
</tr>
<tr>
<td>Microsoft.Sql/servers/databases/securityMetrics/*</td>
<td>Can’t Manage SQL Database Security Metrics</td>
</tr>
</table>

### Scheduler Job Collections Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Scheduler/jobcollections/*</td>
<td>Create and Manage Scheduler Job Collections</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Search Service Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Search/searchServices/*</td>
<td>Create and Manage Search Services</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Storage Account Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.ClassicStorage/storageAccounts/*</td>
<td>Create and Manage Storage Accounts</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### User Access Administrator

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>*/read</td>
<td>Read Resources of All Types</td>
</tr>
<tr>
<td>Microsoft.Authorization/*</td>
<td>Create and Manage Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table> 

### Virtual Machine Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.ClassicStorage/storageAccounts/read</td>
<td>Read Storage Accounts</td>
</tr>
<tr>
<td>Microsoft.ClassicStorage/storageAccounts/listKeys/action</td>
<td>Retrieve Storage Account Keys</td>
</tr>
<tr>
<td>Microsoft.ClassicNetwork/virtualNetworks/read</td>
<td>Read Virtual Networks</td>
</tr>
<tr>
<td>Microsoft.ClassicNetwork/virtualNetworks/join/action</td>
<td>Join Virtual Networks</td>
</tr>
<tr>
<td>Microsoft.ClassicNetwork/reservedIps/read</td>
<td>Read Reserved IP Addresses</td>
</tr>
<tr>
<td>Microsoft.ClassicNetwork/reservedIps/link/action</td>
<td>Link to Reserved IP Addresses</td>
</tr>
<tr>
<td>Microsoft.ClassicCompute/domainNames/*</td>
<td>Create and Manage Cloud Services</td>
</tr>
<tr>
<td>Microsoft.ClassicCompute/virtualMachines/*</td>
<td>Create and Manage Virtual Machines</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Virtual Network Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.ClassicNetwork/virtualNetworks/*</td>
<td>Create and Manage Virtual Networks</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Web Plan Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Web/serverFarms/*</td>
<td>Create and Manage Web Plans</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>

### Website Contributor

<table style=width:100%">
<tr>
<th colspan="2">Actions</th>
</tr>
<tr>
<td>Microsoft.Web/serverFarms/read</td>
<td>Read Web Plans</td>
</tr>
<tr>
<td>Microsoft.Web/serverFarms/join/action</td>
<td>Join Web Plans</td>
</tr>
<tr>
<td>Microsoft.Web/sites/*</td>
<td>Create and Manage Web Sites</td>
</tr>
<tr>
<td>Microsoft.Web/certificates/*</td>
<td>Create and Manage Web Site Certificates</td>
</tr>
<tr>
<td>Microsoft.Authorization/*/read</td>
<td>Read Roles and Role Assignments</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/read</td>
<td>Read Resource Groups</td>
</tr>
<tr>
<td>Microsoft.Resources/subscriptions/resourceGroups/deployments/*</td>
<td>Create and Manage Resource Group Deployments</td>
</tr>
<tr>
<td>Microsoft.Insights/alertRules/*</td>
<td>Create and Manage Alert Rules</td>
</tr>
<tr>
<td>Microsoft.Support/*</td>
<td>Create and Manage Support Tickets</td>
</tr>
</table>


## How to provide feedback

Please try Azure RBAC and send us [feedback](http://aka.ms/azurerbacfeedback). 


## Next steps

Here are some additional resources to help you use role-based access control: 

+ [Managing role-based access control with Windows PowerShell](role-based-access-control-powershell.md)
+ [Managing role-based access control with Azure CLI](role-based-access-control-xplat-cli.md)
+ [Troubleshooting role-based access control](role-based-access-control-troubleshooting.md)
+ [Azure Active Directory Premium and Basic](active-directory-editions.md)
+ [How Azure subscriptions are associated with Azure AD](active-directory-how-subscriptions-associated-directory.md)
+ For an introduction to self-service group management for security groups, see the [Active Directory Team Blog](http://blogs.technet.com/b/ad/archive/2014/02/24/more-preview-enhancements-for-windows-azure-ad-premium.aspx)

<!--Image references-->
[1]: ./media/role-based-access-control-configure/RBACSubAuthDir.png
[2]: ./media/role-based-access-control-configure/RBACAssignmentScopes.png
[3]: ./media/role-based-access-control-configure/RBACSubscriptionBlade.png
[4]: ./media/role-based-access-control-configure/RBACAddSubReader_NEW.png
[5]: ./media/role-based-access-control-configure/RBACAddRGContributor_NEW.png
[6]: ./media/role-based-access-control-configure/RBACAddProdContributor_NEW.png
[7]: ./media/role-based-access-control-configure/RBACRemoveRole.png
[8]: ./media/role-based-access-control-configure/RBACGuestAccessControls.png
[9]: ./media/role-based-access-control-configure/RBACInviteExtUser_NEW.png
[10]: ./media/role-based-access-control-configure/RBACDirConfigTab.png


