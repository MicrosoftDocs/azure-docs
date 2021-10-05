---
title: Automatic Extension Upgrade for Azure Arc-enabled servers
description: Learn how to enable the Automatic Extension Upgrade for your Azure Arc-enabled servers.
ms.topic: conceptual
ms.date: 08/10/2021
---

# Automatic Extension Upgrade for Azure Arc-enabled servers

Automatic Extension Upgrade is available for Azure Arc-enabled servers that have supported VM extensions installed. When Automatic Extension Upgrade is enabled on a machine, the extension is upgraded automatically whenever the extension publisher releases a new version for that extension.

 Automatic Extension Upgrade has the following features:

- You can opt out of automatic upgrades at any time.
- Each supported extension is enrolled individually, and you can choose which extensions to upgrade automatically.
- Supported in all public cloud regions.

## How does Automatic Extension Upgrade work?

The extension upgrade process replaces the existing Azure VM extension version supported by Azure Arc-enabled servers with a new version of the same extension when published by the extension publisher. The health of the machine is monitored after the new extension is installed. If the machine is not in a healthy state within 5 minutes of the upgrade completion, the extension version is rolled back to the previous version.

A failed extension update is automatically retried. A retry is attempted every few days automatically without user intervention.

## Upgrade process

How does the upgrade process work for an Arc-enabled server?

## Supported extensions

Automatic Extension Upgrade supports the following extensions (and more are added periodically):

- Dependency Agent – [Linux](./extensions/agent-dependency-linux.md) and [Windows](./extensions/agent-dependency-windows.md)
- [Guest Configuration Extension](./extensions/guest-configuration.md) – Linux and Windows
- Key Vault – [Linux](./extensions/key-vault-linux.md) and [Windows](./extensions/key-vault-windows.md)

## Enabling Automatic Extension Upgrade

To enable Automatic Extension Upgrade for an extension, you must ensure the property `enableAutomaticUpgrade` is set to `true` and added to every extension definition individually.

### Using the REST API

To enable automatic extension upgrade for an extension (in this example the Dependency Agent extension), use the following:

```
PUT on `/subscriptions/<subscriptionId>/resourceGroups/<resourceGroupName>/providers/Microsoft.HybridCompute/machines/<machineName>/extensions/<extensionName>?api-version=2019-12-01`
```

```json
{    
    "name": "extensionName",
    "type": "Microsoft.Compute/HybridMachines/extensions",
    "location": "<location>",
    "properties": {
        "autoUpgradeMinorVersion": true,
        "enableAutomaticUpgrade": true, 
        "publisher": "Microsoft.Azure.Monitoring.DependencyAgent",
        "type": "DependencyAgentWindows",
        "typeHandlerVersion": "9.5"
        }
}
```

### Using Azure PowerShell

Use the [Set-AzConnectedMachineExtension](/powershell/module/az.connectedmachine/new-azconnectedmachineextension) cmdlet:

```azurepowershell-interactive
Set-AzConnectedMachineExtension -ExtensionName "Microsoft.Azure.Monitoring.DependencyAgent" `
    -ResourceGroupName "myResourceGroup" `
    -VMName "myVM" `
    -Publisher "Microsoft.Azure.Monitoring.DependencyAgent" `
    -ExtensionType "DependencyAgentWindows" `
    -TypeHandlerVersion 9.5 `
    -Location WestUS `
    -EnableAutomaticUpgrade $true
```

### Using the Azure CLI

Use the [az connectedmachine extension ](/cli/azure/connectedmachine/extension) cmdlet:

```azurecli-interactive
az connectedmachine extension set \
    --resource-group myResourceGroup \
    --vm-name myVM \
    --name DependencyAgentLinux \
    --publisher Microsoft.Azure.Monitoring.DependencyAgent \
    --version 9.5 \
    --enable-auto-upgrade true
```

## Extension upgrades with multiple extensions

A machine managed by Arc-enabled servers can have multiple extensions with automatic extension upgrade enabled. The same machine can also have other extensions without automatic extension upgrade enabled.  

If multiple extension upgrades are available for a machine, the upgrades may be batched together, but each extension upgrade is applied individually on a machine. A failure on one extension does not impact the other extension(s) to be upgraded. For example, if two extensions are scheduled for an upgrade, and the first extension upgrade fails, the second extension will still be upgraded.

## Next steps
