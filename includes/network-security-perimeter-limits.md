---
 title: include file
 description: include file
 services: private-link
 author: mbender
 ms.service: azure-private-link
 ms.topic: include
 ms.date: 10/28/2024
 ms.author: mbender-ms
 ms.custom: include file
---

### Scale limitations

Network security perimeter functionality can be used to support deployments of PaaS resources with common public network controls with following scale limitations:

| **Limitation** | **Description** |
|-----------------|-----------------|
| **Number of network security perimeters**  | Supported up to 100 as recommended limit per subscription. |
| **Profiles per network security perimeters** | Supported up to 200 as recommended limit. |
| **Number of rule elements per profile** | Supported up to 200 as hard limit. |
| **Number of PaaS resources associated with the same network security perimeter** | Supported up to 1000 as recommended limit. |
| **PaaS resources on different subscriptions associated with same network security perimeter** | Supported up to 1000 as recommended limit. |


### Other limitations

Network security perimeter has other limitations as follows:

| **Limitation/Issue** | **Description** |
|-----------------|-------------|
| **Network security perimeter restrictions on control plane operations over ARM** | Enforcement is planned with Azure Resource Manager integration with network security perimeter. |
| **Resource names cannot be longer than 44 characters to support network security perimeter** | The network security perimeter resource association created from the Azure portal has the format `{resourceName}-{perimeter-guid}`. To align with the requirement name field can't have more than 80 characters, resources names would have to be limited to 44 characters. |
| **Service endpoint traffic is not supported.** | It's recommended to use private endpoints for IaaS to PaaS communication. Currently even in the presence of inbound rule allowing 0.0.0.0/0, service endpoint traffic may be denied. |

> [!NOTE]
> Refer to individual PaaS documentation for respective limitations for each service.
