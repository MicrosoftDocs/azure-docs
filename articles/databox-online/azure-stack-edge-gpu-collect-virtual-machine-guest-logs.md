---
title: Collect VM guest logs on Azure Stack Edge Pro GPU 
description: Describes how to create a Support package with guest logs for VMs on an Azure Stack Edge Pro GPU device.
services: databox
author: v-dalc

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 07/30/2021
ms.author: alkohli
---
# Collect VM guest logs on an Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

To diagnose any VM provisioning failure on your Azure Stack Edge Pro GPU device, you'll review guest logs for the failed virtual machine. This article describes how to the collect guest logs for the VMs in a Support package.

> [!NOTE]
> You can also monitor activity logs for virtual machines in the Azure portal. For more information, see [Monitor VM activity on your device](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).


## Collect VM guest logs in Support package

To collect guest logs for failed virtual machines on an Azure Stack Edge Pro GPU device, do these steps:

1. [Connect to the PowerShell interface of your device](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface).

2. Collect in-guest logs for failed VMs, and include these logs in a support package, by running the following commands:

   ```powershell
   Get-VMInGuestLogs -FailedVM
   Get-HcsNodeSupportPackage -Path “\\<network path>” -Include InGuestVMLogFiles -Credential “domain_name\user”
   ```

   You'll find the logs in the `hcslogs\VmGuestLogs` folder.

3. To get VM provisioning history details, review the following logs:

   **Linux VMs:**
   - /var/log/cloud-init-output.log
   - /var/log/cloud-init.log
   - /var/log/waagent.log

   **Windows VMs:**
   - C:\Windows\Azure\Panther\WaSetup.xml

## Next steps

- [Monitor the VM activity log](azure-stack-edge-gpu-monitor-virtual-machine-activity.md).
- [Troubleshoot VM provisioning on Azure Stack Edge Pro GPU](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md).