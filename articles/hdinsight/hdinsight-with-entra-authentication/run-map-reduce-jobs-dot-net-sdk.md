---
title: Run MapReduce jobs using HDInsight .NET SDK for Entra Authentication enabled Azure HDInsight clusters
description: Learn how to run MapReduce jobs using HDInsight .NET SDK  for Entra Auth enabled Azure HDInsight clusters
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 09/19/2025
---

# Run MapReduce jobs in Entra Authentication enabled clusters using HDInsight .NET SDK

This article explains how to submit MapReduce jobs to an HDInsight cluster by using the HDInsight .NET SDK. HDInsight clusters include a JAR file, `/example/jars/hadoop-mapreduce-examples.jar`, that contains several 
MapReduce samples. One of these samples is wordcount.

In this tutorial, you create a C# console application that submits a wordcount job. The job reads the `/example/data/gutenberg/davinci.txt` file and writes the results to `/example/data/davinciwordcount`. 
If you want to rerun the application, you must first clean up the output folder.

> [!NOTE]
> The steps in this article must be performed from a Windows client. To use a Linux, OS X, or Unix client with Hive, use the tab selector at the top of the article.


## Prerequisites

- An Entra enabled Apache Hadoop cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md).
- [Visual Studio](https://visualstudio.microsoft.com/vs/community/).


## Submit MapReduce jobs using HDInsight .NET SDK

The HDInsight .NET SDK provides .NET client libraries, which make it easier to work with HDInsight clusters from .NET.

1. Start Visual Studio and create a C# console application.
1. Navigate to **Tools** > **NuGet Package Manager** > **Package Manager Console** and enter the following command:

   ```json
   Install-Package Microsoft.Azure.HDInsight.Job -Version 3.0.0-preview.3
   ```

1. Copy the code below into **Program.cs**. Then edit the code by setting the values for: `existingClusterName`, `existingClusterPassword`, `defaultStorageAccountName`, `defaultStorageAccountKey`, and `defaultStorageContainerName`.
    

      ```csharp
        				using Azure.Identity;
				using Microsoft.Azure.HDInsight.Job;
				using Microsoft.Azure.HDInsight.Job.Models;
				using Microsoft.Rest;
				using Microsoft.WindowsAzure.Storage;
				using Microsoft.WindowsAzure.Storage.Blob;
				using System;
				using System.Collections.Generic;
				using System.IO;
				using System.Text;
				using System.Threading;
				using System.Threading.Tasks;

				namespace SubmitHDInsightJobDotNet
				{
					class Program
					{
						private static HDInsightJobClient _hdiJobManagementClient;

						private const string existingClusterName = "";
						private const string defaultStorageAccountName = "";
						private const string defaultStorageAccountKey = "";
						private const string defaultStorageContainerName = "";

						private const string TenantId = "";
						private const string ClientId = "";
						private const string ClientSecret = "";
						private const string ExistingClusterUri = existingClusterName + ".azurehdinsight.net";
						private const string sourceFile = "/example/data/gutenberg/davinci.txt";
						private const string outputFolder = "/example/data/davinciwordcount";

						static async Task Main(string[] args)
						{
							try
							{
								await InitializeHDInsightClientAsync();

								SubmitMRJob();
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
							var credential = new ClientSecretCredential(TenantId, ClientId, ClientSecret);
							var tokenRequestContext = new Azure.Core.TokenRequestContext(new[] { "https://" + existingClusterName + ".clusteraccess.azurehdinsight.net/.default" });
							var tokenResponse = await credential.GetTokenAsync(tokenRequestContext);

							var tokenCredentials = new TokenCredentials(tokenResponse.Token);
							var retryPolicy = HDInsightJobClient.HDInsightRetryPolicy;

							_hdiJobManagementClient = new HDInsightJobClient(ExistingClusterUri, tokenCredentials, retryPolicy);
							_hdiJobManagementClient.Username = "admin";

							System.Console.WriteLine("HDInsight client initialized successfully with Service Principal authentication.");
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
							var jobResponse = _hdiJobManagementClient.Job.SubmitMapReduceJob(paras);
							var jobId = jobResponse.Id;
							System.Console.WriteLine("Response status code is " + jobResponse.ToString());
							System.Console.WriteLine("JobId is " + jobId);

							System.Console.WriteLine("Waiting for the job completion ...");

							// Wait for job completion
							var jobDetail = _hdiJobManagementClient.Job.Get(jobId);
							while ((bool)!jobDetail.Status.JobComplete)
							{
								Thread.Sleep(1000);
								jobDetail = _hdiJobManagementClient.Job.Get(jobId);
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
								var output = _hdiJobManagementClient.Job.GetJobErrorLogs(jobId, storageAccess);

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
1. Press **F5** to run the application.

   To run the job again, you must change the job output folder name, in the sample it's `/example/data/davinciwordcount`.

   When the job completes successfully, the application prints the content of the output file `part-r-00000`.


     
