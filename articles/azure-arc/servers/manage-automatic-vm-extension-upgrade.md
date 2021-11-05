---
title: Automatic Extension Upgrade (preview) for Azure Arc-enabled servers
description: Learn how to enable the Automatic Extension Upgrade (preview) for your Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 11/04/2021
---

# Automatic Extension Upgrade (preview) for Azure Arc-enabled servers

Automatic Extension Upgrade (preview) is available for Azure Arc-enabled servers that have supported VM extensions installed. When Automatic Extension Upgrade (preview) is enabled on a machine, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension.

 Automatic Extension Upgrade has the following features:

- You can opt in and out of automatic upgrades at any time.
- Each supported extension is enrolled individually, and you can choose which extensions to upgrade automatically.
- Supported in all public cloud regions.

> [!NOTE]
> In this release, only the Azure CLI is supported to configure Automatic Extension Upgrade.

## How does Automatic Extension Upgrade work?

The extension upgrade process replaces the existing Azure VM extension version supported by Azure Arc-enabled servers with a new version of the same extension when published by the extension publisher. The health of the machine is monitored after the new extension is installed. If the machine is not in a healthy state within 5 minutes of the upgrade completion, the extension version is rolled back to the previous version.

A failed extension update is automatically retried. A retry is attempted every few days automatically without user intervention.

## Upgrade process

How does the upgrade process work for an Arc-enabled server?

## Supported extensions

Automatic Extension Upgrade (preview) supports the following extensions (and more are added periodically):

- Dependency agent – Linux and Windows
- Azure Monitor Agent - Linux and Windows
- Azure Security agent - Linux and Windows
- Key Vault Extension - Linux only
- Log Analytics agent - Linux only

## Enabling Automatic Extension Upgrade (preview)

To enable Automatic Extension Upgrade (preview) for an extension, you must ensure the property `enable-auto-upgrade` is set to `true` and added to every extension definition individually.

Use the [az connectedmachine extension ](/cli/azure/connectedmachine/extension) cmdlet with the `--extension-name`, `--machine-name`, `-publisher`, `--enable-auto-upgrade`, and `--resource-group` parameters.

```azurecli
az connectedmachine extension set \
    --resource-group resourceGroupName \
    --machine-name machineName \
    --extension-name DependencyAgentLinux \
    --publisher Microsoft.Azure.Monitoring.DependencyAgent \
    --version 9.5 \
    --enable-auto-upgrade true
```

To verify Automatic Extension Upgrade (preview) is available, run the following command:

```azurecli
az connectedmachine extension list --resource-group resourceGroupName --machine-name machineName --query "[].{Name:name, AutoUpgrade:properties.enableAutoUpgrade}" --output table
```

## Extension upgrades with multiple extensions

A machine managed by Arc-enabled servers can have multiple extensions with automatic extension upgrade enabled. The same machine can also have other extensions without automatic extension upgrade enabled.  

If multiple extension upgrades are available for a machine, the upgrades may be batched together, but each extension upgrade is applied individually on a machine. A failure on one extension does not impact the other extension(s) to be upgraded. For example, if two extensions are scheduled for an upgrade, and the first extension upgrade fails, the second extension will still be upgraded.

## Disable Automatic Extension Upgrade

To disable Automatic Extension Upgrade (preview) for an extension, you must ensure the property `enable-auto-upgrade` is set to `false` and added to every extension definition individually.

### Using the Azure CLI

Use the [az connectedmachine extension ](/cli/azure/connectedmachine/extension) cmdlet with the `--extension-name`, `--machine-name`, `--publisher`, `--enable-auto-upgrade`, and `--resource-group` parameters.

```azurecli
az connectedmachine extension set \
    --resource-group resourceGroupName \
    --machine-name machineName \
    --name DependencyAgentLinux \
    --publisher Microsoft.Azure.Monitoring.DependencyAgent \
    --version 9.5 \
    --enable-auto-upgrade false
```

## Next steps

- You can deploy, manage, and remove VM extensions using the [Azure CLI](manage-vm-extensions-cli.md), [PowerShell](manage-vm-extensions-powershell.md), or [Azure Resource Manager templates](manage-vm-extensions-template.md).

- Troubleshooting information can be found in the [Troubleshoot VM extensions guide](troubleshoot-vm-extensions.md).