---
title: Deploy Bicep files with the Azure CLI  
description: Learn how to use Azure Resource Manager and the Azure CLI to deploy resources to Azure. The resources are defined in a Bicep file.
ms.topic: how-to
ms.custom:
  - devx-track-azurecli
  - seo-azure-cli
  - devx-track-arm-template
  - devx-track-bicep
  - build-2025
ms.date: 03/25/2025
---

# Deploy Bicep files with the Azure CLI

This article explains how to use the Azure CLI with Bicep files to deploy your resources to Azure. If you aren't familiar with deploying and managing your Azure solutions, see [What is Bicep?](./overview.md).

## Prerequisites

You need a Bicep file to deploy, and the file must be local. You also need the Azure CLI and to be connected to Azure:

- **Install Azure CLI commands on your local computer.** To deploy Bicep files, you need [Azure CLI](/cli/azure/install-azure-cli) version **2.20.0 or later**.
- **Use [`az login`](/cli/azure/reference-index#az-login)** to connect to Azure. If you have multiple Azure subscriptions, you might also need to run [`az account set`](/cli/azure/account#az-account-set).

Samples for the Azure CLI are written for the `bash` shell. To run this sample in Windows PowerShell or Command Prompt (cmd), you might need to change elements of the script.

If you don't have the Azure CLI installed, you can use Azure Cloud Shell. For more information, see [Deploy Bicep files from Azure Cloud Shell](./deploy-cloud-shell.md).

[!INCLUDE [permissions](../../../includes/template-deploy-permissions.md)]

## Deployment scope

You can target your deployment to a resource group, subscription, management group, or tenant. Depending on the scope of the deployment, you use different commands, and the user deploying the Bicep file must have the required permissions to create resources for every scope.

* To deploy to a **resource group**, use [`az deployment group create`](/cli/azure/deployment/group#az-deployment-group-create):

  ```azurecli-interactive
  az deployment group create --resource-group <resource-group-name> --template-file <path-to-bicep>
  ```

* To deploy to a **subscription**, use [`az deployment sub create`](/cli/azure/deployment/sub#az-deployment-sub-create):

  ```azurecli-interactive
  az deployment sub create --location <location> --template-file <path-to-bicep>
  ```

  For more information about subscription-level deployments, see [Subscription deployments with Bicep files](deploy-to-subscription.md).

* To deploy to a **management group**, use [`az deployment mg create`](/cli/azure/deployment/mg#az-deployment-mg-create):

  ```azurecli-interactive
  az deployment mg create --location <location> --template-file <path-to-bicep>
  ```

  For more information about management-group-level deployments, see [Management group deployments with Bicep files](deploy-to-management-group.md).

* To deploy to a **tenant**, use [`az deployment tenant create`](/cli/azure/deployment/tenant#az-deployment-tenant-create):

  ```azurecli-interactive
  az deployment tenant create --location <location> --template-file <path-to-bicep>
  ```

  For more information about tenant-level deployments, see [Tenant deployments with Bicep file](deploy-to-tenant.md).

## Deploy local Bicep file

You can deploy a Bicep file from your local machine or an external one. This section describes how to deploy a local Bicep file.

If you're deploying to a resource group that doesn't exist, create the resource group. The name of the resource group can only include alphanumeric characters, periods, underscores, hyphens, and parenthesis. It can be up to 90 characters and can't end in a period.

```azurecli-interactive
az group create --name ExampleGroup --location "Central US"
```

To deploy a local Bicep file, use the `--template-file` switch in the deployment command. The following example also shows how to set a parameter value:

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file <path-to-bicep> \
  --parameters storageAccountType=Standard_GRS
```

The deployment can take a few minutes to complete. When it finishes, you see a message that includes the following result:

```output
"provisioningState": "Succeeded",
```

## Deploy remote Bicep file

The Azure CLI doesn't currently support deploying remote Bicep files. You can use the [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) to [build](/cli/azure/bicep) the Bicep file to a JSON template and then load the JSON file to a remote location. For more information, see [Deploy remote template](../templates/deploy-cli.md#deploy-remote-template).

## Parameters

To pass parameter values, you can use either inline parameters or a parameters file. The parameters file can be either a [Bicep parameters file](#bicep-parameters-files) or a [JSON parameters file](#json-parameters-files).

### Inline parameters

To pass inline parameters, provide the values in `parameters`. For example, to pass a string and array to a Bicep file in a Bash shell, use:

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-bicep> \
  --parameters exampleString='inline string' exampleArray='["value1", "value2"]'
```

If you're using the Azure CLI with the cmd or PowerShell, pass the array in the format: `exampleArray="['value1','value2']"`.

You can also get the contents of file to provide that content as an inline parameter. Preface the file name with **@**:

```azurecli-interactive
az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-bicep> \
  --parameters exampleString=@stringContent.txt exampleArray=@arrayContent.json
```

Getting a parameter value from a file is helpful when you need to provide configuration values. For example, you can provide [cloud-init values for a Linux virtual machine](/azure/virtual-machines/linux/using-cloud-init).

The _arrayContent.json_ format is:

```json
[
  "value1",
  "value2"
]
```

To pass in an object, use JSON (when setting tags, for example). Your Bicep file might include a parameter like this one:

```json
"resourceTags": {
  "type": "object",
  "defaultValue": {
    "Cost Center": "IT Department"
  }
}
```

As shown in the following Bash script, you can also can pass in a JSON string to set the parameter. Use double quotes around the JSON that you want to pass into the object:

```azurecli
tags='{"Owner":"Contoso","Cost Center":"2345-324"}'
az deployment group create --name addstorage  --resource-group myResourceGroup \
--template-file $bicepFile \
--parameters resourceName=abcdef4556 resourceTags="$tags"
```

If you're using the Azure CLI with cmd or PowerShell, pass the object in the following format:

```azurecli
$tags="{'Owner':'Contoso','Cost Center':'2345-324'}"
az deployment group create --name addstorage  --resource-group myResourceGroup \
--template-file $bicepFile \
--parameters resourceName=abcdef4556 resourceTags=$tags
```

You can use a variable to contain the parameter values. Set the variable to all of the parameter values in your Bash script, and add it to the deployment command:

```azurecli-interactive
params="prefix=start suffix=end"

az deployment group create \
  --resource-group testgroup \
  --template-file <path-to-bicep> \
  --parameters $params
```

However, if you're using the Azure CLI with cmd or PowerShell, set the variable to a JSON string. Escape the quotation marks: `$params = '{ \"prefix\": {\"value\":\"start\"}, \"suffix\": {\"value\":\"end\"} }'`.

The evaluation of parameters follows a sequential order, meaning that if a value is assigned multiple times, then only the last assigned value is used. To assign parameters properly, it's recommended that you provide your parameters file initially and then use the _KEY=VALUE_ syntax to selectively override specific parameters. If you're supplying a `.bicepparam` parameters file, you can only use this argument once.

### Bicep parameters files

Rather than passing parameters as inline values in your script, you might find it easier to use a [Bicep parameters file](#bicep-parameters-files) or a [JSON parameters file](#json-parameters-files) that contains the parameter values. The parameters file must be a local file since the Azure CLI doesn't support external parameters files. For more information about parameters files, see [Create a parameters file for Bicep deployment](./parameter-files.md).

You can use a Bicep parameters file to deploy a Bicep file with [Azure CLI](./install.md#azure-cli) version 2.53.0 or later and [Bicep CLI](./install.md#visual-studio-code-and-bicep-extension) version 0.22.X or later. With the `using` statement within the Bicep parameters file, there's no need to provide the `--template-file` switch when specifying a Bicep parameters file for the `--parameters` switch. Including the `--template-file` switch will prompt an, "Only a .bicep file is allowed with a .bicepparam file," error.

The following example shows a parameters file named _storage.bicepparam_. The file is in the same directory where the command runs:

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --parameters storage.bicepparam
```

### JSON parameters files

The following example shows a parameters file named _storage.parameters.json_. The file is in the same directory where the command runs:

```azurecli-interactive
az deployment group create \
  --name ExampleDeployment \
  --resource-group ExampleGroup \
  --template-file storage.bicep \
  --parameters '@storage.parameters.json'
```

You can use inline parameters and a location parameters file in the same deployment operation. For more information, see [Parameter precedence](./parameter-files.md#parameter-precedence).

## Preview changes

Before deploying your Bicep file, you can preview the changes the Bicep file will make to your environment. Use the [what-if operation](./deploy-what-if.md) to verify that the Bicep file makes the changes that you expect. What-if also validates the Bicep file for errors.

## Deploy template specs

Currently, the Azure CLI doesn't provide Bicep files to help create template specs. However, you can create a Bicep file with the [Microsoft.Resources/templateSpecs](/azure/templates/microsoft.resources/templatespecs) resource to deploy a template spec. The [Create template spec sample](https://github.com/Azure/azure-docs-bicep-samples/blob/main/samples/create-template-spec/azuredeploy.bicep) shows how to create a template spec in a Bicep file. You can also build your Bicep file to JSON by using the Bicep CLI and then a JSON template to create a template spec.

## Deployment name

When deploying a Bicep file, you can give the deployment a name. This name can help you retrieve the deployment from the deployment history. If you don't provide a name for the deployment, its name becomes the name of the Bicep file. For example, if you deploy a Bicep file named _main.bicep_ and don't specify a deployment name, the deployment is named `main`.

Every time you run a deployment, an entry is added to the resource group's deployment history with the deployment name. If you run another deployment and give it the same name, the earlier entry is replaced with the current deployment. If you want to maintain unique entries in the deployment history, give each deployment a unique name.

To create a unique name, you can assign a random number:

```azurecli-interactive
deploymentName='ExampleDeployment'$RANDOM
```

Or, add a date value:

```azurecli-interactive
deploymentName='ExampleDeployment'$(date +"%d-%b-%Y")
```

If you run concurrent deployments to the same resource group with the same deployment name, only the last deployment is completed. Any deployments with the same name that haven't finished are replaced by the last deployment. For example, if you run a deployment named `newStorage` that deploys a storage account named `storage1` and run another deployment named `newStorage` that deploys a storage account named `storage2` at the same time, you deploy only one storage account. The resulting storage account is named `storage2`.

However, if you run a deployment named `newStorage` that deploys a storage account named `storage1` and immediately run another deployment named `newStorage` that deploys a storage account named `storage2` after the first deployment finishes, then you have two storage accounts. One is named `storage1`, and the other is named `storage2`. But, you only have one entry in the deployment history.

When you specify a unique name for each deployment, you can run them concurrently without conflict. If you run a deployment named `newStorage1` that deploys a storage account named `storage1` and run another deployment named `newStorage2` that deploys a storage account named `storage2` at the same time, then you have two storage accounts and two entries in the deployment history.

To avoid conflicts with concurrent deployments and to ensure unique entries in the deployment history, give each deployment a unique name.

## Next steps

To understand how to define parameters in your file, see [Bicep file structure and syntax](file.md).
