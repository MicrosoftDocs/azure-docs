---
title: Azure Service Fabric CLI- sfctl compose| Microsoft Docs
description: Describes the Service Fabric CLI sfctl compose commands.
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
# sfctl compose
Create, delete, and manage Docker Compose applications.

## Commands

|Command|Description|
| --- | --- |
|    create| Creates a Service Fabric application from a Compose file.|
|    list  | Gets the list of compose applications created in the Service Fabric cluster.|
|   remove| Deletes an existing Service Fabric compose application from cluster.|
|   status| Gets information about a Service Fabric compose application.|


## sfctl compose create
Creates a Service Fabric application from a Compose file.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The ID of application to create from Compose file. This is             typically the full ID of the application including "fabric:" URI             scheme.|
| --compose-file   [Required]| Path to the Compose file to use.|
| --encrypted             | If true, indicate to use an encrypted password rather than             prompting for a plaintext one.|
| --repo-pass             | Encrypted contain repository password.|
| --repo-user             | Container repository user name if needed for authentication.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:             json.|
| --query                 | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl compose list
Gets the list of compose applications created in the Service Fabric cluster.

Gets the status about the compose applications that were created or are in the process of being
        created in the Service Fabric cluster. The response includes the name, status, and other
        details about the compose application. If the applications do not fit in a page, one page of
        results is returned as well as a continuation token, which can be used to get the next page.

### Arguments

|Argument|Description|
| --- | --- |
| --continuation-token| The continuation token parameter is used to obtain next set of results. A      continuation token with a non empty value is included in the response of      the API when the results from the system do not fit in a single response.      When this value is passed to the next API call, the API returns next set      of results. If there are no further results, then the continuation token      does not contain a value. The value of this parameter should not be URL      encoded.|
| --max-results    | The maximum number of results to be returned as part of the paged queries.      This parameter defines the upper bound on the number of results returned.      If      they do not fit in the message as per the max message size restrictions      defined in the configuration, the results returned can be less than the specified maximum results. If this parameter is zero or not specified,      the paged queries includes as much results as possible that fit in the      return message.|
| --timeout -t     | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug          | Increase logging verbosity to show all debug logs.|
| --help -h        | Show this help message and exit.|
| --output -o      | Output format.  Allowed values: json, jsonc, table, tsv.  Default: json.|
| --query          | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose        | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl compose remove
Deletes an existing Service Fabric compose application from cluster.

Deletes an existing Service Fabric compose application. An application must be created
        before it can be deleted.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The identity of the application. This is typically the full name of             the application without the 'fabric:' URI scheme.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:             json.|
| --query                 | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## sfctl compose status
Gets information about a Service Fabric compose application.

Returns the status of compose application that was created or in the process of being
        created in the Service Fabric cluster and whose name matches the one specified as the
        parameter. The response includes the name, status, and other details about the application.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required]| The identity of the application. This is typically the full name of             the application without the 'fabric:' URI scheme.|
| --timeout -t            | Server timeout in seconds.  Default: 60.|

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug                 | Increase logging verbosity to show all debug logs.|
| --help -h               | Show this help message and exit.|
| --output -o             | Output format.  Allowed values: json, jsonc, table, tsv.  Default:             json.|
| --query                 | JMESPath query string. For more information and examples, see http://jmespath.org/.|
| --verbose               | Increase logging verbosity. Use --debug for full debug logs.|

## Next Steps
- [Setup](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](/azure/service-fabric/scripts/sfctl-upgrade-application).