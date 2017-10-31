---
# Mandatory fields. See more on aka.ms/skyeye/meta.
title: Upgrade and scale an Azure API Management instance | Microsoft Docs
description: This topic describes how to upgrade and scale an Azure API Management instance.
services: api-management
documentationcenter: ''
author: vladvino
manager: anneta
editor: ''

ms.service: api-management
ms.workload: integration
ms.topic: article
ms.date: 08/17/2017
ms.author: apimpm
---

# Upgrade and scale an API Management instance 

Customers can scale an API Management (APIM) instance by adding and removing units. A **unit** is comprised of dedicated Azure resources and has a certain load-bearing capacity expressed as a number of API calls per month. Actual throughput and latency will vary broadly depending on on factors such as number and rate of concurrent connections, the kind and number of configured policies, request and response sizes and backend latency. 

Capacity and price of each unit depends on a **tier** in which the unit exists. You can choose between three tiers: **Developer**, **Standard**, **Premium**. If you need to increase capacity for a service within a tier, you should add a unit. If the tier that is currently selected in your APIM instance does not allow adding more units, you need to upgrade to a higher-level tier. 

The price of each unit, the ability to add/remove units, whether or not you have certain features (for example, multi-region deployment) depends on the tier that you chose for your APIM instance. The [pricing details](https://azure.microsoft.com/pricing/details/api-management/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) article, explains what price per unit and features you get in each tier. 

>[!NOTE]
>The [pricing details](https://azure.microsoft.com/pricing/details/api-management/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) article shows approximate numbers of unit capacity in each tier. To get more accurate numbers, you need to look at a realistic scenario for your APIs. See the "How to plan for capacity" section that follows.

## Prerequisites

To perform the steps described in this article, you must have:

+ An active Azure subscription.

    [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

+ An APIM instance. For more information, see [Create an Azure API Management instance](get-started-create-service-instance.md).

## How to plan for capacity?

To find out if you have enough units to handle your traffic, test on workloads that you expect. 

As mentioned above, the number of requests per second APIM can process depends on many variables. For example, the connection pattern, the size of the request and response, policies that are configured on each API, number of clients that are sending requests.

Use **Metrics** (uses Azure Monitor capabilities) to understand how much capacity is used at any given time.

### Use the Azure portal to examine metrics 

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **Metrics**.
3. Select **Capacity** metric from **Available metrics**. 

    The capacity metric, gives you some idea of how much capacity is being used in your tenant. You can test by putting more and more load and see what is your pick load. You can set a metric alert to let you know when something that is not expected is happening. For example, your APIM instance accedes capacity for over 5 min. 

    >[!TIP]
    > You can configure alert to let you know when your service running low on capacity or make it call into a logic app that will automatically scale by adding a unit..

## Upgrade and scale 

As mentioned previously, you can choose between three tiers: **Developer**, **Standard**, **Premium**. The **Developer** tier should be used to evaluate the service; it should not be used for production. The **Developer** tier does not have SLA and you cannot scale this tier (add/remove units). 

**Standard** and **Premium** are production tiers have SLA and can be scaled. The **Standard** tier can be scaled to up to four units. You can add any number of units to the **Premium** tier. 

The **Premium** tier enables you to distribute a single API management instance across any number of desired Azure regions. When you initially create an API Management service, the instance contains only one unit and resides in a single Azure region. The initial region is designated as the **primary** region. Additional regions can be easily added. When adding a region, you specify the number of units you want to allocate. For example, you can have one unit in the **primary** region and five units in some other region. You can tailor to whatever traffic you have in each region. For more information, see [How to deploy an Azure API Management service instance to multiple Azure regions](api-management-howto-deploy-multi-region.md).

You can upgrade and downgrade to and from any tier. Please note that downgrading can remove some features, for example, VNETs or multi-region deployment, when downgrading to Standard from the Premium tier.

>[!NOTE]
>The upgrade or scale process can take from 15 to 30 minutes to apply. You get notification when it is done.

### Use the Azure portal to upgrade and scale

1. Navigate to your APIM instance in the [Azure portal](https://portal.azure.com/).
2. Select **Scale and pricing**.
3. Pick the desired tier.
4. Specify the number of **units** you want to add. You can either use the slider or type the number of units.<br/>
    If you choose the **Premium** tier, you first need to select a region.
5. Press **Save**

## Next steps

[How to deploy an Azure API Management service instance to multiple Azure regions](api-management-howto-deploy-multi-region.md)

