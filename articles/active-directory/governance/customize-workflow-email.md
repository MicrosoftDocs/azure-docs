---
title: Customize emails sent out by workflow tasks
description: A step by step guide for customizing emails sent out using tasks within Lifecycle Workflows
author: owinfreyATL
ms.author: owinfrey
manager: amycolannino
ms.service: active-directory
ms.subservice: compliance
ms.topic: how-to
ms.date: 02/06/2023
ms.custom: template-how-to
---

# Customize emails sent out by workflow tasks (Preview)

Lifecycle Workflows provide several tasks that send out email notifications. Email notifications can be customized to suit the needs of a specific workflow. For a list of these tasks, see: [Lifecycle Workflows tasks and definitions (Preview)](lifecycle-workflow-tasks.md).

Emails tasks allow for the customization of the following aspects:

- Additional CC recipients
- Sender domain
- Organizational branding of the email
- Subject
- Message body
- Email language

> [!NOTE]
> To avoid additional security disclaimers, you should opt in to using customized domain and organizational branding.

For more information on these customizable parameters, see: [Common email task parameters](lifecycle-workflow-tasks.md#common-email-task-parameters).

## Prerequisites

- Azure AD Premium P2

For more information, see: [License requirements](what-are-lifecycle-workflows.md#license-requirements)

## Customize email using the Azure portal

When customizing an email sent via Lifecycle workflows, you can choose to customize either a new or existing task. These customizations are done the same way no matter if the task is new or existing, but the following steps walk you through updating an existing task. To customize emails sent out from tasks within workflows using the Azure portal, you'd follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. Type in **Identity Governance** in the search bar near the top of the page, and select it.

1. In the left menu, select **Lifecycle workflows (Preview)**. 

1. In the left menu, select **workflows (Preview)**.
    
1. On the left side of the screen, select **Tasks (Preview)**.

1. On the tasks screen, select the task for which you want to customize the email.

1. On the specific task screen, you're able to set CC to include others in the email outside of the default audience. 

1. Select the **Email Customization** tab.

1. On the email customization screen, enter a custom subject, message body, and the email language translation option that will be used to translate the message body of the email.
    :::image type="content" source="media/customize-workflow-email/customize-workflow-email-example.png" alt-text="Screenshot of an example of a customized email from a workflow.":::
1. After making changes, select **save** to capture changes to the customized email.


## Format attributes within customized emails

To further personalize customized emails, you can take advantage of dynamic attributes. With dynamic attributes by placing in specific attributes, you're able to specifically call out values such as a user's name, their generated Temporary Access Pass, or even their manager's email.

To use dynamic attributes within your customized emails, you must follow the formatting rules within the customized email. The proper format is:

{{**dynamic attribute**}}

The following screenshot is an example of the proper format for dynamic attributes within a customized email:

:::image type="content" source="media/customize-workflow-email/workflow-dynamic-attribute-example.png" alt-text="Screenshot of an example of dynamic attributes within a customized email.":::

When typing this it's written the following way:

```html
Welcome to the team, {{userGivenName}}

We're excited to have you join our growing team and look forward to a successful and memorable journey together.

We've already set up a few things to help you get started quickly and make your onboarding process as smooth as possible.

For more information and next steps, please contact your manager, {{managerDisplayName}} 

```

For a full list of dynamic attributes that can be used with customized emails, see:[Dynamic attributes within email](lifecycle-workflow-tasks.md#dynamic-attributes-within-email).

## Use custom branding and domain in emails sent out using workflows

Emails sent out using Lifecycle workflows can be customized to have your own company branding, and be sent out using your company domain. When you opt in to using custom branding and domain, every email sent out using Lifecycle Workflows reflect these settings. To enable these features the following prerequisites are required:

- A verified domain. To add a custom domain, see: [Managing custom domain names in your Azure Active Directory](../enterprise-users/domains-manage.md)
- Custom Branding set within Azure AD if you want to have your custom branding used in emails. To set organizational branding within your Azure tenant, see: [Configure your company branding (preview)](../fundamentals/how-to-customize-branding.md).

> [!NOTE]
> The recommendation is to use a domain that has the appropriate DNS records to facilitate email validation, like SPF, DKIM, DMARC, and MX as this then complies with the [RFC compliance](https://www.ietf.org/rfc/rfc2142.txt) for sending and receiving email. Please see [Learn more about Exchange Online Email Routing](/exchange/mail-flow-best-practices/mail-flow-best-practices) for more information.

After these prerequisites are satisfied, you'd follow these steps:

1. On the Lifecycle workflows page, select **Workflow settings (Preview)**.

1. On the settings page, with **email domain** you're able to select your domain from a drop-down list of your verified domains.
    :::image type="content" source="media/customize-workflow-email/workflow-email-settings.png" alt-text="Screenshot of workflow domain settings.":::
1. With the Use company branding banner logo setting, you're able to turn on whether or not company branding is used in emails.
    :::image type="content" source="media/customize-workflow-email/customize-email-logo-setting.png" alt-text="Screenshot of email logo setting.":::


## Customize email using Microsoft Graph

To customize email using Microsoft Graph API see: [workflow: createNewVersion](/graph/api/identitygovernance-workflow-createnewversion).

## Set custom branding and domain workflow settings in Lifecycle Workflows using Microsoft Graph

To turn on custom branding and domain feature settings in Lifecycle Workflows using Microsoft Graph API, see: [lifecycleManagementSettings resource type](/graph/api/resources/identitygovernance-lifecyclemanagementsettings)

## Next steps

- [Lifecycle Workflow tasks](lifecycle-workflow-tasks.md)
- [Manage workflow versions](manage-workflow-tasks.md)


