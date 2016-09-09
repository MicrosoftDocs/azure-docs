<properties
   pageTitle="Use Hadoop Pig with .NET in HDInsight | Microsoft Azure"
   description="Learn how to use the .NET SDK for Hadoop to submit Pig jobs to Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=".net"
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="05/04/2016"
   ms.author="larryfr"/>

#Run Pig jobs using the .NET SDK for Hadoop in HDInsight

[AZURE.INCLUDE [pig-selector](../../includes/hdinsight-selector-use-pig.md)]

This document provides an example of using the .NET SDK for Hadoop to submit Pig jobs to a Hadoop on HDInsight cluster.

The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight clusters from .NET. Pig allows you to create MapReduce operations by modeling a series of data transformations. You will learn how to use a basic C# application to submit a Pig job to an HDInsight cluster.

> [AZURE.IMPORTANT] The steps in this document use the Azure Classic Portal. Microsoft does not recommend using the classic portal when creating new services. For an explanation of the advantages of the Azure Portal, see [Microsoft Azure Portal](https://azure.microsoft.com/features/azure-portal/).
>
> This document also includes information on using the HDInsight .NET SDK. The snippets provided are based on commands that use Azure Service Management (ASM) to work with HDInsight and are __deprecated__. These commands will be removed by January 1, 2017.
>
>For a version of this document that uses the Azure portal, along with the HDInsight .NET SDK snippets that use Azure Resource Manager (ARM), see [Run Pig jobs using the .NET SDK for Hadoop in HDInsight](hdinsight-hadoop-use-pig-dotnet-sdk.md)

##<a id="prereq"></a>Prerequisites

To complete the steps in this article, you will need the following.

* An Azure HDInsight (Hadoop on HDInsight) cluster (either Windows or Linux-based)

* Visual Studio 2012 or 2013

##<a id="certificate"></a>Create a management certificate

To authenticate the application to Azure HDInsight, you must create a self-signed certificate, install it on your development workstation, and also upload it to your Azure subscription.

For instructions on how to do this, see [Create a self-signed certificate](http://go.microsoft.com/fwlink/?LinkId=511138).

> [AZURE.NOTE] When creating the certificate, be sure to note the friendly name you use, as it will be used later.

##<a id="subscriptionid"></a>Find your subscription ID

Each Azure subscription is identified by a GUID value, known as the subscription ID. Use the following steps to find this value.

1. Visit the [Azure Management Console](https://manage.windowsazure.com/).

2. From the bar on the left of the portal, select **Settings**.

3. In the information presented on the right of the page, find the subscription you wish to use and note the value in the **Subscription ID** column.

Save the subscription ID, as it will be used later.

##<a id="create"></a>Create the application

1. Open Visual Studio 2012 or 2013 or 2015.

2. From the **File** menu, select **New** and then select **Project**.

3. For the new project, type or select the following values.

	<table>
	<tr>
	<th>Property</th>
	<th>Value</th>
	</tr>
	<tr>
	<th>Category</th>
	<th>Templates/Visual C#/Windows</th>
	</tr>
	<tr>
	<th>Template</th>
	<th>Console Application</th>
	</tr>
	<tr>
	<th>Name</th>
	<th>SubmitPigJob</th>
	</tr>
	</table>

4. Click **OK** to create the project.

5. From the **Tools** menu, select **Library Package Manager** or **Nuget Package Manager**, and then select **Package Manager Console**.

6. Run the following command in the console to install the .NET SDK packages.

		Install-Package Microsoft.Azure.Management.HDInsight.Job -Pre

7. From Solution Explorer, double-click **Program.cs** to open it. Replace the existing code with the following.

		using System;
		using Microsoft.Azure.Management.HDInsight.Job;
		using Microsoft.Azure.Management.HDInsight.Job.Models;
		using Hyak.Common;
		
		namespace HDInsightSubmitPigJobsDotNet
		{
		    class Program
		    {
		        static void Main(string[] args)
		        {
					var ExistingClusterName = "<HDInsightClusterName>";
					var ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
					var ExistingClusterUsername = "<HDInsightClusterHttpUsername>";
					var ExistingClusterPassword = "<HDInsightClusterHttpUserPassword>";
		
		            // The Pig Latin statements to run
		            string queryString = "LOGS = LOAD 'wasbs:///example/data/sample.log';" +
		                "LEVELS = foreach LOGS generate REGEX_EXTRACT($0, '(TRACE|DEBUG|INFO|WARN|ERROR|FATAL)', 1)  as LOGLEVEL;" +
		                "FILTEREDLEVELS = FILTER LEVELS by LOGLEVEL is not null;" +
		                "GROUPEDLEVELS = GROUP FILTEREDLEVELS by LOGLEVEL;" +
		                "FREQUENCIES = foreach GROUPEDLEVELS generate group as LOGLEVEL, COUNT(FILTEREDLEVELS.LOGLEVEL) as COUNT;" +
		                "RESULT = order FREQUENCIES by COUNT desc;" +
		                "DUMP RESULT;";
		
		
		            HDInsightJobManagementClient _hdiJobManagementClient;
		            var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
		            _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);
		
		            // Define the Pig job
		            var parameters = new PigJobSubmissionParameters()
		            {
		                Query = queryString,
		            };
		
		            System.Console.WriteLine("Submitting the Pig job to the cluster...");
		            var response = _hdiJobManagementClient.JobManagement.SubmitPigJob(parameters);
		            System.Console.WriteLine("Validating that the response is as expected...");
		            System.Console.WriteLine("Response status code is " + response.StatusCode);
		            System.Console.WriteLine("Validating the response object...");
		            System.Console.WriteLine("JobId is " + response.JobSubmissionJsonResponse.Id);
		            Console.WriteLine("Press ENTER to continue ...");
		            Console.ReadLine();
		        }
		    }
		}

7. Press **F5** to start the application.
8. Press **ENTER** to exit the application.

##<a id="summary"></a>Summary

As you can see, the .NET SDK for Hadoop allows you to create .NET applications that submit Pig jobs to an HDInsight cluster, monitor the job status, and retrieve the output.

##<a id="nextsteps"></a>Next steps

For general information on Pig in HDInsight.

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information on other ways you can work with Hadoop on HDInsight.

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
