---
title: Azure Monitor integration for Azure Red Hat OpenShift 4.3
description:  Learn how to enable Azure Monitor on your Microsoft Azure Red Hat OpenShift cluster.
author: sakthi-vetrivel
ms.author: suvetriv
ms.service: container-service
ms.topic: conceptual
ms.date: 03/06/2020
---

# Azure Monitor integration for Azure Red Hat OpenShift 4.3

> [!IMPORTANT] 
> Please note that Azure Red Hat OpenShift 4.3 is currently only available in private preview in East US. Private preview acceptance is by invitation only. Please be sure to register your subscription before attempting to enable this feature: [Azure Red Hat OpenShift Private Preview Registration](https://aka.ms/aro-preview-register)

> [!NOTE]
> Preview features are self-service and are provided as is and as available and are excluded from the service-level agreement (SLA) and limited warranty. Therefore, the features aren't meant for production use.

This article describes how to enable the private preview of Azure Monitor for containers for OpenShift 4.3 clusters hosted on-prem or in any cloud environment. The same instructions also apply to enable monitoring for Azure Red Hat OpenShift (ARO) 4.3 clusters.  

## Prerequisites

- [Azure CLI](https://docs.microsoft.com/cli/azure/install-azure-cli?view=azure-cli-latest)
- [Helm 3](https://helm.sh/docs/intro/install/)
- Access to kubeconfig of the kubernetes cluster
- Access to an Azure subscription
- Access to the OpenShift 4.3 cluster to install the Azure Monitor for Containers Helm chart
- Minimum Contributor RBAC role permission on the Azure Subscription  
- Monitoring Agent requires the following outbound ports - and domains to send the monitoring data to the Azure Monitor backend (If blocked by proxy/firewall):
  - *.ods.opinsights.azure.com 443
  - *.oms.opinsights.azure.com 443
  - *.blob.core.windows.net 443
  - dc.services.visualstudio.com 443

## Onboarding

> [!TIP]
> The script uses bash 4 features, so make sure your bash is up to date. You can check your current version with `bash --version`.

### Download the onboarding script

```bash
curl -LO  https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/openshiftV4/onboarding_azuremonitor_for_containers.sh
```

Execute the following script with azureSubscriptionId, workspace Region, clusterName, and context of the Kubernetes cluster.

```bash
bash onboarding_azuremonitor_for_containers.sh <azureSubscriptionId> <azureRegionforLogAnalyticsWorkspace> <clusterName> <kubeconfigContextNameOftheCluster>
```

For example:

```bash
 bash onboarding_azuremonitor_for_containers.sh 27ac26cf-a9f0-4908-b300-9a4e9a0fb205 eastus myocp42 admin 
```

## Configure agent data collection

By default, Monitoring Agent collects the {stdout; stderr} container logs of all the containers running in all the namespaces except kube-system.  If you want to configure the container log collection specific to particular namespace or namespaces, you can  refer to [Container Insights agent configuration](../azure-monitor/insights/container-insights-agent-config.md). Here, you can configure Monitoring agent with desired data collection settings using config map.

## Configure scraping of Prometheus metrics

Azure Monitor for containers scrapes the Prometheus metrics and ingest to the Azure Monitor backend. Refer to [Container Insights Prometheus configuration](../azure-monitor/insights/container-insights-prometheus-integration.md) for the instructions how to configure Prometheus scraping.

After successful onboarding, navigate to [Hybrid Monitoring](https://aka.ms/azmon-containers-hybrid) and select Environment as **"All"** to view your newly onboarded OpenShift v4 cluster.

## Disable monitoring

If you would like to disable monitoring, you can delete the Azure Monitor for Containers Helm chart using the following command to stop collecting and ingesting monitoring data to Azure Monitor for containers backend.

``` bash
helm del azmon-containers-release-1
```

## Update monitoring

Rerun the onboarding script as described in the [Onboarding](#onboarding) section with the same parameter to update to latest Helm chart.

## After successful onboarding

Navigate to [Hybrid Monitoring](https://aka.ms/azmon-containers-hybrid), and you can see your newly enabled OpenShift/ARO v4 cluster with health status in the **Monitored Clusters** tab. There, you can get into deeper insights such as metrics, inventory, and logs by clicking the **Cluster** column.

## Supported features

For more on the supported features and functionality, see [Container Insights overview](../azure-monitor/insights/container-insights-overview.md).

Contact us via askcoin@microsoft.com for feedback and questions.

## Next steps

To learn more about monitoring, see:
- [Container Insights overview](../azure-monitor/insights/container-insights-overview.md)

- [Log Query overview](../azure-monitor/log-query/log-query-overview.md)
