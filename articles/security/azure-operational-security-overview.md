---

title: Azure operational security overview| Microsoft Docs
description: This article provides an overview of the Azure operational security.
services: security
documentationcenter: na
author: unifycloud
manager: swadhwa
editor: tomsh

ms.assetid: 
ms.service: security
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 07/27/2017
ms.author: tomsh

---

# Azure operational security overview
Azure Operational Security refers to the services, controls, and features available to users for protecting their data, applications, and other assets in Microsoft Azure. [Azure Operational Security](https://docs.microsoft.com/azure/security/azure-operational-security) is a framework that incorporates the knowledge gained through a variety of capabilities that are unique to Microsoft, including the Microsoft Security Development Lifecycle (SDL), the Microsoft Security Response Center program, and deep awareness of the cyber security threat landscape.

This Azure Operational Security Overview article focuses on the following areas:

- Azure Operations Management Suite
-	Azure Security Center
-	Azure Monitor
-	Azure Network watcher
-	Azure Storage analytics
-	Azure Active directory

## Azure Operations Management Suite
IT Operations is responsible for managing datacenter infrastructure, applications, and data, including the stability and security of these systems. However, gaining security insights across increasing complex IT environments often requires organizations to cobble together data from multiple security and management systems.

[Microsoft Operations Management Suite (OMS)](https://docs.microsoft.com/azure/operations-management-suite/operations-management-suite-overview) is Microsoft's cloud-based IT management solution that helps you manage and protect your on-premises and cloud infrastructure.

OMS is a cloud-based IT management solution with many offerings, such as IT Automation, Security & Compliance, Log Analytics, and Backup & Recovery. As such, it’s a perfect aid to manage and protect your IT infrastructure—on premises and in the cloud.

The core functionality of OMS is provided by a set of services that run in Azure. Each service provides a specific management function, and you can combine services to achieve different management scenarios. Which includes:

-	Log analytics
-	Automation
-	Backup
-	Site Recovery

### Log Analytics
[Log Analytics](http://azure.microsoft.com/documentation/services/log-analytics) provides monitoring services for OMS by collecting data from managed resources into a central repository. This data could include events, performance data, or custom data provided through the API. Once collected, the data is available for alerting, analysis, and export. This method allows you to consolidate data from a variety of sources so you can combine data from your Azure services with your existing on-premises environment. It also clearly separates the collection of the data from the action taken on that data so that all actions are available to all kinds of data.

### Automation
Microsoft [Azure Automation](https://docs.microsoft.com/azure/automation/automation-intro) provides a way for users to automate the manual, long-running, error-prone, and frequently repeated tasks that are commonly performed in a cloud and enterprise environment. It saves time and increases the reliability of regular administrative tasks and even schedules them to be automatically performed at regular intervals. You can automate processes using runbooks or automate configuration management using Desired State Configuration.

### Backup
[Azure Backup](https://docs.microsoft.com/azure/backup/backup-introduction-to-azure-backup) is the Azure-based service you can use to back up (or protect) and restore your data in the Microsoft cloud. Azure Backup replaces your existing on-premises or off-site backup solution with a cloud-based solution that is reliable, secure, and cost-competitive. Azure Backup offers multiple components that you download and deploy on the appropriate computer, server, or in the cloud. The component, or agent, that you deploy depends on what you want to protect. All Azure Backup components (no matter whether you're protecting data on-premises or in the cloud) can be used to back up data to a Recovery Services vault in Azure. See the [Azure Backup components table](https://docs.microsoft.com/azure/backup/backup-introduction-to-azure-backup#which-azure-backup-components-should-i-use).

### Site recovery
[Azure Site Recovery](http://azure.microsoft.com/documentation/services/site-recovery) provides business continuity by orchestrating replication of on-premises virtual and physical machines to Azure, or to a secondary site. If your primary site is unavailable, you fail over to the secondary location so that users can keep working, and fail back when systems return to working order. intelligent and effective threat detection.

## Azure Active Directory
[Azure Active Directory](https://docs.microsoft.com/azure/active-directory/active-directory-enable-sso-scenario) is Microsoft’s comprehensive Identity as a Service (IDaaS) solution that:

-	Enables IAM as a cloud service
-	Provides central access management, single-sign on (SSO), and reporting
-	Supports integrated access management for [thousands of applications](https://azure.microsoft.com/marketplace/active-directory/) in the application gallery, including Salesforce, Google Apps, Box, Concur, and more.

Azure AD also includes a full suite of [identity management capabilities](https://docs.microsoft.com/azure/security/security-identity-management-overview#security-monitoring-alerts-and-machine-learning-based-reports) including [multi-factor authentication](https://docs.microsoft.com/azure/multi-factor-authentication/multi-factor-authentication), [device registration]( https://docs.microsoft.com/azure/active-directory/active-directory-device-registration-overview), [self-service password management](https://azure.microsoft.com/resources/videos/self-service-password-reset-azure-ad/), [self-service group management](https://docs.microsoft.com/azure/active-directory/active-directory-passwords-update-your-own-password), [privileged account management](https://docs.microsoft.com/azure/active-directory/active-directory-privileged-identity-management-configure), [role-based access control](https://docs.microsoft.com/azure/active-directory/role-based-access-control-what-is), [application usage monitoring](https://docs.microsoft.com/azure/active-directory/connect-health/active-directory-aadconnect-health), [rich auditing](https://docs.microsoft.com/azure/active-directory/active-directory-reporting-activity-audit-logs), and [security monitoring and alerting](https://docs.microsoft.com/azure/operations-management-suite/oms-security-responding-alerts).

With Azure Active Directory, all applications you publish for your partners and customers (business or consumer) have the same identity and access management capabilities. This enables you to significantly reduce your operational costs.

## Azure Security Center
[Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-get-started) helps you prevent, detect, and respond to threats with increased visibility into and control over the security of your Azure resources. It provides integrated security monitoring and policy management across your subscriptions, helps detect threats that might otherwise go unnoticed, and works with a broad ecosystem of security solutions.

[Security Center](https://docs.microsoft.com/azure/security-center/security-center-linux-virtual-machine) helps you safeguard virtual machine data in Azure by providing visibility into your virtual machine’s security settings and monitoring for threats. Security Center can monitor your virtual machines for:

-	Operating System (OS) security settings with the recommended configuration rules
-	System security and critical updates that are missing
-	Endpoint protection recommendations
-	Disk encryption validation
-	Network-based attacks

Azure Security Center uses [Role-Based Access Control (RBAC)](https://docs.microsoft.com/azure/active-directory/role-based-access-control-configure), which provides [built-in roles](https://docs.microsoft.com/azure/active-directory/role-based-access-built-in-roles) that can be assigned to users, groups, and services in Azure.

Security Center assesses the configuration of your resources to identify security issues and vulnerabilities. In Security Center, you only see information related to a resource when you are assigned the role of Owner, Contributor, or Reader for the subscription or resource group that a resource belongs to.

>[!Note]
>See [Permissions in Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-permissions) to learn more about roles and allowed actions in Security Center.

Security Center uses the Microsoft Monitoring Agent – this is the same agent used by the Operations Management Suite and Log Analytics service. Data collected from this agent is stored in either an existing Log Analytics [workspace](https://docs.microsoft.com/azure/log-analytics/log-analytics-manage-access) associated with your Azure subscription or a new workspace(s), taking into account the geolocation of the VM.

## Azure Monitor
Performance issues in your cloud app can impact your business. With multiple interconnected components and frequent releases, degradations can happen at any time. And if you’re developing an app, your users usually discover issues that you didn’t find in testing. You should know about these issues immediately, and have tools for diagnosing and fixing the problems.

[Azure Monitor](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-azure-monitor) is basic tool for monitoring services running on Azure. It gives you infrastructure-level data about the throughput of a service and the surrounding environment. If you are managing your apps all in Azure, deciding whether to scale up or down resources, then Azure Monitor gives you what you use to start.

In addition, you can use monitoring data to gain deep insights about your application. That knowledge can help you to improve application performance or maintainability, or automate actions that would otherwise require manual intervention. It includes:

-	Azure Activity Log
-	Azure Diagnostic Logs
-	Metrics
-	Azure Diagnostics

### Azure Activity Log
It is a log that provides insight into the operations that were performed on resources in your subscription. The [Activity Log](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs) was previously known as “Audit Logs” or “Operational Logs,” since it reports control-plane events for your subscriptions.

### Azure Diagnostic Logs
[Azure Diagnostic Logs](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-of-diagnostic-logs) are emitted by a resource and provide rich, frequent data about the operation of that resource. The content of these logs varies by resource type.

For example, Windows event system logs are one category of Diagnostic Log for VMs and blob, table, and queue logs are categories of Diagnostic Logs for storage accounts.

Diagnostics Logs differ from the [Activity Log (formerly known as Audit Log or Operational Log)](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-activity-logs). The Activity log provides insight into the operations that were performed on resources in your subscription. Diagnostics logs provide insight into operations that your resource performed itself.

### Metrics
Azure Monitor enables you to consume telemetry to gain visibility into the performance and health of your workloads on Azure. The most important type of Azure telemetry data is the metrics (also called performance counters) emitted by most Azure resources. Azure Monitor provides several ways to configure and consume these [metrics](https://docs.microsoft.com/azure/monitoring-and-diagnostics/monitoring-overview-metrics) for monitoring and troubleshooting.

### Azure Diagnostics
It is the capability within Azure that enables the collection of diagnostic data on a deployed application. You can use the diagnostics extension from various different sources. Currently supported are [Azure Cloud Service Web and Worker Roles](https://docs.microsoft.com/azure/vs-azure-tools-configure-roles-for-cloud-service), [Azure Virtual Machines](https://docs.microsoft.com/azure/vs-azure-tools-configure-roles-for-cloud-service) running Microsoft Windows, and [Service Fabric](https://docs.microsoft.com/azure/monitoring-and-diagnostics/azure-diagnostics).


## Network Watcher
Customers build an end-to-end network in Azure by orchestrating and composing various individual network resources such as VNet, ExpressRoute, Application Gateway, Load balancers, and more. Monitoring is available on each of the network resources.

The end to end network can have complex configurations and interactions between resources, creating complex scenarios that need scenario-based monitoring through Network Watcher.

[Network Watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) will simplifies monitoring and diagnosing of your Azure network. Diagnostic and visualization tools available with Network Watcher enable you to take remote packet captures on an Azure Virtual Machine, gain insights into your network traffic using flow logs, and diagnose VPN Gateway and Connections.

Network Watcher currently has the following capabilities:

- [Topology](https://docs.microsoft.com/azure/network-watcher/network-watcher-topology-overview) - Provides a network level view showing the various interconnections and associations between network resources in a resource group.
-	[Variable Packet capture](https://docs.microsoft.com/azure/network-watcher/network-watcher-packet-capture-overview) - Captures packet data in and out of a virtual machine. Advanced filtering options and fine-tuned controls such as being able to set time and size limitations provide versatility. The packet data can be stored in a blob store or on the local disk in .cap format.
-	[IP flows verify](https://docs.microsoft.com/azure/network-watcher/network-watcher-ip-flow-verify-overview) - Checks if a packet is allowed or denied based on flow information 5-tuple packet parameters (Destination IP, Source IP, Destination Port, Source Port, and Protocol). If the packet is denied by a security group, the rule and group that denied the packet is returned.
-	[Next hop](https://docs.microsoft.com/azure/network-watcher/network-watcher-next-hop-overview) - Determines the next hop for packets being routed in the Azure Network Fabric, enabling you to diagnose any misconfigured user-defined routes.
-	[Security group view](https://docs.microsoft.com/azure/network-watcher/network-watcher-security-group-view-overview) - Gets the effective and applied security rules that are applied on a VM.
-	[NSG Flow logging](https://docs.microsoft.com/azure/network-watcher/network-watcher-nsg-flow-logging-overview) - Flow logs for Network Security Groups enable you to capture logs related to traffic that are allowed or denied by the security rules in the group. The flow is defined by a 5-tuple information – Source IP, Destination IP, Source Port, Destination Port, and Protocol.
-	[Virtual Network Gateway and Connection troubleshooting](https://docs.microsoft.com/azure/network-watcher/network-watcher-troubleshoot-manage-rest) - Provides the ability to troubleshoot Virtual Network Gateways and Connections.
-	[Network subscription limits](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) - Enables you to view network resource usage against limits.
-	[Configuring Diagnostics Log](https://docs.microsoft.com/azure/network-watcher/network-watcher-monitoring-overview) – Provides a single pane to enable or disable Diagnostics logs for network resources in a resource group.

To learn more how to configure network watcher see, [configure network watcher](https://docs.microsoft.com/azure/network-watcher/network-watcher-create).

## Developer Operations (DevOps)
Prior to DevOps application development, teams were in charge of gathering business requirements for a software program and writing code. Then a separate QA team tests the program in an isolated development environment, if requirements were met, and releases the code for operations to deploy. The deployment teams are further fragmented into siloed groups like networking and database. Each time a software program is “thrown over the wall” to an independent team it adds bottlenecks.

[DevOps](https://www.visualstudio.com/learn/what-is-devops/) enables teams to deliver more secure, higher-quality solutions faster, and cheaper. Customers expect a dynamic and reliable experience when consuming software and services.  Teams must rapidly iterate on software updates, measure the impact of the updates, and respond quickly with new development iterations to address issues or provide more value.  Cloud platforms such as Microsoft Azure have removed traditional bottlenecks and helped commoditize infrastructure. Software reigns in every business as the key differentiator and factor in business outcomes. No organization, developer, or IT worker can or should avoid the DevOps movement.

Mature DevOps practitioners adopt several of the following practices. These practices [involve people](https://www.visualstudio.com/learn/what-is-devops-culture/) to form strategies based on the business scenarios.  Tooling can help automate the various practices:

-	[Agile planning and project management](https://www.visualstudio.com/learn/what-is-agile/) techniques are used to plan and isolate work into sprints, manage team capacity, and help teams quickly adapt to changing business needs.
-	[Version control, usually with Git](https://www.visualstudio.com/learn/what-is-git/), enables teams located anywhere in the world to share source and integrate with software development tools to automate the release pipeline.
-	[Continuous Integration](https://www.visualstudio.com/learn/what-is-continuous-integration/) drives the ongoing merging and testing of code, which leads to finding defects early.  Other benefits include less time wasted on fighting merge issues and rapid feedback for development teams.
-	[Continuous Delivery](https://www.visualstudio.com/learn/what-is-continuous-delivery/) of software solutions to production and testing environments help organizations quickly fix bugs and respond to ever-changing business requirements.
-	[Monitoring](https://www.visualstudio.com/learn/what-is-monitoring/) of running applications including production environments for application health as well as customer usage help organizations form a hypothesis and quickly validate or disprove strategies.  Rich data is captured and stored in various logging formats.
-	[Infrastructure as Code (IaC)](https://www.visualstudio.com/learn/what-is-infrastructure-as-code/) is a practice, which enables the automation and validation of creation and teardown of networks and virtual machines to help with delivering secure, stable application hosting platforms.
-	[Microservices](https://www.visualstudio.com/learn/what-are-microservices/) architecture is leveraged to isolate business use cases into small reusable services.  This architecture enables scalability and efficiency.

## Next steps
To learn more about OMS Security and Audit solution, see the following articles:

- [Operations Management Suite | Security & Compliance](https://www.microsoft.com/cloud-platform/security-and-compliance).
- [Monitoring and Responding to Security Alerts in Operations Management Suite Security and Audit Solution](https://docs.microsoft.com/en-us/azure/operations-management-suite/oms-security-responding-alerts).
- [Monitoring Resources in Operations Management Suite Security and Audit Solution](https://docs.microsoft.com/en-us/azure/operations-management-suite/oms-security-monitoring-resources).
