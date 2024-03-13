---
title: "Synapse implementation success methodology: Evaluate workspace design"
description: "Learn how to evaluate the Synapse workspace design and validate that it meets guidelines and requirements."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate workspace design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Synapse workspace is a unified graphical user experience that stitches together your analytical and data processing engines, data lakes, databases, tables, datasets, and reporting artifacts along with code and process orchestration. Considering the number of technologies and services that are integrated into Synapse workspace, ensure that the key components are included in your design.

## Synapse workspace design review

Identify whether your solution design involves one Synapse workspace or multiple workspaces. Determine the drivers of this design. While there might be different reasons, in most cases the reason for multiple workspaces is either security segregation or billing segregation. When determining the number of workspaces and database boundaries, keep in mind that there's a limit of 20 workspaces per subscription.

Identify which elements or services within each workspace need to be shared and with which resources. Resources can include data lakes, integration runtimes (IRs), metadata or configurations, and code. Determine why this particular design was chosen in terms of potential synergies. Ask yourself whether these synergies justify the extra cost and management overhead.

## Data lake design review

We recommended that the data lake (if part of your solution) be properly tiered. You should divide your data lake into three major areas that relate to *Bronze*, *Silver*, and *Gold* datasets. Bronze - or the raw layer - might reside on its own separate storage account because it has stricter access controls due to unmasked sensitive data that it might store.

## Security design review

Review the security design for the workspace and compare it with the information you gathered during the assessment. Ensure all of the requirements are met, and all of the constraints have been taken into account. For ease of management, we recommended that users be organized into groups with appropriate permissions profiling: you can simplify access control by using security groups that align with roles. That way, network administrators can add or remove users from appropriate security groups to manage access.

Serverless SQL pools and Apache Spark tables store their data in an Azure Data Lake Gen2 (ADLS Gen2) container that's associated with the workspace. User-installed Apache Spark libraries are also managed in this same storage account. To enable these use cases, both users and the workspace managed service identity (MSI) must be added to the **Storage Blob Data Contributor** role of the ADLS Gen2 storage container. Verify this requirement against your security requirements.

Dedicated SQL pools provide a rich set of security features to encrypt and mask sensitive data. Both dedicated and serverless SQL pools enable the full surface area of SQL Server permissions including built-in roles, user-defined roles, SQL authentication, and Microsoft Entra authentication. Review the security design for your solution's dedicated SQL pool and serverless SQL pool access and data.

Review the security plan for your data lake and all the ADLS Gen2 storage accounts (and others) that will form part of your Azure Synapse Analytics solution. ADLS Gen2 storage isn't itself a compute engine and so it doesn't have a built-in ability to selectively mask data attributes. You can apply ADLS Gen2 permissions at the storage account or container level by using role-based access control (RBAC) and/or at the folder or file level by using access control lists (ACLs). Review the design carefully and strive to avoid unnecessary complexity.

Here are some points to consider for the security design.

- Make sure Microsoft Entra ID set up requirements are included in the design.
- Check for cross-tenant scenarios. Such issues may arise because some data is in another Azure tenant, or it needs to move to another tenant, or it needs to be accessed by users from another tenant. Ensure these scenarios are considered in your design.
- What are the roles for each workspace? How will they use the workspace?
- How is the security designed within the workspace?
    - Who can view all scripts, notebooks, and pipelines?
    - Who can execute scripts and pipelines?
    - Who can create/pause/resume SQL and Spark pools?
    - Who can publish changes to the workspace?
    - Who can commit changes to source control?
- Will pipelines access data by using stored credentials or the workspace managed identity?
- Do users have the appropriate access to the data lake to browse the data in Synapse Studio?
- Is the data lake properly secured by using the appropriate combination of RBAC and ACLs?
- Have the SQL pool user permissions been correctly set for each role (data scientist, developer, administrator, business user, and others)?

## Networking design review

Here are some points to consider for the network design.

- Is connectivity designed between all the resources?
- What is the networking mechanism to be used (Azure ExpressRoute, public Internet, or private endpoints)?
- Do you need to be able to securely connect to Synapse Studio?
- Has data exfiltration been taken into consideration?
- Do you need to connect to on-premises data sources?
- Do you need to connect to other cloud data sources or compute engines, such as Azure Machine Learning?
- Have Azure networking components, like network security groups (NSGs), been reviewed for proper connectivity and data movement?
- Has integration with the private DNS zones been taken into consideration?
- Do you need to be able to browse the data lake from within Synapse Studio or simply query data in the data lake with serverless SQL or PolyBase?

Finally, identify all of your data consumers and verify that their connectivity is accounted for in the design. Check that network and security outposts allow your service to access required on-premises sources and that its authentication protocols and mechanisms are supported. In some scenarios, you might need to have more than one self-hosted IR or data gateway for SaaS solutions, like Microsoft Power BI.

## Monitoring design review

Review the design of the monitoring of the Azure Synapse components to ensure they meet the requirements and expectations identified during the assessment. Verify that monitoring of resources and data access has been designed, and that it identifies each monitoring requirement. A robust monitoring solution should be put in place as part of the first deployment to production. That way, failures can be identified, diagnosed, and addressed in a timely manner. Aside from the base infrastructure and pipeline runs, data should also be monitored. Depending on the Azure Synapse components in use, identify the monitoring requirements for each component. For example, if Spark pools form part of the solution, monitor the malformed record store. 

Here are some points to consider for the monitoring design.

- Who can monitor each resource type (pipelines, pools, and others)?
- How long do database activity logs need to be retained?
- Will workspace and database log retention use Log Analytics or Azure Storage?
- Will alerts be triggered in the event of a pipeline error? If so, who should be notified?
- What threshold level of a SQL pool should trigger an alert? Who should be notified?

## Source control design review

By default, a Synapse workspace applies changes directly to the Synapse service by using the built-in publish functionality. You can enable source control integration, which provides many advantages. Advantages include better collaboration, versioning, approvals, and release pipelines to promote changes through to development, test, and production environments. Azure Synapse allows a single source control repository per workspace, which can be either Azure DevOps Git or GitHub.

Here are some points to consider for the source control design.

- If using Azure DevOps Git, is the Synapse workspace and its repository in the same tenant?
- Who will be able to access source control?
- What permissions will each user be granted in source control?
- Has a branching and merging strategy been developed?
- Will release pipelines be developed for deployment to different environments?
- Will an approval process be used for merging and for release pipelines?

> [!NOTE]
> The design of the development environment is of critical importance to the success of your project. If a development environment has been designed, it will be evaluated in a [separate stage of this methodology](implementation-success-evaluate-solution-development-environment-design.md).

## Next steps

In the [next article](implementation-success-evaluate-data-integration-design.md) in the *Azure Synapse success by design* series, learn how to evaluate the data integration design and validate that it meets guidelines and requirements.
