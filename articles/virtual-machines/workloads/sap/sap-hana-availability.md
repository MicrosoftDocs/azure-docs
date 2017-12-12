---
title: SAP HANA Availability Guide for Azure | Microsoft Docs
description: Operations of SAP HANA on Azure native VMs
services: virtual-machines-linux,virtual-machines-windows
documentationcenter: ''
author: juergent
manager: patfilot
editor: ''
tags: azure-resource-manager
keywords: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/17/2017
ms.author: msjuergent
ms.custom: H1Hack27Feb2017

---

# SAP HANA High Availability guide for Azure virtual machines
Azure provides a lot of features and functionality that allows to deploy mission critical databases like SAP HANA in Azure VMs.  This document provides guidance on how to achieve availability for SAP HANA instances that are hosted in Azure Virtual Machines. Within the document we are describing several scenarios that can be implemented on Azure infrastructure to increase availability of SAP HANA on Azure. 

## Prerequisites
This guide assumes that you are familiar with such infrastructure as a service (IaaS) basics as: 

- How to deploy virtual machines or virtual networks via the Azure portal or PowerShell.
- The Azure cross-platform command-line interface (CLI), including the option to use JavaScript Object Notation (JSON) templates.

This guide also assumes that you are familiar with installing SAP HANA instances and administrating and operating SAP HANA instances. Especially set up and operations around HANA System Replication or tasks like backup and restore of SAP HANA databases.

We recommend to read the article [Manage the availability of Windows virtual machines in Azure](https://docs.microsoft.com/azure/virtual-machines/windows/manage-availability) first before continuing with this article.

## Service Level agreements for different Azure components
Azure has different availability SLAs for different components like networking, storage and VMs. all these SLAs are documented and can be found starting with the [Microsoft Azure Service Level Agreement](https://azure.microsoft.com/support/legal/sla/) page. If you check out the [SLA for Virtual Machines](https://azure.microsoft.com/en-us/support/legal/sla/virtual-machines/v1_6/) you realize that Azure provides two different SLAs with two different configurations. The SLAs are defined like:

- A single VM using [Azure Premium Storage](https://docs.microsoft.com/azure/virtual-machines/windows/premium-storage) for the OS disk and all data disks provides a monthly up-time percentage of 99.9%
- Multiple (at least two) VMs that are organized in an [Azure Availability Set](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-availability-sets) provide a a monthly up-time percentage of 99.95%

measure your requirement of availability against the SLAs Azure components can provide and then decide on the different scenarios you need to implement with SAP HANA to achieve the availability you require to provide.

##Different Scenarios
In this section we will go through different deployment scenarios around SAP HANA on Azure VMs. The scenarios will cover different aspects like local availability within one region as well as scenarios that cover availability between different regions.

### Single VM scenario
In this scenario you have created an Azure Virtual machine for the SAP HANA instance. You used Azure Premium Storage for hosting the operating System disk and all the data disks. the up-time SLA of 99.9% by Azure and the SLAs of other Azure components is sufficient for you to fulfill your availability SLAs towards your customers.

In this case you rely on two different features:

- Azure VM Auto Restart (also referenced as Azure Service Healing)
- SAP HANA Auto-Restart

Azure VM Auto Restart or 'service healing' is a functionality in azure that works on two levels:

- Azure server host checking the health of a VM hosted on the server host
- Azure Fabric Controller monitoring the health and availability of the server host

For every VM hosted on an Azure server host, a health check functionality is monitoring the health of the hosted VM(s). In case VMs fall into a non-healthy state a reboot of the VM can be initiated by the host agent that checks the heatlh of the VM. The Azure Fabric Controller is checking the health of the host by checking many different parameters indicating issues with the host hardware, but also checks on the accessibility of host via the network. An indication of problems with the host can lead to actions like:

- Reboot of the host and restart of the VMs that were running on the host if the host reaches a health state
- Reboot of the host and restart of the VM(s) that were originally hosted on the host on a healthy host in case the host is not in a healthy state after the reboot. In this case the host will be marked as not healthy an not used for further deployments until cleared or replaced.
- Immediate restart of the VMs on a healthy host in cases where the unhealthy host has problems in the reboot process. 

With the host and VM monitoring provided by Azure, Azure VMs that suffer on host issues issues are Auto Restarted on a healthy Azure host 

The second feature you rely on in such a scenario is the fact that your HANA service that runs within such a restarted VM is starting automatically after the reboot of the VM. The [HANA Service Auto-Restart](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/cf10efba8bea4e81b1dc1907ecc652d3.html) can be configured through the watchdog services of the different HANA services.

This single VM scenario could get improved by adding a cold failover node to a SAP HANA configuration. Or as it is called out in the SAP HANA documentation as [Host Auto-Failover](https://help.sap.com/viewer/6b94445c94ae495c83a19646e7c3fd56/2.0.01/en-US/ae60cab98173431c97e8724856641207.html). this scenario can make sense in on-premise deployment situations where the server hardware is limited and you dedicate a single server node as Host Auto-Failover node for a set of production hosts. However for situations like Azure where the underlying infrastructure of Azure is providing a healthy target server for a successful restart of a VM, the SAP HANA Host Auto-Failover scenario does not make sense to deploy. 

Beyond that, Azure does not provide NFS storage that would be able to the storage latency requirements of high-end DBMS with SAP workload. hence the SAP HANA Host auto-Failover as described by SAP can't be deployed.





  


