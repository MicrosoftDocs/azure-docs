---
author: dramasamy
ms.author: dramasamy
ms.date: 06/26/2023
ms.topic: include
ms.service: azure-operator-nexus
---

Now that the Nexus Kubernetes cluster has been successfully created and connected to Azure Arc, you can easily connect to it using the cluster connect feature. Cluster connect allows you to securely access and manage your cluster from anywhere, making it convenient for interactive development, debugging, and cluster administration tasks.

> [!NOTE]
> When you create a Nexus Kubernetes cluster, Nexus automatically creates a managed resource group dedicated to storing the cluster resources, within this group, the Arc connected cluster resource is established.

## Access your cluster

1. Set up the cluster connect `kubeconfig` needed to access your cluster. After logging into Azure CLI using the Azure AD entity of interest, get the Cluster Connect `kubeconfig` needed to communicate with the cluster from anywhere (from even outside the firewall surrounding the cluster):


    ```
    CLUSTER_NAME="myNexusAKSCluster"
    RESOURCE_GROUP_NAME="myResourceGroup"
    MANAGED_RESOURCE_GROUP=$(az networkcloud kubernetescluster show -n $CLUSTER_NAME -g $RESOURCE_GROUP_NAME --output tsv --query managedResourceGroup)
    ```

    ```azurecli
    az connectedk8s proxy -n $CLUSTER_NAME  -g $MANAGED_RESOURCE_GROUP &
    ```

2. Use `kubectl` to send requests to the cluster:

   ```console
   kubectl get nodes
   ```

You should now see a response from the cluster containing the list of all nodes.