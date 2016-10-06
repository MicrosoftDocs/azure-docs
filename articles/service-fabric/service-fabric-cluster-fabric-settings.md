
<properties
   pageTitle="Customize Service Fabric cluster settings and Fabric Upgrade policy | Microsoft Azure"
   description="This article describes the fabric settings and the fabric upgrade policies that you can customize."
   services="service-fabric"
   documentationCenter=".net"
   authors="chackdan"
   manager="timlt"
   editor=""/>

<tags
   ms.service="service-fabric"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="NA"
   ms.date="09/20/2016"
   ms.author="chackdan"/>

# Customize Service Fabric cluster settings and Fabric Upgrade policy

This document tells you how to customize the various fabric settings and the fabric upgrade policy for your service fabric cluster. You can customize them on the portal or using a Resource Manager template.

## Fabric settings that you can customize


Here are the Fabric settings that you can customize:

### Section Name: Security

|**Parameter**|**Allowed Values**|**Guidance or short Description**|
|-----------------------|--------------------------|--------------------------|
|ClusterProtectionLevel|None or EncryptAndSign| None (default) for unsecured clusters, EncryptAndSign for secure clusters. |

### Section Name: Hosting

|**Parameter**|**Allowed Values**|**Guidance or short Description**|
|-----------------------|--------------------------|--------------------------|
|ServiceTypeRegistrationTimeout|Time in Seconds, default is 300| Maximum time allowed for the ServiceType to be  registered with fabric|
|ServiceTypeDisableFailureThreshold|Whole number, default is 1| This is the threshold for the failure count after which FailoverManager (FM) is notified to disable the service type on that node and try a different node for placement.|
|ActivationRetryBackoffInterval|Time in Seconds, default is 5|Backoff interval on every activation failure; On every continuous activation failure, the system retries the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval.|
|ActivationMaxRetryInterval|Time in seconds, default is 300| On every continuous activation failure, the system retries the activation for up to ActivationMaxFailureCount. ActivationMaxRetryInterval specifies Wait time interval before retry after every activation failure |
|ActivationMaxFailureCount|Whole number, default is 10| Number of times system retries failed activation before giving up |

### Section Name: FailoverManager

|**Parameter**|**Allowed Values**|**Guidance or short Description**|
|-----------------------|--------------------------|--------------------------|
|PeriodicLoadPersistInterval|Time in seconds, default is 10| This determines how often the FM check for new load reports|

### Section Name: Federation

|**Parameter**|**Allowed Values**|**Guidance or short Description**|
|-----------------------|--------------------------|--------------------------|
|LeaseDuration|Time in seconds, default is 30|Duration that a lease lasts between a node and its neighbors.|
|LeaseDurationAcrossFaultDomain|Time in seconds, default is 30|Duration that a lease lasts between a node and its neighbors across fault domains.|

### Section Name: ClusterManager

|**Parameter**|**Allowed Values**|**Guidance or short Description**|
|-----------------------|--------------------------|--------------------------|
|UpgradeStatusPollInterval|Time in seconds, default is 60|The frequency of polling for application upgrade status. This value determines the rate of update for any GetApplicationUpgradeProgress call|
|UpgradeHealthCheckInterval|Time in seconds, default is 60|The frequency of health status checks during a monitored application upgrades|
|FabricUpgradeStatusPollInterval|Time in seconds, default is 60|The frequency of polling for Fabric upgrade status. This value determines the rate of update for any GetFabricUpgradeProgress call |
|FabricUpgradeHealthCheckInterval|Time in seconds, default is 60|The frequency of health status check during a  monitored Fabric upgrade|



## Next steps

Read these articles for more information on cluster management:

[Add, Roll over, remove certificates from your Azure cluster ](service-fabric-cluster-security-update-certs-azure.md) 



