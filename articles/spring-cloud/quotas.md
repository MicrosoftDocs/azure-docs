---
title:  Service plans and quotas for Azure Spring Cloud
description: Learn about service quotas and service plans for Azure Spring Cloud
author: karlerickson
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: karler
ms.custom: devx-track-java
---

# Quotas and Service Plans for Azure Spring Cloud

**This article applies to:** ✔️ Java ✔️ C#

All Azure services set default limits and quotas for resources and features.   Azure Spring Cloud offers two pricing tiers: Basic and Standard. We will detail limits for both tiers in this article.

## Azure Spring Cloud service tiers and limits

| Resource | Scope | Basic | Standard
------- | ------- | -------
vCPU | per app instance | 1 | 4
Memory | per app instance | 2 GB | 8 GB
Azure Spring Cloud service instances | per region per subscription | 10 | 10
Total app instances | per Azure Spring Cloud service instance | 25 | 500
Custom Domains | per Azure Spring Cloud service instance | 0 | 25 
Persistent volumes | per Azure Spring Cloud service instance | 1 GB/app x 10 apps | 50 GB/app x 10 apps
Inbound Public Endpoints | per Azure Spring Cloud service instance| 10 <sup>1</sup> | 10 <sup>1</sup>
Outbound Public IPs | per Azure Spring Cloud service instance| 1 <sup>2</sup> | 2 <sup>2</sup> <br> 1 if using VNet<sup>2</sup>

<sup>1</sup> You can increase this limit via support request to a maximum of 1 per app.

<sup>2</sup> You can increase this limit via support request to a maximum of 10.

> [!TIP]
> Limits listed for Total app instances per service instance apply for apps and deployments in any state, including stopped state. Please delete apps or deployments that are not in use.

## Next steps

Some default limits can be increased. If your setup requires an increase, [create a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).
