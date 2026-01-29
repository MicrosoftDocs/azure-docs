---
title: Change availability zones for Elastic zone-redundant capacity pools in Azure NetApp Files
description: Learn how to change the availability zone of a capacity pool in Elastic zone-redundant storage. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 01/26/2026
ms.author: anfdocs
---
# Change availability zones for Elastic zone-redundant capacity pools in Azure NetApp Files

With Elastic zone-redundant storage, you can easily change the availability zone of a capacity pool and its volumes based on needs, for example co-locating storage in the same availability zone to reduce latency.

>[!NOTE]
>Capacity pools fail over to a new zone automatically in the event of a zonal outage. 

## Considerations

* Manually changing the availability zone for a capacity pool can be a long-running operation. 
* Change the availability zone for an Elastic zone-redundant capacity pool changes it for all volumes in the pool. You can't change the availability zone of individual volumes. 

## Change the availability zone 

1. In the Azure portal, select your capacity pool. 
1. In the capacity pool overview, select **Edit Current Availability Zone**. 
1. In the Edit Current Availability Zone blade, select the new zone the Availability Zone dropdown menu then **OK** to confirm your selection.  
1. Reload the page to confirm the availability zone change was successful in the capacity pool overview's **Current zone** field.

## More information 

* [Understand Elastic zone-redundant storage](elastic-zone-redundant-concept.md)
