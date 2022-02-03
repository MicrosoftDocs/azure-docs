---
title: 'Injecting default route to Azure VMware Solution'
description: Learn about how to advertise a default route to Azure VMware Solution with Azure Route Server.
services: route-server
author: jomore
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: jomore
---

# Default routing for Azure VMware Solution

Azure VMware Solution blah blah

## Topology

The following diagram shows a basic hub and spoke topology connected to an AVS cloud and to an on-premises network through ExpressRoute.

:::image type="content" source="./media/senarios/avs-default.png" alt-text="Diagram of AVS with Route Server.":::

> [!IMPORTANT]
> The default route advertised by the NVA will be propagated to the on-premises network as well, so it needs to be filtered out in the customer routing environment.


## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
