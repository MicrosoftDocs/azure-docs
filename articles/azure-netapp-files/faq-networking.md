---
title: Networking FAQs for Azure NetApp Files | Microsoft Docs
description: Answers frequently asked questions (FAQs) about Azure NetApp Files networking.
ms.service: azure-netapp-files
ms.workload: storage
ms.topic: conceptual
author: b-hchen
ms.author: anfdocs
ms.date: 11/08/2021
---
# Networking FAQs for Azure NetApp Files

This article answers frequently asked questions (FAQs) about Azure NetApp Files networking. 

## Does the data path for NFS or SMB go over the Internet?  

No. The data path for NFS or SMB does not go over the Internet. Azure NetApp Files is an Azure native service that is deployed into the Azure Virtual Network (VNet) where the service is available. Azure NetApp Files uses a delegated subnet and provisions a network interface directly on the VNet. 

See [Guidelines for Azure NetApp Files network planning](./azure-netapp-files-network-topologies.md) for details.  

## Can I connect a VNet that I already created to the Azure NetApp Files service?

Yes, you can connect VNets that you created to the service. 

See [Guidelines for Azure NetApp Files network planning](./azure-netapp-files-network-topologies.md) for details.  

## Can I mount an NFS volume of Azure NetApp Files using DNS FQDN name?

Yes, you can, if you create the required DNS entries. Azure NetApp Files supplies the service IP for the provisioned volume. 

> [!NOTE] 
> Azure NetApp Files can deploy additional IPs for the service as needed.  DNS entries may need to be updated periodically.

## Can I set or select my own IP address for an Azure NetApp Files volume?  

No. IP assignment to Azure NetApp Files volumes is dynamic. Static IP assignment is not supported. 

## Does Azure NetApp Files support dual stack (IPv4 and IPv6) VNet?

No, Azure NetApp Files does not currently support deploying volumes in a dual-stack (IPv4 and IPv6) delegated subnet. The delegated subnet for the Azure NetApp Files service must be an IPv4-only subnet. However, Azure NetApp Files is accessible over IPv4 through a dual-stack subnet or (peered) VNet.

## Is the number of the IP addresses using Azure VMware Solutions for Guest OS mounts limited to 1000?

No. Azure VMware Solutions is behind an ER gateway, which makes it behave similar to on-premises systems. The number of AVS "Hosts" and "Guests" is not visible to Azure NetApp Files, and the [1000 IP address limit](azure-netapp-files-resource-limits.md#resource-limits) is not applicable.
 
## Next steps  

- [Microsoft Azure ExpressRoute FAQs](../expressroute/expressroute-faqs.md)
- [Microsoft Azure Virtual Network FAQ](../virtual-network/virtual-networks-faq.md)
- [How to create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md)
- [Security FAQs](faq-security.md)
- [Performance FAQs](faq-performance.md)
- [NFS FAQs](faq-nfs.md)
- [SMB FAQs](faq-smb.md)
- [Capacity management FAQs](faq-capacity-management.md)
- [Data migration and protection FAQs](faq-data-migration-protection.md)
- [Azure NetApp Files backup FAQs](faq-backup.md)
- [Application resilience FAQs](faq-application-resilience.md)
- [Integration FAQs](faq-integration.md)
