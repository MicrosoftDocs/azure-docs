<properties linkid="manage-hdinsight-administration" urlDisplayName="HDInsight Administration" pageTitle="How to administer HDInsight - Windows Azure guidance" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to perform administrative tasks for the HDInsight service." metaCanonical="http://www.windowsazure.com/en-us/manage/hdinsight/administer-hdinsight" umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="mollybos" manager="paulettm" />

# How to Administer HDInsight

In this topic, you will learn how to create an HDInsight cluster, and how to open the administrative tools.

Table of Contents

* How to: Create a HDInsight cluster
* How to: Open the interactive JavaScript console
* How to: open the Hadoop command console

## How to: Create a HDInsight cluster
Azure Vault Storage (ASV) provides a full featured HDFS file system over Windows Azure Blob storage. ASV is the default file system for HDInsight. A Windows Azure storage account is required before you can create a HDInsight cluster. For information on creating a Windows Azure storage account, see [How to Create a Storage Account](http://www.windowsazure.com/en-us/manage/services/storage/how-to-create-a-storage-account/).

	Important: Currently HDInsight is only available in the US East data center, so you must specify the US East location when creating your storage account.

1. Sign in to the [Management Portal](http://manage.windowsazure.com).
2. Click **+ NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **QUICK CREATE**.

	When choosing **CUSTOM CREATE**, you need to specify the following properties:

	<table border=1>
		<tr><th>Page</th><th>Fields</th></tr>
		<tr><td>Cluster Details</td>
			<td>Cluster Name
				<ul>
				<li>DNS name must start and end with alpha numeric, may contain dashes.</li>
				<li>The field must be a string between 3 to 63 characters.</li>
				</ul>
				Task Nodes: specify the number of task notes in the cluster
				<ul>
				</ul>
			</td>
		</tr>
		<tr><td>Configure Admin</td>
			<td>Admin Account Name<br />
				Admin Password</td>
		</tr>
		<tr><td>Storage Account</td>
			<td>Storage Account<br />
				Storage Container</td>
		</tr>
	
	</table>
3. Provide **Cluster Name**, **Cluster Size**, **Cluster Admin Password**, and a Windows Azure **Storage Account**, and then click **Create HDInsight Cluster**. Once the cluster is created and running, the status shows *Running*.

	![HDI.QuickCreate](../media/HDI.QuickCreate.PNG "Quick Create Cluster")

	The default name for the administrator's account is *admin*. To give the account a different name, you can use the *custom create* option instead of *quick create*.

	When using the quick create option to create a cluster, a new container with the name of the HDInsight cluster is created automatically in the storage account specified. If you want to customize the name, you can use the custom create option.

	Important: Once a Windows Azure storage account is chosen for your HDInsight cluster, you can neither delete the account, nor change the account to a different account.

4. Click the newly created cluster.  It shows the summary page:

	![HDI.ClusterSummary](../media/HDI.ClusterSummary.PNG "Cluster summary page")

5. Click either the Go to cluster link, or Start Dashboard on the bottom of the page to open HDInsight Dashboard.

	![HDI.Dashboard](../media/HDI.Dashboard1.PNG "HDInsight Cluster DashBoard")


## How to: Open the interactive JavaScript console
Windows Azure HDInsight Service comes with a web based interactive JavaScript console that can be used as an administration/deployment tool. The console evaluates simple JavaScript expressions. It also lets you run HDFS commands.

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **HDINSIGHT**. You shall see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to upload data to.
4. From HDInsight Dashboard, click the cluster URL.
5. Enter **User name** and **Password** for the cluster, and then click **Log On**.
6. Click **Interactive Console**.

	![HDI.TileInteractiveConsole](../media/HDI.TileInteractiveConsole.PNG "Interactive Console")

7. From the Interactive JavaScript console, type the following command to get a list of supported command:
	
		help()

	![HDI.InteractiveJavaScriptConsole](../media/HDI.InteractiveJavaScriptConsole.PNG "Interactive JavsScript Console")

	To run HDFS commands, use # in front of the commands.  For example:

		#lsr /

## How to: Open the Hadoop command line

To use Hadoop command line, you must first connect to the cluster using remote desktop. 

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **HDINSIGHT**. You shall see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to upload data to.
4. Click **Connect** on the bottom of the page.
5. Click **Open**.
6. Enter your credentials, and then click **OK**.  Use the username and password you configured when you created the cluster.
7. Click **Yes**.
8. From Desktop, double-click **Hadoop Command Line**.
		
	![HDI.HadoopCommandLine](../media/HDI.HadoopCommandLine.PNG "Hadoop command line")


	For more information on Hadoop command, see [Hadoop commands reference](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/CommandsManual.html).


## See Also
* [How to: Monitor HDInsight](/en-us/manage/services/hdinsight/monitor-hdinsight/)
	
* [How to: Upload data to HDInsight](/en-us/manage/services/hdinsight/using-mapreduce/upload-data)