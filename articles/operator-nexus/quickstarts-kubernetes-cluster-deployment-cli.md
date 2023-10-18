---
title: Create an Azure Nexus Kubernetes cluster by using Azure CLI
description: Learn how to create an Azure Nexus Kubernetes cluster by using Azure CLI.
ms.service: azure-operator-nexus
author: dramasamy
ms.author: dramasamy
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurecli
ms.date: 05/13/2023
---

# Quickstart: Create an Azure Nexus Kubernetes cluster by using Azure CLI

* Deploy an Azure Nexus Kubernetes cluster using Azure CLI.

## Before you begin

[!INCLUDE [kubernetes-cluster-prereq](./includes/kubernetes-cluster/quickstart-prereq.md)]

## Create an Azure Nexus Kubernetes cluster

The following example creates a cluster named *myNexusK8sCluster* in resource group *myResourceGroup* in the *eastus* location.

Before you run the commands, you need to set several variables to define the configuration for your cluster. Here are the variables you need to set, along with some default values you can use for certain variables:

| Variable                   | Description                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| LOCATION                   | The Azure region where you want to create your cluster.                                                                  |
| RESOURCE_GROUP             | The name of the Azure resource group where you want to create the cluster.                                               |
| SUBSCRIPTION_ID            | The ID of your Azure subscription.                                                                                       |
| CUSTOM_LOCATION            | This argument specifies a custom location of the Nexus instance.                                                         |
| CSN_ARM_ID                 | CSN ID is the unique identifier for the cloud services network you want to use.                                          |
| CNI_ARM_ID                 | CNI ID is the unique identifier for the network interface to be used by the container runtime.                           |
| AAD_ADMIN_GROUP_OBJECT_ID  | The object ID of the Azure Active Directory group that should have admin privileges on the cluster.                      |
| CLUSTER_NAME               | The name you want to give to your Nexus Kubernetes cluster.                                                              |
| K8S_VERSION                | The version of Kubernetes you want to use.                                                                               |
| ADMIN_USERNAME             | The username for the cluster administrator.                                                                              |
| SSH_PUBLIC_KEY             | The SSH public key that is used for secure communication with the cluster.                                               |
| CONTROL_PLANE_COUNT        | The number of control plane nodes for the cluster.                                                                       |
| CONTROL_PLANE_VM_SIZE      | The size of the virtual machine for the control plane nodes.                                                             |
| INITIAL_AGENT_POOL_NAME    | The name of the initial agent pool.                                                                                      |
| INITIAL_AGENT_POOL_COUNT   | The number of nodes in the initial agent pool.                                                                           |
| INITIAL_AGENT_POOL_VM_SIZE | The size of the virtual machine for the initial agent pool.                                                              |
| POD_CIDR                   | The network range for the Kubernetes pods in the cluster, in CIDR notation.                                              |
| SERVICE_CIDR               | The network range for the Kubernetes services in the cluster, in CIDR notation.                                          |
| DNS_SERVICE_IP             | The IP address for the Kubernetes DNS service.                                                                           |

Once you've defined these variables, you can run the Azure CLI command to create the cluster. Add the ```--debug``` flag at the end to provide more detailed output for troubleshooting purposes.

To define these variables, use the following set commands and replace the example values with your preferred values. You can also use the default values for some of the variables, as shown in the following example:

```bash
RESOURCE_GROUP="myResourceGroup"
SUBSCRIPTION_ID="<Azure subscription ID>"
LOCATION="$(az group show --name $RESOURCE_GROUP --query location --subscription $SUBSCRIPTION_ID -o tsv)"
CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
CSN_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
CNI_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
AAD_ADMIN_GROUP_OBJECT_ID="00000000-0000-0000-0000-000000000000"
CLUSTER_NAME="myNexusK8sCluster"
K8S_VERSION="v1.24.9"
ADMIN_USERNAME="azureuser"
SSH_PUBLIC_KEY="$(cat ~/.ssh/id_rsa.pub)"
CONTROL_PLANE_COUNT="1"
CONTROL_PLANE_VM_SIZE="NC_G6_28_v1"
INITIAL_AGENT_POOL_NAME="${CLUSTER_NAME}-nodepool-1"
INITIAL_AGENT_POOL_COUNT="1"
INITIAL_AGENT_POOL_VM_SIZE="NC_P10_56_v1"
POD_CIDR="10.244.0.0/16"
SERVICE_CIDR="10.96.0.0/16"
DNS_SERVICE_IP="10.96.0.10"
```

> [!IMPORTANT]
> It is essential that you replace the placeholders for CUSTOM_LOCATION, CSN_ARM_ID, CNI_ARM_ID, and AAD_ADMIN_GROUP_OBJECT_ID with your actual values before running these commands.

After defining these variables, you can create the Kubernetes cluster by executing the following Azure CLI command:

```azurecli
az networkcloud kubernetescluster create \
  --name "${CLUSTER_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --subscription "${SUBSCRIPTION_ID}" \
  --extended-location name="${CUSTOM_LOCATION}" type=CustomLocation \
  --location "${LOCATION}" \
  --kubernetes-version "${K8S_VERSION}" \
  --aad-configuration admin-group-object-ids="[${AAD_ADMIN_GROUP_OBJECT_ID}]" \
  --admin-username "${ADMIN_USERNAME}" \
  --ssh-key-values "${SSH_PUBLIC_KEY}" \
  --control-plane-node-configuration \
    count="${CONTROL_PLANE_COUNT}" \
    vm-sku-name="${CONTROL_PLANE_VM_SIZE}" \
  --initial-agent-pool-configurations "[{count:${INITIAL_AGENT_POOL_COUNT},mode:System,name:${INITIAL_AGENT_POOL_NAME},vm-sku-name:${INITIAL_AGENT_POOL_VM_SIZE}}]" \
  --network-configuration \
    cloud-services-network-id="${CSN_ARM_ID}" \
    cni-network-id="${CNI_ARM_ID}" \
    pod-cidrs="[${POD_CIDR}]" \
    service-cidrs="[${SERVICE_CIDR}]" \
    dns-service-ip="${DNS_SERVICE_IP}"
```

After a few minutes, the command completes and returns information about the cluster. For more advanced options, see [Quickstart: Deploy an Azure Nexus Kubernetes cluster using Bicep](./quickstarts-kubernetes-cluster-deployment-bicep.md).

## Review deployed resources

[!INCLUDE [quickstart-review-deployment-cli](./includes/kubernetes-cluster/quickstart-review-deployment-cli.md)]

## Connect to the cluster

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/quickstart-cluster-connect.md)]

## Add an agent pool

The cluster created in the previous step has a single node pool. Let's add a second agent pool using the ```az networkcloud kubernetescluster agentpool create``` command. The following example creates an agent pool named ```myNexusK8sCluster-nodepool-2```:

You can also use the default values for some of the variables, as shown in the following example:

```bash
RESOURCE_GROUP="myResourceGroup"
CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
CLUSTER_NAME="myNexusK8sCluster"
AGENT_POOL_NAME="${CLUSTER_NAME}-nodepool-2"
AGENT_POOL_VM_SIZE="NC_P10_56_v1"
AGENT_POOL_COUNT="1"
AGENT_POOL_MODE="User"
```

After defining these variables, you can add an agent pool by executing the following Azure CLI command:

```azurecli
az networkcloud kubernetescluster agentpool create \
  --name "${AGENT_POOL_NAME}" \
  --kubernetes-cluster-name "${CLUSTER_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --subscription "${SUBSCRIPTION_ID}" \
  --extended-location name="${CUSTOM_LOCATION}" type=CustomLocation \
  --count "${AGENT_POOL_COUNT}" \
  --mode "${AGENT_POOL_MODE}" \
  --vm-sku-name "${AGENT_POOL_VM_SIZE}"
```

After a few minutes, the command completes and returns information about the agent pool. For more advanced options, see [Quickstart: Deploy an Azure Nexus Kubernetes cluster using Bicep](./quickstarts-kubernetes-cluster-deployment-bicep.md).

[!INCLUDE [quickstart-review-nodepool](./includes/kubernetes-cluster/quickstart-review-nodepool.md)]

## Clean up resources

[!INCLUDE [quickstart-cleanup](./includes/kubernetes-cluster/quickstart-cleanup.md)]

## Next steps

[!INCLUDE [quickstart-nextsteps](./includes/kubernetes-cluster/quickstart-nextsteps.md)]
