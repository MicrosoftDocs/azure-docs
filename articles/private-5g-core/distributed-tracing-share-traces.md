---
title: Upload and share data from distributed tracing
titleSuffix: Azure Private 5G Core Preview 
description: In this how-to guide, learn how to upload and share your detailed distributed tracing data for diagnostics.
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/03/2022
ms.custom: template-how-to
---

# Upload and share distributed tracing data

Azure Private 5G Core Preview offers a distributed tracing web GUI, which you can use to collect detailed traces for signaling flows involving packet core instances. You can export these traces and upload them to a storage account to allow your support representative to access them and provide troubleshooting assistance.

## Prerequisites

- Ensure you can sign in to the Azure portal...
- You'll need access to the distributed tracing web GUI.

## Create a storage account and blob container in Azure

1. [Create a storage account](https://docs.microsoft.com/azure/storage/common/storage-account-create).
1. [Apply a time-based retention policy](https://docs.microsoft.com/azure/storage/blobs/immutable-policy-configure-version-scope?tabs=azure-portal#enable-support-for-version-level-immutability). <!-- is this step optional? -->
1. Navigate to the storage account you just created and [create a container for your traces](https://docs.microsoft.com/azure/storage/blobs/storage-quickstart-blobs-portal#create-a-container).

## Export trace

1. Sign in to the distributed tracing web GUI. <!-- at [link]? -->
1. In the **Search** tab, specify the SUPI and time for the event you are interested in and select **Search**.
    
    :::image type="content" source="media\distributed-tracing\distributed-tracing-search-display.png" alt-text="Screenshot of the Search display in the distributed tracing web G U I, showing the S U P I and Errors tabs.":::

1. Find the relevant trace in the **Diagnostics Search Results** tab.

    :::image type="content" source="media\distributed-tracing\distributed-tracing-search-results.png" alt-text="Screenshot of search results on a specific S U P I in the distributed tracing web G U I. It shows matching Successful P D U Session Establishment records.":::

1. Select **Export**.

    :::image type="content" source="media\distributed-tracing-share-traces\distributed-tracing-summary-view-export.png" alt-text="Screenshot of the Summary view of a specific trace in the distributed tracing web G U I, providing information on a Successful P D U Session Establishment record. You can find the Export option in the top ribbon.":::

    You'll be prompted to save the file locally.

## Upload trace to blob container

1. Sign in to the Azure portal at [https://aka.ms/AP5GCPortal](https://aka.ms/AP5GCPortal).
1. Navigate to your Storage account resource.
1. In the **Resource** menu, select **Containers**.

    :::image type="content" source="media\distributed-tracing-share-traces\containers-resource-menu.png" alt-text="Screenshot of ...":::

1. Select the container you created for your traces.
1. Select **Upload**. In the **Upload blob** window, search for the trace file you exported in the previous step and select **Upload**.

    :::image type="content" source="media\distributed-tracing-share-traces\upload-blob-tab.png" alt-text="Screenshot of ...":::

## Share trace

1. Navigate to your Container resource.
    
    :::image type="content" source="media\distributed-tracing-share-traces\container-overview-tab.png" alt-text="Screenshot of ...":::

1. Select the trace you'd like to share.
1. Select **Generate SAS tab**. <!-- Need screenshot -->
1. Fill out the fields. <!-- Need screenshot -->
1. Select **Generate SAS token and URL**.

    :::image type="content" source="media\distributed-tracing-share-traces\generate-sas-token-and-url.png" alt-text="Screenshot of ...":::

1. Copy the contents of the **Blob SAS URL** field. Anyone with access can download your trace by pasting this URL into a browser. <!-- Access to what? -->

## Delete trace

You should free up space in your blob storage by deleting the traces you'll no longer need. To delete a trace:

1. Navigate to your Container resource.
1. Choose the file you want to delete.
1. Select **Delete**.

:::image type="content" source="media\distributed-tracing-share-traces\container-delete-trace.png" alt-text="Screenshot of ...":::

## Next steps

- [Learn more about the distributed tracing web GUI](distributed-tracing.md)