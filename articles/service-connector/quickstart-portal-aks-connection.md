---
title: 'Quickstart: Connect Azure Kubernetes Service to databases and services with Service Connector'
description: Learn how to connect Azure Kubernetes Service (AKS) to databases, storage accounts, and other Azure services using Service Connector. Step-by-step guide for Azure portal and Azure CLI.
author: houk-ms
ms.author: honc
ms.reviewer: malev
ms.service: service-connector
ms.topic: quickstart
zone_pivot_groups: interaction-type
ms.date: 7/22/2025
keywords: azure kubernetes service, aks, service connector, database connection, managed identity, workload identity, azure storage, authentication
#Customer intent: As an app developer, I want to connect my Azure Kubernetes Service cluster to databases, storage accounts, and other Azure services using a workload identity or other authentication types.
---

# Quickstart: Connect Azure Kubernetes Service to databases and services with Service Connector

Get started with Service Connector to connect your Azure Kubernetes Service (AKS) cluster to databases, storage accounts, and other Azure services. Service Connector simplifies authentication and configuration, enabling you to connect to resources using a workload identity or other authentication methods.

This article provides step-by-step instructions for both the Azure portal and Azure CLI. Choose your preferred method using the tabs above.

## Prerequisites

::: zone pivot="azure-portal"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An AKS cluster in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [deploy an AKS cluster](/azure/aks/learn/quick-kubernetes-deploy-portal).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
::: zone-end

::: zone pivot="azure-cli"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An AKS cluster in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet,  [deploy an AKS cluster](/azure/aks/learn/quick-kubernetes-deploy-cli).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
- An Azure Storage account. If you don't have one yet, [create an Azure Storage account](../storage/common/storage-account-create.md).
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- This quickstart requires version 2.30.0 or higher of the Azure CLI. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.
::: zone-end

::: zone pivot="azure-cli"
## Initial set-up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector and Kubernetes Configuration resource providers.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```
   ```azurecli
   az provider register -n Microsoft.KubernetesConfiguration
   ```

   > [!TIP]
   > You can check if these resource providers have already been registered by running the commands `az provider show -n "Microsoft.ServiceLinker" --query registrationState` and `az provider show -n "Microsoft.KubernetesConfiguration" --query registrationState`.

1. Optionally, use the Azure CLI command to get a list of supported target services for AKS cluster.

   ```azurecli
   az aks connection list-support-types --output table
   ```
::: zone-end

## Create a service connection in an AKS cluster

Use Service Connector to create a service connection between your Azure Kubernetes Service (AKS) cluster and Azure Blob Storage. This example demonstrates connecting to Blob Storage, but you can use the same process for other supported Azure services.

::: zone pivot="azure-portal"
1. Select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *AKS*, and select **Kubernetes services**.
   :::image type="content" source="./media/aks-quickstart/select-aks-cluster.png" alt-text="Screenshot of the Azure portal, selecting AKS cluster.":::

1. Select the AKS cluster you want to connect to a target resource.
1. Select **Settings** > **Service Connector** from the service menu. Then select **Create**.
   :::image type="content" source="./media/aks-quickstart/create.png" alt-text="Screenshot of the Azure portal, creating new connection.":::

1. On the **Basics** tab, select or enter the following settings.

    | Setting             | Example              | Description                                                                                                                                                                               |
    |---------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Kubernetes namespace**|   *default*      |  The namespace where you need the connection in the cluster.   |
    | **Service type**    | Storage -  Blob      | The target service type. If you don't have a Microsoft Blob Storage, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type.                |
    | **Connection name** | *my_connection*      | The connection name that identifies the connection between your AKS cluster and target service. Use the connection name provided by Service Connector or choose your own connection name. |
    | **Subscription**    | My subscription      | The subscription for your target service (the service you want to connect to). The default value is the subscription for this AKS cluster.                                                |
    | **Storage account** | *my_storage_account* | The target storage account you want to connect to. Target service instances to choose from vary according to the selected service type.                                                   |
    | **Client type**     | *python*             | The code language or framework you use to connect to the target service.                                                                                                                       |

1. Select **Next: Authentication** to choose an authentication method.

    ### [Workload identity (recommended)](#tab/UMI)

    Select **Workload identity** to authenticate through [Microsoft Entra workload identity](/entra/workload-id/workload-identities-overview) to one or more instances of an Azure service. Then select a user-assigned managed identity to enable workload identity.
    
    ### [Service principal](#tab/SP)
    
    Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application.

    ### [Connection string](#tab/CS)
    
    > [!WARNING]
    > Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. If possible, we recommend you use a workload identity instead.

    Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.
    ---

1. Select **Next: Networking** to configure the network access to your target service and select **Configure firewall rules to enable access to your target service**.

    > [!NOTE]
    > Service Connector for AKS currently only supports the firewall option. Private link and service endpoint aren't supported.

1. Select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. This operation might take a minute to complete.

## Update your container

Now that you created a connection between your AKS cluster and target service, you need to retrieve the connection secrets and deploy them in your container.

1. In the [Azure portal](https://portal.azure.com/), navigate to your AKS cluster resource and go to **Settings** > **Service Connector**.
1. Select the newly created connection, and then select **YAML snippet**. This action opens a panel displaying a sample YAML file generated by Service Connector.
1. To set the connection secrets as environment variables in your container, you have two options:
    
    * Directly create a deployment using the YAML sample code snippet provided. The snippet includes highlighted sections showing the secret object that will be injected as the environment variables. Select **Apply** to proceed with this method.

        :::image type="content" source="media/aks-quickstart/sample-yaml-snippet.png" alt-text="Screenshot of the Azure portal showing the sample YAML snippet to create a new connection in AKS.":::

   * Alternatively, under **Resource Type**, select **Kubernetes Workload**, and then select an existing Kubernetes workload. This action sets the secret object of your new connection as the environment variables for the selected workload. After selecting the workload, select **Apply**.

        :::image type="content" source="media/aks-quickstart/kubernetes-snippet.png" alt-text="Screenshot of the Azure portal showing the Kubernetes snippet to create a new connection in AKS.":::
::: zone-end

::: zone pivot="azure-cli"
### [Using a workload identity (recommended)](#tab/using-Managed-Identity)

Run the [`az aks connection create storage-blob`](/cli/azure/aks/connection/create#az-aks-connection-create-storage-blob) command. You can run this command in two different ways:

- Generate the new connection step by step.
   
  ```azurecli-interactive
  az aks connection create storage-blob \
     --workload-identity <user-identity-resource-id>
  ```

- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<cluster>`, `<target-subscription>`, `<target_resource_group>`, `<account>`, and `<user-identity-resource-id>`.
 
  ```azurecli-interactive
  az aks connection create storage-blob \
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.ContainerService/managedClusters/<cluster> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --workload-identity <user-identity-resource-id>
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az aks connection create storage-blob --new --workload-identity` to create one and connect it to your App Service using a workload identity.

### [Using a connection string](#tab/using-connection-string)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. If possible, we recommend you use a workload identity instead.

Run the [`az aks connection create storage-blob`](/cli/azure/aks/connection/create#az-aks-connection-create-storage-blob) command. You can run this command in two different ways:
    
- Generate the new connection step by step.
   
  ```azurecli-interactive
  az aks connection create storage-blob --secret
  ```

- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<cluster>`, `<target-subscription>`, `<target_resource_group>`, `<account>`, and `<user-identity-resource-id>`.
  
  ```azurecli-interactive
  az aks connection create storage-blob \
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.ContainerService/managedClusters/<cluster> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --secret name=<secret-name> secret=<secret>
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az aks connection create storage-blob --new --secret` to create one and connect it to your App Service using a connection string.

---

::: zone-end

## View service connections in AKS cluster

::: zone pivot="azure-portal"
1. **Service Connector** displays existing connections in this cluster.
1. Select **Network View** to see all the service connections in a network topology view.

   :::image type="content" source="./media/aks-quickstart/list-and-view.png" alt-text="Screenshot of the Azure portal, listing and viewing the connections.":::
::: zone-end

::: zone pivot="azure-cli"
Run `az aks connection list` command to list all of your Azure Spring Apps' provisioned connections.

Replace the placeholders `<cluster-resource-group>`, and `<cluster-name>`, from the command below with your own information. You can also remove the `--output table` option to view more information about your connections.

```azurecli-interactive
az aks connection list --resource-group <cluster-resource-group> --name <cluster-name> --output table
```

The output also displays the provisioning state of your connections.
::: zone-end

## Related links

- [Tutorial: Connect to Azure Key Vault using CSI driver](./tutorial-python-aks-keyvault-csi-driver.md)
- [Tutorial: Connect to Azure Storage using workload identity](./tutorial-python-aks-storage-workload-identity.md)
- [Use Service Connector in AKS](./how-to-use-service-connector-in-aks.md)
