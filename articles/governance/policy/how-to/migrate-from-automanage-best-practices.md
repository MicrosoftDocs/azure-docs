---
title: Azure Automanage Best Practices to Azure Policy migration planning
description: This article provides process and technical guidance for customers interested in moving from Azure Automanage Best Practices to Azure Policy.
ms.date: 08/21/2024
ms.topic: how-to
author: MutemwaRMasheke
ms.author: mmasheke
---

# Automanage Best Practices to Azure Policy migration planning

> [!CAUTION]
> On September 30, 2027, the Azure Automanage Best Practices service will be retired. Migrate to Azure Policy before that date. For more information on migration, see the [Azure portal](https://portal.azure.com/).

Azure Policy is a more robust cloud resource governance, enforcement, and compliance offering with full parity with the Azure Automanage Best Practices service. When possible, you should plan to move your content and machines to the new service. This article provides guidance on developing a migration strategy from Azure Automation to machine
configuration. Azure Policy implements a robust array of features, including:

- **Granular control and flexibility:** Azure Policy allows for highly granular control over resources. You can create custom policies tailored to your specific regulatory and organizational compliance needs to ensure that every aspect of your infrastructure meets the required standards. This level of customization might not be as easy to achieve with the predefined configurations in Automanage.
- **Comprehensive compliance management:** Azure Policy offers comprehensive compliance management by continuously assessing and auditing your resources. Detailed reports and dashboards help you to track compliance status. These features help you to quickly detect and rectify noncompliance issues across your environment.
- **Scalability:** Azure Policy is built to manage large-scale environments efficiently. You can apply policies at different scopes, such as management group, subscription, and resource group levels. This capability helps you to enforce compliance across multiple resources and regions systematically.
- **Integration with Azure Security Center:** Azure Policy integrates seamlessly with Azure Security Center. You have the ability to manage security policies and ensure that your servers adhere to best practices. This integration provides more insights and recommendations, which further strengthen your security posture.

Before you begin, read the conceptual overview information on the [Azure Policy][01] webpage.

## Understand migration

The best approach to migration is to identify how to map services in an Automanage configuration profile to the respective Azure Policy content first. Then offboard your subscriptions from Automanage. This section outlines the expected steps for migration.

Automanage designers created an experience for Azure customers to onboard new and existing virtual machines (VMs) to a recommended set of Azure services to ensure compliance with Azure best practices. The capabilities include a configuration profile, a reusable template of management, monitoring, security, and resiliency services that customers can opt into. The profile is assigned to a set of VMs that are onboarded to those services, and customers then receive reports on the state of their machines.

This functionality is available in Azure Policy as an initiative with various configurable parameters, Azure services, regional availability, compliance states, and remediation actions. Configuration profiles are the main onboarding vehicle for Automanage customers. Just like Azure Policy initiatives, Automanage configuration profiles apply to VMs at the subscription and resource group level. They enable further specification of the zone of
applicability. The following Automanage feature parities are available in Azure Policy.

### Azure Monitor Insights and analytics

[Azure Monitor][13] is a suite of tools designed to enhance the performance, reliability, and quality of your applications. It offers features like application performance management, monitoring alerts, metrics analysis, diagnostic settings, and logs. With Azure Monitor Insights, you can gain valuable insights into your application's behavior, troubleshoot issues, and optimize performance.

The Azure Monitor agent collects monitoring data from the guest operating system of Azure and hybrid VMs. The agent delivers the data to Azure Monitor for use by features, insights, and other services, such as Microsoft Sentinel and Microsoft Defender for Cloud. The Azure Monitor agent replaces all of the Azure Monitor legacy monitoring agents like the deprecated Microsoft Monitor Agent. The new Azure Monitor Agent is unsupported in Automanage but can be configured at-scale using Azure Policy. Visit [Azure Monitor Agent Built-In Policy][12] to learn more.

### Azure Backup

[Azure Backup][14] provides independent and isolated backups to guard against unintended destruction of the data on your VMs. Backups are stored in a Recovery Services vault with built-in management of recovery points. To back up Azure VMs, Backup installs an extension on the VM agent running on the machine. Visit [Azure Backup Built-In Policy][11] to learn how to configure Backup at scale through Azure Policy. To configure Backup time and duration, create a custom Azure policy based on the properties of the Backup policy resource or by a REST API call. For more information, see [Create Recovery Services backup policies by using the REST API][02].

### Microsoft Antimalware for Azure

[Microsoft Antimalware][10] for Azure Cloud Services and Virtual Machines offers free real-time protection that helps identify and remove viruses, spyware, and other malicious software. It generates alerts when known malicious or unwanted software tries to install itself or run on your Azure systems. The Azure Guest agent (or the Microsoft Fabric agent) opens the Microsoft Antimalware for Azure extension and applies the antimalware configuration settings that were supplied as input. This step enables the antimalware service with either default or custom configuration settings.

Deploy the following Microsoft Antimalware for Azure policies in Azure Policy:

- Configure Microsoft Antimalware for Azure to automatically update protection signatures.
- Deploy the Microsoft `IaaSAntimalware` extension on Windows servers.
- Deploy the default Microsoft `IaaSAntimalware` extension for Windows Server.

You can create a custom Azure policy based on the properties of the Azure `IaaSAntimalware` policy resource or by using an Azure Resource Manager template (ARM template). You can use the custom policy to:

- Configure excluded files, locations, file extensions, and processes.
- Enable real-time protection.
- Schedule a scan, and scan type, day, and time.

For more information, see [this webpage][03].

### Change Tracking and Inventory

[Change Tracking and Inventory][15] is a feature within Automation that monitors changes in VMs across Azure, on-premises, and in other cloud environments. It tracks modifications to installed software, files, registry keys, and services on both Windows and Linux systems. Change Tracking and Inventory uses the Log Analytics agent to collect data and then forwards it to Azure Monitor Logs for analysis. It also integrates with Microsoft Defender for Cloud File Integrity Monitoring to enhance security and operational insights.

Enable change tracking on VMs by using the following policies:

- Assign built-in user-assigned managed identity to VMs.
- Configure Windows VMs to install the Azure Monitor agent for Change Tracking and Inventory with user-assigned managed identity.
- Configure Linux VMs to install the Azure Monitor agent for Change Tracking and Inventory with a user-assigned managed identity.
- Configure the Change Tracking and Inventory extension for Windows VMs.
- Configure the Change Tracking and Inventory extension for Linux VMs.
- Configure Windows VMs to associate with a data collection rule for Change Tracking and Inventory.

Configure the preceding Azure policies in bulk by using the following Azure Policy initiatives:

- [Preview]: Enable Change Tracking and Inventory for virtual machine scale sets.
- [Preview]: Enable Change Tracking and Inventory for VMs.
- [Preview]: Enable Change Tracking and Inventory for Azure Arc-enabled VMs.

### Microsoft Defender for Cloud

[Microsoft Defender for Cloud][16] (MDC) provides unified security management and advanced threat protection across hybrid cloud workloads. Visit [Configure Defender for Cloud in Azure Policy][17] to learn more about at-scale compliance and monitoring for MDC.

### Azure Update Manager

[Azure Update Manager][19] (AUM) is a service included as part of your Azure subscription. Use it to assess your update status across your environment and manage your Windows and Linux server patching from a single pane of glass, both for on-premises and Azure. It provides a unified solution to help you keep your systems up to date. Update Manager oversees update compliance, deploys critical updates, and offers flexible patching options. Visit [Azure Update Manager Built-In Policy][18] to learn how to configure AUM at scale through Azure Policy.

### Azure Automation account

[Azure Automation][21] is a cloud-based service that provides consistent management across your Azure and non-Azure environments. Use it to automate repetitive tasks, enforce configuration consistency, and manage updates for VMs. By using runbooks and shared assets, you can streamline operations and reduce operational costs. Visit [Azure Automation Built-In Policy][20] to learn how to configure AUM at scale through Azure Policy.

### Boot diagnostics

Boot diagnostics is a debugging feature for Azure VMs that you can use to diagnose VM boot failures. The feature collects serial log information and screenshots so that you can observe the state of your VM as it boots up. After you enable the boot diagnostics feature, the Azure cloud platform can inspect the VM operating system for provisioning errors. The feature helps to provide deeper information on the root causes of startup failures. Boot diagnostics is enabled by default when you create a VM and is enforced by the **Boot Diagnostics should be enabled on virtual machines** policy.

### Windows Admin Center

You can now use Windows Admin Center in the Azure portal to manage the Windows operating system inside an Azure VM. You can also manage operating system functions from the Azure portal and work with files in the VM without using Remote Desktop or PowerShell. You can use an ARM template or a custom Azure Policy for configuration. For more information, see [Manage a Windows VM by using Windows Admin Center in Azure][04].

### Log Analytics workspace

Log Analytics is an Azure Monitor feature that monitors your cloud and on-premises resources and applications. Use it to collect and analyze data generated by resources in your cloud and on-premises environments. With Log Analytics, you can search, analyze, and visualize data to identify trends, troubleshoot issues, and monitor your systems.

On August 31, 2024, both Automation Update Management and the Log Analytics agent that it used were retired. You should have migrated to Azure Update Manager before that date. For guidance on how to migrate to Azure Update Manager, see [Overview of migration from Automation Update Management to Azure Update Manager][05]. We advise you to migrate [now][06] because this feature is no longer supported in Automanage.

## Pricing

Automanage Best Practices is a free service, so you don't receive a bill from Automanage. If you used Automanage to enable paid services like Azure Monitor Insights, you might incur usage charges. Those services bill you directly.

Read more about Automanage and pricing on the [Azure Automanage pricing webpage][09].

## Next steps

Now that you have an overview of Azure Policy and some of the key concepts, here are the suggested next steps:

- [Review the policy definition structure][07]
- [Assign a policy definition by using the portal][08]

<!-- Reference link definitions -->
[01]: ../overview.md
[02]: ../../../backup/backup-azure-arm-userestapi-createorupdatepolicy.md
[03]: /azure/virtual-machines/extensions/iaas-antimalware-windows
[04]: /windows-server/manage/windows-admin-center/azure/manage-vm
[05]: ../../../update-manager/migration-overview.md
[06]: https://portal.azure.com/
[07]: ../concepts/definition-structure-basics.md
[08]: ../assign-policy-portal.md
[09]: https://azure.microsoft.com/pricing/details/azure-automanage/
[10]: /azure/security/fundamentals/antimalware#antimalware-deployment-scenarios
[11]: /azure/backup/policy-reference
[12]: /azure/azure-monitor/policy-reference
[13]: /azure/azure-monitor/overview
[14]: /azure/backup/backup-overview
[15]: /azure/automation/change-tracking/overview
[16]: /azure/defender-for-cloud/defender-for-cloud-introduction
[17]: /azure/defender-for-cloud/policy-reference
[18]: /azure/update-manager/periodic-assessment-at-scale
[19]: /azure/update-manager/overview
[20]: /azure/automation/policy-reference
[21]: /azure/automation/overview
