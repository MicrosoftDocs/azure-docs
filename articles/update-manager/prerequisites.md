---
title: Prerequisites for Azure Update Manager
description: This article explains the prerequisites for Azure Update Manager, VM extensions, and network planning.
ms.service: azure-update-manager
ms.custom: linux-related-content
author: habibaum
ms.author: v-uhabiba
ms.date: 08/21/2025
ms.topic: overview
# Customer intent: "As a system administrator, I want to understand the prerequisites for Azure Update Manager so that I can effectively prepare my Linux and Azure Arc-enabled servers for update management."
---

# Prerequisites for Azure Update Manager

This article summarizes the prerequisites for Azure Update Manager, the extensions for Azure virtual machines (VMs) and Azure Arc-enabled servers, and how to prepare your network to support Update Manager.

## Linux machines

Before you start using this service on Linux machines, you must install Python version 2.7 or later.

## Azure Arc-enabled servers

To use Update Manager for Azure Arc-enabled servers, you must connect those servers to Azure Arc. For more information, see the [overview of Azure Arc-enabled servers](/azure/azure-arc/servers/overview).

## Support matrix

To learn about updates and the update sources, VM images, and Azure regions that are supported for Update Manager, refer to the [support matrix](support-matrix.md).

## Sudo privileges

Update Manager requires a high level of permissions due to the many components that might be updated with Update Manager (including kernel drivers and OS security patching). The Update Manager extensions use the root account for operations. Grant sudo privileges to ensure that assessment or patching operations succeed. You need to add the root account to the /etc/sudoers file. 

1. Open the `sudoers` file for editing:

   ```bash
   sudo visudo
   ```

2. Add the following entry to the end of `sudoers` file:

   ```bash
   root ALL=(ALL) ALL
   ```

3. Save and close the editor by using the <kbd>Ctrl+X</kbd> keyboard shortcut. If you're using the *vi* editor, you can type `:wq` and then select the <kbd>Enter</kbd> key.


## Roles and permissions

To manage machines from Update Manager, see [Roles and permissions in Azure Update Manager](roles-permissions.md).

## VM extensions

For Update Manager to work, Azure VM extensions and Azure Arc-enabled VM extensions are required to run on the Azure machine and Azure Arc-enabled machine (respectively). But separate installation isn't required, because the extensions are automatically pushed on the VM the first time you trigger any Update Manager operation on the VM. For more information, see [Update Manager VM extensions](workflow-update-manager.md#update-manager-vm-extensions).

## Network planning

To prepare your network to support Update Manager, you might need to configure some infrastructure components. For more information, see the [network requirements for Azure Arc-enabled servers](/azure/azure-arc/servers/network-requirements).

For Windows machines, you must allow traffic to any endpoints that the Windows Update agent requires. You can find an updated list of required endpoints in [Issues related to HTTP/proxy](/troubleshoot/windows-client/installing-updates-features-roles/windows-update-issues-troubleshooting#issues-related-to-httpproxy). If you have a local [Windows Server Update Services (WSUS)](/windows-server/administration/windows-server-update-services/plan/plan-your-wsus-deployment) deployment, you must allow traffic to the server specified in your [WSUS key](/windows/deployment/update/waas-wu-settings#configuring-automatic-updates-by-editing-the-registry).

For Red Hat Linux machines, see [IPs for the RHUI content delivery servers](/azure/virtual-machines/workloads/redhat/redhat-rhui#the-ips-for-the-rhui-content-delivery-servers) for required endpoints. For other Linux distributions, see your provider documentation.

## Windows Update client configuration

Update Manager relies on the [Windows Update client](/windows/deployment/update/windows-update-overview) to download and install Windows updates. The Windows Update client uses specific settings when it connects to WSUS or Windows Update. For more information, see [Configure Windows Update settings for Azure Update Manager](configure-wu-agent.md).

## Related content

- [Check update compliance with Azure Update Manager](view-updates.md)
- [Deploy updates now and track results with Azure Update Manager](deploy-updates.md)
- [Automate assessment at scale by using Azure Policy](https://aka.ms/aum-policy-support)
- [Schedule recurring updates for machines by using the Azure portal and Azure Policy](scheduled-patching.md)
- [Manage update configuration settings](manage-update-settings.md)
- [Manage multiple machines with Azure Update Manager](manage-multiple-machines.md)
