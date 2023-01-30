---
title: Azure Automanage for Linux
description: Learn about Azure Automanage for virtual machines best practices for services that are automatically onboarded and configured for Linux machines.
author: mmccrory
ms.service: automanage
ms.collection: linux
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 12/10/2021
ms.author: memccror
---

# Azure Automanage for Machines Best Practices - Linux

These Azure services are automatically onboarded for you when you use Automanage Machine Best Practices Profiles on a Linux VM. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).

For all of these services, we will auto-onboard, auto-configure, monitor for drift, and remediate if drift is detected. To learn more, go to [Azure Automanage for virtual machines](overview-about.md).

## Supported Linux distributions and versions

Automanage supports the following Linux distributions and versions:

- CentOS 7.3+, 8
- RHEL 7.4+, 8
- Ubuntu 16.04, 18.04, 20.04
- SLES 12 (SP3-SP5 only), SLES 15

## Participating services

>[!NOTE]
> Microsoft Antimalware is not supported on Linux machines at this time.

| Service                                                                              | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | Configuration Profile Supported<sup>1</sup> |
| ------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| [Machines Insights Monitoring](../azure-monitor/vm/vminsights-overview.md)           | Azure Monitor for machines monitors the performance and health of your virtual machines, including their running processes and dependencies on other resources. Learn [more](../azure-monitor/vm/vminsights-overview.md).                                                                                                                                                                                                                                                                                                                                                     | Production                                  |
| [Backup](../backup/backup-overview.md)                                               | Azure Backup provides independent and isolated backups to guard against unintended destruction of the data on your VMs. Learn [more](../backup/backup-azure-vms-introduction.md). Charges are based on the number and size of VMs being protected. Learn [more](https://azure.microsoft.com/pricing/details/backup/).                                                                                                                                                                                                                                                         | Production                                  |
| [Microsoft Defender for Cloud](../security-center/security-center-introduction.md)   | Microsoft Defender for Cloud is a unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud. Learn [more](../security-center/security-center-introduction.md).  Automanage will configure the subscription where your VM resides to the free-tier offering of Microsoft Defender for Cloud (Enhanced security off). If your subscription is already onboarded to Microsoft Defender for Cloud, then Automanage will not reconfigure it. | Production, Dev/Test                        |
| [Update Management](../automation/update-management/overview.md)                     | You can use Update Management in Azure Automation to manage operating system updates for your machines. You can quickly assess the status of available updates on all agent machines and manage the process of installing required updates for servers. Learn [more](../automation/update-management/overview.md).                                                                                                                                                                                                                                                            | Production, Dev/Test                        |
| [Change Tracking & Inventory](../automation/change-tracking/overview.md)             | Change Tracking and Inventory combines change tracking and inventory functions to allow you to track virtual machine and server infrastructure changes. The service supports change tracking across services, daemons software, registry, and files in your environment to help you diagnose unwanted changes and raise alerts. Inventory support allows you to query in-guest resources for visibility into installed applications and other configuration items.  Learn [more](../automation/change-tracking/overview.md).                                                  | Production, Dev/Test                        |
| [Machine configuration](../governance/machine-configuration/overview.md)             | Machine configuration is used to monitor the configuration and report on the compliance of the machine. The Automanage service will install the Azure Linux baseline using the guest configuration extension. For Linux machines, the machine configuration service will install the baseline in audit-only mode. You will be able to see where your VM is out of compliance with the baseline, but noncompliance won't be automatically remediated. Learn [more](../governance/machine-configuration/overview.md).                                                           | Production, Dev/Test                        |
| [Boot Diagnostics](../virtual-machines/boot-diagnostics.md)                          | Boot diagnostics is a debugging feature for Azure virtual machines (VM) that allows diagnosis of VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information and screenshots. This will only be enabled for machines that are using managed disks.                                                                                                                                                                                                                                            | Production, Dev/Test                        |
| [Azure Automation Account](../automation/automation-create-standalone-account.md)    | Azure Automation supports management throughout the lifecycle of your infrastructure and applications. Learn [more](../automation/automation-intro.md).                                                                                                                                                                                                                                                                                                                                                                                                                       | Production, Dev/Test                        |
| [Log Analytics Workspace](../azure-monitor/logs/log-analytics-workspace-overview.md) | Azure Monitor stores log data in a Log Analytics workspace, which is an Azure resource and a container where data is collected, aggregated, and serves as an administrative boundary. Learn [more](../azure-monitor/logs/workspace-design.md).                                                                                                                                                                                                                                                                                                                                | Production, Dev/Test                        |


<sup>1</sup> The configuration profile selection is available when you are enabling Automanage. Learn [more](overview-configuration-profiles.md). You can also create your own custom profile with the set of Azure services and settings that you need.


## Next steps

Try enabling Automanage for machines in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for machines in the Azure portal](quick-create-virtual-machines-portal.md)
