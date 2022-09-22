---
title: Send Prometheus metrics to Azure Monitor managed service for Prometheus with Container insights
description: Configure the Container insights agent to scrape Prometheus metrics from your Kubernetes cluster and send to Azure Monitor managed service for Prometheus.
ms.topic: conceptual
ms.date: 09/15/2022
ms.reviewer: aul
---

# Send Kubernetes metrics to Azure Monitor managed service for Prometheus with Container insights
This article describes how to configure Container insights to send Prometheus metrics to Azure Monitor managed service for Prometheus.

## Prerequisites

- The following resource providers must be registered in the subscription of the AKS cluster and the Azure Monitor Workspace.
  - Microsoft.ContainerService 
  - Microsoft.Insights
  - Microsoft.AlertsManagement
- The `az extension add --name aks-preview` extension needs to be installed for access to this feature. For more information on how to install an az cli extension, see [Use and manage extensions with the Azure CLI](../../cli/azure/azure-cli-extensions-overview.md).



## Cluster is already configured for Container insights.
Use the following procedure to add collection of Prometheus metrics for a cluster that's already configured for Container insights. This will add the metrics addon to the agent and monitoring addon.

### [Azure portal](#tab/azure-portal)

1. Open the **Kubernetes services** menu in the Azure portal and select your AKS cluster.
2. Click **Insights**.
3. Click **Monitor settings**.

    :::image type="content" source="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings.png" lightbox="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings.png" alt-text="Screenshot of button for monitor settings for an AKS cluster.":::

4. Click the checkbox for **Enable Prometheus metrics** and select your Azure Monitor workspace.
5. To send the collected metrics to Grafana, select a Grafana workspace.

    :::image type="content" source="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings-details.png" lightbox="media/container-insights-prometheus-metrics-addon/aks-cluster-monitor-settings-details.png" alt-text="Screenshot of monitor settings for an AKS cluster.":::

6. Click **Configure** to complete the configuration.

### [CLI](#tab/cli)

> [!NOTE]
> Azure CLI version 2.41.0 or higher is required for this feature.

Use the following command to create a new default Azure Monitor workspace.

`az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group>`

Use the following command to use an existing Azure Monitor workspace.

`az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <workspace-name-resource-id>`


Use the following command to use an existing Azure Monitor workspace and integrate with an existing Grafana workspace.

`az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> --azure-monitor-workspace-resource-id <azure-monitor-workspace-name-resource-id> --grafana-resource-id  <grafana-workspace-name-resource-id>`


The output will look similar to the following:

```json
"azureMonitorProfile": {
    "metrics": {
        "enabled": true,
        "kubeStateMetrics": {
            "metricAnnotationsAllowList": "",
            "metricLabelsAllowlist": ""
        }
    }
}
```

### Optional parameters

- `--ksm-metric-annotations-allow-list` is a comma-separated list of Kubernetes annotations keys that will be used in the resource's labels metric. By default the metric contains only name and namespace labels. To include additional annotations provide a list of resource names in their plural form and Kubernetes annotation keys you would like to allow for them (Example: `namespaces=[kubernetes.io/team,...],pods=[kubernetes.io/team],...)`. A single '*' can be provided per resource instead to allow any annotations, but that has severe performance implications (Example: `pods=[*]`).
- `--ksm-metric-labels-allow-list` is a comma-separated list of additional Kubernetes label keys that will be used in the resource' labels metric. By default the metric contains only name and namespace labels. To include additional labels provide a list of resource names in their plural form and Kubernetes label keys you would like to allow for them (Example: `namespaces=[k8s-label-1,k8s-label-n,...],pods=[app],...)`. A single '*' can be provided per resource instead to allow any labels, but that has severe performance implications (Example: `pods=[*]`).

Run the following command to enable the Azure Monitor Metrics add-on, replacing the value for the `--ksm-metric-labels-allow-list` and/or `--ksm-metric-annotations-allow-list` parameters. The string value must be within the double quotes:
 
```azurecli
az aks update --enable-azuremonitormetrics -n <cluster-name> -g <cluster-resource-group> /
--ksm-metric-labels-allow-list "namespaces=[k8s-label-1,k8s-label-n]" /
--ksm-metric-annotations-allow-list "pods=[k8s-annotation-1,k8s-annotation-n]"
```

The output will be similar to the following:

```json
    "azureMonitorProfile": {
        "metrics": {
          "enabled": true,
          "kubeStateMetrics": {
            "metricAnnotationsAllowList": "pods=[k8s-annotation-1,k8s-annotation-n]",
            "metricLabelsAllowlist": "namespaces=[k8s-label-1,k8s-label-n]"
          }
        }
      }
```

---


## [Resource Manager](#tab/resource-manager)

>[!NOTE]
>The template needs to be deployed in the same resource group as the cluster.

### Prerequisites

- The Azure Monitor Workspace and Azure Managed Grafana instance must be created before you deploy the Resource Manager template.
- If you're using an existing Azure Managed Grafana instance that already has been linked to an azure monitor workspace while onboarding another cluster, get the list of azureMonitorWorkspaceIntegrations from the **Azure Managed Grafana Overview** page for the Azure Managed Grafana instance. Open the JSON View (with API version 2022-08-01) and copy the value of the following field. If it does not exists then the instance has not been linked with any Azure Monitor Workspace.

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

### Create or download templates

1. Download the template at [https://aka.ms/aks-enable-azuremonitormetrics](https://aka.ms/aks-enable-azuremonitormetrics) and save it as **existingClusterOnboarding.json**.
2. Download the parameter file at [https://aka.ms/aks-enable-azuremonitormetricsparameters](https://aka.ms/aks-enable-azuremonitormetricsparameters) and save it as **existingClusterParam.json**.
3. Edit the values in the parameter file.

  - For `clusterResourceId` and `clusterLocation`, use the values on the **AKS Overview** page for the AKS cluster.
  - For `azureMonitorWorkspaceResourceId` and `azureMonitorWorkspaceLocation`, use the values on the **Azure Monitor workspace Properties** page for the Azure Monitor workspace. 
  - For `metricLabelsAllowlist`, comma-separated list of Kubernetes labels keys that will be used in the resource's labels metric.
  - For `metricAnnotationsAllowList`, comma-separated list of additional Kubernetes label keys that will be used in the resource' labels metric.
  - For `grafanaResourceId`, `grafanaLocation` and `grafanaSku` , use the values on the **Azure Managed Grafana Overview** page for the Azure Managed Grafana instance (from the **id**, **location** and **sku.name** fields of the JSON View with API version 2022-08-01).
4. Open the template file and update the `grafanaIntegrations` property at the end of the file with the values that you stored in the pre-requisite. This will be similar to the following :

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
                }
                {
                "azureMonitorWorkspaceResourceId": "[parameters('azureMonitorWorkspaceResourceId')]"
                }
            ]
            }
        }
    ````

---


### Enable only metrics addon
Use the following procedure to install the Azure Monitor agent and the metrics addon to collect Prometheus metrics.
### [Azure portal](#tab/azure-portal)

1. Create an Azure Monitor workspace using the guidance at [Create an Azure Monitor workspace](../essentials/azure-monitor-workspace-overview.md#create-an-azure-monitor-workspace).
2. Open the **Azure Monitor workspaces** menu in the Azure portal and select your cluster.
3. Select **Managed Prometheus** to display a list of AKS clusters.
4. Click **Configure** next to the cluster you want to enable.

    :::image type="content" source="media/container-insights-prometheus-metrics-addon/azure-monitor-workspace-configure-prometheus.png" lightbox="media/container-insights-prometheus-metrics-addon/azure-monitor-workspace-configure-prometheus.png" alt-text="Screenshot of Azure Monitor workspace with Prometheus configuration.":::

### [CLI](#tab/cli)

## [Resource Manager](#tab/resource-manager)

---

## Verify Deployment

Run the following command to which verify that the daemonset was deployed properly:

`kubectl get ds ama-metrics-node --namespace=kube-system`

The output should resemble the following:

```
User@aksuser:~$ kubectl get ds ama-metrics-node --namespace=kube-system
NAME               DESIRED   CURRENT   READY   UP-TO-DATE   AVAILABLE   NODE SELECTOR   AGE
ama-metrics-node   1         1         1       1            1           <none>          10h
```

Run the following command to which verify that the replicaset was deployed properly:

`kubectl get rs --namespace=kube-system`

The output should resemble the following:

```
User@aksuser:~$kubectl get rs --namespace=kube-system
NAME                            DESIRED   CURRENT   READY   AGE
ama-metrics-5c974985b8          1         1         1       11h
ama-metrics-ksm-5fcf8dffcd      1         1         1       11h
```


## Limitations

- Ensure that you update the `kube-state metrics` Annotations and Labels list with proper formatting. There is a limitation in the Resource Manager template deployments that require exact values in the `kube-state` metrics pods. If the kuberenetes pods has any issues with malformed parameters and isn't running, then the feature will not work as expected.
- A data collection rule, data collection endpoint is created with the name `MSPROM-\<cluster-name\>-\<cluster-region\>`. These names cannot currently be modified.
- You must get the existing azure monitor workspace integrations for a grafana workspace and update the resource manager template with it, otherwise it will overwrite and remove the existing integrations from the grafana workspace.
- Azure CLI is currently the only available method to offboard.




## Next steps

- [Learn more about scraping Prometheus metrics](container-insights-prometheus.md).
- [Configure your cluster to send data to Azure Monitor Logs](container-insights-prometheus-metrics-addon.md).