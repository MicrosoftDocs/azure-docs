---
title: Disable Container insights on your Kubernetes cluster
description: This article describes how you can discontinue monitoring of your Kubernetes cluster with Container insights.
ms.topic: conceptual
ms.date: 12/14/2023
ms.custom: devx-track-azurecli, devx-track-arm-template
ms.devlang: azurecli
ms.reviewer: aul
---

# Disable Container insights on your Kubernetes cluster

This article shows you how to stop monitoring your Kubernetes cluster and Remove Container insights.


## AKS cluster

### [CLI](#tab/cli)

Use the [az aks disable-addons](/cli/azure/aks#az-aks-disable-addons) command to disable Container insights. The command removes the agent from the cluster nodes. It doesn't remove the solution or the data already collected and stored in your Azure Monitor resource.

```azurecli
az aks disable-addons -a monitoring -n MyExistingManagedCluster -g MyExistingManagedClusterRG
```

### [Azure Resource Manager](#tab/arm)


#### Download and install template

1. Create the template file by saving the following JSON syntax as *OptOutTemplate.json*.

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

2. Create the template file by saving the following JSON syntax as *OptOutParam.json*.

3. Edit the following values in the parameter file. Retrieve the resource ID of the resources from the **JSON View** of their **Overview** page.

    | Parameter | Description |
    |:---|:---|
    | `aksResourceId` | Resource ID of the cluster. |
    | `aksResourceLocation` | Location of the cluster. |
    | `resourceTagValues` | Existing tag values specified for the Container insights cluster. |


4. Deploy the template with the parameter file by using any valid method for deploying Resource Manager templates. For examples of different methods, see [Deploy the sample templates](../resource-manager-samples.md#deploy-the-sample-templates).

---

## Arc-enabled Kubernetes cluster

The following scripts are available for removing Container insights from your Arc-enabled Kubernetes clusters. You can get the **kube-context** of your cluster by running the command `kubectl config get-contexts`. If you want to use the current context, then don't specify this parameter.


PowerShell: [disable-monitoring.ps1](https://aka.ms/disable-monitoring-powershell-script)
Bash: [disable-monitoring.sh](https://aka.ms/disable-monitoring-bash-script)


```powershell
# Use current context
.\disable-monitoring.ps1 -clusterResourceId <cluster-resource-id>

# Specify kube-context
.\disable-monitoring.ps1 -clusterResourceId <cluster-resource-id> -kubeContext <kube-context>
```

```bash
# Use current context
bash disable-monitoring.sh --resource-id $AZUREARCCLUSTERRESOURCEID 

# Specify kube-context
bash disable-monitoring.sh --resource-id $AZUREARCCLUSTERRESOURCEID --kube-context $KUBECONTEXT
```

## Disable monitoring using Helm

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

## Next steps

If the workspace was created only to support monitoring the cluster and it's no longer needed, you must delete it manually. If you aren't familiar with how to delete a workspace, see [Delete an Azure Log Analytics workspace with the Azure portal](../logs/delete-workspace.md). Don't forget about the **Workspace Resource ID** copied earlier in step 4. You'll need that information.
