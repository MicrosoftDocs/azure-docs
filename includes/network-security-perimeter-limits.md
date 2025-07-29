---
 title: include file
 description: include file
 services: private-link
 author: mbender
 ms.service: azure-private-link
 ms.topic: include
 ms.date: 10/28/2024
 ms.author: mbender-ms
ms.custom: include file, ignite-2024
---

### Scale limitations

Network security perimeter functionality can be used to support deployments of PaaS resources with common public network controls with following scale limitations:

| **Limitation** | **Description** |
|-----------------|-----------------|
| **Number of network security perimeters**  | Supported up to 100 as recommended limit per subscription. |
| **Profiles per network security perimeters** | Supported up to 200 as recommended limit. |
| **Number of rule elements per profile** | Supported up to 200 for inbound and outbound each as hard limit. |
| **Number of PaaS resources across subscriptions associated with the same network security perimeter** | Supported up to 1000 as recommended limit. |

### Other limitations

Network security perimeter has other limitations as follows:

| **Limitation/Issue** | **Description** |
|-----------------|-------------|
| **Missing field in network security perimeter access logs** | Network security perimeter access logs may have been aggregrated. If the fields 'count' and 'timeGeneratedEndTime' are missing, consider the aggregation count as 1. |
| **Association creations through SDK fails with permission issue** | Status: 403 (Forbidden) ; ErrorCode: AuthorizationFailed, might be received while performing action 'Microsoft.Network/locations/networkSecurityPerimeterOperationStatuses/read' over scope '/subscriptions/xyz/providers/Microsoft.Network/locations/xyz/networkSecurityPerimeterOperationStatuses/xyz'.  <br> <br> Until the fix, use permission 'Microsoft.Network/locations/*/read' or use WaitUntil.Started in CreateOrUpdateAsync SDK API for association creations. |
| **Resource names cannot be longer than 44 characters to support network security perimeter** | The network security perimeter resource association created from the Azure portal has the format `{resourceName}-{perimeter-guid}`. To align with the requirement name field can't have more than 80 characters, resources names would have to be limited to 44 characters. |
| **Service endpoint traffic is not supported.** | It's recommended to use private endpoints for IaaS to PaaS communication. Currently, service endpoint traffic can be denied even when an inbound rule allows 0.0.0.0/0. |

> [!NOTE]
> Refer to individual PaaS documentation for respective limitations for each service.
