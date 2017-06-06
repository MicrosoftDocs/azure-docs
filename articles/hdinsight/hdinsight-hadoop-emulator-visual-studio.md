---
title: Data Lake Tools for Visual Studio with Hortonworks Sandbox - Azure HDInsight | Microsoft Docs
description: Learn how to use the Azure Data Lake Tools for Visual Studio with the Hortonworks sandbox running in a local VM. With these tools, you can create and run Hive and Pig jobs on the sandbox and view job output and history.
services: hdinsight
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: e3434c45-95d1-4b96-ad4c-fb59870e2ff0
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 05/22/2017
ms.author: larryfr

---
# Use the Azure Data Lake Tools for Visual Studio with the Hortonworks Sandbox

Learn how to use the Data Lake tools for Visual Studio with the Hortonworks Sandbox.

The Data Lake Tools include tools for working with generic Hadoop clusters, in addition to tools for working with Azure Data Lake and HDInsight. This document provides the steps needed to use the Azure Data Lake tools with the Hortonworks Sandbox running in a local virtual machine.

Using the Hortonworks Sandbox allows you to work with Hadoop locally on your development environment. Once you have developed a solution and want to deploy it at scale, you can then move to an HDInsight cluster.

## Prerequisites

* The Hortonworks Sandbox running in a virtual machine on your development environment. This document was written and tested with the sandbox running in Oracle VirtualBox, which was configured using the information in the [Get started in the Hadoop ecosystem](hdinsight-hadoop-emulator-get-started.md) document.

* Visual Studio 2013, 2015, or 2017 any edition.

* The [Azure SDK for .NET](https://azure.microsoft.com/downloads/) 2.7.1 or higher.

* [Azure Data Lake Tools for Visual Studio](https://www.microsoft.com/download/details.aspx?id=49504).

## Configure passwords for the sandbox

Make sure that the Hortonworks Sandbox is running, then follow the steps in [Get started in the Hadoop ecosystem](hdinsight-hadoop-emulator-get-started.md#set-sandbox-passwords). These steps configure the password for the SSH `root` account, and the Ambari `admin` account. These passwords are used when connecting to the sandbox from Visual Studio.

## Connect the tools to the sandbox

1. Open Visual Studio, and select **View**, then **Server Explorer**.

2. From **Server Explorer**, right-click the **HDInsight** entry, and then select **Connect to HDInsight Emulator**.

    ![Connect to HDInsight Emulator](./media/hdinsight-hadoop-emulator-visual-studio/connect-emulator.png)

3. From the **Connect to HDInsight Emulator** dialog, enter the password that you configured for Ambari.

    ![Enter Ambari password](./media/hdinsight-hadoop-emulator-visual-studio/enter-ambari-password.png)

    Select **Next** to continue.

4. Use the **Password** field to enter the password you configured for the `root` account. Leave the other fields at the default value.

    ![Enter root password](./media/hdinsight-hadoop-emulator-visual-studio/enter-root-password.png)

    Select **Next** to continue.

5. Wait for validation of the services to complete. In some cases, validation may fail and prompt you to update the configuration. If validation fails, select the **update** button and wait for the configuration and verification for the service to complete.

    ![Errors and update button](./media/hdinsight-hadoop-emulator-visual-studio/fail-and-update.png)

    > [!NOTE]
    > The update process uses Ambari to modify the Hortonworks Sandbox configuration to what is expected by the Azure Data Lake tools for Visual Studio.

    Once validation has completed, select **Finish** to complete configuration.

    ![Finish connecting](./media/hdinsight-hadoop-emulator-visual-studio/finished-connect.png)

    > [!NOTE]
    > Depending on the speed of your development environment, and the amount of memory allocated to the virtual machine, it can take several minutes to configure and validate the services.

After following these steps, you now have an "HDInsight local cluster" entry in Server Explorer under the HDInsight section.

## Write a Hive query

Hive provides a SQL-like query language (HiveQL) for working with structured data. Use the following steps to learn how to run ad-hoc queries against the local cluster.

1. In **Server Explorer**, right-click on the entry for the local cluster that you added previously, and then select **Write a Hive query**.

    ![Write a hive query](./media/hdinsight-hadoop-emulator-visual-studio/write-hive-query.png)

    This opens a new query window that allows you to quickly type up and submit a query to the local cluster.

2. In the new query window, enter the following command:

        select count(*) from sample_08;

    From the top of the query window, make sure that configuration for the local cluster is selected, and then select **Submit**. Leave the other values (**Batch** and server name) at the default values.

    ![query window and submit button](./media/hdinsight-hadoop-emulator-visual-studio/submit-hive.png)

    You can also use the drop-down menu next to **Submit** to select **Advanced**. Advanced options allow you to provide additional options when submitting the job.

    ![advanced submit](./media/hdinsight-hadoop-emulator-visual-studio/advanced-hive.png)

3. Once you submit the query, the job status appears. The job status displays information on the job as it is processed by Hadoop. The **Job State** entry provides the status of the job. The state is updated periodically, or you can use the refresh icon to manually refresh the state.

    ![Job state](./media/hdinsight-hadoop-emulator-visual-studio/job-state.png)

    Once the **Job Status** changes to **Finished**, a Directed Acyclic Graph (DAG) is displayed. This diagram describes the execution path that was determined by Tez (the default execution engine for Hive on the local cluster.)

    > [!NOTE]
    > Tez is also the default when using Linux-based HDInsight clusters. It is not the default on Windows-based HDInsight; to use it there, you must add the line `set hive.execution.engine = tez;` to the beginning of your Hive query.

    Use the **Job Output** link to view the output. In this case, it is **823**; the number of rows in the sample_08 table. You can view diagnostics information about the job by using the **Job Log** and **Download YARN Log** links.

4. You can also run Hive jobs interactively by changing the **Batch** field to **Interactive**, and then select **Execute**.

    ![Interactive query](./media/hdinsight-hadoop-emulator-visual-studio/interactive-query.png)

    An interactive query streams the output log generated during processing to the **HiveServer2 Output** window.

    > [!NOTE]
    > The information is the same that is available from the **Job Log** link after a job has completed.

    ![HiveServer2 output](./media/hdinsight-hadoop-emulator-visual-studio/hiveserver2-output.png)

## Create a Hive project

You can also create a project that contains multiple Hive scripts. A project is useful when you have related scripts that you need to keep together, or maintain using a version control systems.

1. In Visual Studio, select **File**, **New**, and then__Project__.

2. From the list of projects, expand **Templates**, **Azure Data Lake** and then select **HIVE (HDInsight)**. From the list of templates, select **Hive Sample**. Enter a name and location, then select **OK**.

    ![HIVE (HDInsight) template](./media/hdinsight-hadoop-emulator-visual-studio/new-hive-project.png)

The **Hive Sample** project contains two scripts, **WebLogAnalysis.hql** and **SensorDataAnalysis.hql**. You can submit these using the same **Submit** button at the top of the window.

## Create a Pig project

While Hive provides a SQL-like language for working with structured data, Pig works by performing transformations on data. Pig provides a language (Pig Latin) that allows you to develop a pipeline of transformations. Use the following steps to use Pig with the local cluster:

1. Open Visual Studio and select **File**, **New**, and then **Project**. From the list of projects, expand **Templates**, **Azure Data Lake**, and then select **Pig (HDInsight)**. From the list of templates, select **Pig Application**. Enter a name, location, and then select **OK**.

    ![Pig (HDInsight) project](./media/hdinsight-hadoop-emulator-visual-studio/new-pig.png)

2. Enter the following text as the contents of the **script.pig** file that was created with this project.

        a = LOAD '/demo/data/Website/Website-Logs' AS (
            log_id:int,
            ip_address:chararray,
            date:chararray,
            time:chararray,
            landing_page:chararray,
            source:chararray);
        b = FILTER a BY (log_id > 100);
        c = GROUP b BY ip_address;
        DUMP c;

    While Pig uses a different language than Hive, how you run the jobs is consistent between both languages through the **Submit** button. Selecting the drop-down beside **Submit** displays an advanced submit dialog for Pig.

    ![Pig advanced submit](./media/hdinsight-hadoop-emulator-visual-studio/advanced-pig.png)

3. The job status and output is also displayed the same as a Hive query.

    ![image of a completed pig job](./media/hdinsight-hadoop-emulator-visual-studio/completed-pig.png)

## View jobs

Azure Data Lake Tools also allow you to easily view information about jobs that have been ran on Hadoop. Use the following steps to see the jobs that have been ran on the local cluster.

1. From **Server Explorer**, right-click on the local cluster, and then select **View Jobs**. A list of jobs that have been submitted to the cluster is displayed.

    ![View jobs](./media/hdinsight-hadoop-emulator-visual-studio/view-jobs.png)

2. From the list of jobs, select one to view the job details.

    ![select a job](./media/hdinsight-hadoop-emulator-visual-studio/view-job-details.png)

    The information displayed is similar to what you see after running a Hive or Pig query, complete with links to view the output and log information.

3. You can also modify and resubmit the job from here.

## View Hive databases

1. In **Server Explorer**, expand the **HDInsight local cluster** entry, and then expand **Hive Databases**. The **Default** and **xademo** databases on the local cluster are displayed. Expanding a database reveals the tables within the database.

    ![expanded databases](./media/hdinsight-hadoop-emulator-visual-studio/expanded-databases.png)

2. Expanding a table displays the columns for that table. You can right-click a table and select **View Top 100 Rows** to quickly view the data.

    ![hive databases view](./media/hdinsight-hadoop-emulator-visual-studio/view-100.png)

### Database and Table properties

You may have noticed that you can select to view **Properties** on a database or table. Selecting **Properties** displays details for the selected item in the properties window.

![Properties](./media/hdinsight-hadoop-emulator-visual-studio/properties.png)

### Create a table

To create a table, right-click a database, and then select **Create Table**.

![Create table](./media/hdinsight-hadoop-emulator-visual-studio/create-table.png)

You can then create the table using a form. You can see the raw HiveQL that is used to create the table at the bottom of this page.

![create table form](./media/hdinsight-hadoop-emulator-visual-studio/create-table-form.png)

## Next steps

* [Learning the ropes of the Hortonworks Sandbox](http://hortonworks.com/hadoop-tutorial/learning-the-ropes-of-the-hortonworks-sandbox/)
* [Hadoop tutorial - Getting started with HDP](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig/)
