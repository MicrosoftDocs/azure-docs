---
title: Create management groups to organize Azure resources
description: Learn how to create Azure management groups to manage multiple resources. 
author: rthorn17
manager: rithorn
ms.service: azure-resource-manager
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 10/10/2018
ms.author: rithorn
---
# Create management groups for resource organization and management

Management groups are containers that help you manage access, policy, and compliance across
multiple subscriptions. Create these containers to build an effective and efficient hierarchy that
can be used with [Azure Policy](../policy/overview.md) and [Azure Role Based
Access Controls](../../role-based-access-control/overview.md). For more information on management
groups, see [Organize your resources with Azure management groups](overview.md).

The first management group created in the directory could take up to 15 minutes to complete. There
are processes that run the first time to set up the management groups service within Azure for your
directory. You receive a notification when the process is complete.

## Create a management group

You can create the management group by using the portal, PowerShell, or Azure CLI. Currently, you
can't use Resource Manager templates to create management groups.

### Create in portal

1. Log into the [Azure portal](http://portal.azure.com).

1. Select **All services** > **Management groups**.

1. On the main page, select **New Management group**.

   ![Main Group](./media/main.png)

1. Fill in the management group ID field.

   - The **Management Group ID** is the directory unique identifier that is used to submit commands on this management group. This identifier is not editable after creation as it is used throughout the Azure system to identify this group.
   - The display name field is the name that is displayed within the Azure portal. A separate display name is an optional field when creating the management group and can be changed at any time.  

   ![Create](./media/create_context_menu.png)  

1. Select **Save**.

### Create in PowerShell

Within PowerShell, you use the New-AzureRmManagementGroups cmdlets:

```azurepowershell-interactive
New-AzureRmManagementGroup -GroupName 'Contoso'
```

The **GroupName** is a unique identifier being created. This ID is used by other commands to
reference this group and it cannot be changed later.

If you wanted the management group to show a different name within the Azure portal, you would add
the **DisplayName** parameter with the string. For example, if you wanted to create a management
group with the GroupName of Contoso and the display name of "Contoso Group", you would use the
following cmdlet:

```azurepowershell-interactive
New-AzureRmManagementGroup -GroupName 'Contoso' -DisplayName 'Contoso Group' -ParentId 'ContosoTenant'
```

Use the **ParentId** parameter to have this management group be created under a different
management.

### Create in Azure CLI

On Azure CLI, you use the az account management-group create command.

```azurecli-interactive
az account management-group create --name 'Contoso'
```

## Next steps

To Learn more about management groups, see:

- [Organize your resources with Azure management groups](overview.md)
- [How to change, delete, or manage your management groups](manage.md)
- [Install the Azure Powershell module](https://www.powershellgallery.com/packages/AzureRM.ManagementGroups)
- [Review the REST API Spec](https://github.com/Azure/azure-rest-api-specs/tree/master/specification/managementgroups/resource-manager/Microsoft.Management/preview)
- [Install the Azure CLI Extension](/cli/azure/extension?view=azure-cli-latest#az-extension-list-available)
