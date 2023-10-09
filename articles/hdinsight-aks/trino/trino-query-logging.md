---
title: Query logging 
description: Log Query lifecycle events in Trino Cluster
ms.service: hdinsight-aks
ms.topic: how-to 
ms.date: 08/29/2023
---

# Query logging

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Trino supports custom [event listeners](https://trino.io/docs/current/develop/event-listener.html) that can be used to listen for Query lifecycle events. You can author your own event listeners or use a built-in plugin provided by HDInsight on AKS Trino that logs events to Azure Blob Storage.

You can enable built-in query logging in two ways:

* You can enable built-in query logging during [Trino cluster creation](./trino-create-cluster.md) by enabling hive catalog.

* You can enable built-in query logging in your cluster using ARM template.

This article covers addition of query logging to your cluster using ARM template.

## Prerequisites

* An operational HDInsight on AKS Trino cluster.
* Create [ARM template](../create-cluster-using-arm-template-script.md) for your cluster.
* Review complete cluster [ARM template](https://hdionaksresources.blob.core.windows.net/trino/samples/arm/arm-trino-config-sample.json) sample.
* Familiarity with [ARM template authoring and deployment](/azure/azure-resource-manager/templates/overview).


## Enable query logging

To enable the built-in query logging plugin in your Trino cluster, add/update `clusterProfile.trinoProfile.userTelemetrySpec` section with the following properties in your cluster ARM template.

| Property| Description|
|---|---|
|`path`|Fully qualified path to a directory used as a root to capture different query logs.|
|`hivecatalogName`| This catalog is used to mount external tables on the files written in storage account. This catalog must be added in your cluster, [Add hive catalog](trino-connect-to-metastore.md).|
|`hivecatalogSchema`|Query logging plugin uses this schema to mount the external table for the logs, plugin creates this schema if it doesn't exist already. Default value - `trinologs`|
|`partitionRetentionInDays`|Query logging plugin prunes the partitions in the log tables, which are older than the specified configuration. Default value - `365`|

The following example demonstrates how a query logging is enabled in a Trino cluster. Add this sample json under `[*].properties.clusterProfile` in the ARM template.

  ```json
         "trinoProfile": { 
            "userTelemetrySpec": { 
            "storage": { 
                "path": "https://querylogstorageaccount.blob.core.windows.net/logs/trinoquerylogs", 
                "hivecatalogName": "hive", 
                "hivecatalogSchema": "trinologs", 
                "partitionRetentionInDays": 365 
            } 
            }
        }   
  ```

Deploy the updated ARM template to reflect the changes in your cluster. Learn how to [deploy an ARM template](/azure/azure-resource-manager/templates/deploy-portal).


> [!NOTE]
> 
> * Plugin uses user-assigned managed identity (MSI) tied to the cluster to authenticate against the storage, please add `Contributor` and `Storage Blob Data Owner` access to the MSI to ensure plugin can write logs to the storage account. <br>User-assigned MSI name is listed in the `msiResourceId` property in the cluster's resource JSON. Learn how to [assign a role](/azure/role-based-access-control/role-assignments-portal#step-2-open-the-add-role-assignment-page).
>
> * PartitionRetentionInDays only removes the metadata partition from the mounted table, it doesn't delete the data. Please clean up the data as per your requirements if not needed anymore.
 
 ## Metadata management

If the user specifies a catalog name in `hiveCatalogName` property, plugin mounts the logs files written in storage account as external tables and views, which can be queried through Trino.

The plugin creates three tables and three views, which can be used to query the lifecycle events (`QueryCompletedEvent`, `QueryCreatedEvent`, and `SplitCompletedEVent`). These tables & views are created under the catalog and schema provided as user input.

**Name of tables:**
- **`querycompleted`**: Contains `QueryCompleted` events fired by Trino.
- **`querycreated`**: Contains `QueryCreatedEvents` fired by Trino.
- **`splitcompleted`**: Contains `SplitCompletedEvents` fired by Trino.

**Name of views:**
 - **`vquerycompleted`**
 - **`vquerycreated`**
 - **`vsplitcompleted`**
 
 > [!NOTE]
 > 
 > Users are encouraged to use the views as they are immune to underlying schema changes and account for table described.
 
## Table archival
The plugin supports archiving (N-1)th table in the scenario where user decides to the change the `path` or external location of the logs. 
If that happens, plugin renames the table pointing to the old path as *<table_name>_archived*, the view created will union the result of current and the archived tables in this scenario.

## Create your custom plugin
You can also author a custom event listener plugin, follow the directions on [docs](https://trino.io/docs/current/develop/event-listener.html#implementation), Deploy custom plugins by following [plugin deployment steps](trino-custom-plugins.md).
