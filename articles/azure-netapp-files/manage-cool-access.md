---
title: Manage Azure NetApp Files Standard service level with cool access | Microsoft Docs
description: Learn how to free up storage by by configuring inactive data to move from Azure NetApp Files Standard service-level storage to an Azure storage account (the cool tier).
services: azure-netapp-files
documentationcenter: ''
author: b-ahibbard
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: how-to
ms.date: 06/17/2022
ms.author: anfdocs
---

# Manage Azure NetApp Files Standard service level with cool access

Using Azure NetApp Files Standard service level with cool access, you can configure inactive data to move from Azure NetApp Files Standard service-level storage to an Azure storage account (the **cool tier**). In doing so, you free up storage that resides within Azure NetApp Files, resulting in cost saving. 
 
You can configure Standard service level with cool access on a volume by specifying the number of days (the **coolness period**, ranging from 7 to 63 days) for inactive data to be considered “cool”.  

When the data has remained inactive for the specified coolness period, the tiering process begins, and the data is moved to the cool tier (the Azure storage account). This tiering process might take a few days.   

For example, if you specify 31 days as the coolness period, then 31 days after a data block is last accessed (read or written), it is qualified for movement to the cool tier.   

After inactive data is moved to the cool tier and if it is read randomly again, it becomes “warm” and is moved back to the standard tier.  

Sequential reads (such as index and antivirus scans) on inactive data in the cool tier do not warm the data and will not trigger inactive data to be moved back to the standard tier.  

Metadata is never cooled and will always remain in the standard tier. As such, the activities of metadata-intensive workloads (for example, high file-count environments like chip design, VCS, and home directories) are not impacted by tiering. 

## Considerations

* No guarantee is provided for any maximum latency for client workload for any of the service tiers. 
* This feature is available only at the **Standard** service level. It is not supported for the Ultra or Premium service level.  
* Although cool access is available for the Standard service level, how you are billed for using the feature will differ from the Standard service level charges. See the Billing section for details and examples.  <!-- link >
* You can convert an existing Standard service-level capacity pool into a cool-access capacity pool to create cool access volumes. However, once the capacity pool is enabled for the cool access feature, you cannot convert it back to a non-cool-access capacity pool.  
* A cool-access capacity pool can contain both volumes with cool access enabled and volumes with cool access disabled. 
* After the capacity pool is configured with the option to support cool access volumes, the setting cannot be disabled at the _capacity pool_ level. However, you can turn on or turn off the cool access setting at the volume level anytime. Turning off the cool access setting at the _volume_ level will stop further tiering of data.  
* Cool access is supported only on capacity pools of the **auto** QoS type.   

## Enable cool access 

To use the cool access feature, you need to configure the feature at the capacity pool level and the volume level.  

### Configure the capacity pool for cool access

Before creating or enable a cool-access volume, you need to configure a Stand service-level capacity pool with cool access. The capacity pool must use the auto [QoS type](azure-netapp-files-understand-storage-hierarchy.md#qos_types). You can do so in one of the following ways: 

* Create a new Standard service-level capacity pool with cool access. 
* Modify an existing Standard service-level capacity pool to support cool-access volumes. 

#### Enable cool access on a new volume  
1. [Set up a capacity pool](azure-netapp-files-set-up-capacity-pool.md) with the **Standard** service level and the **auto** QoS type.  
1. Check the **Enable Cool Access** checkbox, then select **Create**. 
    When you select Enable Cool Access, the UI automatically selects the auto QoS type. The manual QoS type is not supported for cool access. 

<!-- image -->

#### Enable cool access on an existing capacity pool  

You can enable cool access support on an existing Standard service-level capacity pool that uses the auto QoS type. This action allows you to add or modify volumes in the pool to use cool access.  

1. Right-click a **Stand** service-level capacity pool for which you want to enable cool access.   

2. Select **Enable Cool Access**: 

 <!-- image -->

### Configure a volume for cool access 