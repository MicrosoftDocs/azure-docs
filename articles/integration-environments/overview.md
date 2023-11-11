---
title: Overview
description: Centrally organize Azure resources for integration solutions. Model and map business processes to Azure resources. Collect business data from deployed solutions.
ms.service: azure
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

As a developer, when you work on solutions that integrate services and systems in the cloud, on premises, or both, you often have multiple or different Azure resources to implement your solutions. If you have many Azure resources across various solutions, you might struggle to find and manage these resources across the Azure portal and to keep these resources organized per solution.

Azure Integration Environments reduces this complexity by providing a central place in Azure where you can organize and manage the Azure resources by creating *integration environments*. For example, you might create integration environments based on your organization's business units, such as Finance or Operations. Or, you might create integration environments based on your infrastructure landscapes for development, test, staging, production, and so on. Inside an integration environment, you create application groups to further organize resources into smaller collections by business function or purpose. For example, you might create application groups for employee onboarding, order processing, bank reconciliation, shipping notifications, and so on. For more information, see [Central organization and management](#central-resource).

:::image type="content" source="media/overview/organize-conceptual.png" alt-text="Conceptual diagram that shows organizing separate Azure resources into an application group." lightbox="media/overview/organize-conceptual.png":::

To provide business information about an application group, business analysts can add flow charts that illustrate the business processes implemented by the Azure resources in each group. For insights about business data flowing through each stage in a business process, you define the key business properties to capture and track in deployed resources. You then map each stage and the business properties to actual Azure resources and data sources. For more information, see [Business process design and tracking](#business-process-design-tracking).

:::image type="content" source="media/overview/business-process.png" alt-text="Coceptual diagram that shows visualizing business flow as a business process that maps to Azure resources in an application group." lightbox="media/overview/business-process.png":::

For this release, an integration environment offers the following capabilities as a unified, "single-pane-of view" experience in the Azure portal:

- [Central organization and management](#central-resource)

- [Business process design and tracking](#business-process-design-tracking)

<a name="central-resource"></a>

## Central organization and management

In Azure, integration environment gives you a centralized way to organize and manage the Azure resources that your development team uses to implement solutions that integrate the services and systems used by your organization. At the next level in an integration environment, application groups provide a way to organize resources into smaller collections based on their business scenarios. For example, an integration environment can have many application groups where each group serves a specific purpose such as payroll, order processing, employee onboarding, bank reconciliation, shipping notifications, and so on.

This architecture offers the flexibility for you to use integration environments based on your organization's conventions, standards, and principles. For example, your organization might create integration environments based on business units or teams such as Finance, Marketing, Operations, Corporate Services, and so on. Or, your organization might create integration environments based on infrastructure landscapes such as development, test, staging, user acceptance testing, and production. Regardless how your organization structures itself, integration environments provide the flexibility to meet your organization's needs.

For example, suppose you're a developer who works on solutions that integrate various services and systems used at a power company. You create an integration environment that contains application groups for the Azure resources that implement the following business scenarios:

| Business scenario | Application group |
|-------------------|-------------------|
| Open a new customer account. | **CustomerService-NewAccount** |
| Resolve a customer ticket for a power outage. | **CustomerService-PowerOutage** |

:::image type="content" source="media/overview/integration-environment.png" alt-text="Screenshot shows Azure portal, integration environment resource, and application groups." lightbox="media/overview/integration-environment.png":::

The **CustomerService-PowerOutage** application group includes following Azure resources:

:::image type="content" source="media/overview/application-group.png" alt-text="Screenshot shows Azure portal, integration environment resource, and an application group with Azure resources." lightbox="media/overview/application-group.png":::

Each expanded Azure resource includes the following components:

:::image type="content" source="media/overview/resource-components.png" alt-text="Screenshot shows Azure portal, each Azure resource and their components." lightbox="media/overview/resource-components.png":::

<a name="supported-resources"></a>

### Supported Azure resources

The following table lists the currently supported Azure resources that you can include in an application group:

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

In an integration environment, application groups provide a designer that business analysts can use to create flow charts that describe the business processes supported by the Azure resources in an application group. A business process consists of phases or stages that you can individually map to actual Azure resources and data sources in an application group. To evaluate how key business data moves through deployed resources or to capture and return that data from these resources, you can define the key business properties to track in each business process stage.

When you're done, you deploy each business process as a separate Azure resource along with an individual tracking profile that Azure adds to the deployed resources. That way, you can decouple the business process design from your implementation and don't have to embed any tracking information inside your code, resources, or solution.

For example, suppose you're a business analyst at a power company, and you work with a developer team that creates solutions to integrate various services and systems used by your organization. Your team is updating a solution for a work order processor service that's implemented by multiple Standard logic apps and their workflows. To resolve a customer ticket for a power outage, the company's customer service team follows this business process:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

To organize the already deployed Azure resources used by the work order processor service, the lead developer creates an integration environment and an application group that includes the resources for this solution. To relate the power outage business process to the work order processor's implementation, you use the process designer in the application group to create a flow chart that visually describes the business process and its stages, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process designer for business process flow chart in an application group." lightbox="media/create-business-process/business-process-stages-complete.png":::

For each stage, you specify the key business data property values to capture and track.

For example, the **Create_ticket** stage defines the following business property values for tracking:

:::image type="content" source="media/overview/define-business-properties-tracking.png" alt-text="Screenshot shows Edit stage pane with specified business properties to capture and track." lightbox="media/overview/define-business-properties-tracking.png":::

Next, you map each stage to the corresponding operation in a Standard logic app workflow and map the properties to the workflow operation outputs that provide the necessary data. If you're familiar with Azure Logic Apps, you use a read-only version of the workflow designer to select the operation and the dynamic content tokens that represent the operation outputs that you want.

For example, the following screenshot shows the read-only workflow designer, the selected workflow operation, and mappings between previously specified business properties for the **Create_ticket** stage and the selected outputs from operations in a Standard logic app workflow:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions.png" alt-text="Screenshot shows read-only property mapper with selected workflow operation and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions.png":::

When you're done, your business process stage and properties are mapped to the corresponding Standard logic app workflow, operation, and outputs to use as data sources. When your workflows run, they populate the specified business properties:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows process designer, Create ticket stage, and business properties mapped to Standard logic app workflow action and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions-complete.png":::

## Limitations and known issues

- Business process design, tracking, and deployment are currently available only in the Azure portal. No capability currently exists to export and import tracking profiles.

- This preview release currently doesn't include application monitoring.

- Stateless workflows in a Standard logic app resource currently aren't supported for business process tracking.

  If you have business scenarios or use cases that require stateless workflows, use the product feedback link to share these scenarios and use cases. 

- This preview release is currently optimized for speed.

  If you have feedback about workload performance, use the product feedback link to share your input and results from representative loads to help improve this aspect.

## Next steps

[Create an integration environment](create-integration-environment.md)
