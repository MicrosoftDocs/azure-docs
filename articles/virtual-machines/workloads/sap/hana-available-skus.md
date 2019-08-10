---
title: SKUs for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: SKUs for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: RicksterCDN
manager: gwallace
editor: ''

ms.service: virtual-machines-linux
ms.devlang: NA
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 07/12/2019
ms.author: juergent
ms.custom: H1Hack27Feb2017

---
# Available SKUs for HLI

SAP HANA on Azure (Large Instances) service based on Revision 3 stamps is available in several configurations in the Azure regions of:

- West US
- East US
- Australia East
- Australia Southeast
- West Europe
- North Europe
- Japan East
- Japan West

SAP HANA on Azure (Large Instances) service based on Revision 4 stamps is available in several configurations in the Azure regions of:

- West US 2
- East US
- West Europe
- North Europe



[SAP HANA certified SKUs of HANA large Instances](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) list like:

| SAP solution | CPU | Memory | Storage | Availability |
| --- | --- | --- | --- | --- |
| Optimized for OLAP: SAP BW, BW/4HANA<br /> or SAP HANA for generic OLAP workload | SAP HANA on Azure S72<br /> – 2 x Intel® Xeon® Processor E7-8890 v3<br /> 36 CPU cores and 72 CPU threads |  768 GB |  3 TB | Not offered anymore |
| --- | SAP HANA on Azure S144<br /> – 4 x Intel® Xeon® Processor E7-8890 v3<br /> 72 CPU cores and 144 CPU threads |  1.5 TB |  6 TB | Not offered anymore |
| --- | SAP HANA on Azure S192<br /> – 4 x Intel® Xeon® Processor E7-8890 v4<br /> 96 CPU cores and 192 CPU threads |  2.0 TB |  8 TB | Available |
| --- | SAP HANA on Azure S384<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  4.0 TB |  16 TB | Available |
| Optimized for OLTP: SAP Business Suite<br /> on SAP HANA or S/4HANA (OLTP),<br /> generic OLTP | SAP HANA on Azure S72m<br /> – 2 x Intel® Xeon® Processor E7-8890 v3<br /> 36 CPU cores and 72 CPU threads |  1.5 TB |  6 TB | Not offered anymore |
|---| SAP HANA on Azure S144m<br /> – 4 x Intel® Xeon® Processor E7-8890 v3<br /> 72 CPU cores and 144 CPU threads |  3.0 TB |  12 TB | Not offered anymore |
|---| SAP HANA on Azure S192m<br /> – 4 x Intel® Xeon® Processor E7-8890 v4<br /> 96 CPU cores and 192 CPU threads  |  4.0 TB |  16 TB | Available |
|---| SAP HANA on Azure S384m<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  6.0 TB |  18 TB | Available |
|---| SAP HANA on Azure S384xm<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  8.0 TB |  22 TB |  Available |
|---| SAP HANA on Azure S576m<br /> – 12 x Intel® Xeon® Processor E7-8890 v4<br /> 288 CPU cores and 576 CPU threads |  12.0 TB |  28 TB | Available |
|---| SAP HANA on Azure S768m<br /> – 16 x Intel® Xeon® Processor E7-8890 v4<br /> 384 CPU cores and 768 CPU threads |  16.0 TB |  36 TB | Available |
|---| SAP HANA on Azure S960m<br /> – 20 x Intel® Xeon® Processor E7-8890 v4<br /> 480 CPU cores and 960 CPU threads |  20.0 TB |  46 TB | Available |


Under SAP HANA TDIv5, SAP allows customer-specific sizing and customer-specific projects, which might lead to server configurations, which are not listed as certified in:

- [SAP HANA Certified Appliances](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/appliances.html)
- [SAP HANA certified IaaS platforms](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure)

In many cases, these customer-specific server configurations carry more memory than the server units certified with SAP. In working with SAP, customers do have the possibility to get SAP support and certify for their customer-specific sized server configurations. In Azure, the following HANA Large Instance standard SKUs are available and in the Microsoft price list for such TDIv5 customer-specific sizing projects.

| SKU|CPU | Memory | Storage | Availability |
| ---| --- | --- | --- | --- |
| S96 | SAP HANA on Azure S96<br /> – 2 x Intel® Xeon® Processor E7-8890 v4<br /> 48 CPU cores and 96 CPU threads |  768 GB |  3 TB | Available |


| Original SKU that can be <br /> extended in memory | CPU | Memory | Storage | Availability |
| --- | --- | --- | --- | --- |
| S192m can be extended to | SAP HANA on Azure S192xm<br /> – 4 x Intel® Xeon® Processor E7-8890 v4<br /> 96 CPU cores and 192 CPU threads |  6.0 TB |  16 TB | Available |
| S384xm can be extended to | SAP HANA on Azure S384xxm<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  12.0 TB |  28 TB | Available |
| S576m can be extended to | SAP HANA on Azure S576xm<br /> – 12 x Intel® Xeon® Processor E7-8890 v4<br /> 288 CPU cores and 576 CPU threads |  18.0 TB |  41 TB | Available |
| S768m can be extended to | SAP HANA on Azure S768xm<br /> – 16 x Intel® Xeon® Processor E7-8890 v4<br /> 384 CPU cores and 768 CPU threads |  24.0 TB |  56 TB | Available |

- CPU cores = sum of non-hyper-threaded CPU cores of the sum of the processors of the server unit.
- CPU threads = sum of compute threads provided by hyper-threaded CPU cores of the sum of the processors of the server unit. Most units are configured by default to use Hyper-Threading Technology.
- Based on supplier recommendations S768m, S768xm, and S960m are not configured to use Hyper-Threading for running SAP HANA.


The specific configurations chosen are dependent on workload, CPU resources, and desired memory. It's possible for the OLTP workload to use the SKUs that are optimized for the OLAP workload. 

The hardware base for the offers, except units for customer-specific sizing projects, are SAP HANA TDI-certified. Two different classes of hardware divide the SKUs into:

- S72, S72m, S96, S144, S144m, S192, S192m, and S192xm, which are referred to as the "Type I class" of SKUs.
- S384, S384m, S384xm, S384xxm, S576m, S576xm S768m, S768xm, and S960m, which are referred to as the "Type II class" of SKUs.

A complete HANA Large Instance stamp isn't exclusively allocated for a single customer&#39;s use. This fact applies to the racks of compute and storage resources connected through a network fabric deployed in Azure as well. HANA Large Instance infrastructure, like Azure, deploys different customer &quot;tenants&quot; that are isolated from one another in the following three levels:

- **Network**: Isolation through virtual networks within the HANA Large Instance stamp.
- **Storage**: Isolation through storage virtual machines that have storage volumes assigned and isolate storage volumes between tenants.
- **Compute**: Dedicated assignment of server units to a single tenant. No hard or soft partitioning of server units. No sharing of a single server or host unit between tenants. 

The deployments of HANA Large Instance units between different tenants aren't visible to each other. HANA Large Instance units deployed in different tenants can't communicate directly with each other on the HANA Large Instance stamp level. Only HANA Large Instance units within one tenant can communicate with each other on the HANA Large Instance stamp level.

A deployed tenant in the Large Instance stamp is assigned to one Azure subscription for billing purposes. For a network, it can be accessed from virtual networks of other Azure subscriptions within the same Azure enrollment. If you deploy with another Azure subscription in the same Azure region, you also can choose to ask for a separated HANA Large Instance tenant.

There are significant differences between running SAP HANA on HANA Large Instance and SAP HANA running on VMs deployed in Azure:

- There is no virtualization layer for SAP HANA on Azure (Large Instances). You get the performance of the underlying bare-metal hardware.
- Unlike Azure, the SAP HANA on Azure (Large Instances) server is dedicated to a specific customer. There is no possibility that a server unit or host is hard or soft partitioned. As a result, a HANA Large Instance unit is used as assigned as a whole to a tenant and with that to you. A reboot or shutdown of the server doesn't lead automatically to the operating system and SAP HANA being deployed on another server. (For Type I class SKUs, the only exception is if a server encounters issues and redeployment needs to be performed on another server.)
- Unlike Azure, where host processor types are selected for the best price/performance ratio, the processor types chosen for SAP HANA on Azure (Large Instances) are the highest performing of the Intel E7v3 and E7v4 processor line.

**Next steps**
- Refer [HLI Sizing](hana-sizing.md)
