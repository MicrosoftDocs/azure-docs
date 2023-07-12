---
title: "iboss connector for Microsoft Sentinel"
description: "Learn how to install the connector iboss to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 05/22/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# iboss connector for Microsoft Sentinel

The [iboss](https://www.iboss.com) data connector enables you to seamlessly connect your Threat Console to Microsoft Sentinel and enrich your instance with iboss URL event logs. Our logs are forwarded in Common Event Format (CEF) over Syslog and the configuration required can be completed on the iboss platform without the use of a proxy. Take advantage of our connector to garner critical data points and gain insight into security threats.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Log Analytics table(s)** | ibossUrlEvent<br/> |
| **Data collection rules support** | Not currently supported |
| **Supported by** | [iboss](https://www.iboss.com/contact-us/) |

## Query samples

**Logs Received from the past week**
   ```kusto
ibossUrlEvent 
   | where TimeGenerated > ago(7d)
   ```



## Vendor installation instructions

1. Configure a dedicated proxy Linux machine

If using the iboss gov environment or there is a preference to forward the logs to a dedicated proxy Linux machine, proceed with this step. In all other cases, please advance to step two.

1.1 Linux Syslog agent configuration

Install and configure the Linux agent to collect your Common Event Format (CEF) Syslog messages and forward them to Microsoft Sentinel.

> Notice that the data from all regions will be stored in the selected workspace

1.2 Select or create a Linux machine

Select or create a Linux machine that Microsoft Sentinel will use as the dedicated proxy Linux machine between your security solution and Microsoft Sentinel this machine can be on your on-prem environment, Azure or other clouds.

1.3 Install the CEF collector on the Linux machine

Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP.

> 1. Make sure that you have Python on your machine using the following command: python -version

> 2. You must have elevated permissions (sudo) on your machine

   Run the following command to install and apply the CEF collector:

   `sudo wget -O cef_installer.py https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/DataConnectors/CEF/cef_installer.py&&sudo python cef_installer.py {0} {1}`

2. Forward Common Event Format (CEF) logs

Set your Threat Console to send Syslog messages in CEF format to your Azure workspace. Make note of your Workspace ID and Primary Key within your Log Analytics Workspace (Select the workspace from the Log Analytics workspaces menu in the Azure portal. Then select Agents management in the Settings section). 

>1. Navigate to Reporting & Analytics inside your iboss Console

>2. Select Log Forwarding -> Forward From Reporter

>3. Select Actions -> Add Service

>4. Toggle to Microsoft Sentinel as a Service Type and input your Workspace ID/Primary Key along with other criteria. If a dedicated proxy Linux machine has been configured, toggle to Syslog as a Service Type and configure the settings to point to your dedicated proxy Linux machine

>5. Wait one to two minutes for the setup to complete

>6. Select your Microsoft Sentinel Service and verify the Sentinel Setup Status is Successful. If a dedicated proxy Linux machine has been configured, you may proceed with validating your connection

3. Validate connection

Open Log Analytics to check if the logs are received using the CommonSecurityLog schema.

>It may take about 20 minutes until the connection streams data to your workspace

4. Secure your machine 

Make sure to configure the machine's security according to your organization's security policy (Only applicable if a dedicated proxy Linux machine has been configured).


[Learn more >](https://aka.ms/SecureCEF)



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/iboss.iboss-sentinel-connector?tab=Overview) in the Azure Marketplace.
