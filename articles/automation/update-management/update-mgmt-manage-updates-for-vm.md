---
title: Manage updates and patches for your VMs in Azure Automation
description: This article tells how to use Update Management to manage updates and patches for your Azure and non-Azure VMs.
services: automation
ms.subservice: update-management
ms.topic: conceptual
ms.date: 04/06/2020
ms.custom: mvc
---
# Manage updates and patches for your VMs

This article describes how you can use the Azure Automation [Update Management](update-mgmt-overview.md) feature to manage updates and patches for your Azure and non-Azure VMs.

> [!NOTE]
> Update Management supports the deployment of first-party updates and the pre-downloading of them. This support requires changes on the systems being updated. See [Configure Windows Update settings for Azure Automation Update Management](update-mgmt-configure-wuagent.md) to learn how to configure these settings on your systems.

Before using the procedures in this article, ensure that you've enabled Update Management on your VMs using one of these techniques:

* [Enable Update Management from an Automation account](update-mgmt-enable-automation-account.md)
* [Enable Update Management by browsing the Azure portal](update-mgmt-enable-portal.md)
* [Enable Update Management from a runbook](update-mgmt-enable-runbook.md)
* [Enable Update Management from an Azure VM](update-mgmt-enable-vm.md)

## <a name="scope-configuration"></a>Limit the scope for the deployment

Update Management uses a scope configuration within the workspace to target the computers to receive updates. For more information, see [Limit Update Management deployment scope](automation-scope-configurations-update-management.md).

## Next steps
