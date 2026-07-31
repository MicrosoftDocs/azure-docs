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
