---
title: Azure Service Fabric CLI- sfctl property 
description: Learn about sfctl, the Azure Service Fabric command line interface. Includes a list of commands for storing and querying properties.
ms.topic: reference
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# sfctl property
Store and query properties under Service Fabric names.

## Commands

|Command|Description|
| --- | --- |
| delete | Deletes the specified Service Fabric property. |
| get | Gets the specified Service Fabric property. |
| list | Gets information on all Service Fabric properties under a given name. |
| put | Creates or updates a Service Fabric property. |

## sfctl property delete
Deletes the specified Service Fabric property.

Deletes the specified Service Fabric property under a given name. A property must be created before it can be deleted.

### Arguments

|Argument|Description|
| --- | --- |
| --name-id       [Required] | The Service Fabric name, without the 'fabric\:' URI scheme. |
| --property-name [Required] | Specifies the name of the property to get. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl property get
Gets the specified Service Fabric property.

Gets the specified Service Fabric property under a given name. This will always return both value and metadata.

### Arguments

|Argument|Description|
| --- | --- |
| --name-id       [Required] | The Service Fabric name, without the 'fabric\:' URI scheme. |
| --property-name [Required] | Specifies the name of the property to get. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl property list
Gets information on all Service Fabric properties under a given name.

A Service Fabric name can have one or more named properties that store custom information. This operation gets the information about these properties in a paged list. The information includes name, value, and metadata about each of the properties.

### Arguments

|Argument|Description|
| --- | --- |
| --name-id [Required] | The Service Fabric name, without the 'fabric\:' URI scheme. |
| --continuation-token | The continuation token parameter is used to obtain next set of results. A continuation token with a non-empty value is included in the response of the API when the results from the system do not fit in a single response. When this value is passed to the next API call, the API returns next set of results. If there are no further results, then the continuation token does not contain a value. The value of this parameter should not be URL encoded. |
| --include-values | Allows specifying whether to include the values of the properties returned. True if values should be returned with the metadata; False to return only property metadata. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl property put
Creates or updates a Service Fabric property.

Creates or updates the specified Service Fabric property under a given name.

### Arguments

|Argument|Description|
| --- | --- |
| --name-id       [Required] | The Service Fabric name, without the 'fabric\:' URI scheme. |
| --property-name [Required] | The name of the Service Fabric property. |
| --value         [Required] | Describes a Service Fabric property value. This is a JSON string. <br><br> The json string has two fields, the 'Kind' of the data, and the value, entered as 'Data' of the data. The 'Kind' value must be the first item to appear in the JSON string, and can be values 'Binary', 'Int64', 'Double', 'String', or 'Guid'. The value should be serialize-able to the given types. Both 'Kind' and 'Data' values should be provided as strings. |
| --custom-id-type | The property's custom type ID. Using this property, the user is able to tag the type of the value of the property. |
| --timeout -t | Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |


## Next steps
- [Set up](service-fabric-cli.md) the Service Fabric CLI.
- Learn how to use the Service Fabric CLI using the [sample scripts](./scripts/sfctl-upgrade-application.md).
