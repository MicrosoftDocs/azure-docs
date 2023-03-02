---
title: Quickstart - Create a service connection in Container Apps from the Azure portal
description: Quickstart showing how to create a service connection in Azure Container Apps from the Azure portal
author: maud-lv
ms.author: malev
ms.service: service-connector
ms.custom: event-tier1-build-2022
ms.topic: quickstart
ms.date: 08/09/2022

#Customer intent: As an app developer, I want to connect a Container App to a storage account in the Azure portal using Service Connector.
---

# Quickstart: Create a service connection in Azure Container Apps from the Azure portal

This quickstart shows you how to connect Azure Container Apps to other Cloud resources using the Azure portal and Service Connector. Service Connector lets you quickly connect compute services to cloud services, while managing your connection's authentication and networking settings.

> [!IMPORTANT]
> This feature in Container Apps is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free).
- An [app deployed to Container Apps](../container-apps/quickstart-portal.md) in a [region supported by Service Connector](./concept-region-support.md).
- A target resource to connect your Container Apps to. For example, a [storage account](../storage/common/storage-account-create.md).

## Sign in to Azure

Sign in to the Azure portal at [https://portal.azure.com/](https://portal.azure.com/) with your Azure account.

## Create a new service connection

You'll use Service Connector to create a new service connection in Container Apps.

1. To create a new service connection in Container Apps, select the **Search resources, services and docs (G +/)** search bar at the top of the Azure portal, type *Container Apps* in the filter and select **Container Apps**.

    :::image type="content" source="./media/container-apps-quickstart/select-container-apps.png" alt-text="Screenshot of the Azure portal, selecting Container Apps.":::

1. Select the name of the Container Apps resource you want to connect to a target resource.

1. Select **Service Connector (preview)** from the left table of contents. Then select **Create**.

    :::image type="content" source="./media/container-apps-quickstart/select-service-connector.png" alt-text="Screenshot of the Azure portal, selecting Service Connector and creating new connection.":::

1. Select or enter the following settings.

    | Setting             | Example              | Description                                                                                                                                                                                                                                                                     |
    |---------------------|----------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
    | **Container**       | *my-container*       | The container of your container app.                                                                                                                                                                                                                                            |
    | **Service type**    | *Storage - Blob*     | The type of service you're going to connect to your container.                                                                                                                                                                                                                  |
    | **Subscription**    | *my-subscription*    | The subscription that contains your target service (the service you want to connect to). The default value is the subscription that this container app is in.                                                                                                                   |
    | **Connection name** | *storageblob_700ae*  | The connection name that identifies the connection between your container app and target service. Use the connection name provided by Service Connector or choose your own connection name.                                                                                     |
    | **Storage account** | *my-storage-account* | The target storage account you want to connect to. If you choose a different service type, select the corresponding target service instance.                                                                                                                                    |
    | **Client type**     | *.NET*               | The application stack that works with the target service you selected. The default value is None, which will generate a list of configurations. If you know about the app stack or the client SDK in the container you selected, select the same app stack for the client type. |

    :::image type="content" source="./media/container-apps-quickstart/basics.png" alt-text="Screenshot of the Azure portal, filling out the Basics tab.":::

1. Select **Next: Authentication** to choose an authentication method: system-assigned managed identity (SMI), user-assigned managed identity (UMI), connection string, or service principal.

    ### [SMI](#tab/SMI)

    System-assigned managed identity is the recommended authentication option. Select **System-assigned managed identity** to connect through an identity that's automatically generated in Azure Active Directory and tied to the lifecycle of the service instance.

    ### [UMI](#tab/UMI)

    Select **User-assigned managed identity** to authenticate through a standalone identity assigned to one or more instances of an Azure service. Select a subscription that contains a user-assigned managed identity, and select the identity.

    If you don't have one yet, create a user-assigned managed identity:

    1. Open the Azure platform in a new tab and search for **Managed identities**.
    1. Select **Managed identities** and select **Create**
    1. Enter a subscription, resource group, region and instance name
    1. Select **Review + create** and the **Create**
    1. Once your managed identity has been deployed, go to your Service Connector tab, select **Previous** and then **Next** to refresh the form's data, and under **User-assigned managed identity**, select the identity you've created.

    For more information, go to [create a user-assigned managed identity](../active-directory/managed-identities-azure-resources/how-manage-user-assigned-managed-identities.md?pivots=identity-mi-methods-azp).

    ### [Connection string](#tab/CS)

   Select **Connection string** to generate or configure one or multiple key-value pairs with pure secrets or tokens.

    ### [Service principal](#tab/SP)

    1. Select **Service principal** to use a service principal that defines the access policy and permissions for the user/application in Azure Active Directory.
    1. Select a service principal from the list and enter a **secret**

    ---

1. Select **Next: Networking** to select the network configuration and select **Configure firewall rules to enable access to target service** so that your container can reach the Blob Storage.

    :::image type="content" source="./media/container-apps-quickstart/networking.png" alt-text="Screenshot of the Azure portal, connection networking set-up.":::

1. Select **Next: Review + Create**  to review the provided information. Running the final validation takes a few seconds.

   :::image type="content" source="./media/container-apps-quickstart/container-app-validation.png" alt-text="Screenshot of the Azure portal, Container App connection validation.":::

1. Select **Create** to create the service connection. The operation can take up to a minute to complete.

## View service connections

1. Container Apps connections are displayed under **Settings > Service Connector**.

1. Select **>** to expand the list and see the environment variables required by your application.

1. Select **Validate** check your connection status, and select **Learn more** to review the connection validation details.

    :::image type="content" source="./media/container-apps-quickstart/validation-result.png" alt-text="Screenshot of the Azure portal, get connection validation result.":::

## Next steps

Check the guide below for more information about Service Connector:

> [!div class="nextstepaction"]
> [Service Connector internals](./concept-service-connector-internals.md)