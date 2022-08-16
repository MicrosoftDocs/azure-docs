---
title: Stream and filter Windows DNS logs with the AMA connector 
description: Use the AMA connector to upload and filter data from your Windows DNS server logs, so you can dive deep into your logs, and protect your DNS servers from threats and attacks.
author: limwainstein
ms.topic: how-to
ms.date: 01/05/2022
ms.author: lwainstein
#Customer intent: As a security operator, I want proactively monitor Windows DNS activities so that I can prevent threats and attacks on DNS servers.
---

# Stream and filter data from Windows DNS servers with the AMA connector

[!INCLUDE [reference-to-feature-availability](includes/reference-to-feature-availability.md)]

This article describes how to use the AMA connector to stream and filter events from your Windows Domain Name System (DNS) server logs. You can then dive deep into your data to protect your DNS servers from threats and attacks.

The Azure Monitor Agent (AMA) and its DNS extension are installed on your Windows Server to upload data from your DNS analytical logs to your Microsoft Sentinel workspace. Learn about the [benefits of using the AMA connector](#windows-dns-events-via-ama-connector-benefits).

> [!IMPORTANT]
> The Windows DNS Events via AMA connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

## Overview 

### Why it's important to monitor DNS activity

DNS is a widely used protocol, which maps between host names and computer readable IP addresses. Because DNS was designed with many security gaps, it is highly targeted by malicious activity, making its logging an essential part of security monitoring. 

Some well-known threats that target DNS servers include: 
- DDoS attacks targeting DNS servers
- DNS DDoS Amplification 
- DNS hijacking 
- DNS tunneling 
- DNS poisoning 
- DNS spoofing 
- NXDOMAIN attack 
- Phantom domain attacks

### Windows DNS Events via AMA connector benefits

While some mechanisms were introduced to improve the overall security of this protocol, DNS servers are still a highly targeted service. Organizations can monitor DNS logs to better understand network activity, and to identify suspicious behavior or attacks targeting resources within the network. The Windows DNS Events via AMA connector provides this type of visibility. 

With the connector, you can:  
- Identify clients that try to resolve malicious domain names.
- View and monitor request loads on DNS servers.
- View dynamic DNS registration failures.
- Identify frequently queried domain names and talkative clients. 
- Identify stale resource records. 
- View all DNS related logs in one place. 

Here are some benefits of using AMA for DNS log collection:
- AMA is faster compared to the existing Log Analytics Agent (MMA/OMS). AMA handles up to 5000 events per second (EPS) compared to 2000 EPS with the existing agent. 
- AMA provides centralized configuration using Data Collection Rules (DCRs), and also supports multiple DCRs. 
- AMA supports transformation from the incoming stream into other data tables.
- AMA supports basic and advanced filtering of the data. The data is filtered on the DNS server and before the data is uploaded, which saves time and resources.

### How collection works with the Windows DNS Events via AMA connector

1. The AMA connector uses the installed DNS extension to collect and parse the logs. 

    > [!NOTE]
    > The Windows DNS Events via AMA connector currently supports analytic event activities only.
 
1. The connector streams the events to the Microsoft Sentinel workspace to be further analyzed. 
1. You can now use advanced filters to filter out specific events or information. This allows you to upload only the valuable data to monitor, and reduces costs and bandwidth usage. 

### Normalization using ASIM

This connector is the first fully normalized connector, using [Advanced Security Information Model (ASIM) parsers](normalization.md). The connector streams events originated from the analytical logs into the normalized table named `ASimDnsActivityLogs`. This table acts as a translator, using one unified language, shared across all DNS connectors to come. To use the source-agnostic parsers that unify all parsers and ensure your analysis runs across all configured sources, there are ready made KQL functions.  

The ASIM parser normalizes the native `ASimDnsActivityLogs` table to the ASIM DNS activity normalized schema. While the native table is ASIM compliant, the parser is needed to add capabilities, such as aliases, available only at query time. The views to use are `vimDnsNative` and `ASimDnsNative`. 

The [ASIM DNS schema](dns-normalization-schema.md) represents the DNS protocol activity, as logged in the Windows DNS server in the analytical logs. The schema is governed by official parameter lists and RFCs that define fields and values. 

See the [list of Windows DNS server fields](#asim-normalized-dns-schema) translated into the normalized field names.

## Set up the Windows DNS over AMA connector

You can set up the Windows DNS server in two ways:  
- [Microsoft Sentinel portal](#set-up-the-connector-in-the-microsoft-sentinel-portal-ui). With this setup, you can create, manage, and delete a single DCR per workspace. Even if you define multiple DCRs via the API, the portal shows only a single DCR. 
- [API](#set-up-the-connector-with-the-api). With this setup, you can create, manage, and delete multiple DCRs. 

### Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- Windows Server 2012 R2 with auditing hotfix and later.
- A Windows DNS Server with analytical logs enabled. 
- For on premises Windows DNS servers: Azure Arc, so that the server can be represented as an Azure resource. 

### Set up the connector in the Microsoft Sentinel portal (UI)

#### Open the connector page and create the DCR

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. In the **Data connectors** blade, in the search bar, type *DNS*.
1. Select the **Windows DNS Events via AMA (Preview)** connector.
1. Below the connector description, select **Open connector page**.
1. In the **Configuration** area, select **Create data collection rule**. You can create a single DCR per workspace. If you need to create multiple DCRs, [use the API](#set-up-the-connector-with-the-api).

The DCR name, subscription, and resource group are automatically set based on the workspace name, the current subscription, and the resource group the connector was selected from.

:::image type="content" source="media/connect-dns-ama/Windows-DNS-AMA-connector-create-DCR.png" alt-text="Screenshot of creating a new D C R for the Windows D N S over A M A connector.":::

#### Define resources (VMs)

1. Select the **Resources** tab, and select **Add Resource(s)**. 
1. Select the VMs on which you want to install the connector to collect logs.

    :::image type="content" source="media/connect-dns-ama/Windows-DNS-AMA-connector-select-resource.png" alt-text="Screenshot of selecting resources for the Windows D N S over A M A connector.":::

1. Review your changes, and select **Save** > **Apply**.  

#### Filter out undesired events

While this step is not required, it can help reduce costs and simplify event triage. 

1. On the connector page, in the **Configuration** area, select **Add data collection filters**. 
1. Type a name for the filter and select the filter type. The filter type is a parameter that reduces the number of collected events. The parameters are normalized according to the DNS normalized schema. See the list of available [filters and fields for filtering](#use-advanced-filters).

    :::image type="content" source="media/connect-dns-ama/Windows-DNS-AMA-connector-create-filter.png" alt-text="Screenshot of creating a filter for the Windows D N S over A M A connector.":::

1. To add complex filters, select **Add field to filter** and add the relevant field.

    :::image type="content" source="media/connect-dns-ama/Windows-DNS-AMA-connector-filter-fields.png" alt-text="Screenshot of adding fields to a filter for the Windows D N S over A M A connector.":::

1. To add new filters, select **Add new filters**.  
1. To edit, or delete existing filters or fields, select the edit or delete icons in the table under the **Configuration** area. To add fields or filters, select **Add data collection filters** again.
1. To save and deploy the filters to your connectors, select **Apply changes**.

### Set up the connector with the API

You can create [DCRs](/rest/api/monitor/data-collection-rules) using the API. Use this option if you need to create multiple DCRs. 

Use this example used as a template to create or update a DCR: 

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
                                        "Field": "EventId",
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

To learn more, review the [advanced filter examples](#advanced-filter-examples).

This table shows the available fields. The field names are normalized using the [DNS schema](#asim-normalized-dns-schema).  

|Field name  |Values  |Description  |
|---------|---------|---------|
|EventOriginalType   |Numbers between 256 and 280   |The Windows DNS eventID, which indicates the type of the DNS protocol event.    |
|EventResultDetails   |• NOERROR<br>• FORMERR<br>• SERVFAIL<br>• NXDOMAIN<br>• NOTIMP<br>• REFUSED<br>• YXDOMAIN<br>• YXRRSET<br>• NXRRSET<br>• NOTAUTH<br>• NOTZONE<br>• DSOTYPENI<br>• BADVERS<br>• BADSIG<br>• BADKEY<br>• BADTIME<br>• BADALG<br>• BADTRUNC<br>• BADCOOKIE  |The operation's DNS result string as defined by the Internet Assigned Numbers Authority (IANA).  |
|DvcIpAdrr  |IP addresses    |The IP address of the server reporting the event. This also includes geo-location and malicious IP information.    |
|DnsQuery     |Domain names (FQDN)    |The string representing the domain name to be resolved. Can accept multiple values in a comma-separated list, and wildcards. For example:<br>`*.microsoft.com,google.com,facebook.com` |
|DnsQueryTypeName      |• A<br>• NS<br>• MD<br>• MF<br>• CNAME<br>• SOA<br>• MB<br>• MG<br>• MR<br>• NULL<br>• WKS<br>• PTR<br>• HINFO<br>• MINFO<br>• MX<br>• TXT<br>• RP<br>• AFSDB<br>• X25<br>• ISDN<br>• RT<br>• NSAP<br>• NSAP-PTR<br>• SIG<br>• KEY<br>• PX<br>• GPOS<br>• AAAA<br>• LOC<br>• NXT<br>• EID<br>• NIMLOC<br>• SRV         |The requested DNS attribute. The DNS resource record type name as defined by IANA.  |

### Advanced filter examples

#### Do not collect specific event IDs

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

#### Do not collect events with specific domains
 
This filter instructs the connector not to collect events with the domains microsoft.com or google.com or facebook.com or amazon.com or center.local: 

**Using the Microsoft Sentinel portal**:

Set the **DnsQuery** field using the **Equals** operator, with the list **microsoft.com, google.com, facebook.com, amazon.com, center.local**.

:::image type="content" source="media/connect-dns-ama/windows-dns-ama-connector-domain-filter.png" alt-text="Screenshot of filtering out domains for the Windows D N S over A M A connector."::: 

To define different values in a single field, use the **OR** operator.

**Using the API**:

```rest
"Filters": [ 

    { 

        "FilterName": "SampleFilter", 

        "Rules": [ 

            { 

                "Field": "DnsQuery", 

                "FieldValues": [ 

                    "Microsoft.com", "google.com", "facebook.com", "amazon.com","center.local"                                                                               

                ] 

            }, 

         } 

    } 

] 
```

## ASIM normalized DNS schema

This table describes and translates Windows DNS server fields into the normalized field names as they appear in the [DNS normalization schema](dns-normalization-schema.md#schema-details.md).

|Windows DNS field name  |Normalized field name  |Type  |Description |
|---------|---------|---------|---------|
|EventID     |EventOriginalType          |String         |The original event type or ID. |
|RCODE     |EventResult          |String         |The outcome of the event (success, partial, failure, NA). |
|RCODE parsed     |EventResultDetails          |String         |The DNS response code as defined by IANA.  |
|InterfaceIP      |DvcIpAdrr          |String         |The IP address of the event reporting device or interface. |
|AA     |DnsFlagsAuthoritative         |Integer         |Indicates whether the response from the server was authoritative. |
|AD    |DnsFlagsAuthenticated          |Integer         |Indicates that the server verified all of the data in the answer and the authority of the response, according to the server policies. |
|RQNAME      |DnsQuery          |String         |The domain needs to be resolved. |
|QTYPE     |DnsQueryType         |Integer         |The DNS resource record type as defined by IANA. |
|Port     |SrcPortNumber         |Integer         |Source port sending the query. |
|Source      |SrcIpAddr         |IP address          |The IP address of the client sending the DNS request. For a recursive DNS request, this value is typically the reporting device's IP, in most cases, `127.0.0.1`. |
|ElapsedTime |DnsNetworkDuration |Integer |The time it took to complete the DNS request. |
|GUID |DnsSessionId |String |The DNS session identifier as reported by the reporting device. | 

## Next steps
In this article, you learned how to set up the Windows DNS events via AMA connector to upload data and filter your Windows DNS logs. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.