---
title: "WithSecure Elements via connector for Microsoft Sentinel"
description: "Learn how to install the connector WithSecure Elements via to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# WithSecure Elements via connector for Microsoft Sentinel

WithSecure Elements is a unified cloud-based cyber security platform.
By connecting WithSecure Elements via Connector to Microsoft Sentinel, security events can be received in Common Event Format (CEF) over syslog.
It requires deploying "Elements Connector" either on-prem or in cloud.
The Common Event Format (CEF) provides natively search & correlation, alerting and threat intelligence enrichment for each data log.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | CommonSecurityLog (WithSecure Events)<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [WithSecure](https://www.withsecure.com/en/support) |

## Query samples

**All logs**
   ```kusto
CommonSecurityLog

   | where DeviceVendor == "WithSecure™"

   | sort by TimeGenerated
   ```



## Vendor installation instructions

1. Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.1 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your WithSecurity solution and Sentinel. The machine can be on-prem environment, Microsoft Azure or other cloud based.
> Linux needs to have `syslog-ng` and `python`/`python3` installed.

1.2 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python -version.

> 2. You must have elevated permissions (sudo) on your machine.

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

   For python3 use command below:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python3 cef_installer.py {0} {1}`

2. Forward data from WithSecure Elements Connector to Syslog agent

This describes how to install and configure Elements Connector step by step.

2.1 Order Connector subscription

If Connector subscription has not been ordered yet go to EPP in Elements Portal. Then navigate to Downloads and in Elements Connector section click 'Create subscription key' button. You can check Your subscription key in Subscriptions.

2.2 Download Connector

Go to Downloads and in WithSecure Elements Connector section select correct installer.

2.3 Create management API key

When in EPP open account settings in top right corner. Then select Get management API key. If key has been created earlier it can be read there as well.

2.4 Install Connector

To install Elements Connector follow [Elements Connector Docs](https://help.f-secure.com/product.html#business/connector/latest/en/concept_BA55FDB13ABA44A8B16E9421713F4913-latest-en).

2.5 Configure event forwarding

If api access has not been configured during installation follow [Configuring API access for Elements Connector](https://help.f-secure.com/product.html#business/connector/latest/en/task_F657F4D0F2144CD5913EE510E155E234-latest-en).
Then go to EPP, then Profiles, then use For Connector from where you can see the connector profiles. Create a new profile (or edit an existing not read-only profile). In Event forwarding enable it. SIEM system address: **127.0.0.1:514**. Set format to **Common Event Format**. Protocol is **TCP**. Save profile and assign it to Elements Connector in Devices tab.

3. Validate connection

Follow the instructions to validate your connectivity:

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace.

If the logs are not received, run the following connectivity validation script:

> 1. Make sure that you have Python on your machine using the following command: python -version

>2. You must have elevated permissions (sudo) on your machine

   Run the following command to validate your connectivity:

   `sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python cef_troubleshoot.py {0}`

   For python3 use command below:

   `sudo wget -O cef_troubleshoot.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_troubleshoot.py&&sudo python3 cef_troubleshoot.py {0}`

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/withsecurecorporation.sentinel-solution-withsecure-via-connector?tab=Overview) in the Azure Marketplace.
