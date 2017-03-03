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
ms.date: 12/07/2016
ms.author: danlep

---
# Set up GPU drivers for N-series VMs
To take advantage of the GPU capabilities of Azure N-series VMs running a supported Linux distribution, you must install NVIDIA graphics drivers on each VM after deployment. This article is also available for [Windows VMs](virtual-machines-windows-n-series-driver-setup.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

For N-series VM specs, storage capacities, and disk details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).



## Supported GPU drivers


> [!NOTE]
> Currently, Linux GPU support is only available on Azure NC VMs running Ubuntu Server 16.04 LTS.

### NVIDIA Tesla drivers for NC VMs

* [Ubuntu 16.04 LTS](https://go.microsoft.com/fwlink/?linkid=836899) (.run self-extracting installer)

## Tesla driver installation on Ubuntu 16.04 LTS

1. Make an SSH connection to the Azure N-series VM.

2. To verify that the system has a CUDA-capable GPU, run the following command:

    ```bash
    lspci | grep -i NVIDIA
    ```
    You will see output similar to the following example (showing an NVIDIA Tesla K80 card):

    ![lspci command output](./media/virtual-machines-linux-n-series-driver-setup/lspci.png)

3. Download the .run file for the driver for your distribution. The following example command downloads the Ubuntu 16.04 LTS Tesla driver to the /tmp directory:

    ```bash
    wget -O /tmp/NVIDIA-Linux-x86_64-367.48.run https://go.microsoft.com/fwlink/?linkid=836899
    ```

4. If you need to install `gcc` and `make` on your system (required for the Tesla drivers), type the following:

    ```bash
    sudo apt-get update
    
    sudo apt install gcc

    sudo apt install make
    ```

4. Change to the directory containing the driver installer and run commands similar to the following:

    ```bash
    chmod +x NVIDIA-Linux-x86_64-367.48.run
    
    sudo sh ./NVIDIA-Linux-x86_64-367.48.run
    ```
6. Silent Install without reboot may be performed via scripts as follows:
 
    ```bash 
    service lightdm stop 
    wget -O NVIDIA-Linux-x86_64-367.48.run https://go.microsoft.com/fwlink/?linkid=836899
    chmod +x NVIDIA-Linux-x86_64-367.48.run
    DEBIAN_FRONTEND=noninteractive apt-mark hold walinuxagent
    DEBIAN_FRONTEND=noninteractive apt-get update -y
    DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential gcc g++ make binutils linux-headers-`uname -r`
    DEBIAN_FRONTEND=noninteractive ./NVIDIA-Linux-x86_64-367.48.run  --silent
    DEBIAN_FRONTEND=noninteractive update-initramfs -u
     ```

## Verify driver installation


To query the GPU device state, run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

![NVIDIA device status](./media/virtual-machines-linux-n-series-driver-setup/smi.png)

## Optional installation of NVIDIA CUDA Toolkit on Ubuntu 16.04 LTS

You can optionally install NVIDIA CUDA Toolkit 8.0 on NC VMs running Ubuntu 16.04 LTS. In addition to GPU drivers, the Toolkit provides a comprehensive development environment for C and C++ developers building GPU-accelerated applications.

To install the CUDA Toolkit, run commands similar to the following:

```bash
CUDA_REPO_PKG=cuda-repo-ubuntu1604_8.0.61-1_amd64.deb

wget -O /tmp/${CUDA_REPO_PKG} http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/${CUDA_REPO_PKG} 

sudo dpkg -i /tmp/${CUDA_REPO_PKG}

rm -f /tmp/${CUDA_REPO_PKG}

sudo apt-get update

sudo apt-get install cuda-drivers
```

The installation can take several minutes.

## Silent and Secure installation of NVIDIA CUDA Toolkit on Ubuntu 16.04 LTS
 
 CUDA Toolkit may be silently and securely installed via scripts as follows
 
 ```bash
 CUDA_REPO_PKG=cuda-repo-ubuntu1604_8.0.61-1_amd64.deb
 DEBIAN_FRONTEND=noninteractive apt-mark hold walinuxagent
 export CUDA_DOWNLOAD_SUM=16b0946a3c99ca692c817fb7df57520c && export CUDA_PKG_VERSION=8-0 && curl -o cuda-repo.deb -fsSL http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/${CUDA_REPO_PKG} && \
     echo "$CUDA_DOWNLOAD_SUM  cuda-repo.deb" | md5sum -c --strict - && \
     dpkg -i cuda-repo.deb && \
     rm cuda-repo.deb && \
     apt-get update -y && apt-get install -y cuda && \
     apt-get install -y nvidia-cuda-toolkit && \
 export LIBRARY_PATH=/usr/local/cuda-8.0/lib64/:${LIBRARY_PATH}  && export LIBRARY_PATH=/usr/local/cuda-8.0/lib64/stubs:${LIBRARY_PATH} && \
 export PATH=/usr/local/cuda-8.0/bin:${PATH}
 ```
 
 ### CUDA Samples Silent Install
 
 [CUDA Samples](http://docs.nvidia.com/cuda/cuda-samples/#new-features-in-cuda-toolkit-8-0) can be installed in a location as follows:
 
 ```bash
 export SHARE_DATA="/data"
 export SAMPLES_USER="samplesuser"
 su -c "/usr/local/cuda-8.0/bin/./cuda-install-samples-8.0.sh $SHARE_DATA" $SAMPLES_USER
 ```

## Silent installation of CUDNN

The NVIDIA CUDA® Deep Neural Network library (cuDNN) is a GPU-accelerated library of primitives for deep neural networks. 
cuDNN provides highly tuned implementations for standard routines such as forward and backward convolution, pooling, normalization, and activation layers.
cuDNN is part of the NVIDIA Deep Learning SDK and it can be installed silently as follows:

 ```bash
    export CUDNN_DOWNLOAD_SUM=a87cb2df2e5e7cc0a05e266734e679ee1a2fadad6f06af82a76ed81a23b102c8 && curl -fsSL http://developer.download.nvidia.com/compute/redist/cudnn/v5.1/cudnn-8.0-linux-x64-v5.1.tgz -O && \
    echo "$CUDNN_DOWNLOAD_SUM  cudnn-8.0-linux-x64-v5.1.tgz" | sha256sum -c --strict - && \
    tar -xzf cudnn-8.0-linux-x64-v5.1.tgz -C /usr/local && \
    rm cudnn-8.0-linux-x64-v5.1.tgz && \
    ldconfig
  ```
## Next steps

* For more information about the NVIDIA GPUs on the N-series VMs, see:
    * [NVIDIA Tesla K80](http://www.nvidia.com/object/tesla-k80.html) (for Azure NC VMs)
    * [NVIDIA Tesla M60](http://www.nvidia.com/object/tesla-m60.html) (for Azure NV VMs)

