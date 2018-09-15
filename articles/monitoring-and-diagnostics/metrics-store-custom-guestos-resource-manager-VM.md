---
title: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine
description: Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine
author: anirudhcavale
services: azure-monitor
ms.service: azure-monitor
ms.topic: howto
ms.date: 09/24/2018
ms.author: ancav
ms.component: alerts
---
# Send guest OS metrics to the Azure Monitor metric store using a Resource Manager template for a Windows Virtual Machine

The Azure Monitor [Windows Azure Diagnostics extension](azure-diagnostics.md) (WAD) allows you to collect metrics and logs from the Guest Operation System (OS) running as part of a Virtual Machine, Cloud Service or Service Fabric cluster.  The extension can send telemetry to many different locations listed in the previously linked article.  

Starting with WAD version 1.11, you can write metrics directly to the Azure Monitor metrics store where standard platform metrics are already collected. Storing them in this location allows you to access the same actions available for platform metrics.  Actions include near-real time alerting, charting, routing, access from REST API and more.  In the past, the WAD extension wrote to Azure Storage, but not the Azure Monitor data store.  

If you are new to Resource Manager templates,  learn about [template deployments](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-overview.md), and their structure and syntax.  

## Pre-requisites: 

You will need to be a [Service Administrator or co-administrator](https://docs.microsoft.com/en-us/azure/billing/billing-add-change-azure-subscription-administrator.d) on your Azure subscription 

Your subscription must be registered with [Microsoft.Insights](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-6.8.1) 

You will need to have [Azure PowerShell](https://docs.microsoft.com/en-us/powershell/azure/overview?view=azurermps-6.8.1)  installed, or you can use [Azure CloudShell](https://docs.microsoft.com/en-us/azure/cloud-shell/overview.md) 


## Setup Azure Monitor as a data sink 
The Azure Diagnostics extension uses a feature called “data sinks” to route metrics and logs to different locations.  Use the new data sink “Azure Monitor” for this process.  

The following steps show how to use a Resource Manager template and PowerShell to deploy a VM using the new “Azure Monitor” data sink. 


## Author Resource Manager Template 
For this example, you can use a publicly available sample template.  

https://github.com/Azure/azure-quickstart-templates/tree/master/101-vm-simple-windows 

**Azuredeploy.json** is a pre-configured ARM template for deployment of a Virtual Machine. 

**Azuredeploy.parameters.json** is a parameters file that stores information like what username and password you would like to set for your VM. During deployment the Resource Manager template uses the parameters set in this file. 


1. Save both files locally. 

1. Open the *azuredeploy.parameters.json* file 

1. Enter values for *adminUsername* and *adminPassword* for the VM. These parameters are used for remote access to the VM. 

1. Open the *azuredeploy.json* file 

1. Add a storage account ID to the **variables** section of the template after the entry for **storageAccountName**.  

[!code-json[name](code/metrics-custom-guestos-resource-manager-VM/metrics-custom-guestos-resource-manager-VM.json)]

Testing range

[!code-json[](code/metrics-custom-guestos-resource-manager-VM/metrics-custom-guestos-resource-manager-VM.json?range=13-18&highlight=2,5)]

Testing range and highlighting

[!code-json[](code/metrics-custom-guestos-resource-manager-VM/metrics-custom-guestos-resource-manager-VM.json?range=13-18&?ame=snippet_Create&highlight=4,6-7,14-21)]




STOPPED HERE
=============
https://review.docs.microsoft.com/en-us/help/contribute/code-in-docs?branch=master



[!code-html[](intro/samples/cu/Views/Students/Details.cshtml?range=13-18&highlight=2,5)]

[!code-csharp[](intro/samples/cu/Controllers/StudentsController.cs?name=snippet_Create&highlight=4,6-7,14-21)]`




This article shows you how to use an [Azure Resource Manager template](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-authoring-templates) to configure activity log alerts. By using templates, you can easily set up many alerts that activate based on specific activity log event conditions as part of your automated deployment process.

The basic steps are:

1. Create a template as a JSON file that describes how to create the activity log alert.

2. Deploy the template by using [any deployment method](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-template-deploy).

## Resource Manager template for an activity log alert
To create an activity log alert by using a Resource Manager template, you create a resource of the type `microsoft.insights/activityLogAlerts`. Then you fill in all related properties. Here's a template that creates an activity log alert.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "activityLogAlertName": {
      "type": "string",
      "metadata": {
        "description": "Unique name (within the Resource Group) for the Activity log alert."
      }
    },
    "activityLogAlertEnabled": {
      "type": "bool",
      "defaultValue": true,
      "metadata": {
        "description": "Indicates whether or not the alert is enabled."
      }
    },
    "actionGroupResourceId": {
      "type": "string",
      "metadata": {
        "description": "Resource Id for the Action group."
      }
    }
  },
  "resources": [   
    {
      "type": "Microsoft.Insights/activityLogAlerts",
      "apiVersion": "2017-04-01",
      "name": "[parameters('activityLogAlertName')]",      
      "location": "Global",
      "properties": {
        "enabled": "[parameters('activityLogAlertEnabled')]",
        "scopes": [
            "[subscription().id]"
        ],        
        "condition": {
          "allOf": [
            {
              "field": "category",
              "equals": "Administrative"
            },
            {
              "field": "operationName",
              "equals": "Microsoft.Resources/deployments/write"
            },
            {
              "field": "resourceType",
              "equals": "Microsoft.Resources/deployments"
            }
          ]
        },
        "actions": {
          "actionGroups":
          [
            {
              "actionGroupId": "[parameters('actionGroupResourceId')]"
            }
          ]
        }
      }
    }
  ]
}
```

Visit our [Azure Quickstart gallery](https://azure.microsoft.com/resources/templates/?resourceType=Microsoft.Insights) for some examples of activity log alert templates.

> [!NOTE]

> You can also create activity log alert rules using the enhanced user experience in Monitor > [Alerts (Preview)](monitoring-overview-unified-alerts.md). For more information on how to create these, see [this article](monitoring-activity-log-alerts-new-experience.md).

## Next steps
- Learn more about [alerts](monitoring-overview-alerts.md).
- Learn how to add [action groups by using a Resource Manager template](monitoring-create-action-group-with-resource-manager-template.md).
- Learn how to [create an activity log alert to monitor all autoscale engine operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-alert).
- Learn how to [create an activity log alert to monitor all failed autoscale scale-in/scale-out operations on your subscription](https://github.com/Azure/azure-quickstart-templates/tree/master/monitor-autoscale-failed-alert).
