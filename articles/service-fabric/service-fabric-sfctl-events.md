---
title: Azure Service Fabric CLI- sfctl events 
description: Describes the Service Fabric CLI sfctl events commands.
author: jeffj6123

ms.topic: reference
ms.date: 1/16/2020
ms.author: jejarry
---

# sfctl events
Retrieve events from the events store (if EventStore service is already installed).

The EventStore system service can be added through a config upgrade to any SFRP cluster running >=6.4. Please check the following url\: https\://docs.microsoft.com/azure/service-fabric/service-fabric-diagnostics-eventstore.

## Commands

|Command|Description|
| --- | --- |
| all-applications-list | Gets all Applications-related events. |
| all-nodes-list | Gets all Nodes-related Events. |
| all-partitions-list | Gets all Partitions-related events. |
| all-services-list | Gets all Services-related events. |
| application-list | Gets an Application-related events. |
| cluster-list | Gets all Cluster-related events. |
| node-list | Gets a Node-related events. |
| partition-all-replicas-list | Gets all Replicas-related events for a Partition. |
| partition-list | Gets a Partition-related events. |
| partition-replica-list | Gets a Partition Replica-related events. |
| service-list | Gets a Service-related events. |

## sfctl events all-applications-list
Gets all Applications-related events.

The response is list of ApplicationEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events all-nodes-list
Gets all Nodes-related Events.

The response is list of NodeEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events all-partitions-list
Gets all Partitions-related events.

The response is list of PartitionEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events all-services-list
Gets all Services-related events.

The response is list of ServiceEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events application-list
Gets an Application-related events.

The response is list of ApplicationEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --application-id [Required] | The identity of the application. This is typically the full name of the application without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the application name is "fabric\:/myapp/app1", the application identity would be "myapp\~app1" in 6.0+ and "myapp/app1" in previous versions. |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events cluster-list
Gets all Cluster-related events.

The response is list of ClusterEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events node-list
Gets a Node-related events.

The response is list of NodeEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --node-name      [Required] | The name of the node. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events partition-all-replicas-list
Gets all Replicas-related events for a Partition.

The response is list of ReplicaEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --partition-id   [Required] | The identity of the partition. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events partition-list
Gets a Partition-related events.

The response is list of PartitionEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --partition-id   [Required] | The identity of the partition. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events partition-replica-list
Gets a Partition Replica-related events.

The response is list of ReplicaEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --partition-id   [Required] | The identity of the partition. |
| --replica-id     [Required] | The identifier of the replica. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

## sfctl events service-list
Gets a Service-related events.

The response is list of ServiceEvent objects.

### Arguments

|Argument|Description|
| --- | --- |
| --end-time-utc   [Required] | The end time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --service-id     [Required] | The identity of the service. This ID is typically the full name of the service without the 'fabric\:' URI scheme. Starting from version 6.0, hierarchical names are delimited with the "\~" character. For example, if the service name is "fabric\:/myapp/app1/svc1", the service identity would be "myapp\~app1\~svc1" in 6.0+ and "myapp/app1/svc1" in previous versions. |
| --start-time-utc [Required] | The start time of a lookup query in ISO UTC yyyy-MM-ddTHH\:mm\:ssZ. |
| --events-types-filter | This is a comma separated string specifying the types of FabricEvents that should only be included in the response. |
| --exclude-analysis-events | This param disables the retrieval of AnalysisEvents if true is passed. |
| --skip-correlation-lookup | This param disables the search of CorrelatedEvents information if true is passed. otherwise the CorrelationEvents get processed and HasCorrelatedEvents field in every FabricEvent gets populated. |
| --timeout -t | The server timeout for performing the operation in seconds. This timeout specifies the time duration that the client is willing to wait for the requested operation to complete. The default value for this parameter is 60 seconds.  Default\: 60. |

### Global Arguments

|Argument|Description|
| --- | --- |
| --debug | Increase logging verbosity to show all debug logs. |
| --help -h | Show this help message and exit. |
| --output -o | Output format.  Allowed values\: json, jsonc, table, tsv.  Default\: json. |
| --query | JMESPath query string. See http\://jmespath.org/ for more information and examples. |
| --verbose | Increase logging verbosity. Use --debug for full debug logs. |

