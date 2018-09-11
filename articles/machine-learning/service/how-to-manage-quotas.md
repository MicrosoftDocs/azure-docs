---
title: How to manage and request quotas  | Microsoft Docs
description: This how-to guide explains the various quotas on resources for Azure Machine Learning and how to view and request more quota.
services: machine-learning
author: nigup
ms.author: nigup
manager:  asutton
ms.service: machine-learning
ms.workload: data-services
ms.custom: mvc
ms.topic: conceptual
ms.date: 9/7/2018
---

# How to manage and request quotas

As with other Azure services, there are limits on certain resources associated with the Azure Machine Learning service. These limits range from a cap on the number of workspaces you can create to limits on the actual underlying compute that gets used for training or inferencing your models. This article gives more details on the pre-configured limits on various Azure resources for your subscription and also contains handy links to request quota enhancements for each type of resource.

Keep these quotas in mind as you design and scale up your Azure ML resources. For example, if your cluster doesn't reach the target number of nodes you specified, then you might have reached a Batch AI cores limit for your subscription. If you plan to run production workloads in Batch AI, you may need to increase one or more of the quotas above the default. If you want to raise the limit or quota above the Default Limit, open an online customer support request at no charge. The limits can't be raised above the Maximum Limit value shown in the following tables. If there is no Maximum Limit column, then the resource doesn't have adjustable limits. 

> [!NOTE]
> A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.
> 
> [!NOTE]
> Your quota (except in case of Batch AI) is shared across all the services in your subscription, Azure Machine Learning being one of them. Be sure to calculate the quota usage across all services when evaluating your capacity needs.
>
> [!NOTE]
> Default limits vary by offer Category Type, such as Free Trial, Pay-As-You-Go, and series, such as Dv2, F, G, etc.
>
>

## Default Resource Quotas

Here is a breakdown of the quota limits by various resource types within your Azure subscription. Please note that these limits might change periodically and the latest can always be found at the service-level quota [document](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits/) for all of Azure.

* __Virtual Machines__ 
There is a limit on the number of virtual machines you can provision on an Azure subscription across your services or in a standalone manner. This limit is at the region level both on the total cores and also on a per family basis.

| Resource | Default Limit | Maximum Limit |
| --- | --- | --- |
| VMs per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |10,000 per Region |10,000 per Region |
| VM total cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20 per Region | Contact support |
| VM per series (Dv2, F, etc.) cores per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) |20 per Region | Contact support |
| vCPUs per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) <sup>1</sup> |20 per Region|10,000 per Region|

For a more detailed and up-to-date list of quota limits, check the Azure-wide quota article [here](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#subscription-limits-1).

> [!NOTE]
> It is important to emphasize that virtual machine cores have a regional total limit as well as a regional per size series (Dv2, F, etc.) limit that are separately enforced. For example, consider a subscription with a US East total VM core limit of 30, an A series core limit of 30, and a D series core limit of 30. This subscription would be allowed to deploy 30 A1 VMs, or 30 D1 VMs, or a combination of the two not to exceed a total of 30 cores (for example, 10 A1 VMs and 20 D1 VMs).
> 
>


* __BatchAI Clusters__ 
In Batch AI, there is a default quota limit on both the number of cores and number of clusters allowed per region in a subscription. Please note that the BatchAI quota is separate from the VM core quota above and the core limits are not shared currently between the two resource types.

| Resource | Default limit | Maximum limit |
| --- | --- | --- |
| Dedicated cores per region | 10 - 24 | N/A<sup>1</sup> |
| Low-priority cores per region | 10 - 24 | N/A<sup>2</sup> |
| Clusters per region | 20 | 200<sup>3</sup> |

<sup>1</sup> The number of dedicated cores per Batch AI subscription can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>2</sup> The number of low-priority cores per Batch AI subscription can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>3</sup> Contact Azure support if you want to request an increase beyond this limit.

For a more detailed list and up-to-date quota limits, check the BatchAI specific quota article [here](https://github.com/MicrosoftDocs/azure-docs-pr/blob/release-ga-batch-ai/articles/batch-ai/quota-limits.md).


* __Container Instances__

There is also a limit on the number of container instances that you can spin up in a given time period (scoped hourly) or across your entire subscription.

| Resource | Default Limit |
| --- | :--- |
| Container groups per [subscription](../articles/billing-buy-sign-up-azure-subscription.md) | 20<sup>1</sup> |
| Number of containers per container group | 60 |
| Number of volumes per container group | 20 |
| Container creates per hour |60<sup>1</sup> |
| Container creates per 5 minutes | 20<sup>1</sup> |


For a more detailed list and up-to-date quota limits, check the Azure-wide quota article [here](https://docs.microsoft.com/en-us/azure/azure-subscription-service-limits#subscription-limits-1).


* __Storage__
There is a limit on the number of storage accounts per region as well in a given subscription. The default limit is 200 and includes both Standard and Premium Storage accounts. If you require more than 200 storage accounts in a given region, make a request through [Azure Support](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/). The Azure Storage team will review your business case and may approve up to 250 storage accounts for a given region.


## Viewing Quotas

Viewing your quota for various resources (Eg. Virtual Machines, Storage, Network) is easy through the Azure Portal.

1. On the left pane, click on All services. Then click on Subscriptions under the General category (it should show up as the first one)
2. From the list of subscriptions, click on the subscription that you want to check the Quota for.
3. In the subscriptions blade that loads, select "Usage + quotas" under Settings to view your current quota limits and usage.
4. Select your subscription to view the quota limits. Remember to filter to the service and region you are interested in.

There is a caveat, specifically for viewing the BatchAI quota. As mentioned above, that quota is separate from the compute quota on your subscription. Here are the steps to view the quota for BatchAI within your subscription:

1. On the left pane, click on All services. Then search for Batch AI and click to open the service.
2. In the BatchAI blade that loads, click on "Usage + quotas" under Settings to view your current quota limits and usage.
3. Select your subscription to view the quota limits. Remember to filter to the region you are interested in.


## Requesting Quota increases

If you want to raise the limit or quota above the Default Limit, [open an online customer support request](https://ms.portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest/) at no charge. The limits can't be raised above the Maximum Limit value shown in the following tables. If there is no Maximum Limit column, then the resource doesn't have adjustable limits. [This](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-manager-quota-errors) article covers the quota increase process in more detail.

> [!NOTE]
> When requesting a quota increase, you need to select the service you are requesting to raise the quota against, which could be any of the above services (eg. AzureML quota, BatchAI quota, or Storage quota). 
>
> [!NOTE]
> [Free Trial subscriptions](https://azure.microsoft.com/offers/ms-azr-0044p) are not eligible for limit or quota increases. If you have a [Free Trial subscription](https://azure.microsoft.com/offers/ms-azr-0044p), you can upgrade to a [Pay-As-You-Go](https://azure.microsoft.com/offers/ms-azr-0003p/) subscription. For more information, see [Upgrade Azure Free Trial to Pay-As-You-Go](billing/billing-upgrade-azure-subscription.md) and  [Free Trial subscription FAQ](https://azure.microsoft.com/free/free-account-faq).
>
