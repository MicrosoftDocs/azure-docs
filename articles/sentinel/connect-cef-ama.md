---
title: Stream CEF logs with the AMA connector 
description: TBD
author: limwainstein
ms.topic: how-to
ms.date: 19/09/2022
ms.author: lwainstein
#Customer intent: As a security operator, I want to stream logs in the CEF format over Syslog, so I can load the data from multiple devices and analyze the normalized data.
---

# Stream CEF logs with the AMA connector

This article describes how to use the Azure Monitor Agent (AMA) connector to stream and filter events from logs that use the Common Event Format (CEF) over Syslog. You can then deeply analyze your data to better protect CEF based logs.

The AMA is installed on a Linux machine, which enables the organization to collect logs in the CEF format, and to forward the logs to Microsoft Sentinel workspaces. [Learn more about the connector](#windows-cef-via-ama-connector).

> [!IMPORTANT]
> The CEF via AMA connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

## Overview 

### What is CEF collection?

Many network, security appliances, and devices send their logs in the Common Event Format (CEF) over Syslog. This format includes more structured information than the Syslog format, with information presented in a parsed key- value arrangement.

If your appliance or system enables you to send logs over Syslog using the Common Event Format (CEF), the integration with Azure Sentinel enables you to easily run analytics, and queries across the data. This makes Syslog or CEF the most straight forward ways to stream security and networking events to Azure Sentinel. 

The advantage of CEF over Syslog is that it ensures the data is normalized making it more immediately useful for analysis using Sentinel. However, unlike many other SIEM products, Sentinel allows ingesting unparsed Syslog events and performing analytics on them using query time parsing. 

### CEF via AMA connector

AMA allows a centralized configuration management through a Data Collection Rules (DCR) in the cloud, stability, and high EPS rates.

With the **CEF via AMA** connector, you can:

- Use any on premises security appliance supporting CEF over Syslog can install the Azure Monitor Agent (AMA) on a cloud-based Linux collector machine (VM) to forward their data to their Microsoft Sentinel workspace.
- Stream events from any on-premises appliance to an on-premises Linux collector machine with AMA installed on to forward data to their Microsoft Sentinel workspace.

### How collection works with the Windows DNS Events via AMA connector

1. The organization sets up a log forwarder.
1. Run the CEF installation script.
1. Forward CEF logs from your source devices.
1. The AMA connector installed on the log forwarder (Linux VM) collects and parse the logs. 
1. The connector streams the events to the Microsoft Sentinel workspace to be further analyzed. 

### Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- A Linux machine to collect logs.
    - Python 2.7 or 3 installed on the Linux machine. Use the ``python --version`` or ``python3 --version`` command to check.
- Either the syslog or rsyslog service enabled.
- To collect events from any system that isn't an Azure virtual machine, ensure that [Azure Arc](../azure-monitor/agents/azure-monitor-agent-manage.md) is installed. Install and enable Azure Arc before you enable the Azure Monitor Agent-based connector. This requirement includes:
    - Windows servers installed on physical machines
    - Windows servers installed on on-premises virtual machines
    - Windows servers installed on virtual machines in non-Azure clouds 

## Set up the CEF over AMA connector

### Configure a log forwarder

To ingest Syslog and CEF logs into Microsoft Sentinel, particularly from devices and appliances onto which you can't install the Log Analytics agent directly, you'll need to designate and configure a Linux machine that will collect the logs from your devices and forward them to your Microsoft Sentinel workspace. This machine can be a physical or virtual machine in your on-premises environment, an Azure VM, or a VM in another cloud.

This machine has two components that take part in this process:

- A syslog daemon, either rsyslog or syslog-ng, that collects the logs.
- The Log Analytics Agent (also known as the OMS Agent), that forwards the logs to Microsoft Sentinel. [replace]

Using the link provided below [link?], you will run a script on the designated machine that performs the following tasks:

Installs the Log Analytics agent for Linux (also known as the OMS agent) and configures it for the following purposes: [update]

- listening for CEF messages from the built-in Linux Syslog daemon on TCP port 25226
- sending the messages securely over TLS to your Microsoft Sentinel workspace, where they are parsed and enriched

Configures the built-in Linux Syslog daemon (rsyslog.d/syslog-ng) for the following purposes:

- listening for Syslog messages from your security solutions on TCP port 514
- forwarding only the messages it identifies as CEF to the Log Analytics agent on localhost using TCP port 25226 [replace]

#### Log forwarder - security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. You can use the following instructions to improve your machine security configuration:  Secure VM in Azure, Best practices for Network security.

If your devices are sending Syslog and CEF logs over TLS (because, for example, your log forwarder is in the cloud), you will need to configure the Syslog daemon (rsyslog or syslog-ng) to communicate in TLS. See the following documentation for details:

[Encrypting Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
[Encrypting log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

### Set up the connector

You can set up the connector in two ways:  
- [Microsoft Sentinel portal](#set-up-the-connector-in-the-microsoft-sentinel-portal-ui). With this setup, you can create, manage, and delete DCRs per workspace.  
- [API](#set-up-the-connector-with-the-api). With this setup, you can create, manage, and delete DCRs. This option is slightly more flexible than the UI. For example, with the API you can configure specific log levels, where the UI allows you to select only one log level and the levels under it.

#### Set up the connector in the Microsoft Sentinel portal (UI)

[TBD Review existing content to see that I didn't miss anything]

##### Open the connector page and create the DCR

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. In the **Data connectors** blade, in the search bar, type *CEF*.
1. Select the **CEF over AMA (Preview)** connector.
1. Below the connector description, select **Open connector page**.
1. In the **Configuration** area, select **Add data collection rule**. 

The DCR name, subscription, and resource group are automatically set based on the workspace name, the current subscription, and the resource group the connector was selected from.

[SCREENSHOT TBD]

##### Define resources (VMs)

1. Select the **Resources** tab and select **Add Resource(s)**. 
1. Select the VMs on which you want to install the connector to collect logs.

   [SCREENSHOT TBD]

1. Review your changes and select **Collect**. 

#### Select the data source type and create the DCR

1. Select the **Collect** tab and select **Linux syslog** as the data source type. 
1. Configure the log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with lower severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_WARNING**, **LOG_NOTICE**, **LOG_INFO**, and **LOG_DEBUG** levels.

   [SCREENSHOT TBD]

1. Review your changes and select **Next: Review and create**. 
1. In the **Review and create** tab, select **Create**.

##### Run the installation script

1.	Log in your designated collector Linux machine, where you want the AMA to be installed.
1.	Edit the DCR stream (as seen below in the API section)
1.	Run the following command to launch the installation script:
 
sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure- Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py

The installation script will configure the rsyslog/syslog daemon to use the required protocol and will restart the daemon.

NOTE that it is highly recommended to set the syslog/rsyslog configuration not to store unnecessary logs to avoid full disk scenarios, in which the agent is unable to function properly.

[TBD I was here]

### Set up the connector with the API

You can create [DCRs](/rest/api/monitor/data-collection-rules) using the API. Use this option if you need to create multiple DCRs. 

Use this example as a template to create or update a DCR: 

#### Request URL and header  

```rest

GET
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Mic rosoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview
```
 
#### Request body

Edit the template with the desired attributes. 
- Verify the `streams` field is set to `Microsoft-CommonSecurityLog`.
- Add the filter and facility log levels in the `facilityNames` and `logLevels` parameters.

```rest
{
    "properties": {
        "immutableId": "dcr-bcc4039c90f0489b80927bbdf1f26008", 
        "dataSources": {
            "syslog": [
                {
                    "streams": [
                        "Microsoft-CommonSecurityLog"
                    ],
                    "facilityNames": [
                        "*"
                    ],
                    "logLevels": [ "*"
                    ],
                    "name": "sysLogsDataSource-1688419672"
                }
            ]
        },
        "destinations": { 
            "logAnalytics": [
            "logLevels": [ 
                "Warning", 
                "Error", 
                "Critical", 
                "Alert", 
                "Emergency"
            ],
            "name": "sysLogsDataSource-1688419672"
            }
        ]
    },
    "destinations": { 
        "logAnalytics": [ 
            {
                "workspaceResourceId": "/subscriptions/{Your-Subscription-
Id}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{SentinelWorkspaceName}", "workspaceId": "f746b3d7-5b3b-485e-b268-88bc2ca88bad",
"name": "la-140366483"
            }
        ]
    },
    "dataFlows": [
            {
                "streams": [
                    "Microsoft-CommonSecurityLog"
                ],
                "destinations": [ 
                "la-140366483"
                ]
            }
        ],
        "provisioningState": "Succeeded"
    },
    "location": "westeurope", 
    "tags": {},
    "kind": "Linux",
    "id": "/subscriptions/{Your-Subscription- Id}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{DCRName}",
    "name": "{DCRName}",
    "type": "Microsoft.Insights/dataCollectionRules", 
    "etag": "\"2401b6f3-0000-0d00-0000-618bbf430000\""
}
```
Once you are done editing post/put it to deploy it:

```rest
PUT
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Mic rosoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview
```

Learn more about [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md).

#### Examples of facilities and log levels sections

This example collects events from the `cron`, `daemon`, `local0`, `local3` and `uucp` facilities, with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels:

```rest
    "syslog": [
    {
            "streams": [
                "Microsoft-CommonSecurityLog"
        ],
        "facilityNames": [ 
            "cron",
            "daemon",
            "local0",
            "local3", 
            "uucp"
        ],
 
        "logLevels": [ 
            "Warning", 
            "Error", 
            "Critical", 
            "Alert", 
            "Emergency"
        ],
        "name": "sysLogsDataSource-1688419672"
    }
]
```

This example collects events for:
- The `authpriv` and `mark` facilities at the `Info`, `Notice`, `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `daemon` facility with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `kern`, `local0`, `local5`, and `news` facilities with the `Critical`, `Alert`, and `Emergency` log levels 
- The `mail` and `uucp` facilities with the `Emergency` log level

The `name` field includes the filter name.

```rest
        "syslog": [
            {
                "streams": [ 
                    "Microsoft-Syslog"
            ],
                "facilityNames": [ 
                    "authpriv", 
                    "mark"
            ],
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
                "streams": [ "Microsoft-Syslog"
            ],
                "facilityNames": [ 
                    "daemon"
            ],
                "logLevels": [ 
                    "Warning", 
                    "Error", 
                    "Critical", 
                    "Alert", 
                    "Emergency"
            ],
     
                "name": "sysLogsDataSource--1343576735"
        },
        {
                "streams": [ 
                    "Microsoft-Syslog"
            ],
                "facilityNames": [ 
                    "kern",
                    "local0",
                    "local5", 
                    "news"
            ],
                "logLevels": [ 
                    "Critical", 
                    "Alert", 
                    "Emergency"
            ],
                "name": "sysLogsDataSource--1469572587"
        },
        {
                "streams": [ 
                    "Microsoft-Syslog"
            ],
                "facilityNames": [ 
                    "mail",
                    "uucp"
            ],
                "logLevels": [ 
                    "Emergency"
            ],
                "name": "sysLogsDataSource-1689584311"
        }
    ]
}
```
### Test the connector

To validate the rsyslog service is listening on the UDP port and the AMA is listening, run the following command:
netstat -lnptv
You should be able to see rsyslog/syslog daemon listening on port 514, and the AMA on port 28130 listed under mdsd (azuremonitoringagnet).

To capture messages coming in from a logger or a connected device use the
tcpdump -I any port 514 -A vv &

After the validation phase has completed, it is recommended to stop the tcpdump by using fg and then Ctrl+C.
 
You can send demo messages using the logger, here is a sample command:
logger -p local4.warn -P 514 -n 127.0.0.1 --rfc3164 -t CEF "0|Mock-test|MOCK|common=event-format- test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time"

Write the message to facility local 4, at severity level warning, to port 514 on the local host in the format of CEF RFC.

## Next steps
In this article, you learned how to set up the Windows DNS events via AMA connector to upload data and filter your Windows DNS logs. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.