---
title: Network Security Perimeter 
titleSuffix: Azure Event Hubs
description: Overview of Network Security Perimeter feature for Event Hubs
author: samurp
ms.author: samurp
ms.reviewer: spelluru
ms.date: 05/13/2024
ms.topic: conceptual
ms.custom:
---


# Network Security Perimeter for Azure Event Hubs

[Event Hubs](./event-hubs-about.md)

The Network Security Perimeter serves as a crucial safeguard for network traffic between Azure Event Hubs and other Platform as a Service (PaaS) offerings like Azure Storage and Azure Key Vault. By confining communication solely to Azure resources within its boundaries, it effectively blocks unauthorized attempts to access resources beyond its secure perimeter.

Integrating Event Hubs Kafka within this framework enhances data streaming capabilities while ensuring robust security measures. This integration not only provides a reliable and scalable platform but also strengthens data protection strategies, mitigating risks associated with unauthorized access or data breaches.

Operating as a service under Azure Private Link, the Network Security Perimeter facilitates secure communication for PaaS services deployed outside the virtual network. It enables seamless interaction among PaaS services within the perimeter and facilitates communication with external resources through carefully configured access rules. Additionally, it supports outbound resources such as Azure Key Vault for Bring Your Own Key (BYOK) and Azure Storage for data capture, further enhancing its versatility and utility in diverse cloud environments.

> [!NOTE]
> Network Security Perimeter does not support [Azure Event Hubs - Geo-disaster recovery](./event-hubs-geo-dr.md)

## Associate Event Hubs with a Network Security Perimeter in the Azure portal
1. Search for "Network Security Perimeter" in the Portal search bar and then click on **Create** button and create the resource.
1. In the first screen, provide a Name and Region and choose the subscription.
1. Under the **Resources** section, click on the **Associate** button and navigate to the Event Hubs namespace you want to add. 

## Related Content
- For an overview of [network service perimeter](https://aka.ms/networksecurityperimeter)
- For monitoring with [diagnostic logs in network security perimeter](https://aka.ms/networksecurityperimeter)
- For other Event Hubs security features, see [Network Security for Azure Event Hubs](./network-security.md)
- For additional information on using private endpoints, see [Use Private Endpoints](./private-link-service.md)
