---
title: Azure Synapse implementation success by design
description: "Learn about the Azure Synapse success series of articles that's designed to help you deliver a successful implementation of Azure Synapse Analytics."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Azure Synapse implementation success by design

The *Azure Synapse implementation success by design* series of articles is designed to help you deliver a successful implementation of Azure Synapse Analytics. It describes a methodology to complement your solution implementation project. It includes suggested checks at strategic points during your project that can help assure a successful implementation. It's important to understand that the methodology shouldn't replace or change your chosen project management methodology (Scrum, Agile, or waterfall). Rather, it suggests validations that can improve the success of your project deployment to a production environment.

[Azure Synapse](../overview-what-is.md) is an enterprise analytics service that accelerates time to insight across data warehouses and big data systems. It brings together the best of SQL technologies used in enterprise data warehousing, Spark technologies used for big data, pipelines for data integration and ETL/ELT, and deep integration with other Azure services, such as Power BI, Azure Cosmos DB, and Azure Machine Learning.

:::image type="content" source="media/implementation-success-overview/azure-synapse-analytics-architecture.png" alt-text="Image shows the Azure Synapse Analytics in terms of data lake, analytics runtimes, and Synapse Studio.":::

The methodology uses a strategic checkpoint approach to assess and monitor the progress of your project. The goals of these checkpoints are:

- Proactive identification of possible issues and blockers.
- Continuous validation of the solution's fit to the use cases.
- Successful deployment to production.
- Smooth operation and monitoring once in production.

The checkpoints are invoked at four milestones during the project:

1. [Project planning](#project-planning-checkpoint)
1. [Solution development](#solution-development-checkpoint)
1. [Pre go-live](#pre-go-live-checkpoint)
1. [Post go-live](#post-go-live-checkpoint)

## Project planning checkpoint

The project planning checkpoint includes the solution evaluation, project plan evaluation, the solution development environment design evaluation, and the team skill sets evaluation.

#### Solution evaluation

Evaluate your entire solution with a focus on how it intends to use Azure Synapse. An assessment involves gathering data that will identify the required components of Azure Synapse, the interfaces each will have with other products, a review of the data sources, the data consumers, the roles, and use cases. This assessment will also gather data about the existing environment including detailed specifications from existing data warehouses, big data environments, and integration and data consumption tooling. The assessment will identify which Azure Synapse components will be implemented and therefore which evaluations and checkpoints should be made throughout the implementation effort. This assessment will also provide additional information to validate the design and implementation against requirements, constraints, and assumptions.

Here's a list of tasks you should complete.

1. [Assess](implementation-success-assess-environment.md) your environment to help evaluate the solution design.
1. Make informed technology decisions to implement Azure Synapse and identify the solution components to implement.
1. [Evaluate the workspace design](implementation-success-evaluate-workspace-design.md).
1. [Evaluate the data integration design](implementation-success-evaluate-data-integration-design.md).
1. [Evaluate the dedicated SQL pool design](implementation-success-evaluate-dedicated-sql-pool-design.md).
1. [Evaluate the serverless SQL pool design](implementation-success-evaluate-serverless-sql-pool-design.md).
1. [Evaluate the Spark pool design](implementation-success-evaluate-spark-pool-design.md).
1. Review the results of each evaluation and respond accordingly.

#### Project plan evaluation

Evaluate the project plan as it relates to the Azure Synapse requirements that need to be developed. This evaluation isn't about producing a project plan. Rather, the evaluation is about identifying any steps that could lead to blockers or that could impact on the project timeline. Once evaluated, you may need to make adjustments to the project plan.

Here's a list of tasks you should complete.

1. [Evaluate the project plan](implementation-success-evaluate-project-plan.md).
1. Evaluate project planning specific to the Azure Synapse components you plan to implement.
1. Review the results of each evaluation and respond accordingly.

#### Solution development environment design evaluation

Evaluate the environment that's to be used to develop the solution. Establish separate development, test, and production environments. Also, it's important to understand that setting up automated deployment and source code control is essential to a successful and smooth development effort.

Here's a list of tasks you should complete.

1. [Evaluate the solution development environment design](implementation-success-evaluate-solution-development-environment-design.md).
1. Review the results of each evaluation and respond accordingly.

#### Team skill sets evaluation

Evaluate the project team with a focus on their skill level and readiness to implement the Azure Synapse solution. The success of the project depends on having the correct skill sets and experience. Many different skill sets are required to implement an Azure Synapse solution, so ensure you identify gaps and secure suitable resources that have the required skill sets (or arrange for them to complete training). This evaluation is critical at this stage of your project because a lack of the proper skills can impact on both the timeline and the overall success of the project.

Here's a list of tasks you should complete.

1. [Evaluate the team skill sets](implementation-success-evaluate-team-skill-sets.md).
1. Secure skilled resources, or upskill resources to expand their capabilities.
1. Review the results of each evaluation and respond accordingly.

### Solution development checkpoint

The solution development checkpoint includes periodic quality checks and additional skill building.

#### Periodic quality checks

During solution development, you should make periodic checks to validate that the solution is being developed according to recommended practices. Check that the project use cases will be satisfied and that enterprise requirements are being met. For the purposes of this methodology, these checks are called *periodic quality checks*.

Implement the following quality checks:

- Quality checks for workspaces.
- Quality checks for data integration.
- Quality checks for dedicated SQL pools.
- Quality checks for serverless SQL pools.
- Quality checks for Spark pools.

#### Additional skill building

As the project progresses, identify whether more skill sets are needed. Take the time to determine whether more skill sets could improve the quality of the solution. Supplementing the team with more skill sets can help to avoid project delays and project timeline impacts.

### Pre go-live checkpoint

Before deploying your solution to production, we recommend that you perform reviews to assess the preparedness of the solution.

The *pre go-live* checklist provides a final readiness check to successfully deploy to production.

1. [Perform the operational readiness review](implementation-success-perform-operational-readiness-review.md).
1. [Perform the user readiness and onboarding plan review](implementation-success-perform-user-readiness-and-onboarding-plan-review.md).
1. Review the results of each review and respond accordingly.

### Post go-live checkpoint

After deploying to production, we recommend that you validate that the solution operates as expected.

The *post go-live* checklist provides a final readiness check to monitor your Azure Synapse solution.

1. [Perform the monitoring review](implementation-success-perform-monitoring-review.md).
1. Continually monitor your Azure Synapse solution.

## Next steps

In the [next article](implementation-success-assess-environment.md) in the *Azure Synapse implementation success by design* series, learn how to assess your environment to help evaluate the solution design and make informed technology decisions to implement Azure Synapse.
