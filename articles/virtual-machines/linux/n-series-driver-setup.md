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
ms.date: 06/08/2017
ms.author: danlep
ms.custom: H1Hack27Feb2017

---

# Install NVIDIA GPU drivers on N-series VMs running Linux

To take advantage of the GPU capabilities of Azure N-series VMs running Linux, install NVIDIA graphics drivers on each VM. This article provides driver setup steps after you deploy an N-series VM. Driver setup information is also available for [Windows VMs](../windows/n-series-driver-setup.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).


For N-series VM specs, storage capacities, and disk details, see [GPU Linux VM sizes](sizes-gpu.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json). 



## Supported distributions and drivers


N-series Linux VMs support the following distributions from the Azure Marketplace and the listed NVIDIA drivers.


| VM series | Supported distros | Supported drivers |
| --- | --- | --- |
| **NC** (Tesla K80 card) | Ubuntu 16.04 LTS<br/><br/> Red Hat Enterprise Linux 7.3<br/><br/> CentOS-based 7.3 | NVIDIA CUDA 8.0, driver branch R375<br/>[Installation steps](#install-cuda-drivers-for-nc-vms) |
| **NV** (Tesla M60 card)| Ubuntu 16.04 LTS<br/><br/>Red Hat Enterprise Linux 7.3<br/><br/>CentOS-based 7.3 | NVIDIA GRID 4.2, driver branch R367<br/>[Installation steps](#install-grid-drivers-for-nv-vms) |



> [!WARNING] 
> Installation of third-party software on Red Hat products can affect the Red Hat support terms. See the [Red Hat Knowledgebase article](https://access.redhat.com/articles/1067).
>




## Install CUDA drivers for NC VMs

Here are steps to install NVIDIA drivers on Linux NC VMs from the NVIDIA CUDA Toolkit 8.0. 

C and C++ developers can optionally install the full Toolkit to build GPU-accelerated applications. For more information, see the [CUDA Installation Guide](http://docs.nvidia.com/cuda/cuda-installation-guide-linux/index.html).


> [!NOTE]
> CUDA driver download links provided here are current at time of publication. For the latest CUDA drivers, visit the [NVIDIA](http://www.nvidia.com/) website.
>

To install CUDA Toolkit, make an SSH connection to each VM. To verify that the system has a CUDA-capable GPU, run the following command:

```bash
lspci | grep -i NVIDIA
```
You will see output similar to the following example (showing an NVIDIA Tesla K80 card):

![lspci command output](./media/n-series-driver-setup/lspci.png)

Then run commands specific for your distribution.

### Ubuntu 16.04 LTS

1. Download and install the CUDA drivers.
  ```bash
  CUDA_REPO_PKG=cuda-repo-ubuntu1604_8.0.61-1_amd64.deb

  wget -O /tmp/${CUDA_REPO_PKG} http://developer.download.nvidia.com/compute/cuda/repos/ubuntu1604/x86_64/${CUDA_REPO_PKG} 

  sudo dpkg -i /tmp/${CUDA_REPO_PKG}

  rm -f /tmp/${CUDA_REPO_PKG}

  sudo apt-get update

  sudo apt-get install cuda-drivers

  ```

  The installation can take several minutes.

2. To optionally install the complete CUDA toolkit, type:

  ```bash
  sudo apt-get install cuda
  ```

3. Reboot the VM and proceed to verify the installation.

### CentOS-based 7.3 or Red Hat Enterprise Linux 7.3


1. Get updates. 

  ```bash
  sudo yum update

  sudo reboot
  ```
2. Reconnect to the VM and install the latest Linux Integration Services for Hyper-V:
 
  ```bash
  wget http://download.microsoft.com/download/6/8/F/68FE11B8-FAA4-4F8D-8C7D-74DA7F2CFC8C/lis-rpms-4.2.1.tar.gz
 
  tar xvzf lis-rpms-4.2.1.tar.gz
 
  cd LISISO
 
  sudo ./install.sh
 
  sudo reboot
  ```
 
3. Reconnect to the VM and continue installation with the following commands:

  ```bash
  sudo yum install kernel-devel

  sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm

  sudo yum install dkms

  CUDA_REPO_PKG=cuda-repo-rhel7-8.0.61-1.x86_64.rpm

  wget http://developer.download.nvidia.com/compute/cuda/repos/rhel7/x86_64/${CUDA_REPO_PKG} -O /tmp/${CUDA_REPO_PKG}

  sudo rpm -ivh /tmp/${CUDA_REPO_PKG}

  rm -f /tmp/${CUDA_REPO_PKG}

  sudo yum install cuda-drivers
  ```

  The installation can take several minutes. 

4. To optionally install the complete CUDA toolkit, type:

  ```bash
  sudo yum install cuda
  ```

5. Reboot the VM and proceed to verify the installation.


### Verify driver installation


To query the GPU device state, SSH to the VM and run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

Output similar to the following appears:

![NVIDIA device status](./media/n-series-driver-setup/smi.png)


### CUDA driver updates

We recommend that you periodically update CUDA drivers after deployment.

#### Ubuntu 16.04 LTS

```bash
sudo apt-get update

sudo apt-get upgrade -y

sudo apt-get dist-upgrade -y

sudo apt-get install cuda-drivers

sudo reboot
```


#### CentOS-based 7.3 or Red Hat Enterprise Linux 7.3

```bash
sudo yum update

sudo reboot
```

## Install GRID drivers for NV VMs

To install NVIDIA GRID drivers on NV VMs, make an SSH connection to each VM and follow the steps for your Linux distribution. 

### Ubuntu 16.04 LTS

1. Run the `lspci` command. Verify that the NVIDIA M60 card or cards are visible as PCI devices.

2. Install updates.

  ```bash
  sudo apt-get update

  sudo apt-get upgrade -y

  sudo apt-get dist-upgrade -y

  sudo apt-get install build-essential ubuntu-desktop -y
  ```
3. Disable the Nouveau kernel driver, which is incompatible with the NVIDIA driver. (Only use the NVIDIA driver on NV VMs.) To do this, create a file in `/etc/modprobe.d `named `nouveau.conf` with the following contents:

  ```
  blacklist nouveau

  blacklist lbm-nouveau
  ```


4. Reboot the VM and reconnect. Exit X server:

  ```bash
  sudo systemctl stop lightdm.service
  ```

5. Download and install the GRID driver:

  ```bash
  wget -O NVIDIA-Linux-x86_64-367.92-grid.run https://go.microsoft.com/fwlink/?linkid=849941  

  chmod +x NVIDIA-Linux-x86_64-367.92-grid.run

  sudo ./NVIDIA-Linux-x86_64-367.92-grid.run
  ``` 

6. When you're asked whether you want to run the nvidia-xconfig utility to update your X configuration file, select **Yes**.

7. After installation completes, add the following to `/etc/nvidia/gridd.conf.template`:
 
  ```
  IgnoreSP=TRUE
  ```
8. Reboot the VM and proceed to verify the installation.


### CentOS-based 7.3 or Red Hat Enterprise Linux 7.3


1. Update the kernel and DKMS.
 
  ```bash  
  sudo yum update
 
  sudo yum install kernel-devel
 
  sudo rpm -Uvh https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
 
  sudo yum install dkms
  ```

2. Disable the Nouveau kernel driver, which is incompatible with the NVIDIA driver. (Only use the NVIDIA driver on NV VMs.) To do this, create a file in `/etc/modprobe.d `named `nouveau.conf` with the following contents:

  ```
  blacklist nouveau

  blacklist lbm-nouveau
  ```
 
3. Reboot the VM, reconnect, and install the latest Linux Integration Services for Hyper-V:
 
  ```bash
  wget http://download.microsoft.com/download/6/8/F/68FE11B8-FAA4-4F8D-8C7D-74DA7F2CFC8C/lis-rpms-4.2.1.tar.gz
 
  tar xvzf lis-rpms-4.2.1.tar.gz
 
  cd LISISO
 
  sudo ./install.sh
 
  sudo reboot
  ```
 
4. Reconnect to the VM and run the `lspci` command. Verify that the NVIDIA M60 card or cards are visible as PCI devices.
 
5. Download and install the GRID driver:

  ```bash
  wget -O NVIDIA-Linux-x86_64-367.92-grid.run https://go.microsoft.com/fwlink/?linkid=849941  

  chmod +x NVIDIA-Linux-x86_64-367.92-grid.run

  sudo ./NVIDIA-Linux-x86_64-367.92-grid.run
  ``` 
6. When you're asked whether you want to run the nvidia-xconfig utility to update your X configuration file, select **Yes**.

7. After installation completes, add the following to `/etc/nvidia/gridd.conf.template`:
 
  ```
  IgnoreSP=TRUE
  ```
8. Reboot the VM and proceed to verify the installation.

### Verify driver installation


To query the GPU device state, SSH to the VM and run the [nvidia-smi](https://developer.nvidia.com/nvidia-system-management-interface) command-line utility installed with the driver. 

Output similar to the following appears:

![NVIDIA device status](./media/n-series-driver-setup/smi-nv.png)
 

### X11 server
If you need an X11 server for remote connections to an NV VM, [x11vnc](http://www.karlrunge.com/x11vnc/) is recommended because it allows hardware acceleration of graphics. The BusID of the M60 device must be manually added to the xconfig file (`etc/X11/xorg.conf` on Ubuntu 16.04 LTS, `/etc/X11/XF86config` on CentOS 7.3 or Red Hat Enterprise Server 7.3). Add a `"Device"` section similar to the following:
 
```
Section "Device"
    Identifier     "Device0"
    Driver         "nvidia"
    VendorName     "NVIDIA Corporation"
    BoardName      "Tesla M60"
    BusID          "your-BusID:0:0:0"
EndSection
```
 
Additionally, update your `"Screen"` section to use this device.
 
The BusID can be found by running

```bash
/usr/bin/nvidia-smi --query-gpu=pci.bus_id --format=csv | tail -1 | cut -d ':' -f 1
```
 
The BusID can change when a VM gets reallocated or rebooted. Therefore, you may want to use a script to update the BusID in the X11 configuration when a VM is rebooted. For example:

```bash 
#!/bin/bash
BUSID=$((16#`/usr/bin/nvidia-smi --query-gpu=pci.bus_id --format=csv | tail -1 | cut -d ':' -f 1`))

if grep -Fxq "${BUSID}" /etc/X11/XF86Config; then     echo "BUSID is matching"; else   echo "BUSID changed to ${BUSID}" && sed -i '/BusID/c\    BusID          \"PCI:0@'${BUSID}':0:0:0\"' /etc/X11/XF86Config; fi
```

This file can be invoked as root on boot by creating an entry for it in `/etc/rc.d/rc3.d`.


## Troubleshooting

* There is a known issue with CUDA drivers on Azure N-series VMs running the 4.4.0-75 Linux kernel on Ubuntu 16.04 LTS. To maintain driver function when you upgrade the kernel, upgrade to at least kernel version 4.4.0-77. 



## Next steps

* For more information about the NVIDIA GPUs on the N-series VMs, see:
    * [NVIDIA Tesla K80](http://www.nvidia.com/object/tesla-k80.html) (for Azure NC VMs)
    * [NVIDIA Tesla M60](http://www.nvidia.com/object/tesla-m60.html) (for Azure NV VMs)

* To capture a Linux VM image with your installed NVIDIA drivers, see [How to generalize and capture a Linux virtual machine](capture-image.md?toc=%2fazure%2fvirtual-machines%2flinux%2ftoc.json).