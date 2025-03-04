---
title: Troubleshooting 4xx and 5xx erorrs using Reference String 
description: This article provides information about what a Reference String is, how to collect them, and use the Azure portal diagnostic tool for troubleshooting 4xx and 5xx errors.

author: Alej-b23 
ms.author: pagonzalez 
ms.service: azure-frontdoor 
ms.topic: concept-article 
ms.date: 12/03/2024

#CustomerIntent: As a web developer, I want troubleshoot my web application using a Reference String.
---

# Troubleshooting 4xx and 5xx errors using Reference String

A guide to understand and use Reference Strings for diagnosing and resolving issues with Azure Front Door.

## Prerequisites

* You must have an Azure Front Door profile. To create a profile, see [Creating an Azure Front Door profile](create-front-door-portal.md).

## What is a Reference String?

A Reference String, also known as a RefString, is a short string appended by Azure Front Door to the HTTP response headers of each request. It provides details on how the request was processed, including the point of presence (POP) and backend status.

Reference Strings can help you troubleshoot and resolve issues with Azure Front Door, such as cache misses, backend failures, and latency problems. You can identify the root cause and take appropriate actions to fix it by analyzing the Reference String of the requests.

> [!NOTE] 
> If you encounter an error page from Microsoft services, it will already include a Reference String for the request that generated the error page. In such cases, you can skip directly to the diagnostic step. 

## How to gather a Reference String

To gather a Reference String, you need to capture the HTTP response headers of the requests and look for the header named **X-Azure-Ref**. This header contains the Reference String, encoded in Base64. You can use different methods to capture the HTTP response headers, depending on your preference and situation. Here is an example of how to obtain a Reference String from the Microsoft Edge Browser:

#### [Microsoft Edge Browser](#tab/edge)

1. Open the browser's developer tools by pressing `F12` or `Ctrl+Shift+I`.

1. Go to the **Network** tab.

1. Refresh the page or perform the action that triggers the request.

1. Locate the specific request in the list and find the **X-Azure-Ref** header in the response headers section.

1. Copy the value of the **X-Azure-Ref** header to use with the Reference String troubleshooting tool in the Azure portal.

For more information, see [Inspect network activity - Microsoft Edge Developer documentation](/microsoft-edge/devtools-guide-chromium/network/).

Example of how to obtain a Reference String from Microsoft Edge Browser:

:::image type="content" source="media/refstring/refstring-edge-browser-step.png" alt-text="Screenshot of RefString example in Microsoft Edge Browser." lightbox="media/refstring/refstring-edge-browser-step-expanded.png":::

---

## How to use a Reference String with some of our troubleshooting tools
Azure Front Door uses a Reference String to manage 4xx and 5xx errors. The following are the steps to use the diagnostic tool with a Reference String for tracking and diagnosing connectivity issues:

1.	Navigate to your Azure Front Door Profile.

1.	Select the **Diagnose and solve problems** menu.
 
    :::image type="content" source="media/refstring/refstring-step-one-portal.png" alt-text="Screenshot showing the first step in diagnosing problems using a Reference String." lightbox="media/refstring/refstring-step-one-portal.png":::

1.	Scroll down and select **Connectivity** under the **Common problems** section.

    :::image type="content" source="media/refstring/refstring-step-two-portal.png" alt-text="Screenshot showing the second step in diagnosing problems using a Reference String." lightbox="media/refstring/refstring-step-two-portal.png":::

1.	In the box **What issue are you having?** select **Select a problem subtype** and choose **4xx and 5xx errors** on the drop down-menu, then select the **Next**.

    :::image type="content" source="./media/refstring/refstring-step-three-portal.png" alt-text="Screenshot showing the third step in diagnosing problems using a Reference String." lightbox="media/refstring/refstring-step-three-portal.png":::
 
1.	Enter your Reference String in the box within the **4xx and 5xx errors** section. You input the Reference String given to you from your request under the **Tracking Reference – RefString** field.

    :::image type="content" source="media/refstring/refstring-step-four-portal.png" alt-text="Screenshot showing the fourth step in diagnosing problems using a Reference String." lightbox="media/refstring/refstring-step-four-portal.png":::

1. Finally, select **Run Diagnostics** to identify the cause of the issue, which explains the failure if it's a known problem.

    An example of a result displaying an issue: 

    :::image type="content" source="media/refstring/refstring-example.png" alt-text="Screenshot showing an example of the diagnosis at work using a Reference String." lightbox="media/refstring/refstring-example.png":::

    > [!NOTE] 
    > The diagnostic capabilities may require up to 15 minutes to deliver results. We ask for your patience that you allow the process to finish before taking further action.

### Alternative option

If you choose not to use the diagnostic tool, you can include a Reference String when submitting a support ticket. Additionally, you can enable the **Access Logs** feature to receive updates on RefString data directly in the Azure portal. 

For more information on tracking references and access log parameters, see [Monitor metrics and logs in Azure Front Door](front-door-diagnostics.md#access-log), which highlights specific fields in access logs that help identify various types of errors.

## Next steps

* To learn more about navigating common issues, see [Front Door Troubleshooting Issues](troubleshoot-issues.md). 
* For answers to common questions, see [Azure Front Door FAQ](front-door-faq.yml).