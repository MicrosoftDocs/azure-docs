---
title: Use Airflow with Trino cluster
description: How to create Airflow DAG connecting to Azure HDInsight on AKS Trino
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Use Airflow with Trino cluster

[!INCLUDE [feature-in-preview](../includes/feature-in-preview.md)]

This article demonstrates how to configure available open-source [Airflow Trino provider](https://airflow.apache.org/docs/apache-airflow-providers-trino/stable/index.html) to connect to HDInsight on AKS Trino cluster.
The objective is to show how you can connect Airflow to HDInsight on AKS Trino considering main steps as obtaining access token and running query.

## Prerequisites

* An operational HDInsight on AKS Trino cluster.
* Airflow cluster.
* Azure service principal client ID and secret to use for authentication.
* [Allow access to the service principal to Trino cluster](../hdinsight-on-aks-manage-authorization-profile.md).

### Install Airflow providers and dependencies
Airflow DAG demonstrated in the following steps, requires the following Airflow providers and uses existing open-source [Trino provider](https://airflow.apache.org/docs/apache-airflow-providers-trino/stable/index.html). To connect to Trino cluster, DAG uses MSAL for Python module.
```cmd
    pip install msal
    pip install apache-airflow-providers-trino
    pip install 'apache-airflow[virtualenv]'
```

## Airflow DAG overview

The following example demonstrates DAG which contains three tasks:

* Connect to Trino cluster - This task obtains OAuth2 access token and creates a connection to Trino cluster.
* Query execution - This task executes sample query.
* Print result - This task prints result of the query to the log.

:::image type="content" source="./media/trino-airflow/directed-acrylic-graph.png" alt-text="Screenshot showing Airflow for Trino DAG.":::


## Airflow DAG code
Now let's create simple DAG performing those steps. Complete code as follows

1. Copy the [following code](#example-code) and save it in $AIRFLOW_HOME/dags/example_trino.py, so Airlift can discover the DAG.
1. Update the script entering your Trino cluster endpoint and authentication details.
1. Trino endpoint (`trino_endpoint`) - HDInsight on AKS Trino cluster endpoint from Overview page in the Azure portal.
1. Azure Tenant ID (`azure_tenant_id`) - Identifier of your Azure Tenant, which can be found in Azure portal.
1. Service Principal Client ID - Client ID of an application or service principal to use in Airlift for authentication to your Trino cluster.
1. Service Principal Secret - Secret for the service principal.
1. Pay attention to connection properties, which configure JWT authentication type, https and port. These values are required to connect to HDInsight on AKS Trino cluster.

> [!NOTE]
> Give access to the service principal ID (object ID) to your Trino cluster. Follow the steps to [grant access](../hdinsight-on-aks-manage-authorization-profile.md).

### Example code

Refer to [sample code](https://github.com/Azure-Samples/hdinsight-aks/blob/main/src/trino/trino-airflow-cluster.py).

## Run Airflow DAG and check results
After restarting Airflow, find and run example_trino DAG. Results of the sample query should appear in Logs tab of the last task.

:::image type="content" source="./media/trino-airflow/print-result-log.png" alt-text="Screenshot showing how to check results for Airflow Trino DAG." lightbox="./media/trino-airflow/print-result-log.png":::

> [!NOTE]
> For production scenarios, you should choose to handle connection and secrets diffirently, using Airflow secrets management.

## Next steps
This example demonstrates basic steps required to connect Airflow to HDInsight on AKS Trino. Main steps are obtaining access token and running query.

## See also
* [Getting started with Airflow](https://airflow.apache.org/docs/apache-airflow/stable/start.html)
* [Airflow Trino provider](https://airflow.apache.org/docs/apache-airflow-providers-trino/stable/index.html)
* [Airflow secrets](https://airflow.apache.org/docs/apache-airflow/stable/security/secrets/index.html)
* [HDInsight on AKS Trino authentication](./trino-authentication.md)
* [MSAL for Python](/entra/msal/python)
