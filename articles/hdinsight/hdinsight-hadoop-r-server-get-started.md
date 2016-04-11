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
   ms.date="03/25/2016"
   ms.author="jeffstok"/>

# Get started using R Server on HDInsight

The premium tier offering for HDInsight includes R Server as part of your HDInsight cluster. This allows R scripts to use MapReduce and Spark to run distributed computations. In this document, you will learn how to create a new R Server on HDInsight, then run an R script that demonstrates using Spark for distributed R computations.

![Diagram of the workflow for this document](./media/hdinsight-getting-started-with-r/rgettingstarted.png)

## Prerequisites

* __An Azure subscription__: Before you begin this tutorial, you must have an Azure subscription. See [Get Azure free trial](https://azure.microsoft.com/documentation/videos/get-azure-free-trial-for-testing-hadoop-in-hdinsight/) for more information.

* __A Secure Shell (SSH) client__: An SSH client is used to remotely connect to the HDInsight cluster and run commands directly on the cluster. Linux, Unix, and OS X systems provide an SSH client through the `ssh` command. For Windows systems, we recommend [PuTTY](http://www.chiark.greenend.org.uk/~sgtatham/putty/download.html).

    * __SSH keys (optional)__: You can secure the SSH account used to connect to the cluster using either a password or a public key. Using a password is easier, and allows you to get started without having to create a public/private key pair; however, using a key is more secure.
    
        The steps in this document assume that you are using a password. For information on how to create and use SSH keys with HDInsight, see the following documents:
        
        * [Use SSH with HDInsight from Linux, Unix, or OS X clients](hdinsight-hadoop-linux-use-ssh-unix.md)
        
        * [Use SSH with HDInsight from Windows clients](hdinsight-hadoop-linux-use-ssh-windows.md)

## Create the cluster

> [AZURE.NOTE] The steps in this document create an R Server on HDInsight using basic configuration information. For other cluster configuration settings (such as adding additional storage accounts, using an Azure Virtual Network, or creating a metastore for Hive,) see [Create Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md).

1. Sign in to the [Azure portal](https://portal.azure.com).

2. Select __NEW__, __Data + Analytics__, and then __HDInsight__.

    ![Image of creating a new cluster](./media/hdinsight-getting-started-with-r/newcluster.png)

3. Enter a name for the cluster in the __Cluster Name__ field. If you have multiple Azure subscriptions, use the __Subscription__ entry to select the one you want to use.

    ![Cluster name and subscription selections](./media/hdinsight-getting-started-with-r/clustername.png)

4. Select __Select Cluster Type__. On the __Cluster Type__ blade, select the following options:

    * __Cluster Type__: R Server on Spark
    
    * __Cluster Tier__: Premium

    Leave the other options at the default values, then use the __Select__ button to save the cluster type.
    
    ![Cluster type blade screenshot](./media/hdinsight-getting-started-with-r/clustertypeconfig.png)
    
    > [AZURE.NOTE] You can also add R Server to other HDInsight cluster types (such as Hadoop or HBase,) by selecting the cluster type, and then selecting __Premium__.

5. Select **Resource Group** to see a list of existing resource groups and then select the one to create the cluster in. Or, you can select **Create New** and then enter the name of the new resource group. A green check will appear to indicate that the new group name is available.

    > [AZURE.NOTE] This entry will default to one of your existing resource groups, if any are available.
    
    Use the __Select__ button to save the resource group.

6. Select **Credentials**, then enter a **Cluster Login Username** and **Cluster Login Password**.

    Enter an __SSH Username__ and select __Password__, then enter the __SSH Password__ to configure the SSH account. SSH is used to remotely connect to the cluster using a Secure Shell (SSH) client.
    
    Use the __Select__ button to save the credentials.
    
    ![Credentials blade](./media/hdinsight-getting-started-with-r/clustercredentials.png)

7. Select **Data Source** to select a data source for the cluster. Either select an existing storage account by selecting __Select storage account__ and then selecting the account, or create a new account using the __New__ link in the __Select storage account__ section.

    If you select __New__, you must enter a name for the new storage account. A green check will appear if the name is accepted.

    The __Default Container__ will default to the name of the cluster. Leave this as the value.
    
    Select __Location__ to select the region to create the storage account in.
    
    > [AZURE.IMPORTANT] Selecting the location for the default data source will also set the location of the HDInsight cluster. The cluster and default data source must be located in the same region.

    Use the **Select** button to save the data source configuration.
    
    ![Data source blade](./media/hdinsight-getting-started-with-r/datastore.png)

8. Select **Node Pricing Tiers** to display information about the nodes that will be created for this cluster. Unless you know that you'll need a larger cluster, leave the number of worker nodes at the default of `4`. The estimated cost of the cluster will be shown within the blade.

    ![Node pricing tiers blade](./media/hdinsight-getting-started-with-r/pricingtier.png)

    Use the **Select** button to save the node pricing configuration.
    
9. On the **New HDInsight Cluster** blade, make sure that **Pin to Startboard** is selected, and then select **Create**. This will create the cluster and add a tile for it to the Startboard of your Azure Portal. The icon will indicate that the cluster is creating, and will change to display the HDInsight icon once creation has completed.

    | While creating | Creation complete |
    | ------------------ | --------------------- |
    | ![Creating indicator on startboard](./media/hdinsight-getting-started-with-r/provisioning.png) | ![Created cluster tile](./media/hdinsight-getting-started-with-r/provisioned.png) |

    > [AZURE.NOTE] It will take some time for the cluster to be created, usually around 15 minutes. Use the tile on the Startboard, or the **Notifications** entry on the left of the page to check on the creation process.

## Connect to the R Server edge node

Connect to R Server edge node of the HDInsight cluster using SSH:

    ssh USERNAME@rserver.CLUSTERNAME.ssh.azurehdinsight.net
    
> [AZURE.NOTE] You can also find the `RServer.CLUSTERNAME.ssh.azurehdinsight.net` address in the Azure portal by selecting your cluster, then __All Settings__, __Apps__, and __RServer__. This will display the SSH Endpoint information for the edge node.
>
> ![Image of the SSH Endpoint for the edge node](./media/hdinsight-getting-started-with-r/sshendpoint.png)
    
If you used a password to secure your SSH user account, you will be prompted to enter it. If you used a public key, you may have to use the `-i` parameter to specify the matching private key. For example, `ssh -i ~/.ssh/id_rsa USERNAME@RServer.CLUSTERNAME.ssh.azurehdinsight.net`.
    
For more information on using SSH with Linux-based HDInsight, see the following articles:

* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

Once connected, you will arrive at a prompt similar to the following.

    username@ed00-myrser:~$

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

2. From the `>` prompt, you can enter R code. R server includes packages that allow you to easily interact with Hadoop and run distributed computations. For example, use the following command to view the root of the default file system for the HDInsight cluster.

        rxHadoopListFiles("/")
    
    You can also use the WASB style addressing.
    
        rxHadoopListFiles("wasb:///")

##Use a compute context

A compute context allows you to control whether computation will be performed locally on the edge node, or whether it will be distributed across the nodes in the HDInsight cluster.
        
1. From the R console, use the following to load example data into the default storage for HDInsight.

        # Set the NameNode and port for the cluster
        myNameNode <- "default"
        myPort <- 0
        # Set the HDFS (WASB) location of example data
        bigDataDirRoot <- "/example/data"
        # Source for the data to load
        source <- system.file("SampleData/AirlineDemoSmall.csv", package="RevoScaleR")
        # Directory in bigDataDirRoot to load the data into
        inputDir <- file.path(bigDataDirRoot,"AirlineDemoSmall") 
        # Make the directory
        rxHadoopMakeDir(inputDir)
        # Copy the data from source to input
        rxHadoopCopyFromLocal(source, inputDir)

2. Next, let's create some Factors and define a data source so that we can work with the data.

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

3. Let's run a linear regression over the data using the local compute context.

        # Set a local compute context
        rxSetComputeContext("local")
        # Run a linear regression
        system.time(
            modelLocal <- rxLinMod(ArrDelay~CRSDepTime+DayOfWeek,
                                   data = airDS)
        )
        # Display a summary 
        summary(modelLocal) 

    You should see output that ends with lines similar to the following.
    
        Residual standard error: 40.39 on 582620 degrees of freedom
        Multiple R-squared: 0.01465
        Adjusted R-squared: 0.01464
        F-statistic:  1238 on 7 and 582620 DF,  p-value: < 2.2e-16
        Condition number: 10.6542

4. Next, let's run the same linear regression using the Spark context. The Spark context will distribute the processing over all the worker nodes in the HDInsight cluster.

        # Define the Spark compute context 
        mySparkCluster <- RxSpark(consoleOutput=TRUE) 
        # Set the compute context 
        rxSetComputeContext(mySparkCluster) 
        # Run a linear regression 
        system.time(  
            modelSpark <- rxLinMod(ArrDelay~CRSDepTime+DayOfWeek, data = airDS) 
        )
        # Display a summary
        summary(modelSpark)

    The output of Spark processing is written to the console because we set `consoleOutput=TRUE`.
    
    > [AZURE.NOTE] You can also use MapReduce to distribute computation across cluster nodes. For more information on compute context, see [Compute context options for R Server on HDInsight premium](hdinsight-hadoop-r-server-compute-contexts.md).

##Distribute R code to multiple nodes

With R Server you can easily take existing R code and run it across multiple nodes in the cluster by using `rxExec`. This is useful when doing a parameter sweep or simulations. The following is an example of how to use `rxExec`.

    rxExec( function() {Sys.info()["nodename"]}, timesToRun = 4 )
    
If you are still using the Spark or MapReduce context, this will return the nodename value for the worker nodes that the code (`Sys.info()["nodename"]`) is ran on. For example, on a four node cluster, you may receive output similar to the following.

    $rxElem1
        nodename
    "wn3-myrser"

    $rxElem2
        nodename
    "wn0-myrser"

    $rxElem3
        nodename
    "wn3-myrser"

    $rxElem4
        nodename
    "wn3-myrser"

##Install R packages

If you would like to install additional R packages on the edge node, you can use `install.packages()` directly from within the R console when connected to the egde node through SSH. However, if you need to install R packages on the worker nodes of the cluster, you must use a Script Action.

Script Actions are Bash scripts that are used to make configuration changes to the HDInsight cluster, or to install additional software. In this case, to install additional R packages. To install additional packages using a Script Action, use the following steps.

> [AZURE.IMPORTANT] Using Script Actions to install additional R packages can only be used after the cluster has been created. It should not be used during cluster creation, as the script relies on R Server being completely installed and configured.

1. From the [Azure portal](https://portal.azure.com), select your R Server on HDInsight cluster.

2. From the cluster blade, select __All Settings__, and then __Script Actions__. From the __Script Actions__ blade, select __Submit New__ to submit a new Script Action.

    ![Image of script actions blade](./media/hdinsight-getting-started-with-r/newscriptaction.png)

3. From the __Submit script action__ blade, provide the following information.

    * __Name__: A friendly name to used to identify this script
    * __Bash script URI__: http://mrsactionscripts.blob.core.windows.net/rpackages-v01/InstallRPackages.sh
    * __Head__: This should be __unchecked__
    * __Worker__: This should be __Checked__
    * __Zookeeper__: This should be __Unchecked__
    * __Parameters__: The R packages to be installed. For example, `bitops stringr arules`
    * __Persist this script...__: This should be __Checked__
    
    > [AZURE.IMPORTANT] If the R package(s) you install require system libraries to be added, then you must download the base script used here and add steps to install the system libraries. You must then upload the modified script to a public blob container in Azure storage and use the modified script to install the packages.
    >
    >For more information on developing Script Actions, see [Script Action development](hdinsight-hadoop-script-actions-linux.md).
    
    ![Adding a script action](./media/hdinsight-getting-started-with-r/scriptaction.png)

4. Select __Create__ to run the script. Once the script completes, the R packages will be available on all worker nodes.
    
## Next steps

Now that you understand how to create a new HDInsight cluster that includes R Server, and the basics of using the R console from an SSH session, use the following to discover other ways of working with R Server on HDInsight.

- [Add RStudio Server to HDInsight premium](hdinsight-hadoop-r-server-install-r-studio.md)

- [Compute context options for R Server on HDInsight premium](hdinsight-hadoop-r-server-compute-contexts.md)

- [Azure Storage options for R Server on HDInsight premium](hdinsight-hadoop-r-server-storage.md)

### Azure Resource Manager templates

If you're interested in automating the creation of R Server on HDInsight using Azure Resource Manager templates, see the following example templates.

* [Create an R Server on HDInsight cluster using an SSH public key](http://go.microsoft.com/fwlink/p/?LinkID=780809)
* [Create an R Server on HDInsight cluster using an SSH password](http://go.microsoft.com/fwlink/p/?LinkID=780810)

Both templates create a new HDInsight cluster and associated storage account, and can be used from the Azure CLI, Azure PowerShell, or the Azure Portal.

For generic information on using ARM templates, see [Create Linux-based Hadoop clusters in HDInsight using ARM templates](hdinsight-hadoop-create-linux-clusters-arm-templates.md).
