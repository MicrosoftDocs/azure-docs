---
title: Apache Spark on GPU
description: Introduction to core concepts for Apache Spark on GPUs inside Synapse Analytics.
services: synapse-analytics 
author: nidutta 
ms.service:  synapse-analytics 
ms.topic: overview
ms.subservice: spark
ms.date: 10/15/2021
ms.author: nidutta
---

# Apache Spark on GPUs in Azure Synapse Analytics

Apache Spark is a parallel processing framework that supports in-memory processing to boost the performance of big-data analytic applications. Apache Spark in Azure Synapse Analytics is one of Microsoft's implementations of Apache Spark in the cloud. 

Azure Synapse now offers the ability to create Apache Spark pools using GPUs to run Spark workloads using underlying [RAPIDS libraries](https://nvidia.github.io/spark-rapids/) that leverage the massive parallel processing power of GPUs to accelerate processing. The RAPIDS Accelerator for Apache Spark allows you to run your existing Spark applications with no code change by just enabling a configuration setting, which comes pre-configured for a GPU pool.
You can choose to turn on/off the RAPIDS based GPU acceleration for your jobs or parts of your jobs by setting this configuration:

```
spark.conf.set('spark.rapids.sql.enabled','true')
```

> [NOTE]
> Apache Spark on GPUs in Synapse Analytics is currently in Public Preview. These are all the regionns this feature is currently available in: East US, East US2, West US2, West Europe.

## RAPIDS Accelerator for Apache Spark

The Spark RAPIDS accelerator is a plugin that works by overriding the physical plan of a Spark job by supported GPU operators, and running those operations on the GPUs, thereby acceleration processing. This library is currently in preview and doesn't support all Spark operations (here is a list of [currently supported operators](https://nvidia.github.io/spark-rapids/docs/supported_ops.html), but more support is being added incrementally through new releases.

## Cluster configuration options

The RAPIDS Accelerator plugin only supports a one-to-one mapping between GPUs and executors. This means a Spark job would need to request executor and driver resources that can be accommodated by the pool resources (according to the number of available GPU and CPU cores). In order to meet this condition and ensure optimal utilization of all the pool resources, we require the following configuration of drivers and executors for a Spark application run on GPU pools:


    | Pool size | Driver size options | Driver cores | Driver Memory (GB) | Executor cores | Executor Memory (GB) | Number of Executors |
    | :------- | :------------------ | :----------- | :----------------- | :------------- | :------------------- | :------------------ |
    | GPU-Large | Small driver | 4 | 30 | 12 | 60 | Number of nodes in pool |
    | GPU-Large | Medium driver | 7 | 30 | 9 | 60 | Number of nodes in pool |
    | GPU-XLarge | Medium driver | 8 | 40 | 14 | 80 | 4 * Number of nodes in pool |
    | GPU-XLarge | Large driver | 12 | 40 | 13 | 80 | 4 * Number of nodes in pool |


1. Hello:

    |Pool size | Driver size options | Driver cores | Driver Memory (GB) | Executor cores | Executor Memory (GB) | Number of Executors |
    | :------ | :-------------- | :---------- | :------------- | :------------- | :------------------- | :------------------ |
    | GPU-Large | Small driver | 4 | 30 | 12 | 60 | Number of nodes in pool |
    | GPU-Large | Medium driver | 7 | 30 | 9 | 60 | Number of nodes in pool |
    | GPU-XLarge | Medium driver | 8 | 40 | 14 | 80 | 4 * Number of nodes in pool |
    | GPU-XLarge | Large driver | 12 | 40 | 13 | 80 | 4 * Number of nodes in pool |


Any workload that does not meet one of the above configurations will not be accepted. This is done to make sure Spark jobs are being run with the most efficient and performant configuration utilizing all available resources on the pool.

The user should set the above configuration through their workload. For notebooks, the user can use the `%%configure` magic command to set one of the above configurations like so.
For a Large pool with 3 nodes:

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

It would be good to be familiar with the [basic concepts of how to use a notebook](apache-spark-development-using-notebooks.md) in Synapse Analytics. Let's walk through the steps to run a simple Spark application utilizing GPU acceleration. You can write a Spark application in all the four languages supported inside Synapse, PySpark (Python), Spark (Scala), SparkSQL and .NET for Spark (C#). For this example we'll choose a Spark/Scala notebook:

1. Create a GPU pool as described in [this quickstart](../quickstart-create-apache-gpu-pool-portal.md). (Q- Will we still be behind feature flag in Public preview?)
2. Create a notebook and attach it to the GPU pool you created in the first step.
3. Choose the `Small driver` option through the configuration panel for your notebook.
4. Create 2 sample dataframes by copying the below code in the first cell of your notebook: (Q- do tabbed for each language same code)

```scala
val emp = Seq((1,"Smith",10,100000),
    (2,"Rose",20,97600),
    (3,"Williams",20,110000),
    (4,"Jones",10,80000),
    (5,"Brown",40,60000),
    (6,"Brown",30,78000)
)
val empColumns = Seq("emp_id","name","emp_dept_id","salary")
import spark.sqlContext.implicits._
val empDF = emp.toDF(empColumns:_*)

val dept = Seq(("Finance",10),
    ("Marketing",20),
    ("Sales",30),
    ("IT",40)
  )
val deptColumns = Seq("dept_name","dept_id")
val deptDF = dept.toDF(deptColumns:_*)
```

5. Now let's do a simple join of the two dataframes on the `dept_id` and get max salary per department name:

```scala
val deptMaxSalariesDF = empDF.join(deptDF,empDF("emp_dept_id") === deptDF("dept_id"),"inner" ).groupBy("dept_name").max("salary")
val deptMaxSalaries = deptMaxSalariesDF.collect()
deptMaxSalaries.show()
```

6. (Q - do we want to show how to check if GPUs are being used for the job through history server, SQL plan screenshots?)

## How to tune your application for GPUs

Most Spark jobs can see improved performance through tuning configuration settings from defaults, and the same holds true for jobs leveraging the RAPIDS accelerator plugin for Apache Spark. [This documentation](https://nvidia.github.io/spark-rapids/docs/tuning-guide.html) provides guidelines on how to tune a Spark job to run on GPUs using the RAPIDS plugin.

## Quotas and resource constraints in Apache Spark on GPUs for Azure Synapse

### Workspace level

(Q - Do we talk about GPU quotas here?)

Every Azure Synapse workspace comes with a default quota of vCores that can be used for Spark. The quota is split between the user quota and the dataflow quota so that neither usage pattern uses up all the vCores in the workspace. The quota is different depending on the type of your subscription but is symmetrical between user and dataflow. However if you request more vCores than are remaining in the workspace, then you will get the following error:

```console
Failed to start session: [User] MAXIMUM_WORKSPACE_CAPACITY_EXCEEDED
Your Spark job requested 480 vcores.
However, the workspace only has xxx vcores available out of quota of yyy vcores.
Try reducing the numbers of vcores requested or increasing your vcore quota. Click here for more information - https://go.microsoft.com/fwlink/?linkid=213499
```

Send separate email to Rahul to say we're going public preview to educate CSS about this.