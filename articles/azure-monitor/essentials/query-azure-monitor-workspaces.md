---
title: Query metrics in an Azure Monitor workspace using PromQL
description: Describes how to Query metrics in an Azure Monitor workspace using PromQL.
ms.topic: how-to
author: EdB-MSFT
ms.author: edbaynash
ms.date: 09/28/2022
ms.reviewer: aul
---

# Query Prometheus metrics from an Azure Monitor Workspace using PromQL.

Azure Monitor managed service for Prometheus (preview), collects metrics from Azure Kubernetes Clusters and stores them in an Azure Monitor workspace.  PromQL - Prometheus query language, is a functional query language that allows you to query and aggregate time series data. Use PromQL to query and aggregate metrics stored in an Azure Monitor workspace. 

This article describes how to query an Azure Monitor workspace using PromQL via  REST API.
For more information on PromQL, see [Querying prometheus](https://prometheus.io/docs/prometheus/latest/querying/basics/). 

## Prerequisites 
To query an Azure monitor workspace using PromQL you need the following prerequisites:
+ An Azure Kubernetes Cluster or remote Kubernetes cluster.
+ Azure Monitor managed service for Prometheus (preview) scraping metrics from a Kubernetes cluster
+ An Azure Monitor Workspace where Prometheus metrics Azure Site Recovery being stored.

## Authentication

To query your Azure Monitor workspace, authenticate using Azure Active Directory.
The API supports Azure Active Directory authentication using Client credentials. Register a client app with Azure Active Directory and request a token.

To set up Azure Active Directory authentication, follow the steps below:

1. Register an app with Azure Active Directory.
1. Grant access for the app to your Azure Monitor workspace.
1. Request a token.


### Register an app with Azure Active Directory

1. To register an app, follow the steps in [Register an App to request authorization tokens and work with APIs](../logs/api/register-app-for-token.md?tabs=portal)

<<<<Is this required ?>>>>>
1. On the app's overview page, select API permissions.

1. Select Add a permission.

1. On the APIs my organization uses tab, search for Log Analytics and select Log Analytics API from the list.

### Allow your app access to your workspace
Allow your app to query data from your Azure Monitor workspace.

1. Open your Azure Monitor workspace in the Azure portal.

1. On the Overview page, take note of your Query endpoint foe use in your REST request.

1. Select Access control (IAM).  
    :::image type="content" source="./media/query-azure-monitor-workspaces/workspace-overview.png" lightbox="./media/query-azure-monitor-workspaces/workspace-overview.png" alt-text="A screenshot showing the Azure Monitor workspace overview page":::

1. Select **Add**, then **Add role assignment** from the Access Control (IAM) page.

1. On the **Add role Assignment page**, search for *Monitoring*.

1. Select **Monitoring Data Reader**, then select the Members tab.

    :::image type="content" source="./media/query-azure-monitor-workspaces/add-role-assignment.png" lightbox="./media/query-azure-monitor-workspaces/add-role-assignment.png" alt-text="A screenshot showing the Add role assignment page":::

1. Select **Select members**.

1. Search for the app that you registered in the Register an app with Azure Active Directory section and select it.

1. Choose **Select**.

1. Select **Review + assign**. 

    :::image type="content" source="./media/query-azure-monitor-workspaces/select-members.png" lightbox="./media/query-azure-monitor-workspaces/select-members.png.png" alt-text="A screenshot showing the Add role assignment, select members page.":::

You've created your App registration and have assigned it access to query data from your Azure Monitor workspace.  You can now generate a token and use it in a query.


### Request a Token
Send the following request in the command prompt or by using a client like Postman.

```shell
curl -X POST 'https://login.microsoftonline.com/<tennant ID>/oauth2/token' \
-H 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'grant_type=client_credentials' \
--data-urlencode 'client_id=<your apps client ID>' \
--data-urlencode 'client_secret=<your apps client secret' \
--data-urlencode 'resource= https://prometheus.monitor.azure.com'
```

Sample response body:

```JSON
{
    "token_type": "Bearer",
    "expires_in": "86399",
    "ext_expires_in": "86399",
    "expires_on": "1672826207",
    "not_before": "1672739507",
    "resource": "https:/prometheus.monitor.azure.com",
    "access_token": "eyJ0eXAiOiJKV1Qi....gpHWoRzeDdVQd2OE3dNsLIvUIxQ"
}
```

Save the access token from the response for use in the following HTTP requests.  

## Query Endpoints 

### GET/query

```
GET https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.monitor/accounts/<workspace name>/api/v1/label/__name__/values?api-version=2021-06-01-preview
--header 'Authorization:  Bearer <access token>'
   ```
When using the management end point, request a token using `--data-urlencode 'resource= https://management.azure.com'` 

### POST / query 

POST uses the Azure Monitor workspace query endpoint  

```http
https://k8s-02-workspace-abcd.eastus.prometheus.monitor.azure.com/api/v1/query  

--header 'Authorization:  Bearer <access token>'
--header 'Content-Type: application/x-www-form-urlencoded' 
--data-urlencode 'query=sum(
    container_memory_working_set_bytes 
    * on(namespace,pod)
    group_left(workload, workload_type) namespace_workload_pod:kube_pod_owner:relabel{ workload_type="deployment"}) by (pod)'

```

When using the Azure Monitor workspace query endpoint, request a token using `--data-urlencode 'resource= https://prometheus.monitor.azure.com'`

Find your workspace's query endpoint on the overview page.
:::image type="content" source="./media/query-azure-monitor-workspaces/find-query-endpoint.png" lightbox="./media/query-azure-monitor-workspaces/find-query-endpoint.png" alt-text="A screenshot sowing the query endpoin on the Azure Monitor workspace overview page.":::
## Supported APIs
The following queries are supported:

+ [Instant queries](https://prometheus.io/docs/prometheus/latest/querying/api/#instant-queries): /api/v1/query

+ [Range queries](https://prometheus.io/docs/prometheus/latest/querying/api/#range-queries): /api/v1/query_range

+ [Series](https://prometheus.io/docs/prometheus/latest/querying/api/#finding-series-by-label-matchers): /api/v1/series

+ [Labels](https://prometheus.io/docs/prometheus/latest/querying/api/#getting-label-names): /api/v1/labels

+ [Label values](https://prometheus.io/docs/prometheus/latest/querying/api/#querying-label-values): /api/v1/label/__name__/values.

    **name** is the only supported version of this API, which effectively means GET all metric names. Any other /api/v1/label/{name}/values aren't supported.   <<<< More explanantion needed>>>>

For the full specification of OSS prom APIs, see [Prometheus HTTP API](https://prometheus.io/docs/prometheus/latest/querying/api/#http-api )
## API limitations
(differing from prom specification)
+ Scoped to metric
    Any time series fetch queries (/series or /query or /query_range) must contain name label matcher that is, each query must be scoped to a metric. And there should be exactly one name label matcher in a query, not more than one.
    <<< name label matcher ??>>>

+ Supported time range
    + /query_range API supports a time range of 32 days (end time minus start time).
    <<<history depth ?>>>

    + /series API fetches data only for 12 hours time range. If endTime isn't provided, endTime = time.now().

    + range selectors (time range baked in query itself) supports 32d.
            <<<more explanation needed - time range baked in query itself>>>
+ Ignore time range  
    Start time and end time provided with /labels and /label/name/values are ignored, and all retained data in MDM is queried.
<<<more explanation needed>>>

+ Experimental features  
The experimental features such as exemplars aren't  supported.

For more information on Prometheus metrics limits, see [Prometheus metrics](../../azure-monitor/service-limits.md#prometheus-metrics)

>[!NOTE]
> Some of the limits can be increased. Please contact [PromWebApi](mailto:promwebapi@microsoft.com) to request an increase for these limits on your Azure Monitor workspace.