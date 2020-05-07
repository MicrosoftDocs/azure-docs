---
author: rothja
ms.service: cost-management-billing
ms.topic: include
ms.date: 11/09/2018    
ms.author: jroth
---
| Resource | Limit |
| --- | --- |
| [Web or worker roles per deployment](../articles/cloud-services/cloud-services-choose-me.md)<sup>1</sup> |25 |
| [Instance input endpoints](/previous-versions/azure/reference/gg557552(v=azure.100)#instanceinputendpoint) per deployment |25 |
| [Input endpoints](/previous-versions/azure/reference/gg557552(v=azure.100)#inputendpoint) per deployment |25 |
| [Internal endpoints](/previous-versions/azure/reference/gg557552(v=azure.100)#internalendpoint) per deployment |25 |
| [Hosted service certificates](../articles/cloud-services/cloud-services-certs-create.md#what-are-service-certificates) per deployment |199 |

<sup>1</sup>Each Azure Cloud Service with web or worker roles can have two deployments, one for production and one for staging. This limit refers to the number of distinct roles, that is, configuration. This limit doesn't refer to the number of instances per role, that is, scaling.

