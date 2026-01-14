---
title: Azure security management and monitoring overview
description: Learn about security management and monitoring capabilities in Azure, including Azure Monitor, Azure Policy, Azure Update Manager, and Azure role-based access control.
services: security
author: msmbaldwin

ms.assetid: 5cf2827b-6cd3-434d-9100-d7411f7ed424
ms.service: security
ms.subservice: security-fundamentals
ms.topic: overview
ms.date: 11/04/2025
ms.author: mbaldwin

---
# Azure security management and monitoring overview

Azure provides comprehensive security management and monitoring capabilities to help you govern, secure, and maintain visibility across your Azure resources. This article covers key management and monitoring services that support secure operations.

## Azure Monitor

[Azure Monitor](/azure/azure-monitor/overview) collects, analyzes, and acts on telemetry data from your Azure and on-premises environments. Monitor helps you maximize the availability and performance of your applications and proactively identify issues.

Azure Monitor provides:

* **Metrics and logs**: Collect and analyze data from Azure resources, operating systems, and applications
* **Log Analytics workspaces**: Centralized storage and analysis of log data with powerful query capabilities
* **Application Insights**: Application performance management (APM) for monitoring live web applications
* **Azure Monitor Alerts**: Proactive notifications based on metrics, logs, and activity data
* **Azure Workbooks**: Interactive visual reports combining text, queries, metrics, and parameters

For security monitoring, Azure Monitor integrates with Microsoft Sentinel and Microsoft Defender for Cloud to provide comprehensive threat detection and response capabilities.

Learn more:

* [Azure Monitor overview](/azure/azure-monitor/overview)
* [Azure Monitor Logs overview](/azure/azure-monitor/logs/data-platform-logs)
* [Threat detection overview](/azure/security/fundamentals/threat-detection)

## Azure role-based access control

Azure role-based access control (Azure RBAC) provides fine-grained access management for Azure resources. With Azure RBAC, you grant users only the access they need to perform their jobs, following the principle of least privilege.

Azure RBAC enables you to:

* Assign built-in roles or create custom roles
* Control access at multiple scope levels (management group, subscription, resource group, resource)
* Separate duties within teams and grant only necessary access
* Integrate with Microsoft Entra ID for identity-based access control
* Audit role assignments through Azure Activity Log

Learn more:

* [What is Azure role-based access control (Azure RBAC)?](/azure/role-based-access-control/overview)
* [Azure built-in roles](/azure/role-based-access-control/built-in-roles)
* [Identity management security overview](/azure/security/fundamentals/identity-management-overview)

## Azure Policy

[Azure Policy](/azure/governance/policy/overview) helps you enforce organizational standards and assess compliance at scale. Azure Policy evaluates resources in Azure by comparing their properties to defined rules.

Azure Policy capabilities include:

* **Policy definitions**: Rules that describe compliance conditions and effects
* **Initiatives**: Collections of policy definitions grouped to achieve specific compliance goals
* **Compliance reporting**: Dashboard views showing compliant and non-compliant resources
* **Automatic remediation**: Deploy corrective configurations for non-compliant resources
* **Regulatory compliance**: Built-in policy sets aligned with standards like Microsoft cloud security benchmark, ISO 27001, and NIST

Common security use cases:

* Enforce encryption requirements for storage accounts and databases
* Require diagnostic settings for audit logging
* Restrict resource deployments to approved Azure regions
* Enforce naming conventions and tagging standards
* Require specific security configurations (TLS versions, firewall rules)

Learn more:

* [What is Azure Policy?](/azure/governance/policy/overview)
* [Azure Policy regulatory compliance](/azure/governance/policy/concepts/regulatory-compliance)

## Azure Update Manager

[Azure Update Manager](/azure/update-manager/overview) is a unified service that helps you manage and govern operating system updates for Windows and Linux virtual machines across Azure, on-premises, and multicloud environments.

Azure Update Manager provides:

* **Update assessment**: Automatic or on-demand assessment of available updates
* **Scheduled patching**: Configure recurring maintenance windows for update installation
* **One-time updates**: Install updates immediately for urgent security patches
* **Hotpatching**: Install security updates on Windows Server without requiring reboots (supported SKUs)
* **Update compliance reporting**: Dashboard views and Azure Workbooks showing update status
* **Integration with Azure Policy**: Enforce update policies at scale

Update Manager features include:

* Native Azure experience with zero onboarding required
* Granular access control at the resource level using Azure RBAC
* Support for Azure VMs and Azure Arc-enabled servers
* Pre and post-event scripts for custom automation
* Integration with Azure Monitor for alerts and notifications

Learn more:

* [About Azure Update Manager](/azure/update-manager/overview)
* [Scheduled patching in Update Manager](/azure/update-manager/scheduled-patching)

## Activity logging and auditing

Azure Activity Log records subscription-level events including administrative operations, service health events, and resource health changes. Activity Log provides visibility into who performed what operations and when.

Activity Log capabilities:

* **Administrative operations**: Create, update, delete operations on Azure resources
* **Service health**: Azure service incidents and maintenance notifications  
* **Resource health**: Availability status changes for Azure resources
* **Retention and export**: Retain logs for up to 90 days; export to Log Analytics, Storage, or Event Hubs for longer retention
* **Integration with alerts**: Create alert rules based on Activity Log events

For comprehensive security auditing, you can configure diagnostic settings to send logs to Log Analytics workspaces for analysis with Microsoft Sentinel or Defender for Cloud.

Learn more:

* [Azure Activity Log](/azure/azure-monitor/essentials/activity-log)
* [Diagnostic settings](/azure/azure-monitor/essentials/diagnostic-settings)

## Microsoft Cost Management

[Microsoft Cost Management](/azure/cost-management-billing/costs/overview-cost-management) helps you monitor, allocate, and optimize your Azure spending. Understanding costs is essential for security management as unauthorized resource deployments can indicate security incidents.

Cost Management provides:

* **Cost analysis**: Visualize and analyze costs across subscriptions, resource groups, and tags
* **Budgets**: Set spending limits with proactive alerts
* **Recommendations**: Identify opportunities to reduce costs without compromising security
* **Cost allocation**: Distribute costs across business units using tags and subscriptions
* **Anomaly detection**: Identify unusual spending patterns that may indicate security issues

Learn more:

* [What is Microsoft Cost Management?](/azure/cost-management-billing/costs/overview-cost-management)
* [Create and manage budgets](/azure/cost-management-billing/costs/tutorial-acm-create-budgets)

## Azure Resource Graph

[Azure Resource Graph](/azure/governance/resource-graph/overview) provides efficient resource exploration with the ability to query at scale across subscriptions. Resource Graph enables security teams to quickly identify resources with specific configurations or security postures.

Resource Graph capabilities:

* **Fast querying**: Query thousands of resources across multiple subscriptions in seconds
* **Complex queries**: Use Kusto Query Language (KQL) to analyze resource properties and relationships
* **Resource inventory**: Discover all resources of specific types or with particular configurations
* **Compliance verification**: Identify resources that don't meet security or compliance requirements
* **Change tracking**: Track resource property changes over time

Learn more:

* [What is Azure Resource Graph?](/azure/governance/resource-graph/overview)
* [Starter Resource Graph queries](/azure/governance/resource-graph/samples/starter)

## Azure Automation

[Azure Automation](/azure/automation/overview) delivers cloud-based automation and configuration management supporting consistent governance across Azure and non-Azure environments.

Azure Automation provides:

* **Process automation**: Automate frequent, time-consuming, and error-prone tasks using PowerShell and Python runbooks
* **Configuration management**: Apply and maintain desired state configurations using State Configuration (DSC)
* **Shared resources**: Centralized storage for credentials, certificates, connections, and variables used in automation
* **Change tracking**: Monitor configuration changes across files, registry, services, and software
* **Inventory collection**: Discover and track software and configurations across machines

Common security automation scenarios:

* Automated incident response workflows
* Scheduled security scans and remediation
* Configuration drift detection and correction
* Automated backup and disaster recovery operations

Learn more:

* [Azure Automation overview](/azure/automation/overview)
* [Change Tracking and Inventory overview](/azure/automation/change-tracking/overview)

## Azure Advisor

[Azure Advisor](/azure/advisor/advisor-overview) is a personalized cloud consultant that provides best practice recommendations to optimize your Azure deployments. Advisor includes security recommendations from Microsoft Defender for Cloud.

Advisor recommendation categories:

* **Reliability**: Improve availability and disaster recovery capabilities
* **Security**: Detect threats and vulnerabilities through Defender for Cloud integration
* **Performance**: Improve application speed and responsiveness
* **Cost**: Optimize and reduce overall Azure spending
* **Operational Excellence**: Achieve process and workflow efficiency

Learn more:

* [Azure Advisor overview](/azure/advisor/advisor-overview)
* [Get started with Azure Advisor](/azure/advisor/advisor-get-started)

## Azure Service Health

[Azure Service Health](/azure/service-health/overview) provides personalized information about the health of your Azure services and regions. Service Health helps you plan for maintenance and respond to incidents that may affect availability.

Service Health components:

* **Azure status**: Global view of Azure service health across all regions
* **Service Health**: Personalized view of the health of Azure services you use in the regions you use them
* **Resource Health**: Health information about individual Azure resources
* **Health alerts**: Proactive notifications about service issues, planned maintenance, and health advisories

Learn more:

* [What is Azure Service Health?](/azure/service-health/overview)
* [Create activity log alerts on service notifications](/azure/service-health/alerts-activity-log-service-notifications-portal)

## Next steps

* [Threat detection and protection](/azure/security/fundamentals/threat-detection)
* [Identity management security overview](/azure/security/fundamentals/identity-management-overview)
* [Network security overview](/azure/security/fundamentals/network-overview)
* [Azure security best practices and patterns](/azure/security/fundamentals/best-practices-and-patterns)
