---
title: Azure Fluid Relay FAQ
description: Frequently asked questions about Fluid Relay
author: hickeys
ms.author: hickeys
ms.date: 6/1/2022
ms.service: azure-fluid
ms.topic: reference
---

# Azure Fluid Relay FAQ

The following are frequently asked questions about Azure Fluid Relay

## When will Azure Fluid Relay be Generally Available?

Azure Fluid Relay will be Generally Available on 8/1/2022. At that point, the service will no longer be free. Charges will apply based on your usage of Azure Fluid Relay. The service will be metering 4 activities:

- Operations in: As end users join, leave, and contribute to a collaborative session, the Fluid Framework client libraries send messages (also referred to as operations or ops) to the service. Each message incoming from one client is counted as one message. Heartbeat messages and other session messages are also counted. Messages larger than 2KB are counted as multiple messages of 2KB each (for example, 11KB message is counted as 6 messages).
- Operations out: Once the service processes incoming messages, it broadcasts them to all participants in the collaborative session. Each message sent to each client is counted as one message (for example, in a 3-user session, one of the users sends an op, that will generate 3 ops out).
- Client connectivity minutes: The duration of each user being connected to the session will be charged on a per user basis (for example, 3 users collaborate on a session for an hour, this is charged as 180 connectivity minutes).
- Storage: Each collaborative Fluid session stores session artifacts in the service. Storage of this data will be charged on a per GB per month basis (prorated as appropriate).

Reference the table below for the prices (in USD) we will start to charge at General Availability for each of these meters in the regions Azure Fluid Relay is currently offered. Additional regions and additional information about other currencies will be available on our pricing page soon.

| Meter | Unit | West US 2 | West Europe | Southeast Asia
|--|--|--|--|--|
| Operations In | 1 million ops | 1.50 | 1.95 | 1.95 |
| Operations Out | 1 million ops | 0.50 | 0.65 | 0.65 |
| Client Connectivity Minutes | 1 million minutes | 1.50 | 1.95 | 1.95 |
| Storage | 1 GB/month | 0.20 | 0.26 | 0.26 |



## Which Azure regions currently provide Fluid Relay?

For a complete list of available regions, see [Azure Fluid Relay regions and availability](https://azure.microsoft.com/global-infrastructure/services/?products=fluid-relay).

## Can I move my Fluid Relay resource from one Azure resource group to another?

Yes. You can move the Fluid Relay resource from one resource group to another.

## Can I move my Fluid Relay resource from one Azure subscription to another?

Yes. You can move the Fluid Relay resource from one subscription to another.

## Can I move Fluid Relay resource between Azure regions?

No. Moving the Fluid Relay resource from one region to another isn’t supported.

## Is Azure Fluid Relay certified by industry certifications?

We adhere to the security and privacy policies and practices that other Azure services follow to help achieve those industry and regional certifications. Once Azure Fluid Relay is in General Availability, we'll be pursuing those certifications. We'll be updating our certification posture as we achieve the different certifications. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/trust-center).

## What network protocols does Fluid Relay use?

Fluid Relay, like the Fluid Framework technology, uses both http and web sockets for communication between the clients and the service.

## Will Azure Fluid Relay work in environments where web sockets are blocked?

Yes. The Fluid Framework uses socket.io library for communication with the service. In environments where web sockets are blocked, the client will fall back to use long-polling with http.

## Where does Azure Fluid Relay store customer data?

Azure Fluid Relay stores customer data. By default, customer data is replicated to the paired region. However, the customer can choose to keep it within the same region by selecting the Basic SKU during provisioning. This option is available in select regions where the paired region is outside the country boundary of the primary region data is stored. For more information, go to [Data storage in Azure Fluid Relay](../concepts/data-storage.md).

## Does Azure Fluid Relay support offline mode?

Offline mode is when end users of your application are disconnected from the network. The Fluid Framework client accumulates operations locally and sends them to the service when reconnected. Currently, Azure Fluid Relay doesn't support extended periods of offline mode beyond 1 minute. We highly recommend that you listen to Disconnect signals and update your user experience to avoid accumulation of many ops that can get lost.

