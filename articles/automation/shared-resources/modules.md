---
title: Manage Modules in Azure Automation
description: This article describes how to manage modules in Azure Automation
services: automation
ms.service: automation
ms.subservice: shared-resources
author: georgewallace
ms.author: gwallace
ms.date: 03/06/2019
ms.topic: conceptual
manager: carmonm 
---

# Manage Modules in Azure Automation

Azure Automation provides the ability to import PowerShell modules into your Automation Account to be used by the PowerShell based runbooks. These modules can be custom modules you have created, from the PowerShell Gallery, or the AzureRM and Az modules for Azure.

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

You can also import modules from the PowerShell Gallery directly from your Automation Account. In your Automation Account select **Modules** under **Shared Resources**. On the modules page, click **Browse gallery**. This opens up the **Browse Gallery** page. You can use this page to search the PowerShell Gallery for a module. Select the module you want to import and click **Import**. On the **Import** page click **OK** to start the import process.

![PowerShell Gallery import from azure portal](../media/modules/gallery-azure-portal.png)

## Internal cmdlets

The following is a listing of cmdlets in the internal `Orchestrator.AssetManagement.Cmdlets` module that is imported into every Automation Account. These cmdlets are accessible in your runbooks and DSC configurations and allow you to interact with your assets within your Automation Account.

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

You can provide a custom [connection type](../automation-connections.md) for you to use in your Automation Account by adding an optional file to your module. This file is a metadata file specifying an Azure Automation connection type to be used with the module's cmdlets in your Automation Account.

![Use a custom connection in the Azure portal](../media/modules/connection-create-new.png)

To add an Azure Automation connection type, your module must also contain a file with the name `<ModuleName>-Automation.json` that specifies the connection type properties. This is a json file, which is placed within the module folder of your compressed .zip file. This file contains the fields of a connection that is required to connect to the system or service the module represents. This configuration ends up creating a connection type in Azure Automation. Using this file you can set the field names, types, and whether the fields should be encrypted or optional, for the connection type of the module. The following example is a template in the json file format that defines a username and password property:

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

1. Include a synopsis, description, and help URI for every cmdlet in the module. In PowerShell, you can define certain help information for cmdlets to allow the user to receive help on using them with the **Get-Help** cmdlet. The following example shows how to define a synopsis and help URI for in a .psm1 module file:

    ```powershell
    <#
        .SYNOPSIS
         Gets a Contoso User account
    #>
    function Get-ContosoUser {
    [CmdletBinding](DefaultParameterSetName='UseConnectionObject', `
    HelpUri='https://www.contoso.com/docs/information')]
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

2. If the module runs against a remote system:

   1. It should contain an Integration Module metadata file that defines the information needed to connect to that remote system, meaning the connection type.
   2. Each cmdlet in the module should be able to take in a connection object (an instance of that connection type) as a parameter.  

    Cmdlets in the module become easier to use in Azure Automation if you allow passing an object with the fields of the connection type as a parameter to the cmdlet. This allows users to map parameters of the connection asset to the cmdlet's corresponding parameters each time they call a cmdlet.

    Based on the runbook example above, it uses a Twilio connection asset called CorpTwilio to access Twilio and return all the phone numbers in the account.  Notice how it's mapping the fields of the connection to the parameters of the cmdlet?

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

    You can enable behavior like the preceding example for your cmdlets by allowing them to accept a connection object directly as a parameter, instead of just connection fields for parameters. Usually you want a parameter set for each, so that a user not using Azure Automation can call your cmdlets without constructing a hashtable to act as the connection object. The parameter set `UserAccount`, is used to pass the connection field properties one by one. `ConnectionObject` lets you pass the connection straight through.

3. Define the output type for all cmdlets in the module. Defining an output type for a cmdlet allows design-time IntelliSense to help you determine the output properties of the cmdlet, for use during authoring. It's especially helpful during Automation runbook graphical authoring, where design time knowledge is key to an easy user experience with your module.

   This can be achieved by adding `[OutputType([<MyOutputType>])]` where MyOutputType is a valid type.

   ![Graphical Runbook Output Type](../media/automation-integration-modules/runbook-graphical-module-output-type.png)

   This behavior is similar to the "type ahead" functionality of a cmdlet's output in PowerShell ISE without having to run it.

   ![POSH IntelliSense](../media/automation-integration-modules/automation-posh-ise-intellisense.png)

4. The module should be fully contained in an xcopy-able package. Azure Automation modules are distributed to the Automation sandboxes when runbooks need to execute. The modules need to work independently of the host they're running on. You should be able to Zip up and move a module package and have it function as normal when imported into another host's PowerShell environment. In order for that to happen, the module shouldn't depend on any files outside the module folder. This folder is the folder that gets zipped up when the module is imported into Azure Automation. The module should also not depend on any unique registry settings on a host, such as those settings set when a product is installed. All files in the module should have a path less than 140 characters. Any paths over 140 characters will cause issues importing your runbook. If this best practice isn't followed, the module won't be usable in Azure Automation.  

5. If referencing [Azure Powershell Az modules](/powershell/azure/new-azureps-module-az?view=azps-1.1.0) in your module, ensure you aren't also referencing `AzureRM`. The `Az` module can't be used in conjunction with the `AzureRM` modules. `Az` is supported in runbooks but aren't imported by default. To learn about the `Az` modules and considerations to take into account, see [Az module support in Azure Automation](../az-modules.md).

## Next steps

* To learn more about creating PowerShell Modules, see [Writing a Windows PowerShell Module](https://msdn.microsoft.com/library/dd878310%28v=vs.85%29.aspx))