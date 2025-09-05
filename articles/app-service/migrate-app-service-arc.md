---
title: Migration Checklist - Azure App Service on Arc-enabled Kubernetes to Azure Container Apps on Arc-enabled Kubernetes
description: Learn what needs to be done to migrate from Azure App Service on Arc-enabled Kubernetes to Azure Container Apps on Arc-enabled Kubernetes.
ms.topic: how-to
ms.date: 09/02/2025
ms.author: anwestg
author: apwestgarth
ms.service: azure-app-service
---
# Migrate from Azure App Service on Arc-enabled Kubernetes to Azure Container Apps on Arc-enabled Kubernetes

This article provides a checklist of items and considerations for you to work through in migrating from Azure App Service on Arc-enabled Kubernetes.

## Assessment and planning

First you should identify any workloads running on App Service on Arc-enabled Kubernetes. Run the following Azure Resource Graph Queries to list Web Applications, App Service Kubernetes Environments, and Arc-enabled Kubernetes clusters that have the Application services extension installed on them:

### Identify all web applications running on App Service on Arc-enabled Kubernetes

```kusto
resources
| where type=~"microsoft.web/sites" and kind contains "app,linux,kubernetes"
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type =~ 'microsoft.web/sites" and kind contains 'app,linux,kubernetes'"
```
# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type=~ 'microsoft.web/sites" and kind contains 'app,linux,kubernetes'"
```
---

### Identify all App Service Kubernetes Environments connected to App Service on Arc-enabled Kubernetes

```kusto
resources
| where type=~"microsoft.web/kubeenvironments"
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "resources | where type=~'microsoft.web/kubeenvironments'"
```
# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "resources | where type=~'microsoft.web/kubeenvironments'"
```
---

### Identify all Azure Arc-enabled Kubernetes Clusters that have the Application services extension installed on them

```kusto
KubernetesConfigurationResources 
| where type =~ 'microsoft.kubernetesconfiguration/extensions' 
| where properties.ExtensionType == 'microsoft.web.appservice' 
| project clusterresourceid = trim_end('/providers/Microsoft.KubernetesConfiguration/Extensions/.*', ['id']), name, location
```

# [Azure CLI](#tab/azure-cli)

```azurecli-interactive
az graph query -q "KubernetesConfigurationResources | where type =~ 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.web.appservice' | project clusterresourceid = trim_end('/providers/Microsoft.KubernetesConfiguration/Extensions/.*', ['id']), name, location"
```
# [Azure PowerShell](#tab/azure-powershell)

```azurepowershell-interactive
Search-AzGraph -Query "KubernetesConfigurationResources | where type =~ 'microsoft.kubernetesconfiguration/extensions' | where properties.ExtensionType == 'microsoft.web.appservice' | project clusterresourceid = trim_end('/providers/Microsoft.KubernetesConfiguration/Extensions/.*', ['id']), name, location"
```
---

## Remove Application Services extension from Arc-enabled Kubernetes clusters 

The Azure Container Apps on Arc-enabled Kubernetes extension can't be installed on a cluster that already has the Application services extension installed on it. You must either remove the Application services extension from your connected cluster first or install the Azure Container Apps on Arc-enabled Kubernetes extension on a new cluster.

### Uninstall the extension to use the same cluster

To uninstall the Application services extension, you must:

1. Delete any App Service Kubernetes Environments, associated Web Applications, and App Service Plans from the connected cluster.
1. Uninstall the Application services extension from your connected cluster.

## Set up Azure Container Apps on Arc-enabled Kubernetes

[Azure Container Apps on Arc-enabled Kubernetes](../container-apps/azure-arc-overview.md) can be installed on an Arc-enabled Kubernetes cluster that satisfies the following requirements:

1. The cluster **must** support the [LoadBalancer](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) service type.
1. The cluster **must** be connected to one of the supported [Azure Regions](../container-apps/azure-arc-overview.md#limitations).
1. All Container Apps must be deployed in Linux containers. No Windows support is available.

If your cluster satisfies these requirements, then follow the documentation to [Enable Azure Container Apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-enable-cluster.md)).

## Create Container Apps

For any applications that you're migrating from Azure App Service on Arc-enabled Kubernetes to Azure Container Apps on Arc-enabled Kubernetes, you must containerize them before deploying.

You can deploy your application from an [existing container image](https://aka.ms/acaonarck8sup), [deploy from code](https://aka.ms/acaonarck8sup), or [deploy from code in GitHub](https://aka.ms/acaonarck8sup) 

## Related content

* [Azure Container Apps on Azure Arc=enabled Kubernetes - Overview](../container-apps/azure-arc-overview.md)
* [Setup Azure Container Apps on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-enable-cluster.md)
* [Tutorial: Create an Azure Container App on Azure Arc-enabled Kubernetes](../container-apps/azure-arc-create-container-app.md)


