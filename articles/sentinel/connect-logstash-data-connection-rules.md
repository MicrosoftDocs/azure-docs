---
title: Use Logstash to stream logs with pipeline transformations via DCR-based API
description: Use Logstash to forward logs from external data sources into custom and standard tables in Microsoft Sentinel, and to configure the output with DCRs. 
author: yelevin
ms.topic: how-to
ms.date: 07/14/2024
ms.author: yelevin


#Customer intent: As a security engineer, I want to use Logstash with Data Collection Rules to stream and transform logs into Microsoft Sentinel, so that analysts can efficiently manage and analyze log data from various sources.

---

# Use Logstash to stream logs with pipeline transformations via DCR-based API

> [!IMPORTANT]
> Data ingestion using the Logstash output plugin with Data Collection Rules (DCRs) is currently in public preview. This feature is provided without a service level agreement. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Microsoft Sentinel's new Logstash output plugin supports pipeline transformations and advanced configuration via Data Collection Rules (DCRs). The plugin forwards any type of logs from external data sources into custom or standard tables in Log Analytics or Microsoft Sentinel. 

In this article, you learn how to set up the new Logstash plugin to stream the data into Log Analytics or Microsoft Sentinel using DCRs, with full control over the output schema. Learn how to **[deploy the plugin](#deploy-the-microsoft-sentinel-output-plugin-in-logstash)**.

> [!NOTE]
> A [previous version of the Logstash plugin](connect-logstash.md) allows you to connect data sources through Logstash via the Data Collection API. 

With the new plugin, you can:
- Control the configuration of the column names and types.
- Perform ingestion-time transformations like filtering or enrichment. 
- Ingest custom logs into a custom table, or ingest a Syslog input stream into the Log Analytics Syslog table.

Ingestion into standard tables is limited only to [standard tables supported for custom logs ingestion](/azure/azure-monitor/logs/logs-ingestion-api-overview#supported-tables).

To learn more about working with the Logstash data collection engine, see [Getting started with Logstash](https://www.elastic.co/guide/en/logstash/current/getting-started-with-logstash.html).

## Overview

### Architecture and background

:::image type="content" source="./media/connect-logstash-data-collection-rules/logstash-data-collection-rule-architecture.png" alt-text="Diagram of the Logstash architecture." border="false" lightbox="./media/connect-logstash-data-collection-rules/logstash-data-collection-rule-architecture.png":::

The Logstash engine is composed of three components:

- Input plugins: Customized collection of data from various sources.
- Filter plugins: Manipulation and normalization of data according to specified criteria.
- Output plugins: Customized sending of collected and processed data to various destinations.

> [!NOTE]
> - Microsoft supports only the Microsoft Sentinel-provided Logstash output plugin discussed here. The current plugin is named **[microsoft-sentinel-log-analytics-logstash-output-plugin](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-sentinel-log-analytics-logstash-output-plugin)**, v1.1.3. You can [open a support ticket](https://portal.azure.com/#create/Microsoft.Support) for any issues regarding the output plugin.
>
> - Microsoft does not support third-party Logstash output plugins for Microsoft Sentinel, or any other Logstash plugin or component of any type.
>
> - See the [prerequisites](#prerequisites) for the plugin’s Logstash version support.

The Microsoft Sentinel output plugin for Logstash sends JSON-formatted data to your Log Analytics workspace, using the Log Analytics Log Ingestion API. The data is ingested into custom logs or standard table.

- Learn more about the [Logs ingestion API](/azure/azure-monitor/logs/logs-ingestion-api-overview).

## Deploy the Microsoft Sentinel output plugin in Logstash

**To set up the plugin, follow these steps**:

1. Review the [prerequisites](#prerequisites)
1. [Install the plugin](#install-the-plugin)
1. [Create a sample file](#create-a-sample-file) 
1. [Create the required DCR-related resources](#create-the-required-dcr-resources)
1. [Configure Logstash configuration file](#configure-logstash-configuration-file) 
1. [Restart Logstash](#restart-logstash)
1. [View incoming logs in Microsoft Sentinel](#view-incoming-logs-in-microsoft-sentinel)
1. [Monitor output plugin audit logs](#monitor-output-plugin-audit-logs)

### Prerequisites

- Install a supported version of Logstash. The plugin supports the following Logstash versions: 
    - 7.0 - 7.17.13
    - 8.0 - 8.9
    - 8.11 - 8.15

    > [!NOTE]
    > If you use Logstash 8, we recommended that you [disable ECS in the pipeline](https://www.elastic.co/guide/en/logstash/8.4/ecs-ls.html).

- Verify that you have a Log Analytics workspace with at least contributor rights.
- Verify that you have permissions to create DCR objects in the workspace.

### Install the plugin

The Microsoft Sentinel output plugin is available in the Logstash collection.

- Follow the instructions in the Logstash [Working with plugins](https://www.elastic.co/guide/en/logstash/current/working-with-plugins.html) document to install the **[microsoft-sentinel-log-analytics-logstash-output-plugin](https://github.com/Azure/Azure-Sentinel/tree/master/DataConnectors/microsoft-sentinel-log-analytics-logstash-output-plugin)** plugin.   
- If your Logstash system does not have Internet access, follow the instructions in the Logstash [Offline Plugin Management](https://www.elastic.co/guide/en/logstash/current/offline-plugins.html) document to prepare and use an offline plugin pack. (This will require you to build another Logstash system with Internet access.)
 
### Create a sample file

In this section, you create a sample file in one of these scenarios:

- [Create a sample file for custom logs](#create-a-sample-file-for-custom-logs)
- [Create a sample file to ingest logs into the Syslog table](#create-a-sample-file-to-ingest-logs-into-the-syslog-table)

#### Create a sample file for custom logs
 
In this scenario, you configure the Logstash input plugin to send events to Microsoft Sentinel. For this example, we use the generator input plugin to simulate events. You can use any other input plugin. 

In this example, the Logstash configuration file looks like this:

```
input {
      generator {
            lines => [
                 "This is a test log message"
            ]
           count => 10
      }
}
```

1. Copy the output plugin configuration below to your Logstash configuration file. 

    ```
    output {
        microsoft-sentinel-log-analytics-logstash-output-plugin {
          create_sample_file => true
          sample_file_path => "<enter the path to the file in which the sample data will be written>" #for example: "c:\\temp" (for windows) or "/tmp" for Linux. 
        }
    }
    ```
1. To make sure that the referenced file path exists before creating the sample file, start Logstash. 
   
    The plugin writes ten records to a sample file named `sampleFile<epoch seconds>.json` in the configured path. For example: *c:\temp\sampleFile1648453501.json*. 
    Here is part of a sample file that the plugin creates:
    
    ```json
    [
            {
                "host": "logstashMachine",
                "sequence": 0,
                "message": "This is a test log message",
                "ls_timestamp": "2022-03-28T17:45:01.690Z",
                "ls_version": "1"
            },
            {
                "host": "logstashMachine",
                "sequence": 1
        ...
            
        ]    
    ```

    The plugin automatically adds these properties to every record:  
    - `ls_timestamp`: The time when the record is received from the input plugin
    - `ls_version`: The Logstash pipeline version.
        
    You can remove these fields when you [create the DCR](#create-the-required-dcr-resources). 

#### Create a sample file to ingest logs into the Syslog table 

In this scenario, you configure the Logstash input plugin to send syslog events to Microsoft Sentinel. 

1. If you don't already have syslog messages forwarded into your Logstash machine, you can use the logger command to generate messages. For example (for Linux):

    ```
    logger -p local4.warn --rfc3164 --tcp -t CEF: "0|Microsoft|Device|cef-test|example|data|1|here is some more data for the example" -P 514 -d -n 127.0.0.1
    Here is an example for the Logstash input plugin:
    input {
         syslog {
             port => 514
        }
    }
    ```
1. Copy the output plugin configuration below to your Logstash configuration file. 

    ```
    output {
        microsoft-sentinel-log-analytics-logstash-output-plugin {
          create_sample_file => true
          sample_file_path => "<enter the path to the file in which the sample data will be written>" #for example: "c:\\temp" (for windows) or "/tmp" for Linux. 
        }
    }
    ```
1. To make sure that the file path exists before creating the sample file, start Logstash. 

    The plugin writes ten records to a sample file named `sampleFile<epoch seconds>.json` in the configured path. For example: *c:\temp\sampleFile1648453501.json*. 
    Here is part of a sample file that the plugin creates:
    ```json
    [
        	{
        		"logsource": "logstashMachine",
        		"facility": 20,
        		"severity_label": "Warning",
        		"severity": 4,
        		"timestamp": "Apr  7 08:26:04",
        		"program": "CEF:",
        		"host": "127.0.0.1",
        		"facility_label": "local4",
        		"priority": 164,
        		"message": 0|Microsoft|Device|cef-test|example|data|1|here is some more data for the example",
        		"ls_timestamp": "2022-04-07T08:26:04.000Z",
        		"ls_version": "1"
        	}
    ]    
        
    ```
    The plugin automatically adds these properties to every record:  
    - `ls_timestamp`: The time when the record is received from the input plugin
    - `ls_version`: The Logstash pipeline version.
        
    You can remove these fields when you [create the DCR](#create-the-required-dcr-resources).

### Create the required DCR resources

To configure the Microsoft Sentinel DCR-based Logstash plugin, you first need to create the DCR-related resources.

In this section, you create resources to use for your DCR, in one of these scenarios:
- [Create DCR resources for ingestion into a custom table](#create-dcr-resources-for-ingestion-into-a-custom-table)
- [Create DCR resources for ingestion into a standard table](#create-dcr-resources-for-ingestion-into-a-standard-table) 

#### Create DCR resources for ingestion into a custom table

To ingest the data to a custom table, follow these steps (based on the [Send data to Azure Monitor Logs using REST API (Azure portal) tutorial](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal)):  

1. Review the [prerequisites](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal#prerequisites).
1. [Configure the application](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal#create-azure-ad-application).
1. [Add a custom log table](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal#create-new-table-in-log-analytics-workspace). 
1. [Parse and filter sample data](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal#parse-and-filter-sample-data) using [the sample file you created in the previous section](#create-a-sample-file).
1. [Collect information from the DCR](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal#collect-information-from-the-dcr).
1. [Assign permissions to the DCR](/azure/azure-monitor/logs/tutorial-logs-ingestion-portal#assign-permissions-to-the-dcr).

    Skip the Send sample data step.

If you come across any issues, see the [troubleshooting steps](/azure/azure-monitor/logs/tutorial-logs-ingestion-code#troubleshooting).

#### Create DCR resources for ingestion into a standard table

To ingest the data to a standard table like Syslog or CommonSecurityLog, you use a process based on the [Send data to Azure Monitor Logs using REST API (Resource Manager templates) tutorial](/azure/azure-monitor/logs/tutorial-logs-ingestion-api). While the tutorial explains how to ingest data into a custom table, you can easily adjust the process to ingest data into a standard table. The steps below indicate relevant changes in the steps. 
 
1. Review the [prerequisites](/azure/azure-monitor/logs/tutorial-logs-ingestion-api#prerequisites).
1. [Collect workspace details](/azure/azure-monitor/logs/tutorial-logs-ingestion-api#collect-workspace-details).
1. [Configure an application](/azure/azure-monitor/logs/tutorial-logs-ingestion-api#create-azure-ad-application). 
    
    Skip the Create new table in Log Analytics workspace step. This step isn't relevant when ingesting data into a standard table, because the table is already defined in Log Analytics.

1. [Create the DCR](/azure/azure-monitor/logs/tutorial-logs-ingestion-api#create-data-collection-rule). In this step: 
    - Provide [the sample file you created in the previous section](#create-a-sample-file). 
    - Use the sample file you created to define the `streamDeclarations` property. Each of the fields in the sample file should have a corresponding column with the same name and the appropriate type (see the [example](#example-dcr-that-ingests-data-into-the-syslog-table) below). 
    - Configure the value of the `outputStream` property with the name of the standard table instead of the custom table. Unlike custom tables, standard table names don't have the `_CL` suffix.  
    - The prefix of the table name should be `Microsoft-` instead of `Custom-`. In our example, the `outputStream` property value is `Microsoft-Syslog`.  
1. [Assign permissions to a DCR](/azure/azure-monitor/logs/tutorial-logs-ingestion-api#assign-permissions-to-a-dcr).

    Skip the Send sample data step.

If you come across any issues, see the [troubleshooting steps](/azure/azure-monitor/logs/tutorial-logs-ingestion-code#troubleshooting).

##### Example: DCR that ingests data into the Syslog table

Note that: 
- The `streamDeclarations` column names and types should be the same as the sample file fields, but you do not have to specify all of them. For example, in the DCR below, the `PRI`, `type` and `ls_version` fields are omitted from the `streamDeclarations` column. 
- The `dataflows` property transforms the input to the Syslog table format, and sets the `outputStream` to `Microsoft-Syslog`.


```json
{
	"$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
	"contentVersion": "1.0.0.0",
	"parameters": {
		"dataCollectionRuleName": {
			"type": "String",
			"metadata": {
				"description": "Specifies the name of the Data Collection Rule to create."
			}
		},
		"location": {
			"defaultValue": "westus2",
			"allowedValues": [
				"westus2",
				"eastus2",
				"eastus2euap"
			],
			"type": "String",
			"metadata": {
				"description": "Specifies the location in which to create the Data Collection Rule."
			}
		},
        "location": {
            "defaultValue": "[resourceGroup().location]", 
            "type": "String", 
            "metadata": {
                "description": "Specifies the location in which to create the Data Collection Rule." 
            } 
        },
		"workspaceResourceId": {
			"type": "String",
			"metadata": {
				"description": "Specifies the Azure resource ID of the Log Analytics workspace to use."
			}
		}
	},
	"resources": [
		{
			"type": "Microsoft.Insights/dataCollectionRules",
			"apiVersion": "2021-09-01-preview",
			"name": "[parameters('dataCollectionRuleName')]",
			"location": "[parameters('location')]",
			"properties": {
				"streamDeclarations": {
					"Custom-SyslogStream": {
						"columns": [
							{
                        "name": "ls_timestamp",
                        "type": "datetime"
                    },	{
                        "name": "timestamp",
                        "type": "datetime"
                    },
                    {
                        "name": "message",
                        "type": "string"
                    }, 
					{
                        "name": "facility_label",
                        "type": "string"
                    },
					{
                        "name": "severity_label",
                        "type": "string"
                    },
                    {
                        "name": "host",
                        "type": "string"
                    },
                    {
                        "name": "logsource",
                        "type": "string"
                    }
	]
				      }
				},
				"destinations": {
					"logAnalytics": [
						{
							"workspaceResourceId": "[parameters('workspaceResourceId')]",
							"name": "clv2ws1"
						}
					]
				},
				"dataFlows": [
					{
					"streams": [
						"Custom-SyslogStream"
					],
					"destinations": [
						"clv2ws1"
					],
					"transformKql": "source | project TimeGenerated = ls_timestamp, EventTime = todatetime(timestamp), Computer = logsource, HostName = logsource, HostIP = host, SyslogMessage = message, Facility = facility_label, SeverityLevel = severity_label",
						"outputStream": "Microsoft-Syslog"
					}
				]
			}
		}
	],
	"outputs": {
		"dataCollectionRuleId": {
			"type": "String",
			"value": "[resourceId('Microsoft.Insights/dataCollectionRules', parameters('dataCollectionRuleName'))]"
		}
	}
}
```

### Configure Logstash configuration file

To configure the Logstash configuration file to ingest the logs into a custom table, retrieve these values:

|Field  |How to retrieve  |
|---------|---------|
|`client_app_Id` |The `Application (client) ID` value you create in step 3 when you [create the DCR resources](#create-the-required-dcr-resources), according to the tutorial you used in this section. |
|`client_app_secret` |The `Application (client) ID` value you create in step 5 when you [create the DCR resources](#create-the-required-dcr-resources), according to the tutorial you used in this section. |
|`tenant_id`     |Your subscription's tenant ID. You can find the tenant ID under **Home > Microsoft Entra ID > Overview > Basic Information**.         |
|`data_collection_endpoint`   |The value of the `logsIngestion` URI in step 3 when you [create the DCR resources](#create-the-required-dcr-resources), according to the tutorial you used in this section.       |
|`dcr_immutable_id` |The value of the DCR `immutableId` in step 6 when you [create the DCR resources](#create-the-required-dcr-resources), according to the tutorial you used in this section. |
|`dcr_stream_name` |For custom tables, as explained in step 6 when you [create the DCR resources](#create-dcr-resources-for-ingestion-into-a-custom-table), go to the JSON view of the DCR, and copy the `dataFlows` > `streams` property. See the `dcr_stream_name` in the [example](#example-output-plugin-configuration-section) below.<br><br>For standard tables, the value is `Custom-SyslogStream`. |

After you retrieve the required values: 

1. Replace the output section of the [Logstash configuration file](#create-a-sample-file) you created in the previous step with the example below. 
1. Replace the placeholder strings in the [example](#example-output-plugin-configuration-section) below with the values you retrieved. 
1. Make sure you change the `create_sample_file` attribute to `false`. 

#### Optional configuration

|Field  |Description  |Default value |
|---------|---------|---------|
|`azure_cloud` |Used to specify the name of the Azure cloud that is being used, Available values are: `AzureCloud`, `AzureChinaCloud`, and `AzureUSGovernment`. | `AzureCloud` |
|`key_names` |An array of strings. Provide this field if you want to send a subset of the columns to Log Analytics. |None (field is empty) |
|`plugin_flush_interval` |Defines the maximal time difference (in seconds) between sending two messages to Log Analytics.  |`5` |
|`retransmission_time` |Sets the amount of time in seconds for retransmitting messages once sending failed. |`10` |
|`compress_data` |When this field is `True`, the event data is compressed before using the API. Recommended for high throughput pipelines. |`False` |
|`proxy` |Specify which proxy URL to use for all API calls. |None (field is empty) |
|`proxy_aad` |Specify which proxy URL to use for API calls to Microsoft Entra ID. |Same value as 'proxy' (field is empty) |
|`proxy_endpoint` |Specify which proxy URL to use for API calls to the Data Collection Endpoint. |Same value as 'proxy' (field is empty) |

#### Example: Output plugin configuration section

```
output {
    microsoft-sentinel-log-analytics-logstash-output-plugin {
      client_app_Id => "<enter your client_app_id value here>"
      client_app_secret => "<enter your client_app_secret value here>"
      tenant_id => "<enter your tenant id here> "
      data_collection_endpoint => "<enter your logsIngestion URI here> "
      dcr_immutable_id => "<enter your DCR immutableId here> "
      dcr_stream_name => "<enter your stream name here> "
      create_sample_file=> false
      sample_file_path => "c:\\temp"
      proxy => "http://proxy.example.com"
    }
}
```
To set other parameters for the Microsoft Sentinel Logstash output plugin, see the output plugin's readme file.

> [!NOTE]
> For security reasons, we recommend that you don't implicitly state the `client_app_Id`, `client_app_secret`, `tenant_id`, `data_collection_endpoint`, and `dcr_immutable_id` attributes in your Logstash configuration file. We recommend that you store this sensitive information in a [Logstash KeyStore](https://www.elastic.co/guide/en/logstash/current/keystore.html#keystore). 

### Restart Logstash

Restart Logstash with the updated output plugin configuration and see that data is ingested to the right table according to your DCR configuration.

### View incoming logs in Microsoft Sentinel

1. Verify that messages are being sent to the output plugin.

1. From the Microsoft Sentinel navigation menu, click **Logs**. Under the **Tables** heading, expand the **Custom Logs** category. Find and click the name of the table you specified (with a `_CL` suffix) in the configuration.

   :::image type="content" source="./media/connect-logstash/logstash-custom-logs-menu.png" alt-text="Screenshot of log stash custom logs.":::

1. To see records in the table, query the table by using the table name as the schema.

   :::image type="content" source="./media/connect-logstash/logstash-custom-logs-query.png" alt-text="Screenshot of a log stash custom logs query.":::

## Monitor output plugin audit logs

To monitor the connectivity and activity of the Microsoft Sentinel output plugin, enable the appropriate Logstash log file. See the [Logstash Directory Layout](https://www.elastic.co/guide/en/logstash/current/dir-layout.html#dir-layout) document for the log file location.

If you are not seeing any data in this log file, generate and send some events locally (through the input and filter plugins) to make sure the output plugin is receiving data. Microsoft Sentinel will support only issues relating to the output plugin.


### Network security
Define network settings and enable network isolation for Microsoft Sentinel Logstash output plugin.

#### Virtual network service tags

Microsoft Sentinel output plugin supports [Azure virtual network service tags](/azure/virtual-network/service-tags-overview). Both *AzureMonitor* and *AzureActiveDirectory* tags are required. 

Azure Virtual Network service tags can be used to define network access controls on [network security groups](/azure/virtual-network/network-security-groups-overview#security-rules), [Azure Firewall](/azure/firewall/service-tags), and user-defined routes. Use service tags in place of specific IP addresses when you create security rules and routes. For scenarios where Azure Virtual Network service tags cannot be used, the firewall requirements are given below.

#### Firewall requirements

The following table lists the firewall requirements for scenarios where Azure virtual network service tags can't be used.

| Cloud |Endpoint |Purpose |Port |Direction |Bypass HTTPS inspection|
|------|------|------|---------|--------|--------|
| Azure Commercial |https://login.microsoftonline.com |Authorization server (the Microsoft identity platform)|Port 443 |Outbound|Yes |
| Azure Commercial |`https://<data collection endpoint name>.<Azure cloud region>.ingest.monitor.azure.com`| Data collection Endpoint|Port 443 |Outbound|Yes |
| Azure Government |https://login.microsoftonline.us |Authorization server (the Microsoft identity platform)|Port 443 |Outbound|Yes |
| Azure Government |Replace '.com' above with '.us'	| Data collection Endpoint|Port 443 |Outbound|Yes |
| Microsoft Azure operated by 21Vianet |https://login.chinacloudapi.cn |Authorization server (the Microsoft identity platform)|Port 443 |Outbound|Yes |
| Microsoft Azure operated by 21Vianet |Replace '.com' above with '.cn'	| Data collection Endpoint|Port 443 |Outbound|Yes |

## Plugin-versions
#### 1.1.3
-  Replaces the `rest-client` library used for connecting to Azure with the `excon` library.
 
#### 1.1.1
- Adds support for Azure US Government cloud and Microsoft Azure operated by 21Vianet in China.
 
#### 1.1.0 
- Allows setting different proxy values for API connections.
- Upgrades version for logs ingestion API to 2023-01-01.
- Renames the plugin to microsoft-sentinel-log-analytics-logstash-output-plugin.
 
#### 1.0.0
- The initial release for the Logstash output plugin for Microsoft Sentinel. This plugin uses Data Collection Rules (DCRs) with Azure Monitor's Logs Ingestion API.
## Known issues
 
When using Logstash installed on a Docker image of Lite Ubuntu, the following warning may appear:

```
java.lang.RuntimeException: getprotobyname_r failed
```

To resolve it, use the following commands to install the *netbase* package within your Dockerfile:
```bash
USER root
RUN apt install netbase -y
```
For more information, see [JNR regression in Logstash 7.17.0 (Docker)](https://github.com/elastic/logstash/issues/13703).

If your environment's event rate is low considering the number of allocated Logstash workers, we recommend increasing the value of *plugin_flush_interval* to 60 or more. This change will allow each worker to batch more events before uploading to the Data Collection Endpoint (DCE).  You can monitor the ingestion payload using [DCR metrics](/azure/azure-monitor/essentials/data-collection-monitor#dcr-metrics).
For more information on *plugin_flush_interval*, see the [Optional Configuration table](#optional-configuration) mentioned earlier.

## Limitations

- Ingestion into standard tables is limited only to [standard tables supported for custom logs ingestion](/azure/azure-monitor/logs/logs-ingestion-api-overview#supported-tables).
- The columns of the input stream in the `streamDeclarations` property must start with a letter. If you start a column with other characters (for example `@` or `_`), the operation fails.
- The `TimeGenerated` datetime field is required. You must include this field in the KQL transform.
- For additional possible issues, review the [troubleshooting section](/azure/azure-monitor/logs/tutorial-logs-ingestion-code#troubleshooting) in the tutorial. 

## Next steps

In this article, you learned how to use Logstash to connect external data sources to Microsoft Sentinel. To learn more about Microsoft Sentinel, see the following articles:
- Learn how to [get visibility into your data and potential threats](get-visibility.md).
- Get started [detecting threats with Microsoft Sentinel](threat-detection.md).
