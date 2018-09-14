---
title: Service quotas and limits for Azure Batch AI | Microsoft Docs
description: Learn about default Azure Batch AI quotas, limits, and constraints, and how to request quota increases
services: batch-ai
documentationcenter: ''
author: johnwu10
manager: jeconnoc
editor: ''

ms.service: batch-ai
ms.topic: article
ms.date: 08/08/2018
ms.author: danlep
ms.custom: mvc

---
# Batch AI service quotas and limits

As with other Azure services, there are limits on certain resources associated with the Batch AI service. In Batch AI, these limits are default quotas applied at the subscription level for each region where the service is [available](https://azure.microsoft.com/global-infrastructure/services/). This article discusses those defaults, and how you can request quota increases.

Keep these quotas in mind as you design and scale up your Batch AI resources. For example, if your cluster doesn't reach the target number of nodes you specified, then you might have reached a Batch AI cores limit for your subscription.

If you plan to run production workloads in Batch AI, you may need to increase one or more of the quotas above the default.

> [!NOTE]
> A quota is a credit limit, not a capacity guarantee. If you have large-scale capacity needs, please contact Azure support.
> 
> 

## Resource quotas

In Batch AI, there is a default quota limit on both the number of cores and number of clusters allowed per region in a subscription.

| **Resource** | **Default limit** | **Maximum limit** |
| --- | --- | --- |
| Dedicated cores per region | 10 - 24 | N/A<sup>1</sup> |
| Low-priority cores per region | 10 - 24 | N/A<sup>2</sup> |
| Clusters per region | 20 | 200<sup>3</sup> |

> [!NOTE]
> Default limits vary depending on the type of subscription you have.

<sup>1</sup> The number of dedicated cores per Batch AI subscription can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>2</sup> The number of low-priority cores per Batch AI subscription can be increased, but the maximum number is unspecified. Contact Azure support to discuss increase options.

<sup>3</sup> Contact Azure support if you want to request an increase beyond this limit.

## Other limits

The following are strict limits, which cannot be exceeded once hit.

| **Resource** | **Maximum limit** |
| --- | --- |
| Maximum workspaces per resource group | 800 |
| Maximum cluster size | 100 nodes |
| Maximum GPU MPI processes per node | 1-4 |
| Maximum GPU workers per node | 1-4 |
| Maximum job lifetime | 7 days<sup>1</sup> |
| Maximum parameter servers per node | 1 |

<sup>1</sup> The maximum lifetime refers to the time that a job begins running and when it completes. Completed jobs persist indefinitely; data for jobs not completed within the maximum lifetime is not accessible.

## View Batch AI quotas

View your current Batch AI subscription quotas in the [Azure portal][portal].

1. On the left pane, click on **All services**. Then search for **Batch AI** and click to open the service.
2. Click on **Usage + quotas** on the Batch AI menu.
3. Select your subscription to view the quota limits.

## Increase a Batch AI cores quota

Follow these steps to request a quota increase for your Batch AI subscription using the [Azure portal][portal]. 

1. On the left pane, click on **All services**. Then search for **Batch AI** and click to open the service.
2. Click on **New support request** on the Batch AI menu.
3. In **Basics**:
   
    a. **Issue Type** > **Quota**
   
    b. **Subscription** > Select your subscription.
   
    c. **Quota type** > **Batch AI**
   
    d. **Support plan** > Select your support plan.

    Click **Next**.
4. In **Problem**:
   
    a. Select a **Severity** according to your [business impact][support_sev].
   
    b. In **Quota Details**, specify the location, quota type, and resource type. Specify the new limit you want to request. Click **Save and continue**.

    c. Optional - Upload any relevant files with more information regarding your reason for increase.
   
    Click **Next**.
5. In **Contact information**:
   
    a. Select a **Preferred contact method**.
   
    b. Verify and enter the required contact details.
   
    Click **Create** to submit the support request.

Once you've submitted your support request, Azure support will contact you. Completing the request can take up to 2 business days.


## Next steps

After becoming familiar with the quota limits, check out the following articles for getting started with using Batch AI.

> [!div class="nextstepaction"]
> [Batch AI quick start tutorial](quickstart-tensorflow-training-cli.md)
> [Batch AI recipes](https://github.com/Azure/BatchAI/tree/master/recipes)
> [Learn more about Batch AI resources](resource-concepts.md)

[portal]: https://portal.azure.com
[support_sev]: http://aka.ms/supportseverity