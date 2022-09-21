---
title: Stream CEF logs with the AMA connector 
description: Stream and filter CEF-based logs from on-premises appliances to your Microsoft Sentinel workspace.
author: limwainstein
ms.topic: how-to
ms.date: 09/19/2022
ms.author: lwainstein
#Customer intent: As a security operator, I want to stream and filter CEF-based logs from on-premises appliances to my Microsoft Sentinel workspace, so I can improve load time and easily analyze the data.   
---

# Stream CEF logs with the AMA connector

This article describes how to use the **CEF via AMA connector** to quickly filter and upload logs in the Common Event Format (CEF) from multiple on-premises appliances over Syslog. 

The Azure Monitor Agent (AMA) supports Data Collection Rules (DCRs) in the cloud. With DCRs, you can filter the logs before upload, for quicker upload times, efficient analysis and querying.

The AMA is installed on a Linux machine that acts as a log forwarder, and the AMA collects the logs in the CEF format. [Learn more about the connector](#how-collection-works-with-the-windows-dns-events-via-ama-connector).

> [!IMPORTANT]
> The CEF via AMA connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.   

## Overview 

### What is CEF collection?

Many network, security appliances, and devices send their logs in the CEF format over Syslog. This format includes more structured information than Syslog, with information presented in a parsed key-value arrangement.

If your appliance or system sends logs over Syslog using CEF, the integration with Microsoft Sentinel allows you to easily run analytics and queries across the data. This makes Syslog or CEF the most straightforward ways to stream security and networking events to Microsoft Sentinel. 

CEF over Syslog normalizes the data, making it more immediately useful for analysis with Microsoft Sentinel. Microsoft Sentinel also allows you to ingest unparsed Syslog events, and to analyze them with query time parsing. 

### How collection works with the Windows DNS Events via AMA connector

1. Your organization sets up a log forwarder (Linux VM), if one doesn't already exist. The forwarder can be on-premises or cloud-based.
1. Your organization forwards CEF logs from your source devices to the forwarder.
1. The AMA connector installed on the log forwarder collects and parses the logs. 
1. The connector streams the events to the Microsoft Sentinel workspace to be further analyzed. 

### Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- A Linux machine to collect logs.
    - The Linux machine must have Python 2.7 or 3 installed on the Linux machine. Use the ``python --version`` or ``python3 --version`` command to check.
- Either the `syslog` or `rsyslog` service enabled.
- To collect events from any system that isn't an Azure virtual machine, ensure that [Azure Arc](../azure-monitor/agents/azure-monitor-agent-manage.md) is installed. Install and enable Azure Arc before you enable the Azure Monitor Agent-based connector. This requirement includes:
    - Windows servers installed on physical machines
    - Windows servers installed on on-premises virtual machines
    - Windows servers installed on virtual machines in non-Azure clouds 

## Set up the CEF over AMA connector

### Configure a log forwarder

To ingest Syslog and CEF logs into Microsoft Sentinel, particularly from devices and appliances onto which you can't install the AMA directly, you need to designate and configure a Linux machine that collects the logs from your devices and forwards them to your Microsoft Sentinel workspace. This machine can be a physical or virtual machine in your on-premises environment, an Azure VM, or a VM in another cloud.

This machine has two components that take part in this process:

- A Syslog daemon, either `rsyslog` or `syslog-ng`, which collects the logs.
- The AMA, which forwards the logs to Microsoft Sentinel.

When you set up the connector and the DCR, you [run a script](#run-the-installation-script) on the Linux machine, which performs the following tasks:

- Installs the AMA and configures it to: 
    - listen for CEF messages from the built-in Linux Syslog daemon on TCP port 25226
    - send the messages securely over TLS to your Microsoft Sentinel workspace, where they are parsed and enriched
- Configures the built-in Linux Syslog daemon (`rsyslog.d`/`syslog-ng`) to: 
    - listen for Syslog messages from your security solutions on TCP port 514
    - forward only the messages it identifies as CEF to the Log Analytics agent on localhost using Unix domain socket (UDS) port [TBD - is this relevant or should we remove altogether?]

#### Log forwarder - security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. To improve your machine security configuration, [secure your VM in Azure](../virtual-machines/security-policy.md), or review these [best practices for network security](../security/fundamentals/network-best-practices.md).

If your devices are sending Syslog and CEF logs over TLS (because, for example, your log forwarder is in the cloud), you need to configure the Syslog daemon (`rsyslog` or `syslog-ng`) to communicate in TLS:

- [Encrypt Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypt log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

### Set up the connector

You can set up the connector in two ways:  
- [Microsoft Sentinel portal](#set-up-the-connector-in-the-microsoft-sentinel-portal-ui). With this setup, you can create, manage, and delete DCRs per workspace.  
- [API](#set-up-the-connector-with-the-api). With this setup, you can create, manage, and delete DCRs. This option is slightly more flexible than the UI. For example, with the API you can configure specific log levels, where the UI allows you to select only one log level and the levels under it.

#### Set up the connector in the Microsoft Sentinel portal (UI)

1. [Open the connector page and create the DCR](#open-the-connector-page-and-create-the-dcr)
1. [Define resources (VMs)](#define-resources-vms)
1. [Select the data source type and create the DCR](#select-the-data-source-type-and-create-the-dcr)
1. [Run the installation script](#run-the-installation-script)

##### Open the connector page and create the DCR

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. In the **Data connectors** blade, in the search bar, type *CEF*.
1. Select the **CEF over AMA (Preview)** connector.
1. Below the connector description, select **Open connector page**.
1. In the **Configuration** area, select **Add data collection rule**. 

The DCR name, subscription, and resource group are automatically set based on the workspace name, the current subscription, and the resource group the connector was selected from.

[SCREENSHOT TBD]

##### Define resources (VMs)

Select the machines on which you want to install the AMA. These are VMs or on-premises Linux machines with Arc installed.

1. Select the **Resources** tab and select **Add Resource(s)**. 
1. Select the VMs on which you want to install the connector to collect logs.

   [SCREENSHOT TBD]

1. Review your changes and select **Collect**. 

#### Select the data source type and create the DCR

> [!NOTE]
> Select at least one facility and a minimum log level for the facility. You edit this list at a later stage to align with CEF, after you have the DCR template.

1. Select the **Collect** tab and select **Linux syslog** as the data source type.
1. Configure the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with lower severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_WARNING**, **LOG_NOTICE**, **LOG_INFO**, and **LOG_DEBUG** levels.

   [SCREENSHOT TBD]

1. Review your changes and select **Next: Review and create**. 
1. In the **Review and create** tab, select **Create**.

##### Run the installation script

1.	Log in to the Linux forwarder machine, where you want the AMA to be installed.
1.	[Edit the DCR stream](#request-body)
1.	Run this command to launch the installation script:
 
```python
sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure- Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py
```
The installation script configures the `rsyslog` or `syslog` daemon to use the required protocol and restarts the daemon.

> [!NOTE] 
> To avoid full disk scenarios where the agent can't function, we recommend to set the `syslog` or `rsyslog` configuration not to store unneeded logs.

### Set up the connector with the API

You can [create DCRs using the API](/rest/api/monitor/data-collection-rules). Learn more about [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md).  

#### Request URL and header  

```rest
GET
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview
```
 
#### Request body

Edit the template: 
- Verify that the `streams` field is set to `Microsoft-CommonSecurityLog`.
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
After you finish editing the template, use `POST` or `PUT` to deploy it:

```rest
PUT
https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Insights/dataCollectionRules/{dataCollectionRuleName}?api-version=2019-11-01-preview
```
#### Examples of facilities and log levels sections

Review these examples of the facilities and log levels settings. The `name` field includes the filter name.

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

1. To validate that the `rsyslog` service is listening on the UDP port and that the AMA is listening, run this command:

    ```
    netstat -lnptv
    ```

    You should see the `rsyslog` or `syslog` daemon listening on port 514, and the AMA listening on port 28130 listed under `mdsd` (`azuremonitoringagnet`).
1. To capture messages sent from a logger or a connected device, run this command:

    ```
    tcpdump -I any port 514 -A vv &
    ```
1. After you complete the validation, we recommend that you stop the `tcpdump`: Type `fg` and then select <kbd>Ctrl</kbd>+<kbd>C</kbd>.
1. You can send demo messages using the logger. For example, this example writes the message to the `local 4` facility, at severity level `Warning`, to port `514`, on the local host, in the CEF RFC format:

    ```
    logger -p local4.warn -P 514 -n 127.0.0.1 --rfc3164 -t CEF "0|Mock-test|MOCK|common=event-format- test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time"
    ```

## Next steps

In this article, you learned how to set up the Windows CEF via AMA connector to upload data from appliances that support CEF over Syslog. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.