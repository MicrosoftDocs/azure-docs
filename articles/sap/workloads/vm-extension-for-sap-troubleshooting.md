---
title: Troubleshoot the Azure VM Extension for SAP | Microsoft Docs
description: Learn how to troubleshoot the new VM Extension for SAP.
services: virtual-machines-linux,virtual-machines-windows
author: imnotfromhere
manager: juergent
ms.custom: devx-track-azurepowershell, devx-track-azurecli, linux-related-content
ms.assetid: 1c4f1951-3613-4a5a-a0af-36b85750c84e
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.date: 06/22/2021
ms.author: mareusch
# Customer intent: "As a system administrator managing SAP workloads on virtual machines, I want to troubleshoot the Azure VM Extension for SAP, so that I can ensure accurate performance metrics collection and maintain optimal performance of my applications."
---

# Troubleshoot the Azure VM Extension for SAP
[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[configure]:vm-extension-for-sap-new.md#configure (Configure the Azure VM extension for SAP solutions)

## <a name="dee9099b-7b8a-4cdd-86a2-3f6ee964266f"></a>Troubleshooting for Windows
 
### Azure performance counters don't show up at all
The AzureEnhancedMonitoring process collects performance metrics in Azure. If the process isn't running in your virtual machine (VM), no performance metrics can be collected.

#### The installation directory of the Azure Extension for SAP is empty
##### Issue
The installation directory
C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\\&lt;version>
is empty.
##### Solution
The extension isn't installed. Determine whether it is a proxy issue. You might need to restart the machine or install the VM extension again.
 
### Some Azure performance counters are missing

The AzureEnhancedMonitoring Windows process collects performance metrics in Azure. The process gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.

If troubleshooting by using SAP Note [1999351] doesn't resolve the issue, open an SAP customer support message. For a Windows VM use the component BC-OP-NT-AZR or BC-OP-LNX-AZR for a Linux virtual machine. Attach the log file C:\\Packages\\Plugins\\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\\&lt;version>\\logapp.txt to the incident.

## <a name="02783aa4-5443-43f5-bc11-7af19ebf0c36"></a>Troubleshooting for Linux

### Azure performance counters don't show up at all
Performance metrics in Azure are collected by a daemon. If the daemon isn't running, no performance metrics can be collected.

#### The installation directory of the Azure Extension for SAP is empty
##### Issue
The directory /var/lib/waagent/ doesn't have a subdirectory for the Azure Extension for SAP.
##### Solution
The extension isn't installed. Determine whether it is a proxy issue. You might need to restart the machine and/or install the VM extension again.
 
### Some Azure performance counters are missing

Performance metrics in Azure are collected by a daemon, which gets data from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.
For a complete and up-to-date list of known issues, see SAP Note [1999351], which has additional troubleshooting information for Azure Extension for SAP.
If troubleshooting by using SAP Note [1999351] doesn't resolve the issue, install the extension again as described in [Configure the Azure Extension for SAP][configure]. If the problem persists, open an SAP customer support message on the component BC-OP-NT-AZR for Windows or BC-OP-LNX-AZR for a Linux virtual machine. Attach the log file /var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-&lt;version>/logapp.txt to the incident.


## Azure extension error codes
 
All error IDs have a unique tag in the form of a-#, where # is a number. It allows a fast search for a specific error and possible solutions.
 
### <a name="a-0116"></a> a-0116

Error description | Solutions |
---|---|
 no auth token | More info:<br />The extension can't obtain authentication token to access VM metrics in Azure monitor. To deliver VM metrics it needs access to VM resources like VM itself, all disks and all NICs attached to a VM<br />Solution:<br />Enable VM managed Identity and give it a reader role for a VM resource group. When you use a setup script, the script does it for you. Normally you don’t need to enable and assign VM managed identity manually. |



## Next steps
* [Azure Virtual Machines deployment for SAP NetWeaver](./deployment-guide.md)
* [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
