---
title: Manage modules in Azure Automation
description: This article describes how to manage modules in Azure Automation.
services: automation
ms.service: automation
author: mgoedtel
ms.author: magoedte
ms.date: 01/31/2020
ms.topic: conceptual
manager: carmonm
---

# Manage modules in Azure Automation

You can import PowerShell modules into Azure Automation to make their cmdlets available in runbooks and their DSC resources available in DSC configurations. Behind the scenes, Azure Automation stores these modules. At runbook job and DSC compilation job execution time, Automation loads them into the Azure Automation sandboxes where runbooks execute and DSC configurations compile. Any DSC resources in modules are also automatically placed on the Automation DSC pull server. Machines can pull them when they apply DSC configurations.

Modules used in Azure Automation can be custom modules that you've created, modules from the PowerShell Gallery, or the AzureRM and Az modules for Azure. When you create an Automation account, some modules are imported by default.

## Default modules

The following table lists modules imported by default when an Automation account is created. Automation can import newer versions of these modules. However, you can't remove the original version from your Automation account even if you delete a newer version.

|Module name|Version|
|---|---|
| AuditPolicyDsc | 1.1.0.0 |
| Azure | 1.0.3 |
| Azure.Storage | 1.0.3 |
| AzureRM.Automation | 1.0.3 |
| AzureRM.Compute | 1.2.1 |
| AzureRM.Profile | 1.0.3 |
| AzureRM.Resources | 1.0.3 |
| AzureRM.Sql | 1.0.3 |
| AzureRM.Storage | 1.0.3 |
| ComputerManagementDsc | 5.0.0.0 |
| GPRegistryPolicyParser | 0.2 |
| Microsoft.PowerShell.Core | 0 |
| Microsoft.PowerShell.Diagnostics |  |
| Microsoft.PowerShell.Management |  |
| Microsoft.PowerShell.Security |  |
| Microsoft.PowerShell.Utility |  |
| Microsoft.WSMan.Management |  |
| Orchestrator.AssetManagement.Cmdlets | 1 |
| PSDscResources | 2.9.0.0 |
| SecurityPolicyDsc | 2.1.0.0 |
| StateConfigCompositeResources | 1 |
| xDSCDomainjoin | 1.1 |
| xPowerShellExecutionPolicy | 1.1.0.0 |
| xRemoteDesktopAdmin | 1.1.0.0 |

## Internal cmdlets

The table below lists cmdlets in the internal `Orchestrator.AssetManagement.Cmdlets` module that is imported into every Automation account. These cmdlets are accessible in your runbooks and DSC configurations and allow you to interact with assets within your Automation account. Additionally, the internal cmdlets allow you to retrieve secrets from encrypted variables, credentials, and encrypted connections. The Azure PowerShell cmdlets are not able to retrieve these secrets. These cmdlets do not require you to implicitly connect to Azure when using them, as when using a Run As Account to authenticate to Azure.

>[!NOTE]
>These internal cmdlets are available on a Windows Hybrid Runbook Worker, but not on a Linux Hybrid Runbook Worker. Use the corresponding [AzureRM.Automation](https://docs.microsoft.com/powershell/module/AzureRM.Automation/?view=azurermps-6.13.0) or [Az module](../az-modules.md) cmdlets for runbooks running directly on the computer or against resources in your environment. 

|Name|Description|
|---|---|
|Get-AutomationCertificate|`Get-AutomationCertificate [-Name] <string> [<CommonParameters>]`|
|Get-AutomationConnection|`Get-AutomationConnection [-Name] <string> [-DoNotDecrypt] [<CommonParameters>]` |
|Get-AutomationPSCredential|`Get-AutomationPSCredential [-Name] <string> [<CommonParameters>]` |
|Get-AutomationVariable|`Get-AutomationVariable [-Name] <string> [-DoNotDecrypt] [<CommonParameters>]`|
|Set-AutomationVariable|`Set-AutomationVariable [-Name] <string> -Value <Object> [<CommonParameters>]` |
|Start-AutomationRunbook|`Start-AutomationRunbook [-Name] <string> [-Parameters <IDictionary>] [-RunOn <string>] [-JobId <guid>] [<CommonParameters>]`|
|Wait-AutomationJob|`Wait-AutomationJob -Id <guid[]> [-TimeoutInMinutes <int>] [-DelayInSeconds <int>] [-OutputJobsTransitionedToRunning] [<CommonParameters>]`|

## Importing modules

There are multiple ways that you can import a module into your Automation account. The following sections show the different ways to import a module.

> [!NOTE]
> The maximum path size for a file in a module used in Azure Automation is 140 characters. Automation can't import a file with path size over 140 characters into the PowerShell session with `Import-Module`.

### Import modules in Azure portal

To import a module in the Azure portal:

1. Navigate to your Automation account.
2. Select **Modules** under **Shared Resources**.
3. Click **Add a module**. 
4. Select the **.zip** file that contains your module.
5. Click **OK** to start to import process.

### Import modules using PowerShell

You can use the [New-AzureRmAutomationModule](/powershell/module/azurerm.automation/new-azurermautomationmodule) cmdlet to import a module into your Automation account. The cmdlet takes a URL for a module .zip package.

```azurepowershell-interactive
New-AzureRmAutomationModule -Name <ModuleName> -ContentLinkUri <ModuleUri> -ResourceGroupName <ResourceGroupName> -AutomationAccountName <AutomationAccountName>
```

You can also use the same cmdlet to import a module from PowerShell Gallery directly. Make sure to grab `ModuleName` and `ModuleVersion` from [PowerShell Gallery](https://www.powershellgallery.com).

```azurepowershell-interactive
$moduleName = <ModuleName>
$moduleVersion = <ModuleVersion>
New-AzureRmAutomationModule -AutomationAccountName <AutomationAccountName> -ResourceGroupName <ResourceGroupName> -Name $moduleName -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
```
### Import modules from PowerShell Gallery

You can import [PowerShell Gallery](https://www.powershellgallery.com) modules either directly from the gallery or from your Automation account.

To import a module directly from the PowerShell Gallery:

1. Go to https://www.powershellgallery.com and search for the module to import.
2. Click **Deploy to Azure Automation** on the **Azure Automation** tab under **Installation Options**. This action opens up the Azure portal. 
3. On the Import page, select your Automation account and click **OK**.

![PowerShell Gallery import module](../media/modules/powershell-gallery.png)

To import a PowerShell Gallery module directly from your Automation account:

1. Select **Modules** under **Shared Resources**. 
2. On the Modules page, click **Browse gallery**, then search the gallery for a module. 
3. Select the module to import and click **Import**. 
4. On the Import page, click **OK** to start the import process.

![PowerShell Gallery import from Azure portal](../media/modules/gallery-azure-portal.png)

## Deleting modules

If you have issues with a module or you need to roll back to a previous version of a module, you can delete it from your Automation account. You can't delete the original versions of the [default modules](#default-modules) that are imported when you create an Automation account. If the module to delete is a newer version of one of the [default modules](#default-modules), it rolls back to the version that was installed with your Automation account. Otherwise, any module you delete from your Automation account is removed.

### Delete modules in Azure portal

To remove a module in the Azure portal:

1. Navigate to your Automation account and select **Modules** under **Shared Resources**. 
2. Select the module you want to remove. 
3. On the **Module** page, select **Delete**. If this module is one of the [default modules](#default-modules), it rolls back to the version that existed when the Automation account was created.

### Delete modules using PowerShell

To remove a module through PowerShell, run the following command:

```azurepowershell-interactive
Remove-AzureRmAutomationModule -Name <moduleName> -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName>
```
## Adding a connection type to your module

You can provide a custom [connection type](../automation-connections.md) to use in your Automation account by adding an optional metadata file to your module. This file specifies an Azure Automation connection type to be used with the module's cmdlets in your Automation account. To achieve this, you must first know how to author a PowerShell module. See [How to Write a PowerShell Script Module](/powershell/scripting/developer/module/how-to-write-a-powershell-script-module).

![Use a custom connection in the Azure portal](../media/modules/connection-create-new.png)

The file specifying connection type properties is named **&lt;ModuleName&gt;-Automation.json** and is found in the module folder of your compressed **.zip** file. This file contains the fields of a connection that are required to connect to the system or service the module represents. The configuration allows creation of a connection type in Azure Automation. Using this file you can set the field names, types, and whether the fields are encrypted or optional for the connection type of the module. The following example is a template in the **.json** file format that defines user name and password properties:

```json
{
   "ConnectionFields": [
   {
      "IsEncrypted":  false,
      "IsOptional":  true,
      "Name":  "Username",
      "TypeName":  "System.String"
   },
   {
      "IsEncrypted":  true,
      "IsOptional":  false,
      "Name":  "Password",
      "TypeName":  "System.String"
   }
   ],
   "ConnectionTypeName":  "MyModuleConnection",
   "IntegrationModuleName":  "MyModule"
}
```

## Best practices for authoring modules

We recommend that you follow the considerations in this section when you author a PowerShell module for use in Azure Automation.

### Version folder

Do NOT include a version folder within the **.zip** package for your module.  This issue is less of a concern for runbooks but does cause an issue with the State Configuration service. Azure Automation creates the version folder automatically when the module is distributed to nodes managed by DSC. If a version folder exists, you end up with two instances. Here is an example folder structure for a DSC module:

```powershell
myModule
  - DSCResources
    - myResourceFolder
      myResourceModule.psm1
      myResourceSchema.mof
  myModuleManifest.psd1
```

### Help information

Include a synopsis, description, and help URI for every cmdlet in your module. In PowerShell, you can define help information for cmdlets using the `Get-Help` cmdlet. The following example shows how to define a synopsis and help URI in a **.psm1** module file:

  ```powershell
  <#
       .SYNOPSIS
        Gets a Contoso User account
  #>
  function Get-ContosoUser {
  [CmdletBinding](DefaultParameterSetName='UseConnectionObject', `
  HelpUri='https://www.contoso.com/docs/information')]
  [OutputType([String])]
  param(
     [Parameter(ParameterSetName='UserAccount', Mandatory=true)]
     [ValidateNotNullOrEmpty()]
     [string]
     $UserName,

     [Parameter(ParameterSetName='UserAccount', Mandatory=true)]
     [ValidateNotNullOrEmpty()]
     [string]
     $Password,

     [Parameter(ParameterSetName='ConnectionObject', Mandatory=true)]
     [ValidateNotNullOrEmpty()]
     [Hashtable]
     $Connection
  )

  switch ($PSCmdlet.ParameterSetName) {
     "UserAccount" {
        $cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $UserName, $Password
        Connect-Contoso -Credential $cred
     }
     "ConnectionObject" {
        Connect-Contoso -Connection $Connection
    }
  }
  }
  ```

  Providing this information shows help text via the `Get-Help` cmdlet in the PowerShell console. This text is also displayed in the Azure portal.

  ![Integration Module Help](../media/modules/module-activity-description.png)

### Connection type

If the module connects to an external service, define a [connection type](#adding-a-connection-type-to-your-module). Each cmdlet in the module should accept a connection object (an instance of that connection type) as a parameter. Users map parameters of the connection asset to the cmdlet's corresponding parameters each time they call a cmdlet. Based on the runbook example above, it uses an example Contoso connection asset called `ContosoConnection` to access Contoso resources and return data from the external service.

  In the following example, the fields are mapped to the `UserName` and `Password` properties of a `PSCredential` object and then passed to the cmdlet.

  ```powershell
  $contosoConnection = Get-AutomationConnection -Name 'ContosoConnection'

  $cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $contosoConnection.UserName, $contosoConnection.Password
  Connect-Contoso -Credential $cred
  }
  ```

  An easier and better way to approach this behavior is directly passing the connection object to the cmdlet:

  ```powershell
  $contosoConnection = Get-AutomationConnection -Name 'ContosoConnection'

  Connect-Contoso -Connection $contosoConnection
  }
  ```

  You can enable similar behavior for your cmdlets by allowing them to accept a connection object directly as a parameter, instead of just connection fields for parameters. Usually you want a parameter set for each, so that a user not using Azure Automation can call your cmdlets without constructing a hashtable to act as the connection object. The parameter set `UserAccount`, is used to pass the connection field properties. `ConnectionObject` lets you pass the connection straight through.

### Output type

Define the output type for all cmdlets in your module. Defining an output type for a cmdlet allows design-time IntelliSense to help you determine the output properties of the cmdlet, for use during authoring. This practice is especially helpful during Automation runbook graphical authoring, for which design-time knowledge is key to an easy user experience with your module.

Add `[OutputType([<MyOutputType>])]` where `MyOutputType` is a valid type. To learn more about `OutputType`, see [About Functions OutputTypeAttribute](/powershell/module/microsoft.powershell.core/about/about_functions_outputtypeattribute). The following code is an example of adding `OutputType` to a cmdlet:

  ```powershell
  function Get-ContosoUser {
  [OutputType([String])]
  param(
     [string]
     $Parameter1
  )
  # <script location here>
  }
  ```

  ![Graphical Runbook Output Type](../media/modules/runbook-graphical-module-output-type.png)

  This behavior is similar to the "type ahead" functionality of a cmdlet's output in PowerShell ISE without having to run it.

  ![POSH IntelliSense](../media/modules/automation-posh-ise-intellisense.png)

### Cmdlet state

Make all cmdlets in your module stateless. Multiple runbook jobs can simultaneously run in the same `AppDomain` and the same process and sandbox. If there is any state shared on those levels, jobs can affect each other. This behavior can lead to intermittent and hard-to-diagnose issues. Here is an example of what NOT to do:

  ```powershell
  $globalNum = 0
  function Set-GlobalNum {
     param(
         [int] $num
     )

     $globalNum = $num
  }
  function Get-GlobalNumTimesTwo {
     $output = $globalNum * 2

     $output
  }
  ```

### Module dependency

Ensure that the module is fully contained in an xcopy-able package. Azure Automation modules are distributed to the Automation sandboxes when runbooks execute. The modules must work independently of the host that runs them. 

You should be able to zip up and move a module package and have it function as normal when imported into another host's PowerShell environment. For this to happen, ensure that the module doesn't depend on any files outside the module folder that is zipped up when the module is imported into Azure Automation. 

Your module should not depend on any unique registry settings on a host. An example is the settings made when a product is installed. 

Make sure that all files in the module have paths with fewer than 140 characters. Any paths over 140 characters cause issues with importing runbooks. If you don't follow this best practice, the module is not usable in Azure Automation.  

### References to AzureRM and Az

If referencing the [Azure PowerShell Az module](/powershell/azure/new-azureps-module-az?view=azps-1.1.0) in your module, ensure that you aren't also referencing AzureRM. You can't use the Az module in conjunction with the AzureRM module. Az is supported in runbooks but is not imported by default. To learn about the Az module and considerations to take into account, see [Az module support in Azure Automation](../az-modules.md).

## Next steps

* To learn more about creating PowerShell modules, see [Writing a Windows PowerShell Module](/powershell/scripting/developer/windows-powershell).
