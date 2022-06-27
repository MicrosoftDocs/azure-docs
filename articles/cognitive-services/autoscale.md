---
title: Use the Autoscale feature
description: Learn how to use the Autoscale feature for Cognitive Services to dynamically adjust the rate limit of your service.
author: PatrickFarley
ms.author: pafarley
ms.service: cognitive-services
ms.topic: how-to
ms.date: 06/27/2022
---

# Cognitive Services Autoscale Feature

This article provides guidance for how customers can access higher rate limits on their cognitive service resources.

## Overview

Each Cognitive Services resource has a preconfigured static call rate (transactions per second) which limits the number of concurrent calls that can be made to the backend service at a given time. To ensure that customers can efficiently use cognitive service resources, the autoscale feature will automatically increase/decrease a customer’s resource’s rate limits based on near real time resource usage metrics and backend service capacity metrics.

## Getting started with the autoscale feature

This feature is disabled by default for every new resource. You can enable the autoscale feature through:

* Azure portal
* CLI

After the resource is created, you can use this command to enable dynamic throttling.

az resource update --namespace Microsoft.CognitiveServices --resource-type accounts --set properties.dynamicThrottlingEnabled=true --resource-group {resource-group-name} --name {resource-name}

## Frequently Asked Questions

### Does enabling the autoscale feature mean my resource will never be throttled again?

No, you may still get 429 errors. If your application triggers a spike, and your resource reports a 429 response, autoscale will check the available capacity projection section to see whether the current capacity can accommodate a rate limit increase and respond within 5 minutes.

If the available capacity is enough for an increase, autoscale will gradually increase the rate limit cap of your resource. If you continue to call your resource at a high rate which results in more 429 throttling, you can expect your TPS rate to continue to increase over time. After making calls to this resource in this manner for 1 hour or more you should reach the maximum (up to 1000 TPS) current available capacity at that time for the resource.

If the available capacity is not enough for an increase, the autoscale feature will wait 5 minutes and check again.

### What if I need a higher ‘minimum’ rate limit?

By default, cognitive service resources have a default rate limit of 10 TPS. If you need a higher ‘minimum’ TPS, please submit a ‘quota increase’ ticket through our support team. Remember to include your business justification.

### Can I disable this feature if I prefer throttle over unpredictable spend?

Yes, you can disable the autoscale feature through Azure portal or CLI and return to your default call rate limit setting. If your resource was previously approved for a higher TPS, you will go back to that rate. Please note, it can take up to 5min for the changes to go into effect.

### Which cognitive services support the autoscale feature?

Autoscale feature supports the below services:

* Face
* Computer Vision
* Text Analytics

### Will this feature increase my Azure spend? 
Cognitive service pricing has not changed and can be accessed here. We will only bill for successful calls made to cognitive services APIs. However, increased call rate limits means that more transactions will be completed, and you may receive a higher bill.

If you introduce a bug into a client where it now calls our service hundreds of times a second then that would likely lead to a much higher bill, where the impact of something like that would have been more limited if a fixed rate limit was present on the resource. Errors of this nature will be your responsibility - so we highly recommend that you perform development and client update tests against a resource which has a fixed rate limit prior to using the autoscale feature.

### Can I test this feature using a free subscription?

No, the autoscale feature is not available to free tier subscriptions.


## Next steps

- Learn [how to optimize your cloud investment with Azure Cost Management](../cost-management-billing/costs/cost-mgt-best-practices.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn more about managing costs with [cost analysis](../cost-management-billing/costs/quick-acm-cost-analysis.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Learn about how to [prevent unexpected costs](../cost-management-billing/cost-management-billing-overview.md?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn).
- Take the [Cost Management](/learn/paths/control-spending-manage-bills?WT.mc_id=costmanagementcontent_docsacmhorizontal_-inproduct-learn) guided learning course.