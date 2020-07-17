---
 title: include file
 description: include file
 services: virtual-machines-linux
 author: cynthn
 ms.service: virtual-machines-linux
 ms.topic: include
 ms.date: 02/11/2019
 ms.author: cynthn
 ms.custom: include file
---

## Supported distributions and drivers

### NVIDIA CUDA drivers

NVIDIA CUDA drivers for NC, NCv2, NCv3, ND, and NDv2-series VMs (optional for NV-series) are supported only on the Linux distributions listed in the following table. CUDA driver information is current at time of publication. For the latest CUDA drivers and supported operating systems, visit the [NVIDIA](https://developer.nvidia.com/cuda-zone) website. Ensure that you install or upgrade to the latest CUDA drivers for your distribution. 

> [!TIP]
> As an alternative to manual CUDA driver installation on a Linux VM, you can deploy an Azure [Data Science Virtual Machine](../articles/machine-learning/data-science-virtual-machine/overview.md) image. The DSVM editions for Ubuntu 16.04 LTS or CentOS 7.4 pre-install NVIDIA CUDA drivers, the CUDA Deep Neural Network Library, and other tools.


### NVIDIA GRID drivers

Microsoft redistributes NVIDIA GRID driver installers for NV and NVv3-series VMs used as virtual workstations or for virtual applications. Install only these GRID drivers on Azure NV VMs, only on the operating systems listed in the following table. These drivers include licensing for GRID Virtual GPU Software in Azure. You do not need to set up an NVIDIA vGPU software license server.

| Distribution | Driver |
| --- | -- |
|Ubuntu 18.04 LTS<br/><br/>Ubuntu 16.04 LTS<br/><br/>Red Hat Enterprise Linux 7.0 to 7.7<br/><br/>CentOS-based 7.0 to 7.7<br/><br/>SUSE Linux Enterprise Server 12 SP2 | NVIDIA GRID 10.1, driver branch R440|

> [!WARNING] 
> Installation of third-party software on Red Hat products can affect the Red Hat support terms. See the [Red Hat Knowledgebase article](https://access.redhat.com/articles/1067).
>
