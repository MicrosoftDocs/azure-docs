---
title: Use Azure Monitor managed service for Prometheus (preview) as data source for Grafana
description: Details on how to configure Azure Monitor managed service for Prometheus (preview) as data source for both Azure Managed Grafana and self-hosted Grafana in an Azure virtual machine.
author: bwren 
ms.topic: conceptual
ms.date: 09/28/2022
---

# Use Azure Monitor managed service for Prometheus (preview) as data source for self-managed Grafana 

[Azure Monitor managed service for Prometheus (preview)](prometheus-metrics-overview.md) allows you to collect and analyze metrics at scale using a [Prometheus](https://aka.ms/azureprometheus-promio)-compatible monitoring solution. The most common way to analyze and present Prometheus data is with a Grafana dashboard. This article explains how to configure Prometheus as a data source for [self-hosted Grafana](https://grafana.com/) running in an Azure virtual machine ?????? >>>>>using managed system identity authentication 
or Azure Active Directory.  

>>>>Just running in an azure virtual machine ? What not any implementation


See [Configure Azure Managed Grafana](./prometheus-grafana.md) for the manual process for adding an Azure Monitor managed service for Prometheus data source to Azure Managed Grafana.

## Managed system identity authentication 

### Configure system identity
Azure virtual machines support both system assigned and user assigned identity. The following steps configure system assigned identity.

**Configure from Azure virtual machine**<br>
Use the following steps to allow access all Azure Monitor workspaces in a resource group or subscription:

1. Open the **Identity** page for your virtual machine in the Azure portal.
2. If **Status** is **No**, change it to **Yes**.
3. Click **Azure role assignments** to review the existing access in your subscription.
4. If **Monitoring Data Reader** is not listed for your subscription or resource group:
   1. Click **+ Add role assignment**. 
   2. For **Scope**, select either **Subscription** or **Resource group**.
   3. For **Role**, select **Monitoring Data Reader**.
   4. Click **Save**.

**Configure from Azure Monitor workspace**<br>
Use the following steps to allow access to only a specific Azure Monitor workspace:

1. Open the **Access Control (IAM)** page for your Azure Monitor workspace in the Azure portal.
2. Click **Add role assignment**.
3. Select **Monitoring Data Reader** and click **Next**.
4. For **Assign access to**, select **Managed identity**.
5. Click **+ Select members**.
6. For **Managed identity**, select **Virtual machine**.
7. Select your Grafana workspace and then click **Select**.
8. Click **Review + assign** to save the configuration.




### Create Prometheus data source

Versions 9.x and greater of Grafana support Azure Authentication, but it's not enabled by default. To enable this feature, you need to update your Grafana configuration. To determine where your Grafana.ini file is and how to edit your Grafana config, please review this document from Grafana Labs. Once you know where your configuration file lives on your VM, make the following update:


1. Locate and open the *Grafana.ini* file on your virtual machine.
2. Under the `[auth]` section of the configuration file, change the `azure_auth_enabled` setting to `true`.
3. Open the **Overview** page for your Azure Monitor workspace in the Azure portal.
4. Copy the **Query endpoint**, which you'll need in a step below.
5. Open your Azure Managed Grafana workspace in the Azure portal.
6. Click on the **Endpoint** to view the Grafana workspace.
7. Select **Configuration** and then **Data source**.
8. Click **Add data source** and then **Prometheus**.
9. For **URL**,  paste in the query endpoint for your Azure Monitor workspace.
10. Select **Azure Authentication** to turn it on.
11. For **Authentication** under **Azure Authentication**, select **Managed Identity**.
12. Scroll to the bottom of the page and click **Save & test**.

:::image type="content" source="media/prometheus-grafana/prometheus-data-source.png" alt-text="Screenshot of configuration for Prometheus data source." lightbox="media/prometheus-grafana/prometheus-data-source.png":::

## Azure Active Directory authentication.

To set up Azure Active Directory (AAD) authentication:
1. Register an app with AAD.
1. Configure your self-hosted Grafana with the app's credentials.
1. Grant access for the app to you Azure Monitor workspace.

### Register an app with AAD

1. To register an app, open the Active Directory Overview page in the Azure portal.
1. Select **New registration**
1. On the Register an application page, enter a **Name** for the application.
1. Select **Register**
1. On the app's overview page, select **Certificates and Secrets**
1. Note the **Application (client) ID** and **Directory(Tenant) ID** They're used in the Grafana authentication settings .
 :::image type="content" source="./media/prometheus-selfmanaged-grafana/app-registration-overview.png" alt-text="A screenshot showing the Add client secret page.":::
1. In the Client secrets tab, select **New client secret**
1. Enter a **Description** 
1. Select an **expiry** period from the the dropdown and select **Add**.
    > [!NOTE]
    > Create a process to renew the secret and update your Grafana data source settings before the secret expires. 
    > Once the secret expires Grafana will lose the ability to query data from your Azure Monitor workspace.

    :::image type="content" source="./media/prometheus-selfmanaged-grafana/add-a-client-secret.png" alt-text="A screenshot showing the Add client secret page.":::
     
1. Copy and save the client secret **Value**.
    > [!NOTE]
    > Client secret values can only be viewed immediately after creation. Be sure to save the secret before leaving the page.

    :::image type="content" source="./media/prometheus-selfmanaged-grafana/client-secret.png" alt-text="A screenshot showing the Add client secret page.":::

### Allow your app access to your workspace

Allow your app to query data from your Azure Monitor workspace.  

1. Open your Azure Monitor workspace in the Azure Portal. 
1. On the Overview page, take note of your **Query endpoint**, this will be used when setting up your Grafana data source. 


## Next steps

- [Collect Prometheus metrics for your AKS cluster](../essentials/prometheus-metrics-enable.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
- 
- 
- mVy8Q~3x0j4FKMgxK47ELYoRdA_2M758-xXP5ciJ