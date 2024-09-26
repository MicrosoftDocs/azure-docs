---
title: Migrate on-premises volumes to Azure NetApp Files 
description: Learn how to peer and migrate on-premises volumes to Azure NetApp Files and establish SnapMirror relationships. 
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.topic: how-to
ms.date: 09/25/2024
ms.author: anfdocs
---
# Migrate on-premises volumes to Azure NetApp Files 

Azure NetApp Files enables you to peer and migrate on-premises volumes in NetApp's ONTAP software 

## Considerations 

* You must be running ONTAP 9.8 or later, on your on-premises storage cluster. 
* SnapMirror license entitlement needs to be obtained and applied to the on-premises cluster. Work with the account team so they can get the Azure Technology Specialist involved in getting this license applied to the cluster, even if you already have the license. 
* Ensure your [network topology](azure-netapp-files-network-topologies.md). is supported for Azure NetApp Files and that you have established connectivity from your on-premises storage to Azure NetApp Files. 
    * You must be using Standard network features to peer and migrate on-premises volumes to Azure NetApp FIles. 
* The delegated subnet address space for hosting the Azure NetApp Files volumes must have at least 7 free IP addresses: 6 for cluster peering and one for the migration volumes. The delegated subnet address space should be sized appropriately to accommodate additional Azure NetApp Files network interfaces. Review [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md) to ensure you meet the requirements for delegated subnet sizing.  
* Once the cluster peering request has been made, the peer request must be accepted within 60 minutes of making the request. If it's not accepted within 60 minutes, the request expires. <!-- check FS --> 

## Register the feature 

<!-- steps -->

## Migrate volumes to Azure NetApp Files 

1. Navigate to your Azure NetApp Files account. 
1. Select **Migrate ONTAP volumes**. 
1. 
1. To view the status of your migration or peer clusters, navigate to the **Migration Assistant** sidebar item. You can view the replication state, schedule, and transfer status, among other details, of peered volumes. 

## Next steps 

* [Guidelines for Azure NetApp Files network planning](azure-netapp-files-network-topologies.md)