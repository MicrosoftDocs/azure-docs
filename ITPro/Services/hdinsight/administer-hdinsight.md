<properties linkid="manage-services-hdinsight-howto-administer-hdinsight" urlDisplayName="HDInsight Administration" pageTitle="How to administer HDInsight using the management portal - Windows Azure" metaKeywords="hdinsight, hdinsight administration, hdinsight administration azure" metaDescription="Learn how to perform administrative tasks for the HDInsight service from the management portal." umbracoNaviHide="0" disqusComments="1" writer="jgao" editor="cgronlun" manager="paulettm" />

# Administer HDInsight clusters using management portal

In this topic, you will learn how to use the Windows Azure Management portal to create an HDInsight cluster, and how to open the administrative tools. For more information on administering HDInsight using the Cross-platform Command-line Tools, see [How to Administer HDInsight Using Cross-platform Command-line Interface][hdinsight-admin-cross-platform]. For more information on administering HDInsight using Windows Azure PowerShell, see [How to Administer HDInsight Using PowerShell][hdinsight-admin-powershell].

**Prerequisites:**

Before you begin this article, you must have the following:

- A Windows Azure subscription. Windows Azure is a subscription-based platform. The HDInsight PowerShell cmdlets perform the tasks with your subscription. For more information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].

##In this article

* [Create an HDInsight cluster](#create)
* [Enable remote desktop access](#enablerdp)
* [Open Hadoop command console](#hadoopcmd)
* [Next steps](#nextsteps)

##<a id="create"></a> Create an HDInsight cluster

A Windows Azure storage account located on the same data center is required before you can create an HDInsight cluster. HDInsight cluster uses a Windows Azure Blob Storage container as the default file system. For more information, see [Using Windows Azure Blob Storage with HDInsight][hdinsight-storage]. For details on creating a Windows Azure storage account, see [How to Create a Storage Account][azure-create-storageaccount].


**To create an HDInsight cluster**

1. Sign in to the [Windows Azure Management Portal][azure-management-portal].
2. Click **+ NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **QUICK CREATE**.

3. Provide **Cluster Name**, **Cluster Size**, **Cluster Admin Password**, and a Windows Azure **Storage Account**, and then click **Create HDInsight Cluster**. Once the cluster is created and running, the status shows *Running*.

	![HDI.QuickCreate][image-cluster-quickcreate]

	The default name for the administrator's account is *admin*. To give the account a different name, you can use the *custom create* option instead of *quick create*.

	When using the quick create option to create a cluster, a new container with the name of the HDInsight cluster is created automatically in the storage account specified. If you want to customize the name, you can use the custom create option.

	<div class="dev-callout"> 
	<b>Important</b> 
	<p>Once a Windows Azure storage account is chosen for your HDInsight cluster, the only way to change the storage account is to delete and create another cluster.</p> 
	</div>

4. Click the newly created cluster.  It shows the landing page:

	![HDI.ClusterLanding][image-cluster-landing]


##<a id="enablerdp"></a> Enable remote desktop

This session only applies HDInsight cluster version 2.1.

The credentials provided at cluster creation now give access only to the services on the cluster, not remote desktop. Remote Desktop will be off by default and will require post creation configuration to turn on.

**To enable remote desktop**

1. Sign in to the [Windows Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed Hadoop clusters.
3. Click the HDInsight cluster that you want to connect to.
4. From the top of the page, click **CONFIGURATION**.
5. From the bottom of the page, click **ENABLE REMOTE**.
6. Enter **USER NAME**, **PASSWORD**, and **EXPIRED ON**, and then click the check icon.

	![HDI.CreateRDPUser][image-hdi-create-rpd-user]

	The expiration date must be in the future, and at most seven days from now. And the time is the midnight of the selected date.

	Once the remote access is enabled. The portal adds a **CONNECT** button and a **DISABLE REMOTE** button on the bottom of the CONFIGURATION page.


##<a id="hadoopcmd"></a> Open Hadoop command line

To use Hadoop command line, you must first enable remote desktop on the cluster and then connect to the cluster using remote desktop. 

**To open Hadoop command line**

1. Sign in to the [Windows Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed Hadoop clusters.
3. Click the HDInsight cluster that you want to connect to.
3. Click **CONFIGURATION** on the top of the page.
4. Click **Connect** on the bottom of the page.
5. Click **Open**.
6. Enter your credentials, and then click **OK**.  Use the username and password you configured when you created the cluster.
7. Click **Yes**.
8. From the desktop, double-click **Hadoop Command Line**.
		
	![HDI.HadoopCommandLine][image-hadoopcommandline]


	For more information on Hadoop command, see [Hadoop commands reference][hadoop-command-reference].


##<a id="nextsteps"></a> Next steps
In this article, you have learned how to create an HDInsight cluster using the Windows Azure Management Portal, and how to open the Hadoop command line tool. To learn more, see the following articles:

* [Administer HDInsight Using PowerShell][hdinsight-admin-powershell]
* [Administer HDInsight Using Cross-platform Command-line Interface][hdinsight-admin-cross-platform]
* [Monitor HDInsight][hdinsight-monitor]
* [Provision HDInsight clusters][hdinsight-provision]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Getting Started with Windows Azure HDInsight Service][hdinsight-getting-started]


[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-monitor]: /en-us/manage/services/hdinsight/howto-monitor-hdinsight/
[hdinsight-admin-cross-platform]: /en-us/manage/services/hdinsight/administer-hdinsight-cli/
[hdinsight-admin-powershell]: /en-us/manage/services/hdinsight/administer-hdinsight-powershell/
[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store/
[hdinsight-getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/

[azure-create-storageaccount]: /en-us/manage/services/storage/how-to-create-a-storage-account/ 
[azure-management-portal]: https://manage.windowsazure.com/
[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/


[hadoop-command-reference]: http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/CommandsManual.html

[image-cluster-quickcreate]: ../media/HDI.QuickCreateCluster.png
[image-cluster-landing]: ../media/HDI.ClusterLanding.PNG "Cluster landing page"
[image-hdi-create-rpd-user]: ../media/HDI.CreateRDPUser.png
[image-hadoopcommandline]: ../media/HDI.HadoopCommandLine.PNG "Hadoop command line"