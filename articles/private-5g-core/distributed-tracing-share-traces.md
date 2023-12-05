---
title: Export and share traces
titleSuffix: Azure Private 5G Core 
description: In this how-to guide, learn how to export and share your detailed traces for diagnostics.
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 05/31/2023
ms.custom: template-how-to
---

# Export and share traces

Azure Private 5G Core offers a distributed tracing web GUI, which you can use to collect detailed traces for signaling flows involving packet core instances. You can export these traces and upload them alongside a support request to help your support representative provide troubleshooting assistance.

## Prerequisites

- Ensure you can sign in to the Azure portal using an account with access to the active subscription you identified in [Complete the prerequisite tasks for deploying a private mobile network](complete-private-mobile-network-prerequisites.md). This account must have the built-in Contributor role at the subscription scope.
- Ensure you can sign in to the distributed tracing web GUI as described in [Distributed tracing](distributed-tracing.md).

## Export trace from the distributed tracing web GUI

1. Sign in to the distributed tracing web GUI as described in [Access the distributed tracing web GUI](distributed-tracing.md#access-the-distributed-tracing-web-gui).
1. In the **Search** tab, specify the SUPI and time for the event you're interested in and select **Search**.
    
    :::image type="content" source="media\distributed-tracing-share-traces\distributed-tracing-search.png" alt-text="Screenshot of the Search display in the distributed tracing web G U I, showing the S U P I search field and date and time range options.":::

1. Find the relevant trace in the **Diagnostics Search Results** tab and select it.

    :::image type="content" source="media\distributed-tracing\distributed-tracing-search-results.png" alt-text="Screenshot of search results on a specific S U P I in the distributed tracing web G U I. It shows matching Successful P D U Session Establishment records.":::

1. Select **Export** and save the file locally.

    :::image type="content" source="media\distributed-tracing-share-traces\distributed-tracing-summary-view-export.png" alt-text="Screenshot of the Summary view of a specific trace in the distributed tracing web G U I, providing information on a Successful P D U Session Establishment record. The Export button in the top ribbon is highlighted." lightbox="media\distributed-tracing-share-traces\distributed-tracing-summary-view-export.png":::

Your trace is now ready to share with Azure support. To open a support request and share the trace with Azure support, see [How to open a support request for Azure Private 5G Core](open-support-request.md). To create a diagnostics package, see [Gather diagnostics using the Azure portal](/azure/private-5g-core/gather-diagnostics).

## Next steps

- [Gather diagnostics using the Azure portal](/azure/private-5g-core/gather-diagnostics)
- [Open a support request for Azure Private 5G Core](open-support-request.md)
- [Learn more about the distributed tracing web GUI](distributed-tracing.md)
