

<properties
	pageTitle="Use Azure Resource Manager templates to Create and Configure a Log Analytics Workspace | Microsoft Azure"
	description="You can use Azure Resource Manager templates to create and configure Log Analytics workspaces."
	services="log-analytics"
	documentationCenter=""
	authors="richrundmsft"
	manager="jochan"
	editor=""/>

<tags
	ms.service="log-analytics"
	ms.workload="na"
	ms.tgt_pltfrm="na"
	ms.devlang="json"
	ms.topic="article"
	ms.date="08/24/2016"
	ms.author="richrund"/>

# Manage Log Analytics using Azure Resource Manager templates

You can use [Azure Resource Manager templates] (../azure-resource-manager/resource-group-authoring-templates.md) to create and configure Log Analytics workspaces. Examples of the tasks you can perform with templates include:

+ Create a workspace
+ Add a solution
+ Create saved searches
+ Create a computer group
+ Enable collection of IIS logs from computers with the Windows agent installed
+ Collect performance counters from Linux and Windows computers
+ Collect events from syslog on Linux computers 
+ Collect events from Windows event logs
+ Collect custom event logs
+ Add the log analytics agent to an Azure virtual machine
+ Configure log analytics to index data collected using Azure diagnostics


This article provides a template samples that illustrate some of the configuration that you can perform from templates.

## Create and configure a Log Analytics Workspace

The following template sample illustrates how to:

1.	Create a workspace
2.	Add solutions to the workspace
3.	Create saved searches
4.	Create a computer group
5.	Enable collection of IIS logs from computers with the Windows agent installed
6.	Collect Logical Disk perf counters from Linux computers (% Used Inodes; Free Megabytes; % Used Space; Disk Transfers/sec; Disk Reads/sec; Disk Writes/sec)
7.	Collect syslog events from Linux computers
8.	Collect Error and Warning events from the Application Event Log from Windows computers
9.	Collect Memory Available Mbytes performance counter from Windows computers
10.	Collect a custom log 


```
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "workspaceName"
      }
    },
    "serviceTier": {
      "type": "string",
      "allowedValues": [
        "Free",
        "Standard",
        "Premium"
      ],
      "metadata": {
        "description": "Service Tier: Free, Standard, or Premium"
      }
    },
    "location": {
      "type": "string",
      "allowedValues": [
        "East US",
        "West Europe",
        "Southeast Asia",
        "Australia Southeast"
      ]
    }
  },
  "variables": {
    "apiVersion": "2015-11-01-preview"
  },
  "resources": [
    {
      "apiVersion": "[variables('apiVersion')]",
      "type": "Microsoft.OperationalInsights/workspaces",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "sku": {
          "Name": "[parameters('serviceTier')]"
        }
      },
      "resources": [
        {
          "apiVersion": "[variables('apiVersion')]",
          "name": "VMSS Queries2",
          "type": "savedSearches",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "properties": {
            "Category": "VMSS",
            "ETag": "*",
            "DisplayName": "VMSS Instance Count",
            "Query": "Type:Event Source=ServiceFabricNodeBootstrapAgent | dedup Computer | measure count () by Computer",
            "Version": 1
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleWindowsEvent1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "WindowsEvent",
          "properties": {
            "eventLogName": "Application",
            "eventTypes": [
              {
                "eventType": "Error"
              },
              {
                "eventType": "Warning"
              }
            ]
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleWindowsPerfCounter1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "WindowsPerformanceCounter",
          "properties": {
            "objectName": "Memory",
            "instanceName": "*",
            "intervalSeconds": 10,
            "counterName": "Available MBytes"
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleIISLog1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "IISLogs",
          "properties": {
            "state": "OnPremiseEnabled"
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleSyslog1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "LinuxSyslog",
          "properties": {
            "syslogName": "kern",
            "syslogSeverities": [
              {
                "severity": "emerg"
              },
              {
                "severity": "alert"
              },
              {
                "severity": "crit"
              },
              {
                "severity": "err"
              },
              {
                "severity": "warning"
              }
            ]
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleSyslogCollection1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "LinuxSyslogCollection",
          "properties": {
            "state": "Enabled"
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleLinuxPerf1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "LinuxPerformanceObject",
          "properties": {
            "performanceCounters": [
              {
                "counterName": "% Used Inodes"
              },
              {
                "counterName": "Free Megabytes"
              },
              {
                "counterName": "% Used Space"
              },
              {
                "counterName": "Disk Transfers/sec"
              },
              {
                "counterName": "Disk Reads/sec"
              },
              {
                "counterName": "Disk Writes/sec"
              }
            ],
            "objectName": "Logical Disk",
            "instanceName": "*",
            "intervalSeconds": 10
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleLinuxPerfCollection1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "LinuxPerformanceCollection",
          "properties": {
            "state": "Enabled"
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleCustomLog1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "CustomLog",
          "properties": {
            "customLogName": "sampleCustomLog1",
            "description": "test customg log datasources",
            "inputs": [
              {
                "location": {
                  "fileSystemLocations": {
                    "windowsFileTypeLogPaths": [ "e:\\iis5\\*.log" ],
                    "linuxFileTypeLogPaths": [ "/var/logs" ]
                  }
                },
                "recordDelimiter": {
                  "regexDelimiter": {
                    "pattern": "\\n",
                    "matchIndex": 0,
                    "matchIndexSpecified": true,
                    "numberedGroup": null
                  }
                }
              }
            ],
            "extractions": [
              {
                "extractionName": "TimeGenerated",
                "extractionType": "DateTime",
                "extractionProperties": {
                  "dateTimeExtraction": {
                    "regex": null,
                    "joinStringRegex": null
                  }
                }
              }
            ]
          }
        },
        {
          "apiVersion": "[variables('apiVersion')]",
          "type": "datasources",
          "name": "sampleCustomLogCollection1",
          "dependsOn": [
            "[concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName'))]"
          ],
          "kind": "CustomLogCollection",
          "properties": {
            "state": "LinuxLogsEnabled"
          }
        }
      ]
    }
  ],
  "outputs": {
    "workspaceOutput": {
      "value": "[reference(concat('Microsoft.OperationalInsights/workspaces/', parameters('workspaceName')), variables('apiVersion'))]",
      "type": "object"
    }
  }
}


```

## Configuring Log Analytics to index Azure diagnostics 

For agentless monitoring of Azure resources, the resources need to have Azure diagnostics enabled and configured to write to a storage account. Log Analytics can then be configured to collect the logs from the storage account. Examples of resources that you can perform agentless monitoring for are:

+ Classic cloud services (web and worker roles)
+ Service fabric clusters
+ Network security groups
+ Key vaults and 
+ Application gateways

The following example shows how to:

1.	List the existing storage accounts and locations that Log Analytics will index data from
2.	Create a configuration to read from a storage account
3.	Update the newly created configuration to index data from additional locations
4.	Delete the newly created configuration

```

```

## Example Resource Manager templates

The Azure quickstart template gallery includes several templates for Log Analytics, including:

+ [Deploy a virtual machine running Windows with the Log Analytics VM extension](../../templates/201-oms-extension-windows-vm.md)
+ [Monitor Azure Site Recovery using an existing Log Analytics workspace] (../../templates/asr-oms-monitoring.md)
+ [Monitor Azure Web Apps using an existing Log Analytics workspace] (../../templates/101-webappazure-oms-monitoring.md)
+ [Monitor SQL Azure using an existing Log Analytics workspace] (../../templates/101- sqlazure-oms-monitoring.md)
+ [Deploy a Service Fabric cluster and monitor it with an existing Log Analytics workspace] (../../templates/service-fabric-oms.md)
+ [Deploy a Service Fabric cluster and create a Log Analytics workspace to monitor it] (../../templates/service-fabric-vmss-oms.md)


## Next steps

+ [Deploy agents into Azure VMs using Resource Manager templates](log-analytics-azure-vm-extension.md)



