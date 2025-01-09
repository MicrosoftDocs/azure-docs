---
title: Enable GPU acceleration for Azure Virtual Desktop
description: Learn how to enable GPU-accelerated rendering and encoding, including HEVC/H.265 and AVC/H.264 support, in Azure Virtual Desktop.
ms.topic: how-to
author: dknappettmsft
ms.author: daknappe
ms.date: 09/19/2024
---

# Enable GPU acceleration for Azure Virtual Desktop

> [!IMPORTANT]
> High Efficiency Video Coding (H.265) hardware acceleration is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Azure Virtual Desktop supports graphics processing unit (GPU) acceleration in rendering and encoding for improved app performance and scalability using the Remote Desktop Protocol (RDP). GPU acceleration is crucial for graphics-intensive applications, such as those used by graphic designers, video editors, 3D modelers, data analysts, or visualization specialists.

There are three components to GPU acceleration in Azure Virtual Desktop that work together to improve the user experience:

- **GPU-accelerated application rendering**: Use the GPU to render graphics in a remote session.

- **GPU-accelerated frame encoding**: The Remote Desktop Protocol encodes all graphics rendered for transmission to the local device. When part of the screen is frequently updated, it's encoded with the Advanced Video Coding (AVC) video codec, also known as H.264. 

- **Full-screen video encoding**: A full-screen video profile provides a higher frame rate and better user experience, but uses more network bandwidth and both session host and client resources. It benefits applications such as 3D modeling, CAD/CAM, or video playback and editing. You can choose to encode it with:
   - AVC/H.264.
   - High Efficiency Video Coding (HEVC), also known as H.265. This allows for 25-50% data compression compared to AVC/H.264, at the same video quality or improved quality at the same bitrate.

> [!NOTE]
> - If you enable both HEVC/H.265 and AVC/H.264 hardware acceleration, but HEVC/H.265 isn't available on the local device, AVC/H.264 is used instead.
>
> - You can enable full-screen video encoding with AVC/H.264 even without GPU acceleration, but HEVC/H.265 requires a compatible GPU-enabled remote virtual machine.
>
> - You can also increase the [default chroma value](configure-default-chroma-value.md) to improve the image quality.

This article shows you which Azure VM sizes you can use as a session host with GPU acceleration, and how to enable GPU acceleration for rendering and encoding.

## Supported GPU-optimized Azure VM sizes

The following table lists which Azure VM sizes are optimized for GPU acceleration and supported as session hosts in Azure Virtual Desktop:

| Azure VM size | GPU-accelerated application rendering | GPU-accelerated frame encoding | Full-screen video encoding |
|--|--|--|--|
| [NVv3-series](/azure/virtual-machines/nvv3-series) | Supported | AVC/H.264 | HEVC/H.265<br />AVC/H.264 |
| [NVv4-series](/azure/virtual-machines/nvv4-series) | Supported | Not available | Supported |
| [NVadsA10 v5-series](/azure/virtual-machines/nva10v5-series) | Supported | AVC/H.264 | HEVC/H.265<br />AVC/H.264 |
| [NCasT4_v3-series](/azure/virtual-machines/nct4-v3-series) | Supported | AVC/H.264 | HEVC/H.265<br />AVC/H.264 |

The right choice of VM size depends on many factors, including your particular application workloads, desired quality of user experience, and cost. In general, larger and more capable GPUs offer a better user experience at a given user density. Smaller and fractional GPU sizes allow more fine-grained control over cost and quality.

VM sizes with an NVIDIA GPU come with a GRID license that supports 25 concurrent users.

> [!IMPORTANT]
> Azure NC, NCv2, NCv3, ND, and NDv2 series VMs aren't generally appropriate as session hosts. These VM sizes are tailored for specialized, high-performance compute or machine learning tools, such as those built with NVIDIA CUDA. They don't support GPU acceleration for most applications or the Windows user interface.

## Prerequisites

Before you can enable GPU acceleration, you need:

- An existing host pool with session hosts using a [supported GPU-optimized Azure VM size](#supported-gpu-optimized-azure-vm-sizes) for the graphics features you want to enable. Supported graphics drivers are listed in [Install supported graphics drivers in your session hosts](#install-supported-graphics-drivers-in-your-session-hosts).

- To configure Microsoft Intune, you need:

   - Microsoft Entra ID account that is assigned the [Policy and Profile manager](/mem/intune/fundamentals/role-based-access-control-reference#policy-and-profile-manager) built-in RBAC role.
   - A group containing the devices you want to configure.

- To configure Group Policy, you need:

   - A domain account that has permission to create or edit Group Policy objects.
   - A security group or organizational unit (OU) containing the devices you want to configure.

In addition, for HEVC/H.265 hardware acceleration you also need:

- Session hosts must be running [Windows 10 or Windows 11](prerequisites.md#operating-systems-and-licenses).

- A desktop application group. RemoteApp isn't supported.

- If you [increased the chroma value to 4:4:4](graphics-chroma-value-increase-4-4-4.md), the chroma value falls back to 4:2:0 when using HEVC hardware acceleration.

- Disable [multimedia redirection](multimedia-redirection.md) on your session hosts by uninstalling the host component.

- The [Administrative template for Azure Virtual Desktop](administrative-template.md) available in Group Policy to configure your session hosts.

- A local Windows device you use to connect to a remote session must have:

   - A GPU that has HEVC (H.265) 4K YUV 4:2:0 decode support. For more information, see the manufacturer's documentation. Here are some links to documentation for some manufacturers:
     - [NVIDIA](https://developer.nvidia.com/video-encode-and-decode-gpu-support-matrix-new)
     - [AMD](https://www.amd.com/en/products/specifications/graphics.html)
     - [Intel](https://www.intel.com/content/www/us/en/docs/onevpl/developer-reference-media-intel-hardware/1-0/overview.html#DECODE-SUPPORT)

   - Microsoft HEVC codec installed. The Microsoft HEVC codec is included in clean installs of Windows 11 22H2 or later. You can also [purchase the Microsoft HEVC codec from the Microsoft Store](https://www.microsoft.com/store/productid/9NMZLZ57R3T7?ocid=pdpshare).

   - One of the following apps to connect to a remote session. Other platforms and versions aren't supported.
     - Windows App on Windows, version 1.3.278.0 or later.
     - Remote Desktop app on Windows, version 1.2.4671.0 or later.

## Install supported graphics drivers in your session hosts

To take advantage of the GPU capabilities of Azure N-series VMs in Azure Virtual Desktop, you must install the appropriate graphics drivers. Follow the instructions at [Supported operating systems and drivers](/azure/virtual-machines/sizes-gpu#supported-operating-systems-and-drivers) to learn how to install drivers.

> [!IMPORTANT]
> Only Azure-distributed drivers are supported.

When installing drivers, here are some important guidelines:

- For VMs sizes with an NVIDIA GPU, only NVIDIA *GRID* drivers support GPU acceleration for most applications and the Windows user interface. NVIDIA *CUDA* drivers don't support GPU acceleration for these VM sizes. To download and learn how to install the driver, see [Install NVIDIA GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-driver-setup) and be sure to install the GRID driver. If you install the driver by using the [NVIDIA GPU Driver Extension](/azure/virtual-machines/extensions/hpccompute-gpu-windows), the GRID driver is automatically installed for these VM sizes.

   - For HEVC/H.265 hardware acceleration, you must use NVIDIA GPU driver GRID 16.2 (537.13) or later.

- For VMs sizes with an AMD GPU, install the AMD drivers that Azure provides. To download and learn how to install the driver, see [Install AMD GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-amd-driver-setup). 

## Enable GPU-accelerated application rendering, frame encoding, and full-screen video encoding

By default, remote sessions are rendered with the CPU and don't use available GPUs. You can enable GPU-accelerated application rendering, frame encoding, and full-screen video encoding using Microsoft Intune or Group Policy.

Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

> [!IMPORTANT]
> HEVC/H.265 hardware acceleration isn't available in the Intune Settings Catalog yet.

To enable GPU-accelerated application rendering using Intune:

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

1. After the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To enable GPU-accelerated application rendering using Group Policy:

1. Open the **Group Policy Management** console on a device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Remote Session Environment**.

   :::image type="content" source="media/enable-gpu-acceleration/remote-session-environment-group-policy.png" alt-text="A screenshot showing the redirection options in the Group Policy editor." lightbox="media/enable-gpu-acceleration/remote-session-environment-group-policy.png":::

1. Configure the following settings:

   1. For GPU-accelerated application rendering, double-click the policy setting **Use hardware graphics adapters for all Remote Desktop Services sessions** to open it. Select **Enabled**, then select **OK**.

   1. For GPU accelerated frame encoding, double-click the policy setting **Configure H.264/AVC hardware encoding for Remote Desktop Connections** to open it. Select **Enabled**, then select **OK**. If you're using Windows Server 2016, you see an extra drop-down menu in the setting; set **Prefer AVC Hardware Encoding** to **Always attempt**.

   1. For full-screen video encoding using AVC/H.264 only, double-click the policy setting **Prioritize H.264/AVC 444 Graphics mode for Remote Desktop connections** to open it. Select **Enabled**, then select **OK**.

1. For full-screen video encoding using HEVC/H.265 only, navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Azure Virtual Desktop**.

   :::image type="content" source="media/administrative-template/azure-virtual-desktop-gpo.png" alt-text="A screenshot showing the Azure Virtual Desktop options in Group Policy." lightbox="media/administrative-template/azure-virtual-desktop-gpo.png":::

1. Double-click the policy setting **Configure H.265/HEVC hardware encoding for Remote Desktop Connections** to open it. Select **Enabled**, then select **OK**.

1. Ensure the policy is applied to your session hosts, then restart them for the settings to take effect.

---

## Verify GPU acceleration

To verify that a remote session is using GPU acceleration, GPU-accelerated application rendering, frame encoding, or full-screen video encoding:

1. If you want to verify HEVC/H.265 hardware acceleration, complete the following extra steps:

   1. Make sure the local Windows device has the Microsoft HEVC codec installed by opening a PowerShell prompt and run the following command:

      ```powershell
      Get-AppxPackage -Name "Microsoft.HEVCVideoExtension" | FT Name, Version
      ```
   
      The output should be similar to the following output:

      ```output
      Name                         Version
      ----                         -------
      Microsoft.HEVCVideoExtension 2.1.1161.0
      ```

   1. Make sure [multimedia redirection](multimedia-redirection.md) is disabled on the session host if you're using it.

1. Connect to one of the session hosts you configured, either through Azure Virtual Desktop or a direct RDP connection.

1. Open an application that uses GPU acceleration and generate some load for the GPU.

1. Open Task Manager and go to the **Performance** tab. Select the GPU to see whether the GPU is being utilized by the application.

   :::image type="content" source="media/enable-gpu-acceleration/task-manager-rdp-gpu.png" alt-text="A screenshot showing the GPU usage in Task Manager when in a Remote Desktop session." lightbox="media/enable-gpu-acceleration/task-manager-rdp-gpu.png":::

   > [!TIP]
   > For NVIDIA GPUs, you can also use the `nvidia-smi` utility to check for GPU utilization when running your application. For more information, see [Verify driver installation](/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation).

1. Open Event Viewer from the start menu, or run `eventvwr.msc` from the command line.

1. Navigate to one of the following locations:

   1. For connections through Azure Virtual Desktop, go to **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreCDV** > **Operational**.

   1. For connections through a direct RDP connection, go to **Applications and Services Logs** > **Microsoft** > **Windows** > **RemoteDesktopServices-RdpCoreTs** > **Operational**.

1. Look for the following event IDs:

   - **Event ID 170**: If you see **AVC hardware encoder enabled: 1** in the event text, GPU-accelerated frame encoding is in use.

   - **Event ID 162**:
      - If you see **AVC available: 1, Initial Profile: 2048** in the event text, GPU-accelerated frame encoding with AVC/H.264 and full-screen video encoding is in use.
      - If you see **AVC available: 1, Initial Profile: 32768** in the event text, GPU-accelerated frame encoding with HEVC/H.265 is in use.

## Related content

Increase the [default chroma value](configure-default-chroma-value.md) to improve the image quality.
