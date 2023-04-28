---
title: Export, upload and share traces
titleSuffix: Azure Private 5G Core 
description: In this how-to guide, learn how to export, upload and share your detailed traces for diagnostics.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/03/2022
ms.custom: template-how-to
---

# Export, upload and share traces

Azure Private 5G Core offers a distributed tracing web GUI, which you can use to collect detailed traces for signaling flows involving packet core instances. You can export these traces and upload them to a storage account to allow your support representative to access them and provide troubleshooting assistance.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Ensure you can sign in to the distributed tracing web GUI as described in [Distributed tracing](distributed-tracing.md).

## Create a storage account and blob container in Azure

 When uploading and sharing a trace for the first time, you'll need to create a storage account and a container resource to store your traces. You can skip this step if this has already been done.

1. [Create a storage account](../storage/common/storage-account-create.md) with the following additional configuration: 
    1. In the **Advanced** tab, select **Enable storage account key access**. This will allow your support representative to download traces stored in this account using the URLs you share with them.
    1. In the **Data protection** tab, under **Access control**, select **Enable version-level immutability support**. This will allow you to specify a time-based retention policy for the account in the next step.
1. If you would like the traces in your storage account to be automatically deleted after a period of time, [configure a default time-based retention policy](../storage/blobs/immutable-policy-configure-version-scope.md#configure-a-default-time-based-retention-policy) for your storage account.
1. [Create a container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container) for your traces.

## Export trace from the distributed tracing web GUI

In this step, you'll export the trace from the distributed tracing web GUI and save it locally.

1. Sign in to the distributed tracing web GUI as described in [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui).
1. In the **Search** tab, specify the SUPI and time for the event you're interested in and select **Search**.
    
    :::image type="content" source="media\distributed-tracing-share-traces\distributed-tracing-search.png" alt-text="Screenshot of the Search display in the distributed tracing web G U I, showing the S U P I search field and date and time range options.":::

1. Find the relevant trace in the **Diagnostics Search Results** tab and select it.

    :::image type="content" source="media\distributed-tracing\distributed-tracing-search-results.png" alt-text="Screenshot of search results on a specific S U P I in the distributed tracing web G U I. It shows matching Successful P D U Session Establishment records.":::

1. Select **Export** and save the file locally.

    :::image type="content" source="media\distributed-tracing-share-traces\distributed-tracing-summary-view-export.png" alt-text="Screenshot of the Summary view of a specific trace in the distributed tracing web G U I, providing information on a Successful P D U Session Establishment record. The Export button in the top ribbon is highlighted." lightbox="media\distributed-tracing-share-traces\distributed-tracing-summary-view-export.png":::

## Upload trace to your blob container

You can now upload the trace to the container you created in [Create a storage account and blob container in Azure](#create-a-storage-account-and-blob-container-in-azure).

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Navigate to your Storage account resource.
1. In the **Resource** menu, select **Containers**.

    :::image type="content" source="media\distributed-tracing-share-traces\containers-resource-menu.png" alt-text="Screenshot of the Azure portal showing the Containers option in the resource menu of a Storage account resource." lightbox="media\distributed-tracing-share-traces\containers-resource-menu.png":::

1. Select the container you created for your traces.
1. Select **Upload**. In the **Upload blob** window, search for the trace file you exported in the previous step and upload it.

    :::image type="content" source="media\distributed-tracing-share-traces\upload-blob-tab.png" alt-text="Screenshot of the Azure portal showing the Overview display of a Container resource. The Upload button is highlighted." lightbox="media\distributed-tracing-share-traces\upload-blob-tab.png":::

## Create URL for sharing the trace

You'll now generate a shared access signature (SAS) URL for your trace. Once you create the URL, you can share it with your support representative for assistance with troubleshooting.

1. Navigate to your Container resource.
    
    :::image type="content" source="media\distributed-tracing-share-traces\container-overview-tab.png" alt-text="Screenshot of the Azure portal showing the Overview display of a Container resource.":::

1. Select the trace you'd like to share.
1. Select the **Generate SAS** tab.

    :::image type="content" source="media\distributed-tracing-share-traces\generate-shared-access-signature-tab.png" alt-text="Screenshot of the Azure portal showing the container overview and the trace blob information window. The Generate S A S tab is highlighted." lightbox="media\distributed-tracing-share-traces\generate-shared-access-signature-tab.png":::

1. Fill out the fields with the following configuration:
    1. Under **Signing method**, select **Account key**. This means anyone with access to the URL you generate will be able to paste it into a browser and download the trace.
    1. Under **Permissions**, select **Read**.
    1. Under **Start and expiry date/time**, set an expiration window of 48 hours for your token and URL.
    1. If you know the IP address from which your support representative will download the trace, set it under **Allowed IP addresses**. Otherwise, you can leave this blank.

1. Select **Generate SAS token and URL**.

    :::image type="content" source="media\distributed-tracing-share-traces\generate-shared-access-signature-token-url.png" alt-text="Screenshot of the Azure portal showing the Generate S A S tab in the trace blob information window. The Generate S A S token and U R L button is highlighted." lightbox="media\distributed-tracing-share-traces\generate-shared-access-signature-token-url.png":::

1. Copy the contents of the **Blob SAS URL** field and share the URL with your support representative.

## Delete trace

You should free up space in your blob storage by deleting the traces you'll no longer need. To delete a trace:

1. Navigate to your Container resource.
1. Choose the trace you want to delete.
1. Select **Delete**.

:::image type="content" source="media\distributed-tracing-share-traces\container-delete-trace.png" alt-text="Screenshot of the Azure portal showing the Overview display of a Container resource. The Delete button is highlighted." lightbox="media\distributed-tracing-share-traces\container-delete-trace.png":::

## Next steps

- [Learn more about the distributed tracing web GUI](distributed-tracing.md)