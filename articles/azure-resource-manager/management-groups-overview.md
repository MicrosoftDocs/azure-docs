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
- The root management group is given the Directory ID number as the name by default. The display name can be updated at any time to show different within the Azure portal.  
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
Any user within a directory can create a management group and they are made the owner of that management group. A management group created under another management group inherits the policy and accesses that are assigned from any parent of the hierarchy.  

# [PowerShell](#tab/powershell)
Following is the PowerShell cmdlet and its variables. 

```powershell
Add-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Defines the identifier of the group being created. This identifier is used by other commands to reference this group and it cannot be edited later.
- [-DisplayName]: The name that is displayed within the UI for this group. The Display Name can be changed at anytime.
- [-ParentId]: This parameter is used while creating the group to link it as a child to another group. The group listed here is the parent of the new group. 

# [Portal](#tab/portal)

Within the portal, there are two locations to create a new management group. 

1. At the top of the management group main page, you can find the command "New management Group." This option opens the menu to fill in the fields needed to create the management group. When you create a management group here, it is automatically made a child of the Root management group. 
<insert image>

- Management Group ID: This identifier is the directory unique identifier that is used to submit commands on this management group. This identifier is not editable after creation as it is used throughout the Azure system. 
- Management Group Display Name: This field is the Name that is displayed within the Azure portal. A separate display name is an optional field when creating the management group and can be changed at any time. 
- Management Group Parent: This field is showing you where the group is being created under. 

2. On the "Children" section of the management group detail page, you have the option to create a new management group. The menu looks the same as the "New management group" option from the main blade. The only difference with this "New management group" option is the new group is placed as a child of the current management group you are viewing.  

---

### Example 1: Add new management group
This example is to create a new management group with the identifier of "Contoso." 

# [PowerShell](#tab/powershell)
Use the following command to create the group with identifier of "Contoso" in PowerShell 

```powershell
C:\> Add-AzureRmManagementGroup -GroupName Contoso  
```

# [Portal](#tab/portal)

- Select the Management Groups Service on the left navigation 
[image]
- On the main page, select "New Management group." 
[image]
- Fill in the management group ID field with "Contoso."  
- Select the save button at the bottom of the menu

You see the new group show in the list

---

### Example 2: Add new group that has a different Display Name and is under a parent management group
This example shows the command to create a new management group with the identifier of "newGroup" and have a display name of "Contoso IT." This management group is a child of the management group created in Example 1.  

# [PowerShell](#tab/powershell)

```powershell
C:\> Add-AzureRmManagementGroup -GroupName newGroup -DisplayName "Contoso IT" -ParentId Contoso
```

# [Portal](#tab/portal)
- Select the Management Groups Service on the left navigation 
[image]
- On the main page, select "New Management group." 
[image]
- Fill in the management group ID field with "newGroup." 
- Fill in the management group display name field with "Contoso IT" 
- Select the save button at the bottom of the menu

You see the new group show in the list
---
## Change the name of a management group 
A user with the role of "Owner" or "Contributor" can change the display name of the management group. This name is shown within the Azure portal.  


# [PowerShell](#tab/powershell)

PowerShell gives you the ability to change the name or the ParentID within the same command. The ParentId is not editable on the Root management group. 

```powershell
Update-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: The identifier of the management group to be updated. 
- [-DisplayName]: The name that is displayed within the UI. This property can be updated. 
- [-ParentId]: This parameter can be updated to link this group to a new parent group. The group listed here is the new parent of the updated management group.   
 
# [Portal](#tab/portal)
The ability to update the display name on a management group is available on the detail screen.   
[image]

 ---

### Example 3: Update a management group with a new display name
This example shows how to update an existing management group with the "GroupName" of "Contoso" to have a display name of "Contoso Group." After this update, the group shows the new display name in the Azure portal.  

# [PowerShell](#tab/powershell)

```powershell
C:\> Update-AzureRmManagementGroup -GroupName Contoso -DisplayName "Contoso Group" 
```    
 
# [Portal](#tab/portal)
To rename a management group: 
- Select the Management Groups Service on the left navigation. 
[image]
- Select the management group you would like to rename. 
- Select the "Rename" option at the top of the page
[image]
- When the menu opens, enter the new name you would like to have displayed. 
- Select save. 

The hierarchy list updates to show the new display name. 

--- 

## Delete a management group
Any management group can be deleted from a hierarchy that meets these requirements:
- There are no child management groups or subscriptions under the management group.
- You have write permissions on the management group that include the "Owner" or "Contributor" roles. These permissions can be directly assigned or inherited permissions.  

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
The ability to delete a management group is available on the detail blade of a management group. The disabled delete icon is when you do not have the correct permissions or there are children of the management group. 

[image]

---
 
### Example 5: Delete a management group
This example shows how to remove the management group "ContosoMarketing" from the hierarchy. This management group does not have any children in the hierarchy so it can be deleted. 

# [Powershell](#tab/powershell)

```powershell
Remove-AzureRmManagementGroup -GroupName ContosoMarketing
```
# [Portal](#tab/portal)
To delete a management group: 
- Select the Management Groups Service on the left navigation. 
[image]
- Select the management group you would like to delete. 
- Select the "delete" option at the top of the page. 
    - If the icon is disabled, hovering your mouse selector over the icon will shoe you the reason.  
[image]
- There is a window that opens confirming you want to delete the management group. 
- Select "Okay." 

The hierarchy list updates showing the group has been deleted.

---

## View management groups
There are multiple ways to view management groups within Azure. The following are the PowerShell and Portal methods of viewing. 

# [Powershell](#tab/powershell)
Within PowerShell, you can use the Get command to retrieve all groups or details on an individual management groups. 

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

# [Portal](#tab/portal)
Within the Azure portal, there are two ways to view management groups. There is the main page that shows the hierarchy in a tree form and then there is a detail page for each management group.  

Hierarchy tree view: 
[image]

Detail view:
[image]

---

### Example 6: Show all management groups 
This example shows how to see all the groups that are under the tenant. 

# [Powershell](#tab/powershell)

```powershell
Get-AzureRmManagementGroup
```

# [Portal](#tab/portal)

- Select the Management Groups Service on the left navigation. 
[image]
- The Management Group hierarchy blade loads where all groups are displayed.   


---

### Example 7: View one management group
Use the following processes to view a management group with the name of Contoso.  

# [Powershell](#tab/powershell)

```powershell
Get-AzureRmManagementGroup -GroupName Contoso
```

# [Portal](#tab/portal)
- Select the Management Groups Service on the left navigation. 
[image]
- The Management Group hierarchy blade loads where all groups are displayed.
- Select the management group "Contoso" 

---

### Example 8: View a group and its children 
This example shows how to view the one management group, Contoso, and its children. This command only returns the immediate children.  

# [Powershell](#tab/powershell)

```powershell
Get-AzureRmManagementGroup -GroupName Contoso -Expand
```

# [Portal](#tab/portal)
- Select the Management Groups Service on the left navigation. 
[image]
- The Management Group hierarchy blade loads where all groups are displayed.
- Select the management group "Contoso"
- On the detail blade, you see all the children listed

---

### Example 9: View all groups under a management group
To see all groups in PowerShell, use the following command

```powershell
Get-AzureRmManagementGroup -GroupName ContosoMarketing -Recurse

``` 

## Moving subscriptions with management groups
The main goal of creating management groups is to group subscriptions together. The following features are used to associate a subscription to a management group. Only management groups and subscriptions can be made children of a management group.  

A subscription that moves to a management group inherits all user accesses and policies from any parent management group in the hierarchy. To move the subscription, there are a couple permissions that you must have: 
- "Owner" role on the child subscription.
- "Owner" or "Contributor" role on the new parent management group. 
- "Owner" or "Contributor" role on the old parent management group.

### Moving a subscription to a management group   
There are a couple easy ways to connect a subscription to a management group.    

# [Powershell](#tab/powershell)

```powershell
Add-AzureRmManagementGroupSubscription
    [-GroupName]<string>
    [-SubscriptionId]<guid>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```  
- [-GroupName]: This required field identifies the management group that becomes the parent of the subscription 
- [-SubscriptionId]: The required field that identifies the subscription that becomes the child of the management group

# [Portal](#tab/portal)
There are a couple different ways to move a subscription to a management group within the Azure portal. 

The first way is on the management group's detail blade. Here you are able to add an existing subscription to the management group

[image]

The second way is on the Subscription Blade. You select the "Move" action to move this subscription to a new parent management group.  

[image] 


### Example 10: Connecting a subscription and a management group
Here to group Contoso with the Subscription with a GUID of 12345678-1234-1234-1234-123456789012.

# [Powershell](#tab/powershell)

There are two pieces of information needed to link a subscription and a management group. Here the group Contoso is linked with a Subscription with a GUID of 12345678-1234-1234-1234-123456789012.

```powershell
Add-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

# [Portal](#tab/portal)

 Select the Management Groups Service on the left navigation. 
[image]
- Select the management group "Contoso." 
- On the detail page, select "Children" on the left menu.  
[image]
- At the top of the page, you select "Move."
- In the menu that opened, select the Type of the item moving which in this example is "Subscription"  
- Select the subscription in the list with the ID 12345678-1234-1234-1234-123456789012
- Select "Save"

You see the list update with the subscription

The alternative way is to navigate to the subscription and change the parent
- Select the Subscriptions menu on the left 
[image]
- Choose the subscription you would like to move 
- On the detail blade, select "Move" 
- In the menu that opened, the first two fields are already populated for you. 
- Select the new parent of the subscription. For this example, select "Contoso"
- Select "Save" 

After you select save the Parent listed updated to Contoso

---

### Moving a subscription from a management group
Just as it is easy to move a subscription to a management group, you can move a subscription out from a management group. There are two options to move out a subscription. 

There is the pull method where you go to the other management group and add subscription. 
The other option that is more of a push pattern where you go to the subscription and change the parent.  

A subscription that moves to a management group inherits all user accesses and policies from any parent management group in the hierarchy. To move the subscription, there are a couple permissions that you must have: 
- "Owner" role on the child subscription.
- "Owner" or "Contributor" role on the new parent management group. 
- "Owner" or "Contributor" role on the old parent management group.

#[Powershell](#tab/powershell)
Use the following command to remove the link between the management group and a subscription. 

```powershell
Remove-AzureRmManagementGroupSubscription
    [-GroupName]<string>
    [-SubscriptionId]<guid>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: This required field identifies the management group that is the current parent. 
- [-SubscriptionId]: The required field that identifies the subscription that is currently linked to a management group to be unlinked.

#[Portal](#tab/portal)
Within the Azure portal you can move a subscription to a new parent management group a couple different pages. The image shown here is on the main management group page. 

There are a couple different ways to move a subscription to a management group within the Azure portal. 

The first way is on the management group's detail blade. Here you are able to add an existing subscription to the management group

[image]

The second way is on the Subscription Blade. You select the "Move" action to move this subscription to a new parent management group.  

[image]


---

### Example 11: Removing a link between a subscription and a management group
Following is how to remove the grouping of Contoso and a Subscription with a GUID of 12345678-1234-1234-1234-123456789012.

#[Powershell](#tab/powershell)
Almost the same command syntax as the Add-, to remove the link between and subscription and the management group use the following command: 

```powershell
Remove-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

#[Portal](#tab/portal)

 Select the Management Groups Service on the left navigation. 
[image]
- Select the management group "Contoso." 
- On the detail page, select "Children" on the left menu.  
[image]
- Select the ellipse at the end of the row for the subscription in the list with the ID 12345678-1234-1234-1234-123456789012

[image]
- On the menu that opens, select the parent management group.  
- Select "Save"

You see the list update with the subscription

The alternative way is to navigate to the subscription and change the parent
- Select the Subscriptions menu on the left 
[image]
- Choose the subscription you would like to move 
- On the detail blade, select "Move" 
- In the menu that opened, the first two fields are already populated for you. 
- Select the new parent of the subscription. For this example, select "Contoso"
- Select "Save" 

After you select save the Parent listed updated to Contoso

---

### Moving a management group to a different management group   
There are a couple easy ways to connect two management groups.    

# [Powershell](#tab/powershell)

```powershell
Update-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: The identifier of the management group to be updated. 
- [-DisplayName]: The name that is displayed within the UI. This property can be updated. 
- [-ParentId]: This parameter can be updated to link this group to a new parent group. The group listed here is the new parent of the updated management group.   

# [Portal](#tab/portal)
There are a couple different ways to move a management group to a different management group within the Azure portal. 

The first way is on the management group's detail blade. Here you are able to add an existing management group.

[image]

The second way is on the management group detail blade. You select the "Move" action to move this management group to a new parent management group.  

[image] 


### Example 12: Connecting a management group to another management group
In this example, it shows how to update an existing management group with the name of "ContosoMarketing" to have a parent of "Contoso."

# [Powershell](#tab/powershell)

```powershell
C:\> Update-AzureRmManagementGroup -GroupName ContosoMarketing -ParentName Contoso 
```  

# [Portal](#tab/portal)

 Select the management groups service on the left navigation. 
[image]
- Select the management group "Contoso." 
- On the detail page, select "Children" on the left menu.  
[image]
- At the top of the page, you select "Move."
- In the menu that opened, select the Type of the item moving which in this example is "Management Group."  
- Select the management group with the name "Contoso Marketing."
- Select "Save"

You see the list update with the management group

The alternative way is to navigate to the management group and change the parent
- Select the management group service menu on the left 
[image]
- Choose the management group you would like to move 
- On the detail blade, select "Move" 
- In the menu that opened, the first two fields are already populated for you. 
- Select the new parent of the management group. For this example, select "Contoso"
- Select "Save" 

After you select save the Parent listed updated to Contoso

---

### Moving a management group from a management group
Moving a management group to be the child of a different management group is a simple action.   

The first option is to go to the other management group and add the new management group. 
the second option is where you go to the management group detail page and change the parent.  

A management group that moves to a different management group inherits all user accesses and policies from any parent management group in the hierarchy. To move a management group, there are a couple permissions that you must have: 
- "Owner" role on the child management group.
- "Owner" or "Contributor" role on the new parent management group. 
- "Owner" or "Contributor" role on the old parent management group.

# [Powershell](#tab/powershell)
Use the following command to remove the link between two management groups. 

```powershell
Update-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: The identifier of the management group to be updated. 
- [-DisplayName]: The name that is displayed within the UI. This property can be updated. 
- [-ParentId]: This parameter can be updated to link this group to a new parent group. The group listed here is the new parent of the updated management group.   

# [Portal](#tab/portal)

There are a couple different ways to move a management group to a different management group within the Azure portal. 

The first way is on the management group's detail blade. Here you are able to add an existing management group.

[image]

The second way is on the management group detail blade. You select the "Move" action to move this management group to a new parent management group.  

[image] 


---

### Example 13: Removing a link between a two management groups 
Following is how to remove the link between two management groups. Parent group is "Contoso" and the child is "Contoso Marketing" 

# [Powershell](#tab/powershell)
Here the update moves the Contoso Marketing group to the root group

```powershell
C:\> Update-AzureRmManagementGroup -GroupName ContosoMarketing -ParentName Root 
```  

# [Portal](#tab/portal)

 Select the management groups service on the left navigation. 
[image]
- Select the management group "Contoso Marketing." 
- On the detail page, select "Children" on the left menu.  
[image]
- At the top of the page, you select "Move."
- In the menu that opened, select the Type of the item moving which in this example is "Management Group."  
- Select the management group with the name "Root"
- Select "Save"

You see the list update with the management group

The alternative way is to navigate to the management group and change the parent
- Select the management group service menu on the left 
[image]
- Choose the management group you would like to move 
- On the detail blade, select "Move" 
- In the menu that opened, the first two fields are already populated for you. 
- Select the new parent of the management group. For this example, select "Root"
- Select "Save" 

After you select save the Parent listed updated to Contoso

---