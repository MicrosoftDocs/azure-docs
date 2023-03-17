---
title: Configure machines to a desired state in Azure Automation
description: This article tells how to configure machines to a desired state using Azure Automation State Configuration.
services: automation
ms.subservice: dsc
ms.topic: conceptual
ms.date: 04/15/2021
ms.custom: devx-track-azurepowershell
---

# Configure machines to a desired state

Azure Automation State Configuration allows you to specify configurations for your servers and ensure that those servers are in the specified state over time.

> [!div class="checklist"]
> - Onboard a VM to be managed by Azure Automation DSC
> - Upload a configuration to Azure Automation
> - Compile a configuration into a node configuration
> - Assign a node configuration to a managed node
> - Check the compliance status of a managed node

For this tutorial, we use a simple [DSC configuration](/powershell/dsc/configurations/configurations) that ensures that IIS is installed on the VM.

## Prerequisites

- An Azure Automation account. To learn more about an Automation account and its requirements, see [Automation Account authentication overview](./automation-security-overview.md).
- An Azure Resource Manager VM (not classic) running Windows Server 2008 R2 or later. For instructions on creating a VM, see
  [Create your first Windows virtual machine in the Azure portal](../virtual-machines/windows/quick-create-portal.md).
- Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable Az` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/azurerm/install-azurerm-ps).
- Familiarity with Desired State Configuration (DSC). For information about DSC, see [Windows PowerShell Desired State Configuration Overview](/powershell/dsc/overview).

## Support for partial configurations

Azure Automation State Configuration supports the use of
[partial configurations](/powershell/dsc/pull-server/partialconfigs). In this scenario, DSC is configured to manage multiple configurations independently, and each configuration is retrieved from Azure Automation. However, only one configuration can be assigned to a node per automation account. This means if you are using two configurations for a node you will require two Automation accounts.

For details about how to register a partial configuration from a pull service, see the documentation for [partial configurations](/powershell/dsc/pull-server/partialconfigs#partial-configurations-in-pull-mode).

For more information about how teams can work together to collaboratively manage servers using configuration as code, see
[Understanding DSC's role in a CI/CD Pipeline](/powershell/dsc/overview/authoringadvanced).

## Log in to Azure

Log in to your Azure subscription with the [Connect-AzAccount](/powershell/module/Az.Accounts/Connect-AzAccount) cmdlet and follow the on-screen directions.

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
> Configuration names in Azure Automation must be limited to no more than 100 characters.
> 
> In more advanced scenarios where you require multiple modules to be imported that provide DSC Resources,
> make sure each module has a unique `Import-DscResource` line in your configuration.

Call the [Import-AzAutomationDscConfiguration](/powershell/module/Az.Automation/Import-AzAutomationDscConfiguration) cmdlet to upload the configuration into your Automation account.

```powershell
 Import-AzAutomationDscConfiguration -SourcePath 'C:\DscConfigs\TestConfig.ps1' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Published
```

## Compile a configuration into a node configuration

A DSC configuration must be compiled into a node configuration before it can be assigned to a node. See [DSC configurations](/powershell/dsc/configurations/configurations).

Call the [Start-AzAutomationDscCompilationJob](/powershell/module/Az.Automation/Start-AzAutomationDscCompilationJob) cmdlet to compile the `TestConfig` configuration into a node configuration named `TestConfig.WebServer` in your Automation account.

```powershell
Start-AzAutomationDscCompilationJob -ConfigurationName 'TestConfig' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount'
```

## Register a VM to be managed by State Configuration

You can use Azure Automation State Configuration to manage Azure VMs (both Classic and Resource
Manager), on-premises VMs, Linux machines, AWS VMs, and on-premises physical machines. In this
topic, we cover how to register only Azure Resource Manager VMs. For information about registering
other types of machines, see [Onboarding machines for management by Azure Automation State Configuration](automation-dsc-onboarding.md).

Call the [Register-AzAutomationDscNode](/powershell/module/Az.Automation/Register-AzAutomationDscNode) cmdlet to register your VM with Azure Automation State
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

You can also specify how often DSC checks the configuration state by using the `ConfigurationModeFrequencyMins` property. For more information about DSC configuration settings, see [Configuring the Local Configuration Manager](/powershell/dsc/managing-nodes/metaConfig).

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
[Configuring the Local Configuration Manager](/powershell/dsc/managing-nodes/metaConfig).

## Check the compliance status of a managed node

You can get reports on the compliance status of a managed node using the [Get-AzAutomationDscNodeReport](/powershell/module/Az.Automation/Get-AzAutomationDscNodeReport) cmdlet.

```powershell
# Get the ID of the DSC node
$node = Get-AzAutomationDscNode -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -Name 'DscVm'

# Get an array of status reports for the DSC node
$reports = Get-AzAutomationDscNodeReport -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount' -NodeId $node.Id

# Display the most recent report
$reports[0]
```

## Next steps

- To get started, see [Get started with Azure Automation State Configuration](automation-dsc-getting-started.md).
- To learn how to enable nodes, see [Enable Azure Automation State Configuration](automation-dsc-onboarding.md).
- To learn about compiling DSC configurations so that you can assign them to target nodes, see [Compile DSC configurations in Azure Automation State Configuration](automation-dsc-compile.md).
- To see an example of using Azure Automation State Configuration in a continuous deployment pipeline, see [Set up continuous deployment with Chocolatey](automation-dsc-cd-chocolatey.md).
- For pricing information, see [Azure Automation State Configuration pricing](https://azure.microsoft.com/pricing/details/automation/).
- For a PowerShell cmdlet reference, see [Az.Automation](/powershell/module/az.automation).
