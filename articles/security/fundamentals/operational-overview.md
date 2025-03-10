---

title: Azure operational security overview| Microsoft Docs
description: Learn about Azure operational security in this overview. Operational security refers to asset protection services, controls, and features.
services: security
author: msmbaldwin
manager: rkarlin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 09/29/2024
ms.author: mbaldwin

---

# Azure operational security overview

[Azure operational security](./operational-security.md) refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Microsoft Azure. It's a framework that incorporates the knowledge gained through a variety of capabilities that are unique to Microsoft. These capabilities include the Microsoft Security Development Lifecycle (SDL), the Microsoft Security Response Center program, and deep awareness of the cybersecurity threat landscape.

## Azure management services

An IT operations team is responsible for managing datacenter infrastructure, applications, and data, including the stability and security of these systems. However, gaining security insights across increasing complex IT environments often requires organizations to cobble together data from multiple security and management systems.

[Microsoft Azure Monitor logs](/azure/azure-monitor/overview) is a cloud-based IT management solution that helps you manage and protect your on-premises and cloud infrastructure. Its core functionality is provided by the following services that run in Azure. Azure includes multiple services that help you manage and protect your on-premises and cloud infrastructure. Each service provides a specific management function. You can combine services to achieve different management scenarios. 

### Azure Monitor

[Azure Monitor](/azure/azure-monitor/overview) collects data from managed sources into central data stores. This data can include events, performance data, or custom data provided through the API. After the data is collected, it's available for alerting, analysis, and export.

You can consolidate data from a variety of sources and combine data from your Azure services with your existing on-premises environment. Azure Monitor logs also clearly separates the collection of the data from the action taken on that data, so that all actions are available to all kinds of data.

### Automation

[Azure Automation](../../automation/automation-intro.md) provides a way for you to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud and enterprise environment. It saves time and increases the reliability of administrative tasks. It even schedules these tasks to be automatically performed at regular intervals. You can automate processes by using runbooks or automate configuration management by using Desired State Configuration.

### Backup

[Azure Backup](../../backup/backup-overview.md) is the Azure-based service that you can use to back up (or protect) and restore your data in the Microsoft Cloud. Azure Backup replaces your existing on-premises or off-site backup solution with a cloud-based solution that's reliable, secure, and cost-competitive.

Azure Backup offers components that you download and deploy on the appropriate computer or server, or in the cloud. The component, or agent, that you deploy depends on what you want to protect. All Azure Backup components (whether you're protecting data on-premises or in the cloud) can be used to back up data to an Azure Recovery Services vault in Azure.

For more information, see the [Azure Backup components table](../../backup/backup-overview.md#what-can-i-back-up).

### Site Recovery

[Azure Site Recovery](../../site-recovery/index.yml) provides business continuity by orchestrating the replication of on-premises virtual and physical machines to Azure, or to a secondary site. If your primary site is unavailable, you fail over to the secondary location so that users can keep working. You fail back when systems return to working order. Use Microsoft Defender for Cloud to perform more intelligent and effective threat detection.

<a name='azure-active-directory'></a>

## Microsoft Entra ID

[Microsoft Entra ID](../../active-directory/manage-apps/what-is-application-management.md) is a comprehensive identity service that:

-	Enables identity and access management (IAM) as a cloud service.
-	Provides central access management, single sign-on (SSO), and reporting.
-	Supports integrated access management for [thousands of applications](https://azuremarketplace.microsoft.com/marketplace/apps/Microsoft.AzureActiveDirectory) in the Azure Marketplace, including Salesforce, Google Apps, Box, and Concur.

Microsoft Entra ID also includes a full suite of [identity management capabilities](./identity-management-overview.md#security-monitoring-alerts-and-machine-learning-based-reports), including these:

- [Multi-factor authentication](../../active-directory/authentication/concept-mfa-howitworks.md)
- [Self-service password management](https://azure.microsoft.com/resources/videos/self-service-password-reset-azure-ad/)
- [Self-service group management](https://support.microsoft.com/account-billing/reset-your-work-or-school-password-using-security-info-23dde81f-08bb-4776-ba72-e6b72b9dda9e)
- [Privileged account management](../../active-directory/privileged-identity-management/pim-configure.md)
- [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)
- [Application usage monitoring](../../active-directory/hybrid/whatis-hybrid-identity.md)
- [Rich auditing](../../active-directory/reports-monitoring/concept-audit-logs.md)
- [Security monitoring and alerting](../../security-center/security-center-managing-and-responding-alerts.md)

With Microsoft Entra ID, all applications that you publish for your partners and customers (business or consumer) have the same identity and access management capabilities. This enables you to significantly reduce your operational costs.

## Microsoft Defender for Cloud

[Microsoft Defender for Cloud](../../security-center/security-center-introduction.md) helps you prevent, detect, and respond to threats with increased visibility into (and control over) the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions. It helps detect threats that might otherwise go unnoticed, and it works with a broad ecosystem of security solutions.

[Safeguard virtual machine (VM) data](../../security-center/security-center-introduction.md) in Azure by providing visibility into your virtual machine’s security settings and monitoring for threats. Defender for Cloud can monitor your virtual machines for:

- Operating system security settings with the recommended configuration rules.
- System security and critical updates that are missing.
- Endpoint protection recommendations.
- Disk encryption validation.
- Network-based attacks.

Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.yml). Azure RBAC provides [built-in roles](../../role-based-access-control/built-in-roles.md) that can be assigned to users, groups, and services in Azure.

Defender for Cloud assesses the configuration of your resources to identify security issues and vulnerabilities. In Defender for Cloud, you see information related to a resource only when you're assigned the role of owner, contributor, or reader for the subscription or resource group that a resource belongs to.

>[!Note]
>To learn more about roles and allowed actions in Defender for Cloud, see [Permissions in Microsoft Defender for Cloud](../../security-center/security-center-permissions.md).

Defender for Cloud uses the Microsoft Monitoring Agent. This is the same agent that the Azure Monitor service uses. Data collected from this agent is stored in either an existing Log Analytics [workspace](/azure/azure-monitor/logs/manage-access) associated with your Azure subscription or a new workspace, taking into account the geolocation of the VM.

## Azure Monitor

Performance issues in your cloud app can affect your business. With multiple interconnected components and frequent releases, degradations can happen at any time. And if you’re developing an app, your users usually discover issues that you didn’t find in testing. You should know about these issues immediately, and you should have tools for diagnosing and fixing the problems.

[Azure Monitor](/azure/azure-monitor/overview) is basic tool for monitoring services running on Azure. It gives you infrastructure-level data about the throughput of a service and the surrounding environment. If you're managing your apps all in Azure and deciding whether to scale up or down resources, Azure Monitor is the place to start.

You can also use monitoring data to gain deep insights about your application. That knowledge can help you to improve application performance or maintainability, or automate actions that would otherwise require manual intervention.

Azure Monitor includes the following components.

### Azure Activity Log

The [Azure Activity Log](/azure/azure-monitor/essentials/platform-logs-overview) provides insight into the operations that were performed on resources in your subscription. It was previously known as “Audit Log” or “Operational Log,” because it reports control-plane events for your subscriptions.

### Azure diagnostic logs

[Azure diagnostic logs](/azure/azure-monitor/essentials/platform-logs-overview) are emitted by a resource and provide rich, frequent data about the operation of that resource. The content of these logs varies by resource type.

Windows event system logs are one category of diagnostic logs for VMs. Blob, table, and queue logs are categories of diagnostic logs for storage accounts.

Diagnostic logs differ from the [Activity Log](/azure/azure-monitor/essentials/platform-logs-overview). The Activity log provides insight into the operations that were performed on resources in your subscription. Diagnostic logs provide insight into operations that your resource performed itself.

### Metrics

Azure Monitor provides telemetry that gives you visibility into the performance and health of your workloads on Azure. The most important type of Azure telemetry data is the [metrics](/azure/azure-monitor/data-platform) (also called performance counters) emitted by most Azure resources. Azure Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

### Azure Diagnostics

Azure Diagnostics enables the collection of diagnostic data on a deployed application. You can use the Diagnostics extension from various sources. Currently supported are [Azure cloud service roles](/visualstudio/azure/vs-azure-tools-configure-roles-for-cloud-service), [Azure virtual machines](/visualstudio/azure/vs-azure-tools-configure-roles-for-cloud-service) running Microsoft Windows, and [Azure Service Fabric](/azure/azure-monitor/agents/diagnostics-extension-overview).

## Azure Network Watcher

Customers build an end-to-end network in Azure by orchestrating and composing individual network resources such as virtual networks, Azure ExpressRoute, Azure Application Gateway, and load balancers. Monitoring is available on each of the network resources.

The end-to-end network can have complex configurations and interactions between resources. The result is complex scenarios that need scenario-based monitoring through [Azure Network Watcher](../../network-watcher/network-watcher-monitoring-overview.md).

Network Watcher simplifies monitoring and diagnosing of your Azure network. You can use the diagnostic and visualization tools in Network Watcher to:

- Take remote packet captures on an Azure virtual machine.
- Gain insights into your network traffic by using flow logs.
- Diagnose Azure VPN Gateway and connections.

Network Watcher currently has the following capabilities:

- [Topology](../../network-watcher/view-network-topology.md): Provides a view of the various interconnections and associations between network resources in a resource group.
- [Variable packet capture](../../network-watcher/network-watcher-packet-capture-overview.md): Captures packet data in and out of a virtual machine. Advanced filtering options and fine-tuned controls, such as the ability to set time and size limitations, provide versatility. The packet data can be stored in a blob store or on the local disk in .cap format.
- [IP flow verify](../../network-watcher/network-watcher-ip-flow-verify-overview.md): Checks if a packet is allowed or denied based on 5-tuple packet parameters for flow information (destination IP, source IP, destination port, source port, and protocol). If a security group denies the packet, the rule and group that denied the packet are returned.
- [Next hop](../../network-watcher/network-watcher-next-hop-overview.md): Determines the next hop for packets being routed in the Azure network fabric, so you can diagnose any misconfigured user-defined routes.
- [Security group view](../../network-watcher/network-watcher-security-group-view-overview.md): Gets the effective and applied security rules that are applied on a VM.
- [NSG flow logs for network security groups](../../network-watcher/network-watcher-nsg-flow-logging-overview.md): Enable you to capture logs related to traffic that is allowed or denied by the security rules in the group. The flow is defined by 5-tuple information: source IP, destination IP, source port, destination port, and protocol.
- [Virtual network gateway and connection troubleshooting](../../network-watcher/network-watcher-troubleshoot-manage-rest.md): Provides the ability to troubleshoot virtual network gateways and connections.
- [Network subscription limits](../../network-watcher/network-watcher-monitoring-overview.md): Enables you to view network resource usage against limits.
- [Diagnostic logs](../../network-watcher/network-watcher-monitoring-overview.md): Provides a single pane to enable or disable diagnostic logs for network resources in a resource group.

For more information, see [Configure Network Watcher](../../network-watcher/network-watcher-create.md).

## Cloud Service Provider Access Transparency

[Customer Lockbox for Microsoft Azure](customer-lockbox-overview.md) is a service integrated into Azure portal that gives you explicit control in the rare instance when a Microsoft Support Engineer may need access to your data to resolve an issue.
There are very few instances, such as a debugging remote access issue, where a Microsoft Support Engineer requires elevated permissions to resolve this issue. In such cases, Microsoft engineers use just-in-time access service that provides limited, time-bound authorization with access limited to the service.  
While Microsoft has always obtained customer consent for access, Customer Lockbox now gives you the ability to review and approve or deny such requests from the Azure portal. Microsoft support engineers will not be granted access until you approve the request.

## Standardized and Compliant Deployments

[Azure Blueprints](../../governance/blueprints/overview.md) enable cloud architects and central information technology groups to define a repeatable set of Azure resources that implement and adhere to an organization's standards, patterns, and requirements.  
This makes it possible for DevOps teams to rapidly build and stand up new environments and trust that they're building them with infrastructure that maintains organizational compliance.
Blueprints provide a declarative way to orchestrate the deployment of various resource templates and other artifacts such as:

- Role Assignments
- Policy Assignments
- Azure Resource Manager templates
- Resource Groups

## DevOps

Before [Developer Operations (DevOps)](https://azure.microsoft.com/overview/what-is-devops/) application development, teams were in charge of gathering business requirements for a software program and writing code. Then a separate QA team tested the program in an isolated development environment. If requirements were met, the QA team released the code for operations to deploy. The deployment teams were further fragmented into groups like networking and database. Each time a software program was “thrown over the wall” to an independent team, it added bottlenecks.

DevOps enables teams to deliver more secure, higher-quality solutions faster and more cheaply. Customers expect a dynamic and reliable experience when consuming software and services. Teams must rapidly iterate on software updates and measure the impact of the updates. They must respond quickly with new development iterations to address issues or provide more value.  

Cloud platforms such as Microsoft Azure have removed traditional bottlenecks and helped commoditize infrastructure. Software reigns in every business as the key differentiator and factor in business outcomes. No organization, developer, or IT worker can or should avoid the DevOps movement.

Mature DevOps practitioners adopt several of the following practices. These practices [involve people](/devops/what-is-devops) to form strategies based on the business scenarios. Tooling can help automate the various practices.

- [Agile planning and project management](https://www.visualstudio.com/learn/what-is-agile/) techniques are used to plan and isolate work into sprints, manage team capacity, and help teams quickly adapt to changing business needs.
- [Version control, usually with Git](/devops/develop/git/what-is-git), enables teams located anywhere in the world to share source and integrate with software development tools to automate the release pipeline.
- [Continuous integration](/devops/develop/what-is-continuous-integration) drives the ongoing merging and testing of code, which leads to finding defects early.  Other benefits include less time wasted on fighting merge issues and rapid feedback for development teams.
- [Continuous delivery](/devops/deliver/what-is-continuous-delivery) of software solutions to production and testing environments helps organizations quickly fix bugs and respond to ever-changing business requirements.
- [Monitoring](/devops/operate/what-is-monitoring) of running applications--including production environments for application health, as well as customer usage--helps organizations form a hypothesis and quickly validate or disprove strategies.  Rich data is captured and stored in various logging formats.
- [Infrastructure as Code (IaC)](/devops/deliver/what-is-infrastructure-as-code) is a practice that enables the automation and validation of creation and teardown of networks and virtual machines to help with delivering secure, stable application hosting platforms.
- [Microservices](/devops/deliver/what-are-microservices) architecture is used to isolate business use cases into small reusable services.  This architecture enables scalability and efficiency.

## Next steps

To learn about the Security and Audit solution, see the following articles:

- [Security and compliance](https://azure.microsoft.com/overview/trusted-cloud/)
- [Microsoft Defender for Cloud](../../security-center/security-center-introduction.md)
- [Azure Monitor](/azure/azure-monitor/overview)
