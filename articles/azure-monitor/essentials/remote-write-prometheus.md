---
title: Remote-write Prometheus metrics to Azure Monitor managed service for Prometheus
description: Describes how customers can configure remote-write to send data from self-managed Prometheus running in any environment to Azure Monitor managed service for Prometheus
author: bwren 
ms.topic: conceptual
ms.date: 02/12/2024
---

# Prometheus Remote-Write to Azure Monitor Workspace

Azure Monitor managed service for Prometheus is intended to be a replacement for self-managed Prometheus so you don't need to manage a Prometheus server in your Kubernetes clusters. You may also choose to use the managed service to centralize data from self-managed Prometheus clusters for long term data retention and to create a centralized view across your clusters.
In case you're using self-managed Prometheus, you can use [remote_write](https://prometheus.io/docs/operating/integrations/#remote-endpoints-and-storage) to send data from your self-managed Prometheus into the Azure managed service.

For sending data from self-managed Prometheus running on your environments to Azure Monitor workspace, follow the steps in this document.

## Choose the right solution for remote-write

Based on where your self-managed Prometheus is running, choose from the options below:

- **Self-managed Prometheus running on Azure Kubernetes Services (AKS) or Azure VM/VMSS**: Follow the steps in this documentation for configuring remote-write in Prometheus using User-assigned managed identity authentication.
- **Self-managed Prometheus running on non-Azure environments**: Azure Monitor managed service for Prometheus has a managed offering for supported [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/overview.md). However, if you wish to send data from self-managed Prometheus running on non-Azure or on-premises environments, consider the following options:
    - Onboard supported Kubernetes or VM/VMSS to [Azure Arc-enabled Kubernetes](../../azure-arc/kubernetes/overview.md) / [Azure Arc-enabled servers](../../azure-arc/servers/overview.md) which will allow you to manage and configure them in Azure. Then follow the steps in this documentation for configuring remote-write in Prometheus using User-assigned managed identity authentication.
    - For all other scenarios, follow the steps in this documentation for configuring remote-write in Prometheus using Azure Entra application.

> [!NOTE]
> Currently user-assigned managed identity and Azure Entra application are the authentication methods supported for remote-writing to Azure Monitor Workspace. If you're using other authentication methods and running self-managed Prometheus on **Kubernetes**, Azure Monitor provides a reverse proxy container that provides an abstraction for ingestion and authentication for Prometheus remote-write metrics. Please see [remote-write from Kubernetes to Azure Monitor Managed Service for Prometheus](../containers/prometheus-remote-write.md) to use this reverse proxy container.

## Prerequisites

- You must have [self-managed Prometheus](https://prometheus.io/) running on your environment. Supported versions are:
    - For managed identity, versions greater than v2.45
    - For Azure Entra, versions greater than v2.48
- Azure Monitor managed service for Prometheus stores metrics in [Azure Monitor workspace](./azure-monitor-workspace-overview.md). To proceed, you need to have an Azure Monitor Workspace instance. [Create a new workspace](./azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace) if you don't already have one.

## Configure Remote-Write to send data to Azure Monitor Workspace

You can enable remote-write by configuring one or more remote-write sections in the Prometheus configuration file. Details about the Prometheus remote write setting can be found [here](https://prometheus.io/docs/practices/remote_write/).

The **remote_write** section in the Prometheus configuration file defines one or more remote-write configurations, each of which has a mandatory url parameter and several optional parameters. The url parameter specifies the HTTP URL of the remote endpoint that implements the Prometheus remote-write protocol. In this case, the URL is the metrics ingestion endpoint for your Azure Monitor Workspace. The optional parameters can be used to customize the behavior of the remote-write client, such as authentication, compression, retry, queue, or relabeling settings. For a full list of the available parameters and their meanings, see the Prometheus documentation: [https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write).

To send data to your Azure Monitor Workspace, you'll need the following information:

- **Remote-write URL**: This is the metrics ingestion endpoint of the Azure Monitor workspace. To find this, go to the Overview page of your Azure Monitor Workspace instance in Azure portal, and look for the Metrics ingestion endpoint property.

    :::image type="content" source="media/azure-monitor-workspace-overview/remote-write-ingestion-endpoint.png" lightbox="media/azure-monitor-workspace-overview/remote-write-ingestion-endpoint.png" alt-text="Screenshot of Azure Monitor workspaces menu and ingestion endpoint.":::

- **Authentication settings**: Currently **User-assigned managed identity** and **Azure Entra application** are the authentication methods supported for remote-writing to Azure Monitor Workspace. Note that for Azure Entra application, client secrets have an expiration date and it's the responsibility of the user to keep secrets valid.

### User-assigned managed identity

1. Create a managed identity and then add a role assignment for the managed identity to access your environment. For details, see [Manage user-assigned managed identities](../../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md).
1. Assign the Monitoring Metrics Publisher role on the workspace data collection rule to the managed identity:
    1. The managed identity must be assigned the **Monitoring Metrics Publisher** role on the data collection rule that is associated with your Azure Monitor Workspace.
    1. On the resource menu for your Azure Monitor workspace, select Overview. Select the link for Data collection rule:

    :::image type="content" source="media/azure-monitor-workspace-overview/remote-write-dcr.png" lightbox="media/azure-monitor-workspace-overview/remote-write-dcr.png" alt-text="Screenshot of how to navigate to the data collection rule.":::

    1. On the resource menu for the data collection rule, select **Access control (IAM)**. Select Add, and then select Add role assignment.
    1. Select the **Monitoring Metrics Publisher role**, and then select **Next**.
    1. Select Managed Identity, and then choose Select members. Select the subscription that contains the user-assigned identity, and then select User-assigned managed identity. Select the user-assigned identity that you want to use, and then choose Select.
    1. To complete the role assignment, select **Review + assign**.

1. Give the AKS cluster or the resource access to the managed identity. This step isn't required if you're using an AKS agentpool user assigned managed identity or VM system assigned identity. An AKS agentpool user assigned managed identity or VM identity already has access to the cluster/VM.

> [!IMPORTANT]
> To complete the steps in this section, you must have owner or user access administrator permissions for the cluster/resource.

#### For AKS: Give the AKS cluster access to the managed identity

- Identify the virtual machine scale sets in the node resource group for your AKS cluster. The node resource group of the AKS cluster contains resources that you use in other steps in this process. This resource group has the name "MC_*aks-resource-group_clustername_region*". You can find the resource group name by using the Resource groups menu in the Azure portal.

    :::image type="content" source="../containers/media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png" alt-text="Screenshot that shows virtual machine scale sets in the node resource group." lightbox="../containers/media/prometheus-remote-write-managed-identity/resource-group-details-virtual-machine-scale-sets.png":::

- For each virtual machine scale set, run the following command in the Azure CLI:

    ```azurecli
    az vmss identity assign -g <AKS-NODE-RESOURCE-GROUP> -n <AKS-VMSS-NAME> --identities <USER-ASSIGNED-IDENTITY-RESOURCE-ID>
    ```

#### For VM: Give the VM access to the managed identity

- For virtual machine, run the following command in the Azure CLI:

    ```azurecli
    az vm identity assign -g <VM-RESOURCE-GROUP> -n <VM-NAME> --identities <USER-ASSIGNED-IDENTITY-RESOURCE-ID>
    ```

If you're using other Azure resource types, please refer public documentation for the Azure resource type to assign managed identity similar to steps mentioned above for VMs/VMSS.

### Azure Entra application

The process to set up Prometheus remote write for an application by using Microsoft Entra authentication involves completing the following tasks:

1. Complete the steps to [register an application with Microsoft Entra ID](../../active-directory/develop/howto-create-service-principal-portal.md#register-an-application-with-azure-ad-and-create-a-service-principal) and create a service principal.

1. Get the client ID and secret ID of the Microsoft Entra application. In the Azure portal, go to the **Microsoft Entra ID** menu and select **App registrations**.
1. In the list of applications, copy the value for **Application (client) ID** for the registered application.

:::image type="content" source="../containers/media/prometheus-remote-write-active-directory/application-client-id.png" alt-text="Screenshot that shows the application or client ID of a Microsoft Entra application." lightbox="../containers/media/prometheus-remote-write-active-directory/application-client-id.png":::

1. Open the **Certificates and Secrets** page of the application, and click on **+ New client secret** to create a new Secret. Copy the value of the secret securely.

> [!WARNING]
> Client secrets have an expiration date. It's the responsibility of the user to keep them valid.

1. Assign the **Monitoring Metrics Publisher** role on the workspace data collection rule to the application. The application must be assigned the Monitoring Metrics Publisher role on the data collection rule that is associated with your Azure Monitor workspace.
1. On the resource menu for your Azure Monitor workspace, select **Overview**. For **Data collection rule**, select the link.

    :::image type="content" source="../containers/media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png" alt-text="Screenshot that shows the data collection rule that's used by Azure Monitor workspace." lightbox="../containers/media/prometheus-remote-write-managed-identity/azure-monitor-account-data-collection-rule.png":::

1. On the resource menu for the data collection rule, select **Access control (IAM)**.

1. Select **Add**, and then select **Add role assignment**.

    :::image type="content" source="../containers/media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png" alt-text="Screenshot that shows adding a role assignment on Access control pages." lightbox="../containers/media/prometheus-remote-write-managed-identity/data-collection-rule-add-role-assignment.png":::

1. Select the **Monitoring Metrics Publisher** role, and then select **Next**.

    :::image type="content" source="../containers/media/prometheus-remote-write-managed-identity/add-role-assignment.png" alt-text="Screenshot that shows a list of role assignments." lightbox="../containers/media/prometheus-remote-write-managed-identity/add-role-assignment.png":::

1. Select **User, group, or service principal**, and then choose **Select members**. Select the application that you created, and then choose **Select**.

    :::image type="content" source="../containers/media/prometheus-remote-write-active-directory/select-application.png" alt-text="Screenshot that shows selecting the application." lightbox="../containers/media/prometheus-remote-write-active-directory/select-application.png":::

1. To complete the role assignment, select **Review + assign**.

## Configure remote-write

Now, that you have the required information, configure the following section in the Prometheus.yml config file of your self-managed Prometheus instance to send data to your Azure Monitor Workspace.

```yaml
remote_write:   
  url: "<<Metrics Ingestion Endpoint for your Azure Monitor Workspace>>"
# AzureAD configuration.
# The Azure Cloud. Options are 'AzurePublic', 'AzureChina', or 'AzureGovernment'.
  azuread:
    cloud: 'AzurePublic'
    managed_identity:
      client_id: "<<client-id of the managed identity>>"
    oauth:
      client_id: "<<client-id of the app>>"
      client_secret: "<<client secret>>"
      tenant_id: "<<tenant id of Azure subscription>>"
```

Replace the values in the YAML with the values that you copied in the previous steps. If you're using Managed Identity authentication, then you can skip the **"oauth"** section of the yaml. And similarly, if you're using Azure Entra as the authentication method, you can skip the **"managed_identity"** section of the yaml.

After editing the configuration file, you need to reload or restart Prometheus to apply the changes.

## Verify if the remote-write is setup correctly

Use the following methods to verify that Prometheus data is being sent into your Azure Monitor workspace.

### PromQL queries

Use PromQL queries in Grafana and verify that the results return expected data. See [getting Grafana setup with Managed Prometheus](../essentials/prometheus-grafana.md) to configure Grafana.

### Prometheus explorer in Azure Monitor Workspace

Go to your Azure Monitor workspace in the Azure portal and click on Prometheus Explorer to query the metrics that you're expecting from the self-managed Prometheus environment.

## Troubleshoot remote write

You can look at few remote write metrics that can help understand possible issues. A list of these metrics can be found [here](https://github.com/prometheus/prometheus/blob/v2.26.0/storage/remote/queue_manager.go#L76-L223) and [here](https://github.com/prometheus/prometheus/blob/v2.26.0/tsdb/wal/watcher.go#L88-L136).

For example, *prometheus_remote_storage_retried_samples_total* could indicate problems with the remote setup if there's a steady high rate for this metric, and you can contact support if such issues arise.

### Hitting your ingestion quota limit

With remote write you'll typically get started using the remote write endpoint shown on the Azure Monitor workspace overview page. Behind the scenes, this uses a system Data Collection Rule (DCR) and system Data Collection Endpoint (DCE). These resources have an ingestion limit covered in the [Azure Monitor service limits](../service-limits.md#prometheus-metrics) document. You may hit these limits if you set up remote write for several clusters all sending data into the same endpoint in the same Azure Monitor workspace. If this is the case you can [create additional DCRs and DCEs](https://aka.ms/prometheus/remotewrite/dcrartifacts) and use them to spread out the ingestion loads across a few ingestion endpoints.

The INGESTION-URL uses the following format: 
https\://\<**Metrics-Ingestion-URL**>/dataCollectionRules/\<**DCR-Immutable-ID**>/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2021-11-01-preview 

**Metrics-Ingestion-URL**: can be obtained by viewing DCE JSON body with API version 2021-09-01-preview or newer. See screenshot below for reference.

:::image type="content" source="../containers/media/prometheus-remote-write-managed-identity/dce-ingestion-url.png" alt-text="Screenshot showing how to get the metrics ingestion URL." lightbox="../containers/media/prometheus-remote-write-managed-identity/dce-ingestion-url.png":::

**DCR-Immutable-ID**: can be obtained by viewing DCR JSON body or running the following command in the Azure CLI: 

```azureccli
az monitor data-collection rule show --name "myCollectionRule" --resource-group "myResourceGroup" 
```

## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](./prometheus-metrics-overview.md).
- [Learn more about Azure Monitor reverse proxy side car for remote-write from self-managed Prometheus running on Kubernetes](../containers/prometheus-remote-write.md)
