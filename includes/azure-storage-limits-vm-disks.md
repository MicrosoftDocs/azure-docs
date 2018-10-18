An Azure virtual machine supports attaching a number of data disks. This article describes scalability and performance targets for a VM's data disks. Use these targets to help decide the number and type of disk that you need to meet your performance and capacity requirements. 

> [!IMPORTANT]
> For optimal performance, limit the number of highly utilized disks attached to the virtual machine to avoid possible throttling. If all attached disks are not highly utilized at the same time, then the virtual machine can support a larger number of disks.

* **For Azure Managed Disks:** 

> | Resource | Default Limit | Maximum Limit |
> | --- | --- | --- |
> | Standard Managed Disks | 10,000 | 50,000 |
> | Standard SSD Managed Disks | 10,000 | 50,000 |
> | Premium Managed Disks | 10,000 | 50,000 |
> | Standard_LRS Snapshots | 10,000 | 50,000 |
> | Standard_ZRS Snapshots | 10,000 | 50,000 |
> | Premium_LRS Snapshots | 10,000 | 50,000 |
> | Managed Image | 10,000 | 50,000 |

* **For standard storage accounts:** A standard storage account has a maximum total request rate of 20,000 IOPS. The total IOPS across all of your virtual machine disks in a standard storage account should not exceed this limit.
  
    You can roughly calculate the number of highly utilized disks supported by a single standard storage account based on the request rate limit. For example, for a Basic Tier VM, the maximum number of highly utilized disks is about 66 (20,000/300 IOPS per disk), and for a Standard Tier VM, it is about 40 (20,000/500 IOPS per disk). 

* **For premium storage accounts:** A premium storage account has a maximum total throughput rate of 50 Gbps. The total throughput across all of your VM disks should not exceed this limit.

