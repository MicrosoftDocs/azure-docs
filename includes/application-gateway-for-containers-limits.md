---
author: greg-lindsay
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: include
ms.date: 02/27/2024
ms.author: greglin
---
| Resource | Limit |
| --- | --- |
| Application Gateway for Containers | 1000 per subscription |
| Associations | 1 per gateway |
| Frontends | 5 per gateway |

Kubernetes Ingress and Gateway API configuration limits

| Resource | Limit |
| --- | --- |
| Resource naming | 128 characters |
| Namespace naming | 128 characters |
| Listeners per gateway | 64 listeners per gateway resource (enforced by Gateway API) |
| Total AGC references | 5 per ALB controller |
| Total certificate references | 100 per AGC |
| Total listeners | 200 per AGC |
| Total routes | 200 per AGC |
| Total rules | 200 per AGC |
| Total services | 100 per AGC |
| Total endpoints | 5000 per AGC |
