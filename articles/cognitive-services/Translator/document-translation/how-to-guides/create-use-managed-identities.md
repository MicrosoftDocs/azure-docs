---
title: Create and use managed identities for Document Translation
titleSuffix: Azure Cognitive Services
description: Understand how to create and use managed identities in the Azure portal
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 03/24/2023
ms.author: lajanuar
---

# Managed identities for Document Translation

  Managed identities for Azure resources are service principals that create an Azure Active Directory (Azure AD) identity and specific permissions for Azure managed resources. Managed identities are a safer way to grant access to data without the need to include SAS tokens with your HTTP requests.

   :::image type="content" source="../media/managed-identity-rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

* You can use managed identities to grant access to any resource that supports Azure AD authentication, including your own applications.

* To grant access to an Azure resource, assign an Azure role to a managed identity using [Azure role-based access control (`Azure RBAC`)](../../../../role-based-access-control/overview.md).

* There's no added cost to use managed identities in Azure.

> [!IMPORTANT]
>
> * When using managed identities, don't include a SAS token URL with your HTTP requests—your requests will fail. Using managed identities replaces the requirement for you to include shared access signature tokens (SAS) with your [source and target URLs](#post-request-body).
>
> * To use managed identities for Document Translation operations, you must [create your Translator resource](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) in a specific geographic Azure region such as **East US**. If your Translator resource region is set to **Global**, then you can't use managed identity for Document Translation. You can still use [Shared Access Signature tokens (SAS)](create-sas-tokens.md) for Document Translation.
>
> * Document Translation is **only** available in the S1 Standard Service Plan (Pay-as-you-go) or in the D3 Volume Discount Plan. _See_ [Cognitive Services pricing—Translator](https://azure.microsoft.com/pricing/details/cognitive-services/translator/).
>

## Prerequisites

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/)—if you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (not a multi-service Cognitive Services) resource assigned to a **geographical** region such as **West US**. For detailed steps, _see_ [Create a Cognitive Services resource using the Azure portal](../../../cognitive-services-apis-create-account.md?tabs=multiservice%2cwindows).

* A brief understanding of [**Azure role-based access control (`Azure RBAC`)**](../../../../role-based-access-control/role-assignments-portal.md) using the Azure portal.

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) in the same region as your Translator resource. You also need to create containers to store and organize your blob data within your storage account.

* **If your storage account is behind a firewall, you must enable the following configuration**: </br>

  * On your storage account page, select **Security + networking** → **Networking** from the left menu.
    :::image type="content" source="../../media/managed-identities/security-and-networking-node.png" alt-text="Screenshot: security + networking tab.":::

  * In the main window, select **Allow access from Selected networks**.
  :::image type="content" source="../../media/managed-identities/firewalls-and-virtual-networks.png" alt-text="Screenshot: Selected networks radio button selected.":::

  * On the selected networks page, navigate to the **Exceptions** category and make certain that the  [**Allow Azure services on the trusted services list to access this storage account**](../../../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions) checkbox is enabled.

    :::image type="content" source="../../media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view":::

## Managed identity assignments

There are two types of managed identities: **system-assigned** and **user-assigned**.  Currently, Document Translation supports **system-assigned managed identity**:

* A system-assigned managed identity is **enabled** directly on a service instance. It isn't enabled by default; you must go to your resource and update the identity setting.

* The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity is deleted as well.

In the following steps, we enable a system-assigned managed identity and grant your Translator resource limited access to your Azure blob storage account.

## Enable a system-assigned managed identity

>[!IMPORTANT]
>
> To enable a system-assigned managed identity, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](../../../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../../../role-based-access-control/built-in-roles.md#user-access-administrator). You can specify a scope at four levels: management group, subscription, resource group, or resource.

1. Sign in to the [Azure portal](https://portal.azure.com) using an account associated with your Azure subscription.

1. Navigate to your **Translator** resource page in the Azure portal.

1. In the left rail, select **Identity** from the **Resource Management** list:

    :::image type="content" source="../../media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

1. In the main window, toggle the **System assigned Status** tab to **On**.

## Grant access to your storage account

You need to grant Translator access to your storage account before it can create, read, or delete blobs. Once you've enabled Translator with a system-assigned managed identity, you can use Azure role-based access control (`Azure RBAC`), to give Translator access to your Azure storage containers.

The **Storage Blob Data Contributor** role gives Translator (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data.

1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="../../media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. On the Azure role assignments page that opened, choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="../../media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

    >[!NOTE]
    >
    > If you are unable to assign a role in the Azure portal because the Add > Add role assignment option is disabled or get the permissions error, "you do not have permissions to add role assignment at this scope", check that you are currently signed in as a user with an assigned a role that has Microsoft.Authorization/roleAssignments/write permissions such as [**Owner**](../../../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../../../role-based-access-control/built-in-roles.md#user-access-administrator) at the storage scope for the storage resource.

1. Next, you're going to assign a **Storage Blob Data Contributor** role to your Translator service resource. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| **_Storage_**.|
    |**Subscription**| **_The subscription associated with your storage resource_**.|
    |**Resource**| **_The name of your storage resource_**.|
    |**Role** | **_Storage Blob Data Contributor_**.|

     :::image type="content" source="../../media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot: add role assignments page in the Azure portal.":::

1. After you've received the _Added Role assignment_ confirmation message, refresh the page to see the added role assignment.

    :::image type="content" source="../../media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the change right away, wait and try refreshing the page once more. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="../../media/managed-identities/assigned-roles-window.png" alt-text="Screenshot: Azure role assignments window.":::

## HTTP requests

* A batch Document Translation request is submitted to your Translator service endpoint via a POST request.

* With managed identity and `Azure RBAC`, you no longer need to include SAS URLs.

* If successful, the POST method returns a `202 Accepted` response code and the service creates a batch request.

* The translated documents appear in your target container.

### Headers

The following headers are included with each Document Translation API request:

|HTTP header|Description|
|---|--|
|Ocp-Apim-Subscription-Key|**Required**: The value is the Azure key for your Translator or Cognitive Services resource.|
|Content-Type|**Required**: Specifies the content type of the payload. Accepted values are application/json or charset=UTF-8.|

### POST request body

* The request URL is POST `https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0/batches`

* The request body is a JSON object named `inputs`.
* The `inputs` object contains both  `sourceURL` and `targetURL`  container addresses for your source and target language pairs
* The `prefix` and `suffix` fields (optional) are used to filter documents in the container including folders.
* A value for the  `glossaries`  field (optional) is applied when the document is being translated.
* The `targetUrl` for each target language must be unique.

>[!NOTE]
> If a file with the same name already exists in the destination, the job will fail. When using managed identities, don't include a SAS token URL with your HTTP requests. Otherwise your requests will fail.

<!-- markdownlint-disable MD024 -->
### Translate all documents in a container

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en"
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target-fr"
                    "language": "fr"
                }
            ]
        }
    ]
}
```

### Translate a specific document in a container

* **Required**: "storageType": "File"
* This sample request returns a single document translated into two target languages:

```json
{
    "inputs": [
        {
            "storageType": "File",
            "source": {
                "sourceUrl": "https://my.blob.core.windows.net/source-en/source-english.docx"
            },
            "targets": [
                {
                    "targetUrl": "https://my.blob.core.windows.net/target-es/Target-Spanish.docx"
                    "language": "es"
                },
                {
                    "targetUrl": "https://my.blob.core.windows.net/target-de/Target-German.docx",
                    "language": "de"
                }
            ]
        }
    ]
}
```

### Translate documents using a custom glossary

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://myblob.blob.core.windows.net/source",
                "filter": {
                    "prefix": "myfolder/"
                }
            },
            "targets": [
                {
                    "targetUrl": "https://myblob.blob.core.windows.net/target",
                    "language": "es",
                    "glossaries": [
                        {
                            "glossaryUrl": "https:// myblob.blob.core.windows.net/glossary/en-es.xlf",
                            "format": "xliff"
                        }
                    ]
                }
            ]
        }
    ]
}
```

 Great! You've learned how to enable and use a system-assigned managed identity. With managed identity for Azure Resources and `Azure RBAC`, you granted Translator specific access rights to your storage resource without including SAS tokens with your HTTP requests.

## Next steps

**Quickstart**

> [!div class="nextstepaction"]
> [Get started with Document Translation](../quickstarts/get-started-with-rest-api.md)

**Tutorial**

> [!div class="nextstepaction"]
> [Access Azure Storage from a web app using managed identities](../../../../app-service/scenario-secure-app-access-storage.md?bc=%2fazure%2fcognitive-services%2ftranslator%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fcognitive-services%2ftranslator%2ftoc.json)
