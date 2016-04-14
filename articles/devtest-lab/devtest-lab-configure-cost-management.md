<properties
	pageTitle="Configure cost management | Microsoft Azure"
	description="Learn how to configure your DevTest Lab cost management features."
	services="devtest-lab,virtual-machines"
	documentationCenter="na"
	authors="tomarcher"
	manager="douge"
	editor=""/>

<tags
	ms.service="devtest-lab"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/13/2016"
	ms.author="tarcher"/>

# Configure cost management

## Overview

The Cost Management feature of DevTest Labs helps you track and control the cost of your lab. 
This article illustrates how to use the **Monthly Estimated Cost Trend** chart  
to view the current month's estimated cost-to-date as well as the projected end-of-month cost.

## Monthly Estimated Cost Trend

In order to view (and change) the policies for a lab, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Tap **Browse**, and then tap **DevTest Labs** from the list.

1. From the list of labs, tap the desired lab.   

1. Tap **Settings**.

	![Settings](./media/devtest-lab-configure-cost-management/lab-blade-settings.png)

1. On the lab's **Settings** blade, under **Cost Policies**, tap **Cost Thresholds**.

	![Menu](./media/devtest-lab-configure-cost-management/menu.png)
 
1. Tap **On** to enable this policy, and **Off** to disable it.

1. Tap **Save**.

Once you enable this policy, it can take up to 24 hours before the graph will display your estimated and projected costs.
Currently, data is refreshed every 24 hours with 90–95% of the cost reported. 
In cases of live site issues - such as outages - it can take more than 24 hours to report the cost.
 
The following screen shot shows an example of a cost graph. 

	![Graph](./media/devtest-lab-configure-cost-management/graph.png)

The **Estimated Cost** value is the current month's estimated cost-to-date while the **Projected Cost** is the estimated
cost for the entire month. 

As the it states above the graph, the costs you see in the graph are *estimated* costs using Pay-As-You-Go offer rates.
Additionally, the following are *not* included in the cost calculation:

- Your offer rates. Currently, we are not able to use your offer rates (shown under your subscription) that you have negotiated with Microsoft or Microsoft partners. We are using Pay-As-You-Go rates.
- Your taxes
- Your discounts
- Your billing currency. Currently, the lab cost is displayed only in USD currency.