---
title: Custom logs via AMA connector - Configure appliances and devices
description: Learn how to configure specific devices that use the Custom Logs via AMA data connector for Microsoft Sentinel.
author: yelevin
ms.author: yelevin
ms.topic: reference
ms.custom: linux-related-content
ms.date: 07/31/2024
---

# Custom Logs via AMA data connector - Configure specific appliance or device for Microsoft Sentinel data ingestion

Microsoft Sentinel's **Custom Logs via AMA** data connector supports log collection from several different network and security appliances and devices. This article supplies the installation instructions that are unique to the specific security appliances and devices that use this data connector, as provided by their manufacturers. Contact the manufacturer for updates, more information, or where information is unavailable for your security appliance or device.

To ingest data from these devices to your Microsoft Sentinel workspace, complete the steps in [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-custom-ama.md). Those steps include the installation of the **Custom Logs via AMA** data connector in Microsoft Sentinel. After the connector is installed, use the instructions appropriate to your device, shown later in this article, to complete the setup.

For more information about the related Microsoft Sentinel solution for each of these appliances or devices, search the [Azure Marketplace](https://azuremarketplace.microsoft.com/) for the **Product Type** > **Solution Templates** or review the solution from the **Content hub** in Microsoft Sentinel.

[!INCLUDE [unified-soc-preview](includes/unified-soc-preview.md)]

## General instructions

The instructions for installing and configuring these data connectors for your devices follow a general pattern:

1. Create the destination table in Log Analytics (or Advanced Hunting if you're in the Defender portal).

    The table's name must end with `_CL` and it must consist of only the following two fields:
    - **TimeGenerated** (of type *DateTime*): the timestamp of the creation of the log message.
    - **Message** (of type *String*): the log message in its entirety.

1. Create the data collection rule (DCR) for your device, according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file)..

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Configure your device to send its logs to the machine where the Azure Monitor Agent is installed.

These general steps (except for the last one) are described in detail in [Ingest syslog, CEF, and custom-format messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-custom-ama.md).

## Specific instructions per device type

The per-device information you need to complete these steps is presented in the rest of this article. Some device types require more specific steps, or extra steps such as data transformations, which are also shown here.

**The following devices' instructions are provided here:**

- [Apache HTTP Server](#apache-http-server)
- [Apache Tomcat](#apache-tomcat)
- [Cisco Meraki](#cisco-meraki)
- [Jboss Enterprise Application platform](#jboss-enterprise-application-platform)
- [JuniperIDP](#juniperidp)
- [MarkLogic Audit](#marklogic-audit)
- [MongoDB Audit](#mongodb-audit)
- [NGINX HTTP Server](#nginx-http-server)
- [Oracle WebLogic Server](#oracle-weblogic-server)
- [PostgreSQL Events](#postgresql-events)
- [SecurityBridge Threat Detection for SAP](#securitybridge-threat-detection-for-sap)
- [SquidProxy](#squidproxy)
- [Ubiquiti UniFi](#ubiquiti-unifi)
- [AI Vectra stream](#ai-vectra-stream)
- [VMware vCenter](#vmware-vcenter)
- [Zscaler Private Access (ZPA)](#zscaler-private-access-zpa)

### Apache HTTP Server

Follow these steps to ingest log messages from Apache HTTP Server:

1. Table name: `ApacheHTTPServer_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"ApacheHTTPServer_CL"`
    - **Log path - Windows**: resources > properties > dataSources > filePatterns: `"C:\Server\bin\log\Apache24\logs\*.log"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/var/log/httpd/*.log"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### Apache Tomcat

Follow these steps to ingest log messages from Apache Tomcat:

1. Table name: `Tomcat_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"Tomcat_CL"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/var/log/tomcat/*.log"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### Cisco Meraki

Follow these steps to ingest log messages from Cisco Meraki:

1. Table name: `meraki_CL`

1. Create a log file and grant it write permissions. ***(TO WHOM? -YL)***

1. Configure a temporary transformation of Meraki logs to text files so the AMA can collect them.

    - **For rsyslog daemon:**
        1. Create custom configuration file for the rsyslog daemon, with the following filtering conditions:

            ```bash
            if $rawmsg contains "flows" then {
                action(type="omfile" file="<LOG_FILE_Name>")
                stop
            }
            if $rawmsg contains "urls" then { 
                action(type="omfile" file="<LOG_FILE_Name>") 
                stop 
            } 
            if $rawmsg contains "ids-alerts" then { 
                action(type="omfile" file="<LOG_FILE_Name>") 
                stop 
            } 
            if $rawmsg contains "events" then { 
                action(type="omfile" file="<LOG_FILE_Name>") 
                stop 
            } 
            if $rawmsg contains "ip_flow_start" then { 
                action(type="omfile" file="<LOG_FILE_Name>") 
                stop 
            } 
            if $rawmsg contains "ip_flow_end" then { 
                action(type="omfile" file="<LOG_FILE_Name>") 
                stop 
            }
            ```
            (Replace `<LOG_FILE_Name>` with the name of the log file you created.)

        1. Restart rsyslog. The typical command syntax is `systemctl restart rsyslog`.

    - **For syslog-ng daemon:**
        1. Edit the config file `/etc/syslog-ng/conf.d`, adding the following conditions:
        
            ```bash
            filter f_meraki {
                message("flows") or message("urls") or message("ids-alerts") or message("events") or message("ip_flow_start") or message("ip_flow_end"); 
            }; 
             
            destination d_meraki { 
                file("<LOG_FILE_NAME>"); 
            }; 

            log { 
                source(s_src); 
                filter(f_meraki); 
                destination(d_meraki); 
                flags(final); #Ensures that once a message matches the filter and is written to the specified destination, it will not be processed by subsequent log statements 
            }; 
            ```
            (Replace `<LOG_FILE_NAME>` with the name of the log file you created.)

        1. Restart syslog-ng. The typical command syntax is `systemctl restart syslog-ng`.

1. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the following keys in the DCR with the values as shown in the sample JSON:
    - streamDeclarations > columns
    - transformKql
    - outputStream
    ```json
    {
       "resources": [
          {
             "properties": {
                "streamDeclarations": {
                   "Custom-Text-stream": {
                      "columns": [
                            {
                               "name": "TimeGenerated",
                               "type": "datetime"
                            },
                            {
                               "name": "Message",
                               "type": "string"
                            },
                      ]
                   }
                },
                "dataFlows": [
                   {
                      "transformKql": "source | project-rename Message=RawData",
                      "outputStream": "meraki_CL"
                   }
                ]
             }
          }
       ]
    }
    ```

1. Deploy Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Configure and connect the Cisco Meraki device(s): follow the [instructions provided by Cisco](https://documentation.meraki.com/General_Administration/Monitoring_and_Reporting/Meraki_Device_Reporting_-_Syslog%2C_SNMP%2C_and_API) for sending syslog messages. Use the IP address or hostname of the virtual machine where the Azure Monitor Agent is installed. 

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### JBoss Enterprise Application platform

Follow these steps to ingest log messages from JBoss Enterprise Application platform:

1. Table name: `JBossLogs_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"JBossLogs_CL"`

1. Deploy Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### JuniperIDP

Follow these steps to ingest log messages from JuniperIDP:

1. Table name: `JuniperIDP_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"JuniperIDP_CL"`

1. Deploy Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### MarkLogic Audit

Follow these steps to ingest log messages from MarkLogic Audit:

1. Table name: `MarkLogicAudit_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"MarkLogicAudit_CL"`
    - **Log path - Windows**: resources > properties > dataSources > filePatterns: `"C:\Program Files\MarkLogic\Data\Logs\AuditLog.txt"`
    - **Log path - RedHat Linux**: resources > properties > dataSources > filePatterns: `"/var/opt/MarkLogic/Logs/AuditLog.txt"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Configure MarkLogic Audit to enable it to write logs: (from MarkLogic documentation)
    1. Using your browser, navigate to MarkLogic Admin interface.
    1. Open the Audit Configuration screen under Groups > group_name > Auditing.
    1. Mark the Audit Enabled radio button. Make sure it is enabled.
    1. Configure audit event and/or restrictions desired.
    1. Validate by selecting OK.
    1. Refer to MarkLogic documentation for [more details and configuration options](https://docs.marklogic.com/guide/admin/auditing).

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### MongoDB Audit

Follow these steps to ingest log messages from MongoDB Audit:

1. Table name: `MongoDBAudit_CL`

1. Data collection rule (DCR): Logs can be stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file). As a resource, choose the machine where MongoDB is installed.

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"MongoDBAudit_CL"`
    - **Log path - Windows**: resources > properties > dataSources > filePatterns: `"C:\data\db\auditlog.json"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/data/db/auditlog.json"`

1. Deploy the Azure Monitor Agent to the machine where MongoDB is installed.

1. Configure MongoDB to write logs:
    1. For Windows, edit the configuration file `mongod.cfg`. For Linux, `mongod.conf`.
    1. Set the `dbpath` parameter to `data/db`.
    1. Set the `path` parameter to `/data/db/auditlog.json`.
    1. Refer to MongoDB documentation for [more parameters and details](https://www.mongodb.com/docs/manual/tutorial/configure-auditing/).

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### NGINX HTTP Server

Follow these steps to ingest log messages from NGINX HTTP Server:

1. Table name: `NGINX_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"NGINX_CL"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/var/log/nginx.log"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### Oracle WebLogic Server 

Follow these steps to ingest log messages from Oracle WebLogic Server:

1. Table name: `OracleWebLogicServer_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"OracleWebLogicServer_CL"`
    - **Log path - Windows**: resources > properties > dataSources > filePatterns: `"<DOMAIN_NAME>\Servers\<SERVER_NAME>\logs*.log"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"<DOMAIN_HOME>/servers/server_name/logs/*.log"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### PostgreSQL Events

Follow these steps to ingest log messages from PostgreSQL Events:

1. Table name: `PostgreSQL_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"PostgreSQL_CL"`
    - **Log path - Windows**: resources > properties > dataSources > filePatterns: `"C:\*.log"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/var/log/*.log"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Edit the PostgreSQL Events configuration file `postgresql.conf` to output logs to files.
    1. Set `log_destination='stderr'`
    1. Set `logging_collector=on`
    1. Refer to PostgreSQL documentation for [more parameters and details](https://www.postgresql.org/docs/current/runtime-config-logging.html).

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### SecurityBridge Threat Detection for SAP

Follow these steps to ingest log messages from SecurityBridge Threat Detection for SAP:

1. Table name: `SecurityBridgeLogs_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"SecurityBridgeLogs_CL"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/usr/sap/tmp/sb_events/*.cef"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### SquidProxy

Follow these steps to ingest log messages from SquidProxy:

1. Table name: `SquidProxy_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"SquidProxy_CL"`
    - **Log path - Windows**: resources > properties > dataSources > filePatterns: `"C:\Squid\var\log\squid\*.log"`
    - **Log path - Linux**: resources > properties > dataSources > filePatterns: `"/var/log/squid/*.log"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### Ubiquiti UniFi

Follow these steps to ingest log messages from Ubiquiti UniFi:

1. Table name: `Ubiquiti_CL`

1. Create a log file and grant it write permissions. ***(TO WHOM? -YL)***

1. Configure a temporary transformation of Ubiquiti logs to text files so the AMA can collect them.

    - **For rsyslog daemon:**
        1. Create custom configuration file for the rsyslog daemon, in the `/etc/rsyslog.d/` folder, with the following filtering conditions:

            ```bash
             # Define a new ruleset
            ruleset(name="<RULESET_NAME>") { 
                action(type="omfile" file="<LOG_FILE_NAME>") 
            } 
             
             # Set the input on port and bind it to the new ruleset 
            input(type="imudp" port="<PORT>" ruleset="<RULESET_NAME>") 
            ```
            (Replace `<parameters>` with the actual names of the objects represented.)

        1. Restart rsyslog. The typical command syntax is `systemctl restart rsyslog`.

    - **For syslog-ng daemon:**
        1. Edit the config file `/etc/syslog-ng/conf.d`, adding the following conditions:

            ```bash
            sources_network {
                network ( 
                    ip(“0.0.0.0”) 
                    port(<PORT>) 
                ); 
            }; 
            destination d_file { 
                file(“<LOG_FILE_NAME>”); 
            }; 
            log { 
                source(s_network); 
                destination(d_file); 
            }; 
            ```
            (Replace `<LOG_FILE_NAME>` with the name of the log file you created.)

        1. Restart syslog-ng. The typical command syntax is `systemctl restart syslog-ng`.

1. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"Ubiquiti_CL"`
    - **Log path**: resources > properties > dataSources > filePatterns: Path where log files are stored.
    - **Transformation**: resources > properties > dataFlows > transformKql: `"source | project-rename Message=RawData"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Configure and connect the Ubiquiti controller.
    1. Follow the [instructions provided by Ubiquiti](https://help.ui.com/hc/en-us/categories/6583256751383) to enable syslog and optionally debugging logs.
    1. Select Settings > System Settings > Controller Configuration > Remote Logging and enable syslog. 

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### AI Vectra stream

Follow these steps to ingest log messages from AI Vectra stream:

1. Table name: `VectraStream_CL`

1. Data collection rule (DCR): Logs are already stored as text files the AMA can collect. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"VectraStream_CL"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### VMware vCenter

Follow these steps to ingest log messages from VMware vCenter:

1. Table name: `vcenter_CL`

1. Configure a transformation of vCenter logs to text files so the AMA can collect them.

    - **For rsyslog daemon:**
        1. Edit the configuration file `/etc/rsyslog.conf` to add the following template line before the *directive* section:

            `$template vcenter,"%timestamp% %hostname% %msg%\ n"`

        1. Create custom configuration file for the rsyslog daemon, saved as `/etc/rsyslog.d/10-vcenter.conf` with the following filtering conditions:

            ```bash
            if $rawmsg contains "vpxd" then {
                action(type="omfile" file="/<LOG_FILE_NAME>")
                stop
            }
            if $rawmsg contains "vcenter-server" then { 
                action(type="omfile" file="/<LOG_FILE_NAME>") 
                stop 
            } 
            ```
            (Replace `<LOG_FILE_NAME>` with the name of the log file you created.)

        1. Restart rsyslog. The typical command syntax is `sudo systemctl restart rsyslog`.

    - **For syslog-ng daemon:**
        1. Edit the config file `/etc/syslog-ng/conf.d`, adding the following filtering conditions:
        
            ```bash
            filter f_vcenter {
                message("vpxd") or message("vcenter-server"); 
            }; 
             
            destination d_vcenter { 
                file("<LOG_FILE_NAME>"); 
            }; 

            log { 
                source(s_src); 
                filter(f_vcenter); 
                destination(d_vcenter); 
                flags(final); #Ensures that once a message matches the filter and is written to the specified destination, it will not be processed by subsequent log statements 
            }; 
            ```
            (Replace `<LOG_FILE_NAME>` with the name of the log file you created.)

        1. Restart syslog-ng. The typical command syntax is `systemctl restart syslog-ng`.

1. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file). Use the text log format.

    Update the following keys in the DCR with the values as shown in the sample JSON:
    - dataCollectionEndpointId should be populated with your DCE. If you don't have one, define a new one. See [Create a data collection endpoint](../azure-monitor/essentials/data-collection-endpoint-overview.md#create-a-data-collection-endpoint) for the instructions.
    - streamDeclarations > columns
    - transformKql
    - outputStream
    ```json
    {
       "resources": [
          {
             "properties": {
                "streamDeclarations": {
                   "Custom-Text-stream": {
                      "columns": [
                            {
                               "name": "TimeGenerated",
                               "type": "datetime"
                            },
                            {
                               "name": "Message",
                               "type": "string"
                            },
                      ]
                   }
                },
                "dataFlows": [
                   {
                      "transformKql": "source | project-rename Message=RawData",
                      "outputStream": "vcenter_CL"
                   }
                ]
             }
          }
       ]
    }
    ```

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Configure and connect the vCenter devices. 
    1. Follow the [instructions provided by VMware](https://docs.vmware.com/en/VMware-vSphere/7.0/com.vmware.vsphere.monitoring.doc/GUID-9633A961-A5C3-4658-B099-B81E0512DC21.html) for sending syslog messages.
    1. Use the IP address or hostname of the machine where the Azure Monitor Agent is installed.

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

### Zscaler Private Access (ZPA)

Follow these steps to ingest log messages from Zscaler Private Access (ZPA):

1. Table name: `ZPA_CL`

1. Create a log file and grant it write permissions. ***(TO WHOM? -YL)***

1. Configure a temporary transformation of ZPA logs to text files so the AMA can collect them.

    - **For rsyslog daemon:**
        1. Create custom configuration file for the rsyslog daemon, in the `/etc/rsyslog.d/` folder, with the following filtering conditions:

            ```bash
             # Define a new ruleset
            ruleset(name="<RULESET_NAME>") { 
                action(type="omfile" file="<LOG_FILE_NAME>") 
            } 
             
             # Set the input on port and bind it to the new ruleset 
            input(type="imudp" port="<PORT>" ruleset="<RULESET_NAME>") 
            ```
            (Replace `<parameters>` with the actual names of the objects represented.)

        1. Restart rsyslog. The typical command syntax is `systemctl restart rsyslog`.

    - **For syslog-ng daemon:**
        1. Edit the config file `/etc/syslog-ng/conf.d`, adding the following conditions:

            ```bash
            sources_network {
                network ( 
                    ip(“0.0.0.0”) 
                    port(<PORT>) 
                ); 
            }; 
            destination d_file { 
                file(“<LOG_FILE_NAME>”); 
            }; 
            log { 
                source(s_network); 
                destination(d_file); 
            }; 
            ```
            (Replace `<LOG_FILE_NAME>` with the name of the log file you created.)

        1. Restart syslog-ng. The typical command syntax is `systemctl restart syslog-ng`.

1. Create the DCR according to the directions in [Create a data collection rule for a text file](../azure-monitor/agents/data-collection-log-text.md#create-a-data-collection-rule-for-a-text-file).

    Update the DCR with the following values:
    - **Output table name**: resources > properties > dataFlows > outputStream: `"ZPA_CL"`
    - **Log path**: resources > properties > dataSources > filePatterns: Path where log files are stored.
    - **Transformation**: resources > properties > dataFlows > transformKql: `"source | project-rename Message=RawData"`

1. Deploy the Azure Monitor Agent to the machine that collects the logs, if that hasn't been done yet.

1. Configure and connect the ZPA receiver.
    1. Follow the [instructions provided by ZPA](link). Select JSON as the log template.
    1. Select Settings > System Settings > Controller Configuration > Remote Logging and enable syslog. 

[Back to list](#specific-instructions-per-device-type) | [Back to top](#custom-logs-via-ama-data-connector---configure-specific-appliance-or-device-for-microsoft-sentinel-data-ingestion)

## Related content

- [Ingest syslog and CEF messages to Microsoft Sentinel with the Azure Monitor Agent](connect-cef-syslog-ama.md)
- [Syslog via AMA and Common Event Format (CEF) via AMA connectors for Microsoft Sentinel](cef-syslog-ama-overview.md)
