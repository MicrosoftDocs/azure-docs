---
title: Send Prometheus metrics from Virtual Machines to an Azure Monitor workspace
description: How to configure remote-write to send data from self-managed Prometheus to an Azure Monitor managed service for Prometheus
author: bwren 
ms.topic: conceptual
ms.date: 04/15/2024

#customer intent: As an azure administrator, I want to send Prometheus metrics from my self-managed Prometheus instance to an Azure Monitor workspace.

---

# Send Prometheus metrics from Virtual Machines to an Azure Monitor workspace

Prometheus isn't limited to monitoring Kubernetes clusters. Use Prometheus to monitor applications and services running on your servers, wherever they're running. For example, you can monitor applications running on Virtual Machines, Virtual Machine Scale Sets, or even on-premises servers. Install prometheus on your servers and configure remote-write to send metrics to an Azure Monitor workspace.

This article explains how to configure remote-write to send data from a self-managed Prometheus instance to an Azure Monitor workspace.


## Remote write options

Self-managed Prometheus can run on Azure and non-Azure environments. The following are authentication options for remote-write to Azure Monitor workspace based on the environment where Prometheus is running.

## Azure managed Virtual Machines and Virtual Machine Scale Sets

Use user-assigned managed identity authentication for services running self managed Prometheus in an Azure environment. Azure managed services include:

- Azure Virtual Machines
- Azure Virtual Machine Scale Sets
- Azure Arc-enabled Virtual Machines

To set up remote write for Azure managed resources, see [Remote-write using user-assigned managed identity](#remote-write-using-user-assigned-managed-identity-authentication).


## Virtual machines running on non-Azure environments.

Onboarding to Azure Arc-enabled services, allows you to manage and configure non-Azure virtual machines in Azure. Once onboarded, configure [Remote-write using user-assigned managed identity](#remote-write-using-user-assigned-managed-identity-authentication) authentication. For more Information on onboarding Virtual Machines to Azure Arc-enabled servers, see [Azure Arc-enabled servers](/azure/azure-arc/servers/overview). 

If you have virtual machines in non-Azure environments, and you don't want to onboard to Azure Arc, install self-managed Prometheus and configure remote-write using Microsoft Entra ID application authentication. For more information, see [Remote-write using Microsoft Entra ID application authentication](#remote-write-using-microsoft-entra-id-application-authentication).

## Prerequisites

### Supported versions

- Prometheus versions greater than v2.45 are required for managed identity authentication.
- Prometheus versions greater than v2.48 are required for Microsoft Entra ID application authentication. 

### Azure Monitor workspace
This article covers sending Prometheus metrics to an Azure Monitor workspace. To create an Azure monitor workspace, see [Manage an Azure Monitor workspace](./azure-monitor-workspace-manage.md#create-an-azure-monitor-workspace).

## Permissions
Administrator permissions for the cluster or resource are required to complete the steps in this article.


## Set up authentication for remote-write

Depending on the environment where Prometheus is running, you can configure remote-write to use user-assigned managed identity or Microsoft Entra ID application authentication to send data to Azure Monitor workspace.

Use the Azure portal or CLI to create a user-assigned managed identity or Microsoft Entra ID application.

### [Remote-write using user-assigned managed identity](#tab/managed-identity)
### Remote-write using user-assigned managed identity authentication

To configure a user-assigned managed identity for remote-write to Azure Monitor workspace, complete the following steps.

#### Create a user-assigned managed identity

To create a user-managed identity to use in your remote-write configuration, see [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities#create-a-user-assigned-managed-identity). 

Note the value of the `clientId` of the managed identity that you created. This ID is used in the Prometheus remote write configuration. 

#### Assign the Monitoring Metrics Publisher role to the application

Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the managed identity. 

1. On the Azure Monitor workspace Overview page, select the **Data collection rule** link.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/select-data-collection-rule.png" lightbox="media/prometheus-remote-write-virtual-machines/select-data-collection-rule.png" alt-text="A screenshot showing the data collection rule link on an Azure Monitor workspace page.":::

1. On the data collection rule page, select **Access control (IAM)**. 

1. Select **Add**, and **Add role assignment**.
    :::image type="content" source="media/prometheus-remote-write-virtual-machines/data-collection-rule-access-control.png" lightbox="media/prometheus-remote-write-virtual-machines/data-collection-rule-access-control.png" alt-text="A screenshot showing the data collection rule.":::

1. Search for and select for *Monitoring Metrics Publisher*, and then select **Next**.
    :::image type="content" source="media/prometheus-remote-write-virtual-machines/add-role-assignment.png" lightbox="media/prometheus-remote-write-virtual-machines/add-role-assignment.png" alt-text="A screenshot showing the role assignment menu for a data collection rule.":::

1. Select **Managed Identity**.
1. Select **Select members**. 
1. In the **Managed Entity** dropdown, *User-assigned managed identity*. 
1. Select the user-assigned identity that you want to use, then click **Select**.
1. Select **Review + assign** to complete the role assignment.
    
    :::image type="content" source="media/prometheus-remote-write-virtual-machines/select-members.png" lightbox="media/prometheus-remote-write-virtual-machines/select-members.png" alt-text="A screenshot showing the select members menu for a data collection rule.":::

#### Assign the managed identity to a Virtual Machine or Virtual Machine Scale Set.

> [!IMPORTANT]
> To complete the steps in this section, you must have owner or user access administrator permissions for the Virtual Machine or Virtual MAchine Scale Set.
     
1. In the Azure portal, go to the cluster, Virtual Machine, or Virtual Machine Scale Set's page.
1. Select **Identity**.
1. Select **User assigned**. 
1. Select **Add**.
1. Select the user assigned managed identity that you created, then select **Add**.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/assign-user-identity.png" lightbox="media/prometheus-remote-write-virtual-machines/assign-user-identity.png" alt-text="A screenshot showing the Add user assigned managed identity page.":::


### [Microsoft Entra ID application](#tab/entra-application)
### Remote-write using Microsoft Entra ID application authentication

To configure remote-write to Azure Monitor workspace using a Microsoft Entra ID application, create an Entra application and assign it the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the application. 

> [!NOTE]
> Your Azure Entra application uses a client secret or password. Client secrets have an expiration date. Make sure to create a new client secret before it expires so you don't lose authenticated access

#### Create a Microsoft Entra ID application

To create a Microsoft Entra ID application using the portal, see  [Create a Microsoft Entra ID application and service principal that can access resources](/entra/identity-platform/howto-create-service-principal-portal#register-an-application-with-microsoft-entra-id-and-create-a-service-principal).

When you have created your Entra application, get the client ID and generate a client secret. 

1. In the list of applications, copy the value for **Application (client) ID** for the registered application. This value is used in the Prometheus remote write configuration as the value for `client_id`.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/find-clinet-id.png" alt-text="A screenshot showing the application or client ID of a Microsoft Entra ID application." lightbox="media/prometheus-remote-write-virtual-machines/find-clinet-id.png":::

1. Select **Certificates and Secrets**
1. Select **Client secrets**, them select **New client secret** to create a new Secret
1. Enter a description,  set the expiration date and select **Add**.
   
    :::image type="content" source="media/prometheus-remote-write-virtual-machines/create-client-secret.png" alt-text="A screenshot showing the add secret page." lightbox="media/prometheus-remote-write-virtual-machines/create-client-secret.png":::

1. Copy the value of the secret securely. The value is used in the Prometheus remote write configuration as the value for `client_secret`. The client secret value is only visible when created and can't be retrieved later. If lost, you must create a new client secret.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/copy-client-secret.png" alt-text="A screenshot showing the client secret value." lightbox="media/prometheus-remote-write-virtual-machines/copy-client-secret.png":::
 
#### Assign the Monitoring Metrics Publisher role to the application

Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the application. 

1. On the Azure Monitor workspace, overview page, select the **Data collection rule** link.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/select-data-collection-rule.png" alt-text="A screenshot showing the data collection rule link on the Azure Monitor workspace page." lightbox="media/prometheus-remote-write-virtual-machines/select-data-collection-rule.png":::

1. On the data collection rule overview page, select **Access control (IAM)**.

1. Select **Add**, and then select **Add role assignment**.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/data-collection-rule-access-control.png" alt-text="A screenshot showing adding the role add assignment pages." lightbox="media/prometheus-remote-write-virtual-machines/data-collection-rule-access-control.png":::

1. Select the **Monitoring Metrics Publisher** role, and then select **Next**.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/add-role-assignment.png" lightbox="media/prometheus-remote-write-virtual-machines/add-role-assignment.png" alt-text="A screenshot showing the role assignment menu for a data collection rule.":::

1. Select **User, group, or service principal**, and then choose **Select members**. Select the application that you created, and then choose **Select**.

    :::image type="content" source="media/prometheus-remote-write-virtual-machines/select-members-apps.png" alt-text="Screenshot that shows selecting the application." lightbox="media/prometheus-remote-write-virtual-machines/select-members-apps.png":::

1. To complete the role assignment, select **Review + assign**.

### [CLI](#tab/CLI)
## Create user-assigned identities and Microsoft Entra ID apps using CLI

### Create a user-assigned managed identity

Create a user-assigned managed identity for remote-write using the following steps:
1. Create a user-assigned managed identity
1. Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the managed identity
1. Assign the managed identity to a Virtual Machine or Virtual Machine Scale Set.

Note the value of the `clientId` of the managed identity that you create. This ID is used in the Prometheus remote write configuration. 

1. Create a user-assigned managed identity using the following CLI command:

    ```azurecli
    az account set \
    --subscription <subscription id>

    az identity create \
    --name <identity name> \
    --resource-group <resource group name>
    ```
  
    The following is an example of the output displayed:

    ```azurecli
    {
      "clientId": "abcdef01-a123-b456-d789-0123abc345de",
      "id": "/subscriptions/12345678-abcd-1234-abcd-1234567890ab/resourcegroups/rg-001/providers/Microsoft.ManagedIdentity/userAssignedIdentities/PromRemoteWriteIdentity",
      "location": "eastus",
      "name": "PromRemoteWriteIdentity",
      "principalId": "98765432-0123-abcd-9876-1a2b3c4d5e6f",
      "resourceGroup": "rg-001",
      "systemData": null,
      "tags": {},
      "tenantId": "ffff1234-aa01-02bb-03cc-0f9e8d7c6b5a",
      "type": "Microsoft.ManagedIdentity/userAssignedIdentities"
    }
    ```

1. Assign the `Monitoring Metrics Publisher` role on the workspace's data collection rule to the managed identity.
    
    ```azurecli
    az role assignment create \
    --role "Monitoring Metrics Publisher" \
    --assignee <managed identity client ID> \
    --scope <data collection rule resource ID>
    ```
    For example, 
    
    ```azurecli
    az role assignment create \
    --role "Monitoring Metrics Publisher" \
    --assignee abcdef01-a123-b456-d789-0123abc345de \
    --scope /subscriptions/12345678-abcd-1234-abcd-1234567890ab/resourceGroups/MA_amw-001_eastus_managed/providers/Microsoft.Insights/dataCollectionRules/amw-001
    ```

1. Assign the managed identity to a Virtual Machine or Virtual Machine Scale Set.

    For Virtual Machines:
    ```azurecli
    az vm identity assign \
    -g <resource group name> \
    -n <virtual machine name> \
    --identities <user assigned identity resource ID>
    ```
    
    For Virtual Machine Scale Sets:
    
    ```azurecli
    az vmss identity assign \
    -g <resource group name> \
    -n <VSS name> \
    --identities <user assigned identity resource ID>
    ```

    For example, for a Virtual Machine Scale Set:

    ```azurecli
    az vm identity assign \
    -g rg-prom-on-vm \
    -n win-vm-prom \
    --identities /subscriptions/12345678-abcd-1234-abcd-1234567890ab/resourcegroups/rg-001/providers/Microsoft.ManagedIdentity/userAssignedIdentities/PromRemoteWriteIdentity
    ```
For more information, see [az identity create](/cli/azure/identity?view=azure-cli-latest#az-identity-create) and [az role assignment create](/cli/azure/role/assignment?view=azure-cli-latest#az-role-assignment-create).

#### Create a Microsoft Entra ID application
To create a Microsoft Entra ID application using CLI, and assign the `Monitoring Metrics Publisher` role, run the following command:

```azurecli
az ad sp create-for-rbac --name <application name> \
--role "Monitoring Metrics Publisher" \
--scopes <azure monitor workspace data collection rule Id>
```    
For example,
```azurecli
az ad sp create-for-rbac \
--name PromRemoteWriteApp \
--role "Monitoring Metrics Publisher" \
--scopes /subscriptions/abcdef00-1234-5678-abcd-1234567890ab/resourceGroups/MA_amw-001_eastus_managed/providers/Microsoft.nsights/dataCollectionRules/amw-001
```    
The following is an example of the output displayed:    
```azurecli
{
  "appId": "01234567-abcd-ef01-2345-67890abcdef0",
  "displayName": "PromRemoteWriteApp",
  "password": "AbCDefgh1234578~zxcv.09875dslkhjKLHJHLKJ",
  "tenant": "abcdef00-1234-5687-abcd-1234567890ab"
}
```

The output contains the `appId` and `password` values. Save these values to use in the Prometheus remote write configuration as values for `client_id` and `client_secret` The password or client secret value is only visible when created and can't be retrieved later. If lost, you must create a new client secret.

For more information, see [az ad app create](/cli/azure/ad/app?view=azure-cli-latest#az-ad-app-create) and [az ad sp create-for-rbac](/cli/azure/ad/sp?view=azure-cli-latest#az-ad-sp-create-for-rbac).

---
## Configure remote-write

Remote-write is configured in the Prometheus configuration file `prometheus.yml`.

For more information on configuring remote-write, see the Prometheus.io article: [Configuration](https://prometheus.io/docs/prometheus/latest/configuration/configuration/#remote_write). For more on tuning the remote write configuration, see [Remote write tuning](https://prometheus.io/docs/practices/remote_write/#remote-write-tuning).

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

:::image type="content" source="media/prometheus-remote-write-virtual-machines/metrics-ingestion-endpoint.png" lightbox="media/prometheus-remote-write-virtual-machines/metrics-ingestion-endpoint.png" alt-text="A screenshot showing the metrics ingestion endpoint for an Azure Monitor workspace.":::

Use either the  `managed_identity`, or `oauth` for Microsoft Entra ID application authentication, depending on your implementation. Remove the object that you're not using.

Find your client ID for the managed identity using the following Azure CLI command:

```azurecli
az identity list --resource-group <resource group name>
```
For more information, see [az identity list](/cli/azure/identity?view=azure-cli-latest#az-identity-list).

To find your client for managed identity authentication in the portal, go to the **Managed Identities** page in the Azure portal and select the relevant identity name. Copy the value of the **Client ID** from the **Identity overview** page.

:::image type="content" source="media/prometheus-remote-write-virtual-machines/find-clinet-id.png" lightbox="media/prometheus-remote-write-virtual-machines/find-clinet-id.png" alt-text="A screenshot showing the client ID on the Identity overview page."::: 

To find the client ID for the Microsoft Entra ID application, use the following CLI or see the first step in the [Create an Microsoft Entra ID application using the Azure portal](#remote-write-using-microsoft-entra-id-application-authentication) section.

```azurecli
$ az ad app list --display-name < application name>
```
For more information, see [az ad app list](/cli/azure/ad/app?view=azure-cli-latest#az-ad-app-list).


>[!NOTE]
> After editing the configuration file, restart Prometheus for the changes to apply.


## Verify that remote-write data is flowing

Use the following methods to verify that Prometheus data is being sent into your Azure Monitor workspace.

### Azure Monitor metrics explorer with PromQL

To check if the metrics are flowing to the Azure Monitor workspace, from your Azure Monitor workspace in the Azure portal, select **Metrics**. Use the metrics explorer to query the metrics that you're expecting from the self-managed Prometheus environment. For more information, see [Metrics explorer](/azure/azure-monitor/essentials/metrics-explorer).


### Prometheus explorer in Azure Monitor Workspace

Prometheus Explorer provides a convenient way to interact with Prometheus metrics within your Azure environment, making monitoring and troubleshooting more efficient. To use the Prometheus explorer, go to your Azure Monitor workspace in the Azure portal and select **Prometheus Explorer** to query the metrics that you're expecting from the self-managed Prometheus environment.
For more information, see [Prometheus explorer](/azure/azure-monitor/essentials/prometheus-workbooks).

### Grafana

Use PromQL queries in Grafana to verify that the results return the expected data. See [getting Grafana setup with Managed Prometheus](../essentials/prometheus-grafana.md) to configure Grafana.


## Troubleshoot remote write 

If remote data isn't appearing in your Azure Monitor workspace, see [Troubleshoot remote write](../containers/prometheus-remote-write-troubleshooting.md) for common issues and solutions. 


## Next steps

- [Learn more about Azure Monitor managed service for Prometheus](./prometheus-metrics-overview.md).
- [Learn more about Azure Monitor reverse proxy side car for remote-write from self-managed Prometheus running on Kubernetes](../containers/prometheus-remote-write.md)



