---
title: Enable Azure Monitor managed service for Prometheus (preview)
description: Enable Azure Monitor managed service for Prometheus (preview) and configure data collection from your Azure Kubernetes Service (AKS) cluster.
ms.custom: references_regions
ms.topic: conceptual
ms.date: 09/28/2022
ms.reviewer: aul
---

# Collect Prometheus metrics from AKS cluster (preview)
This article describes how to configure your Azure Kubernetes Service (AKS) cluster to send data to Azure Monitor managed service for Prometheus. When you configure your AKS cluster to send data to Azure Monitor managed service for Prometheus, a containerized version of the [Azure Monitor agent](../agents/agents-overview.md) is installed with a metrics extension. You just need to specify the Azure Monitor workspace that the data should be sent to.

> [!NOTE]
> The process described here doesn't enable [Container insights](../containers/container-insights-overview.md) on the cluster even though the Azure Monitor agent installed in this process is the same one used by Container insights. See [Enable Container insights](../containers/container-insights-onboard.md) for different methods to enable Container insights on your cluster. See [Collect Prometheus metrics with Container insights](../containers/container-insights-prometheus.md) for details on adding Prometheus collection to a cluster that already has Container insights enabled.

## Prerequisites

- You must either have an [Azure Monitor workspace](azure-monitor-workspace-overview.md) or [create a new one](azure-monitor-workspace-overview.md#create-an-azure-monitor-workspace).
- The cluster must use [managed identity authentication](../containers/container-insights-enable-aks.md#migrate-to-managed-identity-authentication).
- The following resource providers must be registered in the subscription of the AKS cluster and the Azure Monitor Workspace.
  - Microsoft.ContainerService
  - Microsoft.Insights
  - Microsoft.AlertsManagement

## Enable Prometheus metric collection
Use any of the following methods to install the Azure Monitor agent on your AKS cluster and send Prometheus metrics to your Azure Monitor workspace.

### [Azure portal](#tab/azure-portal)

1. Open the **Azure Monitor workspaces** menu in the Azure portal and select your cluster.
2. Select **Managed Prometheus** to display a list of AKS clusters.
3. Click **Configure** next to the cluster you want to enable.

    :::image type="content" source="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" lightbox="media/prometheus-metrics-enable/azure-monitor-workspace-configure-prometheus.png" alt-text="Screenshot of Azure Monitor workspace with Prometheus configuration.":::


### [CLI](#tab/cli)

#### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The aks-preview extension needs to be installed using the command `az extension add --name aks-preview`. For more information on how to install a CLI extension, see [Use and manage extensions with the Azure CLI](/azure/azure-cli-extensions-overview).
- Azure CLI version 2.41.0 or higher is required for this feature.

#### Install metrics addon

Use `az aks update` with the `-enable-azuremonitormetrics` option to install the metrics addon. Following are multiple options depending on the Azure Monitor workspace and Grafana workspace you want to use.


**Create a new default Azure Monitor workspace.**<br>
If no Azure Monitor Workspace is specified, then a default Azure Monitor Workspace will be created in the `DefaultRG-<cluster_region>` following the format `DefaultAzureMonitorWorkspace-<mapped_region>`.
This Azure Monitor Workspace will be in the region specific in [Region mappings](#region-mappings).

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>
```

**Use an existing Azure Monitor workspace.**<br>
If the Azure Monitor workspace is linked to one or more Grafana workspaces, then the data will be available in Grafana.

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <workspace-name-resource-id>
```

**Use an existing Azure Monitor workspace and link with an existing Grafana workspace.**<br>
This creates a link between the Azure Monitor workspace and the Grafana workspace.

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <azure-monitor-workspace-name-resource-id> --grafana-resource-id  <grafana-workspace-name-resource-id>
```

The output for each command will look similar to the following:

```json
"azureMonitorProfile": {
    "metrics": {
        "enabled": true,
        "kubeStateMetrics": {
            "metrican'tationsAllowList": "",
            "metricLabelsAllowlist": ""
        }
    }
}
```

#### Optional parameters
Following are optional parameters that you can use with the previous commands.

- `--ksm-metric-annotations-allow-list` is a comma-separated list of Kubernetes annotations keys that will be used in the resource's labels metric. By default the metric contains only name and namespace labels. To include additional annotations provide a list of resource names in their plural form and Kubernetes annotation keys, you would like to allow for them. A single `*` can be provided per resource instead to allow any annotations, but that has severe performance implications.
- `--ksm-metric-labels-allow-list` is a comma-separated list of additional Kubernetes label keys that will be used in the resource's labels metric. By default the metric contains only name and namespace labels. To include additional labels provide a list of resource names in their plural form and Kubernetes label keys you would like to allow for them. A single `*` can be provided per resource instead to allow any labels, but that has severe performance implications.

**Use annotations and labels.**

```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --ksm-metric-labels-allow-list "namespaces=[k8s-label-1,k8s-label-n]" --ksm-metric-annotations-allow-list "pods=[k8s-annotation-1,k8s-annotation-n]"
```

The output will be similar to the following:

```json
    "azureMonitorProfile": {
        "metrics": {
          "enabled": true,
          "kubeStateMetrics": {
            "metrican'tationsAllowList": "pods=[k8s-annotation-1,k8s-annotation-n]",
            "metricLabelsAllowlist": "namespaces=[k8s-label-1,k8s-label-n]"
          }
        }
      }
```

## [Resource Manager](#tab/resource-manager)

### Prerequisites

- Register the `AKS-PrometheusAddonPreview` feature flag in the Azure Kubernetes clusters subscription with the following command in Azure CLI: `az feature register --namespace Microsoft.ContainerService --name AKS-PrometheusAddonPreview`.
- The Azure Monitor workspace and Azure Managed Grafana workspace must already be created.
- The template needs to be deployed in the same resource group as the Azure Managed Grafana workspace.


### Retrieve required values for Grafana resource
From the **Overview** page for the Azure Managed Grafana instance in the Azure portal, select **JSON view**.

 Copy the value of the `principalId` field for the `SystemAssigned` identity.

```json
"identity": {
        "principalId": "00000000-0000-0000-0000-000000000000",
        "tenantId": "00000000-0000-0000-0000-000000000000",
        "type": "SystemAssigned"
    },
```

If you're using an existing Azure Managed Grafana instance that already has been linked to an Azure Monitor workspace then you need the list of Grafana integrations. Copy the value of the `azureMonitorWorkspaceIntegrations` field. If it doesn't exist, then the instance hasn't been linked with any Azure Monitor workspace.

```json
"properties": {
    "grafanaIntegrations": {
        "azureMonitorWorkspaceIntegrations": [
            {
                "azureMonitorWorkspaceResourceId": "full_resource_id_1"
            },
            {
                "azureMonitorWorkspaceResourceId": "full_resource_id_2"
            }
        ]
    }
}
```

### Assign role to system identity
The  Azure Managed Grafana resource requires the `Monitoring Data Reader` role to read data from the Azure Monitor Workspace.

1. From the **Access control (IAM)** page for the Azure Managed Grafana instance in the Azure portal, select **Add** and then **Add role assignment**.
2. Select `Monitoring Data Reader`.
3. Select **Managed identity** and then **Select members**.
4. Select the **system-assigned managed identity** with the `principalId` from the Grafana resource.
5. Click **Select** and then **Review+assign**.

### Download and edit template and parameter file

1. Download the template at [https://aka.ms/azureprometheus-enable-arm-template](https://aka.ms/azureprometheus-enable-arm-template) and save it as **existingClusterOnboarding.json**.
2. Download the parameter file at [https://aka.ms/azureprometheus-enable-arm-template-parameterss](https://aka.ms/azureprometheus-enable-arm-template-parameters) and save it as **existingClusterParam.json**.
3. Edit the values in the parameter file.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `azureMonitorWorkspaceLocation` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterResourceId` | Resource ID for the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `clusterLocation` | Location of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `metricLabelsAllowlist` | Comma-separated list of Kubernetes labels keys that will be used in the resource's labels metric. |
    | `metricAnnotationsAllowList` | Comma-separated list of additional Kubernetes label keys that will be used in the resource's labels metric. |
    | `grafanaResourceId` | Resource ID for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaLocation`   | Location for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. |
    | `grafanaSku`        | SKU for the managed Grafana instance. Retrieve from the **JSON view** on the **Overview** page for the Grafana instance. Use the **sku.name**. |


4. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you retrieved from the Grafana instance. This will be similar to the following:

    ```json
    {
        "type": "Microsoft.Dashboard/grafana",
        "apiVersion": "2022-08-01",
        "name": "[split(parameters('grafanaResourceId'),'/')[8]]",
        "sku": {
            "name": "[parameters('grafanaSku')]"
        },
        "location": "[parameters('grafanaLocation')]",
        "properties": {
            "grafanaIntegrations": {
            "azureMonitorWorkspaceIntegrations": [
                {
                    "azureMonitorWorkspaceResourceId": "full_resource_id_1"
                },
                {
                    "azureMonitorWorkspaceResourceId": "full_resource_id_2"
                },
                {
                    "azureMonitorWorkspaceResourceId": "[parameters('azureMonitorWorkspaceResourceId')]"
                }
            ]
            }
        }
    ````

In this json, `full_resource_id_1` and `full_resource_id_2` were already in the Azure Managed Grafana resource JSON, and they're added here to the ARM template. If you have no existing Grafana integrations, then don't include these entries for `full_resource_id_1` and `full_resource_id_2`. 

The final `azureMonitorWorkspaceResourceId` entry is already in the template and is used to link to the Azure Monitor Workspace resource ID provided in the parameters file. 


### Deploy template

Deploy the template with the parameter file using any valid method for deploying Resource Manager templates. See [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates) for examples of different methods.


---



## Verify Deployment

Run the following command to which verify that the daemon set was deployed properly:

```
kubectl get ds ama-metrics-node --namespace=kube-system
```

The output should resemble the following:

```
User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
ama-metrics-node   1         1         1       1            1           <none>          10h
```

Run the following command to which verify that the replica set was deployed properly:

```
kubectl get rs --namespace=kube-system
```

The output should resemble the following:

```
User@aksuser:~$kubectl get rs --namespace=kube-system
NAME                            DESIRED   CURRENT   READY   AGE
ama-metrics-5c974985b8          1         1         1       11h
ama-metrics-ksm-5fcf8dffcd      1         1         1       11h
```


## Limitations

- Ensure that you update the `kube-state metrics` Annotations and Labels list with proper formatting. There's a limitation in the Resource Manager template deployments that require exact values in the `kube-state` metrics pods. If the kuberenetes pod has any issues with malformed parameters and isn't running, then the feature won't work as expected.
- A data collection rule and data collection endpoint is created with the name `MSPROM-\<cluster-name\>-\<cluster-region\>`. These names can't currently be modified.
- You must get the existing Azure Monitor workspace integrations for a Grafana workspace and update the Resource Manager template with it, otherwise it will overwrite and remove the existing integrations from the grafana workspace.
- CPU and Memory requests and limits can't be changed for Container insights metrics addon. If changed, they'll be reconciled and replaced by original values in a few seconds.
- Metrics addon doesn't work on AKS clusters configured with HTTP proxy. 


## Uninstall metrics addon
Currently, Azure CLI is the only option to remove the metrics addon and stop sending Prometheus metrics to Azure Monitor managed service for Prometheus. 

If you don't already have it, install the aks-preview extension with the following command. 

The `aks-preview` extension needs to be installed using the following command. For more information on how to install a CLI extension, see [Use and manage extensions with the Azure CLI](/cli/azure/azure-cli-extensions-overview).

```azurecli
az extension add --name aks-preview
```
Use the following command to remove the agent from the cluster nodes and delete the recording rules created for the data being collected from the cluster. This doesn't remove the DCE, DCR, or the data already collected and stored in your Azure Monitor workspace.

```azurecli
az aks update --disable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>
```

## Region mappings
When you allow a default Azure Monitor workspace to be created when you install the metrics addon, it's created in the region listed in the following table.

| AKS Cluster region | Azure Monitor workspace region |
|-----------------------|------------------------------------|
|australiacentral |eastus|
|australiacentral2 |eastus|
|australiaeast |eastus|
|australiasoutheast |eastus|
|brazilsouth |eastus|
|canadacentral |eastus|
|canadaeast |eastus|
|centralus |centralus|
|centralindia |centralindia|
|eastasia |westeurope|
|eastus |eastus|
|eastus2 |eastus2|
|francecentral |westeurope|
|francesouth |westeurope|
|japaneast |eastus|
|japanwest |eastus|
|koreacentral |westeurope|
|koreasouth |westeurope|
|northcentralus |eastus|
|northeurope |westeurope|
|southafricanorth |westeurope|
|southafricawest |westeurope|
|southcentralus |eastus|
|southeastasia |westeurope|
|southindia |centralindia|
|uksouth |westeurope|
|ukwest |westeurope|
|westcentralus |eastus|
|westeurope |westeurope|
|westindia |centralindia|
|westus |westus|
|westus2 |westus2|
|westus3 |westus|
|norwayeast |westeurope|
|norwaywest |westeurope|
|switzerlandnorth |westeurope|
|switzerlandwest |westeurope|
|uaenorth |westeurope|
|germanywestcentral |westeurope|
|germanynorth |westeurope|
|uaecentral |westeurope|
|eastus2euap |eastus2euap|
|centraluseuap |westeurope|
|brazilsoutheast |eastus|
|jioindiacentral |centralindia|
|swedencentral |westeurope|
|swedensouth |westeurope|
|qatarcentral |westeurope|

## Next steps

- [See the default configuration for Prometheus metrics](prometheus-metrics-scrape-default.md).
- [Customize Prometheus metric scraping for the cluster](prometheus-metrics-scrape-configuration.md).