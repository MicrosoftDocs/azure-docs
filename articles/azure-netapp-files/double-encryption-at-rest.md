---
title: Azure NetApp Files double encryption at rest | Microsoft Docs
description: Explains what double encryption at rest does to help you determine whether to use this feature.  
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
ms.date: 02/13/2023
ms.author: anfdocs
ms.custom: 
---
# Azure NetApp Files double encryption at rest

By default, an Azure NetApp Files capacity pool uses single encryption at rest. When you create a capacity pool, you can configure double encryption at rest for the volumes in the capacity pool. You do so by selecting **double** as the **encryption type** for the pool that you're creating. 

This article explains what double encryption at rest does to help you determine whether to use this feature.  

## Uses of double encryption at rest

Critical data is often found in places such as financial institutions, military users, customer data, government records, and health care medical records.  While single encryption at rest may be sufficient for most data, consider using double encryption at rest for data where a breach of confidentiality would be catastrophic. Leaks of information such as customer sensitive data, names, addresses, and government identification can result in extremely high liability, and it can be mitigated by having data confidentiality protected by double encryption at rest.

When data is transported over networks, extra encryption such as TLS Transport Layer Security can help to protect the transit of data. But once the data has arrived, protection of that data at rest helps to address the vulnerability. For Azure NetApp Files, using double encryption at rest complements the security that’s inherent with the physically secure cloud storage in Azure data centers.

## Considerations

Double encryption at rest is supported only on volumes using [Standard network features](azure-netapp-files-network-topologies.md#configurable-network-features). Volumes created with Basic network features need to first be migrated to new volumes that use Standard network features before you can enable them for double encryption at rest.

The feature of double encryption at rest is currently in preview. If you're using this feature for the first time, you need to register the feature first. See [Create a capacity pool for Azure NetApp Files](azure-netapp-files-set-up-capacity-pool.md) for details. 

## Next steps

* [Create a capacity pool for Azure NetApp Files](azure-netapp-files-set-up-capacity-pool.md)