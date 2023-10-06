---
title: Service plans and quotas for Azure Spring Apps
description: Learn about service quotas and service plans for Azure Spring Apps.
author: KarlErickson
ms.service: spring-apps
ms.topic: conceptual
ms.date: 05/15/2023
ms.author: karler
ms.custom: devx-track-java, event-tier1-build-2022
---

# Quotas and service plans for Azure Spring Apps

> [!NOTE]
> Azure Spring Apps is the new name for the Azure Spring Cloud service. Although the service has a new name, you'll see the old name in some places for a while as we work to update assets such as screenshots, videos, and diagrams.

**This article applies to:** ✔️ Java ✔️ C#

**This article applies to:** ✔️ Standard consumption and dedicated (Preview) ✔️ Basic/Standard ✔️ Enterprise

All Azure services set default limits and quotas for resources and features. Azure Spring Apps offers four pricing plans: Basic, Standard, Enterprise, and Standard consumption.

## Azure Spring Apps service plans and limits

The following table defines limits for the pricing plans in Azure Spring Apps.

| Resource                            | Scope                                  | Basic              | Standard                                        | Enterprise                                      | Standard consumption                            | Standard dedicated                                    |
|-------------------------------------|----------------------------------------|--------------------|-------------------------------------------------|-------------------------------------------------|-------------------------------------------------|-------------------------------------------------------|
| vCPU                                | per app instance                       | 1                  | 4                                               | 8                                               | 4                                               | based on workload profile (for example, 16 in D16)    |
| Memory                              | per app instance                       | 2 GB               | 8 GB                                            | 32 GB                                           | 8 GB                                            | based on workload profile (for example, 128GB in E16) |
| Azure Spring Apps service instances | per region per subscription            | 10                 | 10                                              | 10                                              | 10                                              | 10                                                    |
| Total app instances                 | per Azure Spring Apps service instance | 25                 | 500                                             | 1000                                            | 400                                             | 1000                                                  |
| Custom Domains for app              | per Azure Spring Apps service instance | 0                  | 500                                             | 500                                             | 500                                             | 500                                                   |
| Custom Domains for app              | per app instance                       | 0                  | 5                                               | 5                                               | 5                                               | 5                                                     |
| Custom Domains for Tanzu Component  | per Tanzu Component                    | N/A                | N/A                                             | 5                                               | N/A                                             | N/A                                                   |
| Persistent volumes                  | per Azure Spring Apps service instance | 1 GB/app x 10 apps | 50 GB/app x 10 apps                             | 50 GB/app x 10 apps                             | Not applicable                                  | Not applicable                                        |
| Inbound Public Endpoints            | per Azure Spring Apps service instance | 10 <sup>1</sup>    | 10 <sup>1</sup>                                 | 10 <sup>1</sup>                                 | 10 <sup>1</sup>                                 | 10 <sup>1</sup>                                       |
| Outbound Public IPs                 | per Azure Spring Apps service instance | 1 <sup>2</sup>     | 2 <sup>2</sup> <br> 1 if using VNet<sup>2</sup> | 2 <sup>2</sup> <br> 1 if using VNet<sup>2</sup> | 2 <sup>2</sup> <br> 1 if using VNet<sup>2</sup> | 2 <sup>2</sup> <br> 1 if using VNet<sup>2</sup>       |
| User-assigned managed identities    | per app instance                       | 20                 | 20                                              | 20                                              | Not available during preview                    | Not available during preview                          |
| Requests per second/Throughput      | per Azure Spring Apps service instance | 5000 <sup>3</sup>  | 10000 <sup>3</sup>                              | 20000 <sup>3</sup>                              | Not applicable                                  | Not applicable                                        |

<sup>1</sup> You can increase this limit via support request to a maximum of 1 per app.

<sup>2</sup> You can increase this limit via support request to a maximum of 10.

<sup>3</sup> This limit only applies to customers without an Enterprise Agreement subscription. You can increase this limit based on your workload size via raising a support ticket. For customers with an Enterprise Agreement subscription, Azure Spring Apps automatically adjusts underlying resource to support application traffic.

> [!TIP]
> Limits listed apply for apps and deployments in any state, including apps in a stopped state. These limits include total app instances and per service instances. Be sure to delete apps and deployments that aren't being used.

## Next steps

Some default limits can be increased. For more information, see [create a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
