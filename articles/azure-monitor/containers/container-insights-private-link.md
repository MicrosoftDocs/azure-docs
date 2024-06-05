---
title: Enable private link with Container insights
description: Learn how to enable private link on an Azure Kubernetes Service (AKS) cluster.
ms.topic: conceptual
ms.date: 10/18/2023
ms.custom: devx-track-azurecli
ms.reviewer: aul
---

# Enable private link with Container insights
This article describes how to configure Container insights to use Azure Private Link for your AKS cluster.


## Cluster using managed identity authentication

### Prerequisites
- The template must be deployed in the same resource group as the cluster.

### Download and install template

1. Download ARM template and parameter file:
 
   **AKS cluster**
   - Template file: https://aka.ms/aks-enable-monitoring-msi-onboarding-template-file
   - Parameter file: https://aka.ms/aks-enable-monitoring-msi-onboarding-template-parameter-file

    **Arc-enabled Kubernetes cluster**
    - Template file: https://aka.ms/arc-k8s-azmon-extension-msi-arm-template
    - Parameter file: https://aka.ms/arc-k8s-azmon-extension-msi-arm-template-params

2.	Edit the following values in the parameter file.  Retrieve the **resource ID** of the resources from the **JSON** View of their **Overview** page.

    | Parameter | Description |
    |:---|:---|
    | AKS: `aksResourceId`<br>Arc: `clusterResourceId` | Resource ID of the cluster. |
    | AKS: `aksResourceLocation`<br>Arc: `clusterRegion` | Azure Region of the cluster. |
    | AKS: `workspaceResourceId`<br>Arc: `workspaceResourceId` | Resource ID of the  Log Analytics workspace. |
    | AKS: `workspaceRegion`<br>Arc: `workspaceRegion` | Region of the Log Analytics workspace. |
    |  Arc: `workspaceDomain`	| Domain of the Log Analytics workspace:<br>`opinsights.azure.com` for Azure public cloud<br>`opinsights.azure.us` for Azure US Government<br>`opinsights.azure.cn` for Azure China Cloud |
    | AKS: `resourceTagValues` | Tag values specified for the existing Container insights extension data collection rule (DCR) of the cluster and the name of the DCR. The name will be MSCI-\<clusterName\>-\<clusterRegion\>, and this resource created in an AKS clusters resource group. For first time onboarding, you can set arbitrary tag values. |
    | AKS: `useAzureMonitorPrivateLinkScope`<br>Arc: `useAzureMonitorPrivateLinkScope` | Boolean flag to indicate whether Azure Monitor link scope is used or not. |
    | AKS: `azureMonitorPrivateLinkScopeResourceId`<br>Arc: `azureMonitorPrivateLinkScopeResourceId` | Resource ID of the Azure Monitor Private link scope.   This only used if `useAzureMonitorPrivateLinkScope` is set to **true**. |

  Based on your requirements, you can configure other parameters such `streams`, `enableContainerLogV2`, `enableSyslog`, `syslogLevels`, `syslogFacilities`, `dataCollectionInterval`, `namespaceFilteringModeForDataCollection` and `namespacesForDataCollection`. 

3. Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

### Cluster using legacy authentication
Use the following procedures to enable network isolation by connecting your cluster to the Log Analytics workspace using [Azure Private Link](../logs/private-link-security.md) if your cluster is not using managed identity authentication. This requires a [private AKS cluster](../../aks/private-clusters.md).

1. Create a private AKS cluster following the guidance in [Create a private Azure Kubernetes Service cluster](../../aks/private-clusters.md).

2. Disable public Ingestion on your Log Analytics workspace. 

    Use the following command to disable public ingestion on an existing workspace.

    ```cli
    az monitor log-analytics workspace update --resource-group <azureLogAnalyticsWorkspaceResourceGroup> --workspace-name <azureLogAnalyticsWorkspaceName>  --ingestion-access Disabled
    ```

    Use the following command to create a new workspace with public ingestion disabled.

    ```cli
    az monitor log-analytics workspace create --resource-group <azureLogAnalyticsWorkspaceResourceGroup> --workspace-name <azureLogAnalyticsWorkspaceName>  --ingestion-access Disabled
    ```

3. Configure private link by following the instructions at [Configure your private link](../logs/private-link-configure.md). Set ingestion access to public and then set to private after the private endpoint is created but before monitoring is enabled. The private link resource region must be same as AKS cluster region. 

4. Enable monitoring for the AKS cluster.

    ```cli
    az aks enable-addons -a monitoring --resource-group <AKSClusterResourceGorup> --name <AKSClusterName> --workspace-resource-id <workspace-resource-id>
    ```

## Next steps

* If you experience issues while you attempt to onboard the solution, review the [Troubleshooting guide](container-insights-troubleshoot.md).
* With monitoring enabled to collect health and resource utilization of your AKS cluster and workloads running on them, learn [how to use](container-insights-analyze.md) Container insights.
