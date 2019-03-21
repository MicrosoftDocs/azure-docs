

# Generation 2 VMs in Azure

All VM sizes in Azure currently support Generation 1 VMs. Azure is now also offering Generation 2 support for selected VM sizes including Fsv2 and Dsv2. 

Generation 2 VMs support UEFI BIOS configurations. UEFI provides support for features like:

* GPT disks, which enables OS disks up to 2 TB. 
* Up to 12 TB of memory.

But, Azure does not currently support some of the features that on-premises Hyper-V supports for Generation 2 VMs. 


| Generation 2 feature                | On-premises Hyper-V| Azure |
|-------------------------------------|--------------------|-------|
| Secure Boot                         | Y                  | N     |
| Shielded VM                         | Y                  | N     |
| vTPM                                | Y                  | N     |
| Virtualization Based Security (VBS) | Y                  | N     |


Gen1 vs Gen 2 VM capabilities.

| Feature                    | Gen1                       | Gen2                                |
|----------------------------|----------------------------|-------------------------------------|
| O.S Disk > 2TB             | N                          | Y                                   |
| Custom Disk/Image/Swap O.S | Y                          | Y                                   |
| VMSS Support               | Y                          | Y                                   |
| VM Sizes                   | Available on all VM sizes. | Premium Storage supported VMs only. |
| ASR/Backup                 | Y                          | N                                   |
| Shared Image Gallery       | Y                          | N                                   |




Marketplace image support:

* Windows server 2019 Datacenter
* Windows server 2016 Datacenter
* Windows server 2012 R2 Datacenter
* Windows server 2012 Datacenter
* Ubuntu
* SUSE
* 3rd Party publishers including SQL and others
