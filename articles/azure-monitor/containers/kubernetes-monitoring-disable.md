---
title: Disable monitoring of your Kubernetes cluster
description: Describes how to remove Container insights and scraping of Prometheus metrics from your Kubernetes cluster.
ms.topic: conceptual
ms.date: 01/23/2024
ms.custom:
ms.devlang: azurecli
ms.reviewer: aul
---

# Disable monitoring of your Kubernetes cluster

Use the following methods to remove [Container insights](#disable-container-insights) or [Prometheus](#disable-prometheus) from your Kubernetes cluster.

## Required permissions

- You require at least [Contributor](../../role-based-access-control/built-in-roles.md#contributor) access to the cluster.

## Disable Container insights

### AKS cluster

Use the [az aks disable-addons](/cli/azure/aks#az-aks-disable-addons) CLI command to disable Container insights on a cluster. The command removes the agent from the cluster nodes. It doesn't remove the data already collected and stored in the Log Analytics workspace for your cluster.

```azurecli
az aks disable-addons -a monitoring -n MyExistingManagedCluster -g MyExistingManagedClusterRG
```

Alternatively, you can use the following ARM template below to remove Container insights. 

  ```json
{
    "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "aksResourceId": {
            "type": "string",
            "metadata": {
                "description": "AKS Cluster Resource ID"
              }
          },
        "aksResourceLocation": {
            "type": "string",
            "metadata": {
                "description": "Location of the AKS resource e.g. \"East US\""
              }
          },
        "aksResourceTagValues": {
            "type": "object",
            "metadata": {
               "description": "Existing all tags on AKS Cluster Resource"
              }
        }
    },
    "resources": [
    {
      "name": "[split(parameters('aksResourceId'),'/')[8]]",
      "type": "Microsoft.ContainerService/managedClusters",
      "location": "[parameters('aksResourceLocation')]",
      "tags": "[parameters('aksResourceTagValues')]",
      "apiVersion": "2018-03-31",
      "properties": {
        "mode": "Incremental",
        "id": "[parameters('aksResourceId')]",
        "addonProfiles": {
          "omsagent": {
            "enabled": false,
            "config": null
          }
          }
        }
      }
    ]
  }
  ```

### Arc-enabled Kubernetes cluster
Use the following CLI command to delete the `azuremonitor-containers` extension and all the Kubernetes resources related to the extension.

```azurecli
az k8s-extension delete --name azuremonitor-containers --cluster-name <cluster-name> --resource-group <cluster-resource-group> --cluster-type connectedClusters
```

### Remove Container insights with Helm

The following steps apply to the following environments:

- AKS Engine on Azure and Azure Stack
- OpenShift version 4 and higher

1. Run the following helm command to identify the Container insights helm chart release installed on your cluster

    ```
    helm list
    ```

    The output resembles the following:

    ```
    NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    azmon-containers-release-1      default         3               2020-04-21 15:27:24.1201959 -0700 PDT   deployed        azuremonitor-containers-2.7.0   7.0.0-1
    ```

    *azmon-containers-release-1* represents the helm chart release for Container insights.

2. To delete the chart release, run the following helm command.

    `helm delete <releaseName>`

    Example:

    `helm delete azmon-containers-release-1`

    This removes the release from the cluster. You can verify by running the `helm list` command:

    ```
    NAME                            NAMESPACE       REVISION        UPDATED                                 STATUS          CHART                           APP VERSION
    ```

The configuration change can take a few minutes to complete. Because Helm tracks your releases even after you’ve deleted them, you can audit a cluster’s history, and even undelete a release with `helm rollback`.




## Disable Prometheus

Use the following `az aks update` Azure CLI command with the `--disable-azure-monitor-metrics` parameter to remove the metrics add-on from your AKS cluster or `az k8s-extension delete` Azure CLI command with the `--name azuremonitor-metrics` parameter to remove the metrics add-on from Arc-enabled cluster, and stop sending Prometheus metrics to Azure Monitor managed service for Prometheus. It doesn't remove the data already collected and stored in the Azure Monitor workspace for your cluster.

### AKS Cluster:

```azurecli
az aks update --disable-azure-monitor-metrics -n <cluster-name> -g <cluster-resource-group>
```

### Azure Arc-enabled Cluster:
```
az k8s-extension delete --name azuremonitor-metrics --cluster-name <cluster-name> --resource-group <cluster-resource-group> --cluster-type connectedClusters 
```

This command performs the following actions:

+ Removes the ama-metrics agent from the cluster nodes. 
+ Deletes the recording rules created for that cluster.  
+ Deletes the data collection endpoint (DCE).  
+ Deletes the data collection rule (DCR).
+ Deletes the data collection rule association (DCRA) and recording rules groups created as part of onboarding.




## Next steps

If the workspace was created only to support monitoring the cluster and it's no longer needed, you must delete it manually. If you aren't familiar with how to delete a workspace, see [Delete an Azure Log Analytics workspace with the Azure portal](../logs/delete-workspace.md). Don't forget about the **Workspace Resource ID** copied earlier in step 4. You'll need that information.
