<properties
   	pageTitle="Configure Secure HDInsight | Microsoft Azure"
   	description="Learn ...."
   	services="hdinsight"
   	documentationCenter=""
   	authors="mumian"
   	manager="paulettm"
   	editor="cgronlun"
	tags="azure-portal"/>

<tags
   	ms.service="hdinsight"
   	ms.devlang="na"
   	ms.topic="hero-article"
   	ms.tgt_pltfrm="na"
   	ms.workload="big-data"
   	ms.date="08/11/2016"
   	ms.author="jgao"/>

# Configure Hive policies in secure HDInsight

Learn how to configure Apache Ranger policies for Hive. In this article, you will create 2 Ranger policies to restrict access to the hivesampletable. The hivesampletable comes with HDInsight clusters.


## Prerequisites

- A Secure HDInsight cluster. See [Configure Secure HDInsight](hdinsight-secure-setup.md).
- A workstation with Office 2016, Office 2013 Professional Plus, Office 365 Pro Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.


## Connect to Apache Ranger Admin UI

**To connect to Ranger Admin UI**

[jgao: Ranger doesn't work in IE/Edge.]

1. From a browser, connect to Ranger Admin UI. The URL is https://&lt;ClusterName>.azurehdinsight.net/Ranger/. 

	>[AZURE.NOTE] Ranger uses different credentials than Hadoop cluster. To prevent browers using cached Hadoop credentials, use new inprivate brower window to connect to the Ranger Admin UI.
4. Login as **admin** with the password **admin**. This is the default password.  You can change the password. The Ranger Admin UI home page looks like:

	![HDInsight secure Ranger home page](./media/hdinsight-secure-run-hive/hdinsight-secure-ranger-home-page.png)

	Currently, Ranger only works with Yarn and Hive.

## Create Domain users

In [Configure Secure HDInsight](hdinsight-secure-setup.md#create-and-configure-an-aad), you have created hiveruser1 and hiveuser2. You will use the two user account in this tutorial.

## Create Ranger policies

In this section, you will create two Ranger policies for accessing hivesampletable. You will give select permissions to hiveuser1 and hiveuser2.  Both users were created in [Configure Secure HDInsight](hive-secure-setup.md#create-and-cofigure-an-aad).  In the next section, you will test the two policies in Excel.

**To create Ranger policies**

[jgao: Intelisent is not working. Nitya has logged the issue.]

1. Open Ranger Admin UI. See [Connect to Apache Ranger Admin UI](#connect-to-apache-ranager-admin-ui).
2. Click **&lt;ClusterName>_hive**, under **Hive**. You shall see two pre-configure policies.
3. Click **Add New Policy**, and then enter the following values:

	- Policy name: read-hivesampletable-all
	- Hive Database: default
	- table: hivesampletable
	- Hive column: clientid, querytime, market, deviceplatform, devicemake, devicemodel, state, country
	- Select User: hiveuser1
	- Permissions: select

	![HDInsight Secure Ranger Hive policy configure](./media/hdinsight-secure-run-hive/hdinsight-secure-configure-ranger-policy.png).

	>[AZURE.NOTE] If a domain user is not populated in Select User, please wait a bit for Ranger to sync with AAD.

4. Click **Add** to save the policy.
5. Repeat the last two steps to create another policy with the following properties:

	- Policy name: read-hivesampletable-devicemake
	- Hive Database: default
	- table: hivesampletable
	- Hive column: clientid, devicemake
	- Select User: hiveuser2
	- Permissions: select


## Create Hive ODBC data source

The instructions can be found in [Create Hive ODBC data source](hdinsight-connect-excel-hive-odbc-driver.md).  

    Property|Description
    ---|---
    Data Source Name|Give a name to your data source
    Host|Enter &lt;HDInsightClusterName>.azurehdinsight.net. For example, myHDICluster.azurehdinsight.net
    Port|Use <strong>443</strong>. (This port has been changed from 563 to 443.)
    Database|Use <strong>Default</strong>.
    Hive Server Type|Select <strong>Hive Server 2</strong>
    Mechanism|Select <strong>Azure HDInsight Service</strong>
    HTTP Path|Leave it blank.
    User Name|Enter hiveuser1@contoso158.onmicrosoft.com. Update the domain name if it is different.
    Password|Enter the password for hiveuser1.
    </table>

Make sure to click **Test** before saving the data source.

## Import data to Excel

[jgao: The Ranger polices don't work 100%.  I have reported the issue to Nitya.]

From Excel, use the DSN you configured in the last section to import data, and observe the difference using hiveuser1 and hiveuser2.  hiveuser1 has select permission on all the fields, hiveuser2 only has permissions to view two columns.