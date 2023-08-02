---
title: Quickstart for using Azure Container Storage Preview with Azure Kubernetes Service (AKS)
description: Learn how to install Azure Container Storage Preview for use with Azure Kubernetes Service using an installation script.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 08/02/2023
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Quickstart: Use Azure Container Storage Preview with Azure Kubernetes Service
[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to install Azure Container Storage Preview for use with [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) using a provided installation script.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- Sign up for the public preview by completing the [onboarding survey](https://aka.ms/AzureContainerStoragePreviewSignUp).

- This quickstart requires version 2.0.64 or later of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli).

## Sign in to Azure and set your subscription context

Run the `az login` command to sign in to Azure.

If you need to change your Azure subscription context, use the `az account set` command. We recommend using a subscription on which you have an [Owner](../../role-based-access-control/built-in-roles.md#owner) role. If you don't have access to one, you'll need admin assistance to complete this quickstart.

You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Install Azure Container Storage

Follow these instructions to install Azure Container Storage using an installation script.

1. Download and save [this shell script](https://github.com/Azure-Samples/azure-container-storage-samples/blob/main/acstor-install.sh).

1. Navigate to the directory where the file is saved using the `cd` command. For example, `cd C:\Users\Username\Downloads`.

1. Change any parameters in the script that you need to. Only the resource group name is required. All other parameters are optional and will default to the values from your configuration.
   
   | **Flag** | **Parameter**      | **Description** |
   |------|----------------|-------------|
   | -s   | --subscription | The subscription identifier. Defaults to the current subscription. |
   | -g   | --resource-group | The resource group name (required). |
   | -c   | --cluster-name | The name of the cluster where ACStor is to be installed. |
   | -n   | --nodepool-name | The name of the nodepool. Defaults to the first nodepool in the cluster. |
   | -r   | --release-train | The release train for the installation. Defaults to prod. |
   
1. Run the following command to change the file permissions:

   ```bash
   chmod +x acstor-install.sh 
   ```

1. Run the installation script. If you want to use default values, the command looks like this:

   ```bash
   bash ./acstor-install.sh -g <resource-group-name>
   ```

   If you prefer to specify the values, the command looks like this:

   ```bash
   bash ./acstor-install.sh -g <resource-group-name> -s <subscription-id> -c <cluster-name> -n <nodepool-name> -r <release-train-name>
   ```

Installation takes 10-15 minutes to complete. You can check if the installation completed correctly by running the following command and ensuring that `provisioningState` says **Succeeded**:

```azurecli-interactive
az k8s-extension list --cluster-name <cluster-name> --resource-group <resource-group> --cluster-type managedClusters
```

Congratulations, you've successfully installed Azure Container Storage. You now have new storage classes that you can use for your Kubernetes workloads.

## Next steps

Now you can create a storage pool and persistent volume claim, and then deploy a pod and attach a persistent volume. Follow the steps in the appropriate how-to article.

- [Use Azure Container Storage Preview with Azure Elastic SAN Preview](use-container-storage-with-elastic-san.md)
- [Use Azure Container Storage Preview with Azure Disks](use-container-storage-with-managed-disks.md)
- [Use Azure Container Storage with Azure Ephemeral disk (NVMe)](use-container-storage-with-local-disk.md)
