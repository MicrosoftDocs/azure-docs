---
title: Apache Storm with Python comopnents - Azure HDInsight 
description: Learn how to create an Apache Storm topology that uses Python components.
services: hdinsight
author: jasonwhowell
ms.reviewer: jasonh
keywords: apache storm python

ms.service: hdinsight
ms.custom: hdinsightactive,hdiseo17may2017
ms.topic: conceptual
ms.date: 04/30/2018
ms.author: jasonh

---
# Develop Apache Storm topologies using Python on HDInsight

Learn how to create an Apache Storm topology that uses Python components. Apache Storm supports multiple languages, even allowing you to combine components from several languages in one topology. The Flux framework (introduced with Storm 0.10.0) allows you to easily create solutions that use Python components.

> [!IMPORTANT]
> The information in this document was tested using Storm on HDInsight 3.6. Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight retirement on Windows](../hdinsight-component-versioning.md#hdinsight-windows-retirement).

The code for this project is available at [https://github.com/Azure-Samples/hdinsight-python-storm-wordcount](https://github.com/Azure-Samples/hdinsight-python-storm-wordcount).

## Prerequisites

* Python 2.7 or higher

* Java JDK 1.8 or higher

* Maven 3

* (Optional) A local Storm development environment. A local Storm environment is only needed if you want to run the topology locally. For more information, see [Setting up a development environment](http://storm.apache.org/releases/1.1.2/Setting-up-development-environment.html).

## Storm multi-language support

Apache Storm was designed to work with components written using any programming language. The components must understand how to work with the [Thrift definition for Storm](https://github.com/apache/storm/blob/master/storm-core/src/storm.thrift). For Python, a module is provided as part of the Apache Storm project that allows you to easily interface with Storm. You can find this module at [https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py](https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py).

Storm is a Java process that runs on the Java Virtual Machine (JVM). Components written in other languages are executed as subprocesses. The Storm communicates with these subprocesses using JSON messages sent over stdin/stdout. More details on communication between components can be found in the [Multi-lang Protocol](https://storm.apache.org/documentation/Multilang-protocol.html) documentation.

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

As mentioned earlier, there is a `storm.py` file that implements the Thrift definition for Storm. The Flux framework includes `storm.py` automatically when the project is built, so you don't have to worry about including it.

## Build the project

From the root of the project, use the following command:

```bash
mvn clean compile package
```

This command creates a `target/WordCount-1.0-SNAPSHOT.jar` file that contains the compiled topology.

## Run the topology locally

To run the topology locally, use the following command:

```bash
storm jar WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux -l -R /topology.yaml
```

> [!NOTE]
> This command requires a local Storm development environment. For more information, see [Setting up a development environment](http://storm.apache.org/releases/current/Setting-up-development-environment.html)

Once the topology starts, it emits information to the local console similar to the following text:


    24302 [Thread-25-sentence-spout-executor[4 4]] INFO  o.a.s.s.ShellSpout - ShellLog pid:2436, name:sentence-spout Emiting the cow jumped over the moon
    24302 [Thread-30] INFO  o.a.s.t.ShellBolt - ShellLog pid:2438, name:splitter-bolt Emitting the
    24302 [Thread-28] INFO  o.a.s.t.ShellBolt - ShellLog pid:2437, name:counter-bolt Emitting years:160
    24302 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=the, count=599}
    24303 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=seven, count=302}
    24303 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=dwarfs, count=143}
    24303 [Thread-25-sentence-spout-executor[4 4]] INFO  o.a.s.s.ShellSpout - ShellLog pid:2436, name:sentence-spout Emiting the cow jumped over the moon
    24303 [Thread-30] INFO  o.a.s.t.ShellBolt - ShellLog pid:2438, name:splitter-bolt Emitting cow
    24303 [Thread-17-log-executor[3 3]] INFO  o.a.s.f.w.b.LogInfoBolt - {word=four, count=160}


To stop the topology, use __Ctrl + C__.

## Run the Storm topology on HDInsight

1. Use the following command to copy the `WordCount-1.0-SNAPSHOT.jar` file to your Storm on HDInsight cluster:

    ```bash
    scp target\WordCount-1.0-SNAPSHOT.jar sshuser@mycluster-ssh.azurehdinsight.net
    ```

    Replace `sshuser` with the SSH user for your cluster. Replace `mycluster` with the cluster name. You may be prompted to enter the password for the SSH user.

    For more information on using SSH and SCP, see [Use SSH with HDInsight](../hdinsight-hadoop-linux-use-ssh-unix.md).

2. Once the file has been uploaded, connect to the cluster using SSH:

    ```bash
    ssh sshuser@mycluster-ssh.azurehdinsight.net
    ```

3. From the SSH session, use the following command to start the topology on the cluster:

    ```bash
    storm jar WordCount-1.0-SNAPSHOT.jar org.apache.storm.flux.Flux -r -R /topology.yaml
    ```

3. You can use the Storm UI to view the topology on the cluster. The Storm UI is located at https://mycluster.azurehdinsight.net/stormui. Replace `mycluster` with your cluster name.

> [!NOTE]
> Once started, a Storm topology runs until stopped. To stop the topology, use one of the following methods:
>
> * The `storm kill TOPOLOGYNAME` command from the command line
> * The **Kill** button in the Storm UI.


## Next steps

See the following documents for other ways to use Python with HDInsight:

* [How to use Python for streaming MapReduce jobs](../hadoop/apache-hadoop-streaming-python.md)
* [How to use Python User Defined Functions (UDF) in Pig and Hive](../hadoop/python-udf-hdinsight.md)
