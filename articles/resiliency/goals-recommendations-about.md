---
title: About goals and recommendations in Infrastructure Resiliency Manager
description: Learn about goals and recommendations in Infrastructure Resiliency Manager and how they can help you define, validate, and achieve your applications' resiliency goals in Azure.
ms.topic: overview
ms.service: resiliency
ms.date: 10/26/2026
author: AbhishekMallick-MS
ms.author: v-mallicka
# Customer intent: "As a cloud administrator, I want to understand how goals and recommendations in Infrastructure Resiliency Manager can help me define, validate, and achieve my applications' resiliency goals in Azure."
---

# About goals and recommendations in Infrastructure Resiliency Manager

Infrastructure Resiliency Manager is a self-serve experience that helps you define, validate, and achieve your applications' resiliency goals in Azure. With this experience, you can:

- Set resiliency goals for your applications.
- Receive detailed recommendations that help meet the goals.
- Review resilience posture across your Azure estate from a single pane of glass.
- Run simulated outage drills for outage readiness validation.
- Recover from zonal outages using recovery plans for applications.

>[!NOTE]
>Infrastructure Resiliency Manager is a global (nonregional) service. This service isn’t deployed to a specific Azure region and can manage and operate across resources in any Azure region.

## Goals and Recommendations capability in Infrastructure Resiliency Manager

The Goals and Recommendations capability involves the following scenarios:

- Create service groups to model your applications by grouping Azure resources across subscriptions and resource groups.
- Assign zonal resiliency goals to those service groups.
- View your resiliency posture - a summary showing how many resources are zone-resilient, non-zone-resilient, or not evaluated.
- Review targeted recommendations for resources that don't meet your goals.
- Act on recommendations by following step-by-step remediation guidance or using the Resiliency agent.
- View resiliency at scale across all your service groups and resources from a centralized overview.

Assigning goals, viewing resilience posture, and reviewing recommendations are available at no extra cost without a usage plan. A service group with assigned goals is still billed if it's enrolled in a valid usage plan. To retain only the free capabilities without these charges, remove the service group's usage-plan enrollment. For details, see [Billing and pricing](infrastructure-resiliency-manager-pricing.md).

## Key components for Infrastructure Resiliency Manager

 The following table lists the core components you use for Infrastructure Resiliency Manager:

| Component | Description |
|-----------|-------------|
| Zone-resilient resources | Resources configured with an Azure-recommended zonal resiliency solution. See the [support matrix for detected solutions](goals-recommendations-support-matrix.md). |
| Non zone-resilient resources | Resources for which no zonal resiliency solution is detected. |
| Resources not evaluated | Resources excluded by the user or not supported by the service. |
| Manual attestation | Mark resources as resilient when zonal resiliency is managed through custom solutions not automatically detected. |

## How Infrastructure Resiliency Manager connects to Azure Advisor

Azure Advisor provides recommendations across all Well-Architected Framework pillars. Infrastructure Resiliency Manager narrows the focus to zonal resiliency and adds goal-based tracking. Recommendations resolved in the Infrastructure Resiliency Manager are also reflected in the Advisor.

## Related content

- [Support Matrix for goals and recommendations in Infrastructure Resiliency Manager](goals-recommendations-support-matrix.md).
- [Assign goals and view resiliency posture in Infrastructure Resiliency Manager](goals-recommendations-assign-goals-view-posture.md).
- [Review recommendations in Infrastructure Resiliency Manager](goals-recommendations-review-recommendations.md).
- [Use the Resiliency agent (preview) in Infrastructure Resiliency Manager](goals-recommendations-use-agent.md).