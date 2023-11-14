---
title: Regulatory compliance checks
description: 'Tutorial: Learn how to Improve your regulatory compliance using Microsoft Defender for Cloud.'
ms.topic: tutorial
ms.date: 06/18/2023
---

# Tutorial: Improve your regulatory compliance

Microsoft Defender for Cloud helps streamline the process for meeting regulatory compliance requirements, using the **regulatory compliance dashboard**. Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in the standards that you've applied to your subscriptions. The dashboard reflects the status of your compliance with these standards.

When you enable Defender for Cloud on an Azure subscription, the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) is automatically assigned to that subscription. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/), [PCI-DSS](https://www.pcisecuritystandards.org/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

The regulatory compliance dashboard shows the status of all the assessments within your environment for your chosen standards and regulations. As you act on the recommendations and reduce risk factors in your environment, your compliance posture improves.

> [!TIP]
> Compliance data from Defender for Cloud now seamlessly integrates with [Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager), allowing you to centrally assess and manage compliance across your organization's entire digital estate. When you add any standard to your compliance dashboard (including compliance standards monitoring other clouds like AWS and GCP), the resource-level compliance data is automatically surfaced in Compliance Manager for the same standard. Compliance Manager thus provides improvement actions and status across your cloud infrastructure and all other digital assets in this central tool. For more information, see [Multicloud support in Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager-multicloud).

In this tutorial you'll learn how to:

> [!div class="checklist"]
>
> - Evaluate your regulatory compliance using the regulatory compliance dashboard
> - Check Microsoft’s compliance offerings (currently in preview) for Azure, Dynamics 365 and Power Platform products
> - Improve your compliance posture by taking action on recommendations
> - Download PDF/CSV reports as well as certification reports of your compliance status
> - Setup alerts on changes to your compliance status
> - Export your compliance data as a continuous stream and as weekly snapshots

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To step through the features covered in this tutorial:

- [Enable enhanced security features](enable-enhanced-security.md). You can enable these for free for 30 days.
- You must be signed in with an account that has reader access to the policy compliance data. The **Reader** role for the subscription has access to the policy compliance data, but the **Security Reader** role doesn't. At a minimum, you'll need to have **Resource Policy Contributor** and **Security Admin** roles assigned.

## Assess your regulatory compliance

The regulatory compliance dashboard shows your selected compliance standards with all their requirements, where supported requirements are mapped to applicable security assessments. The status of these assessments reflects your compliance with the standard.

Use the regulatory compliance dashboard to help focus your attention on the gaps in compliance with your chosen standards and regulations. This focused view also enables you to continuously monitor your compliance over time within dynamic cloud and hybrid environments.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **Regulatory compliance**.

    The dashboard provides you with an overview of your compliance status and the set of supported compliance regulations. You'll see your overall compliance score, and the number of passing vs. failing assessments associated with each standard.

:::image type="content" source="./media/regulatory-compliance-dashboard/compliance-drilldown.png" alt-text="Screenshot that shows the exploration of the details of compliance with a specific standard." lightbox="media/regulatory-compliance-dashboard/compliance-drilldown.png":::

 The following list has a numbered item that matches each location in the image above, and describes what is in the image:

- Select a compliance standard to see a list of all controls for that standard. (1)
- View the subscription(s) that the compliance standard is applied on. (2)
- Select a Control to see more details. Expand the control to view the assessments associated with the selected control. Select an assessment to view the list of resources associated and the actions to remediate compliance concerns. (3)
- Select Control details to view Overview, Your Actions and Microsoft Actions tabs. (4)
- In the Your Actions tab, you can see the automated and manual assessments associated to the control. (5)
- Automated assessments show the number of failed resources and resource types, and link you directly to the remediation experience to address those recommendations. (6)
- The manual assessments can be manually attested, and evidence can be linked to demonstrate compliance. (7)

## Investigate regulatory compliance issues

You can use the information in the regulatory compliance dashboard to investigate any issues that might be affecting your compliance posture.

**To investigate your compliance issues**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **Regulatory compliance**.

1. Select a regulatory compliance standard.

1. Select a compliance control to expand it.

1. Select **Control details**.

    :::image type="content" source="media/regulatory-compliance-dashboard/control-detail.png" alt-text="Screenshot that shows you where to navigate to select control details on the screen.":::

    - Select **Overview** to see the specific information about the Control you selected.
    - Select **Your Actions** to see a detailed view of automated and manual actions you need to take to improve your compliance posture.
    - Select **Microsoft Actions** to see all the actions Microsoft took to ensure compliance with the selected standard.  

1. Under **Your Actions**, you can select a down arrow to view more details and resolve the recommendation for that resource.

    :::image type="content" source="media/regulatory-compliance-dashboard/down-arrow.png" alt-text="Screenshot that shows you where the down arrow is on the screen.":::

    For more information about how to apply recommendations, see [Implementing security recommendations in Microsoft Defender for Cloud](review-security-recommendations.md).

    > [!NOTE]
    > Assessments run approximately every 12 hours, so you will see the impact on your compliance data only after the next run of the relevant assessment.

## Remediate an automated assessment

The regulatory compliance has both automated and manual assessments that might need to be remediated. Using the information in the regulatory compliance dashboard, improve your compliance posture by resolving recommendations directly within the dashboard.

**To remediate an automated assessment**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **Regulatory compliance**.

1. Select a regulatory compliance standard.

1. Select a compliance control to expand it.

1. Select any of the failing assessments that appear in the dashboard to view the details for that recommendation. Each recommendation includes a set of remediation steps to resolve the issue.

1. Select a particular resource to view more details and resolve the recommendation for that resource. <br>For example, in the **Azure CIS 1.1.0** standard, select the recommendation **Disk encryption should be applied on virtual machines**.

    :::image type="content" source="./media/regulatory-compliance-dashboard/sample-recommendation.png" alt-text="Selecting a recommendation from a standard leads directly to the recommendation details page.":::

1. In this example, when you select **Take action** from the recommendation details page, you arrive in the Azure Virtual Machine pages of the Azure portal, where you can enable encryption from the **Security** tab:

    :::image type="content" source="./media/regulatory-compliance-dashboard/encrypting-vm-disks.png" alt-text="Take action button on the recommendation details page leads to the remediation options.":::

    For more information about how to apply recommendations, see [Implementing security recommendations in Microsoft Defender for Cloud](review-security-recommendations.md).

1. After you take action to resolve recommendations, you'll see the result in the compliance dashboard report because your compliance score improves.

    > [!NOTE]
    > Assessments run approximately every 12 hours, so you will see the impact on your compliance data only after the next run of the relevant assessment.

## Remediate a manual assessment

The regulatory compliance has automated and manual assessments that might need to be remediated. Manual assessments are assessments that require input from the customer to remediate them.

**To remediate a manual assessment**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **Regulatory compliance**.

1. Select a regulatory compliance standard.

1. Select a compliance control to expand it.

1. Under the Manual attestation and evidence section, select an assessment.

1. Select the relevant subscriptions.

1. Select **Attest**.

1. Enter the relevant information and attach evidence for compliance.

1. Select **Save**.

## Generate compliance status reports and certificates

- To generate a PDF report with a summary of your current compliance status for a particular standard, select **Download report**.

    The report provides a high-level summary of your compliance status for the selected standard based on Defender for Cloud assessments data. The report's organized according to the controls of that particular standard. The report can be shared with relevant stakeholders, and might provide evidence to internal and external auditors.

    :::image type="content" source="./media/regulatory-compliance-dashboard/download-report.png" alt-text="Using the toolbar in Defender for Cloud's regulatory compliance dashboard to download compliance reports.":::

- To download Azure and Dynamics **certification reports** for the standards applied to your subscriptions, use the **Audit reports** option.

    :::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Using the toolbar in Defender for Cloud's regulatory compliance dashboard to download Azure and Dynamics certification reports.":::

    Select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need:

    :::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard-ga.png" alt-text="Filtering the list of available Azure Audit reports using tabs and filters.":::

    For example, from the PCI tab you can download a ZIP file containing a digitally signed certificate demonstrating Microsoft Azure, Dynamics 365, and Other Online Services' compliance with ISO22301 framework, together with the necessary collateral to interpret and present the certificate.

    > [!NOTE]
    > When you download one of these certification reports, you'll be shown the following privacy notice:
    >
    > _By downloading this file, you are giving consent to Microsoft to store the current user and the selected subscriptions at the time of download. This data is used in order to notify you in case of changes or updates to the downloaded audit report. This data is used by Microsoft and the audit firms that produce the certification/reports only when notification is required._

### Check compliance offerings status

Transparency provided by the compliance offerings (currently in preview), allows you to view the certification status for each of the services provided by Microsoft prior to adding your product to the Azure platform.

**To check the compliance offerings status**:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Navigate to **Defender for Cloud** > **Regulatory compliance**.

1. Select **Compliance offerings**.

    :::image type="content" source="media/regulatory-compliance-dashboard/compliance-offerings.png" alt-text="Screenshot that shows where to select the compliance offering button from the dashboard." lightbox="media/regulatory-compliance-dashboard/compliance-offerings.png":::

1. Enter a service in the search bar to view its compliance offering.

    :::image type="content" source="media/regulatory-compliance-dashboard/search-service.png" alt-text="Screenshot of the compliance offering screen with the search bar highlighted." lightbox="media/regulatory-compliance-dashboard/search-service.png":::

## Configure frequent exports of your compliance status data

If you want to track your compliance status with other monitoring tools in your environment, Defender for Cloud includes an export mechanism to make this straightforward. Configure **continuous export** to send select data to an Azure Event Hubs or a Log Analytics workspace. Learn more in [continuously export Defender for Cloud data](continuous-export.md).

Use continuous export data to an Azure Event Hubs or a Log Analytics workspace:

- Export all regulatory compliance data in a **continuous stream**:

    :::image type="content" source="media/regulatory-compliance-dashboard/export-compliance-data-stream.png" alt-text="Continuously export a stream of regulatory compliance data." lightbox="media/regulatory-compliance-dashboard/export-compliance-data-stream.png":::

- Export **weekly snapshots** of your regulatory compliance data:

    :::image type="content" source="media/regulatory-compliance-dashboard/export-compliance-data-snapshot.png" alt-text="Continuously export a weekly snapshot of regulatory compliance data." lightbox="media/regulatory-compliance-dashboard/export-compliance-data-snapshot.png":::

> [!TIP]
> You can also manually export reports about a single point in time directly from the regulatory compliance dashboard. Generate these **PDF/CSV reports** or **Azure and Dynamics certification reports** using the **Download report** or **Audit reports** toolbar options. See [Assess your regulatory compliance](#assess-your-regulatory-compliance)

## Run workflow automations when there are changes to your compliance

Defender for Cloud's workflow automation feature can trigger Logic Apps whenever one of your regulatory compliance assessments changes state.

For example, you might want Defender for Cloud to email a specific user when a compliance assessment fails. You'll need to first create the logic app (using [Azure Logic Apps](../logic-apps/logic-apps-overview.md))  and then set up the trigger in a new workflow automation as explained in [Automate responses to Defender for Cloud triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation." lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::

## Next steps

In this tutorial, you learned about using Defender for Cloud’s regulatory compliance dashboard to:

> [!div class="checklist"]
>
> - View and monitor your compliance posture regarding the standards and regulations that are important to you.
> - Improve your compliance status by resolving relevant recommendations and watching the compliance score improve.

The regulatory compliance dashboard can greatly simplify the compliance process, and significantly cut the time required for gathering compliance evidence for your Azure, hybrid, and multicloud environment.

To learn more, see these related pages:

- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md) - Learn how to select which standards appear in your regulatory compliance dashboard.
- [Managing security recommendations in Defender for Cloud](review-security-recommendations.md) - Learn how to use recommendations in Defender for Cloud to help protect your Azure resources.
- Check out [common questions](faq-regulatory-compliance.yml) about regulatory compliance.
