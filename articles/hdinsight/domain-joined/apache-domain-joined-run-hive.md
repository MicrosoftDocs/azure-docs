---
title: Apache Hive policies in Apache Ranger - Azure HDInsight
description: Learn how to configure Apache Ranger policies for Hive in an Azure HDInsight service with Enterprise Security Package.
ms.service: hdinsight
ms.topic: conceptual
ms.date: 05/22/2024
---

# Configure Apache Hive policies in HDInsight with Enterprise Security Package

In this article, you learn how to configure Apache Ranger policies for Apache Hive. You create two Ranger policies to restrict access to the `hivesampletable`. The `hivesampletable` comes with HDInsight clusters. After you configure the policies, you use Excel and Open Database Connectivity (ODBC) driver to connect to Hive tables in HDInsight.

## Prerequisites

* An HDInsight cluster with Enterprise Security Package (ESP). For more information, see [Configure HDInsight clusters with ESP](./apache-domain-joined-configure-using-azure-adds.md).
* A workstation with Microsoft 365 apps for enterprise, Office 2016, Office 2013 Professional Plus, Excel 2013 Standalone, or Office 2010 Professional Plus.

## Connect to the Apache Ranger Admin UI

To connect to the Ranger Admin user interface (UI):

1. From a browser, go to the Ranger Admin UI at `https://CLUSTERNAME.azurehdinsight.net/Ranger/` where `CLUSTERNAME` is the name of your cluster.

   > [!NOTE]
   > Ranger uses different credentials than Apache Hadoop cluster. To prevent browsers by using cached Hadoop credentials, use a new InPrivate browser window to connect to the Ranger Admin UI.

1. Sign in by using the cluster administrator domain username and password:

    :::image type="content" source="./media/apache-domain-joined-run-hive/hdinsight-domain-joined-ranger-home-page.png" alt-text="Screenshot that shows the HDInsight ESP Ranger home page." border="true":::

    Currently, Ranger only works with Yarn and Hive.

## Create domain users

For information on how to create `hiveruser1` and `hiveuser2`, see [Create an HDInsight cluster with ESP](apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp). You use the two user accounts in this article.

## Create Ranger policies

In this section, you create two Ranger policies for accessing `hivesampletable`. You give select permission on different sets of columns. Both users were created by using [Create a HDInsight cluster with ESP](apache-domain-joined-configure-using-azure-adds.md#create-an-hdinsight-cluster-with-esp). In the next section, you test the two policies in Excel.

To create Ranger policies:

1. Open the Ranger Admin UI. See the preceding section, **Connect to Apache Ranger Admin UI**.
1. Under **Hive**, select **CLUSTERNAME_Hive**. You see two preconfigured policies.
1. Select **Add New Policy** and then enter the following values:

    |Property |Value |
    |---|---|
    |Policy Name|read-hivesampletable-all|
    |Hive Database|default|
    |table|hivesampletable|
    |Hive Column|*|
    |Select User|hiveuser1|
    |Permissions|select|

    :::image type="content" source="./media/apache-domain-joined-run-hive/hdinsight-domain-joined-configure-ranger-policy.png" alt-text="Screenshot that shows the HDInsight ESP Ranger Hive policies to configure." border="true":::.

    > [!NOTE]
    > If a domain user isn't populated in **Select User**, wait a few moments for Ranger to sync with Microsoft Entra ID.

1. Select **Add** to save the policy.

1. Repeat the last two steps to create another policy with the following properties:

    |Property |Value |
    |---|---|
    |Policy Name|read-hivesampletable-devicemake|
    |Hive Database|default|
    |table|hivesampletable|
    |Hive column|clientid, devicemake|
    |Select User|hiveuser2|
    |Permissions|select|

## Create a Hive ODBC data source

For instructions on how to create a Hive ODBC data source, see [Create a Hive ODBC data source](../hadoop/apache-hadoop-connect-excel-hive-odbc-driver.md).

 | Property  |Description |
 | --- | --- |
 | Data Source Name | Give a name to your data source. |
 | Host | Enter **CLUSTERNAME.azurehdinsight.net**. For example, use **myHDICluster.azurehdinsight.net**. |
 | Port | Use **443**. (This port changed from 563 to 443.) |
 | Database | Use **Default**. |
 | Hive Server Type | Select **Hive Server 2**. |
 | Mechanism | Select **Azure HDInsight Service**. |
 | HTTP Path | Leave it blank. |
 | User Name | Enter `hiveuser1@contoso158.onmicrosoft.com`. Update the domain name if it's different. |
 | Password | Enter the password for `hiveuser1`. |

Select **Test** before you save the data source.

## Import data into Excel from HDInsight

In the last section, you configured two policies: `hiveuser1` has the select permission on all the columns, and `hiveuser2` has the select permission on two columns. In this section, you impersonate the two users to import data into Excel.

1. Open a new or existing workbook in Excel.

1. On the **Data** tab, go to **Get Data** > **From Other Sources** > **From ODBC** to open the **From ODBC** window.

    :::image type="content" source="./media/apache-domain-joined-run-hive/simbahiveodbc-excel-dataconnection1.png" alt-text="Screenshot that shows the Open data connection wizard." border="true":::

1. From the dropdown list, select the data source name that you created in the last section and then select **OK**.

1. For the first use, an **ODBC driver** dialog opens. Select **Windows** from the left menu. Then select **Connect** to open the **Navigator** window.

1. Wait for the `Select Database and Table` dialog to open. This step can take a few seconds.

1. Select **hivesampletable** > **Next**.

1. Select **Finish**.

1. In the **Import Data** dialog, you can change or specify the query. To do so, select **Properties**. This step can take a few seconds.

1. Select the **Definition** tab. The command text is:

    ```sql
    SELECT * FROM "HIVE"."default"."hivesampletable"`
    ```

   By the Ranger policies you defined, `hiveuser1` has select permission on all the columns. This query works with the credentials for `hiveuser1`, but this query doesn't work with the credentials for `hiveuser2`.

1. Select **OK** to close the **Connection Properties** dialog.

1. Select **OK** to close the **Import Data** dialog.

1. Reenter the password for `hiveuser1` and then select **OK**. It takes a few seconds before the data gets imported to Excel. When it's finished, you see 11 columns of data.

To test the second policy (read-hivesampletable-devicemake) that you created in the last section:

1. Add a new sheet in Excel.
1. Follow the last procedure to import the data. The only change you make is to use the credentials for `hiveuser2` instead of `hiveuser1`. This action fails because `hiveuser2` has permission to see only two columns. You see the following error:

    ```output
    [Microsoft][HiveODBC] (35) Error from Hive: error code: '40000' error message: 'Error while compiling statement: FAILED: HiveAccessControlException Permission denied: user [hiveuser2] does not have [SELECT] privilege on [default/hivesampletable/clientid,country ...]'.
    ```

1. Follow the same procedure to import data. This time, use the credentials for `hiveuser2` and also modify the select statement from:

    ```sql
    SELECT * FROM "HIVE"."default"."hivesampletable"
    ```

    To:

    ```sql
    SELECT clientid, devicemake FROM "HIVE"."default"."hivesampletable"
    ```

    When it's finished, you see two columns of imported data.

## Next steps

* To configure an HDInsight cluster with ESP, see [Configure HDInsight clusters with ESP](./apache-domain-joined-configure-using-azure-adds.md).
* To manage an HDInsight cluster with ESP, see [Manage HDInsight clusters with ESP](apache-domain-joined-manage.md).
* To run Hive queries by using Secure Shell (SSH) on HDInsight clusters with ESP, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md#authentication-domain-joined-hdinsight).
* To connect Hive by using Hive Java Database Connectivity (JDBC), see [Connect to Apache Hive on Azure HDInsight by using the Hive JDBC driver](../hadoop/apache-hadoop-connect-hive-jdbc-driver.md).
* To connect Excel to Hadoop by using Hive ODBC, see [Connect Excel to Apache Hadoop with the Microsoft Hive ODBC drive](../hadoop/apache-hadoop-connect-excel-hive-odbc-driver.md).
* To connect Excel to Hadoop by using Power Query, see [Connect Excel to Apache Hadoop by using Power Query](../hadoop/apache-hadoop-connect-excel-power-query.md).
