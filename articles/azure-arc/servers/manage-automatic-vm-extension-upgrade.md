---
title: Automatic extension upgrade (preview) for Azure Arc-enabled servers
description: Learn how to enable the automatic extension upgrades for your Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 06/02/2021
---

# Automatic extension upgrade (preview) for Azure Arc-enabled servers

Automatic extension upgrade (preview) is available for Azure Arc-enabled servers that have supported VM extensions installed. When automatic extension upgrade is enabled on a machine, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension.

 Automatic extension upgrade has the following features:

- You can opt in and out of automatic upgrades at any time.
- Each supported extension is enrolled individually, and you can choose which extensions to upgrade automatically.
- Supported in all public cloud regions.

> [!NOTE]
> In this release, it is only possible to configure automatic extension upgrade with the Azure CLI and Azure PowerShell module.

## How does automatic extension upgrade work?

The extension upgrade process replaces the existing Azure VM extension version supported by Azure Arc-enabled servers with a new version of the same extension when published by the extension publisher. This feature is enabled by default for all extensions you deploy the Azure Arc-enabled servers unless you explicitly opt-out of automatic upgrades.

### Availability-first updates

The availability-first model for platform orchestrated updates ensures that availability configurations in Azure are respected across multiple availability levels.

For a group of Arc-enabled servers undergoing an update, the Azure platform will orchestrate updates following the model described in the [Automation Extension Upgrade](../../virtual-machines/automatic-extension-upgrade.md#availability-first-updates). However, there are some notable differences between Arc-enabled servers and Azure VMs:

**Across regions:**

- Geo-paired regions aren't applicable.

**Within a region:**

- Availability Zones aren't applicable.
- Machines are batched on a best effort basis to avoid concurrent updates for all machines registered with Arc-enabled servers in a subscription.

### Automatic rollback and retries

If an extension upgrade fails, Azure will try to repair the extension by performing the following actions:

1. The Azure Connected Machine agent will automatically reinstall the last known good version of the extension to attempt to restore functionality.
1. If the rollback is successful, the extension status will show as **Succeeded** and the extension will be added to the automatic upgrade queue again. The next upgrade attempt can be as soon as the next hour and will continue until the upgrade is successful.
1. If the rollback fails, the extension status will show as **Failed** and the extension will no longer function as intended. You'll need to [remove](manage-vm-extensions-cli.md#remove-extensions) and [reinstall](manage-vm-extensions-cli.md#enable-extension) the extension to restore functionality.

If you continue to have trouble upgrading an extension, you can [disable automatic extension upgrade](#disable-automatic-extension-upgrade) to prevent the system from trying again while you troubleshoot the issue. You can [enable automatic extension upgrade](#enable-automatic-extension-upgrade) again when you're ready.

## Supported extensions

Automatic extension upgrade supports the following extensions (and more are added periodically):

- Azure Monitor Agent - Linux and Windows
- Azure Security agent - Linux and Windows
- Dependency agent – Linux and Windows
- Key Vault Extension - Linux only
- Log Analytics agent (OMS agent) - Linux only

## Enable automatic extension upgrade

Automatic extension upgrade is enabled by default when you install extensions on Azure Arc-enabled servers. To enable automatic extension upgrade for an existing extension, you can use Azure CLI or Azure PowerShell to set the `enableAutomaticUpgrade` property on the extension to `true`. You'll need to repeat this process for every extension where you'd like to enable automatic upgrades.

Use the [az connectedmachine extension update](/cli/azure/connectedmachine/extension) command to enable automatic upgrade on an extension:

```azurecli
az connectedmachine extension update \
    --resource-group resourceGroupName \
    --machine-name machineName \
    --name DependencyAgentLinux \
    --enable-auto-upgrade true
```

To check the status of automatic extension upgrade for all extensions on an Arc-enabled server, run the following command:

```azurecli
az connectedmachine extension list --resource-group resourceGroupName --machine-name machineName --query "[].{Name:name, AutoUpgrade:properties.enableAutoUpgrade}" --output table
```

To enable automatic extension upgrade for an extension using Azure PowerShell, use the [Update-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/update-azconnectedmachineextension) cmdlet:

```azurepowershell
Update-AzConnectedMachineExtension -ResourceGroup resourceGroupName -MachineName machineName -Name DependencyAgentLinux -EnableAutomaticUpgrade
```

To check the status of automatic extension upgrade for all extensions on an Arc-enabled server, run the following command:

```azurepowershell
Get-AzConnectedMachineExtension -ResourceGroup resourceGroupName -MachineName machineName | Format-Table Name, EnableAutomaticUpgrade
```

## Extension upgrades with multiple extensions

A machine managed by Arc-enabled servers can have multiple extensions with automatic extension upgrade enabled. The same machine can also have other extensions without automatic extension upgrade enabled.

If multiple extension upgrades are available for a machine, the upgrades may be batched together, but each extension upgrade is applied individually on a machine. A failure on one extension doesn't impact the other extension(s) to be upgraded. For example, if two extensions are scheduled for an upgrade, and the first extension upgrade fails, the second extension will still be upgraded.

## Disable automatic extension upgrade

To disable automatic extension upgrade for an extension, set the `enable-auto-upgrade` property to `false`.

With Azure CLI, use the [az connectedmachine extension update](/cli/azure/connectedmachine/extension) command to disable automatic upgrade on an extension:

```azurecli
az connectedmachine extension update \
    --resource-group resourceGroupName \
    --machine-name machineName \
    --name DependencyAgentLinux \
    --enable-auto-upgrade false
```

With Azure PowerShell, use the [Update-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/update-azconnectedmachineextension) cmdlet:

```azurepowershell
Update-AzConnectedMachineExtension -ResourceGroup resourceGroupName -MachineName machineName -Name DependencyAgentLinux -EnableAutomaticUpgrade:$false
```

## Check automatic extension upgrade history

You can use the Azure Activity Log to identify extensions that were automatically upgraded. You can find the Activity Log tab on individual Azure Arc-enabled server resources, resource groups, and subscriptions. Extension upgrades are identified by the `Upgrade Extensions on Azure Arc machines (Microsoft.HybridCompute/machines/upgradeExtensions/action)` operation.

To view automatic extension upgrade history, search for the **Azure Activity Log** in the Azure Portal. Select **Add filter** and choose the Operation filter. For the filter criteria, search for "Upgrade Extensions on Azure Arc machines" and select that option. You can optionally add a second filter for **Event initiated by** and set "Azure Regional Service Manager" as the filter criteria to only see automatic upgrade attempts and exclude upgrades manually initiated by users.

:::image type="content" source="media/manage-automatic-vm-extension-upgrade/azure-activity-log-extension-upgrade.png" alt-text="Azure Activity Log showing attempts to automatically upgrade extensions on Azure Arc-enabled servers." border="true":::

## Next steps

- You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), [PowerShell](manage-vm-extensions-powershell.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

- Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).
