---
title: "Synapse implementation success methodology: Evaluate team skill sets"
description: "Learn how to evaluate your team of skilled resources that will implement your Azure Synapse solution."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate team skill sets

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Solution development requires a team comprising individuals with many different skills. It's important for the success of your solution that your team has the necessary skills to successfully complete their assigned tasks. This evaluation takes an honest and critical look at the skill level of your project resources, and it provides you with a list of roles that are often required during the implementation of an Azure Synapse solution. Your team needs to possess relevant experience and skills to complete their assigned project tasks within the expected time frame.

## Microsoft learning level definitions

This article uses the Microsoft standard level definitions for describing learning levels.

| Level | Description |
|:-|:-|
| 100 | Assumes little or no expertise with the topic, and covers topic concepts, functions, features, and benefits. |
| 200 | Assumes 100-level knowledge and provides specific details about the topic. |
| 300 | *Advanced material.* Assumes 200-level knowledge, in-depth understanding of features in a real-world environment, and strong coding skills. Provides a detailed technical overview of a subset of product/technology features, covering architecture, performance, migration, deployment, and development. |
| 400 | *Expert material.* Assumes a deep level of technical knowledge and experience, and a detailed, thorough understanding of the topic. Provides expert-to-expert interaction and coverage of specialized topics. |

## Roles, resources, and readiness

Successfully delivering an Azure Synapse solution involves many different roles and skill sets. This topic describes roles commonly required to implement a successful project. Not all of these roles will be required for all projects, and not all of these roles will be required for the entire duration of the project. However, these roles will be required to complete some critical project tasks. You should evaluate the skill level of the individuals executing tasks to ensure their success in completing their job.

Refer to your [project plan](implementation-success-evaluate-project-plan.md) and verify that these resources and roles were identified. Also, check to see if your project plan identifies other resources and roles. In many cases, you may find that individuals belong to more than one role. For example, the Azure administrator could also be your Azure network administrator. It's also possible that a role in your organization is split between multiple individuals. For example, the Synapse administrator doesn't get involved in Synapse SQL security. In this case, adjust your evaluation accordingly.

Evaluate the following points.

- Identify the roles that will be required by your solution implementation.
- Identify the specific individuals in your project that will fulfill each role.
- Identify the specific project tasks that will be performed by each individual.
- Assign a [learning level](#microsoft-learning-leveldefinitions) to each individual for their tasks and roles.

Typically, a successful implementation requires that each individual has at least a level-300 proficiency for the tasks they'll perform. It's highly recommended that individuals at level-200 (or below) be provided with guidance and instruction to raise their level of understanding prior to beginning their project tasks. In this case, involve a level-300 (or above) individual to mentor and review. It's recommended that you adjust the project plan timeline and effort estimates to factor in learning new skills.

> [!NOTE]
> We recommend you align your roles with the built-in roles. There are two sets of built-in roles: [RBAC roles for Azure Synapse](../security/synapse-workspace-synapse-rbac-roles.md) and [RBAC roles built into Azure](../../role-based-access-control/built-in-roles.md). These two sets of built-in roles and permissions are independent.

### Azure administrator

The *Azure administrator* manages administrative aspects of Azure. They're responsible for subscriptions, region identification, resource groups, monitoring, and portal access. They also provision resources, like resource groups, storage accounts, Azure Data Factory (ADF), Microsoft Purview, and more.

### Security administrator

The *security administrator* must have local knowledge of the existing security landscape and requirements. This role collaborates with the [Synapse administrator](#synapse-administrator), [Synapse database administrator](#synapse-database-administrator), [Synapse Spark administrator](#synapse-spark-administrator), and other roles to set up security requirements. The security administrator could also be an Azure Active Directory (Azure AD) administrator.

### Network administrator

The *network administrator* must have local knowledge of the existing networking landscape and requirements. This role requires Azure networking skills and Synapse networking skills.

### Synapse administrator

The *Synapse administrator* is responsible for the administration of the overall Azure Synapse environment. This role is responsible for the availability and scale of workspace resources, data lake administration, analytics runtimes, and workspace administration and monitoring. This role works closely with all other roles to ensure access to Azure Synapse, the availability of analytics services, and sufficient scale. Other responsibilities include:

- Provision Synapse workspaces.
- Set up Azure Synapse networking and security requirements.
- Monitor Synapse workspace activity.

### Synapse database administrator

The *Synapse database administrator* is responsible for the design, implementation, maintenance, and operational aspects of the SQL pools (serverless and dedicated). This role is responsible for the overall availability, consistent performance, and optimizations of the SQL pools. This role is also responsible for managing the security of the data in the databases, granting privileges over the data, and granting or denying user access. Other responsibilities include:

- Perform various dedicated SQL pool administration functions, like provisioning, scale, pauses, resumes, restores, workload management, monitoring, and others.
- Perform various dedicated SQL pool administration functions, like securing, monitoring, and others.
- Set up SQL pool database security.
- Performance tuning and troubleshooting.

### Synapse Spark administrator

The *Synapse Spark administrator* is responsible for the design, implementation, maintenance, and operational aspects of the Spark pools. This role is responsible for the overall availability, consistent performance, and optimizations of the Spark pools. This role is also responsible for managing the security of the data, granting privileges over the data, and granting or denying user access. Other responsibilities include:

- Perform various dedicated Spark pool administration functions, like provisioning, monitoring, and others.
- Set up Spark pool data security.
- Notebook troubleshooting and performance.
- Pipeline Spark execution troubleshooting and performance.

### Synapse SQL pool database developer

The *Synapse pool database developer* is responsible for database design and development. For dedicated SQL pools, responsibilities include table structure and indexing, developing database objects, and schema design. For serverless SQL pools, responsibilities include external tables, views, and schema design. Other responsibilities include:

- Logical and physical database design.
- Table design, including distribution, indexing, and partitioning.
- Programming object design and development, including stored procedures and functions.
- Design and development of other performance optimizations, including materialized views, workload management, and more.
- Design and implementation of [data protection](security-white-paper-data-protection.md), including data encryption.
- Design and implementation of [access control](security-white-paper-access-control.md), including object-level security, row-level security, column-level security, dynamic data masking, and Synapse role-based access control.
- Monitoring, auditing, performance tuning and troubleshooting.

### Spark developer

The *Spark developer* is responsible for creating notebooks and executing Spark processing by using Spark pools.

### Data integration administrator

The *Data integration administrator* is responsible for setting up and securing data integration by using Synapse pipelines, ADF, or third-party integration tools, and for performing all configuration and security functions to support the data integration tools.

For Synapse pipelines and ADF, other responsibilities include setting up the integration runtime (IR), self-hosted integration runtime (SHIR), and/or SSIS integration runtime (SSIS-IR). Knowledge of virtual machine provisioning - on-premises or in Azure - may be required.

### Data integration developer

The *Data integration developer* is responsible for developing ETL/ELT and other data integration processes by using the solution's selected data integration tools.

### Data consumption tools administrator

The *Data consumption tools administrator* is responsible for the data consumption tools. Tools can include [Microsoft Power BI](https://powerbi.microsoft.com/), Microsoft Excel, Tableau, and others. The administrator of each tool will need to set up permissions to grant access to data in Azure Synapse.

### Data engineer

The *Data engineer* role is responsible for implementing data-related artifacts, including data ingestion pipelines, cleansing and transformation activities, and data stores for analytical workloads. It involves using a wide range of data platform technologies, including relational and non-relational databases, file stores, and data streams.

Data engineers are responsible for ensuring that the privacy of data is maintained within the cloud, and spanning from on-premises to the cloud data stores. They also own the management and monitoring of data stores and data pipelines to ensure that data loads perform as expected.

### Data scientist

The *Data scientist* derives value and insights from data. Data scientists find innovative ways to work with data and help teams achieve a rapid return on investment (ROI) on analytics efforts. They work with data curation and advanced search, matching, and recommendation algorithms. Data scientists need access to the highest quality data and substantial amounts of computing resources to extract deep insights.

### Data analyst

The *Data analyst* enables businesses to maximize the value of their data assets. They transform raw data into relevant insights based on identified business requirements. Data analysts are responsible for designing and building scalable data models, cleaning, and transforming data, and presenting advanced analytics in reports and visualizations.

### Azure DevOps engineer

The *Azure DevOps engineer* is responsible for designing and implementing strategies for collaboration, code, infrastructure, source control, security, compliance, continuous integration, testing, delivery, and monitoring of an Azure Synapse project.

## Learning resources and certifications

If you're interested to learn about Microsoft Certifications that may help assess your team's readiness, browse the available certifications for [Azure Synapse Analytics](/certifications/browse/?expanded=azure&products=azure-synapse-analytics).

To complete online, self-paced training, browse the available learning paths and modules for [Azure Synapse Analytics](/training/browse/?filter-products=synapse&products=azure-synapse-analytics).

## Next steps

In the [next article](implementation-success-perform-operational-readiness-review.md) in the *Azure Synapse success by design* series, learn how to perform an operational readiness review to evaluate your solution for its preparedness to provide optimal services to users.
