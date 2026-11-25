---

title: Azure operational security overview
description: Learn about Azure operational security in this overview. Operational security refers to asset protection services, controls, and features.
services: security
author: msmbaldwin
ms.service: security
ms.subservice: security-fundamentals
ms.topic: article
ms.date: 07/20/2026
ms.author: mbaldwin
ai-usage: ai-assisted

---

# Azure operational security overview

Azure operational security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Microsoft Azure. It's a framework that incorporates the knowledge gained through a variety of capabilities that are unique to Microsoft. These capabilities include the Microsoft Security Development Lifecycle (SDL), the Microsoft Security Response Center program, and deep awareness of the cybersecurity threat landscape.

## Azure management services

An IT operations team is responsible for managing datacenter infrastructure, applications, and data, including the stability and security of these systems. However, gaining security insights across increasingly complex IT environments often requires organizations to cobble together data from multiple security and management systems.

[Azure Monitor Logs](/azure/azure-monitor/overview) is a cloud-based IT management solution that helps you manage and protect your on-premises and cloud infrastructure. Azure includes multiple management services that provide specific functions. You can combine services to achieve different management scenarios.

### Azure Monitor

[Azure Monitor](/azure/azure-monitor/overview) collects data from managed sources into central data stores. This data might include events, performance data, or custom data provided through the API. After the data is collected, it's available for alerting, analysis, and export.

You can consolidate data from a variety of sources and combine data from your Azure services with your existing on-premises environment. Azure Monitor Logs separates the collection of data from the action taken on that data, so all actions are available to all kinds of data.

### Automation

[Azure Automation](../../automation/overview.md) provides a way for you to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud and enterprise environment. This automation saves time and increases the reliability of administrative tasks. Azure Automation can also schedule these tasks to run automatically at regular intervals. You can automate processes by using runbooks or automate configuration management by using Desired State Configuration.

### Backup

[Azure Backup](../../backup/backup-overview.md) is the Azure-based service that you can use to back up (or protect) and restore your data in the Microsoft Cloud. Azure Backup replaces your existing on-premises or off-site backup solution with a cloud-based solution that's reliable, secure, and cost-competitive.

Azure Backup offers components that you download and deploy on the appropriate computer or server, or in the cloud. The component, or agent, that you deploy depends on what you want to protect. All Azure Backup components (whether you're protecting data on-premises or in the cloud) can back up data to an Azure Recovery Services vault in Azure.

For more information, see the [Azure Backup components table](../../backup/backup-overview.md#what-can-i-back-up).

### Site Recovery

[Azure Site Recovery](../../site-recovery/index.yml) provides business continuity by orchestrating the replication of on-premises virtual and physical machines to Azure, or to a secondary site. If your primary site is unavailable, you fail over to the secondary location so that users can keep working. You fail back when systems return to working order. Use Microsoft Defender for Cloud to perform more intelligent and effective threat detection.

<a name='azure-active-directory'></a>

## Microsoft Entra ID

[Microsoft Entra ID](/entra/identity/enterprise-apps/what-is-application-management) is a comprehensive identity service that:

- Enables identity and access management (IAM) as a cloud service.
- Provides central access management, single sign-on (SSO), and reporting.
- Supports integrated access management for [Microsoft Entra application gallery](/entra/identity/enterprise-apps/overview-application-gallery) in the Azure Marketplace, including Salesforce, Google Apps, Box, and Concur.

Microsoft Entra ID also includes a full suite of [identity management capabilities](./identity-management-overview.md), including these:

- [Multi-factor authentication](/entra/identity/authentication/concept-mfa-howitworks)
- [Self-service password management](/shows/azure/how-to-configure-self-service-password-reset-users-in-windows-azure-ad)
- [Self-service group management](/entra/identity/users/groups-self-service-management)
- [Privileged account management](/entra/id-governance/privileged-identity-management/pim-configure)
- [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md)
- [Application usage monitoring](/entra/identity/hybrid/whatis-hybrid-identity)
- [Rich auditing](/entra/identity/monitoring-health/concept-audit-logs)
- [Security monitoring and alerting](/azure/defender-for-cloud/managing-and-responding-alerts)

With Microsoft Entra ID, all applications that you publish for your partners and customers (business or consumer) have the same identity and access management capabilities. This identity capability can significantly reduce your operational costs.

## Microsoft Defender for Cloud

[Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction) helps you prevent, detect, and respond to threats by providing increased visibility into and control over the security of your Azure resources. Defender for Cloud provides integrated security monitoring and policy management across your subscriptions. It helps detect threats that might otherwise go unnoticed, and it works with a broad ecosystem of security solutions.

Defender for Cloud helps [safeguard virtual machine (VM) data](/azure/defender-for-cloud/defender-for-cloud-introduction) in Azure by providing visibility into your virtual machine’s security settings and monitoring for threats. Defender for Cloud can monitor your virtual machines for:

- Operating system security settings with the recommended configuration rules.
- System security and critical updates that are missing.
- Endpoint protection recommendations.
- Disk encryption validation.
- Network-based attacks.

Defender for Cloud uses [Azure role-based access control (Azure RBAC)](../../role-based-access-control/role-assignments-portal.md). Azure RBAC provides [built-in roles](../../role-based-access-control/built-in-roles.md) that you can assign to users, groups, and services in Azure.

Defender for Cloud assesses the configuration of your resources to identify security problems and vulnerabilities. In Defender for Cloud, you see information related to a resource only when you're assigned the role of owner, contributor, or reader for the subscription or resource group that a resource belongs to.

> [!NOTE]
> To learn more about roles and allowed actions in Defender for Cloud, see [Permissions in Microsoft Defender for Cloud](/azure/defender-for-cloud/permissions).

Defender for Cloud uses the Azure Monitor Agent. Defender for Cloud uses the same agent that Azure Monitor uses. Data collected from this agent is stored in either an existing Log Analytics [workspace](/azure/azure-monitor/logs/manage-access) associated with your Azure subscription or a new workspace, taking into account the geolocation of the VM.

## Azure Monitor

Performance problems in your cloud app can affect your business. With multiple interconnected components and frequent releases, degradations can happen at any time. And if you're developing an app, your users usually discover problems that you didn't find in testing. You should know about these problems immediately, and you should have tools for diagnosing and fixing the problems.

[Azure Monitor](/azure/azure-monitor/overview) is a basic tool for monitoring services running on Azure. It gives you infrastructure-level data about the throughput of a service and the surrounding environment. If you're managing your apps entirely in Azure and deciding whether to scale up or down resources, Azure Monitor is the place to start.

You can also use monitoring data to gain deep insights about your application. That knowledge can help you improve application performance or maintainability, or automate actions that would otherwise require manual intervention.

Azure Monitor includes the following components.

### Azure activity log

The [Azure Activity Log](/azure/azure-monitor/essentials/platform-logs-overview) provides insight into the operations that were performed on resources in your subscription. The Azure Activity Log was previously known as "Audit Log" or "Operational Log," because it reports control-plane events for your subscriptions.

### Azure diagnostic logs

[Azure diagnostic logs](/azure/azure-monitor/essentials/platform-logs-overview) are emitted by a resource and provide rich, frequent data about the operation of that resource. The content of these logs varies by resource type.

Windows event system logs are one category of diagnostic logs for VMs. Blob, table, and queue logs are categories of diagnostic logs for storage accounts.

Diagnostic logs differ from the [Activity Log](/azure/azure-monitor/essentials/platform-logs-overview). The Activity log provides insight into the operations that were performed on resources in your subscription. Diagnostic logs provide insight into operations that your resource performed itself.

### Metrics

Azure Monitor provides telemetry that gives you visibility into the performance and health of your workloads on Azure. The most important type of Azure telemetry data is the [metrics](/azure/azure-monitor/data-platform) (also called performance counters) emitted by most Azure resources. Azure Monitor provides several ways to configure and consume these metrics for monitoring and troubleshooting.

### Azure diagnostics

Azure Diagnostics enables the collection of diagnostic data on a deployed application. You can use the Diagnostics extension from various sources. Currently supported are [Azure cloud service roles](/visualstudio/azure/vs-azure-tools-configure-roles-for-cloud-service), [Azure virtual machines](/visualstudio/azure/vs-azure-tools-configure-roles-for-cloud-service) running Microsoft Windows, and [Azure Service Fabric](/azure/azure-monitor/agents/diagnostics-extension-overview).

## Azure Network Watcher

Organizations build an end-to-end network in Azure by orchestrating and composing individual network resources such as virtual networks, Azure ExpressRoute, Azure Application Gateway, and load balancers. You can monitor each of the network resources.

The end-to-end network can have complex configurations and interactions between resources. You need scenario-based monitoring through [Azure Network Watcher](../../network-watcher/network-watcher-overview.md) for these complex scenarios.

Network Watcher simplifies monitoring and diagnostics for your Azure network. Use the diagnostic and visualization tools in Network Watcher to:

- Take remote packet captures on an Azure virtual machine.
- Gain insights into your network traffic by using flow logs.
- Diagnose Azure VPN Gateway and connections.

Network Watcher currently has the following capabilities:

- [Topology](../../network-watcher/network-insights-topology.md): Provides a view of the various interconnections and associations between network resources in a resource group.
- [Variable packet capture](../../network-watcher/packet-capture-overview.md): Captures packet data in and out of a virtual machine. Advanced filtering options and fine-tuned controls, such as the ability to set time and size limitations, provide versatility. You can store the packet data in a blob store or on the local disk in .cap format.
- [IP flow verify](../../network-watcher/ip-flow-verify-overview.md): Checks if a packet is allowed or denied based on 5-tuple packet parameters for flow information (destination IP, source IP, destination port, source port, and protocol). If a security group denies the packet, the rule and group that denied the packet are returned.
- [Next hop](../../network-watcher/next-hop-overview.md): Determines the next hop for packets being routed in the Azure network fabric, so you can diagnose any misconfigured user-defined routes.
- [Security group view](../../network-watcher/effective-security-rules-overview.md): Gets the effective and applied security rules that are applied on a VM.
- [NSG flow logs for network security groups](../../network-watcher/nsg-flow-logs-overview.md): Enable you to capture logs related to traffic that's allowed or denied by the security rules in the group. The flow is defined by 5-tuple information: source IP, destination IP, source port, destination port, and protocol.
- [Virtual network gateway and connection troubleshooting](../../network-watcher/connection-troubleshoot-manage.md): Provides the ability to troubleshoot virtual network gateways and connections.
- [Network subscription limits](../../network-watcher/network-watcher-overview.md): Enables you to view network resource usage against limits.
- [Diagnostic logs](../../network-watcher/network-watcher-overview.md): Provides a single pane to enable or disable diagnostic logs for network resources in a resource group.

For more information, see [Configure Network Watcher](../../network-watcher/network-watcher-create.md).

## Cloud service provider access transparency

[Customer Lockbox for Microsoft Azure](customer-lockbox-overview.md) is a service integrated into the Azure portal that gives you explicit control in the rare instance when a Microsoft support engineer might need access to your data to resolve a problem.
In rare cases, such as debugging a remote access problem, a Microsoft support engineer requires elevated permissions to resolve the problem. In such cases, Microsoft engineers use a just-in-time access service that provides limited, time-bound authorization with access limited to the service.
While Microsoft has always obtained customer consent for access, Customer Lockbox now gives you the ability to review and approve or deny such requests from the Azure portal. Microsoft support engineers don't receive access until you approve the request.

## Standardized and compliant deployments

Use [Azure Deployment Stacks](../../azure-resource-manager/bicep/deployment-stacks.md) to define, deploy, and manage a repeatable set of Azure resources that follows your organization's standards, patterns, and requirements. Deployment stacks provide lifecycle management and deny settings for resources defined in Bicep or Azure Resource Manager templates. Use [Azure Resource Manager template specs](../../azure-resource-manager/templates/template-specs.md) to store, version, and share approved templates across your organization.

> [!IMPORTANT]
> [Azure Blueprints](../../governance/blueprints/blueprint-retirement.md) (Preview) begins phased retirement on July 31, 2026, and retires on January 31, 2027. Migrate existing blueprints to [deployment stacks](../../azure-resource-manager/bicep/migrate-blueprint.md) and [template specs](../../azure-resource-manager/templates/template-specs.md) before retirement.

## DevOps

Before [DevOps](/devops/what-is-devops) practices, teams were responsible for gathering business requirements for a software program and writing code. Then, a separate QA team tested the program in an isolated development environment. If the requirements were met, the QA team released the code for operations to deploy. Deployment teams were further fragmented into groups like networking and database. Each handoff to an independent team added bottlenecks.

DevOps enables teams to deliver more secure, higher-quality solutions faster and at lower cost. Organizations expect a dynamic and reliable experience when consuming software and services. Teams must rapidly iterate on software updates and measure the impact of the updates. They must respond quickly with new development iterations to address problems or provide more value.

Cloud platforms such as Microsoft Azure remove traditional bottlenecks and help commoditize infrastructure. Software is a key differentiator and factor in business outcomes for every business. Organizations, developers, and IT workers should understand DevOps practices.

Mature DevOps practitioners adopt several of the following practices. These practices [involve people](/devops/what-is-devops) to form strategies based on the business scenarios. Tooling can help automate the various practices.

- Teams use [Agile planning and project management](https://www.visualstudio.com/learn/what-is-agile/) techniques to plan and isolate work into sprints, manage team capacity, and help teams quickly adapt to changing business needs.
- [Version control, usually with Git](/devops/develop/git/what-is-git), enables teams located anywhere in the world to share source and integrate with software development tools to automate the release pipeline.
- [Continuous integration](/devops/develop/what-is-continuous-integration) drives the ongoing merging and testing of code, which leads to finding defects early. Other benefits include less time wasted on merge problems and rapid feedback for development teams.
- [Continuous delivery](/devops/deliver/what-is-continuous-delivery) of software solutions to production and testing environments helps organizations quickly fix bugs and respond to ever-changing business requirements.
- [Monitoring](/devops/operate/what-is-monitoring) of running applications - including production environments for application health and customer usage - helps organizations form a hypothesis and quickly validate or disprove strategies. The process captures and stores rich data in various logging formats.
- [Infrastructure as code (IaC)](/devops/deliver/what-is-infrastructure-as-code) is a practice that enables the automation and validation of creation and teardown of networks and virtual machines to help with delivering secure, stable application hosting platforms.
- Teams use [microservices](/devops/deliver/what-are-microservices) architecture to isolate business use cases into small reusable services. This architecture enables scalability and efficiency.

## Next steps

To learn about the Security and Audit solution, see the following articles:

- [Microsoft Trust Center compliance offerings](https://www.microsoft.com/trust-center)
- [Microsoft Defender for Cloud](/azure/defender-for-cloud/defender-for-cloud-introduction)
- [Azure Monitor](/azure/azure-monitor/overview)
