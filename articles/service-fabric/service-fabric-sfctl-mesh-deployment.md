---
title: Azure Service Fabric CLI- sfctl mesh deployment
description: Learn about sfctl, the Azure Service Fabric command-line interface. Includes a list of commands for creating Service Fabric Mesh resources.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
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
| --input-yaml-files [Required] | Comma-separated relative or absolute file paths of all the yaml files or relative or absolute path of the directory (recursive) that contain yaml files. |
| --parameters | A relative or absolute path to a yaml file or a json object that contains the parameters that need to be overridden. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

### Examples

Consolidates and deploys all the resources to cluster by overriding the parameters mentioned in the yaml file
```	
sfctl mesh deployment create --input-yaml-files ./app.yaml,./network.yaml --parameters	
./param.yaml	
```

Consolidates and deploys all the resources in a directory to cluster by overriding the parameters mentioned in the yaml file

```	
sfctl mesh deployment create --input-yaml-files ./resources --parameters ./param.yaml
```

Consolidates and deploys all the resources in a directory to cluster by overriding the parameters that are passed directly as json object
```	
sfctl mesh deployment create --input-yaml-files ./resources --parameters "{ 'my_param' :	
{'value' : 'my_value'} }"	
```

## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).
