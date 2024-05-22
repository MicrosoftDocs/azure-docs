---
title: Quickstart - Create a service connection in Azure Kubernetes Service (AKS) with the Azure CLI
description: Quickstart showing how to create a service connection in Azure Kubernetes Service (AKS) with the Azure CLI
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: quickstart
ms.date: 05/06/2024
ms.devlang: azurecli
ms.custom: devx-track-azurecli
---
# Quickstart: Create a service connection in AKS cluster with the Azure CLI

This quickstart shows you how to connect Azure Kubernetes Service (AKS) to other Cloud resources using Azure CLI and Service Connector. Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

* This quickstart requires version 2.30.0 or higher of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.
* This quickstart assumes that you already have an AKS cluster. If you don't have one yet, [create an AKS cluster](../aks/learn/quick-kubernetes-deploy-cli.md).
* This quickstart assumes that you already have an Azure Storage account. If you don't have one yet, [create an Azure Storage account](../storage/common/storage-account-create.md).

## Initial set-up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

   > [!TIP]
   > You can check if the resource provider has already been registered by running the command  `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

1. Optionally, use the Azure CLI command to get a list of supported target services for AKS cluster.

   ```azurecli
   az aks connection list-support-types --output table
   ```

## Create a service connection

### [Using an access key](#tab/Using-access-key)

Run the following Azure CLI command to create a service connection to an Azure Blob Storage with an access key, providing the following information.

```azurecli
az aks connection create storage-blob --secret
```

Provide the following information as prompted:

* **Source compute service resource group name:** the resource group name of the AKS cluster.
* **AKS cluster name:** the name of your AKS cluster that connects to the target service.
* **Target service resource group name:** the resource group name of the Blob Storage.
* **Storage account name:** the account name of your Blob Storage.

> [!NOTE]
> If you don't have a Blob Storage, you can run `az aks connection create storage-blob --new --secret` to provision a new one and directly get connected to your aks cluster.

### [Using a workload identity](#tab/Using-Managed-Identity)

> [!IMPORTANT]
> Using Managed Identity requires you have the permission to [Microsoft Entra ID role assignment](../active-directory/managed-identities-azure-resources/howto-assign-access-portal.md). If you don't have the permission, your connection creation will fail. You can ask your subscription owner for the permission or use an access key to create the connection.

Use the Azure CLI command to create a service connection to a Blob Storage with a workload identity, providing the following information:

* **Source compute service resource group name:** the resource group name of the AKS cluster.
* **AKS cluster name:** the name of your AKS cluster that connects to the target service.
* **Target service resource group name:** the resource group name of the Blob Storage.
* **Storage account name:** the account name of your Blob Storage.
* **User-assigned identity resource ID:** the resource ID of the user assigned identity that is used to create workload identity

```azurecli
az aks connection create storage-blob \
    --workload-identity <user-identity-resource-id>
```

> [!NOTE]
> If you don't have a Blob Storage, you can run `az aks connection create storage-blob --new --workload-identity <user-identity-resource-id>"` to provision a new one and get connected to your function app straightaway.

---

## View connections

Use the Azure CLI [az aks connection list](/cli/azure/functionapp/connection#az-functionapp-connection-list) command to list connections to your AKS Cluster, providing the following information:

* **Source compute service resource group name:** the resource group name of the AKS cluster.
* **AKS cluster name:** the name of your AKS cluster that connects to the target service.

```azurecli
az aks connection list \
    -g "<your-aks-cluster-resource-group>" \
    -n "<your-aks-cluster-name>" \
    --output table
```

## Next steps

Go to the following tutorials to start connecting AKS cluster to Azure services with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure Key Vault using CSI driver](./tutorial-python-aks-keyvault-csi-driver.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure Storage using workload identity](./tutorial-python-aks-storage-workload-identity.md)