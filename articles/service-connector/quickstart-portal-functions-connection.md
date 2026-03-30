---
title: 'Quickstart: Connect Azure Functions to databases and services with Service Connector'
description: Learn how to connect Azure Functions to databases, storage accounts, and other Azure services using Service Connector. Step-by-step guide for Azure portal and Azure CLI.
author: houk-ms
ms.author: honc
ms.service: service-connector
ms.topic: quickstart
zone_pivot_groups: interaction-type
ms.date: 8/19/2025
keywords: azure functions, service connector, database connection, managed identity, azure storage, authentication
#Customer intent: As an app developer, I want to securely connect my Azure Functions app to databases, storage accounts, and other Azure services using managed identities and other authentication types.
---

# Quickstart: Connect Azure Functions to databases and services with Service Connector

Get started with Service Connector to connect your Azure Functions to databases, storage accounts, and other Azure services. Service Connector simplifies authentication and configuration, enabling you to connect to resources using managed identities or other authentication methods.

This article provides step-by-step instructions for both the Azure portal and Azure CLI. Choose your preferred method using the tabs above.

## Prerequisites

::: zone pivot="azure-portal"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A function app in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create one](../azure-functions/how-to-create-function-azure-cli.md?pivots=programming-language-python).
- A target resource to connect your function app to, such as a [Blob Storage account](../storage/common/storage-account-create.md).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
::: zone-end

::: zone pivot="azure-cli"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- A function app in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create one](../azure-functions/how-to-create-function-azure-cli.md?pivots=programming-language-python).
- A target resource to connect your function app to, such as a [Blob Storage account](../storage/common/storage-account-create.md).
- The [permissions required](./concept-permission.md) to create and manage service connections.
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- This quickstart requires version 2.30.0 or higher of the Azure CLI. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.
::: zone-end

::: zone pivot="azure-cli"
## Set up your environment

1. If you're using Service Connector for the first time, register the Service Connector resource provider by running the [az provider register](/cli/azure/provider#az-provider-register) command.

   ```azurecli
   az provider register -n Microsoft.ServiceLinker
   ```

   > [!TIP]
   > You can check if the resource provider has already been registered by running the command `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

1. Optionally, run the [az functionapp connection list-support-types](/cli/azure/functionapp/connection#az-functionapp-connection-list-support-types) command to get a list of supported target services for Azure Functions.

    ```azurecli
    az functionapp connection list-support-types --output table
    ```
::: zone-end

## Create a service connection

Use Service Connector to create a service connection between your Azure Functions app and Azure Blob Storage. This example demonstrates connecting to Blob Storage, but you can use the same process for other supported Azure services.

::: zone pivot="azure-portal"
1. In the Azure portal, select the **Search resources, services and docs (G +/)** search bar at the top, type *Function App*, and select **Function App**.

   :::image type="content" source="./media/function-app-quickstart/select-function-app.png" alt-text="Screenshot of the Azure portal, selecting Function App.":::

1. Select the function app resource you want to connect to a target resource.

1. In the left navigation, select **Service Connector**, and then select **Create**.

   :::image type="content" source="./media/function-app-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::

1. On the **Basics** tab, select or enter the following settings:

    | Setting             | Example                                  | Description                                                                                                                                                                                |
    |---------------------|------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Service type**    | *Storage - Blob*                         | The target service type. If you don't have a Blob Storage account, you can [create one](../storage/blobs/storage-quickstart-blobs-portal.md) or use another service type.                    |
    | **Subscription**    | *My subscription*                        | The subscription for your target service (the service you want to connect to). The default value is the subscription for this function app resource.                                       |
    | **Connection name** | *my_connection*                          | The connection name that identifies the connection between your function app and target service. Use the connection name provided by Service Connector or choose your own connection name. |
    | **Storage account** | *my_storage_account*                     | The target storage account you want to connect to. Target service instances to choose from vary according to the selected service type.                                                    |
    | **Client type**     | *The same app stack on this function app* | The default value comes from the function app runtime stack. Select the app stack that's on this function app instance.                                                                    |
    
1. Select **Next: Authentication** to choose an authentication method.

    ### [System-assigned managed identity (recommended)](#tab/SMI)

    Select **System-assigned managed identity** to connect through an identity that's automatically generated in Microsoft Entra ID and tied to the lifecycle of the service instance. This is the recommended authentication option.

    ### [User-assigned managed identity](#tab/UMI)

    Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service. Select a subscription that contains a user-assigned managed identity, and then select the identity.

    If you don't have a user-assigned managed identity yet, select **Create new** to create one.
    
    ### [Service principal](#tab/SP)

    1. Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Microsoft Entra ID.
    1. Select a service principal from the list and enter a **secret**.

    ### [Connection string](#tab/CS)

    > [!WARNING]
    > Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

    Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.
    ---

1. Select **Next: Networking** to configure network settings. Select **Configure firewall rules to enable access to target service** so that your function app can access the target service.

1. Select **Next: Review + Create** to review the provided information. Running the final validation takes a few seconds. Then select **Create** to create the service connection. This operation might take a minute to complete.
::: zone-end

::: zone pivot="azure-cli"
### [Managed identity (recommended)](#tab/using-managed-identity)

Run the [az functionapp connection create](/cli/azure/functionapp/connection/create) command to create a service connection to Blob Storage with a system-assigned managed identity. You can run this command in two ways:

- Generate the new connection step by step:
  
  ```azurecli-interactive
  az functionapp connection create storage-blob --system-identity
  ```

- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<function-app>`, `<target-subscription>`, `<target_resource_group>`, and `<account>`.

  ```azurecli-interactive
  az functionapp connection create storage-blob \
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.Web/sites/<function-app> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --system-identity
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az functionapp connection create storage-blob --new --system-identity` to create one and connect it to your function app using a managed identity.

### [Connection string](#tab/using-connection-string)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

Run the [az functionapp connection create](/cli/azure/functionapp/connection/create) command to create a service connection to Blob Storage with a connection string. You can run this command in two ways:

- Generate the new connection step by step:

  ```azurecli-interactive
  az functionapp connection create storage-blob --secret
  ```

- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<function-app>`, `<target-subscription>`, `<target_resource_group>`, `<account>`, `<secret-name>`, and `<secret>`.

  ```azurecli-interactive
  az functionapp connection create storage-blob \
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.Web/sites/<function-app> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --secret name=<secret-name> secret=<secret>
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az functionapp connection create storage-blob --new --secret` to create one and connect it to your function app using a connection string.

---
::: zone-end

## View and validate your service connections

After creating your service connection, you can view, validate, and manage all connections from your Azure Functions app.

::: zone pivot="azure-portal"
1. Function app connections are displayed in the **Service Connector** service menu. Select **>** to expand the list and see the properties required by your application.

1. Select **Validate** to check your connection. You can see the connection validation details in the panel on the right.

   :::image type="content" source="./media/function-app-quickstart/list-and-validate.png" alt-text="Screenshot of the Azure portal, listing and validating the connection.":::
::: zone-end

::: zone pivot="azure-cli"
Run the [az functionapp connection list](/cli/azure/functionapp/connection#az-functionapp-connection-list) command to list all your function app's provisioned connections. Replace the placeholders `<function-app-resource-group>` and `<function-app-name>` with your own information. You can also remove the `--output table` option to view more information about your connections.

```azurecli
az functionapp connection list --resource-group "<function-app-resource-group>" --name "<function-app-name>" --output table
```

The output also displays the provisioning state of your connections.
::: zone-end

## Related content

Now that you've successfully connected your Azure Functions app to Azure Storage, explore these tutorials to build more advanced function applications with Service Connector:

- [Tutorial: Python function with Azure Queue Storage as trigger](./tutorial-python-functions-storage-queue-as-trigger.md)
- [Tutorial: Python function with Azure Blob Storage as input](./tutorial-python-functions-storage-blob-as-input.md)
- [Tutorial: Python function with Azure Table Storage as output](./tutorial-python-functions-storage-table-as-output.md)
