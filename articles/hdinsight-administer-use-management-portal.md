<properties urlDisplayName="Administration" pageTitle="Manage Hadoop clusters in HDInsight using Azure Portal | Azure" metaKeywords="" description="Learn how to administer HDInsight Service. Create an HDInsight cluster, open the interactive JavaScript console, and open the Hadoop command console." metaCanonical="" services="hdinsight" documentationCenter="" title="Manage Hadoop clusters in HDInsight using the Azure Management Portal" authors="jgao" solutions="" manager="paulettm" editor="cgronlun" />

<tags ms.service="hdinsight" ms.workload="big-data" ms.tgt_pltfrm="na" ms.devlang="na" ms.topic="article" ms.date="01/01/1900" ms.author="jgao" />



# Manage Hadoop clusters in HDInsight using the Azure Management Portal

Using the Azure management portal, you can provision Hadoop clusters in HDInsight, change the Hadoop user password, and enable RDP so you can access the Hadoop command console on the cluster. There are also other tools available for administrating HDInsight in addition to the Management portal. 

- For more information on administering HDInsight using Azure PowerShell, see [Administer HDInsight Using PowerShell][hdinsight-admin-powershell].

- For more information on administering HDInsight using the Cross-platform Command-line Tools, see [Administer HDInsight Using Cross-platform Command-line Interface][hdinsight-admin-cross-platform]. 

**Prerequisites:**

Before you begin this article, you must have the following:

- **Azure subscription**. Azure is a subscription-based platform. For information about obtaining a subscription, see [Purchase Options][azure-purchase-options], [Member Offers][azure-member-offers], or [Free Trial][azure-free-trial].


##In this article

* [Provision HDInsight clusters](#create)
* [Customize HDInsight clusters](#customize)
* [Change HDInsight cluster username and password](#password)
* [Connect to HDInsight clusters using RDP](#rdp)
* [Create a self-signed certificate](#cert)
* [Grant/revoke HTTP services access](#httpservice)
* [Open Hadoop command console](#hadoopcmd)
* [Next steps](#nextsteps)

##<a id="create"></a> Provision HDInsight clusters

There are several methods for creating HDInsight clusters, this article only covers using the Quick Create option on Azure Management portal. For other options, see [Provision HDInsight clusters][hdinsight-provision].

An HDInsight cluster uses an Azure Blob Storage container as the default file system. For more information about how Azure Blob Storage provides a seamless experience with HDInsight clusters, see [Use Azure Blob Storage with HDInsight][hdinsight-storage].

An Azure storage account must be created in the same data center in which your HDInsight cluster is to be provisioned. Currently HDInsight clusters can be provisioned in five data centers: 

- Southeast Asia 
- North Europe
- West Europe 
- East US 
- West US 

For details on creating an Azure storage account, see [How to Create a Storage Account][azure-create-storageaccount].


**To provision an HDInsight cluster**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **NEW** on the bottom of the page, click **DATA SERVICES**, click **HDINSIGHT**, and then click **QUICK CREATE**.

3. Provide **Cluster Name**, **Cluster Size**, **Cluster Admin Password**, and an Azure **Storage Account** and then click **Create HDInsight Cluster**. Once the cluster is created and running, the status shows *Running*.

	![HDI.QuickCreate][image-cluster-quickcreate]

	When using the Quick Create option to create a cluster, the default username for the Hadoop user account is *admin*. To give the account a different username, you can use the Custom Create option instead of Quick Create option. Or change the account name after it is provisioned.

	When using the Quick Create option to create a cluster, a new container with the name of the HDInsight cluster is created automatically in the storage account specified. If you want to customize the name of the container to be used by default by the cluster, you must use the custom create option. 

	> [WACOM.NOTE] Once an Azure storage account is chosen for your HDInsight cluster, the only way to change the storage account is to delete the cluster and create a new cluster with the desired storage account.

4. Click the newly created cluster.  It shows the landing page:

	![HDI.ClusterLanding][image-cluster-landing]


##<a id="customize"></a> Customize HDInsight clusters

HDInsight works with a wide range of Hadoop components. For the list of the components that have been verified and supported, see [What version of Hadoop is in Azure HDInsight][hdinsight-versions]. HDInsight customization can be done using one of the following options:

- Use the cluster customization parameters in HDInsight .NET SDK or Azure PowerShell during cluster provision. By doing so, these configuration changes are preserved through lifetime of the cluster and not affected by cluster node reimages that Azure platform periodically performs for maintenance. For more information on using the cluster customization parameters, see [Provision HDInsight clusters][hdinsight-provision].
- Some native Java components, like Mahout, Cascading, can be run on the cluster as JAR files. These JAR files can be distributed to Azure Blob storage (WASB), and submitted to HDInsight clusters using Hadoop job submission mechanisms. For more information see [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]. 


	>[WACOM.NOTE] If you have issues deploying jar files to HDInsight clusters or calling jar files on HDInsight clusters, contact [Microsoft Support][hdinsight-support].
	
	> Cascading is not supported by HDInsight, and is not eligible for Microsoft Support. For lists of supported components, see [What's new in the cluster versions provided by HDInsight?][hdinsight-versions].


Installation of custom software on the cluster using remote desktop connection is not supported. You should avoid storing any files on the drives of the head node as they are lost if you need to recreate the clusters. We recommend to store files on Azure Blob storage. Blob storage is persistent.

##<a id="password"></a> Change the HDInsight cluster username and password
An HDInsight cluster can have two user accounts.  The HDInsight cluster user account is created during the provision processs.  You can also create a RDP user account for accessing the cluster via RDP. See [Enable remote desktop](#enablerdp).

**To change HDInsight cluster username and password**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed HDInsight clusters.
3. Click the HDInsight cluster that you want to reset the username and password.
4. From the top of the page, click **CONFIGURATION**.
5. Click **OFF** next  to **HADOOP SERVICES**.
6. Click **SAVE** on the bottom of the page, and wait for the disabling to complete.
7. After the service has been disabled, click **ON** next to **HADOOP SERVICES**.
8. Enter **USER NAME** and **NEW PASSWORD**.  These will be the new username and password for the cluster.
8. Click **SAVE**.


##<a id="rdp"></a> Connect to HDInsight clusters using RDP

The credentials for the cluster that you provided at its creation give access to the services on the cluster, but not to the cluster itself through remote desktop. Remote Desktop access is turned off by default and so direct access to the cluster using it requires some additional, post-creation configuration.

**To enable remote desktop**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed HDInsight clusters.
3. Click the HDInsight cluster that you want to connect to.
4. From the top of the page, click **CONFIGURATION**.
5. From the bottom of the page, click **ENABLE REMOTE**.
6. In the **Configure Remote Desktop** wizard, enter a username and password for the remote desktop. Note that the username must be different than the one used to create the cluster (*admin* by default with the Quick Create option). Enter an expiration date in the **EXPIRES ON** box. Note that the expiration date must be in the future and no more than a week from the present. The expiration time of day is assumed by default to be midnight of the specified date. Then click the check icon.

	![HDI.CreateRDPUser][image-hdi-create-rpd-user]

	The expiration date must be in the future, and at most seven days from now. And the time is the midnight of the selected date.

> [WACOM.NOTE] Once RDP is enabled for a cluster, you must refresh the page before you can connect to the cluster.
 
**To connect to a cluster using RDP**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed HDInsight clusters.
3. Click the HDInsight cluster that you want to connect to.
4. From the top of the page, click **CONFIGURATION**.
5. Click **CONNECT**, and then follow the instructions.

##<a id="cert"></a>Create a self-signed certificate

If you want to perform any operations on the cluster using the .NET SDK, you must create a self-signed certificate on the workstation, and also upload the certificate to your Azure subscription. This is a one-time task. You can install the same certificate on other machines, as long as the certificate is valid.

**To create a self-signed certificate**

1. Create a self-signed certificate that is used to authenticate the requests. You can use IIS or [makecert][makecert-info] to create the certificate.
 
2. Browse to the location of the certificate, right-click the certificate, click **Install Certificate**, and install the certificate to the computer's personal store. Edit the certificate properties to assign it a friendly name.

3. Import the certificate into the Azure Management Portal. From the portal, click **Settings** on the bottom-left of the page, and then click **Management Certificates**. From the bottom of the page, click **Upload** and follow the instructions to upload the .cer file you created in the previous step.

	![HDI.ClusterCreate.UploadCert][image-hdiclustercreate-uploadcert]


##<a id="httpservice"></a> Grant/revoke HTTP services access

HDInsight clusters have the following HTTP Web services (all of these services have RESTful endpoints):

- ODBC
- JDBC
- Ambari
- Oozie
- Templeton

By default, these services are granted for access. You can revoke/grant the access from the Management portal. 

>[WACOM.NOTE] By granting/revoking the access, you will reset the cluster user username and password.

**To grant/revoke HTTP Web services access**

1. Sign in to the [Azure Management Portal][azure-management-portal].
2. Click **HDINSIGHT** on the left pane. You will see a list of deployed HDInsight clusters.
3. Click the HDInsight cluster that you want to configure.
4. From the top of the page, click **CONFIGURATION**.
5. Click **ON** or **OFF** next  to **HADOOP SERVICES**.  
6. Enter **USER NAME** and **NEW PASSWORD**.  These will be the new username and password for the cluster.
7. Click **SAVE**.

This can also be done using the Azure PowerShell cmdlets:

- Grant-AzureHDInsightHttpServicesAccess
- Revoke-AzureHDInsightHttpServicesAccess

See [Administer HDInsight using PowerShell][hdinsight-admin-powershell].

##<a id="hadoopcmd"></a> Open Hadoop command line

To connect to the cluster using remote desktop and use the Hadoop command line, you must first have enabled remote desktop access to the cluster as described in the previous section. 

**To open Hadoop command line**

1. Sign in to the [Azure Management Portal][azure-management-portal].
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

On the previous screenshot, the folder name has the Hadoop version number embedded. The version number can changed based on the version of the Hadoop components installed on the cluster. You can use Hadoop environment variables to refer to those folders.  For example:

	cd %hadoop_home%
	cd %hive_home%
	cd %pig_home%
	cd %sqoop_home%   
	cd %hcatalog_home%

##<a id="nextsteps"></a> Next steps
In this article, you have learned how to create an HDInsight cluster using the Azure Management Portal, and how to open the Hadoop command line tool. To learn more, see the following articles:

* [Administer HDInsight Using PowerShell][hdinsight-admin-powershell]
* [Administer HDInsight Using Cross-platform Command-line Interface][hdinsight-admin-cross-platform]
* [Provision HDInsight clusters][hdinsight-provision]
* [Submit Hadoop jobs programmatically][hdinsight-submit-jobs]
* [Get Started with Azure HDInsight][hdinsight-get-started]
* [What version of Hadoop is in Azure HDInsight?][hdinsight-versions]

[hdinsight-admin-cross-platform]: ../hdinsight-administer-use-command-line/

[hdinsight-admin-powershell]: ../hdinsight-administer-use-powershell/
[hdinsight-get-started]: ../hdinsight-get-started/
[hdinsight-provision]: ../hdinsight-provision-clusters/
[hdinsight-submit-jobs]: ../hdinsight-submit-hadoop-jobs-programmatically/
[hdinsight-storage]: ../hdinsight-use-blob-storage/
[hdinsight-versions]: ../hdinsight-component-versioning/
[hdinsight-support]: http://azure.microsoft.com/en-us/support/options/
[makecert-info]: http://msdn.microsoft.com/en-us/library/bfsktky3(v=vs.110).aspx

[azure-create-storageaccount]: ../storage-create-storage-account/ 
[azure-management-portal]: https://manage.windowsazure.com/

[azure-purchase-options]: http://azure.microsoft.com/en-us/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/en-us/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/en-us/pricing/free-trial/


[hadoop-command-reference]: http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-common/CommandsManual.html

[image-cluster-quickcreate]: ./media/hdinsight-administer-use-management-portal/HDI.QuickCreateCluster.png
[image-cluster-landing]: ./media/hdinsight-administer-use-management-portal/HDI.ClusterLanding.PNG "Cluster landing page"
[image-hdi-create-rpd-user]: ./media/hdinsight-administer-use-management-portal/HDI.CreateRDPUser.png
[image-hadoopcommandline]: ./media/hdinsight-administer-use-management-portal/HDI.HadoopCommandLine.PNG "Hadoop command line"
[image-hdiclustercreate-uploadcert]: ./media/hdinsight-administer-use-management-portal/HDI.ClusterCreate.UploadCert.png
