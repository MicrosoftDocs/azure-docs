---
title: Protect sensitive data in Azure Front Door logs
description: Learn how to protect sensitive data in Azure Front Door logs by using the log scrubbing tool.
author: halkazwini
ms.author: halkazwini
ms.service: frontdoor
ms.topic: how-to #Required; leave this attribute/value as-is.
ms.date: 04/30/2024

#CustomerIntent: As an Azure administrator, I want to use the log scrubbing tool so that I can protect sensitive data in Azure Front Door logs.
---

# Protect sensitive data in Azure Front Door logs

In this article, you learn how to use the log scrubbing tool to protect sensitive data in Azure Front Door logs. For more information about sensitive data protection in Azure Front Door, see [Azure Front Door sensitive data protection](sensitive-data-protection.md).

## Prerequisites

Before you can use the log scrubbing tool, you must have an Azure Front Door Standard or Premium tier profile. For more information, see [Create an Azure Front Door profile](../create-front-door-portal.md).

## Enable log scrubbing to protect sensitive data


1. Go to the Azure Front Door Standard or Premium profile.

1. Under **Settings**, select **Configuration**. 

1. Under **Scrub sensitive data from access logs**, select **Manage log scrubbing**. 

   :::image type="content" source="../media/how-to-protect-sensitive-data/log-scrubbing-disabled.png" alt-text="Screenshot that shows log scrubbing is disabled.":::

1. In **Manage log scrubbing**, select **Enable access log scrubbing** to enable scrubbing. 

1. Select the log fields that you want to scrub, then select **Save**.

   :::image type="content" source="../media/how-to-protect-sensitive-data/manage-log-scrubbing.png" alt-text="Screenshot that shows log scrubbing fields.":::

1. In the **Configuration** page, you can now see that log scrubbing became **Enabled**.

   :::image type="content" source="../media/how-to-protect-sensitive-data/log-scrubbing-enabled.png" alt-text="Screenshot that shows log scrubbing is enabled.":::

To verify your sensitive data protection rules, open the Azure Front Door log and search for `****` in place of the sensitive fields.

## Related content

- [Learn about Azure Front Door sensitive data protection](../create-front-door-portal.md).
- [Learn how to create an Azure Front Door profile](sensitive-data-protection.md).
- [Learn how to migrate Azure Front Door (classic) to Standard/Premium tier](../migrate-tier.md).
