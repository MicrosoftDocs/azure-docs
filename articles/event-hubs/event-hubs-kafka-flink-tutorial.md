# Using Apache Flink with Event Hubs for Kafka Ecosystem

One of the key benefits of using Apache Kafka is the ecosystem of frameworks it can connect to. Kafka enabled Event Hubs allow users to combine the flexibility of the Kafka ecosystem with the scalability, consistency, and support of the Azure ecosystem without having to manage on prem clusters or resources - it's the best of both worlds!

This tutorial shows you how to connect Apache Flink to Kafka enabled Event Hubs without changing your protocol clients or running your own clusters. Azure Event Hubs for Kafka Ecosystem supports [Apache Kafka version 1.0.](https://kafka.apache.org/10/documentation.html)

## Prerequisites

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/en-us/free/?ref=microsoft.com&utm_source=microsoft.com&utm_medium=docs&utm_campaign=visualstudio) before you begin.

In addition:

* [Java Development Kit (JDK) 1.7+](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
    * On Ubuntu, run `apt-get install default-jdk` to install the JDK.
    * Be sure to set the JAVA_HOME environment variable to point to the folder where the JDK is installed.
* [Download](http://maven.apache.org/download.cgi) and [install](http://maven.apache.org/install.html) a Maven binary archive
    * On Ubuntu, you can run `apt-get install maven` to install Maven.
* [Git](https://www.git-scm.com/downloads)
    * On Ubuntu, you can run `sudo apt-get install git` to install Git.

## Create an Event Hubs namespace

An Event Hubs namespace is required to send or receive from any Event Hubs service. See [Create Kafka Enabled Event Hubs](https://docs.microsoft.com/en-us/azure/event-hubs/event-hubs-create-kafka-enabled) for instructions on getting an Event Hubs Kafka endpoint. Make sure to copy the Event Hubs connection string for later use.

## Clone the example project

Now that you have a Kafka enabled Event Hubs connection string, clone the Azure Event Hubs repository and navigate to the `flink` subfolder:

```bash
git clone https://github.com/Azure/azure-event-hubs.git
cd azure-event-hubs/samples/kafka/flink
```


## Flink Producer

Using the provided Flink producer example, send messages to the Event Hubs service.

### Provide an Event Hubs Kafka endpoint

#### producer.config

Update the `bootstrap.servers` and `sasl.jaas.config` values in `producer/src/main/resources/producer.config` to direct the producer to the Event Hubs Kafka endpoint with the correct authentication.

```
bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093
client.id=FlinkExampleProducer
sasl.mechanism=PLAIN
security.protocol=SASL_SSL
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
   username="$ConnectionString" \
   password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
```

### Run producer from the command line

To run the producer from the command line, generate the JAR and then run from within Maven (alternatively, generate the JAR using Maven, then run in Java by adding the necessary Kafka JAR(s) to the classpath):

```bash
mvn clean package
mvn exec:java -Dexec.mainClass="FlinkTestProducer"
```

The producer will now begin sending events to the Kafka enabled Event Hub at topic `test` and printing the events to stdout. If you would like to change the topic, change the TOPIC constant in `producer/src/main/java/com/example/app/FlinkTestProducer.java`.

## Flink Consumer

Using the provided consumer example, receive messages from the Kafka enabled Event Hubs.

### Provide an Event Hubs Kafka endpoint

#### consumer.config

Update the `bootstrap.servers` and `sasl.jaas.config` values in `consumer/src/main/resources/consumer.config` to direct the consumer to the Event Hubs Kafka endpoint with the correct authentication.

```config
bootstrap.servers={YOUR.EVENTHUBS.FQDN}:9093
group.id=FlinkExampleConsumer
sasl.mechanism=PLAIN
security.protocol=SASL_SSL
sasl.jaas.config=org.apache.kafka.common.security.plain.PlainLoginModule required \
   username="$ConnectionString" \
   password="{YOUR.EVENTHUBS.CONNECTION.STRING}";
```

### Run consumer from the command line

To run the consumer from the command line, generate the JAR and then run from within Maven (alternatively, generate the JAR using Maven, then run in Java by adding the necessary Kafka JAR(s) to the classpath):

```bash
mvn clean package
mvn exec:java -Dexec.mainClass="FlinkTestConsumer"
```

If the Kafka enabled Event Hub has events (for instance, if your producer is also running), then the consumer should now begin receiving events from topic `test`. If you would like to change the topic, change the TOPIC constant in `consumer/src/main/java/com/example/app/FlinkTestConsumer.java`.

Check out [Flink's Kafka Connector Guide](https://ci.apache.org/projects/flink/flink-docs-stable/dev/connectors/kafka.html) for more detailed information on connecting Flink to Kafka.
