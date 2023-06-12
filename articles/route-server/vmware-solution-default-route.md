---
title: Injecting routes to Azure VMware Solution
description: Learn about how to advertise routes to Azure VMware Solution with Azure Route Server.
services: route-server
author: halkazwini
ms.service: route-server
ms.topic: conceptual
ms.date: 12/22/2022
ms.author: halkazwini
ms.custom: template-concept
---

# Injecting routes to Azure VMware Solution with Azure Route Server

[Azure VMware Solution](../azure-vmware/introduction.md) is an Azure service where native VMware vSphere workloads run and communicate with other Azure services. This communication happens over ExpressRoute, and Azure Route Server can be used to modify the default behavior of Azure VMware Solution networking. The most frequent patterns for injecting routing information in Azure VMware Solution are either advertising a default route to attract Internet traffic to Azure, or advertising routes to achieve communications to on-premises networks when Global Reach is not available.

Please refer to [Azure VMware Solution network design considerations](../azure-vmware/concepts-network-design-considerations.md) for additional information.

## Next steps

* [Learn how Azure Route Server works with ExpressRoute](expressroute-vpn-support.md)
* [Learn how Azure Route Server works with a network virtual appliance](resource-manager-template-samples.md)

[caf_avs_nw]: /azure/cloud-adoption-framework/scenarios/azure-vmware/eslz-network-topology-connectivity
