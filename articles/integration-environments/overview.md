---
title: Overview
description: Centrally organize Azure resources for integration solutions. Model and map business processes to Azure resources. Collect business data from deployed solutions.
ms.service: azure
ms.topic: overview
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As a developer with a solution that has multiple or different Azure resources that integrate various services and systems, I want an easier way to logically organize, manage, and track Azure resources that implement my organization's integration solutions. As a business analyst or business SME, I want a way to visualize my organization's business processes and map them to the actual resources that implement those use cases. For our stakeholders, I also want to capture key business data that moves through these resources to gain better insight about how our solutions perform.
---

# What is Azure Integration Environments? (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't ready yet for production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

As a developer, when you work on solutions that integrate services and systems in the cloud, on premises, or both, you often have multiple or different Azure resources to implement your solutions. If you have many Azure resources across various solutions, you might struggle to find and manage these resources across the Azure portal and to keep these resources organized per solution.

Azure Integration Environments reduces this complexity by providing a central place in Azure where you can organize and manage the Azure resources by creating *integration environments*. For example, you might create integration environments based on your organization's business units, such as Finance or Operations. Or, you might create integration environments based on your infrastructure landscapes for development, test, staging, production, and so on. Inside an integration environment, you create application groups to further break down your environment and organize resources by logical function or purpose. For example, you might create application groups for employee onboarding, order processing, bank reconciliation, shipping notifications, and so on.

:::image type="content" source="media/overview/organize-conceptual.png" alt-text="Conceptual diagram that shows organizing separate Azure resources into an application group." lightbox="media/overview/organize-conceptual.png":::

To provide business information about an application group, business analysts can add flow charts that illustrate the business processes implemented by the Azure resources in each group. For insights about business data flowing through each stage in a business process, you define the key business properties to capture and track in deployed resources. You then map each stage and the business properties to actual Azure resources and data sources.

:::image type="content" source="media/overview/business-process.png" alt-text="Coceptual diagram that shows visualizing business flow as a business process that maps to Azure resources in an application group." lightbox="media/overview/business-process.png":::

For this release, an integration environment offers the following capabilities as a unified, "single-pane-of view" experience in the Azure portal:

- [Central organization and management](#central-resource)

- [Business process modeling and tracking](#business-process-modeling-tracking)

<a name="central-resource"></a>

## Central organization and management

Your integration environment provides a common location in Azure for you to organize, manage, and track Azure resources that implement your integration solutions. In this environment, you create and use application groups to logically break down your environment even further. For example, an environment might have many application groups where each group serves a specific purpose such as payroll, order processing, employee onboarding, bank reconciliation, shipping notifications, and so on.

This model offers the flexibility for your organization to use integration environments based on your organization's conventions, standards, and principles. For example, some organizations might create integration environments based on business units or teams such as Finance, Marketing, Operations, Corporate Services, and so on. Others might create integration environments based on their infrastructure landscapes such as development, test, staging, user acceptance testing, and production. Regardless how your organization structures itself, integration environments provide the flexibility for your organization's needs.

For example, suppose you're a developer who works on solutions that integrate various services and systems used at a power company. You create an integration environment that contains application groups for the Azure resources that implement the following scenarios:

| Scenario | Application group |
|----------|-------------------|
| Open a new customer account. | **CustomerService-NewAccount** |
| Resolve a customer ticket for a power outage. | **CustomerService-PowerOutage** |

:::image type="content" source="media/overview/integration-environment.png" alt-text="Screenshot shows Azure portal, integration environment resource, and application groups." lightbox="media/overview/integration-environment.png":::

Inside the **CustomerService-PowerOutage** application group, you have the following Azure resources:

:::image type="content" source="media/overview/application-group.png" alt-text="Screenshot shows Azure portal, integration environment resource, and an application group with Azure resources." lightbox="media/overview/application-group.png":::

Each expanded Azure resource shows the following components:

:::image type="content" source="media/overview/resource-components.png" alt-text="Screenshot shows Azure portal, each Azure resource and their components." lightbox="media/overview/resource-components.png":::

<a name="supported-resources"></a>

### Supported Azure resources

The following table lists the currently supported Azure resources that you can add to application groups:

| Service | Resources |
|---------|-----------|
| Azure Logic Apps | Standard logic apps |
| Azure Service Bus | Queues and topics |
| Azure API Management | APIs |

For more information about other Azure resource types planned for support, see the [Azure Integration Environments preview announcement](https://aka.ms/azure-integration-environments).

<a name="business-process-modeling-tracking"></a>

## Business process modeling and tracking

> [!NOTE]
>
> In this release, business process modeling and tracking is available only 
> for Standard logic app resources and their workflows in Azure Logic Apps.

Your integration environment provides a way to add business context about the Azure resources that implement your integration solutions. To visually describe this context, you model the business processes and their stages using the process designer, and then map each stage to the actual resources. For your stakeholders, you can define the key business data to capture and track as that data moves through the deployed resources. When you're done, you deploy each business process as a separate Azure resource along with a tracking profile that Azure adds to your resources. That way, you decouple the business process model from your implementation and don't have to embed any tracking information in your solutions.

For example, suppose you're a business analyst at a power company, and you're on a team that works on solutions that integrate various services and systems used by your organization. Your team manages a solution for a work order processor service that's implemented by multiple Standard logic apps and their workflows. Your customer service team follows the following business process to resolve a customer ticket for a power outage:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

You create an integration environment, which includes an application group that logically organizes Azure resources for this business scenario. To share some underlying information with stakeholders, you visually model the business processes and stages implemented by the application group using the process designer, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process designer for business process modeling in an application group." lightbox="media/create-business-process/business-process-stages-complete.png":::

For each business process stage, you specify the key business data properties that your organization wants to track. You then map each stage to the corresponding operation in a Standard logic app workflow and map the properties to operation outputs that provide the necessary data. If you're familiar with Azure Logic Apps, you use a read-only version of the workflow designer to select the operation and dynamic content token for the data that you want to capture. For example, on the following page, you map the business properties from the **Create_ticket** stage to operation outputs in a Standard logic app workflow:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions.png" alt-text="Screenshot shows read-only property mapper with selected workflow operation and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions.png":::

When you're done, your business process stage and properties map to the corresponding Standard logic app workflow, operation, and source data. When your workflows run, they populate the specified business properties.

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows process designer, Create ticket stage, and business properties mapped to Standard logic app workflow action and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions-complete.png":::

## Limitations and known issues

- Business process modeling, tracking, and deployment are currently available only in the Azure portal. No capability currently exists to export and import tracking profiles.

- This preview release currently doesn't include application monitoring.

- Stateless workflows in a Standard logic app resource currently aren't supported for business process tracking.

  If you have business scenarios or use cases that require stateless workflows, use the product feedback link to share these scenarios and use cases. 

- This preview release is currently optimized for speed.

  If you have feedback about workload performance, use the product feedback link to share your input and results from representative loads to help improve this aspect.

## Next steps

[Create an integration environment](create-integration-environment.md)
