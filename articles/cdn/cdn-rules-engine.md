<properties
	pageTitle="Overriding default HTTP behavior in Azure CDN using the rules engine | Microsoft Azure"
	description="The rules engine allows you to customize how HTTP requests are handled by Azure CDN, such as blocking the delivery of certain types of content, define a caching policy, and modify HTTP headers."
	services="cdn"
	documentationCenter=""
	authors="camsoper"
	manager="erikre"
	editor=""/>

<tags
	ms.service="cdn"
	ms.workload="tbd"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/28/2016"
	ms.author="casoper"/>

# Override default HTTP behavior using the rules engine

[AZURE.INCLUDE [cdn-premium-feature](../../includes/cdn-premium-feature.md)]

## Overview

The rules engine allows you to customize how HTTP requests are handled, such as blocking the delivery of certain types of content, defining a caching policy, and modifying HTTP headers.  This tutorial will demonstrate the creation of a rule that will change the caching behavior of CDN assets.  There's also video content available in the "[See also](#see-also)" section.

## Tutorial

1. From the CDN profile blade, click the **Manage** button.

	![CDN profile blade manage button](./media/cdn-rules-engine/cdn-rules-manage-btn.png)

	The CDN management portal opens.

2. Click on the **HTTP Large** tab, followed by **Rules Engine**.

	Options for a new rule are displayed.

	![CDN new rule options](./media/cdn-rules-engine/cdn-new-rule.png)

	>[AZURE.IMPORTANT] The order in which multiple rules are listed affects how they are handled. A subsequent rule may override the actions specified by a previous rule.
	
3. Enter a name in the **Name / Description** textbox.

4. Identify the type of requests the rule will apply to.  By default, the **Always** match condition is selected.  You'll use **Always** for this tutorial, so leave that selected.

	![CDN match condition](./media/cdn-rules-engine/cdn-request-type.png)

	>[AZURE.TIP] There are many types of match conditions available in the dropdown.  Clicking on the blue informational icon to the left of the match condition will explain the currently selected condition in detail.
	>
	>For the full list of match conditions in detail, see [Rules Engine Match Condition and Feature Details](cdn-rules-engine-details.md#match-conditions).

5.  Click the **+** button next to **Features** to add a new feature.  In the dropdown on the left, select **Force Internal Max-Age**.  In the textbox that appears, enter **300**.  Leave the remaining default values.

	![CDN feature](./media/cdn-rules-engine/cdn-new-feature.png)

	>[AZURE.NOTE] As with match conditions, clicking the blue informational icon to the left of the new feature will display details about this feature.  In the case of **Force Internal Max-Age**, we are overriding the asset's **Cache-Control** and **Expires** headers to control when the CDN edge node will refresh the asset from the origin.  Our example of 300 seconds means the CDN edge node will cache the asset for 5 minutes before refreshing the asset from its origin.
	>
	>For the full list of features in detail, see [Rules Engine Match Condition and Feature Details](cdn-rules-engine-details.md#features).

6.  Click the **Add** button to save the new rule.  The new rule is now awaiting approval. Once it has been approved, the status will change from **Pending XML** to **Active XML**.

	>[AZURE.IMPORTANT] Rules changes may take up to 90 minutes to propagate through the CDN.

## See also
* [Azure Fridays: Azure CDN's powerful new Premium Features](https://azure.microsoft.com/documentation/videos/azure-cdns-powerful-new-premium-features/) (video)
* [Rules Engine Match Condition and Feature Details](cdn-rules-engine-details.md)
