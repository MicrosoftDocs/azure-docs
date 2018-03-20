---
 title: include file
 description: include file
 services: virtual-machines-linux
 author: dlepow
 ms.service: virtual-machines-linux
 ms.topic: include
 ms.date: 03/19/2018
 ms.author: danlep
 ms.custom: include file
---

## Supported distributions and drivers

### NC, NCv2, NCv3, and ND-series - NVIDIA CUDA drivers
| Distribution | Driver |
| --- | --- | 
| Ubuntu 16.04 LTS<br/><br/> Red Hat Enterprise Linux 7.3 or 7.4<br/><br/> CentOS 7.3 or 7.4, CentOS-based 7.4 HPC | NVIDIA CUDA 9.1, driver branch R390 |

As an alternative to manual CUDA driver installation on a Linux VM, you can deploy an Azure [Data Science Virtual Machine](../articles/machine-learning/data-science-virtual-machine/overview.md) image. The DSVM editions for Ubuntu 16.04 LTS or CentOS 7.4 pre-install NVIDIA CUDA drivers, the CUDA Deep Neural Network Library, and other tools.

### NV-series - NVIDIA GRID drivers

| Distribution | Driver |
| --- | --- | 
| Ubuntu 16.04 LTS<br/><br/>Red Hat Enterprise Linux 7.3<br/><br/>CentOS-based 7.3 | NVIDIA GRID 5.2, driver branch R384|

> [!NOTE]
> Microsoft redistributes NVIDIA GRID driver installers for NV VMs. Install only these GRID drivers on Azure NV VMs. These drivers include licensing for GRID Virtual GPU Software in Azure.
>

> [!WARNING] 
> Installation of third-party software on Red Hat products can affect the Red Hat support terms. See the [Red Hat Knowledgebase article](https://access.redhat.com/articles/1067).
>
