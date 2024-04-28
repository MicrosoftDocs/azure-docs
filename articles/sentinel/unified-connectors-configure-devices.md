---
title: Syslog and CEF AMA connectors - configure devices
description: Learn how to configure specific devices that use the Syslog via AMA or Common Event Format (CEF) via AMA data connectors for Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.custom: linux-related-content
ms.date: 04/22/2024
---

# Configure specific devices for Microsoft Sentinel syslog or CEF AMA data connectors 

Some Microsoft Sentinel solutions are supported by the data connectors Syslog via AMA or Common Event Format (CEF) via AMA in Microsoft Sentinel. This article lists the solution provider's installation instructions for specific devices. To forward data to your Log Analytics workspace for Microsoft Sentinel, complete the steps in [Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md). Then, use the appropriate provider's instructions in this article complete the set up.

For more information about the related Microsoft solution for each of these devices, search the [Azure Marketplace](https://azuremarketplace.microsoft.com/) for the **Product Type** > **Solution Templates** or review the solution from the **Content hub** in Microsoft Sentinel. 

The installation instructions in this article are given by the solution provider. For changes, contact the solution provider.

## AI Analyst Darktrace

Forward Common Event Format instructions: Configure Darktrace to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent.

1. Within the Darktrace Threat Visualizer, navigate to the System Config page in the main menu under Admin.

1. From the left-hand menu, select Modules and choose Microsoft Sentinel from the available Workflow Integrations.\n 
1. A configuration window will open. Locate Microsoft Sentinel Syslog CEF and click New to reveal the configuration settings, unless already exposed.

1. In the Server configuration field, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary firewalls.

1. Configure any alert thresholds, time offsets or additional settings as required.

1. Review any additional configuration options you may wish to enable that alter the Syslog syntax.

1. Enable Send Alerts and save your changes.

## Akamai Security Events

Forward Common Event Format instructions: Follow these steps to configure Akamai CEF connector to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

Links:

https://developer.akamai.com/tools/integrations/siem 
## AristaAwakeSecurity

Instructions: Not provided.



## Aruba ClearPass

Forward Common Event Format instructions: Configure Aruba ClearPass to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent. 1. Follow these instructions to configure the Aruba ClearPass to forward syslog. 2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.

Links:

https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm 
## Barracuda WAF

Instructions: Not provided.

## Broadcom SymantecDLP

Forward Common Event Format instructions: Configure Symantec DLP to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent. 1. Follow these instructions to configure the Symantec DLP to forward syslog 2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.

Links:

https://knowledge.broadcom.com/external/article/159509/generating-syslog-messages-from-data-los.html 
## Cisco Firepower EStreamer

Forward Common Event Format instructions: Install and configure the Firepower eNcore eStreamer client, for more details see full install guide

Links:

https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html 
## CiscoSEG

Forward Common Event Format instructions: Follow these steps to configure Cisco Secure Email Gateway to forward logs via syslog:

Configure Log Subscription

NOTE: Select Consolidated Event Logs in Log Type field.

Links:

https://www.cisco.com/c/en/us/td/docs/security/esa/esa14-0/user_guide/b_ESA_Admin_Guide_14-0/b_ESA_Admin_Guide_12_1_chapter_0100111.html#con_1134718 
## Citrix Web App Firewall

Forward Common Event Format instructions: Configure Citrix WAF to send Syslog messages in CEF format to the proxy machine using the steps below.

Follow this guide to configure WAF.

Follow this guide to configure CEF logs.

Follow this guide to forward the logs to proxy . Make sure you to send the logs to port 514 TCP on the Linux machine's IP address.

Links:

https://support.citrix.com/article/CTX234174
https://support.citrix.com/article/CTX136146
https://docs.citrix.com/en-us/citrix-adc/13/system/audit-logging/configuring-audit-logging.html 
## Claroty

Forward Common Event Format instructions: Configure log forwarding using CEF:

Navigate to the Syslog section of the Configuration menu.

Select +Add.

In the Add New Syslog Dialog specify Remote Server IP, Port, Protocol and select Message Format - CEF.

Choose Save to exit the Add Syslog dialog.



## Contrast Protect

Forward Common Event Format instructions: Configure the Contrast Protect agent to forward events to syslog as described here: https://docs.contrastsecurity.com/en/output-to-syslog.html. Generate some attack events for your application.



## CyberArk Enterprise Password Vault (EPV) Events

Forward Common Event Format instructions: On the EPV configure the dbparm.ini to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machines IP address.



## Delinea Secret Server

Forward Common Event Format instructions: Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.



## ExtraHop Reveal(x)

Forward Common Event Format instructions: 1. Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine IP address. 2. Follow the directions to install the ExtraHop Detection SIEM Connector bundle on your Reveal(x) system. The SIEM Connector is required for this integration. 3. Enable the trigger for ExtraHop Detection SIEM Connector - CEF 4. Update the trigger with the ODS syslog targets you created  5. The Reveal(x) system formats syslog messages in Common Event Format (CEF) and then sends data to Microsoft Sentinel.

Links:

https://aka.ms/asi-syslog-extrahop-forwarding 
## F5 Networks

Forward Common Event Format instructions: Configure F5 to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to F5 Configuring Application Security Event Logging, follow the instructions to set up remote logging, using the following guidelines:

Set the Remote storage type to CEF.
Set the Protocol setting to UDP.
Set the IP address to the Syslog server IP address.
Set the port number to 514, or the port your agent uses.
Set the facility to the one that you configured in the Syslog agent (by default, the agent sets this to local4).
You can set the Maximum Query String Size to be the same as you configured.
Links:

https://aka.ms/asi-syslog-f5-forwarding 
## FireEye Network Security

Forward Common Event Format instructions: Complete the following steps to send data using CEF:

2.1. Log into the FireEye appliance with an administrator account

2.2. Click Settings

2.3. Click Notifications

Click rsyslog

2.4. Check the Event type check box

2.5. Make sure Rsyslog settings are:

Default format: CEF

Default delivery: Per event

Default send as: Alert



## Forcepoint CASB

Forward Common Event Format instructions: Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.



## Forcepoint CSG

Forward Common Event Format instructions: The integration is made available with two implementations options.



## Forcepoint NGFW

Forward Common Event Format instructions: Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.



## ForgeRock Common Audit for CEF

Instructions: Not provided.



## iboss

Forward Common Event Format instructions: Set your Threat Console to send Syslog messages in CEF format to your Azure workspace. Make note of your Workspace ID and Primary Key within your Log Analytics Workspace (Select the workspace from the Log Analytics workspaces menu in the Azure portal. Then select Agents management in the Settings section).

Navigate to Reporting & Analytics inside your iboss Console

Select Log Forwarding -> Forward From Reporter

Select Actions -> Add Service

Toggle to Microsoft Sentinel as a Service Type and input your Workspace ID/Primary Key along with other criteria. If a dedicated proxy Linux machine has been configured, toggle to Syslog as a Service Type and configure the settings to point to your dedicated proxy Linux machine

Wait one to two minutes for the setup to complete

Select your Microsoft Sentinel Service and verify the Sentinel Setup Status is Successful. If a dedicated proxy Linux machine has been configured, you may proceed with validating your connection



## Illumio Core

Forward Common Event Format instructions: Configure Event Format

From the PCE web console menu, choose Settings > Event Settings to view your current settings.

Click Edit to change the settings.

Set Event Format to CEF.

(Optional) Configure Event Severity and Retention Period.

Configure event forwarding to an external syslog server

From the PCE web console menu, choose Settings > Event Settings.

Click Add.

Click Add Repository.

Complete the Add Repository dialog.

Click OK to save the event forwarding configuration.



## Illusive Platform

Forward Common Event Format instructions: 1. Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

Log onto the Illusive Console, and navigate to Settings->Reporting.
Find Syslog Servers
Supply the following information:
Host name: Linux Syslog agent IP address or FQDN host name
Port: 514
Protocol: TCP
Audit messages: Send audit messages to server
To add the syslog server, click Add.
For more information about how to add a new syslog server in the Illusive platform, please find the Illusive Networks Admin Guide in here: https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version


## Imperva WAF Gateway

Instructions: Not provided.



## Infoblox Cloud Data Connector

Instructions: Not provided.



## Infoblox SOC Insights

Instructions: Not provided.



## KasperskySecurityCenter

Forward Common Event Format instructions: Follow the instructions to configure event export from Kaspersky Security Center.

Links:

https://support.kaspersky.com/KSC/13/en-US/89277.htm 
## Morphisec

Forward Common Event Format instructions: Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.



## Netwrix Auditor

Forward Common Event Format instructions: Follow the instructions to configure event export from Netwrix Auditor.

Links:

https://www.netwrix.com/download/QuickStart/Netwrix_Auditor_Add-on_for_HPE_ArcSight_Quick_Start_Guide.pdf 
## NozomiNetworks

Forward Common Event Format instructions: Follow these steps to configure Nozomi Networks device for sending Alerts, Audit Logs, Health Logs log via syslog in CEF format:

Log in to the Guardian console.

Navigate to Administration->Data Integration, press +Add and select the Common Event Format (CEF) from the drop down

Create New Endpoint using the appropriate host information and enable Alerts, Audit Logs, Health Logs for sending.



## Onapsis Platform

Instructions: Not provided.



## OSSEC

Forward Common Event Format instructions: Follow these steps to configure OSSEC sending alerts via syslog.

Links:

https://www.ossec.net/docs/docs/manual/output/syslog-output.html 
## Palo Alto - XDR (Cortex)

Instructions: Not provided.



## PaloAlto-PAN-OS

Forward Common Event Format instructions: Configure Palo Alto Networks to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to configure Palo Alto Networks NGFW for sending CEF events.

Go to Palo Alto CEF Configuration and Palo Alto Configure Syslog Monitoring steps 2, 3, choose your version, and follow the instructions using the following guidelines:

Set the Syslog server format to BSD.

The copy/paste operations from the PDF might change the text and insert random characters. To avoid this, copy the text to an editor and remove any characters that might break the log format before pasting it.

Learn more >

Links:

https://aka.ms/sentinel-paloaltonetworks-readme
https://aka.ms/asi-syslog-paloalto-forwarding
https://aka.ms/asi-syslog-paloalto-configure
https://aka.ms/CEFPaloAlto 
## PaloAltoCDL

Forward Common Event Format instructions: Follow the instructions to configure logs forwarding from Cortex Data Lake to a Syslog Server.

Links:

https://docs.paloaltonetworks.com/cortex/cortex-data-lake/cortex-data-lake-getting-started/get-started-with-log-forwarding-app/forward-logs-from-logging-service-to-syslog-server.html 
## PingFederate

Forward Common Event Format instructions: Follow these steps to configure PingFederate sending audit log via syslog in CEF format.

Links:

https://docs.pingidentity.com/bundle/pingfederate-102/page/gsn1564002980953.html 
## RidgeSecurity

Instructions: Not provided.



## SonicWall Firewall

Forward Common Event Format instructions: Set your SonicWall Firewall to send Syslog messages in CEF format to the proxy machine. Make sure you send the logs to port 514 TCP on the machine's IP address.

Follow Instructions . Then Make sure you select local use 4 as the facility. Then select ArcSight as the Syslog format.



## Trend Micro Apex One

Forward Common Event Format instructions: Follow these steps to configure Apex Central sending alerts via syslog. While configuring, on step 6, select the log format CEF.

Links:

https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/detections/logs_001/syslog-forwarding.aspx 
## Trend Micro Deep Security

Instructions: Not provided.



## Trend Micro TippingPoint

Instructions: Not provided.



## vArmour Application Controller

Forward Common Event Format instructions: Send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.



## Votiro

Instructions: Not provided.



## WireX Network Forensics Platform

Forward Common Event Format instructions: Contact WireX support (https://wirexsystems.com/contact-us/) in order to configure your NFP solution to send Syslog messages in CEF format to the proxy machine. Make sure that they central manager can send the logs to port 514 TCP on the machine's IP address.

## Related content

- [Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md)
- [Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md)

