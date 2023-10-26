---
title: Connect Microsoft 365 Defender data to Microsoft Sentinel| Microsoft Docs
description: Learn how to ingest incidents, alerts, and raw event data from Microsoft 365 Defender into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: conceptual
ms.date: 02/01/2023
---

# Connect data from Microsoft 365 Defender to Microsoft Sentinel

Microsoft Sentinel's [Microsoft 365 Defender](/microsoft-365/security/mtp/microsoft-threat-protection) connector with incident integration allows you to stream all Microsoft 365 Defender incidents and alerts into Microsoft Sentinel, and keeps the incidents synchronized between both portals. Microsoft 365 Defender incidents include all their alerts, entities, and other relevant information, and they group together, and are enriched by, alerts from Microsoft 365 Defender's component services **Microsoft Defender for Endpoint**, **Microsoft Defender for Identity**, **Microsoft Defender for Office 365**, and **Microsoft Defender for Cloud Apps**, as well as alerts from other services such as **Microsoft Purview Data Loss Prevention (DLP)** and **Microsoft Entra ID Protection (AADIP)**.

The connector also lets you stream **advanced hunting** events from *all* of the above Defender components into Microsoft Sentinel, allowing you to copy those Defender components' advanced hunting queries into Microsoft Sentinel, enrich Sentinel alerts with the Defender components' raw event data to provide additional insights, and store the logs with increased retention in Log Analytics.

For more information about incident integration and advanced hunting event collection, see [Microsoft 365 Defender integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md#advanced-hunting-event-collection).

 The Microsoft 365 Defender connector is now generally available.

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]
## Prerequisites

- You must have a valid license for Microsoft 365 Defender, as described in [Microsoft 365 Defender prerequisites](/microsoft-365/security/mtp/prerequisites). 

- Your user must be assigned the [Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator) or [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) roles on the tenant you want to stream the logs from.

- Your user must have read and write permissions on your Microsoft Sentinel workspace.

- To make any changes to the connector settings, your user must be a member of the same Microsoft Entra tenant with which your Microsoft Sentinel workspace is associated.
- Install the solution for **Microsoft 365 Defender** from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).

### Prerequisites for Active Directory sync via MDI

- Your tenant must be onboarded to Microsoft Defender for Identity.

- You must have the MDI sensor installed.

## Connect to Microsoft 365 Defender

In Microsoft Sentinel, select **Data connectors**, select **Microsoft 365 Defender** from the gallery and select **Open connector page**.

The  **Configuration** section has three parts:

1. [**Connect incidents and alerts**](#connect-incidents-and-alerts) enables the basic integration between Microsoft 365 Defender and Microsoft Sentinel, synchronizing incidents and their alerts between the two platforms.

1. [**Connect entities**](#connect-entities) enables the integration of on-premises Active Directory user identities into Microsoft Sentinel through Microsoft Defender for Identity.

1. [**Connect events**](#connect-events) enables the collection of raw advanced hunting events from Defender components.

These are explained in greater detail below. See [Microsoft 365 Defender integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md) for more information.

### Connect incidents and alerts

To ingest and synchronize Microsoft 365 Defender incidents, with all their alerts, to your Microsoft Sentinel incidents queue:

1. Mark the check box labeled **Turn off all Microsoft incident creation rules for these products. Recommended**, to avoid duplication of incidents.  
(This check box will not appear once the Microsoft 365 Defender connector is connected.)

1. Select the **Connect incidents & alerts** button.


> [!NOTE]
> When you enable the Microsoft 365 Defender connector, all of the Microsoft 365 Defender components’ connectors (the ones mentioned at the beginning of this article) are automatically connected in the background. In order to disconnect one of the components’ connectors, you must first disconnect the Microsoft 365 Defender connector.

To query Microsoft 365 Defender incident data, use the following statement in the query window:

```kusto
SecurityIncident
| where ProviderName == "Microsoft 365 Defender"
```

### Connect entities

Use Microsoft Defender for Identity to sync user entities from your on-premises Active Directory to Microsoft Sentinel.

Verify that you've satisfied the [prerequisites](#prerequisites-for-active-directory-sync-via-mdi) for syncing on-premises Active Directory users through Microsoft Defender for Identity (MDI).

1. Select the **Go the UEBA configuration page** link.

1. In the **Entity behavior configuration** page, if you haven't yet enabled UEBA, then at the top of the page, move the toggle to **On**.

1. Mark the **Active Directory (Preview)** check box and select **Apply**.

    :::image type="content" source="media/connect-microsoft-365-defender/ueba-configuration-page.png" alt-text="Screenshot of UEBA configuration page for connecting user entities to Sentinel.":::

### Connect events

If you want to collect advanced hunting events from Microsoft Defender for Endpoint or Microsoft Defender for Office 365, the following types of events can be collected from their corresponding advanced hunting tables.

1. Mark the check boxes of the tables with the event types you wish to collect:

    # [Defender for Endpoint](#tab/MDE)

    | Table name | Events type |
    |-|-|
    | **[DeviceInfo](/microsoft-365/security/defender/advanced-hunting-deviceinfo-table)** | Machine information, including OS information |
    | **[DeviceNetworkInfo](/microsoft-365/security/defender/advanced-hunting-devicenetworkinfo-table)** | Network properties of devices, including physical adapters, IP and MAC addresses, as well as connected networks and domains |
    | **[DeviceProcessEvents](/microsoft-365/security/defender/advanced-hunting-deviceprocessevents-table)** | Process creation and related events |
    | **[DeviceNetworkEvents](/microsoft-365/security/defender/advanced-hunting-devicenetworkevents-table)** | Network connection and related events |
    | **[DeviceFileEvents](/microsoft-365/security/defender/advanced-hunting-devicefileevents-table)** | File creation, modification, and other file system events |
    | **[DeviceRegistryEvents](/microsoft-365/security/defender/advanced-hunting-deviceregistryevents-table)** | Creation and modification of registry entries |
    | **[DeviceLogonEvents](/microsoft-365/security/defender/advanced-hunting-devicelogonevents-table)** | Sign-ins and other authentication events on devices |
    | **[DeviceImageLoadEvents](/microsoft-365/security/defender/advanced-hunting-deviceimageloadevents-table)** | DLL loading events |
    | **[DeviceEvents](/microsoft-365/security/defender/advanced-hunting-deviceevents-table)** | Multiple event types, including events triggered by security controls such as Windows Defender Antivirus and exploit protection |
    | **[DeviceFileCertificateInfo](/microsoft-365/security/defender/advanced-hunting-DeviceFileCertificateInfo-table)** | Certificate information of signed files obtained from certificate verification events on endpoints |

    # [Defender for Office 365](#tab/MDO)

    | Table name | Events type |
    |-|-|
    | **[EmailAttachmentInfo](/microsoft-365/security/defender/advanced-hunting-emailattachmentinfo-table)** | Information about files attached to emails |
    | **[EmailEvents](/microsoft-365/security/defender/advanced-hunting-emailevents-table)** | Microsoft 365 email events, including email delivery and blocking events |
    | **[EmailPostDeliveryEvents](/microsoft-365/security/defender/advanced-hunting-emailpostdeliveryevents-table)** | Security events that occur post-delivery, after Microsoft 365 has delivered the emails to the recipient mailbox |
    | **[EmailUrlInfo](/microsoft-365/security/defender/advanced-hunting-emailurlinfo-table)** | Information about URLs on emails |

    # [Defender for Identity](#tab/MDI)

    | Table name | Events type |
    |-|-|
    | **[IdentityDirectoryEvents](/microsoft-365/security/defender/advanced-hunting-identitydirectoryevents-table)** | Various identity-related events, like password changes, password expirations, and user principal name (UPN) changes, captured from an on-premises Active Directory domain controller<br><br>Also includes system events on the domain controller |
    | **[IdentityInfo](/microsoft-365/security/defender/advanced-hunting-identityinfo-table)** | Information about user accounts obtained from various services, including Microsoft Entra ID |
    | **[IdentityLogonEvents](/microsoft-365/security/defender/advanced-hunting-identitylogonevents-table)** | Authentication activities made through your on-premises Active Directory, as captured by Microsoft Defender for Identity <br><br>Authentication activities related to Microsoft online services, as captured by Microsoft Defender for Cloud Apps |
    | **[IdentityQueryEvents](/microsoft-365/security/defender/advanced-hunting-identityqueryevents-table)** | Information about queries performed against Active Directory objects such as users, groups, devices, and domains |

    # [Defender for Cloud Apps](#tab/MDCA)

    | Table name | Events type |
    |-|-|
    | **[CloudAppEvents](/microsoft-365/security/defender/advanced-hunting-cloudappevents-table)** | Information about activities in various cloud apps and services covered by Microsoft Defender for Cloud Apps |

    # [Defender alerts](#tab/MDA)

    | Table name | Events type |
    |-|-|
    | **[AlertInfo](/microsoft-365/security/defender/advanced-hunting-alertinfo-table)** | Information about alerts from Microsoft 365 Defender components |
    | **[AlertEvidence](/microsoft-365/security/defender/advanced-hunting-alertevidence-table)** | Information about various entities - files, IP addresses, URLs, users, devices - associated with alerts from Microsoft 365 Defender components |

    ---

1. Click **Apply Changes**.

1. To query the advanced hunting tables in Log Analytics, enter the table name from the list above in the query window.

## Verify data ingestion

The data graph in the connector page indicates that you are ingesting data. You'll notice that it shows one line each for incidents, alerts, and events, and the events line is an aggregation of event volume across all enabled tables. Once you have enabled the connector, you can use the following KQL queries to generate more specific graphs.

Use the following KQL query for a graph of the incoming Microsoft 365 Defender incidents:

```kusto
let Now = now(); 
(range TimeGenerated from ago(14d) to Now-1d step 1d 
| extend Count = 0 
| union isfuzzy=true ( 
    SecurityIncident
    | where ProviderName == "Microsoft 365 Defender"
    | summarize Count = count() by bin_at(TimeGenerated, 1d, Now) 
) 
| summarize Count=max(Count) by bin_at(TimeGenerated, 1d, Now) 
| sort by TimeGenerated 
| project Value = iff(isnull(Count), 0, Count), Time = TimeGenerated, Legend = "Events") 
| render timechart 
```

Use the following KQL query to generate a graph of event volume for a single table (change the *DeviceEvents* table to the required table of your choosing):

```kusto
let Now = now();
(range TimeGenerated from ago(14d) to Now-1d step 1d
| extend Count = 0
| union isfuzzy=true (
    DeviceEvents
    | summarize Count = count() by bin_at(TimeGenerated, 1d, Now)
)
| summarize Count=max(Count) by bin_at(TimeGenerated, 1d, Now)
| sort by TimeGenerated
| project Value = iff(isnull(Count), 0, Count), Time = TimeGenerated, Legend = "Events")
| render timechart
```

In the **Next steps** tab, you’ll find some useful workbooks, sample queries, and analytics rule templates that have been included. You can run them on the spot or modify and save them.

## Next steps

In this document, you learned how to integrate Microsoft 365 Defender incidents, and advanced hunting event data from Microsoft Defender component services, into Microsoft Sentinel, using the Microsoft 365 Defender connector. To learn more about Microsoft Sentinel, see the following articles:

- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](./detect-threats-built-in.md).
