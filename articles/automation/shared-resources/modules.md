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

Azure Automation allows you to import PowerShell modules to enable cmdlets in runbooks and DSC resources in DSC configurations. Modules used in Azure Automation include:

* [Azure PowerShell Az.Automation](/powershell/azure/new-azureps-module-az?view=azps-1.1.0)
* [Azure PowerShell AzureRM.Automation](https://docs.microsoft.com/powershell/module/azurerm.automation/?view=azurermps-6.13.0)
* Internal `Orchestrator.AssetManagement.Cmdlets` module for the Log Analytics agent for Windows
* [AzureAutomationAuthoringToolkit](https://www.powershellgallery.com/packages/AzureAutomationAuthoringToolkit/0.2.3.9)
* Other PowerShell modules
* Custom modules that you create 

When you create an Automation account, Azure Automation imports some modules by default. See [Default modules](#default-modules).

When Azure Automation executes runbook and DSC compilation jobs, it loads the modules into sandboxes where the runbooks can run and the DSC configurations can compile. Automation also automatically places any DSC resources in modules on the DSC pull server. Machines can pull the resources when they apply the DSC configurations.

>[!NOTE]
>Be sure to import only the modules that your runbooks and DSC configurations actually need. We don’t recommend importing the root Az module since it includes many other modules that you might not need, which can cause performance problems. Import individual modules, such as Az.Compute, instead.

>[!NOTE]
>This article has been updated to use the new Azure PowerShell Az module. You can still use the AzureRM module, which will continue to receive bug fixes until at least December 2020. To learn more about the new Az module and AzureRM compatibility, see [Introducing the new Azure PowerShell Az module](https://docs.microsoft.com/powershell/azure/new-azureps-module-az?view=azps-3.5.0). For Az module installation instructions on your Hybrid Runbook Worker, see [Install the Azure PowerShell Module](https://docs.microsoft.com/powershell/azure/install-az-ps?view=azps-3.5.0). For your Automation account, you can update your modules to the latest version using [How to update Azure PowerShell modules in Azure Automation](../automation-update-azure-modules.md).

## Default modules

The following table lists modules that Azure Automation imports by default when you create your Automation account. Automation can import newer versions of these modules. However, you can't remove the original version from your Automation account, even if you delete a newer version. Note that these default modules include several AzureRM modules. 

Az.Automation modules are preferred in your runbooks and DSC configurations. However, Azure Automation doesn't import the root Az module automatically into any new or existing Automation accounts. For more about working with these modules, see [Migrating to Az modules](#migrating-to-az-modules).

> [!NOTE]
> We don't recommend altering modules and runbooks in Automation accounts that contain the [Start/Stop VMs during off-hours solution in Azure Automation](../automation-solution-vm-management.md).

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

The following table defines the internal cmdlets supported by the `Orchestrator.AssetManagement.Cmdlets` module. Use these cmdlets in your runbooks and DSC configurations to interact with Azure assets within the Automation account. The cmdlets are designed to be used instead of Azure PowerShell cmdlets to retrieve secrets from encrypted variables, credentials, and encrypted connections. 

>[!NOTE]
>The internal cmdlets are only available when you're executing runbooks in the Azure sandbox environment or on a Windows Hybrid Runbook Worker. 

|Name|Description|
|---|---|
|Get-AutomationCertificate|`Get-AutomationCertificate [-Name] <string> [<CommonParameters>]`|
|Get-AutomationConnection|`Get-AutomationConnection [-Name] <string> [-DoNotDecrypt] [<CommonParameters>]` |
|Get-AutomationPSCredential|`Get-AutomationPSCredential [-Name] <string> [<CommonParameters>]` |
|Get-AutomationVariable|`Get-AutomationVariable [-Name] <string> [-DoNotDecrypt] [<CommonParameters>]`|
|Set-AutomationVariable|`Set-AutomationVariable [-Name] <string> -Value <Object> [<CommonParameters>]` |
|Start-AutomationRunbook|`Start-AutomationRunbook [-Name] <string> [-Parameters <IDictionary>] [-RunOn <string>] [-JobId <guid>] [<CommonParameters>]`|
|Wait-AutomationJob|`Wait-AutomationJob -Id <guid[]> [-TimeoutInMinutes <int>] [-DelayInSeconds <int>] [-OutputJobsTransitionedToRunning] [<CommonParameters>]`|

Note that the internal cmdlets differ in naming from the Az and AzureRM cmdlets. Internal cmdlet names don't contain words like “Azure” or “Az” in the noun, but do use the word "Automation". We recommend their use over the use of Az or AzureRM cmdlets during runbook execution in an Azure sandbox or on a Windows hybrid worker. They require fewer parameters and run in the context of your already-executing job.

Use Az or AzureRM cmdlets for manipulating Azure Automation resources outside the context of a runbook. In these cases, you must implicitly connect to Azure when using the cmdlets, as when using a Run As account to authenticate to Azure. 

## Modules supporting Get-AutomationPSCredential

For local development using the Azure Automation Authoring Toolkit, the `Get-AutomationPSCredential` cmdlet is part of assembly [AzureAutomationAuthoringToolkit](https://www.powershellgallery.com/packages/AzureAutomationAuthoringToolkit/0.2.3.9). For Azure working with the Automation context, the cmdlet is in `Orchestrator.AssetManagement.Cmdlets`. To find out more about the use of credentials in Azure Automation, see [Credential assets in Azure Automation](credentials.md).

Note that `Get-AutomationPsCredential` returns a `PSCredential` object, which is expected by most PowerShell cmdlets that work with credentials. Most often, you should use this cmdlet instead of the [Get-AzAutomationCredential](https://docs.microsoft.com/powershell/module/az.automation/get-azautomationcredential?view=azps-3.8.0) cmdlet. `Get-AzAutomationCredential` retrieves a [CredentialInfo](https://docs.microsoft.com/dotnet/api/microsoft.azure.commands.automation.model.credentialinfo?view=azurerm-ps) object containing metadata about the credential. This information is not normally helpful to pass to another cmdlet.

## Migrating to Az modules

There are several things to take into consideration when using the Az modules in Azure Automation:

* We don't recommend running AzureRM modules and Az modules in the same Automation account, as it's guaranteed to cause problems. See [Migrate Azure PowerShell from AzureRM to Az](https://docs.microsoft.com/powershell/azure/migrate-from-azurerm-to-az?view=azps-3.7.0). 

* Be sure to test all runbooks and DSC configurations carefully in a separate Automation account before importing the Az modules. 

* Importing an Az module into your Automation account doesn't automatically import the module into the PowerShell session that runbooks use. Modules are imported into the PowerShell session in the following situations:

    * When a runbook invokes a cmdlet from a module
    * When a runbook imports the module explicitly with the [Import-Module](https://docs.microsoft.com/powershell/module/microsoft.powershell.core/import-module?view=powershell-7) cmdlet
    * When a runbook imports another dependent module

After you've completed the migration of your modules, don't try to start runbooks using AzureRM modules on the Automation account. It's also recommended to not import or update AzureRM modules on the account. Consider the account migrated to Az.Automation, and operate with Az modules only.

>[!IMPORTANT]
>When you create a new Automation account, Azure Automation installs the AzureRM modules by default. You can still update the tutorial runbooks with AzureRM cmdlets. However, you should not run these runbooks.

### Stop and unschedule all runbooks that use AzureRM modules

To ensure that you don't run any existing runbooks that use AzureRM modules, stop and unschedule all affected runbooks using the [Remove-AzureRmAutomationSchedule](https://docs.microsoft.com/powershell/module/azurerm.automation/remove-azurermautomationschedule?view=azurermps-6.13.0) cmdlet. It's important to review each schedule separately to ensure that you can reschedule it in the future for your runbooks, if necessary.

```powershell
Get-AzureRmAutomationSchedule -AutomationAccountName "Contoso17" -Name "DailySchedule08" -ResourceGroupName "ResourceGroup01" 
Remove-AzureRmAutomationSchedule -AutomationAccountName "Contoso17" -Name "DailySchedule08" -ResourceGroupName "ResourceGroup01"
```

### Import the Az modules

This section tells how to import the Az modules in the Azure portal. Remember to import only the Az modules that you need, not the entire Az.Automation module. Since [Az.Accounts](https://www.powershellgallery.com/packages/Az.Accounts/1.1.0) is a dependency for the other Az modules, be sure to import this module before any others.

1. From your Automation account, select **Modules** under **Shared Resources**. 
2. Click **Browse Gallery** to open the Browse Gallery page.  
3. In the search bar, enter the module name, for example, `Az.Accounts`. 
4. On the PowerShell Module page, click **Import** to import the module into your Automation account.

    ![Import modules to Automation account](../media/modules/import-module.png)

This import process can also be done through the [PowerShell Gallery](https://www.powershellgallery.com) by searching for the module to import. Once you find the module, select it, choose the **Azure Automation** tab, and click **Deploy to Azure Automation**.

![Import modules directly from gallery](../media/modules/import-gallery.png)

### Test your runbooks

Once you've imported the Az modules into the Automation account, you can start editing your runbooks to use the new modules. The majority of the cmdlets have the same names as for the AzureRM modules, except that the AzureRm prefix has been changed to Az. For a list of modules that don't follow this naming convention, see [list of exceptions](/powershell/azure/migrate-from-azurerm-to-az#update-cmdlets-modules-and-parameters).

One way to test the modification of a runbook to use the new cmdlets is by using `Enable-AzureRmAlias -Scope Process` at the beginning of the runbook. By adding this command to your runbook, the script can run without changes. 

## Authoring modules

We recommend that you follow the considerations in this section when you author a PowerShell module for use in Azure Automation.

### References to AzureRM and Az

If referencing the Az modules in your module, ensure that you aren't also referencing the AzureRM modules. You can't use both sets of modules at the same time. 

### Version folder

Do NOT include a version folder in the **.zip** package for your module.  This issue is less of a concern for runbooks but does cause an issue with the State Configuration (DSC) service. Azure Automation creates the version folder automatically when the module is distributed to nodes managed by DSC. If a version folder exists, you end up with two instances. Here is an example folder structure for a DSC module:

```powershell
myModule
  - DSCResources
    - myResourceFolder
      myResourceModule.psm1
      myResourceSchema.mof
  myModuleManifest.psd1
```

### Help information

Include a synopsis, description, and help URI for every cmdlet in your module. In PowerShell, you can define help information for cmdlets using the `Get-Help` cmdlet. The following example shows how to define a synopsis and help URI in a **.psm1** module file.

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

If the module connects to an external service, define a [connection type](#adding-a-connection-type-to-your-module). Each cmdlet in the module should accept a connection object (an instance of that connection type) as a parameter. Users map parameters of the connection asset to the cmdlet's corresponding parameters each time they call a cmdlet. The following runbook example, based on the example in the previous section, uses a Contoso connection asset called `ContosoConnection` to access Contoso resources and return data from the external service. In this example, the fields are mapped to the `UserName` and `Password` properties of a `PSCredential` object and then passed to the cmdlet.

  ```powershell
  $contosoConnection = Get-AutomationConnection -Name 'ContosoConnection'

  $cred = New-Object –TypeName System.Management.Automation.PSCredential –ArgumentList $contosoConnection.UserName, $contosoConnection.Password
  Connect-Contoso -Credential $cred
  }
  ```

  An easier and better way to approach this behavior is by directly passing the connection object to the cmdlet:

  ```powershell
  $contosoConnection = Get-AutomationConnection -Name 'ContosoConnection'

  Connect-Contoso -Connection $contosoConnection
  }
  ```

  You can enable similar behavior for your cmdlets by allowing them to accept a connection object directly as a parameter, instead of just connection fields for parameters. Usually you want a parameter set for each, so that a user not using Azure Automation can call your cmdlets without constructing a hashtable to act as the connection object. The parameter set `UserAccount` is used to pass the connection field properties. `ConnectionObject` lets you pass the connection straight through.

### Output type

Define the output type for all cmdlets in your module. Defining an output type for a cmdlet allows design-time IntelliSense to help determine the output properties of the cmdlet during authoring. This practice is especially helpful during graphical runbook authoring, for which design-time knowledge is key to an easy user experience with your module.

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

Ensure that the module is fully contained in a package that can be copied using xcopy. Azure Automation modules are distributed to the Automation sandboxes when runbooks execute. The modules must work independently of the host that runs them. 

You should be able to zip up and move a module package and have it function as normal when imported into another host's PowerShell environment. For this to happen, ensure that the module doesn't depend on any files outside the module folder that is zipped up when the module is imported into Azure Automation. 

Your module should not depend on any unique registry settings on a host. Examples are the settings that are made when a product is installed. 

### Module file paths

Make sure that all files in the module have paths with fewer than 140 characters. Any paths over 140 characters in length cause issues with importing runbooks. Azure Automation can't import a file with path size over 140 characters into the PowerShell session with `Import-Module`.

## Importing modules

This section defines several ways that you can import a module into your Automation account. 

### Import modules in Azure portal

To import a module in the Azure portal:

1. Navigate to your Automation account.
2. Select **Modules** under **Shared Resources**.
3. Click **Add a module**. 
4. Select the **.zip** file that contains your module.
5. Click **OK** to start to import process.

### Import modules using PowerShell

You can use the [New-AzAutomationModule](https://docs.microsoft.com/powershell/module/az.automation/new-azautomationmodule?view=azps-3.7.0) cmdlet to import a module into your Automation account. The cmdlet takes a URL for a module .zip package.

```azurepowershell-interactive
New-AzAutomationModule -Name <ModuleName> -ContentLinkUri <ModuleUri> -ResourceGroupName <ResourceGroupName> -AutomationAccountName <AutomationAccountName>
```

You can also use the same cmdlet to import a module from PowerShell Gallery directly. Make sure to grab `ModuleName` and `ModuleVersion` from [PowerShell Gallery](https://www.powershellgallery.com).

```azurepowershell-interactive
$moduleName = <ModuleName>
$moduleVersion = <ModuleVersion>
New-AzAutomationModule -AutomationAccountName <AutomationAccountName> -ResourceGroupName <ResourceGroupName> -Name $moduleName -ContentLinkUri "https://www.powershellgallery.com/api/v2/package/$moduleName/$moduleVersion"
```

### Import modules from PowerShell Gallery

You can import [PowerShell Gallery](https://www.powershellgallery.com) modules either directly from the gallery or from your Automation account.

To import a module directly from the PowerShell Gallery:

1. Go to https://www.powershellgallery.com and search for the module to import.
2. Click **Deploy to Azure Automation** on the **Azure Automation** tab under **Installation Options**. This action opens the Azure portal. 
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
Remove-AzAutomationModule -Name <moduleName> -AutomationAccountName <automationAccountName> -ResourceGroupName <resourceGroupName>
```

## Adding a connection type to your module

You can provide a custom [connection type](../automation-connections.md) to use in your Automation account by adding an optional metadata file to your module. This file specifies an Azure Automation connection type to be used with the module's cmdlets in your Automation account. To learn more about authoring a PowerShell module, see [How to Write a PowerShell Script Module](https://docs.microsoft.com/powershell/scripting/developer/module/how-to-write-a-powershell-script-module?view=powershell-7).

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

## Next steps

* For more information about using Azure PowerShell modules, see [Get started with Azure PowerShell](https://docs.microsoft.com/powershell/azure/get-started-azureps?view=azps-3.7.0).
* To learn more about creating PowerShell modules, see [Writing a Windows PowerShell Module](https://docs.microsoft.com/powershell/scripting/developer/module/writing-a-windows-powershell-module?view=powershell-7).
