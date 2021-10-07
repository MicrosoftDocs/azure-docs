---
title: Common threat detection scenarios | Microsoft Docs
description: Learn some common threats you might want to search for and which components you need, and learn how to set up these detections.
services: sentinel
documentationcenter: na
author: yelevin
manager: rkarlin
editor: ''

ms.assetid: d51d2e09-a073-41c8-b396-91d60b057e6a
ms.service: azure-sentinel
ms.subservice: azure-sentinel
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: na
ms.date: 06/06/2021
ms.author: yelevin
---

# Common threat detection scenarios

## Configure the Security events / Windows Security Events connector for anomalous RDP login detection

> [!IMPORTANT]
> Anomalous RDP login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel can apply machine learning (ML) to Security events data to identify anomalous Remote Desktop Protocol (RDP) login activity. Scenarios include:

- **Unusual IP** - the IP address has rarely or never been observed in the last 30 days

- **Unusual geo-location** - the IP address, city, country, and ASN have rarely or never been observed in the last 30 days

- **New user** - a new user logs in from an IP address and geo-location, both or either of which were not expected to be seen based on data from the 30 days prior.

**Configuration instructions**

1. You must be collecting RDP login data (Event ID 4624) through the **Security events** or **Windows Security Events** data connectors. Make sure you have selected an [event set](#event-id-reference) besides "None", or created a data collection rule that includes this event ID, to stream into Azure Sentinel.

1. From the Azure Sentinel portal, select **Analytics**, and then select the **Rule templates** tab. Choose the **(Preview) Anomalous RDP Login Detection** rule, and move the **Status** slider to **Enabled**.

    > [!NOTE]
    > As the machine learning algorithm requires 30 days' worth of data to build a baseline profile of user behavior, you must allow 30 days of Windows Security events data to be collected before any incidents can be detected.

## Configure the Syslog connector for anomalous SSH login detection

> [!IMPORTANT]
> Anomalous SSH login detection is currently in public preview.
> This feature is provided without a service level agreement, and it's not recommended for production workloads.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Sentinel can apply machine learning (ML) to the syslog data to identify anomalous Secure Shell (SSH) login activity. Scenarios include:

- Impossible travel – when two successful login events occur from two locations that are impossible to reach within the timeframe of the two login events.
- Unexpected location – the location from where a successful login event occurred is suspicious. For example, the location has not been seen recently.
 
This detection requires a specific configuration of the Syslog data connector: 

1. For step 2 under [Configure the Log Analytics agent](#configure-the-log-analytics-agent) above, make sure that both **auth** and **authpriv** are selected as facilities to monitor, and that all the severities are selected. 

2. Allow sufficient time for syslog information to be collected. Then, navigate to **Azure Sentinel - Logs**, and copy and paste the following query:
    
    ```kusto
    Syslog
    | where Facility in ("authpriv","auth")
    | extend c = extract( "Accepted\\s(publickey|password|keyboard-interactive/pam)\\sfor ([^\\s]+)",1,SyslogMessage)
    | where isnotempty(c)
    | count 
    ```
    
    Change the **Time range** if required, and select **Run**.
    
    If the resulting count is zero, confirm the configuration of the connector and that the monitored computers do have successful login activity for the time period you specified for your query.
    
    If the resulting count is greater than zero, your syslog data is suitable for anomalous SSH login detection. You enable this detection from **Analytics** >  **Rule templates** > **(Preview) Anomalous SSH Login Detection**.


## Next steps
In this document, you learned how to connect Windows security events to Azure Sentinel. To learn more about Azure Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started detecting threats with Azure Sentinel, using [built-in](detect-threats-built-in.md) or [custom](detect-threats-custom.md) rules.
