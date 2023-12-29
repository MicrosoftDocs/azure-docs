---
title: Create a chaos experiment using a Chaos Mesh fault with Azure CLI
description: Create an experiment that uses an AKS Chaos Mesh fault by using Azure Chaos Studio with the Azure CLI.
author: prasha-microsoft 
ms.topic: how-to
ms.date: 04/21/2022
ms.author: prashabora
ms.service: chaos-studio
ms.custom: template-how-to, ignite-fall-2021, devx-track-azurecli 
ms.devlang: azurecli
---

# Create a chaos experiment that uses a Chaos Mesh fault with the Azure CLI

You can use a chaos experiment to verify that your application is resilient to failures by causing those failures in a controlled environment. In this article, you cause periodic Azure Kubernetes Service (AKS) pod failures on a namespace by using a chaos experiment and Azure Chaos Studio. Running this experiment can help you defend against service unavailability when there are sporadic failures.

Chaos Studio uses [Chaos Mesh](https://chaos-mesh.org/), a free, open-source chaos engineering platform for Kubernetes, to inject faults into an AKS cluster. Chaos Mesh faults are [service-direct](chaos-studio-tutorial-aks-portal.md) faults that require Chaos Mesh to be installed on the AKS cluster. You can use these same steps to set up and run an experiment for any AKS Chaos Mesh fault.

## Prerequisites

- An Azure subscription. [!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]
- An AKS cluster with Linux node pools. If you don't have an AKS cluster, see the AKS quickstart that uses the [Azure CLI](../aks/learn/quick-kubernetes-deploy-cli.md), [Azure PowerShell](../aks/learn/quick-kubernetes-deploy-powershell.md), or the [Azure portal](../aks/learn/quick-kubernetes-deploy-portal.md).

## Limitations

* You can use Chaos Mesh faults with private clusters by configuring [VNet Injection in Chaos Studio](chaos-studio-private-networking.md). Any commands issued to the private cluster, including the steps in this article to set up Chaos Mesh, need to follow the [private cluster guidance](../aks/private-clusters.md). Recommended methods include connecting from a VM in the same virtual network or using the [AKS command invoke](../aks/access-private-cluster.md) feature.
* AKS Chaos Mesh faults are only supported on Linux node pools.
* Currently, Chaos Mesh faults don't work if the AKS cluster has [local accounts disabled](../aks/manage-local-accounts-managed-azure-ad.md).
* If your AKS cluster is configured to only allow authorized IP ranges, you need to allow Chaos Studio's IP ranges. You can find them by querying the `ChaosStudio` [service tag with the Service Tag Discovery API or downloadable JSON files](../virtual-network/service-tags-overview.md). 

## Open Azure Cloud Shell

Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account.

To open Cloud Shell, select **Try it** in the upper-right corner of a code block. You can also open Cloud Shell in a separate browser tab by going to [Bash](https://shell.azure.com/bash). Select **Copy** to copy the blocks of code, paste it into Cloud Shell, and select **Enter** to run it.

If you prefer to install and use the CLI locally, this tutorial requires Azure CLI version 2.0.30 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI](/cli/azure/install-azure-cli).

> [!NOTE]
> These instructions use a Bash terminal in Cloud Shell. Some commands might not work as described if you run the CLI locally or in a PowerShell terminal.

## Set up Chaos Mesh on your AKS cluster

Before you can run Chaos Mesh faults in Chaos Studio, you must install Chaos Mesh on your AKS cluster.

1. Run the following commands in a [Cloud Shell](../cloud-shell/overview.md) window where you have the active subscription set to be the subscription where your AKS cluster is deployed. Replace `$RESOURCE_GROUP` and `$CLUSTER_NAME` with the resource group and name of your cluster resource.

   ```azurecli-interactive
   az aks get-credentials -g $RESOURCE_GROUP -n $CLUSTER_NAME
   helm repo add chaos-mesh https://charts.chaos-mesh.org
   helm repo update
   kubectl create ns chaos-testing
   helm install chaos-mesh chaos-mesh/chaos-mesh --namespace=chaos-testing --set chaosDaemon.runtime=containerd --set chaosDaemon.socketPath=/run/containerd/containerd.sock
   ```

1. Verify that the Chaos Mesh pods are installed by running the following command:

   ```azurecli-interactive
   kubectl get po -n chaos-testing
   ```

You should see output similar to the following example (a chaos-controller-manager and one or more chaos-daemons):

```bash
NAME                                        READY   STATUS    RESTARTS   AGE
chaos-controller-manager-69fd5c46c8-xlqpc   1/1     Running   0          2d5h
chaos-daemon-jb8xh                          1/1     Running   0          2d5h
chaos-dashboard-98c4c5f97-tx5ds             1/1     Running   0          2d5h
```

You can also [use the installation instructions on the Chaos Mesh website](https://chaos-mesh.org/docs/production-installation-using-helm/).

## Enable Chaos Studio on your AKS cluster

Chaos Studio can't inject faults against a resource unless that resource is added to Chaos Studio first. To add a resource to Chaos Studio, create a [target and capabilities](chaos-studio-targets-capabilities.md) on the resource. AKS clusters have only one target type (service-direct), but other resources might have up to two target types. One target type is for service-direct faults. Another target type is for agent-based faults. Each type of Chaos Mesh fault is represented as a capability like PodChaos, NetworkChaos, and IOChaos.

1. Create a target by replacing `$RESOURCE_ID` with the resource ID of the AKS cluster you're adding.

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh?api-version=2023-11-01" --body "{\"properties\":{}}"
    ```

1. Create the capabilities on the target by replacing `$RESOURCE_ID` with the resource ID of the AKS cluster you're adding. Replace `$CAPABILITY` with the [name of the fault capability you're enabling](chaos-studio-fault-library.md).
    
    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/$RESOURCE_ID/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh/capabilities/$CAPABILITY?api-version=2023-11-01"  --body "{\"properties\":{}}"
    ```

    For example, if you're enabling the `PodChaos` capability:

    ```azurecli-interactive
    az rest --method put --url "https://management.azure.com/subscriptions/b65f2fec-d6b2-4edd-817e-9339d8c01dc4/resourceGroups/myRG/providers/Microsoft.ContainerService/managedClusters/myCluster/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh/capabilities/PodChaos-2.1?api-version=2023-11-01"  --body "{\"properties\":{}}"
    ```

    This step must be done for each capability you want to enable on the cluster.

You've now successfully added your AKS cluster to Chaos Studio.

## Create an experiment
Now you can create your experiment. A chaos experiment defines the actions you want to take against target resources. The actions are organized and run in sequential steps. The chaos experiment also defines the actions you want to take against branches, which run in parallel.

1. Create a Chaos Mesh `jsonSpec`:
    1. See the Chaos Mesh documentation for a fault type, [for example, the PodChaos type](https://chaos-mesh.org/docs/simulate-pod-chaos-on-kubernetes/#create-experiments-using-yaml-configuration-files).
    1. Formulate the YAML configuration for that fault type by using the Chaos Mesh documentation.

        ```yaml
        apiVersion: chaos-mesh.org/v1alpha1
        kind: PodChaos
        metadata:
          name: pod-failure-example
          namespace: chaos-testing
        spec:
          action: pod-failure
          mode: all
          duration: '600s'
          selector:
            namespaces:
              - default
        ```
    1. Remove any YAML outside of the `spec`, including the spec property name. Remove the indentation of the spec details. The `duration` parameter isn't necessary, but is used if provided. In this case, remove it.

        ```yaml
        action: pod-failure
        mode: all
        selector:
          namespaces:
            - default
        ```
    1. Use a [YAML-to-JSON converter like this one](https://www.convertjson.com/yaml-to-json.htm) to convert the Chaos Mesh YAML to JSON and minimize it.

        ```json
        {"action":"pod-failure","mode":"all","selector":{"namespaces":["default"]}}
        ```
    1. Use a [JSON string escape tool like this one](https://www.freeformatter.com/json-escape.html) to escape the JSON spec, or change the double-quotes to single-quotes.
    
        ```json
        {\"action\":\"pod-failure\",\"mode\":\"all\",\"selector\":{\"namespaces\":[\"default\"]}}
        ```

        ```json
        {'action':'pod-failure','mode':'all','selector':{'namespaces':['default']}}
        ```

1. Create your experiment JSON by starting with the following JSON sample. Modify the JSON to correspond to the experiment you want to run by using the [Create Experiment API](/rest/api/chaosstudio/experiments/create-or-update), the [fault library](chaos-studio-fault-library.md), and the `jsonSpec` created in the previous step.

    ```json
    {
      "location": "centralus",
      "identity": {
        "type": "SystemAssigned"
      },
      "properties": {
        "steps": [
          {
            "name": "AKS pod kill",
            "branches": [
              {
                "name": "AKS pod kill",
                "actions": [
                  {
                    "type": "continuous",
                    "selectorId": "Selector1",
                    "duration": "PT10M",
                    "parameters": [
                      {
                          "key": "jsonSpec",
                          "value": "{\"action\":\"pod-failure\",\"mode\":\"all\",\"selector\":{\"namespaces\":[\"default\"]}}"
                      }
                    ],
                    "name": "urn:csci:microsoft:azureKubernetesServiceChaosMesh:podChaos/2.1"
                  }
                ]
              }
            ]
          }
        ],
        "selectors": [
          {
            "id": "Selector1",
            "type": "List",
            "targets": [
              {
                "type": "ChaosTarget",
                "id": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/myRG/providers/Microsoft.ContainerService/managedClusters/myCluster/providers/Microsoft.Chaos/targets/Microsoft-AzureKubernetesServiceChaosMesh"
              }
            ]
          }
        ]
      }
    }
    ```
    
1. Create the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment. Make sure you've saved and uploaded your experiment JSON. Update `experiment.json` with your JSON filename.

    ```azurecli-interactive
    az rest --method put --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME?api-version=2023-11-01 --body @experiment.json
    ```

    Each experiment creates a corresponding system-assigned managed identity. Note the principal ID for this identity in the response for the next step.

## Give the experiment permission to your AKS cluster
When you create a chaos experiment, Chaos Studio creates a system-assigned managed identity that executes faults against your target resources. This identity must be given [appropriate permissions](chaos-studio-fault-providers.md) to the target resource for the experiment to run successfully.

Give the experiment access to your resources by using the following command. Replace `$EXPERIMENT_PRINCIPAL_ID` with the principal ID from the previous step. Replace `$RESOURCE_ID` with the resource ID of the target resource. In this case, it's the AKS cluster resource ID. Run this command for each resource targeted in your experiment.

```azurecli-interactive
az role assignment create --role "Azure Kubernetes Service Cluster Admin Role" --assignee-object-id $EXPERIMENT_PRINCIPAL_ID --scope $RESOURCE_ID
```

## Run your experiment
You're now ready to run your experiment. To see the effect, we recommend that you open your AKS cluster overview and go to **Insights** in a separate browser tab. Live data for the **Active Pod Count** shows the effect of running your experiment.

1. Start the experiment by using the Azure CLI. Replace `$SUBSCRIPTION_ID`, `$RESOURCE_GROUP`, and `$EXPERIMENT_NAME` with the properties for your experiment.

    ```azurecli-interactive
    az rest --method post --uri https://management.azure.com/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.Chaos/experiments/$EXPERIMENT_NAME/start?api-version=2023-11-01
    ```

1. The response includes a status URL that you can use to query experiment status as the experiment runs.

## Next steps
Now that you've run an AKS Chaos Mesh service-direct experiment, you're ready to:
- [Create an experiment that uses agent-based faults](chaos-studio-tutorial-agent-based-portal.md)
- [Manage your experiment](chaos-studio-run-experiment.md)
