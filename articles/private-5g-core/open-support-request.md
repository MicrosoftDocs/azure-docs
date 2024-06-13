---
title: How to open a support request 
titleSuffix: Azure Private 5G Core
description: This article guides you through how to submit a support request if you have a problem with your AP5GC service. 
author: robswain
ms.author: robswain
ms.service: private-5g-core
ms.topic: how-to
ms.date: 05/31/2023
ms.custom: template-how-to
---

# Get support for your Azure Private 5G Core service

If you need help or notice problems with Azure Private 5G Core (AP5GC), while you are using a release that is within its [Support lifetime](support-lifetime.md) you can raise a support request (also known as a support ticket). This article describes how to raise support requests for Azure Private 5G Core.

> [!IMPORTANT]
> You must always set **Service type** to **Azure Private 5G Core** when raising a support request for any issues related to AP5GC, even if the issue involves another Azure service. Selecting the wrong service type may cause your request to be delayed.

Azure provides unlimited support for subscription management, which includes billing, quota adjustments, and account transfers. For technical support, you need a support plan, such as Microsoft Unified Support or Premier Support.

## Prerequisites

You must have an **Owner**, **Contributor**, or **Support Request Contributor** role in your Azure Private 5G Core subscription, or a custom role with [Microsoft.Support/*](../role-based-access-control/resource-provider-operations.md#microsoftsupport) at the subscription level.

## 1. Generate a support request in the Azure portal

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Select the question mark icon in the top menu bar.
1. Select the **Help + support** button. 
1. Select **Create a support request**.

## 2. Enter a description of the problem or the change

1. Concisely describe your problem or the change you need in the **Summary** box.
1. Select an **Issue type** from the drop-down menu.
1. Select your **Subscription** from the drop-down menu. Choose the subscription where you're noticing the problem or need a change. The support representative assigned to your case will only be able to access resources in the subscription you specify. If the issue applies to multiple subscriptions, you can mention other subscriptions in your description, or by sending a message later. However, the support representative will only be able to work on subscriptions to which you have access.

    > [!NOTE]
    > The remaining steps will vary depending on which options you select. For example, you won't be prompted to select a resource for a billing enquiry.

1. A new **Service** option will appear giving you the option to select either **My services** or **All services**. Select **My services**.
1. In **Service type** select **Azure Private 5G Core** from the drop-down menu.
1. A new **Resource** option will appear. Select the resource you need help with, or select **General question**.
1. A new **Problem type** option will appear. Select the problem type that most accurately describes your issue from the drop-down menu.
1. A new **Problem subtype** option will appear. Select the problem subtype that most accurately describes your issue from the drop-down menu.
1. Select **Next**.

## 3. Assess the recommended solutions

Based on the information you provided, we might show you recommended solutions you can use to try to resolve the problem. In some cases, we might even run a quick diagnostic. Solutions are written by Azure engineers and will solve most common problems.

If you're still unable to resolve the issue, continue creating your support request by selecting **Return to support request** and then **Next**.

## 4. Enter additional details

In this section, we collect more details about the problem or the change and how to contact you. Providing thorough and detailed information in this step helps us route your support request to the right engineer.

You should always collect diagnostics as soon as possible after encountering an issue and submit them with your support request using the **File upload** option. See [Gather diagnostics using the Azure portal](/azure/private-5g-core/gather-diagnostics).

> [!TIP]
> If you try to upload a large file over a slow internet connection, the upload may time out. In this case, submit your request without attaching the file. Your support  representative will provide a Secure File Exchange link to upload your file(s). See [How to securely transfer files to Microsoft Support](/troubleshoot/azure/general/secure-file-exchange-transfer-files) for more information.

## 5. Review and create your support request

Before creating your request, review the details and diagnostics that you'll send to support. If you want to change your request or the files you've uploaded, select **Previous** to return to any tab. When you're happy with your request, select **Create**.

## Next steps

Learn how to [Manage an Azure support request](../azure-portal/supportability/how-to-manage-azure-support-request.md).
