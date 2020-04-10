---
title: Azure Table in commercial marketplace program| Azure Marketplace
description: Configure lead management for Azure Blob
author: qianw211
ms.service: marketplace
ms.subservice: partnercenter-marketplace-publisher
ms.topic: conceptual
ms.date: 7/30/2019
ms.author: dsindona
---

# Lead management instructions for Azure Blob

>[!Caution]
>The Azure Blob option to process leads from your marketplace offer has been deprecated. If you currently have an offer published with lead management configuration for Azure Blob, you are no longer receiving customer leads. Please update your lead management configuration to any of the other lead management options. Learn about the other options on the [lead management landing page](./commercial-marketplace-get-customer-leads.md)."

If your Customer Relationship Management (CRM) system is not explicitly supported in Partner Center for receiving Azure Marketplace and AppSource leads, you can use an Azure Blob to handle these leads. You can then choose to export the data and import it into your CRM system. The instructions in this article will give you through the process of creating an Azure Storage account, and an Azure Blob under that account. In addition, you can create a new flow using Microsoft Flow to send an email notification when your offer receives a lead.


## How to configure Azure Blob

1. If you don't have an Azure account, you can [create a free trial account](https://azure.microsoft.com/pricing/free-trial/).
1. After your Azure account is active, sign in to the [Azure portal](https://portal.azure.com).
1. In the Azure portal, create a storage account using the following procedure.  
    1. Select **+Create a resource** in the left menu bar.  The **New** pane (blade) will be displayed to the right.
    2. Select **Storage** in the **New** pane.  A **Featured** list is displayed to the right.
    3. Select the **Storage Account** to begin account creation.  Follow the instructions in the article [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-quickstart-create-account?tabs=azure-portal).

    ![Steps to create an Azure storage account](./media/commercial-marketplace-lead-management-instructions-azure-blob/azure-storage-create.png)

    For more information about storage accounts, select [Quickstart tutorial](https://docs.microsoft.com/azure/storage/).  For more information about storage pricing, see [storage pricing](https://azure.microsoft.com/pricing/details/storage/).

4. Wait until your storage account is provisioned, a process that typically takes a few minutes.  Then access your storage account from the **Home** page of the Azure portal by selecting **See all your resources** or by selecting **All resources** from the left navigation menubar of the Azure portal.

    ![Access your Azure storage account](./media/commercial-marketplace-lead-management-instructions-azure-blob/azure-storage-access.png)

5. From your storage account pane, select **Access keys** and copy the *Connection string* value for the key. Save this value as this is the *Storage Account Connection String* value that you will need to provide in the publishing portal to receive leads for your marketplace offer.

     An example of a connection sting is:

     ```sql
     DefaultEndpointsProtocol=https;AccountName=myAccountName;AccountKey=myAccountKey;EndpointSuffix=core.windows.net
     ```

    ![Azure storage key](./media/commercial-marketplace-lead-management-instructions-azure-blob/azure-storage-keys-2.png)

6. From your storage account page, select **Blobs**.

   ![Azure storage key](./media/commercial-marketplace-lead-management-instructions-azure-blob/select-blobs.png)

7. Once on the blobs page, select the **+ Container** button.

8. Type a **name** for your new container. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character. For more information about container and blob names, see [Naming and referencing containers, blobs, and metadata](https://docs.microsoft.com/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).

    Save this value as this is the *Container Name* value that you need to provide in the publishing portal to receive leads for your marketplace offer.

9. Set the level of public access to the container as **Private (no anonymous access)**.

10. Select **OK** to create the container.

    ![New Container](./media/commercial-marketplace-lead-management-instructions-azure-blob/new-container.png)

## Configure your offer to send leads to the Azure Blob

When you are ready to configure the lead management information for your offer in the publishing portal, follow the below steps:

1. Navigate to the **Offer setup** page for your offer.
2. Select **Connect** under the Lead Management section.

    ![Connect Offer](./media/commercial-marketplace-lead-management-instructions-azure-blob/connect-offer.png)

3. On the Connection details pop-up window, select **Azure Blob** for the Lead Destination.

    ![Connect Detail](./media/commercial-marketplace-lead-management-instructions-azure-blob/connect-details.png) 

4. Provide the **Container name** and **Storage Account Connection string** you got from following these instructions.

    * Container name example: `marketplaceleadcontainer`
    * Storage Account Connection string example: `DefaultEndpointsProtocol=https;AccountName=myAccountName;AccountKey=myAccountKey;EndpointSuffix=core.windows.net`
        ![Connection Detail](./media/commercial-marketplace-lead-management-instructions-azure-blob/connection-details.png) 

5. Select **Save**.

    > [!NOTE]
    > You must finish configuring the rest of the offer and publish it before you can receive leads for the offer.


