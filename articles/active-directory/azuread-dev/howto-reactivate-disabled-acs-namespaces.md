---
title: Reactivate disabled Azure Access Control Service (ACS) namespaces
description: Find and enable your Azure Access Control Service (ACS) namespaces and request an extension to keep them enabled until February 4, 2019.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: azuread-dev
ms.workload: identity
ms.topic: how-to
ms.date: 01/21/2019
ms.author: ryanwi
ms.reviewer: jlu
ms.custom: aaddev
ROBOTS: NOINDEX
---

# How to: Reactivate disabled Access Control Service namespaces

[!INCLUDE [active-directory-azuread-dev](../../../includes/active-directory-azuread-dev.md)]

On November 2017, we announced that Microsoft Azure Access Control Service (ACS), a service of Azure Active Directory (Azure AD), is being retired on November 7, 2018.

Since then, we've sent emails to the ACS subscriptions' admin email about the ACS retirement 12 months, 9 months, 6 months, 3 months, 1 month, 2 weeks, 1 week, and 1 day before the retirement date of November 7, 2018.

On October 3, 2018, we announced (through email and [a blog post](https://azure.microsoft.com/blog/one-month-retirement-notice-access-control-service/)) an extension offer to customers who can't finish their migration before November 7, 2018. The announcement also had instructions for requesting the extension.

## Why your namespace is disabled

If you haven't opted in for the extension, we'll start to disable ACS namespaces starting November 7, 2018. You must have requested the extension to February 4, 2019 already; otherwise, you will not be able to enable the namespaces through PowerShell.

> [!NOTE]
> You must be a service administrator or co-administrator of the subscription to run the PowerShell commands and request an extension.

## Find and enable your ACS namespaces

You can use ACS PowerShell to list all your ACS namespaces and reactivate ones that have been disabled.

1. Download and install ACS PowerShell:
    1. Go to the PowerShell Gallery and download [Acs.Namespaces](https://www.powershellgallery.com/packages/Acs.Namespaces/1.0.2).
    1. Install the module:

        ```powershell
        Install-Module -Name Acs.Namespaces
        ```

    1. Get a list of all possible commands:

        ```powershell
        Get-Command -Module Acs.Namespaces
        ```

        To get help on a specific command, run:

        ```powershell
        Get-Help [Command-Name] -Full
        ```
    
        where `[Command-Name]` is the name of the ACS command.
1. Connect to ACS using the **Connect-AcsAccount** cmdlet. 

    You may need to change your execution policy by running **Set-ExecutionPolicy** before you can run the command.
1. List your available Azure subscriptions using the **Get-AcsSubscription** cmdlet.
1. List your ACS namespaces using the **Get-AcsNamespace** cmdlet.
1. Confirm that the namespaces are disabled by confirming that `State` is `Disabled`.

    [![Confirm that the namespaces are disabled](./media/howto-reactivate-disabled-acs-namespaces/confirm-disabled-namespace.png)](./media/howto-reactivate-disabled-acs-namespaces/confirm-disabled-namespace.png#lightbox)

    You can also use `nslookup {your-namespace}.accesscontrol.windows.net` to confirm if the domain is still active.

1. Enable your ACS namespace(s) using the **Enable-AcsNamespace** cmdlet.

    Once you've enabled your namespace(s), you can request an extension so that the namespace(s) won't be disabled again before February 4, 2019. After that date, all requests to ACS will fail.

## Request an extension

We are taking new extension requests starting on January 21, 2019.

We will start disabling namespaces for customers who have requested extensions to February 4, 2019. You can still re-enable namespaces through PowerShell, but the namespaces will be disabled again after 48 hours.

After March 4, 2019, customers will no longer be able to re-enable any namespaces through PowerShell.

Further extensions will no longer be automatically approved. If you need additional time to migrate, contact [Azure support](https://portal.azure.com/#create/Microsoft.Support) to provide a detailed migration timeline.

### To request an extension

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

1. Sign in to the [Azure portal](https://portal.azure.com) and create a [new support request](https://portal.azure.com/#create/Microsoft.Support).
1. Fill in the new support request form as shown in the following example.

    | Support request field | Value |
    |-----------------------|--------------------|
    | **Issue type** | `Technical` |
    | **Subscription** | Set to your subscription |
    | **Service** | `All services` |
    | **Resource** | `General question/Resource not available` |
    | **Problem type** | `ACS to SAS Migration` |
    | **Subject** | Describe the issue |

   ![Shows an example of a new technical support request](./media/howto-reactivate-disabled-acs-namespaces/new-technical-support-request.png)

<!--

1. Navigate to your ACS namespace's management portal by going to `https://{your-namespace}.accesscontrol.windows.net`.
1. Select the **Read Terms** button to read the [updated Terms of Use](https://azure.microsoft.com/support/legal/access-control/), which will direct you to a page with the updated Terms of Use.

    [![Select the Read Terms button](./media/howto-reactivate-disabled-acs-namespaces/read-terms-button-expanded.png)](./media/howto-reactivate-disabled-acs-namespaces/read-terms-button-expanded.png#lightbox)

1. Select **Request Extension** on the banner at the top of the page. The button will only be enabled after you read the [updated Terms of Use](https://azure.microsoft.com/support/legal/access-control/).

    [![Select the Request Extension button](./media/howto-reactivate-disabled-acs-namespaces/request-extension-button-expanded.png)](./media/howto-reactivate-disabled-acs-namespaces/request-extension-button-expanded.png#lightbox)

1. After the extension request is registered, the page will refresh with a new banner at the top of the page.

    [![Updated page with refreshed banner](./media/howto-reactivate-disabled-acs-namespaces/updated-banner-expanded.png)](./media/howto-reactivate-disabled-acs-namespaces/updated-banner-expanded.png#lightbox)
-->

## Help and support

- If you run into any issues after following this how-to, contact [Azure support](https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview).
- If you have questions or feedback about ACS retirement, contact us at acsfeedback@microsoft.com.

## Next steps

- Review the information about ACS retirement in [How to: Migrate from the Azure Access Control Service](active-directory-acs-migration.md).
