---
title: Plan and manage costs for Azure AI services
titleSuffix: Azure AI Studio
description: Learn how to plan for and manage costs for Azure AI services by using cost analysis in the Azure portal.
author: eric-urban
manager: nitinme
ms.service: azure-ai-services
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Plan and manage costs for Azure AI services

This article describes how you plan for and manage costs for Azure AI services. First, you use the Azure pricing calculator to help plan for Azure AI services costs before you add any resources for the service to estimate costs. Next, as you add Azure resources, review the estimated costs. 

Costs for Azure AI services are only a portion of the monthly costs in your Azure bill. Although this article explains how to plan for and manages costs for Azure AI services, you're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Microsoft Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For more information about assigning access, see [Assign access to data](../../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Estimate costs before using Azure AI services

Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to estimate costs before you add Azure AI services.

1. Select a product such as Azure OpenAI in the Azure pricing calculator.

    :::image type="content" source="../media/cost-management/pricing-calculator-select-product.png" alt-text="Screenshot of selecting Azure OpenAI in the Azure pricing calculator." lightbox="../media/cost-management/pricing-calculator-select-product.png":::

1. Enter the number of units you plan to use. For example, enter the number of tokens for prompts and completions.

    :::image type="content" source="../media/cost-management/pricing-calculator-estimate-openai.png" alt-text="Screenshot of Azure OpenAI cost estimate in the Azure pricing calculator." lightbox="../media/cost-management/pricing-calculator-estimate-openai.png":::

1. You can select more than one product to estimate costs for multiple products. For example, select Virtual Machines to add potential costs for compute resources.

    :::image type="content" source="../media/cost-management/pricing-calculator-estimate.png" alt-text="Screenshot of total estimate in the Azure pricing calculator." lightbox="../media/cost-management/pricing-calculator-estimate.png":::

As you add new resources to your project, return to this calculator and add the same resource here to update your cost estimates.


### Costs that typically accrue with Azure AI and Azure AI Studio

When you create resources for an Azure AI resource, resources for other Azure services are also created. They are:

| Service pricing page | Description with example use cases | 
| --- | --- | 
| [Azure AI services](https://azure.microsoft.com/pricing/details/cognitive-services/) | You pay to use services such as Azure OpenAI, Speech, Content Safety, Vision, Document Intelligence, and Language. Costs vary for each service and for some features within each service. | 
| [Azure AI Search](https://azure.microsoft.com/pricing/details/search/) | An example use case is to store data in a vector search index. |
| [Azure Machine Learning](https://azure.microsoft.com/pricing/details/machine-learning/) | Compute instances are needed to run Visual Studio Code (Web) and prompt flow via Azure AI Studio.<br/><br/>When you create a compute instance, the VM stays on so it's available for your work.<br/><br/>Enable idle shutdown to save on cost when the VM has been idle for a specified time period.<br/><br/>Or set up a schedule to automatically start and stop the compute instance to save cost when you aren't planning to use it. | 
| [Azure Virtual Machine](https://azure.microsoft.com/pricing/details/virtual-machines/) | Azure Virtual Machines gives you the flexibility of virtualization for a wide range of computing solutions with support for Linux, Windows Server, SQL Server, Oracle, IBM, SAP, and more. |
| [Azure Container Registry Basic account](https://azure.microsoft.com/pricing/details/container-registry) | Provides storage of private Docker container images, enabling fast, scalable retrieval, and network-close deployment of container workloads on Azure. |
| [Azure Blob Storage](https://azure.microsoft.com/pricing/details/storage/blobs/) | Can be used to store Azure AI project files. |
| [Key Vault](https://azure.microsoft.com/pricing/details/key-vault/) | A key vault for storing secrets. |
| [Azure Private Link](https://azure.microsoft.com/pricing/details/private-link/) | Azure Private Link enables you to access Azure PaaS Services (for example, Azure Storage and SQL Database) over a private endpoint in your virtual network. |

### Costs might accrue before resource deletion

Before you delete an Azure AI resource in the Azure portal or with Azure CLI, the following sub resources are common costs that accumulate even when you aren't actively working in the workspace. If you're planning on returning to your Azure AI resource at a later time, these resources might continue to accrue costs: 
- Azure AI Search (for the data)
- Virtual machines
- Load Balancer
- Virtual Network
- Bandwidth

Each VM is billed per hour it's running. Cost depends on VM specifications. VMs that are running but not actively working on a dataset will still be charged via the load balancer. For each compute instance, one load balancer is billed per day. Every 50 nodes of a compute cluster have one standard load balancer billed. Each load balancer is billed around $0.33/day. To avoid load balancer costs on stopped compute instances and compute clusters, delete the compute resource.

Compute instances also incur P10 disk costs even in stopped state. This is because any user content saved there's persisted across the stopped state similar to Azure VMs. We're working on making the OS disk size/ type configurable to better control costs. For virtual networks, one virtual network is billed per subscription and per region. Virtual networks can't span regions or subscriptions. Setting up private endpoints in vNet setups might also incur charges. Bandwidth is charged by usage; the more data transferred, the more you are charged.

### Costs might accrue after resource deletion

After you delete an Azure AI resource in the Azure portal or with Azure CLI, the following resources continue to exist. They continue to accrue costs until you delete them.

- Azure Container Registry
- Azure Blob Storage
- Key Vault
- Application Insights (if you enabled it for your Azure AI resource)

## Monitor costs

As you use Azure resources with Azure AI services, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on). As soon as use of an Azure AI services resource starts, costs are incurred and you can see the costs in [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Azure AI services costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

To view Azure AI services costs in cost analysis here's an example:

1. Sign in to the Azure portal.
2. Go to **Subscriptions**, select a subscription from the list, and then select  **Cost analysis** in the left navigation menu. Select **Scope** to switch to a different scope in cost analysis.
3. By default, cost for services are shown in the first donut chart. Select the area in the chart labeled Azure AI services.
4. To narrow costs for a single service, like Azure AI services, select **Add filter** and then select **Service name**, Then, select **Azure AI services**.

Actual monthly costs are shown when you initially open cost analysis. Here's an example showing all monthly usage costs.

:::image type="content" source="../media/cost-management/all-costs.png" alt-text="Screenshot of monthly usage costs using the cost analysis tool." lightbox="../media/cost-management/all-costs.png":::

To view the costs of a single resource within a resource group

1. Above the charts, select **Cost by resource**.
2. Select **Resource groups** and choose the one you want to see.
3. You'll now see a detailed breakdown of cost for each resource in that group, such as **Azure Search Service**.

In the preceding example, you see the current cost for the service. Costs by Azure regions (locations) and Azure AI services costs by resource group are also shown. From here, you can explore costs on your own.

For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Create budgets

You can create [budgets](../../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more about the filter options when you create a budget, see [Group and filter options](../../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you or others need to do more data analysis for costs. For example, finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.


## Understand the full billing model for Azure AI services

Azure AI services run on Azure infrastructure that accrues costs along with Azure AI when you deploy the new resource. It's important to understand that more infrastructure might accrue cost. You need to manage that cost when you make changes to deployed resources.

When you create or use Azure AI services resources, you might get charged based on the services that you use. There are two billing models available for Azure AI services: 

- Pay-as-you-go: Pay-As-You-Go pricing, you're billed according to the Azure AI services offering that you use, based on its billing information.
- Commitment tiers: With commitment tier pricing, you commit to using several service features for a fixed fee, enabling you to have a predictable total cost based on the needs of your workload. You're billed according to the plan you choose. See [Quickstart: purchase commitment tier pricing](../../ai-services/commitment-tier.md) for information on available services, how to sign up, and considerations when purchasing a plan.

> [!NOTE]
> If you use the resource above the quota provided by the commitment plan, you will be charged for the additional usage as per the overage amount mentioned in the Azure portal when you purchase a commitment plan. 

You can pay for Azure AI services charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including those from the Azure Marketplace.

For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).


### Using Azure Prepayment credit with Azure AI services

You can pay for Azure AI services charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including those from the Azure Marketplace.

## Next steps

- Learn [how to optimize your cloud investment with Microsoft Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
