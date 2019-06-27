---
title: Service layer alerts in Azure Security Center | Microsoft Docs
description: Azure policy definitions monitored in Azure Security Center.
services: security-center
documentationcenter: na
author: monhaber
manager: rkarlin
editor: ''

ms.assetid: 
ms.service: security-center
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 6/25/2019
ms.author: monhaber

---

# Azure service layer

This topic presents the Security Center alerts available when monitoring your Azure service layers.

* [Azure Network layer](#network-layer)
* [ Azure Management layer (Azure Resource Manager) (Preview)](#management-layer)

>[!NOTE]
>By the nature of the telemetry Security Center leverages from tapping into Azure internal feeds, the analytics provided below are applicable to all resource types.

## Azure Network layer<a name="network-layer"></a>

Security Center network-layer analytics are based on sample [IPFIX data](https://en.wikipedia.org/wiki/IP_Flow_Information_Export), which are packet headers collected by Azure core routers. Based on this data feed, Security Center machine learning models identify and flag malicious traffic activities. To enrich IP addresses, Security Center leverages Microsoft’s Threat Intelligence database.

Read the article [Heuristic DNS detections in Azure Security Center](https://azure.microsoft.com/en-us/blog/heuristic-dns-detections-in-azure-security-center/), to understand how Security Center can use network related signal to apply threat protection.

## Azure Management layer (Azure Resource Manager) (Preview)<a name ="management-layer"></a>

>[!NOTE]
>Security Center protection layer based on Azure Resource Manager (ARM) is currently in preview.

Security Center offers an additional layer of protection by leveraging Azure Resource Manager (ARM) events, which is consistent to be the control plane for Azure. By analyzing the ARM records, Security Center detects unusual or potentially harmful operations in the Azure subscription environment. 
Please find alert list below:


>[!NOTE]
>Several of the analytics above our powered by Microsoft Cloud App Security (MCAS). For more information, see [UEBA for Azure resources and users](https://docs.microsoft.com/en-us/azure/security-center/security-center-ueba-mcas).

