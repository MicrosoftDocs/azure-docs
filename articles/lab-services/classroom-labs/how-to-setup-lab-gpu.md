---
title: Set up a lab with GPUs in Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab with GPU (graphics processing unit) virtual machines. 
services: lab-services
documentationcenter: na
author: nicolela
manager: 
editor: ''

ms.service: lab-services
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/28/2020
ms.author: nicolela

---
# Set up a lab with GPU (graphics processing unit) virtual machine size
This article shows you how to do the following tasks:

- Choose between virtualization and compute GPUs
- Ensure the appropriate GPU drivers are installed
- Configure RDP settings to connect to a GPU virtual machine (VM)

## Choose between virtualization and compute GPU sizes
On the first page of the lab creation wizard, you select the **size of the virtual machines** needed for your class.  

![Select VM Size](../media/how-to-setup-gpu/lab-gpu-selection.png)

Here, you have the option of choosing between **Visualization** and **Compute** GPUs.  It's important that you choose the appropriate type of GPU based on the software that your students will use.  

As described in the below table, the **Compute** GPU size is intended for compute-intensive applications.  For example, the [Deep Learning in Natural Language Processing class type](./class-type-deep-learning-natural-language-processing.md) shows using the **Small GPU (Compute)** size.  The **Compute** GPU is suitable for this type of class since students use deep learning frameworks and tools provided by the [Data Science Virtual Machine image](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804) to train deep learning models with large sets of data.

| Size | Cores | RAM | Description | 
| ---- | ----- | --- | ----------- | 
| Small GPU (Compute) | <ul><li>6 Cores</li><li>56 GB RAM</li></ul>  | [Standard_NC6](https://docs.microsoft.com/azure/virtual-machines/nc-series) |This size is best suited for computer-intensive applications like Artificial Intelligence and Deep Learning. |

The **Visualization** sizes are intended for graphics-intensive applications.  For example, the [SolidWorks engineering class type](./class-type-solidworks.md) shows using the **Small GPU (Visualization)** size.  The **Visualization** GPU is suitable for this type of class since students interact with SolidWorks' 3D computer-aided design (CAD) environment for modeling and visualizing solid objects.

| Size | Cores | RAM | Description | 
| ---- | ----- | --- | ----------- | 
| Small GPU (Visualization) | <ul><li>6 Cores</li><li>56 GB RAM</li>  | [Standard_NV6](https://docs.microsoft.com/azure/virtual-machines/nv-series) | This size is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX. |
| Medium GPU (Visualization) | <ul><li>12 Cores</li><li>112 GB RAM</li></ul>  | [Standard_NV12](https://docs.microsoft.com/azure/virtual-machines/nv-series?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json) | This size is best suited for remote visualization, streaming, gaming, encoding using frameworks such as OpenGL and DirectX. |

## Ensure the appropriate GPU drivers are installed
To take advantage of the GPU capabilities of your lab VMs, you must ensure that the appropriate GPU drivers are installed.  In the lab creation wizard when you select a GPU VM size, there is the option to **Install GPU drivers**.  

![Install GPU Drivers](../media/how-to-setup-gpu/lab-gpu-drivers.png)

This option is **enabled** by default and ensures that the *latest* drivers are installed for the type of GPU and image that you selected:
- When you select the **Compute** GPU size, your lab VMs are powered by the [NVIDIA Tesla K80](https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/tesla-product-literature/Tesla-K80-BoardSpec-07317-001-v05.pdf) GPU.  In this case, the latest [CUDA](https://www.nvidia.com/object/io_69526.html) drivers are installed to enable high-performance computing.
- When you select a **Visualization** GPU size, your lab VMs are powered by the [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPU and [GRID technology](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/solutions/resources/documents1/NVIDIA_GRID_vPC_Solution_Overview.pdf).  In this case, the latest GRID drivers are installed to enable graphics-intensive applications.

> [!IMPORTANT]
> To have the best user experience with **Visualization** GPUs, you must ensure that *both* the drivers are installed *and* the GPU is enabled over RDP connections.  See the steps in the section called [Enable GPU over RDP connection to Windows VMs](how-to-setup-lab-gpu.md#enable-gpu-over-rdp-connection-to-windows-vms).

### Manually install drivers
You may have scenarios where you need to install a different version of the drivers than the latest version.  The steps in this section show how to manually install the appropriate drivers depending on if you are using a **Compute** or **Visualization** GPU.

#### Compute GPU drivers
Follow these steps to manually install drivers for the **Compute** GPU size:
1. When [creating your lab](./how-to-manage-classroom-labs.md), **disable** the **Install GPU drivers** setting in the lab creation wizard.
1. After your lab is created, connect to the template VM to install the appropriate drivers.
   ![NVIDIA Drivers Download](../media/how-to-setup-gpu/nvidia-driver-download.png) 
   1. In your browser, open [NVIDIA's Driver Downloads page](https://www.nvidia.com/Download/index.aspx).
   2. Set the **Product Type** to **Tesla**.
   3. Set the **Product Series** to **K-Series**.
   4. Set the **Product** to **Tesla K80**.
   5. Set the **Operating System** according to the type of base image you selected when creating your lab.
   6. Set the **CUDA Toolkit** to the version of the CUDA drivers that you need.
   7. Click **Search** to find your drivers.
   8. Click **Download** to download the installer.
   9. Run the installer so that the drivers are installed on the template VM.  
2. Validate the drivers installed correctly by following the steps in the section called [Validate installed drivers](how-to-setup-lab-gpu.md#validate-installed-drivers). 
3. After you have installed the drivers and other software required for your class, you can click **Publish** to create your students' VMs.

> [!NOTE]
> If you are using a Linux image, also refer to the following steps to install the drivers after you've downloaded the installer: [Install CUDA drivers on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup?toc=/azure/virtual-machines/linux/toc.json#install-cuda-drivers-on-n-series-vms).

#### Visualization GPU drivers
Follow these steps to manually install drivers for the **Visualization** GPU sizes:
1. When [creating your lab](./how-to-manage-classroom-labs.md), **disable** the **Install GPU drivers** setting in the lab creation wizard.
1. After your lab is created, connect to the template VM to install the appropriate drivers.
1. Install the GRID drivers that are provided by Microsoft on the template VM by following these steps:
   -  [Windows NVIDIA GRID drivers](https://docs.microsoft.com/azure/virtual-machines/windows/n-series-driver-setup#nvidia-grid-drivers)
   -  [Linux NVIDIA GRID drivers](https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup?toc=/azure/virtual-machines/linux/toc.json#nvidia-grid-drivers)
  
1. Restart the template VM.
1. Validate the drivers installed correctly by following the steps in the section called [Validate installed drivers](how-to-setup-lab-gpu.md#validate-installed-drivers).
1. Configure RDP settings to enable GPU by following the steps in the section called [Enable GPU over RDP connection to Windows VMs](how-to-setup-lab-gpu.md#enable-gpu-over-rdp-connection-to-windows-vms).
1. After you have installed the drivers and other software required for your class, you can click **Publish** to create your students' VMs.

### Validate installed drivers
The steps in this section describe how to validate that your GPU drivers are properly installed.

#### Windows images
1.  Follow the steps in the article that shows how to [verify driver installation on Windows](https://docs.microsoft.com/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation).
1.  If you are using a **Visualization** GPU, you can also:
    - Access the **NVIDIA Control Panel** to view and adjust your GPU settings.  To access these settings, open **Control Panel > Hardware** and select the **NVIDIA Control Panel**.
      ![Open NVIDIA Control Panel](../media/how-to-setup-gpu/control-panel-nvidia-settings.png) 
     - View your GPU performance using **Task Manager**.  To view this, open **Task Manager** and select the **Performance** tab.
      ![Task Manager GPU Performance](../media/how-to-setup-gpu/task-manager-gpu.png) 

      > [!IMPORTANT]
      > The **NVIDIA Control Panel** settings can only be accessed for **Visualization** GPUs.  If you attempt to open the **NVIDIA Control Panel** for a **Compute** GPU, you will see the following error: **NVIDIA Display settings are not available.  You are not currently using a display attached to an NVIDIA GPU.**  Similarly, the GPU Performance information in **Task Manager** is only provided for **Visualization** GPUs.

#### Linux images
Follow the steps in the article that shows how to [verify driver installation on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup#verify-driver-installation).

## Enable GPU over RDP connection to Windows VMs
When using RDP (remote desktop protocol) to connect to a Windows VM that is powered by a **Visualization** GPU, you need to do some extra configuration so that the GPU is used for rendering graphics (otherwise the CPU will be used).

The below steps need to be completed on the template VM.

1. First, configure RDP settings for using the GPU:

   1. Follow the steps in this article that shows how to [configure GPU-accelerated app rendering](https://docs.microsoft.com/azure/virtual-desktop/configure-vm-gpu#configure-gpu-accelerated-app-rendering).

   2. Follow the steps in this article that shows how to [configure GPU-accelerated frame encoding](https://docs.microsoft.com/azure/virtual-desktop/configure-vm-gpu#configure-gpu-accelerated-frame-encoding).

2. Next, verify the configuration: 

   1. Follow the steps in this article that shows how to [verify GPU-accelerated app rendering](https://docs.microsoft.com/azure/virtual-desktop/configure-vm-gpu#verify-gpu-accelerated-app-rendering).

   2.  Follow the steps in this article that shows how to [verify GPU-accelerated frame encoding](https://docs.microsoft.com/azure/virtual-desktop/configure-vm-gpu#verify-gpu-accelerated-frame-encoding).

3. Finally, you now have the drivers installed and have RDP settings configured to use your GPU.  After you've installed other software required for your class, you can click **Publish** to create your students' VMs.  When your students connect to their VMs using RDP, their desktop will be rendered using their VM's GPU.

## Next steps
See the following articles:

- [Create and manage classroom labs](how-to-manage-classroom-labs.md)
- [SolidWorks computer-aided design (CAD) class type](class-type-solidworks.md)
- [MATLAB class type](class-type-matlab.md)



