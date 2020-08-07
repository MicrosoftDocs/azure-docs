---
title: Set up a lab with GPUs in Azure Lab Services | Microsoft Docs
description: Learn how to set up a lab with graphics processing unit (GPU) virtual machines. 
author: nicolela
ms.topic: article
ms.date: 06/26/2020
ms.author: nicolela
---

# Set up a lab with GPU virtual machines

This article shows you how to do the following tasks:

- Choose between *visualization* and *compute* graphics processing units (GPUs).
- Ensure that the appropriate GPU drivers are installed.

## Choose between visualization and compute GPU sizes
On the first page of the lab creation wizard, in the **Which virtual machine size do you need?** drop-down list, you select the size of the VMs that are needed for your class.  

![Screenshot of the "New lab" pane for selecting a VM size](./media/how-to-setup-gpu/lab-gpu-selection.png)

In this process, you have the option of selecting either **Visualization** or **Compute** GPUs.  It's important to choose the type of GPU that's based on the software that your students will use.  

As described in the following table, the *compute* GPU size is intended for compute-intensive applications.  For example, the [Deep Learning in Natural Language Processing class type](./class-type-deep-learning-natural-language-processing.md) uses the **Small GPU (Compute)** size.  The compute GPU is suitable for this type of class, because students use deep learning frameworks and tools that are provided by the [Data Science Virtual Machine image](https://azuremarketplace.microsoft.com/marketplace/apps/microsoft-dsvm.ubuntu-1804) to train deep learning models with large sets of data.

| Size | Cores | RAM | Description | 
| ---- | ----- | --- | ----------- | 
| Small GPU (Compute) | -&nbsp;6&nbsp;cores<br>-&nbsp;56&nbsp;GB&nbsp;RAM  | [Standard_NC6](https://docs.microsoft.com/azure/virtual-machines/nc-series) |This size is best suited for computer-intensive applications such as artificial intelligence (AI) and deep learning. |

The *visualization* GPU sizes are intended for graphics-intensive applications.  For example, the [SolidWorks engineering class type](./class-type-solidworks.md) shows using the **Small GPU (Visualization)** size.  The visualization GPU is suitable for this type of class, because students interact with the SolidWorks 3D computer-aided design (CAD) environment for modeling and visualizing solid objects.

| Size | Cores | RAM | Description | 
| ---- | ----- | --- | ----------- | 
| Small GPU (Visualization) | -&nbsp;6&nbsp;cores<br>-&nbsp;56&nbsp;GB&nbsp;RAM  | [Standard_NV6](https://docs.microsoft.com/azure/virtual-machines/nv-series) | This size is best suited for remote visualization, streaming, gaming, and encoding that use frameworks such as OpenGL and DirectX. |
| Medium GPU (Visualization) | -&nbsp;12&nbsp;cores<br>-&nbsp;112&nbsp;GB&nbsp;RAM  | [Standard_NV12](https://docs.microsoft.com/azure/virtual-machines/nv-series?toc=/azure/virtual-machines/linux/toc.json&bc=/azure/virtual-machines/linux/breadcrumb/toc.json) | This size is best suited for remote visualization, streaming, gaming, and encoding that use frameworks such as OpenGL and DirectX. |

## Ensure that the appropriate GPU drivers are installed
To take advantage of the GPU capabilities of your lab VMs, ensure that the appropriate GPU drivers are installed.  In the lab creation wizard, when you select a GPU VM size, you can select the **Install GPU drivers** option.  

![Screenshot of the "New lab" showing the "Install GPU drivers" option](./media/how-to-setup-gpu/lab-gpu-drivers.png)

As shown in the preceding image, this option is enabled by default, which ensures that the *latest* drivers are installed for the type of GPU and image that you selected.
- When you select a *compute* GPU size, your lab VMs are powered by the [NVIDIA Tesla K80](https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/tesla-product-literature/Tesla-K80-BoardSpec-07317-001-v05.pdf) GPU.  In this case, the latest [Compute Unified Device Architecture (CUDA)](https://www.nvidia.com/object/io_69526.html) drivers are installed, which enables high-performance computing.
- When you select a *visualization* GPU size, your lab VMs are powered by the [NVIDIA Tesla M60](https://images.nvidia.com/content/tesla/pdf/188417-Tesla-M60-DS-A4-fnl-Web.pdf) GPU and [GRID technology](https://www.nvidia.com/content/dam/en-zz/Solutions/design-visualization/solutions/resources/documents1/NVIDIA_GRID_vPC_Solution_Overview.pdf).  In this case, the latest GRID drivers are installed, which enables the use of graphics-intensive applications.

### Install the drivers manually
You might need to install a driver version other than the latest version.  This section shows how to manually install the appropriate drivers, depending on whether you're using a *compute* GPU or a *visualization* GPU.

#### Install the compute GPU drivers

To manually install drivers for the compute GPU size, do the following:

1. In the lab creation wizard, when you're [creating your lab](./how-to-manage-classroom-labs.md), disable the **Install GPU drivers** setting.

1. After your lab is created, connect to the template VM to install the appropriate drivers.

   ![Screenshot of the NVIDIA Driver Downloads page](./media/how-to-setup-gpu/nvidia-driver-download.png) 

   a. In a browser, go to the [NVIDIA Driver Downloads page](https://www.nvidia.com/Download/index.aspx).  
   b. Set the **Product Type** to **Tesla**.  
   c. Set the **Product Series** to **K-Series**.  
   d. Set the **Operating System** according to the type of base image you selected when you created your lab.  
   e. Set the **CUDA Toolkit** to the version of CUDA driver that you need.  
   f. Select **Search** to look for your drivers.  
   g. Select **Download** to download the installer.  
   h. Run the installer so that the drivers are installed on the template VM.  
1. Validate that the drivers are installed correctly by following the instructions in the [Validate the installed drivers](how-to-setup-lab-gpu.md#validate-the-installed-drivers) section. 
1. After you've installed the drivers and other software that are required for your class, select **Publish** to create your students' VMs.

> [!NOTE]
> If you're using a Linux image, after you've downloaded the installer, install the drivers by following the instructions in [Install CUDA drivers on Linux](https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup?toc=/azure/virtual-machines/linux/toc.json#install-cuda-drivers-on-n-series-vms).

#### Install the visualization GPU drivers

To manually install drivers for the visualization GPU size, do the following:

1. In the lab creation wizard, when you're [creating your lab](./how-to-manage-classroom-labs.md), disable the **Install GPU drivers** setting.
1. After your lab is created, connect to the template VM to install the appropriate drivers.
1. Install the GRID drivers that are provided by Microsoft on the template VM by following the instructions for your operating system:
   -  [Windows NVIDIA GRID drivers](https://docs.microsoft.com/azure/virtual-machines/windows/n-series-driver-setup#nvidia-grid-drivers)
   -  [Linux NVIDIA GRID drivers](https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup?toc=/azure/virtual-machines/linux/toc.json#nvidia-grid-drivers)
  
1. Restart the template VM.
1. Validate that the drivers are installed correctly by following the instructions in the [Validate the installed drivers](how-to-setup-lab-gpu.md#validate-the-installed-drivers) section.
1. After you've installed the drivers and other software that are required for your class, select **Publish** to create your students' VMs.

### Validate the installed drivers
This section describes how to validate that your GPU drivers are properly installed.

#### Windows images
1.  Follow the instructions in the "Verify driver installation" section of [Install NVIDIA GPU drivers on N-series VMs running Windows](https://docs.microsoft.com/azure/virtual-machines/windows/n-series-driver-setup#verify-driver-installation).
1.  If you're using a *visualization* GPU, you can also:
    - View and adjust your GPU settings in the NVIDIA Control Panel. To do so, in **Windows Control Panel**, select **Hardware**, and then select **NVIDIA Control Panel**.

      ![Screenshot of Windows Control Panel showing the NVIDIA Control Panel link](./media/how-to-setup-gpu/control-panel-nvidia-settings.png) 

     - View your GPU performance by using **Task Manager**.  To do so, select the **Performance** tab, and then select the **GPU** option.

       ![Screenshot showing the Task Manager GPU Performance tab](./media/how-to-setup-gpu/task-manager-gpu.png) 

      > [!IMPORTANT]
      > The NVIDIA Control Panel settings can be accessed only for *visualization* GPUs.  If you attempt to open the NVIDIA Control Panel for a compute GPU, you'll get the following error: "NVIDIA Display settings are not available.  You are not currently using a display attached to an NVIDIA GPU."  Similarly, the GPU performance information in Task Manager is provided only for visualization GPUs.

#### Linux images
Follow the instructions in the "Verify driver installation" section of [Install NVIDIA GPU drivers on N-series VMs running Linux](https://docs.microsoft.com/azure/virtual-machines/linux/n-series-driver-setup#verify-driver-installation).

## Next steps
See the following articles:

- [Create and manage classroom labs](how-to-manage-classroom-labs.md)
- [SolidWorks computer-aided design (CAD) class type](class-type-solidworks.md)
- [MATLAB (matrix laboratory) class type](class-type-matlab.md)



