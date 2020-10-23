---
title: Azure DDoS Protection Basic vs Standard
description: Learn Azure DDoS Protection Basic vs Standard
services: ddos-protection
documentationcenter: na
author: yitoh
ms.service: ddos-protection
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/08/2020
ms.author: yitoh

---
# Azure DDoS Protection Basic vs Standard

Azure has two DDoS service offerings that provide protection from network attacks (Layer 3 and 4): DDoS Protection Basic and DDoS Protection Standard. 

![DDoS Protection Basic vs Standard](./media/ddos-protection-overview/ddos-comparison.png)

## DDoS Protection Basic

Every property in Azure is protected by Azure's infrastructure DDoS (Basic) Protection at no additional cost. The scale and capacity of the globally deployed Azure network provides defense against common network-layer attacks through always-on traffic monitoring and real-time mitigation. DDoS Protection Basic requires no user configuration or application changes. DDoS Protection Basic helps protect all Azure services, including PaaS services like Azure DNS.

## DDoS Protection Standard

Azure DDoS Protection Standard provides enhanced DDoS mitigation features. It is automatically tuned to help protect your specific Azure resources in a virtual network. Protection is simple to enable on any new or existing virtual network, and it requires no application or resource changes. It has several advantages over the basic service, including logging, alerting, and telemetry. 

To learn about Azure DDoS Protection Standard features, see [Azure DDoS Protection Standard features](ddos-protection-standard-features.md).

## Next steps

- Learn how to [create a DDoS protection plan](manage-ddos-protection-2.md).

