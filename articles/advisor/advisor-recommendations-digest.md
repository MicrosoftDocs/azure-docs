---

title: Recommendation digest for Azure Advisor
description: Get periodic summary for your active recommendations
ms.topic: article
ms.date: 03/16/2020
ms.author: sagupt

---

# Configure periodic summary for recommendations

Advisor **recommendation digests** provide an easy and proactive way to stay on top of your active recommendations, across different categories. The feature provides the ability to configure periodic notifications for the summary of all your active recommendations, across different categories. You can choose your desired channel for notifications like email, sms or others, using action groups. 
This article shows you how to set-up a **recommendation digests** for your Advisor recommendations.


## Setting-up your recommendation digest 

The **recommendation digest** creation experience helps you configure the summary. You can select below parameters for configurations:
1. Category: We have recommendation categories like cost, high availability, performance and operational excellence. The capability is not available for security recommendations yet.
2. Frequency of digest: Frequency for the summary notifications can be weekly, bi-weekly and monthly.
3. Action group: You can either select an existing action group or create a new action group. To learn more about action groups, see [create and manage action groups](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups).
4. Language for the digest
5. Recommendation digest name: You can use a user-friendly string to better track and monitor the digests.

## Steps to create recommendation digest in Azure portal

Here are the steps to create **recommendation digest:**
* **Step 1:** In the Azure portal, go to **Advisor** and under **Monitoring** section, select **Recommendation digest** 

   ![Recommendation digest entry-point](./media/digest-0.png)

* **Step 2:** Select **New recommendation digest** from the top bar as below:

   ![Create recommendation digest](./media/digest-5.png)

* **Step 3:** In the **scope** section, select the **subscription** for your digest

   ![Provide recommendation digest inputs](./media/digest-1.png)

* **Step 4:** In the **condition** section, select the configurations like **category**, **frequency** and **language**

   ![Provide recommendation digest input conditions](./media/digest-2.png)

* **Step 5:** In the **action group** section, select the **action group** for the digest. You can learn more here - [Create and manage action groups](https://docs.microsoft.com/azure/azure-monitor/platform/action-groups)

   ![Provide recommendation digest input action group](./media/digest-3.png)

* **Step 6:** In this final section for **digest details**, you can assign name and state to your recommendation digest. Press **create recommendation digest** to complete the set-up.
   ![Complete recommendation digest creation](./media/digest-4.png)

## Next steps

For more information about Advisor recommendations, see:
* [Introduction to Azure Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor Cost recommendations](advisor-cost-recommendations.md)
* [Advisor Performance recommendations](advisor-performance-recommendations.md)
* [Advisor Security recommendations](advisor-security-recommendations.md)
* [Advisor Operational Excellence recommendations](advisor-operational-excellence-recommendations.md)
* [Advisor REST API](https://docs.microsoft.com/rest/api/advisor/)
