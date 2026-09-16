---
title: Troubleshoot the Azure VM Extension for SAP
description: Troubleshoot common issues with the Azure VM Extension for SAP, including missing performance counters, empty installation directories, and error codes.
author: mareusch
manager: juergent
ms.custom: devx-track-azurepowershell, devx-track-azurecli, linux-related-content
ms.service: sap-on-azure
ms.subservice: sap-vm-workloads
ms.topic: troubleshooting-general
ms.date: 04/02/2026
ms.author: mareusch
# Customer intent: As a system administrator managing SAP workloads on virtual machines, I want to troubleshoot the Azure VM Extension for SAP, so that I can ensure accurate performance metrics collection and maintain optimal performance of my applications.
---

# Troubleshoot the Azure VM Extension for SAP

[1999351]:https://launchpad.support.sap.com/#/notes/1999351
[configure]:vm-extension-for-sap-new.md#configure-the-azure-vm-extension-for-sap-solutions (Configure the Azure VM extension for SAP solutions)

The Azure VM Extension for SAP collects performance metrics from Azure virtual machines (VMs) and forwards them to the SAP Host Agent so that SAP monitoring tools can report on system health. When the extension isn't working correctly, performance counters might be missing or empty, which can prevent you from identifying resource bottlenecks in your SAP environment.

This article helps you diagnose and resolve common issues with the extension on both Windows and Linux VMs, including missing performance counters, empty installation directories, and authentication errors.

## Azure performance counters don't show up at all

The `AzureEnhancedMonitoring` process (Windows) or daemon (Linux), collects the performance metrics. If the process isn't running on your VM, the VM can't collect performance metrics.

### Check the installation directory

Verify that the extension installation directory isn't empty.

- **Windows**: Check the directory `C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\<version>`.
- **Linux**: Check that `/var/lib/waagent/` has a subdirectory for the Azure Extension for SAP.

If the directory is empty, the extension isn't installed. Determine whether the issue is proxy-related. You might need to restart the VM or [install the VM extension again][configure].

## Some Azure performance counters are missing

Performance metrics are collected from several sources. Some configuration data is collected locally, and some performance metrics are read from Azure Monitor.

For a complete and up-to-date list of known issues, see SAP Note [1999351], which has extra troubleshooting information for the Azure Extension for SAP.

If troubleshooting by using SAP Note [1999351] doesn't resolve the issue, [install the extension again][configure]. If the problem persists, open an SAP customer support message on the following component:

- **Windows**: BC-OP-NT-AZR
- **Linux**: BC-OP-LNX-AZR

Attach the relevant log file to the incident:

- **Windows**: `C:\Packages\Plugins\Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Windows\<version>\logapp.txt`
- **Linux**: `/var/lib/waagent/Microsoft.AzureCAT.AzureEnhancedMonitoring.MonitorX64Linux-<version>/logapp.txt`

## Azure extension error codes

All error codes have a unique tag in the form of `a-#`, where `#` is a number. Use the tag to search for a specific error and its solution.

| Code | Error message | Solution |
|---|---|---|
| a-0116 | No auth token | The extension can't obtain an authentication token to access VM metrics in Azure Monitor. To deliver VM metrics, it needs access to VM resources like the VM itself, all disks, and all network interfaces attached to a VM. Enable a managed identity for the VM and assign it the Reader role for the VM's resource group. When you use a setup script, the script performs this action for you. Normally, you don't need to enable and assign a managed identity manually. |

## Related content

- [Configure the Azure VM Extension for SAP solutions](vm-extension-for-sap-new.md)
- [Azure Virtual Machines deployment for SAP NetWeaver](./deployment-guide.md)
- [Azure Virtual Machines planning and implementation for SAP NetWeaver](./planning-guide.md)
