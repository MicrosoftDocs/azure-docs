---
title: Create and use managed identity
titleSuffix: Azure Cognitive Services
description: Understand how to create and use managed identity in the Azure portal
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 07/08/2021
ms.author: lajanuar
---

# Create and use managed identity for Document Translation

> [!IMPORTANT]
>
> Managed identity for Document Translation is currently unavailable in the global region. If you intend to use managed identity for Document Translation operations, [create your Translator resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in a non-global Azure region.

## What is managed identity?

 Azure managed identity is a service principal that creates an Azure Active Directory (Azure AD) identity and specific permissions for Azure managed resources. You can use a managed identity to grant access to any resource that supports Azure AD authentication. To grant access, assign a role to a managed identity using [Azure role-based access control](../../../role-based-access-control/overview.md) (Azure RBAC).  There is no added cost to use managed identity in Azure.

Managed identity supports both privately and publicly accessible Azure blob storage accounts.  For storage accounts with public access, you can opt to use a shared access signature (SAS) to grant limited access.  In this article, we will examine how to manage access to translation documents in your Azure blob storage account using system-assigned managed identity.

> [!NOTE]
>
> For all operations using an Azure blob storage account available on the public Internet, you can provide a shared access signature (**SAS**) URL with restricted rights for a limited period, and pass it in your POST requests:
>
> * To retrieve your SAS URL, go to your storage resource in the Azure portal and select the **Storage Explorer** tab.
> * Navigate to your container, right-click, and select **Get shared access signature**. It's important to get the SAS for your container, not for the storage account itself.
> * Make sure the **Read**, **Write**, **Delete** and **List** permissions are checked, and click **Create**.
> * Then copy the value in the **URL** section to a temporary location. It should have the form: `https://<storage account>.blob.core.windows.net/<container name>?<SAS value>`.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (not a multi-service Cognitive Services) resource assigned to a **non-global** region. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](../../cognitive-services-apis-create-account.md?tabs=multiservice%2cwindows).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Translator resource. You'll create containers to store and organize your blob data within your storage account. If the account has a firewall, you must have the [exception for trusted Azure services](../../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) checkbox enabled.

    :::image type="content" source="../media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view":::

* A brief understanding of [**Azure role-based access control (Azure RBAC)**](../../../role-based-access-control/role-assignments-portal.md) using the Azure portal.

## Managed Identity assignments

There are two types of managed identity: **system-assigned** and **user-assigned**.  Currently, Document Translation is supported by system-assigned managed identity. A system-assigned managed identity is **enabled** directly on a service instance. It is not enabled by default; you must go to your resource and update the identity setting. The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity will be deleted as well.

In the following steps, we'll enable a system-assigned managed identity and grant your Translator resource limited access to your Azure blob storage account.

## Enable a system-assigned managed identity using the Azure portal

>[!IMPORTANT]
>
> To enable a system-assigned managed identity, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](../../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../../role-based-access-control/built-in-roles.md#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your **Translator** resource page in the Azure portal.

1. In the left rail, select **Identity** from the **Resource Management** list:

    :::image type="content" source="../media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

1. In the main window, toggle the **System assigned Status** tab to **On**.

1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="../media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. An Azure role assignments page will open. Choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="../media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

>[!NOTE]
>
> If you are unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or get the permissions error, "you do not have permissions to add role assignment at this scope", check that you are currently signed in as a user with an assigned a role that has Microsoft.Authorization/roleAssignments/write permissions such as [**Owner**](../../../role-based-access-control/built-in-roles.md#owner) or[**User Access Administrator**](../../../role-based-access-control/built-in-roles.md#user-access-administrator) at the storage scope for the storage resource.

7. Next, you're going to assign a **Storage Blob Data Contributor** role to your Translator service resource. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| ***Storage***.|
    |**Subscription**| ***The subscription associated with your storage resource***.|
    |**Resource**| ***The name of your storage resource***.|
    |**Role** | ***Storage Blob Data Contributor***.|

     :::image type="content" source="../media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot: add role assignments page in the Azure portal.":::

1. After you've received the _Added Role assignment_ confirmation message, refresh the page to see the added role assignment. 

    :::image type="content" source="../media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the change right away, wait and try refreshing the page once more. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="../media/managed-identities/assigned-roles-window.png" alt-text="Screenshot: Azure role assignments window.":::

 Great! You have completed the steps to enable a system-assigned managed identity. With this identity credential, you can grant Translator specific access rights to your storage resource.

## Next steps

> [!div class="nextstepaction"]
> [Managed identities for Azure resources: frequently asked questions](../../../active-directory/managed-identities-azure-resources/managed-identities-faq.md)

> [!div class="nextstepaction"]
>[Use managed identities to acquire an access token](../../../app-service/overview-managed-identity.md?tabs=dotnet#obtain-tokens-for-azure-resources)