---
title: Organize your resources with Azure Management Groups - Azure | Microsoft Docs
description: Learn about the management groups and how to use them. 
author: rthorn17
manager: rithorn
editor: ''

ms.assetid: 482191ac-147e-4eb6-9655-c40c13846672
ms.service: billing
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 12/15/2017
ms.author: rithorn
---


# Organize your resources with Azure Management Groups 

If you have multiple subscriptions, you can organize them into containers called “management groups" to help you manage access, policy, and compliance across your subscriptions. As an example, you can apply policies to a management group that limit which resource types can be created. These policies inherit to all the resources contained under that management group. 

>![NOTE] This feature is currently in a Private Preview. Information about the public preview of Azure Management Groups is in progress. 

Management groups, along with your subscriptions, can be organized into a hierarchy. The structure shown is a sample representation of a management group hierarchy that can exist:

![hierarchy tree](media/billing-enterprise-mgmt-groups/mg-hierarchy.png)

A hierarchy tree can be created to support any number of scenarios an organizations might need support. An example scenario that is common for users with multiple subscriptions is the assignment of user accesses.  Linking subscriptions together under a management group and assigning access to the management group makes those accesses inherit to all the child resources (Subscriptions, Resource Groups, Resources). 

### Important facts about management groups
- 10,000 management groups can be supported in a single directory 
- A hierarchy tree can support up to six levels in depth 
- Each management group can only support one parent
- Each management group can have multiple children 
- Each directory has a root management group by default
    - This root management group can allow for policy to be applied at the global level
    - All resources fold up to the root management group.  If no separate parent group is defined, the subscription or management group's parent is the root management group. 
    - This root management group is special in that it cannot be moved or deleted
    - If there is no Root Management Group showing, it will be created automaticly when the first management group is created in the directory.  
- To remove a management group, no children can be linked to the management group

# PowerShell commands 
Management group command functions are only available through an API, but management groups are visible through the [Azure Portal](https://portal.azure.com).  Users can create, search, update, delete, and link other groups/ subscriptions to a management group through the API.  



## Create a management group
Any user within a directory can create a management group and they are made the owner of it.  

```powershell
Add-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Defines the ID of the group being created. This ID will be used by other commands to reference this group and it can not be edited later.
- [-DisplayName]: The name that is displayed within the UI for this group. This can be changed at anytime.
- [-ParentId]: This parameter is used while creating the group to link it as a child to another group.  The group listed here is the parent of the new group. 

### Example 1: Add new group
This example is to create a new management group with the ID of "Contoso." 

```powershell
C:\> Add-AzureRmManagementGroup -GroupName Contoso  
```

### Example 2: Add new group that has a different Display Name and be under a parent management group
This example shows the command to create a new management group with the ID of "newGroup" and have a display name of "Contoso IT." This management group is a child of the management group created in Example 1.  

```powershell
C:\> Add-AzureRmManagementGroup -GroupName newGroup -DisplayName "Contoso IT" -ParentId Contoso
```

## Update a management group or link two management groups 
A user with the role of "Owner" or "Contributor" can update a group.  The fields that can be modified are "DisplayName" and "ParentId", where ParentId links the two groups together.    

Note: "ParentId" is not editable on the root management group. 

```powershell
Update-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: The ID of the management group to be updated. 
- [-DisplayName]: The name that is displayed within the UI.  This property can be updated. 
- [-ParentId]: This parameter can be updated to link this group to a new parent group.  The group listed here is the new parent of the updated management group.   
 
### Example 3: Update a management group with a new display name
This example shows how to update an existing management group with the "GroupName" of "Contoso" to have a display name of "Contoso Group." After this update, the group shows the new display name in the Azure portal.  

```powershell
C:\> Update-AzureRmManagementGroup -GroupName Contoso -DisplayName "Contoso Group" 
```    
 
### Example 4: Update management group parent 
In this example, it shows how to update an existing management group with the name of "ContosoMarketing" to have a parent of "Contoso."

```powershell
C:\> Update-AzureRmManagementGroup -GroupName ContosoMarketing -ParentName Contoso 
```  

## Delete a management group
This command is used to remove a management group from a hierarchy.  This command can only be used if the particular group has no children.  If the group does have child items, use "Update-AzureRmManagementGroup" or "Remove-AzureRMManagementGroupSubscription" to remove all children.  

```powershell
Remove-AzureRmManagementGroup
    [-GroupName]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Parameter required to identify what group to remove from the hierarchy. 
 
### Example 5: Delete a management group
This example shows how to remove the management group "ContosoMarketing" from the hierarchy.  This management group does not have any children in the hierarchy so it can be deleted. 

```powershell
Remove-AzureRmManagementGroup -GroupName ContosoMarketing
```

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
This example shows how to view the one management group, Contoso, and its children.  This command only returns the immediate children.  

```powershell
Get-AzureRmManagementGroups -GroupName Contoso -Expand
```

### Example 9: View all groups under a management group
```powershell
Get-AzureRmManagementGroup -GroupName ContosoMarketing -Recurse
``` 

## Link subscriptions to management groups
The main goal of creating management groups is to group subscriptions together.  The following command is used to link a subscription to a management group. Once a subscription is linked, the subscription inherits all user accesses and policies that were assigned to the management group.  

```powershell
Add-AzureRmManagementGroupSubscription
    [-GroupName]<string>
    [-SubscriptionId]<guid>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```  
- [-GroupName]: This required field identifies the management group that becomes the parent of the subscription 
- [-SubscriptionId]: The required field that identifies the subscription that becomes the child of the management group
 
### Example 10: Connecting a subscription and a management group
There are two pieces of information needed to link a subscription and a management group.  Here the group Contoso is linked with a Subscription with a GUID of 12345678-1234-1234-1234-123456789012.

```powershell
Add-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

## Remove the subscription link to a management group
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

### Example 11: Removing a link between a subscription and a management group
Almost the same command syntax as the Add-, to remove the link between and subscription and the management group use the following command: 

```powershell
Remove-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

## Policy management
Resource Manager enables you to create customized policies for managing your resources. With management groups, polices can be assigned at any level in the hierarchy and the resources inherit those policies.  [Learn more](https://go.microsoft.com/fwlink/?linkid=858942)

> [!Note]
> Policy is not enforced across directories. 


