---
title: Connect to Azure Operator Nexus Kubernetes cluster
description: Learn how to connect to Azure Operator Nexus Kubernetes cluster for interacting, troubleshooting, and maintenance tasks.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/17/2023 
ms.custom: template-how-to-pattern, devx-track-azurecli
---

# Connect to Azure Operator Nexus Kubernetes cluster

Throughout the lifecycle of your Azure Operator Nexus Kubernetes cluster, you eventually need to directly access a cluster node. This access could be for maintenance, log collection, or troubleshooting operations. You access a node through authentication, which methods vary depending on your method of connection. You securely authenticate against cluster nodes through two options discussed in this article. For security reasons, cluster nodes aren't exposed to the internet. Instead, to connect directly to  cluster nodes, you need to use either `kubectl debug` or the host's IP address from a jumpbox.

## Prerequisites

* An Azure Operator Nexus Kubernetes cluster deployed in a resource group in your Azure subscription.
* SSH private key for the cluster nodes.
* To SSH using the node IP address, you must deploy a jumpbox VM on the same Container Network Interface (CNI) network as the cluster nodes.

## Access to cluster nodes via Azure Arc for servers

The `az ssh arc` command allows users to remotely access a cluster VM that has been connected to Azure Arc. This method is a secure way to SSH into the cluster node directly from the command line, making it a quick and efficient method for remote management.

> [!NOTE]
> Operator Nexus Kubernetes cluster nodes are Arc connected servers by default.

1. Set the required variables. Replace the placeholders with the actual values relevant to your Azure environment and Nexus Kubernetes cluster.

    ```bash
    RESOURCE_GROUP="myResourceGroup" # Resource group where the Nexus Kubernetes cluster is deployed
    CLUSTER_NAME="myNexusK8sCluster" # Name of the Nexus Kubernetes cluster
    SUBSCRIPTION_ID="<Subscription ID>" # Azure subscription ID
    ADMIN_USERNAME="azureuser" # Username for the cluster administrator (--admin-username parameter value used during cluster creation)
    SSH_PRIVATE_KEY_FILE="<vm_ssh_id_rsa>" # Path to the SSH private key file
    MANAGED_RESOURCE_GROUP=$(az networkcloud kubernetescluster show -n $CLUSTER_NAME -g $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID --output tsv --query managedResourceGroupConfiguration.name)
    ```

2. Get the available cluster node names.

    ```azurecli-interactive
    az networkcloud kubernetescluster show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID -o json | jq '.nodes[].name'
    ```

3. Sample output:

    ```bash
    "mynexusk8scluster-0b32128d-agentpool1-md-7h9t4"
    "mynexusk8scluster-0b32128d-agentpool1-md-c6xbs"
    "mynexusk8scluster-0b32128d-control-plane-qq5jm"
    ```

4. Set the cluster node name to the VM_NAME variable.

    ```bash
    VM_NAME="mynexusk8scluster-0b32128d-agentpool1-md-7h9t4"
    ```

5. Run the following command to SSH into the cluster node.

    ```azurecli-interactive
    az ssh arc --subscription $SUBSCRIPTION_ID \
        --resource-group $MANAGED_RESOURCE_GROUP \
        --name $VM_NAME \
        --local-user $ADMIN_USERNAME \
        --private-key-file $SSH_PRIVATE_KEY_FILE
    ```

## Access nodes using the Kubernetes API

This method requires usage of `kubectl debug` command. This method is limited to containers and may miss wider system issues, unlike SSH (using 'az ssh arc' or direct IP), which offers full node access and control.

### Access to Kubernetes API via Azure Arc for Kubernetes

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/cluster-connect.md)]

### Access to cluster nodes via Azure Arc for Kubernetes

Once you're connected to a cluster via Arc for Kubernetes, you can connect to individual Kubernetes node using the `kubectl debug` command to run a privileged container on your node.

1. List the nodes in your Nexus Kubernetes cluster:

    ```console
    $> kubectl get nodes
    NAME                                             STATUS   ROLES           AGE    VERSION
    mynexusk8scluster-0b32128d-agentpool1-md-7h9t4   Ready    <none>          125m   v1.24.9
    mynexusk8scluster-0b32128d-agentpool1-md-c6xbs   Ready    <none>          125m   v1.24.9
    mynexusk8scluster-0b32128d-control-plane-qq5jm   Ready    <none>          124m   v1.24.9
    ```

2. Start a privileged container on your node and connect to it:

    ```console
    $> kubectl debug node/mynexusk8scluster-0b32128d-agentpool1-md-7h9t4 -it --image=mcr.microsoft.com/cbl-mariner/base/core:2.0
    Creating debugging pod node-debugger-mynexusk8scluster-0b32128d-agentpool1-md-7h9t4-694gg with container debugger on node mynexusk8scluster-0b32128d-agentpool1-md-7h9t4.
    If you don't see a command prompt, try pressing enter.
    root [ / ]#
    ```

    This privileged container gives access to the node. Execute commands on the cluster node by running `chroot /host` at the command line. 

3. When you're done with a debugging pod, enter the `exit` command to end the interactive shell session. After exiting the shell, make sure to delete the pod:

    ```bash
    kubectl delete pod node-debugger-mynexusk8scluster-0b32128d-agentpool1-md-7h9t4-694gg 
    ```

## Create an interactive shell connection to a node using the IP address

### Connect to the cluster node from Azure jumpbox

Another option for securely connecting to an Azure Operator Nexus Kubernetes cluster node is to set up a direct access to the cluster's CNI network from Azure jumpbox VM. Using this approach, you can SSH into the cluster nodes, also execute `kubectl` commands against the cluster using the `kubeconfig` file.

Reach out to your network administrator to set up a direct connection from Azure jumpbox VM to the cluster's CNI network.

### Connect to the cluster node from on-premises jumpbox

Establish direct access to the cluster's CNI (Container Network Interface) from within your on-premises jumpbox. This direct access enables you to SSH into the cluster nodes, and lets you execute `kubectl` commands using the `kubeconfig` file.

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

    ```azurecli-interactive
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
