---
title: "Fortinet connector for Microsoft Sentinel"
description: "Learn how to install the connector Fortinet to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Fortinet connector for Microsoft Sentinel

The Fortinet firewall connector allows you to easily connect your Fortinet logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation. This gives you more insight into your organization's network and improves your security operation capabilities.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (Fortinet)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Microsoft Corporation](https://support.microsoft.com) |

## Query samples

**All logs**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Fortinet"

   | where DeviceProduct startswith "Fortigate"

            
   | sort by TimeGenerated
   ```

**Summarize by destination IP and port**
   ```kusto

CommonSecurityLog

   | where DeviceVendor == "Fortinet"

   | where DeviceProduct startswith "Fortigate"

            
   | summarize count() by DestinationIP, DestinationPort​
            
   | sort by TimeGenerated
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python --version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py &&sudo python cef_installer.py {0} {1}

2. Forward Fortinet logs to Syslog agent

Set your Fortinet to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine’s IP address.


Copy the CLI commands below and:
-   Replace "server &lt;ip address&gt;" with the Syslog agent's IP address.
-   Set the "&lt;facility_name&gt;" to use the facility you configured in the Syslog agent (by default, the agent sets this to local4).
-   Set the Syslog port to 514, the port your agent uses.
-   To enable CEF format in early FortiOS versions, you may need to run the command "set csv disable".

For more information, go to the  [Fortinet Document Library](https://aka.ms/asi-syslog-fortinet-fortinetdocumentlibrary), choose your version, and use the "Handbook" and "Log Message Reference" PDFs.

[Learn more >](https://aka.ms/CEF-Fortinet)

Set up the connection using the CLI to run the following commands:

`config log syslogd setting`<br />
`set status enable`<br />
`set format cef`<br />
`set port 514`<br />
`set server <ip_address_of_receiver>`<br />
`end`<br />

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python --version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py &&sudo python cef_troubleshoot.py  {0}

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)

## Setting up your Fortigate or Fortigate via Fortianalyzer to send CEF formatted logs over TLS Port 6514 (syslog-ng)

Your organization may require that you set up your syslog forwarder to use solely TLS encrypted traffic. In this case, you should look to build your solution using guidance from [RFC 5425](https://datatracker.ietf.org/doc/html/rfc5425) which states that TCP port 6514 is designated for syslog messages over TLS.

Use the Fortigate CLI and the following commands:

`config log syslogd setting`<br />
`set status enable`<br />
`set format cef`<br />
`set port 6514`<br /> 
`set server <ip_address_of_receiver>`<br />
`set enc-algorithm high`<br />
`set mode reliable`<br />
`end`<br />

### Setting up your PKI infrastructure for sending over TLS

In order to send logs securely over TLS, you need to have a certificate and key pair signed by a Public CA. If you are testing a solution that is not yet intended to go into production, you can use a self-signed certificate or a Private CA to test your solution first. You can generate or import a certificate in a secrets management tool such as Azure Key Vault which will manage the lifecycle of your keys for you.

Download your certificate in PEM format. If you used Azure Key Vault, you will need to split your PEM file into a certificate and a key respectively and save them into a directory within your syslog-ng directories on your Linux machine. For example:

`/etc/syslog-ng/cert.d/cert.crt`<br />
`/etc/syslog-ng/key.d/cert.key`<br />

### Create source and destination filters for Fortigate in a modular file

Your file can be named whatever you require, you reference the contents of this file in an @include statement in the main syslog-ng config file. For example, you can create another directory (like you did with your keys and certificate) for any additional config files.

`/etc/syslog-ng/conf.d/forticonfig.conf`

Create the file and add these filters and declarations:

`filter f_oms_filter {match("CEF\|ASA");};`<br />
`destination d_oms { tcp("127.0.0.1" port (25226)); };`<br />

Between the f_oms_filter and your source and log declarations, add all of the filters beginning with f_ (such as f_auth_oms) that you require and their corresponding source and log destinations. If you are looking for syslog only, it will probably just be the syslog filter i.e.:
`#OMS_facility = syslog`<br />
`filter f_syslog_oms { level(alert,crit,debug,emerg,err,info,notice,warning) and facility(syslog); };`<br />
`source src { syslog ( ip-protocol(4) port(6514) transport("tls") tls ( cert-file("/etc/syslog-ng/cert.d/syslog.crt") key-file("/etc/syslog-ng/key.d/syslog.key") peer-verify(optional-untrusted)))};`<br />
`log { source(src); filter(f_oms_filter); destination(d_oms); };`<br />

## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/azuresentinel.azure-sentinel-solution-fortinetfortigate?tab=Overview) in the Azure Marketplace.
