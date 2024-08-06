---
title: Requirements and considerations for large volumes | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using large volumes.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: conceptual
ms.date: 07/22/2024
ms.author: anfdocs
---
# Requirements and considerations for large volumes

This article describes the requirements and considerations you need to be aware of before using [large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes) on Azure NetApp Files.

## Requirements and considerations

The following requirements and considerations apply to large volumes. For performance considerations of *regular volumes*, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

* A regular volume can’t be converted to a large volume.
* You must create a large volume at a size of 50 TiB or larger. A single volume can't exceed 1 PiB.  
* You can't resize a large volume to less than 50 TiB.
    A large volume cannot be resized to more than 30% of its lowest provisioned size. This limit is adjustable via [a support request](azure-netapp-files-resource-limits.md#resource-limits).
* Large volumes are currently not supported with Azure NetApp Files backup.
* You can't create a large volume with application volume groups.
* Currently, large volumes aren't suited for database (HANA, Oracle, SQL Server, etc.) data and log volumes. For database workloads requiring more than a single volume’s throughput limit, consider deploying multiple regular volumes. To optimize multiple volume deployments for databases, use [application volume groups](application-volume-group-concept.md).
* Throughput ceilings for the three performance tiers (Standard, Premium, and Ultra) of large volumes are based on the existing 100-TiB maximum capacity targets. You're able to grow to 1 PiB with the throughput ceiling per the following table:  
    
    <table><thead>
      <tr>
        <th></th>
        <th colspan="2">Capacity</th>
        <th colspan="2">Linear performance scaling per TiB up to maximum throughput </th>
      </tr></thead>
    <tbody>
      <tr>
        <td>Capacity tier</td>
        <td>Minimum volume size<br>(TiB)</td>
        <td>Maximum volume size (TiB)</td>
        <td>Minimum throughput (MiB/s)</td>
        <td>Maximum throughput (MiB/s)</td>
      </tr>
      <tr>
        <td>Standard (16 MiB/s per TiB)</td>
        <td>50</td>
        <td>1,024</td>
        <td>800</td>
        <td>12,800</td>
      </tr>
      <tr>
        <td>Premium (64 MiB/s per TiB)</td>
        <td>50</td>
        <td>1,024</td>
        <td>3,200</td>
        <td>12,800</td>
      </tr>
      <tr>
        <td>Ultra (128 MiB/s per TiB)</td>
        <td>50</td>
        <td>1,024</td>
        <td>6,400</td>
        <td>12,800</td>
      </tr>
    </tbody>
    </table>

    \* 2-PiB large volumes are available on request depending on regional dedicated capacity availability. To request 2-PiB large volumes, contact your account team. 
    
* Large volumes aren't currently supported with standard storage with cool access.

## About 64-bit file IDs

Whereas regular volume use 32-bit file IDs, large volumes employ 64-bit file IDs. File IDs are unique identifiers that allow Azure NetApp Files to keep track of files in the file system. 64-bit IDs are utilized to increase the number of files allowed in a single volume, enabling a large volume able to hold more files than a regular volume. 

## Supported regions

Support for Azure NetApp Files large volumes is available in the following regions:

* Australia East
* Australia Southeast
* Brazil South
* Canada Central
* Central India
* Central US
* East US
* East US 2
* France Central
* Germany West Central
* Japan East
* North Europe
* Qatar Central
* South Africa North 
* South Central US
* Southeast Asia
* Switzerland North
* UAE North
* UK West
* UK South
* US Gov Virginia 
* West Europe
* West US
* West US 2
* West US 3

## Configure large volumes 

>[!IMPORTANT]
>Before you can use large volumes, you must first request [an increase in regional capacity quota](azure-netapp-files-resource-limits.md#request-limit-increase).

Once your [regional capacity quota](regional-capacity-quota.md) has increased, you can create volumes that are up to 1 PiB in size. When creating a volume, after you designate the volume quota, you must select **Yes** for the **Large volume** field. Once created, you can manage your large volumes in the same manner as regular volumes. 

### Register the feature 

If this is your first time using large volumes, register the feature with the [large volumes sign-up form](https://aka.ms/anflargevolumessignup).

## Next steps

* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
