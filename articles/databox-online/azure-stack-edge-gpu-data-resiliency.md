---
title: Data resiliency for Azure Stack Edge Pro GPU/Pro R/Mini R 
description: Describes data resiliency for Azure Stack Edge.
services: databox
author: alkohli

ms.service: databox
ms.subservice: edge
ms.topic: conceptual
ms.date: 04/18/2022
ms.author: alkohli
---

# Data resiliency for Azure Stack Edge 

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

This article explains the data resiliency behavior for Azure Stack Edge service that runs in Azure and manages Azure Stack Edge devices.  

## About Azure Stack Edge 

Azure Stack Edge service is used to deploy compute workloads on purpose-built hardware devices, right at the edge where the data is created. The purpose-built Azure Stack Edge devices are available in various form factors and can be ordered, configured, and monitored via the Azure portal. Azure Stack Edge solution can also be deployed in Azure public and Azure Government cloud environments.

### Regions for Azure Stack Edge

Region information is used for Azure Stack Edge service in the following ways:

- You specify an Azure region when creating an Azure Stack Edge Hardware Center order for the Azure Stack Edge device. Data residency norms apply to Edge Hardware Center orders. For more information, see [Data residency for Edge Hardware Center](../azure-edge-hardware-center/azure-edge-hardware-center-overview.md#data-residency).

- You specify an Azure region when creating a management resource for the Azure Stack Edge device. This region is used to store the metadata associated with the resource. The metadata can be stored in a location different than the physical device. 

- Finally, there's a region associated with the storage accounts where the customer data is stored by the Azure Stack Edge service. You can configure SMB or NFS shares on the service to store customer data and then associate an Azure Storage account with each configured share.

    Depending on the Azure Storage account configured for the share, your data is automatically and transparently replicated. For example, Azure Geo-Redundant Storage account (GRS) is configured by default when an Azure Storage account is created. With GRS, your data is automatically replicated three times within the primary region, and three times in the paired region. For more information, see [Azure Storage redundancy options](../storage/common/storage-redundancy.md).


### Non-paired region vs. regional pairs

Azure Stack Edge service is a non-regional, always-available service and has no dependency on a specific Azure region. Azure Stack Edge service is also resilient to zone-wide outages and region-wide outages.


- **Regional pairs** - In general, Azure Stack Edge service uses Azure Regional Pairs when storing and processing customer data in all the geographies except Singapore. If there's a regional failure, the instance of the service in the Azure paired region continues to service customers. This ensures that the service is fully resilient to all the zone-wide and region-wide outages. 

    For all the Azure Regional Pairs, by default, Microsoft is responsible for the disaster recovery (DR) setup, execution, and testing. In the event of region outage, when the service instance fails over to from the primary region to the secondary region, the Azure Stack Edge service may be inaccessible for a short duration. 

- **Non-paired region** - In Singapore, customer can choose that the customer data for Azure Stack Edge reside only in Singapore and not get replicated to the paired region, Hong Kong Special Administrative Region. With this option enabled, the service is resilient to zone-wide outages, but not to region-wide outages. Once the data residency is set to non-paired region, it persists during the lifetime of the resource and can't be changed. 

    In Singapore (South East Asia) region, if the customer has chosen single data residency option that won’t allow replication in the paired region, the customer will be responsible for the DR setup, execution, and testing. 


## Cross-region disaster recovery

Cross region disaster recovery for all regions for multiple region geographies is done via using the Azure regional pairs. A regional pair consists of two regions, primary and secondary, within the same geography. Azure serializes platform updates (planned maintenance) across regional pairs, ensuring that only one region in each pair updates at a time. If an outage affects multiple regions, at least one region in each pair is prioritized for recovery. Applications that are deployed across paired regions are guaranteed to have one of the regions recovered with priority. For more information, see [Cross-region replication in Azure](../availability-zones/cross-region-replication-azure.md#cross-region-replication). 

In the event of region outage, when the service instance fails over to from the primary region to the secondary region, the Azure Stack Edge service may be inaccessible for a short duration.

For cross-region DR, Microsoft is responsible. The Recovery Time Objective (RTO) for DR is 8 hours, and Recovery Point Objective (RPO) is 15 minutes. For more information, see [Resiliency and continuity overview](/compliance/assurance/assurance-resiliency-and-continuity). <!--Azure Global - Bcdr Service Details, (Go to Business Impact Analysis)-->

Cross region disaster recovery for non-paired region geography only pertains to Singapore. If there's a region-wide service outage in Singapore and you have chosen to keep your data only within Singapore and not replicated to regional pair Hong Kong SAR, you have two options:

- Wait for the Singapore region to be restored.
- Create a resource in another region, reset the device, and manage your device via the new resource. For detailed instructions, see [Reset and reactivate your Azure Stack Edge device](azure-stack-edge-reset-reactivate-device.md).

In this case, the customer is responsible for DR and must set up a new device and then deploy all the workloads. 


## Non-paired region disaster recovery

The disaster recovery isn't identical for non-paired region and multi-region geographies for this service. 

For Azure Stack Edge service, all regions use regional pairs except for Singapore where you can configure the service for non-paired region data residency. 

- In Singapore, you can configure the service for non-paired region data residency. The single-region geography disaster recovery support applies only to Singapore when the customer has chosen to not enable the regional pair Hong Kong SAR. The customer is responsible for the Singapore customer enabled disaster recovery (CEDR).
- Except for Singapore, all other regions use regional pairs and Microsoft owns the regional pair disaster recovery.

For the single-region disaster recovery for which the customer is responsible: 

- Both the control plane (service side) and the data plane (device data) need to be configured by the customer. 
- There's a potential for data loss if the disaster recovery isn’t appropriately configured by the customer. Features and functions remain intact as a new resource is created and the device is reactivated against this resource. 


Here are the high-level steps to set up disaster recovery using Azure portal for Azure Stack Edge: 

- Create a resource in another region. For more information, see how to [Create a management resource for Azure Stack Edge device](azure-stack-edge-gpu-deploy-prep.md#create-a-management-resource-for-each-device).
- [Reset the device](azure-stack-edge-reset-reactivate-device.md#reset-device). When the device is reset, the local data on the device is lost. It's necessary that you back up the device prior to the reset. Use a third-party backup solution provider to back up the local data on your device. For more information, see how to [Protect data in Edge cloud shares, Edge local shares, VMs and folders for disaster recovery](azure-stack-edge-gpu-prepare-device-failure.md#protect-device-data). 
- [Reactivate device against a new resource](azure-stack-edge-reset-reactivate-device.md#reactivate-device). When you move to the new resource, you'll also need to restore data on the new resource. For more information, see how to [Restore Edge cloud shares](azure-stack-edge-gpu-recover-device-failure.md#restore-edge-cloud-shares), [Restore Edge local shares](azure-stack-edge-gpu-recover-device-failure.md#restore-edge-local-shares) and [Restore VM files and folders](azure-stack-edge-gpu-recover-device-failure.md#restore-vm-files-and-folders).

For detailed instructions, see [Reset and reactivate your Azure Stack Edge device](azure-stack-edge-reset-reactivate-device.md). 

## Planning disaster recovery

Microsoft and its customers operate under the [Shared responsibility model](../availability-zones/business-continuity-management-program.md#shared-responsibility-model). This means that for customer-enabled (responsible services DR), the customer must address disaster recovery for any service they deploy and control. To ensure that recovery is proactive, customers should always pre-deploy secondaries because there's no guarantee of capacity at time of impact for those who haven't pre-allocated. 

When using Azure Stack Edge service, the customer can create a resource proactively, ahead of time, in another supported region. In the event of a disaster, this resource can then be deployed. 

## Testing disaster recovery

Azure Stack Edge doesn’t have DR available as a feature. This implies that the interested customers should perform their own DF failover testing for this service. If a customer is trying to restore a workload or configuration in a new device, they are responsible for the end-to-end configuration.


## Next steps

- Learn more about [Azure data residency requirements](https://azure.microsoft.com/global-infrastructure/data-residency/).
