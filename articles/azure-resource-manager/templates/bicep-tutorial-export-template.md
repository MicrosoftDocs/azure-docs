---
title: Tutorial - Export JSON template from the Azure portal for Bicep development
description: Learn how to use an exported JSON template to complete your Bicep development.
author: mumian
ms.date: 03/10/2021
ms.topic: tutorial
ms.author: jgao
---

# Tutorial: Use exported JSON template from the Azure portal

In this tutorial series, you've created a Bicep file to deploy an Azure storage account. In the next two tutorials, you add an *App Service plan* and a *website*. Instead of creating templates from scratch, you learn how to export JSON templates from the Azure portal and how to use sample templates from the [Azure Quickstart templates](https://azure.microsoft.com/resources/templates/). You customize those templates for your use. This tutorial focuses on exporting templates, and customizing the result for your Bicep file. It takes about **14 minutes** to complete.

[!INCLUDE [Bicep preview](../../../includes/resource-manager-bicep-preview.md)]

## Prerequisites

We recommend that you complete the [tutorial about outputs](bicep-tutorial-add-outputs.md), but it's not required.

You must have Visual Studio Code with the Bicep extension, and either Azure PowerShell or Azure CLI. For more information, see [Bicep tools](bicep-tutorial-create-first-bicep.md#get-tools).

## Review Bicep file

At the end of the previous tutorial, your Bicep file had the following contents:

:::code language="bicep" source="~/resourcemanager-templates/get-started-with-templates/add-outputs/azuredeploy.bicep":::

This Bicep file works well for deploying storage accounts, but you might want to add more resources to it. You can export a JSON template from an existing resource to quickly get the JSON for that resource. And then convert the JSON to Bicep before you can add it to your Bicep file.

## Create App Service plan

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select **Create a resource**.
1. In **Search the Marketplace**, enter **App Service plan**, and then select **App Service plan**.  Don't select **App Service plan (classic)**
1. Select **Create**.
1. Enter:

    - **Subscription**: select your Azure subscription.
    - **Resource Group**: Select **Create new** and then specify a name. Provide a different resource group name than the one you have been using in this tutorial series.
    - **Name**: enter a name for the App service plan.
    - **Operating System**: select **Linux**.
    - **Region**: select an Azure location. For example, **Central US**.
    - **Pricing tier**: to save costs, change the SKU to **Basic B1** (under Dev/Test).

    ![Resource Manager template export template portal](./media/bicep-tutorial-export-template/resource-manager-template-export.png)
1. Select **Review and create**.
1. Select **Create**. It takes a few moments to create the resource.

## Export template

Currently, the Azure portal only supports exporting JSON templates. There are tools you can use to decompile JSON templates to Bicep files.

1. Select **Go to resource**.

    ![Go to resource](./media/bicep-tutorial-export-template/resource-manager-template-export-go-to-resource.png)

1. Select **Export template**.

    ![Resource Manager template export template](./media/bicep-tutorial-export-template/resource-manager-template-export-template.png)

   The export template feature takes the current state of a resource and generates a template to deploy it. Exporting a template can be a helpful way of quickly getting the JSON you need to deploy a resource.

1. The `Microsoft.Web/serverfarms` definition and the parameter definition are the parts that you need.

    ![Resource Manager template export template exported template](./media/bicep-tutorial-export-template/resource-manager-template-exported-template.png)

    > [!IMPORTANT]
    > Typically, the exported template is more verbose than you might want when creating a template. For example, the SKU object in the exported template has five properties. This template works, but you could just use the `name` property. You can start with the exported template, and then modify it as you like to fit your requirements.

1. Select **Download**.  The downloaded zip file contains a **template.json** and a **parameters.json**. Unzip the files.
1. Browse to **https://bicepdemo.z22.web.core.windows.net/**, select **Decompile**, and then open **template.json**. You get the template in Bicep.

## Revise existing Bicep file

The decomplied exported template gives you most of the Bicep you need, but you need to customize it for your Bicep file. Pay particular attention to differences in parameters and variables between your Bicep file and the exported Bicep file. Obviously, the export process doesn't know the parameters and variables that you've already defined in your Bicep file.

The following example shows the additions to your Bicep file. It contains the exported code plus some changes. First, it changes the name of the parameter to match your naming convention. Second, it uses your location parameter for the location of the app service plan. Third, it removes some of the properties where the default value is fine.

Copy the whole file and replace your Bicep file with its contents.

:::code language="bicep" source="~/resourcemanager-templates/get-started-with-templates/export-template/azuredeploy.bicep" range="1-53" highlight="18,34-51":::

## Deploy Bicep file

Use either Azure CLI or Azure PowerShell to deploy a Bicep file.

If you haven't created the resource group, see [Create resource group](bicep-tutorial-create-first-bicep.md#create-resource-group). The example assumes you've set the `bicepFile` variable to the path to the Bicep file, as shown in the [first tutorial](bicep-tutorial-create-first-bicep.md#deploy-bicep-file).

# [PowerShell](#tab/azure-powershell)

To run this deployment cmdlet, you must have the [latest version](/powershell/azure/install-az-ps) of Azure PowerShell.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name addappserviceplan `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $bicepFile `
  -storagePrefix "store" `
  -storageSKU Standard_LRS
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
az deployment group create \
  --name addappserviceplan \
  --resource-group myResourceGroup \
  --template-file $bicepFile \
  --parameters storagePrefix=store storageSKU=Standard_LRS
```

---

> [!NOTE]
> If the deployment failed, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. From the left menu, select **Resource groups**.
1. Select the resource group you deployed to.
1. The resource group contains a storage account and an App Service plan.

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to clean up the resources you deployed by deleting the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You learned how to export a JSON template from the Azure portal, how to convert the JSON template to a Bicep file, and how to use the exported template for your Bicep development. You can also use the Azure Quickstart templates to simplify Bicep development.

> [!div class="nextstepaction"]
> [Use Azure Quickstart templates](bicep-tutorial-quickstart-template.md)
