---
title: Configure Elasticsearch integration for Prometheus metrics in Azure Monitor
description: Describes how to configure Elasticsearch monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/19/2024
ms.reviewer: rashmy
ms.service: azure-monitor
ms.subservice: containers
---
# Elasticsearch
Elasticsearch is the distributed search and analytics engine at the heart of the Elastic Stack. It is where the indexing, search, and analysis magic happen.
This article describes how to configure Azure Managed Prometheus with Azure Kubernetes Service(AKS) to monitor elastic search clusters by scraping prometheus metrics. 

## Prerequisites

+ Elasticsearch cluster running on AKS
+ Azure Managed prometheus enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)


### Install Elasticsearch Exporter
Install the [Elasticsearch exporter](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-elasticsearch-exporter) using the helm chart.

```bash
helm install azmon-elasticsearch-exporter --version 5.7.0 prometheus-community/prometheus-elasticsearch-exporter --set es.uri="https://username:password@elasticsearch-service.namespace:9200" --set podMonitor.enabled=true --set podMonitor.apiVersion=azmonitoring.coreos.com/v1
```

> [!NOTE] 
> Managed prometheus pod/service monitor configuration with helm chart installation is only supported with the helm chart version >=5.7.0.
>
> The [prometheus-elasticsearch-exporter](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus-elasticsearch-exporter) helm chart can be configured with [values](https://github.com/prometheus-community/helm-charts/blob/main/charts/prometheus-elasticsearch-exporter/values.yaml) yaml.
Please specify the right server address where the Elasticsearch server can be reached. Based on your configuration set the username,password or certs used to authenticate with the Elasticsearch server. Set the address where Elasticsearch is reachable using the argument "es.uri" ex - .
>
> You could also use service monitor, instead of pod monitor by using the **--set serviceMonitor.enabled=true** helm chart paramaters. Make sure to use the api version supported by Azure Managed Prometheus using the parameter **serviceMonitor.apiVersion=azmonitoring.coreos.com/v1**.
>
> If you want to configure any other service or pod monitors, please follow the instructions [here](prometheus-metrics-scrape-crd.md#create-a-pod-or-service-monitor).


### Deploy Rules
1. Download the template and parameter files

    **Recording Rules**
   - [Template file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/ElasticSearch/elasticsearch-recording-rules.json)
   - [Parameter file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Recording-Rules-Parameters.json)

    **Alerting Rules**
   - [Template file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/ElasticSearch/elasticsearch-alerting-rules.json)
   - [Parameter file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Alert-Rules-Parameters.json)


2. Edit the following values in the parameter files. Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspace` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `location` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterName` | Name of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `actionGroupId` | Resource ID for the alert action group. Retrieve from the **JSON view** on the **Overview** page for the action group. Learn more about [action groups](../alerts/action-groups.md) |

3. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

4. Once deployed, you can view the rules in the Azure portal as described in - [Prometheus Alerts](../essentials/prometheus-rule-groups.md#view-prometheus-rule-groups)

> [!Note] 
> Review the alert thresholds to make sure it suits your cluster/worklaods and update it accordingly.
>
> Please note that the above rules are not scoped to a cluster. If you would like to scope the rules to a specific cluster, see [Limiting rules to a specific cluster](../essentials/prometheus-rule-groups.md#limiting-rules-to-a-specific-cluster) for more details.
>
> Learn more about [Prometheus Alerts](../essentials/prometheus-rule-groups.md).
>
> If you want to use any other OSS prometheus alerting/recording rules please use the converter here to create the azure equivalent prometheus rules [az-prom-rules-converter](https://aka.ms/az-prom-rules-converter)

### Import the Grafana Dashboard

Follow the instructions on [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-grafana-dashboard) to import the grafana dashboards using the ID or JSON.</br>

[Elastic Search Overview](https://github.com/grafana/jsonnet-libs/blob/master/elasticsearch-mixin/dashboards/elasticsearch-overview.json)(ID-2322)</br>
[Elasticsearch Exporter Quickstart and Dashboard](https://grafana.com/grafana/dashboards/14191-elasticsearch-overview/)(ID-14191)


### Troubleshooting
When the service monitors is successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface). 

