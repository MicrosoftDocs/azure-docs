---
title: Tutorial - Create & deploy Bicep template
description: Create your first Azure Resource Manager template (ARM template) in Bicep. In the tutorial, you learn about the Bicep template file syntax and how to deploy a storage account.
author: mumian
ms.date: 02/19/2021
ms.topic: tutorial
ms.author: jgao
ms.custom:

#Customer intent: As a developer new to Azure deployment, I want to learn how to use Visual Studio Code to create and edit Resource Manager templates in Bicep, so I can use the templates to deploy Azure resources.

---

# Tutorial: Create and deploy your first ARM template in Bicep

This tutorial introduces you to Azure Resource Manager templates (ARM templates) in Bicep. It shows you how to create a starter Bicep template and deploy it to Azure. You'll learn about the structure of the Bicep template and the tools you'll need for working with Bicep templates. It takes about **12 minutes** to complete this tutorial, but the actual time will vary based on how many tools you need to install.

This tutorial is the first of a series. As you progress through the series, you modify the starting Bicep template step by step until you've explored all of the core parts of an ARM Bicep template. These elements are the building blocks for much more complex templates. We hope by the end of the series you're confident creating your own Bicep templates and ready to automate your deployments with Bicep templates.

If you want to learn about the benefits of using templates and why you should automate deployment with templates, see [ARM Bicep template overview](bicep-overview.md).

If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.

## Get tools

Let's start by making sure you have the tools you need to create and deploy Bicep templates. Install these tools on your local machine.

### Editor

[jgao - update the vs code and extension installation link]

To create Bicep templates, you need a good editor. We recommend Visual Studio Code with the Bicep extension. If you need to install these tools, see [Quickstart: Create ARM Bicep templates with Visual Studio Code](quickstart-create-bicep-templates-use-visual-studio-code.md).

### Command-line deployment

[jgao - need to provide the PowerShell and CLI versions]

You also need either Azure PowerShell or Azure CLI to deploy the template. If you use Azure CLI, you must have the latest version. For the installation instructions, see:

- [Install Azure PowerShell](/powershell/azure/install-az-ps)
- [Install Azure CLI on Windows](/cli/azure/install-azure-cli-windows)
- [Install Azure CLI on Linux](/cli/azure/install-azure-cli-linux)
- [Install Azure CLI on macOS](/cli/azure/install-azure-cli-macos)

After installing either Azure PowerShell or Azure CLI, make sure you sign in for the first time. For help, see [Sign in - PowerShell](/powershell/azure/install-az-ps#sign-in) or [Sign in - Azure CLI](/cli/azure/get-started-with-azure-cli#sign-in).

> [!IMPORTANT]
> If you're using Azure CLI, make sure you have version 2.6 or later. The commands shown in this tutorial will not work if you're using earlier versions. To check your installed version, use: `az --version`.

Okay, you're ready to start learning about templates.

## Create your first template

1. Open Visual Studio Code with the Bicep extension installed.
1. From the **File** menu, select **New File** to create a new file.
1. From the **File** menu, select **Save as**.
1. Name the file _azuredeploy_ and select the _bicep_ file extension. The complete name of the file is _azuredeploy.bicep_.
1. Save the file to your workstation. Select a path that is easy to remember because you'll provide that path later when deploying the template.
1. Copy and paste the following Bicep into the file:

    ```bicep
    resource provide_unique_name 'Microsoft.Storage/storageAccounts@2019-06-01' = {
      name: '{provide-unique-name}'
      location: 'eastus'
      sku: {
        name: 'Standard_LRS'
      }
      kind: 'StorageV2'
      properties: {
        supportsHttpsTrafficOnly: true
      }
    }
    ```

    Here's what your Visual Studio Code environment looks like:

    ![ARM Bicep template Visual Studio Code first template](./media/template-tutorial-bicep-create-first-template/resource-manager-visual-studio-code-first-template.png)

    The resource declaration has four components:

    - **resource**: keyword.
    - **symbolic name** (stg): This is an identifier for referencing the resource throughout your bicep file. It is not what the name of the resource will be when it's deployed. The name of the resource is defined by the **name** property.  See the fourth component in this list.
    - **resource type** (Microsoft.Storage/storageAccounts@2019-06-01): It is composed of the resource provider (Microsoft.Storage), resource type (storageAccounts), and apiVersion (2019-06-01). Each resource provider publishes its own API versions, so this value is specific to the type. You can find more types and apiVersions for various Azure resources from [ARM template reference](/azure/templates/).
    - **properties** (everything inside = {...}): These are the specific properties you would like to specify for the given resource type. These are exactly the same properties available to you in an ARM Template. Every resource has a `name` property. Most resources also have a `location` property, which sets the region where the resource is deployed. The other properties vary by resource type and API version. It's important to understand the connection between the API version and the available properties, so let's jump into more detail.

        For this storage account, you can see that API version at [storageAccounts 2019-06-01](/azure/templates/microsoft.storage/2019-06-01/storageaccounts). Notice that you didn't add all of the properties to your template. Many of the properties are optional. The `Microsoft.Storage` resource provider could release a new API version, but the version you're deploying doesn't have to change. You can continue using that version and know that the results of your deployment will be consistent.

        If you view an older API version, such as [storageAccounts 2016-05-01](/azure/templates/microsoft.storage/2016-05-01/storageaccounts), you'll see that a smaller set of properties are available.

        If you decide to change the API version for a resource, make sure you evaluate the properties for that version and adjust your template appropriately.

1. Replace `{provide-unique-name}` including the curly braces `{}` with a unique storage account name.

    > [!IMPORTANT]
    > The storage account name must be unique across Azure. The name must have only lowercase letters or numbers. It can be no longer than 24 characters. You might try a naming pattern like using **store1** as a prefix and then adding your initials and today's date. For example, the name you use could look like **store1abc09092019**.

    Guessing a unique name for a storage account isn't easy and doesn't work well for automating large deployments. Later in this tutorial series, you'll use template features that make it easier to create a unique name.

1. Save the file.

Congratulations, you've created your first Bicep template.

## Sign in to Azure

To start working with Azure PowerShell/Azure CLI, sign in with your Azure credentials.

Select the tabs in the following code sections to choose between Azure PowerShell and Azure CLI. The CLI examples in this article are written for the Bash shell.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Connect-AzAccount
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az login
```

---

If you have multiple Azure subscriptions, select the subscription you want to use. Replace `[SubscriptionID/SubscriptionName]` and the square brackets `[]` with your subscription information:

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Set-AzContext [SubscriptionID/SubscriptionName]
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az account set --subscription [SubscriptionID/SubscriptionName]
```

---

## Create resource group

When you deploy a template, you specify a resource group that will contain the resources. Before running the deployment command, create the resource group with either Azure CLI or Azure PowerShell.

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
  --location "Central US"
```

---

[jgao - do we need this part?]

Optionally, you can compile the Bicep with _bicep build azuredeploy.bicep, and the output is:

## Deploy template

To deploy the Bicep template, use either Azure CLI or Azure PowerShell. Use the resource group you created. Give a name to the deployment so you can easily identify it in the deployment history. For convenience, also create a variable that stores the path to the Bicep template file. This variable makes it easier for you to run the deployment commands because you don't have to retype the path every time you deploy. Replace `{provide-the-path-to-the-template-file}` including the curly braces `{}` with the path to your Bicep template file with the .bicep file extension name.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$templateFile = "{provide-the-path-to-the-template-file}"
New-AzResourceGroupDeployment `
  -Name firsttemplate `
  -ResourceGroupName myResourceGroup `
  -TemplateFile $templateFile
```

# [Azure CLI](#tab/azure-cli)

To run this deployment command, you must have the [latest version](/cli/azure/install-azure-cli) of Azure CLI.

```azurecli
templateFile="{provide-the-path-to-the-template-file}"
az deployment group create \
  --name firsttemplate \
  --resource-group myResourceGroup \
  --template-file $templateFile
```

---

The deployment command returns results. Look for `ProvisioningState` to see whether the deployment succeeded.

[jgao - update the screenshots with the new template file extension name.]

# [PowerShell](#tab/azure-powershell)

![PowerShell deployment provisioning state](./media/template-tutorial-bicep-create-first-template/resource-manager-deployment-provisioningstate.png)

# [Azure CLI](#tab/azure-cli)

![Azure CLI deployment provisioning state](./media/template-tutorial-bicep-create-first-template/azure-cli-provisioning-state.png)

---

> [!NOTE]
> If the deployment failed, use the `verbose` switch to get information about the resources being created. Use the `debug` switch to get more information for debugging.

## Verify deployment

[jgao - update the screenshots with the new deployment name and the deployed storage account.]

You can verify the deployment by exploring the resource group from the Azure portal.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. From the left menu, select **Resource groups**.

1. Select the resource group deploy in the last procedure. The default name is **myResourceGroup**. You shall see no resource deployed within the resource group.

1. Notice in the upper right of the overview, the status of the deployment is displayed. Select **1 Succeeded**.

   ![View deployment status](./media/template-tutorial-bicep-create-first-template/deployment-status.png)

1. You see a history of deployment for the resource group. Select **firsttemplate**.

   ![Select deployment](./media/template-tutorial-bicep-create-first-template/select-from-deployment-history.png)

1. You see a summary of the deployment. In this case, there's not a lot to see because no resources were deployed. Later in this series you might find it helpful to review the summary in the deployment history. Notice on the left you can view inputs, outputs, and the template used during deployment.

   ![View deployment summary](./media/template-tutorial-bicep-create-first-template/view-deployment-summary.png)

## Clean up resources

If you're moving on to the next tutorial, you don't need to delete the resource group.

If you're stopping now, you might want to delete the resource group.

1. From the Azure portal, select **Resource group** from the left menu.
2. Enter the resource group name in the **Filter by name** field.
3. Select the resource group name.
4. Select **Delete resource group** from the top menu.

## Next steps

You created a simple template to deploy to Azure. In the next tutorial, you'll add a storage account to the template and deploy it to your resource group.

> [!div class="nextstepaction"]
> [Add parameters](template-tutorial-bicep-add-parameters.md)
