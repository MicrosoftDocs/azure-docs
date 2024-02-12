---
title: Well Architected Framework assessments in Azure Advisor
description: Azure Advisor offers Well Architected Framework assessments (curated and focused Advisor optimization reports) through the Assessments entry in the left menu of the Azure Advisor Portal.
author: mabrahms
ms.author: v-mabrahms
ms.service: azure
ms.topic: article
ms.date: 12/1/2023

#customer intent: As an Advisor user, I want WAF assessments so that I can better understand recommendations.

---

# What are Azure WAF assessments?"

The Azure Well-Architected Framework, WAF, is a design scheme that helps you understand the pros and cons of cloud system options and can improve the quality of a workload. To learn more, see [Azure Well- Architected Framework](/azure/well-architected/).

Microsoft now offers WAF Assessment recommendations related to Azure resources based on the five pillars of WAF to Azure Advisor customers. You can take assessments on, and receive recommendations directly within, the Advisor platform.

> [!NOTE]
> Only the Assessments initiated via Advisor are visible on Advisor for the selected subscription and/or workload. 

Microsoft WAF Assessments help you work through a scenario of questions and recommendations that result in a curated guidance report that is actionable and informative. Assessments take time but it's time well-spent. Azure Advisor WAF Assessments help you identify gaps in your workloads across five pillars: Reliability, Cost, Operational Excellence, Performance, and Security via a set of curated questions on your workload. Assessments need you to work through a scenario of questions on your workloads and then provide recommendations that are actionable and informative. For the preview launch, we enabled the following two assessments via Advisor:

* [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)

* [Azure Well-Architected Review](/assessments/azure-architecture-review/)

To see all Microsoft assessment choices, go to the [Learn platform > Assessments](/assessments/).

## Prerequisites

You can manage access to Advisor reviews using built-in roles. The permissions vary by role. 

> [!NOTE]
> These roles must be configured for the subscription that was used to publish the review.

| **Name** | **Description** |
|---|:---:|
|Advisor Reviews Reader|View assessments for a workload and recommendations linked to them|
|Advisor Reviews Contributor|View assessments for a workload and triage recommendations linked to them|

## Access Azure Advisor WAF Assessments

1. Sign in to the Azure portal and select Advisor from any page. The Advisor page opens.

1. Select **Assessments** in the left navigation menu. The **Assessments** page opens with a list of completed or in progress assessments.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-main-m.png" alt-text="Sreenshot of Azure Advisor WAF assessments main page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-main-m.png":::

> [!NOTE]
> If you don't see the **New assessment** option, make sure you have Contributor access on at least one subscription, and make sure you have the feature flag (*feature.isEngageAssessmentsEnabled=true*) added in the URL.

## Create Azure Advisor WAF Assessments

1. Select **New assessment**. An input area opens.
 
:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-populated.png" alt-text="Sreenshot of Azure Advisor **Start new assessment** main page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-populated.png":::

2. Provide the input parameters:

  * **Subscription**: Choose from the list of available subscriptions in the dropdown Advisor. Once chosen, the system looks for workloads configured for that subscription. Not all subscriptions are available for the WAF Assessments preview

  * **Workload** (optional): If you have workloads configured for that subscription, you can view them in the list and select one

  * **Assessment type**: In the preview launch, we enabled two types of assessments:
    * [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)
    * [Azure Well-Architected Review](/assessments/azure-architecture-review/)

  * **Assessment name**: A unique name for the assessment. Typing in the name activates the **Review and Create** option at the top of the page and the **Next** button at the bottom of the page. To find an existing assessment, go to the main **Assessments** page
  
3. Select **Next**. A page opens that shows all of the existing assessments with the same subscription and workload (if any), and status of each similar assessment, both *Completed* and *In progress*. You can see the results of that assessment before deciding to start a new one. 

If you arrow back a page, or use the **Review and create** tab, the new assessment options form is reset.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-tiles.png" alt-text="Sreenshot of Azure Advisor **Start new assessment** assessments tile page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-tiles.png":::

You can choose to: 

  a. View the recommendations generated for a completed recommendation.

  b. Resume an assessment you initiated earlier. If you do so, you're redirected to **Learn** platform, select **Continue** to resume creating the assessment.
  
  c. Review the recommendations of a completed assessment created by someone from your organization.

  d. Create a new assessment.

> [!NOTE]
> You cannot resume an in-progress assessment created by someone else. 

4. Select **Create** or **Click here to start a new assessment** at the top of the page. The **Learn > Assessments** question pages open to the **Assessment overview** page. The **Progress** bar shows how many questions are part of this assessment. The **Milestones** table includes the assessment by default, as the initial milestone. Adding milestones can help you keep track of progress as you implement the assessment recommendations. To learn more about milestones, see [Microsoft Assessments - Milestones](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/microsoft-assessments-milestones/ba-p/3975841).

5. To begin the assessment creation process, select **Continue**. The assessment begins. The steps change depending on the chosen review type.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-learn-m.png" alt-text="Sreenshot of Azure Advisor **Resume assessment** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-learn-m.png":::

6. If you chose **Azure Well-Architected Review**: The page shown in the following image opens. On that page, select a workload type. Each workload type results in a list of approximately 60 questions based on the key recommendations provided in the pillars of the Well-Architected Framework. To know more about workload types, see [Well-Architected Branches for Assessing Workload-Types - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-architecture-blog/well-architected-branches-for-assessing-workload-types/ba-p/3267234).

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-workload.png" alt-text="Sreenshot of Azure Advisor **Choose assessment workload** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-workload.png":::

  * **Core Well-Architected Review**: To learn more, see [Azure Well-Architected Review](/assessments/azure-architecture-review/).

  * **Azure Machine Learning**: To learn more, see [Assessing your machine learning workloads](/shows/azure-enablement/assessing-your-machine-learning-workloads).

  * **Internet of Things**: Use the following content to help implement the recommendations:

    * [Reliability](/azure/well-architected/iot/iot-reliability): Complete the reliability questions for IoT workloads in the Azure Well-Architected Review.
     
    * [Security](/azure/well-architected/iot/iot-security): Complete the security questions for IoT workloads in the Azure Well-Architected Review.
  
  * **SAP On Azure (Preview)**: For detailed information on the different types of storage and their capability and usability with SAP workloads and SAP components, see [Azure Storage types for SAP workload](/azure/sap/workloads/planning-guide-storage). 

  * **Azure Stack Hub (Preview)**: Evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your workloads running on Azure Stack Hub. The manage methodology of the Cloud Adoption Framework suggests Azure Stack hub operations management activities focusing on the following list of core responsibilities:

    * **Inventory and visibility**: Create an inventory of assets across multiple clouds. Develop visibility into the run state of each asset.

    * **Operational compliance**: Establish controls and processes to ensure that each state is properly configured and running in a well-governed environment.

    * **Protect and recover**: Ensure that all managed assets are protected and can be recovered by using baseline management tooling.

    * **Enhanced baseline options**: Evaluate common additions to the baseline that might meet business needs.

    * **Platform operations**: Extend the management baseline with a well-defined service catalog and centrally managed platforms.

    * **Workload operations**: Extend the management baseline to include a focus on mission-critical workloads.

When ready, select **Next**. 

7. For **Azure Well-Architected** reviews only. Select a Core Pillar of WAF to be used in the assessment. To learn more about well architected pillars, see [Introducing the Microsoft Azure Well-Architected Framework](https://azure.microsoft.com/blog/introducing-the-microsoft-azure-wellarchitected-framework/). When ready, select **Next**.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-m.png" alt-text="Sreenshot of Azure Advisor **Choose pillar assessment** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-m.png":::

8. The assessment begins, the number of questions vary based on the selected assessment type. Your answers to the questions are essential to the quality of the assessment recommendations. Respond to the different question and continue clicking on **Next** until you reach a page with **View guidance**.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-detail-2-populated-m.png" alt-text="Sreenshot of Azure Advisor **Choose pillar assessment detail** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-detail-2-populated-m.png":::

9. Select **View guidance** to navigate to the results page. The assessment recommendations are available in Azure Advisor after a maximum of 8 hours of after completion. You can also download the recommendations immediately.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-results-guidance-next-steps-improve-results-expanded.png" alt-text="Sreenshot of Azure Advisor **Guidance** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-results-guidance-next-steps-improve-results-expanded.png":::  

**Key Points**:

* Assessments are tailored to your selected workload type, such as IoT, SAP, data services, machine learning, etc., which you choose during the assessment. The Azure Well-Architected Framework provides a suite of actionable guidance that you can use to improve your workloads in the areas that matter most to your business. The framework is designed to help you evaluate your workloads against the latest set of Azure best practices.	

* Assessments for a subscription and workload can be taken repeatedly; however, while creating a new assessment, you're notified if there's an existing assessment already created for the same subscription and workload. 

* Assessments that have been marked as *Completed* cannot be edited.

## View Azure Advisor WAF assessment recommendations

There are multiple avenues to access the recommendations. But you must have the correct permissions.

To learn more about permissions, see [Permissions in Azure Advisor](/azure/advisor/permissions). To find out what subscriptions you have permissions for, and what level of permissions, see [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal#list-owners-of-a-subscription). If you have Contributor permissions, you can view the recommendations for assessments created by other users and the assessments that you created. 

1. Open the **Assessments** main page and then any completed assessment. The recommendations list page for that assessment opens. 

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list-m.png" alt-text="Sreenshot of Azure Advisor **Recommendations list** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list-m.png":::

2. You can sort the recommendations based on **Priority**, **Recommendation**, and **Category**. You can also use **Actions** > **Group** to group the recommendations by category or priority.
 
:::image type="content" source="./media/advisor-waf-assessments/recommendation-list-filtered-m.png" alt-text="Sreenshot of Azure Advisor **Recommendations list, filtered** page." lightbox="./media/advisor-waf-assessments/recommendation-list-filtered-m.png":::

3. Managing Advisor assessment recommendations is slightly different than managing regular Advisor recommendations.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list-detail-pane-m.png" alt-text="Sreenshot of Azure Advisor **Recommendations list** page, detail pane." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list-detail-pane-m.png":::

From the recommendations list page, you can:
  * Select a recommendation and see details about it in a pane that opens.

  * *Postpone* or *Dismiss* a recommendation, or mark as *In progress*. If you mark a recommendation as *In progress* and finish with it (take the recommended actions), it's important to then mark it as *Completed*. You mark the recommendation as *Completed* through the recommendation list in the **In progress** view, or through the detail pane of a recommendation that is in progress. 

> [!NOTE]
> Assessment recommendations have no immediate impact on your existing Advisor score.

## Manage Azure Advisor WAF assessment recommendations

You can manage recommendations, setting recommendation status for what needs action and what can be postponed or dismissed. You can also track recommendations via the different recommendation statuses. 

* On the **Not started** tab, with new recommendations, you can set initial status changes. For example, mark a recommendation as *In progress*:  If you accept a recommendation and start working on it, select **Mark as in progress**, which moves it to the **In progress** tab. 

:::image type="content" source="./media/advisor-waf-assessments/mark-in-progress-m.png" alt-text="Sreenshot of Azure Advisor **Marked recommendations list**." lightbox="./media/advisor-waf-assessments/mark-in-progress-m.png":::  

* On the **In progress** tab, you can take action on a recommendation by selecting **Mark as completed** or **Dismiss**. If you select **Dismiss**, you must provide a reason as shown in the following screenshot.

:::image type="content" source="./media/advisor-waf-assessments/mark-dismiss-recommendation-options-small.png" alt-text="Sreenshot of Azure Advisor **Recommendations dismiss options**." lightbox="./media/advisor-waf-assessments/mark-dismiss-recommendation-options-small.png":::

* You can accept or dismiss or set status on multiple recommendations at a time using the checkbox control. The action you take moves the selected recommendations to the tab for that action. For example, if you mark recommendations as *In progress*, they're moved to the **In progress** tab.

:::image type="content" source="./media/advisor-waf-assessments/mark-multiple-m.png" alt-text="Sreenshot of Azure Advisor **Multiple marked recommendations list**." lightbox="./media/advisor-waf-assessments/mark-multiple-m.png"::: 

* You can reset a recommendations status. If you reset the status, it returns to the previous status that was set for it.

:::image type="content" source="./media/advisor-waf-assessments/mark-reset-m.png" alt-text="Sreenshot of Azure Advisor **Recommendations reset**." lightbox="./media/advisor-waf-assessments/mark-reset-m.png"::: 

* You can postpone a recommendation. If you do so, pick a time length for the postponement. Postponed recommendations move to the **Postponed or dismissed** tab.

:::image type="content" source="./media/advisor-waf-assessments/mark-postpone-recommendation-options-small.png" alt-text="Sreenshot of Azure Advisor **Recommendations postpone options**." lightbox="./media/advisor-waf-assessments/mark-postpone-recommendation-options-small.png"::: 

## Act on and complete Azure Advisor WAF assessments

Recommendations marked as *In progress* are reviewed and acted on by operations experts. 

Once the recommendation is, or multiple recommendations are, selected with **Mark as completed** selected, in the **In progress** tab, those recommendations are moved to the **Completed** tab.

:::image type="content" source="./media/advisor-waf-assessments/mark-completed-m.png" alt-text="Sreenshot of Azure Advisor **Completed recommendations**." lightbox="./media/advisor-waf-assessments/mark-completed-m.png"::: 
## Azure Advisor WAF assessments FAQs

Some common questions and answers.

**Q**. Can I edit previously taken assessments?\
**A**. In the "Most Valuable Professionals" (MVP) program scope, assessments can't be edited once completed.

**Q**. Can I view recommendations for the assessments not taken by me?\
**A**. Subscription role-based access control (RBAC) limits access to recommendations and assessments in Advisor. You can see recommendations for all completed assessments only if you have Reader/Contributor access to the subscription under which assessment is created.

**Q**. Can I take multiple assessments for a subscription?\
**A**. There's no limit on the number of assessments that can be taken for a subscription. However, while creating a new assessment, you're notified if an existing assessment of the same type is already created for the same subscription/workload. 

**Q**. How do assessment-based recommendations affect my Advisor score?\
**A**. We're working on score strategy that will include the resolution of assessment-based recommendations as well.

**Q**. I completed my assessment, but I don't see the recommendations and the assessment shows "In progress," why?\
**A**. Currently, it could take up to a maximum of eight hours, for the recommendations to sync into Advisor after we complete the assessment in the Learn platform. We're working on fixing it. 

## Related content

* [Complete an Azure Well-Architected Review assessment](/azure/well-architected/cross-cutting-guides/implementing-recommendations)
* [Tailored Well-Architected Assessments for your workloads](https://techcommunity.microsoft.com/t5/azure-governance-and-management/tailored-well-architected-assessments-for-your-workloads/ba-p/2914022)
* [Azure Machine Learning](/assessments/eec33ce4-4ef0-4bd2-9f69-1956e50465d4/)

