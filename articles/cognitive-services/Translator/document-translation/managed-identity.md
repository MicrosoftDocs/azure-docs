---
title: Create and use managed identities for Document Translation
titleSuffix: Azure Cognitive Services
description: Understand how to create and use managed identities in the Azure portal
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 02/22/2022
ms.author: lajanuar
---

# Managed identities for Document Translation

> [!IMPORTANT]
>
> Managed identities for Azure resources are currently unavailable for Document Translation service in the global region. If you intend to use managed identities for Document Translation operations, [create your Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in a non-global Azure region.

Managed identities for Azure resources are service principals that create an Azure Active Directory (Azure AD) identity and specific permissions for Azure managed resources:

* You can use managed identities to grant access to any resource that supports Azure AD authentication, including your own applications. Unlike security keys and authentication tokens, managed identities eliminate the need for developers to manage credentials. 

* To grant access to an Azure resource, assign an Azure role to a managed identity using [Azure role-based access control (Azure RBAC)](../../../role-based-access-control/overview.md).

* There's no added cost to use managed identities in Azure.

> [!TIP]
> Managed identities eliminate the need for you to manage credentials, including Shared Access Signature (SAS) tokens. Managed identities are a safer way to grant access to data without having credentials in your code.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (not a multi-service Cognitive Services) resource assigned to a **non-global** region. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](../../cognitive-services-apis-create-account.md?tabs=multiservice%2cwindows).

* A brief understanding of [**Azure role-based access control (Azure RBAC)**](../../../role-based-access-control/role-assignments-portal.md) using the Azure portal.

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Translator resource. You'll create containers to store and organize your blob data within your storage account. 

* **If your storage account is behind a firewall, you must enable the following configuration**: </br>

  * On your storage account page, select **Security + networking** → **Networking** from the left menu.
    :::image type="content" source="../media/managed-identities/security-and-networking-node.png" alt-text="Screenshot: security + networking tab.":::

  * In the main window, select **Allow access from Selected networks**.
  :::image type="content" source="../media/managed-identities/firewalls-and-virtual-networks.png" alt-text="Screenshot: Selected networks radio button selected.":::

  * On the selected networks page, navigate to the **Exceptions** category and make certain that the  [**Allow Azure services on the trusted services list to access this storage account**](../../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) checkbox is enabled.

    :::image type="content" source="../media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view":::

## Managed identity assignments

There are two types of managed identities: **system-assigned** and **user-assigned**.  Currently, Document Translation supports system-assigned managed identities:

* A system-assigned managed identity is **enabled** directly on a service instance. It isn't enabled by default; you must go to your resource and update the identity setting. 

* The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity will be deleted as well.

In the following steps, we'll enable a system-assigned managed identity and grant your Translator resource limited access to your Azure blob storage account.

## Enable a system-assigned managed identity

>[!IMPORTANT]
>
> To enable a system-assigned managed identity, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](../../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../../role-based-access-control/built-in-roles.md#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your **Translator** resource page in the Azure portal.

1. In the left rail, select **Identity** from the **Resource Management** list:

    :::image type="content" source="../media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

1. In the main window, toggle the **System assigned Status** tab to **On**.

## Grant access to your storage account

You need to grant Translator access to your storage account before it can create, read, or delete blobs. Now that you enabled Translator with a system-assigned managed identity, you can use Azure role-based access control (Azure RBAC), to give Translator access to Azure storage. 

The **Storage Blob Data Contributor** role gives Translator (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data.

1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="../media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. An Azure role assignments page will open. Choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="../media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

    >[!NOTE]
    >
    > If you are unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or get the permissions error, "you do not have permissions to add role assignment at this scope", check that you are currently signed in as a user with an assigned a role that has Microsoft.Authorization/roleAssignments/write permissions such as [**Owner**](../../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../../role-based-access-control/built-in-roles.md#user-access-administrator) at the storage scope for the storage resource.

1. Next, you're going to assign a **Storage Blob Data Contributor** role to your Translator service resource. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| **_Storage_**.|
    |**Subscription**| **_The subscription associated with your storage resource_**.|
    |**Resource**| **_The name of your storage resource_**.|
    |**Role** | **_Storage Blob Data Contributor_**.|

     :::image type="content" source="../media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot: add role assignments page in the Azure portal.":::

1. After you've received the _Added Role assignment_ confirmation message, refresh the page to see the added role assignment.

    :::image type="content" source="../media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the change right away, wait and try refreshing the page once more. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="../media/managed-identities/assigned-roles-window.png" alt-text="Screenshot: Azure role assignments window.":::

 Great! You've completed the steps to enable a system-assigned managed identity. With managed identity and Azure RBAC, you granted Translator specific access rights to your storage resource without having to manage credentials such as SAS tokens.

## Next steps

> [!div class="nextstepaction"]
> [Access Azure Storage from a web app using managed identities](/azure/app-service/scenario-secure-app-access-storage?toc=/azure/cognitive-services/translator/toc.json&bc=/azure/cognitive-services/translator/breadcrumb/toc.json)
