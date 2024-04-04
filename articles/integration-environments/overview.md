---
title: Overview
description: Centrally organize Azure resources for integration solutions. Model and map business processes to Azure resources. Collect business data from deployed solutions.
ms.service: integration-environments
ms.topic: overview
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As a developer with a solution that has multiple or different Azure resources that integrate various services and systems, I want an easier way to logically organize, manage, and track Azure resources that implement my organization's integration solutions. As a business analyst or business SME, I want a way to visualize my organization's business processes and map them to the actual resources that implement those use cases. For our business, I also want to capture key business data that moves through these resources to gain better insight about how our solutions perform.
---

# What is Azure Integration Environments? (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

As a developer who works on solutions that integrate services and systems in the cloud, on premises, or both, you often have multiple or different Azure resources to implement your solutions. If you have many Azure resources across various solutions, you might struggle to find and manage these resources across the Azure portal and to keep these resources organized per solution.

Azure Integration Environments simplifies this complexity by providing a central area in the Azure portal where you can create *integration environments* to help you organize and manage your deployed Azure resources. Within an integration environment, you create application groups to further arrange resources into smaller collections.

For example, your integration environments might be based on your organization's business units, such as Operations, Customer Service, or Finance. Or, your environments might be based on your infrastructure landscapes for development, test, staging, and production. Your application groups might be based on a specific business or customer scenario, such as employee onboarding, order processing, bank reconciliation, shipping notifications, and so on.

The following diagram shows how you can organize Azure resources from various Azure services into one or more application groups, based on business or customer scenarios:

:::image type="content" source="media/overview/organize-conceptual.png" alt-text="Conceptual diagram that shows organizing separate Azure resources into application groups based on business or customer scenario." lightbox="media/overview/organize-conceptual.png":::

For more information, see [Central organization and management](#central-resource).

As a business analyst, you can include business information about an application group by adding flow charts that show the business processes and stages implemented by the Azure resources in each group. For each business process, you provide a business identifier, such as an order number, case number, or ticket number, for a transaction that's available across all the business stages to correlate these stages together. To get insights about business data flowing through each stage in a business process, you define the key business properties to capture and track in deployed resources. You then map each business stage, the specified business properties, and the business identifier to actual Azure resources and data sources.

The following diagram shows how you can represent a real-world business flow as a business process in an application group, and map each stage in the business process to the Azure resources in the same application group:

:::image type="content" source="media/overview/business-process.png" alt-text="Conceptual diagram that shows a real-world business flow visualized as a business process that maps to Azure resources in an application group." lightbox="media/overview/business-process.png":::

For more information, see [Business process design and tracking](#business-process-design-tracking).

<a name="central-resource"></a>

## Central organization and management

In Azure, an integration environment gives you a centralized way to organize the Azure resources used by your development team to build solutions that integrate the services and systems used by your organization. At the next level in your integration environment, application groups provide a way to sort resources into smaller collections based on specific business scenarios. For example, an integration environment can have many application groups where each group serves a specific purpose such as payroll, order processing, employee onboarding, bank reconciliation, shipping notifications, and so on.

This architecture offers the flexibility for you to create and use integration environments based on your organization's conventions, standards, and principles. For example, you can have integration environments that are based on business units or teams such as Operations, Customer Service, Marketing, Finance, HR, Corporate Services, and so on. Or, you might have integration environments based on infrastructure landscapes such as development, test, staging, user acceptance testing, and production. Regardless how your organization structures itself, integration environments provide the flexibility to meet your organization's needs.

Suppose you're a developer who works on solutions that integrate various services and systems used at a power company. You create an integration environment that contains application groups for the Azure resources that implement the following business scenarios:

| Business scenario | Application group |
|-------------------|-------------------|
| Open a new customer account. | **CustomerService-NewAccount** |
| Resolve a customer ticket for a power outage. | **CustomerService-PowerOutage** |

:::image type="content" source="media/overview/integration-environment.png" alt-text="Screenshot shows Azure portal, integration environment resource, and application groups." lightbox="media/overview/integration-environment.png":::

The **CustomerService-PowerOutage** application group includes following Azure resources:

:::image type="content" source="media/overview/application-group.png" alt-text="Screenshot shows Azure portal, integration environment resource, and an application group with Azure resources." lightbox="media/overview/application-group.png":::

Each expanded Azure resource includes the following components:

:::image type="content" source="media/overview/resource-components.png" alt-text="Screenshot shows Azure portal, each Azure resource and their components." lightbox="media/overview/resource-components.png":::

To get started, see [Create an integration environment](create-integration-environment.md).

<a name="supported-resources"></a>

### Supported Azure resources

The following table lists the currently supported Azure resources that you can include in an application group during this release:

| Azure service | Resources |
|---------------|-----------|
| Azure Logic Apps | Standard logic apps |
| Azure Service Bus | Queues and topics |
| Azure API Management | APIs |

For more information about other Azure resource types planned for support, see the [Azure Integration Environments preview announcement](https://aka.ms/azure-integration-environments).

<a name="business-process-design-tracking"></a>

## Business process design and tracking

> [!NOTE]
>
> In this release, business process tracking is available only for 
> Standard logic app resources and their workflows in Azure Logic Apps.

After you create an integration environment and at least one application group, you or a business analyst can use the process designer to create flow charts that visually describe the business processes implemented by the Azure resources in an application group. A business process is a sequence of stages that show the flow through a real-world business scenario. This business process also specifies a single business identifer, such as an order number, ticket number, or case number, to identify a transaction that's available across all the stages in the business process and to correlate those stages together.

To evaluate how key business data moves through deployed resources and to capture and return that data from these resources, you can define the key business properties to track in each business process stage. You can then map each stage, business properties, and the business identifier to actual Azure resources and data sources in the same application group.

When you're done, you deploy each business process as a separate Azure resource along with an individual tracking profile that Azure adds to the deployed resources. That way, you can decouple the business process design from your implementation and don't have to embed any tracking information inside your code, resources, or solution.

Suppose you're a business analyst at a power company, and you work with a developer team that creates solutions to integrate various services and systems used by your organization. Your team is updating a solution for a work order processor service that's implemented by multiple Standard logic apps and their workflows. To resolve a customer ticket for a power outage, the following diagram shows the business flow that the company's customer service team follows:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

To organize and manage the deployed Azure resources that are used by the work order processor service, the lead developer on your team creates an integration environment and an application group that includes the resources for the processor service. Now, you can make the relationship more concrete between the processor service implementation and the real-world power outage business flow. The application group provides a process designer for you to create a business process that visualizes the business flow and to map the stages in the process to the resources that implement the work order processor service.

> [!NOTE]
>
> When you create a business process, you must specify a business identifer for a transaction 
> that's available across all the stages in the business process to correlate these stages together. 
> For example, a business identifier can be an order number, ticket number, case number, and so on.
>
> :::image type="content" source="media/overview/create-business-process.png" alt-text="Screenshot shows business processes page with opened pane to create a business process with a business identifier." lightbox="media/overview/create-business-process.png":::

For example, the following business process visualizes the power outage business flow and its stages:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process designer for business process flow chart in an application group." lightbox="media/create-business-process/business-process-stages-complete.png":::

When you create each stage, you specify the key business data property values to capture and track. For example, the **Create_ticket** stage defines the following business property values for tracking in your deployed resources:

:::image type="content" source="media/overview/define-business-properties-tracking.png" alt-text="Screenshot shows Edit stage pane with specified business properties to capture and track." lightbox="media/overview/define-business-properties-tracking.png":::

Next, you map each stage to the corresponding operation in a Standard logic app workflow and map the properties to the workflow operation outputs that provide the necessary data. If you're familiar with [Azure Logic Apps](../logic-apps/logic-apps-overview.md), you use a read-only version of the workflow designer to select the operation and the dynamic content tokens that represent the operation outputs that you want.

For example, the following screenshot shows the following items:

- The read-only workflow designer for the Standard logic app resource and workflow in Azure Logic Apps
- The selected workflow operation named **Send message**
- The business properties for the **Create_ticket** stage with mappings to selected outputs from operations in the Standard logic app workflow
- The **TicketNumber** business identifier, which is mapped to an operation output named **TicketNumber** in the workflow

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions.png" alt-text="Screenshot shows read-only property mapper with selected workflow operation and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions.png":::

When you're done, your business process stage and properties are now mapped to the corresponding Standard logic app workflow, operation, and outputs to use as data sources. Now, when your workflows run in the deployed logic apps, the workflows populate the business properties that you specified:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows process designer, Create ticket stage, and business properties mapped to Standard logic app workflow action and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions-complete.png":::

To get started after you set up an integration environment and application groups, see [Create business process](create-business-process.md).

## Pricing information

Azure Integration Environments doesn't incur charges during preview. However, when you create an application group, you're required to provide information for an existing or new [Azure Data Explorer cluster and database](/azure/data-explorer/create-cluster-and-database). Your application group uses this database to store specific business property values that you want to capture and track for business process tracking scenarios. After you create a business process in your application group, specify the key business properties to capture and track as data moves through deployed resources, map these properties to actual Azure resources, and deploy your business process, you specify a database table to create or use for storing the desired data.

Azure Data Explorer incurs charges, based on the selected pricing option. For more information, see [Azure Data Explorer pricing](https://azure.microsoft.com/pricing/details/data-explorer/#pricing).

## Limitations and known issues

- Business process design, tracking, and deployment are currently available only in the Azure portal. No capability currently exists to export and import tracking profiles.

- This preview release currently doesn't include application monitoring.

- Stateless workflows in a Standard logic app resource currently aren't supported for business process tracking.

  If you have business scenarios or use cases that require stateless workflows, use the product feedback link to share these scenarios and use cases. 

- This preview release is currently optimized for speed.

  If you have feedback about workload performance, use the product feedback link to share your input and results from representative loads to help improve this aspect.

## Next steps

[Create an integration environment](create-integration-environment.md)
