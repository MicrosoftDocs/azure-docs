---
title: Prerequisites to deploy Azure Operator 5G Core Preview on Nexus Azure Kubernetes Service
description: Learn how to complete the prerequisites necessary to deploy Azure Operator 5G Core Preview on the Nexus Azure Kubernetes Service.
author: HollyCl
ms.author: HollyCl
ms.service: azure-operator-5g-core
ms.custom: devx-track-azurecli
ms.topic: quickstart #required; leave this attribute/value as-is.
ms.date: 04/02/2024

#CustomerIntent: As a < type of user >, I want < what? > so that < why? >.
---

# Quickstart: Complete the prerequisites to deploy Azure Operator 5G Core Preview on Nexus Azure Kubernetes Service
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
    - Compute - tenant compute resources (such as VMs, and Nexus Azure Kubernetes Services (AKS) clusters) 

## Prerequisites

Before provisioning a NAKS cluster:

- Configure external networks between the Customer Edge (CE) and Provider Edge (PE) (or Telco Edge) devices that allow connectivity with the provider edge. Configuring access to external services like firewalls and services hosted on Azure (tenant not platform) is outside of the scope of this article.
- Configure a jumpbox to connect routing domains. Configuring a jumpbox is outside of the scope of this article.
- Configure network elements on PEs/Telco Edge that aren't controlled by Nexus Network Fabric, such as  Express Route Circuits configuration for tenant workloads connectivity to Azure (optional for hybrid setups) or connectivity via the operator's core network.
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
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgManagedFabric="<RG-MANAGED-FABRIC>" 
export nnfId="<NETWORK-FABRIC-ID>" 
export rgFabric="<RG-FABRIC>" 
export l3Isd="<ISD-NAME>" 
export region="<REGION>" 
 
az networkfabric l3domain create –resource-name $l3Isd \ 
--resource-group $rgFabric \ 
--location $region \ 
--nf-id "/subscriptions/$subscriptionId/resourceGroups/$rgManagedFabric/providers/Microsoft.ManagedNetworkFabric/networkFabrics/$nnfId" \ 
--redistribute-connected-subnets "True" \ 
--redistribute-static-routes "True" \ 
--subscription "$subscriptionId"
```

To view the new  L3ISD isolation domain, enter the following command: 

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgFabric="<RG-FABRIC>" 
export l3Isd="<ISD-NAME>" 
 
az networkfabric l3domain show --resource-name $l3Isd -g $rgFabric --subscription $subscriptionId
```

## Create the internal network

Before creating or modifying the internal network, you must disable the ISD. Re-enable the ISD after making your changes. 

### Disable the isolation domain

Use the following commands to disable the ISD:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgFabric="<RG-FABRIC>" 
export l3Isd="<ISD-NAME>" 
  
# Disable ISD to create internal networks, wait for 5 minutes and check the status is Disabled 
 
az networkfabric l3domain update-admin-state –resource-name "$l3Isd" \ 
--resource-group "$rgFabric" \ 
--subscription "$subscriptionId" \ 
--state Disable 
 
# Check the status of the ISD 
 
az networkfabric l3domain show –resource-name "$l3Isd" \ 
--resource-group "$rgFabric" \ 
--subscription "$subscriptionId"
```

With the ISD disabled, you can add, modify, or remove the internal network. When you're finished making changes, re-enable ISD as described in [Enable isolation domain](#enable-isolation-domain). 

## Create the default Azure Container Network Interface internal network 

Use the following commands to create the default Azure Container Network Interface (CNI) internal network:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export intnwDefCni="<DEFAULT-CNI-NAME>" 
export l3Isd="<ISD-NAME>" 
export rgFabric="<RG-FABRIC>" 
export vlan=<VLAN-ID> 
export peerAsn=<PEER-ASN> 
export ipv4ListenRangePrefix="<DEFAULT-CNI-IPV4-PREFIX>/<PREFIX-LEN>" 
export mtu=9000 
 
az networkfabric internalnetwork create –resource-name "$intnwDefCni" \ 
--resource-group "$rgFabric" \ 
--subscription "$subscriptionId" \ 
--l3domain "$l3Isd" \ 
--vlan-id $vlan \ 
--mtu $mtu \ 
--connected-ipv4-subnets "[{prefix:$ipv4ListenRangePrefix}]" \ 
--bgp-configuration
{peerASN:$peerAsn,allowAS:0,defaultRouteOriginate:True,ipv4ListenRangePrefixes:['$ipv4ListenRangePrefix']}" 
```

## Create internal networks for User Plane Function (N3, N6) and Access and Mobility Management Function (N2) interfaces 

When you're creating User Plane Function (UPF) internal networks, dual stack IPv4/IPv6 is supported. You don't need to configure the Border Gateway Protocol (BGP) fabric-side Autonomous System Number (ASN) because ASN is included in network fabric resource creation. Use the following commands to create these internal networks. 

> [!NOTE]
> Create the number of internal networks as described in the [Prerequisites](#prerequisites) section.

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export intnwName="<INTNW-NAME>" 
export l3Isd="<ISD-NAME>" // N2, N3, N6  
export rgFabric="<RG-FABRIC>" 
export vlan=<VLAN-ID> 
export peerAsn=<PEER-ASN> 
export ipv4ListenRangePrefix="<IPV4-PREFIX>/<PREFIX-LEN>" 
export ipv6ListenRangePrefix="<IPV6-PREFIX>/<PREFIX-LEN>" 
export mtu=9000 
 
az networkfabric internalnetwork create –resource-name "$intnwName" \ 
--resource-group "$rgFabric" \ 
--subscription "$subscriptionId" \ 
--l3domain "$l3Isd" \ 
--vlan-id $vlan \ 
--mtu $mtu \ 
--connected-ipv4-subnets "[{prefix:$ipv4ListenRangePrefix}]" \ 
--connected-ipv6-subnets "[{prefix:'$ipv6ListenRangePrefix'}]" \ //optional
--bgp-configuration 
"{peerASN:$peerAsn,allowAS:0,defaultRouteOriginate:True,ipv4ListenRangePrefixes:[$ipv4ListenRangePrefix],ipv6ListenRangePrefixes:['$ipv6ListenRangePrefix']}"
```

To view the list of internal networks created, enter the following commands:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgFabric="<RG-FABRIC>" 
export l3Isd="<ISD-NAME>" 
 
az networkfabric internalnetwork list -o table --subscription $subscriptionId -g $rgFabric --l3domain $l3Isd
```

To view the details of a specific internal network, enter the following commands:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgFabric="<RG-FABRIC>" 
export l3Isd="<ISD-NAME>" 
export intnwName="<INTNW-NAME>" 
 
az networkfabric internalnetwork show --resource-name $intnwName -g $rgFabric --l3domain $l3Isd
```

### Enable isolation domain

Use the following commands to enable the ISD:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgFabric="<RG-FABRIC>" 
export l3Isd="<ISD-NAME>" 
  
# Enable ISD, wait for 5 minutes and check the status is Enabled 
 
az networkfabric l3domain update-admin-state –resource-name "$l3Isd" \ 
--resource-group "$rgFabric" \ 
--subscription "$subscriptionId" \ 
--state Enable 
 
# Check the status of the ISD 
 
az networkfabric l3domain show –resource-name "$l3Isd" \ 
--resource-group "$rgFabric" \ 
--subscription "$subscriptionId"
```

### Recommended routing settings

To configure BGP and Bidirectional Forwarding Detection (BFD) routing for internal networks, use the default settings. See the [Nexus documentation](../operator-nexus/howto-configure-isolation-domain.md) for parameter descriptions.

## Create L3 networks 

Before deploying the NAKS cluster, you must create network cloud (NC) L3 networking resources that map to network fabric (NF) resources. 
You must create L3 network NC resources for the default CNI interface,  including the ISD/VLAN/IP prefix of a  corresponding internal network. Attach these resources directly to VMs to perform VLAN tagging at the Network Interface Card (NIC) Virtual Function (VF) level instead of the application level (access ports from application perspective) and/or if IP addresses are allocated by Nexus (using IP Address Management (ipam) functionality).
 
An L3 network is used for the default CNI interface. Other interfaces that require multiple VLANs per single interface must be trunk interfaces.  

Use the following commands to create the L3 network:  

```azurecli
Export subscriptionId="<SUBSCRIPTION-ID>" 
export rgManagedUndercloudCluster="<RG-MANAGED-UNDERCLOUD-CLUSTER>" 
export undercloudCustLocationName="<UNDERCLOUD-CUST-LOCATION-NAME>" 
export rgFabric="<RG-FABRIC>" 
export rgCompute="<RG-COMPUTE>" 
export l3Name="<L3-NET-NAME>" 
export l3Isd="<ISD-NAME>" 
export region="<REGION>" 
export vlan=<VLAN-ID> 
export ipAllocationType="IPV4" // DualStack, IPV4, IPV6 
export ipv4ConnectedPrefix="<DEFAULT-CNI-IPV4-PREFIX>/<PREFIX-LEN>" // if IPV4 or DualStack 
export ipv6ConnectedPrefix="<DEFAULT-CNI-IPV6-PREFIX>/<PREFIX-LEN>" // if IPV6 or DualStack 
 
 az networkcloud l3network create –l3-network-name $l3Name \ 
--l3-isolation-domain-id 
"/subscriptions/$subscriptionId/resourceGroups/$rgFabric/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/$l3Isd" \ 
--vlan $vlan \ 
--ip-allocation-type $ipAllocationType \ 
--ipv4-connected-prefix $ipv4ConnectedPrefix \ 
--extended-location name="/subscriptions/$subscriptionId/resourceGroups/$rgManagedUndercloudCluster/providers/Microsoft.ExtendedLocation/customLocations/$undercloudCustLocationName" type="CustomLocation" \ 
--resource-group $rgCompute \ 
--location $region \ 
--subscription $subscriptionId \ 
--interface-name "vlan-$vlan"
```

To view the L3 network created, enter the following commands:


```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgCompute="<RG-COMPUTE>" 
export l3Name="<L3-NET-NAME>" 
 
az networkcloud l3network show -n $l3Name -g $rgCompute --subscription $subscriptionId
```

### Trunked networks

A `trunkednetwork` network cloud resource is required if a single port/interface connected to a virtual machine must carry multiple virtual local area networks (VLANs). Tagging is performed at the application layer instead of NIC. A trunk interface can carry VLANs that are a part of different ISDs. 

You must create a trunked network for the Access and Management Mobility Function (AMF) (N2) and UPF (N3, N6). 

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
--isolation-domain-ids
 "/subscriptions/$subscriptionId/resourceGroups/$rgFabric/providers/Microsoft.ManagedNetworkFabric/l3IsolationDomains/$l3IsdUlb" \ 
--vlans $vlanUlb \ 
--extended-location name="/subscriptions/$subscriptionId/resourceGroups/$rgManagedUndercloudCluster/providers/Microsoft.ExtendedLocation/customLocations/$undercloudCustLocationName" type="CustomLocation" \ 
--resource-group $rgCompute \ 
--location $region \ 
--interface-name "trunk-ulb" \ 
--subscription $subscriptionId
```
To view the trunked network resource created, enter the following command: 

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgCompute="<RG-COMPUTE>" 
export trunkName="<TRUNK-NAME>" 
 
az networkcloud trunkednetwork show -n $trunkName -g $rgCompute --subscription $subscriptionId
```

## Configure the Cloud Services Network proxy and allowlisted domains 

A Cloud Services Network proxy (CSN proxy) is used to access Azure and internet destinations. You must explicitly add these domains to an allowlist in the CSN configuration for a NAKS cluster to access Azure services and for Arc integration. 

### Network Function Manager-based Cloud Services Networks endpoints

Add the following egress points for Network Function Manager (NFM) based deployment support (HybridNetwork Resource Provider (RP), CustomLocation RP reachability, ACR, Arc):

- .azurecr.io / port 80 
- .azurecr.io / port 443 
- .mecdevice.azure.com / port 443 
- eastus-prod.mecdevice.azure.com / port 443 
- .microsoftmetrics.com / port 443 
- crprivatemobilenetwork.azurecr.io / port 443 
- .guestconfiguration.azure.com / port 443 
- .kubernetesconfiguration.azure.com / port 443 
- eastus.obo.arc.azure.com / port 8084 
- .windows.net / port 80 
- .windows.net / port 443 
- .k8connecthelm.azureedge.net / port 80 
- .k8connecthelm.azureedge.net / port 443 
- .k8sconnectcsp.azureedge.net / port 80 
- .k8sconnectcsp.azureedge.net / port 443 
- .arc.azure.net / port 80 
- .arc.azure.net / port 443


### Python Cloud Services Networks endpoints

For python packages installation (part of the fed-kube_addons pod-node_config command list used for NAKS), add the following endpoints: 

- pypi.org / port 443 
- files.pythonhosted.org / port 443

> [!NOTE]
> Additional Azure Detat Explorer (ADX) endpoints may need to be included in the allowlist if there is a requirement to inject data into ADX. 

### Optional Cloud Services Networks endpoints 

Use the following destination to run containers that have their endpoints stored in public container registries or to install more packages for the auxiliary virtual machines: 

- .ghcr.io / port 80 
- .ghcr.io / port 443 
- .k8s.gcr.io / port 80 
- .k8s.gcr.io / port 443 
- .k8s.io / port 80 
- .k8s.io / port 443 
- .docker.io / port 80 
- .docker.io / port 443 
- .docker.com / port 80 
- .docker.com / port 443 
- .pkg.dev / port 80 
- .pkg.dev / port 443 
- .ubuntu.com / port 80 
- .ubuntu.com / port 443

## Create Cloud Services Networks

You must create a separate CSN instance for each NAKS cluster when you deploy Azure Operator 5G Core Preview on the Nexus platform. 

> [!NOTE]
> Adjust the `additional-egress-endpoints` list based on the description and lists provided in the previous sections. 

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

After you create the CSN, verify the `egress-endpoints` using the following commands at the command line:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgCompute="<RG-COMPUTE>" 
export csnName="<CSN-NAME>" 
 
az networkcloud cloudservicesnetwork show -n $csnName -g $rgCompute --subscription $subscriptionId
```

## Create a Nexus Azure Kubernetes Services Cluster

Nexus related resource providers must deploy self-managed resource groups used to deploy the necessary resources created by customers. When Nexus AKS clusters are provisioned, they must be Arc-enabled. The Network Cloud resource provider creates its own managed resource group and deploys it in an Azure Arc Kubernetes cluster resource. Following this deployment, this cluster resource is linked to the NAKS cluster resource.   

> [!NOTE]
> After the NAKS cluster deploys, and the managed resource group is created, you may need to grant privileges to all a user/entra group/service principal access to the managed resource group. This action is contingent upon the subscription level Identity Access Management (IAM) settings.

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

To verify the list of created Nexus clusters, enter the following command:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
 
az networkcloud kubernetescluster list -o table --subscription $subscriptionId
```

To verify the details of a created cluster, enter the following command:

```azurecli
export subscriptionId="<SUBSCRIPTION-ID>" 
export rgCompute="<RG-COMPUTE>" 
export naksName="<NAKS-NAME>" 
 
az networkcloud kubernetescluster show -n $naksName -g $rgCompute --subscription $subscriptionId
```

After the cluster is created, you can enable the NFM extension and set a custom location so the cluster can be deployed via AOSM or NFM. 

## Access the Nexus Azure Kubernetes Services cluster 

 There are several ways to access the Tenant NAKS cluster's API server:

- Directly from the IP address/port (from a jumpbox that has connectivity to the Tenant NAKS API server) 
- Using the  Azure CLI and connectedk8s proxy option as described under the link to access clusters directly. The Service Principal's or user's EntraID/AAD group (used with Azure CLI) must be provided during the NAKS cluster provisioning. Additionally, you must have a custom role assigned to the managed resource group created by the Network Cloud RP. One of the following actions must be enabled in this role:

  - Microsoft.Kubernetes/connectedClusters/listClusterUserCredential/action 
  - A user or service provider as a contributor to the managed resource group 

## Azure Edge services

Azure Operator 5G Core is a telecommunications workload that enables you to offer services to consumer and enterprise end-users. The Azure Operator 5G Core workloads run on a Network Functions Virtualization Infrastructure (NFVI) layer and may depend on other NFVI services. 

### Edge NFVI functions (running on Azure Operator Nexus)  

> [!NOTE]
> The Edge NFVI related services may be updated occasionally. For more information about these services, see the specific service's documentation. 

- **Azure Operator Nexus** - Azure Operator Nexus is a carrier-grade, next-generation hybrid cloud platform for telecommunication operators. Azure Operator Nexus is purpose-built for operators' network-intensive workloads and mission-critical applications.  
 
- Any other hardware and services Azure Operator Nexus may depend on. 

- **Azure Arc** -  Provides a unified management and governance platform for Azure Operator 5G Core applications and services across Azure and on-premises environments.  

- **Azure Monitor** -  Provides a comprehensive solution for monitoring the performance and health of Azure Operator 5G Core applications and services across Azure and on-premises environments.  

- **EntraID** - Provides identity and access management for Azure Operator 5G Core users and administrators across Azure and on-premises environments.  

- **Azure Key Vault** -  Provides a secure and centralized store for managing encryption keys and secrets for Azure Operator 5G Core across Azure and on-premises environments. 

## Related content

- Learn about the [Deployment order](concept-deployment-order.md).
- [Deploy Azure Operator 5G Core Preview](quickstart-deploy-5g-core.md).
- [Deploy a network function](how-to-deploy-network-functions.md).
