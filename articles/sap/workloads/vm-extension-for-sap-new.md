---
title: New version of Azure VM extension for SAP solutions | Microsoft Docs
description: Learn how to deploy the new VM Extension for SAP.
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: OliverDoll
manager: juergent
editor: ''
tags: azure-resource-manager
ms.custom: devx-track-azurepowershell, devx-track-azurecli
keywords: ''
ms.assetid: 1c4f1951-3613-4a5a-a0af-36b85750c84e
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 06/22/2021
ms.author: oldoll
---

# New Version of Azure VM extension for SAP solutions 
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[1928533]:https://launchpad.support.sap.com/#/notes/1928533
[2015553]:https://launchpad.support.sap.com/#/notes/2015553
[std-extension]:vm-extension-for-sap-standard.md (Standard Version of Azure VM extension for SAP solutions)
[configure-windows]:vm-extension-for-sap-new.md#a876ee7b-43b4-4782-aa5f-73753b6af0ea (Configure the New Azure VM extension for SAP solutions with PowerShell)
[troubleshoot-windows]:vm-extension-for-sap-new.md#dee9099b-7b8a-4cdd-86a2-3f6ee964266f (Troubleshooting for Windows)
[troubleshoot-linux]:vm-extension-for-sap-new.md#02783aa4-5443-43f5-bc11-7af19ebf0c36 (Troubleshooting for Linux)
[deployment-guide-4.1]:vm-extension-for-sap-new.md#604bcec2-8b6e-48d2-a944-61b0f5dee2f7 (Deploying Azure PowerShell cmdlets)
[azure-cli-2]:/cli/azure/install-azure-cli
[configure-linux]:vm-extension-for-sap-new.md#fa4428b9-bed6-459a-9dfb-74cc27454481 (Configure the Azure VM extension for SAP solutions with Azure CLI)
[configure-windows]:vm-extension-for-sap-new.md#a876ee7b-43b4-4782-aa5f-73753b6af0ea (Configure the Azure VM extension for SAP solutions with PowerShell)
[health-check]:vm-extension-for-sap-new.md#e2d592ff-b4ea-4a53-a91a-e5521edb6cd1 (Health checks)
[1031096]:https://launchpad.support.sap.com/#/notes/1031096
[readiness-check]:vm-extension-for-sap-new.md#5774c1db-1d3c-4b34-8448-3afd0b0f18ab (Readiness check)

## Prerequisites

> [!NOTE]
> General Support Statement:
> Support for the Azure Extension for SAP is provided through SAP support channels.
> If you need assistance with the Azure VM extension for SAP solutions, please open a support case with SAP Support
  
> [!NOTE]
> Make sure to uninstall the VM extension before switching between the standard and the new version of the Azure Extension for SAP.

> [!NOTE]
> There are two versions of the VM extension. This article covers the **new** version of the Azure VM extension for SAP. For guidance on how to install the standard version, see [Standard Version of Azure VM extension for SAP solutions][std-extension].

* Make sure to use SAP Host Agent 7.21 PL 47 or higher.
* Make sure the virtual machine on which the extension is enabled has access to management.azure.com.

### <a name="604bcec2-8b6e-48d2-a944-61b0f5dee2f7"></a>Deploy Azure PowerShell cmdlets

Follow the steps described in the article [Install the Azure PowerShell module](/powershell/azure/install-azure-powershell)

Check frequently for updates to the PowerShell cmdlets, which usually are updated monthly. Follow the steps described in [this](/powershell/azure/install-az-ps#update-the-azure-powershell-module) article. Unless stated otherwise in SAP Note [1928533] or SAP Note [2015553], we recommend that you work with the latest version of Azure PowerShell cmdlets.

To check the version of the Azure PowerShell cmdlets that are installed on your computer, run this PowerShell command:

```powershell
(Get-Module Az.Compute).Version
```

### <a name="1ded9453-1330-442a-86ea-e0fd8ae8cab3"></a>Deploy Azure CLI

Follow the steps described in the article [Install the Azure CLI](/cli/azure/install-azure-cli)

Check frequently for updates to Azure CLI, which usually is updated monthly.

To check the version of Azure CLI that is installed on your computer, run this command:

```console
az --version
```
 
## <a name="a876ee7b-43b4-4782-aa5f-73753b6af0ea"></a>Configure the Azure VM extension for SAP solutions with PowerShell
 
The new VM Extension for SAP uses a managed identity that's assigned to the VM to access monitoring and configuration data of the VM. To install the new Azure Extension for SAP by using PowerShell, you first have to assign such an identity to the VM and grant that identity access to all resources that are in use by that VM, for example, disks and network interfaces.

> [!NOTE]
> The following steps require Owner privileges over the resource group or individual resources (virtual machine, data disks, and network interfaces)

1. Make sure to use SAP Host Agent 7.21 PL 47 or higher.
1. Make sure to uninstall the standard version of the VM Extension for SAP. It is not supported to install both versions of the VM Extension for SAP on the same virtual machine.
1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet (at least 4.3.0). For more information, see [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
1. Run the following PowerShell cmdlet.
    For a list of available environments, run cmdlet `Get-AzEnvironment`. If you want to use global Azure, your environment is **AzureCloud**. For Microsoft Azure operated by 21Vianet, select **AzureChinaCloud**.

    The VM Extension for SAP supports configuring a proxy that the extension should use to connect to external resources, for example the Azure Resource Manager API. Please use parameter -ProxyURI to set the proxy.

    ```powershell
    $env = Get-AzEnvironment -Name <name of the environment>
    Connect-AzAccount -Environment $env
    Set-AzContext -SubscriptionName <subscription name>

    Set-AzVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name> -InstallNewExtension
    ```

1. Restart SAP Host Agent

    Log on to the virtual machine on which you enabled the VM Extension for SAP and restart the SAP Host Agent if it was already installed. SAP Host Agent does not use the VM Extension until it is restarted. It currently cannot detect that an extension was installed after it was started.

## <a name="fa4428b9-bed6-459a-9dfb-74cc27454481"></a>Configure the Azure VM extension for SAP solutions with Azure CLI
 
The new VM Extension for SAP uses a managed identity that is assigned to the VM to access monitoring and configuration data of the VM.

> [!NOTE]
> The following steps require Owner privileges over the resource group or individual resources (virtual machine, data disks, and so on)

1. Ensure that you use SAP Host Agent 7.21 PL 47 or later.
1. Ensure that you uninstall the current version of the VM Extension for SAP. You can't install both versions of the VM Extension for SAP on the same VM. 
1. Install the latest version of [Azure CLI 2.0][azure-cli-2] (version 2.19.1 or later).
1. Sign in with your Azure account:

   ```azurecli
   az login
   ```

1. Install the Azure CLI AEM Extension. Ensure that you use version 0.2.2 or later.
  
   ```azurecli
   az extension add --name aem
   ```
  
1. Enable the new extension:
  
   The VM Extension for SAP supports configuring a proxy that the extension should use to connect to external resources, for example the Azure Resource Manager API. Please use parameter --proxy-uri to set the proxy.

   ```azurecli
   az vm aem set -g <resource-group-name> -n <vm name> --install-new-extension
   ```
 
 1. Restart SAP Host Agent

    Log on to the virtual machine on which you enabled the VM Extension for SAP and restart the SAP Host Agent if it was already installed. SAP Host Agent does not use the VM Extension until it is restarted. It currently cannot detect that an extension was installed after it was started.

## <a name="ba74712c-4b1f-44c2-9412-de101dbb1ccc"></a>Manually configure the Azure VM extension for SAP solutions

If you want to use Azure Resource Manager, Terraform or other tools to deploy the VM Extension for SAP, you can also deploy the VM Extension for SAP manually i.e. without using the dedicated PowerShell or Azure CLI commands.

Before deploying the VM Extension for SAP, please make sure to assign a user or system assigned managed identity to the virtual machine. For more information, read the following guides:

* [Configure managed identities for Azure resources on a VM using the Azure portal](../../active-directory/managed-identities-azure-resources/qs-configure-portal-windows-vm.md)
* [Configure managed identities for Azure resources on an Azure VM using Azure CLI](../../active-directory/managed-identities-azure-resources/qs-configure-cli-windows-vm.md)
* [Configure managed identities for Azure resources on an Azure VM using PowerShell](../../active-directory/managed-identities-azure-resources/qs-configure-powershell-windows-vm.md)
* [Configure managed identities for Azure resources on an Azure VM using templates](../../active-directory/managed-identities-azure-resources/qs-configure-template-windows-vm.md)
* [Terraform VM Identity](https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/linux_virtual_machine#identity)

After assigning an identity to the virtual machine, give the VM read access to either the resource group or the individual resources associated to the virtual machine (VM, Network Interfaces, OS Disks and Data Disks). It is recommended to use the built-in Reader role to grant the access to these resources. You can also grant this access by adding the VM identity to a Microsoft Entra group that already has read access to the required resources. It is then no longer needed to have Owner privileges when deploying the VM Extension for SAP if you use a user assigned identity that already has the required permissions.

There are different ways how to deploy the VM Extension for SAP manually. Please find a few examples in the next chapters.

The extension currently supports the following configuration keys. In the example below, the msi_res_id is shown.

* msi_res_id: ID of the user assigned identity the extension should use to get the required information about the VM and its resources
* proxy: URL of the proxy the extension should use to connect to the internet, for example to retrieve information about the virtual machine and its resources.

### Deploy manually with Azure PowerShell

The following code contains four examples. It shows how to deploy the extension on Windows and Linux, using a system or user assigned identity. Make sure to replace the name of the resource group, the location and VM name in the example.

``` powershell
# Windows VM - user assigned identity
Set-AzVMExtension -Publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" -ExtensionType "MonitorX64Windows" -ResourceGroupName "<rg name>" -VMName "<vm name>" `
   -Name "MonitorX64Windows" -TypeHandlerVersion "1.0" -Location "<location>" -SettingString '{"cfg":[{"key":"msi_res_id","value":"<user assigned resource id>"}]}'

# Windows VM - system assigned identity
Set-AzVMExtension -Publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" -ExtensionType "MonitorX64Windows" -ResourceGroupName "<rg name>" -VMName "<vm name>" `
   -Name "MonitorX64Windows" -TypeHandlerVersion "1.0" -Location "<location>" -SettingString '{"cfg":[]}'

# Linux VM - user assigned identity
Set-AzVMExtension -Publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" -ExtensionType "MonitorX64Linux" -ResourceGroupName "<rg name>" -VMName "<vm name>" `
   -Name "MonitorX64Linux" -TypeHandlerVersion "1.0" -Location "<location>" -SettingString '{"cfg":[{"key":"msi_res_id","value":"<user assigned resource id>"}]}'

# Linux VM - system assigned identity
Set-AzVMExtension -Publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" -ExtensionType "MonitorX64Linux" -ResourceGroupName "<rg name>" -VMName "<vm name>" `
   -Name "MonitorX64Linux" -TypeHandlerVersion "1.0" -Location "<location>" -SettingString '{"cfg":[]}'
```

### Deploy manually with Azure CLI

The following code contains four examples. It shows how to deploy the extension on Windows and Linux, using a system or user assigned identity. Make sure to replace the name of the resource group, the location and VM name in the example.

``` bash
# Windows VM - user assigned identity
az vm extension set --publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" --name "MonitorX64Windows" --resource-group "<rg name>" --vm-name "<vm name>" \
   --extension-instance-name "MonitorX64Windows" --settings '{"cfg":[{"key":"msi_res_id","value":"<user assigned resource id>"}]}'

# Windows VM - system assigned identity
az vm extension set --publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" --name "MonitorX64Windows" --resource-group "<rg name>" --vm-name "<vm name>" \
   --extension-instance-name "MonitorX64Windows" --settings '{"cfg":[]}'
   
# Linux VM - user assigned identity
az vm extension set --publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" --name "MonitorX64Linux" --resource-group "<rg name>" --vm-name "<vm name>" \
   --extension-instance-name "MonitorX64Linux" --settings '{"cfg":[{"key":"msi_res_id","value":"<user assigned resource id>"}]}'

# Linux VM - system assigned identity
az vm extension set --publisher "Microsoft.AzureCAT.AzureEnhancedMonitoring" --name "MonitorX64Linux" --resource-group "<rg name>" --vm-name "<vm name>" \
   --extension-instance-name "MonitorX64Linux" --settings '{"cfg":[]}'
```

### Deploy manually with Terraform

The following manifest contains four examples. It shows how to deploy the extension on Windows and Linux, using a system or user assigned identity. Make sure to replace the ID of the VM and ID of the user assigned identity in the example.

```terraform

# Windows VM - user assigned identity

resource "azurerm_virtual_machine_extension" "example" {
  name                 = "MonitorX64Windows"
  virtual_machine_id   = "<vm id>"
  publisher            = "Microsoft.AzureCAT.AzureEnhancedMonitoring"
  type                 = "MonitorX64Windows"
  type_handler_version = "1.0"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
{
    "cfg":[
        {
            "key":"msi_res_id",
            "value":"<user assigned resource id>"
        }
    ]
}
SETTINGS
}

# Windows VM - system assigned identity

resource "azurerm_virtual_machine_extension" "example" {
  name                 = "MonitorX64Windows"
  virtual_machine_id   = "<vm id>"
  publisher            = "Microsoft.AzureCAT.AzureEnhancedMonitoring"
  type                 = "MonitorX64Windows"
  type_handler_version = "1.0"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
{
    "cfg":[
    ]
}
SETTINGS
}

# Linux VM - user assigned identity

resource "azurerm_virtual_machine_extension" "example" {
  name                 = "MonitorX64Linux"
  virtual_machine_id   = "<vm id>"
  publisher            = "Microsoft.AzureCAT.AzureEnhancedMonitoring"
  type                 = "MonitorX64Linux"
  type_handler_version = "1.0"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
{
    "cfg":[
        {
            "key":"msi_res_id",
            "value":"<user assigned resource id>"
        }
    ]
}
SETTINGS
}

# Linux VM - system assigned identity

resource "azurerm_virtual_machine_extension" "example" {
  name                 = "MonitorX64Linux"
  virtual_machine_id   = "<vm id>"
  publisher            = "Microsoft.AzureCAT.AzureEnhancedMonitoring"
  type                 = "MonitorX64Linux"
  type_handler_version = "1.0"
  auto_upgrade_minor_version = true

  settings = <<SETTINGS
{
    "cfg":[
    ]
}
SETTINGS
}
```

### Versions of the VM Extension for SAP

If you want to disable automatic updates for the VM extension or want to deploy a specific version of the extension, you can retrieve the available versions with Azure CLI or Azure PowerShell.

**Azure PowerShell**
```powershell
# Windows
Get-AzVMExtensionImage -Location westeurope -PublisherName Microsoft.AzureCAT.AzureEnhancedMonitoring -Type MonitorX64Windows
# Linux
Get-AzVMExtensionImage -Location westeurope -PublisherName Microsoft.AzureCAT.AzureEnhancedMonitoring -Type MonitorX64Linux
```

**Azure CLI**
```azurecli
# Windows
az vm extension image list --location westeurope --publisher Microsoft.AzureCAT.AzureEnhancedMonitoring --name MonitorX64Windows
# Linux
az vm extension image list --location westeurope --publisher Microsoft.AzureCAT.AzureEnhancedMonitoring --name MonitorX64Linux
```
 
## <a name="5774c1db-1d3c-4b34-8448-3afd0b0f18ab"></a>Readiness check

This check makes sure that all performance metrics that appear inside your SAP application are provided by the underlying Azure Extension for SAP.

### Run the readiness check on a Windows VM

1. Sign in to the Azure virtual machine (using an admin account is not necessary).
1. Open a web browser and navigate to `http://127.0.0.1:11812/azure4sap/metrics`.
1. The browser should display or download an XML file that contains the monitoring data of your virtual machine. If that is not the case, make sure that the Azure Extension for SAP is installed.
1. Check the content of the XML file. The XML file that you can access at `http://127.0.0.1:11812/azure4sap/metrics` contains all populated Azure performance counters for SAP. It also contains a summary and health indicator of the status of Azure Extension for SAP.
1. Check the value of the **Provider Health Description** element. If the value is not **OK**, follow the instructions in chapter [Health checks][health-check].
 
### Run the readiness check on a Linux VM

1. Connect to the Azure Virtual Machine by using SSH.
1. Check the output of the following command
   ```bash
   curl http://127.0.0.1:11812/azure4sap/metrics
   ```
   **Expected result**: Returns an XML document that contains the monitoring information of the virtual machine, its disks and network interfaces.

If the preceding check was not successful, run these additional checks:

1. Make sure that the waagent is installed and enabled.

   a.  Run `sudo ls -al /var/lib/waagent/`

     **Expected result**: Lists the content of the waagent directory.

   b.  Run `ps -ax | grep waagent`

   **Expected result**: Displays one entry similar to: `python /usr/sbin/waagent -daemon`

1. Make sure that the Azure Extension for SAP is installed and running.

   a.  Run `sudo sh -c 'ls -al /var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-*/'`

   **Expected result**: Lists the content of the Azure Extension for SAP directory.

   b. Run `ps -ax | grep AzureEnhanced`

   **Expected result**: Displays one entry similar to: `/var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-1.0.0.82/AzureEnhancedMonitoring -monitor`

1. Install SAP Host Agent as described in SAP Note [1031096], and check the output of `saposcol`.

   a.  Run `/usr/sap/hostctrl/exe/saposcol -d`

   b.  Run `dump ccm`

   c.  Check whether the **Virtualization_Configuration\Enhanced Monitoring Access** metric is **true**.

If you already have an SAP NetWeaver ABAP application server installed, open transaction ST06 and check whether monitoring is enabled.

If any of these checks fail, and for detailed information about how to redeploy the extension, see [Troubleshooting for Windows][troubleshoot-windows] or [Troubleshooting for Linux][troubleshoot-linux]
 
## <a name="e2d592ff-b4ea-4a53-a91a-e5521edb6cd1"></a>Health checks

If some of the infrastructure data is not delivered correctly as indicated by the tests described in [Readiness check][readiness-check], run the health checks described in this chapter to check whether the Azure infrastructure and the Azure Extension for SAP are configured correctly.

### Health checks using PowerShell

1. Make sure that you have installed the latest version of the Azure PowerShell cmdlet, as described in [Deploying Azure PowerShell cmdlets][deployment-guide-4.1].
1. Run the following PowerShell cmdlet. For a list of available environments, run the cmdlet `Get-AzEnvironment`. To use global Azure, select the **AzureCloud** environment. For Microsoft Azure operated by 21Vianet, select **AzureChinaCloud**.

   ```powershell
   $env = Get-AzEnvironment -Name <name of the environment>
   Connect-AzAccount -Environment $env
   Set-AzContext -SubscriptionName <subscription name>
   Test-AzVMAEMExtension -ResourceGroupName <resource group name> -VMName <virtual machine name>
   ```
1. The script tests the configuration of the virtual machine you selected.

Make sure that every health check result is **OK**. If some checks do not display **OK**, run the update cmdlet as described in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows]. Repeat the checks described in [Readiness check][readiness-check] and this chapter. If the checks still indicate a problem with some or all counters, see [Troubleshooting for Linux][troubleshoot-linux] or [Troubleshooting for Windows][troubleshoot-windows].

### Health checks using Azure CLI

To run the health check for the Azure VM Extension for SAP by using Azure CLI:
 
1. Install [Azure CLI 2.0][azure-cli-2]. Ensure that you use at least version 2.19.1 or later (use the latest version). 
1. Sign in with your Azure account:
   ```azurecli
   az login
   ```

1. Install the Azure CLI AEM Extension. Ensure that you use version 0.2.2 or later.
   ```azurecli
   az extension add --name aem
   ```

1. Verify the installation of the extension: 
   ```azurecli
   az vm aem verify -g <resource-group-name> -n <vm name> 
   ```
The script tests the configuration of the virtual machine you select.

Make sure that every health check result is **OK**. If some checks do not display **OK**, run the update cmdlet as described in [Configure the Azure VM extension for SAP solutions with Azure CLI][configure-linux] or [Configure the Azure VM extension for SAP solutions with PowerShell][configure-windows]. Repeat the checks described in [Readiness check][readiness-check] and this chapter. If the checks still indicate a problem with some or all counters, see [Troubleshooting for Linux][troubleshoot-linux] or [Troubleshooting for Windows][troubleshoot-windows].


## <a name="dee9099b-7b8a-4cdd-86a2-3f6ee964266f"></a>Troubleshooting for Windows
 
### Azure performance counters do not show up at all
The AzureEnhancedMonitoring process collects performance metrics in Azure. If the process is not running in your VM, no performance metrics can be collected.

#### The installation directory of the Azure Extension for SAP is empty
##### Issue
The installation directory
C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\\&lt;version>
is empty.
##### Solution
The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine or install the VM extension again.
 
### Some Azure performance counters are missing

The AzureEnhancedMonitoring Windows process collects performance metrics in Azure. The process gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.

If troubleshooting by using SAP Note [1999351] does not resolve the issue, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine. Please attach the log file C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\\&lt;version>\\logapp.txt to the incident.

## <a name="02783aa4-5443-43f5-bc11-7af19ebf0c36"></a>Troubleshooting for Linux

### Azure performance counters do not show up at all
Performance metrics in Azure are collected by a daemon. If the daemon is not running, no performance metrics can be collected.

#### The installation directory of the Azure Extension for SAP is empty
##### Issue
The directory /var/lib/waagent/ does not have a subdirectory for the Azure Extension for SAP.
##### Solution
The extension is not installed. Determine whether this is a proxy issue (as described earlier). You might need to restart the machine and/or install the VM extension again.
 
### Some Azure performance counters are missing

Performance metrics in Azure are collected by a daemon, which gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.
For a complete and up-to-date list of known issues, see SAP Note [1999351], which has additional troubleshooting information for Azure Extension for SAP.
If troubleshooting by using SAP Note [1999351] does not resolve the issue, install the extension again as described in [Configure the Azure Extension for SAP][configure-windows]. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine. Please attach the log file /var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-&lt;version>/logapp.txt to the incident.


## Azure extension error codes
 
All error IDs have a unique tag in the form of a-#, where # is a number. It allows a fast search for a specific error and possible solutions.
 
| Error ID | Error description | Solutions |
|---|---|---|
| `a-0116` | no auth token | More info:<br />The extension cannot obtain authentication token to access VM metrics in Azure monitor. To deliver VM metrics it needs access to VM resources like VM itself, all disks and all NICs  attached to a VM<br />Solution:<br />Please enable VM managed Identity and give it a reader role for a VM resource group. When you use a setup script, the script does it for you. Normally you don’t need to enable and assign VM managed identity manually. |

## Next steps
* [Azure Virtual Machines deployment for SAP NetWeaver](./deployment-guide.md)
* [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
