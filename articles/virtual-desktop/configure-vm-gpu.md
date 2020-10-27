---
title: Configure GPU for Windows Virtual Desktop - Azure
description: How to enable GPU-accelerated rendering and encoding in Windows Virtual Desktop.
author: gundarev
ms.topic: how-to
ms.date: 05/06/2019
ms.author: denisgun
---

# Configure graphics processing unit (GPU) acceleration for Windows Virtual Desktop

>[!IMPORTANT]
>This content applies to Windows Virtual Desktop with Azure Resource Manager Windows Virtual Desktop objects. If you're using Windows Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/configure-vm-gpu-2019.md).

Windows Virtual Desktop supports GPU-accelerated rendering and encoding for improved app performance and scalability. GPU acceleration is particularly crucial for graphics-intensive apps.

Follow the instructions in this article to create a GPU optimized Azure virtual machine, add it to your host pool, and configure it to use GPU acceleration for rendering and encoding. This article assumes you already have a Windows Virtual Desktop tenant configured.

## Select a GPU optimized Azure virtual machine size

Azure offers a number of [GPU optimized virtual machine sizes](/azure/virtual-machines/windows/sizes-gpu). The right choice for your host pool depends on a number of factors, including your particular app workloads, desired quality of user experience, and cost. In general, larger and more capable GPUs offer a better user experience at a given user density.

## Create a host pool, provision your virtual machine, and configure an app group

Create a new host pool using a VM of the size you selected. For instructions, see [Tutorial: Create a host pool with the Azure portal](/azure/virtual-desktop/create-host-pools-azure-marketplace).

Windows Virtual Desktop supports GPU-accelerated rendering and encoding in the following operating systems:

* Windows 10 version 1511 or newer
* Windows Server 2016 or newer

You must also configure an app group, or use the default desktop app group (named "Desktop Application Group") that's automatically created when you create a new host pool. For instructions, see [Tutorial: Manage app groups for Windows Virtual Desktop](/azure/virtual-desktop/manage-app-groups).

## Install supported graphics drivers in your virtual machine

To take advantage of the GPU capabilities of Azure N-series VMs in Windows Virtual Desktop, you must install the appropriate graphics drivers. Follow the instructions at [Supported operating systems and drivers](/azure/virtual-machines/windows/sizes-gpu#supported-operating-systems-and-drivers) to install drivers from the appropriate graphics vendor, either manually or using an Azure VM extension.

Only drivers distributed by Azure are supported for Windows Virtual Desktop. Additionally, for Azure VMs with NVIDIA GPUs, only [NVIDIA GRID drivers](/azure/virtual-machines/windows/n-series-driver-setup#nvidia-grid-drivers) are supported for Windows Virtual Desktop.

After driver installation, a VM restart is required. Use the verification steps in the above instructions to confirm that graphics drivers were successfully installed.

## Configure GPU-accelerated app rendering

By default, apps and desktops running in multi-session configurations are rendered with the CPU and do not leverage available GPUs for rendering. Configure Group Policy for the session host to enable GPU-accelerated rendering:

1. Connect to the desktop of the VM using an account with local administrator privileges.
2. Open the Start menu and type "gpedit.msc" to open the Group Policy Editor.
3. Navigate the tree to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.
4. Select policy **Use hardware graphics adapters for all Remote Desktop Services sessions** and set this policy to **Enabled** to enable GPU rendering in the remote session.

## Configure GPU-accelerated frame encoding

Remote Desktop encodes all graphics rendered by apps and desktops (whether rendered with GPU or with CPU) for transmission to Remote Desktop clients. When part of the screen is frequently updated, this part of the screen is encoded with a video codec (H.264/AVC). By default, Remote Desktop does not leverage available GPUs for this encoding. Configure Group Policy for the session host to enable GPU-accelerated frame encoding. Continuing the steps above:

>[!NOTE]
>GPU-accelerated frame encoding is not available in NVv4-series VMs.

1. Select policy **Configure H.264/AVC hardware encoding for Remote Desktop connections** and set this policy to **Enabled** to enable hardware encoding for AVC/H.264 in the remote session.

    >[!NOTE]
    >In Windows Server 2016, set option **Prefer AVC Hardware Encoding** to **Always attempt**.

2. Now that the group policies have been edited, force a group policy update. Open the Command Prompt and type:

    ```cmd
    gpupdate.exe /force
    ```

3. Sign out from the Remote Desktop session.

## Configure fullscreen video encoding

If you often use applications that produce a high-frame rate content, such as 3D modeling, CAD/CAM and video applications, you may choose to enable a fullscreen video encoding for a remote session. Fullscreen video profile provides a higher frame rate and better user experience for such applications at expense of network bandwidth and both session host and client resources. It is recommended to use GPU-accelerated frame encoding for a full-screen video encoding. Configure Group Policy for the session host to enable fullscreen video encoding. Continuing the steps above:

1. Select policy **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** and set this policy to **Enabled** to force H.264/AVC 444 codec in the remote session.
2. Now that the group policies have been edited, force a group policy update. Open the Command Prompt and type:

    ```cmd
    gpupdate.exe /force
    ```

3. Sign out from the Remote Desktop session.
## Verify GPU-accelerated app rendering

To verify that apps are using the GPU for rendering, try any of the following:

* For Azure VMs with a NVIDIA GPU, use the `nvidia-smi` utility as described in [Verify driver installation](/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation) to check for GPU utilization when running your apps.
* On supported operating system versions, you can use the Task Manager to check for GPU utilization. Select the GPU in the "Performance" tab to see whether apps are utilizing the GPU.

## Verify GPU-accelerated frame encoding

To verify that Remote Desktop is using GPU-accelerated encoding:

1. Connect to the desktop of the VM using Windows Virtual Desktop client.
2. Launch the Event Viewer and navigate to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**
3. To determine if GPU-accelerated encoding is used, look for event ID 170. If you see "AVC hardware encoder enabled: 1" then GPU encoding is used.

## Verify fullscreen video encoding

To verify that Remote Desktop is using fullscreen video encoding:

1. Connect to the desktop of the VM using Windows Virtual Desktop client.
2. Launch the Event Viewer and navigate to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**
3. To determine if fullscreen video encoding  is used, look for event ID 162. If you see "AVC Available: 1 Initial Profile: 2048" then AVC 444 is used.

## Next steps

These instructions should have you up and running with GPU acceleration on one session host (one VM). Some additional considerations for enabling GPU acceleration across a larger host pool:

* Consider using a [VM extension](/azure/virtual-machines/extensions/overview) to simplify driver installation and updates across a number of VMs. Use the [NVIDIA GPU Driver Extension](/azure/virtual-machines/extensions/hpccompute-gpu-windows) for VMs with NVIDIA GPUs, and use the [AMD GPU Driver Extension](/azure/virtual-machines/extensions/hpccompute-amd-gpu-windows) for VMs with AMD GPUs.
* Consider using Active Directory Group Policy to simplify group policy configuration across a number of VMs. For information about deploying Group Policy in the Active Directory domain, see [Working with Group Policy Objects](https://go.microsoft.com/fwlink/p/?LinkId=620889).
