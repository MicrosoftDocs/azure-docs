---
title: Endpoint subscription management in LUIS
titleSuffix: Azure Cognitive Services
description: In this article, you create a metered endpoint key for your LUIS account to provide unlimited traffic to your endpoint following a payment plan.
services: cognitive-services
author: diberry
manager: cgronlun
ms.service: cognitive-services
ms.component: language-understanding
ms.topic: article
ms.date: 09/10/2018
ms.author: diberry
---

# Manage Azure endpoint subscription keys

For testing and prototype only, use the free (F0) tier. For production systems, use a [paid](https://aka.ms/luis-price-tier) tier. 

> [!NOTE]
> Do not use the [authoring key](luis-concept-keys.md#authoring-key) for endpoint queries in production.

<a name="create-luis-service"></a>
## Create LUIS endpoint key

1. Sign in to **[Microsoft Azure](https://ms.portal.azure.com/)**. 
2. Click the green **+** sign in the upper left-hand panel and search for “LUIS” in the marketplace, then click on **Language Understanding** and follow the **create experience** to create a LUIS subscription account. 

    ![Azure Search](./media/luis-azure-subscription/azure-search.png) 

3. Configure the subscription with settings including account name, pricing tiers, etc. 

    ![Azure API Choice](./media/luis-azure-subscription/azure-api-choice.png) 

4. Once you create the LUIS service, you can view the access keys generated in **Resource Management->Keys**.  

    ![Azure Keys](./media/luis-azure-subscription/azure-keys.png)

    > [!Note] 
    > Sign in to your region's [LUIS](luis-reference-regions.md) website and [assign the new LUIS endpoint key](luis-how-to-manage-keys.md#assign-endpoint-key). You need the name of the LUIS subscription from step 3.

## Change LUIS pricing tier

1.  In [Azure](https://portal.azure.com), find your LUIS subscription. Click the LUIS subscription.
    ![Find your LUIS subscription](./media/luis-usage-tiers/find.png)
2.  Click **Pricing tier** in order to see the available pricing tiers. 
    ![View pricing tiers](./media/luis-usage-tiers/subscription.png)
3.  Click the pricing tier and click **Select** to save your change. 
    ![Change your LUIS payment tier](./media/luis-usage-tiers/plans.png)
4.  When the pricing change is complete, a pop-up window verifies the new pricing tier. 
    ![Verify your LUIS payment tier](./media/luis-usage-tiers/updated.png)
5. Remember to [assign this endpoint key](luis-how-to-manage-keys.md#assign-endpoint-key) on the **Publish** page and use it in all endpoint queries. 

## Exceed pricing tier usage
Each tier allows endpoint requests to your LUIS account at a specific rate. If the rate of requests is higher than the allowed rate of your metered account per minute or per month, requests receive an HTTP error of "429: Too Many Requests."

Each tier allows accumulative requests per month. If the total requests are higher than the allowed rate, requests receive an HTTP error of "403: forbidden".  

## Viewing summary usage
You can view LUIS usage information in Azure. The **Overview** page shows recent summary information including calls and errors. If you make a LUIS endpoint request, then immediately watch the **Overview page**, allow up to five minutes for the usage to show up.

![Viewing summary usage](./media/luis-usage-tiers/overview.png)

## Customizing usage charts
Metrics provides a more detailed view into the data.

![Default metrics](./media/luis-usage-tiers/metrics-default.png)

You can configure your metrics charts for time period and metric type. 

![Custom metrics](./media/luis-usage-tiers/metrics-custom.png)

## Total transactions threshold alert
If you would like to know when you have reached a certain transaction threshold, for example 10,000 transactions, you can create an alert. 

![Default alerts](./media/luis-usage-tiers/alert-default.png)

Add a metric alert for the **total calls** metric for a certain time period. Add email addresses of all people that should receive the alert. Add webhooks for all systems that should receive the alert. You can also run a logic app when the alert is triggered. 

## Next steps

Learn how to use [versions](luis-how-to-manage-versions.md) to manage changes to your LUIS app.