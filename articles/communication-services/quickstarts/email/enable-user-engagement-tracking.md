---
title: How to configure user engagement tracking to an email domain with Azure Communication Service resource.
titleSuffix: An Azure Communication Services quick start guide
description: Learn about how to enable user engagement for the email domains with Azure Communication Services resource.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: How to enable user engagement tracking for the email domain with Azure Communication Service resource

Configuring email engagement enables the insights on your customers' engagement with emails to help build customer relationships. Only the emails that are sent from Azure Communication Services verified Email Domains that are enabled for user engagement analysis will get the engagement tracking metrics.

> [!IMPORTANT]
> By enabling this feature, you are acknowledging that you are enabling open/click tracking and giving consent to collect your customers' email activity. 

In this quick start, you'll learn about how to enable user engagement tracking for verified domain in Azure Communication Services.

## Enable email engagement
1.	Go the overview page of the Email Communications Service resource that you created earlier.
2.	Click Provision Domains on the left navigation panel. You'll see list of provisioned domains.
3.	Click on the Custom Domain name that you would like to update.

:::image type="content" source="./media/email-domains-custom-provision-domains.png" alt-text="Screenshot that shows how to get to overview page for Domain from provisioned domains list.":::

4.	The navigation lands in Domain Overview page where you'll able to see User interaction tracking Off by default.

:::image type="content" source="./media/email-domains-custom-overview.png" alt-text="Screenshot that shows the overview page of the domain." lightbox="media/email-domains-custom-overview-expanded.png":::

5.	The navigation lands in Domain Overview page where you'll able to see User interaction tracking Off by default.

:::image type="content" source="./media/email-domains-user-engagement.png" alt-text="Screenshot that shows the user engagement turn-on page of the domain." lightbox="media/email-domains-user-engagement-expanded.png":::

6.	Click turn on to enable engagement tracking.

**Your email domain is now ready to send emails with user engagement tracking. Please be aware that user engagement tracking is applicable to HTML content and will not function if you submit the payload in plaintext.**

You can now subscribe to Email User Engagement operational logs - provides information related to 'open' and 'click' user engagement metrics for messages sent from the Email service.
> [!IMPORTANT]
> If you plan to enable open/click tracking for your email links, ensure that you are formatting the email content in HTML correctly. Specifically, make sure your tracking content is properly encapsulated within the payload, as demonstrated below:
```html
 <a href="https://www.contoso.com">Contoso Inc.,</a>.
```
---
## Next steps

- Access logs for [Email Communication Service](../../concepts/analytics/logs/email-logs.md).

The following documents might be interesting to you:

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- [Get started by connecting Email Communication Service with a Azure Communication Service resource](../../quickstarts/email/connect-email-communication-resource.md)
