---
title: Deploy resources with Azure CLI and Bicep files | Microsoft Docs
description: Use Azure Resource Manager and Azure CLI to deploy resources to Azure. The resources are defined in a Bicep file.
ms.topic: conceptual
ms.date: 10/10/2023
ms.custom: devx-track-azurecli, seo-azure-cli, devx-track-arm-template, devx-track-bicep
---

# How to deploy resources with Bicep and Azure CLI

This article explains how to use Azure CLI with Bicep files to deploy your resources to Azure. If you aren't familiar with the concepts of deploying and managing your Azure solutions, see [Bicep overview](./overview.md).

## Prerequisites

You need a Bicep file to deploy. The file must be local.

You need Azure CLI and to be connected to Azure:

- **Install Azure CLI commands on your local computer.** To deploy Bicep files, you need [Azure CLI](/cli/azure/install-azure-cli) version **2.20.0 or later**.
- **Connect to Azure by using [az login](/cli/azure/reference-index#az-login)**. If you have multiple Azure subscriptions, you might also need to run [az account set](/cli/azure/account#az-account-set).

Samples for the Azure CLI are written for the `bash` shell. To run this sample in Windows PowerShell or Command Prompt, you may need to change elements of the script.

If you don't have Azure CLI installed, you can use Azure Cloud Shell. For more information, see [Deploy Bicep files from Azure Cloud Shell](./deploy-cloud-shell.md).

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands.

* To deploy to a **resource group**, use [az deployment group create](/cli/azure/deployment/group#az-deployment-group-create):

  ```azurecli-interactive
  az deployment group create --resource-group <resource-group-name> --template-file <path-to-bicep>
  ```

* To deploy to a **subscription**, use [az deployment sub create](/cli/azure/deployment/sub#az-deployment-sub-create):

  ```azurecli-interactive
  az deployment sub create --location <location> --template-file <path-to-bicep>
  ```

  For more information about subscription level deployments, see [Create resource groups and resources at the subscription level](deploy-to-subscription.md).

* To deploy to a **management group**, use [az deployment mg create](/cli/azure/deployment/mg#az-deployment-mg-create):

  ```azurecli-interactive
  az deployment mg create --location <location> --template-file <path-to-bicep>
  ```

  For more information about management group level deployments, see [Create resources at the management group level](deploy-to-management-group.md).

* To deploy to a **tenant**, use [az deployment tenant create](/cli/azure/deployment/tenant#az-deployment-tenant-create):

  ```azurecli-interactive
  az deployment tenant create --location <location> --template-file <path-to-bicep>
  ```

  For more information about tenant level deployments, see [Create resources at the tenant level](deploy-to-tenant.md).

For every scope, the user deploying the Bicep file must have the required permissions to create resources.

## Deploy local Bicep file

You can deploy a Bicep file from your local machine or one that is stored externally. This section describes deploying a local Bicep file.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters. The name can't end in a period.

```azurecli-interactive
az group create --name ExampleGroup --location "Central US"
```

To deploy a local Bicep file, use the `--template-file` switch in the deployment command. The following example also shows how to set a parameter value.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file <path-to-bicep> \
  --parameters storageAccountType=Standard_GRS
```

The deployment can take a few minutes to complete. When it finishes, you see a message that includes the result:

```output
"provisioningState": "Succeeded",
```

## Deploy remote Bicep file

Currently, Azure CLI doesn't support deploying remote Bicep files. You can use [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) to [build](/cli/azure/bicep) the Bicep file to a JSON template, and then load the JSON file to the remote location.

## Parameters

To pass parameter values, you can use either inline parameters or a parameters file.

### Inline parameters

To pass inline parameters, provide the values in `parameters`. For example, to pass a string and array to a Bicep file in a Bash shell, use:

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-bicep> \
  --parameters exampleString='inline string' exampleArray='["value1", "value2"]'
```

If you're using Azure CLI with Windows Command Prompt (CMD) or PowerShell, pass the array in the format: `exampleArray="['value1','value2']"`.

You can also get the contents of file and provide that content as an inline parameter. Preface the file name with **@**.

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-bicep> \
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

To pass in an object, for example, to set tags, use JSON. For example, your Bicep file might include a parameter like this one:

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
--template-file $bicepFile \
--parameters resourceName=abcdef4556 resourceTags="$tags"
```

Use double quotes around the JSON that you want to pass into the object.

If you're using Azure CLI with Windows Command Prompt (CMD) or PowerShell, pass the object in the following format:

```azurecli
$tags="{'Owner':'Contoso','Cost Center':'2345-324'}"
az deployment group create --name addstorage  --resource-group myResourceGroup \
--template-file $bicepFile \
--parameters resourceName=abcdef4556 resourceTags=$tags
```

You can use a variable to contain the parameter values. In Bash, set the variable to all of the parameter values and add it to the deployment command.

```azurecli-interactive
params="prefix=start suffix=end"

az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-bicep> \
  --parameters $params
```

However, if you're using Azure CLI with Windows Command Prompt (CMD) or PowerShell, set the variable to a JSON string. Escape the quotation marks: `$params = '{ \"prefix\": {\"value\":\"start\"}, \"suffix\": {\"value\":\"end\"} }'`.

The evaluation of parameters follows a sequential order, meaning that if a value is assigned multiple times, only the last assigned value is used. To ensure proper parameter assignment, it is advised to provide your parameters file initially and selectively override specific parameters using the _KEY=VALUE_ syntax. It's important to mention that if you are supplying a `bicepparam` parameters file, you can use this argument only once.

### JSON parameters files

Rather than passing parameters as inline values in your script, you may find it easier to use a `.bicepparam` file or a JSON file that contains the parameter values. The parameters file must be a local file. External parameters files aren't supported with Azure CLI.

For more information about the parameters file, see [Create Resource Manager parameters file](./parameter-files.md).

The following example shows a parameters file named _storage.parameters.json_. The file is in the same directory where the command is run.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.bicep \
  --parameters storage.parameters.json
```

### Bicep parameter files

With Azure CLI version 2.53.0 or later, and Bicep CLI version 0.22.6 or later, you can deploy a Bicep file by utilizing a Bicep parameter file. With the `using` statement within the Bicep parameters file, there is no need to provide the `--template-file` switch when specifying a Bicep parameter file for the `--parameters` switch. Including the `--template-file` switch will result in an "Only a .bicep template is allowed with a .bicepparam file" error.

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --parameters storage.bicepparam
```

## Preview changes

Before deploying your Bicep file, you can preview the changes the Bicep file will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the Bicep file makes the changes that you expect. What-if also validates the Bicep file for errors.

## Deploy template specs

Currently, Azure CLI doesn't support creating template specs by providing Bicep files. However you can create a Bicep file with the [Microsoft.Resources/templateSpecs](/azure/templates/microsoft.resources/templatespecs) resource to deploy a template spec. The [Create template spec sample](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/create-template-spec/azuredeploy.bicep) shows how to create a template spec in a Bicep file. You can also build your Bicep file to JSON by using the Bicep CLI, and then create a template spec with the JSON template.

## Deployment name

When deploying a Bicep file, you can give the deployment a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, the name of the Bicep file is used. For example, if you deploy a Bicep file named `main.bicep` and don't specify a deployment name, the deployment is named `main`.

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

## Next steps

* To understand how to define parameters in your file, see [Understand the structure and syntax of Bicep files](file.md).
