---
title: "Cisco Software Defined WAN connector for Microsoft Sentinel"
description: "Learn how to install the connector Cisco Software Defined WAN to connect your data source to Microsoft Sentinel."
author: cwatson-cat
ms.topic: how-to
ms.date: 08/28/2023
ms.service: microsoft-sentinel
ms.author: cwatson
---

# Cisco Software Defined WAN connector for Microsoft Sentinel

The Cisco Software Defined WAN(SD-WAN) data connector provides the capability to ingest [Cisco SD-WAN](https://www.cisco.com/c/en_in/solutions/enterprise-networks/sd-wan/index.html) Syslog and Netflow data into Microsoft Sentinel.

## Connector attributes

| Connector attribute | Description |
| --- | --- |
| **Kusto function alias** | CiscoSyslogUTD |
| **Kusto function url** | https://aka.ms/sentinel-CiscoSyslogUTD-parser |
| **Log Analytics table(s)** | Syslog<br/> CiscoSDWANNetflow_CL<br/> |
| **Data collection rules support** | [Workspace transform DCR](/azure/azure-monitor/logs/tutorial-workspace-transformations-portal) |
| **Supported by** | [Cisco Systems](https://globalcontacts.cloudapps.cisco.com/contacts/contactDetails/en_US/c1o1-c2o2-c3o8) |

## Query samples

**Syslog Events - All Syslog Events.**
   ```kusto
Syslog
 
   | sort by TimeGenerated desc
   ```

**Cisco SD-WAN Netflow Events - All Netflow Events.**
   ```kusto
CiscoSDWANNetflow_CL
 
   | sort by TimeGenerated desc
   ```



## Vendor installation instructions


**To ingest Cisco SD-WAN Syslog and Netflow data into Microsoft Sentinel follow the steps below.**

1. Steps to ingest Syslog data to Microsoft sentinel

Azure Monitor Agent will be used to collect the syslog data into Microsoft sentinel. For that first need to create an azure arc server for the VM from which syslog data will be sent.


1.1 Steps to Add Azure Arc Server

1. In Azure portal, go to Servers - Azure Arc and click on Add.
2. Select Generate Script under Add a single server section. A User can also generate scripts for Multiple Servers as well.
3. Review the information on the Prerequisites page, then select Next.
4. On the Resource details page, provide the subscription and resource group of the Microsoft Sentinel, Region, Operating system and Connectivity method. Then select Next.
5. On the Tags page, review the default Physical location tags suggested and enter a value, or specify one or more Custom tags to support your standards. Then select Next
6. Select Download to save the script file. 
7. Now that you have generated the script, the next step is to run it on the server that you want to onboard to Azure Arc. 
8. If you have Azure VM follow the steps mentioned in the [link](/azure/azure-arc/servers/plan-evaluate-on-azure-virtual-machine) before running the script. 
9. Run the script by the following command: `./<ScriptName>.sh`
10. After you install the agent and configure it to connect to Azure Arc-enabled servers, go to the Azure portal to verify that the server has successfully connected. View your machine in the Azure portal.
> **Reference link:** [https://learn.microsoft.com/azure/azure-arc/servers/learn/quick-enable-hybrid-vm](/azure/azure-arc/servers/learn/quick-enable-hybrid-vm)

1.2 Steps to Create Data Collection Rule (DCR)

1. In Azure Portal search for Monitor. Under Settings, select Data Collection Rules and Select Create.
2. On the Basics panel, enter the Rule Name, Subscription, Resource group, Region and Platform Type.
3. Select Next: Resources.
4. Select Add resources.Use the filters to find the virtual machine that you&#39;ll use to collect logs.
5. Select the virtual machine. Select Apply.
6. Select Next: Collect and deliver.
7. Select Add data source. For Data source type, select Linux syslog. 
8. For Minimum log level, leave the default values LOG_DEBUG.
9. Select Next: Destination.
10. Select Add destination and add Destination type, Subscription and Account or namespace.
11. Select Add data source. Select Next: Review + create.
12. Select Create. Wait for 20 minutes. In Microsoft Sentinel or Azure Monitor, verify that the Azure Monitor agent is running on your VM.
> **Reference link:** [https://learn.microsoft.com/azure/sentinel/forward-syslog-monitor-agent](/azure/sentinel/forward-syslog-monitor-agent)

2. Steps to ingest Netflow data to Microsoft sentinel

To Ingest Netflow data into Microsoft sentinel, Filebeat and Logstash needs to be installed and configured on the VM. After the configuration, vm will be able to receive netflow data on the configured port and that data will be ingested into the workspace of Microsoft sentinel.


2.1 Install filebeat and logstash

1. For the installation of filebeat and logstash using apt refer to this doc: 
 1. Filebeat: [https://www.elastic.co/guide/en/beats/filebeat/current/setup-repositories.html](https://www.elastic.co/guide/en/beats/filebeat/current/setup-repositories.html). 
 2. Logstash: [https://www.elastic.co/guide/en/logstash/current/installing-logstash.html](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html). 
2. For the installation of filebeat and logstash for RedHat based Linux (yum) steps are as follows: 
 1. Filebeat: [https://www.elastic.co/guide/en/beats/filebeat/current/setup-repositories.html#_yum](https://www.elastic.co/guide/en/beats/filebeat/current/setup-repositories.html#_yum). 
 2. Logstash: [https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#_yum](https://www.elastic.co/guide/en/logstash/current/installing-logstash.html#_yum)

2.2 Configure Filebeat to send events to Logstash

1. Edit filebeat.yml file: `vi /etc/filebeat/filebeat.yml` 
2. Comment out the Elasticsearch Output section. 
3. Uncomment Logstash Output section (Uncomment out only these two lines)-
		output.logstash
		hosts: ["localhost:5044"] 
3. In the Logstash Output section, if you want to send the data other than the default port i.e. 5044 port, then replace the port number in the hosts field. (Note: This port should be added in the conf file, while configuring logstash.) 
4. In the 'filebeat.inputs' section comment out existing configuration and add the following configuration: 
		- type: netflow
		  max_message_size: 10KiB
		  host: "0.0.0.0:2055"
		  protocols: [ v5, v9, ipfix ]
		  expiration_timeout: 30m
		  queue_size: 8192
		  custom_definitions:
		  - /etc/filebeat/custom.yml
		  detect_sequence_reset: true
		  enabled: true 
6. In the Filebeat inputs section, if you want to receive the data other than the default port i.e. 2055 port, then replace the port number in the host field. 
7. Add the provided [custom.yml](https://raw.githubusercontent.com/Azure/Azure-Sentinel/master/Solutions/Cisco%20SD-WAN/Data%20Connectors/custom.yml) file inside the /etc/filebeat/ directory. 
8. Open the filebeat input and output port in the firewall. 
 1. Run command: `firewall-cmd --zone=public --permanent --add-port=2055/udp` 
 2. Run command: `firewall-cmd --zone=public --permanent --add-port=5044/udp` 
> Note: if a custom port is added for filebeat input/output, then open that port in the firewall.

2.3 Configure Logstash to send events to Microsoft Sentinel

1. Install the Azure Log Analytics plugin: 
 1. Run Command: `sudo /usr/share/logstash/bin/logstash-plugin install microsoft-logstash-output-azure-loganalytics` 
3. Store the Log Analytics workspace key in the Logstash key store. The workspace key can be found in Azure Portal under Log analytic workspace > Select workspace > Under Settings select Agent > Log Analytics agent instructions. 
4. Copy the Primary key and run the following commands: 
 1. `sudo /usr/share/logstash/bin/logstash-keystore --path.settings /etc/logstash create LogAnalyticsKey` 
 2. `sudo /usr/share/logstash/bin/logstash-keystore --path.settings /etc/logstash add LogAnalyticsKey` 
5. Create the configuration file /etc/logstash/cisco-netflow-to-sentinel.conf: 
		input {
		    beats {
		        port => <port_number> #(Enter output port number which has been configured during filebeat configuration i.e. filebeat.yml file .)
		     }
		}
		output {
		    microsoft-logstash-output-azure-loganalytics {
		        workspace_id => "<workspace_id>"
		        workspace_key => "${LogAnalyticsKey}"
		        custom_log_table_name => "CiscoSDWANNetflow"
		    }
		} 
> Note: If table is not present in Microsoft sentinel, then it will create a new table in sentinel.

2.4 Run Filebeat:

1. Open a terminal and run the command: 
> `systemctl start filebeat` 

2. This command will start running filebeat in the background. To see the logs stop the filebeat (`systemctl stop filebeat`) then run the following command: 
> `filebeat run -e`

2.5 Run Logstash:

1. In another terminal run the command: 
> `/usr/share/logstash/bin/logstash --path.settings /etc/logstash -f /etc/logstash/cisco-netflow-to-sentinel.conf &` 

2. This command will start running the logstash in the background. To see the logs of logstash kill the above process and run the following command : 
> `/usr/share/logstash/bin/logstash --path.settings /etc/logstash -f /etc/logstash/cisco-netflow-to-sentinel.conf`



## Next steps

For more information, go to the [related solution](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/cisco.cisco-catalyst-sdwan-sentinel?tab=Overview) in the Azure Marketplace.
