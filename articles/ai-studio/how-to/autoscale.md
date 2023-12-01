---
title: Autoscale Azure AI limits
titleSuffix: Azure AI Studio
description: Learn how you can manage and increase quotas for resources with Azure AI Studio.
author: eric-urban
manager: nitinme
ms.service: azure-ai-studio
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 11/15/2023
ms.author: eur
---

# Autoscale Azure AI limits

[!INCLUDE [Azure AI Studio preview](../includes/preview-ai-studio.md)]

This article provides guidance for how you can manage and increase quotas for resources with Azure AI Studio.

## Overview

Each Azure AI services resource has a preconfigured static call rate (transactions per second) which limits the number of concurrent calls that you can make to the backend service in a given time frame. The autoscale feature automatically increases or decreases your resource's rate limits based on near or real-time resource usage metrics and backend service capacity metrics.

## Get started with the autoscale feature

This feature is disabled by default for every new resource. Follow these instructions to enable it.

#### [Azure portal](#tab/portal)

Go to your resource's page in the Azure portal, and select the **Overview** tab on the left pane. Under the **Essentials** section, find the **Autoscale** line and select the link to view the **Autoscale Settings** pane and enable the feature.

:::image type="content" source="../../ai-services/media/cognitive-services-autoscale/portal-autoscale.png" alt-text="Screenshot of the Azure portal with the autoscale pane on right." lightbox="../../ai-services/media/cognitive-services-autoscale/portal-autoscale.png":::

#### [Azure CLI](#tab/cli)

Run this command after you create your resource:

```azurecli
az resource update --namespace Microsoft.CognitiveServices --resource-type accounts --set properties.dynamicThrottlingEnabled=true --resource-group {resource-group-name} --name {resource-name}

```

---

## Frequently asked questions

### Does enabling the autoscale feature mean my resource is never throttled again?

No, you might still get `429` errors for rate limit excess. If your application triggers a spike, and your resource reports a `429` response, autoscale checks the available capacity projection section to see whether the current capacity can accommodate a rate limit increase and respond within five minutes.

If the available capacity is enough for an increase, autoscale gradually increases the rate limit cap of your resource. If you continue to call your resource at a high rate that results in more `429` throttling, your TPS rate will continue to increase over time. If this action continues for one hour or more, you should reach the maximum rate (up to 1000 TPS) currently available at that time for that resource.

If the available capacity isn't enough for an increase, the autoscale feature waits five minutes and checks again.

### What if I need a higher default rate limit?

By default, Azure AI services resources have a default rate limit of 10 TPS. If you need a higher default TPS, submit a ticket by following the **New Support Request** link on your resource's page in the Azure portal. Remember to include a business justification in the request.

### Does autoscale increase my Azure spend? 

Azure AI services pricing hasn't changed and can be accessed [here](https://azure.microsoft.com/pricing/details/cognitive-services/). We'll only bill for successful calls made to Azure AI services APIs. However, increased call rate limits mean more transactions are completed, and you might receive a higher bill.

Be aware of potential errors and their consequences. If a bug in your client application causes it to call the service hundreds of times per second, that would likely lead to a higher bill, whereas the cost would be much more limited under a fixed rate limit. Errors of this kind are your responsibility. We highly recommend that you perform development and client update tests against a resource with a fixed rate limit prior to using the autoscale feature.

### Can I disable this feature if I'd rather limit the rate than have unpredictable spending?

Yes, you can disable the autoscale feature through Azure portal or CLI and return to your default call rate limit setting. If your resource was previously approved for a higher default TPS, it goes back to that rate. It can take up to five minutes for the changes to go into effect.

### Which services support the autoscale feature?

Autoscale feature is available for several Azure AI services. For more information, see [Azure AI services rate limits](../../ai-services/autoscale.md#which-services-support-the-autoscale-feature).

### Can I test this feature using a free subscription?

No, the autoscale feature isn't available to free tier subscriptions.

## Next steps

* [Plan and manage costs for Azure AI](costs-plan-manage.md).
* [Optimize your cloud investment with Microsoft Cost Management](../../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
* Learn about how to [prevent unexpected costs](../../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
* Take the [Cost Management](/training/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.
