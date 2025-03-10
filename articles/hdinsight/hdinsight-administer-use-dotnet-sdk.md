---
title: Manage Apache Hadoop clusters in HDInsight with .NET SDK - Azure 
description: Learn how to perform administrative tasks for the Apache Hadoop clusters in Azure HDInsight by using the HDInsight .NET SDK.

ms.service: azure-hdinsight
ms.custom: hdinsightactive, devx-track-csharp, devx-track-dotnet
ms.topic: conceptual
ms.date: 12/02/2024
---
# Manage Apache Hadoop clusters in HDInsight by using the .NET SDK

[!INCLUDE [selector](includes/hdinsight-portal-management-selector.md)]

Learn how to manage Azure HDInsight clusters by using the [HDInsight.NET SDK](/dotnet/api/overview/azure/hdinsight).

## Prerequisites

Before you begin this article, you must have:

* An Azure account with an active subscription. If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Connect to Azure HDInsight

You need the following NuGet packages:

```powershell
Install-Package Microsoft.Rest.ClientRuntime.Azure.Authentication -Pre
Install-Package Microsoft.Azure.Management.ResourceManager -Pre
Install-Package Microsoft.Azure.Management.HDInsight
```

The following code sample shows you how to connect to Azure before you can administer HDInsight clusters under your Azure subscription.

```csharp
using System;
using Microsoft.Azure;
using Microsoft.Azure.Management.HDInsight;
using Microsoft.Azure.Management.HDInsight.Models;
using Microsoft.Azure.Management.ResourceManager;
using Microsoft.IdentityModel.Clients.ActiveDirectory;
using Microsoft.Rest;
using Microsoft.Rest.Azure.Authentication;

namespace HDInsightManagement
{
    class Program
    {
        private static HDInsightManagementClient _hdiManagementClient;
        // Replace with your Azure Active Directory tenant ID if necessary.
        private const string TenantId = UserTokenProvider.CommonTenantId; 
        private const string SubscriptionId = "<Your Azure Subscription ID>";
        // This is the GUID for the PowerShell client. Used for interactive logins in this example.
        private const string ClientId = "1950a258-227b-4e31-a9cf-717495945fc2";

        static void Main(string[] args)
        {
            // Authenticate and get a token
            var authToken = Authenticate(TenantId, ClientId, SubscriptionId);
            // Flag subscription for HDInsight, if it isn't already.
            EnableHDInsight(authToken);
            // Get an HDInsight management client
            _hdiManagementClient = new HDInsightManagementClient(authToken);

            // insert code here

            System.Console.WriteLine("Press ENTER to continue");
            System.Console.ReadLine();
        }

        /// <summary>
        /// Authenticate to an Azure subscription and retrieve an authentication token
        /// </summary>
        static TokenCloudCredentials Authenticate(string TenantId, string ClientId, string SubscriptionId)
        {
            var authContext = new AuthenticationContext("https://login.microsoftonline.com/" + TenantId);
            var tokenAuthResult = authContext.AcquireToken("https://management.core.windows.net/", 
                ClientId, 
                new Uri("urn:ietf:wg:oauth:2.0:oob"), 
                PromptBehavior.Always, 
                UserIdentifier.AnyUser);
            return new TokenCloudCredentials(SubscriptionId, tokenAuthResult.AccessToken);
        }
        /// <summary>
        /// Marks your subscription as one that can use HDInsight, if it has not already been marked as such.
        /// </summary>
        /// <remarks>This is essentially a one-time action; if you have already done something with HDInsight
        /// on your subscription, then this isn't needed at all and will do nothing.</remarks>
        /// <param name="authToken">An authentication token for your Azure subscription</param>
        static void EnableHDInsight(TokenCloudCredentials authToken)
        {
            // Create a client for the Resource manager and set the subscription ID
            var resourceManagementClient = new ResourceManagementClient(new TokenCredentials(authToken.Token));
            resourceManagementClient.SubscriptionId = SubscriptionId;
            // Register the HDInsight provider
            var rpResult = resourceManagementClient.Providers.Register("Microsoft.HDInsight");
        }
    }
}
```

You see a prompt when you run this program. If you don't want to see the prompt, see [Create noninteractive authentication .NET HDInsight applications](hdinsight-create-non-interactive-authentication-dotnet-applications.md).

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

> [!NOTE]  
> Only clusters with HDInsight version 3.1.3 or higher are supported. If you're unsure of the version of your cluster, check the **Properties** page. For more information, see [List and show clusters](hdinsight-administer-use-portal-linux.md#showClusters).

The effect of changing the number of data nodes for each type of cluster supported by HDInsight:

* **Apache Hadoop**: You can seamlessly increase the number of worker nodes in a Hadoop cluster that's running without affecting any pending or running jobs. You can also submit new jobs while the operation is in progress. Failures in a scaling operation are gracefully handled so that the cluster is always left in a functional state.
  
    When a Hadoop cluster is scaled down by reducing the number of data nodes, some of the services in the cluster are restarted. All running and pending jobs fail at the completion of the scaling operation. After the operation is finished, you can resubmit the jobs.
* **Apache HBase**: You can seamlessly add or remove nodes to your HBase cluster while it's running. Regional servers are automatically balanced within a few minutes of completing the scaling operation. You can also manually balance the regional servers. Sign in to the head node of a cluster and run the following commands from a command prompt window:
  

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

## Submit jobs

Learn how to submit jobs for the following products:

- **MapReduce**: [Run MapReduce samples in HDInsight](hadoop/apache-hadoop-run-samples-linux.md)
- **Apache Hive**: [Run Apache Hive queries by using the .NET SDK](hadoop/apache-hadoop-use-hive-dotnet-sdk.md)
- **Apache Sqoop**: [Use Apache Sqoop with HDInsight](hadoop/apache-hadoop-use-sqoop-dotnet-sdk.md)
- **Apache Oozie**: [Use Apache Oozie with Hadoop to define and run a workflow in HDInsight](hdinsight-use-oozie-linux-mac.md)

## Upload data to Azure Blob Storage

To upload data, see [Upload data to HDInsight][hdinsight-upload-data].

## Related content

* [HDInsight .NET SDK reference documentation](/dotnet/api/overview/azure/hdinsight)
* [Manage Apache Hadoop clusters in HDInsight by using the Azure portal](hdinsight-administer-use-portal-linux.md)
* [Administer HDInsight by using a command-line interface][hdinsight-admin-cli]
* [Create HDInsight clusters][hdinsight-provision]
* [Upload data to HDInsight][hdinsight-upload-data]
* [Get started with Azure HDInsight][hdinsight-get-started]

[azure-purchase-options]: https://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: https://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: https://azure.microsoft.com/pricing/free-trial/

[hdinsight-get-started]:hadoop/apache-hadoop-linux-tutorial-get-started.md
[hdinsight-provision]: hdinsight-hadoop-provision-linux-clusters.md
[hdinsight-provision-custom-options]: hdinsight-hadoop-provision-linux-clusters.md#configuration
[hdinsight-submit-jobs]:hadoop/submit-apache-hadoop-jobs-programmatically.md

[hdinsight-admin-cli]: hdinsight-administer-use-command-line.md
[hdinsight-storage]: hdinsight-hadoop-use-blob-storage.md
[hdinsight-use-hive]:hadoop/hdinsight-use-hive.md
[hdinsight-use-mapreduce]:hadoop/hdinsight-use-mapreduce.md
[hdinsight-upload-data]: hdinsight-upload-data.md
