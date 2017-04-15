---
title: Process events from Event Hubs with Storm on HDInsight | Microsoft Docs
description: Learn how to process Event Hubs data with a C# Storm topology created in Visual Studio using the HDInsight Tools for Visual Studio.
services: hdinsight,notification hubs
documentationcenter: ''
author: Blackmist
manager: jhubbard
editor: cgronlun

ms.assetid: 67f9d08c-eea0-401b-952b-db765655dad0
ms.service: hdinsight
ms.custom: hdinsightactive
ms.devlang: dotnet
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 03/01/2017
ms.author: larryfr

---
# Process events from Azure Event Hubs with Storm on HDInsight (C#)

Azure Event Hubs allows you to process massive amounts of data from websites, apps, and devices. The Event Hubs spout makes it easy to use Apache Storm on HDInsight to analyze this data in real time. You can also write data to Event Hubs from Storm by using the Event Hubs bolt.

In this tutorial, you will learn how to use the Visual Studio templates installed with HDInsight Tools for Visual Studio to create two topologies that work with Azure Event Hubs.

* **EventHubWriter**: Randomly generates data and writes it to Event Hubs
* **EventHubReader**: Reads data from Event Hubs and logs the data to the Storm logs

> [!NOTE]
> For a Java version of this project, see [Process events from Azure Event Hubs with Storm on HDInsight (Java)](hdinsight-storm-develop-java-event-hub-topology.md).

## SCP.NET

These projects use SCP.NET, a NuGet package that makes it easy to create C# topologies and components for use with Storm on HDInsight.

> [!IMPORTANT]
> While the steps in this document rely on a Windows development environment with Visual Studio, the compiled project can be submitted to a Storm on HDInsight cluster that uses Linux. __Only Linux-based clusters created after 10/28/2016 support SCP.NET topologies.__

### Cluster versioning

The Microsoft.SCP.Net.SDK NuGet package used by your project must match the major version of Storm installed on HDInsight. Storm on HDInsight versions 3.3 and 3.4 use Storm version 0.10.x, so you must use SCP.NET version 0.10.x.x with these clusters. HDInsight 3.5 uses Storm 1.0.x., so you must use SCP.NET version 1.0.x.x with this cluster version.

> [!IMPORTANT]
> Linux is the only operating system used on HDInsight version 3.4 or greater. For more information, see [HDInsight Deprecation on Windows](hdinsight-component-versioning.md#hdi-version-33-nearing-deprecation-date).

HDInsight 3.4 and greater use Mono to run C# topologies. Most things work with Mono. However you should check the [Mono Compatibility](http://www.mono-project.com/docs/about-mono/compatibility/) document for potential incompatibilities.

C# topologies must also target .NET 4.5.

## How to work with Event Hubs

Microsoft provides a set of Java components that can be used to communicate with Azure Event Hubs from a Storm topology. You can find the jar file that contains the latest version of these components at [https://github.com/hdinsight/hdinsight-storm-examples/blob/master/lib/eventhubs/](https://github.com/hdinsight/hdinsight-storm-examples/blob/master/lib/eventhubs/).

> [!IMPORTANT]
> While the components are written in Java, you can easily use them from a C# topology.

The components following components are used in this example:

* __EventHubSpout__: Reads data from Event Hubs.
* __EventHubBolt__: Writes data to Event Hubs.
* __EventHubSpoutConfig__: Used to configure EventHubSpout.
* __EventHubBoltConfig__: Used to configure EventHubBolt.
* __UnicodeEventDataScheme__: Used to configure the spout to use UTF-8 encoding when reading from Event Hubs. The default encoding is String.

### Example Spout usage

SCP.NET provides methods for adding an EventHubSpout to your topology. These methods make it easier to add a spout than using the generic methods for adding a Java component. The following example demonstrates how to create a spout using the __SetEventHubSpout__ and EventHubSpoutConfig methods provided by SCP.NET:

```csharp
topologyBuilder.SetEventHubSpout(
    "EventHubSpout",
    new EventHubSpoutConfig(
        // the shared access signature name and key used to read the data
        ConfigurationManager.AppSettings["EventHubSharedAccessKeyName"],
        ConfigurationManager.AppSettings["EventHubSharedAccessKey"],
        // The namespace that contains the Event Hub to read from
        ConfigurationManager.AppSettings["EventHubNamespace"],
        // The Event Hub name to read from
        ConfigurationManager.AppSettings["EventHubEntityPath"],
        // The number of partitions in the Event Hub
        eventHubPartitions),
    // Parallelism hint for this component. Should be set to the partition count.
    eventHubPartitions);
```

The previous example creates a new spout component named __EventHubSpout__, and configures it to communicate with an Event Hub. The parallelism hint for the component is set to the number of partitions in the Event Hub. This setting allows Storm to create an instance of the component for each partition.

> [!WARNING]
> As of January 1st, 2017, using the SetEventHubSpout and EventHubSpoutConfig methods create a spout that uses String encoding when reading data from Event Hubs.

You can also use the generic JavaComponentConstructor method when creating a spout. The following example demonstrates how to create a spout using the JavaComponentConstructor method. It also demonstrates how to configure the spout to read data using a UTF-8 encoding instead of String.

```csharp
// Create an instance of UnicodeEventDataScheme
var schemeConstructor = new JavaComponentConstructor("com.microsoft.eventhubs.spout.UnicodeEventDataScheme");
// Create an instance of EventHubSpoutConfig
var eventHubSpoutConfig = new JavaComponentConstructor(
    "com.microsoft.eventhubs.spout.EventHubSpoutConfig",
    new List<Tuple<string, object>>()
    {
        // the shared access signature name and key used to read the data
        Tuple.Create<string, object>(JavaComponentConstructor.JAVA_LANG_STRING, ConfigurationManager.AppSettings["EventHubSharedAccessKeyName"]),
        Tuple.Create<string, object>(JavaComponentConstructor.JAVA_LANG_STRING, ConfigurationManager.AppSettings["EventHubSharedAccessKey"]),
        // The namespace that contains the Event Hub to read from
        Tuple.Create<string, object>(JavaComponentConstructor.JAVA_LANG_STRING, ConfigurationManager.AppSettings["EventHubNamespace"]),
        // The Event Hub name to read from
        Tuple.Create<string, object>(JavaComponentConstructor.JAVA_LANG_STRING, ConfigurationManager.AppSettings["EventHubEntityPath"]),
        // The number of partitions in the Event Hub
        Tuple.Create<string, object>("int", eventHubPartitions),
        // The encoding scheme to use when reading
        Tuple.Create<string, object>("com.microsoft.eventhubs.spout.IEventDataScheme", schemeConstructor)
    }
    );
// Create an instance of the spout
var eventHubSpout = new JavaComponentConstructor(
    "com.microsoft.eventhubs.spout.EventHubSpout",
    new List<Tuple<string, object>>()
    {
        Tuple.Create<string, object>("com.microsoft.eventhubs.spout.EventHubSpoutConfig", eventHubSpoutConfig)
    }
    );
// Set the spout in the topology
topologyBuilder.SetJavaSpout("EventHubSpout", eventHubSpout, eventHubPartitions);
```

> [!IMPORTANT]
> UnicodeEventDataScheme is only available in the 9.5 version of the Event Hub components, which is available from [https://github.com/hdinsight/hdinsight-storm-examples/blob/master/lib/eventhubs/](https://github.com/hdinsight/hdinsight-storm-examples/blob/master/lib/eventhubs/).

### Example Bolt usage

Use the JavaComponmentConstructor method to create an instance of the bolt. The following example demonstrates how to create and configure a new instance of the EventHubBolt:

```csharp
//Create constructor for the Java bolt
JavaComponentConstructor constructor =
    // Use a Clojure expression to create the EventHubBoltCOnfig
    JavaComponentConstructor.CreateFromClojureExpr(
        String.Format(@"(org.apache.storm.eventhubs.bolt.EventHubBolt. (org.apache.storm.eventhubs.bolt.EventHubBoltConfig. " +
        @"""{0}"" ""{1}"" ""{2}"" ""{3}"" ""{4}"" {5}))",
    // The policy name and key used to read from Event Hubs
    ConfigurationManager.AppSettings["EventHubPolicyName"],
    ConfigurationManager.AppSettings["EventHubPolicyKey"],
    // The namespace that contains the Event Hub
    ConfigurationManager.AppSettings["EventHubNamespace"],
    "servicebus.windows.net", //suffix for the namespace fqdn
    // The Evetn Hub Name)
    ConfigurationManager.AppSettings["EventHubName"],
    "true"));

//Set the bolt
topologyBuilder.SetJavaBolt(
        "EventHubBolt",
        constructor,
        partitionCount). //Parallelism hint uses partition count
    shuffleGrouping("Spout"); //Consume data from spout
```

> [!NOTE]
> This example uses a Clojure expression passed as a string, instead of using JavaComponentConstructor to create an EventHubBoltConfig as the Spout example did. Either method works. Use the method that feels best to you.

## Download the completed project

You can download a complete version of the project created in this tutorial from GitHub: [eventhub-storm-hybrid](https://github.com/Azure-Samples/hdinsight-dotnet-java-storm-eventhub). However, you still need to provide configuration settings by following the steps in this tutorial.

### Prerequisites

* An [Apache Storm on HDInsight cluster version 3.5](hdinsight-apache-storm-tutorial-get-started.md)

    > [!WARNING]
    > The example used in this document requires Storm on HDInsight version 3.5. This will not work with older versions of HDInsight due to breaking class name changes. For a version of this example that works with older clusters, see [https://github.com/Azure-Samples/hdinsight-dotnet-java-storm-eventhub/releases](https://github.com/Azure-Samples/hdinsight-dotnet-java-storm-eventhub/releases).

* An [Azure Event Hub](../event-hubs/event-hubs-csharp-ephcs-getstarted.md)

* The [Azure .NET SDK](http://azure.microsoft.com/downloads/)

* The [HDInsight Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md)

* Java JDK 1.7 greater on your development environment. JDK downloads are available from [http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html).

  * The **JAVA_HOME** environment variable must point to the directory that contains Java.
  * The **%JAVA_HOME%/bin** directory must be in the path

## Download the Event Hub components

The spout and bolt are distributed as a single Java archive (.jar) file named **eventhubs-storm-spout-#.#-jar-with-dependencies.jar**, where #.# is the version of the file.

To use this solution with HDInsight 3.5, use the version 0.9.5 jar file from  [https://github.com/hdinsight/hdinsight-storm-examples/blob/master/lib/eventhubs/](https://github.com/hdinsight/hdinsight-storm-examples/blob/master/lib/eventhubs/).

Create a directory named `eventhubspout` and save the file into the directory.

## Configure Event Hubs

Event Hubs is the data source for this example. Use the information in the **Create an Event Hub** section of the [Get started with Event Hubs](../event-hubs/event-hubs-csharp-ephcs-getstarted.md) document.

1. After the event hub has been created, view the EventHub blade in the Azure portal and select **Shared access Policies**. Select **+ Add** to add the following policies:

   | Name | Permissions |
   | --- | --- |
   | writer |Send |
   | reader |Listen |

    ![policies](./media/hdinsight-storm-develop-csharp-event-hub-topology/sas.png)

2. Select the **reader** and **writer** policies. Copy and save the **PRIMARY KEY** value for both policies, as these values are used later.

## Configure the EventHubWriter

1. If you have not already installed the latest version of the HDInsight Tools for Visual Studio, see [Get started using HDInsight Tools for Visual Studio](hdinsight-hadoop-visual-studio-tools-get-started.md).

2. Download the solution from [eventhub-storm-hybrid](https://github.com/Azure-Samples/hdinsight-dotnet-java-storm-eventhub).

3. In the **EventHubWriter** project, open the **App.config** file. Use the information from the Event Hub you configured earlier to fill in the value for the following keys:

   | Key | Value |
   | --- | --- |
   | EventHubPolicyName |writer (If you used a different name for the policy with *Send* permission, use it instead.) |
   | EventHubPolicyKey |The key for the writer policy |
   | EventHubNamespace |The namespace that contains your Event Hub |
   | EventHubName |Your Event Hub name |
   | EventHubPartitionCount |The number of partitions in your Event Hub |

4. Save and close the **App.config** file.

## Configure the EventHubReader

1. Open the **EventHubReader** project.

2. Open the **App.config** for the **EventHubReader**. Use the information from the Event Hub you configured earlier to fill in the value for the following keys:

   | Key | Value |
   | --- | --- |
   | EventHubPolicyName |reader (If you used a different name for the policy with *listen* permission, use it instead.) |
   | EventHubPolicyKey |The key for the reader policy |
   | EventHubNamespace |The namespace that contains your Event Hub |
   | EventHubName |Your Event Hub name |
   | EventHubPartitionCount |The number of partitions in your Event Hub |

3. Save and close the **App.config** file.

## Deploy the topologies

1. From **Solution Explorer**, right-click the **EventHubReader** project and select **Submit to Storm on HDInsight**.

    ![submit to storm](./media/hdinsight-storm-develop-csharp-event-hub-topology/submittostorm.png)

2. On the **Submit Topology** screen, select your **Storm Cluster**. Expand **Additional Configurations**, select **Java File Paths**, select **...** and select the directory that contains the jar file that you downloaded earlier. Finally, click **Submit**.

    ![Image of submission dialog](./media/hdinsight-storm-develop-csharp-event-hub-topology/submit.png)

3. When the topology has been submitted, the **Storm Topologies Viewer** appears. To view information about the topology, select the **EventHubReader** topology in the left pane.

    ![example storage view](./media/hdinsight-storm-develop-csharp-event-hub-topology/topologyviewer.png)

4. From **Solution Explorer**, right-click the **EventHubWriter** project and select **Submit to Storm on HDInsight**.

5. On the **Submit Topology** screen, select your **Storm Cluster**. Expand **Additional Configurations**, select **Java File Paths**, select **...** and select the directory that contains the jar file you downloaded earlier. Finally, click **Submit**.

6. When the topology has been submitted, refresh the topology list in the **Storm Topologies Viewer** to verify that both topologies are running on the cluster.

7. In **Storm Topologies Viewer**, select the **EventHubReader** topology.

8. To open the **Component Summary** for the bolt, double-click the **LogBolt** component in the diagram.

9. In the **Executors** section, select one of the links in the **Port** column. This will display information logged by the component. The logged information is similar to the following text:

        2017-03-02 14:51:29.255 m.s.p.TaskHost [INFO] Received C# STDOUT: 2017-03-02 14:51:29,255 [1] INFO  EventHubReader_LogBolt [(null)] - Received data: {"deviceValue":1830978598,"deviceId":"8566ccbc-034d-45db-883d-d8a31f34068e"}
        2017-03-02 14:51:29.283 m.s.p.TaskHost [INFO] Received C# STDOUT: 2017-03-02 14:51:29,283 [1] INFO  EventHubReader_LogBolt [(null)] - Received data: {"deviceValue":1756413275,"deviceId":"647a5eff-823d-482f-a8b4-b95b35ae570b"}
        2017-03-02 14:51:29.313 m.s.p.TaskHost [INFO] Received C# STDOUT: 2017-03-02 14:51:29,312 [1] INFO  EventHubReader_LogBolt [(null)] - Received data: {"deviceValue":1108478910,"deviceId":"206a68fa-8264-4d61-9100-bfdb68ee8f0a"}

## Stop the topologies

To stop the topologies, select each topology in the **Storm Topology Viewer**, then click **Kill**.

![image of killing a topology](./media/hdinsight-storm-develop-csharp-event-hub-topology/killtopology.png)

## Delete your cluster

[!INCLUDE [delete-cluster-warning](../../includes/hdinsight-delete-cluster-warning.md)]

## Next Steps

In this document, you have learned how to use the Java Event Hubs Spout and Bolt from a C# topology to work with data in Azure Event Hub. To learn more about creating C# topologies, see the following documents:

* [Develop C# topologies for Apache Storm on HDInsight using Visual Studio](hdinsight-storm-develop-csharp-visual-studio-topology.md)
* [SCP programming guide](hdinsight-storm-scp-programming-guide.md)
* [Example topologies for Storm on HDInsight](hdinsight-storm-example-topology.md)
