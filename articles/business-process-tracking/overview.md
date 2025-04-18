---
title: "Overview - Azure Business Process Tracking"
description: Learn why modeling and mapping business processes help add business context to Azure resources in your integration solution.
ms.service: azure-business-process-tracking
ms.topic: overview
ms.reviewer: estfan, azla
ms.date: 06/07/2024

# CustomerIntent: As a developer or business analyst with a solution that has multiple or different Azure resources that integrate various services and systems, I want a way to visualize my organization's business processes and map them to the actual Azure resources that implement those use cases. For our business, I also want to record key business data that moves through these resources to gain better insight about how our solutions perform.
---

# What is Azure Business Process Tracking? (Preview)

> [!NOTE]
>
> This capability is in preview and is subject to the 
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

As a developer or business analyst working on solutions that integrate services and systems using various Azure resources, you might have difficulties visualizing the relationship between the technical components in your solution and your business scenario. To include business context about the Azure resources in your solution, you can build business processes that visually represent the business logic implemented by these resources. In Azure Business Process Tracking, a business process is a series of stages that represent the tasks flowing through real-world business scenario.

For example, suppose you're a developer or business analyst at a power company, and you work on a team that creates integration solutions. Your team is updating a solution for a work order processor service that's implemented by multiple Standard logic apps and their workflows. Your company's customer service team uses the following business process to resolve a customer ticket for a power outage:

:::image type="content" source="media/create-business-process/business-process-stages-example.png" alt-text="Conceptual diagram shows example power outage business process stages for customer service at a power company." lightbox="media/create-business-process/business-process-stages-example.png":::

Architecturally, the following diagram shows how you can represent a business scenario as a business process with multiple stages, which you can map to actual Azure resources in your integration solution:

:::image type="content" source="media/overview/business-process.png" alt-text="Conceptual diagram shows relationship between business scenario, business process, and Azure resources." lightbox="media/overview/business-process.png":::

This capability lets you decouple the business process design from your implementation. You also don't have to embed any tracking information inside your code, resources, or solution.

<a name="business-process-design"></a>

## Business process design and tracking

When you create a **Business Process** resource in Azure, you define a single business identifier or *transaction ID*, such as an order number, case number, or ticket number, to identify a transaction that exists across all business process stages so you can correlate these stages and data together.

:::image type="content" source="media/overview/define-transaction-id.png" alt-text="Screenshot shows Azure portal, the page named Create a business process page, and transaction ID details." lightbox="media/overview/define-transaction-id.png":::

After you create your resource, you can use the process editor to design the stages in your business process, for example:

:::image type="content" source="media/create-business-process/business-process-stages-complete.png" alt-text="Screenshot shows process editor with business process stages." lightbox="media/create-business-process/business-process-stages-complete.png":::

To capture business data from each stage as real-time data flows through deployed Azure resources at run time, you can specify other key business property values that you want to record and store. When you create a stage, you define these business properties and their data sources. For example, the **Create_ticket** stage defines the following business property values to record from deployed Azure resources:

:::image type="content" source="media/overview/define-business-properties.png" alt-text="Screenshot shows Edit stage pane with specified business properties to capture and track." lightbox="media/overview/define-business-properties.png":::

As soon as you finish a stage, you can map the transaction ID and business properties to the corresponding operation that provides the expected outputs in a Standard logic app workflow. If you're familiar with [Azure Logic Apps](../logic-apps/logic-apps-overview.md), you use a read-only version of the workflow designer to select the operation and the dynamic content tokens that represent the operation outputs that you want. This mapping makes a more concrete relationship between the processor service implementation and the real-world power outage business flow.

For example, the following screenshot shows the following items:

- The read-only workflow designer for the Standard logic app resource and workflow in Azure Logic Apps.
- The selected workflow operation named **Send message**.
- The **TicketNumber** transaction ID, which is mapped to an operation output named **TicketNumber** in the workflow.
- The business properties for the **Create_ticket** stage with mappings to selected outputs from operations in the Standard logic app workflow.

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions.png" alt-text="Screenshot shows read-only property mapper with selected workflow operation and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions.png":::

The following screenshot shows a completely mapped stage:

:::image type="content" source="media/map-business-process-workflow/map-properties-workflow-actions-complete.png" alt-text="Screenshot shows process designer, Create ticket stage, and business properties mapped to Standard logic app workflow action and source data." lightbox="media/map-business-process-workflow/map-properties-workflow-actions-complete.png":::

After you finish your mappings and save your business process, you can deploy the business process as a separate Azure resource along with an individual tracking profile that is added to your deployed resources. When the associated workflows run in the deployed logic apps, these workflows populate the business property values that you specified. You can then review each recorded transaction plus the business process status for each stage in that transaction:

:::image type="content" source="media/deploy-business-process/process-status.png" alt-text="Screenshot shows Transactions page and status for entire business process." lightbox="media/deploy-business-process/process-status.png":::

You can also review the recorded business property values for each stage in a transaction:

:::image type="content" source="media/deploy-business-process/transaction-details.png" alt-text="Screenshot shows the details for a specific transaction in a business process." lightbox="media/deploy-business-process/transaction-details.png":::

To help you organize and manage the deployed Azure resources that you use in your solution, you can also create an [integration environment and application groups](../integration-environments/overview.md), which you can then link to existing business processes. To get started, see [Create an integration environment](../integration-environments/create-integration-environment.md).

## Limitations and known issues

- Business process design, tracking, and deployment are currently available only in the Azure portal. No capability currently exists to export and import tracking profiles.

- Business process mapping and tracking currently support only Standard logic app resources and stateful workflows in Azure Logic Apps. Stateless workflows currently aren't supported.

  If you have business scenarios or use cases that require stateless workflows, use the product feedback link to share these scenarios and use cases. 

- This preview release is currently optimized for speed.

  If you have feedback about workload reliability or performance, use the product feedback link to share your input and results from representative workloads to help improve this aspect.

## Pricing information

Azure Business Process Tracking doesn't incur charges during preview. However, when you create a business process, you're required to provide information for an existing or new [Azure Data Explorer cluster, database, and table](/azure/data-explorer/create-cluster-and-database). Your business process uses this database to store transactions and the business property values that you want to record for later evaluation. Azure Data Explorer incurs charges, based on the selected pricing option. For more information, see [Azure Data Explorer pricing](https://azure.microsoft.com/pricing/details/data-explorer/#pricing).

## Related content

> [!div class="nextstepaction"]
> [Create a business process](create-business-process.md)
