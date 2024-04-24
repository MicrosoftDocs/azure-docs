---
title: Managed identities for storage blobs
description: Create managed identities for containers and blobs with Azure portal.
ms.service: azure-ai-language
ms.topic: how-to
manager: nitinme
ms.author: lajanuar
author: laujan
ms.date: 01/31/2024
---


# Managed identities for Language resources

Managed identities for Azure resources are service principals that create a Microsoft Entra identity and specific permissions for Azure managed resources. Managed identities are a safer way to grant access to storage data and replace the requirement for you to include shared access signature tokens (SAS) with your [source and target container URLs](use-native-documents.md#create-azure-blob-storage-containers).

   :::image type="content" source="media/managed-identity-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

* You can use managed identities to grant access to any resource that supports Microsoft Entra authentication, including your own applications.

* To grant access to an Azure resource, assign an Azure role to a managed identity using [Azure role-based access control (`Azure RBAC`)](/azure/role-based-access-control/overview).

* There's no added cost to use managed identities in Azure.

> [!IMPORTANT]
>
> * When using managed identities, don't include a SAS token URL with your HTTP requests—your requests will fail. Using managed identities replaces the requirement for you to include shared access signature tokens (SAS) with your [source and target container URLs](use-native-documents.md#create-azure-blob-storage-containers).
>
> * To use managed identities for Language operations, you must [create your Language resource](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) in a specific geographic Azure region such as **East US**. If your Language resource region is set to **Global**, then you can't use managed identity authentication. You can, however, still use [Shared Access Signature tokens (SAS)](shared-access-signatures.md).
>

## Prerequisites

To get started, you need the following resources:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/). If you don't have one, you can [create a free account](https://azure.microsoft.com/free/).

* An [**single-service Azure AI Language**](https://ms.portal.azure.com/#create/Microsoft.CognitiveServicesTextAnalytics) resource created in a regional location.

* A brief understanding of [**Azure role-based access control (`Azure RBAC`)**](/azure/role-based-access-control/role-assignments-portal) using the Azure portal.

* An [**Azure Blob Storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Language resource. You also need to create containers to store and organize your blob data within your storage account.

* **If your storage account is behind a firewall, you must enable the following configuration**:
    1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
    1. Select your Storage account.
    1. In the **Security + networking** group in the left pane, select **Networking**.
    1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses**.

          :::image type="content" source="media/firewalls-and-virtual-networks.png" alt-text="Screenshot that shows the elected networks radio button selected.":::

    1. Deselect all check boxes.
    1. Make sure **Microsoft network routing** is selected.
    1. Under the **Resource instances** section, select **Microsoft.CognitiveServices/accounts** as the resource type and select your Language resource as the instance name.
    1. Make certain that the **Allow Azure services on the trusted services list to access this storage account** box is checked. For more information about managing exceptions, _see_ [Configure Azure Storage firewalls and virtual networks](/azure/storage/common/storage-network-security?tabs=azure-portal#manage-exceptions).

        :::image type="content" source="media/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot that shows the allow trusted services checkbox in the Azure portal.":::

    1. Select **Save**.

        > [!NOTE]
        > It may take up to 5 minutes for the network changes to propagate.

    Although network access is now permitted, your Language resource is still unable to access the data in your Storage account. You need to [create a managed identity](#managed-identity-assignments) for and [assign a specific access role](#enable-a-system-assigned-managed-identity) to your Language resource.

## Managed identity assignments

There are two types of managed identities: **system-assigned** and **user-assigned**.  Currently, Document Translation supports **system-assigned managed identity**:

* A system-assigned managed identity is **enabled** directly on a service instance. It isn't enabled by default; you must go to your resource and update the identity setting.

* The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity is deleted as well.

In the following steps, we enable a system-assigned managed identity and grant your Language resource limited access to your Azure Blob Storage account.

## Enable a system-assigned managed identity

You must grant the Language resource access to your storage account before it can create, read, or delete blobs. Once you enabled the Language resource with a system-assigned managed identity, you can use Azure role-based access control (`Azure RBAC`), to give Language features access to your Azure storage containers.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select your Language resource.
1. In the **Resource Management** group in the left pane, select **Identity**. If your resource was created in the global region, the **Identity** tab isn't visible. You can still use [Shared Access Signature tokens (SAS)](shared-access-signatures.md) for authentication.
1. Within the **System assigned** tab, turn on the **Status** toggle.

    :::image type="content" source="media/resource-management-identity-tab.png" alt-text="Screenshot that shows the resource management identity tab in the Azure portal.":::

    > [!IMPORTANT]
    > User assigned managed identities don't meet the requirements for the batch processing storage account scenario. Be sure to enable system assigned managed identity.

1. Select **Save**.

## Grant storage account access for your Language resource

> [!IMPORTANT]
> To assign a system-assigned managed identity role, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](/azure/role-based-access-control/built-in-roles#owner) or [**User Access Administrator**](/azure/role-based-access-control/built-in-roles#user-access-administrator) at the storage scope for the storage resource.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select your Language resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="media/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot that shows the enable system-assigned managed identity in Azure portal.":::

1. On the Azure role assignments page that opened, choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="media/azure-role-assignments-page-portal.png" alt-text="Screenshot that shows the Azure role assignments page in the Azure portal.":::

1. Next, assign a **Storage Blob Data Contributor** role to your Language service resource. The **Storage Blob Data Contributor** role gives Language (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| **_Storage_**.|
    |**Subscription**| **_The subscription associated with your storage resource_**.|
    |**Resource**| **_The name of your storage resource_**.|
    |**Role** | **_Storage Blob Data Contributor_**.|

     :::image type="content" source="media/add-role-assignment-window.png" alt-text="Screenshot that shows the role assignments page in the Azure portal.":::

1. After the _Added Role assignment_ confirmation message appears, refresh the page to see the added role assignment.

    :::image type="content" source="media/add-role-assignment-confirmation.png" alt-text="Screenshot that shows the added role assignment confirmation pop-up message.":::

1. If you don't see the new role assignment right away, wait and try refreshing the page again. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

## HTTP requests

* A native document Language service operation request is submitted to your Language service endpoint via a POST request.

* With managed identity and `Azure RBAC`, you no longer need to include SAS URLs.

* If successful, the POST method returns a `202 Accepted` response code and the service creates a request.

* The processed documents appear in your target container.

## Next steps

> [!div class="nextstepaction"]
> [Get started with native document support](use-native-documents.md#include-native-documents-with-an-http-request)
