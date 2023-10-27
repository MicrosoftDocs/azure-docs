---
title: Azure deployment templates with Azure CLI – Azure Resource Manager | Microsoft Docs
description: Use Azure Resource Manager and Azure CLI to create and deploy resource groups to Azure. The resources are defined in an Azure deployment template.
ms.topic: conceptual
ms.date: 10/10/2023
ms.custom: devx-track-azurecli, seo-azure-cli, devx-track-arm-template
keywords: azure cli deploy arm template, create resource group azure, azure deployment template, deployment resources, arm template, azure arm template
---

# How to use Azure Resource Manager (ARM) deployment templates with Azure CLI

This article explains how to use Azure CLI with Azure Resource Manager templates (ARM templates) to deploy your resources to Azure.  If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [template deployment overview](overview.md).

The deployment commands changed in Azure CLI version 2.2.0. The examples in this article require [Azure CLI version 2.20.0 or later](/cli/azure/install-azure-cli).

[!INCLUDE [sample-cli-install](../../../includes/sample-cli-install.md)]

If you don't have Azure CLI installed, you can use Azure Cloud Shell. For more information, see [Deploy ARM templates from Azure Cloud Shell](deploy-cloud-shell.md).

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [How to deploy resources with Bicep and Azure CLI](../bicep/deploy-cli.md).


[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your Azure deployment template to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands.

* To deploy to a **resource group**, use [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create):

  ```azurecli-interactive
  az deployment group create --resource-group <resource-group-name> --template-file <path-to-template>
  ```

* To deploy to a **subscription**, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create):

  ```azurecli-interactive
  az deployment sub create --location <location> --template-file <path-to-template>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create):

  ```azurecli-interactive
  az deployment mg create --location <location> --template-file <path-to-template>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [az deployment tenant create](/cli/azure/deployment/tenant#az-deployment-tenant-create):

  ```azurecli-interactive
  az deployment tenant create --location <location> --template-file <path-to-template>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

For every scope, the user deploying the template must have the required permissions to create resources.

## Deploy local template

You can deploy an ARM template from your local machine or one that is stored externally. This section describes deploying a local template.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```azurecli-interactive
az group create --name ExampleGroup --location "Central US"
```

To deploy a local template, use the `--template-file` parameter in the deployment command. The following example also shows how to set a parameter value.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file <path-to-template> \
  --parameters storageAccountType=Standard_GRS
```

The value of the `--template-file` parameter must be a Bicep file or a `.json` or `.jsonc` file. The `.jsonc` file extension indicates the file can contain `//` style comments. The ARM system accepts `//` comments in `.json` files. It does not care about the file extension. For more details about comments and metadata see [Understand the structure and syntax of ARM templates](./syntax.md#comments-and-metadata).

The Azure deployment template can take a few minutes to complete. When it finishes, you see a message that includes the result:

```output
"provisioningState": "Succeeded",
```

## Deploy remote template

Instead of storing ARM templates on your local machine, you might prefer to store them in an external location. You can store templates in a source control repository (such as GitHub). Or, you can store them in an Azure storage account for shared access in your organization.

[!INCLUDE [Deploy templates in private GitHub repo](../../../includes/resource-manager-private-github-repo-templates.md)]

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```azurecli-interactive
az group create --name ExampleGroup --location "Central US"
```

To deploy an external template, use the `template-uri` parameter.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-uri "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/quickstarts/microsoft.storage/storage-account-create/azuredeploy.json" \
  --parameters storageAccountType=Standard_GRS
```

The preceding example requires a publicly accessible URI for the template, which works for most scenarios because your template shouldn't include sensitive data. If you need to specify sensitive data (like an admin password), pass that value as a secure parameter. However, if you want to manage access to the template, consider using [template specs](#deploy-template-spec).

To deploy remote linked templates with relative path that are stored in a storage account, use `query-string` to specify the SAS token:

```azurecli-interactive
az deployment group create \
  --name linkedTemplateWithRelativePath \
  --resource-group myResourceGroup \
  --template-uri "https://stage20210126.blob.core.windows.net/template-staging/mainTemplate.json" \
  --query-string $sasToken
```

For more information, see [Use relative path for linked templates](./linked-templates.md#linked-template).

## Azure deployment template name

When deploying an ARM template, you can give the Azure deployment template a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, the name of the template file is used. For example, if you deploy a template named _azuredeploy.json_ and don't specify a deployment name, the deployment is named `azuredeploy`.

Every time you run a deployment, an entry is added to the resource group's deployment history with the deployment name. If you run another deployment and give it the same name, the earlier entry is replaced with the current deployment. If you want to maintain unique entries in the deployment history, give each deployment a unique name.

To create a unique name, you can assign a random number.

```azurecli-interactive
deploymentName='ExampleDeployment'$RANDOM
```

Or, add a date value.

```azurecli-interactive
deploymentName='ExampleDeployment'$(date +"%d-%b-%Y")
```

If you run concurrent deployments to the same resource group with the same deployment name, only the last deployment is completed. Any deployments with the same name that haven't finished are replaced by the last deployment. For example, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage` that deploys a storage account named `storage2`, you deploy only one storage account. The resulting storage account is named `storage2`.

However, if you run a deployment named `newStorage` that deploys a storage account named `storage1`, and immediately after it completes you run another deployment named `newStorage` that deploys a storage account named `storage2`, then you have two storage accounts. One is named `storage1`, and the other is named `storage2`. But, you only have one entry in the deployment history.

When you specify a unique name for each deployment, you can run them concurrently without conflict. If you run a deployment named `newStorage1` that deploys a storage account named `storage1`, and at the same time run another deployment named `newStorage2` that deploys a storage account named `storage2`, then you have two storage accounts and two entries in the deployment history.

To avoid conflicts with concurrent deployments and to ensure unique entries in the deployment history, give each deployment a unique name.

## Deploy template spec

Instead of deploying a local or remote template, you can create a [template spec](template-specs.md). The template spec is a resource in your Azure subscription that contains an ARM template. It makes it easy to securely share the template with users in your organization. You use Azure role-based access control (Azure RBAC) to grant access to the template spec. This feature is currently in preview.

The following examples show how to create and deploy a template spec.

First, create the template spec by providing the ARM template.

```azurecli
az ts create \
  --name storageSpec \
  --version "1.0" \
  --resource-group templateSpecRG \
  --location "westus2" \
  --template-file "./mainTemplate.json"
```

Then, get the ID for template spec and deploy it.

```azurecli
id = $(az ts show --name storageSpec --resource-group templateSpecRG --version "1.0" --query "id")

az deployment group create \
  --resource-group demoRG \
  --template-spec $id
```

For more information, see [Azure Resource Manager template specs](template-specs.md).

## Preview changes

Before deploying your ARM template, you can preview the changes the template will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the template makes the changes that you expect. What-if also validates the template for errors.

## Parameters

To pass parameter values, you can use either inline parameters or a parameters file. The parameter file can be either a [Bicep parameters file](#bicep-parameter-files) or a [JSON parameters file](#json-parameter-files).

### Inline parameters

To pass inline parameters, provide the values in `parameters`. For example, to pass a string and array to a template in a Bash shell, use:

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-template> \
  --parameters exampleString='inline string' exampleArray='("value1", "value2")'
```

If you're using Azure CLI with Windows Command Prompt (CMD) or PowerShell, pass the array in the format: `exampleArray="['value1','value2']"`.

You can also get the contents of file and provide that content as an inline parameter.

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-template> \
  --parameters exampleString=@stringContent.txt exampleArray=@arrayContent.json
```

Getting a parameter value from a file is helpful when you need to provide configuration values. For example, you can provide [cloud-init values for a Linux virtual machine](../../virtual-machines/linux/using-cloud-init.md).

The _arrayContent.json_ format is:

```json
[
    "value1",
    "value2"
]
```

To pass in an object, for example, to set tags, use JSON. For example, your template might include a parameter like this one:

```json
    "resourceTags": {
      "type": "object",
      "defaultValue": {
        "Cost Center": "IT Department"
      }
    }
```

In this case, you can pass in a JSON string to set the parameter as shown in the following Bash script:

```azurecli
tags='{"Owner":"Contoso","Cost Center":"2345-324"}'
az deployment group create --name addstorage  --resource-group myResourceGroup \
--template-file $templateFile \
--parameters resourceName=abcdef4556 resourceTags="$tags"
```

Use double quotes around the JSON that you want to pass into the object.

You can use a variable to contain the parameter values. In Bash, set the variable to all of the parameter values and add it to the deployment command.

```azurecli-interactive
params="prefix=start suffix=end"

az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-template> \
  --parameters $params
```

However, if you're using Azure CLI with Windows Command Prompt (CMD) or PowerShell, set the variable to a JSON string. Escape the quotation marks: `$params = '{ \"prefix\": {\"value\":\"start\"}, \"suffix\": {\"value\":\"end\"} }'`.

### JSON parameter files

Rather than passing parameters as inline values in your script, you might find it easier to use a parameters file, either a `.bicepparam` file or a JSON parameters file, that contains the parameter values. The parameters file must be a local file. External parameters files aren't supported with Azure CLI.

To pass a local parameter file, use `@` to specify a local file named _storage.parameters.json_.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters '@storage.parameters.json'
```

For more information about the parameter file, see [Create Resource Manager parameter file](./parameter-files.md).

### Bicep parameter files

With Azure CLI version 2.53.0 or later, and Bicep CLI version 0.22.6 or later, you can deploy a Bicep file by utilizing a Bicep parameter file. With the `using` statement within the Bicep parameters file, there is no need to provide the `--template-file` switch when specifying a Bicep parameter file for the `--parameters` switch. Including the `--template-file` switch will result in an "Only a .bicep template is allowed with a .bicepparam file" error.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --parameters storage.bicepparam
```

The parameters file must be a local file. External parameters files aren't supported with Azure CLI. For more information about the parameters file, see [Create Resource Manager parameters file](./parameter-files.md).


## Comments and the extended JSON format

You can include `//` style comments in your parameter file, but you must name the file with a `.jsonc` extension.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.json \
  --parameters '@storage.parameters.jsonc'
```
For more details about comments and metadata see [Understand the structure and syntax of ARM templates](./syntax.md#comments-and-metadata).

If you are using Azure CLI with version 2.3.0 or older, you can deploy a template with multi-line strings or comments using the `--handle-extended-json-format` switch.  For example:

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

## Next steps

* To roll back to a successful deployment when you get an error, see [Rollback on error to successful deployment](rollback-on-error.md).
* To specify how to handle resources that exist in the resource group but aren't defined in the template, see [Azure Resource Manager deployment modes](deployment-modes.md).
* To understand how to define parameters in your template, see [Understand the structure and syntax of ARM templates](./syntax.md).
* For tips on resolving common deployment errors, see [Troubleshoot common Azure deployment errors with Azure Resource Manager](common-deployment-errors.md).
