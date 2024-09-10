---
title: Azure Automanage best practices to Azure Policy migration planning
description: This article provides process and technical guidance for customers interested in moving from Azure Automanage best practices to Azure Policy.
ms.date: 08/21/2024
ms.topic: how-to
author: MutemwaRMasheke
ms.author: mmasheke
---
 
# Overview

> [!CAUTION]
> On September 30, 2027, the Azure Automanage best practices product will be retired. Migrate to Azure Policy before that date. For more information on migration, see the [Azure portal](https://ms.portal.azure.com/).

Azure Policy is a more robust cloud resource governance, enforcement, and compliance offering with full parity with the Automanage best practices service. When possible, you should plan to move your content and machines to the new service. This article provides guidance on developing a migration strategy from Automation to machine
configuration. Azure Policy implements a robust array of features, including:

- **Granular control and flexibility:** Azure Policy allows for highly granular control over resources. You can create custom policies tailored to your specific regulatory and organizational compliance needs to ensure that every aspect of your infrastructure meets the required standards. This level of customization might not be as easy to achieve with the predefined configurations in Automanage.
- **Comprehensive compliance management:** Azure Policy offers comprehensive compliance management by continuously assessing and auditing your resources. Detailed reports and dashboards help you to track compliance status. These features help you to quickly detect and rectify noncompliance issues across your environment.
- **Scalability:** Azure Policy is built to manage large-scale environments efficiently. You can apply policies at different scopes, for example, Management Group, Subscription, and Resource Group levels. This capability helps you to enforce compliance across multiple resources and regions systematically.
- **Integration with Azure Security Center:** Azure Policy integrates seamlessly with Azure Security Center. You have the ability to manage security policies and ensure that your servers adhere to best practices. This integration provides more insights and recommendations, which further strengthens your security posture.

Before you begin, it's a good idea to read the conceptual overview information on the [Azure Policy][01] webpage.

## Understand migration

The best approach to migration is to identify how to map services in an Automanage configuration profile to the respective Azure Policy content first. Then offboard your subscriptions from Automanage. This section outlines the expected steps for migration.

Automanage capabilities are involved in creating a deploy-and-forget experience for Azure customers to onboard new and existing virtual machines (VMs) to a recommended set of Azure Services to ensure compliance with Azure's best practices. These capabilities include a configuration profile, a reusable template of management, monitoring, security, and resiliency services that customers can opt into. The profile is then assigned to a set of VMs that are onboarded to those services and receive reports on the state of their machines.

This functionality is available in Azure Policy as an initiative with various configurable parameters, Azure services, regional availability, compliance states, and remediation actions. Configuration profiles are the main onboarding vehicle for Automanage customers. Just like Azure Policy initiatives, Automanage configuration profiles are applicable to VMs at the subscription and resource group level. They enable further specification of the zone of
applicability. The following Automanage feature parities are available in Azure Policy.

### Azure Monitor agent

The Azure Monitor agent collects monitoring data from the guest operating system of Azure and hybrid VMs. The agent delivers the data to Azure Monitor for use by features, insights, and other services, such as Microsoft Sentinel and Microsoft Defender for Cloud. The Azure Monitor agent replaces all of the Azure Monitor legacy monitoring agents.

Deploy this extension by using the following policies:

- Configure Linux VMs to run the Azure Monitor agent with user-assigned managed identity-based authentication.
- Configure Windows machines to associate with a data collection rule or a data collection endpoint.
- Configure Windows VMs to run the Azure Monitor agent with user-assigned managed identity-based authentication.
- Configure Linux machines to associate with a data collection rule or a data collection endpoint.
- Deploy a dependency agent for Linux VMs with Azure Monitor agent settings.
- Deploy a dependency agent to enable on Windows VMs with Azure Monitor agent settings.

### Azure Backup

Azure Backup provides independent and isolated backups to guard against unintended destruction of the data on your VMs. Backups are stored in a Recovery Services vault with built-in management of recovery points. To back up Azure VMs, Azure Backup installs an extension on the VM agent running on the machine.

Configure Azure Backup by using the following policies:

- Configure backup on VMs with a given tag to an existing recovery services vault in the same location.
- Azure Backup should be enabled for VMs.

To configure backup time and duration, you can create a custom Azure policy based on the properties of the Azure backup policy resource or by a REST API call. Learn more [here][02].

### Azure Antimalware

Microsoft Antimalware for Azure is a free real-time protection that helps identify and remove viruses, spyware, and other malicious software. It generates alerts when knownmalicious or unwanted software tries to install itself or run on your Azure systems. The Azure Guest Agent (or the Fabric Agent) launches the Antimalware Extension, applying the
Antimalware configuration settings supplied as input. This step enables the Antimalware
service with either default or custom configuration settings.

The following Azure Antimalware policies are deployable in Azure Policy:

- Microsoft Antimalware for Azure should be configured to automatically update protection signatures.
- Microsoft IaaSAntimalware extension should be deployed on Windows servers.
- Deploy default Microsoft IaaSAntimalware extension for Windows Server.

To configure excluded files, locations, file extensions and processes, enable real-time protection and schedule scan and scan type, day and time, you can create a custom Azure policy based on the properties of the Azure IaaSAntimalware policy resource or by an Azure Resource Manager template (ARM template). Learn more [here][03].

### Azure Insights and Analytics

Azure Insights is a suite of tools within Azure Monitor designed to enhance the performance, reliability, and quality of your applications. It offers features like application performance management (APM), monitoring alerts, metrics analysis, diagnostic settings, logs, and more. With Azure Insights, you can gain valuable insights into your application’s behavior, troubleshoot issues, and optimize performance.

The following policies provide the same capabilities as Automanage:

- Assign built-in user-assigned managed identity to VMs.
- Configure Linux VMs to run the Azure Monitor agent with user-assigned managed identity-based authentication.
- Configure Windows VMs to run the Azure Monitor agent with user-assigned managed identity-based authentication.
- Deploy a dependency agent to enable on Windows VMs with Azure Monitor agent settings.
- Deploy a dependency agent for Linux VMs with Azure Monitor agent settings.
- Configure Linux machines to be associated with a data collection rule or a data collection endpoint.
- Configure Windows machines to be associated with a data collection rule or a data collection endpoint.

All the previous options are configurable by deploying the **Enable Azure Monitor for VMs with Azure
Monitor agent** policy initiative.

### Change Tracking and Inventory

Change Tracking and Inventory is a feature within Automation that monitors changes in VMs across Azure, on-premises, and other cloud environments. It tracks modifications to installed software, files, registry keys, and services on both Windows and Linux systems. By using the Log Analytics agent, the `ChangeTracking` service collects data and forwards it to Azure Monitor Logs for analysis. It also integrates with Microsoft Defender for Cloud File Integrity Monitoring (FIM) to enhance security and operational insights.

Enable change tracking on VMs by using the following policies:

- Assign built-in user-assigned managed identity to VMs.
- Configure Windows VMs to install the Azure Monitor agent for `ChangeTracking` and `Inventory` with user-assigned managed identity.
- Configure Linux VMs to install the Azure Monitor agent for `ChangeTracking` and `Inventory` with user-assigned managed identity.
- Configure ChangeTracking Extension for Windows VMs.
- Configure ChangeTracking Extension for Linux VMs.
- Configure Windows VMs to be associated with a data collection rule for `ChangeTracking` and `Inventory`.

Configure the preceding Azure policies in bulk by using the following Azure Policy initiatives:

- [Preview]: Enable `ChangeTracking` and `Inventory` for virtual machine scale sets.
- [Preview]: Enable `ChangeTracking` and `Inventory` for VMs.
- [Preview]: Enable `ChangeTracking` and `Inventory` for Azure Arc-enabled VMs.

### Microsoft Defender for Cloud

Microsoft Defender for Cloud provides unified security management and advanced threat protection across hybrid cloud workloads.

Configure Defender for Cloud in Azure Policy through the following policy initiatives:

- Configure multiple Microsoft Defender for Endpoint integration settings with Defender for Cloud.
- Microsoft cloud security benchmark
- Configure Defender for Cloud plans.

### Azure Update Manager

Azure Update Manager is a service included as part of your Azure subscription. You can use it to assess your update status across your environment and manage your Windows and Linux server patching from a single pane of glass, both for on-premises and Azure. It provides a unified solution to help you keep your systems up to date. Update Manager oversees update compliance, deploys critical updates, and offers flexible patching options.

Configure Update Manager in Azure Policy through the following policies:

- Configure periodic checking for missing system updates on servers enabled by Azure Arc.
- Configure machines periodically to check for missing system updates.
- Schedule recurring updates by using Update Manager.
- [Preview]: Set prerequisites for scheduling recurring updates on Azure VMs.
- Configure periodic checking for missing system updates on Azure VMs.

### Azure Automation account

Azure Automation is a cloud-based service that provides consistent management across both your Azure and non-Azure environments. Use it to automate repetitive tasks, enforce configuration consistency, and manage updates for VMs. By using runbooks and shared assets, you can streamline operations and reduce operational costs.

Configure Automation in Azure Policy through the following policies:

- Use managed identity for Automation accounts.
- Configure private endpoint connections on Automation accounts.
- Disable public network access for Automation accounts.
- Configure Automation accounts with private DNS zones.
- Use customer-managed keys to encrypt data at rest for Automation accounts.
- Disable the local authentication method for the Automation account.
- Encrypt Automation account variables.
- Configure Automation accounts to disable local authentication.
- Configure Automation accounts to disable public network access.
- Enable private endpoint connections on Automation accounts.

### Boot diagnostics

Boot diagnostics is a debugging feature for Azure VMs that you can use to diagnose VM boot failures. The feature collects serial log information and screenshots so that you can observe the state of your VM as it's booting up. When you enable the boot diagnostics feature, the Azure Cloud platform can inspect the VM operating system for provisioning errors. The feature helps to provide deeper information on the root causes of startup failures. Boot diagnostics is enabled by default when you create a VM and is enforced by the **Boot diagnostics should be enabled on VMs** policy.

### Windows Admin Center

Boot diagnostics is a debugging feature for Azure VMs that helps you to diagnose VM boot failures. It collects serial log information and screenshots during the boot process. You can use an ARM template or a custom Azure Policy for configuration. For more information, see [Manage a Windows VM by using Windows Admin Center in Azure][04].

### Log Analytics workspace

Azure Log Analytics is a service that monitors your cloud and on-premises resources and applications. You can use it to collect and analyze data generated by resources in your cloud and on-premises environments. With Azure Log Analytics, you can search, analyze, and visualize data to identify trends, troubleshoot issues, and monitor your systems.

On August 31, 2024, both Automation Update Management and the Log Analytics agent it used were retired. You should have migrated to Azure Update Manager before that date. For guidance on how to migrate to Azure Update Manager, see [Overview of migration from Automation Update Management to Azure Update Manager][05]. We advise you to migrate [now][06] because this feature is no longer supported in Automanage.

## Pricing

Automanage best practices is a cost-free service, and you won't receive a bill from Automanage. If you used Automanage to enable paid services like Application Insights, you might incur usage charges that are billed directly by those services.

Read more about Automanage and pricing on the [Azure Automanage pricing webpage][09].

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, here are the suggested next steps:

- [Review the policy definition structure][07]
- [Assign a policy definition by using the portal][08]

<!-- Reference link definitions -->
[01]: ../overview.md
[02]: ../../../backup/backup-azure-arm-userestapi-createorupdatepolicy.md
[03]: /azure/virtual-machines/extensions/iaas-antimalware-windows
[04]: https://learn.microsoft.com/windows-server/manage/windows-admin-center/azure/manage-vm
[05]: ../../../update-manager/migration-overview.md
[06]: https://ms.portal.azure.com/
[07]: ../concepts/definition-structure-basics.md
[08]: ../assign-policy-portal.md
[09]: https://azure.microsoft.com/pricing/details/azure-automanage/
