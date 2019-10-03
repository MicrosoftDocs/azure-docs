---
title: Bring your own Ambari DB 
description: Learn how to create HDInsight clusters with your own custom Ambari database.
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/02/2019
ms.author: hrasheed
---
# Setup HDInsight clusters with a custom Ambari DB

This article discusses the steps necessary to provision HDInsight clusters using your own external database as the datastore for Apache Ambari.

Apache Ambari simplifies the management and monitoring of an Apache Hadoop cluster by providing an easy to use web UI and REST API. Ambari is included on HDInsight clusters, and is used to monitor the cluster and make configuration changes.

In a normal cluster creation, as described in other articles such as [Set up clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md), Ambari is deployed and managed by HDInsight and is not accessible to users. However, if you have very large clusters processing intensive workloads, this could lead to your Ambari database becoming a bottleneck for management operations.

The custom Ambari DB feature allows you to choose the size and processing capacity of the database which will store your Ambari settings and configuration. You can then scale the database as needed to suit your requirements.

## Deploy clusters with a custom Ambari DB

To create an HDInsight customer that uses your own external Ambari database, use the [hdinsight custom ambari resource manager template]().

The Ambari DB template has the following requirements:

1. Multiple clusters cannot use the same Ambari DB.
1. The database that you provide for Ambari setup must be empty. There should be no tables in the default dbo schema.
1. The IP addresses (from HDInsight service) need to be allowed in the SQL Server. See [HDInsight management IP addresses](hdinsight-management-ip-addresses.md) for a list of the IP addresses which must be added to the SQL server firewall.

Once these requirements are met, you can begin the deployment using the Azure CLI:

```azure-cli
az group deployment create --name HDInsightAmbariDBDeployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file azuredeploy.json \
    --parameters azuredeploy.parameters.json
```

## Next steps

- [Use external metadata stores in Azure HDInsight](hdinsight-use-external-metadata-stores.md)