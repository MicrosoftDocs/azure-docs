<properties
   pageTitle="Use Python components in a Storm topology on HDinsight | Microsoft Azure"
   description="Learn how you can use Python components from with Apache Storm on Azure HDInsight. You will learn how to use Python components from both a Java based, and Clojure based Storm topology."
   services="hdinsight"
   documentationCenter=""
   authors="Blackmist"
   manager="paulettm"
   editor="cgronlun"/>

<tags
   ms.service="hdinsight"
   ms.devlang="python"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="big-data"
   ms.date="02/01/2016"
   ms.author="larryfr"/>

#Develop Apache Storm topologies using Python on HDInsight

Apache Storm supports multiple languages, even allowing you to combine components from several languages in one topology. In this document, you will learn how to use Python components in your Java and Clojure-based Storm topologies on HDInsight.

##Prerequisites

* Python 2.7 or higher

* Java JDK 1.7 or higher

* [Leiningen](http://leiningen.org/)

##Storm multi-language support

Storm was designed to work with components written using any programming language, however this requires that the components understand how to work with the [Thrift definition for Storm](https://github.com/apache/storm/blob/master/storm-core/src/storm.thrift). For Python, a module is provided as part of the Apache Storm project that allows you to easily interface with Storm. You can find this module at [https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py](https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py).

Since Apache Storm is a Java process that runs on the Java Virtual Machine (JVM,) components written in other languages are executed as subprocesses. The Storm bits running in the JVM communicates with these subprocesses using JSON messages sent over stdin/stdout. More details on communication between components can be found in the [Multi-lang Protocol](https://storm.apache.org/documentation/Multilang-protocol.html) documentation.

###The Storm module

The storm module (https://github.com/apache/storm/blob/master/storm-multilang/python/src/main/resources/resources/storm.py,) provides the bits needed to create Python components that work with Storm.

This provides things like `storm.emit` to emit tuples, and `storm.logInfo` to write to the logs. I would encourage you to read over this file and understand what it provides.

##Challenges

Using the __storm.py__ module, you can create Python spouts that consume data, and bolts that process data, however the overall Storm topology definition that wires up communication between components is still written using Java or Clojure. Additionally, if you use Java, you must also create Java components that act as an interface to the Python components.

Also, since Storm clusters run in a distributed fashion, you must ensure that any modules required by your Python components are available on all worker nodes in the cluster. Storm doesn't provide any easy way to accomplish this for multi-lang resources - you either have to include all dependencies as part of the jar file for the topology, or manually install dependencies on each worker node in the cluster.

There are some projects that attempt to overcome these shortcomings, such as [Pyleus](https://github.com/Yelp/pyleus) and [Streamparse](https://github.com/Parsely/streamparse). While both of these can be ran on Linux-based HDInsight clusters, they are not the primary focus of this document as they require customizations during cluster setup and are not fully tested on HDInsight clusters. Notes on using these frameworks with HDInsight are included at the end of this document.

###Java vs. Clojure topology definition

Of the two methods of defining a topology, Clojure is by far the easiest/cleanest as you can directly referenc python components in the topology definition. For Java-based topology definitions, you must also define Java components that handle things like declaring the fields in the tuples returned from the Python components.

Both methods are described in this document, along with example projects.

##Python components with a Java topology

> [AZURE.NOTE] This example is available at [https://github.com/Azure-Samples/hdinsight-python-storm-wordcount](https://github.com/Azure-Samples/hdinsight-python-storm-wordcount) in the __JavaTopology__ directory. This is a Maven based project. If you are unfamiliar with Maven, see [Develop Java-based topologies with Apache Storm on HDInsight](hdinsight-storm-develop-java-topology.md) for more information on creating a Maven project for a Storm topology.

A Java-based topology that uses Python (or other JVM language components,) initially appears to use Java components; but if you look in each of the Java spouts/bolts, you'll see code similar to the following:

    public SplitBolt() {
        super("python", "countbolt.py");
    }

This is where Java invokes Python and runs the script that contains the actual bolt logic. The Java spouts/bolts (for this example,) simply declare the fields in the tuple that will be emitted by the underlying Python component.

The actual Python files are stored in the `/multilang/resources` directory in this example. The `/multilang` directory is referenced in the __pom.xml__:

<resources>
    <resource>
        <!-- Where the Python bits are kept -->
        <directory>${basedir}/multilang</directory>
    </resource>
</resources>

This includes all the files in the `/multilang` folder in the jar that will be built from this project.

> [AZURE.IMPORTANT] Note that this only specifies the `/multilang` directory and not `/multilang/resources`. Storm expects non-JVM resources in a `resources` directory, so it is looked for internally already. Placing components in this folder allows you to just reference by name in the Java code. For example, `super("python", "countbolt.py");`. Another way to think of it is that Storm sees the `resources` directory as the root (/) when accessing multi-lang resources.
>
> For this example project, the `storm.py` module is included in the `/multilang/resources` directory.

###Build and run the project

To run this project locally, just use the following Maven command to build and run in local mode:

    mvn compile exec:java -Dstorm.topology=com.microsoft.example.WordCount

Use ctrl+c to kill the process.

To deploy the project to an HDInsight cluster running Apache Storm, use the following steps:

1. Build an uber jar:

        mvn package

    This will create a file named __WordCount--1.0-SNAPSHOT.jar__ in the `/target` directory for this project.

2. Upload the jar file to the Hadoop cluster using one of the following methods:

    * For __Linux-based__ HDInsight clusters: Use `scp WordCount-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:WordCount-1.0-SNAPSHOT.jar` to copy the jar file to the cluster, replacing USERNAME with your SSH user name and CLUSTERNAME with the HDInsight cluster name.

        Once the file has finished uploading, connect to the cluster using SSH and start the topology using `storm jar WordCount-1.0-SNAPSHOT.jar com.microsoft.example.WordCount wordcount`

    * For __Windows-based__ HDInsight clusters: Connect to the Storm Dashboard by going to HTTPS://CLUSTERNAME.azurehdinsight.net/ in your browser. Replace CLUSTERNAME with your HDInsight cluster name and provide the admin name and password when prompted.

        Using the form, perform the following actions:

        * __Jar File__: Select __Browse__, then select the __WordCount-1.0-SNAPSHOT.jar__ file
        * __Class Name__: Enter `com.microsoft.example.WordCount`
        * __Additional Paramters__: Enter a friendly name such as `wordcount` to identify the topology

        Finally, select __Submit__ to start the topology.

> [AZURE.NOTE] Once started, a Storm topology runs until stopped (killed.) To stop the topology, use either the `storm kill TOPOLOGYNAME` command from the command-line (SSH session to a Linux cluster for example,) or by using the Storm UI, select the topology, and then select the __Kill__ button.

##Python components with a Clojure topology

> [AZURE.NOTE] This example is available at [https://github.com/Azure-Samples/hdinsight-python-storm-wordcount](https://github.com/Azure-Samples/hdinsight-python-storm-wordcount) in the __ClojureTopology__ directory.

This topology was created by using [Leiningen](http://leiningen.org) to [create a new Clojure project](https://github.com/technomancy/leiningen/blob/stable/doc/TUTORIAL.md#creating-a-project). After that, the following modifications to the scaffolded project were made:

* __project.clj__: Added dependencies for Storm, and exclusions for items that may cause a problem when deployed to the HDInsight server.
* __resources/resources__: Leiningen creates a default `resources` directory, however the files stored here appear to get added to the root of the jar file created from this project, and Storm expects files in a sub-directory named `resources`. So a sub-directory was added and the Python files are stored in `resources/resources`. At run-time, this will be treated as the root (/) for accessing Python components.
* __src/wordcount/core.clj__: This file contains the topology definition, and is referenced from the __project.clj__ file. For more information on using Clojure to define a Storm topology, see [Clojure DSL](https://storm.apache.org/documentation/Clojure-DSL.html).

###Build and run the project

__To build and run the project locally__, use the following command:

    lein do clean, run

To stop the topology, use __Ctrl+C__.

__To build an uberjar and deploy to HDInsight__, use the following steps:

1. Create an uberjar containing the topology and required dependencies:

        lein uberjar

    This will create a new file named `wordcount-1.0-SNAPSHOT.jar` in the `target\uberjar+uberjar` directory.
    
2. Use one of the following methods to deploy and run the topology to an HDInsight cluster:

    * __Linux-based HDInsight__
    
        1. Copy the file to the HDInsight cluster head node using `scp`. For example:
        
                scp wordcount-1.0-SNAPSHOT.jar USERNAME@CLUSTERNAME-ssh.azurehdinsight.net:wordcount-1.0-SNAPSHOT.jar
                
            Replace USERNAME with an SSH user for your cluster, and CLUSTERNAME with your HDInsight cluster name.
            
        2. Once the file has been copied to the cluster, use SSH to connect to the cluster and submit the job. For information on using SSH with HDInsight, see one of the following:
        
            * [Use SSH with Linux-based HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
            * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)
            
        3. Once connected, use the following to start the topology:
        
                storm jar wordcount-1.0-SNAPSHOT.jar wordcount.core wordcount
    
    * __Windows-based HDInsight__
    
        1. Connect to the Storm Dashboard by going to HTTPS://CLUSTERNAME.azurehdinsight.net/ in your browser. Replace CLUSTERNAME with your HDInsight cluster name and provide the admin name and password when prompted.

        2. Using the form, perform the following actions:

            * __Jar File__: Select __Browse__, then select the __wordcount-1.0-SNAPSHOT.jar__ file
            * __Class Name__: Enter `wordcount.core`
            * __Additional Paramters__: Enter a friendly name such as `wordcount` to identify the topology

            Finally, select __Submit__ to start the topology.

> [AZURE.NOTE] Once started, a Storm topology runs until stopped (killed.) To stop the topology, use either the `storm kill TOPOLOGYNAME` command from the command-line (SSH session to a Linux cluster,) or by using the Storm UI, select the topology, and then select the __Kill__ button.

##Pyleus framework

[Pyleus](https://github.com/Yelp/pyleus) is a framework that attempts to make it easier to use Python with Storm by providing the following:

* __YAML-based topology definitions__: This provides an easier way to define the topology, that doesn't require knowledge of Java or Clojure
* __MessagePack-based serializer__: MessagePack is used as the default serialization, instead of JSON. This can result in faster messaging between components
* __Dependency management__: Virtualenv is used to ensure that Python dependencies are deployed to all worker nodes. This requires Virtualenv to be installed on the worker nodes

> [AZURE.IMPORTANT] Pyleus requires Storm on your development environment. Using the base Apache Storm 0.9.3 distribution seems to result in jars that are incompatible with the version of Storm provided with HDInsight. So the following steps use the HDInsight cluster as the development environment.

You can successfuly build the example Pyleus topologies, using the HDInsight head node as the build environment:

1. When provisioning a new Storm on HDInsight cluster, you must ensure that Python Virtualenv is present on the cluster nodes. When creating a new Linux-based HDInsight cluster, use the following Script Action settings with [Cluster customization](hdinsight-hadoop-customize-cluster.md):

    * __Name__: Just provide a friendly name here
    * __ Script URI__: Use `https://hditutorialdata.blob.core.windows.net/customizecluster/pythonvirtualenv.sh` as the value. This script will install Python Virtualenv on the nodes.
    
        > [AZURE.NOTE] It will also create some directories that are used by the Streamparse framework later in this document.
        
    * __Nimbus__: Check this entry so that the script is applied to the Nimbus (head) nodes.
    * __Supervisor__: Check ths entry so that the script is applied to the supervisor (worker) nodes
    
    Leave other entries blank.

1. Once the cluster has been created, connect using SSH:

    * [Use SSH with Linux-based HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
    * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. From the SSH connect, use the following to create a new virtual environment and install Pyleus:

        virtualenv pyleus_venv
        source pyleus_venv
        pip install pyleus

3. Next, download the Pyleus git repository and build the WordCount example:

        sudo apt-get install git
        git clone https://github.com/Yelp/pyleus.git
        pyleus build pyleus/examples/word_count/pyleus_topology.yaml
    
    Once the build completes, you will have a new file named `word_count.jar` in the current directory.
    
4. To submit the topology to the Storm cluster, use the following command:

        pyleus submit -n localhost word_count.jar
    
    The `-n` parameter specifies the Nimbus host. Since we are on the head node, we can use `localhost`.
    
    You can also use the `pyleus` command to perform other Storm actions. Use the following to list the running topologies, and then kill the `word_count` topology:
    
        pyleus list -n localhost
        pyleus kill -n localhost word_count

##Streamparse framework

[Streamparse](https://github.com/Parsely/streamparse) is a framework that attempts to make it easier to use Python with Storm by providing the following:

* __Scaffolding__: This allows you to easily create the scaffolding for a project, then modify files to add your logic
* __Clojure DSL functions__: These reduce the verbosity of using Python components in a Clojure topology definition
* __Dependency management__: Virtualenv is used to ensure that Python dependencies are deployed to all worker nodes. This requires Virtualenv to be installed on the worker nodes
* __Remote deployment__: Streamparse can use SSH automation to deploy components to worker nodes, and will can create an SSH tunnel to communicate with Nimbus. So you can easily deploy from your development environment to Linux-based cluster such as HDInsight

> [AZURE.IMPORTANT] Streamparse relies on components that expect [Unix signals](https://en.wikipedia.org/wiki/Unix_signal), which are not available on Windows. Your development environment must be Linux, Unix, or OS X, and the HDInsight cluster must be Linux-based.

1. When provisioning a new Storm on HDInsight cluster, you must ensure that Python Virtualenv is present on the cluster nodes. When creating a new Linux-based HDInsight cluster, use the following Script Action settings with [Cluster customization](hdinsight-hadoop-customize-cluster.md):

    * __Name__: Just provide a friendly name here
    * __ Script URI__: Use `https://hditutorialdata.blob.core.windows.net/customizecluster/pythonvirtualenv.sh` as the value. This script will install Python Virtualenv on the nodes, as well as create directories used by Streamparse
    * __Nimbus__: Check this entry so that the script is applied to the Nimbus (head) nodes.
    * __Supervisor__: Check ths entry so that the script is applied to the supervisor (worker) nodes
    
    Leave other entries blank.
    
    > [AZURE.WARNING] You must also use a __public key__ to secure the SSH user for your HDInsight cluster in order to remotely deploy using Streamparse.
    >
    > For more information on using keys with SSH on HDInsight, see one of the following documents:
    >
    > * [Use SSH with Linux-based HDInsight from Linux, Unix, or OS X](hdinsight-hadoop-linux-use-ssh-unix.md)
    > * [Use SSH with Linux-based HDInsight from Windows](hdinsight-hadoop-linux-use-ssh-windows.md)

2. While the cluster is provisioning, install Streamparse on your development environment using the following command:

        pip install streamparse
        
3. Once Streamparse has installed, use the following command to create an example project:

        sparse quickstart wordcount
        
    This will create a new directory named `wordcount`, and populate it with an example Word Count project.

4. Change directories into the `wordcount` directory and start the topology in local mode:

        cd wordcount
        sparse run

    Use Ctrl+C to stop the topology.

###Deploy the topology

Once your Linux-based HDInsight cluster has been created, use the following steps to deploy the topology to the cluster:

1. Use the following command to find the fully qualified domain names of the worker nodes for your cluster:

        curl -u admin:PASSWORD -G https://CLUSTERNAME.azurehdinsight.net/api/v1/clusters/CLUSTERNAME/hosts | grep '"host_name" : "worker'
    
    This will retrieve the hosts information for the cluster, pipe it to grep, and return on the entries for the worker nodes. You should see results similar to the following:
    
        "host_name" : "workernode0.1kft5e4nx2tevg5b2pdwxqx1fb.jx.internal.cloudapp.net"
    
    Save the `"workernode0.1kft5e4nx2tevg5b2pdwxqx1fb.jx.internal.cloudapp.net"` information, as it will be used in the next step.

2. Open the __config.json__ file in the `wordcount` directory, and change the following entries:

    * __user__: Set this to the SSH user account name that you configured for the HDInsight cluster. This will be used to authenticate to the cluster when deploying the project
    * __nimbus__: Set this to `CLUSTERNAME-ssh.azurehdinsight.net`. Replace CLUSTERNAME with the name of your cluster. This is used when communicating with the Nimbus node, which is the head node of the cluster
    * __workers__: Populate the workers entry with the host names for the worker nodes that you retrieved using curl. For example:
    
        ```
"workers": [
    "workernode0.1kft5e4nx2tevg5b2pdwxqx1fb.jx.internal.cloudapp.net",
    "workernode1.1kft5e4nx2tevg5b2pdwxqx1fb.jx.internal.cloudapp.net"
    ]
        ```
    
    * __virtualenv\_root__: Set this to "/virtualenv"
    
    This configures the project for your HDInsight cluster, including the `/virtualenv` directory that was created during provisioning by the script action.

4. Since Streamparse deploying on HDInsight needs to forward your authentication through the head node to the workers, `ssh-agent` must be started on your workstation. For most operating systems, it is started automatically. Use the following command to verify that it is running:

        echo "$SSH_AUTH_SOCK"
    
    This will return a response similar to the following if `ssh-agent` is running:
    
        /tmp/ssh-rfSUL1ldCldQ/agent.1792
    
    > [AZURE.NOTE] The complete path may be different depending on your operating system. For example, on OS X the path may be similar to `/private/tmp/com.apple.launchd.vq2rfuxaso/Listeners`. But it should return some path if the agent is running.
    
    If nothing is returned, use the `ssh-agent` command to start the agent.
    
5. Verify that the agent knows about the key you use to authenticate to the HDInsight server. Use the following command to list the keys that are available to the agent:

        ssh-add -L
    
    This will return the private keys that have been added to the agent. You can compare the results to the content of the private key you generated when creating an SSH key to authenticate to HDInsight.
    
    If no information is returned, or the returned information does not match your private key, use the following to add the private key to the agent:
    
        ssh-add /path/to/key/file
    
    For example, `ssh-add ~/.ssh/id_rsa`.

4. You must also configure SSH so that it knows forwarding should be used for your HDInsight cluster. Add the following to `~/.ssh/config`. If this file does not exist, create it and use the following as the contents:

        Host *.azurehdinsight.net
          ForwardAgent yes
        
        Host *.internal.cloudapp.net
          ProxyCommand ssh CLUSTERNAME-ssh.azurehdinsight.net nc %h %p
    
    Replace CLUSTERNAME with the name of your HDInsight cluster.
    
    This configures the SSH agent on your workstation to enable the forwarding of your SSH credentials through any *.azurehdinsight.net system that you connect to. In this case, the head node of your cluster. Next, it configures the command used to proxy SSH traffic from the headnode to the individual worker nodes (internal.cloudapp.net.) This allows Streamparse to connect to the head node, then from there to each of the worker nodes, using the key authentication for your SSH account.
    
5. Finally, use the following command to submit the topology from your local development environment, to the HDInsight cluster:

        sparse submit
    
    This will connect to the HDInsight cluster, deploy the topology and any Python dependencies, then start the topology.

##Next steps

In this document, you learned how to use Python components from a Storm topology. See the following documents for other ways to use Python with HDInsight:

* [How to use Python for streaming MapReduce jobs](hdinsight-hadoop-streaming-python.md)
* [How to use Python User Defined Functions (UDF) in Pig and Hive](hdinsight-python.md)