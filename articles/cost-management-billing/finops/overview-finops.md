---
title: What is FinOps?
description: FinOps combines financial management principles with cloud engineering and operations to provide organizations with a better understanding of their cloud spending. It also helps them make informed decisions on how to allocate and manage their cloud costs.
keywords:
author: bandersmsft
ms.author: banders
ms.date: 06/21/2023
ms.topic: overview
ms.service: cost-management-billing
ms.subservice: finops
ms.reviewer: micflan
---

# What is FinOps?

FinOps is a discipline that combines financial management principles with cloud engineering and operations to provide organizations with a better understanding of their cloud spending. It also helps them make informed decisions on how to allocate and manage their cloud costs. The goal of FinOps isn't to save money, but to maximize revenue or business value through the cloud. It helps to enable organizations to control cloud spending while maintaining the level of performance, reliability, and security needed to support their business operations.

FinOps typically involves using cloud cost management tools, like [Microsoft Cost Management](../index.yml), and best practices to:

- Analyze and track cloud spending
- Identify cost-saving opportunities
- Allocate costs to specific teams, projects, or products. 

FinOps involves collaboration across finance, technology, and business teams to establish and enforce policies and processes that enable teams to track, analyze, and optimize cloud costs. FinOps seeks to align cloud spending with business objectives and strike a balance between cost optimization and performance so organizations can achieve their business goals without overspending on cloud resources.

The word _FinOps_ is a blend of Finance and DevOps and is sometimes referred to as cloud cost management or cloud financial management. The main difference between FinOps and these terms is the cultural impact that expands throughout the organization. While one individual or team can "manage cost" or "optimize resources," the FinOps culture refers to a set of values, principles, and practices that permeate organizations. It helps enable them to achieve maximum business value with their cloud investment.

The FinOps Foundation, a non-profit organization focused on FinOps, offers a great video description:

>[!VIDEO https://www.youtube.com/embed/VDrcgEne6lU]

[FinOps The operating model for the cloud](https://www.youtube.com/watch?v=VDrcgEne6lU)

## Partnership with the FinOps Foundation

[The FinOps Foundation](https://finops.org/) is a non-profit organization hosted at the Linux Foundation. It's dedicated to advancing people who practice the discipline of cloud cost management and optimization via best practices, education, and standards. The FinOps Foundation manages a community of practitioners around the world, including many of our valued Microsoft Cloud customers and partners. The FinOps Foundation hosts working groups and special interest groups to cover many topics. They include:

- Cost and usage data standardization
- Containers and Kubernetes
- Sustainability based on real-world stories and expertise from the community

[Microsoft joined the FinOps Foundation in February 2023](https://azure.microsoft.com/blog/microsoft-joins-the-finops-foundation/). Microsoft actively participates in multiple working groups, contributing to Foundation content. It engages with organizations within the FinOps community to both improve FinOps Framework best practices and guidance. And, it integrates learnings from the FinOps community back into Microsoft products and guidance.

## What is the FinOps Framework?

The [FinOps Framework](https://finops.org/framework) by the FinOps Foundation is a comprehensive set of best practices and principles. It provides a structured approach to implement a FinOps culture to:

- Help organizations manage their cloud costs more effectively
- Align cloud spending with business goals
- Drive greater business value from their cloud infrastructure

Microsoft's guidance is largely based on the FinOps Framework with a few enhancements based on the lessons learned from our vast ecosystem of Microsoft Cloud customers and partners. These extensions map cleanly back to FinOps Framework concepts and are intended to provide more targeted, actionable guidance for Microsoft Cloud customers and partners. We're working with the FinOps Foundation to incorporate our collective learnings back into the FinOps Framework.

In the next few sections, we cover the basic concepts of the FinOps Framework:

- The **principles** that should guide your FinOps efforts.
- The **stakeholders** that should be involved.
- The **lifecycle** that you iterate through.
- The **capabilities** that you implement with stakeholders throughout the lifecycle.
- The **maturity model** that you use to measure growth over time.

## Principles

Before digging into FinOps, it's important to understand the core principles that should guide your FinOps efforts. The FinOps community developed the principles by applying their collective experience, and helps you create a culture of shared accountability and transparency.

- **Teams need to collaborate** – Build a common focus on cost efficiency, processes and cost decisions across teams that might not typically work closely together.
- **Everyone takes ownership** – Decentralize decisions about cloud resource usage and optimization, and drive technical teams to consider cost as well as uptime and performance.
- **A centralized team drives FinOps** – Centralize management of FinOps practices for consistency, automation, and rate negotiations.
- **FinOps reports should be accessible and timely** – Provide clear usage and cost data quickly, to the right people, to enable prompt decisions and forecasting.
- **Decisions are driven by the business value of cloud** – Balance cost decisions with business benefits including quality, speed, and business capability.
- **Take advantage of the variable cost model of the cloud** – Make continuous small adjustments in cloud usage and optimization.

For more information about FinOps principles, including tips from the experts, see [FinOps with Azure – Bringing FinOps to life through organizational and cultural alignment](https://azure.microsoft.com/resources/finops-with-azure-bringing-finops-to-life-through-organizational-and-cultural-alignment/).

## Stakeholders

FinOps requires a holistic and cross-functional approach that involves various stakeholders (or personas). They have different roles, responsibilities, and perspectives that influence how they use and optimize cloud resources and costs. Familiarize yourself with each role and identify the stakeholders within your organization. An effective FinOps program requires collaboration across all stakeholders:

- **Finance** – Accurately budget, forecast, and report on cloud costs.
- **Leadership** – Apply the strengths of the cloud to maximize business value.
- **Product owners** – Launch new offerings at the right price.
- **Engineering teams** – Deliver high quality, cost-effective services.
- **FinOps practitioners** – Educate, standardize, and promote FinOps best practices.

## Lifecycle

FinOps is an iterative, hierarchical process. Every team iterates through the FinOps lifecycle at their own pace, partnering with teams mentioned throughout all areas of the organization.

The FinOps Framework defines a simple lifecycle with three phases:

- **Inform** – Deliver cost visibility and create shared accountability through allocation, benchmarking, budgeting, and forecasting.
- **Optimize** – Reduce cloud waste and improve cloud efficiency by implementing various optimization strategies.
- **Operate** – Define, track, and monitor key performance indicators and governance policies that align cloud and business objectives.

## Capabilities

The FinOps Framework includes capabilities that cover everything from cost analysis and monitoring to optimization and organizational alignment, grouped into a set of related domains. Each capability defines a functional area of activity and a set of tasks to support your FinOps practice.

- Understanding cloud usage and cost

  - Cost allocation
  - Data analysis and showback
  - Managing shared cost
  - Data ingestion and normalization

- Performance tracking and benchmarking

  - Measuring unit costs
  - Forecasting
  - Budget management

- Real-time decision making

  - Managing anomalies
  - Establishing a FinOps decision and accountability structure

- Cloud rate optimization

  - Managing commitment-based discounts

- Cloud usage optimization

  - Onboarding workloads
  - Resource utilization and efficiency
  - Workload management and automation

- Organizational alignment

  - Establishing a FinOps culture
  - Chargeback and finance integration
  - FinOps education and enablement
  - Cloud policy and governance
  - FinOps and intersecting frameworks

## Maturity model

As teams progress through the FinOps lifecycle, they naturally learn and grow, developing more mature practices with each iteration. Like the FinOps lifecycle, each team is at different levels of maturity based on their experience and focus areas.

The FinOps Framework defines a simple Crawl-Walk-Run maturity model, but the truth is that maturity is more complex and nuanced. Instead of focusing on a global maturity level, we believe it's more important to identify and assess progress against your goals in each area. At a high level, you will:

1. Identify the most critical capabilities for your business.
2. Define how important it is that each team has knowledge, process, success metrics, organizational alignment, and automation for each of the identified capabilities.
3. Evaluate each team's current knowledge, process, success metrics, organizational alignment, and level of automation based on the defined targets.
4. Identify steps that each team could take to improve maturity for each capability.
5. Set up regular check-ins to monitor progress and reevaluate the maturity assessment every 3-6 months.

## Learn more at the FinOps Foundation

FinOps Foundation offers many resources to help you learn and implement FinOps. Join the FinOps community, explore training and certification programs, participate in community working groups, and more. For more information about FinOps, including useful playbooks, see the [FinOps Framework documentation](https://finops.org/framework).

## Next steps

[Conduct a FinOps iteration](conduct-finops-iteration.md)