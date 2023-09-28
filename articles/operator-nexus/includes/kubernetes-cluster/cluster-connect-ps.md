---
author: rashirg
ms.author: rajeshwarig
ms.date: 09/28/2023
ms.topic: include
ms.service: azure-operator-nexus
---

> [!NOTE]
> When you create a Nexus Kubernetes cluster, Nexus automatically creates a managed resource group dedicated to storing the cluster resources, within this group, the Arc connected cluster resource is established.

To access your cluster, you need to set up the cluster connect `kubeconfig`. After logging into Azure PowerShell with the relevant Azure AD entity, you can obtain the `kubeconfig` necessary to communicate with the cluster from anywhere, even outside the firewall that surrounds it.

1. Set `CLUSTER_NAME`, `RESOURCE_GROUP` and `SUBSCRIPTION_ID` variables.
    ```azurepowershell
    $CLUSTER_NAME="myNexusK8sCluster"
    $RESOURCE_GROUP="myResourceGroup"
    $LOCATION   
    ```

2. Set the environment variables needed for Azure PowerShell to use the outbound proxy server:
    ```azurepowershell
    $Env:HTTP_PROXY = "<proxy-server-ip-address>:<port>"
    $Env:HTTPS_PROXY = "<proxy-server-ip-address>:<port>"
    $Env:NO_PROXY = "<cluster-apiserver-ip-address>:<port>"
    ```

3. The following command starts a connectedk8s proxy that allows you to connect to the Kubernetes API server for the specified Nexus Kubernetes cluster.
    ```azurecpowershell
    New-AzConnectedKubernetes -ClusterName $CLUSTER_NAME -ResourceGroupName $RESOURCE_GROUP -Location $LOCATION -Proxy 'https://<proxy-server-ip-address>:<port>'
    ```

4. Use `kubectl` to send requests to the cluster:

    ```console
    kubectl get pods -A
    ```
    You should now see a response from the cluster containing the list of all nodes.

> [!NOTE]
> If you see the error message "Failed to post access token to client proxyFailed to connect to MSI", you may need to perform an `az login` to re-authenticate with Azure.
