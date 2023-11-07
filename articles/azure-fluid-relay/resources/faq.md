---
title: Azure Fluid Relay FAQ
description: Frequently asked questions about Fluid Relay
ms.date: 6/1/2022
ms.service: azure-fluid
ms.topic: reference
---

# Azure Fluid Relay FAQ

The following are frequently asked questions about Azure Fluid Relay

## When will Azure Fluid Relay be Generally Available?

Azure Fluid Relay is Generally Available now. For a complete list of available regions, see [Azure Fluid Relay regions and availability](https://azure.microsoft.com/global-infrastructure/services/?products=fluid-relay). For our pricing list, see [Azure Fluid Relay pricing](https://azure.microsoft.com/pricing/details/fluid-relay).

## Which Azure regions currently provide Fluid Relay?

For a complete list of available regions, see [Azure Fluid Relay regions and availability](https://azure.microsoft.com/global-infrastructure/services/?products=fluid-relay).

## Can I move my Fluid Relay resource from one Azure resource group to another?

Yes. You can move the Fluid Relay resource from one resource group to another.

## Can I move my Fluid Relay resource from one Azure subscription to another?

Yes. You can move the Fluid Relay resource from one subscription to another.

## Can I move Fluid Relay resource between Azure regions?

No. Moving the Fluid Relay resource from one region to another isn’t supported.

## Is Azure Fluid Relay certified by industry certifications?

We adhere to the security and privacy policies and practices that other Azure services follow. In addition, we have achieved industry and regional certifications. You can see Azure Fluid Relay included in the Azure Service Organization Controls (SOC) reports in the Service Trust Portal [SOC page](https://servicetrust.microsoft.com/viewpage/SOC) and in the International Organization for Standardization (ISO) International Electrotechnical Commission (IEC) reports in the [ISOIEC page](https://servicetrust.microsoft.com/viewpage/ISOIEC). For the latest information about additional certifications we pursue, see the [Microsoft Trust Center](https://www.microsoft.com/trust-center). 

## What network protocols does Fluid Relay use?

Fluid Relay, like the Fluid Framework technology, uses both http and web sockets for communication between the clients and the service.

## Will Azure Fluid Relay work in environments where web sockets are blocked?

Yes. The Fluid Framework uses socket.io library for communication with the service. In environments where web sockets are blocked, the client will fall back to use long-polling with http.

## Where does Azure Fluid Relay store customer data?

Azure Fluid Relay stores customer data. By default, customer data is replicated to the paired region. However, the customer can choose to keep it within the same region by selecting the Basic SKU during provisioning. This option is available in select regions where the paired region is outside the boundary of the primary country/region data is stored. For more information, go to [Data storage in Azure Fluid Relay](../concepts/data-storage.md).

## Does Azure Fluid Relay support offline mode?

Offline mode is when end users of your application are disconnected from the network. The Fluid Framework client accumulates operations locally and sends them to the service when reconnected. Currently, Azure Fluid Relay doesn't support extended periods of offline mode beyond 1 minute. We highly recommend that you listen to Disconnect signals and update your user experience to avoid accumulation of many ops that can get lost.

