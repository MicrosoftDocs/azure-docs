---
title: 'Tutorial: View Azure DDoS Protection logs in Log Analytics workspace'
description: Learn how to view DDoS protection diagnostic logs in Log Analytics workspace.
services: ddos-protection
author: duongau
ms.service: azure-ddos-protection
ms.topic: tutorial
ms.date: 07/10/2026
ms.author: duau
ms.custom: sfi-image-nochange
# Customer intent: As a network administrator, I want to view DDoS protection diagnostic logs in a Log Analytics workspace, so that I can monitor attack notifications, mitigation reports, and flow logs to ensure effective security and response during DDoS attacks.
---

# Tutorial: View Azure DDoS Protection logs in Log Analytics workspace

In this tutorial, you learn how to:

> [!div class="checklist"]
> * view Azure DDoS Protection diagnostic logs including notifications, mitigation reports and mitigation flow logs.

DDoS Protection diagnostic logs provide you with the ability to view DDoS Protection notifications, mitigation reports and mitigation flow logs after a DDoS attack. You can view these logs in your Log Analytics workspace.

Attack mitigation reports use the Netflow protocol data, which is aggregated to provide detailed information about the attack on your resource. Anytime a public IP resource is under attack, the report generation starts as soon as the mitigation starts. There will be an incremental report generated every 5 mins and a post-mitigation report for the whole mitigation period. This is to ensure that in an event the DDoS attack continues for a longer duration of time, you'll be able to view the most current snapshot of mitigation report every 5 minutes and a complete summary once the attack mitigation is over.

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- [DDoS Network Protection](manage-ddos-protection.md) must be enabled on a virtual network or [DDoS IP Protection](manage-ddos-protection-powershell-ip.md) must be enabled on a public IP address. 
- Configure DDoS Protection diagnostic logs. To learn more, see [Configure diagnostic logs](diagnostic-logging.md).
- Simulate an attack using one of our simulation partners. To learn more, see [Test with simulation partners](test-through-simulations.md).

### View in Log Analytics workspace

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. In the search box at the top of the portal, enter **Log Analytics workspace**. Select **Log Analytics workspace** in the search results.
1. Under the **Log Analytics workspaces** blade, select your workspace.
1. On the left-side tab, select **Logs**. Here you see the query explorer. Exit out the *Queries* pane to utilize the *Logs* page. 

    :::image type="content" source="./media/ddos-view-diagnostic-logs/ddos-select-logs-in-workspace.png" alt-text="Screenshot of viewing a log analytics workspace.":::

1. In the *Logs* page, type in your query then hit *Run* to view results.

    :::image type="content" source="./media/ddos-view-diagnostic-logs/ddos-notification-logs.png" alt-text="Screenshot of viewing DDoS Protection notification logs in log analytics workspace.":::

### Query Azure DDoS Protection logs in log analytics workspace

For more information on log schemas, see [View diagnostic logs](ddos-view-diagnostic-logs.md#example-log-queries).

#### DDoSProtectionNotifications logs

1. Under the **Log analytics workspaces** blade, select your log analytics workspace.


1. On the left side pane, select **Logs**. Here you see the query explorer. 

1. In Query explorer, type in the following Kusto Query and change the time range to Custom and change the time range to last three months. Then hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSProtectionNotifications"
    ```

1. To view **DDoSMitigationFlowLogs** change the query to the following and keep the same time range and hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSMitigationFlowLogs"
    ```

1. To view **DDoSMitigationReports** change the query to the following and keep the same time range and hit Run.

    ```kusto
    AzureDiagnostics
    | where Category == "DDoSMitigationReports"
    ```

## Example log queries

### DDoS Protection Notifications

Notifications will notify you anytime a public IP resource is under attack, and when attack mitigation is over.

```kusto
AzureDiagnostics
| where Category == "DDoSProtectionNotifications"
```


The following table lists the field names and descriptions:

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the notification was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For notifications, this will be `DDoSProtectionNotifications`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For notifications, this is `DDoSProtectionNotifications`.  |
| **Message** | Details of the attack. |
| **Type** | Type of notification. Possible values include `MitigationStarted`. `MitigationStopped`. |
| **PublicIpAddress** | Your public IP address. |

### DDoS Mitigation FlowLogs

Attack mitigation flow logs allow you to review the dropped traffic, forwarded traffic, and other interesting data-points during an active DDoS attack in near-real time. You can ingest the constant stream of this data into Microsoft Sentinel or to your third-party SIEM systems via event hub for near-real time monitoring, take potential actions and address the need of your defense operations.

> [!IMPORTANT]
> Upcoming schema changes: As part of the Standard Load Balancer (SLB) regional migration, `DDoSMitigationFlowLogs` is scheduled to gain new fields and change two existing field types starting **on or around mid-August 2026**. These changes aren't live yet. This section documents what to expect so you can update your queries, dashboards, and Sentinel/SIEM parsers ahead of time. If you integrated these flow logs with Microsoft Sentinel or a third-party SIEM, review your analytics rules and parsers for the field changes described in this section before the migration starts.

```kusto
AzureDiagnostics
| where Category == "DDoSMitigationFlowLogs"
```

The following table lists the field names and descriptions:

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the flow log was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For flow logs, this is `DDoSMitigationFlowLogs`.|
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For flow logs, this is `DDoSMitigationFlowLogs`. |
| **Message** | Details of the attack. |
| **SourcePublicIpAddress** | The public IP address of the client generating traffic to your public IP address. Renaming: after the migration, this field is renamed `sourcePublicIpAddress_s`. The value and meaning don't change; only the column name changes. |
| **SourcePort** | Port number ranging from 0 to 65535. Changing: after the migration, this field is renamed `sourcePort_d` and changes from a string to a numeric (double) type. Update any KQL that treats this field as a string (for example, `toint(sourcePort_s)`) to work with it as a number directly. |
| **DestPublicIpAddress** | Your public IP address. Renaming: after the migration, this field is renamed `destPublicIpAddress_s`. The value and meaning don't change; only the column name changes. |
| **DestPort** | Port number ranging from 0 to 65535. Changing: after the migration, this field is renamed `destPort_d` and changes from a string to a numeric (double) type, the same as `SourcePort` described earlier. |
| **Protocol** | Type of protocol. Possible values include `tcp`, `udp`, `other`. Renaming: after the migration, this field is renamed `protocol_s`. The value and meaning don't change; only the column name changes. |

> [!NOTE]
> Even fields whose *meaning* doesn't change (`SourcePublicIpAddress`, `DestPublicIpAddress`, `Protocol`) get renamed to the new lowercase naming convention as part of this migration. Update any KQL referencing the current PascalCase column names, not just queries touching the port fields or the new attribution fields described in the following section.

#### New fields (effective on or around mid-August 2026)

The migration also adds the following fields to `DDoSMitigationFlowLogs`, enriching it with attack attribution and geo-location data that previously required `DDoSMitigationReports` (see [DDoS Mitigation Reports](#ddos-mitigation-reports) section):

| Field name | Type | Description |
| --- | --- | --- |
| **attackId_g** | GUID | A unique identifier for each attack and mitigation event. Use this value to correlate flow log activity across regions for the same attack. |
| **sourceCountry_s** | String | The two-letter country code of the source IP address. |
| **sourceContinent_s** | String | The continent of the source IP address. |
| **sourceAsn_d** | Double | The autonomous system number (ASN) of the source IP address. |
| **tcpFlags_d** | Double | The TCP flag values observed in the traffic. |

### DDoS Mitigation Reports

> [!IMPORTANT]
> The `DDoSMitigationReports` log category is retiring. As part of the Standard Load Balancer (SLB) regional migration, the service stops emitting this log category **on or around mid-August 2026**. The old pipeline is fully deprecated **by September 2026**. If you have dashboards, workbooks, or alerts that query `DDoSMitigationReports`, they stop receiving data once the migration completes. Use the guidance in the following section to rebuild equivalent views from [`DDoSMitigationFlowLogs`](#ddos-mitigation-flowlogs) before then. These dates are approximate; check back closer to the migration for confirmation.

```kusto
AzureDiagnostics
| where Category == "DDoSMitigationReports"
```

The following table lists the field names and descriptions for this now-retiring log category:

| Field name | Description |
| --- | --- |
| **TimeGenerated** | The date and time in UTC when the notification was created. |
| **ResourceId** | The resource ID of your public IP address. |
| **Category** | For mitigation reports, this is `DDoSMitigationReports`. |
| **ResourceGroup** | The resource group that contains your public IP address and virtual network. |
| **SubscriptionId** | Your DDoS protection plan subscription ID. |
| **Resource** | The name of your public IP address. |
| **ResourceType** | This will always be `PUBLICIPADDRESS`. |
| **OperationName** | For mitigation reports, this is `DDoSMitigationReports`.  |
| **ReportType** | Possible values are `Incremental` and `PostMitigation`. |
| **MitigationPeriodStart** | The date and time in UTC when the mitigation started. |
| **MitigationPeriodEnd** | The date and time in UTC when the mitigation ended. |
| **IPAddress**  | Your public IP Address. |
| **AttackVectors** | Degradation of attack types. The keys include `TCP SYN flood`, `TCP flood`, `UDP flood`, `UDP reflection`, and `Other packet flood`. |
| **TrafficOverview** | Degradation of attack traffic. The keys include `Total packets`, `Total packets dropped`, `Total TCP packets`, `Total TCP packets dropped`, `Total UDP packets`, `Total UDP packets dropped`, `Total Other packets`, and `Total Other packets dropped`. |
| **Protocols**  | Breakdown of protocols included. The keys include `TCP`, `UDP`, and `Other`.   |
| **DropReasons** | Analysis of causes of dropped packets. The keys include `Protocol violation invalid TCP`. `syn Protocol violation invalid TCP`, `Protocol violation invalid UDP`, `UDP reflection`, `TCP rate limit exceeded`, `UDP rate limit exceeded`, `Destination limit exceeded`, `Other packet flood Rate limit exceeded`, and `Packet was forwarded to service`. Protocol violation invalid drop reasons refer to malformed packets. |
| **TopSourceCountries** | Breakdown of the top 10 source countries/regions into inbound traffic. |
| **TopSourceCountriesForDroppedPackets** | Analysis of the top 10 source countries/regions for attack traffic that have been throttled. |
| **TopSourceASNs** | Analysis of the top 10 sources of autonomous system numbers (ASNs) of incoming traffic.  |
| **SourceContinents** | Analysis of the source continent for inbound traffic. |
| **Type** | Type of notification. Possible values include `MitigationStarted`. `MitigationStopped`. |

#### Migrate from DDoSMitigationReports to DDoSMitigationFlowLogs

Use the following mapping to rebuild the equivalent of each retiring report field from flow log data:

| Retiring report field | Rebuild from flow logs |
| --- | --- |
| **MitigationPeriodStart** | `min(TimeGenerated)`, grouped by `attackId_g` |
| **MitigationPeriodEnd** | `max(TimeGenerated)`, grouped by `attackId_g` |
| **IPAddress** | `destPublicIpAddress_s` |
| **AttackVectors** | Derive from the `Message` field. See the mapping table in the next section. You can only partially reconstruct this field, since the new schema doesn't provide a curated JSON classification like the old report did. |
| **TrafficOverview** | Aggregate counts by using `count()`, filtered by `Message` and protocol. See the example query in the next section. |
| **Protocols** | Percentage breakdown by using counts grouped by `protocol_s`. |
| **DropReasons** | Raw reasons remain available in the `Message` field, but you can only partially reconstruct this field. The old structured JSON breakdown is gone. |
| **TopSourceCountries** / **TopSourceCountriesForDroppedPackets** | `sourceCountry_s`, optionally filtered to dropped traffic |
| **TopSourceASNs** | `sourceAsn_d` |
| **SourceContinents** | `sourceContinent_s` |

The following example rebuilds a report-style **traffic overview** from `DDoSMitigationFlowLogs`:

```kusto
AzureDiagnostics
| where Category == "DDoSMitigationFlowLogs"
| summarize
    Total_packets           = count(),
    Total_packets_dropped   = countif(Message != "Packet was forwarded to service"),
    Total_TCP_packets       = countif(protocol_s == "tcp"),
    Total_TCP_dropped       = countif(Message != "Packet was forwarded to service" and protocol_s == "tcp"),
    Total_UDP_packets       = countif(protocol_s == "udp"),
    Total_UDP_dropped       = countif(Message != "Packet was forwarded to service" and protocol_s == "udp"),
    Total_Other_packets     = countif(protocol_s == "other"),
    Total_Other_dropped     = countif(Message != "Packet was forwarded to service" and protocol_s == "other")
    by destPublicIpAddress_s, attackId_g
```

To approximate the old **AttackVectors** classification, map the flow log `Message` field to an attack vector by using the following table:

| Message value | Derived attack vector |
| --- | --- |
| `Protocol violation invalid TCP syn` | TCP SYN flood |
| `TCP source IP traffic based rate limit` | TCP flood |
| `TCP destination IP and connection based rate limit` | TCP flood |
| `Protocol violation invalid TCP` | TCP flood |
| `UDP source IP traffic based rate limit` | UDP flood |
| `UDP destination IP traffic based rate limit` | UDP flood |
| `Protocol violation invalid UDP` | UDP flood |
| `UDP reflection` | UDP reflection |
| `Other packet flood` | Other packet flood |
| `Packet was forwarded to service` | Allowed traffic (not dropped) |

> [!NOTE]
> You can't fully recreate some data from `DDoSMitigationReports` by using `DDoSMitigationFlowLogs`:
>
> - **ReportType** (`Incremental`/`PostMitigation`) — this distinction no longer exists.
> - **AttackVectors** — the curated JSON classification is gone; the preceding mapping table only approximates it from raw message text.
> - **DropReasons** — the structured, packet-counted JSON breakdown is gone; only raw `Message` values remain, which you must aggregate yourself.
>
> The migration doesn't affect `DDoSProtectionNotifications` (see [DDoS Protection Notifications](#ddos-protection-notifications) earlier in this article) and requires no changes.

## Next steps

In this tutorial, you learned how to view DDoS Protection diagnostic logs in a Log Analytics workspace. To learn more about the recommended steps to take when you receive a DDoS attack, see these next steps.

> [!div class="nextstepaction"]
> [Engage with Azure DDoS Rapid Response](ddos-rapid-response.md)

> [!div class="nextstepaction"]
> [components of a DDoS Rapid Response Strategy](ddos-response-strategy.md)
