---
title: Get started with Azure Advisor
description: Get started with Azure Advisor.
author: mabrahms
ms.author: v-mabrahms
ms.service: azure
ms.topic: article
ms.date: 12/1/2023

#customer intent: As an Advisor user, I want WAF assessments so that I can better understand recommendations.

---

# What are Azure WAF assessments?"

The Azure Well-Architected Framework, WAF, is a design framework that helps you understand the pros and cons of cloud system options and can improve the quality of a workload. To learn more, see [Azure Well- Architected Framework](/azure/well-architected/)

Microsoft now offers WAF Assessment recommendations related to Azure resources based on the 5 pillars of WAF to Azure Advisor customers with the goal of enabling you to take assessments on, and receive recommendations directly within, the Advisor platform.

Microsoft WAF Assessments help you work through a scenario of questions and recommendations that result in a curated guidance report that is actionable and informative. Assessments take time but it is time well-spent. 
Azure Advisor WAF Assessments help you identify gaps in your workloads across five pillars: Reliability, Cost, Operational Excellence, Performance, and Security via a set of curated questions on your workload.  Assessments will need you to work through a scenario of questions on your workloads and then provide recommendations that are actionable and informative. For the preview launch we have enabled the following 2 assessments via Advisor 

* [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)

* [Azure Well-Architected Review](/assessments/azure-architecture-review/).

To see all Microsoft assessment choices, go to the [Learn platform > Assessments](/assessments/).

## Prerequisites

You can manage access to Advisor reviews using built-in roles. The permissions vary by role. These roles need to be configured for the subscription which was used to publish the review.

| **Name** | **Description** |
|---|:---:|
|Advisor Reviews Reader|View assessments for a workload and recommendations linked to them|
|Advisor Reviews Contributor|View assessments for a workload and triage recommendations linked to them|

## Access Azure Advisor WAF Assessments

1. Sign in to the Azure portal and select Advisor from any page. The Advisor page opens.

1. Select **Assessments** in the left navigation menu. The **Assessments** page opens with a list of completed or in progress assessments.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-main-m.png" alt-text="Sreenshot of Azure Advisor WAF assessments main page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-main-m.png":::

## Create Azure Advisor WAF Assessments

1. Click **New assessment**. An input area opens.
 
:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-populated.png" alt-text="Sreenshot of Azure Advisor **Start new assessment** main page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-populated.png":::

1. Provide the input parameters:

* **Subscription**: Choose from the list of available subscriptions in the dropdown Advisor. Once chosen, the system looks for workloads configured for that subscription. Some subscriptions have no configured workloads and offer you no choice for **Assessment type**.

* **Workload** (optional): If you have workloads configured for that subscription, you can view them in the list and select one.

* **Assessment type**: In the preview launch, we have enabled two types of assessments –
  * [Mission Critical | Well-Architected Review](/assessments/23513bdb-e8a2-4f0b-8b6b-191ee1f52d34/)
  * [Azure Well-Architected Review](/assessments/azure-architecture-review/)

* **Assessment name**: A unique name for the assessment. Typing in the name activates the **Review and Create** option at the top of the page and the **Next** button at the bottom of the page.
  
1. Click **Next**. Validation checks are performed. A page opens that shows all of the existing assessments, both *Completed* and *In progress*. You can use the tabs at the top to return to the start new assessment **Basics** view or continue in the **Review and create** view. 

If applicable, a notice appears at the top of the page that there is already an assessment with the same subscription and workload. 

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-tiles.png" alt-text="Sreenshot of Azure Advisor **Start new assessment** assessments tile page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-start-new-tiles.png":::

You can choose to: 
  a. View the recommendations generated for a completed recommendation
  b. Resume an assessment you initiated earlier
  c. Know if someone from your organization is also taking the same assessment 
  d. Create a new assessment

> [!NOTE]
> You cannot resume an in-progress assessment created by someone else.
> If you select **Resume assessment** for a self-owned assessment, you are redirected to Learn platform, click **Continue** to resume creating the assessment. 

1. To begin the assessment creation process, click **Create** at the page bottom or **Create new assessment** at the top of the page. The first assessment configuration page opens.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-learn.png" alt-text="Sreenshot of Azure Advisor **Choose assessment workload** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-learn.png":::

1.	On that page select a workload type. To know more about workload types, see [Well-Architected Branches for Assessing Workload-Types - Microsoft Community Hub](https://techcommunity.microsoft.com/t5/azure-architecture-blog/well-architected-branches-for-assessing-workload-types/ba-p/3267234).
  * Core Well-Architected Review: This evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your workload’s design. To learn more, see [Azure Well-Architected Review](/assessments/azure-architecture-review/)
  * Azure Machine Learning: This evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your machine learning models. The Compute targets and Instance types are two key concepts in Azure Machine Learning. To learn more, see [Assessing your machine learning workloads](https://learn.microsoft.com/shows/azure-enablement/assessing-your-machine-learning-workloads)
  * Internet of Things: This evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your IoT solution. The IoT workload assessment evaluates your IoT solution through the lenses of the Well-Architected Framework Security and Reliability pillars. After the assessment identifies key recommendations for your IoT solution, you can use the following content to help implement the recommendations:
    a. [Reliability](/azure/well-architected/iot/iot-reliability): Complete the reliability questions for IoT workloads in the Azure Well-Architected Review.
    b. [Security](/azure/well-architected/iot/iot-security): Complete the security questions for IoT workloads in the Azure Well-Architected Review.
  * SAP On Azure (Preview): This evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your SAP applications running on Azure infrastructure as a service. For detailed information on the different types of storage and their capability and usability with SAP workloads and SAP components, see [Azure Storage types for SAP workload](/azure/sap/workloads/planning-guide-storage). The article covers topics such as Microsoft Azure Storage resiliency, storage scenarios with SAP workloads, storage recommendations for SAP storage scenarios, and Azure premium storage.
  * Azure Stack Hub (Preview): This evaluates the reliability, security, cost optimization, operational excellence, and performance efficiency of your workloads running on Azure Stack Hub. The Manage methodology of the Cloud Adoption Framework provides suggested operations management activities for Azure Stack Hub 1. These activities focus on the following list of core responsibilities:
    a. Inventory and visibility: Create an inventory of assets across multiple clouds. Develop visibility into the run state of each asset.
    b. Operational compliance: Establish controls and processes to ensure that each state is properly configured and running in a well-governed environment.
    c. Protect and recover: Ensure that all managed assets are protected and can be recovered by using baseline management tooling.
    d. Enhanced baseline options: Evaluate common additions to the baseline that might meet business needs.
    e. Platform operations: Extend the management baseline with a well-defined service catalogue and centrally managed platforms.
    f. Workload operations: Extend the management baseline to include a focus on mission-critical workloads.

Each workload type consists of approximately 60 questions based on the key recommendations provided in the pillars of the Well-Architected Framework. When ready, click **Next**. The second assessment questions page opens.

1. Select a Core Pillar of WAF to be used in the assessment. When ready, click **Next**.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar.png" alt-text="Sreenshot of Azure Advisor **Choose pillar assessment** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar.png":::

1.	Based on your response for workload type and core pillar, the number of questions vary. You can respond to the different question and continue clicking on **Next**.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-detail-2-populated.png" alt-text="Sreenshot of Azure Advisor **Choose pillar assessment detail** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-question-pillar-detail-2-populated.png":::

When ready, select **View guidance**. An assessment results, or guidance, page opens.

:::image type="content" source="./media/advisor-waf-assessments/advisor-waf-assessment-new-results-guidance-next-steps-improve-results-expanded.png" alt-text="Sreenshot of Azure Advisor **Guidance** page." lightbox="./media/advisor-waf-assessments/advisor-waf-assessment-new-results-guidance-next-steps-improve-results-expanded.png":::

1.	You can export offline guidance in an excel file from learn platform immediately.

:::image type="content" source="./media/waf-assessments/advisor-waf-assessment-export-results.png" alt-text="Sreenshot of Azure Advisor **Guidance** page, export results." lightbox="./media/advisor-waf-assessments/waf-assessment-export-results.png":::

The assessment recommendations are available in Azure Advisor after a maximum of 8 hours of after completion. 

Key Points to note:

* The assessments are tailored to your workload type, such as IoT, SAP, data services, machine learning, etc, which you choose during the questioning (???). The Azure Well-Architected Framework provides a suite of actionable guidance that you can use to improve your workloads in the areas that matter most to your business. The framework is designed to help you evaluate your workloads against the latest set of Azure best practices.	
* There is no limit on the number of Assessments that can be taken for a subscription. However, while creating a new Assessment, user is notified if an existing Assessment of the same time is already created for the same subscription/workload. 
* Currently we do not allow editing completed assessments in Advisor.



## Related content

* [Related article title](link.md)
* [Related article title](link.md)
* [Related article title](link.md)