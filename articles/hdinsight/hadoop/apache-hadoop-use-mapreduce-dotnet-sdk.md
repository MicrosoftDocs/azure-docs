---
title: Submit MapReduce jobs using HDInsight .NET SDK - Azure 
description: Learn how to submit MapReduce jobs to Azure HDInsight Apache Hadoop using HDInsight .NET SDK.
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 01/15/2020
---

# Run MapReduce jobs using HDInsight .NET SDK

[!INCLUDE [mapreduce-selector](../../../includes/hdinsight-selector-use-mapreduce.md)]

Learn how to submit MapReduce jobs using HDInsight .NET SDK. HDInsight clusters come with a jar file with some MapReduce samples. The jar file is `/example/jars/hadoop-mapreduce-examples.jar`.  One of the samples is **wordcount**. You develop a C# console application to submit a wordcount job.  The job reads the `/example/data/gutenberg/davinci.txt` file, and outputs the results to `/example/data/davinciwordcount`.  If you want to rerun the application, you must clean up the output folder.

> [!NOTE]  
> The steps in this article must be performed from a Windows client. For information on using a Linux, OS X, or Unix client to work with Hive, use the tab selector shown on the top of the article.

## Prerequisites

* An Apache Hadoop cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).

* [Visual Studio](https://visualstudio.microsoft.com/vs/community/).

## Submit MapReduce jobs using HDInsight .NET SDK

The HDInsight .NET SDK provides .NET client libraries, which make it easier to work with HDInsight clusters from .NET.

1. Start Visual Studio and create a C# console application.

1. Navigate to **Tools** > **NuGet Package Manager** > **Package Manager Console** and enter the following command:

    ```   
    Install-Package Microsoft.Azure.Management.HDInsight.Job
    ```

1. Copy the code below into **Program.cs**. Then edit the code by setting the values for: `existingClusterName`, `existingClusterPassword`, `defaultStorageAccountName`, `defaultStorageAccountKey`, and `defaultStorageContainerName`.

    ```csharp
    using System.Collections.Generic;
    using System.IO;
    using System.Text;
    using System.Threading;
    using Microsoft.Azure.Management.HDInsight.Job;
    using Microsoft.Azure.Management.HDInsight.Job.Models;
    using Hyak.Common;
    using Microsoft.WindowsAzure.Storage;
    using Microsoft.WindowsAzure.Storage.Blob;
    
    namespace SubmitHDInsightJobDotNet
    {
        class Program
        {
            private static HDInsightJobManagementClient _hdiJobManagementClient;
    
            private const string existingClusterName = "<Your HDInsight Cluster Name>";
            private const string existingClusterPassword = "<Cluster User Password>";
            private const string defaultStorageAccountName = "<Default Storage Account Name>"; 
            private const string defaultStorageAccountKey = "<Default Storage Account Key>";
            private const string defaultStorageContainerName = "<Default Blob Container Name>";
    
            private const string existingClusterUsername = "admin";
            private const string existingClusterUri = existingClusterName + ".azurehdinsight.net";
            private const string sourceFile = "/example/data/gutenberg/davinci.txt";
            private const string outputFolder = "/example/data/davinciwordcount";
    
            static void Main(string[] args)
            {
                System.Console.WriteLine("The application is running ...");
    
                var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = existingClusterUsername, Password = existingClusterPassword };
                _hdiJobManagementClient = new HDInsightJobManagementClient(existingClusterUri, clusterCredentials);
    
                SubmitMRJob();
    
                System.Console.WriteLine("Press ENTER to continue ...");
                System.Console.ReadLine();
            }
    
            private static void SubmitMRJob()
            {
                List<string> args = new List<string> { { "/example/data/gutenberg/davinci.txt" }, { "/example/data/davinciwordcount" } };
    
                var paras = new MapReduceJobSubmissionParameters
                {
                    JarFile = @"/example/jars/hadoop-mapreduce-examples.jar",
                    JarClass = "wordcount",
                    Arguments = args
                };
    
                System.Console.WriteLine("Submitting the MR job to the cluster...");
                var jobResponse = _hdiJobManagementClient.JobManagement.SubmitMapReduceJob(paras);
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
                System.Console.WriteLine("Job output is: ");
                var storageAccess = new AzureStorageAccess(defaultStorageAccountName, defaultStorageAccountKey,
                    defaultStorageContainerName);
    
                if (jobDetail.ExitValue == 0)
                {
                    // Create the storage account object
                    CloudStorageAccount storageAccount = CloudStorageAccount.Parse("DefaultEndpointsProtocol=https;AccountName=" +
                        defaultStorageAccountName +
                        ";AccountKey=" + defaultStorageAccountKey);
    
                    // Create the blob client.
                    CloudBlobClient blobClient = storageAccount.CreateCloudBlobClient();
    
                    // Retrieve reference to a previously created container.
                    CloudBlobContainer container = blobClient.GetContainerReference(defaultStorageContainerName);
    
                    CloudBlockBlob blockBlob = container.GetBlockBlobReference(outputFolder.Substring(1) + "/part-r-00000");
    
                    using (var stream = blockBlob.OpenRead())
                    {
                        using (StreamReader reader = new StreamReader(stream))
                        {
                            while (!reader.EndOfStream)
                            {
                                System.Console.WriteLine(reader.ReadLine());
                            }
                        }
                    }
                }
                else
                {
                    // fetch stderr output in case of failure
                    var output = _hdiJobManagementClient.JobManagement.GetJobErrorLogs(jobId, storageAccess);
    
                    using (var reader = new StreamReader(output, Encoding.UTF8))
                    {
                        string value = reader.ReadToEnd();
                        System.Console.WriteLine(value);
                    }
    
                }
            }
        }
    }

    ```

1. Press **F5** to run the application.

To run the job again, you must change the job output folder name, in the sample it's `/example/data/davinciwordcount`.

When the job completes successfully, the application prints the content of the output file `part-r-00000`.

## Next steps

In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* For submitting a Hive job, see [Run Apache Hive queries using HDInsight .NET SDK](apache-hadoop-use-hive-dotnet-sdk.md).
* For creating HDInsight clusters, see [Create Linux-based Apache Hadoop clusters in HDInsight](../hdinsight-hadoop-provision-linux-clusters.md).
* For managing HDInsight clusters, see [Manage Apache Hadoop clusters in HDInsight](../hdinsight-administer-use-portal-linux.md).
* For learning the HDInsight .NET SDK, see [HDInsight .NET SDK reference](https://docs.microsoft.com/dotnet/api/overview/azure/hdinsight).
* For non-interactive authenticate to Azure, see [Create non-interactive authentication .NET HDInsight applications](../hdinsight-create-non-interactive-authentication-dotnet-applications.md).