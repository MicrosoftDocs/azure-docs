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
ms.date: 3/1/2018
ms.author: rithorn
---


# Manage your resources with management groups 
Management groups are containers that help you manage access, policy, and compliance across multiple subscriptions. You can change, delete, and manage these containers to have hierarchies that can be used with [Azure Policy](../azure-policy/azure-policy-introduction.md) and [Azure Role Based Access Controls (RBAC)](../active-directory/role-based-access-control-what-is.md). To learn more about management groups, see [Organize your resources with Azure management groups ](management-groups-overview.md).

The management group feature is available in a public preview. To start using management groups, login to the [Azure portal](https://portal.azure.com) or you can use [Azure PowerShell](https://www.powershellgallery.com/packages/AzureRM.ManagementGroups/0.0.1-preview), [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/extension?view=azure-cli-latest#az_extension_list_available), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview) to manage your management groups.

To make changes to a management group, you must have an Owner or Contributor role on the management group. To see what permissions you have, select the management group and then select **IAM**. To learn more about RBAC Roles, see [Manage access and permissions with RBAC](../active-directory/role-based-access-control-what-is.md).

## Change the name of a management group 
You can change the name of the management group by using the portal, PowerShell, or Azure CLI.

### Change the name in the portal

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups**  
3. Select the management group you would like to rename. 
4. Select the **Rename group** option at the top of the page. 

    ![Rename Group](media/management-groups/detail_action_small.png)
5. When the menu opens, enter the new name you would like to have displayed.

    ![Rename Group](media/management-groups/rename_context.png) 
4. Select **Save**. 

### Change the name in PowerShell

To update the display name use **Update-AzureRmManagementGroup**. For example, to change a management groups name from "Contoso IT" to "Contoso Group", you run the following command: 

```azurepowershell-inetractive
C:\> Update-AzureRmManagementGroup -GroupName ContosoIt -DisplayName "Contoso Group"  
``` 

### Change the name in Azure CLI

For Azure CLI, use the update command. 

```azure-cli
C:\> az account management-group update --group-name Contoso --display-name "Contoso Group" 
```

---
 
## Delete a management group
To delete a management group, the following requirements must be met:
1. There are no child management groups or subscriptions under the management group. 
    - To move a subscription out of a management group, see [Move subscription to another managemnt group](#Move-subscriptions-in-the-hierarchy). 
    - To move a management group to another management group, see [Move management groups in the hierarchy](#Move-management-groups-in-the-hierarchy). 
2. You have write permissions on the management group Owner or Contributor role on the management group. To see what permissions you have, select the management group and then select **IAM**. To learn more on RBAC Roles, see [Manage access and permissions with RBAC](../active-directory/role-based-access-control-what-is.md).  

### Delete in the portal

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups**  
3. Select the management group you would like to delete. 
    
    ![delete Group](media/management-groups/delete.png)
4. Select **Delete**. 
    - If the icon is disabled, hovering your mouse selector over the icon shows you the reason. 
5. There is a window that opens confirming you want to delete the management group. 

    ![delete Group](media/management-groups/delete_confirm.png) 
6. Select **Yes** 


### Delete in PowerShell

Use the **Remove-AzureRmManagementGroup** command within PowerShell to delete management groups. 

```azurepowershell-interactive
Remove-AzureRmManagementGroup -GroupName Contoso
```

### Delete in Azure CLI
With Azure CLI, use the command az account management-group delete. 

```azure-cli
C:\> az account management-group delete --group-name Contoso
```
---

## View management groups
You can view any management group you have a direct or inherited RBAC role on.  

### View in the portal
1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. The Management Group hierarchy page loads where all groups are displayed that you have access to. 
    ![Main](media/management-groups/main.png)
4. Select an individual management group for the details  

### View in PowerShell
You use the Get-AzureRmManagementGroup command to retrieve all groups.  

```azurepowershell-interactive
Get-AzureRmManagementGroup
```
For a single management group's information, use the -GroupName parameter

```azurepowershell-interactive
Get-AzureRmManagementGroup -GroupName Contoso
```

### View in Azure CLI
You use the list command to retrieve all groups.  

```azure-cli
az account management-group list
```
For a single management group's information, use the show command

```azurepowershell-interactive
az account management-group show --group-name Contoso
```
---

## Move subscriptions in the hierarchy
One reason to create a management group is to bundle subscriptions together. Only management groups and subscriptions can be made children of another management group. A subscription that moves to a management group inherits all user access and policies from the parent management group. 

To move the subscription, there are a couple permissions you must have: 
- "Owner" role on the child subscription.
- "Owner" or "Contributor" role on the new parent management group. 
- "Owner" or "Contributor" role on the old parent management group.
To see what permissions you have, select the management group and then select **IAM**. To learn more on RBAC Roles, see [Manage access and permissions with RBAC](../active-directory/role-based-access-control-what-is.md). 

### Move subscriptions in the portal

**Add an existing Subscription to a management group**
1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. Select the management group you are planning to be the parent.      
5. At the top of the page, select **Add existing**. 
6. In the menu that opened, select the **Resource Type** of the item you are trying to move which is **Subscription**.
7. Select the subscription in the list with the correct ID. 

    ![Children](media/management-groups/add_context_2.png)
8. Select "Save"

**Remove a subscription from a management group**
1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. Select the management group you are planning that is the current parent.  
4. Select the ellipse at the end of the row for the subscription in the list you want to move.

    ![Move](media/management-groups/move_small.png)
5. Select **Move**
6. On the menu that opens, select the **Parent management group**.

    ![Move](media/management-groups/move_small_context.png)
7. Select **Save**

### Move subscriptions in PowerShell
To move a subscription in PowerShell, you use the Add-AzureRmManagementGroupSubscription command.  

```azurepowershell-interactive
New-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

To remove the link between and subscription and the management group use the Remove-AzureRmManagementGroupSubscription command.

```azurepowershell-interactive
Remove-AzureRmManagementGroupSubscription -GroupName Contoso -SubscriptionId 12345678-1234-1234-1234-123456789012
```

### Move subscriptions in Azure CLI
To move a subscription in CLI, you use the add command. 

```azure-cli
C:\> az account management-group add --group-name Contoso --subscription 12345678-1234-1234-1234-123456789012
```

To remove the subscription from the management group, use the subscription remove command.  

```azure-cli
C:\> az account management-group remove --group-name Contoso --subscription 12345678-1234-1234-1234-123456789012
```

---

## Move management groups in the hierarchy  
When you move a parent management group, all the child resources that include management groups, subscriptions, resource groups, and resources move with the parent.   

### Move management groups in the portal

1. Log into the [Azure portal](https://portal.azure.com)
2. Select **All services** > **Management groups** 
3. Select the management group you are planning to be the parent.      
5. At the top of the page, select **Add existing**.
6. In the menu that opened, select the **Resource Type** of the item you are trying to move which is **Management Group**.
7. Select the management group with the correct ID and Name.

    ![move](media/management-groups/add_context.png)
8. Select **Save**

### Move management groups in PowerShell
Use the Update-AzureRmManagementGroup command in PowerShell to move a management group under a different group.  

```powershell
C:\> Update-AzureRmManagementGroup -GroupName Contoso  -ParentName ContosoIT
```  
### Move management groups in Azure CLI
Use the update command to move a management group with Azure CLI. 

```azure-cli
C:/> az account management-group udpate --group-name Contoso --parent-id "Contoso Tenant" 
``` 

---

## Next steps 
To Learn more about management groups, see: 
- [Organize your resources with Azure management groups ](management-groups-overview.md)
- [Create management groups to organize Azure resources](management-groups-create.md)
- [Install the Azure Powershell module](https://www.powershellgallery.com/packages/AzureRM.ManagementGroups/0.0.1-preview)
- [Review the REST API Spec](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview)
- [Install the Azure CLI Extension](https://docs.microsoft.com/en-us/cli/azure/extension?view=azure-cli-latest#az_extension_list_available)