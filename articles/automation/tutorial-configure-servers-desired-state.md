---
title: Configure machines to a desired state in Azure Automation
description: This article tells how to configure machines to a desired state using Azure Automation State Configuration.
services: automation
ms.subservice: dsc
ms.topic: conceptual
ms.date: 08/08/2018
---
# Configure machines to a desired state

Azure Automation State Configuration allows you to specify configurations for your servers and ensure that those servers are in the specified state over time.

> [!div class="checklist"]
> - Onboard a VM to be managed by Azure Automation DSC
> - Upload a configuration to Azure Automation
> - Compile a configuration into a node configuration
> - Assign a node configuration to a managed node
> - Check the compliance status of a managed node

For this tutorial, we use a simple [DSC configuration](/powershell/scripting/dsc/configurations/configurations) that ensures that IIS is installed on the VM.

## Prerequisites

- An Azure Automation account. For instructions on creating an Azure Automation Run As account, see [Azure Run As Account](automation-sec-configure-azure-runas-account.md).
- An Azure Resource Manager VM (not classic) running Windows Server 2008 R2 or later. For instructions on creating a VM, see
  [Create your first Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md).
- Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps).
- Familiarity with Desired State Configuration (DSC). For information about DSC, see [Windows PowerShell Desired State Configuration Overview](/powershell/scripting/dsc/overview/overview).

## Support for partial configurations

Azure Automation State Configuration supports the use of
[partial configurations](/powershell/scripting/dsc/pull-server/partialconfigs). In this scenario, DSC is configured to manage multiple configurations independently, and each configuration is retrieved from Azure Automation. However, only one configuration can be assigned to a node per automation account. This means if you are using two configurations for a node you will require two Automation accounts.

For details about how to register a partial configuration from a pull service, see the documentation for [partial configurations](https://docs.microsoft.com/powershell/scripting/dsc/pull-server/partialconfigs#partial-configurations-in-pull-mode).

For more information about how teams can work together to collaboratively manage servers using configuration as code, see
[Understanding DSC's role in a CI/CD Pipeline](/powershell/scripting/dsc/overview/authoringadvanced).

## Log in to Azure

Log in to your Azure subscription with the [Connect-AzAccount](https://docs.microsoft.com/powershell/module/Az.Accounts/Connect-AzAccount?view=azps-3.7.0) cmdlet and follow the on-screen directions.

```powershell
Connect-AzAccount
```

## Create and upload a configuration to Azure Automation


In a text editor, type the following and save it locally as **TestConfig.ps1**.

```powershell
configuration TestConfig {
   Node WebServer {
      WindowsFeature IIS {
         Ensure               = 'Present'
         Name                 = 'Web-Server'
         IncludeAllSubFeature = $true
      }
   }
}
```

> [!NOTE]
> In more advanced scenarios where you require multiple modules to be imported that provide DSC Resources,
> make sure each module has a unique `Import-DscResource` line in your configuration.

Call the [Import-AzAutomationDscConfiguration](https://docs.microsoft.com/powershell/module/Az.Automation/Import-AzAutomationDscConfiguration?view=azps-3.7.0) cmdlet to upload the configuration into your Automation account.

```powershell
 Import-AzAutomationDscConfiguration -SourcePath 'C:\DscConfigs\TestConfig.ps1' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Published
```

## Compile a configuration into a node configuration

A DSC configuration must be compiled into a node configuration before it can be assigned to a node. See [DSC configurations](/powershell/scripting/dsc/configurations/configurations).

Call the [Start-AzAutomationDscCompilationJob](https://docs.microsoft.com/powershell/module/Az.Automation/Start-AzAutomationDscCompilationJob?view=azps-3.7.0) cmdlet to compile the `TestConfig` configuration into a node configuration named `TestConfig.WebServer` in your Automation account.

```powershell
Start-AzAutomationDscCompilationJob -ConfigurationName 'TestConfig' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount'
```

## Register a VM to be managed by State Configuration

You can use Azure Automation State Configuration to manage Azure VMs (both Classic and Resource
Manager), on-premises VMs, Linux machines, AWS VMs, and on-premises physical machines. In this
topic, we cover how to register only Azure Resource Manager VMs. For information about registering
other types of machines, see [Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

Call the [Register-AzAutomationDscNode](https://docs.microsoft.com/powershell/module/Az.Automation/Register-AzAutomationDscNode?view=azps-3.7.0) cmdlet to register your VM with Azure Automation State
Configuration as a managed node. 

```powershell
Register-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -AzureVMName 'DscVm'
```

### Specify configuration mode settings

Use the [Register-AzAutomationDscNode](/powershell/module/azurerm.automation/register-azurermautomationdscnode) cmdlet to register a VM as a managed node and specify configuration properties. For
example, you can specify that the state of the machine is to be applied only once by specifying `ApplyOnly` as the value of the `ConfigurationMode` property. State Configuration doesn't try to apply the configuration after the initial check.

```powershell
Register-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -AzureVMName 'DscVm' -ConfigurationMode 'ApplyOnly'
```

You can also specify how often DSC checks the configuration state by using the `ConfigurationModeFrequencyMins` property. For more information about DSC configuration settings, see [Configuring the Local Configuration Manager](/powershell/scripting/dsc/managing-nodes/metaConfig).

```powershell
# Run a DSC check every 60 minutes
Register-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -AzureVMName 'DscVm' -ConfigurationModeFrequencyMins 60
```

## Assign a node configuration to a managed node

Now we can assign the compiled node configuration to the VM we want to configure.

```powershell
# Get the ID of the DSC node
$node = Get-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Name 'DscVm'

# Assign the node configuration to the DSC node
Set-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -NodeConfigurationName 'TestConfig.WebServer' -NodeId $node.Id
```

This assigns the node configuration named `TestConfig.WebServer` to the registered DSC node `DscVm`. By default, the DSC node is checked for compliance with the node configuration every 30 minutes. For information about how to change the compliance check interval, see
[Configuring the Local Configuration Manager](/powershell/scripting/dsc/managing-nodes/metaConfig).

## Check the compliance status of a managed node

You can get reports on the compliance status of a managed node using the [Get-AzAutomationDscNodeReport](https://docs.microsoft.com/powershell/module/Az.Automation/Get-AzAutomationDscNodeReport?view=azps-3.7.0) cmdlet.

```powershell
# Get the ID of the DSC node
$node = Get-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Name 'DscVm'

# Get an array of status reports for the DSC node
$reports = Get-AzAutomationDscNodeReport -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -NodeId $node.Id

# Display the most recent report
$reports[0]
```

## Remove nodes from service

When you add a node to Azure Automation State Configuration,
the settings in Local Configuration Manager are set to register with the service
and pull configurations and required modules to configure the machine.
If you choose to remove the node from the service,
you can do so using either the Azure portal
or the Az cmdlets.

> [!NOTE]
> Unregistering a node from the service only sets the Local Configuration Manager settings
> so the node is no longer connecting to the service.
> This does not effect the configuration that is currently applied to the node.
> To remove the current configuration, use the
> [PowerShell](https://docs.microsoft.com/powershell/module/psdesiredstateconfiguration/remove-dscconfigurationdocument?view=powershell-5.1)
> or delete the local configuration file
> (this is the only option for Linux nodes).

### Azure portal

From Azure Automation, click on **State configuration (DSC)** in the table of contents.
Next click **Nodes** to view the list of nodes that are registered with the service.
Click on the name of the node you wish to remove.
In the Node view that opens, click **Unregister**.

### PowerShell

To unregister a node from Azure Automation State Configuration service using PowerShell,
follow the documentation for the cmdlet
[Unregister-AzAutomationDscNode](https://docs.microsoft.com/powershell/module/az.automation/unregister-azautomationdscnode?view=azps-2.0.0).

## Next steps

- To get started, see [Get started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn how to enable nodes, see [Enable Azure Automation State Configuration](automation-dsc-onboarding.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compile DSC configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Set up continuous deployment with Chocolatey](automation-dsc-cd-chocolatey.md).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- For a PowerShell cmdlet reference, see [Az.Automation](https://docs.microsoft.com/powershell/module/az.automation/?view=azps-3.7.0#automation
).
