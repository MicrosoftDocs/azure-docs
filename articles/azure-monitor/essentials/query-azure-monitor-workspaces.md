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

Azure Monitor managed service for Prometheus (preview), collects metrics from Azure Kubernetes Clusters and stores them in an Azure Monitor workspace.  PromQL - Prometheus query language, is a functional query language that allows you to query and aggregate time series data. Use PromQL to query and aggregate metrics stored in a Azure Monitor workspace. 

This article describes how to query an Azure Monitor workspace using PromQL via  REST API .
For more information on ProQL, see [QUERYING PROMETHEUS](https://prometheus.io/docs/prometheus/latest/querying/basics/). 

## Prerequisites 
To query a n Azure montior workspace using PromQL you need the following:
+ An Azure Kubernetes Cluster or remote Kubernetes cluster.
+ Azure Monitor managed service for Prometheus (preview) scraping metrics from a Kubernetes cluster
+ An Azure Monitor Workspace where Prometheus metrics asr being stored.

## Authentication

To query your Azure Monitor workspace, you must use authenticate using Azure Active Directory.
The API supports Azure Active Directory authentication using Client credentials. Register a client app with Azure Active Directory and request a token.

1. [Register an app in Azure Active Directory](https://learn.microsoft.com/en-us/azure/azure-monitor/logs/api/register-app-for-token)

On the app's overview page, select API permissions.

Select Add a permission.

On the APIs my organization uses tab, search for Log Analytics and select Log Analytics API from the list.

To set up Azure Active Directory authentication, follow the steps below:

1. Register an app with Azure Active Directory.
1. Grant access for the app to your Azure Monitor workspace.
1. Configure your self-hosted Grafana with the app's credentials.

### Register an app with Azure Active Directory

1. To register an app, open the Active Directory Overview page in the Azure portal.

1. Select **Add** from the tool bar and **App registration** from the dropdown.

1. On the **Register an application page**, enter a Name for the application.

1. Select Register.

1. Note the** Application (client) ID** and **Directory(Tenant) ID**. They're used in the body of the authentication request.
    :::image type="content" source="./media/query-azure-monitor-workspaces/app-registration-overview.png" lightbox="./media/query-azure-monitor-workspaces/app-registration-overview.png" alt-text="A screen shot showing an app registration overview page.":::
    
1. On the app's overview page, select **Certificates and Secrets**.

1. In the Client secrets tab, select New client secret.

1. Enter a Description.

1. Select an expiry period from the dropdown and select Add.

    >[!Note]
    > Create a process to renew the secret and update your API REST calls before the secret expires. Once the secret expires you won't able to authenticate with this client ID and won't be able to query data from your Azure Monitor workspace using the API.

    :::image type="content" source="./media/query-azure-monitor-workspaces/add-a-client-secret.png" lightbox="./media/query-azure-monitor-workspaces/add-a-client-secret.png" alt-text="A screenshot showing the Add client secret page.":::

1. Copy and save the client secret Value.

>[!Note]
> Client secret values can only be viewed immediately after creation. Be sure to save the secret value before leaving the page.  

   :::image type="content" source="./media/query-azure-monitor-workspaces/client-secret.png" lightbox="./media/query-azure-monitor-workspaces/client-secret.png" alt-text="A screenshot showing the client secret page with generated secret value.":::

### Allow your app access to your workspace
Allow your app to query data from your Azure Monitor workspace.

1. Open your Azure Monitor workspace in the Azure portal.

1. On the Overview page, take note of your Query endpoint. The query endpoint is used when setting up your Grafana data source.

1. Select Access control (IAM). A screenshot showing the Azure Monitor workspace overview page

1. Select **Add**, then **Add role assignment** from the Access Control (IAM) page.

1. On the Add role Assignment page, search for *Monitoring*.

1. Select **Monitoring Data Reader**, then select the Members tab.

    :::image type="content" source="./media/query-azure-monitor-workspaces/add-role-assignment.png" lightbox="./media/query-azure-monitor-workspaces/add-role-assignment.png" alt-text="A screenshot showing the Add role assignment page":::

1. Select **Select members**.

1. Search for the app that you registered in the Register an app with Azure Active Directory section and select it.

1. Click **Select**.

1. Select **Review + assign**. 

  :::image type="content" source="./media/query-azure-monitor-workspaces/select-members.png" lightbox="./media/query-azure-monitor-workspaces/select-members.png.png" alt-text="A screenshot showing the Add role assignment, select members page.":::

You've created your App registration and have assigned it access to query data from your Azure Monitor workspace. 


## Request a Token
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

## Endpoints 

Two endpoints are supported for wuering Azure Monitor workspaces:
+ Azure monitor workspace query endpoint 
   For example:
    POST: Query endpoint from the over view page
    https://k8s02-workspace-abcd.eastus.prometheus.monitor.azure.com/api/v1/query

+ https://management.azure.com resource endpoint
   For example:
    GET: https://management.azure.com/subscriptions/<subscriptionId>/resourcegroups/<resourceGroupName>/providers/microsoft.monitor/accounts/<amwName>?api-version=2021-06-01-preview
When using the management end point, request a token using `--data-urlencode 'resource= https://prometheus.monitor.azure.com'` instead of `prometheus.monitor.azure.com`


Save the access token from the response for use in the following HTTP requests.