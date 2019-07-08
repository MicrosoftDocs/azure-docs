---
title: Configure servers to a desired state and manage drift with Azure Automation
description: Tutorial - Manage server configurations with Azure Automation State Configuration
services: automation
ms.service: automation
ms.subservice: dsc
author: bobbytreed
ms.author: robreed
manager: carmonm
ms.topic: conceptual
ms.date: 08/08/2018
---
# Configure servers to a desired state and manage drift

Azure Automation State Configuration allows you to specify configurations for your servers and ensure that those servers are in the specified state over time.

> [!div class="checklist"]
> - Onboard a VM to be managed by Azure Automation DSC
> - Upload a configuration to Azure Automation
> - Compile a configuration into a node configuration
> - Assign a node configuration to a managed node
> - Check the compliance status of a managed node

## Prerequisites

To complete this tutorial, you will need:

- An Azure Automation account. For instructions on creating an Azure Automation Run As account, see [Azure Run As Account](automation-sec-configure-azure-runas-account.md).
- An Azure Resource Manager VM (not Classic) running Windows Server 2008 R2 or later. For instructions on creating a VM, see
  [Create your first Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)
- Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps).
- Familiarity with Desired State Configuration (DSC). For information about DSC, see [Windows PowerShell Desired State Configuration Overview](https://docs.microsoft.com/powershell/dsc/overview)

## Log in to Azure

Log in to your Azure subscription with the `Connect-AzureRmAccount` command and follow the on-screen directions.

```powershell
Connect-AzureRmAccount
```

## Create and upload a configuration to Azure Automation

For this tutorial, we will use a simple DSC configuration that ensures that IIS is installed on the VM.

For information about DSC configurations, see [DSC configurations](/powershell/dsc/configurations).

In a text editor, type the following and save it locally as `TestConfig.ps1`.

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

Call the `Import-AzureRmAutomationDscConfiguration` cmdlet to upload the configuration into your Automation account:

```powershell
 Import-AzureRmAutomationDscConfiguration -SourcePath 'C:\DscConfigs\TestConfig.ps1' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Published
```

## Compile a configuration into a node configuration

A DSC configuration must be compiled into a node configuration before it can be assigned to a node.

For information about compiling configurations, see [DSC configurations](/powershell/dsc/configurations).

Call the `Start-AzureRmAutomationDscCompilationJob` cmdlet to compile the `TestConfig` configuration into a node configuration:

```powershell
Start-AzureRmAutomationDscCompilationJob -ConfigurationName 'TestConfig' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount'
```

This creates a node configuration named `TestConfig.WebServer` in your Automation account.

## Register a VM to be managed by State Configuration

You can use Azure Automation State Configuration to manage Azure VMs (both Classic and Resource
Manager), on-premises VMs, Linux machines, AWS VMs, and on-premises physical machines. In this
topic, we cover how to register only Azure Resource Manager VMs. For information about registering
other types of machines, see
[Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

Call the `Register-AzureRmAutomationDscNode` cmdlet to register your VM with Azure Automation State
Configuration.

```powershell
Register-AzureRmAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -AzureVMName 'DscVm'
```

This registers the specified VM as a managed node in State Configuration.

### Specify configuration mode settings

When you register a VM as a managed node, you can also specify properties of the configuration. For
example, you can specify that the state of the machine is to be applied only once (DSC does not
attempt to apply the configuration after the initial check) by specifying `ApplyOnly` as the value
of the **ConfigurationMode** property:

```powershell
Register-AzureRmAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -AzureVMName 'DscVm' -ConfigurationMode 'ApplyOnly'
```

You can also specify how often DSC checks the configuration state by using the **ConfigurationModeFrequencyMins** property:

```powershell
# Run a DSC check every 60 minutes
Register-AzureRmAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -AzureVMName 'DscVm' -ConfigurationModeFrequencyMins 60
```

For more information about setting configuration properties for a managed node, see
[Register-AzureRmAutomationDscNode](/powershell/module/azurerm.automation/register-azurermautomationdscnode).

For more information about DSC configuration settings, see [Configuring the Local Configuration Manager](/powershell/dsc/metaconfig).

## Assign a node configuration to a managed node

Now we can assign the compiled node configuration to the VM we want to configure.

```powershell
# Get the ID of the DSC node
$node = Get-AzureRmAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Name 'DscVm'

# Assign the node configuration to the DSC node
Set-AzureRmAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -NodeConfigurationName 'TestConfig.WebServer' -NodeId $node.Id
```

This assigns the node configuration named `TestConfig.WebServer` to the registered DSC node named `DscVm`.
By default, the DSC node is checked for compliance with the node configuration every 30 minutes.
For information about how to change the compliance check interval, see
[Configuring the Local Configuration Manager](/PowerShell/DSC/metaConfig).

## Check the compliance status of a managed node

You can get reports on the compliance status of a managed node by calling the `Get-AzureRmAutomationDscNodeReport` cmdlet:

```powershell
# Get the ID of the DSC node
$node = Get-AzureRmAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Name 'DscVm'

# Get an array of status reports for the DSC node
$reports = Get-AzureRmAutomationDscNodeReport -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -NodeId $node.Id

# Display the most recent report
$reports[0]
```

## Removing nodes from service

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

- To get started, see [Getting started with Azure Automation State Configuration](automation-dsc-getting-started.md)
- To learn how to onboard nodes, see [Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md)
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compiling configurations in Azure Automation State Configuration](automation-dsc-compile.md)
- For PowerShell cmdlet reference, see [Azure Automation State Configuration cmdlets](/powershell/module/azurerm.automation/#automation)
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/)
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Continuous Deployment Using Azure Automation State Configuration and Chocolatey](automation-dsc-cd-chocolatey.md)
