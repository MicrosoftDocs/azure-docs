---
 title: include file
 description: include file
 services: virtual-machines-linux
 author: dlepow
 ms.service: virtual-machines-linux
 ms.topic: include
 ms.date: 03/01/2018
 ms.author: danlep
 ms.custom: include file
---

## Supported distributions and drivers

### NC, NCv2, NCv3, and ND-series - NVIDIA CUDA drivers
| Distribution | Driver |
| --- | --- | 
| Ubuntu 16.04 LTS<br/><br/> Red Hat Enterprise Linux 7.3 or 7.4<br/><br/> CentOS 7.3 or 7.4 | NVIDIA CUDA 9.1, driver branch R390 |

> [!IMPORTANT]
> Ensure that you install or upgrade to the latest CUDA drivers for your distribution. Drivers older than version R390 might have problems with updated Linux kernels.
>

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
