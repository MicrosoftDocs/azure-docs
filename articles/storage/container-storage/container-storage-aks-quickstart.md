---
title: Quickstart for using Azure Container Storage Preview with Azure Kubernetes Service (AKS)
description: Learn how to install Azure Container Storage Preview on an Azure Kubernetes Service cluster using an installation script.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 08/03/2023
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Quickstart: Use Azure Container Storage Preview with Azure Kubernetes Service
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to install Azure Container Storage Preview on an [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) cluster using a provided installation script.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Sign up for the public preview by completing the [onboarding survey](https://aka.ms/AzureContainerStoragePreviewSignUp).

- This quickstart requires version 2.0.64 or later of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli).

- You'll need an AKS cluster with an appropriate [virtual machine type](install-container-storage-aks.md#vm-types). If you don't have one, see [Create an AKS cluster](install-container-storage-aks.md#create-aks-cluster).

- You'll need the Kubernetes command-line client, `kubectl`. You can install it locally by running the `az aks install-cli` command.

## Install Azure Container Storage

Follow these instructions to install Azure Container Storage on your AKS cluster using an installation script.

1. Run the `az login` command to sign in to Azure.

1. Download and save [this shell script](https://github.com/Azure-Samples/azure-container-storage-samples/blob/main/acstor-install.sh).

1. Navigate to the directory where the file is saved using the `cd` command. For example, `cd C:\Users\Username\Downloads`.
   
1. Run the following command to change the file permissions:

   ```bash
   chmod +x acstor-install.sh 
   ```

1. Run the installation script and specify the parameters.
   
   | **Flag** | **Parameter**      | **Description** |
   |----------|----------------|-------------|
   | -s   | --subscription | The subscription identifier. Defaults to the current subscription.|
   | -g   | --resource-group | The resource group name.|
   | -c   | --cluster-name | The name of the cluster where Azure Container Storage is to be installed.|
   | -n   | --nodepool-name | The name of the nodepool. Defaults to the first nodepool in the cluster.|
   | -r   | --release-train | The release train for the installation. Defaults to prod.|
   
   For example:

   ```bash
   bash ./acstor-install.sh -g <resource-group-name> -s <subscription-id> -c <cluster-name> -n <nodepool-name> -r <release-train-name>
   ```

Installation takes 10-15 minutes to complete. You can check if the installation completed correctly by running the following command and ensuring that `provisioningState` says **Succeeded**:

```azurecli-interactive
az k8s-extension list --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type managedClusters
```

Congratulations, you've successfully installed Azure Container Storage. You now have new storage classes that you can use for your Kubernetes workloads.

## Next steps

Now you can create a storage pool and persistent volume claim, and then deploy a pod and attach a persistent volume. Depending on the back-end storage type you want to use, follow the steps in the appropriate how-to article.

- [Use Azure Container Storage Preview with Azure Elastic SAN Preview](use-container-storage-with-elastic-san.md)
- [Use Azure Container Storage Preview with Azure Disks](use-container-storage-with-managed-disks.md)
- [Use Azure Container Storage with Azure Ephemeral disk (NVMe)](use-container-storage-with-local-disk.md)
