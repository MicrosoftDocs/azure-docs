---
title: Run Hive queries in Entra ID enabled Azure HDInsight cluster using .NET SDK
description: Learn how to run Hive queries in Entra ID enabled Azure HDInsight cluster using .NET SDK
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 08/21/2025
---

# Run Apache Hive queries using the HDInsight .NET SDK

The HDInsight .NET SDK provides a programmatic way to interact with Apache Hive on Azure HDInsight clusters. Using the SDK, you can authenticate, submit Hive queries, monitor their execution, and retrieve results directly from your .NET applications.

This approach enables developers to integrate big data processing into existing .NET solutions, automate analytics workflows, and build custom applications that apply the power of Hive on HDInsight. With Microsoft Entra ID-enabled clusters, you also gain secure identity-based access and centralized control.

## Prerequisites

Before you begin this article, you must have the following items:

- An Apache Hadoop cluster in HDInsight. See [Get started using Linux-based Hadoop in HDInsight](../hadoop/apache-hadoop-linux-tutorial-get-started.md).
> [!NOTE]  
>As of September 15, 2017, the HDInsight .NET SDK only supports returning Hive query results from Azure Storage accounts. If you use this example with a HDInsight cluster that uses Azure Data Lake Storage as primary storage, you can't retrieve search results using the .NET SDK.
- [Visual Studio](https://visualstudio.microsoft.com/vs/community/) 2013 and beyond. At least, workload .NET desktop development should be installed.


## Run a Hive Query

The HDInsight .NET SDK provides .NET client libraries, which makes it easier to work with HDInsight clusters from .NET.

  1. Create a C# console application in Visual Studio.
  1. From the NuGet Package Manager Console, run the  command:
   
      ```csharp
      Install-Package Microsoft.Azure.HDInsight.Job -Version 3.0.0-preview.3

      ```
  1. Edit the code to initialize the values for variables: `ExistingClusterName, TenantId, ClientId,ClientSecret, ExistingClusterPassword,DefaultStorageAccountName,DefaultStorageAccountKey,DefaultStorageContainerName`. Then use the revised code as the entire contents of **Program.cs** in Visual Studio.


      ```csharp
        
       								using System;
								using System.Collections.Generic;
								using System.IO;
								using System.Text;
								using System.Threading;
								using System.Threading.Tasks;
								using Microsoft.Azure.HDInsight.Job;
								using Microsoft.Azure.HDInsight.Job.Models;
								using Microsoft.Rest;
								using Azure.Identity;
								using Azure.Core;

								namespace SubmitHDInsightJobDotNet
								{
								    class Program
								    {
								        private static HDInsightJobClient _hdiJobManagementClient;

								        // HDInsight Cluster Configuration
								        private const string ExistingClusterName = "<cluster_name>";
								        private const string ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";

								        // Service Principal Configuration
								        private const string TenantId = "<tenant_ID>";
								        private const string ClientId = "<client_ID>";
								        private const string ClientSecret = "<secret>";

								        // Storage Account Configuration linked to HDI Cluster
								        private const string DefaultStorageAccountName = "<storage_acc_name>";
								        private const string DefaultStorageAccountKey = "<storage_acc_key>";
								        private const string DefaultStorageContainerName = "<container_name>";

								        static async Task Main(string[] args)
								        {
								            System.Console.WriteLine("The application is running ...");

								            try
								            {
								                await InitializeHDInsightClientAsync();

								                // Submit Hive job
								                SubmitHiveJob(); 
								            }
								            catch (Exception ex)
								            {
								                System.Console.WriteLine($"Error: {ex.Message}");
								                System.Console.WriteLine($"Stack Trace: {ex.StackTrace}");
								            }

								            System.Console.WriteLine("Press ENTER to continue ...");
								            System.Console.ReadLine();
								        }

								        private static async Task InitializeHDInsightClientAsync()
								        {
								            try
								            {
								               var credential = new ClientSecretCredential(TenantId, ClientId, ClientSecret);
								                var tokenRequestContext = new TokenRequestContext(new[] { "https://" + ExistingClusterName + ".clusteraccess.azurehdinsight.net/.default" });
								                var tokenResponse = await credential.GetTokenAsync(tokenRequestContext);

								                var tokenCredentials = new TokenCredentials(tokenResponse.Token);

								                
								                var retryPolicy = HDInsightJobClient.HDInsightRetryPolicy;
								                _hdiJobManagementClient = new HDInsightJobClient(ExistingClusterUri, tokenCredentials, retryPolicy);

								                _hdiJobManagementClient.Username = "admin";

								                System.Console.WriteLine("HDInsight client initialized successfully with Service Principal authentication.");
								            }
								            catch (Exception ex)
								            {
								                System.Console.WriteLine($"Failed to initialize HDInsight client: {ex.Message}");
								                throw;
								            }
								        }

								        private static void SubmitHiveJob()
								        {
								            try
								            {
								                Dictionary<string, string> defines = new Dictionary<string, string>
								                {
								                    { "hive.execution.engine", "tez" },
								                    { "hive.exec.reducers.max", "1" }
								                };

								                List<string> args = new List<string> { "argA", "argB" };

								                var parameters = new HiveJobSubmissionParameters
								                {
								                    Query = "SHOW TABLES",
								                    Defines = defines,
								                    Arguments = args
								                };

								                System.Console.WriteLine("Submitting the Hive job to the cluster...");

								                var jobResponse = _hdiJobManagementClient.Job.SubmitHiveJob(parameters);
								                var jobId = jobResponse.Id;

								                System.Console.WriteLine("JobId is " + jobId);
								                System.Console.WriteLine("Waiting for the job completion ...");

								                WaitForJobCompletion(jobId);

								                // Get job output
								                GetJobOutput(jobId);
								            }
								            catch (Exception ex)
								            {
								                System.Console.WriteLine($"Error submitting Hive job: {ex.Message}");
								                throw;
								            }
								        }

								        private static void WaitForJobCompletion(string jobId)
								        {
								            try
								            {
								                var jobResponse = _hdiJobManagementClient.Job.GetWithHttpMessagesAsync(jobId).Result;
								                var jobDetail = jobResponse.Body;
								                int attempts = 0;
								                int backoffSeconds = 1;
								                const int maxAttempts = 300; // Maximum wait time

								                while (jobDetail.Status.JobComplete != true && attempts < maxAttempts)
								                {
								                    Thread.Sleep(TimeSpan.FromSeconds(backoffSeconds));

								                    try
								                    {
								                        jobResponse = _hdiJobManagementClient.Job.GetWithHttpMessagesAsync(jobId).Result;
								                        jobDetail = jobResponse.Body;
								                    }
								                    catch (Exception ex)
								                    {
								                        System.Console.WriteLine($"Error checking job status: {ex.Message}");
								                        backoffSeconds = Math.Min(backoffSeconds * 2, 30);
								                        attempts++;
								                        continue;
								                    }

								                    attempts++;

								                    if (attempts % 30 == 0)
								                    {
								                        System.Console.WriteLine($"Job still running... Status: {jobDetail.Status.State}, Attempt: {attempts}");
								                    }

								                    backoffSeconds = Math.Max(1, backoffSeconds / 2);
								                }

								                if (attempts >= maxAttempts)
								                {
								                    throw new TimeoutException("Job did not complete within the expected time frame.");
								                }

								                System.Console.WriteLine($"Job completed with status: {jobDetail.Status.State}");
								                System.Console.WriteLine($"Job exit value: {jobDetail.ExitValue}");
								            }
								            catch (Exception ex)
								            {
								                System.Console.WriteLine($"Error waiting for job completion: {ex.Message}");
								                throw;
								            }
								        }

								        private static void GetJobOutput(string jobId)
								        {
								            try
								            {
								                var jobResponse = _hdiJobManagementClient.Job.GetWithHttpMessagesAsync(jobId).Result;
								                var jobDetail = jobResponse.Body;
								                var storageAccess = new AzureStorageAccess(DefaultStorageAccountName, DefaultStorageAccountKey,
								                    DefaultStorageContainerName);

								                Stream output;
								                if (jobDetail.ExitValue == 0)
								                {
								                    System.Console.WriteLine("Job completed successfully. Fetching output...");
								                    output = _hdiJobManagementClient.Job.GetJobOutput(jobId, storageAccess);
								                }
								                else
								                {
								                    System.Console.WriteLine($"Job failed with exit code: {jobDetail.ExitValue}. Fetching error logs...");
								                    output = _hdiJobManagementClient.Job.GetJobErrorLogs(jobId, storageAccess);
								                }

								                System.Console.WriteLine("Job output/logs:");
								                System.Console.WriteLine(new string('=', 50));

								                using (var reader = new StreamReader(output, Encoding.UTF8))
								                {
								                    string content = reader.ReadToEnd();
								                    System.Console.WriteLine(content);
								                }

								                System.Console.WriteLine(new string('=', 50));
								            }
								            catch (Exception ex)
								            {
								                System.Console.WriteLine($"Error retrieving job output: {ex.Message}");
								                throw;
								            }
								        }
								    }
								}


      ```


1. Press **F5** to run the application.

The output of the application should be similar to:

 :::image type="content" source="./media/run-hive-queries-using-dot-net-sdk/output.png" alt-text="Screenshot of output showing the output of the program." border="true" lightbox="./media/run-hive-queries-using-dot-net-sdk/output.png":::

