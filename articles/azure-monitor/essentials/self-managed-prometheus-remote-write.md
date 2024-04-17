---
title: Self-managed Prometheus remote-write to an Azure Monitor workspace
description: How to configure remote-write to send data from self-managed Prometheus to an Azure Monitor managed service for Prometheus
author: bwren 
ms.topic: conceptual
ms.date: 04/15/2024

#customer intent: As an azure administrator, I want to send Prometheus metrics from my self-managed Prometheus instance to an Azure Monitor workspace.

---

# Send Prometheus metrics for Virtual Machines to an Azure Monitor workspace

Prometheus isn't limited to monitoring Kubernetes clusters. Use Prometheus to monitor applications and services running on your servers, wherever they're running. For example, you can monitor applications running on Virtual Machines, Virtual Machine Scale Sets, or even on-premises servers. Install prometheus on your servers and configure remote-write to send metrics to an Azure Monitor workspace.

This article explains how to configure remote-write to send data from a self-managed Prometheus instance to an Azure Monitor workspace.


## Remote write options

Self-managed Prometheus can run on Azure and non-Azure environments. The following are authentication options for remote-write to Azure Monitor workspace based on the environment where Prometheus is running.

#### Azure managed Virtual Machines and Virtual Machine Scale Sets

Use user-assigned managed identity authentication for services running self managed Prometheus in an Azure environment. Azure managed services include the following:

- Azure Virtual Machines
- Azure Virtual Machine Scale Sets
- Azure Arc-enabled Virtual Machines

To set up remote write for Azure managed resources, see [Remote-write with user-assigned managed identity](#remote-write-with-user-assigned-managed-identity).


#### Virtual machines running on non-Azure environments.

Onboarding to Azure Arc-enabled services, allows you to manage and configure non-Azure virtual machines in Azure. Once onboarded, configure [remote-write using user-assigned managed identity](#remote-write-with-user-assigned-managed-identity) authentication. For more Information on onboarding Virtual Machines to Azure Arc-enabled servers, see [Azure Arc-enabled servers](/azure/azure-arc/servers/overview). 

If you have virtual machines in non-Azure environments, and you don't want to onboard to Azure Arc, install self-managed Prometheus and configure remote-write using Microsoft Entra ID application authentication. For more information, see [Microsoft Entra ID application](#azure-entra-application).
 

#### Kubernetes services

Azure Kubernetes Services (AKS) and Azure Arc-enabled Kubernetes support Azure Monitor managed service for Prometheus. If you prefer self-managed Prometheus, see the following article for more information on remote-write to Azure Monitor workspaces.
-  [Send Prometheus data to Azure Monitor by using managed identity authentication](/azure/azure-monitor/containers/prometheus-remote-write-managed-identity)

- [Remote-write using Azure Monitor sidecar](/azure/azure-monitor/containers/prometheus-remote-write)
-[Microsoft Entra ID authorization proxy](/azure/azure-monitor/containers/prometheus-authorization-proxy?tabs=remote-write-example)
- [Send Prometheus data from AKS to Azure Monitor by using managed identity authentication](/azure/azure-monitor/containers/prometheus-remote-write-managed-identity)
- [Send Prometheus data from AKS to Azure Monitor by using Microsoft Entra ID authentication](/azure/azure-monitor/containers/prometheus-remote-write-active-directory)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra ID pod-managed identity (preview) authentication](/azure/azure-monitor/containers/prometheus-remote-write-azure-ad-pod-identity)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra ID Workload ID (preview) authentication](/azure/azure-monitor/containers/prometheus-remote-write-azure-workload-identity)


   
???? What other authentication methods????
If you're using other authentication methods and running self-managed Prometheus on Kubernetes, Azure Monitor provides a reverse proxy container that provides an abstraction for ingestion and authentication for Prometheus remote-write metrics. For more information, see [remote-write from Kubernetes to Azure Monitor Managed Service for Prometheus](../containers/prometheus-remote-write.md).

## Prerequisites

### Supported versions

- Prometheus versions greater than v2.45 are required for managed identity authentication.
- Prometheus versions greater than v2.48 are required for Microsoft Entra ID application authentication. 

### Azure Monitor workspace
This article covers sending Prometheus metrics to an Azure Monitor workspace. To create an Azure monitor workspace, see [Manage an Azure Monitor workspace](./azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace#create-an-azure-monitor-workspace).

Administrator permissions for the cluster or resource are required to complete the steps in this article.


## Set up authentication for remote-write

Depending on the environment where Prometheus is running, you can use one of the following authentication methods to configure remote-write to send data to Azure Monitor workspace.

### [Remote-write with user-assigned managed identity](#tab/managed-identity)

To configure a user-assigned managed identity for remote-write to Azure Monitor workspace, complete the following steps.

1. Create a user-managed identity to use in your remote-write configuration. For more information, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 
1. Note the value of the **Client ID** of the user-assigned managed identity that you created. This ID is used in the Prometheus remote write configuration. 


1. Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the managed identity. 
    1. On the Azure Monitor workspace Overview page, select the **Data collection rule** link.

    :::image type="content" source="media/self-managed-prometheus-remote-write/select-data-collection-rule.png" lightbox="media/self-managed-prometheus-remote-write/select-data-collection-rule.png" alt-text="A screenshot showing the data collection rule link on an Azure Monitor workspace page.":::

    1. On the data collection rule page, select **Access control (IAM)**. 

    1. Select **Add**, and **Add role assignment**.
      :::image type="content" source="media/self-managed-prometheus-remote-write/data-collection-rule-access-control.png" lightbox="media/self-managed-prometheus-remote-write/data-collection-rule-access-control.png" alt-text="A screenshot showing the data collection rule.":::
    1. Select for *Monitoring Metrics Publisher*, and then select **Next**.
        :::image type="content" source="media/self-managed-prometheus-remote-write/add-role-assignment.png" lightbox="media/self-managed-prometheus-remote-write/add-role-assignment.png" alt-text="A screenshot showing the role assignment menu for a data collection rule.":::
    1. Select **Managed Identity**.
    1. Select **Select members**. 
    1. In the **Managed Entity** dropdown, *User-assigned managed identity*. 
    1. Select the user-assigned identity that you want to use, then click **Select**.
    1. Select **Review + assign** to complete the role assignment.
    
    :::image type="content" source="media/self-managed-prometheus-remote-write/select-members.png" lightbox="media/self-managed-prometheus-remote-write/select-members.png" alt-text="A screenshot showing the select members menu for a data collection rule.":::

1. Assign the managed identity to a Virtual Machine or Virtual Machine Scale Set.

    > [!IMPORTANT]
    > To complete the steps in this section, you must have owner or user access administrator permissions for the cluster/resource.

    1. In the Azure portal, go to the cluster, Virtual Machine, or Virtual Machine Scale Set's page.
    1. Select **Identity**.
    1. Select **User assigned**. 
    1. Select **Add**.
    1. Select the user assigned managed identity that you created, then select **Add**.

        :::image type="content" source="media/self-managed-prometheus-remote-write/assign-user-identity.png" lightbox="media/self-managed-prometheus-remote-write/assign-user-identity.png" alt-text="A screenshot showing the add user assigned managed identity page.":::

    1. You can use the following CLI commands to assign the managed identity to Virtual Machine, or Virtual Machine Scale Set instead of using the portal.
    
    Virtual machines:
    ```azurecli
    az vm identity assign -g <resource group name> -n <virtual machine name> --identities <user assigned identity resource ID>
    ```
    Virtual machine scale sets:
    ```azurecli
    az vmss identity assign -g <resource group name> -n <VSS name> --identities <user assigned identity resource ID>
    ```


### [Microsoft Entra ID application](#tab/entra-application)

To configure an Microsoft Entra ID application for remote-write to Azure Monitor workspace, you must create an Entra application to use in your remote-write configuration. You can create an Microsoft Entra ID application using CLI or the portal.

> [!NOTE]
> Your Azure Entra application uses a client secret or password.  Client secrets have an expiration date. Make sure to create a new client secret before it expires so you don't lose authenticated access.

#### Create an Microsoft Entra ID application using CLI
To create an Microsoft Entra ID application using CLI, and assign the `Monitoring Metrics Publisher` role, run the following command:

```azurecli
az ad sp create-for-rbac --name myServicePrincipalName \
--role "Monitoring Metrics Publisher" \
--scopes <azure monitor workspace data collection rule Id>
```
For example,
```azurecli
az ad sp create-for-rbac --name PromRemoteWriteApp \
--role "Monitoring Metrics Publisher" \
--scopes /subscriptions/abcdef00-1234-5678-abcd-1234567890ab/resourceGroups/MA_amw-001_eastus_managed/providers/Microsoft.Insights/dataCollectionRules/amw-001
```

The output contains the `appId` and `password` values. Save these values to use in the Prometheus remote write configuration as values for `client_id` and `client_secret` The password or client secret value is only visible when created and can't be retrieved later. If lost, you must create a new client secret.

```azurecli
{
  "appId": "01234567-abcd-ef01-2345-67890abcdef0",
  "displayName": "PromRemoteWriteApp",
  "password": "AbCDefgh1234578~zxcv.09875dslkhjKLHJHLKJ",
  "tenant": "abcdef00-1234-5687-abcd-1234567890ab"
}
```

#### Create an Microsoft Entra ID application using the Azure portal

To create an Microsoft Entra ID application using the portal, see  [Create a Microsoft Entra ID application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).

Once you have created your Entra application, get the client ID and generate a client secret. 

1. In the list of applications, copy the value for **Application (client) ID** for the registered application. This value is used in the Prometheus remote write configuration as the value for `client_id`. 

    :::image type="content" source="media/self-managed-prometheus-remote-write/find-clinet-id.png" alt-text="A screenshot showing the application or client ID of a Microsoft Entra ID application." lightbox="media/self-managed-prometheus-remote-write/find-clinet-id.png":::

1. Select **Certificates and Secrets**
1. Select **Client secrets**, them select **New client secret** to create a new Secret
1. Enter a description,  set the expiration date and select **Add**.
    :::image type="content" source="media/self-managed-prometheus-remote-write/create-client-secret.png" alt-text="A screenshot showing the add secret page." lightbox="media/self-managed-prometheus-remote-write/create-client-secret.png":::
1. Copy the value of the secret securely. The value is used in the Prometheus remote write configuration as the value for `client_secret`.  The client secret value is only visible when created and can't be retrieved later. If lost, you must create a new client secret.

    :::image type="content" source="media/self-managed-prometheus-remote-write/copy-client-secret.png" alt-text="A screenshot showing the client secret value." lightbox="media/self-managed-prometheus-remote-write/copy-client-secret.png":::
 
#### Assign the Monitoring Metrics Publisher role to the application

Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the application. 

1. On the Azure Monitor workspace, overview page, select the **Data collection rule** link.

    :::image type="content" source="media/self-managed-prometheus-remote-write/select-data-collection-rule.png" alt-text="A screenshot showing the data collection rule link on the Azure Monitor workspace page." lightbox="media/self-managed-prometheus-remote-write/select-data-collection-rule.png":::

1. On the data collection rule overview page, select **Access control (IAM)**.

1. Select **Add**, and then select **Add role assignment**.

    :::image type="content" source="media/self-managed-prometheus-remote-write/data-collection-rule-access-control.png" alt-text="A screenshot showing adding the role add assignment pages." lightbox="media/self-managed-prometheus-remote-write/data-collection-rule-access-control.png":::

1. Select the **Monitoring Metrics Publisher** role, and then select **Next**.

    :::image type="content" source="media/self-managed-prometheus-remote-write/add-role-assignment.png" lightbox="media/self-managed-prometheus-remote-write/add-role-assignment.png" alt-text="A screenshot showing the role assignment menu for a data collection rule.":::

1. Select **User, group, or service principal**, and then choose **Select members**. Select the application that you created, and then choose **Select**.

    :::image type="content" source="../containers/media/prometheus-remote-write-active-directory/select-application.png" alt-text="Screenshot that shows selecting the application." lightbox="../containers/media/prometheus-remote-write-active-directory/select-application.png":::

1. To complete the role assignment, select **Review + assign**.

---

## Configure remote-write

Remote-write is configured in the Prometheus configuration file `prometheus.yml`.

For more information on configuring remote-write, see the Prometeus.io article: [Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write).  For more on tuning the remote write configuration, see [Remote write tuning](https://prometheus.io/docs/practices/remote_write/#remote-write-tuning).

To send data to your Azure Monitor Workspace, add the following section to the configuration file of your self-managed Prometheus instance.

```yaml
remote_write:   
  - url: "<metrics ingestion endpoint for your Azure Monitor workspace>"
# AzureAD configuration.
# The Azure Cloud. Options are 'AzurePublic', 'AzureChina', or 'AzureGovernment'.
  azuread:
    cloud: 'AzurePublic'
    managed_identity:
      client_id: "<client-id of the managed identity>"
    oauth:
      client_id: "<client-id from the Entra app>"
      client_secret: "<client secret from the Entra app>"
      tenant_id: "<Azure subscription tenant Id>"
```

The `url` parameter specifies the metrics ingestion endpoint of the Azure Monitor workspace. It can be found on the Overview page of your Azure Monitor workspace in the Azure portal.

:::image type="content" source="media/self-managed-prometheus-remote-write/metrics-ingestion-endpoint.png" lightbox="media/self-managed-prometheus-remote-write/metrics-ingestion-endpoint.png" alt-text="A screenshot showing the metrics ingestion endpoint for an Azure Monitor workspace.":::

Use either the  `managed_identity`, or `oauth` for Microsoft Entra ID application authentication, depending on your implementation. Remove the object that you're not using.

Find your client ID for the managed identity using the following Azure CLI command:

```azurecli
az identity list --resource-group <resource group name>
```
For more information, see [az identity list](/cli/azure/identity?view=azure-cli-latest#az-identity-list).

To find your client for managed identity authentication in the portal, go to the **Managed Identities** page in the Azure portal and select the relevant identity name. Copy the value of the **Client ID** from the **Identity overview** page.

:::image type="content" source="media/self-managed-prometheus-remote-write/find-clinet-id.png" lightbox="media/self-managed-prometheus-remote-write/find-clinet-id.png" alt-text="A screenshot showing the client ID on the Identity overview page."::: 

To find the client ID for the Microsoft Entra ID application, use the following CLI or see the first step in the [Create an Microsoft Entra ID application using the Azure portal](#create-an-microsoft-entra-id-application-using-the-azure-portal) section.

```azurecli
$ az ad app list --display-name < application name.>
```
For more information, see [az ad app list](/cli/azure/ad/app?view=azure-cli-latest#az-ad-app-list).


After editing the configuration file, restart Prometheus to apply the changes.


## Verify if the remote-write data is flowing

Use the following methods to verify that Prometheus data is being sent into your Azure Monitor workspace.

### Azure Monitor metrics explorer with PromQL

To check if the metrics are flowing to the Azure Monitor workspace, from your Azure Monitor workspace in the Azure portal, select **Metrics**.  Use the metrics explorer to query the metrics that you're expecting from the self-managed Prometheus environment.

### Prometheus explorer in Azure Monitor Workspace

To use the Prometheus explorer, from to your Azure Monitor workspace in the Azure portal and select **Prometheus Explorer** to query the metrics that you're expecting from the self-managed Prometheus environment.

### PromQL queries

Use PromQL queries in Grafana and verify that the results return expected data. See [getting Grafana setup with Managed Prometheus](../essentials/prometheus-grafana.md) to configure Grafana.


## Troubleshoot remote write

It takes about 30 minutes for the assignment of the role to take effect. 
During this time you may see an HTTP 403 error in the Prometheus log. Check that you have configured the managed identity or Microsoft Entra ID application correctly, and if so, wait 30 minutes for the role assignment to take effect.

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


https://edamw-001-ci0b.eastus-1.metrics.ingest.monitor.azure.com/dataCollectionRules/dcr-3ff856c920bd45b08e8c11526c753824/streams/Microsoft-PrometheusMetrics/api/v1/write?api-version=2023-04-24