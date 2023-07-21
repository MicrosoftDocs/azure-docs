---
title: azcmagent show CLI reference
description: Syntax for the azcmagent show command line tool
ms.topic: reference
ms.date: 06/06/2023
---

# azcmagent show

Displays the current state of the Azure Connected Machine agent, including whether or not it's connected to Azure, the Azure resource information, and the status of dependent services.

> [!NOTE]
> **azcmagent show** does not require administrator privileges

## Usage

```
azcmagent show [property1] [property2] ... [propertyN] [flags]
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

Show only the agent status and last heartbeat time (using display names)

```
azcmagent show "Agent Status" "Agent Last Heartbeat"
```

Show only the agent status and last heartbeat time (using JSON keys)

```
azcmagent show status lastHeartbeat
```

## Flags

`[property]`

The name of a property to include in the output. If you want to show more than one property, separate them by spaces. You can use either the display name or the JSON key name to specify a property. For display names with spaces, enclose the property in quotes.

`--os`

Outputs additional information about the operating system.

[!INCLUDE [common-flags](includes/azcmagent-common-flags.md)]
