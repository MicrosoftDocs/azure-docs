---
title: ARM template test toolkit
description: Describes how to run the ARM template test toolkit on your template. The toolkit lets you see if you have implemented recommended practices.
ms.topic: conceptual
ms.date: 06/19/2020
ms.author: tomfitz
author: tfitzmac
---

# Use ARM template test toolkit

The [ARM template test toolkit](https://aka.ms/arm-ttk) checks whether your template uses recommended practices. When your template isn't compliant with recommended practices, it returns a list of warnings with the suggested changes. By using the test toolkit, you can learn how to avoid common problems in template development.

The test toolkit provides a [set of default tests](test-cases.md). These tests are recommendations but not requirements. You can decide which tests are relevant to your goals and customize which tests are run.

This article describes how to run the test toolkit and how to add or remove tests. For descriptions of the default tests, see [toolkit test cases](test-cases.md).

The toolkit is a set of PowerShell scripts that can be run from a command in PowerShell or CLI.

## Download test toolkit

To use the test toolkit, you can either fork and clone the [repository](https://aka.ms/arm-ttk) containing the scripts or [download the latest .zip file](https://aka.ms/arm-ttk-latest).

Depending on the execution policy of the computer where you run the script, you may get an error about running scripts from the Internet. You have to either change the [execution policy](/powershell/module/microsoft.powershell.core/about/about_execution_policies) or [unblock the script files](/powershell/module/microsoft.powershell.utility/unblock-file).

## Run on PowerShell

Before running the tests, import the module.

```powershell
Import-Module .\arm-ttk.psd1 # from the same directory as .\arm-ttk.psd1
```

To run the tests in **PowerShell**, use the following command:

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder
```

## Run on Linux

Before running the tests, install [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-linux).

To run the tests on **Linux** in Bash, use the following command:

```bash
Test-AzTemplate.sh -TemplatePath $TemplateFolder
```

You can also run the test on pwsh.exe.

## Run on macOS

Before running the tests, install [PowerShell Core](/powershell/scripting/install/installing-powershell-core-on-macos). 

Install `coreutils`:

```bash
brew install coreutils
```

To run the tests on **macOS**, use the following command:

```bash
Test-AzTemplate.sh -TemplatePath $TemplateFolder
```

## Result format

Tests that pass are displayed in **green** and prefaced with **[+]**.

Tests that fail are displayed in **red** and prefaced with **[-]**.

:::image type="content" source="./media/template-test-toolkit/view-results.png" alt-text="view test results":::

The text results are:

```powershell
[+] adminUsername Should Not Be A Literal (24 ms)
[+] apiVersions Should Be Recent (18 ms)
[+] artifacts parameter (16 ms)
[+] DeploymentTemplate Schema Is Correct (17 ms)
[+] IDs Should Be Derived From ResourceIDs (15 ms)
[-] Location Should Not Be Hardcoded (41 ms)
     azuredeploy.json must use the location parameter, not resourceGroup().location (except when used as a default value in the main template)
```

## Test parameters

When you provide the **-TemplatePath** parameter, the toolkit looks in that folder for a template named azuredeploy.json or maintemplate.json. It tests this template first and then tests all other templates in the folder and its subfolders. The other templates are tested as linked templates. If your path includes a file named [CreateUiDefinition.json](../managed-applications/create-uidefinition-overview.md), it runs tests that are relevant to UI definition.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder
```

To test one file in that folder, add the **-File** parameter. However, the folder must still have a main template named azuredeploy.json or maintemplate.json.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder -File cdn.json
```

By default, all tests are run. To specify individual tests to run, use the **-Test** parameter. Provide the name of the test. For the names, see [Test cases for toolkit](test-cases.md).

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder -Test "Resources Should Have Location"
```

## Customize tests

For ARM templates, the toolkit runs all of the tests in the folder **\arm-ttk\testcases\deploymentTemplate**. If you want to permanently remove a test, delete that file from the folder.

For [CreateUiDefinition](../managed-applications/create-uidefinition-overview.md) files, it runs all of the tests in the folder **\arm-ttk\testcases\CreateUiDefinition**.

To add your own test, create a file with the naming convention: **Your-Custom-Test-Name.test.ps1**.

The test can get the template as an object parameter or a string parameter. Typically, you use one or the other, but you can use both.

Use the object parameter when you need to get a section of the template and iterate through its properties. A test that uses the object parameter has the following format:

```powershell
param(
    [Parameter(Mandatory=$true,Position=0)]
    [PSObject]
    $TemplateObject
)

# Implement test logic that evaluates parts of the template.
# Output error with: Write-Error -Message
```

The template object has the following properties:

* $schema
* contentVersion
* parameters
* variables
* resources
* outputs

For example, you can get the collection of parameters with `$TemplateObject.parameters`.

Use the string parameter when you need to do a string operation on the whole template. A test that uses the string parameter has the following format:

```powershell
param(
    [Parameter(Mandatory)]
    [string]
    $TemplateText
)

# Implement test logic that performs string operations.
# Output error with: Write-Error -Message
```

For example, you can run a regular expression of the string parameter to see if a specific syntax is used.

To learn more about implementing the test, look at the other tests in that folder.

## Integrate with Azure Pipelines

You can add the test toolkit to your Azure Pipeline. With a pipeline, you can run the test every time the template is updated, or run it as part of your deployment process.

The easiest way to add the test toolkit to your pipeline is with third-party extensions. The following two extensions are available:

* [Run ARM TTK Tests](https://marketplace.visualstudio.com/items?itemName=Sam-Cogan.ARMTTKExtension)
* [ARM Template Tester](https://marketplace.visualstudio.com/items?itemName=maikvandergaag.maikvandergaag-arm-ttk)

Or, you can implement your own tasks. The following example shows how to download the test toolkit.

```json
{
    "environment": {},
    "enabled": true,
    "continueOnError": false,
    "alwaysRun": false,
    "displayName": "Download TTK",
    "timeoutInMinutes": 0,
    "condition": "succeeded()",
    "task": {
        "id": "e213ff0f-5d5c-4791-802d-52ea3e7be1f1",
        "versionSpec": "2.*",
        "definitionType": "task"
    },
    "inputs": {
        "targetType": "inline",
        "filePath": "",
        "arguments": "",
        "script": "New-Item '$(ttk.folder)' -ItemType Directory\nInvoke-WebRequest -uri '$(ttk.uri)' -OutFile \"$(ttk.folder)/$(ttk.asset.filename)\" -Verbose\nGet-ChildItem '$(ttk.folder)' -Recurse\n\nWrite-Host \"Expanding files...\"\nExpand-Archive -Path '$(ttk.folder)/*.zip' -DestinationPath '$(ttk.folder)' -Verbose\n\nWrite-Host \"Expanded files found:\"\nGet-ChildItem '$(ttk.folder)' -Recurse",
        "errorActionPreference": "stop",
        "failOnStderr": "false",
        "ignoreLASTEXITCODE": "false",
        "pwsh": "true",
        "workingDirectory": ""
    }
}
```

The next example shows how to run the tests.

```json
{
    "environment": {},
    "enabled": true,
    "continueOnError": true,
    "alwaysRun": false,
    "displayName": "Run Best Practices Tests",
    "timeoutInMinutes": 0,
    "condition": "succeeded()",
    "task": {
        "id": "e213ff0f-5d5c-4791-802d-52ea3e7be1f1",
        "versionSpec": "2.*",
        "definitionType": "task"
    },
    "inputs": {
        "targetType": "inline",
        "filePath": "",
        "arguments": "",
        "script": "Import-Module $(ttk.folder)/arm-ttk/arm-ttk.psd1 -Verbose\n$testOutput = @(Test-AzTemplate -TemplatePath \"$(sample.folder)\")\n$testOutput\n\nif ($testOutput | ? {$_.Errors }) {\n   exit 1 \n} else {\n    Write-Host \"##vso[task.setvariable variable=result.best.practice]$true\"\n    exit 0\n} \n",
        "errorActionPreference": "continue",
        "failOnStderr": "true",
        "ignoreLASTEXITCODE": "false",
        "pwsh": "true",
        "workingDirectory": ""
    }
}
```

## Next steps

To learn about the default tests, see [Test cases for toolkit](test-cases.md).
