---
title: Deploy Bicep files with Azure PowerShell 
description: Use Azure Resource Manager and Azure PowerShell to deploy resources to Azure. The resources are defined in a Bicep file.
ms.topic: how-to
ms.date: 10/30/2025
ms.custom: devx-track-arm-template, devx-track-bicep, devx-track-azurepowershell
---

# Deploy Bicep files with Azure PowerShell

This article explains how to use Azure PowerShell with Bicep files to deploy your resources to Azure. If you aren't familiar with the deploying and managing your Azure solutions, see [What is Bicep?](./overview.md).

## Prerequisites

You need a Bicep file to deploy, and the file must be local. You also need Azure PowerShell and to be connected to Azure:

- **Install Azure PowerShell cmdlets on your local computer.** To deploy Bicep files, you need [Azure PowerShell](/powershell/azure/install-azure-powershell) version 5.6.0 or later. For more information, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).
- **Install the Bicep CLI.** You must [install the Bicep CLI manually](install.md#install-manually) since Azure PowerShell doesn't automatically install it.
- **Use [`Connect-AzAccount`](/powershell/module/az.accounts/connect-azaccount)** to connect to Azure. If you have multiple Azure subscriptions, you might also need to run [`Set-AzContext`](/powershell/module/Az.Accounts/Set-AzContext). For more information, see [Use multiple Azure subscriptions](/powershell/azure/manage-subscriptions-azureps).

If you don't have PowerShell installed, you can use Azure Cloud Shell. For more information, see [Deploy Bicep files with Azure Cloud Shell](./deploy-cloud-shell.md).

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands, and the user deploying the Bicep file must have the required permissions to create resources for every scope.

- To deploy to a **resource group**, use [`New-AzResourceGroupDeployment`](/powershell/module/az.resources/new-azresourcegroupdeployment):

  ```azurepowershell
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-bicep>
  ```

- To deploy to a **subscription**, use [`New-AzSubscriptionDeployment`](/powershell/module/az.resources/new-azdeployment), which is an alias of the `New-AzDeployment` cmdlet:

  ```azurepowershell
  New-AzSubscriptionDeployment -Location <location> -TemplateFile <path-to-bicep>
  ```

  For more information about subscription-level deployments, see [Use Bicep to deploy resources to subscription](deploy-to-subscription.md).

- To deploy to a **management group**, use [`New-AzManagementGroupDeployment`](/powershell/module/az.resources/New-AzManagementGroupDeployment).

  ```azurepowershell
  New-AzManagementGroupDeployment -ManagementGroupId <management-group-id> -Location <location> -TemplateFile <path-to-bicep>
  ```

  For more information about management-group-level deployments, see [Use Bicep to deploy resources to management group](deploy-to-management-group.md).

- To deploy to a **tenant**, use [`New-AzTenantDeployment`](/powershell/module/az.resources/new-aztenantdeployment).

  ```azurepowershell
  New-AzTenantDeployment -Location <location> -TemplateFile <path-to-bicep>
  ```

  For more information about tenant-level deployments, see [Use Bicep to deploy resources to tenant](deploy-to-tenant.md).

## Deploy local Bicep file

This section describes how to deploy a local Bicep file. You can deploy a Bicep file from your local machine or an external one.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters and can't end in a period.

```azurepowershell
New-AzResourceGroup -Name ExampleGroup -Location "Central US"
```

To deploy a local Bicep file, use the `-TemplateFile` switch in the deployment command:

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile <path-to-bicep>
```

The deployment can take several minutes to complete.

## Deploy remote Bicep file

Azure PowerShell doesn't currently support deploying remote Bicep files. You can use the [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) to [build](/cli/azure/bicep) the Bicep file to a JSON template and then load the JSON file to a remote location. For more information, see [Deploy remote template](../templates/deploy-cli.md#deploy-remote-template).

## Parameters

To pass parameter values, you can use either inline parameters or a parameters file. The parameters file can be either a [Bicep parameters file](#bicep-parameters-files) or a [JSON parameters file](#json-parameters-files).

### Inline parameters

To pass inline parameters, provide the names of the parameter with the `New-AzResourceGroupDeployment` command. For example, to pass a string and array to a Bicep file, use:

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-bicep> `
  -exampleString "inline string" `
  -exampleArray $arrayParam
```

You can use the `TemplateParameterObject` parameter to pass through a hashtable that contains the parameters for the template:

```powershell
$params = @{
  exampleString = "inline string"
  exampleArray = "value1", "value2"
}

New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-bicep> `
  -TemplateParameterObject $params
```

You can also get the contents of file and provide that content as an inline parameter:

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-bicep> `
  -exampleString $(Get-Content -Path c:\MyTemplates\stringcontent.txt -Raw) `
  -exampleArray $arrayParam
```

Getting a parameter value from a file is helpful when you need to provide configuration values. For example, you can provide [cloud-init values for a Linux virtual machine](/azure/virtual-machines/linux/using-cloud-init).

If you need to pass in an array of objects, create hash tables in Azure PowerShell and add them to an array. Pass that array as a parameter during deployment:

```powershell
$hash1 = @{ Name = "firstSubnet"; AddressPrefix = "10.0.0.0/24"}
$hash2 = @{ Name = "secondSubnet"; AddressPrefix = "10.0.1.0/24"}
$subnetArray = $hash1, $hash2
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-bicep> `
  -exampleArray $subnetArray
```

### Bicep parameters files

Rather than passing parameters as inline values in your script, you might find it easier to use a [Bicep parameters file](#bicep-parameters-files) or a [JSON parameters file](#json-parameters-files) that contains the parameter values. The Bicep parameters file must be a local file, while the JSON template file can be located somewhere online. For more information about parameters files, see [Create parameters files for Bicep deployment](./parameter-files.md).

You can use a Bicep parameters file to deploy a Bicep file with [Azure PowerShell](./install.md#azure-powershell) version 10.4.0 or later and [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.22.X or later. With the `using` statement within the Bicep parameters file, there's no need to provide the `-TemplateFile` switch when specifying a Bicep parameters file for the `-TemplateParameterFile` switch.

The following example shows a parameters file named _storage.bicepparam_. The file is in the same directory where the command runs:

```powershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateParameterFile storage.bicepparam
```

### JSON parameters files

The JSON parameters file can local or an external file with an accessible URI.

To pass a local parameters file, use the `TemplateParameterFile` switch with a JSON parameters file:

```powershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\BicepFiles\storage.bicep `
  -TemplateParameterFile c:\BicepFiles\storage.parameters.json
```

To pass an external parameters file, use the `TemplateParameterUri` parameter:

```powershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleResourceGroup `
  -TemplateFile c:\BicepFiles\storage.bicep `
  -TemplateParameterUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.parameters.json
```

Since the `TemplateParameterUri` parameter only supports JSON parameters files, it doesn't support `.bicepparam` files.

You can use inline parameters and a location parameters file in the same deployment operation. For more information, see [Parameter precedence](./parameter-files.md#parameter-precedence).

## Preview changes

Before deploying your Bicep file, you can preview the changes the Bicep file will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the Bicep file makes the changes that you expect. What-if also validates the Bicep file for errors.

## Deploy template specs

Azure PowerShell doesn't currently provide Bicep files to help create template specs. However, you can create a Bicep file with the [Microsoft.Resources/templateSpecs](/azure/templates/microsoft.resources/templatespecs) resource to deploy a template spec. The [Create template spec sample](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/create-template-spec/azuredeploy.bicep) shows how to create a template spec in a Bicep file. You can also build your Bicep file to JSON by using the Bicep CLI and then a JSON template to create a template spec.

## Deployment name

When deploying a Bicep file, you can give the deployment a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, its name becomes the name of the Bicep file. For example, if you deploy a Bicep file named _main.bicep_ and don't specify a deployment name, the deployment is named `main`.

Every time you run a deployment, an entry is added to the resource group's deployment history with the deployment name. If you run another deployment and give it the same name, the earlier entry is replaced with the current deployment. If you want to maintain unique entries in the deployment history, give each deployment a unique name.

To create a unique name, you can assign a random number:

```azurepowershell-interactive
$suffix = Get-Random -Maximum 1000
$deploymentName = "ExampleDeployment" + $suffix
```

Or, add a date value:

```azurepowershell-interactive
$today=Get-Date -Format "MM-dd-yyyy"
$deploymentName="ExampleDeployment"+"$today"
```

If you run concurrent deployments to the same resource group with the same deployment name, only the last deployment is completed. Any deployments with the same name that haven't finished are replaced by the last deployment. For example, if you run a deployment named `newStorage` that deploys a storage account named `storage1` and run another deployment named `newStorage` that deploys a storage account named `storage2` at the same time, you deploy only one storage account. The resulting storage account is named `storage2`.

However, if you run a deployment named `newStorage` that deploys a storage account named `storage1` and immediately run another deployment named `newStorage` that deploys a storage account named `storage2` after the first deployment finishes, then you have two storage accounts. One is named `storage1`, and the other is named `storage2`. But, you only have one entry in the deployment history.

When you specify a unique name for each deployment, you can run them concurrently without conflict. If you run a deployment named `newStorage1` that deploys a storage account named `storage1` and run another deployment named `newStorage2` that deploys a storage account named `storage2` at the same time, then you have two storage accounts and two entries in the deployment history.

To avoid conflicts with concurrent deployments and to ensure unique entries in the deployment history, give each deployment a unique name.

## Next steps

To learn how to define parameters in your file, see [Understand the structure and syntax of Bicep files](file.md).
