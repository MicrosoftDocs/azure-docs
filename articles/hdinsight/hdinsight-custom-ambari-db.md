---
title: Custom Apache Ambari database 
description: Learn how to create HDInsight clusters with your own custom Apache Ambari database.
author: hrasheed-msft
ms.reviewer: jasonh
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 10/02/2019
ms.author: hrasheed
---
# Setup HDInsight clusters with a custom Ambari DB

Apache Ambari simplifies the management and monitoring of an Apache Hadoop cluster by providing an easy to use web UI and REST API. Ambari is included on HDInsight clusters, and is used to monitor the cluster and make configuration changes.

In a normal cluster creation, as described in other articles such as [Set up clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md), Ambari is deployed in an [S0 Azure SQL database](../sql-database/sql-database-dtu-resource-limits-single-databases.md#standard-service-tier) that is managed by HDInsight and is not accessible to users. If you have very large clusters processing intensive workloads, this could lead to your Ambari database becoming a bottleneck for management operations.

The custom Ambari DB feature allows you to choose the size and processing capacity of the database which will store your Ambari settings and configuration. You can then scale the database as needed to suit your requirements. This article discusses the steps necessary to provision HDInsight clusters using your own external database as the datastore for Apache Ambari.

## Requirements

The custom Ambari DB has the following requirements:

1. You can deploy a custom Ambari DB with all cluster types and versions.
1. Multiple clusters cannot use the same Ambari DB.
1. You should have an existing Azure SQL DB server with a database already provisioned.
1. The database that you provide for Ambari setup must be empty. There should be no tables in the default dbo schema.
1. The IP addresses (from HDInsight service) need to be allowed in the SQL Server. See [HDInsight management IP addresses](hdinsight-management-ip-addresses.md) for a list of the IP addresses which must be added to the SQL server firewall.

Please also note the following:

- You are responsible for the additional costs of the Azure SQL DB which is created for your holding Ambari.
- Back up your custom Ambari DB periodically. Azure SQL Database generates backups automatically, but the backup retention time-frame varies. For more information, see [Learn about automatic SQL Database backups](../sql-database/sql-database-automated-backups.md).

## Deploy clusters with a custom Ambari DB

To create an HDInsight customer that uses your own external Ambari database, use the [HDInsight (custom Ambari + Hive Metastore DB with existing SQL Server, storage account, vnet)](https://github.com/Azure/azure-quickstart-templates/tree/master/101-hdinsight-custom-ambari-db).

Once these requirements are met, you can begin the deployment using the Azure CLI:

```azure-cli
az group deployment create --name HDInsightAmbariDBDeployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file azuredeploy.json \
    --parameters azuredeploy.parameters.json
```

## Next steps

- [Use external metadata stores in Azure HDInsight](hdinsight-use-external-metadata-stores.md)