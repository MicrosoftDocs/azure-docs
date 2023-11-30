---
author: rashirg
ms.author: rajeshwarig
ms.date: 10/03/2023
ms.topic: include
ms.service: azure-operator-nexus
---

> [!NOTE]
> When you create a Nexus Kubernetes cluster, Nexus automatically creates a managed resource group dedicated to storing the cluster resources. Within this group, the Arc connected cluster resource is established.

To access your cluster, you need to set up the cluster connect `kubeconfig`. After logging into Azure PowerShell with the relevant Microsoft Entra entity, you can obtain the `kubeconfig` necessary to communicate with the cluster from anywhere, even outside the firewall that surrounds it.

1. Set CLUSTER_NAME, RESOURCE_GROUP, LOCATION and SUBSCRIPTION_ID variables.

    ```azurepowershell
    $CLUSTER_NAME="myNexusK8sCluster"
    $LOCATION="<ClusterAzureRegion>"
    $MANAGED_RESOURCE_GROUP=(Get-AzNetworkCloudKubernetesCluster -KubernetesClusterName $CLUSTER_NAME `
    -SubscriptionId <mySubscription> `
    -ResourceGroupName myResourceGroup `
    |Select-Object -Property ManagedResourceGroupConfigurationName)
    ```
    
2. Run the following command to connect to the cluster.
    ```azurepowershell
    New-AzConnectedKubernetes -ClusterName $CLUSTER_NAME -ResourceGroupName $MANAGED_RESOURCE_GROUP -Location $LOCATION
    ```

2. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods -A
    ```
    You should now see a response from the cluster containing the list of all nodes.

> [!NOTE]
> If you see the error message "Failed to post access token to client proxyFailed to connect to MSI", you may need to perform an `az login` to re-authenticate with Azure.
