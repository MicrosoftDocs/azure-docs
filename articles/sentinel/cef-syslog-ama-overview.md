---
title:  Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel
description: Learn how Microsoft Sentinel collects Syslog and CEF messages with the Azure Monitor Agent.
author: yelevin
ms.author: yelevin
ms.topic: concept
ms.custom: linux-related-content
ms.date: 04/22/2024
#Customer intent: As a security operator, I want to understand how Microsoft Sentinel collects Syslog and CEF messages with the Azure Monitor Agent so that I can determine if this solution fits my organization's needs.  
---

# Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel

The Syslog via AMA and Common Event Format (CEF) via AMA data connectors for Microsoft Sentinel filter and ingest Syslog messages, including those in Common Event Format (CEF), from Linux machines and from network and security devices and appliances. These connectors install the Azure Monitor Agent (AMA) on any Linux machine from which you want to collect Syslog and/or CEF messages. This machine could be the originator of the messages, or it could be a forwarder that collects messages from other machines, such as network or security devices and appliances. The connector sends the agents instructions based on [Data Collection Rules (DCRs)](../azure-monitor/essentials/data-collection-rule-overview.md) that you define. DCRs specify the systems to monitor and the types of logs or messages to collect, and they define filters to apply to the messages before they're ingested, for better performance and more efficient querying and analysis.

Syslog and CEF are two common formats for logging data from different devices and applications. They help system administrators and security analysts to monitor and troubleshoot the network and identify potential threats or incidents.

## What is Syslog?

Syslog is a standard protocol for sending and receiving messages between different devices or applications over a network. It was originally developed for Unix systems, but it's now widely supported by various platforms and vendors. Syslog messages have a predefined structure that consists of a priority, a timestamp, a hostname, an application name, a process ID, and a message text. Syslog messages can be sent over UDP, TCP, or TLS, depending on the configuration and the security requirements.

The Azure Monitor Agent supports Syslog RFCs 3164 and 5424.

## What is Common Event Format (CEF)?

CEF, or Common Event Format, is a vendor-neutral format for logging data from network and security devices and appliances, such as firewalls, routers, detection and response solutions, and intrusion detection systems, as well as from other kinds of systems such as web servers. An extension of Syslog, it was developed especially for security information and event management (SIEM) solutions. CEF messages have a standard header that contains information such as the device vendor, the device product, the device version, the event class, the event severity, and the event ID. CEF messages also have a variable number of extensions that provide more details about the event, such as the source and destination IP addresses, the username, the file name, or the action taken.

## How Microsoft Sentinel collects Syslog and CEF messages with the Azure Monitor Agent

The following diagrams illustrate the architecture of Syslog and CEF message collection in Microsoft Sentinel, using the **Syslog via AMA** and **Common Event Format (CEF) via AMA** connectors.

# [Single machine (syslog)](#tab/single)

This diagram shows Syslog messages being collected from a single individual Linux virtual machine, on which the Azure Monitor Agent (AMA) is installed.

:::image type="content" source="media/connect-cef-ama/syslog-diagram.png" alt-text="Diagram of Syslog collection from single source.":::

The data ingestion process using the Azure Monitor Agent uses the following components and data flows:

- **Log sources:** These are your various Linux VMs in your environment that produce Syslog messages. These messages are collected by the local Syslog daemon on TCP or UDP port 514 (or another port per your preference).

- The local **Syslog daemon** (either `rsyslog` or `syslog-ng`) collects the log messages on TCP or UDP port 514 (or another port per your preference). The daemon then sends these logs to the **Azure Monitor Agent**  in two different ways, depending on the AMA version:
     - AMA versions **1.28.11** and above receive logs on **TCP port 28330**.
    - Earlier versions of AMA receive logs via Unix domain socket.
    
    If you want to use a port other than 514 for receiving Syslog/CEF messages, make sure that the port configuration on the Syslog daemon matches that of the application generating the messages.

- The **Azure Monitor Agent** that you install on each Linux VM you want to collect Syslog messages from, by setting up the data connector. The agent parses the logs and then sends them to your **Microsoft Sentinel (Log Analytics) workspace**.

- Your **Microsoft Sentinel (Log Analytics) workspace:** Syslog messages sent here end up in the *Syslog* table, where you can query the logs and perform analytics on them to detect and respond to security threats.

# [Log forwarder (syslog/CEF)](#tab/forwarder)

This diagram shows Syslog and CEF messages being collected from a Linux-based log forwarding machine on which the Azure Monitor Agent (AMA) is installed. This log forwarder collects Syslog and CEF messages from their originating machines, devices, or appliances.

:::image type="content" source="media/connect-cef-ama/cef-forwarder-diagram.png" alt-text="Diagram of Syslog and CEF collection from a log forwarder." lightbox="media/connect-cef-ama/cef-forwarder-diagram.png":::

The data ingestion process using the Azure Monitor Agent uses the following components and data flows:

- **Log sources:** These are your various security devices and appliances in your environment that produce log messages in CEF format, or in plain Syslog. These devices are configured to send their log messages over TCP or UDP port 514 (or another port per your preference), *not* to their local Syslog daemon, but instead to the **Syslog daemon on the Log forwarder**.

- **Log forwarder:** This is a dedicated Linux VM that your organization sets up to collect the log messages from your Syslog and CEF log sources. The VM can be on-premises, in Azure, or in another cloud. This log forwarder itself has two components:
    - The **Syslog daemon** (either `rsyslog` or `syslog-ng`) collects the log messages on TCP or UDP port 514 (or another port per your preference). The daemon then sends these logs to the **Azure Monitor Agent** in two different ways, depending on the AMA version:
      - AMA versions **1.28.11** and above receive logs on **TCP port 28330**.
      - Earlier versions of AMA receive logs via Unix domain socket.
      
      If you want to use a port other than 514 for receiving Syslog/CEF messages, make sure that the port configuration on the Syslog daemon matches that of the application generating the messages.
    - The **Azure Monitor Agent** that you install on the log forwarder by setting up the Syslog and/or CEF data connectors. The agent parses the logs and then sends them to your **Microsoft Sentinel (Log Analytics) workspace**.

- Your **Microsoft Sentinel (Log Analytics) workspace:** CEF logs sent here end up in the *CommonSecurityLog* table, and Syslog messages in the *Syslog* table. There you can query the logs and perform analytics on them to detect and respond to security threats.

---

## Data ingestion duplication

Using the same facility for both Syslog and CEF messages may result in data ingestion duplication between the CommonSecurityLog and Syslog tables. 

To avoid this scenario, use one of these methods:

- **If the source device enables configuration of the target facility**: On each source machine that sends logs to the log forwarder in CEF format, edit the Syslog configuration file to remove the facilities used to send CEF messages. This way, the facilities sent in CEF won't also be sent in Syslog. Make sure that each DCR you configure in the next steps uses the relevant facility for CEF or Syslog respectively.

    To see an example of how to arrange a DCR to ingest both Syslog and CEF messages from the same agent, go to [Syslog and CEF streams in the same DCR](#syslog-and-cef-streams-in-the-same-dcr) later in this article.

- **If changing the facility for the source appliance isn't applicable**: Use an ingest time transformation to filter out CEF messages from the Syslog stream to avoid duplication, as shown in the query example below. The data will be sent twice from the collector machine to the workspace.

    ```kusto
    source |
    where ProcessName !contains "CEF"
    ```

## Examples of facilities and log levels sections

Review these examples of the facilities and log levels settings. The `name` field includes the filter name.

For CEF message ingestion, the value for `"streams"` should be `"Microsoft-CommonSecurityLog"` instead of `"Microsoft-Syslog"`.

This example collects events from the `cron`, `daemon`, `local0`, `local3` and `uucp` facilities, with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels:

```json
    "dataSources": {
      "syslog": [
        {
        "name": "SyslogStream0",
        "streams": [
          "Microsoft-Syslog"
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
        ]
      }
    ]
  }
```

## Syslog and CEF streams in the same DCR

This example shows how you can collect **Syslog and CEF** messages in the same DCR.

The DCR collects CEF event messages for:
- The `authpriv` and `mark` facilities with the `Info`, `Notice`, `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 
- The `daemon` facility with the `Warning`, `Error`, `Critical`, `Alert`, and `Emergency` log levels 

It collects Syslog event messages for:
- The `kern`, `local0`, `local5`, and `news` facilities with the `Critical`, `Alert`, and `Emergency` log levels 
- The `mail` and `uucp` facilities with the `Emergency` log level

```json
    "dataSources": {
      "syslog": [
        {
          "name": "CEFStream1",
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
          ]
        },
        {
          "name": "CEFStream2",
          "streams": [ 
            "Microsoft-CommonSecurityLog"
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
          ]
        },
        {
          "name": "SyslogStream3",
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
          ]
        },
        {
          "name": "SyslogStream4",
          "streams": [ 
            "Microsoft-Syslog"
          ],
          "facilityNames": [ 
            "mail",
            "uucp"
          ],
          "logLevels": [ 
            "Emergency"
          ]
        }
      ]
    }

```

## Next steps

> [!div class="nextstepaction"]
> [Set up the data connectors](connect-cef-syslog-ama.md)