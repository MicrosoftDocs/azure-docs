---
title: Configure argocd integration for Prometheus metrics in Azure Monitor
description: Describes how to configure argocd monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/25/2024
ms.reviewer: aul
---
# Argo CD
Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes.
This article describes how to configure Azure Managed Prometheus with AKS to monitor Argo CD by scraping prometheus metrics. 

## Prerequisites

+ Argo CD running on AKS
+ Azure Managed prometheus enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)


> [!NOTE] 
> Please specify the right labels in the matchLabels for the service monitors if they do not match the configured ones in the sample below.

### Deploy Service Monitors
Deploy the following service monitor to configure azure managed prometheus addon to scrape prometheus metrics from the exporter
```yaml
apiVersion: azmonitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: azmon-argocd-metrics
spec:
  selector:
    matchLabels:
     app.kubernetes.io/name: argocd-metrics
  namespaceSelector:
    any: true
  endpoints:
  - port: metrics
---
apiVersion: azmonitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: azmon-argocd-repo-server-metrics
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-repo-server
  namespaceSelector:
    any: true
  endpoints:
  - port: metrics
---
apiVersion: azmonitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: azmon-argocd-server-metrics
spec:
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-server-metrics
  namespaceSelector:
    any: true
  endpoints:
  - port: metrics
  ```


### Deploy Rules
1. Deploy the following alerting rules to alert based on the metrics ingested.

[Alerting Rules](https://github.com/Azure/prometheus-collector/blob/rashmi/rules/Azure-ARM-templates/Workload-Rules/Argo/argocd-alerting-rules.json)

2. Edit the following values in the parameter files for the [alerting rules](https://github.com/Azure/prometheus-collector/blob/rashmi/rules/Azure-ARM-templates/Workload-Rules/Alert-Rules-Parameters.json). Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Value |
    |:---|:---|
    | `azureMonitorWorkspaceResourceId` | Resource ID for the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `location` | Location of the Azure Monitor workspace. Retrieve from the **JSON view** on the **Overview** page for the Azure Monitor workspace. |
    | `clusterName` | Name of the AKS cluster. Retrieve from the **JSON view** on the **Overview** page for the cluster. |
    | `actionGroupResourceId` | Resource ID for the alert action group. Retrieve from the **JSON view** on the **Overview** page for the action group. Learn more about [action groups](../alerts/action-groups.md) |

3. Deploy the template by using any standard methods for installing ARM templates. For guidance, see [ARM template samples for Azure Monitor](../resource-manager-samples.md).

4. Once deployed, you can view the rules in the Azure Portal as described in - [Prometheus Alerts](../essentials/prometheus-rule-groups.md#view-prometheus-rule-groups)

> [!Note] 
> Learn more about [Prometheus Alerts](../essentials/prometheus-rule-groups.md).</br>
> If you want to use any other OSS prometheus alerting/recording rules please use the converter here to create the azure equivalent prometheus rules [az-prom-rules-converter](https://aka.ms/az-prom-rules-converter).</br>
> Please note that the above rules are not scoped to a cluster. If you would like to scope the rules to a specific cluster, see [Limiting rules to a specific cluster](../essentials/prometheus-rule-groups.md#limiting-rules-to-a-specific-cluster) for more details.

### Import the Grafana Dashboard

Follow the instructions on [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-grafana-dashboard) to import the grafana dashboards using the ID or JSON.</br>

[ArgoCD](https://grafana.com/grafana/dashboards/14584-argocd/)(ID-14191)


### Troubleshooting
When the service monitors is successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface). 

  :::image type="content" source="media/prometheus-metrics-troubleshoot/service-monitor-kafka.png" alt-text="Screenshot showing targets for pod/service monitor" lightbox="media/prometheus-metrics-troubleshoot/service-monitor-kafka.png":::

