---
title: Overview of Azure Monitor Managed Service for Prometheus (preview)
description: Overview of Azure Monitor managed service for Prometheus, which provides a Prometheus-compatible interface for storing and retrieving metric data.
author: bwren 
ms.topic: conceptual
ms.date: 09/28/2022
---

# Configure Prometheus metrics as a data source for Grafana



- Create your system assigned identity.
- Assign the *Monitoring Data Reader* role to the system assigned identity.
- Enable Azure authentication in your Grafana configuration.
- Add a Prometheus data source in Grafana that uses your Azure Monitor workspace. 

## Azure Managed Grafana with system identity 
Your Grafana workspace requires the following:

- System managed identity enabled
- *Monitoring Data Reader* role for the Azure Monitor workspace

Both of these settings are configured by default when you created your Grafana workspace. Verify these settings on the **Identity** page for your Grafana workspace.

:::image type="content" source="media/prometheus-grafana/grafana-system-identity.png" alt-text="Screenshot of Identity page for Azure Managed Grafana." lightbox="media/prometheus-grafana/grafana-system-identity.png":::


### Assign access from Grafana workspace
Use the following steps to allow access all Azure Monitor workspaces in a resource group or subscription:

1. Open the **Identity** page for your Grafana workspace in the Azure portal.
2. If **Status** isd **No**, change it to **Yes**.
3. Click **Azure role assignments** to review the existing access in your subscription.
4. If **Monitoring Data Reader** is not listed for your subscription or resource gropup:
   1. Click **+ Add role assignment**. 
   2. For **Scope**, select either **Subscription** or **Resource group**.
   3. For **Role**, select **Monitoring Data Reader**.
   4. Click **Save**.


### Assign access from Azure Monitor workspace
Use the following steps to allow access to only a specific Azure Monitor workspace:

1. Open the **Access Control (IAM)** page for your Azure Monitor workspace in the Azure portal.
2. Click **Add role assignment**.
3. Select **Monitoring Data Reader** and click **Next**.
4. For **Assign access to**, select **Managed identity**.
5. Click **+ Select members**.
6. For **Managed identity**, select **Azure Managed Grafana**.
7. Select your Grafana workspace and then click **Select**.
8. Click **Review + assign** to save the configuration.


## System assigned identity for self managed Grafana on an Azure virtual machine

Azure VMs support both System assigned and User assigned identity. We will cover how to use System Assigned identity to enable self-managed Grafana on your Azure VM to query data from your Azure Monitor workspace.

### Assign access from Azure virtual machine
Use the following steps to allow access all Azure Monitor workspaces in a resource group or subscription:

1. Open the **Identity** page for your virtual machine in the Azure portal.
2. If **Status** isd **No**, change it to **Yes**.
3. Click **Azure role assignments** to review the existing access in your subscription.
4. If **Monitoring Data Reader** is not listed for your subscription or resource gropup:
   1. Click **+ Add role assignment**. 
   2. For **Scope**, select either **Subscription** or **Resource group**.
   3. For **Role**, select **Monitoring Data Reader**.
   4. Click **Save**.

### Assign access from Azure Monitor workspace
Use the following steps to allow access to only a specific Azure Monitor workspace:

1. Open the **Access Control (IAM)** page for your Azure Monitor workspace in the Azure portal.
2. Click **Add role assignment**.
3. Select **Monitoring Data Reader** and click **Next**.
4. For **Assign access to**, select **Managed identity**.
5. Click **+ Select members**.
6. For **Managed identity**, select **Virtual machine**.
7. Select your Grafana workspace and then click **Select**.
8. Click **Review + assign** to save the configuration.


## Create managed Prometheus data source in Azure Managed Grafana

Azure Managed Grafana supports Azure authentication by default. Follow these steps to get setup:

1. Open the **Overview** page for your Azure Monitor workspace in the Azure portal.
2. Copy the **Query endpoint**, which you'll need in a step below.
3. Open your Azure Managed Grafana workspace in the Azure portal.
4. Click on the **Endpoint** to view the Grafana workspace.
5. Select **Configuration** and then **Data source**.
6. Click **Add data source** and then **Prometheus**.
7. For **URL**,  paste in the query endpoint for your Azure Monitor workspace.
8. Select **Azure Authentication** to turn it on.
9. For **Authentication** under **Azure Authentication**, select **Managed Identity**.
10. Scroll to the bottom of the page and click **Save & test**.

:::image type="content" source="media/prometheus-grafana/prometheus-data-source.png" alt-text="Screenshot of configuration for Prometheus data source." lightbox="media/prometheus-grafana/prometheus-data-source.png":::


## Create managed Prometheus data source for self managed Grafana on an Azure virtual machine

Versions 9.x and greater of Grafana support Azure Authentication, but it's not enabled by default. To enable this feature, you need to update your Grafana configuration. To deteremine where your Grafana.ini file is and how to edit your Grafana config, please review this document from Grafana Labs. Once you know where your configuration file lives on your VM, make the following update:




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



## Next steps

- [Collect Prometheus metrics for your AKS cluster](../containers/container-insights-prometheus-metrics-addon.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
