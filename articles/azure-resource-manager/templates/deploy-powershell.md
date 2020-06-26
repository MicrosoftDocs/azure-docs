---
title: Deploy resources with PowerShell and template
description: Use Azure Resource Manager and Azure PowerShell to deploy resources to Azure. The resources are defined in a Resource Manager template.
ms.topic: conceptual
ms.date: 06/04/2020
---
# Deploy resources with ARM templates and Azure PowerShell

Learn how to use Azure PowerShell with Azure Resource Manager (ARM) templates to deploy your resources to Azure. For more information about the concepts of deploying and managing your Azure solutions, see [template deployment overview](overview.md).

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. In most cases, you'll target deployment to a resource group. To apply policies and role assignments across a larger scope, use subscription, management group, or tenant deployments. When deploying to a subscription, you can create a resource group and deploy resources to it.

Depending on the scope of the deployment, you use different commands.

* To deploy to a **resource group**, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

  ```azurepowershell
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-template>
  ```

* To deploy to a **subscription**, use New-AzSubscriptionDeployment:

  ```azurepowershell
  New-AzSubscriptionDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [New-AzManagementGroupDeployment](/powershell/module/az.resources/New-AzManagementGroupDeployment).

  ```azurepowershell
  New-AzManagementGroupDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

  ```azurepowershell
  New-AzTenantDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

The examples in this article use resource group deployments.

## Prerequisites

You need a template to deploy. If you don't already have one, download and save an [example template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json) from the Azure Quickstart templates repo. The local file name used in this article is **c:\MyTemplates\azuredeploy.json**.

Unless you use the Azure Cloud Shell to deploy templates, you need to install Azure PowerShell and connect to Azure:

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

Instead of storing ARM templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

To deploy an external template, use the **TemplateUri** parameter. Use the URI in the example to deploy the sample template from GitHub.

```azurepowershell
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template shouldn't include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. However, if you don't want your template to be publicly accessible, you can protect it by storing it in a private storage container. For information about deploying a template that requires a shared access signature (SAS) token, see [Deploy private template with SAS token](secure-template-with-sas-token.md). To go through a tutorial, see [Tutorial: Integrate Azure Key Vault in ARM template deployment](template-tutorial-use-key-vault.md).

## Preview changes

Before deploying your template, you can preview the changes the template will make to your environment. Use the [what-if operation](template-deploy-what-if.md) to verify that the template makes the changes that you expect. What-if also validates the template for errors.

## Deploy from Azure Cloud Shell

You can use the [Azure Cloud Shell](https://shell.azure.com) to deploy your template. To deploy an external template, provide the URI of the template. To deploy a local template, you must first load your template into the storage account for your Cloud Shell. To upload files to the shell, select the **Upload/Download files** menu icon from the shell window.

To open the Cloud Shell, browse to [https://shell.azure.com](https://shell.azure.com), or select **Try-It** from the following code section:

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the Resource Group name"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location
New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json
```

To paste the code into the shell, right-click inside the shell and then select **Paste**.

## Pass parameter values

To pass parameter values, you can use either inline parameters or a parameter file.

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

Getting a parameter value from a file is helpful when you need to provide configuration values. For example, you can provide [cloud-init values for a Linux virtual machine](../../virtual-machines/linux/using-cloud-init.md).

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

For more information about the parameter file, see [Create Resource Manager parameter file](parameter-files.md).

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

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](template-syntax.md).
- For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](secure-template-with-sas-token.md).
