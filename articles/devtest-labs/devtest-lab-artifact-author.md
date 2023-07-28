---
title: Create custom artifacts for virtual machines
description: Learn how to create and use artifacts to deploy and set up applications on DevTest Labs virtual machines.
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 01/11/2022
ms.custom: UpdateFrequency2
---

# Create custom artifacts for DevTest Labs

This article describes how to create custom artifact files for Azure DevTest Labs virtual machines (VMs). DevTest Labs artifacts specify actions to take to provision a VM. An artifact consists of an artifact definition file and other script files that you store in a folder in a Git repository.

- For information about adding your artifact repositories to labs, see [Add an artifact repository to your lab](add-artifact-repository.md).
- For information about adding the artifacts you create to VMs, see [Add artifacts to DevTest Labs VMs](add-artifact-vm.md).
- For information about specifying mandatory artifacts to be added to all lab VMs, see [Specify mandatory artifacts for DevTest Labs VMs](devtest-lab-mandatory-artifacts.md).

## Artifact definition files

Artifact definition files are JSON expressions that specify what you want to install on a VM. The files define the name of an artifact, a command to run, and available parameters for the command. You can refer to other script files by name in the artifact definition file.

The following example shows the sections that make up the basic structure of an *artifactfile.json* artifact definition file:

```json
  {
    "$schema": "https://raw.githubusercontent.com/Azure/azure-devtestlab/master/schemas/2016-11-28/dtlArtifacts.json",
    "title": "",
    "description": "",
    "iconUri": "",
    "targetOsType": "",
    "parameters": {
      "<parameterName>": {
        "type": "",
        "displayName": "",
        "description": ""
      }
    },
    "runCommand": {
      "commandToExecute": ""
    }
  }
```

| Element name | Description |
| --- | --- |
| `$schema` |Location of the JSON schema file. The JSON schema file can help you test the validity of the definition file.|
| `title` |Name of the artifact to display in the lab. **Required.**|
| `description` |Description of the artifact to display in the lab. **Required.**|
| `iconUri` |URI of the artifact icon to display in the lab.|
| `targetOsType` |Operating system of the VM to install the artifact on. Supported values: `Windows`, `Linux`. **Required.**|
| `parameters` |Values to customize the artifact when installing on the VM.|
| `runCommand` |The artifact install command to execute on the VM. **Required.**|

### Artifact parameters

In the parameters section of the definition file, specify the values a user can input when installing an artifact. You can refer to these values in the artifact install command.

To define parameters, use the following structure:

```json
  "parameters": {
    "<parameterName>": {
      "type": "<type-of-parameter-value>",
      "displayName": "<display-name-of-parameter>",
      "description": "<description-of-parameter>"
    }
  }
```

| Element name | Description |
| --- | --- |
| `type` |Type of parameter value. **Required.**|
| `displayName` |Name of the parameter to display to the lab user. **Required.**|
| `description` |Description of the parameter to display to the lab user. **Required.**|

The allowed parameter value types are:

| Type | Description |
| --- | --- |
|`string`|Any valid JSON string|
|`int`|Any valid JSON integer|
|`bool`|Any valid JSON boolean|
|`array`|Any valid JSON array|

### Secrets as secure strings

To declare secrets as secure string parameters with masked characters in the UI, use the following syntax in the `parameters` section of the *artifactfile.json* file:

```json

    "securestringParam": {
      "type": "securestring",
      "displayName": "Secure String Parameter",
      "description": "Any text string is allowed, including spaces, and will be presented in UI as masked characters.",
      "allowEmpty": false
    },
```

The artifact install command to run the PowerShell script takes the secure string created by using the `ConvertTo-SecureString` command.

```json
  "runCommand": {
    "commandToExecute": "[concat('powershell.exe -ExecutionPolicy bypass \"& ./artifact.ps1 -StringParam ''', parameters('stringParam'), ''' -SecureStringParam (ConvertTo-SecureString ''', parameters('securestringParam'), ''' -AsPlainText -Force) -IntParam ', parameters('intParam'), ' -BoolParam:$', parameters('boolParam'), ' -FileContentsParam ''', parameters('fileContentsParam'), ''' -ExtraLogLines ', parameters('extraLogLines'), ' -ForceFail:$', parameters('forceFail'), '\"')]"
  }
```

Don't log secrets to the console, because the script captures output for user debugging.

### Artifact expressions and functions

You can use expressions and functions to construct the artifact install command. Expressions evaluate when the artifact installs. Expressions can appear anywhere in a JSON string value, and always return another JSON value. Enclose expressions with brackets, \[ \]. If you need to use a literal string that starts with a bracket, use two brackets \[\[.

You usually use expressions with functions to construct a value. Function calls are formatted as `functionName(arg1, arg2, arg3)`.

Common functions include:

| Function | Description |
| --- | --- |
|`parameters(parameterName)`|Returns a parameter value to provide when the artifact command runs.|
|`concat(arg1, arg2, arg3, ...)`|Combines multiple string values. This function can take various arguments.|

The following example uses expressions and functions to construct a value:

```json
  runCommand": {
      "commandToExecute": "[concat('powershell.exe -ExecutionPolicy bypass \"& ./startChocolatey.ps1'
  , ' -RawPackagesList ', parameters('packages')
  , ' -Username ', parameters('installUsername')
  , ' -Password ', parameters('installPassword'))]"
  }
```

## Create a custom artifact

To create a custom artifact:

- Install a JSON editor to work with artifact definition files. [Visual Studio Code](https://code.visualstudio.com/) is available for Windows, Linux, and macOS.

- Start with a sample *artifactfile.json* definition file.

  The public [DevTest Labs artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) has a rich library of artifacts you can use. You can download an artifact definition file and customize it to create your own artifacts.

  This article uses the *artifactfile.json* definition file and *artifact.ps1* PowerShell script at [https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes).

- Use IntelliSense to see valid elements and value options that you can use to construct an artifact definition file. For example, when you edit the `targetOsType` element, IntelliSense shows you `Windows` or `Linux` options.

- Store your artifacts in public or private Git artifact repositories.

  - Store each *artifactfile.json* artifact definition file in a separate directory named the same as the artifact name.
  - Store the scripts that the install command references in the same directory as the artifact definition file.
      
  The following screenshot shows an example artifact folder:

  ![Screenshot that shows an example artifact folder.](./media/devtest-lab-artifact-author/git-repo.png)

- To store your custom artifacts in the public [DevTest Labs artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), open a pull request against the repo.
- To add your private artifact repository to a lab, see [Add an artifact repository to your lab in DevTest Labs](add-artifact-repository.md).

## Next steps

- [Add artifacts to DevTest Labs VMs](add-artifact-vm.md)
- [Diagnose artifact failures in the lab](devtest-lab-troubleshoot-artifact-failure.md)
- [Troubleshoot issues when applying artifacts](devtest-lab-troubleshoot-apply-artifacts.md)
