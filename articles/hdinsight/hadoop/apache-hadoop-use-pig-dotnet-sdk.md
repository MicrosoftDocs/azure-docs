---
title: Run Apache Pig jobs with .NET SDK for Hadoop - Azure HDInsight 
description: Learn how to use the .NET SDK for Hadoop to submit Pig jobs to Hadoop on HDInsight.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 05/01/2018
ms.author: jasonh

---
# Run Pig jobs using the .NET SDK for Hadoop in HDInsight

[!INCLUDE [pig-selector](../../../includes/hdinsight-selector-use-pig.md)]

Learn how to use the .NET SDK for Hadoop to submit Apache Pig jobs to Hadoop on Azure HDInsight.

The HDInsight .NET SDK provides .NET client libraries that makes it easier to work with HDInsight clusters from .NET. Pig allows you to create MapReduce operations by modeling a series of data transformations. In this document, you learn how to use a basic C# application to submit a Pig job to an HDInsight cluster.

## Prerequisites

To complete the steps in this article, you need the following.

* An Azure HDInsight (Hadoop on HDInsight) cluster (either Windows or Linux-based).

  > [!IMPORTANT]
  > Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

* Visual Studio 2012, 2013, 2015 or 2017.

## Create the application

The HDInsight .NET SDK provides .NET client libraries, which makes it easier to work with HDInsight clusters from .NET.

1. From the **File** menu in Visual Studio, select **New** and then select **Project**.

2. For the new project, type or select the following values:

   | Property | Value |
   | ------ | ------ |
   | Category | Templates/Visual C#/Windows |
   | Template | Console Application |
   | Name | SubmitPigJob |

3. Click **OK** to create the project.

4. From the **Tools** menu, select **Library Package Manager** or **NuGet Package Manager**, and then select **Package Manager Console**.

5. To install the .NET SDK packages, use the following command:

        Install-Package Microsoft.Azure.Management.HDInsight.Job

6. From Solution Explorer, double-click **Program.cs** to open it. Replace the existing code with the following.

    ```csharp
    using Microsoft.Azure.Management.HDInsight.Job;
    using Microsoft.Azure.Management.HDInsight.Job.Models;
    using Hyak.Common;

    namespace SubmitPigJob
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
                    Query = @"LOGS = LOAD '/example/data/sample.log';
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
    ```

7. To start the application, press **F5**.

8. To exit the application, press **ENTER**.

## Next steps

For information on Pig in HDInsight, see [Use Pig with Hadoop on HDInsight](hdinsight-use-pig.md).

For more information on using Hadoop on HDInsight, see the following documents:

* [Use Hive with Hadoop on HDInsight](hdinsight-use-hive.md)
* [Use MapReduce with Hadoop on HDInsight](hdinsight-use-mapreduce.md)

[preview-portal]: https://portal.azure.com/
