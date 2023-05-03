---
title: Scaling with Azure Event Grid
description: This article describes how Azure Event Grid scales
author: robece
ms.topic: conceptual
ms.author: robece
ms.date: 05/23/2023
---

# Scaling with Azure Event Grid

With the release of the Azure Event Grid namespaces there's a new Standard tier that influences scaling on Azure Event Grid.

## Throughput units
The throughput capacity of Azure Event Grid is controlled by throughput units (TUs). Throughput units are pre-purchased units of capacity. 

A single throughput unit lets you:

For MQTT Messages:

- 10,000 MQTT clients per throughput unit.
- Receive: Up to 1000 messages per second or 1 MB per second (whichever comes first).
- Deliver/Consume: Up to 1000 events per second or 1 MB per second.

For Events:

- 100 topics per throughput unit.
- Receive: Up to 1000 events per second or 1 MB per second (whichever comes first).
- Deliver/Consume: Up to 2000 events per second or 2 MB per second.

Throughput units are pre-purchased and are billed per hour. Once purchased, throughput units are billed for a minimum of one hour. Up to 100 throughput units can be purchased per Azure Event Grid namespace and shared across all the resources in that namespace.

> [!NOTE]
> If you are seeing publishing rate exceptions or expecting higher egress than what is being received, check how many throughput units you have purchased for the namespace. You can manage the throughput units in the Azure portal on the Scale blade for the Event Grid namespaces or use the Event Grid APIs to manage them programmatically. Ingress will be throttled if it exceeds the purchased throughput units and a ServerBusyException will be returned. Egress is also limited to the capacity of the purchased throughput units but will not produce throttling exceptions.
For more information about the auto-inflate feature, see Configure throughput units in Azure Event Grid namespaces.
