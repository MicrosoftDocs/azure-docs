---
author: roygara
ms.service: virtual-machines
ms.topic: include
ms.date: 12/13/2022
ms.author: rogarana
---
You can attach a number of data disks to an Azure virtual machine (VM). Based on the scalability and performance targets for a VM's data disks, you can determine the number and type of disk that you need to meet your performance and capacity requirements.

> [!IMPORTANT]
> For optimal performance, limit the number of highly utilized disks attached to the virtual machine to avoid possible throttling. If all attached disks aren't highly utilized at the same time, the virtual machine can support a larger number of disks. Additionally, when creating a managed disk from an existing managed disk, only 49 disks can be created concurrently. More disks can be created after some of the initial 49 have been created.

**For Azure managed disks:**

The following table illustrates the default and maximum limits of the number of resources per region per subscription. The limits remain the same irrespective of disks encrypted with either platform-managed keys or customer-managed keys. There is no limit for the number of Managed Disks, snapshots and images per resource group.  

> | Resource | Limit |
> | --- | --- |
> | Standard managed disks | 50,000 |
> | Standard SSD managed disks | 50,000 |
> | Premium SSD managed disks | 50,000 |
> | Premium SSD v2 managed disks  | 1,000 |
> | Premium SSD v2 managed disks capacity<sup>2</sup> | 32,768 |
> | Ultra disks | 1,000 |
> | Ultra disk capacity<sup>2</sup> | 32,768 |
> | Standard_LRS snapshots<sup>1</sup> | 75,000 |
> | Standard_ZRS snapshots<sup>1</sup> | 75,000 |
> | Managed image | 50,000 |

<sup>1</sup>An individual disk can have 500 incremental snapshots.

<sup>2</sup>This is the default max but higher capacities are supported by request. To request an increase in capacity, request a quota increase or contact Azure Support.

**For standard storage accounts:**

A Standard storage account has a maximum total request rate of 20,000 IOPS. The total IOPS across all of your virtual machine disks in a Standard storage account should not exceed this limit.
  
For unmanaged disks, you can roughly calculate the number of highly utilized disks supported by a single standard storage account based on the request rate limit. For example, for a Basic tier VM, the maximum number of highly utilized disks is about 66, which is 20,000/300 IOPS per disk. The maximum number of highly utilized disks for a Standard tier VM is about 40, which is 20,000/500 IOPS per disk. 

**For premium storage accounts:**

A premium storage account has a maximum total throughput rate of 50 Gbps. The total throughput across all of your VM disks should not exceed this limit.

