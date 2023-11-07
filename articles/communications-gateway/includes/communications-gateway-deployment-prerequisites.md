---
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: include
ms.date: 10/09/2023
---

> [!IMPORTANT]
> You must fully understand the onboarding process for your chosen communications service and any dependencies introduced by the onboarding process.
> 
> Allow sufficient elapsed time for the deployment and onboarding process. For example, you might need wait up to two weeks for a new Azure Communications Gateway resource to be provisioned before you can connect it to your network. 

You must own globally routable numbers for two types of testing:
- Integration testing by your staff during deployment and integration
- Service verification (continuous call testing) by your chosen communication services

The following table describes how many numbers you need to allocate.

Service | Numbers for integration testing | Service verification numbers |
|---------|---------|---------|
|Operator Connect | 1 (minimum)| 6 |
|Teams Phone Mobile | 1 (minimum) | 6 |
|Microsoft Teams Direct Routing | 1 (minimum) |  None (not applicable) |
|Zoom Phone Cloud Peering | 1 (minimum) | - 6 (US and Canada)<br>- 2 (rest of world)|

> [!IMPORTANT]
> Service verification numbers must be usable throughout the lifetime of your deployment.
