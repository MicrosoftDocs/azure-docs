---
title: SKUs for SAP HANA on Azure (Large Instances) | Microsoft Docs
description: SKUs for SAP HANA on Azure (Large Instances).
services: virtual-machines-linux
documentationcenter: 
author: msjuergent
manager: juergent
editor: ''
keywords: 'HLI, HANA, SKUs, S896, S224, S448, S672, Optane, SAP'
ms.service: virtual-machines-sap
ms.topic: article
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 4/16/2021
ms.author: juergent
ms.custom: H1Hack27Feb2017, references_regions

---
# Available SKUs for HANA Large Instances

BareMetal Infrastructure (certified for SAP HANA workloads) service based on Rev 4.2* is available in the following regions:
- West Europe
- North Europe
- Germany West Central with Zones support
- East US with Zones support
- East US 2
- South Central US
- West US 2 with Zones support

BareMetal Infrastructure (certified for SAP HANA workloads) service based on Rev 3* has limited availability in following regions:
- West US
- East US 
- Australia East 
- Australia Southeast
- Japan East


The following is a list of available Azure Large instances.

> [!IMPORTANT]
> Be aware of the first column that represents the status of HANA certification for each of the Large Instance types in the list. The column should correlate with the [SAP HANA hardware directory](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure) for the Azure SKUs that start with the letter **S**.



| SAP HANA certified | Model | Total Memory | Memory DRAM | Memory Optane | Storage | Availability |
| --- | --- | --- | --- | --- | --- | --- |
| YES <br />[OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2185), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2265) | SAP HANA on Azure S96<br /> –  2 x Intel® Xeon® Processor E7-8890 v4 <br /> 48 CPU cores and 96 CPU threads |  768 GB | 768 GB | --- | 3.0 TB | Available |
| YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2186), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2269) | SAP HANA on Azure S224<br /> – 4 x Intel® Xeon® Platinum 8276 processor <br /> 112 CPU cores and 224 CPU threads |  3.0 TB | 3.0 TB | --- | 6.3 TB | Available |
| YES <br />[OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2297) | SAP HANA on Azure S224m<br /> – 4 x Intel® Xeon® Platinum 8276 processor <br /> 112 CPU cores and 224 CPU threads |  6.0 TB | 6.0 TB | --- | 10.5 TB | Available |
| YES <br />[OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2381) | SAP HANA on Azure S224om<br /> – 4 x Intel® Xeon® Platinum 8276 processor <br /> 112 CPU cores and 224 CPU threads | 6.0 TB |  3.0 TB |  3.0 TB | 10.5 TB | Available |
| NO | SAP HANA on Azure S224oo<br /> – 4 x Intel® Xeon® Platinum 8276 processor <br /> 112 CPU cores and 224 CPU threads | 4.5 TB |  1.5 TB |  3.0 TB | 8.4 TB | Available |
| NO | SAP HANA on Azure S224ooo<br /> – 4 x Intel® Xeon® Platinum 8276 processor <br /> 112 CPU cores and 224 CPU threads | 7.5 TB |  1.5 TB |  6.0 TB | 12.7 TB | Available |
| NO | SAP HANA on Azure S224oom<br /> – 4 x Intel® Xeon® Platinum 8276 processor <br /> 112 CPU cores and 224 CPU threads | 9.0 TB |  3.0 TB |  6.0 TB | 14.8 TB | Available |
| YES <br />[OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=1983), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2268) | SAP HANA on Azure S384<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  4.0 TB | 4.0 TB | --- | 16 TB | Available |
| YES <br />[OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2080) | SAP HANA on Azure S384m<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  6.0 TB | 6.0 TB | --- | 18 TB |  Available  |
| YES <br />[OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=1984), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2267) | SAP HANA on Azure S384xm<br /> – 8 x Intel® Xeon® Processor E7-8890 v4<br /> 192 CPU cores and 384 CPU threads |  8.0 TB | 8.0 TB | --- | 22 TB | Available |
| YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24&id=s:2411), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2378) | SAP HANA on Azure S448<br /> – 8 x Intel® Xeon® Platinum 8276 processor <br /> 224 CPU cores and 448 CPU threads | 6.0 TB |  6.0 TB |  --- | 10.5 TB | Available (Rev 4.2 only) |
| YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24&id=s:2410), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2377) | SAP HANA on Azure S448m<br /> – 8 x Intel® Xeon® Platinum 8276 processor <br /> 224 CPU cores and 448 CPU threads | 12.0 TB |  12.0 TB |  --- | 18.9 TB | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S448oo<br /> – 8 x Intel® Xeon® Platinum 8276 processor <br /> 224 CPU cores and 448 CPU threads | 9.0 TB |  3.0 TB |  6.0 TB | 14.8 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S448om<br /> – 8 x Intel® Xeon® Platinum 8276 processor <br /> 224 CPU cores and 448 CPU threads | 12.0 TB |  6.0 TB |  6.0 TB | 18.9 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S448ooo<br /> – 8 x Intel® Xeon® Platinum 8276 processor <br /> 224 CPU cores and 448 CPU threads | 15.0 TB |  3.0 TB |  12.0 TB | 23.2 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S448oom<br /> – 8 x Intel® Xeon® Platinum 8276 processor <br /> 224 CPU cores and 448 CPU threads | 18.0 TB |  6.0 TB |  12.0 TB | 27.4 TB  | Available (Rev 4.2 only) |
| YES <br /> [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2049) | SAP HANA on Azure S576m<br /> – 12 x Intel® Xeon® Processor E7-8890 v4<br /> 288 CPU cores and 576 CPU threads |  12.0 TB | 12.0 TB | --- | 28 TB | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S576xm<br /> – 12 x Intel® Xeon® Processor E7-8890 v4<br /> 288 CPU cores and 576 CPU threads |  18.0 TB | 18.0 | --- |  41 TB | Available |
| YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24&id=s:2409), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2380) | SAP HANA on Azure S672<br /> – 12 x Intel® Xeon® Platinum 8276 processor <br /> 336 CPU cores and 672 CPU threads | 9.0 TB |  9.0 TB |  --- | 14.7 TB | Available (Rev 4.2 only) |
| YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24&id=s:2408), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2379) | SAP HANA on Azure S672m<br /> – 12 x Intel® Xeon® Platinum 8276 processor <br /> 336 CPU cores and 672 CPU threads | 18.0 TB |  18.0 TB |  --- | 27.4 TB | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S672oo<br /> – 12 x Intel® Xeon® Platinum 8276 processor <br /> 336 CPU cores and 672 CPU threads | 13.5 TB |  4.5 TB |  9.0 TB | 21.1 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S672om<br /> – 12 x Intel® Xeon® Platinum 8276 processor <br /> 336 CPU cores and 672 CPU threads | 18.0 TB |  9.0 TB |  9.0 TB | 27.4 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S672ooo<br /> – 12 x Intel® Xeon® Platinum 8276 processor <br /> 336 CPU cores and 672 CPU threads | 22.5 TB |  4.5 TB |  18.0 TB | 33.7 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S672oom<br /> – 12 x Intel® Xeon® Platinum 8276 processor <br /> 336 CPU cores and 672 CPU threads | 27.0 TB |  9.0 TB |  18.0 TB | 40.0 TB  | Available (Rev 4.2 only) |
| YES <br />[OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=1985) | SAP HANA on Azure S768m<br /> – 16 x Intel® Xeon® Processor E7-8890 v4<br /> 384 CPU cores and 768 CPU threads |  16.0 TB | 16.0 TB | -- | 36 TB | Available |
| NO | SAP HANA on Azure S768xm<br /> – 16 x Intel® Xeon® Processor E7-8890 v4<br /> 384 CPU cores and 768 CPU threads |  24.0 TB | 24.0 TB | --- | 56 TB | Available |
|  YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24&id=s:2407), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2376)  | SAP HANA on Azure S896<br /> – 16 x Intel® Xeon® Platinum 8276 processor <br /> 448 CPU cores and 896 CPU threads | 12.0 TB |  12.0 TB |  --- | 18.9 TB | Available (Rev 4.2 only) |
| YES <br /> [OLAP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/#/solutions?filters=iaas;ve:24&id=s:2406), [OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=2328) | SAP HANA on Azure S896m<br /> – 16 x Intel® Xeon® Platinum 8276 processor <br /> 448 CPU cores and 896 CPU threads | 24.0 TB | 24.0 TB | -- | 35.8 TB | Available |
| NO | SAP HANA on Azure S896oo<br /> – 16 x Intel® Xeon® Platinum 8276 processor <br /> 448 CPU cores and 896 CPU threads | 18.0 TB |  6.0 TB |  12.0 TB | 27.4 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S896om<br /> – 16 x Intel® Xeon® Platinum 8276 processor <br /> 448 CPU cores and 896 CPU threads | 24.0 TB |  12.0 TB |  12.0 TB | 35.8 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S896ooo<br /> – 16 x Intel® Xeon® Platinum 8276 processor <br /> 448 CPU cores and 896 CPU threads | 30.0 TB |  6.0 TB |  24.0 TB | 44.3 TB  | Available (Rev 4.2 only) |
| NO | SAP HANA on Azure S896oom<br /> – 16 x Intel® Xeon® Platinum 8276 processor <br /> 448 CPU cores and 896 CPU threads | 36.0 TB |  12.0 TB |  24.0 TB | 52.7 TB  | Available (Rev 4.2 only) |
| YES <br />[OLTP](https://www.sap.com/dmc/exp/2014-09-02-hana-hardware/enEN/iaas.html#categories=Microsoft%20Azure&recordid=1986) | SAP HANA on Azure S960m<br /> – 20 x Intel® Xeon® Processor E7-8890 v4<br /> 480 CPU cores and 960 CPU threads |  20.0 TB | 20.0 TB | -- | 46 TB | Available (Rev 4.2 only) |


- CPU cores = sum of non-hyper-threaded CPU cores of the sum of the processors of the server unit.
- CPU threads = sum of compute threads provided by hyper-threaded CPU cores of the sum of the processors of the server unit. Most units are configured by default to use Hyper-Threading Technology.
- Based on supplier recommendations S768m, S768xm, and S960m are not configured to use Hyper-Threading for running SAP HANA.


> [!IMPORTANT]
> The following SKUs, though still supported can't be purchased anymore: S72, S72m, S144, S144m, S192, and S192m 

The specific configurations chosen are dependent on workload, CPU resources, and desired memory. It's possible for the OLTP workload to use the SKUs that are optimized for the OLAP workload. 

Two different classes of hardware divide the SKUs into:

- S72, S72m, S96, S144, S144m, S192, S192m, S192xm, S224, and S224m, S224oo, S224om, S224ooo, S224oom are referred to as the "Type I class" of SKUs.
- All other SKUs are referred to as the "Type II class" of SKUs.
- If you are interested in SKUs that are not yet listed in the SAP hardware directory, contact your Microsoft account team to get more information. 


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

## Next steps
- Refer to [HLI Sizing](hana-sizing.md).
