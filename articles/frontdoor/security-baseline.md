---
title: Azure security baseline for Azure Front Door
description: The Azure Front Door security baseline provides procedural guidance and resources for implementing the security recommendations specified in the Azure Security Benchmark.
author: msmbaldwin
ms.service: frontdoor
ms.topic: conceptual
ms.date: 11/18/2020
ms.author: mbaldwin
ms.custom: subject-security-benchmark

# Important: This content is machine generated; do not modify this topic directly. Contact mbaldwin for more information.

---

# Azure security baseline for Azure Front Door

This security baseline applies guidance from the [Azure Security Benchmark version 2.0](../security/benchmarks/overview.md) to Azure Front Door. The Azure Security Benchmark provides recommendations on how you can secure your cloud solutions on Azure. The content is grouped by the **security controls** defined by the Azure Security Benchmark and the related guidance applicable to Azure Front Door. **Controls** not applicable to Azure Front Door have been excluded.

To see how Azure Front Door completely maps to the Azure Security Benchmark, see the [full Azure Front Door security baseline mapping file](https://github.com/MicrosoftDocs/SecurityBenchmarks/tree/master/Azure%20Offer%20Security%20Baselines).

## Network Security

*For more information, see the [Azure Security Benchmark: Network Security](../security/benchmarks/security-controls-v2-network-security.md).*

### NS-4: Protect applications and services from external network attacks

**Guidance**: Use Azure PowerShell to create a geo-filtering policy and associate the policy with your existing Azure Front Door frontend host. This geo-filtering policy will block requests from external networks, such as the ones from other countries or regions except United States.

- [Tutorial - How to set up a geo-filtering WAF policy for your Front Door](front-door-tutorial-geo-filtering.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### NS-6: Simplify network security rules

**Guidance**: Use Virtual Network Service tags to define network access controls on network security groups configured for your Azure Front Door offering resources. Service tags can be used in place of specific IP addresses when creating security rules. By specifying the service tag name( AzureFrontDoor.Frontend, AzureFrontDoor.Backend, AzureFrontDoor.FirstParty) in the appropriate source or destination field of a rule, you can allow or deny the traffic for the corresponding service. 

Microsoft manages the address prefixes encompassed by the service tag and automatically updates the service tag as addresses change.

- [Understand and use service tags](../virtual-network/service-tags-overview.md)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Identity Management

*For more information, see the [Azure Security Benchmark: Identity Management](../security/benchmarks/security-controls-v2-identity-management.md).*

### IM-6: Restrict Azure resource access based on conditions

**Guidance**: By default, Azure Front Door responds to all user requests regardless of where the request originated. Customers can also restrict access to their web application by countries or regions. The Web application firewall service in Azure Front Door enables customers to define a policy using custom access rules, for a specific path on their endpoint, to either allow or block access from specified countries or regions.

- [Tutorial - How to set up a geo-filtering WAF policy for your Azure Front Door](front-door-tutorial-geo-filtering.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

## Privileged Access

*For more information, see the [Azure Security Benchmark: Privileged Access](../security/benchmarks/security-controls-v2-privileged-access.md).*

### PA-2: Restrict administrative access to business-critical systems

**Guidance**: Azure Front Door uses Azure role-based access control (Azure RBAC) to isolate access to business-critical systems. Use Azure RBAC to limit accounts that are granted privileged access to the subscriptions and management groups, where  they reside.

Ensure restricted access to management, identity, and security systems that have administrative access to business-critical systems, such as Active Directory Domain Controllers, security tools, and system management tools. Align all types of access-controls to your enterprise segmentation strategy for continuous and consistent implementation.

- [Azure Components and Reference model](/security/compass/microsoft-security-compass-introduction#azure-components-and-reference-model-2151) 

- [Management Group Access](../governance/management-groups/overview.md#management-group-access) 

- [Azure subscription administrators](../cost-management-billing/manage/add-change-subscription-administrator.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

### PA-6: Use privileged access workstations

**Guidance**: Secured, isolated workstations are critically important for the security of sensitive roles like administrators, developers, and critical service operators. 

Use highly secured user workstations with Azure Bastion for administrative tasks. Choose Azure Active Directory (Azure AD), Microsoft Defender Advanced Threat Protection (ATP), and Microsoft Intune to deploy secure and managed user workstations for administrative tasks. The secured workstations must be centrally managed to enforce secured configuration including strong authentication, software and hardware baselines, restricted logical and network access.

- [Understand privileged access workstations](https://4sysops.com/archives/understand-the-microsoft-privileged-access-workstation-paw-security-model/) 

- [Deploy a privileged access workstation](/security/compass/privileged-access-deployment)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

### PA-7: Follow just enough administration (least privilege principle) 

**Guidance**: Azure Front Door is integrated with Azure role-based access control (Azure RBAC) to manage its resources. Azure RBAC allows you to manage Azure resource access through role assignments. You can assign these roles to users, groups service principals and managed identities. There are pre-defined built-in roles for certain resources, and these roles can be inventoried or queried through tools such as Azure CLI, Azure PowerShell or the Azure portal. 

Follow the least privileges model for role based permissions assigned to resources with Azure RBAC and ensure they are based on business need. This complements the just in time (JIT) approach of Azure AD Privileged Identity Management (PIM) and should be reviewed periodically.

Use built-in roles to allocate permission and only create custom roles based on business requirements.

- [What is Azure role-based access control (Azure RBAC)](../role-based-access-control/overview.md) 

- [How to configure Azure RBAC](../role-based-access-control/role-assignments-portal.md) 

- [How to use Azure AD identity and access reviews](../active-directory/governance/access-reviews-overview.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Data Protection

*For more information, see the [Azure Security Benchmark: Data Protection](../security/benchmarks/security-controls-v2-data-protection.md).*

### DP-4: Encrypt sensitive information in transit

**Guidance**: To complement access controls, data in transit should be protected against ‘out of band’ attacks (e.g. traffic capture) using encryption to ensure that attackers cannot easily read or modify the data.

Front Door supports TLS versions 1.0, 1.1 and 1.2. TLS 1.3 is not yet supported. All Front Door profiles created after September 2019 use TLS 1.2 as the default minimum.

While this is optional for traffic on private networks, this is critical for traffic on external and public networks. For HTTP traffic, ensure that any clients connecting to your Azure resources can negotiate TLS v1.2 or greater. For remote management, use SSH (for Linux) or RDP/TLS (for Windows) instead of an unencrypted protocol. Obsoleted SSL, TLS, and SSH versions and protocols, and weak ciphers should be disabled.

By default, Azure provides encryption for data in transit between Azure data centers.

- [Tutorial -  How to Configure HTTPS on a Front Door custom domain](front-door-custom-domain-https.md)

- [Understand encryption in transit with Azure](../security/fundamentals/encryption-overview.md#encryption-of-data-in-transit) 

- [Information on TLS Security](/security/engineering/solving-tls1-problem) 

- [Double encryption for Azure data in transit](../security/fundamentals/double-encryption.md#data-in-transit)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Asset Management

*For more information, see the [Azure Security Benchmark: Asset Management](../security/benchmarks/security-controls-v2-asset-management.md).*

### AM-1: Ensure security team has visibility into risks for assets

**Guidance**: Ensure security teams are granted Security Reader permissions in your Azure tenant and subscriptions for them to monitor security risks using Azure Security Center. 

Depending on how security team responsibilities are structured, monitoring for security risks could  be the responsibility of a central security team or a local team. However, security insights and risks must always be aggregated centrally within an organization. 

Security Reader permissions can be applied broadly to an entire tenant (Root Management Group) or scoped to management groups or specific subscriptions. 

Note: that additional permissions may be required for visibility into workloads and services. 

- [Overview of Security Reader Role](../role-based-access-control/built-in-roles.md#security-reader)

- [Overview of Azure Management Groups](../governance/management-groups/overview.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Customer

### AM-2: Ensure security team has access to asset inventory and metadata

**Guidance**: Apply tags to Azure resources, resource groups, and subscriptions to logically organize them into a taxonomy. Each tag consists of a name and a value pair. For example, you can apply the name "Environment" and the value "Production" to all the resources in production..

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md) 

- [Azure Security Center asset inventory management](../security-center/asset-inventory.md) 

- [Resource naming and tagging decision guide](/azure/cloud-adoption-framework/decision-guides/resource-tagging/?toc=%2fazure%2fazure-resource-manager%2fmanagement%2ftoc.json)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-3: Use only approved Azure services

**Guidance**: Use Azure Policy to audit and restrict which services users can provision in your environment. Query for and discover resources within their subscriptions with  Azure Resource Graph.

Use Azure Monitor to create rules to trigger alerts when a non-approved service is detected.

- [How to configure and manage Azure Policy](../governance/policy/tutorials/create-and-manage.md) 

- [How to deny a specific resource type with Azure Policy](../governance/policy/samples/built-in-policies.md#general) 

- [How to create queries with Azure Resource Graph Explorer](../governance/resource-graph/first-query-portal.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Customer

### AM-4: Ensure security of asset lifecycle management

**Guidance**: It is the customer's responsibility to maintain attributes and network configurations of Azure Front Door assets which are considered high-impact.

It is recommended that the customer create a process to capture the attribute and network-configuration changes, measure the change-impact and create remediation tasks, as applicable.

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Logging and Threat Detection

*For more information, see the [Azure Security Benchmark: Logging and Threat Detection](../security/benchmarks/security-controls-v2-logging-threat-detection.md).*

### LT-3: Enable logging for Azure network activities

**Guidance**: Azure Front Door is not intended to deploy into virtual networks; because of this customers are unable to enable network security group flow logging, route traffic through a firewall or perform packet captures.

Azure Front Door logs all network traffic that it processes for customer access. Enable the network flow logs feature and configure these logs to be sent to a storage account for long term retention and auditing.

- [Tutorial - How to setup Monitoring metrics and logs in Azure Front Door](front-door-diagnostics.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### LT-4: Enable logging for Azure resources

**Guidance**: Activity logs, which are automatically available, contain all write operations (PUT, POST, DELETE) for your Azure Front Door resources except read operations (GET). Activity logs can be used to find an error when troubleshooting or to monitor how a user in your organization modified a resource.

Enable Azure resource logs for  Azure Front Door. You can use Azure Security Center and Azure Policy to enable resource logs and log data collecting. These logs can be critical for later investigating security incidents and performing forensic exercises.

- [How to collect platform logs and metrics with Azure Monitor](../azure-monitor/essentials/diagnostic-settings.md) 

- [Understand logging and different log types in Azure](../azure-monitor/essentials/platform-logs-overview.md) 

- [Understand Azure Security Center data collection](../security-center/security-center-enable-data-collection.md)

**Azure Security Center monitoring**: Yes

**Responsibility**: Shared

## Incident Response

*For more information, see the [Azure Security Benchmark: Incident Response](../security/benchmarks/security-controls-v2-incident-response.md).*

### IR-1: Preparation – update incident response process for Azure

**Guidance**: Ensure your organization has defined processes to respond to security incidents. Confirm that keeps these processes updated for Azure resources and regularly tests them to ensure readiness.

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

**Guidance**: Ensure analysts can query and use diverse data sources as they investigate potential incidents to build a full view of what occurred. Diverse log types should be collected to track the activities of a potential attacker across the kill chain to avoid any blind spots.  Ensure insights and learnings are captured for other analysts and for future historical reference.  

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

**Guidance**: Use Azure Security Center and Azure Policy to establish secure configurations on all compute resources including Virtual Machines, containers, and more.

- [How to monitor Azure Security Center recommendations](../security-center/security-center-recommendations.md) 

- [Security recommendations - a reference guide](../security-center/recommendations-reference.md)

**Azure Security Center monitoring**: Currently not available

**Responsibility**: Shared

### PV-7: Rapidly and automatically remediate software vulnerabilities

**Guidance**: Rapidly deploy software updates to remediate software vulnerabilities in operating systems and applications.

Prioritize use a common risk scoring program (for example, Common Vulnerability Scoring System) or the default risk ratings provided by a third-party scanning tool you are using. and tailor to your environment using context of which applications present a high security risk and which ones require high uptime.

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

**Guidance**: Continuously measure and mitigate risks to your individual assets and the environment they are hosted in. Prioritize high value assets and highly-exposed attack surfaces, such as published applications, network ingress and egress points, user and administrator endpoints, and so on.

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

More information is available at the referenced links.

- [Azure Security Best Practice 11 - Architecture. Single unified security strategy](/azure/cloud-adoption-framework/security/security-top-10#11-architecture-establish-a-single-unified-security-strategy)

- [Azure Security Benchmark - Network Security](../security/benchmarks/security-controls-v2-network-security.md)

- [Azure network security overview](../security/fundamentals/network-overview.md)

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

For more information, see the following references:

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

- [Azure Adoption Framework, logging, and reporting decision guide](/azure/cloud-adoption-framework/decision-guides/logging-and-reporting)

**Azure Security Center monitoring**: Not applicable

**Responsibility**: Customer

## Next steps

- See the [Azure Security Benchmark V2 overview](../security/benchmarks/overview.md)
- Learn more about [Azure security baselines](../security/benchmarks/security-baselines-overview.md)