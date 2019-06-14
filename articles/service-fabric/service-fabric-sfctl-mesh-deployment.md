---
title: Azure Service Fabric CLI- sfctl mesh deployment | Microsoft Docs
description: Describes the Service Fabric CLI sfctl mesh deployment commands.
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

# sfctl mesh deployment
Create Service Fabric Mesh resources.

## Commands

|Command|Description|
| --- | --- |
| create | Creates a deployment of Service Fabric Mesh Resources. |

## sfctl mesh deployment create
Creates a deployment of Service Fabric Mesh Resources.

### Arguments

|Argument|Description|
| --- | --- |
| --input-yaml-files [Required] | Comma-separated relative/absolute file paths of all the yaml files or relative/absolute path of the directory (recursive) which contain yaml files. |
| --parameters | A relative/absolute path to yaml file or a json object that contains the parameters that need to be overridden. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

### Examples

Consolidates and deploys all the resources to cluster by overriding the parameters mentioned in
the yaml file

```
sfctl mesh deployment create --input-yaml-files ./app.yaml,./network.yaml --parameters
./param.yaml
```

Consolidates and deploys all the resources in a directory to cluster by overriding the
parameters mentioned in the yaml file

```
sfctl mesh deployment create --input-yaml-files ./resources --parameters ./param.yaml
```

Consolidates and deploys all the resources in a directory to cluster by overriding the
parameters, which are passed directly as json object

```
sfctl mesh deployment create --input-yaml-files ./resources --parameters "{ 'my_param' :
{'value' : 'my_value'} }"
```


## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).