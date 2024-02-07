---
title: Tutorial - Create and deploy template
description: Create your first Azure Resource Manager template (ARM template). In the tutorial, you learn about the template file syntax and how to deploy a storage account.
ms.date: 07/28/2023
ms.topic: tutorial
ms.custom: devx-track-arm-template
#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Azure Resource Manager templates, so I can use them to deploy Azure resources.
---

# Tutorial: Create and deploy your first ARM template

This tutorial introduces you to Azure Resource Manager templates (ARM templates). It shows you how to create a starter template and deploy it to Azure. It teaches you about the template structure and the tools you need to work with templates. This instruction takes **12 minutes** to complete, but the actual finish time varies based on how many tools you need to install.

This tutorial is the first of a series. As you progress through the series, you modify the starting template, step by step, until you explore all of the core parts of an ARM template. These elements are the building blocks for more complex templates. We hope by the end of the series you're confident in creating your own templates and ready to automate your deployments with templates.

If you want to learn about the benefits of using templates and why you should automate deployments with templates, see [ARM template overview](overview.md). To learn about ARM templates through a guided set of [Learn modules](/training), see [Deploy and manage resources in Azure by using JSON ARM templates](/training/paths/deploy-manage-resource-manager-templates).

If you don't have a Microsoft Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

> [!TIP]
> If you're new to ARM templates, you might consider learning Bicep instead. Bicep is a new language that offers the same capabilities as ARM templates but with an easier-to-use syntax. To start learning Bicep, see [Quickstart: Create Bicep files with Visual Studio Code](../bicep/quickstart-create-bicep-use-visual-studio-code.md).

## Get tools

Let's start by making sure you have the tools you need to create and deploy templates. Install these tools on your local machine.

### Editor

Templates are JavaScript Object Notation (JSON) files. To create templates, you need a good JSON editor. We recommend Visual Studio Code with the Azure Resource Manager Tools extension. If you need to install these tools, see [Quickstart: Create ARM templates with Visual Studio Code](quickstart-create-templates-use-visual-studio-code.md).

### Command-line deployment

You also need either Azure PowerShell or Azure Command-Line Interface (CLI) to deploy the template. If you use Azure CLI, you need to have version 2.37.0 or later. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-azure-powershell)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

After installing either Azure PowerShell or Azure CLI, make sure you sign in for the first time. For help, see [Sign in - PowerShell](/powershell/azure/install-az-ps#sign-in) or [Sign in - Azure CLI](/cli/azure/get-started-with-azure-cli#sign-in).

> [!IMPORTANT]
> If you're using Azure CLI, make sure you have version 2.37.0 or later. If you're using Azure PowerShell, make sure you have version 7.2.4 or later. The commands shown in this tutorial don't work if you're using earlier versions. To check your installed version, use: `az --version`.

Okay, you're ready to start learning about templates.

## Create your first template

1. Open Visual Studio Code with the installed ARM processor Tools extension.
1. From the **File** menu, select **New File** to create a new file.
1. From the **File** menu, select **Save As**.
1. Name the file _azuredeploy_ and select the _json_ file extension. The complete name of the file is _azuredeploy.json_.
1. Save the file to your workstation. Select a path that's easy to remember because you need to provide that path later when deploying the template.
1. Copy and paste the following JSON into the file:

    ```json
    {
      "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
      "contentVersion": "1.0.0.0",
      "resources": []
    }
    ```

    Here's what your Visual Studio Code environment looks like:

    :::image type="content" source="./media/template-tutorial-create-first-template/resource-manager-visual-studio-code-first-template.png" alt-text="Screenshot of Visual Studio Code displaying an empty ARM template with JSON structure in the editor.":::

    This template doesn't deploy any resources. We're starting with a blank template so you can get familiar with the steps to deploy a template while minimizing the chance of something going wrong.

    The JSON file has these elements:

    - `$schema`: Specifies the location of the JSON schema file. The schema file describes the properties that are available within a template. The schema, for example, defines `resources` as one of the valid properties for a template. Don't worry that the date for the schema is 2019-04-01. This schema version is up to date and includes all of the latest features. The schema date hasn't been changed because there have been no breaking changes since its introduction.
    - `contentVersion`: Specifies the version of the template, such as 1.0.0.0. You can provide any value for this element. Use this value to document significant changes in your template. When you deploy resources using the template, you can use this value to make sure you're using the right template.
    - `resources`: Contains the resources you want to deploy or update. Currently, it's empty, but you can add resources later.

1. Save the file.

Congratulations, you've created your first template.

## Sign in to Azure

To start working with Azure PowerShell or Azure CLI, sign in with your Azure credentials.

Select the tabs in the following code sections to pick between Azure PowerShell and Azure CLI. The CLI examples in this article are written for the Bash shell.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

---

If you have multiple Azure subscriptions, choose the subscription you want to use. Replace `SubscriptionName` with your subscription name. You can also use your subscription ID instead of your subscription name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzContext SubscriptionName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az account set --subscription SubscriptionName
```

---

## Create resource group

When you deploy a template, you can specify a resource group to contain the resources. Before running the deployment command, create the resource group with either the Bash Azure CLI or Azure PowerShell.

> [!NOTE]
> Samples for the Azure CLI are written for the bash shell. To run this sample in Windows PowerShell or the Command Prompt, you may need to remove the back slashes and write the command as one line such as:

```az group create --name myResourceGroup --location "Central US"```

# [PowerShell](#tab/azure-powershell)

```azurepowershell
New-AzResourceGroup `
  -Name myResourceGroup `
  -Location "Central US"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az group create \
  --name myResourceGroup \
  --location 'Central US'
```

---

## Deploy template

To deploy the template, use either Azure CLI or Azure PowerShell. Use the resource group you created. Give a name to the deployment so you can easily identify it in the deployment history. For convenience, also create a variable that stores the path to the template file. This variable makes it easier for you to run the deployment commands because you don't have to retype the path every time you deploy. Replace `{provide-the-path-to-the-template-file}` and the curly braces `{}` with the path to your template file.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$templateFile = "{provide-the-path-to-the-template-file}"
New-AzResourceGroupDeployment `
  -Name blanktemplate `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you need to have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
templateFile="{provide-the-path-to-the-template-file}"
az deployment group create \
  --name blanktemplate \
  --resource-group myResourceGroup \
  --template-file $templateFile
```

---

The deployment command returns results. Look for `ProvisioningState` to see whether the deployment succeeded.

# [PowerShell](#tab/azure-powershell)

  :::image type="content" source="./media/template-tutorial-create-first-template/resource-manager-deployment-provisioningstate.png" alt-text="Screenshot of PowerShell output showing the successful deployment provisioning state.":::

# [Azure CLI](#tab/azure-cli)

  :::image type="content" source="./media/template-tutorial-create-first-template/azure-cli-provisioning-state.png" alt-text="Screenshot of Azure CLI output displaying the successful deployment provisioning state.":::

---

> [!NOTE]
> If the deployment fails, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the left menu, select **Resource groups**.

1. Check the box to the left of **myResourceGroup** and select **myResourceGroup**.

1. Select the resource group you created in the earlier procedure. The default name is **myResourceGroup**. The resource group doesn't have any resources yet because you deployed a blank template.

1. Notice in the middle of the overview, in the **Essentials** section, the page displays the deployment status next to **Deployments**. Select **1 Succeeded**.

    :::image type="content" source="./media/template-tutorial-create-first-template/deployment-status.png" alt-text="Screenshot of Azure portal showing the deployment status in the Essentials section of the resource group.":::

1. You see a history of deployment for the resource group. Check the box to the left of **blanktemplate** and select **blanktemplate**.

    :::image type="content" source="./media/template-tutorial-create-first-template/select-from-deployment-history.png" alt-text="Screenshot of Azure portal displaying the deployment history with the blanktemplate deployment selected.":::

1. You see a summary of the deployment. In this case, there's not a lot to see because no resources are deployed. Later in this series you might find it helpful to review the summary in the deployment history. Notice on the left you can see inputs, outputs, and  the template that the deployment used.

    :::image type="content" source="./media/template-tutorial-create-first-template/view-deployment-summary.png" alt-text="Screenshot of Azure portal showing the deployment summary for the blanktemplate deployment.":::

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource groups** from the left menu.
2. Type the resource group name in the **Filter for any field...** text field.
3. Check the box next to **myResourceGroup** and select **myResourceGroup** or your resource group name.
4. Select **Delete resource group** from the top menu.

    :::image type="content" source="./media/template-tutorial-create-first-template/resource-deletion.png" alt-text="Screenshot of Azure portal with the Delete resource group option highlighted in the resource group view.":::

## Next steps

You created a simple template to deploy to Azure. In the next tutorial, you can learn how to add a storage account to the template and deploy it to your resource group.

> [!div class="nextstepaction"]
> [Add resource](template-tutorial-add-resource.md)
