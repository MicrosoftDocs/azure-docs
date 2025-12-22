---
title: Requirements and considerations for Azure NetApp Files large volumes
description: Describes the requirements and considerations you need to be aware of before using large volumes.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: concept-article
ms.date: 11/11/2025
ms.author: anfdocs
# Customer intent: As a storage administrator, I want to review the requirements and limitations of large volumes in Azure NetApp Files, so that I can effectively plan the deployment and management of storage solutions to meet my organization's data capacity and performance needs.
---
# Requirements and considerations for Azure NetApp Files large volumes

Large volumes are Azure NetApp Files volumes with a size of 50 TiB to 1,024 TiB.

With breakthrough mode, you can create large volumes at sizes between 2,400 GiB and 2,400 TiB. You must [request the feature](#register-for-breakthrough-mode) before using it for the first time. With cool access enabled, large volumes can scale to 7.2 PiB in certain situations; for more information, see [large volumes up to 7.2 PiB](#requirements-and-considerations-for-large-volumes-up-to-72-pib-preview).

There are requirements and considerations you need to be aware of before using [large volumes](large-volumes.md).

## Requirements and considerations

The following requirements and considerations apply to large volumes. For performance considerations of *regular volumes*, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

* A regular volume can’t be converted to a large volume.
* You must create a large volume at a size of 50 TiB or larger. The maximum size of a large volume is 1,024 TiB.
* You can't resize a large volume to less than 50 TiB.
    * A large volume can't be resized to more than 30% of its lowest provisioned size. This limit is adjustable via [a support request](azure-netapp-files-resource-limits.md#resource-limits). When requesting the resize, specify the desired size in TiB. 
    * When reducing the size of a large volume, the size depends on the size of files written to the volume and the snapshots currently active on the volumes. 
* You can't create a large volume with application volume groups.
* Currently, large volumes aren't suited for database (HANA, Oracle, SQL Server, etc.) data and log volumes. For database workloads requiring more than a single volume’s throughput limit, consider deploying multiple regular volumes. To optimize multiple volume deployments for databases, use [application volume groups](application-volume-group-concept.md).
*	The throughput ceiling for the Standard, Premium, and Ultra service levels with large volumes is 12,800 MiB/s. You can grow a large volume to 1 PiB with the throughput ceiling per the following table:  
    
    <table><thead>
      <tr>
        <th></th>
        <th colspan="2">Capacity</th>
        <th colspan="2">Linear performance scaling per TiB up to maximum 12,800 MiB/s </th>
      </tr></thead>
    <tbody>
      <tr>
        <td>Capacity tier</td>
        <td>Minimum volume size<br>(TiB)</td>
        <td>Maximum volume size (TiB)*</td>
        <td>Minimum throughput for capacity tier (MiB/s)</td>
        <td>Maximum throughput for capacity tier (MiB/s)</td>
      </tr>
      <tr>
        <td>Standard (16 MiB/s per TiB)</td>
        <td>50</td>
        <td>1,024*</td>
        <td>800</td>
        <td>12,800</td>
      </tr>
      <tr>
        <td>Premium (64 MiB/s per TiB)</td>
        <td>50</td>
        <td>1,024*</td>
        <td>3,200</td>
        <td>12,800</td>
      </tr>
      <tr>
        <td>Ultra (128 MiB/s per TiB)</td>
        <td>50</td>
        <td>1,024*</td>
        <td>6,400</td>
        <td>12,800</td>
      </tr>
    </tbody>
    </table>

    For the latest performance benchmark numbers conducted on Azure NetApp Files Large volumes, see [Azure NetApp Files large volume performance benchmarks for Linux](performance-large-volumes-linux.md) and [Benefits of using Azure NetApp Files for Electronic Design Automation (EDA)](solutions-benefits-azure-netapp-files-electronic-design-automation.md).

* Cool access is supported with large volumes. You must be [registered to use cool access](manage-cool-access.md#register-the-feature) before creating a cool access-enabled large volume. 

### Requirements and considerations for breakthrough mode (preview)

Large volumes breakthrough mode is currently in preview. You must [request the feature](#register-for-breakthrough-mode) before using it for the first time. 

* Breakthrough mode large volumes are supported at sizes between 2,400 GiB up to 2,400 TiB (2 PiB). 
* With breakthrough mode, you can achieve up 50 GiB/s throughput depending on your workload's characteristics and system placement.
* The [migration assistant](migrate-volumes.md) isn't supported for large volumes with breakthrough mode. 
* Breakthrough mode is supported on the Flexible, Standard, Premium, and Ultra service levels. 
* Cool access can only be enabled on large volumes in breakthrough mode _after_ the volume has been created.

#### Requirements and considerations for large volumes up to 7.2 PiB (preview)

* In some cases, you can create large volume with cool access enabled at sizes between 2,400 GiB and 7.2 PiB.
  * If you're using the Flexible, Premium, or Ultra service levels, you must also [register to use those service levels with cool access](manage-cool-access.md#register-the-feature).
* With these large volumes, more than 80% of the data should reside in the cool tier.  
* If you plan to use cross-region replication for a large volume up to 7.2 PiB, you need to ensure there is sufficient capacity in both regions and that the stamp for large volumes up to 7.2 PiB is on volumes in _both_ the source and destination regions. 

## About 64-bit file IDs

Whereas regular volumes use 32-bit file IDs, large volumes employ 64-bit file IDs. File IDs are unique identifiers that allow Azure NetApp Files to keep track of files in the file system. 64-bit IDs are utilized to increase the number of files allowed in a single volume, enabling a large volume able to hold more files than a regular volume. 

## Supported regions

Support for Azure NetApp Files large volumes is available in the following regions:

* Australia Central
* Australia Central 2
* Australia East
* Australia Southeast
* Brazil South
* Brazil Southeast
* Canada Central
* Canada East
* Central India
* Central US
* East Asia
* East US
* East US 2
* France Central
* Germany North 
* Germany West Central
* Italy North
* Japan East
* Japan West
* Korea Central
* Korea South
* North Central US
* North Europe
* Norway East
* Norway West
* Qatar Central
* South Africa North 
* South Central US
* Southeast Asia
* Sweden Central
* Switzerland North
* Switzerland West
* UAE North
* UK West
* UK South
* US Gov Arizona
* US Gov Texas
* US Gov Virginia 
* West Europe
* West US
* West US 2
* West US 3

## Configure large volumes 

>[!IMPORTANT]
>Before you can use large volumes, you must first request [an increase in regional capacity quota](azure-netapp-files-resource-limits.md#request-limit-increase).

Once your [regional capacity quota](regional-capacity-quota.md) has increased, you can create volumes up to 1 PiB. When creating a volume, after you designate the volume quota, you must select **Yes** for the **Large volume** field. In the **Large volume type** field, select **Large volume**.  Once created, you can manage your large volumes in the same manner as regular volumes. 

To create volumes up to 7.2 PiB, you must select **Extra-large volume 7.2 PiB** as the volume type when you create the volume. Cool access must be enabled on the volume. 

### Register the feature 

If this is your first time using large volumes, register the feature with the [large volumes sign-up form](https://aka.ms/anflargevolumessignup).

Check the status of the feature registration: 
    
  ```azurepowershell-interactive
  Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes 
  ```
    
You can also use [Azure CLI command](/cli/azure/feature) `az feature show` to register the feature and display the registration status. 

### Register for breakthrough mode

Large volumes breakthrough mode is currently in preview. You must submit a [waitlist request](https://forms.cloud.microsoft/r/P11Zn9zHMY) to access the feature. 

After submitting the request, check the status of feature registration with the command: 

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBreakthroughMode 
```

You can also use [Azure CLI command](/cli/azure/feature) `az feature show` to register the feature and display the registration status. 

### Register for large volumes up to 7.2 PiB

>[!NOTE]
>You must be registered to use [large volumes](#register-the-feature) and, if you're using the Flexible, Premium, or Ultra service level, [cool access](manage-cool-access.md#register-the-feature) before registering for the large volumes up to 7.2 PiB. 

Large volumes up to 7.2 PiB are currently in preview. [Submit a waitlist request](https://forms.office.com/r/WfBqxqayzM) for access to the feature. 

After submitting the waitlist request, you can check the status of your feature registration with the command:

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFExtraLargeVolumes
```

## Next steps

* [Understand large volumes](large-volumes.md)
* [Storage hierarchy of Azure NetApp Files](azure-netapp-files-understand-storage-hierarchy.md)
* [Resource limits for Azure NetApp Files](azure-netapp-files-resource-limits.md)
* [Create an NFS volume](azure-netapp-files-create-volumes.md)
* [Create an SMB volume](azure-netapp-files-create-volumes-smb.md)
* [Create a dual-protocol volume](create-volumes-dual-protocol.md)
