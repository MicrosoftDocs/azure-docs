---
title: Get support or request changes for Azure Communications Gateway
description: This article guides you through how to submit support requests if you have a problem with your service or require changes to it. 
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to 
ms.date: 01/08/2023
---

# Get support or request changes to your Azure Communications Gateway

If you notice problems with Azure Communications Gateway or you need Microsoft to make changes, you can raise a support request (also known as a support ticket). This article provides an overview of how to raise support requests for Azure Communications Gateway. For more detailed information on raising support requests, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

Azure provides unlimited support for subscription management, which includes billing, quota adjustments, and account transfers. For technical support, you need a support plan, such as [Microsoft Unified Support](https://www.microsoft.com/en-us/unifiedsupport/overview) or [Premier Support](https://www.microsoft.com/en-us/unifiedsupport/premier).

## Prerequisites

Perform initial troubleshooting to help determine if you should raise an issue with Azure Communications Gateway or a different component. We provide some examples where you should raise an issue with Azure Communications Gateway. Raising issues for the correct component helps resolve your issues faster.

Raise an issue with Azure Communications Gateway if you experience an issue with:
- SIP and RTP exchanged by Azure Communications Gateway and your network.
- The Number Management Portal.
- Your Azure bill relating to Azure Communications Gateway.

You must have an **Owner**, **Contributor**, or **Support Request Contributor** role in your Azure Communications Gateway subscription, or a custom role with [Microsoft.Support/*](../role-based-access-control/resource-provider-operations.md#microsoftsupport) at the subscription level.

## 1. Generate a support request in the Azure portal

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select the question mark icon in the top menu bar.
1. Select the **Help + support** button. 
1. Select **Create a support request**.

## 2. Enter a description of the problem or the change

1. Concisely describe your problem or the change you need in the **Summary** box.
1. Select an **Issue type** from the drop-down menu. 
1. Select your **Subscription** from the drop-down menu. Choose the subscription where you're noticing the problem or need a change. The support engineer assigned to your case will only be able to access resources in the subscription you specify. If the issue applies to multiple subscriptions, you can mention other subscriptions in your description, or by sending a message later. However, the support engineer will only be able to work on subscriptions to which you have access. 
1. A new **Service** option will appear giving you the option to select either **My services** or **All services**. Select **My services**.
1. In **Service type** select **Azure Communications Gateway** from the drop-down menu.
1. A new **Problem type** option will appear. Select the problem type that most accurately describes your issue from the drop-down menu.
    * Select **API Bridge Issue** if your Number Management Portal is returning errors when you try to gain access or carry out actions.
    * Select **Configuration and Setup** if you experience issues during initial provisioning and onboarding, or if you want to change configuration for an existing deployment.
    * Select **Monitoring** for issues with metrics and logs.
    * Select **Voice Call Issue** if calls aren't connecting, have poor quality, or show unexpected behavior.
    * Select **Other issue or question** if your issue or question doesn't apply to any of the other problem types. 
1. A new **Problem subtype** option will appear. Select the problem subtype that most accurately describes your issue from the drop-down menu. If the problem type you selected only has one subtype, the subtype is automatically selected.
1. Select **Next**.

## 3. Assess the recommended solutions

Based on the information you provided, we might show you recommended solutions you can use to try to resolve the problem. In some cases, we might even run a quick diagnostic. Solutions are written by Azure engineers and will solve most common problems.

If you're still unable to resolve the issue, continue creating your support request by selecting **Return to support request** then selecting **Next**.

## 4. Enter additional details

In this section, we collect more details about the problem or the change and how to contact you. Providing thorough and detailed information in this step helps us route your support request to the right engineer. For more information, see [Create an Azure support request](../azure-portal/supportability/how-to-create-azure-support-request.md).

## 5. Review and create your support request

Before creating your request, review the details and diagnostics that you'll send to support. If you want to change your request or the files you've uploaded, select **Previous** to return to any tab. When you're happy with your request, select **Create**.

## Next steps

Learn how to [Manage an Azure support request](../azure-portal/supportability/how-to-manage-azure-support-request.md).

