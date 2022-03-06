---
title: Evaluate solution development environment design
description: TODO (project-plan-evaluation)
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Evaluate solution development environment design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Solution Development and the Environment within which this will be performed is key to your project's success. Regardless of the project methodology selected (waterfall, Agile, scrum, etc.) multiple environments -- development -- test/User acceptance -- Production with clear processes for promoting changes between environments will be required.

Setting up a modern data warehouse environment for both production and pre-production use can be complex. Keep in mind that one of the key design decisions is automation - it helps increase productivity while minimizing the risk of errors. On top of it we must be able to support future agile development, including the addition of new workloads like data science, RT, etc. During this design review we will review the solution development environment design that will support your solution not only for this project but for ongoing support and development of this solution. We will review the options and recommendations for solution development environments and compare this guidance with the design. When completed we will have reviewed the key components for development and support of this solution that will  be instrumental to this project's solution development phase and ongoing support and development.

## Solution development environment design 

In the scope of solution development environment design scenarios there are many common requirements. The environment design should include the Production environment which will host the production solution and at least one non-production environment -- most environments contain two non-production environments: one for development and another for QA/testing/User Acceptance(UAT). Typically, they are hosted in separate Azure Subscriptions, a production subscription, and a non-prod
subscription. This provides a very clear security boundary and delineation between non-prod and production.

For the purposes of this review, we will identify three environments:

- **Development:** This is the environment within which your data and analytics solutions are going to be built. Check if this environment must be able to spawn further and provide sandboxes for developers who need to make and test their changes in isolation while a shared Development environment will host integrated changes from the entire development team.
- **Test/QA/UAT:** This is the production-like environment for deployments to be tested before going to production.
- **Production:** This is the final production environment.

### Synapse workspaces

For each Synapse Workspace in the solution the Environment should include a production Synapse Workspace and at least one non-production Synapse Workspace, Dev and QA/Test/UAT.

All pools and artifacts within the workspace (Spark Pools, Databases, SQL Pools, etc.) should be named the same across environments to ease the promotion of your workspace and its pools and artifacts to another environment, there are two parts.

1. Use an [Azure Resource Manager template (ARM template)](../../azure-resource-manager/templates/overview.md) to create or update the workspace resources (pools and workspace).
2. Migrate artifacts (SQL scripts, notebook, Spark job definition, pipelines, datasets, data flows, and so on) with Azure Synapse Analytics CI/CD tools in Azure DevOps.

### Azure DevOps / GitHub

Review that integration with Azure DevOps or GitHub is properly configured: there should be a repeatable process that moves changes across dev, test and production environments. 

Sensitive configuration data should always be stored securely in Azure Key Vault(s): maintain a central, secure location for sensitive configuration data such as database connection strings that can be access by the appropriate services within the specific environment.

## Conclusion 

Solution Development Environment design will improve the quality of your solution and the resilience of your solution to unintended or un-tested changes. The design of the solution development environment should support your project methodology and protect your solution and your data. This review will have validated the design of your solution development environment.

## Next steps

TODO
