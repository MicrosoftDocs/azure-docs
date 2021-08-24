---
title: Transform XML with XSLT maps
description: Add XSLT maps to transform XML in Azure Logic Apps with Enterprise Integration Pack
services: logic-apps
ms.suite: integration
author: divyaswarnkar
ms.author: divswa
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 08/04/2021
---

# Transform XML with maps in Azure Logic Apps with Enterprise Integration Pack

To transfer XML data between formats for enterprise integration scenarios in Azure Logic Apps, your logic app can use maps, or more specifically, Extensible Stylesheet Language Transformation (XSLT) maps. A map is an XML 
document that describes how to convert data from an XML document into another format.

For example, suppose you regularly receive B2B orders or invoices from a customer who uses the YYYMMDD date format. However, your organization uses the MMDDYYY date format. You can define and use a map that transforms 
the YYYMMDD date format to the MMDDYYY format before storing the order or invoice details in your customer activity database.

> [!NOTE]
> The Azure Logic Apps service allocates finite memory for processing XML transformations. If you 
> create logic apps based on the **Logic App (Consumption)** resource type, and your map or payload 
> transformations have high memory consumption, such transformations might fail, resulting in out 
> of memory errors. To avoid this scenario, consider these options:
>
> * Edit your maps or payloads to reduce memory consumption.
>
> * Create your logic apps using the **Logic App (Standard)** resource type instead.
>
>   These workflows run in single-tenant Azure Logic Apps, which offers dedicated and flexible options 
>   for compute and memory resources. For more information, review the following documentation:
>
>   * [What is Azure Logic Apps - Resource type and host environments](logic-apps-overview.md#resource-type-and-host-environment-differences)
>   * [Create an integration workflow with single-tenant Azure Logic Apps (Standard)](create-single-tenant-workflows-azure-portal.md)
>   * [Single-tenant versus multi-tenant and integration service environment for Azure Logic Apps](single-tenant-overview-compare.md)
>   * [Usage metering, billing, and pricing models for Azure Logic Apps](logic-apps-pricing.md)

For limits related to integration accounts and artifacts such as maps, review [Limits and configuration information for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#integration-account-limits).

## Prerequisites

* An Azure subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/).

* An [integration account](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md) 
where you store your maps and other artifacts for enterprise integration and business-to-business (B2B) solutions.

* If your map references an external assembly, you need a 64-bit assembly. The transform service runs a 64-bit process, so 32-bit assemblies aren't supported. If you have the source code for a 32-bit assembly, recompile the code into a 64-bit assembly. If you don't have the source code, but you obtained the binary from a third-party provider, get the 64-bit version from that provider. For example, some vendors provide assemblies in packages that have both 32-bit and 64-bit versions. If you have the option, use the 64-bit version instead.

* If your map references an external assembly, you have to upload *both the assembly and the map* to your integration account. Make sure you [*upload your assembly first*](#add-assembly), and then upload the map that references the assembly.

  If your assembly is 2 MB or smaller, you can add your assembly to your integration account *directly* from the Azure portal. However, if your assembly or map is bigger than 2 MB but not bigger than the [size limit for assemblies or maps](../logic-apps/logic-apps-limits-and-config.md#artifact-capacity-limits), you have these options:

  * For assemblies, you need an Azure blob container where you can upload your assembly and that container's location. That way, you can provide that location later when you add the assembly to your integration account. For this task, you need these items:

    | Item | Description |
    |------|-------------|
    | [Azure storage account](../storage/common/storage-account-overview.md) | In this account, create an Azure blob container for your assembly. Learn [how to create a storage account](../storage/common/storage-account-create.md). |
    | Blob container | In this container, you can upload your assembly. You also need this container's location when you add the assembly to your integration account. Learn how to [create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md). |
    | [Azure Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md) | This tool helps you more easily manage storage accounts and blob containers. To use Storage Explorer, either [download and install Azure Storage Explorer](https://www.storageexplorer.com/). Then, connect Storage Explorer to your storage account by following the steps in [Get started with Storage Explorer](../vs-azure-tools-storage-manage-with-storage-explorer.md). To learn more, see [Quickstart: Create a blob in object storage with Azure Storage Explorer](../storage/blobs/storage-quickstart-blobs-storage-explorer.md). <p>Or, in the Azure portal, select your storage account. From your storage account menu, select **Storage Explorer**. |
    |||

  * For maps, you can currently add larger maps by using the [Azure Logic Apps REST API - Maps](/rest/api/logic/maps/createorupdate).

You don't need a logic app when creating and adding maps. However, to use a map, your logic app needs linking to an integration account where you store that map. Learn [how to link logic apps to integration accounts](../logic-apps/logic-apps-enterprise-integration-create-integration-account.md#link-account). If you don't have a logic app yet, learn [how to create logic apps](../logic-apps/quickstart-create-first-logic-app-workflow.md).

<a name="add-assembly"></a>

## Add referenced assemblies

1. In the [Azure portal](https://portal.azure.com), sign in with your Azure account credentials.

1. In the main Azure search box, enter `integration accounts`, and select **Integration accounts**.

1. Select the integration account where you want to add your assembly, for example:

1. On your integration account's menu, select **Overview**. Under **Settings**, select **Assemblies**.

1. On the **Assemblies** pane toolbar, select **Add**.

Based on your assembly file's size, follow the steps for uploading an assembly that's either [up to 2 MB](#smaller-assembly) or [more than 2 MB but only up to 8 MB](#larger-assembly). For limits on assembly quantities in integration accounts, review [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits).

> [!NOTE]
> If you change your assembly, you must also update your map whether or not the map has changes.

<a name="smaller-assembly"></a>

### Add assemblies up to 2 MB

1. Under **Add Assembly**, enter a name for your assembly. Keep **Small file** selected. Next to the **Assembly** box, select the folder icon. Find and select the assembly you're uploading.

   After you select the assembly, the **Assembly Name** property automatically shows the assembly's file name.

1. When you're ready, select **OK**.

   After your assembly file finishes uploading, the assembly appears in the **Assemblies** list. On your integration account's **Overview** pane, under **Artifacts**, your uploaded assembly also appears.

<a name="larger-assembly"></a>

### Add assemblies more than 2 MB

To add larger assemblies, you can upload your assembly to an Azure blob container in your Azure storage account. Your steps for adding assemblies differ based whether your blob container has public read access. So first, check whether or not your blob container has public read access by following these steps: [Set public access level for blob container](../vs-azure-tools-storage-explorer-blobs.md#set-the-public-access-level-for-a-blob-container)

#### Check container access level

1. Open Azure Storage Explorer. In the Explorer window, expand your Azure subscription if not already expanded.

1. Expand **Storage Accounts** > {*your-storage-account*} > **Blob Containers**. Select your blob container.

1. From your blob container's shortcut menu, select **Set Public Access Level**.

   * If your blob container has at least public access, select **Cancel**, and follow these steps later on this page: [Upload to containers with public access](#public-access-assemblies)

     ![Public access](media/logic-apps-enterprise-integration-schemas/azure-blob-container-public-access.png)

   * If your blob container doesn't have public access, select **Cancel**, and follow these steps later on this page: [Upload to containers without public access](#no-public-access-assemblies)

     ![No public access](media/logic-apps-enterprise-integration-schemas/azure-blob-container-no-public-access.png)

<a name="public-access-assemblies"></a>

#### Upload to containers with public access

1. Upload the assembly to your storage account. In the right-side window, select **Upload**.

1. After you finish uploading, select your uploaded assembly. On the toolbar, select **Copy URL** so that you copy the assembly's URL.

1. Return to the Azure portal where the **Add Assembly** pane is open. Enter a name for your assembly. Select **Large file (larger than 2 MB)**.

   The **Content URI** box now appears, rather than the **Assembly** box.

1. In the **Content URI** box, paste your assembly's URL. Finish adding your assembly.

   After your assembly finishes uploading, the schema appears in the **Assemblies** list. On your integration account's **Overview** pane, under **Artifacts**, your uploaded assembly also appears.

<a name="no-public-access-assemblies"></a>

#### Upload to containers without public access

1. Upload the assembly to your storage account. In the right-side window, select **Upload**.

1. After you finish uploading, generate a shared access signature (SAS) for your assembly. From your assembly's shortcut menu, select **Get Shared Access Signature**.

1. In the **Shared Access Signature** pane, select **Generate container-level shared access signature URI** > **Create**. After the SAS URL gets generated, next to the **URL** box, select **Copy**.

1. Return to the Azure portal where the **Add Assembly** pane is open. Enter a name for your assembly. Select **Large file (larger than 2 MB)**.

   The **Content URI** box now appears, rather than the **Assembly** box.

1. In the **Content URI** box, paste the SAS URI that you previously generated. Finish adding your assembly.

After your assembly finishes uploading, the assembly appears in the **Schemas** list. On your integration account's **Overview** page, under **Artifacts**, your uploaded assembly also appears.

## Create maps

To create an Extensible Stylesheet Language Transformation (XSLT) document that you can use as a map, you can use Visual Studio 2015 or 2019 to create an integration project by using the [Enterprise Integration Pack](logic-apps-enterprise-integration-overview.md). In this project, you can build an integration map file, which lets you visually map items between two XML schema files. After you build this project, you get an XSLT document. For limits on map quantities in integration accounts, review [Limits and configuration for Azure Logic Apps](../logic-apps/logic-apps-limits-and-config.md#artifact-number-limits).

## Add maps

After you upload any assemblies that your map references, you can now upload your map.

1. If you haven't signed in already, sign in to the [Azure portal](https://portal.azure.com) with your Azure account credentials.

1. If your integration account isn't already open, in the main Azure search box, enter `integration accounts`, and select **Integration accounts**.

1. Select the integration account where you want to add your map.

1. On your integration account's menu, select **Overview**. Under **Settings**, select **Maps**.

1. On the **Maps** pane toolbar, select **Add**.

1. Continue to add either a map [up to 2 MB](#smaller-map) or [more than 2 MB](#larger-map).

<a name="smaller-map"></a>

### Add maps up to 2 MB

1. Under **Add Map**, enter a unique name for your map.

1. Under **Map type**, select the type, for example: **Liquid**, **XSLT**, **XSLT 2.0**, or **XSLT 3.0**.

1. Next to the **Map** box, select the folder icon. Find and select the map you're uploading, for example:

   If you left the **Name** property empty, the map's file name automatically appears in that property after you select the map file.

1. When you're ready, select **OK**.

   After your map file finishes uploading, the map appears in the **Maps** list.

   On your integration account's **Overview** page, under **Artifacts**, your uploaded map also appears.

<a name="larger-map"></a>

### Add maps more than 2 MB

Currently, to add larger maps, use the [Azure Logic Apps REST API - Maps](/rest/api/logic/maps/createorupdate).

<!--

To add larger maps, you can upload your map to 
an Azure blob container in your Azure storage account. 
Your steps for adding maps differ based whether your 
blob container has public read access. So first, check 
whether or not your blob container has public read 
access by following these steps: 
[Set public access level for blob container](../vs-azure-tools-storage-explorer-blobs.md#set-the-public-access-level-for-a-blob-container)

#### Check container access level

1. Open Azure Storage Explorer. In the Explorer window, 
   expand your Azure subscription if not already expanded.

1. Expand **Storage Accounts** > {*your-storage-account*} > 
   **Blob Containers**. Select your blob container.

1. From your blob container's shortcut menu, 
   select **Set Public Access Level**.

   * If your blob container has at least public access, choose **Cancel**, 
   and follow these steps later on this page: 
   [Upload to containers with public access](#public-access)

     ![Public access](media/logic-apps-enterprise-integration-schemas/azure-blob-container-public-access.png)

   * If your blob container doesn't have public access, choose **Cancel**, 
   and follow these steps later on this page: 
   [Upload to containers without public access](#public-access)

     ![No public access](media/logic-apps-enterprise-integration-schemas/azure-blob-container-no-public-access.png)

<a name="public-access-maps"></a>

### Add maps to containers with public access

1. Upload the map to your storage account. 
   In the right-side window, choose **Upload**. 

1. After you finish uploading, select your 
   uploaded map. On the toolbar, choose **Copy URL** 
   so that you copy the map's URL.

1. Return to the Azure portal where the 
   **Add Map** pane is open. Choose **Large file**. 

   The **Content URI** box now appears, 
   rather than the **Map** box.

1. In the **Content URI** box, paste your map's URL. 
   Finish adding your map.

After your map finishes uploading, 
the map appears in the **Maps** list.

<a name="no-public-access-maps"></a>

### Add maps to containers with no public access

1. Upload the map to your storage account. 
   In the right-side window, choose **Upload**.

1. After you finish uploading, generate a 
   shared access signature (SAS) for your schema. 
   From your map's shortcut menu, 
   select **Get Shared Access Signature**.

1. In the **Shared Access Signature** pane, select 
   **Generate container-level shared access signature URI** > **Create**. 
   After the SAS URL gets generated, next to the **URL** box, choose **Copy**.

1. Return to the Azure portal where the 
   **Add Maps** pane is open. Choose **Large file**.

   The **Content URI** box now appears, 
   rather than the **Map** box.

1. In the **Content URI** box, paste the SAS URI 
   you previously generated. Finish adding your map.

After your map finishes uploading, 
the map appears in the **Maps** list.

-->

## Edit maps

To update an existing map, you have to upload a new map file that has the changes you want. However, you can first download the existing map for editing.

1. In the [Azure portal](https://portal.azure.com), open your integration account, if not already open.

1. On your integration account's menu, under **Settings**, select **Maps**.

1. After the **Maps** pane opens, select your map. To download and edit the map first, on the **Maps** pane toolbar, select **Download**, and save the map.

1. When you're ready to upload the updated map, on the **Maps** pane, select the map that you want to update. On the **Maps** pane toolbar, select **Update**.

1. Find and select the updated map you want to upload.

   After your map file finishes uploading, the updated map appears in the **Maps** list.

## Delete maps

1. In the [Azure portal](https://portal.azure.com), find and open your integration account, if not already open.

1. On your integration account's menu, under **Settings**, select **Maps**.

1. After the **Maps** pane opens, select your map, and select **Delete**.

1. To confirm you want to delete the map, select **Yes**.

## Next steps

* [Learn more about the Enterprise Integration Pack](../logic-apps/logic-apps-enterprise-integration-overview.md)  
* [Learn more about schemas](../logic-apps/logic-apps-enterprise-integration-schemas.md)
* [Learn more about transforms](../logic-apps/logic-apps-enterprise-integration-transform.md)
