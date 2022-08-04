---
title: Quickstart - Create a service connection in Container Apps from the Azure portal
description: Quickstart showing how to create a service connection in Azure Container Apps from the Azure portal
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: quickstart
ms.date: 07/22/2022
#Customer intent: As an app developer, I want to connect a containerized app to a storage account in the Azure portal using Service Connector.
---

# Quickstart: Create a service connection in Azure Container Apps from the Azure portal

Get started with Service Connector by using the Azure portal to create a new service connection in Azure Container Apps.

> [!IMPORTANT]
> This feature in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An app deployed to Container Apps in a [region supported by Service Connector](./concept-region-support.md). If you don't have one yet, [create and deploy a container to Container Apps](../container-apps/quickstart-portal.md).
- A target resource to connect your Container Apps to. For example, a storage account. [Create a storage account](/azure/storage/common/storage-account-create).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection in Container Apps

You'll use Service Connector to create a new service connection in Container Apps.

1. To create a new service connection in Container Apps, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *Container Apps* in the filter and select **Container Apps**.

    :::image type="content" source="./media/container-apps-quickstart/select-container-apps.png" alt-text="Screenshot of the Azure portal, selecting Container Apps.":::

1. Select the Container Apps resource you want to connect to a target resource.

1. Select **Service Connector (preview)** from the left table of contents. Then select **Create**.

    :::image type="content" source="./media/container-apps-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::

1. Select or enter the following settings.

    | Setting             | Example              | Description                                                                                                                                                                                                                                                                                |
    |---------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Container**       | *my-container-app*   | Select your container app.                                                                                                                                                                                                                                                                 |
    | **Service type**    | *Storage - Blob*     | Target service type. You can [create a Microsoft Blob Storage container](../storage/blobs/storage-quickstart-blobs-portal.md) if you don't have yet, or use another service type.                                                                                                          |
    | **Subscription**    | *my-subscription*    | The subscription where your target service (the service you want to connect to) is located. The default value is the subscription that this container app is in.                                                                                                                           |
    | **Connection name** | *storageblob_700ae*      | The connection name that identifies the connection between your container app and target service. Use the connection name provided by Service Connector or choose your own connection name.                                                                                                |
    | **Storage account** | *my-storage-account* | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance.                                                                                                                                               |
    | **Client type**     | *.NET*               | Select the application stack that works with the target service you selected. The default value is None, which will generate a list of configurations. If you know about the app stack or the client SDK in the container you selected, select the same app stack for the client type.     |

    :::image type="content" source="./media/container-apps-quickstart/basics.png" alt-text="Screenshot of the Azure portal, filling out the Basics tab.":::

1. Select **Next: Authentication** to choose an authentication method.

    ### [System-assigned managed identity](#tab/SMI)

    System-assigned managed identity is the recommended authentication option. Select **System-assigned managed identity** to connect through an identity that's generated in Azure Active Directory and tied to the lifecycle of the service instance.

    ### [User-assigned managed identity](#tab/UMI)

    Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service. Select a subscription that contains a user-assigned managed identity, and select the identity.

    If you don't have one yet, create a user-assigned managed identity:

    1. Open the Azure platform in a new tab and search for **Managed identities**.
    1. Select **Managed identities** and select **Create**
    1. Enter a subscription, resource group, region and instance name
    1. Select **Review + create** and the **Create**
    1. Once your managed identity has been deployed, go to your Service Connector tab, select **Previous** and then **Next** to refresh the form's data, and under **User-assigned managed identity**, select the identity you've just created.

    For more information, go to [create a user-assigned managed identity](/azure/active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities?pivots=identity-mi-methods-azp).

    ### [Connection string](#tab/CS)

    1. Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.

    1. Optionally select **Store Secret In Key Vault**.
       1. If you already have an Azure Key Vault connection, select it from the drop-down box.
       1. If you don't have a Key Vault connection:
            1. Select **Create new** to create a new Key Vault connection. A new pane opens, where you can create a new connection between your container and a key vault. Fill out the form.

          :::image type="content" source="./media/container-apps-quickstart/create-key-vault-connection.png" alt-text="Screenshot of the Azure portal, creating a Key Vault connection.":::

            > [!TIP]
            > If you don't have a Key Vault, you can create one now. Open the Azure portal in a new tab, search and select **Key vaults**. Fill out the **Create a key vault** form with your subscription, resource group, key vault name, and region. Select the standard pricing tier, keep the default 90 days to retain deleted vaults, and disable purge protection. Select **Review + create** to deploy your Key Vault. Once your Key Vault has been deployed, go to your Service Connector tab. Under **Service type** select another service type, and then select **Key Vault** again to refresh the form's data, and under **Key vault**, select the key vault you've just created.

            1. Select **Next: Authentication** and select **System assigned managed identity** or another authentication method of your choice. Fill out the form and select **Next: Networking**.

          :::image type="content" source="./media/container-apps-quickstart/key-vault-authentication.png" alt-text="Screenshot of the Azure portal, Key Vault connection authentication set-up.":::

            1. **Configure firewall rules to enable access to target service** is selected by default. **Select Next : Review + Create**.
           :::image type="content" source="./media/container-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, connection networking set-up.":::

            1. Service Connector runs some checks to validate your connection.

            :::image type="content" source="./media/container-apps-quickstart/key-vault-validation.png" alt-text="Screenshot of the Azure portal, Key Vault connection validation.":::

            1. Once validation has passed, select **Create** to complete the creation of your Key Vault connection. Back in the Container App connection form, on the authentication page, a  notification appears, stating that the creation has started. Wait for a few seconds for the deployment to be complete. A completion notification appears and your new key vault connection is automatically added to the form.

            :::image type="content" source="./media/container-apps-quickstart/authentication-tab-with-keyvault.png" alt-text="Screenshot of the Azure portal, Key Vault connection is selected within the Container Apps connection creation form.":::

    ### [Service principal](#tab/SP)

    1. Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Azure Active Directory.
    1. Select a service principal from the list and enter a **secret**
    1. Optionally select **Store Secret In Key Vault**.
       1. If you already have an Azure Key Vault connection, select it from the drop-down box.
       1. If you don't have a Key Vault connection:
            1. Select **Create new** to create a new Key Vault connection. A new pane opens, where you can create a new connection between your container and a key vault. Fill out the form.

          :::image type="content" source="./media/container-apps-quickstart/create-key-vault-connection.png" alt-text="Screenshot of the Azure portal, creating a Key Vault connection.":::

            > [!TIP]
            > If you don't have a Key Vault, you can create one now. Open the Azure portal in a new tab, search and select **Key vaults**. Fill out the **Create a key vault** form with your subscription, resource group, key vault name, and region. Select the standard pricing tier, keep the default 90 days to retain deleted vaults, and disable purge protection. Select **Review + create** to deploy your Key Vault. Once your Key Vault has been deployed, go to your Service Connector tab. Under **Service type** select another service type, and then select **Key Vault** again to refresh the form's data, and under **Key vault**, select the key vault you've just created.

            1. Select **Next: Authentication** and select **System assigned managed identity** or another authentication method of your choice. Fill out the form and select **Next: Networking**.

          :::image type="content" source="./media/container-apps-quickstart/key-vault-authentication.png" alt-text="Screenshot of the Azure portal, Key Vault connection authentication set-up.":::

            1. **Configure firewall rules to enable access to target service** is selected by default. **Select Next : Review + Create**.

           :::image type="content" source="./media/container-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, connection networking set-up.":::

            1. Service Connector runs some checks to validate your connection.

            :::image type="content" source="./media/container-apps-quickstart/key-vault-validation.png" alt-text="Screenshot of the Azure portal, Key Vault connection validation.":::

            1. Once validation has passed, select **Create** to complete the creation of your Key Vault connection. Back in the Container App connection form, on the authentication page, a  notification appears, stating that the creation has started. Wait for a few seconds for the deployment to be complete. A completion notification appears and your new key vault connection is automatically added to the form.

            :::image type="content" source="./media/container-apps-quickstart/authentication-tab-with-service-principal.png" alt-text="Screenshot of the Azure portal, Key Vault connection is selected within the Container Apps connection creation form.":::

    ---

1. Select **Next: Networking** to select the network configuration and select **Enable firewall settings** so that your container can reach the Blob Storage.

    :::image type="content" source="./media/container-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, connection networking set-up.":::

1. Then select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds.

   :::image type="content" source="./media/container-apps-quickstart/container-app-validation.png" alt-text="Screenshot of the Azure portal, Container App connection validation.":::

1. Then select **Create** to create the service connection. The operation can take up to a minute to complete.

## View service connections in Container Apps

1. Container Apps connections are displayed under **Settings > Service Connector**.

1. Select **>** to expand the list and see the environment variables required by your application.

1. Select **Validate** check your connection status, and select **Learn more** to review the connection validation details.

    :::image type="content" source="./media/container-apps-quickstart/validation-result.png" alt-text="Screenshot of the Azure portal, get connection validation result.":::

## Next steps

Check the guide below for more information about Service Connector:

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)