---
title:  Create and use managed identity with bring-your-own-storage (BYOS) 
titleSuffix: Azure Applied AI Services
description: Understand how to create and  use managed identity with BYOS accounts
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 07/08/2021
ms.author: lajanuar
---

# Create and use managed identity for your Form Recognizer resource

> [!IMPORTANT]
> Azure role-based access control (Azure RBAC) assignment is currently in preview and not recommended for production workloads. Certain features may not be supported or have constrained capabilities. Azure RBAC assignments are used to grant permissions for managed identity.

## What is managed identity?

Azure managed identity is a service principal that creates an Azure Active Directory (Azure AD) identity and specific permissions for Azure managed resources. You can use a managed identity to grant access to any resource that supports Azure AD authentication. To grant access, assign a role to a managed identity using [Azure role-based access control](../../role-based-access-control/overview.md) (Azure RBAC).  There is no added cost to use managed identity in Azure.

Managed identity supports both privately and publicly accessible Azure blob storage accounts.  For storage accounts with public access, you can opt to use a shared access signature (SAS) to grant limited access.   In this article, you'll learn to enable a system-assigned managed identity for your Form Recognizer instance.

## Private storage account access

 Private Azure storage account access and authentication is supported by [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). If you have an Azure storage account protected by a Virtual Network (VNet) or firewall or have enabled bring-your-own-storage (BYOS), Form Recognizer cannot directly access your storage account data; however, once a managed identity is enabled, the Form Recognizer service can access your storage account using an assigned managed identity credential.

> [!NOTE]
>
> * If you intend to analyze your storage data with the [**Form Recognizer sample labeling tool (FOTT)**](https://fott-2-1.azurewebsites.net/), you must deploy the tool behind your VNet or firewall.
>
> * The  Analyze [**Receipt**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeReceiptAsync), [**Business Card**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync), [**Invoice**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291), [**Identity Document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5f74a7738978e467c5fb8707), and [**Custom Form**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) APIs can extract data from a single document by posting requests as raw binary content. In these scenarios, there is no requirement for a managed identity credential.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Form Recognizer**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or [**Cognitive Services**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](../cognitive-services-apis-create-account.md?tabs=multiservice%2cwindows).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM). You will create containers to store and organize your blob data within your storage account. If the account has a firewall, you must have the [exception for trusted Azure services](../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) checkbox enabled.

    :::image type="content" source="media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view":::

* A brief understanding of [**Azure role-based access control (Azure RBAC)**](../../role-based-access-control/role-assignments-portal.md) using the Azure portal.

## Managed identity assignments

There are two types of managed identity: **system-assigned** and **user-assigned**. Currently, Form Recognizer is supported by system-assigned managed identity. A system-assigned managed identity is **enabled** directly on a service instance. It is not enabled by default; you have to go to your resource and update the identity setting. The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity will be deleted as well.

In the following steps, we will enable a system-assigned managed identity and grant Form Recognizer limited access to your Azure blob storage account.

## Enable a system-assigned managed identity

>[!IMPORTANT]
>
> To enable a system-assigned managed identity, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../role-based-access-control/built-in-roles.md#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your **Form Recognizer** resource page in the Azure portal.

1. In the left rail, Select **Identity** from the **Resource Management** list:

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

1. In the main window, toggle the **System assigned Status** tab to **On**.

1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. An Azure role assignments page will open. Choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

    > [!NOTE]
    >
    > If you're unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or you get the permissions error, "you do not have permissions to add role assignment at this scope", check that you're currently signed in as a user with an assigned a role that has Microsoft.Authorization/roleAssignments/write permissions such as Owner or User Access Administrator at the Storage scope for the storage resource.

 7. Next, you're going to assign a **Storage Blob Data Reader** role to your Form Recognizer service resource. In the **Add role assignment** pop-up window complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| ***Storage***|
    |**Subscription**| ***The subscription associated with your storage resource***.|
    |**Resource**| ***The name of your storage resource***|
    |**Role** | ***Storage Blob Data Reader***—allows for read access to Azure Storage blob containers and data.|

     :::image type="content" source="media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot: add role assignments page in the Azure portal.":::

1. After you've received the _Added Role assignment_ confirmation message, refresh the page to see the added role assignment.

    :::image type="content" source="media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the change right away, wait and try refreshing the page once more. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="media/managed-identities/assigned-roles-window.png" alt-text="Screenshot: Azure role assignments window.":::

 That's it! You have completed the steps to enable a system-assigned managed identity. With this identity credential, you can grant Form Recognizer specific access rights to documents and files stored in your BYOS account.

## Learn more about  managed identity

> [!div class="nextstepaction"]
> [Managed identities for Azure resources: frequently asked questions - Azure AD](../../active-directory/managed-identities-azure-resources/managed-identities-faq.md)