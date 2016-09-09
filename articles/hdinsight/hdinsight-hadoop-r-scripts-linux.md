<properties
	pageTitle="Install R on Linux-based HDInsight | Microsoft Azure"
	description="Learn how to install and use R to customize Linux-based Hadoop clusters."
	services="hdinsight"
	documentationCenter=""
	authors="Blackmist"
	manager="paulettm"
	editor="cgronlun"/>

<tags
	ms.service="hdinsight"
	ms.workload="big-data"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="07/05/2016"
	ms.author="larryfr"/>

# Install and use R on HDInsight Hadoop clusters

You can install R on any type of cluster in Hadoop on HDInsight by using **Script Action** cluster customization. This enables data scientists and analysts to use R to deploy the powerful MapReduce/YARN programming framework to process large amounts of data on Hadoop clusters that are deployed in HDInsight.

> [AZURE.IMPORTANT] The [premium tier](https://azure.microsoft.com/pricing/details/hdinsight/) offering for HDInsight includes R Server as part of your HDInsight cluster. This allows R scripts to use MapReduce and Spark to run distributed computations. For more information, see [Get started using R Server on HDInsight](hdinsight-hadoop-r-server-get-started.md). 


## What is R?

The <a href="http://www.r-project.org/" target="_blank">R Project for Statistical Computing</a> is an open source language and environment for statistical computing. R provides hundreds of build-in statistical functions and its own programming language that combines aspects of functional and object-oriented programming. It also provides extensive graphical capabilities. R is the preferred programming environment for most professional statisticians and scientists in a wide variety of fields.

R scripts can be run on Hadoop clusters in HDInsight that were customized using Script Action when created to install the R environment. R is compatible with Azure Blob Storage (WASB) so that data that is stored there can be processed using R on HDInsight.

## What the script does

The script action used to install R on your HDInsight cluster installs the following Ubuntu packages, which provide a basic R installation:

* [r-base](http://packages.ubuntu.com/precise/r-base): Base GNU R package
* [r-base-dev](http://packages.ubuntu.com/precise/r-base-dev): Auxilliary GNU R packages

The following RHadoop packages are also installed, which provide integration with MapReduce and HDFS:

* [rmr2](https://github.com/RevolutionAnalytics/rmr2): Allows R developers to use Hadoop MapReduce
* [rhdfs](https://github.com/RevolutionAnalytics/rhdfs): Allows R developers to use Hadoop HDFS (WASB for HDInsight)

Additionally, the following R packages are installed:

| R package | What it provides |
| --------- | ---------------- |
| [rJava](https://cran.r-project.org/web/packages/rJava/index.html) | A low level R to Java interface. |
| [Rcpp](https://cran.r-project.org/web/packages/Rcpp/index.html) | R and C++ integration. |
| [RJSONIO](https://cran.r-project.org/web/packages/RJSONIO/index.html) | Serialize/deserialize R objects to JSON |
| [bitops](https://cran.r-project.org/web/packages/bitops/index.html) | Functions for bitwise operations on integer vectors. |
| [digest](https://cran.r-project.org/web/packages/digest/index.html) | Create Cryptographic Hash Digests of R Objects. |
| [functional](https://cran.r-project.org/web/packages/functional/index.html) | Curry, Compose, and other higher-order functions |
| [reshape2](https://cran.r-project.org/web/packages/reshape2/index.html) | Flexibly restructure and aggregate data. |
| [stringr](https://cran.r-project.org/web/packages/stringr/index.html) | Simple, Consistent Wrappers for Common String Operations. |
| [plyr](https://cran.r-project.org/web/packages/plyr/index.html) | Tools for Splitting, Applying and Combining Data. |
| [caTools](https://cran.r-project.org/web/packages/caTools/index.html) | Tools for moving window statistics, GIF, Base64, ROC AUC, etc. |
| [stringdist](https://cran.r-project.org/web/packages/stringdist/index.html) | Approximate String Matching and String Distance Functions. |

## Install R using Script Actions

The following script action is used to install R on an HDInsight cluster. 
    https://hdiconfigactions.blob.core.windows.net/linuxrconfigactionv01/r-installer-v01.sh
    
This section provides instructions about how to use the script when creating a new cluster using the Azure portal. 

> [AZURE.NOTE] Azure PowerShell, the Azure CLI, the HDInsight .NET SDK, or Azure Resource Manager templates can also be used to apply script actions. You can also apply script actions to already running clusters. For more information, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).

1. Start provisioning a cluster by using the steps in [Provision Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md#portal), but do not complete provisioning.

2. On the **Optional Configuration** blade, select **Script Actions**, and provide the information below:

	* __NAME__: Enter a friendly name for the script action.
	* __SCRIPT URI__: https://hdiconfigactions.blob.core.windows.net/linuxrconfigactionv01/r-installer-v01.sh
	* __HEAD__: Check this option
	* __WORKER__: Check this option
	* __ZOOKEEPER__: Check this option to install on the Zookeeper node.
	* __PARAMETERS__: Leave this field blank

3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration. Finally, use the **Select** button at the bottom of the **Optional Configuration** blade to save the optional configuration information.

4. Continue provisioning the cluster as described in [Provision Linux-based HDInsight clusters](hdinsight-hadoop-provision-linux-clusters.md#portal).

## Run R scripts

After the cluster has finished provisioning, use the following steps to use R to perform a MapReduce operation on the cluster.

1. Connect to the HDInsight cluster using SSH:

		ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net

	For more information on using SSH with HDInsight, see the following:

	* [Use SSH with Linux-based Hadoop on HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)

	* [Use SSH with Linux-based Hadoop on HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. From the `username@hn0-CLUSTERNAME:~$` prompt, enter the following command to start an interactive R session:

		R

3. Enter the following R program. This generates the numbers 1 to 100 and then multiplies them by 2.

		library(rmr2)
		ints = to.dfs(1:100)
		calc = mapreduce(input = ints, map = function(k, v) cbind(v, 2*v))

	The first line calls the RHadoop library rmr2, which is used for MapReduce operations.

	The second line generates values 1 - 100, then stores them to the Hadoop file system using `to.dfs`.

	The third line creates a MapReduce process using functionality provided by rmr2, and begins processing. You should see several lines scroll past as the processing begins.

4. Next, use the following to see the temporary path that the MapReduce output was stored to:

		print(calc())

	This should be something similar to `/tmp/file5f615d870ad2`. To view the actual output, use the following:

		print(from.dfs(calc))

	The output should look like this:

		[1,]  1 2
		[2,]  2 4
		.
		.
		.
		[98,]  98 196
		[99,]  99 198
		[100,] 100 200

5. To exit R, enter the following:

		q()


## Next steps

- [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Hue is a web UI that makes it easy to create, run and save Pig and Hive jobs, as well as browse the default storage for your HDInsight cluster.

- [Install Giraph on HDInsight clusters](hdinsight-hadoop-giraph-install.md). Use cluster customization to install Giraph on HDInsight Hadoop clusters. Giraph allows you to perform graph processing using Hadoop, and it can be used with Azure HDInsight.

- [Install Solr on HDInsight clusters](hdinsight-hadoop-solr-install.md). Use cluster customization to install Solr on HDInsight Hadoop clusters. Solr allows you to perform powerful search operations on stored data.

- [Install Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md). Use cluster customization to install Hue on HDInsight Hadoop clusters. Hue is a set of Web applications used to interact with a Hadoop cluster.

[hdinsight-cluster-customize]: hdinsight-hadoop-customize-cluster-linux.md
