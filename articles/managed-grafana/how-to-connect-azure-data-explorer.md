---
title: Add an Azure Data Explorer data source in Grafana
titlesuffix: Azure Managed Grafana
description: In this guide, learn how to connect an Azure Data Explorer datasource to Grafana and learn about the authentication methods available for Azure Data Explorer.
author: maud-lv
ms.author: malev
ms.service: managed-grafana
zone_pivot_groups: azure-red-hat-openshift-service-principal
ms.topic: how-to
ms.date: 11/24/2023
# CustomerIntent: As an Azure Managed Grafana customer, I want to add and configure Azure Data Explorer so that I can use an Azure Data Explorer datasource in a Grafana dashboard.
---

# Configure an Azure Data Explorer datasource

Azure Data Explorer is a logs & telemetry data exploration service. In this guide, you learn how to add an Azure Data Explorer data source to Grafana and you learn how to configure Azure Data Explorer using each authentication option available for this service.

## Prerequisites

* [An Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md) in the Standard plan.
* [An Azure Data Explorer database](/azure/data-explorer/create-cluster-database)

::: zone pivot="aro-azureportal"

## Add an Azure Data Explorer data source

Add an Azure Data Explorer data source to Grafana by following the steps below.

1. Open an Azure Managed Grafana instance in the Azure portal.
1. In the **Overview** section, open the **Endpoint** URL.
1. In the Grafana portal, deploy the menu on the left and select **Connections** > **Connect data**.

    :::image type="content" source="media\azure-data-explorer\connect-data.png" alt-text="Screenshot of the Grafana platform showing the Connect data option.":::

1. Select **Azure Data Explorer Datasource** from the list, and add it to Grafana by selecting **Create a Azure Data Explorer Datasource data source**.

## Configure an Azure Data Explorer data source

Enter Azure Data Explorer configuration settings.

1. In the **Settings** tab, optionally edit the data source **Name**.

    :::image type="content" source="media\azure-data-explorer\basic-settings.png" alt-text="Screenshot of the Grafana platform showing the basic configuration settings for Azure Data Explorer.":::

1. Under **Connection Details**, enter the Azure Data Explorer database **Cluster URL**.
1. Select your preferred authentication option between **Managed Identity**, **App Registration** (service principal) or **Current User** (user-based authentication).

### [Managed identity](#tab/managed-identity)

Azure Managed identity lets you authenticate without using explicit credentials.

1. In the Azure portal, open your Azure Data Explorer cluster.
1. In the **Overview** section, select the database that contains your data.
1. Select **Permissions > Add > Viewer**.

    :::image type="content" source="media\azure-data-explorer\add-permission.png" alt-text="Screenshot of the Azure platform showing a user adding a viewer permission in an Azure Data Explorer database.":::

1. In the search box, enter your Azure Managed Grafana workspace name, select the workspace and then choose **Select**.
1. A success notification appears.
1. Back in Grafana, under **Authentication Method**, select **Managed Identity**.
1. Select **Save & test**. The "Success" notification displayed indicates that Grafana is able to fetch data from the database.

### [App registration](#tab/app-registration)

The app registration option authenticates using a Microsoft Entra service principal.

#### Configure initial set-up

1. Follow the steps in [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).
1. Assign the Reader role to the application in the [next step of the guide](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application).
1. Follow the three first steps of the [Retrieve application details](/azure/managed-grafana/how-to-api-calls#retrieve-application-details) guide to gather the Directory (tenant) ID, Application (client) ID and Client Secret ID required in the next step.

#### Configure the data source

1. Under **Authentication Method**, select **App Registration**.
1. For **Azure Cloud**, select your Azure Cloud. For example, **Azure**.

    :::image type="content" source="media\azure-data-explorer\app-registration-authentication.png" alt-text="Screenshot of the Azure Data Explorer configuration form for the App Registration athentication method in Grafana.":::

1. Enter a **Directory (tenant) ID**, **Application (client) ID** and **Client Secret**
1. Optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.
1. Select **Save & test** to validate the connection. The "Success" notification displayed indicates that Grafana is able to connect to the database.

### [Current user](#tab/current-user)

User-based authentication leverages the current Grafana user's Entra ID credentials in the configured data source.

When you configure an Azure Data Explorer data source with the Current User authentication method, Grafana queries Azure Data Explorer using the user's credentials. With this approach, you don't need to go through the extra step of geting a read permission assigned to your Grafana managed identity.

> [!NOTE]
> Rollout of the user-based authentication in Azure Managed Grafana is in progress and will be complete in all regions by the end of 2023.

> [!CAUTION]
> User-based authentication in Grafana data sources is experimental.

> [!CAUTION]
> This feature is incompatible with use cases that requires always-on machine access to the queried data, including Alerting, Reporting, Query caching and Public dashboards. The Current User authentication method relies on a user being logged in, in an interactive session, for Grafana to reach the database. When user-based authentication is used and no user is logged in, automated tasks can't run in the background. To leverage automated tasks for Azure Data Explorer, we recommend setting up another Azure Data Explorer data source using another authentication method.

1. Under **Authentication Method**, select **Current User**.
1. Select **Save & test**. The "Success" notification displayed indicates that Grafana is able to fetch data from the database.

---

:::zone-end

::: zone pivot="aro-azurecli"

In the Azure CLI, add and configure an Azure Data Explorer, by running the [az grafana data-source create](/cli/azure/grafana/data-source#az-grafana-data-source-create) command. Choose the authentication method you want to use and refer to the correspondig the tab below for more information. When running these commands, replace all placeholders with your own information.

## Create an Azure Data Explorer data source

### [Managed identity](#tab/managed-identity)

Azure Managed identity lets you authenticate without using explicit credentials.

```azurecli
az grafana data-source create --name <azure-managed-grafana-workspace> --definition '{
  "name": "<data-source-name>",
  "type": "grafana-azure-data-explorer-datasource",
  "access": "proxy",
  "jsonData": {
    "dataConsistency": "strongconsistency",
    "clusterUrl": "<cluster-url>"
  }
}'
```

### [App registration](#tab/app-registration)

The app registration authentication method uses a Microsoft Entra service principal.

```azurecli
az grafana data-source create --name <azure-managed-grafana-workspace> --definition '{
  "name": "<data-source-name>",
  "type": "grafana-azure-data-explorer-datasource",
  "access": "proxy",
  "jsonData": {
    "clusterUrl": "<cluster-url>",
    "azureCredentials": {
      "authType": "clientsecret",
      "azureCloud": "AzureCloud",
      "tenantId": "<tenant-id>",
      "clientId": "<-client-id>"
    }
  },
  "secureJsonData": { "azureClientSecret": "verySecret" }
}'
```

---

## Update an Azure Data Explorer data source

To update an Azure Data Explorer data source, follow the steps below. When running these commands, replace all placeholders with your own information.

1. Get the ID of the Azure Data Explorer data source to update with [az grafana data-source list](/cli/azure/grafana/data-source#az-grafana-data-source-list).
  
  ```azurecli
  az grafana data-source list --resource-group <azure-managed-grafana-resource-group> --name <azure-managed-grafana-workspace> --query "[?type=='grafana-azure-data-explorer-datasource'].id"
  ```

1. Run the [az grafana data-source update](/cli/azure/grafana/data-source#az-grafana-data-source-update) command to update the data source.

  For example, update the name and cluster URL of the Azure Data Explorer data source with the following command.

  ```azurecli
  az grafana data-source update --resource-group <azure-managed-grafana-workspace-resource-group> --name <azure-managed-grafana-workspace> --data-source-id <data-source-id> --set name="<new-name>" url="<new-url>
  ```

:::zone-end

## Next step

> [!div class="nextstepaction"]
> [Create a dashboard](how-to-create-dashboard.md)
