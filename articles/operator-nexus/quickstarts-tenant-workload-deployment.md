---
title: Deploy tenant workloads
description: Learn the steps for creating VMs for VNF workloads and for creating AKS hybrid clusters for CNF workloads.
author: dramasamy
ms.author: dramasamy
ms.service: azure
ms.topic: how-to
ms.date: 03/10/2023
ms.custom: template-how-to-pattern
---

# Deploy tenant workloads

This how-to guide explains the steps for deploying virtual network function (VNF) and cloud-native network function (CNF) workloads. The first part, for virtual machine (VM)-based deployments, deals with creating VMs and deploying VNF workloads. The second part, for Kubernetes-based deployments, provides steps for creating Azure Kubernetes Service (AKS) hybrid clusters for deploying CNF workloads.

Don't use the examples verbatim, because they don't specify all required parameters.

## Before you begin

Complete the [prerequisites](./quickstarts-tenant-workload-prerequisites.md).

## Create VMs for deploying VNF workloads

This section explains steps to create VMs for VNF workloads.

### Create isolation domains for VM workloads

Isolation domains enable creation of layer 2 (L2) and layer 3 (L3) connectivity between network functions running on Azure Operator Nexus. This connectivity enables inter-rack and intra-rack communication between the workloads.
You can create as many L2 and L3 isolation domains as needed.

You should have the following information already:

- VLAN/subnet info for each L3 network.
- Which networks need to talk to each other. (Remember to put VLANs and subnets that need to talk to each other into the same L3 isolation domain.)
- BGP peering and network policy information for your L3 isolation domains.
- VLANs for all your L2 networks.
- VLANs for all your trunked networks.
- MTU values for your network.

#### L2 isolation domain

[!INCLUDE [L2 isolation domain](./includes/l2-isolation-domain.md)]

#### L3 isolation domain

[!INCLUDE [L3 isolation domain](./includes/l3-isolation-domain.md)]

### Create networks for VM workloads

This section describes how to create the following networks for VM workloads:

- Layer 2 network
- Layer 3 network
- Trunked network
- Cloud services network

#### Create an L2 network

Create an L2 network, if necessary, for your VM. You can repeat the instructions for each required L2 network.

Gather the resource ID of the L2 isolation domain that you [created](#l2-isolation-domain) to configure the VLAN for this network.

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

Create an L3 network, if necessary, for your VM. Repeat the instructions for each required L3 network.

You need:

- resource ID of the L3 isolation domain you [created](#l3-isolation-domain) that configures the VLAN for this network.
- The ipv4-connected-prefix must match the i-pv4-connected-prefix that is in the L3 isolation domain
- The ipv6-connected-prefix must match the i-pv6-connected-prefix that is in the L3 isolation domain
- The ip-allocation-type can be either "IPv4", "IPv6", or "DualStack" (default)
- The VLAN value must match what is in the L3 isolation domain

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

Create a trunked network, if necessary, for your VM. Repeat the instructions for each required trunked network.

Gather the resourceIds of the L2 and L3 isolation domains you created earlier to configure the VLANs for this network. You can include as many L2 and L3 isolation domains as needed.

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

#### Create a cloud services network

Your VM requires at least one cloud services network. You need the egress endpoints that you want to add to the proxy for your VM to access.

```azurecli
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName >" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId >" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --additional-egress-endpoints "[{\"category\":\"<YourCategory >\",\"endpoints\":[{\"<domainName1 >\":\"< endpoint1 >\",\"port\":<portnumber1 >}]}]"
```

### Create a VM

Azure Operator Nexus VMs are used for hosting VNFs within a Telco network.
The Nexus platform provides `az networkcloud virtualmachine create` to create a customized VM.

For hosting a VNF on your VM, have it [Microsoft Azure Arc-enrolled](/azure/azure-arc/servers/overview),
and provide a way to ssh to it via Azure CLI.

#### Parameters

- The `subscription`, `resource group`, `location`, and `customlocation` of the Azure Operator Nexus Cluster for deployment
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
- The resource ID of the earlier created [Cloud Service network](#create-cloud-services-network) and [L3 networks](#create-an-l3-network) to configure VM connectivity

#### Update the user data file

Update the values listed in the _USERDATA_ file with the proper information:

- Service principal ID
- Service principal secret
- Tenant ID
- Location (Azure region)
- Custom location

Locate the following line in the _USERDATA_ (toward the end) and update appropriately:

```azurecli
azcmagent connect --service-principal-id _SERVICE_PRINCIPAL_ID_ --service-principal-secret _SERVICE_PRINCIPAL_SECRET_ --tenant-id _TENANT_ID_ --subscription-id _SUBSCRIPTION_ --resource-group _RESOURCE_GROUP_ --location _LOCATION_
```

Encode the user data:

```bash
ENCODED_USERDATA=(`base64 -w0 USERDATA`)
```

#### Create the VM with the encoded data

Update the VM template with the proper information:

- name (_VMNAME_)
- location (_LOCATION_)
- custom location (_CUSTOM_LOCATION_)
- adminUsername (_ADMINUSER_)
- cloudServicesNetworkAttachment
- cpuCores
- memorySizeGB
- networkAttachments (set your L3 network as default gateway)
- sshPublicKeys (_SSH_PUBLIC_KEY_)
- diskSizeGB
- userData (_ENCODED_USERDATA_)
- vmImageRepositoryCredentials (_ACR_URL_, _ACR_USERNAME_, _ACR_TOKEN_)
- vmImage (_IMAGE_URL_)

Run this command. Update it with your resource group and subscription info.

- Subscription
- Resource group
- Deployment name
- Layer 3 network template

```azurecli
az deployment group create --resource-group _RESOURCE_GROUP_ --subscription=_SUBSCRIPTION_ --name _DEPLOYMENT_NAME_ --template-file _VM_TEMPLATE_
```

#### SSH to the VM

It takes a few minutes for the VM to be created and then Arc connected. Should your attempt fail at first, try again after a short wait.

```azurecli
az ssh vm -n _VMNAME_ -g _RESOURCE_GROUP_ --subscription _SUBSCRIPTION_ --private-key _SSH_PRIVATE_KEY_ --local-user _ADMINUSER_
```

> [!NOTE]
> If each server has two CPU chipsets and each CPU chip has 28 cores. Then with hyper-threading enabled (default), the CPU chip supports 56 vCPUs. With 8 vCPUs in each chip reserved for infrastructure (OS, agents), the remaining 48 are available for tenant workloads.

Gather this information:

- The `resourceId` of the `cloudservicesnetwork`
- The `resourceId` for each of the L2/L3/trunked networks
- Determine which network serves as your default gateway (can only choose 1)
- If you want to specify `networkAttachmentName` (interface name) for any of your networks
- Determine the `ipAllocationMethod` for each of your L3 network (static/dynamic)
- The dimension of your VM
  - number of cpuCores
  - RAM (memorySizeGB)
  - DiskSize
  - emulatorThread support (if needed)
- Boot method (UEFI/BIOS)
- vmImage reference and credentials needed to download this image
- sshKeys
- placement information

The sample command contains the information about the VM requirements that cover compute, network, storage.

Sample command:

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

## Create AKS hybrid clusters for CNF workloads

This section explains steps to create AKS hybrid clusters for CNF workloads.

> [!NOTE]
> The following commands are examples. Don't copy or use them verbatim.

### Create an isolation domain for the AKS hybrid cluster

You should have the following information already:

- VLAN/subnet info for each of the L3 networks. List of networks
  that need to talk to each other (remember to put VLAN/subnets that needs to
  talk to each other into the same L3 isolation domain)
- VLAN/subnet info for your `defaultcninetwork` for the AKS hybrid cluster
- BGP peering and network policies information for your L3 isolation domains
- VLANs for all your L2 networks
- VLANs for all your trunked networks

#### L2 isolation domain

[!INCLUDE [L2 isolation domain](./includes/l2-isolation-domain.md)]

#### L3 isolation domain

[!INCLUDE [L3 isolation domain](./includes/l3-isolation-domain.md)]

### Create AKS hybrid networks

This section describes how to create networks and virtual networks for your AKS hybrid cluster.

#### Create tenant networks for the AKS hybrid cluster

This section describes how to create the following networks:

- Layer 2 network
- Layer 3 network
- Trunked network
- Default CNI network
- Cloud services network

At a minimum, you need to create a default CNI network and a cloud services network.

##### Create an L2 network for the AKS hybrid cluster

You need the `resourceId` value of the [L2 isolation domain](#l2-isolation-domain-1) that you created earlier to configure the VLAN for this network.

For your network, the valid values for `hybrid-aks-plugin-type` are `OSDevice`, `SR-IOV`, and `DPDK`. The default value is `SR-IOV`.

```azurecli
  az networkcloud l2network create --name "<YourL2NetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocation>" type="CustomLocation" \
    --location "< ClusterAzureRegion>" \
    --l2-isolation-domain-id "<YourL2IsolationDomainId>" \
    --hybrid-aks-plugin-type "<YourHaksPluginType>"
```

##### Create an L3 network for the AKS hybrid cluster

You need the following information:

- The `resourceId` value of the [L3 isolation domain](#l3-isolation-domain) that you created earlier to configure the VLAN for this network.
- The `ipv4-connected-prefix` value, which must match the `i-pv4-connected-prefix` value that's in the L3 isolation domain
- The `ipv6-connected-prefix` value, which must match the `i-pv6-connected-prefix` value that's in the L3 isolation domain
- The `ip-allocation-type` value, which can be `IPv4`, `IPv6", or `DualStack` (default)
- The VLAN value, which must match what's in the L3 isolation domain

You also need to configure the following information for your AKS hybrid cluster:

- `hybrid-aks-ipam-enabled`, if you want IPAM enabled for this network within your AKS hybrid cluster. The default value is `True`.
- `hybrid-aks-plugin-type`. Valid values are `OSDevice`, `SR-IOV`, and `DPDK`. The default value is `SR-IOV`.

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

##### Create a trunked network for the AKS hybrid cluster

Gather the resourceIds of the L2 and L3 isolation domains you created earlier that configured the VLANs for this network. You can include as many L2 and L3 isolation domains as needed.

You also need to configure the following information for your network. Valid values for `hybrid-aks-plugin-type` are `OSDevice`, `SR-IOV`, `DPDK`. The default value is `SR-IOV`.

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

##### Create a default CNI network for the AKS hybrid cluster

You need the following information:

- `resourceId` of the L3 isolation domain you created earlier that configures the VLAN for this network.
- The ipv4-connected-prefix must match the i-pv4-connected-prefix that is in the L3 isolation domain
- The ipv6-connected-prefix must match the i-pv6-connected-prefix that is in the L3 isolation domain
- The ip-allocation-type can be either "IPv4", "IPv6", or "DualStack" (default)
- The VLAN value must match what is in the L3 isolation domain
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
    --vlan "<YourNetworkVlan>" \
    --service-external-prefixes '["YourExternalPrefix-1", "YourExternalPrefix-N"]' \
    --service-load-balancer-prefixes '["YourLBPrefixes-1", "YourLBPrefixes-N"]'
```

##### Create cloud services network for AKS hybrid cluster

You need the egress endpoints you want to add to the proxy for your VM to access.

```azurecli
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName>" \
    --subscription "<YourSubscription>" \
    --extended-location name="< ClusterCustomLocationId >" type="CustomLocation" \
    --location "< ClusterAzureRegion >" \
    --additional-egress-endpoints "[{\"category\":\"< YourCategory >\",\"endpoints\":[{\"< domainName1 >\":\"< endpoint1 >\",\"port\":< portnumber1 >}]}]"
```

#### Create a virtual network for the tenant networks of the AKS hybrid cluster

For each previously created tenant network, a corresponding AKS hybrid virtual network needs to be created.

You need the Azure Resource Manager resource ID for each of the networks you created earlier. You can retrieve the Azure Resource Manager resource IDs as follows:

```azurecli
az networkcloud cloudservicesnetwork show -g "<YourResourceGroupName>" -n "<YourCloudServicesNetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud defaultcninetwork show -g "<YourResourceGroupName>" -n "<YourDefaultCniNetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud l2network show -g "<YourResourceGroupName>" -n "<YourL2NetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud l3network show -g "<YourResourceGroupName>" -n "<YourL3NetworkName>" --subscription "<YourSubscription>" -o tsv --query id

az networkcloud trunkednetwork show -g "<YourResourceGroupName>" -n "<YourTrunkedNetworkName>" --subscription "<YourSubscription>" -o tsv --query id
```

To create virtual network for each tenant network, use the following commands:

```azurecli
az hybridaks vnet create \
  --name <YourVnetName> \
  --resource-group "<YourResourceGroupName>" \
  --subscription "<YourSubscription>"\
  --custom-location "<ARM ID of the custom location>" \
  --aods-vnet-id "<ARM resource ID>"
```

### Create an AKS hybrid cluster

To create an AKS hybrid cluster, use the following commands:

```azurecli
  az hybridaks create \
    -n <aks-hybrid cluster name> \
    -g <Azure resource group> \
    --subscription "<YourSubscription>" \
    --custom-location <ARM ID of the custom location> \
    --vnet-ids <comma separated list of ARM IDs of all the Azure hybridaks vnets> \
    --aad-admin-group-object-ids <comma separated list of Azure AD group IDs> \
    --kubernetes-version v1.22.11 \
    --load-balancer-sku stacked-kube-vip \
    --control-plane-count <count> \
    --location <dc-location> \
    --node-count <worker node count> \
    --node-vm-size <Azure Operator Nexus SKU> \
    --zones <comma separated list of availability zones>
```

After a few minutes, the command completes and returns JSON-formatted information about the cluster.

#### Connect to the AKS hybrid cluster

Now that you've created the cluster, connect to your AKS hybrid cluster by running the `az hybridaks proxy` command from your local machine. Make sure to sign-in to Azure before running this command. If you have multiple Azure subscriptions, select the appropriate subscription ID using the `az account set` command.

This command downloads the `kubeconfig` of your AKS hybrid cluster to your local machine and opens a proxy connection channel to your on-premises AKS hybrid cluster. The channel is open for as long as this command is running. Let this command run for as long as you want to access your cluster. If this command times out, close the CLI window, open a fresh one and run the command again.

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

Keep this session running and connect to your AKS hybrid cluster from a
different terminal/command prompt. Verify that you can connect to your
AKS hybrid cluster by running the kubectl get command. This command
returns a list of the cluster nodes.

```azurecli
  kubectl get nodes -A --kubeconfig .\aks-hybrid-kube-config
```

### Provision tenant workloads (CNFs)

You can now deploy the CNFs either directly via Azure Operator Nexus APIs or via Azure Network Function Manager.
