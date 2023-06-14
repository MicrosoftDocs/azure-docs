---
title: "Synapse implementation success methodology: Evaluate solution development environment design"
description: "Learn how to set up multiple environments for your modern data warehouse project to support development, testing, and production."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate solution development environment design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Solution development and the environment within which it's performed is key to the success of your project. Regardless of your selected project methodology (like waterfall, Agile, or Scrum), you should set up multiple environments to support development, testing, and production. You should also define clear processes for promoting changes between environments.

Setting up a modern data warehouse environment for both production and pre-production use can be complex. Keep in mind that one of the key design decisions is automation. Automation helps increase productivity while minimizing the risk of errors. Further, your environments should support future agile development, including the addition of new workloads, like data science or real-time. During the design review, produce a solution development environment design that will support your solution not only for the current project but also for ongoing support and development of your solution.

## Solution development environment design 

The environment design should include the production environment, which hosts the production solution, and at least one non-production environment. Most environments contain two non-production environments: one for development and another for testing, Quality Assurance (QA), and User Acceptance Testing (UAT). Typically, environments are hosted in separate Azure subscriptions. Consider creating a production subscription, and a non-production subscription. This separation will provide a clear security boundary and delineation between production and non-production.

Ideally, you should establish three environments.

- **Development:** The environment within which your data and analytics solutions are built. Determine whether to provide sandboxes for developers. Sandboxes can allow developers to make and test their changes in isolation, while a shared development environment will host integrated changes from the entire development team.
- **Test/QA/UAT:** The production-like environment for testing deployments prior to their release to production.
- **Production:** The final production environment.

### Synapse workspaces

For each Synapse workspace in your solution, the environment should include a production workspace and at least one non-production workspace for development and test/QA/UAT. Use the same name for all pools and artifacts across environments. Consistent naming will ease the promotion of workspaces to other environments.

Promoting a workspace to another workspace is a two-part process:

1. Use an [Azure Resource Manager template (ARM template)](../../azure-resource-manager/templates/overview.md) to create or update workspace resources.
1. Migrate artifacts like SQL scripts, notebooks, Spark job definitions, pipelines, datasets, and data flows by using [Azure Synapse continuous integration and delivery (CI/CD) tools in Azure DevOps or on GitHub](../cicd/continuous-integration-delivery.md).

### Azure DevOps or GitHub

Ensure that integration with Azure DevOps or GitHub is properly set up. Design a repeatable process that releases changes across development, Test/QA/UAT, and production environments. 

>[!IMPORTANT]
> We recommend that sensitive configuration data always be stored securely in [Azure Key Vault](../../key-vault/general/basic-concepts.md). Use Azure Key Vault to maintain a central, secure location for sensitive configuration data, like database connection strings. That way, appropriate services can access configuration data from within each environment.

## Next steps

In the [next article](implementation-success-evaluate-team-skill-sets.md) in the *Azure Synapse success by design* series, learn how to evaluate your team of skilled resources that will implement your Azure Synapse solution.