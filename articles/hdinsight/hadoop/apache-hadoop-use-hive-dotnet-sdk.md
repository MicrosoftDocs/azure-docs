---
title: Run Hive queries using HDInsight .NET SDK - Azure 
description: Learn how to submit Hadoop jobs to Azure HDInsight Hadoop using HDInsight .NET SDK.
ms.reviewer: jasonh
services: hdinsight
author: jasonwhowell

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/16/2018
ms.author: jasonh

---
# Run Hive queries using HDInsight .NET SDK
[!INCLUDE [hive-selector](../../../includes/hdinsight-selector-use-hive.md)]

Learn how to submit Hive queries using HDInsight .NET SDK. You write a C# program to submit a Hive query for listing Hive tables, and display the results.

> [!NOTE]
> The steps in this article must be performed from a Windows client. For information on using a Linux, OS X, or Unix client to work with Hive, use the tab selector shown on the top of the article.

## Prerequisites
Before you begin this article, you must have the following items:

* **A Hadoop cluster in HDInsight**. See [Get started using Linux-based Hadoop in HDInsight](apache-hadoop-linux-tutorial-get-started.md).

    > [!WARNING]
    > As of September 15, 2017, the HDInsight .NET SDK only supports returning Hive query results from Azure Storage accounts. If you use this example with an HDInsight cluster that uses Azure Data Lake Store as primary storage, you cannot retrieve search results using the .NET SDK.

* **Visual Studio 2013/2015/2017**.

## Run a Hive Query
The HDInsight .NET SDK provides .NET client libraries, which makes it easier to work with HDInsight clusters from .NET. 

**To Submit jobs**

1. Create a C# console application in Visual Studio.
2. From the Nuget Package Manager Console, run the following command:
   
        Install-Package Microsoft.Azure.Management.HDInsight.Job
3. Use the following code:

    ```csharp
        using System.Collections.Generic;
        using System.IO;
        using System.Text;
        using System.Threading;
        using Microsoft.Azure.Management.HDInsight.Job;
        using Microsoft.Azure.Management.HDInsight.Job.Models;
        using Hyak.Common;
   
        namespace SubmitHDInsightJobDotNet
        {
            class Program
            {
                private static HDInsightJobManagementClient _hdiJobManagementClient;
   
                private const string ExistingClusterName = "<Your HDInsight Cluster Name>";
                private const string ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
                private const string ExistingClusterUsername = "<Cluster Username>";
                private const string ExistingClusterPassword = "<Cluster User Password>";
                
                // Only Azure Storage accounts are supported by the SDK
                private const string DefaultStorageAccountName = "<Default Storage Account Name>";
                private const string DefaultStorageAccountKey = "<Default Storage Account Key>";
                private const string DefaultStorageContainerName = "<Default Blob Container Name>";
   
                static void Main(string[] args)
                {
                    System.Console.WriteLine("The application is running ...");
   
                    var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
                    _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);
   
                    SubmitHiveJob();
   
                    System.Console.WriteLine("Press ENTER to continue ...");
                    System.Console.ReadLine();
                }
   
                private static void SubmitHiveJob()
                {
                    Dictionary<string, string> defines = new Dictionary<string, string> { { "hive.execution.engine", "tez" }, { "hive.exec.reducers.max", "1" } };
                    List<string> args = new List<string> { { "argA" }, { "argB" } };
                    var parameters = new HiveJobSubmissionParameters
                    {
                        Query = "SHOW TABLES",
                        Defines = defines,
                        Arguments = args
                    };
   
                    System.Console.WriteLine("Submitting the Hive job to the cluster...");
                    var jobResponse = _hdiJobManagementClient.JobManagement.SubmitHiveJob(parameters);
                    var jobId = jobResponse.JobSubmissionJsonResponse.Id;
                    System.Console.WriteLine("Response status code is " + jobResponse.StatusCode);
                    System.Console.WriteLine("JobId is " + jobId);
   
                    System.Console.WriteLine("Waiting for the job completion ...");
   
                    // Wait for job completion
                    var jobDetail = _hdiJobManagementClient.JobManagement.GetJob(jobId).JobDetail;
                    while (!jobDetail.Status.JobComplete)
                    {
                        Thread.Sleep(1000);
                        jobDetail = _hdiJobManagementClient.JobManagement.GetJob(jobId).JobDetail;
                    }
   
                    // Get job output
                    var storageAccess = new AzureStorageAccess(DefaultStorageAccountName, DefaultStorageAccountKey,
                        DefaultStorageContainerName);
                    var output = (jobDetail.ExitValue == 0)
                        ? _hdiJobManagementClient.JobManagement.GetJobOutput(jobId, storageAccess) // fetch stdout output in case of success
                        : _hdiJobManagementClient.JobManagement.GetJobErrorLogs(jobId, storageAccess); // fetch stderr output in case of failure
   
                    System.Console.WriteLine("Job output is: ");
   
                    using (var reader = new StreamReader(output, Encoding.UTF8))
                    {
                        string value = reader.ReadToEnd();
                        System.Console.WriteLine(value);
                    }
                }
            }
        }
    ```
4. Press **F5** to run the application.

The output of the application shall be similar to:

![HDInsight Hadoop Hive job output](./media/apache-hadoop-use-hive-dotnet-sdk/hdinsight-hadoop-use-hive-net-sdk-output.png)

## Next steps
In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight](apache-hadoop-linux-tutorial-get-started.md)
* [Create Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md)
* [Manage Hadoop clusters in HDInsight by using the Azure portal](../hdinsight-administer-use-management-portal.md)
* [HDInsight .NET SDK reference](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use Sqoop with HDInsight](apache-hadoop-use-sqoop-mac-linux.md)
* [Create non-interactive authentication .NET HDInsight applications](../hdinsight-create-non-interactive-authentication-dotnet-applications.md)
 


