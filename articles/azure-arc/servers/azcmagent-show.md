---
title: azcmagent show CLI reference
description: Syntax for the azcmagent show command line tool
ms.topic: reference
ms.date: 04/20/2023
---

# azcmagent show

Displays the current state of the Azure Connected Machine agent, including whether or not it's connected to Azure, the Azure resource information, and the status of dependent services.

## Usage

```
azcmagent show [flags]
```

## Examples

Check the status of the agent.

```
azcmagent show
```

Check the status of the agent and save it in a JSON file in the current directory.

```
azcmagent show -j > "agent-status.json"
```

## Flags

`--os`

Outputs additional information about the operating system.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
