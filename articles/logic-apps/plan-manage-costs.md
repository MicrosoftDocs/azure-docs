---
title: Plan to manage costs for Azure Logic Apps
description: Learn how to plan for and manage costs for Azure Logic Apps by using cost analysis in the Azure portal.
ms.service: logic-apps
ms.reviewer: estfan, azla
ms.topic: how-to
ms.custom: subject-cost-optimization
ms.date: 08/20/2022

# Note for Azure service writer: Links to Cost Management articles are full URLS with the ?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn campaign suffix. Leave those URLs intact. They're used to measure traffic to Cost Management articles. 
---

# Plan and manage costs for Azure Logic Apps

[!INCLUDE [logic-apps-sku-consumption-standard](../../includes/logic-apps-sku-consumption-standard.md)]

This article helps you plan and manage costs for Azure Logic Apps. Before you create or add any resources using this service, estimate your costs by using the Azure pricing calculator. After you start using Logic Apps resources, you can set budgets and monitor costs by using [Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To identify areas where you might want to act, you can also review forecasted costs and monitor spending trends.

Keep in mind that costs for Logic Apps are only part of the monthly costs in your Azure bill. Although this article explains how to estimate and manage costs for Logic Apps, you're billed for all the Azure services and resources that are used in your Azure subscription, including any third-party services. After you're familiar with managing costs for Logic Apps, you can apply similar methods to manage costs for all the Azure services used in your subscription.

## Prerequisites

<!--Note for Azure service writer: This section covers prerequisites for the Cost Management's Cost Analysis feature. Add other prerequisites needed for your service after the Cost Management prerequisites. -->

[Azure Cost Management](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) supports most Azure account types. To view all the supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for your Azure account.

For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

<!--Note for Azure service writer: If you have other prerequisites for your service, add them here -->

<a name="understand-billing-model"></a>

## Understand the billing model

Azure Logic Apps runs on Azure infrastructure that [accrues costs](https://azure.microsoft.com/pricing/details/logic-apps/) when you deploy new resources. Make sure that you understand the [billing model for the Logic Apps service along with related Azure resources](logic-apps-pricing.md), and manage costs due to these dependencies when you make changes to deployed resources.

<a name="typical-costs"></a>

### Costs that typically accrue with Azure Logic Apps

The Azure Logic Apps service applies different pricing models, based on the resources that you create and use:

* Logic app resources that you create and run in multi-tenant Azure Logic Apps use a [consumption (pay-for-use) pricing model](../logic-apps/logic-apps-pricing.md#consumption-pricing).

* Logic app resources that you create and run in single-tenant Azure Logic Apps use a [hosting plan pricing model](../logic-apps/logic-apps-pricing.md#standard-pricing).

* Logic app resources that you create and run in an [integration service environment (ISE)](../logic-apps/connect-virtual-network-vnet-isolated-environment-overview.md) use the [ISE pricing model](../logic-apps/logic-apps-pricing.md#ise-pricing).

Here are other resources that incur costs when you create them for use with logic apps:

* An [integration account](../logic-apps/logic-apps-pricing.md#integration-accounts) is a separate resource that you create and link to logic apps for building B2B integrations. Integration accounts use a [fixed pricing model](../logic-apps/logic-apps-pricing.md#integration-accounts) where the rate is based on the integration account type or *tier* that you use.

* An [ISE](../logic-apps/logic-apps-pricing.md#ise-pricing) is a separate resource that you create as a deployment location for logic apps that need direct access to resources in a virtual network. ISEs use the [ISE pricing model](../logic-apps/logic-apps-pricing.md#ise-pricing) where the rate is based on the ISE SKU that you create and other settings. However, data retention and storage consumption don't incur costs.

* A [custom connector](../logic-apps/logic-apps-pricing.md#consumption-pricing) is a separate resource that you create for a REST API that has no prebuilt connector for you to use in your logic apps. Custom connector executions use a [consumption pricing model](../logic-apps/logic-apps-pricing.md#consumption-pricing) except when you use them in an ISE.

<a name="storage-operations-costs"></a>

#### Storage operations and costs

Azure Logic Apps uses [Azure Storage](../storage/index.yml) for any storage operations. With multi-tenant Azure Logic Apps, any storage usage and costs are attached to the logic app. [Data retention and storage consumption](../logic-apps/logic-apps-pricing.md#storage-operations) accrue costs using a [fixed pricing model](../logic-apps/logic-apps-pricing.md#storage-operations). For example, inputs and outputs from run history are kept in behind-the-scenes storage, which differs from storage resources that you independently create, manage, and access from your logic app.

With single-tenant Azure Logic Apps, you can use your own Azure [storage account](../azure-functions/storage-considerations.md#storage-account-requirements). This capability gives you more control and flexibility with your Logic Apps data. When *stateful* workflows run their operations, the Azure Logic Apps runtime makes storage transactions. For example, queues are used for scheduling, while tables and blobs are used for storing workflow states. Storage costs change based on your workflow's content. Different triggers, actions, and payloads result in different storage operations and needs. Storage transactions follow the [Azure Storage pricing model](https://azure.microsoft.com/pricing/details/storage/). Storage costs are separately listed in your Azure billing invoice.

For single-tenant Azure Logic Apps, you can get some idea about the number of storage operations that a workflow might run and their cost by using the [Logic Apps Storage calculator](https://logicapps.azure.com/calculator). You can either select a sample workflow or use an existing workflow definition. The first calculation estimates the number of storage operations in your workflow. You can then use these numbers to estimate possible costs using the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/). For more information, review [Estimate storage needs and costs for workflows in single-tenant Azure Logic Apps](estimate-storage-costs.md).

<a name="costs-after-resource-deletion"></a>

### Costs might accrue after resource deletion

<!--Note to Azure service writer: You might need to sync with your product team to identify resources that continue to exist after those ones for your service are deleted. If you're certain that no resources can exist after those for your service are deleted, then omit this section. -->

After you delete a logic app, the Logic Apps service won't create or run new workflow instances. However, all in-progress and pending runs continue until they finish. Depending on the number of these runs, this process might take some time. For more information, see [Manage logic apps](manage-logic-apps-with-azure-portal.md#delete-logic-apps).

If you have these resources after deleting a logic app, these resources continue to exist and accrue costs until you delete them:

* Azure resources that you create and manage independently from the logic app that connects to those resources, for example, Azure function apps, event hubs, event grids, and so on

* Integration accounts

* Integration service environments (ISEs)

  If you [delete an ISE](ise-manage-integration-service-environment.md#delete-ise), the associated Azure virtual network, subnets, and other related resources continue to exist. After you delete the ISE, you might have to wait up to a specific number of hours before you can try deleting the virtual network or subnets.

### Using Monetary Credit with Azure Logic Apps

You can pay for Azure Logic Apps charges with your EA monetary commitment credit. However, you can't use EA monetary commitment credit to pay for charges for third-party products and services, including those from the Azure Marketplace.

<a name="estimate-costs"></a>

## Estimate costs

Before you create resources with Azure Logic Apps, estimate your costs by using the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/). For more information, review [Pricing model for Azure Logic Apps](../logic-apps/logic-apps-pricing.md).

1. On the [Azure pricing calculator page](https://azure.microsoft.com/pricing/calculator/), from the left menu, select **Integration** > **Azure Logic Apps**.

   ![Screenshot that shows the Azure pricing calculator with "Azure Logic Apps" selected.](./media/plan-manage-costs/add-azure-logic-apps-pricing-calculator.png)

1. Scroll down the page until you can view the Azure Logic Apps pricing calculator. In the various sections for Azure resources that are directly related to Azure Logic Apps, enter the numbers of resources that you plan to use and the number of intervals over which you might use those resources.

   This screenshot shows an example cost estimate by using the calculator:

   ![Example showing estimated cost in the Azure Pricing calculator](./media/plan-manage-costs/example-logic-apps-pricing-calculator.png)

1. To update your cost estimates as you create and use new related resources, return to this calculator, and update those resources here.

<a name="create-budgets-alerts"></a>

## Create budgets and alerts

To help you proactively manage costs for your Azure account or subscription, you can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) and [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) by using the [Azure Cost Management and Billing](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) service and capabilities.  Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy.

Based on spending compared to budget and cost thresholds, alerts automatically notify stakeholders about spending anomalies and overspending risks. If you want more granularity in your monitoring, you can also create budgets that use filters for specific resources or services in Azure. Filters help make sure that you don't accidentally create new resources that cost you extra money. For more information about the filter options, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

<a name="monitor-costs"></a>

## Monitor costs

Resource usage unit costs vary by time intervals, such as seconds, minutes, hours, and days, or by unit usage, such as bytes, megabytes, and so on. Some examples are by day, current and prior month, and year. Switching to longer views over time can help you identify spending trends. When you use the cost analysis features, you can view costs as graphs and tables over various time intervals. If you created budgets and cost forecasts, you can also easily find where budgets are exceeded and overspending might have occurred.

After you start incurring costs for resources that create or start using in Azure, you can review and monitor these costs in these ways:

* [Monitor logic app executions and storage usage](#monitor-billing-metrics) by using Azure Monitor

* Run [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) by using [Azure Cost Management and Billing](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)

<a name="monitor-billing-metrics"></a>

### Monitor logic app executions and storage usage

Using Azure Monitor, you can view these metrics for a specific logic app:

* Billable action executions
* Billable trigger executions
* Billing usage for native operation executions
* Billing usage for standard connector executions
* Billing usage for storage consumption
* Total billable executions

<a name="execution-storage-metrics"></a>

#### View execution and storage consumption metrics

1. In the Azure portal, find and open your logic app. On your logic app's menu, under **Monitoring**, select **Metrics**.

1. In the right-side pane, under **Chart Title**, in the metric bar, open the **Metric** list, and select the metric that you want.

   > [!NOTE]
   > Storage consumption is measured as the number of storage units (GB) that your logic app uses and is billed. 
   > Runs that use less than 500 MB in storage might not appear in monitoring view, but they are still billed.

   ![Screenshot that shows the Metrics pane with the opened "Metric" list.](./media/logic-apps-pricing/select-metric.png)

1. In the pane's upper-right corner, select the time period that you want.

1. To view other storage consumption data, specifically action input and output sizes in your logic app's run history, [follow these steps](#view-input-output-sizes).

<a name="view-input-output-sizes"></a>

#### View action input and output sizes in run history

1. In the Azure portal, find and open your logic app.

1. On your logic app's menu, select **Overview**.

1. In the right-side pane, under **Runs history**, select the run that has the inputs and outputs you want to view.

1. Under **Logic app run**, select **Run Details**.

1. In the **Logic app run details** pane, in the actions table, which lists each action's status and duration, select the action that you want to view.

1. In the **Logic app action** pane, find the sizes for that action's inputs and outputs. Under **Inputs link** and **Outputs link**, find the links to those inputs and outputs.

   > [!NOTE]
   > For loops, only the top-level actions show sizes for their inputs and outputs. 
   > For actions inside nested loops, inputs and outputs show zero size and no links.

<a name="run-cost-analysis"></a>

### Run cost analysis by using Azure Cost Management and Billing

To review costs for the Logic Apps service based on a specific scope, for example, an Azure subscription, you can use the [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) capabilities in [Azure Cost Management and Billing](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

1. In the Azure portal, open the scope that you want, such as your Azure subscription. From the left menu, under **Cost Management**, select **Cost analysis**.

   When you first open the cost analysis pane, the top graph shows the actual and forecasted usage costs across all the services in the subscription for the current month.

   ![Screenshot that shows Azure portal and cost analysis pane with example for actual and forecasted costs in a subscription.](./media/plan-manage-costs/cost-analysis-total-actual-forecasted-costs.png)

   > [!TIP]
   > To change scopes, in the **Cost analysis** pane, from the filters bar, select the **Scope** filter. 
   > In the **Select scope** pane, switch to the scope that you want.

   Underneath, the donut charts show the current costs by Azure services, by Azure region (location), and by resource group.

   ![Screenshot that shows Azure portal and cost analysis pane with example donut charts for services, regions, and resource groups.](./media/plan-manage-costs/cost-analysis-donut-charts.png)

1. To filter the chart to a specific area, such as a service or resource, in the filters bar, select **Add filter**.

1. From the left-side list, select the filter type, for example, **Service name**. From the right-side list, select the filter, for example, **logic apps**. When you're done, select the green check mark.

   ![Screenshot that shows Azure portal and cost analysis pane with filter selections.](./media/plan-manage-costs/cost-analysis-add-service-name-filter.png)

   For example, here is the result for the Logic Apps service:

   ![Screenshot that shows Azure portal and cost analysis pane with results filtered on "logic apps".](./media/plan-manage-costs/cost-analysis-total-actual-costs-service.png)

### Export cost data

When you need to do more data analysis on costs, you can [export cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. For example, a finance team can analyze this data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule, and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Other ways to manage and reduce costs

<!-- Note to Azure service writer: This section is optional. Other than using the Cost Management methods above, your service probably has other specific ways to minimize costs. For example, you might have best practice advice or specific ways to reduce costs that are specific to your service. If so, try to add that guidance here or at least summarize key points. Try to be as prescriptive as possible. If you have more comprehensive content, add links to your other published articles or sections here.

Add a statement that discusses any recommended settings for your service that might help keep the charges minimal if a service isn't being actively used by the customer. For example: Will turning off a VM help to get no charges for the specific VM resource?

Otherwise, if no other cost-saving recommendations or best practices exist to reduce costs, cut this section.
-->

To help you reduce costs on your logic aps and related resources, try these options:

* If possible, use [built-in triggers and actions](../connectors/built-in.md), which cost less to run per execution than [managed connector triggers and actions](../connectors/managed.md).

  For example, you might be able to reduce costs when accessing other resources by using the [HTTP action](../connectors/connectors-native-http.md) or by calling a function that you created by using the [Azure Functions service](../azure-functions/functions-overview.md) and using the [built-in Azure Functions action](../logic-apps/logic-apps-azure-functions.md). However, using Azure Functions also incurs costs, so make sure that you compare your options.

* [Specify precise trigger conditions](logic-apps-workflow-actions-triggers.md#trigger-conditions) for running a workflow.

  For example, you can specify that a trigger fires only when the target website returns an internal server error. In the trigger's JSON definition, use the `conditions` property to specify a condition that references the trigger's status code.

* If a trigger has a polling version and a webhook version, try the webhook version, which waits for the specified event to happen before firing, rather than regularly checking for the event.

* Call your logic app through another service so that the trigger fires only when the workflow should run.

  For example, you can call your logic app from a function that you create and run using the Azure Functions service. For example, see [Call or trigger logic apps by using Azure Functions and Azure Service Bus](logic-apps-scenario-function-sb-trigger.md).

* [Disable logic apps](manage-logic-apps-with-azure-portal.md#disable-or-enable-logic-apps) that don't have to constantly run, or [delete logic apps](manage-logic-apps-with-azure-portal.md#delete-logic-apps) that you no longer need at all. If possible, disable any other resources that you don't need constantly active.

## Next steps

* [Optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
* [Manage costs using cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
* [Prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
* Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course
