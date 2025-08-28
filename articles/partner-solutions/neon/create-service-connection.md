---
title: Connect Apps to Neon Serverless Postgres
description: Learn how to connect apps to the Neon Serverless Postgres service by using Service Connector in Azure.
#customer intent: As a developer, I want connect apps deployed in Azure services to a Neon Serverless Postgres resource so that I can take advantage of Neon's capabilities.
ms.topic: how-to
ms.date: 03/28/2025
ms.custom: service-connector
---

# Connect apps to Neon Serverless Postgres

In this guide, learn how to connect your app to a database within a Neon Serverless Postgres resource by using Service Connector.

Service Connector is an Azure feature that simplifies the process of connecting Azure resources together. Service Connector manages your connection's network and authentication settings to simplify the operation.

This guide shows step-by-step instructions for connecting an app deployed in Azure App Service to a Neon Serverless Postgres resource. You can apply a similar method to create a connection from apps deployed in [Azure Container Apps](/azure/container-apps/quickstart-portal) or [Azure Kubernetes Service (AKS)](/azure/aks/learn/quick-kubernetes-deploy-portal).

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An existing Neon Serverless Postgres resource. If you don't have one yet, refer to [Create a Neon Serverless Postgres resource](./create.md).
- An app deployed to an [Azure compute service that Service Connector supports](../../service-connector/overview.md#what-services-are-supported-by-service-connector).

## Create a connection

Follow these steps to connect an app to Neon Serverless Postgres:

1. Open the App Service, Container Apps, or AKS resource where your app is deployed.

1. On the left menu, open **Service Connector**, and then select **Create**.

     :::image type="content" source="./media/service-connection/create-connection.png" alt-text="Screenshot of the Azure portal that shows the button for creating a connection.":::

1. Enter or select the following information:

    | Setting                    | Example                       | Description                                                                                                                                                                                                                                                                                       |
    |----------------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**           | *Neon Serverless Postgres*    | The name of the target service: **Neon Serverless Postgres**.                                                                                                                                                                                                                                     |
    | **Connection name**        | *neon_postgres_01*            | The name of the connection between the Azure compute resource and the Neon Serverless Postgres resource. Use the connection name that Service Connector provides, or enter your own connection name. Connection names can contain only letters, numbers (0-9), periods (.), and underscores (_). |
    | **Neon Postgres hostname** | *contoso-compute.gwc.azure.neon.tech* | The host name of the Neon Serverless Postgres resource. The host name is displayed in the Neon portal, on the **Connect** menu, under **Connection string**.                                                                                                                              |
    | **Neon Postgres database name** | *database*                    | The name of the database within the Neon Serverless Postgres resource. The database name is displayed in the Neon portal, on the **Connect** menu, under **Database**.                                                                                                                            |
    | **Client type**            | *Python*                      | The database client type.                                                                                                                                                                                                                                                                         |

     :::image type="content" source="./media/service-connection/create-basics-tab.png" alt-text="Screenshot of the Azure portal that shows the Basics tab for creating a connection.":::

1. Select **Next: Authentication**, and then select or enter the following information:

   1. Select **Database credentials**, and then enter your database username and password.
   1. Select **Store Secret In Key Vault**, and then select an Azure Key Vault connection if you already have one.

      If you don't have a Key Vault connection, select **Create new** to create one. For step-by-step instructions on creating a new connection to Key Vault, refer to [Connect Azure services and store secrets in Azure Key Vault](../../service-connector/tutorial-portal-key-vault.md#create-a-key-vault-connection-in-app-service).
   1. Optionally, select **Advanced** and edit the provided environment variables.

   :::image type="content" source="./media/service-connection/create-authentication-tab.png" alt-text="Screenshot of the Azure portal that shows the Authentication tab for creating a connection.":::

   > [!NOTE]
   > We recommend that you use Azure Key Vault to securely store and manage your credentials, reduce the risk of exposure, and simplify secret management.
  
1. Select **Next: Networking** > **Next: Review + Create**, and then review the provided information.

1. Select **Create**.

## View and edit connections

[!INCLUDE [view-edit-connection](../includes/view-edit-connection.md)]

## Related content

- [Troubleshoot Neon Serverless Postgres](troubleshoot.md)
- [Manage your Neon integration through the Azure portal](manage.md)
