---
title: Syslog and CEF AMA connectors - configure devices
description: Learn how to configure specific devices that use the Syslog via AMA or Common Event Format (CEF) via AMA data connectors for Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: reference
ms.custom: linux-related-content
ms.date: 05/07/2024
---

# Configure specific devices for Microsoft Sentinel syslog or CEF AMA data connectors 

Some Microsoft Sentinel solutions are supported by the data connectors Syslog via AMA or Common Event Format (CEF) via AMA in Microsoft Sentinel. This article lists the solution provider's installation instructions for specific devices. To forward data to your Log Analytics workspace for Microsoft Sentinel, complete the steps in [Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md). Then, use the appropriate provider's instructions in this article complete the set up.

For more information about the related Microsoft solution for each of these devices, search the [Azure Marketplace](https://azuremarketplace.microsoft.com/) for the **Product Type** > **Solution Templates** or review the solution from the **Content hub** in Microsoft Sentinel. 

The installation instructions in this article are given by the solution provider. For changes, contact the solution provider.

## AI Analyst Darktrace

Configure Darktrace to forward Syslog messages in CEF format to your Azure workspace via the Syslog agent. 

1. Within the Darktrace Threat Visualizer, navigate to the System Config page in the main menu under Admin. 

2. From the left-hand menu, select Modules and choose Microsoft Sentinel from the available Workflow Integrations.
1. A configuration window will open. Locate Microsoft Sentinel Syslog CEF and click New to reveal the configuration settings, unless already exposed. 

4. In the Server configuration field, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary firewalls. 

5. Configure any alert thresholds, time offsets or additional settings as required. 

6. Review any additional configuration options you may wish to enable that alter the Syslog syntax.

7. Enable Send Alerts and save your changes.


## Akamai Security Events

[Follow these steps](https://developer.akamai.com/tools/integrations/siem) to configure Akamai CEF connector to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.


## AristaAwakeSecurity

Perform the following steps to forward Awake Adversarial Model match results to a CEF collector listening on TCP port **514** at IP **192.168.0.1**:

1. Navigate to the Detection Management Skills page in the Awake UI.
1. Click + Add New Skill.
1. Set the Expression field to `integrations.cef.tcp { destination: "192.168.0.1", port: 514, secure: false, severity: Warning }`
1. Set the Title field to a descriptive name like, **Forward Awake Adversarial Model match result to Microsoft Sentinel**.
1. Set the Reference Identifier to something easily discoverable like, `integrations.cef.sentinel-forwarder`
1. Click Save.

Within a few minutes of saving the definition and other fields the system will begin sending new model match results to the CEF events collector as they are detected.

For more information, refer to the **Adding a Security Information and Event Management Push Integration** page from the Help Documentation in the Awake UI.


## Aruba ClearPass

Configure Aruba ClearPass to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

1. [Follow these instructions](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm) to configure the Aruba ClearPass to forward syslog.
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.


## Barracuda WAF

The Barracuda Web Application Firewall can integrate with and export logs directly to Microsoft Sentinel via Azure OMS Server.​

1. Go to [Barracuda WAF configuration](https://aka.ms/asi-barracuda-connector), and follow the instructions, using the parameters below to set up the connection:.

2. Web Firewall logs facility: Go to the advanced settings (link below) for your workspace and on the **Data > Syslog** tabs, make sure that the facility exists.​

Notice that the data from all regions will be stored in the selected workspace


## Broadcom SymantecDLP

Configure Symantec DLP to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.
1. [Follow these instructions](https://knowledge.broadcom.com/external/article/159509/generating-syslog-messages-from-data-los.html) to configure the Symantec DLP to forward syslog
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.


## Cisco Firepower EStreamer

Install and configure the Firepower eNcore eStreamer client, for more details see full install [guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html)


## CiscoSEG

Follow these steps to configure Cisco Secure Email Gateway to forward logs via syslog:

Configure [Log Subscription](https://www.cisco.com/c/en/us/td/docs/security/esa/esa14-0/user_guide/b_ESA_Admin_Guide_14-0/b_ESA_Admin_Guide_12_1_chapter_0100111.html#con_1134718)

Select **Consolidated Event Logs** in Log Type field.


## Citrix Web App Firewall

Configure Citrix WAF to send Syslog messages in CEF format to the proxy machine using the steps below. 

1. Follow [this guide](https://support.citrix.com/article/CTX234174) to configure WAF.
2. Follow [this guide](https://support.citrix.com/article/CTX136146) to configure CEF logs.
3. Follow [this guide](https://docs.citrix.com/en-us/citrix-adc/13/system/audit-logging/configuring-audit-logging.html) to forward the logs to proxy . Make sure you to send the logs to port 514 TCP on the Linux machine's IP address.


## Claroty

Configure log forwarding using CEF:

1. Navigate to the **Syslog** section of the Configuration menu.
2. Select **+Add**.
3. In the **Add New Syslog Dialog** specify Remote Server **IP**, **Port**, **Protocol** and select **Message Format** - **CEF**.
4. Choose **Save** to exit the **Add Syslog dialog**.


## Contrast Protect

Configure the Contrast Protect agent to forward events to syslog as described [here](https://docs.contrastsecurity.com/en/output-to-syslog.html). Generate some attack events for your application.


## CrowdStrike Falcon

Deploy the CrowdStrike Falcon SIEM Collector to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

1. [Follow these instructions](https://www.crowdstrike.com/blog/tech-center/integrate-with-your-siem/) to deploy the SIEM Collector and forward syslog
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.


## CyberArk Enterprise Password Vault (EPV) Events

On the EPV configure the dbparm.ini to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machines IP address.


## Delinea Secret Server

Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.


## ExtraHop Reveal(x)

1.  Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine IP address.
2. Follow the directions to install the [ExtraHop Detection SIEM Connector bundle](https://aka.ms/asi-syslog-extrahop-forwarding) on your Reveal(x) system. The SIEM Connector is required for this integration.
3. Enable the trigger for **ExtraHop Detection SIEM Connector - CEF**
4. Update the trigger with the ODS syslog targets you created 
5. The Reveal(x) system formats syslog messages in Common Event Format (CEF) and then sends data to Microsoft Sentinel.


## F5 Networks

Configure F5 to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to [F5 Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding), follow the instructions to set up remote logging, using the following guidelines:

1.  Set the  **Remote storage type**  to CEF.
2.  Set the  **Protocol setting**  to UDP.
3.  Set the  **IP address**  to the Syslog server IP address.
4.  Set the  **port number**  to 514, or the port your agent uses.
5.  Set the  **facility**  to the one that you configured in the Syslog agent (by default, the agent sets this to local4).
6.  You can set the  **Maximum Query String Size**  to be the same as you configured.


## FireEye Network Security

Complete the following steps to send data using CEF:

1. Log into the FireEye appliance with an administrator account
2. Click **Settings**
3. Click **Notifications**
Click **rsyslog**
4. Check the **Event type** check box
5. Make sure Rsyslog settings are:

   - Default format: CEF
   - Default delivery: Per event
   - Default send as: Alert


## Forcepoint CASB

Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.


## Forcepoint CSG

The integration is made available with two implementations options:

1. Leverages docker images where the integration component is already installed with all necessary dependencies.
Follow the instructions provided in the Integration Guide linked below.
[Integration Guide >](https://frcpnt.com/csg-sentinel).

2. Requires the manual deployment of the integration component inside a clean Linux machine.
Follow the instructions provided in the Integration Guide  linked below.
[Integration Guide >](https://frcpnt.com/csg-sentinel).


## Forcepoint NGFW

Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.


## ForgeRock Common Audit for CEF

In ForgeRock, install and configure this Common Audit (CAUD) for Azure Sentinel per the documentation at https://github.com/javaservlets/SentinelAuditEventHandler. Next, in Azure, follow the below CEF steps.


## iboss

Set your Threat Console to send Syslog messages in CEF format to your Azure workspace. Make note of your Workspace ID and Primary Key within your Log Analytics Workspace (Select the workspace from the Log Analytics workspaces menu in the Azure portal. Then select Agents management in the Settings section). 

1. Navigate to Reporting & Analytics inside your iboss Console

2. Select Log Forwarding -> Forward From Reporter

3. Select Actions -> Add Service

4. Toggle to Microsoft Sentinel as a Service Type and input your Workspace ID/Primary Key along with other criteria. If a dedicated proxy Linux machine has been configured, toggle to Syslog as a Service Type and configure the settings to point to your dedicated proxy Linux machine

5. Wait one to two minutes for the setup to complete

6. Select your Microsoft Sentinel Service and verify the Sentinel Setup Status is Successful. If a dedicated proxy Linux machine has been configured, you may proceed with validating your connection


## Illumio Core

Configure Event Format

1. From the PCE web console menu, choose **Settings > Event Settings** to view your current settings.
2. Click **Edit** to change the settings.
3. Set **Event Format** to CEF.
4. (Optional) Configure **Event Severity** and **Retention Period**.

Configure event forwarding to an external syslog server

1. From the PCE web console menu, choose **Settings > Event Settings**.
2. Click **Add**.
3. Click **Add Repository**.
4. Complete the **Add Repository** dialog.
5. Click **OK** to save the event forwarding configuration.


## Illusive Platform

1. Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.
2. Log onto the Illusive Console, and navigate to Settings->Reporting.
3. Find Syslog Servers
4. Supply the following information:
   - Host name: Linux Syslog agent IP address or FQDN host name
   - Port: 514
   - Protocol: TCP
   - Audit messages: Send audit messages to server
5. To add the syslog server, click Add.
6. For more information about how to add a new syslog server in the Illusive platform, please find the Illusive Networks Admin Guide in [here](https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version)


## Imperva WAF Gateway

This connector requires an Action Interface and Action Set to be created on the Imperva SecureSphere MX.  [Follow the steps](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert) to create the requirements. 

1. Create a new Action Interface that contains the required parameters to send WAF alerts to Azure Sentinel.

2. Create a new Action Set that uses the Action Interface configured.

3. Apply the Action Set to any Security Policies you wish to have alerts for sent to Azure Sentinel.


## Infoblox Cloud Data Connector

Follow the steps below to configure the Infoblox CDC to send BloxOne data to Microsoft Sentinel via the Linux Syslog agent.

1. Navigate to **Manage > Data Connector**.
2. Click the **Destination Configuration** tab at the top.
3. Click **Create > Syslog**. 
   - **Name**: Give the new Destination a meaningful **name**, such as **Microsoft-Sentinel-Destination**.
   - **Description**: Optionally give it a meaningful **description**.
   - **State**: Set the state to **Enabled**.
   - **Format**: Set the format to **CEF**.
   - **FQDN/IP**: Enter the IP address of the Linux device on which the Linux agent is installed.
   - **Port**: Leave the port number at **514**.
   - **Protocol**: Select desired protocol and CA certificate if applicable.
   - Click **Save & Close**.
4. Click the **Traffic Flow Configuration** tab at the top.
5. Click **Create**.
   - **Name**: Give the new Traffic Flow a meaningful **name**, such as **Microsoft-Sentinel-Flow**.
   - **Description**: Optionally give it a meaningful **description**. 
   - **State**: Set the state to **Enabled**. 
   - Expand the **Service Instance** section. 
      - **Service Instance**: Select your desired Service Instance for which the Data Connector service is enabled. 
   - Expand the **Source Configuration** section.  
      - **Source**: Select **BloxOne Cloud Source**. 
      - Select all desired **log types** you wish to collect. Currently supported log types are:
        - Threat Defense Query/Response Log
        - Threat Defense Threat Feeds Hits Log
        - DDI Query/Response Log
        - DDI DHCP Lease Log
   - Expand the **Destination Configuration** section.  
      - Select the **Destination** you just created. 
   - Click **Save & Close**. 
6. Allow the configuration some time to activate.


## Infoblox SOC Insights

Follow the steps below to configure the Infoblox CDC to send BloxOne data to Microsoft Sentinel via the Linux Syslog agent.

1. Navigate to **Manage > Data Connector**.
2. Click the **Destination Configuration** tab at the top.
3. Click **Create > Syslog**. 
   - **Name**: Give the new Destination a meaningful **name**, such as **Microsoft-Sentinel-Destination**.
   - **Description**: Optionally give it a meaningful **description**.
   - **State**: Set the state to **Enabled**.
   - **Format**: Set the format to **CEF**.
   - **FQDN/IP**: Enter the IP address of the Linux device on which the Linux agent is installed.
   - **Port**: Leave the port number at **514**.
   - **Protocol**: Select desired protocol and CA certificate if applicable.
   - Click **Save & Close**.
4. Click the **Traffic Flow Configuration** tab at the top.
5. Click **Create**.
   - **Name**: Give the new Traffic Flow a meaningful **name**, such as **Microsoft-Sentinel-Flow**.
   - **Description**: Optionally give it a meaningful **description**. 
   - **State**: Set the state to **Enabled**. 
   - Expand the **Service Instance** section. 
      - **Service Instance**: Select your desired Service Instance for which the Data Connector service is enabled. 
   - Expand the **Source Configuration** section.  
      - **Source**: Select **BloxOne Cloud Source**. 
      - Select the **Internal Notifications** Log Type.
   - Expand the **Destination Configuration** section.  
      - Select the **Destination** you just created. 
   - Click **Save & Close**. 
6. Allow the configuration some time to activate.


## KasperskySecurityCenter

 [Follow the instructions](https://support.kaspersky.com/KSC/13/en-US/89277.htm) to configure event export from Kaspersky Security Center.


## Morphisec

 Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.


## Netwrix Auditor

 [Follow the instructions](https://www.netwrix.com/download/QuickStart/Netwrix_Auditor_Add-on_for_HPE_ArcSight_Quick_Start_Guide.pdf) to configure event export from Netwrix Auditor.


## NozomiNetworks

 Follow these steps to configure Nozomi Networks device for sending Alerts, Audit Logs, Health Logs log via syslog in CEF format:

1. Log in to the Guardian console.

2. Navigate to Administration->Data Integration, press +Add and select the Common Event Format (CEF) from the drop down

3. Create New Endpoint using the appropriate host information and enable Alerts, Audit Logs, Health Logs for sending.


## Onapsis Platform

Refer to the Onapsis in-product help to set up log forwarding to the Syslog agent.

1. Go to Setup > Third-party integrations > Defend Alarms and follow the instructions for Microsoft Sentinel.

2. Make sure your Onapsis Console can reach the proxy machine where the agent is installed - logs should be sent to port 514 using TCP.


## OSSEC

[Follow these steps](https://www.ossec.net/docs/docs/manual/output/syslog-output.html) to configure OSSEC sending alerts via syslog.


## Palo Alto - XDR (Cortex)


1. Go to [Cortex Settings and Configurations](https://inspira.xdr.in.paloaltonetworks.com/configuration/external-alerting) and Click to add New Server under External Applications.

2. Then specify the name and Give public IP of your syslog server in Destination. 

3. Give Port number as 514 and from Facility field select FAC_SYSLOG from dropdown. 

4. Select Protocol as UDP and hit Create.


## PaloAlto-PAN-OS

Configure Palo Alto Networks to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

Go to [configure Palo Alto Networks NGFW for sending CEF events.](https://aka.ms/sentinel-paloaltonetworks-readme)

Go to [Palo Alto CEF Configuration](https://aka.ms/asi-syslog-paloalto-forwarding)  and Palo Alto [Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure)  steps 2, 3, choose your version, and follow the instructions using the following guidelines:

 1.  Set the Syslog server format to  **BSD**.

 2.  The copy/paste operations from the PDF might change the text and insert random characters. To avoid this, copy the text to an editor and remove any characters that might break the log format before pasting it.

[Learn more](https://aka.ms/CEFPaloAlto)


## PaloAltoCDL

[Follow the instructions](https://docs.paloaltonetworks.com/cortex/cortex-data-lake/cortex-data-lake-getting-started/get-started-with-log-forwarding-app/forward-logs-from-logging-service-to-syslog-server.html) to configure logs forwarding from Cortex Data Lake to a Syslog Server.


## PingFederate

[Follow these steps](https://docs.pingidentity.com/bundle/pingfederate-102/page/gsn1564002980953.html) to configure PingFederate sending audit log via syslog in CEF format.


## RidgeSecurity

Configure the RidgeBot to forward events to syslog server as described [here](https://portal.ridgesecurity.ai/downloadurl/89x72912). Generate some attack events for your application.

## SonicWall Firewall

Set your SonicWall Firewall to send Syslog messages in CEF format to the proxy machine. Make sure you send the logs to port 514 TCP on the machine's IP address.

Follow Instructions . Then Make sure you select local use 4 as the facility. Then select ArcSight as the Syslog format.

## Trend Micro Apex One

[Follow these steps](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/detections/logs_001/syslog-forwarding.aspx) to configure Apex Central sending alerts via syslog. While configuring, on step 6, select the log format **CEF**.


## Trend Micro Deep Security

1. Set your security solution to send Syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine's IP address.
2. Forward Trend Micro Deep Security events to the Syslog agent.
3. Define a new Syslog Configuration that uses the CEF format by referencing [this knowledge article](https://aka.ms/Sentinel-trendmicro-kblink)  for additional information.
4. Configure the Deep Security Manager to use this new configuration to forward events to the Syslog agent using [these instructions](https://aka.ms/Sentinel-trendMicro-connectorInstructions).
5. Make sure to save the [TrendMicroDeepSecurity](https://aka.ms/TrendMicroDeepSecurityFunction) function so that it queries the Trend Micro Deep Security data properly.


## Trend Micro TippingPoint

Set your TippingPoint SMS to send Syslog messages in ArcSight CEF Format v4.2 format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.


## vArmour Application Controller

1. Send Syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

2. Download the user guide from https://support.varmour.com/hc/en-us/articles/360057444831-vArmour-Application-Controller-6-0-User-Guide.

3. In the user guide - refer to "Configuring Syslog for Monitoring and Violations" and follow steps 1 to 3.


## Vectra AI Detect

Configure Vectra (X Series) Agent to forward Syslog messages in CEF format to your Microsoft Sentinel workspace via the Syslog agent.

From the Vectra UI, navigate to Settings > Notifications and Edit Syslog configuration. Follow below instructions to set up the connection:

1. Add a new Destination (which is the host where the Microsoft Sentinel Syslog Agent is running)

1. Set the Port as **514**

1. Set the Protocol as **UDP**

1. Set the format to **CEF**

1. Set Log types (Select all log types available)

1. Click on **Save**

User can click the **Test** button to force send some test events.

For more information, refer to Cognito Detect Syslog Guide which can be downloaded from the resource page in Detect UI.


## Votiro

Set Votiro Endpoints to send Syslog messages in CEF format to the Forwarder machine. Make sure you to send the logs to port 514 TCP on the Forwarder machine's IP address.


## WireX Network Forensics Platform

Contact [WireX support](https://wirexsystems.com/contact-us/) in order to configure your NFP solution to send Syslog messages in CEF format to the proxy machine. Make sure that they central manager can send the logs to port 514 TCP on the machine's IP address.


## WithSecure Elements via Connector

Connect your WithSecure Elements Connector to Microsoft Sentinel

This article explains how to connect your WithSecure Elements Connector appliance to Microsoft Sentinel. The WithSecure Elements Connector data connector allows you to easily connect your WithSecure Elements logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation.

> [!NOTE]
> Data will be stored in the geographic location of the workspace on which you are running Microsoft Sentinel.

Forward WithSecure Elements logs to the Syslog agent

Configure With Secure Elements Connector to forward Syslog messages in CEF format to your Log Analytics workspace via the Syslog agent.

1. Select or create a Linux machine that Microsoft Sentinel will use as the proxy between your WithSecurity solution and Sentinel. The machine can be on-prem environment, Microsoft Azure or other cloud based. Linux needs to have `syslog-ng` and `python`/`python3` installed.
2. Install the Microsoft Monitoring Agent on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP. You must have elevated permissions (sudo) on your machine.
3. Go to EPP in WithSecure Elements Portal. Then navigate to Downloads and in Elements Connector section click 'Create subscription key' button. You can check Your subscription key in Subscriptions.
4. In Downloads in WithSecure Elements Connector section select correct installer and download it.
5. When in EPP open account settings in top right corner. Then select Get management API key. If key has been created earlier it can be read there as well.
6. To install Elements Connector follow [Elements Connector Docs](https://help.f-secure.com/product.html#business/connector/latest/en/concept_BA55FDB13ABA44A8B16E9421713F4913-latest-en).
7. If api access has not been configured during installation follow [Configuring API access for Elements Connector](https://help.f-secure.com/product.html#business/connector/latest/en/task_F657F4D0F2144CD5913EE510E155E234-latest-en).
8. Go to EPP, then Profiles, then use For Connector from where you can see the connector profiles. Create a new profile (or edit an existing not read-only profile). In Event forwarding enable it. SIEM system address: **127.0.0.1:514**. Set format to **Common Event Format**. Protocol is **TCP**. Save profile and assign it to Elements Connector in Devices tab.
9. To use the relevant schema in Log Analytics for the WithSecure Elements Connector, search for CommonSecurityLog.
10. Continue with [validating your CEF connectivity](https://docs.microsoft.com/azure/sentinel/troubleshooting-cef-syslog?tabs=rsyslog#validate-cef-connectivity).


## Zscaler

Set Zscaler product to send Syslog messages in CEF format to your Syslog agent. Make sure you to send the logs on port 514 TCP. 

Go to [Zscaler Microsoft Sentinel integration guide](https://aka.ms/ZscalerCEFInstructions) to learn more.


## Related content

- [Ingest Syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md)
- [Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md)

