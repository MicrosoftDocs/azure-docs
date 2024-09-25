---
title: China content delivery with Azure Content Delivery Network
description: Learn about using Azure Content Delivery Network to deliver content to China users.
services: cdn
author: duongau
manager: kumudd
ms.service: azure-cdn
ms.topic: conceptual
ms.date: 03/20/2024
ms.author: duau
ms.custom: mvc
---

# China content delivery with Azure Content Delivery Network

Azure Content Delivery Network global can serve content to China users with point of presence (POP) locations near China or any POP that provides the best performance to requests originating from China. However, if China is a significant market for your customers and they need fast performance, consider using Azure Content Delivery Network China instead.

Azure Content Delivery Network China differs from Azure Content Delivery Network global in that it delivers content from POPs inside of China by partnering with many local providers. Due to Chinese compliance and regulation, you must register a separate subscription to use Azure Content Delivery Network China and your websites need to have an ICP license. The portal and API experience to enable and manage content delivery is identical between Azure Content Delivery Network global and Azure Content Delivery Network China.

<a name='comparison-of-azure-cdn-global-and-azure-cdn-china'></a>

## Comparison of Azure Content Delivery Network global and Azure Content Delivery Network China

Azure Content Delivery Network global and Azure Content Delivery Network China have the following features:

- Azure Content Delivery Network global:

     - Portal: https://portal.azure.com

     - Performs content delivery outside of China

     - Three pricing tiers: Microsoft standard, Edgio standard, and Edgio premium

     - [Documentation](./index.yml)

- Azure Content Delivery Network China:

     - Portal: https://portal.azure.cn

     - Performs content delivery inside of China

     - Two pricing tiers: Standard and premium

     - [Documentation](https://docs.azure.cn/en-us/cdn/)

## Next steps

To learn more about Azure Content Delivery Network China, see:

- [Content Delivery Network features](https://www.azure.cn/en-us/home/features/cdn/)

- [Overview of Azure Content Delivery Network](https://docs.azure.cn/en-us/cdn/cdn-overview)

- [Use the Azure content delivery network](https://docs.azure.cn/en-us/cdn/cdn-how-to-use)

- [Azure service availability in China](/azure/china/concepts-service-availability)
