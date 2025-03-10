---
title: Run Apache Sqoop jobs with Azure HDInsight (Apache Hadoop) 
description: Learn how to use Azure PowerShell from a workstation to run Sqoop import and export between a Hadoop cluster and an Azure SQL database.
ms.service: azure-hdinsight
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 09/06/2024
---

# Use Apache Sqoop with Hadoop in HDInsight

[!INCLUDE [sqoop-selector](../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use Apache Sqoop in HDInsight to import and export data between an HDInsight cluster and Azure SQL Database.

Although Apache Hadoop is a natural choice for processing unstructured and semi-structured data, such as logs and files, there may also be a need to process structured data that is stored in relational databases.

[Apache Sqoop](https://sqoop.apache.org/docs/1.99.7/user.html) is a tool designed to transfer data between Hadoop clusters and relational databases. You can use it to import data from a relational database management system (RDBMS) such as SQL Server, MySQL, or Oracle into the Hadoop distributed file system (HDFS), transform the data in Hadoop with MapReduce or Apache Hive, and then export the data back into an RDBMS. In this article, you're using Azure SQL Database for your relational database.

> [!IMPORTANT]  
> This article sets up a test environment to perform the data transfer. You then choose a data transfer method for this environment from one of the methods in section [Run Sqoop jobs](#run-sqoop-jobs).

For Sqoop versions that are supported on HDInsight clusters, see [What's new in the cluster versions provided by HDInsight?](../hdinsight-component-versioning.md)

## Understand the scenario

HDInsight cluster comes with some sample data. You use the following two samples:

* An Apache `Log4j` log file, which is located at `/example/data/sample.log`. The following logs are extracted from the file:

```text
2012-02-03 18:35:34 SampleClass6 [INFO] everything normal for id 577725851
2012-02-03 18:35:34 SampleClass4 [FATAL] system problem at id 1991281254
2012-02-03 18:35:34 SampleClass3 [DEBUG] detail for id 1304807656
...
```

* A Hive table named `hivesampletable`, which references the data file located at `/hive/warehouse/hivesampletable`. The table contains some mobile device data.
  
  | Field | Data type |
  | --- | --- |
  | clientid |string |
  | querytime |string |
  | market |string |
  | deviceplatform |string |
  | devicemake |string |
  | devicemodel |string |
  | state |string |
  | country |string |
  | querydwelltime |double |
  | `sessionid` |bigint |
  | sessionpagevieworder |bigint |

In this article, you use these two datasets to test Sqoop import and export.

## <a name="create-cluster-and-sql-database"></a>Set up test environment

The cluster, SQL database, and other objects are created through the Azure portal using an Azure Resource Manager template. The template can be found in [Azure Quickstart Templates](https://azure.microsoft.com/resources/templates/hdinsight-linux-with-sql-database/). The Resource Manager template calls a bacpac package to deploy the table schemas to an SQL database. If you want to use a private container for the bacpac files, use the following values in the template:

```json
"storageKeyType": "Primary",
"storageKey": "<TheAzureStorageAccountKey>",
```

> [!NOTE]  
> Import using a template or the Azure portal only supports importing a BACPAC file from Azure blob storage.

1. Select the following image to open the Resource Manager template in the Azure portal.

    <a href="https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2Fquickstarts%2Fmicrosoft.hdinsight%2Fhdinsight-linux-with-sql-database%2Fazuredeploy.json" target="_blank"><img src="./media/hdinsight-use-sqoop/hdi-deploy-to-azure1.png" alt="Deploy to Azure button for new cluster"></a>

2. Enter the following properties:

    |Field |Value |
    |---|---|
    |Subscription |Select your Azure subscription from the drop-down list.|
    |Resource group |Select your resource group from the drop-down list, or create a new one|
    |Location |Select a region from the drop-down list.|
    |Cluster Name |Enter a name for the Hadoop cluster. Use lowercase letter only.|
    |Cluster sign-in User Name |Keep the prepopulated value `admin`.|
    |Cluster sign in Password |Enter a password.|
    |Ssh User Name |Keep the prepopulated value `sshuser`.|
    |Ssh Password |Enter a password.|
    |Sql Admin sign-in |Keep the prepopulated value `sqluser`.|
    |Sql Admin Password |Enter a password.|
    |_artifacts Location | Use the default value unless you want to use your own bacpac file in a different location.|
    |_artifacts Location Sas Token |Leave blank.|
    |Bacpac File Name |Use the default value unless you want to use your own bacpac file.|
    |Location |Use the default value.|

    The [logical SQL server](/azure/azure-sql/database/logical-servers) name is `<ClusterName>dbserver`. The database name is `<ClusterName>db`. The default storage account name is `e6qhezrh2pdqu`.

3. Select **I agree to the terms and conditions stated above**.

4. Select **Purchase**. You see a new tile titled Submitting deployment for Template deployment. It takes about around 20 minutes to create the cluster and SQL database.

## Run Sqoop jobs

HDInsight can run Sqoop jobs by using various methods. Use the following table to decide which method is right for you, then follow the link for a walkthrough.

| **Use this** if you want... | ...an **interactive** shell | ...**batch** processing | ...from this **client operating system** |
|:--- |:---:|:---:|:--- |:--- |
| [SSH](apache-hadoop-use-sqoop-mac-linux.md) |? |? |Linux, Unix, macOS X, or Windows |
| [.NET SDK for Hadoop](apache-hadoop-use-sqoop-dotnet-sdk.md) |&nbsp; |?  |Windows (for now) |
| [Azure PowerShell](apache-hadoop-use-sqoop-powershell.md) |&nbsp; |? |Windows |

## Limitations

* Bulk export - With Linux-based HDInsight, the Sqoop connector used to export data to Microsoft SQL Server or SQL Database doesn't currently support bulk inserts.
* Batching - With Linux-based HDInsight, When using the `-batch` switch when performing inserts, Sqoop performs multiple inserts instead of batching the insert operations.

## Next steps

Now you've learned how to use Sqoop. To learn more, see:

* [Use Apache Hive with HDInsight](./hdinsight-use-hive.md)
* [Upload data to HDInsight](../hdinsight-upload-data.md): Find other methods for uploading data to HDInsight/Azure Blob storage.
* [Use Apache Sqoop to import and export data between Apache Hadoop on HDInsight and SQL Database](./apache-hadoop-use-sqoop-mac-linux.md)
