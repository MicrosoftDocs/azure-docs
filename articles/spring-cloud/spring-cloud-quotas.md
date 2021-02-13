---
title:  Service plans and quotas for Azure Spring Cloud
description: Learn about service quotas and service plans for Azure Spring Cloud
author:  bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: brendm
ms.custom: devx-track-java
---

# Quotas and Service Plans for Azure Spring Cloud

**This article applies to:** ✔️ Java ✔️ C#

All Azure services set default limits and quotas for resources and features.   Azure Spring Cloud offers two pricing tiers: Basic and Standard. We will detail limits for both tiers in this article.

## Azure Spring Cloud service tiers and limits

| Resource | Basic | Standard
------- | ------- | -------
vCPU | 1 per service instance | 4 per service instance
Memory | 2 GB per service instance | 8 GB per service instance
Azure Spring Cloud service instances per region per subscription | 10 | 10
Total app instances per Azure Spring Cloud service instance | 25 | 500
Persistent volumes | 1 GB/app x 10 apps | 50 GB/app x 10 apps

## Next steps

Some default limits can be increased. If your setup requires an increase, [create a support request](../azure-portal/supportability/how-to-create-azure-support-request.md).