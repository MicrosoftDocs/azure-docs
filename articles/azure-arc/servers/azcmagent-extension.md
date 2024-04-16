---
title: azcmagent extension CLI reference
description: Syntax for the azcmagent extension command line tool
ms.topic: reference
ms.date: 03/11/2024
---

# azcmagent extension

Local management of Azure Arc extensions installed on the machine. These commands can be run even when a machine is in a disconnected state.

The extension manager must be stopped before running any of these commands. Stopping the extension manager interrupts any in-progress extension installs, upgrades, and removals. To disable the extension manager, run `Stop-Service ExtensionService` on Windows or `systemctl stop extd`. When you're done managing extensions locally, start the extension manager again with `Start-Service ExtensionService` on Windows or `systemctl start extd` on Linux.

## Commands

| Command | Purpose |
| ------- | ------- |
| [azcmagent extension list](#azcmagent-extension-list) | Lists extensions installed on the machine |
| [azcmagent extension remove](#azcmagent-extension-remove) | Uninstalls extensions on the machine |

## azcmagent extension list

Lists extensions installed on the machine.

### Usage

```
azcmagent extension list [flags]
```

### Examples

See which extensions are installed on your machine.

```
azcmagent extension list
```

### Flags

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]

## azcmagent extension remove

Uninstalls extensions on the machine.

### Usage

```
azcmagent extension remove [flags]
```

### Examples

Remove the "AzureMonitorWindowsAgent" extension from the local machine.

```
azcmagent extension remove --name AzureMonitorWindowsAgent
```

Remove all extensions from the local machine.

```
azcmagent extension remove --all
```

### Flags

`--all`, `-a`

Removes all extensions from the machine.

`--name`, `-n`

Removes the specified extension from the machine. Use [azcmagent extension list](#azcmagent-extension-list) to get the name of the extension.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
