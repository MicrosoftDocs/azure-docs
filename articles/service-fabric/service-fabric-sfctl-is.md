---
title: Azure Service Fabric CLI- sfctl is | Microsoft Docs
description: Describes the Service Fabric CLI sfctl is commands.
services: service-fabric
documentationcenter: na
author: rwike77
manager: timlt
editor: ''

ms.assetid: 
ms.service: service-fabric
ms.devlang: cli
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: multiple
ms.date: 09/22/2017
ms.author: ryanwi

---

# sfctl is
Query and send commands to the infrastructure service.

## Commands

|Command|Description|
| --- | --- |
|    command| Invokes an administrative command on the given Infrastructure Service instance.|
|    query  | Invokes a read-only query on the given infrastructure service instance.|


## sfctl is command
Invokes an administrative command on the given Infrastructure Service
    instance.

For clusters that have one or more instances of the Infrastructure Service configured, this
        API provides a way to send infrastructure-specific commands to a particular instance of the
        Infrastructure Service. Available commands and their corresponding response formats vary
        depending upon the infrastructure on which the cluster is running. This API supports the
        Service Fabric platform; it is not meant to be used directly from your code. .

### Arguments

|Argument|Description|
| --- | --- |
| --command [Required]| The text of the command to be invoked. The content of the command is      infrastructure-specific.  Default: is command.|
| --service-id     | The identity of the infrastructure service. This is  the full name of the      infrastructure service without the 'fabric:' URI scheme. This parameter      required only for clusters that have more than one instance of      infrastructure service running.|
| --timeout -t     | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug          | Increase logging verbosity to show all debug logs.|
| --help -h        | Show this help message and exit.|
| --output -o      | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query          | JMESPath query string. For more information and      examples, see http://jmespath.org/.|
| --verbose        | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl is query
Invokes a read-only query on the given infrastructure service instance.

For clusters that have one or more instances of the Infrastructure Service configured, this
        API provides a way to send infrastructure-specific queries to a particular instance of the
        Infrastructure Service. Available commands and their corresponding response formats vary
        depending upon the infrastructure on which the cluster is running. This API supports the
        Service Fabric platform; it is not meant to be used directly from your code.

### Arguments

|Argument|Description|
| --- | --- |
| --command [Required]| The text of the command to be invoked. The content of the command is      infrastructure-specific.  Default: is query.|
| --service-id     | The identity of the infrastructure service. This is  the full name of the      infrastructure service without the 'fabric:' URI scheme. This parameter is     required only for clusters that have more than one instance of      infrastructure service running.|
| --timeout -t     | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug          | Increase logging verbosity to show all debug logs.|
| --help -h        | Show this help message and exit.|
| --output -o      | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query          | JMESPath query string. For more information, see http://jmespath.org/.|
| --verbose        | Increase logging verbosity. Use --debug for full debug logs.|

## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).