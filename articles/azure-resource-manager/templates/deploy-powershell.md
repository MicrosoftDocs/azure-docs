---
title: Deploy resources with PowerShell and template
description: Use Azure Resource Manager and Azure PowerShell to deploy resources to Azure. The resources are defined in a Resource Manager template.
ms.topic: conceptual
ms.date: 05/22/2023
ms.custom: devx-track-azurepowershell, devx-track-arm-template
---

# Deploy resources with ARM templates and Azure PowerShell

This article explains how to use Azure PowerShell with Azure Resource Manager templates (ARM templates) to deploy your resources to Azure. If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [template deployment overview](overview.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [Deploy resources with Bicep and Azure PowerShell](../bicep/deploy-powershell.md).

## Prerequisites

You need a template to deploy. If you don't already have one, download and save an [example template](https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json) from the Azure Quickstart templates repo. The local file name used in this article is _C:\MyTemplates\azuredeploy.json_.

You need to install Azure PowerShell and connect to Azure:

- **Install Azure PowerShell cmdlets on your local computer.** For more information, see [Get started with Azure PowerShell](/powershell/azure/get-started-azureps).
- **Connect to Azure by using [Connect-AZAccount](/powershell/module/az.accounts/connect-azaccount)**. If you have multiple Azure subscriptions, you might also need to run [Set-AzContext](/powershell/module/Az.Accounts/Set-AzContext). For more information, see [Use multiple Azure subscriptions](/powershell/azure/manage-subscriptions-azureps).

If you don't have PowerShell installed, you can use Azure Cloud Shell. For more information, see [Deploy ARM templates from Azure Cloud Shell](deploy-cloud-shell.md).

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands.

- To deploy to a **resource group**, use [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment):

  ```azurepowershell
  New-AzResourceGroupDeployment -ResourceGroupName <resource-group-name> -TemplateFile <path-to-template>
  ```

- To deploy to a **subscription**, use [New-AzSubscriptionDeployment](/powershell/module/az.resources/new-azdeployment) which is an alias of the `New-AzDeployment` cmdlet:

  ```azurepowershell
  New-AzSubscriptionDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

- To deploy to a **management group**, use [New-AzManagementGroupDeployment](/powershell/module/az.resources/New-AzManagementGroupDeployment).

  ```azurepowershell
  New-AzManagementGroupDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

- To deploy to a **tenant**, use [New-AzTenantDeployment](/powershell/module/az.resources/new-aztenantdeployment).

  ```azurepowershell
  New-AzTenantDeployment -Location <location> -TemplateFile <path-to-template>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

For every scope, the user deploying the template must have the required permissions to create resources.

## Deployment name

When deploying an ARM template, you can give the deployment a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, the name of the template file is used. For example, if you deploy a template named `azuredeploy.json` and don't specify a deployment name, the deployment is named `azuredeploy`.

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

## Deploy local template

You can deploy a template from your local machine or one that is stored externally. This section describes deploying a local template.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```azurepowershell
New-AzResourceGroup -Name ExampleGroup -Location "Central US"
```

To deploy a local template, use the `-TemplateFile` parameter in the deployment command. The following example also shows how to set a parameter value that comes from the template.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name ExampleDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateFile <path-to-template>
```

The deployment can take several minutes to complete.

## Deploy remote template

Instead of storing ARM templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

[!INCLUDE [Deploy templates in private GitHub repo](../../../includes/resource-manager-private-github-repo-templates.md)]

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```azurepowershell
New-AzResourceGroup -Name ExampleGroup -Location "Central US"
```

To deploy an external template, use the `-TemplateUri` parameter.

```azurepowershell
New-AzResourceGroupDeployment `
  -Name remoteTemplateDeployment `
  -ResourceGroupName ExampleGroup `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template shouldn't include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. However, if you want to manage access to the template, consider using [template specs](#deploy-template-spec).

To deploy remote linked templates with relative path that are stored in a storage account, use `QueryString` to specify the SAS token:

```azurepowershell
New-AzResourceGroupDeployment `
  -Name linkedTemplateWithRelativePath `
  -ResourceGroupName "myResourceGroup" `
  -TemplateUri "https://stage20210126.blob.core.windows.net/template-staging/mainTemplate.json" `
  -QueryString "$sasToken"
```

For more information, see [Use relative path for linked templates](./linked-templates.md#linked-template).

## Deploy template spec

Instead of deploying a local or remote template, you can create a [template spec](template-specs.md). The template spec is a resource in your Azure subscription that contains an ARM template. It makes it easy to securely share the template with users in your organization. You use Azure role-based access control (Azure RBAC) to grant access to the template spec. This feature is currently in preview.

The following examples show how to create and deploy a template spec.

First, create the template spec by providing the ARM template.

```azurepowershell
New-AzTemplateSpec `
  -Name storageSpec `
  -Version 1.0 `
  -ResourceGroupName templateSpecsRg `
  -Location westus2 `
  -TemplateJsonFile ./mainTemplate.json
```

Then, get the ID for template spec and deploy it.

```azurepowershell
$id = (Get-AzTemplateSpec -Name storageSpec -ResourceGroupName templateSpecsRg -Version 1.0).Versions.Id

New-AzResourceGroupDeployment `
  -ResourceGroupName demoRG `
  -TemplateSpecId $id
```

For more information, see [Azure Resource Manager template specs](template-specs.md).

## Preview changes

Before deploying your template, you can preview the changes the template will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the template makes the changes that you expect. What-if also validates the template for errors.

## Pass parameter values

To pass parameter values, you can use either inline parameters or a parameter file.

### Inline parameters

To pass inline parameters, provide the names of the parameter with the `New-AzResourceGroupDeployment` command. For example, to pass a string and array to a template, use:

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-template> `
  -exampleString "inline string" `
  -exampleArray $arrayParam
```

You can also get the contents of file and provide that content as an inline parameter.

```powershell
$arrayParam = "value1", "value2"
New-AzResourceGroupDeployment -ResourceGroupName testgroup `
  -TemplateFile <path-to-template> `
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
  -TemplateFile <path-to-template> `
  -exampleArray $subnetArray
```

### Parameter files

Rather than passing parameters as inline values in your script, you may find it easier to use a JSON file that contains the parameter values. The parameter file can be a local file or an external file with an accessible URI.

For more information about the parameter file, see [Create Resource Manager parameter file](parameter-files.md).

To pass a local parameter file, use the `TemplateParameterFile` parameter:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateFile <path-to-template> `
  -TemplateParameterFile c:\MyTemplates\storage.parameters.json
```

To pass an external parameter file, use the `TemplateParameterUri` parameter:

```powershell
New-AzResourceGroupDeployment -Name ExampleDeployment -ResourceGroupName ExampleResourceGroup `
  -TemplateUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json `
  -TemplateParameterUri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.parameters.json
```

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](./syntax.md).
- For information about deploying a template that requires a SAS token, see [Deploy private ARM template with SAS token](secure-template-with-sas-token.md).
