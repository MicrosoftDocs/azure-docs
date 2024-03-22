---
author: dramasamy
ms.author: dramasamy
ms.date: 06/30/2023
ms.topic: include
ms.service: azure-operator-nexus
---

> [!NOTE]
> When you create a Nexus Kubernetes cluster, Nexus automatically creates a managed resource group dedicated to storing the cluster resources, within this group, the Arc connected cluster resource is established.

To access your cluster, you need to set up the cluster connect `kubeconfig`. After logging into Azure CLI with the relevant Microsoft Entra entity, you can obtain the `kubeconfig` necessary to communicate with the cluster from anywhere, even outside the firewall that surrounds it.

1. Set `CLUSTER_NAME`, `RESOURCE_GROUP` and `SUBSCRIPTION_ID` variables.
    ```bash
    CLUSTER_NAME="myNexusK8sCluster"
    RESOURCE_GROUP="myResourceGroup"
    SUBSCRIPTION_ID=<set the correct subscription_id>
    ```

2. Query managed resource group with `az` and store in `MANAGED_RESOURCE_GROUP`
   ```azurecli
    az account set -s $SUBSCRIPTION_ID
    MANAGED_RESOURCE_GROUP=$(az networkcloud kubernetescluster show -n $CLUSTER_NAME -g $RESOURCE_GROUP --output tsv --query managedResourceGroupConfiguration.name)
   ```

3. The following command starts a connectedk8s proxy that allows you to connect to the Kubernetes API server for the specified Nexus Kubernetes cluster.
    ```azurecli
    az connectedk8s proxy -n $CLUSTER_NAME  -g $MANAGED_RESOURCE_GROUP &
    ```

4. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods -A
    ```
    You should now see a response from the cluster containing the list of all nodes.

> [!NOTE]
> If you see the error message "Failed to post access token to client proxyFailed to connect to MSI", you may need to perform an `az login` to re-authenticate with Azure.
