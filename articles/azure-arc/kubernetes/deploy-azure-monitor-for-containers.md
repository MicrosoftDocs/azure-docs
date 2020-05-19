---
title: "Onboard Azure Arc with Azure Monitor for containers (Preview)"
services: azure-arc
ms.service: azure-arc
#ms.subservice: azure-arc-kubernetes coming soon
ms.date: 05/19/2020
ms.topic: article
author: mlearned
ms.author: mlearned
description: "Onboard Azure Arc with Azure Monitor for containers"
keywords: "Kubernetes, Arc, Azure, K8s, containers"
---

# Onboard Azure Monitor for containers with Arc (Preview)

Onboard [Azure Monitor enabled containers](https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-overview) to Azure Arc enabled Kubernetes cluster(s).

## Before you begin

* [Kubernetes versions](https://docs.microsoft.com/azure/aks/supported-kubernetes-versions)
* Linux distros for the cluster (master & worker) nodes – Ubuntu (18.04 LTS and 16.04 LTS)
* Minimum Contributor RBAC role permission on the Azure subscription of the Azure Arc enabled Kubernetes cluster
* Fully Qualified Azure Resource ID of the Azure Arc enabled Kubernetes cluster
* Kubeconfig context of the Kubernetes cluster
* Monitoring agent requires cAdvisor on the Kubelet is running on either secure port: 10250 or unsecure port: 10255 on the all nodes to pull the perf metrics   
* It is Recommended to configure the Kubelet cAdvisor port to secure port:10250.
* Monitoring Agent requires the following outbound ports and domains to send the monitoring data to the Azure Monitor backend (If blocked by proxy/firewall)
    -  *.ods.opinsights.azure.com 443
    -  *.oms.opinsights.azure.com 443
    -  *.blob.core.windows.net 443
    -  dc.services.visualstudio.com 443

## Onboarding

### Using HELM chart

### Option 1: Using PowerShell  script

1. Download the Onboarding script

	```console
	curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/haiku/onboarding_azuremonitor_for_containers.ps1
	 ```

2. Install [PowerShell core](https://docs.microsoft.com/PowerShell/scripting/install/installing-PowerShell?view=PowerShell-6) on your dev machine to execute the PowerShell onboarding script.

3. Login to Azure

	```console
	az login --use-device-code
	```

4. Execute below script with your cluster Azure Arc K8s Cluster ResourceId and context of the kubernetes cluster

	```console
	.\onboarding_azuremonitor_for_containers.ps1 -azureArcClusterResourceId <resourcedIdOfAzureArcCluster> -kubeContext <kube-context>

	For Example ..
	.\onboarding_azuremonitor_for_containers.ps1 -azureArcClusterResourceId /subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1 -kubeContext MyK8sTestCluster
	 ```

### Option 2: Using Bash Script

> **Tip:** The script uses bash 4 features, so make sure your bash is up to date. You can check your current version with `bash --version`.

1. Download the Onboarding script

	```console
	curl -LO https://raw.githubusercontent.com/microsoft/OMS-docker/ci_feature/docs/haiku/onboarding_azuremonitor_for_containers.sh
	 ```

2. Execute below script with your cluster Azure Arc K8s Cluster ResourceId and context of the kubernetes cluster

	```console
	bash onboarding_azuremonitor_for_containers.sh <resourcedIdOfAzureArcCluster>  <kube-context>

	For Example:
	bash onboarding_azuremonitor_for_containers.sh /subscriptions/57ac26cf-a9f0-4908-b300-9a4e9a0fb205/resourceGroups/AzureArcTest/providers/Microsoft.Kubernetes/connectedClusters/AzureArcTest1 MyK8sTestCluster

	 ```

## Configure agent data collection

By default, the agent doesn't collect stdout and stderr logs of containers in kube-system namespace.
Refer to https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-agent-config to configure agent with desired data collection settings.

## Configure scraping of Prometheus metrics

Azure Monitor for containers scrapes the Prometheus metrics and ingest to the Azure Monitor backend.
Refer to https://docs.microsoft.com/azure/azure-monitor/insights/container-insights-prometheus-integration for the instructions on how to configure Prometheus scraping.

## User interface

Navigate to  https://aka.ms/azmon-containers-azurearc to view the Onboarded Cluster.

## Disable Monitoring

If you would like to disable monitoring due to some reason, you can just simply delete the Azure Monitor for containers HELM chart to stop collecting and ingesting  monitoring  data to Azure Monitor for containers backend.

	```console
	helm del azmon-containers-release-1
	```

## Next steps

* [Use Azure Policy to govern cluster configuration](./use-azure-policy.md)

