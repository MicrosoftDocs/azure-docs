---
title: "Tutorial: Use a Microsoft Translator V3 connector with Power Automate"
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

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD029 -->

# Tutorial: Configure a Microsoft Translator V3 connector

Text and document translation are cloud-based REST API features of the Azure Translator service. The text translation API enables quick and accurate source-to-target text translations in real time. The document translation API enables multiple and complex document translations while preserving original document structure and data format.

This tutorial, details how to configure a Translator V3 connector that supports both text and document translation. The V3 connector creates a connection between your Translator instance and Microsoft Power Automate enabling you to use one or more prebuilt operations as steps in your apps and workflows.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * Create a blob storage account with containers for your source and target files.
> * Set-up a managed identity with role-based access control (RBAC).
> * Translate and transliterate text using your connector.
> * Translate documents in your Azure storage account.
> * Translate documents on your SharePoint site.

## Prerequisites

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

### Setup Azure storage

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

### Create a managed identity with RBAC

 Before you can use the V3 connector's operations for document translations, You must grant the Translator resource access to your storage account. In this step, you create a system-assigned managed identity for your Translator resource and grant that identity specific permissions to access your Azure storage account:

  :::image type="content" source="document-translation/media/managed-identity-rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Within the **System assigned** tab, turn on the **Status** toggle.
1. Select **Save**.

    :::image type="content" source="media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

Next, assign a Storage Blob Data Contributor role to the managed identity at the storage scope for your storage resource.

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

Now that completed the prerequisites and initial setup, let's get started using the V3 connector to create a flow:

1. Sign in to [Power Automate](https://powerautomate.microsoft.com/).

1. Select **Create** from the left sidebar menu.

1. Select **Instant cloud flow** from the main content area.

   :::image type="content" source="media/connectors/create-a-flow.png" alt-text="Screenshot showing how to create an instant cloud flow.":::

1. In the popup window, name your flow, choose **Manually trigger a flow**, and select **Create**.

  :::image type="content" source="media/connectors/select-manual-flow.png" alt-text="Screenshot showing how to select manually trigger a flow.":::

1. The first step for your instant flow appears on screen. Select **New step**.

  :::image type="content" source="media/connectors/add-new-step.png" alt-text="Screenshot of add new flow step page.":::

1. A **choose an operation** pop-up window appears. Enter Translator V3 in the **Search connectors and actions** search bar and select the **Microsoft Translator V3** icon.

   :::image type="content" source="media/connectors/choose-operation.png" alt-text="Screenshot showing the selection of Translator V3 as the next flow step.":::

Now, we're ready to select an action.

## Text translation

In this section, select a tab to create a flow for text translation or text transliteration.

#### [Translate text](#tab/translate)

1. Select the **Translate text** action.
1. Enter your Translator resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Your Translator resource keys are found under the  **Resource Management** section of the resource sidebar in the Azure portal. Enter one of your keys.

    :::image type="content" source="media/connectors/keys-endpoint-sidebar.png" alt-text="Screenshot showing keys and endpoint listed in the resource sidebar.":::

   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

> [!NOTE]
> After you've setup your connection, you won't be required to reenter your credentials for subsequent flows.

1. Next, the **Translate text** action window appears.
1. Select a **Source Language** from the dropdown menu or keep the default **Auto-detect** option.
1. Select a **Target Language** from the dropdown window.
1. Enter the **Body Text**.
1. Select **Save**.

   :::image type="content" source="media/connectors/translate-text-step.png" alt-text="Screenshot showing the translate text step.":::

#### [Transliterate text](#tab/transliterate)

1. Select the **Transliterate text** action.
1. Enter your Translator resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Your Translator resource keys are found under the  **Resource Management** section of the resource sidebar in the Azure portal. Enter one of your keys.

    :::image type="content" source="media/connectors/keys-endpoint-sidebar.png" alt-text="Screenshot showing keys and endpoint listed in the resource sidebar.":::

   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

1. Next the **Transliterate** action window appears.
1. **Language**. Select the language of the text that is to be converted.
1. **Source script**. Select the name of the input text script.
1. **Target script**. Select the name of transliterated text script.
1. Select **Save**.

   :::image type="content" source="media/connectors/transliterate-text-step.png" alt-text="Screenshot showing the transliterate text step.":::

---

Time to check our flow and view the translated text.

1. You should see a green bar at the top of the page indicating that **Your flow is ready to go.**.
1. Select Test from the upper-right corner of the page.
      :::image type="content" source="media/connectors/test-flow.png" alt-text="Screenshot showing the test icon/button.":::

1. Select **Manually** from the **Test Flow** side window and select **Test**

   :::image type="content" source="media/connectors/manually-test-flow.png" alt-text="Screenshot showing the manually test flow button.":::

1. The **Run flow** side window appears next. Select **Continue** and then Select **Run flow**.

      :::image type="content" source="media/connectors/run-flow.gif" alt-text="Screenshot showing the run-flow side window.":::

1. You should receive a "Your flow ran successfully" message and there will be a green checkmark next to each successful step.

   :::image type="content" source="media/connectors/successful-flow.png" alt-text="Screenshot of successful flow.":::

#### [Translate text](#tab/translate)

3. Select the **Translate text** step to view the translated text (output):

   :::image type="content" source="media/connectors/translated-text-output.png" alt-text="Screenshot of translated text output.":::

#### [Transliterate text](#tab/transliterate)

3. Select the **Transliterate** step to view the translated text (output):

   :::image type="content" source="media/connectors/transliterated-text-output.png" alt-text="Screenshot of transliterated text output.":::

> [!TIP]
>
> * Check on the status of your flow by selecting **My flows** tab on the navigation sidebar.
> * Edit or update your connection by selecting **Connections** under the **Data** tab on the navigation sidebar.

---

## Document translation

In this section, you'll learn to translate documents and get the status of the operation. Select a tab to translate documents located in your Azure blob storage or Microsoft SharePoint account.

#### [Azure blob storage](#tab/blob-storage)

1. Select the **Start document translation** action.
1. Enter your Translator resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Your Translator resource keys are found under the  **Resource Management** section of the resource sidebar in the Azure portal. Enter one of your keys. The Translator V3 connector requires managed identity for authentication. Managed identity isn't supported the global region. **Make certain that your Translator resource is assigned to a geographical region such as West US**.

    :::image type="content" source="media/connectors/keys-endpoint-sidebar.png" alt-text="Screenshot showing keys and endpoint listed in the resource sidebar.":::

   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

> [!NOTE]
> After you've setup your connection, you won't be required to reenter your credentials for subsequent flows.

1. Next, the **Start document translation** action window appears.
1. **Storage type of the input documents**. Select **File** or **Folder**.
1. Select a **Source Language** from the dropdown menu or keep the default **Auto-detect** option.
1. **Location of the source documents**. Enter the URL for your document(s) in the source document container.
1. **Location of the translated documents**. Enter the URL for your target document container.

   To find your source and target URLs:

   1. Navigate to your storage account in the Azure Portal.
   1. In the left sidebar, under  **Data storage** , select **Containers**.

      |c. Source| c. Target|
      |------|-------|
      |Select the checkbox next to the source container|Select the checkbox next to the target container.|
      | From the main window area, select a file or document for translation.| Select the ellipses located at the right, then choose **Properties**.|
      | The source URL is located at the top of the Properties list. Select the **Copy to Clipboard** icon.|The target URL is located at the top of the Properties list. Select the **Copy to Clipboard** icon.|
      | Navigate to your Power automate flow and paste the source URL in the **Location of the source documents** field.|Navigate to your Power automate flow and paste the target URL in the **Location of the translated documents** field.|

1. Choose a **Target Language** from the dropdown menu.

   :::image type="content" source="media/connectors/start-document-translation-window.png" alt-text="Screenshot of the Start document translation dialog window.":::

1. Select **New step**.

1. Enter Translator V3 in the search box and choose **Microsoft Translator V3**.
1. Select **Get documents status** (not Get document status).

   :::image type="content" source="media/connectors/get-documents-status-step.png" alt-text="Screenshot of the get documents status step.":::

1. Next, you are going to enter an expression to retrieve the operation ID value.

1. Select the operation ID field. A **Dynamic content** / **Expression** dropdown window appears.

1. Select the **Expression** tab and enter the following expression into the function field.:

   ```powerappsfl

     body('Start_document_translation').operationID

   ```

      :::image type="content" source="media/connectors/create-function-expression.png" alt-text="Screenshot showing function creation window.":::

1. Select **OK**. The function will appear in the **Operation ID** window. Select **Save**.

   :::image type="content" source="media/connectors/operation-id-function.png" alt-text="Screenshot showing the operation ID field with an expression function value.":::

---

Time to check our flow and document translation results. A green bar appears at the top of the page indicating that **Your flow is ready to go.**. Let's test it:

1. Select Test from the upper-right corner of the page.

      :::image type="content" source="media/connectors/test-flow.png" alt-text="Screenshot showing the test icon/button.":::

1. Select **Manually** from the **Test Flow** side window and select **Save & Test**

      :::image type="content" source="media/connectors/manually-test-flow.png" alt-text="Screenshot showing the manually test flow button.":::

1. The **Run flow** side window appears next. Select **Continue**, select **Run flow**. and then select **Done**.

      :::image type="content" source="media/connectors/run-flow.gif" alt-text="Screenshot showing the run-flow side window.":::

1. The "Your flow ran successfully" message appears and there will be a green checkmark next to each successful step.

   :::image type="content" source="media/connectors/successful-document-translation-flow.png" alt-text="Screenshot of successful document translation flow.":::

#### [Microsoft SharePoint](#tab/sharepoint)

 1. Select the **SharePoint** action then select **Get file content**.
 
   :::image type="content" source="media/connectors/get-file-content.png" alt-text="Screenshot of the SharePoint Get file content action.":::

1. Select the **Start document translation** action.
1. Enter your Translator resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Your Translator resource keys are found under the  **Resource Management** section of the resource sidebar in the Azure portal. Enter one of your keys. The Translator V3 connector requires managed identity for authentication. Managed identity isn't supported the global region. **Make certain that your Translator resource is assigned to a geographical region such as West US**.

    :::image type="content" source="media/connectors/keys-endpoint-sidebar.png" alt-text="Screenshot showing keys and endpoint listed in the resource sidebar.":::

   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

> [!NOTE]
> After you've setup your connection, you won't be required to reenter your credentials for subsequent flows.

1. 
1. Navigate to [office.com](https://www.office.com/)
1. Enter **SharePoint** in the upper search bar and sign in.
1. 

---