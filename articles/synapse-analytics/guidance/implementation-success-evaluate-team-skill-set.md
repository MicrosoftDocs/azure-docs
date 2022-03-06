---
title: Evaluate team skill set
description: TODO (team-skillset-evaluation)
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Evaluate team skill set

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Solution development will require a variety of resources possessing a variety of skills. It will be very important for the success of your solution that these resources have the necessary skills to successfully complete the tasks assigned. The following evaluation will take an honest and critical look at the skill level of your project resources and provide you with a list of roles that are commonly needed during the implementation of a solution incorporating Azure Synapse. Resources will need to possess the appropriate experience and level of skill in the appropriate technology to complete their assigned project tasks within the time frame expected and meet the quality bar required for your project's success.

## Microsoft standard level definitions

For this evaluation we will use the standard Microsoft Level of understanding definitions for evaluation of individual skill levels.

### Level 100 (L100)

Introductory and overview material. Assumes little or no expertise with topic and covers topic concepts, functions, features, and benefits.

### Level 200 (L200)

Intermediate material. Assumes 100-level knowledge and provides specific details about the topic.

### Level 300 (L300)

Advanced material. Assumes 200-level knowledge, in-depth understanding of features in a real-world environment, and strong coding skills. Provides a detailed technical overview of a subset of product/technology features, covering architecture, performance, migration, deployment, and development.

### Level 400 (L400)

Expert material. Assumes a deep level of technical knowledge and experience and a detailed, thorough understanding of the topic. Provides expert-to-expert interaction and coverage of specialized topics.

## Roles, resources, and readiness

There are multiple roles and skillsets needed for a successful Azure Synapse implementation.

Here is a set of roles commonly required to implement a successful project that incorporates Azure Synapse. Not all of the roles identified will be required for all projects and not all of the roles identified will be required for the full duration of the project, however, they will be needed to complete some critical project tasks and the skill level of the individual(s) executing on the task needs to be evaluated to assure their success in completing their task. Please refer to your project plan and verify that these resources/roles have been identified in the effort and cost and see if your project plan identifies additional resources/roles. In many cases you may find that a single individual works in more than one of the roles listed below (Example: your Azure Administrator is also your Azure Network Administrator) or that a role in your organization is split between multiple people (Example: Your Synapse Administrator does not do the Synapse SQL Security) so adjust your evaluation accordingly.

Using the roles below, you project plan and you assessment information:

- Identify the roles that will be required by your solution implementation
- Identify the specific individuals in your project that will fulfill each role
- Identify the specific project tasks that will be performed by the individual
- Assign each individual a Level of Understanding as described in the above section for the assigned tasks and role(s)

For the best chance of a successful implementation, each individual working in each role should be at least a L300 for the project tasks to be performed. It is strongly recommended that individuals at L200 or below be provided the necessary guidance and instruction to raise their level of understanding prior to beginning their project tasks or that a L300 or higher individual is identified to assist, as necessary. It is recommended that a reasonable amount of time to learn any new skill and ramp-up on a skill be considered in the project plan timeline and effort estimates.

### Azure administrator

Manages administrative aspects of Azure - Subscriptions, Region Identification, Resource Groups, Azure Monitoring, Portal Access, provisioning of resources (Resource Groups, Storage Accounts, Azure Data Factory, Azure Purview, Etc.)

### Security administrator

Collaborates with Synapse Workspace admin, Synapse Database Admin, Synapse Spark Admin, and others to configure security to align with security requirements.

Azure Active Directory (AAD) Admin

Local knowledge of the existing security landscape and requirements

### Network administrator

Azure Networking skills

Synapse Networking Skills

Local knowledge of the existing enterprise networking environment and requirements

### Synapse workspace administrator/Synapse administrator

A Synapse Administrator is responsible for the administration of the overall Azure Synapse environment. They are responsible for the availability and scale of Workspace resources, Data Lake administration, Analytics Pools, Workspace administration and monitoring.

The Azure Synapse Administrator will work closely with all roles to ensure Synapse access, Analytics services availability, and scale.

Some activities include:

- Provisions Synapse Workspaces
- Configures Synapse Networking and Security configuration
- Monitors activity Synapse Workspaces

### Synapse database administrator

A Synapse database administrator is responsible for the design, implementation, maintenance, and operational aspects of the Synapse SQL Pools (Serverless and Dedicated). This administrator is responsible for the overall availability and consistent performance and optimizations of the Synapse Pools.

The database administrator is also responsible for managing the security of the data in the databases, granting privileges over the data, granting, or denying access to users as appropriate.

Some activities include:

- Performs admin functions (Provisions, scales, pauses, resumes, restores, workload management, monitoring, etc.) for dedicated SQL Pools
- Performs admin functions (securing, monitoring, etc.) for serverless SQL Pools
- Configures SQL Pool database security
- Performance Tuning and Troubleshooting

### Synapse Spark administrator

A Synapse Spark administrator is responsible for the design, implementation, maintenance, and operational aspects of the Synapse Spark Pools. This administrator is responsible for the overall availability and consistent performance and optimizations for the Synapse Spark Pools.

The Spark administrator is also responsible for managing the security of the data, granting privileges over the data, granting, or denying access to users as appropriate.

Some activities include:

- Performs Spark Pool admin functions (provisions, monitors, etc.) for Spark pools
- Security of data and pools
- Notebook troubleshooting and performance
- Pipeline Spark execution troubleshooting and performance

### Synapse SQL pool database developer

Database design and development (table structure and indexing, developing database objects, Schema design, logical and physical database design) for dedicated SQL Pools.

Database design and development (External table access, views, schema design) for serverless SQL Pools

Some activities include:

- Logical and Physical database design
- Table design including distribution, indexing, and partitioning
- Programming object design and development (stored procedures, functions)
- Design and development of additional performance optimizations (Materialized Views, Workload Management, Etc.)
- Design and implementation of security features (Dynamic Data Masking, Row Level Security, Column Level Security, Encryption, Etc.)
- Monitoring, Auditing, Performance Tuning and Troubleshooting

### Spark developer

Some activities include:

- Creates Notebooks and executes Spark processing using Synapse Spark Pools

### Data integration admin 

(Synapse Pipelines, ADF (Azure Data Factory), 3rd party integration tools)

Performs all the configuration and security functions to support your data integration tool(s)

For ADF or Azure Pipelines this will include configuration of Integration Runtime (IR), Shared Integration Runtime (SHIR), and/or SSIS Integration Runtime (SSIS-IR). Knowledge of VM provisioning and configuration on-prem and in Azure may be required, review your design and project plan.

### Data integration developer

Develop ETL/ELT and other data integration processes using the solution's selected data integration tool(s)

### Data consumption tool(s) admin

PowerBI, Tableau, Excel, Custom applications, etc. - all the data consumption tools that are part of your solution and accessing your data. You will need an Admin for each tool to complete some of your project tasks. Including configuration and security for the tool to access data in Synapse and Azure.

### Data engineer

A data engineer designs and implements data-related assets that include data ingestion pipelines, cleansing and transformation activities, and data stores for analytical workloads. They use a wide range of data platform technologies, including relational and nonrelational databases, file stores, and data streams.

They are also responsible for ensuring that the privacy of data is maintained within the cloud and spanning from on-premises to the cloud data stores. They also own the management and monitoring of data stores and data pipelines to ensure that data loads perform as expected.

### Data scientist

Data scientists are necessary to derive value and insight from data. Data scientists find innovative ways to work with data and help teams achieve a rapid ROI on analytics efforts using methods including data curation or advanced search, matching, and recommendation algorithms. Data scientists need access to the highest quality of data and substantial amounts of computing resources to extract deeper insights.

### Data analyst

Data analyst enables businesses to maximize the value of their data assets. They are responsible for designing and building scalable models, cleaning, and transforming data, and enabling advanced analytics capabilities through reports and visualizations.

A data analyst processes raw data into relevant insights based on identified business requirements to deliver relevant insights.

### Azure DevOps engineer

An Azure DevOps Engineer is responsible for designing and implementing strategies for collaboration, code, infrastructure, source control, security, compliance, continuous integration, testing, delivery, monitoring of an Azure Synapse project.

In addition to the above list of roles you may wish to also review the built-in [RBAC roles for Azure Synapse](../security/synapse-workspace-synapse-rbac-roles.md) and the [RBAC roles built into Azure](../../role-based-access-control/built-in-roles.md) to align your list of roles to those within Azure and Azure Synapse. Be aware that these are two independent sets of RBAC roles and permissions.


## Learning resources and certifications

If you are interested in Microsoft Certifications that may help assess your team's readiness browse the available certifications for [Azure](/learn/certifications/browse/?expanded=azure&products=azure-synapse-analytics) and [Synapse](/learn/certifications/browse/?expanded=azure&products=azure-synapse-analytics) at Microsoft Learn.

For some materials to improve your teams readiness browse the available Azure Synapse Analytics Learning Paths [here](/learn/browse/?expanded=azure&products=azure-synapse-analytics&resource_type=learning%20path) on Microsoft Learn.

## Conclusion

All team members play a key role during a Synapse Analytics project weather they are full time for the duration of the project or only needed to perform one or two tasks. Identifying the project resources and evaluating their readiness is an important task for a successful Synapse Analytics Project. If you do not have skilled members, secure additional members, or skill-up team members.

## Next steps

TODO
