---
title: Conditional Access authentication context - Azure Active Directory
description: Create a custom Conditional Access policy using authentication context

services: active-directory
ms.service: active-directory
ms.subservice: conditional-access
ms.topic: how-to
ms.date: 04/26/2021

ms.author: joflore
author: MicrosoftGuyJFlo
manager: daveba
ms.reviewer: calebb

ms.collection: M365-identity-device-management
---
# Conditional Access: Authentication context with Privileged Identity Management

When users elevate to privileged roles in Azure AD the only thing administrators could require in the past was Azure AD Multi-Factor Authentication. Now, with Conditional Access authentication context, administrators can create more complex requirements. This policy template shows how to create an authentication context, how to add that context to a Conditional Access policy, and then how to apply that policy to a privileged identity role setting.

## Create an authentication context

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access** > **Authentication context**.
1. Select **New authentication context**.
1. Give your authentication context a **Name** and **Description**, ensure **Publish to apps** is checked, and select **Save**.

   :::image type="content" source="media/howto-conditional-access-policy-authentication-context/add-authentication-context.png" alt-text="Create an authentication context in the Azure portal":::

## Create a Conditional Access policy

:::image type="content" source="media/howto-conditional-access-policy-authentication-context/conditional-access-policy-authentication-context.png" alt-text="Conditional Access policy shown with an authenticaion context configured":::

1. Sign in to the **Azure portal** as a global administrator, security administrator, or Conditional Access administrator.
1. Browse to **Azure Active Directory** > **Security** > **Conditional Access**.
1. Select **New policy**.
1. Give your policy a name. We recommend that organizations create a meaningful standard for the names of their policies.
1. Under **Assignments**, select **Users and groups**
   1. Under **Include**, select **All users**
   1. Under **Exclude**, select **Users and groups** and choose your organization's emergency access or break-glass accounts. 
   1. Select **Done**.
1. Under **Cloud apps or actions**.
   1. Under **Select what this policy applies to**, select **Authentication context (preview)**.
   1. Select the authentication contexts you want to apply to this policy.
1. Under **Access controls** > **Grant**, select **Grant access**, **Require multi-factor authentication**, and select **Select**.
1. Confirm your settings and set **Enable policy** to **On**.
1. Select **Create** to create to enable your policy.

## Configure Privileged Identity Management to require authentication context

1. Sign in to **Azure portal** as a Privileged Role Administrator.
1. Browse to **Azure AD Privileged Identity Management** > **Azure AD roles** > **Settings**.
1. Select the role whose settings you want to configure. For this example lets change the settings for **Application Administrator**.
1. Select **Edit** to open the role settings page.
   1. On the **Activation** page, under **On activation, require**, select **Azure AD Conditional Access policy (Preview)**.
   1. Choose the authentication context you configured in the previous steps.
1. Select **Update**.

## Next steps

[Conditional Access common policies](concept-conditional-access-policy-common.md)

[Determine impact using Conditional Access report-only mode](howto-conditional-access-insights-reporting.md)

[Simulate sign in behavior using the Conditional Access What If tool](troubleshoot-conditional-access-what-if.md)
