---
title: Manage Modules in Azure Automation
description: This article describes how to manage modules in Azure Automation
services: automation
ms.service: automation
author: bobbytreed
ms.author: robreed
ms.date: 06/05/2019
ms.topic: conceptual
manager: carmonm
---

# Manage Modules in Azure Automation

Azure Automation provides the ability to import PowerShell modules into your Automation Account to be used by the PowerShell based runbooks. These modules can be custom modules you've created, from the PowerShell Gallery, or the AzureRM and Az modules for Azure. When you create an Automation Account some modules are imported by default.

## Import modules

There are multiple ways that you can import a module into your Automation Account. The following sections show the different ways to import a module.

> [!NOTE]
> The max path of a file in a module to be used in Azure Automation is 140 characters. Any path over 140 characters will not be able to be imported into the PowerShell session with `Import-Module`.

### PowerShell

You can use the [New-AzureRmAutomationModule](/powershell/module/azurerm.automation/new-azurermautomationmodule) to import a module into your Automation Account. The cmdlet takes a url to a module zip package.

```azurepowershell-interactive
New-AzureRmAutomationModule -Name <ModuleName> -ContentLinkUri <ModuleUri> -ResourceGroupName <ResourceGroupName> -AutomationAccountName <AutomationAccountName>
```

### Azure portal

In the Azure portal, navigate to your Automation Account and select **Modules** under **Shared Resources**. Click **+ Add a module**. Select a **.zip** file that contains your module and click **Ok** to start to import process.

### PowerShell Gallery

Modules from the PowerShell gallery can either be imported from the [PowerShell Gallery](https://www.powershellgallery.com) directly or from your Automation Account.

To import a module from the PowerShell Gallery, go to https://www.powershellgallery.com and search for the module you want to import. Click **Deploy to Azure Automation** on the **Azure Automation** tab under **Installation Options**. This action opens up the Azure portal. On the **Import** page, select your Automation Account and click **OK**.

![PowerShell Gallery import module](../media/modules/powershell-gallery.png)

You can also import modules from the PowerShell Gallery directly from your Automation Account. In your Automation Account, select **Modules** under **Shared Resources**. On the modules page, click **Browse gallery**. This opens up the **Browse Gallery** page. You can use this page to search the PowerShell Gallery for a module. Select the module you want to import and click **Import**. On the **Import** page, click **OK** to start the import process.

![PowerShell Gallery import from Azure portal](../media/modules/gallery-azure-portal.png)

## Delete modules

If you have issues with a module or you need to roll back to a previous version of a module, you can delete it from your Automation Account. You can not delete the original version of the [default modules](#default-modules) that are imported when you create an Automation Account. If the module you want to delete is a newer version of one of the [default modules](#default-modules) installed, it will roll-back to the version that was installed with your Automation Account. Otherwise, any module you delete from your Automation Account will be removed.

### Azure portal

In the Azure portal, navigate to your Automation Account and select **Modules** under **Shared Resources**. Select the module you want to remove. On the **Module** page, clcick **Delete**. If this module is one of the [default modules](#default-modules) it will be rolled back to the version that was present when the Automation Account was created.

### PowerShell

To remove a module through PowerShell, run the following command:

```azurepowershell-interactive
Remove-AzureRmAutomationModule -Name <moduleName> -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName>
```

## Internal cmdlets

The following is a listing of cmdlets in the internal `Orchestrator.AssetManagement.Cmdlets` module that is imported into every Automation Account. These cmdlets are accessible in your runbooks and DSC configurations and allow you to interact with your assets within your Automation Account. Additionally, the internal cmdlets allow you to retrieve secrets from encrypted **Variable** values, **Credentials**, and encrypted **Connection** fields. The Azure PowerShell cmdlets are not able to retrieve these secrets. These cmdlets do not require you to implicitly connect to Azure when using them. This is beneficial for scenarios where you have a connection, such as a Run As Account that you need to use to authenticate to Azure.

|Name|Description|
|---|---|
|Get-AutomationCertificate|`Get-AutomationCertificate [-Name] <string> [<CommonParameters>]`|
|Get-AutomationConnection|`Get-AutomationConnection [-Name] <string> [-DoNotDecrypt] [<CommonParameters>]` |
|Get-AutomationPSCredential|`Get-AutomationPSCredential [-Name] <string> [<CommonParameters>]` |
|Get-AutomationVariable|`Get-AutomationVariable [-Name] <string> [-DoNotDecrypt] [<CommonParameters>]`|
|Set-AutomationVariable|`Set-AutomationVariable [-Name] <string> -Value <Object> [<CommonParameters>]` |
|Start-AutomationRunbook|`Start-AutomationRunbook [-Name] <string> [-Parameters <IDictionary>] [-RunOn <string>] [-JobId <guid>] [<CommonParameters>]`|
|Wait-AutomationJob|`Wait-AutomationJob -Id <guid[]> [-TimeoutInMinutes <int>] [-DelayInSeconds <int>] [-OutputJobsTransitionedToRunning] [<CommonParameters>]`|

## Add a connection type to your module

You can provide a custom [connection type](../automation-connections.md) for you to use in your Automation Account by adding an optional file to your module. This file is a metadata file specifying an Azure Automation connection type to be used with the module's cmdlets in your Automation Account. To achieve this you must first know how to author a PowerShell module. For more information on module authoring, see [How to Write a PowerShell Script Module](/powershell/developer/module/how-to-write-a-powershell-script-module).

![Use a custom connection in the Azure portal](../media/modules/connection-create-new.png)

To add an Azure Automation connection type, your module must contain a file with the name `<ModuleName>-Automation.json` that specifies the connection type properties. This is a json file, which is placed within the module folder of your compressed .zip file. This file contains the fields of a connection that is required to connect to the system or service the module represents. This configuration ends up creating a connection type in Azure Automation. Using this file you can set the field names, types, and whether the fields should be encrypted or optional, for the connection type of the module. The following example is a template in the json file format that defines a username and password property:

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

## Module best practices

PowerShell modules can be imported into Azure Automation to make their cmdlets available for use within runbooks and their DSC resources available for use within DSC configurations. Behind the scenes, Azure Automation stores these modules, and at runbook job and DSC compilation job execution time, loads them into the Azure Automation sandboxes where runbooks execute and DSC configurations compile. Any DSC resources in modules are also automatically placed on the Automation DSC pull server. They can be pulled by machines when they apply DSC configurations.

We recommend you consider the following when you author a PowerShell module for use in Azure Automation:

* Include a synopsis, description, and help URI for every cmdlet in the module. In PowerShell, you can define certain help information for cmdlets to allow the user to receive help on using them with the **Get-Help** cmdlet. The following example shows how to define a synopsis and help URI for in a .psm1 module file:

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

  Providing this info shows this help using the **Get-Help** cmdlet in the PowerShell console. This description is also displayed in the Azure portal.

  ![Integration Module Help](../media/modules/module-activity-description.png)

* If the module connects to an external service, it should contain a [connection type](#add-a-connection-type-to-your-module). Each cmdlet in the module should be able to take in a connection object (an instance of that connection type) as a parameter. This allows users to map parameters of the connection asset to the cmdlet's corresponding parameters each time they call a cmdlet. Based on the runbook example above, it uses an example Contoso connection asset called ContosoConnection to access Contoso resources and return data from the external service.

  In the following example, the fields are mapped to the UserName and Password properties of a `PSCredential` object and then passed to the cmdlet.

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

  You can enable behavior like the preceding example for your cmdlets by allowing them to accept a connection object directly as a parameter, instead of just connection fields for parameters. Usually you want a parameter set for each, so that a user not using Azure Automation can call your cmdlets without constructing a hashtable to act as the connection object. The parameter set `UserAccount`, is used to pass the connection field properties. `ConnectionObject` lets you pass the connection straight through.

* Define the output type for all cmdlets in the module. Defining an output type for a cmdlet allows design-time IntelliSense to help you determine the output properties of the cmdlet, for use during authoring. It's especially helpful during Automation runbook graphical authoring, where design time knowledge is key to an easy user experience with your module.

  This can be achieved by adding `[OutputType([<MyOutputType>])]` where MyOutputType is a valid type. To learn more about OutputType, see [About Functions OutputTypeAttribute](/powershell/module/microsoft.powershell.core/about/about_functions_outputtypeattribute). The following code is an example of adding `OutputType` to a cmdlet:

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

* Make all cmdlets in the module stateless. Multiple runbook jobs can simultaneously run in the same AppDomain and the same process and sandbox. If there is any state shared on those levels, jobs can affect each other. This behavior can lead to intermittent and hard to diagnose issues.  Here is an example of what not to do.

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

* The module should be fully contained in an xcopy-able package. Azure Automation modules are distributed to the Automation sandboxes when runbooks need to execute. The modules need to work independently of the host they're running on. You should be able to Zip up and move a module package and have it function as normal when imported into another host's PowerShell environment. In order for that to happen, the module shouldn't depend on any files outside the module folder. This folder is the folder that gets zipped up when the module is imported into Azure Automation. The module should also not depend on any unique registry settings on a host, such as those settings set when a product is installed. All files in the module should have a path fewer than 140 characters. Any paths over 140 characters will cause issues importing your runbook. If this best practice isn't followed, the module won't be usable in Azure Automation.  

* If referencing [Azure Powershell Az modules](/powershell/azure/new-azureps-module-az?view=azps-1.1.0) in your module, ensure you aren't also referencing `AzureRM`. The `Az` module can't be used in conjunction with the `AzureRM` modules. `Az` is supported in runbooks but aren't imported by default. To learn about the `Az` modules and considerations to take into account, see [Az module support in Azure Automation](../az-modules.md).

## Default modules

The following table lists the modules that are imported by default when an Automation Account is created. The modules listed below can have newer versions of them imported, but the original version can not be removed from your Automation Account even if you delete a newer version of them.

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

## Next steps

* To learn more about creating PowerShell Modules, see [Writing a Windows PowerShell Module](https://msdn.microsoft.com/library/dd878310%28v=vs.85%29.aspx)