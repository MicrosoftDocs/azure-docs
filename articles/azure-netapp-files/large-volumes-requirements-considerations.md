---
title: Requirements and considerations for Azure NetApp Files large volumes
description: Describes the requirements and considerations you need to be aware of before using large volumes.
services: azure-netapp-files
author: b-ahibbard
ms.service: azure-netapp-files
ms.custom: references_regions
ms.topic: concept-article
ms.date: 02/10/2026
ms.author: anfdocs
# Customer intent: As a storage administrator, I want to review the requirements and limitations of large volumes in Azure NetApp Files, so that I can effectively plan the deployment and management of storage solutions to meet my organization's data capacity and performance needs.
---
# Requirements and considerations for Azure NetApp Files large volumes

Azure NetApp Files large volumes support sizes between 50 TiB  and 1,024 TiB.

With breakthrough mode, you can create large volumes at sizes between 2,400 GiB and 2,400 TiB. You must [request the feature](#register-for-breakthrough-mode) before using it for the first time. With cool access enabled, large volumes can scale to 7.2 PiB in certain situations; for more information, see [large volumes up to 7.2 PiB](#requirements-and-considerations-for-large-volumes-up-to-72-pib-preview).

There are requirements and considerations you need to be aware of before using [large volumes](large-volumes.md).

## Requirements and considerations

The following requirements and considerations apply to large volumes. For performance considerations of *regular volumes*, see [Performance considerations for Azure NetApp Files](azure-netapp-files-performance-considerations.md).

* A regular volume can’t be converted to a large volume.
* You must create a large volume with a minimum size of 50 TiB. Large volumes support sizes up to 1,024 TiB by default. Larger volume sizes are available by request, subject to regional capacity availability. When cool access is enabled, large volumes can be created at a minimum size of 2,400 GiB and can support significantly larger capacities.
* You can't resize a large volume to less than 50 TiB.
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
        <td>Service level</td>
        <td>Minimum volume size<br>(TiB)</td>
        <td>Maximum volume size (TiB)</td>
        <td>Base throughput (MiB/s) at 50TiB</td>
        <td>Maximum throughput for service level (MiB/s)</td>
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

* Cool access is supported with large volumes. 

### Requirements and considerations for breakthrough mode (preview)

Large volumes breakthrough mode is currently in preview. You must [request the feature](#register-for-breakthrough-mode) before using it for the first time. 

* Breakthrough mode large volumes are supported at sizes between 2,400 GiB up to 2,400 TiB (2 PiB). 
* With breakthrough mode, you can achieve up 50 GiB/s throughput depending on your workload's characteristics and system placement.
* The [migration assistant](migrate-volumes.md) isn't supported for large volumes with breakthrough mode. 
* Breakthrough mode is supported on the Flexible, Standard, Premium, and Ultra service levels. 
* Cool access can only be enabled on large volumes in breakthrough mode _after_ the volume has been created.

### Requirements and considerations for large volumes up to 7.2 PiB (preview)

Azure NetApp Files supports very large volumes of up to 7.2 PiB on dedicated capacity for workloads where most data are infrequently accessed. This capability extends cool access support beyond the previous 2 PiB limit and is intended for customers who need to manage multi petabyte datasets while optimizing storage costs.

By combining petabyte scale capacity with transparent tiering, large volumes with cool access enable cost efficient storage for cold data while continuing to deliver predictable performance for active data stored in the hot tier. This model is especially well suited for environments that require enterprise grade reliability and performance at massive scale.

#### Key characteristics

Large volumes with cool access up to 7.2 PiB have the following characteristics:

* Dedicated capacity  
  Volumes up to 7.2 PiB are supported only on Azure NetApp Files dedicated capacity and only in regions that support large volumes.

* Cool data workload profile  
  These volumes are intended for workloads where at least 80% of the data resides in the cool tier.3

* Supported volume size range  
  Cool access is supported on large volumes sized between 2,400 GiB and 7.2 PiB, extending cool access beyond the previous 2 PiB limit.

#### Cross region replication considerations

If cross region replication is planned for a large volume up to 7.2 PiB, the following conditions must be met:

* Sufficient Azure NetApp Files dedicated capacity must be available in both the source and destination regions.
* Large volume support up to 7.2 PiB must be available in both regions to ensure compatibility for replication.

#### Common use cases

Large volumes with cool access up to 7.2 PiB are intended for workloads that store large amounts of infrequently accessed data, including:

* Archive and long term backup data
* Media repositories and content libraries
* Healthcare imaging and life sciences datasets
* Compliance and regulatory datasets
* AI/ML and EDA datasets
* Large enterprise file shares and data consolidation scenarios

This feature is currently in preview and is supported in all regions that support Azure NetApp Files large volumes. You must [request for the feature](large-volumes-requirements-considerations.md#register-for-large-volumes-up-to-72-pib) before using it for the first time.

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
* Malaysia West 
* North Central US
* North Europe
* Norway East
* Norway West
* Qatar Central
* South Africa North 
* South Central US
* Southeast Asia
* Spain Central
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

# [Azure CLI](#tab/azurecli)

1.  Register the feature by running the following commands:

    ```azurecli
    az account set --subscription <subscriptionId>
    az feature register --namespace Microsoft.NetApp --name ANFLargeVolumes
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurecli
    az feature show --namespace Microsoft.NetApp --name ANFLargeVolumes
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

# [Azure PowerShell](#tab/azurepowershell)

1.  Register the feature by running the following commands:

    ```azurepowershell
    Set-AzContext -SubscriptionId <subscriptionId>
    Register-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes
    ```

2. Check the status of the feature registration: 

    > [!NOTE]
    > The **RegistrationState** may be in the `Registering` state for up to 60 minutes before changing to `Registered`. Wait until the status is `Registered` before continuing.

    ```azurepowershell
    Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFLargeVolumes
    ```
You can also use [Azure CLI commands](/cli/azure/feature) `az feature register` and `az feature show` to register the feature and display the registration status. 

---
  
    
### Register for breakthrough mode

Large volumes breakthrough mode is currently in preview. You must submit a [waitlist request](https://forms.cloud.microsoft/r/P11Zn9zHMY) to access the feature. 

After submitting the request, check the status of feature registration with the command: 

```azurepowershell-interactive
Get-AzProviderFeature -ProviderNamespace Microsoft.NetApp -FeatureName ANFBreakthroughMode 
```

You can also use [Azure CLI command](/cli/azure/feature) `az feature show` to register the feature and display the registration status. 

### Register for large volumes up to 7.2 PiB

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
