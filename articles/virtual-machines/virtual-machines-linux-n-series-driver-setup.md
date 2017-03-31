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
ms.date: 03/10/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---

# Set up GPU drivers for N-series VMs running Linux

To take advantage of the GPU capabilities of Azure N-series VMs running a supported Linux distribution, you must install NVIDIA graphics drivers on each VM after deployment. Driver setup information is also available for [Windows VMs](virtual-machines-windows-n-series-driver-setup.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).


> [!IMPORTANT]
> Currently, Linux GPU support is only available on Azure NC VMs running Ubuntu Server 16.04 LTS.
> 

For N-series VM specs, storage capacities, and disk details, see [Sizes for virtual machines](virtual-machines-linux-sizes.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). See also [General considerations for N-series VMs](#general-considerations-for-n-series-vms).



## Install NVIDIA CUDA drivers

Here are steps to install NVIDIA drivers on Linux NC VMs from the NVIDIA CUDA Toolkit 8.0. C and C++ developers can optionally install the full Toolkit to build GPU-accelerated applications. For more information, see the [CUDA Installation Guide](http://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html).


> [!NOTE]
> Driver download links provided here are current at time of publication. For the latest drivers, visit the [NVIDIA](http://www.nvidia.com/) website.

To install CUDA Toolkit, make an SSH connection to each VM. To verify that the system has a CUDA-capable GPU, run the following command:

```bash
lspci | grep -i NVIDIA
```
You will see output similar to the following example (showing an NVIDIA Tesla K80 card):

![lspci command output](./media/virtual-machines-linux-n-series-driver-setup/lspci.png)

Then run commands specific for your distribution.

### Ubuntu 16.04 LTS

```bash
CUDA_REPO_PKG=cuda-repo-ubuntu1604_8.0.61-1_amd64.deb

wget -O /tmp/${CUDA_REPO_PKG} http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/${CUDA_REPO_PKG} 

sudo dpkg -i /tmp/${CUDA_REPO_PKG}

rm -f /tmp/${CUDA_REPO_PKG}

sudo apt-get update

sudo apt-get install cuda-drivers

```
The installation can take several minutes.

To optionally install the complete CUDA toolkit, type:

```bash
sudo apt-get install cuda
```

Reboot the VM and proceed to verify the installation.

## Verify driver installation


To query the GPU device state, SSH to the VM and run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

![NVIDIA device status](./media/virtual-machines-linux-n-series-driver-setup/smi.png)

## CUDA driver updates

We recommend that you periodically update CUDA drivers after deployment.

### Ubuntu 16.04 LTS

```bash
sudo apt-get update

sudo apt-get upgrade -y

sudo apt-get dist-upgrade -y

sudo apt-get install cuda-drivers
```

After the update completes, restart the VM.


[!INCLUDE [virtual-machines-n-series-considerations](../../includes/virtual-machines-n-series-considerations.md)]

* We don't recommend installing X server or other systems that use the nouveau driver on Ubuntu NC VMs. Before installing NVIDIA GPU drivers, you need to disable the nouveau driver.  

* If you want to capture an image of a Linux VM on which you installed NVIDIA drivers, see [How to generalize and capture a Linux virtual machine](virtual-machines-linux-capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).

#### Installation of NVIDIA CUDA Toolkit
 Installation of NVIDIA CUDA Toolkit.
 
##### Ubuntu 16.04-LTS

	 ```bash
	 CUDA_REPO_PKG=cuda-repo-ubuntu1604_8.0.61-1_amd64.deb
	 DEBIAN_FRONTEND=noninteractive apt-mark hold walinuxagent
	 export CUDA_DOWNLOAD_SUM=1f4dffe1f79061827c807e0266568731 && export CUDA_PKG_VERSION=8-0 && curl -o cuda-repo.deb -fsSL http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/${CUDA_REPO_PKG} && \
	     echo "$CUDA_DOWNLOAD_SUM  cuda-repo.deb" | md5sum -c --strict - && \
	     dpkg -i cuda-repo.deb && \
	     rm cuda-repo.deb && \
	     apt-get update -y && apt-get install -y cuda && \
	     apt-get install -y nvidia-cuda-toolkit && \
	 export LIBRARY_PATH=/usr/local/cuda-8.0/lib64/:${LIBRARY_PATH}  && export LIBRARY_PATH=/usr/local/cuda-8.0/lib64/stubs:${LIBRARY_PATH} && \
	 export PATH=/usr/local/cuda-8.0/bin:${PATH}
	 ```
##### CentOS 7.3
	  ```bash
		wget http://developer.download.nvidia.com/compute/cuda/repos/rhel7/x86_64/cuda-repo-rhel7-8.0.61-1.x86_64.rpm
		rpm -i cuda-repo-rhel7-8.0.61-1.x86_64.rpm
		yum clean all
		yum install -y cuda
	 ```
##### CUDA Samples Install
 
 [CUDA Samples](http://docs.nvidia.com/cuda/cuda-samples/#new-features-in-cuda-toolkit-8-0) can be installed in a location as follows:
 
###### Ubuntu 16.04-LTS
	
		 ```bash
		 export SHARE_DATA="/data"
		 export SAMPLES_USER="samplesuser"
		 su -c "/usr/local/cuda-8.0/bin/./cuda-install-samples-8.0.sh $SHARE_DATA" $SAMPLES_USER
		 ```

###### Centos 7.3
	
		 In /usr/local/cuda-8.0/samples for CentOS 7.3. 

		 * Just a make within each would suffice post successful provisioning.
 
 ##### Optional Unattended, silent NVIDIA Tesla Driver Install:
  
  NVIDIA Tesla Driver Silent Install is as follows:
  
 > :grey_exclamation:
 
 > Currently, this need not be required when using secure cuda-repo-ubuntu1604_8.0.61-1_amd64.deb for Azure NC VMs running Ubuntu Server 16.04 LTS.
 
 > **This is required  for NVIDIA Driver with DKMS (Dynamic Kernel Module Support) for driver load surviving kernel updates.**
	
	###### Ubuntu 16.04-LTS
	```bash 
		service lightdm stop 
		wget  http://us.download.nvidia.com/XFree86/Linux-x86_64/375.39/NVIDIA-Linux-x86_64-375.39.run&lang=us&type=Tesla
		apt-get install -y linux-image-virtual
		apt-get install -y linux-virtual-lts-xenial
		apt-get install -y linux-tools-virtual-lts-xenial linux-cloud-tools-virtual-lts-xenial
		apt-get install -y linux-tools-virtual linux-cloud-tools-virtual
		DEBIAN_FRONTEND=noninteractive apt-mark hold walinuxagent
		DEBIAN_FRONTEND=noninteractive apt-get update -y
		DEBIAN_FRONTEND=noninteractive apt-get install -y build-essential gcc gcc-multilib dkms g++ make binutils linux-headers-`uname -r` linux-headers-4.4.0-70-generic
		chmod +x NVIDIA-Linux-x86_64-375.39.run
		./NVIDIA-Linux-x86_64-375.39.run  --silent --dkms
		DEBIAN_FRONTEND=noninteractive update-initramfs -u
	```
	###### CentOS 7.3

> :grey_exclamation:

> Successful Installation happens on reboot.

> **This is required  for NVIDIA Driver with DKMS (Dynamic Kernel Module Support) for driver load surviving kernel updates.**

	```bash 
		wget http://us.download.nvidia.com/XFree86/Linux-x86_64/375.39/NVIDIA-Linux-x86_64-375.39.run&lang=us&type=Tesla
		yum clean all
		yum update -y  dkms
		yum install -y gcc make binutils gcc-c++ kernel-devel kernel-headers --disableexcludes=all
		yum -y upgrade kernel kernel-devel
		chmod +x NVIDIA-Linux-x86_64-375.39.run

		cat >>~/install_nvidiarun.sh <<EOF
		cd /var/lib/waagent/custom-script/download/0 && \
		./NVIDIA-Linux-x86_64-375.39.run --silent --dkms --install-libglvnd && \
		sed -i '$ d' /etc/rc.d/rc.local && \
		chmod -x /etc/rc.d/rc.local
		rm -rf ~/install_nvidiarun.sh
		EOF

		chmod +x install_nvidiarun.sh
		echo -ne "~/install_nvidiarun.sh" >> /etc/rc.d/rc.local
		chmod +x /etc/rc.d/rc.local
	```
#### Secure Installation of CUDNN
 ##### Both Ubuntu 16.04-LTS and CentOS 7.3

	The NVIDIA CUDA® Deep Neural Network library (cuDNN) is a GPU-accelerated library of primitives for deep neural networks. 
	cuDNN provides highly tuned implementations for standard routines such as forward and backward convolution, pooling, normalization, and activation layers.
	cuDNN is part of the NVIDIA Deep Learning SDK and it can be installed  as follows:

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

