---
title: Connect apps to Neon Serverless Postgres
description: Learn how to connect apps to your Neon Serverless Postgres service using Service Connector in Azure.
# customerIntent: As a developer I want connect apps deployed to Azure services, to a Neon Serverless Postgres resource.
ms.topic: how-to
ms.date: 03/28/2025
ms.custom: service-connector
---

# Connect apps to Neon Serverless Postgres

In this guide, learn how to connect your app to a database within a Neon Serverless Postgres resource using Service Connector.

Service Connector is an Azure service designed to simplify the process of connecting Azure resources together. Service Connector manages your connection's network and authentication settings to simplify the operation.

This guide shows step by step instructions to connect an app deployed to Azure App Service to a Neon Serverless Postgres resource. You can apply a similar method to create a connection from apps deployed to [Azure Container Apps](/azure/container-apps/quickstart-portal), [Azure Kubernetes Services (AKS)](/azure/aks/learn/quick-kubernetes-deploy-portal).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free)
* An existing Neon Serverless Postgres resource. If you don't have one yet, refer to [create a Neon Serverless Postgres resource](./create.md)
* An app deployed to an [Azure compute service supported by Service Connector](../../service-connector/overview.md#what-services-are-supported-by-service-connector).

## Create a new connection

Follow these steps to connect an app to Neon Serverless Postgres:

1. Open the App Service, Container Apps, or AKS resource where your app is deployed.

1. Open **Service Connector** from the left menu and select **Create**.

     :::image type="content" source="./media/service-connection/create-connection.png" alt-text="Screenshot from the Azure portal showing the Create option.":::

1. Enter or select the following information.

    | Setting                    | Example                       | Description                                                                                                                                                                                                                                                                                       |
    |----------------------------|-------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**           | *Neon Serverless Postgres*    | The name of the target service: **Neon Serverless Postgres**.                                                                                                                                                                                                                                     |
    | **Connection name**        | *neon_postgres_01*            | The name of the connection between the Azure compute resource and the Neon Serverless Postgres resource. Use the connection name provided by Service Connector or enter your own connection name. Connection names can only contain letters, numbers (0-9), periods ("."), and underscores ("_"). |
    | **Neon Postgres hostname** | *contoso-compute.gwc.azure.neon.tech* | The host name of the Neon Serverless Postgres resource. The host name is displayed in the Neon portal, in the **Connect** menu, under **Connection string**.                                                                                                                              |
    | **Neon Postgres database** | *database*                    | The name of the database within the Neon Serverless Postgres resource. The database name is displayed in the Neon portal, in the **Connect** menu, under **Database**.                                                                                                                            |
    | **Client type**            | *Python*                      | The database client type.                                                                                                                                                                                                                                                                         |
 
     :::image type="content" source="./media/service-connection/create-basics-tab.png" alt-text="Screenshot from the Azure portal showing the Create connection - Basics tab.":::

1. Select **Next: Authentication** and select or enter the following information:
   1. Select **Database credentials** and enter your database username and password.
   1. Select **Store Secret in Key Vault** and select a Key Vault connection if you already have one, or select **Create new** to create a Key Vault connection. For step-by-step instructions to create a new connection to Key Vault, refer to [Connect Azure services and store secrets in Azure Key Vault](../../service-connector/tutorial-portal-key-vault.md#create-a-key-vault-connection-in-app-service).
   1. Optionally also select **Advanced** and edit the provided environment variables.

   :::image type="content" source="./media/service-connection/create-authentication-tab.png" alt-text="Screenshot from the Azure portal showing the Create connection - Authentication tab.":::

   > [!NOTE]
   > We recommend you leverage Azure Key Vault to securely store and manage your credentials, reduce the risk of exposure and simplify secret management.
  
1. Select **Next: Networking** >  **Next: Review + Create**  and  review the provided information.

1. Select **Create**.

## View and edit connections

[!INCLUDE [view-edit-connection](../includes/view-edit-connection.md)]

## Related content

- [Troubleshoot Neon Serverless Postgres](troubleshoot.md)
- [Manage the resource in the Azure portal](manage.md)
