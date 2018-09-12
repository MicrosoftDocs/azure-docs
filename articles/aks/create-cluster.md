---
title: Create an Azure Kubernetes Service (AKS) cluster
description: Create an AKS cluster with the CLI or the Azure portal.
services: container-service
author: iainfoulds
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 06/26/2018
ms.author: iainfou
ms.custom: mvc
---

# Create an Azure Kubernetes Service (AKS) cluster

An Azure Kubernetes Service (AKS) cluster can be created with either the Azure CLI or the Azure portal.

## Azure CLI

Use the [az aks create][az-aks-create] command to create the AKS cluster.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster
```

The following options are available with the `az aks create` command. See the [Azure CLI reference][az-aks-create] for AKS for more information on each of these arguments.

| Argument | Description | Required |
|---|---|:---:|
| `--name` `-n` | Resource name for the managed cluster. | yes |
| `--resource-group` `-g` | Name of the Azure Kubernetes Service resource group. | yes |
| `--admin-username` `-u` | User name for the Linux Virtual Machines.  Default: azureuser. | no |
| `--aad-client-app-id` | (PREVIEW) The ID of an Azure Active Directory client application of type "Native". | no |
| `--aad-server-app-id` | (PREVIEW) The ID of an Azure Active Directory server application of type "Web app/API". | no |
| `--aad-server-app-secret` | (PREVIEW) The secret of an Azure Active Directory server application. | no |
| `--aad-tenant-id` | (PREVIEW) The ID of an Azure Active Directory tenant. | no |
| `--admin-username` `-u` | User account to create on node VMs for SSH access.  Default: azureuser. | no |
| ` --client-secret` | The secret associated with the service principal. | no |
| `--dns-name-prefix` `-p` | DNS prefix for the clusters public ip address. | no |
| `--dns-service-ip` | An IP address assigned to the Kubernetes DNS service. | no |
| `--docker-bridge-address` | An IP address and netmask assigned to the Docker bridge. | no |
| `--enable-addons` `-a` | Enable the Kubernetes addons in a comma-separated list. | no |
| `--enable-rbac` `-r` | Enable Kubernetes Role-Based Access Control. | no |
| `--generate-ssh-keys` | Generate SSH public and private key files if missing. | no |
| `--kubernetes-version` `-k` | The version of Kubernetes to use for creating the cluster, such as '1.7.9' or '1.9.6'. | no |
| `--location` `-l` | Location for the auto-created resource group | no |
| `--max-pods` `-m` | The maximum number of pods deployable to a node. | no |
| `--network-plugin` | The Kubernetes network plugin to use. | no |
| `--no-ssh-key` `-x` | Do not use or create a local SSH key. | no |
| `--no-wait` | Do not wait for the long-running operation to finish. | no |
| `--node-count` `-c` | The default number of nodes for the node pools.  Default: 3. | no |
| `--node-osdisk-size` | The osDisk size in GB of node pool Virtual Machine. | no |
| `--node-vm-size` `-s` | The size of the Virtual Machine.  Default: Standard_D1_v2. | no |
| `--pod-cidr` | A CIDR notation IP range from which to assign pod IPs when kubenet is used. | no |
| `--service-cidr` | A CIDR notation IP range from which to assign service cluster IPs. | no |
| `--service-principal` | Service principal used for cluster authentication. | no |
| `--ssh-key-value` | SSH key file value or key file path.  Default: ~/.ssh/id_rsa.pub. | no |
| `--tags` | Space separated tags in 'key[=value]' format. Use '' to clear existing tags. | no |
| `--vnet-subnet-id` | The ID of a subnet in an existing VNet into which to deploy the cluster. | no |
| `--workspace-resource-id` | The resource ID of an existing Log Analytics Workspace to use for storing monitoring data. | no |

## Azure portal

For instruction on deploying an AKS cluster with the Azure portal, see the Azure Kubernetes Service (AKS) [Azure portal quickstart][aks-portal-quickstart].

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az-aks-create
[aks-portal-quickstart]: kubernetes-walkthrough-portal.md
