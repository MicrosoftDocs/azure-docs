<properties linkid="manage-services-hdinsight-howto-administer-hdinsight" urlDisplayName="HDInsight Administration" pageTitle="How to administer HDInsight - Windows Azure Services" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to perform administrative tasks for the HDInsight service." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="mollybos" manager="paulettm" />

<div chunk="../chunks/hdinsight-left-nav.md" />

# How to Administer HDInsight

In this topic, you will learn how to create an HDInsight cluster, and how to open the administrative tools.

##Table of Contents

* [How to: Create a HDInsight cluster](#create)
* [How to: Open the interactive JavaScript console](#jsconsole)
* [How to: open the Hadoop command console](#hadoopcmd)

##<a id="create"></a> How to: Create a HDInsight cluster

A Windows Azure storage account is required before you can create a HDInsight cluster. HDInsight uses Windows Azure Blob Storage to store data. For information on creating a Windows Azure storage account, see [How to Create a Storage Account](http://www.windowsazure.com/en-us/manage/services/storage/how-to-create-a-storage-account/).

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **+ NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **QUICK CREATE**.

	When choosing **CUSTOM CREATE**, you need to specify the following properties:

	<table border='1'>
		<tr><th>Page</th><th>Fields</th></tr>
		<tr><td>Cluster Details</td>
			<td>Cluster Name
				<ul>
				<li>DNS name must start and end with alpha numeric, may contain dashes.</li>
				<li>The field must be a string between 3 to 63 characters.</li>
				</ul>
				<p>Data Nodes: specify the number of notes in the cluster</p>
				<ul>
				</ul>
			</td>
		</tr>
		<tr><td>Configure Cluster User</td>
			<td>User Name<br />
				Password</td>
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

5. Click **Manage Cluster** on the bottom of the page.
6. Provide the cluster **user name** and **password**, and then click **Log On**.  The default administer username is *admin*.

	![HDI.Dashboard](../media/HDI.Dashboard1.PNG "HDInsight Cluster DashBoard")


##<a id="jsconsole"></a> How to: Open the interactive JavaScript console
Windows Azure HDInsight Service comes with a web based interactive JavaScript console that can be used as an administration/deployment tool. The console evaluates simple JavaScript expressions. It also lets you run HDFS commands.

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **HDINSIGHT**. You will see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to upload data to.
4. Click **Manage Cluster** on the bottom of the page.
5. Enter **User name** and **Password** for the cluster, and then click **Log On**.
6. Click **Interactive Console**.

	![HDI.TileInteractiveConsole](../media/HDI.TileInteractiveConsole.PNG "Interactive Console")

7. From the Interactive JavaScript console, type the following command to get a list of supported commands:
	
		help()

	![HDI.InteractiveJavaScriptConsole](../media/HDI.InteractiveJavaScriptConsole.PNG "Interactive JavsScript Console")

	To run HDFS commands, use # in front of the commands.  For example:

		#lsr /

##<a id="hadoopcmd"></a> How to: Open the Hadoop command line

To use Hadoop command line, you must first connect to the cluster using remote desktop. 

1. Sign in to the [Management Portal](https://manage.windowsazure.com).
2. Click **HDINSIGHT**. You will see a list of deployed Hadoop clusters.
3. Click the Hadoop cluster where you want to upload data to.
4. Click **Connect** on the bottom of the page.
5. Click **Open**.
6. Enter your credentials, and then click **OK**.  Use the username and password you configured when you created the cluster.
7. Click **Yes**.
8. From the desktop, double-click **Hadoop Command Line**.
		
	![HDI.HadoopCommandLine](../media/HDI.HadoopCommandLine.PNG "Hadoop command line")


	For more information on Hadoop command, see [Hadoop commands reference](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/CommandsManual.html).


## See Also
* [How to: Monitor HDInsight](/en-us/manage/services/hdinsight/howto-monitor-hdinsight/)
* [How to: Deploy an HDInsight Cluster Programmatically](/en-us/manage/services/hdinsight/howto-deploy-cluster/)
* [How to: Execute Remote Jobs on Your HDInsight Cluster Programmatically](/en-us/manage/services/hdinsight/howto-execute-jobs-programmatically/)
* [Tutorial: Getting Started with Windows Azure HDInsight Service](/en-us/manage/services/hdinsight/get-started-hdinsight/)
