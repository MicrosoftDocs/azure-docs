---
title: Enable VM extension using Azure PowerShell
description: This article describes how to deploy virtual machine extensions to Azure Arc enabled servers running in hybrid cloud environments using Azure PowerShell.
ms.date: 10/19/2020
ms.topic: conceptual
---

# Enable Azure VM extensions using Azure PowerShell

This article shows you how to deploy and uninstall Azure VM extensions, supported by Azure Arc enabled servers, to a Linux or Windows hybrid machine using Azure PowerShell.

## Prerequisites

- A computer with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](/powershell/azure/).

Before using Azure PowerShell to manage VM extensions on your hybrid server managed by Arc enabled servers, you need to install the `Az.ConnectedMachine` module. Run the following command on your Arc enabled server:

`Install-Module -Name Az.ConnectedMachine`.

When the installation completes, the following message is returned:

`The installed extension `Az.ConnectedMachine` is experimental and not covered by customer support. Please use with discretion.`

## Enable extension

To enable a VM extension on your Arc enabled server, use [New-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/new-azconnectedmachineextension) with the `-Name`, `-ResourceGroupName`, `-MachineName`, `-Location`, `-Publisher`, -`ExtensionType`, and `-Settings` parameters.

The following example enables the Log Analytics VM extension on a Arc enabled Linux server:

```powershell
PS C:\> $Setting = @{ "workspaceId" = "workspaceId" }
PS C:\> $protectedSetting = @{ "workspaceKey" = "workspaceKey" }
PS C:\> New-AzConnectedMachine -Name OMSLinuxAgent -ResourceGroupName "myResourceGroup" -MachineName "myMachine" -Location "eastus" -Publisher "Microsoft.EnterpriseCloud.Monitoring" -TypeHandlerVersion "1.10" -Settings $Setting -ProtectedSetting $protectedSetting -ExtensionType OmsAgentforLinux"
```

The following example enables the Custom Script Extension on an Arc enabled server:

```powershell
PS C:\> $Setting = @{ "commandToExecute" = "powershell.exe -c Get-Process" }
PS C:\> New-AzConnectedMachine -Name custom -ResourceGroupName myResourceGroup -MachineName myMachineName -Location eastus -Publisher "Microsoft.Compute" -TypeHandlerVersion 1.10 -Settings $Setting -ExtensionType CustomScriptExtension
```

## List extensions installed

To get a list of the VM extensions on your Arc enabled server, use [Get-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/get-azconnectedmachineextension) with the `-MachineName` and `-ResourceGroupName` parameters.

Example:

```powershell
Get-AzConnectedMachineExtension -ResourceGroupName myResourceGroup -MachineName myMachineName

Name    Location  PropertiesType        ProvisioningState
----    --------  --------------        -----------------
custom  westus2   CustomScriptExtension Succeeded
custom  westus2   CustomScriptExtension Succeeded
dsc     westus2   DSC                   Succeeded
```

## Remove an installed extension

To remove an installed VM extension on your Arc enabled server, use [Remove-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/remove-azconnectedmachineextension) with the `-Name`, `-MachineName` and `-ResourceGroupName` parameters.

For example, to remove the Log Analytics VM extension for Linux, run the following command:

```powershell
Remove-AzConnectedMachineExtension -MachineName myMachineName -ResourceGroupName myResourceGroup -Name OmsAgentforLinux
```

## Next steps

- You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), from the [Azure portal](manage-vm-extensions-portal.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

- Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).
