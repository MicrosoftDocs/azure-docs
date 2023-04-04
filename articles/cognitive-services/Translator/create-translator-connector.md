---
title: "Tutorial: Create a Microsoft Translator V3 connector"
titleSuffix: Azure Cognitive Services
description: The Microsoft V3 connector enable your applications to translate text
author: laujan
manager: nitinme
ms.service: applied-ai-services
ms.subservice: forms-recognizer
ms.topic: tutorial
ms.date: 04/03/2023
ms.author: lajanuar
---

# Tutorial: Create a Microsoft Translator V3 connector

 In this tutorial, you learn how to create a Translator V3 connector that enables you to build workflows that support both text and document translation. The V3 connector connects your Translator instance to Microsoft Power Automate, Microsoft Power Apps, or Azure Logic to provide one or more prebuilt operations to use as steps in your workflow.

## Prerequisites for text and document translation

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource):

  **Complete the Translator project and instance details fields as follows:**

  1. **Subscription**. Select one of your available Azure subscriptions.

  1. **Resource Group**. You can create a new resource group or add your resource to a pre-existing resource group that shares the same lifecycle, permissions, and policies.

  1. **Resource Region**. Choose  a **geographic** region like **West US** (**not** the *Global* region).

  1. **Name**. Enter the name you have chosen for your resource. The name you choose must be unique within Azure.

  1. **Pricing tier**. Select **Standard S1** to try the service.

  1. Select **Review + Create**.

  1. Review the service terms and select **Create** to deploy your resource.

  1. After your new resource deploys, select **Go to resource** or navigate directly to your resource page.

  1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

  1. Copy and paste your key and endpoint URLs in a convenient location, such as *Microsoft Notepad*. Note that Text and document translation have different endpoint URLs.

   :::image type="content" source="media/keys-and-endpoint-resource.png" alt-text="Get key and endpoint.":::

* An [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM). You also need to [create containers](/azure/storage/blobs/storage-quickstart-blobs-portal?branch=main#create-a-container) in your Azure blob storage account for your source and target files:

  * **Source container**. This container is where you upload your files for translation (required).
  * **Target container**. This container is where your translated files are stored (required).

  * **If your storage account is behind a firewall, you must enable the following configuration**:
      1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
      1. Select the Storage account.
      1. In the **Security + networking** group in the left pane, select **Networking**.
      1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses**.

            :::image type="content" source="media/managed-identities/firewalls-and-virtual-networks.png" alt-text="Screenshot: Selected networks radio button selected.":::

      1. Deselect all check boxes.
      1. Make sure **Microsoft network routing** is selected.
      1. Under the **Resource instances** section, select **Microsoft.CognitiveServices/accounts** as the resource type and select your Translator resource as the instance name.
      1. Make certain that the **Allow Azure services on the trusted services list to access this storage account** box is checked. For more information about managing exceptions, _see_ [Configure Azure Storage firewalls and virtual networks](../../../../storage/common/storage-network-security.md?tabs=azure-portal#manage-exceptions).

          :::image type="content" source="../../media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view.":::

      1. Select **Save**. It may take up to 5 min for the network changes to propagate.

### Managed identity

 Before you can use the V3 connector's operations for document translations, You must grant the Translator resource access to your storage account. In this step, you create a system-assigned managed identity for your Translator resource and grant that identity specific permissions to access your Azure storage account:

  :::image type="content" source="document-translation/media/managed-identity-rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Within the **System assigned** tab, turn on the **Status** toggle.
1. Select **Save**.

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

### Role-based access control (RBAC)

Next,  you assign a Storage Blob Data Contributor role to the managed identity at the storage scope for your storage resource.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. On the Azure role assignments page that opened, choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

1. Next, you assign a **Storage Blob Data Contributor** role to your Translator service resource. The **Storage Blob Data Contributor** role gives Translator (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| ***Storage***.|
    |**Subscription**| ***The subscription associated with your storage resource***.|
    |**Resource**| ***The name of your storage resource***.
    |**Role** | ***Storage Blob Data Contributor***.|

1. After the *Added Role assignment* confirmation message appears, refresh the page to see the added role assignment.

    :::image type="content" source="media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the new role assignment right away, wait and try refreshing the page again. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="media/managed-identities/assigned-roles-window.png" alt-text="Screenshot: Azure role assignments window.":::

### Get file content from


