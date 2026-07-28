---
title: Bicep functions - files
description: Describes the functions to use in a Bicep file to load content from a file.
ms.topic: reference
ms.custom: devx-track-bicep
ms.date: 07/09/2026
---

# File functions for Bicep

This article describes the Bicep functions for loading content from external files.

## loadDirectoryFileInfo

`loadDirectoryFileInfo(directoryPath, [searchPattern])`

Loads basic information about a directory's files as a Bicep object. The function loads files during compilation, not at runtime.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

|   Parameter   | Required |  Type  |                                                                      Description                                                                      |
| :------------ | :------- | :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| directoryPath | Yes      | string | The path is relative to the Bicep file invoking this function. You can use variables if they're compile-time constants, but you can't use parameters. |
| searchPattern | No       | string | The search pattern to use when loading files. This pattern can include wildcards.                                                                     |

### Return value

An array of objects, each representing a file in the directory. Each object contains the following properties:

|   Property   |  Type  |                Description                 |
| :----------- | :----- | :----------------------------------------- |
| baseName     | string | The name of the file.                      |
| extension    | string | The file's extension.                      |
| relativePath | string | The relative path to the current template. |

### Examples

The following example loads the file information for all Bicep files in the `./modules/` directory.

```bicep
var dirFileInfo = loadDirectoryFileInfo('./modules/', '*.bicep')

output dirFileInfoOutput object[] = dirFileInfo
```

The folder only contains one file named `appService.bicep`. The output is:

```json
[{"relativePath":"modules/appService.bicep","baseName":"appService.bicep","extension":".bicep"}]
```

## loadFileAsBase64

`loadFileAsBase64(filePath)`

Loads the file as a base64 string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required |  Type  |                                                Description                                                 |
| :-------- | :------- | :----- | :--------------------------------------------------------------------------------------------------------- |
| filePath  | Yes      | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't include variables. |

### Remarks

Use this function when you have binary content you want to include in deployment. Rather than manually encoding the file to a base64 string and adding it to your Bicep file, load the file by using this function. The file is loaded when the Bicep file is compiled to a JSON template. You can't use variables in the file path because the compiler doesn't resolve them when compiling to the template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

This function requires [Bicep CLI version 0.4.X or higher](./install.md).

The maximum allowed size of the file is **96 KB**.

### Return value

The file as a base64 string.

### Examples

The following example loads a PowerShell script as a base64 string and uses it with the Custom Script Extension for a virtual machine (VM).

```bicep
param vmName string
param location string

resource vmExtension 'Microsoft.Compute/virtualMachines/extensions@2024-07-01' = {
  name: '${vmName}/CustomScriptExtension'
  location: location
  properties: {
    publisher: 'Microsoft.Compute'
    type: 'CustomScriptExtension'
    typeHandlerVersion: '1.10'
    autoUpgradeMinorVersion: true
    forceUpdateTag: 'true'
    protectedSettings: {
      commandToExecute: 'powershell.exe -ExecutionPolicy Unrestricted -Command "iex ""& { $([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(\'${loadFileAsBase64('vm-provisioning.ps1')}\'))) } -ParamX foo -ParamY bar"""'
    }
  }
}
```

> [!NOTE]
> This example doesn't use the PowerShell `-EncodedCommand` parameter. `-EncodedCommand` expects a UTF-16LE-encoded command. This example instead passes a base64 string to PowerShell and explicitly decodes it as UTF-8 before invoking the script.

The script file is loaded during Bicep compilation and embedded in the generated JSON template as a base64-encoded string. When the deployment runs, PowerShell decodes the string and invokes the script on the VM. This approach is useful when embedding script content directly in `commandToExecute`, because it avoids many quoting, escaping, and newline issues that can occur with multiline script content.

You can also encode an inline multi-line string with `base64()` and pass named parameters to the decoded script. For more information, see [multi-line string literal](./data-types.md#multi-line-strings).

```bicep
var scriptContent = '''
param(
  [string] $Name
)

Write-Host "Hello $Name!"
'''

var scriptArgs = {
  Name: 'MyValue'
}

// Builds a string of the form '-ArgA ValA -ArgB ValB'
var argumentString = join(map(items(scriptArgs), i => '-${i.key} ${i.value}'), ' ')

var commandToExecute = 'powershell.exe -ExecutionPolicy Unrestricted -Command "iex \\"& { $([System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String(\'${base64(scriptContent)}\'))) } ${argumentString}\\""'
```

> [!NOTE]
> This example works because the argument value (`MyValue`) contains no special characters. The simple `join`/`map` builder doesn't escape or quote values. It will fail if any value contains spaces (which must be wrapped in quotes), or single quotes, double quotes, or other characters that are special to PowerShell's command-line argument parser (which must be escaped with `replace()`).
>
> For a complete example that handles booleans, integers, strings with full escaping, arrays, and objects correctly, see [Create a Deployment Script with complex inputs & outputs](/samples/azure/azure-quickstart-templates/deployment-script-azpwsh-inputs-outputs).

## loadJsonContent

`loadJsonContent(filePath, [jsonPath], [encoding])`

Loads the specified JSON file as an Any object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required |  Type  |                                                               Description                                                               |
| :-------- | :------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| filePath  | Yes      | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't include variables.                              |
| jsonPath  | No       | string | JSONPath expression to specify that only part of the file is loaded.                                                                    |
| encoding  | No       | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`. |

### Remarks

Use this function when you have JSON content or minified JSON content that you store in a separate file. Instead of duplicating the JSON content in your Bicep file, use this function to load the content. You can load a part of a JSON file by specifying a JSON path. The Bicep compiler loads the file when it compiles the Bicep file to the JSON template. You can't include variables in the file path because the compiler can't resolve them when compiling to the template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

In VS Code, IntelliSense is available for the properties of the loaded object. For example, you can create a file with values to share across many Bicep files. An example is shown in this article.

This function requires [Bicep CLI version 0.7.X or higher](./install.md).

The maximum allowed size of the file is **1,048,576 characters**, including line endings.

### Return value

The contents of the file as an Any object.

### Examples

The following example creates a JSON file that contains values for a network security group.

```json
{
  "description": "Allows SSH traffic",
  "protocol": "Tcp",
  "sourcePortRange": "*",
  "destinationPortRange": "22",
  "sourceAddressPrefix": "*",
  "destinationAddressPrefix": "*",
  "access": "Allow",
  "priority": 100,
  "direction": "Inbound"
}
```

You load that file and convert it to a JSON object. You use the object to assign values to the resource.

```bicep
param location string = resourceGroup().location

var nsgconfig = loadJsonContent('nsg-security-rules.json')

resource newNSG 'Microsoft.Network/networkSecurityGroups@2025-01-01' = {
  name: 'example-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'SSH'
        properties: nsgconfig
      }
    ]
  }
}
```

You can reuse the file of values in other Bicep files that deploy a network security group.

## loadYamlContent

`loadYamlContent(filePath, [pathFilter], [encoding])`

Loads the specified YAML file as an Any object.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter  | Required |  Type  |                                                               Description                                                               |
| :--------- | :------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| filePath   | Yes      | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't include variables.                              |
| pathFilter | No       | string | The path filter is a JSONPath expression to specify that only part of the file is loaded.                                               |
| encoding   | No       | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`. |

### Remarks

Use this function when you have YAML content or minified YAML content that you store in a separate file. Instead of duplicating the YAML content in your Bicep file, use this function to load the content. You can load a part of a YAML file by specifying a path filter. The Bicep compiler loads the file when it compiles the Bicep file to the YAML template. You can't include variables in the file path because the compiler can't resolve them when compiling to the template. During deployment, the YAML template contains the contents of the file as a hard-coded string.

In VS Code, IntelliSense is available for the properties of the loaded object. For example, you can create a file with values to share across many Bicep files. An example is shown in this article.

This function requires [Bicep CLI version 0.16.X or higher](./install.md).

The maximum allowed size of the file is **1,048,576 characters**, including line endings.

### Return value

The contents of the file as an Any object.

### Examples

The following example creates a YAML file that contains values for a network security group.

```yaml
description: "Allows SSH traffic"
protocol: "Tcp"
sourcePortRange: "*"
destinationPortRange: "22"
sourceAddressPrefix: "*"
destinationAddressPrefix: "*"
access: "Allow"
priority: 100
direction: "Inbound"
```

You load that file and convert it to a JSON object. You use the object to assign values to the resource.

```bicep
param location string = resourceGroup().location

var nsgconfig = loadYamlContent('nsg-security-rules.yaml')

resource newNSG 'Microsoft.Network/networkSecurityGroups@2025-01-01' = {
  name: 'example-nsg'
  location: location
  properties: {
    securityRules: [
      {
        name: 'SSH'
        properties: nsgconfig
      }
    ]
  }
}
```

You can reuse the file of values in other Bicep files that deploy a network security group.

## loadTextContent

`loadTextContent(filePath, [encoding])`

Loads the content of the specified file as a string.

Namespace: [sys](bicep-functions.md#namespaces-for-functions).

### Parameters

| Parameter | Required |  Type  |                                                               Description                                                               |
| :-------- | :------- | :----- | :-------------------------------------------------------------------------------------------------------------------------------------- |
| filePath  | Yes      | string | The path to the file to load. The path is relative to the deployed Bicep file. It can't contain variables.                              |
| encoding  | No       | string | The file encoding. The default value is `utf-8`. The available options are: `iso-8859-1`, `us-ascii`, `utf-16`, `utf-16BE`, or `utf-8`. |

### Remarks

Use this function when you have content that is stored in a separate file. You can load the content rather than duplicating it in your Bicep file. For example, you can load a deployment script from a file. The file is loaded when the Bicep file is compiled to the JSON template. You can't include any variables in the file path because they aren't resolved when compiling to the template. During deployment, the JSON template contains the contents of the file as a hard-coded string.

To load JSON files, use the [`loadJsonContent()`](#loadjsoncontent) function.

This function requires [Bicep CLI version 0.4.X or higher](./install.md).

The maximum allowed size of the file is **131,072 characters**, including line endings.

### Return value

The contents of the file as a string.

### Examples

The following example shows how to load a script from a file and use it for a deployment script.

```bicep
resource exampleScript 'Microsoft.Resources/deploymentScripts@2023-08-01' = {
  name: 'exampleScript'
  location: resourceGroup().location
  kind: 'AzurePowerShell'
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: {
      '/subscriptions/{sub-id}/resourcegroups/{rg-name}/providers/Microsoft.ManagedIdentity/userAssignedIdentities/{id-name}': {}
    }
  }
  properties: {
    azPowerShellVersion: '14.0'
    scriptContent: loadTextContent('myscript.ps1')
    retentionInterval: 'P1D'
  }
}
```

## Next steps

For a description of the sections in a Bicep file, see [Understand the structure and syntax of Bicep files](./file.md).
