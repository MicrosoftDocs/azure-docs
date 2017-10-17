---
title: Azure Service Fabric CLI- sfctl rpm| Microsoft Docs
description: Describes the Service Fabric CLI sfctl rpm commands.
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
ms.date: 09/26/2017
ms.author: ryanwi

---

# sfctl rpm
Query and send commands to the repair manager service.

## Commands
|Command|Description|
| --- | --- |
|    approve-force| Forces the approval of the given repair task.|
|    delete       | Deletes a completed repair task.|
|    list         | Gets a list of repair tasks matching the given filters.|

## sfctl rpm delete
Deletes a completed repair task.

This API supports the Service Fabric platform; it is not meant to be used directly from your
        code. 

### Arguments
|Argument|Description|
| --- | --- |
|    --task-id [Required]| The ID of the completed repair task to be deleted.|
|    --version           | The current version number of the repair task. If non-zero, then the                          request will only succeed if this value matches the actual current version of the repair task. If zero, then no version check is performed.|

### Global Arguments
|Argument|Description|
| --- | --- |
|    --debug             | Increase logging verbosity to show all debug logs.|
|    --help -h           | Show this help message and exit.|
|    --output -o         | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.
|    --query             | JMESPath query string. See http://jmespath.org/ for more information and examples.|
|    --verbose           | Increase logging verbosity. Use --debug for full debug logs.|


## sfctl rpm list
Gets a list of repair tasks matching the given filters.

This API supports the Service Fabric platform; it is not meant to be used directly from your
        code. 

### Arguments
|Argument|Description|
| --- | --- |
|    --executor-filter| The name of the repair executor whose claimed tasks should be included in the   list.|
|    --state-filter   | A bitwise-OR of the following values, specifying which task states should be included in the result list. - 1 - Created - 2 - Claimed - 4 - Preparing - 8 - Approved - 16 - Executing - 32 - Restoring - 64 - Completed.|
|    --task-id-filter | The repair task ID prefix to be matched.|

### Global Arguments
|Argument|Description|
| --- | --- |
|    --debug          | Increase logging verbosity to show all debug logs.|
|    --help -h        | Show this help message and exit.|
|    --output -o      | Output format.  Allowed values: json, jsonc, table, tsv.  Default| json.|
|    --query          | JMESPath query string. See http://jmespath.org/ for more information and examples.|
|    --verbose        | Increase logging verbosity. Use --debug for full debug logs.|

## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).