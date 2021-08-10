---
title: Release notes for Azure Security Center
description: A description of what's new and changed in Azure Security Center
author: memildin
manager: rkarlin
ms.service: security-center
ms.topic: reference
ms.date: 08/10/2021
ms.author: memildin

---

# What's new in Azure Security Center?

Security Center is in active development and receives improvements on an ongoing basis. To stay up to date with the most recent developments, this page provides you with information about new features, bug fixes, and deprecated functionality.

This page is updated frequently, so revisit it often. 

To learn about *planned* changes that are coming soon to Security Center, see [Important upcoming changes to Azure Security Center](upcoming-changes.md). 

> [!TIP]
> If you're looking for items older than six months, you'll find them in the [Archive for What's new in Azure Security Center](release-notes-archive.md).

## August 2021

Updates in August include:

- [Microsoft Defender for Endpoint for Linux now supported by Azure Defender for servers (in preview)](#microsoft-defender-for-endpoint-for-linux-now-supported-by-azure-defender-for-servers-in-preview)
- [Two new recommendations for managing endpoint protection solutions (in preview)](#two-new-recommendations-for-managing-endpoint-protection-solutions-in-preview)
- [Built-in troubleshooting and guidance for solving common issues](#built-in-troubleshooting-and-guidance-for-solving-common-issues)
- [Regulatory compliance dashboard's Azure Audit reports released for general availability (GA)](#regulatory-compliance-dashboards-azure-audit-reports-released-for-general-availability-ga)
- [Deprecate recommendation 'Log Analytics agent health issues should be resolved on your machines'](#deprecated-recommendation-log-analytics-agent-health-issues-should-be-resolved-on-your-machines)

### Microsoft Defender for Endpoint for Linux now supported by Azure Defender for servers (in preview)

[Azure Defender for servers](defender-for-servers-introduction.md) includes an integrated license for [Microsoft Defender for Endpoint](https://www.microsoft.com/microsoft-365/security/endpoint-defender). Together, they provide comprehensive endpoint detection and response (EDR) capabilities.

When Defender for Endpoint detects a threat, it triggers an alert. The alert is shown in Security Center. From Security Center, you can also pivot to the Defender for Endpoint console, and perform a detailed investigation to uncover the scope of the attack.

During the preview period, you'll deploy the [Defender for Endpoint for Linux](/microsoft-365/security/defender-endpoint/microsoft-defender-endpoint-linux) sensor to supported Linux machines in one of two ways depending on whether you've already deployed it to your Windows machines:

- [Existing users of Azure Defender and Microsoft Defender for Endpoint for Windows](security-center-wdatp.md?tabs=linux#existing-users-of-azure-defender-and-microsoft-defender-for-endpoint-for-windows)
- [New users who have never enabled the integration with Microsoft Defender for Endpoint for Windows](security-center-wdatp.md?tabs=linux#new-users-whove-never-enabled-the-integration-with-microsoft-defender-for-endpoint-for-windows)

Learn more in [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](security-center-wdatp.md).

### Two new recommendations for managing endpoint protection solutions (in preview)

We've added two **preview** recommendations to deploy and maintain the endpoint protection solutions on your machines. Both recommendations include support for Azure virtual machines and machines connected to Azure Arc enabled servers.

|Recommendation |Description |Severity |
|---|---|---|
|[Endpoint protection should be installed on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/4fb67663-9ab9-475d-b026-8c544cced439) |To protect your machines from threats and vulnerabilities, install a supported endpoint protection solution.  <br> <a href="/azure/security-center/security-center-endpoint-protection">Learn more about how Endpoint Protection for machines is evaluated.</a><br />(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)) |High |
|[Endpoint protection health issues should be resolved on your machines](https://portal.azure.com/#blade/Microsoft_Azure_Security/RecommendationsBlade/assessmentKey/37a3689a-818e-4a0e-82ac-b1392b9bb000) |Resolve endpoint protection health issues on your virtual machines to protect them from latest threats and vulnerabilities. Azure Security Center supported endpoint protection solutions are documented [here](./security-center-services.md?tabs=features-windows#supported-endpoint-protection-solutions). Endpoint protection assessment is documented <a href='/azure/security-center/security-center-endpoint-protection'>here</a>.<br />(Related policy: [Monitor missing Endpoint Protection in Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2fproviders%2fMicrosoft.Authorization%2fpolicyDefinitions%2faf6cd1bd-1635-48cb-bde7-5b15693900b9)) |Medium |
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

Learn more about the [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for servers](defender-for-servers-introduction.md).


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

In March, we announced the integrated Azure Monitor Workbooks experience in Security Center (see [Azure Monitor Workbooks integrated into Security Center and three templates provided](#azure-monitor-workbooks-integrated-into-security-center-and-three-templates-provided)).

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

Azure Defender for Kubernetes recently expanded to protect Kubernetes clusters hosted on-premises and in multi cloud environments. Learn more in [Use Azure Defender for Kubernetes to protect hybrid and multi-cloud Kubernetes deployments (in preview)](release-notes.md#use-azure-defender-for-kubernetes-to-protect-hybrid-and-multi-cloud-kubernetes-deployments-in-preview).

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

:::image type="content" source="media/release-notes/open-query-menu-security-findings.png" alt-text="The open query button now offers options for a deeper query showing the security findings for vulnerability scanner related recommendations.":::

The **Open query** button offers additional options for some other recommendations too where relevant.

Learn more about Security Center's vulnerability scanners:

- [Azure Defender's integrated vulnerability assessment scanner for Azure and hybrid machines](deploy-vulnerability-assessment-vm.md)
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


## April 2021

Updates in April include:
- [Refreshed resource health page (in preview)](#refreshed-resource-health-page-in-preview)
- [Container registry images that have been recently pulled are now rescanned weekly (released for general availability (GA))](#container-registry-images-that-have-been-recently-pulled-are-now-rescanned-weekly-released-for-general-availability-ga)
- [Use Azure Defender for Kubernetes to protect hybrid and multi-cloud Kubernetes deployments (in preview)](#use-azure-defender-for-kubernetes-to-protect-hybrid-and-multi-cloud-kubernetes-deployments-in-preview)
- [Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 Virtual Desktop (WVD) released for general availability (GA)](#microsoft-defender-for-endpoint-integration-with-azure-defender-now-supports-windows-server-2019-and-windows-10-virtual-desktop-wvd-released-for-general-availability-ga)
- [Recommendations to enable Azure Defender for DNS and Resource Manager (in preview)](#recommendations-to-enable-azure-defender-for-dns-and-resource-manager-in-preview)
- [Three regulatory compliance standards added: Azure CIS 1.3.0, CMMC Level 3, and New Zealand ISM Restricted](#three-regulatory-compliance-standards-added-azure-cis-130-cmmc-level-3-and-new-zealand-ism-restricted)
- [Four new recommendations related to guest configuration (in preview)](#four-new-recommendations-related-to-guest-configuration-in-preview)
- [CMK recommendations moved to best practices security control](#cmk-recommendations-moved-to-best-practices-security-control)
- [11 Azure Defender alerts deprecated](#11-azure-defender-alerts-deprecated)
- [Two recommendations from "Apply system updates" security control were deprecated](#two-recommendations-from-apply-system-updates-security-control-were-deprecated)
- [Azure Defender for SQL on machine tile removed from Azure Defender dashboard](#azure-defender-for-sql-on-machine-tile-removed-from-azure-defender-dashboard)
- [21 recommendations moved between security controls](#21-recommendations-moved-between-security-controls)

### Refreshed resource health page (in preview)

Security Center's resource health has been expanded, enhanced, and improved to provide a snapshot view of the overall health of a single resource. 

You can review detailed information about the resource and all recommendations that apply to that resource. Also, if you're using [Azure Defender](azure-defender.md), you can see outstanding security alerts for that specific resource too.

To open the resource health page for a resource, select any resource from the [asset inventory page](asset-inventory.md).

This preview page in Security Center's portal pages shows:

1. **Resource information** - The resource group and subscription it's attached to, the geographic location, and more.
1. **Applied security feature** - Whether Azure Defender is enabled for the resource.
1. **Counts of outstanding recommendations and alerts** - The number of outstanding security recommendations and Azure Defender alerts.
1. **Actionable recommendations and alerts** - Two tabs list the recommendations and alerts that apply to the resource.

:::image type="content" source="media/investigate-resource-health/resource-health-page-virtual-machine.gif" alt-text="Azure Security Center's resource health page showing the health information for a virtual machine":::

Learn more in [Tutorial: Investigate the health of your resources](investigate-resource-health.md).


### Container registry images that have been recently pulled are now rescanned weekly (released for general availability (GA))

Azure Defender for container registries includes a built-in vulnerability scanner. This scanner immediately scans any image you push to your registry and any image pulled within the last 30 days.

New vulnerabilities are discovered every day. With this update, container images that were pulled from your registries during the last 30 days will be **rescanned** every week. This ensures that newly discovered vulnerabilities are identified in your images.

Scanning is charged on a per image basis, so there's no additional charge for these rescans.

Learn more about this scanner in [Use Azure Defender for container registries to scan your images for vulnerabilities](defender-for-container-registries-usage.md).


### Use Azure Defender for Kubernetes to protect hybrid and multi-cloud Kubernetes deployments (in preview)

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


### Microsoft Defender for Endpoint integration with Azure Defender now supports Windows Server 2019 and Windows 10 Virtual Desktop (WVD) released for general availability (GA)

Microsoft Defender for Endpoint is a holistic, cloud delivered endpoint security solution. It provides risk-based vulnerability management and assessment as well as endpoint detection and response (EDR). For a full list of the benefits of using Defender for Endpoint together with Azure Security Center, see [Protect your endpoints with Security Center's integrated EDR solution: Microsoft Defender for Endpoint](security-center-wdatp.md).

When you enable Azure Defender for servers on a Windows server, a license for Defender for Endpoint is included with the plan. If you've already enabled Azure Defender for servers and you have Windows 2019 servers in your subscription, they'll automatically receive Defender for Endpoint with this update. No manual action is required. 

Support has now been expanded to include Windows Server 2019 and [Windows Virtual Desktop (WVD)](../virtual-desktop/overview.md).

> [!NOTE]
> If you're enabling Defender for Endpoint on a Windows Server 2019 machine, ensure it meets the prerequisites described in [Enable the Microsoft Defender for Endpoint integration](security-center-wdatp.md#enable-the-microsoft-defender-for-endpoint-integration).


### Recommendations to enable Azure Defender for DNS and Resource Manager (in preview)

Two new recommendations have been added to simplify the process of enabling [Azure Defender for Resource Manager](defender-for-resource-manager-introduction.md) and [Azure Defender for DNS](defender-for-dns-introduction.md):

- **Azure Defender for Resource Manager should be enabled** - Defender for Resource Manager automatically monitors the resource management operations in your organization. Azure Defender detects threats and alerts you about suspicious activity.
- **Azure Defender for DNS should be enabled** - Defender for DNS provides an additional layer of protection for your cloud resources by continuously monitoring all DNS queries from your Azure resources. Azure Defender alerts you about suspicious activity at the DNS layer.

Enabling Azure Defender plans results in charges. Learn about the pricing details per region on Security Center's pricing page: https://aka.ms/pricing-security-center.

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

### Four new recommendations related to guest configuration (in preview)

Azure's [Guest Configuration extension](../governance/policy/concepts/guest-configuration.md) reports to Security Center to help ensure your virtual machines' in-guest settings are hardened. The extension isn't required for Arc enabled servers because it's included in the Arc Connected Machine agent. The extension requires a system-managed identity on the machine.

We've added four new recommendations to Security Center to make the most of this extension.

- Two recommendations prompt you to install the extension and its required system-managed identity:
    - **Guest Configuration extension should be installed on your machines**
    - **Virtual machines' Guest Configuration extension should be deployed with system-assigned managed identity**

- When the extension is installed and running, it will begin auditing your machines and you'll be prompted to harden settings such as configuration of the operating system and environment settings. These two recommendations will prompt you to harden your Windows and Linux machines as described:
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

The 11 Azure Defender alerts listed below have been deprecated.

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


### 21 recommendations moved between security controls 

The following recommendations were moved to different security controls. Security controls are logical groups of related security recommendations, and reflect your vulnerable attack surfaces. This move ensures that each of these recommendations is in the most appropriate control to meet its objective.

Learn which recommendations are in each security control in [Security controls and their recommendations](secure-score-security-controls.md#security-controls-and-their-recommendations).

|Recommendation |Change and impact  |
|---------|---------|
|Vulnerability assessment should be enabled on your SQL servers<br>Vulnerability assessment should be enabled on your SQL managed instances<br>Vulnerabilities on your SQL databases should be remediated new<br>Vulnerabilities on your SQL databases in VMs should be remediated     |Moving from Remediate vulnerabilities (worth 6 points)<br>to Remediate security configurations (worth 4 points).<br>Depending on your environment, these recommendations will have a reduced impact on your score.|
|There should be more than one owner assigned to your subscription<br>Automation account variables should be encrypted<br>IoT Devices - Auditd process stopped sending events<br>IoT Devices - Operating system baseline validation failure<br>IoT Devices - TLS cipher suite upgrade needed<br>IoT Devices - Open Ports On Device<br>IoT Devices - Permissive firewall policy in one of the chains was found<br>IoT Devices - Permissive firewall rule in the input chain was found<br>IoT Devices - Permissive firewall rule in the output chain was found<br>Diagnostic logs in IoT Hub should be enabled<br>IoT Devices - Agent sending underutilized messages<br>IoT Devices - Default IP Filter Policy should be Deny<br>IoT Devices - IP Filter rule large IP range<br>IoT Devices - Agent message intervals and size should be adjusted<br>IoT Devices - Identical Authentication Credentials<br>IoT Devices - Audited process stopped sending events<br>IoT Devices - Operating system (OS) baseline configuration should be fixed|Moving to **Implement security best practices**.<br>When a recommendation moves to the Implement security best practices security control, which is worth no points, the recommendation no longer affects your secure score.|
|||


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

You can use the new integration to start using the out-of-the-box templates from Security Center’s gallery. By using workbook templates, you can access and build dynamic and visual reports to track your organization’s security posture. Additionally, you can create new workbooks based on Security Center data or any other supported data types and quickly deploy community workbooks from Security Center's GitHub community.

Three templates reports are provided:

- **Secure Score Over Time** - Track your subscriptions' scores and changes to recommendations for your resources
- **System Updates** - View missing system updates by resources, OS, severity, and more
- **Vulnerability Assessment Findings** - View the findings of vulnerability scans of your Azure resources

Learn about using these reports or building your own in [Create rich, interactive reports of Security Center data](custom-dashboards-azure-workbooks.md).

:::image type="content" source="media/custom-dashboards-azure-workbooks/secure-score-over-time-snip.png" alt-text="Secure score over time report.":::


### Regulatory compliance dashboard now includes Azure Audit reports (preview)

From the regulatory compliance dashboard's toolbar, you can now download Azure and Dynamics certification reports. 

:::image type="content" source="media/release-notes/audit-reports-regulatory-compliance-dashboard.png" alt-text="Regulatory compliance dashboard's toolbar":::

You can select the tab for the relevant reports types (PCI, SOC, ISO, and others) and use filters to find the specific reports you need.

Learn more about [Managing the standards in your regulatory compliance dashboard](update-regulatory-compliance-packages.md).

:::image type="content" source="media/release-notes/audit-reports-list-regulatory-compliance-dashboard.png" alt-text="Filtering the list of available Azure Audit reports.":::



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

Security Center passes the data for almost all security recommendations to Azure Advisor, which in turn, writes it to [Azure activity log](../azure-monitor/essentials/activity-log.md).

For two recommendations, the data is simultaneously written directly to Azure activity log. With this change, Security Center stops writing data for these legacy security recommendations directly to activity Log. Instead, we're exporting the data to Azure Advisor as we do for all the other recommendations.

The two legacy recommendations are:
- Endpoint protection health issues should be resolved on your machines
- Vulnerabilities in security configuration on your machines should be remediated

If you've been accessing information for these two recommendations in activity log's "Recommendation of type TaskDiscovery" category, this is no longer available.


### Recommendations page enhancements 

We've released an improved version of the recommendations list to present more information at a glance.

Now on the page you'll see:

1. The maximum score and current score for each security control.
1. Icons replacing tags such as **Fix** and **Preview**.
1. A new column showing the [Policy initiative](security-policy-concept.md) related to each recommendation - visible when "Group by controls" is disabled.

:::image type="content" source="media/release-notes/recommendations-grid-enhancements.png" alt-text="Enhancements to Azure Security Center's recommendations page - March 2021" lightbox="media/release-notes/recommendations-grid-enhancements.png":::

:::image type="content" source="media/release-notes/recommendations-grid-enhancements-initiatives.png" alt-text="Enhancements to Azure Security Center's recommendations 'flat' list - March 2021" lightbox="media/release-notes/recommendations-grid-enhancements-initiatives.png":::

Learn more in [Security recommendations in Azure Security Center](security-center-recommendations.md).