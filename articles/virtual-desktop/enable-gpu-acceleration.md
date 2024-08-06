---
title: Enable GPU acceleration for Azure Virtual Desktop
description: Learn how to enable GPU-accelerated rendering and encoding in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 05/21/2024
---

# Enable GPU acceleration for Azure Virtual Desktop

Azure Virtual Desktop supports graphics processing unit (GPU) acceleration in rendering and encoding for improved app performance and scalability using the Remote Desktop Protocol (RDP). GPU acceleration is crucial for graphics-intensive applications and can be used with all [supported operating systems](prerequisites.md#operating-systems-and-licenses) for Azure Virtual Desktop.

There are three components to GPU acceleration in Azure Virtual Desktop that work together to improve the user experience:

- **GPU-accelerated application rendering**: Use the GPU to render graphics in a remote session.

- **GPU-accelerated frame encoding**: The Remote Desktop Protocol encodes all graphics rendered for transmission to the local device. When part of the screen is frequently updated, it's encoded with the H.264/AVC video codec.

- **Full-screen video encoding**: A full-screen video profile provides a higher frame rate and better user experience, but uses more network bandwidth and both session host and client resources. It benefits applications such as 3D modeling, CAD/CAM, or video playback and editing.

> [!TIP]
> - You can enable full-screen video encoding even without GPU acceleration.
>
> - You can also increase the [default chroma value](configure-default-chroma-value.md) to improve the image quality.

This article shows you which Azure VM sizes you can use as a session host with GPU acceleration, and how to enable GPU acceleration for rendering and encoding. You can use Microsoft Intune or Group Policy to configure your session hosts.

## Supported GPU-optimized Azure VM sizes

The following Azure VM sizes are optimized for GPU acceleration and are supported as session hosts in Azure Virtual Desktop:

- [NVv3-series](../virtual-machines/nvv3-series.md)
- [NVv4-series](../virtual-machines/nvv4-series.md). GPU-accelerated frame encoding isn't available with NVv4-series VMs.
- [NVadsA10 v5-series](../virtual-machines/nva10v5-series.md)
- [NCasT4_v3-series](../virtual-machines/nct4-v3-series.md)

The right choice of VM size depends on many factors, including your particular application workloads, desired quality of user experience, and cost. In general, larger and more capable GPUs offer a better user experience at a given user density. Smaller and fractional GPU sizes allow more fine-grained control over cost and quality.

VM sizes with an NVIDIA GPU come with a GRID license that supports 25 concurrent users.

> [!IMPORTANT]
> Azure NC, NCv2, NCv3, ND, and NDv2 series VMs aren't generally appropriate as session hosts. These VM sizes are tailored for specialized, high-performance compute or machine learning tools, such as those built with NVIDIA CUDA. They don't support GPU acceleration for most applications or the Windows user interface.

## Prerequisites

Before you can enable GPU acceleration, you need:

- An existing host pool with session hosts using [supported GPU-optimized Azure VM sizes](#supported-gpu-optimized-azure-vm-sizes).

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.

   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that is a member of the **Domain Admins** security group.

   - A security group or organizational unit (OU) containing the devices you want to configure.

## Install supported graphics drivers in your virtual machine

To take advantage of the GPU capabilities of Azure N-series VMs in Azure Virtual Desktop, you must install the appropriate graphics drivers. Follow the instructions at [Supported operating systems and drivers](../virtual-machines/sizes-gpu.md#supported-operating-systems-and-drivers) to install drivers.

> [!IMPORTANT]
> Only Azure-distributed drivers are supported.

When installing drivers, here are some important guidelines:

- For VMs sizes with an NVIDIA GPU, only NVIDIA *GRID* drivers support GPU acceleration for most applications and the Windows user interface. NVIDIA *CUDA* drivers don't support GPU acceleration for these VM sizes. To download and learn how to install the driver, see [Install NVIDIA GPU drivers on N-series VMs running Windows](../virtual-machines/windows/n-series-driver-setup.md) and be sure to install the GRID driver. If you install the driver by using the [NVIDIA GPU Driver Extension](../virtual-machines/extensions/hpccompute-gpu-windows.md), the GRID driver is automatically installed for these VM sizes.

- For VMs sizes with an AMD GPU, install the AMD drivers that Azure provides. To download and learn how to install the driver, see [Install AMD GPU drivers on N-series VMs running Windows](../virtual-machines/windows/n-series-amd-driver-setup.md). 

## Enable GPU-accelerated application rendering, frame encoding, and full-screen video encoding

By default, remote sessions are rendered with the CPU and don't use available GPUs. You can enable GPU-accelerated application rendering, frame encoding, and full-screen video encoding using Microsoft Intune or Group Policy.

> [!NOTE]
> GPU-accelerated frame encoding isn't available with NVv4-series VMs.

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To enable GPU-accelerated application rendering using Microsoft Intune:

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Settings catalog** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.

   :::image type="content" source="media/enable-gpu-acceleration/remote-session-environment-intune.png" alt-text="A screenshot showing the redirection options in the Microsoft Intune portal." lightbox="media/enable-gpu-acceleration/remote-session-environment-intune.png":::

1. Select the following settings, then close the settings picker:

   1. For GPU-accelerated application rendering, check the box for **Use hardware graphics adapters for all Remote Desktop Services sessions**.

   1. For GPU accelerated frame encoding, check the box for **Configure H.264/AVC hardware encoding for Remote Desktop connections**.

   1. For full-screen video encoding, check the box for **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections**.

1. Expand the **Administrative templates** category, then set toggle the switch for each setting as follows:

   1. For GPU-accelerated application rendering, set **Use hardware graphics adapters for all Remote Desktop Services sessions** to **Enabled**.

   1. For GPU accelerated frame encoding, set **Configure H.264/AVC hardware encoding for Remote Desktop connections** to **Enabled**.

   1. For full-screen video encoding, set **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** to **Enabled**.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To enable GPU-accelerated application rendering using Group Policy:

1. Open the **Group Policy Management** console on device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.

   :::image type="content" source="media/enable-gpu-acceleration/remote-session-environment-group-policy.png" alt-text="A screenshot showing the redirection options in the Group Policy editor." lightbox="media/enable-gpu-acceleration/remote-session-environment-group-policy.png":::

1. Configure the following settings:

   1. For GPU-accelerated application rendering, double-click the policy setting **Use hardware graphics adapters for all Remote Desktop Services sessions** to open it. Select **Enabled**, then select **OK**.

   1. For GPU accelerated frame encoding, double-click the policy setting **Configure H.264/AVC hardware encoding for Remote Desktop connections** to open it. Select **Enabled**, then select **OK**. If you're using Windows Server 2016, you see an extra drop-down menu in the setting; set **Prefer AVC Hardware Encoding** to **Always attempt**.

   1. For full-screen video encoding, double-click the policy setting **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** to open it. Select **Enabled**, then select **OK**.

1. Ensure the policy is applied to your session hosts, then restart them for the settings to take effect.

---

## Verify GPU acceleration

To verify that a remote session is using GPU acceleration, GPU-accelerated application rendering, frame encoding, and full-screen video encoding:

1. Connect to one of the session hosts you configured, either through Azure Virtual Desktop or a direct RDP connection.

1. Open an application that uses GPU acceleration and generate some load for the GPU.

1. Open Task Manager and go to the **Performance** tab. Select the GPU to see whether the GPU is being utilized by the application.

   :::image type="content" source="media/enable-gpu-acceleration/task-manager-rdp-gpu.png" alt-text="A screenshot showing the GPU usage in Task Manager when in a Remote Desktop session." lightbox="media/enable-gpu-acceleration/task-manager-rdp-gpu.png":::

   > [!TIP]
   > For NVIDIA GPUs, you can also use the `nvidia-smi` utility to check for GPU utilization when running your application. For more information, see [Verify driver installation](../virtual-machines/windows/n-series-driver-setup.md#verify-driver-installation).

1. Open Event Viewer from the start menu, or run `eventvwr.msc` from the command line.

1. Navigate to one of the following locations:

   1. For connections through Azure Virtual Desktop, go to **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**.

   1. For connections through a direct RDP connection, go to **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreTs** > **Operational**.

1. Look for the following event IDs:

   - **Event ID 170**: If you see **AVC hardware encoder enabled: 1** in the event text, RDP is using GPU-accelerated frame encoding.

   - **Event ID 162**: If you see **AVC available: 1, Initial Profile: 2048** in the event text, RDP is using full-screen video encoding (H.264/AVC 444).

## Related content

Increase the [default chroma value](configure-default-chroma-value.md) to improve the image quality.
