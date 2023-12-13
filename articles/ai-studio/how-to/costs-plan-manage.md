---
title: Plan and manage costs for Azure AI Studio
titleSuffix: Azure AI Studio
description: Learn how to plan for and manage costs for Azure AI Studio by using cost analysis in the Azure portal.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: conceptual
ms.date: 11/15/2023
ms.author: eur
---

# Plan and manage costs for Azure AI Studio

This article describes how you plan for and manage costs for Azure AI Studio. First, you use the Azure pricing calculator to help plan for Azure AI Studio costs before you add any resources for the service to estimate costs. Next, as you add Azure resources, review the estimated costs. 

You use Azure AI services in Azure AI Studio. Costs for Azure AI services are only a portion of the monthly costs in your Azure bill. You're billed for all Azure services and resources used in your Azure subscription, including the third-party services.

## Prerequisites

Cost analysis in Microsoft Cost Management supports most Azure account types, but not all of them. To view the full list of supported account types, see [Understand Cost Management data](../../cost-management-billing/costs/understand-cost-mgt-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn). To view cost data, you need at least read access for an Azure account. For information about assigning access to Azure Cost Management data, see [Assign access to data](../../cost-management-billing/costs/assign-access-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

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
| [Azure Machine Learning](https://azure.microsoft.com/pricing/details/machine-learning/) | Compute instances are needed to run Visual Studio Code (Web) and prompt flow via Azure AI Studio.<br/><br/>When you create a compute instance, the virtual machine (VM) stays on so it's available for your work.<br/><br/>Enable idle shutdown to save on cost when the VM is idle for a specified time period.<br/><br/>Or set up a schedule to automatically start and stop the compute instance to save cost when you aren't planning to use it. | 
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

Compute instances also incur P10 disk costs even in stopped state. This is because any user content saved there's persisted across the stopped state similar to Azure VMs. We're working on making the OS disk size/ type configurable to better control costs. For virtual networks, one virtual network is billed per subscription and per region. Virtual networks can't span regions or subscriptions. Setting up private endpoints in virtual network setups might also incur charges. Bandwidth is charged by usage; the more data transferred, the more you're charged.

### Costs might accrue after resource deletion

After you delete an Azure AI resource in the Azure portal or with Azure CLI, the following resources continue to exist. They continue to accrue costs until you delete them.

- Azure Container Registry
- Azure Blob Storage
- Key Vault
- Application Insights (if you enabled it for your Azure AI resource)

## Monitor costs

As you use Azure AI Studio with Azure AI resources, you incur costs. Azure resource usage unit costs vary by time intervals (seconds, minutes, hours, and days) or by unit usage (bytes, megabytes, and so on). You can see the incurred costs in [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

When you use cost analysis, you view Azure AI resource costs in graphs and tables for different time intervals. Some examples are by day, current and prior month, and year. You also view costs against budgets and forecasted costs. Switching to longer views over time can help you identify spending trends. And you see where overspending might have occurred. If you've created budgets, you can also easily see where they're exceeded.

### Monitor Azure AI Studio project costs

You can get to cost analysis from the [Azure portal](https://portal.azure.com). You can also get to cost analysis from the [Azure AI Studio portal](https://ai.azure.com).

> [!IMPORTANT]
> Your Azure AI project costs are only a subset of your overall application or solution costs. You need to monitor costs for all Azure resources used in your application or solution. See [Azure AI resources](../concepts/ai-resources.md) for more information.

For the examples in this section, assume that all Azure AI Studio resources are in the same resource group. But you can have resources in different resource groups. For example, your Azure AI Search resource might be in a different resource group than your Azure AI Studio project.

Here's an example of how to monitor costs for an Azure AI Studio project. The costs are used as an example only. Your costs will vary depending on the services that you use and the amount of usage.

1. Sign in to [Azure AI Studio portal](https://ai.azure.com).
1. Select your project and then select **Settings** from the left navigation menu.

    :::image type="content" source="../media/cost-management/project-costs/project-settings-go-view-costs.png" alt-text="Screenshot of the Azure AI Studio portal showing how to see project settings." lightbox="../media/cost-management/project-costs/project-settings-go-view-costs.png":::

1. Select **See project cost on Azure portal**. The Azure portal opens to the cost analysis page for your project. 

1. Expand the **Resource** column to see the costs for each service that's underlying your [Azure AI project](../concepts/ai-resources.md#project-assets). But this view doesn't include costs for all resources that you use in an Azure AI Studio project.

    :::image type="content" source="../media/cost-management/project-costs/costs-per-project-resource.png" alt-text="Screenshot of the Azure portal cost analysis with the Azure AI project and associated resources." lightbox="../media/cost-management/project-costs/costs-per-project-resource.png":::

1. Select **Costs by resource** > **Resources**.

    :::image type="content" source="../media/cost-management/project-costs/select-costs-per-resource.png" alt-text="Screenshot of the Azure portal cost analysis with the button to select costs by resources." lightbox="../media/cost-management/project-costs/select-costs-per-resource.png":::

1. On the **Cost analysis** page where you're taken to, make sure the scope is set to your resource group. 

    :::image type="content" source="../media/cost-management/project-costs/costs-per-resource-group-details.png" alt-text="Screenshot of the Azure portal cost analysis for a resource group." lightbox="../media/cost-management/project-costs/costs-per-resource-group-details.png":::

    In this example:
    - The resource group name is **rg-contosoairesource**.
    - The total cost for all resources and services in the resource group is **$222.97**. In this example, this is the total cost for your application or solution that you're building with Azure AI Studio. Again, this assumes that all Azure AI Studio resources are in the same resource group. But you can have resources in different resource groups.
    - The project name is **contoso-outdoor-proj**.
    - The costs that are limited to resources and services in the [Azure AI project](../concepts/ai-resources.md#project-assets) total **$212.06**. 
    
1. Expand **contoso-outdoor-proj** to see the costs for services underlying the [Azure AI project](../concepts/ai-resources.md#project-assets) resource. 

    :::image type="content" source="../media/cost-management/project-costs/costs-per-project-resource-details.png" alt-text="Screenshot of the Azure portal cost analysis with Azure AI project expanded." lightbox="../media/cost-management/project-costs/costs-per-project-resource-details.png":::

1. Expand **contoso_ai_resource** to see the costs for services underlying the [Azure AI](../concepts/ai-resources.md#azure-ai-resources) resource. You can also apply a filter to focus on other costs in your resource group. 

You can also view resource group costs directly from the Azure portal. To do so:
1. Sign in to [Azure portal](https://portal.azure.com).
1. Select **Resource groups**. 
1. Find and select the resource group that contains your Azure AI Studio resources.
1. From the left navigation menu, select **Cost analysis**.

    :::image type="content" source="../media/cost-management/project-costs/costs-per-resource-group.png" alt-text="Screenshot of the Azure portal cost analysis at the resource group level." lightbox="../media/cost-management/project-costs/costs-per-resource-group.png":::

For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

### Monitor costs for models offered through the Azure Marketplace

Models deployed as a service using pay-as-you-go are offered through the Azure Marketplace. The model publishers might apply different costs depending on the offering. Each project in Azure AI Studio has its own subscription with the offering, which allows you to monitor the costs and the consumption happening on that project. Use [Microsoft Cost Management](https://azure.microsoft.com/products/cost-management) to monitor the costs:

1. Sign in to [Azure portal](https://portal.azure.com).

1. On the left navigation area, select **Cost Management + Billing** and then, on the same menu, select **Cost Management**.

1. On the left navigation area, under the section **Cost Management**, select now **Cost Analysis**.

1. Select a view such as **Resources**. The cost associated with each resource is displayed.

    :::image type="content" source="../media/cost-management/marketplace/costs-model-as-service-cost-analysis.png" alt-text="A screenshot of the Cost Analysis tool displaying how to show cost per resource." lightbox="../media/cost-management/marketplace/costs-model-as-service-cost-analysis.png":::

1. On the **Type** column, select the filter icon to filter all the resources of type **microsoft.saas/resources**. This type corresponds to resources created from offers from the Azure Marketplace. For convenience, you can filter by resource types containing the string **SaaS**. 

    :::image type="content" source="../media/cost-management/marketplace/costs-model-as-service-cost-filter.png" alt-text="A screenshot of how to filter by resource type containing the string 'SaaS'." lightbox="../media/cost-management/marketplace/costs-model-as-service-cost-filter.png":::

1. One resource is displayed for each model offer per project. Naming of those resources is `[Model offer name]-[GUID]`.

1. Select to expand the resource details to get access to each of the costs meters associated with the resource. 

    - **Tier** represents the offering.
    - **Product** is the specific product inside the offering. 
    
    Some model providers might use the same name for both.

    :::image type="content" source="../media/cost-management/marketplace/costs-model-as-service-cost-details.png" alt-text="A screenshot showing different resources corresponding to different model offers and their associated meters." lightbox="../media/cost-management/marketplace/costs-model-as-service-cost-details.png":::

    > [!TIP]
    > Remember that one resource is created per each project, per each plan your project subscribes to.

1. When expanding the details, costs are reported per each of the meters associated with the offering. Each meter might track different sources of costs like inferencing, or fine tuning. The following meters are displayed (when some cost is associated with them):

    | Meter | Group | Description |
    |-----|-----|-----|
    | `paygo-inference-input-tokens` | Base model | Costs associated with the tokens used as input for inference of a base model. |
    | `paygo-inference-output-tokens` | Base model | Costs associated with the tokens generated as output for the inference of base model.|
    | `paygo-finetuned-model-inference-hosting` | Fine-tuned model | Costs associated with the hosting of an inference endpoint for a fine-tuned model. This isn't the cost of hosting the model, but the cost of having an endpoint serving it. |
    | `paygo-finetuned-model-inference-input-tokens`  | Fine-tuned model | Costs associated with the tokens used as input for inference of a fine tuned model. |
    | `paygo-finetuned-model-inference-output-tokens` | Fine-tuned model | Costs associated with the tokens generated as output for the inference of a fine tuned model. |


## Create budgets

You can create [budgets](../../cost-management-billing/costs/tutorial-acm-create-budgets.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to manage costs and create [alerts](../../cost-management-billing/costs/cost-mgt-alerts-monitor-usage-spending.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) that automatically notify stakeholders of spending anomalies and overspending risks. Alerts are based on spending compared to budget and cost thresholds. Budgets and alerts are created for Azure subscriptions and resource groups, so they're useful as part of an overall cost monitoring strategy. 

Budgets can be created with filters for specific resources or services in Azure if you want more granularity present in your monitoring. Filters help ensure that you don't accidentally create new resources that cost you more money. For more about the filter options when you create a budget, see [Group and filter options](../../cost-management-billing/costs/group-filter.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).

## Export cost data

You can also [export your cost data](../../cost-management-billing/costs/tutorial-export-acm-data.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) to a storage account. This is helpful when you or others need to do more data analysis for costs. For example, finance teams can analyze the data using Excel or Power BI. You can export your costs on a daily, weekly, or monthly schedule and set a custom date range. Exporting cost data is the recommended way to retrieve cost datasets.


## Understand the full billing model for Azure AI services

Azure AI services run on Azure infrastructure that accrues costs along with Azure AI when you deploy the new resource. It's important to understand that extra infrastructure might accrue cost. You need to manage that cost when you make changes to deployed resources.

When you create or use Azure AI services resources, you might get charged based on the services that you use. There are two billing models available for Azure AI services: 

- Pay-as-you-go: Pay-as-you-go pricing, you're billed according to the Azure AI services offering that you use, based on its billing information.
- Commitment tiers: With commitment tier pricing, you commit to using several service features for a fixed fee, enabling you to have a predictable total cost based on the needs of your workload. You're billed according to the plan you choose. See [Quickstart: purchase commitment tier pricing](../../ai-services/commitment-tier.md) for information on available services, how to sign up, and considerations when purchasing a plan.

> [!NOTE]
> If you use the resource above the quota provided by the commitment plan, you will be charged for the additional usage as per the overage amount mentioned in the Azure portal when you purchase a commitment plan. 

You can pay for Azure AI services charges with your Azure Prepayment (previously called monetary commitment) credit. However, you can't use Azure Prepayment credit to pay for charges for third-party products and services including those from the Azure Marketplace.

For more information, see the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/).

## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
