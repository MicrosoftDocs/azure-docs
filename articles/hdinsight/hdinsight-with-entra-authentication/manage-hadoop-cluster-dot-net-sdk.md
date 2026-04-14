---
title: Manage Apache Hadoop clusters in Entra Auth enabled HDInsight clusters by using the .NET SDK
description: Learn how to manage Apache Hadoop clusters in HDInsight by using the .NET SDK
ms.service: azure-hdinsight
ms.topic: how-to
author: apurbasroy
ms.author: apsinhar
ms.reviewer: nijelsf
ms.date: 09/19/2025
---

# Manage Azure HDInsight clusters using the HDInsight .NET SDK

This article describes how to manage Azure HDInsight clusters programmatically by using the HDInsight .NET SDK. The SDK provides a set of client libraries that let you automate cluster operations such as creating, list, delete and scale directly from your .NET applications. By using the SDK, you can integrate HDInsight cluster management into your existing workflows and applications.

## Prerequisites
Before you begin this article, you must have:

- An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Connect to Azure HDInsight

You need the following NuGet packages:

 ```cmd
 Install-Package Microsoft.Azure.Management.ResourceManager -Pre
 Install-Package Microsoft.Azure.Management.HDInsight
 Install-Package Microsoft.Azure.HDInsight.Job -Version 3.0.0-preview.3
 ```

The following code sample shows you how to connect to Azure before you can administer HDInsight clusters under your Azure subscription.


 ```csharp
    				using Azure.Identity;
				using Microsoft.Azure.HDInsight.Job;
				using Microsoft.Azure.Management.HDInsight;
				using Microsoft.Azure.Management.ResourceManager;
				using Microsoft.Rest;
				using System;
				using System.Threading.Tasks;

				namespace SubmitHDInsightJobDotNet
				{
					class Program
					{
						private static HDInsightManagementClient _hdiManagementClient;

						// HDInsight Cluster Configuration
						private const string ExistingClusterName = "adms-";

						// Service Principal Configuration
						private const string TenantID = "
						private const string ClientID = "";
						private const string ClientSecret = "";

						private const string SubscriptionID = "";
						private const string ResourceGroup = "";

						static async Task Main(string[] args)
						{
							Console.WriteLine("Authenticating with Microsoft Entra...");

							await InitializeHDInsightClientAsync();

							// Register the HDInsight RP (one-time)
							await EnableHDInsightAsync();

							// Example: Get cluster details
							await GetClusterDetailsAsync();

							// Example: Resize cluster (scale to 5 worker nodes)
							await ResizeClusterAsync(5);

							Console.WriteLine("Press ENTER to continue");
							Console.ReadLine();
						}

						private static async Task InitializeHDInsightClientAsync()
						{
							var credential = new ClientSecretCredential(TenantID, ClientID, ClientSecret);
							var tokenRequestContext = new Azure.Core.TokenRequestContext(new[] { "https://" + "management.core.windows.net/.default" });
							var tokenResponse = await credential.GetTokenAsync(tokenRequestContext);

							var tokenCredentials = new TokenCredentials(tokenResponse.Token);

							_hdiManagementClient = new HDInsightManagementClient(tokenCredentials);

							System.Console.WriteLine("HDInsight client initialized successfully with Service Principal authentication.");
						}


						private static async Task EnableHDInsightAsync()
						{
							var resourceClient = new Microsoft.Azure.Management.ResourceManager.ResourceManagementClient(
								_hdiManagementClient.Credentials
							)
							{
								SubscriptionID = SubscriptionID
							};

							var result = await resourceClient.Providers.RegisterAsync("Microsoft.HDInsight");
							Console.WriteLine($"Provider registration state: {result.RegistrationState}");
						}

						private static async Task GetClusterDetailsAsync()
						{
							var resourceClient = new Microsoft.Azure.Management.HDInsight.HDInsightManagementClient(
								_hdiManagementClient.Credentials
							)
							{
								SubscriptionID = SubscriptionID
							};
							var cluster = await resourceClient.Clusters.GetAsync(ResourceGroup, ExistingClusterName);

							Console.WriteLine($"Cluster Name: {cluster.Name}");
							Console.WriteLine($"Cluster Type: {cluster.Properties.ClusterDefinition.Kind}");
							Console.WriteLine($"Cluster State: {cluster.Properties.ClusterState}");
							Console.WriteLine($"Worker Nodes: {cluster.Properties.ComputeProfile.Roles[1].TargetInstanceCount}");
						}

						private static async Task ResizeClusterAsync(int targetWorkerNodes)
						{
							Console.WriteLine($"Resizing cluster {ExistingClusterName} to {targetWorkerNodes} worker nodes...");

							await _hdiManagementClient.Clusters.ResizeAsync(ResourceGroup, ExistingClusterName, targetWorkerNodes);

							Console.WriteLine("Resize request submitted. Use GetClusterDetailsAsync to check progress.");
						}

					}

				}
 ```
You see a prompt when you run this program. If you don't want to see the prompt, see [Create noninteractive authentication .NET HDInsight applications](../hdinsight-create-non-interactive-authentication-dotnet-applications.md).
## List clusters

The following code snippet lists clusters and some properties:


 ```csharp
 				var results = _hdiManagementClient.Clusters.List();
				foreach (var name in results.Clusters) {
					Console.WriteLine("Cluster Name: " + name.Name);
					Console.WriteLine("\t Cluster type: " + name.Properties.ClusterDefinition.ClusterType);
					Console.WriteLine("\t Cluster location: " + name.Location);
					Console.WriteLine("\t Cluster version: " + name.Properties.ClusterVersion);
				}

 ```
## Delete clusters

Use the following code snippet to delete a cluster synchronously or asynchronously:

 ```csharp
  _hdiManagementClient.Clusters.Delete("<Resource Group Name>", "<Cluster Name>");
  _hdiManagementClient.Clusters.DeleteAsync("<Resource Group Name>", "<Cluster Name>");

 ```

## Scale clusters

Use the cluster scaling feature to change the number of worker nodes used by a cluster that's running in HDInsight without having to re-create the cluster.

>[!Note]
>Only clusters with HDInsight version 5.1 or higher are supported. If you're unsure of the version of your cluster, check the **Properties** page. For more information, see [**List and show clusters**](../hdinsight-administer-use-portal-linux.md#showClusters).


The effect of changing the number of data nodes for each type of cluster supported by HDInsight:

- **Apache Hadoop**: You can seamlessly increase the number of worker nodes in a Hadoop cluster that's running without affecting any pending or running jobs. You can also submit new jobs while the operation is in progress. Failures in a scaling operation are gracefully handled so that the cluster is always left in a functional state.
    
    When a Hadoop cluster is scaled down by reducing the number of data nodes, some of the services in the cluster are restarted. All running and pending jobs fail at the completion of the scaling operation. After the operation is finished, you can resubmit the jobs.
    
- **Apache HBase**: You can seamlessly add or remove nodes to your HBase cluster while it's running. Regional servers are automatically balanced within a few minutes of completing the scaling operation. You can also manually balance the regional servers. Sign in to the head node of a cluster and run the following commands from a command prompt window:
    
    
  ```bash
     >pushd %HBASE_HOME%\bin
     >hbase shell
     >balancer
  ```

## Update HTTP user credentials

The update procedure is the same as the one you use to grant or revoke HTTP access. If the cluster was granted HTTP access, you must first revoke it. Then you can grant access with new HTTP user credentials.

## Find the default storage account

The following code snippet demonstrates how to get the default storage account name and key for a cluster.

 ```csharp
     var results = _hdiManagementClient.Clusters.GetClusterConfigurations(<Resource Group Name>, <Cluster Name>, "core-site");
     foreach (var key in results.Configuration.Keys)
     {
        Console.WriteLine(String.Format("{0} => {1}", key, results.Configuration[key]));
     }
  ```


