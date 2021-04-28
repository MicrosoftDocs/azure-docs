---
title: Plan to manage costs for Azure Data Factory
description: Learn how to plan for and manage costs for Azure Data Factory by using cost analysis in the Azure portal.
author: shirleywangmsft
ms.author: shwang
ms.service: data-factory
ms.topic: how-to
ms.date: 04/28/2021
---

# Plan and manage costs for Azure Data Factory

[!INCLUDE[appliesto-adf-asa-md](includes/appliesto-adf-asa-md.md)]

This article describes how you plan for and manage costs for Azure Data Factory. 

First, at the beginning of the ETL project, you use a combination of the Azure pricing and per-pipeline consumption and pricing calculators to help plan for Azure Data Factory costs before you add any resources for the service to estimate costs. Next, as you add Azure resources, review the estimated costs. After you've started using Azure Data Factory resources, use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. Costs for Azure Data Factory are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for data factory, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using Azure Data Factory
 
- Use the [ADF pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=data-factory) to get an estimate of the cost of running your ETL workload in Azure Data Factory.  To use the calculator, you have to input details such as number of activity runs, number of data integration unit hours, type of compute used for Data Flow, core count, instance count, execution duration, and so on.

One of the commonly asked questions for the pricing calculator is what values should be used as inputs.  During the proof-of-concept phase, you can conduct trial runs using sample datasets to understand the consumption for various ADF meters.  Then based on the consumption for the sample dataset, you can project out the consumption for the full dataset and operationalization schedule.

> [!NOTE]
> The prices used in these examples below are hypothetical and are not intended to imply actual pricing.

For example, let’s say you need to move 1 TB of data daily from AWS S3 to Azure Data Lake Gen2.  You can perform POC of moving 100 GB of data to measure the data ingestion throughput and understand the corresponding billing consumption.

Here is a sample copy activity run detail (your actual mileage will vary based on the shape of your specific dataset, network speeds, egress limits on S3 account, ingress limits on ADLS Gen2, and other factors).

![S3 copy run](media/plan-manage-costs/s3-copy-run-details.png)

By leveraging the [consumption monitoring at pipeline-run level](#monitor-consumption-at-pipeline-run-level), you can see the corresponding data movement meter consumption quantities:

![S3 copy pipeline consumption](media/plan-manage-costs/s3-copy-pipeline-consumption.png)

Therefore, the total number of DIU-hours it takes to move 1 TB per day for the entire month is:

1.2667 (DIU-hours) * (1 TB / 100 GB) * 30 (days in a month) = 380 DIU-hours

Now you can plug 30 activity runs and 380 DIU-hours into ADF pricing calculator to get an estimate of your monthly bill:

![S3 copy pricing calculator](media/plan-manage-costs/s3-copy-pricing-calculator.png)

## Understand the full billing model for Azure Data Factory

Azure Data Factory runs on Azure infrastructure that accrues costs when you deploy new resources. It's important to understand that there could be other additional infrastructure costs that might accrue.

### How you're charged for Azure Data Factory

Azure Data Factory is a serverless and elastic data integration service built for cloud scale.  This means there is not a fixed-size compute that you need to plan for peak load; rather you specify how much resource to allocate on demand per operation, which allows you to design the ETL processes in a much more scalable manner. In addition, ADF is billed on a consumption-based plan, which means you only pay for what you use.

When you create or use Azure Data Factory resources, you might get charged for the following meters:

- Activity Runs - You're charged for it based on the number of activity runs.
- Execution Hours - You're charged for it based on the number of vCore hours of execution time.
- Data Integration Unit (DIU) Hours - You're charged for it based on the number of hours of data movement activities.

At the end of your billing cycle, the charges for each meter are summed. Your bill or invoice shows a section for all Azure Data Factory costs. There's a separate line item for each meter.

### Other costs that might accrue with Azure Data Factory

<!--Note to Azure service writer: Include any costs that aren't obvious, hidden, or otherwise might not be present in the pricing calculator or resource creation experience in the Azure portal. You might need to sync with your product team to identify hidden costs. If you're certain that costs accrue only for your service and no others, then omit this section. -->

When you create resources for Azure Data Factory, resources for other Azure services are also created. They include:

- <OtherAzureService1>
- <OtherAzureService2>

### Costs might accrue after resource deletion

<!--Note to Azure service writer: You might need to sync with your product team to identify resources that continue to exist after those ones for your service are deleted. If you're certain that no resources can exist after those for your service are deleted, then omit this section. -->

After you delete Azure Data Factory resources, the following resources might continue to exist. They continue to accrue costs until you delete them.

- <OtherServiceResource1>
- <OtherServiceResource2>

### Using Azure Prepayment with Azure Data Factory

You can pay for Azure Data Factory charges with your Azure Prepayment credit. However, you can't use Azure Prepayment credit to pay for charges for third party products and services including those from the Azure Marketplace.

## Monitor costs

Azure Data Factory costs can be monitored at the factory, pipeline-run and activity-run levels.

### Monitor costs at factory level

As you use Azure resources with Data Factory, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on.) As soon as Data Factory use starts, costs are incurred and you can see the costs in [cost analysis](../cost-management/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Data Factory costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

To view Data Factory costs in cost analysis:

1. Sign in to the Azure portal.
2. Open the scope in the Azure portal and select **Cost analysis** in the menu. For example, go to **Subscriptions**, select a subscription from the list, and then select  **Cost analysis** in the menu. Select **Scope** to switch to a different scope in cost analysis.
3. By default, cost for services are shown in the first donut chart. Select the area in the chart labeled Azure Data Factory v2.

Actual monthly costs are shown when you initially open cost analysis. Here's an example showing all monthly usage costs.

![Example showing accumulated costs for a subscription](media/all-costs.png)

- To narrow costs for a single service, like Data Factory, select **Add filter** and then select **Service name**. Then, select **Azure Data Factory v2**.

Here's an example showing costs for just Data Factory.

![Example showing accumulated costs for ServiceName](media/service-specific-cost.png)

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and Data Factory costs by resource group are also shown. From here, you can explore costs on your own.

### Monitor consumption at pipeline-run level

Depending on the types of activities you have in your pipeline, how much data you are moving and transforming, and the complexity of the transformation, executing a pipeline will spin different billing meters in Azure Data Factory.

You can view the amount of consumption for different meters for individual pipeline runs in the Azure Data Factory user experience. To open the monitoring experience, select the **Monitor & Manage** tile in the data factory blade of the [Azure portal](https://portal.azure.com/). If you're already in the ADF UX, click on the **Monitor** icon on the left sidebar. The default monitoring view is list of pipeline runs.

Clicking the **Consumption** button next to the pipeline name will display a pop-up window showing you the consumption for your pipeline run aggregated across all of the activities within the pipeline.

![Pipeline run consumption](media/plan-manage-costs/pipeline-run-consumption.png)

![Pipeline consumption details](media/plan-manage-costs/pipeline-consumption-details.png)

The pipeline run consumption view shows you the amount consumed for each ADF meter for the specific pipeline run, but it does not show the actual price charged, because the amount billed to you is dependent on the type of Azure account you have and the type of currency used.  To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md).

### Monitor consumption at activity-run level
Once you understand the aggregated consumption at pipeline-run level, there are scenarios where you need to further drill down and identify which is the most costly activity within the pipeline.

To see the consumption at activity-run level, go to your data factory **Author & Monitor** UI. From the **Monitor** tab where you see a list of pipeline runs, click the **pipeline name** link to access the list of activity runs in the pipeline run.  Click on the **Output** button next to the activity name and look for **billableDuration** property in the JSON output:

Here is a sample out from a copy activity run:

![Copy output](media/plan-manage-costs/copy-output.png)

And here is a sample out from a Mapping Data Flow activity run:

![Dataflow output](media/plan-manage-costs/dataflow-output.png)

## Create budgets

You can create [budgets](../cost-management/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you additional money. For more information about the filter options available when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you need or others to do additional data analysis for costs. For example, a finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Other ways to manage and reduce costs for <ServiceName>

<!-- Note to Azure service writer: This is an optional section. Other than using the Cost Management methods above, there are probably ways to minimize costs for your service that are specific to your service. Because customers only pay for what they use and when they use less of a resource, the result is a smaller bill. You might already have published cost-saving content. For example, you might have best practice advice or specific ways to reduce costs that are specific to your service. If so, try to add that guidance here or at least summarize key points. Try to be as prescriptive as possible. If you have more comprehensive content, add links to your other published articles or sections here. 

Add a statement that discusses any recommended settings for your service that might help keep the charges minimal if a service isn't being actively used by the customer. For example: Will turning off a VM help to get no charges for the specific VM resource?

If your team has no cost-saving recommendations or best practice advice to reduce costs, then cut this section.
-->

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/learn/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
- [Azure Data Factory pricing page](https://azure.microsoft.com/pricing/details/data-factory/ssis/)
- [Understanding Azure Data Factory through examples](./pricing-concepts.md)
- [Azure Data Factory pricing calculator](https://azure.microsoft.com/pricing/calculator/?service=data-factory)

Create a table of contents entry for the article in the How-to guides section where appropriate. -->
