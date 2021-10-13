---
title: Release notes for Azure Security Center
description: A description of what's new and changed in Azure Security Center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: reference
ms.date: 10/13/2021
ms.author: memildin

---

# What's new in Azure Security Center?

Security Center is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often. 

To learn about *planned* changes that are coming soon to Security Center, see [Important upcoming changes to Azure Security Center](upcoming-changes.md). 

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Azure Security Center](release-notes-archive.md).


## October 2021

Updates in October include:

- [Microsoft Threat and Vulnerability Management added as vulnerability assessment solution (in preview)](#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution-in-preview)
- [Vulnerability assessment solutions can now be auto enabled (in preview)](#vulnerability-assessment-solutions-can-now-be-auto-enabled-in-preview)
- [Software inventory filters added to asset inventory (in preview)](#software-inventory-filters-added-to-asset-inventory-in-preview)
- [Changed prefix of some alert types from "ARM_" to "VM_"](#changed-prefix-of-some-alert-types-from-arm_-to-vm_)
- [Changes to the logic of a security recommendation for Kubernetes clusters](#changes-to-the-logic-of-a-security-recommendation-for-kubernetes-clusters)
- [Recommendations details pages now show related recommendations](#recommendations-details-pages-now-show-related-recommendations)


### Microsoft Threat and Vulnerability Management added as vulnerability assessment solution (in preview)

We've extended the integration between [Azure Defender for servers](defender-for-servers-introduction.md) and Microsoft Defender for Endpoint, to support a new vulnerability assessment provide for your machines: [Microsoft threat and vulnerability management](/microsoft-365/security/defender-endpoint/next-gen-threat-and-vuln-mgt). 

Use **threat and vulnerability management** to discover vulnerabilities and misconfigurations in near real time with the [integration with Microsoft Defender for Endpoint](security-center-wdatp.md) enabled, and without the need for additional agents or periodic scans. Threat and vulnerability management prioritizes vulnerabilities based on the threat landscape and detections in your organization.

Use the security recommendation "[A vulnerability assessment solution should be enabled on your virtual machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/ffff0522-1e88-47fc-8382-2a80ba848f5d)" to surface the vulnerabilities detected by threat and vulnerability management for your [supported machines](/microsoft-365/security/defender-endpoint/tvm-supported-os?view=o365-worldwide&preserve-view=true). 

To automatically surface the vulnerabilities, on existing and new machines, without the need to manually remediate the recommendation, see [Vulnerability assessment solutions can now be auto enabled (in preview)](#vulnerability-assessment-solutions-can-now-be-auto-enabled-in-preview).

Learn more in [Investigate weaknesses with Microsoft Defender for Endpoint's threat and vulnerability management](deploy-vulnerability-assessment-tvm.md).

### Vulnerability assessment solutions can now be auto enabled (in preview)

Security Center's auto provisioning page now includes the option to automatically enable a vulnerability assessment solution to Azure virtual machines and Azure Arc machines on subscriptions protected by [Azure Defender for servers](defender-for-servers-introduction.md).

Also, if the [integration with Microsoft Defender for Endpoint](security-center-wdatp.md) is enabled, you'll have a choice of vulnerability assessment solutions:

- (**NEW**) The Microsoft threat and vulnerability management module of Microsoft Defender for Endpoint (see [the release note](#microsoft-threat-and-vulnerability-management-added-as-vulnerability-assessment-solution-in-preview))
- The integrated Qualys agent

:::image type="content" source="media/deploy-vulnerability-assessment-tvm/auto-provision-vulnerability-assessment-agent.png" alt-text="Configure auto provisioning of Microsoft's threat and vulnerability management from Azure Security Center.":::

Your chosen solution will be automatically enabled on supported machines.

Learn more in [Automatically configure vulnerability assessment for your machines](auto-deploy-vulnerability-assessment.md).

### Software inventory filters added to asset inventory (in preview)

The [asset inventory](asset-inventory.md) page now includes a filter to select machines running specific software - and even specify the versions of interest. 

Additionally, you can query the software inventory data in **Azure Resource Graph Explorer**.

To use these new features, you'll need to enable the [integration with Microsoft Defender for Endpoint](security-center-wdatp.md). 

For full details, including sample Kusto queries for Azure Resource Graph, see [Access a software inventory](asset-inventory.md#access-a-software-inventory).

:::image type="content" source="media/deploy-vulnerability-assessment-tvm/software-inventory.png" alt-text="If you've enabled the threat and vulnerability solution, Security Center's asset inventory offers a filter to select resources by their installed software.":::

### Changed prefix of some alert types from "ARM_" to "VM_" 

In July 2021, we announced a [logical reorganization of Azure Defender for Resource Manager alerts](release-notes.md#logical-reorganization-of-azure-defender-for-resource-manager-alerts) 

As part of a logical reorganization of some of the Azure Defender plans, we moved twenty-one alerts from [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) to [Azure Defender for servers](defender-for-servers-introduction.md).

With this update, we've changed the prefixes of these alerts to match this reassignment and replaced "ARM_" with "VM_" as shown in the following table:

| Original name                                  | From this change                              |
|------------------------------------------------|-----------------------------------------------|
| ARM_AmBroadFilesExclusion                      | VM_AmBroadFilesExclusion                      |
| ARM_AmDisablementAndCodeExecution              | VM_AmDisablementAndCodeExecution              |
| ARM_AmDisablement                              | VM_AmDisablement                              |
| ARM_AmFileExclusionAndCodeExecution            | VM_AmFileExclusionAndCodeExecution            |
| ARM_AmTempFileExclusionAndCodeExecution        | VM_AmTempFileExclusionAndCodeExecution        |
| ARM_AmTempFileExclusion                        | VM_AmTempFileExclusion                        |
| ARM_AmRealtimeProtectionDisabled               | VM_AmRealtimeProtectionDisabled               |
| ARM_AmTempRealtimeProtectionDisablement        | VM_AmTempRealtimeProtectionDisablement        |
| ARM_AmRealtimeProtectionDisablementAndCodeExec | VM_AmRealtimeProtectionDisablementAndCodeExec |
| ARM_AmMalwareCampaignRelatedExclusion          | VM_AmMalwareCampaignRelatedExclusion          |
| ARM_AmTemporarilyDisablement                   | VM_AmTemporarilyDisablement                   |
| ARM_UnusualAmFileExclusion                     | VM_UnusualAmFileExclusion                     |
| ARM_CustomScriptExtensionSuspiciousCmd         | VM_CustomScriptExtensionSuspiciousCmd         |
| ARM_CustomScriptExtensionSuspiciousEntryPoint  | VM_CustomScriptExtensionSuspiciousEntryPoint  |
| ARM_CustomScriptExtensionSuspiciousPayload     | VM_CustomScriptExtensionSuspiciousPayload     |
| ARM_CustomScriptExtensionSuspiciousFailure     | VM_CustomScriptExtensionSuspiciousFailure     |
| ARM_CustomScriptExtensionUnusualDeletion       | VM_CustomScriptExtensionUnusualDeletion       |
| ARM_CustomScriptExtensionUnusualExecution      | VM_CustomScriptExtensionUnusualExecution      |
| ARM_VMAccessUnusualConfigReset                 | VM_VMAccessUnusualConfigReset                 |
| ARM_VMAccessUnusualPasswordReset               | VM_VMAccessUnusualPasswordReset               |
| ARM_VMAccessUnusualSSHReset                    | VM_VMAccessUnusualSSHReset                    |
|||

Learn more about the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for servers](defender-for-servers-introduction.md) plans.

### Changes to the logic of a security recommendation for Kubernetes clusters

The recommendation "Kubernetes clusters should not use the default namespace" prevents usage of the default namespace for a range of resource types. Two of the resource types that were included in this recommendation have been removed: ConfigMap and Secret. 

Learn more about this recommendation and hardening your Kubernetes clusters in [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md).

### Recommendations details pages now show related recommendations

To clarify the relationships between different recommendations, we've added a **Related recommendations** area to to the details pages of many recommendations. 

The three relationship types that are shown on these pages are:

- **Prerequisite** - A recommendation that must be completed before the selected recommendation
- **Alternative** - A different recommendation which provides another way of achieving the goals of the selected recommendation
- **Dependent** - A recommendation for which the selected recommendation is a prerequisite

For each related recommendation, the number of unhealthy resources is shown in the "Affected resources" column.

> [!TIP]
> If a related recommendation is grayed out, its dependency isn't yet completed and so isn't available.

An example of related recommendations:

1. Security Center checks your machines for supported vulnerability assessment solutions:<br>
    **A vulnerability assessment solution should be enabled on your virtual machines**

1. If one is found, you'll get notified about discovered vulnerabilities:<br>
    **Vulnerabilities in your virtual machines should be remediated**

Obviously, Security Center can't notify you about discovered vulnerabilities unless it finds a supported vulnerability assessment solutions.

Therefore:

 - Recommendation #1 is a prerequisite for recommendation #2
 - Recommendation #2 depends upon recommendation #1

:::image type="content" source="media/release-notes/related-recommendations-solution-not-found.png" alt-text="Screenshot of recommendation to deploy vulnerability assessment solution.":::

:::image type="content" source="media/release-notes/related-recommendations-vulnerabilities-found.png" alt-text="Screenshot of recommendation to resolve discovered vulnerabilities.":::



## September 2021

In September, the following update was released:

### Two new recommendations to audit OS configurations for Azure security baseline compliance (in preview)

The following two recommendations have been released to assess your machines' compliance with the [Windows security baseline](../governance/policy/samples/guest-configuration-baseline-windows.md) and the [Linux security baseline](../governance/policy/samples/guest-configuration-baseline-linux.md):

- For Windows machines, [Vulnerabilities in security configuration on your Windows machines should be remediated (powered by Guest Configuration)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/1f655fb7-63ca-4980-91a3-56dbc2b715c6)
- For Linux machines, [Vulnerabilities in security configuration on your Linux machines should be remediated (powered by Guest Configuration)](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/8c3d9ad0-3639-4686-9cd2-2b2ab2609bda)

These recommendations make use of the guest configuration feature of Azure Policy to compare the OS configuration of a machine with the baseline defined in the [Azure Security Benchmark](/security/benchmark/azure/overview).

Learn more about using these recommendations in [Harden a machine's OS configuration using guest configuration](apply-security-baseline.md).

## August 2021

Updates in August include:

- [Microsoft Defender for Endpoint for Linux now supported by Azure Defender for servers (in preview)](#microsoft-defender-for-endpoint-for-linux-now-supported-by-azure-defender-for-servers-in-preview)
- [Two new recommendations for managing endpoint protection solutions (in preview)](#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview)
- [Built-in troubleshooting and guidance for solving common issues](#built-in-troubleshooting-and-guidance-for-solving-common-issues)
- [Regulatory compliance dashboard's Azure Audit reports released for general availability (GA)](#regulatory-compliance-dashboards-azure-audit-reports-released-for-general-availability-ga)
- [Deprecated recommendation 'Log Analytics agent health issues should be resolved on your machines'](#deprecated-recommendation-log-analytics-agent-health-issues-should-be-resolved-on-your-machines)
- [Azure Defender for container registries now scans for vulnerabilities in registries protected with Azure Private Link](#azure-defender-for-container-registries-now-scans-for-vulnerabilities-in-registries-protected-with-azure-private-link)
- [Security Center can now auto provision the Azure Policy's Guest Configuration extension (in preview)](#security-center-can-now-auto-provision-the-azure-policys-guest-configuration-extension-in-preview)
- [Recommendations to enable Azure Defender plans now support "Enforce"](#recommendations-to-enable-azure-defender-plans-now-support-enforce)
- [CSV exports of recommendation data now limited to 20 MB](#csv-exports-of-recommendation-data-now-limited-to-20-mb)
- [Recommendations page now includes multiple views](#recommendations-page-now-includes-multiple-views)

### Microsoft Defender for Endpoint for Linux now supported by Azure Defender for servers (in preview)

[Azure Defender for servers](defender-for-servers-introduction.md) includes an integrated license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities.

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Security Center. From Security Center, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack.

During the preview period, you'll deploy the [Defender for Endpoint for Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux) sensor to supported Linux machines in one of two ways depending on whether you've already deployed it to your Windows machines:

- [Existing users of Azure Defender and Microsoft Defender for Endpoint for Windows](security-center-wdatp.md?tabs=linux#existing-users-of-azure-defender-and-microsoft-defender-for-endpoint-for-windows)
- [New users who have never enabled the integration with Microsoft Defender for Endpoint for Windows](security-center-wdatp.md?tabs=linux#new-users-whove-never-enabled-the-integration-with-microsoft-defender-for-endpoint-for-windows)

Learn more in [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](security-center-wdatp.md).

### Two new recommendations for managing endpoint protection solutions (in preview)

We've added two **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. Both recommendations include support for Azure virtual machines and machines connected to Azure Arc-enabled servers.

|Recommendation |Description |Severity |
|---|---|---|
|[Endpoint protection should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) |To protect your machines from threats and vulnerabilities, install a supported endpoint protection solution.  <br> <a href="/azure/security-center/security-center-endpoint-protection">Learn more about how Endpoint Protection for machines is evaluated.</a><br />(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)) |High |
|[Endpoint protection health issues should be resolved on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) |Resolve endpoint protection health issues on your virtual machines to protect them from latest threats and vulnerabilities. Azure Security Center supported endpoint protection solutions are documented [here](./security-center-services.md?tabs=features-windows). Endpoint protection assessment is documented <a href='/azure/security-center/security-center-endpoint-protection'>here</a>.<br />(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)) |Medium |
|||

> [!NOTE]
> The recommendations show their freshness interval as 8 hours, but there are some scenarios in which this might take significantly longer. For example, when an on premises machine is deleted, it takes 24 hours for Security Center to identify the deletion. After that, the assessment will take up to 8 hours to return the information. In that specific situation therefore, it may take 32 hours for the machine to be removed from the list of affected resources.
>
> :::image type="content" source="media/release-notes/freshness-interval.png" alt-text="Freshness interval indicator for these two new Security Center recommendations":::

### Built-in troubleshooting and guidance for solving common issues

A new, dedicated area of the Security Center pages in the Azure portal provides a collated, ever-growing set of self-help materials for solving common challenges with Security Center and Azure Defender.

When you're facing an issue, or are seeking advice from our support team, **Diagnose and solve problems** is another tool to help you find the solution:

:::image type="content" source="media/release-notes/solve-problems.png" alt-text="Security Center's 'Diagnose and solve problems' page":::
 

### Regulatory compliance dashboard's Azure Audit reports released for general availability (GA)

The regulatory compliance dashboard's toolbar offers Azure and Dynamics certification reports for the standards applied to your subscriptions. 

:::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Regulatory compliance dashboard's toolbar showing the button for generating audit reports.":::

You can select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need.

For more information, see [Generate compliance status reports and certificates](security-center-compliance-dashboard.md#generate-compliance-status-reports-and-certificates).

:::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard-ga.png" alt-text="Tabbed lists of available Azure Audit reports. Shown are tabs for ISO reports, SOC reports, PCI, and more.":::

### Deprecated recommendation 'Log Analytics agent health issues should be resolved on your machines'

We've found that recommendation **Log Analytics agent health issues should be resolved on your machines** impacts secure scores in ways that are inconsistent with Security Center's Cloud Security Posture Management (CSPM) focus. Typically, CSPM relates to identifying security misconfigurations. Agent health issues don't fit into this category of issues.

Also, the recommendation is an anomaly when compared with the other agents related to Security Center: this is the only agent with a recommendation related to health issues.

The recommendation has been deprecated.

As a result of this deprecation, we've also made minor changes to the recommendations for installing the Log Analytics agent (**Log Analytics agent should be installed on...**).

It's likely that this change will impact your secure scores. For most subscriptions, we expect the change to lead to an increased score, but it's possible the updates to the installation recommendation might result in decreased scores in some cases.

> [!TIP]
> The [asset inventory](asset-inventory.md) page was also affected by this change as it displays the monitored status for machines (monitored, not monitored, or partially monitored - a state which refers to an agent with health issues).


### Azure Defender for container registries now scans for vulnerabilities in registries protected with Azure Private Link
Azure Defender for container registries includes a vulnerability scanner to scan images in your Azure Container Registry registries. Learn how to scan your registries and remediate findings in [Use Azure Defender for container registries to scan your images for vulnerabilities](defender-for-container-registries-usage.md).

To limit access to a registry hosted in Azure Container Registry, assign virtual network private IP addresses to the registry endpoints and use Azure Private Link as explained in [Connect privately to an Azure container registry using Azure Private Link](../container-registry/container-registry-private-link.md).

As part of our ongoing efforts to support additional environments and use cases, Azure Defender now also scans container registries protected with [Azure Private Link](../private-link/private-link-overview.md).


### Security Center can now auto provision the Azure Policy's Guest Configuration extension (in preview)
Azure Policy can audit settings inside a machine, both for machines running in Azure and Arc connected machines. The validation is performed by the Guest Configuration extension and client. Learn more in [Understand Azure Policy's Guest Configuration](../governance/policy/concepts/guest-configuration.md).

With this update you can now set Security Center to automatically provision this extension to all supported machines. 

:::image type="content" source="media/release-notes/auto-provisioning-guest-configuration.png" alt-text="Enable auto deployment of Guest Configuration extension.":::

Learn more about how auto provisioning works in [Configure auto provisioning for agents and extensions](security-center-enable-data-collection.md).

### Recommendations to enable Azure Defender plans now support "Enforce"
Security Center includes two features that help ensure newly created resources are provisioned in a secure manner: **enforce** and **deny**. When a recommendation offers these options, you can ensure your security requirements are met whenever someone attempts to create a resource:

- **Deny** stops unhealthy resources from being created
- **Enforce** automatically remediates non-compliant resources when they're created

With this update, the enforce option is now available on the recommendations to enable Azure Defender plans (such as **Azure Defender for App Service should be enabled**, **Azure Defender for Key Vault should be enabled**, **Azure Defender for Storage should be enabled**).

Learn more about these options in [Prevent misconfigurations with Enforce/Deny recommendations](prevent-misconfigurations.md).

### CSV exports of recommendation data now limited to 20 MB

We're instituting a limit of 20 MB when exporting Security Center recommendations data.

:::image type="content" source="media/upcoming-changes/download-csv-report.png" alt-text="Security Center's 'download CSV report' button to export recommendation data.":::

If you need to export larger amounts of data, use the available filters before selecting, or select subsets of your subscriptions and download the data in batches.

:::image type="content" source="media/upcoming-changes/filter-subscriptions.png" alt-text="Filtering subscriptions in the Azure portal.":::

Learn more about [performing a CSV export of your security recommendations](continuous-export.md#manual-one-time-export-of-alerts-and-recommendations).



### Recommendations page now includes multiple views

The recommendations page now has two tabs to provide alternate ways to view the recommendations relevant to your resources:

- **Secure score recommendations** - Use this tab to view the list of recommendations grouped by security control. Learn more about these controls in [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).
- **All recommendations** - Use this tab to view the list of recommendations as a flat list. This tab is also great for understanding which initiative (including regulatory compliance standards) generated the recommendation. Learn more about initiatives and their relationship to recommendations in [What are security policies, initiatives, and recommendations?](security-policy-concept.md).

:::image type="content" source="media/release-notes/recommendations-tabs.png" alt-text="Tabs to change the view of the recommendations list in Azure Security Center.":::

## July 2021

Updates in July include:

- [Azure Sentinel connector now includes optional bi-directional alert synchronization (in preview)](#azure-sentinel-connector-now-includes-optional-bi-directional-alert-synchronization-in-preview)
- [Logical reorganization of Azure Defender for Resource Manager alerts](#logical-reorganization-of-azure-defender-for-resource-manager-alerts)                                           
- [Enhancements to recommendation to enable Azure Disk Encryption (ADE)](#enhancements-to-recommendation-to-enable-azure-disk-encryption-ade)                                     
- [Continuous export of secure score and regulatory compliance data released for general availability (GA)](#continuous-export-of-secure-score-and-regulatory-compliance-data-released-for-general-availability-ga)
- [Workflow automations can be triggered by changes to regulatory compliance assessments (GA)](#workflow-automations-can-be-triggered-by-changes-to-regulatory-compliance-assessments-ga)
- [Assessments API field 'FirstEvaluationDate' and 'StatusChangeDate' now available in workspace schemas and logic apps](#assessments-api-field-firstevaluationdate-and-statuschangedate-now-available-in-workspace-schemas-and-logic-apps)
- ['Compliance over time' workbook template added to Azure Monitor Workbooks gallery](#compliance-over-time-workbook-template-added-to-azure-monitor-workbooks-gallery)

### Azure Sentinel connector now includes optional bi-directional alert synchronization (in preview)

Security Center natively integrates with [Azure Sentinel](../sentinel/index.yml), Azure's cloud-native SIEM and SOAR solution. 

Azure Sentinel includes built-in connectors for Azure Security Center at the subscription and tenant levels. Learn more in [Stream alerts to Azure Sentinel](export-to-siem.md#stream-alerts-to-azure-sentinel).

When you connect Azure Defender to Azure Sentinel, the status of Azure Defender alerts that get ingested into Azure Sentinel is synchronized between the two services. So, for example, when an alert is closed in Azure Defender, that alert will display as closed in Azure Sentinel as well. Changing the status of an alert in Azure Defender "won't"* affect the status of any Azure Sentinel **incidents** that contain the synchronized Azure Sentinel alert, only that of the synchronized alert itself.

Enabling this preview feature, **bi-directional alert synchronization**, will automatically sync the status of the original Azure Defender alerts with Azure Sentinel incidents that contain the copies of those Azure Defender alerts. So, for example, when an Azure Sentinel incident containing an Azure Defender alert is closed, Azure Defender will automatically close the corresponding original alert.

Learn more in [Connect Azure Defender alerts from Azure Security Center](../sentinel/connect-azure-security-center.md).

### Logical reorganization of Azure Defender for Resource Manager alerts

The alerts listed below were provided as part of the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) plan.

As part of a logical reorganization of some of the Azure Defender plans, we've moved some alerts from **Azure Defender for Resource Manager** to **Azure Defender for servers**.

The alerts are organized according to two main principles:

- Alerts that provide control-plane protection - across many Azure resource types - are part of Azure Defender for Resource Manager
- Alerts that protect specific workloads are in the Azure Defender plan that relates to the corresponding workload

These are the alerts that were part of Azure Defender for Resource Manager, and which, as a result of this change, are now part of Azure Defender for servers:

- ARM_AmBroadFilesExclusion
- ARM_AmDisablementAndCodeExecution
- ARM_AmDisablement
- ARM_AmFileExclusionAndCodeExecution
- ARM_AmTempFileExclusionAndCodeExecution
- ARM_AmTempFileExclusion
- ARM_AmRealtimeProtectionDisabled
- ARM_AmTempRealtimeProtectionDisablement
- ARM_AmRealtimeProtectionDisablementAndCodeExec
- ARM_AmMalwareCampaignRelatedExclusion
- ARM_AmTemporarilyDisablement
- ARM_UnusualAmFileExclusion
- ARM_CustomScriptExtensionSuspiciousCmd
- ARM_CustomScriptExtensionSuspiciousEntryPoint
- ARM_CustomScriptExtensionSuspiciousPayload
- ARM_CustomScriptExtensionSuspiciousFailure
- ARM_CustomScriptExtensionUnusualDeletion
- ARM_CustomScriptExtensionUnusualExecution
- ARM_VMAccessUnusualConfigReset
- ARM_VMAccessUnusualPasswordReset
- ARM_VMAccessUnusualSSHReset

Learn more about the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for servers](defender-for-servers-introduction.md) plans.


### Enhancements to recommendation to enable Azure Disk Encryption (ADE)

Following user feedback, we've renamed the recommendation **Disk encryption should be applied on virtual machines**.

The new recommendation uses the same assessment ID and is called **Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources**.

The description has also been updated to better explain the purpose of this hardening recommendation:

| Recommendation                                                                                               | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             | Severity |
|--------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------:|
| **Virtual machines should encrypt temp disks, caches, and data flows between Compute and Storage resources** | By default, a virtual machine’s OS and data disks are encrypted-at-rest using platform-managed keys; temp disks and data caches aren’t encrypted, and data isn’t encrypted when flowing between compute and storage resources. For a comparison of different disk encryption technologies in Azure, see https://aka.ms/diskencryptioncomparison.<br>Use Azure Disk Encryption to encrypt all this data. Disregard this recommendation if: (1) you’re using the encryption-at-host feature, or (2) server-side encryption on Managed Disks meets your security requirements. Learn more in Server-side encryption of Azure Disk Storage. | High     |
|                                                                                                              |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |          |


### Continuous export of secure score and regulatory compliance data released for general availability (GA)

[Continuous export](continuous-export.md) provides the mechanism for exporting your security alerts and recommendations for tracking with other monitoring tools in your environment.

When you set up your continuous export, you configure what is exported, and where it will go. Learn more in the [overview of continuous export](continuous-export.md).

We've enhanced and expanded this feature over time:

- In November 2020, we added the **preview** option to stream changes to your **secure score**.<br/>For full details, see [Secure score is now available in continuous export (preview)](release-notes-archive.md#secure-score-is-now-available-in-continuous-export-preview).

- In December 2020, we added the **preview** option to stream changes to your **regulatory compliance assessment data**.<br/>For full details, see [Continuous export gets new data types (preview)](release-notes-archive.md#continuous-export-gets-new-data-types-and-improved-deployifnotexist-policies).

With this update, these two options are released for general availability (GA). 


### Workflow automations can be triggered by changes to regulatory compliance assessments (GA)

In February 2021, we added a **preview** third data type to the trigger options for your workflow automations: changes to regulatory compliance assessments. Learn more in [Workflow automations can be triggered by changes to regulatory compliance assessments](release-notes-archive.md#workflow-automations-can-be-triggered-by-changes-to-regulatory-compliance-assessments-in-preview).

With this update, this trigger option is released for general availability (GA).

Learn how to use the workflow automation tools in [Automate responses to Security Center triggers](workflow-automation.md).

:::image type="content" source="media/release-notes/regulatory-compliance-triggers-workflow-automation.png" alt-text="Using changes to regulatory compliance assessments to trigger a workflow automation." lightbox="media/release-notes/regulatory-compliance-triggers-workflow-automation.png":::

### Assessments API field 'FirstEvaluationDate' and 'StatusChangeDate' now available in workspace schemas and logic apps

In May 2021, we updated the Assessment API with two new fields, **FirstEvaluationDate** and **StatusChangeDate**. For full details, see [Assessments API expanded with two new fields](#assessments-api-expanded-with-two-new-fields).

Those fields were accessible through the REST API, Azure Resource Graph, continuous export, and in CSV exports.

With this change, we're making the information available in the Log Analytics workspace schema and from logic apps.


### 'Compliance over time' workbook template added to Azure Monitor Workbooks gallery

In March, we announced the integrated Azure Monitor Workbooks experience in Security Center (see [Azure Monitor Workbooks integrated into Security Center and three templates provided](release-notes-archive.md#azure-monitor-workbooks-integrated-into-security-center-and-three-templates-provided)).

The initial release included three templates to build dynamic and visual reports about your organization's security posture.

We've now added a workbook dedicated to tracking a subscription's compliance with the regulatory or industry standards applied to it. 

Learn about using these reports or building your own in [Create rich, interactive reports of Security Center data](custom-dashboards-azure-workbooks.md).

:::image type="content" source="media/custom-dashboards-azure-workbooks/compliance-over-time-details.png" alt-text="Azure Security Center's compliance over time workbook":::


## June 2021

Updates in June include:

- [New alert for Azure Defender for Key Vault](#new-alert-for-azure-defender-for-key-vault)
- [Recommendations to encrypt with customer-managed keys (CMKs) disabled by default](#recommendations-to-encrypt-with-customer-managed-keys-cmks-disabled-by-default)
- [Prefix for Kubernetes alerts changed from "AKS_" to "K8S_"](#prefix-for-kubernetes-alerts-changed-from-aks_-to-k8s_)
- [Deprecated two recommendations from "Apply system updates" security control](#deprecated-two-recommendations-from-apply-system-updates-security-control)


### New alert for Azure Defender for Key Vault

To expand the threat protections provided by Azure Defender for Key Vault, we've added the following alert:

| Alert (alert type)                                                                 | Description                                                                                                                                                                                                                                                                                                                                                      | MITRE tactic | Severity |
|------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:--------------------------------------------:|----------|
| Access from a suspicious IP address to a key vault<br>(KV_SuspiciousIPAccess)  | A key vault has been successfully accessed by an IP that has been identified by Microsoft Threat Intelligence as a suspicious IP address. This may indicate that your infrastructure has been compromised. We recommend further investigation. Learn more about [Microsoft's threat intelligence capabilities](https://go.microsoft.com/fwlink/?linkid=2128684). | Credential Access                            | Medium   |
|||

For more information, see:
- [Introduction to Azure Defender for Key Vault](defender-for-resource-manager-introduction.md)
- [Respond to Azure Defender for Key Vault alerts](defender-for-key-vault-usage.md)
- [List of alerts provided by Azure Defender for Key Vault](alerts-reference.md#alerts-azurekv)


### Recommendations to encrypt with customer-managed keys (CMKs) disabled by default

Security Center includes multiple recommendations to encrypt data at rest with customer-managed keys, such as:

- Container registries should be encrypted with a customer-managed key (CMK)
- Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest
- Azure Machine Learning workspaces should be encrypted with a customer-managed key (CMK)

Data in Azure is encrypted automatically using platform-managed keys, so the use of customer-managed keys should only be applied when required for compliance with a specific policy your organization is choosing to enforce.

With this change, the recommendations to use CMKs are now **disabled by default**. When relevant for your organization, you can enable them by changing the *Effect* parameter for the corresponding security policy to **AuditIfNotExists** or **Enforce**. Learn more in [Enable a security policy](tutorial-security-policy.md#enable-a-security-policy).

This change is reflected in the names of the recommendation with a new prefix, **[Enable if required]**, as shown in the following examples:

- [Enable if required] Storage accounts should use customer-managed key to encrypt data at rest
- [Enable if required] Container registries should be encrypted with a customer-managed key (CMK)
- [Enable if required] Azure Cosmos DB accounts should use customer-managed keys to encrypt data at rest

:::image type="content" source="media/upcoming-changes/customer-managed-keys-disabled.png" alt-text="Security Center's CMK recommendations will be disabled by default." lightbox="media/upcoming-changes/customer-managed-keys-disabled.png":::


### Prefix for Kubernetes alerts changed from "AKS_" to "K8S_"

Azure Defender for Kubernetes recently expanded to protect Kubernetes clusters hosted on-premises and in multi cloud environments. Learn more in [Use Azure Defender for Kubernetes to protect hybrid and multi-cloud Kubernetes deployments (in preview)](release-notes-archive.md#use-azure-defender-for-kubernetes-to-protect-hybrid-and-multi-cloud-kubernetes-deployments-in-preview).

To reflect the fact that the security alerts provided by Azure Defender for Kubernetes are no longer restricted to clusters on Azure Kubernetes Service, we've changed the prefix for the alert types from "AKS_" to "K8S_". Where necessary, the names and descriptions were updated too. For example, this alert:

|Alert (alert type)|Description|
|----|----|
|Kubernetes penetration testing tool detected<br>(**AKS**_PenTestToolsKubeHunter)|Kubernetes audit log analysis detected usage of Kubernetes penetration testing tool in the **AKS** cluster. While this behavior can be legitimate, attackers might use such public tools for malicious purposes.
|||

was changed to:

|Alert (alert type)|Description|
|----|----|
|Kubernetes penetration testing tool detected<br>(**K8S**_PenTestToolsKubeHunter)|Kubernetes audit log analysis detected usage of Kubernetes penetration testing tool in the **Kubernetes** cluster. While this behavior can be legitimate, attackers might use such public tools for malicious purposes.|
|||

Any suppression rules that refer to alerts beginning "AKS_" were automatically converted. If you've setup SIEM exports, or custom automation scripts that refer to Kubernetes alerts by alert type, you'll need to update them with the new alert types.

For a full list of the Kubernetes alerts, see [Alerts for Kubernetes clusters](alerts-reference.md#alerts-k8scluster).

### Deprecated two recommendations from "Apply system updates" security control

The following two recommendations were deprecated:

- **OS version should be updated for your cloud service roles** - By default, Azure periodically updates your guest OS to the latest supported image within the OS family that you've specified in your service configuration (.cscfg), such as Windows Server 2016.
- **Kubernetes Services should be upgraded to a non-vulnerable Kubernetes version** - This recommendation's evaluations aren't as wide-ranging as we'd like them to be. We plan to replace the recommendation with an enhanced version that's better aligned with your security needs.


## May 2021

Updates in May include:

- [Azure Defender for DNS and Azure Defender for Resource Manager released for general availability (GA)](#azure-defender-for-dns-and-azure-defender-for-resource-manager-released-for-general-availability-ga)
- [Azure Defender for open-source relational databases released for general availability (GA)](#azure-defender-for-open-source-relational-databases-released-for-general-availability-ga)
- [New alerts for Azure Defender for Resource Manager](#new-alerts-for-azure-defender-for-resource-manager)
- [CI/CD vulnerability scanning of container images with GitHub workflows and Azure Defender (preview)](#cicd-vulnerability-scanning-of-container-images-with-github-workflows-and-azure-defender-preview)
- [More Resource Graph queries available for some recommendations](#more-resource-graph-queries-available-for-some-recommendations)
- [SQL data classification recommendation severity changed](#sql-data-classification-recommendation-severity-changed)
- [New recommendations to enable trusted launch capabilities (in preview)](#new-recommendations-to-enable-trusted-launch-capabilities-in-preview)
- [New recommendations for hardening Kubernetes clusters (in preview)](#new-recommendations-for-hardening-kubernetes-clusters-in-preview)
- [Assessments API expanded with two new fields](#assessments-api-expanded-with-two-new-fields)
- [Asset inventory gets a cloud environment filter](#asset-inventory-gets-a-cloud-environment-filter)


### Azure Defender for DNS and Azure Defender for Resource Manager released for general availability (GA)

These two cloud-native breadth threat protection plans are now GA.

These new protections greatly enhance your resiliency against attacks from threat actors, and significantly increase the number of Azure resources protected by Azure Defender.

- **Azure Defender for Resource Manager** - automatically monitors all resource management operations performed in your organization. For more information, see:
    - [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
    - [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
    - [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)

- **Azure Defender for DNS** - continuously monitors all DNS queries from your Azure resources. For more information, see:
    - [Introduction to Azure Defender for DNS](defender-for-dns-introduction.md)
    - [Respond to Azure Defender for DNS alerts](defender-for-dns-usage.md)
    - [List of alerts provided by Azure Defender for DNS](alerts-reference.md#alerts-dns)

To simplify the process of enabling these plans, use the recommendations:

- **Azure Defender for Resource Manager should be enabled**
- **Azure Defender for DNS should be enabled**

> [!NOTE]
> Enabling Azure Defender plans results in charges. Learn about the pricing details per region on Security Center's pricing page: https://aka.ms/pricing-security-center.


### Azure Defender for open-source relational databases released for general availability (GA)

Azure Security Center expands its offer for SQL  protection with a new bundle to cover your open-source relational databases:

- **Azure Defender for Azure SQL database servers** - defends your Azure-native SQL Servers
- **Azure Defender for SQL servers on machines** - extends the same protections to your SQL servers in hybrid, multi-cloud, and on-premises environments
- **Azure Defender for open-source relational databases** - defends your Azure Databases for MySQL, PostgreSQL, and MariaDB single servers

Azure Defender for open-source relational databases constantly monitors your servers for security threats and detects anomalous database activities indicating potential threats to Azure Database for MySQL, PostgreSQL, and MariaDB. Some examples are:

- **Granular detection of brute force attacks** -  Azure Defender for open-source relational databases provides detailed information on attempted and successful brute force attacks. This lets you investigate and respond with a more complete understanding of the nature and status of the attack on your environment.
- **Behavioral alerts detection** - Azure Defender for open-source relational databases alerts you to suspicious and unexpected behaviors on your servers, such as changes in the access pattern to your database.
- **Threat intelligence-based detection** - Azure Defender applies Microsoft’s threat intelligence and vast knowledge base to surface threat alerts so you can act against them.

Learn more in [Introduction to Azure Defender for open-source relational databases](defender-for-databases-introduction.md).

### New alerts for Azure Defender for Resource Manager

To expand the threat protections provided by Azure Defender for Resource Manager, we've added the following alerts:

| Alert (alert type)                                                                                                                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                                              | MITRE tactics | Severity |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------:|----------|
|**Permissions granted for an RBAC role in an unusual way for your Azure environment (Preview)**<br>(ARM_AnomalousRBACRoleAssignment)|Azure Defender for Resource Manager detected an RBAC role assignment that's unusual when compared with other assignments performed by the same assigner /  performed for the same assignee / in your tenant due to the following anomalies: assignment time, assigner location, assigner, authentication method, assigned entities, client software used, assignment extent. This operation might have been performed by a legitimate user in your organization. Alternatively, it might indicate that an account in your organization was breached, and that the threat actor is trying to grant permissions to an additional user account they own.|Lateral Movement, Defense Evasion|Medium|
|**Privileged custom role created for your subscription in a suspicious way (Preview)**<br>(ARM_PrivilegedRoleDefinitionCreation)|Azure Defender for Resource Manager detected a suspicious creation of privileged custom role definition in your subscription. This operation might have been performed by a legitimate user in your organization. Alternatively, it might indicate that an account in your organization was breached, and that the threat actor is trying to create a privileged role to use in the future to evade detection.|Lateral Movement, Defense Evasion|Low|
|**Azure Resource Manager operation from suspicious IP address (Preview)**<br>(ARM_OperationFromSuspiciousIP)|Azure Defender for Resource Manager detected an operation from an IP address that has been marked as suspicious in threat intelligence feeds.|Execution|Medium|
|**Azure Resource Manager operation from suspicious proxy IP address (Preview)**<br>(ARM_OperationFromSuspiciousProxyIP)|Azure Defender for Resource Manager detected a resource management operation from an IP address that is associated with proxy services, such as TOR. While this behavior can be legitimate, it's often seen in malicious activities, when threat actors try to hide their source IP.|Defense Evasion|Medium|
||||

For more information, see:
- [Introduction to Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md)
- [Respond to Azure Defender for Resource Manager alerts](defender-for-resource-manager-usage.md)
- [List of alerts provided by Azure Defender for Resource Manager](alerts-reference.md#alerts-resourcemanager)


### CI/CD vulnerability scanning of container images with GitHub workflows and Azure Defender (preview)

Azure Defender for container registries now provides DevSecOps teams observability into GitHub Action workflows.

The new vulnerability scanning feature for container images, utilizing Trivy, helps your developers scan for common vulnerabilities in their container images *before* pushing images to container registries.

Container scan reports are summarized in Azure Security Center, providing security teams better insight and understanding about the source of vulnerable container images and the workflows and repositories from where they originate.

Learn more in [Identify vulnerable container images in your CI/CD workflows](defender-for-container-registries-cicd.md).

### More Resource Graph queries available for some recommendations

All of Security Center's recommendations have the option to view the information about the status of affected resources using Azure Resource Graph from the **Open query**. For full details about this powerful feature, see [Review recommendation data in Azure Resource Graph Explorer (ARG)](security-center-recommendations.md#review-recommendation-data-in-azure-resource-graph-explorer-arg).

Security Center includes built-in vulnerability scanners to scan your VMs, SQL servers and their hosts, and container registries for security vulnerabilities. The findings are returned as recommendations with all the individual findings for each resource type gathered into a single view. The recommendations are:

- Vulnerabilities in Azure Container Registry images should be remediated (powered by Qualys)
- Vulnerabilities in your virtual machines should be remediated
- SQL databases should have vulnerability findings resolved
- SQL servers on machines should have vulnerability findings resolved

With this change, you can use the **Open query** button to also open the query showing the security findings.

:::image type="content" source="media/release-notes/open-query-menu-security-findings.png" alt-text="The open query button now offers options for a deeper query showing the security findings for vulnerability scanner-related recommendations.":::

The **Open query** button offers additional options for some other recommendations where relevant.

Learn more about Security Center's vulnerability scanners:

- [Azure Defender's integrated Qualys vulnerability scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md)
- [Azure Defender's integrated vulnerability assessment scanner for SQL servers](defender-for-sql-on-machines-vulnerability-assessment.md)
- [Azure Defender's integrated vulnerability assessment scanner for container registries](defender-for-container-registries-usage.md)

### SQL data classification recommendation severity changed

The severity of the recommendation **Sensitive data in your SQL databases should be classified** has been changed from **High** to **Low**.

This is part of the ongoing changes to this recommendation announced in [Enhancements to recommendation to classify sensitive data in SQL databases](upcoming-changes.md#enhancements-to-recommendation-to-classify-sensitive-data-in-sql-databases).

### New recommendations to enable trusted launch capabilities (in preview)

Azure offers trusted launch as a seamless way to improve the security of [generation 2](../virtual-machines/generation-2.md) VMs. Trusted launch protects against advanced and persistent attack techniques. Trusted launch is composed of several, coordinated infrastructure technologies that can be enabled independently. Each technology provides another layer of defense against sophisticated threats. Learn more in [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md).

> [!IMPORTANT]
> Trusted launch requires the creation of new virtual machines. You can't enable trusted launch on existing virtual machines that were initially created without it.
> 
> Trusted launch is currently in public preview. The preview is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

Security Center's recommendation, **vTPM should be enabled on supported virtual machines**, ensures your Azure VMs are using a vTPM. This virtualized version of a hardware Trusted Platform Module enables attestation by measuring the entire boot chain of your VM (UEFI, OS, system, and drivers).

With the vTPM enabled, the **Guest Attestation extension** can remotely validate the secure boot. The following recommendations ensure this extension is deployed:

- **Secure Boot should be enabled on supported Windows virtual machines**
- **Guest Attestation extension should be installed on supported Windows virtual machines**
- **Guest Attestation extension should be installed on supported Windows virtual machine scale sets**
- **Guest Attestation extension should be installed on supported Linux virtual machines**
- **Guest Attestation extension should be installed on supported Linux virtual machine scale sets**

Learn more in [Trusted launch for Azure virtual machines](../virtual-machines/trusted-launch.md). 

### New recommendations for hardening Kubernetes clusters (in preview)

The following recommendations allow you to further harden your Kubernetes clusters

- **Kubernetes clusters should not use the default namespace** - To protect against unauthorized access for ConfigMap, Pod, Secret, Service, and ServiceAccount resource types, prevent usage of the default namespace in Kubernetes clusters.
- **Kubernetes clusters should disable automounting API credentials** - To prevent a potentially compromised Pod resource from running API commands against Kubernetes clusters, disable automounting API credentials.
- **Kubernetes clusters should not grant CAPSYSADMIN security capabilities**

Learn how Security Center can protect your containerized environments in [Container security in Security Center](container-security.md).

### Assessments API expanded with two new fields

We've added the following two fields to the [Assessments REST API](/rest/api/securitycenter/assessments):

- **FirstEvaluationDate** – The time that the recommendation was created and first evaluated. Returned as UTC time in ISO 8601 format.
- **StatusChangeDate** – The time that the status of the recommendation last changed. Returned as UTC time in ISO 8601 format.

The initial default value for these fields - for all recommendations - is `2021-03-14T00:00:00+0000000Z`.

To access this information, you can use any of the methods in the table below.

| Tool                 | Details                                                                                                                                                                |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| REST API call        | GET https://management.azure.com/subscriptions/<SUBSCRIPTION_ID>/providers/Microsoft.Security/assessments?api-version=2019-01-01-preview&$expand=statusEvaluationDates |
| Azure Resource Graph | `securityresources`<br>`where type == "microsoft.security/assessments"`                                                                                                |
| Continuous export    | The two dedicated fields will be available the Log Analytics workspace data                                                                                            |
| [CSV export](continuous-export.md#manual-one-time-export-of-alerts-and-recommendations) | The two fields are included in the CSV files                                                        |
|                      |                                                                                                                                                                        |


Learn more about the [Assessments REST API](/rest/api/securitycenter/assessments).


### Asset inventory gets a cloud environment filter

Security Center's asset inventory page offers many filters to quickly refine the list of resources displayed. Learn more in [Explore and manage your resources with asset inventory](asset-inventory.md).

A new filter offers the option to refine the list according to the cloud accounts you've connected with Security Center's multi-cloud features:

:::image type="content" source="media/asset-inventory/filter-environment.png" alt-text="Inventory's environment filter":::

Learn more about the multi-cloud capabilities:

- [Connect your AWS accounts to Azure Security Center](quickstart-onboard-aws.md)
- [Connect your GCP accounts to Azure Security Center](quickstart-onboard-gcp.md)
