---
title: Create an Azure Container Service (AKS) cluster
description: Create and AKS cluster with the CLI or Azure portal.
services: container-service
author: neilpeterson
manager: timlt

ms.service: container-service
ms.topic: article
ms.date: 2/12/2018
ms.author: nepeters
ms.custom: mvc
---

# Create an Azure Container Service (AKS) cluster

An Azure Container Service (AKS) cluster can be created with either the Azure CLI or Azure portal. This document shows how to create using the Azure CLI including a description of all deployment options.

For instruction on deploying an AKS cluster with the Azure portal, see the [Azure Container Service (AKS) portal quick start][aks-portal-quickstart] 

## Azure CLI

Use the [az aks delete][az-aks-delete] command to delete the AKS cluster.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster
```

The following options are available with the `az aks create` command.

| Argument | Description | Required |
|---|---|:---:|
| `--name` `-n` | Resource name for the managed cluster. | yes |
| `--resource-group` `-g` | Name of the Azure Container Service resource group. | yes |
| `--admin-username` `-u` | User name for the Linux Virtual Machines.  Default: azureuser. | no |
| ` --client-secret` | he secret associated with the service principal. If --service-principal is specified, then secret should also be specified. If --service-principal is not specified, the secret is auto-generated for you and stored in ${HOME}/.azure/ directory. | no |
| `--dns-name-prefix` `-p` | | no |
| `--generate-ssh-keys` | Generate SSH public and private key files if missing. | no |
| `--kubernetes-version` `-k` | The version of Kubernetes to use for creating the cluster, such as '1.7.9' or '1.8.2'.  Default: 1.7.7. | no |
| `--location` `-l` | Location. You can configure the default location using `az configure --defaults location=<location>`. | no |
| `--no-wait` | Do not wait for the long-running operation to finish. | no |
| `--node-count` `-c` | The default number of nodes for the node pools.  Default: 3. | no |
| `--node-osdisk-size` | The osDisk size in GB of node pool Virtual Machine. | no |
| `--node-vm-size` `-s` | The size of the Virtual Machine.  Default: Standard_D1_v2. | no |
| `--service-principal` | he service principal used for cluster authentication to Azure APIs. If not specified, it is created for you and stored in the ${HOME}/.azure directory. | no |
| `--ssh-key-value` | SSH key file value or key file path.  Default: ~/.ssh/id_rsa.pub. | no |
| `--tags` | Space separated tags in 'key[=value]' format. Use '' to clear existing tags. | no |

<!-- LINKS - internal -->
[az-group-create]: /cli/azure/aks?view=azure-cli-latest#az_aks_create
[aks-portal-quickstart]: kubernetes-walkthrough-portal.md