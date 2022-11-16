---
title: 'Injecting routes to Azure VMware Solution'
description: Learn about how to advertise routes to Azure VMware Solution with Azure Route Server.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 02/03/2022
ms.author: halkazwini
---

# Injecting routes to Azure VMware Solution with Azure Route Server
[Azure VMware Solution](../azure-vmware/introduction.md) is an Azure service where native VMware vSphere workloads run and communicate with other Azure services. This communication happens over ExpressRoute, and Azure Route Server can be used to modify the default behavior of Azure VMware Solution networking. The most frequent patterns for injecting routing information in Azure VMware Solution are either advertising a default route to attract Internet traffic to Azure, or advertising routes to achieve communications to on-premises networks when Global Reach is not available.

You can find more details in [Azure VMware Solution network design considerations](concepts-network-design-considerations.md).

## Next steps
* [Learn about Azure VMware Solution network design considerations](concepts-network-design-considerations.md)
* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)
