---
title: Monitor Azure Private 5G Core Preview with Log Analytics
description: Information on using Log Analytics to monitor and analyze activity in your private mobile network. 
author: djrmetaswitch
ms.author: drichards
ms.service: private-5g-core
ms.topic: conceptual 
ms.date: 03/08/2022
ms.custom: template-concept
---

# Monitor Azure Private 5G Core Preview with Log Analytics

Log Analytics is a tool in the Azure portal used to edit and run log queries with data in Azure Monitor Logs. You can write queries to retrieve records or visualize data in charts, allowing you to monitor and analyze activity in your private mobile network.

> [!IMPORTANT] 
> Log Analytics currently can only be used to monitor private mobile networks that support 5G UEs. You can still monitor private mobile networks supporting 4G UEs from the local network using the [packet core dashboards](packet-core-dashboards.md). 

## Enable Log Analytics

You'll need to carry out the steps in [Enabling Log Analytics for Azure Private 5G Core](enable-log-analytics-for-private-5g-core.md) before you can use Log Analytics with Azure Private 5G Core.

> [!IMPORTANT] 
> Log Analytics is part of Azure Monitor and is chargeable. [Estimate costs](#estimate-costs) provides information on estimating the cost of using Log Analytics to monitor your private mobile network. You shouldn't enable Log Analytics if you don't want to incur any costs. If you don't enable Log Analytics, you can still monitor your packet core instances from the local network using the [packet core dashboards](packet-core-dashboards.md). 

## Access Log Analytics for a packet core instance

Once you've enabled Log Analytics, you can begin working with it in the Azure portal. Navigate to the Log Analytics workspace you assigned to the Kubernetes cluster on which a packet core instance is running. Select **Logs** from the left hand menu.

:::image type="content" source="media/log-analytics-workspace.png" alt-text="Screenshot of the Azure portal showing a Log Analytics workspace. The Logs option is highlighted.":::

You'll then be shown the Log Analytics tool where you can enter your queries.

:::image type="content" source="media/azure-private-5g-core/log-analytics-tool.png" alt-text="Screenshot of the Azure portal showing the Log Analytics tool." lightbox="media/azure-private-5g-core/log-analytics-tool.png":::

For detailed information on using the Log Analytics tool, see [Overview of Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md).

## Construct queries

You can find a tutorial for writing queries using the Log Analytics tool at [Get started with log queries in Azure Monitor](../azure-monitor/logs/get-started-queries.md). Each packet core instance streams the following logs to the Log Analytics tool. You can use these logs to construct queries that will allow you to monitor your private mobile network. You'll need to run all queries at the scope of the **Kubernetes - Azure Arc** resource that represents the Kubernetes cluster on which your packet core instance is running.

| Log name | Description |
|--|--|
| subscribers_count | Number of successfully provisioned SIMs. |
| amf_registered_subscribers | Number of currently registered SIMs. |
| amf_connected_gnb | Number of gNodeBs that are currently connected to the Access and Mobility Management Function (AMF). |
| subgraph_counts | Number of active PDU sessions being handled by the User Plane Function (UPF). |
| cppe_bytes_total | Total number of bytes received or transmitted by the UPF at each interface since the UPF last restarted. The value is given as a 64-bit unsigned integer. |
| amfcc_mm_initial_registration_failure | Total number of failed initial registration attempts handled by the AMF. |
| amfcc_n1_auth_failure | Counter of Authentication Failure Non-Access Stratum (NAS) messages. The Authentication Failure NAS message is sent by the user equipment (UE) to the AMF to indicate that authentication of the network has failed. |
| amfcc_n1_auth_reject | Counter of Authentication Reject NAS messages. The Authentication Reject NAS message is sent by the AMF to the UE to indicate that the authentication procedure has failed and that the UE shall abort all activities. |
| amfn2_n2_pdu_session_resource_setup​_request | Total number of PDU SESSION RESOURCE SETUP REQUEST Next Generation Application Protocol (NGAP) messages received by the AMF. |
| amfn2_n2_pdu_session_resource_setup​_response | Total number of PDU SESSION RESOURCE SETUP RESPONSE NGAP messages received by the AMF. |
| amfn2_n2_pdu_session_resource_modify​_request | Total number of PDU SESSION RESOURCE MODIFY REQUEST NGAP messages received by the AMF. |
| amfn2_n2_pdu_session_resource_modify​_response | Total number of PDU SESSION RESOURCE MODIFY RESPONSE NGAP messages received by the AMF. |
| amfn2_n2_pdu_session_resource_release​_command | Total number of PDU SESSION RESOURCE RELEASE COMMAND NGAP messages received by the AMF. |
| amfn2_n2_pdu_session_resource_release​_response | Total number of PDU SESSION RESOURCE RELEASE RESPONSE NGAP messages received by the AMF. |
| amfcc_n1_service_reject | Total number of Service reject NAS messages received by the AMF. |
| amfn2_n2_pathswitch_request_failure | Total number of PATH SWITCH REQUEST FAILURE NGAP messages received by the AMF. |
| amfn2_n2_handover_failure | Total number of HANDOVER FAILURE NGAP messages received by the AMF. |
 

## Example queries

The following are some example queries you can run to retrieve logs relating to Key Performance Indicators (KPIs) for your private mobile network. You should run all of these queries at the scope of the **Kubernetes - Azure Arc** resource that represents the Kubernetes cluster on which your packet core instance is running.

### PDU sessions

```Kusto
InsightsMetrics
    | where Namespace == "prometheus" 
    | where Name == "subgraph_counts"
    | summarize PduSessions=max(Val) by Time=TimeGenerated   
```

### Registered UEs

```Kusto
let Time = InsightsMetrics
    | where Namespace == "prometheus"
    | summarize by Time=TimeGenerated;
let RegisteredDevices = InsightsMetrics
    | where Namespace == "prometheus" 
    | where Name == "amf_registered_subscribers"
    | summarize by RegisteredDevices=Val, Time=TimeGenerated;
Time
    | join kind=leftouter (RegisteredDevices) on Time
    | project Time, RegisteredDevices
```

### Connected gNodeBs

```kusto
InsightsMetrics
    | where Namespace == "prometheus"
    | where Name == "amf_connected_gnb"
    | extend Time=TimeGenerated
    | extend GnBs=Val
    | project GnBs, Time
```

## Log Analytics dashboards

Log Analytics dashboards can visualize all of your saved log queries, giving you the ability to find, correlate, and share data about your private mobile network.

You can find information on how to create a Log Analytics dashboard in [Create and share dashboards of Log Analytics data](../azure-monitor/visualize/tutorial-logs-dashboards.md).

You can also follow the steps in [Create an overview Log Analytics dashboard using an ARM template](create-overview-dashboard.md) to create an example overview dashboard. This dashboard includes charts to monitor important Key Performance Indicators (KPIs) for your private mobile network's operation, including throughput and the number of connected devices.

## Estimate costs

Log Analytics will ingest an average of 1.4 GB of data a day from each packet core instance. [Monitor usage and estimated costs in Azure Monitor](../azure-monitor/usage-estimated-costs.md) provides information on how to estimate the cost of using Log Analytics to monitor Azure Private 5G Core.

## Next steps
- [Enable Log Analytics for Azure Private 5G Core](enable-log-analytics-for-private-5g-core.md)
- [Create an overview Log Analytics dashboard using an ARM template](create-overview-dashboard.md)
- [Learn more about Log Analytics in Azure Monitor](../azure-monitor/logs/log-analytics-overview.md)
