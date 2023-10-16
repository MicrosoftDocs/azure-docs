---
title: Use Azure Monitor managed service for Prometheus as data source for Grafana
description: Details on how to configure Azure Monitor managed service for Prometheus as data source for both Azure Managed Grafana and self-hosted Grafana in an Azure virtual machine.
author: bwren 
ms.topic: conceptual
ms.date: 09/28/2022
---

# Use Azure Monitor managed service for Prometheus as data source for Grafana using managed system identity 

[Azure Monitor managed service for Prometheus](prometheus-metrics-overview.md) allows you to collect and analyze metrics at scale using a [Prometheus](https://aka.ms/azureprometheus-promio)-compatible monitoring solution. The most common way to analyze and present Prometheus data is with a Grafana dashboard. This article explains how to configure Prometheus as a data source for both [Azure Managed Grafana](../../managed-grafana/overview.md) and [self-hosted Grafana](https://grafana.com/) running in an Azure virtual machine using managed system identity authentication.

For information on using Grafana with Active Directory, see [Configure self-managed Grafana to use Azure Monitor managed Prometheus with Microsoft Entra ID](./prometheus-self-managed-grafana-azure-active-directory.md). 

## Azure Managed Grafana 
The following sections describe how to configure Azure Monitor managed service for Prometheus as a data source for Azure Managed Grafana.

> [!IMPORTANT]
> This section describes the manual process for adding an Azure Monitor managed service for Prometheus data source to Azure Managed Grafana. You can achieve the same functionality by linking the Azure Monitor workspace and Grafana workspace as described in [Link a Grafana workspace](./azure-monitor-workspace-manage.md#link-a-grafana-workspace).

### Configure system identity
Your Grafana workspace requires the following settings:

- System managed identity enabled
- **Monitoring Data Reader** role for the Azure Monitor workspace

Both of these settings are configured by default when you created your Grafana workspace and linked it to an Azure Monitor workspace. Verify these settings on the **Identity** page for your Grafana workspace.

:::image type="content" source="media/prometheus-grafana/grafana-system-identity.png" alt-text="Screenshot of Identity page for Azure Managed Grafana." lightbox="media/prometheus-grafana/grafana-system-identity.png":::


**Configure from Grafana workspace**<br>
Use the following steps to allow access all Azure Monitor workspaces in a resource group or subscription:

1. Open the **Identity** page for your Grafana workspace in the Azure portal.

1. If **Status** is **No**, change it to **Yes**.
1. Select **Azure role assignments** to review the existing access in your subscription.
1. If **Monitoring Data Reader** isn't listed for your subscription or resource group:
   1. Select **+ Add role assignment**. 
   1. For **Scope**, select either **Subscription** or **Resource group**.

   1. For **Role**, select **Monitoring Data Reader**.
   1. Select **Save**.


**Configure from Azure Monitor workspace**<br>
Use the following steps to allow access to only a specific Azure Monitor workspace:

1. Open the **Access Control (IAM)** page for your Azure Monitor workspace in the Azure portal.

1. Select **Add role assignment**.
1. Select **Monitoring Data Reader** and select **Next**.
1. For **Assign access to**, select **Managed identity**.
1. Select **+ Select members**.
1. For **Managed identity**, select **Azure Managed Grafana**.
1. Select your Grafana workspace and then select **Select**.
1. Select **Review + assign** to save the configuration.

### Create Prometheus data source

Azure Managed Grafana supports Azure authentication by default.

1. Open the **Overview** page for your Azure Monitor workspace in the Azure portal.

1. Copy the **Query endpoint**, which you'll need in a step below.
1. Open your Azure Managed Grafana workspace in the Azure portal.
1. Select on the **Endpoint** to view the Grafana workspace.
1. Select **Configuration** and then **Data source**.
1. Select **Add data source** and then **Prometheus**.
1. For **URL**,  paste in the query endpoint for your Azure Monitor workspace.
1. Select **Azure Authentication** to turn it on.
1. For **Authentication** under **Azure Authentication**, select **Managed Identity**.
1. Scroll to the bottom of the page and select **Save & test**.

:::image type="content" source="media/prometheus-grafana/prometheus-data-source.png" alt-text="Screenshot of configuration for Prometheus data source." lightbox="media/prometheus-grafana/prometheus-data-source.png":::


## Self-managed Grafana
The following sections describe how to configure Azure Monitor managed service for Prometheus as a data source for self-managed Grafana on an Azure virtual machine.
### Configure system identity
Azure virtual machines support both system assigned and user assigned identity. The following steps configure system assigned identity.

**Configure from Azure virtual machine**<br>
Use the following steps to allow access all Azure Monitor workspaces in a resource group or subscription:

1. Open the **Identity** page for your virtual machine in the Azure portal.

1. If **Status** is **No**, change it to **Yes**.
1. Select **Save**.
1. Select **Azure role assignments** to review the existing access in your subscription.
1. If **Monitoring Data Reader** isn't listed for your subscription or resource group:
   1. Select **+ Add role assignment**. 

   1. For **Scope**, select either **Subscription** or **Resource group**.
   1. For **Role**, select **Monitoring Data Reader**.
   1. Select **Save**.

**Configure from Azure Monitor workspace**<br>
Use the following steps to allow access to only a specific Azure Monitor workspace:

1. Open the **Access Control (IAM)** page for your Azure Monitor workspace in the Azure portal.

1. Select **Add role assignment**.
1. Select **Monitoring Data Reader** and select **Next**.
1. For **Assign access to**, select **Managed identity**.
1. Select **+ Select members**.
1. For **Managed identity**, select **Virtual machine**.
1. Select your Grafana workspace and then click **Select**.
1. Select **Review + assign** to save the configuration.




### Create Prometheus data source

Versions 9.x and greater of Grafana support Azure Authentication, but it's not enabled by default. To enable this feature, you need to update your Grafana configuration. To determine where your Grafana.ini file is and how to edit your Grafana config, review the [Configure Grafana](https://grafana.com/docs/grafana/v9.0/setup-grafana/configure-grafana/) document from Grafana Labs. Once you know where your configuration file lives on your VM, make the following update:


1. Locate and open the *Grafana.ini* file on your virtual machine.  

1. Under the `[auth]` section of the configuration file, change the `azure_auth_enabled` setting to `true`.
1. Under the `[azure]` section of the configuration file, change the `managed_identity_enabled` setting to `true`
1. Open the **Overview** page for your Azure Monitor workspace in the Azure portal.
1. Copy the **Query endpoint**, which you'll need in a step below.
1. Open your Azure Managed Grafana workspace in the Azure portal.
1. Click on the **Endpoint** to view the Grafana workspace.
1. Select **Configuration** and then **Data source**.
1. Click **Add data source** and then **Prometheus**.
1. For **URL**,  paste in the query endpoint for your Azure Monitor workspace.
1. Select **Azure Authentication** to turn it on.
1. For **Authentication** under **Azure Authentication**, select **Managed Identity**.
1. Scroll to the bottom of the page and click **Save & test**.

:::image type="content" source="media/prometheus-grafana/prometheus-data-source.png" alt-text="Screenshot of configuration for Prometheus data source." lightbox="media/prometheus-grafana/prometheus-data-source.png":::



## Next steps
- [Configure self-managed Grafana to use Azure-managed Prometheus with Microsoft Entra ID](./prometheus-self-managed-grafana-azure-active-directory.md).
- [Collect Prometheus metrics for your AKS cluster](../essentials/prometheus-metrics-enable.md).
- [Configure Prometheus alerting and recording rules groups](prometheus-rule-groups.md).
- [Customize scraping of Prometheus metrics](prometheus-metrics-scrape-configuration.md).
