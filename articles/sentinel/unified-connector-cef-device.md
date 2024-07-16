---
title: CEF via AMA connector - Configure appliances and devices
description: Learn how to configure specific devices that use the Common Event Format (CEF) via AMA data connector for Microsoft Sentinel.
author: cwatson-cat
ms.author: cwatson
ms.topic: reference
ms.custom: linux-related-content
ms.date: 06/27/2024
---

#  CEF via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion

Log collection from many security appliances and devices  are supported by the **Common Event Format (CEF) via AMA** data connector in Microsoft Sentinel. This article lists  provider supplied installation instructions for specific security appliances and devices that use this data connector. Contact the provider for updates, more information, or where information is unavailable for your security appliance or device.

To forward data to your Log Analytics workspace for Microsoft Sentinel, complete the steps in [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md). As you complete those steps, install the **Common Event Format (CEF) via AMA** data connector in Microsoft Sentinel. Then, use the appropriate provider's instructions in this article to complete the setup.

For more information about the related Microsoft Sentinel solution for each of these appliances or devices, search the [Azure Marketplace](https://azuremarketplace.microsoft.com/) for the **Product Type** > **Solution Templates** or review the solution from the **Content hub** in Microsoft Sentinel.

## AI Analyst Darktrace

Configure Darktrace to forward syslog messages in CEF format to your Azure workspace via the syslog agent. 

1. Within the Darktrace Threat Visualizer, navigate to the **System Config** page in the main menu under **Admin**. 
1. From the left-hand menu, select **Modules** and choose Microsoft Sentinel from the available **Workflow Integrations**.
1. Locate Microsoft Sentinel syslog CEF and select **New** to reveal the configuration settings, unless already exposed. 
1. In the **Server** configuration field, enter the location of the log forwarder and optionally modify the communication port. Ensure that the port selected is set to 514 and is allowed by any intermediary firewalls.
1. Configure any alert thresholds, time offsets or other settings as required. 
1. Review any other configuration options you might wish to enable that alter the syslog syntax. 
1. Enable **Send Alerts** and save your changes.

## Akamai Security Events

[Follow these steps](https://developer.akamai.com/tools/integrations/siem) to configure Akamai CEF connector to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

## AristaAwakeSecurity

Complete the following steps to forward Awake Adversarial Model match results to a CEF collector listening on TCP port 514 at IP **192.168.0.1**:

1. Navigate to the **Detection Management Skills** page in the Awake UI.
1. Select **+ Add New Skill**.
1. Set **Expression** to `integrations.cef.tcp { destination: "192.168.0.1", port: 514, secure: false, severity: Warning }`
1. Set **Title** to a descriptive name like, *Forward Awake Adversarial Model match result to Microsoft Sentinel*.
1. Set **Reference Identifier** to something easily discoverable like, *integrations.cef.sentinel-forwarder*.
1. Select **Save**.

Within a few minutes of saving the definition and other fields, the system begins to send new model match results to the CEF events collector as they're detected.

For more information, see the **Adding a Security Information and Event Management Push Integration** page from the **Help Documentation** in the Awake UI.

## Aruba ClearPass

Configure Aruba ClearPass to forward syslog messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

1. [Follow these instructions](https://www.arubanetworks.com/techdocs/ClearPass/6.7/PolicyManager/Content/CPPM_UserGuide/Admin/syslogExportFilters_add_syslog_filter_general.htm) to configure the Aruba ClearPass to forward syslog.
2. Use the IP address or hostname for the Linux device with the Linux agent installed as the **Destination IP** address.

## Barracuda WAF

The Barracuda Web Application Firewall can integrate with and export logs directly to Microsoft Sentinel via the Azure Monitoring Agent (AMA).​

1. Go to [Barracuda WAF configuration](https://aka.ms/asi-barracuda-connector), and follow the instructions, using the following parameters to set up the connection.

1. Web Firewall logs facility: Go to the advanced settings for your workspace and on the **Data** > **Syslog** tabs. Make sure that the facility exists.​

Notice that the data from all regions are stored in the selected workspace.

## Broadcom SymantecDLP

Configure Symantec DLP to forward syslog messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

1. [Follow these instructions](https://knowledge.broadcom.com/external/article/159509/generating-syslog-messages-from-data-los.html) to configure the Symantec DLP to forward syslog
1. Use the IP address or hostname for the Linux device with the Linux agent installed as the **Destination IP** address.

## Cisco Firepower EStreamer

Install and configure the Firepower eNcore eStreamer client. For more information, see the full install [guide](https://www.cisco.com/c/en/us/td/docs/security/firepower/670/api/eStreamer_enCore/eStreamereNcoreSentinelOperationsGuide_409.html).

## CiscoSEG

Complete the following steps to configure Cisco Secure Email Gateway to forward logs via syslog:

1. Configure [Log Subscription](https://www.cisco.com/c/en/us/td/docs/security/esa/esa14-0/user_guide/b_ESA_Admin_Guide_14-0/b_ESA_Admin_Guide_12_1_chapter_0100111.html#con_1134718).
1. Select **Consolidated Event Logs** in Log Type field.

## Citrix Web App Firewall

Configure Citrix WAF to send syslog messages in CEF format to the proxy machine. 

- Find guides to configure WAF and CEF logs from [Citrix Support](https://support.citrix.com/).

- Follow [this guide](https://docs.citrix.com/en-us/citrix-adc/13/system/audit-logging/configuring-audit-logging.html) to forward the logs to proxy. Make sure you to send the logs to port 514 TCP on the Linux machine's IP address.

## Claroty

Configure log forwarding using CEF.

1. Navigate to the **Syslog** section of the Configuration menu.
1. Select **+Add**.
1. In the **Add New Syslog Dialog** specify **Remote Server IP**, **Port**, **Protocol**.
1. Select **Message Format** - **CEF**.
1. Choose **Save** to exit the **Add Syslog dialog**.

## Contrast Protect

Configure the Contrast Protect agent to forward events to syslog as described here: https://docs.contrastsecurity.com/en/output-to-syslog.html. Generate some attack events for your application.

## CrowdStrike Falcon

Deploy the CrowdStrike Falcon SIEM Collector to forward syslog messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

1. [Follow these instructions](https://www.crowdstrike.com/blog/tech-center/integrate-with-your-siem/) to deploy the **SIEM Collector** and forward syslog.
1. Use the IP address or hostname for the Linux device with the Linux agent installed as the Destination IP address.

## CyberArk Enterprise Password Vault (EPV) Events

On the EPV, configure the dbparm.ini to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machines IP address.

## Delinea Secret Server

Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

## ExtraHop Reveal(x)

Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine IP address.

1. Follow the directions to install the [ExtraHop Detection SIEM Connector bundle](https://learn.extrahop.com/extrahop-detection-siem-connector-bundle) on your Reveal(x) system. The **SIEM Connector** is required for this integration.
1. Enable the trigger for **ExtraHop Detection SIEM Connector - CEF**.
1. Update the trigger with the ODS syslog targets you created. 

The Reveal(x) system formats syslog messages in Common Event Format (CEF) and then sends data to Microsoft Sentinel.

## F5 Networks

Configure F5 to forward syslog messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

Go to [F5 Configuring Application Security Event Logging](https://aka.ms/asi-syslog-f5-forwarding), follow the instructions to set up remote logging, using the following guidelines:

1. Set the  **Remote storage type**  to **CEF**.
1. Set the  **Protocol setting**  to **UDP**.
1. Set the  **IP address**  to the syslog server IP address.
1. Set the  **port number**  to **514**, or the port your agent uses.
1. Set the  **facility**  to the one that you configured in the syslog agent. By default, the agent sets this value to **local4**.
1. You can set the  **Maximum Query String Size**  to be the same as you configured.

## FireEye Network Security

Complete the following steps to send data using CEF:

1. Sign into the FireEye appliance with an administrator account.
1. Select **Settings**.
1. Select **Notifications**. Select **rsyslog**.
1. Check the **Event type** check box.
1. Make sure Rsyslog settings are:

   - Default format: **CEF**
   - Default delivery: **Per event**
   - Default send as: **Alert**

## Forcepoint CASB

Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

## Forcepoint CSG

The integration is made available with two implementations options:

1. Uses docker images where the integration component is already installed with all necessary dependencies.
Follow the instructions provided in the [Integration Guide](https://frcpnt.com/csg-sentinel).
1. Requires the manual deployment of the integration component inside a clean Linux machine. Follow the instructions provided in the [Integration Guide](https://frcpnt.com/csg-sentinel).

## Forcepoint NGFW

Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

## ForgeRock Common Audit for CEF

In ForgeRock, install and configure this Common Audit (CAUD) for Microsoft Sentinel per the documentation at https://github.com/javaservlets/SentinelAuditEventHandler. Next, in Azure, follow the steps to configure the CEF via AMA data connector.

## iboss

Set your Threat Console to send syslog messages in CEF format to your Azure workspace. Make note of your **Workspace ID** and **Primary Key** within your Log Analytics workspace. Select the workspace from the Log Analytics workspaces menu in the Azure portal. Then select **Agents management** in the **Settings** section. 

1. Navigate to **Reporting & Analytics** inside your iboss Console.
1. Select **Log Forwarding** > **Forward From Reporter**.
1. Select **Actions** > **Add Service**.
1. Toggle to Microsoft Sentinel as a **Service Type** and input your **Workspace ID/Primary Key** along with other criteria. If a dedicated proxy Linux machine was configured, toggle to **Syslog** as a **Service Type** and configure the settings to point to your dedicated proxy Linux machine.
1. Wait one to two minutes for the setup to complete.
1. Select your Microsoft Sentinel service and verify the Microsoft Sentinel setup status is successful. If a dedicated proxy Linux machine is configured, you might validate your connection.

## Illumio Core

Configure event format.

1. From the PCE web console menu, choose **Settings > Event Settings** to view your current settings.
1. Select **Edit** to change the settings.
1. Set **Event Format** to CEF.
1. (Optional) Configure **Event Severity** and **Retention Period**.

Configure event forwarding to an external syslog server.

1. From the PCE web console menu, choose **Settings** > **Event Settings**.
1. Select **Add**.
1. Select **Add Repository**.
1. Complete the **Add Repository** dialog.
1. Select **OK** to save the event forwarding configuration.

## Illusive Platform

1. Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

1. Sign into the Illusive Console, and navigate to **Settings** > **Reporting**.
1. Find **Syslog Servers**.
1. Supply the following information:

    - Host name: *Linux Syslog agent IP address or FQDN host name*
    - Port: *514*
    - Protocol: *TCP*
    - Audit messages: *Send audit messages to server*

1. To add the syslog server, select **Add**.

For more information about how to add a new syslog server in the Illusive platform, find the Illusive Networks Admin Guide in here: https://support.illusivenetworks.com/hc/en-us/sections/360002292119-Documentation-by-Version

## Imperva WAF Gateway

This connector requires an **Action Interface** and **Action Set** to be created on the Imperva SecureSphere MX.  [Follow the steps](https://community.imperva.com/blogs/craig-burlingame1/2020/11/13/steps-for-enabling-imperva-waf-gateway-alert) to create the requirements.

1. Create a new **Action Interface** that contains the required parameters to send WAF alerts to Microsoft Sentinel.
1. Create a new **Action Set** that uses the **Action Interface** configured.
1. Apply the Action Set to any security policies you wish to have alerts for sent to Microsoft Sentinel.

## Infoblox Cloud Data Connector

Complete the following steps to configure the Infoblox CDC to send BloxOne data to Microsoft Sentinel via the Linux syslog agent.

1. Navigate to **Manage** > **Data Connector**.
1. Select the **Destination Configuration** tab at the top.
1. Select **Create > Syslog**. 
   - **Name**: Give the new Destination a meaningful name, such as *Microsoft-Sentinel-Destination*.
   - **Description**: Optionally give it a meaningful description.
   - **State**: Set the state to **Enabled**.
   - **Format**: Set the format to **CEF**.
   - **FQDN/IP**: Enter the IP address of the Linux device on which the Linux agent is installed.
   - **Port**: Leave the port number at **514**.
   - **Protocol**: Select desired protocol and CA certificate if applicable.
   - Select **Save & Close**.
1. Select the **Traffic Flow Configuration** tab at the top.
1. Select **Create**.
   - **Name**: Give the new Traffic Flow a meaningful name, such as *Microsoft-Sentinel-Flow*.
   - **Description**: Optionally give it a meaningful description. 
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
      - Select the **Destination** you created. 
   - Select **Save & Close**. 
1. Allow the configuration some time to activate.

## Infoblox SOC Insights

Complete the following steps to configure the Infoblox CDC to send BloxOne data to Microsoft Sentinel via the Linux syslog agent.

1. Navigate to **Manage > Data Connector**.
1. Select the **Destination Configuration** tab at the top.
1. Select **Create > Syslog**. 
   - **Name**: Give the new Destination a meaningful name, such as *Microsoft-Sentinel-Destination*.
   - **Description**: Optionally give it a meaningful description.
   - **State**: Set the state to **Enabled**.
   - **Format**: Set the format to **CEF**.
   - **FQDN/IP**: Enter the IP address of the Linux device on which the Linux agent is installed.
   - **Port**: Leave the port number at **514**.
   - **Protocol**: Select desired protocol and CA certificate if applicable.
   - Select **Save & Close**.
1. Select the **Traffic Flow Configuration** tab at the top.
1. Select **Create**.
   - **Name**: Give the new Traffic Flow a meaningful name, such as *Microsoft-Sentinel-Flow*.
   - **Description**: Optionally give it a meaningful **description**. 
   - **State**: Set the state to **Enabled**. 
   - Expand the **Service Instance** section. 
      - **Service Instance**: Select your desired service instance for which the data connector service is enabled. 
   - Expand the **Source Configuration** section.  
      - **Source**: Select **BloxOne Cloud Source**. 
      - Select the **Internal Notifications** Log Type.
   - Expand the **Destination Configuration** section.  
      - Select the **Destination** you created. 
   - Select **Save & Close**. 
1. Allow the configuration some time to activate.

## KasperskySecurityCenter

[Follow the instructions](https://support.kaspersky.com/KSC/13/en-US/89277.htm) to configure event export from Kaspersky Security Center.

## Morphisec

Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

## Netwrix Auditor

[Follow the instructions](https://www.netwrix.com/download/QuickStart/Netwrix_Auditor_Add-on_for_HPE_ArcSight_Quick_Start_Guide.pdf) to configure event export from Netwrix Auditor.

## NozomiNetworks

Complete the following steps to configure Nozomi Networks device to send alerts, audit, and health logs via syslog in CEF format:

1. Sign in to the Guardian console.
1. Navigate to **Administration** > **Data Integration**.
1. Select **+Add**.
1. Select the **Common Event Format (CEF)** from the drop-down.
1. Create **New Endpoint** using the appropriate host information.
1. Enable **Alerts**, **Audit Logs**, and **Health Logs** for sending.

## Onapsis Platform

Refer to the Onapsis in-product help to set up log forwarding to the syslog agent.

1. Go to **Setup** > **Third-party integrations** > **Defend Alarms** and follow the instructions for Microsoft Sentinel.

2. Make sure your Onapsis Console can reach the proxy machine where the agent is installed. The logs should be sent to port 514 using TCP.

## OSSEC

[Follow these steps](https://www.ossec.net/docs/docs/manual/output/syslog-output.html) to configure OSSEC sending alerts via syslog.

## Palo Alto - XDR (Cortex)

Configure Palo Alto XDR (Cortex) to forward messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

1. Go to **Cortex Settings and Configurations**.
1. Select to add **New Server** under **External Applications**.
1. Then specify the name and give the public IP of your syslog server in **Destination**.
1. Give **Port number** as 514.
1. From **Facility** field, select **FAC_SYSLOG** from dropdown.
1. Select **Protocol** as **UDP**.
1. Select **Create**.

## PaloAlto-PAN-OS

Configure Palo Alto Networks to forward syslog messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

1. Go to [configure Palo Alto Networks NGFW for sending CEF events](https://aka.ms/sentinel-paloaltonetworks-readme).
1. Go to [Palo Alto CEF Configuration](https://aka.ms/asi-syslog-paloalto-forwarding)  and Palo Alto [Configure Syslog Monitoring](https://aka.ms/asi-syslog-paloalto-configure)  steps 2, 3, choose your version, and follow the instructions using the following guidelines:

   1. Set the **Syslog server format** to  **BSD**.
   1. Copy the text to an editor and remove any characters that might break the log format before pasting it. The copy/paste operations from the PDF might change the text and insert random characters.

[Learn more](https://aka.ms/CEFPaloAlto)

## PaloAltoCDL

[Follow the instructions](https://docs.paloaltonetworks.com/cortex/cortex-data-lake/cortex-data-lake-getting-started/get-started-with-log-forwarding-app/forward-logs-from-logging-service-to-syslog-server.html) to configure logs forwarding from Cortex Data Lake to a syslog Server.

## PingFederate

[Follow these steps](https://docs.pingidentity.com/bundle/pingfederate-102/page/gsn1564002980953.html) to configure PingFederate sending audit log via syslog in CEF format.

## RidgeSecurity

Configure the RidgeBot to forward events to syslog server as described [here](https://portal.ridgesecurity.ai/downloadurl/89x72912). Generate some attack events for your application.

## SonicWall Firewall

Set your SonicWall Firewall to send syslog messages in CEF format to the proxy machine. Make sure you send the logs to port 514 TCP on the machine's IP address.

Follow instructions. Then Make sure you select local use 4 as the facility. Then select ArcSight as the syslog format.

## Trend Micro Apex One

[Follow these steps](https://docs.trendmicro.com/en-us/enterprise/trend-micro-apex-central-2019-online-help/detections/logs_001/syslog-forwarding.aspx) to configure Apex Central sending alerts via syslog. While configuring, on step 6, select the log format **CEF**.

## Trend Micro Deep Security

Set your security solution to send syslog messages in CEF format to the proxy machine. Make sure to send the logs to port 514 TCP on the machine's IP address.

1. Forward Trend Micro Deep Security events to the syslog agent.
1. Define a new syslog Configuration that uses the CEF format by referencing [this knowledge article](https://aka.ms/Sentinel-trendmicro-kblink) for additional information.
1. Configure the **Deep Security Manager** to use this new configuration to forward events to the syslog agent using [these instructions](https://aka.ms/Sentinel-trendMicro-connectorInstructions).
1. Make sure to save the [TrendMicroDeepSecurity](https://aka.ms/TrendMicroDeepSecurityFunction) function so that it queries the Trend Micro Deep Security data properly.

## Trend Micro TippingPoint

Set your TippingPoint SMS to send syslog messages in ArcSight CEF Format v4.2 format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

## vArmour Application Controller

Send syslog messages in CEF format to the proxy machine. Make sure you to send the logs to port 514 TCP on the machine's IP address.

Download the user guide from https://support.varmour.com/hc/en-us/articles/360057444831-vArmour-Application-Controller-6-0-User-Guide. In the user guide, refer to "Configuring Syslog for Monitoring and Violations" and follow steps 1 to 3.

## Vectra AI Detect

Configure Vectra (X Series) Agent to forward syslog messages in CEF format to your Microsoft Sentinel workspace via the syslog agent.

From the Vectra UI, navigate to Settings > Notifications and Edit syslog configuration. Follow below instructions to set up the connection:

1. Add a new Destination (which is the host where the Microsoft Sentinel syslog agent is running).
1. Set the **Port** as *514*.
1. Set the **Protocol** as *UDP*.
1. Set the **format** to *CEF*.
1. Set **Log types**. Select all log types available.
1. Select on **Save**.
1. Select the **Test** button to send some test events.

For more information, see the Cognito Detect Syslog Guide, which can be downloaded from the resource page in Detect UI.

## Votiro

Set Votiro Endpoints to send syslog messages in CEF format to the Forwarder machine. Make sure you to send the logs to port 514 TCP on the Forwarder machine's IP address.

## WireX Network Forensics Platform

Contact WireX support (https://wirexsystems.com/contact-us/) in order to configure your NFP solution to send syslog messages in CEF format to the proxy machine. Make sure that they central manager can send the logs to port 514 TCP on the machine's IP address.

## WithSecure Elements via Connector

Connect your WithSecure Elements Connector appliance to Microsoft Sentinel. The WithSecure Elements Connector data connector allows you to easily connect your WithSecure Elements logs with Microsoft Sentinel, to view dashboards, create custom alerts, and improve investigation.

> [!NOTE]
> Data is stored in the geographic location of the workspace on which you are running Microsoft Sentinel.

Configure With Secure Elements Connector to forward syslog messages in CEF format to your Log Analytics workspace via the syslog agent.

1. Select or create a Linux machine for Microsoft Sentinel to use as the proxy between your WithSecurity solution and Microsoft Sentinel. The machine can be an on-premises environment, Microsoft Azure, or other cloud based environment. Linux needs to have `syslog-ng` and `python`/`python3` installed.
1. Install the Azure Monitoring Agent (AMA) on your Linux machine and configure the machine to listen on the necessary port and forward messages to your Microsoft Sentinel workspace. The CEF collector collects CEF messages on port 514 TCP. You must have elevated permissions (sudo) on your machine.
1. Go to **EPP** in WithSecure Elements Portal. Then navigate to **Downloads**. In **Elements Connector** section, select **Create subscription key**. You can check your subscription key in **Subscriptions**.
1. In **Downloads** in WithSecure Elements **Connector** section, select the correct installer and download it.
1. When in EPP, open account settings from the top right hand corner. Then select **Get management API key**. If the key was created earlier, it can be read there as well.
1. To install Elements Connector, follow [Elements Connector Docs](https://help.f-secure.com/product.html#business/connector/latest/en/concept_BA55FDB13ABA44A8B16E9421713F4913-latest-en).
1. If API access isn't configured during installation, follow [Configuring API access for Elements Connector](https://help.f-secure.com/product.html#business/connector/latest/en/task_F657F4D0F2144CD5913EE510E155E234-latest-en).
1. Go to EPP, then **Profiles**, then use **For Connector** from where you can see the connector profiles. Create a new profile (or edit an existing not read-only profile). In **Event forwarding**, enable it. Set SIEM system address: **127.0.0.1:514**. Set format to **Common Event Format**. Protocol is **TCP**. Save profile and assign it to **Elements Connector** in **Devices** tab.
1. To use the relevant schema in Log Analytics for the WithSecure Elements Connector, search for **CommonSecurityLog**.
1. Continue with [validating your CEF connectivity](/azure/sentinel/troubleshooting-cef-syslog?tabs=rsyslog#validate-cef-connectivity).

## Zscaler

Set Zscaler product to send syslog messages in CEF format to your syslog agent. Make sure you to send the logs on port 514 TCP. 

For more information, see [Zscaler Microsoft Sentinel integration guide](https://aka.ms/ZscalerCEFInstructions).

## Related content

- [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md)
- [Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md)
