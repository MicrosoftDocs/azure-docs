<properties linkid="manage-services-hdinsight-using-sdk" urlDisplayName="Using the HDInsight SDK" pageTitle="How to use the HDInsight SDK - Windows Azure guidance" metaKeywords="hdinsight sdk, hdinsight .net, hdinsight .net azure" metaDescription="Learn how to use the .Net client SDK for HDInsight." umbracoNaviHide="0" disqusComments="1" writer="sburgess" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

#Using the HDInsight SDK#

The HDInsight SDK provides set of .NET client libraries that makes it easier to work with Hadoop in .NET. The SDK includes following components:

- 	A Map/Reduce library - this library simplifies writing map/reduce jobs in .NET languages using the Hadoop streaming interface
- 	LINQ to Hive client library – this library translates C# or F# LINQ queries into Hive queries and executes them on the Hadoop cluster. This library can execute arbitrary Hive HQL queries from a .NET program as well.
- 	WebClient library – contains client libraries for WebHDFS and WebHCat
	- 	WebHDFS client library – works with files in HDFS and Blog Storage
	- WebHCat client library – manages scheduling and execution of jobs in Hadoop cluster

In this tutorial you will learn how to get the SDK and use it to build simple .NET based Hadoop program.

##Downloading and Installing the SDK##

You can install latest published build of the SDK from NuGet. Use the NuGet package manager to install components of the SDK that you need:

1. In Visual Studio 2012, click Tools > Library Package Manager > Package Manager Console.
2. Install the NuGet packages using the following commands in the console:

		install-package Microsoft.Hadoop.MapReduce –pre
		install-package Microsoft.Hadoop.Hive -pre 
		install-package Microsoft.Hadoop.WebClient -pre 

These commands add .NET libraries and references to them to your current Visual Studio project.

##Executing Hive jobs on HDInsight cluster from .Net program##

Once the Hadoop SDK packages are installed you can start building your Hadoop program. In this chapter you’ll learn how to upload files to Hadoop cluster programmatically and how to execute Hive jobs using LINQ to Hive.

1. Create a new empty Console Application Project in Visual Studio 2012.
2. Install the NuGet packages for Hive (Microsoft.Hadoop.Hive) and WebClient (Microsoft.Hadoop.WebClient) as described in the “Download and Install the SDK” section. 
3. Download the sample file actors.txt using this [download](http://go.microsoft.com/fwlink/?LinkID=286223) link and store it locally on your hard drive.
4. In the Main method of the console application add the code below. This code uploads the actors.txt file to the Hadoop cluster using WebHDFS client.

            // Upload actors.txt to Blob Storage
            var asvAccount = "Blob Storage account name";
            var asvKey = "Blob Storage account key";

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

		* asvAccount and asvKey variables contain name and key of the public Blob Storage account that is configured as storage for your HDInsight cluster. Specify values for these variables according to your cluster configuration.
		* container variable specifies default container name in Blob Storage. Specify values for these variable according to your cluster configuration.

5. After the file is uploaded you can create Hive table based on the file. The next code snippet uses LINQ to Hive ExecuteHiveQuery command to execute Hive DDL statement to do it. Append this code to the Main method.

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

		* the webHCatUri parameter specifies the Uri to the HCatalog web service end-point of the Hadoop cluster. If you are connecting to remote HDInsight cluster replace the localhost Uri with the Uri of the remote cluster.
		* userName and password parameters are the login information for the Hadoop cluster. Default values for one box installation of a Hadoop cluster are specified in the sample. If you are connecting to remote HDInsight cluster update values with login information of your cluster.

6. Now you can run Hive query against newly created table. In this sample we will do this by using ExecuteQuery method to run HQL query directly. LINQ to Hive also supports Linq query syntax as its name implies, but demonstrating this functionality is left out of scope for this article. The code queries for the actor who has the most number of awards and prints the result in a console window. Append this code to the Main method.

            var result = db.ExecuteQuery("select name, awardscount
                              from actors sort by awardscount desc
                              limit 1");
            result.Wait();
            Console.WriteLine(result.Result.ReadToEnd());

## See Also
* [How to: Use Blob Storage](/en-us/manage/services/hdinsight/howto-blob-store/)
	
* [How to: Execute Remote Jobs](/en-us/manage/services/hdinsight/howto-execute-remote-job/)
