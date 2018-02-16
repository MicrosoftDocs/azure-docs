---
title: How to change, delete, or manage your management groups - Azure | Microsoft Docs
description: Learn how to maintain and update your management group hierarchy. 
author: rthorn17
manager: rithorn
editor: ''

ms.assetid:
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 2/14/2018
ms.author: rithorn
---


# Manage your resources with management groups 
[Management groups](management-groups-overview.md) are containers that help you manage access, policy, and compliance across multiple subscriptions. You can change, delete, and manage these containers to have hierarchies that can be used with [Azure Policy](../azure-policy/azure-policy-introduction.md) and [Azure Role Based Access Controls (RBAC)](../active-directory/role-based-access-control-what-is.md).

The management group feature is available in a public preview. To start using management groups, login to the [Azure portal](https://portal.azure.com) or  you can use [Azure PowerShell](https://github.com/Azure/azure-powershell#microsoft-azure-powershell), [command-line tool](/cli/azure/install-azure-cli?view=azure-cli-latest), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview) to manage your management groups.

To make changes to a management group, you must have an ["Owner" or "Contributor" role](../active-directory/role-based-access-control-what-is.md) on the management group. To see what permissions you have, view the IAM page on the management group you are looking to change.  

## Change the name of a management group 

# [Portal](#tab/portal)

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups**  
3. Select the management group you would like to rename. 
4. Select the **Rename group** option at the top of the page. 

    ![Rename Group](media/management-groups/detail_action_small.png)
5. When the menu opens, enter the new name you would like to have displayed.

    ![Rename Group](media/management-groups/rename_context.png) 
4. Select **Save**. 

# [PowerShell](#tab/powershell)

To update the display name use **Update-AzureRmManagementGroup**. For example, to change a management groups name from "Contoso IT" to "Contoso Group", you run the following command: 

```azurepowershell-inetractive
C:\> Update-AzureRmManagementGroup -GroupName ContosoIt -DisplayName "Contoso Group"  
``` 
  
---
 
## Delete a management group
To delete a management group, the following requirements must be met:
1. There are no child management groups or subscriptions under the management group. 
    - To move a subscription out of a management group, see the [Move subscription to another managemnt group](#Move-subscriptions-in-the-hierarchy) section. 
    - To move a management group to another management group, see the [Move management groups in the hierarchy](#Move-management-groups-in-the-hierarchy) section. 
2. You have write permissions on the management group (["Owner" or "Contributor" role](../active-directory/role-based-access-control-what-is.md)) on the management group. To see what permissions you have, view the IAM page on the management group you are looking to change.  

# [Portal](#tab/portal)

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups**  
3. Select the management group you would like to delete. 
    
    ![delete Group](media/management-groups/delete.png)
4. Select **Delete**. 
    - If the icon is disabled, hovering your mouse selector over the icon shows you the reason. 
5. There is a window that opens confirming you want to delete the management group. 

    ![delete Group](media/management-groups/delete_confirm.png) 
6. Select **Yes** 


# [PowerShell](#tab/powershell)

Use the **Remove-AzureRmManagementGroup** command within PowerShell to delete management groups.  

```azurepowershell-interactive
Remove-AzureRmManagementGroup -GroupName <YourGroupName>
```
---

## View management groups
You can view any management group you have a direct or inherited RBAC role on.  

# [Portal](#tab/portal)
1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. The Management Group hierarchy page loads where all groups are displayed that you have access to. 
    ![Main](media/management-groups/main.png)
4. Select an individual management for the details  

# [PowerShell](#tab/powershell)
You use the Get-AzureRmManagementGroup command to retrieve all groups.  

```azurepowershell-interactive
Get-AzureRmManagementGroup
```
For a single management group's information, use the -GroupName parameter

```azurepowershell-interactive
Get-AzureRmManagementGroup -GroupName <Your Group Name>
```
---

## Move subscriptions in the hierarchy
One reason to create a management group is to bundle subscriptions together. Only management groups and subscriptions can be made children of another management group. A subscription that moves to a management group inherits all user access and policies from the parent management group. 

To move the subscription, there are a couple permissions you must have: 
- "Owner" role on the child subscription.
- "Owner" or "Contributor" role on the new parent management group. 
- "Owner" or "Contributor" role on the old parent management group.
To view what role you have on the management group or subscription, view the IAM page on the resource.  

### Move a subscription to a management groups  
Subscriptions can be added under management groups to manage your RBAC roles and policies in one place.      

# [Portal](#tab/portal)

### Add an existing Subscription to a management group 
1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. Select the management group you are planning to be the parent.      
5. At the top of the page, select **Add existing**. 
6. In the menu that opened, select the **Resource Type** of the item you are trying to move which is **Subscription**.
7. Select the subscription in the list with the correct ID. 

    ![Children](media/management-groups/add_context_2.png)
8. Select "Save"

### Remove a subscription from a management group 

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. Select the management group you are planning that is the current parent.  
4. Select the ellipse at the end of the row for the subscription in the list you want to move.

    ![Move](media/management-groups/move_small.png)
5. Select **Move**
6. On the menu that opens, select the **Parent management group**.

    ![Move](media/management-groups/move_small_context.png)
7. Select **Save**

# [Powershell](#tab/powershell)
To move a subscription in PowerShell, you use the Add-AzureRmManagementGroupSubscription command.  

```azurepowershell-interactive
Add-AzureRmManagementGroupSubscription -GroupName <New Parent Group Name> -SubscriptionId <The SubscriptionID> 
```

To remove the link between and subscription and the management group use the Remove-AzureRmManagementGroupSubscription command.

```azurepowershell-interactive
Remove-AzureRmManagementGroupSubscription -GroupName <Current Parent Group Name> -SubscriptionId <The SubscriptionID> 
```

---

## Move management groups in the hierarchy  
When you move a parent management group, all the child resources that include management groups, subscriptions, resource groups, and resources move with the parent.   

# [Portal](#tab/portal)

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. Select the management group you are planning to be the parent.      
5. At the top of the page, select **Add existing**.
6. In the menu that opened, select the **Resource Type** of the item you are trying to move which is **Management Group**.
7. Select the management group with the correct ID and Name.

    ![move](media/management-groups/add_context.png)
8. Select **Save**

# [Powershell](#tab/powershell)
Use the **Update-AzureRmManagementGroup command in PowerShell to move a management group under a different group.  

```powershell
C:\> Update-AzureRmManagementGroup -GroupName <Group Name you are moving>  -ParentName <New Parent Group Name> 
```  

---

## Next steps 
To Learn more about management groups, see: 
- [Organize your resources with Azure management groups ](management-groups-overview.md)
- [Create management groups to organize Azure resources](management-groups-create.md)
- [Review the Azure Powershell module]()
- [Review the REST API Spec](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview)
- [Review the command-line tool spec]()