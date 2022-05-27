---
title: Troubleshooting Azure Managed Grafana
description: Azure Data Explorer data source cannot fetch data
author: maud-lv
ms.author: malev
ms.topic: troubleshooting
ms.service: managed-grafana
ms.date: 05/30/2022
---

# Troubleshooting Azure Managed Grafana issues

This article guides you to troubleshoot Azure Monitor configuration errors that might occur when you set up Azure Managed Grafana instances, and suggests ways to resolve them.

## Error: Azure Monitor data source cannot fetch data

Every Grafana instance comes pre-configured with an Azure Monitor data source. The customer tries the pre-provisioned dashboards and finds that the Azure Monitor data source cannot fetch data.

## Solution: audit your Monitor Data settings

1. Find a pre-provisioned dashboard by opening your Managed Grafana endpoint and selecting **Dashboards** > **Browse**. Then select one of your Dashboards, for example **Azure Monitor** > **Azure App monitoring - Application Insights**.
1. Make sure the dropdowns near the top are populated with a subscription, resource group and resource name. In the screenshot example below, the **Resource** dropdown is set to null. In this case, select a resource name. You may need to select another resource group that contains a type of resource the dashboard was designed for. In this example, you need to pick a resource group that has an Application Insights resource.

      :::image type="content" source="media/troubleshooting-dashboard-resource.png" alt-text="Screenshot of the Azure platform: Checking dashboard information":::

1. Check the Azure Monitor data source and see how the authentication is configured.

   image.png

   1. In your Managed Grafana endpoint, select **Configurations** in the left menu and select **Data Sources**.
   1. Select **Azure Monitor**

1. If the data source uses Managed Identity, then:

   1. Select the **Load Subscriptions** button to make a quick test. If **Default Subscription** is populated with your subscription, Managed Grafana can access Azure Monitor within this subscription. If not, then there are permission issues.

      :::image type="content" source="media/troubleshooting-load-subscriptions.png" alt-text="Screenshot of the Azure platform: Load subscriptions":::

   1. Check if the system assigned managed identity option is turned on in the Azure Portal. If not, turn it on manually:
      1. Open your Managed Grafana instance in the Azure portal.
      1. In the left menu, under **Settings**, select **Identity**.
      1. Select **Status**: **On** and click **Save**

      :::image type="content" source="media/troubleshooting-managed-identity.png" alt-text="Screenshot of the Azure platform: Turn on system-assigned managed identity":::

   1. Check if the managed identity has the Monitoring Reader role role assigned to the Managed Grafana instance. If not, add it manually from the Azure portal:
      1. Open your Managed Grafana instance in the Azure portal.
      1. In the left-menu, under **Settings**, select **Identity**.
      1. Select **Azure role assignments**.
      1. There should be a **Monitoring Reader** role displayed, assigned to your Managed Grafana instance. If not, select Add role assignment and add the **Monitoring Reader** role.

      :::image type="content" source="media/troubleshooting-add-role-assignment.png" alt-text="Screenshot of the Azure platform: Adding role assignment":::

1. If the data source uses an **App Registration** authentication:
   1. In your Grafana endpoint, go to **Configurations > Data Sources > Azure Monitor** and check if the information for **Directory (tenant) ID** and **Application (client) ID** is correct.
   1. Check if the service principal has the Monitoring Reader role assigned to the Managed Grafana instance. If not, add it manually from the Azure portal.
   1. If needed, reapply the Client Secret in the data source configuration page in Grafana.

      :::image type="content" source="media/troubleshooting-app-registration-authentication.png" alt-text="Screenshot of the Azure platform: Check app registration authentication details":::
