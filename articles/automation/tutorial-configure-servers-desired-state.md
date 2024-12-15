---
title: Configure machines to a desired state in Azure Automation
description: This article tells how to configure machines to a desired state using Azure Automation State Configuration.
services: automation
ms.subservice: desired-state-config
ms.topic: tutorial
ms.date: 10/22/2024
ms.custom: devx-track-azurepowershell
ms.service: azure-automation
---

# Configure machines to a desired state

[!INCLUDE [azure-automation-dsc-end-of-life](~/includes/dsc-automation/azure-automation-dsc-end-of-life.md)]

[!INCLUDE [automation-dsc-linux-retirement-announcement](./includes/automation-dsc-linux-retirement-announcement.md)]

Azure Automation State Configuration allows you to specify configurations for your servers and
ensure that those servers are in the specified state over time.

> [!div class="checklist"]
> - Onboard a VM to be managed by Azure Automation DSC
> - Upload a configuration to Azure Automation
> - Compile a configuration into a node configuration
> - Assign a node configuration to a managed node
> - Check the compliance status of a managed node

For this tutorial, we use a simple [DSC configuration][04] that ensures that IIS is installed on the
VM.

## Prerequisites

- An Azure Automation account. To learn more about an Automation account and its requirements, see
  [Automation Account authentication overview][01].
- An Azure Resource Manager VM (not classic) running Windows Server 2008 R2 or later. For
  instructions on creating a VM, see
  [Create your first Windows virtual machine in the Azure portal][02].
- Azure PowerShell module version 3.6 or later. Run `Get-Module -ListAvailable Az` to find the
  version. If you need to upgrade, see [Install Azure PowerShell module][03].
- Familiarity with Desired State Configuration (DSC). For information about DSC, see
  [Windows PowerShell Desired State Configuration Overview][06].

## Support for partial configurations

Azure Automation State Configuration supports the use of [partial configurations][08]. In this
scenario, DSC is configured to manage multiple configurations independently, and each configuration
is retrieved from Azure Automation. However, only one configuration can be assigned to a node per
automation account. This means if you're using two configurations for a node you need two Automation
accounts.

For details about how to register a partial configuration from a pull service, see the documentation
for [partial configurations][09].

For more information about how teams can work together to collaboratively manage servers using
configuration as code, see [Understanding DSC's role in a CI/CD Pipeline][07].

## Sign in to Azure

Sign in to your Azure subscription with the [Connect-AzAccount][10] cmdlet and follow the on-screen
directions.

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
> In more advanced scenarios where you require multiple modules to be imported that provide DSC
> Resources, make sure each module has a unique `Import-DscResource` line in your configuration.

Call the [Import-AzAutomationDscConfiguration][13] cmdlet to upload the configuration into your
Automation account.

```powershell
$importAzAutomationDscConfigurationSplat = @{
    SourcePath = 'C:\DscConfigs\TestConfig.ps1'
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    Published = $true
}
Import-AzAutomationDscConfiguration @importAzAutomationDscConfigurationSplat
```

## Compile a configuration into a node configuration

A DSC configuration must be compiled into a node configuration before it can be assigned to a node.
See [DSC configurations][04].

Call the [Start-AzAutomationDscCompilationJob][15] cmdlet to compile the `TestConfig` configuration
into a node configuration named `TestConfig.WebServer` in your Automation account.

```powershell
$startAzAutomationDscCompilationJobSplat = @{
    ConfigurationName = 'TestConfig'
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
}
Start-AzAutomationDscCompilationJob @startAzAutomationDscCompilationJobSplat
```

## Register a VM to be managed by State Configuration

You can use Azure Automation State Configuration to manage Azure VMs (both Classic and Resource
Manager), on-premises VMs, Linux machines, AWS VMs, and on-premises physical machines. In this
article, we cover how to register only Azure Resource Manager VMs. For information about registering
other types of machines, see
[Onboarding machines for management by Azure Automation State Configuration][20].

Call the [Register-AzAutomationDscNode][14] cmdlet to register your VM with Azure Automation State
Configuration as a managed node.

```powershell
$registerAzAutomationDscNodeSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    AzureVMName = 'DscVm'
}
Register-AzAutomationDscNode @registerAzAutomationDscNodeSplat
```

### Specify configuration mode settings

Use the [Register-AzAutomationDscNode][16] cmdlet to register a VM as a managed node and specify
configuration properties. For example, you can specify that the state of the machine is to be
applied only once by specifying `ApplyOnly` as the value of the `ConfigurationMode` property. State
Configuration doesn't try to apply the configuration after the initial check.

```powershell
$registerAzAutomationDscNodeSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    AzureVMName = 'DscVm'
    ConfigurationMode = 'ApplyOnly'
}
Register-AzAutomationDscNode @registerAzAutomationDscNodeSplat```

You can also specify how often DSC checks the configuration state by using the
`ConfigurationModeFrequencyMins` property. For more information about DSC configuration settings,
see [Configuring the Local Configuration Manager][05].

```powershell
# Run a DSC check every 60 minutes
$registerAzAutomationDscNodeSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    AzureVMName = 'DscVm'
    ConfigurationModeFrequencyMins = 60
}
Register-AzAutomationDscNode @registerAzAutomationDscNodeSplat```

## Assign a node configuration to a managed node

Now we can assign the compiled node configuration to the VM we want to configure.

```powershell
# Get the ID of the DSC node
$getAzAutomationDscNodeSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    Name = 'DscVm'
}
$node = Get-AzAutomationDscNode @getAzAutomationDscNodeSplat

# Assign the node configuration to the DSC node
$setAzAutomationDscNodeSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    NodeConfigurationName = 'TestConfig.WebServer'
    NodeId = $node.Id
}
Set-AzAutomationDscNode @setAzAutomationDscNodeSplat
```

This assigns the node configuration named `TestConfig.WebServer` to the registered DSC node `DscVm`.
By default, the DSC node is checked for compliance with the node configuration every 30 minutes. For
information about how to change the compliance check interval, see
[Configuring the Local Configuration Manager][05].

## Check the compliance status of a managed node

You can get reports on the compliance status of a managed node using the
[Get-AzAutomationDscNodeReport][12] cmdlet.

```powershell
# Get the ID of the DSC node
$getAzAutomationDscNodeSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    Name = 'DscVm'
}
$node = Get-AzAutomationDscNode @getAzAutomationDscNodeSplat

# Get an array of status reports for the DSC node
$getAzAutomationDscNodeReportSplat = @{
    ResourceGroupName = 'MyResourceGroup'
    AutomationAccountName = 'myAutomationAccount'
    NodeId = $node.Id
}
$reports = Get-AzAutomationDscNodeReport @getAzAutomationDscNodeReportSplat

# Display the most recent report
$reports[0]
```

## Next steps

- To get started, see [Get started with Azure Automation State Configuration][19].
- To learn how to enable nodes, see [Enable Azure Automation State Configuration][20].
- To learn about compiling DSC configurations so that you can assign them to target nodes, see
  [Compile DSC configurations in Azure Automation State Configuration][18].
- To see an example of using Azure Automation State Configuration in a continuous deployment
  pipeline, see [Setup continuous deployment with Chocolatey][17].
- For pricing information, see [Azure Automation State Configuration pricing][21].
- For a PowerShell cmdlet reference, see [Az.Automation][11].

<!-- link references -->
[01]: ./automation-security-overview.md
[02]: /azure/virtual-machines/windows/quick-create-portal
[03]: /powershell/azure/azurerm/install-azurerm-ps
[04]: /powershell/dsc/configurations/configurations
[05]: /powershell/dsc/managing-nodes/metaConfig
[06]: /powershell/dsc/overview
[07]: /powershell/dsc/overview/authoringadvanced
[08]: /powershell/dsc/pull-server/partialconfigs
[09]: /powershell/dsc/pull-server/partialconfigs#partial-configurations-in-pull-mode
[10]: /powershell/module/Az.Accounts/Connect-AzAccount
[11]: /powershell/module/az.automation
[12]: /powershell/module/Az.Automation/Get-AzAutomationDscNodeReport
[13]: /powershell/module/Az.Automation/Import-AzAutomationDscConfiguration
[14]: /powershell/module/Az.Automation/Register-AzAutomationDscNode
[15]: /powershell/module/Az.Automation/Start-AzAutomationDscCompilationJob
[16]: /powershell/module/azurerm.automation/register-azurermautomationdscnode
[17]: automation-dsc-cd-chocolatey.md
[18]: automation-dsc-compile.md
[19]: automation-dsc-getting-started.md
[20]: automation-dsc-onboarding.md
[21]: https://azure.microsoft.com/pricing/details/automation/
