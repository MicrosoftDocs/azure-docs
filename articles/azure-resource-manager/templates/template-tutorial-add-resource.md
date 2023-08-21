---
title: Tutorial - Add resource to template
description: Describes the steps to create your first Azure Resource Manager template (ARM template). You learn about the template file syntax and how to deploy a storage account.
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Add a resource to your ARM template

In the [previous tutorial](template-tutorial-create-first-template.md), you learned how to create and deploy your first blank Azure Resource Manager template (ARM template). Now, you're ready to deploy an actual resource to that template. In this case, an [Azure storage account](../../storage/common/storage-account-create.md). This instruction takes **9 minutes** to complete.

## Prerequisites

We recommend that you complete the [introductory tutorial about templates](template-tutorial-create-first-template.md), but it's not required.

You need to have [Visual Studio Code](https://code.visualstudio.com/) installed and working with the Azure Resource Manager Tools extension, and either Azure PowerShell or Azure Command-Line Interface (CLI). For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Add resource

To add an Azure storage account definition to the existing template, look at the highlighted JSON file in the following example. Instead of trying to copy sections of the template, copy the whole file and replace your template with its contents.

Replace `{provide-unique-name}` and the curly braces `{}` with a unique storage account name.

> [!IMPORTANT]
> The storage account name needs to be unique across Azure. It's only lowercase letters or numbers and has a limit of 24 characters. You can use a name like **store1** as a prefix and then add your initials and today's date. The name, for example, can be **store1abc06132022**.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-storage/azuredeploy.json" range="1-19" highlight="5-17":::

Guessing a unique name for a storage account isn't easy and doesn't work well for automating large deployments. Later in this tutorial series, you use template features that make it easier to create a unique name.

## Resource properties

You may be wondering how to find the properties to use for each resource type. You can use the [ARM template reference](/azure/templates/) to find the resource types you want to deploy.

Every resource you deploy has at least the following three properties:

- `type`: Type of the resource. This value is a combination of the namespace of the resource provider and the resource type such as `Microsoft.Storage/storageAccounts`.
- `apiVersion`: Version of the REST API to use for creating the resource. Each resource provider publishes its own API versions, so this value is specific to the type.
- `name`: Name of the resource.

Most resources also have a `location` property, which sets the region where you deploy the resource.

The other properties vary by resource type and API version. It's important to understand the connection between the API version and the available properties, so let's jump into more detail.

In this tutorial, you add a storage account to the template. You can see the storage account's API version at [storageAccounts 2021-09-01](/azure/templates/microsoft.storage/2021-09-01/storageaccounts). Notice that you don't add all the properties to your template. Many of the properties are optional. The `Microsoft.Storage` resource provider could release a new API version, but the version you're deploying doesn't have to change. You can continue using that version and know that the results of your deployment are consistent.

If you view an older [API version](/azure/templates/microsoft.storage/allversions) you might see that a smaller set of properties is available.

If you decide to change the API version for a resource, make sure you evaluate the properties for that version and adjust your template appropriately.

## Deploy template

You can deploy the template to create the storage account. Give your deployment a different name so you can easily find it in the history.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the `templateFile` variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addstorage `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addstorage \
  --resource-group myResourceGroup \
  --template-file $templateFile
```

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources you're creating. Use the `debug` switch to get more information for debugging.

These errors are two possible deployment failures that you might encounter:

- `Error: Code=AccountNameInvalid; Message={provide-unique-name}` isn't a valid storage account name. The storage account name needs to be between 3 and 24 characters in length and use numbers and lower-case letters only.

    In the template, replace `{provide-unique-name}` with a unique storage account name. See [Add resource](#add-resource).

- `Error: Code=StorageAccountAlreadyTaken; Message=The storage account named store1abc09092019` is already taken.

    In the template, try a different storage account name.

This deployment takes longer than your blank template deployment because you're creating a storage account. It can take about a minute.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Check the box to the left of **myResourceGroup** and select **myResourceGroup**
1. Select the resource group you deployed to.
1. You see that a storage account has been deployed.
1. Notice that the deployment label now says: **Deployments: 2 Succeeded**.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Type the resource group name in the **Filter for any field ...** box.
3. Check the box next to myResourceGroup and select **myResourceGroup** or the resource group name you chose.
4. Select **Delete resource group** from the top menu.

## Next steps

You created a simple template to deploy an Azure storage account. In the later tutorials, you learn how to add parameters, variables, resources, and outputs to a template. These features are the building blocks for much more complex templates.

> [!div class="nextstepaction"]
> [Add parameters](template-tutorial-add-parameters.md)
