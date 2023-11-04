---
title: What is Azure Integration Environments?
description: An integration environment helps you organize, manage, and track Azure resources related to your integration solutions. You can provide business context about these resources and track key business data that moves through these resources.
ms.service: azure
ms.topic: overview
ms.reviewer: estfan, azla
ms.date: 11/15/2023
# CustomerIntent: As an integration developer, I want an easier way to logically organize, manage, and track Azure resources that implement my organization's integration solutions. As a business analyst or business SME, I want a way to visualize my organization's business processes and map them to the actual resources that implement those use cases. For our stakeholders, I also want to capture key business data that moves through these resources to gain better insight about how our solutions perform.
---

# What is Azure Integration Environments? (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't yet ready production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This cloud platform helps you organize, manage, and track Azure resources related to your integration solutions. In Azure, an integration environment reduces complexity by providing a central place for you to organize existing Azure resources into logical application groups.

For your stakeholders, this environment gives you a way to add business context about your application groups by modeling the business processes implemented by resources in these groups. For each business process stage, you define the key business data to capture from resources already in deployment, and map each stage to actual specific resources. This "single pane of view" offers a more streamlined and friendlier experience for managing and tracking the resources that support your integration solutions.

In this release, an integration environment offers the following capabilities as a unified experience in the Azure portal:

- [Central organization and management](#central-resource)

- [Business process design and tracking](#business-process-design-tracking)

<a name="central-resource"></a>

## Central organization and management

Your integration environment provides a common location in Azure for you to find, organize, manage, and track Azure resources associated with your integration solutions. In this environment, you create and use application groups to logically break down your environment even further. For example, an environment might have many application groups where each group serves a specific purpose such as payroll, order processing, employee onboarding, bank reconciliation, shipping notifications, and so on.

This model offers the flexibility for your organization to use integration environments based on your organization's conventions, standards, and principles. For example, some organizations might create integration environments based on business units or teams such as Finance, Marketing, Operations, Corporate Services, and so on. Others might create integration environments based on their infrastructure landscapes such as development, test, staging, user acceptance testing, and production. Regardless how your organization structures itself, integration environments provide the flexibility for your organization's needs.

For example, suppose you're an integration developer at a power company. You create an integration environment with application groups to organize Azure resources for the business scenarios to open a new customer account and resolve a customer ticket for a power outage:

:::image type="content" source="media/overview/integration-environment.png" alt-text="Screenshot shows Azure portal, integration environment resource, and application groups." lightbox="media/overview/integration-environment.png":::

<a name="supported-resources"></a>

### Supported Azure resources

The following table lists the currently supported Azure resources that you can add to application groups:

| Service | Resources |
|---------|-----------|
| Azure Logic Apps | Standard logic apps |
| Azure Service Bus | Queues and topics |
| Azure API Management | APIs |

For more information about other Azure resource types planned for support, see the [Azure Integration Environments preview announcement](https://aka.ms/azure-integration-environments).

<a name="business-process-design-tracking"></a>

## Business process design and tracking

> [!NOTE]
>
> In this release, business process design and tracking is available only 
> for Standard logic app resources and their workflows in Azure Logic Apps. 

Your integration environment provides a way for you to add business context about the transactions processed by Azure resources associated with your integration solutions. To describe this context, you define business processes and their stages using the process designer, and then map each stage to actual Azure resources. For your stakeholders, you can define key business data to capture and track as that data moves through the deployed resources. When you're done, you deploy each business process as a separate Azure resource along with a tracking profile that Azure adds to deployed resources. That way, you don't have to embed any tracking information in your resources and can decouple tracking from your solutions.

For example, suppose you're an integration developer at a power company. You manage a solution for a customer work order processor service that's implemented by multiple Standard logic app resources and their workflows. Your customer service team follows the following business process to resolve a customer ticket for a power outage:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

You already have an integration environment that includes an application group that logically organizes Azure resources for this business scenario. To expose some of this underlying information to stakeholders, you can visually define the supported business process and its stages by using the process designer in your integration environment, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows business process designer in the busines process tracking feature in an integration environment." lightbox="media/create-business-process/business-process-stages-complete.png":::

For each stage, you define or specify the properties for the key business data to capture. You then map these properties to selected operations in a Standard logic app workflow that handles this data. If you're familiar with Azure Logic Apps, you use a read-only version of the workflow designer to select the operation and dynamic content token for the data that you want to capture, for example:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions.png" alt-text="Screenshot shows read-only property mapper with selected workflow operation and source data.":::

When you're done, your stage and specified properties are mapped to the selected Standard logic app workflow, operation, and source data:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows process designer, Create ticket stage, and business properties mapped to Standard logic app workflow action and source data.":::

When your workflows run, they populate the properties that you specified.

## Next steps

[Create an integration environment](create-integration-environment.md)
