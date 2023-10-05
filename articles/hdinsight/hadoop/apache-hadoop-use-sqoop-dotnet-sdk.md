---
title: Run Apache Sqoop jobs by using .NET and HDInsight - Azure 
description: Learn how to use the HDInsight .NET SDK to run Apache Sqoop import and export between an Apache Hadoop cluster and an Azure SQL Database.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive, hdiseo17may2017, devx-track-csharp, devx-track-dotnet
ms.date: 02/27/2023
---

# Run Apache Sqoop jobs by using .NET SDK for Apache Hadoop in HDInsight

[!INCLUDE [sqoop-selector](../includes/hdinsight-selector-use-sqoop.md)]

Learn how to use the Azure HDInsight .NET SDK to run Apache Sqoop jobs in HDInsight to import and export between an HDInsight cluster and an Azure SQL Database or SQL Server database.

## Prerequisites

* Completion of [Set up test environment](./hdinsight-use-sqoop.md#create-cluster-and-sql-database) from [Use Apache Sqoop with Hadoop in HDInsight](./hdinsight-use-sqoop.md).

* [Visual Studio](https://visualstudio.microsoft.com/vs/community/).

* Familiarity with Sqoop. For more information, see [Sqoop User Guide](https://sqoop.apache.org/docs/1.4.7/SqoopUserGuide.html).

## Use Sqoop on HDInsight clusters with the .NET SDK

The HDInsight .NET SDK provides .NET client libraries, so that it's easier to work with HDInsight clusters from .NET. In this section, you create a C# console application to export the `hivesampletable` to the Azure SQL Database table that you created from the prerequisites.

## Set up

1. Start Visual Studio and create a C# console application.

1. Navigate to **Tools** > **NuGet Package Manager** > **Package Manager Console** and run the following command:

    ```
    Install-Package Microsoft.Azure.Management.HDInsight.Job
    ```

## Sqoop export

From Hive to SQL Server.  This example exports data from the Hive `hivesampletable` table to the `mobiledata` table in SQL Database.

1. Use the following code in the Program.cs file. Edit the code to set the values for `ExistingClusterName`, and `ExistingClusterPassword`.

    ```csharp
    using Microsoft.Azure.Management.HDInsight.Job;
    using Microsoft.Azure.Management.HDInsight.Job.Models;
    using Hyak.Common;
    
    namespace SubmitHDInsightJobDotNet
    {
        class Program
        {
            private static HDInsightJobManagementClient _hdiJobManagementClient;
    
            private const string ExistingClusterName = "<Your HDInsight Cluster Name>";
            private const string ExistingClusterPassword = "<Cluster User Password>";
            private const string ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
            private const string ExistingClusterUsername = "admin";
    
            static void Main(string[] args)
            {
                System.Console.WriteLine("The application is running ...");
    
                var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
                _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);
    
                SubmitSqoopJob();
    
                System.Console.WriteLine("Press ENTER to continue ...");
                System.Console.ReadLine();
            }
    
            private static void SubmitSqoopJob()
            {
                var sqlDatabaseServerName = ExistingClusterName + "dbserver";
                var sqlDatabaseLogin = "sqluser";
                var sqlDatabaseLoginPassword = ExistingClusterPassword;
                var sqlDatabaseDatabaseName = ExistingClusterName + "db";
    
                // Connection string for using Azure SQL Database; Comment if using SQL Server
                var connectionString = "jdbc:sqlserver://" + sqlDatabaseServerName + ".database.windows.net;user=" + sqlDatabaseLogin + "@" + sqlDatabaseServerName + ";password=" + sqlDatabaseLoginPassword + ";database=" + sqlDatabaseDatabaseName;
    
                // Connection string for using SQL Server; Uncomment if using SQL Server
                // var connectionString = "jdbc:sqlserver://" + sqlDatabaseServerName + ";user=" + sqlDatabaseLogin + ";password=" + sqlDatabaseLoginPassword + ";database=" + sqlDatabaseDatabaseName;
    
                //sqoop start
                var tableName = "mobiledata";
    
                var parameters = new SqoopJobSubmissionParameters
                {
                     Command = "export --connect " + connectionString + " --table " + tableName + " --hcatalog-table hivesampletable"
                };
                //sqoop end
    
                System.Console.WriteLine("Submitting the Sqoop job to the cluster...");
                var response = _hdiJobManagementClient.JobManagement.SubmitSqoopJob(parameters);
                System.Console.WriteLine("Validating that the response is as expected...");
                System.Console.WriteLine("Response status code is " + response.StatusCode);
                System.Console.WriteLine("Validating the response object...");
                System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
            }
        }
    }
    ```

1. To run the program, select the **F5** key.

## Sqoop import

From SQL Server to Azure Storage. This example is dependent on the above export having been performed.  This example imports data from the `mobiledata` table in SQL Database to the `wasb:///tutorials/usesqoop/importeddata` directory on the cluster's default Storage Account.

1. Replace the code above in the `//sqoop start //sqoop end` block with the following code:

    ```csharp
    var tableName = "mobiledata";
    var exportDir = "/tutorials/usesqoop/importeddata";
    
    var parameters = new SqoopJobSubmissionParameters
    {
        Command = "import --connect " + connectionString + " --table " + tableName + " --target-dir " +  exportDir + " --fields-terminated-by \\t --lines-terminated-by \\n -m 1"
    };
    ```

1. To run the program, select the **F5** key.

## Limitations

Linux-based HDInsight presents the following limitations:

* Bulk export: The Sqoop connector that's used to export data to Microsoft SQL Server or Azure SQL Database doesn't currently support bulk inserts.

* Batching: By using the `-batch` switch, Sqoop performs multiple inserts instead of batching the insert operations.

## Next steps

Now you've learned how to use Sqoop. To learn more, see:

* [Use Apache Oozie with HDInsight](../hdinsight-use-oozie-linux-mac.md): Use Sqoop action in an Oozie workflow.
* [Upload data to HDInsight](../hdinsight-upload-data.md): Find other methods for uploading data to HDInsight or Azure Blob storage.
