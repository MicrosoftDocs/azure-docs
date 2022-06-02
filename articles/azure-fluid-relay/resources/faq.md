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

### <a name="data"></a>Which Azure regions currently provide Fluid Relay?

For a complete list of available regions, see [Azure Fluid Relay regions and availability](https://azure.microsoft.com/en-us/global-infrastructure/services/?products=fluid-relay).

### <a name="data"></a>Can I move my Fluid Relay resource from one Azure resource group to another?

Yes. You can move the Fluid Relay resource from one resource group to another.

### <a name="data"></a>Can I move my Fluid Relay resource from one Azure subscription to another?

Yes. You can move the Fluid Relay resource from one subscription to another.

### <a name="data"></a>Can I move Fluid Relay resource between Azure regions?

No. Moving the Fluid Relay resource from one region to another isn’t supported.

### <a name="data"></a>Is Azure Fluid Relay certified by industry certifications?

We adhere to the security and privacy policies and practices that other Azure services follow to help achieve those industry and regional certifications. Once Azure Fluid Relay is in General Availability, we will be pursuing those certifications. We will be updating our certification posture as we achieve the different certifications. For more information, see the [Microsoft Trust Center](https://www.microsoft.com/en-us/trust-center).

### <a name="data"></a>What network protocols does Fluid Relay leverage?

Fluid Relay, like the Fluid Framework technology, leverages both http and websockets for communication between the clients and the service.

### <a name="data"></a>Will Azure Fluid Relay work in environments where websockets are blocked?

Yes. The Fluid Framework uses socket.io library for communication with the service. In environments where websockets are blocked, the client will fallback to long-polling with http.

### <a name="data"></a>Where does Azure Fluid Relay store customer data?

Azure Fluid Relay stores customer data. By default, customer data is replicated to the paired region. However, the customer can choose to keep it within the same region by selecting the Basic SKU during provisioning. This option is available in select regions where the paired region is outside the country boundary of the primary region data is stored. For more information, go to [Data storage in Azure Fluid Relay](../concepts/data-storage.md).

### <a name="data"></a>Does Azure Fluid Relay support offline mode?

Offline mode is when end users of your application are disconnected from the network. The Fluid Framework client accumulates operations locally and sends them to the service when reconnected. Currently, Azure Fluid Relay does not support extended periods of offline mode beyond 1 minute. We highly recommend that you listen to Disconnect signals and update your user experience to avoid accumulation of many ops that can get lost.

