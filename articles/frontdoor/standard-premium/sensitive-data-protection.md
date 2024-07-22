---
title: Azure Front Door sensitive data protection
description: Learn about sensitive data protection for logs in Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: frontdoor
ms.topic: concept-article #Required; leave this attribute/value as-is.
ms.date: 04/30/2024

#CustomerIntent: As an Azure administrator, I want to learn about Azure Front Door scrubbing tool so that I can use it to protect sensitive data in Azure Front Door. logs.
---

# Azure Front Door sensitive data protection

The Azure Front Door log scrubbing tool helps you remove sensitive data (for example, personal identifiable information) from your Azure Front Door logs. It works by enabling log scrubbing at Azure Front Door Standard or Premium profile level and selecting the log fields to be scrubbed. Once enabled, the tool scrubs that information from your logs generated under this profile and replaces it with `****`. 

Log scrubbing is only supported on Azure Front Door Standard and Premium. If you're using Azure Front Door classic, migrate to Azure Front Door standard or premium to use log scrubbing. For more information, see [About Azure Front Door (classic) to Standard/Premium tier migration](..\tier-migration.md).

## Default log behavior

When Azure Front Door serves a request, Azure Front Door logs the details of the request in clear text. Sensitive data might be included in the request URI (such as passwords), and client IP and socket IP are logged. This data is viewable by anyone with access to the Azure Front Door access logs. To protect customer data, you can set up log scrubbing rules targeting this sensitive data for protection.

## Scrubbing fields

The following fields can be scrubbed from the logs:

| Information | Description | Samples after enablement |
| --- | --- | --- |
| Request URI | RequestUri, OriginUrl | `****` |
| Request IP address | ClientIp, SocketIp | `****` |
| Query string | Querystring in RequestUri and OriginUrl  | `https://contoso.com/bar/temp.txt?20240423&q=****&foo=****` |

> [!NOTE]
> When you enable log scrubbing feature, Microsoft still retains IP addresses in its internal logs to support critical security features.

## Next step

> [!div class="nextstepaction"]
> [Protect sensitive data in Azure Front Door logs](how-to-protect-sensitive-data.md)
