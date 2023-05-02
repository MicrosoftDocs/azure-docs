---
title: Prerequisites for deploying tenant workloads
description: Learn the prerequisites for creating VMs for VNF workloads and for creating AKS hybrid clusters for CNF workloads.
author: dramasamy
ms.author: dramasamy
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 01/25/2023
ms.custom: template-how-to-pattern
---

# Prerequisites for deploying tenant workloads

This guide explains prerequisites for creating:

- Virtual machines (VMs) for virtual network function (VNF) workloads.
- Azure Kubernetes Service (AKS) hybrid deployments for cloud-native network function (CNF) workloads.

:::image type="content" source="./media/tenant-workload-deployment-flow.png" alt-text="Diagram of a tenant workload deployment flow.":::

## Preparation

You need to create various networks based on your workload needs. The following list of considerations isn't exhaustive. Consult with the appropriate support teams for help.

- Determine the types of networks that you need to support your workloads:
  - A layer 3 (L3) network requires a VLAN and subnet assignment. The subnet must be large enough to support IP assignment to each of the VMs.
  
    The platform reserves the first three usable IP addresses for internal use. For instance, to support six VMs, the minimum CIDR for your subnet is /28 (14 usable addresses – 3 reserved = 11 addresses available).
  - A layer 2 (L2) network requires only a single VLAN assignment.
  - A trunked network requires the assignment of multiple VLANs.
- Determine how many networks of each type you need.
- Determine the MTU size of each of your networks (maximum is 9,000).
- Determine the BGP peering info for each network, and whether the networks need to talk to each other. You should group networks that need to talk to each other into the same L3 isolation domain, because each L3 isolation domain can support multiple L3 networks.
- The platform provides a proxy to allow your VM to reach other external endpoints. Creating a `cloudservicesnetwork` instance requires the endpoints to be proxied, so gather the list of endpoints.

  You can modify the list of endpoints after the network creation.
- For an AKS hybrid cluster, you need to create a `defaultcninetwork` instance to support your cluster CNI networking needs. You need another VLAN and subnet assignment for `defaultcninetwork`, similar to an L3 network.

You also need:

- Your Azure account and the subscription ID of the Azure Operator Nexus cluster deployment.
- The `custom location` resource ID of your Azure Operator Nexus cluster.

## Specify the AKS hybrid availability zone

When you're creating an AKS hybrid cluster, you can use the `--zones` option in `az hybridaks create` or `az hybridaks nodepool add` to schedule the cluster onto specific racks or distribute it evenly across multiple racks. This technique can improve resource utilization and fault tolerance.

If you don't specify a zone when you're creating an AKS hybrid cluster through the `--zones` option, the Azure Operator Nexus platform automatically implements a default anti-affinity rule. This rule aims to prevent scheduling the cluster VM on a node that already has a VM from the same cluster, but it's a best-effort approach and can't make guarantees.

To get the list of available zones in the Azure Operator Nexus instance, you can use the following command:

```azurecli
    az networkcloud cluster show \
      --resource-group <Azure Operator Nexus on-premises cluster resource group> \
      --name <Azure Operator Nexus on-premises cluster name> \
      --query computeRackDefinitions[*].availabilityZone
```

### Review Azure Container Registry

[Azure Container Registry](../container-registry/container-registry-intro.md) is a managed registry service to store and manage your container images and related artifacts.

This article provides details on how to create and maintain Azure Container Registry operations such as [push/pull an image](../container-registry/container-registry-get-started-docker-cli.md?tabs=azure-cli) and [push/pull a Helm chart](../container-registry/container-registry-helm-repos.md), for security and monitoring. For more information, see the [Azure Container Registry documentation](../container-registry/index.yml).

## Install Azure CLI extensions

Install the latest version of the
[necessary Azure CLI extensions](./howto-install-cli-extensions.md).

## Upload Azure Operator Nexus workload images

Make sure that each image that you use to create your workload VMs is a
containerized image in either `qcow2` or `raw` disk format. Upload these images to Azure Container Registry. If your Azure Container Registry instance is password protected, you can supply this info when creating your VM.

The following build procedure is an example of how to pull an image from an anonymous Azure Container Registry instance. It assumes that you already have an existing VM instance image in `qcow2` format and that the image can boot with cloud-init. The procedure requires a working Docker build and runtime environment.

Create a Dockerfile that copies the `qcow2` image file into the container's `/disk` directory. Place it in an expected directory with correct permissions. For example, for a Dockerfile named `aods-vm-img-dockerfile`:

```bash
FROM scratch
ADD --chown=107:107 your-favorite-image.qcow2 /disk/
```

By using the `docker` command, build the image and tag to a Docker registry (such as Azure Container Registry) that you can push to. The build can take a while, depending on how large the `qcow2` file is. The `docker` command assumes that the `qcow2` file is in the same directory as your Dockerfile.

```bash
  docker build -f aods-vm-img-dockerfile -t devtestacr.azurecr.io/your-favorite-image:v1 .
  FROM scratch
  ADD --chown=107:107 your-favorite-image.qcow2 /disk/
```

Sign in to Azure Container Registry if needed and push. Depending on the size of the Docker image, this push can also take a while.

```azurecli
az acr login -n devtestacr
```

The push refers to repository `devtestacr.azurecr.io/your-favorite-image`:

```bash
docker push devtestacr.azurecr.io/your-favorite-image:v1
```

## Create a VM by using an image

You can now use your image when you're creating Azure Operator Nexus virtual machines:

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

This VM image build procedure is derived from [KubeVirt](https://kubevirt.io/user-guide/virtual_machines/disks_and_volumes/#containerdisk-workflow-example).

## Miscellaneous prerequisites

To deploy your workloads, you need:

- To create resource group or find a resource group to use for your workloads.
- The network fabric resource ID to create isolation domains.
