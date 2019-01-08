---
author: rothja
ms.service: billing
ms.topic: include
ms.date: 11/09/2018	
ms.author: jroth
---
| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| [Web/worker roles per deployment](../articles/cloud-services/cloud-services-choose-me.md)<sup>1</sup> |25 |25 |
| [Instance Input Endpoints](https://msdn.microsoft.com/library/gg557552.aspx#InstanceInputEndpoint) per deployment |25 |25 |
| [Input Endpoints](https://msdn.microsoft.com/library/gg557552.aspx#InputEndpoint) per deployment |25 |25 |
| [Internal Endpoints](https://msdn.microsoft.com/library/gg557552.aspx#InternalEndpoint) per deployment |25 |25 |
| [Hosted service certificates](../articles/cloud-services/cloud-services-certs-create.md#what-are-service-certificates) per deployment |199 |199 |

<sup>1</sup>Each Cloud Service with Web/Worker roles can have two deployments, one for production and one for staging. Also note that this limit refers to the number of distinct roles (configuration) and not the number of instances per role (scaling).

