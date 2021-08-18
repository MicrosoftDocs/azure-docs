---
title: ARM template test toolkit
description: Describes how to run the Azure Resource Manager template (ARM template) test toolkit on your template. The toolkit lets you see if you have implemented recommended practices.
ms.topic: conceptual
ms.date: 07/16/2021
ms.author: tomfitz
author: tfitzmac
---

# Use ARM template test toolkit

The [Azure Resource Manager template (ARM template) test toolkit](https://aka.ms/arm-ttk) checks whether your template uses recommended practices. When your template isn't compliant with recommended practices, it returns a list of warnings with the suggested changes. By using the test toolkit, you can learn how to avoid common problems in template development. This article describes how to run the test toolkit and how to add or remove tests. For more information about how to run tests or how to run a specific test, see [Test parameters](#test-parameters).

The toolkit is a set of PowerShell scripts that can be run from a command in PowerShell or CLI. These tests are recommendations but not requirements. You can decide which tests are relevant to your goals and customize which tests are run.

The toolkit contains four sets of tests:

- [Test cases for ARM templates](template-test-cases.md)
- [Test cases for parameter files](parameter-file-test-cases.md)
- [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md)
- [Test cases for all files](all-files-test-cases.md)

## Install on Windows

1. If you don't already have PowerShell, [install PowerShell on Windows](/powershell/scripting/install/installing-powershell-core-on-windows).

1. [Download the latest .zip file](https://aka.ms/arm-ttk-latest) for the test toolkit and extract it.

1. Start PowerShell.

1. Navigate to the folder where you extracted the test toolkit. Within that folder, navigate to _arm-ttk_ folder.

1. If your [execution policy](/powershell/module/microsoft.powershell.core/about/about_execution_policies) blocks scripts from the Internet, you need to unblock the script files. Make sure you're in the _arm-ttk_ folder.

   ```powershell
   Get-ChildItem *.ps1, *.psd1, *.ps1xml, *.psm1 -Recurse | Unblock-File
   ```

1. Import the module.

   ```powershell
   Import-Module .\arm-ttk.psd1
   ```

1. To run the tests, use the following command:

   ```powershell
   Test-AzTemplate -TemplatePath \path\to\template
   ```

## Install on Linux

1. If you don't already have PowerShell, [install PowerShell on Linux](/powershell/scripting/install/installing-powershell-core-on-linux).

1. [Download the latest .zip file](https://aka.ms/arm-ttk-latest) for the test toolkit and extract it.

1. Start PowerShell.

   ```bash
   pwsh
   ```

1. Navigate to the folder where you extracted the test toolkit. Within that folder, navigate to _arm-ttk_ folder.

1. If your [execution policy](/powershell/module/microsoft.powershell.core/about/about_execution_policies) blocks scripts from the Internet, you need to unblock the script files. Make sure you're in the _arm-ttk_ folder.

   ```powershell
   Get-ChildItem *.ps1, *.psd1, *.ps1xml, *.psm1 -Recurse | Unblock-File
   ```

1. Import the module.

   ```powershell
   Import-Module ./arm-ttk.psd1
   ```

1. To run the tests, use the following command:

   ```powershell
   Test-AzTemplate -TemplatePath /path/to/template
   ```

## Install on macOS

1. If you don't already have PowerShell, [install PowerShell on macOS](/powershell/scripting/install/installing-powershell-core-on-macos).

1. Install `coreutils`:

   ```bash
   brew install coreutils
   ```

1. [Download the latest .zip file](https://aka.ms/arm-ttk-latest) for the test toolkit and extract it.

1. Start PowerShell.

   ```bash
   pwsh
   ```

1. Navigate to the folder where you extracted the test toolkit. Within that folder, navigate to _arm-ttk_ folder.

1. If your [execution policy](/powershell/module/microsoft.powershell.core/about/about_execution_policies) blocks scripts from the Internet, you need to unblock the script files. Make sure you're in the _arm-ttk_ folder.

   ```powershell
   Get-ChildItem *.ps1, *.psd1, *.ps1xml, *.psm1 -Recurse | Unblock-File
   ```

1. Import the module.

   ```powershell
   Import-Module ./arm-ttk.psd1
   ```

1. To run the tests, use the following command:

   ```powershell
   Test-AzTemplate -TemplatePath /path/to/template
   ```

## Result format

Tests that pass are displayed in **green** and prefaced with `[+]`.

Tests that fail are displayed in **red** and prefaced with `[-]`.

Tests with a warning are displayed in **yellow** and prefaced with `[?]`.

:::image type="content" source="./media/template-test-toolkit/view-results.png" alt-text="view test results.":::

The text results are:

```powershell
deploymentTemplate
[+] adminUsername Should Not Be A Literal (6 ms)
[+] apiVersions Should Be Recent In Reference Functions (9 ms)
[-] apiVersions Should Be Recent (6 ms)
    Api versions must be the latest or under 2 years old (730 days) - API version 2019-06-01 of
    Microsoft.Storage/storageAccounts is 760 days old
    Valid Api Versions:
    2021-04-01
    2021-02-01
    2021-01-01
    2020-08-01-preview

[+] artifacts parameter (4 ms)
[+] CommandToExecute Must Use ProtectedSettings For Secrets (9 ms)
[+] DependsOn Best Practices (5 ms)
[+] Deployment Resources Must Not Be Debug (6 ms)
[+] DeploymentTemplate Must Not Contain Hardcoded Uri (4 ms)
[?] DeploymentTemplate Schema Is Correct (6 ms)
    Template is using schema version '2015-01-01' which has been deprecated and is no longer
    maintained.
```

## Test parameters

When you provide the `-TemplatePath` parameter, the toolkit looks in that folder for a template named _azuredeploy.json_ or _maintemplate.json_. It tests this template first and then tests all other templates in the folder and its subfolders. The other templates are tested as linked templates. If your path includes a file named [createUiDefinition.json](../managed-applications/create-uidefinition-overview.md), it runs tests that are relevant to UI definition. Tests are also run for parameter files and all JSON files in the folder.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder
```

To test one file in that folder, add the `-File` parameter. However, the folder must still have a main template named _azuredeploy.json_ or _maintemplate.json_.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder -File cdn.json
```

By default, all tests are run. To specify individual tests to run, use the `-Test` parameter and provide the test name. For the test names, see [ARM templates](template-test-cases.md), [parameter files](parameter-file-test-cases.md), [createUiDefinition.json](createUiDefinition-test-cases.md), and [all files](all-files-test-cases.md).

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder -Test "Resources Should Have Location"
```

## Customize tests

You can customize the default tests or create your own tests. If you want to permanently remove a test, delete the _.test.ps1_ file from the folder.

The toolkit has four folders that contain the default tests that are run for specific file types:

- ARM templates: _\arm-ttk\testcases\deploymentTemplate_
- Parameter files: _\arm-ttk\testcases\deploymentParameters_
- [createUiDefinition.json](../managed-applications/create-uidefinition-overview.md): _\arm-ttk\testcases\CreateUIDefinition_
- All files: _\arm-ttk\testcases\AllFiles_

### Add a custom test

To add your own test, create a file with the naming convention: _Your-Custom-Test-Name.test.ps1_.

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

- `$schema`
- `contentVersion`
- `parameters`
- `variables`
- `resources`
- `outputs`

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

- [Run ARM TTK Tests](https://marketplace.visualstudio.com/items?itemName=Sam-Cogan.ARMTTKExtension)
- [ARM Template Tester](https://marketplace.visualstudio.com/items?itemName=maikvandergaag.maikvandergaag-arm-ttk)

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

- To learn about the template tests, see [Test cases for ARM templates](template-test-cases.md).
- To test parameter files, see [Test cases for parameter files](parameters.md).
- For createUiDefinition tests, see [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md).
- To learn about tests for all files, see [Test cases for all files](all-files-test-cases.md).
- For a Microsoft Learn module that covers using the test toolkit, see [Validate Azure resources by using the ARM Template Test Toolkit](/learn/modules/arm-template-test/).
