<properties linkid="manage-services-hdinsight-howto-administer-hdinsight" urlDisplayName="Administration" pageTitle="Administer HDInsight clusters with Management Portal | Windows Azure" metaKeywords="" description="Learn how to administer HDInsight Service. Create an HDInsight cluster, open the interactive JavaScript console, and open the Hadoop command console." metaCanonical="" services="hdinsight" documentationCenter="" title="Administer HDInsight clusters using Management Portal" authors=""  solutions="" writer="jgao" manager="paulettm" editor="cgronlun"  />



# Administer HDInsight clusters using Management Portal

In this topic, you will learn how to use Windows Azure Management Portal to create an HDInsight cluster, and how to access the Hadoop command console on the cluster. There are also other tools available for administrating HDInsight in addition to the portal. 

- For more information on administering HDInsight using the Cross-platform Command-line Tools, see [Administer HDInsight Using Cross-platform Command-line Interface][hdinsight-admin-cross-platform]. 

- For more information on administering HDInsight using Windows Azure PowerShell, see [Administer HDInsight Using PowerShell][hdinsight-admin-powershell].

**Prerequisites:**

Before you begin this article, you must have the following:

- **Windows Azure subscription**. Windows Azure is a subscription-based platform. For information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].
- **Windows Azure storage account**. This storage account must be created in the same data center in which your HDInsight cluster is to be provisioned. Currently HDInsight clusters can only be provisioned in three data centers: US East, US West, and Europe North. So your Windows Azure storage account needs to be created in one of these data centers. For details on creating a Windows Azure storage account, see [How to Create a Storage Account][azure-create-storageaccount].

##In this article

* [Create an HDInsight cluster](#create)
* [Enable remote desktop access](#enablerdp)
* [Open Hadoop command console](#hadoopcmd)
* [Next steps](#nextsteps)

##<a id="create"></a> Create an HDInsight cluster

An HDInsight cluster uses a Windows Azure Blob Storage container as the default file system. For more information about how Windows Azure Blob Storage provides a seamless experience with HDInsight clusters, see [Use Windows Azure Blob Storage with HDInsight][hdinsight-storage].


**To create an HDInsight cluster**

1. Sign in to the [Windows Azure Management Portal][azure-management-portal].
2. Click **+ NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **QUICK CREATE**.

3. Provide **Cluster Name**, **Cluster Size**, **Cluster Admin Password**, and a Windows Azure **Storage Account**, and then click **Create HDInsight Cluster**. Once the cluster is created and running, the status shows *Running*.

	![HDI.QuickCreate][image-cluster-quickcreate]

	When using the Quick Create option to create a cluster, the default username for the administrator account is *admin*. To give the account a different username, you must use the Custom Create option instead of Quick Create option.

	When using the Quick Create option to create a cluster, a new container with the name of the HDInsight cluster is created automatically in the storage account specified. If you want to customize the name of the container to be used by default by the cluster, you must use the custom create option. 

	<div class="dev-callout">??
	<b>Important</b>??
	<p>Important: Once a Windows Azure storage account is chosen for your HDInsight cluster, the only way to change the storage account is to delete the cluster and create a new cluster with the desired storage account.</p>??
	</div>

4. Click the newly created cluster.  It shows the landing page:

	![HDI.ClusterLanding][image-cluster-landing]


##<a id="enablerdp"></a> Enable remote desktop

The credentials for the cluster that you provided at its creation give access to the services on the cluster, but not to the cluster itself through remote desktop. Remote Desktop access is turned off by default and so direct access to the cluster using it requires some additional, post-creation configuration.

**To enable remote desktop**

1. Sign in to the [Windows Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed Hadoop clusters.
3. Click the HDInsight cluster that you want to connect to.
4. From the top of the page, click **CONFIGURATION**.
5. From the bottom of the page, click **ENABLE REMOTE**.
6. In the **Configure Remote Desktop** wizard, enter a username and password for the remote desktop. Note that the username must be different than the one used to create the cluster (*admin* by default with the Quick Create option). Enter an expiration date in the **EXPIRES ON** box. Note that the expiration date must be in the future and no more than a week from the present. The expiration time of day is assumed by default to be midnight of the specified date. Then click the check icon.

	![HDI.CreateRDPUser][image-hdi-create-rpd-user]

	The expiration date must be in the future, and at most seven days from now. And the time is the midnight of the selected date.
 

##<a id="hadoopcmd"></a> Open Hadoop command line

To connect to the cluster using remote desktop and use the Hadoop command line, you must first have enabled remote desktop access to the cluster as described in the previous section. 

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
* [Provision HDInsight clusters][hdinsight-provision]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Get Started with Windows Azure HDInsight][hdinsight-getting-started]


[hdinsight-admin-cross-platform]: /en-us/manage/services/hdinsight/administer-hdinsight-using-command-line-interface/
[hdinsight-admin-powershell]: /en-us/manage/services/hdinsight/administer-hdinsight-using-powershell/
[hdinsight-getting-started]: /en-us/manage/services/hdinsight/get-started-hdinsight/
[hdinsight-provision]: /en-us/manage/services/hdinsight/provision-hdinsight-clusters/
[hdinsight-submit-jobs]: /en-us/manage/services/hdinsight/submit-hadoop-jobs-programmatically/
[hdinsight-storage]: /en-us/manage/services/hdinsight/howto-blob-store/

[azure-create-storageaccount]: /en-us/manage/services/storage/how-to-create-a-storage-account/ 
[azure-management-portal]: https://manage.windowsazure.com/
[azure-purchase-options]: https://www.windowsazure.com/en-us/pricing/purchase-options/
[azure-member-offers]: https://www.windowsazure.com/en-us/pricing/member-offers/
[azure-free-trial]: https://www.windowsazure.com/en-us/pricing/free-trial/


[hadoop-command-reference]: http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/CommandsManual.html

[image-cluster-quickcreate]: ./media/hdinsight-administer-use-management-portal/HDI.QuickCreateCluster.png
[image-cluster-landing]: ./media/hdinsight-administer-use-management-portal/HDI.ClusterLanding.PNG "Cluster landing page"
[image-hdi-create-rpd-user]: ./media/hdinsight-administer-use-management-portal/HDI.CreateRDPUser.png
[image-hadoopcommandline]: ./media/hdinsight-administer-use-management-portal/HDI.HadoopCommandLine.PNG "Hadoop command line"
