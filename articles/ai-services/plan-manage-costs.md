---
title: Plan to manage costs for Azure AI services
description: Learn how to plan for and manage costs for Azure AI services by using cost analysis in the Azure portal.
author: PatrickFarley
ms.author: pafarley
ms.custom: subject-cost-optimization
ms.service: azure-ai-services
ms.topic: how-to
ms.date: 11/03/2021
---


# Plan and manage costs for Azure AI services

This article describes how you plan for and manage costs for Azure AI services. First, you use the Azure pricing calculator to help plan for Azure AI services costs before you add any resources for the service to estimate costs. Next, as you add Azure resources, review the estimated costs. After you've started using Azure AI services resources (for example Speech, Azure AI Vision, LUIS, Language service, Translator, etc.), use Cost Management features to set budgets and monitor costs. You can also review forecasted costs and identify spending trends to identify areas where you might want to act. Costs for Azure AI services are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manage costs for Azure AI services, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

<!--Note for Azure service writer: If you have other prerequisites for your service, insert them here -->

## Estimate costs before using Azure AI services

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you add Azure AI services.

:::image type="content" source="media/cognitive-services-pricing-calculator.png" alt-text="Azure Pricing calculator for Azure AI services" border="true":::

As you add new resources to your workspace, return to this calculator and add the same resource here to update your cost estimates.

For more information, see [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

## Understand the full billing model for Azure AI services

Azure AI services runs on Azure infrastructure that [accrues costs](https://azure.microsoft.com/pricing/details/cognitive-services/) when you deploy the new resource. It's important to understand that more infrastructure might accrue costs. You need to manage that cost when you make changes to deployed resources. 

When you create or use Azure AI services resources, you might get charged based on the services that you use. There are two billing models available for Azure AI services: pay-as-you-go, and commitment tier.

## Pay-as-you-go

With Pay-As-You-Go pricing, you are billed according to the Azure AI services offering you use, based on its billing information.

| Service | Instance(s) | Billing information | 
|---------|-------|---------------------|
| [Anomaly Detector](https://azure.microsoft.com/pricing/details/cognitive-services/anomaly-detector/) | Free, Standard | Billed by the number of transactions. | 
| [Content Moderator](https://azure.microsoft.com/pricing/details/cognitive-services/content-moderator/) | Free, Standard | Billed by the number of transactions. |
| [Custom Vision](https://azure.microsoft.com/pricing/details/cognitive-services/custom-vision-service/) | Free, Standard | <li>Predictions are billed by the number of transactions.</li><li>Training is billed by compute hour(s).</li><li>Image storage is billed by number of images (up to 6 MB per image).</li>|
| [Face](https://azure.microsoft.com/pricing/details/cognitive-services/face-api/) | Free, Standard | Billed by the number of transactions. |
| [Language](https://azure.microsoft.com/pricing/details/cognitive-services/text-analytics/) | Free, Standard | Billed by number of text records. | 
| [Language Understanding (LUIS)](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/) | Free Authoring, Free Prediction, Standard | Billed by number of transactions. Price per transaction varies by feature (speech requests, text requests). For full details, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/language-understanding-intelligent-services/). |
| [Personalizer](https://azure.microsoft.com/pricing/details/cognitive-services/personalizer/) | Free, Standard (S0) | Billed by transactions per month. There are storage and transaction quotas. For full details, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/personalizer/). | 
| [QnA Maker](https://azure.microsoft.com/pricing/details/cognitive-services/qna-maker/) | Free, Standard | Subscription fee billed monthly. For full details, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/qna-maker/). | 
| [Speech](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/) | Free, Standard | Billing varies by feature (speech-to-text, text to speech, speech translation, speaker recognition). Primarily, billing is by transaction count or character count. For full details, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/). |
| [Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/) | Free, Pay-as-you-go (S1), Volume discount (S2, S3, S4, C2, C3, C4, D3) | Pricing varies by meter and feature. For full details, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/translator/). <li>Text translation is billed by number of characters translated.</li><li>Document translation is billed by characters translated.</li><li>Custom translation is billed by characters of source and target training data.</li> |
| [Vision](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/) | Free, Standard (S1) | Billed by the number of transactions. Price per transaction varies per feature (Read, OCR, Spatial Analysis). For full details, see [Pricing](https://azure.microsoft.com/pricing/details/cognitive-services/computer-vision/). |

## Commitment tier

In addition to the pay-as-you-go model, Azure AI services has commitment tiers, which let you commit to using several service features for a fixed fee, enabling you to have a predictable total cost based on the needs of your workload.

With commitment tier pricing, you are billed according to the plan you choose. See [Quickstart: purchase commitment tier pricing](commitment-tier.md) for information on available services, how to sign up, and considerations when purchasing a plan.

> [!NOTE]
> If you use the resource above the quota provided by the commitment plan, you will be charged for the additional usage as per the overage amount mentioned in the Azure portal when you purchase a commitment plan. For more information, see [Azure AI services pricing](https://azure.microsoft.com/pricing/details/cognitive-services/).

### Costs that typically accrue with Azure AI services

Typically, after you deploy an Azure resource, costs are determined by your pricing tier and the API calls you make to your endpoint. If the service you're using has a commitment tier, going over the allotted calls in your tier may incur an overage charge.

Extra costs may accrue when using these services:

#### QnA Maker

When you create resources for QnA Maker, resources for other Azure services may also be created. They include:

- [Azure App Service (for the runtime)](https://azure.microsoft.com/pricing/details/app-service/)
- [Azure Cognitive Search (for the data)](https://azure.microsoft.com/pricing/details/search/)
 
### Costs that might accrue after resource deletion

#### QnA Maker

After you delete QnA Maker resources, the following resources might continue to exist. They continue to accrue costs until you delete them.

- [Azure App Service (for the runtime)](https://azure.microsoft.com/pricing/details/app-service/)
- [Azure Cognitive Search (for the data)](https://azure.microsoft.com/pricing/details/search/)

### Using Azure Prepayment credit with Azure AI services

You can pay for Azure AI services charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including those from the Azure Marketplace.

## Monitor costs

As you use Azure resources with Azure AI services, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on). As soon as use of an Azure AI services resource starts, costs are incurred and you can see the costs in [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Azure AI services costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

To view Azure AI services costs in cost analysis:

1. Sign in to the Azure portal.
1. Open the scope in the Azure portal and select **Cost analysis** in the menu. For example, go to **Subscriptions**, select a subscription from the list, and then select  **Cost analysis** in the menu. Select **Scope** to switch to a different scope in cost analysis.
1. By default, cost for services are shown in the first donut chart. Select the area in the chart labeled Azure AI services.

Actual monthly costs are shown when you initially open cost analysis. Here's an example showing all monthly usage costs.

:::image type="content" source="./media/cost-management/all-costs.png" alt-text="Example showing accumulated costs for a subscription":::

- To narrow costs for a single service, like Azure AI services, select **Add filter** and then select **Service name**. Then, select **Azure AI services**.

Here's an example showing costs for just Azure AI services.

:::image type="content" source="./media/cost-management/cognitive-services-costs.png" alt-text="Example showing accumulated costs for Azure AI services":::

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and Azure AI services costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets

You can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more about the filter options when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you or others need to do more data analysis for costs. For example, finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
