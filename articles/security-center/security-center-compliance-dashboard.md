---
title: 'Tutorial: Regulatory compliance checks - Azure Security Center'
description: 'Tutorial: Learn how to Improve your regulatory compliance using Azure Security Center.'
services: security-center
documentationcenter: na
author: memildin
manager: rkarlin
ms.assetid: 5f50c4dc-ea42-418d-9ea8-158ffeb93706
ms.service: security-center
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 02/04/2021
ms.author: memildin

---
# Tutorial: Improve your regulatory compliance

Azure Security Center helps streamline the process for meeting regulatory compliance requirements, using the **regulatory compliance dashboard**. 

Security Center continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in the standards applied to your subscriptions. The dashboard reflects the status of your compliance with these standards. 

When you enable Security Center on an Azure subscription, it is automatically assigned the [Azure Security Benchmark](../security/benchmarks/introduction.md). This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

The regulatory compliance dashboard shows the status of all the assessments within your environment for your chosen standards and regulations. As you act on the recommendations and reduce risk factors in your environment, your compliance posture improves.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Evaluate your regulatory compliance using the regulatory compliance dashboard
> * Improve your compliance posture by taking action on recommendations
> * Setup alerts on changes to your compliance posture
> * Export your compliance data as a continuous stream and as weekly snapshots

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To step through the features covered in this tutorial:

- [Azure Defender](azure-defender.md) must be enabled. You can try Azure Defender for free for 30 days.
- You need to be signed in with an account that has reader access to the policy compliance data (**Security Reader** is insufficient). The role of **Global reader** for the subscription will work. At a minimum, you'll need to have **Resource Policy Contributor** and **Security Admin** roles assigned.

##  Assess your regulatory compliance

The regulatory compliance dashboard shows your selected compliance standards with all their requirements, where supported requirements are mapped to applicable security assessments. The status of these assessments reflects your compliance with the standard.

Use the regulatory compliance dashboard to help focus your attention on the gaps in compliance with your chosen standards and regulations. This focused view also enables you to continuously monitor your compliance over time within dynamic cloud and hybrid environments.

1. From Security Center's menu, select **Regulatory compliance**.

    At the top of the screen is a dashboard with an overview of your compliance status with the set of supported compliance regulations. You'll see your overall compliance score, and the number of passing vs. failing assessments associated with each standard.

    :::image type="content" source="./media/security-center-compliance-dashboard/compliance-dashboard.png" alt-text="Regulatory compliance dashboard" lightbox="./media/security-center-compliance-dashboard/compliance-dashboard.png":::

1. Select a tab for a compliance standard that is relevant to you (1). You'll see which subscriptions the standard is applied on (2), and the list of all controls for that standard (3). For the applicable controls, you can view the details of passing and failing assessments associated with that control (4), as well as the numbers of affected resources (5). Some controls are grayed out. These controls don't have any Security Center assessments associated with them. Check the requirements for these and assess them in your environment on your own. Some of these might be process-related and not technical.

    :::image type="content" source="./media/security-center-compliance-dashboard/compliance-drilldown.png" alt-text="Exploring the details of compliance with a specific standard":::

1. To generate a PDF report with a summary of your current compliance status for a particular standard, select **Download report**.

    The report provides a high-level summary of your compliance status for the selected standard based on Security Center assessments data, and is organized according to the controls of that particular standard. The report can be shared with relevant stakeholders, and might provide evidence to internal and external auditors.

    :::image type="content" source="./media/security-center-compliance-dashboard/download-report.png" alt-text="Download compliance report":::

## Improve your compliance posture

Using the information in the regulatory compliance dashboard, improve your compliance posture by resolving recommendations directly within the dashboard.

1.  Click through any of the failing assessments that appear in the dashboard to view the details for that recommendation. Each recommendation includes a set of remediation steps that should be followed to resolve the issue.

1.  Select a particular resource to view more details and resolve the recommendation for that resource. <br>For example, in the **Azure CIS 1.1.0** standard, select the recommendation **Disk encryption should be applied on virtual machines**.

    :::image type="content" source="./media/security-center-compliance-dashboard/sample-recommendation.png" alt-text="Selecting a recommendation from a standard leads directly to the recommendation details page":::

1. In this example, when you select **Take action** from the recommendation details page, you arrive in the Azure Virtual Machine pages of the Azure portal, where you can enable encryption from the **Security** tab:

    :::image type="content" source="./media/security-center-compliance-dashboard/encrypting-vm-disks.png" alt-text="Take action button on the recommendation details page leads to the remediation options":::

    For more information about how to apply recommendations, see [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).

1.  After you take action to resolve recommendations, you'll see the impact in the compliance dashboard report because your compliance score improves.

    > [!NOTE]
    > Assessments run approximately every 12 hours, so you will see the impact on your compliance data only after the next run of the relevant assessment.


## Export your compliance status data

If you want to track your compliance status with other monitoring tools in your environment, Security Center includes an export mechanism to make this straightforward. Configure **continuous export** to send select data to an Azure Event Hub or a Log Analytics workspace.

Use continuous export data to an Azure Event Hub or a Log Analytics workspace:

- Export all regulatory compliance data in a **continuous stream**:

    :::image type="content" source="media/security-center-compliance-dashboard/export-compliance-data-stream.png" alt-text="Continuously export a stream of regulatory compliance data" lightbox="media/security-center-compliance-dashboard/export-compliance-data-stream.png":::

- Export **weekly snapshots** of your regulatory compliance data:

    :::image type="content" source="media/security-center-compliance-dashboard/export-compliance-data-snapshot.png" alt-text="Continuously export a weekly snapshot of regulatory compliance data" lightbox="media/security-center-compliance-dashboard/export-compliance-data-snapshot.png":::

You can also export a **PDF/CSV report** of your compliance data directly from the regulatory compliance dashboard:

:::image type="content" source="media/security-center-compliance-dashboard/export-compliance-data-report.png" alt-text="Export your regulatory compliance data as a PDF or CSV report" lightbox="media/security-center-compliance-dashboard/export-compliance-data-report.png":::

Learn more in [continuously export Security Center data](continuous-export.md).


## Run workflow automations when there are changes to your compliance

Security Center's workflow automation feature can trigger Logic Apps whenever one of your regulatory compliance assessments change state.

For example, you might want Security Center to email a specific user when a compliance assessment fails. You'll need to create the logic app (using [Azure Logic Apps](../logic-apps/logic-apps-overview.md)) first and then setup the trigger in a new workflow automation as explained in [Automate responses to Security Center triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation" lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::

## Next steps

In this tutorial, you learned about using Security Center’s regulatory compliance dashboard to:

- View and monitor your compliance posture regarding the standards and regulations that are important to you.
- Improve your compliance status by resolving relevant recommendations and watching the compliance score improve.

The regulatory compliance dashboard can greatly simplify the compliance process, and significantly cut the time required for gathering compliance evidence for your Azure, hybrid, and multi-cloud environment.

To learn more, see these related pages:

- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md) - Learn how to select which standards appear in your regulatory compliance dashboard. 
- [Security health monitoring in Azure Security Center](security-center-monitoring.md) - Learn how to monitor the health of your Azure resources.
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) - Learn how to use recommendations in Azure Security Center to help protect your Azure resources.