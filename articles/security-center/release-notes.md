---
title: Release notes for Azure Security Center
description: A description of what's new and changed in Azure Security Center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: reference
ms.date: 04/21/2021
ms.author: memildin

---

# What's new in Azure Security Center?

Security Center is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often. 

To learn about *planned* changes that are coming soon to Security Center, see [Important upcoming changes to Azure Security Center](upcoming-changes.md). 

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Azure Security Center](release-notes-archive.md).

## April 2021

Updates in April include:
- [Recently pulled container registry images are now rescanned weekly (General Availability)](#recently-pulled-container-registry-images-are-now-rescanned-weekly-general-availability)
- [Use Azure Defender for Kubernetes to protect hybrid and multi-cloud Kubernetes deployments (preview)](#use-azure-defender-for-kubernetes-to-protect-hybrid-and-multi-cloud-kubernetes-deployments-preview)
- [Recommendations to enable Azure Defender for DNS and Resource Manager (preview)](#recommendations-to-enable-azure-defender-for-dns-and-resource-manager-preview)
- [Three regulatory compliance standards added: Azure CIS 1.3.0, CMMC Level 3, and New Zealand ISM Restricted](#three-regulatory-compliance-standards-added-azure-cis-130-cmmc-level-3-and-new-zealand-ism-restricted)
- [Four new recommendations related to guest configuration (preview)](#four-new-recommendations-related-to-guest-configuration-preview)
- [CMK recommendations moved to best practices security control](#cmk-recommendations-moved-to-best-practices-security-control)
- [11 Azure Defender alerts deprecated](#11-azure-defender-alerts-deprecated)
- [Two recommendations from "Apply system updates" security control were deprecated](#two-recommendations-from-apply-system-updates-security-control-were-deprecated)
- [Azure Defender for SQL on machine tile removed from Azure Defender dashboard](#azure-defender-for-sql-on-machine-tile-removed-from-azure-defender-dashboard)

### Recently pulled container registry images are now rescanned weekly (General Availability)

Azure Defender for container registries includes a built-in vulnerability scanner. This scanner immediately scans any image you push to your registry and any image pulled within the last 30 days.

New vulnerabilities are discovered every day. With this update, container images that were pulled from your registries during the last 30 days will be **rescanned** every week. This ensures that newly discovered vulnerabilities are identified in your images.

Scanning is charged on a per image basis, so there's no additional charge for these rescans.

Learn more about this scanner in [Use Azure Defender for container registries to scan your images for vulnerabilities](defender-for-container-registries-usage.md).


### Use Azure Defender for Kubernetes to protect hybrid and multi-cloud Kubernetes deployments (preview)

Azure Defender for Kubernetes is expanding its threat protection capabilities to defend your clusters wherever they're deployed. This has been enabled by integrating with [Azure Arc enabled Kubernetes](../azure-arc/kubernetes/overview.md) and its new [extensions capabilities](../azure-arc/kubernetes/extensions.md). 

When you've enabled Azure Arc on your non-Azure Kubernetes clusters, a new recommendation from Azure Security Center offers to deploy the Azure Defender extension to them with only a few clicks.

Use the recommendation (**Azure Arc enabled Kubernetes clusters should have Azure Defender's extension installed**) and the extension to protect Kubernetes clusters deployed in other cloud providers, although not on their managed Kubernetes services.

This integration between Azure Security Center, Azure Defender, and Azure Arc enabled Kubernetes brings:

- Easy provisioning of the Azure Defender extension to unprotected Azure Arc enabled Kubernetes clusters (manually and at-scale)
- Monitoring of the Azure Defender extension and its provisioning state from the Azure Arc Portal
- Security recommendations from Security Center are reported in the new Security page of the Azure Arc Portal
- Identified security threats from Azure Defender are reported in the new Security page of the Azure Arc Portal
- Azure Arc enabled Kubernetes clusters are integrated into the Azure Security Center platform and experience

Learn more in [Use Azure Defender for Kubernetes with your on-premises and multi-cloud Kubernetes clusters](defender-for-kubernetes-azure-arc.md).

:::image type="content" source="media/defender-for-kubernetes-azure-arc/extension-recommendation.png" alt-text="Azure Security Center's recommendation for deploying the Azure Defender extension for Azure Arc enabled Kubernetes clusters." lightbox="media/defender-for-kubernetes-azure-arc/extension-recommendation.png":::


### Recommendations to enable Azure Defender for DNS and Resource Manager (preview)

Two new recommendations have been added to simplify the process of enabling [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for DNS](defender-for-dns-introduction.md):

- **Azure Defender for Resource Manager should be enabled** - Defender for Resource Manager automatically monitors the resource management operations in your organization. Azure Defender detects threats and alerts you about suspicious activity.
- **Azure Defender for DNS should be enabled** - Defender for DNS provides an additional layer of protection for your cloud resources by continuously monitoring all DNS queries from your Azure resources. Azure Defender alerts you about suspicious activity at the DNS layer.

Enabling Azure Defender plans results in charges. Learn about the pricing details per region on Security Center's pricing page: https://aka.ms/pricing-security-center .

> [!TIP]
> Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).


### Three regulatory compliance standards added: Azure CIS 1.3.0, CMMC Level 3, and New Zealand ISM Restricted

We've added three standards for use with Azure Security Center. Using the regulatory compliance dashboard, you can now track your compliance with:

- [CIS Microsoft Azure Foundations Benchmark 1.3.0](../governance/policy/samples/cis-azure-1-3-0.md)
- [CMMC Level 3](../governance/policy/samples/cmmc-l3.md)
- [New Zealand ISM Restricted](../governance/policy/samples/new-zealand-ism.md)

You can assign these to your subscriptions as described in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/additional-regulatory-compliance-standards.png" alt-text="Three standards added for use with Azure Security Center's regulatory compliance dashboard." lightbox="media/release-notes/additional-regulatory-compliance-standards.png":::

Learn more in:
- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md)
- [Tutorial: Improve your regulatory compliance](security-center-compliance-dashboard.md)
- [FAQ - Regulatory compliance dashboard](security-center-compliance-dashboard.md#faq---regulatory-compliance-dashboard)

### Four new recommendations related to guest configuration (preview)

Azure's [Guest Configuration extension](../governance/policy/concepts/guest-configuration.md) reports to Security Center to help ensure your virtual machines' in-guest settings are hardened. The extension isn't required for Arc enabled servers because it's included in the Arc Connected Machine agent. The extension requires a system-managed identity on the machine.

We've added four new recommendations to Security Center to make the most of this extension.

- Two recommendations prompt you to install the extension and its required system-managed identity:
    - **Guest Configuration extension should be installed on your machines**
    - **Virtual machines' Guest Configuration extension should be deployed with system-assigned managed identity**

- When the extension is installed and running, it'll begin auditing your machines and you'll be prompted to harden settings such as configuration of the operating system and environment settings. These two recommendations will prompt you to harden your Windows and Linux machines as described:
    - **Windows Defender Exploit Guard should be enabled on your machines**
    - **Authentication to Linux machines should require SSH keys**

Learn more in [Understand Azure Policy's Guest Configuration](../governance/policy/concepts/guest-configuration.md).

### CMK recommendations moved to best practices security control

Every organization's security program includes data encryption requirements. By default, Azure customers' data is encrypted at rest with service-managed keys. However, customer-managed keys (CMK) are commonly required to meet regulatory compliance standards. CMKs let you encrypt your data with an [Azure Key Vault](../key-vault/general/overview.md) key created and owned by you. This gives you full control and responsibility for the key lifecycle, including rotation and management.

Azure Security Center's security controls are logical groups of related security recommendations, and reflect your vulnerable attack surfaces. Each control has a maximum number of points you can add to your secure score if you remediate all of the recommendations listed in the control, for all of your resources. The **Implement security best practices** security control is worth zero points. So recommendations in this control don't affect your secure score.

The recommendations listed below are being moved to the **Implement security best practices** security control to better reflect their optional nature. This move ensures that these recommendations are in the most appropriate control to meet their objective.

- Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest
- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)
- Cognitive Services accounts should enable data encryption with a customer-managed key (CMK)
- Container registries should be encrypted with a customer-managed key (CMK)
- SQL managed instances should use customer-managed keys to encrypt data at rest
- SQL servers should use customer-managed keys to encrypt data at rest
- Storage accounts should use customer-managed key (CMK) for encryption

Learn which recommendations are in each security control in [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).


### 11 Azure Defender alerts deprecated

The eleven Azure Defender alerts listed below have been deprecated.

- New alerts will replace these two alerts and provide better coverage:

    | AlertType                | AlertDisplayName                                                         |
    |--------------------------|--------------------------------------------------------------------------|
    | ARM_MicroBurstDomainInfo | PREVIEW - MicroBurst toolkit "Get-AzureDomainInfo" function run detected |
    | ARM_MicroBurstRunbook    | PREVIEW - MicroBurst toolkit "Get-AzurePasswords" function run detected  |
    |                          |                                                                          |

- These nine alerts relate to an Azure Active Directory Identity Protection connector (IPC) that has already been deprecated:

    | AlertType           | AlertDisplayName              |
    |---------------------|-------------------------------|
    | UnfamiliarLocation  | Unfamiliar sign-in properties |
    | AnonymousLogin      | Anonymous IP address          |
    | InfectedDeviceLogin | Malware linked IP address     |
    | ImpossibleTravel    | Atypical travel               |
    | MaliciousIP         | Malicious IP address          |
    | LeakedCredentials   | Leaked credentials            |
    | PasswordSpray       | Password Spray                |
    | LeakedCredentials   | Azure AD threat intelligence  |
    | AADAI               | Azure AD AI                   |
    |                     |                               |
 
    > [!TIP]
    > These nine IPC alerts were never Security Center alerts. They’re part of the Azure Active Directory (AAD) Identity Protection connector (IPC) that was sending them to Security Center. For the last two years, the only customers who’ve been seeing those alerts are organizations who configured the export (from the connector to ASC) in 2019 or earlier. AAD IPC has continued to show them in its own alerts systems and they’ve continued to be available in Azure Sentinel. The only change is that they’re no longer appearing in Security Center.

### Two recommendations from "Apply system updates" security control were deprecated 

The following two recommendations were deprecated and the changes might result in a slight impact on your secure score:

- **Your machines should be restarted to apply system updates**
- **Monitoring agent should be installed on your machines**. This recommendation relates to on-premises machines only and some of its logic will be transferred to another recommendation, **Log Analytics agent health issues should be resolved on your machines**

We recommend checking your continuous export and workflow automation configurations to see whether these recommendations are included in them. Also, any dashboards or other monitoring tools that might be using them should be updated accordingly.

Learn more about these recommendations in the [security recommendations reference page](recommendations-reference.md).

### Azure Defender for SQL on machine tile removed from Azure Defender dashboard

The Azure Defender dashboard's coverage area includes tiles for the relevant Azure Defender plans for your environment. Due to an issue with the reporting of the numbers of protected and unprotected resources, we've decided to temporarily remove the resource coverage status for **Azure Defender for SQL on machines** until the issue is resolved.


## March 2021

Updates in March include:

- [Azure Firewall management integrated into Security Center](#azure-firewall-management-integrated-into-security-center)
- [SQL vulnerability assessment now includes the "Disable rule" experience (preview)](#sql-vulnerability-assessment-now-includes-the-disable-rule-experience-preview)
- [Azure Monitor Workbooks integrated into Security Center and three templates provided](#azure-monitor-workbooks-integrated-into-security-center-and-three-templates-provided)
- [Regulatory compliance dashboard now includes Azure Audit reports (preview)](#regulatory-compliance-dashboard-now-includes-azure-audit-reports-preview)
- [Recommendation data can be viewed in Azure Resource Graph with "Explore in ARG"](#recommendation-data-can-be-viewed-in-azure-resource-graph-with-explore-in-arg)
- [Updates to the policies for deploying workflow automation](#updates-to-the-policies-for-deploying-workflow-automation)
- [Two legacy recommendations no longer write data directly to Azure activity log](#two-legacy-recommendations-no-longer-write-data-directly-to-azure-activity-log)
- [Recommendations page enhancements](#recommendations-page-enhancements)


### Azure Firewall management integrated into Security Center

When you open Azure Security Center, the first page to appear is the overview page. 

This interactive dashboard provides a unified view into the security posture of your hybrid cloud workloads. Additionally, it shows security alerts, coverage information, and more.

As part of helping you view your security status from a central experience, we have integrated the Azure Firewall Manager into this dashboard. You can now check Firewall coverage status across all networks and centrally manage Azure Firewall policies starting from Security Center.

Learn more about this dashboard in [Azure Security Center's overview page](overview-page.md).

:::image type="content" source="media/release-notes/overview-dashboard-firewall-manager.png" alt-text="Security Center's overview dashboard with a tile for Azure Firewall":::


### SQL vulnerability assessment now includes the "Disable rule" experience (preview)

Security Center includes a built-in vulnerability scanner to help you discover, track, and remediate potential database vulnerabilities. The results from your assessment scans provide an overview of your SQL machines' security state, and details of any security findings.

If you have an organizational need to ignore a finding, rather than remediate it, you can optionally disable it. Disabled findings don't impact your secure score or generate unwanted noise.

Learn more in [Disable specific findings](defender-for-sql-on-machines-vulnerability-assessment.md#disable-specific-findings-preview).



### Azure Monitor Workbooks integrated into Security Center and three templates provided

As part of Ignite Spring 2021, we announced an integrated Azure Monitor Workbooks experience in Security Center.

You can leverage the new integration to start using the out-of-the-box templates from Security Center’s gallery. By using workbook templates, you can access and build dynamic and visual reports to track your organization’s security posture. Additionally, you can create new workbooks based on Security Center data or any other supported data types and quickly deploy community workbooks from Security Center's GitHub community.

Three templates reports are provided:

- **Secure Score Over Time** - Track your subscriptions' scores and changes to recommendations for your resources
- **System Updates** - View missing system updates by resources, OS, severity, and more
- **Vulnerability Assessment Findings** - View the findings of vulnerability scans of your Azure resources

Learn about using these reports or building your own [Create rich, interactive reports of Security Center data](custom-dashboards-azure-workbooks.md).

:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-snip.png" alt-text="Secure score over time report":::


### Regulatory compliance dashboard now includes Azure Audit reports (preview)

From the regulatory compliance dashboard's toolbar you can now download Azure and Dynamics certification reports. 

:::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Regulatory compliance dashboard's toolbar":::

You can select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need.

Learn more about [Managing the standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard.png" alt-text="Filtering the list of available Azure Audit reports":::



### Recommendation data can be viewed in Azure Resource Graph with "Explore in ARG"

The recommendation details pages now include the "Explore in ARG" toolbar button. Use this button to open an Azure Resource Graph query and explore, export, and share the recommendation's data.

Azure Resource Graph (ARG) provides instant access to resource information across your cloud environments with robust filtering, grouping, and sorting capabilities. It's a quick and efficient way to query information across Azure subscriptions programmatically or from within the Azure portal.

Learn more about [Azure Resource Graph (ARG)](../governance/resource-graph/index.yml).

:::image type="content" source="media/release-notes/explore-in-resource-graph.png" alt-text="Explore recommendation data in Azure Resource Graph.":::


### Updates to the policies for deploying workflow automation

Automating your organization's monitoring and incident response processes can greatly improve the time it takes to investigate and mitigate security incidents.

We provide three Azure Policy 'DeployIfNotExist' policies that create and configure workflow automation procedures so that you can deploy your automations across your organization:

|Goal  |Policy  |Policy ID  |
|---------|---------|---------|
|Workflow automation for security alerts|[Deploy Workflow Automation for Azure Security Center alerts](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2ff1525828-9a90-4fcf-be48-268cdd02361e)|f1525828-9a90-4fcf-be48-268cdd02361e|
|Workflow automation for security recommendations|[Deploy Workflow Automation for Azure Security Center recommendations](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f73d6ab6c-2475-4850-afd6-43795f3492ef)|73d6ab6c-2475-4850-afd6-43795f3492ef|
|Workflow automation for regulatory compliance changes|[Deploy Workflow Automation for Azure Security Center regulatory compliance](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2f73d6ab6c-509122b9-ddd9-47ba-a5f1-d0dac20be63c)|509122b9-ddd9-47ba-a5f1-d0dac20be63c|
||||

There are two updates to the features of these policies:

- When assigned, they will remain enabled by enforcement.
- You can now customize these policies and update any of the parameters even after they have already been deployed. For example, if a user wants to add another assessment key, or edit an existing assessment key, they can do so.

Get started with [workflow automation templates](https://github.com/Azure/Azure-Security-Center/tree/master/Workflow%20automation).

Learn more about how to [Automate responses to Security Center triggers](workflow-automation.md).


### Two legacy recommendations no longer write data directly to Azure activity log 

Security Center passes the data for almost all security recommendations to Azure Advisor which, in turn, writes it to [Azure activity log](../azure-monitor/essentials/activity-log.md).

For two recommendations, the data is simultaneously written directly to Azure activity log. With this change, Security Center stops writing data for these legacy security recommendations directly to activity Log. Instead, we're exporting the data to Azure Advisor as we do for all the other recommendations.

The two legacy recommendations are:
- Endpoint protection health issues should be resolved on your machines
- Vulnerabilities in security configuration on your machines should be remediated

If you've been accessing information for these two recommendations in activity log's "Recommendation of type TaskDiscovery" category, this is no longer available.


### Recommendations page enhancements 

We've released an improved version of the recommendations list to present more information at a glance.

Now on the page you'll see:

1. The maximum score and current score for each security control.
1. Icons replacing tags such as **Quick fix** and **Preview**.
1. A new column showing the [Policy initiative](security-policy-concept.md) related to each recommendation - visible when "Group by controls" is disabled.

:::image type="content" source="media/release-notes/recommendations-grid-enhancements.png" alt-text="Enhancements to Azure Security Center's recommendations page - March 2021" lightbox="media/release-notes/recommendations-grid-enhancements.png":::

:::image type="content" source="media/release-notes/recommendations-grid-enhancements-initiatives.png" alt-text="Enhancements to Azure Security Center's recommendations 'flat' list - March 2021" lightbox="media/release-notes/recommendations-grid-enhancements-initiatives.png":::

Learn more in [Security recommendations in Azure Security Center](security-center-recommendations.md).


## February 2021

Updates in February include:

- [New security alerts page in the Azure portal released for General Availability (GA)](#new-security-alerts-page-in-the-azure-portal-released-for-general-availability-ga)
- [Kubernetes workload protection recommendations released for General Availability (GA)](#kubernetes-workload-protection-recommendations-released-for-general-availability-ga)
- [Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 Virtual Desktop (WVD) (in preview)](#microsoft-defender-for-endpoint-integration-with-azure-defender-now-supports-windows-server-2019-and-windows-10-virtual-desktop-wvd-in-preview)
- [Direct link to policy from recommendation details page](#direct-link-to-policy-from-recommendation-details-page)
- [SQL data classification recommendation no longer affects your secure score](#sql-data-classification-recommendation-no-longer-affects-your-secure-score)
- [Workflow automations can be triggered by changes to regulatory compliance assessments (in preview)](#workflow-automations-can-be-triggered-by-changes-to-regulatory-compliance-assessments-in-preview)
- [Asset inventory page enhancements](#asset-inventory-page-enhancements)


### New security alerts page in the Azure portal released for General Availability (GA)

Azure Security Center's security alerts page has been redesigned to provide:

- **Improved triage experience for alerts** - helping to reduce alerts fatigue and focus on the most relevant threats easier, the list includes customizable filters and grouping options.
- **More information in the alerts list** - such as MITRE ATT&ACK tactics.
- **Button to create sample alerts** - to evaluate Azure Defender capabilities and test your alerts. configuration (for SIEM integration, email notifications, and workflow automations), you can create sample alerts from all Azure Defender plans.
- **Alignment with Azure Sentinel's incident experience** - for customers who use both products, switching between them is now a more straightforward experience and it's easy to learn one from the other.
- **Better performance** for large alerts lists.
- **Keyboard navigation** through the alert list.
- **Alerts from Azure Resource Graph** - you can query alerts in Azure Resource Graph, the Kusto-like API for all of your resources. This is also useful if you're building your own alerts dashboards. [Learn more about Azure Resource Graph](../governance/resource-graph/index.yml).
- **Create sample alerts feature** - To create sample alerts from the new alerts experience, see [Generate sample Azure Defender alerts](security-center-alert-validation.md#generate-sample-azure-defender-alerts).

:::image type="content" source="media/security-center-managing-and-responding-alerts/alerts-page.png" alt-text="Azure Security Center's security alerts list":::


### Kubernetes workload protection recommendations released for General Availability (GA)

We're happy to announce the General Availability (GA) of the set of recommendations for Kubernetes workload protections.

To ensure that Kubernetes workloads are secure by default, Security Center has added Kubernetes level hardening recommendations, including enforcement options with Kubernetes admission control.

When the Azure Policy add-on for Kubernetes is installed on your Azure Kubernetes Service (AKS) cluster, every request to the Kubernetes API server will be monitored against the predefined set of best practices - displayed as 13 security recommendations - before being persisted to the cluster. You can then configure to enforce the best practices and mandate them for future workloads.

For example, you can mandate that privileged containers shouldn't be created, and any future requests to do so will be blocked.

Learn more in [Workload protection best-practices using Kubernetes admission control](container-security.md#workload-protection-best-practices-using-kubernetes-admission-control).

> [!NOTE]
> While the recommendations were in preview, they didn't render an AKS cluster resource unhealthy, and they weren't included in the calculations of your secure score. with this GA announcement these will be included in the score calculation. If you haven't remediated them already, this might result in a slight impact on your secure score. Remediate them wherever possible as described in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).


### Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 Virtual Desktop (WVD) (in preview)

Microsoft Defender for Endpoint is a holistic, cloud delivered endpoint security solution. It provides risk-based vulnerability management and assessment as well as endpoint detection and response (EDR). For a full list of the benefits of using Defender for Endpoint together with Azure Security Center, see [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](security-center-wdatp.md).

When you enable Azure Defender for servers on a Windows server, a license for Defender for Endpoint is included with the plan. If you've already enabled Azure Defender for servers and you have Windows 2019 servers in your subscription, they'll automatically receive Defender for Endpoint with this update. No manual action is required. 

Support has now been expanded to include Windows Server 2019 and [Windows Virtual Desktop (WVD)](../virtual-desktop/overview.md).

> [!NOTE]
> If you're enabling Defender for Endpoint on a Windows Server 2019 machine, ensure it meets the prerequisites described in [Enable the Microsoft Defender for Endpoint integration](security-center-wdatp.md#enable-the-microsoft-defender-for-endpoint-integration).

### Direct link to policy from recommendation details page

When you're reviewing the details of a recommendation, it's often helpful to be able to see the underlying policy. For every recommendation supported by a policy, there's a new link from the recommendation details page:

:::image type="content" source="media/release-notes/view-policy-definition.png" alt-text="Link to Azure Policy page for the specific policy supporting a recommendation":::

Use this link to view the policy definition and review the evaluation logic. 

If you're reviewing the list of recommendations on our [Security recommendations reference guide](recommendations-reference.md), you'll also see links to the policy definition pages:

:::image type="content" source="media/release-notes/view-policy-definition-from-documentation.png" alt-text="Accessing the Azure Policy page for a specific policy directly from the Azure Security Center recommendations reference page" lightbox="media/release-notes/view-policy-definition-from-documentation.png":::


### SQL data classification recommendation no longer affects your secure score
The recommendation **Sensitive data in your SQL databases should be classified** no longer affects your secure score. This is the only recommendation in the **Apply data classification** security control, so that control now has a secure score value of 0.

For a full list of all security controls in Security Center, together with their scores and a list of the recommendations in each, see [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).

### Workflow automations can be triggered by changes to regulatory compliance assessments (in preview)
We've added a third data type to the trigger options for your workflow automations: changes to regulatory compliance assessments.

Learn how to use the workflow automation tools in [Automate responses to Security Center triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation" lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::


### Asset inventory page enhancements
Security Center's asset inventory page has been improved in the following ways:

- Summaries at the top of the page now include **Unregistered subscriptions**, showing the number of subscriptions without Security Center enabled.

    :::image type="content" source="media/release-notes/unregistered-subscriptions.png" alt-text="Count of unregistered subscriptions in the summaries at the top of the asset inventory page":::

- Filters have been expanded and enhanced to include:
    - **Counts** - Each filter presents the number of resources that meet the criteria of each category

        :::image type="content" source="media/release-notes/counts-in-inventory-filters.png" alt-text="Counts in the filters in the asset inventory page of Azure Security Center":::

    - **Contains exemptions filter** (Optional) - narrow the results to resources that have/haven't got exemptions. This filter isn't shown by default, but is accessible from the **Add filter** button.

        :::image type="content" source="media/release-notes/adding-contains-exemption-filter.gif" alt-text="Adding the filter 'contains exemption' in Azure Security Center's asset inventory page":::

Learn more about how to [Explore and manage your resources with asset inventory](asset-inventory.md).

## January 2021

Updates in January include:

- [Azure Security Benchmark is now the default policy initiative for Azure Security Center](#azure-security-benchmark-is-now-the-default-policy-initiative-for-azure-security-center)
- [Vulnerability assessment for on-premise and multi-cloud machines is released for General Availability (GA)](#vulnerability-assessment-for-on-premise-and-multi-cloud-machines-is-released-for-general-availability-ga)
- [Secure score for management groups is now available in preview](#secure-score-for-management-groups-is-now-available-in-preview)
- [Secure score API is released for General Availability (GA)](#secure-score-api-is-released-for-general-availability-ga)
- [Dangling DNS protections added to Azure Defender for App Service](#dangling-dns-protections-added-to-azure-defender-for-app-service)
- [Multi-cloud connectors are released for General Availability (GA)](#multi-cloud-connectors-are-released-for-general-availability-ga)
- [Exempt entire recommendations from your secure score for subscriptions and management groups](#exempt-entire-recommendations-from-your-secure-score-for-subscriptions-and-management-groups)
- [Users can now request tenant-wide visibility from their global administrator](#users-can-now-request-tenant-wide-visibility-from-their-global-administrator)
- [35 preview recommendations added to increase coverage of Azure Security Benchmark](#35-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark)
- [CSV export of filtered list of recommendations](#csv-export-of-filtered-list-of-recommendations)
- ["Not applicable" resources now reported as "Compliant" in Azure Policy assessments](#not-applicable-resources-now-reported-as-compliant-in-azure-policy-assessments)
- [Export weekly snapshots of secure score and regulatory compliance data with continuous export (preview)](#export-weekly-snapshots-of-secure-score-and-regulatory-compliance-data-with-continuous-export-preview)


### Azure Security Benchmark is now the default policy initiative for Azure Security Center

Azure Security Benchmark is the Microsoft-authored, Azure-specific set of guidelines for security and compliance best practices based on common compliance frameworks. This widely respected benchmark builds on the controls from the [Center for Internet Security (CIS)](https://www.cisecurity.org/benchmark/azure/) and the [National Institute of Standards and Technology (NIST)](https://www.nist.gov/) with a focus on cloud-centric security.

In recent months, Security Center's list of built-in security recommendations has grown significantly to expand our coverage of this benchmark.

From this release, the benchmark is the foundation for Security Center’s recommendations and fully integrated as the default policy initiative. 

All Azure services have a security baseline page in their documentation. For example, [this is Security Center's baseline](security-baseline.md). These baselines are built on Azure Security Benchmark.

If you're using Security Center's regulatory compliance dashboard, you'll see two instances of the benchmark during a transition period:

:::image type="content" source="media/release-notes/regulatory-compliance-with-azure-security-benchmark.png" alt-text="Azure Security Center's regulatory compliance dashboard showing the Azure Security Benchmark":::

Existing recommendations are unaffected and as the benchmark grows, changes will automatically be reflected within Security Center. 

To learn more, see the following pages:

- [Learn more about Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction)
- [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md)

### Vulnerability assessment for on-premise and multi-cloud machines is released for General Availability (GA)

In October, we announced a preview for scanning Azure Arc enabled servers with [Azure Defender for servers](defender-for-servers-introduction.md)' integrated vulnerability assessment scanner (powered by Qualys).

It's now released for General Availability (GA).

When you've enabled Azure Arc on your non-Azure machines, Security Center will offer to deploy the integrated vulnerability scanner on them - manually and at-scale.

With this update, you can unleash the power of **Azure Defender for servers** to consolidate your vulnerability management program across all of your Azure and non-Azure assets.

Main capabilities:

- Monitoring the VA (vulnerability assessment) scanner provisioning state on Azure Arc machines
- Provisioning the integrated VA agent to unprotected Windows and Linux Azure Arc machines (manually and at-scale)
- Receiving and analyzing detected vulnerabilities from deployed agents (manually and at-scale)
- Unified experience for Azure VMs and Azure Arc machines

[Learn more about deploying the integrated vulnerability scanner to your hybrid machines](deploy-vulnerability-assessment-vm.md#deploy-the-integrated-scanner-to-your-azure-and-hybrid-machines).

[Learn more about Azure Arc enabled servers](../azure-arc/servers/index.yml).


### Secure score for management groups is now available in preview

The secure score page now shows the aggregated secure scores for your management groups in addition to the subscription level. So now you can see the list of management groups in your organization and the score for each management group.

:::image type="content" source="media/secure-score-security-controls/secure-score-management-groups.png" alt-text="Viewing the secure scores for your management groups.":::

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).

### Secure score API is released for General Availability (GA)

You can now access your score via the [secure score API](/rest/api/securitycenter/securescores/). The API methods provide the flexibility to query the data and build your own reporting mechanism of your secure scores over time. For example:

- use the **Secure Scores** API to get the score for a specific subscription
- use the **Secure Score Controls** API to list the security controls and the current score of your subscriptions

Learn about external tools made possible with the secure score API in [the secure score area of our GitHub community](https://github.com/Azure/Azure-Security-Center/tree/master/Secure%20Score).

Learn more about [secure score and security controls in Azure Security Center](secure-score-security-controls.md).


### Dangling DNS protections added to Azure Defender for App Service

Subdomain takeovers are a common, high-severity threat for organizations. A subdomain takeover can occur when you have a DNS record that points to a deprovisioned web site. Such DNS records are also known as "dangling DNS" entries. CNAME records are especially vulnerable to this threat. 

Subdomain takeovers enable threat actors to redirect traffic intended for an organization’s domain to a site performing malicious activity.

Azure Defender for App Service now detects dangling DNS entries when an App Service website is decommissioned. This is the moment at which the DNS entry is pointing at a non-existent resource, and your website is vulnerable to a subdomain takeover. These protections are available whether your domains are managed with Azure DNS or an external domain registrar and applies to both App Service on Windows and App Service on Linux.

Learn more:

- [App Service alert reference table](alerts-reference.md#alerts-azureappserv) - Includes two new Azure Defender alerts that trigger when a dangling DNS entry is detected
- [Prevent dangling DNS entries and avoid subdomain takeover](../security/fundamentals/subdomain-takeover.md) - Learn about the threat of subdomain takeover and the dangling DNS aspect
- [Introduction to Azure Defender for App Service](defender-for-app-service-introduction.md)


### Multi-cloud connectors are released for General Availability (GA)

With cloud workloads commonly spanning multiple cloud platforms, cloud security services must do the same.

Azure Security Center protects workloads in Azure, Amazon Web Services (AWS), and Google Cloud Platform (GCP).

Connecting your AWS or GCP accounts integrates their native security tools like AWS Security Hub and GCP Security Command Center into Azure Security Center.

This capability means that Security Center provides visibility and protection across all major cloud environments. Some of the benefits of this integration:

- Automatic agent provisioning - Security Center uses Azure Arc to deploy the Log Analytics agent to your AWS instances
- Policy management
- Vulnerability management
- Embedded Endpoint Detection and Response (EDR)
- Detection of security misconfigurations
- A single view showing security recommendations from all cloud providers
- Incorporate all of your resources into Security Center's secure score calculations
- Regulatory compliance assessments of your AWS and GCP resources

From Security Center's menu, select **Multi cloud connectors** and you'll see the options for creating new connectors:

:::image type="content" source="./media/quickstart-onboard-aws/add-aws-account.png" alt-text="Add AWS account button on Security Center's multi cloud connectors page":::

Learn more in:
- [Connect your AWS accounts to Azure Security Center](quickstart-onboard-aws.md)
- [Connect your GCP accounts to Azure Security Center](quickstart-onboard-gcp.md)


### Exempt entire recommendations from your secure score for subscriptions and management groups

We're expanding the exemption capability to include entire recommendations. Providing further options to fine-tune the security recommendations that Security Center makes for your subscriptions, management group, or resources.

Occasionally, a resource will be listed as unhealthy when you know the issue has been resolved by a third-party tool which Security Center hasn't detected. Or a recommendation will show in a scope where you feel it doesn't belong. The recommendation might be inappropriate for a specific subscription. Or perhaps your organization has decided to accept the risks related to the specific resource or recommendation.

With this preview feature, you can now create an exemption for a recommendation to:

- **Exempt a resource** to ensure it isn't listed with the unhealthy resources in the future, and doesn't impact your secure score. The resource will be listed as not applicable and the reason will be shown as "exempted" with the specific justification you select.

- **Exempt a subscription or management group** to ensure that the recommendation doesn't impact your secure score and won't be shown for the subscription or management group in the future. This relates to existing resources and any you create in the future. The recommendation will be marked with the specific justification you select for the scope that you selected.

Learn more in [Exempting resources and recommendations from your secure score](exempt-resource.md).



### Users can now request tenant-wide visibility from their global administrator

If a user doesn't have permissions to see Security Center data, they'll now see a link to request permissions from their organization's global administrator. The request includes the role they'd like and the justification for why it's necessary.

:::image type="content" source="media/security-center-management-groups/request-tenant-permissions.png" alt-text="Banner informing a user they can request tenant-wide permissions.":::

Learn more in [Request tenant-wide permissions when yours are insufficient](tenant-wide-permissions-management.md#request-tenant-wide-permissions-when-yours-are-insufficient).


### 35 preview recommendations added to increase coverage of Azure Security Benchmark

[Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction) is the default policy initiative in Azure Security Center. 

To increase the coverage of this benchmark, the following 35 preview recommendations have been added to Security Center.

> [!TIP]
> Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).

| Security control                     | New recommendations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Enable encryption at rest            | - Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest<br>- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)<br>- Bring your own key data protection should be enabled for MySQL servers<br>- Bring your own key data protection should be enabled for PostgreSQL servers<br>- Cognitive Services accounts should enable data encryption with a customer-managed key (CMK)<br>- Container registries should be encrypted with a customer-managed key (CMK)<br>- SQL managed instances should use customer-managed keys to encrypt data at rest<br>- SQL servers should use customer-managed keys to encrypt data at rest<br>- Storage accounts should use customer-managed key (CMK) for encryption                                                                                                                                                              |
| Implement security best practices    | - Subscriptions should have a contact email address for security issues<br> - Auto provisioning of the Log Analytics agent should be enabled on your subscription<br> - Email notification for high severity alerts should be enabled<br> - Email notification to subscription owner for high severity alerts should be enabled<br> - Key vaults should have purge protection enabled<br> - Key vaults should have soft delete enabled |
| Manage access and permissions        | - Function apps should have 'Client Certificates (Incoming client certificates)' enabled |
| Protect applications against DDoS attacks | - Web Application Firewall (WAF) should be enabled for Application Gateway<br> - Web Application Firewall (WAF) should be enabled for Azure Front Door Service service |
| Restrict unauthorized network access | - Firewall should be enabled on Key Vault<br> - Private endpoint should be configured for Key Vault<br> - App Configuration should use private link<br> - Azure Cache for Redis should reside within a virtual network<br> - Azure Event Grid domains should use private link<br> - Azure Event Grid topics should use private link<br> - Azure Machine Learning workspaces should use private link<br> - Azure SignalR Service should use private link<br> - Azure Spring Cloud should use network injection<br> - Container registries should not allow unrestricted network access<br> - Container registries should use private link<br> - Public network access should be disabled for MariaDB servers<br> - Public network access should be disabled for MySQL servers<br> - Public network access should be disabled for PostgreSQL servers<br> - Storage account should use a private link connection<br> - Storage accounts should restrict network access using virtual network rules<br> - VM Image Builder templates should use private link|
|                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

Related links:

- [Learn more about Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)




### CSV export of filtered list of recommendations 

In November 2020, we added filters to the recommendations page ([Recommendations list now includes filters](#recommendations-list-now-includes-filters)). In December, we expanded those filters ([Recommendations page has new filters for environment, severity, and available responses](#recommendations-page-has-new-filters-for-environment-severity-and-available-responses)). 

With this announcement, we're changing the behavior of the **Download to CSV** button so that the CSV export only includes the recommendations currently displayed in the filtered list. 

For example, in the image below you can see that the list has been filtered to two recommendations. The CSV file that is generated includes the status details for every resource affected by those two recommendations.   

:::image type="content" source="media/security-center-managing-and-responding-alerts/export-to-csv-with-filters.png" alt-text="Exporting filtered recommendations to a CSV file":::

Learn more in [Security recommendations in Azure Security Center](security-center-recommendations.md).


### "Not applicable" resources now reported as "Compliant" in Azure Policy assessments

Previously, resources that were evaluated for a recommendation and found to be **not applicable** appeared in Azure Policy as "Non-compliant". No user actions could change their state to "Compliant". With this change, they're reported as "Compliant" for improved clarity.

The only impact will be seen in Azure Policy where the number of compliant resources will increase. There will be no impact to your secure score in Azure Security Center.


### Export weekly snapshots of secure score and regulatory compliance data with continuous export (preview)

We've added a new preview feature to the [continuous export](continuous-export.md) tools for exporting weekly snapshots of secure score and regulatory compliance data.

When you define a continuous export, set the export frequency:

:::image type="content" source="media/release-notes/export-frequency.png" alt-text="Choosing the frequency of your continuous export":::

- **Streaming** – assessments will be sent in real time when a resource’s health state is updated (if no updates occur, no data will be sent).
- **Snapshots** – a snapshot of the current state of all regulatory compliance assessments will be sent every week (this is a preview feature for weekly snapshots of secure scores and regulatory compliance data).

Learn more about the full capabilities of this feature in [Continuously export Security Center data](continuous-export.md).

## December 2020

Updates in December include:

- [Azure Defender for SQL servers on machines is generally available](#azure-defender-for-sql-servers-on-machines-is-generally-available)
- [Azure Defender for SQL support for Azure Synapse Analytics dedicated SQL pool is generally available](#azure-defender-for-sql-support-for-azure-synapse-analytics-dedicated-sql-pool-is-generally-available)
- [Global Administrators can now grant themselves tenant-level permissions](#global-administrators-can-now-grant-themselves-tenant-level-permissions)
- [Two new Azure Defender plans: Azure Defender for DNS and Azure Defender for Resource Manager (in preview)](#two-new-azure-defender-plans-azure-defender-for-dns-and-azure-defender-for-resource-manager-in-preview)
- [New security alerts page in the Azure portal (preview)](#new-security-alerts-page-in-the-azure-portal-preview)
- [Revitalized Security Center experience in Azure SQL Database & SQL Managed Instance](#revitalized-security-center-experience-in-azure-sql-database--sql-managed-instance)
- [Asset inventory tools and filters updated](#asset-inventory-tools-and-filters-updated)
- [Recommendation about web apps requesting SSL certificates no longer part of secure score](#recommendation-about-web-apps-requesting-ssl-certificates-no-longer-part-of-secure-score)
- [Recommendations page has new filters for environment, severity, and available responses](#recommendations-page-has-new-filters-for-environment-severity-and-available-responses)
- [Continuous export gets new data types and improved deployifnotexist policies](#continuous-export-gets-new-data-types-and-improved-deployifnotexist-policies)


### Azure Defender for SQL servers on machines is generally available

Azure Security Center offers two Azure Defender plans for SQL Servers:

- **Azure Defender for Azure SQL database servers** - defends your Azure-native SQL Servers 
- **Azure Defender for SQL servers on machines** - extends the same protections to your SQL servers in hybrid, multi-cloud, and on-premises environments

With this announcement, **Azure Defender for SQL** now protects your databases and their data wherever they're located.

Azure Defender for SQL includes vulnerability assessment capabilities. The vulnerability assessment tool includes the following advanced features:

- **Baseline configuration** (New!) to intelligently refine the results of vulnerability scans to those that might represent real security issues. After you've established your baseline security state, the vulnerability assessment tool only reports deviations from that baseline state. Results that match the baseline are considered as passing subsequent scans. This lets you and your analysts focus your attention where it matters.
- **Detailed benchmark information** to help you *understand* the discovered findings, and why they relate to your resources.
- **Remediation scripts** to help you mitigate identified risks.

Learn more about [Azure Defender for SQL](defender-for-sql-introduction.md).


### Azure Defender for SQL support for Azure Synapse Analytics dedicated SQL pool is generally available

Azure Synapse Analytics (formerly SQL DW) is an analytics service that combines enterprise data warehousing and big data analytics. Dedicated SQL pools are the enterprise data warehousing features of Azure Synapse. Learn more in [What is Azure Synapse Analytics (formerly SQL DW)?](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-overview-what-is.md).

Azure Defender for SQL protects your dedicated SQL pools with:

- **Advanced threat protection** to detect threats and attacks 
- **Vulnerability assessment capabilities** to identify and remediate security misconfigurations

Azure Defender for SQL's support for Azure Synapse Analytics SQL pools is automatically added to Azure SQL databases bundle in Azure Security Center. You'll find a new “Azure Defender for SQL” tab in your Synapse workspace page in the Azure portal.

Learn more about [Azure Defender for SQL](defender-for-sql-introduction.md).


### Global Administrators can now grant themselves tenant-level permissions

A user with the Azure Active Directory role of **Global Administrator** might have tenant-wide responsibilities, but lack the Azure permissions to view that organization-wide information in Azure Security Center. 

To assign yourself tenant-level permissions, follow the instructions in [Grant tenant-wide permissions to yourself](tenant-wide-permissions-management.md#grant-tenant-wide-permissions-to-yourself).


### Two new Azure Defender plans: Azure Defender for DNS and Azure Defender for Resource Manager (in preview)

We've added two new cloud-native breadth threat protection capabilities for your Azure environment.

These new protections greatly enhance your resiliency against attacks from threat actors, and significantly increase the number of Azure resources protected by Azure Defender.

- **Azure Defender for Resource Manager** - automatically monitors all resource management operations performed in your organization. For more information, see:
    - [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
    - [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
    - [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)

- **Azure Defender for DNS** - continuously monitors all DNS queries from your Azure resources. For more information, see:
    - [Introduction to Azure Defender for DNS](defender-for-dns-introduction.md)
    - [Respond to Azure Defender for DNS alerts](defender-for-dns-usage.md)
    - [List of alerts provided by Azure Defender for DNS](alerts-reference.md#alerts-dns)


### New security alerts page in the Azure portal (preview)

Azure Security Center's security alerts page has been redesigned to provide:

- **Improved triage experience for alerts** - helping to reduce alerts fatigue and focus on the most relevant threats easier, the list includes customizable filters and grouping options
- **More information in the alerts list** - such as MITRE ATT&ACK tactics
- **Button to create sample alerts** - to evaluate Azure Defender capabilities and test your alerts configuration (for SIEM integration, email notifications, and workflow automations), you can create sample alerts from all Azure Defender plans
- **Alignment with Azure Sentinel's incident experience** - for customers who use both products, switching between them is now a more straightforward experience and it's easy to learn one from the other
- **Better performance** for large alerts lists
- **Keyboard navigation** through the alert list
- **Alerts from Azure Resource Graph** - you can query alerts in Azure Resource Graph, the Kusto-like API for all of your resources. This is also useful if you're building your own alerts dashboards. [Learn more about Azure Resource Graph](../governance/resource-graph/index.yml).

To access the new experience, use the 'try it now' link from the banner at the top of the security alerts page.

:::image type="content" source="media/security-center-managing-and-responding-alerts/preview-alerts-experience-banner.png" alt-text="Banner with link to the new preview alerts experience":::

To create sample alerts from the new alerts experience, see [Generate sample Azure Defender alerts](security-center-alert-validation.md#generate-sample-azure-defender-alerts).


### Revitalized Security Center experience in Azure SQL Database & SQL Managed Instance 

The Security Center experience within SQL provides access to the following Security Center and Azure Defender for SQL features:

- **Security recommendations** – Security Center periodically analyzes the security state of all connected Azure resources to identify potential security misconfigurations. It then provides recommendations on how to remediate those vulnerabilities and improve organizations’ security posture.
- **Security alerts** – a detection service that continuously monitors Azure SQL activities for threats such as SQL injection, brute-force attacks, and privilege abuse. This service triggers detailed and action-oriented security alerts in Security Center and provides options for continuing investigations with Azure Sentinel, Microsoft’s Azure-native SIEM solution.
- **Findings** – a vulnerability assessment service that continuously monitors Azure SQL configurations and helps remediate vulnerabilities. Assessment scans provide an overview of Azure SQL security states together with detailed security findings.	 

:::image type="content" source="media/release-notes/azure-security-center-experience-in-sql.png" alt-text="Azure Security Center's security features for SQL are available from within Azure SQL":::


### Asset inventory tools and filters updated

The inventory page in Azure Security Center has been refreshed with the following changes:

- **Guides and feedback** added to the toolbar. This opens a pane with links to related information and tools. 
- **Subscriptions filter** added to the default filters available for your resources.
- **Open query** link for opening the current filter options as an Azure Resource Graph query (formerly called "View in resource graph explorer").
- **Operator options** for each filter. Now you can choose from more logical operators other than '='. For example, you might want to find all resources with active recommendations whose titles include the string 'encrypt'. 

    :::image type="content" source="media/release-notes/inventory-filter-operators.png" alt-text="Controls for the operator option in asset inventory's filters":::

Learn more about inventory in [Explore and manage your resources with asset inventory](asset-inventory.md).


### Recommendation about web apps requesting SSL certificates no longer part of secure score

The recommendation "Web apps should request an SSL certificate for all incoming requests" has been moved from the security control **Manage access and permissions** (worth a maximum of 4 pts) into **Implement security best practices** (which is worth no points). 

Ensuring a web app requests a certificate certainly makes it more secure. However, for public-facing web apps it's irrelevant. If you access your site over HTTP and not HTTPS, you will not receive any client certificate. So if your application requires client certificates, you should not allow requests to your application over HTTP. Learn more in [Configure TLS mutual authentication for Azure App Service](../app-service/app-service-web-configure-tls-mutual-auth.md).

With this change, the recommendation is now a recommended best practice that does not impact your score. 

Learn which recommendations are in each security control in [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).


### Recommendations page has new filters for environment, severity, and available responses

Azure Security Center monitors all connected resources and generates security recommendations. Use these recommendations to strengthen your hybrid cloud posture and track compliance with the policies and standards relevant to your organization, industry, and country.

As Security Center continues to expand its coverage and features, the list of security recommendations is growing every month. For example, see [29 preview recommendations added to increase coverage of Azure Security Benchmark](#29-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark).

With the growing list, there's a need to filter the recommendations to find the ones of greatest interest. In November, we added filters to the recommendations page (see [Recommendations list now includes filters](#recommendations-list-now-includes-filters)).

The filters added this month provide options to refine the recommendations list according to:

- **Environment** - View recommendations for your AWS, GCP, or Azure resources (or any combination)
- **Severity** - View recommendations according to the severity classification set by Security Center
- **Response actions** - View recommendations according to the availability of Security Center response options: Quick fix, Deny, and Enforce

    > [!TIP]
    > The response actions filter replaces the **Quick fix available (Yes/No)** filter. 
    > 
    > Learn more about each of these response options:
    > - [Quick fix remediation](security-center-remediate-recommendations.md#quick-fix-remediation)
    > - [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md)

:::image type="content" source="./media/release-notes/added-recommendations-filters.png" alt-text="Recommendations grouped by security control" lightbox="./media/release-notes/added-recommendations-filters.png":::

### Continuous export gets new data types and improved deployifnotexist policies

Azure Security Center's continuous export tools enable you to export Security Center's recommendations and alerts for use with other monitoring tools in your environment.

Continuous export lets you fully customize what will be exported, and where it will go. For full details, see  [Continuously export Security Center data](continuous-export.md).

These tools have been enhanced and expanded in the following ways:

- **Continuous export's deployifnotexist policies enhanced**. The policies now:

    - **Check whether the configuration is enabled.** If it isn't, the policy will show as non-compliant and create a compliant resource. Learn more about the supplied Azure Policy templates in the "Deploy at scale with Azure Policy tab" in [Set up a continuous export](continuous-export.md#set-up-a-continuous-export).

    - **Support exporting security findings.** When using the Azure Policy templates, you can configure your  continuous export to include findings. This is relevant when exporting recommendations that have 'sub' recommendations, like findings from vulnerability assessment scanners or specific system updates for the 'parent' recommendation "System updates should be installed on your machines".
    
    - **Support exporting secure score data.**

- **Regulatory compliance assessment data added (in preview).** You can now continuously export updates to regulatory compliance assessments, including for any custom initiatives, to a Log Analytics workspace or Event Hub. This feature is unavailable on national/sovereign clouds.

    :::image type="content" source="media/release-notes/continuous-export-regulatory-compliance-option.png" alt-text="The options for including regulatory compliant assessment information with your continuous export data.":::


## November 2020

Updates in November include:

- [29 preview recommendations added to increase coverage of Azure Security Benchmark](#29-preview-recommendations-added-to-increase-coverage-of-azure-security-benchmark)
- [NIST SP 800 171 R2 added to Security Center's regulatory compliance dashboard](#nist-sp-800-171-r2-added-to-security-centers-regulatory-compliance-dashboard)
- [Recommendations list now includes filters](#recommendations-list-now-includes-filters)
- [Auto provisioning experience improved and expanded](#auto-provisioning-experience-improved-and-expanded)
- [Secure score is now available in continuous export (preview)](#secure-score-is-now-available-in-continuous-export-preview)
- ["System updates should be installed on your machines" recommendation now includes subrecommendations](#system-updates-should-be-installed-on-your-machines-recommendation-now-includes-subrecommendations)
- [Policy management page in the Azure portal now shows status of default policy assignments](#policy-management-page-in-the-azure-portal-now-shows-status-of-default-policy-assignments)

### 29 preview recommendations added to increase coverage of Azure Security Benchmark

Azure Security Benchmark is the Microsoft-authored, Azure-specific, set of guidelines for security and compliance best practices based on common compliance frameworks. [Learn more about Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction).

The following 29 preview recommendations have been added to Security Center to increase the coverage of this benchmark.

Preview recommendations don't render a resource unhealthy, and they aren't included in the calculations of your secure score. Remediate them wherever possible, so that when the preview period ends they'll contribute towards your score. Learn more about how to respond to these recommendations in [Remediate recommendations in Azure Security Center](security-center-remediate-recommendations.md).

| Security control                     | New recommendations                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
|--------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Encrypt data in transit              | - Enforce SSL connection should be enabled for PostgreSQL database servers<br>- Enforce SSL connection should be enabled for MySQL database servers<br>- TLS should be updated to the latest version for your API app<br>- TLS should be updated to the latest version for your function app<br>- TLS should be updated to the latest version for your web app<br>- FTPS should be required in your API App<br>- FTPS should be required in your function App<br>- FTPS should be required in your web App                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Manage access and permissions        | - Web apps should request an SSL certificate for all incoming requests<br>- Managed identity should be used in your API App<br>- Managed identity should be used in your function App<br>- Managed identity should be used in your web App                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Restrict unauthorized network access | - Private endpoint should be enabled for PostgreSQL servers<br>- Private endpoint should be enabled for MariaDB servers<br>- Private endpoint should be enabled for MySQL servers                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Enable auditing and logging          | - Diagnostic logs in App Services should be enabled                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Implement security best practices    | - Azure Backup should be enabled for virtual machines<br>- Geo-redundant backup should be enabled for Azure Database for MariaDB<br>- Geo-redundant backup should be enabled for Azure Database for MySQL<br>- Geo-redundant backup should be enabled for Azure Database for PostgreSQL<br>- PHP should be updated to the latest version for your API app<br>- PHP should be updated to the latest version for your web app<br>- Java should be updated to the latest version for your API app<br>- Java should be updated to the latest version for your function app<br>- Java should be updated to the latest version for your web app<br>- Python should be updated to the latest version for your API app<br>- Python should be updated to the latest version for your function app<br>- Python should be updated to the latest version for your web app<br>- Audit retention for SQL servers should be set to at least 90 days |
|                                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

Related links:

- [Learn more about Azure Security Benchmark](https://docs.microsoft.com/security/benchmark/azure/introduction)
- [Learn more about Azure API apps](../app-service/app-service-web-tutorial-rest-api.md)
- [Learn more about Azure function apps](../azure-functions/functions-overview.md)
- [Learn more about Azure web apps](../app-service/overview.md)
- [Learn more about Azure Database for MariaDB](../mariadb/overview.md)
- [Learn more about Azure Database for MySQL](../mysql/overview.md)
- [Learn more about Azure Database for PostgreSQL](../postgresql/overview.md)


### NIST SP 800 171 R2 added to Security Center's regulatory compliance dashboard

The NIST SP 800-171 R2 standard is now available as a built-in initiative for use with Azure Security Center's regulatory compliance dashboard. The mappings for the controls are described in [Details of the NIST SP 800-171 R2 Regulatory Compliance built-in initiative](../governance/policy/samples/nist-sp-800-171-r2.md). 

To apply the standard to your subscriptions and continuously monitor your compliance status, use the instructions in [Customize the set of standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/nist-sp-800-171-r2-standard.png" alt-text="The NIST SP 800 171 R2 standard in Security Center's regulatory compliance dashboard":::

For more information about this compliance standard, see [NIST SP 800-171 R2](https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final).


### Recommendations list now includes filters

You can now filter the list of security recommendations according to a range of criteria. In the following example, the recommendations list has been filtered to show recommendations that:

- are **generally available** (that is, not preview)
- are for **storage accounts**
- support **quick fix** remediation

:::image type="content" source="media/release-notes/recommendations-filters.png" alt-text="Filters for the recommendations list":::


### Auto provisioning experience improved and expanded

The auto provisioning feature helps reduce management overhead by installing the required extensions on new - and existing - Azure VMs so they can benefit from Security Center's protections. 

As Azure Security Center grows, more extensions have been developed and Security Center can monitor a larger list of resource types. The auto provisioning tools have now been expanded to support other extensions and resource types by leveraging the capabilities of Azure Policy.

You can now configure the auto provisioning of:

- Log Analytics agent
- (New) Azure Policy Add-on for Kubernetes
- (New) Microsoft Dependency agent

Learn more in [Auto provisioning agents and extensions from Azure Security Center](security-center-enable-data-collection.md).


### Secure score is now available in continuous export (preview)

With continuous export of secure score, you can stream changes to your score in real time to Azure Event Hubs or a Log Analytics workspace. Use this capability to:

- track your secure score over time with dynamic reports
- export secure score data to Azure Sentinel (or any other SIEM)
- integrate this data with any processes you might already be using to monitor secure score in your organization

Learn more about how to [Continuously export Security Center data](continuous-export.md).


### "System updates should be installed on your machines" recommendation now includes subrecommendations

The **System updates should be installed on your machines** recommendation has been enhanced. The new version includes subrecommendations for each missing update and brings the following improvements:

- A redesigned experience in the Azure Security Center pages of the Azure portal. The recommendation details page for **System updates should be installed on your machines** includes the list of findings as shown below. When you select a single finding, the details pane opens with a link to the remediation information and a list of affected resources.

    :::image type="content" source="./media/upcoming-changes/system-updates-should-be-installed-subassessment.png" alt-text="Opening one of the subrecommendations in the portal experience for the updated recommendation":::

- Enriched data for the recommendation from Azure Resource Graph (ARG). ARG is an Azure service that's designed to provide efficient resource exploration. You can use ARG to query at scale across a given set of subscriptions so that you can effectively govern your environment. 

    For Azure Security Center, you can use ARG and the [Kusto Query Language (KQL)](/azure/data-explorer/kusto/query/) to query a wide range of security posture data.

    Previously, if you queried this recommendation in ARG, the only available information was that the recommendation needs to be remediated on a machine. The following query of the enhanced version  will return each missing system updates grouped by machine.

    ```kusto
    securityresources
    | where type =~ "microsoft.security/assessments/subassessments"
    | where extract(@"(?i)providers/Microsoft.Security/assessments/([^/]*)", 1, id) == "4ab6e3c5-74dd-8b35-9ab9-f61b30875b27"
    | where properties.status.code == "Unhealthy"
    ```

### Policy management page in the Azure portal now shows status of default policy assignments

You can now see whether or not your subscriptions have the default Security Center policy assigned, in the Security Center's **security policy** page of the Azure portal.

:::image type="content" source="media/release-notes/policy-assignment-info-per-subscription.png" alt-text="The policy management page of Azure Security Center showing the default policy assignments":::