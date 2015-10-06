<properties
   	pageTitle="Create Hadoop, HBase, or Storm clusters on Linux in HDInsight using cURL and the Azure REST API | Microsoft Azure"
   	description="Learn how to create Hadoop, HBase, or Storm clusters on Linux for HDInsight using cURL and the Azure REST API."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="10/05/2015"
   	ms.author="jgao"/>

#Create Linux-based clusters in HDInsight using the .NET SDK

The HDInsight .NET SDK provides .NET client libraries that make it easier to work with HDInsight from a .NET Framework application. This document demonstrates how to create a Linux-based HDInsight cluster using the .NET SDK.

##Prerequisites

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).

- __Visual Studio 2013 or 2015__

##Create a console application

1. Open Visual Studio 2013 or 2015.

2. Create a new Visual Studio project with the following settings

    |Property|Value|
    |--------|-----|
    |Template|Templates/Visual C#/Windows/Console Application|
    |Name|CreateHDICluster|

5. From the **Tools** menu, click **Nuget Package Manager**, and then click **Package Manager Console**.

6. Run the following command in the console to install the packages:

        Install-Package Microsoft.Azure.Common.Authentication -pre
        Install-Package Microsoft.Azure.Management.HDInsight -Pre

    These commands add .NET libraries and references to them to the current Visual Studio project.

6. From Solution Explorer, double-click **Program.cs** to open it, paste the following code, and provide values for the variables:

        using System;
        using System.Security;
        
        using Microsoft.Azure;
        using Microsoft.Azure.Common.Authentication;
        using Microsoft.Azure.Common.Authentication.Factories;
        using Microsoft.Azure.Common.Authentication.Models;
        using Microsoft.Azure.Management.HDInsight;
        using Microsoft.Azure.Management.HDInsight.Models;
        
        namespace CreateHDICluster
        {
            class Program
            {
                private static HDInsightManagementClient _hdiManagementClient;
                
                //Replace SUBSCRIPTIONID with your Azure subscription ID
                private static Guid SubscriptionId = new Guid(SUBSCRIPTIONID);
                
                //Replace GROUPNAME with the name of the resource group to create the cluster in
                private const string ResourceGroupName = "GROUPNAME";
                
                //Replace CLUSTERNAME with the name of the HDInsight cluster you wish to create
                private const string NewClusterName = "CLUSTERNAME";
                private const int NewClusterNumNodes = 1;
                
                //Replace LOCATION with the geographic region that the resource group, storage account, and HDInsight cluster are in
                private const string NewClusterLocation = "LOCATION";
                private const string NewClusterVersion = "3.2";
                
                //Replace STORAGENAME with the name of the storage account to use
                private const string ExistingStorageName = "STORAGENAME.blob.core.windows.net";
                
                //Replace STORAGEKEY with the key for the storage account
                private const string ExistingStorageKey = "STORAGEKEY";
                
                //Replace CONTAINERNAME with the container to use for HDInsight's default storage
                private const string ExistingContainer = "CONTAINTERNAME";
                private const HDInsightClusterType NewClusterType = HDInsightClusterType.Hadoop;
            private const OSType NewClusterOSType = OSType.Linux;
                private const string NewClusterUsername = "admin";
                
                //Replace ADMINPASSWORD with the password for the admin account
                private const string NewClusterPassword = "ADMINPASSWORD";
                
                //Replace SSHUSER with the user name you want to use with logging in to the cluster through SSH
                private const string NewClusterSshUserName = "SSHUSER";
                
                //Replace SSHPUBLICKEY with the public key certificate to use when authenticating the SSH user. For more information on generating and using SSH keys with HDInsight, see https://azure.microsoft.com/en-us/documentation/articles/hdinsight-hadoop-linux-use-ssh-unix/ and https://azure.microsoft.com/en-us/documentation/articles/hdinsight-hadoop-linux-use-ssh-windows/
                private const string NewClusterSshPublicKey = @"SSHPUBLICKEY";
        
                private static void Main(string[] args)
                {
                    System.Console.WriteLine("Running");
                    
                    //Authenticate to your subscription
                    var tokenCreds = GetTokenCloudCredentials();
                    var subCloudCredentials = GetSubscriptionCloudCredentials(tokenCreds, SubscriptionId);
        
                    //Get an HDIManagement client
                    _hdiManagementClient = new HDInsightManagementClient(subCloudCredentials);
        
                    //Create a new cluster
                    CreateCluster();
                }
        
                public static SubscriptionCloudCredentials GetTokenCloudCredentials(string username = null, SecureString password = null)
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
        
                public static SubscriptionCloudCredentials GetSubscriptionCloudCredentials(SubscriptionCloudCredentials creds, Guid subId)
                {
                    return new TokenCloudCredentials(subId.ToString(), ((TokenCloudCredentials)creds).Token);
                }
        
        
                private static void CreateCluster()
                {
                    var parameters = new ClusterCreateParameters
                    {
                        ClusterSizeInNodes = NewClusterNumNodes,
                        Location = NewClusterLocation,
                        ClusterType = NewClusterType,
                        OSType = NewClusterOSType,
                        Version = NewClusterVersion,
        
                        DefaultStorageAccountName = ExistingStorageName,
                        DefaultStorageAccountKey = ExistingStorageKey,
                        DefaultStorageContainer = ExistingContainer,
        
                        UserName = NewClusterUsername,
                        Password = NewClusterPassword,
                        SshUserName = NewClusterSshUserName,
                        SshPublicKey = NewClusterSshPublicKey
                    };
        
                    ScriptAction rScriptAction = new ScriptAction("Install R",
                        new Uri("https://hdiconfigactions.blob.core.windows.net/linuxrconfigactionv01/r-installer-v01.sh"), "");
        
                    parameters.ScriptActions.Add(ClusterNodeType.HeadNode,new System.Collections.Generic.List<ScriptAction> { rScriptAction});
                parameters.ScriptActions.Add(ClusterNodeType.WorkerNode, new System.Collections.Generic.List<ScriptAction> { rScriptAction });
                    
                    _hdiManagementClient.Clusters.Create(ResourceGroupName, NewClusterName, parameters);
                }
        
            }
        }

		
10. Replace the class member values.

7. Press **F5** to run the application. A console window should open and display the status of the application. You will also be prompted to enter your Azure account credentials. It can take several minutes to create an HDInsight cluster, normally around 15.

##Next steps

Now that you have successfully created an HDInsight cluster, use the following to learn how to work with your cluster. 

###Hadoop clusters

* [Use Hive with HDInsight](hdinsight-use-hive.md)
* [Use Pig with HDInsight](hdinsight-use-pig.md)
* [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

###HBase clusters

* [Get started with HBase on HDInsight](hdinsight-hbase-tutorial-get-stared-linux.md)
* [Develop Java applications for HBase on HDInsight](hdinsight-hbase-build-java-maven-linux)

###Storm clusters

* [Develop Java topologies for Storm on HDInsight](hdinsight-storm-develop-java-topology.md)
* [Use Python components in Storm on HDInsight](hdinsight-storm-develop-python.md)
* [Deploy and monitor topologies with Storm on HDInsight](hdinsight-storm-deploy-monitor-topology-linux.md)