---
title: Azure Automanage for Linux
description: Learn about the Azure Automanage for virtual machines best practices for services that are automatically onboarded and configured for Linux machines.
author: deanwe
ms.service: virtual-machines
ms.subservice: automanage
ms.collection: linux
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 02/22/2021
ms.author: deanwe
---


# Azure Automanage for virtual machines best practices - Linux

These Azure services are automatically onboarded for you when you use Automanage for virtual machines (VMs) on a Linux VM. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).

For all of these services, we will auto-onboard, auto-configure, monitor for drift, and remediate if drift is detected. To learn more about this process, see [Azure Automanage for virtual machines](automanage-virtual-machines.md).

## Supported Linux distributions and versions

Automanage supports the following Linux distributions and versions:

- CentOS 7.3+
- RHEL 7.4+
- Ubuntu 16.04 and 18.04
- SLES 12 (SP3-SP5 only)

## Participating services

>[!NOTE]
> Microsoft Antimalware is not supported on Linux VMs at this time.

|Service    |Description    |Environments Supported<sup>1</sup>    |Preferences supported<sup>1</sup>    |
|-----------|---------------|----------------------|-------------------------|
|[VM Insights Monitoring](https://docs.microsoft.com/azure/azure-monitor/vm/vminsights-overview)    |Azure Monitor for VMs monitors the performance and health of your virtual machines, including their running processes and dependencies on other resources. Learn [more](../azure-monitor/vm/vminsights-overview.md).    |Production    |No    |
|[Backup](https://docs.microsoft.com/azure/backup/backup-overview)   |Azure Backup provides independent and isolated backups to guard against unintended destruction of the data on your VMs. Learn [more](../backup/backup-azure-vms-introduction.md). Charges are based on the number and size of VMs being protected. Learn [more](https://azure.microsoft.com/pricing/details/backup/).    |Production    |Yes    |
|[Azure Security Center](https://docs.microsoft.com/azure/security-center/security-center-introduction)    |Azure Security Center is a unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud. Learn [more](../security-center/security-center-introduction.md).  Automanage will configure the subscription where your VM resides to the free-tier offering of Azure Security Center. If your subscription is already onboarded to Azure Security Center, then Automanage will not reconfigure it.    |Production, Dev/Test    |No    |
|[Update Management](https://docs.microsoft.com/azure/automation/update-management/overview)    |You can use Update Management in Azure Automation to manage operating system updates for your virtual machines. You can quickly assess the status of available updates on all agent machines and manage the process of installing required updates for servers. Learn [more](../automation/update-management/overview.md).    |Production, Dev/Test    |No    |
|[Change Tracking & Inventory](https://docs.microsoft.com/azure/automation/change-tracking/overview) |Change Tracking and Inventory combines change tracking and inventory functions to allow you to track virtual machine and server infrastructure changes. The service supports change tracking across services, daemons software, registry, and files in your environment to help you diagnose unwanted changes and raise alerts. Inventory support allows you to query in-guest resources for visibility into installed applications and other configuration items.  Learn [more](../automation/change-tracking/overview.md).    |Production, Dev/Test    |No    |
|[Azure Guest Configuration](https://docs.microsoft.com/azure/governance/policy/concepts/guest-configuration)  | Guest Configuration policy is used to monitor the configuration and report on the compliance of the machine. The Automanage service will install the Azure Linux baseline using the Guest Configuration extension. For Linux machines, the guest configuration service will install the baseline in audit-only mode. You will be able to see where your VM is out of compliance with the baseline, but noncompliance won't be automatically remediated. Learn [more](../governance/policy/concepts/guest-configuration.md).    |Production, Dev/Test    |No    |
|[Boot Diagnostics](https://docs.microsoft.com/azure/virtual-machines/boot-diagnostics)  | Boot diagnostics is a debugging feature for Azure virtual machines (VM) that allows diagnosis of VM boot failures. Boot diagnostics enables a user to observe the state of their VM as it is booting up by collecting serial log information and screenshots. This will only be enabled for machines that are using managed disks. |Production, Dev/Test    |No    |
|[Azure Automation Account](https://docs.microsoft.com/azure/automation/automation-create-standalone-account)    |Azure Automation supports management throughout the lifecycle of your infrastructure and applications. Learn [more](../automation/automation-intro.md).    |Production, Dev/Test    |No    |
|[Log Analytics Workspace](https://docs.microsoft.com/azure/azure-monitor/logs/log-analytics-overview) |Azure Monitor stores log data in a Log Analytics workspace, which is an Azure resource and a container where data is collected, aggregated, and serves as an administrative boundary. Learn [more](../azure-monitor/logs/design-logs-deployment.md).    |Production, Dev/Test    |No    |


<sup>1</sup> The environment selection is available when you are enabling Automanage. Learn [more](automanage-virtual-machines.md#environment-configuration). You can also adjust the default settings of the environment and set your own preferences within the best practices constraints.


## Next steps

Try enabling Automanage for virtual machines in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for virtual machines in the Azure portal](quick-create-virtual-machines-portal.md)