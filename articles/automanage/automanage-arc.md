---
title: Azure Automanage for Azure Arc-enabled servers
description: Learn about Azure Automanage for Azure Arc-enabled servers
ms.service: automanage
ms.collection: linux
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 05/12/2022
---

# Azure Automanage for Machines Best Practices - Azure Arc-enabled servers

These Azure services are automatically onboarded for you when you use Automanage Machine Best Practices on an Azure Arc-enabled server VM. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).

For all of these services, we will auto-onboard, auto-configure, monitor for drift, and remediate if drift is detected. To learn more, go to [Azure Automanage for virtual machines](overview-about.md).

## Supported operating systems

Automanage supports the following operating systems for Azure Arc-enabled servers

- Windows Server 2012 R2, 2016, 2019, 2022
- CentOS 7.3+, 8
- RHEL 7.4+, 8
- Ubuntu 16.04, 18.04, 20.04
- SLES 12 (SP3-SP5 only)

## Participating services

| Service                                                                           | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                        | Configuration Profile<sup>1</sup> |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------- |
| [Machines Insights Monitoring](../azure-monitor/vm/vminsights-overview.md)        | Azure Monitor for machines monitors the performance and health of your virtual machines, including their running processes and dependencies on other resources.                                                                                                                                                                                                                                                                                                    | Production                        |
| [Update Management](../automation/update-management/overview.md)                  | You can use Update Management in Azure Automation to manage operating system updates for your machines. You can quickly assess the status of available updates on all agent machines and manage the process of installing required updates for servers.                                                                                                                                                                                                            | Production, Dev/Test              |
| [Microsoft Antimalware](../security/fundamentals/antimalware.md)                  | Microsoft Antimalware for Azure is a free real-time protection that helps identify and remove viruses, spyware, and other malicious software. It generates alerts when known malicious or unwanted software tries to install itself or run on your Azure systems. **Note:** Microsoft Antimalware requires that there be no other antimalware software installed, or it may fail to work. This is also only supported for Windows Server 2016 and above.           | Production, Dev/Test              |
| [Change Tracking & Inventory](../automation/change-tracking/overview.md)          | Change Tracking and Inventory combines change tracking and inventory functions to allow you to track virtual machine and server infrastructure changes. The service supports change tracking across services, daemons software, registry, and files in your environment to help you diagnose unwanted changes and raise alerts. Inventory support allows you to query in-guest resources for visibility into installed applications and other configuration items. | Production, Dev/Test              |
| [Machine Configuration](../governance/machine-configuration/overview.md)          | Machine Configuration policy is used to monitor the configuration and report on the compliance of the machine. The Automanage service will install the Azure security baseline using the Guest Configuration extension. For Arc machines, the machine configuration service will install the baseline in audit-only mode. You will be able to see where your VM is out of compliance with the baseline, but noncompliance won't be automatically remediated.       | Production, Dev/Test              |
| [Azure Automation Account](../automation/automation-create-standalone-account.md) | Azure Automation supports management throughout the lifecycle of your infrastructure and applications.                                                                                                                                                                                                                                                                                                                                                             | Production, Dev/Test              |
| [Log Analytics Workspace](../azure-monitor/logs/log-analytics-overview.md)        | Azure Monitor stores log data in a Log Analytics workspace, which is an Azure resource and a container where data is collected, aggregated, and serves as an administrative boundary.                                                                                                                                                                                                                                                                              | Production, Dev/Test              |


<sup>1</sup> The [configuration profile](overview-configuration-profiles.md) selection is available when you are enabling Automanage. You can also create your own custom profile with the set of Azure services and settings that you need.


## Next steps

Try enabling Automanage for machines in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for machines in the Azure portal](quick-create-virtual-machines-portal.md)
