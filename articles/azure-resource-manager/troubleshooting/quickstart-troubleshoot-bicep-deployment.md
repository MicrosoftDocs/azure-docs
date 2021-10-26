---
title: Troubleshoot Bicep file deployments
description: Learn how to monitor and troubleshoot Bicep file deployments. Shows activity logs and deployment history.
ms.date: 11/01/2021
ms.topic: quickstart
ms.custom: devx-track-azurepowershell
---

# Quickstart: Troubleshoot Bicep file deployments

This quickstart describes how to troubleshoot Bicep file deployment errors. You'll set up a file with two errors and learn how to use the activity logs and deployment history to fix the errors.

There are two types of errors that are related to a deployment:

- **Validation errors** occur before a deployment begins and are caused by syntax errors in your file.
- **Deployment errors** occur during the deployment process and can be caused by an incorrect value, such as an API version.

Both types of errors return an error code that you use to troubleshoot the deployment. Bicep file validation errors don't appear in your activity log or deployment history.

## Prerequisites

To complete this quickstart, you need the following items:

- If you don't have an Azure subscription, [create a free account](https://azure.microsoft.com/free/) before you begin.
- [Visual Studio Code](https://code.visualstudio.com) with the latest [Bicep extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-bicep).
- Review how to deploy a local Bicep file with [Azure Cloud Shell](../bicep/deploy-cloud-shell.md).

## Create a Bicep file with errors

The following Bicep file contains a validation error and a deployment error. You'll troubleshoot and fix the file's errors so the storage account can be deployed.

The sample file's errors are on the following two lines:

```bicep
parameter storageAccountType string = 'Standard_LRS'

resource storageAccount 'Microsoft.Storage/storageAccounts@2018-07-02'
```

1. Open Visual Studio Code and select **File** > **New File**.
1. To copy the Bicep file, select **Copy**  then paste into the new file.
1. Select **File** > **Save As** to name the file _azuredeploy.bicep_ and save it on your local computer.

```bicep
@description('Storage Account type')
@allowed([
  'Standard_LRS'
  'Standard_GRS'
  'Standard_ZRS'
  'Premium_LRS'
])
parameter storageAccountType string = 'Standard_LRS'

@description('Location for all resources.')
param location string = resourceGroup().location

var storageAccountName = 'store${uniqueString(resourceGroup().id)}'

resource storageAccount 'Microsoft.Storage/storageAccounts@2018-07-02' = {
  name: storageAccountName
  location: location
  sku: {
    name: storageAccountType
  }
  kind: 'StorageV2'
  properties: {}
}

output storageAccountName string = storageAccountName
```

## Deploy the Bicep file

Upload the Bicep file to Cloud Shell and deploy with Azure CLI or Azure PowerShell.

1. Sign in to [Cloud Shell](https://shell.azure.com).
1. Select **Bash** or **PowerShell** from the upper left corner.

    :::image type="content" source="media/quickstart-troubleshoot-bicep-deployment/cloud-shell-upload.png" alt-text="Screenshot of Azure Cloud Shell to select a shell and upload a file.":::

1. Select **Upload/Download files** and upload your _azuredeploy.bicep_ file.
1. To deploy the Bicep file, copy and paste the following commands into the shell window.

    # [Azure CLI](#tab/azure-cli)

    ```azurecli
    echo "Enter a resource group name:" &&
    read resourceGroupName &&
    echo "Enter the location (i.e. centralus):" &&
    read location &&
    az group create --name $resourceGroupName --location $location &&
    az deployment group create --resource-group $resourceGroupName --template-file $HOME/azuredeploy.bicep &&
    echo "Press [ENTER] to continue ..."
    ```

    # [PowerShell](#tab/azure-powershell)

    ```azurepowershell
    $resourceGroupName = Read-Host -Prompt "Enter a resource group name"
    $location = Read-Host -Prompt "Enter the location (i.e. centralus)"
    New-AzResourceGroup -Name "$resourceGroupName" -Location "$location"
    New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile "$HOME/azuredeploy.bicep"
    Write-Host "Press [ENTER] to continue ..."
    ```

    ---

    > [!NOTE]
    > Use the same resource group name and location as you run the deployments. When you're prompted to update the resource group select **Yes**.

## Troubleshoot the validation error

The validation error displays an error message in the shell because there's a parameter declaration problem. An error can cause other errors to appear for dependent resources.

# [Azure CLI](#tab/azure-cli)

The [Bicep linter](../bicep/linter.md) is built into Bicep CLI version 0.4 or later, and integrates with Cloud Shell to display error messages. The line and column number, such as `(8,1)`, shows where an error is located in a Bicep file.

```Output
/azuredeploy.bicep(2,1) : Error BCP147: Expected a parameter declaration after the decorator.
/azuredeploy.bicep(8,1) : Error BCP007: This declaration type is not recognized.
  Specify a parameter, variable, resource, or output declaration.
/azuredeploy.bicep(15,25) : Warning BCP081: Resource type "Microsoft.Storage/storageAccounts@2018-07-02"
  does not have types available.
/azuredeploy.bicep(19,11) : Error BCP082: The name "storageAccountType" does not exist in the current context.
  Did you mean "storageAccountName"?
```

# [PowerShell](#tab/azure-powershell)

The PowerShell output shows a generic parameter error.

```Output
New-AzResourceGroupDeployment: Cannot retrieve the dynamic parameters for the cmdlet.
Cannot find path '/tmp/11111111-1111-1111-1111-111111111111/azuredeploy.json' because it does not exist.
```

To get more information, use the `build` command to run the [Bicep linter](../bicep/linter.md). The line and column number, such as `(8,1)`, shows where an error is located in a Bicep file.

```bicep
bicep build ./azuredeploy.bicep
```

```Output
/azuredeploy.bicep(2,1) : Error BCP147: Expected a parameter declaration after the decorator.
/azuredeploy.bicep(8,1) : Error BCP007: This declaration type is not recognized.
  Specify a parameter, variable, resource, or output declaration.
/azuredeploy.bicep(15,25) : Warning BCP081: Resource type "Microsoft.Storage/storageAccounts@2018-07-02"
  does not have types available.
/azuredeploy.bicep(19,11) : Error BCP082: The name "storageAccountType" does not exist in the current context.
  Did you mean "storageAccountName"?
```

---

### Fix the validation error

The error message indicates a problem with the parameter declaration. Use Visual Studio Code to change `parameter` to `param`, and save the Bicep file. Follow the steps in [deploy the Bicep file](#deploy-the-bicep-file) to upload the file and rerun the deployment.

## Troubleshoot the deployment error

The deployment error displays an error message in the shell with the error code `NoRegisteredProviderFound`. You can also view the errors in the resource group's **Deployments** and **Activity log**.

# [Azure CLI](#tab/azure-cli)

```Output
azuredeploy.bicep(15,25) : Warning BCP081: Resource type "Microsoft.Storage/storageAccounts@2018-07-02"
does not have types available.

{"status":"Failed","error":{"code":"DeploymentFailed","message":"At least one resource deployment operation
failed. Please list deployment operations for details. Please see https://aka.ms/DeployOperations for usage
details.", details":[{"code":"BadRequest","message":"{\r\n  \"error\": {\r\n
\"code\": \"NoRegisteredProviderFound\", \r\n    \"message\": \"No registered resource provider found for
location 'centralus' and API version '2018-07-02' for type 'storageAccounts'. The supported api-versions
are '2021-06-01, 2021-05-01, 2021-04-01, 2021-02-01,2021-01-01, 2020-08-01-preview, 2019-06-01,
2019-04-01, 2018-11-01, 2018-07-01, 2018-03-01-preview, 2018-02-01,   2017-10-01, 2017-06-01, 2016-12-01,
2016-05-01, 2016-01-01, 2015-06-15, 2015-05-01-preview'.
The supported locations are 'eastus, eastus2, westus, westeurope, eastasia, southeastasia, japaneast,
japanwest, northcentralus, southcentralus, centralus, northeurope, brazilsouth, australiaeast,
australiasoutheast, southindia, centralindia, westindia, canadaeast, canadacentral, westus2, westcentralus,
uksouth, ukwest, koreacentral, koreasouth, francecentral, australiacentral, southafricanorth, uaenorth,
switzerlandnorth, germanywestcentral, norwayeast, westus3, jioindiawest'.\"\r\n  }\r\n}"}]}}
```

# [PowerShell](#tab/azure-powershell)

```Output
New-AzResourceGroupDeployment: 11:10:53 PM - The deployment 'azuredeploy' failed with error(s).
Showing 1 out of 1 error(s).
Status Message: No registered resource provider found for location 'centralus' and API version '2018-07-02'
for type 'storageAccounts'. The supported api-versions are '2021-06-01, 2021-05-01, 2021-04-01, 2021-02-01,
2021-01-01, 2020-08-01-preview, 2019-06-01, 2019-04-01, 2018-11-01, 2018-07-01, 2018-03-01-preview, 2018-02-01,
2017-10-01, 2017-06-01, 2016-12-01, 2016-05-01, 2016-01-01, 2015-06-15, 2015-05-01-preview'.
The supported locations are 'eastus, eastus2, westus, westeurope, eastasia, southeastasia, japaneast,
japanwest, northcentralus, southcentralus, centralus, northeurope, brazilsouth, australiaeast,
australiasoutheast, southindia, centralindia, westindia, canadaeast, canadacentral, westus2,
westcentralus, uksouth, ukwest, koreacentral, koreasouth, francecentral, australiacentral, southafricanorth,
uaenorth, switzerlandnorth, germanywestcentral, norwayeast, westus3, jioindiawest'.
(Code:NoRegisteredProviderFound)
CorrelationId: 11111111-1111-1111-1111-111111111111
```

To get more information from the Bicep linter, run the `build` command.

```bicep
bicep build ./azuredeploy.bicep
```

```Output
/azuredeploy.bicep(15,25) : Warning BCP081: Resource type "Microsoft.Storage/storageAccounts@2018-07-02"
  does not have types available.
```

---

### Deployments

The deployment error is shown in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Enter _resource groups_ in the search box and select **Resource groups**.

    :::image type="content" source="./media/quickstart-troubleshoot-bicep-deployment/search-box.png" alt-text="Screenshot of the Azure portal search box.":::

1. Select the deployment's resource group name.
1. Go to **Overview** and select **1 Failed**.

    :::image type="content" source="./media/quickstart-troubleshoot-bicep-deployment/bicep-file-deployment-error.png" alt-text="Screenshot that highlights the link to failed deployment.":::

1. From **Deployments** select **Error details**.

    :::image type="content" source="./media/quickstart-troubleshoot-bicep-deployment/bicep-file-deployment-error-details.png" alt-text="Screenshot of the failed deployments link to the error's details.":::

    The error message is the same as the deployment command's output:

    :::image type="content" source="./media/quickstart-troubleshoot-bicep-deployment/bicep-file-deployment-error-summary.png" alt-text="Screenshot of the deployment error's details.":::

### Activity log

You can also find the error in the resource group's activity logs. It takes a few minutes for the activity log to display the latest deployment information.

1. In the resource group, select **Activity log**.
1. Use the filters to find the log and select the log you want to view.

    :::image type="content" source="./media/quickstart-troubleshoot-bicep-deployment/bicep-file-deployment-activity-log.png" alt-text="Screenshot of the resource group's activity log that highlights a failed deployment.":::

1. After you select the log, the details are shown.

    :::image type="content" source="./media/quickstart-troubleshoot-bicep-deployment/bicep-file-deployment-activity-log-details.png" alt-text="Screenshot of the activity log details that shows a failed deployment's error message.":::

### Fix the deployment error

The deployment error **No registered resource provider found** is caused by an incorrect API version. Use Visual Studio Code to change the API version to a valid value such as `2021-04-01`, and save the Bicep file. Follow the steps in [deploy the Bicep file](#deploy-the-bicep-file) to upload the Bicep file and rerun the deployment.

After the validation and deployment errors are fixed, the storage account is created. Go to the resource group's **Overview** to view the resource. The **Deployments** and **Activity log** will show a successful deployment.

## Clean up resources

When the Azure resources are no longer needed, delete the resource group. You can delete the resource group from Cloud Shell or the portal.

# [Azure CLI](#tab/azure-cli)

Replace `<rgname>` including the angle brackets with your resource group name.

```azurecli
az group delete --name <rgname>
```

# [PowerShell](#tab/azure-powershell)

Replace `<rgname>` including the angle brackets with your resource group name.

```azurepowershell
Remove-AzResourceGroup -Name <rgname>
```

---

To delete the resource group from the portal, follow these steps:

1. In the Azure portal, enter **Resource groups** in the search box.
1. In the **Filter by name** field, enter the resource group name.
1. Select the resource group name.
1. Select **Delete resource group**.
1. To confirm the deletion, enter the resource group name and select **Delete**.

## Next steps

In this quickstart, you learned how to troubleshoot Bicep file deployment errors.

> [!div class="nextstepaction"]
> [Troubleshoot common Azure deployment errors](common-deployment-errors.md)
