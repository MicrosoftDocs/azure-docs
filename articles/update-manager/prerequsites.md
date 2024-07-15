---
title: Azure Update Manager overview
description: This article explains the prerequisites for Azure Update Manager, and network planning.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 07/14/2024
ms.topic: overview
---

# Prerequisites for Azure Update Manager

## Prerequisites

Azure Update Manager is an out of the box, zero onboarding service. Following are the  only a few things that you must consider before starting to use the service. 

### Arc-enabled servers
Arc-enabled servers must be connected to Azure Arc to use Azure Update Manager. For more information, see [how to enable Arc on non-Azure machines](https://aka.ms/onboard-to-arc-aum-migration).

### Support matrix
Refer [support matrix] to find out about updates and the update sources, VM images and Azure regions that are supported for Azure Update Manager.

## Roles and permissions

To manage machines from Azure Update Manager, see roles and permissions.

## VM extensions

zure VM extensions and Azure Arc-enabled VM extensions are required to run on the Azure and Arc-enabled machine respectively for Azure Update Manager to work.

## Next steps

- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).
