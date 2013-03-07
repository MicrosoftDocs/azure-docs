<properties linkid="manage-hdinsight-using-sdk" urlDisplayName="Using the HDInsight SDK" pageTitle="How to use the HDInsight SDK - Windows Azure guidance" metaKeywords="hdinsight sdk, hdinsight .net, hdinsight .net azure" metaDescription="Learn how to use the .Net client SDK for HDInsight." metaCanonical="http://www.windowsazure.com/en-us/manage/hdinsight/using-hdinsight-sdk" umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

#Using the HDInsight SDK

HDInsight SDK provides set of .Net client libraries that makes it easier to work with Hadoop in .Net. The SDK includes following components:

	•	Map/Reduce library - simplifies writing map/reduce jobs in .Net languages using Hadoop Streaming interface.
	•	Linq to Hive client library – translates C# or F# Linq queries into Hive queries and executes them on Hadoop cluster. This library can execute arbitrary Hive HQL queries from .Net program as well.
	•	WebClient library – contains client libraries for WebHDFS and WebHCat.
		o	WebHDFS client library – works with files in HDFS and ASV file systems.
		o	WebHCat client library – manages scheduling and execution of jobs in Hadoop cluster.

In this tutorial you’ll learn how to get SDK and use it to build simple .Net Hadoop program.

##Table of Contents

	* Downloading and installing SDK
	* Executing Hive jobs on HDInsight cluster from .Net program

###Downloading and installing SDK
You can install latest published build of the SDK from NuGet. Use NuGet package manager to install components of the SDK that you need:

1. In Visual Studio 2012 menu, click on Tools > Library Package Manager > Package Manager Console.
2. Install NuGet packages using following commands in the console:

		install-package Microsoft.Hadoop.MapReduce –pre
		install-package Microsoft.Hadoop.Hive -pre 
		install-package Microsoft.Hadoop.WebClient -pre 

These commands add .Net libraries and references to them into your current Visual Studio project.

###Executing Hive jobs on HDInsight cluster from .Net program
Once Hadoop SDK packages are installed you can start building your Hadoop program. In this chapter you’ll learn how to upload files to Hadoop cluster programmatically and how to execute Hive jobs using Linq to Hive.

1. Create new empty Console Application Project in Visual Studio 2012.
2. Install NuGet packages for Hive and WebClient as described in the “Download and install SDK” section.
3. Download sample file actors.txt using this [link](./Actors.txt) and store it locally on your hard drive.
4. In the Main method of the console application add code below. This code uploads actors.txt file to Hadoop cluster using WebHDFS client.

            // Upload actors.txt to ASV store in Hadoop cluster
            var asvAccount = "ASV storage account name";
            var asvKey = "ASV storage account key";

            var adapter = new BlobStorageAdapter(
                                asvAccount, asvKey);
            var container = "default";
            adapter.Connect(container, true);

            var client = new WebHDFSClient(adapter);
            client.CreateDirectory(
                  "/user/hadoop/MovieData").Wait();
            client.CreateFile(
                  "C:/code/MovieData/Actors.txt",
                  "/user/hadoop/MovieData/Actors.txt").Wait();

		* asvAccount and asvKey variables contain name and key of the public Azure Blob storage that is configured as storage for your HDInsight cluster (also referred to as ASV account). Specify values for these variables according to your cluster configuration.
		* container variable specifies default container name in ASV storage. Specify values for these variable according to your cluster configuration.

5. After the file is uploaded you can create Hive table based on the file. Next code snippet uses Linq to Hive ExecuteHiveQuery command to execute Hive DDL statement to do it. Append this code to the Main method.

            // Create Hive table from actors.txt
            var db = new HiveConnection(
              webHCatUri: "http://localhost:50111",
              userName: "hadoop", password: null,
              storageAccount: asvAccount, storageKey: asvKey);
            db.GetTable<HiveRow>("Actors").Drop();

            string command = 
              @"CREATE TABLE Actors(
                    MovieId string, ActorId string,
                    Name string, AwardsCount int) 
                  row format delimited 
                  fields terminated by ',';
                LOAD DATA INPATH 
                    '/user/hadoop/MovieData/Actors.txt'
                  OVERWRITE INTO TABLE Actors;";
            db.ExecuteHiveQuery(command).Wait();

		* webHCatUri parameter specifies Uri to the HCatalog web service end-point of the Hadoop cluster. The cluster can be one box installation of HDInsight on your local machine as specified in the sample or it can be remote Azure cluster. If you are connecting to remote Azure cluster replace localhost Uri with Uri of the remote cluster.
		* userName and password parameters are login information for Hadoop cluster. Default values for one box installation of Hadoop cluster are specified in the sample. If you are connecting to remote Azure cluster update values with login information of your cluster.

6. Now you can run Hive query against newly created table. In this sample we’ll do this by using ExecuteQuery method to run HQL query directly. Linq to Hive also supports Linq query syntax as its name implies, but demonstrating this functionality is left out of scope for this article. The code queries for actor who has most number of awards and prints result in console window. Append this code to the Main method.

            var result = db.ExecuteQuery("select name, awardscount
                              from actors sort by awardscount desc
                              limit 1");
            result.Wait();
            Console.WriteLine(result.Result.ReadToEnd());
