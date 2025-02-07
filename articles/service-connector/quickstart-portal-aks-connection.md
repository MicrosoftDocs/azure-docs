---
title: Quickstart - Create a service connection in Azure Kubernetes Service (AKS) from the Azure portal
description: Quickstart showing how to create a service connection in Azure Kubernetes Service (AKS) from the Azure portal
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: quickstart
ms.date: 01/28/2025
---
# Quickstart: Create a service connection in an AKS cluster from the Azure portal

Get started with Service Connector by using the Azure portal to create a new service connection in an Azure Kubernetes Service (AKS) cluster.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An AKS cluster in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create an AKS cluster](/azure/aks/learn/quick-kubernetes-deploy-cli).

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

    ### [Workload identity (recommended)](#tab/UMI)

    Select **Workload identity** to authenticate through [Microsoft Entra workload identity](/entra/workload-id/workload-identities-overview) to one or more instances of an Azure service. Then select a user-assigned managed identity to enable workload identity.
    
    ### [Service principal](#tab/SP)
    
    Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application.

    ### [Connection string](#tab/CS)
    
    > [!WARNING]
    > Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

    Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.

    ---

1. Select **Next: Networking** to configure the network access to your target service and select **Configure firewall rules to enable access to your target service**.
1. Select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. This operation may take a minute to complete.

## View service connections in AKS cluster

1. **Service Connector** displays existing connections in this cluster.
1. Select **Network View** to see all the service connections in a network topology view.
   :::image type="content" source="./media/aks-quickstart/list-and-view.png" alt-text="Screenshot of the Azure portal, listing and viewing the connections.":::

## Update your container

Now that you created a connection between your AKS cluster and target service, you need to retrieve the connection secrets and deploy them in your container.

1. In the [Azure portal](https://portal.azure.com/), navigate to your AKS cluster resource and select **Service Connector**.
1. Select the newly created connection, and then select **YAML snippet**. This action opens a panel displaying a sample YAML file generated by Service Connector.
1. To set the connection secrets as environment variables in your container, you have two options:
    
    * Directly create a deployment using the YAML sample code snippet provided. The snippet includes highlighted sections showing the secret object that will be injected as the environment variables. Select **Apply** to proceed with this method.

        :::image type="content" source="media/aks-quickstart/sample-yaml-snippet.png" alt-text="Screenshot of the Azure portal showing the sample YAML snippet to create a new connection in AKS.":::

   * Alternatively, under **Resource Type**, select **Kubernetes Workload**, and then select an existing Kubernetes workload. This action sets the secret object of your new connection as the environment variables for the selected workload. After selecting the workload, select **Apply**.

        :::image type="content" source="media/aks-quickstart/kubernetes-snippet.png" alt-text="Screenshot of the Azure portal showing the Kubernetes snippet to create a new connection in AKS.":::

## Next steps

Follow the following tutorials to start connecting to Azure services on AKS cluster with Service Connector.

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure Key Vault using CSI driver](./tutorial-python-aks-keyvault-csi-driver.md)

> [!div class="nextstepaction"]
> [Tutorial: Connect to Azure Storage using workload identity](./tutorial-python-aks-storage-workload-identity.md)
