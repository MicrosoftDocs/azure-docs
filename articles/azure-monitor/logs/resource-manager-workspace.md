---
title: Resource Manager template samples for Log Analytics workspaces
description: Sample Azure Resource Manager templates to deploy Log Analytics workspaces and configure data sources in Azure Monitor.
ms.topic: sample
ms.custom: devx-track-arm-template
author: bwren
ms.author: bwren
ms.date: 08/08/2023
---

# Resource Manager template samples for Log Analytics workspaces in Azure Monitor

This article includes sample [Azure Resource Manager templates](../../azure-resource-manager/templates/syntax.md) to create and configure Log Analytics workspaces in Azure Monitor. Each sample includes a template file and a parameters file with sample values to provide to the template.

[!INCLUDE [azure-monitor-samples](../../../includes/azure-monitor-resource-manager-samples.md)]

## Template references

- [Microsoft.OperationalInsights workspaces](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/workspaces)
- [Microsoft.OperationalInsights workspaces/dataSources](/azure/templates/microsoft.operationalinsights/2020-03-01-preview/workspaces/datasources)

## Create a Log Analytics workspace

The following sample creates a new empty Log Analytics workspace. A workspace has unique workspace ID and resource ID. You can reuse the same workspace name when in different resource groups.

### Notes

- If you specify a pricing tier of **Free**, then remove the **retentionInDays** element.

### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location for the workspace.')
param location string

@description('Specify the pricing tier: PerGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers.')
@allowed([
  'CapacityReservation'
  'Free'
  'LACluster'
  'PerGB2018'
  'PerNode'
  'Premium'
  'Standalone'
  'Standard'
])
param sku string = 'PerGB2018'

@description('Specify the number of days to retain data.')
param retentionInDays int = 120

@description('Specify true to use resource or workspace permissions, or false to require workspace permissions.')
param resourcePermissions bool

@description('Specify the number of days to retain data in Heartbeat table.')
param heartbeatTableRetention int

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
  properties: {
    sku: {
      name: sku
    }
    retentionInDays: retentionInDays
    features: {
      enableLogAccessUsingOnlyResourcePermissions: resourcePermissions
    }
  }
}

resource table 'Microsoft.OperationalInsights/workspaces/tables@2021-12-01-preview' = {
  parent: workspace
  name: 'Heartbeat'
  properties: {
    retentionInDays: heartbeatTableRetention
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Specify the location for the workspace."
      }
    },
    "sku": {
      "type": "string",
      "defaultValue": "PerGB2018",
      "allowedValues": [
        "CapacityReservation",
        "Free",
        "LACluster",
        "PerGB2018",
        "PerNode",
        "Premium",
        "Standalone",
        "Standard"
      ],
      "metadata": {
        "description": "Specify the pricing tier: PerGB2018 or legacy tiers (Free, Standalone, PerNode, Standard or Premium) which are not available to all customers."
      }
    },
    "retentionInDays": {
      "type": "int",
      "defaultValue": 120,
      "metadata": {
        "description": "Specify the number of days to retain data."
      }
    },
    "resourcePermissions": {
      "type": "bool",
      "metadata": {
        "description": "Specify true to use resource or workspace permissions, or false to require workspace permissions."
      }
    },
    "heartbeatTableRetention": {
      "type": "int",
      "metadata": {
        "description": "Specify the number of days to retain data in Heartbeat table."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {
        "sku": {
          "name": "[parameters('sku')]"
        },
        "retentionInDays": "[parameters('retentionInDays')]",
        "features": {
          "enableLogAccessUsingOnlyResourcePermissions": "[parameters('resourcePermissions')]"
        }
      }
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/tables",
      "apiVersion": "2021-12-01-preview",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'Heartbeat')]",
      "properties": {
        "retentionInDays": "[parameters('heartbeatTableRetention')]"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "sku": {
      "value": "PerGB2018"
    },
    "location": {
      "value": "eastus"
    },
    "resourcePermissions": {
      "value": true
    },
    "heartbeatTableRetention": {
      "value": 30
    }
  }
}
```

## Configure data collection for Log Analytics workspace
The following samples show how to configure a Log Analytics workspace to collect data from the [Log Analytics agent](../agents/log-analytics-agent.md), which is on a deprecation path being replaced by [Azure Monitor agent](../agents/agents-overview.md). The Azure Monitor agent uses [data collection rules](../essentials/data-collection-rule-overview.md) to define its data collection and will ignore any of the configuration performed by these samples. For sample templates for data collection rules, see [Resource Manager template samples for data collection rules in Azure Monitor](../agents/resource-manager-data-collection-rules.md).

### Collect Windows events

The following sample adds collection of [Windows events](../agents/data-sources-windows-events.md) to an existing workspace.

#### Notes

- Add a **datasources** element for each event log to collect. You can specify different set of event types for each log.

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location for the workspace.')
param location string

resource workspace'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
  properties: {}
}

resource windowsEventsSystemDataSource 'Microsoft.OperationalInsights/workspaces/dataSources@2020-08-01' = {
  parent: workspace
  name: 'WindowsEventsSystem'
  kind: 'WindowsEvent'
  properties: {
    eventLogName: 'System'
    eventTypes: [
      {
        eventType: 'Error'
      }
      {
        eventType: 'Warning'
      }
    ]
  }
}

resource WindowsEventApplicationDataSource 'Microsoft.OperationalInsights/workspaces/dataSources@2020-08-01' = {
  parent: workspace
  name: 'WindowsEventsApplication'
  kind: 'WindowsEvent'
  properties: {
    eventLogName: 'Application'
    eventTypes: [
      {
        eventType: 'Error'
      }
      {
        eventType: 'Warning'
      }
      {
        eventType: 'Information'
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Specify the location for the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'WindowsEventsSystem')]",
      "kind": "WindowsEvent",
      "properties": {
        "eventLogName": "System",
        "eventTypes": [
          {
            "eventType": "Error"
          },
          {
            "eventType": "Warning"
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'WindowsEventsApplication')]",
      "kind": "WindowsEvent",
      "properties": {
        "eventLogName": "Application",
        "eventTypes": [
          {
            "eventType": "Error"
          },
          {
            "eventType": "Warning"
          },
          {
            "eventType": "Information"
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Collect syslog

The following sample adds collection of [syslog events](../agents/data-sources-syslog.md) to an existing workspace.

#### Notes

- Add a **datasources** element for each facility to collect. You can specify different set of severities for each facility.

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location in which to create the workspace.')
param location string

resource workspace 'Microsoft.OperationalInsights/workspaces@2020-08-01' = {
  name: workspaceName
  location: location
  properties: {}
}

resource syslogKernDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'SyslogKern'
  kind: 'LinuxSyslog'
  properties: {
    syslogName: 'kern'
    syslogSeverities: [
      {
        severity: 'emerg'
      }
      {
        severity: 'alert'
      }
      {
        severity: 'crit'
      }
      {
        severity: 'err'
      }
      {
        severity: 'warning'
      }
      {
        severity: 'notice'
      }
      {
        severity: 'info'
      }
      {
        severity: 'debug'
      }
    ]
  }
}

resource syslogDaemonDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'SyslogDaemon'
  kind: 'LinuxSyslog'
  properties: {
    syslogName: 'daemon'
    syslogSeverities: [
      {
        severity: 'emerg'
      }
      {
        severity: 'alert'
      }
      {
        severity: 'crit'
      }
      {
        severity: 'err'
      }
      {
        severity: 'warning'
      }
    ]
  }
}

resource syslogCollectionDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'SyslogCollection'
  kind: 'LinuxSyslogCollection'
  properties: {
    state: 'Enabled'
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Specify the location in which to create the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2020-08-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'SyslogKern')]",
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
          },
          {
            "severity": "notice"
          },
          {
            "severity": "info"
          },
          {
            "severity": "debug"
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'SyslogDaemon')]",
      "kind": "LinuxSyslog",
      "properties": {
        "syslogName": "daemon",
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
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'SyslogCollection')]",
      "kind": "LinuxSyslogCollection",
      "properties": {
        "state": "Enabled"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Collect Windows performance counters

The following sample adds collection of [Windows performance counters](../agents/data-sources-performance-counters.md) to an existing workspace.

#### Notes

- Add a **datasources** element for each counter and instance to collect. You can specify different collection rate for each counter and instance combination.

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location of the workspace.')
param location string = resourceGroup().location

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
  properties: {}
}

resource windowsPerfMemoryAvailableBytesDataSource 'Microsoft.OperationalInsights/workspaces/dataSources@2020-08-01' = {
  parent: workspace
  name: 'WindowsPerfMemoryAvailableBytes'
  kind: 'WindowsPerformanceCounter'
  properties: {
    objectName: 'Memory'
    instanceName: '*'
    intervalSeconds: 10
    counterName: 'Available MBytes '
  }
}

resource windowsPerfMemoryPercentageBytesDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'WindowsPerfMemoryPercentageBytes'
  kind: 'WindowsPerformanceCounter'
  properties: {
    objectName: 'Memory'
    instanceName: '*'
    intervalSeconds: 10
    counterName: '% Committed Bytes in Use'
  }
}

resource windowsPerfProcessorPercentageDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'WindowsPerfProcessorPercentage'
  kind: 'WindowsPerformanceCounter'
  properties: {
    objectName: 'Processor'
    instanceName: '_Total'
    intervalSeconds: 10
    counterName: '% Processor Time'
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specify the location of the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'WindowsPerfMemoryAvailableBytes')]",
      "kind": "WindowsPerformanceCounter",
      "properties": {
        "objectName": "Memory",
        "instanceName": "*",
        "intervalSeconds": 10,
        "counterName": "Available MBytes "
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'WindowsPerfMemoryPercentageBytes')]",
      "kind": "WindowsPerformanceCounter",
      "properties": {
        "objectName": "Memory",
        "instanceName": "*",
        "intervalSeconds": 10,
        "counterName": "% Committed Bytes in Use"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'WindowsPerfProcessorPercentage')]",
      "kind": "WindowsPerformanceCounter",
      "properties": {
        "objectName": "Processor",
        "instanceName": "_Total",
        "intervalSeconds": 10,
        "counterName": "% Processor Time"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Collect Linux performance counters

The following sample adds collection of [Linux performance counters](../agents/data-sources-performance-counters.md) to an existing workspace.

#### Notes

- Add a **datasources** element for each object and instance to collect. You can specify different set of counters for each object and instance combination, but you can only specify a single rate for all counters.

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location in which to create the workspace.')
param location string = resourceGroup().location

resource workspace 'Microsoft.OperationalInsights/workspaces@2020-08-01' = {
  name: workspaceName
  location: location
  properties: {}
}

resource linuxPerformanceLogicalDiskDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'LinuxPerformanceLogicalDisk'
  kind: 'LinuxPerformanceObject'
  properties: {
    objectName: 'Logical Disk'
    instanceName: '*'
    intervalSeconds: 10
    performanceCounters: [
      {
        counterName: '% Used Inodes'
      }
      {
        counterName: 'Free Megabytes'
      }
      {
        counterName: '% Used Space'
      }
      {
        counterName: 'Disk Transfers/sec'
      }
      {
        counterName: 'Disk Reads/sec'
      }
      {
        counterName: 'Disk Writes/sec'
      }
    ]
  }
}

resource linuxPerformanceProcessorDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'LinuxPerformanceProcessor'
  kind: 'LinuxPerformanceObject'
  properties: {
    objectName: 'Processor'
    instanceName: '*'
    intervalSeconds: 10
    performanceCounters: [
      {
        counterName: '% Processor Time'
      }
      {
        counterName: '% Privileged Time'
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "defaultValue": "[resourceGroup().location]",
      "metadata": {
        "description": "Specify the location in which to create the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2020-08-01",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'LinuxPerformanceLogicalDisk')]",
      "kind": "LinuxPerformanceObject",
      "properties": {
        "objectName": "Logical Disk",
        "instanceName": "*",
        "intervalSeconds": 10,
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
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'LinuxPerformanceProcessor')]",
      "kind": "LinuxPerformanceObject",
      "properties": {
        "objectName": "Processor",
        "instanceName": "*",
        "intervalSeconds": 10,
        "performanceCounters": [
          {
            "counterName": "% Processor Time"
          },
          {
            "counterName": "% Privileged Time"
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Collect text logs

The following sample adds collection of [text logs](../agents/data-sources-custom-logs.md) to an existing workspace.

#### Notes

- The configuration of delimiters and extractions can be complex. For help, you can define a text log using the Azure portal and the retrieve its configuration using [Get-AzOperationalInsightsDataSource](/powershell/module/az.operationalinsights/get-azoperationalinsightsdatasource) with **-Kind** set to **CustomLog**.

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location in which to create the workspace.')
param location string

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
  properties: {}
}

resource armlogTimeDelimitedDataSource 'Microsoft.OperationalInsights/workspaces/dataSources@2020-08-01' = {
  parent: workspace
  name: '${workspaceName}armlog_timedelimited'
  kind: 'CustomLog'
  properties: {
    customLogName: 'arm_log_timedelimited'
    description: 'this is a description'
    inputs: [
      {
        location: {
          fileSystemLocations: {
            linuxFileTypeLogPaths: [
              '/var/logs'
            ]
            windowsFileTypeLogPaths: [
              'c:\\Windows\\Logs\\*.txt'
            ]
          }
        }
        recordDelimiter: {
          regexDelimiter: {
            matchIndex: 0
            numberdGroup: null
            pattern: '(^.*((\\d{2})|(\\d{4}))-([0-1]\\d)-(([0-3]\\d)|(\\d))\\s((\\d)|([0-1]\\d)|(2[0-4])):[0-5][0-9]:[0-5][0-9].*$)'
          }
        }
      }
    ]
    extractions: [
      {
        extractionName: 'TimeGenerated'
        extractionProperties: {
          dateTimeExtraction: {
            regex: [
              {
                matchIndex: 0
                numberdGroup: null
                pattern: '((\\d{2})|(\\d{4}))-([0-1]\\d)-(([0-3]\\d)|(\\d))\\s((\\d)|([0-1]\\d)|(2[0-4])):[0-5][0-9]:[0-5][0-9]'
              }
            ]
          }
        }
        extractionType: 'DateTime'
      }
    ]
  }
}

resource armlogNewlineDatasource 'Microsoft.OperationalInsights/workspaces/dataSources@2020-08-01' = {
  parent: workspace
  name: '${workspaceName}armlog_newline'
  kind: 'CustomLog'
  properties: {
    customLogName: 'armlog_newline'
    description: 'this is a description'
    inputs: [
      {
        location: {
          fileSystemLocations: {
            linuxFileTypeLogPaths: [
              '/var/logs'
            ]
            windowsFileTypeLogPaths: [
              'c:\\Windows\\Logs\\*.txt'
            ]
          }
        }
        recordDelimiter: {
          regexDelimiter: {
            pattern: '\\n'
            matchIndex: 0
            numberdGroup: null
          }
        }
      }
    ]
    extractions: [
      {
        extractionName: 'TimeGenerated'
        extractionType: 'DateTime'
        extractionProperties: {
          dateTimeExtraction: {
            regex: null
            joinStringRegex: null
          }
        }
      }
    ]
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Specify the location in which to create the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), format('{0}armlog_timedelimited', parameters('workspaceName')))]",
      "kind": "CustomLog",
      "properties": {
        "customLogName": "arm_log_timedelimited",
        "description": "this is a description",
        "inputs": [
          {
            "location": {
              "fileSystemLocations": {
                "linuxFileTypeLogPaths": [
                  "/var/logs"
                ],
                "windowsFileTypeLogPaths": [
                  "c:\\Windows\\Logs\\*.txt"
                ]
              }
            },
            "recordDelimiter": {
              "regexDelimiter": {
                "matchIndex": 0,
                "numberdGroup": null,
                "pattern": "(^.*((\\d{2})|(\\d{4}))-([0-1]\\d)-(([0-3]\\d)|(\\d))\\s((\\d)|([0-1]\\d)|(2[0-4])):[0-5][0-9]:[0-5][0-9].*$)"
              }
            }
          }
        ],
        "extractions": [
          {
            "extractionName": "TimeGenerated",
            "extractionProperties": {
              "dateTimeExtraction": {
                "regex": [
                  {
                    "matchIndex": 0,
                    "numberdGroup": null,
                    "pattern": "((\\d{2})|(\\d{4}))-([0-1]\\d)-(([0-3]\\d)|(\\d))\\s((\\d)|([0-1]\\d)|(2[0-4])):[0-5][0-9]:[0-5][0-9]"
                  }
                ]
              }
            },
            "extractionType": "DateTime"
          }
        ]
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), format('{0}armlog_newline', parameters('workspaceName')))]",
      "kind": "CustomLog",
      "properties": {
        "customLogName": "armlog_newline",
        "description": "this is a description",
        "inputs": [
          {
            "location": {
              "fileSystemLocations": {
                "linuxFileTypeLogPaths": [
                  "/var/logs"
                ],
                "windowsFileTypeLogPaths": [
                  "c:\\Windows\\Logs\\*.txt"
                ]
              }
            },
            "recordDelimiter": {
              "regexDelimiter": {
                "pattern": "\\n",
                "matchIndex": 0,
                "numberdGroup": null
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
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

### Collect IIS log

The following sample adds collection of [IIS logs](../agents/data-sources-iis-logs.md) to an existing workspace.

#### Template file

# [Bicep](#tab/bicep)

```bicep
@description('Specify the name of the workspace.')
param workspaceName string

@description('Specify the location in which to create the workspace.')
param location string

resource workspace 'Microsoft.OperationalInsights/workspaces@2021-12-01-preview' = {
  name: workspaceName
  location: location
  properties: {}
}

resource IISLogDataSource 'Microsoft.OperationalInsights/workspaces/datasources@2020-08-01' = {
  parent: workspace
  name: 'IISLog'
  kind: 'IISLogs'
  properties: {
    state: 'OnPremiseEnabled'
  }
}
```

# [JSON](#tab/json)

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "type": "string",
      "metadata": {
        "description": "Specify the name of the workspace."
      }
    },
    "location": {
      "type": "string",
      "metadata": {
        "description": "Specify the location in which to create the workspace."
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.OperationalInsights/workspaces",
      "apiVersion": "2021-12-01-preview",
      "name": "[parameters('workspaceName')]",
      "location": "[parameters('location')]",
      "properties": {}
    },
    {
      "type": "Microsoft.OperationalInsights/workspaces/dataSources",
      "apiVersion": "2020-08-01",
      "name": "[format('{0}/{1}', parameters('workspaceName'), 'IISLog')]",
      "kind": "IISLogs",
      "properties": {
        "state": "OnPremiseEnabled"
      },
      "dependsOn": [
        "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspaceName'))]"
      ]
    }
  ]
}
```

---

#### Parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "workspaceName": {
      "value": "MyWorkspace"
    },
    "location": {
      "value": "eastus"
    }
  }
}
```

## Next steps

- [Get other sample templates for Azure Monitor](../resource-manager-samples.md).
- [Learn more about Log Analytics workspaces](./quick-create-workspace.md).
- [Learn more about agent data sources](../agents/agent-data-sources.md).
