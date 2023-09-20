---
title: Deploy resources with PowerShell and Bicep
description: Use Azure Resource Manager and Azure PowerShell to deploy resources to Azure. The resources are defined in a Bicep file.
ms.topic: conceptual
ms.custom: devx-track-arm-template, devx-track-bicep, devx-track-azurepowershell
ms.date: 06/05/2023
---

# Deploy resources with Bicep and Azure PowerShell

This article explains how to use Azure PowerShell with Bicep files to deploy your resources to Azure. If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [Bicep overview](overview.md).

## Prerequisites

You need a Bicep file to deploy. The file must be local.

You need Azure PowerShell and to be connected to Azure:

- **Install Azure PowerShell cmdlets on your local computer.** To deploy Bicep files, you need [Azure PowerShell](/powershell/azure/install-azure-powershell) version **5.6.0 or later**. For more information, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).
- **Install Bicep CLI.** Azure PowerShell doesn't automatically install the Bicep CLI. Instead, you must [manually install the Bicep CLI](install.md#install-manually).
- **Connect to Azure by using [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount)**. If you have multiple Azure subscriptions, you might also need to run [Set-AzContext](/powershell/module/Az.Accounts/Set-AzContext). For more information, see [Use multiple Azure subscriptions](/powershell/azure/manage-subscriptions-azureps).

If you don't have PowerShell installed, you can use Azure Cloud Shell. For more information, see [Deploy Bicep files from Azure Cloud Shell](./deploy-cloud-shell.md).

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands.

- To deploy to a **resource group**, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

  ```azurepowershell
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-bicep>
  ```

- To deploy to a **subscription**, use [New-AzSubscriptionDeployment](/powershell/module/az.resources/new-azdeployment), which is an alias of the `New-AzDeployment` cmdlet:

  ```azurepowershell
  New-AzSubscriptionDeployment -Location <location> -TemplateFile <path-to-bicep>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

- To deploy to a **management group**, use [New-AzManagementGroupDeployment](/powershell/module/az.resources/New-AzManagementGroupDeployment).

  ```azurepowershell
  New-AzManagementGroupDeployment -ManagementGroupId <management-group-id> -Location <location> -TemplateFile <path-to-bicep>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

- To deploy to a **tenant**, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

  ```azurepowershell
  New-AzTenantDeployment -Location <location> -TemplateFile <path-to-bicep>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

For every scope, the user deploying the template must have the required permissions to create resources.

## Deploy local Bicep file

You can deploy a Bicep file from your local machine or one that is stored externally. This section describes deploying a local Bicep file.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```azurepowershell
New-AzResourceGroup -Name ExampleGroup -Location "Central US"
```

To deploy a local Bicep file, use the `-TemplateFile` switch in the deployment command.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile <path-to-bicep>
```

The deployment can take several minutes to complete.

## Deploy remote Bicep file

Currently, Azure PowerShell doesn't support deploying remote Bicep files. Use [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) to [build](/cli/azure/bicep#az-bicep-build) the Bicep file to a JSON template, and then load the JSON file to the remote location.

## Parameters

To pass parameter values, you can use either inline parameters or a parameters file.

### Inline parameters

To pass inline parameters, provide the names of the parameter with the `New-AzResourceGroupDeployment` command. For example, to pass a string and array to a Bicep file, use:

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-bicep> `
  -exampleString "inline string" `
  -exampleArray $arrayParam
```

You can also get the contents of file and provide that content as an inline parameter.

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-bicep> `
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
  -TemplateFile <path-to-bicep> `
  -exampleArray $subnetArray
```

### Parameters files

Rather than passing parameters as inline values in your script, you may find it easier to use a `.bicepparam` file or a JSON file that contains the parameter values. The parameters file can be a local file or an external file with an accessible URI.

For more information about the parameters file, see [Create Resource Manager parameters file](./parameter-files.md).

To pass a local parameters file, use the `TemplateParameterFile` parameter with a `.bicepparam` file:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\BicepFiles\storage.bicep `
  -TemplateParameterFile c:\BicepFiles\storage.bicepparam
```

To pass a local parameters file, use the `TemplateParameterFile` parameter with a JSON parameters file:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\BicepFiles\storage.bicep `
  -TemplateParameterFile c:\BicepFiles\storage.parameters.json
```

To pass an external parameters file, use the `TemplateParameterUri` parameter:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\BicepFiles\storage.bicep `
  -TemplateParameterUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.parameters.json
```

The `TemplateParameterUri` parameter doesn't support `.bicepparam` files, it only supports JSON parameters files.

## Preview changes

Before deploying your Bicep file, you can preview the changes the Bicep file will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the Bicep file makes the changes that you expect. What-if also validates the Bicep file for errors.

## Deploy template specs

Currently, Azure PowerShell doesn't support creating template specs by providing Bicep files. However you can create a Bicep file with the [Microsoft.Resources/templateSpecs](/azure/templates/microsoft.resources/templatespecs) resource to deploy a template spec. The [Create template spec sample](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/create-template-spec/azuredeploy.bicep) shows how to create a template spec in a Bicep file. You can also build your Bicep file to JSON by using the Bicep CLI, and then create a template spec with the JSON template.

## Deployment name

When deploying a Bicep file, you can give the deployment a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, the name of the Bicep file is used. For example, if you deploy a Bicep named `main.bicep` and don't specify a deployment name, the deployment is named `main`.

Every time you run a deployment, an entry is added to the resource group's deployment history with the deployment name. If you run another deployment and give it the same name, the earlier entry is replaced with the current deployment. If you want to maintain unique entries in the deployment history, give each deployment a unique name.

To create a unique name, you can assign a random number.

```azurepowershell-interactive
$suffix = Get-Random -Maximum 1000
$deploymentName = "ExampleDeployment" + $suffix
```

Or, add a date value.

```azurepowershell-interactive
$today=Get-Date -Format "MM-dd-yyyy"
$deploymentName="ExampleDeployment"+"$today"
```

If you run concurrent deployments to the same resource group with the same deployment name, only the last deployment is completed. Any deployments with the same name that haven't finished are replaced by the last deployment. For example, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage` that deploys a storage account named `storage2`, you deploy only one storage account. The resulting storage account is named `storage2`.

However, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and immediately after it completes you run another deployment named `newStorage` that deploys a storage account named `storage2`, then you have two storage accounts. One is named `storage1`, and the other is named `storage2`. But, you only have one entry in the deployment history.

When you specify a unique name for each deployment, you can run them concurrently without conflict. If you run a deployment named `newStorage1` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage2` that deploys a storage account named `storage2`, then you have two storage accounts and two entries in the deployment history.

To avoid conflicts with concurrent deployments and to ensure unique entries in the deployment history, give each deployment a unique name.

## Next steps

- To understand how to define parameters in your file, see [Understand the structure and syntax of Bicep files](file.md).
