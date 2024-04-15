---
title: Self-managed Prometheus remote-write to an Azure Monitor workspace
description: How to configure remote-write to send data from self-managed Prometheus to an Azure Monitor managed service for Prometheus
author: bwren 
ms.topic: conceptual
ms.date: 04/15/2024
---


We already have articvles for AKS and non aks k8s remote write. This article is for self-managed prometheus running on VMs, VMSS, and on-premises servers.

# Send Prometheus metrics for Virtual Machines to an Azure Monitor workspace

Prometheus isn't limited to monitoring Kubernetes clusters. Use Prometheus to monitor applications and services running on your servers, wherever they are running.  For example, you can monitor applications running on Virtual Machines, Virtual Machine Scale Sets, or even on-premises servers. Install prometheus on your servers and configure remote-write to send metrics to an Azure Monitor workspace.

This article explains how to configure remote-write to send data from a self-managed Prometheus instance to an Azure Monitor workspace.


## Remote write options.

Self-managed Prometheus can run on Azure and non-Azure environments. The following are authentication options for remote-write to Azure Monitor workspace based on the environment where Prometheus is running.

#### Azure managed Virtual Machines and Virtual Machine Scale Sets

Use user-assigned managed identity authentication for services running self managed Prometheus in an Azure environment. Services include the following:

- Azure Virtual Machines
- Azure Virtual Machine Scale Sets
- Azure Arc-enabled Virtual Machines

To set up remote write for Azure managed resources, see [Remote-write with user-assigned managed identity](#remote-write-with-user-assigned-managed-identity).


#### Virtual machines running on non-Azure environments.

Onboarding to Azure Arc-enabled services, allows you to manage and configure non-Azure virtual machines in Azure. Once onboarded, configure [remote-write using user-assigned managed identity](#remote-write-with-user-assigned-managed-identity) authentication. For more Information on onboarding Virtual Machines to Azure Arc-enabled servers, see [Azure Arc-enabled servers](/azure/azure-arc/servers/overview). 

If you have virtual machines in non-Azure environments, and you don't want to onboard to Azure Arc, install self-managed Prometheus and configure remote-write in Prometheus using Azure Entra application authentication. For more information see [Azure Entra application](#azure-entra-application).
 

#### Kubernetets services

Azure Kubernetes Services (AKS) and Azure Arc-enabled Kubernetes support Azure Monitor managed service for Prometheus. If you prefer self-managed Prometheus see the following article for more information on remote-write to Azure Monitor workspaces.
-  [Send Prometheus data to Azure Monitor by using managed identity authentication](/azure/azure-monitor/containers/prometheus-remote-write-managed-identity)

- [Remote-write using Azure Monitor sidecar](/azure/azure-monitor/containers/prometheus-remote-write)
-[Microsoft Entra authorization proxy](/azure/azure-monitor/containers/prometheus-authorization-proxy?tabs=remote-write-example)
- [Send Prometheus data from AKS to Azure Monitor by using managed identity authentication](/azure/azure-monitor/containers/prometheus-remote-write-managed-identity)
- [Send Prometheus data from AKS to Azure Monitor by using Microsoft Entra authentication](/azure/azure-monitor/containers/prometheus-remote-write-active-directory)
- [Send Prometheus data to Azure Monitor by using Microsoft Entra pod-managed identity (preview) authentication](/azure/azure-monitor/containers/prometheus-remote-write-azure-ad-pod-identity)]
- [Send Prometheus data to Azure Monitor by using Microsoft Entra Workload ID (preview) authentication](/azure/azure-monitor/containers/prometheus-remote-write-azure-workload-identity)


   
???? WHat other autentication mehtods ????
If you're using other authentication methods and running self-managed Prometheus on Kubernetes, Azure Monitor provides a reverse proxy container that provides an abstraction for ingestion and authentication for Prometheus remote-write metrics. For more information, see [remote-write from Kubernetes to Azure Monitor Managed Service for Prometheus](../containers/prometheus-remote-write.md).

## Prerequisites

### Supported versions

- Prometheus versions greater than v2.45 are required for managed identity authentication.
- Prometheus versions greater than v2.48 are required for Azure Entra application authentication. 

### Azure Monitor workspace
This article covers sending Prometheus metrics to an Azure Monitor workspace. To create an Azure monitor workspace, see [Manage an Azure Monitor workspace](./azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace#create-an-azure-monitor-workspace).

Administrator permissions for the cluster or resource are required to complete the steps in this article.


## Setup authentication for remote-write

Depending on the environment where Prometheus is running, you can use one of the following authentication methods to configure remote-write to send data to Azure Monitor workspace.

### [Remote-write with user-assigned managed identity](#tab/managed-identity)

To configure a user-assigned managed identity for remote-write to Azure Monitor workspace, complete the following steps.

1. Create a user-managed identity to use in your remote-write configuration. For more information, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 
1. Note the value of the **Client ID** of the user-assigned managed identity that you created. It is used in the Prometheus remote write configuration. 


1. Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the managed identity. 
    1. On the Azure Monitor workspace Overview page, select the **Data collection rule** link.

    :::image type="content" source="media/self-managed-prometheus-remote-write/select-data-collection-rule.png" lightbox="media/self-managed-prometheus-remote-write/select-data-collection-rule.png" alt-text="A screenshot showing the data collection rule link on an Azure Monitor workspace page.":::

    1. On the data collection rule page, select **Access control (IAM)**. 

    1. Select **Add**, and **Add role assignment**.
      :::image type="content" source="media/self-managed-prometheus-remote-write/data-collection-rule-access-control.png" lightbox="media/self-managed-prometheus-remote-write/data-collection-rule-access-control.png" alt-text="A screenshot showing the data collection rule.":::
    1. Select for *Monitoring Metrics Publisher*, and then select **Next**.
        :::image type="content" source="media/self-managed-prometheus-remote-write/add-role-assignment.png" lightbox="media/self-managed-prometheus-remote-write/add-role-assignment.png" alt-text="A screenshot showing the role assignement menu for a data collection rule.":::
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

        :::image type="content" source="media/self-managed-prometheus-remote-write/assign-user-identity.png" lightbox="media/self-managed-prometheus-remote-write/assign-user-identity.png" alt-text="A screenshot showing the add user assign managed identity page.":::

    1. You can use the following CLI commands to assign the managed identity to Virtual Machine, or Virtual Machine Scale Set instead of using the protal.
    
    Virtual machines:
    ```azurecli
    az vm identity assign -g <resource group name> -n <virtual machine name> --identities <user assigned identity resource ID>
    ```
    Virtual machine scale sets:
    ```azurecli
    az vmss identity assign -g <resource group name> -n <VSS name> --identities <user assigned identity resource ID>
    ```


### [Azure Entra application](#tab/entra-application)

To configure an Azure Entra ID application for remote-write to Azure Monitor workspace, complete the following steps.

Create an Entra application to use in your remote-write configuration. For more information, see  [Create a Microsoft Entra application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal) and create a service principal.

#### [CLI](#tab/entra-application-cli)
To create an Azure Entra application using CLI, run the following command:

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

The output contain the `appId` and `password` values. Save these values to use in the Prometheus remote write configuration.
```azurecli
{
  "appId": "01234567-abcd-ef01-2345-67890abcdef0",
  "displayName": "PromRemoteWriteApp",
  "password": "AbCDefgh1234578~zxcv.09875dslkhjKLHJHLKJ",
  "tenant": "abcdef00-1234-5687-abcd-1234567890ab"
}
```
 ---

#### [Portal](#tab/entra-application-portal)
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
---
Something in between
---

## Configure Remote-Write to send data to Azure Monitor Workspace


The `remote_write` section in the Prometheus configuration file defines one or more remote-write configurations. A remote-write configuration has a mandatory url parameter and several optional parameters. The url parameter specifies the HTTP URL of the remote endpoint that implements the Prometheus remote-write protocol. In this case, the URL is the metrics ingestion endpoint for your Azure Monitor Workspace. The optional parameters can be used to customize the behavior of the remote-write client, such as authentication, compression, retry, queue, or relabeling settings. For a full list of the available parameters and their meanings, see the Prometheus documentation: [https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write).


In the Azure portal, go to the **Identity** menu of the managed identity and copy the value of the **Client ID**


{{{You can enable remote-write by configuring one or more remote-write sections in the Prometheus configuration file. Details about the Prometheus remote write setting can be found [here](https://prometheus.io/docs/practices/remote_write/).}}}

To send data to your Azure Monitor Workspace, you'll need the following information:

- **Remote-write URL**: This is the metrics ingestion endpoint of the Azure Monitor workspace. To find this, go to the Overview page of your Azure Monitor Workspace instance in Azure portal, and look for the Metrics ingestion endpoint property.

    :::image type="content" source="media/azure-monitor-workspace-overview/remote-write-ingestion-endpoint.png" lightbox="media/azure-monitor-workspace-overview/remote-write-ingestion-endpoint.png" alt-text="Screenshot of Azure Monitor workspaces menu and ingestion endpoint.":::

- **Authentication settings**: Currently **User-assigned managed identity** and **Azure Entra application** are the authentication methods supported for remote-writing to Azure Monitor Workspace. Note that for Azure Entra application, client secrets have an expiration date and it's the responsibility of the user to keep secrets valid.

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

After editing the configuration file, restart Prometheus to apply the changes.



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
