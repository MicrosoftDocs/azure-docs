---
title: 'Tutorial: Regulatory compliance checks - Azure Security Center'
description: 'Tutorial: Learn how to Improve your regulatory compliance using Azure Security Center.'
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: tutorial
ms.date: 04/21/2021
ms.author: memildin

---
# Tutorial: Improve your regulatory compliance

Azure Security Center helps streamline the process for meeting regulatory compliance requirements, using the **regulatory compliance dashboard**. 

Security Center continuously assesses your hybrid cloud environment to analyze the risk factors according to the controls and best practices in the standards applied to your subscriptions. The dashboard reflects the status of your compliance with these standards. 

When you enable Security Center on an Azure subscription, the [Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction) is automatically assigned to that subscription. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

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
- You must be signed in with an account that has reader access to the policy compliance data (**Security Reader** is insufficient). The role of **Global reader** for the subscription will work. At a minimum, you'll need to have **Resource Policy Contributor** and **Security Admin** roles assigned.

##  Assess your regulatory compliance

The regulatory compliance dashboard shows your selected compliance standards with all their requirements, where supported requirements are mapped to applicable security assessments. The status of these assessments reflects your compliance with the standard.

Use the regulatory compliance dashboard to help focus your attention on the gaps in compliance with your chosen standards and regulations. This focused view also enables you to continuously monitor your compliance over time within dynamic cloud and hybrid environments.

1. From Security Center's menu, select **Regulatory compliance**.

    At the top of the screen is a dashboard with an overview of your compliance status with the set of supported compliance regulations. You'll see your overall compliance score, and the number of passing vs. failing assessments associated with each standard.

    :::image type="content" source="./media/security-center-compliance-dashboard/compliance-dashboard.png" alt-text="Regulatory compliance dashboard" lightbox="./media/security-center-compliance-dashboard/compliance-dashboard.png":::

1. Select a tab for a compliance standard that is relevant to you (1). You'll see which subscriptions the standard is applied on (2), and the list of all controls for that standard (3). For the applicable controls, you can view the details of passing and failing assessments associated with that control (4), and the number of affected resources (5). Some controls are grayed out. These controls don't have any Security Center assessments associated with them. Check their requirements and assess them in your environment. Some of these might be process-related and not technical.

    :::image type="content" source="./media/security-center-compliance-dashboard/compliance-drilldown.png" alt-text="Exploring the details of compliance with a specific standard":::

1. To generate a PDF report with a summary of your current compliance status for a particular standard, select **Download report**.

    The report provides a high-level summary of your compliance status for the selected standard based on Security Center assessments data. The report's organized according to the controls of that particular standard. The report can be shared with relevant stakeholders, and might provide evidence to internal and external auditors.

    :::image type="content" source="./media/security-center-compliance-dashboard/download-report.png" alt-text="Download compliance report":::

## Improve your compliance posture

Using the information in the regulatory compliance dashboard, improve your compliance posture by resolving recommendations directly within the dashboard.

1.  Select any of the failing assessments that appear in the dashboard to view the details for that recommendation. Each recommendation includes a set of remediation steps to resolve the issue.

1.  Select a particular resource to view more details and resolve the recommendation for that resource. <br>For example, in the **Azure CIS 1.1.0** standard, select the recommendation **Disk encryption should be applied on virtual machines**.

    :::image type="content" source="./media/security-center-compliance-dashboard/sample-recommendation.png" alt-text="Selecting a recommendation from a standard leads directly to the recommendation details page":::

1. In this example, when you select **Take action** from the recommendation details page, you arrive in the Azure Virtual Machine pages of the Azure portal, where you can enable encryption from the **Security** tab:

    :::image type="content" source="./media/security-center-compliance-dashboard/encrypting-vm-disks.png" alt-text="Take action button on the recommendation details page leads to the remediation options":::

    For more information about how to apply recommendations, see [Implementing security recommendations in Azure Security Center](security-center-recommendations.md).

1.  After you take action to resolve recommendations, you'll see the result in the compliance dashboard report because your compliance score improves.

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

For example, you might want Security Center to email a specific user when a compliance assessment fails. You'll need to create the logic app first (using [Azure Logic Apps](../logic-apps/logic-apps-overview.md))  and then set up the trigger in a new workflow automation as explained in [Automate responses to Security Center triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation" lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::




## FAQ - Regulatory compliance dashboard

- [What standards are supported in the compliance dashboard?](#what-standards-are-supported-in-the-compliance-dashboard)
- [Why do some controls appear grayed out?](#why-do-some-controls-appear-grayed-out)
- [How can I remove a built-in standard, like PCI-DSS, ISO 27001, or SOC2 TSP from the dashboard?](#how-can-i-remove-a-built-in-standard-like-pci-dss-iso-27001-or-soc2-tsp-from-the-dashboard)
- [I made the suggested changed based on the recommendation, yet it isn't being reflected in the dashboard](#i-made-the-suggested-changed-based-on-the-recommendation-yet-it-isnt-being-reflected-in-the-dashboard)
- [What permissions do I need to access the compliance dashboard?](#what-permissions-do-i-need-to-access-the-compliance-dashboard)
- [The regulatory compliance dashboard isn't loading for me](#the-regulatory-compliance-dashboard-isnt-loading-for-me)
- [How can I view a report of passing and failing controls per standard in my dashboard?](#how-can-i-view-a-report-of-passing-and-failing-controls-per-standard-in-my-dashboard)
- [How can I download a report with compliance data in a format other than PDF?](#how-can-i-download-a-report-with-compliance-data-in-a-format-other-than-pdf)
- [How can I create exceptions for some of the policies in the regulatory compliance dashboard?](#how-can-i-create-exceptions-for-some-of-the-policies-in-the-regulatory-compliance-dashboard)
- [What Azure Defender plans or licenses do I need to use the regulatory compliance dashboard?](#what-azure-defender-plans-or-licenses-do-i-need-to-use-the-regulatory-compliance-dashboard)
- [How do I know which benchmark or standard to use?](#how-do-i-know-which-benchmark-or-standard-to-use)

### What standards are supported in the compliance dashboard?
By default, the regulatory compliance dashboard shows you the Azure Security Benchmark. The Azure Security Benchmark is the Microsoft-authored, Azure-specific guidelines for security, and compliance best practices based on common compliance frameworks. Learn more in the [Azure Security Benchmark introduction](../security/benchmarks/introduction.md).

To track your compliance with any other standard, you'll need to explicitly add them to your dashboard.
 
You can add other standards such as Azure CIS 1.3.0, NIST SP 800-53, NIST SP 800-171, SWIFT CSP CSCF-v2020, UK Official and UK NHS, HIPAA, Canada Federal PBMM, ISO 27001, SOC2-TSP, and PCI-DSS 3.2.1.  

More standards will be added to the dashboard and included in the information on [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

### Why do some controls appear grayed out?
For each compliance standard in the dashboard, there's a list of the standard's controls. For the applicable controls, you can view the details of passing and failing assessments.

Some controls are grayed out. These controls don't have any Security Center assessments associated with them. Some may be procedure or process-related, and therefore can't be verified by Security Center. Some don't have any automated policies or assessments implemented yet, but will have in the future. And some controls may be the platform responsibility as explained in [Shared responsibility in the cloud](../security/fundamentals/shared-responsibility.md). 

### How can I remove a built-in standard, like PCI-DSS, ISO 27001, or SOC2 TSP from the dashboard? 
To customize the regulatory compliance dashboard, and focus only on the standards that are applicable to you, you can remove any of the displayed regulatory standards that aren't relevant to your organization. To remove a standard, follow the instructions in [Remove a standard from your dashboard](update-regulatory-compliance-packages.md#remove-a-standard-from-your-dashboard).

### I made the suggested changed based on the recommendation, yet it isn't being reflected in the dashboard
After you take action to resolve recommendations, wait 12 hours to see the changes to your compliance data. Assessments are run approximately every 12 hours, so you will see the effect on your compliance data only after the assessments run.
 
### What permissions do I need to access the compliance dashboard?
To view compliance data, you need to have at least **Reader** access to the policy compliance data as well; so Security Reader alone won’t suffice. If you're a global reader on the subscription, that will be enough too.

The minimum set of roles for accessing the dashboard and managing standards is **Resource Policy Contributor** and **Security Admin**.


### The regulatory compliance dashboard isn't loading for me
To use the regulatory compliance dashboard, Azure Security Center must have Azure Defender enabled at the subscription level. If the dashboard isn't loading correctly, try the following steps:

1. Clear your browser's cache.
1. Try a different browser.
1. Try opening the dashboard from different network location.


### How can I view a report of passing and failing controls per standard in my dashboard?
On the main dashboard, you can see a report of passing and failing controls for (1) the 'top 4' lowest compliance standards in the dashboard. To see all the passing/failing controls status, select (2) **Show all *x*** (where x is the number of standards you're tracking). A context plane displays the compliance status for every one of your tracked standards.

:::image type="content" source="media/security-center-compliance-dashboard/summaries-of-compliance-standards.png" alt-text="Summary section of the regulatory compliance dashboard":::


### How can I download a report with compliance data in a format other than PDF?
When you select **Download report**, select the standard and the format (PDF or CSV). The resulting report will reflect the current set of subscriptions you've selected in the portal's filter.

- The PDF report shows a summary status for the standard you selected
- The CSV report provides detailed results per resource, as it relates to policies associated with each control

Currently, there's no support for downloading a report for a custom policy; only for the supplied regulatory standards.


### How can I create exceptions for some of the policies in the regulatory compliance dashboard?
For policies that are built into Security Center and included in the secure score, you can create exemptions for one or more resources directly in the portal as explained in [Exempting resources and recommendations from your secure score](exempt-resource.md).

For other policies, you can create an exemption directly in the policy itself, by following the instructions in [Azure Policy exemption structure](../governance/policy/concepts/exemption-structure.md).


### What Azure Defender plans or licenses do I need to use the regulatory compliance dashboard?
If you have any of the Azure Defender packages enabled on any of your Azure resource types, you have access to the Regulatory Compliance Dashboard, with all of its data, in Security Center.


### How do I know which benchmark or standard to use?
[Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction) (ASB) is the canonical set of security recommendations and best practices defined by Microsoft, aligned with common compliance control frameworks including [CIS Microsoft Azure Foundations Benchmark](https://www.cisecurity.org/benchmark/azure/) and [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final). ASB is a very comprehensive benchmark, and is designed to recommend the most up-to-date security capabilities of a wide range of Azure services. We recommend ASB to customers who want to maximize their security posture, and have the ability to align their compliance status with industry standards.

The [CIS Benchmark](https://www.cisecurity.org/benchmark/azure/) is authored by an independent entity – Center for Internet Security (CIS) – and contains recommendations on a subset of core Azure services. We work with CIS to try to ensure that that their recommendations are up to date with the latest enhancements in Azure, but they do sometimes fall behind and become outdated. Nonetheless, some customers like to use this objective, third-party assessment from CIS as their initial and primary security baseline.

Since we’ve released the Azure Security Benchmark, many customers have chosen to migrate to it as a replacement for CIS benchmarks.


## Next steps

In this tutorial, you learned about using Security Center’s regulatory compliance dashboard to:

> [!div class="checklist"]
> * View and monitor your compliance posture regarding the standards and regulations that are important to you.
> * Improve your compliance status by resolving relevant recommendations and watching the compliance score improve.

The regulatory compliance dashboard can greatly simplify the compliance process, and significantly cut the time required for gathering compliance evidence for your Azure, hybrid, and multi-cloud environment.

To learn more, see these related pages:

- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md) - Learn how to select which standards appear in your regulatory compliance dashboard. 
- [Managing security recommendations in Azure Security Center](security-center-recommendations.md) - Learn how to use recommendations in Security Center to help protect your Azure resources.