---
title: Azure Update Center overview
description: This article provides an overview of how Azure Update Center (preview) helps you manages updates for your Windows and Linux machines in Azure, on-premises, and other cloud environments.
services: update-center
ms.subservice:
ms.date: 06/09/2021
ms.topic: conceptual
---

# Azure Update Center (preview) overview

You can use Azure Update Center (preview) to manage operating system updates for your Windows and Linux virtual machines in Azure, physical or VMs in on-premises environments, and in other cloud environments. You can quickly assess the status of available updates and manage the process of installing required updates for your machines reporting to Update Center. 

Microsoft offers other capabilities to help you manage updates for your Azure VMs or Azure virtual machine scale sets that you should consider as part of your overall update management strategy. 

- If you are interested in automatically assessing and updating your Azure virtual machines to maintain security compliance with *Critical* and *Security* updates released each month, review [Automatic VM guest patching](../../virtual-machines/automatic-vm-guest-patching.md) (preview). This is an alternative update management solution for your Azure VMs to auto-update them during off-peak hours, including VMs within an availability set, compared to managing update deployments to those VMs from Update Management in Azure Automation. 

- If you manage Azure virtual machine scale sets, review how to perform [automatic OS image upgrades](../../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md) to safely and automatically upgrade the OS disk for all instances in the scale set. 

Before enabling enabling your machines for update management, make sure that you understand the information in the following sections.

## About Update Center (preview)

Azure Update Center (preview) is redesigned and it doesn't depend on Azure Automation or Azure Monitor Logs, as required by the [previous version](../automation/update-management/overview.md). It offers all of the same functionality as the original version available with Azure Automation, but it is designed to take advantage of newer technology in Azure.

The following diagram illustrates how Update Center assesses and applies updates to all connected Windows Server and Linux machines.

:::image type="content" source="./media/overview/update-center-overview.png" alt-text="Overview of Update Center process flow.":::






