---
title: Use Ambari Tez View with HDInsight - Azure | Microsoft Docs
description: Learn how to use the Ambari Tez view to debug Tez jobs on HDInsight.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: 9c39ea56-670b-4699-aba0-0f64c261e411
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 04/14/2017
ms.author: larryfr

---
# Use Ambari Views to debug Tez Jobs on HDInsight

The Ambari Web UI for HDInsight contains a Tez view that can be used to understand and debug jobs that use Tez. The Tez view allows you to visualize the job as a graph of connected items, drill into each item, and retrieve statistics and logging information.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight component versioning](hdinsight-component-versioning.md#hdi-version-33-nearing-retirement-date).

## Prerequisites

* A Linux-based HDInsight cluster. For steps on creating a cluster, see [Get started using Linux-based HDInsight](hdinsight-hadoop-linux-tutorial-get-started.md).
* A modern web browser that supports HTML5.

## Understanding Tez

Tez is an extensible framework for data processing in Hadoop that provides greater speeds than traditional MapReduce processing. For Linux-based HDInsight clusters, it is the default engine for Hive.

Tez creates a Directed Acyclic Graph (DAG) that describes the order of actions required by jobs. Individual actions are called vertices, and execute a piece of the overall job. The actual execution of the work described by a vertex is called a task, and may be distributed across multiple nodes in the cluster.

### Understanding the Tez view

The Tez view provides both historical information and information on processes that are running. This information shows how a job is distributed across clusters. It also displays counters used by tasks and vertices, and error information related to the job. It may offer useful information in the following scenarios:

* Monitoring long-running processes, viewing the progress of map and reduce tasks.
* Analyzing historical data for successful or failed processes to learn how processing could be improved or why it failed.

## Generate a DAG

The Tez view only contains data if a job that uses the Tez engine is currently running, or has been ran previously. Simple Hive queries can be resolved without using Tez. More complex queries that do filtering, grouping, ordering, joins, etc. use the Tez engine.

Use the following steps to run a Hive query that uses Tez:

1. In a web browser, navigate to https://CLUSTERNAME.azurehdinsight.net, where **CLUSTERNAME** is the name of your HDInsight cluster.

2. From the menu at the top of the page, select the **Views** icon. This icon looks like a series of squares. In the dropdown that appears, select **Hive view**.

    ![Selecting Hive View](./media/hdinsight-debug-ambari-tez-view/selecthive.png)

3. When the Hive view loads, paste the following query into the Query Editor, and then click **execute**.

        select market, state, country from hivesampletable where deviceplatform='Android' group by market, country, state;

    Once the job has completed, you should see the output displayed in the **Query Process Results** section. The results should be similar to the following text:

        market  state       country
        en-GB   Hessen      Germany
        en-GB   Kingston    Jamaica

4. Select the **Log** tab. You see information similar to the following text:

        INFO : Session is already open
        INFO :

        INFO : Status: Running (Executing on YARN cluster with App id application_1454546500517_0063)

    Save the **App id** value, as this value is used in the next section.

## Use the Tez View

1. From the menu at the top of the page, select the **Views** icon. In the dropdown that appears, select **Tez view**.

    ![Selecting Tez view](./media/hdinsight-debug-ambari-tez-view/selecttez.png)

2. When the Tez view loads, you see a list of DAGs that are currently running, or have been ran on the cluster.

    ![All DAGS](./media/hdinsight-debug-ambari-tez-view/alldags.png)

3. If you have only one entry, it is for the query that you ran in the previous section. If you have multiple entries, you can search by entering the application ID in the **Application ID** field, and then press enter.

4. Select the **Dag Name**. Information about the DAG is displayed. You can also download a zip of JSON files containing this information.

    ![DAG Details](./media/hdinsight-debug-ambari-tez-view/dagdetails.png)

5. Above the **DAG Details** are several links that can be used to display information about the DAG.

   * **DAG Counters**: Displays counters information for this DAG.
   * **Graphical View**: Displays a graphical representation of this DAG.
   * **All Vertices**: Displays a list of the vertices in this DAG.
   * **All Tasks**: Displays a list of the tasks for all vertices in this DAG.
   * **All TaskAttempts**: Displays information about the attempts to run tasks for this DAG.

     > [!NOTE]
     > If you scroll the column display for Vertices, Tasks and TaskAttempts, notice that there are links to view **counters** and **view or download logs** for each row.

     If there was a failure with the job, the DAG Details display a status of FAILED, along with links to information about the failed task. Diagnostics information is displayed beneath the DAG details.

     ![A DAG Details screen detailing a failure](./media/hdinsight-debug-ambari-tez-view/faileddag.png)

6. Select **Graphical View**. This view displays a graphical representation of the DAG. You can place the mouse over each vertex in the view to display information about it.

    ![Graphical view](./media/hdinsight-debug-ambari-tez-view/dagdiagram.png)

7. Select a vertex to load the **Vertex Details** for that item. Select the **Map 1** vertex to display details for this item.

    ![Vertex details](./media/hdinsight-debug-ambari-tez-view/vertexdetails.png)

8. You now have links at the top of the page that are related to vertices and tasks.

   > [!NOTE]
   > You can also arrive at this page by going back to **DAG Details**, selecting **Vertex Details**, and then selecting the **Map 1** vertex.

   * **Vertex Counters**: Displays counter information for this vertex.
   * **Tasks**: Displays tasks for this vertex.
   * **Task Attempts**: Displays information about attempts to run tasks for this vertex.
   * **Sources & Sinks**: Displays data sources and sinks for this vertex.

     > [!NOTE]
     > As with the previous menu, you can scroll the column display for Tasks, Task Attempts, and Sources & Sinks__ to display links to more information for each item.

9. Select **Tasks**, and then select the item named **00_000000**. The **Task Details** for this task appear. From this screen, you can view **Task Counters** and **Task Attempts**.

   ![Task details](./media/hdinsight-debug-ambari-tez-view/taskdetails.png)

## Next Steps

Now that you have learned how to use the Tez view, learn more about [Using Hive on HDInsight](hdinsight-use-hive.md).

For more detailed technical information on Tez, see the [Tez page at Hortonworks](http://hortonworks.com/hadoop/tez/).

For more information on using Ambari with HDInsight, see [Manage HDInsight clusters using the Ambari Web UI](hdinsight-hadoop-manage-ambari.md)
