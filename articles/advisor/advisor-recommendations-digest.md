title: Recommendations Digest for Azure Advisor
description: Get periodic summary for your active recommendations
ms.topic: article
ms.date: 03/16/2020
ms.author: sagupt

---

# Configure periodic summary for your active Advisor recommendations

Advisor Recommendations Digest provides an easy and proactive way to stay on top of your active recommendations, across different categories. The features provide the ability to configure periodic notifications, to your desired channel-type (email, sms, any other), for the summary of all ative recommendations across different categories.
This article shows you how to set-up a Recommendations Digest for your Advisor recommendations.


## Setting-up your Recommendations Digest in Azure portal

The Recommendations creation experience help you configure your Recommendations Digest. You can select a subscription and optionally select below parameters:
1. Category: We have recommendation categories like cost, high availability, performance and operational excellence *(the capability is not available for security recommendations yet)*
2. Frequency of digest: This can be weekly, bi-weekly or monthly.
3. Action Group: You can either select an existing action group or create a new action group.To learn more about action groups, see [Create and manage action groups](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups).
4. Language for the digest
5. Recommendation Digest name: User-friendly string

Here are the steps to create **Recommendation Digest:**
* **Step 1:** In the Azure portal, go to **Advisor** and under **Monitoring** section select **Recommendations Digest** 

* **Step 2:** Select **New Recommendations Digest** from the top bar as below:

* **Step 3:** In the **scope** section, select the **subscription** for your digest

* **Step 4:** In the **condition** section, select the configurations like **category**, **frequency** and **language**

* **Step 5:** In the **action group** section, select the **action group** for the digest. You can learn more here - [Create and manage action groups](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups)

* **Step 6:** In this final section for **digest details**, you can assign a name and state to your recommendation digest. 

Press **Create recommendations digest** to complete the set-up.

Once you have create the digests, you can manage them in our *manage recommendation digest** experience as below:

## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Azure Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)
* [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md)
* [Advisor REST API](https://docs.microsoft.com/rest/api/advisor/)
