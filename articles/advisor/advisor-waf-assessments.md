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

The Azure Well-Architected Framework, WAF, is a design framework that helps you understand the pros and cons of cloud system options and can improve the quality of a workload. To learn more, see [Azure Well- Architected Framework](/azure/well-architected/)

Microsoft now offers WAF Assessment recommendations related to Azure resources based on the five pillars of WAF to Azure Advisor customers with the goal of enabling you to take assessments on, and receive recommendations directly within, the Advisor platform.

> [!NOTE]
> Only the Assessments initiated via Advisor are visible on Advisor for the selected subscription and/or workload. 

Microsoft WAF Assessments help you work through a scenario of questions and recommendations that result in a curated guidance report that is actionable and informative. Assessments take time but it's time well-spent. 
Azure Advisor WAF Assessments help you identify gaps in your workloads across five pillars: Reliability, Cost, Operational Excellence, Performance, and Security via a set of curated questions on your workload.  Assessments need you to work through a scenario of questions on your workloads and then provide recommendations that are actionable and informative. For the preview launch, we enabled the following two assessments via Advisor 

* [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)

* [Azure Well-Architected Review](/assessments/azure-architecture-review/).

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

## Create Azure Advisor WAF Assessments

1. Select **New assessment**. An input area opens.
 
:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-populated.png" alt-text="Sreenshot of Azure Advisor **Start new assessment** main page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-populated.png":::

1. Provide the input parameters:

* **Subscription**: Choose from the list of available subscriptions in the dropdown Advisor. Once chosen, the system looks for workloads configured for that subscription. Not all subscriptions are available for the WAF Assessments preview.

* **Workload** (optional): If you have workloads configured for that subscription, you can view them in the list and select one.

* **Assessment type**: In the preview launch, we enabled two types of assessments:
  * [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)
  * [Azure Well-Architected Review](/assessments/azure-architecture-review/)

* **Assessment name**: A unique name for the assessment. Typing in the name activates the **Review and Create** option at the top of the page and the **Next** button at the bottom of the page. To find an existing assessment, go to the main **Assessments** page. 
  
1. Select **Next**. A page opens that shows all of the existing assessments with the same subscription and workload (if any), and status of each similar assessment, both *Completed* and *In progress*. You can see the results of that assessment before deciding to start a new one. 

If you arrow back a page, or use the **Review and create** tab, the new assessment options form is reset.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-tiles.png" alt-text="Sreenshot of Azure Advisor **Start new assessment** assessments tile page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-tiles.png":::

You can choose to: 

  a. View the recommendations generated for a completed recommendation

  b. Resume an assessment you initiated earlier. If you do so, you're redirected to **Learn** platform, select **Continue** to resume creating the assessment
  
  c. Review the recommendations of a completed assessment created by someone from your organization

  d. Create a new assessment

> [!NOTE]
> You cannot resume an in-progress assessment created by someone else. 

1. Select **Create** or **Click here to start a new assessment** at the top of the page. The **Learn > Assessments** question pages open to the **Assessment overview** page. The **Progress** bar shows how many questions are part of this assessment. The **Milestones** table includes the assessment by default, as the initial milestone. Adding milestones can help you keep track of progress as you implement the assessment recommendations. To learn more about milestones, see [Microsoft Assessments - Milestones](https://techcommunity.microsoft.com/t5/core-infrastructure-and-security/microsoft-assessments-milestones/ba-p/3975841).

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-learn.png" alt-text="Sreenshot of Azure Advisor **Resume assessment** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-learn.png":::

1. To begin the assessment creation process, select **Continue**. The first assessment question page opens.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-workload.png" alt-text="Sreenshot of Azure Advisor **Choose assessment workload** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-workload.png":::

1.	On that page, select a workload type. Each workload type results in a list of approximately 60 questions based on the key recommendations provided in the pillars of the Well-Architected Framework. To know more about workload types, see [Well-Architected Branches for Assessing Workload-Types - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-architecture-blog/well-architected-branches-for-assessing-workload-types/ba-p/3267234).

  * Core Well-Architected Review (WAF only, not Mission Critical): Evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of the selected subscription. To learn more, see [Azure Well-Architected Review](/assessments/azure-architecture-review/)

  * Azure Machine Learning: Evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your machine learning models. The Compute targets and Instance types are two key concepts in Azure Machine Learning. To learn more, see [Assessing your machine learning workloads](/shows/azure-enablement/assessing-your-machine-learning-workloads)

  * Internet of Things: Evaluates your IoT solution through the lenses of the Well-Architected Framework Security and Reliability pillars. After the assessment (WAF only, not Mission Critical) identifies key recommendations for your IoT solution, you can use the following content to help implement the recommendations:

    * [Reliability](/azure/well-architected/iot/iot-reliability): Complete the reliability questions for IoT workloads in the Azure Well-Architected Review.
     
    * [Security](/azure/well-architected/iot/iot-security): Complete the security questions for IoT workloads in the Azure Well-Architected Review.
  
  * SAP On Azure (Preview): Evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your SAP applications running on Azure infrastructure as a service. For detailed information on the different types of storage and their capability and usability with SAP workloads and SAP components, see [Azure Storage types for SAP workload](/azure/sap/workloads/planning-guide-storage). 

  * Azure Stack Hub (Preview): Evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your workloads running on Azure Stack Hub. The Manage methodology of the Cloud Adoption Framework suggests Azure Stack hub operations management activities focusing on the following list of core responsibilities:

    * Inventory and visibility: Create an inventory of assets across multiple clouds. Develop visibility into the run state of each asset.

    * Operational compliance: Establish controls and processes to ensure that each state is properly configured and running in a well-governed environment.

    * Protect and recover: Ensure that all managed assets are protected and can be recovered by using baseline management tooling.

    * Enhanced baseline options: Evaluate common additions to the baseline that might meet business needs.

    * Platform operations: Extend the management baseline with a well-defined service catalog and centrally managed platforms.

    * Workload operations: Extend the management baseline to include a focus on mission-critical workloads.

When ready, select **Next**. The second assessment questions page opens.

1. Select a Core Pillar of WAF to be used in the assessment. To learn more about well architected pillars, see [Introducing the Microsoft Azure Well-Architected Framework](https://azure.microsoft.com/blog/introducing-the-microsoft-azure-wellarchitected-framework/). When ready, select **Next**.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar.png" alt-text="Sreenshot of Azure Advisor **Choose pillar assessment** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar.png":::

1.	Based on your response for workload type and core pillar, the number of questions vary. Your answers to the questions are essential to the quality of the assessment recommendations. Respond to the different question and continue clicking on **Next** until you reach a page with **View guidance**.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-detail-2-populated.png" alt-text="Sreenshot of Azure Advisor **Choose pillar assessment detail** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-detail-2-populated.png":::

1. Select **View guidance**. An assessment results, or guidance, page opens.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-results-guidance-next-steps-improve-results-expanded.png" alt-text="Sreenshot of Azure Advisor **Guidance** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-results-guidance-next-steps-improve-results-expanded.png":::

1.	You can export offline guidance in an excel file from learn platform immediately.

:::image type="content" source="./media/advisor-waf-assessments/waf-assessments-export-results.png" alt-text="Sreenshot of Azure Advisor **Guidance** page, export results." lightbox="./media/advisor-waf-assessments/waf-assessments-export-results.png":::

The assessment recommendations are available in Azure Advisor after a maximum of 8 hours of after completion.  

**Key Points**:

* The assessments are tailored to your selected workload type, such as IoT, SAP, data services, machine learning, etc., which you choose during the questioning. The Azure Well-Architected Framework provides a suite of actionable guidance that you can use to improve your workloads in the areas that matter most to your business. The framework is designed to help you evaluate your workloads against the latest set of Azure best practices.	
* There's no limit on the number of assessments that can be taken for a subscription. However, while creating a new assessment, you're notified if there's an existing assessment already created for the same subscription and workload. 
* Currently, we don't allow you to edit completed assessments in Advisor.

## View and Azure Advisor WAF assessment recommendations

There are multiple avenues to access the recommendations. But you must have the correct permissions.

To learn more about permissions, see [Permissions in Azure Advisor](/azure/advisor/permissions). To find out what subscriptions you have permissions for, and what level of permissions, see [List Azure role assignments using the Azure portal](/azure/role-based-access-control/role-assignments-list-portal#list-owners-of-a-subscription). If you have Contributor permissions, you can view the recommendations for assessments created by other users and the assessments that you created. 

1. Open the **Assessments** main page and then any completed assessment. The recommendations list page for that assessment opens. 

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list.png" alt-text="Sreenshot of Azure Advisor **Recommendations list** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list.png":::

1. Managing Advisor assessment recommendations is slightly different than managing regular Advisor recommendations.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list-detail-pane.png" alt-text="Sreenshot of Azure Advisor **Recommendations list** page, detail pane." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-recommendation-list-detail-pane.png":::

From the recommendations list page, you can:
  * Select a recommendation and see details about it in a pane that opens
  * *Postpone*, *Dismiss*, or mark as *In progress*. If you mark a recommendation as in progress and finish with it (take the recommended actions), it's important to mark it as completed. You do this through the recommendation list in the **In progress** view, or through the detail pane of a recommendation in progress. 

> [!NOTE]
> Assessment recommendations have no immediate impact on your existing Advisor score. 



## Related content

* [Complete an Azure Well-Architected Review assessment](/azure/well-architected/cross-cutting-guides/implementing-recommendations)
* [Tailored Well-Architected Assessments for your workloads](https://techcommunity.microsoft.com/t5/azure-governance-and-management/tailored-well-architected-assessments-for-your-workloads/ba-p/2914022)
* [Azure Machine Learning](/assessments/eec33ce4-4ef0-4bd2-9f69-1956e50465d4/)

