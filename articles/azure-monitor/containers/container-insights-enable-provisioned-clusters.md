---
title: Monitor AKS hybrid clusters
ms.date: 01/10/2023
ms.topic: article
description: Collect metrics and logs of AKS hybrid clusters using Azure Monitor.
ms.reviewer: aul
---

# Azure Monitor container insights for Azure Kubernetes Service (AKS) hybrid clusters (preview)

>[!NOTE]
>Support for monitoring AKS hybrid clusters is currently in preview. We recommend only using preview features in safe testing environments.

[Azure Monitor container insights](./container-insights-overview.md) provides a rich monitoring experience for [AKS hybrid clusters (preview)](/azure/aks/hybrid/aks-hybrid-options-overview). This article describes how to set up Container insights to monitor an AKS hybrid cluster.

## Supported configurations

- Azure Monitor container insights supports monitoring only Linux containers.

## Prerequisites

- Pre-requisites listed under the [generic cluster extensions documentation](../../azure-arc/kubernetes/extensions.md#prerequisites).
- Log Analytics workspace. Azure Monitor Container Insights supports a Log Analytics workspace in the regions listed under Azure [products by region page](https://azure.microsoft.com/global-infrastructure/services/?regions=all&products=monitor). You can create your own workspace using [Azure Resource Manager](../logs/resource-manager-workspace.md), [PowerShell](../logs/powershell-workspace-configuration.md), or [Azure portal](../logs/quick-create-workspace.md).
- [Contributor](../../role-based-access-control/built-in-roles.md#contributor) role assignment on the Azure subscription containing the Azure Arc-enabled Kubernetes resource. If the Log Analytics workspace is in a different subscription, then [Log Analytics Contributor](../logs/manage-access.md#azure-rbac) role assignment is needed on the Log Analytics workspace.
- To view the monitoring data, you need to have [Log Analytics Reader](../logs/manage-access.md#azure-rbac) role assignment on the Log Analytics workspace.
- The following endpoints need to be enabled for outbound access in addition to the [Azure Arc-enabled Kubernetes network requirements](../../azure-arc/kubernetes/network-requirements.md).
- Azure CLI version 2.43.0 or higher
- Azure k8s-extension version 1.3.7 or higher
- Azure Resource-graph version 2.1.0

## Onboarding

## [CLI](#tab/create-cli)

```acli
az login

az account set --subscription <cluster-subscription-name>

az k8s-extension create --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type provisionedclusters --cluster-resource-provider "microsoft.hybridcontainerservice" --extension-type Microsoft.AzureMonitor.Containers --configuration-settings amalogs.useAADAuth=true
```
## [Azure portal](#tab/create-portal)

### Onboarding from the AKS hybrid resource pane

1. In the Azure portal, select the AKS hybrid cluster that you wish to monitor.

2. From the resource pane on the left, select the 'Insights' item under the 'Monitoring' section.

3. On the onboarding page, select the 'Configure Azure Monitor' button

4. You can now choose the [Log Analytics workspace](../logs/quick-create-workspace.md) to send your metrics and logs data to.

5. Select the 'Configure' button to deploy the Azure Monitor Container Insights cluster extension.

### Onboarding from Azure Monitor pane

1. In the Azure portal, navigate to the 'Monitor' pane, and select the 'Containers' option under the 'Insights' menu.

2. Select the 'Unmonitored clusters' tab to view the AKS hybrid clusters that you can enable monitoring for.

3. Click on the 'Enable' link next to the cluster that you want to enable monitoring for.

4. Choose the Log Analytics workspace. 

5. Select the 'Configure' button to continue.


## [Resource Manager](#tab/create-arm)

1. Download the Azure Resource Manager Template and Parameter files

```bash
curl -L https://aka.ms/existingClusterOnboarding.json -o existingClusterOnboarding.json
```

```bash
curl -L https://aka.ms/existingClusterParam.json -o existingClusterParam.json
```

2. Edit the values in the parameter file.

  - For clusterResourceId and clusterRegion, use the values on the Overview page for the LCM cluster
  - For workspaceResourceId, use the resource ID of your Log Analytics workspace
  - For workspaceRegion, use the Location of your Log Analytics workspace
  - For workspaceDomain, use the workspace domain value as “opinsights.azure.com” for public cloud and for Microsoft Azure operated by 21Vianet cloud as “opinsights.azure.cn”
  - For resourceTagValues, leave as empty if not specific

3. Deploy the ARM template

```azurecli
az login

az account set --subscription <cluster-subscription-name>

az deployment group create --resource-group <resource-group> --template-file ./existingClusterOnboarding.json --parameters existingClusterParam.json
```
---

## Validation

### Extension details

Showing the extension details:

```azcli
az k8s-extension list --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type provisionedclusters --cluster-resource-provider "microsoft.hybridcontainerservice"
```


## Delete extension

The command for deleting the extension:

```azcli
az k8s-extension delete --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type provisionedclusters --cluster-resource-provider "microsoft.hybridcontainerservice" --name azuremonitor-containers --yes
```

## Known Issues/Limitations

- Windows containers are not supported currently
