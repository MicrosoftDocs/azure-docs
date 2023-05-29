Now that the Nexus Kubernetes cluster has been successfully created and connected to Azure Arc, you can easily connect to it using the cluster connect feature. Cluster connect allows you to securely access and manage your cluster from anywhere, making it convenient for interactive development, debugging, and cluster administration tasks.

> [!NOTE]
> When you create a Nexus Kubernetes cluster, Nexus automatically creates a managed resource group dedicated to storing the cluster resources, within this group, the Arc connected cluster resource is established. Retrieve the Arc connected resource id before proceeding with [how to connect to an Azure Arc-enabled Kubernetes cluster](../../../azure-arc/kubernetes/cluster-connect.md).

```azurecli
az networkcloud kubernetescluster show \
  --name myNexusAKSCluster \
  --resource-group myResourceGroup \
  --output tsv \
  --query connectedClusterId
```

For the specific steps to connect to an Azure Arc-connected Nexus Kubernetes cluster, refer [how to connect to an Azure Arc-enabled Kubernetes cluster](../../../azure-arc/kubernetes/cluster-connect.md). This documentation provides a detailed, step-by-step guide to help you connect to your cluster.