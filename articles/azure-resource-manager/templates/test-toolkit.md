---
title: ARM template test toolkit
description: Describes how to run the Azure Resource Manager template (ARM template) test toolkit on your template. The toolkit lets you see if you have implemented recommended practices.
ms.topic: conceptual
ms.custom: devx-track-arm-template
ms.date: 03/20/2024
---

# Use ARM template test toolkit

The [Azure Resource Manager template (ARM template) test toolkit](https://aka.ms/arm-ttk) checks whether your template uses recommended practices. When your template isn't compliant with recommended practices, it returns a list of warnings with the suggested changes. By using the test toolkit, you can learn how to avoid common problems in template development. This article describes how to run the test toolkit and how to add or remove tests. For more information about how to run tests or how to run a specific test, see [Test parameters](#test-parameters).

The toolkit is a set of PowerShell scripts that can be run from a command in PowerShell or CLI. These tests are recommendations but not requirements. You can decide which tests are relevant to your goals and customize which tests are run.

The toolkit contains four sets of tests:

- [Test cases for ARM templates](template-test-cases.md)
- [Test cases for parameter files](parameter-file-test-cases.md)
- [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md)
- [Test cases for all files](all-files-test-cases.md)

> [!NOTE]
> The test toolkit is only available for ARM templates. To validate Bicep files, use the [Bicep linter](../bicep/linter.md).

### Training resources

To learn more about the ARM template test toolkit, and for hands-on guidance, see [Validate Azure resources by using the ARM Template Test Toolkit](/training/modules/arm-template-test).

## Install on Windows

1. If you don't already have PowerShell, [install PowerShell on Windows](/powershell/scripting/install/installing-powershell-core-on-windows).

1. [Download the latest .zip file](https://github.com/Azure/arm-ttk/releases) for the test toolkit and extract it.

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

1. [Download the latest .zip file](https://github.com/Azure/arm-ttk/releases) for the test toolkit and extract it.

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

1. [Download the latest .zip file](https://github.com/Azure/arm-ttk/releases) for the test toolkit and extract it.

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

:::image type="content" source="./media/template-test-toolkit/view-results.png" alt-text="Screenshot of test results in different colors for pass, fail, and warning.":::

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

## Validate templates for Azure Marketplace

To publish an offering to Azure Marketplace, use the test toolkit to validate the templates. When your templates pass the validation tests, Azure Marketplace will approve your offering more quickly. If they fail the tests, the offering will fail certification.

> [!IMPORTANT]
> The Marketplace tests were added in July 2022. Update your module if you have an earlier version.

### Run the tests in your environment

After installing the toolkit and importing the module, run the following cmdlet to test your package:

```powershell
Test-AzMarketplacePackage -TemplatePath "Path to the unzipped package folder"
```

### Interpret the results

 The tests return results in two sections. The first section includes the tests that are **mandatory**. The results of these tests are displayed in the summary section.

> [!IMPORTANT]
> You must fix any results in red before the Marketplace offer is accepted. We recommend fixing any results that return in yellow.

The text results are:

```powershell
Validating nestedtemplates\AzDashboard.json
    [+] adminUsername Should Not Be A Literal (210 ms)
    [+] artifacts parameter (3 ms)
    [+] CommandToExecute Must Use ProtectedSettings For Secrets (201 ms)
    [+] Deployment Resources Must Not Be Debug (160 ms)
    [+] DeploymentTemplate Must Not Contain Hardcoded Url (13 ms)
    [+] Location Should Not Be Hardcoded (31 ms)
    [+] Min and Max Value Are Numbers (4 ms)
    [+] Outputs Must Not Contain Secrets (9 ms)
    [+] Password params must be secure (3 ms)
    [+] Resources Should Have Location (2 ms)
    [+] Resources Should Not Be Ambiguous (2 ms)
    [+] Secure Params In Nested Deployments (205 ms)
    [+] Secure String Parameters Cannot Have Default (3 ms)
    [+] URIs Should Be Properly Constructed (190 ms)
    [+] Variables Must Be Referenced (9 ms)
    [+] Virtual Machines Should Not Be Preview (173 ms)
    [+] VM Size Should Be A Parameter (165 ms)
Pass : 99
Fail : 3
Total: 102
Validating StartStopV2mkpl_1.0.09302021\anothertemplate.json
    [?] Parameters Must Be Referenced (86 ms)
        Unreferenced parameter: resourceGroupName
        Unreferenced parameter: location
        Unreferenced parameter: azureFunctionAppName
        Unreferenced parameter: applicationInsightsName
        Unreferenced parameter: applicationInsightsRegion
```

The section below the summary section includes test failures that can be interpreted as warnings. Fixing the failures is optional but highly recommended. The failures often point to common issues that cause failures when a customer installs your offer.

To fix your tests, follow the test case applicable to you:

* [ARM template test case](template-test-cases.md)
* [All files test case](all-files-test-cases.md)
* [CreateUiDefinition test case](createuidefinition-test-cases.md)

### Submit the offer

After making any necessary fixes, rerun the test toolkit. Before submitting your offer to Azure Marketplace, make sure you have zero failures.

## Integrate with Azure Pipelines

You can add the test toolkit to your Azure Pipeline. With a pipeline, you can run the test every time the template is updated, or run it as part of your deployment process.

The easiest way to add the test toolkit to your pipeline is with third-party extensions. The following two extensions are available:

- [Run ARM template TTK Tests](https://marketplace.visualstudio.com/items?itemName=Sam-Cogan.ARMTTKExtensionXPlatform)
- [ARM Template Tester](https://marketplace.visualstudio.com/items?itemName=maikvandergaag.maikvandergaag-arm-ttk)

Or, you can implement your own tasks. The following example shows how to download the test toolkit.

For Release Pipeline:
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
For Pipeline YAML definition:
```yaml
- pwsh: |
   New-Item '$(ttk.folder)' -ItemType Directory
   Invoke-WebRequest -uri '$(ttk.uri)' -OutFile "$(ttk.folder)/$(ttk.asset.filename)" -Verbose
   Get-ChildItem '$(ttk.folder)' -Recurse
   
   Write-Host "Expanding files..."
   Expand-Archive -Path '$(ttk.folder)/*.zip' -DestinationPath '$(ttk.folder)' -Verbose
   
   Write-Host "Expanded files found:"
   Get-ChildItem '$(ttk.folder)' -Recurse
  displayName: 'Download TTK'
```

The next example shows how to run the tests.

For Release Pipeline:
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
For Pipeline YAML definition:
```yaml
- pwsh: |
   Import-Module $(ttk.folder)/arm-ttk/arm-ttk.psd1 -Verbose
   $testOutput = @(Test-AzTemplate -TemplatePath "$(sample.folder)")
   $testOutput
   
   if ($testOutput | ? {$_.Errors }) {
      exit 1 
   } else {
       Write-Host "##vso[task.setvariable variable=result.best.practice]$true"
       exit 0
   } 
  errorActionPreference: continue
  failOnStderr: true
  displayName: 'Run Best Practices Tests'
  continueOnError: true
```

## Next steps

- To learn about the template tests, see [Test cases for ARM templates](template-test-cases.md).
- To test parameter files, see [Test cases for parameter files](parameters.md).
- For createUiDefinition tests, see [Test cases for createUiDefinition.json](createUiDefinition-test-cases.md).
- To learn about tests for all files, see [Test cases for all files](all-files-test-cases.md).
- For a Learn module that covers using the test toolkit, see [Validate Azure resources by using the ARM Template Test Toolkit](/training/modules/arm-template-test/).
