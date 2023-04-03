---
title: Create and use managed identities for Document Translation
titleSuffix: Azure Cognitive Services
description: Understand how to create and use managed identities in the Azure portal
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: how-to
ms.date: 03/28/2023
ms.author: lajanuar
---

# Managed identities for Document Translation

Managed identities for Azure resources are service principals that create an Azure Active Directory (Azure AD) identity and specific permissions for Azure managed resources. Managed identities are a safer way to grant access to data compared to SAS URLs.

   :::image type="content" source="../media/managed-identity-rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

* You can use managed identities to grant access to any resource that supports Azure AD authentication, including your own applications. Using managed identities replaces the requirement for you to include shared access signature tokens (SAS) with your [source and target URLs](#post-request-body).

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

* **If your storage account is behind a firewall, you must enable the following configuration**:
    1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
    1. Select the Storage account.
    1. In the **Security + networking** group in the left pane, select **Networking**.
    1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses**.

          :::image type="content" source="../../media/managed-identities/firewalls-and-virtual-networks.png" alt-text="Screenshot: Selected networks radio button selected.":::

    1. Deselect all check boxes.
    1. Make sure **Microsoft network routing** is selected.
    1. Under the **Resource instances** section, select **Microsoft.CognitiveServices/accounts** as the resource type and select your Translator resource as the instance name.
    1. Make certain that the **Allow Azure services on the trusted services list to access this storage account** box is checked. For more information about managing exceptions, _see_ [Configure Azure Storage firewalls and virtual networks](../../../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions).

        :::image type="content" source="../../media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view.":::

    1. Select **Save**.

        > [!NOTE]
        > It may take up to 5 min for the network changes to propagate.

    Although by now the network access is permitted, the Translator resource can't yet access the data in the Storage account. You need to [assign a specific access role](#grant-storage-account-access-for-your-translator-resource) for Translator resource managed identity.

## Managed identity assignments

There are two types of managed identities: **system-assigned** and **user-assigned**.  Currently, Document Translation supports **system-assigned managed identity**:

* A system-assigned managed identity is **enabled** directly on a service instance. It isn't enabled by default; you must go to your resource and update the identity setting.

* The system-assigned managed identity is tied to your resource throughout its lifecycle. If you delete your resource, the managed identity is deleted as well.

In the following steps, we enable a system-assigned managed identity and grant your Translator resource limited access to your Azure blob storage account.

## Enable a system-assigned managed identity

You must grant the Translator resource access to your storage account before it can create, read, or delete blobs. Once you enabled the Translator resource with a system-assigned managed identity, you can use Azure role-based access control (`Azure RBAC`), to give Translator access to your Azure storage containers.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Within the **System assigned** tab, turn on the **Status** toggle.

    :::image type="content" source="../../media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

    > [!IMPORTANT]
    > User assigned managed identity won't meet requirements for the batch transcription storage account scenario. Be sure to enable system assigned managed identity.

1. Select **Save**.

## Grant storage account access for your Translator resource

> [!IMPORTANT]
> To assign a system-assigned managed identity role, you need **Microsoft.Authorization/roleAssignments/write** permissions, such as [**Owner**](../../../../role-based-access-control/built-in-roles.md#owner) or [**User Access Administrator**](../../../../role-based-access-control/built-in-roles.md#user-access-administrator) at the storage scope for the storage resource.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="../../media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. On the Azure role assignments page that opened, choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="../../media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

1. Next, you assign a **Storage Blob Data Contributor** role to your Translator service resource. The **Storage Blob Data Contributor** role gives Translator (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| **_Storage_**.|
    |**Subscription**| **_The subscription associated with your storage resource_**.|
    |**Resource**| **_The name of your storage resource_**.|
    |**Role** | **_Storage Blob Data Contributor_**.|

     :::image type="content" source="../../media/managed-identities/add-role-assignment-window.png" alt-text="Screenshot: add role assignments page in the Azure portal.":::

1. After the _Added Role assignment_ confirmation message appears, refresh the page to see the added role assignment.

    :::image type="content" source="../../media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the new role assignment right away, wait and try refreshing the page again. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

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

* The request URL is POST `https://<NAME-OF-YOUR-RESOURCE>.cognitiveservices.azure.com/translator/text/batch/v1.0/batches`.
* The request body is a JSON object named `inputs`.
* The `inputs` object contains both  `sourceURL` and `targetURL` container addresses for your source and target language pairs. With system assigned managed identity, you use a plain Storage Account URL (no SAS or other additions). The format is `https://<storage_account_name>.blob.core.windows.net/<container_name>`.
* The `prefix` and `suffix` fields (optional) are used to filter documents in the container including folders.
* A value for the  `glossaries`  field (optional) is applied when the document is being translated.
* The `targetUrl` for each target language must be unique.

> [!IMPORTANT]
> If a file with the same name already exists in the destination, the job will fail. When using managed identities, don't include a SAS token URL with your HTTP requests. If you do so, your requests will fail.

<!-- markdownlint-disable MD024 -->
### Translate all documents in a container

This sample request body references a source container for all documents to be translated to a target language.

For more information, _see_ [request parameters](#post-request-body).

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://<storage_account_name>.blob.core.windows.net/<source_container_name>"
            },
            "targets": [
                {
                    "targetUrl": "https://<storage_account_name>.blob.core.windows.net/<target_container_name>"
                    "language": "fr"
                }
            ]
        }
    ]
}
```

### Translate a specific document in a container

This sample request body references a single source document to be translated into two target languages.

> [!IMPORTANT]
> In addition to the request parameters [noted previously](#post-request-body), you must include `"storageType": "File"`. Otherwise the source URL is assumed to be at the container level.

```json
{
    "inputs": [
        {
            "storageType": "File",
            "source": {
                "sourceUrl": "https://<storage_account_name>.blob.core.windows.net/<source_container_name>/source-english.docx"
            },
            "targets": [
                {
                    "targetUrl": "https://<storage_account_name>.blob.core.windows.net/<target_container_name>/Target-Spanish.docx"
                    "language": "es"
                },
                {
                    "targetUrl": "https://<storage_account_name>.blob.core.windows.net/<target_container_name>/Target-German.docx",
                    "language": "de"
                }
            ]
        }
    ]
}
```

### Translate all documents in a container using a custom glossary

This sample request body references a source container for all documents to be translated to a target language using a glossary.

For more information, _see_ [request parameters](#post-request-body).

```json
{
    "inputs": [
        {
            "source": {
                "sourceUrl": "https://<storage_account_name>.blob.core.windows.net/<source_container_name>",
                "filter": {
                    "prefix": "myfolder/"
                }
            },
            "targets": [
                {
                    "targetUrl": "https://<storage_account_name>.blob.core.windows.net/<target_container_name>",
                    "language": "es",
                    "glossaries": [
                        {
                            "glossaryUrl": "https://<storage_account_name>.blob.core.windows.net/<glossary_container_name>/en-es.xlf",
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

> [!div class="nextstepaction"]
> [Quickstart: Get started with Document Translation](../quickstarts/get-started-with-rest-api.md)

> [!div class="nextstepaction"]
> [Tutorial: Access Azure Storage from a web app using managed identities](../../../../app-service/scenario-secure-app-access-storage.md?bc=%2fazure%2fcognitive-services%2ftranslator%2fbreadcrumb%2ftoc.json&toc=%2fazure%2fcognitive-services%2ftranslator%2ftoc.json)
