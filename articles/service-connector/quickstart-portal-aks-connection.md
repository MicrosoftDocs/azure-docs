---
title: Quickstart - Create a service connection in Azure Kubernetes Service (AKS) from the Azure portal
description: Quickstart showing how to create a service connection in Azure Kubernetes Service (AKS) from the Azure portal
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: quickstart
ms.date: 03/01/2024
---
# Quickstart: Create a service connection in an AKS cluster from the Azure portal (preview)

Get started with Service Connector by using the Azure portal to create a new service connection in an Azure Kubernetes Service (AKS) cluster.

> [!IMPORTANT]
> Service Connect within AKS is currently in preview. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An AKS cluster in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create an AKS cluster](../aks/learn/quick-kubernetes-deploy-cli.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in AKS cluster

1. To create a new service connection in AKS cluster, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *AKS*, and select **Kubernetes services**.
   :::image type="content" source="./media/aks-quickstart/select-aks-cluster.png" alt-text="Screenshot of the Azure portal, selecting AKS cluster.":::

1. Select the AKS cluster you want to connect to a target resource.
1. Select **Service Connector** from the left table of contents. Then select **Create**.
   :::image type="content" source="./media/aks-quickstart/create.png" alt-text="Screenshot of the Azure portal, creating new connection.":::

1. Select or enter the following settings.

    | Setting             | Example              | Description                                                                                                                                                                               |
    |---------------------|----------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Kubernetes namespace**|   *default*      |  The namespace where you need the connection in the cluster.   |
    | **Service type**    | Storage -  Blob      | The target service type. If you don't have a Microsoft Blob Storage, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type.                |
    | **Connection name** | *my_connection*      | The connection name that identifies the connection between your AKS cluster and target service. Use the connection name provided by Service Connector or choose your own connection name. |
    | **Subscription**    | My subscription      | The subscription for your target service (the service you want to connect to). The default value is the subscription for this AKS cluster.                                                |
    | **Storage account** | *my_storage_account* | The target storage account you want to connect to. Target service instances to choose from vary according to the selected service type.                                                   |
    | **Client type**     | *python*             | The code language or framework you use to connect to the target service.                                                                                                                       |

1. Select **Next: Authentication** to choose an authentication method.

    ### [Workload identity](#tab/UMI)

    Select **Workload identity** to authenticate through [Microsoft Entra workload identity](/entra/workload-id/workload-identities-overview) to one or more instances of an Azure service. Then select a user-assigned managed identity to enable workload identity.

    ### [Connection string](#tab/CS)
    
    Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.
    
    ### [Service principal](#tab/SP)
    
    Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application.

    ---

1. Select **Next: Networking** to configure the network access to your target service and select **Configure firewall rules to enable access to your target service**.
1. Select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. This operation may take a minute to complete.

## View service connections in AKS cluster

1. The **Service Connector** tab displays existing connections in this cluster.
1. Select **Network View** to see all the service connections in a network topology view.
   :::image type="content" source="./media/aks-quickstart/list-and-view.png" alt-text="Screenshot of the Azure portal, listing and viewing the connections.":::

## Next steps

Follow the following tutorials to start connecting to Azure services on AKS cluster with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure Key Vault using CSI driver](./tutorial-python-aks-keyvault-csi-driver.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure Storage using workload identity](./tutorial-python-aks-storage-workload-identity.md)
