---
title: Configure the 'Stay signed in?' prompt for Azure Active Directory accounts
description: Learn about keep me signed in (KMSI), which displays the Stay signed in? prompt, how to configure it in the Azure Active Directory portal, and how to troubleshoot sign-in issues.
services: active-directory
author: CelesteDG
manager: rkarlin
ms.service: active-directory
ms.topic: how-to
ms.workload: identity
ms.subservice: fundamentals
ms.date: 06/05/2020
ms.author: celested
ms.reviewer: asteen, jlu, ludwignick
ms.collection: M365-identity-device-management
---

## Configure the 'Stay signed in?' prompt for Azure AD accounts

You can also customize the **Stay signed in?** prompt after a user successfully signs in. This process is known as **Keep me signed in** (KMSI). If a user answers **Yes** to this prompt, the KMSI service gives them a persistent [refresh token](../develop/developer-glossary.md#refresh-token). For federated tenants, the prompt will show after the user successfully authenticates with the federated identity service.

The following diagram shows the user sign-in flow for a managed tenant and federated tenant using the KMSI in prompt. This flow contains smart logic so that the **Stay signed in?** option won't be displayed if the machine learning system detects a high-risk sign-in or a sign-in from a shared device.

KMSI is only available on the default custom branding. It cannot be added to language-specific branding. Some features of SharePoint Online and Office 2010 depend on users being able to choose to remain signed in. If you uncheck this option, your users may see additional and unexpected prompts to sign-in.

:::image type="content" source="./media/keep-me-signed-in/kmsi-workflow.png" alt-text="Diagram showing the user sign-in flow for a managed vs. federated tenant":::

See the section above on the license requirements for the KMSI service.

> [!NOTE]
> Configuring the keep me signed in option requires you to use Azure Active Directory (Azure AD) Premium 1, Premium 2, or Basic editions, or to have a Microsoft 365 license. For more information about licensing and editions, see [Sign up for Azure AD Premium](active-directory-get-started-premium.md).<br><br>Azure AD Premium and Basic editions are available for customers in China using the worldwide instance of Azure AD. Azure AD Premium and Basic editions aren't currently supported in the Azure service operated by 21Vianet in China. For more information, talk to us using the [Azure AD Forum](https://feedback.azure.com/d365community/forum/22920db1-ad25-ec11-b6e6-000d3a4f0789).

### Configure KMSI

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.
1. Select **Azure Active Directory** > **Company branding** > **Configure**.
1. In the **Advanced settings** section, find the **Show option to remain signed in** setting.

   This setting lets you choose whether your users remain signed in to Azure AD until they explicitly sign out.
   * If the checkbox is *not* selected, the **Stay signed in?** option is hidden after the user successfully signs in. The user must sign in each time the browser is closed and reopened.
   * If the checkbox *is* selected, the **Stay signed in?** option is shown to the user.

    :::image type="content" source="./media/keep-me-signed-in/kmsi-company-branding-advanced-settings-kmsi-1.png" alt-text="Screenshot shows the Show option to remain signed in setting":::

## Troubleshoot sign-in issues

If a user doesn't act on the **Stay signed in?** prompt but abandons the sign-in attempt, a sign-in log entry appears in the Azure AD **Sign-ins** page.  The prompt the user sees is called an "interrupt." This scenario is illustrated in the following image.

:::image type="content" source="./media/keep-me-signed-in/kmsi-stay-signed-in-prompt.png" alt-text="Shows the Stay signed in? prompt":::

Details about the sign-in error are as follows and highlighted in the example.

* **Sign in error code**: 50140
* **Failure reason**: This error occurred due to "Keep me signed in" interrupt when the user was signing in.

:::image type="content" source="./media/keep-me-signed-in/kmsi-sign-ins-log-entry.png" alt-text="Example sign-in log entry with the keep me signed in interrupt":::

You can stop users from seeing the interrupt by setting the **Show option to remain signed in** setting to **No** in the advanced branding settings. This disables the KMSI prompt for all users in your Azure AD directory.

You also can use the [persistent browser session controls in Conditional Access](../conditional-access/howto-conditional-access-session-lifetime.md) to prevent users from seeing the KMSI prompt. This option allows you to disable the KMSI prompt for a select group of users (such as the global administrators) without affecting sign-in behavior for everyone else in the directory.

To ensure that the KMSI prompt is shown only when it can benefit the user, the KMSI prompt is intentionally not shown in the following scenarios:

* User is signed in via seamless SSO and integrated Windows authentication (IWA)
* User is signed in via Active Directory Federation Services and IWA
* User is a guest in the tenant
* User's risk score is high
* Sign-in occurs during user or admin consent flow
* Persistent browser session control is configured in a conditional access policy

## Next steps

Learn about other settings that affect sign-in session timeout:

* Microsoft 365 – [Idle session timeout](/sharepoint/sign-out-inactive-users)
* Azure AD Conditional Access - [User sign-in frequency](../conditional-access/howto-conditional-access-session-lifetime.md)
* Azure AD - [Integrated Windows Authentication](../develop/msal-authentication-flows.md#integrated-windows-authentication-iwa)
* Azure portal – [Directory-level inactivity timeout](../../azure-portal/set-preferences.md#change-the-directory-timeout-setting-admin)