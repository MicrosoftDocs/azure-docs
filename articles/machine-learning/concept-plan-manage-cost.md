---
title: Plan to manage costs
titleSuffix: Azure Machine Learning
description: Plan to manage costs for Azure Machine Learning with cost analysis in the Azure portal. Learn further cost-saving tips for building ML models.
author: sdgilley
ms.author: sgilley
ms.custom: subject-cost-optimization, build-2023
ms.reviewer: nigup
ms.service: machine-learning
ms.subservice: mlops
ms.topic: conceptual
ms.date: 03/26/2024
---

# Plan to manage costs for Azure Machine Learning

This article describes how to plan and manage costs for Azure Machine Learning. First, use the Azure pricing calculator to help plan for costs before you add any resources. Next, review the estimated costs while you add Azure resources.

After you start using Azure Machine Learning resources, use the cost management features to set budgets and monitor costs. Also, review the forecasted costs and identify spending trends to identify areas where you might want to act.

Understand that the costs for Azure Machine Learning are only a portion of the monthly costs in your Azure bill. If you use other Azure services, you're billed for all the Azure services and resources used in your Azure subscription, including third-party services. This article explains how to plan for and manage costs for Azure Machine Learning. After you're familiar with managing costs for Azure Machine Learning, apply similar methods to manage costs for all the Azure services used in your subscription.

For more information on optimizing costs, see [Manage and optimize Azure Machine Learning costs](how-to-manage-optimize-cost.md).

## Prerequisites

Cost analysis in Microsoft Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). 


To view cost data, you need at least *read* access for an Azure account. For information about assigning access to Cost Management data, see [Assign access to data](../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using Azure Machine Learning

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you create resources in an Azure Machine Learning workspace. On the left side of the pricing calculator, select **AI + Machine Learning**, then select **Azure Machine Learning** to begin.  

The following screenshot shows an example cost estimate in the pricing calculator:

:::image type="content" source="media/concept-plan-manage-cost/capacity-calculator-cost-estimate.png" alt-text="Screenshot that shows an example of estimated cost in the Azure pricing calculator." lightbox="media/concept-plan-manage-cost/capacity-calculator-cost-estimate.png":::

As you add resources to your workspace, return to this calculator and add the same resource here to update your cost estimates.

For more information, see [Azure Machine Learning pricing](https://azure.microsoft.com/pricing/details/machine-learning?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Understand the full billing model for Azure Machine Learning

Azure Machine Learning runs on Azure infrastructure that accrues costs along with Azure Machine Learning when you deploy the new resource. It's important to understand that extra infrastructure might accrue cost. You need to manage that cost when you make changes to deployed resources. 

### Costs that typically accrue with Azure Machine Learning

When you create resources for an Azure Machine Learning workspace, resources for other Azure services are also created. They are:

* [Azure Container Registry](https://azure.microsoft.com/pricing/details/container-registry?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) basic account
* [Azure Blob Storage](https://azure.microsoft.com/pricing/details/storage/blobs?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) (general purpose v1)
* [Azure Key Vault](https://azure.microsoft.com/pricing/details/key-vault?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
* [Azure Monitor](https://azure.microsoft.com/pricing/details/monitor?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)

When you create a [compute instance](concept-compute-instance.md), the virtual machine (VM) stays on so it's available for your work.  
* Enable [idle shutdown](how-to-create-compute-instance.md#configure-idle-shutdown) to reduce costs when the VM is idle for a specified time period.
* Or [set up a schedule](how-to-create-compute-instance.md#schedule-automatic-start-and-stop) to automatically start and stop the compute instance to reduce costs when you aren't planning to use it.

### Costs might accrue before resource deletion

Before you delete an Azure Machine Learning workspace in the Azure portal or with Azure CLI, the following sub resources are common costs that accumulate even when you aren't actively working in the workspace. If you plan on returning to your Azure Machine Learning workspace at a later time, these resources might continue to accrue costs.

* VMs
* Load Balancer
* Azure Virtual Network
* Bandwidth

Each VM is billed per hour that it runs. Cost depends on VM specifications. VMs that run but don't actively work on a dataset are still charged via the load balancer. For each compute instance, one load balancer is billed per day. Every 50 nodes of a compute cluster have one standard load balancer billed. Each load balancer is billed around $0.33/day. To avoid load balancer costs on stopped compute instances and compute clusters, delete the compute resource.

Compute instances also incur P10 disk costs even in stopped state because any user content saved there persists across the stopped state similar to Azure VMs. We're working on making the OS disk size/ type configurable to better control costs. For Azure Virtual Networks, one virtual network is billed per subscription and per region. Virtual networks can't span regions or subscriptions. Setting up private endpoints in a virtual network might also incur charges. If your virtual network uses an Azure Firewall, this might also incur charges. Bandwidth charges reflect usage; the more data transferred, the greater the charge. 

> [!TIP]
> - Using an Azure Machine Learning managed virtual network is free. However, some features of the managed network rely on Azure Private Link (for private endpoints) and Azure Firewall (for FQDN rules), which incur charges. For more information, see [Managed virtual network isolation](how-to-managed-network.md#pricing).
> - Managed online endpoint uses VMs for the deployments. If you submitted request to create an online deployment and it failed, it may have passed the stage when compute is created. In that case, the failed deployment would incur charges. If you finished debugging or investigation for the failure, you may delete the failed deployments to save the cost.

### Costs might accrue after resource deletion

After you delete an Azure Machine Learning workspace in the Azure portal or with Azure CLI, the following resources continue to exist. They continue to accrue costs until you delete them.

* Azure Container Registry
* Azure Blob Storage
* Key Vault
* Application Insights

To delete the workspace along with these dependent resources, use the SDK:

[!INCLUDE [sdk v2](includes/machine-learning-sdk-v2.md)]
```python
from azure.ai.ml.entities import Workspace
ml_client.workspaces.begin_delete(name=ws.name, delete_dependent_resources=True)
```

If you create Azure Kubernetes Service (AKS) in your workspace, or if you attach any compute resources to your workspace, you must delete them separately in the [Azure portal](https://portal.azure.com).

### Use Azure Prepayment credit with Azure Machine Learning

You can pay for Azure Machine Learning charges by using your Azure Prepayment credit. However, you can't use Azure Prepayment credit to pay for third-party products and services, including those from the Azure Marketplace.

## Review estimated costs in the Azure portal

<!-- Note for Azure service writer: If your service shows estimated costs when a user is creating resources in the Azure portal, at a minimum, insert this section as a brief walkthrough that steps through creating a Azure Machine Learning resource where the estimated cost is shown to the user, updated for your service. Add a screenshot where the estimated costs or subscription credits are shown.

If your service doesn't show costs as they create a resource or if estimated costs aren't shown to users before they use your service, then omit this section.

For example, you might start with the following (modify for your service):
-->

As you create compute resources for Azure Machine Learning, you see estimated costs.

To create a compute instance and view the estimated price:

1. Sign into the [Azure Machine Learning studio](https://ml.azure.com).
1. On the left side, select **Compute**.
1. On the top toolbar, select **+New**.
1. Review the estimated price shown for each available virtual machine size.
1. Finish creating the resource.

:::image type="content" source="media/concept-plan-manage-cost/create-resource.png" alt-text="Screenshot showing estimated costs to create a compute instance." lightbox="media/concept-plan-manage-cost/create-resource.png" :::

If your Azure subscription has a spending limit, Azure prevents you from spending over your credit amount. As you create and use Azure resources, your credits are used. When you reach your credit limit, the resources that you deployed are disabled for the rest of that billing period. You can't change your credit limit, but you can remove it. For more information about spending limits, see [Azure spending limit](../cost-management-billing/manage/spending-limit.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Monitor costs

You incur costs to use Azure resources with Azure Machine Learning. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on.) As soon as Azure Machine Learning use starts, costs are incurred and you can see the costs in [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Azure Machine Learning costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you create budgets, you can also easily see where they're exceeded.

To view Azure Machine Learning costs in cost analysis:

1. Sign in to the Azure portal.
2. Open the scope in the Azure portal and select **Cost analysis** in the menu. For example, go to **Subscriptions**, select a subscription from the list, and then select  **Cost analysis** in the menu. Select **Scope** to switch to a different scope in cost analysis.
3. By default, costs for services are shown in the first donut chart. Select the area in the chart labeled Azure Machine Learning.

Actual monthly costs are shown when you initially open cost analysis. Here's an example that shows all monthly usage costs.

:::image type="content" source="media/concept-plan-manage-cost/all-costs.png" alt-text="Screenshot showing accumulated costs for a subscription." lightbox="media/concept-plan-manage-cost/all-costs.png" :::

To narrow costs for a single service, like Azure Machine Learning, select **Add filter** and then select **Service name**. Then, select **virtual machines**.

Here's an example that shows costs for just Azure Machine Learning.

:::image type="content" source="media/concept-plan-manage-cost/vm-specific-cost.png" alt-text="Screenshot showing accumulated costs for ServiceName." lightbox="media/concept-plan-manage-cost/vm-specific-cost.png" :::

<!-- Note to Azure service writer: The image shows an example for Azure Storage. Replace the example image with one that shows costs for your service. -->

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and Azure Machine Learning costs by resource group are also shown. From here, you can explore costs on your own.

## Create budgets

You can create [budgets](../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you extra money. For more about the filter options when you create a budget, see [Group and filter options](../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you or others need to do more data analysis for costs. For example, a finance team can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.

## Other ways to manage and reduce costs for Azure Machine Learning

Use the following tips to help you manage and optimize your compute resource costs.

- Configure your training clusters for autoscaling.
- Configure your managed online endpoints for autoscaling.
- Set quotas on your subscription and workspaces.
- Set termination policies on your training job.
- Use low-priority virtual machines.
- Schedule compute instances to shut down and start up automatically.
- Use an Azure Reserved VM instance.
- Train locally.
- Parallelize training.
- Set data retention and deletion policies.
- Deploy resources to the same region.
- Delete instances, clusters and/or online deployments if you don't plan on using them soon.
- Delete failed deployments if computes are created for them.

For more information, see [Manage and optimize Azure Machine Learning costs](how-to-manage-optimize-cost.md).

## Next steps

- [Manage and optimize Azure Machine Learning costs](how-to-manage-optimize-cost.md)
- [View managed online endpoint costs](how-to-view-online-endpoints-costs.md)
- [Manage budgets, costs, and quota for Azure Machine Learning at organizational scale](/azure/cloud-adoption-framework/ready/azure-best-practices/optimize-ai-machine-learning-cost)
- Learn [how to optimize your cloud investment with Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
- [Quickstart: Start using Cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
- [Identify anomalies and unexpected changes in cost](../cost-management-billing/understand/analyze-unexpected-charges.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn)
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course
