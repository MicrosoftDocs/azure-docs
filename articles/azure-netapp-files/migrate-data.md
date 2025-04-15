---
title: Migrating data into Azure NetApp Files volumes
description: Learn about different options and strategies for migrating data into Azure NetApp Files volumes. 
ms.service: azure-netapp-files
ms.topic: conceptual
author: b-ahibbard
ms.author: anfdocs
ms.date: 04/15/2025
---
# Migrating data into Azure NetApp Files volumes

There are several supported methods to migrate data into Azure NetApp Files and across regions or availability zones. 

## Migrate data from on-premises ONTAP based volumes 

The Azure NetApp Files [migration assistant](migrate-volumes.md) feature helps you accelerate and simplify migrations of business-critical applications and data to Azure. Benefits include:

* Efficient and cost-effective data migration leveraging ONTAP's built-in replication engine for seamless transition from on-premises or Cloud Volumes ONTAP storage to Azure NetApp Files. 
* Storage-efficient data transfer that reduces network transfer costs for both baseline and incremental updates. 
* Low cutover/downtime window ensuring faster and more efficient final updates, minimizing disruption to your operations.

To use Azure NetApp Files migration assistant, you need to establish connectivity between your on-premises storage cluster and the target volume in your Azure NetApp Files region of choice. For details instructions and more requirements, see [Migrate volumes to Azure NetApp Files](migrate-volumes.md).

>[!NOTE]
>The migration assistant copies all volume contents including directories, files, file metadata (for example owner, creation date, modified date), and existitng snapshots. It's your responsibility to ensure that the Azure NetApp Files target volume is configured with lightweight directory access protocol (LDAP) or Active Directory.  

## Migrate data from on-premises using other tools 

If your source data doesn't reside on an ONTAP-based system or if connectivity from on-premises storage to Azure can't be established, you can use other migration tools. For more information, see [How do I migrate data to Azure NetApp Files?](faq-data-migration-protection.md#how-do-i-migrate-data-to-azure-netapp-files)

## Migrate data between Azure NetApp Files regions 

To migrate data from one Azure region to another Azure region, use [Azure NetApp Files cross-region replication](cross-region-replication-introduction.md). 

## Migrate data between Azure NetApp Files availability zones 

To migrate data from one Azure region to another Azure region, use [Azure NetApp Files cross-zone replication](cross-zone-replication-introduction.md). 

## Next steps

* [Migrate volumes to Azure NetApp Files](migrate-volumes.md)
* [Azure NetApp Files cross-zone replication](cross-zone-replication-introduction.md)
* [Azure NetApp Files cross-region replication](cross-region-replication-introduction.md)
* [Data migration and protection FAQs for Azure NetApp Files](faq-data-migration-protection.md)
 