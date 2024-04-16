---
title: Create an Azure portal dashboard with Azure CLI
description: "Quickstart: Learn how to create a dashboard in the Azure portal using the Azure CLI. A dashboard is a focused and organized view of your cloud resources."
ms.topic: quickstart
ms.custom: devx-track-azurecli, mode-api
ms.date: 03/27/2023
---

# Quickstart: Create an Azure portal dashboard with Azure CLI

A [dashboard](azure-portal-dashboards.md) in the Azure portal is a focused and organized view of your cloud resources. This quickstart shows how to use Azure CLI to create a dashboard. The example dashboard shows the performance of a virtual machine (VM), along with some static information and links.

In addition to the prerequisites below, you'll need an Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- If you have multiple Azure subscriptions, choose the appropriate subscription in which to bill the resources.
Select a subscription by using the [az account set](/cli/azure/account#az-account-set) command:

  ```azurecli
  az account set --subscription 00000000-0000-0000-0000-000000000000
  ```

- Create an [Azure resource group](../azure-resource-manager/management/overview.md#resource-groups) by using the [az group create](/cli/azure/group#az-group-create) command (or use an existing resource group):

  ```azurecli
  az group create --name myResourceGroup --location centralus
  ```

## Create a virtual machine

Create a virtual machine by using the [az vm create](/cli/azure/vm#az-vm-create) command:

```azurecli
az vm create --resource-group myResourceGroup --name myVM1 --image win2016datacenter \
   --admin-username azureuser --admin-password 1StrongPassword$
```

> [!NOTE]
> This is a new username and password (not the account you use to sign in to Azure). The password must be complex. For more information, see [username requirements](../virtual-machines/windows/faq.yml#what-are-the-username-requirements-when-creating-a-vm-)
and [password requirements](../virtual-machines/windows/faq.yml#what-are-the-password-requirements-when-creating-a-vm-).

The deployment starts and typically takes a few minutes to complete.

## Download the dashboard template

Since Azure dashboards are resources, they can be represented as JSON. For more information, see [The structure of Azure dashboards](./azure-portal-dashboards-structure.md).

Download the file [portal-dashboard-template-testvm.json](https://raw.githubusercontent.com/Azure/azure-docs-powershell-samples/master/azure-portal/portal-dashboard-template-testvm.json).

Then, customize the downloaded template file by changing the following to your values:

- `<subscriptionID>`: Your subscription
- `<rgName>`: Resource group, for example `myResourceGroup`
- `<vmName>`: Virtual machine name, for example `myVM1`
- `<dashboardTitle>`: Dashboard title, for example `Simple VM Dashboard`
- `<location>`: Your Azure region, for example `centralus`

For more information, see [Microsoft portal dashboards template reference](/azure/templates/microsoft.portal/dashboards).

## Deploy the dashboard template

You can now deploy the template from within Azure CLI.

1. Run the [az portal dashboard create](/cli/azure/portal/dashboard#az-portal-dashboard-create) command to deploy the template:

   ```azurecli
   az portal dashboard create --resource-group myResourceGroup --name 'Simple VM Dashboard' \
      --input-path portal-dashboard-template-testvm.json --location centralus
   ```

1. Check that the dashboard was created successfully by running the [az portal dashboard show](/cli/azure/portal/dashboard#az-portal-dashboard-show) command:

   ```azurecli
   az portal dashboard show --resource-group myResourceGroup --name 'Simple VM Dashboard'
   ```

To see all the dashboards for the current subscription, use [az portal dashboard list](/cli/azure/portal/dashboard#az-portal-dashboard-list):

```azurecli
az portal dashboard list
```

You can also see all the dashboards for a specific resource group:

```azurecli
az portal dashboard list --resource-group myResourceGroup
```

To update a dashboard, use the [az portal dashboard update](/cli/azure/portal/dashboard#az-portal-dashboard-update) command:

```azurecli
az portal dashboard update --resource-group myResourceGroup --name 'Simple VM Dashboard' \
   --input-path portal-dashboard-template-testvm.json --location centralus
```

## Review deployed resources

[!INCLUDE [azure-portal-review-deployed-resources](../../includes/azure-portal-review-deployed-resources.md)]

## Clean up resources

To remove the virtual machine and associated dashboard that you created, delete the resource group that contains them.

> [!CAUTION]
> Deleting the resource group will delete all of the resources contained within it. If the resource group contains additional resources aside from your virtual machine and dashboard, those resources will also be deleted.

```azurecli
az group delete --name myResourceGroup
```

To remove only the dashboard, use the [az portal dashboard delete](/cli/azure/portal/dashboard#az-portal-dashboard-delete) command:

```azurecli
az portal dashboard delete --resource-group myResourceGroup --name "Simple VM Dashboard"
```

## Next steps

For more information about Azure CLI commands for dashboards, see:

> [!div class="nextstepaction"]
> [Azure CLI: az portal dashboard](/cli/azure/portal/dashboard).
