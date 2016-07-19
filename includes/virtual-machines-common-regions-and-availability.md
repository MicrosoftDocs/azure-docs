# Regions and availability overview
Azure operates in multiple datacenters around the world. These datacenters are grouped in to geographic regions, giving you flexibility in choosing where to build your applications. You can also build high availability in to your apps by leveraging the redundancy and availability features within the Azure platform such as storage replication and availability sets.

## What are Azure regions?
Azure allows you to create resources, such as VMs, in defined geographic regions like 'West US', 'North Europe', or 'Southeast Asia'. There are currently 26 Azure regions around the world. You can review the [list of regions and their locations](https://azure.microsoft.com/regions/). Within each region, multiple datacenters exist in order to provide for redundancy and availability. This gives you flexibility when building your applications to create virtual machines (VMs) closest to your users and to meet any legal, compliance, or tax purposes.

## Specialized Azure regions
There are some specialized Azure regions for compliance or legal purposes which you may wish to use when building out your applications.

Existing specialized regions include:

- **US Gov Virginia** and **US Gov Iowa**
    - A physical and logical network-isolated instance of Azure for US government and agencies, operated by screened US persons. Includes additional compliance certifications such as [FedRAMP](https://www.fedramp.gov/marketplace/compliant-systems/) and [DISA](http://www.disa.mil/). Read more about [Azure Government](https://azure.microsoft.com/features/gov/).
- **Australia East** and **Australia Southeast**
    - These regions are available to customers with a business presence in Australia or New Zealand.
- **Central India**, **South India**, and **West India**
    - These regions are currently available to volume licensing customers and partners with a local enrollment in India and access will open to direct online subscriptions throughout 2016.
- **China East** and **China North**
    - These regions are available through a unique partnership between Microsoft and 21Vianet, whereby Microsoft does not directly maintain the datacenters. See more about [Microsoft Azure in China](http://www.windowsazure.cn/).

Announced specialized regions include:

- **Germany Central** and **Germany Northeast**
    - Azure will be available via a new data trustee model whereby customer data remains in Germany under control of T-Systems, a Deutsche Telekom company, acting as the German data trustee.

## Region pairs
Each Azure region is paired with another region within the same geography (such as US, Europe, or Asia). This allows for the replication of resources, such as VM storage, across a geography that should reduce the likelihood of natural disasters, civil unrest, power outages, or physical network outages affecting both regions at once. Additional advantages of region pairs include:

- In the event of a wider Azure outage, one region is prioritized out of every pair to help reduce the time to restore for applications. 
- Planned Azure updates are rolled out to paired regions one at a time to minimize downtime and risk of application outage.
- Data will continue to reside within the same geography as its pair (with the exception of Brazil South) for tax and law enforcement jurisdiction purposes.

Examples of region pairs include:

| Primary        | Secondary   |
|:---------------|:------------|
| West US        | East US     |
| North Europe   | West Europe |
| Southeast Asia | East Asia   |

You can see the full [list of regional pairs here](../articles/best-practices-availability-paired-regions.md#what-are-paired-regions).

## Feature availability
Some services or VM features are only available in certain regions, such as specific VM sizes or storage types. There are also some global Azure services that do not require you to select a particular region, such as [Azure Active Directory](../articles/active-directory/active-directory-whatis.md), [Traffic Manager](../articles/traffic-manager/traffic-manager-overview.md), or [Azure DNS](../articles/dns/dns-overview.md). To assist you in designing your application environment, you can check the [availability of Azure services across each region](https://azure.microsoft.com/regions/#services). 


## Storage availability
Understanding Azure regions and geographies becomes important when you consider the available Azure Storage replication options. When you create a storage account, you must select one of the following replication options:

- Locally redundant storage (LRS)
    - Replicates your data three times within the region in which you created your storage account.
- Zone redundant storage (ZRS)
    - Replicates your data three times across two to three facilities, either within a single region or across two regions.
- Geo-redundant storage (GRS)
    - Replicates your data to a secondary region that is hundreds of miles away from the primary region.
- Read-access geo-redundant storage (RA-GRS)
    - Replicates your data to a secondary region, as with GRS, but also then provides read-only access to the data in the secondary location.

The following table provides a quick overview of the differences between the storage replication types:

| Replication strategy                                                               | LRS | ZRS | GRS | RA-GRS |
|:-----------------------------------------------------------------------------------|:----|:----|:----|:-------|
| Data is replicated across multiple facilities.                                     | No  | Yes | Yes | Yes    |
| Data can be read from the secondary location as well as from the primary location. | No  | No  | No  | Yes    |
| Number of copies of data maintained on separate nodes.                             | 3   | 3   | 6   | 6      |

You can read more about [Azure Storage replication options here](../articles/storage/storage-redundancy.md).

### Storage costs
Prices vary depending on the storage type and availability that you select. 

- Standard storage is backed by regular spinning disks and is charged based on the in-use capacity and desired storage availability.
    - For RA-GRS, there is an additional Geo-Replication Data Transfer charge for the bandwidth of replicating that data to another Azure region.
- Premium storage is backed by Solid State Drives (SSDs) and is charged based on the capacity of the disk.

See [Azure Storage Pricing](https://azure.microsoft.com/pricing/details/storage/) for pricing information on the different storage types and availability options.


## Azure Images
In Azure, VMs are created from an image. Typically this will be an image created from the [Azure Marketplace](https://azure.microsoft.com/marketplace/) where partners can provide pre-configured complete OS or application images.

When you create a VM from an image in the Azure Marketplace, you are actually working with templates. Azure Resource Manager templates are declarative JavaScript Object Notation (JSON) files that can be used to create complex application environments comprising VMs, storage, virtual networking, etc. You can read more about using [Azure Resource Manager templates](../articles/resource-group-overview.md), including how to [build your own templates](../articles/resource-group-authoring-templates.md).

You can also create your own custom images and upload them using [Azure CLI](../articles/virtual-machines/virtual-machines-linux-upload-vhd.md) or [Azure PowerShell](../articles/virtual-machines/virtual-machines-windows-upload-image.md) to quickly create custom VMs to your specific build requirements. When using custom images, VMs need to be stored in the same storage account as the image itself. You cannot upload an image to a single region and then create VMs from it across other Azure regions.


## Availability sets
An availability set is a logical grouping of VMs that allows Azure to understand how your application is built in order to provide for redundancy and availability. It is recommended that two or more VMs are created within an availability set in order to provide for a highly-available application and to meet the [99.95% Azure SLA](https://azure.microsoft.com/support/legal/sla/virtual-machines/). The availability set is compromised of two additional groupings that protect against hardware failures and allow updates to safely be applied - fault domains (FDs) and update domains (UDs).

![Conceptual drawing of the update domain and fault domain configuration](./media/virtual-machines-common-regions-and-availability/ud-fd-configuration.png)

You can read more about how to manage the availability of [Linux VMs](../articles/virtual-machines/virtual-machines-linux-manage-availability.md) or [Windows VMs](../articles/virtual-machines/virtual-machines-linux-manage-availability.md).

### Fault domains
A fault domain is a logical group of underlying hardware that share a common power source and network switch, similar to a rack within an on-premises datacenter. As you create VMs within an availability set, the Azure platform automatically distributes your VMs across these fault domains to limit the impact of potential physical hardware failures, network outages, or power interruptions.

### Update domains
An update domain is a logical group of underlying hardware that can undergo maintenance or be rebooted at the same time. As you create VMs within an availability set, the Azure platform automatically distributes your VMs across these update domains to ensure that at least one instance of your application always remains running as the Azure platform undergoes periodic maintenance. Note that the order of update domains being rebooted may not proceed sequentially during planned maintenance, but only one update domain will be reboot at a time.


### Next steps
You can read more specific details about [Azure availability best practices](../articles/best-practices-availability-checklist.md).