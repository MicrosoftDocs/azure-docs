
# DStreamAPI AzureServiceBusDemo
This i sample text.

## This Flink job demo reads messages from an Azure Service Bus topic and writes them to ADLS gen2.

Here’s a breakdown of what each part does!

**Main code: ServiceBusToAdlsgen2.java**

1. **Setting up the execution environment**: The StreamExecutionEnvironment.getExecutionEnvironment() method is used to set up the execution environment for the Flink job.

2. **Creating a source function for Azure Service Bus**: A SessionBasedServiceBusSource object is created with the connection string, topic name, and subscription name for your Azure Service Bus. This object is a source function that can be used to create a data stream.

3. **Creating a data stream**: The env.addSource(sourceFunction) method is used to create a data stream from the source function. Each message from the Azure Service Bus topic will become an element in this stream.

4. **Processing the data**: The stream.map(value -> processValue(value)) method is used to process each element in the stream. In this case, the processValue method is applied to each element. This is where you’d put your processing logic.

5. **Creating a sink for Azure Data Lake Storage Gen2**: A FileSink object is created with the output path and a SimpleStringEncoder. The withRollingPolicy method is used to set a rolling policy for the sink.

6. **Adding the sink function to the processed stream**: The processedStream.sinkTo(sink) method is used to add the sink function to the processed stream. Each processed element will be written to a file in Azure Data Lake Storage Gen2.

7. **Executing the job**: Finally, the env.execute("ServiceBusToDataLakeJob") method is used to execute the Flink job. This will start reading messages from the Azure Service Bus topic, process them, and write them to Azure Data Lake Storage Gen2.

**Flink source function: SessionBasedServiceBusSource.java**

1. **Class Definition**: The SessionBasedServiceBusSource class extends RichParallelSourceFunction<String>, which is a base class for implementing a parallel data source in Flink.

2. **Instance Variables**: The connectionString, topicName, and subscriptionName variables hold the connection string, topic name, and subscription name for your Azure Service Bus. The isRunning flag is used to control the execution of the source function. The sessionReceiver is an instance of ServiceBusSessionReceiverAsyncClient, which is used to receive messages from the Service Bus.

3. **Constructor**: The constructor initializes the instance variables with the provided values.

4. **run() Method**: This method is where the source function starts to emit data to Flink. It creates a ServiceBusSessionReceiverAsyncClient, accepts the next available session, and starts receiving messages from that session. Each message’s body is then collected into the Flink source context.

5. **cancel() Method**: This method is called when the source function needs to be stopped. It sets the isRunning flag to false and closes the sessionReceiver.

## Requirements

**Azure HDInsight Flink 1.16 on AKS**

![image](https://github.com/Baiys1234/hdinsight-aks/assets/35547706/18d1000c-9c18-4017-8a9b-9d3e4920cfb7)


**Azure Service Bus** <br>
Azure Service Bus is a fully managed enterprise message broker with message queues and publish-subscribe topics (in a namespace). Service Bus is used to decouple applications and services from each other, providing the following benefits:

. Load-balancing work across competing workers
. Safely routing and transferring data and control across service and application boundaries
. Coordinating transactional work that requires a high-degree of reliability

#Ref
https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-messaging-overview

Please refer below doc to create Topic and Subscription preparation 
https://learn.microsoft.com/en-us/azure/service-bus-messaging/explorer

![image](https://github.com/Baiys1234/hdinsight-aks/assets/35547706/a61a13a9-d53b-423c-8e43-477e13e32fc2)

Getting the connection string, topic name, and subscription name for your Azure Service Bus

![image](https://github.com/Azure-Samples/hdinsight-aks/assets/35547706/0fdd9386-aa66-4212-9105-37dc63af708a)


## Running

**Submit the jar into Azure HDInsight Flink 1.16 on AKS to run.**
In my case, I use webssh to submit
```
bin/flink run -c contoso.example.ServiceBusToAdlsGen2 -j AzureServiceBusDemo-1.0-SNAPSHOT.jar
Job has been submitted with JobID fc5793361a914821c968b5746a804570
```

**Confirm job on Flink UI:**

![image](https://github.com/Baiys1234/hdinsight-aks/assets/35547706/eeb5fb08-c15c-4917-9899-7fbb9ce8277c)

**Sending message from Azure portal Serice Bus Explorer**

![image](https://github.com/Baiys1234/hdinsight-aks/assets/35547706/d4ba1c3c-0b48-458c-b082-0a1a8c1d3624)

**Checking job running details on Flink UI:**
![image](https://github.com/Baiys1234/hdinsight-aks/assets/35547706/50f5ad9a-d841-4636-bce7-bc0be68e5959)

**Confirm output file in ADLS gen2 on Portal**

![image](https://github.com/Baiys1234/hdinsight-aks/assets/35547706/efa9c03d-3449-4f9e-96b7-c1e010f67813)

## Clean up

Donot forget to clean up the resources we created above.








