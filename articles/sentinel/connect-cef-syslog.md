---
title: Stream logs in both the CEF and Syslog format to Microsoft Sentinel 
description: Stream and filter logs in both the CEF and Syslog format to your Microsoft Sentinel workspace.
author: limwainstein
ms.topic: how-to
ms.date: 02/09/2023
ms.author: lwainstein
#Customer intent: As a security operator, I want to stream and filter CEF an Syslog-based logs from my organization to my Microsoft Sentinel workspace, so I can avoid duplication between CEF and Syslog data.   
---

# Stream logs in both the CEF and Syslog format

This article describes how to stream and filter logs in both the CEF and Syslog format to your Microsoft Sentinel workspace from multiple appliances. This article is useful in the following scenario:

- You're using a Linux log collector to forward both Syslog and CEF events to your Microsoft Sentinel workspaces using the Azure Monitor Agent (AMA). 
- You want to ingest Syslog events in the Syslog table and CEF events in the CommonSecurityLog table.

During this process, you use the AMA and Data Collection Rules (DCRs). With DCRs, you can filter the logs before they're ingested, for quicker upload, efficient analysis, and querying. 

Learn how to [collect Syslog with the Azure Monitor Agent](../azure-monitor/agents/data-collection-syslog.md), including how to configure Syslog and create a DCR.

> [!IMPORTANT]
>
> On **February 28th 2023**, we introduced changes to the CommonSecurityLog table schema. Following this change, you might need to review and update custom queries. For more details, see the [recommended actions section](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/upcoming-changes-to-the-commonsecuritylog-table/ba-p/3643232) in this blog post. Out-of-the-box content (detections, hunting queries, workbooks, parsers, etc.) has been updated by Microsoft Sentinel.   

Read more about [CEF](connect-cef-ama.md#what-is-cef-collection) and [Syslog](connect-syslog.md#architecture) collection in Microsoft Sentinel. 

## Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- A Linux machine to collect logs.
    - The Linux machine must have Python 2.7 or 3 installed on the Linux machine. Use the ``python --version`` or ``python3 --version`` command to check.
    - For space requirements for your log forwarder, see the [Azure Monitor Agent Performance Benchmark](../azure-monitor/agents/azure-monitor-agent-performance.md). You can also review this blog post, which includes [designs for scalable ingestion](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/designs-for-accomplishing-microsoft-sentinel-scalable-ingestion/ba-p/3741516).
- Either the `syslog-ng` or `rsyslog` daemon enabled.
- To collect events from any system that isn't an Azure virtual machine, ensure that [Azure Arc](../azure-monitor/agents/azure-monitor-agent-manage.md) is installed.
- To ingest Syslog and CEF logs into Microsoft Sentinel, you can designate and configure a Linux machine that collects the logs from your devices and forwards them to your Microsoft Sentinel workspace. [Configure a log forwarder](connect-cef-ama.md#configure-a-log-forwarder).

## Avoid data ingestion duplication

Using the same facility for both Syslog and CEF messages may result in data ingestion duplication between the CommonSecurityLog and Syslog tables. 

To avoid this scenario, use one of these methods:

- **If the source device enables configuration of the target facility**: On each source machine that sends logs to the log forwarder in CEF format, edit the Syslog configuration file to remove the facilities used to send CEF messages. This way, the facilities sent in CEF won't also be sent in Syslog. Make sure that each DCR you configure in the next steps uses the relevant facility for CEF or Syslog respectively.
- **If changing the facility for the source appliance isn't applicable**: Use an ingest time transformation to filter out CEF messages from the Syslog stream to avoid duplication. The data will be sent twice from the collector machine to the workspace:

    ```kusto
    source |
    where ProcessName !contains \"CEF\"
    ```
## Create a DCR for your CEF logs

- Create the DCR via the UI:
    1. [Open the connector page and create the DCR](connect-cef-ama.md#open-the-connector-page-and-create-the-dcr).
    1. [Define resources (VMs)](connect-cef-ama.md#define-resources-vms).
    1. [Select the data source type and create the DCR](connect-cef-ama.md#select-the-data-source-type-and-create-the-dcr).

        > [!IMPORTANT]
        > Make sure to **[avoid data ingestion duplication](#avoid-data-ingestion-duplication)** (review the options in this section).

    1. [Run the installation script](connect-cef-ama.md).

- Create the DCR via the API:
    1. [Create the request URL and header](connect-cef-ama.md#request-url-and-header). 
    1. [Create the request body](connect-cef-ama.md#request-body).

    See [examples of facilities and log levels sections](connect-cef-ama.md#examples-of-facilities-and-log-levels-sections).

## Create a DCR for your Syslog logs

Create the DCR for your Syslog-based logs using the Azure Monitor [guidelines](../azure-monitor/essentials/data-collection-rule-overview.md) and [structure](../azure-monitor/essentials/data-collection-rule-structure.md). Review the [best practices](../azure-monitor/essentials/data-collection-rule-best-practices.md) if needed.

## Create a DCR for both Syslog and CEF logs

1. Run this command to launch the installation script:
 
    ```python
    sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python3 Forwarder_AMA_installer.py 
    ```
    The installation script configures the `rsyslog` or `syslog-ng` daemon to use the required protocol and restarts the daemon. The script opens port 514 to listen to incoming messages in both UDP and TCP protocols. To change this setting, refer to the     
    Syslog daemon configuration file according to the daemon type running on the machine:
        - Rsyslog: `/etc/rsyslog.conf`
        - Syslog-ng: `/etc/syslog-ng/syslog-ng.conf`

1. Create the request URL and header:  

    ```rest
    GET
    https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview
    ```

1. Create the request body:
    - Verify that the `streams` field is set to `Microsoft-CommonSecurityLog` and `Microsoft-Syslog` for the CEF/Syslog facility respectively.
    - Add the filter and facility log levels in the `facilityNames` and `logLevels` parameters.

    ```rest
        {
        "properties": {
          "immutableId": "dcr-c7847b758fb0484b88b51c5d907796a6",
          "dataSources": {
            "syslog": [
              {
                "streams": ["Microsoft-Syslog"],
                "facilityNames": ["auth"],
                "logLevels": [
                  "Info",
                  "Notice",
                  "Warning",
                  "Error",
                  "Critical",
                  "Alert",
                  "Emergency"
                ],
                "name": "sysLogsDataSource--1469397783"
              },
              {
                "streams": ["Microsoft-CommonSecurityLog"],
                "facilityNames": [
                  "local4"
                ],
                "logLevels": [
                  "Warning"
                ],
                "name": "sysLogsDataSource-1688419672"
              }
            ]
          },
          "destinations": {
            "logAnalytics": [
              {
                "workspaceResourceId": "/subscriptions/<sub-id>/resourceGroups/<resourceGroup>/providers/Microsoft.OperationalInsights/workspaces/<WS>",
                "workspaceId": "<WS-ID>",
                "name": "la--591870646"
              }
            ]
          },
          "dataFlows": [
            { "streams": ["Microsoft-Syslog", "Microsoft-CommonSecurityLog"], "destinations": ["la--591870646"] }
          ],
          "provisioningState": "Succeeded"
        },
        "location": "eastus",
        "tags": {},
        "kind": "Linux",
        "id": "/subscriptions/<sub-id>/resourceGroups/<resourceGroup>/providers/Microsoft.Insights/dataCollectionRules/<DCR-Name>",
        "name": "<DCR-Name>",
        "type": "Microsoft.Insights/dataCollectionRules",
        "etag": "\"6d00bdde-0000-0100-0000-62c177f70000\"",
        "systemData": {
          "createdBy": someuser@microsoft.com,
          "createdByType": "User",
          "createdAt": "2022-07-03T11:05:27.2454015Z",
          "lastModifiedBy": someuser@microsoft.com,
          "lastModifiedByType": "User",
          "lastModifiedAt": "2022-07-03T11:05:27.2454015Z"
        }
      }    
    ```
1. After you finish editing the template, use `POST` or `PUT` to deploy it:

    ```rest
        PUT
        https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview        
    ```

See [examples of facilities and log levels sections](connect-cef-ama.md#examples-of-facilities-and-log-levels-sections).

## Next steps

In this article, you learned how to stream and filter logs in both the CEF and Syslog format to your Microsoft Sentinel workspace. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
