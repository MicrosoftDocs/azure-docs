<properties
   pageTitle="Use Hadoop Pig with .NET in HDInsight | Microsoft Azure"
   description="Learn how to use the .NET SDK for Hadoop to submit Pig jobs to Hadoop on HDInsight."
   services="hdinsight"
   documentationCenter=".net"
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"
   tags="azure-portal"/>

<tags
   ms.service="hdinsight"
   ms.devlang="dotnet"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="06/17/2016"
   ms.author="larryfr"/>

#Run Pig jobs using the .NET SDK for Hadoop in HDInsight

[AZURE.INCLUDE [pig-selector](../../includes/hdinsight-selector-use-pig.md)]

This document provides an example of using the .NET SDK for Hadoop to submit Pig jobs to a Hadoop on HDInsight cluster.

The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight clusters from .NET. Pig allows you to create MapReduce operations by modeling a series of data transformations. You will learn how to use a basic C# application to submit a Pig job to an HDInsight cluster.

[AZURE.INCLUDE [azure-portal](../../includes/hdinsight-azure-portal.md)]

* [Run Pig jobs using the .NET SDK for Hadoop in HDInsight](hdinsight-hadoop-use-pig-dotnet-sdk-v1.md)

## Prerequisites

To complete the steps in this article, you will need the following.

* An Azure HDInsight (Hadoop on HDInsight) cluster (either Windows or Linux-based).
* Visual Studio 2012 or 2013 or 2015.

## Create the application

The HDInsight .NET SDK provides .NET client libraries, which makes it easier to work with HDInsight clusters from .NET. 


1. Open Visual Studio 2012 or 2013
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

        Install-Package Microsoft.Azure.Management.HDInsight.Job

7. From Solution Explorer, double-click **Program.cs** to open it. Replace the existing code with the following.

        using Microsoft.Azure.Management.HDInsight.Job;
        using Microsoft.Azure.Management.HDInsight.Job.Models;
        using Hyak.Common;

        namespace SubmitHDInsightJobDotNet
        {
            class Program
            {
                private static HDInsightJobManagementClient _hdiJobManagementClient;

                private const string ExistingClusterName = "<Your HDInsight Cluster Name>";
                private const string ExistingClusterUri = ExistingClusterName + ".azurehdinsight.net";
                private const string ExistingClusterUsername = "<Cluster Username>";
                private const string ExistingClusterPassword = "<Cluster User Password>";

                static void Main(string[] args)
                {
                    System.Console.WriteLine("The application is running ...");

                    var clusterCredentials = new BasicAuthenticationCloudCredentials { Username = ExistingClusterUsername, Password = ExistingClusterPassword };
                    _hdiJobManagementClient = new HDInsightJobManagementClient(ExistingClusterUri, clusterCredentials);

                    SubmitPigJob();

                    System.Console.WriteLine("Press ENTER to continue ...");
                    System.Console.ReadLine();
                }

                private static void SubmitPigJob()
                {
                    var parameters = new PigJobSubmissionParameters
                    {
                        Query = @"LOGS = LOAD 'wasbs:///example/data/sample.log';
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
            }
        }


7. Press **F5** to start the application.
8. Press **ENTER** to exit the application.

## Summary

As you can see, the .NET SDK for Hadoop allows you to create .NET applications that submit Pig jobs to an HDInsight cluster, and monitor the job status.

## Next steps

For general information on Pig in HDInsight.

* [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md)

For information on other ways you can work with Hadoop on HDInsight.

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)

* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)
[preview-portal]: https://portal.azure.com/
