---
title: "Tutorial: Build a Java metrics dashboard with Azure Managed Grafana"
description: Learn to build a Java metrics dashboard with Azure Managed Grafana.
services: container-apps
author: craigshoemaker
ms.service: azure-container-apps
ms.custom: devx-track-extended-java
ms.topic: tutorial
ms.date: 12/18/2024
ms.author: cshoe
#customer intent: As a developer, I want to build a grafa dashboard for Java metrics exposed from Azure Container Apps
---

# Tutorial: Build a Java metrics dashboard with Azure Managed Grafana

In this tutorial, you will learn how to set up a metrics dashboard using Azure Managed Grafana to monitor Java applications running in Azure Container Apps. 

Grafana is a popular tool for centralized metrics visualization and monitoring in the observability industry. Azure Managed Grafana is a fully managed Azure service that allows you to deploy and manage Grafana dashboards with seamless Azure integration. You can use Azure Managed Grafana to visualize Java metrics exposed by Azure Container Apps or integrate Java metrics into your existing Grafana dashboards.

In this tutorial, you:
> [!div class="checklist"]
> * Create an Azure Managed Grafana instance.
> * Create a Java metrics dashboard in Grafana.
> * Visualize Java metrics for Azure Container Apps with Grafana.

## Prerequisites

* An Azure account with an active subscription. If you don't already have one, you can [can create one for free](https://azure.microsoft.com/free/).
* [Azure CLI](/cli/azure/install-azure-cli).
* [A Java application deployed in Azure Container Apps](java-get-started.md).

## Set up the environment

Use the following steps to define environment variables and ensure your Azure Managed Grafana extension is up to date.

1. Create variables to support your Grafana configuration. 
   ```bash
   export LOCATION=eastus
   export SUBSCRIPTION_ID={subscription-id}
   export RESOURCE_GROUP=grafana-resource-group
   export GRAFANA_INSTANCE_NAME=grafana-name
   ```

   | Variable                | Description                                                                        |
   |-------------------------|------------------------------------------------------------------------------------|
   | `LOCATION`              | The Azure region location where you create your Azure Managed Grafana instance. |
   | `SUBSCRIPTION_ID`       | The subscription ID which you use to create your Azure Container Apps and Azure Managed Grafana instance. |
   | `RESOURCE_GROUP`        | The Azure resource group name for your Azure Managed Grafana instance.                           |
   | `GRAFANA_INSTANCE_NAME` | The instance name for your Azure Managed Grafana instance.               |
  

1. Log in to Azure with the Azure CLI.

   ```azurecli
   az login
   ```

1. Create a resource group.

   ```azurecli
   az group create --name $RESOURCE_GROUP --location $LOCATION
   ```

1. Use the following command to ensure that you have the latest version of the Azure CLI extensions for Azure Managed Grafana.

    ```azurecli
    az extension add --name amg --upgrade
    ```


## Set up an Azure Managed Grafana instance

First, create an Azure Managed Grafana instance, and grant necessary role assignments.

1. Create an Azure Managed Grafana instance.

   ```azurecli
   az grafana create \
       --name $GRAFANA_INSTANCE_NAME \
       --resource-group $RESOURCE_GROUP \
       --location $LOCATION
   ```

1. Grant the Azure Managed Grafana instance "Monitoring Reader" role to read metrics from Azure Monitor. Find more about the [authentication and permissions for Azure Managed Grafana](../managed-grafana/how-to-authentication-permissions.md).

   ```azurecli
   GRAFA_IDDENTITY=$(az grafana show --name $GRAFANA_INSTANCE_NAME --resource-group $RESOURCE_GROUP --query "identity.principalId" --output tsv)
   
   az role assignment create --assignee $GRAFA_IDDENTITY --role "Monitoring Reader" --scope /subscriptions/$SUBSCRIPTION_ID
   ```

## Create a Java metrics dashboard

> [!IMPORTANT]
> To add a new dashboard in Grafana, you need to have `Grafana Admin` or `Grafana Editor`role, see [Azure Managed Grafana roles](../managed-grafana/concept-role-based-access-control.md).


1. Assign the `Grafana Admin` role to your account on the Azure Managed Grafana resource.

   Get the resource ID for your Azure Managed Grafana instance.
   ```azurecli
   GRAFANA_RESOURCE_ID=$(az grafana show --resource-group $RESOURCE_GROUP --name $GRAFANA_INSTANCE_NAME --query id --output tsv)
   ```

   Before running this command, replace the `<USER_OR_SERVICE_PRINCIPAL_ID>` placeholder with your user or service principal ID.

   ```azurecli
   az role assignment create \
       --assignee <USER_OR_SERVICE_PRINCIPAL_ID> \
       --role "Grafana Admin" \
       --scope $GRAFANA_RESOURCE_ID
   ```

1. Download the [sample Java metric dashboard for Azure Container Apps](https://github.com/Azure-Samples/java-microservices-aca-lab/blob/main/dashboard/aca-java-metrics-dashboard.json) json file. 

1. Get the endpoint of the Azure Managed Grafana resource.

   ```azurecli
   az grafana show --resource-group $RESOURCE_GROUP \
      --name $GRAFANA_INSTANCE_NAME \
      --query "properties.endpoint" \
      --output tsv
   ```
   This command returns the URL you can use to access the Azure Managed Grafana dashboard. Open your browser with URL and login.

1. Go to `Dashboard` > `New` -> `Import`. Upload the above sample dashboard JSON file, and choose the default built-in `Azure Monitor` data source, then click `Import` button.

   :::image type="content" source="media/java-metrics-with-grafana/import-java-dashboard.png" alt-text="Screenshot of importing Java metric dashboard for Azure Container Apps." lightbox="media/java-metrics-with-grafana/import-java-dashboard.png":::


## Visualize Java metrics for Azure Container Apps with Grafana

1. Input your resource information in the filters for your Azure Container Apps. Now you can view all the [supported Java metrics in Azure Container Apps](java-metrics.md) within the dashboard. The sample dashboard provides live metric data, including
   - Container App Overview
   - JVM Memory Usage
   - JVM Memory Buffer
   - JVM GC JVM GC
   - A detailed JVM Memory Usage Analysis
   
   :::image type="content" source="media/java-metrics-with-grafana/grafana-overview.png" alt-text="Screenshot of Overview tab in Grafana." lightbox="media/java-metrics-with-grafana/grafana-overview.png":::

   :::image type="content" source="media/java-metrics-with-grafana/Grafana-jvm-memory.png" alt-text="Screenshot of JVM memory tab in Grafana." lightbox="media/java-metrics-with-grafana/grafana-jvm-memory.png":::

   :::image type="content" source="media/java-metrics-with-grafana/grafana-jvm-buffer.png" alt-text="Screenshot of JVM buffer memory tab in Grafana." lightbox="media/java-metrics-with-grafana/grafana-jvm-buffer.png":::

   :::image type="content" source="media/java-metrics-with-grafana/grafana-jvm-gc.png" alt-text="Screenshot of JVM GC tab in Grafana." lightbox="media/java-metrics-with-grafana/grafana-jvm-gc.png":::

   :::image type="content" source="media/java-metrics-with-grafana/grafana-jvm-memory-analysis.png" alt-text="Screenshot of JVM memory analysis tab in Grafana." lightbox="media/java-metrics-with-grafana/grafana-jvm-memory-analysis.png":::


You can use this dashboard as a starting point to create your own customized metric visualizations and monitoring solution.


## Clean up resources

The resources created in this tutorial have an effect on your Azure bill. If you aren't going to use these services long-term, run the following command to remove everything created in this tutorial.

```azurecli
az group delete --resource-group $RESOURCE_GROUP
```

## Related content

> [!div class="nextstepaction"]
> [ Java metrics for Java apps in Azure Container Apps](./java-metrics.md)