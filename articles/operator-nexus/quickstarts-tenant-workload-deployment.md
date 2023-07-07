---
title: Create an Azure Nexus virtual machine by using Azure CLI
description: Learn how to create an Azure Nexus VM for VNF workloads
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 03/10/2023
ms.custom: template-how-to-pattern
---

# Quickstart: Create an Azure Nexus virtual machine by using Azure CLI

This guide explains how to deploy virtual network function (VNF).

Don't use the examples verbatim, because they don't specify all required parameters.

## Before you begin

Complete the [prerequisites](./quickstarts-tenant-workload-prerequisites.md).

## Create networks for virtual machine workloads

The following sections explain the steps to create VMs for VNF workloads.

### Create isolation domains for VM workloads

Isolation domains enable creation of layer 2 (L2) and layer 3 (L3) connectivity between network functions running on Azure Operator Nexus. This connectivity enables inter-rack and intra-rack communication between the workloads.
You can create as many L2 and L3 isolation domains as needed.

You should have the following information already:

- VLAN and subnet info for each L3 network.
- Which networks need to talk to each other. (Remember to put VLANs and subnets that need to talk to each other into the same L3 isolation domain.)
- BGP peering and network policy information for your L3 isolation domains.
- VLANs for all your L2 networks.
- VLANs for all your trunked networks.
- MTU values for your networks.

#### L2 isolation domain

[!INCLUDE [L2 isolation domain](./includes/l2-isolation-domain.md)]

#### L3 isolation domain

[!INCLUDE [L3 isolation domain](./includes/l3-isolation-domain.md)]

### Create networks for VM workloads

The following sections describe how to create these networks for VM workloads:

- Layer 2 network
- Layer 3 network
- Trunked network
- Cloud services network

#### Create an L2 network

Create an L2 network, if necessary, for your VM. You can repeat the instructions for each required L2 network.

Gather the resource ID of the L2 isolation domain that you [created](#l2-isolation-domain) to configure the VLAN for this network.

Here's an example Azure CLI command:

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

- The `resourceID` value of the L3 isolation domain that you [created](#l3-isolation-domain) to configure the VLAN for this network.
- The `ipv4-connected-prefix` value, which must match the `i-pv4-connected-prefix` value that's in the L3 isolation domain.
- The `ipv6-connected-prefix` value, which must match the `i-pv6-connected-prefix` value that's in the L3 isolation domain.
- The `ip-allocation-type` value, which can be `IPv4`, `IPv6`, or `DualStack` (default).
- The `vlan` value, which must match what's in the L3 isolation domain.

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

Gather the `resourceId` values of the L2 and L3 isolation domains that you created earlier to configure the VLANs for this network. You can include as many L2 and L3 isolation domains as needed.

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

Your VM requires at least one cloud services network. You need the egress endpoints that you want to add to the proxy for your VM to access. This list should include any domains needed to pull images or access data, such as `.azurecr.io` or `.docker.io`.

```azurecli
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName >" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId >" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --additional-egress-endpoints "[{\"category\":\"<YourCategory >\",\"endpoints\":[{\"<domainName1 >\":\"< endpoint1 >\",\"port\":<portnumber1 >}]}]"
```

## Create a Virtual Machine

Azure Operator Nexus VMs are used for hosting VNFs within a telco network.
The Azure Operator Nexus platform provides `az networkcloud virtualmachine create` to create a customized VM.

To host a VNF on your VM, have it [Azure Arc enrolled](/azure/azure-arc/servers/overview), and provide a way to SSH to it via the Azure CLI.

```bash
# Azure parameters
RESOURCE_GROUP="myResourceGroup"
SUBSCRIPTION="$(az account show -o tsv --query id)"
CUSTOM_LOCATION="/subscriptions/<subscription_id>/resourceGroups/<managed_resource_group>/providers/microsoft.extendedlocation/customlocations/<custom-location-name>"
LOCATION="$(az group show --name $RESOURCE_GROUP --query location | tr -d '\"')"

# VM parameters
VM_NAME="myNexusVirtualMachine"

# VM credentials
ADMIN_USERNAME="azureuser"
SSH_PUBLIC_KEY="$(cat ~/.ssh/id_rsa.pub)"

# Network parameters
CSN_ARM_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/cloudServicesNetworks/<csn-name>"
L3_NETWORK_ID="/subscriptions/<subscription_id>/resourceGroups/<resource_group>/providers/Microsoft.NetworkCloud/l3Networks/<l3Network-name>"
NETWORK_INTERFACE_NAME="mgmt0"

# VM Size parameters
CPU_CORES=4
MEMORY_SIZE=12
VM_DISK_SIZE="64"

# Virtual Machine Image parameters
VM_IMAGE="<VM image, example: myacr.azurecr.io/ubuntu:20.04>"
ACR_URL="<Azure container registry URL, example: myacr.azurecr.io>"
ACR_USERNAME="<Azure container registry username>"
ACR_PASSWORD="<Azure container registry password>"
```

```bash
az networkcloud virtualmachine create \
    --name "$VM_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --subscription "$SUBSCRIPTION" \
    --extended-location name="$CUSTOM_LOCATION" type="CustomLocation" \
    --location "$LOCATION" \
    --admin-username "$ADMIN_USERNAME" \
    --csn "attached-network-id=$CSN_ARM_ID" \
    --cpu-cores $CPU_CORES \
    --memory-size $MEMORY_SIZE \
    --network-attachments '[{"attachedNetworkId":"'$L3_NETWORK_ID'","ipAllocationMethod":"Dynamic","defaultGateway":"True","networkAttachmentName":"'$NETWORK_INTERFACE_NAME'"}'\
    --storage-profile create-option="Ephemeral" delete-option="Delete" disk-size="$VM_DISK_SIZE" \
    --vm-image "$VM_IMAGE" \
    --ssh-key-values "$SSH_PUBLIC_KEY" \
    --vm-image-repository-credentials registry-url="$ACR_URL" username="$ACR_USERNAME" password="$ACR_PASSWORD"
```

> [!NOTE]
> If each server has two CPU chipsets and each CPU chip has 28 cores, then with hyperthreading enabled (default), the CPU chip supports 56 vCPUs. With 8 vCPUs in each chip reserved for infrastructure (OS and agents), the remaining 48 are available for tenant workloads.

Gather this information:

- The `resourceId` value of `cloudservicesnetwork`.
- The `resourceId` value for each of the L2, L3, and trunked networks.
- The network that serves as your default gateway. (Choose only one.)
- The `networkAttachmentName` value (interface name) for any of your networks.
- The `ipAllocationMethod` value for each of your L3 networks (static and dynamic).
- The dimensions of your VM:
  - Number of CPU cores (`cpuCores`)
  - RAM (`memorySizeGB`)
  - Disk size (`DiskSize`)
  - Emulator thread (`emulatorThread`) support, if needed
- The boot method (UEFI or BIOS).
- The `vmImage` reference and credentials needed to download this image.
- SSH keys.
- Placement information.

This sample command contains the information about the VM requirements that cover compute, network, and storage:

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

You've created the VMs with your custom image. You're now ready to use them for VNFs.