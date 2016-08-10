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
   	ms.date="06/30/2016"
   	ms.author="jgao"/>

# Configure Hive policies in secure HDInsight

Learn how to configure Hive policies. In this article, you will create 2 Ranger policies to restrict access to the hivesampletable. The hivesampletable comes with HDInsight clusters.


## Prerequisites

- A Secure HDInsight cluster. See [Configure Secure HDInsight](hdinsight-secure-setup.md).
- A workstation with Office 2016, Office 2013 Professional Plus, Office 365 Pro Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.


## Connect to Apache Ranger Admin UI

**To connect to Rnager Admin UI**

1. From a browser with SSH tunneling configured, connect to Ambari. The URL is https://&lt;ClusterName>.azurehdinsight.net.
2. Click **Ranger** from the left menu.
3. Click **Quick Links**, and then click **Ranger Admin UI**.
4. Login as **admin** with the password **admin**. This is the default password.  You can change the password. The Ranger Admin UI home page looks like:

	![HDInsight secure Ranger home page](./media/hdinsight-secure-run-hive/hdinsight-secure-ranger-home-page.png)

	Currently, Ranger only works with Yarn and Hive.

## Create Domain users

See [Configure Secure HDInsight](hdinsight-secure-setup.md#create-and-configure-an-aad).

## Create Ranger policies

In this section, you will create two Ranger policies for accessing hivesampletable. You will give select permissions to hiveuser1 and hiveuser2.  Both users were created in [Configure Secure HDInsight](hive-secure-setup.md#create-and-cofigure-an-aad).  In the next section, you will test the two policies in Excel.

**To create Ranger policies**

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

4. Click **Add** to save the policy.
5. Repeat the last two steps to create another policy with the following properties:

	- Policy name: read-hivesampletable-devicemake
	- Hive Database: default
	- table: hivesampletable
	- Hive column: clientid, devicemake
	- Select User: hiveuser2
	- Permissions: select



