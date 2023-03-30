---
title: How to open a support request 
description: This article guides you through how to submit support requests if you have a problem with your AP5GC service. 
author: James-Green-Microsoft
ms.author: jamesgreen
ms.service: private-5g-core
ms.topic: how-to
ms.date: 03/30/2023
ms.custom: template-how-to
---

# [H1 heading here]

If you notice problems with Azure Private 5G Core (AP5GC), you can raise a support request (also known as a support ticket). This article provides an overview of how to raise support requests for Azure Private 5G Core. For more detailed information on raising support requests, see [Create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request).

Azure provides unlimited support for subscription management, which includes billing, quota adjustments, and account transfers. For technical support, you need a support plan, such as Microsoft Unified Support or Premier Support.

## Pre-requisites

You must have an **Owner**, **Contributor**, or **Support Request Contributor** role in your Azure Communications Gateway subscription, or a custom role with [Microsoft.Support/*](../role-based-access-control/resource-provider-operations.md#microsoftsupport) at the subscription level.

## Generate a support request in the Azure portal

1. Sign in to the [Azure portal](https://ms.portal.azure.com/).
1. Navigate to any resource in your AP5GC deployment.
1. Select **New support request** in the **Support + troubleshooting** section of the side menu.

## Enter the information relevant to your issue

1. In the **New support request** view enter the following information.

    |Field  |Value  |
    |---------|---------|
    |Issue type     | Select **Technical**.       |
    |Subscription   | Select the subscription in which the AP5GC resource was created.        |
    |Service        | Select **My services**.        |
    |Service type   | Search for and select **Azure Private 5G Core**.        |
    |Resource       | Select the **Mobile Network Resource** you have an issue with.        |
    |Summary        | Provide a title for your issue.        |
    |Problem type   | Select the category that best describes your issue from the drop down list.        |
    |Problem subtype| Select the category that best describes your issue from the drop down list.        |

1. Select **Next**.

## Check the recommended solution

The Azure portal may suggest a solution to some problems. Check if any provided solutions resolve the issue.

- If the solution resolves the issue, you do not need to proceed through this procedure.
- If the solution does not resolve the issue, select **Return to support request** and select **Next**.

## Submit the support request

1. Under **Additional details** enter the following information.

    |Field  |Value  |
    |---------|---------|
    |When did the problem start?     | Select a time when the issue started.        |
    |Description     | Provide a detailed description of the issue.        |
    |File upload     | Upload any snapshots from the error. Include any support diagnostics packages or traces.        |

    > [!IMPORTANT]
    > Support diagnostics package contains useful insights that are beneficial when troubleshooting failures and issues in Azure Private 5G Core.
    > To collect support diagnostics package, follow the instructions in [Gather diagnostics using the Azure portal](/azure/private-5g-core/gather-diagnostics).

1. Select **Review + create**.
1. Select **Create**.

## Next steps

Learn how to [Manage an Azure support request](../azure-portal/supportability/how-to-manage-azure-support-request.md).
