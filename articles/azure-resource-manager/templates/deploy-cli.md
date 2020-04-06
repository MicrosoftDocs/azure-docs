---
title: Deploy resources with Azure CLI and template
description: Use Azure Resource Manager and Azure CLI to deploy resources to Azure. The resources are defined in a Resource Manager template.
ms.topic: conceptual
ms.date: 03/25/2020
---
# Deploy resources with ARM templates and Azure CLI

This article explains how to use Azure CLI with Azure Resource Manager (ARM) templates to deploy your resources to Azure. If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [template deployment overview](overview.md).

The deployment commands changed in Azure CLI version 2.2.0. The examples in this article require Azure CLI version 2.2.0 or later.

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

If you don't have Azure CLI installed, you can use the [Cloud Shell](#deploy-template-from-cloud-shell).

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. In most cases, you'll target deployment to a resource group. To apply policies and role assignments across a larger scope, use subscription, management group, or tenant deployments. When deploying to a subscription, you can create a resource group and deploy resources to it.

Depending on the scope of the deployment, you use different commands.

To deploy to a **resource group**, use [az deployment group create](/cli/azure/deployment/group?view=azure-cli-latest#az-deployment-group-create):

```azurecli-interactive
az deployment group create --resource-group <resource-group-name> --template-file <path-to-template>
```

To deploy to a **subscription**, use [az deployment sub create](/cli/azure/deployment/sub?view=azure-cli-latest#az-deployment-sub-create):

```azurecli-interactive
az deployment sub create --location <location> --template-file <path-to-template>
```

For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

To deploy to a **management group**, use [az deployment mg create](/cli/azure/deployment/mg?view=azure-cli-latest#az-deployment-mg-create):

```azurecli-interactive
az deployment mg create --location <location> --template-file <path-to-template>
```

For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

To deploy to a **tenant**, use [az deployment tenant create](/cli/azure/deployment/tenant?view=azure-cli-latest#az-deployment-tenant-create):

```azurecli-interactive
az deployment tenant create --location <location> --template-file <path-to-template>
```

For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

The examples in this article use resource group deployments.

## Deploy local template

When deploying resources to Azure, you:

1. Sign in to your Azure account
2. Create a resource group that serves as the container for the deployed resources. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. It can't end in a period.
3. Deploy to the resource group the template that defines the resources to create

A template can include parameters that enable you to customize the deployment. For example, you can provide values that are tailored for a particular environment (such as dev, test, and production). The sample template defines a parameter for the storage account SKU.

The following example creates a resource group, and deploys a template from your local machine:

```azurecli-interactive
az group create --name ExampleGroup --location "Central US"
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters storageAccountType=Standard_GRS
```

The deployment can take a few minutes to complete. When it finishes, you see a message that includes the result:

```output
"provisioningState": "Succeeded",
```

## Deploy remote template

Instead of storing ARM templates on your local machine, you may prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

To deploy an external template, use the **template-uri** parameter. Use the URI in the example to deploy the sample template from GitHub.

```azurecli-interactive
az group create --name ExampleGroup --location "Central US"
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/101-storage-account-create/azuredeploy.json" \
  --parameters storageAccountType=Standard_GRS
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template shouldn't include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. However, if you don't want your template to be publicly accessible, you can protect it by storing it in a private storage container. For information about deploying a template that requires a shared access signature (SAS) token, see [Deploy private template with SAS token](secure-template-with-sas-token.md).

[!INCLUDE [resource-manager-cloud-shell-deploy.md](../../../includes/resource-manager-cloud-shell-deploy.md)]

In the Cloud Shell, use the following commands:

```azurecli-interactive
az group create --name examplegroup --location "South Central US"
az deployment group create --resource-group examplegroup \
  --template-uri <copied URL> \
  --parameters storageAccountType=Standard_GRS
```

## Parameters

To pass parameter values, you can use either inline parameters or a parameter file.

### Inline parameters

To pass inline parameters, provide the values in `parameters`. For example, to pass a string and array to a template is a Bash shell, use:

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file demotemplate.json \
  --parameters exampleString='inline string' exampleArray='("value1", "value2")'
```

If you're using Azure CLI with Windows Command Prompt (CMD) or PowerShell, pass the array in the format: `exampleArray="['value1','value2']"`.

You can also get the contents of file and provide that content as an inline parameter.

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file demotemplate.json \
  --parameters exampleString=@stringContent.txt exampleArray=@arrayContent.json
```

Getting a parameter value from a file is helpful when you need to provide configuration values. For example, you can provide [cloud-init values for a Linux virtual machine](../../virtual-machines/linux/using-cloud-init.md).

The arrayContent.json format is:

```json
[
    "value1",
    "value2"
]
```

### Parameter files

Rather than passing parameters as inline values in your script, you may find it easier to use a JSON file that contains the parameter values. The parameter file must be a local file. External parameter files aren't supported with Azure CLI.

For more information about the parameter file, see [Create Resource Manager parameter file](parameter-files.md).

To pass a local parameter file, use `@` to specify a local file named storage.parameters.json.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters @storage.parameters.json
```

## Handle extended JSON format

To deploy a template with multi-line strings or comments, you must use the `--handle-extended-json-format` switch.  For example:

```json
{
  "type": "Microsoft.Compute/virtualMachines",
  "apiVersion": "2018-10-01",
  "name": "[variables('vmName')]", // to customize name, change it in variables
  "location": "[
    parameters('location')
    ]", //defaults to resource group location
  /*
    storage account and network interface
    must be deployed first
  */
  "dependsOn": [
    "[resourceId('Microsoft.Storage/storageAccounts/', variables('storageAccountName'))]",
    "[resourceId('Microsoft.Network/networkInterfaces/', variables('nicName'))]"
  ],
```

## Test a template deployment

To test your template and parameter values without actually deploying any resources, use [az deployment group validate](/cli/azure/group/deployment).

```azurecli-interactive
az deployment group validate \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters @storage.parameters.json
```

If no errors are detected, the command returns information about the test deployment. In particular, notice that the **error** value is null.

```output
{
  "error": null,
  "properties": {
      ...
```

If an error is detected, the command returns an error message. For example, passing an incorrect value for the storage account SKU, returns the following error:

```output
{
  "error": {
    "code": "InvalidTemplate",
    "details": null,
    "message": "Deployment template validation failed: 'The provided value 'badSKU' for the template parameter
      'storageAccountType' at line '13' and column '20' is not valid. The parameter value is not part of the allowed
      value(s): 'Standard_LRS,Standard_ZRS,Standard_GRS,Standard_RAGRS,Premium_LRS'.'.",
    "target": null
  },
  "properties": null
}
```

If your template has a syntax error, the command returns an error indicating it couldn't parse the template. The message indicates the line number and position of the parsing error.

```output
{
  "error": {
    "code": "InvalidTemplate",
    "details": null,
    "message": "Deployment template parse failed: 'After parsing a value an unexpected character was encountered:
      \". Path 'variables', line 31, position 3.'.",
    "target": null
  },
  "properties": null
}
```

## Next steps

- To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
- To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
- To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](template-syntax.md).
- For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
- For information about deploying a template that requires a SAS token, see [Deploy private template with SAS token](secure-template-with-sas-token.md).
- To safely roll out your service to more than one region, see [Azure Deployment Manager](deployment-manager-overview.md).
