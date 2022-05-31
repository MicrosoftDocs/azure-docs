---
title: 'Troubleshoot Azure Managed Grafana: data sources'
description: Troubleshoot Azure Managed Grafana issues. Azure Managed Grafana dashboard displays no data, data won't load, missing Azure Monitor data, and missing Azure Data Explorer Data.
author: maud-lv
ms.author: malev
ms.topic: troubleshooting
ms.service: managed-grafana
ms.date: 05/30/2022
---

# Troubleshoot Azure Managed Grafana: issues with fetching data

This article guides you to troubleshoot errors with Azure Managed Grafana dashboard displaying no data, and suggests solutions to resolve them. This article shows a generic scenario, an example with missing Azure Monitor data and missing Azure Data Explorer Data.

## Azure Managed Grafana dashboard panel displays no data

The user has one or several dashboard panels that display no data.

### Solution: review your dashboard settings

Context: Grafana dashboards are configured to fetch new data periodically. If the dashboard is refreshed too often for the underlying query to load, the panel will be stuck without ever being able to load and display data.

1. Check how frequently the dashboard is configured to refresh data?
   1. In your dashboard, go to **Dashboard settings**.
   1. In the general settings, lower the **Auto refresh** rate of the dashboard to be no faster than the time the query takes to load.
1. When a query takes too long to retrieve data. Grafana will automatically time out certain dependency calls that take longer than, for example, 30 seconds. Check that there are no unusual slow-downs on the query's end.

## Azure Monitor data source can't fetch data

Every Grafana instance comes pre-configured with an Azure Monitor data source. The user tries the pre-provisioned dashboards and finds that the Azure Monitor data source can't fetch data.

### Solution: review your Azure Monitor Data settings

1. Find a pre-provisioned dashboard by opening your Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select a dashboard, for example **Azure Monitor** > **Azure App monitoring - Application Insights**.
1. Make sure the dropdowns near the top are populated with a subscription, resource group and resource name. In the screenshot example below, the **Resource** dropdown is set to null. In this case, select a resource name. You may need to select another resource group that contains a type of resource the dashboard was designed for. In this example, you need to pick a resource group that has an Application Insights resource.

      :::image type="content" source="media/troubleshooting-dashboard-resource.png" alt-text="Screenshot of the Azure platform: Checking dashboard information":::

1. Check the Azure Monitor data source and see how the authentication is configured.

   image.png

   1. In your Managed Grafana endpoint, select **Configurations** in the left menu and select **Data Sources**.
   1. Select **Azure Monitor**

1. If the data source uses Managed Identity, then:

   1. Select the **Load Subscriptions** button to make a quick test. If **Default Subscription** is populated with your subscription, Managed Grafana can access Azure Monitor within this subscription. If not, then there are permission issues.

      :::image type="content" source="media/troubleshooting-load-subscriptions.png" alt-text="Screenshot of the Azure platform: Load subscriptions":::

   1. Check if the system assigned managed identity option is turned on in the Azure portal. If not, turn it on manually:
      1. Open your Managed Grafana instance in the Azure portal.
      1. In the left menu, under **Settings**, select **Identity**.
      1. Select **Status**: **On** and select **Save**

      :::image type="content" source="media/troubleshooting-managed-identity.png" alt-text="Screenshot of the Azure platform: Turn on system-assigned managed identity" lightbox="media/troubleshooting-managed-identity-expanded.png":::

   1. Check if the managed identity has the Monitoring Reader role assigned to the Managed Grafana instance. If not, add it manually from the Azure portal:
      1. Open your Managed Grafana instance in the Azure portal.
      1. In the left-menu, under **Settings**, select **Identity**.
      1. Select **Azure role assignments**.
      1. There should be a **Monitoring Reader** role displayed, assigned to your Managed Grafana instance. If not, select Add role assignment and add the **Monitoring Reader** role.

      :::image type="content" source="media/troubleshooting-add-role-assignment.png" alt-text="Screenshot of the Azure platform: Adding role assignment":::

1. If the data source uses an **App Registration** authentication:
   1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Monitor** and check if the information for **Directory (tenant) ID** and **Application (client) ID** is correct.
   1. Check if the service principal has the Monitoring Reader role assigned to the Managed Grafana instance. If not, add it manually from the Azure portal.
   1. If needed, reapply the Client Secret

      :::image type="content" source="media/troubleshooting-app-registration-authentication.png" alt-text="Screenshot of the Azure platform: Check app registration authentication details":::

## Azure Data Explorer data source can't fetch data

The user finds that the Azure Monitor data source can't fetch data.

### Solution: review your Azure Data Explorer settings

1. Find a pre-provisioned dashboard by opening your Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select a dashboard, for example **Azure Monitor** > **Azure Data Explorer Cluster Resource Insights**.
1. Make sure the dropdowns near the top are populated with a data source, subscription, resource group, name space, resource, and workspace. In the screenshot example below, we chose a resource group that doesn't contain any Data Explorer cluster. In this case, select another resource group that contains a Data Explorer cluster.

      :::image type="content" source="media/troubleshooting-dashboard-data-explorer.png" alt-text="Screenshot of the Azure platform: Checking dashboard information for Azure Data Explorer":::

1. Check the Azure Data Explorer data source and see how authentication is configured. You can currently only configure authentication for Azure Data Explorer through Azure Active Directory (Azure AD).
1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Data Explorer**
1. Check if the information listed for **Azure cloud**, **Cluster URL**, **Directory (tenant) ID**, **Application (client) ID**, and **Client secret** is correct. If needed, create a new key to add as a client secret.
1. At the top of the page, you can find instructions guiding you through the process to grant necessary permissions to this Azure AD app to read the Azure Data Explorer database.
1. Make sure that your Azure Data Explorer instance doesn't have a firewall that blocks access to Managed Grafana. The Azure Data Explorer database needs to be exposed to the public internet.

## Next steps

> [!div class="nextstepaction"]
> [Configure data sources](./how-to-data-source-plugins-managed-identity.md)
