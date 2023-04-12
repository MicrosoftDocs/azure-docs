---
title: "Tutorial: Use Translator V3 connector to build a Document Translation flow."
titleSuffix: Azure Cognitive Services
description: Use Microsoft Translator V3 connector and Power Automate to build a Document Translation flow.
author: laujan
manager: nitinme
ms.service: cognitive-services
ms.subservice: translator-text
ms.topic: tutorial
ms.date: 04/10/2023
ms.author: lajanuar
---

<!-- markdownlint-disable MD051 -->
<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD029 -->
<!-- markdownlint-disable MD036 -->
<!-- markdownlint-disable MD001 -->

# Tutorial: Configure a Document Translation V3 Connector flow

This tutorial, details how to configure a Translator V3 connector cloud flow that supports document translation. The V3 connector creates a connection between your Translator instance and Microsoft Power Automate enabling you to use one or more prebuilt operations as steps in your apps and workflows.

Document Translation is a cloud-based REST API feature of the Azure Translator service. The document translation API enables multiple and complex document translations while preserving original document structure and data format.

In this tutorial, you learn how to:

> [!div class="checklist"]
>
> * [Create a blob storage account with containers](#setup-azure-storage) for your source and target files.
> * [Set-up a managed identity](#create-a-managed-identity-with-rbac) with role-based access control (RBAC).
> * [Translate documents from your Azure storage account](#azure-blob-storage).
> * [Translate documents from your SharePoint site](#microsoft-sharepoint).

## Prerequisites

To get started, you need:

* An active [**Azure account**](https://azure.microsoft.com/free/cognitive-services/).  If you don't have one, you can [**create a free account**](https://azure.microsoft.com/free/).

* A [**single-service Translator resource**](https://portal.azure.com/#create/Microsoft.CognitiveServicesTextTranslation) (**not** a multi-service Cognitive Services resource):

  **Complete the Translator project and instance details fields paying special attention to the following:**

  1. **Resource Region**. Choose  a **geographic** region like **West US** (**not** the *Global* region).

  1. **Pricing tier**. Select **Standard S1** to try the service.

* After your new resource deploys, select **Go to resource** or navigate directly to your resource page.

  1. In the left rail, under *Resource Management*, select **Keys and Endpoint**.

  1. Copy and paste your key and document translation endpoint URL in a convenient location, such as *Microsoft Notepad*. Text and Document Translation have different endpoint URLs.

   :::image type="content" source="../media/keys-and-endpoint-resource.png" alt-text="Get key and endpoint.":::

### Setup Azure storage

* You need an [**Azure blob storage account**](https://portal.azure.com/#create/Microsoft.StorageAccount-ARM) and you also need to [create containers](/azure/storage/blobs/storage-quickstart-blobs-portal?branch=main#create-a-container) in your storage account for your source and target files:

  * **Source container**. This container is where you upload your files for translation (required).
  * **Target container**. This container is where your translated files are stored (required).

* **If your storage account is behind a firewall, you must enable the following configuration**:

   1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
   1. Select the Storage account.
   1. In the **Security + networking** group in the left pane, select **Networking**.
   1. In the **Firewalls and virtual networks** tab, select **Enabled from selected virtual networks and IP addresses**.

      :::image type="content" source="../media/managed-identities/firewalls-and-virtual-networks.png" alt-text="Screenshot: Selected networks radio button selected.":::

   1. Deselect all check boxes.
   1. Make sure **Microsoft network routing** is selected.
   1. Under the **Resource instances** section, select **Microsoft.CognitiveServices/accounts** as the resource type and select your Translator resource as the instance name.
   1. Make certain that the **Allow Azure services on the trusted services list to access this storage account** box is checked. For more information about managing exceptions, *see* [Configure Azure Storage firewalls and virtual networks](../../../storage/common/storage-network-security.md).

      :::image type="content" source="../media/managed-identities/allow-trusted-services-checkbox-portal-view.png" alt-text="Screenshot: allow trusted services checkbox, portal view.":::

   1. Select **Save**. It may take up to 5 min for the network changes to propagate.

### Create a managed identity with RBAC

 Before you can use the V3 connector's operations for document translations, you must grant the Translator resource access to your storage account using a managed identity with a role based identity control (RBAC).

  :::image type="content" source="../document-translation/media/managed-identity-rbac-flow.png" alt-text="Screenshot of managed identity flow (RBAC).":::

### Managed Identity

Create a system-assigned managed identity for your Translator resource and grant that identity specific permissions to access your Azure storage account:

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Within the **System assigned** tab, turn on the **Status** toggle.
1. Select **Save**.

    :::image type="content" source="../media/managed-identities/resource-management-identity-tab.png" alt-text="Screenshot: resource management identity tab in the Azure portal.":::

### Role assignment

Next, assign a Storage Blob Data Contributor role to the managed identity at the storage scope for your storage resource.

1. Go to the [Azure portal](https://portal.azure.com/) and sign in to your Azure account.
1. Select the Translator resource.
1. In the **Resource Management** group in the left pane, select **Identity**.
1. Under **Permissions** select **Azure role assignments**:

    :::image type="content" source="../media/managed-identities/enable-system-assigned-managed-identity-portal.png" alt-text="Screenshot: enable system-assigned managed identity in Azure portal.":::

1. On the Azure role assignments page that opened, choose your subscription from the drop-down menu then select **&plus; Add role assignment**.

    :::image type="content" source="../media/managed-identities/azure-role-assignments-page-portal.png" alt-text="Screenshot: Azure role assignments page in the Azure portal.":::

1. Next, assign a **Storage Blob Data Contributor** role to your Translator service resource. The **Storage Blob Data Contributor** role gives Translator (represented by the system-assigned managed identity) read, write, and delete access to the blob container and data. In the **Add role assignment** pop-up window, complete the fields as follows and select **Save**:

    | Field | Value|
    |------|--------|
    |**Scope**| ***Storage***.|
    |**Subscription**| ***The subscription associated with your storage resource***.|
    |**Resource**| ***The name of your storage resource***.
    |**Role** | ***Storage Blob Data Contributor***.|

1. After the *Added Role assignment* confirmation message appears, refresh the page to see the added role assignment.

    :::image type="content" source="../media/managed-identities/add-role-assignment-confirmation.png" alt-text="Screenshot: Added role assignment confirmation pop-up message.":::

1. If you don't see the new role assignment right away, wait and try refreshing the page again. When you assign or remove role assignments, it can take up to 30 minutes for changes to take effect.

    :::image type="content" source="../media/managed-identities/assigned-roles-window.png" alt-text="Screenshot: Azure role assignments window.":::

### Configure a Document Translation flow

Now that completed the prerequisites and initial setup, let's get started using the Translator V3 connector to create your flow:

1. Sign in to [Power Automate](https://powerautomate.microsoft.com/).

1. Select **Create** from the left sidebar menu.

1. Select **Instant cloud flow** from the main content area.

   :::image type="content" source="../media/connectors/create-a-flow.png" alt-text="Screenshot showing how to create an instant cloud flow.":::

1. In the popup window, name your flow, choose **Manually trigger a flow**, and select **Create**.

   :::image type="content" source="../media/connectors/select-manual-flow.png" alt-text="Screenshot showing how to manually trigger a flow.":::

1. The first step for your instant flow—**Manually trigger a flow**—appears on screen. Select **New step**.

   :::image type="content" source="../media/connectors/add-new-step.png" alt-text="Screenshot of add new flow step page.":::

## Start Document Translation

We're ready to select an action. Here, you learn to translate documents and get the status of the operation using your [**Azure blob storage**](#azure-blob-storage) or [**Microsoft SharePoint**](#microsoft-sharepoint) account.

### [Use Azure blob storage](#tab/blob-storage)

### Azure blob storage

1. In the Choose an operation pop-up window, enter Translator V3 in the **Search connectors and actions** search bar and select the **Microsoft Translator V3** icon.

   :::image type="content" source="../media/connectors/choose-operation.png" alt-text="Screenshot showing the selection of Translator V3 as the next flow step.":::

1. Select the **Start document translation** action.
1. If you're using the Translator V3 connector for the first time, you need to enter your resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Your Translator resource keys are found under the  **Resource Management** section of the resource sidebar in the Azure portal. Enter one of your keys.
   * **Make certain that your Translator resource is assigned to a geographical region such as West US** (not global).

    :::image type="content" source="../media/connectors/keys-endpoint-sidebar.png" alt-text="Screenshot showing keys and endpoint listed in the resource sidebar.":::

   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="../media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

   > [!NOTE]
   > After you've setup your connection, you won't be required to reenter your credentials for subsequent flows.

1. Next, the **Start document translation** action window appears. Complete the fields as follows:

   * **Storage type of the input documents**. Select **File** or **Folder**.
   * Select a **Source Language** from the dropdown menu or keep the default **Auto-detect** option.
   * **Location of the source documents**. Enter the URL for your document(s) in your Azure storage source document container.
   * **Location of the translated documents**. Enter the URL for your Azure storage target document container.
      To find your source and target URLs:
      1. Navigate to your storage account in the Azure portal.
      1. In the left sidebar, under  **Data storage** , select **Containers**.

         |c. Source| c. Target|
         |------|-------|
         |Select the checkbox next to the source container|Select the checkbox next to the target container.|
         | From the main window area, select a file or document for translation.| Select the ellipses located at the right, then choose **Properties**.|
         | The source URL is located at the top of the Properties list. Select the **Copy to Clipboard** icon.|The target URL is located at the top of the Properties list. Select the **Copy to Clipboard** icon.|
         | Navigate to your Power automate flow and paste the source URL in the **Location of the source documents** field.|Navigate to your Power automate flow and paste the target URL in the **Location of the translated documents** field.|
   * Choose a **Target Language** from the dropdown menu.

      :::image type="content" source="../media/connectors/start-document-translation-window.png" alt-text="Screenshot of the Start document translation dialog window.":::

1. Select **New step**.

1. Enter Translator V3 in the search box and choose **Microsoft Translator V3**.
1. Select **Get documents status** (not the singular Get *document* status action).

   :::image type="content" source="../media/connectors/get-documents-status-step.png" alt-text="Screenshot of the get documents status step.":::

1. Next, you're going to enter an expression to retrieve the **`operation ID`** value.

1. Select the operation ID field. A **Dynamic content** / **Expression** dropdown window appears.

1. Select the **Expression** tab and enter the following expression into the function field:

      ```powerappsfl

         body('Start_document_translation').operationID

      ```

      :::image type="content" source="../media/connectors/create-function-expression.png" alt-text="Screenshot showing function creation window.":::

1. Select **OK**. The function appears in the **Operation ID** window. Select **Save**.

   :::image type="content" source="../media/connectors/operation-id-function.png" alt-text="Screenshot showing the operation ID field with an expression function value.":::

## Test the connector flow

Time to check our flow and document translation results. A green bar appears at the top of the page indicating that **Your flow is ready to go.**. Let's test it:

1. Select Test from the upper-right corner of the page.

   :::image type="content" source="../media/connectors/test-flow.png" alt-text="Screenshot showing the test icon/button.":::

1. Select **Manually** from the **Test Flow** side window and select **Save & Test**

   :::image type="content" source="../media/connectors/manually-test-flow.png" alt-text="Screenshot showing the manual test flow button.":::

1. The **Run flow** side window appears next. Select **Continue**, select **Run flow**. and then select **Done**.

   :::image type="content" source="../media/connectors/run-flow.gif" alt-text="Screenshot showing the run-flow side window.":::

1. The **Your flow ran successfully** message appears and a green checkmark appears next to each successful step.

   :::image type="content" source="../media/connectors/successful-document-translation-flow.png" alt-text="Screenshot of successful document translation flow.":::

1. Select the **Get documents status** step, then select **Show raw outputs** from the **Outputs** section.
1. A **Get documents status** window appears. At the top of the JSON response, you see `"statusCode":200` indicating that the request was successful.

   :::image type="content" source="../media/connectors/get-documents-status.png" alt-text="Screenshot showing the 'Get documents status' JSON response.":::

1. As a final check, navigate to your Azure blob storage target source container. You see the translated document in the **Overview** section. The document may be in a folder labeled with the translation language code.

#### [Use Microsoft SharePoint](#tab/sharepoint)

### Microsoft SharePoint

Here are the steps covered in this section:

> [!div class="checklist"]
>
> * Get the source file from your SharePoint site (**Get file content**)
> * Create a Azure storage blob from the source file and upload it to your Azure storage account.
> * Translate the source file
> * Get documents status
> * 

##### Get file content

 1. In the **Choose an operation** pop-up window enter **SharePoint**, then select the **Get file content** content. Power Automate automatically signs you into your SharePoint account.

   :::image type="content" source="../media/connectors/get-file-content.png" alt-text="Screenshot of the SharePoint Get file content action.":::

1. On the **Get file content** step window, complete the following fields:
    * **Site Address**. Select the SharePoint site URL where your file is located from the dropdown list.
    * **File Identifier**. Select the folder icon and choose the document(s) for translation.

##### Create blob

1. Select **New step** and enter **Azure Blob Storage** in the search box.

1. Select the **Create blob (V2)** action and complete the authentication fields.

   :::image type="content" source="../media/connectors/blob-storage-auth.png" alt-text="Screenshot of Azure Blob Storage authentication window.":::

1. If you're using the Azure storage step for the first time, you need to enter your resource credentials:

   * **Authentication type**. Choose **Access Key**.
   * **Azure Storage account name or blob endpoint**. Enter your Azure storage **blob endpoint**
   * **Azure Storage Account Access Key**. Enter your primary or secondary Azure storage **access key**.

    You can find your storage **Access keys** and **Endpoint** URL from the Azure portal:

      * Navigate to your storage account in the Azure portal

      **Endpoint**

      * From the left sidebar under **Settings**, select **Endpoints**.
      * Your storage blob endpoint is in the **Blob service** section. Select the copy icon for the **Primary** or **Secondary** endpoint.

         :::image type="content" source="../media/connectors/blob-storage-endpoint.png" alt-text="Screenshot of the blob storage endpoint in the Azure portal,":::

      * Return to your Power Automate flow and paste the key in the **Azure Storage account name or blob endpoint** field.

      **Azure keys**

      * From the left sidebar under **Security + networking**, select **Access keys**.
      * Select the **Show** button for one of your keys, then select the copy icon.
      * Return to your Power Automate flow and paste the key in the **Azure Storage account name or blob endpoint** field.

         :::image type="content" source="../media/connectors/storage-access-keys.png" alt-text="Screenshot of storage account access keys in the Azure portal.":::

1. After you have completed the **Azure Blob Storage** fields, select **Create**

   :::image type="content" source="../media/connectors/complete-storage-auth.png" alt-text="Screenshot of the authenticate blob storage window.":::

1. The **Create blob** step now appears. Complete the fields as follows:

   * **Storage account name or blob endpoint**. Select **Enter custom value** and enter your storage account name.
   * **Folder path**. Select the folder icon and select your source document container.
   * **Blob name**. Enter the name of the file you're translating.
   * **Blob content**. Select the **Blob content** field to reveal the **Dynamic content** dropdown list and choose the SharePoint **File Content** icon.

      :::image type="content" source="../media/connectors/file-dynamic-content.png" alt-text="Screenshot of the file content icon on the dynamic content menu.":::

##### Start document translation

1. Select **New step**.

1. Enter Translator V3 in the search box and choose **Microsoft Translator V3**.

1. Select the **Start document translation** action.

1. If you're using the Translator V3 connector for the first time, you need to enter your resource credentials:

   * **Connection name**. Enter a name for your connection.
   * **Subscription Key**. Your Translator resource keys are found under the  **Resource Management** section of the resource sidebar in the Azure portal. Enter one of your keys. The Translator V3 connector requires managed identity for authentication. Managed identity isn't supported the global region. **Make certain that your Translator resource is assigned to a geographical region such as West US**.

      :::image type="content" source="../media/connectors/keys-endpoint-sidebar.png" alt-text="Screenshot showing keys and endpoint listed in the resource sidebar.":::

   * **Translator resource name**. Enter the name of your Translator resource found at the top of your resource page in the Azure portal. Select **Create**.

      :::image type="content" source="../media/connectors/add-connection.png" alt-text="Screenshot showing the add connection window.":::

> [!NOTE]
> After you've setup your connection, you won't be required to reenter your credentials for subsequent flows.

1. Next, the **Start document translation** action window appears.
1. **Storage type of the input documents**. Select **File** or **Folder**.
1. Select a **Source Language** from the dropdown menu or keep the default **Auto-detect** option.
1. **Location of the source documents**. Select the field and add **Path** from the **Dynamic content** dropdown list.
1. **Location of the translated documents**. Enter the URL for your Azure storage target document container.

   To find your target container URL:

   1. Navigate to your storage account in the Azure portal.
   1. In the left sidebar, under  **Data storage** , select **Containers**.
   1. Select the checkbox next to the target container.
   1. Select the ellipses located at the right, then choose **Properties**.
   1. The target URL is located at the top of the Properties list. Select the **Copy to Clipboard** icon.|
   1. Navigate back to your Power automate flow and paste the target URL in the **Location of the translated documents** field.

1. Choose a **Target Language** from the dropdown menu.

   :::image type="content" source="../media/connectors/start-document-translation-window.png" alt-text="Screenshot of the Start document translation dialog window.":::

##### Get documents status

1. Select **New step**.

1. Enter Translator V3 in the search box and choose **Microsoft Translator V3**.
1. Select **Get documents status** (not Get document status).

   :::image type="content" source="../media/connectors/get-documents-status-step.png" alt-text="Screenshot of the get documents status step.":::

1. Next, you're going to enter an expression to retrieve the operation ID value.

1. Select the operation ID field. A **Dynamic content** / **Expression** dropdown window appears.

1. Select the **Expression** tab and enter the following expression into the function field:

   ```powerappsfl

     body('Start_document_translation').operationID

   ```

      :::image type="content" source="../media/connectors/create-function-expression.png" alt-text="Screenshot showing function creation window.":::

1. Select **OK**. The function appears in the **Operation ID** window. Select **Save**.

   :::image type="content" source="../media/connectors/operation-id-function.png" alt-text="Screenshot showing the operation ID field with an expression function value.":::

##### Get blob content

In this step, you retrieve the translated document from Azure blob storage to store in SharePoint.

1. Select **New Step**, enter **Control** in the search box and select **Apply to each** from the **Actions** list.
1. Select the input field to show the **Dynamic content** window and select **value**.
1. Select **Add an action**.

   :::image type="content" source="../media/connectors/apply-to-each.png" alt-text="Screenshot showing the 'Apply to each' control step.":::
1. Enter **Control** in the search box and select **Do until** from the **Actions** list.
1. Select the **Choose a value** field to show the **Dynamic content** window and select **progress**.
1. Complete the three fields as follows: **progress** → **is equal to** → **1**:

   :::image type="content" source="../media/connectors/do-until-progress.png" alt-text="Screenshot showing the **Do until** control.":::

1. Select **Add an action**, enter **Azure blob Storage** in the search box, and select the **Get blob content using path (V2)** action.
1. In the **Storage account name or blob endpoint** field, select **Enter custom value** and enter your storage account name.
1. Select the **Blob path** field to show the **Dynamic content** window, select **Expression** and enter the following logic in the formula field:

   ```powerappsfl

      concat(split(outputs('Get_document_status')?['body/path'],'/')[3],'/',split(outputs('Get_document_status')?['body/path'],'/')[4],'/',split(outputs('Get_document_status')?['body/path'],'/')[5])

   ```

1. Select **Add an action**, enter **Azure blob Storage** in the search box, and select the **Get Blob Metadata using path (V2)** action.
1. In the **Storage account name or blob endpoint** field, select **Enter custom value** and enter your storage account name.
1. In the **Blob path** field, select the path to your translated (target container) document.

##### Create new folder

1. Select **Add an action**, enter **SharePoint** in the search box, and select the **Create new folder** action.
1. Select your SharePoint URL from the **Site Address** dropdown window.
1. In the next field, select a **List or Library** from the dropdown.
1. Name your new folder and enter it in the **/Folder Path/** field (be sure to enclose the path name with forward slashes).

##### Create file

1. Select **Add an action**, enter **SharePoint** in the search box, and select the **Create file** action.
1. Select your SharePoint URL from the **Site Address** dropdown window.
1. In the **Folder Path** field, select *Create new folder* → **Full Path** from the **Dynamic content** list.
1. In the **File Name** field, select *Get Blob Metadata using path (V2)* → **Name** from the **Dynamic content** list.
1. In the **File Content** field, select *Get Blob Metadata using path (V2)* → **body** from the **Dynamic content** list.

Time to check our flow and document translation results. A green bar appears at the top of the page indicating that **Your flow is ready to go.**. Let's test it:

1. Select Test from the upper-right corner of the page.

   :::image type="content" source="../media/connectors/test-flow.png" alt-text="Screenshot showing the test icon/button.":::

1. Select **Manually** from the **Test Flow** side window and select **Save & Test**

   :::image type="content" source="../media/connectors/manually-test-flow.png" alt-text="Screenshot showing the manual test flow button.":::

1. The **Run flow** side window appears next. Select **Continue**, select **Run flow**. and then select **Done**.

   :::image type="content" source="../media/connectors/run-flow.gif" alt-text="Screenshot showing the run-flow side window.":::

1. The "Your flow ran successfully" message appears and there's a green checkmark next to each successful step.

   :::image type="content" source="../media/connectors/successful-document-translation-flow.png" alt-text="Screenshot of successful document translation flow.":::

   :::image type="content" source="../media/connectors/successful-sharepoint-flow.png" alt-text="Screenshot showing a successful flow using SharePoint and Azure blob storage.":::

---

## Next steps

> [!div class="nextstepaction"]
> [Explore the Document Translation reference guide](../document-translation/reference/rest-api-guide.md)
