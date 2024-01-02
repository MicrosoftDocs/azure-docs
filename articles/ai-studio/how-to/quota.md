---
title: Manage and increase quotas for resources with Azure AI Studio
titleSuffix: Azure AI Studio
description: This article provides instructions on how to manage and increase quotas for resources with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.reviewer: eur
ms.author: eur
---

# Manage and increase quotas for resources with Azure AI Studio

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

Quota provides the flexibility to actively manage the allocation of rate limits across the deployments within your subscription. This article walks through the process of managing quota for your Azure AI Studio virtual machines and Azure OpenAI models.

Azure uses limits and quotas to prevent budget overruns due to fraud, and to honor Azure capacity constraints. It's also a good way to control costs for admins. Consider these limits as you scale for production workloads. 

In this article, you learn about: 

- Default limits on Azure resources  
- Creating Azure AI resource-level quotas. 
- Viewing your quotas and limits 
- Requesting quota and limit increases 

## Special considerations 

Quotas are applied to each subscription in your account. If you have multiple subscriptions, you must request a quota increase for each subscription. 

A quota is a credit limit on Azure resources, not a capacity guarantee. If you have large-scale capacity needs, contact Azure support to increase your quota. 

> [!NOTE]
> Azure AI Studio compute has a separate quota from the core compute quota. 

Default limits vary by offer category type, such as free trial, pay-as-you-go, and virtual machine (VM) series (such as Dv2, F, and G). 

 
## Azure AI Studio quota 

The following actions in Azure AI Studio consume quota: 

- Creating a compute instance 
- Building a vector index 
- Deploying open models from model catalog 

## Azure AI Studio compute 

[Azure AI Studio compute](./create-manage-compute.md) has a default quota limit on both the number of cores and the number of unique compute resources that are allowed per region in a subscription. 

- The quota on the number of cores is split by each VM Family and cumulative total cores.
- The quota on the number of unique compute resources per region is separate from the VM core quota, as it applies only to the managed compute resources  

To raise the limits for compute, you can [request a quota increase](#view-and-request-quotas-in-the-studio) in the Azure AI Studio portal.


Available resources include:
- Dedicated cores per region have a default limit of 24 to 300, depending on your subscription offer type. You can increase the number of dedicated cores per subscription for each VM family. Specialized VM families like NCv2, NCv3, or ND series start with a default of zero cores. GPUs also default to zero cores. 
- Total compute limit per region has a default limit of 500 per region within a given subscription and can be increased up to a maximum value of 2500 per region. This limit is shared between compute instances, and managed online endpoint deployments. A compute instance is considered a single-node cluster for quota purposes. In order to increase the total compute limit, [open an online customer support request](https://portal.azure.com/#view/Microsoft_Azure_Support/NewSupportRequestV3Blade/callerWorkflowId/5088c408-f627-4398-9aa3-c41cdd93a6eb/callerName/Microsoft_Azure_Support%2FHelpAndSupportOverview.ReactView). 

When opening the support request to increase the total compute limit, provide the following information:
1. Select **Technical** for the issue type. 
1. Select the subscription that you want to increase the quota for. 
1. Select **Machine Learning** as the service type. 
1. Select the resource that you want to increase the quota for.
1. In the **Summary** field, enter "Increase total compute limits" 
1. Select **Compute instance** the problem type and **Quota** as the problem subtype.

    :::image type="content" source="../media/cost-management/quota-azure-portal-support.png" alt-text="Screenshot of the page to submit compute quota requests in Azure portal." lightbox="../media/cost-management/quota-azure-portal-support.png":::

1. Select **Next**.
1. On the **Additional details** page, provide the subscription ID, region, new limit (between 500 and 2500) and business justification to increase the total compute limits for the region. 
1. Select **Create** to submit the support request ticket. 

## Azure AI Studio shared quota 

Azure AI Studio provides a pool of shared quota that is available for different users across various regions to use concurrently. Depending upon availability, users can temporarily access quota from the shared pool, and use the quota to perform testing for a limited amount of time. The specific time duration depends on the use case. By temporarily using quota from the quota pool, you no longer need to file a support ticket for a short-term quota increase or wait for your quota request to be approved before you can proceed with your workload. 

Use of the shared quota pool is available for testing inferencing for Llama models from the Model Catalog. You should use the shared quota only for creating temporary test endpoints, not production endpoints. For endpoints in production, you should [request dedicated quota](#view-and-request-quotas-in-the-studio). Billing for shared quota is usage-based, just like billing for dedicated virtual machine families. 

## Container Instances 

For more information, see [Container Instances limits](../../azure-resource-manager/management/azure-subscription-service-limits.md#container-instances-limits). 

## Storage

Azure Storage has a limit of 250 storage accounts per region, per subscription. This limit includes both Standard and Premium storage accounts  

## View and request quotas in the studio 

Use quotas to manage compute target allocation between multiple Azure AI resources in the same subscription. 

By default, all Azure AI resources share the same quota as the subscription-level quota for VM families. However, you can set a maximum quota for individual VM families for more granular cost control and governance on Azure AI resources in a subscription. Quotas for individual VM families let you share capacity and avoid resource contention issues. 

In Azure AI Studio, select **Manage** from the top menu. Select **Quota** to view your quota at the subscription level in a region for both Azure Machine Learning virtual machine families and for your Azure Open AI resources. 

:::image type="content" source="../media/cost-management/quota-manage.png" alt-text="Screenshot of the page to view and request quota for virtual machines and Azure OpenAI models." lightbox="../media/cost-management/quota-manage.png":::

To request more quota, select the **Request quota** button for subscription and region.

## Next steps 

- [Plan to manage costs](./costs-plan-manage.md)
- [How to create compute](./create-manage-compute.md)


 

 

