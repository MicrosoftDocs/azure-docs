---
title: Azure Quick Start- Creating Azure Management Groups  | Microsoft Docs
description: Learn how to quickly create azure management groups. 
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


# Creating management groups 
[Management groups](/azure-resource-manager/management-groups-overview.md) is a new feature that is available in a Public Preview. To get started using management groups, log into the [Azure portal](https://portal.azure.com) or use the [Azure PowerShell](https://github.com/Azure/azure-powershell#microsoft-azure-powershell), [command-line tool](/cli/azure/install-azure-cli?view=azure-cli-latest), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview) options.   

Use the following instructions to learn how to create a management group. The new management group can be created under the top level or under a different management group.  

Any user within a directory can create a management group and they are made the owner of that new management group. A management group created under another management group inherits the policy and authorizations that are assigned from any parent of the hierarchy. The following graph gives an example of a hierarchy created that is grouped by departments.  

![hierarchy tree](media/management-groups/MG_overview.png) 

Using the diagram as an example, you can create a new management group under the "Application Team" management group on the right side of the diagram. This new management group would inherit any policy that is assigned to "Application Team" or "IT Team" management groups.

# How-to create a management group 

Creating a management group can be done using the [Azure portal](https://portal/azure.com), [Azure PowerShell](https://github.com/Azure/azure-powershell#microsoft-azure-powershell), [command-line tool](/cli/azure/install-azure-cli?view=azure-cli-latest), or the [REST API](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview/2018-01-01-preview). 

Let's say you want to create a new management group with the identifier of "Contoso."

# [Portal](#tab/portal)

1. On the main page, select **New Management group.** 

![Create Group](media/management-groups/create_main.png)

2.  Fill in the management group ID field with "Contoso."
    - This identifier is the directory unique identifier that is used to submit commands on this management group. This identifier is not editable after creation as it is used throughout the Azure system to identify this group. 
    - The display name field is the name that is displayed within the Azure portal. A separate display name is an optional field when creating the management group and can be changed at any time. 

![Create](media/management-groups/create_context_menu.png)  

3.  Select the save button at the bottom of the menu

You see the new group now show in the list


# [PowerShell](#tab/powershell)
Within PowerShell, you use the Add-AzureRmManagementGroups cmdlets.   

```azurepowershell-interactive
C:\> Add-AzureRmManagementGroup -GroupName Contoso  
```
[-GroupName]: Defines the identifier of the group being created. This identifier is used by other commands to reference this group and it cannot be edited later.

If you wanted the management group to show a different name within the Azure portal, you would add the "DisplayName" parameter with the string. 

```azurepowershell-interactive
C:\> Add-AzureRmManagementGroup -GroupName newGroup -DisplayName "Contoso IT" -ParentId Contoso 
``` 

---


