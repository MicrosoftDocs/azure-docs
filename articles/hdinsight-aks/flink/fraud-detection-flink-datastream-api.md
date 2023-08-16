---
title: Fraud Detection with the Flink DataStream API
description: Learn about Fraud Detection with the Flink DataStream API
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/16/2023
---

# Fraud Detection with the Flink DataStream API

In this article, learn how to run Fraud Detection usecase with the Flink DataStream API.

## Prerequisites

* [HDInsight on AKS Flink 1.16.0](../flink/flink-create-cluster-portal.md)
* IntelliJ Idea community edition installed locally

## Developing code in IDE

1. For the sample job, refer [Fraud Detection with the DataStream API](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/try-flink/datastream/)
1. Build the skeleton of the code using Flink Maven Archetype by using InterlliJ Idea IDE.
1. Once the IDE is opened, go to **File** -> **New** -> **Project** -> **Maven Archetype**.
1. Enter the details as shown in the image.

   :::image type="content" source="./media/fraud-detection-flink-datastream-api/maven-archetype.png" alt-text="Screenshot showing Maven Archetype." border="true" lightbox="./media/fraud-detection-flink-datastream-api/maven-archetype.png":::

1. After you create the Maven Archetype, it generates 2 java classes FraudDetectionJob and FraudDetector.
1. Update the `FraudDetector` with the following code.

    ```
    package spendreport;
    
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
    
    		// Check if the flag is set
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
    
    		if (transaction.getAmount() < SMALL_AMOUNT) {
    			// set the flag to true
    			flagState.update(true);
    
    			long timer = context.timerService().currentProcessingTime() + ONE_MINUTE;
    			context.timerService().registerProcessingTimeTimer(timer);
    
    			timerState.update(timer);
    		}
    	}
    
    	@Override
    	public void onTimer(long timestamp, OnTimerContext ctx, Collector<Alert> out) {
    		// remove flag after 1 minute
    		timerState.clear();
    		flagState.clear();
    	}
    
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

    This job uses a source that generates an infinite stream of credit card transactions for you to process. Each transaction contains an account ID (accountId), timestamp (timestamp) of when the transaction occurred, and US$ amount (amount). The logic is that if transaction of the small amount (< 1.00) immediately followed by a large amount (> 500) it sets off alarm and updates the output logs. It uses data from TransactionIterator following class, which is hardcoded so that account ID 3 is detected as fraudulent transaction.

For more information, refer [Sample TransactionIterator.java](https://github.com/apache/flink/blob/master/flink-walkthroughs/flink-walkthrough-common/src/main/java/org/apache/flink/walkthrough/common/source/TransactionIterator.java)

## Creating JAR file

After making the code changes, create the jar using the following steps in IntelliJ Idea IDE

1. Go to **File** -> **Project Structure** -> **Project Settings** -> **Artifacts**
1. Click **+** (plus sign) -> **Jar** -> From modules with dependencies.
1. Select a **Main Class** (the one with main() method) if you need to make the jar runnable.
1. Select **Extract to the target Jar**.
1. Click **OK**.
1. Click **Apply** and then **OK**.
1. The following step sets the "skeleton" to where the jar will be saved to. 

   :::image type="content" source="./media/fraud-detection-flink-datastream-api/extract-target-jar.png" alt-text="Screenshot showing how to extract target Jar." border="true" lightbox="./media/fraud-detection-flink-datastream-api/extract-target-jar.png":::

1. To  build and save

   1. Go to  **Build -> Build Artifact -> Build**

      :::image type="content" source="./media/fraud-detection-flink-datastream-api/build-artifact.png" alt-text="Screenshot showing how to build Artifact.":::
   
      :::image type="content" source="./media/fraud-detection-flink-datastream-api/extract-target-jar-1.png" alt-text="Screenshot showing how to build Artifacts.":::

## Running the job in Flink environment

1. Once the jar is generated, it can be used to submit the job from Flink UI using submit job section.

   :::image type="content" source="./media/fraud-detection-flink-datastream-api/submit-job-from-flink-ui.png" alt-text="Screenshot showing how to submit job from Flink UI." border="true" lightbox="./media/fraud-detection-flink-datastream-api/submit-job-from-flink-ui.png":::
   
1. After the job is submitted, it's moved to running state, and the Task manager logs will be generated.

   :::image type="content" source="./media/fraud-detection-flink-datastream-api/task-manager.png" alt-text="Screenshot showing task manager." border="true" lightbox="./media/fraud-detection-flink-datastream-api/task-manager.png":::

   :::image type="content" source="./media/fraud-detection-flink-datastream-api/task-manager-logs.png" alt-text="Screenshot showing task manager logs." border="true" lightbox="./media/fraud-detection-flink-datastream-api/task-manager-logs.png":::

 1. From the logs, view the alert is generated for Account ID 3.

## Reference
* [Fraud Detector v2: State + Time](https://nightlies.apache.org/flink/flink-docs-release-1.17/docs/try-flink/datastream/#fraud-detector-v2-state--time--1008465039)
* [Sample TransactionIterator.java](https://github.com/apache/flink/blob/master/flink-walkthroughs/flink-walkthrough-common/src/main/java/org/apache/flink/walkthrough/common/source/TransactionIterator.java)
