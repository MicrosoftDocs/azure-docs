---
title: Create custom artifacts for VMs
description: Learn how to create and use artifacts to deploy and set up applications on DevTest Labs virtual machines (VMs).
ms.topic: how-to
ms.author: rosemalcolm
author: RoseHJM
ms.date: 12/08/2025
ms.custom: UpdateFrequency2
#customer intent: As an Azure DevTest Labs user, I want to learn how to create and store artifact definition files so I can use them to install tools or take other actions on my lab VMs.
---

# Create custom artifacts for DevTest Labs VMs

Artifacts are tools, actions, or software you can add to Azure DevTest Labs VMs. For example, artifacts can run scripts, install tools, or take actions like joining a domain. DevTest Labs users can [add artifacts to their VMs](add-artifact-vm.md), and lab administrators can [specify mandatory artifacts to be added to all lab VMs](devtest-lab-mandatory-artifacts.md).

This article describes how to create artifacts that provision lab VMs. An artifact consists of an artifact definition JSON file and other script files stored in a Git repository folder. You can store artifacts in a private or public Git repository. Lab administrators can [add artifact repositories to labs](add-artifact-repository.md) so all lab users can access them.

## Prerequisites

- To create and work with artifact definition files, you need a JSON editor. [Visual Studio Code](https://code.visualstudio.com/) is available for Windows, Linux, and macOS.
- To store the artifact definition and script files, you need a GitHub account.

## Understand artifact definition files

An artifact definition file consists of a JSON expression that specifies the action to take on a VM. The file defines an artifact name, a command to run, and parameters available for the command. If the artifact contains other script files, you can refer to the files by name in the artifact definition file.

The following example shows the basic structure of an *artifactfile.json* artifact definition file.

```json
  {
    "$schema": "https://raw.githubusercontent.com/Azure/azure-devtestlab/master/schemas/2016-11-28/dtlArtifacts.json",
    "title": "<title>",
    "description": "<description>",
    "iconUri": "",
    "targetOsType": "<os>",
    "parameters": {
      "<paramName>": {
        "type": "<type>",
        "displayName": "<display name>",
        "description": "<description>"
      }
    },
    "runCommand": {
      "commandToExecute": "<command>"
    }
  }
```

The definition has the following required and optional elements:

| Element name | Description |
| --- | --- |
| `$schema` | Location of the JSON schema file, which can help you test the validity of the definition file.|
| `title` | **Required** artifact name to display. |
| `description` | **Required** artifact description. |
| `iconUri` | Artifact icon URI to display.|
| `targetOsType` | **Required** operating system to install on. The supported values are `Windows` or `Linux`. |
| `parameters` | Available artifact customizations during installation.|
| `runCommand` | **Required** command to install the artifact on the VM. |

### Artifact parameters

The `parameters` section of the definition file defines the options and values users can specify when they install the artifact. You can refer to these parameters in the `runCommand`.

The following structure defines a parameter:

```json
  "parameters": {
    "<name>": {
      "type": "<type>",
      "displayName": "<display name>",
      "description": "<description>"
    }
  }
```

Each parameter requires a name, and the parameter definition requires the following elements:

| Element name | Description |
| --- | --- |
| `type` | **Required** parameter value type. The type can be any valid JSON `string`, integer `int`, boolean `bool`, or `array`. |
| `displayName` | **Required** parameter name to display to the user. |
| `description` | **Required** parameter description.|

### Secure string parameters

To include secrets in an artifact definition, declare the secrets as secure strings by using the `secureStringParam` syntax in the `parameters` section of the definition file. The `description` element allows any text string, including spaces, and presents the string in the UI as masked characters.


```json

    "securestringParam": {
      "type": "securestring",
      "displayName": "Secure String Parameter",
      "description": "<any text string>",
      "allowEmpty": false
    },
```

The following `runCommand` uses a PowerShell script that takes the secure string created by using the `ConvertTo-SecureString` command. The script captures output for debugging, so for security don't log the output to the console.

```json
  "runCommand": {
    "commandToExecute": "[concat('powershell.exe -ExecutionPolicy bypass \"& ./artifact.ps1 -StringParam ''', parameters('stringParam'), ''' -SecureStringParam (ConvertTo-SecureString ''', parameters('securestringParam'), ''' -AsPlainText -Force) -IntParam ', parameters('intParam'), ' -BoolParam:$', parameters('boolParam'), ' -FileContentsParam ''', parameters('fileContentsParam'), ''' -ExtraLogLines ', parameters('extraLogLines'), ' -ForceFail:$', parameters('forceFail'), '\"')]"
  }
```

### Artifact expressions and functions

You can use expressions and functions to construct the artifact install command. Expressions evaluate when the artifact installs.

Expressions can appear anywhere in a JSON string value, and always return another JSON value. Enclose expressions with brackets, `[ ]`. If you need to use a literal string that starts with a bracket, use two brackets `[[`.

You usually use expressions with functions to construct a value. Function calls are formatted as `functionName(arg1, arg2, arg3)`.

Common functions include:

| Function | Description |
| --- | --- |
|`parameters(parameterName)`|Returns a parameter value to use when the artifact command runs.|
|`concat(arg1, arg2, arg3, ...)`|Combines multiple string values and can take various arguments.|

The following example uses expressions with the `concat` function to construct a value.

```json
  runCommand": {
      "commandToExecute": "[concat('powershell.exe -ExecutionPolicy bypass \"& ./startChocolatey.ps1'
  , ' -RawPackagesList ', parameters('packages')
  , ' -Username ', parameters('installUsername')
  , ' -Password ', parameters('installPassword'))]"
  }
```

## Create a custom artifact

You can create a custom artifact by starting from a sample *artifactfile.json* definition file. The public [DevTest Labs artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts) has a library of artifacts. You can download an artifact definition file and customize it to create your own artifacts.

1. Download the *artifactfile.json* definition file and *artifact.ps1* PowerShell script from [https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts/windows-test-paramtypes).

1. Edit the artifact definition file to make some valid changes to elements and values. In Visual Studio Code, you can use IntelliSense to see valid elements and value options. For example, when you edit the `targetOsType` element, IntelliSense shows you `Windows` or `Linux` options.

1. Store your artifact in a public or private Git artifact repository.

   - Store each *artifactfile.json* artifact definition file in a separate directory named the same as the artifact name.
   - Store the scripts that the install command references in the same directory as the artifact definition file.

   The following screenshot shows an example artifact folder:

   ![Screenshot that shows an example artifact folder.](./media/devtest-lab-artifact-author/git-repo.png)

   >[!NOTE]
   >To add your custom artifacts to the public [DevTest Labs artifact repository](https://github.com/Azure/azure-devtestlab/tree/master/Artifacts), open a pull request against the repo.

## Next steps

- [Add artifacts to DevTest Labs VMs](add-artifact-vm.md)
- [Specify mandatory artifacts to be added to all lab VMs](devtest-lab-mandatory-artifacts.md)
- [Add an artifact repository to a lab](add-artifact-repository.md)

## Related content

- [Diagnose artifact failures in the lab](devtest-lab-troubleshoot-artifact-failure.md)
- [Troubleshoot issues when applying artifacts](devtest-lab-troubleshoot-apply-artifacts.md)
