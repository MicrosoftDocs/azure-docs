---
title: Apache Hive policies in Apache Ranger - Azure HDInsight
description: Learn how to configure Apache Ranger policies for Hive in an Azure HDInsight service with Enterprise Security Package.
author: omidm1
ms.author: omidm
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive
ms.date: 11/27/2019
---

# Configure Apache Hive policies in HDInsight with Enterprise Security Package

Learn how to configure Apache Ranger policies for Apache Hive. In this article, you create two Ranger policies to restrict access to the hivesampletable. The hivesampletable comes with HDInsight clusters. After you've configured the policies, you use Excel and ODBC driver to connect to Hive tables in HDInsight.

## Prerequisites

* A HDInsight cluster with Enterprise Security Package. See [Configure HDInsight clusters with ESP](apache-domain-joined-configure.md).
* A workstation with Office 2016, Office 2013 Professional Plus, Office 365 Pro Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.

## Connect to Apache Ranger Admin UI
**To connect to Ranger Admin UI**

1. From a browser, navigate to the Ranger Admin UI at `https://CLUSTERNAME.azurehdinsight.net/Ranger/` where CLUSTERNAME is the name of your cluster.

   > [!NOTE]  
   > Ranger uses different credentials than Apache Hadoop cluster. To prevent browsers using cached Hadoop credentials, use new InPrivate browser window to connect to the Ranger Admin UI.

2. Log in using the cluster administrator domain user name and password:

    ![HDInsight ESP Ranger home page](./media/apache-domain-joined-run-hive/hdinsight-domain-joined-ranger-home-page.png)

    Currently, Ranger only works with Yarn and Hive.

## Create Domain users

See [Create a HDInsight cluster with ESP](apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp), for information on how to create hiveruser1 and hiveuser2. You use the two user accounts in this article.

## Create Ranger policies

In this section, you create two Ranger policies for accessing hivesampletable. You give select permission on different set of columns. Both users were created using [Create a HDInsight cluster with ESP](apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp). In the next section, you'll test the two policies in Excel.

**To create Ranger policies**

1. Open Ranger Admin UI. See Connect to Apache Ranger Admin UI.
2. Select **CLUSTERNAME_Hive**, under **Hive**. You shall see two pre-configure policies.
3. Select **Add New Policy**, and then enter the following values:

    |Property |Value |
    |---|---|
    |Policy Name|read-hivesampletable-all|
    |Hive Database|default|
    |table|hivesampletable|
    |Hive Column|*|
    |Select User|hiveuser1|
    |Permissions|select|

    ![HDInsight ESP Ranger Hive policies configure](./media/apache-domain-joined-run-hive/hdinsight-domain-joined-configure-ranger-policy.png).

    > [!NOTE]  
    > If a domain user is not populated in Select User, wait a few moments for Ranger to sync with AAD.

4. Select **Add** to save the policy.

5. Repeat the last two steps to create another policy with the following properties:

    |Property |Value |
    |---|---|
    |Policy Name|read-hivesampletable-devicemake|
    |Hive Database|default|
    |table|hivesampletable|
    |Hive column|clientid, devicemake|
    |Select User|hiveuser2|
    |Permissions|select|

## Create Hive ODBC data source

The instructions can be found in [Create Hive ODBC data source](../hadoop/apache-hadoop-connect-excel-hive-odbc-driver.md).  

 | Property  |Description |
 | --- | --- |
 | Data Source Name | Give a name to your data source |
 | Host | Enter CLUSTERNAME.azurehdinsight.net. For example, myHDICluster.azurehdinsight.net |
 | Port | Use **443**. (This port has been changed from 563 to 443.) |
 | Database | Use **Default**. |
 | Hive Server Type | Select **Hive Server 2** |
 | Mechanism | Select **Azure HDInsight Service** |
 | HTTP Path | Leave it blank. |
 | User Name | Enter hiveuser1@contoso158.onmicrosoft.com. Update the domain name if it's different. |
 | Password | Enter the password for hiveuser1. |

Make sure to click **Test** before saving the data source.

## Import data into Excel from HDInsight

In the last section, you've configured two policies.  hiveuser1 has the select permission on all the columns, and hiveuser2 has the select permission on two columns. In this section, you impersonate the two users to import data into Excel.

1. Open a new or existing workbook in Excel.

1. From the **Data** tab, navigate to **Get Data** > **From Other Sources** > **From ODBC** to launch the **From ODBC** window.

    ![Open data connection wizard](./media/apache-domain-joined-run-hive/simbahiveodbc-excel-dataconnection1.png)

1. From the drop-down list, select the data source name that you created in the last section and then select **OK**.

1. For the first use, an **ODBC driver** dialog will open. Select **Windows** from the left menu. Then select **Connect** to open the **Navigator** window.

1. Wait for the **Select Database and Table** dialog to open. This can take a few seconds.

1. Select **hivesampletable**, and then select **Next**.

1. Select **Finish**.

1. In the **Import Data** dialog, you can change or specify the query. To do so, select **Properties**. This can take a few seconds.

1. Select the **Definition** tab. The command text is:

       SELECT * FROM "HIVE"."default"."hivesampletable"

   By the Ranger policies you defined,  hiveuser1 has select permission on all the columns.  So this query works with hiveuser1's credentials, but this query doesn't work with hiveuser2's credentials.

1. Select **OK** to close the Connection Properties dialog.

1. Select **OK** to close the **Import Data** dialog.  

1. Reenter the password for hiveuser1, and then click **OK**. It takes a few seconds before data gets imported to Excel. When it's done, you shall see 11 columns of data.

To test the second policy (read-hivesampletable-devicemake), you created in the last section

1. Add a new sheet in Excel.
2. Follow the last procedure to import the data.  The only change you make is to use hiveuser2's credentials instead of hiveuser1's. This fails because hiveuser2 only has permission to see two columns. You shall get the following error:

        [Microsoft][HiveODBC] (35) Error from Hive: error code: '40000' error message: 'Error while compiling statement: FAILED: HiveAccessControlException Permission denied: user [hiveuser2] does not have [SELECT] privilege on [default/hivesampletable/clientid,country ...]'.
        
3. Follow the same procedure to import data. This time, use hiveuser2's credentials, and also modify the select statement from:

        SELECT * FROM "HIVE"."default"."hivesampletable"

    to:

        SELECT clientid, devicemake FROM "HIVE"."default"."hivesampletable"

    When it's done, you shall see two columns of data imported.

## Next steps

* For configuring a HDInsight cluster with Enterprise Security Package, see [Configure HDInsight clusters with ESP](apache-domain-joined-configure.md).
* For managing a HDInsight cluster with ESP, see [Manage HDInsight clusters with ESP](apache-domain-joined-manage.md).
* For running Hive queries using SSH on HDInsight clusters with ESP, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md#authentication-domain-joined-hdinsight).
* For Connecting Hive using Hive JDBC, see [Connect to Apache Hive on Azure HDInsight using the Hive JDBC driver](../hadoop/apache-hadoop-connect-hive-jdbc-driver.md)
* For connecting Excel to Hadoop using Hive ODBC, see [Connect Excel to Apache Hadoop with the Microsoft Hive ODBC drive](../hadoop/apache-hadoop-connect-excel-hive-odbc-driver.md)
* For connecting Excel to Hadoop using Power Query, see [Connect Excel to Apache Hadoop by using Power Query](../hadoop/apache-hadoop-connect-excel-power-query.md)
