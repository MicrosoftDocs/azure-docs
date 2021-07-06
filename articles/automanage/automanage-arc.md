---
title: Azure Automanage for Arc enabled servers
description: Learn about the Azure Automanage for Arc enabled servers
author: asinn826
ms.service: virtual-machines
ms.subservice: automanage
ms.collection: linux
ms.workload: infrastructure
ms.topic: conceptual
ms.date: 06/24/2021
ms.author: alsin
---


# Azure Automanage for Machines Best Practices - Arc enabled servers

These Azure services are automatically onboarded for you when you use Automanage Machine Best Practices on an Arc-enabled server VM. They are essential to our best practices white paper, which you can find in our [Cloud Adoption Framework](/azure/cloud-adoption-framework/manage/azure-server-management).

For all of these services, we will auto-onboard, auto-configure, monitor for drift, and remediate if drift is detected. To learn more about this process, see [Azure Automanage for virtual machines](automanage-virtual-machines.md).

## Supported operating systems

Automanage supports the following operating systems for Arc enabled servers

- Windows Server 2012/R2
- Windows Server 2016
- Windows Server 2019
- CentOS 7.3+, 8
- RHEL 7.4+, 8
- Ubuntu 16.04 and 18.04
- SLES 12 (SP3-SP5 only)

## Participating services

|Service    |Description    |Environments supported<sup>1</sup>    |Preferences supported<sup>1</sup>    |
|-----------|---------------|----------------------|-------------------------|
|[Machines Insights Monitoring](../azure-monitor/vm/vminsights-overview.md)    |Azure Monitor for machines monitors the performance and health of your virtual machines, including their running processes and dependencies on other resources. Learn [more](../azure-monitor/vm/vminsights-overview.md).    |Production    |No    |
|[Azure Security Center](../security-center/security-center-introduction.md)    |Azure Security Center is a unified infrastructure security management system that strengthens the security posture of your data centers, and provides advanced threat protection across your hybrid workloads in the cloud. Learn [more](../security-center/security-center-introduction.md).  Automanage will configure the subscription where your VM resides to the free-tier offering of Azure Security Center. If your subscription is already onboarded to Azure Security Center, then Automanage will not reconfigure it.    |Production, Dev/Test    |No    |
|[Update Management](../automation/update-management/overview.md)    |You can use Update Management in Azure Automation to manage operating system updates for your machines. You can quickly assess the status of available updates on all agent machines and manage the process of installing required updates for servers. Learn [more](../automation/update-management/overview.md).    |Production, Dev/Test    |No    |
|[Change Tracking & Inventory](../automation/change-tracking/overview.md) |Change Tracking and Inventory combines change tracking and inventory functions to allow you to track virtual machine and server infrastructure changes. The service supports change tracking across services, daemons software, registry, and files in your environment to help you diagnose unwanted changes and raise alerts. Inventory support allows you to query in-guest resources for visibility into installed applications and other configuration items.  Learn [more](../automation/change-tracking/overview.md).    |Production, Dev/Test    |No    |
|[Azure Guest Configuration](../governance/policy/concepts/guest-configuration.md)  | Guest Configuration policy is used to monitor the configuration and report on the compliance of the machine. The Automanage service will install the Azure Linux baseline using the Guest Configuration extension. For Linux machines, the guest configuration service will install the baseline in audit-only mode. You will be able to see where your VM is out of compliance with the baseline, but noncompliance won't be automatically remediated. Learn [more](../governance/policy/concepts/guest-configuration.md).    |Production, Dev/Test    |No    |
|[Azure Automation Account](../automation/automation-create-standalone-account.md)    |Azure Automation supports management throughout the lifecycle of your infrastructure and applications. Learn [more](../automation/automation-intro.md).    |Production, Dev/Test    |No    |
|[Log Analytics Workspace](../azure-monitor/logs/log-analytics-overview.md) |Azure Monitor stores log data in a Log Analytics workspace, which is an Azure resource and a container where data is collected, aggregated, and serves as an administrative boundary. Learn [more](../azure-monitor/logs/design-logs-deployment.md).    |Production, Dev/Test    |No    |


<sup>1</sup> The environment selection is available when you are enabling Automanage. Learn [more](automanage-virtual-machines.md#environment-configuration). You can also adjust the default settings of the environment and set your own preferences within the best practices constraints.


## Next steps

Try enabling Automanage for machines in the Azure portal.

> [!div class="nextstepaction"]
> [Enable Automanage for machines in the Azure portal](quick-create-virtual-machines-portal.md)