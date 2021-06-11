---
title: Managed Identities and Bring Your Own Storage (BYOS)
titleSuffix: Azure Applied AI Services
description: Understand how to use managed identities with BYOS accounts
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: how-to
ms.date: 06/10/2021
ms.author: lajanuar
---

# Managed Identities and Bring Your Own Storage (Preview) 

> [!IMPORTANT]
> Assigning a role to a managed identity using the steps below is currently in preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.

If you have a private Azure storage account protected by a Virtual Network (VNet) or firewall, Form Recognizer cannot access your account to read and list blob content. However, you can create a Bring Your Own Storage (BYOS) account which allows direct access to storage content using an authorized Managed Identity. With a BYOS, you upload your form, OCR, and layout files to your own storage account and you control policies and network access.

> [!NOTE]
>
> * The [**Train Custom Model**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/TrainCustomModelAsync) API retrieves your training data from an Azure Storage blob container. If you have a private storage account, a Managed Identity credential **is required** for this operation.
>
> * The **Analyze** [**Receipt**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeReceiptAsync), [**Business Card**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeBusinessCardAsync), [**Invoice**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5ed8c9843c2794cbb1a96291), [**Identity Document**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/5f74a7738978e467c5fb8707), and [**Custom Form**](https://westus.dev.cognitive.microsoft.com/docs/services/form-recognizer-api-v2-1/operations/AnalyzeWithCustomForm) APIs can extract data from a single document by posting requests as raw binary content. In those scenarios, there is no requirement for Managed Identity credential. But, if you choose to store your documents in an Azure Storage account and provide the URL in your POST request, a Managed Identity credential **is required**.

## Prerequisites

To get started, you'll need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**Form Recognizer**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) or [**Cognitive Services**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesAllInOne) For more details, _see_ [Create a Cognitive Services resource using the Azure portal](/azure/cognitive-services/cognitive-services-apis-create-account?tabs=multiservice%2Cwindows).

* An [**Azure blob storage account**](https://ms.portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Form Recognizer resource. You will create containers to store and organize your blob data within your storage account. If the account has a firewall, you must enable the [exception for trusted Microsoft services enabled](/azure/storage/common/storage-network-security?tabs=azure-portal#manage-exceptions)

    :::image type="content" source="media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Allow trusted services checkbox, portal view":::

* A high-level understanding of [**Azure role-based access control (Azure RBAC)**](azure/role-based-access-control/role-assignments-portal) using the Azure portal.

## Managed Identity assignments

There are two types of managed identity assignments:

* A [**System-assigned**](#system-assigned-managed-identity) managed identity is **enabled** directly on a service instance, e.g., Form Recognizer. It is not enabled by default; you have to go to your resource and update the identity setting. The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity wil be deleted as well.

* [**User-assigned**](#user-assigned-managed-identity) managed identity is **created** as a standalone Azure resource and assigned to one or more Azure service instance, i.e., Form Recognizer. A user-assigned identity is managed separately from the resources that use it and has an independent lifecycle.

### Enable a system-assigned managed identity in the Azure Portal

>[!IMPORTANT]
>
> To enable a system-assigned managed identity you need Microsoft.Authorization/roleAssignments/write permissions, such as [**Owner**](/azure/role-based-access-control/built-in-roles#owner) or [**User Access Administrator**](/azure/role-based-access-control/built-in-roles#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription to enable a system-assigned managed identity.

1. Navigate to your Form Recognizer resource page in the Azure Portal.

1. In the left rail, Select **Identity** from the the Resource Management list:

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Resource management identity tab in Azure Portal.":::

1. In the main window, select the **System assigned** tab →  toggle **Status** to **On** → under *Permissions* select **Azure role assignments**:

    :::image type="content" source="media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Enable system-assigned managed identity in Azure Portal.":::

1. An Azure role assignments page will open. Select your subscription from the drop-down menu → select &plus; Add role assignment.

    :::image type="content" source="media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Azure role assignments page in the Azure Portal.":::

>[!NOTE]
>
>If you are unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or because you get the permissions error "The client with object id does not have authorization to perform action", check that you are currently signed in with a user that is assigned a role that has the Microsoft.Authorization/roleAssignments/write permission such as Owner or User Access Administrator at the Storage scope for the storage resource where you are assigning the role.

5. In the **Add role assignment** pop-up window complete the fields as follows and select **Save**:

| Field | Value|
|------|--------|
|**Scope**| ***Storage***|
|**Subscription**| ***The subscription associated with your storage resource***|
|**Resource**| ***The name of your storage resource**|
|**Role** | ***Storage Blob Data Reader***|

 :::image type="content" source="media/managed-identities/add-role-assignment-window.png" alt-text="Azure role assignments page in the Azure Portal.":::

### User-assigned managed identity

>[!IMPORTANT]
>
 > To enable a user-assigned managed identity you need Microsoft.Authorization/roleAssignments/write permissions, such as [**Owner**](/azure/role-based-access-control/built-in-roles#owner), [**User Access Administrator**](/azure/role-based-access-control/built-in-roles#user-access-administrator), or [**Managed Identity Contributor**](/azure/role-based-access-control/built-in-roles#managed-identity-contributor).

To use a user-assigned managed identity, you must first **create** the managed identity and then **assign** it to your resource.

#### Create user-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription to create your user-assigned managed identity.

1. In the search box, type *Managed Identities*, and under **Services**, select **Managed Identities**.

1. On the Managed Identities page select the &plus; **Create** or the **Create managed identity** button.

:::image type="content" source="media/managed-identities/create-managed-identity-in-portal.png" alt-text="Create Managed Identities page in the the Azure portal.":::

1. On the **Create User Assigned Managed Identity** page complete the fields as follows and select **Review &plus; create**:

| Field | Value|
|------|--------|
|**Subscription**| ***The subscription associated with your storage resource***|
|**Resource group**| ***Choose an existing resource group or select Create new to create a new resource group***.
| **Region**| ***Choose a region to deploy the user-assigned managed identity***.|
|**Name**| ***Choose a name for your user-assigned managed identity***.|

1. Select **Review &plus; create.
1. If you agree with the selections and entries that you have made, select **Create**.

:::image type="content" source="media/managed-identities/create-user-managed-identity-in-portal.png" alt-text="Create a user-assigned managed identity resource in the Azure portal":::

#### Assign your user-assigned managed identity

1. Once you have created your user-assigned identity, navigate to Form Recognizer resource page in the Azure portal.

1. In the left rail, Select **Identity** from the the Resource Management list:

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Resource management identity tab in Azure Portal.":::

1. In the main window, select the **User assigned** tab → select &plus;  **Add**

    :::image type="content" source="media/managed-identities/select-user-assigned-managed-identity-in-portal.png" alt-text="Select user-assigned managed identity in the Azure portal.":::

1. In the pop-up window, complete the following fields and select **Add**:

| Field | Value |
|------|--------|
|**Subscription** | ***The subscription associated with your storage resource*** |
 | **User assigned managed identities** | ***Select a user-assigned managed identity resource that you created [above](#create-user-assigned-managed-identity).***|

#### Assign a role to your user-assigned managed identity

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with the Azure subscription to list the user-assigned managed identities.

1. From the left rail, select **Access Control (IAM)** from the left rail and select &plus;  **Add** from the main window.
 
:::image type="content" source="media/managed-identities/access-control-iam-window.png" alt-text="The access control window in the portal.":::

1. Select **Add role assignment** from the drop-down window.

1. In the pop-up window, complete the following fields and select **Save**

| Field | Value |
|------|--------|
|**Role**| ***Storage Blob Data Reader****|
|**Assign access to**|***User assigned managed identity***|
|**Subscription**| ***The subscription associated with your storage resource***|
|**Select**|*** Select your preferred user-assigned identity from the drop-down menu.***|

:::image type="content" source="media/managed-identities/add-role-assignment-pop-up.png" alt-text="The add role assignment pop-up window fields.":::

> [!NOTE]
>
>The RBAC can take a few minutes to propogate.

Congratulations. You have can now implement system-assigned and user-assigned managed identities for your Form Recognizer and Azure storage resources. 

> [!div class="nextstepaction"]
> [Train a custom model using the sample labeling tool](label-tool.md)