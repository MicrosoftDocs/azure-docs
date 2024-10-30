---
title: Troubleshoot Azure Front Door with RefString 
description: This article provides information about what a RefString is and how to gather them.
author: Alej-b23 
ms.author: pagonzalez 
ms.service: azure-frontdoor 
ms.topic: concept-article 
ms.date: 09/06/2024

#CustomerIntent: As a web developer, I want troubleshoot my web application using a RefString.
---

# Troubleshoot Azure Front Door with RefString

A guide to understand and use RefStrings for diagnosing and resolving issues with Azure Front Door.

## Prerequisites

* You must have an Azure Front Door profile. To create a profile, see [Creating an Azure Front Door profile](create-front-door-portal.md).

## What is a RefString?

A RefString is a short string appended by Azure Front Door to the HTTP response headers of each request. It provides details on how the request was processed, including the point of presence (POP) and backend status.

RefStrings can help you troubleshoot and resolve issues with Azure Front Door, such as cache misses, routing errors, backend failures, and latency problems. You can identify the root cause and take appropriate actions to fix it by analyzing the RefStrings of the requests.

> [!NOTE] 
> If you encounter an error page from Microsoft services, it will already include a RefString for the request that generated the error page. In such cases, you can skip directly to the diagnostic step. 

## How to gather a RefString

To gather a RefString, you need to capture the HTTP response headers of the requests and look for the header named **X-Azure-Ref**. This header contains the RefString, encoded in Base64. You can use different methods to capture the HTTP response headers, depending on your preference and situation. Here are a few examples of how to obtain a RefString from various browsers and applications:

#### [Microsoft Edge Browser](#tab/edge)

1. Open the browser's developer tools by pressing `F12` or `Ctrl+Shift+I`.

1. Go to the **Network** tab.

1. Refresh the page or perform the action that triggers the request.

1. Locate the specific request in the list and find the **X-Azure-Ref** header in the response headers section.

1. Copy the value of the **X-Azure-Ref** header to use with the RefString troubleshooting tool in the Azure portal.

For more information, see [Inspect network activity - Microsoft Edge Developer documentation](/microsoft-edge/devtools-guide-chromium/network/).

Example of how to obtain a RefString from Microsoft Edge Browser:

:::image type="content" source="media/refstring/refstring-edge-browser-step.png" alt-text="Screenshot of RefString example in Microsoft Edge Browser." lightbox="media/refstring/refstring-edge-browser-step-expanded.png":::

#### [Google Chrome](#tab/chrome)

For Google Chrome browsers, see [Inspect network activity - Google Chrome Developer documentation](https://developer.chrome.com/docs/devtools/network).

#### [cURL](#tab/curl)

To obtain headers with cURL, use the **-I** or **—include** option to include the HTTP response headers in the output. Look for the **X-Azure-Ref** header in the output, and copy the value of the header.

#### [Fiddler](#tab/fiddler)

1. Launch Fiddler and start capturing HTTP traffic. Refresh the page or perform the action that generates the request.

1. Choose the request from the list and navigate to the Inspectors tab.

1. Switch to the Raw view, locate the **X-Azure-Ref** header in the response headers, copy its value, and decode it using a Base64 decoder.

To learn more about viewing and capturing network traffic with Fiddler, see [Web Debugging - Capture Network Traffic](https://www.telerik.com/fiddler/usecases/web-debugging). 

---

## How to use a RefString with some of our troubleshooting tools
Azure Front Door uses a RefString to manage 4xx and 5xx errors. The following are the steps to use the diagnostic tool with a RefString for tracking and diagnosing connectivity issues:

1.	Navigate to your Azure Front Door Profile.

1.	Select the **Diagnose and solve problems** menu.
 
    :::image type="content" source="media/refstring/refstring-step-one-portal.png" alt-text="Screenshot showing the first step in diagnosing problems using a RefString." lightbox="media/refstring/refstring-step-one-portal.png":::

1.	Scroll down and select **Connectivity** under the **Common problems** section.

    :::image type="content" source="media/refstring/refstring-step-two-portal.png" alt-text="Screenshot showing the second step in diagnosing problems using a RefString." lightbox="media/refstring/refstring-step-two-portal.png":::

1.	In the box **What issue are you having?** select **Select a problem subtype** and choose **4xx and 5xx errors** on the drop down-menu, then select the **Next**.

    :::image type="content" source="./media/refstring/refstring-step-three-portal.png" alt-text="Screenshot showing the third step in diagnosing problems using a RefString." lightbox="media/refstring/refstring-step-three-portal.png":::
 
1.	Enter your RefString in the box within the **4xx and 5xx errors** section. You input the Restring given to you from your request under the **Tracking Reference – RefString** field.

    :::image type="content" source="media/refstring/refstring-step-four-portal.png" alt-text="Screenshot showing the fourth step in diagnosing problems using a RefString." lightbox="media/refstring/refstring-step-four-portal.png":::

1. Finally, select **Run Diagnostics** to identify the cause of the issue, which explains the failure if it's a known problem.

    An example of a result displaying an issue: 

    :::image type="content" source="media/refstring/refstring-example.png" alt-text="Screenshot showing an example of the diagnosis at work using a RefString." lightbox="media/refstring/refstring-example.png":::

    > [!NOTE] 
    > The diagnostic capabilities may require up to 15 minutes to deliver results. We ask for your patience that you allow the process to finish before taking further action.

### Alternative option

If you choose not to use the diagnostic tool, you can include a RefString when submitting a support ticket. Additionally, you can enable the **Access Logs** feature to receive updates on RefString data directly in the Azure portal. For more information on tracking references and access log parameters, see [Monitor metrics and logs in Azure Front Door](front-door-diagnostics.md#access-log). 

This article highlights specific fields in access logs that help identify various types of errors:

* **Cache misses:** RefString indicate whether a request was served from the cache and provide reasons if it wasn't.

    Example: **NOCACHE** means the request wasn't eligible for caching, **MISS** means no valid cache entry existed, and **STALE** means the cache entry was expired.

* **Routing errors:** RefString can reveal if a request was routed correctly to the backend and the reason.
        
    Example: **FALLBACK** means rerouted due to primary backend issues, and **OVERRIDE** means sent to an alternative backend against routing rules.

* **Backend failures:** RefString indicate if delivery to the backend succeeded and explain any issues.
    
    Example: **TIMEOUT** means the response took too long, **CONNFAIL** means connection failed, and **ERROR** indicates an error response from the backend.

* **Latency problems:** RefString detail Azure Front Door's processing time and stage durations.

    Example: **DURATION** shows total handling time, **RTT** shows round-trip time, and **TTFB** shows the time taken to receive the first byte from the backend.

## Next steps

* To learn more about navigating common issues, see [Front Door Troubleshooting Issues](troubleshoot-issues.md). 
* For answers to common questions, see [Azure Front Door FAQ](front-door-faq.yml).