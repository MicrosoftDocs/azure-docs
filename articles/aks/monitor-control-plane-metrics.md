---
title: Monitor Azure Kubernetes Service control plane metrics (preview)
description: Learn how to collect metrics from the Azure Kubernetes Service (AKS) control plane and view the telemetry in Azure Monitor. 
author: aritraghosh
ms.author: aritraghosh
ms.service: azure-kubernetes-service
ms.custom: 
ms.topic: how-to
ms.date: 01/08/2024

#CustomerIntent: As a platform engineer, I want to collect metrics from the control plane and monitor them for any potential issues
---

# Monitor Azure Kubernetes Service (AKS) control plane metrics (preview)

The Azure Kubernetes Service (AKS) [control plane](concepts-clusters-workloads.md#control-plane) health is critical for the performance and reliability of the cluster. Control plan metrics provide additional visibility into its availability and performance, allowing you to maximize overall observability and maintain operational excellence. These metrics are fully compatible with Prometheus and Grafana, and can be customized to only store what you consider necessary. With these new metrics, you can collect all metrics from API server, ETCD, Scheduler, Autoscaler, and controller manager.

This article helps you understand this new feature, how to implement it, and how to observe the telemetry collected.

## Prerequisites and limitations

- Only supports [Azure Monitor managed service for Prometheus](../azure-monitor/essentials/prometheus-metrics-overview.md).
- [Private link](../azure-monitor/logs/private-link-security.md) is not supported.
- Only the default [ama-metrics-settings-config-map](../azure-monitor/containers/prometheus-metrics-scrape-configuration.md#configmaps) can be customized. All other customizations are not supported.
- The cluster must use [managed identity authentication](use-managed-identity.md).

### Install or update the `aks-preview` Azure CLI extension

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

Install the `aks-preview` Azure CLI extension using the [`az extension add`][az-extension-add] command.

```azurecli-interactive
az extension add --name aks-preview
```

If you need to update the extension version, you can do this using the [`az extension update`][az-extension-update] command.

```azurecli-interactive
az extension update --name aks-preview
```

### Register the 'AzureMonitorMetricsControlPlanePreview' feature flag

Register the `AzureMonitorMetricsControlPlanePreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace "Microsoft.ContainerService" --name "AzureMonitorMetricsControlPlanePreview"
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature show][az-feature-show] command:

```azurecli-interactive
az feature show --namespace "Microsoft.ContainerService" --name "AzureMonitorMetricsControlPlanePreview"
```

When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace "Microsoft.ContainerService"
```

## Enable Control plane metrics on your AKS cluster

You can enable control plane metrics with the Azure Monitor managed service for Prometheus add-on during cluster creation or for an existing cluster. To collect Prometheus metrics from your Kubernetes cluster, see [Enable Prometheus and Grafana for Kubernetes clusters][enable-monitoring-kubernetes-cluster] and follow the steps on the **CLI** tab for an AKS cluster. On the command-line, be sure to include the parameters `--generate-ssh-keys` and `--enable-managed-identity`.

>[!NOTE]
> Unlike the metrics collected from cluster nodes, control plane metrics are collected by a component which is not part of the **ama-metrics** add-on. Enabling the `AzureMonitorMetricsControlPlanePreview` feature flag and the managed prometheus add-on ensures control plane metrics are collected. After enabling metric collection, it can take several minutes for the data to appear in the workspace.

## Querying Control Plane metrics

Control plane metrics are stored in an Azure monitor workspace in the cluster's region. They can be queried directly from the workspace or through the Azure Managed Grafana instance connected to the workspace. To find the Azure Monitor workspace associated with the cluster, from the left-hand pane of your selected AKS cluster, navigate to the **Monitoring** section and select **Insights**. On the Container Insights page for the cluster, select **Monitor Settings**.

![Azure monitor workspace](media/controlplane-metrics/insights-azmon.png)

If you are using Azure Managed Grafana to visualize the data, you can import the following dashboards. AKS provides dashboard templates to help you view and analyze your control plane telemetry data in real-time.

* API server
* ETCD
* Scheduler
* Autoscaler
* Controller manager

## Customize control plane metrics

By default, AKs includes a pre-configured set of metrics to collect and store for each component. `API server` and `etcd` are enabled by default. This list can be customized through the [ama-settings-configmap](https://github.com/Azure/prometheus-collector/blob/89e865a73601c0798410016e9beb323f1ecba335/otelcollector/configmaps/ama-metrics-settings-configmap.yaml). The list of `minimal-ingestion` profile metrics are available [here](controlplane-metrics-defaultlist.md).

The following lists the default targets:

```yaml
controlplane-apiserver = true
controlplane-cluster-autoscaler = false
controlplane-kube-scheduler = false
controlplane-kube-controller-manager = false
controlplane-etcd = true
```

The various options are similar to Azure Managed Prometheus listed [here](/azure/azure-monitor/containers/prometheus-metrics-scrape-configuration-minimal#scenarios).

### Collect only minimal metrics for the default targets

This is the default behavior with the setting default-targets-metrics-keep-list.minimalIngestionProfile="true". Only metrics listed below are ingested for each of the default targets which in this case are `controlplane-apiserver` and `controlplane-etcd`. 

### Collect all metrics from the target 

- Download the configmap [here]( https://github.com/Azure/prometheus-collector/blob/89e865a73601c0798410016e9beb323f1ecba335/otelcollector/configmaps/ama-metrics-settings-configmap.yaml)  and rename it to confimap-controlplane.yaml
- Set ` minimalingestionprofile = false` and ensure the targets(under `default-scrape-settings-enabled`) that you want to scrape are set to true (the only ones relevant here are controlplane-apiserver,controlplane-cluster-autoscaler,controlplane-kube-scheduler,controlplane-kube-controller-manager ,controlplane-etcd) 
- Apply the configmap 
```
kubectl apply -f confimap-controlplane.yaml
```
- Wait for sometime (4-5 min)
- All metrics from the `true` targets will appear in the Azure Monitor workspace

### Collect minimal ingestionprofile and curated set of metrics

- Download the configmap [here]( https://github.com/Azure/prometheus-collector/blob/89e865a73601c0798410016e9beb323f1ecba335/otelcollector/configmaps/ama-metrics-settings-configmap.yaml)  and rename it to confimap-controlplane.yaml
- Set ` minimalingestionprofile = true` and ensure the targets ( under `default-scrape-settings-enabled`) that you want to scrape are set to true (the only ones relevant here are controlplane-apiserver,controlplane-cluster-autoscaler,controlplane-kube-scheduler,controlplane-kube-controller-manager ,controlplane-etcd) 
- Add the list of metrics for the specific `true` targets under the `default-target-metrics-list` to a custom list, for eg 

```
controlplane-apiserver= "apiserver_admission_webhook_admission_duration_seconds| apiserver_longrunning_requests"
```
- Apply the configmap 

```
kubectl apply -f confimap-controlplane.yaml
```
- Wait for sometime (4-5 min)
- default metrics + the custom list  from the `true` targets should appear in the Azure Monitor workspace

### Collect only specific metrics from some targets

Download the configmap [here]( https://github.com/Azure/prometheus-collector/blob/89e865a73601c0798410016e9beb323f1ecba335/otelcollector/configmaps/ama-metrics-settings-configmap.yaml)  and rename it to confimap-controlplane.yaml
- Set ` minimalingestionprofile = false` and ensure the targets ( under `default-scrape-settings-enabled`) that you want to scrape are set to true (the only ones relevant here are controlplane-apiserver,controlplane-cluster-autoscaler,controlplane-kube-scheduler,controlplane-kube-controller-manager ,controlplane-etcd) 
- Add the list of metrics for the specific `true` targets under the `default-target-metrics-list` to a custom list, for eg 

```
controlplane-apiserver= "apiserver_admission_webhook_admission_duration_seconds| apiserver_longrunning_requests"
```
- Apply the configmap 

```
kubectl apply -f confimap-controlplane.yaml
```
- Wait for sometime (4-5 min)
- The custom list  from the `true` targets should appear in the Azure Monitor workspace

## Troubleshoot control plane metrics issues
Make sure to check that the feature flag `AzureMonitorMetricsControlPlanePreview` is enabled and the ama-metrics pods are running

> [!NOTE]
> The [troubleshooting methods](/azure/azure-monitor/containers/prometheus-metrics-troubleshoot) for Managed Prometheus will not translate directly here as the components scraping the control plane are not present in the managed prometheus add-on.


## Configmap formatting or errors
- Make sure to double check the formatting of the configmap and if the fields are rightly populated with the intended values, specifically the default-targets-metrics-keep-list, minimal-ingestion-profile , default-scrape-settings-enabled


### Isolate control plane vs data plane issue
- Start by setting some of the [node related metrics](/azure/azure-monitor/containers/prometheus-metrics-scrape-default) to true and see if the metrics are flowing, this will help to make sure if the issue is specific to control plane. 

### Events ingested

- Once you have applied the new changes, navigate to the metrics tab of the associated azure monitor workspace and check for an increase or decrease in the number of events ingested per minute, this should give an idea if the specific metric is missing or all  metrics are missing


### Metric itself is not exposed
- We have seen cases where the metric is documented but it is not exposed from the target and thus doesn't flow to the AzMon workspace, in this case its best to try and make sure other metrics are flowing. 

### No access to the Azure Monitor workspace

When enabling the add-on, it's possible that you used an already existing workspace. It's possible that you don't have access to the existing workspace. In that case, it might look like the metrics are not being emitted. Make sure that you are creating a new workspace when enabling the add-on or creating the cluster.



In the future, we plan to have events which customer will be able to debug the issue. Please create a support case to investigate the issue.


## Disable Control Plane metrics on your AKS cluster

You can disable Control plane metrics  at any time either by disabling the flag or disabling managed prometheus or deleting the AKS cluster.

> [!NOTE]
> This action doesn't remove any existing data stored in your Azure Monitor workspace.

```azurecli
az aks update --disable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group>
```

## Next steps

- [Learn more about default metrics list for control plane](controlplane-metrics-defaultlist.md)

<!-- INTERNAL LINKS -->
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[enable-monitoring-kubernetes-cluster]: ../azure-monitor/containers/kubernetes-monitoring-enable.md&tabs=cli#enable-prometheus-and-grafana