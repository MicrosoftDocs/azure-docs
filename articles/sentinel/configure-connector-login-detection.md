---
title: Configure the Security Events connector for anomalous RDP login detection
description: Learn how to configure the Security Events or Windows Security Events connector for anomalous RDP login detection.
author: yelevin
ms.topic: how-to
ms.date: 02/24/2023
ms.author: yelevin
---

# Configure the Security Events or Windows Security Events connector for anomalous RDP login detection

Microsoft Sentinel can apply machine learning (ML) to Security events data to identify anomalous Remote Desktop Protocol (RDP) login activity. Scenarios include:

- **Unusual IP** - the IP address has rarely or never been observed in the last 30 days

- **Unusual geo-location** - the IP address, city, country/region, and ASN have rarely or never been observed in the last 30 days

- **New user** - a new user logs in from an IP address and geo-location, both or either of which were not expected to be seen based on data from the 30 days prior.

> [!IMPORTANT]
> Anomalous RDP login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configure anomalous RDP login detection

1. You must be collecting RDP login data (Event ID 4624) through the **Security events** or **Windows Security Events** data connectors. Make sure you have selected an [event set](windows-security-event-id-reference.md) besides "None", or created a data collection rule that includes this event ID, to stream into Microsoft Sentinel.

1. From the Microsoft Sentinel portal, select **Analytics**, and then select the **Rule templates** tab. Choose the **(Preview) Anomalous RDP Login Detection** rule, and move the **Status** slider to **Enabled**.

As the machine learning algorithm requires 30 days' worth of data to build a baseline profile of user behavior, you must allow 30 days of Windows Security events data to be collected before any incidents can be detected.

## Next steps

- [Windows security event sets that can be sent to Microsoft Sentinel](windows-security-event-id-reference.md)
- [Windows Security Events via AMA connector for Microsoft Sentinel](data-connectors/windows-security-events-via-ama.md)
- [Security Events via Legacy Agent connector for Microsoft Sentinel](data-connectors/security-events-via-legacy-agent.md)
