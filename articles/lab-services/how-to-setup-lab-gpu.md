---
title: Set up a lab with GPUs
titleSuffix: Azure Lab Services
description: Learn how to set up a lab in Azure Lab Services with graphics processing unit (GPU) virtual machines.
services: lab-services
ms.service: azure-lab-services
author: RoseHJM
ms.author: rosemalcolm
ms.topic: how-to
ms.date: 11/13/2024
---

# Set up a lab with GPU virtual machines in Azure Lab Services

[!INCLUDE [Retirement guide](./includes/retirement-banner.md)]

[!INCLUDE [preview note](./includes/lab-services-new-update-focused-article.md)]

In this article, you learn how to choose between the different GPU-based virtual machines sizes when creating a lab in Azure Lab Services. Learn how to install the necessary drivers in the lab to take advantage of the GPUs.

## Choose between visualization and compute GPU sizes

When you create a lab in Azure Lab Services, you have to select a virtual machine size. Choose the right virtual machine size, based on the usage scenario.

:::image type="content" source="./media/how-to-setup-gpu/lab-gpu-selection.png" alt-text="Screenshot of the New lab window for creating a new lab in the Lab Services website, highlighting the VM sizes dropdown.":::

Azure Lab Services has two GPU-based virtual machines size categories:

- Compute GPUs
- Visualization GPUs

> [!NOTE]
> You may not see some of these VM sizes in the list when you create a lab. The list of VM sizes is based on the capacity assigned to your Microsoft-managed Azure subscription.  For more information about capacity, see [Capacity limits in Azure Lab Services](../lab-services/capacity-limits.md).  For availability of VM sizes, see [Products available by region](https://azure.microsoft.com/regions/services/?products=virtual-machines).

### Compute GPU sizes

The *compute* GPU size is intended for compute-intensive applications. 

| Size | vCPUs | Memory (GB) | Series | Suggested use | GPU/Accelerator | Accelerator Memory (GB) |
| - | - | - | - | - | - | - |
| Small GPU (Compute) | 8 | 56 | [NC8as_T4_v3](/azure/virtual-machines/nct4-v3-series) | AI & deep learning | NVIDIA Tesla T4 | 16 |
| Alternative Small GPU (Compute) | 6 | 112 | [NC6s_v3](/azure/virtual-machines/ncv3-series) | AI & deep learning | NVIDIA Tesla V100 | 16 |

### Visualization GPU sizes

The *visualization* GPU sizes are intended for graphics-intensive applications.

| Size | vCPUs | Memory (GB) | Series | Suggested use | GPU/Accelerator | Accelerator Memory (GB) |
| - | - | - | - | - | - | - |
| Small GPU (Visualization) | 8 | 28 | [NV8as_v4](/azure/virtual-machines/nvv4-series) | (Windows only) Remote visualization, streaming, gaming | AMD Radeon Instinct MI25 (1/4) | 4 |
| Medium GPU (Visualization) | 12 | 112 | [NV12s_v3](/azure/virtual-machines/nvv3-series) | Remote visualization, streaming, gaming | NVIDIA Tesla M60 | 8 |
| Alternative Small GPU (Visualization) | 6 | 55 | [NV6ads_A10_v5](/azure/virtual-machines/nva10v5-series) | (Windows only) Remote visualization, streaming, gaming | NVIDIA A10 (1/6) | 4 |
| Alternative Medium GPU (Visualization) | 12 | 110 | [NV12ads_A10_v5](/azure/virtual-machines/nva10v5-series) | (Windows only) Remote visualization, streaming, gaming | NVIDIA A10 (1/3) | 8 |


## Ensure that the appropriate GPU drivers are installed

To take advantage of the GPU capabilities of your lab VMs, ensure that the appropriate GPU drivers are installed.  In the lab creation wizard, when you select a GPU VM size, you can select the **Install GPU drivers** option.  This option is enabled by default.

:::image type="content" source="./media/how-to-setup-gpu/lab-gpu-drivers.png" alt-text="Screenshot of the New lab page in the Lab Services website, highlighting the Install GPU drivers option.":::

When you select **Install GPU drivers**, it ensures that recently released drivers are installed for the type of GPU and image that you selected. 

- When you select the Medium GPU *(Visualization)* size, your lab VMs are powered by the [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPU and [GRID technology](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/solutions/resources/documents1/NVIDIA_GRID_vPC_Solution_Overview.pdf).  In this case, recent GRID drivers are installed, which enables the use of graphics-intensive applications.

> [!IMPORTANT]
> The **Install GPU drivers** option only installs the drivers when they aren't present on your lab's image.  For example, NVIDIA GPU drivers are already installed on the Azure marketplace's [Data Science Virtual Machine image](/azure/machine-learning/data-science-virtual-machine/overview#what-does-the-dsvm-include).  If you create a Small GPU (Compute) lab using the Data Science image and choose to **Install GPU drivers**, the drivers won't be updated to a more recent version. To update the drivers, you will need to manually install the drivers.

### Install GPU drivers manually

You might need to install a different version of the drivers than the version that Azure Lab Services installs for you.  This section shows how to manually install the appropriate drivers.

#### Install the Small GPU (Compute) drivers

To manually install drivers for the Small GPU *(Compute)* size, follow these steps:

1. In the lab creation wizard, when you [create your lab](./how-to-manage-labs.md), disable the **Install GPU drivers** setting.

1. After your lab is created, connect to the template VM to install the appropriate drivers. 

    - Follow the detailed installation steps in [NVIDIA Tesla (CUDA) drivers](/azure/virtual-machines/windows/n-series-driver-setup#nvidia-tesla-cuda-drivers) for more information about specific driver versions that are recommended depending on the Windows OS version being used.

       :::image type="content" source="./media/how-to-setup-gpu/nvidia-driver-download.png" alt-text="Screenshot of the NVIDIA Driver Downloads page.":::

    - Alternately, follow these steps to install the latest NVIDIA drivers:
        1. Go to the [NVIDIA Driver Downloads page](https://www.nvidia.com/Download/index.aspx).  
        1. Set the **Product Type** to **Tesla**.
        1. Set the **Product Series** to **V-Series**.
        1. Set the **Operating System** according to the type of base image you selected when you created your lab.
        1. Set the **CUDA Toolkit** to the version of CUDA driver that you need.
        1. Select **Search** to look for your drivers.
        1. Select **Download** to download the installer.
        1. Run the installer so that the drivers are installed on the template VM.

1. Validate that the drivers are installed correctly by following instructions in the [Validate the installed drivers](how-to-setup-lab-gpu.md#validate-the-installed-drivers) section.

1. After you've installed the drivers and other software that is required for your class, select **Publish** to create the lab virtual machines.

> [!NOTE]
> If you're using a Linux image, after you've downloaded the installer, install the drivers by following the instructions in [Install CUDA drivers on Linux](/azure/virtual-machines/linux/n-series-driver-setup?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#install-cuda-drivers-on-n-series-vms).

#### Install the Small GPU (Visualization) drivers

To manually install drivers for the Small GPU *(visualization)* size, follow these steps:

1. In the lab creation wizard, when you [create your lab](./how-to-manage-labs.md), disable the **Install GPU drivers** setting.

1. After your lab is created, connect to the template VM to install the appropriate drivers.

1. Install the AMD drivers template VM by following the instructions in [Install AMD GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-amd-driver-setup).

1. Restart the template VM.

1. Validate that the drivers are installed correctly by following the instructions in the [Validate the installed drivers](./how-to-setup-lab-gpu.md#validate-the-installed-drivers) section.

1. After you've installed the drivers and other software that are required for your class, select **Publish** to create your lab virtual machines.

#### Install the Medium GPU (Visualization) drivers

To manually install drivers for the Medium GPU *(visualization)* size, follow these steps:

1. In the lab creation wizard, when you [create your lab](./how-to-manage-labs.md), disable the **Install GPU drivers** setting.

1. After your lab is created, connect to the template VM to install the appropriate drivers.

1. Install the GRID drivers that are provided by Microsoft on the template VM by following the instructions for your operating system:

   - [Windows NVIDIA GRID drivers](/azure/virtual-machines/windows/n-series-driver-setup#nvidia-gridvgpu-drivers)
   - [Linux NVIDIA GRID drivers](/azure/virtual-machines/linux/n-series-driver-setup?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json#nvidia-grid-drivers)
  
1. Restart the template VM.

1. Validate that the drivers are installed correctly by following the instructions in the [Validate the installed drivers](how-to-setup-lab-gpu.md#validate-the-installed-drivers) section.

1. After you've installed the drivers and other software that are required for your class, select **Publish** to create your lab virtual machines.

### Validate the installed drivers

This section describes how to validate that your GPU drivers are properly installed.

#### Small GPU (Visualization) Windows images

To verify driver installation for **Small GPU (Visualization)** size, see [validate the AMD GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation).

#### Small GPU (Compute) and Medium GPU (Visualization) Windows images

To verify driver installation for **Small GPU (Visualization)** size, see [validate the NVIDIA GPU drivers on N-series VMs running Windows](/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation).

You can also validate the NVIDIA control panel settings, which only apply to the **Medium GPU (visualization)** VM size:

1. View and adjust your GPU settings in the NVIDIA Control Panel. To do so, in **Windows Control Panel**, select **Hardware**, and then select **NVIDIA Control Panel**.

   :::image type="content" source="./media/how-to-setup-gpu/control-panel-nvidia-settings.png" alt-text="Screenshot of Windows Control Panel showing the NVIDIA Control Panel link.":::

1. View your GPU performance by using **Task Manager**.  To do so, select the **Performance** tab, and then select the **GPU** option.

   :::image type="content" source="./media/how-to-setup-gpu/task-manager-gpu.png" alt-text="Screenshot of the Task Manager GPU Performance tab.":::

   > [!IMPORTANT]
   > The NVIDIA Control Panel settings can be accessed only for the Medium GPU (visualization) VM size.  If you attempt to open the NVIDIA Control Panel for a compute GPU, you'll get the error: "NVIDIA Display settings are not available.  You are not currently using a display attached to an NVIDIA GPU."  Similarly, the GPU performance information in Task Manager is provided only for visualization GPUs.

Depending on your scenario, you may also need to do more validation to ensure the GPU is properly configured.  Read the class type about [Python and Jupyter Notebooks](class-type-jupyter-notebook.md#template-machine-configuration) that explains an example where specific versions of drivers are needed.

#### Small GPU (Compute) and Medium GPU (Visualization) Linux images

To verify driver installation for Linux images, see [verify driver installation for NVIDIA GPU drivers on N-series VMs running Linux](/azure/virtual-machines/linux/n-series-driver-setup#verify-driver-installation).

## Next steps

- Learn how to [create and manage labs](how-to-manage-labs.md)
