---
title: How to enter the HDInsight on AKS Flink CLI client using Secure Shell (SSH) on Azure portal
description: How to enter the HDInsight on AKS Flink SQL & DStream CLI client using webssh on Azure portal
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Access CLI Client using Secure Shell (SSH) on Azure portal

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This example guides how to enter the HDInsight on AKS Flink CLI client using SSH on Azure portal, we cover both Flink SQL and Flink DataStream

## Prerequisites
- You're required to select SSH during [creation](./flink-create-cluster-portal.md) of Flink Cluster

## Connecting to the SSH from Azure portal

Once the Flink cluster is created, you can observe on the left pane the **Settings** option to access **Secure Shell**

:::image type="content" source="./media/flink-web-ssh-on-portal-to-flink-sql/create-pod-and-connect-to-web-ssh.png" alt-text="Screenshot showing How to create POD and connect to webssh." lightbox="./media/flink-web-ssh-on-portal-to-flink-sql/create-pod-and-connect-to-web-ssh.png":::

## Apache Flink SQL 

#### Connecting to SQL Client 

You're required to change directory to `/opt/flink-webssh/bin` and then execute `./sql-client.sh`

:::image type="content" source="./media/flink-web-ssh-on-portal-to-flink-sql/sql-client-file.png" alt-text="Screenshot how to find sql client file.":::

:::image type="content" source="./media/flink-web-ssh-on-portal-to-flink-sql/run-sql-client.png" alt-text="Screenshot showing how to run SQL client."::: 

You're now on SQL Client on Flink

Refer to [this](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/table/sqlclient/) document to perform few more tests. 

## Apache Flink DataStream

Flink provides a Command-Line Interface (CLI)  `bin/flink` to run programs that are packaged as JAR files and to control their execution. 

The CLI is part Secure Shell (SSH), and it connects to the running JobManager and use the client configurations specified at `conf/flink-conf.yaml`. 

Submitting a job means to upload the job’s JAR to the SSH pod and initiating the job execution. To illustrate an example for this article, we select a long-running job like `examples/streaming/StateMachineExample.jar`.  

> [!NOTE]
> For managing dependencies, the expectation is to build and submit a fat jar for the job. 

- Upload the fat job jar from ABFS to webssh.
- Based on your use case, you’re required to edit the client configurations using [Flink configuration management](../flink/flink-configuration-management.md) under flink-client-configs.
 
- Let us run StateMachineExample.jar

  ```
  ./bin/flink run \
      --detached \
      ./examples/streaming/StateMachineExample.jar
  ```
> [!NOTE]
> Submitting the job using `--detached` will make the command return after the submission is done. The output contains the ID of the newly submitted job.

## Reference

* [Flink SQL Client](https://nightlies.apache.org/flink/flink-docs-master/docs/dev/table/sqlclient/)
