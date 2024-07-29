---
title: Fraud detection with the Apache Flink® DataStream API
description: Learn about Fraud detection with the Apache Flink® DataStream API.
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 04/09/2024
---

# Fraud detection with the Apache Flink® DataStream API

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

In this article, learn how to build a fraud detection system for alerting on suspicious credit card transactions. Using a simple set of rules, you see how Flink allows us to implement advanced business logic and act in real-time.

This sample is from the use case on Apache Flink [Fraud Detection with the DataStream API](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/try-flink/datastream/).

[Sample code] on GitHub (https://github.com/apache/flink/tree/master/flink-walkthroughs/flink-walkthrough-common).

## Prerequisites

* [Flink cluster 1.16.0 on HDInsight on AKS](../flink/flink-create-cluster-portal.md)
* IntelliJ Idea community edition installed locally

## HDInsight Flink 1.17.0 on AKS

:::image type="content" source="./media/fraud-detection-flink-datastream-api/flink-cluster.png" alt-text="Screenshot showing flink-cluster." border="true" lightbox="./media/fraud-detection-flink-datastream-api/flink-cluster.png":::

## Maven project pom.xml on IntelliJ Idea

A Flink Maven Archetype creates a skeleton project with all the necessary dependencies quickly, so you only need to focus on filling out the business logic. These dependencies include flink-streaming-java, which is the core dependency for all Flink streaming applications and flink-walkthrough-common that has data generators and other classes specific to this walkthrough.

```
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-walkthrough-common</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-walkthrough-datastream-java</artifactId>
            <version>${flink.version}</version>
        </dependency>
```

Full Dependencies

```
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>contoso.example</groupId>
    <artifactId>FraudDetectionDemo</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <flink.version>1.17.0</flink.version>
        <java.version>1.8</java.version>
        <scala.binary.version>2.12</scala.binary.version>
        <kafka.version>3.2.0</kafka.version>
    </properties>
    <dependencies>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-java</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-streaming-java -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-streaming-java</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-clients -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-clients</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-connector-kafka</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-walkthrough-common -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-walkthrough-common</artifactId>
            <version>${flink.version}</version>
        </dependency>
        <!-- https://mvnrepository.com/artifact/org.apache.flink/flink-walkthrough-datastream-java -->
        <dependency>
            <groupId>org.apache.flink</groupId>
            <artifactId>flink-walkthrough-datastream-java</artifactId>
            <version>${flink.version}</version>
        </dependency>
    </dependencies>
    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-assembly-plugin</artifactId>
                <version>3.0.0</version>
                <configuration>
                    <appendAssemblyId>false</appendAssemblyId>
                    <descriptorRefs>
                        <descriptorRef>jar-with-dependencies</descriptorRef>
                    </descriptorRefs>
                </configuration>
                <executions>
                    <execution>
                        <id>make-assembly</id>
                        <phase>package</phase>
                        <goals>
                            <goal>single</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
```

## Main Source Code

This job uses a source that generates an infinite stream of credit card transactions for you to process. Each transaction contains an account ID (accountId), timestamp (timestamp) of when the transaction occurred, and US$ amount (amount). The logic is that if transaction of the small amount (< 1.00) followed by a large amount (> 500) it sets off alarm and updates the output logs.

Scammers don’t wait long to make their large purchases to reduce the chances their test transaction is noticed. For example, suppose you wanted to set a 1-minute timeout to your fraud detector. In the previous example, transactions three and four would only be considered fraud if they occurred within 1 minute of each other. Flink’s KeyedProcessFunction allows you to set timers that invoke a callback method at some point in time in the future.

Let’s see how we can modify our Job to comply with our new requirements:

Whenever the flag set to true, also set a timer for 1 minute in the future. When the timer fires, reset the flag by clearing its state. If the flag is ever cleared, the timer should be canceled. To cancel a timer, you have to remember what time it set for, and remembering implies state, so you begin by creating a timer state along with your flag state.

KeyedProcessFunction#processElement is called with a Context that contains a timer service. The timer service can be used to query the current time, register timers, and delete timers. You can set a timer for 1 minute in the future every time the flag set and store the timestamp in timerState.

Sample `FraudDetector.java`

```java
package contoso.example;

import org.apache.flink.api.common.state.ValueState;
import org.apache.flink.api.common.state.ValueStateDescriptor;
import org.apache.flink.api.common.typeinfo.Types;
import org.apache.flink.configuration.Configuration;
import org.apache.flink.streaming.api.functions.KeyedProcessFunction;
import org.apache.flink.util.Collector;
import org.apache.flink.walkthrough.common.entity.Alert;
import org.apache.flink.walkthrough.common.entity.Transaction;

public class FraudDetector extends KeyedProcessFunction<Long, Transaction, Alert> {

    private static final long serialVersionUID = 1L;

    private static final double SMALL_AMOUNT = 1.00;
    private static final double LARGE_AMOUNT = 500.00;
    private static final long ONE_MINUTE = 60 * 1000;

    private transient ValueState<Boolean> flagState;
    private transient ValueState<Long> timerState;

    @Override
    public void open(Configuration parameters) {
        ValueStateDescriptor<Boolean> flagDescriptor = new ValueStateDescriptor<>(
                "flag",
                Types.BOOLEAN);
        flagState = getRuntimeContext().getState(flagDescriptor);

        ValueStateDescriptor<Long> timerDescriptor = new ValueStateDescriptor<>(
                "timer-state",
                Types.LONG);
        timerState = getRuntimeContext().getState(timerDescriptor);
    }

    @Override
    public void processElement(
            Transaction transaction,
            Context context,
            Collector<Alert> collector) throws Exception {

        // Get the current state for the current key
        Boolean lastTransactionWasSmall = flagState.value();

        // Check if the flag set
        if (lastTransactionWasSmall != null) {
            if (transaction.getAmount() > LARGE_AMOUNT) {
                //Output an alert downstream
                Alert alert = new Alert();
                alert.setId(transaction.getAccountId());

                collector.collect(alert);
            }
            // Clean up our state
            cleanUp(context);
        }

        // KeyedProcessFunction#processElement is called with a Context that contains a timer 
        // service. The timer service can be used to query the current time, register timers, and 
        // delete timers. You can set a timer for 1 minute in the future every time the flag 
        // set and store the timestamp in timerState.

        if (transaction.getAmount() < SMALL_AMOUNT) {
            // set the flag to true
            flagState.update(true);

            long timer = context.timerService().currentProcessingTime() + ONE_MINUTE;
            context.timerService().registerProcessingTimeTimer(timer);

            timerState.update(timer);
        }
    }

   // Processing time is wall clock time, and is determined by the system clock of the machine 
   // running the operator.

   // When a timer fires, it calls KeyedProcessFunction#onTimer. Overriding this method is how 
   // you can implement your callback to reset the flag.

    @Override
    public void onTimer(long timestamp, OnTimerContext ctx, Collector<Alert> out) {
        // remove flag after 1 minute
        timerState.clear();
        flagState.clear();
    }

   // Finally, to cancel the timer, you need to delete the registered timer and delete the 
   // timer state. You can wrap this in a helper method and call this method instead of 
   // flagState.clear()

    private void cleanUp(Context ctx) throws Exception {
        // delete timer
        Long timer = timerState.value();
        ctx.timerService().deleteProcessingTimeTimer(timer);

        // clean up all state
        timerState.clear();
        flagState.clear();
    }
}
```
## Package the jar and submit to HDInsight Flink on AKS webssh pod

:::image type="content" source="./media/fraud-detection-flink-datastream-api/package-jar.png" alt-text="Screenshot showing how to package the jar." border="true" lightbox="./media/fraud-detection-flink-datastream-api/package-jar.png":::


## Submit the job to HDInsight Flink Cluster on AKS

:::image type="content" source="./media/fraud-detection-flink-datastream-api/submit-job.png" alt-text="Screenshot showing how to submit Flink job." border="true" lightbox="./media/fraud-detection-flink-datastream-api/submit-job.png":::

## Expected Output

Running this code with the provided TransactionSource emits fraud alerts for account 3. You should see the following output in your task manager logs.

:::image type="content" source="./media/fraud-detection-flink-datastream-api/task-manager-log.png" alt-text="Screenshot showing task manager logs." border="true" lightbox="./media/fraud-detection-flink-datastream-api/task-manager-log.png":::

## Reference
* [Fraud Detector v2: State + Time](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/try-flink/datastream/#fraud-detector-v2-state--time--1008465039)
