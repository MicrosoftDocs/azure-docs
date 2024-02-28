---
title: Prerequisites to deploy Azure Operator 5G Core Preview on Nexus Azure Kubernetes Service
description: Learn how to complete the prerequisites necessary to deploy Azure Operator 5G Core Preview on the Nexus Azure Kubernetes Service.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.topic: how-to #required; leave this attribute/value as-is.
ms.date: 02/22/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Complete the prerequisites to deploy Azure Operator 5G Core Preview on Nexus Azure Kubernetes Service
This article describes how to provision a Nexus Azure Kubernetes Service (NAKS) cluster by creating: 

- Network fabric (connectivity) resources
- Network cloud (compute) resources

> [!NOTE]
> The example configuration in this article uses the Azure CLI. You can also create these resources using bicep scripts, terraform scripts, ARM templates, or custom programs that call relevant APIs directly. 

Commands used in this article refer to the following resource groups:

- Infrastructure (managed) resource groups:
    - Fabric - platform networking resources 
    - Undercloud - platform compute resources 
    - Managed resource group used to host Azure-ARC Kubernetes resources 
- Tenant resource groups:
    - Fabric - tenant networking resources (such as networks) 
    - Compute - tenant compute resources (such as VMs, and Nexus AKS clusters) 


## Prerequisites

Before provisioning a NAKS cluster:
- Configure external networks between CEs and PEs (or Telco Edge) that allow connectivity with the provider edge. Configuring access to external services like firewalls and services hosted on Azure (tenant not platform) is outside of the scope of this article.
- Configure elements on PEs/Telco Edge that aren't controlled by Nexus Network Fabric, such as  Express Route Circuits configuration for tenant workloads connectivity to Azure.
- Review the [Nexus Kubernetes release calendar](../operator-nexus/reference-nexus-kubernetes-cluster-supported-versions.md) to identify available releases and support plans.
- Review the [Nexus Kubernetes Cluster Overview](../operator-nexus/concepts-nexus-kubernetes-cluster.md). 
- Review the [Network Fabric Overview](../operator-nexus/concepts-network-fabric.md).
- Review the [Azure Isolation Domains How-To Guide](../operator-nexus/howto-configure-isolation-domain.md). 
- Review the [storage overview](../operator-nexus/concepts-storage.md).

## Configure internal networks and protocols

Complete these tasks to set up your internal network.

### Create the isolation domain (L3ISD)

Use the following Azure CLI commands to create the isolation domain (ISD):

```azurecli
export subscriptionId=”<SUBSCRIPTION-ID>” 
export rgManagedFabric=”<RG-MANAGED-FABRIC>” 
export nnfId=”<NETWORK-FABRIC-ID>” 
export rgFabric=”<RG-FABRIC>” 
export l3Isd=”<ISD-NAME>” 
export region=”<REGION>” 
 
az networkfabric l3domain create –resource-name $l3Isd \ 
--resource-group $rgFabric \ 
--location $region \ 
--nf-id “/subscriptions/$subscriptionId/resourceGroups/$rgManagedFabric/providers/Microsoft.ManagedNetworkFabric/networkFabrics/$nnfId” \ 
--redistribute-connected-subnets “True” \ 
--redistribute-static-routes “True” \ 
--subscription “$subscriptionId”
```

To view the new isolation domain in the Azure portal:
1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to  for **Network Fabric (Operator Nexus)** resource.
1. Select **network fabric** from the list.
1. Select **Isolation Domain**. 
1. Select the relevant isolation domain (ISD).

## Create the internal network

Before creating or modifying the internal network, you must disable the ISD. Re-enable the ISD after making your changes. 

### Disable the isolation domain

Use the following commands to disable the ISD:

```azurecli
export subscriptionId=”<SUBSCRIPTION-ID>” 
export rgFabric=”<RG-FABRIC>” 
export l3Isd=”<ISD-NAME>” 
  
# Disable ISD in order to create internal networks, wait for 5 minutes and check the status is Disabled 
 
az networkfabric l3domain update-admin-state –resource-name “$l3Isd” \ 
--resource-group “$rgFabric” \ 
--subscription “$subscriptionId” \ 
--state Disable 
 
# Check the status of the ISD 
 
az networkfabric l3domain show –resource-name “$l3Isd” \ 
--resource-group “$rgFabric” \ 
--subscription “$subscriptionId”
```

With the ISD disabled, you can add, modify, or remove the internal network. When you're finished making changes, re-enable ISD. 

## Create the default Azure Container Network Interface internal network 

Use the following commands to create the default Azure Container Network Interface (CNI) internal network:

```azurecli
export subscriptionId=”<SUBSCRIPTION-ID>” 
export intnwDefCni=”<DEFAULT-CNI-NAME>” 
export l3Isd=”<ISD-NAME>” 
export rgFabric=”<RG-FABRIC>” 
export vlan=<VLAN-ID> 
export peerAsn=<PEER-ASN> 
export ipv4ListenRangePrefix=”<DEFAULT-CNI-IPV4-PREFIX>/<PREFIX-LEN>” 
export mtu=9000 
 
az networkfabric internalnetwork create –resource-name “$intnwDefCni” \ 
--resource-group “$rgFabric” \ 
--subscription “$subscriptionId” \ 
--l3domain “$l3Isd” \ 
--vlan-id $vlan \ 
--mtu $mtu \ 
--connected-ipv4-subnets “[{prefix:$ipv4ListenRangePrefix}]” \ 
--bgp-configuration
```

## Create internal networks for SMF ULB (S11/S5), UPF iPPE (N3, N6) 

When creating the SMF ULB and UPF iPPE internal networks, make sure to include IP-v6 addressing. You don't need to configure the  BGP fabric-side ASN. ASN is included in network fabric resource creation. Use the following commands to create these internal networks:

```azurecli
export subscriptionId=”<SUBSCRIPTION-ID>” 
export intnwName=”<INTNW-NAME>” 
export l3Isd=”<ISD-NAME>” 
export rgFabric=”<RG-FABRIC>” 
export vlan=<VLAN-ID> 
export peerAsn=<PEER-ASN> 
export ipv4ListenRangePrefix=”<IPV4-PREFIX>/<PREFIX-LEN>” 
export ipv6ListenRangePrefix=”<IPV6-PREFIX>/<PREFIX-LEN>” 
export mtu=9000 
 
az networkfabric internalnetwork create –resource-name “$intnwName” \ 
--resource-group “$rgFabric” \ 
--subscription “$subscriptionId” \ 
--l3domain “$l3Isd” \ 
--vlan-id $vlan \ 
--mtu $mtu \ 
--connected-ipv4-subnets “[{prefix:$ipv4ListenRangePrefix}]” \ 
--connected-ipv6-subnets “[{prefix:’$ipv6ListenRangePrefix’}]” \ 
--bgp-configuration “{peerASN:$peerAsn,allowAS:0,defaultRouteOriginate:True,ipv4ListenRangePrefixes:[$ipv4ListenRangePrefix],ipv6ListenRangePrefixes:[‘$ipv6ListenRangePrefix’]}”
```

To view the fabric ASN  from the Azure portal:
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Search for the **Network Fabric (Operator Nexus)** resource.
1. Select **network fabric** from the list.
1. Review the ASN in properties – **Fabric ASN** or in the **Internal Network** details. 
 
### Enable isolation domain 

Use the following commands to enable the ISD:

```azurecli
export subscriptionId=”<SUBSCRIPTION-ID>” 
export rgFabric=”<RG-FABRIC>” 
export l3Isd=”<ISD-NAME>” 
  
# Enable ISD, wait for 5 minutes and check the status is Enabled 
 
az networkfabric l3domain update-admin-state –resource-name “$l3Isd” \ 
--resource-group “$rgFabric” \ 
--subscription “$subscriptionId” \ 
--state Enable 
 
# Check the status of the ISD 
 
az networkfabric l3domain show –resource-name “$l3Isd” \ 
--resource-group “$rgFabric” \ 
--subscription “$subscriptionId”
```

### Recommended routing settings
 
To configure BGP and BFD routing for internal networks, use the default settings. See [Nexus documentation](../operator-nexus/howto-configure-isolation-domain.md) for parameter descriptions.

## Create L3 networks 

Before deploying the NAKS cluster, you must create NC L3 networking resources that map to network fabric (NF) resources. 
You must create L3 network NC resources for the default CNI interface,  including the ISD/VLAN/IP prefix of a  corresponding internal network.   Attach these resources directly to VMs to perform VLAN tagging at the NIC (VF) level instead of the application level (access ports from application perspective) and/or if  IP addresses are allocated by Nexus (using IP Address Management (ipam) functionality). 
An L3 network is used for the default CNI interface. Additional interfaces that require multiple VLANs per single interface must be trunk interfaces.  

Use the following commands to create the L3 network:  

```azurecli
Export subscriptionId=”<SUBSCRIPTION-ID>” 
export rgManagedUndercloudCluster=”<RG-MANAGED-UNDERCLOUD-CLUSTER>” 
export undercloudCustLocationName=”<UNDERCLOUD-CUST-LOCATION-NAME>” 
export rgFabric=”<RG-FABRIC>” 
export rgCompute=”<RG-COMPUTE>” 
export l3Name=”<L3-NET-NAME>” 
export l3Isd=”<ISD-NAME>” 
export region=”<REGION>” 
export vlan=<VLAN-ID> 
export ipAllocationType=”IPV4” // DualStack, IPV4, IPV6 
export ipv4ConnectedPrefix=”<DEFAULT-CNI-IPV4-PREFIX>/<PREFIX-LEN>” // if IPV4 or DualStack 
export ipv6ConnectedPrefix=”<DEFAULT-CNI-IPV6-PREFIX>/<PREFIX-LEN>” // if IPV6 or DualStack 
 
 az networkcloud l3network create –l3-network-name $l3Name \ 
--l3-isolation-domain-id “/subscriptions/$subscriptionId/resourceGroups/$rgFabric/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/$l3Isd” \ 
--vlan $vlan \ 
--ip-allocation-type $ipAllocationType \ 
--ipv4-connected-prefix $ipv4ConnectedPrefix \ 
--extended-location name=”/subscriptions/$subscriptionId/resourceGroups/$rgManagedUndercloudCluster/providers/Microsoft.ExtendedLocation/customLocations/$undercloudCustLocationName” type=”CustomLocation” \ 
--resource-group $rgCompute \ 
--location $region \ 
--subscription $subscriptionId \ 
--interface-name “vlan-$vlan”
```
 
### Trunked networks 

A `trunkednetwork` network cloud resource is required if a single port/interface connected to a virtual machine must carry multiple virtual local area networks (VLANs). Tagging is performed at the application layer instead of NIC. A trunk interface can carry VLANs that are a part of different ISDs. 
You must create a trunked network for both SMF ULB (S11/S5) and UPF iPPE (N3, N6). 

Use the following commands to create a trunked network:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgManagedUndercloudCluster="<RG-MANAGED-UNDERCLOUD-CLUSTER>" 
export undercloudCustLocationName="<UNDERCLOUD-CUST-LOCATION-NAME>" 
export rgFabric="<RG-FABRIC>" 
export rgCompute="<RG-COMPUTE>" 
export trunkName="<TRUNK-NAME>" 
export l3IsdUlb="<ISD-ULB-NAME>" 
export vlanUlb=<VLAN-ULB-ID> 
export region="<REGION>" 
 
az networkcloud trunkednetwork create --name $trunkName \ 
--isolation-domain-ids "/subscriptions/$subscriptionId/resourceGroups/$rgFabric/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/$l3IsdUlb" \ 
--vlans $vlanUlb \ 
--extended-location name="/subscriptions/$subscriptionId/resourceGroups/$rgManagedUndercloudCluster/providers/Microsoft.ExtendedLocation/customLocations/$undercloudCustLocationName" type="CustomLocation" \ 
--resource-group $rgCompute \ 
--location $region \ 
--interface-name "trunk-ulb" \ 
--subscription $subscriptionId
```

## Configure the Cloud Services Network proxy and allowlisted domains 

A Cloud Services Network proxy (CSN proxy) is used to access Azure and internet destinations. You must explicitly add these domains to an allowlist in the CSN configuration for a NAKS cluster to access Azure services and for Arc integration. 

### Azure Operator Service Manager/Network Function Manager-based Cloud Services Networks endpoints

Add the following egress points for AOSM/NFM based deployment support (HybridNetwork RP, CustomLocation RP reachability, ACR, Arc): 

```azurecli
.azurecr.io / port 80 
.azurecr.io / port 443 
.mecdevice.azure.com / port 443 
eastus-prod.mecdevice.azure.com / port 443 
.microsoftmetrics.com / port 443 
crprivatemobilenetwork.azurecr.io / port 443 
.guestconfiguration.azure.com / port 443 
.kubernetesconfiguration.azure.com / port 443 
eastus.obo.arc.azure.com / port 8084 
.windows.net / port 80 
.windows.net / port 443 
.k8connecthelm.azureedge.net / port 80 
.k8connecthelm.azureedge.net / port 443 
.k8sconnectcsp.azureedge.net / port 80 
.k8sconnectcsp.azureedge.net / port 443 
.arc.azure.net / port 80 
.arc.azure.net / port 443
```

### Python Cloud Services Networks endpoints

For python packages installation (part of fed-kube_addons pod-node_config command list used for NAKS), add the following commands: 

```python
pypi.org / port 443 
files.pythonhosted.org / port 443
```

> [!NOTE]
> Additional ADX endpoints may need to be included in the allowlist if there is a requirement to inject data into Azure ADX. 

### Optional Cloud Services Networks endpoints 

Use the following destination to run containers that have their endpoints stored in public container registries or to install more packages for the auxiliary virtual machines: 

```azurecli
.ghcr.io / port 80 
.ghcr.io / port 443 
.k8s.gcr.io / port 80 
.k8s.gcr.io / port 443 
.k8s.io / port 80 
.k8s.io / port 443 
.docker.io / port 80 
.docker.io / port 443 
.docker.com / port 80 
.docker.com / port 443 
.pkg.dev / port 80 
.pkg.dev / port 443 
.ubuntu.com / port 80 
.ubuntu.com / port 443
```

## Create Cloud Services Networks

You must create a separate CSN instance for each NAKS cluster when you deploy Azure Operator 5G Core Preview on the Nexus platform. 
Adjust the additional-egress-endpoints list based on the previous description and lists. 

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgManagedUndercloudCluster="<RG-MANAGED-UNDERCLOUD-CLUSTER>" 
export undercloudCustLocationName="<UNDERCLOUD-CUST-LOCATION-NAME>" 
export rgCompute="<RG-COMPUTE>" 
export csnName="<CSN-NAME>" 
export region="<REGION>" 
 
az networkcloud cloudservicesnetwork create --cloud-services-network-name $csnName \ 
--extended-location name="/subscriptions/$subscriptionId/resourceGroups/$rgManagedUndercloudCluster/providers/Microsoft.ExtendedLocation/customLocations/$undercloudCustLocationName" type="CustomLocation" \06- \ 
--resource-group $rgCompute \ 
--location $region \ 
--enable-default-egress-endpoints True \ 
--subscription $subscriptionId \ 
--additional-egress-endpoints '[ 
    { 
      "category": "common", 
      "endpoints": [ 
        { 
          "domainName": ".io", 
          "port": 80 
        } 
      ] 
    }, 
    { 
      "category": "common", 
      "endpoints": [ 
        { 
          "domainName": ".io", 
          "port": 443 
        } 
      ] 
    } 
  ]'    07-
```
      
After you create the CSN, verify the `egress-endpoints` from the Azure portal. In the search bar, enter **Cloud Services Networks (Operator Nexus)** resource. Select **Overview**, then navigate to **Enabled egress endpoints** to see the list of endpoints you created.

## Create a Nexus Azure Kubernetes Services Cluster 

Nexus related resource providers must deploy self-managed resource groups that are used to deploy the necessary resources created by customers. When Nexus AKS clusters are provisioned, they must be Arc-enabled. The Network Cloud resource provider creates its own managed resource group and deploys it in an Azure Arc Kubernetes cluster resource. Following this deployment, this cluster resource is linked to the NAKS cluster resource.   

> [!NOTE]
> After the NAKS cluster deploys, and the managed resource group is created, you may need to grant privileges to all a user/entra group/service principal access to the managed resource group. This action is contingent upon the subscription level IAM settings.

Use the following Azure CLI commands to create the NAKS cluster:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgManagedUndercloudCluster="<RG-MANAGED-UNDERCLOUD-CLUSTER>" 
export undercloudCustLocationName="<UNDERCLOUD-CUST-LOCATION-NAME>" 
export rgCompute="<RG-COMPUTE>" 
export rgNcManaged="<RG-NETWORK-CLOUD-MANAGED>" 
export csnName="<CSN-NAME>" 
export defCniL3Net="<L3-NET-FOR-DEF-CNI>" 
export trunkName="<TRUNK-NAME>" 
export naksName="<NAKS-NAME>" 
export k8sVer="<K8S-VER>" 
export region="<REGION>" 
export regionRgNcManaged="<REGION-RG-NETWORK-CLOUD-MANAGED>" 
export sshPubKeys="<SSH-PUB-KEYS>"  
export adminUser="<ADMIN-USER>" // e.g. "azureuser" 
export controlVmSku="<CONTROL-NODE-SKU>" 
export controlVmCount="<CONTROL-NODE-COUNT>" 
export workerVmSku="<WORKER-NODE-SKU>" 
export workerVmCount="<WORKER-NODE-COUNT>" 
export nodePoolName="<NODE-POOL-NAME>" 
export lbIpv4Pool="<LOADBALANCER-IPV4-POOL>" 
export hugePages2MCount=<HUGEPAGES-2M-COUNT> 
export aadAdminGroupObjectId="<AAD-GROUP-TO-ACCESS-NAKS>" 
export maxSurge=1 // number of nodes added to the cluster during upgrade e.g. 1 or percentage "10%"   
 
 
az networkcloud kubernetescluster create --name $naksName \ 
--resource-group $rgCompute \ 
--location $region \ 
--kubernetes-version $k8sVer \ 
--extended-location name="/subscriptions/$subscriptionId/resourceGroups/$rgManagedUndercloudCluster/providers/Microsoft.ExtendedLocation/customLocations/$undercloudCustLocationName" type="CustomLocation" \ 
--admin-username $adminUser \ 
--ssh-key-values "$sshPubKeys" \ 
--initial-agent-pool-configurations "[{count:$workerVmCount,mode:'System',name:'$nodePoolName',vmSkuName:'$workerVmSku',agentOptions:{hugepagesCount:$hugePages2MCount,hugepagesSize:2M},upgradeSettings:{maxSurge:$maxSurge},adminUsername:'$adminUser',ssh-key-values:['$sshPubKeys']}]" \ 
--control-plane-node-configuration count=$workerVmCount vmSkuName=$controlVmSku adminUsername=$adminUser ssh-key-values=['$sshPubKeys'] \ 
--network-configuration cloud-services-network-id="/subscriptions/$subscriptionId/resourceGroups/$rgCompute/providers/Microsoft.NetworkCloud/cloudServicesNetworks/$csnName" cni-network-id="/subscriptions/$subscriptionId/resourceGroups/$rgCompute/providers/Microsoft.NetworkCloud/l3Networks/$defCniL3Net" pod-cidrs=["10.244.0.0/16"] service-cidrs=["10.96.0.0/16"] dns-service-ip="10.96.0.10" attached-network-configuration.trunked-networks="[{networkId:'/subscriptions/$subscriptionId/resourceGroups/$rgCompute/providers/Microsoft.NetworkCloud/trunkedNetworks/$trunkName',pluginType:'SRIOV'}]" bgp-service-load-balancer-configuration.fabric-peering-enabled="True" bgp-service-load-balancer-configuration.ip-address-pools="[{addresses:['$lbIpv4Pool'],autoAssign:'True',name:'pool1',onlyUseHostIps:'True'}]" \ 
--managed-resource-group-configuration "{location:$regionRgNcManaged,name:$rgNcManaged}" \ 
--aad-configuration admin-group-object-ids=[$aadAdminGroupObjectId] \ 
--subscription $subscriptionId
```

After the cluster is created, you can enable the Network Function Manager (NFM) extension and set a custom location so the cluster can be deployed via Azure Operator Service Manager (AOSM) or NFM. 

## Access the Nexus Azure Kubernetes Services cluster 

 There are several ways to access the Tenant NAKS cluster's API server:
- Directly from the IP address/port (from a jumpbox) 
- Use the  Azure CLI and connectedk8s proxy option as described under the link to access clusters directly.
  You must have a custom role assigned to the managed resource group created by the Network Cloud RP. One of the following actions must be enabled in this role: 
    - Microsoft.Kubernetes/connectedClusters/listClusterUserCredential/action 
    - A user or service provider as a contributor to the managed resource group 

## Prepare  the cluster for workloads via AO5GC resource provider/Azure Operator Service Manager/Network Function Manager 

Before [Azure Operator Services Manager](https://azure.microsoft.com/products/operator-service-manager) (AOSM) and [Azure Network Function Manager](https://azure.microsoft.com/products/azure-network-function-manager) (NFM) can be used to deploy applications on top of Nexus Azure Kubernetes clusters, you must enable the Network Function Operator extension and set a custom location. For more information, see the following sections. 

### Enable the Network Function Operator extension 

You must enable the Network Function Operator Kubernetes Arc extension so that Azure NFM service can install workloads on top of NAKS clusters. Enable the extension at Azure Arc connected cluster level in the managed resource group created by Network Cloud RP.

1. Enter the following Azure CLI commands to enable the NF Operator extension:

    ```azurecli
    az k8s-extension create -g <NAKS-MANAGED-RESOURCE-GRUP> \ 
    -c <NAKS-ARC-CLUSTER-NAME> \ 
    --cluster-type connectedClusters \ 
    --cluster-resource-provider “Microsoft.Kubernetes/connectedClusters” \ 
    --name networkfunction-operator \ 
    --extension-type Microsoft.Azure.HybridNetwork \ 
    --auto-upgrade-minor-version true \ 
    --scope cluster \ 
    --release-namespace azurehybridnetwork \ 
    --release-train preview \ 
    --config Microsoft.CustomLocation.ServiceAccount=azurehybridnetwork-networkfunction-operator
    ```

1. Enter the following command and note  the connected cluster ID: 
   `az connectedk8s show -n <NAKS-CLUSTER-NAME> -g <NAKS-RESOURCE-GRUP>  --query id -o tsv`
1. Enter the following command and note the cluster extension ID for which to enable the custom location: 
   `az k8s-extension show -c <NAKS-CLUSTER-NAME> -g <NAKS-RESOURCE-GRUP>  -t connectedClusters -n networkfunction-operator`

### Set the custom location 

A [custom location](/azure/azure-arc/kubernetes/conceptual-custom-locations) must be enabled for Nexus AKS clusters so that these clusters can be used as target locations for deploying Azure services instances. 
Refer to  (link) to learn how to enable a customer location.  

> [!IMPORTANT]
> A custom location must to be created in a resource group where NAKS cluster is created. 

Enter the following Azure CLI commands to set a custom location. Replace the connectedClusterID and clusterExtensionID variables with the names noted when you enabled  the Network Function Operator extension. 

```azurecli
az customlocation create -n <CUSTOM-LOCATION-NAME> \ 
-g <NAKS-RESOURCE-GRUP> \ 
-l eastus \ 
--namespace azurehybridnetwork \ 
--host-resource-id <CONNECTED-CLUSTER-ID> \ 
--cluster-extension-ids <CLUSTER-EXTENSION-ID>
```

## Related content

- Learn about the [Deployment order](concept-deployment-order.md).
- [Deploy Azure Operator 5G Core Preview](how-to-deploy-5g-core.md).
- [Deploy a network function](quickstart-deploy-network-functions.md).
