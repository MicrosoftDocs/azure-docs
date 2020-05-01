---
title:  Service plans and quotas for Azure Spring Cloud
description: Learn about service quotas and service plans for Azure Spring Cloud
author:  bmitchell287
ms.service: spring-cloud
ms.topic: conceptual
ms.date: 11/04/2019
ms.author: brendm
---
# Quotas and Service Plans for Azure Spring Cloud

All Azure services set default limits and quotas for resources and features.  During the preview period, Azure Spring Cloud offers only one service plan.

This article details the service quotas offered during the current preview period.

## Azure Spring Cloud service tiers and quotas

During the preview period, Azure Spring Cloud offers only one service tier.

Resource | Amount
------- | -------
vCPU | 4 per service instance
Memory | 8 GBytes per service instance
Azure Spring Cloud service instances per region per subscription | 10
Total app instances per Azure Spring Cloud service instance | 500
Total app instances per Spring application | 20
Persistent volumes | 10 x 50 GBytes

When you reach a quota, you'll receive a 400 error that reads: "Quota exceeds limit for subscription *your subscription* in region *region where your Azure Spring Cloud service is created*.

## Next steps

Certain default limits and quotas can be increased. If your resource requires an increase, [create a support request](https://docs.microsoft.com/azure/azure-portal/supportability/how-to-create-azure-support-request).
