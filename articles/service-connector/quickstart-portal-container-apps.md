---
title: 'Quickstart: Connect Azure Container Apps to databases and services with Service Connector (preview)'
description: Learn how to connect Azure Container Apps to databases, storage accounts, and other Azure services using Service Connector. Step-by-step guide for Azure portal and Azure CLI.
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.topic: quickstart
zone_pivot_groups: interaction-type
ms.date: 9/19/2025
keywords: azure container apps, service connector, database connection, managed identity, azure storage, authentication, preview
#Customer intent: As an app developer, I want to connect my Azure Container Apps to databases, storage accounts, and other Azure services using managed identities and connection strings.
---

# Quickstart: Connect Azure Container Apps to databases and services with Service Connector (preview)

Get started with Service Connector to connect your Azure Container Apps to databases, storage accounts, and other Azure services. Service Connector simplifies authentication and configuration, enabling you to connect to resources using managed identities or other authentication methods.

This article provides step-by-step instructions for both the Azure portal and Azure CLI. Choose your preferred method using the tabs above.

> [!IMPORTANT]
> Support for Service Connector (preview) on Azure Container Apps ends on March 30, 2026. After that date, new service connections using Service Connector (preview) aren't available through any interface. For more information, see [RETIREMENT: Service Connector (Preview) on Azure Container Apps](https://aka.ms/serviceconnectoraca).

## Prerequisites

::: zone pivot="azure-portal"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An [application deployed to Container Apps](../container-apps/quickstart-portal.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect your Container Apps to, such as a [Blob Storage account](../storage/common/storage-account-create.md).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
::: zone-end

::: zone pivot="azure-cli"
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- An [application deployed to Container Apps](../container-apps/quickstart-portal.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect your Container Apps to, such as a [Blob Storage account](../storage/common/storage-account-create.md).
- The [necessary permissions](./concept-permission.md) to create and manage service connections.
[!INCLUDE [azure-cli-prepare-your-environment-no-header.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment-no-header.md)]
- This quickstart requires version 2.30.0 or higher of the Azure CLI. To upgrade to the latest version, run `az upgrade`. If using Azure Cloud Shell, the latest version is already installed.

## Set up your environment

1. If you're using Service Connector for the first time, start by running the command [az provider register](/cli/azure/provider#az-provider-register) to register the Service Connector resource provider.

    ```azurecli
    az provider register -n Microsoft.ServiceLinker
    ```

    > [!TIP]
    > You can check if the resource provider has already been registered by running the command `az provider show -n "Microsoft.ServiceLinker" --query registrationState`. If the output is `Registered`, then Service Connector has already been registered.

1. Optionally, run the command [az containerapp connection list-support-types](/cli/azure/containerapp/connection#az-containerapp-connection-list-support-types) to get a list of supported target services for Container Apps.

    ```azurecli
    az containerapp connection list-support-types --output table
    ```
::: zone-end

## Create a service connection (preview)

Use Service Connector to create a service connection between your Azure Container Apps and Azure Blob Storage. This example demonstrates connecting to Blob Storage, but you can use the same process for other supported Azure services.

::: zone pivot="azure-portal"
1. Select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *Container Apps* in the filter and select **Container Apps**.

    :::image type="content" source="./media/container-apps-quickstart/select-container-apps.png" alt-text="Screenshot of the Azure portal, selecting Container Apps.":::

1. Select the name of the Container Apps resource you want to connect to a target resource.

1. Select **Service Connector (preview)** from the left table of contents. Then select **Create**.

    :::image type="content" source="./media/container-apps-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::

1. On the **Basics** tab, select or enter the following settings.

    | Setting             | Example              | Description                                                                                                                                                                                                                                                                     |
    |---------------------|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Container**       | *my-container-app*   | The container in your container app.                                                                                                                                                                                                                                            |
    | **Service type**    | *Storage - Blob*     | The type of service you want to connect to your container app.                                                                                                                                                                                                                  |
    | **Subscription**    | *my-subscription*    | The subscription that contains the service you want to connect to. The default value is the subscription that contains this container app.                                                                                                                   |
    | **Connection name** | *storageblob_700ae*  | The connection name that identifies the connection between your container app and target service. Use the connection name provided by Service Connector or choose your own connection name.                                                                                     |
    | **Storage account** | *my-storage-account* | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance.                                                                                                                                    |
    | **Client type**     | *.NET*               | The application stack that works with the target service you selected. The default value is **None**, which generates a list of configurations. If you know the app stack or client SDK in your selected, select the same app stack for the client type. |
    
1. Select **Next: Authentication** to choose an authentication method: system-assigned managed identity (SMI), user-assigned managed identity (UMI), connection string, or service principal.

    ### [System-assigned managed identity (recommended)](#tab/SMI)

    Select **System-assigned managed identity** to connect through an identity that's automatically generated in Microsoft Entra ID and tied to the lifecycle of the service instance. This is the recommended authentication option.

    ### [User-assigned managed identity](#tab/UMI)

    Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service. Select a subscription that contains a user-assigned managed identity, and then select the identity.

    If you don't have a user-assigned managed identity yet, create one:

    1. Open the Azure platform in a new tab and search for **Managed identities**.
    1. Select **Managed identities** and select **Create**.
    1. Enter a subscription, resource group, region, and instance name.
    1. Select **Review + create** and then **Create**
    1. Once your managed identity has been deployed, return to your Service Connector tab, select **Previous** and then **Next** to refresh the form's data. Under **User-assigned managed identity**, select the identity you created.

    For more information, see [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp).

    ### [Service principal](#tab/SP)

    1. Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Microsoft Entra ID.
    1. Select a service principal from the list and enter a **secret**

    ### [Connection string](#tab/CS)

    > [!WARNING]
    > Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

   Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.
    ---

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service** so that your container app can access the Blob Storage.

    :::image type="content" source="./media/container-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, connection networking set-up.":::

1. Select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds.

   :::image type="content" source="./media/container-apps-quickstart/container-app-validation.png" alt-text="Screenshot of the Azure portal, Container App connection validation.":::

1. Select **Create** to create the service connection. The operation can take up to a minute to complete.
::: zone-end

::: zone pivot="azure-cli"
### [Managed identity (recommended)](#tab/using-managed-identity)

Run the [`az containerapp connection create`](/cli/azure/containerapp/connection/create#az-containerapp-connection-create-storage-blob) command to create a service connection from Container Apps to a Blob Storage with a system-assigned managed identity. You can run this command in two different ways:
    
- Generate the new connection step by step.
        
  ```azurecli-interactive
  az containerapp connection create storage-blob --system-identity
  ```
 
- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<app>`, `<target-subscription>`, `<target_resource_group>`, and `<account>`.
    
  ```azurecli-interactive
  az containerapp connection create storage-blob \                         
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.App/containerApps/<app> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --system-identity
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az containerapp connection create storage-blob --new --system-identity` to create one and connect it to your container app using a managed identity.

### [Connection string](#tab/using-connection-string)

> [!WARNING]
> Microsoft recommends that you use the most secure authentication flow available. The authentication flow described in this procedure requires a very high degree of trust in the application, and carries risks that are not present in other flows. You should only use this flow when other more secure flows, such as managed identities, aren't viable.

Run the [`az containerapp connection create`](/cli/azure/containerapp/connection/create#az-containerapp-connection-create-storage-blob) command to create a service connection from Container Apps to a Blob Storage with a connection string. You can run this command in two different ways:
    
- Generate the new connection step by step.
       
  ```azurecli-interactive
  az containerapp connection create storage-blob --secret
  ```
    
- Generate the new connection at once. Replace the placeholders with your own information: `<source-subscription>`, `<source_resource_group>`, `<app>`, `<target-subscription>`, `<target_resource_group>`, `<account>`, `<secret-name>`, and `<secret>`.
     
  ```azurecli-interactive
  az containerapp connection create storage-blob \                         
     --source-id /subscriptions/<source-subscription>/resourceGroups/<source_resource_group>/providers/Microsoft.App/containerApps/<app> \
     --target-id /subscriptions/<target-subscription>/resourceGroups/<target_resource_group>/providers/Microsoft.Storage/storageAccounts/<account>/blobServices/default \
     --secret name=<secret-name> secret=<secret>
  ```

> [!TIP]
> If you don't have a Blob Storage account, run `az containerapp connection create storage-blob --new --secret` to create one and connect it to your container app using a managed identity.

---
::: zone-end

::: zone pivot="azure-portal"
## View service connections

1. Container Apps connections are displayed under **Settings > Service Connector (preview)**. Select **>** to expand the list and see the properties required by your application.

1. Select your connection and then **Validate** to prompt Service Connector to check your connection.

1. Select  **Learn more** to review the connection validation details.

    :::image type="content" source="./media/container-apps-quickstart/validation-result.png" alt-text="Screenshot of the Azure portal, get connection validation result.":::
::: zone-end

::: zone pivot="azure-cli"
Run the [az containerapp connection list](/cli/azure/containerapp/connection#az-containerapp-connection-list) command to list all your container app's provisioned connections. Replace the placeholders `<container-app-resource-group>` and `<container-app-name>` from the command below with your own information. You can also remove the `--output table` option to view more information about your connections.

```azurecli
az containerapp connection list --resource-group "<container-app-resource-group>" --name "<container-app-name>" --output table
```

The output also displays the provisioning state of your connections.
::: zone-end

## Related content

Check the following guides for more information about Service Connector:

- [Service Connector internals](./concept-service-connector-internals.md)
- [Container Apps: Connect Java Quarkus app to PostgreSQL](../container-apps/tutorial-java-quarkus-connect-managed-identity-postgresql-database.md?bc=%2fazure%2fservice-connector%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fservice-connector%2fTOC.json)
- [Container Apps: Connect ASP.NET Core app to App Configuration](../azure-app-configuration/quickstart-container-apps.md?bc=%2fazure%2fservice-connector%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fservice-connector%2fTOC.json)
