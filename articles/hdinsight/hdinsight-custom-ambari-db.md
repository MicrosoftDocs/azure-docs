---
title: Custom Apache Ambari database on Azure HDInsight
description: Learn how to create HDInsight clusters with your own custom Apache Ambari database.
ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: how-to
ms.date: 09/29/2023
---
# Set up HDInsight clusters with a custom Ambari DB

Apache Ambari simplifies the management and monitoring of an Apache Hadoop cluster. Ambari provides an easy to use web UI and REST API. Ambari is included on HDInsight clusters, and is used to monitor the cluster and make configuration changes.

In normal cluster creation, as described in other articles such as [Set up clusters in HDInsight](hdinsight-hadoop-provision-linux-clusters.md), Ambari is deployed in an [S0 Azure SQL Database](/azure/azure-sql/database/resource-limits-dtu-single-databases#standard-service-tier) that is managed by HDInsight and is not accessible to users.

The custom Ambari DB feature allows you to deploy a new cluster and setup Ambari in an external database that you manage. The deployment is done with an Azure Resource Manager template. This feature has the following benefits:

- Customization - you choose the size and processing capacity of the database. If you have large clusters processing intensive workloads, an Ambari database with lower specifications could become a bottleneck for management operations.
- Flexibility - you can scale the database as needed to suit your requirements.
- Control - you can manage backups and security for your database in a way that fits with your organizations requirements.

The remainder of this article discusses the following points:

- requirements to use the custom Ambari DB feature
- the steps necessary to provision HDInsight cluster using your own external database for Apache Ambari

## Custom Ambari DB requirements

You can deploy a custom Ambari DB with all cluster types and versions. Multiple clusters cannot use the same Ambari DB.

The custom Ambari DB has the following other requirements:

- The name of the database cannot contain hyphens or spaces
- You must have an existing Azure SQL DB server and database.
- The database that you provide for Ambari setup must be empty. There should be no tables in the default dbo schema.
- The user used to connect to the database should have SELECT, CREATE TABLE, and INSERT permissions on the database.
- Turn on the option to [Allow access to Azure services](/azure/azure-sql/database/vnet-service-endpoint-rule-overview#azure-portal-steps) on the server where you host Ambari.
- Management IP addresses from HDInsight service need to be allowed in the firewall rule. See [HDInsight management IP addresses](hdinsight-management-ip-addresses.md) for a list of the IP addresses that must be added to the server-level firewall rule.

When you host your Apache Ambari DB in an external database, remember the following points:

- You're responsible for the extra costs of the Azure SQL DB that holds Ambari.
- Back up your custom Ambari DB periodically. Azure SQL Database generates backups automatically, but the backup retention time-frame varies. For more information, see [Learn about automatic SQL Database backups](/azure/azure-sql/database/automated-backups-overview).
- Don't change the custom Ambari DB password after the HDInsight cluster reaches the **Running** state. It is not supported. 

## Deploy clusters with a custom Ambari DB

To create an HDInsight cluster that uses your own external Ambari database, use the [custom Ambari DB Quickstart template](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.hdinsight/hdinsight-custom-ambari-db).

Edit the parameters in the `azuredeploy.parameters.json` to specify information about your new cluster and the database that holds Ambari.

You can begin the deployment using the Azure CLI. Replace `<RESOURCEGROUPNAME>` with the resource group where you want to deploy your cluster.

```azurecli
az deployment group create --name HDInsightAmbariDBDeployment \
    --resource-group <RESOURCEGROUPNAME> \
    --template-file azuredeploy.json \
    --parameters azuredeploy.parameters.json
```


> [!WARNING]
> Please use the following recommended SQL DB and Headnode VM for your HDInsight cluster. Please don't use default Ambari DB (S0) for any production environment. 
>


## Database and Headnode sizing

The following table provides guidelines on which Azure SQL DB tier to select based on the size of your HDInsight cluster.

| Number of worker nodes | Required DB tier | Required Headnode VM |
|---|---|---|
| <=4 | S0 | 4 core/28 GB RAM or higher |
| >4 && <=8 | S1 | 4 core/28 GB RAM or higher |
| >8 && <=16 | S2 | 4 core/28 GB RAM or higher |
| >16 && <=32 | S3 | 8 core/56 GB RAM or higher |
| >32 && <=64 | S4 | 8 core/56 GB RAM or higher |
| >64 && <=128 | P2 | 16 core/112 GB RAM or higher |
| >128 | Contact Support | Contact Support |

## Next steps

- [Use external metadata stores in Azure HDInsight](hdinsight-use-external-metadata-stores.md)
