---
title: Tutorial - add outputs to template
description: Add outputs to your Azure Resource Manager template (ARM template) to simplify the syntax.
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
---

# Tutorial: Add outputs to your ARM template

In this tutorial, you learn how to return a value from your Azure Resource Manager template (ARM template). You use outputs when you need a value for a resource you deploy. This tutorial takes **7 minutes** to complete.

## Prerequisites

We recommend that you complete the [tutorial about variables](template-tutorial-add-variables.md), but it's not required.

You need to have Visual Studio Code with the Resource Manager Tools extension, and either Azure PowerShell or Azure Command-Line Interface (CLI). For more information, see [template tools](template-tutorial-create-first-template.md#get-tools).

## Review template

At the end of the previous tutorial, your template had the following JSON:

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-variable/azuredeploy.json":::

It deploys a storage account, but it doesn't return any information about it. You might need to capture properties from your new resource so they're available later for reference.

## Add outputs

You can use outputs to return values from the template. It might be helpful, for example, to get the endpoints for your new storage account.

The following example highlights the change to your template to add an output value. Copy the whole file and replace your template with its contents.

:::code language="json" source="~/resourcemanager-templates/get-started-with-templates/add-outputs/azuredeploy.json" range="1-53" highlight="47-52":::

There are some important items to note about the output value you added.

The type of returned value is set to `object`, which means it returns a JSON object.

It uses the [reference](template-functions-resource.md#reference) function to get the runtime state of the storage account. To get the runtime state of a resource, pass the name or ID of a resource. In this case, you use the same variable you used to create the name of the storage account.

Finally, it returns the `primaryEndpoints` property from the storage account.

## Deploy template

You're ready to deploy the template and look at the returned value.

If you haven't created the resource group, see [Create resource group](template-tutorial-create-first-template.md#create-resource-group). The example assumes you've set the `templateFile` variable to the path to the template file, as shown in the [first tutorial](template-tutorial-create-first-template.md#deploy-template).

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addoutputs `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addoutputs \
  --resource-group myResourceGroup \
  --template-file $templateFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS
```

---

In the output for the deployment command, you see an object similar to the following example only if the output is in JSON format:

```json
{
    "dfs": "https://storeluktbfkpjjrkm.dfs.core.windows.net/",
    "web": "https://storeluktbfkpjjrkm.z19.web.core.windows.net/",
    "blob": "https://storeluktbfkpjjrkm.blob.core.windows.net/",
    "queue": "https://storeluktbfkpjjrkm.queue.core.windows.net/",
    "table": "https://storeluktbfkpjjrkm.table.core.windows.net/",
    "file": "https://storeluktbfkpjjrkm.file.core.windows.net/"
}
```

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Review your work

You've done a lot in the last six tutorials. Let's take a moment to review what you've done. You created a template with parameters that are easy to provide. The template is reusable in different environments because it allows for customization and dynamically creates needed values. It also returns information about the storage account that you could use in your script.

Now, let's look at the resource group and deployment history.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. Depending on the steps you did, you should have at least one and perhaps several storage accounts in the resource group.
1. You should also have several successful deployments listed in the history. Select that link.

   :::image type="content" source="./media/template-tutorial-add-outputs/select-deployments.png" alt-text="Screenshot of the Azure portal showing the deployments link.":::

1. You see all of your deployments in the history. Select the deployment called **addoutputs**.

   :::image type="content" source="./media/template-tutorial-add-outputs/show-history.png" alt-text="Screenshot of the Azure portal showing the deployment history.":::

1. You can review the inputs.

   :::image type="content" source="./media/template-tutorial-add-outputs/show-inputs.png" alt-text="Screenshot of the Azure portal showing the deployment inputs.":::

1. You can review the outputs.

   :::image type="content" source="./media/template-tutorial-add-outputs/show-outputs.png" alt-text="Screenshot of the Azure portal showing the deployment outputs.":::

1. You can review the template.

   :::image type="content" source="./media/template-tutorial-add-outputs/show-template.png" alt-text="Screenshot of the Azure portal showing the deployment template.":::

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

In this tutorial, you added a return value to the template. In the next tutorial, you learn how to export a template and use parts of that exported template in your template.

> [!div class="nextstepaction"]
> [Use exported template](template-tutorial-export-template.md)
