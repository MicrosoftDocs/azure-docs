---
title: Azure Stack Edge 2209 release notes
description: Describes critical open issues and resolutions for the Azure Stack Edge running 2209 release.
services: databox
author: alkohli
 
ms.service: databox
ms.subservice: edge
ms.topic: article
ms.date: 09/20/2022
ms.author: alkohli
---

# Azure Stack Edge 2209 release notes

[!INCLUDE [applies-to-GPU-and-pro-r-and-mini-r-skus](../../includes/azure-stack-edge-applies-to-gpu-pro-r-mini-r-sku.md)]

The following release notes identify the critical open issues and the resolved issues for the 2209 release for your Azure Stack Edge devices. Features and issues that correspond to a specific model of Azure Stack Edge are called out wherever applicable.

The release notes are continuously updated, and as critical issues requiring a workaround are discovered, they're added. Before you deploy your device, carefully review the information contained in the release notes.

This article applies to the **Azure Stack Edge 2209** release, which maps to software version number **2.2.2088.5593**. This software can be applied to your device if you're running at least Azure Stack Edge 2207 (2.2.2307.5375) software.

## What's new

The 2209 release has the following features and enhancements:

- **Kubernetes version update** - This release contains a Kubernetes version update from 1.20.9 to v1.22.6.


## Known issues in 2209 release

The following table provides a summary of known issues in this release.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this release, the following features are available in preview: <br> - Clustering and Multi-Access Edge Computing (MEC) for Azure Stack Edge Pro GPU devices only.  <br> - VPN for Azure Stack Edge Pro R and Azure Stack Edge Mini R only. <br> - Local Azure Resource Manager
|**2.**|Arc agent |To safeguard against a recent vulnerability, review and update your Azure Arc-enabled Kubernetes clusters to the latest agent version.  |We highly recommend that customers ensure they're running agent versions 1.5.8 and above, 1.6.19 and above, and 1.7.18 and above. Resources that should be updated are listed below this message. The following are options for performing this update:

1. Customers with auto-upgrade enabled have automatically received the latest version. Customers can review their current agent version by running [Check agent version](../azure-arc/kubernetes/agent-upgrade.md#check-agent-version) in Azure CLI.

1. Customers that don't have auto-upgrade enabled are highly encouraged to [enable auto-upgrade](../azure-arc/kubernetes/agent-upgrade.md#toggle-automatic-upgrade-on-or-off-after-connecting-a-cluster-to-azure-arc) to receive the update automatically. Updates are typically applied within 2 hours of release. 

1. Customers that don't have auto-upgrade enabled should [manually upgrade their cluster connect feature](../azure-arc/kubernetes/agent-upgrade.md#manually-upgrade-agents). 

1. Microsoft highly recommends that customers review cluster audit logs and/or other monitoring logs as a precaution to validate that there hasn't been suspicious activity on clusters. 

If you have questions or concerns, [open a support case through the Azure portal](https://aka.ms/azsupt). To stay up-to-date on important security events, [configure service health alerts](../service-health/alerts-activity-log-service-notifications-portal.md) in the Azure portal. 
|**3.**|Optimization |For this release... |

## Known issues from previous releases

The following table provides a summary of known issues carried over from the previous releases.

| No. | Feature | Issue | Workaround/comments |
| --- | --- | --- | --- |
|**1.**|Preview features |For this release, the following features are available in preview: <br> - Clustering and Multi-Access Edge Computing (MEC) for Azure Stack Edge Pro GPU devices only.  <br> - VPN for Azure Stack Edge Pro R and Azure Stack Edge Mini R only. <br> - Local Azure Resource Manager, VMs, Cloud management of VMs, Kubernetes cloud management, and Multi-process service (MPS) for Azure Stack Edge Pro GPU, Azure Stack Edge Pro R, and Azure Stack Edge Mini R. |These features will be generally available in later releases. |
|**2.**|Drive replacement |In this release, if there's a need to replace the drive on your Azure Stack Edge Pro 2 device, contact Microsoft Support to help you with a seamless drive replacement. |
|**3.**|Jumbo frames |When deploying an Azure Stack Edge Pro 2 2-node cluster, enable Jumbo Frames on the network switches in your environment for a better device performance.  |

## Next steps

- [Update your device](azure-stack-edge-gpu-install-update.md)
