---
title: Use deployment scripts in templates | Microsoft Docs
description: Use deployment scripts in Azure Resource Manager templates.
ms.custom: devx-track-arm-template
ms.topic: conceptual
ms.date: 06/14/2024
---

# Use deployment scripts in ARM templates

Learn how to use deployment scripts in Azure Resource Manager (ARM) templates. With the [`deploymentScripts`](/azure/templates/microsoft.resources/deploymentscripts) resource, users can execute scripts in ARM deployments and review execution results.

> [!TIP]
> We recommend [Bicep](../bicep/overview.md) because it offers the same capabilities as ARM templates and the syntax is easier to use. To learn more, see [Deployment script](../bicep/deployment-script-bicep.md).

These scripts can be used for performing custom steps such as:

- Add users to a directory.
- Perform data plane operations, for example, copy blobs or seed database.
- Look up and validate a license key.
- Create a self-signed certificate.
- Create an object in Microsoft Entra ID.
- Look up IP Address blocks from custom system.

The benefits of deployment script:

- Easy to code, use, and debug. You can develop deployment scripts in your favorite development environments. The scripts can be embedded in templates or in external script files.
- You can specify the script language and platform. Currently, Azure PowerShell and Azure CLI deployment scripts on the Linux environment are supported.
- Allow passing command-line arguments to the script.
- Can specify script outputs and pass them back to the deployment.

The deployment script resource is only available in the regions where Azure Container Instance is available.  See [Resource availability for Azure Container Instances in Azure regions](/azure/container-instances/container-instances-region-availability). Currently, deployment script only uses public networking.

> [!IMPORTANT]
> The deployment script service requires two supporting resources for script execution and troubleshooting: a storage account and a container instance. You can specify an existing storage account, otherwise the script service creates one for you. The two automatically-created supporting resources are usually deleted by the script service when the deployment script execution gets in a terminal state. You are billed for the supporting resources until they are deleted. For the price information, see [Container Instances pricing](https://azure.microsoft.com/pricing/details/container-instances/) and [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage/). To learn more, see [Clean-up deployment script resources](#clean-up-deployment-script-resources).

> [!NOTE]
> Retry logic for Azure sign in is now built in to the wrapper script. If you grant permissions in the same template as your deployment scripts, the deployment script service retries sign in for 10 minutes with 10-second interval until the managed identity role assignment is replicated.

### Training resources

If you would rather learn about deployment scripts through step-by-step guidance, see [Extend ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts).

## Configure the minimum permissions

For deployment script API version 2020-10-01 or later, there are two principals involved in deployment script execution:

- **Deployment principal** (the principal used to deploy the template): this principal is used to create underlying resources required for the deployment script resource to execute — a storage account and an Azure container instance. To configure the least-privilege permissions, assign a custom role with the following properties to the deployment principal:

    ```json
    {
      "roleName": "deployment-script-minimum-privilege-for-deployment-principal",
      "description": "Configure least privilege for the deployment principal in deployment script",
      "type": "customRole",
      "IsCustom": true,
      "permissions": [
        {
          "actions": [
            "Microsoft.Storage/storageAccounts/*",
            "Microsoft.ContainerInstance/containerGroups/*",
            "Microsoft.Resources/deployments/*",
            "Microsoft.Resources/deploymentScripts/*"
          ],
        }
      ],
      "assignableScopes": [
        "[subscription().id]"
      ]
    }
    ```

    If the Azure Storage and the Azure Container Instance resource providers haven't been registered, you also need to add `Microsoft.Storage/register/action` and `Microsoft.ContainerInstance/register/action`.

- **Deployment script principal**: This principal is only required if the deployment script needs to authenticate to Azure and call Azure CLI/PowerShell. There are two ways to specify the deployment script principal:

  - Specify a user-assigned managed identity in the `identity` property (see [Sample templates](#sample-templates)). When specified, the script service calls `Connect-AzAccount -Identity` before invoking the deployment script. The managed identity must have the required access to complete the operation in the script. Currently, only user-assigned managed identity is supported for the `identity` property. To log in with a different identity, use the second method in this list.
  - Pass the service principal credentials as secure environment variables, and then can call [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) or [az login](/cli/azure/reference-index#az-login) in the deployment script.

  If a managed identity is used, the deployment principal needs the **Managed Identity Operator** role (a built-in role) assigned to the managed identity resource.

## Sample templates

The following JSON is an example. For more information, see the latest [template schema](/azure/templates/microsoft.resources/deploymentscripts).

```json
{
  "type": "Microsoft.Resources/deploymentScripts",
  "apiVersion": "2020-10-01",
  "name": "runPowerShellInline",
  "location": "[resourceGroup().location]",
  "tags": {
    "tagName1": "tagValue1",
    "tagName2": "tagValue2"
  },
  "kind": "AzurePowerShell", // or "AzureCLI"
  "identity": {
    "type": "userAssigned",
    "userAssignedIdentities": {
      "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myID": {}
    }
  },
  "properties": {
    "forceUpdateTag": "1",
    "containerSettings": {
      "containerGroupName": "mycustomaci"
    },
    "storageAccountSettings": {
      "storageAccountName": "myStorageAccount",
      "storageAccountKey": "myKey"
    },
    "azPowerShellVersion": "9.7",  // or "azCliVersion": "2.47.0",
    "arguments": "-name \\\"John Dole\\\"",
    "environmentVariables": [
      {
        "name": "UserName",
        "value": "jdole"
      },
      {
        "name": "Password",
        "secureValue": "jDolePassword"
      }
    ],
    "scriptContent": "
      param([string] $name)
      $output = 'Hello {0}. The username is {1}, the password is {2}.' -f $name,${Env:UserName},${Env:Password}
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
> The example is for demonstration purposes. The properties `scriptContent` and `primaryScriptUri` can't coexist in a template.

> [!NOTE]
> The _scriptContent_ shows a script with multiple lines.  The Azure portal and Azure DevOps pipeline can't parse a deployment script with multiple lines. You can either chain the PowerShell commands (by using semicolons or _\\r\\n_ or _\\n_) into one line, or use the `primaryScriptUri` property with an external script file. There are many free JSON string escape/unescape tools available. For example, [https://www.freeformatter.com/json-escape.html](https://www.freeformatter.com/json-escape.html).

Property value details:

- <a id='identity'></a>`identity`: For deployment script API version 2020-10-01 or later, a user-assigned managed identity is optional unless you need to perform any Azure-specific actions in the script.  For the API version 2019-10-01-preview, a managed identity is required as the deployment script service uses it to execute the scripts. When the identity property is specified, the script service calls `Connect-AzAccount -Identity` before invoking the user script. Currently, only user-assigned managed identity is supported. To log in with a different identity, you can call [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount) in the script.
- `tags`: Deployment script tags. If the deployment script service generates a storage account and a container instance, the tags are passed to both resources, which can be used to identify them. Another way to identify these resources is through their suffixes, which contain "azscripts". For more information, see [Monitor and troubleshoot deployment scripts](#monitor-and-troubleshoot-deployment-scripts).
- `kind`: Specify the type of script. Currently, Azure PowerShell and Azure CLI scripts are supported. The values are **AzurePowerShell** and **AzureCLI**.
- `forceUpdateTag`: Changing this value between template deployments forces the deployment script to re-execute. If you use the `newGuid()` or the `utcNow()` functions, both functions can only be used in the default value for a parameter. To learn more, see [Run script more than once](#run-script-more-than-once).
- `containerSettings`: Specify the settings to customize Azure Container Instance. Deployment script requires a new Azure Container Instance. You can't specify an existing Azure Container Instance. However, you can customize the container group name by using `containerGroupName`. If not specified, the group name is automatically generated.
- `storageAccountSettings`: Specify the settings to use an existing storage account. If `storageAccountName` isn't specified, a storage account is automatically created. See [Use an existing storage account](#use-existing-storage-account).
- `azPowerShellVersion`/`azCliVersion`: Specify the module version to be used. See a list of [supported Azure PowerShell versions](https://mcr.microsoft.com/v2/azuredeploymentscripts-powershell/tags/list). The version determines which container image to use:

  - **Az version greater than or equal to 9** uses Ubuntu 22.04.
  - **Az version greater than or equal to 6 but less than 9** uses Ubuntu 20.04.
  - **Az version less than 6** uses Ubuntu 18.04.

  > [!IMPORTANT]
  > It is advisable to upgrade to the latest version of Ubuntu, as Ubuntu 18.04 is nearing its end of life and will no longer receive security updates beyond [May 31st, 2023](https://ubuntu.com/18-04).

  See a list of [supported Azure CLI versions](https://mcr.microsoft.com/v2/azure-cli/tags/list).

  > [!IMPORTANT]
  > Deployment script uses the available CLI images from Microsoft Container Registry (MCR). It typically takes approximatedly one month to certify a CLI image for deployment script. Don't use the CLI versions that were released within 30 days. To find the release dates for the images, see [Azure CLI release notes](/cli/azure/release-notes-azure-cli). If an unsupported version is used, the error message lists the supported versions.

- `arguments`: Specify the parameter values. The values are separated by spaces.

  Deployment Scripts splits the arguments into an array of strings by invoking the [CommandLineToArgvW](/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw) system call. This step is necessary because the arguments are passed as a [command property](/rest/api/container-instances/2022-09-01/container-groups/create-or-update#containerexec)
    to Azure Container Instance, and the command property is an array of string.

  If the arguments contain escaped characters, use [JsonEscaper](https://www.jsonescaper.com/) to double escaped the characters. Paste your original escaped string into the tool, and then select **Escape**.  The tool outputs a double escaped string. For example, in the previous sample template, The argument is `-name \"John Dole\"`. The escaped string is `-name \\\"John Dole\\\"`.

  To pass an ARM template parameter of type object as an argument, convert the object to a string by using the [string()](./template-functions-string.md#string) function, and then use the [replace()](./template-functions-string.md#replace) function to replace any `\"` into `\\\"`. For example:

  ```json
  replace(string(parameters('tables')), '\"', '\\\"')
  ```

  For more information, see the [sample template](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-jsonEscape.json).

- `environmentVariables`: Specify the environment variables to pass over to the script. For more information, see [Develop deployment scripts](#develop-deployment-scripts).
- `scriptContent`: Specify the script content. To run an external script, use `primaryScriptUri` instead. For examples, see [Use inline script](#use-inline-scripts) and [Use external script](#use-external-scripts).
- `primaryScriptUri`: Specify a publicly accessible URL to the primary deployment script with supported file extensions. For more information, see [Use external scripts](#use-external-scripts).
- `supportingScriptUris`: Specify an array of publicly accessible URLs to supporting files that are called in either `scriptContent` or `primaryScriptUri`. For more information, see [Use external scripts](#use-external-scripts).
- `timeout`: Specify the maximum allowed script execution time specified in the [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Default value is **P1D**.
- `cleanupPreference`. Specify the preference of cleaning up the two supporting deployment resources, the storage account and the container instance, when the script execution gets in a terminal state. Default setting is **Always**, which means deleting the supporting resources despite the terminal state (Succeeded, Failed, Canceled). To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources).
- `retentionInterval`: Specify the interval for which the service retains the deployment script resource after the deployment script execution reaches a terminal state. The deployment script resource is deleted when this duration expires. Duration is based on the [ISO 8601 pattern](https://en.wikipedia.org/wiki/ISO_8601). The retention interval is between 1 and 26 hours (PT26H). This property is used when `cleanupPreference` is set to **OnExpiration**. To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources).

### More samples

- [Sample 1](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault.json): create a key vault and use deployment script to assign a certificate to the key vault.
- [Sample 2](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault-subscription.json): create a resource group at the subscription level, create a key vault in the resource group, and then use deployment script to assign a certificate to the key vault.
- [Sample 3](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault-mi.json): create a user-assigned managed identity, assign the contributor role to the identity at the resource group level, create a key vault, and then use deployment script to assign a certificate to the key vault.
- [Sample 4](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault-lock-sub.json): it is the same scenario as Sample 1 in this list. A new resource group is created to run the deployment script. This template is a subscription level template.
- [Sample 5](https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-keyvault-lock-group.json): it is the same scenario as Sample 4. This template is a resource group level template.
- [Sample 6](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.resources/deployment-script-azcli-graph-azure-ad): manually create a user-assigned managed identity and assign it permission to use the Microsoft Graph API to create Microsoft Entra applications; in the ARM template, use a deployment script to create a Microsoft Entra application and service principal, and output the object IDs and client ID.

## Use inline scripts

The following template has one resource defined with the `Microsoft.Resources/deploymentScripts` type. The highlighted part is the inline script.

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-helloworld.json" range="1-44" highlight="24-30":::

> [!NOTE]
> Because the inline deployment scripts are enclosed in double quotes, the strings inside the deployment scripts need to be escaped by using a backslash (**&#92;**) or enclosed in single quotes. You can also consider using string substitution as it is shown in the previous JSON sample.

The script takes one parameter, and output the parameter value. `DeploymentScriptOutputs` is used for storing outputs. In the outputs section, the `value` line shows how to access the stored values. `Write-Output` is used for debugging purpose. To learn how to access the output file, see [Monitor and troubleshoot deployment scripts](#monitor-and-troubleshoot-deployment-scripts). For the property descriptions, see [Sample templates](#sample-templates).

To run the script, select **Try it** to open the Cloud Shell, and then paste the following code into the shell pane.

```azurepowershell-interactive
$resourceGroupName = Read-Host -Prompt "Enter the name of the resource group to be created"
$location = Read-Host -Prompt "Enter the location (i.e. centralus)"

New-AzResourceGroup -Name $resourceGroupName -Location $location

New-AzResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateUri "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-helloworld.json"

Write-Host "Press [ENTER] to continue ..."
```

The output looks like:

:::image type="content" source="./media/deployment-script-template/resource-manager-template-deployment-script-helloworld-output.png" alt-text="Screenshot of Resource Manager template deployment script hello world output.":::

## Use external scripts

In addition to inline scripts, you can also use external script files. Only primary PowerShell scripts with the _ps1_ file extension are supported. For CLI scripts, the primary scripts can have any extensions (or without an extension), as long as the scripts are valid bash scripts. To use external script files, replace `scriptContent` with `primaryScriptUri`. For example:

```json
"primaryScriptUri": "https://raw.githubusercontent.com/Azure/azure-docs-json-samples/master/deployment-script/deploymentscript-helloworld.ps1",
```

For more information, see the [example template](https://github.com/Azure/azure-docs-json-samples/blob/master/deployment-script/deploymentscript-helloworld-primaryscripturi.json).

The external script files must be accessible. To secure your script files that are stored in Azure storage accounts, generate a SAS token and include it in the URI for the template. Set the expiry time to allow enough time to complete the deployment. For more information, see [Deploy private ARM template with SAS token](./secure-template-with-sas-token.md).

You're responsible for ensuring the integrity of the scripts that are referenced by deployment script, either `primaryScriptUri` or `supportingScriptUris`. Reference only scripts that you trust.

## Use supporting scripts

You can separate complicated logics into one or more supporting script files. The `supportingScriptUris` property allows you to provide an array of URIs to the supporting script files if needed:

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

The supporting files are copied to `azscripts/azscriptinput` at the runtime. Use relative path to reference the supporting files from inline scripts and primary script files.

## Work with outputs from PowerShell scripts

The following template shows how to pass values between two `deploymentScripts` resources:

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-basic.json" range="1-68" highlight="30-31,50":::

In the first resource, you define a variable called `$DeploymentScriptOutputs`, and use it to store the output values. To access the output value from another resource within the template, use:

```json
reference('<ResourceName>').outputs.text
```

## Work with outputs from CLI scripts

In contrast to the Azure PowerShell deployment scripts, CLI/bash doesn't expose a common variable for storing script outputs. Instead, it utilizes an environment variable named `AZ_SCRIPTS_OUTPUT_PATH` to indicate the location of the script outputs file. When executing a deployment script within an ARM template, the Bash shell automatically configures this environment variable for you. Its predefined value is set as */mnt/azscripts/azscriptoutput/scriptoutputs.json*. The outputs are required to conform to a valid JSON string object structure. The file's contents should be formatted as a key-value pair. For instance, an array of strings should be saved as { "MyResult": [ "foo", "bar"] }. Storing only the array results, such as [ "foo", "bar" ], is considered invalid.

:::code language="json" source="~/resourcemanager-templates/deployment-script/deploymentscript-basic-cli.json" range="1-44" highlight="32":::

[jq](https://stedolan.github.io/jq/) is used in the previous sample. It comes with the container images. See [Configure development environment](#configure-development-environment).

## Use existing storage account

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

    These combinations support file shares. For more information, see [Create an Azure file share](../../storage/files/storage-how-to-create-file-share.md) and [Types of storage accounts](../../storage/common/storage-account-overview.md).

- Storage account firewall rules aren't supported yet. For more information, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md).
- Deployment principal must have permissions to manage the storage account, which includes read, create, delete file shares.
- The `allowSharedKeyAccess` property of the storage account must be set to `true`. The only way to mount a storage account in Azure Container Instance(ACI) is via an access key.

To specify an existing storage account, add the following JSON to the property element of `Microsoft.Resources/deploymentScripts`:

```json
"storageAccountSettings": {
  "storageAccountName": "myStorageAccount",
  "storageAccountKey": "myKey"
},
```

- `storageAccountName`: specify the name of the storage account.
- `storageAccountKey`: specify one of the storage account keys. You can use the [listKeys()](./template-functions-resource.md#listkeys) function to retrieve the key. For example:

    ```json
    "storageAccountSettings": {
        "storageAccountName": "[variables('storageAccountName')]",
        "storageAccountKey": "[listKeys(resourceId('Microsoft.Storage/storageAccounts', variables('storageAccountName')), '2019-06-01').keys[0].value]"
    }
    ```

See [Sample templates](#sample-templates) for a complete `Microsoft.Resources/deploymentScripts` definition sample.

When an existing storage account is used, the script service creates a file share with a unique name. See [Clean up deployment script resources](#clean-up-deployment-script-resources) for how the script service cleans up the file share.

## Develop deployment scripts

### Handle nonterminating errors

You can control how PowerShell responds to nonterminating errors by using the `$ErrorActionPreference` variable in your deployment script. If the variable isn't set in your deployment script, the script service uses the default value **Continue**.

The script service sets the resource provisioning state to **Failed** when the script encounters an error despite the setting of `$ErrorActionPreference`.

### Use environment variables

Deployment script uses these environment variables:

|Environment variable|Default value|System reserved|
|--------------------|-------------|---------------|
|AZ_SCRIPTS_AZURE_ENVIRONMENT|AzureCloud|N|
|AZ_SCRIPTS_CLEANUP_PREFERENCE|OnExpiration|N|
|AZ_SCRIPTS_OUTPUT_PATH|<AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY>/<AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME>|Y|
|AZ_SCRIPTS_PATH_INPUT_DIRECTORY|/mnt/azscripts/azscriptinput|Y|
|AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY|/mnt/azscripts/azscriptoutput|Y|
|AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME|Azure PowerShell: userscript.ps1; Azure CLI: userscript.sh|Y|
|AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME|primaryscripturi.config|Y|
|AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME|supportingscripturi.config|Y|
|AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME|scriptoutputs.json|Y|
|AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME|executionresult.json|Y|
|AZ_SCRIPTS_USER_ASSIGNED_IDENTITY|/subscriptions/|N|

For more information about using `AZ_SCRIPTS_OUTPUT_PATH`, see [Work with outputs from CLI script](#work-with-outputs-from-cli-scripts).

### Pass secured strings to deployment script

Setting environment variables (EnvironmentVariable) in your container instances allows you to provide dynamic configuration of the application or script run by the container. Deployment script handles nonsecured and secured environment variables in the same way as Azure Container Instance. For more information, see [Set environment variables in container instances](/azure/container-instances/container-instances-environment-variables#secure-values). For an example, see [Sample templates](#sample-templates).

The max allowed size for environment variables is 64 KB.

## Monitor and troubleshoot deployment scripts

The script service creates a [storage account](../../storage/common/storage-account-overview.md) (unless you specify an existing storage account) and a [container instance](/azure/container-instances/container-instances-overview) for script execution. If these resources are automatically created by the script service, both resources have the `azscripts` suffix in the resource names.

:::image type="content" source="./media/deployment-script-template/resource-manager-template-deployment-script-resources.png" alt-text="Screenshot of Resource Manager template deployment script resource names.":::

The user script, the execution results, and the stdout file are stored in the files shares of the storage account. There's a folder called `azscripts`. In the folder, there are two more folders for the input and the output files: `azscriptinput` and `azscriptoutput`.

The output folder contains a _executionresult.json_ and the script output file. You can see the script execution error message in _executionresult.json_. The output file is created only when the script is executed successfully. The input folder contains a system PowerShell script file and the user deployment script files. You can replace the user deployment script file with a revised one, and rerun the deployment script from the Azure container instance.

### Use the Azure portal

After you deploy a deployment script resource, the resource is listed under the resource group in the Azure portal. The following screenshot shows the **Overview** page of a deployment script resource:

:::image type="content" source="./media/deployment-script-template/resource-manager-deployment-script-portal.png" alt-text="Screenshot of Resource Manager template deployment script portal overview.":::

The overview page displays some important information of the resource, such as **Provisioning state**, **Storage account**, **Container instance**, and **Logs**.

From the left menu, you can view the deployment script content, the arguments passed to the script, and the output. You can also export a template for the deployment script including the deployment script.

### Use PowerShell

Using Azure PowerShell, you can manage deployment scripts at subscription or resource group scope:

- [Get-AzDeploymentScript](/powershell/module/az.resources/get-azdeploymentscript): Gets or lists deployment scripts.
- [Get-AzDeploymentScriptLog](/powershell/module/az.resources/get-azdeploymentscriptlog): Gets the log of a deployment script execution.
- [Remove-AzDeploymentScript](/powershell/module/az.resources/remove-azdeploymentscript): Removes a deployment script and its associated resources.
- [Save-AzDeploymentScriptLog](/powershell/module/az.resources/save-azdeploymentscriptlog): Saves the log of a deployment script execution to disk.

The `Get-AzDeploymentScript` output is similar to:

```output
Name                : runPowerShellInlineWithOutput
Id                  : /subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0618rg/providers/Microsoft.Resources/deploymentScripts/runPowerShellInlineWithOutput
ResourceGroupName   : myds0618rg
Location            : centralus
SubscriptionId      : aaaabbbb-0000-cccc-1111-dddd2222eeee
ProvisioningState   : Succeeded
Identity            : /subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/mydentity1008rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuami
ScriptKind          : AzurePowerShell
AzPowerShellVersion : 9.7
StartTime           : 5/11/2023 7:46:45 PM
EndTime             : 5/11/2023 7:49:45 PM
ExpirationDate      : 5/12/2023 7:49:45 PM
CleanupPreference   : OnSuccess
StorageAccountId    : /subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0618rg/providers/Microsoft.Storage/storageAccounts/ftnlvo6rlrvo2azscripts
ContainerInstanceId : /subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0618rg/providers/Microsoft.ContainerInstance/containerGroups/ftnlvo6rlrvo2azscripts
Outputs             :
                      Key                 Value
                      ==================  ==================
                      text                Hello John Dole

RetentionInterval   : P1D
Timeout             : PT1H
```

### Use Azure CLI

Using Azure CLI, you can manage deployment scripts at subscription or resource group scope:

- [az deployment-scripts delete](/cli/azure/deployment-scripts#az-deployment-scripts-delete): Delete a deployment script.
- [az deployment-scripts list](/cli/azure/deployment-scripts#az-deployment-scripts-list): List all deployment scripts.
- [az deployment-scripts show](/cli/azure/deployment-scripts#az-deployment-scripts-show): Retrieve a deployment script.
- [az deployment-scripts show-log](/cli/azure/deployment-scripts#az-deployment-scripts-show-log): Show deployment script logs.

The list command output is similar to:

```json
[
  {
    "arguments": "'foo' 'bar'",
    "azCliVersion": "2.40.0",
    "cleanupPreference": "OnExpiration",
    "containerSettings": {
      "containerGroupName": null
    },
    "environmentVariables": null,
    "forceUpdateTag": "20231101T163748Z",
    "id": "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0624rg/providers/Microsoft.Resources/deploymentScripts/runBashWithOutputs",
    "identity": {
      "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
      "type": "userAssigned",
      "userAssignedIdentities": {
        "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourcegroups/myidentity/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuami": {
          "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444",
          "principalId": "aaaabbbb-0000-cccc-1111-dddd2222eeee"
        }
      }
    },
    "kind": "AzureCLI",
    "location": "centralus",
    "name": "runBashWithOutputs",
    "outputs": {
      "Result": [
        {
          "id": "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/mytest/providers/Microsoft.KeyVault/vaults/mykv1027",
          "resourceGroup": "mytest"
        }
      ]
    },
    "primaryScriptUri": null,
    "provisioningState": "Succeeded",
    "resourceGroup": "mytest",
    "retentionInterval": "1 day, 0:00:00",
    "scriptContent": "result=$(az keyvault list); echo \"arg1 is: $1\"; echo $result | jq -c '{Result: map({id: .id})}' > $AZ_SCRIPTS_OUTPUT_PATH",
    "status": {
      "containerInstanceId": "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/mytest/providers/Microsoft.ContainerInstance/containerGroups/eg6n7wvuyxn7iazscripts",
      "endTime": "2023-11-01T16:39:12.080950+00:00",
      "error": null,
      "expirationTime": "2023-11-02T16:39:12.080950+00:00",
      "startTime": "2023-11-01T16:37:53.139700+00:00",
      "storageAccountId": null
    },
    "storageAccountSettings": {
      "storageAccountKey": null,
      "storageAccountName": "dsfruro267qwb4i"
    },
    "supportingScriptUris": null,
    "systemData": {
      "createdAt": "2023-10-31T19:06:57.060909+00:00",
      "createdBy": "someone@contoso.com",
      "createdByType": "User",
      "lastModifiedAt": "2023-11-01T16:37:51.859570+00:00",
      "lastModifiedBy": "someone@contoso.com",
      "lastModifiedByType": "User"
    },
    "tags": null,
    "timeout": "0:30:00",
    "type": "Microsoft.Resources/deploymentScripts"
  }
]
```

### Use REST API

You can get the deployment script resource deployment information at the resource group level and the subscription level by using REST API:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>?api-version=2020-10-01
```

```rest
/subscriptions/<SubscriptionID>/providers/microsoft.resources/deploymentScripts?api-version=2020-10-01
```

The following example uses [ARMClient](https://github.com/projectkudu/ARMClient):

```azurepowershell
armclient login
armclient get /subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourcegroups/myrg/providers/microsoft.resources/deploymentScripts/myDeployementScript?api-version=2020-10-01
```

The output is similar to:

```json
{
  "kind": "AzurePowerShell",
  "identity": {
    "type": "userAssigned",
    "tenantId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
    "userAssignedIdentities": {
      "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myidentity1008rg/providers/Microsoft.ManagedIdentity/userAssignedIdentities/myuami": {
        "principalId": "aaaabbbb-0000-cccc-1111-dddd2222eeee",
        "clientId": "00001111-aaaa-2222-bbbb-3333cccc4444"
      }
    }
  },
  "location": "centralus",
  "systemData": {
    "createdBy": "someone@contoso.com",
    "createdByType": "User",
    "createdAt": "2023-05-11T02:59:04.7501955Z",
    "lastModifiedBy": "someone@contoso.com",
    "lastModifiedByType": "User",
    "lastModifiedAt": "2023-05-11T02:59:04.7501955Z"
  },
  "properties": {
    "provisioningState": "Succeeded",
    "forceUpdateTag": "20220625T025902Z",
    "azPowerShellVersion": "9.7",
    "scriptContent": "\r\n          param([string] $name)\r\n          $output = \"Hello {0}\" -f $name\r\n          Write-Output $output\r\n          $DeploymentScriptOutputs = @{}\r\n          $DeploymentScriptOutputs['text'] = $output\r\n        ",
    "arguments": "-name \\\"John Dole\\\"",
    "retentionInterval": "P1D",
    "timeout": "PT1H",
    "containerSettings": {},
    "status": {
      "containerInstanceId": "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0624rg/providers/Microsoft.ContainerInstance/containerGroups/64lxews2qfa5uazscripts",
      "storageAccountId": "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0624rg/providers/Microsoft.Storage/storageAccounts/64lxews2qfa5uazscripts",
      "startTime": "2023-05-11T02:59:07.5951401Z",
      "endTime": "2023-05-11T03:00:16.7969234Z",
      "expirationTime": "2023-05-12T03:00:16.7969234Z"
    },
    "outputs": {
      "text": "Hello John Dole"
    },
    "cleanupPreference": "OnSuccess"
  },
  "id": "/subscriptions/aaaabbbb-0000-cccc-1111-dddd2222eeee/resourceGroups/myds0624rg/providers/Microsoft.Resources/deploymentScripts/runPowerShellInlineWithOutput",
  "type": "Microsoft.Resources/deploymentScripts",
  "name": "runPowerShellInlineWithOutput"
}

```

The following REST API returns the log:

```rest
/subscriptions/<SubscriptionID>/resourcegroups/<ResourceGroupName>/providers/microsoft.resources/deploymentScripts/<DeploymentScriptResourceName>/logs?api-version=2020-10-01
```

It only works before the deployment script resources are deleted.

To see the deploymentScripts resource in the portal, select **Show hidden types**:

:::image type="content" source="./media/deployment-script-template/resource-manager-deployment-script-portal-show-hidden-types.png" alt-text="Screenshot of Resource Manager template deployment script with show hidden types option in portal.":::

## Clean up deployment script resources

The two automatically created supporting resources can never outlive the `deploymentScript` resource, unless there are failures deleting them. The life cycle of the supporting resources is controlled by the `cleanupPreference` property, the life cycle of the `deploymentScript` resource is controlled by the `retentionInterval` property:

- `cleanupPreference`: Specify the clean-up preference of the two supporting resources when the script execution gets in a terminal state. The supported values are:

  - **Always**: Delete the two supporting resources once script execution gets in a terminal state. If an existing storage account is used, the script service deletes the file share created by the service. Because the `deploymentScripts` resource might still be present after the supporting resources are cleaned up, the script service persists the script execution results, for example, stdout, outputs, and return value before the resources are deleted.
  - **OnSuccess**: Delete the two supporting resources only when the script execution is successful. If an existing storage account is used, the script service removes the file share only when the script execution is successful.

    If the script execution isn't successful, the script service waits until the `retentionInterval` expires before it cleans up the supporting resources and then the deployment script resource.
  - **OnExpiration**: Delete the two supporting resources only when the `retentionInterval` setting is expired. If an existing storage account is used, the script service removes the file share, but retains the storage account.

  The container instance and storage account are deleted according to the `cleanupPreference`. However, if the script fails and `cleanupPreference` isn't set to **Always**, the deployment process automatically keeps the container running for one hour or until the container is cleaned up. You can use the time to troubleshoot the script. If you want to keep the container running after successful deployments, add a sleep step to your script. For example, add [Start-Sleep](/powershell/module/microsoft.powershell.utility/start-sleep) to the end of your script. If you don't add the sleep step, the container is set to a terminal state and can't be accessed even if it hasn't been deleted yet.

- `retentionInterval`: Specify the time interval that a `deploymentScript` resource will be retained and after which will be expired and deleted.

> [!NOTE]
> It isn't recommended to use the storage account and the container instance that are generated by the script service for other purposes. The two resources might be removed depending on the script life cycle.

The automatically created storage account and container instance can't be deleted if the deployment script is deployed to a resource group with a [CanNotDelete lock](../management/lock-resources.md). To solve this problem, you can deploy the deployment script to another resource group without locks. See Sample 4 and Sample 5 in [Sample templates](#sample-templates).

## Run script more than once

Deployment script execution is an idempotent operation. If none of the `deploymentScripts` resource properties (including the inline script) are changed, the script doesn't execute when you redeploy the template. The deployment script service compares the resource names in the template with the existing resources in the same resource group. There are two options if you want to execute the same deployment script multiple times:

- Change the name of your `deploymentScripts` resource. For example, use the [utcNow](./template-functions-date.md#utcnow) template function as the resource name or as a part of the resource name. Changing the resource name creates a new `deploymentScripts` resource. It's good for keeping a history of script execution.

    > [!NOTE]
    > The `utcNow` function can only be used in the default value for a parameter.

- Specify a different value in the `forceUpdateTag` template property. For example, use `utcNow` as the value.

> [!NOTE]
> Write the deployment scripts that are idempotent. This ensures that if they run again accidentally, it will not cause system changes. For example, if the deployment script is used to create an Azure resource, verify the resource doesn't exist before creating it, so the script will succeed or you don't create the resource again.

## Configure development environment

You can use a preconfigured container image as your deployment script development environment. For more information, see [Configure development environment for deployment scripts in templates](./deployment-script-template-configure-dev.md).

After the script is tested successfully, you can use it as a deployment script in your templates.

## Deployment script error codes

| Error code | Description |
|------------|-------------|
| DeploymentScriptInvalidOperation | The deployment script resource definition in the template contains invalid property names. |
| DeploymentScriptResourceConflict | Can't delete a deployment script resource that is in nonterminal state and the execution hasn't exceeded 1 hour. Or can't rerun the same deployment script with the same resource identifier (same subscription, resource group name, and resource name) but different script body content at the same time. |
| DeploymentScriptOperationFailed | The deployment script operation failed internally. Contact Microsoft support. |
| DeploymentScriptStorageAccountAccessKeyNotSpecified | The access key hasn't been specified for the existing storage account.|
| DeploymentScriptContainerGroupContainsInvalidContainers | A container group created by the deployment script service got externally modified, and invalid containers got added. |
| DeploymentScriptContainerGroupInNonterminalState | Two or more deployment script resources use the same Azure container instance name in the same resource group, and one of them hasn't finished its execution yet. |
| DeploymentScriptStorageAccountInvalidKind | The existing storage account of the BlobBlobStorage or BlobStorage type doesn't support file shares, and can't be used. |
| DeploymentScriptStorageAccountInvalidKindAndSku | The existing storage account doesn't support file shares. For a list of supported storage account kinds, see [Use existing storage account](#use-existing-storage-account). |
| DeploymentScriptStorageAccountNotFound | The storage account doesn't exist or has been deleted by an external process or tool. |
| DeploymentScriptStorageAccountWithServiceEndpointEnabled | The storage account specified has a service endpoint. A storage account with a service endpoint isn't supported. |
| DeploymentScriptStorageAccountInvalidAccessKey | Invalid access key specified for the existing storage account. |
| DeploymentScriptStorageAccountInvalidAccessKeyFormat | Invalid storage account key format. See [Manage storage account access keys](../../storage/common/storage-account-keys-manage.md). |
| DeploymentScriptExceededMaxAllowedTime | Deployment script execution time exceeded the timeout value specified in the deployment script resource definition. |
| DeploymentScriptInvalidOutputs | The deployment script output isn't a valid JSON object. |
| DeploymentScriptContainerInstancesServiceLoginFailure | The user-assigned managed identity wasn't able to sign in after 10 attempts with 1-minute interval. |
| DeploymentScriptContainerGroupNotFound | A Container group created by deployment script service got deleted by an external tool or process. |
| DeploymentScriptDownloadFailure | Failed to download a supporting script. See [Use supporting script](#use-supporting-scripts).|
| DeploymentScriptError | The user script threw an error. |
| DeploymentScriptBootstrapScriptExecutionFailed | The bootstrap script threw an error. Bootstrap script is the system script that orchestrates the deployment script execution. |
| DeploymentScriptExecutionFailed | Unknown error during the deployment script execution. |
| DeploymentScriptContainerInstancesServiceUnavailable | When creating the Azure container instance (ACI), ACI threw a service unavailable error. |
| DeploymentScriptContainerGroupInNonterminalState | When creating the Azure container instance (ACI), another deployment script is using the same ACI name in the same scope (same subscription, resource group name, and resource name). |
| DeploymentScriptContainerGroupNameInvalid | The Azure container instance name (ACI) specified doesn't meet the ACI requirements. See [Troubleshoot common issues in Azure Container Instances](/azure/container-instances/container-instances-troubleshooting#issues-during-container-group-deployment).|

## Use Microsoft Graph within a deployment script

A deployment script can use [Microsoft Graph](/graph/overview) to create and work with objects in Microsoft Entra ID.

### Commands

When you use Azure CLI deployment scripts, you can use commands within the `az ad` command group to work with applications, service principals, groups, and users. You can also directly invoke Microsoft Graph APIs by using the `az rest` command.

When you use Azure PowerShell deployment scripts, you can use the `Invoke-RestMethod` cmdlet to directly invoke the Microsoft Graph APIs.

### Permissions

The identity that your deployment script uses needs to be authorized to work with the Microsoft Graph API, with the appropriate permissions for the operations it performs. You must authorize the identity outside of your template deployment, such as by precreating a user-assigned managed identity and assigning it an app role for Microsoft Graph. For more information, [see this quickstart example](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.resources/deployment-script-azcli-graph-azure-ad).

## Access private virtual network

With Microsoft.Resources/deploymentScripts version 2023-08-01, you can run deployment scripts in private networks with some additional configurations.

- Create a user-assigned managed identity, and specify it in the `identity` property. To assign the identity, see [Identity](#identity).
- Create a storage account with [`allowSharedKeyAccess`](/azure/templates/microsoft.storage/storageaccounts) set to `true` , and specify the deployment script to use the existing storage account. To specify an existing storage account, see [Use existing storage account](#use-existing-storage-account). Some additional configuration is required for the storage account.

    1. Open the storage account in the [Azure portal](https://portal.azure.com).
    1. From the left menu, select **Access Control (IAM)**, and then select the **Role assignments** tab.
    1. Add the `Storage File Data Privileged Contributor` role to the user-assignment managed identity.
    1. From the left menu, under **Security + networking**, select **Networking**, and then select **Firewalls and virtual networks**.
    1. Select **Enabled from selected virtual networks and IP addresses**.

        :::image type="content" source="./media/deployment-script-template/resource-manager-deployment-script-access-vnet-config-storage.png" alt-text="Screenshot of configuring storage account for accessing private network.":::

    1. Under **Virtual networks**, add a subnet. On the screenshot, the subnet is called *dspvnVnet*.
    1. Under **Exceptions**, select **Allow Azure services on the trusted services list to access this storage account**.

The following ARM template shows how to configure the environment for running a deployment script:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "prefix": {
      "type": "string",
      "maxLength": 10
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "userAssignedIdentityName": {
      "type": "string",
      "defaultValue": "[format('{0}Identity', parameters('prefix'))]"
    },
    "storageAccountName": {
      "type": "string",
      "defaultValue": "[format('{0}stg{1}', parameters('prefix'), uniqueString(resourceGroup().id))]"
    },
    "vnetName": {
      "type": "string",
      "defaultValue": "[format('{0}Vnet', parameters('prefix'))]"
    },
    "subnetName": {
      "type": "string",
      "defaultValue": "[format('{0}Subnet', parameters('prefix'))]"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Network/virtualNetworks",
      "apiVersion": "2023-09-01",
      "name": "[parameters('vnetName')]",
      "location": "[parameters('location')]",
      "properties": {
        "addressSpace": {
          "addressPrefixes": [
            "10.0.0.0/16"
          ]
        },
        "enableDdosProtection": false,
        "subnets": [
          {
            "name": "[parameters('subnetName')]",
            "properties": {
              "addressPrefix": "10.0.0.0/24",
              "serviceEndpoints": [
                {
                  "service": "Microsoft.Storage"
                }
              ],
              "delegations": [
                {
                  "name": "Microsoft.ContainerInstance.containerGroups",
                  "properties": {
                    "serviceName": "Microsoft.ContainerInstance/containerGroups"
                  }
                }
              ]
            }
          }
        ]
      }
    },
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2023-01-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[parameters('location')]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {
        "networkAcls": {
          "bypass": "AzureServices",
          "virtualNetworkRules": [
            {
              "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('subnetName'))]",
              "action": "Allow",
              "state": "Succeeded"
            }
          ],
          "defaultAction": "Deny"
        },
        "allowSharedKeyAccess": true
      },
      "dependsOn": [
        "[resourceId('Microsoft.Network/virtualNetworks', parameters('vnetName'))]"
      ]
    },
    {
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities",
      "apiVersion": "2023-07-31-preview",
      "name": "[parameters('userAssignedIdentityName')]",
      "location": "[parameters('location')]"
    },
    {
      "type": "Microsoft.Authorization/roleAssignments",
      "apiVersion": "2022-04-01",
      "scope": "[format('Microsoft.Storage/storageAccounts/{0}', parameters('storageAccountName'))]",
      "name": "[guid(tenantResourceId('Microsoft.Authorization/roleDefinitions', '69566ab7-960f-475b-8e7c-b3118f30c6bd'), resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName')), resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName')))]",
      "properties": {
        "principalId": "[reference(resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName')), '2023-07-31-preview').principalId]",
        "roleDefinitionId": "[tenantResourceId('Microsoft.Authorization/roleDefinitions', '69566ab7-960f-475b-8e7c-b3118f30c6bd')]",
        "principalType": "ServicePrincipal"
      },
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]",
        "[resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName'))]"
      ]
    }
  ]
}
```

You can use the following ARM template to test the deployment:

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "prefix": {
      "type": "string"
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]"
    },
    "utcValue": {
      "type": "string",
      "defaultValue": "[utcNow()]"
    },
    "storageAccountName": {
      "type": "string"
    },
    "vnetName": {
      "type": "string"
    },
    "subnetName": {
      "type": "string"
    },
    "userAssignedIdentityName": {
      "type": "string"
    }
  },
  "resources": [
    {
      "type": "Microsoft.Resources/deploymentScripts",
      "apiVersion": "2023-08-01",
      "name": "[format('{0}DS', parameters('prefix'))]",
      "location": "[parameters('location')]",
      "identity": {
        "type": "userAssigned",
        "userAssignedIdentities": {
          "[format('{0}', resourceId('Microsoft.ManagedIdentity/userAssignedIdentities', parameters('userAssignedIdentityName')))]": {}
        }
      },
      "kind": "AzureCLI",
      "properties": {
        "forceUpdateTag": "[parameters('utcValue')]",
        "azCliVersion": "2.47.0",
        "storageAccountSettings": {
          "storageAccountName": "[parameters('storageAccountName')]"
        },
        "containerSettings": {
          "subnetIds": [
            {
              "id": "[resourceId('Microsoft.Network/virtualNetworks/subnets', parameters('vnetName'), parameters('subnetName'))]"
            }
          ]
        },
        "scriptContent": "echo \"Hello world!\"",
        "retentionInterval": "P1D",
        "cleanupPreference": "OnExpiration"
      }
    }
  ]
}
```

## Next steps

In this article, you learned how to use deployment scripts. To walk through a deployment script tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Use deployment scripts in Azure Resource Manager templates](./template-tutorial-deployment-script.md)

> [!div class="nextstepaction"]
> [Learn module: Extend ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts/)
