---
title: "Synapse implementation success methodology: Evaluate data integration design"
description: "Learn how to evaluate the data integration design and validate that it meets guidelines and requirements."
author: SnehaGunda
ms.author: sngun
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 05/31/2022
---

# Synapse implementation success methodology: Evaluate data integration design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Azure Synapse Analytics contains the same data integration engine and experiences as Azure Data Factory (ADF), allowing you to create rich at-scale ETL pipelines without leaving Azure Synapse Analytics.

:::image type="content" source="media/implementation-success-evaluate-data-integration-design/azure-synapse-analytics-architecture-data-integration.png" alt-text="Image shows the components of Azure Synapse, with the Data Integration component highlighted.":::

This article describes how to evaluate the design of the data integration components for your project. Specifically, it helps you to determine whether Azure Synapse pipelines are the best fit for your data integration requirements. Time invested in evaluating the design prior to solution development can help to eliminate unexpected design changes that may impact on your project timeline or cost.

## Fit gap analysis

You should perform a thorough fit gap analysis of your data integration strategy. If you choose Azure Synapse pipelines as the data integration tool, review the following points to ensure they're the best fit for your data integration requirements and orchestration. Even if you choose different data integration tools, you should still review the following points to validate that all key design points have been considered and that your chosen tool will support your solution needs. This information should have been captured during your assessment performed earlier in this methodology.

- Review your data sources and destinations (targets):
    - Validate that source and destination stores are [supported data stores](../../data-factory/connector-overview.md).
    - If they're not supported, check whether you can use the [extensible options](../../data-factory/connector-overview.md#integrate-with-more-data-stores).
- Review the triggering points of your data integration and the frequency:
    - Azure Synapse pipelines support schedule, tumbling window, and storage event triggers.
    - Validate the minimum recurrence interval and supported storage events against your requirements.
- Review the required modes of data integration:
    - Scheduled, periodic, and triggered batch processing can be effectively designed in Azure Synapse pipelines.
    - To implement Change Data Capture (CDC) functionality, use third-party products or create a custom solution.
    - To support real-time streaming, use [Azure Event Hubs](../../event-hubs/event-hubs-about.md), [Azure Event Hubs from Apache Kafka](../../event-hubs/event-hubs-for-kafka-ecosystem-overview.md), or [Azure IoT Hub](../../iot-hub/iot-concepts-and-iot-hub.md).
    - To run Microsoft SQL Server Integration Services (SSIS) packages, you can [lift and shift SSIS workloads to the cloud](/sql/integration-services/lift-shift/ssis-azure-lift-shift-ssis-packages-overview?view=sql-server-ver15&preserve-view=true).
- Review the compute design:
    - Does the compute required for the pipelines need to be serverless or provisioned?
    - Azure Synapse pipelines support both modes of integration runtime (IR): serverless or self-hosted on a Windows machine.
    - Validate [ports and firewalls](../../data-factory/create-self-hosted-integration-runtime.md?tabs=data-factory#ports-and-firewalls) and [proxy setting](../../data-factory/create-self-hosted-integration-runtime.md?tabs=data-factory#proxy-server-considerations) when using the self-hosted IR (provisioned).
- Review security requirements, networking and firewall configuration of the environment and compare them to the security, networking and firewall configuration design:
    - Review how the data sources are secured and networked.
    - Review how the target data stores are secured and networked. Azure Synapse pipelines have different [data access strategies](../../data-factory/data-access-strategies.md) that provide a secure way to connect data stores via private endpoints or virtual networks.
    - Use [Azure Key Vault](../../key-vault/general/basic-concepts.md) to store credentials whenever applicable.
    - Use ADF for customer-managed key (CMK) encryption of credentials and store them in the self-hosted IR.
- Review the design for ongoing monitoring of all data integration components.

## Architecture considerations

As you review the data integration design, consider the following recommendations and guidelines to ensure that the data integration components of your solution will provide ongoing operational excellence, performance efficiency, reliability, and security.

### Operational excellence

For operational excellence, evaluate the following points.

- **Environment:** When planning your environments, segregate them by development/test, user acceptance testing (UAT), and production. Use the folder organizational options to organize your pipelines and datasets by business/ETL jobs to support better maintainability. Use [annotations](https://azure.microsoft.com/resources/videos/azure-friday-enhanced-monitoring-capabilities-and-tagsannotations-in-azure-data-factory/) to tag your pipelines so you can easily monitor them. Create reusable pipelines by using parameters, and iteration and conditional activities.
- **Monitoring and alerting:** Synapse workspaces include the [Monitor Hub](../get-started-monitor.md), which has rich monitoring information of each and every pipeline run. It also integrates with [Log Analytics](../../azure-monitor/logs/log-analytics-overview.md) for further log analysis and alerting. You should implement these features to provide proactive error notifications. Also, use *Upon Failure* paths to implement customized [error handling](https://techcommunity.microsoft.com/t5/azure-data-factory/understanding-pipeline-failures-and-error-handling/ba-p/1630459).
- **Automated deployment and testing:** Azure Synapse pipelines are built into Synapse workspace, so you can take advantage of workspace automation and deployment. Use [ARM templates](../quickstart-deployment-template-workspaces.md) to minimize manual activities when creating Synapse workspaces. Also, [integrate Synapse workspaces with Azure DevOps](../cicd/continuous-integration-delivery.md#set-up-a-release-pipeline-in-azure-devops) to build code versioning and automate publication.

### Performance efficiency

For performance efficiency, evaluate the following points.

- Follow [performance guidance](../../data-factory/copy-activity-performance.md) and [optimization features](../../data-factory/copy-activity-performance-features.md) when working with the copy activity.
- Choose optimized connectors for data transfer instead of generic connectors. For example, use PolyBase instead of bulk insert when moving data from Azure Data Lake Storage Gen2 (ALDS Gen2) to a dedicated SQL pool.
- When creating a new Azure IR, set the region location as [auto-resolve](../../data-factory/concepts-integration-runtime.md#azure-ir-location) or select the same region as the data stores.
- For self-hosted IR, choose the [Azure virtual machine (VM) size](../../data-factory/copy-activity-performance-features.md#self-hosted-integration-runtime-scalability) based on the integration requirements.
- Choose a stable network connection, like [Azure ExpressRoute](../../expressroute/expressroute-introduction.md), for fast and consistent bandwidth.

### Reliability

When you execute a pipeline by using Azure IR, it's serverless in nature and so it provides resiliency out of the box. There's little for customers to manage. However, when a pipeline runs in a self-hosted IR, we recommend that you run it by using a [high availability configuration](../../data-factory/create-self-hosted-integration-runtime.md?tabs=data-factory#high-availability-and-scalability) in Azure VMs. This configuration ensures integration pipelines aren't broken even when a VM goes offline. Also, we recommend that you use Azure ExpressRoute for a fast and reliable network connection between on-premises and Azure.

### Security

A secured data platform is one of the key requirements of every organization. You should thoroughly plan security for the entire platform rather than individual components. Here are some security guidelines for Azure Synapse pipeline solutions.

- Secure data movement to the cloud by using [Azure Synapse private endpoints](https://techcommunity.microsoft.com/t5/azure-architecture-blog/understanding-azure-synapse-private-endpoints/ba-p/2281463).
- Use Microsoft Entra [managed identities](../../active-directory/managed-identities-azure-resources/overview.md) for authentication.
- Use Azure role-based access control (RBAC) and [Synapse RBAC](../security/synapse-workspace-synapse-rbac.md) for authorization.
- Store credentials, secrets, and keys in Azure Key Vault rather than in the pipeline. For more information, see [Use Azure Key Vault secrets in pipeline activities](../../data-factory/how-to-use-azure-key-vault-secrets-pipeline-activities.md).
- Connect to on-premises resources via Azure ExpressRoute or VPN over private endpoints.
- Enable the **Secure output** and **Secure input** options in pipeline activities when parameters store secrets or passwords.

## Next steps

In the [next article](implementation-success-evaluate-dedicated-sql-pool-design.md) in the *Azure Synapse success by design* series, learn how to evaluate your dedicated SQL pool design to identify issues and validate that it meets guidelines and requirements.
