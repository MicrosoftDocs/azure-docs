---
title: Requirements and considerations for large volumes | Microsoft Docs
description: Describes the requirements and considerations you need to be aware of before using large volumes.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: conceptual
ms.date: 12/31/2024
ms.author: anfdocs
---
# Requirements and considerations for large volumes

This article describes the requirements and considerations you need to be aware of before using [large volumes](azure-netapp-files-understand-storage-hierarchy.md#large-volumes) on Azure NetApp Files.

## Requirements and considerations

The following requirements and considerations apply to large volumes. For performance considerations of *regular volumes*, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

* A regular volume can’t be converted to a large volume.
* You must create a large volume at a size of 50 TiB or larger. The maximum size of a large volume is 1,024 TiB, though 2-PiB large volumes are available on request depending on regional dedicated capacity availability. To request 2-PiB large volumes, contact your account team. 
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
        <th colspan="2">Linear performance scaling per TiB up to maximum allowed capacity tier throughput (large volume) </th>
      </tr></thead>
    <tbody>
      <tr>
        <td>Capacity tier</td>
        <td>Minimum volume size<br>(TiB)</td>
        <td>Maximum volume size (TiB)</td>
        <td>Minimum throughput for capacity tier (MiB/s)</td>
        <td>Maximum throughput for capacity tier (MiB/s)</td>
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

    For the latest performance benchmark numbers conducted on Azure NetApp Files Large volumes, see [Azure NetApp Files large volume performance benchmarks for Linux](performance-large-volumes-linux.md) and [Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)](solutions-benefits-azure-netapp-files-electronic-design-automation.md).


* Large volumes are supported with cool access. You must be [registered to use cool access](manage-cool-access.md#register-the-feature) before creating a cool access-enabled large volume. 

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

Check the status of the feature registration: 
    
  ```azurepowershell-interactive
  Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes 
  ```
    
You can also use [Azure CLI command](/cli/azure/feature) `az feature show` to register the feature and display the registration status. 

## Next steps

* [Understand large volumes](large-volumes.md)
* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
