<properties
	pageTitle="Azure Active Directory AD Role-based Access Control | Microsoft Azure"
	description="This article describes Azure role-based access control."
	services="active-directory"
	documentationCenter=""
	authors="IHenkel"
	manager="stevenpo"
	editor=""/>

<tags
	ms.service="active-directory"
	ms.devlang="na"
	ms.topic="article"
	ms.tgt_pltfrm="na"
	ms.workload="identity"
	ms.date="12/04/2015"
	ms.author="inhenk"/>

# Azure Active Directory Role-based Access Control

## Role-based Access Control
Azure Roles-Based Access Control (RBAC) enables fine-grained access management for Azure. Using RBAC, you can segregate duties within your DevOps team and grant only the amount of access to users that they need to perform their jobs.

### Basics of access management in Azure
Each Azure subscription is homed to an Azure Active Directory. Only users, groups, and applications from that directory can be granted access to manage resources in the Azure subscription, using Azure Management Portal, Azure Command-Line tools and Azure Management APIs.

Access is granted by assigning the appropriate RBAC role to users, groups, and applications, at the right scope. To grant access to the entire subscription, assign a role at the subscription scope. To grant access to a specific resource group within a subscription, assign a role at the resource group scope. You may assign roles at specific resources too, like websites, virtual machines and subnets, to grant access only to a resource.

![](./media/role-based-access-control-configure/overview.png)

The RBAC role that you assign to users, groups, and applications, dictates what resources the user (or application) can manage within that scope.

### Azure RBAC Built-In Roles
Azure RBAC has three basic roles that apply to all resource types: Owner, Contributor and Reader. Owner has full access to all resources including the right to delegate access to others. Contributor can create and manage all types of Azure resources but can’t grant access to others. Reader can only view existing Azure resources. The rest of the RBAC roles in Azure allow management of specific Azure resources. For instance, the Virtual Machine Contributor role allows creation and management of virtual machines but does not allow management of the virtual network or the subnet that the virtual machine connects to.

[RBAC Built in Roles](role-based-access-built-in-roles.md) lists the built-in RBAC roles available in Azure. For each role it specifies the operations to which a built-in role grants access.

### Azure Resource Hierarchy and Access Inheritance
Each subscription in Azure belongs to one and only one directory, each resource group belongs to one and only one subscription, and each resource belongs to one and only one resource group. Access that you grant at parent scopes is inherited at child scopes. If you grant reader role to an Azure AD group at the subscription scope, the members of that group will be able to view every resource groups and every resource in the subscription. If you grant the contributor role to an application at the resource group scope, it will be able to manage resources of all types in that resource group but not other resource groups in the subscription.

### Azure RBAC vs. Classic Subscription Administrator and Co-Admins
Classic subscription administrator and co-admins have full access to the Azure subscription. They can manage resources using both the classic portal (https://manage.windowsazure.com), and Azure Service Manager APIs, as well as the new management portal (https://portal.azure.com), and new Azure Resource Manager APIs. In the RBAC model, classic administrators are assigned the Owner role at the subscription scope.

The finer-grained authorization model (Azure RBAC) is supported only by the new management portal (https://portal.azure.com) and Azure Resource Manager APIs. Users and applications that are assigned RBAC roles (at subscription/resource group/resource scope) cannot use the classic management portal (http://manage.windowsazure.com) and the Azure Service Management APIs.

### Authorization for Management vs Data Operations
The finer-grained authorization model (Azure RBAC) is supported only for management operations of the Azure resources in the Azure classic portal and Azure Resource Manager APIs. Not all data level operations for Azure resources can be authorized via RBAC. For instance, create/read/update/delete of Storage Accounts can be controlled via RBAC, but create/read/update/delete of blobs or tables within the Storage Account cannot yet be controlled via RBAC. Similarly, create/read/update/delete of a SQL DB can be controlled via RBAC but create/read/update/delete of SQL tables within the DB cannot yet be controlled via RBAC.

## Manage access using the Azure Management Portal
### View Access
Select access settings in the essentials section of the resource group blade. The **Users** blade lists all users, groups and applications that have been granted access to the resource group. Access is either assigned on the resource group or inherited from an assignment on the parent subscription.

![](./media/role-based-access-control-configure/view-access.png)

> [AZURE.NOTE] Classic subscription admins and co-admins are in effect owners of the subscription in the new RBAC model.

### Add Access
1. Click the **Add** icon on the **Users** blade. ![](./media/role-based-access-control-configure/grant-access1.png)
2. Select the role that you wish to assign.
3. Search for and select the user, or group, or application that you wish to grant access to.
4. Search the directory for users, groups, and applications using display names, email addresses, and object identifiers.![](./media/role-based-access-control-configure/grant-access2.png)

### Remove Access
1. In the **Users** blade, select the role assignment that you wish to remove.
2. Click the **Remove** icon in the assignment details blade.
3. Click **yes** to confirm removal.

![](./media/role-based-access-control-configure/remove-access1.png)


> [AZURE.NOTE] Inherited assignments can not be removed from child scopes. Navigate to the parent scope and remove such assignments.


![](./media/role-based-access-control-configure/remove-access2.png)

## Manage access using Azure PowerShell
Access can be managed used Azure RBAC commands in the Azure PowerShell tools.

-	Use `Get-AzureRmRoleDefinition` to list RBAC roles available for assignment and to inspect the operations to which they grant access.

-	Use `Get-AzureRmRoleAssignment` to list RBAC access assignments effective at the specified subscription or resource group or resource. Use the `ExpandPrincipalGroups` parameter to list access assignments to the specified user as well as to the groups of which the user is member. Use the `IncludeClassicAdministrators` parameter to also list classic Subscription Administrator and Co-Administrators.

-	Use `New-AzureRmRoleAssignment` to grant access to users, groups and applications.

-	Use `Remove-AzureRmRoleAssignment` to remove access.

See [Manage access using Azure PowerShell](role-based-access-control-manage-access-powershell.md) for more detailed examples of managing access using Azure PowerShell.

## Manage access using the Azure Command-Line Interface
Access can be managed used Azure RBAC commands in the Azure Command-Line Interface.

-	Use `azure role list` to list RBAC roles available for assignment. Use azure role show to inspect the operations to which they grant access.

-	Use `azure role assignment list` to list RBAC access assignments effective at the specified subscription or resource group or resource. Use the `expandPrincipalGroups` option to list access assignments to the specified user as well as to the groups of which the user is member. Use the  `includeClassicAdministrators` parameter to also list classic Subscription Administrator and Co-Administrators.

-	Use `azure role assignment create` to grant access to users, groups and applications.

-	Use `azure role assignment delete` to remove access.

See [Manage access using the Azure CLI](role-based-access-control-manage-access-azure-cli.md) for more detailed examples of managing access using the Azure CLI.

## Using the Access Change History Report
All access changes happening in your Azure subscriptions get logged in Azure events.

### Create a report with Azure PowerShell
To create a report of who granted/revoked what kind of access to/from whom on what scope within your Azure subscirptions use the following PowerShell command:

    `Get-AzureAuthorizationChangeLog`

### Create a report with Azure CLI
To create a report of who granted/revoked what kind of access to/from whom on what scope within your Azure subscirptions use the Azure command line interface (CLI) command:

    `azure authorization changelog`

> [AZURE.NOTE] Access changes can be queried for the past 90 days (in 15 day batches).

The following lists all access changes in the subscription for the past 7 days.

![](./media/role-based-access-control-configure/access-change-history.png)

### Export Access Change to a Spreadsheet
It is convenient to export access changes into a spreadsheet for review.

![](./media/role-based-access-control-configure/change-history-spreadsheet.png)

## Custom Roles in Azure RBAC
Create a custom role in Azure RBAC if none of the built-in roles meets your specific access need. Custom roles can be created using RBAC command-line tools in Azure PowerShell, and Azure Command-Line Interface. Just like built-in roles, custom roles can be assigned to users, groups, and applications at subscription, resource group, and resource scope.

Following is an example custom role definition that allows monitoring and restarting virtual machines:

```
{
  "Name": "Virtual Machine Operator",
  "Id": "cadb4a5a-4e7a-47be-84db-05cad13b6769",
  "IsCustom": true,
  "Description": "Can monitor and restart virtual machines.",
  "Actions": [
    "Microsoft.Storage/*/read",
    "Microsoft.Network/*/read",
    "Microsoft.Compute/*/read",
    "Microsoft.Compute/virtualMachines/start/action",
    "Microsoft.Compute/virtualMachines/restart/action",
    "Microsoft.Authorization/*/read",
    "Microsoft.Resources/subscriptions/resourceGroups/read",
    "Microsoft.Insights/alertRules/*",
    "Microsoft.Insights/diagnosticSettings/*",
    "Microsoft.Support/*"
  ],
  "NotActions": [

  ],
  "AssignableScopes": [
    "/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e",
    "/subscriptions/e91d47c4-76f3-4271-a796-21b4ecfe3624",
    "/subscriptions/34370e90-ac4a-4bf9-821f-85eeedeae1a2"
  ]
}
```
### Actions
The actions property of a custom role specifies the Azure operations to which the role grants access. It is a collection of operation strings that identify securable operations of Azure resource providers. Operation strings that contain wildcards (\*) grant access go all operations that match the operation string. For instance:

-	`*/read` grants access to read operations for all resource types of all Azure resource providers.
-	`Microsoft.Network/*/read` grants access to read operations for all resource types in the Microsoft.Network resource provider of Azure.
-	`Microsoft.Compute/virtualMachines/*` grants access to all operations of virtual machines and its child resource types.
-	`Microsoft.Web/sites/restart/Action` grants access to restart websites.

Use `Get-AzureRmProviderOperation` or `azure provider operations show` commands to list operations of Azure resource providers. You may also use these commands to verify that an operation string is valid, and to expand wildcard operation strings.

![](./media/role-based-access-control-configure/1-get-azurermprovideroperation-1.png)

![](./media/role-based-access-control-configure/1-azure-provider-operations-show.png)

### Not Actions
If the set of operations that you wish to allow is easily expressed by excluding specific operations rather than including all operations operations except than the ones you wish to exclude, then use the **NotActions** property of a custom role. The effective access granted by a custom role is computed by excluding the **NotActions** operations from the Actions operations.

Note that if a user is assigned a role that excludes an operation in **NotActions** and is assigned a second role that grants access to the same operation – the user will be allowed to perform that operation. **NotActions** is not a deny rule – it is simply a convenient way to create a set of allowed operations when specific operations need to be excluded.

### AssignableScopes
The **AssignableScopes** property of the custom role specifies the scopes (subscriptions, or resource groups, or resources) within which the custom role is available for assignment to users, groups, and applications. Using **AssignableScopes** you can make the custom role available for assignment in only the subscriptions or resource groups that require it, and not clutter user experience for the rest of the subscriptions or resource groups. **AssignableScopes** of a custom role also control who is allowed to view, update, and delete the role. Following are some valid assignable scopes:

-	“/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e”, “/subscriptions/e91d47c4-76f3-4271-a796-21b4ecfe3624”: makes the role available for assignment in two subscriptions.
-	“/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e”: makes the role available for assignment in a single subscription.
-	“/subscriptions/c276fc76-9cd4-44c9-99a7-4fd71546436e/resourceGroups/Network”: makes the role available for assignment only in the Network resource group.

### Custom Roles Access Control
The **AssignableScopes** property of the custom role dictates who can view, modify, and delete the role.

**Who can create a custom role?**
Custom role creation succeeds only if the user creating the role is allowed to create a custom role for all of the specified **AssignableScopes**. Custom role creation succeeds only if the user creating the role can perform `Microsoft.Authorization/roleDefinition/write operation` on all the **AssignableScopes** of the role. So, Owners (and User Access Administrators) of subscriptions, resource groups, and resources can create custom roles for use in those scopes.

**Who can modify a custom role?**
Users who are allowed to update custom roles for all **AssignableScopes** of a role can modify that custom role. Users that can perform `Microsoft.Authorization/roleDefinition/write` operation on all the **AssignableScopes** of a custom role can modify that custom role. For instance, if a custom role is assignable in two Azure subscriptions (i.e. It has two subscriptions in its **AssignableScopes** property) - a user must be Owner (or User Access Administrators) of both subscriptions, to be able to modify the custom role.

**Who can view custom roles that are available for assignment at a scope?**
Users who can perform the `Microsoft.Authorization/roleDefinition/read` operation at a scope can view the RBAC roles that are available for assignment at that scope. All built-in roles in Azure RBAC allow viewing of roles that are available for assignment.
