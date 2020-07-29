---
title: Apache Storm with Python components - Azure HDInsight 
description: Learn how to create an Apache Storm topology that uses Python components in Azure HDInsight
author: hrasheed-msft
ms.author: hrasheed
ms.reviewer: jasonh
ms.service: hdinsight
ms.topic: conceptual
ms.custom: hdinsightactive,hdiseo17may2017, tracking-python
ms.date: 12/16/2019
---

# Develop Apache Storm topologies using Python on HDInsight

Learn how to create an [Apache Storm](https://storm.apache.org/) topology that uses Python components. Apache Storm supports multiple languages, even allowing you to combine components from several languages in one topology. The [Flux](https://storm.apache.org/releases/current/flux.html) framework (introduced with Storm 0.10.0) allows you to easily create solutions that use Python components.

> [!IMPORTANT]  
> The information in this document was tested using Storm on HDInsight 3.6.

## Prerequisites

* An Apache Storm cluster on HDInsight. See [Create Apache Hadoop clusters using the Azure portal](../hdinsight-hadoop-create-linux-clusters-portal.md) and select **Storm** for **Cluster type**.

* A local Storm development environment (Optional). A local Storm environment is only needed if you want to run the topology locally. For more information, see [Setting up a development environment](https://storm.apache.org/releases/current/Setting-up-development-environment.html).

* [Python 2.7 or higher](https://www.python.org/downloads/).

* [Java Developer Kit (JDK) version 8](https://aka.ms/azure-jdks).

* [Apache Maven](https://maven.apache.org/download.cgi) properly [installed](https://maven.apache.org/install.html) according to Apache.  Maven is a project build system for Java projects.

## Storm multi-language support

Apache Storm was designed to work with components written using any programming language. The components must understand how to work with the Thrift definition for Storm. For Python, a module is provided as part of the Apache Storm project that allows you to easily interface with Storm. You can find this module at [https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py](https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py).

Storm is a Java process that runs on the Java Virtual Machine (JVM). Components written in other languages are executed as subprocesses. The Storm communicates with these subprocesses using JSON messages sent over stdin/stdout. More details on communication between components can be found in the [Multi-lang Protocol](https://storm.apache.org/releases/current/Multilang-protocol.html) documentation.

## Python with the Flux framework

The Flux framework allows you to define Storm topologies separately from the components. The Flux framework uses YAML to define the Storm topology. The following text is an example of how to reference a Python component in the YAML document:

```yaml
# Spout definitions
spouts:
  - id: "sentence-spout"
    className: "org.apache.storm.flux.wrappers.spouts.FluxShellSpout"
    constructorArgs:
      # Command line
      - ["python", "sentencespout.py"]
      # Output field(s)
      - ["sentence"]
    # parallelism hint
    parallelism: 1
```

The class `FluxShellSpout` is used to start the `sentencespout.py` script that implements the spout.

Flux expects the Python scripts to be in the `/resources` directory inside the jar file that contains the topology. So this example stores the Python scripts in the `/multilang/resources` directory. The `pom.xml` includes this file using the following XML:

```xml
<!-- include the Python components -->
<resource>
    <directory>${basedir}/multilang</directory>
    <filtering>false</filtering>
</resource>
```

As mentioned earlier, there's a `storm.py` file that implements the Thrift definition for Storm. The Flux framework includes `storm.py` automatically when the project is built, so you don't have to worry about including it.

## Build the project

1. Download the project from [https://github.com/Azure-Samples/hdinsight-python-storm-wordcount](https://github.com/Azure-Samples/hdinsight-python-storm-wordcount).

1. Open a command prompt and navigate to the project root: `hdinsight-python-storm-wordcount-master`. Enter the following command:

    ```cmd
    mvn clean compile package
    ```

    This command creates a `target/WordCount-1.0-SNAPSHOT.jar` file that contains the compiled topology.

## Run the Storm topology on HDInsight

1. Use [ssh command](../hdinsight-hadoop-linux-use-ssh-unix.md) to copy the `WordCount-1.0-SNAPSHOT.jar` file to your Storm on HDInsight cluster. Edit the command below by replacing CLUSTERNAME with the name of your cluster, and then enter the command:

    ```cmd
    scp target/WordCount-1.0-SNAPSHOT.jar sshuser@CLUSTERNAME-ssh.azurehdinsight.net:
    ```

1. Once the file has been uploaded, connect to the cluster using SSH:

    ```cmd
    ssh sshuser@CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. From the SSH session, use the following command to start the topology on the cluster:

    ```bash
    storm jar WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux -r -R /topology.yaml
    ```

    Once started, a Storm topology runs until stopped.

1. Use the Storm UI to view the topology on the cluster. The Storm UI is located at `https://CLUSTERNAME.azurehdinsight.net/stormui`. Replace `CLUSTERNAME` with your cluster name.

1. Stop the Storm topology. Use the following command to stop the topology on the cluster:

    ```bash
    storm kill wordcount
    ```

    Alternatively, you can use the Storm UI. Under **Topology actions** for the topology, select **Kill**.

## Run the topology locally

To run the topology locally, use the following command:

```bash
storm jar WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux -l -R /topology.yaml
```

> [!NOTE]  
> This command requires a local Storm development environment. For more information, see [Setting up a development environment](https://storm.apache.org/releases/current/Setting-up-development-environment.html).

Once the topology starts, it emits information to the local console similar to the following text:

```output
24302 [Thread-25-sentence-spout-executor[4 4]] INFO  o.a.s.s.ShellSpout - ShellLog pid:2436, name:sentence-spout Emiting the cow jumped over the moon
24302 [Thread-30] INFO  o.a.s.t.ShellBolt - ShellLog pid:2438, name:splitter-bolt Emitting the
24302 [Thread-28] INFO  o.a.s.t.ShellBolt - ShellLog pid:2437, name:counter-bolt Emitting years:160
24302 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=the, count=599}
24303 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=seven, count=302}
24303 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=dwarfs, count=143}
24303 [Thread-25-sentence-spout-executor[4 4]] INFO  o.a.s.s.ShellSpout - ShellLog pid:2436, name:sentence-spout Emiting the cow jumped over the moon
24303 [Thread-30] INFO  o.a.s.t.ShellBolt - ShellLog pid:2438, name:splitter-bolt Emitting cow
24303 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=four, count=160}
```

To stop the topology, use __Ctrl + C__.

## Next steps

See the following documents for other ways to use Python with HDInsight: [How to use Python User Defined Functions (UDF) in Apache Pig and Apache Hive](../hadoop/python-udf-hdinsight.md).
