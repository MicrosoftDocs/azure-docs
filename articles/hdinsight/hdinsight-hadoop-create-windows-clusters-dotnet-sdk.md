<properties
   pageTitle="Create Windows-based Hadoop clusters in HDInsight using .NET SDK | Microsoft Azure"
   	description="Learn how to create HDInsight clusters for Azure HDInsight using .NET SDK."
   services="hdinsight"
   documentationCenter=""
   tags="azure-portal"
   authors="mumian"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="03/08/2016"
   ms.author="jgao"/>

# Create Windows-based Hadoop clusters in HDInsight using .NET SDK

[AZURE.INCLUDE [selector](../../includes/hdinsight-selector-create-clusters.md)]


Learn how to create HDInsight clusters using .NET SDK. For other cluster creation tools and features click the tab select on the top of this page or see [Cluster creation methods](hdinsight-provision-clusters.md#cluster-creation-methods).


##Prerequisites:

[AZURE.INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

Before you begin the instructions in this article, you must have the following:

- An Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- Visual Studio 2013 or 2015.

## Create clusters

The HDInsight .NET SDK provides .NET client libraries that make it easier to work with HDInsight from a .NET Framework application. Follow the instructions below to create a Visual Studio console application and paste the code for creating a cluster.

The application requires an Azure resource group, and the default storage account.  The [Appendix A](#appx-a-create-dependent-components) provides a PowerShell script to create the dependent components.

**To create a Visual Studio console application**

1. Create a new C# console application in Visual Studio.
2. Run the following Nuget command in the Nuget Package Management console.

		Install-Package Microsoft.Azure.Common.Authentication -Pre
		Install-Package Microsoft.Azure.Management.ResourceManager -Pre
		Install-Package Microsoft.Azure.Management.HDInsight

6. From Solution Explorer, double-click **Program.cs** to open it, paste the following code, and provide values for the variables:

		using System;
		using System.Security;
		using Microsoft.Azure;
		using Microsoft.Azure.Common.Authentication;
		using Microsoft.Azure.Common.Authentication.Factories;
		using Microsoft.Azure.Common.Authentication.Models;
		using Microsoft.Azure.Management.HDInsight;
		using Microsoft.Azure.Management.HDInsight.Models;
		using Microsoft.Azure.Management.ResourceManager;
		
		namespace CreateHDInsightCluster
		{
			class Program
			{
				private static HDInsightManagementClient _hdiManagementClient;
		
				private static Guid SubscriptionId = new Guid("<Azure Subscription ID>");
				private const string ExistingResourceGroupName = "<Azure Resource Group Name>";
				private const string ExistingStorageName = "<Default Storage Account Name>.blob.core.windows.net";
				private const string ExistingStorageKey = "<Default Storage Account Key>";
				private const string ExistingBlobContainer = "<Default Blob Container Name>";
				private const string NewClusterName = "<HDInsight Cluster Name>";
				private const int NewClusterNumNodes = 1;
				private const string NewClusterLocation = "EAST US 2";     // Must be the same as the default Storage account
				private const OSType NewClusterOsType = OSType.Windows;
				private const string NewClusterType = "Hadoop";
				private const string NewClusterVersion = "3.2";
				private const string NewClusterUsername = "admin";
				private const string NewClusterPassword = "<HTTP User password>";
		
				static void Main(string[] args)
				{
					System.Console.WriteLine("Creating a cluster.  The process takes 10 to 20 minutes ...");
		
					var tokenCreds = GetTokenCloudCredentials();
					var subCloudCredentials = GetSubscriptionCloudCredentials(tokenCreds, SubscriptionId);
					
					var svcClientCreds = new TokenCredentials(tokenCreds.Token); 
					var resourceManagementClient = new ResourceManagementClient(svcClientCreds);
					var rpResult = resourceManagementClient.Providers.Register("Microsoft.HDInsight");
					
					_hdiManagementClient = new HDInsightManagementClient(subCloudCredentials);
				
					var parameters = new ClusterCreateParameters
					{
						ClusterSizeInNodes = NewClusterNumNodes,
						UserName = NewClusterUsername,
						Password = NewClusterPassword,
						Location = NewClusterLocation,
						DefaultStorageAccountName = ExistingStorageName,
						DefaultStorageAccountKey = ExistingStorageKey,
						DefaultStorageContainer = ExistingBlobContainer,
						ClusterType = NewClusterType,
						OSType = NewClusterOsType
					};
		
					_hdiManagementClient.Clusters.Create(ExistingResourceGroupName, NewClusterName, parameters);

					System.Console.WriteLine("The cluster has been created. Press ENTER to continue ...");
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

7. Press **F5** to run the application. A console window should open and display the status of the application. You will also be prompted to enter your Azure account credentials. It can take several minutes to create an HDInsight cluster.



##Next steps
In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

- [Get started with Azure HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md) - Learn how to start working with your HDInsight cluster
- [Run Hive jobs in HDInsight using .NET SDK](hdinsight-hadoop-use-hive-dotnet-sdk.md)
- [Run Pig jobs in HDInsight using .NET SDK](hdinsight-hadoop-use-pig-dotnet-sdk.md)
- [Run Sqoop jobs in HDInsight using .NET SDK](hdinsight-hadoop-use-sqoop-dotnet-sdk.md)
- [Run Oozie jobs in HDInsight](hdinsight-use-oozie.md)
- [Azure HDInsight SDK documentation] [hdinsight-sdk-documentation] - Discover the HDInsight SDK

[hdinsight-sdk-documentation]: http://msdn.microsoft.com/library/dn479185.aspx
[azure-preview-portal]: https://manage.windowsazure.com
[connectionmanager]: http://msdn.microsoft.com/library/mt146773(v=sql.120).aspx
[ssispack]: http://msdn.microsoft.com/library/mt146770(v=sql.120).aspx
[ssisclustercreate]: http://msdn.microsoft.com/library/mt146774(v=sql.120).aspx
[ssisclusterdelete]: http://msdn.microsoft.com/library/mt146778(v=sql.120).aspx


##Appx-A Create dependent components

The following Azure PowerShell script can be use to create the dependent components needed by the .NET application in this tutorial.

[AZURE.INCLUDE [upgrade-powershell](../../includes/hdinsight-use-latest-powershell.md)]

    ####################################
    # Set these variables
    ####################################
    #region - used for creating Azure service names
    $nameToken = "<Enter an Alias>" 
    #endregion

    ####################################
    # Service names and varialbes
    ####################################
    #region - service names
    $namePrefix = $nameToken.ToLower() + (Get-Date -Format "MMdd")

    $resourceGroupName = $namePrefix + "rg"
    $hdinsightClusterName = $namePrefix + "hdi"
    $defaultStorageAccountName = $namePrefix + "store"
    $defaultBlobContainerName = $hdinsightClusterName

    $location = "East US 2"
    #endregion

    # Treat all errors as terminating
    $ErrorActionPreference = "Stop"

    ####################################
    # Connect to Azure
    ####################################
    #region - Connect to Azure subscription
    Write-Host "`nConnecting to your Azure subscription ..." -ForegroundColor Green
    try{Get-AzureRmContext}
    catch{Login-AzureRmAccount}
    #endregion

    #region - Create an HDInsight cluster
    ####################################
    # Create dependent components
    ####################################
    Write-Host "Creating a resource group ..." -ForegroundColor Green
    New-AzureRmResourceGroup `
        -Name  $resourceGroupName `
        -Location $location

    Write-Host "Creating the default storage account and default blob container ..."  -ForegroundColor Green
    New-AzureRmStorageAccount `
        -ResourceGroupName $resourceGroupName `
        -Name $defaultStorageAccountName `
        -Location $location `
        -Type Standard_GRS

    $defaultStorageAccountKey = Get-AzureRmStorageAccountKey `
                                    -ResourceGroupName $resourceGroupName `
                                    -Name $defaultStorageAccountName |  %{ $_.Key1 }
    $defaultStorageContext = New-AzureStorageContext `
                                    -StorageAccountName $defaultStorageAccountName `
                                    -StorageAccountKey $defaultStorageAccountKey
    New-AzureStorageContainer `
        -Name $defaultBlobContainerName `
        -Context $defaultStorageContext #use the cluster name as the container name

    Write-Host "Use the following names in your .NET application" -ForegroundColor Green
    Write-host "Resource Group Name: $resourceGroupName"
    Write-host "Default Storage Account Name: $defaultStorageAccountName"
    Write-host "Default Storage Account Key: $defaultStorageAccountKey"
    Write-host "Default Blob Container Name: $defaultBlobContainerName"
