<properties
	pageTitle="HBase tutorial: Get started with HBase in Hadoop | Microsoft Azure"
	description="Follow this HBase tutorial to get started using Apache HBase with Hadoop in HDInsight. Create tables from the HBase shell and query them using Hive."
	keywords="apache hbase,hbase,hbase shell,hbase tutorial"
	services="hdinsight"
	documentationCenter=""
	authors="mumian"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="get-started-article"
	ms.date="08/18/2015"
	ms.author="jgao"/>



# HBase tutorial: Get started using Apache HBase with Hadoop in HDInsight

Learn how to provision an HBase cluster in HDInsight, create HBase tables, and query the tables by using Hive. For general HBase information, see [HDInsight HBase overview][hdinsight-hbase-overview].

> [AZURE.NOTE] The information in this document is specific to Linux-based HDInsight clusters. For information on Windows-based clusters, see [Get started using Apache HBase with Hadoop in HDInsight (Windows).

##Prerequisites

Before you begin this HBase tutorial, you must have the following:

- **An Azure subscription**. See [Get Azure free trial](http://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/).
- PuTTY and PuTTYGen for Windows-based clients. These utilities are available from [http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).
- [curl](http://curl.haxx.se/download.html).

## Provision an HBase cluster

[AZURE.INCLUDE [provisioningnote](../../includes/hdinsight-provisioning.md)]

**To provision an HBase cluster by using the Azure preview portal**


1. Sign in to the [Azure Preview portal][azure-portal].
2. Click **New** in the upper left corner, and then click **Data + Analytics**, **HDInsight**.
3. Enter the following values:

	- **Cluster Name**: Enter a name to identify this cluster.
	- **Cluster Type**: Select **HBase**.
	- **Cluster Operating System**: Select **Ubuntu**.
	- **Subscription**: select your Azure subscription used for provisioning this cluster.
	- **Resource Group**: add or select an Azure resource group.  For more information, see [Azure Resource Manager Overview](resource-group-overview.md).
	- **Credentials**.  Enter a password for the HTTP web service user. The default username is **admin**. You must also enter an **SSH Username** and either a **PASSWORD** or **PUBLIC KEY**, which will be used to authenticate the SSH user. Using a public key is the recommended approach. For more information on using SSH with HDInsight, see one of the following articles:

		- [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
		- [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
	Click **Select** to save the changes.
	- **Data Source**: select an existing or create a new Azure Storage account to be used as the default file system for the cluster. The storage account location determines the cluster location.  An HDInsight cluster and the dependent Azure storage account must be located in the same data center.
	The default name for **Default Container** is the cluster name.  
	- **Note Pricing Tiers:** select the number of region servers for the HBase cluster.

		> [AZURE.WARNING] For high availability of HBase services, you must provision a cluster that contains at least **three** nodes. This ensures that, if one node goes down, the HBase data regions are available on other nodes.

	- **Optional Configuration**: select the cluster version, configure Azure virtual network, configure Hive/Oozie metastore, configure Script actions, and add additional storage accounts.

4. Click **Create**.

>[AZURE.NOTE] After an HBase cluster is deleted, you can create another HBase cluster by using the same default blob container. The new cluster will pick up the HBase tables you created in the original cluster.

## Use the HBase shell

For most people, data appears in the tabular format:

![hdinsight hbase tabular data][img-hbase-sample-data-tabular]

In HBase which is an implementation of BigTable, the same data looks like:

![hdinsight hbase bigtable data][img-hbase-sample-data-bigtable]

It will make more sense after you finish the next procedure.  


**To use the HBase shell**

>[AZURE.NOTE] The steps provided here are from a Windows computer.  For the instructions for connecting to a Linux-based HDInsight cluster from Linux, Unix or OS X, see [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X (preview)](hdinsight-hadoop-linux-use-ssh-unix.md)
1. Open **PuTTY**.  See the Prerequisites listed at the beginning of the article.
2. If you provided an SSH key when you created your user account during the provision process, you must perform the following step to select the private key to use when authenticating to the cluster:

	In **Category**, expand **Connection**, expand **SSH**, and select **Auth**. Finally, click **Browse** and select the .ppk file that contains your private key.

3. In **Category**, click **Session**.
4. From the Basic options for your PuTTY session screen, enter the following values:

	- Host Name: the SSH address of your HDInsight server in the Host name (or IP address) field. The SSH address is your cluster name, then **-ssh.azurehdinsight.net**. For example, *mycluster-ssh.azurehdinsight.net*.
	- Port: 22. The ssh port on the head node 0 is 22.  See [Information about using HDInsight on Linux (preview)](hdinsight-hadoop-linux-information.md#remote-access-to-services).
4. Click **Open** to connect to the cluster.
5. When prompted, enter the user that you entered when you created the cluster. If you provided a password for the user, you will be prompted to enter it also.
6. Run the following command:

		hbase shell

4. Create an HBase with two column families:

		create 'Contacts', 'Personal', 'Office'
		list
5. Insert some data:

		put 'Contacts', '1000', 'Personal:Name', 'John Dole'
		put 'Contacts', '1000', 'Personal:Phone', '1-425-000-0001'
		put 'Contacts', '1000', 'Office:Phone', '1-425-000-0002'
		put 'Contacts', '1000', 'Office:Address', '1111 San Gabriel Dr.'
		scan 'Contacts'

	![hdinsight hadoop hbase shell][img-hbase-shell]

6. Get a single row

		get 'Contacts', '1000'

	You will see the same results as using the scan command because there is only one row.

	For more information about the HBase table schema, see [Introduction to HBase Schema Design][hbase-schema]. For more HBase commands, see [Apache HBase reference guide][hbase-quick-start].


6. Exit the shell

		exit

**To bulk load data into the contacts HBase table**

HBase includes several methods of loading data into tables.  For more information, see [Bulk loading](http://hbase.apache.org/book.html#arch.bulk.load).


A sample data file has been uploaded to a public blob container, wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt.  The content of the data file is:

	8396	Calvin Raji		230-555-0191	230-555-0191	5415 San Gabriel Dr.
	16600	Karen Wu		646-555-0113	230-555-0192	9265 La Paz
	4324	Karl Xie		508-555-0163	230-555-0193	4912 La Vuelta
	16891	Jonn Jackson	674-555-0110	230-555-0194	40 Ellis St.
	3273	Miguel Miller	397-555-0155	230-555-0195	6696 Anchor Drive
	3588	Osa Agbonile	592-555-0152	230-555-0196	1873 Lion Circle
	10272	Julia Lee		870-555-0110	230-555-0197	3148 Rose Street
	4868	Jose Hayes		599-555-0171	230-555-0198	793 Crawford Street
	4761	Caleb Alexander	670-555-0141	230-555-0199	4775 Kentucky Dr.
	16443	Terry Chander	998-555-0171	230-555-0200	771 Northridge Drive

You can create a text file and upload the file to your own storage account if you want. For the instructions, see [Upload data for Hadoop jobs in HDInsight][hdinsight-upload-data].

> [AZURE.NOTE] This procedure uses the Contacts HBase table you have created in the last procedure.

1. Open **PuTTY**, and connect to the cluster.  See the instructions in the previous procedure.
3. Run the following command to transform the data file to StoreFiles and store at a relative path specified by Dimporttsv.bulk.output:

		hbase org.apache.hadoop.hbase.mapreduce.ImportTsv -Dimporttsv.columns="HBASE_ROW_KEY,Personal:Name, Personal:Phone, Office:Phone, Office:Address" -Dimporttsv.bulk.output="/example/data/storeDataFileOutput" Contacts wasb://hbasecontacts@hditutorialdata.blob.core.windows.net/contacts.txt

4. Run the following command to upload the data from  /example/data/storeDataFileOutput to the HBase table:

		hbase org.apache.hadoop.hbase.mapreduce.LoadIncrementalHFiles /example/data/storeDataFileOutput Contacts

5. You can open the HBase shell, and use the scan command to list the table content.



## Use Hive to query HBase tables

You can query data in HBase tables by using Hive. This section creates a Hive table that maps to the HBase table and uses it to query the data in your HBase table.


1. Open **PuTTY**, and connect to the cluster.  See the instructions in the previous procedure.
2. Open the Hive shell.

	hive
3. Run the following HiveQL script  to create an Hive Table that maps to the HBase table. Make sure that you have created the sample table referenced earlier in this tutorial by using the HBase shell before you run this statement.

		CREATE EXTERNAL TABLE hbasecontacts(rowkey STRING, name STRING, homephone STRING, officephone STRING, officeaddress STRING)
		STORED BY 'org.apache.hadoop.hive.hbase.HBaseStorageHandler'
		WITH SERDEPROPERTIES ('hbase.columns.mapping' = ':key,Personal:Name,Personal:Phone,Office:Phone,Office:Address')
		TBLPROPERTIES ('hbase.table.name' = 'Contacts');

2. Run the following HiveQL script . The Hive query queries the data in the HBase table:

     	SELECT count(*) FROM hbasecontacts;

## Use HBase REST APIs using Curl

> [AZURE.NOTE] When using Curl or any other REST communication with WebHCat, you must authenticate the requests by providing the user name and password for the HDInsight cluster administrator. You must also use the cluster name as part of the Uniform Resource Identifier (URI) used to send the requests to the server.
>
> For the commands in this section, replace **USERNAME** with the user to authenticate to the cluster, and replace **PASSWORD** with the password for the user account. Replace **CLUSTERNAME** with the name of your cluster.
>
> The REST API is secured via [basic authentication](http://en.wikipedia.org/wiki/Basic_access_authentication). You should always make requests by using Secure HTTP (HTTPS) to help ensure that your credentials are securely sent to the server.

1. From a command line, use the following command to verify that you can connect to your HDInsight cluster:

		curl -u <UserName>:<Password> -G https://<ClusterName>.azurehdinsight.net/templeton/v1/status

	You should receive a response similar to the following:

    {"status":"ok","version":"v1"}

  The parameters used in this command are as follows:

    * **-u** - The user name and password used to authenticate the request.
    * **-G** - Indicates that this is a GET request.

2. Use the following command to list the exisiting HBase tables:

		curl -u <UserName>:<Password> -G https://<ClusterName>.azurehdinsight.net/hbaserest/

3. Use the following command to create a new HBase table wit two column families:

		curl -u <UserName>:<Password> -v -X PUT "https://<ClusterName>.azurehdinsight.net/hbaserest/Contacts1/schema" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"@name\":\"test\",\"ColumnSchema\":[{\"name\":\"Personal\"},{\"name\":\"Office\"}]}"

	The schema is provided in the JSon format.

4. Use the following command to insert some data:

		curl -u <UserName>:<Password> -v -X PUT "https://<ClusterName>.azurehdinsight.net/hbaserest/Contacts1/schema" -H "Accept: application/json" -H "Content-Type: application/json" -d "{\"Row\":{\"key\":\"1000\",\"Cell\":{\"column\":\"Personal:Name\", \"$\":\"John Dole\"}}}"

5. Use the following command to get a row:

		curl -u <UserName>:<Password> -v -X GET "https://<ClusterName>.azurehdinsight.net/hbaserest/Contacts1/1000" -H "Accept: application/json"

## Check cluster status

HBase in HDInsight ships with a Web UI for monitoring clusters. Using the Web UI, you can request statistics or information about regions.

SSH can also be used to tunnel local requests, such as web requests, to the HDInsight cluster. The request will then be routed to the requested resource as if it had originated on the HDInsight cluster head node. For more information, see [Use SSH with Linux-based Hadoop on HDInsight from Windows (preview)](hdinsight-hadoop-linux-use-ssh-windows.md#tunnel).

**To establish an SSH tunneling session**

1. Open **PuTTY**.  
2. If you provided an SSH key when you created your user account during the provision process, you must perform the following step to select the private key to use when authenticating to the cluster:

	In **Category**, expand **Connection**, expand **SSH**, and select **Auth**. Finally, click **Browse** and select the .ppk file that contains your private key.

3. In **Category**, click **Session**.
4. From the Basic options for your PuTTY session screen, enter the following values:

	- **Host Name**: the SSH address of your HDInsight server in the Host name (or IP address) field. The SSH address is your cluster name, then **-ssh.azurehdinsight.net**. For example, *mycluster-ssh.azurehdinsight.net*.
	- **Port**: 22. The ssh port on the head node 0 is 22.  
5. In the **Category** section to the left of the dialog, expand **Connection**, expand **SSH**, and then click **Tunnels**.
6. Provide the following information on the Options controlling SSH port forwarding form:

	- **Source port** - The port on the client that you wish to forward. For example, 9876.
	- **Dynamic** - Enables dynamic SOCKS proxy routing.
7. Click **Add** to add the settings.
8. Click **Open** at the bottom of the dialog to open an SSH connection.
9. When prompted, log in to the server using a SSH account. This will establish an SSH session and enable the tunnel.

**To find the FQDN of the zookeepers using Ambari**

1. Browse to https://<ClusterName>.azurehdinsight.net/.
2. Enter your cluster user account credentials twice.
3. From the left menu, click **zookeeper**.
4. Click one of the three **ZooKeeper Server** links from the Summary list.
5. Copy **Hostname**. For example, zk0-CLUSTERNAME.xxxxxxxxxxxxxxxxxxxx.cx.internal.cloudapp.net.

**To configure a client program (Firefox) and check cluster status**

1. Open Firefox.
2. Click the **Open Menu** button.
3. Click **Options**.
4. Click **Advanced**, click **Network**, and then click **Settings**.
5. Select **Manual proxy configuration**.
6. Enter the following values:

	- **Socks Host**: localhost
	- **Port**: Use the same port you configured in the Putty SSH tunnelling.  For example, 9876.
	- **SOCKS v5**: (selected)
	- **Remote DNS**: (selected)
7. Click **OK** to save the changes.
8. Browse to http://<TheFQDN of a ZooKeeper>:60010/master-status

In a high availability cluster, you will find a link to the current active HBase master node that is hosting the Web UI.



## What's next?
In this HBase tutorial for HDInsight, you learned how to provision an HBase cluster and how to create tables and view the data in those tables from the HBase shell. You also learned how use a Hive query on data in HBase tables and how to use the HBase C# REST APIs to create an HBase table and retrieve data from the table.

To learn more, see:

- [HDInsight HBase overview][hdinsight-hbase-overview]:
HBase is an Apache, open-source, NoSQL database built on Hadoop that provides random access and strong consistency for large amounts of unstructured and semistructured data.


[hdinsight-manage-portal]: hdinsight-administer-use-management-portal.md
[hdinsight-upload-data]: hdinsight-upload-data.md
[hbase-reference]: http://hbase.apache.org/book.html#importtsv
[hbase-schema]: http://0b4af6cdc2f0c5998459-c0245c5c937c5dedcca3f1764ecc9b2f.r43.cf2.rackcdn.com/9353-login1210_khurana.pdf
[hbase-quick-start]: http://hbase.apache.org/book.html#quickstart





[hdinsight-hbase-overview]: hdinsight-hbase-overview.md
[hdinsight-hbase-provision-vnet]: hdinsight-hbase-provision-vnet.md
[hdinsight-versions]: hdinsight-component-versioning.md
[hbase-twitter-sentiment]: hdinsight-hbase-analyze-twitter-sentiment.md
[azure-purchase-options]: http://azure.microsoft.com/pricing/purchase-options/
[azure-member-offers]: http://azure.microsoft.com/pricing/member-offers/
[azure-free-trial]: http://azure.microsoft.com/pricing/free-trial/
[azure-portal]: https://portal.azure.com/
[azure-create-storageaccount]: http://azure.microsoft.com/documentation/articles/storage-create-storage-account/

[img-hdinsight-hbase-cluster-quick-create]: ./media/hdinsight-hbase-tutorial-get-started-linux/hdinsight-hbase-quick-create.png
[img-hdinsight-hbase-hive-editor]: ./media/hdinsight-hbase-tutorial-get-started-linux/hdinsight-hbase-hive-editor.png
[img-hdinsight-hbase-file-browser]: ./media/hdinsight-hbase-tutorial-get-started-linux/hdinsight-hbase-file-browser.png
[img-hbase-shell]: ./media/hdinsight-hbase-tutorial-get-started-linux/hdinsight-hbase-shell.png
[img-hbase-sample-data-tabular]: ./media/hdinsight-hbase-tutorial-get-started-linux/hdinsight-hbase-contacts-tabular.png
[img-hbase-sample-data-bigtable]: ./media/hdinsight-hbase-tutorial-get-started-linux/hdinsight-hbase-contacts-bigtable.png
