---
title: ARM template test toolkit
description: Describes how to run the ARM template test toolkit on your template. The toolkit lets you see if you have implemented recommended practices.
ms.topic: conceptual
ms.date: 06/11/2020
ms.author: tomfitz
author: tfitzmac
---

# Use ARM template test toolkit

The [ARM template test toolkit](https://aka.ms/arm-ttk) checks whether your template uses recommended practices. When your template isn't compliant with recommended practices, it returns a list of warnings with the suggested changes. By using the test toolkit, you can learn how to avoid common problems in template development.

The test toolkit provides a [set of default tests](test-cases.md). These tests are recommendations but not requirements. You can decide which tests are relevant to your goals and customize which tests are run.

This article describes how to run the test toolkit and how to add or remove tests. For descriptions of the default tests, see [toolkit test cases](test-cases.md).

The toolkit is a set of PowerShell scripts that can be run from a command in PowerShell or CLI.

## Download test toolkit

To use the test toolkit, you can either fork the [repository](https://aka.ms/arm-ttk) containing the scripts or [download the latest .zip file](https://aka.ms/arm-ttk-latest).

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

To run the tests on **Linux**, use the following command:

```bash
Test-AzTemplate.sh -TemplatePath $TemplateFolder
```

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

When you provide the **-TemplatePath** parameter, the toolkit tests all templates in the folder and its subfolders.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder
```

To test one file in that folder, add the **-File** parameter.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder -File cdn.json
```

By default, all tests are run. To specify individual tests to run, use the **-Test** parameter. Provide the name of the test.

```powershell
Test-AzTemplate -TemplatePath $TemplateFolder -Test "Resources Should Have Location"
```

The following sections of this article provide a description of each test including its name.

## Customize tests

The toolkit runs all of the tests in the folder **\arm-ttk\testcases\deploymentTemplate**. If you want to permanently remove a test, delete that file from the folder.

To add your own test, create a file with the naming convention: **Your-Custom-Test-Name.test.ps1**.

The file needs to have the following format:

```powershell
param(
    [Parameter(Mandatory=$true,Position=0)]
    [PSObject]
    $TemplateObject
)

# Implement test logic
# Output error with: Write-Error -Message
```

To learn more about implementing the test, look at the other tests in that folder.

## Next steps

* To learn about the default tests, see [Test cases for toolkit](test-cases.md).

* You can add the test toolkit to your Azure Pipeline through third-party extensions. For more information, see [Run ARM TTK Tests](https://marketplace.visualstudio.com/items?itemName=Sam-Cogan.ARMTTKExtension) or [ARM Template Tester](https://marketplace.visualstudio.com/items?itemName=maikvandergaag.maikvandergaag-arm-ttk)
