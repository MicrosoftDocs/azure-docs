---
title: Flink cluster configuration - HDInsight on AKS - Apache Flink
description: Learn Flink cluster configuration troubleshoot in HDInsight on AKS - Apache Flink
ms.service: hdinsight-aks
ms.topic: troubleshooting
ms.date: 09/26/2023
---

# Troubleshoot Flink cluster configuration

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

Incorrect cluster configuration may lead to deployment errors. Typically those errors occur when incorrect configuration provided in ARM template or input in Azure portal, for example, on [Configuration management](flink-configuration-management.md) page. 

Example configuration error: 

  :::image type="image" source="./media/flink-cluster-configuration/error.png" alt-text="Screenshot shows error." border="true" lightbox="./media/flink-cluster-configuration/error.png":::

The following table provides error codes and their description to help diagnose and fix common errors. 

## Configuration error

| Error Code | Description |
|---|---|
| FlinkClusterValidator#IdentityValidator | Checks if the task manager (TM) and job manager (JM) process size has suffix mb. |
| |Checks if the TM and JM process size is less than the configured pod memory. |
|FlinkClusterValidator#IdentityValidator | Verifies if the pod identity is configured correctly |
| FlinkClusterValidator#ClusterSpecValidator | Checks if the JM, TM and history server (HS) pod CPU configured is within the configurable/allocatable SKU limits |
| |Checks if the JM, TM and history server (HS) pod memory configured is within the configurable/allocatable SKU limits |
| FlinkClusterValidator#StorageSpecValidator | Storage container validation for the appropriate name of the container  |
| | Verify with the supported storage types |

## System error

Some of the errors may occur due to environment conditions and be transient. These errors have reason starting with "System" as prefix. In such cases, try the following steps: 

1. Collect the following information: 

   - Azure request CorrelationId. It can be found either in Notifications area; or under Resource Group where cluster is located, on Deployments page; or in `az` command output. 

   - DeploymentId. It can be found in the Cluster Overview page. 

   - Detailed error message. 

1. Contact support team with this information. 

| Error code | Description |
|---|---|
| System.DependencyFailure | Failure in one of cluster components. |




