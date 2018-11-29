---
title: Create management groups to organize Azure resources
description: Learn how to create Azure management groups to manage multiple resources. 
author: rthorn17
manager: rithorn
ms.service: azure-resource-manager
ms.devlang: na
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 11/20/2018
ms.author: rithorn
ms.topic: conceptual
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

Within PowerShell, you use the New-AzureRmManagementGroup cmdlet:

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

To learn more about management groups, see:

- [Create management groups to organize Azure resources](create.md)
- [How to change, delete, or manage your management groups](manage.md)
- [Review management groups in Azure PowerShell Resources Module](https://aka.ms/mgPSdocs)
- [Review management groups in REST API](https://aka.ms/mgAPIdocs)
- [Review management groups in Azure CLI](https://aka.ms/mgclidoc)
