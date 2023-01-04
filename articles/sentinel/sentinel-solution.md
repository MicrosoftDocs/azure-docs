---
title: Build and monitor Zero Trust (TIC 3.0) security architectures with Microsoft Sentinel
description: Install and learn how to use the Microsoft Sentinel Zero Trust (TIC3.0) solution for an automated visualization of Zero Trust principles, cross-walked to the Trusted Internet Connections framework.
ms.date: 12/15/2021
ms.service: network-access
author: batamig
ms.author: bagol
ms.topic: how-to
---

# Build and monitor Zero Trust (TIC 3.0) security architectures with Microsoft Sentinel

The Microsoft Sentinel solution for **Zero Trust (TIC 3.0)** enables governance and compliance teams to design, build, monitor, and respond to Zero Trust (TIC 3.0) requirements. This solution includes a workbook, analytics rules, and a playbook, which provide an automated visualization of Zero Trust principles, cross-walked to the Trust Internet Connections framework, helping organizations to monitor configurations over time.

This article describes how to install and use the Microsoft Sentinel solution for **Zero Trust (TIC 3.0)** in your Microsoft Sentinel workspace.

While only Microsoft Sentinel is required to get started, the solution is enhanced by integrations with other Microsoft Services, such as:

- [Microsoft 365 Defender](https://www.microsoft.com/microsoft-365/security/microsoft-365-defender)
- [Microsoft Information Protection](https://azure.microsoft.com/services/information-protection/)
- [Azure Active Directory](https://azure.microsoft.com/services/active-directory/)
- [Microsoft Defender for Cloud](https://azure.microsoft.com/services/active-directory/)
- [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender)
- [Microsoft Defender for Identity](https://www.microsoft.com/microsoft-365/security/identity-defender)
- [Microsoft Defender for Cloud Apps](https://www.microsoft.com/microsoft-365/enterprise-mobility-security/cloud-app-security)
- [Microsoft Defender for Office 365](https://www.microsoft.com/microsoft-365/security/office-365-defender)

For more information, see [Guiding principles of Zero Trust](../zero-trust-overview.md#guiding-principles-of-zero-trust).

> [!NOTE]
> Microsoft Sentinel solutions are sets of bundled content, pre-configured for a specific set of data. For more information, see [Microsoft Sentinel solutions documentation](/azure/sentinel/sentinel-solutions).
>

## The Zero Trust solution and the TIC 3.0 framework

Zero Trust and TIC 3.0 are not the same, but they share many common themes and together provide a common story. The Microsoft Sentinel solution for **Zero Trust (TIC 3.0)** offers detailed crosswalks between Microsoft Sentinel and the Zero Trust model with the TIC 3.0 framework. These crosswalks help users to better understand the overlaps between the two.

While the Microsoft Sentinel solution for **Zero Trust (TIC 3.0)** provides best practice guidance, Microsoft does not guarantee nor imply compliance. All Trusted Internet Connection (TIC) requirements, validations, and controls are governed by the [Cybersecurity & Infrastructure Security Agency](https://www.cisa.gov/trusted-internet-connections).

The **Zero Trust (TIC 3.0)** solution provides visibility and situational awareness for control requirements delivered with Microsoft technologies in predominantly cloud-based environments. Customer experience will vary by user, and some panes may require additional configurations and query modification for operation.

Recommendations do not imply coverage of respective controls, as they are often one of several courses of action for approaching requirements, which is unique to each customer. Recommendations should be considered a starting point for planning full or partial coverage of respective control requirements.

The Microsoft Sentinel solution for **Zero Trust (TIC 3.0)** is useful for any of the following users and use cases:

- **Security governance, risk, and compliance professionals**, for compliance posture assessment and reporting
- **Engineers and architects**, who need to design Zero Trust and TIC 3.0-aligned workloads
- **Security analysts**, for alert and automation building
- **Managed security service providers (MSSPs)** for consulting services
- **Security managers**, who need to review requirements, analyze reporting, evaluating capabilities

## Prerequisites

Before installing the **Zero Trust (TIC 3.0)** solution, make sure you have the following prerequisites:

- **Onboard Microsoft services**: Make sure that you have both [Microsoft Sentinel](/azure/sentinel/quickstart-onboard) and [Microsoft Defender for Cloud](/azure/defender-for-cloud/get-started) enabled in your Azure subscription.

- **Microsoft Defender for Cloud requirements**: In Microsoft Defender for Cloud:

    - Add required regulatory standards to your dashboard. Make sure to add both the *Azure Security Benchmark* and *NIST SP 800-53 R5 Assessments* to your Microsoft Defender for Cloud dashboard. For more information, see [add a regulatory standard to your dashboard](/azure/security-center/update-regulatory-compliance-packages?WT.mc_id=Portal-fx#add-a-regulatory-standard-to-your-dashboard) in the Microsoft Defender for Cloud documentation.

    - Continuously export Microsoft Defender for Cloud data to your Log Analytics workspace. For more information, see [Continuously export Microsoft Defender for Cloud data](/azure/defender-for-cloud/continuous-export?tabs=azure-portal).

- **Required user permissions**. To install the **Zero Trust (TIC 3.0)** solution, you must have access to your Microsoft Sentinel workspace with [Security Reader](/azure/active-directory/roles/permissions-reference#security-reader) permissions.

## Install the Zero Trust (TIC 3.0) solution

**To deploy the *Zero Trust (TIC 3.0)* solution from the Azure portal**:

1. In Microsoft Sentinel, select **Content hub** and locate the **Zero Trust (TIC 3.0)** solution.

1. At the bottom-right, select **View details**, and then **Create**. Select the subscription, resource group, and workspace where you want to install the solution, and then review the related security content that will be deployed.

    When you're done, select **Review + Create** to install the solution.

For more information, see [Deploy out-of-the-box content and solutions](/azure/sentinel/sentinel-solutions-deploy).

## Sample usage scenario

The following sections shows how a security operations analyst could use the resources deployed with the **Zero Trust (TIC 3.0)** solution to review requirements, explore queries, configure alerts, and implement automation.

After [installing](#install-the-zero-trust-tic-30-solution) the **Zero Trust (TIC 3.0)** solution, use the workbook, analytics rules, and playbook deployed to your Microsoft Sentinel workspace to manage Zero Trust in your network.

### Visualize Zero Trust data

1. Navigate to the Microsoft Sentinel **Workbooks** > **Zero Trust (TIC 3.0)** workbook, and select **View saved workbook**.

    In the **Zero Trust (TIC 3.0)** workbook page, select the TIC 3.0 capabilities you want to view. For this procedure, select **Intrusion Detection**.

    > [!TIP]
    > Use the **Guide** toggle at the top of the page to display or hide recommendations and guide panes. Make sure that the correct details are selected in the **Subscription**, **Workspace**, and **TimeRange** options so that you can view the specific data you want to find.
    >

1. **Review the control cards displayed**. For example, scroll down to view the **Adaptive Access Control** card:

    :::image type="content" source="../media/integrate/sentinel-workbook/review-query-output-sample.png" alt-text="Screenshot of the Adaptive Access Control card.":::

    > [!TIP]
    > Use the **Guides** toggle at the top left to view or hide recommendations and guide panes. For example, these may be helpful when you first access the workbook, but unnecessary once you've understood the relevant concepts.
    >

1. **Explore queries**. For example, at the top right of the **Adaptive Access Control** card, select the **:** *More* button, and then select the :::image type="icon" source="../media/integrate/sentinel-workbook/icon-open-in-logs.png" border="false"::: **Open the last run query in the Logs view.** option.

    The query is opened in the Microsoft Sentinel **Logs** page:

    :::image type="content" source="../media/integrate/sentinel-workbook/explore-query-logs.png" alt-text="Screenshot of the selected query in the Microsoft Sentinel Logs page.":::

### Configure Zero Trust-related alerts

In Microsoft Sentinel, navigate to the **Analytics** area. View out-of-the-box analytics rules deployed with the **Zero Trust (TIC 3.0)** solution by searching for **TIC3.0**.

By default, the **Zero Trust (TIC 3.0)** solution installs a set of analytics rules that are configured to monitor Zero Trust (TIC3.0) posture by control family, and you can customize thresholds for alerting compliance teams to changes in posture.

For example, if your workload's resiliency posture falls below a specified percentage in a week, Microsoft Sentinel will generate an alert to detail the respective policy status (pass/fail), the assets identified, the last assessment time, and provide deep links to Microsoft Defender for Cloud for remediation actions.

 Update the rules as needed or configure a new one:

:::image type="content" source="../media/integrate/sentinel-workbook/edit-rule.png" alt-text="Screenshot of the Analytics rule wizard.":::

For more information, see [Create custom analytics rules to detect threats](/azure/sentinel/detect-threats-custom).

### Respond with SOAR

In Microsoft Sentinel, navigate to the **Automation** > **Active playbooks** tab, and locate the **Notify-GovernanceComplianceTeam** playbook.

Use this playbook to automatically monitor CMMC alerts, and notify the governance compliance team with relevant details via both email and Microsoft Teams messages. Modify the playbook as needed:

:::image type="content" source="../media/integrate/sentinel-workbook/logic-app-sample.png" alt-text="Screenshot of the Logic app designer showing a sample playbook.":::

For more information, see [Use triggers and actions in Microsoft Sentinel playbooks](/azure/sentinel/playbook-triggers-actions).

## Frequently asked questions

### Are custom views and reports supported?

Yes. You can customize your **Zero Trust (TIC 3.0)** workbook to view data by subscription, workspace, time, control family, or maturity level parameters, and you can export and print your workbook.

For more information, see [Use Azure Monitor workbooks to visualize and monitor your data](/azure/sentinel/monitor-your-data).

### Are additional products required?

Both Microsoft Sentinel and Microsoft Defender for Cloud are [required](#prerequisites).

Aside from these services, each control card is based on data from multiple services, depending on the types of data and visualizations being shown in the card. Over 25 Microsoft services provide enrichment for the **Zero Trust (TIC 3.0)** solution.

### What should I do with panels with no data?

Panels with no data provide a starting point for addressing Zero Trust and TIC 3.0 control requirements, including recommendations for addressing respective controls.

### Are multiple subscriptions, clouds, and tenants supported?

Yes. You can use workbook parameters, Azure Lighthouse, and Azure Arc to leverage the **Zero Trust (TIC 3.0)** solution across all of your subscriptions, clouds, and tenants.

For more information, see [Use Azure Monitor workbooks to visualize and monitor your data](/azure/sentinel/monitor-your-data) and [Manage multiple tenants in Microsoft Sentinel as an MSSP](/azure/sentinel/multiple-tenants-service-providers).

### Is partner integration supported?

Yes. Both workbooks and analytics rules are customizable for integrations with partner services. 

For more information, see [Use Azure Monitor workbooks to visualize and monitor your data](/azure/sentinel/monitor-your-data) and [Surface custom event details in alerts](/azure/sentinel/surface-custom-details-in-alerts).

### Is this available in government regions?

Yes. The **Zero Trust (TIC 3.0)** solution is in Public Preview and deployable to Commercial/Government regions. For more information, see [Cloud feature availability for commercial and US Government customers](/azure/security/fundamentals/feature-availability).

### Which permissions are required to use this content?

- [Microsoft Sentinel Contributor](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-contributor) users can create and edit workbooks, analytics rules, and other Microsoft Sentinel resources.

- [Microsoft Sentinel Reader](/azure/role-based-access-control/built-in-roles#microsoft-sentinel-reader) users can view data, incidents, workbooks, and other Microsoft Sentinel resources.

For more information, see [Permissions in Microsoft Sentinel](/azure/sentinel/roles).

## Next steps

For more information, see:

- [Get Started with Microsoft Sentinel](https://azure.microsoft.com/services/azure-sentinel/)
- [Visualize and monitor your data with workbooks](/azure/sentinel/monitor-your-data)
- [Microsoft Zero Trust Model](https://www.microsoft.com/security/business/zero-trust)
- [Zero Trust Deployment Center](/security/zero-trust/?WT.mc_id=Portal-fx)

Watch our videos:

- [Demo: Microsoft Sentinel Zero Trust (TIC 3.0) Solution](https://www.youtube.com/watch?v=OVGgRIzAvCI)
- [Microsoft Sentinel: Zero Trust (TIC 3.0) Workbook Demo](https://www.youtube.com/watch?v=RpDas8fXzdU)

Read our blogs!

- [Announcing the Microsoft Sentinel: Zero Trust (TIC3.0) Solution](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/announcing-the-microsoft-sentinel-zero-trust-tic3-0-solution/ba-p/3031685)
- [Building and monitoring Zero Trust (TIC 3.0) workloads for federal information systems with Microsoft Sentinel](https://devblogs.microsoft.com/azuregov/building-and-monitoring-zero-trust-tic-3-0-workloads-for-federal-information-systems-with-microsoft-sentinel/)
- [Zero Trust: 7 adoption strategies from security leaders](https://www.microsoft.com/security/blog/2021/03/31/zero-trust-7-adoption-strategies-from-security-leaders/)
- [Implementing Zero Trust with Microsoft Azure: Identity and Access Management (6 Part Series)](https://devblogs.microsoft.com/azuregov/implementing-zero-trust-with-microsoft-azure-identity-and-access-management-1-of-6/)
