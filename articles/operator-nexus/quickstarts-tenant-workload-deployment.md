---
title: How to deploy tenant workloads
description: Learn the steps for creating VMs for VNF workloads and for creating AKS-Hybrid clusters for CNF workloads
author: jwheeler60 #Required; your GitHub user alias, with correct capitalization.
ms.author: johnwheeler #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 01/25/2023 #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# How-to deploy tenant workloads

This how-to guide explains the steps for deploying VNF and CNF workloads. Section V (for VM-based deployments) deals with creating VMs and to deploy VNF workloads. Section K (for Kubernetes; based deployments) specifies steps for creating AKS-Hybrid clusters for deploying  CNF workloads.

You shouldn't use the examples verbatim as they don't specify all required parameters.

## Before you begin

You should complete the prerequisites specified [here](./quickstarts-tenant-workload-prerequisites.md).

## Section V: how to create VMs for deploying VNF workloads

Step-V1: [Create isolation-domains for VMs](#step-v1-create-isolation-domain-for-vm-workloads)

Step-V2: [Create Networks for VM](#step-v2-create-networks-for-vm-workloads)

Step-V3: [Create Virtual Machines](#step-v3-create-a-vm)

## Deploy VMs for VNF workloads

This section explains steps to create VMs for VNF workloads

### Step V1: create isolation domain for VM workloads

isolation-domains enable creation of layer 2 and layer 3 connectivity between Operator Nexus and network fabric network functions.
This connectivity enables inter-rack and intra-rack communication between the workloads.
You can create as many L2 and L3 isolation-domains as needed.

You should have the following information already:

- VLAN/subnet info for each of the layer 3 network(s)
- Which network(s) would need to talk to each other (remember to put VLANs/subnets that needs to
  talk to each other into the same L3 isolation-domain)
- VLAN/subnet info for your `defaultcninetwork` for AKS-Hybrid cluster
- BGP peering and network policies information for your L3 isolation-domain(s)
- VLANs for all your layer 2 network(s)
- VLANs for all your trunked network(s)
- MTU values for your network.

#### L2 isolation domain

[!INCLUDE [L2 isolation-domain](./includes/l2-isolation-domain.md)]

#### L3 isolation domain

[!INCLUDE [L3 isolation-domain](./includes/l3-isolation-domain.md)]

### Step V2: create networks for VM workloads

This section describes how to create the following networks for VM Workloads:

- Layer 2 network
- Layer 3 network
- Trunked network
- Cloud services network

#### Create an L2 network

Create an L2 network, if necessary, for your VM. You can repeat the instructions for each L2 network required.

Gather the resource ID of the L2 isolation-domain you [created](#l2-isolation-domain) that configures the VLAN for this network.

Example CLI command:

```azurecli
  az networkcloud l2network create --name "<YourL2NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --l2-isolation-domain-id "<YourL2IsolationDomainId>"
```

#### Create an L3 network

Create an L3 network, if necessary, for your VM. Repeat the instructions for each L3 network required.

You need:

- resource ID of the L3 isolation-domain you [created](#l3-isolation-domain) that configures the VLAN for this network.
- The ipv4-connected-prefix must match the i-pv4-connected-prefix that is in the L3 isolation-domain
- The ipv6-connected-prefix must match the i-pv6-connected-prefix that is in the L3 isolation-domain
- The ip-allocation-type can be either "IPv4", "IPv6", or "DualStack" (default)
- The VLAN value must match what is in the L3 isolation-domain

<!--- The MTU wasn't specified during l2 isolation domain creation so what is "same" 
- The MTU of the network doesn't need to be specified here, but the network will be configured with the MTU information --->

```azurecli
  az networkcloud l3network create --name "<YourL3NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --ip-allocation-type "<YourNetworkIpAllocation>" \
    --ipv4-connected-prefix "<YourNetworkIpv4Prefix>" \
    --ipv6-connected-prefix "<YourNetworkIpv6Prefix>" \
    --l3-isolation-domain-id "<YourL3IsolationDomainId>" \
    --vlan <YourNetworkVlan>
```

#### Create a trunked network

Create a trunked network, if necessary, for your VM. Repeat the instructions for each trunked network required.

Gather the resourceId(s) of the L2 and L3 isolation-domains you created earlier to configure the VLAN(s) for this network.
You can include as many L2 and L3 isolation-domains as needed.

```azurecli
  az networkcloud trunkednetwork create --name "<YourTrunkedNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --interface-name "<YourNetworkInterfaceName>" \
    --isolation-domain-ids \
      "<YourL3IsolationDomainId1>" \
      "<YourL3IsolationDomainId2>" \
      "<YourL2IsolationDomainId1>" \
      "<YourL2IsolationDomainId2>" \
      "<YourL3IsolationDomainId3>" \
    --vlans <YourVlanList>
```

### Create cloud services network

Your VM requires at least one Cloud Services Network. You need the egress endpoints you want to add to the proxy for your VM to access.

```azurecli
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName >" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId >" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --additional-egress-endpoints "[{\"category\":\"<YourCategory >\",\"endpoints\":[{\"<domainName1 >\":\"< endpoint1 >\",\"port\":<portnumber1 >}]}]"
```

### Step V3: create a VM

Operator Nexus Virtual Machines (VM) are used for hosting VNF(s) within a Telco network.
The Nexus platform provides `az networkcloud virtualmachine create` to create a customized VM.
For hosting a VNF on your VM, have it [Microsoft Azure Arc-enrolled](//azure/azure-arc/servers/overview),
and provide a way to ssh to it via Azure CLI.

#### Parameters

- The `subscription`, `resource group`, `location`, and `customlocation` of the Operator Nexus cluster for deployment
  - **SUBSCRIPTION**=
  - **RESOURCE_GROUP**=
  - **LOCATION**=
  - **CUSTOM_LOCATION**=
- A service principal configured with proper access
  - **SERVICE_PRINCIPAL_ID**=
  - **SERVICE_PRINCIPAL_SECRET**=
- A tenant ID
  - **TENANT_ID**=
- For a VM image hosted in a managed ACR, a generated token for access
  - **ACR_URL**=
  - **ACR_USERNAME**=
  - **ACR_TOKEN**=
  - **IMAGE_URL**=
- SSH public/private keypair
  - **SSH_PURLIC_KEY**=
  - **SSH_PRIVATE_KEY**=
- Azure CLI and extensions installed and available
- A customized `cloudinit userdata` file (provided)
  - **USERDATA**=
- The resource ID of the earlier created [cloud service network](#create-cloud-services-network) and [L3 networks](#create-an-l3-network) to configure VM connectivity

#### 1. Update user data file

Update the values listed in the _USERDATA_ file with the proper information

- service principal ID
- service principal secret
- tenant ID
- location (Azure Region)
- custom location

Locate the following line in the _USERDATA_ (toward the end) and update appropriately:

```azurecli
azcmagent connect --service-principal-id _SERVICE_PRINCIPAL_ID_ --service-principal-secret _SERVICE_PRINCIPAL_SECRET_ --tenant-id _TENANT_ID_ --subscription-id _SUBSCRIPTION_ --resource-group _RESOURCE_GROUP_ --location _LOCATION_
```

Encode the user data

```bash
ENCODED_USERDATA=(`base64 -w0 USERDATA`)
```

#### 2. Create the VM with the encoded data

Update the VM template with proper information:

- name (_VMNAME_)
- location (_LOCATION_)
- custom location (_CUSTOM_LOCATION_)
- adminUsername (_ADMINUSER_)
- cloudServicesNetworkAttachment
- cpuCores
- memorySizeGB
- networkAttachments (set your layer3 network as default gateway)
- sshPublicKeys (_SSH_PUBLIC_KEY_)
- diskSizeGB
- userData (_ENCODED_USERDATA_)
- vmImageRepositoryCredentials (_ACR_URL_, _ACR_USERNAME_, _ACR_TOKEN_)
- vmImage (_IMAGE_URL_)

Run this command, update with your resource group and subscription info

- subscription
- resource group
- deployment name
- layer 3 network template

```azurecli
az deployment group create --resource-group _RESOURCE_GROUP_ --subscription=_SUBSCRIPTION_ --name _DEPLOYMENT_NAME_ --template-file _VM_TEMPLATE_
```

#### 3. SSH to the VM

It takes a few minutes for the VM to be created and then Arc connected. Should your attempt fail at first, try again after a short wait.

```azurecli
az ssh vm -n _VMNAME_ -g _RESOURCE_GROUP_ --subscription _SUBSCRIPTION_ --private-key _SSH_PRIVATE_KEY_ --local-user _ADMINUSER_
```

**Capacity Note:**
If each server has two CPU chipsets and each CPU chip has 28 cores. Then with hyper-threading enabled (default), the CPU chip supports 56 vCPUs. With 8 vCPUs in each chip reserved for infrastructure (OS, agents), the remaining 48 are available for tenant workloads.

Gather this information:

- The `resourceId` of the `cloudservicesnetwork`
- The `resourceId(s)` for each of the L2/L3/Trunked networks
- Determine which network will serve as your default gateway (can only choose 1)
- If you want to specify `networkAttachmentName` (interface name) for any of your networks
- Determine the `ipAllocationMethod` for each of your L3 network (static/dynamic)
- The dimension of your VM
  - number of cpuCores
  - RAM (memorySizeGB)
  - DiskSize
  - emulatorThread support (if needed)
- Boot method (UEFI/BIOS)
- vmImage reference and credentials needed to download this image
- sshKey(s)
- placement information

The sample command contains the information about the VM requirements covering
compute/network/storage.

Sample Command:

```azurecli
az networkcloud virtualmachine create --name "<YourVirtualMachineName>" \
--resource-group "<YourResourceGroup>" \
--subscription "<YourSubscription" \
--extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
--location "<ClusterAzureRegion>" \
--admin-username "<AdminUserForYourVm>" \
--csn attached-network-id="<CloudServicesNetworkResourceId>" \
--cpu-cores <NumOfCpuCores> \
--memory-size <AmountOfMemoryInGB> \
--network-attachments '[{"attachedNetworkId":"<L3NetworkResourceId>","ipAllocationMethod":"<YourIpAllocationMethod","defaultGateway":"True","networkAttachmentName":"<YourNetworkInterfaceName"},\
                        {"attachedNetworkId":"<L2NetworkResourceId>","ipAllocationMethod":"Disabled","networkAttachmentName":"<YourNetworkInterfaceName"},
                        {"attachedNetworkId":"<TrunkedNetworkResourceId>","ipAllocationMethod":"Disabled","networkAttachmentName":"<YourNetworkInterfaceName"}]' \
--storage-profile create-option="Ephemeral" delete-option="Delete" disk-size="<YourVmDiskSize>" \
--vm-image "<vmImageRef>" \
--ssh-key-values "<YourSshKey1>" "<YourSshKey2>" \
--placement-hints '[{<YourPlacementHint1},\
                    {<YourPlacementHint2}]' \
--vm-image-repository-credentials registry-url="<YourAcrUrl>" username="<YourAcrUsername>" password="<YourAcrPassword>" \
```

You've created the VMs with your custom image. You're now ready to use for VNFs.

## Section K: how to create AKS-Hybrid cluster for deploying CNF workloads

Step-K1: [Create isolation-domains for AKS-Hybrid Cluster](#step-k1-create-isolation-domain-for-aks-hybrid-cluster)

Step-K2: [Create Networks for AKS-Hybrid Cluster](#step-k2-create-aks-hybrid-networks)

Step-K3: [Create AKS-Hybrid Cluster](#step-k3-create-an-aks-hybrid-cluster)

Step-K4: [Provision Tenant workloads (CNFs)](#step-k4-provision-tenant-workloads-cnfs)

**Commands shown below are examples and should not be copied or used verbatim.**

## Create AKS-Hybrid clusters for CNF workloads

This section explains steps to create AKS-Hybrid clusters for CNF workloads

### Step K1: create isolation domain for AKS-Hybrid cluster

You should have the following information already:

- VLAN/subnet info for each of the layer 3 network(s). List of networks
  that need to talk to each other (remember to put VLAN/subnets that needs to
  talk to each other into the same L3 isolation-domain)
- VLAN/subnet info for your `defaultcninetwork` for aks-hybrid cluster
- BGP peering and network policies information for your L3 isolation-domain(s)
- VLANs for all your layer 2 network(s)
- VLANs for all your trunked network(s)
<!--- The MTU isn't being specified and "11/15"?
- MTU needs to be passed during creation of isolation-domain, due to a known issue. The issue will be fixed with the 11/15 release. --->

#### L2 isolation domain

[!INCLUDE [L2 isolation-domain](./includes/l2-isolation-domain.md)]

#### L3 isolation domain

[!INCLUDE [L3 isolation-domain](./includes/l3-isolation-domain.md)]

### Step K2: create AKS-Hybrid networks

This section describes how to create networks and vNET(s) for your AKD-Hybrid Cluster.

#### Step K2a create tenant networks for AKS-Hybrid cluster

This section describes how to create the following networks:

- Layer 2 network
- Layer 3 network
- Trunked network
- Default CNI network
- Cloud services network

At a minimum, you need to create a "Default CNI network" and a "Cloud Services network".

##### Create an L2 network for AKS-Hybrid cluster

You need the resourceId of the [L2 isolation-domain](#l2-isolation-domain-1) you created earlier that configures the VLAN for this network.

For your network, the valid values for
`hybrid-aks-plugin-type` are `OSDevice`, `SR-IOV`, `DPDK`; the default value is `SR-IOV`.

```azurecli
  az networkcloud l2network create --name "<YourL2NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocation>" type="CustomLocation" \
    --location "< ClusterAzureRegion>" \
    --l2-isolation-domain-id "<YourL2IsolationDomainId>" \
    --hybrid-aks-plugin-type "<YourHaksPluginType>"
```

##### Create an L3 network for AKS-Hybrid cluster

You need the following information:

- The `resourceId` of the [L3 isolation-domain](#l3-isolation-domain) domain you created earlier that configures the VLAN for this network.
- The `ipv4-connected-prefix` must match the i-pv4-connected-prefix that is in the L3 isolation-domain
- The `ipv6-connected-prefix` must match the i-pv6-connected-prefix that is in the L3 isolation-domain
- The `ip-allocation-type` can be either "IPv4", "IPv6", or "DualStack" (default)
- The VLAN value must match what is in the L3 isolation-domain
<!--- The MTU wasn't specified during l2 isolation domain creation so what is "same" 
- The MTU of the network doesn't need to be specified here as the network will be configured with the MTU specified during isolation-domain creation --->

You also need to configure the following information for your aks-hybrid cluster

- hybrid-aks-ipam-enabled: If you want IPAM enabled for this network within your AKS-hybrid cluster. Default: True
- hybrid-aks-plugin-type: valid values are `OSDevice`, `SR-IOV`, `DPDK`. Default: `SR-IOV`

```azurecli
  az networkcloud l3network create --name "<YourL3NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "< ClusterAzureRegion>" \
    --ip-allocation-type "<YourNetworkIpAllocation>" \
    --ipv4-connected-prefix "<YourNetworkIpv4Prefix>" \
    --ipv6-connected-prefix "<YourNetworkIpv6Prefix>" \
    --l3-isolation-domain-id "<YourL3IsolationDomainId>" \
    --vlan <YourNetworkVlan> \
    --hybrid-aks-ipam-enabled "<YourHaksIpam>" \
    --hybrid-aks-plugin-type "<YourHaksPluginType>"
```

##### Create a trunked network for AKS-hybrid cluster

Gather the resourceId(s) of the L2 and L3 isolation-domains you created earlier that configured the VLAN(s) for this network. You can include as many L2 and L3 isolation-domains as needed.

You also need to configure the following information for your network

- hybrid-aks-plugin-type: valid values are `OSDevice`, `SR-IOV`, `DPDK`. Default: `SR-IOV`

```azurecli
  az networkcloud trunkednetwork create --name "<YourTrunkedNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --interface-name "<YourNetworkInterfaceName>" \
    --isolation-domain-ids \
      "<YourL3IsolationDomainId1>" \
      "<YourL3IsolationDomainId2>" \
      "<YourL2IsolationDomainId1>" \
      "<YourL2IsolationDomainId2>" \
      "<YourL3IsolationDomainId3>" \
    --vlans < YourVlanList> \
    --hybrid-aks-plugin-type "<YourHaksPluginType>"
```

##### Create default CNI network for AKS-Hybrid cluster

You need the following information:

- `resourceId` of the L3 isolation-domain you created earlier that configures the VLAN for this network.
- The ipv4-connected-prefix must match the i-pv4-connected-prefix that is in the L3 isolation-domain
- The ipv6-connected-prefix must match the i-pv6-connected-prefix that is in the L3 isolation-domain
- The ip-allocation-type can be either "IPv4", "IPv6", or "DualStack" (default)
- The VLAN value must match what is in the L3 isolation-domain
- You don't need to specify the network MTU here, as the network will be configured with the same MTU information as used previously

```azurecli
  az networkcloud defaultcninetwork create --name "<YourDefaultCniNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId>" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --ip-allocation-type "<YourNetworkIpAllocation>" \
    --ipv4-connected-prefix "<YourNetworkIpv4Prefix>" \
    --ipv6-connected-prefix "<YourNetworkIpv6Prefix>" \
    --l3-isolation-domain-id "<YourL3IsolationDomainId>" \
    --vlan < YourNetworkVlan>
```

##### Create cloud services network for AKS-Hybrid cluster

You need the egress endpoints you want to add to the proxy for your VM to access.

```azurecli
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="< ClusterCustomLocationId >" type="CustomLocation" \
    --location "< ClusterAzureRegion >" \
    --additional-egress-endpoints "[{\"category\":\"< YourCategory >\",\"endpoints\":[{\"< domainName1 >\":\"< endpoint1 >\",\"port\":< portnumber1 >}]}]"
```

#### Step K2b. Create vNET for the tenant networks of AKS-Hybrid cluster

For each previously created tenant network, a corresponding AKS-Hybrid vNET network needs to be created

You'll need the Azure Resource Manager resource ID for each of the networks you created earlier. You can retrieve the Azure Resource Manager resource IDs as follows:

```azurecli
az networkcloud cloudservicesnetwork show -g "<YourResourceGroupName>" -n "<YourCloudServicesNetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud defaultcninetwork show -g "<YourResourceGroupName>" -n "<YourDefaultCniNetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud l2network show -g "<YourResourceGroupName>" -n "<YourL2NetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud l3network show -g "<YourResourceGroupName>" -n "<YourL3NetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud trunkednetwork show -g "<YourResourceGroupName>" -n "<YourTrunkedNetworkName>" --subscription "<YourSubscription>" -o tsv --query id
```

##### To create vNET for each tenant network

```azurecli
az hybridaks vnet create \
  --name <YourVnetName> \
  --resource-group "<YourResourceGroupName>" \
  --subscription "<YourSubscription>"\
  --custom-location "<ARM ID of the custom location>" \
  --aods-vnet-id "<ARM resource ID>"
```

### Step K3: Create an AKS-Hybrid Cluster

This section describes how to create an AKS-Hybrid Cluster

```azurecli
  az hybridaks create \
    -n <aks-hybrid cluster name> \
    -g <Azure resource group> \
    --subscription "<YourSubscription>" \
    --custom-location <ARM ID of the custom location> \
    --vnet-ids <comma separated list of ARM IDs of all the Azure hybridaks vnets> \
    --aad-admin-group-object-ids <comma separated list of Azure AD group IDs> \
    --kubernetes-version v1.21.9 \
    --load-balancer-sku stacked-kube-vip \
    --control-plane-count <count> \
    --location <dc-location> \
    --node-count <worker node count> \
    --node-vm-size <Operator Nexus SKU>
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

#### Connect to the AKS-Hybrid cluster

Now that you've created the cluster, connect to your AKS-Hybrid cluster by running the
`az hybridaks proxy` command from your local machine. Make sure to sign-in to Azure before
running this command. If you have multiple Azure subscriptions, select the appropriate
subscription ID using the `az account set` command.

This command downloads the `kubeconfig` of your AKS-Hybrid cluster to your local machine
and opens a proxy connection channel to your on-premises AKS-Hybrid cluster.
The channel is open for as long as this command is running. Let this command run for
as long as you want to access your cluster. If this command times out, close the CLI
window, open a fresh one and run the command again.

```azurecli
az hybridaks proxy --name <aks-hybrid cluster name> --resource-group <Azure resource group> --file .\aks-hybrid-kube-config
```

Expected output:

```output
Proxy is listening on port 47011
Merged "aks-workload" as current context in .\aks-hybrid-kube-config
Start sending kubectl requests on 'aks-workload' context using kubeconfig at .\aks-hybrid-kube-config
Press CTRL+C to close proxy.
```

Keep this session running and connect to your AKS-Hybrid cluster from a
different terminal/command prompt. Verify that you can connect to your
AKS-Hybrid cluster by running the kubectl get command. This command
returns a list of the cluster nodes.

```azurecli
  kubectl get nodes -A --kubeconfig .\aks-hybrid-kube-config
```

### Step K4: provision tenant workloads (CNFs)

You can now deploy the CNFs either directly via Operator Nexus APIs or via Azure Network Function Manager.
