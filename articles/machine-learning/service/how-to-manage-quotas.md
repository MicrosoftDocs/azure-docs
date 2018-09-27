---
title: How to manage and request quotas for Azure Machine Learning service
description: This how-to guide explains the various quotas on resources for Azure Machine Learning and how to view and request more quota.
services: machine-learning
ms.service: machine-learning
ms.component: core
ms.topic: conceptual

ms.reviewer: jmartens
author: nishankgu
ms.author: nigup
ms.date: 9/24/2018
---

# Manage and request quotas for Azure resources

As with other Azure services, there are limits on certain resources associated with the Azure Machine Learning service. These limits range from a cap on the number of workspaces you can create to limits on the actual underlying compute that gets used for training or inferencing your models. This article gives more details on the pre-configured limits on various Azure resources for your subscription and also contains handy links to request quota enhancements for each type of resource.

Keep these quotas in mind as you design and scale up your Azure ML resources. For example, if your cluster doesn't reach the target number of nodes you specified, then you might have reached a Batch AI cores limit for your subscription. If you plan to run production workloads in Batch AI, you may need to increase one or more of the quotas above the default. If you want to raise the limit or quota above the Default Limit, open an online customer support request at no charge. The limits can't be raised above the Maximum Limit value shown in the following tables. If there is no Maximum Limit column, then the resource doesn't have adjustable limits. 

## Special considerations

+ A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, contact Azure support.

+ Your quota is shared across all the services, except for Batch AI, in your subscription, Azure Machine Learning being one of them. Be sure to calculate the quota usage across all services when evaluating your capacity needs.

+ Default limits vary by offer Category Type, such as Free Trial, Pay-As-You-Go, and series, such as Dv2, F, G, and so on.

## Default resource quotas

Here is a breakdown of the quota limits by various resource types within your Azure subscription. 

> [!Important]
> Limits are subject to change. The latest can always be found at the service-level quota [document](https://docs.microsoft.com/azure/azure-subscription-service-limits/) for all of Azure.

### Virtual machines 
There is a limit on the number of virtual machines you can provision on an Azure subscription across your services or in a standalone manner. This limit is at the region level both on the total cores and also on a per family basis.

It is important to emphasize that virtual machine cores have a regional total limit and a regional per size series (Dv2, F, etc.) limit that are separately enforced. For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30. This subscription would be allowed to deploy 30 A1 VMs, or 30 D1 VMs, or a combination of the two not to exceed a total of 30 cores (for example, 10 A1 VMs and 20 D1 VMs).

[!INCLUDE [azure-subscription-limits-azure-resource-manager](../../../includes/azure-subscription-limits-azure-resource-manager.md)]

For a more detailed and up-to-date list of quota limits, check the Azure-wide quota article [here](https://docs.microsoft.com/azure/azure-subscription-service-limits#subscription-limits-1).

### Batch AI clusters
In Batch AI, there is a default quota limit on both the number of cores and number of clusters allowed per region in a subscription. Batch AI quota is separate from the VM core quota above and the core limits are not shared currently between the two resource types.

Available resources:
+ Dedicated cores per region have a default limit of 10 - 24.  The number of dedicated cores per Batch AI subscription can be increased. Contact Azure support to discuss increase options.

+ Low-priority cores per region have a default limit of 10 - 24.  The number of low-priority cores per Batch AI subscription can be increased. Contact Azure support to discuss increase options.

+ Clusters per region have a default limit of 20 and a maximum limit of 200. Contact Azure support if you want to request an increase beyond this limit.

For a more detailed and up-to-date list of quota limits, check the Azure-wide quota article [here](https://docs.microsoft.com/azure/azure-subscription-service-limits#batch-ai-limits).

### Container instances

There is also a limit on the number of container instances that you can spin up in a given time period (scoped hourly) or across your entire subscription.

[!INCLUDE [container-instances-limits](../../../includes/container-instances-limits.md)]

For a more detailed and up-to-date list of quota limits, check the Azure-wide quota article [here](https://docs.microsoft.com/azure/azure-subscription-service-limits#container-instances-limits).

### Storage
There is a limit on the number of storage accounts per region as well in a given subscription. The default limit is 200 and includes both Standard and Premium Storage accounts. If you require more than 200 storage accounts in a given region, make a request through [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/). The Azure Storage team will review your business case and may approve up to 250 storage accounts for a given region.


## Find your quotas

Viewing your quota for various resources, such as Virtual Machines, Storage, Network, is easy through the Azure portal.

1. On the left pane, select **All services** and then select **Subscriptions** under the General category.

1. From the list of subscriptions, select the subscription whose quota you are looking for.

   **There is a caveat**, specifically for viewing the Batch AI quota. As mentioned above, that quota is separate from the compute quota on your subscription. 
   For Batch AI, after selecting **All services**, search for Batch AI and open the service.

1. Under **Settings**, select **Usage + quotas** to view your current quota limits and usage.

1. Select your subscription to view the quota limits. Remember to filter to the service and region you are interested in.


## Request quota increases

If you want to raise the limit or quota above the default limit, [open an online customer support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/) at no charge. 

The limits can't be raised above the maximum limit value shown in the tables. If there is no maximum limit, then the resource doesn't have adjustable limits. [This](https://docs.microsoft.com/azure/azure-resource-manager/resource-manager-quota-errors) article covers the quota increase process in more detail.

When requesting a quota increase, you need to select the service you are requesting to raise the quota against, which could be services such as AzureML quota, Batch AI quota, or Storage quota. 

> [!NOTE]
> [Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) are not eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade Azure Free Trial to Pay-As-You-Go](../../billing/billing-upgrade-azure-subscription.md) and  [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).
