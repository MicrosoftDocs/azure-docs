---
title: Connect apps to MongoDB Atlas (Preview)
description: Learn how to connect apps to your MongoDB Atlas (Preview) service using Service Connector in Azure.
# customerIntent: As a developer, I want connect apps deployed to Azure services to a MongoDB Atlas (Preview) resource.
ms.topic: how-to
ms.date: 04/22/2025
ms.custom:
  - service-connector
  - build-2025
ms.author: malev
author: maud-lv

---

# Connect apps to MongoDB Atlas (Preview)

In this guide, you learn how to connect your app to a database within a MongoDB Atlas Cluster (Preview) resource using Service Connector.

Service Connector is an Azure service designed to simplify the process of connecting Azure resources together. Service Connector manages your connection's network and authentication settings to simplify the operation.

This guide shows step by step instructions to connect an app deployed to Azure App Service to a MongoDB Atlas resource. You can apply a similar method to create a connection from apps deployed to [Azure Container Apps](/azure/container-apps/quickstart-portal) or [Azure Kubernetes Services (AKS)](/azure/aks/learn/quick-kubernetes-deploy-portal).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
* An existing MongoDB Atlas resource. If you don't have one yet, go to [MongoDB Atlas](https://www.mongodb.com/atlas).
* An app deployed to an [Azure compute service supported by Service Connector](./overview.md#what-services-are-supported-by-service-connector).

## Create a new connection

Follow these steps to connect an app to MongoDB Atlas:

1. Open the App Service, Container Apps, or AKS resource where your app is deployed.

1. Open **Settings** > **Service Connector** from the left menu and select **Create**.

    :::image type="content" source="./media/tutorial-mongodb-atlas/create-connection.png" alt-text="Screenshot from the Azure portal showing the Create option.":::

1. Enter or select the following information.

    | Setting                    | Example                       | Description                                                                                                                                                                                                                                                                                       |
    |----------------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**           | *MongoDB Atlas Cluster (preview)*    | The name of the target service: **MongoDB Atlas Cluster (Preview)**.                                                                                                                                                                                                                                     |
    | **Connection name**        | *mongodb_atlas_01*            | The name of the connection between the Azure compute resource and the MongoDB Atlas Cluster resource. Use the connection name provided by Service Connector or enter your own connection name. Connection names can only contain letters, numbers (0-9), periods ("."), and underscores ("_"). |
 
    :::image type="content" source="./media/tutorial-mongodb-atlas/create-basics-tab.png" alt-text="Screenshot from the Azure portal showing the Create connection - Basics tab.":::

1. Select **Next: Authentication** and enter your cluster connection string. Optionally also edit your cluster connection string variable name under **Advanced**.

    > [!TIP]
    > To find your cluster's connection string, in the MongoDB Atlas platform, navigate to **Clusters** > **Connection** > **Drivers**, and copy the connection string.

    :::image type="content" source="./media/tutorial-mongodb-atlas/create-authentication-tab.png" alt-text="Screenshot from the Azure portal showing the Create connection - Authentication tab.":::

1. Select **Next** until you reach  **Review + Create**, and review the provided information.
1. Select **Create**.

## View and edit connections

[!INCLUDE [view-edit-connection](../partner-solutions/includes/view-edit-connection.md)]

## Related content

- [Integrate MongoDB Atlas cluster into your application](how-to-integrate-mongodb-atlas.md)
- [What is Service Connector](overview.md)
