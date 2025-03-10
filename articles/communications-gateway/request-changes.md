---
title: Get support or request changes for Azure Communications Gateway
description: This article guides you through how to submit support requests if you have a problem with your service or require changes to it.
author: GemmaWakeford
ms.author: gwakeford
ms.service: azure-communications-gateway
ms.topic: how-to
ms.date: 01/08/2023
---

# Get support or request changes to your Azure Communications Gateway

If you notice problems with Azure Communications Gateway or you need Microsoft to make changes, you can raise a support request (also known as a support ticket) in the Azure portal.

When you raise a request, we'll investigate. If we think the problem is caused by traffic from Zoom servers, we might ask you to raise a separate support request with Zoom.

This article provides an overview of how to raise support requests for Azure Communications Gateway. For more detailed information on raising support requests, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

[!INCLUDE [communications-gateway-lab-ticket-sla](includes/communications-gateway-lab-ticket-sla.md)]

## Prerequisites

We strongly recommend a Microsoft support plan that includes technical support, such as [Microsoft Unified Support](https://www.microsoft.com/en-us/unifiedsupport/overview).

You must have an **Owner**, **Contributor**, or **Support Request Contributor** role in your Azure Communications Gateway subscription, or a custom role with [Microsoft.Support/*](../role-based-access-control/resource-provider-operations.md#microsoftsupport) at the subscription level.

## Confirm that you need to raise an Azure Communications Gateway support request

Perform initial troubleshooting to help determine if you should raise an issue with Azure Communications Gateway or a different component. Raising issues for the correct component helps resolve your issues faster.

Raise an issue with Azure Communications Gateway if you experience an issue with:
- SIP and RTP exchanged by Azure Communications Gateway and your network.
- The Number Management Portal.
- Your Azure bill relating to Azure Communications Gateway.

If you're providing Zoom service, you'll need to raise a separate support request with Zoom for any changes that you need to your Zoom configuration.

## Create a support request in the Azure portal

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select the question mark icon in the top menu bar.
1. Select the **Help + support** button.
1. Select **Create a support request**. You might need to describe your issue first.

## Enter a description of the problem or the change

1. Concisely describe your problem or the change you need in the **Summary** box.
1. Select an **Issue type** from the drop-down menu.
1. Select your **Subscription** from the drop-down menu. Choose the subscription where you're noticing the problem or need a change. The support engineer assigned to your case can only access resources in the subscription you specify. If the issue applies to multiple subscriptions, you can mention other subscriptions in your description, or by sending a message later. However, the support engineer can only work on subscriptions to which you have access.
1. In the new **Service** option, select **My services**.
1. Set **Service type** to **Azure Communications Gateway**.
1. In the new **Problem type** drop-down, select the problem type that most accurately describes your issue.
    * Select **API Bridge Issue** if your Number Management Portal is returning errors when you try to gain access or carry out actions (only for Azure Communications Gateway issues).
    * Select **Configuration and Setup** if you experience issues during initial provisioning and onboarding, or if you want to change configuration for an existing deployment.
    * Select **Monitoring** for issues with metrics and logs.
    * Select **Voice Call Issue** if calls aren't connecting, have poor quality, or show unexpected behavior.
    * Select **Other issue or question** if your issue or question doesn't apply to any of the other problem types.
1. From the new **Problem subtype** drop-down menu, select the problem subtype that most accurately describes your issue. If the problem type you selected only has one subtype, the subtype is automatically selected.
1. Select **Next**.

## Assess the recommended solutions

Based on the information you provided, we might show you recommended solutions you can use to try to resolve the problem. In some cases, we might even run a quick diagnostic. Solutions are written by Azure engineers and will solve most common problems.

If you're still unable to resolve the issue, continue creating your support request by selecting **Return to support request** then selecting **Next**.

## Enter additional details

In this section, we collect more details about the problem or the change and how to contact you. Providing thorough and detailed information in this step helps us route your support request to the right engineer. For more information, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

## Review and create your support request

Before creating your request, review the details and diagnostic files that you're providing. If you want to change your request or the files that you're uploading, select **Previous** to return to any tab. When you're happy with your request, select **Create**.

## Next steps

> [!div class="nextstepaction"]
> [Learn how to manage an Azure support request](/azure/azure-portal/supportability/how-to-manage-azure-support-request).

