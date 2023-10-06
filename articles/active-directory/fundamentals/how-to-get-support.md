---
title: Find help and get support for Microsoft Entra ID
description: Instructions about how to get help and open a support request for Microsoft Entra ID.
services: active-directory
author: shlipsey3                
manager: amycolannino
ms.service: active-directory
ms.topic: troubleshooting
ms.subservice: fundamentals
ms.workload: identity
ms.date: 09/12/2023
ms.author: sarahlipsey
ms.reviewer: jeffsta
---
# Find help and get support for Microsoft Entra ID

Microsoft documentation and learning content provide quality support and troubleshooting information, but if you have a problem not covered in our content, there are several options to get help and support for Microsoft Entra ID. This article provides the options to find support from the Microsoft community and how to submit a support request with Microsoft.

## Ask the Microsoft community

Start with our Microsoft community members who may have an answer to your question. These communities provide support, feedback, and general discussions on Microsoft products and services. Before creating a support request, check out the following resources for answers and information. 

* For how-to information, quickstarts, or code samples for IT professionals and developers, see the [technical documentation at learn.microsoft.com](../index.yml).
* Post a question to [Microsoft Q&A](/answers/products/) to get answers to your identity and access questions directly from Microsoft engineers, Azure Most Valuable Professionals (MVPs) and members of our expert community. 
* The [Microsoft Technical Community](https://techcommunity.microsoft.com/) is the place for our IT pro partners and customers to collaborate, share, and learn. Join the community to post questions and submit your ideas.
* The [Microsoft Technical Community Info Center](https://techcommunity.microsoft.com/t5/Community-Info-Center/ct-p/Community-Info-Center) is used for announcements, blog posts, ask-me-anything (AMA) interactions with experts, and more.

### Microsoft Q&A best practices

Microsoft Q&A is Azure's recommended source for community support. We recommend using one of the following tags when posting a question. Check out our [tips for writing quality questions](/answers/support/quality-question).

| Component/area| Tags  |
|------------|---------------------------|
| Microsoft Authentication Library (MSAL)                                     | [[`msal`]](/answers/topics/azure-ad-msal.html)                            |
| Open Web Interface for .NET (OWIN) middleware                               | [[`azure-active-directory`]](/answers/topics/azure-active-directory.html) |
| [Microsoft Entra B2B / External Identities](../external-identities/what-is-b2b.md) | [[`azure-ad-b2b`]](/answers/topics/azure-ad-b2b.html)                     |
| [Azure AD B2C](https://azure.microsoft.com/services/active-directory-b2c/)  | [[`azure-ad-b2c`]](/answers/topics/azure-ad-b2c.html)                     |
| [Microsoft Graph API](https://developer.microsoft.com/graph/)               | [[`azure-ad-graph`]](/answers/topics/azure-ad-graph.html)                 |
| All other authentication and authorization areas                            | [[`azure-active-directory`]](/answers/topics/azure-active-directory.html) |

## Open a support request

If you're unable to find answers by using self-help resources, you can open an online support request. You should open a support request for only a single problem, so that we can connect you to the support engineers who are subject matter experts for your problem. Microsoft Entra engineering teams prioritize their work based on incidents that are generated from support, so you're often contributing to service improvements.

Support is available online and by phone for Microsoft Azure paid and trial subscriptions on global technical, pre-sales, billing, and subscription issues. Phone support and online billing support are available in additional languages.

Explore the range of [Azure support options and choose the plan](https://azure.microsoft.com/support/plans) that best fits your scenario, whether you're an IT admin managing your organization's tenant, a developer just starting your cloud journey, or a large organization deploying business-critical, strategic applications. Azure customers can create and manage support requests in the Azure portal.

- If you already have an Azure Support Plan, [open a support request here](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/newsupportrequest).

- If you're not an Azure customer, you can open a support request with [Microsoft Support for business](https://support.serviceshub.microsoft.com/supportforbusiness).

> [!NOTE]
> If you're using Azure AD B2C, open a support ticket by first switching to a Microsoft Entra tenant that has an Azure subscription associated with it. Typically, this is your employee tenant or the default tenant created for you when you signed up for an Azure subscription. To learn more, see [how an Azure subscription is related to Microsoft Entra ID](./how-subscriptions-associated-directory.md).

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com) as at least a [Service Support Administrator](../roles/permissions-reference.md#service-support-administrator).

1. Browse to **Learn & support** > **New support request**.

1. Follow the prompts to provide us with information about the problem you're having.

We'll walk you through some steps to gather information about your problem and help you solve it. Each step is described in the following sections.

### 1. Problem description
   
1. Under **Problem description**, enter a brief description in the **Summary** field.

1. Select an **Issue type**.

    Options are **Billing** and **Subscription management**. Once an option is selected, **Problem type** and **Problem subtype** fields appear, pre-populated with options associated with the initial selection.

1. Select **Next** at the bottom of the page. 

### 2. Recommended solution

Based on the information you provided, we'll show you recommended solutions you can use try to resolve the problem. Solutions are written by Azure engineers and will solve most common problems.

If you're still unable to resolve the issue, select **Next** to continue creating the support request.

### 3. Additional details

Next, we collect more details about the problem. Providing thorough and detailed information in this step helps us route your support request to the right engineer.

1. Complete the **Problem details** section so that we have more information about your issue. If possible, tell us when the problem started and any steps to reproduce it. You can upload a file, such as a log file or output from diagnostics. For more information on file uploads, see [File upload guidelines](../../azure-portal/supportability/how-to-manage-azure-support-request.md#file-upload-guidelines).

1. In the **Advanced diagnostic information** section, select **Yes** or **No**.

    - Selecting **Yes** allows Azure support to gather [advanced diagnostic information](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/) from your Azure resources.
    - If you prefer not to share this information, select **No**. For more information about the types of files we might collect, see [Advanced diagnostic information logs](../../azure-portal/supportability/how-to-create-azure-support-request.md#advanced-diagnostic-information-logs) section.
    - In some scenarios, an administrator in your tenant may need to approve Microsoft Support access to your Microsoft Entra identity data.

1. In the **Support method** section, select your preferred contact method and support language.
    - Some details are pre-selected for you. 
    - The support plan and severity are populated based on your plan.
    - The maximum severity level depends on your [support plan](https://azure.microsoft.com/support/plans).

1. Next, complete the **Contact info** section so we know how to contact you.

Select **Next** when you've completed all of the necessary information.

### 4. Review + create

Before you create your request, review all of the details that you'll send to support. You can select **Previous** to return to any tab if you need to make changes. When you're satisfied the support request is complete, select **Create**.

A support engineer will contact you using the method you indicated. For information about initial response times, see [Support scope and responsiveness](https://azure.microsoft.com/support/plans/response/).

## Get Microsoft 365 admin center support

Support for Microsoft Entra ID in the [Microsoft 365 admin center](https://admin.microsoft.com) is offered for administrators through the admin center. Review the [support for Microsoft 365 for business article](/microsoft-365/admin).

## Stay informed
Things can change quickly. The following resources provide updates and information on the latest releases.

- [Azure Updates](https://azure.microsoft.com/updates/?category=identity): Learn about important product updates, roadmap, and announcements.

- [What's new in Microsoft Entra ID](whats-new.md): Get to know what's new in Microsoft Entra ID including the latest release notes, known issues, bug fixes, deprecated functionality, and upcoming changes.

- [Microsoft Entra identity blog](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/bg-p/Identity): Get news and information about Microsoft Entra ID.

##  Next steps

* [Post a question to Microsoft Q&A](/answers/products/)

* [Join the Microsoft Technical Community](https://techcommunity.microsoft.com/)]

* [Learn about the diagnostic data Azure identity support can access](https://azure.microsoft.com/support/legal/support-diagnostic-information-collection/)
