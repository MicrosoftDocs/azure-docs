---
title: Apache Spark on GPU
description: Introduction to core concepts for Apache Spark on GPUs inside Synapse Analytics.
services: synapse-analytics 
author: nidutta 
ms.service:  synapse-analytics 
ms.topic: overview
ms.subservice: spark
ms.date: 10/18/2021
ms.author: nidutta
---

# Apache Spark on GPUs in Azure Synapse Analytics

Apache Spark is a parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Apache Spark in Azure Synapse Analytics is one of Microsoft's implementations of Apache Spark in the cloud. 

Azure Synapse now offers the ability to create Apache Spark pools using GPUs to run Spark workloads using underlying [RAPIDS libraries](https://nvidia.github.io/spark-rapids/) that leverage the massive parallel processing power of GPUs to accelerate processing. The RAPIDS Accelerator for Apache Spark allows you to run your existing Spark applications with no code change by just enabling a configuration setting, which comes pre-configured for a GPU pool.
You can choose to turn on/off the RAPIDS based GPU acceleration for your workload or parts of your workload by setting this configuration:

```
spark.conf.set('spark.rapids.sql.enabled','true/false')
```

> [NOTE]
> Apache Spark on GPUs in Synapse Analytics is currently in Public Preview. These are all the regions this feature is currently available in: East US, East US2, West US2, West Europe.

## RAPIDS Accelerator for Apache Spark

The Spark RAPIDS accelerator is a plugin that works by overriding the physical plan of a Spark job by supported GPU operations, and running those operations on the GPUs, thereby accelerating processing. This library is currently in preview and doesn't support all Spark operations (here is a list of [currently supported operators](https://nvidia.github.io/spark-rapids/docs/supported_ops.html), and more support is being added incrementally through new releases.

## Cluster configuration options

The RAPIDS Accelerator plugin only supports a one-to-one mapping between GPUs and executors. This means a Spark job would need to request executor and driver resources that can be accommodated by the pool resources (according to the number of available GPU and CPU cores). In order to meet this condition and ensure optimal utilization of all the pool resources, we require the following configuration of drivers and executors for a Spark application running on GPU pools:

|Pool size | Driver size options | Driver cores | Driver Memory (GB) | Executor cores | Executor Memory (GB) | Number of Executors |
| :------ | :-------------- | :---------- | :------------- | :------------- | :------------------- | :------------------ |
| GPU-Large | Small driver | 4 | 30 | 12 | 60 | Number of nodes in pool |
| GPU-Large | Medium driver | 7 | 30 | 9 | 60 | Number of nodes in pool |
| GPU-XLarge | Medium driver | 8 | 40 | 14 | 80 | 4 * Number of nodes in pool |
| GPU-XLarge | Large driver | 12 | 40 | 13 | 80 | 4 * Number of nodes in pool |


Any workload that does not meet one of the above configurations will not be accepted. This is done to make sure Spark jobs are being run with the most efficient and performant configuration utilizing all available resources on the pool.

The user can set the above configuration through their workload. For notebooks, the user can use the `%%configure` magic command to set one of the above configurations as shown below.
For example, using a Large pool with 3 nodes:

```
%%configure -f
{
    "driverMemory": "30g",
    "driverCores": 4,
    "executorMemory": "60g",
    "executorCores": 12,
    "numExecutors": 3
}
```

## Run a Spark example job through a notebook on a GPU pool

It would be good to be familiar with the [basic concepts of how to use a notebook](apache-spark-development-using-notebooks.md) in Synapse Analytics before proceeding with this section. Let's walk through the steps to run a simple Spark application utilizing GPU acceleration. You can write a Spark application in all the four languages supported inside Synapse, PySpark (Python), Spark (Scala), SparkSQL and .NET for Spark (C#).

1. Create a GPU pool as described in [this quickstart](../quickstart-create-apache-gpu-pool-portal.md).
2. Create a notebook and attach it to the GPU pool you created in the first step.
3. Set the configurations as explained in the previous section.
4. Create a sample dataframe by copying the below code in the first cell of your notebook:

```scala Scala
import org.apache.spark.sql.types.{IntegerType, StringType, StructField, StructType}
import org.apache.spark.sql.Row
import scala.collection.JavaConversions._

val schema = StructType( Array(
  StructField("emp_id", IntegerType),
  StructField("name", StringType),
  StructField("emp_dept_id", IntegerType),
  StructField("salary", IntegerType)
))

val emp = Seq(Row(1, "Smith", 10, 100000),
    Row(2, "Rose", 20, 97600),
    Row(3, "Williams", 20, 110000),
    Row(4, "Jones", 10, 80000),
    Row(5, "Brown", 40, 60000),
    Row(6, "Brown", 30, 78000)
  )

val empDF = spark.createDataFrame(emp, schema)
```
```python Python
emp = [(1, "Smith", 10, 100000),
	(2, "Rose", 20, 97600),
	(3, "Williams", 20, 110000),
	(4, "Jones", 10, 80000),
	(5, "Brown", 40, 60000),
	(6, "Brown", 30, 78000)]

empColumns = ["emp_id", "name", "emp_dept_id", "salary"]

empDF = spark.createDataFrame(data=emp, schema=empColumns)
```
```csharp C#
using Microsoft.Spark.Sql.Types;

var emp = new List<GenericRow>
{
    new GenericRow(new object[] { 1, "Smith", 10, 100000 }),
    new GenericRow(new object[] { 2, "Rose", 20, 97600 }),
    new GenericRow(new object[] { 3, "Williams", 20, 110000 }),
    new GenericRow(new object[] { 4, "Jones", 10, 80000 }),
    new GenericRow(new object[] { 5, "Brown", 40, 60000 }),
    new GenericRow(new object[] { 6, "Brown", 30, 78000 })
};

var schema = new StructType(new List<StructField>()
{
    new StructField("emp_id", new IntegerType()),
    new StructField("name", new StringType()),
    new StructField("emp_dept_id", new IntegerType()),
    new StructField("salary", new IntegerType())
});

DataFrame empDF = spark.CreateDataFrame(emp, schema);
```

5. Now let's do a simple aggregate by getting the maximum salary per department id and display the result:

```scala Scala
val resultDF = empDF.groupBy("emp_dept_id").max("salary")
resultDF.show()
```
```python Python
resultDF = empDF.groupBy("emp_dept_id").max("salary")
resultDF.show()
```
```csharp C#
DataFrame resultDF = empDF.GroupBy("emp_dept_id").Max("salary");
resultDF.Show();
```

6. You can see the operations in your query that ran on GPUs by looking into the SQL plan through the Spark History Server:
![Screenshot showing SQL plan of query through History Server](../quickstart/spark-gpu-sql-plan.png)

## How to tune your application for GPUs

Most Spark jobs can see improved performance through tuning configuration settings from defaults, and the same holds true for jobs leveraging the RAPIDS accelerator plugin for Apache Spark. [This documentation](https://nvidia.github.io/spark-rapids/docs/tuning-guide.html) provides guidelines on how to tune a Spark job to run on GPUs using the RAPIDS plugin.

## Quotas and resource constraints in Apache Spark on GPUs for Azure Synapse

### Workspace level

Every Azure Synapse workspace comes with a default quota of 50 GPU vCores that can be used for Spark. However if you want to increase your quota to be able to use more cores, please send an email to AzureSynapseGPU@microsoft.com with the total GPU quota required for your workload.