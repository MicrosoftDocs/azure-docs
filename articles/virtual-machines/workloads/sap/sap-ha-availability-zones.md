---
title: SAP workload configurations with Availability Zones  | Microsoft Docs
description: High-availability architecture and scenarios for SAP NetWeaver using availability zones
services: virtual-machines-windows,virtual-network,storage
documentationcenter: saponazure
author: juergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.assetid: 887caaec-02ba-4711-bd4d-204a7d16b32b
ms.service: virtual-machines-windows
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure-services
ms.date: 01/09/2019
ms.author: msjuergent
ms.custom: H1Hack27Feb2017

---

# SAP workload configurations with Availability Zones

One of the high the functionalities Azure offers to improve the overall availability of SAP workload on Azure is [Azure Availability Zones](https://docs.microsoft.com/azure/availability-zones/az-overview). Availability zones are available in different [Azure Regions](https://azure.microsoft.com/global-infrastructure/regions/) already. More regions will follow. 

The basic concepts of SAP high availability can be described as displayed in this graphic:

![Standard HA configuration](./media/sap-ha-availability-zones/standard-ha-config.png)

The SAP application layer is deployed across one Azure [Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability). For high availability of SAP Central Services you usually deploy two VMs in a separate availability set and use Windows Failover Cluster Services or Pacemaker (Linux) to deploy a high availbility framework that allow automatic failover in case of an infrastructure or software problem. Documentation detailing such deployments list like:

- [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using a cluster shared disk](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-shared-disk)
- [Cluster an SAP ASCS/SCS instance on a Windows failover cluster by using file share](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/sap-high-availability-guide-wsfc-file-share)
- [High availability for SAP NetWeaver on Azure VMs on SUSE Linux Enterprise Server for SAP applications](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-suse)
- [Azure Virtual Machines high availability for SAP NetWeaver on Red Hat Enterprise Linux](https://docs.microsoft.com/azure/virtual-machines/workloads/sap/high-availability-guide-rhel)

A similar concepts applies for the DBMS layer of SAP NetWeaver, S/4HANA, or Hybris systems. You deploy those in an active/passive mode with a failover cluster solution which uses either DBMS specific failover frameworks, Windows Failover Cluster Services, or Pacemaker to initiate failover activities in case of infrastructure or software failure. 

In order to deploy the same concepts using Azure availability zones, some changes to the concepts described need to made. These changes are described in the different parts of this document.

## Considerations deploying across Availability Zones

Using Availability Zones, there are some things to consider. The considerations list like:

- Azure Availability Zones are not giving any guarantees of certain distance between the different zones within one region
- Azure availability zones are not an ideal DR solution. In times where huge natural disasters are causing wide spread damage in some regions of the world, including heavy damage to power infrastructure, the distance between different zones might be not large enough to qualify as a proper DR solution
- The network latency between different Azure Availability Zones within the different Azure regions might be different from Azure region to region. There will be cases, where you as a customer can reasonably run the SAP application layer deployed across different zones since the network latency from one zone to the active DBMS VM is still acceptable from a business process impact. Whereas there will be customer scenarios where the latency between the active DBMS VM in one zone and an SAP application instance in a VM in another zone can be too intrusive and not acceptable for the SAP business processes. As a result, the deployment architectures need to be different with an active/active architecture for the application or active/passive architecture if latency is too high.

As of Azure feature usage, there are some restrictions of functionalities that can be used when deploying Azure VMs across zones and establishing failover solutions across different availability zones within the same Azure region. These restrictions list like:

- Using [Azure managed disks](https://azure.microsoft.com/services/managed-disks/) is mandatory for deploying into Azure Availability Zones 
- The mapping of zone enumerations to the physical zones is fixed on a Azure subscription basis. I you are using different subscriptions to deploy your SAP systems, you need to define the ideal zones for each subscription separately
- You can't deploy Azure Availability Sets within an Availability Zone. You need to choose either an Availability Zone or an Availability Set as deployment frame for a VM.
- You can't use the [Basic Load Balancer](https://docs.microsoft.com/azure/load-balancer/load-balancer-overview#skus) to create failover cluster solutions based on Windows Failover Cluster Services or Linux Pacemaker. Instead you need to use the [Azure Standard Load Balancer SKU](https://docs.microsoft.com/azure/load-balancer/load-balancer-standard-availability-zones)



## Ideal zone combination
The usual high availability

