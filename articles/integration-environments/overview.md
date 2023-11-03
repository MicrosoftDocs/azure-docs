---
title: What is Azure Integration Environments?
description: An integration environment helps you organize, manage, and track Azure resources related to your integration solutions. You can provide business context about these resources and track key business data that moves through these resources.
ms.service: azure
ms.topic: overview
ms.reviewer: estfan, azla
ms.date: 11/15/2023
---

# What is Azure Integration Environments? (preview)

> [!IMPORTANT]
>
> This capability is in public preview and isn't yet ready production use. For more information, see the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

This cloud platform helps you organize, manage, and track Azure resources related to your integration solutions. An integration environment reduces complexity by providing a central place in Azure for you to organize existing Azure resources into logical application groups. This "single pane of view" offers a more streamlined and friendlier experience for managing and tracking your solutions' resources.

In this release, an integration environment offers the following capabilities as a unified experience in the Azure portal:

- [Central organization and management](#central-resource)

- [Business process design and tracking](#business-process-design-tracking)

<a name="central-resource"></a>

## Central organization and management

Your integration environment provides a common location in Azure for you to find, organize, manage, and track Azure resources associated with your integration solutions. In this environment, you create and use application groups to logically break down your environment even further. For example, an environment might have many application groups where each group serves a specific purpose such as payroll, order processing, employee onboarding, bank reconciliation, shipping notifications, and so on.

This model offers the flexibility for your organization to use integration environments based on your organization's conventions, standards, and principles. For example, some organizations might create integration environments based on business units or teams such as Finance, Marketing, Operations, Corporate Services, and so on. Others might create integration environments based on their infrastructure landscapes such as development, test, staging, user acceptance testing, and production. Regardless how your organization structures itself, integration environments provide the flexibility for your organization's needs.

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

Your integration environment provides a way for you to add business context about the transactions processed by Azure resources associated with your integration solutions. To describe this context, you define business process stages using the process designer, and then map these stages to actual Azure resources. Along with this task, you can define the key business data to capture and track when that information moves through your resources. 

That way, you don't have to embed any tracking information in your resources and can decouple tracking from your solutions.

For example, suppose you have an customer support work order processing service that spans multiple Standard logic app resources and their workflows. To expose some of this underlying information to stakeholders, you define a sequence of business process stages. For each stage, you define properties for the key business data that you want capture and track. You map these properties to selected operations in the workflows that have this data, which then populates the properties that you defined. If you're familiar with Azure Logic Apps, you use a read-only version of the workflow designer to select the operation and dynamic content token for the data that you want to capture.

In an integration environment, you can also add business context to your application groups by completing the following tasks:

- Model your organization's business processes.
- Define key business data that your organization wants to capture from deployed resources.
- Map your business processes to the actual resources that implement the business logic.

When you're done, you deploy each business process as an Azure resource along with a tracking profile for your resources. 

## Next steps

[Create an integration environment](create-integration-environment.md)
