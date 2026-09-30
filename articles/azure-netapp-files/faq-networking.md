---
title: Networking FAQs for Azure NetApp Files
description: Answers frequently asked questions (FAQs) about Azure NetApp Files networking.
ms.service: azure-netapp-files
ms.topic: concept-article
author: b-hchen
ms.author: anfdocs
ms.date: 05/22/2025
# Customer intent: As a network administrator, I want to understand the networking requirements and limitations of Azure NetApp Files, so that I can effectively integrate it with my existing Azure Virtual Networks and ensure optimal performance for my applications.
---
# Networking FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files networking. 

## Generic FAQs

This section answers generic questions about Azure NetApp Files networking.

### Does the data path for NFS or SMB go over the Internet?  

No. The data path for NFS or SMB doesn't go over the Internet. Azure NetApp Files is an Azure native service that is deployed into the Azure Virtual Network (VNet) where the service is available. Azure NetApp Files uses a delegated subnet and provisions a network interface directly on the virtual network. 

See [Guidelines for Azure NetApp Files network planning](./azure-netapp-files-network-topologies.md) for details.  

### Can I connect a virtual network that I already created to the Azure NetApp Files service?

Yes, you can connect virtual networks that you created to the service. 

See [Guidelines for Azure NetApp Files network planning](./azure-netapp-files-network-topologies.md) for details.  

### Can I mount an NFS volume of Azure NetApp Files using DNS FQDN name?

Yes, you can, if you create the required DNS entries. Azure NetApp Files supplies the service IP for the provisioned volume. 

> [!NOTE] 
> Azure NetApp Files can deploy other IPs for the service as needed.  DNS entries may need to be updated periodically.

### Can I set or select my own IP address for an Azure NetApp Files volume?  

No. IP assignment of Azure NetApp Files volumes is automatic. Manual IP assignment isn't supported. 

### Does Azure NetApp Files support dual stack (IPv4 and IPv6) virtual network?

No. Azure NetApp Files doesn't currently support deploying volumes in a dual-stack (IPv4 and IPv6) delegated subnet. The delegated subnet for the Azure NetApp Files service must be an IPv4-only subnet. However, Azure NetApp Files is accessible over IPv4 through a dual-stack subnet or (peered) virtual network.

### Is the number of the IP addresses using Azure VMware Solution for Guest OS mounts limited to 1000?

No. Azure VMware Solution is behind an ER gateway, which makes it behave similar to on-premises systems. The number of AVS "Hosts" and "Guests" is n visible to Azure NetApp Files, and the [1000 IP address limit](azure-netapp-files-resource-limits.md#resource-limits) isn't applicable.

### Can I use DNS A/AAAA records or CNAME records to connect to Azure NetApp Files volumes?
 
Azure NetApp Files provides full support for using both A/AAAA (hostname) and CNAME (alias) records in DNS when connecting to NFS and SMB shares. Both  types of records can be used for hostname to IP resolution, load balancing, preserving legacy mount paths when data has been migrated, and more.
 
For further flexibility, see [How to use DFS Namespaces with Azure NetApp Files](use-dfs-n-and-dfs-root-consolidation-with-azure-netapp-files.md). 

## FAQs about Standard network features

This section answers questions about Azure NetApp Files Standard network features. 

### What is changing with Basic network features in Azure NetApp Files? 

All new Azure NetApp Files volumes will use Standard network features by default. Basic network features will no longer be an option. Existing volumes are unaffected, and no customer action is required. 

### What actions are required from the customer? 

No Action is required from the customer.  

### Will my existing Azure NetApp Files volumes be impacted? 

No. Existing volumes using Basic network features aren't impacted and will continue to operate normally. 

### Can I still create new volumes using Basic network features? 

No. Beginning July 2026, new volumes can't be created with Basic network features via the Portal, CLI, or APIs. 

### Is there a cost difference between Basic and Standard network features? 

There is no difference when moving from Basic to Standard network features unless you choose other Azure network features, which involve costs like peering. 

### Will this change affect the functionality of my scripts or ARM template? 

Your scripts and ARM templates remain operational as currently implemented. All requests for basic network features will be set up using Standard network features configurations. 

### Why do I see an "insufficient resources" error when creating a Standard network features volume? 

This can occur if the selected virtual network contains volumes using Basic network features, and the region or availability zone has limited Azure NetApp Files capacity. 

### How can I fix the "insufficient resources" error when creating a Standard network features volume? 
Create the volume in a different virtual network, or upgrade all existing volumes in the virtual network to Standard network features and retry. Contact Microsoft Support if assistance is needed. 

### How can I avoid the "insufficient resources" error? 
Use Standard network features for all new Azure NetApp Files volumes and avoid mixing Basic and Standard network features in the same virtual network and transition existing volumes to Standard network features. 

### Do I need to migrate my existing volumes to Standard network features now? 

No immediate action is required. However, we recommend you to transition existing environments to Standard network features over time as part of normal lifecycle management.

### How does this retirement affect future volume creation?

There's no impact on your workload or volume creation ability. With the upgrade to Standard network features, you'll get NSGs on Azure NetApp Files, UDRs on Azure NetApp Files subnet, and many other features.  

### What is Microsoft’s recommendation going forward? 

Use Standard network features for all new deployments and plan to transition existing environments over time as part of normal lifecycle management. 

## Basic to Standard networking upgrade 

### Do I need to take any action for this upgrade?

Yes. Review your UDR and NSG configurations to ensure there are no stale UDRs or NSGs that might become active and affect your traffic route after the upgrade before September 28. After this date, the upgrade starts and happens automatically in the background. You don't need to take any action for the upgrade. Starting June 2026, all new Azure NetApp Files volumes use Standard network features by default.

### Will this upgrade impact my applications or cause downtime?

Review your UDR/NSG configurations to ensure there are no stale UDRs or NSGs that might become active and affect your traffic route after the upgrade.

During the upgrade, some volume operations such as create or delete might be temporarily unavailable (about 30 minutes) while the system completes internal updates.

* This behavior is expected during the upgrade window.
* The restriction is temporary (typically about 25 minutes per storage system).
* Your existing volumes and applications continue to run normally.

> [!NOTE] 
> Check [how to avoid stale UDR configurations affecting your traffic](#how-to-avoid-and-update-stale-udr-configuration).

### Why is this upgrade happening?

This upgrade improves consistency and aligns your resources with Azure's latest networking model, helping ensure better long-term reliability and support.

### What should I do if I encounter an error?

Wait for the upgrade to complete and retry the operation. No other action is required. If you need more help, contact the Azure customer support team.

> [!NOTE] 
> Check [how to avoid stale UDR configurations affecting your traffic](#how-to-avoid-and-update-stale-udr-configuration).

### Is there a cost difference between Basic and Standard network features?

There's no cost difference when you move from Basic to Standard network features, unless you choose other Azure network features that involve costs, such as peering.

### Can I manually update to Standard networking?

Yes. You can manually update to Standard networking. Complete manual updates to Standard networking before September 28. After this date, if Azure doesn't automatically upgrade your volume, you might still be able to update it manually as Azure gradually rolls out updates across regions. The timing might vary depending on your region. 

### How to avoid and update stale UDR configuration

1. Identify the virtual network and delegated subnet used by the Azure NetApp Files volume.
1. Review the route table associated with the delegated subnet. 
    1. Access the Azure portal and use the search function to locate **Route tables**. 
    1. Review the list of route tables available in your subscription. For more information, see [Manage route tables](../virtual-network/manage-route-table.yml).
1. Before upgrading from Basic to Standard networking, remove or update any UDRs or NSGs that could cause traffic disruption after the upgrade.

### What should I do if I'm using an MTU size greater than 1500?
Azure NetApp Files supports an MTU size of 1500 bytes. If your environment is configured with a custom MTU greater than 1500, review and update your configuration to use 1500 MTU to ensure a supported setup.

### What configuration does Standard network feature support?

See the [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md#constraints) for information about the supported configuration.


## Next steps  

- [Microsoft Azure ExpressRoute FAQs](../expressroute/expressroute-faqs.md)
- [Microsoft Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md)
- [How to create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
