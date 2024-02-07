---
title: Automatic extension upgrade for Azure Arc-enabled servers
description: Learn how to enable automatic extension upgrades for your Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 11/03/2023
---

# Automatic extension upgrade for Azure Arc-enabled servers

Automatic extension upgrade is available for Azure Arc-enabled servers that have supported VM extensions installed. Automatic extension upgrades reduce the amount of operational overhead for you by scheduling the installation of new extension versions when they become available. The Azure Connected Machine agent takes care of upgrading the extension (preserving its settings along the way) and automatically rolling back to the previous version if something goes wrong during the upgrade process.

Automatic extension upgrade has the following features:

- You can opt in and out of automatic upgrades at any time. By default, all extensions are opted into automatic extension upgrades.
- Each supported extension is enrolled individually, and you can choose which extensions to upgrade automatically.
- Supported in all Azure Arc regions.

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

If you continue to have trouble upgrading an extension, you can [disable automatic extension upgrade](#manage-automatic-extension-upgrade) to prevent the system from trying again while you troubleshoot the issue. You can [enable automatic extension upgrade](#manage-automatic-extension-upgrade) again when you're ready.

### Timing of automatic extension upgrades

When a new version of a VM extension is published, it becomes available for installation and manual upgrade on Arc-enabled servers. For servers that already have the extension installed and automatic extension upgrade enabled, it might take 5 - 8 weeks for every server with that extension to get the automatic upgrade. Upgrades are issued in batches across Azure regions and subscriptions, so you might see the extension get upgraded on some of your servers before others. If you need to upgrade an extension immediately, follow the guidance to manually upgrade extensions using the [Azure portal](manage-vm-extensions-portal.md#upgrade-extensions), [Azure PowerShell](manage-vm-extensions-powershell.md#upgrade-extension) or [Azure CLI](manage-vm-extensions-cli.md#upgrade-extensions).

Extension versions fixing critical security vulnerabilities are rolled out much faster. These automatic upgrades happen using a specialized roll out process which can take 1 - 3 weeks to automatically upgrade every server with that extension. Azure handles identifying which extension version should be rollout quickly to ensure all servers are protected. If you need to upgrade the extension immediately, follow the guidance to manually upgrade extensions using the [Azure portal](manage-vm-extensions-portal.md#upgrade-extensions), [Azure PowerShell](manage-vm-extensions-powershell.md#upgrade-extension) or [Azure CLI](manage-vm-extensions-cli.md#upgrade-extensions).

## Supported extensions

Automatic extension upgrade supports the following extensions:

- Azure Monitor agent - Linux and Windows
- Log Analytics agent (OMS agent) - Linux only
- Dependency agent – Linux and Windows
- Azure Security agent - Linux and Windows
- Key Vault Extension - Linux only
- Azure Update Manager - Linux and Windows
- Azure Automation Hybrid Runbook Worker - Linux and Windows
- Azure Arc-enabled SQL Server agent - Linux and Windows

More extensions will be added over time. Extensions that do not support automatic extension upgrade today are still configured to enable automatic upgrades by default. This setting will have no effect until the extension publisher chooses to support automatic upgrades.

## Manage automatic extension upgrade

Automatic extension upgrade is enabled by default when you install extensions on Azure Arc-enabled servers. To enable automatic upgrades for an existing extension, you can use Azure CLI or Azure PowerShell to set the `enableAutomaticUpgrade` property on the extension to `true`. You'll need to repeat this process for every extension where you'd like to enable or disable automatic upgrades.

### [Azure portal](#tab/azure-portal)

Use the following steps to configure automatic extension upgrades in using the Azure portal:

1. Go to the [Azure portal](https://portal.azure.com) navigate to **Machines - Azure Arc**.
1. Select the applicable server.
1. In the left pane, select the **Extensions** tab to see a list of all extensions installed on the server.
   :::image type="content" source="media/manage-automatic-vm-extension-upgrade/portal-navigation-extensions.png" alt-text="Screenshot of an Azure Arc-enabled server in the Azure portal showing where to navigate to extensions." border="true":::
1. The **Automatic upgrade** column in the table shows whether upgrades are enabled, disabled, or not supported for each extension. Select the checkbox next to the extensions for which you want automatic upgrades enabled, then select **Enable automatic upgrade** to turn on the feature. Select **Disable automatic upgrade** to turn off the feature.

### [Azure CLI](#tab/azure-cli)

To check the status of automatic extension upgrade for all extensions on an Arc-enabled server, run the following command:

```azurecli
az connectedmachine extension list --resource-group resourceGroupName --machine-name machineName --query "[].{Name:name, AutoUpgrade:properties.enableAutoUpgrade}" --output table
```

Use the [az connectedmachine extension update](/cli/azure/connectedmachine/extension) command to enable automatic upgrades on an extension:

```azurecli
az connectedmachine extension update \
    --resource-group resourceGroupName \
    --machine-name machineName \
    --name extensionName \
    --enable-auto-upgrade true
```

To disable automatic upgrades, set the `--enable-auto-upgrade` parameter to `false`, as shown below:

```azurecli
az connectedmachine extension update \
    --resource-group resourceGroupName \
    --machine-name machineName \
    --name extensionName \
    --enable-auto-upgrade false
```

### [Azure PowerShell](#tab/azure-powershell)

To check the status of automatic extension upgrade for all extensions on an Arc-enabled server, run the following command:

```azurepowershell
Get-AzConnectedMachineExtension -ResourceGroup resourceGroupName -MachineName machineName | Format-Table Name, EnableAutomaticUpgrade
```

To enable automatic upgrades for an extension using Azure PowerShell, use the [Update-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/update-azconnectedmachineextension) cmdlet:

```azurepowershell
Update-AzConnectedMachineExtension -ResourceGroup resourceGroupName -MachineName machineName -Name extensionName -EnableAutomaticUpgrade
```

To disable automatic upgrades, set `-EnableAutomaticUpgrade:$false` as shown in the example below:

```azurepowershell
Update-AzConnectedMachineExtension -ResourceGroup resourceGroupName -MachineName machineName -Name extensionName -EnableAutomaticUpgrade:$false
```

> [!TIP]
> The cmdlets above come from the [Az.ConnectedMachine](/powershell/module/az.connectedmachine) PowerShell module. You can install this PowerShell module with `Install-Module Az.ConnectedMachine` on your computer or in Azure Cloud Shell.

---

## Extension upgrades with multiple extensions

A machine managed by Arc-enabled servers can have multiple extensions with automatic extension upgrade enabled. The same machine can also have other extensions without automatic extension upgrade enabled.

If multiple extension upgrades are available for a machine, the upgrades might be batched together, but each extension upgrade is applied individually on a machine. A failure on one extension doesn't impact the other extension(s) to be upgraded. For example, if two extensions are scheduled for an upgrade, and the first extension upgrade fails, the second extension will still be upgraded.

## Check automatic extension upgrade history

You can use the Azure Activity Log to identify extensions that were automatically upgraded. You can find the Activity Log tab on individual Azure Arc-enabled server resources, resource groups, and subscriptions. Extension upgrades are identified by the `Upgrade Extensions on Azure Arc machines (Microsoft.HybridCompute/machines/upgradeExtensions/action)` operation.

To view automatic extension upgrade history, search for the **Azure Activity Log** in the Azure portal. Select **Add filter** and choose the Operation filter. For the filter criteria, search for "Upgrade Extensions on Azure Arc machines" and select that option. You can optionally add a second filter for **Event initiated by** and set "Azure Regional Service Manager" as the filter criteria to only see automatic upgrade attempts and exclude upgrades manually initiated by users.

:::image type="content" source="media/manage-automatic-vm-extension-upgrade/azure-activity-log-extension-upgrade.png" alt-text="Azure Activity Log showing attempts to automatically upgrade extensions on Azure Arc-enabled servers." border="true":::

## Next steps

- You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), [PowerShell](manage-vm-extensions-powershell.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

- Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).
