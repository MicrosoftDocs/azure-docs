---
title: Improve regulatory compliance in Microsoft Defender for Cloud
description: Learn how to improve regulatory compliance in Microsoft Defender for Cloud.
ms.topic: tutorial
ms.date: 06/18/2023
---

# Improve regulatory compliance

Microsoft Defender for Cloud helps you to meet regulatory compliance requirements by continuously assessing resources against compliance controls, and identifying issues that are blocking you from achieving a particular compliance certification.

In the **Regulatory compliance** dashboard, you manage and interact with compliance standards. You can see which compliance standards are assigned, turn standards on and off for Azure, AWS, and GCP, review the status of assessments against standards, and more.

## Integration with Purview

Compliance data from Defender for Cloud now seamlessly integrates with [Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager), allowing you to centrally assess and manage compliance across your organization's entire digital estate.

When you add any standard to your compliance dashboard (including compliance standards monitoring other clouds like AWS and GCP), the resource-level compliance data is automatically surfaced in Compliance Manager for the same standard.

Compliance Manager thus provides improvement actions and status across your cloud infrastructure and all other digital assets in this central tool. For more information, see [multicloud support in Microsoft Purview Compliance Manager](/microsoft-365/compliance/compliance-manager-multicloud).




## Before you start

- By default, when you enable Defender for Cloud on an Azure subscription, AWS account, or GCP plan, the MCSB plan is enabled
- You can add additional non-default compliance standards when at least one paid plan is enabled in Defender for Cloud.
- You must be signed in with an account that has reader access to the policy compliance data. The **Reader** role for the subscription has access to the policy compliance data, but the **Security Reader** role doesn't. At a minimum, you need to have **Resource Policy Contributor** and **Security Admin** roles assigned.


## Assess regulatory compliance

The **Regulatory compliance** dashboard shows which compliance standards are enabled. It shows the controls within each standard, and security assessments for those controls. The status of these assessments reflects your compliance with the standard.

The dashboard helps you to focus on gaps in standards, and to monitor compliance over time.


1. In the Defender for Cloud portal open the **Regulatory compliance** page.

    :::image type="content" source="./media/regulatory-compliance-dashboard/compliance-drilldown.png" alt-text="Screenshot that shows the exploration of the details of compliance with a specific standard." lightbox="media/regulatory-compliance-dashboard/compliance-drilldown.png":::

1. Use the dashboard in accordance with the numbered items in the image.

    - (1). Select a compliance standard to see a list of all controls for that standard.
    - (2). View the subscriptions on which the compliance standard is applied.
    - (3). Select and expand a control to view the assessments associated with it. Select an assessment to view the associated resources, and possible remediation actions.
    - (4). Select **Control details** to view the **Overview**, **Your Actions**, and **Microsoft Actions** tabs.
    - (5). In **Your Actions**, you can see the automated and manual assessments associated with the control.
    - (6). Automated assessments show the number of failed resources and resource types, and link you directly to the remediation information.
    - (7). Manual assessments can be manually attested, and evidence can be linked to demonstrate compliance.

## Investigate issues

You can use information in the dashboard to investigate issues that might affect compliance with the standard.

1. In the Defender for Cloud portal, open **Regulatory compliance**.

1. Select a regulatory compliance standard, and select a compliance control to expand it.

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


1. In the Defender for Cloud portal, open **Regulatory compliance**.

1. Select a regulatory compliance standard, and select a compliance control to expand it.

1. Select any of the failing assessments that appear in the dashboard to view the details for that recommendation. Each recommendation includes a set of remediation steps to resolve the issue.

1. Select a particular resource to view more details and resolve the recommendation for that resource. <br>For example, in the **Azure CIS 1.1.0** standard, select the recommendation **Disk encryption should be applied on virtual machines**.

    :::image type="content" source="./media/regulatory-compliance-dashboard/sample-recommendation.png" alt-text="Screenshot that shows that selecting a recommendation from a standard leads directly to the recommendation details page.":::

1. In this example, when you select **Take action** from the recommendation details page, you arrive in the Azure Virtual Machine pages of the Azure portal, where you can enable encryption from the **Security** tab:

    :::image type="content" source="./media/regulatory-compliance-dashboard/encrypting-vm-disks.png" alt-text="Screenshot that shows the take action button on the recommendation details page leads to the remediation options.":::

    For more information about how to apply recommendations, see [Implementing security recommendations in Microsoft Defender for Cloud](review-security-recommendations.md).

1. After you take action to resolve recommendations, you'll see the result in the compliance dashboard report because your compliance score improves.


Assessments run approximately every 12 hours, so you will see the impact on your compliance data only after the next run of the relevant assessment.

## Remediate a manual assessment

The regulatory compliance has automated and manual assessments that might need to be remediated. Manual assessments are assessments that require input from the customer to remediate them.


1. In the Defender for Cloud portal, open **Regulatory compliance**.

1. Select a regulatory compliance standard, and select a compliance control to expand it.

1. Under the **Manual attestation and evidence** section, select an assessment.

1. Select the relevant subscriptions.

1. Select **Attest**.

1. Enter the relevant information and attach evidence for compliance.

1. Select **Save**.

## Generate compliance status reports and certificates

1. To generate a PDF report with a summary of your current compliance status for a particular standard, select **Download report**.

    The report provides a high-level summary of your compliance status for the selected standard based on Defender for Cloud assessments data. The report's organized according to the controls of that particular standard. The report can be shared with relevant stakeholders, and might provide evidence to internal and external auditors.

    :::image type="content" source="./media/regulatory-compliance-dashboard/download-report.png" alt-text="Screenshot that shows using the toolbar in Defender for Cloud's regulatory compliance dashboard to download compliance reports.":::

1. To download Azure and Dynamics **certification reports** for the standards applied to your subscriptions, use the **Audit reports** option.

    :::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Screenshot that shows using the toolbar in Defender for Cloud's regulatory compliance dashboard to download Azure and Dynamics certification reports.":::

1. Select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need:

    :::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard-ga.png" alt-text="Screenshot that shows filtering the list of available Azure Audit reports using tabs and filters.":::

    For example, from the PCI tab you can download a ZIP file containing a digitally signed certificate demonstrating Microsoft Azure, Dynamics 365, and Other Online Services' compliance with ISO22301 framework, together with the necessary collateral to interpret and present the certificate.


 When you download one of these certification reports, you'll be shown the following privacy notice:
    
 _By downloading this file, you are giving consent to Microsoft to store the current user and the selected subscriptions at the time of download. This data is used in order to notify you in case of changes or updates to the downloaded audit report. This data is used by Microsoft and the audit firms that produce the certification/reports only when notification is required._

### Check compliance offerings status

Transparency provided by the compliance offerings (currently in preview), allows you to view the certification status for each of the services provided by Microsoft prior to adding your product to the Azure platform.

1. In the Defender for Cloud portal, open **Regulatory compliance**.

1. Select **Compliance offerings**.

    :::image type="content" source="media/regulatory-compliance-dashboard/compliance-offerings.png" alt-text="Screenshot that shows where to select the compliance offering button from the dashboard." lightbox="media/regulatory-compliance-dashboard/compliance-offerings.png":::

1. Enter a service in the search bar to view its compliance offering.

    :::image type="content" source="media/regulatory-compliance-dashboard/search-service.png" alt-text="Screenshot of the compliance offering screen with the search bar highlighted." lightbox="media/regulatory-compliance-dashboard/search-service.png":::

## Continuously export compliance status 

If you want to track your compliance status with other monitoring tools in your environment, Defender for Cloud includes an export mechanism to make this straightforward. Configure **continuous export** to send select data to an Azure Event Hubs or a Log Analytics workspace. Learn more in [continuously export Defender for Cloud data](continuous-export.md).

Use continuous export data to an Azure Event Hubs or a Log Analytics workspace:

1. Export all regulatory compliance data in a **continuous stream**:

    :::image type="content" source="media/regulatory-compliance-dashboard/export-compliance-data-stream.png" alt-text="Screenshot that shows how to continuously export a stream of regulatory compliance data." lightbox="media/regulatory-compliance-dashboard/export-compliance-data-stream.png":::

1. Export **weekly snapshots** of your regulatory compliance data:

    :::image type="content" source="media/regulatory-compliance-dashboard/export-compliance-data-snapshot.png" alt-text="Screenshot that shows how to continuously export a weekly snapshot of regulatory compliance data." lightbox="media/regulatory-compliance-dashboard/export-compliance-data-snapshot.png":::

> [!TIP]
> You can also manually export reports about a single point in time directly from the regulatory compliance dashboard. Generate these **PDF/CSV reports** or **Azure and Dynamics certification reports** using the **Download report** or **Audit reports** toolbar options. 

## Trigger a workflow when assessments change

Defender for Cloud's workflow automation feature can trigger Logic Apps whenever one of your regulatory compliance assessments changes state.

For example, you might want Defender for Cloud to email a specific user when a compliance assessment fails. You'll need to first create the logic app (using [Azure Logic Apps](../logic-apps/logic-apps-overview.md))  and then set up the trigger in a new workflow automation as explained in [Automate responses to Defender for Cloud triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Screenshot that shows how to use changes to regulatory compliance assessments to trigger a workflow automation." lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::

## Next steps

To learn more, see these related pages:

- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md) - Learn how to select which standards appear in your regulatory compliance dashboard.
- [Managing security recommendations in Defender for Cloud](review-security-recommendations.md) - Learn how to use recommendations in Defender for Cloud to help protect your Azure resources.
- Check out [common questions](faq-regulatory-compliance.yml) about regulatory compliance.
