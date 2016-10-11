<properties
pageTitle="Use the Microsoft Azure Data Lake Tools for Visual Studio with the Hortonworks Sandbox | Microsoft Azure"
description="Learn how to use the Azure Data Lake Tools for VIsual Studio with the Hortonworks sandbox (running in a local VM.) With these tools, you can create and run Hive and Pig jobs on the sandbox and view job output and history."
services="hdinsight"
documentationCenter=""
authors="Blackmist"
manager="paulettm"
editor="cgronlun"/>

<tags
ms.service="hdinsight"
ms.devlang="na"
ms.topic="article"
ms.tgt_pltfrm="na"
ms.workload="big-data"
ms.date="08/26/2016"
ms.author="larryfr"/>

# Use the Azure Data Lake Tools for Visual Studio with the Hortonworks Sandbox

The Azure Data Lake tools for Visual Studio include tools for working with generic Hadoop clusters, in addition to tools for working with Azure Data Lake and HDInsight. This document provides the steps needed to use the Azure Data Lake tools with the Hortonworks Sandbox running in a local virtual machine.

Using the Hortonworks Sandbox allows you to work with Hadoop locally on your development environment. Once you have developed a solution and want to deploy it at scale, you can then move to an HDInsight cluster.

## Prerequisites

* The Hortonworks Sandbox running in a virtual machine on your development environment. This document was written and tested with the sandbox running in Oracle VirtualBox, which was configured using the information in the [Get started in the Hadoop ecosystem](hdinsight-hadoop-emulator-get-started.md) document.

* Visual Studio 2013 or 2015, any edition.

* The [Azure SDK for .NET](https://azure.microsoft.com/downloads/) 2.7.1 or higher

* [Azure Data Lake Tools for Visual Studio](https://www.microsoft.com/download/details.aspx?id=49504)

## Configure passwords for the sandbox

Make sure that the Hortonworks Sandbox is running, then follow the steps in [Get started in the Hadoop ecosystem](hdinsight-hadoop-emulator-get-started.md#set-passwords) to configure the password for the SSH `root` account, and the Ambari `admin` account. These passwords will be used when connecting to the sandbox from Visual Studio.

## Connect the tools to the sandbox

1. Open Visual Studio, and select __View__, then __Server Explorer__.

2. From __Server Explorer__, right click the __HDInsight__ entry, and then select __Connect to HDInsight Emulator__.

    ![Connect to HDInsight Emulator](./media/hdinsight-hadoop-emulator-visual-studio/connect-emulator.png)

3. From the __Connect to HDInsight Emulator__ dialog, enter the password that you configured for Ambari.

    ![Enter Ambari password](./media/hdinsight-hadoop-emulator-visual-studio/enter-ambari-password.png)

    Select __Next__ to continue.

4. Use the __Password__ field to enter the password you configured for the `root` account. Leave the other fields at the default value.

    ![Enter root password](./media/hdinsight-hadoop-emulator-visual-studio/enter-root-password.png)

    Select __Next__ to continue.

5. Wait for validation of the services to complete. In some cases, validation may fail and prompt you to update the configuration. When this happens, select the __update__ button and wait for the configuration and verification for the service to complete.

    ![Errors and update button](./media/hdinsight-hadoop-emulator-visual-studio/fail-and-update.png)

    > [AZURE.NOTE] The update process uses Ambari to modify the Hortonworks Sandbox configuration to what is expected by the Azure Data Lake tools for Visual Studio.

    Once validation has completed, select __Finish__ to complete configuration.

    ![Finish connecting](./media/hdinsight-hadoop-emulator-visual-studio/finished-connect.png)

    > [AZURE.NOTE] Depending on the speed of your development environment, and the amount of memory allocated to the virtual machine, it can take several minutes to configure and validate the services.

After following these steps, you now have an "HDInsight local cluster" entry in Server Explorer under the HDInsight section.

## Write a Hive query

Hive provides a SQL-like query language (HiveQL,) for working with structured data. Use the following steps to learn how to run ad-hoc queries against the local cluster.

1. In __Server Explorer__, right-click on the entry for the local cluster that you added previously, and then select __Write a Hive query__.

    ![Write a hive query](./media/hdinsight-hadoop-emulator-visual-studio/write-hive-query.png)

    This opens a new query window that allows you to quickly type up and submit a query to the local cluster.

2. In the new query window, enter the following:

        select count(*) from sample_08;
    
    From the top of the query window, make sure that configuration for the local cluster is selected, and then select __Submit__. Leave the other values (__Batch__ and server name,) at the default values.

    ![query window and submit button](./media/hdinsight-hadoop-emulator-visual-studio/submit-hive.png)

    Note that you can also use the drop down menu next to __Submit__ to select __Advanced__. This opens a dialog that lets you provide additional options when submitting the job.

    ![advanced submit](./media/hdinsight-hadoop-emulator-visual-studio/advanced-hive.png)

3. Once you submit the query, the job status will appear. This provides information on the job as it is processed by Hadoop. The __Job State__ entry provides the current status of the job. The state will be updated periodically, or you can use the refresh icon to manually refresh the state.

    ![Job state](./media/hdinsight-hadoop-emulator-visual-studio/job-state.png)

    Once the __Job Status__ changes to __Finished__, a Directed Acyclic Graph (DAG) is displayed. This describes the execution path that was determined by Tez (the default execution engine for Hive on the local cluster.) 
    
    > [AZURE.NOTE] Tez is also the default when using Linux-based HDInsight clusters. It is not the default on Windows-based HDInsight; to use it there, you must add the line `set hive.execution.engine = tez;` to the beginning of your Hive query. 

    Use the __Job Output__ link to view the output. In this case, it is __823__; the number of rows in the sample_08 table. You can view diagnostics information about the job by using the __Job Log__ and __Download YARN Log__ links.

4. You can also run Hive jobs interactively by changing the __Batch__ field to __Interactive__, and then select __Execute__. 

    ![Interactive query](./media/hdinsight-hadoop-emulator-visual-studio/interactive-query.png)

    This streams the output log generated during processing to the __HiveServer2 Output__ window.
    
    > [AZURE.NOTE] This is the same information that is available from the __Job Log__ link after a job has completed.

    ![HiveServer2 output](./media/hdinsight-hadoop-emulator-visual-studio/hiveserver2-output.png)

## Create a Hive project

You can also create a project that contains multiple Hive scripts. This is useful when you have related scripts that you need to keep together, or maintain using a version control systems.

1. In Visual Studio, select __File__, __New__, and then__Project__.

2. From the list of projects, expand __Templates__, __Azure Data Lake__ and then select __HIVE (HDInsight)__. From the list of templates, select __Hive Sample__. Enter a name and location, then select __OK__.

    ![HIVE (HDInsight) template](./media/hdinsight-hadoop-emulator-visual-studio/new-hive-project.png)

The __Hive Sample__ project contains two scripts, __WebLogAnalysis.hql__ and __SensorDataAnalysis.hql__. You can submit these using the same __Submit__ button at the top of the window.

## Create a Pig project

While Hive provides a SQL-like language for working with structured data, Pig provides a language (Pig Latin,) that allows you to develop a pipeline of transformations that are applied to your data. Use the following steps to use Pig with the local cluster.

1. Open Visual Studio and select __File__, __New__, and then __Project__. From the list of projects, expand __Templates__, __Azure Data Lake__, and then select __Pig (HDInsight)__. From the list of templates, select __Pig Application__. Enter a name, location, and then select __OK__.

    ![Pig (HDInsight) project](./media/hdinsight-hadoop-emulator-visual-studio/new-pig.png)

2. Enter the following as the contents of the __script.pig__ file that was created with this project.

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

    While Pig uses a different language than Hive, how you run the jobs is consistent between both languages through the __Submit__ button. Selecting the drop down beside __Submit__ displays an advanced submit dialog for Pig.

    ![Pig advanced submit](./media/hdinsight-hadoop-emulator-visual-studio/advanced-pig.png)
    
3. The job status and output is also displayed the same as a Hive query.

    ![image of a completed pig job](./media/hdinsight-hadoop-emulator-visual-studio/completed-pig.png)

## View jobs

Azure Data Lake Tools also allow you to easily view information about jobs that have been ran on Hadoop. Use the following steps to see the jobs that have been ran on the local cluster.

1. From __Server Explorer__, right-click on the local cluster, and then select __View Jobs__. This will display a list of jobs that have been submitted to the cluster.

    ![View jobs](./media/hdinsight-hadoop-emulator-visual-studio/view-jobs.png)

2. From the list of jobs, select one to view the job details.

    ![select a job](./media/hdinsight-hadoop-emulator-visual-studio/view-job-details.png)

    The information displayed is similar to what you see after running a Hive or Pig query, complete with links to view the output and log information.

3. You can also modify and resubmit the job from here.

## View Hive databases

1. In __Server Explorer__, expand the __HDInsight local cluster__ entry, and then expand __Hive Databases__. This will reveal the __Default__ and __xademo__ databases on the local cluster. Expanding a database reveals the tables within the database.

    ![expanded databases](./media/hdinsight-hadoop-emulator-visual-studio/expanded-databases.png)

2. Expanding a table displays the columns for that table. You can right-click a table and select __View Top 100 Rows__ to quickly view the data.

    ![hive databases view](./media/hdinsight-hadoop-emulator-visual-studio/view-100.png)

### Database and Table properties

You may have noticed that you can select to view __Properties__ on a database or table. This will show details for the selected item in the properties window.

![Properties](./media/hdinsight-hadoop-emulator-visual-studio/properties.png)

### Create a table

To create a new table, right-click a database, and then select __Create Table__.

![Create table](./media/hdinsight-hadoop-emulator-visual-studio/create-table.png)

You can then create the table using a form. You can see the raw HiveQL that will be used to create the table at the bottom of this page.

![create table form](./media/hdinsight-hadoop-emulator-visual-studio/create-table-form.png)

## Next steps

* [Learning the ropes of the Hortonworks Sandbox](http://hortonworks.com/hadoop-tutorial/learning-the-ropes-of-the-hortonworks-sandbox/)
* [Hadoop tutorial - Getting started with HDP](http://hortonworks.com/hadoop-tutorial/hello-world-an-introduction-to-hadoop-hcatalog-hive-and-pig/)