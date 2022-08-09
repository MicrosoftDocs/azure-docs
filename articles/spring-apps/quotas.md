---
title:  Service plans and quotas for Azure Spring Apps
description: Learn about service quotas and service plans for Azure Spring Apps
author: karlerickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022
---

# Quotas and service plans for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Basic/Standard tier ✔️ Enterprise tier

All Azure services set default limits and quotas for resources and features. Azure Spring Apps offers two pricing tiers: Basic and Standard. We will detail limits for both tiers in this article.

## Azure Spring Apps service tiers and limits

| Resource                             | Scope                                   | Basic              | Standard/Enterprise                             |
|--------------------------------------|-----------------------------------------|--------------------|-------------------------------------------------|
| vCPU                                 | per app instance                        | 1                  | 4                                               |
| Memory                               | per app instance                        | 2 GB               | 8 GB                                            |
| Azure Spring Apps service instances | per region per subscription             | 10                 | 10                                              |
| Total app instances                  | per Azure Spring Apps service instance | 25                 | 500                                             |
| Custom Domains                       | per Azure Spring Apps service instance | 0                  | 25                                              |
| Persistent volumes                   | per Azure Spring Apps service instance | 1 GB/app x 10 apps | 50 GB/app x 10 apps                             |
| Inbound Public Endpoints             | per Azure Spring Apps service instance | 10 <sup>1</sup>    | 10 <sup>1</sup>                                 |
| Outbound Public IPs                  | per Azure Spring Apps service instance | 1 <sup>2</sup>     | 2 <sup>2</sup> <br> 1 if using VNet<sup>2</sup> |
| User-assigned managed identities     | per app instance                        | 20                 | 20                                              |

<sup>1</sup> You can increase this limit via support request to a maximum of 1 per app.

<sup>2</sup> You can increase this limit via support request to a maximum of 10.

> [!TIP]
> Limits listed for Total app instances per service instance apply for apps and deployments in any state, including stopped state. Be sure to delete apps or deployments that aren't in use.

## Next steps

Some default limits can be increased. If your setup requires an increase, [create a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
