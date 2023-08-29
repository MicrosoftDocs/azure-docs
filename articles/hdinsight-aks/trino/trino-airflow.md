---
title: Use Airflow with Trino cluster
description: How to create Airflow DAG connecting to Azure HDInsight on AKS Trino
ms.service: hdinsight-aks
ms.topic: how-to
ms.date: 08/29/2023
---

# Use Airflow with Trino cluster

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

```python
import json
import msal
from airflow import DAG, settings
from airflow.models import Connection
from airflow.operators.python_operator import PythonOperator
from airflow.providers.trino.operators.trino import TrinoOperator
from datetime import datetime
from airflow.exceptions import AirflowFailException

connect_id="_trino_test_connection"

#
# Update with your HDInsight on AKS Trino cluster details.
#
scopes= [ "https://hilo.azurehdinsight.net/.default" ]
authority= "https://login.microsoftonline.com/<azure_tenant_id>"
client_id= "<service_principal_client_id>"
secret= "<service_principal_secret>"
trino_endpoint="<trino_cluster_endpoint>"

#
# Get access token from Azure AD
#
def get_token(authority, scopes, client_id, secret):
    result=None
    app = msal.ConfidentialClientApplication(
        client_id, 
        authority=authority,
        client_credential=secret)

    result = app.acquire_token_silent(scopes, account=None)
    if not result:
        result = app.acquire_token_for_client(scopes=scopes)

    if "access_token" in result:
        return result['access_token']
    else:
        print(result.get("error"))
        print(result.get("error_description"))
        print(result.get("correlation_id"))
        return None

#
# Create an Airflow connection to Trino using JWT auth
# This connection and secrets management is not suitable for producation, serves as an example only.
#
def trino_connect(ds, **kwargs):    
    session = settings.Session()
    if not (session.query(Connection).filter(Connection.conn_id == connect_id).first()):
        new_conn = Connection(
            conn_id=connect_id,
            conn_type='trino',
            host=trino_endpoint,
            port=443
        )

        access_token=get_token(authority, scopes, client_id, secret)
        conn_extra = {
            "protocol": "https",
            "auth": "jwt",
            "jwt__token": access_token
        }
        conn_extra_json = json.dumps(conn_extra)
        new_conn.set_extra(conn_extra_json)        

        session.add(new_conn)
        session.commit()
    else:
        raise AirflowFailException("Connection {conn_id} already exists.".format(conn_id=connect_id))

#
# Print task result and cleanup
#
def print_data(**kwargs):
    task_instance = kwargs['task_instance']
    print('Return Value: ',task_instance.xcom_pull(task_ids='trino_query',key='return_value'))

    session = settings.Session()
    connection = session.query(Connection).filter_by(conn_id=connect_id).one_or_none()
    if connection is None:
        print("Nothing to cleanup")
    else:
        session.delete(connection)
        session.commit()
        print("Successfully deleted connection ", connect_id)

#
# DAG
#
with DAG(
    dag_id="example_trino",
    schedule="@once", 
    start_date=datetime(2023, 1, 1),
    catchup=False,
    tags=["example"],
) as dag:
    trino_connect = PythonOperator(
        dag=dag,
        task_id='trino_connect',
        python_callable=trino_connect,
        provide_context=True,
    )

    trino_query = TrinoOperator(
        task_id="trino_query",
        trino_conn_id=connect_id,
        sql="select * from tpch.tiny.orders limit 1",
        handler=list
    )

    print_result = PythonOperator(
        task_id = 'print_result',
        python_callable = print_data,
        provide_context = True,
        dag = dag)
    
    (
        trino_connect >> trino_query >> print_result
    )
```

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
