---
title: Organize your resources with Azure Management Groups - Azure | Microsoft Docs
description: Learn about the management groups and how to use them. 
author: rthorn17
manager: rithorn
editor: ''

ms.assetid: 482191ac-147e-4eb6-9655-c40c13846672
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 01/26/2018
ms.author: rithorn
---


# Organize your resources with Azure Management Groups 

If you have multiple subscriptions, you can organize them into containers called “management groups" to help you manage access, policy, and compliance across your subscriptions. These containers give you enterprise grade management at scale no matter what type of subscriptions you might have.  

As an example, you can apply policies to a management group that limit the regions available for virtual machine (VM) creation. This policy would be applied to all management groups, subscriptions, and resources under that management group by only allowing VMs to be created in that region.   

>![NOTE] Management group feature is being introduced as a Public Preview in February 2018.

Azure Customers can build a flexible structure of management groups and subscriptions to organize their resources into a hierarchy for unified policy and access management. 
The structure shown is a sample of a management group hierarchy that can exist:

![hierarchy tree](media/management-groups/MG_overview.png)

Change is always constant and customers have the need to always be updating their hierarchy. To help with these frequent changes, you are able to easily move management groups and subscriptions to change the hierarchy. You are able to move whole branches or individual resources around in the hierarchy to keep it updated. 

For example, another common scenario for customers is the repetitive work needed to apply resource accesses to each subscription they manage. With management groups, the customer can simplify their process by only needing to apply an RBAC role for a person to one management group that has all the subscriptions under it. With the access control assigned on the management group, the management group is a single management location for the RBAC role and its inheritance to all the child resources.    

### Important facts about management groups
- 10,000 management groups can be supported in a single directory 
- A hierarchy tree can support up to six levels in-depth
    -This does not include the Root level or the subscription level
- Each management group can only support one parent
- Each management group can have multiple children 
- To remove a management group, no children can be linked to the management group


## Root management group for each directory

Each directory is given one "Root" management group that allows for global policies to be applied. The Directory Administrator needs to escalate themselves to be the owner of this root group initially. Once the administrator is the owner of the group, they can assign any RBAC roles to other people so that they can manage the hierarchy.  

### Important facts about the Root management Group
- The root management group is given the Directory ID as the name by default. The display name can be updated at any time to show different within the Azure portal.  
- All subscriptions and management groups can fold up to the one root management group within the directory.  
    - It is recommended to have all items in the directory fold up to the Root management group.  
- This root management group is special in that it cannot be moved or deleted unlike other management groups. 
- All new management groups have their parent group defaulted to the root management group when created.
    - During the Public Preview, new subscriptions are not automatically default to the Root management group.        
  
## Management Group Access

Azure Management Groups supports [Azure Role-Based Access Control(RBAC)](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is) for all resource accesses and role definitions. These permissions are inherited to child resources that exist in the hierarchy.   

While any [built-in RBAC role](https://docs.microsoft.com/en-us/azure/active-directory/role-based-access-control-what-is#built-in-roles) can be assigned to a management group, there are four roles that are commonly used: 
- **Owner** has full access to all resources including the right to delegate access to others. 
- **Contributor** can create and manage all types of Azure resources but can't grant access to others.
- **Resource Policy Contributor** can create and manage policies in the directory on the resources.     
- **Reader** can view existing Azure resources.

>![Note] For the public preview, custom RBAC roles are not supported. 

# How-to guide

## Create a management group
Any user within a directory can create a management group and they are made the owner of that management group. When a management group is created and made a child of another management group, it will inherit the policy and accesses that are assigned on any parent management group.  

# [PowerShell](#tab/powershell)
Below is the PowerShell cmdlet and its variables. 

```powershell
Add-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Defines the ID of the group being created. This ID is used by other commands to reference this group and it cannot be edited later.
- [-DisplayName]: The name that is displayed within the UI for this group. The Display Name can be changed at anytime.
- [-ParentId]: This parameter is used while creating the group to link it as a child to another group. The group listed here is the parent of the new group. 

# [Portal](#tab/portal)

Within the portal there are two locations to create a new management group. 

1. At the top of the management group main page you can find the command "New management Group." This option opens the menu to fill in the fields needed to create the managemetn group. When you create a management group here, it is automaticlly made a child of the Root management group. 
<insert image>

- Management Group ID: This is the direcory unique identifier that is be used to submit commands on this management group.  This ID is not editable after creation as it is used throughout the Azure system. 
- Management Group Display Name: This field is the Name that is be dsipalyed within the Azure portal.  This is an optional field when creating the management group and can be changed at any time. 
- Management Group Parent: This field is showing you where the group is being created under. 

2. On the management group detail page, under the "Children" page on the left resource menu, you have the option to create a new management group here also.  The menu will look the same as the "New management group" option from the main blade.  The only differnece with this "New management group" option is the new group is placed as a child of the current management group you are viewing.  

---

### Example 1: Add new management group
This example is to create a new management group with the ID of "Contoso." 

# [PowerShell](#tab/powershell)
Use the following command to create the group with ID of "Contoso" in PowerShell 

```powershell
C:\> Add-AzureRmManagementGroup -GroupName Contoso  
```

# [Portal](#tab/portal)

- Select the Management Groups Service on the left navigation 
[image]
- On the main page, select "New Managment group." 
[image]
- Fill in the management group ID field with "Contoso".  
- Select the save button at the bottom of the menu

You will see the new group show in the list

---

### Example 2: Add new group that has a different Display Name and is under a parent management group
This example shows the command to create a new management group with the ID of "newGroup" and have a display name of "Contoso IT." This management group is a child of the management group created in Example 1.  

# [PowerShell](#tab/powershell)

```powershell
C:\> Add-AzureRmManagementGroup -GroupName newGroup -DisplayName "Contoso IT" -ParentId Contoso
```

# [Portal](#tab/portal)
- Select the Management Groups Service on the left navigation 
[image]
- On the main page, select "New Managment group." 
[image]
- Fill in the management group ID field with "newGroup". 
- Fill in the management group display name field with "Contoso IT" 
- Select the save button at the bottom of the menu

You will see the new group show in the list
---
## Change the name of a management group 
A user with the role of "Owner" or "Contributor" can change the display name of the management group.  This name is shown within the Azure portal.  


# [PowerShell](#tab/powershell)

PowerShell gives the you the ability to change the name or the ParentID within the same command. The ParentId is not editable on the Root managmeent group. 

```powershell
Update-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: The ID of the management group to be updated. 
- [-DisplayName]: The name that is displayed within the UI. This property can be updated. 
- [-ParentId]: This parameter can be updated to link this group to a new parent group. The group listed here is the new parent of the updated management group.   
 
# [Portal](#tab/portal)
The abilty to update the diplay name on a management group is available on the detail screen.   
[image]

 ---

### Example 3: Update a management group with a new display name
This example shows how to update an existing management group with the "GroupName" of "Contoso" to have a display name of "Contoso Group." After this update, the group shows the new display name in the Azure portal.  

# [PowerShell](#tab/powershell)

```powershell
C:\> Update-AzureRmManagementGroup -GroupName Contoso -DisplayName "Contoso Group" 
```    
 
# [Portal](#tab/portal)
To rename a managment group: 
- Select the Management Groups Service on the left navigation. 
[image]
- Select the management group you would like to rename. 
- Select the "Rename" option at the top of the page
[image]
- When the menu opens, enter the new name you would like to have displayed. 
- Select save. 

The hierarhcy list will update to show the new display name. 

--- 

## Delete a management group
Any management group can be deleted from the hierarchy that meet these requirments:
- There are no child management groups or subscriptions under that managmenet group.
- You have write permissions on the managmeent group.  These can be directly assigned or inherited permissions.  

# [PowerShell](#tab/powershell)
This command is used to remove a management group from a hierarchy. This command can only be used if the particular group has no children. If the group does have child items, use "Update-AzureRmManagementGroup" or "Remove-AzureRMManagementGroupSubscription" to remove all children. 

```powershell
Remove-AzureRmManagementGroup
    [-GroupName]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Parameter required to identify what group to remove from the hierarchy. 

# [Portal](#tab/portal)
The abiltiy to delete a management group is availabe on the detail blade of a maangemetn group. The delete icon will be disabled if you do not have the correct permissions or there are children of the managmeent group. 

[image]

---
 
### Example 5: Delete a management group
This example shows how to remove the management group "ContosoMarketing" from the hierarchy. This management group does not have any children in the hierarchy so it can be deleted. 

# [Powershell](#tab/powershell)

```powershell
Remove-AzureRmManagementGroup -GroupName ContosoMarketing
```
# [Portal](#tab/portal)
To delete a managment group: 
- Select the Management Groups Service on the left navigation. 
[image]
- Select the management group you would like to delete. 
- Select the "delete" option at the top of the page. 
    - If the icon is disabled, hovering your mouse selector over hte icon will shoe you the reason.  
[image]
- There will be a window that opens confriming you want to delete the management group. 
- Select "Okay". 

The hierarhcy list will update showing the group has been deleted.

---

## View management groups
To view particular a management group or to list all management groups within the directory. 

```powershell
Get-AzureRmManagementGroup
    [-GroupName]<string>
    [-DefaultProfile]<IAzureContextContainer>
    [-Expand]
    [-Recurse]
    [<CommonParameters>]
```
- [-GroupName]: Use to select a particular management group.
- [-Expand]: Expand parameter is used when at a management group scope to view all children.
- [-Recurse]: Recurse is used when at a management group scope to return the entire hierarchy under that node.   

### Example 6: Show all management groups 
This example shows how to see all the groups that are under the tenant. 

```powershell
Get-AzureRmManagementGroup
```

### Example 7: View one management group
Use the following command to view on management group with the name of Contoso.  

```powershell
Get-AzureRmManagementGroup -GroupName Contoso
```

### Example 8: View a group and its children 
This example shows how to view the one management group, Contoso, and its children. This command only returns the immediate children.  

```powershell
Get-AzureRmManagementGroups -GroupName Contoso -Expand
```

### Example 9: View all groups under a management group
```powershell
Get-AzureRmManagementGroup -GroupName ContosoMarketing -Recurse
``` 