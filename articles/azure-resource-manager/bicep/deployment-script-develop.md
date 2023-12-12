---
title: Develop deployment script | Microsoft Docs
description: Develop deployment script.
ms.custom: devx-track-bicep
ms.topic: conceptual
ms.date: 12/07/2023
---

# Develop deployment script

Learn how to develop [deployment script](./deployment-script-bicep.md). Note that deployment script resources might have a deployment duration. For efficient development and testing of these scripts, consider establishing a dedicated development environment, such as an Azure container instance or a Docker instance. For more information, see [Create development environment](./deployment-script-bicep-configure-dev.md).

## Syntax

The following Bicep file is an example of the deployment script resource. For more information, see the latest [Deployment script schema](/azure/templates/microsoft.resources/deploymentscripts?tabs=bicep).

# [CLI](#tab/CLI)

```bicep
resource <symbolic-name> 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  name: '<resource-name>'
  location: resourceGroup().location
  tags: {}
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '<user-assigned-identity-id>': {}
    }
  }
  kind: 'AzureCLI'
  properties: {
    storageAccountSettings: {
      storageAccountName: '<storage-account-name>'
      storageAccountKey: '<storage-account-key>'
    }
    containerSettings: {
      containerGroupName: '<container-group-name>'
      subnetIds: [
        {
          id: '<subnet-id>'
        }
      ]
    }
    environmentVariables: []
    azCliVersion: '2.52.0'
    arguments: '<script-arguments>'
    scriptContent: '''<azure-cli-or-azure-powershell-script>''' // or primaryScriptUri: 'https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/deployment-script/inlineScript.ps1'
    supportingScriptUris: []
    timeout: 'P1D'
    cleanupPreference: 'OnSuccess'
    retentionInterval: 'P1D'
    forceUpdateTag: '1'
  }
}
```

# [PowerShell](#tab/PowerShell)

```bicep
resource <symbolic-name> 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  name: '<resource-name>'
  location: resourceGroup().location
  tags: {}
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '<user-assigned-identity-id>': {}
    }
  }
  kind: 'AzurePowerShell'
  properties: {
    storageAccountSettings: {
      storageAccountName: '<storage-account-name>'
      storageAccountKey: '<storage-account-key>'
    }
    containerSettings: {
      containerGroupName: '<container-group-name>'
      subnetIds: [
        {
          id: '<subnet-id>'
        }
      ]
    }
    environmentVariables: []
    azPowerShellVersion: '10.0'
    arguments: '<script-arguments>'
    scriptContent: '''<azure-cli-or-azure-powershell-script>''' // or primaryScriptUri: 'https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/deployment-script/inlineScript.ps1'
    supportingScriptUris: []
    timeout: 'P1D'
    cleanupPreference: 'OnSuccess'
    retentionInterval: 'P1D'
    forceUpdateTag: '1'
  }
}
```

---

Property value details:

- `tags`: Deployment script tags. If the deployment script service creates the two supporting resources - a storage account and a container instance, the tags are passed to both resources, which can be used to identify them. Another way to identify these supporting resources is through their suffixes, which contain `azscripts`. For more information, see [Monitor and troubleshoot deployment scripts](./deployment-script-bicep.md#monitor-and-troubleshoot-deployment-script).
- <a id='identity'></a>`identity`: For deployment script API version *2020-10-01* or later, a user-assigned managed identity is optional unless you need to perform any Azure-specific actions in the script ( See [Access Azure resources](#access-azure-resources) or running deployment script in private network (See [Access private virtual network](./deployment-script-vnet.md)). For the API version 2019-10-01-preview, a managed identity is required as the deployment script service uses it to execute the scripts. When the identity property is specified, the script service calls `Connect-AzAccount -Identity` before invoking the user script. Currently, only user-assigned managed identity is supported. To log in with a different identity in deployment script, you can call [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount). For more information, see [Configure the minimum permissions](./deployment-script-bicep.md#configure-the-minimum-permissions).
- `kind`: Specify the type of script, either **AzurePowerShell** or **AzureCLI**. In addition to `kind`. You also need to specify the `azPowerShellVersion` or `azCliVersion` property.
- `storageAccountSettings`: Specify the settings to use an existing storage account. If `storageAccountName` is not specified, a storage account is automatically created. For more information, see [Use an existing storage account](#use-existing-storage-account).
- `containerSettings`: Customize the name of Azure Container Instance. For configuring the container group name, see [Configure container instance](#configure-container-instance). For configuring `subnetIds` to run deployment script in a private network, see [Access private virtual network](./deployment-script-vnet.md).
- `environmentVariables`: Specify the environment variables to pass over to the script. For more information, see [Environment variables](#use-environment-variables).
- `azPowerShellVersion`/`azCliVersion`: Specify the module version to be used.

    # [CLI](#tab/CLI)

    See a list of [supported Azure CLI versions](https://mcr.microsoft.com/v2/azure-cli/tags/list).

    > [!IMPORTANT]
    > Deployment script uses the available CLI images from Microsoft Container Registry (MCR). It typically takes approximatedly one month to certify a CLI image for deployment script. Don't use the CLI versions that were released within 30 days. To find the release dates for the images, see [Azure CLI release notes](/cli/azure/release-notes-azure-cli). If an unsupported version is used, the error message lists the supported versions.

    # [PowerShell](#tab/PowerShell)

    See a list of [supported Azure PowerShell versions](https://mcr.microsoft.com/v2/azuredeploymentscripts-powershell/tags/list). The version determines which container image to use:

    - **Az version greater than or equal to 9** uses Ubuntu 22.04.
    - **Az version greater than or equal to 6 but less than 9** uses Ubuntu 20.04.
    - **Az version less than 6** uses Ubuntu 18.04.

    > [!IMPORTANT]
    > It is advisable to upgrade to the latest version of Ubuntu, as Ubuntu 18.04 is nearing its end of life and will no longer receive security updates beyond [May 31st, 2023](https://ubuntu.com/18-04).

    ---

- `arguments`: Specify the parameter values. The values are separated by spaces.

  Deployment Scripts splits the arguments into an array of strings by invoking the [CommandLineToArgvW](/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw) system call. This step is necessary because the arguments are passed as a [command property](/rest/api/container-instances/2022-09-01/container-groups/create-or-update#containerexec)
    to Azure Container Instance, and the command property is an array of string.

  If the arguments contain escaped characters, double escaped the characters. For example, in the previous sample Bicep, The argument is `-name \"John Dole\"`. The escaped string is `-name \\"John Dole\\"`.

  To pass a Bicep parameter of type object as an argument, convert the object to a string by using the [`string()`](./bicep-functions-string.md#string) function, and then use the [replace()](./bicep-functions-string.md#replace) function to replace any `"` into `\\"`. For example:

  ```json
  replace(string(parameters('tables')), '"', '\\"')
  ```

  For more information, see the [sample Bicep file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/deployment-script/deploymentscript-jsonEscape.bicep).

- `scriptContent`: Specify the script content. It can be an inline script or an external script file imported by using the [`loadTextContent`](./bicep-functions-files.md#loadtextcontent) function. For more information, see [Inline vs external file](#inline-vs-external-file). To run an external script, use `primaryScriptUri` instead.
- `primaryScriptUri`: Specify a publicly accessible URL to the primary deployment script with supported file extensions. For more information, see [Use external scripts](#use-external-scripts).
- `supportingScriptUris`: Specify an array of publicly accessible URLs to supporting files that are called in either `scriptContent` or `primaryScriptUri`. see [Inline vs external file](#inline-vs-external-file).
- `timeout`: Specify the maximum allowed script execution time specified in the [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). Default value is **P1D**.
- `forceUpdateTag`: Changing this value between Bicep file deployments forces the deployment script to re-execute. If you use the `newGuid()` or the `utcNow()` functions, both functions can only be used in the default value for a parameter. To learn more, see [Run script more than once](#run-script-more-than-once).
- `cleanupPreference`. Specify the preference of cleaning up the two supporting deployment resources, the storage account and the container instance, when the script execution gets in a terminal state. Default setting is **Always**, which means deleting the supporting resources despite the terminal state (Succeeded, Failed, Canceled). To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources).
- `retentionInterval`: Specify the interval for which the service retains the deployment script resource after the deployment script execution reaches a terminal state. The deployment script resource is deleted when this duration expires. Duration is based on the [ISO 8601 pattern](https://en.wikipedia.org/wiki/ISO_8601). The retention interval is between 1 and 26 hours (PT26H). This property is used when `cleanupPreference` is set to **OnExpiration**. To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources).

### More samples

- [Sample 1](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/deploymentscript-keyvault.bicep): create a key vault and use deployment script to assign a certificate to the key vault.
- [Sample 2](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/deploymentscript-keyvault-subscription.bicep): create a resource group at the subscription level, create a key vault in the resource group, and then use deployment script to assign a certificate to the key vault.
- [Sample 3](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/deploymentscript-keyvault-mi.bicep): create a user-assigned managed identity, assign the contributor role to the identity at the resource group level, create a key vault, and then use deployment script to assign a certificate to the key vault.
- [Sample 4](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.resources/deployment-script-azcli-graph-azure-ad): manually create a user-assigned managed identity and assign it permission to use the Microsoft Graph API to create Microsoft Entra applications; in the Bicep file, use a deployment script to create a Microsoft Entra application and service principal, and output the object IDs
and client ID.

## Inline vs external file

Deployment script can reside within a Bicep file or be stored externally as a separate file.

### Inline script.

The following Bicep file shows how to use inline script.

# [CLI](#tab/CLI)

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlineCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    arguments: name
    scriptContent: 'output="Hello $1"; echo $output'
    retentionInterval: 'P1D'
  }
}
```

# [PowerShell](#tab/PowerShell)

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'inlinePS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-name ${name}'
    scriptContent: '''
      param([string] $name)
      $ErrorActionPreference = 'Continue'
      $output = "Hello {0}" -f $name
      Write-Output "Output is: '$output'."
    '''
    retentionInterval: 'P1D'
  }
}
```

You can control how Azure PowerShell responds to non-terminating errors by using the [`$ErrorActionPreference`](/powershell/module/microsoft.powershell.core/about/about_preference_variables#erroractionpreference) variable in your deployment script. If the variable isn't set in your deployment script, the script service uses the default value **Continue**.

The script service sets the resource provisioning state to **Failed** when the script encounters an error despite the setting of `$ErrorActionPreference`.

---

### Load script file

Use the [loadTextContent](bicep-functions-files.md#loadtextcontent) function to retrieve a script file as a string. This function allows you to maintain the script in an external file and access it as a deployment script. The path specified for the script file is relative to the Bicep file.

# [CLI](#tab/CLI)

You can extract the inline script from the preceding Bicep file into a *hello.sh* file, and place the file into a subfolder called *scripts*.

```bash
output="Hello $1"
echo $output
```

And revise the preceding Bicep file as the following Bicep file:

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'loadTextContentCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    arguments: name
    scriptContent: loadTextContent('./scripts/hello.sh')
    retentionInterval: 'P1D'
  }
}
```

# [PowerShell](#tab/PowerShell)

You can extract the inline script from the preceding Bicep file into a *hello.ps1* file, and place the file into a subfolder called *scripts*.

```powershell
param([string] $name)
$output = "Hello {0}" -f $name
Write-Output "Output is: '$output'."
```

And revise the preceding Bicep file as the following:

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'loadTextContentPS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-name ${name}'
    scriptContent: loadTextContent('./scripts/hello.ps1')
    retentionInterval: 'P1D'
  }
}
```

---

### Use external scripts

Apart from inline scripts, external script files are also supported. Only primary PowerShell scripts with the `.ps1` extension are accepted. For CLI scripts, primary scripts can carry any valid bash script extensions or have no extension at all. To employ external script files, swap out 'scriptContent' with 'primaryScriptUri'.

# [CLI](#tab/CLI)

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'externalScriptCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    primaryScriptUri: 'https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/deployment-script/hello.sh'
    arguments: '-name ${name}'
    retentionInterval: 'P1D'
  }
}
```

# [PowerShell](#tab/PowerShell)

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'externalScriptPS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    primaryScriptUri: 'https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/deployment-script/hello.ps1'
    arguments: '-name ${name}'
    retentionInterval: 'P1D'
  }
}
```

---

The external script files must be accessible. To secure your script files that are stored in Azure storage accounts, generate a SAS token and include it in the URI for the template. Set the expiry time to allow enough time to complete the deployment. For more information, see [Deploy private ARM template with SAS token](../templates/secure-template-with-sas-token.md).

You're responsible for ensuring the integrity of the scripts that are referenced by deployment script, either `primaryScriptUri` or `supportingScriptUris`. Reference only scripts that you trust.

### Use supporting scripts


You can separate complicated logics into one or more supporting script files. The `supportingScriptUris` property allows you to provide an array of URIs to the supporting script files if needed:

# [CLI](#tab/CLI)

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'supportingScriptCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    arguments: name
    scriptContent: 'output="Hello $1"; echo $output; ./hello.sh "$1"'
    supportingScriptUris: [
      'https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/hello.sh'
    ]
    retentionInterval: 'P1D'
  }
}
```

# [PowerShell](#tab/PowerShell)

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'supportingScriptPS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-name ${name}'
    scriptContent: '''
      param([string] $name)
      $output = "Hello {0}" -f $name
      Write-Output "Output is: '$output'."
      ./hello.ps1 -name $name
    '''
    supportingScriptUris: [
      'https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/hello.ps1'
    ]
    retentionInterval: 'P1D'
  }
}
```
---

Supporting script files can be called from both inline scripts and primary script files. Supporting script files have no restrictions on the file extension.

The supporting files are copied to `azscripts/azscriptinput` at the runtime. Use relative path to reference the supporting files from inline scripts and primary script files.

## Access Azure resources

To access Azure resources, you must configure the `identity` element. The following Bicep file demonstrates how to retrieve a list of Azure key vaults. Additionally, granting the user-assignment management identity permission to access the key vault is necessary.

# [CLI](#tab/CLI)


```bicep
param identity string
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'listKvCLI'
  location: location
  kind: 'AzureCLI'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity}': {}
    }
  }
  properties: {
    azCliVersion: '2.52.0'
    scriptContent: 'result=$(az keyvault list); echo $result | jq -c \'{Result: map({id: .id})}\' > $AZ_SCRIPTS_OUTPUT_PATH'
    retentionInterval: 'P1D'
  }
}

output result object = deploymentScript.properties.outputs

```

# [PowerShell](#tab/PowerShell)

```bicep
param identity string
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'listKvPS'
  location: location
  kind: 'AzurePowerShell'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '${identity}': {}
    }
  }
  properties: {
    azPowerShellVersion: '10.0'
    scriptContent: '''
      $kvs=Get-AzKeyVault

      $output = @()
      foreach($kv in $kvs){
        $newKv = @{
          id = $kv.resourceId
        }
        $output = $output + $newKv
      }
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs["kvs"] = $output
    '''
    retentionInterval: 'P1D'
  }
}

output result object = deploymentScript.properties.outputs

```

---

> [!NOTE]
> Retry logic for Azure sign in is now built in to the wrapper script. If you grant permissions in the same Bicep file as your deployment scripts, the deployment script service retries sign in for 10 minutes with 10-second interval until the managed identity role assignment is replicated.

## Work with outputs

The approach to handling outputs varies based on the type of script you're using—whether it's Azure PowerShell or Azure CLI.

# [CLI](#tab/CLI)

Azure CLI deployment script utilizes an environment variable named `AZ_SCRIPTS_OUTPUT_PATH` to indicate the location of the script outputs file. When executing a deployment script within a Bicep file, the Bash shell automatically configures this environment variable for you. Its predefined value is set as */mnt/azscripts/azscriptoutput/scriptoutputs.json*. The outputs are required to conform to a valid JSON string object structure. The file's contents should be formatted as a key-value pair. For instance, an array of strings should be saved as { "MyResult": [ "foo", "bar"] }. Storing only the array results, such as [ "foo", "bar" ], is considered invalid.

```bicep
param name string = 'John Dole'
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'outputCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    arguments: name
    scriptContent: 'jq -n -c --arg st "Hello ${name}" \'{"text": $st}\' > $AZ_SCRIPTS_OUTPUT_PATH'
    retentionInterval: 'P1D'
  }
}

output text string = deploymentScript.properties.outputs.text
```

[jq](https://stedolan.github.io/jq/) is used in the preceding sample for constructing outputs. jq comes with the container images. See [Configure development environment](./deployment-script-bicep-configure-dev.md).

# [PowerShell](#tab/PowerShell)

Azure PowerShell deployment script exposes a common variable for storing script outputs.

The following Bicep file shows how to pass values between two `deploymentScripts` resources. In the first resource, you define a variable called `$DeploymentScriptOutputs`, and use it to store the output values. Use resource symbolic name to access the output values.

```bicep
param name string = '\\"John Dole\\"'
param location string = resourceGroup().location

resource deploymentScript1 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'outputPS1'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-name ${name}'
    scriptContent: '''
      param([string] $name)
      $output = 'Hello {0}' -f $name
      $DeploymentScriptOutputs = @{}
      $DeploymentScriptOutputs['text'] = $output
    '''
    retentionInterval: 'P1D'
  }
}

resource deploymentScript2 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'outputPS2'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    arguments: '-textToEcho \\"${deploymentScript1.properties.outputs.text}\\"'
    scriptContent: '''
      param([string] $textToEcho)
      Write-Output $textToEcho
    '''
    retentionInterval: 'P1D'
  }
}
```

---

## Use environment variables


### Pass secured strings to deployment script

Setting environment variables (EnvironmentVariable) in your container instances allows you to provide dynamic configuration of the application or script run by the container. Deployment script handles nonsecured and secured environment variables in the same way as Azure Container Instance. For more information, see [Set environment variables in container instances](../../container-instances/container-instances-environment-variables.md#secure-values).

The max allowed size for environment variables is 64 KB.


# [CLI](#tab/CLI)

```bicep
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'passEnvVariablesCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    environmentVariables: [
      {
        name: 'UserName'
        value: 'jdole'
      }
      {
        name: 'Password'
        secureValue: 'jDolePassword'
      }
    ]
    scriptContent: 'echo "Username is :$Username"; echo "Password is: $Password"'
    retentionInterval: 'P1D'
  }
}
```

# [PowerShell](#tab/PowerShell)

```bicep
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'passEnvVariablesPS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    environmentVariables: [
      {
        name: 'UserName'
        value: 'jdole'
      }
      {
        name: 'Password'
        secureValue: 'jDolePassword'
      }
    ]
    scriptContent: '''
      Write-output "Username is :$Username"
      Write-output "Password is: $Password"
    '''
    retentionInterval: 'P1D'
  }
}
```

---

### System-defined environment variables

The following table list the system-defined environment variables:

|Environment variable|Default value (CLI)|Default value (PowerShell)|System reserved|
|--------------------|-------------|---------------|
|AZ_SCRIPTS_AZURE_ENVIRONMENT|AzureCloud|AzureCloud|N|
|AZ_SCRIPTS_CLEANUP_PREFERENCE|Always|Always|N|
|AZ_SCRIPTS_OUTPUT_PATH|/mnt/azscripts/azscriptoutput/scriptoutputs.json|N/A|Y|
|AZ_SCRIPTS_PATH_INPUT_DIRECTORY|/mnt/azscripts/azscriptinput|/mnt/azscripts/azscriptinput|Y|
|AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY|/mnt/azscripts/azscriptoutput|/mnt/azscripts/azscriptoutput|Y|
|AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME|userscript.sh|userscript.ps1|Y|
|AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME|primaryscripturi.config|primaryscripturi.config|Y|
|AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME|supportingscripturi.config|supportingscripturi.config|Y|
|AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME|scriptoutputs.json|scriptoutputs.json|Y|
|AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME|executionresult.json|executionresult.json|Y|
|AZ_SCRIPTS_USER_ASSIGNED_IDENTITY|||N|

For a sample of using `AZ_SCRIPTS_OUTPUT_PATH`, see [Work with outputs from CLI script](#work-with-outputs).

To access the environment variables:

# [CLI](#tab/CLI)

```bicep
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'listEnvVariablesCLI'
  location: location
  kind: 'AzureCLI'
  properties: {
    azCliVersion: '2.52.0'
    scriptContent: 'echo "AZ_SCRIPTS_AZURE_ENVIRONMENT is : $AZ_SCRIPTS_AZURE_ENVIRONMENT",echo "AZ_SCRIPTS_CLEANUP_PREFERENCE	is : $AZ_SCRIPTS_CLEANUP_PREFERENCE",echo "AZ_SCRIPTS_OUTPUT_PATH	is : $AZ_SCRIPTS_OUTPUT_PATH",echo "AZ_SCRIPTS_PATH_INPUT_DIRECTORY is : $AZ_SCRIPTS_PATH_INPUT_DIRECTORY",echo "AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY is : $AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY",echo "AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME is : $AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME",echo "AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME	is : $AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME",echo "AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME	is : $AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME",echo "AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME	is : $AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME",echo "AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME	is : $AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME",echo "AZ_SCRIPTS_USER_ASSIGNED_IDENTITY	is : $AZ_SCRIPTS_USER_ASSIGNED_IDENTITY"'
    retentionInterval: 'P1D'
  }
}
```

# [PowerShell](#tab/PowerShell)

```bicep
param location string = resourceGroup().location

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'listEnvVariablesPS'
  location: location
  kind: 'AzurePowerShell'
  properties: {
    azPowerShellVersion: '10.0'
    scriptContent: '''
      Write-Output "AZ_SCRIPTS_AZURE_ENVIRONMENT is : ${Env:AZ_SCRIPTS_AZURE_ENVIRONMENT}"
      Write-Output "AZ_SCRIPTS_CLEANUP_PREFERENCE	is : ${Env:AZ_SCRIPTS_CLEANUP_PREFERENCE}"
      Write-Output "AZ_SCRIPTS_OUTPUT_PATH	is : ${Env:AZ_SCRIPTS_OUTPUT_PATH}"
      Write-Output "AZ_SCRIPTS_PATH_INPUT_DIRECTORY is : ${Env:AZ_SCRIPTS_PATH_INPUT_DIRECTORY}"
      Write-Output "AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY is : ${Env:AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY}"
      Write-Output "AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME is : ${Env:AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME}"
      Write-Output "AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME	is : ${Env:AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME}"
      Write-Output "AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME	is : ${Env:AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME}"
      Write-Output "AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME	is : ${Env:AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME}"
      Write-Output "AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME	is : ${Env:AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME}"
      Write-Output "AZ_SCRIPTS_USER_ASSIGNED_IDENTITY	is : ${Env:AZ_SCRIPTS_USER_ASSIGNED_IDENTITY}"
    '''
    retentionInterval: 'P1D'
  }
}
```

---

## Use existing storage account

For the script to run and allow for troubleshooting, a storage account and a container instance are required. You can either designate an existing storage account or let the script service create both the storage account and container instance automatically. The requirements for using an existing storage account:

- The supported kids of storage account are:

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
- Deployment principal must have permissions to manage the storage account, which includes read, create, delete file shares. For more information, see [Configure the minimum permissions](./deployment-script-bicep.md#configure-the-minimum-permissions).

To specify an existing storage account, add the following Bicep to the property element of `Microsoft.Resources/deploymentScripts`:

```bicep
param storageAccountName string = 'myStorageAccount'

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  ...
  properties: {
    ...
    storageAccountSettings: {
      storageAccountName: storageAccountName
      storageAccountKey: listKeys(resourceId('Microsoft.Storage/storageAccounts', storageAccountName), '2023-01-01').keys[0].value
    }
  }
}
```

See [Syntax](#syntax) for a complete `Microsoft.Resources/deploymentScripts` definition sample.

When an existing storage account is used, the script service creates a file share with a unique name. See [Clean up deployment script resources](#clean-up-deployment-script-resources) for how the script service cleans up the file share.

## Configure container instance

Deployment script requires a new Azure Container Instance. You can't specify an existing Azure Container Instance. However, you can customize the container group name by using `containerGroupName`. If not specified, the group name is automatically generated. Additional configuration are required for creating this container instance. For more informaiton, see [configure the minimum permissions](./deployment-script-bicep.md#configure-the-minimum-permissions).

You can also specify subnetIds for running the deployment script in a private network. For more information, see [Access private virtual network](./deployment-script-vnet.md).

```bicep
param containerGroupName string = 'mycustomaci'
param subnetId string = '/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet'

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2020-10-01' = {
  ...
  properties: {
    ...
    containerSettings: {
      containerGroupName: containerGroupName
      subnetIds: [
        {
          id: subnetId
        }
      ]
    }
  }
}
```

## Run script more than once

Deployment script execution is an idempotent operation. If there are no changes to any of the `deploymentScripts` resource properties, including the inline script, the script doesn't execute when you redeploy the Bicep file. The deployment script service compares the resource names in the Bicep file with the existing resources in the same resource group. There are two options if you want to execute the same deployment script multiple times:

- Change the name of your `deploymentScripts` resource. For example, use the [`utcNow` function](./bicep-functions-date.md#utcnow) as the resource name or as a part of the resource name. Changing the resource name creates a new `deploymentScripts` resource. It's good for keeping a history of script execution.

    > [!NOTE]
    > The `utcNow` function can only be used in the default value for a parameter.

- Specify a different value in the `forceUpdateTag` property. For example, use `utcNow` as the value.

> [!IMPORTANT]
> Write deployment scripts to ensure idempotence, guaranteeing that accidental reruns won't result in system alterations. For example, when creating an Azure resource through the deployment script, validate its absence before creation to ensure the script either succeeds or avoids redundant resource creation.

## Clean up deployment script resources

The two automatically created supporting resources can never outlive the `deploymentScript` resource, unless there are failures deleting them. The life cycle of the supporting resources is controlled by the `cleanupPreference` property, the life cycle of the `deploymentScript` resource is controlled by the `retentionInterval` property:

- `cleanupPreference`: Specify the clean-up preference of the two supporting resources when the script execution gets in a terminal state. The supported values are:

  - **Always**: Delete the two supporting resources once script execution gets in a terminal state. If an existing storage account is used, the script service deletes the file share created by the service. Because the `deploymentScripts` resource might still be present after the supporting resources are cleaned up, the script service persists the script execution results, for example, stdout, outputs, and return value before the resources are deleted.
  - **OnSuccess**: Delete the two supporting resources only when the script execution is successful. If an existing storage account is used, the script service removes the file share only when the script execution is successful.

    If the script execution is not successful, the script service waits until the `retentionInterval` expires before it cleans up the supporting resources and then the deployment script resource.
  - **OnExpiration**: Delete the two supporting resources only when the `retentionInterval` setting is expired. If an existing storage account is used, the script service removes the file share, but retains the storage account.

  The container instance and storage account are deleted according to the `cleanupPreference`. However, if the script fails and `cleanupPreference` isn't set to **Always**, the deployment process automatically keeps the container running for one hour or until the container is cleaned up. You can use the time to troubleshoot the script. If you want to keep the container running after successful deployments, add a sleep step to your script. For example, add [Start-Sleep](/powershell/module/microsoft.powershell.utility/start-sleep) to the end of your script. If you don't add the sleep step, the container is set to a terminal state and can't be accessed even if it hasn't been deleted yet.

- `retentionInterval`: Specify the time interval that a `deploymentScript` resource will be retained and after which will be expired and deleted.

> [!NOTE]
> It is not recommended to use the storage account and the container instance that are generated by the script service for other purposes. The two resources might be removed depending on the script life cycle.

## Next steps

In this article, you learned how to use deployment scripts. To walk through a Learn module:

> [!div class="nextstepaction"]
> [Extend ARM templates by using deployment scripts](/training/modules/extend-resource-manager-template-deployment-scripts)
> [Create script development environments](./deployment-script-bicep-configure-dev.md)
> [Create deployment scripts](./deployment-script-develop.md)
> [Access private virtual network](./deployment-script-vnet.md)