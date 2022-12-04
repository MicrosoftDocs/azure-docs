---
title: Configure self-hosted Grafana to use Azure Monitor managed service for Prometheus (preview) as data source using Azure Active Directory.
description: How to configure Azure Monitor managed service for Prometheus (preview) as data source for both Azure Managed Grafana and self-hosted Grafana using Azure Active Directory.
author: EdB-MSFT 
ms.topic: conceptual
ms.author: edbayansh
ms.date: 11/04/2022
---

# Configure self-managed Grafana to us Azure Monitor managed service for Prometheus (preview) with Azure Active Directory.

[Azure Monitor managed service for Prometheus (preview)](prometheus-metrics-overview.md) allows you to collect and analyze metrics at scale using a [Prometheus](https://aka.ms/azureprometheus-promio)-compatible monitoring solution. The most common way to analyze and present Prometheus data is with a Grafana dashboard. This article explains how to configure Prometheus as a data source for [self-hosted Grafana](https://grafana.com/) using  Azure Active Directory.  


## Azure Active Directory authentication

To set up Azure Active Directory authentication, follow the steps bellow:
1. Register an app with Azure Active Directory.
1. Grant access for the app to your Azure Monitor workspace.
1. Configure your self-hosted Grafana with the app's credentials.
## Register an app with Azure Active Directory

1. To register an app, open the Active Directory Overview page in the Azure portal.
1. Select **New registration**
1. On the Register an application page, enter a **Name** for the application.
1. Select **Register**
1. On the app's overview page, select **Certificates and Secrets**
1. Note the **Application (client) ID** and **Directory(Tenant) ID** They're used in the Grafana authentication settings.
 :::image type="content" source="./media/prometheus-selfmanaged-grafana/app-registration-overview.png" alt-text="A screenshot showing the App registration overview page.":::
1. In the Client secrets tab, select **New client secret**
1. Enter a **Description** 
1. Select an **expiry** period from the dropdown and select **Add**.
    > [!NOTE]
    > Create a process to renew the secret and update your Grafana data source settings before the secret expires. 
    > Once the secret expires Grafana will lose the ability to query data from your Azure Monitor workspace.

    :::image type="content" source="./media/prometheus-selfmanaged-grafana/add-a-client-secret.png" alt-text="A screenshot showing the Add client secret page.":::
     
1. Copy and save the client secret **Value**.
    > [!NOTE]
    > Client secret values can only be viewed immediately after creation. Be sure to save the secret before leaving the page.

    :::image type="content" source="./media/prometheus-selfmanaged-grafana/client-secret.png" alt-text="A screenshot showing the client secret page with generated secret value.":::

### Allow your app access to your workspace

Allow your app to query data from your Azure Monitor workspace.  

1. Open your Azure Monitor workspace in the Azure portal. 
1. On the Overview page, take note of your **Query endpoint**. The query endpoint will be used when setting up your Grafana data source. 
1. Select **Access control (IAM)**
:::image type="content" source="./media/prometheus-selfmanaged-grafana/workspace-overview.png" alt-text="A screenshot showing the Azure Monitor workspace overview page":::

1. Select **Add**, then **Add role assignment** from the **Access Control (IAM)** page.
1. On the Add role Assignment page, search for *Monitoring*
1. Select **Monitoring data reader**, then select the **Members** tab.
    :::image type="content" source="./media/prometheus-selfmanaged-grafana/add-role-assignment.png" alt-text="A screenshot showing the Add role assignment page":::

1. Select **Select members**
1. Search for the app that you registered in the *Register an app with Azure Active Directory* step. and select it.
1. Click **Select**
1. Select **Review + assign**
   :::image type="content" source="./media/prometheus-selfmanaged-grafana/select-members.png" alt-text="A screenshot showing the Add role assignment, select members page.":::

You've created your App registration and have assigned it access to query data from your Azure Monitor workspace. The next step is setting up your Grafana data source. 

## Configure Grafana data source

1. Sign-in to your Grafana instance.
1. On the configuration page, select the **Data sources** tab.
1. Select **Add data source**.
1. Select **Prometheus**.
1. Enter a **Name** for your Prometheus data source.
1. In the **URL** field, paste the Query endpoint vale from the workspace overview page.
1. Under **Auth** Turn on  **Azure Authentication**.
1. In the Azure Authentication section, select **App Registration** from the **Authentication** dropdown.
1. Enter the **Direct(tenant) ID**, **Application (client) ID**, and the **Client secret** from the [Register an app with Azure Active Directory](#register-an-app-with-azure-active-directory) section.
1. Select **Save & test**
    :::image type="content" source="./media/prometheus-selfmanaged-grafana/configure-grafana.png" alt-text="A screenshot showing the  Grafana settings page for adding a data source.":::
   
## Next steps
- [Collect Prometheus metrics for your AKS cluster](../essentials/prometheus-metrics-enable.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).  