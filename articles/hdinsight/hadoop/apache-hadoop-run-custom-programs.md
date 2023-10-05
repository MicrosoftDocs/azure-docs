---
title: Run custom MapReduce programs - Azure HDInsight 
description: When and how to run custom Apache MapReduce programs on Azure HDInsight clusters.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 01/31/2023
---

# Run custom MapReduce programs

Apache Hadoop-based big data systems such as HDInsight enable data processing using a wide range of tools and technologies. The following table describes the main advantages and considerations for each one.

| Query mechanism | Advantages | Considerations |
| --- | --- | --- |
| **Apache Hive using HiveQL** | <ul><li>An excellent solution for batch processing and analysis of large amounts of immutable data, for data summarization, and for on demand querying. It uses a familiar SQL-like syntax.</li><li>It can be used to produce persistent tables of data that can be easily partitioned and indexed.</li><li>Multiple external tables and views can be created over the same data.</li><li>It supports a simple data warehouse implementation that provides massive scale-out and fault-tolerance capabilities for data storage and processing.</li></ul> | <ul><li>It requires the source data to have at least some identifiable structure.</li><li>It isn't suitable for real-time queries and row level updates. It's best used for batch jobs over large sets of data.</li><li>It might not be able to carry out some types of complex processing tasks.</li></ul> |
| **Apache Pig using Pig Latin** | <ul><li>An excellent solution for manipulating data as sets, merging and filtering datasets, applying functions to records or groups of records, and for restructuring data by defining columns, by grouping values, or by converting columns to rows.</li><li>It can use a workflow-based approach as a sequence of operations on data.</li></ul> | <ul><li>SQL users may find Pig Latin is less familiar and more difficult to use than HiveQL.</li><li>The default output is usually a text file and so can be more difficult to use with visualization tools such as Excel. Typically you'll layer a Hive table over the output.</li></ul> |
| **Custom map/reduce** | <ul><li>It provides full control over the map and reduce phases, and execution.</li><li>It allows queries to be optimized to achieve maximum performance from the cluster, or to minimize the load on the servers and the network.</li><li>The components can be written in a range of well-known languages.</li></ul> | <ul><li>It's more difficult than using Pig or Hive because you must create your own map and reduce components.</li><li>Processes that require joining sets of data are more difficult to implement.</li><li>Even though there are test frameworks available, debugging code is more complex than a normal application because the code runs as a batch job under the control of the Hadoop job scheduler.</li></ul> |
| **Apache HCatalog** | <ul><li>It abstracts the path details of storage, making administration easier and removing the need for users to know where the data is stored.</li><li>It enables notification of events such as data availability, allowing other tools such as Oozie to detect when operations have occurred.</li><li>It exposes a relational view of data, including partitioning by key, and makes the data easy to access.</li></ul> | <ul><li>It supports RCFile, CSV text, JSON text, SequenceFile, and ORC file formats by default, but you may need to write a custom SerDe for other formats.</li><li>HCatalog isn't thread-safe.</li><li>There are some restrictions on the data types for columns when using the HCatalog loader in Pig scripts. For more information, see [HCatLoader Data Types](https://cwiki.apache.org/confluence/display/Hive/HCatalog%20LoadStore#HCatalogLoadStore-HCatLoaderDataTypes) in the Apache HCatalog documentation.</li></ul> |

Typically, you use the simplest of these approaches that can provide the results you require. For example, you may be able to achieve such results by using just Hive, but for more complex scenarios you may need to use Pig, or even write your own map and reduce components. You may also decide, after experimenting with Hive or Pig, that custom map and reduce components can provide better performance by allowing you to fine-tune and optimize the processing.

## Custom map/reduce components

Map/reduce code consists of two separate functions implemented as **map** and **reduce** components. The **map** component is run in parallel on multiple cluster nodes, each node applying the mapping to the node's own subset of the data. The **reduce** component collates and summarizes the results from all  the map functions. For more information on these two components, see [Use MapReduce in Hadoop on HDInsight](hdinsight-use-mapreduce.md).

In most HDInsight processing scenarios, it's simpler and more efficient to use a higher-level abstraction such as Pig or Hive. You can also create custom map and reduce components for use within Hive scripts to perform more sophisticated processing.

Custom map/reduce components are typically written in Java. Hadoop provides a streaming interface that also allows components to be used that are developed in other languages such as C#, F#, Visual Basic, Python, and JavaScript.

* For a walkthrough on developing custom Java MapReduce programs, see [Develop Java MapReduce programs for Hadoop on HDInsight](apache-hadoop-develop-deploy-java-mapreduce-linux.md).

Consider creating your own map and reduce components for the following conditions:

* You need to process data that is completely unstructured by parsing the data and using custom logic to obtain structured information from it.
* You want to perform complex tasks that are difficult (or impossible) to express in Pig or Hive without resorting to creating a UDF. For example, you might need to use an external geocoding service to convert latitude and longitude coordinates or IP addresses in the source data to geographical location names.
* You want to reuse your existing .NET, Python, or JavaScript code in map/reduce components by using the Hadoop streaming interface.

## Upload and run your custom MapReduce program

The most common MapReduce programs are written in Java and compiled to a jar file.

1. After you've developed, compiled, and tested your MapReduce program, use the `scp` command to upload your jar file to the headnode.

    ```cmd
    scp mycustomprogram.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

    Replace CLUSTERNAME with the cluster name. If you used a password to secure the SSH account, you're prompted to enter the password. If you used a certificate, you may need to use the `-i` parameter to specify the private key file.

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to connect to your cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From the SSH session, execute your MapReduce program through YARN.

    ```bash
    yarn jar mycustomprogram.jar mynamespace.myclass /example/data/sample.log /example/data/logoutput
    ```

    This command submits the MapReduce job to YARN. The input file is `/example/data/sample.log`, and the output directory is `/example/data/logoutput`. The input file and any output files are stored to the default storage for the cluster.

## Next steps

* [Use C# with MapReduce streaming on Apache Hadoop in HDInsight](apache-hadoop-dotnet-csharp-mapreduce-streaming.md)
* [Develop Java MapReduce programs for Apache Hadoop on HDInsight](apache-hadoop-develop-deploy-java-mapreduce-linux.md)
* [Use Azure Toolkit for Eclipse to create Apache Spark applications for an HDInsight cluster](../spark/apache-spark-eclipse-tool-plugin.md)
* [Use Python User Defined Functions (UDF) with Apache Hive and Apache Pig in HDInsight](python-udf-hdinsight.md)
