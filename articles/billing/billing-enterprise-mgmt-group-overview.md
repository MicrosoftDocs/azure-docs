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
ms.date: 12/07/2017
ms.author: rithorn
---


# Organize your resources with Azure Management Groups 

If you have multiple subscriptions, you can organize them into containers called “management groups" to help you manage access, policy, and compliance across your subscriptions. As an example, you can apply policies to a management group that limit which resource types can be created. These policies inherit to all the resources contained under that management group. 

>![NOTE] This feature is currently in a Private Preview. More information will be released soon on the public preview of Azure Management Groups. 

Management groups, along with your subscriptions, can be organized into a hierarchy. The structure shown is a sample representation of a management group hierarchy that can exist:

![hierarchy tree](media/billing-enterprise-mgmt-groups/mg-hierarchy.png)

A hierarchy tree can be created to support any number of scenarios that might be needed for your environment. An example scenario that is common for users with multiple subscriptions is the assignment of user accesses.  Linking subscriptions together under a management group and assigning access to the group makes those accesses inherit to all the child resources (Subscriptions, Resource Groups, Resources). 

### Important facts about management groups
- 10,000 management groups can be supported in a single directory 
- A hierarchy tree can support up to six levels in depth 
- Each management group can only support one parent
- Each management group can have multiple children 
- Each directory has a root management group by default
    - This root management group can allow for policy to be applied at the global level
    - All resources fold up to the root management group.  If no seperate parent group is defined the subscription or management groupt will have its parant be the root management group. 
    - This root management group is special in that it can not be moved or deleted
- To remove a management group, no children can be linked to the management group

# API commands 
Management group command functions are only available through an API, but management groups are visible through the [Azure Portal](http://).  Users can create, search, update, delete, and link other groups/ subscriptions to a management group through the API.  


## Create a management group
Any user within a directory can create a management group. 

```powershell
Add-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Defines the name of the group and also the ID of the group being created. 
- [-DisplayName]: The name that will be displayed within the UI for this group. 
- [-ParentId]: This parameter is used while creating the group to link it as a child to another group.  The group listed here will be the parent of the new group. 

### Example 1: Add new group
This example is to create a new management with the name of "Contoso". 

```powershell
C:\> Add-AzureRmManagementGroup -GroupName Contoso  
```

### Example 2: Add new group that will have a different Display Name and be under a parent management group
This example will show the command to create a new management group with the ID of "newGroup" and have a display name of "Contoso IT". This management group will also be a child of the management group created in Example 1.  

```powershell
C:\> Add-AzureRmManagementGroup -GroupName newGroup -DisplayName "Contoso IT" -ParentId Contoso
```

## Update a management group or link two management groups 
A user with the role of "Owner" or "Contributor" can update a group.  The fields that can be modified are "DisplayName" and "ParentId", where ParentId will link the two groups together.    

[!note]"ParentId" is not editiable on the root management group. 

```powershell
Update-AzureRmManagementGroup
    [-GroupName]<string>
    [-DisplayName]<string>
    [-ParentId]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: The ID of the management group to be updated. 
- [-DisplayName]: The name that will be displayed within the UI.  This properity can be updated. 
- [-ParentId]: This parameter can be updated to link this group to a new parent group.  The group listed here will be the parent of this updated management group.   
### Example 3: Update a management group with a new display name
Here we are going to update an exisiting management with the "GroupName" of "Contoso" to have a display name of "Contoso Group". After this update the group will show the new display name in the Azure Portal.  

```powershell
C:\> Update-AzureRmManagementGroup -GroupName Contoso -DisplayName "Contoso Group" 
```    
 
### Example 4: Update a management group to have a new parent
In this example we update an existing management group with the name of "ContosoMarketing" to have a parent of "Contoso".

```powershell
C:\> Update-AzureRmManagementGroup -GroupName ContosoMarketing -ParentName Contoso 
```  

## Delete a management group
This command is used to remove a management group from a hierarhcy.  This command can only be used if the particual group has no children.  If the group does have child items, use "Update-AzureRmManagementGroup" or "Remove-AzureRMManagementGroupSubscription" to remove all children.  

```powershell
Remove-AzureRmManagementGroup
    [-GroupName]<string>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```
- [-GroupName]: Parameter required to identify what group to remove from the hierarhcy. 

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
- [-Recurse]: Recurse is used when at a management group scope to return the entire hierarhcy under that node.   


## Link subscriptions to management groups
The main goal of creating management groups is to group subscriptions together.  The following command is used to link a subscription to a management group. Once a subscription is linked, the subscription will inherit all user accesses and policies that were assigned to the management group.  

```powershell
Add-AzureRmManagementGroupSubscription
    [-GroupName]<string>
    [-SubscriptionId]<guid>
    [-Defaultprofile]<IAzureContextContainer>
    [<CommonParameters>]
```  
- [-GroupName]: This required field identifies the management group that becomes the parent of the subscription 
- [-SubscriptionId]: The required field that idenitifies the subscription that becomes the child of the management group

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
- [-SubscriptionId]: The required field that idenitifies the subscription that is currently linked to a management group to be un-linked.



## Policy management
Resource Manager enables you to create customized policies for managing your resources. With management groups, polices can be assigned at any level in the hierarchy and the resources inherit those policies.  [Learn more](https://go.microsoft.com/fwlink/?linkid=858942)

> [!Note]
> Policy is not enforced across directories. 


