---
title: Tutorial - Add resource to template
description: Describes the steps to create your first Azure Resource Manager template. You learn about the template file syntax and how to deploy a storage account.
author: mumian
ms.date: 03/27/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Add a resource to your ARM template

In the [previous tutorial](template-tutorial-create-first-template.md), you learned how to create a blank template and deploy it. Now, you're ready to deploy an actual resource. In this tutorial, you add a storage account. It takes about **9 minutes** to complete this tutorial.

## Prerequisites

We recommend that you complete the [introductory tutorial about templates](template-tutorial-create-first-template.md), but it's not required.

You must have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Add resource

To add a storage account definition to the existing template, look at the highlighted JSON in the following example. Instead of trying to copy sections of the template, copy the whole file and replace your template with its contents.

Replace **{provide-unique-name}** (including the curly brackets) with a unique storage account name.

> [!IMPORTANT]
> The storage account name must be unique across Azure. The name must have only lowercase letters or numbers. It can be no longer than 24 characters. You might try a naming pattern like using **store1** as a prefix and then adding your initials and today's date. For example, the name you use could look like **store1abc09092019**.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-storage/azuredeploy.json" range="1-19" highlight="5-17":::

Guessing a unique name for a storage account isn't easy and doesn't work well for automating large deployments. Later in this tutorial series, you'll use template features that make it easier to create a unique name.

## Resource properties

You may be wondering how to find the properties to use for each resource type. You can use the [ARM template reference](/azure/templates/) to find the resource types you want to deploy.

Every resource you deploy has at least the following three properties:

- **type**: Type of the resource. This value is a combination of the namespace of the resource provider and the resource type (such as Microsoft.Storage/storageAccounts).
- **apiVersion**: Version of the REST API to use for creating the resource. Each resource provider published its own API versions, so this value is specific to the type.
- **name**: Name of the resource.

Most resources also have a **location** property, which sets the region where the resource is deployed.

The other properties vary by resource type and API version. It's important to understand the connection between the API version and the available properties, so let's jump into more detail.

In this tutorial, you added a storage account to the template. You can see that API version at [storageAccounts 2019-04-01](/azure/templates/microsoft.storage/2019-04-01/storageaccounts). Notice that you didn't add all of the properties to your template. Many of the properties are optional. The Microsoft.Storage resource provider could release a new API version, but the version you're deploying doesn't have to change. You can continue using that version and know that the results of your deployment will be consistent.

If you view an older API version, such as [storageAccounts 2016-05-01](/azure/templates/microsoft.storage/2016-05-01/storageaccounts), you'll see that a smaller set of properties are available.

If you decide to change the API version for a resource, make sure you evaluate the properties for that version and adjust your template appropriately.

## Deploy template

You can deploy the template to create the storage account. Give your deployment a different name so you can easily find it in the history.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addstorage `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addstorage \
  --resource-group myResourceGroup \
  --template-file $templateFile
```

---

> [!NOTE]
> If the deployment failed, use the **debug** switch with the deployment command to show the debug logs.  You can also use the **verbose** switch to show the full debug logs.

Two possible deployment failures that you might encounter:

- Error: Code=AccountNameInvalid; Message={provide-unique-name} is not a valid storage account name. Storage account name must be between 3 and
24 characters in length and use numbers and lower-case letters only.

    In the template, replace **{provide-unique-name}** with a unique storage account name.  See [Add resource](#add-resource).

- Error: Code=StorageAccountAlreadyTaken; Message=The storage account named store1abc09092019 is already taken.

    In the template, try a different storage account name.

This deployment takes longer than your blank template deployment because the storage account is created. It can take about a minute but is usually faster.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. You see that a storage account has been deployed.
1. Notice that the deployment label now says: **Deployments: 2 Succeeded**.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You created a simple template to deploy an Azure storage account.  In the later tutorials, you learn how to add parameters, variables, resources, and outputs to a template. These features are the building blocks for much more complex templates.

> [!div class="nextstepaction"]
> [Add parameters](template-tutorial-add-parameters.md)