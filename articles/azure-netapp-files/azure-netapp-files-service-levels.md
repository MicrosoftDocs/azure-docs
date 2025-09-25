---
title: Service levels for Azure NetApp Files
description: Describes throughput performance for the service levels of Azure NetApp Files.
services: azure-netapp-files
author: b-hchen
ms.service: azure-netapp-files
ms.topic: concept-article
ms.date: 09/16/2025
ms.author: anfdocs
# Customer intent: "As a cloud storage administrator, I want to understand the throughput capabilities of different service levels in Azure NetApp Files, so that I can choose the right configuration to meet my application's performance requirements."
---
# Service levels for Azure NetApp Files

Service levels are an attribute of a capacity pool. Service levels are defined and differentiated by the allowed maximum throughput for a volume in the capacity pool based on the quota assigned to the volume. Throughput is a combination of read and write speed. 

## Supported service levels

Azure NetApp Files supports four service levels: *Flexible*, *Standard*, *Premium*, and *Ultra*.   

* <a name="Flexible"></a>Flexible storage:

    The Flexible service level enables you to adjust throughput and size limits independently. You can use the Flexible service level to create high-capacity volumes with low throughput requirements or the reverse: low-capacity volumes with high throughput requirements. The Flexible service level is designed for demanding applications such as Oracle or SAP HANA.
    
    The minimum throughput you can assign a Flexible capacity pool is 128 MiB/second regardless of the pool quota. The maximum throughput is 5 x 128 MiB/second/TiB x the size of the capacity pool in TiB. For more information, see [Flexible service level throughput examples](#flexible-examples) and [considerations for the Flexible service level](azure-netapp-files-set-up-capacity-pool.md#considerations).

    >[!IMPORTANT]
    >The Flexible service level is only supported for new _manual QoS_ capacity pools.

* <a name="Standard"></a>Standard storage:   
    The Standard service level provides up to 16 MiB/s of throughput per 1 TiB of capacity provisioned.   

* <a name="Premium"></a>Premium storage:   
    The Premium service level provides up to 64 MiB/s of throughput per 1 TiB of capacity provisioned. 

* <a name="Ultra"></a>Ultra storage:   
    The Ultra service level provides up to 128 MiB/s of throughput per 1 TiB of capacity provisioned. 

* Storage with cool access:      
    [Cool access storage](manage-cool-access.md#register-the-feature) is available with the Standard, Premium, Ultra, and Flexible service levels. The throughput experience for any of these service levels with cool access is the same for cool access as it is for data in the hot tier. Throughput experiences differ when data that resides in the cool tier is accessed. For more information, see [Azure NetApp Files storage with cool access](cool-access-introduction.md) and [Performance considerations for storage with cool access](performance-considerations-cool-access.md). 

    >[!NOTE]
    >Cool access pricing is calculated in the same manner for all service levels (Standard, Premium, Ultra, and Flexible).

## Throughput limits

The throughput limit for a volume is determined by the combination of the following factors:
* The service level of the capacity pool to which the volume belongs
* The quota assigned to the volume  
* The QoS type (*auto* or *manual*) of the capacity pool  

### Throughput limit examples of volumes in an auto QoS capacity pool

The following diagram shows throughput limit examples of volumes in an auto QoS capacity pool:

![Service level illustration](./media/azure-netapp-files-service-levels/azure-netapp-files-service-levels.png)

* In Example 1, a volume from an auto QoS capacity pool with the Premium storage tier that is assigned 2 TiB of quota will be assigned a throughput limit of 128 MiB/s (2 TiB * 64 MiB/s). This scenario applies regardless of the capacity pool size or the actual volume consumption.

* In Example 2, a volume from an auto QoS capacity pool at the Premium service level with 100 GiB of quota has an assigned throughput limit of 6.25 MiB/s (0.09765625 TiB * 64 MiB/s). This scenario applies regardless of the capacity pool size or the actual volume consumption.

### Throughput limit examples of volumes in a manual QoS capacity pool 

If you use a manual QoS capacity pool, you can assign the capacity and throughput for a volume independently. When you create a volume in a manual QoS capacity pool, you can specify the throughput (MiB/S) value. The total throughput assigned to volumes in a manual QoS capacity pool depends on the size of the pool and the service level. Throughput limits for the Standard, Premium, and Ultra service levels are capped by a formula: capacity pool size in TiB x service level throughput/TiB. For instance, a 10-TiB capacity pool with the Ultra service level has a total throughput capacity of 1,280 MiB/s (10 TiB x 128 MiB/s/TiB) available for the volumes. For the Flexible service level, the formula is 5 x capacity pool size in TiB x minimum service level throughput (128 MiB/s/TiB). For example, see [Flexible service level throughput examples](#flexible-examples). 

For example, for an SAP HANA system, this capacity pool can be used to create the following volumes. Each volume provides the individual size and throughput to meet your application requirements:

* SAP HANA data volume: Size 4 TiB with up to 704 MiB/s
* SAP HANA log volume: Size 0.5 TiB with up to 256 MiB/s
* SAP HANA shared volume: Size 1 TiB with up to 64 MiB/s
* SAP HANA backup volume: Size 4.5 TiB with up to 256 MiB/s

The following diagram illustrates the scenarios for the SAP HANA volumes:

![QoS SAP HANA volume scenarios](./media/azure-netapp-files-service-levels/qos-sap-hana-volume-scenarios.png) 

The following diagram illustrates the scenarios for the SAP HANA volumes but with the Flexible service level and a baseline throughput of 128 MiB/S:

:::image type="content" source="./media/azure-netapp-files-service-levels/flexible-service-sap-hana-examples.png" alt-text="Diagram of Flexible service level throughput with SAP HANA volumes." lightbox="./media/azure-netapp-files-service-levels/flexible-service-sap-hana-examples.png":::

The example extends to the Flexible service level as well. A Flexible service level capacity pool can be used to create the following volumes. Each volume provides the individual size and throughput to meet your application requirements:

- SAP HANA data volume: Size 4 TiB with up to 704 MiB/s
- SAP HANA log volume: Size 0.5 TiB with up to 256 MiB/s
- SAP HANA shared volume: Size 1 TiB with up to 64 MiB/s
- SAP HANA backup volume: Size 4.5 TiB with up to 384 MiB/s

As illustrated in the diagram, the SAP HANA backup volume receives baseline throughput of 128 MiB/s.
 
#### <a name="flexible-examples">Flexible service level throughput examples:</a>

| Flexible pool size (TiB) | Allowable throughput minimum (MiB/s) | Allowable throughput maximum (MiB/s) |
|-|-|--|
| 1 | 128 | 5 * 128 * 1 = 640 |
| 2 | 128 | 5 * 128 * 2 = 1,280 |
| 10 | 128 | 5 * 128 * 10 = 6,400 |
| 50 | 128 | 5 * 128 * 50 = 32,000 |
| 100 | 128 | 5 * 128 * 100 = 64,000 |
| 1,024 | 128 | 5 * 128 * 1,024 = 655,360 |

>[!NOTE]
>Azure NetApp Files ensures a consistent baseline throughput regardless of capacity pool size. For example, both a 1-TiB capacity pool and a 10-TiB capacity pool receive the same complimentary baseline throughput of 128 MiB/s.

## Next steps

- [Azure NetApp Files pricing page](https://azure.microsoft.com/pricing/details/storage/netapp/)
- [Cost model for Azure NetApp Files](azure-netapp-files-cost-model.md) 
- [Create a capacity pool](azure-netapp-files-set-up-capacity-pool.md)
- [Service Level Agreement (SLA) for Azure NetApp Files](https://azure.microsoft.com/support/legal/sla/netapp/)
- [Dynamically change the service level of a volume](dynamic-change-volume-service-level.md) 
- [Service-level objectives](../reliability/reliability-netapp-files.md#region-down-experience)
