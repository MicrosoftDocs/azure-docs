---
title: SAP HANA Availability across Azure Regions | Microsoft Docs
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

# Availability across Azure Region
## Motivation to deploy across multiple Azure Regions
Different Azure regions are usually separated by a larger distance. Dependent on geopolitical region this could hundreds of miles or even several thousand miles, like in the United States. Due to the distance between the different Azure Regions, network traffic between assets deployed between two Azure regions experience significant network roundtrip latency. Significant enough to exclude synchronous data exchange between two SAP HANA instances under typical SAP workload. 
On the other side, you often are faced with the fact that there is defined requirement on distance between your primary datacenter and a secondary datacenter in order to provide availability in case of natural disaster hitting a city or a wider area. Or at least a minimum distance requirement. In most of the customer cases, this minimum distance definition requires you to design for availability across [Azure Regions](https://azure.microsoft.com/regions/). Since the distance is too large between two Azure regions to use synchronous replication mode of HANA, requirements of RTO and RPO might force you to deploy availability configurations within one region and then supplement with additional deployments in a second region.

Another aspect to be considered in these configurations is the failover and the client redirect. The assumption is that a failover between SAP HANA instances in two different Azure regions always is a manual failover. Since the replication mode of SAP HANA System Replication is set to asynchronous, there is a potential that data committed in the primary HANA instance has not made it yet to the secondary HANA instance in case outside events would trigger an automatic failover. Even with manual controlled failover, as in a failover exercise, you need to take measures to make sure that all the committed data on the primary side made it to the secondary instance. 
Since you usually operate with a different IP address range in the Azure VNets which are deployed in the second Azure region, the SAP HANA clients either need to be changed in their configuration or way better you need to put steps in place to change the name resolution. So, that the clients are getting redirected to the new seondary's server IP address. The SAP article on [Client Connection Recovery after Takeover](https://help.sap.com/doc/6b94445c94ae495c83a19646e7c3fd56/2.0.02/en-US/c93a723ceedc45da9a66ff47672513d3.html) goes into more details on this topic.   

## Simple availability between two regions
In this scenario, you decided not to put any availability configuration in place within a single region. But you have the demand to have the workload served in case of a disaster. Typical cases for systems like that are non-production systems. Though you can sustain to have the system down for half a day or even a day, you can not allow the system to be not available for 48 hours or more. In order to make the setup less costly, you run another system that is even less important ion the VM that functions as a destination, or you size the VM in secondary region smaller and choose not to pre-load the data. Since the failover will be manual and entails many more steps to failover the complete application stack as well, the additional time to bring down the VM, re-size it and start the VM again, is acceptable.

> [!NOTE]
> Be aware that even w/o data pre-load in the HANA System Replication target, you need at least 64GB memory and beyond that enough memory to keep the rowstore data in memory of the target instance.

![Two VMs over two regions](./media/sap-hana-availability-two-region/two_vm_HSR_async_2regions_nopreload.PNG)

> [!NOTE]
> In this configuration you can't provide an RPO=0 since your HANA System Replication mode is asynchronous. If you need to provide an RPO=0 this is not the configuration of choice.

A small change on the configuration could be to configure data pre-loading. However given the manual nature of failover and the fact that application layers need to move to the second region as well, it usually does not make sense to pre-load data.  

 
  
