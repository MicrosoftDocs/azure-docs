---
title: How to create an Azure support request
description: Customers who need assistance can use the Azure portal to find self-service solutions and to create and manage support requests.
ms.assetid: fd6841ea-c1d5-4bb7-86bd-0c708d193b89
ms.topic: how-to
ms.custom: support-help-page
ms.date: 09/01/2021
---

# Create an Azure support request

Azure enables you to create and manage support requests, also known as support tickets. You can create and manage requests in the [Azure portal](https://portal.azure.com), which is covered in this article. You can also create and manage requests programmatically, using the [Azure support ticket REST API](/rest/api/support), or by using [Azure CLI](/cli/azure/azure-cli-support-request).

> [!NOTE]
> The Azure portal URL is specific to the Azure cloud where your organization is deployed.
>
>* Azure portal for commercial use is: [https://portal.azure.com](https://portal.azure.com)
>* Azure portal for Germany is: [https://portal.microsoftazure.de](https://portal.microsoftazure.de)
>* Azure portal for the United States government is: [https://portal.azure.us](https://portal.azure.us)

Azure provides unlimited support for subscription management, which includes billing, quota adjustments, and account transfers. For technical support, you need a support plan. For more information, see [Compare support plans](https://azure.microsoft.com/support/plans).

## Getting started

You can get to **Help + support** in the Azure portal. It's available from the Azure portal menu, the global header, or the resource menu for a service. Before you can file a support request, you must have appropriate permissions.

### Azure role-based access control

To create a support request, you must be an [Owner](../../role-based-access-control/built-in-roles.md#owner), [Contributor](../../role-based-access-control/built-in-roles.md#contributor) or be assigned to the [Support Request Contributor](../../role-based-access-control/built-in-roles.md#support-request-contributor) role at the subscription level. To create a support request without a subscription, for example an Azure Active Directory scenario, you must be an [Admin](../../active-directory/roles/permissions-reference.md).

### Go to Help + support from the global header

To start a support request from anywhere in the Azure portal:

1. Select the **?** in the global header, then select **Help + support**.

   :::image type="content" source="media/how-to-create-azure-support-request/helpandsupportnewlower.png" alt-text="Screenshot of the Help menu in the Azure portal.":::

1. Select **Create a support request**. Follow the prompts to provide information about your problem. We'll suggest some possible solutions, gather details about the issue, and help you submit and track the support request.

   :::image type="content" source="media/how-to-create-azure-support-request/newsupportrequest2lower.png" alt-text="Screenshot of the Help + support page with Create a support request link.":::

### Go to Help + support from a resource menu

To start a support request in the context of the resource you're currently working with:

1. From the resource menu, in the **Support + troubleshooting** section, select **New Support Request**.

   :::image type="content" source="media/how-to-create-azure-support-request/incontext2lower.png" alt-text="Screenshot of the New Support Request option in the resource pane.":::

1. Follow the prompts to provide us with information about the problem you're having. When you start the support request process from a resource, some options are pre-selected for you.

## Create a support request

We'll walk you through some steps to gather information about your problem and help you solve it. Each step is described in the following sections.

### Problem description

The first step of the support request process is to select an issue type. You'll then be prompted for more information, which can vary depending on what type of issue you selected. In most cases, you'll need to specify a subscription, briefly describe your issue, and select a problem type. If you select **Technical**, you'll need to specify the service that your issue relates to. Depending on the service, you'll see additional options for **Problem type** and **Problem subtype**.

:::image type="content" source="media/how-to-create-azure-support-request/basics2lower.png" alt-text="Screenshot of the Problem description step of the support request process.":::

Once you've provided all of these details, select **Next**.

### Recommended solution

Based on the information you provided, we'll show you recommended solutions you can use to try and resolve the problem. In some cases, we may even run a quick diagnostic. Solutions are written by Azure engineers and will solve most common problems.

If you're still unable to resolve the issue, continue creating your support request by selecting **Next**.

### Additional details

Next, we collect additional details about the problem. Providing thorough and detailed information in this step helps us route your support request to the right engineer.

1. Complete the **problem details** so that we have more information about your issue. If possible, tell us when the problem started and any steps to reproduce it. You can upload a file, such as a log file or output from diagnostics. For more information on file uploads, see [File upload guidelines](how-to-manage-azure-support-request.md#file-upload-guidelines).

1. In the **Share diagnostic information** section, select **Yes** or **No**. Selecting **Yes** allows Azure support to gather [diagnostic information](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) from your Azure resources. If you prefer not to share this information, select **No**. In some cases, there will be additional options to choose from, such as whether to allow access to a virtual machine's memory.

1. In the **Support method** section, select the severity of impact. The maximum severity level depends on your [support plan](https://azure.microsoft.com/support/plans).

1. Provide your preferred contact method, your availability, and your preferred support language.

1. Next, complete the **Contact info** section so we know how to contact you.

Select **Next** when you've completed all of the necessary information.

### Review + create

Before you create your request, review all of the details that you'll send to support. You can select **Previous** to return to any tab if you need to make changes. When you're satisfied the support request is complete, select **Create**.

A support engineer will contact you using the method you indicated. For information about initial response times, see [Support scope and responsiveness](https://azure.microsoft.com/support/plans/response/).

## Next steps

To learn more about self-help support options in Azure, watch this video:

> [!VIDEO https://www.youtube.com/embed/gNhzR5FE9DY]

Follow these links to learn more:

* [How to manage an Azure support request](how-to-manage-azure-support-request.md)
* [Azure support ticket REST API](/rest/api/support)
* [Send us your feedback and suggestions](https://feedback.azure.com/forums/266794-support-feedback)
* Engage with us on [Twitter](https://twitter.com/azuresupport)
* Get help from your peers in the [Microsoft Q&A question page](/answers/products/azure)
* Learn more in [Azure Support FAQ](https://azure.microsoft.com/support/faq)