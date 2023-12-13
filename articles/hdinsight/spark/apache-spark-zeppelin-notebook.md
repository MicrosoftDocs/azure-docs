---
title: Zeppelin notebooks & Apache Spark cluster - Azure HDInsight
description: Step-by-step instructions on how to use Zeppelin notebooks with Apache Spark clusters on Azure HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive,seoapr2020
ms.date: 05/26/2023
---

# Use Apache Zeppelin notebooks with Apache Spark cluster on Azure HDInsight

HDInsight Spark clusters include [Apache Zeppelin](https://zeppelin.apache.org/) notebooks. Use the notebooks to run Apache Spark jobs. In this article, you learn how to use the Zeppelin notebook on an HDInsight cluster.

## Prerequisites

* An Apache Spark cluster on HDInsight. For instructions, see [Create Apache Spark clusters in Azure HDInsight](apache-spark-jupyter-spark-sql.md).
* The URI scheme for your clusters primary storage. The scheme would be `wasb://` for Azure Blob Storage, `abfs://` for Azure Data Lake Storage Gen2 or `adl://` for Azure Data Lake Storage Gen1. If secure transfer is enabled for Blob Storage, the URI would be `wasbs://`.  For more information, see [Require secure transfer in Azure Storage](../../storage/common/storage-require-secure-transfer.md) .

## Launch an Apache Zeppelin notebook

1. From the Spark cluster **Overview**, select **Zeppelin notebook** from **Cluster dashboards**. Enter the admin credentials for the cluster.  

   > [!NOTE]  
   > You may also reach the Zeppelin Notebook for your cluster by opening the following URL in your browser. Replace **CLUSTERNAME** with the name of your cluster:
   >
   > `https://CLUSTERNAME.azurehdinsight.net/zeppelin`

2. Create a new notebook. From the header pane, navigate to **Notebook** > **Create new note**.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/hdinsight-create-zeppelin-notebook.png " alt-text="Create a new Zeppelin notebook" border="true":::

    Enter a name for the notebook, then select **Create Note**.

3. Ensure the notebook header shows a connected status. It's denoted by a green dot in the top-right corner.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/hdinsight-zeppelin-connected.png " alt-text="Zeppelin notebook status" border="true":::

4. Load sample data into a temporary table. When you create a Spark cluster in HDInsight, the sample data file, `hvac.csv`, is copied to the associated storage account under `\HdiSamples\SensorSampleData\hvac`.

    In the empty paragraph that is created by default in the new notebook, paste the following snippet.

    ```scala
    %livy2.spark
    //The above magic instructs Zeppelin to use the Livy Scala interpreter

    // Create an RDD using the default Spark context, sc
    val hvacText = sc.textFile("wasbs:///HdiSamples/HdiSamples/SensorSampleData/hvac/HVAC.csv")

    // Define a schema
    case class Hvac(date: String, time: String, targettemp: Integer, actualtemp: Integer, buildingID: String)

    // Map the values in the .csv file to the schema
    val hvac = hvacText.map(s => s.split(",")).filter(s => s(0) != "Date").map(
        s => Hvac(s(0),
                s(1),
                s(2).toInt,
                s(3).toInt,
                s(6)
        )
    ).toDF()

    // Register as a temporary table called "hvac"
    hvac.registerTempTable("hvac")
    ```

    Press **SHIFT + ENTER** or select the **Play** button for the paragraph to run the snippet. The status on the right-corner of the paragraph should progress from READY, PENDING, RUNNING to FINISHED. The output shows up at the bottom of the same paragraph. The screenshot looks like the following image:

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/hdinsight-zeppelin-load-data.png " alt-text="Create a temporary table from raw data" border="true":::

    You can also provide a title to each paragraph. From the right-hand corner of the paragraph, select the **Settings** icon (sprocket), and then select **Show title**.  

    > [!NOTE]  
    > %spark2 interpreter is not supported in Zeppelin notebooks across all HDInsight versions, and %sh interpreter will not be supported from HDInsight 4.0 onwards.

5. You can now run Spark SQL statements on the `hvac` table. Paste the following query in a new paragraph. The query retrieves the building ID. Also the difference between the target and actual temperatures for each building on a given date. Press **SHIFT + ENTER**.

    ```sql
    %sql
    select buildingID, (targettemp - actualtemp) as temp_diff, date from hvac where date = "6/1/13"
    ```  

    The **%sql** statement at the beginning tells the notebook to use the Livy Scala interpreter.

6. Select the **Bar Chart** icon to change the display.  **settings**, appear after you have selected **Bar Chart**, allows you to choose **Keys**, and **Values**.  The following screenshot shows the output.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/hdinsight-zeppelin-spark-query-1.png " alt-text="Run a Spark SQL statement using the notebook1" border="true":::

7. You can also run Spark SQL statements using variables in the query. The next snippet shows how to define a variable, `Temp`, in the query with the possible values you want to query with. When you first run the query, a drop-down is automatically populated with the values you specified for the variable.

    ```sql
    %sql  
    select buildingID, date, targettemp, (targettemp - actualtemp) as temp_diff from hvac where targettemp > "${Temp = 65,65|75|85}"
    ```

    Paste this snippet in a new paragraph and press **SHIFT + ENTER**. Then select **65** from the **Temp** drop-down list.

8. Select the **Bar Chart** icon to change the display.  Then select **settings** and make the following changes:

   * **Groups:**  Add **targettemp**.  
   * **Values:** 1. Remove **date**.  2. Add **temp_diff**.  3.  Change the aggregator from **SUM** to **AVG**.  

     The following screenshot shows the output.

     :::image type="content" source="./media/apache-spark-zeppelin-notebook/hdinsight-zeppelin-spark-query-2.png " alt-text="Run a Spark SQL statement using the notebook2" border="true":::

## How do I use external packages with the notebook?

Zeppelin notebook in Apache Spark cluster on HDInsight can use external, community-contributed packages that aren't included in the cluster. Search the [Maven repository](https://search.maven.org/) for the complete list of packages that are available. You can also get a list of available packages from other sources. For example, a complete list of community-contributed packages is available at [Spark Packages](https://spark-packages.org/).

In this article, you'll see how to use the [spark-csv](https://search.maven.org/#artifactdetails%7Ccom.databricks%7Cspark-csv_2.10%7C1.4.0%7Cjar) package with the Jupyter Notebook.

1. Open interpreter settings. From the top-right corner, select the logged in user name, then select **Interpreter**.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/zeppelin-launch-interpreter.png " alt-text="Launch interpreter" border="true":::

2. Scroll to **livy2**, then select **edit**.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/zeppelin-use-external-package-1.png " alt-text="Change interpreter settings1" border="true":::

3. Navigate to key `livy.spark.jars.packages`, and set its value in the format `group:id:version`. So, if you want to use the [spark-csv](https://search.maven.org/#artifactdetails%7Ccom.databricks%7Cspark-csv_2.10%7C1.4.0%7Cjar) package, you must set the value of the key to `com.databricks:spark-csv_2.10:1.4.0`.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/zeppelin-use-external-package-2.png " alt-text="Change interpreter settings2" border="true":::

    Select **Save** and then **OK** to restart the Livy interpreter.

4. If you want to understand how to arrive at the value of the key entered above, here's how.

    a. Locate the package in the Maven Repository. For this article, we used [spark-csv](https://search.maven.org/#artifactdetails%7Ccom.databricks%7Cspark-csv_2.10%7C1.4.0%7Cjar).

    b. From the repository, gather the values for **GroupId**, **ArtifactId**, and **Version**.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/use-external-packages-with-jupyter.png " alt-text="Use external packages with Jupyter Notebook" border="true":::

    c. Concatenate the three values, separated by a colon (**:**).

    ```
    com.databricks:spark-csv_2.10:1.4.0
    ```

## Where are the Zeppelin notebooks saved?

The Zeppelin notebooks are saved to the cluster headnodes. So, if you delete the cluster, the notebooks will be deleted as well. If you want to preserve your notebooks for later use on other clusters, you must export them after you have finished running the jobs. To export a notebook, select the **Export** icon as shown in the image below.

:::image type="content" source="./media/apache-spark-zeppelin-notebook/zeppelin-download-notebook.png " alt-text="Download notebook" border="true":::

This action saves the notebook as a JSON file in your download location.

## Use `Shiro` to Configure Access to Zeppelin Interpreters in Enterprise Security Package (ESP) Clusters

As noted above, the `%sh` interpreter isn't supported from HDInsight 4.0 onwards. Furthermore, since `%sh` interpreter introduces potential security issues, such as access keytabs using shell commands, it has been removed from HDInsight 3.6 ESP clusters as well. It means `%sh` interpreter isn't available when clicking **Create new note** or in the Interpreter UI by default.

Privileged domain users can use the `Shiro.ini` file to control access to the Interpreter UI. Only these users can create new `%sh` interpreters and set permissions on each new `%sh` interpreter. To control access using the `shiro.ini` file, use the following steps:

1. Define a new role using an existing domain group name. In the following example, `adminGroupName` is a group of privileged users in AAD. Don't use special characters or white spaces in the group name. The characters after `=` give the permissions for this role. `*` means the group has full permissions.

    ```
    [roles]
    adminGroupName = *
    ```

2. Add the new role for access to Zeppelin interpreters. In the following example, all users in `adminGroupName` are given access to Zeppelin interpreters and can create new interpreters. You can put multiple roles between the brackets in `roles[]`, separated by commas. Then, users that have the necessary permissions, can access Zeppelin interpreters.

    ```
    [urls]
    /api/interpreter/** = authc, roles[adminGroupName]
    ```

### Example shiro.ini for multiple domain groups:

   ```
   [main]
   anyofrolesuser = org.apache.zeppelin.utils.AnyOfRolesUserAuthorizationFilter

   [roles]
   group1 = *
   group2 = *
   group3 = *

   [urls]
   /api/interpreter/** = authc, anyofrolesuser[group1, group2, group3]
   ```
   
## Livy session management

The first code paragraph in your Zeppelin notebook creates a new Livy session in your cluster. This session is shared across all Zeppelin notebooks that you later create. If the Livy session is killed for any reason, jobs won't run from the Zeppelin notebook.

In such a case, you must do the following steps before you can start running jobs from a Zeppelin notebook.  

1. Restart the Livy interpreter from the Zeppelin notebook. To do so, open interpreter settings by selecting the logged in user name from the top-right corner, then select **Interpreter**.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/zeppelin-launch-interpreter.png " alt-text="Launch interpreter" border="true":::

2. Scroll to **livy2**, then select **restart**.

    :::image type="content" source="./media/apache-spark-zeppelin-notebook/hdinsight-zeppelin-restart-interpreter.png " alt-text="Restart the Livy interpreter" border="true":::

3. Run a code cell from an existing Zeppelin notebook. This  code creates a new Livy session in the HDInsight cluster.

## General information

### Validate service

To validate the service from Ambari, navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/ZEPPELIN/summary` where CLUSTERNAME is the name of your cluster.

To validate the service from a command line, SSH to the head node. Switch user to zeppelin using command `sudo su zeppelin`. Status commands:

|Command |Description |
|---|---|
|`/usr/hdp/current/zeppelin-server/bin/zeppelin-daemon.sh status`|Service status.|
|`/usr/hdp/current/zeppelin-server/bin/zeppelin-daemon.sh --version`|Service version.|
|`ps -aux | grep zeppelin`|Identify PID.|

### Log locations

|Service |Path |
|---|---|
|zeppelin-server|/usr/hdp/current/zeppelin-server/|
|Server Logs|/var/log/zeppelin|
|Configuration Interpreter, `Shiro`, site.xml, log4j|/usr/hdp/current/zeppelin-server/conf or /etc/zeppelin/conf|
|PID directory|/var/run/zeppelin|

### Enable debug logging

1. Navigate to `https://CLUSTERNAME.azurehdinsight.net/#/main/services/ZEPPELIN/summary` where CLUSTERNAME is the name of your cluster.

1. Navigate to **CONFIGS** > **Advanced zeppelin-log4j-properties** > **log4j_properties_content**.

1. Modify `log4j.appender.dailyfile.Threshold = INFO` to `log4j.appender.dailyfile.Threshold = DEBUG`.

1. Add `log4j.logger.org.apache.zeppelin.realm=DEBUG`.

1. Save changes and restart service.

## Next steps

* [Overview: Apache Spark on Azure HDInsight](apache-spark-overview.md)
* [Kernels available for Jupyter Notebook in Apache Spark cluster for HDInsight](apache-spark-jupyter-notebook-kernels.md)
* [Install Jupyter on your computer and connect to an HDInsight Spark cluster](apache-spark-jupyter-notebook-install-locally.md)
