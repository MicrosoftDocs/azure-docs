---
title: Buy and Configure an Azure App Service domain
description: Learn how to buy and configure a domain name in Azure App Service to create a personalized web address for your app.
keywords: buy domain, Azure domain management, custom domain setup, Azure App Service domain
ms.assetid: 70fb0e6e-8727-4cca-ba82-98a4d21586ff
ms.topic: how-to
ms.date: 04/17/2026
ms.author: msangapu
author: msangapu-msft
ms.service: azure-app-service
ms.custom: sfi-image-nochange
---
# Buy and manage an Azure App Service domain

[!INCLUDE [app-service-managed-certificate](./includes/managed-certs/managed-certs-note.md)]

Azure App Service domains are custom domains that are managed directly in Azure. They make it easy to manage custom domains for [Azure App Service](overview.md). This article shows you how to buy an App Service domain and configure an App Service app with it.

## Prerequisites

* [Create an App Service app](./index.yml), or use an app that you created for another tutorial. The app should be in an Azure Public region. At this time, Azure national clouds aren't supported.
* To use an App Service domain, the app's [App Service plan](overview-hosting-plans.md) must be a paid tier, not a Free (F1) tier. See [Scale up an app](manage-scale-up.md#scale-up-your-pricing-tier) to update the tier.
* [Remove the spending limit on your subscription](../cost-management-billing/manage/spending-limit.md#remove).

> [!NOTE]
> For some subscriptions types, before you can create an App Service domain, the subscription needs to have sufficient history on Azure.
> App Service domains aren't supported on free trial or credit-based subscriptions.
>

## Buy and map an App Service domain

For pricing information on App Service domains, visit the [App Service Pricing page](https://azure.microsoft.com/pricing/details/app-service/windows/) and scroll down to App Service Domain.

1. In the [Azure portal](https://portal.azure.com), navigate to your app's management page.

1. Under **Settings** in the sidebar menu, select **Custom domains**.

1. Select **Buy App Service domain**.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/add-app-service-domain.png" alt-text="Screenshot showing how to open the App Service domain wizard.":::

    > [!NOTE]
    > You can also create an App Service domain independently of an app by going to the App Service Domains view and selecting **Create**, or by navigating to [the create page directly](https://portal.azure.com/#create/Microsoft.Domain). But since the domain is independent from your app, you can't assign hostnames like `www` to your app, which you can do if you create the domain from your app's **Custom domains** page.

1. In the **Basics** tab, configure the following settings:

   | Setting  | Description |
   | -------- | ----------- |
   | **Subscription** | The subscription to use to buy the domain. |
   | **Resource Group** | The resource group to put the domain in. For example, the resource group your app is in. |
   | **Domain** | The domain you want. For example, **contoso.com**. If the domain you want isn't available, you can select from a list of suggested available domains or try a different domain. |

    > [!NOTE]
    > The following [top-level domains](https://wikipedia.org/wiki/Top-level_domain) are supported by App Service domains: _com_, _net_, _co.uk_, _org_, _nl_, _in_, _biz_, _org.uk_, and _co.in_.
    >
    >
    
1. Select **Next: Contact information** and supply your information as required by [ICANN](https://lookup.icann.org/) for the domain registration. 

   It's important that you fill out all required fields with as much accuracy as possible. Incorrect data for contact information can result in failure to buy the domain.

    > [!NOTE]
    > Make sure you have access to the email address on your contact information. GoDaddy sends important transactional emails directly to your contact information from a `@secureserver.net` email account.
    >

1. Select **Next: Hostname assignment** and verify the default hostnames to map to your app:

   | Hostname  | Description |
   | -------- | ----------- |
   | **root (@)** | The root or apex subdomain. If you buy the `contoso.com` domain, that's the root domain. Select **No** if you don't want to map the hostname to your app. |
   | **'www' subdomain** | If you buy the `contoso.com` domain, the `www` subdomain would be `www.contoso.com`. Select **No** if you don't want to map the hostname to your app. |

    > [!NOTE]
    > If you didn't launch the App Service domain wizard from an app's **Custom domains** page, you won't see this tab. You can still add the hostnames later by following the steps at [Map a hostname manually](#map-a-hostname-manually).

1. Select **Next: Advanced** and configure the optional settings:  

   | Setting  | Description |
   | -------- | ----------- |
   | **Auto renewal** | Your App Service domain is registered to you at one-year increments. Enable auto renewal so that your domain registration doesn't expire and you retain ownership of the domain. Your Azure subscription is automatically charged the yearly domain registration fee at the time of renewal. If you leave this option disabled, you must [renew the domain manually](#renew-the-domain). |
   | **Privacy protection** | Enabled by default. Privacy protection hides your domain registration contact information from the WHOIS database and is already included in the yearly domain registration fee. To opt out, select **Disable**. Privacy protection isn't supported in the following top-level domains (TLDs): `co.uk`, `in`, `org.uk`, `co.in`, and `nl`. |

1. Select **Next: Tags** and set the tags you want for your App Service domain. Tagging isn't required. It's a [feature in Azure that helps you manage your resources](../azure-resource-manager/management/tag-resources.md).

1. Select **Next: Review + create** and review your domain order. When finished, select **Create**.

    > [!NOTE]
    > App Service domains use GoDaddy for domain registration and Azure DNS to host the domains. In addition to the yearly domain registration fee, usage charges for Azure DNS apply. For information, see [Azure DNS Pricing](https://azure.microsoft.com/pricing/details/dns/).
    >

1. When the domain registration is complete, you see a **Go to resource** button. Select it to see the management page.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/deployment-complete.png" alt-text="A screenshot showing App Service domain creation completed." border="true":::

You're now ready to assign an App Service app to this custom domain.

> [!NOTE]
> For some subscriptions types, before you can create an App Service domain, the subscription needs to have sufficient history on Azure.
> App Service domains aren't supported on free trial or credit-based subscriptions.
>

## Map a hostname manually

If launched from an app's **Custom domains** page, the App Service domain wizard already lets you map the root domain (like `contoso.com`) and the `www` subdomain (like `www.contoso.com`) to your app. You can map any other subdomain to your app, like `shoppingcart` (as in `shoppingcart.contoso.com`).

1. In the [Azure portal](https://portal.azure.com), navigate to your app's management page.

1. Under **Settings** in the sidebar menu, select **Custom domains**.

1. Select **Add custom domain**.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/add-custom-domain.png" alt-text="Screenshot showing how to open the Add custom domain dialog.":::

1. For **Domain provider**, select **App Service Domain**.

1. For **TLS/SSL certificate**, select **App Service Managed Certificate** if your app is in the Basic tier or higher. If you want to remain in the Shared tier, or if you want to use your own certificate, select **Add certificate later**.

1. For **TLS/SSL type**, select the binding type you want.

    [!INCLUDE [Certificate binding types](../../includes/app-service-ssl-binding-types.md)]

1. In **App Service Domain**, select an App Service domain in your subscription.

    > [!NOTE]
    > To map to an App Service domain in a different subscription, see [Set up an existing custom domain in Azure App Service](app-service-web-tutorial-custom-domain.md). In this case, Azure DNS is the external domain provider, and you need to add the required DNS records manually.
    >

1. In **Domain type**, configure the domain type you want to map:

   | Domain type  | Description |
   | -------- | ----------- |
   | **Root domain** | The root or apex subdomain. If you buy the `contoso.com` domain, that's the root domain. |
   | **Subdomain** | In the **Subdomain** box, specify a subdomain like `www` or `shoppingcart`. |

1. Select **Add**.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/map-app-service-domain-to-app.png" alt-text="A screenshot showing how to map an App Service domain in the Add custom domain dialog." border="true":::

1. You should see the custom domain added to the list. You might also see a red X and the text **No binding**. 

    If you selected **App Service Managed Certificate** earlier, wait a few minutes for App Service to create the managed certificate for your custom domain. When the process is complete, the red X becomes a green check mark with the word **Secured**. If you selected **Add certificate later**, the red X remains until you [add a private certificate for the domain](configure-ssl-certificate.md) and [configure the binding](configure-ssl-bindings.md).

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/add-app-service-domain-hostname-complete.png" alt-text="A screenshot showing the custom domains page with the new secured custom domain." border="true":::

    > [!NOTE]
    > Unless you configure a certificate binding for your custom domain, any HTTPS request from a browser to the domain receives an error or warning, depending on the browser.

1. Test the mapping by navigating to it in a browser. (For example, go to `shoppingcart.contoso.com`.) 

## Renew the domain

The App Service domain you bought is valid for one year from the time of purchase. You can configure your domain to renew automatically, or you can manually renew your domain name up to 90 days ahead of domain expiration. Upon successful automatic or manual renewal, you'll be billed for the cost of the domain, and your domain expiration is extended for another year.

> [!NOTE]
> For .nl domains, you can only manually renew the domain starting 90 days ahead of domain expiration and up to the 20th of the month before the expiration date. You won't be able to renew the domain after this period even if the domain is not yet expired.
> 

If you want to configure automatic renewal, or if you want to manually renew your domain, follow these steps:

1. In the search bar, search for and select **App Service Domains**.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/view-app-service-domains.png" alt-text="Screenshot showing how to open the App Service domain view.":::

1. Select the domain you want to configure.

1. From the sidebar menu of the domain, select **Domain renewal**. To start renewing your domain automatically, select **On**. Otherwise select **Off**. The setting takes effect immediately. If automatic renewal is enabled, on the day after your domain expiration date, Azure attempts to bill you for the domain name renewal.

    :::image type="content" source="./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-autorenew.png" alt-text="Screenshot that shows the option to automatically renew your domain.":::

    > [!NOTE]
    > When navigating away from the page, disregard the "Your unsaved edits will be discarded" error by selecting **OK**.
    >

To manually renew your domain, select **Renew domain**. However, this button isn't active until 90 days before the domain's expiration date.

If your domain renewal is successful, you receive an email notification within 24 hours. 

<a name="custom"></a>

## Manage custom DNS records

In Azure, DNS records for an App Service domain are managed using [Azure DNS](https://azure.microsoft.com/services/dns/). You can add, remove, and update DNS records just as you would for an externally purchased domain. To manage custom DNS records:

1. In the search bar, search for and select **App Service Domains**.

    :::image type="content" source="./media/app-service-web-tutorial-custom-domain/view-app-service-domains.png" alt-text="A screenshot showing how to open the App Service domain view in the manage custom DNS records section." border="true":::

1. Select the domain you want to configure.

1. From the **Overview** page, select **Manage DNS records**.

    :::image type="content" source="media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-dns-zone.png" alt-text="Screenshot that shows where to access the DNS records.":::

For information on how to edit DNS records, see [How to manage DNS Zones in the Azure portal](../dns/dns-operations-dnszones-portal.md).

## Update contact information

After you purchase the App Service domain, you can update the domain contact information if you need to. It's important to keep this contact information up to date so that you can receive notifications about your domain and receive verification emails if you decide to transfer out your domain. To update your contact information:

1. In the search bar, search for and select **App Service Domains**.

1. Select the domain you want to configure.

1. From the sidebar menu of the domain, select **Advanced domain management (preview)**. To update your contact information, select **Edit contact**.

    :::image type="content" source="./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomain-update-contact.png" alt-text="Screenshot showing where to update contact information for a purchased domain." lightbox="./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomain-update-contact.png":::

1. In the pane that appears, update the necessary fields and then select **Submit**.

1. Once you submit the request, it might take some time for your contact information to update.

    > [!NOTE]
    > If you have privacy protection disabled and update name or organization information, an email verification is sent to the email address on file for confirmation. Additionally, if you update your email address, a verification email is sent first to the previous email on file for confirmation. After that's complete, another email is sent to the new email on file for confirmation. The contact information won't update until after you confirm via email.

### Troubleshooting contact verification issues

1. **Identify contact verification symptoms.**

   If contact verification isn't completed, your domain might enter a **Parked** state and stop serving your app. A pending `ContactChangeVerification` request can require confirmation from both the original and new contact email addresses before the contact information is updated.

   For an email address change, the verification email is sent first to the original address on file. After you confirm that request, a separate verification email is sent to the new address. Access to the new mailbox alone isn't sufficient to complete this process. If confirmation from either address is missing, the contact change remains incomplete.

   When investigating, note whether the domain stopped serving your app after a contact update and whether either verification email was received and confirmed. A **Parked** state alone doesn't establish the cause. Check for an outstanding contact verification request before treating the issue as an app configuration or DNS problem. Record the domain state and any pending verification details for your support request.

1. **Investigate missing verification emails and delivery errors.**

   If a verification email doesn't arrive, determine whether the affected mailbox is the original contact address or the new address. For an email address change, confirmation from the original address is required before verification proceeds to the new address. A missing message at the new address might therefore indicate that the original confirmation is still pending, rather than a delivery failure.

   When a nondelivery report is available, use its error code and diagnostic details to investigate. The following examples cover connection failures and other email delivery issues that can prevent verification messages from arriving. This list isn't exhaustive, and the exact error text varies by email provider.

   | **Example error or status code** | **What it indicates** | **Suggested action** |
   | --- | --- | --- |
   | `550 5.4.316 Message expired, connection refused` | Delivery attempts encountered a refused connection, and the message expired before delivery succeeded. | Ask your email administrator to investigate the receiving mail server's availability and connection restrictions. |
   | `450 4.4.316 Connection refused` | A connection to the destination mail server couldn't be established during a delivery attempt. | Ask your email administrator to investigate connectivity and whether the receiving server is accepting mail. |
   | `5.1.1` (invalid recipient or mailbox not found) | The destination server doesn't recognize the recipient address. | Check the contact address for spelling errors and confirm that the mailbox exists. If the original address is no longer accessible, follow the guidance in the next item. |
   | `5.2.2` (mailbox full) | The destination mailbox has exceeded its storage limit. | Free up mailbox space or ask your email administrator to address the mailbox quota. |
   | `4.4.7` (delivery time expired) | The message couldn't be delivered within the allowed retry period. | Ask your email administrator to investigate mail server availability, routing, and the other diagnostic details in the report. |
   | `5.7.1` (delivery not authorized or message refused) | The destination server rejected the message because of a security or mail policy restriction. | Ask your email administrator to review the rejection details and applicable mail filtering rules. |

   A connection-refused error alone doesn't establish that an address is incorrect or that a mailbox no longer exists. Use the complete nondelivery report, rather than only the short error message, to identify the cause.

   Even if no delivery error is visible, check both contact mailboxes:

   - Verify that you can sign in to each mailbox and receive messages.
   - Check junk email folders. Ask your email administrator to check quarantine, filtering rules, and available mail delivery logs for the verification message.
   - Look for domain registration messages from GoDaddy sent from a `@secureserver.net` email account. Have your email administrator review any filtering of these messages according to your organization's security policies.
   - Record the affected recipient address, the date and time of the delivery attempt, and any complete error messages. Include these details when contacting Azure Support.

   The absence of a nondelivery report doesn't confirm that a verification email reached the inbox. Resolving email delivery also doesn't complete verification by itself: you must confirm the required messages at both addresses. If you can't access the original address, continue to the next item.

1. **Understand self-service limitations when the original email is inaccessible.**

   If you no longer have access to the original email address, you can't complete the contact change through self-service in the Azure portal. Submitting a new email address doesn't bypass the required confirmation from the original address.

   This condition creates a verification dependency: the address that you want to replace must first receive and approve the change. Editing the contact information again doesn't remove that requirement. Similarly, access to the Azure subscription or the App Service domain resource doesn't substitute for confirmation through the registered contact email address.

   If the original mailbox is still managed by your organization, work with your email administrator to determine whether access or mail delivery can be restored. If the mailbox can't be recovered, or the address belongs to an email domain that you no longer control, proceed to Azure Support rather than relying on repeated contact updates. Explain that the original address is inaccessible and that the required confirmation can't be completed. Azure Support can guide you through the ownership verification needed to proceed.

1. **Contact Azure Support with proof of domain ownership.**

   To resolve this issue, [create an Azure support request](/azure/azure-portal/supportability/how-to-create-azure-support-request). Include the domain name, the pending verification status, and any email delivery errors. Provide proof of domain ownership as requested by Azure Support so they can help you complete the required ICANN contact verification and restore the domain.

## Disable privacy protection

> [!IMPORTANT]
> Once you disable privacy protection, you can no longer re-enable privacy protection again.
>

Privacy protection hides your domain registration contact information from the WHOIS database. If it's enabled during domain creation, privacy protection is already included in the yearly domain registration fee for no additional cost. However, there are some scenarios, such as transferring the domain out, where you need to disable privacy protection, you can do that by:

1. In the search bar, search for and select **App Service Domains**.

1. Select the domain you want to configure.

1. From the sidebar menu of the domain, select **Advanced domain management (preview)**. To disable privacy protection, select **Disable** in the **Domain Privacy** section.

    :::image type="content" source="./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-disable-privacy.png" alt-text="Screenshot showing where to disable privacy for a purchased domain." lightbox="./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-disable-privacy.png":::

## Cancel the purchase

After you purchase the App Service domain, you have five days to cancel your purchase and get a full refund. After five days, you can delete the App Service domain but can't receive a refund.

1. In the search bar, search for and select **App Service Domains**.

1. Select the domain you want to configure.

1. In the domain's sidebar menu, select **Locks**. 

    A delete lock has been created for your domain. As long as a delete lock exists, you can't delete the App Service domain.

1. Select **Delete** to remove the lock.

1. In the domain's sidebar menu, select **Overview**. 

1. If the cancellation period on the purchased domain hasn't elapsed, select **Cancel purchase**. Otherwise, you see a **Delete** button instead. To delete the domain without a refund, select **Delete**.

    :::image type="content" source="./media/custom-dns-web-site-buydomains-web-app/dncmntask-cname-buydomains-cancel.png" alt-text="Screenshot that shows where to delete or cancel a purchased domain.":::

1. Confirm the operation by selecting **Yes**.

    After the operation is complete, the domain is released from your subscription and available for anyone to purchase again. 

## Monitor activity for your App Service domain

Control-plane operations on your App Service domain are recorded automatically in the [Azure activity log](/azure/azure-monitor/platform/activity-log), including the operation name and status, the affected resource, the identity that initiated it, and the date and time. To retain these logs longer, analyze them, or set up notifications, [export the activity log](/azure/azure-monitor/platform/activity-log#export-activity-log) to a Log Analytics workspace, storage account, or event hub, or create [activity log alerts](/azure/azure-monitor/alerts/alerts-types#activity-log-alerts).

## Frequently asked questions

- [Why do I see "This subscription does not have the billing support to purchase an App Service domain"?](#why-do-i-see-this-subscription-does-not-have-the-billing-support-to-purchase-an-app-service-domain)
- [Why do I get a SubscriptionExceededMaxDomainLimit error when creating an App Service domain?](#why-do-i-get-a-subscriptionexceededmaxdomainlimit-error-when-creating-an-app-service-domain)
- [How do I direct the default URL to a custom directory?](#how-do-i-direct-the-default-url-to-a-custom-directory)

#### Why do I see "This subscription does not have the billing support to purchase an App Service domain"?

Free subscriptions, which don't require a confirmed credit card, don't have the permissions to buy App Service domains in Azure.

#### Why do I get a SubscriptionExceededMaxDomainLimit error when creating an App Service domain?

The number of App Service domains a subscription can have depends on the subscription type. Subscriptions that have a monthly credit allotment, like the Visual Studio Enterprise subscription, have a limit of one App Service domain. To increase your limit, convert to a pay-per-use subscription.

#### How do I direct the default URL to a custom directory?

This isn't a DNS resolution scenario. By default, App Service directs web requests to the root directory of your app code. To direct them to a subdirectory, such as `public`, see [Redirect to a custom directory](configure-common.md#redirect-to-a-custom-directory).

## Next step

> [!div class="nextstepaction"]
> [Enable HTTPS for a custom domain in Azure App Service](configure-ssl-bindings.md)
