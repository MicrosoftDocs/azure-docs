---
title: Create management groups to organize Azure resources  | Microsoft Docs
description: Learn how to create Azure management groups to manage multiple resources. 
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


# Create management groups for organization and management
[Management groups](management-groups-overview.md) are containers that help you manage access, policy, and compliance across multiple subscriptions. Create these containers to build an effective and efficient hierarchy that can be used with [Azure Policy](../azure-policy/azure-policy-introduction.md) and [Azure Role Based Access Controls](../active-directory/role-based-access-control-what-is.md).  

The management group feature is available in a public preview. To start using management groups, login to the [Azure portal](https://portal.azure.com) or  you can use [Azure PowerShell](https://github.com/Azure/azure-powershell#microsoft-azure-powershell), [command-line tool](/cli/azure/install-azure-cli?view=azure-cli-latest), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview) to create management groups.   

## How to create a management group 

# [Portal](#tab/portal)

1. Log into the [Azure portal](http://portal.azure.com).
2. Select **All services** > **Management groups** 
3. On the main page, select **New Management group.** 

    ![Create Group](media/management-groups/create_main.png) 
4.  Fill in the management group ID field. 
    - The **Management Group ID** is the directory unique identifier that is used to submit commands on this management group. This identifier is not editable after creation as it is used throughout the Azure system to identify this group. 
    - The display name field is the name that is displayed within the Azure portal. A separate display name is an optional field when creating the management group and can be changed at any time.  

    ![Create](media/management-groups/create_context_menu.png)  
5.  Select **Save**


# [PowerShell](#tab/powershell)
Within PowerShell, you use the Add-AzureRmManagementGroups cmdlets.   

```azurepowershell-interactive
C:\> Add-AzureRmManagementGroup -GroupName <YourGroupName>  
```
The **GroupName** is a unique identifier being created. This ID is used by other commands to reference this group and it cannot be changed later.

If you wanted the management group to show a different name within the Azure portal, you would add the **DisplayName** parameter with the string. 

```azurepowershell-interactive
C:\> Add-AzureRmManagementGroup -GroupName <YourGroupName> -DisplayName "<YourDisplayName>" -ParentId <Parent Group ID>  
``` 
Use the **ParentId** parameter to have this management group be created under a different management.  

---

## Next steps 
To Learn more about management groups, see: 
- [Organize your resources with Azure management groups ](management-groups-overview.md)
- [How to change, delete, or manage your management groups](management-groups-manage.md)
- [Review the Azure Powershell module]()
- [Review the REST API Spec](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview)
- [Review the command-line tool spec]()
