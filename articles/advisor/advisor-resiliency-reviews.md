---
title: Azure Advisor resiliency reviews
description: Optimize resource resiliency with custom recommendation reviews.
author: mabrahms
ms.author: v-mabrahms
ms.service: azure
ms.topic: article
ms.date: 03/8/2024

---

# Azure Advisor Resiliency Reviews

Azure Advisor Resiliency Reviews help you focus on the most important recommendations to optimize your cloud deployments and improve resiliency. Review recommendations are tailored to the needs of your workload and include custom ones curated by your account team using Azure best practices and prioritized automated recommendations.

You can find resiliency reviews in [Azure Advisor](https://aka.ms/azureadvisordashboard), which serves as your single-entry point for Microsoft best practices.

In this article, you learn how to enable and access resiliency reviews prepared for you, triage, manage, implement, and track recommendations' lifecycles.

## Terminology

* *Triage recommendations* means to accept or reject a recommendation.
* *Manage recommendation lifecycle* means to mark a recommendation as completed, postponed or  dismissed, in progress, or not started. You can only manage a recommendation is in the *Accepted* state.

## How it works

After you request a review, Microsoft Cloud Solution Architect engineers perform extensive analysis, curate the list of prioritized recommendations, and publish a resiliency review. You triage the recommendations and implement them. Your Microsoft account team works with you to facilitate the process.

The following table defines the responsible parties for Advisor actions:

| **Responsibility** | **Description** |
|---|:---:|
|Request a resiliency review|Customer via your Customer Success Account Manager or aligned Cloud Solution Architect.|
|Analyze workload configuration, perform the review via the Well Architected Reliability Assessment and prepare recommendations|Microsoft account team. Team members include Account Managers, Engineers, and Cloud Solution Architects. |
|Triage recommendations to accept or reject them.|Customer. Triage is done by team members who have authority to make decisions about workload optimization priorities.|
|Manage recommendations' lifecycle.|Customer. Setting the status of accepted recommendation as completed, postponed or dismissed, in progress, or not started.|
|Implement recommendations that were accepted|Customer. Implementation is done by engineers who are responsible for managing resources and their configuration.|
|Facilitate implementation|Microsoft account team via your support contract.|

## Enable reviews

Resiliency reviews are available to customers with Unified or Premier Support contracts via a Well Architected Reliability Assessment. To initiate a review, reach out to your Customer Success Account Manager. You can find their contacts in [Services Hub](https://serviceshub.microsoft.com/).

Your Microsoft account team works with you to collect information about the workload. They need to know which subscriptions are used for the workload, and which subscriptions they should use to publish the review and recommendations. You need to work with the owner of this subscription to configure permissions for your team.

## View and triage recommendations

To view or triage recommendations, or to manage recommendations' lifecycles, requires specific role permissions. For definitions, see [Terminology](#terminology).

### Prerequisites to view and triage recommendations

You can manage access to Advisor reviews using built-in roles. The [permissions](/azure/advisor/permissions) vary by role. These roles need to be configured for the subscription that was used to publish the review.

| **Name** | **Description** | **Targeted Subscription** |
|---|:---:|:---:|
|Advisor Reviews Reader|View reviews for a workload and recommendations linked to them.| You need this role for the one subscription your account team used to publish review.|
|Advisor Reviews Contributor|View reviews for a workload and triage recommendations linked to them.| You need this role for the one subscription your account team used to publish review.|

You can manage access to Advisor personalized recommendations using the following roles. These roles need to be configured for the subscriptions included in the workload under a review.

| **Name** | **Description** |
|---|:---:|
|Subscription Reader|View reviews for a workload and recommendations linked to them.|
|Subscription Owner<br>Subscription Contributor|View reviews for a workload, triage recommendations linked to those reviews, manage review recommendation lifecycle.|
|Advisor Recommendations Contributor (Assessments and Reviews)|View review recommendations, accept review recommendations, manage review recommendations' lifecycle.|

You can find detailed instructions on how to assign a role using the Azure portal - [Assign Azure roles using the Azure portal - Azure RBAC](/azure/role-based-access-control/role-assignments-portal?tabs=delegate-condition). Additional information is available in [Steps to assign an Azure role - Azure RBAC](/azure/role-based-access-control/role-assignments-steps).

### Access reviews

You can find resiliency reviews created by your account team in the left navigation pane under the **Manage** > **Reviews (Preview)** menu in Azure Advisor.

If there's a new review available to you, you see a notification banner on top of the Advisor pages. A **New** review is one with all recommendations in the *Pending* state.

1. Open the Azure portal and navigate to [Advisor](https://aka.ms/Advisor_Reviews).
Select **Manage** > **Reviews (Preview)** in the left navigation pane. A list of reviews opens. At the top of the page, you see the number of **Total Reviews** and review **Recommendations**, and a graph of **Reviews by status**.
1. Use search, filters, and sorting to find the review you need. You can filter reviews by one of the **Status equals** states shown next, or choose *All* (the default) to see all reviews. If you don’t see a review for your subscription, make sure the review subscription is included in the global portal filter. You might need to update the filter to see the reviews for a subscription.

   * *New*: No recommendations are triaged (accepted or rejected)
   * *In progress*: Some recommendations aren't triaged
   * *Triaged*: All recommendations are triaged
   * *Completed*: All accepted-state recommendations are implemented, postponed, or dismissed

:::image type="content" source="./media/resiliency-reviews/resiliency-reviews-main.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews opening page." lightbox="./media/resiliency-reviews/resiliency-reviews-main.png":::

At the top of the reviews page, use **Feedback** to tell us about your experience. Use the **Refresh** button to refresh the page as needed.

> [!NOTE]
> If you have no reviews, the **Reviews** menu item in the left navigation is greyed out.

### Review recommendations

The triage process includes reviewing recommendations and making decisions on which to implement. Use *Accept* and *Reject* actions to capture your decision. Accepted recommendations are available to your engineering team under the Advisor **Reliability** menu item.

:::image type="content" source="./media/resiliency-reviews/resiliency-reviews-main-reliability.png" alt-text="Screenshot of the Azure Advisor Reliability menu highlight." lightbox="./media/resiliency-reviews/resiliency-reviews-main-reliability.png":::

1. From the **Reviews** page, select a review name to open the recommendations list page. For new reviews, recommendations are in *Pending* state.
1. Take a note of recommendations priority. **Priority** is defined by your account team to help you decide which recommendations should be implemented first.
:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-pending.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendation list with pending recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-pending.png":::
1. Select a recommendation *Title* or the *Impacted subscriptions* view link to get detailed information. A pane opens with details – description, potential benefits, and notes from your account team along with the list of impacted subscriptions.
:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-detail-pane.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendation list page with the details pane of a selected recommendation." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-detail-pane.png":::
1. If all recommendations for that review are triaged, none appear in the **Pending** view; select the **Accepted** or **Rejected** tabs to view those recommendations.

### Recommendation priority

The priority of a recommendation is based on the impact and urgency of the suggested improvements. Your account team sets recommendation priority.

* *Critical*: The most important recommendations that can have a significant impact on your Azure resources. They should be addressed as soon as possible to avoid potential issues such as security breaches, data loss, or service outages.
* *High*: The recommendations that can improve the performance, reliability, or cost efficiency of your Azure resources. They should be addressed in a timely manner to optimize your Azure deployments.
* *Medium*: The recommendations that can enhance the operational excellence or user experience of your Azure resources. They should be considered and implemented if they align with your business goals and requirements.
* *Low*: The recommendations that can provide extra benefits or insights for your Azure resources. They should be reviewed and implemented if they're relevant and feasible for your scenario.
* *Informational*: The recommendations that can help you learn more about the features and capabilities of Azure. They don't require any action, but they can help you discover new ways to use Azure.

### Accept recommendations

You must accept recommendations for your engineering team to start implementation. When a review recommendation is accepted, it becomes available under the Advisor **Reliability** page where it can be acted on.

From a review recommendations details page:

1. You can accept a single recommendation by clicking **Accept**.
1. You can accept multiple recommendations at a time by selecting them using the checkbox control and clicking **Accept**.
1. Accepted recommendations are moved to the **Accepted** tab and become visible to your engineering team under **Recommendations** > **Reliability**.
:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendation list page of accepted recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted.png":::
1. If you accepted a recommendation by mistake, use **Reset** to move it back to the pending state.

### Reject recommendations

1. You can reject a recommendation if you disagree with it.
1. You must select a reason when you reject a recommendation. Select one of the reasons from the list of available options.
:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-reject-options-medium.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations reject options." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-reject-options-medium.png":::
1. The rejected recommendation is moved to the **Rejected** tab. Rejected recommendations aren't visible for your engineering team under **Recommendations** > **Reliability**.
:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-rejected.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations page of rejected recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-rejected.png":::
1. You can reject multiple recommendations at a time using the checkbox control, and the same reason for rejection is applied to all selected recommendations. If you need to select a different reason, reject one recommendation at a time.
1. If you reject a recommendation by mistake, select **Reset** to move it back to the pending state and tab.

> [!NOTE]
> The reason for the rejection is visible to your account team. It helps them understand workload context and your business priorities better. Additionally, Microsoft uses this information to improve the quality of recommendations.

## Implement recommendations

Once review recommendations are triaged, all recommendations with *Accepted* status become available on the Advisor **Reliability** page with links to the resources needing action. Typically, an engineer on your team implements the recommendations by going to the resource page and making the recommended change.

For definitions on recommendation states, see [Terminology](#terminology).

### Prerequisites to implement recommendations

For details on permissions to act on recommendations, see [Permissions in Azure Advisor - Azure Advisor | Microsoft Learn](/azure/advisor/permissions).

### Access accepted review recommendations

To view *Accepted* review recommendations, go to **Recommendations** > **Reliability** in the left navigation to open the **Reliability** page at the **Reviews** tab, by default.

The recommendations are grouped by type:

* **Reviews**: These recommendations are part of a review for a selected workload.
* **Automated**: These recommendations are the standard Advisor recommendations for the selected subscriptions.

> [!NOTE]
> If none of your resiliency review recommendations are in the *Accepted* state, the **Reviews** tab is hidden.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations page of accepted recommendations." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-list-accepted.png":::

You can filter the recommendations by subscription, priority, and workload, as well as sort the recommendation list.

You can sort recommendations using column headers - *Priority* (Critical, High, Medium, Low, Informational), *Description*, *Impacted resources*, *Review name*, *Potential benefits*, or *Last updated* date.

### View recommendation details

Select a recommendation description to open a details page. Your account team adds the *Description*, *Potential benefits*, and *Notes* when the review is prepared.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-reliability-page-detail.png" alt-text="Screenshot of the Azure Advisor Reliability page for a Resiliency Reviews recommendation." lightbox="./media/resiliency-reviews/resiliency-review-reliability-page-detail.png":::

The options in the **Reliability** recommendations detail differ from those in the **Reviews** recommendations detail. Here, a team developer can open the *Impacted subscriptions* link and take direct action.

For details on recommendation priority, see [Recommendation priority](#recommendation-priority).

### Manage recommendation lifecycle

Recommendation status is a valuable indicator for determining what actions need to be taken.

* Once you begin to implement a recommendation, mark it as *In progress*.
* Once the recommendation is implemented, the recommended action is taken, update the status to *Completed*. When all recommendations in a review are marked as *Completed*, the review is marked as *Completed* on the **Review** page.
* You can also postpone the recommendation for action later.
* You can dismiss a recommendation if you don't plan to implement it. If you dismiss the recommendation, you must give a reason, just as you must give a reason if you reject a recommendation in a review.

:::image type="content" source="./media/resiliency-reviews/resiliency-review-recommendation-dismiss-options-medium.png" alt-text="Screenshot of the Azure Advisor Resiliency Reviews recommendations dismiss options." lightbox="./media/resiliency-reviews/resiliency-review-recommendation-dismiss-options-medium.png":::

## Review maintenance

Your Microsoft account team engineers keep track of the results of your actions on resiliency reviews and continue to refine the recommendation reviews accordingly.

## Next steps

To learn more about Advisor reliability recommendations, see:

[Improve the reliability of your business-critical applications using Azure Advisor](/azure/advisor/advisor-how-to-improve-reliability).

[Reliability recommendations](/azure/advisor/advisor-reference-reliability-recommendations).
