---
title: Onboarding workloads
description: This article helps you understand the onboarding workloads capability within the FinOps Framework and how to implement that in the Microsoft Cloud.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 06/22/2023
ms.topic: conceptual
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# Onboarding workloads

This article helps you understand the onboarding workloads capability within the FinOps Framework and how to implement that in the Microsoft Cloud.

## Definition

**Onboarding workloads refers to the process of bringing new and existing applications into the cloud based on their financial and technical feasibility.**

Establish a process to incorporate new and existing projects into the cloud and your FinOps practice. Introduce new stakeholders to the FinOps culture and approach.

Assess projects' technical feasibility given current cloud resources and capabilities and financial feasibility given the return on investment, current budget, and projected forecast.

A streamlined onboarding process ensures teams have a smooth transition into the cloud without sacrificing technical, financial, or business principles or goals and minimizing disruptions to business operations.

## Getting started

Onboarding projects is an internal process that depends solely on your technical, financial, and business governance policies.

- Start by familiarizing yourself with existing governance policies and onboarding processes within the organization.
  - Should FinOps be added to an existing onboarding process?
  - Are there working processes you can use or copy?
  - Are there any stakeholders who can help you get your process stood up?
  - Who has access to provision new workloads in the cloud? How are you notified that they're created?
  - What governance measures exist to structure and tag new cloud resources? For example, Azure Policy enforcing tagging requirements.
- In the beginning, keep it simple and focus on the basics.
  - Introduce new stakeholders to the FinOps Framework by having them review [What is FinOps](overview-finops.md).
  - Help them learn your culture and processes.
  - Determine if you have the budget.
    - Ensure the team runs through the [Forecasting capability](capabilities-forecasting.md) to estimate costs.
    - Evaluate whether the budget has capacity for the estimated cost.
    - Request department heads reprioritize existing projects to find capacity either by using capacity from under-utilized projects or by deprioritizing existing projects.
    - Escalate through leadership as needed until budget capacity is established.
    - Consider updating forecasts within the scope of the budget changes to ensure feasibility.

## Building on the basics

At this point, you have a simple process where stakeholders are introduced to FinOps, and new projects are at least being vetted against budget capacity. As you move beyond the basics, consider the following points:

- Automate the onboarding process.
  - Consider requiring simple FinOps training.
  - Consider budget change request and approval process that automates reprioritization and change notification to stakeholders.
- Introduce technical feasibility into the approval process. Some considerations to include:
  - Cost efficiency – Implementation/migration, infrastructure, support
  - Resiliency – Performance, reliability, security
  - Sustainability – Carbon footprint

## Developing a process

Document your onboarding process. Using existing tools and processes where available and strive to automate as much as possible to make the process lightweight, effortless, and seamless.

## Learn more at the FinOps Foundation

This capability is a part of the FinOps Framework by the FinOps Foundation, a non-profit organization dedicated to advancing cloud cost management and optimization. For more information about FinOps, including useful playbooks, training and certification programs, and more, see the [Onboarding workloads capability](https://www.finops.org/framework/capabilities/onboarding-workloads/) article in the FinOps Framework documentation.

## Next steps

- [Forecasting](capabilities-forecasting.md)
- [Cloud policy and governance](capabilities-policy.md)
