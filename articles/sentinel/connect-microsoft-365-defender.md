---
title: Connect Microsoft Defender XDR data to Microsoft Sentinel| Microsoft Docs
description: Learn how to ingest incidents, alerts, and raw event data from Microsoft Defender XDR into Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: how-to
ms.date: 06/25/2023
appliesto:
- Microsoft Sentinel in the Azure portal and the Microsoft Defender portal
ms.collection: usx-security
---

# Connect data from Microsoft Defender XDR to Microsoft Sentinel

The Microsoft Defender XDR connector for Microsoft Sentinel allows you to stream all Microsoft Defender XDR incidents, alerts, and advanced hunting events into Microsoft Sentinel. This connector keeps the incidents synchronized between both portals. Microsoft Defender XDR incidents include alerts, entities, and other relevant information from all the Microsoft Defender products and services. For more information, see [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md).

The Defender XDR connector, especially its incident integration feature, is the foundation of the unified security operations platform. If you're onboarding Microsoft Sentinel to the Microsoft Defender portal, you must first enable this connector with incident integration.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## Prerequisites

Before you begin, you must have the appropriate licensing, access, and configured resources described in this section.

- You must have a valid license for Microsoft Defender XDR, as described in [Microsoft Defender XDR prerequisites](/microsoft-365/security/mtp/prerequisites).
- Your user account must be assigned the [Global Administrator](../active-directory/roles/permissions-reference.md#global-administrator) or [Security Administrator](../active-directory/roles/permissions-reference.md#security-administrator) roles on the tenant you want to stream the logs from.
- You must have read and write permissions on your Microsoft Sentinel workspace.
- To make any changes to the connector settings, your account must be a member of the same Microsoft Entra tenant with which your Microsoft Sentinel workspace is associated.
- Install the solution for **Microsoft Defender XDR** from the **Content Hub** in Microsoft Sentinel. For more information, see [Discover and manage Microsoft Sentinel out-of-the-box content](sentinel-solutions-deploy.md).
- Grant access to Microsoft Sentinel as appropriate for your organization. For more information, see [Roles and permissions in Microsoft Sentinel](roles.md).

For on-premises Active Directory sync via Microsoft Defender for Identity:

- Your tenant must be onboarded to Microsoft Defender for Identity.
- You must have the Microsoft Defender for Identity sensor installed.

## Connect to Microsoft Defender XDR

In Microsoft Sentinel, select **Data connectors**. Select **Microsoft Defender XDR** from the gallery and **Open connector page**.

The  **Configuration** section has three parts:

1. [**Connect incidents and alerts**](#connect-incidents-and-alerts) enables the basic integration between Microsoft Defender XDR and Microsoft Sentinel, synchronizing incidents and their alerts between the two platforms.

1. [**Connect entities**](#connect-entities) enables the integration of on-premises Active Directory user identities into Microsoft Sentinel through Microsoft Defender for Identity.

1. [**Connect events**](#connect-events) enables the collection of raw advanced hunting events from Defender components.

For more information, see [Microsoft Defender XDR integration with Microsoft Sentinel](microsoft-365-defender-sentinel-integration.md).

### Connect incidents and alerts

To ingest and synchronize Microsoft Defender XDR incidents with all their alerts to your Microsoft Sentinel incidents queue, complete the following steps.

1. Mark the check box labeled **Turn off all Microsoft incident creation rules for these products. Recommended**, to avoid duplication of incidents. This check box doesn't appear once the Microsoft Defender XDR connector is connected.

1. Select the **Connect incidents & alerts** button.
1. Verify that Microsoft Sentinel is collecting Microsoft Defender XDR incident data. In Microsoft Sentinel **Logs** in the Azure portal, run the following statement in the query window:

   ```kusto
      SecurityIncident
      |    where ProviderName == "Microsoft 365 Defender"
   ```

When you enable the Microsoft Defender XDR connector, any Microsoft Defender components’ connectors that were previously connected are automatically disconnected in the background. Although they continue to *appear* connected, no data flows through them.

### Connect entities

Use Microsoft Defender for Identity to sync user entities from your on-premises Active Directory to Microsoft Sentinel.

1. Select the **Go the UEBA configuration page** link.

1. In the **Entity behavior configuration** page, if you didn't enable UEBA, then at the top of the page, move the toggle to **On**.

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
    | **[EmailPostDeliveryEvents](/microsoft-365/security/defender/advanced-hunting-emailpostdeliveryevents-table)** | Security events that occur post-delivery, after Microsoft 365 delivers the emails to the recipient mailbox |
    | **[EmailUrlInfo](/microsoft-365/security/defender/advanced-hunting-emailurlinfo-table)** | Information about URLs on emails |
    |**[UrlClickEvents](/defender-xdr/advanced-hunting-urlclickevents-table)**|Events involving URLs clicked, selected, or requested on Microsoft Defender for Office 365|

    # [Defender for Identity](#tab/MDI)

    | Table name | Events type |
    |-|-|
    | **[IdentityDirectoryEvents](/microsoft-365/security/defender/advanced-hunting-identitydirectoryevents-table)** | Various identity-related events, like password changes, password expirations, and user principal name (UPN) changes, captured from an on-premises Active Directory domain controller<br><br>Also includes system events on the domain controller |
    | **[IdentityLogonEvents](/microsoft-365/security/defender/advanced-hunting-identitylogonevents-table)** | Authentication activities made through your on-premises Active Directory, as captured by Microsoft Defender for Identity <br><br>Authentication activities related to Microsoft online services, as captured by Microsoft Defender for Cloud Apps |
    | **[IdentityQueryEvents](/microsoft-365/security/defender/advanced-hunting-identityqueryevents-table)** | Information about queries performed against Active Directory objects such as users, groups, devices, and domains |

    # [Defender for Cloud Apps](#tab/MDCA)

    | Table name | Events type |
    |-|-|
    | **[CloudAppEvents](/microsoft-365/security/defender/advanced-hunting-cloudappevents-table)** | Information about activities in various cloud apps and services covered by Microsoft Defender for Cloud Apps |

    # [Defender alerts](#tab/MDA)

    | Table name | Events type |
    |-|-|
    | **[AlertInfo](/microsoft-365/security/defender/advanced-hunting-alertinfo-table)** | Alerts from Microsoft Defender for Endpoint, Microsoft Defender for Office 365, Microsoft Cloud App Security, and Microsoft Defender for Identity, including severity information and threat categorization|
    | **[AlertEvidence](/microsoft-365/security/defender/advanced-hunting-alertevidence-table)** | Information about various entities - files, IP addresses, URLs, users, devices - associated with alerts from Microsoft Defender XDR components|

    ---

1. Select **Apply Changes**.

To run a query in the advanced hunting tables in Log Analytics, enter the table name in the query window.

## Verify data ingestion

The data graph in the connector page indicates that you're ingesting data. Notice that it shows one line each for incidents, alerts, and events, and the events line is an aggregation of event volume across all enabled tables. After you enable the connector, use the following KQL queries to generate more specific graphs.

Use the following KQL query for a graph of the incoming Microsoft Defender XDR incidents:

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

## Next steps

In this document, you learned how to integrate Microsoft Defender XDR incidents, alerts, and advanced hunting event data from Microsoft Defender services, into Microsoft Sentinel, by using the Microsoft Defender XDR connector.

To use Microsoft Sentinel integrated with Defender XDR in the unified security operations platform, see [Connect Microsoft Sentinel to Microsoft Defender XDR](/defender-xdr/microsoft-sentinel-onboard).
