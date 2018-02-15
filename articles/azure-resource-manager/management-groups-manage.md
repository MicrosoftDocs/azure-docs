---
title: How to maintain your management groups - Azure | Microsoft Docs
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


# Maintain management groups 
The [management group](management-groups-overview.md)] feature is available in a public preview. To start using management groups, login to the [Azure portal](https://portal.azure.com) and search for **Management Groups** in the **All Services** section. In addition to the portal, you can use [Azure PowerShell](https://github.com/Azure/azure-powershell#microsoft-azure-powershell), [command-line tool](/cli/azure/install-azure-cli?view=azure-cli-latest), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview) to maintain your management groups.

Use the following instructions to help you update, delete, and move management groups or subscriptions within a hierarchy. See [Creating Management Groups](/management-groups-manage.md) page to learn how to create new management groups.  

When looking to perform any actions on a management group, you need to verify you have the proper [Role-based Access Control (RBAC) Role](../active-directory/role-based-access-control-what-is) to perform the action.  

# How-to guide

## Change the name of a management group 
When you need to change the display name that is shown in the [Azure portal](https://portal/azure.com), you can do it through the [Azure portal](https://portal/azure.com), [Azure PowerShell](https://github.com/Azure/azure-powershell#microsoft-azure-powershell), [command-line tool](/cli/azure/install-azure-cli?view=azure-cli-latest), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview).  

# [Portal](#tab/portal)
1. Select the management group you would like to rename. 
2. Select the **Rename** option at the top of the page
![Rename Group](media/management-groups/detail_action_small.png)
3. When the menu opens, enter the new name you would like to have displayed.
![Rename Group](media/management-groups/rename_context.png) 
4. Select save. 

The hierarchy list updates to show the new display name. 

# [PowerShell](#tab/powershell)

PowerShell gives you the ability to change the name with **Update-AzureRmManagementGroup**. 

```azurepowershell-inetractive
C:\> Update-AzureRmManagementGroup -GroupName Contoso -DisplayName "Contoso Group" 
```    
---
 
## Delete a management group
Any management group can be deleted from a hierarchy that meets the following requirements:
- There are no child management groups or subscriptions under the management group.
- You have write permissions on the management group ("Owner" or "Contributor" roles). These permissions can be directly assigned or inherited.  

# [Portal](#tab/portal)

1. Select the management group you would like to delete. 
![delete Group](media/management-groups/delete.png)
2. Select the "delete" option at the top of the page. 
    - If the icon is disabled, hovering your mouse selector over the icon shows you the reason. 
![delete Group](media/management-groups/detail_action_small.png) 
3. There is a window that opens confirming you want to delete the management group. 
![delete Group](media/management-groups/delete_confirm.png) 
4. Select "Yes." 

The hierarchy list updates showing the group has been deleted.

# [PowerShell](#tab/powershell)

Use the **Remove-AzureRmManagementGroup** command within powershell with the ID.  

```azurepowershell-interactive
Remove-AzureRmManagementGroup -GroupName ContosoMarketing
```
---

## View all management groups
You are able to view any management group you have a direct or inherited RBAC role on.  

# [Portal](#tab/portal)
To view all the management groups within the [Azure portal](https://portal.azure.com)
1. Select **More Services** on the left navigation within the Azure portal
2. Search for **Management Groups** 
3. The Management Group hierarchy page loads where all groups are displayed that you have access to. 
![Main](media/management-groups/main.png)

# [Powershell](#tab/powershell)
You use the Get-AzureRmManagementGroup command to retrieve all groups.  

```azurepowershell-interactive
Get-AzureRmManagementGroup
```
---

## View a single management group
Sometimes you want to just view one management group to see details or information.  

# [Portal](#tab/portal)
1. Select **More Services** on the left navigation within the Azure portal
2. Search for **Management Groups** 
3. Select the management group "Contoso." and the detail page loads
![detail](media/management-groups/detail_all.png)

# [Powershell](#tab/powershell)
Use the Get-AzureRmManagementGroup command in powershell along with the -GroupName parameter to only retrieve the one management group.   

```azurepowershell-interactive
Get-AzureRmManagementGroup -GroupName Contoso
```
---

## Moving subscriptions with management groups
One of the main goals of creating management groups is to bundle subscriptions together. Only management groups and subscriptions can be made children of another management group.  

A subscription that moves to a management group inherits all user authorizations and policies from any parent management group in the hierarchy. To move the subscription, there are a couple permissions that you must have: 
- "Owner" role on the child subscription.
- Atleast "Contributor" role on the new parent management group. 
- Atleast "Contributor" role on the old parent management group.

### Moving subscriptions with management groups  
Subscriptions can be added under management groups to allow fo easy management of your RBAC Roles and policies across the hierarchy.      

# [Portal](#tab/portal)

### Add an existing Subscription to a management group 
1. Select **More Services** on the left navigation within the Azure portal
2. Search for **Management Groups** 
3. Select the management group you are planning to be the parent for the detail page. 
4. On the detail page, select **Children** on the left menu.  
![Children](media/management-groups/children_all.png)
5. At the top of the page, select **Add existing**. 
6. In the menu that opened, select the **Resource Type** of the item you are trying to move which is **Subscription**.
7. Select the subscription in the list with the correct ID. 
![Children](media/management-groups/add_context_2.png)
8. Select "Save"

You see the list now show with the subscription

### Remove an existing Subscription from a management group 

1. Select **More Services** on the left navigation within the Azure portal
2. Search for **Management Groups** 
3. Select the management group that has the child you are looking to move for the detail page.  
3. On the detail page, select **Children** on the left menu.  
![Children](media/management-groups/children_all.png)
4. Select the ellipse at the end of the row for the subscription in the list with the correct ID.
![Move](media/management-groups/move_small.png)
5. Select **Move**
6. On the menu that opens, select the **Parent management group**.
 ![Move](media/management-groups/move_small_context.png)
7. Select **Save**

You see the list update now without the subscription


# [Powershell](#tab/powershell)
To move a subscription in PowerShell, you use the Add-AzureRmManagementGroupSubscription command.  

```azurepowershell-interactive
Add-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

To remove the link between and subscription and the management group use the Remove-AzureRmManagementGroupSubscription command.

```azurepowershell-interactive
Remove-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

---

## Moving management groups   
There is plenty of flexibility to move management groups around within the hierarchy.   

# [Portal](#tab/portal)

### Move a management group under another management group
1. Select **More Services** on the left navigation within the Azure portal
2. Search for **Management Groups** 
3. Select the management group you are looking to be the parent group for the detail page. 
4. On the detail page, select **Children** on the left menu.   
![children](media/management-groups/children_all.png)
5. At the top of the page, you select **Add existing**. 
6. In the menu that opened, select the **Resource Type** of the item you are trying to move which is **Management Group**.
7. Select the management group with the correct ID and Name.   
![move](media/management-groups/add_context.png)
8. Select **Save**

You see the list update now with the management group

# [Powershell](#tab/powershell)
Use the **Update-AzureRmManagementGroup command in PowerShell to move a management group under a different group.  

```powershell
C:\> Update-AzureRmManagementGroup -GroupName ContosoMarketing -ParentName Contoso 
```  

---

## Next steps 
### [Learn more about management groups](management-groups-overview.md)
### [Review the Azure Powershell module]()
### [Review the REST API Spec](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview)
### [Review the command-line tool spec]()