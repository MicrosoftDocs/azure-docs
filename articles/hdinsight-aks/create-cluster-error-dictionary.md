---
title: Azure HDInsight on AKS Create a cluster - error dictionary
description: Learn how to troubleshoot errors that occur when creating Azure HDInsight on AKS clusters
ms.service: hdinsight-aks
ms.topic: troubleshooting
ms.date: 08/02/2023
---

# Azure HDInsight on AKS: Cluster creation errors

This article describes resolutions to troubleshoot errors, that you might come across when creating clusters on HDInsight on AKS.

|Sr No| Error message|Cause|Resolution|
|-|-|-|-|
|1|InternalServerError  UnrecognizableError|This could be due to incorrect template used. Currently, database connectors are allowed only through ARM template. Hence the validation of configuration isn't possible on template.|- | 
|2|InvalidClusterSpec  - ServiceDependencyFailure - Invalid configuration|Max memory per node error.| Refer the Max memory configurations [Property value types](https://trino.io/docs/current/admin/properties-resource-management.html#query-max-memory-per-node).|
|3|WaitingClusterResourcesReadyTimeOut - Metastoreservice unready|This could be due to the container name may only contain lowercase letters, numbers, and hyphens.  Container name must begin with a letter or a number.|Each hyphen must preceeded by and followed by a nonhyphen character. The name must also be between 3 and 63 characters long.|
|4|InvalidClusterSpec -Invalid configuration - ClusterUpsertActivity|Error: Invalid configuration property `hive.metastore.uri: may not be null`.|[Refer to the Hive connector documentation](https://trino.io/docs/current/connector/hive.html#connector-hive--page-root).

[comment]: <> (|5|InvalidClusterSpec ServiceDependencyFailure||Note to be provided in the documentation.|)

For more information, see [Troubleshoot cluster configuration](./trino/trino-config-troubleshoot.md).
