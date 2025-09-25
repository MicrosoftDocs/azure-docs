---
title: Migrating data into Azure NetApp Files volumes
description: Learn about different options and strategies for migrating data into Azure NetApp Files volumes. 
ms.service: azure-netapp-files
ms.topic: conceptual
author: b-ahibbard
ms.author: anfdocs
ms.date: 09/04/2025
---
# Migrating data into Azure NetApp Files volumes

Azure NetApp Files supports several methods to migrate data. You can migrate data into Azure NetApp Files from on-premises environments, across regions, and availability zones. 

## Migrate data from on-premises ONTAP based volumes 

The Azure NetApp Files [migration assistant](migrate-volumes.md) feature helps you accelerate and simplify migrations of business-critical applications and data to Azure. Benefits include:

* Efficient and cost-effective data migration leveraging ONTAP's built-in replication engine for seamless transition from on-premises or Cloud Volumes ONTAP storage to Azure NetApp Files. 
* Storage-efficient data transfer that reduces network transfer costs for both baseline and incremental updates. 
* Low cutover/downtime window, ensuring faster and more efficient final updates, thus minimizing disruption to your operations.

To use Azure NetApp Files migration assistant, you need to establish connectivity between your on-premises storage cluster and the target volume in your Azure NetApp Files region of choice. For detailed instructions, see [Migrate volumes to Azure NetApp Files](migrate-volumes.md).


[!INCLUDE [Migration assistant volume configuration](includes/migration-assistant.md)]

## Migrate data from on-premises using other tools 

If your source data doesn't reside on an ONTAP-based system or if connectivity from on-premises storage to Azure can't be established, you can use other migration tools. For more information, see [How do I migrate data to Azure NetApp Files?](faq-data-migration-protection.md#how-do-i-migrate-data-to-azure-netapp-files)

## Migrate data between Azure NetApp Files regions 

To migrate data between Azure regions, use [Azure NetApp Files cross-region replication](replication.md). 

## Migrate data between Azure NetApp Files availability zones 

To migrate data from one Azure region to another Azure region, use [Azure NetApp Files cross-zone replication](replication.md). 

## Next steps

* [Migrate volumes to Azure NetApp Files](migrate-volumes.md)
* [Azure NetApp Files replication](replication.md)
* [Data migration and protection FAQs for Azure NetApp Files](faq-data-migration-protection.md)
 