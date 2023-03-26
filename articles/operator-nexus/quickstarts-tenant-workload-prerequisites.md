---
title: How to deploy tenant workloads prerequisites
description: Learn the prerequisites for creating VMs for VNF workloads and for creating AKS-Hybrid clusters for CNF workloads
author: dramasamy #Required; your GitHub user alias, with correct capitalization.
ms.author: dramasamy #Required; microsoft alias of author; optional team alias.
ms.service: azure #Required; service per approved list. slug assigned by ACOM.
ms.topic: quickstart #Required; leave this attribute/value as-is.
ms.date: 01/25/2023 #Required; mm/dd/yyyy format.
ms.custom: template-quickstart #Required; leave this attribute/value as-is.
---

# Tenant workloads deployment prerequisites

<!--- IMG ![Tenant Workload Deployment Flow](Docs//media/tenant-workload-deployment-flow.png) IMG --->
:::image type="content" source="./media/tenant-workload-deployment-flow.png" alt-text="Screenshot of Tenant Workload Deployment Flow.":::

Figure: Tenant Workload Deployment Flow

This guide explains prerequisites for creating VMs for VNF workloads and AKS-Hybrid for CNF workloads.

## Preparation

You need to create various networks based on your workload needs. The following are some
recommended questions to consider, but this list is by no means exhaustive. Consult with
the appropriate support team(s) for help:

- What type of network(s) would you need to support your workload?
  - A layer 3 network requires a VLAN and subnet assignment
    - Subnet must be large enough to support IP assignment to each of the VM
    - Note the platform reserves the first three usable IP addresses for internal use.
      For instance, to support 6 VMs, then the minimum CIDR for
      your subnet is /28 (14 usable address – 3 reserved == 11 addresses available)
    - A layer 2 network requires only a single VLAN assignment
    - A trunked network requires the assignment of multiple VLANs
  - Determine how many networks of each type you need
  - Determine the MTU size of each of your networks (maximum is 9000)
  - Determine the BGP peering info for each network, and whether they need to talk to
    each other. You should group networks that need to talk to each other into the same L3
    isolation-domain, as each L3 isolation-domain can support multiple layer 3 networks.
  - Platform provides a proxy to allow your VM to reach other external endpoints.
    Creating a `cloudservicesnetwork` requires the endpoints to be proxied. So gather the list of endpoints.
    You can modify the list of endpoints after the network creation.
  - For AKS-Hybrid cluster, you need to create a `defaultcninetwork` to support your
    cluster CNI networking needs. You need another VLAN/subnet
    assignment for the `defaultcninetwork` similar to a layer 3 network.

You need:

- your Azure account and the subscription ID of Operator Nexus cluster deployment
- the `custom location` resource ID of your Operator Nexus cluster

## AKS-Hybrid availability zone
`--zones` option in `az hybridaks create` or `az hybridaks nodepool add` can be used to distribute the AKS-Hybrid clusters across different zones for better fault tolerance and performance. When creating an AKS-Hybrid cluster, you can use the `--zones` option to schedule the cluster onto specific racks or distribute it evenly across multiple racks, improving resource utilization and fault tolerance.

If you do not specify a zone when creating an AKS-Hybrid cluster through the `--zones` option, the Operator Nexus platform automatically implements a default anti-affinity rule. This anti-affinity rule aims to prevent scheduling the cluster VM on a node that already has a VM from the same cluster, but it's a best-effort approach and can't guarantee it.

To obtain the list of available zones in the given Operator Nexus instance, you can use the following command.

```azurecli
    az networkcloud cluster show \
      --resource-group <Operator Nexus on-prem cluster Resource Group> \
      --name <Operator Nexus on-prem cluster name> \
      --query computeRackDefinitions[*].availabilityZone
```

### Review Azure container registry

[Azure Container Registry](../container-registry/container-registry-intro.md) is a managed registry service to store and manage your container images and related artifacts.
The document provides details on how to create and maintain the Azure Container Registry operations such as [Push/Pull an image](../container-registry/container-registry-get-started-docker-cli.md?tabs=azure-cli), [Push/Pull a Helm chart](../container-registry/container-registry-helm-repos.md), etc., security and monitoring.
For more details, also see [Azure Container Registry](../container-registry/index.yml).

## Install CLI extensions

Install latest version of the
[necessary CLI extensions](./howto-install-cli-extensions.md).

## Operator Nexus workload images

Make sure that each image, used for creating your workload VMs, is a
containerized image in either `qcow2` or `raw` disk format. Upload these images to an Azure Container
Registry. If your Azure Container Registry is password protected, you can supply this info when creating your VM.
Refer to [Operator Nexus VM disk image build procedure](#operator-nexus-vm-disk-image-build-procedure) for an example for pulling from an anonymous Azure Container Registry.

### Operator Nexus VM disk image build procedure

This build procedure is a paper-exercise example of an anonymous pull of an image from Azure Container Registry.  
It assumes that you already have an existing VM instance image in `qcow2` format and that the image can boot with cloud-init. The procedure requires a working docker build and runtime environment.

Create a dockerfile that copies the `qcow2` image file into the container's /disk directory. Place in an expected directory with correct permissions.
For example, a Dockerfile named `aods-vm-img-dockerfile`:

```bash
FROM scratch
ADD --chown=107:107 your-favorite-image.qcow2 /disk/
```

Using the docker command, build the image and tag to a Docker registry (such as Azure Container Registry) that you can push to. Note the build can take a while depending on how large the `qcow2` file is.  
The docker command assumes the `qcow2` file is in the same directory as your Dockerfile.

```bash
  docker build -f aods-vm-img-dockerfile -t devtestacr.azurecr.io/your-favorite-image:v1 .
  FROM scratch
  ADD --chown=107:107 your-favorite-image.qcow2 /disk/
```

Sign in to the Azure Container Registry if needed and push. Given the size of the docker image this push too can take a while.

```azurecli
az acr login -n devtestacr
```

The push refers to repository [devtestacr.azurecr.io/your-favorite-image]

```bash
docker push devtestacr.azurecr.io/your-favorite-image:v1
```

### Create VM using image

You can now use this image when creating Operator Nexus virtual machines.

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

This VM image build procedure is derived from [kubevirt](https://kubevirt.io/user-guide/virtual_machines/disks_and_volumes/#containerdisk-workflow-example).

## Miscellaneous prerequisites

To deploy your workloads, you need:

- to create resource group or find a resource group to use for your workloads
- the network fabric resource ID to create isolation-domains.
