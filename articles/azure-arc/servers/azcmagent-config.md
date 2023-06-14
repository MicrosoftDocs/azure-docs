---
title: azcmagent config CLI reference
description: Syntax for the azcmagent config command line tool
ms.topic: reference
ms.date: 04/20/2023
---

# azcmagent config

Configure settings for the Azure connected machine agent. Configurations are stored locally and are unique to each machine. Available configuration properties vary by agent version. Use [azcmagent config info](#azcmagent-config-info) to see all available configuration properties and supported values for the currently installed agent.

## Commands

| Command | Purpose |
| ------- | ------- |
| [azcmagent config clear](#azcmagent-config-clear) | Clear a configuration property's value |
| [azcmagent config get](#azcmagent-config-get) | Gets a configuration property's value |
| [azcmagent config info](#azcmagent-config-info) | Describes all available configuration properties and supported values |
| [azcmagent config list](#azcmagent-config-list) | Lists all configuration properties and values |
| [azcmagent config set](#azcmagent-config-set) | Set a value for a configuration property |

## azcmagent config clear

Clear a configuration property's value and reset it to its default state.

### Usage

```
azcmagent config clear [property] [flags]
```

### Examples

Clear the proxy server URL property.

```
azcmagent config clear proxy.url
```

### Flags

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]

## azcmagent config get

Get a configuration property's value.

### Usage

```
azcmagent config get [property] [flags]
```

### Examples

Get the agent mode.

```
azcmagent config get config.mode
```

### Flags

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]

## azcmagent config info

Describes available configuration properties and supported values. When run without specifying a specific property, the command describes all available properties their supported values.

### Usage

```
azcmagent config info [property] [flags]
```

### Examples

Describe all available configuration properties and supported values.

```
azcmagent config info
```

Learn more about the extensions allowlist property and its supported values.

```
azcmagent config info extensions.allowlist
```

### Flags

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]

## azcmagent config list

Lists all configuration properties and their current values

### Usage

```
azcmagent config list [flags]
```

### Examples

List the current agent configuration.

```
azcmagent config list
```

### Flags

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]

## azcmagent config set

Set a value for a configuration property.

### Usage

```
azcmagent config set [property] [value] [flags]
```

### Examples

Configure the agent to use a proxy server.

```
azcmagent config set proxy.url "http://proxy.contoso.corp:8080"
```

Append an extension to the extension allowlist.

```
azcmagent config set extensions.allowlist "Microsoft.Azure.Monitor/AzureMonitorWindowsAgent" --add
```

### Flags

`-a`, `--add`

Append the value to the list of existing values. If not specified, the default behavior is to replace the list of existing values. This flag is only supported for configuration properties that support more than one value. Can't be used with the `--remove` flag.

`-r`, `--remove`

Remove the specified value from the list, retaining all other values. If not specified, the default behavior is to replace the list of existing values. This flag is only supported for configuration properties that support more than one value. Can't be used in conjunction with the `--add` flag.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
