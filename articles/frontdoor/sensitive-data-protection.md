---
title: Protect sensitive data in logs
titleSuffix: Azure Front Door
description: Learn how Azure Front Door log scrubbing protects sensitive data and how to configure it for request URIs, IP addresses, and query strings.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: how-to
ms.date: 08/19/2026
ms.custom: sfi-image-nochange

#CustomerIntent: As an Azure administrator, I want to use log scrubbing so that I can protect sensitive data in Azure Front Door logs.
---

# Protect sensitive data in Azure Front Door logs

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

The Azure Front Door log scrubbing tool helps you remove sensitive data, such as personally identifiable information, from your Azure Front Door logs. You enable log scrubbing at the Azure Front Door Standard or Premium profile level and select the log fields to scrub. Once enabled, the tool replaces that information in logs generated under the profile with `****`.

Log scrubbing is only supported on Azure Front Door Standard and Premium. If you're using Azure Front Door (classic), migrate to Azure Front Door Standard or Premium to use log scrubbing. For more information, see [Azure Front Door (classic) to Standard or Premium tier migration](tier-migration.md).

## Default log behavior

When Azure Front Door serves a request, it logs the request details in clear text. Sensitive data might be included in the request URI, such as passwords, and the client IP and socket IP are logged. This data is viewable by anyone with access to the Azure Front Door access logs. To protect customer data, you can set up log scrubbing rules that target sensitive data.

## Scrubbing fields

You can scrub the following fields from the logs:

| Information | Description | Sample after enablement |
| --- | --- | --- |
| Request URI | RequestUri, OriginUrl | `****` |
| Request IP address | ClientIp, SocketIp | `****` |
| Query string | Querystring in RequestUri and OriginUrl | `https://contoso.com/bar/temp.txt?20240423&q=****&foo=****` |

> [!NOTE]
> When you enable log scrubbing, Microsoft still retains IP addresses in its internal logs to support critical security features.

## Enable log scrubbing to protect sensitive data

1. Go to the Azure Front Door Standard or Premium profile.

1. Under **Settings**, select **Configuration**.

1. Under **Scrub sensitive data from access logs**, select **Manage log scrubbing**.

1. In **Manage log scrubbing**, select **Enable access log scrubbing** to enable scrubbing.

1. Select the log fields that you want to scrub, and then select **Save**.

   :::image type="content" source="media/sensitive-data-protection/manage-log-scrubbing.png" alt-text="Screenshot that shows log scrubbing fields.":::

1. On the **Configuration** page, confirm that log scrubbing is **Enabled**.

   :::image type="content" source="media/sensitive-data-protection/log-scrubbing-enabled.png" alt-text="Screenshot that shows log scrubbing is enabled.":::

To verify your sensitive data protection rules, open the Azure Front Door log and search for `****` in place of the sensitive fields.

## Related content

- [Configure Azure Front Door logs](standard-premium/how-to-logs.md)
- [Azure Front Door monitoring data reference](monitor-front-door-reference.md#resource-logs)
- [Secure your Azure Front Door deployment](secure-front-door.md)
