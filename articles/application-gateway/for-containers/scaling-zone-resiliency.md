---
title: Scaling and Zone-redundant Application Gateway for Containers
description: This article defines Application Gateway for Containers Autoscaling and Zone-redundant features.
services: application-gateway
author: greglin
ms.custom: references_regions
ms.service: application-gateway
ms.subservice: appgw-for-containers
ms.topic: conceptual
ms.date: 5/9/2024
ms.author: greglin
---

# Scaling and availability for Application Gateway for Containers

Application Gateway for Containers is configured with autoscaling in a high availability configuration in all cases. The gateway scales in or out based on application traffic. This offers better elasticity to your application and eliminates the need to guess capacity or manually manage instance counts. Autoscaling also maximizes cost savings by not requiring the gateway to constantly run at peak-provisioned capacity for the expected maximum traffic load.

## Autoscaling and high availability

Azure Application Gateway for Containers is always deployed in a highly available configuration. The service takes advantage of [availability zones](/azure/reliability/availability-zones-overview) if the region supports availability zones. If the region does not support zones, Application Gateway for Containers leverages availability sets to ensure resiliency. In the event the Application Gateway for Containers service has an underlying problem and becomes degraded, the service is designed to self-recover.

- During scale in and out events, operation and configuration updates continue to be applied.
- During scale-out events, introduction of additional capacity can take up to five minutes.
- During scale-in events, Application Gateway for containers drains existing connections for five minutes on the capacity that is subject to removal. After five minutes, the existing connections are closed, and the capacity is removed. Any new connections during or after the five-minute scale in time are established to the remaining capacity on the same gateway.

## Maintenance

Updates initiated to Application Gateway for Containers are applied one update domain at a time to eliminate downtime. During maintenance, operation and configuration updates continue to be applied. Active connections are gracefully drained for up to 5 minutes, establishing new connections to the remaining capacity in a different update domain prior to the update beginning. During update, Application Gateway for Containers temporarily runs at a reduced maximum capacity. The update process proceeds through each update domain, only proceeding to the next update domain once a healthy status is returned.

## Next steps

- Learn more about [Application Gateway for Containers](overview.md)
