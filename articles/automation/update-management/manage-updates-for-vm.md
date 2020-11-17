---
title: Manage updates and patches for your VMs in Azure Automation
description: This article tells how to use Update Management to manage updates and patches for your Azure and non-Azure VMs.
services: automation
ms.subservice: update-management
ms.topic: conceptual
ms.date: 07/28/2020
ms.custom: mvc
---
# Manage updates and patches for your VMs

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

On a Windows machine, the compliance scan is run every 12 hours by default. In addition to the scheduled scan, the scan for update compliance is initiated within 15 minutes of the Log Analytics agent for Windows being restarted, before update installation, and after update installation. It is also important to review our recommendations on how to [configure the Windows Update client](configure-wuagent.md) with Update Management to avoid any issues that prevents it from being managed correctly.

For a Linux machine, the compliance scan is performed every hour by default. If the Log Analytics agent for Linux is restarted, a compliance scan is initiated within 15 minutes.

The compliance results are presented in Update Management for each machine assessed. For a new machine enabled for management, it can take up to 30 minutes for the dashboard to display updated data from it.

Review [monitor software updates](view-update-assessments.md) to learn how to view compliance results.

## Deploy updates

After reviewing the compliance results, the software update deployment phase is the process of deploying software updates. To install updates, schedule a deployment that aligns with your release schedule and service window. You can choose which update types to include in the deployment. For example, you can include critical or security updates and exclude update rollups.

Review [deploy software updates](deploy-updates.md) to learn how to schedule an update deployment.

## Review update deployments

After the deployment is complete, review the process to determine the success of the update deployment by machine or target group. See [review deployment status](deploy-updates.md#check-deployment-status) to learn how you can monitor the deployment status.

## Next steps

* To learn how to create alerts to notify you about update deployment results, see [create alerts for Update Management](configure-alerts.md).

* You can [query Azure Monitor logs](query-logs.md) to analyze update assessments, deployments, and other related management tasks. It includes pre-defined queries to help you get started.