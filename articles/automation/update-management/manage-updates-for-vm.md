---
title: Manage updates and patches for your VMs in Azure Automation
description: This article tells how to use Update Management to manage updates and patches for your Azure and non-Azure VMs.
services: automation
ms.subservice: update-management
ms.topic: conceptual
ms.date: 08/25/2021
---

# Manage updates and patches for your VMs

> [!CAUTION]
> This article references CentOS, a Linux distribution that is nearing End Of Life (EOL) status. Please consider your use and planning accordingly. For more information, see the [CentOS End Of Life guidance](~/articles/virtual-machines/workloads/centos/centos-end-of-life.md).

Software updates in Azure Automation Update Management provides a set of tools and resources that can help manage the complex task of tracking and applying software updates to machines in Azure and hybrid cloud. An effective software update management process is necessary to maintain operational efficiency, overcome security issues, and reduce the risks of increased cyber security threats. However, because of the changing nature of technology and the continual appearance of new security threats, effective software update management requires consistent and continual attention.

> [!NOTE]
> Update Management supports the deployment of first-party updates and the pre-downloading of them. This support requires changes on the systems being updated. See [Configure Windows Update settings for Azure Automation Update Management](configure-wuagent.md) to learn how to configure these settings on your systems.

Before attempting to manage updates for your VMs, ensure that you've enabled Update Management on them using one of these methods:

* [Enable Update Management from an Automation account](enable-from-automation-account.md)
* [Enable Update Management by browsing the Azure portal](enable-from-portal.md)
* [Enable Update Management from a runbook](enable-from-runbook.md)
* [Enable Update Management from an Azure VM](enable-from-vm.md)

## <a name="scope-configuration"></a>Limit the scope for the deployment

Update Management uses a scope configuration within the workspace to target the computers to receive updates. For more information, see [Limit Update Management deployment scope](scope-configuration.md).

## Compliance assessment

Before you deploy software updates to your machines, review the update compliance assessment results for enabled machines. For each software update, its compliance state is recorded and then after the evaluation is complete, it is collected and forwarded in bulk to Azure Monitor logs.

On a Windows machine, the compliance scan is run every 12 hours by default, and is initiated within 15 minutes of the Log Analytics agent for Windows is restarted. The assessment data is then forwarded to the workspace and refreshes the **Updates** table. Before and after update installation, an update compliance scan is performed to identify missing updates, but the results are not used to update the assessment data in the table.

It is important to review our recommendations on how to [configure the Windows Update client](configure-wuagent.md) with Update Management to avoid any issues that prevents it from being managed correctly.

For a Linux machine, the compliance scan is performed every hour by default. If the Log Analytics agent for Linux is restarted, a compliance scan is initiated within 15 minutes.

The compliance results are presented in Update Management for each machine assessed. It can take up to 30 minutes for the dashboard to display updated data from a new machine enabled for management.

Review [monitor software updates](view-update-assessments.md) to learn how to view compliance results.

## Deploy updates

After reviewing the compliance results, the software update deployment phase is the process of deploying software updates. To install updates, schedule a deployment that aligns with your release schedule and service window. You can choose which update types to include in the deployment. For example, you can include critical or security updates and exclude update rollups.

Review [deploy software updates](deploy-updates.md) to learn how to schedule an update deployment.

## Exclude updates

On some Linux variants, such as Red Hat Enterprise Linux, OS-level upgrades might occur through packages. This might lead to Update Management runs in which the OS version number changes. Because Update Management uses the same methods to update packages that an administrator uses locally on a Linux machine, this behavior is intentional.

To avoid updating the OS version through Update Management deployments, use the **Exclusion** feature.

In Red Hat Enterprise Linux, the package name to exclude is `redhat-release-server.x86_64`.

## Linux update classifications

When you deploy updates to a Linux machine, you can select update classifications. This option filters the updates that meet the specified criteria. This filter is applied locally on the machine when the update is deployed.

Because Update Management performs update enrichment in the cloud, you can flag some updates in Update Management as having a security impact, even though the local machine doesn't have that information. If you apply critical updates to a Linux machine, there might be updates that aren't marked as having a security impact on that machine and therefore aren't applied. However, Update Management might still report that machine as noncompliant because it has additional information about the relevant update.

Deploying updates by update classification doesn't work on RTM versions of CentOS. To properly deploy updates for CentOS, select all classifications to make sure updates are applied. For SUSE, selecting ONLY **Other updates** as the classification can install some other security updates if they're related to zypper (package manager) or its dependencies are required first. This behavior is a limitation of zypper. In some cases, you might be required to rerun the update deployment and then verify the deployment through the update log.

## Review update deployments

After the deployment is complete, review the process to determine the success of the update deployment by machine or target group. See [review deployment status](deploy-updates.md#check-deployment-status) to learn how you can monitor the deployment status.

## Next steps

* To learn how to create alerts to notify you about update deployment results, see [create alerts for Update Management](configure-alerts.md).

* You can [query Azure Monitor logs](query-logs.md) to analyze update assessments, deployments, and other related management tasks. It includes pre-defined queries to help you get started.
