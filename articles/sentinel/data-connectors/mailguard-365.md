---
title: "MailGuard 365 connector for Microsoft Sentinel"
description: "Learn how to install the connector MailGuard 365 to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 10/23/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# MailGuard 365 connector for Microsoft Sentinel

MailGuard 365 Enhanced Email Security for Microsoft 365. Exclusive to the Microsoft marketplace, MailGuard 365 is integrated with Microsoft 365 security (incl. Defender) for enhanced protection against advanced email threats like phishing, ransomware and sophisticated BEC attacks.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | MailGuard365_Threats_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [MailGuard 365](https://www.mailguard365.com/support/) |

## Query samples

**All phishing threats stopped by MailGuard 365**
   ```kusto
MailGuard365_Threats_CL 
 
   | where Category == "Phishing"
   ```

**All threats summarized by sender email address**
   ```kusto
MailGuard365_Threats_CL 
 
   | summarize count() by Sender_Email_s
   ```

**All threats summarized by category**
   ```kusto
MailGuard365_Threats_CL 
 
   | summarize count() by Category
   ```



## Vendor installation instructions

Configure and connect MailGuard 365

1. In the MailGuard 365 Console, click **Settings** on the navigation bar.
2. Click the **Integrations** tab.
3. Click the **Enable Microsoft Sentinel**.
4. Enter your workspace id and primary key from the fields below, click **Finish**.
5. For additional instructions, please contact MailGuard 365 support.





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/mailguardptylimited.microsoft-sentinel-solution-mailguard365?tab=Overview) in the Azure Marketplace.
