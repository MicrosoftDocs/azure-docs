---
title: Connect to the virtual machine console on Azure Stack Edge Pro GPU device
description: Describes how to connect to the virtual machine console on a VM running on Azure Stack Edge Pro GPU device.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: how-to
ms.date: 06/04/2021
ms.author: alkohli
---
# Connect to a virtual machine console on an Azure Stack Edge Pro GPU device

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

Azure Stack Edge Pro GPU solution runs non-containerized workloads via the virtual machines. This article describes how to connect to the console of a virtual machine deployed on your device.

The virtual machine console allows you to access your VMs with keyboard, mouse, and screen features using the commonly available remote desktop tools. You can access the console and troubleshoot any issues experienced when deploying a virtual machine on your device. You can connect to the virtual machine console even if your VM has failed to provision.


## Workflow

The high-level workflow has the following steps:

1. Connect to the PowerShell interface on your device.
1. Enable console access to the VM.
1. Connect to the VM using remote desktop protocol (RDP).
1. Revoke console access to the VM.

## Prerequisites

Before you begin, make sure that you have completed the following prerequisites:

#### For your device

You should have access to an Azure Stack Edge Pro GPU device that is activated. The device must have one or more VMs deployed on it. You can deploy VMs via Azure PowerShell, via the templates, or via the Azure portal.

#### For client accessing the device

Make sure that you have access to a client system that:

- Can access the PowerShell interface of the device. The client is running a [Supported operating system](azure-stack-edge-gpu-system-requirements.md#supported-os-for-clients-connected-to-device).
- The client is running PowerShell 7.0 or later. This version of PowerShell works for Windows, Mac, and Linux clients. See instructions to [install PowerShell 7](/powershell/scripting/install/installing-powershell).
- Has remote desktop capabilities. Depending on whether you are using Windows, macOS, or Linux, you should install one of these [Remote desktop clients](/windows-server/remote/remote-desktop-services/clients/remote-desktop-clients). This article provides instructions with [Windows Remote Desktop](/windows-server/remote/remote-desktop-services/clients/windowsdesktop#install-the-client) and [FreeRDP](https://www.freerdp.com/). <!--Which version of FreeRDP to use?-->


## Connect to VM console

Follow these steps to connect to the virtual machine console on your device.

### Connect to the PowerShell interface on your device

The first step is to [Connect to the PowerShell interface](azure-stack-edge-gpu-connect-powershell-interface.md#connect-to-the-powershell-interface) of your device.

### Enable console access to the VM

1. In the PowerShell interface, run the following command to enable access to the VM console.

   ```powershell
   Grant-HcsVMConnectAccess -ResourceGroupName <VM resource group> -VirtualMachineName <VM name>
   ```
2. In the sample output, make a note of the virtual machine ID. You'll need this for a later step.

   ```powershell
   [10.100.10.10]: PS>Grant-HcsVMConnectAccess -ResourceGroupName mywindowsvm1rg -VirtualMachineName mywindowsvm1

   VirtualMachineId       : 81462e0a-decb-4cd4-96e9-057094040063
   VirtualMachineHostName : 3V78B03
   ResourceGroupName      : mywindowsvm1rg
   VirtualMachineName     : mywindowsvm1
   Id                     : 81462e0a-decb-4cd4-96e9-057094040063
   [10.100.10.10]: PS>
   ```

### Connect to the VM

You can now use a Remote Desktop client to connect to the virtual machine console.

#### Use Windows Remote Desktop

1. Create a new text file and input the following text.

    ```
    pcb:s:<VM ID from PowerShell>;EnhancedMode=0
    full address:s:<IP address of the device>
    server port:i:2179
    username:s:EdgeARMUser
    negotiate security layer:i:0
    ```

1. Save the file as **.rdp* on your client system. You'll use this profile to connect to the VM.
1. Double-click the profile to connect to the VM. Provide the following credentials:

   - **Username**: Sign in as EdgeARMUser.
   - **Password**: Provide the local Azure Resource Manager password for your device. If you have forgotten the password, [Reset Azure Resource Manager password via the Azure portal](azure-stack-edge-gpu-set-azure-resource-manager-password.md#reset-password-via-the-azure-portal).

#### Use FreeRDP

If using FreeRDP on your Linux client, run the following command:

```powershell
./wfreerdp /u:EdgeARMUser /vmconnect:<VM ID from PowerShell> /v:<IP address of the device>
```

## Revoke VM console access

To revoke access to the VM console, return to the PowerShell interface of your device. Run the following command:

```powershell
Revoke-HcsVMConnectAccess -ResourceGroupName <VM resource group> -VirtualMachineName <VM name>
```

Here is an example output:

```powershell
[10.100.10.10]: PS>Revoke-HcsVMConnectAccess -ResourceGroupName mywindowsvm1rg -VirtualMachineName mywindowsvm1

VirtualMachineId       : 81462e0a-decb-4cd4-96e9-057094040063
VirtualMachineHostName : 3V78B03
ResourceGroupName      : mywindowsvm1rg
VirtualMachineName     : mywindowsvm1
Id                     : 81462e0a-decb-4cd4-96e9-057094040063

[10.100.10.10]: PS>
```

> [!NOTE]
> We recommend that after you are done using the VM console, you either revoke the access or close the PowerShell window to exit the session.

## Next steps

- Troubleshoot [VM deployments](azure-stack-edge-gpu-troubleshoot-virtual-machine-provisioning.md) in Azure portal.
<!--Make "VM guest logs" first link when article is available.-->