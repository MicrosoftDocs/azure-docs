---
title: Azure Automanage Best Practices to Azure Policy migration planning
description: This article provides process and technical guidance for customers interested in moving from Automanage Best Practices to Azure Policy.
ms.date: 08/21/2024
ms.topic: how-to
author: MutemwaRMasheke
ms.author: mmasheke
---
 
# Overview

> [!CAUTION]
> On September 30, 2027, the Automanage Best Practices product will be retired. Migrate to Azure Policy before that date. [Migrate here](https://ms.portal.azure.com/).

Azure Policy is a more robust cloud resource governance, enforcement and compliance offering with full parity with the Automanage Best Practices service. When possible, you should plan to move your content and machines to the new service. This
article provides guidance on developing a migration strategy from Azure Automation to machine
configuration. Azure Policy implements a robust array of features including:

- *Granular Control and Flexibility:* Azure Policy allows for highly granular control over resources. You can create custom policies tailored to your specific regulatory and organizational compliance needs, ensuring that every aspect of your infrastructure meets the required standards. This level of customization may not be as easily achievable with the predefined configurations in Automanage.

- *Comprehensive Compliance Management:* Azure Policy offers comprehensive compliance management by continuously assessing and auditing your resources. It provides detailed reports and dashboards to track compliance status, helping you to quickly detect and rectify non-compliance issues across your environment.

- *Scalability:* Azure Policy is built to manage large-scale environments efficiently. It allows you to apply policies at different scopes (for example, Management Group, Subscription, Resource Group levels), making it easier to enforce compliance across multiple resources and regions systematically.

- *Integration with Azure Security Center:* Azure Policy integrates seamlessly with Azure Security Center, enhancing your ability to manage security policies and ensuring your servers adhere to best practices. This integration provides more insights and recommendations, further strengthening your security posture.

Before you begin, it's a good idea to read the conceptual overview information at the page
[Azure Policy][01].

## Understand migration

The best approach to migration is to identify how to map services in an Automanage configuration profile to respective Azure Policy content first, and then offboard your subscriptions from Automanage. This section outlines the expected steps for migration. Automanage’s capabilities involved creating a deploy-and-forget experience for Azure customers to onboard new and existing virtual machines to a recommended set of Azure Services to ensure compliance with Azure’s best practices. These capabilities were achieved by the creation of a configuration profile, a reusable template of management, monitoring,
security and resiliency services that customers could opt into. The profile is then assigned to a set of VMs that are onboarded to those services and receive reports on the state of their machines. 


This functionality is available in Azure Policy as an initiative with a variety of configurable parameters, Azure services, regional availability, compliance states, and remediation actions. Configuration Profiles are the main onboarding vehicle for Automanage customers. Just like Azure Policy Initiatives, Automanage configuration profiles are applicable to VMs at the
subscription and resource group level and enables further specification of the zone of
applicability.  The following Automanage feature parities are available in Azure Policy:

### Azure Monitoring Agent

Azure Monitor Agent (AMA) collects monitoring data from the guest operating system of
Azure and hybrid virtual machines and delivers it to Azure Monitor for use by features,
insights, and other services, such as Microsoft Sentinel and Microsoft Defender for Cloud.
Azure Monitor Agent replaces all of Azure Monitor's legacy monitoring agents. This
extension is deployable using the following Azure Policies:

- Configure Linux virtual machines to run Azure Monitor Agent with user-assigned
managed identity-based authentication
- Configure Windows Machines to be associated with a Data Collection Rule or a
Data Collection Endpoint
- Configure Windows virtual machines to run Azure Monitor Agent with user-assigned
managed identity-based authentication
- Configure Linux Machines to be associated with a Data Collection Rule or a Data
Collection Endpoint
- Deploy Dependency agent for Linux virtual machines with Azure Monitoring Agent
settings
- Deploy Dependency agent to be enabled on Windows virtual machines with Azure
Monitoring Agent settings

### Azure Backup

Azure Backup provides independent and isolated backups to guard against unintended
destruction of the data on your VMs. Backups are stored in a Recovery Services vault with
built-in management of recovery points. To back up Azure VMs, Azure Backup installs an
extension on the VM agent running on the machine. Azure Backup can be configured using
the following policies:

- Configure backup on virtual machines with a given tag to an existing recovery
services vault in the same location
- Azure Backup should be enabled for Virtual Machines

To configure backup time and duration, you can create a custom Azure policy based on the
properties of the Azure backup policy resource or by a REST API call. Learn more [here][02].

### Azure Antimalware

Microsoft Antimalware for Azure is a free real-time protection that helps identify and
remove viruses, spyware, and other malicious software. It generates alerts when known
malicious or unwanted software tries to install itself or run on your Azure systems. The
Azure Guest Agent (or the Fabric Agent) launches the Antimalware Extension, applying the
Antimalware configuration settings supplied as input. This step enables the Antimalware
service with either default or custom configuration settings.
The following Azure Antimalware policies are deployable in Azure Policy:

- Microsoft Antimalware for Azure should be configured to automatically update
protection signatures
- Microsoft IaaSAntimalware extension should be deployed on Windows servers
- Deploy default Microsoft IaaSAntimalware extension for Windows Server

To configure excluded files, locations, file extensions and processes, enable real-time
protection and schedule scan and scan type, day and time, you can create a custom Azure
policy based on the properties of the Azure IaaSAntimalware policy resource or by an ARM
Template. Learn more [here][03].

### Azure Insights and Analytics

Azure Insights is a suite of tools within Azure Monitor designed to enhance the
performance, reliability, and quality of your applications. It offers features like application
performance management (APM), monitoring alerts, metrics analysis, diagnostic settings,
logs, and more. With Azure Insights, you can gain valuable insights into your application’s
behavior, troubleshoot issues, and optimize performance. The following policies provide
the same capabilities as Automanage:

- Assign Built-In User-Assigned Managed Identity to Virtual Machines
- Configure Linux virtual machines to run Azure Monitor Agent with user-assigned
managed identity-based authentication
- Configure Windows virtual machines to run Azure Monitor Agent with user-assigned managed identity-based authentication
- Deploy Dependency agent to be enabled on Windows virtual machines with
Azure Monitoring Agent settings
- Deploy Dependency agent for Linux virtual machines with Azure Monitoring
Agent settings
- Configure Linux Machines to be associated with a Data Collection Rule or a Data
Collection Endpoint
- Configure Windows Machines to be associated with a Data Collection Rule or a
Data Collection Endpoint

All the previous options are configurable by deploying the Enable Azure Monitor for VMs with Azure
Monitoring Agent (AMA) Policy initiative.

### Change Tracking and Inventory

Change Tracking and Inventory is a feature within Azure Automation that monitors changes
in virtual machines across Azure, on-premises, and other cloud environments. It tracks
modifications to installed software, files, registry keys, and services on both Windows and
Linux systems. By using the Log Analytics agent, the Change Tracking service collects data and forwards it to
Azure Monitor Logs for analysis. Additionally, it integrates with Microsoft Defender for
Cloud File Integrity Monitoring (FIM) to enhance security and operational insights. The
following policies enable change tracking on VMs:

- Assign Built-In User-Assigned Managed Identity to Virtual Machines
- Configure Windows VMs to install AMA for ChangeTracking and Inventory with user-assigned managed identity
- Configure Linux VMs to install AMA for ChangeTracking and Inventory with user-assigned managed identity
- Configure ChangeTracking Extension for Windows virtual machines
- Configure ChangeTracking Extension for Linux virtual machines
- Configure Windows Virtual Machines to be associated with a Data Collection Rule
for ChangeTracking and Inventory

The above Azure policies are configurable in bulk using the following Policy initiatives:

- [Preview]: Enable ChangeTracking and Inventory for virtual machine scale sets
- [Preview]: Enable ChangeTracking and Inventory for virtual machines
- [Preview]: Enable ChangeTracking and Inventory for Arc-enabled virtual machines

### Microsoft Defender for Cloud

Microsoft Defender for Cloud provides unified security management and advanced threat
protection across hybrid cloud workloads. MDC is configurable in Policy through the
following policy initiatives:

- Configure multiple Microsoft Defender for Endpoint integration settings with
Microsoft Defender for Cloud
- Microsoft cloud security benchmark
- Configure Microsoft Defender for Cloud plans

### Update Management

Azure Update Management is a service included as part of your Azure Subscription that
enables you to assess your update status across your environment and manage your
Windows and Linux server patching from a single pane of glass, both for on-premises and
Azure. It provides a unified solution to help you keep your systems up to date by overseeing
update compliance, deploying critical updates, and offering flexible patching options.
Azure Update Management is configurable in Azure Policy through the following policies:

- Configure periodic checking for missing system updates on Azure Arc-enabled
servers
- Machines should be configured to periodically check for missing system updates
- Schedule recurring updates using Azure Update Manager
- [Preview]: Set prerequisite for Scheduling recurring updates on Azure virtual
machines.
- Configure periodic checking for missing system updates on Azure virtual machines

### Azure Automation Account

Azure Automation is a cloud-based service that provides consistent management across
both your Azure and non-Azure environments. It allows you to automate repetitive tasks,
enforce configuration consistency, and manage updates for virtual machines. By
leveraging runbooks and shared assets, you can streamline operations and reduce
operational costs. Azure Automation is configurable in Azure Policy through the following
policies:

- Automation Account should have Managed Identity
- Configure private endpoint connections on Azure Automation accounts
- Automation accounts should disable public network access
- Configure Azure Automation accounts with private DNS zones
- Azure Automation accounts should use customer-managed keys to encrypt data at
rest
- Azure Automation account should have local authentication method disabled
- Automation account variables should be encrypted
- Configure Azure Automation account to disable local authentication
- Configure Azure Automation accounts to disable public network access
- Private endpoint connections on Automation Accounts should be enabled

### Boot Diagnostics

Azure Boot Diagnostics is a debugging feature for Azure virtual machines (VM) that allows
diagnosis of VM boot failures. It enables a user to observe the state of their VM as it is
booting up by collecting serial log information and screenshots. Enabling Boot Diagnostics
feature allows Microsoft Azure cloud platform to inspect the virtual machine operating
system (OS) for provisioning errors, helping to provide deeper information on the root
causes of the startup failures. Boot diagnostics is enabled by default when we create a VM
and is enforced by the _Boot Diagnostics should be enabled on virtual machines_ policy.

### Windows Admin Center

Azure Boot Diagnostics is a debugging feature for Azure virtual machines (VM) that allows
diagnosis of VM boot failures by collecting serial log information and screenshots during
the boot process. It's configurable either through an ARM template or a custom Azure Policy. Learn more [here][04].

### Log Analytics Workspace

Azure Log Analytics is a service that monitors your cloud and on-premises resources and
applications. It allows you to collect and analyze data generated by resources in your
cloud and on-premises environments. With Azure Log Analytics, you can search, analyze,
and visualize data to identify trends, troubleshoot issues, and monitor your systems. On August 31, 2024, both Automation Update Management and the Log Analytics agent it uses
will be retired. Migrate to Azure Update Manager before that. Refer to guidance on
migrating to Azure Update Manager [here][05]. We advise you to migrate [now][06] as this feature will
no longer be supported in Automanage.

## Pricing

As you migrate, it's worthwhile to note that Automanage Best Practices is a cost-free service. As such, you won't receive a bill from the Automanage service. 
However, if you used Automanage to enable paid services like Azure Insights, there may be usage charges incurred that are billed directly by those services.
Read more about Automanage and pricing [here][09].

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, here are the suggested
next steps:

- [Review the policy definition structure][07].
- [Assign a policy definition using the portal][08].

<!-- Reference link definitions -->
[01]: ../overview.md
[02]: ../../../backup/backup-azure-arm-userestapi-createorupdatepolicy.md
[03]: /azure/virtual-machines/extensions/iaas-antimalware-windows
[04]: /windows-server/manage/windows-admin-center/azure/manage-vm
[05]: ../../../update-manager/migration-overview.md
[06]: https://ms.portal.azure.com/
[07]: ../concepts/definition-structure-basics.md
[08]: ../assign-policy-portal.md
[09]: https://azure.microsoft.com/pricing/details/azure-automanage/
