---
title: Requirements and considerations for Azure NetApp Files application volume group for Oracle | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using Azure NetApp Files application volume group for Oracle.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 10/20/2023
ms.author: anfdocs
---
# Requirements and considerations for application volume group for Oracle 

This article describes the requirements and considerations you need to be aware of before using Azure NetApp Files application volume group for Oracle.

## Requirements and considerations

* You need to use the [manual QoS capacity pool](manage-manual-qos-capacity-pool.md) type.  
* You need to prepare input of the required database size and throughput.  See the following references:   
    * [Run Your Most Demanding Oracle Workloads in Azure without Sacrificing Performance or Scalability](https://techcommunity.microsoft.com/t5/azure-architecture-blog/run-your-most-demanding-oracle-workloads-in-azure-without/ba-p/3264545)
    * [Estimate Tool for Sizing Oracle Workloads to Azure IaaS VMs](https://techcommunity.microsoft.com/t5/data-architecture-blog/estimate-tool-for-sizing-oracle-workloads-to-azure-iaas-vms/ba-p/1427183)
* You need to complete your sizing and Oracle system architecture, including the following areas:   
    * Choose a unique system ID to uniquely identify all storage objects.
    * Determine the total database size and throughput requirements.
    * Calculate the number of data volumes required to deliver the required read and write throughput. See [Oracle database performance on Azure NetApp Files multiple volumes](performance-oracle-multiple-volumes.md) for more details.
    * Determine the expected change rate for the database volumes (in case you're using snapshots for backup purposes).
* Create a VNet and delegated subnet to map the Azure NetApp Files IP addresses. It is recommended that you lay out the VNet and delegated subnet at design time
* Application volume group for Oracle volumes are deployed in a selectable availability zone for regions that offer availability zones. You need to ensure that the database server is provisioned in the same availability zone as the Azure NetApp Files volumes. You may need to check in which zones the required VM types are available as well as Azure NetApp Files resources. 
* Application volume group for Oracle currently only supports platform-managed keys for Azure NetApp Files volume encryption at volume creation. 
    Contact your Azure NetApp Files specialist or CSA if you have questions about transitioning volumes from platform-managed keys to customer-managed keys after volume creation.
* Application volume group for Oracle creates multiple IP addresses--at a minimum four IP addresses for a single database. For larger Oracle estates distributed across zones, it can be 12 or more IP addresses. Ensure that the delegated subnet has sufficient free IP addresses. It's recommended that you use a delegated subnet with a minimum of 59 IP addresses with a subnet size of /26. For larger Oracle deployments, consider using a /24 network offering 251 IP addresses for the delegated subnet. See [Considerations about delegating a subnet to Azure NetApp Files](azure-netapp-files-delegate-subnet.md#considerations).

> [!IMPORTANT]
> The use of application volume group for Oracle for applications other than Oracle is not supported. Reach out to your Azure NetApp Files specialist for guidance on using Azure NetApp Files multi-volume layouts with other database applications.

## Next steps

* [Understand application volume group for Oracle](application-volume-group-oracle-introduction.md)
* [Deploy application volume group for Oracle](application-volume-group-oracle-deploy-volumes.md)
* [Manage volumes in an application volume group for Oracle](application-volume-group-manage-volumes-oracle.md)
* [Configure application volume group for Oracle using REST API](configure-application-volume-oracle-api.md) 
* [Deploy application volume group for Oracle using Azure Resource Manager](configure-application-volume-oracle-azure-resource-manager.md) 
* [Troubleshoot application volume group errors](troubleshoot-application-volume-groups.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)