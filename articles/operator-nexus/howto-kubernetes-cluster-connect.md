---
title: Connect to Azure Operator Nexus Kubernetes cluster
description: Learn how to connect to Azure Operator Nexus Kubernetes cluster for interacting, troubleshooting, and maintenance tasks
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/17/2023 
ms.custom: template-how-to-pattern
---

# Connect to Azure Operator Nexus Kubernetes cluster for interacting, troubleshooting, and maintenance tasks

This article provides instructions on how to connect to Azure Operator Nexus Kubernetes cluster and its nodes. It includes details on how to connect to the cluster from both Azure and on-premises environments, and how to do so when the ExpressRoute is in both connected and disconnected modes.

In Azure, connected mode and disconnected mode refer to the state of an ExpressRoute circuit. ExpressRoute is a service provided by Azure that enables organizations to establish a private, high-throughput connection between their on-premises infrastructure and Azure datacenters.

* Connected Mode: In connected mode, the ExpressRoute circuit is fully operational and provides a private connection between your on-premises infrastructure and Azure services. This mode is ideal for scenarios where you need constant connectivity to Azure.
* Disconnected Mode: In disconnected mode, the ExpressRoute circuit is partially or down and is unable to provide connectivity to Azure services. This mode is useful when you want to perform maintenance on the circuit or need to temporarily disconnect from Azure.

> [!IMPORTANT]
> While the ExpressRoute circuit is in disconnected mode, traffic will not be able to flow between your on-premises environment and Azure. Therefore, it is recommended to only use disconnected mode when necessary, and to monitor the circuit closely to ensure it is brought back to connected mode as soon as possible.

## Prerequisites

* An Azure Operator Nexus Kubernetes cluster deployed in a resource group in your Azure subscription.
* SSH private key for the cluster nodes.
* If you're connecting in disconnected mode, you must have a jumpbox VM deployed in the same virtual network as the cluster nodes.

## Connected mode access

When operating in connected mode, it's possible to connect to the cluster's kube-api server using the `connectedk8s proxy`. Also it's possible to SSH into the worker nodes for troubleshooting or maintenance tasks from Azure using express route.

### Arc for Kubernetes

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/cluster-connect.md)]

### Arc for servers

The `az ssh arc` command allows users to remotely access a cluster VM that has been connected to Azure Arc. This method is a secure way to SSH into the cluster node directly from the command line, while in connected mode. Once the cluster VM has been registered with Azure Arc, the `az ssh arc` command can be used to manage the machine remotely, making it a quick and efficient method for remote management.

To use `az arc ssh`, users need to manually connect the cluster VMs to Arc by creating a service principle (SP) with 'Azure Connected Machine Onboarding' role. For more detailed steps on how to connect a Nexus Kubernetes cluster nodes to Arc, refer to the [how to guide](./howto-monitor-naks-cluster.md#monitor-nexus-kubernetes-cluster--vm-layer).

1. Set the required variables.

    ```bash
    RESOURCE_GROUP="myResourceGroup"
    CLUSTER_NAME="myNexusAKSCluster"
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
    "mynexusakscluster-0aeaccf8-agentpool1-md-dfvzz"
    "mynexusakscluster-0aeaccf8-agentpool1-md-gvqmj"
    "mynexusakscluster-0aeaccf8-control-plane-hrmzr"
    ```

4. Run the following command to SSH into the cluster VM.

    ```azurecli
    az ssh arc --subscription $SUBSCRIPTION_ID \
        --resource-group $RESOURCE_GROUP \
        --name <VM Name> \
        --local-user $USER_NAME \
        --private-key-file $SSH_PRIVATE_KEY_FILE
    ```

### Azure jumpbox

Another option for securely connecting to Nexus Kubernetes cluster node from Azure is to use a jumpbox. In this approach, an Azure cluster VM is set up as a secure gateway to connect to the cluster nodes.

To access a cluster node from Azure via a jumpbox, it's necessary to create a new cluster VM in your Azure environment to act as the jumpbox. This jumpbox must establish network connections with both, the cluster's L3 OAM and the user's workstation. Additionally, a NetworkCloud VM with L3 OAM and CNI network should be created to establish a connection with the cluster VM. It's important to note that the NetworkCloud and cluster VMs must be on the same isolation domain for connectivity. The user needs an SSH key for the K8s VM to authenticate their access.

It's important to ensure that the jumpbox is configured securely and that it's regularly updated with the latest security patches. Additionally, access to the jumpbox should be tightly controlled to prevent unauthorized access. The user must also have an SSH private key to authenticate their access to the on-premises VM.

## Disconnected mode access

When operating in disconnected mode, it's not possible to connect to the cluster's kube-api server using the `connectedk8s proxy` or to SSH into the worker nodes for troubleshooting or maintenance tasks.

However, it's possible to connect to the cluster nodes using the local jumpbox VM within the same virtual network as the cluster nodes. This VM serves as a reliable bridge for connectivity.

There are two networks that can be used to connect to the cluster nodes:

* CSN network
* L3 network (attached as an `OSDevice`)

During the cluster creation process, a L3 network (Tenant defined L3 isolation domain) can be attached to the agent pool as an `OSDevice`, which can then be used as the OAM purpose. For more information on how to attach a L3 network as an `OSDevice` during cluster creation, see the [QuickStart](./quickstarts-kubernetes-cluster-deployment-bicep.md) guide.

> [!NOTE]
> For understanding purposes, the L3 network (attached as an `OSDevice`) will be referred to as the 'OAM network' in this article.

The OAM network is the recommended network to use for connectivity during disconnected mode. It's important to note that the CSN network is used for critical cluster functions and shouldn't be used for general connectivity. While there's no difference in the connectivity experience between the two networks, it's recommended to use the OAM network for all noncritical connectivity needs.

The L3 network as `OSDevice` must be attached to the agent pool during the cluster creation process, and it can't be attached to the agent pool after the cluster is created. Also, the OAM network isn't attached to the control plane nodes, so you can't connect to the control plane nodes using the OAM network. In those cases, you can use the CSN network to connect to the control plane nodes.

It's not recommended to log into the control plane nodes unless it's necessary. However, you may be required to sign-in to get the kubeconfig file for the cluster. If the local jumpbox is connected to the CNI network, you can use the kubeconfig file to execute kubectl against the cluster instead of logging into the control plane nodes.

### IP address of the cluster nodes

Before you can connect to the cluster nodes, you need to find the IP address of the nodes. The IP address of the nodes can be found using the Azure portal or the Azure CLI.

#### Using the Azure CLI

1. Set the RESOURCE_GROUP, CLUSTER_NAME, and SUBSCRIPTION_ID variables to match your environment.

    ```bash
    RESOURCE_GROUP="myResourceGroup"
    CLUSTER_NAME="myNexusAKSCluster"
    SUBSCRIPTION_ID="<Subscription ID>"
    ```

2. Execute the following command to get the IP address of the nodes.

    ```azurecli
    az networkcloud kubernetescluster show --name $CLUSTER_NAME --resource-group $RESOURCE_GROUP --subscription $SUBSCRIPTION_ID -o json | jq '.nodes[] | select(any(.networkAttachments[]; .networkAttachmentName == "defaultcni")) | {name: .name, ipv4Address: (.networkAttachments[] | select(.networkAttachmentName == "defaultcni").ipv4Address)}'
    ```

3. Here's the sample output of the command.

    ```json
    {
      "name": "mynexusakscluster-593806e9-agentpool1-md-dw57z",
      "ipv4Address": "<IP address>"
    }
    {
      "name": "mynexusakscluster-593806e9-agentpool1-md-zmxp9",
      "ipv4Address": "<IP address>"
    }
    {
      "name": "mynexusakscluster-593806e9-control-plane-xm7rt",
      "ipv4Address": "<IP address>"
    }
    ```

#### Using the Azure portal

To find the IP address of the VM for SSH, follow these steps:

1. Go to the [Azure portal](https://portal.azure.com) and sign-in with your username and password.
2. Type 'Kubernetes Cluster (Operator Nexus)' in the search box and select the 'Kubernetes Cluster' service from the list of results.
:::image type="content" source="media/k8s/search-k8s-service.png" alt-text="Screenshot of browsing Nexus Kubernetes service":::
3. Look for the specific 'Nexus Kubernetes cluster' resource you need to use the search.
:::image type="content" source="media/k8s/search-k8s-cluster.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster":::
:::image type="content" source="media/k8s/k8s-cluster-home.png" alt-text="Screenshot of Nexus Kubernetes cluster home page":::
4. Once you've found the right resource by matching its name with the cluster name, go to the 'Kubernetes Cluster Nodes' section in the left menu.
:::image type="content" source="media/k8s/k8s-cluster-nodes.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster nodes":::
5. Select on the Kubernetes node name you're interested in to see its details.
6. Check the 'Attached Networks' tab to find the IP address of the node's 'Layer 3 Network' that used as CNI network.
:::image type="content" source="media/k8s/cp-network-attachment.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster node networks":::
7. If you attached a L3 network for OAM purpose, you can find the IP address of the node's 'Layer 3 Network' that used as OAM network.
:::image type="content" source="media/k8s/agent-pool-network-attachment.png" alt-text="Screenshot of browsing Nexus Kubernetes cluster node IP":::

## Next steps

Try out the following articles to learn more about Azure Operator Nexus Kubernetes cluster.
1. [Quickstart: Deploy an Azure Operator Nexus Kubernetes cluster using Bicep](./quickstarts-kubernetes-cluster-deployment-bicep.md)
2. [How to: Monitor Azure Operator Nexus Kubernetes cluster](./howto-monitor-naks-cluster.md)
