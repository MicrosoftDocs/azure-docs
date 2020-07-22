---
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 03/18/2019    
ms.author: rogarana
---
You can attach a number of data disks to an Azure virtual machine. Based on the scalability and performance targets for a VM's data disks, you can determine the number and type of disk that you need to meet your performance and capacity requirements.

> [!IMPORTANT]
> For optimal performance, limit the number of highly utilized disks attached to the virtual machine to avoid possible throttling. If all attached disks aren't highly utilized at the same time, the virtual machine can support a larger number of disks.

**For Azure managed disks:**

The following table illustrates the default and maximum limits of the number of resources per region per subscription. There is no limit for the number of Managed Disks, snapshots and images per resource group.  

> | Resource | Limit |
> | --- | --- |
> | Standard managed disks | 50,000 |
> | Standard SSD managed disks | 50,000 |
> | Premium managed disks | 50,000 |
> | Standard_LRS snapshots | 50,000 |
> | Standard_ZRS snapshots | 50,000 |
> | Managed image | 50,000 |

* **For Standard storage accounts:** A Standard storage account has a maximum total request rate of 20,000 IOPS. The total IOPS across all of your virtual machine disks in a Standard storage account should not exceed this limit.
  
    You can roughly calculate the number of highly utilized disks supported by a single Standard storage account based on the request rate limit. For example, for a Basic tier VM, the maximum number of highly utilized disks is about 66, which is 20,000/300 IOPS per disk. The maximum number of highly utilized disks for a Standard tier VM is about 40, which is 20,000/500 IOPS per disk. 

* **For Premium storage accounts:** A Premium storage account has a maximum total throughput rate of 50 Gbps. The total throughput across all of your VM disks should not exceed this limit.

