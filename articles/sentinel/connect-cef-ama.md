---
title: Stream CEF logs to Microsoft Sentinel with the AMA connector 
description: Stream and filter CEF-based logs from on-premises appliances to your Microsoft Sentinel workspace.
author: limwainstein
ms.topic: how-to
ms.date: 09/19/2022
ms.author: lwainstein
#Customer intent: As a security operator, I want to stream and filter CEF-based logs from on-premises appliances to my Microsoft Sentinel workspace, so I can improve load time and easily analyze the data.   
---

# Stream CEF logs with the AMA connector

This article describes how to use the **Common Event Format (CEF) via AMA** connector to quickly filter and upload logs in the Common Event Format (CEF) from multiple on-premises appliances over Syslog. 

The connector uses the Azure Monitor Agent (AMA), which uses Data Collection Rules (DCRs). With DCRs, you can filter the logs before they're ingested, for quicker upload, efficient analysis, and querying.

Learn how to [collect Syslog with the AMA](../azure-monitor/agents/data-collection-syslog.md), including how to configure Syslog and create a DCR.

> [!IMPORTANT]
>
> The CEF via AMA connector is currently in PREVIEW. The [Azure Preview Supplemental Terms](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) include additional legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The AMA is installed on a Linux machine that acts as a log forwarder, and the AMA collects the logs in the CEF format. 

- [Set up the connector](#set-up-the-common-event-format-cef-via-ama-connector)
- [Learn more about the connector](#how-collection-works-with-the-common-event-format-cef-via-ama-connector)

> [!IMPORTANT]
>
> On **February 28th 2023**, we introduced changes to the CommonSecurityLog table schema. Following this change, you might need to review and update custom queries. For more details, see the [recommended actions section](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/upcoming-changes-to-the-commonsecuritylog-table/ba-p/3643232) in this blog post. Out-of-the-box content (detections, hunting queries, workbooks, parsers, etc.) has been updated by Microsoft Sentinel.   

## Overview 

### What is CEF collection?

Many network, security appliances, and devices send their logs in the CEF format over Syslog. This format includes more structured information than Syslog, with information presented in a parsed key-value arrangement.

If your appliance or system sends logs over Syslog using CEF, the integration with Microsoft Sentinel allows you to easily run analytics and queries across the data.

CEF normalizes the data, making it more immediately useful for analysis with Microsoft Sentinel. Microsoft Sentinel also allows you to ingest unparsed Syslog events, and to analyze them with query time parsing. 

### How collection works with the Common Event Format (CEF) via AMA connector

:::image type="content" source="media/connect-cef-ama/cef-forwarder-diagram.png" alt-text="Diagram showing the CEF log forwarding procedure." border="false":::

1. Your organization sets up a log forwarder (Linux VM), if one doesn't already exist. The forwarder can be on-premises or cloud-based.
1. Your organization uploads CEF logs from your source devices to the forwarder.
1. The AMA connector installed on the log forwarder collects and parses the logs. 
1. The connector streams the events to the Microsoft Sentinel workspace to be further analyzed. 

When you install a log forwarder, the originating device must be configured to send Syslog events to the Syslog daemon on this forwarder instead of the local daemon. The Syslog daemon on the forwarder sends events to the Azure Monitor Agent over UDP. If this Linux forwarder is expected to collect a high volume of Syslog events, its Syslog daemon sends events to the agent over TCP instead. In either case, the agent then sends the events from there to your Log Analytics workspace in Microsoft Sentinel.

:::image type="content" source="media/connect-cef-ama/syslog-forwarder-diagram-ama.png" alt-text="Diagram showing the data flow from syslog sources to the Microsoft Sentinel workspace, where the AMA is installed on a separate log-forwarding device." border="false":::

## Set up the Common Event Format (CEF) via AMA connector

### Prerequisites

Before you begin, verify that you have:

- The Microsoft Sentinel solution enabled. 
- A defined Microsoft Sentinel workspace.
- A Linux machine to collect logs.
    - The Linux machine must have Python 2.7 or 3 installed on the Linux machine. Use the ``python --version`` or ``python3 --version`` command to check.
    - For space requirements for your log forwarder, see the [Azure Monitor Agent Performance Benchmark](../azure-monitor/agents/azure-monitor-agent-performance.md). You can also review this blog post, which includes [designs for scalable ingestion](https://techcommunity.microsoft.com/t5/microsoft-sentinel-blog/designs-for-accomplishing-microsoft-sentinel-scalable-ingestion/ba-p/3741516).
- Either the `syslog-ng` or `rsyslog` daemon enabled.
- To collect events from any system that isn't an Azure virtual machine, ensure that [Azure Arc](../azure-monitor/agents/azure-monitor-agent-manage.md) is installed.

## Avoid data ingestion duplication

Using the same facility for both Syslog and CEF messages may result in data ingestion duplication between the CommonSecurityLog and Syslog tables. 

To avoid this scenario, use one of these methods:

- **If the source device enables configuration of the target facility**: On each source machine that sends logs to the log forwarder in CEF format, edit the Syslog configuration file to remove the facilities used to send CEF messages. This way, the facilities sent in CEF won't also be sent in Syslog. Make sure that each DCR you configure in the next steps uses the relevant facility for CEF or Syslog respectively.
- **If changing the facility for the source appliance isn't applicable**: Use an ingest time transformation to filter out CEF messages from the Syslog stream to avoid duplication. The data will be sent twice from the collector machine to the workspace:

    ```kusto
    source |
    where ProcessName !contains \"CEF\"
    ```

### Configure a log forwarder

To ingest Syslog and CEF logs into Microsoft Sentinel, you need to designate and configure a Linux machine that collects the logs from your devices and forwards them to your Microsoft Sentinel workspace. This machine can be a physical or virtual machine in your on-premises environment, an Azure VM, or a VM in another cloud. If this machine is not an Azure VM, it must have Azure Arc installed (see the [prerequisites](#prerequisites)).

This machine has two components that take part in this process:

- A Syslog daemon, either `rsyslog` or `syslog-ng`, which collects the logs.
- The AMA, which forwards the logs to Microsoft Sentinel.

When you set up the connector and the DCR, you [run a script](#run-the-installation-script) on the Linux machine, which configures the built-in Linux Syslog daemon (`rsyslog.d`/`syslog-ng`) to listen for Syslog messages from your security solutions on TCP/UDP port 514.

The DCR installs the AMA to collect and parse the logs.

#### Log forwarder - security considerations

Make sure to configure the machine's security according to your organization's security policy. For example, you can configure your network to align with your corporate network security policy and change the ports and protocols in the daemon to align with your requirements. To improve your machine security configuration, [secure your VM in Azure](../virtual-machines/security-policy.md), or review these [best practices for network security](../security/fundamentals/network-best-practices.md).

If your devices are sending Syslog and CEF logs over TLS (because, for example, your log forwarder is in the cloud), you need to configure the Syslog daemon (`rsyslog` or `syslog-ng`) to communicate in TLS:

- [Encrypt Syslog traffic with TLS – rsyslog](https://www.rsyslog.com/doc/v8-stable/tutorials/tls_cert_summary.html)
- [Encrypt log messages with TLS – syslog-ng](https://support.oneidentity.com/technical-documents/syslog-ng-open-source-edition/3.22/administration-guide/60#TOPIC-1209298)

### Set up the connector

You can set up the connector in two ways:  
- [Microsoft Sentinel portal](#set-up-the-connector-in-the-microsoft-sentinel-portal-ui). With this setup, you can create, manage, and delete DCRs per workspace.  
- [API](#set-up-the-connector-with-the-api). With this setup, you can create, manage, and delete DCRs. This option is more flexible than the UI. For example, with the API, you can filter by specific log levels, where with the UI, you can only select a minimum log level.

#### Set up the connector in the Microsoft Sentinel portal (UI)

1. [Open the connector page and create the DCR](#open-the-connector-page-and-create-the-dcr)
1. [Define resources (VMs)](#define-resources-vms)
1. [Select the data source type and create the DCR](#select-the-data-source-type-and-create-the-dcr)
1. [Run the installation script](#run-the-installation-script)

##### Open the connector page and create the DCR

1. Open the [Azure portal](https://portal.azure.com/) and navigate to the **Microsoft Sentinel** service.
1. Select **Data connectors**, and in the search bar, type *CEF*.
1. Select the **Common Event Format (CEF) via AMA (Preview)** connector.
1. Below the connector description, select **Open connector page**.
1. In the **Configuration** area, select **Create data collection rule**. 
1. Under **Basics**: 
    - Type a DCR name
    - Select your subscription
    - Select the resource group where your collector is defined

    :::image type="content" source="media/connect-cef-ama/dcr-basics-tab.png" alt-text="Screenshot showing the DCR details in the Basics tab." lightbox="media/connect-cef-ama/dcr-basics-tab.png":::

##### Define resources (VMs)

Select the machines on which you want to install the AMA. These machines are VMs or on-premises Linux machines with Arc installed.

1. Select the **Resources** tab and select **Add Resource(s)**. 
1. Select the VMs on which you want to install the connector to collect logs.

   :::image type="content" source="media/connect-cef-ama/dcr-select-resources.png" alt-text="Screenshot showing how to select resources when setting up the DCR." lightbox="media/connect-cef-ama/dcr-select-resources.png":::

1. Review your changes and select **Collect**. 

##### Select the data source type and create the DCR

> [!NOTE]
> Using the same facility for both Syslog and CEF messages may result in data ingestion duplication. Learn how to [avoid data ingestion duplication](#avoid-data-ingestion-duplication).

1. Select the **Collect** tab and select **Linux syslog** as the data source type.
1. Configure the minimum log level for each facility. When you select a log level, Microsoft Sentinel collects logs for the selected level and other levels with higher severity. For example, if you select **LOG_ERR**, Microsoft Sentinel collects logs for the **LOG_ERR**, **LOG_CRIT**, **LOG_ALERT**, and **LOG_EMERG** levels.

   :::image type="content" source="media/connect-cef-ama/dcr-log-levels.png" alt-text="Screenshot showing how to select log levels when setting up the DCR.":::

1. Review your changes and select **Next: Review and create**. 
1. In the **Review and create** tab, select **Create**.

##### Run the installation script

1.	Log in to the Linux forwarder machine, where you want the AMA to be installed.
1.	Run this command to launch the installation script:
 
    ```python
    sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py
    ```
    The installation script configures the `rsyslog` or `syslog-ng` daemon to use the required protocol and restarts the daemon. The script opens port 514 to listen to incoming messages in both UDP and TCP protocols. To change this setting, refer to the     
    Syslog daemon configuration file according to the daemon type running on the machine:
        - Rsyslog: `/etc/rsyslog.conf`
        - Syslog-ng: `/etc/syslog-ng/syslog-ng.conf`

    > [!NOTE] 
    > To avoid [Full Disk scenarios](../azure-monitor/agents/azure-monitor-agent-troubleshoot-linux-vm-rsyslog.md) where the agent can't function, we recommend that you set the `syslog-ng` or `rsyslog` configuration not to store unneeded logs. A Full Disk scenario disrupts the function of the installed AMA.
    > Read more about [RSyslog](https://www.rsyslog.com/doc/master/configuration/actions.html) or [Syslog-ng](
https://www.syslog-ng.com/technical-documents/doc/syslog-ng-open-source-edition/3.26/administration-guide/34#TOPIC-1431029).

### Set up the connector with the API

You can create DCRs using the [API](/rest/api/monitor/data-collection-rules). Learn more about [DCRs](../azure-monitor/essentials/data-collection-rule-overview.md).

Run this command to launch the installation script:
 
```python
sudo wget -O Forwarder_AMA_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Forwarder_AMA_installer.py&&sudo python Forwarder_AMA_installer.py 
```
The installation script configures the `rsyslog` or `syslog-ng` daemon to use the required protocol and restarts the daemon.  

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
                {
                    "workspaceResourceId": "/subscriptions/{Your-Subscription-
Id}/resourceGroups/{resourceGroupName}/providers/Microsoft.OperationalInsights/workspaces/{SentinelWorkspaceName}", "workspaceId": "123x56xx-9123-xx4x-567x-89123xxx45",
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
- The `authpriv` and `mark` facilities with the `Info`, `Notice`, `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `daemon` facility with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `kern`, `local0`, `local5`, and `news` facilities with the `Critical`, `Alert`, and `Emergency` log levels 
- The `mail` and `uucp` facilities with the `Emergency` log level

```rest
        "syslog": [
            {
                "streams": [ 
                    "Microsoft-CommonSecurityLog"
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
                "streams": [ "Microsoft-CommonSecurityLog"
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
                    "Microsoft-CommonSecurityLog"
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
                    "Microsoft-CommonSecurityLog"
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

1. To validate that the syslog daemon is running on the UDP port and that the AMA is listening, run this command:

    ```
    netstat -lnptv
    ```

    You should see the `rsyslog` or `syslog-ng` daemon listening on port 514. 

1. To capture messages sent from a logger or a connected device, run this command in the background:

    ```
    tcpdump -i any port 514 -A -vv &
    ```
1. After you complete the validation, we recommend that you stop the `tcpdump`: Type `fg` and then select <kbd>Ctrl</kbd>+<kbd>C</kbd>.
1. To send demo messages, do one of the following: 
    - Use the netcat utility. In this example, the utility reads data posted through the `echo` command with the newline switch turned off. The utility then writes the data to UDP port `514` on the localhost with no timeout. To execute the netcat utility, you might need to install an additional package.
    
        ```
        echo -n "<164>CEF:0|Mock-test|MOCK|common=event-format-test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time" | nc -u -w0 localhost 514
        ```
    - Use the logger. This example writes the message to the `local 4` facility, at severity level `Warning`, to port `514`, on the local host, in the CEF RFC format. The `-t` and `--rfc3164` flags are used to comply with the expected RFC format.
    
        ```
        logger -p local4.warn -P 514 -n 127.0.0.1 --rfc3164 -t CEF "0|Mock-test|MOCK|common=event-format-test|end|TRAFFIC|1|rt=$common=event-formatted-receive_time"
        ```    

1. To verify that the connector is installed correctly, run the troubleshooting script with one of these commands:

    - For CEF logs, run:
        
        ```python
         sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --cef
        ```

    - For Cisco Adaptive Security Appliance (ASA) logs, run:

        ```python
        sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --asa
        ```
 
    - For Cisco Firepower Threat Defense (FTD) logs, run:
    
        ```python
        sudo wget -O Sentinel_AMA_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/Syslog/Sentinel_AMA_troubleshoot.py&&sudo python Sentinel_AMA_troubleshoot.py --ftd
        ```

## Next steps

In this article, you learned how to set up the CEF via AMA connector to upload data from appliances that support CEF over Syslog. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data, and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](detect-threats-built-in.md).
- [Use workbooks](monitor-your-data.md) to monitor your data.
