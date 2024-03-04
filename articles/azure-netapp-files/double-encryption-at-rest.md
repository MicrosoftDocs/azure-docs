---
title: Azure NetApp Files double encryption at rest | Microsoft Docs
description: Explains Azure NetApp Files double encryption at rest to help you use this feature.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.topic: conceptual
ms.date: 07/26/2023
ms.author: anfdocs
ms.custom: references_regions
---
# Azure NetApp Files double encryption at rest

By default, Azure NetApp Files capacity pools use single encryption at rest. When you [create a capacity pool](azure-netapp-files-set-up-capacity-pool.md#encryption_type), you have the option to use double encryption at rest for the volumes in the capacity pool. You can do so by selecting `double` as the **encryption type** for the capacity pool that you are creating.  

Critical data is often found in places such as financial institutions, military users, business customer data, government records, health care medical records, and so on.  While single encryption at rest may be considered sufficient for some data, you should use double encryption at rest for data where a breach of confidentiality would be catastrophic. Leaks of information such as customer sensitive data, names, addresses, and government identification can result in extremely high liability, and it can be mitigated by having data confidentiality protected by double encryption at rest.

When data is transported over networks, additional encryption such as Transport Layer Security (TLS) can help to protect the transit of data. But once the data has arrived, protection of that data at rest helps to address the vulnerability. Using Azure NetApp Files double encryption at rest complements the security that’s inherent with the physically secure cloud storage in Azure data centers.

Azure NetApp Files double encryption at rest provides two levels of encryption protection: both a hardware-based encryption layer (encrypted SSD drives) and a software-encryption layer. The hardware-based encryption layer resides at the physical storage level, using FIPS 140-2 certified drives. The software-based encryption layer is at the volume level completing the second level of encryption protection.

If you are using this feature for the first time, you need to [register for the feature](azure-netapp-files-set-up-capacity-pool.md#encryption_type) and then create a double-encryption capacity pool. For details, see [Create a capacity pool for Azure NetApp Files](azure-netapp-files-set-up-capacity-pool.md).

When you create a volume in a double-encryption capacity pool, the default key management (the **Encryption key source** field) is `Microsoft Managed Key`, and the other choice is `Customer Managed Key`. Using customer-managed keys requires additional preparation of an Azure Key Vault and other details.  For more information about using volume encryption with customer managed keys, see [Configure customer-managed keys for Azure NetApp Files volume encryption](configure-customer-managed-keys.md).

:::image type="content" source="../media/azure-netapp-files/double-encryption-create-volume.png" alt-text="Screenshot of the Create Volume page in a double-encryption capacity pool." lightbox="../media/azure-netapp-files/double-encryption-create-volume.png":::

## Supported regions

Azure NetApp Files double encryption at rest is supported for the following regions:  

* Australia Central 
* Australia Central 2 
* Australia East  
* Australia Southeast 
* Brazil South  
* Canada Central  
* Central US  
* East Asia
* East US
* East US 2
* France Central  
* Germany West Central 
* Japan East  
* Korea Central 
* North Central US
* North Europe 
* Norway East 
* Qatar Central
* South Africa North 
* South Central US  
* Sweden Central  
* Switzerland North 
* UAE North
* UK South 
* West Europe
* West US
* West US 2
* West US 3
 
## Considerations

* Azure NetApp Files double encryption at rest supports [Standard network features](azure-netapp-files-network-topologies.md#configurable-network-features), but not Basic network features. 
* For the cost of using Azure NetApp Files double encryption at rest, see the [Azure NetApp Files pricing](https://azure.microsoft.com/pricing/details/netapp/) page.
* You can't convert volumes in a single-encryption capacity pool to use double encryption at rest. However, you can copy data in a single-encryption volume to a volume created in a capacity pool that is configured with double encryption.  
* For capacity pools created with double encryption at rest, volume names in the capacity pool are visible only to volume owners for maximum security.
* Using double encryption at rest might have performance impacts based on the workload type and frequency. The performance impact can be a minimal 1-2%, depending on the workload profile. 

## Next steps

* [Create a capacity pool for Azure NetApp Files](azure-netapp-files-set-up-capacity-pool.md)
