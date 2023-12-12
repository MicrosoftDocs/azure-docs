---
title: Connect to Azure Operator Nexus Kubernetes cluster
description: Learn how to connect to Azure Operator Nexus Kubernetes cluster for interacting, troubleshooting, and maintenance tasks
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/17/2023 
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Connect to Azure Operator Nexus Kubernetes cluster

This article provides instructions on how to connect to Azure Operator Nexus Kubernetes cluster and its nodes. It includes details on how to connect to the cluster from both Azure and on-premises environments, and how to do so when the ExpressRoute is in both connected and disconnected modes.

In Azure, connected mode and disconnected mode refer to the state of an ExpressRoute circuit. [ExpressRoute](../expressroute/expressroute-introduction.md) is a service provided by Azure that enables organizations to establish a private, high-throughput connection between their on-premises infrastructure and Azure datacenters.

* Connected Mode: In connected mode, the ExpressRoute circuit is fully operational and provides a private connection between your on-premises infrastructure and Azure services. This mode is ideal for scenarios where you need constant connectivity to Azure.
* Disconnected Mode: In disconnected mode, the ExpressRoute circuit is partially or fully down and is unable to provide connectivity to Azure services. This mode is useful when you want to perform maintenance on the circuit or need to temporarily disconnect from Azure.

> [!IMPORTANT]
> While the ExpressRoute circuit is in disconnected mode, traffic will not be able to flow between your on-premises environment and Azure. Therefore, it is recommended to only use disconnected mode when necessary, and to monitor the circuit closely to ensure it is brought back to connected mode as soon as possible.

## Prerequisites

* An Azure Operator Nexus Kubernetes cluster deployed in a resource group in your Azure subscription.
* SSH private key for the cluster nodes.
* If you're connecting in disconnected mode, you must have a jumpbox VM deployed in the same virtual network as the cluster nodes.

## Connected mode access

When operating in connected mode, it's possible to connect to the cluster's kube-api server using the `az connectedk8s proxy` CLI command. Also it's possible to SSH into the worker nodes for troubleshooting or maintenance tasks from Azure using the ExpressRoute circuit.

### Azure Arc for Kubernetes

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/cluster-connect.md)]

### Access to cluster nodes via Azure Arc for Kubernetes
Once you are connected to a cluster via Arc for Kuberentes, you can connect to individual Kubernetes Node using the `kubectl debug` command to run a privileged container on your node.

1. List the nodes in your Nexus Kubernetes cluster:

    ```console
    $> kubectl get nodes
    NAME                                     STATUS   ROLES           AGE    VERSION
    cluster-01-627e99ee-agentpool1-md-chfwd   Ready    <none>          125m   v1.27.1
    cluster-01-627e99ee-agentpool1-md-kfw4t   Ready    <none>          125m   v1.27.1
    cluster-01-627e99ee-agentpool1-md-z2n8n   Ready    <none>          124m   v1.27.1
    cluster-01-627e99ee-control-plane-5scjz   Ready    control-plane   129m   v1.27.1
    ```

2. Start a privileged container on your node and connect to it:

    ```console
    $> kubectl debug node/cluster-01-627e99ee-agentpool1-md-chfwd -it --image=mcr.microsoft.com/cbl-mariner/base/core:2.0
    Creating debugging pod node-debugger-cluster-01-627e99ee-agentpool1-md-chfwd-694gg with container debugger on node cluster-01-627e99ee-agentpool1-md-chfwd.
    If you don't see a command prompt, try pressing enter.
    root [ / ]#
    ```

    This privileged container gives access to the node. Execute commands on the baremetal host machine by running `chroot /host` at the command line. 

3. When you are done with a debugging pod, enter the `exit` command to end the interactive shell session. After exiting the shell, make sure to delete the pod:

    ```bash
    kubectl delete pod node-debugger-cluster-01-627e99ee-agentpool1-md-chfwd-694gg 
    ```

### Azure Arc for servers

The `az ssh arc` command allows users to remotely access a cluster VM that has been connected to Azure Arc. This method is a secure way to SSH into the cluster node directly from the command line, while in connected mode. Once the cluster VM has been registered with Azure Arc, the `az ssh arc` command can be used to manage the machine remotely, making it a quick and efficient method for remote management.

To use `az arc ssh`, users need to manually connect the cluster VMs to Arc by creating a service principal (SP) with the 'Azure Connected Machine Onboarding' role. For more detailed steps on how to connect an Azure Operator Nexus Kubernetes cluster node to Arc, refer to the [how to guide](./howto-monitor-naks-cluster.md#monitor-nexus-kubernetes-cluster--vm-layer).

1. Set the required variables.

    ```bash
    RESOURCE_GROUP="myResourceGroup"
    CLUSTER_NAME="myNexusK8sCluster"
    SUBSCRIPTION_ID="<Subscription ID>"
    USER_NAME="azureuser"
    SSH_PRIVATE_KEY_FILE="<vm_ssh_id_rsa>"
    ```

2. Get the available cluster node names.

    ```azurecli
    az networkcloud kubernetescluster show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID -o json | jq '.nodes[].name'
    ```

3. Sample output:

    ```bash
    "mynexusk8scluster-0b32128d-agentpool1-md-7h9t4"
    "mynexusk8scluster-0b32128d-agentpool1-md-c6xbs"
    "mynexusk8scluster-0b32128d-control-plane-qq5jm"
    ```

4. Run the following command to SSH into the cluster node.

    ```azurecli
    az ssh arc --subscription $SUBSCRIPTION_ID \
        --resource-group $RESOURCE_GROUP \
        --name <VM Name> \
        --local-user $USER_NAME \
        --private-key-file $SSH_PRIVATE_KEY_FILE
    ```

### Direct access to cluster nodes

Another option for securely connecting to an Azure Operator Nexus Kubernetes cluster node is to set up a direct access to the cluster's CNI network from Azure. Using this approach, you can SSH into the cluster nodes, also execute kubectl commands against the cluster using the `kubeconfig` file. Reach out to your network administrator to set up this direct connection from Azure to the cluster's CNI network.

## Disconnected mode access

When the ExpressRoute is in a disconnected mode, you can't access the cluster's kube-api server using the `az connectedk8s proxy` CLI command. Similarly, the `az ssh` CLI command doesn't work for accessing the worker nodes, which can be crucial for troubleshooting or maintenance tasks.

However, you can still ensure a secure and effective connection to your cluster. To do so, establish direct access to the cluster's CNI (Container Network Interface) from within your on-premises infrastructure. This direct access enables you to SSH into the cluster nodes, and lets you execute `kubectl` commands using the `kubeconfig` file.

Reach out to your network administrator to set up this direct connection to the cluster's CNI network.

## IP address of the cluster nodes

Before you can connect to the cluster nodes, you need to find the IP address of the nodes. The IP address of the nodes can be found using the Azure portal or the Azure CLI.

### Use the Azure CLI

1. Set the RESOURCE_GROUP, CLUSTER_NAME, and SUBSCRIPTION_ID variables to match your environment.

    ```bash
    RESOURCE_GROUP="myResourceGroup"
    CLUSTER_NAME="myNexusK8sCluster"
    SUBSCRIPTION_ID="<Subscription ID>"
    ```

2. Execute the following command to get the IP address of the nodes.

    ```azurecli
    az networkcloud kubernetescluster show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID -o json | jq '.nodes[] | select(any(.networkAttachments[]; .networkAttachmentName == "defaultcni")) | {name: .name, ipv4Address: (.networkAttachments[] | select(.networkAttachmentName == "defaultcni").ipv4Address)}'
    ```

3. Here's the sample output of the command.

    ```json
    {
      "name": "mynexusk8scluster-0b32128d-agentpool1-md-7h9t4",
      "ipv4Address": "10.5.54.47"
    }
    {
      "name": "mynexusk8scluster-0b32128d-agentpool1-md-c6xbs",
      "ipv4Address": "10.5.54.48"
    }
    {
      "name": "mynexusk8scluster-0b32128d-control-plane-qq5jm",
      "ipv4Address": "10.5.54.46"
    }
    ```

### Use the Azure portal

To find the IP address of the VM for SSH, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com) and sign-in with your username and password.
2. Type 'Kubernetes Cluster (Operator Nexus)' in the search box and select the 'Kubernetes Cluster' service from the list of results.

:::image type="content" source="media/nexus-kubernetes/search-kubernetes-service.png" lightbox="media/nexus-kubernetes/search-kubernetes-service.png" alt-text="Screenshot of browsing Nexus Kubernetes service.":::

3. Look for the specific 'Nexus Kubernetes cluster' resource you need to use the search.

:::image type="content" source="media/nexus-kubernetes/search-kubernetes-cluster.png" lightbox="media/nexus-kubernetes/search-kubernetes-cluster.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster.":::

4. Once you've found the right resource by matching its name with the cluster name, Select the resource to go to the 'Kubernetes Cluster' home page.

:::image type="content" source="media/nexus-kubernetes/kubernetes-cluster-home.png" lightbox="media/nexus-kubernetes/kubernetes-cluster-home.png" alt-text="Screenshot of Nexus Kubernetes cluster home page.":::

5. Once you've found the right resource by matching its name with the cluster name, go to the 'Kubernetes Cluster Nodes' section in the left menu.

:::image type="content" source="media/nexus-kubernetes/kubernetes-cluster-nodes.png" lightbox="media/nexus-kubernetes/kubernetes-cluster-nodes.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster nodes.":::

6. Select on the Kubernetes node name you're interested in to see its details.
7. Check the 'Attached Networks' tab to find the IP address of the node's 'Layer 3 Network' that used as CNI network.

:::image type="content" source="media/nexus-kubernetes/control-plane-network-attachment.png" lightbox="media/nexus-kubernetes/control-plane-network-attachment.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster node networks.":::

## Next steps

Try out the following articles to learn more about Azure Operator Nexus Kubernetes cluster.
- [Quickstart: Deploy an Azure Operator Nexus Kubernetes cluster using Bicep](./quickstarts-kubernetes-cluster-deployment-bicep.md)
- [How to: Monitor Azure Operator Nexus Kubernetes cluster](./howto-monitor-naks-cluster.md)
