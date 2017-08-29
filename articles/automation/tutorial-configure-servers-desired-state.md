---
title: Configure servers to a desired state and manage drift | Microsoft Docs
description: Tutorial - Manage server configurations with Azure Automation DSC
services: automation
documentationcenter: automation
author: eslesar
manager: carmonm
editor: tysonn
tags: azure-service-management

ms.assetid: 
ms.service: automation
ms.devlang: powershell
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/25/2017
ms.author: eslesar
ms.custom: mvc
---

# Configure servers to a desired state and manage drift

Azure Automation Desired State Configuration (DSC) allows you to specify configurations for your servers and ensure that those servers are in the specified state over time.



> [!div class="checklist"]
> * Onboard a VM to be managed by Azure Automation DSC
> * Upload a configuration to Azure Automation
> * Compile a configuration into a node configuration
> * Assign a node configuration to a managed node
> * Check the compliance status of a managed node

## Prerequisites

To complete this tutorial, you will need:

* An Azure Automation account. For instructions on creating an Azure Automation Run As account, see [Azure Run As Account](automation-sec-configure-azure-runas-account.md).
* An Azure Resource Manager VM (not Classic) running Windows Server 2008 R2 or later. For instructions on creating a VM, see 
  [Create your first Windows virtual machine in the Azure portal](../virtual-machines/virtual-machines-windows-hero-tutorial.md)
* Azure PowerShell module version 3.6 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Log in to Azure

Log in to your Azure subscription with the `Login-AzureRmAccount` command and follow the on-screen directions.

```powershell
Login-AzureRmAccount
```

## Register a VM to be managed by DSC

Call the `Register-AzureRmAutomationDscNode` cmdlet to register your VM with Azure Automation DSC.

```powershell
Register-AzureRMautomationDscNode -AutomationAccountName "myAutomationAccount" -AzureVMName "DscVm" -ResourceGroupName "MyResourceGroup"
```

## Create and upload a configuration to Azure Automation

For this tutorial, we will use a simple DSC configuration that ensures that IIS is installed on the VM.

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

Call the `Start-AzureRmAutomationDscCompilationJob` cmdlet to compile the `TestConfig` configuration into a node configuration:

```powershell
Start-AzureRmAutomationDscCompilationJob -ConfigurationName 'TestConfig' -ResourceGroupName 'MyResourceGroup' -AutomationAccountName 'myAutomationAccount'
```

## Assign a node configuration to a managed node

## Check the compliance status of a managed node