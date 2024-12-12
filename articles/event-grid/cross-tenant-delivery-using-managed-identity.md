---
title: Cross-tenant delivery in Azure Event Grid
description: Describes how to publish and deliver events across tenants using an Azure Event Grid topic with a user-assigned identity.
ms.topic: how-to
ms.custom: devx-track-azurecli, ignite-2024
ms.date: 11/18/2024
# Customer intent: As a developer, I want to know how to delivery events using managed identity to a destination in another tenant.
---

# Cross-tenant event delivery using a managed identity 
This article provides information on delivery of events where Azure Event Grid basic resources like topics, domains, system topics, and partner topics are in one tenant and the Azure destination resource is in another tenant. 

The following sections show you how to implement a sample scenario where an Azure Event Grid topic with a user-assigned identity as a federated credential delivers events to an Azure Storage Queue destination hosted in another tenant. Here are the high-level steps:

1. Create an Azure Event Grid topic with a user-assigned managed identity in Tenant A.
1. Create a multitenant app with a federated client credential.
1. Create an Azure Storage Queue destination in Tenant B. 
1. While creating an event subscription to the topic, enable cross-tenant delivery and configure an endpoint.

> [!NOTE]
> - This feature is currently in preview. 
> - Cross-tenant delivery is currently available for the following endpoints: Service Bus topics and queues, Event Hubs, and Storage queues. 

## Create a topic with a user-assigned identity (Tenant A) 
Create a user-assigned identity by following instructions in the [Manage user-assigned managed identities](/entra/identity/managed-identities-azure-resources/how-manage-user-assigned-managed-identities) article. Then, enable a user-assigned managed identity while creating a topic or updating an existing topic by using steps in the following procedure. 

### Enable user-assigned identity for a new topic
1. On the **Security** page of the topic or domain creation wizard, select **Add user assigned identity**. 
1. In the **Select user assigned identity** window, select the subscription that has the user-assigned identity, select the **user-assigned identity**, and then choose **Select**. 

    :::image type="content" source="./media/managed-service-identity/create-page-add-user-assigned-identity-link.png" alt-text="Screenshot showing the Enable user-assigned identity option selected." lightbox="./media/managed-service-identity/create-page-add-user-assigned-identity-link.png":::


### Enable user-assigned identity for an existing topic
1. On the **Identity** page, switch to the **User assigned** tab in the right pane, and then select **+ Add** on the toolbar.

    :::image type="content" source="./media/managed-service-identity/user-assigned-identity-add-button.png" alt-text="Screenshot showing the User Assigned Identity tab.":::     
1. In the **Add user managed identity** window, follow these steps:
    1. Select the **Azure subscription** that has the user-assigned identity. 
    1. Select the **user-assigned identity**. 
    1. Select **Add**. 
1. Refresh the list in the **User assigned** tab to see the added user-assigned identity.


For more information, see the following articles:
- [Enable user-assigned identity for a system topic](enable-identity-system-topics.md)
- [Enable user-assigned identity for a custom topic or a domain](enable-identity-custom-topics-domains.md)

## Create a multitenant Application 

1. Create a Microsoft Entra app and update the registration to be multitenant. For details, see [Enable multitenant registration](/entra/identity-platform/howto-convert-app-to-be-multi-tenant#update-registration-to-be-multitenant). 

    :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/multi-tenant-app.png" alt-text="Screenshot that shows the Microsoft Entra app authentication setting set to Multitenant." lightbox="./media/cross-tenant-delivery-using-managed-identity/multi-tenant-app.png":::
1. Create the federated identity credential relationship between multitenant app and the user-assigned identity of the Event Grid topic using Graph API. 

    :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/federated-identity-credential-post-api.png" alt-text="Screenshot that shows the sample POST method to enable federated identity credential relationship between multitenant app and user-assigned identity." lightbox="./media/cross-tenant-delivery-using-managed-identity/federated-identity-credential-post-api.png":::   

    - In the URL, use the multitenant app object ID. 
    - For **Name**, provide a unique name for the federated client credential.
    - For **Issuer**, use `https://login.microsoftonline.com/TENANTID/v2.0` where `TENANTID` is the ID of the tenant where the user-assigned identity is located. 
    - For **Subject**, specify the client ID of the user-assigned identity. 
   
    Verify and wait for the API call to succeed.     
1. Once the API call succeeds, proceed to verify that the federated client credential is set up correctly on the multitenant app. 

    :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/certificates-secrets-federated-credential.png" alt-text="Screenshot that shows the certificates and secrets page of the multitenant app." lightbox="./media/cross-tenant-delivery-using-managed-identity/certificates-secrets-federated-credential.png":::

    > [!NOTE]
    > The subject identifier is the client ID of the user-assigned identity on the topic. 

## Create destination storage account (Tenant B)
Create a storage account in a tenant that's different from the tenant that has the source Event Grid topic and user-assigned identity. You create an event subscription to the topic (in tenant A) using the storage account (in tenant B) later. 

1. Create a storage account by following instructions from the [Create a storage account](../storage/common/storage-account-create.md#create-a-storage-account) article. 
1. Using the **Access Control (IAM)** page, add the multitenant app to the appropriate role so that the app can send events to the storage account. For example: Storage Account Contributor, Storage Queue Data Contributor, Storage Queue Data Message Sender. For instructions, see [Assign an Azure role for an Azure queue](../storage/queues/assign-azure-role-data-access.md#assign-an-azure-role).

    :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/storage-role.png" alt-text="Screenshot that shows the Access Control (IAM) page for the storage account." lightbox="./media/cross-tenant-delivery-using-managed-identity/storage-role.png":::


## Enable cross-tenant delivery and configure the endpoint
Create an event subscription on the topic with federated client credential information passed to deliver to the destination storage account. 

1. While creating an event subscription, enable **cross-tenant delivery** and select **Configure an endpoint**. 

    :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/create-subscription-cross-tenant.png" alt-text="Screenshot that shows the Create Event Subscription page with Cross-tenant delivery option enabled." lightbox="./media/cross-tenant-delivery-using-managed-identity/create-subscription-cross-tenant.png":::
1. On the **Endpoint** page, specify the subscription ID, resource group, storage account name, and the queue name in Tenant B. 

    :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/endpoint.png" alt-text="Screenshot that shows the Endpoint page." lightbox="./media/cross-tenant-delivery-using-managed-identity/endpoint.png":::
1. Now, in the **Managed Identity for Delivery** section, do these steps:
    1. For **Managed identity type**, select **User Assigned**. 
    1. Select the **user-assigned identity** from the drop-down list. 
    1. For **Federated identity credentials**, enter the multitenant application ID. 

        :::image type="content" source="./media/cross-tenant-delivery-using-managed-identity/managed-identity-for-delivery.png" alt-text="Screenshot that shows the Create Event Subscription page with the managed identity specified." lightbox="./media/cross-tenant-delivery-using-managed-identity/managed-identity-for-delivery.png":::
1. Select **Create** at the bottom of the page to create the event subscription. 

    Now, publish event to topic and verify event is delivered successfully to destination storage account. 
