---
title: Evaluate data integration design
description: "TODO: Evaluate data integration design"
author: peter-myers
ms.author: v-petermyers
ms.reviewer: sngun
ms.service: synapse-analytics
ms.topic: conceptual
ms.date: 02/28/2022
---

# Evaluate data integration design

[!INCLUDE [implementation-success-context](includes/implementation-success-context.md)]

Azure Synapse Analytics is a complete analytics platform where business can choose one of three analytics runtimes (Apache Spark, Serverless SQL or Dedicated SQL Pool) for converting raw data into meaningful insights. It has a robust built-in data integration module called [Synapse Pipeline](../overview-what-is.md#built-in-data-integration) for building effective, scalable and secured data pipelines.

:::image type="content" source="media/implementation-success-evaluate-data-integration-design/data-integration-design-evaluation.png" alt-text="Image shows - TODO.":::

In this guide we will evaluate the design of the Data Integration components of your project. Upon conclusion we will be able to determine if Synapse Pipelines are the best fit for your data integration use cases and we will have checked that all the key aspects of the design have been considered. Time invested in evaluating the design prior to solution development will help to eliminate unexpected design changes that may impact your project timeline or cost.

## Design review

### Fit-gap analysis

You need to do a thorough fit-gap analysis of the data integration strategy. If the design has chosen Synapse Pipelines as one of the data integration tools to be used in the solution, review the following points to make sure Synapse Pipeline is the best tool for data integrations and orchestration. Some of the key aspects identified below need to be assessed in your environment. If another data integration tool or tools have been specified in the solution design the following points should still be reviewed to validate that these key design points have been considered and the chosen tool will support you solution's needs. This information should have been captured during your assessment performed earlier in this method.

- Review your data sources and destinations (targets)
    - Validate source and destination store are [supported data stores](../../data-factory/connector-overview.md)
    - If not supported, check if you can leverage the [extensible options](../../data-factory/connector-overview.md#integrate-with-more-data-stores) of pipeline
- Review the triggering points of your data integration and the frequency
    - Synapse pipeline supports schedule, tumbling window and storage event triggers
    - Validate minimum recurrence interval and supported storage events against your requirement
- Review the modes of data integration required
    - Scheduled, periodic and triggered batch processing can be effectively designed in Synapse pipelines
    - To support Change Data Capture capabilities, leverage third party products or create a custom solution
    - To support real-time streaming, leverage Event Hub/Kafka/IoT Hub
    - To support Lift-and-Shift of SSIS packages, leverage [Azure Data Factory SSIS-IR](../../data-factory/tutorial-deploy-ssis-packages-azure.md)
- Review the compute design. Does the compute required for the pipelines need to be serverless or provisioned?
    - Synapse pipeline supports both modes where integration runtime can be serverless or self-hosted on a windows machine
    - Validate [ports and firewall](../../data-factory/create-self-hosted-integration-runtime.md#ports-and-firewalls) and [proxy setting](../../data-factory/create-self-hosted-integration-runtime.md#proxy-server-considerations) in case of self-hosted IR (provisioned)
- Review the security requirements, networking, and firewall configuration of the environment and compare to the security, networking and firewall configuration design.
    - Review how the data sources are secured and networked
    - Review how the target data stores are secured and networked
    - Synapse pipeline has different [data access](../../data-factory/ data-access-strategies.md#data-access-strategies-through-azure-data-factory) strategies to provide a secured way to connect data stores via private endpoints/VNET/Firewall/Internet
    - Use Azure key-vault to store credentials whenever applicable
    - Leverage Azure Data factory for customer managed key (CMK) encryption or encryption credentials and store in self-hosted IR
- Review the design for ongoing monitoring of the data integration components

### Architecture Considerations

As you review the data integration design consider the following recommendations and guidelines to ensure that the data integration components of your solution will provide ongoing operational excellence, performance efficiency, reliability and security.

#### Operational Excellence

**Environment:** When planning for environments, segregate it by dev/test, UAT, and Production. Having a clean and working lower environment (with working data connections and pipelines) makes development and support streamlined and smooth.\ Leverage the Folder organizational options to organize your pipelines and datasets by business/ETL jobs for better maintainability. Use [Annotations](https://azure.microsoft.com/resources/videos/azure-friday-enhanced-monitoring-capabilities-and-tagsannotations-in-azure-data-factory/) to tag your pipelines which later can be used in monitoring.\
Leverage parameters and Iterations/Conditionals activities to create re-usable pipelines.

**Monitoring and alerting:** Synapse workspace includes [Monitor hub](../get-started-monitor.md) which has rich monitoring information of each and every pipeline run. It also integrates with Log Analytics for further log analysis and alerting. These features should be implemented to provide proactive error notifications. Leverage "Failure" branch for implementing user-defined [error handling](https://techcommunity.microsoft.com/t5/azure-data-factory/understanding-pipeline-failures-and-error-handling/ba-p/1630459).

**Automated deployment and testing:** Synapse pipeline is built into Synapse workspace, so you can take advantage of Workspace automation/deployment. Minimize manual activities while creating Synapse workspaces across environments by using [ARM templates](../quickstart-deployment-template-workspaces.md). Integrate Synapse workspaces with Azure DevOps to build code versioning and automated publication.

#### Performance efficiency

There are multiple factors that impact performance of pipeline execution. Some of the key points are.

- Follow [performance guide](../../data-factory/copy-activity-performance.md) and [optimization features](../../data-factory/copy-activity-performance-features.md) when working with the Copy activity
- Choose optimized connectors for data transfer instead of generic ones. For example, PolyBase instead of bulk insert when moving data from ADLS Gen2 to Dedicated SQL pool
- When creating a new Azure IR, pick the region as [Auto Resolve](../../data-factory/concepts-integration-runtime.md#azure-ir-location) or select the same region as the data stores
- For Self-hosted IR, choose the [Azure VM size](../../data-factory/copy-activity-performance-features.md#self-hosted-integration-runtime-scalability) based on the integration requirements
- Choose a stable network connection like Azure ExpressRoute for fast and consistent bandwidth

#### Reliability

**Availability:** When you are executing a pipeline using Azure IR, it is serverless in nature and provides resiliency out of the box. There is little for customers to manage. But when a pipeline is running in a self-hosted IR, it is recommended to run using a [HA configuration](../../data-factory/create-self-hosted-integration-runtime.md#high-availability-and-scalability) using Azure VMs. This will ensure integration pipelines are not broken even when a VM goes down. Secondly, it is recommended to have Azure ExpressRoute for a fast and reliable network connection between on-premises and Azure.

#### Security

A secured data platform is one of the key requirements of every organization. A lot of thought needs to be given to overall security of the platform rather than individual components. Here are some security guidelines for Azure Synapse Pipeline solutions.

- Secure data movement to cloud using [Azure Synapse private endpoints](https://techcommunity.microsoft.com/t5/azure-architecture-blog/understanding-azure-synapse-private-endpoints/ba-p/2281463)
- Use AAD/MSI for authentication and Azure RBAC and [Synapse RBAC](../security/synapse-workspace-synapse-rbac.md) for authorization
- Store credentials, secrets and keys in Azure Key Vault rather than in pipeline ([link](../../data-factory/how-to-use-azure-key-vault-secrets-pipeline-activities.md))
- Integrate on-premises via Azure ExpressRoute or VPN over private endpoints.
- Enable Secure input/output in pipeline activities for parameters storing secrets/passwords

## Conclusion

Upon completion of this review of the data integration design of your solution you should know if the data integration tool(s) selected for your implementation will meet all the requirements of your organization and you will have taken the time to consider and validate that many important guidelines and recommendations have been reviewed and applied to your data integration design. Prior to solution development is the best time to make design modifications to better meet your solution needs and will improve the overall success of your solution and your project.

## Next steps

TODO
