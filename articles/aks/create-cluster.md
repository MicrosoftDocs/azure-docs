---
title: Create an Azure Kubernetes Service (AKS) cluster
description: Create an AKS cluster with the CLI or the Azure portal.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 02/12/2018
ms.author: nepeters
ms.custom: mvc
---

# Create an Azure Kubernetes Service (AKS) cluster

An Azure Kubernetes Service (AKS) cluster can be created with either the Azure CLI or the Azure portal.

## Azure CLI

Use the [az aks create][az-aks-create] command to create the AKS cluster.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster
```

The following options are available with the `az aks create` command.

| Argument | Description | Required |
|---|---|:---:|
| `--name` `-n` | Resource name for the managed cluster. | yes |
| `--resource-group` `-g` | Name of the Azure  Kubernetes Service resource group. | yes |
| `--admin-username` `-u` | User name for the Linux Virtual Machines.  Default: azureuser. | no |
| ` --client-secret` | The secret associated with the service principal. | no |
| `--dns-name-prefix` `-p` | DNS prefix for the clusters public ip address. | no |
| `--generate-ssh-keys` | Generate SSH public and private key files if missing. | no |
| `--kubernetes-version` `-k` | The version of Kubernetes to use for creating the cluster, such as '1.7.9' or '1.8.2'.  Default: 1.7.7. | no |
| `--no-wait` | Do not wait for the long-running operation to finish. | no |
| `--node-count` `-c` | The default number of nodes for the node pools.  Default: 3. | no |
| `--node-osdisk-size` | The osDisk size in GB of node pool Virtual Machine. | no |
| `--node-vm-size` `-s` | The size of the Virtual Machine.  Default: Standard_D1_v2. | no |
| `--service-principal` | Service principal used for cluster authentication. | no |
| `--ssh-key-value` | SSH key file value or key file path.  Default: ~/.ssh/id_rsa.pub. | no |
| `--tags` | Space separated tags in 'key[=value]' format. Use '' to clear existing tags. | no |

## Azure portal

For instruction on deploying an AKS cluster with the Azure portal, see the Azure Kubernetes Service (AKS) [Azure portal quickstart][aks-portal-quickstart].

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks?view=azure-cli-latest#az_aks_create
[aks-portal-quickstart]: kubernetes-walkthrough-portal.md
