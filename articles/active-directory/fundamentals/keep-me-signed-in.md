---
title: Configure the 'Stay signed in?' prompt for Azure Active Directory accounts
description: Learn about keep me signed in (KMSI), which displays the Stay signed in? prompt, how to configure it in the Azure Active Directory portal, and how to troubleshoot sign-in issues.
services: active-directory
author: CelesteDG
manager: daveba
ms.service: active-directory
ms.topic: conceptual
ms.workload: identity
ms.subservice: fundamentals
ms.date: 06/05/2020
ms.author: celested
ms.reviewer: asteen, jlu, hirsin
ms.collection: M365-identity-device-management
---

# Configure the 'Stay signed in?' prompt for Azure AD accounts

Keep me signed in (KMSI) displays a **Stay signed in?** prompt after a user successfully signs in. If a user answers **Yes** to this prompt, the keep me signed in service gives them a persistent [refresh token](../develop/developer-glossary.md#refresh-token). For federated tenants, the prompt will show after the user successfully authenticates with the federated identity service.

The following diagram shows the user sign-in flow for a managed tenant and federated tenant and the new keep me signed in prompt. This flow contains smart logic so that the **Stay signed in?** option won't be displayed if the machine learning system detects a high-risk sign-in or a sign-in from a shared device.

:::image type="content" source="./media/keep-me-signed-in/kmsi-workflow.png" alt-text="Diagram showing the user sign-in flow for a managed vs. federated tenant":::

> [!NOTE]
> Configuring the keep me signed in option requires you to use Azure Active Directory (Azure AD) Premium 1, Premium 2, or Basic editions, or to have an Office 365 license. For more information about licensing and editions, see [Sign up for Azure AD Premium](active-directory-get-started-premium.md).<br><br>Azure AD Premium and Basic editions are available for customers in China using the worldwide instance of Azure AD. Azure AD Premium and Basic editions aren't currently supported in the Azure service operated by 21Vianet in China. For more information, talk to us using the [Azure AD Forum](https://feedback.azure.com/forums/169401-azure-active-directory/).

## Configure KMSI

1. Sign in to the [Azure portal](https://portal.azure.com/) using a Global administrator account for the directory.
1. Select **Azure Active Directory**, select **Company branding**, and then select **Configure**.
1. In the **Advanced settings** section, find the **Show option to remain signed in** setting.

   This setting lets you choose whether your users remain signed in to Azure AD until they explicitly sign out.
   * If you choose **No**, the **Stay signed in?** option is hidden after the user successfully signs in and the user must sign in each time the browser is closed and reopened.
   * If you choose **Yes**, the **Stay signed in?** option is shown to the user.

    :::image type="content" source="./media/keep-me-signed-in/kmsi-company-branding-advanced-settings-kmsi-1.png" alt-text="Screenshot shows the Show option to remain signed in setting":::

## Troubleshoot sign-in issues

If a user doesn't act on the **Stay signed in?** prompt, as shown in the following diagram, but abandons the sign-in attempt, you'll see a sign-in log entry that indicates the interrupt.

:::image type="content" source="./media/keep-me-signed-in/kmsi-stay-signed-in-prompt.png" alt-text="Shows the Stay signed in? prompt":::

Details about the sign-in error are as follows and highlighted in the example.

* **Sign in error code**: 50140
* **Failure reason**: This error occurred due to "Keep me signed in" interrupt when the user was signing in.

:::image type="content" source="./media/keep-me-signed-in/kmsi-sign-ins-log-entry.png" alt-text="Example sign-in log entry with the keep me signed in interrupt":::

You can stop users from seeing the interrupt by setting the **Show option to remain signed in** setting to **No** in the advanced branding settings.

## Next steps

Learn about other settings that affect sign-in session timeout:

* Office 365 – [Idle session timeout](https://docs.microsoft.com/sharepoint/sign-out-inactive-users)
* Azure AD Conditional Access - [User sign-in frequency](https://docs.microsoft.com/azure/active-directory/conditional-access/howto-conditional-access-session-lifetime)
* Azure portal – [Directory-level inactivity timeout](https://docs.microsoft.com/azure/azure-portal/admin-timeout)
