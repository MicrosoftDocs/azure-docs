---
title: Add an Azure Data Explorer data source in Grafana
titlesuffix: Azure Managed Grafana
description: In this guide, learn how to connect an Azure Data Explorer datasource to Grafana and learn about the authentication methods available for Azure Data Explorer.
author: maud-lv
ms.author: malev
ms.service: azure-managed-grafana
ms.custom: devx-track-azurecli
zone_pivot_groups: azure-red-hat-openshift-service-principal
ms.topic: how-to
ms.date: 12/19/2024
# CustomerIntent: As an Azure Managed Grafana customer, I want to add and configure Azure Data Explorer so that I can use an Azure Data Explorer datasource in a Grafana dashboard.
---

# Configure an Azure Data Explorer datasource

Azure Data Explorer is a logs & telemetry data exploration service. In this guide, you learn how to add an Azure Data Explorer data source to Grafana and you learn how to configure Azure Data Explorer using each authentication option available for this data source.

## Prerequisites

* [An Azure Managed Grafana instance](./quickstart-managed-grafana-portal.md) in the Standard plan.
* [An Azure Data Explorer database](/azure/data-explorer/create-cluster-database)

::: zone pivot="aro-azureportal"

## Add an Azure Data Explorer data source

Add an Azure Data Explorer data source to Grafana by following the steps below.

1. Open an Azure Managed Grafana instance in the Azure portal.
1. In the **Overview** section, open the **Endpoint** URL.
1. In the Grafana portal, go to **Connections** > **Data sources** > **Add new data source**, then search and select **Azure Data Explorer Datasource**.

## Configure an Azure Data Explorer data source

Enter Azure Data Explorer configuration settings.

1. In the **Settings** tab, optionally edit the data source **Name**.

    :::image type="content" source="media\azure-data-explorer\basic-settings.png" alt-text="Screenshot of the Grafana platform showing the basic configuration settings for Azure Data Explorer.":::

1. Under **Connection Details**, enter the Azure Data Explorer database **Cluster URL**.
1. Select your preferred authentication option between **Managed Identity**, **App Registration** (service principal) or **Current User** (user-based authentication).

    ### [Managed identity](#tab/managed-identity)

    Authenticate with a managed identity without using explicit credentials.

    #### Add a new permission

    1. In the Azure portal, open your Azure Data Explorer cluster.
    1. Select **Data** > **Databases** from the left menu, then select the database that contains your data.
    1. Select **Permissions > Add > Viewer**.
    1. In the search box, enter your Azure Managed Grafana workspace name, select the workspace and then choose **Select**. A success notification appears.
  
    #### Configure the data source in Grafana

    1. Back in Grafana, under **Authentication Method**, select **Managed Identity**.
    1. Select **Save & test**. The "Success" notification displayed indicates that Grafana is able to fetch data from the database.

    ### [App registration](#tab/app-registration)

    Authenticate with app registration using a Microsoft Entra service principal.

    #### Initial set-up

    1. Follow the steps in [Register an application with Microsoft Entra ID and create a service principal](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).
    1. Assign the Reader role to the application in the [next step of the guide](/entra/identity-platform/howto-create-service-principal-portal#assign-a-role-to-the-application).
    1. Follow the three first steps of the [Retrieve application details](/azure/managed-grafana/how-to-api-calls#retrieve-application-details) guide to gather the Directory (tenant) ID, Application (client) ID and Client Secret ID required in the next step.

    #### Configure the data source in Grafana

    1. In Grafana, under **Authentication Method**, select **App Registration**.
    1. For **Azure Cloud**, select your Azure Cloud. For example, **Azure**.

        :::image type="content" source="media\azure-data-explorer\app-registration-authentication.png" alt-text="Screenshot of the Azure Data Explorer configuration form for the App Registration authentication method in Grafana.":::

    1. Enter a **Directory (tenant) ID**, **Application (client) ID** and **Client Secret**
    1. Optionally also edit the **Query Optimizations**, **Database schema settings**, and **Tracking** sections.
    1. Select **Save & test** to validate the connection. The "Success" notification displayed indicates that Grafana is able to connect to the database.

    ### [Current user](#tab/current-user)

    Use the user-based authentication method, leveraging the current Grafana user's Microsoft Entra ID credentials in the configured data source.

    When you configure an Azure Data Explorer data source with the Current User authentication method, Grafana queries Azure Data Explorer using the user's credentials.

   > [!CAUTION]
   > User-based authentication in Grafana data sources is experimental.

   > [!CAUTION]
   > This feature is incompatible with use cases that requires always-on machine access to the queried data, including Alerting, Reporting, Query caching and Public dashboards. The Current User authentication method relies on a user being logged in, in an interactive session, for Grafana to reach the database. When user-based authentication is used and no user is logged in, automated tasks can't run in the background. To leverage automated tasks for Azure Data Explorer, we recommend setting up another Azure Data Explorer data source using another authentication method.

    #### Add a new permission

    Add a new permission for your user account to access the database.

    1. In the Azure portal, open the Azure Data Explorer Database resource, and select **Permissions** > **Add** > **Viewer**.
    1. Enter your name or email address in the search bar, select your user account and choose **Select**.

       :::image type="content" source="media\azure-data-explorer\add-database-viewer.png" alt-text="Screenshot of the Azure Data Explorer configuration form for the Current user authentication method in Grafana.":::

    1. A notification confirms that the permission has been added to the database.

    #### Configure the data source in Grafana

    1. In Grafana, under **Authentication Method**, select **Current User**.
    1. Select **Save & test**. The "Success" notification displayed indicates that Grafana is able to fetch data from the database.

    ---

:::zone-end

::: zone pivot="aro-azurecli"

## Create an Azure Data Explorer data source

In the Azure CLI, add and configure an Azure Data Explorer data source, by running the [az grafana data-source create](/cli/azure/grafana/data-source#az-grafana-data-source-create) command. Choose your preferred authentication method and refer to the corresponding tab below for details.

When running these commands, replace all placeholders with your own information.

### [Managed identity](#tab/managed-identity-cli)

Authenticate with a managed identity without using explicit credentials.

```azurecli
az grafana data-source create --name <azure-managed-grafana-workspace> --definition '{
  "name": "<data-source-name>",
  "type": "grafana-azure-data-explorer-datasource",
  "access": "proxy",
  "jsonData": {
    "clusterUrl": "<cluster-url>",
    "dataConsistency": "strongconsistency",
    "azureCredentials": {
      "authType": "msi"
    }
  }
}'
```

### [App registration](#tab/app-registration-cli)

Authenticate with app registration using a Microsoft Entra service principal.

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
      "clientId": "<client-id>"
    }
  },
  "secureJsonData": { "azureClientSecret": "verySecret" }
}'
```

### [Current user](#tab/current-user-cli)

Authenticate with the current user method. This method leverages the current Grafana user's Microsoft Entra ID credentials in the configured data source.

When you configure an Azure Data Explorer data source with the Current User authentication method, Grafana queries Azure Data Explorer using the user's credentials.

> [!NOTE]
> Rollout of the user-based authentication in Azure Managed Grafana is in progress and will be complete in all regions by the end of 2023.

> [!CAUTION]
> User-based authentication in Grafana data sources is experimental.

> [!CAUTION]
> This feature is incompatible with use cases that requires always-on machine access to the queried data, including Alerting, Reporting, Query caching and Public dashboards. The Current User authentication method relies on a user being logged in, in an interactive session, for Grafana to reach the database. When user-based authentication is used and no user is logged in, automated tasks can't run in the background. To leverage automated tasks for Azure Data Explorer, we recommend setting up another Azure Data Explorer data source using another authentication method.

```azurecli
az grafana data-source create --name <azure-managed-grafana-workspace> --definition '{
  "name": "<data-source-name>",
  "type": "grafana-azure-data-explorer-datasource",
  "access": "proxy",
  "jsonData": {
    "clusterUrl": "<cluster-url>",
    "dataConsistency": "strongconsistency",
    "azureCredentials": {
      "authType": "currentuser"
    }
  }
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
