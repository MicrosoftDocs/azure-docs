---
title: 'Tutorial: Connect to Azure Storage in AKS using Service Connector with workload identity'
description: Learn how to use Service Connector to connect to an Azure Storage account in Azure Kubernetes Service (AKS) using workload identity.
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.custom: devx-track-python, devx-track-azurecli
ms.topic: tutorial
ms.date: 04/29/2026
#customer intent: As an Azure app developer in AKS, I want to learn to use Service Connector to connect Azure services like storage accounts to AKS, so I can easily use the services in my apps on AKS.
---

# Tutorial: Connect to Azure Storage in AKS using Service Connector with workload identity

In this tutorial, you learn how to use Service Connector to connect an Azure Storage account to a pod in an Azure Kubernetes Service (AKS) cluster using workload identity. You complete the following tasks:

> [!div class="checklist"]
>
> * Create an AKS cluster and an Azure Storage account.
> * Create a connection between the AKS cluster and the Azure Storage account using Service Connector.
> * Clone a sample application that connects to the Azure Storage account from the AKS cluster.
> * Deploy the application to a pod in the AKS cluster and test the connection.
> * Clean up resources.

## Prerequisites

- Basic understanding of containers, [workload identity](/entra/workload-id/workload-identities-overview), and AKS. For more information, see [Tutorial: Prepare an application for Azure Kubernetes Service (AKS)](/azure/aks/tutorial-kubernetes-prepare-app).
- An Azure subscription where you have Azure resource write permissions, in an Azure region that [supports Service Connector](concept-region-support.md) and has sufficient [AKS support and compute quota](/azure/azure-resource-manager/management/azure-subscription-service-limits#azure-kubernetes-service-limits) to run the tutorial. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- The `Microsoft.ServiceLinker`, `Microsoft.ContainerService`, `Microsoft.ContainerRegistry`, and `Microsoft.ManagedIdentity` resource providers registered in the Azure subscription. You can run `az provider register -n Microsoft.[service]` to register the providers.
- [Git](https://git-scm.com/) to access and clone the sample repo.
- [Docker](https://docs.docker.com/get-docker/) and [kubectl](https://kubernetes.io/docs/tasks/tools/) installed to manage container image and Kubernetes resources. Install `kubectl` locally by running [`az aks install-cli`](/cli/azure/aks#az_aks_install_cli). 
- [Azure CLI](/cli/azure/install-azure-cli) installed.

## Create Azure resources

1. Sign in to Azure by running [az login](/cli/azure/reference-index#az-login) and following the prompts.

1. Create an [Azure resource group](/azure/azure-resource-manager/management/overview#terminology) to use for this tutorial, replacing the `<region>` placeholder with a valid value. The `location` must be an Azure region where your subscription has sufficient compute quota for the Azure resources and no restrictions on any of the services.

    ```azurecli
    az group create \
        --name MyResourceGroup \
        --location <region>
    ```

1. Create an AKS cluster to contain the service connection, pod definition, and sample application by running the following command. For more information, see [Quickstart: Deploy an Azure Kubernetes Service (AKS) cluster using Azure CLI](/azure/aks/learn/quick-kubernetes-deploy-cli).

    ```azurecli
    az aks create \
        --resource-group MyResourceGroup \
        --name MyAKSCluster \
        --enable-managed-identity \
        --node-count 1
    ```

1. Connect to the cluster by running the following command.

    ```azurecli
    az aks get-credentials \
        --resource-group MyResourceGroup \
        --name MyAKSCluster
    ```

1. Create an Azure Storage account to be the target service that the AKS cluster connects to and the sample application interacts with. For more information, see [Create an Azure storage account](/azure/storage/common/storage-account-create). Run the following command, replacing `<storageaccountname>` with a name that is 3-24 lowercase or numeric characters and is unique across Azure.

    ```azurecli
    az storage account create \
        --resource-group MyResourceGroup \
        --name <storageaccountname> \
        --sku Standard_LRS
    ```

1. Create an Azure container registry to host the application container image consumed by the AKS pod definition. For more information, see [Quickstart: Create an Azure container registry by using the Azure portal](/azure/container-registry/container-registry-get-started-portal). Run the following command, replacing `<registryname>` with a name that is 5-50 lowercase or numeric characters and is unique across Azure.

    ```azurecli
    az acr create \
        --resource-group MyResourceGroup \
        --name <registryname> \
        --sku Standard
    ```

1. Enable anonymous pull so the AKS cluster can consume the registry images. Replace the `<registryname>` placeholder with your registry name.

    ```azurecli
    az acr update \
        --resource-group MyResourceGroup \
        --name <registryname> \
        --anonymous-pull-enabled
    ```

1. Run the following command to create a user-assigned managed identity that the service connection creation can use to enable workload identity for AKS workloads. For more information, see [Manage user-assigned managed identities using the Azure portal](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities).

    ```azurecli
    az identity create \
        --resource-group MyResourceGroup \
        --name MyIdentity
    ```

## Create a service connection using Service Connector

Create a service connection between the AKS cluster and the Azure Storage account by using Azure CLI or the Azure portal.

### [Azure CLI](#tab/azure-cli)

Run the following Azure CLI command to create a service connection to the Azure storage account. Replace `<storageaccountname>` with your storage account name and `<user-identity-resource-id>` with your user-assigned managed identity resource ID.

You can get your user-assigned managed identity resource ID from the output of the preceding `az identity create` command, or use the format `/subscriptions/<subscription-id>/resourceGroups/MyResourceGroup/providers/Microsoft.ManagedIdentity/userAssignedIdentities/MyIdentity`.

```azurecli
az aks connection create storage-blob \
  --resource-group MyResourceGroup \
  --name MyAKSCluster \
  --target-resource-group MyResourceGroup \
  --account <storageaccountname> \
  --workload-identity <user-identity-resource-id>
```

### [Portal](#tab/azure-portal)

1. On your **MyAKSCluster** page in the Azure portal, select **Service Connector** under **Settings** in the left navigation menu.
1. On the **Service Connector** page, select **Create**.
1. On the **Create connection** form, complete the following settings. You can leave other settings at their default values.
   - **Service type**: Select **Storage - Blob**.
   - **Connection name**: Accept the autogenerated name, or supply another name.
   - **Subscription**: Select your subscription if not already selected.
   - **Storage account**: Select the storage account you want to use.
   - **Client type**: Select **Python**.
1. Select **Next: Authentication**.
1. On the **Authentication** tab, select **Workload Identity**.
1. For **User assigned managed identity**, select **MyIdentity**.
1. Select **Next: Networking**, and then select **Next: Review + Create**.
1. When the connection passes validation, select **Create**.

---

Once the connection is created, the Azure portal Service Connector page shows information about the new connection. You can use this information when you edit the *pod.yaml* file later in this tutorial.

:::image type="content" source="./media/aks-tutorial/aks-storage.png" alt-text="Screenshot of the Azure portal, viewing kubernetes resources created by Service Connector." lightbox="./media/aks-tutorial/aks-storage.png":::

## Create the sample application

1. Clone the sample repository, and then change to the directory that contains the sample app. Run the remaining commands from this folder.

   ```Bash
   git clone https://github.com/Azure-Samples/serviceconnector-aks-samples.git
   cd serviceconnector-aks-samples/azure-storage-workload-identity
   ```

1. Build and push the images to your container registry using the [`az acr build`](/cli/azure/acr#az_acr_build) command. Replace the `<registryname>` placeholder with your registry name.

    ```azurecli
    az acr build --registry <registryname> --image sc-demo-storage-identity:latest ./
    ```

1. View the image in your container registry using the [`az acr repository list`](/cli/azure/acr/repository#az_acr_repository_list) command. Replace the `<registryname>` placeholder with your registry name.

    ```azurecli
    az acr repository list --name <registryname> --output table
    ```

## Run application and test connection

1. Replace the following placeholders in the *pod.yaml* file in your local app folder:

   - `<YourContainerImage>`: Replace with the image name in your container registry, for example `<registryname>.azurecr.io/sc-demo-storage-identity:latest`.
   - `<ServiceAccountCreatedByServiceConnector>`: Replace with the service account Service Connector created after connection creation. You can check the service account name on your AKS cluster Service Connector page in the Azure portal.
   - `<SecretCreatedByServiceConnector>`: Replace with the secret Service Connector created after connection creation. You can check the service account name on your AKS cluster Service Connector page in the Azure portal.

1. Deploy the pod to your cluster using `kubectl apply`. The command creates a pod named `sc-demo-storage-identity` in the default namespace of your AKS cluster.

   ```Bash
   kubectl apply -f pod.yaml
   ```

1. Check that the deployment is successful by viewing the pod using `kubectl`.

   ```Bash
   kubectl get pod/sc-demo-storage-identity
   ```

1. Check that the connection is established by viewing the logs using `kubectl`.

   ```Bash
   kubectl logs pod/sc-demo-storage-identity
   ```

## Clean up resources

If you no longer need the Azure resources you created for this tutorial, you can delete them by deleting the **MyResourceGroup** resource group.

```azurecli
az group delete \
  --resource-group MyResourceGroup
```

## Related content

- [Service Connector concepts](concept-service-connector-internals.md)
- [Use Service Connector to connect an AKS cluster to other cloud services](how-to-use-service-connector-in-aks.md)
