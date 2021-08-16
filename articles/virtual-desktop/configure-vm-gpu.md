---
title: Configure GPU for Azure Virtual Desktop - Azure
description: How to enable GPU-accelerated rendering and encoding in Azure Virtual Desktop.
author: gundarev
ms.topic: how-to
ms.date: 05/06/2019
ms.author: denisgun
---

# Configure graphics processing unit (GPU) acceleration for Azure Virtual Desktop

>[!IMPORTANT]
>This content applies to Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/configure-vm-gpu-2019.md).

Azure Virtual Desktop supports GPU-accelerated rendering and encoding for improved app performance and scalability. GPU acceleration is particularly crucial for graphics-intensive apps.

Follow the instructions in this article to create a GPU optimized Azure virtual machine, add it to your host pool, and configure it to use GPU acceleration for rendering and encoding. This article assumes you already have a Azure Virtual Desktop tenant configured.

## Select an appropriate GPU optimized Azure virtual machine size

Select one of Azure's [NV-series](../virtual-machines/nv-series.md), [NVv3-series](../virtual-machines/nvv3-series.md), or [NVv4-series](../virtual-machines/nvv4-series.md) VM sizes. These are tailored for app and desktop virtualization and enable most apps and the Windows user interface to be GPU accelerated. The right choice for your host pool depends on a number of factors, including your particular app workloads, desired quality of user experience, and cost. In general, larger and more capable GPUs offer a better user experience at a given user density, while smaller and fractional-GPU sizes allow more fine-grained control over cost and quality.

>[!NOTE]
>Azure's NC, NCv2, NCv3, ND, and NDv2 series VMs are generally not appropriate for Azure Virtual Desktop session hosts. These VMs are tailored for specialized, high-performance compute or machine learning tools, such as those built with NVIDIA CUDA. They do not support GPU acceleration for most apps or the Windows user interface.

## Create a host pool, provision your virtual machine, and configure an app group

Create a new host pool using a VM of the size you selected. For instructions, see [Tutorial: Create a host pool with the Azure portal](./create-host-pools-azure-marketplace.md).

Azure Virtual Desktop supports GPU-accelerated rendering and encoding in the following operating systems:

* Windows 10 version 1511 or newer
* Windows Server 2016 or newer

You must also configure an app group, or use the default desktop app group (named "Desktop Application Group") that's automatically created when you create a new host pool. For instructions, see [Tutorial: Manage app groups for Azure Virtual Desktop](./manage-app-groups.md).

## Install supported graphics drivers in your virtual machine

To take advantage of the GPU capabilities of Azure N-series VMs in Azure Virtual Desktop, you must install the appropriate graphics drivers. Follow the instructions at [Supported operating systems and drivers](../virtual-machines/sizes-gpu.md#supported-operating-systems-and-drivers) to install drivers. Only drivers distributed by Azure are supported.

* For Azure NV-series or NVv3-series VMs, only NVIDIA GRID drivers, and not NVIDIA CUDA drivers, support GPU acceleration for most apps and the Windows user interface. If you choose to install drivers manually, be sure to install GRID drivers. If you choose to install drivers using the Azure VM extension, GRID drivers will automatically be installed for these VM sizes.
* For Azure NVv4-series VMs, install the AMD drivers provided by Azure. You may install them automatically using the Azure VM extension, or you may install them manually.

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

* For Azure VMs with a NVIDIA GPU, use the `nvidia-smi` utility as described in [Verify driver installation](../virtual-machines/windows/n-series-driver-setup.md#verify-driver-installation) to check for GPU utilization when running your apps.
* On supported operating system versions, you can use the Task Manager to check for GPU utilization. Select the GPU in the "Performance" tab to see whether apps are utilizing the GPU.

## Verify GPU-accelerated frame encoding

To verify that Remote Desktop is using GPU-accelerated encoding:

1. Connect to the desktop of the VM using Azure Virtual Desktop client.
2. Launch the Event Viewer and navigate to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**
3. To determine if GPU-accelerated encoding is used, look for event ID 170. If you see "AVC hardware encoder enabled: 1" then GPU encoding is used.

## Verify fullscreen video encoding

To verify that Remote Desktop is using fullscreen video encoding:

1. Connect to the desktop of the VM using Azure Virtual Desktop client.
2. Launch the Event Viewer and navigate to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**
3. To determine if fullscreen video encoding  is used, look for event ID 162. If you see "AVC Available: 1 Initial Profile: 2048" then AVC 444 is used.

## Next steps

These instructions should have you up and running with GPU acceleration on one session host (one VM). Some additional considerations for enabling GPU acceleration across a larger host pool:

* Consider using a [VM extension](../virtual-machines/extensions/overview.md) to simplify driver installation and updates across a number of VMs. Use the [NVIDIA GPU Driver Extension](../virtual-machines/extensions/hpccompute-gpu-windows.md) for VMs with NVIDIA GPUs, and use the [AMD GPU Driver Extension](../virtual-machines/extensions/hpccompute-amd-gpu-windows.md) for VMs with AMD GPUs.
* Consider using Active Directory Group Policy to simplify group policy configuration across a number of VMs. For information about deploying Group Policy in the Active Directory domain, see [Working with Group Policy Objects](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731212(v=ws.11)).