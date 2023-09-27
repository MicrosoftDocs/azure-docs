---
title: Create an Azure Nexus Kubernetes cluster by using Azure PowerShell
description: Learn how to create an Azure Nexus Kubernetes cluster by using Azure PowerShell.
ms.service: azure-operator-nexus
author: rashirg
ms.author: rajeshwarig
ms.topic: quickstart
ms.custom: subject-armqs, devx-track-azurepowershell
ms.date: 09/26/2023
---

# Quickstart: Create an Azure Nexus Kubernetes cluster by using Azure PowerShell

* Deploy an Azure Nexus Kubernetes cluster using Azure PowerShell.

## Before you begin

[!INCLUDE [kubernetes-cluster-prereq](./includes/kubernetes-cluster/quickstart-prereq-ps.md)]

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
| MODE                       | The mode of the agent pool containing the node, values apply System or User or NotApplicable
| AGENTPOOLCONFIGURATION     | The parameter specifies the agent pools created for running critical system services and workloads.                      |
| SERVICELOADBALANCEBGPPEER  | The configuration of the BGP service Load balancer.                                                                      |
| BGPADVERTISEMENT           | The parameter specifies the association of IP address pools to the communities and peers.                                |
| BGPIPADDRESSPOOLS          | The list of pools of IP addresses that can be allocated to Load Balancer services.                                |
| PEERADDRESS                | The IPV4 or IPV6 address use to connect the BGP session                                |
| PEERASN                    | The autonomous system number expected from remote end of BGP session.                                |
| BFDENABLED                | The indicator of BFD enablement for BgpPeer.                                |
| BGPMULTIHOP                | The indicator to enable multi-hop peering support.                                |
| PEERPORT                | The port used to connect the BGP session.                                |
| PASSWORD               | The authentication password for routers.                                |
| PEERADDRESS                | The IPV4 or IPV6 address use to connect the BGP session                                |
| COMMUNITY               | The names of the BGP communities to be associated.                                |
| ADDRESS               | The list of IP address ranges.                              |
| IPPOOLNAME               | The names of the IP address pool.                                |
| AUTOASSIGN               | The indicator if automatic allocation from pool should occur.                               |
| ONLYUSEHOSTIP               | The indicator to prevent use of IP addresses ending with .0 and .255.                               |
| IPADDRESSPOOL               | The names of the IP address pools associated.                                |

Once you've defined these variables, you can run the Azure PowerShell command to create the cluster. Add the ```-Debug``` flag at the end to provide more detailed output for troubleshooting purposes.

To define these variables, use the following set commands and replace the example values with your preferred values. You can also use the default values for some of the variables, as shown in the following example:

```azurepowershell-interactive
# Azure parameters
$RESOURCE_GROUP="myResourceGroup"
$SUBSCRIPTION="<Azure subscription ID>"
$CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
$CUSTOM_LOCATION_TYPE="CustomLocation"
$LOCATION="<ClusterAzureRegion>"

# Network parameters
$CSN_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
$CNI_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"

# AgentPoolConfiguration parameters
$INITIAL_AGENT_POOL_COUNT="1"
$MODE="System"
$INITIAL_AGENT_POOL_NAME="agenpool1"
$INITIAL_AGENT_POOL_VM_SIZE="NC_G2_v1"

# NAKS Cluster Parameters
$CLUSTER_NAME="myNexusK8sCluster"
$SSH_PUBLIC_KEY = @{
    KeyData = "$(cat ~/.ssh/id_rsa.pub)"
}
$K8S_VERSION="1.24.9"
$AAD_ADMIN_GROUP_OBJECT_ID="3d4c8620-ac8c-4bd6-9a92-f2b75923ef9f"
$ADMIN_USERNAME="azureuser"
$CONTROL_PLANE_COUNT="1"
$CONTROL_PLANE_VM_SIZE="NC_G2_v1"

# ServiceLoadBalancerBgpPeer parameters
$SERVICELOADBALANCERPEERNAME="bgpeername"
$PEERADDRESS="203.0.113.254"
$PEERASN="64497"
$BFDENABLED="False"
$BGPMULTIHOP="False"
$PASSWORD="passsword"
$PEERPORT="1234"

# BgpAdvertisement parameters
$IPADDRESSPOOL="test-ip-pool1"
$COMMUNITY="64515:100"

# BgpIpAddressPool parameters
$ADDRESS="10.12.40.0/27"
$IPPOOLNAME="pool1"
$AUTOASSIGN="True"
$ONLYUSEHOSTIP="True"

$AGENTPOOLCONFIGURATION = New-AzNetworkCloudInitialAgentPoolConfigurationObject `
-Count $INITIAL_AGENT_POOL_COUNT `
-Mode $MODE `
-Name $INITIAL_AGENT_POOL_NAME `
-VmSkuName $INITIAL_AGENT_POOL_VM_SIZE

$SERVICELOADBALANCEBGPPEER = New-AzNetworkCloudServiceLoadBalancerBgpPeerObject `
-Name $SERVICELOADBALANCERPEERNAME `
-PeerAddress $PEERADDRESS `
-PeerAsn $PEERASN `
-BfdEnabled $BFDENABLED `
-BgpMultiHop $BGPMULTIHOP `
-Password $PASSWORD `
-PeerPort $PEERPORT

$BGPADVERTISEMENT = New-AzNetworkCloudBgpAdvertisementObject `
-IPAddressPool @($IPADDRESSPOOL) `
-Community @($COMMUNITY)

$BGPIPADDRESSPOOLS=New-AzNetworkCloudIpAddressPoolObject `
-Address @($ADDRESS) `
-Name $IPPOOLNAME `
-AutoAssign $AUTOASSIGN `
-OnlyUseHostIP $ONLYUSEHOSTIP
```

> [!IMPORTANT]
> It is essential that you replace the placeholders for CUSTOM_LOCATION, CSN_ARM_ID, CNI_ARM_ID, and AAD_ADMIN_GROUP_OBJECT_ID with your actual values before running these commands.

After defining these variables, you can create the Kubernetes cluster by executing the following Azure PowerShell command:

```azurepowershell-interactive
New-AzNetworkCloudKubernetesCluster -KubernetesClusterName $CLUSTER_NAME `
-ResourceGroupName $RESOURCE_GROUP `
-SubscriptionId $SUBSCRIPTION `
-Location $LOCATION `
-ExtendedLocationName $CUSTOM_LOCATION `
-ExtendedLocationType $CUSTOM_LOCATION_TYPE ` 
-KubernetesVersion $K8S_VERSION `
-AadConfigurationAdminGroupObjectId $AAD_ADMIN_GROUP_OBJECT_ID `
-AdminUsername $ADMIN_USERNAME `
-SshPublicKey $SSH_PUBLIC_KEY `
-InitialAgentPoolConfiguration $AGENTPOOLCONFIGURATION `
-NetworkConfigurationCloudServicesNetworkId $CSN_ARM_ID `
-NetworkConfigurationCniNetworkId $CNI_ARM_ID `
-ControlPlaneNodeConfigurationCount $CONTROL_PLANE_COUNT `
-ControlPlaneNodeConfigurationVMSkuName $CONTROL_PLANE_VM_SIZE `
-BgpAdvertisement $BGPADVERTISEMENT `
-BgpPeer $SERVICELOADBALANCEBGPPEER `
-BgpIPAddressPool $BGPIPADDRESSPOOLS
```

After a few minutes, the command completes and returns information about the cluster. For more advanced options, see [Quickstart: Deploy an Azure Nexus Kubernetes cluster using Bicep](./quickstarts-kubernetes-cluster-deployment-bicep.md).

## Review deployed resources

[!INCLUDE [quickstart-review-deployment-cli](./includes/kubernetes-cluster/quickstart-review-deployment-ps.md)]

## Connect to the cluster

[!INCLUDE [quickstart-cluster-connect](./includes/kubernetes-cluster/quickstart-cluster-connect.md)]

## Add an agent pool

The cluster created in the previous step has a single node pool. Let's add a second agent pool using the ```New-AzNetworkCloudAgentPool``` create command. The following example creates an agent pool named ```myNexusK8sCluster-nodepool-2```:

You can also use the default values for some of the variables, as shown in the following example:

```azurepowershell-interactive
$RESOURCE_GROUP="myResourceGroup"
$SUBSCRIPTION="<Azure subscription ID>"
$CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
$CUSTOM_LOCATION_TYPE="CustomLocation"
$LOCATION="<ClusterAzureRegion>"
$AGENT_POOL_NAME="myNexusK8sCluster-nodepool-2"
$AGENT_POOL_VM_SIZE="NC_G2_v1"
$AGENT_POOL_COUNT="1"
$AGENT_POOL_MODE="System"
$AGENT_POOL_HUGEPAGE_SIZE="2M"
$SSH_PUBLIC_KEY = @{
    KeyData = "$(cat ~/.ssh/id_rsa.pub)"
}
$ADMIN_USERNAME="azureuser"
$CNI_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
$IPAM_ENABLED="True"
$PLUGIN_TYPE="SRIOV"
$L3_NETWORK_ATTACHMENT = New-AzNetworkCloudL3NetworkAttachmentConfigurationObject -NetworkId $CNI_ARM_ID `
-IpamEnabled $IPAM_ENABLED `
-PluginType $PLUGIN_TYPE
```

After defining these variables, you can add an agent pool by executing the following Azure PowerShell command:

```azurepowershell-interactive
New-AzNetworkCloudAgentPool -KubernetesClusterName $CLUSTER_NAME `
-Name $AGENT_POOL_NAME `
-ResourceGroupName $RESOURCE_GROUP `
-Count $AGENT_POOL_COUNT `
-Location $LOCATION `
-Mode $AGENT_POOL_MODE `
-VMSkuName $AGENT_POOL_VM_SIZE `
-SubscriptionId $SUBSCRIPTION `
-AdministratorConfigurationAdminUsername $ADMIN_USERNAME `
-AdministratorConfigurationSshPublicKey $SSH_PUBLIC_KEY `
-AgentOptionHugepagesCount $AGENT_POOL_COUNT `
-AgentOptionHugepagesSize $AGENT_POOL_HUGEPAGE_SIZE `
-AttachedNetworkConfigurationL3Network $L3_NETWORK_ATTACHMENT `
-ExtendedLocationName $CUSTOM_LOCATION `
-ExtendedLocationType $CUSTOM_LOCATION_TYPE
```

After a few minutes, the command completes and returns information about the agent pool. For more advanced options, see [Quickstart: Deploy an Azure Nexus Kubernetes cluster using Bicep](./quickstarts-kubernetes-cluster-deployment-bicep.md).

[!INCLUDE [quickstart-review-nodepool](./includes/kubernetes-cluster/quickstart-review-nodepool.md)]

## Clean up resources

[!INCLUDE [quickstart-cleanup](./includes/kubernetes-cluster/quickstart-cleanup-ps.md)]

## Next steps

[!INCLUDE [quickstart-nextsteps](./includes/kubernetes-cluster/quickstart-nextsteps.md)]
