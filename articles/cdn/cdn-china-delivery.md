---
title: China content delivery with Azure CDN | Microsoft Docs
description: Learn about using Azure Content Delivery Network (CDN) to deliver content to China users.
services: cdn
documentationcenter: ''
author: mdgattuso
manager: danielgi
editor: ''

ms.assetid: 
ms.service: azure-cdn
ms.workload: tbd
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: magattus
ms.custom: mvc

---

# China content delivery with Azure CDN

Azure Content Delivery Network (CDN) global can serve content to China users with point-of-presence (POP) locations near China or any POP that provides the best performance to requests originating from China. However, if China is a significant market for your customers and they need fast performance, consider using Azure CDN China instead.

Azure CDN China differs from Azure CDN global in that it delivers content from POPs inside of China by partnering with a number of local providers. Due to Chinese compliance and regulation, you must register a separate subscription to use Azure CDN China and your websites need to have an ICP license. The portal and API experience to enable and manage content delivery is identical between Azure CDN global and Azure CDN China.

## Comparison of Azure CDN global and Azure CDN China

Azure CDN global and Azure CDN China have the following features:

- Azure CDN global:

     - Portal: https://portal.azure.com  

     - Performs content delivery outside of China

     - Four pricing tiers: Microsoft standard, Verizon standard, Verizon premium, and Akamai standard

     - [Documentation](https://docs.microsoft.com/azure/cdn/)

- Azure CDN China:

     - Portal: https://portal.azure.cn

     - Performs content delivery inside of China

     - Two pricing tiers: Standard and premium

     - [Documentation](https://docs.azure.cn/en-us/cdn/)
 

## Next steps

To learn more about Azure CDN China, see:

- [Content Delivery Network features](https://www.azure.cn/en-us/home/features/cdn/)

- [Overview of Azure Content Delivery Network](https://docs.azure.cn/en-us/cdn/cdn-overview)

- [Use the Azure Content Delivery Network](https://docs.azure.cn/en-us/cdn/cdn-how-to-use)

- [Azure service availability in China](https://docs.microsoft.com/azure/china/concepts-service-availability)



