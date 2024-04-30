---
title: How to enable user engagement tracking for an email domain with Azure Communication Services resource.
titleSuffix: An Azure Communication Services quick start guide
description: Learn about how to enable user engagement tracking for an email domain with Azure Communication Services resource.
author: bashan-git
manager: sundraman
services: azure-communication-services
ms.author: bashan
ms.date: 03/31/2023
ms.topic: quickstart
ms.service: azure-communication-services
---
# Quickstart: How to enable user engagement tracking for an email domain

To gain insights into your customer email engagements, enable user engagement tracking. Only emails sent from Azure Communication Services verified email domains that are enabled for user engagement analysis can receive engagement tracking metrics.

> [!IMPORTANT]
> By enabling this feature, you are acknowledging that you are enabling open/click tracking and giving consent to collect your customers' email activity. 

In this quick start, you learn how to enable user engagement tracking for a verified email domain in Azure Communication Services.

## Enable email engagement
1.	Go the overview page of the Email Communications Service resource that you created in [Quickstart: Create and manage an Email Communication Service resource](./create-email-communication-resource.md).
2.	In the left navigation panel, click **Provision Domains** to open a list of provisioned domains.
3.	Click on the name of the custom domain that you would like to update.

:::image type="content" source="./media/email-domains-custom-provision-domains.png" alt-text="Screenshot that shows how to get to overview page for Domain from provisioned domains list.":::

   When you click the custom domain name, it opens the Domain Overview page. The first time you open this page, User interaction tracking is **Off** by default.

4.	Click **Turn On** to enable engagement tracking.

:::image type="content" source="./media/email-domains-custom-overview.png" alt-text="Screenshot that shows the overview page of the domain." lightbox="media/email-domains-custom-overview-expanded.png":::

5.	A confirmation dialog box opens. Click **Turn On** to confirm that you want to enable engagement tracking.

:::image type="content" source="./media/email-domains-user-engagement.png" alt-text="Screenshot that shows the user engagement turn-on page of the domain." lightbox="media/email-domains-user-engagement-expanded.png":::

**Your email domain is now ready to send emails with user engagement tracking. Note that user engagement tracking applies to HTML content and does not function if you submit the payload in plaintext.**

You can now subscribe to Email User Engagement operational logs, which provide information about **open** and **click** user engagement metrics for messages sent from the email service.

> [!NOTE]
> User Engagement Tracking cannot be enabled for Azure Managed Domains or custom domains with default sending limits. For more information, see [Service limits for Azure Communication Services](../../concepts/service-limits.md#rate-limits).

> [!IMPORTANT]
> If you plan to enable open/click tracking for your email links, ensure that you are correctly formatting the email content in HTML. Specifically, make sure that your tracking content is properly encapsulated within the payload, as follows:
```html
 <a href="https://www.contoso.com">Contoso Inc.</a>
```
---
## Next steps

- Access logs for [Email Communication Service](../../concepts/analytics/logs/email-logs.md).

## Related articles

- Familiarize yourself with the [Email client library](../../concepts/email/sdk-features.md)
- [Quickstart: How to connect Email Communication Service with an Azure Communication Services resource](../../quickstarts/email/connect-email-communication-resource.md)
