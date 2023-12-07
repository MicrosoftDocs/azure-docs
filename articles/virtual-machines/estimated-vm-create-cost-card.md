---
title: Estimate the cost of creating a Virtual Machine in the Azure portal (Preview)
description: Use the Azure portal Virtual Machine creation flow cost card to estimate the final cost of your Virtual Machine.
author: ju-shim
ms.service: virtual-machines
ms.topic: article
ms.date: 12/09/2023
ms.author: jushiman
---

# Estimate the cost of creating a Virtual Machine in the Azure portal (Preview)

> [!IMPORTANT]
> The estimated cost card feature for virtual machines in the Azure portal is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


Azure virtual machines (VMs) can be created through the [Azure portal](https://portal.azure.com/). This method provides a browser-based user interface to create VMs and their associated resources. As you create VMs in the Azure portal and configure them through the different tabs during the creation process, the cost card will reflect the pricing estimations based on your selections. 

The cost displayed in this card will not reflect usage and other costs incurred on the VMs beyond the creation of the resources. The final price of your VMs may factor in other respective networking, storage, and additional costs that pertain to the usage and application of the VMs. 

> [!NOTE]
> Costs reflected in the card are estimates only. Pricing may vary depending on your Microsoft agreement, date of purchase, subscription type, usage costs, licensing, and currency exchange rates. Total costs may include other resource costs, licensing, and subscription implications. The costs indicated on the card may vary across regions, subscription types, sizes, and images.

## Limitations and considerations

Currently, the estimated cost card feature for VMs in the Azure portal will be limited to Pay-as-you-go customers. This feature will not be available or visible for other subscription types and other discount plans, such as the Savings Plan and Reserved Instances.

If your subscription has policy restrictions for specific users, those users will not be able to view the cost card unless those restrictions are lifted.

## Estimated cost card

The following sections reflect the various tabs during the VM creation process in the Azure portal. The listed resources and features are included in the estimated cost card. Referred to their respective pricing pages for further pricing information. 

Note that costs associated with selecting existing resources during the VM creation process will only be reflected in the cost card if those resources may incur additional charges.

### Basics

| Resource or feature                      | Additional notes                                          |
|------------------------------------------|-----------------------------------------------------------|
| [Image and Size (Windows)](https://azure.microsoft.com/pricing/details/virtual-machines/windows/) | Image will indicate the 3rd party licensing costs. |
| [Image and Size (Linux)](https://azure.microsoft.com/pricing/details/virtual-machines/linux/) | |
| [Spot](https://azure.microsoft.com/pricing/spot-advisor/) | If selected, the necessary Spot discount will be shown. |
| [AHB licensing](https://azure.microsoft.com/en-us/pricing/hybrid-benefit/) | If selected, the necessary AHB discounts will be applied and shown. |

### Disks

| Resource or feature                      |
|------------------------------------------|
| [OS Disk](https://azure.microsoft.com/pricing/details/managed-disks/) |
| [Ultra disk Reservation charge](https://azure.microsoft.com/pricing/details/managed-disks/) |
| [Data Disk: Ultra Disk](https://azure.microsoft.com/pricing/details/managed-disks/) |
| [Data Disk: Premium Disk](https://azure.microsoft.com/pricing/details/managed-disks/) |
| [Data disk: Standard disk](https://azure.microsoft.com/pricing/details/managed-disks/) |

Additional notes:
- The ultra disk reservation charge is displayed when the ultra disk option is selected but not yet added as a data disk. If ultra disk compatibility is enabled but the disk iteself isn't added, the ultra disk reservation charges will be incurred. 
- Throughput and bursting costs are included, assuming moderate use. 
- Enabling shares on disks will incur additional costs and will be displayed as a part of the price estimation. 

### Networking

| Resource or feature                      | Additional notes                                          |
|------------------------------------------|-----------------------------------------------------------|
| [Public IP](https://azure.microsoft.com/pricing/details/ip-addresses/) | Standard Public IP costs are displayed when a new IP is created as part of the default selection. |
| [VM Data transfer](https://azure.microsoft.com/pricing/details/bandwidth/) | Estimated cost is based on inter-region data transfer on routing via Microsoft Premium Global Network rates, because the zure portal VM creation process only allows choosing resources within the same region. |
| [Azure Load Balancer](https://azure.microsoft.com/pricing/details/load-balancer/) | For an existing Azure load balancer, only the data estimations will be displayed. Other fixed costs are assumed to be paid. |
| [Azure Application Gateway](https://azure.microsoft.com/pricing/details/application-gateway/) | For existing Azure Application gateway, only the data estimations will be displayed. Other fixed costs are assumed to be paid. |

### Management 

| Resource or feature                      | Additional notes                                          |
|------------------------------------------|-----------------------------------------------------------|
| [Azure Backup](https://azure.microsoft.com/pricing/details/backup/) | Monthly average backup cost is based on the size of the VM that needs backup, the backup policy selected, and estimated moderate daily data churn. |
| [Azure Site recovery](https://azure.microsoft.com/pricing/details/site-recovery/) | |

### Monitoring 

| Resource or feature                      |
|------------------------------------------|
| [Alerts](https://azure.microsoft.com/pricing/details/monitor/) |
| [Boot Diagnostics](https://azure.microsoft.com/pricing/details/storage/blobs/) |

### Advanced 

| Resource or feature                      | Additional notes                                          |
|------------------------------------------|-----------------------------------------------------------|
| [Azure Dedicated Host](https://azure.microsoft.com/en-us/pricing/details/virtual-machines/dedicated-host/) | Adding an existing Azure Dedicated Host will deduct the cost of the VM size. |

## Next steps

The [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) is another tool that can be referenced for price estimations for different parts of your workload.
