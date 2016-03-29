<properties
	pageTitle="Submit Hadoop jobs in HDInsight | Microsoft Azure"
	description="Learn how to submit Hadoop jobs to Azure HDInsight Hadoop."
	editor="cgronlun"
	manager="paulettm"
	services="hdinsight"
	documentationCenter=""
	tags="azure-portal"
	authors="mumian"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="03/23/2016"
	ms.author="jgao"/>

# Submit Hadoop jobs in HDInsight

Learn how to use Azure PowerShell to submit MapReduce and Hive jobs, and how to use the HDInsight .NET SDK to submit MapReduce, Hadoop streaming, and Hive jobs.

> [AZURE.NOTE] The steps in this article must be performed from a Windows client. For information on using a Linux, OS X, or Unix client to work with MapReduce, Hive, or Pig on HDInsight, see the following articles and select either the **SSH** or **Curl** links within each:
>
> - [Use Hive with HDInsight](hdinsight-use-hive.md)
> - [Use Pig with HDInsight](hdinsight-use-pig.md)
> - [Use MapReduce with HDInsight](hdinsight-use-mapreduce.md)

##Prerequisites

Before you begin this article, you must have the following:

- **An Azure HDInsight cluster**. For instructions, see [Get started with HDInsight][hdinsight-get-started] or [Create Hadoop clusters in HDInsight][hdinsight-provision].
- **A workstation with Azure PowerShell**. See [Install Azure PowerShell 1.0 and greater](hdinsight-administer-use-powershell.md#install-azure-powershell-10-and-greater).

##Submit MapReduce jobs using PowerShell

See [Run Hadoop MapReduce samples in Windows-based HDInsight](hdinsight-run-samples.md).

##Submit Hive jobs using  PowerShell

See [Run Hive queries using PowerShell](hdinsight-hadoop-use-hive-powershell.md)

## Submit Hive jobs using Visual Studio

See [Get started using HDInsight Hadoop Tools for Visual Studio][hdinsight-visual-studio-tools].

##Submit Sqoop jobs using PowerShell

See [Use Sqoop with HDInsight][hdinsight-use-sqoop].

##Submit Hive/Pig/Sqoop jobs using HDInsight .NET SDK
The HDInsight .NET SDK provides .NET client libraries, which makes it easier to work with HDInsight clusters from .NET. 

The following sample using user interactive authentication. To use the non-interactive authentication, see [Create non-interactive authentication .NET HDInsight applciations](hdinsight-create-non-interactive-authentication-dotnet-applications.md)

**To Submit jobs**

1. Create a C# console application in Visual Studio.
2. From the Nuget Package Manager Console, run the following command.

		Install-Package Microsoft.Azure.Common.Authentication -Pre
		Install-Package Microsoft.Azure.Management.HDInsight -Pre
		Install-Package Microsoft.Azure.Management.HDInsight.Job -Pre
2. Use the following code:

		using System;
		using System.Collections.Generic;
		using System.Security;
		using System.Threading;
		using Microsoft.Azure;
		using Microsoft.Azure.Common.Authentication;
		using Microsoft.Azure.Common.Authentication.Factories;
		using Microsoft.Azure.Common.Authentication.Models;
		using Microsoft.Azure.Management.Resources;
		using Microsoft.Azure.Management.HDInsight;
		using Microsoft.Azure.Management.HDInsight.Job;
		using Microsoft.Azure.Management.HDInsight.Job.Models;
		using Hyak.Common;
		
		namespace SubmitHDInsightJobDotNet
		{
		    class Program
		    {
		        private static HDInsightManagementClient _hdiManagementClient;
		        private static HDInsightJobManagementClient _hdiJobManagementClient;
		
		        private static Guid SubscriptionId = new Guid("<Your Subscription ID>");
		        private const string ResourceGroupName = "<Your Resource Group Name>";
		
		        private const string ExistingClusterName = "<Your HDInsight Cluster Name>";
		        private const string ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
		        private const string ExistingClusterUsername = "<Cluster Username>";
		        private const string ExistingClusterPassword = "<Cluster User Password>";
		
		        private const string DefaultStorageAccountName = "<Default Storage Account Name>";
		        private const string DefaultStorageAccountKey = "<Default Storage Account Key>";
		        private const string DefaultStorageContainerName = "<Default Blob Container Name>";
		
		        static void Main(string[] args)
		        {
                    System.Console.WriteLine("The application is running ...");
		
		            var tokenCreds = GetTokenCloudCredentials();
		            var subCloudCredentials = GetSubscriptionCloudCredentials(tokenCreds, SubscriptionId);
		
		            var resourceManagementClient = new ResourceManagementClient(subCloudCredentials);
		            var rpResult = resourceManagementClient.Providers.Register("Microsoft.HDInsight");
		
		            _hdiManagementClient = new HDInsightManagementClient(subCloudCredentials);
		
		            var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
		            _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);
		
		            SubmitHiveJob();
		            SubmitPigJob();
		            SubmitSqoopJob();

                    System.Console.WriteLine("Press ENTER to continue ...");
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
		
		        private static void SubmitHiveJob()
		        {
		            Dictionary<string, string> defines = new Dictionary<string, string> { { "hive.execution.engine", "ravi" }, { "hive.exec.reducers.max", "1" } };
		            List<string> args = new List<string> { { "argA" }, { "argB" } };
		            var parameters = new HiveJobSubmissionParameters
		            {
		                Query = "SHOW TABLES",
		                Defines = defines,
		                Arguments = args
		            };
		
                    Console.WriteLine("Submitting the Hive job to the cluster...");
                    var jobResponse = _hdiJobManagementClient.JobManagement.SubmitHiveJob(parameters);
                    var jobId = jobResponse.JobSubmissionJsonResponse.Id;
                    Console.WriteLine("Response status code is " + jobResponse.StatusCode);
                    Console.WriteLine("JobId is " + jobId);

                    Console.WriteLine("Waiting for the job completion ...");
		
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
                        
                    Console.WriteLine("Job output is: ");
                    
                    using (var reader = new StreamReader(output, Encoding.UTF8))
                    {
                        string value = reader.ReadToEnd();
                        Console.WriteLine(value);
                    }
		        }
                
   		        private static void SubmitPigJob()
		        {
		            var parameters = new PigJobSubmissionParameters
		            {
		                Query = @"LOGS = LOAD 'wasb:///example/data/sample.log';
		                    LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;
		                    FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;
		                    GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;
		                    FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;
		                    RESULT = order FREQUENCIES by COUNT desc;
		                    DUMP RESULT;"
		            };
		
		            System.Console.WriteLine("Submitting the Pig job to the cluster...");
		            var response = _hdiJobManagementClient.JobManagement.SubmitPigJob(parameters);
		            System.Console.WriteLine("Validating that the response is as expected...");
		            System.Console.WriteLine("Response status code is " + response.StatusCode);
		            System.Console.WriteLine("Validating the response object...");
		            System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
		        }
		
		        private static void SubmitSqoopJob()
		        {
		            var sqlDatabaseServerName = "<SQLDatabaseServerName>";
		            var sqlDatabaseLogin = "<SQLDatabaseLogin>";
		            var sqlDatabaseLoginPassword = "<SQLDatabaseLoginPassword>";
		            var sqlDatabaseDatabaseName = "<DatabaseName>";
		
		            var tableName = "<TableName>";
		            var exportDir = "/tutorials/usesqoop/data";
		
		            // Connection string for using Azure SQL Database.
		            // Comment if using SQL Server
		            var connectionString = "jdbc:sqlserver://" + sqlDatabaseServerName + ".database.windows.net;user=" + sqlDatabaseLogin + "@" + sqlDatabaseServerName + ";password=" + sqlDatabaseLoginPassword + ";database=" + sqlDatabaseDatabaseName;
		            // Connection string for using SQL Server.
		            // Uncomment if using SQL Server
		            //var connectionString = "jdbc:sqlserver://" + sqlDatabaseServerName + ";user=" + sqlDatabaseLogin + ";password=" + sqlDatabaseLoginPassword + ";database=" + sqlDatabaseDatabaseName;
		
		            var parameters = new SqoopJobSubmissionParameters
		            {
		                Command = "export --connect " + connectionString + " --table " + tableName + "_mobile --export-dir " + exportDir + "_mobile --fields-terminated-by \\t -m 1"
		            };
		
		            System.Console.WriteLine("Submitting the Sqoop job to the cluster...");
		            var response = _hdiJobManagementClient.JobManagement.SubmitSqoopJob(parameters);
		            System.Console.WriteLine("Validating that the response is as expected...");
		            System.Console.WriteLine("Response status code is " + response.StatusCode);
		            System.Console.WriteLine("Validating the response object...");
		            System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
		        }
		    }
		}



5. Press **F5** to run the application.

##Submit jobs using the HDInsight Tools for Visual Studio

Using the HDInsight Tools for Visual Studio, you can run Hive queries and Pig scripts. See [Get started using Visual Studio Hadoop tools for HDInsight](hdinsight-hadoop-visual-studio-tools-get-started.md).

##Next steps
In this article, you have learned several ways to create an HDInsight cluster. To learn more, see the following articles:

* [Get started with Azure HDInsight][hdinsight-get-started]
* [Create Hadoop clusters in HDInsight][hdinsight-provision]
* [Manage HDInsight by using PowerShell][hdinsight-admin-powershell]
* [HDInsight Cmdlet Reference Documentation][hdinsight-powershell-reference]
* [Use Hive with HDInsight][hdinsight-use-hive]
* [Use Pig with HDInsight][hdinsight-use-pig]


[azure-certificate]: http://msdn.microsoft.com/library/windowsazure/gg551722.aspx
[azure-management-portal]: https://portal.azure.com/

[hdinsight-visual-studio-tools]: ../HDInsight/hdinsight-hadoop-visual-studio-tools-get-started.md
[hdinsight-use-sqoop]: hdinsight-use-sqoop.md
[hdinsight-provision]: hdinsight-provision-clusters.md
[hdinsight-use-mapreduce]: hdinsight-use-mapreduce.md
[hdinsight-use-hive]: hdinsight-use-hive.md
[hdinsight-use-pig]: hdinsight-use-pig.md
[hdinsight-get-started]: hdinsight-hadoop-linux-tutorial-get-started.md
[hdinsight-storage]: ../hdinsight-hadoop-use-blob-storage.md
[hdinsight-admin-powershell]: hdinsight-administer-use-powershell.md

[hdinsight-powershell-reference]: https://msdn.microsoft.com/library/dn858087.aspx

[powershell-install-configure]: powershell-install-configure.md

[image-hdi-gettingstarted-runmrjob]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.RunMRJob.png
[image-hdi-gettingstarted-mrjoboutput]: ./media/hdinsight-submit-hadoop-jobs-programmatically/HDI.GettingStarted.MRJobOutput.png

[apache-hive]: http://hive.apache.org/
