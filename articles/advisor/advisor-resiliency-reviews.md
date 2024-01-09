---
title: Azure Advisor Resiliency Reviews
description: Optimize resource resiliency with custom recommendation reviews.
author: mabrahms
ms.author: v-mabrahms
ms.service: azure
ms.topic: article
ms.date: 01/3/2024

---

# Azure Advisor Resiliency Reviews

Azure Advisor Resiliency Reviews help you focus on the most important recommendations to optimize your cloud deployments and improve resiliency. Review recommendations are tailored to the needs of your workload and include custom ones curated by your account team using Azure best practices and prioritized automated recommendations.

You can find resiliency reviews in [Azure Advisor](https://aka.ms/Advisor_Reviews), which serves as your single-entry point for Microsoft best practices.

[!NOTE]
Resiliency reviews in Azure Advisor are available to customers with Unified or Premier Support contracts. Reach out to your Customer Success Account Manager or primary Microsoft Representative to learn more.

In this article, you learn how to enable and access resiliency reviews prepared for you, triage (accept or reject),manage, implement recommendations, and track their lifecycle. 

## How it works

After you request a review, Microsoft Cloud Solution Architects engineers perform extensive analysis, curate the list of prioritized recommendations, and publish a resiliency review. You triage the recommendations and implement them. Your Microsoft account team works with you to facilitate the process.

The following table defines the roles and the access they have within Advisor:

| **Responsibility** | **Description** |
|---|:---:|
|Request a resiliency review|Customer via your Customer Success Account Manager or aligned Cloud Solution Architect.|
|Analyze workload configuration, perform the review via the Well Architected Reliability Assessment and prepare recommendations|Microsoft account team. Team members include account managers, engineers, and cloud solution architects. |
|Triage recommendations to accept or reject them.|Customer. This is done by team members who have authority to make decisions about workload optimization priorities.|
|Implement recommendations that were accepted|Customer. This is done by engineers who are responsible for managing resources and their configuration.|
|Facilitate implementation|Microsoft account team via your support contract.|

## Enable reviews

Resiliency reviews are available to customers with Unified or Premier Support contracts via a Well Architected Reliability Assessment. Reach out to your Customer Success Account Manager to initiate a review. You can find their contacts in [Services Hub](https://serviceshub.microsoft.com/).

Your Microsoft account team works with you to collect information about the workload. They need to know which subscriptions are used for the workload, and which subscription they should use to publish the review and recommendations. You need to work with the owner of this subscription to configure permissions for your team.

## View and triage recommendations

### Prerequisites to view and triage recommendations

You can manage access to Advisor reviews using built-in roles. The [permissions](/azure/advisor/permissions) vary by role. These roles need to be configured for the subscription that was used to publish the review. 

| **Name** | **Description** |
|---|:---:|
|Advisor Reviews Reader|View reviews for a workload and recommendations linked to them.|
|Advisor Reviews Contributor|View reviews for a workload and triage recommendations linked to them.|

You can manage access to Advisor personalized recommendations using subscription roles. These roles need to be configured for the subscriptions included in the workload under review. 

| **Name** | **Description** |
|---|:---:|
|Subscription Reader  Subscription Contributor  Subscription Owner|View recommendations.|
|Subscription Owner  Subscription Contributor|Update recommendations’ status, perform dismiss and postpone operations.|

You can find detailed instructions on how to assign a role using the Azure portal - [Assign Azure roles using the Azure portal - Azure RBAC](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition). Additional information is available in [Steps to assign an Azure role - Azure RBAC](/azure/role-based-access-control/role-assignments-steps).

### Access reviews

You can find resiliency reviews created by your account team under the **Manage** menu group in Azure Advisor.

If there's a new review available to you, you see a notification banner on top of the Advisor pages. A “new” review is one with all recommendations in the *Pending* state.

1. Open the Azure portal and navigate to [Advisor](https://aka.ms/Advisor_Reviews). 
Select **Manage** (->) Reviews in the left navigation pane. A list of reviews opens. At the top of the page, you see the number of **Total Reviews** and review **Recommendations**, and a graph of **Reviews by status**. 
1. Use search, filters, and sorting to find the review you need. You can filter reviews by one of the **Status equals** states below, or choose *All* (the default) to see all reviews:

* *New*: No recommendations have been triaged (accepted or rejected)

* *In progress*: Some recommendations have not been triaged

* *Triaged*: All recommendations have been accepted or rejected

* *Completed*: All accepted recommendations have been implemented, postponed, or dismissed

:::image type="content" source="./media/resiliency-reviews/resiliency-reviews-main-m.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews opening page." lightbox="./media/resiliency-reviews/resiliency-reviews-main-m.png":::

At the top of the reviews page: 

* Use **Feedback** to tell us about your experience. The dialog box opens with survey questions. 
* Use the **Refresh** button to refresh the page as needed.

### Review recommendations

The triage process includes reviewing recommendations and making decisions on which to implement. Use *Accept* and *Reject* actions to capture your decision. Accepted recommendations are available to your engineering team under the Advisor **Reliability** menu item.

1. From the **Reviews** page, select a review name to open the recommendations list page. For new reviews recommendations are in *Pending* state.

1. Take a note of recommendations priority. **Priority** is defined by your account team to help you decide which recommendations should be implemented first.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-pending-m.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendation list with pending recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-pending-m.png":::

3. Click a recommendation *Title* or the *Impacted subscriptions* view link to get detailed information. A pane opens with details – description, potential benefits, and notes from your account team along with the list of impacted subscriptions.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-detail-pane-m.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendation list page with the details pane of a selected recommendation." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-detail-pane-m.png":::

4. If all recommendations for that review have been triaged, none appear in the **Pending** view; select the **Accepted** or **Rejected** tabs to view those recommendations.

### Recommendation priority

The priority of a recommendation is based on the impact and urgency of the suggested improvements and is set by your account team. 

* *Critical*: These are the most important recommendations that can have a significant impact on your Azure resources. They should be addressed as soon as possible to avoid potential issues such as security breaches, data loss, or service outages.

* *High*: These are the recommendations that can improve the performance, reliability, or cost efficiency of your Azure resources. They should be addressed in a timely manner to optimize your Azure deployments.

* *Medium*: These are the recommendations that can enhance the operational excellence or user experience of your Azure resources. They should be considered and implemented if they align with your business goals and requirements.

* *Low*: These are the recommendations that can provide additional benefits or insights for your Azure resources. They should be reviewed and implemented if they are relevant and feasible for your scenario.

* *Informational*: These are the recommendations that can help you learn more about the features and capabilities of Azure. They do not require any action, but they can help you discover new ways to use Azure.

### Accept recommendations

You must accept recommendations for your engineering team to start implementation. When a review recommendation is accepted, it becomes available under the Advisor **Reliability** page where it can be acted on.
From a review recommendations details page:

1. You can accept a single recommendation by clicking **Accept**.

1. You can accept multiple recommendations at a time by selecting them using the checkbox control and clicking **Accept**.

1. Accepted recommendations are moved to the **Accepted** tab and become visible to your engineering team under **Recommendations** (->) **Reliability**.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted-m.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendation list page of accepted recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted-m.png":::

4. If you accepted a recommendation by mistake, use **Reset** to move it back to the pending state.

[!NOTE]
If you reset a recommendation after your engineering started implementation, the recommendation remains available to them.

### Reject recommendations

1. You can reject a recommendation if you disagree with it.

1. You must select a reason when you reject a recommendation. Select one of the reasons from the list of available options.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-reject-options-small.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations reject options." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-reject-options-small.png":::

[!NOTE]
The reason for the rejection is visible to your account team. It helps them understand workload context and your business priorities better. Additionally, Microsoft uses this information to improve the quality of recommendations.

3. The rejected recommendation is moved to the **Rejected** tab. It is not visible for your engineering team under **Recommendations** (->) **Reliability**.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted-m.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations page of accepted recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted-m.png":::

4. You can reject multiple recommendations at a time using the checkbox control, and the same reason for rejection is applied to all selected recommendations. If you need to select a different reason, reject one recommendation at a time.

5. If you reject a recommendation by mistake, select **Reset** to move it back to the pending state and tab.

## Implement recommendations

Once review recommendations have been triaged, all recommendations with *Accepted* status become available for action through the **Reliability** pages. Typically, an engineer on your team acts on the recommendations.

### Prerequisites to implement recommendations

For details on permissions to act on recommendations, see [Permissions in Azure Advisor - Azure Advisor | Microsoft Learn](/azure/advisor/permissions).

### Access accepted review recommendations

To view *Accepted* review recommendations, go to **Recommendations** (->) **Reliability** in the left navigation. 
The **Reliability** page opens in the **Reviews** tab.

The recommendations are grouped by type:

* **Reviews**: These recommendations are part of a review for a selected workload

* **Automated**: These recommendations are the standard Advisor recommendations for the selected subscriptions

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-rejected-m.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations page of rejected recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-rejected-m.png":::

You can filter the recommendations by subscription, priority, and workload as well as sort the recommendation list.

You can sort recommendations using column headers - *Priority* (Critical, High, Medium, Low, Informational), *Description*, *Impacted resources*, *Review name*, *Potential benefits*, or *Last updated* date. 

### View recommendation details

Click on a recommendation description to open a details page. The *Description*, *Potential benefits*, and *Notes* are added by your account team when the review is prepared.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-reliability-page-detail-m.png" alt-text="Screenshot of the Azure Advisor Reliability page for a Resiliency Reviews recommendation." lightbox="./media/resiliency-reviews/resiliency-review-reliability-page-detail-m.png":::

The options in the **Reliability** recommendations detail differ from those in the **Reviews** recommendations detail. Here, a team developer can open the *Impacted subscriptions* link and take direct action.

For details on recommendation priority, see [Recommendation priority](#recommendation-priority).

### Manage recommendation status

Recommendation status is a valuable indicator for determining what actions need to be taken. 

* Once you begin to act on a recommendation, mark it as *In progress*.

* Update the status to *Completed* once the action has been taken. When all recommendations in a review are marked as *Completed*, the review is marked as *Completed* on the **Review** page. 

* You can also postpone the recommendation for action later.

* You can dismiss a recommendation if you do not plan to implement it. If you dismiss the recommendation, you must give a reason, just as you must give a reason if you reject a recommendation in a review.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-reliability-recommendation-dismiss-options-small.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations dismiss options-small.png":::

## Review maintenance

Your Microsoft account team engineers keep track of the results of your actions on resiliency reviews and continue to refine the recommendation reviews accordingly.

## Next steps

To learn more about Advisor reliability recommendations, see:

[Improve the reliability of your business-critical applications using Azure Advisor](/azure/advisor/advisor-how-to-improve-reliability) 

[Reliability recommendations](/azure/advisor/advisor-reference-reliability-recommendations)


















