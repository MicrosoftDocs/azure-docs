
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
   ms.date="09/16/2016"
   ms.author="chackdan"/>

# Customize Service Fabric cluster settings and Fabric Upgrade policy

This document tells you how to customize the various fabric settings and the fabric upgrade policy for your service fabric cluster. You can customize them on the portal or using Azure resource manager template.


## Fabric settings that you can customize


Here are the Fabric settings that you can customize:

### Section Name : Security

|Parameter|Allowed Values|Guidance or short Descriptions|
|-----------------------|--------------------------|--------------------------|
|ClusterProtectionLevel|None or EncryptAndSign| None (default) for unsecured clusters, EncryptAndSign for secure clusters. |
<br/>
### Section Name : Hosting

|Parameter|Allowed Values|Guidance or short Descriptions|
|-----------------------|--------------------------|--------------------------|
|ServiceTypeRegistrationTimeout|Time in Seconds,default is 300| Maximum time allowed for the ServiceType to be  registered with fabric|
|ServiceTypeDisableFailureThreshold|Whole number, default is 1| This is the threshold for the failure count after which FailoverManager is notified to disable the service type on that node and try a different node for placement.|
|ActivationRetryBackoffInterval|Time in Seconds, default is 5|Backoff interval on every activation failure;On every continuous activation failure the system will retry the activation for up to the MaxActivationFailureCount. The retry interval on every try is a product of continuous activation failure and the activation back-off interval.|
|ActivationMaxRetryInterval|Time in seconds, default is 300| On every continuous activation failure the system will retry the activation for up to the ten times. This parameter specifies Wait time interval before retry after every activation failure |
|ActivationMaxFailureCount|Whole number,Default in 10| This is the maximum count for which system will retry failed activation before giving up |


### Section Name : FailoverManager

|**Parameter**|**Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : Federation

|**Parameter**|**Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : ClusterManager

|**Parameter**|**Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : PlacementAndLoadBalancing

|**Parameter**|** Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : MetricActivityThresholds

|**Parameter**|** Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : MetricBalancingThresholds

|**Parameter**|** Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : DefragmentationMetrics

|**Parameter**|** Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |

### Section Name : NodeBufferPercentage

|**Parameter**|** Allowed Values**|**Short Description**|
|-----------------------|--------------------------|
|ServiceTypeRegistrationTimeout|None or EncryptAndSign.| None (default) for unsecure cluters, EncryptAndSign for secure clusters. |



## Heading2
Perform the following steps before you create your cluster.

### Step 1: Heading3

+++++++++++++++++++++++++++++++++++++++++++++++ old
In the download package you find the following files:



## Next steps

At this point, you have a secure cluster using certificates for management authentication. Next, [connect to your cluster](service-fabric-connect-to-secure-cluster.md) and learn how to [manage application secrets](service-fabric-application-secret-management.md).


<!-- Links -->
[azure-powershell]: https://azure.microsoft.com/documentation/articles/powershell-install-configure/
[service-fabric-rp-helpers]: https://github.com/ChackDan/Service-Fabric/tree/master/Scripts/

<!--Image references-->
[CreateRG]: ./media/service-fabric-cluster-creation-via-portal/CreateRG.png

