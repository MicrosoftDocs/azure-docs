---
title: How to create an Azure support request for an Enterprise Agreement issue
description: Enterprise Agreement customers who need assistance can use the Azure portal to find self-service solutions and to create and manage support requests.
ms.topic: troubleshooting
ms.date: 04/05/2023
ms.author: banders
author: bandersmsft
ms.reviewer: sapnakeshari
ms.service: cost-management-billing
ms.subservice: billing
---

# Create an Azure support request for an Enterprise Agreement issue

Azure enables you to create and manage support requests, also known as support tickets, for Enterprise Agreements. You can create and manage requests in the [Azure portal](https://portal.azure.com), which is covered in this article. You can also create and manage requests programmatically, using the [Azure support ticket REST API](/rest/api/support), or by using [Azure CLI](/cli/azure/azure-cli-support-request).

> [!NOTE]
> The Azure portal URL is specific to the Azure cloud where your organization is deployed.
>
>- Azure portal for commercial use is: [https://portal.azure.com](https://portal.azure.com)
>- Azure portal for Germany is: `https://portal.microsoftazure.de`
>- Azure portal for the United States government is: [https://portal.azure.us](https://portal.azure.us)

Azure provides unlimited support for subscription management, which includes billing, quota adjustments, and account transfers. You need a support plan for technical support. For more information, see [Compare support plans](https://azure.microsoft.com/support/plans).

## Getting started

You can get to **Help + support** in the Azure portal. It's available from the Azure portal menu, the global header, or the resource menu for a service. Before you can file a support request, you must have appropriate permissions.

### Azure role-based access control

To create a support request for an Enterprise Agreement, you must be an Enterprise Administrator or Partner Administrator associated with an enterprise enrollment. 

### Go to Help + support from the global header

To start a support request from anywhere in the Azure portal:

1. Select the question mark symbol in the global header, then select **Help + support**.

   :::image type="content" source="media/how-to-create-azure-support-request-ea/help-support-new-lower.png" alt-text="Screenshot of the Help menu in the Azure portal.":::

1. Select **Create a support request**. Follow the prompts to provide information about your problem. We'll suggest some possible solutions, gather details about the issue, and help you submit and track the support request.

   :::image type="content" source="media/how-to-create-azure-support-request-ea/new-support-request-2-lower.png" alt-text="Screenshot of the Help + support page with Create a support request link.":::

### Go to Help + support from a resource menu

To start a support request:

1. From the resource menu, in the **Support + troubleshooting** section, select **New Support Request**.

   :::image type="content" source="media/how-to-create-azure-support-request-ea/in-context-2-lower.png" alt-text="Screenshot of the New Support Request option in the resource pane.":::

1. Follow the prompts to provide us with information about the problem you're having. When you start the support request process from a resource, some options are pre-selected for you.

## Create a support request

We'll walk you through some steps to gather information about your problem and help you solve it. Each step is described in the following sections.

### Problem description

1. Type a summary of your issue and then select **Issue type**. 
1. In the **Issue type** list, select **Enrollment administration** for EA portal related issues.  
    :::image type="content" source="./media/how-to-create-azure-support-request-ea/select-issue-type-enrollment-administration.png" alt-text="Screenshot showing Select Enrollment administration." lightbox="./media/how-to-create-azure-support-request-ea/select-issue-type-enrollment-administration.png" :::
1. For **Enrollment number**, select the enrollment number. 
    :::image type="content" source="./media/how-to-create-azure-support-request-ea/select-enrollment.png" alt-text="Screenshot showing Select Enrollment number." :::
1. For **Problem type**, select the issue category that best describes the type of problem that you have.  
    :::image type="content" source="./media/how-to-create-azure-support-request-ea/select-problem-type.png" alt-text="Screenshot showing Select a problem type." :::
1. For **Problem subtype**, select a problem subcategory. 

After you've provided all of these details, select **Next: Solutions**.

### Recommended solution

Based on the information you provided, we'll show you recommended solutions you can use to try to resolve the problem. In some cases, we may even run a quick diagnostic. Solutions are written by Azure engineers and will solve most common problems.

If you're still unable to resolve the issue, continue creating your support request by selecting **Next: Details**.

### Other details

Next, we collect more details about the problem. Providing thorough and detailed information in this step helps us route your support request to the right engineer.

1. On the Details tab, complete the **Problem details** section so that we have more information about your issue. If possible, tell us when the problem started and any steps to reproduce it. You can upload a file, such as a log file or output from diagnostics. For more information on file uploads, see [File upload guidelines](../../azure-portal/supportability/how-to-manage-azure-support-request.md#file-upload-guidelines).

1. In the **Share diagnostic information** section, select **Yes** or **No**. Selecting **Yes** allows Azure support to gather [diagnostic information](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) from your Azure resources. If you prefer not to share this information, select **No**. In some cases, there will be more options to choose from.

1. In the **Support method** section, select the severity of the issue. The maximum severity level depends on your [support plan](https://azure.microsoft.com/support/plans).

1. Provide your preferred contact method, your availability, and your preferred support language.

1. Next, complete the **Contact info** section so we know how to contact you.  
    :::image type="content" source="./media/how-to-create-azure-support-request-ea/details-tab.png" alt-text="Screenshot showing the Details tab." lightbox="./media/how-to-create-azure-support-request-ea/details-tab.png" :::

Select **Next: Review + create** when you've completed all of the necessary information.

### Review + create

Before you create your request, review all of the details that you'll send to support. You can select **Previous** to return to any tab if you need to make changes. When you're satisfied the support request is complete, select **Create**.

A support engineer will contact you using the method you indicated. For information about initial response times, see [Support scope and responsiveness](https://azure.microsoft.com/support/plans/response/).

## Can't create request with Microsoft Account

If you have a Microsoft Account (MSA) and you aren't able to create an Azure support ticket, use the following steps to file a support case. Microsoft accounts are created for services including Outlook, Windows Live, and Hotmail.

To create an Azure support ticket, an *organizational account* must have the EA administrator role or Partner administrator role.

If you have an MSA, have an administrator create an organizational account for you. An enterprise administrator or partner administrator must then add your organizational account as an enterprise administrator or partner administrator. Then you can use your organizational account to file a support request.

- To add an Enterprise Administrator, see [Create another enterprise administrator](ea-portal-administration.md#create-another-enterprise-administrator).
- To add a Partner Administrator, see [Manage partner administrators](ea-partner-portal-administration.md#manage-partner-administrators).

## Next steps

Follow these links to learn more:

* [How to manage an Azure support request](../../azure-portal/supportability/how-to-manage-azure-support-request.md)
* [Azure support ticket REST API](/rest/api/support)
* Engage with us on [Twitter](https://twitter.com/azuresupport)
* Get help from your peers in the [Microsoft Q&A question page](/answers/products/azure)
* Learn more in [Azure Support FAQ](https://azure.microsoft.com/support/faq)
