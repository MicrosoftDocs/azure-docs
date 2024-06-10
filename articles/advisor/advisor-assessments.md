---
title: Use Well Architected Framework assessments in Azure Advisor
description: Azure Advisor offers Well Architected Framework assessments (curated and focused Advisor optimization reports) through the Assessments entry in the left menu of the Azure Advisor Portal.
author: mabrahms
ms.author: v-mabrahms
ms.service: azure
ms.topic: article
ms.date: 02/18/2024

#customer intent: As an Advisor user, I want WAF assessments so that I can better understand recommendations.

---

# Use Azure WAF assessments

Microsoft now offers Well Architected Framework (WAF) Assessment recommendations related to Azure resources based on the five pillars of WAF to Azure Advisor customers. You can take assessments on, and receive recommendations directly within, the Advisor platform.

> [!NOTE]
> Only the Assessments initiated via Advisor and the corresponding recommendations are visible on Advisor for the selected subscription and/or workload.

## What are Azure WAF assessments?

The Azure Well-Architected Framework, WAF, is a design scheme that helps you understand the pros and cons of cloud system options and can improve the quality of a workload. To learn more, see [Azure Well- Architected Framework](/azure/well-architected/).

Microsoft WAF Assessments help you work through a scenario of questions and recommendations that result in a curated guidance report that is actionable and informative. Assessments take time but it's time well-spent. Azure Advisor WAF Assessments help you identify gaps in your workloads across five pillars: Reliability, Cost, Operational Excellence, Performance, and Security via a set of curated questions on your workload. Assessments need you to work through a scenario of questions on your workloads and then provide recommendations that are actionable and informative. For the preview launch, we enabled the following two assessments via Advisor:

* [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)

* [Azure Well-Architected Review](/assessments/azure-architecture-review/)

To see all Microsoft assessment choices, go to the [Learn platform > Assessments](/assessments/).

## Prerequisites

You can manage access to Advisor WAF assessments using built-in roles. The permissions vary by role.

> [!NOTE]
> These roles must be configured for the relevant subscription to create the assessment and view the corresponding recommendations.

| **Name** | **Description** |
|---|:---:|
|Reader|View assessments for a subscription or workload and the corresponding recommendations|
|Contributor|Create assessments for a subscription or workload and triage the corresponding recommendations|

## Access Azure Advisor WAF assessments

1. Sign in to the [Azure portal](https://portal.azure.com/) and select [**Advisor**](https://aka.ms/azureadvisordashboard) from any page. The **Advisor** score dashboard page opens.

1. Select **Assessments** in the left navigation menu. The **Assessments** page opens with a list of completed or in progress assessments.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-main-m.png" alt-text="Screenshot of Azure Advisor WAF assessments main page." lightbox="./media/advisor-assessments/advisor-assessment-main-m.png":::

## Create Azure Advisor WAF assessments

1. Select **New assessment**. An input area opens.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-start-new-populated-m.png" alt-text="Screenshot of Azure Advisor **Start new assessment** main page." lightbox="./media/advisor-assessments/advisor-assessment-start-new-populated-m.png":::
1. Provide the input parameters:
   * **Subscription**: Choose from the list of available subscriptions in the dropdown Advisor. Once chosen, the system looks for workloads configured for that subscription. Not all subscriptions are available for the WAF Assessments preview.
   * **Workload** (optional): If you have workloads configured for that subscription, you can view them in the list and select one.
   * **Assessment type**: In the preview launch, we enabled two types of assessments:
     * [Azure Well-Architected Review](/assessments/azure-architecture-review/)
     * [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)
   * **Assessment name**: A unique name for the assessment. Typing in the name activates the **Review and Create** option at the top of the page and the **Next** button at the bottom of the page. To find an existing assessment, go to the main **Assessments** page.
   Select **Next**. A page opens that shows all of the existing assessments with the same subscription and workload (if any), and status of each similar assessment, both *Completed* and *In progress*.
1. You can choose to:
   * View the recommendations generated for a completed recommendation.  
   * Resume an assessment you initiated earlier by selecting **Create**. If you do so, you're redirected to **Learn** platform, select **Continue** to resume creating the assessment. You can't resume an *In-progress* assessment created by someone else.
   * Review the recommendations of a completed assessment created by someone from your organization.
   * Create the new assessment.
If you arrow back a page, or use the **Review and create** tab, the new assessment options form is reset to a page with tiles showing similar, existing, assessments.\
From there, you can proceed by selecting **Create** (at page bottom), or **Click here to start a new assessment** (at page top), or select **Previous** to return to the **Start new assessment** (you lose your workload type and assessment name choices).\
If you select **Create** or **Click here to start a new assessment**, the **Learn > Assessments** question pages open to the **Assessment overview** page. The **Progress** bar shows how many questions are part of this assessment. The **Milestones** table includes the assessment by default, as the initial milestone. Adding milestones can help you keep track of progress as you implement the assessment recommendations. To learn more about milestones, see [Microsoft Assessments - Milestones](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/microsoft-assessments-milestones/ba-p/3975841).
:::image type="content" source="./media/advisor-assessments/advisor-assessment-start-new-tiles.png" alt-text="Screenshot of Azure Advisor **Start new assessment** assessments tile page." lightbox="./media/advisor-assessments/advisor-assessment-start-new-tiles.png":::
1. To begin the assessment creation process, select **Continue**. The assessment begins. The steps change depending on the chosen assessment type.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-new-learn-m.png" alt-text="Screenshot of Azure Advisor **Resume assessment** page." lightbox="./media/advisor-assessments/advisor-assessment-new-learn-m.png":::
1. If you chose **Mission Critical** when creating the assessment, skip to step 7.\
If you chose **Azure Well-Architected Review** as the assessment type: The page shown in the following image opens. On that page, select a workload type. Each workload type results in a list of approximately 60 questions based on the key recommendations provided in the pillars of the Well-Architected Framework. To know more about workload types, see [Well-Architected Branches for Assessing Workload-Types - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-architecture-blog/well-architected-branches-for-assessing-workload-types/ba-p/3267234).
   * **Core Well-Architected Review**: To learn more, see [Azure Well-Architected Review](/assessments/azure-architecture-review/).
   * **Azure Machine Learning**: To learn more, see [Assessing your machine learning workloads](/shows/azure-enablement/assessing-your-machine-learning-workloads).
   * **Internet of Things**: Use the following content to help implement the recommendations:
     * [Reliability](/azure/well-architected/iot/iot-reliability): Complete the reliability questions for IoT workloads in the Azure Well-Architected Review.
     * [Security](/azure/well-architected/iot/iot-security): Complete the security questions for IoT workloads in the Azure Well-Architected Review.  
   * **SAP On Azure (Preview)**: For detailed information on the different types of storage and their capability and usability with SAP workloads and SAP components, see [Azure Storage types for SAP workload](/azure/sap/workloads/planning-guide-storage).
   * **Azure Stack Hub (Preview)**: Evaluates the performance efficiency of your workloads running on Azure Stack Hub. To learn more, see [Manage workloads that run on Azure Stack Hub](/azure/cloud-adoption-framework/scenarios/azure-stack/manage).\
When ready, select **Next**. The WAF Configuration options page opens.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-new-question-workload.png" alt-text="Screenshot of Azure Advisor **Choose assessment workload** page." lightbox="./media/advisor-assessments/advisor-assessment-new-question-workload.png":::
1. For **Azure Well-Architected** assessment types only:\
   Select a Core Pillar of WAF to be used in the assessment. To learn more about well architected pillars, see [Introducing the Microsoft Azure Well-Architected Framework](https://azure.microsoft.com/blog/introducing-the-microsoft-azure-wellarchitected-framework/). When ready, select **Next**.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-new-question-pillar-m.png" alt-text="Screenshot of Azure Advisor **Choose pillar assessment** page." lightbox="./media/advisor-assessments/advisor-assessment-new-question-pillar-m.png":::
1. The assessment begins, the number of questions vary based on the selected assessment type. The following screenshot is an example only.\
   Your answers to the questions are essential to the quality of the assessment recommendations. Respond to the different question and continue clicking on **Next** until you reach a page with **View guidance**.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-new-question-pillar-detail-2-m.png" alt-text="Screenshot of Azure Advisor **Choose pillar assessment detail** page, example." lightbox="./media/advisor-assessments/advisor-assessment-new-question-pillar-detail-2-m.png":::
1. Select **View guidance** to navigate to the results page, example shown in the following screenshot.\
   The assessment recommendations are available in Azure Advisor after a maximum of 8 hours of after completion. You can also download the recommendations immediately.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-new-results-guidance-next-steps-improve-results.png" alt-text="Screenshot of Azure Advisor **Guidance** page." lightbox="./media/advisor-assessments/advisor-assessment-new-results-guidance-next-steps-improve-results.png":::

**Key Points**:

* Assessments are tailored to your selected workload type, such as IoT, SAP, data services, machine learning, etc., which you choose during the assessment. The Azure Well-Architected Framework provides a suite of actionable guidance that you can use to improve your workloads in the areas that matter most to your business. The framework is designed to help you evaluate your workloads against the latest set of Azure best practices.

* Assessments for a subscription and workload can be taken repeatedly; however, while creating a new assessment, you're notified if there's an existing assessment already created for the same subscription and workload.

* Assessments marked as *Completed* can't be edited.

## View Azure Advisor WAF assessment recommendations

There are multiple avenues to access the recommendations, but you must have the correct permissions.

To learn more about permissions, see [Permissions in Azure Advisor](/azure/advisor/permissions). To find out what subscriptions you have permissions for, and what level of permissions, see [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal#list-owners-of-a-subscription). If you have Contributor permissions, you can view the recommendations for assessments created by other users and the assessments that you created.

1. Open the **Assessments** main page and then any completed assessment. The recommendations list page for that assessment opens.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-recommendation-list-2-m.png" alt-text="Screenshot of Azure Advisor **Recommendations list** page." lightbox="./media/advisor-assessments/advisor-assessment-recommendation-list-2-m.png":::
1. You can sort the recommendations based on **Priority**, **Recommendation**, and **Category**. You can also use **Actions** > **Group** to group the recommendations by category or priority.
:::image type="content" source="./media/advisor-assessments/advisor-assessment-recommendation-list-filtered-m.png" alt-text="Screenshot of Azure Advisor **Recommendations list, filtered** page." lightbox="./media/advisor-assessments/advisor-assessment-recommendation-list-filtered-m.png":::

> [!NOTE]
> Assessment recommendations have no immediate impact on your existing Advisor score.

## Manage Azure Advisor WAF assessment recommendations

You can manage WAF assessment recommendations, setting recommendation status for what needs action and what can be postponed or dismissed. You can also track recommendations via the different recommendation statuses.

Managing Advisor WAF assessment recommendations is slightly different than managing regular Advisor recommendations.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-recommendation-list-pane-2-m.png" alt-text="Screenshot of Azure Advisor **Recommendations list** page, detail pane." lightbox="./media/advisor-assessments/advisor-assessment-recommendation-list-pane-2-m.png":::

* On the **Not started** tab, with new recommendations, you can set initial status changes. For example, mark a recommendation as *In progress*:  If you accept a recommendation and start working on it, select **Mark as in progress**, which moves it to the **In progress** tab.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-mark-in-progress-m.png" alt-text="Screenshot of Azure Advisor **Marked recommendations list**." lightbox="./media/advisor-assessments/advisor-assessment-mark-in-progress-m.png":::  

* On the **In progress** tab, you can take action on a recommendation by selecting **Mark as completed** or **Dismiss**. If you select **Dismiss**, you must provide a reason as shown in the following screenshot.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-mark-dismiss-options-small.png" alt-text="Screenshot of Azure Advisor **Recommendations dismiss options**." lightbox="./media/advisor-assessments/advisor-assessment-mark-dismiss-options-small.png":::

* You can accept or dismiss or set status on multiple recommendations at a time using the checkbox control. The action you take moves the selected recommendations to the tab for that action. For example, if you mark recommendations as *In progress*, they're moved to the **In progress** tab.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-mark-multiple-m.png" alt-text="Screenshot of Azure Advisor **Multiple marked recommendations list**." lightbox="./media/advisor-assessments/advisor-assessment-mark-multiple-m.png":::

* You can reset a recommendations status. If you reset the status, it returns to the **Not started** status.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-mark-reset-m.png" alt-text="Screenshot of Azure Advisor **Recommendations reset**." lightbox="./media/advisor-assessments/advisor-assessment-mark-reset-m.png":::

* You can postpone a recommendation. If you do so, pick a time length for the postponement. Postponed recommendations move to the **Postponed or dismissed** tab.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-mark-postpone-options-small.png" alt-text="Screenshot of Azure Advisor **Recommendations postpone options**." lightbox="./media/advisor-assessments/advisor-assessment-mark-postpone-options-small.png":::

## Act on and complete Azure Advisor WAF assessments

Operations experts review and act on recommendations marked as *In progress*.

Once the recommendation is, or multiple recommendations are, selected with **Mark as completed** selected, in the **In progress** tab, those recommendations are moved to the **Completed** tab.

:::image type="content" source="./media/advisor-assessments/advisor-assessment-mark-completed-m.png" alt-text="Screenshot of Azure Advisor **Completed recommendations**." lightbox="./media/advisor-assessments/advisor-assessment-mark-completed-m.png":::

## Azure Advisor WAF assessments FAQs

Some common questions and answers.

**Q**. Can I edit previously taken assessments?\
**A**. In the current program, assessments can't be edited once completed.

**Q**. Why am I not getting any recommendations?\
**A**. If you didn't answer all of the assessment questions and skipped to **View guidance**, you might not get any recommendations generated. The other reason might be that the Learn platform hasn't generated any recommendations for the assessment.

**Q**. Can I view recommendations for the assessments not taken by me?\
**A**. Subscription role-based access control (RBAC) limits access to recommendations and assessments in Advisor. You can see recommendations for all completed assessments only if you have Reader/Contributor access to the subscription under which assessment is created.

**Q**. Can I take multiple assessments for a subscription?\
**A**. There's no limit on the number of assessments that can be taken for a subscription. However, while creating a new assessment, you're notified if an existing assessment of the same type is already created for the same subscription/workload.

**Q**. How do assessment-based recommendations affect my Advisor score?\
**A**. We're working on a score strategy that includes the resolution of assessment-based recommendations as well.

**Q**. I completed my assessment, but I don't see the recommendations and the assessment shows "In progress," why?\
**A**. Currently, it could take up to a maximum of eight hours, for the recommendations to sync into Advisor after we complete the assessment in the Learn platform. We're working on fixing it.

**Q**. An error occurred while trying to retrieve the list.\
**A**. This error occurs when you don't have Contributor or Reader access to any subscription. Work with your administrator to get access.  

**Q**. Assessment type drop down is disabled for a subscription.\
**A**. This error occurs when you don't have Contributor access on the subscription selected. Work with your administrator to get access or select a different subscription.  

**Q**. Unable to log in to learn – "Your account is not registered to Microsoft Learn which is required before you can start assessment."\
**A**. In the current release, we only support accounts whose home tenant is same as the tenant in which the subscription lies. As a workaround, ask your administrator to create a new account in the tenant of the subscription and use that account to register on Learn platform. To know more about tenant profiles and home tenant, check [Accounts & tenant profiles (Android)](/entra/identity-platform/accounts-overview).  

**Q**. Unable to log in to learn – "Looks like you are using an External/Guest Account which is not supported."\
**A**. In the current release, we only support accounts whose home tenant is same as the tenant in which the subscription lies. As a workaround, ask your administrator to create a new account in the tenant of the subscription and use that account to register on Learn platform. To know more about tenant profiles and home tenant, check [Accounts & tenant profiles (Android)](/entra/identity-platform/accounts-overview).

## Related content

* [Complete an Azure Well-Architected Review assessment](/azure/well-architected/cross-cutting-guides/implementing-recommendations)
* [Tailored Well-Architected Assessments for your workloads](https://techcommunity.microsoft.com/t5/azure-governance-and-management/tailored-well-architected-assessments-for-your-workloads/ba-p/2914022)
* [Azure Machine Learning](/assessments/eec33ce4-4ef0-4bd2-9f69-1956e50465d4/)
