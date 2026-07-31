---
title: Review MongoDB assessment properties
description: Explains how to assess MongoDB workloads in Azure Migrate, including key components, readiness evaluation, and migration planning.
author: sandeepsnairms
ms.author: sandnair
ms.service: azure-migrate 
ms.topic: tutorial
ms.date: 04/28/2026
ms.custom: engagement-fy24 
# Customer intent: Customers want to assess on-premises MongoDB workloads using Azure Migrate to prepare for migration to Azure DocumentDB. They aim to evaluate cloud readiness, risks, and costs through configuration-based assessments.
---

# Tutorial: Review MongoDB assessment properties (preview)

This article describes what you can review in a MongoDB assessment in Azure Migrate, including readiness, target recommendations, and estimated costs.

The MongoDB assessment in Azure Migrate helps you plan your migration to Azure by evaluating readiness and sizing based on the machine parameters of the servers hosting your MongoDB workloads. It analyzes CPU, memory, storage, and performance utilization to recommend a right-sized Azure target and estimate monthly costs. 
 
Azure Migrate evaluates the following migration paths for MongoDB workloads: 
- Azure DocumentDB – For modernizing to a fully managed, MongoDB-compatible database service with built-in high availability and elastic scaling. 
- MongoDB on Azure Virtual Machines – For lift-and-shift migrations where you retain full control over the MongoDB engine and the operating system. 

In the current preview, the assessment does not evaluate MongoDB instance-level readiness. It doesn’t assess database versions, configuration settings, query or operator compatibility, replica set or sharding design, or other instance-specific migration blockers. 

> [!IMPORTANT]
> This preview assesses readiness and sizing only from the machine parameters of the servers that host MongoDB workloads.

## Prerequisites

Before you begin, ensure you’ve reviewed MongoDB workloads and have created a MongoDB assessment.

## View an assessment

To view an assessment, follow these steps:

1. Go to **Assessment**, and then select **View all** reports under **Overview**. Alternatively, under **Decide and plan**, select **Assessments**.
2. Select the assessment you want to view, for example, azmigrate-demo.

    :::image type="content" source="./media/tutorial-review-mongodb-properties/select-assessment.png" alt-text="Screenshot shows how to select the assessment." lightbox="./media/tutorial-review-mongodb-properties/select-assessment.png":::
3. Review the summary of the assessment. You can also edit the assessment settings or recalculate the assessment.

## Assessed workloads

This section provides a summary of the assessment, including the following metrics:

- **Servers**: Total number of servers assessed.
- **MongoDB instances**: Number of MongoDB instances discovered.
- **Databases**: Total number of databases across all instances.
- **Out of support**: Number of instances running unsupported MongoDB versions.
- **Discovery success**: Percentage of successful discovery operations.

## MongoDB migration

This section helps you compare migration strategies by showing readiness and cost estimates for each target option.

## Recommended target

Azure DocumentDB provides the best compatibility and cost-effectiveness for your MongoDB instance. Choosing a Microsoft-recommended target reduces migration effort.

The recommended option is both cost-effective and migration ready. It includes readiness checks and monthly cost estimates for instances marked as **Ready** or **Ready with conditions**.

You can view the readiness of MongoDB instances for recommended deployment targets, along with monthly cost estimates for instances marked as Ready or Ready with conditions.

Readiness report:

The readiness report helps you:
- Review the recommended configurations for migrating to Azure DocumentDB.
- Understand migration issues and warnings you can resolve before moving to the recommended Azure targets.
- Review the monthly cost of each MongoDB instance based on compute and storage.

### Migration strategies

- **Migrate all instances to Azure DocumentDB**: This strategy provides readiness insights and cost estimates for migrating all MongoDB instances to Azure DocumentDB.
- **Migrate all servers to MongoDB Server on Azure VM**: Provides readiness and cost estimates for rehosting the servers that run MongoDB. If credentials aren't available, the report bases recommendations on the server configuration and aligns with the Azure VM assessment methodology.

## Support status of assessed MongoDB instances

The **Supportability** section shows the support status of the MongoDB versions identified during the assessment. The Discovery Details section provides a visual summary of the number of discovered MongoDB instances, categorized by version.

- To view the list of assessed MongoDB instances, select the graph in the **Supportability**.
- The **Database instance version support status** column indicates whether the MongoDB version is in mainstream support or out of support.
- To view detailed support information, select the support status. A pane opens on the right and shows the following details:

    - Type of support status (Mainstream or Out of support)
    - Remaining support duration
    - Recommended actions to help secure workloads.
- To view the remaining support duration (in months) for each MongoDB version:

    - Select **Columns** &gt; **Support ends in** &gt; **Submit**.
    - The **Support ends in** column shows the number of months remaining for support.
- Support status categories:

    - **Mainstream support**: The MongoDB version is actively supported and receives regular updates.
    - **Extended support**: The MongoDB version receives critical fixes and security updates but no new features
    - **Out of support**: The MongoDB version no longer receives updates and should be upgraded to a supported version.

    > [!NOTE]
    > MongoDB instances running unsupported versions should be prioritized for migration to maintain security compliance and ensure continued support in Azure.

## Review readiness

Use readiness reports to identify migration issues and review recommendations for each target option.

:::image type="content" source="./media/tutorial-review-mongodb-properties/review-readiness-for-diff-migrations.png" alt-text="Screenshot shows how to review the readiness for different migrations." lightbox="./media/tutorial-review-mongodb-properties/review-readiness-for-diff-migrations.png":::

To review readiness reports for different migration strategies, follow these steps:

1. Select the **Readiness report** for the desired migration strategy.
2. Review the readiness columns in the selected report to assess migration preparedness.

    | **Migration strategy** | **Readiness Columns (Respective deployment target)** |
    | --- | --- |
    | Recommended | Azure DocumentDB readiness |
    | Instances to Azure DocumentDB | Azure DocumentDB readiness |
    | Servers to MongoDB Server on Azure VM | Azure VM readiness (MongoDB Server on Azure VM) |
3. Review the readiness status for assessed MongoDB instances:

    - **Ready**: The instance can be migrated to Azure DocumentDB without any migration issues.
    - **Ready with conditions**: The instance has one or more migration issues. Select the hyperlink to view the identified issues and recommended remediation steps.
    - **Not ready**: The assessment didn't find a target configuration that meets the required performance and configuration. Select the link to view recommendations.
    - **Unknown**: Azure Migrate can't assess readiness because discovery is in progress or needs attention. Check Notifications for details and resolve discovery issues.

4. To view detailed information for a specific instance, select the instance name to drill down into the following details:

    - Number of user databases
    - Instance properties
    - Configuration parameters scoped to the instance
    - Source database storage details

    >[!IMPORTANT]
    > If you don't provide MongoDB credentials, or if the Azure Migrate appliance can't connect to the instance, SKU recommendations are based on server configuration. In this case, readiness might be shown as Ready with conditions. Provide credentials with sufficient permissions to enable more complete assessment rules and sizing.

5. To view the list of user databases and their details, select the number of user databases.
6. To review migration issues and warnings for a specific target deployment type, select **Review details** in the **Migration issues** column.
7. Cost distribution by configuration: The assessment shows how costs are distributed across various Azure DocumentDB configurations:

    - Costs are calculated based on the recommended service tier and compute size.
    - Each instance receives a specific SKU recommendation based on its configuration requirements.
    - Recommended configurations vary depending on the workload characteristics of each instance.
8. Instance-level cost details: To view cost details for a specific MongoDB instance, select the instance name in the table. The following information is displayed:

    - **Total monthly cost**: Combined compute and storage cost for the instance.
    - **Monthly compute cost**: Cost based on the recommended compute configuration.
    - **Monthly storage cost**: Cost based on the allocated storage capacity.
    - **Recommended configuration**: Specific SKU recommendation based on assessment analysis.
    - **Cost variations**: Reflect differences in resource requirements across instances.
    
## Related content

- [MongoDB workloads for Migration to Azure](tutorial-assess-MongoDB.md).