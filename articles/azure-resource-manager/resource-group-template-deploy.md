---
title: Deploy resources with PowerShell and template | Microsoft Docs
description: Use Azure Resource Manager and Azure PowerShell to deploy resources to Azure. The resources are defined in a Resource Manager template.
author: tfitzmac
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 05/31/2019
ms.author: tomfitz

---
# Deploy resources with Resource Manager templates and Azure PowerShell

Learn how to use Azure PowerShell with Resource Manager templates to deploy your resources to Azure. For more information about the concepts of deploying and managing your Azure solutions, see [Azure Resource Manager overview](resource-group-overview.md).

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

## Deployment scope

You can target your deployment to either an Azure subscription or a resource group within a subscription. In most cases, you'll target deployment to a resource group. Use subscription deployments to apply policies and role assignments across the subscription. You also use subscription deployments to create a resource group and deploy resources to it. Depending on the scope of the deployment, you use different commands.

To deploy to a **resource group**, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

```azurepowershell
New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-template>
```

To deploy to a **subscription**, use [New-AzDeployment](/powershell/module/az.resources/new-azdeployment):

```azurepowershell
New-AzDeployment -Location <location> -TemplateFile <path-to-template>
```

Currently, management group deployments are only supported through the REST API. See [Deploy resources with Resource Manager templates and Resource Manager REST API](resource-group-template-deploy-rest.md).

The examples in this article use resource group deployments. For more information about subscription deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

## Prerequisites

You need a template to deploy. If you don't already have one, download and save an [example template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json) from the Azure Quickstart templates repo. The local file name used in this article is **c:\MyTemplates\azuredeploy.json**.

Unless you use the Azure Cloud shell to deploy templates, you need to install Azure PowerShell and connect to Azure:

- **Install Azure PowerShell cmdlets on your local computer.** For more information, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).
- **Connect to Azure by using [Connect-AZAccount](/powershell/module/az.accounts/connect-azaccount)**. If you have multiple Azure subscriptions, you might also need to run [Set-AzContext](/powershell/module/Az.Accounts/Set-AzContext). For more information, see [Use multiple Azure subscriptions](/powershell/azure/manage-subscriptions-azureps).

## Deploy local template

The following example creates a resource group, and deploys a template from your local machine. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. It can't end in a period.

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateFile c:\MyTemplates\azuredeploy.json
```

The deployment can take a few minutes to complete.

## Deploy remote template

Instead of storing Resource Manager templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

To deploy an external template, use the **TemplateUri** parameter. Use the URI in the example to deploy the sample template from GitHub.

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template shouldn't include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. However, if you don't want your template to be publicly accessible, you can protect it by storing it in a private storage container. For information about deploying a template that requires a shared access signature (SAS) token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md). To go through a tutorial, see [Tutorial: Integrate Azure Key Vault in Resource Manager Template deployment](./resource-manager-tutorial-use-key-vault.md).

## Deploy from Azure Cloud shell

You can use the [Azure Cloud Shell](https://shell.azure.com) to deploy your template. To deploy an external template, provide the URI of the template. To deploy a local template, you must first load your template into the storage account for your Cloud Shell. To upload files to the shell, select the **Upload/Download files** menu icon from the shell window.

To open the Cloud shell, browse to [https://shell.azure.com](https://shell.azure.com), or select **Try-It** from the following code section:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```

To paste the code into the shell, right-click inside the shell and then select **Paste**.

## Redeploy when deployment fails

This feature is also known as *Rollback on error*. When a deployment fails, you can automatically redeploy an earlier, successful deployment from your deployment history. To specify redeployment, use either the `-RollbackToLastDeployment` or `-RollBackDeploymentName` parameter in the deployment command. This functionality is useful if you've got a known good state for your infrastructure deployment and want to revert to this state. There are a number of caveats and restrictions:

- The redeployment is run exactly as it was run previously with the same parameters. You can't change the parameters.
- The previous deployment is run using the [complete mode](./deployment-modes.md#complete-mode). Any resources not included in the previous deployment are deleted, and any resource configurations are set to their previous state. Make sure you fully understand the [deployment modes](./deployment-modes.md).
- The redeployment only affects the resources, any data changes aren't affected.
- This feature is only supported on Resource Group deployments, not subscription level deployments. For more information about subscription level deployment, see [Create resource groups and resources at the subscription level](./deploy-to-subscription.md).

To use this option, your deployments must have unique names so they can be identified in the history. If you don't have unique names, the current failed deployment might overwrite the previously successful deployment in the history. You can only use this option with root level deployments. Deployments from a nested template aren't available for redeployment.

To redeploy the last successful deployment, add the `-RollbackToLastDeployment` parameter as a flag.

```azurepowershell-interactive
New-AzResourceGroupDeployment -Name ExampleDeployment02 `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile c:\MyTemplates\azuredeploy.json `
  -RollbackToLastDeployment
```

To redeploy a specific deployment, use the `-RollBackDeploymentName` parameter and provide the name of the deployment.

```azurepowershell-interactive
New-AzResourceGroupDeployment -Name ExampleDeployment02 `
  -ResourceGroupName $resourceGroupName `
  -TemplateFile c:\MyTemplates\azuredeploy.json `
  -RollBackDeploymentName ExampleDeployment01
```

The specified deployment must have succeeded.

## Pass parameter values

To pass parameter values, you can use either inline parameters or a parameter file. The preceding examples in this article show inline parameters.

### Inline parameters

To pass inline parameters, provide the names of the parameter with the `New-AzResourceGroupDeployment` command. For example, to pass a string and array to a template, use:

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile c:\MyTemplates\demotemplate.json `
  -exampleString "inline string" `
  -exampleArray $arrayParam
```

You can also get the contents of file and provide that content as an inline parameter.

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile c:\MyTemplates\demotemplate.json `
  -exampleString $(Get-Content -Path c:\MyTemplates\stringcontent.txt -Raw) `
  -exampleArray $arrayParam
```

Getting a parameter value from a file is helpful when you need to provide configuration values. For example, you can provide [cloud-init values for a Linux virtual machine](../virtual-machines/linux/using-cloud-init.md).

If you need to pass in an array of objects, create hash tables in PowerShell and add them to an array. Pass that array as a parameter during deployment.

```powershell
$hash1 = @{ Name = "firstSubnet"; AddressPrefix = "10.0.0.0/24"}
$hash2 = @{ Name = "secondSubnet"; AddressPrefix = "10.0.1.0/24"}
$subnetArray = $hash1, $hash2
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile c:\MyTemplates\demotemplate.json `
  -exampleArray $subnetArray
```


### Parameter files

Rather than passing parameters as inline values in your script, you may find it easier to use a JSON file that contains the parameter values. The parameter file can be a local file or an external file with an accessible URI.

The parameter file must be in the following format:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
     "storageAccountType": {
         "value": "Standard_GRS"
     }
  }
}
```

Notice that the parameters section includes a parameter name that matches the parameter defined in your template (storageAccountType). The parameter file contains a value for the parameter. This value is automatically passed to the template during deployment. You can create more than one parameter file, and then pass in the appropriate parameter file for the scenario.

Copy the preceding example and save it as a file named `storage.parameters.json`.

To pass a local parameter file, use the **TemplateParameterFile** parameter:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\MyTemplates\azuredeploy.json `
  -TemplateParameterFile c:\MyTemplates\storage.parameters.json
```

To pass an external parameter file, use the **TemplateParameterUri** parameter:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json `
  -TemplateParameterUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.parameters.json
```

### Parameter precedence

You can use inline parameters and a local parameter file in the same deployment operation. For example, you can specify some values in the local parameter file and add other values inline during deployment. If you provide values for a parameter in both the local parameter file and inline, the inline value takes precedence.

However, when you use an external parameter file, you can't pass other values either inline or from a local file. When you specify a parameter file in the **TemplateParameterUri** parameter, all inline parameters are ignored. Provide all parameter values in the external file. If your template includes a sensitive value that you can't include in the parameter file, either add that value to a key vault, or dynamically provide all parameter values inline.

### Parameter name conflicts

If your template includes a parameter with the same name as one of the parameters in the PowerShell command, PowerShell presents the parameter from your template with the postfix **FromTemplate**. For example, a parameter named **ResourceGroupName** in your template conflicts with the **ResourceGroupName** parameter in the [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment) cmdlet. You're prompted to provide a value for **ResourceGroupNameFromTemplate**. In general, you should avoid this confusion by not naming parameters with the same name as parameters used for deployment operations.

## Test template deployments

To test your template and parameter values without actually deploying any resources, use [Test-​Azure​Rm​Resource​Group​Deployment](/powershell/module/az.resources/test-azresourcegroupdeployment). 

```powershell
Test-AzResourceGroupDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\MyTemplates\azuredeploy.json -storageAccountType Standard_GRS
```

If no errors are detected, the command finishes without a response. If an error is detected, the command returns an error message. For example, passing an incorrect value for the storage account SKU, returns the following error:

```powershell
Test-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile c:\MyTemplates\azuredeploy.json -storageAccountType badSku

Code    : InvalidTemplate
Message : Deployment template validation failed: 'The provided value 'badSku' for the template parameter 'storageAccountType'
          at line '15' and column '24' is not valid. The parameter value is not part of the allowed value(s):
          'Standard_LRS,Standard_ZRS,Standard_GRS,Standard_RAGRS,Premium_LRS'.'.
Details :
```

If your template has a syntax error, the command returns an error indicating it couldn't parse the template. The message indicates the line number and position of the parsing error.

```powershell
Test-AzResourceGroupDeployment : After parsing a value an unexpected character was encountered: 
  ". Path 'variables', line 31, position 3.
```

## Next steps

- To safely roll out your service to more than one region, see [Azure Deployment Manager](deployment-manager-overview.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of Azure Resource Manager templates](resource-group-authoring-templates.md).
- For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](resource-manager-powershell-sas-token.md).
