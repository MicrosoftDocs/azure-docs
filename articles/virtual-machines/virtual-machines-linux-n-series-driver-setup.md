---
title: Azure N-series driver setup for Linux | Microsoft Docs
description: How to set up NVIDIA GPU drivers for N-series VMs running Linux in Azure
services: virtual-machines-linux
documentationcenter: ''
author: dlepow
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: d91695d0-64b9-4e6b-84bd-18401eaecdde
ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 02/23/2017
ms.author: danlep

---
# Set up GPU drivers for N-series VMs
To take advantage of the GPU capabilities of Azure N-series VMs running a supported Linux distribution, you must install NVIDIA graphics drivers on each VM after deployment. Driver setup information is also available for [Windows VMs](virtual-machines-windows-n-series-driver-setup.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

For N-series VM specs, storage capacities, and disk details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

> [!NOTE]
> Driver download links provided here are current at time of publication. For the latest drivers, visit the [NVIDIA](http://www.nvidia.com/Download/index.aspx) website. Use of NVIDIA drivers is subject to the [License for Customer Use of NVIDIA Software](http://www.nvidia.com/content/DriverDownload-March2009/licence.php?lang=us).
>
> Currently, Linux GPU support is only available on Azure NC VMs.
>

## Supported GPU drivers


### NVIDIA Tesla drivers for NC VMs (Tesla K80)

| OS | Driver version |
| -------- |------------- |
| Ubuntu 16.04 LTS | [375.39](http://us.download.nvidia.com/XFree86/Linux-x86_64/375.39/NVIDIA-Linux-x86_64-375.39.run) (.run) |
| CentOS 7.3 | [375.39](http://us.download.nvidia.com/XFree86/Linux-x86_64/375.39/NVIDIA-Linux-x86_64-375.39.run) (.run) |



## Tesla driver installation

Following are sample driver installation steps on Ubuntu 16.04 LTS. Follow similar steps on other Linux distributions.

1. Make an SSH connection to the Azure N-series VM.

2. To verify that the system has a CUDA-capable GPU, run the following command:

    ```bash
    lspci | grep -i NVIDIA
    ```
    You will see output similar to the following example (showing an NVIDIA Tesla K80 card):

    ![lspci command output](./media/virtual-machines-linux-n-series-driver-setup/lspci.png)

3. Download the .run file for the driver for your distribution. The following example command downloads the Ubuntu 16.04 LTS Tesla driver to the /tmp directory:

    ```bash
    wget -O /tmp/NVIDIA-Linux-x86_64-375.39.run http://us.download.nvidia.com/XFree86/Linux-x86_64/375.39/NVIDIA-Linux-x86_64-375.39.run
    ```

4. If you need to install `gcc` and `make` on your system (required for the Tesla drivers), type the following:

    ```bash
    sudo apt-get update
    
    sudo apt install gcc

    sudo apt install make
    ```

4. Change to the directory containing the driver installer and run commands similar to the following:

    ```bash
    chmod +x NVIDIA-Linux-x86_64-375.39.run
    
    sudo sh ./NVIDIA-Linux-x86_64-375.39.run
    ```

## Verify driver installation


To query the GPU device state, run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

![NVIDIA device status](./media/virtual-machines-linux-n-series-driver-setup/smi.png)

## Optional installation of NVIDIA CUDA Toolkit 8

You can optionally install NVIDIA CUDA Toolkit 8.0 on Linux NC VMs. In addition to GPU drivers, the Toolkit provides a comprehensive development environment for C and C++ developers building GPU-accelerated applications.

Following are sample commands to install the CUDA Toolkit on Ubuntu 16.04 LTS. Follow similar steps on other Linux distributions. For more information, see the [CUDA Installation Guide](http://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html).

```bash
CUDA_REPO_PKG=cuda-repo-ubuntu1604_8.0.61-1_amd64.deb

wget -O /tmp/${CUDA_REPO_PKG} http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/${CUDA_REPO_PKG} 

sudo dpkg -i /tmp/${CUDA_REPO_PKG}

rm -f /tmp/${CUDA_REPO_PKG}

sudo apt-get update

sudo apt-get install cuda
```
The installation can take several minutes.

To install or update only the CUDA drivers, type:

```bash
sudo apt-get install cuda-drivers
```

## Next steps

* For more information about the NVIDIA GPUs on the N-series VMs, see:
    * [NVIDIA Tesla K80](http://www.nvidia.com/object/tesla-k80.html) (for Azure NC VMs)
    * [NVIDIA Tesla M60](http://www.nvidia.com/object/tesla-m60.html) (for Azure NV VMs)

