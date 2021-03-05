---
title: Azure security baseline for Content Delivery Network
description: The Content Delivery Network security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: azure-cdn
ms.topic: conceptual
ms.date: 11/16/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Content Delivery Network

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Content Delivery Network. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Content Delivery Network. **Controls** not applicable to Content Delivery Network have been excluded.

To see how Content Delivery Network completely maps to the Azure Security Benchmark, see the [full Content Delivery Network security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: Restrict access to content on your Content Delivery Network by country or region. Create rules on specific paths on your CDN endpoint to allow or block content in selected countries or regions using the geo-filtering feature,

- [Restrict Azure CDN content by country or region](cdn-restrict-access-by-country.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Use Azure role-based access control (Azure RBAC) in Content Delivery Network to isolate access to business-critical systems by restricting which accounts are granted privileged access to the subscriptions and management groups they are in.

Also restrict access to the management, identity, and security systems that have administrative access to your business critical access such as Active Directory Domain Controllers (DCs), security tools, and system management tools with agents installed on business critical systems. Attackers who compromise these management and security systems can immediately weaponize them to compromise business critical assets.

All types of access controls should be aligned to your enterprise segmentation strategy to ensure consistent access-controls.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../governance/management-groups/overview.md#management-group-access) 

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### PA-6: Use privileged access workstations

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. Use highly secured user workstations and/or Azure Bastion for administrative tasks. Use Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), and/or Microsoft Intune to deploy a secure and managed user workstation for administrative tasks. The secured workstations can be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

- [Deploy a privileged access workstation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Content Delivery Network is integrated with Azure role-based access control (RBAC) to manage its resources. Use Azure RBAC to manage Azure resource access through role assignments. Assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. 

Limit the privileges you assign to resources through the Azure RBAC as required by the roles. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically. 

Additionally, use built-in roles to allocate permission and only create custom role when required.

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) 

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions, for them to monitor security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. However, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: that additional permissions may be required for visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Apply tags to your Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production.

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md) 

- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=%2fazure%2fazure-resource-manager%2fmanagement%2ftoc.json)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Use Azure Resource Graph to query for and discover resources within their subscriptions. You can also use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

**Guidance**: Content Data Network can not be used for ensuring security of assets in a lifecycle management process. It is the customer's responsibility to maintain attributes and network configurations of assets which are considered high-impact. It is recommended that the customer create a process to capture the attribute and network-configuration changes, measure the change-impact and create remediation tasks, as applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-data-protection.md).*

### LT-1: Enable threat detection for Azure resources

**Guidance**: Content Delivery Network does not provide native capabilities to monitor security threats related to its resources.

Forward any logs from Content Delivery Network to your Security Information and Event Management (SIEM) solution which can be used to set up custom threat detections. 

Monitoring different types of Azure assets for potential threats and anomalies with focus on getting high quality alerts to reduce false positives for analysts to sort through. Alerts can be sourced from log data, agents, or other data.

- [Create custom analytics rules to detect threats](../sentinel/tutorial-detect-threats-custom.md) 

- [Cyber threat intelligence with Azure Sentinel](/azure/architecture/example-scenario/data/sentinel-threat-intelligence)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### LT-3: Enable logging for Azure network activities

**Guidance**: Content Delivery Network is not intended to deploy into virtual networks, because of this you are unable to enable network security group flow logging, route traffic through a firewall or perform packet captures.

Content Delivery Network logs all network traffic that it processes for customer access. Enable the network flow capability within your deployed offering resources and configure these logs to be sent to a storage account for long term retention and auditing.

- [Tutorial -  How to setup diagnostic log in Azure Content Delivery Network](cdn-azure-diagnostic-logs.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### LT-4: Enable logging for Azure resources

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your Content Delivery Network resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

Enable Azure resource logs for CDN,  You can use Azure Security Center and Azure Policy to enable resource logs and log data collecting. These logs can be critical for later investigating security incidents and performing forensic exercises.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md) 

- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-controls-v2-incident-response.md).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organization has processes to respond to security incidents, has updated these processes for Azure, and is regularly exercising them to ensure readiness.

- [Implement security across the enterprise environment](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Incident response reference guide](/microsoft-365/downloads/IR-Reference-Guide.pdf)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-2: Preparation – setup incident notification

**Guidance**: Set up security incident contact information in Azure Security Center. This contact information is used by Microsoft to contact you if the Microsoft Security Response Center (MSRC) discovers that your data has been accessed by an unlawful or unauthorized party. You also have options to customize incident alert and notification in different Azure services based on your incident response needs. 

- [How to set the Azure Security Center security contact](../security-center/security-center-provide-security-contact-details.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### IR-3: Detection and analysis – create incidents based on high quality alerts

**Guidance**: Ensure you have a process to create high quality alerts and measure the quality of alerts. This allows you to learn lessons from past incidents and prioritize alerts for analysts, so they don’t waste time on false positives. 

High quality alerts can be built based on experience from past incidents, validated community sources, and tools designed to generate and clean up alerts by fusing and correlating diverse signal sources. 

Azure Security Center provides high quality alerts across many Azure assets. You can use the ASC data connector to stream the alerts to Azure Sentinel. Azure Sentinel lets you create advanced alert rules to generate incidents automatically for an investigation. 

Export your Azure Security Center alerts and recommendations using the export feature to help identify risks to Azure resources. Export alerts and recommendations either manually or in an ongoing, continuous fashion.

- [How to configure export](../security-center/continuous-export.md)

- [How to stream alerts into Azure Sentinel](../sentinel/connect-azure-security-center.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-4: Detection and analysis – investigate an incident

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents, to build a full view of what happened. Diverse logs should be collected to track the activities of a potential attacker across the kill chain to avoid blind spots.  You should also ensure insights and learnings are captured for other analysts and for future historical reference.  

The data sources for investigation include the centralized logging sources that are already being collected from the in-scope services and running systems, but can also include:

- Network data – use network security groups' flow logs, Azure Network Watcher, and Azure Monitor to capture network flow logs and other analytics information. 

- Snapshots of running systems: 

    - Use Azure virtual machine's snapshot capability to create a snapshot of the running system's disk. 

    - Use the operating system's native memory dump capability to create a snapshot of the running system's memory.

    - Use the snapshot feature of the Azure services or your software's own capability to create snapshots of the running systems.

Azure Sentinel provides extensive data analytics across virtually any log source and a case management portal to manage the full lifecycle of incidents. Intelligence information during an investigation can be associated with an incident for tracking and reporting purposes. 

- [Snapshot a Windows machine's disk](../virtual-machines/windows/snapshot-copy-managed-disk.md)

- [Snapshot a Linux machine's disk](../virtual-machines/linux/snapshot-copy-managed-disk.md)

- [Microsoft Azure Support diagnostic information and memory dump collection](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) 

- [Investigate incidents with Azure Sentinel](../sentinel/tutorial-investigate-cases.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### IR-5: Detection and analysis – prioritize incidents

**Guidance**: Provide context to analysts on which incidents to focus on first based on alert severity and asset sensitivity. 

Azure Security Center assigns a severity to each alert to help you prioritize which alerts should be investigated first. The severity is based on how confident Security Center is in the finding or the analytic used to issue the alert, as well as the confidence level that there was malicious intent behind the activity that led to the alert.

Additionally, mark resources using tags and create a naming system to identify and categorize Azure resources, especially those processing sensitive data.  It is your responsibility to prioritize the remediation of alerts based on the criticality of the Azure resources and environment where the incident occurred.

- [Security alerts in Azure Security Center](../security-center/security-center-alerts-overview.md)

- [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### IR-6: Containment, eradication and recovery – automate the incident handling

**Guidance**: Automate manual repetitive tasks to speed up response time and reduce the burden on analysts. Manual tasks take longer to execute, slowing each incident and reducing how many incidents an analyst can handle. Manual tasks also increase analyst fatigue, which increases the risk of human error that causes delays, and degrades the ability of analysts to focus effectively on complex tasks. 
Use workflow automation features in Azure Security Center and Azure Sentinel to automatically trigger actions or run a playbook to respond to incoming security alerts. The playbook takes actions, such as sending notifications, disabling accounts, and isolating problematic networks. 

- [Configure workflow automation in Security Center](../security-center/workflow-automation.md)

- [Set up automated threat responses in Azure Security Center](../security-center/tutorial-security-incident.md#triage-security-alerts)

- [Set up automated threat responses in Azure Sentinel](../sentinel/tutorial-respond-threats-playbook.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Posture and Vulnerability Management

*For more information, see the [Azure Security Benchmark: Posture and Vulnerability Management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md).*

### PV-3: Establish secure configurations for compute resources

**Guidance**: Not applicable; Content Delivery Network does not have provide any security configuration capabilities.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

### PV-7: Rapidly and automatically remediate software vulnerabilities

**Guidance**: Rapidly deploy software updates to remediate software vulnerabilities in operating systems and applications. 

Prioritize remediation using a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by your third-party scanning tool. Tailor to your environment using context of which applications present a high security risk and which ones require high uptime.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PV-8: Conduct regular attack simulation

**Guidance**: As required, conduct penetration testing or red team activities on your Azure resources and ensure remediation of all critical security findings.
Follow the Microsoft Cloud Penetration Testing Rules of Engagement to ensure your penetration tests are not in violation of Microsoft policies. Use Microsoft's strategy and execution of Red Teaming and live site penetration testing against Microsoft-managed cloud infrastructure, services, and applications.

- [Penetration testing in Azure](../security/fundamentals/pen-testing.md)

- [Penetration Testing Rules of Engagement](https://www.microsoft.com/msrc/pentest-rules-of-engagement?rtc=1) 

- [Microsoft Cloud Red Teaming](https://gallery.technet.microsoft.com/Cloud-Red-Teaming-b837392e)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Shared

## Governance and Strategy

*For more information, see the [Azure Security Benchmark: Governance and Strategy](../security/benchmarks/security-controls-v2-governance-strategy.md).*

### GS-1: Define asset management and data protection strategy 

**Guidance**: Ensure you document and communicate a clear strategy for continuous monitoring and protection of systems and data. Prioritize discovery, assessment, protection, and monitoring of business-critical data and systems. 

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Data classification standard in accordance with the business risks

-	Security organization visibility into risks and asset inventory 

-	Security organization approval of Azure services for use 

-	Security of assets through their lifecycle

-	Required access control strategy in accordance with organizational data classification

-	Use of Azure native and third party data protection capabilities

-	Data encryption requirements for in-transit and at-rest use cases

-	Appropriate cryptographic standards

More information is available at the referenced links.

- [Azure Security Architecture Recommendation - Storage, data, and encryption](/azure/architecture/framework/security/storage-data-encryption?bc=%2fsecurity%2fcompass%2fbreadcrumb%2ftoc.json&toc=%2fsecurity%2fcompass%2ftoc.json)

- [Azure Security Fundamentals - Azure Data security, encryption, and storage](../security/fundamentals/encryption-overview.md)

- [Cloud Adoption Framework - Azure data security and encryption best practices](../security/fundamentals/data-encryption-best-practices.md?bc=%2fazure%2fcloud-adoption-framework%2f_bread%2ftoc.json&toc=%2fazure%2fcloud-adoption-framework%2ftoc.json)

- [Azure Security Benchmark - Asset management](../security/benchmarks/security-controls-v2-asset-management.md)

- [Azure Security Benchmark - Data Protection](../security/benchmarks/security-controls-v2-data-protection.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-2: Define enterprise segmentation strategy 

**Guidance**: Establish an enterprise-wide strategy to segmenting access to assets using a combination of identity, network, application, subscription, management group, and other controls.

Carefully balance the need for security separation with the need to enable daily operation of the systems that need to communicate with each other and access data.

Ensure that the segmentation strategy is implemented consistently across control types including network security, identity and access models, and application permission/access models, and human process controls.

- [Guidance on segmentation strategy in Azure (video)](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151)

- [Guidance on segmentation strategy in Azure (document)](/security/compass/governance#enterprise-segmentation-strategy)

- [Align network segmentation with enterprise segmentation strategy](/security/compass/network-security-containment#align-network-segmentation-with-enterprise-segmentation-strategy)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-3: Define security posture management strategy

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, etc.

- [Azure Security Benchmark - Posture and vulnerability management](../security/benchmarks/security-controls-v2-posture-vulnerability-management.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-4: Align organization roles, responsibilities, and accountabilities

**Guidance**: Ensure you document and communicate a clear strategy for roles and responsibilities in your security organization. Prioritize providing clear accountability for security decisions, educating everyone on the shared responsibility model, and educate technical teams on technology to secure the cloud.

- [Azure Security Best Practice 1 – People: Educate Teams on Cloud Security Journey](/azure/cloud-adoption-framework/security/security-top-10#1-people-educate-teams-about-the-cloud-security-journey)

- [Azure Security Best Practice 2 - People: Educate Teams on Cloud Security Technology](/azure/cloud-adoption-framework/security/security-top-10#2-people-educate-teams-on-cloud-security-technology)

- [Azure Security Best Practice 3 - Process: Assign Accountability for Cloud Security Decisions](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-5: Define network security strategy

**Guidance**: Establish an Azure network security approach as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	Centralized network management and security responsibility

-	Virtual network segmentation model aligned with the enterprise segmentation strategy

-	Remediation strategy in different threat and attack scenarios

-	Internet edge and ingress and egress strategy

-	Hybrid cloud and on-premises interconnectivity strategy

-	Up-to-date network security artifacts (e.g. network diagrams, reference network architecture)

For more information, see the following references:
- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](../security/benchmarks/security-controls-v2-network-security.md)

- [Azure network security overview](../security/fundamentals/network-overview.md)

- [Enterprise network architecture strategy](/azure/cloud-adoption-framework/ready/enterprise-scale/architecture)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-6: Define identity and privileged access strategy

**Guidance**: Establish an Azure identity and privileged access approaches as part of your organization’s overall security access control strategy.  

This strategy should include documented guidance, policy, and standards for the following elements: 

-	A centralized identity and authentication system and its interconnectivity with other internal and external identity systems

-	Strong authentication methods in different use cases and conditions

-	Protection of highly privileged users

-	Anomaly user activities monitoring and handling  

-	User identity and access review and reconciliation process

More information is available at the referenced links.

- [Azure Security Benchmark - Identity management](../security/benchmarks/security-controls-v2-identity-management.md)

- [Azure Security Benchmark - Privileged access](../security/benchmarks/security-controls-v2-privileged-access.md)

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure identity management security overview](../security/fundamentals/identity-management-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### GS-7: Define logging and threat response strategy

**Guidance**: Establish a logging and threat response strategy to rapidly detect and remediate threats while meeting compliance requirements. Prioritize providing analysts with high quality alerts and seamless experiences so that they can focus on threats rather than integration and manual steps. 

This strategy should include documented guidance, policy, and standards for the following elements:

-	The security operations (SecOps) organization’s role and responsibilities 

-	A well-defined incident response process aligning with NIST or another industry framework 

-	Log capture and retention to support threat detection, incident response, and compliance needs

-	Centralized visibility of and correlation information about threats, using SIEM, native Azure capabilities, and other sources 

-	Communication and notification plan with your customers, suppliers, and public parties of interest

-	Use of Azure native and third-party platforms for incident handling, such as logging and threat detection, forensics, and attack remediation and eradication

-	Processes for handling incidents and post-incident activities, such as lessons learned and evidence retention

More information is available at the referenced links.

- [Azure Security Benchmark - Logging and threat detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md)

- [Azure Security Benchmark - Incident response](../security/benchmarks/security-controls-v2-incident-response.md)

- [Azure Security Best Practice 4 - Process. Update Incident Response Processes for Cloud](/azure/cloud-adoption-framework/security/security-top-10#4-process-update-incident-response-ir-processes-for-cloud)

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting/)

- [Azure enterprise scale, management, and monitoring](/azure/cloud-adoption-framework/ready/enterprise-scale/management-and-monitoring)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)