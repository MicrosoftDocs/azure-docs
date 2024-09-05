---
title: Prerequisites for Azure Update Manager
description: This article explains the prerequisites for Azure Update Manager, VM extensions and network planning.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: SnehaSudhirG
ms.author: sudhirsneha
ms.date: 07/14/2024
ms.topic: overview
---

# Prerequisites for Azure Update Manager

This article summarizes the prerequisites, the extensions for Azure VM extensions and Azure Arc-enabled servers and details on how to prepare your network to support Update Manager.

## Prerequisites

Azure Update Manager is an out of the box, zero onboarding service. Before you start using this service, consider the following list: 

### Arc-enabled servers
Arc-enabled servers must be connected to Azure Arc to use Azure Update Manager. For more information, see [how to enable Arc on non-Azure machines](https://aka.ms/onboard-to-arc-aum-migration).

### Support matrix
Refer [support matrix](support-matrix.md) to find out about updates and the update sources, VM images and Azure regions that are supported for Azure Update Manager.

### Roles and permissions

To manage machines from Azure Update Manager, see [roles and permissions](roles-permissions.md).

### VM extensions

Azure VM extensions and Azure Arc-enabled VM extensions are required to run on the Azure and Arc-enabled machine respectively for Azure Update Manager to work. But separate installation is not required as the extensions are automatically pushed on the VM the first time you trigger any Update Manager operation on the VM. For more information, see the [VM extensions](workflow-update-manager.md#update-manager-vm-extensions) that are pushed on the machines

### Network planning

To prepare your network to support Update Manager, you might need to configure some infrastructure components. For more information, see the [network requirements for Arc-enabled servers](../azure-arc/servers/network-requirements.md).

For Windows machines, you must allow traffic to any endpoints required by the Windows Update agent. You can find an updated list of required endpoints in [issues related to HTTP Proxy](/troubleshoot/windows-client/installing-updates-features-roles/windows-update-issues-troubleshooting?toc=%2Fwindows%2Fdeployment%2Ftoc.json&bc=%2Fwindows%2Fdeployment%2Fbreadcrumb%2Ftoc.json#issues-related-to-httpproxy). If you have a local [WSUS](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) deployment, you must allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](/azure/virtual-machines/workloads/redhat/redhat-rhui#the-ips-for-the-rhui-content-delivery-servers)for required endpoints. For other Linux distributions, see your provider documentation.

### Configure Windows Update client

Azure Update Manager relies on the [Windows Update client](/windows/deployment/update/windows-update-overview) to download and install Windows updates. There are specific settings that are used by the Windows Update client when connecting to Windows Server Update Services (WSUS) or Windows Update. For more information, see [configure Windows Update client](configure-wu-agent.md).

## Next steps

- [View updates for a single machine](view-updates.md).
- [Deploy updates now (on-demand) for a single machine](deploy-updates.md).
- [Enable periodic assessment at scale using policy](https://aka.ms/aum-policy-support).
- [Schedule recurring updates](scheduled-patching.md)
- [Manage update settings via the portal](manage-update-settings.md).
- [Manage multiple machines by using Update Manager](manage-multiple-machines.md).
