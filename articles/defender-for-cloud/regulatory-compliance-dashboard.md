---
title: 'Tutorial: Regulatory compliance checks - Microsoft Defender for Cloud'
description: 'Tutorial: Learn how to Improve your regulatory compliance using Microsoft Defender for Cloud.'
ms.topic: tutorial
ms.date: 01/24/2023
---

# Tutorial: Improve your regulatory compliance

Microsoft Defender for Cloud helps streamline the process for meeting regulatory compliance requirements, using the **regulatory compliance dashboard**. Defender for Cloud continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in the standards that you've applied to your subscriptions. The dashboard reflects the status of your compliance with these standards.

When you enable Defender for Cloud on an Azure subscription, the [Microsoft cloud security benchmark](/security/benchmark/azure/introduction) is automatically assigned to that subscription. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/), [PCI-DSS](https://www.pcisecuritystandards.org/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

The regulatory compliance dashboard shows the status of all the assessments within your environment for your chosen standards and regulations. As you act on the recommendations and reduce risk factors in your environment, your compliance posture improves.

In this tutorial you'll learn how to:

> [!div class="checklist"]
> * Evaluate your regulatory compliance using the regulatory compliance dashboard
> * Check Microsoft’s compliance offerings (currently in preview) for Azure, Dynamics 365 and Power Platform products 
> * Improve your compliance posture by taking action on recommendations
> * Download PDF/CSV reports as well as certification reports of your compliance status
> * Setup alerts on changes to your compliance status
> * Export your compliance data as a continuous stream and as weekly snapshots

If you don’t have an Azure subscription, create a [free account](https://azure.microsoft.com/free/) before you begin.

## Prerequisites

To step through the features covered in this tutorial:

- [Enable enhanced security features](defender-for-cloud-introduction.md). You can enable these for free for 30 days.
- You must be signed in with an account that has reader access to the policy compliance data. The **Global reader** for the subscription has access to the policy compliance data, but the **Security Reader** role doesn't. At a minimum, you'll need to have **Resource Policy Contributor** and **Security Admin** roles assigned.

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

You can use the information in the regulatory compliance dashboard to investigate any issues that may be affecting your compliance posture.

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

The regulatory compliance has both automated and manual assessments that may need to be remediated. Using the information in the regulatory compliance dashboard, improve your compliance posture by resolving recommendations directly within the dashboard.

**To remediate an automated assessment**:

1. Sign in to the [Azure portal](https://portal.azure.com). 

1. Navigate to **Defender for Cloud** > **Regulatory compliance**.

1. Select a regulatory compliance standard.

1. Select a compliance control to expand it.

1.  Select any of the failing assessments that appear in the dashboard to view the details for that recommendation. Each recommendation includes a set of remediation steps to resolve the issue.

1. Select a particular resource to view more details and resolve the recommendation for that resource. <br>For example, in the **Azure CIS 1.1.0** standard, select the recommendation **Disk encryption should be applied on virtual machines**.

    :::image type="content" source="./media/regulatory-compliance-dashboard/sample-recommendation.png" alt-text="Selecting a recommendation from a standard leads directly to the recommendation details page.":::

1. In this example, when you select **Take action** from the recommendation details page, you arrive in the Azure Virtual Machine pages of the Azure portal, where you can enable encryption from the **Security** tab:

    :::image type="content" source="./media/regulatory-compliance-dashboard/encrypting-vm-disks.png" alt-text="Take action button on the recommendation details page leads to the remediation options.":::

    For more information about how to apply recommendations, see [Implementing security recommendations in Microsoft Defender for Cloud](review-security-recommendations.md).

1.  After you take action to resolve recommendations, you'll see the result in the compliance dashboard report because your compliance score improves.

    > [!NOTE]
    > Assessments run approximately every 12 hours, so you will see the impact on your compliance data only after the next run of the relevant assessment.

## Remediate a manual assessment

The regulatory compliance has automated and manual assessments that may need to be remediated. Manual assessments are assessments that require input from the customer to remediate them.

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

Transparency provided by the compliance offerings (currently in preview) , allows you to view the certification status for each of the services provided by Microsoft prior to adding your product to the Azure platform.

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

## FAQ - Regulatory compliance dashboard

- [How do I know which benchmark or standard to use?](#how-do-i-know-which-benchmark-or-standard-to-use)
- [What standards are supported in the compliance dashboard?](#what-standards-are-supported-in-the-compliance-dashboard)
- [Why do some controls appear grayed out?](#why-do-some-controls-appear-grayed-out)
- [How can I remove a built-in standard, like PCI-DSS, ISO 27001, or SOC2 TSP from the dashboard?](#how-can-i-remove-a-built-in-standard-like-pci-dss-iso-27001-or-soc2-tsp-from-the-dashboard)
- [I made the suggested changes based on the recommendation, but it isn't being reflected in the dashboard?](#i-made-the-suggested-changes-based-on-the-recommendation-but-it-isnt-being-reflected-in-the-dashboard)
- [What permissions do I need to access the compliance dashboard?](#what-permissions-do-i-need-to-access-the-compliance-dashboard)
- [The regulatory compliance dashboard isn't loading for me](#the-regulatory-compliance-dashboard-isnt-loading-for-me)
- [How can I view a report of passing and failing controls per standard in my dashboard?](#how-can-i-view-a-report-of-passing-and-failing-controls-per-standard-in-my-dashboard)
- [How can I download a report with compliance data in a format other than PDF?](#how-can-i-download-a-report-with-compliance-data-in-a-format-other-than-pdf)
- [How can I create exceptions for some of the policies in the regulatory compliance dashboard?](#how-can-i-create-exceptions-for-some-of-the-policies-in-the-regulatory-compliance-dashboard)
- [What Microsoft Defender plans or licenses do I need to use the regulatory compliance dashboard?](#what-microsoft-defender-plans-or-licenses-do-i-need-to-use-the-regulatory-compliance-dashboard)

### How do I know which benchmark or standard to use?
[Microsoft cloud security benchmark](/security/benchmark/azure/introduction) (MCSB) is the canonical set of security recommendations and best practices defined by Microsoft, aligned with common compliance control frameworks including [CIS Control Framework](https://www.cisecurity.org/benchmark/azure/), [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final) and PCI-DSS. MCSB is a comprehensive cloud agnostic set of security principles designed to recommend the most up-to-date technical guidelines for Azure along with other clouds such as AWS and GCP. We recommend MCSB to customers who want to maximize their security posture and align their compliance status with industry standards.

The [CIS Benchmark](https://www.cisecurity.org/benchmark/azure/) is authored by an independent entity – Center for Internet Security (CIS) – and contains recommendations on a subset of core Azure services. We work with CIS to try to ensure that their recommendations are up to date with the latest enhancements in Azure, but they're sometimes delayed and can become outdated. Nonetheless, some customers like to use this objective, third-party assessment from CIS as their initial and primary security baseline.

Since we’ve released the Microsoft cloud security benchmark, many customers have chosen to migrate to it as a replacement for CIS benchmarks.

### What standards are supported in the compliance dashboard?
By default, the regulatory compliance dashboard shows you the Microsoft cloud security benchmark. The Microsoft cloud security benchmark is the Microsoft-authored guidelines for security, and compliance best practices based on common compliance frameworks. Learn more in the [Microsoft cloud security benchmark introduction](../security/benchmarks/introduction.md).

To track your compliance with any other standard, you'll need to explicitly add them to your dashboard.
 
You can add other standards such as Azure CIS 1.3.0, NIST SP 800-53, NIST SP 800-171, SWIFT CSP CSCF-v2020, UK Official and UK NHS, HIPAA, Canada Federal PBMM, ISO 27001, SOC2-TSP, and PCI-DSS 3.2.1.  

**AWS**: When users onboard, every AWS account has the AWS Foundational Security Best Practices assigned. This is the AWS-specific guideline for security and compliance best practices based on common compliance frameworks.

Users that have one Defender bundle enabled can enable other standards. 

Available AWS regulatory standards:

- CIS 1.2.0
- PCI DSS 3.2.1
- AWS Foundational Security Best Practices

To add regulatory compliance standards on AWS accounts:

1. Navigate to **Environment settings**.

1. Select the relevant account.

1. Select **Standards**.

1. Select **Add** and choose **Standard**.

1. Choose a standard from the drop-down menu.

1. Select **Save**.

    :::image type="content" source="media/update-regulatory-compliance-packages/add-aws-regulatory-compliance.png" alt-text="Screenshot of adding regulatory compliance standard to AWS account." lightbox="media/update-regulatory-compliance-packages/add-aws-regulatory-compliance.png":::

More standards will be added to the dashboard and included in the information on [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### Why do some controls appear grayed out?

For each compliance standard in the dashboard, there's a list of the standard's controls. For the applicable controls, you can view the details of passing and failing assessments.

Some controls are grayed out. These controls don't have any Defender for Cloud assessments associated with them. Some may be procedure or process-related, and so can't be verified by Defender for Cloud. Some don't have any automated policies or assessments implemented yet, but will have in the future. And some controls may be the platform's responsibility as explained in [Shared responsibility in the cloud](../security/fundamentals/shared-responsibility.md). 

### How can I remove a built-in standard, like PCI-DSS, ISO 27001, or SOC2 TSP from the dashboard?

To customize the regulatory compliance dashboard, and focus only on the standards that are applicable to you, you can remove any of the displayed regulatory standards that aren't relevant to your organization. To remove a standard, follow the instructions in [Remove a standard from your dashboard](update-regulatory-compliance-packages.md#remove-a-standard-from-your-dashboard).

### I made the suggested changes based on the recommendation, but it isn't being reflected in the dashboard?

After you take action to resolve recommendations, wait 12 hours to see the changes to your compliance data. Assessments are run approximately every 12 hours, so you'll see the effect on your compliance data only after the assessments run.

### What permissions do I need to access the compliance dashboard?
To view compliance data, you need to have at least **Reader** access to the policy compliance data as well; so Security Reader alone won’t suffice. If you're a global reader on the subscription, that will be enough too.

The minimum set of roles for accessing the dashboard and managing standards is **Resource Policy Contributor** and **Security Admin**.

### The regulatory compliance dashboard isn't loading for me

To use the regulatory compliance dashboard, Defender for Cloud must be enabled at the subscription level. If the dashboard isn't loading correctly, try the following steps:

1. Clear your browser's cache.
1. Try a different browser.
1. Try opening the dashboard from a different network location.

### How can I view a report of passing and failing controls per standard in my dashboard?

On the main dashboard, you can see a report of passing and failing controls for (1) the 'top 4' lowest compliance standards in the dashboard. To see all the passing/failing controls status, select (2) **Show all _x_** (where x is the number of standards you're tracking). A context plane displays the compliance status for every one of your tracked standards.

:::image type="content" source="media/regulatory-compliance-dashboard/summaries-of-compliance-standards.png" alt-text="Summary section of the regulatory compliance dashboard.":::


### How can I download a report with compliance data in a format other than PDF?

When you select **Download report**, select the standard and the format (PDF or CSV). The resulting report will reflect the current set of subscriptions you've selected in the portal's filter.

- The PDF report shows a summary status for the standard you selected
- The CSV report provides detailed results per resource, as it relates to policies associated with each control

Currently, there's no support for downloading a report for a custom policy; only for the supplied regulatory standards.

### How can I create exceptions for some of the policies in the regulatory compliance dashboard?

For policies are built into Defender for Cloud and included in the secure score, you can create exemptions for one or more resources directly in the portal as explained in [Exempting resources and recommendations from your secure score](exempt-resource.md).

For other policies, you can create an exemption directly in the policy itself, by following the instructions in [Azure Policy exemption structure](../governance/policy/concepts/exemption-structure.md).

### What Microsoft Defender plans or licenses do I need to use the regulatory compliance dashboard?

If you've got *any* of the Microsoft Defender plan (except for Defender for Servers Plan 1) enabled on *any* of your Azure resources, you can access Defender for Cloud's regulatory compliance dashboard and all of its data.

## Next steps

In this tutorial, you learned about using Defender for Cloud’s regulatory compliance dashboard to:

> [!div class="checklist"]
> * View and monitor your compliance posture regarding the standards and regulations that are important to you.
> * Improve your compliance status by resolving relevant recommendations and watching the compliance score improve.

The regulatory compliance dashboard can greatly simplify the compliance process, and significantly cut the time required for gathering compliance evidence for your Azure, hybrid, and multicloud environment.

To learn more, see these related pages:

- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md) - Learn how to select which standards appear in your regulatory compliance dashboard.
- [Managing security recommendations in Defender for Cloud](review-security-recommendations.md) - Learn how to use recommendations in Defender for Cloud to help protect your Azure resources.
