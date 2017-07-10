---
title: Migrate pricing tiers of endpoints from Custom Speech Service on Azure | Microsoft Docs
description: Learn how to migrate deployments from tiers S0 and S1 to S2 of Custom Speech Service endpoints in Cognitive Services.
services: cognitive-services
author: PanosPeriorellis
manager: onano

ms.service: cognitive-services
ms.technology: custom-speech-service
ms.topic: article
ms.date: 07/05/2017
ms.author: panosper
---



# How to migrate deployments from pricing model to new pricing model
Since beginning of July 2017, the Custom Speech Service offers a [new pricing model](https://azure.microsoft.com/en-us/pricing/details/cognitive-services/custom-speech-service/ ). The new model is **easier to understand**, **simpler to calculate costs**, and **more flexible** in terms of scaling. For scaling, we are introducing the concept of a scale unit. Each scale unit can handle five concurrent requests. The scaling for concurrent requests was fixed in the old model to 5 concurrent request for S0 and 12 concurrent request for S1. We are opening these limits to enable you to be more flexible with regards to your use case requirements.

If you run on old S0 or S1 tier we recommend migrating your existing deployments to the new tier (S2) no matter . The new S2 tier covers both S0 and S1 tier. You can see the available options in the following figure:

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-pricing-tier.png)


We can handle the migration in a semi-automated way. You must trigger it by selecting the new pricing tier. Then, we handle the migration of your deployment automatically.
The mapping from old tiers to scale units is as follows:

| Tier | Concurrent request (old model) | Migration | Concurrent requests |
|----- | ----- | ---- | ---- |
| S0 | 	5	|	=> **S2** with 1 scale unit |	5 |
| S1 |	12	|	=> **S2** with 3 scale units |	15 |

To migrate to the new tier, follow the steps:

## Step 1: Check your existing deployment
Go to the [Custom Speech Service portal](http://cris.ai) and check your existing deployments. In our example, there are two deployments. One deployment runs on an S0 tier and the other one runs on an S1 tier (see _Deployment Options_).

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-deployments.png)

## Step 2: Go to your Azure portal and select the new pricing tier
Now, open another tab and log in to the [Azure portal](http://ms.portal.azure.com/) and find your custom speech subscription in the list of all resources. Select the correct subscription, which opens a tile in which you can select _Pricing tier_.

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-update-tier.png)

Next, select _S2 Standard_ on the pricing tier tile. This pricing tier is the new, simplified, and more flexible pricing tier and click on **Select**.

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-update-pricing.png)

## Step 3: Check migration status on Custom Speech Service portal
Now, go back to your Custom Speech Service portal and check your deployments (do not forget to refresh the browser in case it was still open!). Probably, you might see that the related deployment switched the _State_ into _Processing_ or you can already validate the migration by checking the _Deployment Options_.

In  _Deployment Options_,  you find information about scale units and logging now. The scale units should reflect you previous paying tier as explained. The logging should be turned on.

In our example, we get after migration the following result:

![try](../../../media/cognitive-services/custom-speech-service/custom-speech-deployments-new.png)



> [!NOTE]
> In case there are problems during the migration, contact us.
>

## Next steps
Now you are ready to follow up with the next steps:

* Try to adapt your [custom acoustic model](cognitive-services-custom-speech-create-acoustic-model.md)
* Try to adapt your [custom language model](cognitive-services-custom-speech-create-language-model.md)
* [How to use a custom speech-to-text endpoint](cognitive-services-custom-speech-create-endpoint.md)
