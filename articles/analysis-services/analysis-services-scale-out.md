---
title: Azure Analysis Services scale-out| Microsoft Docs
description: Replicate Azure Analysis Services servers with scale-out
author: minewiskan
manager: kfile
ms.service: azure-analysis-services
ms.topic: conceptual
ms.date: 03/13/2019
ms.author: owend
ms.reviewer: minewiskan

---
# Azure Analysis Services scale-out

With scale-out, client queries can be distributed among multiple *query replicas* in a query pool, reducing response times during high query workloads. You can also separate processing from the query pool, ensuring client queries are not adversely affected by processing operations. Scale-out can be configured in Azure portal or by using the Analysis Services REST API.

## How it works

In a typical server deployment, one server serves as both processing server and query server. If the number of client queries against models on your server exceeds the Query Processing Units (QPU) for your server's plan, or model processing occurs at the same time as high query workloads, performance can decrease. 

With scale-out, you can create a query pool with up to seven additional query replica resources (eight total, including your *primary* server). You can scale the number of query replicas to meet QPU demands at critical times and you can separate a processing server from the query pool at any time. All query replicas are created in the same region as your server.

Regardless of the number of query replicas you have in a query pool, processing workloads are not distributed among query replicas. The primary server serves as the processing server. Query replicas serve only queries against the models synchronized between each query replica in the query pool. 

### Scale-out

When scaling out, new query replicas are added to the query pool incrementally. It can take up to five minutes for new query replica resources to be included in the query pool. When all new query replicas are up and running, new client connections are load balanced across all query pool resources. Existing client connections are not changed from the resource they are currently connected to.  When scaling in, any existing client connections to a query pool resource that is being removed from the query pool are terminated. They are reconnected to a remaining query pool resource when the scale-in operation has completed, which can take up to five minutes.

### Synchronization

A synchronization operation is required anytime a processing operation is performed on the primary server and/or you scale-out additional replica servers. Synchronization assures data on replicas in the query pool match that of the primary server. When a synchronization operation is performed is vital to assuring optimal performance of both your primary server and replicas in the query pool.

When configuring scale-out for a server the first time, model databases on your primary server are auto-synchronized with replica servers in the query pool. Auto-synchronization occurs only once, when you first configure scale-out to one or more replicas. For each model database on the primary server, two encrypted files containing model metadata and data are created in blob storage. One file (read/write) is for the primary server. The other file (read-only) is used for and shared by the query replicas in the pool. Replicas are then *hydrated* from the read-only file/s in blob storage. 

When performing a subsequent scale-out operation, for example, from two to five replicas, a synchronization operation is required for the three incrementally added replicas to be hydrated from the read-only file/s in blob storage. When performing this synchronization operation, it's important to keep the following in mind:

* When performing a subsequent scale-out operation, perform a synchronization operation *before the scale-out* to avoid redundant hydration of the incrementally added replicas.
 
* Synchronization operations are allowed even when there are no replicas. If you are scaling out from zero to one or more replicas with new data from a processing operation on the primary server, perform the synchronization operation first with zero replicas and then scale-out. This avoids hydrating the newly added replicas twice.

* When deleting a model database from the primary server, it does not automatically get deleted from any replicas. You must perform a synchronization operation that removes the file/s from the replica's shared blob storage location and deletes the model database on the replicas.

When processing (refresh) models on the primary server, a synchronization must be performed *after* processing operations are completed. The synchronization operation copies updated data from the primary server to the primary server's read/write file in blob storage, then synchronizes the read/write file with the shared read-only file. The synchronization operation then  re-hydrates any replicas in the query pool with updated data from the shared read-only file. 

When automating processing operations, it's important to configure a synchronization operation upon successful completion of processing operations. When automating both processing *and* scale-out operations, it's important to first process data on the primary server, then perform a synchronization operation, and then perform the scale-out operation. 

### Separate processing from query pool

For maximum performance for both processing and query operations, you can choose to separate your processing server from the query pool. When separated, existing and new client connections are assigned to query replicas in the query pool only. If processing operations only take up a short amount of time, you can choose to separate your processing server from the query pool only for the amount of time it takes to perform processing and synchronization operations, and then include it back into the query pool. 

> [!NOTE]
> Scale-out is available for servers in the Standard pricing tier. Each query replica is billed at the same rate as your server.

> [!NOTE]
> Scale-out does not increase the amount of available memory for your server. To increase memory, you need to upgrade your plan.

## Region limits

The number of query replicas you can configure are limited by the region your server is in. To learn more, see [Availability by region](analysis-services-overview.md#availability-by-region).

## Monitor QPU usage

 To determine if scale-out for your server is necessary, monitor your server in Azure portal by using Metrics. If your QPU regularly maxes out, it means the number of queries against your models is exceeding the QPU limit for your plan. The Query pool job queue length metric also increases when the number of queries in the query thread pool queue exceeds available QPU. To learn more, see [Monitor server metrics](analysis-services-monitor.md).

## Configure scale-out

### In Azure portal

1. In the portal, click **Scale-out**. Use the slider to select the number of query replica servers. The number of replicas you choose is in addition to your existing server.

2. In **Separate the processing server from the querying pool**, select yes to exclude your processing server from query servers. Client connections using the default connection string (without :rw) are redirected to replicas in the query pool. 

   ![Scale-out slider](media/analysis-services-scale-out/aas-scale-out-slider.png)

3. Click **Save** to provision your new query replica servers. 

When configuring scale-out for a server the first time, models on your primary server are auto-synchronized with the replica servers. Auto-synchronization only occurs once, when you first configure scale-out to one or more replicas. When auto-synchronization is complete, the query pool begins distributing incoming queries among the replica servers. Subsequent changes to the number of replicas on the same server *will not trigger another auto-synchronization*. Auto-synchronization will not occur again even if you set the server to zero replicas and then again scale-out to any number of replicas. 

## Synchronization 

Synchronizations operations must be performed manually or by using the REST API.

### In Azure portal

In **Overview** > model > **Synchronize model**.

![Scale-out slider](media/analysis-services-scale-out/aas-scale-out-sync.png)

### REST API

Use the **sync** operation.

#### Synchronize a model   

`POST https://<region>.asazure.windows.net/servers/<servername>:rw/models/<modelname>/sync`

#### Get sync status  

`GET https://<region>.asazure.windows.net/servers/<servername>/models/<modelname>/sync`

### PowerShell

[!INCLUDE [updated-for-az](../../includes/updated-for-az.md)]

Before using PowerShell, [install or update the latest Azure PowerShell module](/powershell/azure/install-az-ps). 

To set the number of query replicas, use [Set-AzAnalysisServicesServer](https://docs.microsoft.com/powershell/module/az.analysisservices/set-azanalysisservicesserver). Specify the optional `-ReadonlyReplicaCount` parameter.

To run sync, use [Sync-AzAnalysisServicesInstance](https://docs.microsoft.com/powershell/module/az.analysisservices/sync-AzAnalysisServicesinstance).

## Connections

On your server's Overview page, there are two server names. If you haven't yet configured scale-out for a server, both server names work the same. Once you configure scale-out for a server, you need to specify the appropriate server name depending on the connection type. 

For end-user client connections like Power BI Desktop, Excel, and custom apps, use **Server name**. 

For SSMS, SSDT, and connection strings in PowerShell, Azure Function apps, and AMO, use **Management server name**. The management server name includes a special `:rw` (read-write) qualifier. All processing operations occur on the management server.

![Server names](media/analysis-services-scale-out/aas-scale-out-name.png)

## Troubleshoot

**Issue:** Users get error **Cannot find server '\<Name of the server>' instance in connection mode 'ReadOnly'.**

**Solution:** When selecting the **Separate the processing server from the querying pool** option, client connections using the default connection string (without :rw) are redirected to query pool replicas. If replicas in the query pool are not yet online because synchronization has not yet been completed, redirected client connections can fail. To prevent failed connections, there must be at least two servers in the query pool when performing a synchronization. Each server is synchronized individually while others remain online. If you choose to not have the processing server in the query pool during processing, you can choose to remove it from the pool for processing, and then add it back into the pool after processing is complete, but prior to synchronization. Use Memory and QPU metrics to monitor synchronization status.

## Related information

[Monitor server metrics](analysis-services-monitor.md)   
[Manage Azure Analysis Services](analysis-services-manage.md) 

