<properties linkid="manage-services-hdinsight-get-started-hdinsight" urlDisplayName="Getting Started" pageTitle="Getting Started with HDInsight - Windows Azure tutorial" metaKeywords="hdinsight, hdinsight service, hdinsight azure, getting started hdinsight" metaDescription="Learn how to use the Windows Azure HDInsight service." umbracoNaviHide="0" disqusComments="1" writer="bradsev" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# Getting Started with Windows Azure HDInsight Service

This tutorial gets you started using Windows Azure HDInsight Services. You get set up with Windows Azure and Azure Storage Vault accounts, learn how to provision an HDInsight cluster, and how to run a MapReduce job on it. Then you use the Interactive JavaScript Console to view the output from the job.

To itemize, you learn:

* To obtain a Windows Azure account and enable the HDInsight features
* To create and configure an Azure Vault Storage (ASV) account
* To provision an HDInsight cluster from the Windows Azure portal
* To navigate to and around the HDInsight Services dashboard  
* To run a sample MapReduce program
* To using the Interative Console to examine the output from a MapReduce program 


##Obtain a Windows Azure Account and Enable HDInsight

To complete this tutorial, you need a Windows Azure account that has the Windows Azure Web Sites Feature enabled. You can create a free trial account and enable the preview features in a couple of minutes. For details, see [Create a Windows Azure Account and Enable Preview Features](http://www.windowsazure.com/en-us/develop/php/tutorials/create-a-windows-azure-account/ "Create an Azure Account").

**ToDo**: Add specifics about enabling HDI Preview Feature when available.(Shayne's Wed 2/27/2013 7:45 AM email)

##Create a Windows Azure Storage Vault Account
To complete this tutorial, you need an Azure Storage Vault (ASV) account. For instructions on how to create one, see
[How to Create an Azure Storage Vault Account](http://www.windowsazure.com/en-us/manage/services/storage/how-to-create-a-storage-account/ "CreateAnAsvAccount").

(**ToDo**: Confirm that WordCount sample can run without manually uploading the DaVinci text to the the ASV account. Have not tested with a new ASV as unable to use the HDI portal to create a storage account that is not "disabled". But status is "Online".)

##Provision an Hadoop Cluster with HDInsight
This section walks you through the steps to create and configure a new Hadoop Cluster. 

- Log into your Windows Azure account and go to the Windows Azure portal. 

- Click on the **HDInsight** icon on the left side scroll bar of the portal (highlighted in yellow below) to list the status of the clusters in your account. (The list will be empty if this is the first time you have used HDInsight Services.)

![HDI.ClusterStatus](..media/HDI.ClusterStatus.PNG?raw=true "HDInsight Cluster Management")

- To add a new cluster, click on the **+NEW** icon on the lower left side (circled in red above). This launches the **NEW HDINSIGHT CLUSTER** wizard. Click on the **Quick Create** option on the right side.

![HDI.QuickCreateCluster](..media/HDI.QuickCreateCluster.PNG?raw=true "Quick Create Cluster")

- Enter a name for the cluster ("_Sample-Cluster_" in the example below) and the number of data nodes you want to deploy. The default value is 4. But 8, 16 and 32 data node clusters are also avaliable on the dropdown menu. Any number of data nodes may be specified when using the **Custom Create** option. Pricing details on the billing rates for various cluster sizes are available. Click the **?** symbol just above the dropdown box and follow the link on the pop up.  

-  Note that the cluster user name is specified to be _admin_ by default when using the Quick Create option. This can only be changed by using the **Custom Create** wizard.

- Enter a password for the cluster user. The password field must be at least 10 characters and must contain an uppercase letter, a lowercase letter, a number, and a special character.

- Select a key from the ASV storage acount that you want to associate with this cluster from the dropdown box. Note that once this choice is made, it cannot be changed. If the storage account is removed, the cluster will no longer be available for use.

- Click the **CREATE HDINSIGHT CLUSTER** check mark icon on the lower left. The cluster is now provisioned and when it will be available when its status is listed as **Running** in the Azure portal.

![HDI.NewClusterStatusRunning](..media/HDI.NewClusterStatusRunning.PNG?raw=true "New Cluster Status Running")

##The HDInsight dashboard

This section explains how to get to the HDInsight and 

- To get to the (**ToDo**: name - not the cluster?) dashboard, click on the name of the HDInsight cluster in the first column of the table on the Windows Azure portal. 
- The dashboard provides quick glance of the metadata for the cluster. Note that it provides the URL for the cluster at the top and the cluster user name (_admin_) at the bottom. 

- To go to the cluster, either click its URL or the **START DASHBOARD** icon on the lower right.

![HDI.Dashboard](..media/HDI.Dashboard.PNG?raw=true "Dashboard")

- When prompted for credentials on the **Log On** page, the **User name** needed is the cluster user name for the (not the cluster name), which was provided on the bottom of the previous dashboard: _admin_. 

- The **Password** it expects is the one you created for this the cluster (not the Windows Azure password).

![HDI.LogOn](..media/HDI.LogOn.PNG?raw=true "Log On Page")

- Click the Log On button to get to the Windows Azure HDInsight page (ToDo: OR dashboard?  

![HDI.WinAzureHDI](..media/HDI.WinAzureHDI.PNG?raw=true "Windows Azure HDInsight")

There are seven green tiles in the section for **Your Cluster**:

- **Interactive Console**: The interactive console provided by Microsoft to simplify configuring and running Hadoop jobs and interacting with the deployed clusters. This simplified approach using JavaScript and Hive consoles enables IT professionals and a wider group of developers to deal with big data management and analysis by providing an accessible path into the Hadoop framework.

- **Remote Cluster**: Enables remoting into the Hadoop cluster.

- **Monitor Cluster**: Provides monitoring .

- **Job History**: Records the jobs that have been run on your cluster.

- **Samples**: Provides links to the samples that ship with HDInsight and can be run directly from the HDInsight interface.

- **Downloads**: Downloads for Hive ODBC driver and Hive Add-in for Excel that enable Hadoop integration with Microsoft BI Solutions. Connect Excel to the Hive data warehouse framework in the Hadoop cluster via the Hive ODBC driver to access and view data in the cluster.

- **Documentation**: Provides links to HDInsight documentation.

The Your Tasks section initially has one purple tile.

- **Create Job**: Create Job UI for running MapReduce programs using Hadoop jar files.

But new tiles are added to indicate which jobs have been completed.

Click on the **Samples** tile to go to the **Hadoop Sample Gallery**.

![HDI.SampleGallery](..media/HDI.SampleGallery.PNG?raw=true "Sample Gallery")

HDInsight ships with five samples, which, with one exception (the Sqoop sample) can be run directly from the dashboard.

- **The Hadoop on Azure 10-GB Graysort Sample**: This tutorial shows how to run a general purpose GraySort on a 10 GB file using Hadoop on Windows Azure. 

- **The Hadoop on Azure Pi Estimator Sample**: 
This tutorial shows how to deploy a MapReduce program with Hadoop on Windows Azure that uses a statistical (quasi-Monte Carlo) method to estimate the value of Pi.

- **The Hadoop on Azure Wordcount Sample**: This tutorial shows two ways to use Hadoop on Windows Azure to run a MapReduce program that counts word occurences in a text.

- **The Hadoop on Azure C# Streaming Sample**:This tutorial shows how to use C# programs with the Hadoop streaming interface. 

- **The Hadoop on Azure Sqoop Import/Export Sample**: This tutorial shows how to use Sqoop to import and export data from a SQL database on Windows Azure to an Hadoop on Windows Azure HDFS cluster.

##Run a MapReduce Job in HDInsight

There are two ways to run Hadoop MapReduce programs jobs on HDInsight. 

- First, with a Hadoop jar file using the **Create Job** UI. 

- Second, with a query using the fluent API layered on Pig that is provided by the **Interactive Console**. 

This section illustrates the first approach using the WordCount sample that ships with HDInsight. The sample contains MapReduce programs written in Java that count word occurences in a text. The text file analyzed is the Project Gutenberg eBook edition of The Notebooks of Leonardo Da Vinci. The  program outputs the the total number of occurences of each word in a text file. 

**The WordCount MapReduce Programs**  

The Hadoop MapReduce programs use by the WordCount sample read the document in the text file and count how often each word occurs. The input is just the text file. The output is a new text file consisting of lines, each of which contains a word and the count (a key/value tab-separated pair) of how often that word occurred in the document. This is done in two stages. The mapper (the cat.exe in this sample) takes each line from the input text as an input and breaks it into words. It emits a key/value pair each time a work occurs of the word followed by a 1. The reducer (the wc.exe in this sample) then sums these individual counts for each word and emits a single key/value pair containing the word followed by the sum of its occurences.

**Run the Wordcount sample** 

 - Click on the **WordCount** sample icon in the Hadoop Sample Gallery to bring up the deployment page for the sample.

![HDI.WordCountSampleDeployment](..media/HDI.WordCountSampleDeployment.PNG?raw=true "WordCount Sample Deployment")

- On the Wordcount deployment page, information is provided about the application and downloads are available for Java MapReduce programs, the input text, and the jar files that contains the files needed by Hadoop on Azure to deploy the application. The java code can be inspected on this page by scrolling down into the **Details** section. Click on the **Deploy to your cluster** button on the right-hand side of the page to begin the deployment.

- This brings up the **Create Job** page for the Wordcount sample. 

![HDI.CreateWordCountJob](..media/HDI.CreateWordCountJob.PNG?raw=true "Create WordCount Job")

- The job name and parameters have been assigned default values that will run the WordCount job.The **Job Name** is "WordCount". **Parameter0** is just the name of the program, "wordcount". **Parameter1** specifies, respectively, the path/name of the input file (asv:///example/data/gutenberg/davinci.txt) and the output directory where the results will be saved (asv:///DaVinciAllTopWords). Note that the output directory assumes a default path relative to the asv:///user/&lt;username&gt; folder. (**ToDo**: confirm this last statement.) Note the use of the asv:// prefix in the paths of these files. This is needed to indicate the Azure Storage Vault is being used for input and output files.

- The **Final Command** contains the Hadoop jar command that executes the MapReduce program with the parameter values provided above. See the documentation on [jar syntax ](http://hadoop.apache.org/common/docs/current/commands_manual.html#jar) for details. 

- To run the program with these default values on your Hadoop cluster, simply click on the blue **Execute job** button on the lower right side.

- The status of the deployment is provided on the **Job Info** page and it will indicate when the program has completed, as shown here. (**ToDo**: ask why I am having to hit F5 to see the completed status - a bug?)

![HDI.WordCountSampleCompleted](..media/HDI.WordCountSampleCompleted.PNG?raw=true "WordCount Sample Completed")

##Examinging Output in the Interactive Console

We can use the JavaScript Interactive Console to view the output from the WordCount job. 


- To get to the Interactive JavaScript console, return to your tiled Windows Azure HDInsight page. In the **Your Cluster** section and click on the **Interactive Console** tile to bring up the Interactive JavaScript console.

- To confirm that you have the part-r-00000 output file in the DavinciAllTopWords folder that contains the results, enter the command `file = fs.read("asv:///DaVinciAllTopWords")` in the console check that this file is there.

![HDI.JSConsole1](..media/HDI.JSConsole1.PNG?raw=true "JavaScript Console Output")

- To view the word counts, enter the command `file = fs.read("asv:///DaVinciAllTopWords")` in the console prompt. It is a large file. Scroll up to see the long list of words and their summmary counts.
 
## Summary

You have gotten set up with a Windows Azure and Azure Storage Vault accounts needed to access HDInsight Sevices. You have learnt how to provision an HDInsight cluster, ran a MapReduce job on it, and used the Interactive Console to view the output from the job.

## Next steps

- For other uses of HDInsight interactive JavaScript and Hive consoles, see the [The Windows Azure HDInsight Interactive JavaScript and Hive Consoles](ToDo: URL "InteractiveConsole")
