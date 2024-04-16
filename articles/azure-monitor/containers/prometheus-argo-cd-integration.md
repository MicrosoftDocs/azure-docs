---
title: Configure Argo CD integration for Prometheus metrics in Azure Monitor
description: Describes how to configure Argo CD monitoring using Prometheus metrics in Azure Monitor to Kubernetes cluster.
ms.topic: conceptual
ms.date: 3/25/2024
ms.reviewer: rashmy
ms.service: azure-monitor
ms.subservice: containers
---
# Argo CD
Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes. Argo CD follows the GitOps pattern of using Git repositories as the source of truth for defining the desired application state. It automates the deployment of the desired application states in the specified target environments. Application deployments can track updates to branches, tags, or pinned to a specific version of manifests at a Git commit.
This article describes how to configure Azure Managed Prometheus with Azure Kubernetes Service(AKS) to monitor Argo CD by scraping prometheus metrics. 

## Prerequisites

+ Argo CD running on AKS
+ Azure Managed Prometheus enabled on the AKS cluster - [Enable Azure Managed Prometheus on AKS](kubernetes-monitoring-enable.md#enable-prometheus-and-grafana)

### Deploy Service Monitors
Deploy the following service monitors to configure Azure managed prometheus addon to scrape prometheus metrics from the argocd workload.

> [!NOTE] 
> Please specify the right labels in the matchLabels for the service monitors if they do not match the configured ones in the sample.

```yaml
apiVersion: azmonitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: azmon-argocd-metrics
spec:
  labelLimit: 63
  labelNameLengthLimit: 511
  labelValueLengthLimit: 1023
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
  labelLimit: 63
  labelNameLengthLimit: 511
  labelValueLengthLimit: 1023
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
  labelLimit: 63
  labelNameLengthLimit: 511
  labelValueLengthLimit: 1023
  selector:
    matchLabels:
      app.kubernetes.io/name: argocd-server-metrics
  namespaceSelector:
    any: true
  endpoints:
  - port: metrics
  ```

> [!NOTE] 
> If you want to configure any other service or pod monitors, please follow the instructions [here](prometheus-metrics-scrape-crd.md#create-a-pod-or-service-monitor).

### Deploy Rules
1. Download the template and parameter files

    **Alerting Rules**
   - [Template file](https://github.com/Azure/prometheus-collector/blob/main/Azure-ARM-templates/Workload-Rules/Argo/argocd-alerting-rules.json)
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
> Review the alert thresholds to make sure it suits your cluster/workloads and update it accordingly.
>
> Please note that the above rules are not scoped to a cluster. If you would like to scope the rules to a specific cluster, see [Limiting rules to a specific cluster](../essentials/prometheus-rule-groups.md#limiting-rules-to-a-specific-cluster) for more details.
>
> Learn more about [Prometheus Alerts](../essentials/prometheus-rule-groups.md).
>
> If you want to use any other OSS prometheus alerting/recording rules please use the converter here to create the azure equivalent prometheus rules [az-prom-rules-converter](https://aka.ms/az-prom-rules-converter)


### Import the Grafana Dashboard

To import the grafana dashboards using the ID or JSON, follow the instructions to [Import a dashboard from Grafana Labs](../../managed-grafana/how-to-create-dashboard.md#import-a-grafana-dashboard). </br>

[ArgoCD](https://grafana.com/grafana/dashboards/14584-argocd/)(ID-14191)


### Troubleshooting
When the service monitors is successfully applied, if you want to make sure that the service monitor targets get picked up by the addon, follow the instructions [here](prometheus-metrics-troubleshoot.md#prometheus-interface). 


