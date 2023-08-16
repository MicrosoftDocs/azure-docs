---
title: "ARGOS Cloud Security connector for Microsoft Sentinel"
description: "Learn how to install the connector ARGOS Cloud Security to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 07/26/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# ARGOS Cloud Security connector for Microsoft Sentinel

The ARGOS Cloud Security integration for Microsoft Sentinel allows you to have all your important cloud security events in one place. This enables you to easily create dashboards, alerts, and correlate events across multiple systems. Overall this will improve your organization's security posture and security incident response.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ARGOS_CL<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [ARGOS Cloud Security](https://argos-security.io/contact-us) |

## Query samples

**Display all exploitable ARGOS Detections.**
   ```kusto
ARGOS_CL
 
   | where exploitable_b
   ```

**Display all open, exploitable ARGOS Detections on Azure.**
   ```kusto
ARGOS_CL
 
   | where exploitable_b and cloud_s == 'azure' and status_s == 'open'
   ```

**Display all open, exploitable ARGOS Detections on Azure.**
   ```kusto
ARGOS_CL
 
   | where exploitable_b and cloud_s == 'azure' and status_s == 'open'
 
   | sort by TimeGenerated
   ```

**Render a time chart with all open ARGOS Detections on Azure.**
   ```kusto
ARGOS_CL
 
   | where cloud_s == 'azure' and status_s == 'open'
 
   | summarize count() by TimeGenerated
 
   | render timechart
   ```

**Display Top 10, open, exploitable ARGOS Detections on Azure.**
   ```kusto
ARGOS_CL
 
   | where cloud_s == 'azure' and status_s == 'open' and exploitable_b
 
   | summarize count() by ruleId_s
 
   | top 10 by count_
   ```



## Vendor installation instructions

1. Subscribe to ARGOS

Ensure you already own an ARGOS Subscription. If not, browse to [ARGOS Cloud Security](https://argos-security.io) and sign up to ARGOS.

Alternatively, you can also purchase ARGOS via the [Azure Marketplace](https://azuremarketplace.microsoft.com/en-au/marketplace/apps/argoscloudsecurity1605618416175.argoscloudsecurity?tab=Overview).

2. Configure Sentinel integration from ARGOS

Configure ARGOS to forward any new detections to your Sentinel workspace by providing ARGOS with your Workspace ID and Primary Key.

There is **no need to deploy any custom infrastructure**.

Enter the information into the [ARGOS Sentinel](https://app.argos-security.io/account/sentinel) configuration page.

New detections will automatically be forwarded.

[Learn more about the integration](https://www.argos-security.io/resources#integrations)





## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/argoscloudsecurity1605618416175.argos-sentinel?tab=Overview) in the Azure Marketplace.
