---
title: Install and use Giraph on HDInsight (Hadoop) - Azure 
description: Learn how to install Giraph on Linux-based HDInsight clusters using Script Actions. Script Actions allow you to customize the cluster during creation, by changing cluster configuration or installing services and utilities.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh

ms.service: hdinsight
ms.custom: hdinsightactive
ms.topic: conceptual
ms.date: 04/23/2018
ms.author: jasonh

---
# Install Giraph on HDInsight Hadoop clusters, and use Giraph to process large-scale graphs

Learn how to install Apache Giraph on an HDInsight cluster. The script action feature of HDInsight allows you to customize your cluster by running a bash script. Scripts can be used to customize clusters during and after cluster creation.

> [!IMPORTANT]
> The steps in this document require an HDInsight cluster that uses Linux. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](hdinsight-component-versioning.md#hdinsight-windows-retirement).

## <a name="whatis"></a>What is Giraph

[Apache Giraph](http://giraph.apache.org/) allows you to perform graph processing by using Hadoop, and can be used with Azure HDInsight. Graphs model relationships between objects. For example, the connections between routers on a large network like the Internet, or relationships between people on social networks. Graph processing allows you to reason about the relationships between objects in a graph, such as:

* Identifying potential friends based on your current relationships.

* Identifying the shortest route between two computers in a network.

* Calculating the page rank of webpages.

> [!WARNING]
> Components provided with the HDInsight cluster are fully supported - Microsoft Support helps to isolate and resolve issues related to these components.
>
> Custom components, such as Giraph, receive commercially reasonable support to help you to further troubleshoot the issue. Microsoft Support may be able to resolving the issue. If not, you must consult open source communities where deep expertise for that technology is found. For example, there are many community sites that can be used, like: [MSDN forum for HDInsight](https://social.msdn.microsoft.com/Forums/azure/en-US/home?forum=hdinsight), [http://stackoverflow.com](http://stackoverflow.com). Also Apache projects have project sites on [http://apache.org](http://apache.org), for example: [Hadoop](http://hadoop.apache.org/).


## What the script does

This script performs the following actions:

* Installs Giraph to `/usr/hdp/current/giraph`

* Copies the `giraph-examples.jar` file to default storage (WASB) for your cluster: `/example/jars/giraph-examples.jar`

## <a name="install"></a>Install Giraph using Script Actions

A sample script to install Giraph on an HDInsight cluster is available at the following location:

    https://hdiconfigactions.blob.core.windows.net/linuxgiraphconfigactionv01/giraph-installer-v01.sh

This section provides instructions on how to use the sample script while creating the cluster by using the Azure portal.

> [!NOTE]
> A script action can be applied using any of the following methods:
> * Azure PowerShell
> * The Azure Classic CLI
> * The HDInsight .NET SDK
> * Azure Resource Manager templates
> 
> You can also apply script actions to already running clusters. For more information, see [Customize HDInsight clusters with Script Actions](hdinsight-hadoop-customize-cluster-linux.md).

1. Start creating a cluster by using the steps in [Create Linux-based HDInsight clusters](hdinsight-hadoop-create-linux-clusters-portal.md), but do not complete creation.

2. In the **Optional Configuration** section, select **Script Actions**, and provide the following information:

   * **NAME**: Enter a friendly name for the script action.

   * **SCRIPT URI**: https://hdiconfigactions.blob.core.windows.net/linuxgiraphconfigactionv01/giraph-installer-v01.sh

   * **HEAD**: Check this entry

   * **WORKER**: Leave this entry unchecked

   * **ZOOKEEPER**: Leave this entry unchecked

   * **PARAMETERS**: Leave this field blank

3. At the bottom of the **Script Actions**, use the **Select** button to save the configuration. Finally, use the **Select** button at the bottom of the **Optional Configuration** section to save the optional configuration information.

4. Continue creating the cluster as described in [Create Linux-based HDInsight clusters](hdinsight-hadoop-create-linux-clusters-portal.md).

## <a name="usegiraph"></a>How do I use Giraph in HDInsight?

Once the cluster has been created, use the following steps to run the SimpleShortestPathsComputation example included with Giraph. This example uses the basic [Pregel](http://people.apache.org/~edwardyoon/documents/pregel.pdf) implementation for finding the shortest path between objects in a graph.

1. Connect to the HDInsight cluster using SSH:

    ```bash
    ssh USERNAME@CLUSTERNAME-ssh.azurehdinsight.net
    ```

    For information, see [Use SSH with HDInsight](hdinsight-hadoop-linux-use-ssh-unix.md).

2. Use the following command to create a file named **tiny_graph.txt**:

    ```bash
    nano tiny_graph.txt
    ```

    Use the following text as the contents of this file:

    ```text
    [0,0,[[1,1],[3,3]]]
    [1,0,[[0,1],[2,2],[3,1]]]
    [2,0,[[1,2],[4,4]]]
    [3,0,[[0,3],[1,1],[4,4]]]
    [4,0,[[3,4],[2,4]]]
    ```

    This data describes a relationship between objects in a directed graph, by using the format `[source_id, source_value,[[dest_id], [edge_value],...]]`. Each line represents a relationship between a `source_id` object and one or more `dest_id` objects. The `edge_value` can be thought of as the strength or distance of the connection between `source_id` and `dest\_id`.

    Drawn out, and using the value (or weight) as the distance between objects, the data might look like the following diagram:

    ![tiny_graph.txt drawn as circles with lines of varying distance between](./media/hdinsight-hadoop-giraph-install-linux/giraph-graph.png)

3. To save the file, use **Ctrl+X**, then **Y**, and finally **Enter** to accept the file name.

4. Use the following to store the data into primary storage for your HDInsight cluster:

    ```bash
    hdfs dfs -put tiny_graph.txt /example/data/tiny_graph.txt
    ```

5. Run the SimpleShortestPathsComputation example using the following command:

    ```bash
    yarn jar /usr/hdp/current/giraph/giraph-examples.jar org.apache.giraph.GiraphRunner org.apache.giraph.examples.SimpleShortestPathsComputation -ca mapred.job.tracker=headnodehost:9010 -vif org.apache.giraph.io.formats.JsonLongDoubleFloatDoubleVertexInputFormat -vip /example/data/tiny_graph.txt -vof org.apache.giraph.io.formats.IdWithValueTextOutputFormat -op /example/output/shortestpaths -w 2
    ```

    The parameters used with this command are described in the following table:

   | Parameter | What it does |
   | --- | --- |
   | `jar` |The jar file containing the examples. |
   | `org.apache.giraph.GiraphRunner` |The class used to start the examples. |
   | `org.apache.giraph.examples.SimpleShortestPathsCoputation` |The example that is used. In this example, it computes the shortest path between ID 1 and all other IDs in the graph. |
   | `-ca mapred.job.tracker` |The headnode for the cluster. |
   | `-vif` |The input format to use for the input data. |
   | `-vip` |The input data file. |
   | `-vof` |The output format. In this example, ID and value as plain text. |
   | `-op` |The output location. |
   | `-w 2` |The number of workers to use. In this example, 2. |

    For more information on these, and other parameters used with Giraph samples, see the [Giraph quickstart](http://giraph.apache.org/quick_start.html).

6. Once the job has finished, the results are stored in the **/example/out/shotestpaths** directory. The output file names begin with **part-m-** and end with a number indicating the first, second, etc. file. Use the following command to view the output:

    ```bash
    hdfs dfs -text /example/output/shortestpaths/*
    ```

    The output appears similar to the following text:

        0    1.0
        4    5.0
        2    2.0
        1    0.0
        3    1.0

    The SimpleShortestPathComputation example is hard coded to start with object ID 1 and find the shortest path to other objects. The output is in the format of `destination_id` and `distance`. The `distance` is the value (or weight) of the edges traveled between object ID 1 and the target ID.

    Visualizing this data, you can verify the results by traveling the shortest paths between ID 1 and all other objects. The shortest path between ID 1 and ID 4 is 5. This value is the total distance between <span style="color:orange">ID 1 and 3</span>, and then <span style="color:red">ID 3 and 4</span>.

    ![Drawing of objects as circles with shortest paths drawn between](./media/hdinsight-hadoop-giraph-install-linux/giraph-graph-out.png)

## Next steps

* [Install and use Hue on HDInsight clusters](hdinsight-hadoop-hue-linux.md).

* [Install Solr on HDInsight clusters](hdinsight-hadoop-solr-install-linux.md).
