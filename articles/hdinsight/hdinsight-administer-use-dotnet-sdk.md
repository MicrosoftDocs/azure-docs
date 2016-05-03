<properties
	pageTitle="Manage Hadoop clusters in HDInsight with .NET SDK | Microsoft Azure"
	description="Learn how to perform administrative tasks for the Hadoop clusters in HDInsight using HDInsight .NET SDK."
	services="hdinsight"
	editor="cgronlun"
	manager="paulettm"
	tags="azure-portal"
	authors="mumian"
	documentationCenter=""/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="05/02/2016"
	ms.author="jgao"/>

# Manage Hadoop clusters in HDInsight by using .NET SDK

[AZURE.INCLUDE [selector](../../includes/hdinsight-portal-management-selector.md)]

Learn how to manage HDInsight clusters using [HDInsight.NET SDK](https://msdn.microsoft.com/library/mt271028.aspx).


**Prerequisites**

Before you begin this article, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).


##Connect to Azure HDInsight

You will need the following Nuget packages:

	Install-Package Microsoft.Azure.Common.Authentication -Pre
	Install-Package Microsoft.Azure.Management.HDInsight -Pre

The following code sample shows you how to connect to Azure before you can administer HDInsight clusters under your Azure subscription.

	using System;
	using System.Security;
	using Microsoft.Azure;
	using Microsoft.Azure.Common.Authentication;
	using Microsoft.Azure.Common.Authentication.Factories;
	using Microsoft.Azure.Common.Authentication.Models;
	using Microsoft.Azure.Management.HDInsight;
	using Microsoft.Azure.Management.HDInsight.Models;

	namespace HDInsightManagement
	{
		class Program
		{
			private static HDInsightManagementClient _hdiManagementClient;
			private static Guid SubscriptionId = new Guid("<Your Azure Subscription ID>");

			static void Main(string[] args)
			{
				var tokenCreds = GetTokenCloudCredentials();
				var subCloudCredentials = GetSubscriptionCloudCredentials(tokenCreds, SubscriptionId);

				_hdiManagementClient = new HDInsightManagementClient(subCloudCredentials);

				// insert code here

				System.Console.WriteLine("Press ENTER to continue");
				System.Console.ReadLine();
			}

			public static TokenCloudCredentials GetTokenCloudCredentials(string username = null, SecureString password = null)
			{
				var authFactory = new AuthenticationFactory();

				var account = new AzureAccount { Type = AzureAccount.AccountType.User };

				if (username != null && password != null)
					account.Id = username;

				var env = AzureEnvironment.PublicEnvironments[EnvironmentName.AzureCloud];

				var accessToken =
					authFactory.Authenticate(account, env, AuthenticationFactory.CommonAdTenant, password, ShowDialog.Auto)
						.AccessToken;

				return new TokenCloudCredentials(accessToken);
			}

			public static SubscriptionCloudCredentials GetSubscriptionCloudCredentials(TokenCloudCredentials creds, Guid subId)
			{
				return new TokenCloudCredentials(subId.ToString(), creds.Token);
			}
		}
	}

You shall see a prompt when you run this program.  If you don't want to see the prompt, see [Create non-interactive authentication .NET HDInsight applications](hdinsight-create-non-interactive-authentication-dotnet-applications.md).

##Create clusters

See [Create Linux-based clusters in HDInsight using the .NET SDK](hdinsight-hadoop-create-linux-clusters-dotnet-sdk.md)

##List clusters

The following code snippet lists clusters and some properties:

    var results = _hdiManagementClient.Clusters.List();
    foreach (var name in results.Clusters) {
        Console.WriteLine("Cluster Name: " + name.Name);
        Console.WriteLine("\t Cluster type: " + name.Properties.ClusterDefinition.ClusterType);
        Console.WriteLine("\t Cluster location: " + name.Location);
        Console.WriteLine("\t Cluster version: " + name.Properties.ClusterVersion);
    }

##Delete clusters

Use the following code snippet to delete a cluster synchronously or asynchronously: 

    _hdiManagementClient.Clusters.Delete("<Resource Group Name>", "<Cluster Name>");
    _hdiManagementClient.Clusters.DeleteAsync("<Resource Group Name>", "<Cluster Name>");
            
##Scale clusters
The cluster scaling feature allows you to change the number of worker nodes used by a cluster that is running in Azure HDInsight without having to re-create the cluster.

>[AZURE.NOTE] Only clusters with HDInsight version 3.1.3 or higher are supported. If you are unsure of the version of your cluster, you can check the Properties page.  See [List and show clusters](hdinsight-administer-use-portal-linux.md#list-and-show-clusters).

The impact of changing the number of data nodes for each type of cluster supported by HDInsight:

- Hadoop

	You can seamlessly increase the number of worker nodes in a Hadoop cluster that is running without impacting any pending or running jobs. New jobs can also be submitted while the operation is in progress. Failures in a scaling operation are gracefully handled so that the cluster is always left in a functional state.

	When a Hadoop cluster is scaled down by reducing the number of data nodes, some of the services in the cluster are restarted. This causes all running and pending jobs to fail at the completion of the scaling operation. You can, however, resubmit the jobs once the operation is complete.

- HBase

	You can seamlessly add or remove nodes to your HBase cluster while it is running. Regional Servers are automatically balanced within a few minutes of completing the scaling operation. However, you can also manually balance the regional servers by logging into the headnode of cluster and running the following commands from a command prompt window:

		>pushd %HBASE_HOME%\bin
		>hbase shell
		>balancer

- Storm

	You can seamlessly add or remove data nodes to your Storm cluster while it is running. But after a successful completion of the scaling operation, you will need to rebalance the topology.

	Rebalancing can be accomplished in two ways:

	* Storm web UI
	* Command-line interface (CLI) tool

	Please refer to the [Apache Storm documentation](http://storm.apache.org/documentation/Understanding-the-parallelism-of-a-Storm-topology.html) for more details.

	The Storm web UI is available on the HDInsight cluster:

	![hdinsight storm scale rebalance](./media/hdinsight-administer-use-management-portal/hdinsight.portal.scale.cluster.storm.rebalance.png)

	Here is an example how to use the CLI command to rebalance the Storm topology:

		## Reconfigure the topology "mytopology" to use 5 worker processes,
		## the spout "blue-spout" to use 3 executors, and
		## the bolt "yellow-bolt" to use 10 executors

		$ storm rebalance mytopology -n 5 -e blue-spout=3 -e yellow-bolt=10

The following code snippet shows how to resize a cluster synchronously or asynchronously:

    _hdiManagementClient.Clusters.Resize("<Resource Group Name>", "<Cluster Name>", <New Size>);   
    _hdiManagementClient.Clusters.ResizeAsync("<Resource Group Name>", "<Cluster Name>", <New Size>);   
	

##Grant/revoke access

HDInsight clusters have the following HTTP web services (all of these services have RESTful endpoints):

- ODBC
- JDBC
- Ambari
- Oozie
- Templeton


By default, these services are granted for access. You can revoke/grant the access. To revoke:

	var httpParams = new HttpSettingsParameters
	{
		HttpUserEnabled = false,
		HttpUsername = "admin",
		HttpPassword = "*******",
	};
	_hdiManagementClient.Clusters.ConfigureHttpSettings("<Resource Group Name>, <Cluster Name>, httpParams);

To grant:

	var httpParams = new HttpSettingsParameters
	{
		HttpUserEnabled = enable,
		HttpUsername = "admin",
		HttpPassword = "*******",
	};
	_hdiManagementClient.Clusters.ConfigureHttpSettings("<Resource Group Name>, <Cluster Name>, httpParams);


>[AZURE.NOTE] By granting/revoking the access, you will reset the cluster user name and password.

This can also be done via the Portal. See [Administer HDInsight by using the Azure Portal][hdinsight-admin-portal].

##Update HTTP user credentials

It is the same procedure as [Grant/revoke HTTP access](#grant/revoke-access).If the cluster has been granted the HTTP access, you must first revoke it.  And then grant the access with new HTTP user credentials.


##Find the default storage account

The following code snippet demonstrates how to get the default storage account name and the default storage account key for a cluster.

	var results = _hdiManagementClient.Clusters.GetClusterConfigurations(<Resource Group Name>, <Cluster Name>, "core-site");
	foreach (var key in results.Configuration.Keys)
	{
	    Console.WriteLine(String.Format("{0} => {1}", key, results.Configuration[key]));
	}


##Submit jobs

**To submit MapReduce jobs**

See [Run Hadoop MapReduce samples in HDInsight](hdinsight-hadoop-run-samples-linux.md).

**To submit Hive jobs** 

See [Run Hive queries using .NET SDK](hdinsight-hadoop-use-hive-dotnet-sdk.md).

**To submit Pig jobs**

See [Run Pig jobs using .NET SDK](hdinsight-hadoop-use-pig-dotnet-sdk.md).

**To submit Sqoop jobs**

See [Use Sqoop with HDInsight](hdinsight-hadoop-use-sqoop-dotnet-sdk.md).

**To submit Oozie jobs**

See [Use Oozie with Hadoop to define and run a workflow in HDInsight](hdinsight-use-oozie-linux-mac.md).

##Upload data to Azure Blob storage
See [Upload data to HDInsight][hdinsight-upload-data].


## See Also
* [HDInsight .NET SDK reference documentation](https://msdn.microsoft.com/library/mt271028.aspx)
* [Administer HDInsight by using the Azure Portal][hdinsight-admin-portal]
* [Administer HDInsight using a command-line interface][hdinsight-admin-cli]
* [Create HDInsight clusters][hdinsight-provision]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Get started with Azure HDInsight][hdinsight-get-started]


[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/

[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-provision-custom-options]: hdinsight-provision-clusters.md#configuration
[hdinsight-submit-jobs]: hdinsight-submit-hadoop-jobs-programmatically.md

[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-admin-portal]: hdinsight-administer-use-portal-linux.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hdinsight-flight]: hdinsight-analyze-flight-delay-data.md


