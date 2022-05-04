---
title: Disaster recovery guidance for Azure Container Apps
description: Learn how to deal with disaster recovery scenarios in Azure Container Apps
services: container-apps
author: craigshoemaker
ms.author: cshoe
ms.service: container-apps
ms.topic: tutorial
ms.date: 5/04/2022
---

# Disaster recovery guidance for Azure Container Apps

When using Azure Container Apps, it's critical for you to prepare your own disaster recovery plan. This article helps guide you to build a disaster recovery plan. The following resources can help you create your own plan:

- [Failure and disaster recovery for Azure applications](/azure/architecture/reliability/disaster-recovery)
- [Azure resiliency technical guidance](/azure/architecture/checklist/resiliency-per-service)

## Preparation

To prepare for a disaster, ensure cross-region resiliency by:

- Creating dual sets of your container apps in different regions
- Use Azure Front Door to process requests, this way you can redirect traffic from one region to another

## Recovery

To recover from a regional outage, redeploy your Container Apps environments.

