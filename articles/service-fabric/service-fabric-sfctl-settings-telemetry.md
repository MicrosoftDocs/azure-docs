---
title: Azure Service Fabric CLI- sfctl settings telemetry | Microsoft Docs
description: Describes the Service Fabric CLI sfctl settings telemetry commands.
services: service-fabric
documentationcenter: na
author: Christina-Kang
manager: chackdan
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: reference
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 12/06/2018
ms.author: bikang

---

# sfctl settings telemetry
Configure telemetry settings local to this instance of sfctl.

Sfctl telemetry collects command name without parameters provided or their values, sfctl version, OS type, python version, the success or failure of the command, the error message returned.

## Commands

|Command|Description|
| --- | --- |
| set-telemetry | Turn on or off telemetry. |

## sfctl settings telemetry set-telemetry
Turn on or off telemetry.

### Arguments

|Argument|Description|
| --- | --- |
| --off | Turn off telemetry. |
| --on | Turn on telemetry. This is the default value. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

### Examples

Turn off telemetry.

```
sfctl settings telemetry set_telemetry --off
```

Turn on telemetry.

```
sfctl settings telemetry set_telemetry --on
```


## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).