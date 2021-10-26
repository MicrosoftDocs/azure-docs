---
title: Troubleshoot ARM template deployments
description: Learn how to monitor and troubleshoot Azure Resource Manager template (ARM template) deployments. Shows activity logs and deployment history.
ms.date: 11/01/2021
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
---

# Quickstart: Troubleshoot ARM template deployments

This quickstart describes how to troubleshoot Azure Resource Manager template (ARM template) deployment errors. You'll set up a template with two errors and learn how to use the activity logs and deployment history to fix the errors.

There are two types of errors that are related to template deployment:

- **Validation errors** occur before a deployment begins and are caused by syntax errors in your file.
- **Deployment errors** occur during the deployment process and can be caused by an incorrect value, such as an API version.

Both types of errors return an error code that you use to troubleshoot the deployment. Both types of errors appear in the activity log. Validation errors don't appear in your deployment history because the deployment never started.

## Prerequisites

To complete this quickstart, you need the following items:

- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com/) with the latest [Azure Resource Manager Tools extension](https://marketplace.visualstudio.com/items?itemName=msazurermtools.azurerm-vscode-tools).
- Review how to deploy a local template with [Azure Cloud Shell](../templates/deploy-cloud-shell.md#deploy-local-template).

## Create a template with errors

The following template contains a validation error and a deployment error. You'll troubleshoot and fix the template's errors so the storage account can be deployed.

Both of the sample template's errors are on the following line:

```json
"apiVersion1": "2018-07-02",
```

1. Open Visual Studio Code and select **File** > **New File**.
1. To copy the template, select **Copy**  then paste into the new file.
1. Select **File** > **Save As** to name the file _azuredeploy.json_ and save it on your local computer.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "storageAccountType": {
      "type": "string",
      "defaultValue": "Standard_LRS",
      "allowedValues": [
        "Standard_LRS",
        "Standard_GRS",
        "Standard_ZRS",
        "Premium_LRS"
      ],
      "metadata": {
        "description": "Storage Account type"
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Location for all resources."
      }
    }
  },
  "variables": {
    "storageAccountName": "[concat('store', uniquestring(resourceGroup().id))]"
  },
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion1": "2018-07-02",
      "name": "[variables('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "[parameters('storageAccountType')]"
      },
      "kind": "StorageV2",
      "properties": {}
    }
  ],
  "outputs": {
    "storageAccountName": {
      "type": "string",
      "value": "[variables('storageAccountName')]"
    }
  }
}
```

## Deploy the template

Upload the template to Cloud Shell and deploy with Azure CLI or Azure PowerShell.

1. Sign in to [Cloud Shell](https://shell.azure.com).
1. Select **Bash** or **PowerShell** from the upper left corner.

    :::image type="content" source="media/quickstart-troubleshoot-arm-deployment/cloud-shell-upload.png" alt-text="Screenshot of Azure Cloud Shell to select a shell and upload a file.":::

1. Select **Upload/Download files** and upload your _azuredeploy.json_ file.
1. To deploy the template, copy and paste the following commands into the shell window.

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter a resource group name"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    New-AzResourceGroup -Name "$resourceGroupName" -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "$HOME/azuredeploy.json"
    Write-Host "Press [ENTER] to continue ..."
    ```

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    echo "Enter a resource group name:" &&
    read resourceGroupName &&
    echo "Enter the location (i.e. centralus):" &&
    read location &&
    az group create --name $resourceGroupName --location $location &&
    az deployment group create --resource-group $resourceGroupName --template-file $HOME/azuredeploy.json &&
    echo "Press [ENTER] to continue ..."
    ```

    ---

    > [!NOTE]
    > Use the same resource group name and location as you run the deployments. When you're prompted to update the resource group select **Yes**.

## Troubleshoot the validation error

The validation error displays an error message in the shell with the error code `InvalidRequestContent`.

# [PowerShell](#tab/azure-powershell)

```Output
New-AzResourceGroupDeployment: 6:49:10 PM - Error: Code=InvalidRequestContent; Message=The request content
was invalid and could not be deserialized: 'Could not find member 'apiVersion1' on object of type
'TemplateResource'. Path 'properties.template.resources[0].apiVersion1', line 34, position 24.'.

New-AzResourceGroupDeployment: The deployment validation failed
```

# [Azure CLI](#tab/azure-cli)

```Output
{"error":{"code":"InvalidRequestContent","message":"The request content was invalid and could not be
deserialized: 'Could not find member 'apiVersion1' on object of type 'TemplateResource'.
Path 'properties.template.resources[0].apiVersion1', line 32, position 20.'."}}
```

---

### Fix the validation error

The error is because `apiVersion1` is incorrect. Use Visual Studio Code to change `apiVersion1` to `apiVersion`, and save the template. Follow the steps in [deploy the template](#deploy-the-template) to upload the template and rerun the deployment.

## Troubleshoot the deployment error

The deployment error displays an error message in the shell with the error code `NoRegisteredProviderFound`. You can also view the errors in the resource group's **Deployments** and **Activity log**.

# [PowerShell](#tab/azure-powershell)

```Output
New-AzResourceGroupDeployment: 6:51:48 PM - The deployment 'azuredeploy' failed with error(s).
Showing 1 out of 1 error(s).
Status Message: No registered resource provider found for location 'centralus' and API version '2018-07-02'
for type 'storageAccounts'. The supported api-versions are '2021-06-01, 2021-05-01, 2021-04-01, 2021-02-01,
2021-01-01, 2020-08-01-preview, 2019-06-01, 2019-04-01, 2018-11-01, 2018-07-01, 2018-03-01-preview,
2018-02-01, 2017-10-01, 2017-06-01, 2016-12-01, 2016-05-01, 2016-01-01, 2015-06-15, 2015-05-01-preview'.
The supported locations are 'eastus, eastus2, westus, westeurope, eastasia, southeastasia, japaneast,
japanwest, northcentralus, southcentralus, centralus, northeurope, brazilsouth, australiaeast,
australiasoutheast, southindia, centralindia, westindia, canadaeast, canadacentral, westus2, westcentralus,
uksouth, ukwest, koreacentral, koreasouth, francecentral, australiacentral, southafricanorth, uaenorth,
switzerlandnorth, germanywestcentral, norwayeast, westus3, jioindiawest'.
(Code:NoRegisteredProviderFound)
CorrelationId: 11111111-1111-1111-1111-111111111111
```

# [Azure CLI](#tab/azure-cli)

```Output
{"status":"Failed","error":{"code":"DeploymentFailed","message":"At least one resource deployment operation
failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage
details.", "details":[{"code":"BadRequest","message":"{\r\n  \"error\": {\r\n
\"code\": \"NoRegisteredProviderFound\", \r\n    \"message\": \"No registered resource provider found for
location 'centralus' and API version '2018-07-02' for type 'storageAccounts'. The supported api-versions
are '2021-06-01, 2021-05-01, 2021-04-01, 2021-02-01, 2021-01-01, 2020-08-01-preview, 2019-06-01,
2019-04-01, 2018-11-01, 2018-07-01, 2018-03-01-preview, 2018-02-01, 2017-10-01, 2017-06-01, 2016-12-01,
2016-05-01, 2016-01-01, 2015-06-15, 2015-05-01-preview'.
The supported locations are 'eastus, eastus2, westus, westeurope, eastasia, southeastasia, japaneast,
japanwest, northcentralus, southcentralus, centralus, northeurope, brazilsouth, australiaeast,
australiasoutheast, southindia, centralindia, westindia, canadaeast, canadacentral, westus2, westcentralus,
uksouth, ukwest, koreacentral, koreasouth, francecentral, australiacentral, southafricanorth, uaenorth,
switzerlandnorth, germanywestcentral, norwayeast, westus3, jioindiawest'.\"\r\n  }\r\n}"}]}}
```

---

### Deployments

The deployment error can be viewed in the Azure portal using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Enter _resource groups_ in the search box and select **Resource groups**.

    :::image type="content" source="./media/quickstart-troubleshoot-arm-deployment/search-box.png" alt-text="Screenshot of the Azure portal search box.":::

1. Select the deployment's resource group name.
1. Go to **Overview** and select the link **1 Failed**.

    :::image type="content" source="./media/quickstart-troubleshoot-arm-deployment/arm-template-deployment-error.png" alt-text="Screenshot that highlights the link to failed deployment.":::

1. From **Deployments** select **Error details**.

    :::image type="content" source="./media/quickstart-troubleshoot-arm-deployment/arm-template-deployment-error-details.png" alt-text="Screenshot of the failed deployments link to the error's details.":::

    The error message is the same as the deployment command's output:

    :::image type="content" source="./media/quickstart-troubleshoot-arm-deployment/arm-template-deployment-error-summary.png" alt-text="Screenshot of the deployment error's details.":::

### Activity log

You can also find the error in the resource group's activity logs. It takes a few minutes for the activity log to display the latest deployment information.

1. In the resource group, select **Activity log**.
1. Use the filters to find the log and select the log you want to view.

    :::image type="content" source="./media/quickstart-troubleshoot-arm-deployment/arm-template-deployment-activity-log.png" alt-text="Screenshot of the resource group's activity log that highlights a failed deployment.":::

1. After you select the log, the details are shown.

    :::image type="content" source="./media/quickstart-troubleshoot-arm-deployment/arm-template-deployment-activity-log-details.png" alt-text="Screenshot of the activity log details that shows a failed deployment's error message.":::

### Fix the deployment error

The deployment error **No registered resource provider found** is caused by an incorrect API version. Use Visual Studio Code to change the API version to a valid value such as `2021-04-01`, and save the template. Follow the steps in [deploy the template](#deploy-the-template) to upload the template and rerun the deployment.

After the validation and deployment errors are fixed, the storage account is created. Go to the resource group's **Overview** to view the resource. The **Deployments** and **Activity log** will show a successful deployment.

## Clean up resources

When the Azure resources are no longer needed, delete the resource group. You can delete the resource group from Cloud Shell or the portal.

# [PowerShell](#tab/azure-powershell)

Replace `<rgname>` including the angle brackets with your resource group name.

```azurepowershell
Remove-AzResourceGroup -Name <rgname>
```

# [Azure CLI](#tab/azure-cli)

Replace `<rgname>` including the angle brackets with your resource group name.

```azurecli
az group delete --name <rgname>
```

---

To delete the resource group from the portal, follow these steps:

1. In the Azure portal, enter **Resource groups** in the search box.
1. In the **Filter by name** field, enter the resource group name.
1. Select the resource group name.
1. Select **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

## Next steps

In this quickstart, you learned how to troubleshoot ARM template deployment errors.

> [!div class="nextstepaction"]
> [Troubleshoot common Azure deployment errors](common-deployment-errors.md)
