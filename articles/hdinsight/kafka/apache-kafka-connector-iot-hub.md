---
title: Use Apache Kafka on HDInsight with Azure IoT Hub 
description: Learn how to use Apache Kafka on HDInsight with Azure IoT Hub. The Kafka Connect Azure IoT Hub project provides a source and sink connector for Kafka. The source connector can read data from IoT Hub, and the sink connector writes to IoT Hub.
#Customer intent: As a developer, I need to use the Kafka IoT Hub connector with Kafka on HDInsight.
ms.service: hdinsight
ms.topic: how-to
ms.custom: hdinsightactive
ms.date: 11/17/2022
---

# Use Apache Kafka on HDInsight with Azure IoT Hub

Learn how to use the [Apache Kafka Connect Azure IoT Hub](https://github.com/Azure/toketi-kafka-connect-iothub) connector to move data between Apache Kafka on HDInsight and Azure IoT Hub. In this document, you learn how to run the IoT Hub connector from an edge node in the cluster.

The Kafka Connect API allows you to implement connectors that continuously pull data into Kafka, or push data from Kafka to another system. The [Apache Kafka Connect Azure IoT Hub](https://github.com/Azure/toketi-kafka-connect-iothub) is a connector that pulls data from Azure IoT Hub into Kafka. It can also push data from Kafka to the IoT Hub.

When pulling from the IoT Hub, you use a __source__ connector. When pushing to IoT Hub, you use a __sink__ connector. The IoT Hub connector provides both the source and sink connectors.

The following diagram shows the data flow between Azure IoT Hub and Kafka on HDInsight when using the connector.

:::image type="content" source="./media/apache-kafka-connector-iot-hub/iot-hub-kafka-connector-hdinsight.png" alt-text="Image showing data flowing from IoT Hub to Kafka through the connector" border="false":::

For more information on the Connect API, see [https://kafka.apache.org/documentation/#connect](https://kafka.apache.org/documentation/#connect).

## Prerequisites

* An Apache Kafka cluster on HDInsight. For more information, see the [Kafka on HDInsight quickstart](apache-kafka-get-started.md) document.

* An edge node in the Kafka cluster. For more information, see the [Use edge nodes with HDInsight](../hdinsight-apps-use-edge-node.md) document.

* An SSH client. For more information, see [Connect to HDInsight (Apache Hadoop) using SSH](../hdinsight-hadoop-linux-use-ssh-unix.md).

* An Azure IoT Hub and device. For this article, consider using [Connect Raspberry Pi online simulator to Azure IoT Hub](../../iot-hub/iot-hub-raspberry-pi-web-simulator-get-started.md).

* [Scala build tool](https://www.scala-sbt.org/).

## Build the connector

1. Download the source for the connector from [https://github.com/Azure/toketi-kafka-connect-iothub/](https://github.com/Azure/toketi-kafka-connect-iothub/) to your local environment.

2. From a command prompt, navigate to the `toketi-kafka-connect-iothub-master` directory. Then use the following command to build and package the project:

    ```cmd
    sbt assembly
    ```

    The build will take a few minutes to complete. The command creates a file named `kafka-connect-iothub-assembly_2.11-0.7.0.jar` in the `toketi-kafka-connect-iothub-master\target\scala-2.11` directory for the project.

## Install the connector

1. Upload the .jar file to the edge node of your Kafka on HDInsight cluster. Edit the command below by replacing `CLUSTERNAME` with the actual name of your cluster. The default values for the SSH user account and name of [edge node](../hdinsight-apps-use-edge-node.md#access-an-edge-node) are used below, modify as needed.

    ```cmd
    scp kafka-connect-iothub-assembly*.jar sshuser@new-edgenode.CLUSTERNAME-ssh.azurehdinsight.net:
    ```

1. Once the file copy completes, connect to the edge node using SSH:

    ```bash
    ssh sshuser@new-edgenode.CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. To install the connector into the Kafka `libs` directory, use the following command:

    ```bash
    sudo mv kafka-connect-iothub-assembly*.jar /usr/hdp/current/kafka-broker/libs/
    ```

Keep your SSH connection active for the remaining steps.

## Configure Apache Kafka

From your SSH connection to the edge node, use the following steps to configure Kafka to run the connector in standalone mode:

1. Set up password variable. Replace PASSWORD with the cluster login password, then enter the command:

    ```bash
    export password='PASSWORD'
    ```

1. Install the [jq](https://stedolan.github.io/jq/) utility. jq makes it easier to process JSON documents returned from Ambari queries. Enter the following command:

    ```bash
    sudo apt -y install jq
    ```

1. Get the address of the Kafka brokers. There may be many brokers in your cluster, but you only need to reference one or two. To get the address of two broker hosts, use the following command:

    ```bash
    export clusterName=$(curl -u admin:$password -sS -G "http://headnodehost:8080/api/v1/clusters" | jq -r '.items[].Clusters.cluster_name')

    export KAFKABROKERS=`curl -sS -u admin:$password -G http://headnodehost:8080/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`
    echo $KAFKABROKERS
    ```

    Copy the values for later use. The value returned is similar to the following text:

    `<brokername1>.w5ijyohcxt5uvdhhuaz5ra4u5f.ex.internal.cloudapp.net:9092,<brokername2>.w5ijyohcxt5uvdhhuaz5ra4u5f.ex.internal.cloudapp.net:9092`

1. Get the address of the Apache Zookeeper nodes. There are several Zookeeper nodes in the cluster, but you only need to reference one or two. Use the following command to the store the addresses in the variable `KAFKAZKHOSTS`:

    ```bash
    export KAFKAZKHOSTS=`curl -sS -u admin:$password -G http://headnodehost:8080/api/v1/clusters/$clusterName/services/ZOOKEEPER/components/ZOOKEEPER_SERVER | jq -r '["\(.host_components[].HostRoles.host_name):2181"] | join(",")' | cut -d',' -f1,2`
    ```

1. When running the connector in standalone mode, the `/usr/hdp/current/kafka-broker/config/connect-standalone.properties` file is used to communicate with the Kafka brokers. To edit the `connect-standalone.properties` file, use the following command:

    ```bash
    sudo nano /usr/hdp/current/kafka-broker/config/connect-standalone.properties
    ```

1. Make the following edits:

    |Current value |New value | Comment |
    |---|---|---|
    |`bootstrap.servers=localhost:9092`|Replace the `localhost:9092` value with the broker hosts from the previous step|Configures the standalone configuration for the edge node to find the Kafka brokers.|
    |`key.converter=org.apache.kafka.connect.json.JsonConverter`|`key.converter=org.apache.kafka.connect.storage.StringConverter`|This change allows you to test using the console producer included with Kafka. You may need different converters for other producers and consumers. For information on using other converter values, see [https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md).|
    |`value.converter=org.apache.kafka.connect.json.JsonConverter`|`value.converter=org.apache.kafka.connect.storage.StringConverter`|Same as above.|
    |N/A|`consumer.max.poll.records=10`|Add to end of file. This change is to prevent timeouts in the sink connector by limiting it to 10 records at a time. For more information, see [https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md).|

1. To save the file, use __Ctrl + X__, __Y__, and then __Enter__.

1. To create the topics used by the connector, use the following commands:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic iotin --zookeeper $KAFKAZKHOSTS

    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --create --replication-factor 3 --partitions 8 --topic iotout --zookeeper $KAFKAZKHOSTS
    ```

    To verify that the `iotin` and `iotout` topics exist, use the following command:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-topics.sh --list --zookeeper $KAFKAZKHOSTS
    ```

    The `iotin` topic is used to receive messages from IoT Hub. The `iotout` topic is used to send messages to IoT Hub.

## Get IoT Hub connection information

To retrieve IoT hub information used by the connector, use the following steps:

1. Get the Event Hub-compatible endpoint and Event Hub-compatible endpoint name for your IoT hub. To get this information, use one of the following methods:

   * __From the [Azure portal](https://portal.azure.com/)__, use the following steps:

     1. Navigate to your IoT Hub and select __Endpoints__.
     2. From __Built-in endpoints__, select __Events__.
     3. From __Properties__, copy the value of the following fields:

         * __Event Hub-compatible name__
         * __Event Hub-compatible endpoint__
         * __Partitions__

        > [!IMPORTANT]  
        > The endpoint value from the portal may contain extra text that is not needed in this example. Extract the text that matches this pattern `sb://<randomnamespace>.servicebus.windows.net/`.

   * __From the [Azure CLI](/cli/azure/get-started-with-azure-cli)__, use the following command:

       ```azurecli
       az iot hub show --name myhubname --query "{EventHubCompatibleName:properties.eventHubEndpoints.events.path,EventHubCompatibleEndpoint:properties.eventHubEndpoints.events.endpoint,Partitions:properties.eventHubEndpoints.events.partitionCount}"
       ```

       Replace `myhubname` with the name of your IoT hub. The response is similar to the following text:

       ```json
       "EventHubCompatibleEndpoint": "sb://ihsuprodbnres006dednamespace.servicebus.windows.net/",
       "EventHubCompatibleName": "iothub-ehub-myhub08-207673-d44b2a856e",
       "Partitions": 2
       ```

2. Get the __shared access policy__ and __key__. For this example, use the __service__ key. To get this information, use one of the following methods:

    * __From the [Azure portal](https://portal.azure.com/)__, use the following steps:

        1. Select __Shared access policies__, and then select __service__.
        2. Copy the __Primary key__ value.
        3. Copy the __Connection string--primary key__ value.

    * __From the [Azure CLI](/cli/azure/get-started-with-azure-cli)__, use the following command:

        1. To get the primary key value, use the following command:

            ```azurecli
            az iot hub policy show --hub-name myhubname --name service --query "primaryKey"
            ```

            Replace `myhubname` with the name of your IoT hub. The response is the primary key to the `service` policy for this hub.

        2. To get the connection string for the `service` policy, use the following command:

            ```azurecli
            az iot hub show-connection-string --name myhubname --policy-name service --query "connectionString"
            ```

            Replace `myhubname` with the name of your IoT hub. The response is the connection string for the `service` policy.

## Configure the source connection

To configure the source to work with your IoT Hub, perform the following actions from an SSH connection to the edge node:

1. Create a copy of the `connect-iot-source.properties` file in the `/usr/hdp/current/kafka-broker/config/` directory. To download the file from the toketi-kafka-connect-iothub project, use the following command:

    ```bash
    sudo wget -P /usr/hdp/current/kafka-broker/config/ https://raw.githubusercontent.com/Azure/toketi-kafka-connect-iothub/master/connect-iothub-source.properties
    ```

1. To edit the `connect-iot-source.properties` file and add the IoT hub information, use the following command:

    ```bash
    sudo nano /usr/hdp/current/kafka-broker/config/connect-iothub-source.properties
    ```

1. In the editor, find and change the following entries:

    |Current value |Edit|
    |---|---|
    |`Kafka.Topic=PLACEHOLDER`|Replace `PLACEHOLDER` with `iotin`. Messages received from IoT hub are placed in the `iotin` topic.|
    |`IotHub.EventHubCompatibleName=PLACEHOLDER`|Replace `PLACEHOLDER` with the Event Hub-compatible name.|
    |`IotHub.EventHubCompatibleEndpoint=PLACEHOLDER`|Replace `PLACEHOLDER` with the Event Hub-compatible endpoint.|
    |`IotHub.AccessKeyName=PLACEHOLDER`|Replace `PLACEHOLDER` with `service`.|
    |`IotHub.AccessKeyValue=PLACEHOLDER`|Replace `PLACEHOLDER` with the primary key of the `service` policy.|
    |`IotHub.Partitions=PLACEHOLDER`|Replace `PLACEHOLDER` with the number of partitions from the previous steps.|
    |`IotHub.StartTime=PLACEHOLDER`|Replace `PLACEHOLDER` with a UTC date. This date is when the connector starts checking for messages. The date format is `yyyy-mm-ddThh:mm:ssZ`.|
    |`BatchSize=100`|Replace `100` with `5`. This change causes the connector to read messages into Kafka once there are five new messages in IoT hub.|

    For an example configuration, see [Kafka Connect Source Connector for Azure IoT Hub](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Source.md).

1. To save changes, use __Ctrl + X__, __Y__, and then __Enter__.

For more information on configuring the connector source, see [https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Source.md](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Source.md).

## Configure the sink connection

To configure the sink connection to work with your IoT Hub, perform the following actions from an SSH connection to the edge node:

1. Create a copy of the `connect-iothub-sink.properties` file in the `/usr/hdp/current/kafka-broker/config/` directory. To download the file from the toketi-kafka-connect-iothub project, use the following command:

    ```bash
    sudo wget -P /usr/hdp/current/kafka-broker/config/ https://raw.githubusercontent.com/Azure/toketi-kafka-connect-iothub/master/connect-iothub-sink.properties
    ```

1. To edit the `connect-iothub-sink.properties` file and add the IoT hub information, use the following command:

    ```bash
    sudo nano /usr/hdp/current/kafka-broker/config/connect-iothub-sink.properties
    ```

1. In the editor, find and change the following entries:

    |Current value |Edit|
    |---|---|
    |`topics=PLACEHOLDER`|Replace `PLACEHOLDER` with `iotout`. Messages written to `iotout` topic are forwarded to the IoT hub.|
    |`IotHub.ConnectionString=PLACEHOLDER`|Replace `PLACEHOLDER` with the connection string for the `service` policy.|

    For an example configuration, see [Kafka Connect Sink Connector for Azure IoT Hub](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md).

1. To save changes, use __Ctrl + X__, __Y__, and then __Enter__.

For more information on configuring the connector sink, see [https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md).

## Start the source connector

1. To start the source connector, use the following command from an SSH connection to the edge node:

    ```bash
    /usr/hdp/current/kafka-broker/bin/connect-standalone.sh /usr/hdp/current/kafka-broker/config/connect-standalone.properties /usr/hdp/current/kafka-broker/config/connect-iothub-source.properties
    ```

    Once the connector starts, send messages to IoT hub from your device(s). As the connector reads messages from the IoT hub and stores them in the Kafka topic, it logs information to the console:

    ```output
    [2017-08-29 20:15:46,112] INFO Polling for data - Obtained 5 SourceRecords from IotHub (com.microsoft.azure.iot.kafka.connect.IotHubSourceTask:39)
    [2017-08-29 20:15:54,106] INFO Finished WorkerSourceTask{id=AzureIotHubConnector-0} commitOffsets successfully in 4 ms (org.apache.kafka.connect.runtime.WorkerSourceTask:356)
    ```

    > [!NOTE]  
    > You may see several warnings as the connector starts. These warnings do not cause problems with receiving messages from IoT hub.

1. Stop the connector after a few minutes using **Ctrl + C** twice. It will take a few minutes for the connector to stop.

## Start the sink connector

From an SSH connection to the edge node, use the following command to start the sink connector in standalone mode:

```bash
/usr/hdp/current/kafka-broker/bin/connect-standalone.sh /usr/hdp/current/kafka-broker/config/connect-standalone.properties /usr/hdp/current/kafka-broker/config/connect-iothub-sink.properties
```

As the connector runs, information similar to the following text is displayed:

```output
[2017-08-30 17:49:16,150] INFO Started tasks to send 1 messages to devices. (com.microsoft.azure.iot.kafka.connect.sink.
IotHubSinkTask:47)
[2017-08-30 17:49:16,150] INFO WorkerSinkTask{id=AzureIotHubSinkConnector-0} Committing offsets (org.apache.kafka.connect.runtime.WorkerSinkTask:262)
```

> [!NOTE]  
> You may notice several warnings as the connector starts. You can safely ignore these.

## Send messages

To send messages through the connector, use the following steps:

1. Open *a second* SSH session to the Kafka cluster:

    ```bash
    ssh sshuser@new-edgenode.CLUSTERNAME-ssh.azurehdinsight.net
    ```

1. Get the address of the Kafka brokers for the new ssh session. Replace PASSWORD with the cluster login password, then enter the command:

    ```bash
    export password='PASSWORD'

    export clusterName=$(curl -u admin:$password -sS -G "http://headnodehost:8080/api/v1/clusters" | jq -r '.items[].Clusters.cluster_name')

    export KAFKABROKERS=`curl -sS -u admin:$password -G http://headnodehost:8080/api/v1/clusters/$clusterName/services/KAFKA/components/KAFKA_BROKER | jq -r '["\(.host_components[].HostRoles.host_name):9092"] | join(",")' | cut -d',' -f1,2`
    ```

1. To send messages to the `iotout` topic, use the following command:

    ```bash
    /usr/hdp/current/kafka-broker/bin/kafka-console-producer.sh --broker-list $KAFKABROKERS --topic iotout
    ```

    This command doesn't return you to the normal Bash prompt. Instead, it sends keyboard input to the `iotout` topic.

1. To send a message to your device, paste a JSON document into the SSH session for the `kafka-console-producer`.

    > [!IMPORTANT]  
    > You must set the value of the `"deviceId"` entry to the ID of your device. In the following example, the device is named `myDeviceId`:

    ```json
    {"messageId":"msg1","message":"Turn On","deviceId":"myDeviceId"}
    ```

    The schema for this JSON document is described in more detail at [https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md).

    If you're using the simulated Raspberry Pi device, and it's running, the following message is logged by the device:

    ```output
    Receive message: Turn On
    ```

    Resend the JSON document, but change the value of the `"message"` entry. The new value is logged by the device.

For more information on using the sink connector, see [https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md](https://github.com/Azure/toketi-kafka-connect-iothub/blob/master/README_Sink.md).

## Next steps

In this document, you learned how to use the Apache Kafka Connect API to start the IoT Kafka Connector on HDInsight. Use the following links to discover other ways to work with Kafka:

* [Use Apache Spark with Apache Kafka on HDInsight](../hdinsight-apache-spark-with-kafka.md)
