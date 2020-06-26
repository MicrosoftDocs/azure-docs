---
title: Tutorial - add parameters to template
description: Add parameters to your Azure Resource Manager template to make it reusable.
author: mumian
ms.date: 03/31/2020
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Add parameters to your ARM template

In the [previous tutorial](template-tutorial-add-resource.md), you learned how to add a storage account to the template and deploy it. In this tutorial, you learn how to improve the Azure Resource Manager (ARM) template by adding parameters. This tutorial takes about **14 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about resources](template-tutorial-add-resource.md), but it's not required.

You must have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure CLI. For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-storage/azuredeploy.json":::

You may have noticed that there's a problem with this template. The storage account name is hard-coded. You can only use this template to deploy the same storage account every time. To deploy a storage account with a different name, you would have to create a new template, which obviously isn't a practical way to automate your deployments.

## Make template reusable

To make your template reusable, let's add a parameter that you can use to pass in a storage account name. The highlighted JSON in the following example shows what changed in your template. The **storageName** parameter is identified as a string. The max length is set to 24 characters to prevent any names that are too long.

Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-name/azuredeploy.json" range="1-26" highlight="4-10,15":::

## Deploy template

Let's deploy the template. The following example deploys the template with Azure CLI or PowerShell. Notice that you provide the storage account name as one of the values in the deployment command. For the storage account name, provide the same name you used in the previous tutorial.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the **templateFile** variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addnameparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}"
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addnameparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageName={your-unique-name}
```

---

## Understand resource updates

In the previous section, you deployed a storage account with the same name that you had created earlier. You may be wondering how the resource is affected by the redeployment.

If the resource already exists and no change is detected in the properties, no action is taken. If the resource already exists and a property has changed, the resource is updated. If the resource doesn't exist, it's created.

This way of handling updates means your template can include all of the resources you need for an Azure solution. You can safely redeploy the template and know that resources are changed or created only when needed. For example, if you have added files to your storage account, you can redeploy the storage account without losing those files.

## Customize by environment

Parameters enable you to customize the deployment by providing values that are tailored for a particular environment. For example, you can pass different values based on whether you're deploying to an environment for development, test, and production.

The previous template always deployed a Standard_LRS storage account. You might want the flexibility to deploy different SKUs depending on the environment. The following example shows the changes to add a parameter for SKU. Copy the whole file and paste over your template.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-sku/azuredeploy.json" range="1-40" highlight="10-23,32":::

The **storageSKU** parameter has a default value. This value is used when a value isn't specified during the deployment. It also has a list of allowed values. These values match the values that are needed to create a storage account. You don't want users of your template to pass in SKUs that don't work.

## Redeploy template

You're ready to deploy again. Because the default SKU is set to **Standard_LRS**, you don't need to provide a value for that parameter.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addskuparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name addskuparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageName={your-unique-name}
```

---

> [!NOTE]
> If the deployment failed, use the **debug** switch with the deployment command to show the debug logs.  You can also use the **verbose** switch to show the full debug logs.

To see the flexibility of your template, let's deploy again. This time set the SKU parameter to **Standard_GRS**. You can either pass in a new name to create a different storage account, or use the same name to update your existing storage account. Both options work.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name usenondefaultsku `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}" `
  -storageSKU Standard_GRS
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name usenondefaultsku \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageSKU=Standard_GRS storageName={your-unique-name}
```

---

Finally, let's run one more test and see what happens when you pass in a SKU that isn't one of the allowed values. In this case, we test the scenario where a user of your template thinks **basic** is one of the SKUs.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name testskuparameter `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storageName "{your-unique-name}" `
  -storageSKU basic
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az deployment group create \
  --name testskuparameter \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storageSKU=basic storageName={your-unique-name}
```

---

The command fails immediately with an error message that states which values are allowed. Resource Manager identifies the error before the deployment starts.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You improved the template created in the [first tutorial](template-tutorial-create-first-template.md) by adding parameters. In the next tutorial, you'll learn about template functions.

> [!div class="nextstepaction"]
> [Add template functions](template-tutorial-add-functions.md)