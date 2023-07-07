---
title: Create an Azure Nexus virtual machine by using Azure CLI
description: Learn how to create an Azure Nexus VMs for VNF workloads
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

## Create VMs for deploying VNF workloads

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

Your VM requires at least one cloud services network. You need the egress endpoints that you want to add to the proxy for your VM to access. This list should include any domains needed to pull images or access data, such as ".azurecr.io" or ".docker.io".

```azurecli
  az networkcloud cloudservicesnetwork create --name "<YourCloudServicesNetworkName>" \
    --resource-group "<YourResourceGroupName >" \
    --subscription "<YourSubscription>" \
    --extended-location name="<ClusterCustomLocationId >" type="CustomLocation" \
    --location "<ClusterAzureRegion>" \
    --additional-egress-endpoints "[{\"category\":\"<YourCategory >\",\"endpoints\":[{\"<domainName1 >\":\"< endpoint1 >\",\"port\":<portnumber1 >}]}]"
```

### Create a VM

Azure Operator Nexus VMs are used for hosting VNFs within a telco network.
The Azure Operator Nexus platform provides `az networkcloud virtualmachine create` to create a customized VM.

To host a VNF on your VM, have it [Azure Arc enrolled](/azure/azure-arc/servers/overview), and provide a way to SSH to it via the Azure CLI.

#### Parameters

- The subscription, resource group, location, and custom location of the Azure Operator Nexus Cluster for deployment:
  - *SUBSCRIPTION*=
  - *RESOURCE_GROUP*=
  - *LOCATION*=
  - *CUSTOM_LOCATION*=
- A service principal configured with proper access:
  - *SERVICE_PRINCIPAL_ID*=
  - *SERVICE_PRINCIPAL_SECRET*=
- A tenant ID:
  - *TENANT_ID*=
- For a VM image hosted in a managed Azure Container Registry instance, a generated token for access:
  - *ACR_URL*=
  - *ACR_USERNAME*=
  - *ACR_TOKEN*=
  - *IMAGE_URL*=
- An SSH public/private key pair:
  - *SSH_PURLIC_KEY*=
  - *SSH_PRIVATE_KEY*=
- The Azure CLI and extensions installed and available
- A customized `cloudinit userdata` file (provided):
  - *USERDATA*=
- The resource ID of the previously created [cloud services network](#create-a-cloud-services-network) and [L3 networks](#create-an-l3-network) to configure VM connectivity

#### Update the user data file

Update the values listed in the _USERDATA_ file with the proper information:

- Service principal ID
- Service principal secret
- Tenant ID
- Location (Azure region)
- Custom location

Locate the following line in the _USERDATA_ file (toward the end) and update it appropriately:

```azurecli
azcmagent connect --service-principal-id _SERVICE_PRINCIPAL_ID_ --service-principal-secret _SERVICE_PRINCIPAL_SECRET_ --tenant-id _TENANT_ID_ --subscription-id _SUBSCRIPTION_ --resource-group _RESOURCE_GROUP_ --location _LOCATION_
```

Encode the user data:

```bash
ENCODED_USERDATA=(`base64 -w0 USERDATA`)
```

#### Create the VM with the encoded data

Update the VM template with the proper information:

- `name` (_VMNAME_)
- `location` (_LOCATION_)
- `custom location` (_CUSTOM_LOCATION_)
- `adminUsername` (_ADMINUSER_)
- `cloudServicesNetworkAttachment`
- `cpuCores`
- `memorySizeGB`
- `networkAttachments` (set your L3 network as the default gateway)
- `sshPublicKeys` (_SSH_PUBLIC_KEY_)
- `diskSizeGB`
- `userData` (_ENCODED_USERDATA_)
- `vmImageRepositoryCredentials` (_ACR_URL_, _ACR_USERNAME_, _ACR_TOKEN_)
- `vmImage` (_IMAGE_URL_)

Run the following command. Update it with your info for the resource group, subscription, deployment name, and L3 network template.

```azurecli
az deployment group create --resource-group _RESOURCE_GROUP_ --subscription=_SUBSCRIPTION_ --name _DEPLOYMENT_NAME_ --template-file _VM_TEMPLATE_
```

#### SSH to the VM

It takes a few minutes for the VM to be created and then Azure Arc connected. If your attempt fails at first, try again after a short wait.

```azurecli
az ssh vm -n _VMNAME_ -g _RESOURCE_GROUP_ --subscription _SUBSCRIPTION_ --private-key _SSH_PRIVATE_KEY_ --local-user _ADMINUSER_
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