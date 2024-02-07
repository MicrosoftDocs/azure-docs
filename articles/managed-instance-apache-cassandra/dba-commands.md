---
title: How to run DBA commands for Azure Managed Instance for Apache Cassandra
description: Learn how to run DBA commands 
author: TheovanKraay
ms.service: managed-instance-apache-cassandra
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 03/02/2022
ms.author: thvankra
---

# DBA commands for Azure Managed Instance for Apache Cassandra

Azure Managed Instance for Apache Cassandra provides automated deployment, scaling, and [management operations](management-operations.md) for open-source Apache Cassandra data centers. The automation in the service should be sufficient for many use cases. However, this article describes how to run DBA commands manually when the need arises. 

> [!IMPORTANT]
> Nodetool and sstable commands are in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## DBA command support
Azure Managed Instance for Apache Cassandra allows you to run `nodetool` and `sstable` commands via Azure CLI, for routine DBA administration. Not all commands are supported and there are some limitations. For supported commands, see the sections below.

>[!WARNING]
> Some of these commands can destabilize the cassandra cluster and should only be run carefully and after being tested in non-production environments. Where possible a `--dry-run` option should be deployed first. Microsoft cannot offer any SLA or support on issues with running commands which alter the default database configuration and/or tables.



## How to run a `nodetool` command
Azure Managed Instance for Apache Cassandra provides the following Azure CLI command to run DBA commands:

```azurecli-interactive
    az managed-cassandra cluster invoke-command  --resource-group  <rg>   --cluster-name <cluster> --host <ip of data node> --command-name nodetool --arguments "<nodetool-subcommand>"="" "paramerter1"="" 
```

The particular subcommand needs to be in the `--arguments` section with an empty value. `Nodetool` flags without a value are in the form: `"<flag>"=""`. If the flag has a value, it is in the form: `"<flag>"="value"`.

Here's an example of how to run a `nodetool` command without flags, in this case the `nodetool status` command:

```azurecli-interactive
    az managed-cassandra cluster invoke-command  --resource-group  <rg>   --cluster-name <cluster> --host <ip of data node> --command-name nodetool --arguments "status"="" 
```

Here's an example of how to run a `nodetool` command with a flag, in this case the `nodetool compact` command:

```azurecli-interactive
    az managed-cassandra cluster invoke-command  --resource-group  <rg>   --cluster-name <cluster> --host <ip of data node> --command-name nodetool --arguments "compact"="" "-st"="65678794" 
```

Both will return a json of the following form:
   
```json 
    {
        "commandErrorOutput": "",
        "commandOutput": "<result>",
        "exitCode": 0
    }
```
In most cases you might only need the commandOutput or the exitCode. Here is an example for only getting the commandOutput:

```azurecli-interactive
    az managed-cassandra cluster invoke-command --query "commandOutput" --resource-group $resourceGroupName --cluster-name $clusterName --host $host --command-name nodetool --arguments getstreamthroughput=""
```

## How to run an `sstable` command

The `sstable` commands require read/write access to the Cassandra data directory and the Cassandra database to be stopped. To accommodate this, two extra parameters `--cassandra-stop-start true` and  `--readwrite true` need to be given:

```azurecli-interactive
    az managed-cassandra cluster invoke-command  --resource-group  <test-rg>   --cluster-name <test-cluster> --host <ip> --cassandra-stop-start true --readwrite true  --command-name sstableutil --arguments "system"="peers"
```

```json  
    {
    "commandErrorOutput": "",
    "commandOutput": "Listing files...\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-CompressionInfo.db\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-Data.db\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-Digest.crc32\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-Filter.db\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-Index.db\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-Statistics.db\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-Summary.db\n/var/lib/cassandra/data/system/peers-37f71aca7dc2383ba70672528af04d4f/me-1-big-TOC.txt\n",
    "exitCode": 0
    }
```
## How to run other commands
The `cassandra-reset-password` command lets a user change their password for the Cassandra user.
```azurecli-interactive
    az managed-cassandra cluster invoke-command --resource-group <rg> --cluster-name <cluster> --host <ip of data node> --command-name cassandra-reset-password --arguments password="<password>"
```
The `cassandra-reset-auth-replication` command lets a user change their schema for the Cassandra user. Separate the datacenter names by space.
```azurecli-interactive
    az managed-cassandra cluster invoke-command --resource-group <rg> --cluster-name <cluster> --host <ip of data node> --command-name cassandra-reset-auth-replication --arguments password="<datacenters>"
```
The `sstable-tree` command lets a user see their sstables.
```azurecli-interactive
    az managed-cassandra cluster invoke-command --resource-group <rg> --cluster-name <cluster> --host <ip of data node> --command-name sstable-tree
```
The `sstable-delete` command lets a user delete their sstables made before a certain time.
```azurecli-interactive
    az managed-cassandra cluster invoke-command --resource-group <rg> --cluster-name <cluster> --host <ip of data node> --command-name sstable-delete --arguments datetime="<YYYY-MM-DD hh:mm:ss>"
```
Datetime argument must be formatted as shown above. You can also add --dry-run="" as an argument to see which files will be deleted.
## List of supported `sstable` commands

For more information on each command, see https://cassandra.apache.org/doc/latest/cassandra/tools/sstable/index.html

* `sstableverify`
* `sstablescrub`
* `sstablemetadata`
* `sstablelevelreset`
* `sstableutil`
* `sstablesplit`
* `sstablerepairedset`
* `sstableofflinerelevel`
* `sstableexpiredblockers`

## List of supported `nodetool` commands

For more information on each command, see https://cassandra.apache.org/doc/latest/cassandra/tools/nodetool/nodetool.html

* `status`
* `cleanup`
* `clearsnapshot`
* `compact`
* `compactionhistory`
* `compactionstats`
* `describecluster`
* `describering`
* `disableautocompaction`
* `disablehandoff`
* `disablehintsfordc`
* `drain`
* `enableautocompaction`
* `enablehandoff`
* `enablehintsfordc`
* `failuredetector`
* `flush`
* `garbagecollect`
* `gcstats`
* `getcompactionthreshold`
* `getcompactionthroughput`
* `getconcurrentcompactors`
* `getendpoints`
* `getinterdcstreamthroughput`
* `getlogginglevels`
* `getsstables`
* `getstreamthroughput`
* `gettimeout`
* `gettraceprobability`
* `gossipinfo`
* `info`
* `invalidatecountercache`
* `invalidatekeycache`
* `invalidaterowcache`
* `listsnapshots`
* `netstats`
* `pausehandoff`
* `proxyhistograms`
* `rangekeysample`
* `rebuild`
* `rebuild_index` - for arguments use `"keyspace"="table indexname..."`
* `refresh`
* `refreshsizeestimates`
* `reloadlocalschema`
* `replaybatchlog`
* `resetlocalschema`
* `resumehandoff`
* `ring`
* `scrub`
* `setcachecapacity` - for arguments use `"key-cache-capacity" = "<row-cache-capacity> <counter-cache-capacity>"`
* `setcachekeystosave` - for arguments use `"key-cache-keys-to-save":"<row-cache-keys-to-save> <counter-cache-keys-to-save>"`
* `setcompactionthreshold` - for arguments use `"<keyspace>"="<table> <minthreshold> <maxthreshold>`
* `setcompactionthroughput`
* `setconcurrentcompactors`
* `sethintedhandoffthrottlekb`
* `setinterdcstreamthroughput`
* `setstreamthroughput`
* `settimeout`
* `settraceprobability`
* `statusbackup`
* `statusbinary`
* `statusgossip`
* `statushandoff`
* `stop`
* `tablehistograms`
* `tablestats`
* `toppartitions`
* `tpstats`
* `truncatehints`
* `verify`
* `version`
* `viewbuildstatus`

## Next steps

* [Create a managed instance cluster from the Azure portal](create-cluster-portal.md)
* [Manage Azure Managed Instance for Apache Cassandra resources using Azure CLI](manage-resources-cli.md)
* [Management operations in Azure Managed Instance for Apache Cassandra](management-operations.md)
