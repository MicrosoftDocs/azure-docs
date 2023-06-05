---
title: Stream and filter Windows DNS logs with the AMA connector 
description: Use the AMA connector to upload and filter data from your Windows DNS server logs. You can then dive into your logs to protect your DNS servers from threats and attacks.
author: limwainstein
ms.topic: how-to
ms.date: 01/05/2022
ms.author: lwainstein
#Customer intent: As a security operator, I want to proactively monitor Windows DNS activities so that I can prevent threats and attacks on DNS servers.
---

# Stream and filter data from Windows DNS servers with the AMA connector

This article describes how to use the Azure Monitor Agent (AMA) connector to stream and filter events from your Windows Domain Name System (DNS) server logs. You can then deeply analyze your data to protect your DNS servers from threats and attacks.

The AMA and its DNS extension are installed on your Windows Server to upload data from your DNS analytical logs to your Microsoft Sentinel workspace. [Learn about the connector](#windows-dns-events-via-ama-connector).

> [!IMPORTANT]
> The Windows DNS Events via AMA connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

## Overview 

### Why it's important to monitor DNS activity

DNS is a widely used protocol, which maps between host names and computer readable IP addresses. Because DNS wasn’t designed with security in mind, the service is highly targeted by malicious activity, making its logging an essential part of security monitoring. 

Some well-known threats that target DNS servers include: 
- DDoS attacks targeting DNS servers
- DNS DDoS Amplification 
- DNS hijacking 
- DNS tunneling 
- DNS poisoning 
- DNS spoofing 
- NXDOMAIN attack 
- Phantom domain attacks

### Windows DNS Events via AMA connector

While some mechanisms were introduced to improve the overall security of this protocol, DNS servers are still a highly targeted service. Organizations can monitor DNS logs to better understand network activity, and to identify suspicious behavior or attacks targeting resources within the network. The **Windows DNS Events via AMA** connector provides this type of visibility. 

With the connector, you can:  
- Identify clients that try to resolve malicious domain names.
- View and monitor request loads on DNS servers.
- View dynamic DNS registration failures.
- Identify frequently queried domain names and talkative clients. 
- Identify stale resource records. 
- View all DNS related logs in one place. 

### How collection works with the Windows DNS Events via AMA connector

1. The AMA connector uses the installed DNS extension to collect and parse the logs. 

    > [!NOTE]
    > The Windows DNS Events via AMA connector currently supports analytic event activities only.
 
1. The connector streams the events to the Microsoft Sentinel workspace to be further analyzed. 
1. You can now use advanced filters to filter out specific events or information. With advanced filters, you upload only the valuable data you want to monitor, reducing costs and bandwidth usage. 

### Normalization using ASIM

This connector is fully normalized using [Advanced Security Information Model (ASIM) parsers](normalization.md). The connector streams events originated from the analytical logs into the normalized table named `ASimDnsActivityLogs`. This table acts as a translator, using one unified language, shared across all DNS connectors to come. 

For a source-agnostic parser that unifies all DNS data and ensures that your analysis runs across all configured sources, use the [ASIM DNS unifying parser](normalization-schema-dns.md#out-of-the-box-parsers) `_Im_Dns`.   

The ASIM unifying parser complements the native `ASimDnsActivityLogs` table. While the native table is ASIM compliant, the parser is needed to add capabilities, such as aliases, available only at query time, and to combine `ASimDnsActivityLogs`  with other DNS data sources.   

The [ASIM DNS schema](normalization-schema-dns.md) represents the DNS protocol activity, as logged in the Windows DNS server in the analytical logs. The schema is governed by official parameter lists and RFCs that define fields and values. 

See the [list of Windows DNS server fields](dns-ama-fields.md#asim-normalized-dns-schema) translated into the normalized field names.

## Set up the Windows DNS over AMA connector

You can set up the connector in two ways:  
- [Microsoft Sentinel portal](#set-up-the-connector-in-the-microsoft-sentinel-portal-ui). With this setup, you can create, manage, and delete a single Data Collection Rule (DCR) per workspace. Even if you define multiple DCRs via the API, the portal shows only a single DCR. 
- [API](#set-up-the-connector-with-the-api). With this setup, you can create, manage, and delete multiple DCRs. 

### Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- Windows Server 2012 R2 with auditing hotfix and later.
- A Windows DNS Server with analytical logs enabled. 
- To collect events from any system that isn't an Azure virtual machine, ensure that [Azure Arc](../azure-monitor/agents/azure-monitor-agent-manage.md) is installed. Install and enable Azure Arc before you enable the Azure Monitor Agent-based connector. This requirement includes:
    - Windows servers installed on physical machines
    - Windows servers installed on on-premises virtual machines
    - Windows servers installed on virtual machines in non-Azure clouds 

### Set up the connector in the Microsoft Sentinel portal (UI)

#### Open the connector page and create the DCR

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. In the **Data connectors** blade, in the search bar, type *DNS*.
1. Select the **Windows DNS Events via AMA (Preview)** connector.
1. Below the connector description, select **Open connector page**.
1. In the **Configuration** area, select **Create data collection rule**. You can create a single DCR per workspace. If you need to create multiple DCRs, [use the API](#set-up-the-connector-with-the-api).

The DCR name, subscription, and resource group are automatically set based on the workspace name, the current subscription, and the resource group the connector was selected from.

:::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-create-dcr.png" alt-text="Screenshot of creating a new D C R for the Windows D N S over A M A connector.":::

#### Define resources (VMs)

1. Select the **Resources** tab and select **Add Resource(s)**. 
1. Select the VMs on which you want to install the connector to collect logs.

    :::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-select-resource.png" alt-text="Screenshot of selecting resources for the Windows D N S over A M A connector.":::

1. Review your changes and select **Save** > **Apply**.  

#### Filter out undesired events

When you use filters, you exclude the event that the filter specifies. In other words, Microsoft Sentinel doesn't collect data for the specified event. While this step isn't required, it can help reduce costs and simplify event triage. 

To create filters:

1. On the connector page, in the **Configuration** area, select **Add data collection filters**. 
1. Type a name for the filter and select the filter type. The filter type is a parameter that reduces the number of collected events. The parameters are normalized according to the DNS normalized schema. See the list of [available fields for filtering](dns-ama-fields.md#available-fields-for-filtering).

    :::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-create-filter.png" alt-text="Screenshot of creating a filter for the Windows D N S over A M A connector.":::

1. To add complex filters, select **Add field to filter** and add the relevant field.

    :::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-filter-fields.png" alt-text="Screenshot of adding fields to a filter for the Windows D N S over A M A connector.":::

1. To add new filters, select **Add new filters**.  
1. To edit, or delete existing filters or fields, select the edit or delete icons in the table under the **Configuration** area. To add fields or filters, select **Add data collection filters** again.
1. To save and deploy the filters to your connectors, select **Apply changes**.

### Set up the connector with the API

You can create [DCRs](/rest/api/monitor/data-collection-rules) using the API. Use this option if you need to create multiple DCRs. 

Use this example as a template to create or update a DCR: 

#### Request URL and header  

```rest

PUT 

    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview 
```
 
#### Request body

```rest

{
    "properties": {
        "dataSources": {
            "windowsEventLogs": [],
            "extensions": [
                {
                    "streams": [
                        "Microsoft-ASimDnsActivityLogs"
                    ],
                    "extensionName": "MicrosoftDnsAgent",
                    "extensionSettings": {
                        "Filters": [
                            {
                                "FilterName": "SampleFilter",
                                "Rules": [
                                    {
                                        "Field": "EventOriginalType",
                                        "FieldValues": [
                                            "260"
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    "name": "SampleDns"
                }
            ]
        },
        "destinations": {
            "logAnalytics": [
                {
                    "workspaceResourceId": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.OperationalInsights/workspaces/{sentinelWorkspaceName}",
                    "workspaceId": {WorkspaceGuid}",
                    "name": "WorkspaceDestination"
                }
            ]
        },
        "dataFlows": [
            {
                "streams": [
                    "Microsoft-ASimDnsActivityLogs"
                ],
                "destinations": [
                    " WorkspaceDestination "
                ]
            }
        ],
    },
    "location": "eastus2",
    "tags": {},
    "kind": "Windows",
    "id":"/subscriptions/{subscriptionId}/resourceGroups/{resourceGroup}/providers/Microsoft.Insights/dataCollectionRules/{workspaceName}-microsoft-sentinel-asimdnsactivitylogs ",
    "name": " {workspaceName}-microsoft-sentinel-asimdnsactivitylogs ",
    "type": "Microsoft.Insights/dataCollectionRules",
}
```

## Use advanced filters 

DNS server event logs can contain a huge number of events. You can use advanced filtering to filter out unneeded events before the data is uploaded, saving valuable triage time and costs. The filters remove the unneeded data from the stream of events uploaded to your workspace.

Filters are based on a combination of numerous fields. 
- You can use multiple values for each field using a comma-separated list. 
- To create compound filters, use different fields with an AND relation.  
- To combine different filters, use an OR relation between them. 

Review the [available fields for filtering](dns-ama-fields.md#available-fields-for-filtering).

### Use wildcards

You can use wildcards in advanced filters. Review these considerations when using wildcards: 

- Add a dot after each asterisk (`*.`).
- Don't use spaces between the list of domains.
- Wildcards apply to the domain's subdomains only, including `www.domain.com`, regardless of the protocol. For example, if you use `*.domain.com` in an advanced filter: 
    - The filter applies to `www.domain.com` and `subdomain.domain.com`, regardless of whether the protocol is HTTPS, FTP, and so on. 
    - The filter doesn't apply to `domain.com`. To apply a filter to `domain.com`, specify the domain directly, without using a wildcard.  

### Advanced filter examples

#### Don't collect specific event IDs

This filter instructs the connector not to collect EventID 256 or EventID 257 or EventID 260 with IPv6 addresses.

**Using the Microsoft Sentinel portal**:

1. Create a filter with the **EventOriginalType** field, using the **Equals** operator, with the values **256**, **257**, and **260**. 

    :::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-eventid-filter.png" alt-text="Screenshot of filtering out event IDs for the Windows D N S over A M A connector.":::

1. Create a filter with the **EventOriginalType** field defined above, and using the **And** operator, also including the **DnsQueryTypeName** field set to **AAAA**.

    :::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-eventid-dnsquery-filter.png" alt-text="Screenshot of filtering out event IDs and IPv6 addresses for the Windows D N S over A M A connector.":::

**Using the API**:

```rest
"Filters": [
    {
        "FilterName": "SampleFilter",
        "Rules": [
            {
                "Field": "EventOriginalType",
                "FieldValues": [
                    "256", "257", "260"                                                                              
                ]
            },
            {
                "Field": "DnsQueryTypeName",
                "FieldValues": [
                    "AAAA"                                        
                ]
            }
        ]
    },
    {
        "FilterName": "EventResultDetails",
        "Rules": [
            {
                "Field": "EventOriginalType",
                "FieldValues": [
                    "230"                                        
                ]
            },
            {
                "Field": "EventResultDetails",
                "FieldValues": [
                    "BADKEY","NOTZONE"                                        
                ]
            }
        ]
    }
]
```

#### Don't collect events with specific domains
 
This filter instructs the connector not to collect events from any subdomains of microsoft.com, google.com, amazon.com, or events from facebook.com or center.local.

**Using the Microsoft Sentinel portal**:

Set the **DnsQuery** field using the **Equals** operator, with the list *\*.microsoft.com,\*.google.com,facebook.com,\*.amazon.com,center.local*. 

Review these considerations for [using wildcards](#use-wildcards). 

:::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-domain-filter.png" alt-text="Screenshot of filtering out domains for the Windows D N S over A M A connector."::: 

To define different values in a single field, use the **OR** operator.

**Using the API**:

Review these considerations for [using wildcards](#use-wildcards). 

```rest
"Filters": [ 

    { 

        "FilterName": "SampleFilter", 

        "Rules": [ 

            { 

                "Field": "DnsQuery", 

                "FieldValues": [ 

                    "*.microsoft.com", "*.google.com", "facebook.com", "*.amazon.com","center.local"                                                                               

                ] 

            }, 

         } 

    } 

] 
```

## Next steps
In this article, you learned how to set up the Windows DNS events via AMA connector to upload data and filter your Windows DNS logs. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.