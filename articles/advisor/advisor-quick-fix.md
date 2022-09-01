---
title: Quick Fix remediation for Advisor recommendations
description: Perform bulk remediation using Quick Fix in Advisor
author: orspod
ms.topic: article
ms.date: 03/13/2020
ms.author: orspodek

---

# Quick Fix remediation for Advisor
**Quick Fix** enables a faster and easier way of remediation for recommendation on multiple resources. It provides capability for bulk remediations for resources and helps you optimize your subscriptions faster with remediation at scale for your resources.
The feature is available for certain recommendations only, via Azure portal.


## Steps to use 'Quick Fix'

1. From the list of recommendations that have the **Quick Fix** label, click on the recommendation.

   :::image type="content" source="./media/quick-fix-1.png" alt-text="{Screenshot of Azure Advisor showing Quick Fix labels in the recommendations.}":::
   
   *Prices in the image are for example purposes only*

2. On the Recommendation details page, you'll see list of resources for which you have this recommendation. Select all the resources you want to remediate for the recommendation.

   :::image type="content" source="./media/quick-fix-2.png" alt-text="Screenshot of the Impacted resources window with list items and the Quick Fix button highlighted.":::
   
   *Prices in the image are for example purposes only*

3. Once you have selected the resources, click on the **Quick Fix** button to bulk remediate.

   > [!NOTE]
   > Some of the listed resources might be disabled, because you don't have the appropriate permissions to modify them.
   
   > [!NOTE]
   > If there are other implications, in addition to benefits mentioned in Advisor, you will be communicated in the experience to help you take informed remediation decisions.
   
4. You will get a notification for the remediation completion. You will see an error if there are resources which are not remediated and resources in the selected mode in the resource list view.  


## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Azure Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)
* [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md)
* [Advisor REST API](/rest/api/advisor/)
