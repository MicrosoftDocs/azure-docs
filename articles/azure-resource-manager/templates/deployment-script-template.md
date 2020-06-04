---
title: Use deployment scripts in templates | Microsoft Docs
description: use deployment scripts in Azure Resource Manager templates.
services: azure-resource-manager
author: mumian
ms.service: azure-resource-manager
ms.topic: conceptual
ms.date: 06/03/2020
ms.author: jgao

---
# Use deployment scripts in templates (Preview)

Learn how to use deployment scripts in Azure Resource templates. With a new resource type called `Microsoft.Resources/deploymentScripts`, users can execute deployment scripts in template deployments and review execution results. These scripts can be used for performing custom steps such as:

- add users to a directory
- perform data plane operations, for example, copy blobs or seed database
- look up and validate a license key
- create a self-signed certificate
- create an object in Azure AD
- look up IP Address blocks from custom system

The benefits of deployment script:

- Easy to code, use, and debug. You can develop deployment scripts in your favorite development environments. The scripts can be embedded in templates or in external script files.
- You can specify the script language and platform. Currently, Azure PowerShell and Azure CLI deployment scripts on the Linux environment are supported.
- Allow specifying the identities that are used to execute the scripts. Currently, only [Azure user-assigned managed identity](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md) is supported.
- Allow passing command-line arguments to the script.
- Can specify script outputs and pass them back to the deployment.

The deployment script resource is only available in the regions where Azure Container Instance is available.  See [Resource availability for Azure Container Instances in Azure regions](../../container-instances/container-instances-region-availability.md).

> [!IMPORTANT]
> A storage account and a container instance are needed for script execution and troubleshooting. You have the options to specify an existing storage account, otherwise the storage account along with the container instance are automatically created by the script service. The two automatically created resources are usually deleted by the script service when the deployment script execution gets in a terminal state. You are billed for the resources until the resources are deleted. To learn more, see [Clean-up deployment script resources](#clean-up-deployment-script-resources).

## Prerequisites

- **A user-assigned managed identity with the contributor's role to the target resource-group**. This identity is used to execute deployment scripts. To perform operations outside of the resource group, you need to grant additional permissions. For example, assign the identity to the subscription level if you want to create a new resource group.

  > [!NOTE]
  > The script service creates a storage account (unless you specify an existing storage account) and a container instance in the background .  A user-assigned managed identity with the contributor's role at the subscription level is required if the subscription has not registered the Azure storage account (Microsoft.Storage) and Azure container instance (Microsoft.ContainerInstance) resource providers.

  To create an identity, see [Create a user-assigned managed identity by using the Azure portal](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-portal.md), or [by using Azure CLI](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-cli.md), or [by using Azure PowerShell](../../active-directory/managed-identities-azure-resources/how-to-manage-ua-identity-powershell.md). You need the identity ID when you deploy the template. The format of the identity is:

  ```json
  /subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/Microsoft.ManagedIdentity/userAssignedIdentities/<IdentityID>
  ```

  Use the following CLI or PowerShell script to get the ID by providing the resource group name and the identity name.

  # [CLI](#tab/CLI)

  ```azurecli-interactive
  echo "Enter the Resource Group name:" &&
  read resourceGroupName &&
  echo "Enter the managed identity name:" &&
  read idName &&
  az identity show -g $resourceGroupName -n $idName --query id
  ```

  # [PowerShell](#tab/PowerShell)

  ```azurepowershell-interactive
  $idGroup = Read-Host -Prompt "Enter the resource group name for the managed identity"
  $idName = Read-Host -Prompt "Enter the name of the managed identity"

  (Get-AzUserAssignedIdentity -resourcegroupname $idGroup -Name $idName).Id
  ```

  ---

- **Azure PowerShell** or **Azure CLI**. For a list of supported Azure PowerShell versions, see [here](https://mcr.microsoft.com/v2/azuredeploymentscripts-powershell/tags/list); for a list of supported Azure CLI versions, see [here](https://mcr.microsoft.com/v2/azuredeploymentscripts-powershell/tags/list).

    >[!IMPORTANT]
    > Deployment script uses the available CLI images from Microsoft Container Registry(MCR) . It takes about one month to certify a CLI image for deployment script. Don't use the CLI versions that were released within 30 days. To find the release dates for the images, see [Azure CLI release notes](https://docs.microsoft.com/cli/azure/release-notes-azure-cli?view=azure-cli-latest). If an un-supported version is used, the error message list the supported versions.

    You don't need these versions for deploying templates. But these versions are needed for testing deployment scripts locally. See [Install the Azure PowerShell module](/powershell/azure/install-az-ps). You can use a preconfigured Docker image.  See [Configure development environment](#configure-development-environment).

## Sample templates

The following json is an example.  The latest template schema can be found [here](/azure/templates/microsoft.resources/deploymentscripts).

```json
{
  "type": "Microsoft.Resources/deploymentScripts",
  "apiVersion": "2019-10-01-preview",
  "name": "runPowerShellInline",
  "location": "[resourceGroup().location]",
  "kind": "AzurePowerShell", // or "AzureCLI"
  "identity": {
    "type": "userAssigned",
    "userAssignedIdentities": {
      "/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myID": {}
    }
  },
  "properties": {
    "forceUpdateTag": 1,
    "containerSettings": {
      "containerGroupName": "mycustomaci"
    },
    "storageAccountSettings": {
      "storageAccountName": "myStorageAccount",
      "storageAccountKey": "myKey"
    },
    "azPowerShellVersion": "3.0",  // or "azCliVersion": "2.0.80"
    "arguments": "[concat('-name ', parameters('name'))]",
    "environmentVariables": [
      {
        "name": "someSecret",
        "secureValue": "if this is really a secret, don't put it here... in plain text..."
      }
    ],
    "scriptContent": "
      param([string] $name)
      $output = 'Hello {0}' -f $name
      Write-Output $output
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs['text'] = $output
    ", // or "primaryScriptUri": "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-helloworld.ps1",
    "supportingScriptUris":[],
    "timeout": "PT30M",
    "cleanupPreference": "OnSuccess",
    "retentionInterval": "P1D"
  }
}
```

> [!NOTE]
> The example is for demonstration purpose.  **scriptContent** and **primaryScriptUri** can't coexist in a template.

Property value details:

- **Identity**: The deployment script service uses a user-assigned managed identity to execute the scripts. Currently, only user-assigned managed identity is supported.
- **kind**: Specify the type of script. Currently, Azure PowerShell and Azure CLI scripts are support. The values are **AzurePowerShell** and **AzureCLI**.
- **forceUpdateTag**: Changing this value between template deployments forces the deployment script to re-execute. Use the newGuid() or utcNow() function that needs to be set as the defaultValue of a parameter. To learn more, see [Run script more than once](#run-script-more-than-once).
- **containerSettings**: Specify the settings to customize Azure Container Instance.  **containerGroupName** is for specifying the container group name.  If not specified, the group name will be automatically generated.
- **storageAccountSettings**: Specify the settings to use an existing storage account. If not specified, a storage account is automatically created. See [Use an existing storage account](#use-an-existing-storage-account).
- **azPowerShellVersion**/**azCliVersion**: Specify the module version to be used. For a list of supported PowerShell and CLI versions, see [Prerequisites](#prerequisites).
- **arguments**: Specify the parameter values. The values are separated by spaces.
- **environmentVariables**: Specify the environment variables to pass over to the script. For more information, see [Develop deployment scripts](#develop-deployment-scripts).
- **scriptContent**: Specify the script content. To run an external script, use `primaryScriptUri` instead. For examples, see [Use inline script](#use-inline-scripts) and [Use external script](#use-external-scripts).
- **primaryScriptUri**: Specify a publicly accessible Url to the primary deployment script with supported file extensions.
- **supportingScriptUris**: Specify an array of publicly accessible Urls to supporting files that are called in either `ScriptContent` or `PrimaryScriptUri`.
- **timeout**: Specify the maximum allowed script execution time specified in the [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Default value is **P1D**.
- **cleanupPreference**. Specify the preference of cleaning up deployment resources when the script execution gets in a terminal state. Default setting is **Always**, which means deleting the resources despite the terminal state (Succeeded, Failed, Canceled). To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources).
- **retentionInterval**: Specify the interval for which the service retains the deployment script resources after the deployment script execution reaches a terminal state. The deployment script resources will be deleted when this duration expires. Duration is based on the [ISO 8601 pattern](https://en.wikipedia.org/wiki/ISO_8601). The default value is **P1D**, which means seven days. This property is used when cleanupPreference is set to *OnExpiration*. The *OnExpiration* property is not enabled currently. To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources).

### Additional samples

- [create and assign a certificate to a key vault](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault.json)

- [create and assign a user-assigned managed identity to a resource group, and run a deployment script](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault-mi.json).

> [!NOTE]
> It is recommended to create a user-assigned identity and grant permissions in advance. You might get sign-in and permission related errors if you create the identity and grant permissions in the same template where you run deployment scripts. It takes some time before the permissions to become effective.

## Use inline scripts

The following template has one resource defined with the `Microsoft.Resources/deploymentScripts` type. The highlighted part is the inline script.

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-helloworld.json" range="1-54" highlight="34-40":::

> [!NOTE]
> Because the inline deployment scripts are enclosed in double quotes, the strings inside the deployment scripts need to be escaped by using a **&#92;** or enclosed in single quotes. You can also consider using string substitution as it is shown in the previous JSON sample.

The script takes one parameter, and output the parameter value. **DeploymentScriptOutputs** is used for storing outputs.  In the outputs section, the **value** line shows how to access the stored values. `Write-Output` is used for debugging purpose. To learn how to access the output file, see [Debug deployment scripts](#debug-deployment-scripts).  For the property descriptions, see [Sample templates](#sample-templates).

To run the script, select **Try it** to open the Cloud Shell, and then paste the following code into the shell pane.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the name of the resource group to be created"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"
$id = Read-Host -Prompt "Enter the user-assigned managed identity ID"

New-AzResourceGroup -Name $resourceGroupName -Location $location

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-helloworld.json" -identity $id

Write-Host "Press [ENTER] to continue ..."
```

The output looks like:

![Resource Manager template deployment script hello world output](./media/deployment-script-template/resource-manager-template-deployment-script-helloworld-output.png)

## Use external scripts

In addition to inline scripts, you can also use external script files. Only primary PowerShell scripts with the **ps1** file extension are supported. For CLI scripts, the primary scripts can have any extensions (or without an extension), as long as the scripts are valid bash scripts. To use external script files, replace `scriptContent` with `primaryScriptUri`. For example:

```json
"primaryScriptURI": "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-helloworld.ps1",
```

To see an example, select [here](https://github.com/Azure/azure-docs-json-samples/blob/master/deployment-script/deploymentscript-helloworld-primaryscripturi.json).

The external script files must be accessible.  To secure your script files that are stored in Azure storage accounts, see [Deploy private ARM template with SAS token](./secure-template-with-sas-token.md).

You are responsible for ensuring the integrity of the scripts that are referenced by deployment script, either **PrimaryScriptUri** or **SupportingScriptUris**.  Reference only scripts that you trust.

## Use supporting scripts

You can separate complicated logics into one or more supporting script files. The `supportingScriptURI` property allows you to provide an array of URIs to the supporting script files if needed:

```json
"scriptContent": "
    ...
    ./Create-Cert.ps1
    ...
"

"supportingScriptUris": [
  "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/create-cert.ps1"
],
```

Supporting script files can be called from both inline scripts and primary script files. Supporting script files have no restrictions on the file extension.

The supporting files are copied to azscripts/azscriptinput at the runtime. Use relative path to reference the supporting files from inline scripts and primary script files.

## Work with outputs from PowerShell script

The following template shows how to pass values between two deploymentScripts resources:

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-basic.json" range="1-84" highlight="39-40,66":::

In the first resource, you define a variable called **$DeploymentScriptOutputs**, and use it to store the output values. To access the output value from another resource within the template, use:

```json
reference('<ResourceName>').output.text
```

## Work with outputs from CLI script

Different from the PowerShell deployment script, CLI/bash support does not expose a common variable to store script outputs, instead, there is an environment variable called **AZ_SCRIPTS_OUTPUT_PATH** that stores the location where the script outputs file resides. If a deployment script is run from a Resource Manager template, this environment variable is set automatically for you by the Bash shell.

Deployment script outputs must be saved in the AZ_SCRIPTS_OUTPUT_PATH location, and the outputs must be a valid JSON string object. The contents of the file must be saved as a key-value pair. For example, an array of strings is stored as { "MyResult": [ "foo", "bar"] }.  Storing just the array results, for example [ "foo", "bar" ], is invalid.

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-basic-cli.json" range="1-44" highlight="32":::

[jq](https://stedolan.github.io/jq/) is used in the previous sample. It comes with the container images. See [Configure development environment](#configure-development-environment).

## Develop deployment scripts

### Handle non-terminating errors

You can control how PowerShell responds to non-terminating errors by using the **$ErrorActionPreference** variable in your deployment script. If the variable is not set in your deployment script, the script service uses the default value **Continue**.

The script service sets the resource provisioning state to **Failed** when the script encounters an error despite the setting of $ErrorActionPreference.

### Pass secured strings to deployment script

Setting environment variables (EnvironmentVariable) in your container instances allows you to provide dynamic configuration of the application or script run by the container. Deployment script handles non-secured and secured environment variables in the same way as Azure Container Instance. For more information, see [Set environment variables in container instances](../../container-instances/container-instances-environment-variables.md#secure-values).

The max allowed size for environment variables is 64KB.

## Debug deployment scripts

The script service creates a [storage account](../../storage/common/storage-account-overview.md) (unless you specify an existing storage account) and a [container instance](../../container-instances/container-instances-overview.md) for script execution. If these resources are automatically created by the script service, both resources have the **azscripts** suffix in the resource names.

![Resource Manager template deployment script resource names](./media/deployment-script-template/resource-manager-template-deployment-script-resources.png)

The user script, the execution results, and the stdout file are stored in the files shares of the storage account. There is a folder called **azscripts**. In the folder, there are two more folders for the input and the output files: **azscriptinput** and **azscriptoutput**.

The output folder contains a **executionresult.json** and the script output file. You can see the script execution error message in **executionresult.json**. The output file is created only when the script is executed successfully. The input folder contains a system PowerShell script file and the user deployment script files. You can replace the user deployment script file with a revised one, and rerun the deployment script from the Azure container instance.

You can get the deployment script resource deployment information at the resource group level and the subscription level by using REST API:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>?api-version=2019-10-01-preview
```

```rest
/subscriptions/<SubscriptionID>/providers/microsoft.resources/deploymentScripts?api-version=2019-10-01-preview
```

The following example uses [ARMClient](https://github.com/projectkudu/ARMClient):

```azurepowershell
armclient login
armclient get /subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourcegroups/myrg/providers/microsoft.resources/deploymentScripts/myDeployementScript?api-version=2019-10-01-preview
```

The output is similar to:

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-status.json" range="1-37" highlight="15,34":::

The output shows the deployment state, and the deployment script resource IDs.

The following REST API returns the log:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>/logs?api-version=2019-10-01-preview
```

It only works before the deployment script resources are deleted.

To see the deploymentScripts resource in the portal, select **Show hidden types**:

![Resource Manager template deployment script, show hidden types, portal](./media/deployment-script-template/resource-manager-deployment-script-portal-show-hidden-types.png)

## Use an existing storage account

A storage account and a container instance are needed for script execution and troubleshooting. You have the options to specify an existing storage account, otherwise the storage account along with the container instance are automatically created by the script service. The requirements for using an existing storage account:

- Supported storage account kinds are:

    | SKU             | Supported Kind     |
    |-----------------|--------------------|
    | Premium_LRS     | FileStorage        |
    | Premium_ZRS     | FileStorage        |
    | Standard_GRS    | Storage, StorageV2 |
    | Standard_GZRS   | StorageV2          |
    | Standard_LRS    | Storage, StorageV2 |
    | Standard_RAGRS  | Storage, StorageV2 |
    | Standard_RAGZRS | StorageV2          |
    | Standard_ZRS    | StorageV2          |

    These combinations support file share.  For more information, see [Create an Azure file share](../../storage/files/storage-how-to-create-file-share.md) and [Types of storage accounts](../../storage/common/storage-account-overview.md).
- Storage account firewall rules are not supported yet. For more information, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md).
- Deployment script's user-assigned managed identity must have permissions to manage the storage account, which includes read, create, delete file shares.

To specify an existing storage account, add the following json to the property element of `Microsoft.Resources/deploymentScripts`:

```json
"storageAccountSettings": {
  "storageAccountName": "myStorageAccount",
  "storageAccountKey": "myKey"
},
```

- **storageAccountName**: specify the name of the storage account.
- **storageAccountKey"**: specify one of the storage account keys. You can use the [`listKeys()`](./template-functions-resource.md#listkeys) function to retrieve the key. For example:

    ```json
    "storageAccountSettings": {
        "storageAccountName": "[variables('storageAccountName')]",
        "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').keys[0].value]"
    }
    ```

See [Sample templates](#sample-templates) for a complete `Microsoft.Resources/deploymentScripts` definition sample.

When an existing storage account is used, the script service creates a file share with a unique name. See [Clean up deployment script resources](#clean-up-deployment-script-resources) for how the script service cleans up the file share.

## Clean up deployment script resources

A storage account and a container instance are needed for script execution and troubleshooting. You have the options to specify an existing storage account, otherwise a storage account along with a container instance are automatically created by the script service. The two automatically created resources are deleted by the script service when the deployment script execution gets in a terminal state. You are billed for the resources until the resources are deleted. For the price information, see [Container Instances pricing](https://azure.microsoft.com/pricing/details/container-instances/) and [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/).

The life cycle of these resources is controlled by the following properties in the template:

- **cleanupPreference**: Clean up preference when the script execution gets in a terminal state. The supported values are:

  - **Always**: Delete the automatically created resources once script execution gets in a terminal state. If an existing storage account is used, the script service deletes the file share created in the storage account. Because the deploymentScripts resource may still be present after the resources are cleaned up, the script service persists the script execution results, for example, stdout, outputs, return value, etc. before the resources are deleted.
  - **OnSuccess**: Delete the automatically created resources only when the script execution is successful. If an existing storage account is used, the script service removes the file share only when the script execution is successful. You can still access the resources to find the debug information.
  - **OnExpiration**: Delete the automatically resources only when the **retentionInterval** setting is expired. If an existing storage account is used, the script service removes the file share, but retain the storage account.

- **retentionInterval**: Specify the time interval that a script resource will be retained and after which will be expired and deleted.

> [!NOTE]
> It is not recommended to use the storage account and the container instance that are generated by the script service for other purposes. The two resources might be removed depending on the script life cycle.

## Run script more than once

Deployment script execution is an idempotent operation. If none of the deploymentScripts resource properties (including the inline script) is changed, the script will not be executed when you redeploy the template. The deployment script service compares the resource names in the template with the existing resources in the same resource group. There are two options if you want to execute the same deployment script multiple times:

- Change the name of your deploymentScripts resource. For example, use the [utcNow](./template-functions-date.md#utcnow) template function as the resource name or as a part of the resource name. Changing the resource name creates a new deploymentScripts resource. It is good for keeping a history of script execution.

    > [!NOTE]
    > The utcNow function can only be used in the default value for a parameter.

- Specify a different value in the `forceUpdateTag` template property.  For example, use utcNow as the value.

> [!NOTE]
> Write the deployment scripts that are idempotent. This ensures that if they run again accidentally, it will not cause system changes. For example, if the deployment script is used to create an Azure resource, verify the resource doesn't exist before creating it, so the script will succeed or you don't create the resource again.

## Configure development environment

You can use a pre-configured docker container image as your deployment script development environment. The following procedure shows you how to configure the docker image on Windows. For Linux and Mac, you can find the information on the Internet.

1. Install [Docker Desktop](https://www.docker.com/products/docker-desktop) on your development computer.
1. Open Docker Desktop.
1. Select the Docker Desktop icon from taskbars, and then select **Settings**.
1. Select **Shared Drives**, select a local drive that you want to be available to your containers, and then select **Apply**

    ![Resource Manager template deployment script docker drive](./media/deployment-script-template/resource-manager-deployment-script-docker-setting-drive.png)

1. Enter your windows credentials at the prompt.
1. Open a terminal window, either Command Prompt or Windows PowerShell (Do not use PowerShell ISE).
1. Pull the deployment script container image to the local computer:

    ```command
    docker pull mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7
    ```

    The example uses version PowerShell 2.7.0.

    To pull a CLI image from a Microsoft Container Registry (MCR):

    ```command
    docker pull mcr.microsoft.com/azure-cli:2.0.80
    ```

    This example uses version CLI 2.0.80. Deployment script uses the default CLI containers images found [here](https://hub.docker.com/_/microsoft-azure-cli).

1. Run the docker image locally.

    ```command
    docker run -v <host drive letter>:/<host directory name>:/data -it mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7
    ```

    Replace **&lt;host driver letter>** and **&lt;host directory name>** with an existing folder on the shared drive.  It maps the folder to the **/data** folder in the container. For examples, to map D:\docker:

    ```command
    docker run -v d:/docker:/data -it mcr.microsoft.com/azuredeploymentscripts-powershell:az2.7
    ```

    **-it** means keeping the container image alive.

    A CLI example:

    ```command
    docker run -v d:/docker:/data -it mcr.microsoft.com/azure-cli:2.0.80
    ```

1. Select **Share it** when you get a prompt.
1. The following screenshot shows how to run a PowerShell script, given that you have a helloworld.ps1 file in d:\docker folder.

    ![Resource Manager template deployment script docker cmd](./media/deployment-script-template/resource-manager-deployment-script-docker-cmd.png)

After the script is tested successfully, you can use it as a deployment script.

## Next steps

In this article, you learned how to use deployment scripts. To walk through a deployment script tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Use deployment scripts in Azure Resource Manager templates](./template-tutorial-deployment-script.md)
