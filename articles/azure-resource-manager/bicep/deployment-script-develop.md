---
title: Develop a deployment script in Bicep
description: Learn how to develop a deployment script within a Bicep file or store one externally as a separate file.
ms.custom: devx-track-bicep
ms.topic: conceptual
ms.date: 12/13/2023
---

# Develop a deployment script in Bicep

This article provides examples to show you how to develop a [deployment script](./deployment-script-bicep.md) in Bicep.

Deployment script resources might have a deployment duration. For efficient development and testing of these scripts, consider establishing a dedicated development environment, such as an Azure container instance or a Docker instance. For more information, see [Create a development environment](./deployment-script-bicep-configure-dev.md).

## Syntax

The following Bicep file is an example of a deployment script resource. For more information, see the latest [deployment script schema](/azure/templates/microsoft.resources/deploymentscripts?tabs=bicep).

# [CLI](#tab/CLI)

```bicep
resource <symbolic-name> 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
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
resource <symbolic-name> 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
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

In your deployment script, specify these property values:

- `tags`: Specify deployment script tags. If the deployment script service creates the two supporting resources (a storage account and a container instance), the tags are passed to both resources. You can use the tags to identify the resources. Another way to identify these supporting resources is through their suffixes, which contain *azscripts*. For more information, see [Monitor and troubleshoot deployment scripts](./deployment-script-bicep.md#monitor-and-troubleshoot-a-deployment-script).
- <a id='identity'></a>`identity`: For deployment script API version `2020-10-01` or later, a user-assigned managed identity is optional unless you need to [perform any Azure-specific actions](#access-azure-resources) in the script or you're [running the deployment script in a private network](./deployment-script-vnet.md). API version `2019-10-01-preview` requires a managed identity because the deployment script service uses it to run the scripts.

  When you specify the `identity` property, the script service calls `Connect-AzAccount -Identity` before invoking the user script. Currently, only a user-assigned managed identity is supported. To log in with a different identity in the deployment script, you can call [Connect-AzAccount](/powershell/module/az.accounts/connect-azaccount). For more information, see [Configure the minimum permissions](./deployment-script-bicep.md#configure-the-minimum-permissions).
- `kind`: Specify the type of script, either `AzurePowerShell` or `AzureCLI`. In addition to `kind`, you need to specify the `azPowerShellVersion` or `azCliVersion` property.
- `storageAccountSettings`: Specify the settings to use an existing storage account. If `storageAccountName` is not specified, a storage account is automatically created. For more information, see [Use an existing storage account](#use-an-existing-storage-account).
- `containerSettings`: Customize the name of the Azure container instance. For information about configuring the container's group name, see [Configure a container instance](#configure-a-container-instance) later in this article. For information about configuring `subnetIds` to run the deployment script in a private network, see [Access a private virtual network](./deployment-script-vnet.md).
- `environmentVariables`: Specify the [environment variables](#use-environment-variables) to pass over to the script.
- `azPowerShellVersion`/`azCliVersion`: Specify the module version to use.

    # [CLI](#tab/CLI)

    See a list of [supported Azure CLI versions](https://mcr.microsoft.com/v2/azure-cli/tags/list).

    > [!IMPORTANT]
    > The deployment script uses the available CLI images from Microsoft Artifact Registry. It typically takes about one month to certify a CLI image for a deployment script. Don't use CLI versions that were released within the past 30 days. To find the release dates for the images, see [Azure CLI release notes](/cli/azure/release-notes-azure-cli). If you use an unsupported version, the error message lists the supported versions.

    # [PowerShell](#tab/PowerShell)

    See a list of [supported Azure PowerShell versions](https://mcr.microsoft.com/v2/azuredeploymentscripts-powershell/tags/list). The version determines which container image to use:

    - Az version *greater than or equal to 9* uses Ubuntu 22.04.
    - Az version *greater than or equal to 6 but less than 9* uses Ubuntu 20.04.
    - Az version *less than 6* uses Ubuntu 18.04.

    > [!IMPORTANT]
    > We advise you to upgrade to the latest version of Ubuntu. Ubuntu 18.04 is nearing its end of support and won't receive security updates after [May 31, 2023](https://ubuntu.com/18-04).

    ---

- `arguments`: Specify the parameter values. The values are separated by spaces.

  The deployment script splits the arguments into an array of strings by invoking the [CommandLineToArgvW](/windows/win32/api/shellapi/nf-shellapi-commandlinetoargvw) system call. This step is necessary because the arguments are passed as a [command property](/rest/api/container-instances/2022-09-01/container-groups/create-or-update#containerexec) to Azure Container Instances, and the command property is an array of strings.

  If the arguments contain escaped characters, double escape the characters. For example, in the previous sample Bicep syntax, the argument is `-name \"John Dole\"`. The escaped string is `-name \\"John Dole\\"`.

  To pass a Bicep parameter of type `object` as an argument, convert the object to a string by using the [string()](./bicep-functions-string.md#string) function, and then use the [replace()](./bicep-functions-string.md#replace) function to replace any quotation marks (`"`) with double-escaped quotation marks (`\\"`). For example:

  ```json
  replace(string(parameters('tables')), '"', '\\"')
  ```

  For more information, see the [sample Bicep file](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/main/samples/deployment-script/deploymentscript-jsonEscape.bicep).

- `scriptContent`: Specify the script content. It can be an inline script or an external script file that you imported by using the [loadTextContent](./bicep-functions-files.md#loadtextcontent) function. For more information, see [Inline vs. external file](#inline-vs-external-file) later in this article. To run an external script, use `primaryScriptUri` instead.
- `primaryScriptUri`: Specify a publicly accessible URL to the primary deployment script with supported file extensions. For more information, see [Use external scripts](#use-external-scripts) later in this article.
- `supportingScriptUris`: Specify an array of publicly accessible URLs to supporting files that are called in either `scriptContent` or `primaryScriptUri`. For more information, see [Inline vs. external file](#inline-vs-external-file) later in this article.
- `timeout`: Specify the maximum allowed time for script execution, in [ISO 8601 format](https://en.wikipedia.org/wiki/ISO_8601). The default value is `P1D`.
- `forceUpdateTag`: Changing this value between Bicep file deployments forces the deployment script to run again. If you use the `newGuid()` or `utcNow()` function, you can use it only in the default value for a parameter. To learn more, see [Run a script more than once](#run-a-script-more-than-once) later in this article.
- `cleanupPreference`. Specify the preference for cleaning up the two supporting deployment resources (the storage account and the container instance) when the script execution gets in a terminal state. The default setting is `Always`, which calls for the deletion of supporting resources regardless of the terminal state (`Succeeded`, `Failed`, or `Canceled`). To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources) later in this article.
- `retentionInterval`: Specify the interval for which the service retains the deployment script resource after the deployment script execution reaches a terminal state. The deployment script resource is deleted when this duration expires. Duration is based on the [ISO 8601 pattern](https://en.wikipedia.org/wiki/ISO_8601). The retention interval is between 1 hour (`PT1H`) and 26 hours (`PT26H`). You use this property when `cleanupPreference` is set to `OnExpiration`. To learn more, see [Clean up deployment script resources](#clean-up-deployment-script-resources) later in this article.

### More samples

- [Sample 1](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/deploymentscript-keyvault.bicep): Create a key vault and use a deployment script to assign a certificate to the key vault.
- [Sample 2](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/deploymentscript-keyvault-subscription.bicep): Create a resource group at the subscription level, create a key vault in the resource group, and then use a deployment script to assign a certificate to the key vault.
- [Sample 3](https://raw.githubusercontent.com/Azure/azure-docs-bicep-samples/master/samples/deployment-script/deploymentscript-keyvault-mi.bicep): Create a user-assigned managed identity, assign the contributor role to the identity at the resource group level, create a key vault, and then use a deployment script to assign a certificate to the key vault.
- [Sample 4](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.resources/deployment-script-azcli-graph-azure-ad): Manually create a user-assigned managed identity and assign it permission to use the Microsoft Graph API to create Microsoft Entra applications. In the Bicep file, use a deployment script to create a Microsoft Entra application and service principal, and to output the object IDs
and client ID.

## Inline vs. external file

A deployment script can reside within a Bicep file, or you can store it externally as a separate file.

### Use an inline script

The following Bicep file shows how to use an inline script.

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
    scriptContent: 'set -e; output="Hello $1"; echo $output'
    retentionInterval: 'P1D'
  }
}
```

Include `set -e` in your script to enable immediate exit if a command returns a nonzero status. This practice streamlines error debugging processes.

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
      $ErrorActionPreference = 'Stop'
      $output = "Hello {0}" -f $name
      Write-Output "Output is: '$output'."
    '''
    retentionInterval: 'P1D'
  }
}
```

You can control how Azure PowerShell responds to nonterminating errors by using the [`$ErrorActionPreference`](/powershell/module/microsoft.powershell.core/about/about_preference_variables#erroractionpreference) variable in your script. If you don't set the variable in your deployment script, the script service uses the default value `Continue`. Setting the value to `Stop` makes errors easier to debug.

The script service sets the resource provisioning state to `Failed` when the script encounters an error, despite the setting of `$ErrorActionPreference`.

---

### Load a script file

Use the [loadTextContent](bicep-functions-files.md#loadtextcontent) function to retrieve a script file as a string. This function allows you to maintain the script in an external file and access it as a deployment script. The path specified for the script file is relative to the Bicep file.

# [CLI](#tab/CLI)

You can extract the inline script from the preceding Bicep file into a *hello.sh* file, and then place the file into a subfolder called *scripts*.

```bash
output="Hello $1"
echo $output
```

Then, you can revise the preceding Bicep file like the following example:

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

You can extract the inline script from the preceding Bicep file into a *hello.ps1* file, and then place the file into a subfolder called *scripts*.

```powershell
param([string] $name)
$output = "Hello {0}" -f $name
Write-Output "Output is: '$output'."
```

Then, you can revise the preceding Bicep file like the following example:

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

You can use external script files instead of inline scripts. Only primary PowerShell scripts with the *.ps1* extension are supported. For CLI scripts, primary scripts can carry any valid Bash script extensions or have no extension at all. To employ external script files, swap out `scriptContent` with `primaryScriptUri`.

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

The external script files must be accessible. To help secure your script files that are stored in Azure storage accounts, generate a shared access signature (SAS) token and include it in the URI for the template. Set the expiration to allow enough time to complete the deployment. For more information, see [Deploy a private ARM template with a SAS token](../templates/secure-template-with-sas-token.md).

You're responsible for ensuring the integrity of the script that the deployment script references (either `primaryScriptUri` or `supportingScriptUris`). Reference only scripts that you trust.

### Use supporting scripts

You can separate complicated logics into one or more supporting script files. Use the `supportingScriptUris` property to provide an array of URIs to the supporting script files if necessary.

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

You can call supporting script files from both inline scripts and primary script files. Supporting script files have no restrictions on the file extension.

The supporting files are copied to *azscripts/azscriptinput* at runtime. Use a relative path to reference the supporting files from inline scripts and primary script files.

## Access Azure resources

To access Azure resources, you must configure the `identity` element. The following Bicep file demonstrates how to retrieve a list of Azure key vaults. Granting the user-assignment management identity permission to access the key vault is also necessary.

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
> Retry logic for Azure sign-in is now built in to the wrapper script. If you grant permissions in the same Bicep file as your deployment scripts, the deployment script service retries sign-in for 10 minutes (with 10-second intervals) until the managed identity's role assignment is replicated.

## Work with outputs

The approach to handling outputs varies based on the type of script you're using—the Azure CLI or Azure PowerShell.

# [CLI](#tab/CLI)

The Azure CLI deployment script uses an environment variable named `AZ_SCRIPTS_OUTPUT_PATH` to indicate the location of the file for script outputs. When you're running a deployment script within a Bicep file, the Bash shell automatically configures this environment variable for you. Its predefined value is set as `/mnt/azscripts/azscriptoutput/scriptoutputs.json`.

The outputs must conform to a valid JSON string object structure. The file's contents should be formatted as a key/value pair. For instance, save an array of strings as `{ "MyResult": [ "foo", "bar"] }`. Storing only the array results, such as `[ "foo", "bar" ]`, is invalid.

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

The preceding sample uses [jq](https://stedolan.github.io/jq/) for constructing outputs. The jq tool comes with the container images. For more information, see [Configure a development environment](./deployment-script-bicep-configure-dev.md).

# [PowerShell](#tab/PowerShell)

An Azure PowerShell deployment script exposes a common variable for storing script outputs.

The following Bicep file shows how to pass values between two `deploymentScripts` resources. In the first resource, you define a variable called `$DeploymentScriptOutputs` and use it to store the output values. Use the resource symbolic name to access the output values.

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

### Pass secured strings to a deployment script

You can set environment variables (`EnvironmentVariable`) in your container instances to provide dynamic configuration of the application or script that the container runs. A deployment script handles nonsecured and secured environment variables in the same way as Azure Container Instances. For more information, see [Set environment variables in container instances](../../container-instances/container-instances-environment-variables.md#secure-values).

The maximum allowed size for environment variables is 64 KB.

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

The following table lists the system-defined environment variables:

|Environment variable|Default value (CLI)|Default value (PowerShell)|System reserved|
|--------------------|-------------|---------------|
|`AZ_SCRIPTS_AZURE_ENVIRONMENT`|`AzureCloud`|`AzureCloud`|No|
|`AZ_SCRIPTS_CLEANUP_PREFERENCE`|`Always`|`Always`|No|
|`AZ_SCRIPTS_OUTPUT_PATH`|/`mnt/azscripts/azscriptoutput/scriptoutputs.json`|Not applicable|Yes|
|`AZ_SCRIPTS_PATH_INPUT_DIRECTORY`|`/mnt/azscripts/azscriptinput|/mnt/azscripts/azscriptinput`|Not applicable|Yes|
|`AZ_SCRIPTS_PATH_OUTPUT_DIRECTORY`|`/mnt/azscripts/azscriptoutput|/mnt/azscripts/azscriptoutput`|Not applicable|Yes|
|`AZ_SCRIPTS_PATH_USER_SCRIPT_FILE_NAME`|`userscript.sh`|`userscript.ps1`|Yes|
|`AZ_SCRIPTS_PATH_PRIMARY_SCRIPT_URI_FILE_NAME`|`primaryscripturi.config`|`primaryscripturi.config`|Yes|
|`AZ_SCRIPTS_PATH_SUPPORTING_SCRIPT_URI_FILE_NAME`|`supportingscripturi.config`|`supportingscripturi.config`|Yes|
|`AZ_SCRIPTS_PATH_SCRIPT_OUTPUT_FILE_NAME`|`scriptoutputs.json`|`scriptoutputs.json`|Yes|
|`AZ_SCRIPTS_PATH_EXECUTION_RESULTS_FILE_NAME`|`executionresult.json`|`executionresult.json`|Yes|
|`AZ_SCRIPTS_USER_ASSIGNED_IDENTITY`|Not applicable|Not applicable|No|

For a sample of using `AZ_SCRIPTS_OUTPUT_PATH`, see [Work with outputs](#work-with-outputs) earlier in this article.

To access the environment variables, use the following code.

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

## Use an existing storage account

For the script to run and allow for troubleshooting, you need a storage account and a container instance. You can either designate an existing storage account or let the script service create both the storage account and the container instance automatically.

Here are the requirements for using an existing storage account:

- The following table lists the supported account types. The column for tiers refers to the value of the `-SkuName` or `--sku` parameter. The column for supported types refers to the `-Kind` or `--kind` parameter.

    | Tier             | Supported type     |
    |-----------------|--------------------|
    | `Premium_LRS`     | `FileStorage`        |
    | `Premium_ZRS`     | `FileStorage`        |
    | `Standard_GRS`    | `Storage`, `StorageV2` |
    | `Standard_GZRS`   | `StorageV2`          |
    | `Standard_LRS`    | `Storage`, `StorageV2` |
    | `Standard_RAGRS`  | `Storage`, `StorageV2` |
    | `Standard_RAGZRS` | `StorageV2`          |
    | `Standard_ZRS`    | `StorageV2`          |

    These combinations support file shares. For more information, see [Create an Azure file share](../../storage/files/storage-how-to-create-file-share.md) and [Types of storage accounts](../../storage/common/storage-account-overview.md).

- Firewall rules for storage accounts aren't supported yet. For more information, see [Configure Azure Storage firewalls and virtual networks](../../storage/common/storage-network-security.md).
- The deployment principal must have permissions to manage the storage account, which includes reading, creating, and deleting file shares. For more information, see [Configure the minimum permissions](./deployment-script-bicep.md#configure-the-minimum-permissions).

To specify an existing storage account, add the following Bicep code to the property element of `Microsoft.Resources/deploymentScripts`:

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

For a complete `Microsoft.Resources/deploymentScripts` definition sample, see [Syntax](#syntax) earlier in this article.

When you use an existing storage account, the script service creates a file share that has a unique name. To learn how the script service cleans up the file share, see [Clean up deployment script resources](#clean-up-deployment-script-resources) later in this article.

## Configure a container instance

A deployment script requires a new Azure container instance. You can't specify an existing container instance. However, you can customize the container's group name by using `containerGroupName`. If you don't specify a group name, it's automatically generated. Additional configurations are required for creating this container instance. For more information, see [Configure the minimum permissions](./deployment-script-bicep.md#configure-the-minimum-permissions).

You can also specify `subnetId` values for running the deployment script in a private network. For more information, see [Access a private virtual network](./deployment-script-vnet.md).

```bicep
param containerGroupName string = 'mycustomaci'
param subnetId string = '/subscriptions/01234567-89AB-CDEF-0123-456789ABCDEF/resourceGroups/myResourceGroup/providers/Microsoft.Network/virtualNetworks/myVnet/subnets/mySubnet'

resource deploymentScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
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

## Run a script more than once

Deployment script execution is an idempotent operation. If there are no changes to any of the `deploymentScripts` resource properties, including the inline script, the script doesn't run when you redeploy the Bicep file.

The deployment script service compares the resource names in the Bicep file with the existing resources in the same resource group. There are two options if you want to run the same deployment script multiple times:

- Change the name of your `deploymentScripts` resource. For example, use the [utcNow function](./bicep-functions-date.md#utcnow) as the resource name or as a part of the resource name. You can use the `utcNow` function only in the default value for a parameter.

  Changing the resource name creates a new `deploymentScripts` resource. It's good for keeping a history of script execution.

- Specify a different value in the `forceUpdateTag` property. For example, use `utcNow` as the value.

Write deployment scripts to ensure idempotence, so accidental reruns won't result in system alterations. For example, when you're creating an Azure resource through the deployment script, validate its absence before creation to ensure that the script either succeeds or avoids redundant resource creation.

## Use Microsoft Graph within a deployment script

A deployment script can use [Microsoft Graph](/graph/overview) to create and work with objects in Microsoft Entra ID.

### Commands

When you use Azure CLI deployment scripts, you can use commands within the `az ad` command group to work with applications, service principals, groups, and users. You can also directly invoke Microsoft Graph APIs by using the `az rest` command.

When you use Azure PowerShell deployment scripts, you can use the `Invoke-RestMethod` cmdlet to directly invoke the Microsoft Graph APIs.

### Permissions

The identity that your deployment script uses needs to be authorized to work with the Microsoft Graph API, with the appropriate permissions for the operations that it performs. You must authorize the identity outside your Bicep file, such as by precreating a user-assigned managed identity and assigning it an app role for Microsoft Graph. For more information, see [this quickstart example](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.resources/deployment-script-azcli-graph-azure-ad).

## Clean up deployment script resources

The two automatically created supporting resources can never outlive the `deploymentScript` resource, unless failures delete them. The `cleanupPreference` property controls the life cycle of the supporting resources. The `retentionInterval` property controls the life cycle of the `deploymentScript` resource. Here's how to use these properties:

- `cleanupPreference`: Specify the cleanup preference of the two supporting resources when the script execution gets in a terminal state. The supported values are:

  - `Always`: Delete the two supporting resources after script execution gets in a terminal state. If you use an existing storage account, the script service deletes the file share that the service created. Because the `deploymentScripts` resource might still be present after the supporting resources are cleaned up, the script service persists the script execution results (for example, `stdout`), outputs, and return value before the resources are deleted.
  - `OnSuccess`: Delete the two supporting resources only when the script execution is successful. If you use an existing storage account, the script service removes the file share only when the script execution is successful.

    If the script execution is not successful, the script service waits until the `retentionInterval` value expires before it cleans up the supporting resources and then the deployment script resource.
  - `OnExpiration`: Delete the two supporting resources only when the `retentionInterval` setting is expired. If you use an existing storage account, the script service removes the file share but retains the storage account.

  The container instance and storage account are deleted according to the `cleanupPreference` value. However, if the script fails and `cleanupPreference` isn't set to `Always`, the deployment process automatically keeps the container running for one hour or until the container is cleaned up. You can use the time to troubleshoot the script.
  
  If you want to keep the container running after successful deployments, add a sleep step to your script. For example, add [Start-Sleep](/powershell/module/microsoft.powershell.utility/start-sleep) to the end of your script. If you don't add the sleep step, the container is set to a terminal state and can't be accessed even if you haven't deleted it yet.

- `retentionInterval`: Specify the time interval that a `deploymentScript` resource will be retained before it's expired and deleted.

> [!NOTE]
> We don't recommend that you use the storage account and the container instance that the script service generates for other purposes. The two resources might be removed, depending on the script's life cycle.

## Next steps

In this article, you learned how to create deployment script resources. To learn more:

> [!div class="nextstepaction"]
> [Use deployment scripts in Bicep](./deployment-script-bicep.md)