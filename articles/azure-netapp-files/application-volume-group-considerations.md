---
title: Requirements and considerations for Azure NetApp Files application volume group for SAP HANA | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using Azure NetApp Files application volume group for SAP HANA.  
services: azure-netapp-files
documentationcenter: ''
author: b-juche
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 11/10/2021
ms.author: b-juche
---
# Requirements and considerations for application volume group for SAP HANA 

This article describes the requirements and considerations you need to be aware of before using Azure NetApp Files application volume group for SAP HANA.

## Requirements and considerations

* You will need to use the manual QoS capacity pool functionality.  
* You must have created a proximity placement group (PPG) and anchor it to your SAP HANA compute resources. Application volume group for SAP HANA needs this setup to search for an Azure NetApp Files resource that is close to the SAP HANA servers. For more information, see [Best practices about Proximity Placement Groups](#best-practices-about-proximity-placement-groups) and [Create a Proximity Placement Group using the Azure portal](../virtual-machines/windows/proximity-placement-groups-portal.md).  
* You must have completed your sizing and SAP HANA system architecture, including the following areas: 
    * SAP ID (SID)
    * Memory
    * Single-host or multiple-host SAP HANA
    * Determine whether you want to use HANA System Replication (HSR).
        HSR enables SAP HANA databases to synchronously or asynchronously replicate from a primary SAP HANA system to a secondary SAP HANA system. 
    * The expected change rate for the data volume (in case you're using snapshots for backup purposes)
* You must have created a VNet and delegated subnet to map the Azure NetApp Files IP addresses.

    It is recommended that you lay out the VNet and delegated subnet at design time. 

    Application volume group for SAP HANA will create multiple IP addresses, up to six IP addresses for larger-sized estates. Ensure that the delegated subnet has sufficient free IP addresses. It’s recommended that you use a delegated subnet with a minimum of 32 IP addresses. 

## Best practices about proximity placement groups

To deploy SAP HANA volumes using the application volume group, you need to use your HANA database VM’s as anchor for a proximity placement group (PPG). It’s recommended that you create an availability set per database and use the **pinning request form** to pin the availability set to a dedicated compute cluster. After pinning, you need to add a PPG to the availability set  and then deploy all hosts of an SAP HANA database using that availability set. Doing so ensures that all virtual machines are at the same location. If the virtual machines are started, the PPG has its anchor.

> [!NOTE]
> The PPG must be in the same resource group as the capacity pool you want to use for the SAP HANA volumes.

Be aware that when using a PPG without a pinned availability set, a PPG would lose its anchor if all the virtual machines in that PPG are stopped. When the virtual machines are restarted, they might be started in a different location, which can result in a latency increase because the volumes created with the application volume group will not be moved. 
This situation leads to two possible scenarios:

* Stable long-term setup:   
    Using an availability set in combination with a PPG where the availability set is manually pinned.

    With the pinning, it is always assured that the placement of the virtual machine will not be changed even if all machines in the availability set are stopped.

* Temporary setup:   
    Using a PPG or an availability set in combination with a PPG without any pinning.

    SAP HANA capable virtual machine series (that is, M-Series) are mostly placed close to Azure NetApp Files so that the application volume group with the help of a PPG can create the required volumes with lowest possible latency. This relationship between volumes and HANA hosts will not change if at least one virtual machine is up and running.

## Next steps

* [Understand Azure NetApp Files application volume group for SAP HANA](application-volume-group-introduction.md)
* [Deploy the first SAP HANA host using application volume group for SAP HANA](application-volume-group-deploy-first-host.md)
* [Add hosts to a multiple-host SAP HANA system using application volume group for SAP HANA](application-volume-group-add-hosts.md)
* [Add volumes for an SAP HANA system as a secondary database in HSR](application-volume-group-add-volume-secondary.md)
* [Add volumes for an SAP HANA system as a DR system using cross-region replication](application-volume-group-disaster-recovery.md)
* [Manage volumes in application volume group](application-volume-group-manage-volumes.md)
* [Delete an application volume group](application-volume-group-delete.md)
* [Application volume group FAQs](faq-application-volume-group.md)

