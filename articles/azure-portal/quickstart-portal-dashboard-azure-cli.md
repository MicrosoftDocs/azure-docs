---
title: Create an Azure portal dashboard with Azure CLI
description: "Quickstart: Learn how to create a dashboard in the Azure portal using the Azure CLI. A dashboard is a focused and organized view of your cloud resources."
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
ms.date: 12/4/2020
---

# Quickstart: Create an Azure portal dashboard with Azure CLI

A dashboard in the Azure portal is a focused and organized view of your cloud resources. This
article focuses on the process of using Azure CLI to create a dashboard.
The dashboard shows the performance of a virtual machine (VM), as well as some static information
and links.


[!INCLUDE [azure-cli-prepare-your-environment.md](../../includes/azure-cli-prepare-your-environment.md)]

- If you have multiple Azure subscriptions, choose the appropriate subscription in which to bill the resources.
Select a subscription by using the [az account set](/cli/azure/account#az_account_set) command:

  ```azurecli
  az account set --subscription 00000000-0000-0000-0000-000000000000
  ```

- Create an [Azure resource group](../azure-resource-manager/management/overview.md) by using the [az group create](/cli/azure/group#az_group_create) command or use an existing resource group:

  ```azurecli
  az group create --name myResourceGroup --location centralus
  ```

   A resource group is a logical container in which Azure resources are deployed and managed as a group.

## Create a virtual machine

Create a virtual machine by using the [az vm create](/cli/azure/vm#az_vm_create) command:

```azurecli
az vm create --resource-group myResourceGroup --name SimpleWinVM --image win2016datacenter \
   --admin-username azureuser --admin-password 1StrongPassword$
```

> [!Note]
> The password must be complex.
> This is a new user name and password.
> It's not, for example, the account you use to sign in to Azure.
> For more information, see [username requirements](../virtual-machines/windows/faq.md#what-are-the-username-requirements-when-creating-a-vm)
and [password requirements](../virtual-machines/windows/faq.md#what-are-the-password-requirements-when-creating-a-vm).

The deployment starts and typically takes a few minutes to complete.
After deployment completes, move on to the next section.

## Download the dashboard template

Since Azure dashboards are resources, they can be represented as JSON.
For more information, see [The structure of Azure Dashboards](./azure-portal-dashboards-structure.md).

Download the following file: [portal-dashboard-template-testvm.json](https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/azure-portal/portal-dashboard-template-testvm.json).

Customize the downloaded template by changing the following values to your values:

* `<subscriptionID>`: Your subscription
* `<rgName>`: Resource group, for example `myResourceGroup`
* `<vmName>`: Virtual machine name, for example `SimpleWinVM`
* `<dashboardTitle>`: Dashboard title, for example `Simple VM Dashboard`
* `<location>`: Your Azure region, for example, `centralus`

For more information, see [Microsoft portal dashboards template reference](/azure/templates/microsoft.portal/dashboards).

## Deploy the dashboard template

You can now deploy the template from within Azure CLI.

1. Run the [az portal dashboard create](/cli/azure/ext/portal/portal/dashboard#ext_portal_az_portal_dashboard_create) command to deploy the template:

   ```azurecli
   az portal dashboard create --resource-group myResourceGroup --name 'Simple VM Dashboard' \
      --input-path portal-dashboard-template-testvm.json --location centralus
   ```

1. Check that the dashboard was created successfully by running the [az portal dashboard show](/cli/azure/ext/portal/portal/dashboard#ext_portal_az_portal_dashboard_show) command:

   ```azurecli
   az portal dashboard show --resource-group myResourceGroup --name 'Simple VM Dashboard'
   ```

To see all the dashboards for the current subscription, use [az portal dashboard list](/cli/azure/ext/portal/portal/dashboard#ext_portal_az_portal_dashboard_list):

```azurecli
az portal dashboard list
```

You can also see all the dashboards for a resource group:

```azurecli
az portal dashboard list --resource-group myResourceGroup
```

You can update a dashboard by using the [az portal dashboard update](/cli/azure/ext/portal/portal/dashboard#ext_portal_az_portal_dashboard_update) command:

```azurecli
az portal dashboard update --resource-group myResourceGroup --name 'Simple VM Dashboard' \
   --input-path portal-dashboard-template-testvm.json --location centralus
```

[!INCLUDE [azure-portal-review-deployed-resources](../../includes/azure-portal-review-deployed-resources.md)]

## Clean up resources

To remove the virtual machine and associated dashboard, delete the resource group that contains them.

> [!CAUTION]
> The following example deletes the specified resource group and all resources contained within it.
> If resources outside the scope of this article exist in the specified resource group, they will also be deleted.

```azurecli
az group delete --name myResourceGroup
```

To remove only the dashboard, use the [az portal dashboard delete](/cli/azure/ext/portal/portal/dashboard#ext_portal_az_portal_dashboard_delete) command:

```azurecli
az portal dashboard delete --resource-group myResourceGroup --name "Simple VM Dashboard"
```

## Next steps

For more information about Azure CLI support for dashboards, see [az portal dashboard](/cli/azure/ext/portal/portal/dashboard).
