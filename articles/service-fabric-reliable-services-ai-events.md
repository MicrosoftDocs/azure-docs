<properties
   pageTitle="Overview of the Service Fabric Reliable Stateful Service Configuration"
   description="Learn about configuring Service Fabric Reliable Stateful Service"
   services="Service-Fabric"
   documentationCenter=".net"
   authors="sumukhs"
   manager="timlt"
   editor=""/>

<tags
   ms.service="Service-Fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="04/20/2015"
   ms.author="sumukhs"/>

# Reliable Stateful Service Configuration
TODO: Overview of the types of configurations and how to set them in general

## Log Configuration Settings
|Name|Unit/Type|Default Value|Remarks|
|----|---------|-------------|-------|
|MaxStreamSizeInMB|Megabytes|1024|Sets the maximum size of the dedicated log file. The size in bytes must be at least 16 times larger than the MaxRecordSize expressed in bytes.|
|MaxRecordSizeInKB|Kilobytes|1024|Sets the largest record size which the replicator may write in the log. This value must be a multiple of 4 and greater than 16.|
|OptimizeForLocalSSD|boolean|false|When true the log is configured so state information is written directly to the replica's dedicated log file. This provides best performance when log files are on solid state disk media or when the VM disk IO rate is serverly throttled. When false the state information is staged in the shared log file first and then destaged to the dedcated log file.|
|OptimizeLogForLowerDiskUsage|boolean|false|When true the log is configured to so that the replica's dedicated log file is created using an NTFS sparse file. This lowers the actual disk space usage for the file. When false the file is created with fixed allocations which provide the best write performance.|
|SharedLogId|guid|""|Specifies a unique guid to use for identifing the shared log file used with this replica. Typically services should not use this setting however if SharedLogId is specified then SharedLogPath must also be specified.|
|SharedLogPath|Fully qualified pathname|""|Specifies the fully qualified path where the shared log file for this replica will be created. Typically services should not use this setting however if SharedLogPath is specified then SharedLogId must also be specified.|

The value for MaxStreamSizeInMB determines the amount of disk space that the replicator can use to store state information in the replica's dedicated log file. Since the stored information state is used
to allow another replica to match the state of a primary replica, it is generally better to have a larger log file as this will reduce the amount of time it takes for the other replica to match the state
of the primary. However larger log files may use more disk space and thus reduce the number of replicas that can be hosted on a particular node.  

The OptimizeForLowerDiskUsage setting allows log file space to be "over-provisioned" so that active replicas can store more state information in their log files while inactive replicas would use less disk
space. Although this allows more replicas to be hosted on a node than would otherwise happen because of a lack of disk space, by setting OptimizeForLowerDiskUsage to false the state information is written to
the log files more quickly.

The OptimizeForLocalSSD setting is used to disable writing state information to the shared log file first before destaging to the dedicated log file. It should typically be set when the local disk storage 
for the dedicated log file is solid state media as minimizing disk head movement is not an issue. It may also be used when the VM is performing a lot of local disk IO and local disk IO rates are 
significantly throttled by the VM host.

The MaxRecordSizeInKB defines the maximum size of a record that can be written by the replicator into the log file. In most all cases the default 1024KB record size is optimal however if the service is 
causing larger data items to be part of the state information then this value might need to be increased. There is little benefit in making the MaxRecordSizeInKB smaller than 1024 as smaller records
only use the space needed for the smaller record. It is expected that it would need to be changed in only rare cases.

The SharedLogId and SharedLogPath settings are always used together and allow a service to use a separate shared log from the default shared log for the node. For best efficiency, as many services as 
possible should specify the same shared log. Shared log files should be placed on disks that are used solely for the shared log file so that head movement contention is reduced. It is expected that it would need to be changed in only rare cases.


## Replicator Configuration
Replicator Configurations are used to configure the replicator that is responsible for making the Reliable Stateful Service state highly reliable by replicating and persisting the state.
### Section Name
TODO: StatefulServiceTypeReplicatorConfiguration
### Configuration Names
TODO: List of configurations for configuring the Replicator

## Replicator Security Configuration
Replicator Security Configurations are used to secure the communication channel that is used during replication.
### Section Name
TODO: StatefulServiceTypeReplicatorSecurityConfiguration
### Configuration Names
TODO: List of configurations
