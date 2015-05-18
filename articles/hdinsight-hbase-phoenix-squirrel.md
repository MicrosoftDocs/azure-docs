<properties 
   pageTitle="Use Apache Phoenix and Squirrel in HDInsight | Microsoft Azure" 
   description="Learn how to use Apache Phoenix in HDInsight, and how to install and configure SQuirrel on your workstation to connect to an HBase cluster in HDInsight." 
   services="hdinsight" 
   documentationCenter="" 
   authors="mumian" 
   manager="paulettm" 
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data" 
   ms.date="05/05/2015"
   ms.author="jgao"/>

# Use Apache Phoenix and SQuirrel with HBase clusters in HDinsight  

Learn how to use [Apache Phoenix](http://phoenix.apache.org/) in HDInsight, and how to install and configure SQuirrel on your workstation to connect to an HBase cluster in HDInsight. For more information about Phoenix, see [Phoenix in 15 minutes or less](http://phoenix.apache.org/Phoenix-in-15-minutes-or-less.html). For the Phoenix grammar, see [Phoenix Grammar](http://phoenix.apache.org/language/index.html).

>[AZURE.NOTE] For the Phoenix version information in HDInsight, see [What's new in the Hadoop cluster versions provided by HDInsight?][hdinsight-versions].

##Use SQLLine
[SQLLine](http://sqlline.sourceforge.net/) is a command line utility to execute SQL. 

###Prerequisites
Before you can use SQLLine, you must have the following:

- **A HBase cluster in HDInsight**. For information on provision HBase cluster, see [Get started with Apache HBase in HDInsight][hdinsight-hbase-get-started].
- **Connect to the HBase cluster via the remote desktop protocol**. For instructions, see [Manage Hadoop clusters in HDInsight by using the Azure portal][hdinsight-manage-portal].

**To find out the host name**

1. Open **Hadoop Command Line** from the desktop.
2. Run the following command to get the DNS suffix:

		ipconfig

	Write down **Connection-specific DNS Suffix**. For example, *myhbasecluster.f5.internal.cloudapp.net*. When you connect to an HBase cluster, you will need to connect to one of the Zookeepers using FQDN. Each HDInsight cluster has 3 Zookeepers. They are *zookeeper0*, *zookeeper1*, and *zookeeper2*. The FQDN will be something like *zookeeper2.myhbasecluster.f5.internal.cloudapp.net*.

**To use SQLLine**

1. Open **Hadoop Command Line** from the desktop.
2. Run the following commands to open SQLLine:

		cd %phoenix_home%\bin
		sqlline.py [The FQDN of one of the Zookeepers]

	![hdinsight hbase phoenix sqlline][hdinsight-hbase-phoenix-sqlline]

	The commands used in the sample:

		CREATE TABLE Company (COMPANY_ID INTEGER PRIMARY KEY, NAME VARCHAR(225));
		
		!tables;
		
		UPSERT INTO Company VALUES(1, 'Microsoft');
		
		SELECT * FROM Company;

For more information, see [SQLLine manual](http://sqlline.sourceforge.net/#manual) and [Phoenix Grammar](http://phoenix.apache.org/language/index.html).


















##Use SQuirrel

[SQuirreL SQL Client](http://squirrel-sql.sourceforge.net/) is a graphical Java program that will allow you to view the structure of a JDBC compliant database, browse the data in tables, issue SQL commands etc. It can be used to connect to Apache Phoenix on HDInsight.

This section shows you how to install and configure SQuirrel on your workstation to connect to an HBase cluster in HDInsight via VPN. 

###Prerequisites

Before following the procedures, you must have the following:

- An HBase cluster deployed to an Azure virtual network with a DNS virtual machine.  For instructions, see [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]. 

	>[AZURE.IMPORTANT] You must install a DNS server to the virtual network. For instructions, see [Configure DNS between two Azure virtual networks](hdinsight-hbase-geo-replication-configure-DNS.md)

- Get the HBase cluster cluster Connection-specific DNS suffix. To get it, RDP into the cluster, and then run IPConfig.  The DNS suffix is similar to:

		myhbase.b7.internal.cloudapp.net
- Download and install [Microsoft Visual Studio Express 2013 for Windows Desktop](https://www.visualstudio.com/products/visual-studio-express-vs.aspx) on your workstation. You will need makecert from the package to create your certificate.  
- Download and install [Java Runtime Environment](http://www.oracle.com/technetwork/java/javase/downloads/jre7-downloads-1880261.html) on your workstation.  SQuirrel SQL client version 3.0 and higher requires JRE version 1.6 or higher.  


###Configure a Point-to-Site VPN connection to the Azure virtual network

There are 3 steps involved configuring a point-to-site VPN connection:

1. [Configure a virtual network and a dynamic routing gateway](#Configure-a-virtual-network-and-a-dynamic-routing-gateway)
2. [Create your certificates](#Create-your-certificates)
3. [Configure your VPN client](#Configure-your-VPN-client)

See [Configure a Point-to-Site VPN connection to an Azure Virtual Network](https://msdn.microsoft.com/library/azure/dn133792.aspx) for more information.

#### Configure a virtual network and a dynamic routing gateway

Assure you have provisioned an HBase cluster in an Azure virtual network (see the prerequisites for this section). The next step is to configure a point-to-site connection.

**To configure the point-to-site connectivity**

1. Sign in to the [Azure portal][azure-portal].
2. On the left, click **NETWORKS**.
3. Click the virtual network you have created (see [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]).
4. Click **CONFIGURE** from the top.
5. In the **point-to-site connectivity** section, select **Configure point-to-site connectivity**. 
6. Configure **STARTING IP** and **CIDR** to specify the IP address range from which your VPN clients will receive an IP address when connected. The range cannot overlap with any of the ranges located on your on-premises network and the Azure virtual network you will be connecting to. For example. if you selected 10.0.0.0/20 for the virtual network, you can select 10.1.0.0/24 for the client address space. See the [Point-To-Site Connectivity][vnet-point-to-site-connectivity] page for more information.
7. In the virtual network address spaces section, click **add gateway subnet**.
7. Click **SAVE** on the bottom of the page.
8. Click **YES** to confirm the change. Wait until the system has finished making the change before you proceed to the next procedure.


**To create a dynamic routing gateway**

1. From the Azure portal, click **DASHBOARD** from the top of the page.
2. Click **CREATE GATEWAY** from the bottom of the page.
3. Click **YES** to confirm. Wait until the gateway is created.
4. Click **DASHBOARD** from the top.  You will see a visual diagram of the virtual network:

	![Azure virtual network point-to-site virtual diagram][img-vnet-diagram] 

	The diagram shows 0 client connections. After you make a connection to the virtual network, the number will be updated to one. 

#### Create your certificates

One way to create an X.509 certificate is by using the Certificate Creation Tool (makecert.exe) that comes with [Microsoft Visual Studio Express 2013 for Windows Desktop](https://www.visualstudio.com/products/visual-studio-express-vs.aspx). 


**To create a self-signed root certificate**

1. From your workstation, open a command prompt window.
2. Navigate to the Visual Studio tools folder. 
3. The following command in the example below will create and install a root certificate in the Personal certificate store on your workstation and also create a corresponding .cer file that you’ll later upload to the Azure portal. 

		makecert -sky exchange -r -n "CN=HBaseVnetVPNRootCertificate" -pe -a sha1 -len 2048 -ss My "C:\Users\JohnDole\Desktop\HBaseVNetVPNRootCertificate.cer"

	Change to the directory that you want the .cer file to be located in, where HBaseVnetVPNRootCertificate is the name that you want to use for the certificate. 

	Don't close the command prompt.  You will need it in the next procedure.

	>[AZURE.NOTE] Because you have created a root certificate from which client certificates will be generated, you may want to export this certificate along with its private key and save it to a safe location where it may be recovered. 

**To create a client certificate**

- From the same command prompt (It has to be on the same computer where you created the root certificate. The client certificate must be generated from the root certificate), run the following command:

  		makecert.exe -n "CN=HBaseVnetVPNClientCertificate" -pe -sky exchange -m 96 -ss My -in "HBaseVnetVPNRootCertificate" -is my -a sha1

	HBaseVnetVPNRootCertificate is the root certificate name.  It has to match the root certificate name.  

	Both the root certificate and the client certificate are stored in your Personal certificate store on your computer. Use certmgr.msc to verify.

	![Azure virtual network point-to-site vpn certificate][img-certificate]

	A client certificate must be installed on each computer that you want to connect to the virtual network. We recommend that you create unique client certificates for each computer that you want to connect to the virtual network. To export the client certificates, use certmgr.msc. 

**To upload the root certificate to the Azure portal**

1. From the Azure portal, click **NETWORK** on the left.
2. Click the virtual network where your HBase cluster is deployed to.
3. Click **CERTIFICATES** from the top.
4. Click **UPLOAD** from the bottom, and specify the root certificate file you have created in the procedure before last. Wait until the certificate got imported.
5. Click **DASHBOARD** on the top.  The virtual diagram shows the status.


#### Configure your VPN client



**To download and install the client VPN package**

1. From the DASHBOARD page of the virtual network, in the quick glance section, click either **Download the 64-bit Client VPN Package** or **Download the 32-bit Client VPN Package** based on your workstation OS version.
2. Click **Run** to install the package.
3. At the security prompt, click **More info**, and then click **Run anyway**.
4. Click **Yes** twice.

**To connect to VPN**

1. On the desktop of your workstation, click the Networks icon on the Task bar. You shall see a VPN connection with your virtual network name.
2. Click the VPN connection name.
3. Click **Connect**.

**To test the VPN connection and domain name resolution**

- From the workstation, open a command prompt and ping one of the following names given the HBase cluster's DNS suffix is myhbase.b7.internal.cloudapp.net:

		zookeeper0.myhbase.b7.internal.cloudapp.net
		zookeeper0.myhbase.b7.internal.cloudapp.net
		zookeeper0.myhbase.b7.internal.cloudapp.net
		headnode0.myhbase.b7.internal.cloudapp.net
		headnode1.myhbase.b7.internal.cloudapp.net
		workernode0.myhbase.b7.internal.cloudapp.net

###Install and configure SQuirrel on your workstation

**To install SQuirrel**

1. Download the SQuirrel SQL client jar file from [http://squirrel-sql.sourceforge.net/#installation](http://squirrel-sql.sourceforge.net/#installation).
2. Open/run the jar file. It requires the [Java Runtime Environment](http://www.oracle.com/technetwork/java/javase/downloads/jre7-downloads-1880261.html).
3. Click **Next** twice.
4. Specify a path where you have the write permission, and then click **Next**.
	>[AZURE.NOTE] The default installation folder is in the C:\Program Files\squirrel-sql-3.6 folder.  In order to write to this path, the installer must be granted the administrator privilege. You can open a command prompt as administrator, navigate to Java's bin folder, and then run 
	>
	>     java.exe -jar [the path of the SQuirrel jar file] 
5. Click **OK** to confirm creating the target directory.
6. The default setting is to install the Base and Standard packages.  Click **Next**.
7. Click **Next** twice, and then click **Done**.


**To install the Phoenix driver**

The phoenix driver jar file is located on the HBase cluster. The path is similar to the following based on the versions:

	C:\apps\dist\phoenix-4.0.0.2.1.11.0-2316\phoenix-4.0.0.2.1.11.0-2316-client.jar
You need to copy it to your workstation under the [SQuirrel installation folder]/lib path.  The easiest way is to RDP into the cluster, and then use file copy/paste (CTRL+C and CTRL+V) to copy it to your workstation.

**To add a Phoenix driver to SQuirrel**

1. Open SQuirrel SQL Client from your workstation.
2. Click the **Driver** tab on the left.
2. From the **Drivers** menu, click **New Driver**.
3. Enter the following information:

	- **Name**: Phoenix
	- **Example URL**: jdbc:phoenix:zookeeper2.contoso-hbase-eu.f5.internal.cloudapp.net
	- **Class Name**: org.apache.phoenix.jdbc.PhoenixDriver

	>[AZURE.WARNING] User all lower case in the Example URL. You can use they full zookeeper quorum in case one of them is down.  The hostnames are zookeeper0, zookeeper1, and zookeeper2.

	![HDInsight HBase Phoenix SQuirrel driver][img-squirrel-driver]
4. Click **OK**.

**To create an alias to the HBase cluster**

1. From SQuirrel, Click the **Aliases** tab on the left.
2. From the **Aliases** menu, click **New Alias**.
3. Enter the following information:

	- **Name**: The name of the HBase cluster or any name you prefer.
	- **Driver**: Phoenix.  This must match the driver name you created in the last procedure.
	- **URL**: The URL is copied from your driver configuration. Make sure to user all lower case.
	- **User name**: It can be any text.  Because you use VPN connectivity here, the user name is not used at all.
	- **Password**: It can be any text.

	![HDInsight HBase Phoenix SQuirrel driver][img-squirrel-alias]
4. Click **Test**. 
5. Click **Connect**. When it makes the connection, SQuirrel looks like:

	![HBase Phoenix SQuirrel][img-squirrel]

**To run a test**

1. Click the **SQL** tab right next to the **Objects** tab.
2. Copy and paste the following code:

		CREATE TABLE IF NOT EXISTS us_population (state CHAR(2) NOT NULL, city VARCHAR NOT NULL, population BIGINT  CONSTRAINT my_pk PRIMARY KEY (state, city))
3. Click the run button.

	![HBase Phoenix SQuirrel][img-squirrel-sql]
4. Switch back to the **Objects** tab.
5. Expand the alias name, and then expand **TABLE**.  You shall see the new table listed under.
 
##Next steps
In this article, you have learned how to use Apache Phoenix in HDInsight.  To learn more, see

- [HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.
- [Provision HBase clusters on Azure Virtual Network][hdinsight-hbase-provision-vnet]:
With virtual network integration, HBase clusters can be deployed to the same virtual network as your applications so that applications can communicate with HBase directly.
- [Configure HBase replication in HDInsight](hdinsight-hbase-geo-replication.md): Learn how to configure HBase replication across two Azure datacenters. 
- [Analyze Twitter sentiment with HBase in HDInsight][hbase-twitter-sentiment]:
Learn how to do real-time [sentiment analysis](http://en.wikipedia.org/wiki/Sentiment_analysis) of big data by using HBase in a Hadoop cluster in HDInsight.

[azure-portal]: https://manage.windowsazure.com
[vnet-point-to-site-connectivity]: https://msdn.microsoft.com/library/azure/09926218-92ab-4f43-aa99-83ab4d355555#BKMK_VNETPT

[hdinsight-versions]: hdinsight-component-versioning.md
[hdinsight-hbase-get-started]: hdinsight-hbase-get-started.md
[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md#connect-to-hdinsight-clusters-by-using-rdp
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md

[hdinsight-hbase-phoenix-sqlline]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-phoenix-sqlline.png
[img-certificate]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-vpn-certificate.png
[img-vnet-diagram]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-vnet-point-to-site.png
[img-squirrel-driver]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel-driver.png
[img-squirrel-alias]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel-alias.png
[img-squirrel]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel.png
[img-squirrel-sql]: ./media/hdinsight-hbase-phoenix-squirrel/hdinsight-hbase-squirrel-sql.png


