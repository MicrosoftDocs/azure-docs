---
title: Configure GPU for Azure Virtual Desktop - Azure
description: Learn how to enable GPU-accelerated rendering and encoding in Azure Virtual Desktop.
author: femila
ms.topic: how-to
ms.date: 05/06/2019
ms.author: femila
---

# Configure GPU acceleration for Azure Virtual Desktop

> [!IMPORTANT]
> This content applies to Azure Virtual Desktop with Azure Resource Manager objects. If you're using Azure Virtual Desktop (classic) without Azure Resource Manager objects, see [this article](./virtual-desktop-fall-2019/configure-vm-gpu-2019.md).

Azure Virtual Desktop supports graphics processing unit (GPU) acceleration in rendering and encoding for improved app performance and scalability. GPU acceleration is crucial for graphics-intensive apps and can be used with all [supported operating systems](prerequisites.md#operating-systems-and-licenses) for Azure Virtual Desktop.

The list doesn't specifically include multi-session versions of Windows. However, each GPU in NV-series Azure virtual machines (VMs) comes with a GRID license that supports 25 concurrent users. For more information, see [NV-series](../virtual-machines/nv-series.md).

This article shows you how to create a GPU-optimized Azure virtual machine, add it to your host pool, and configure it to use GPU acceleration for rendering and encoding.

## Prerequisites

This article assumes that you already created a host pool and an application group.

## Select an appropriate GPU-optimized Azure VM size

Select one of the Azure [NV-series](../virtual-machines/nv-series.md), [NVv3-series](../virtual-machines/nvv3-series.md), [NVv4-series](../virtual-machines/nvv4-series.md), [NVadsA10 v5-series](../virtual-machines/nva10v5-series.md), or [NCasT4_v3-series](../virtual-machines/nct4-v3-series.md) VM sizes to use as a session host. These sizes are tailored for app and desktop virtualization. They enable most apps and the Windows user interface to be GPU accelerated.

The right choice for your host pool depends on many factors, including your particular app workloads, desired quality of user experience, and cost. In general, larger and more capable GPUs offer a better user experience at a given user density. Smaller and fractional GPU sizes allow more fine-grained control over cost and quality.

> [!NOTE]
> NV-series VMs are planned to be retired. For more information, see [NV retirement](../virtual-machines/nv-series-retirement.md).

Azure NC, NCv2, NCv3, ND, and NDv2 series VMs are generally not appropriate for Azure Virtual Desktop session hosts. These VMs are tailored for specialized, high-performance compute or machine learning tools, such as those built with NVIDIA CUDA. They don't support GPU acceleration for most apps or the Windows user interface.

## Install supported graphics drivers in your virtual machine

To take advantage of the GPU capabilities of Azure N-series VMs in Azure Virtual Desktop, you must install the appropriate graphics drivers. Follow the instructions at [Supported operating systems and drivers](../virtual-machines/sizes-gpu.md#supported-operating-systems-and-drivers) to install drivers. Only Azure-distributed drivers are supported.

Keep this size-specific information in mind:

* For Azure NV-series, NVv3-series, or NCasT4_v3-series VMs, only NVIDIA GRID drivers support GPU acceleration for most apps and the Windows user interface. NVIDIA CUDA drivers don't support GPU acceleration for these VM sizes.

  If you choose to install drivers manually, be sure to install GRID drivers. If you choose to install drivers by using the Azure VM extension, GRID drivers will automatically be installed for these VM sizes.
* For Azure NVv4-series VMs, install the AMD drivers that Azure provides. You can install them automatically by using the Azure VM extension, or you can install them manually.

After driver installation, a VM restart is required. Use the verification steps in the preceding instructions to confirm that graphics drivers were successfully installed.

## Configure GPU-accelerated app rendering

By default, apps and desktops running on Windows Server are rendered with the CPU and don't use available GPUs for rendering. Configure Group Policy for the session host to enable GPU-accelerated rendering:

1. Connect to the desktop of the VM by using an account that has local administrator privileges.
2. Open the **Start** menu and enter **gpedit.msc** to open Group Policy Editor.
3. Go to **Computer Configuration** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.
4. Select the policy **Use hardware graphics adapters for all Remote Desktop Services sessions**. Set this policy to **Enabled** to enable GPU rendering in the remote session.

## Configure GPU-accelerated frame encoding

Remote Desktop encodes all graphics that apps and desktops render for transmission to Remote Desktop clients. When part of the screen is frequently updated, this part of the screen is encoded with a video codec (H.264/AVC). By default, Remote Desktop doesn't use available GPUs for this encoding.

Configure Group Policy for the session host to enable GPU-accelerated frame encoding. The following procedure continues the previous steps.

> [!NOTE]
> GPU-accelerated frame encoding is not available in NVv4-series VMs.

1. Select the policy **Configure H.264/AVC hardware encoding for Remote Desktop connections**. Set this policy to **Enabled** to enable hardware encoding for AVC/H.264 in the remote session.

   If you're using Windows Server 2016, set **Prefer AVC Hardware Encoding** to **Always attempt**.

2. Now that you've edited the policies, force a Group Policy update. Open the command prompt as an administrator and run the following command:

   ```cmd
   gpupdate.exe /force
   ```

3. Sign out of the Remote Desktop session.

## Configure full-screen video encoding

> [!NOTE]
> You can enable full-screen video encoding even without a GPU present.

If you often use applications that produce high-frame-rate content, you might choose to enable full-screen video encoding for a remote session. Such applications might include 3D modeling, CAD/CAM, or video applications.

A full-screen video profile provides a higher frame rate and better user experience for these applications, at the expense of network bandwidth and both session host and client resources. We recommend that you use GPU-accelerated frame encoding for a full-screen video encoding.

Configure Group Policy for the session host to enable full-screen video encoding. Continuing the previous steps:

1. Select the policy **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections**. Set this policy to **Enabled** to force the H.264/AVC 444 codec in the remote session.
2. Now that you've edited the policies, force a Group Policy update. Open the command prompt as an administrator and run the following command:

   ```cmd
   gpupdate.exe /force
   ```

3. Sign out of the Remote Desktop session.

## Verify GPU-accelerated app rendering

To verify that apps are using the GPU for rendering, try either of the following methods:

* For Azure VMs with an NVIDIA GPU, use the `nvidia-smi` utility to check for GPU utilization when running your apps. For more information, see [Verify driver installation](../virtual-machines/windows/n-series-driver-setup.md#verify-driver-installation).
* On supported operating system versions, you can use Task Manager to check for GPU utilization. Select the GPU on the **Performance** tab to see whether apps are utilizing the GPU.

## Verify GPU-accelerated frame encoding

To verify that Remote Desktop is using GPU-accelerated encoding:

1. Connect to the desktop of the VM by using the Azure Virtual Desktop client.
2. Open Event Viewer and go to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**.
3. Look for event ID 170. If you see **AVC hardware encoder enabled: 1**, Remote Desktop is using GPU-accelerated encoding.

> [!TIP]
> If you're connecting to your session host outside Azure Virtual Desktop for testing GPU acceleration, the logs are instead stored in **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreTs** > **Operational** in Event Viewer.

## Verify full-screen video encoding

To verify that Remote Desktop is using full-screen video encoding:

1. Connect to the desktop of the VM by using the Azure Virtual Desktop client.
2. Open Event Viewer and go to the following node: **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**.
3. Look for event ID 162. If you see **AVC Available: 1 Initial Profile: 2048**, Remote Desktop is using full-screen video encoding (AVC 444).

> [!TIP]
> If you're connecting to your session host outside Azure Virtual Desktop for testing GPU acceleration, the logs are instead stored in **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreTs** > **Operational** in Event Viewer.

## Next steps

These instructions should have you operating with GPU acceleration on one session host (one VM). Here are additional considerations for enabling GPU acceleration across a larger host pool:

* Consider using a [VM extension](../virtual-machines/extensions/overview.md) to simplify driver installation and updates across VMs. Use the [NVIDIA GPU Driver Extension](../virtual-machines/extensions/hpccompute-gpu-windows.md) for VMs with NVIDIA GPUs. Use the [AMD GPU Driver Extension](../virtual-machines/extensions/hpccompute-amd-gpu-windows.md) for VMs with AMD GPUs.
* Consider using Active Directory to simplify Group Policy configuration across VMs. For information about deploying Group Policy in the Active Directory domain, see [Working with Group Policy Objects](/previous-versions/windows/it-pro/windows-server-2008-R2-and-2008/cc731212(v=ws.11)).
