---
title: Deploy and manage updates using Updates view (preview).
description: This article describes how to view the updates pending for your environment and then deploy and manage them using the Updates (preview) option in Azure Update Manager.
ms.service: azure-update-manager
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 01/14/2024
ms.topic: how-to
---

# Deploy and manage updates using the Update view (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes how to view the updates pending in your environment and how to deploy and manage the updates using the Updates (preview).


The Updates (preview) allows you to manage updates from an updates point of view. It implies that you can see the number of updates and the type of updates pending on your Windows and Linux machines and there by decide on each of the pending updates. To view the latest pending updates on each of the machines, we recommend that you enable periodic assessment on all your machines. For more information, see [enable periodic assessment at scale using Policy](periodic-assessment-at-scale.md) or [enable using update settings](manage-update-settings.md).


## Scenario: Identifying a threat and applying an update on all pending machines

The **Updates (preview)** enables you to discover a vulnerability and allows you to apply a specific update on all machines that are pending for an update. For example, if a vulnerability was discovered in a software and it could eventually expose the customer's environment to a risk such as remote code extension then the Central IT team after discovering the threat, can secure the entire enterprise environment by applying an update to mitigate vulnerability. Using the **Updates (preview)**, they can apply update on all the impacted machines.

## Summarized view






## Next steps

* [View updates for single machine](view-updates.md)
* [Deploy updates now (on-demand) for single machine](deploy-updates.md)
* [Schedule recurring updates](scheduled-patching.md)
* [Manage update settings via Portal](manage-update-settings.md)
* [Manage multiple machines using update Manager](manage-multiple-machines.md)