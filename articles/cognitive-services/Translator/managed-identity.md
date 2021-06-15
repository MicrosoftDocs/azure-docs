---
title: Create and use managed identities in the Azure portal
titleSuffix: Azure Cognitive Services
description: Understand how to create and use managed identities in the Azure portal
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 06/15/2021
ms.author: lajanuar
---

# Create and use managed identities in the Azure portal (preview)

> [!IMPORTANT]
> * Assigning a role to a managed identity using the steps below is currently in preview. The preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features may not be supported or might have constrained capabilities.  
> * Managed identity for Translator is not available in the global region.

 Azure managed identities are service principals that create an Azure Active Directory (Azure AD) identity and specific permissions for Azure-managed resources. You can use managed identities to grant access to any resource that supports Azure AD authentication. To grant access, you assign a role to a managed identity using Azure role-based access control (Azure RBAC). There is no added cost to using managed identities in Azure.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or [**multi-service Cognitive Services**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) resource in the Azure portal assigned to a **non-global** region. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Translator resource. You'll create containers to store and organize your blob data within your storage account. If the account has a firewall, you must have the [exception for trusted Microsoft services](/azure/storage/common/storage-network-security?tabs=azure-portal#manage-exceptions) checkbox enabled.

    :::image type="content" source="media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view":::

* A high-level understanding of [**Azure role-based access control (Azure RBAC)**](/azure/role-based-access-control/role-assignments-portal) using the Azure portal.

## Managed Identity assignments

There are two types of managed identity assignments:

* A [**System-assigned**](#enable-a-system-assigned-managed-identity-in-the-azure-portal) managed identity is **enabled** directly on a service instance. Here, you'll enable the identity for Translator. It is not enabled by default; you have to go to your resource and update the identity setting. The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity will be deleted as well.

* A [**User-assigned**](#create-a-user-assigned-managed-identity-in-the-azure-portal) managed identity is **created** as a standalone Azure resource and assigned to one or more Azure service instances. Here you'll assign the identity to your storage account. A user-assigned identity is managed separately from the resources that use it and has an independent lifecycle.

## Enable a system-assigned managed identity in the Azure portal

>[!IMPORTANT]
>
> To enable a system-assigned managed identity, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](/azure/role-based-access-control/built-in-roles#owner) or [**User Access Administrator**](/azure/role-based-access-control/built-in-roles#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your **Translator** resource page in the Azure portal.

1. In the left rail, Select **Identity** from the **Resource Management** list:

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

1. In the main window, toggle the **System assigned Status** tab to **On**.

1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. An Azure role assignments page will open. Choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

>[!NOTE]
>
> If you are unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or you get the permissions error, "you do not have permissions to add role assignment at this scope", check that you are currently signed in as a user with an assigned a role that has Microsoft.Authorization/roleAssignments/write permissions such as Owner or User Access Administrator at the Storage scope for the storage resource.

5. In the **Add role assignment** pop-up window complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| ***Storage***|
    |**Subscription**| ***The subscription associated with your storage resource***.|
    |**Resource**| ***The name of your storage resource***|
    |**Role** | ***Storage Blob Data Reader***|

     :::image type="content" source="media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot: add role assignments page in the Azure portal.":::

You have completed the steps to enable a service-assigned managed identity. With this identity credential, you can grant specific access rights to a single Azure service. If you need to assign a managed identity to  multiple Azure services, you need to create a user-assigned managed identity.

## Create a user-assigned managed identity in the Azure portal

>[!IMPORTANT]
>
 > * To enable a user-assigned managed identity you need Microsoft.Authorization/roleAssignments/write permissions, such as [**Owner**](/azure/role-based-access-control/built-in-roles#owner), [**User Access Administrator**](/azure/role-based-access-control/built-in-roles#user-access-administrator), or [**Managed Identity Contributor**](/azure/role-based-access-control/built-in-roles#managed-identity-contributor).

### Create a Managed Identity resource

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. In the search box, type **Managed Identities** and under **Services** select **Managed Identities**.

1. On the Managed Identities page, select the **&plus; Create** tab or the **Create managed identity** button.

    :::image type="content" source="media/managed-identities/create-managed-identity-in-portal.png" alt-text="Screenshot: create Managed Identities page in the Azure portal.":::

4. On the **Create User Assigned Managed Identity** page complete the fields as follows and select **Review &plus; create**:

    | Field | Value|
    |------|--------|
    |**Subscription**| ***The subscription associated with your storage resource***.|
    |**Resource group**| ***Choose an existing resource group or select Create new to create a new resource group***.
    | **Region**| ***Choose the same region where your Translator resource and Azure blob storage account are deployed.***.|
    |**Name**| ***Choose a name for your user-assigned managed identity***.|

5. Select **Review &plus; create**.

6. If you agree with the selections and entries that you have made, select **Create**.

    :::image type="content" source="media/managed-identities/create-user-managed-identity-in-portal.png" alt-text="Screenshot: create a user-assigned managed identity resource in the Azure portal":::

#### Assign a role to your user-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your storage account page.

1. From the left rail, choose **Access Control (IAM)** and then select **&plus;  Add** from the main window.

    :::image type="content" source="media/managed-identities/access-control-iam-window.png" alt-text="Screenshot: the access control window in the portal.":::

1. Select **Add role assignment** from the drop-down window.

1. In the pop-up window, complete the following fields and select **Save**

    | Field | Value |
    |------|--------|
    |**Role**| ***Storage Blob Data Contributor***|
    |**Assign access to**|***User assigned managed identity***|
    |**Subscription**| ***The subscription associated with your storage resource***|
    |**Select**|***Enter your preferred user-assigned identity.***|

    :::image type="content" source="media/managed-identities/add-role-assignment-pop-up.png" alt-text="Screenshot: the add role assignment pop-up window fields.":::

### Assign a user-assigned managed identity to a resource

1. Once you have created your user-assigned identity and assigned it the **Storage Blob Data Reader** role, navigate to your Translator resource page in the Azure portal.

1. In the left rail, Select **Identity** from the Resource Management list:

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in Azure portal.":::

1. In the main window, choose the **User assigned** tab then select **&plus; Add**

    :::image type="content" source="media/managed-identities/select-user-assigned-managed-identity-in-portal.png" alt-text="Screenshot: select user-assigned managed identity in the Azure portal.":::

1. In the pop-up window, complete the following fields and select **Add**:

    | Field | Value |
    |------|--------|
    |**Subscription** | ***The subscription associated with your storage resource*** |
    | **User assigned managed identities** | ***Select the same user-assigned managed identity resource that was assigned the Storage Blob Data Contributor role in the [assign a role to your user-assigned managed identity](#assign-a-role-to-your-user-assigned-managed-identity).***

 That's it! You've learned how to implement system-assigned and user-assigned managed identities for your Translator and Azure storage resources.

## Learn more about  managed identities

> [!div class="nextstepaction"]
> [Managed identities for Azure resources frequently asked questions - Azure AD](/azure/active-directory/managed-identities-azure-resources/managed-identities-faq)