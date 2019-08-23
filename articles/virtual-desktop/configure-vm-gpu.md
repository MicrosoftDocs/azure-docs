---
title: Configure GPU for Windows Virtual Desktop Preview - Azure
description: How to enable GPU-accelerated rendering and encoding in Windows Virtual Desktop Preview.
services: virtual-desktop
author: gundarev

ms.service: virtual-desktop
ms.topic: conceptual
ms.date: 05/06/2019
ms.author: denisgun
---

# Configure graphics processing unit (GPU) acceleration for Windows Virtual Desktop Preview

Windows Virtual Desktop Preview supports GPU-accelerated rendering and encoding for improved app performance and scalability. GPU acceleration is particularly crucial for graphics-intensive apps.

Follow the instructions in this article to create a GPU optimized Azure virtual machine, add it to your host pool, and configure it to use GPU acceleration for rendering and encoding. This article assumes you already have a Windows Virtual Desktop tenant configured.

## Select a GPU optimized Azure virtual machine size

Azure offers a number of [GPU optimized virtual machine sizes](/azure/virtual-machines/windows/sizes-gpu). The right choice for your host pool depends on a number of factors, including your particular app workloads, desired quality of user experience, and cost. In general, larger and more capable GPUs offer a better user experience at a given user density.

## Create a host pool, provision your virtual machine, and configure an app group

Create a new host pool using a VM of the size you selected. For instructions, see [Tutorial: Create a host pool with Azure Marketplace](/azure/virtual-desktop/create-host-pools-azure-marketplace).

Windows Virtual Desktop Preview supports GPU-accelerated rendering and encoding in the following operating systems:

* Windows 10 version 1511 or newer
* Windows Server 2016 or newer

You must also configure an app group, or use the default desktop app group (named "Desktop Application Group") that's automatically created when you create a new host pool. For instructions, see [Tutorial: Manage app groups for Windows Virtual Desktop Preview](/azure/virtual-desktop/manage-app-groups).

>[!NOTE]
>Windows Virtual Desktop Preview only supports the "Desktop" app group type for GPU-enabled host pools. App groups of type "RemoteApp" aren't supported for GPU-enabled host pools.

## Install supported graphics drivers in your virtual machine

To take advantage of the GPU capabilities of Azure N-series VMs in Windows Virtual Desktop Preview, you must install NVIDIA graphics drivers. Follow the instructions at [Install NVIDIA GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-driver-setup) to install drivers, either manually or using the [NVIDIA GPU Driver Extension](/azure/virtual-machines/extensions/hpccompute-gpu-windows).

Note that only [NVIDIA GRID drivers](/azure/virtual-machines/windows/n-series-driver-setup#nvidia-grid-drivers) distributed by Azure are supported for Windows Virtual Desktop Preview.

After driver installation, a VM restart is required. Use the verification steps in the above instructions to confirm that graphics drivers were successfully installed.

## Configure GPU-accelerated app rendering

By default, apps and desktops running in multi-session configurations are rendered with the CPU and do not leverage available GPUs for rendering. Configure Group Policy for the session host to enable GPU-accelerated rendering:

1. Connect to the desktop of the VM using an account with local administrator privileges.
2. Open the Start menu and type "gpedit.msc" to open the Group Policy Editor.
3. Navigate the tree to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.
4. Select policy **Use the hardware default graphics adapter for all Remote Desktop Services sessions** and set this policy to **Enabled** to enable GPU rendering in the remote session.

## Configure GPU-accelerated frame encoding

Remote Desktop encodes all graphics rendered by apps and desktops (whether rendered with GPU or with CPU) for transmission to Remote Desktop clients. By default, Remote Desktop does not leverage available GPUs for this encoding. Configure Group Policy for the session host to enable GPU-accelerated frame encoding. Continuing the steps above:

1. Select policy **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** and set this policy to **Enabled** to force H.264/AVC 444 codec in the remote session.
2. Select policy **Configure H.264/AVC hardware encoding for Remote Desktop connections** and set this policy to **Enabled** to enable hardware encoding for AVC/H.264 in the remote session.

    >[!NOTE]
    >In Windows Server 2016, set option **Prefer AVC Hardware Encoding** to **Always attempt**.

3. Now that the group policies have been edited, force a group policy update. Open the Command Prompt and type:

    ```batch
    gpupdate.exe /force
    ```

4. Sign out from the Remote Desktop session.

## Verify GPU-accelerated app rendering

To verify that apps are using the GPU for rendering, try any of the following:

* Use the `nvidia-smi` utility as described in [Verify driver installation](/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation) to check for GPU utilization when running your apps.
* On supported operating system versions, you can use the Task Manager to check for GPU utilization. Select the GPU in the "Performance" tab to see whether apps are utilizing the GPU.

## Verify GPU-accelerated frame encoding

To verify that Remote Desktop is using GPU-accelerated encoding:

1. Connect to the desktop of the VM using Windows Virtual Desktop client.
2. Launch the Event Viewer and navigate to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreTS** > **Operational**
3. To determine if GPU-accelerated encoding is used, look for event ID 170. If you see "AVC hardware encoder enabled: 1" then GPU encoding is used.
4. To determine if AVC 444 mode is used, look for event ID 162. If you see "AVC Available: 1 Initial Profile: 2048" then AVC 444 is used.

## Next steps

These instructions should have you up and running with GPU acceleration on a single session host VM. Some additional considerations for enabling GPU acceleration across a larger host pool:

* Consider using the [NVIDIA GPU Driver Extension](/azure/virtual-machines/extensions/hpccompute-gpu-windows) to simplify driver installation and updates across a number of VMs.
* Consider using Active Directory Group Policy to simplify group policy configuration across a number of VMs. For information about deploying Group Policy in the Active Directory domain, see [Working with Group Policy Objects](https://go.microsoft.com/fwlink/p/?LinkId=620889).
