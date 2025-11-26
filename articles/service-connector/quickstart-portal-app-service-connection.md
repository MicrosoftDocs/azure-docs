---
title: 'Quickstart: Connect Azure App Service to databases and services with Service Connector'
description: Learn how to connect Azure App Service to databases, storage accounts, and other Azure services using Service Connector. Step-by-step guide for Azure portal and Azure CLI.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
zone_pivot_groups: interaction-type
ms.date: 7/22/2025
keywords: azure app service, service connector, database connection, managed identity, azure storage, authentication
#Customer intent: As an app developer, I want to connect my Azure App Service application to databases, storage accounts, and other Azure services using managed identities and other authentication types.
---

# Quickstart: Connect Azure App Service to databases and services with Service Connector

Get started with Service Connector to connect your Azure App Service to databases, storage accounts, and other Azure services. Service Connector simplifies authentication and configuration, enabling you to connect to resources using managed identities other authentication methods.

This article provides step-by-step instructions for both the Azure portal and Azure CLI. Choose your preferred method using the tabs above.


## Prerequisites

::: zone pivot="azure-portal"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An application deployed to App Service in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy an app to App Service](../app-service/quickstart-dotnetcore.md).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
::: zone-end

::: zone pivot="azure-cli"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An application deployed to App Service in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy an app to App Service](../app-service/quickstart-dotnetcore.md).
- The following [necessary permissions](./concept-permission.md).
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- This quickstart requires version 2.30.0 or higher of the Azure CLI. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.

## Initial set-up

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

   > [!TIP]
   > You can check if the resource provider has already been registered by running the command  `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, Service Connector is already registered.

2. Optionally, use the Azure CLI [az webapp connection list-support-types](/cli/azure/webapp/connection#az-webapp-connection-list-support-types) command to get a list of supported target services for App Service.

   ```azurecli
   az webapp connection list-support-types --output table
   ```
::: zone-end

## Create a service connection in App Service

Use Service Connector to create a service connection between your Azure App Service and Azure Blob Storage. This example demonstrates connecting to Blob Storage, but you can use the same process for other supported Azure services.

::: zone pivot="azure-portal"
1. Select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *App Services*, and select **App Services**.

    :::image type="content" source="./media/app-service-quickstart/select-app-services.png" alt-text="Screenshot of the Azure portal, selecting App Services.":::

1. Select the App Service resource you want to connect to a target resource.
1. Select **Settings** > **Service Connector** from the service menu. Then select **Create**.

    :::image type="content" source="./media/app-service-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::

1. On the **Basics** tab, select or enter the following settings.

    | Setting             | Example                                | Description                                                                                                                                                             |
    |---------------------|----------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | Storage -  Blob                        | The target service type. If you don't have a Microsoft Blob Storage, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type. |
    | **Connection name** | *my_connection*                        | The connection name that identifies the connection between your App Service and target service. Use the connection name provided by Service Connector or choose your own connection name.                                                                          |
    | **Subscription**    | My subscription                        | The subscription for your target service (the service you want to connect to). The default value is the subscription for this App Service resource.          |
    | **Storage account** | *my_storage_account*                   | The target storage account you want to connect to. Target service instances to choose from vary according to the selected service type.                                 |
    | **Client type**     | The same app stack on this App Service | The default value comes from the App Service runtime stack. Select the app stack that's on this App Service instance.                                                    |

1. Select **Next: Authentication** to choose an authentication method.

    ### [System-assigned managed identity (recommended)](#tab/SMI)

    System-assigned managed identity is the recommended authentication option. Select **System-assigned managed identity** to connect through an identity that's generated in Microsoft Entra ID and tied to the lifecycle of the service instance.

    ### [User-assigned managed identity](#tab/UMI)

    Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service.

    ### [Service principal](#tab/SP)

    Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Microsoft Entra ID.

    ### [Connection string](#tab/CS)
    
    > [!WARNING]
    > Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.
    
    Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.
    
    ---

1. Select **Next: Networking** to configure the network access to your target service and select **Configure firewall rules to enable access to your target service**.

1. Select **Next: Review + Create**  to review the provided information. Then select **Create** to create the service connection. This operation might take a minute to complete.
::: zone-end

::: zone pivot="azure-cli"
### [Managed identity (recommended)](#tab/using-managed-identity)

Run the [az webapp connection create](/cli/azure/webapp/connection/create#az-webapp-connection-create-storage-blob) command to create a service connection from App Service to Blob Storage with a system-assigned managed identity. You can run this command in two ways:
    
- Generate the new connection step by step:
     
  ```azurecli-interactive
  az webapp connection create storage-blob --system-identity
  ```
 
- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<webapp>`, `<target-subscription>`, `<target_resource_group>`, and `<account>`.
    
  ```azurecli-interactive
  az webapp connection create storage-blob \
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.Web/sites/<webapp> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --system-identity
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az webapp connection create storage-blob --new --system-identity` to create one and connect it to your App Service using a managed identity.

### [Connection string](#tab/using-connection-string)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

Run the [az webapp connection create](/cli/azure/webapp/connection/create#az-webapp-connection-create-storage-blob) command to create a service connection from App Service to Blob Storage with a connection string. You can run this command in two ways:
    
- Generate the new connection step by step:
    
  ```azurecli-interactive
  az webapp connection create storage-blob --secret
  ```
    
- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<webapp>`, `<target-subscription>`, `<target_resource_group>`, `<account>`, `<secret-name>`, and `<secret>`.
     
  ```azurecli-interactive
  az webapp connection create storage-blob \
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.Web/sites/<webapp> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --secret name=<secret-name> secret=<secret>
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az webapp connection create storage-blob --new --secret` to create one and connect it to your App Service using a connection string.

---
::: zone-end

::: zone pivot="azure-portal"
## View App Service connections

1. Once the connection has successfully been created, the **Service Connector** page displays existing App Service connections.

1. Select the **>** button to expand the list and see the environment variables required by your application code. Select **Hidden value** to view the hidden value.

    :::image type="content" source="./media/app-service-quickstart/show-values.png" alt-text="Screenshot of the Azure portal, viewing connection details.":::

1. Select **Validate** to check your connection. Select **Learn more** to see the connection validation details in the panel on the right.

    :::image type="content" source="./media/app-service-quickstart/validation.png" alt-text="Screenshot of the Azure portal, validating the connection.":::
::: zone-end

::: zone pivot="azure-cli"
## View App Service connections

Run the Azure CLI [az webapp connection](/cli/azure/webapp/connection) command to list connections to your App Service, providing the following information:

- The name of the resource group that contains the App Service
- The name of the App Service

```azurecli
az webapp connection list --resource-group "<your-app-service-resource-group>" -n "<your-app-service-name>" --output table
```
::: zone-end

## Related content

Follow the tutorials below to start building your own application with Service Connector.

- [Tutorial: WebApp + Storage with Azure CLI](./tutorial-csharp-webapp-storage-cli.md)
- [Tutorial: WebApp + PostgreSQL with Azure CLI](./tutorial-django-webapp-postgres-cli.md)
