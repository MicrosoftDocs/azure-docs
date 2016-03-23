<properties
   pageTitle="Get started with R Server on HDInsight | Azure"
   description="Learn how to create a Apache Spark on HDInsight (Hadoop) cluster that includes R Server, and then submit an R script on the cluster."
   services="HDInsight"
   documentationCenter=""
   authors="jeffstokes72"
   manager="paulettem"
   editor="cgronlun"
/>

<tags
   ms.service="HDInsight"
   ms.devlang="R"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-services"
   ms.date="03/23/2016"
   ms.author=jeffstok"/>

# Get started using R Server on HDInsight

The premium tier offering for HDInsight includes R Server as part of your HDInsight cluster. This allows R scripts to use MapReduce and Spark to run distributed computations. In this document, you will learn how to create a new R Server on HDInsight cluster using the Spark cluster type, then run an R script that demonstrates using both MapReduce and Spark for distributed computations.

![Diagram of the workflow for this document](./media/hdinsight-getting-started-with-r/rgettingstarted.png)

## Prerequisites

* __An Azure subscription__: Before you begin this tutorial, you must have an Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/) for more information.

* __A Secure Shell (SSH) client: An SSH client is used to remotely connect to the HDInsight cluster and run commands directly on the cluster. Linux, Unix, and OS X systems provide an SSH client through the `ssh` command. For Windows systems, we recommend [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

    * __SSH keys (optional)__: You can secure the SSH account used to connect to the cluster using either a password or a public key. Using a password is easier, and allows you to get started without having to create a public/private key pair; however, using a key is more secure.
    
        The steps in this document assume that you are using a password. For information on how to create and use SSH keys with HDInsight, see the following documents:
        
        * [Use SSH with HDInsight from Linux, Unix, or OS X clients](hdinsight-hadoop-linux-use-ssh-unix.md)
        
        * [Use SSH with HDInsight from Windows clients](hdinsight-hadoop-linux-use-ssh-windows.md)

## Create the cluster

> [AZURE.NOTE] The steps in this document create an R Server on HDInsight using basic confiuration information. For other cluster configuration settings (such as using additional storage, Azure Virtual Network, or a metastore for Hive,) see [Create Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select __NEW__, __Data + Analytics__, and then __HDInsight__.

    ![Image of creating a new cluster](./media/hdinsight-getting-started-with-r/newcluster.png)

3. Enter a name for the cluster in the __Cluster Name__ field. If you have multiple Azure subscriptions, use the __Subscription__ entry to select the one you want to use.

    ![Cluster name and subscription selections](./media/hdinsight-getting-started-with-r/clustername.png)

4. Select __Select Cluster Type__. On the __Cluster Type__ blade, select the following options:

    * __Cluster Type__: Spark
    
    * __Cluster Tier__: Premium

    Leave the other options at the default values, then use the __Select__ button to save the cluster type.
    
    ![Cluster type blade screenshot](./media/hdinsight-getting-started-with-r/clustertypeconfig.png)

5. Select **Resource Group** to see a list of existing resource groups and then select the one to create the cluster in. Or, you can select **Create New** and then enter the name of the new resource group. A green check will appear to indicate if the new group name is available.

    > [AZURE.NOTE] This entry will default to one of your existing resource groups, if any are available.
    
    Use the __Select__ button to save the resource group.

6. Select **Credentials**, then enter a **Cluster Login Username** and **Cluster Login Password**.

    Enter an __SSH Username__ and select __Password__, then enter the __SSH Password__ to configure the SSH account. This is used to remotely connect to the cluster using a Secure Shell (SSH) client.
    
    Use the __Select__ button to save the credentials.
    
    ![Credentials blade](./media/hdinsight-getting-started-with-r/clustercredentials.png)

7. Select **Data Source** to select a data source for the cluster. Either select an existing storage account by selecting __Select storage account__ and then selecting the account, or create a new account using the __New__ link in the __Select storage account__ section.

    If you select __New__, you must enter a name for the new storage account. A green check will appear if the name is accepted.

    The __Default Container__ will default to the name of the cluster. Leave this as the value.
    
    Select __Location__ to select the region that the storage account will be located in.
    
    > [AZURE.IMPORTANT] Selecting the location for the default data source will also set the location of the HDInsight cluster. The cluster and default data source must be located in the same region.

    Use the **Select** button to save the data source configuration.
    
    ![Data source blade](./media/hdinsight-getting-started-with-r/datastore.png)

8. Select **Node Pricing Tiers** to display information about the nodes that will be created for this cluster. Leave the number of worker nodes that you need for the cluster at the default of `4`. The estimated cost of the cluster will be shown within the blade.

    ![Node pricing tiers blade](./media/hdinsight-getting-started-with-r/pricingtier.png)

    Use the **Select** button to save the node pricing configuration.
    
9. On the **New HDInsight Cluster** blade, ensure that **Pin to Startboard** is selected, and then select **Create**. This will create the cluster and add a tile for it to the Startboard of your Azure Portal. The icon will indicate that the cluster is creating, and will change to display the HDInsight icon once creation has completed.

    | While creating | Creationg complete |
    | ------------------ | --------------------- |
    | ![Creating indicator on startboard](./media/hdinsight-getting-started-with-r/provisioning.png) | ![Created cluster tile](./media/hdinsight-getting-started-with-r/provisioned.png) |

    > [AZURE.NOTE] It will take some time for the cluster to be created, usually around 15 minutes. Use the tile on the Startboard, or the **Notifications** entry on the left of the page to check on the creation process.

## Connect to the Spark cluster

Connect to the Spark on HDInsight cluster using SSH:

    ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
    
If you used a password to secure your SSH user account, you will be prompted to enter it. If you used a public key, you may have to use the `-i` parameter to specify the matching private key. For example, `ssh -i ~/.ssh/id_rsa USERNAME@CLUSTERNAME-ssh.azurehdinsight.net`.
    
For more information on using SSH with Linux-based HDInsight, see the following articles:

* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

Once connected, you will arrive at a prompt similar to the following.

    username@hn0-clustername:~$

## Use the R console

1. From the SSH session, use the following command to start the R console.

        R
    
    You will see output similar to the following.
    
        R version 3.2.2 (2015-08-14) -- "Fire Safety"
        Copyright (C) 2015 The R Foundation for Statistical Computing
        Platform: x86_64-pc-linux-gnu (64-bit)

        R is free software and comes with ABSOLUTELY NO WARRANTY.
        You are welcome to redistribute it under certain conditions.
        Type 'license()' or 'licence()' for distribution details.

        Natural language support but running in an English locale

        R is a collaborative project with many contributors.
        Type 'contributors()' for more information and
        'citation()' on how to cite R or R packages in publications.

        Type 'demo()' for some demos, 'help()' for on-line help, or
        'help.start()' for an HTML browser interface to help.
        Type 'q()' to quit R.

        Microsoft R Server version 8.0: an enhanced distribution of R
        Microsoft packages Copyright (C) 2016 Microsoft Corporation

        Type 'readme()' for release notes.

        >

2. From the `>` prompt, you can enter R code. RevoScaleR is included with the R server on HDInsight, so you can easily interact with Hadoop from your R scripts. Use the following command to view the root of the default file system for the HDInsight cluster.

        rxHadoopListFiles("/")
    
    You can also use the WASB style addressing.
    
        rxHadoopListFiles("wasb:///")
        
3. Use the following to copy example data to `wasb:///example/data/

        # Set the NameNode and port for the cluster
        myNameNode <- "default"
        myPort <- 0
        # Set the HDFS (WASB) location of example data
        bigDataDirRoot <- "/example/data"
        # Source for the data to load
        source <-system.file("SampleData/AirlineDemoSmall.csv",      package="RevoScaleR")
        # Directory in bigDataDirRoot to load the data into
        inputDir <- file.path(bigDataDirRoot,"AirlineDemoSmall") 
        # Make the directory
        rxHadoopMakeDir(inputDir)
        # Copy the data from source to input
        rxHadoopCopyFromLocal(source, inputDir)

4. Next, let's create some Factors and define a data source so that we can work with the data.

        # Define the HDFS (WASB) file system
        hdfsFS <- RxHdfsFileSystem(hostName=myNameNode, 
                                   port=myPort)
        # Create Factors for the days of the week
        colInfo <- list(DayOfWeek = list(type = "factor",
             levels = c("Monday", 
                        "Tuesday", 
                        "Wednesday", 
                        "Thursday", 
                        "Friday", 
                        "Saturday", 
                        "Sunday")))
        # Define the data source
        airDS <- RxTextData(file = inputDir, 
                            missingValueString = "M",
                            colInfo  = colInfo, 
                            fileSystem = hdfsFS)

4. Let's run a linear regression over the data using the local compute context.

        # Set a local compute context
        rxSetComputeContext("local")
        # Run a linear regression
        system.time(
            modelLocal <- rxLinMod(ArrDelay~CRSDepTime+DayOfWeek,
                             data = airDS)
        )
        # Display a summary 
        summary(modelLocal) 

    You should see output similar that ends with lines similar to the following.
    
        Residual standard error: 40.39 on 582620 degrees of freedom
        Multiple R-squared: 0.01465
        Adjusted R-squared: 0.01464
        F-statistic:  1238 on 7 and 582620 DF,  p-value: < 2.2e-16
        Condition number: 10.6542

5. Next, let's try using MapReduce for the compute context. The MapReduce context will distribute the processing over all the worker nodes in the HDInsight cluster as a MapReduce job.

        # Define the compute context to use MapReduce
        myHadoopMRCluster <- RxHadoopMR(consoleOutput=TRUE,
                                        nameNode = myNameNode,
                                        port=myPort,
                                        hadoopSwitches="-libjars /etc/hadoop/conf") 
        # Set compute context 
        rxSetComputeContext(myHadoopMRCluster)
        # Run a linear regression 
        system.time(
            modelMapReduce <- rxLinMod(ArrDelay~CRSDepTime+DayOfWeek,
                                       data = airDS) 
        )
        # Display a summary
        summary(modelMapReduce)

    When you run this script, you will notice that the output generated by the MapReduce process is displayed. This happens because we set `consoleOutput=TRUE` when we set the compute context.

6. Next, let's run the same linear regression using the Spark context.

        # Define the Spark compute context 
        mySparkCluster <- RxSpark(consoleOutput=TRUE) 
        # Set the compute context 
        rxSetComputeContext(mySparkCluster) 
        # Run a linear regression 
        system.time(  
            modelSpark <- rxLinMod(ArrDelay~CRSDepTime+DayOfWeek, 
                      data = airDS) 
        )
        # Display a summary
        summary(modelSpark)

    As with the MapReduce context, the output of Spark processing is written to the console because we set `consoleOutput=TRUE`.

7. You can also start tasks directly using `rxExcec`. For example, the following will start four tasks to retrieve the nodename.

        rxExec( function() {Sys.info()["nodename"]}, timesToRun = 4 )
    
    If you are still using the Spark or MapReduce context, this will return the nodename value for the worker nodes that the tasks are ran on.

## Next steps

Now that you understand how to create a new HDInsight cluster that includes R Server, and the basics of using the R console from an SSH session, use the following to discover other ways of working with R Server on HDInsight.

Tools and extensions
-   [Use R Server for HDInsight from RStudio to submit R scripts](https://azure.microsoft.com/en-us/documentation/articles/hdinsight-apache-spark-intellij-tool-plugin/)

Manage resources
-   [Manage resources for the R Server for HDInsight](https://azure.microsoft.com/en-us/documentation/articles/hdinsight-apache-spark-resource-manager/)

Known issues
-   [Known issues of R Studio for HDInsight (Linux)](https://azure.microsoft.com/en-us/documentation/articles/hdinsight-apache-spark-known-issues/)
