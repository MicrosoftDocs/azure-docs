---
title: Create and use managed identities with Document Intelligence (formerly Form Recognizer)
titleSuffix: Azure AI services
description: Understand how to create and  use managed identity with Document Intelligence
author: laujan
manager: nitinme
ms.service: azure-ai-document-intelligence
ms.custom:
  - ignite-2023
ms.topic: how-to
ms.date: 07/18/2023
ms.author: lajanuar
monikerRange: '<=doc-intel-4.0.0'
---


# Managed identities for Document Intelligence

[!INCLUDE [applies to v4.0, v3.1, v3.0, v2.1](includes/applies-to-v40-v31-v30-v21.md)]

Managed identities for Azure resources are service principals that create a Microsoft Entra identity and specific permissions for Azure managed resources:

:::image type="content" source="media/managed-identities/rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

* You can use managed identities to grant access to any resource that supports Microsoft Entra authentication, including your own applications. Unlike security keys and authentication tokens, managed identities eliminate the need for developers to manage credentials.

* To grant access to an Azure resource, assign an Azure role to a managed identity using [Azure role-based access control (Azure RBAC)](../../role-based-access-control/overview.md).

* There's no added cost to use managed identities in Azure.

> [!IMPORTANT]
>
> * Managed identities eliminate the need for you to manage credentials, including Shared Access Signature (SAS) tokens. 
>
> * Managed identities are a safer way to grant access to data without having credentials in your code.

## Private storage account access

 Private Azure storage account access and authentication support [managed identities for Azure resources](../../active-directory/managed-identities-azure-resources/overview.md). If you have an Azure storage account, protected by a Virtual Network (VNet) or firewall, Document Intelligence can't directly access your storage account data. However, once a managed identity is enabled, Document Intelligence can access your storage account using an assigned managed identity credential.

> [!NOTE]
>
> * If you intend to analyze your storage data with the [**Document Intelligence Sample Labeling tool (FOTT)**](https://fott-2-1.azurewebsites.net/), you must deploy the tool behind your VNet or firewall.
>
> * The  Analyze [**Receipt**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeReceiptAsync), [**Business Card**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync), [**Invoice**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291), [**ID document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5f74a7738978e467c5fb8707), and [**Custom Form**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) APIs can extract data from a single document by posting requests as raw binary content. In these scenarios, there is no requirement for a managed identity credential.

## Prerequisites

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Document Intelligence**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or [**Azure AI services**](https://portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal. For detailed steps, _see_ [Create a multi-service resource](../../ai-services/multi-service-resource.md?pivots=azportal).

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Document Intelligence resource. You also need to create containers to store and organize your blob data within your storage account.

  * If your storage account is behind a firewall, **you must enable the following configuration**: </br></br>

  * On your storage account page, select **Security + networking** → **Networking** from the left menu.
    :::image type="content" source="media/managed-identities/security-and-networking-node.png" alt-text="Screenshot of security + networking tab.":::

  * In the main window, select **Allow access from selected networks**.
  :::image type="content" source="media/managed-identities/firewalls-and-virtual-networks.png" alt-text="Screenshot of Selected networks radio button selected.":::

  * On the selected networks page, navigate to the **Exceptions** category and make certain that the  [**Allow Azure services on the trusted services list to access this storage account**](../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) checkbox is enabled.

    :::image type="content" source="media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot of allow trusted services checkbox, portal view":::
* A brief understanding of [**Azure role-based access control (Azure RBAC)**](../../role-based-access-control/role-assignments-portal.md) using the Azure portal.

## Managed identity assignments

There are two types of managed identity: **system-assigned** and **user-assigned**. Currently, Document Intelligence only supports system-assigned managed identity:

* A system-assigned managed identity is **enabled** directly on a service instance. It isn't enabled by default; you must go to your resource and update the identity setting.

* The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity is deleted as well.

In the following steps, we enable a system-assigned managed identity and grant Document Intelligence limited access to your Azure blob storage account.

## Enable a system-assigned managed identity

>[!IMPORTANT]
>
> To enable a system-assigned managed identity, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../role-based-access-control/built-in-roles.md#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your **Document Intelligence** resource page in the Azure portal.

1. In the left rail, Select **Identity** from the **Resource Management** list:

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot of resource management identity tab in the Azure portal.":::

1. In the main window, toggle the **System assigned Status** tab to **On**.

## Grant access to your storage account

You need to grant Document Intelligence access to your storage account before it can read blobs. Now that you've enabled Document Intelligence with a system-assigned managed identity, you can use Azure role-based access control (Azure RBAC), to give Document Intelligence access to Azure storage. The **Storage Blob Data Reader** role gives Document Intelligence (represented by the system-assigned managed identity) read and list access to the blob container and data.

1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot of enable system-assigned managed identity in Azure portal.":::

1. On the Azure role assignments page that opens, choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot of Azure role assignments page in the Azure portal.":::

    > [!NOTE]
    >
    > If you're unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or you get the permissions error, "you do not have permissions to add role assignment at this scope", check that you're currently signed in as a user with an assigned a role that has Microsoft.Authorization/roleAssignments/write permissions such as Owner or User Access Administrator at the Storage scope for the storage resource.

1. Next, you're going to assign a **Storage Blob Data Reader** role to your Document Intelligence service resource. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| **_Storage_**|
    |**Subscription**| **_The subscription associated with your storage resource_**.|
    |**Resource**| **_The name of your storage resource_**|
    |**Role** | **_Storage Blob Data Reader_**—allows for read access to Azure Storage blob containers and data.|

     :::image type="content" source="media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot of add role assignments page in the Azure portal.":::

1. After you've received the _Added Role assignment_ confirmation message, refresh the page to see the added role assignment.

    :::image type="content" source="media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot of Added role assignment confirmation pop-up message.":::

1. If you don't see the change right away, wait and try refreshing the page once more. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="media/managed-identities/assigned-roles-window.png" alt-text="Screenshot of Azure role assignments window.":::

 That's it! You've completed the steps to enable a system-assigned managed identity. With managed identity and Azure RBAC, you granted Document Intelligence specific access rights to your storage resource without having to manage credentials such as SAS tokens.

### Additional role assignment for Document Intelligence Studio

If you are going to use Document Intelligence Studio and your storage account is configured with network restriction such as firewall or virtual network, an additional role, **Storage Blob Data Contributor**, need to be assigned to your Document Intelligence service. Document Intelligence Studio requires this role to write blobs to your storage account when you perform Auto label, OCR upgrade, Human in the loop, or Project sharing operations.

## Next steps
> [!div class="nextstepaction"]
> [Configure secure access with managed identities and private endpoints](managed-identities-secured-access.md)
