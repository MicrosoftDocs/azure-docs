---
title: Enable VM extension using Azure PowerShell
description: This article describes how to deploy virtual machine extensions to Azure Arc-enabled servers running in hybrid cloud environments using Azure PowerShell.
ms.date: 03/30/2022
ms.topic: conceptual 
ms.custom: devx-track-azurepowershell
---

# Enable Azure VM extensions using Azure PowerShell

This article shows you how to deploy, update, and uninstall Azure VM extensions, supported by Azure Arc-enabled servers, to a Linux or Windows hybrid machine using Azure PowerShell.

> [!NOTE]
> Azure Arc-enabled servers does not support deploying and managing VM extensions to Azure virtual machines. For Azure VMs, see the following [VM extension overview](../../virtual-machines/extensions/overview.md) article.

## Prerequisites

- A computer with Azure PowerShell. For instructions, see [Install and configure Azure PowerShell](/powershell/azure/).

Before using Azure PowerShell to manage VM extensions on your hybrid server managed by Azure Arc-enabled servers, you need to install the `Az.ConnectedMachine` module. These management operations can be performed from your workstation, you don't need to run them on the Azure Arc-enabled server.

Run the following command on your Azure Arc-enabled server:

`Install-Module -Name Az.ConnectedMachine`.

When the installation completes, the following message is returned:

`The installed extension 'Az.ConnectedMachine' is experimental and not covered by customer support. Please use with discretion.`

## Enable extension

To enable a VM extension on your Azure Arc-enabled server, use [New-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/new-azconnectedmachineextension) with the `-Name`, `-ResourceGroupName`, `-MachineName`, `-Location`, `-Publisher`, -`ExtensionType`, and `-Settings` parameters.

The following example enables the Log Analytics VM extension on a Azure Arc-enabled Linux server:

```powershell
$Setting = @{ "workspaceId" = "workspaceId" }
$protectedSetting = @{ "workspaceKey" = "workspaceKey" }
New-AzConnectedMachineExtension -Name OMSLinuxAgent -ResourceGroupName "myResourceGroup" -MachineName "myMachineName" -Location "regionName" -Publisher "Microsoft.EnterpriseCloud.Monitoring" -Settings $Setting -ProtectedSetting $protectedSetting -ExtensionType "OmsAgentForLinux"
```

To enable the Log Analytics VM extension on an Azure Arc-enabled Windows server, change the value for the `-ExtensionType` parameter to `"MicrosoftMonitoringAgent"` in the previous example.

The following example enables the Custom Script Extension on an Azure Arc-enabled server:

```powershell
$Setting = @{ "commandToExecute" = "powershell.exe -c Get-Process" }
New-AzConnectedMachineExtension -Name "custom" -ResourceGroupName "myResourceGroup" -MachineName "myMachineName" -Location "regionName" -Publisher "Microsoft.Compute"  -Settings $Setting -ExtensionType CustomScriptExtension
```

The following example enables the Microsoft Antimalware extension on an Azure Arc-enabled Windows server:

```powershell
$Setting = @{ "AntimalwareEnabled" = $true }
New-AzConnectedMachineExtension -Name "IaaSAntimalware" -ResourceGroupName "myResourceGroup" -MachineName "myMachineName" -Location "regionName" -Publisher "Microsoft.Azure.Security" -Settings $Setting -ExtensionType "IaaSAntimalware"
```

### Key Vault VM extension

> [!WARNING]
> PowerShell clients often add `\` to `"` in the settings.json which will cause akvvm_service fails with error: `[CertificateManagementConfiguration] Failed to parse the configuration settings with:not an object.`

The following example enables the Key Vault VM extension on an Azure Arc-enabled server:

```powershell
# Build settings
    $settings = @{
      secretsManagementSettings = @{
       observedCertificates = @(
        "observedCert1"
       )
      certificateStoreLocation = "myMachineName" # For Linux use "/var/lib/waagent/Microsoft.Azure.KeyVault.Store/"
      certificateStore = "myCertificateStoreName"
      pollingIntervalInS = "pollingInterval"
      }
    authenticationSettings = @{
     msiEndpoint = "http://localhost:40342/metadata/identity"
     }
    }

    $resourceGroup = "resourceGroupName"
    $machineName = "myMachineName"
    $location = "regionName"

    # Start the deployment
    New-AzConnectedMachineExtension -ResourceGroupName $resourceGroup -Location $location -MachineName $machineName -Name "KeyVaultForWindows or KeyVaultforLinux" -Publisher "Microsoft.Azure.KeyVault" -ExtensionType "KeyVaultforWindows or KeyVaultforLinux" -Setting $settings
```

### Datadog VM extension

The following example enables the Datadog VM extension on an Azure Arc-enabled server:

```azurepowershell
$resourceGroup = "resourceGroupName"
$machineName = "machineName"
$location = "machineRegion"
$osType = "Windows" # change to Linux if appropriate
$settings = @{
    # change to your preferred Datadog site
    site = "us3.datadoghq.com"
}
$protectedSettings = @{
    # change to your Datadog API key
    api_key = "APIKEY"
}

New-AzConnectedMachineExtension -ResourceGroupName $resourceGroup -Location $location -MachineName $machineName -Name "Datadog$($osType)Agent" -Publisher "Datadog.Agent" -ExtensionType "Datadog$($osType)Agent" -Setting $settings -ProtectedSetting $protectedSettings
```

## List extensions installed

To get a list of the VM extensions on your Azure Arc-enabled server, use [Get-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/get-azconnectedmachineextension) with the `-MachineName` and `-ResourceGroupName` parameters.

Example:

```powershell
Get-AzConnectedMachineExtension -ResourceGroupName myResourceGroup -MachineName myMachineName

Name    Location  PropertiesType        ProvisioningState
----    --------  --------------        -----------------
custom  westus2   CustomScriptExtension Succeeded
```

## Update extension configuration

To reconfigure an installed extension, you can use the [Update-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/update-azconnectedmachineextension) cmdlet with the `-Name`, `-MachineName`, `-ResourceGroupName`, and `-Settings` parameters.

Refer to the reference article for the cmdlet to understand the different methods to provide the changes you want to the extension.

## Upgrade extension

When a new version of a supported VM extension is released, you can upgrade it to that latest release. To upgrade a VM extension, use [Update-AzConnectedExtension](/powershell/module/az.connectedmachine/update-azconnectedextension) with the `-MachineName`, `-ResourceGroupName`, and `-ExtensionTarget` parameters.

For the `-ExtensionTarget` parameter, you need to specify the extension and the latest version available. To find out what the latest version available is, you can get this information from the **Extensions** page for the selected Arc-enabled server in the Azure portal, or by running [Get-AzVMExtensionImage](/powershell/module/az.compute/get-azvmextensionimage). You may specify multiple extensions in a single upgrade request by providing a comma-separated list of extensions, defined by their publisher and type (separated by a period) and the target version for each extension, as shown in the example below.

To upgrade the Log Analytics agent extension for Windows that has a newer version available, run the following command:

```powershell
Update-AzConnectedExtension -MachineName "myMachineName" -ResourceGroupName "myResourceGroup" -ExtensionTarget '{\"Microsoft.EnterpriseCloud.Monitoring.MicrosoftMonitoringAgent\":{\"targetVersion\":\"1.0.18053.0\"}}'
```

You can review the version of installed VM extensions at any time by running the command [Get-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/get-azconnectedmachineextension). The `TypeHandlerVersion` property value represents the version of the extension.

## Remove extensions

To remove an installed VM extension on your Azure Arc-enabled server, use [Remove-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/remove-azconnectedmachineextension) with the `-Name`, `-MachineName` and `-ResourceGroupName` parameters.

For example, to remove the Log Analytics VM extension for Linux, run the following command:

```powershell
Remove-AzConnectedMachineExtension -MachineName myMachineName -ResourceGroupName myResourceGroup -Name OmsAgentforLinux
```

## Next steps

- You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), from the [Azure portal](manage-vm-extensions-portal.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

- Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).
