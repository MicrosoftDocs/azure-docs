---
title: Azure Automation resources in management solutions | Microsoft Docs
description: Management solutions will typically include runbooks in Azure Automation to automate processes such as collecting and processing monitoring data.  This article describes how to include runbooks and their related resources in a solution.
services: monitoring
documentationcenter: ''
author: bwren
manager: carmonm
editor: tysonn
ms.assetid: 5281462e-f480-4e5e-9c19-022f36dce76d
ms.service: azure-monitor
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 05/24/2017
ms.author: bwren
ms.custom: H1Hack27Feb2017
---
# Adding Azure Automation resources to a management solution (Preview)
> [!NOTE]
> This is preliminary documentation for creating management solutions which are currently in preview. Any schema described below is subject to change.   


[Management solutions]( solutions.md) will typically include runbooks in Azure Automation to automate processes such as collecting and processing monitoring data.  In addition to runbooks, Automation accounts includes assets such as variables and schedules that support the runbooks used in the solution.  This article describes how to include runbooks and their related resources in a solution.

> [!NOTE]
> The samples in this article use parameters and variables that are either required or common to management solutions  and described in [Design and build a management solution in Azure]( solutions-creating.md) 


## Prerequisites
This article assumes that you're already familiar with the following information.

- How to [create a management solution]( solutions-creating.md).
- The structure of a [solution file]( solutions-solution-file.md).
- How to [author Resource Manager templates](../../azure-resource-manager/resource-group-authoring-templates.md)

## Automation account
All resources in Azure Automation are contained in an [Automation account](../../automation/automation-security-overview.md#automation-account-overview).  As described in [Log Analytics workspace and Automation account]( solutions.md#log-analytics-workspace-and-automation-account) the Automation account isn't included in the management solution but must exist before the solution is installed.  If it isn't available, then the solution install will fail.

The name of each Automation resource includes the name of its Automation account.  This is done in the solution with the **accountName** parameter as in the following example of a runbook resource.

    "name": "[concat(parameters('accountName'), '/MyRunbook'))]"


## Runbooks
You should include any runbooks used by the solution in the solution file so that they're created when the solution is installed.  You cannot contain the body of the runbook in the template though, so you should publish the runbook to a public location where it can be accessed by any user installing your solution.

[Azure Automation runbook](../../automation/automation-runbook-types.md) resources have a type of **Microsoft.Automation/automationAccounts/runbooks** and have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 

	{
		"name": "[concat(parameters('accountName'), '/', variables('Runbook').Name)]",
		"type": "Microsoft.Automation/automationAccounts/runbooks",
		"apiVersion": "[variables('AutomationApiVersion')]",
		"dependsOn": [
		],
		"location": "[parameters('regionId')]",
		"tags": { },
		"properties": {
			"runbookType": "[variables('Runbook').Type]",
			"logProgress": "true",
			"logVerbose": "true",
			"description": "[variables('Runbook').Description]",
			"publishContentLink": {
				"uri": "[variables('Runbook').Uri]",
				"version": [variables('Runbook').Version]"
			}
		}
	}


The properties for runbooks are described in the following table.

| Property | Description |
|:--- |:--- |
| runbookType |Specifies the types of the runbook. <br><br> Script - PowerShell script <br>PowerShell - PowerShell workflow <br> GraphPowerShell - Graphical PowerShell script runbook <br> GraphPowerShellWorkflow - Graphical PowerShell workflow runbook |
| logProgress |Specifies whether [progress records](../../automation/automation-runbook-output-and-messages.md) should be generated for the runbook. |
| logVerbose |Specifies whether [verbose records](../../automation/automation-runbook-output-and-messages.md) should be generated for the runbook. |
| description |Optional description for the runbook. |
| publishContentLink |Specifies the content of the runbook. <br><br>uri - Uri to the content of the runbook.  This will be a .ps1 file for PowerShell and Script runbooks, and an exported graphical runbook file for a Graph runbook.  <br> version - Version of the runbook for your own tracking. |


## Automation jobs
When you start a runbook in Azure Automation, it creates an automation job.  You can add an automation job resource to your solution to automatically start a runbook when the management solution is installed.  This method is typically used to start runbooks that are used for initial configuration of the solution.  To start a runbook at regular intervals, create a [schedule](#schedules) and a [job schedule](#job-schedules)

Job resources have a type of **Microsoft.Automation/automationAccounts/jobs** and have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 

    {
      "name": "[concat(parameters('accountName'), '/', parameters('Runbook').JobGuid)]",
      "type": "Microsoft.Automation/automationAccounts/jobs",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "location": "[parameters('regionId')]",
      "dependsOn": [
        "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('Runbook').Name)]"
      ],
      "tags": { },
      "properties": {
        "runbook": {
          "name": "[variables('Runbook').Name]"
        },
        "parameters": {
          "Parameter1": "[[variables('Runbook').Parameter1]",
          "Parameter2": "[[variables('Runbook').Parameter2]"
        }
      }
    }

The properties for automation jobs are described in the following table.

| Property | Description |
|:--- |:--- |
| runbook |Single name entity with the name of the runbook to start. |
| parameters |Entity for each parameter value required by the runbook. |

The job includes the runbook name and any parameter values to be sent to the runbook.  The job should [depend on]( solutions-solution-file.md#resources) the runbook that it's starting since the runbook must be created before the job.  If you have multiple runbooks that should be started you can define their order by having a job depend on any other jobs that should be run first.

The name of a job resource must contain a GUID which is typically assigned by a parameter.  You can read more about GUID parameters in [Creating a management solution file in Azure]( solutions-solution-file.md#parameters).  


## Certificates
[Azure Automation certificates](../../automation/automation-certificates.md) have a type of **Microsoft.Automation/automationAccounts/certificates** and have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 

    {
      "name": "[concat(parameters('accountName'), '/', variables('Certificate').Name)]",
      "type": "Microsoft.Automation/automationAccounts/certificates",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "location": "[parameters('regionId')]",
      "tags": { },
      "dependsOn": [
      ],
      "properties": {
        "base64Value": "[variables('Certificate').Base64Value]",
        "thumbprint": "[variables('Certificate').Thumbprint]"
      }
    }



The properties for Certificates resources are described in the following table.

| Property | Description |
|:--- |:--- |
| base64Value |Base 64 value for the certificate. |
| thumbprint |Thumbprint for the certificate. |



## Credentials
[Azure Automation credentials](../../automation/automation-credentials.md) have a type of **Microsoft.Automation/automationAccounts/credentials** and have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 


    {
      "name": "[concat(parameters('accountName'), '/', variables('Credential').Name)]",
      "type": "Microsoft.Automation/automationAccounts/credentials",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "location": "[parameters('regionId')]",
      "tags": { },
      "dependsOn": [
      ],
      "properties": {
        "userName": "[parameters('credentialUsername')]",
        "password": "[parameters('credentialPassword')]"
      }
    }

The properties for Credential resources are described in the following table.

| Property | Description |
|:--- |:--- |
| userName |User name for the credential. |
| password |Password for the credential. |


## Schedules
[Azure Automation schedules](../../automation/automation-schedules.md) have a type of **Microsoft.Automation/automationAccounts/schedules** and have the following structure. This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 

    {
      "name": "[concat(parameters('accountName'), '/', variables('Schedule').Name)]",
      "type": "microsoft.automation/automationAccounts/schedules",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "tags": { },
      "dependsOn": [
      ],
      "properties": {
        "description": "[variables('Schedule').Description]",
        "startTime": "[parameters('scheduleStartTime')]",
        "timeZone": "[parameters('scheduleTimeZone')]",
        "isEnabled": "[variables('Schedule').IsEnabled]",
        "interval": "[variables('Schedule').Interval]",
        "frequency": "[variables('Schedule').Frequency]"
      }
    }

The properties for schedule resources are described in the following table.

| Property | Description |
|:--- |:--- |
| description |Optional description for the schedule. |
| startTime |Specifies the start time of a schedule as a DateTime object. A string can be provided if it can be converted to a valid DateTime. |
| isEnabled |Specifies whether the schedule is enabled. |
| interval |The type of interval for the schedule.<br><br>day<br>hour |
| frequency |Frequency that the schedule should fire in number of days or hours. |

Schedules must have a start time with a value greater than the current time.  You cannot provide this value with a variable since you would have no way of knowing when it's going to be installed.

Use one of the following two strategies when using schedule resources in a solution.

- Use a parameter for the start time of the schedule.  This will prompt the user to provide a value when they install the solution.  If you have multiple schedules, you could use a single parameter value for more than one of them.
- Create the schedules using a runbook that starts when the solution is installed.  This removes the requirement of the user to specify a time, but you can't contain the schedule in your solution so it will be removed when the solution is removed.


### Job schedules
Job schedule resources link a runbook with a schedule.  They have a type of **Microsoft.Automation/automationAccounts/jobSchedules** and have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names. 

    {
      "name": "[concat(parameters('accountName'), '/', variables('Schedule').LinkGuid)]",
      "type": "microsoft.automation/automationAccounts/jobSchedules",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "location": "[parameters('regionId')]",
      "dependsOn": [
        "[resourceId('Microsoft.Automation/automationAccounts/runbooks/', parameters('accountName'), variables('Runbook').Name)]",
        "[resourceId('Microsoft.Automation/automationAccounts/schedules/', parameters('accountName'), variables('Schedule').Name)]"
      ],
      "tags": {
      },
      "properties": {
        "schedule": {
          "name": "[variables('Schedule').Name]"
        },
        "runbook": {
          "name": "[variables('Runbook').Name]"
        }
      }
    }


The properties for job schedules are described in the following table.

| Property | Description |
|:--- |:--- |
| schedule name |Single **name** entity with the name of the schedule. |
| runbook name  |Single **name** entity with the name of the runbook.  |



## Variables
[Azure Automation variables](../../automation/automation-variables.md) have a type of **Microsoft.Automation/automationAccounts/variables** and have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names.

    {
      "name": "[concat(parameters('accountName'), '/', variables('Variable').Name)]",
      "type": "microsoft.automation/automationAccounts/variables",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "tags": { },
      "dependsOn": [
      ],
      "properties": {
        "description": "[variables('Variable').Description]",
        "isEncrypted": "[variables('Variable').Encrypted]",
        "type": "[variables('Variable').Type]",
        "value": "[variables('Variable').Value]"
      }
    }

The properties for variable resources are described in the following table.

| Property | Description |
|:--- |:--- |
| description | Optional description for the variable. |
| isEncrypted | Specifies whether the variable should be encrypted. |
| type | This property currently has no effect.  The data type of the variable will be determined by the initial value. |
| value | Value for the variable. |

> [!NOTE]
> The **type** property currently has no effect on the variable being created.  The data type for the variable will be determined by the value.  

If you set the initial value for the variable, it must be configured as the correct data type.  The following table provides the different data types allowable and their syntax.  Note that values in JSON are expected to always be enclosed in quotes with any special characters within the quotes.  For example, a string value would be specified by quotes around the string (using the escape character (\\)) while a numeric value would be specified with one set of quotes.

| Data type | Description | Example | Resolves to |
|:--|:--|:--|:--|
| string   | Enclose value in double quotes.  | "\"Hello world\"" | "Hello world" |
| numeric  | Numeric value with single quotes.| "64" | 64 |
| boolean  | **true** or **false** in quotes.  Note that this value must be lowercase. | "true" | true |
| datetime | Serialized date value.<br>You can use the ConvertTo-Json cmdlet in PowerShell to generate this value for a particular date.<br>Example: get-date "5/24/2017 13:14:57" \| ConvertTo-Json | "\\/Date(1495656897378)\\/" | 2017-05-24 13:14:57 |

## Modules
Your management solution does not need to define [global modules](../../automation/automation-integration-modules.md) used by your runbooks because they will always be available in your Automation account.  You do need to include a resource for any other module used by your runbooks.

[Integration modules](../../automation/automation-integration-modules.md) have a type of **Microsoft.Automation/automationAccounts/modules** and have the following structure.  This includes common variables and parameters so that you can copy and paste this code snippet into your solution file and change the parameter names.

    {
      "name": "[concat(parameters('accountName'), '/', variables('Module').Name)]",
      "type": "Microsoft.Automation/automationAccounts/modules",
      "apiVersion": "[variables('AutomationApiVersion')]",
      "dependsOn": [
      ],
      "properties": {
        "contentLink": {
          "uri": "[variables('Module').Uri]"
        }
      }
    }


The properties for module resources are described in the following table.

| Property | Description |
|:--- |:--- |
| contentLink |Specifies the content of the module. <br><br>uri - Uri to the content of the module.  This will be a .ps1 file for PowerShell and Script runbooks, and an exported graphical runbook file for a Graph runbook.  <br> version - Version of the module for your own tracking. |

The runbook should depend on the module resource to ensure that it's created before the runbook.

### Updating modules
If you update a management solution that includes a runbook that uses a schedule, and the new version of your solution has a new module used by that runbook, then the runbook may use the old version of the module.  You should include the following runbooks in your solution and create a job to run them before any other runbooks.  This will ensure that any modules are updated as required before the runbooks are loaded.

* [Update-ModulesinAutomationToLatestVersion](https://www.powershellgallery.com/packages/Update-ModulesInAutomationToLatestVersion/1.03/) will ensure that all of the modules used by runbooks in your solution are the latest version.  
* [ReRegisterAutomationSchedule-MS-Mgmt](https://www.powershellgallery.com/packages/ReRegisterAutomationSchedule-MS-Mgmt/1.0/) will reregister all of the schedule resources to ensure that the runbooks linked to them with use the latest modules.




## Sample
Following is a sample of a solution that include that includes the following resources:

- Runbook.  This is a sample runbook stored in a public GitHub repository.
- Automation job that starts the runbook when the solution is installed.
- Schedule and job schedule to start the runbook at regular intervals.
- Certificate.
- Credential.
- Variable.
- Module.  This is the [OMSIngestionAPI module](https://www.powershellgallery.com/packages/OMSIngestionAPI/1.5) for writing data to Log Analytics. 

The sample uses [standard solution parameters]( solutions-solution-file.md#parameters) variables that would commonly be used in a solution as opposed to hardcoding values in the resource definitions.


	{
	  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
	  "contentVersion": "1.0.0.0",
	  "parameters": {
	    "workspaceName": {
	      "type": "string",
	      "metadata": {
	        "Description": "Name of Log Analytics workspace."
	      }
	    },
	    "accountName": {
	      "type": "string",
	      "metadata": {
	        "Description": "Name of Automation account."
	      }
	    },
	    "workspaceregionId": {
	      "type": "string",
	      "metadata": {
	        "Description": "Region of Log Analytics workspace."
	      }
	    },
	    "regionId": {
	      "type": "string",
	      "metadata": {
	        "Description": "Region of Automation account."
	      }
	    },
	    "pricingTier": {
	      "type": "string",
	      "metadata": {
	        "Description": "Pricing tier of both Log Analytics workspace and Azure Automation account."
	      }
	    },
	    "certificateBase64Value": {
	      "type": "string",
	      "metadata": {
	        "Description": "Base 64 value for certificate."
	      }
	    },
	    "certificateThumbprint": {
	      "type": "securestring",
	      "metadata": {
	        "Description": "Thumbprint for certificate."
	      }
	    },
	    "credentialUsername": {
	      "type": "string",
	      "metadata": {
	        "Description": "Username for credential."
	      }
	    },
	    "credentialPassword": {
	      "type": "securestring",
	      "metadata": {
	        "Description": "Password for credential."
	      }
	    },
	    "scheduleStartTime": {
	      "type": "string",
	      "metadata": {
	        "Description": "Start time for schedule."
	      }
	    },
	    "scheduleTimeZone": {
	      "type": "string",
	      "metadata": {
	        "Description": "Time zone for schedule."
	      }
	    },
	    "scheduleLinkGuid": {
	      "type": "string",
	      "metadata": {
	        "description": "GUID for the schedule link to runbook.",
	        "control": "guid"
	      }
	    },
	    "runbookJobGuid": {
	      "type": "string",
	      "metadata": {
	        "description": "GUID for the runbook job.",
	        "control": "guid"
	      }
	    }
	  },
	  "variables": {
	    "SolutionName": "MySolution",
	    "SolutionVersion": "1.0",
	    "SolutionPublisher": "Contoso",
	    "ProductName": "SampleSolution",
	
	    "LogAnalyticsApiVersion": "2015-11-01-preview",
	    "AutomationApiVersion": "2015-10-31",
	
	    "Runbook": {
	      "Name": "MyRunbook",
	      "Description": "Sample runbook",
	      "Type": "PowerShell",
	      "Uri": "https://raw.githubusercontent.com/user/myrepo/master/samples/MyRunbook.ps1",
	      "JobGuid": "[parameters('runbookJobGuid')]"
	    },
	
	    "Certificate": {
	      "Name": "MyCertificate",
	      "Base64Value": "[parameters('certificateBase64Value')]",
	      "Thumbprint": "[parameters('certificateThumbprint')]"
	    },
	
	    "Credential": {
	      "Name": "MyCredential",
	      "UserName": "[parameters('credentialUsername')]",
	      "Password": "[parameters('credentialPassword')]"
	    },
	
	    "Schedule": {
	      "Name": "MySchedule",
	      "Description": "Sample schedule",
	      "IsEnabled": "true",
	      "Interval": "1",
	      "Frequency": "hour",
	      "StartTime": "[parameters('scheduleStartTime')]",
	      "TimeZone": "[parameters('scheduleTimeZone')]",
	      "LinkGuid": "[parameters('scheduleLinkGuid')]"
	    },
	
	    "Variable": {
	      "Name": "MyVariable",
	      "Description": "Sample variable",
	      "Encrypted": 0,
	      "Type": "string",
	      "Value": "'This is my string value.'"
	    },
	
	    "Module": {
	      "Name": "OMSIngestionAPI",
	      "Uri": "https://devopsgallerystorage.blob.core.windows.net/packages/omsingestionapi.1.3.0.nupkg"
	    }
	  },
	  "resources": [
	    {
	      "name": "[concat(variables('SolutionName'), '[' ,parameters('workspacename'), ']')]",
	      "location": "[parameters('workspaceRegionId')]",
	      "tags": { },
	      "type": "Microsoft.OperationsManagement/solutions",
	      "apiVersion": "[variables('LogAnalyticsApiVersion')]",
	      "dependsOn": [
	        "[resourceId('Microsoft.Automation/automationAccounts/runbooks/', parameters('accountName'), variables('Runbook').Name)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/jobs/', parameters('accountName'), variables('Runbook').JobGuid)]",
			"[resourceId('Microsoft.Automation/automationAccounts/certificates/', parameters('accountName'), variables('Certificate').Name)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/credentials/', parameters('accountName'), variables('Credential').Name)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/schedules/', parameters('accountName'), variables('Schedule').Name)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/jobSchedules/', parameters('accountName'), variables('Schedule').LinkGuid)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/variables/', parameters('accountName'), variables('Variable').Name)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/modules/', parameters('accountName'), variables('Module').Name)]"
	      ],
	      "properties": {
	        "workspaceResourceId": "[resourceId('Microsoft.OperationalInsights/workspaces', parameters('workspacename'))]",
	        "referencedResources": [
	          "[resourceId('Microsoft.Automation/automationAccounts/modules/', parameters('accountName'), variables('Module').Name)]"
	        ],
	        "containedResources": [
	          "[resourceId('Microsoft.Automation/automationAccounts/runbooks/', parameters('accountName'), variables('Runbook').Name)]",
	          "[resourceId('Microsoft.Automation/automationAccounts/jobs/', parameters('accountName'), variables('Runbook').JobGuid)]",
			  "[resourceId('Microsoft.Automation/automationAccounts/certificates/', parameters('accountName'), variables('Certificate').Name)]",
	          "[resourceId('Microsoft.Automation/automationAccounts/credentials/', parameters('accountName'), variables('Credential').Name)]",
	          "[resourceId('Microsoft.Automation/automationAccounts/schedules/', parameters('accountName'), variables('Schedule').Name)]",
	          "[resourceId('Microsoft.Automation/automationAccounts/jobSchedules/', parameters('accountName'), variables('Schedule').LinkGuid)]",
	          "[resourceId('Microsoft.Automation/automationAccounts/variables/', parameters('accountName'), variables('Variable').Name)]"
	        ]
	      },
	      "plan": {
	        "name": "[concat(variables('SolutionName'), '[' ,parameters('workspaceName'), ']')]",
	        "Version": "[variables('SolutionVersion')]",
	        "product": "[variables('ProductName')]",
	        "publisher": "[variables('SolutionPublisher')]",
	        "promotionCode": ""
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Runbook').Name)]",
	      "type": "Microsoft.Automation/automationAccounts/runbooks",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "dependsOn": [
	      ],
	      "location": "[parameters('regionId')]",
	      "tags": { },
	      "properties": {
	        "runbookType": "[variables('Runbook').Type]",
	        "logProgress": "true",
	        "logVerbose": "true",
	        "description": "[variables('Runbook').Description]",
	        "publishContentLink": {
	          "uri": "[variables('Runbook').Uri]",
	          "version": "1.0.0.0"
	        }
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Runbook').JobGuid)]",
	      "type": "Microsoft.Automation/automationAccounts/jobs",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "location": "[parameters('regionId')]",
	      "dependsOn": [
	        "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('Runbook').Name)]"
	      ],
	      "tags": { },
	      "properties": {
	        "runbook": {
	          "name": "[variables('Runbook').Name]"
	        },
	        "parameters": {
	          "targetSubscriptionId": "[subscription().subscriptionId]",
	          "resourcegroup": "[resourceGroup().name]",
	          "automationaccount": "[parameters('accountName')]"
	        }
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Certificate').Name)]",
	      "type": "Microsoft.Automation/automationAccounts/certificates",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "location": "[parameters('regionId')]",
	      "tags": { },
	      "dependsOn": [
	      ],
	      "properties": {
	        "Base64Value": "[variables('Certificate').Base64Value]",
	        "Thumbprint": "[variables('Certificate').Thumbprint]"
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Credential').Name)]",
	      "type": "Microsoft.Automation/automationAccounts/credentials",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "location": "[parameters('regionId')]",
	      "tags": { },
	      "dependsOn": [
	      ],
	      "properties": {
	        "userName": "[variables('Credential').UserName]",
	        "password": "[variables('Credential').Password]"
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Schedule').Name)]",
	      "type": "microsoft.automation/automationAccounts/schedules",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "tags": { },
	      "dependsOn": [
	      ],
	      "properties": {
	        "description": "[variables('Schedule').Description]",
	        "startTime": "[variables('Schedule').StartTime]",
	        "timeZone": "[variables('Schedule').TimeZone]",
	        "isEnabled": "[variables('Schedule').IsEnabled]",
	        "interval": "[variables('Schedule').Interval]",
	        "frequency": "[variables('Schedule').Frequency]"
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Schedule').LinkGuid)]",
	      "type": "microsoft.automation/automationAccounts/jobSchedules",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "location": "[parameters('regionId')]",
	      "dependsOn": [
	        "[resourceId('Microsoft.Automation/automationAccounts/runbooks/', parameters('accountName'), variables('Runbook').Name)]",
	        "[resourceId('Microsoft.Automation/automationAccounts/schedules/', parameters('accountName'), variables('Schedule').Name)]"
	      ],
	      "tags": {
	      },
	      "properties": {
	        "schedule": {
	          "name": "[variables('Schedule').Name]"
	        },
	        "runbook": {
	          "name": "[variables('Runbook').Name]"
	        }
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Variable').Name)]",
	      "type": "microsoft.automation/automationAccounts/variables",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "tags": { },
	      "dependsOn": [
	      ],
	      "properties": {
	        "description": "[variables('Variable').Description]",
	        "isEncrypted": "[variables('Variable').Encrypted]",
	        "type": "[variables('Variable').Type]",
	        "value": "[variables('Variable').Value]"
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('Module').Name)]",
	      "type": "Microsoft.Automation/automationAccounts/modules",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "dependsOn": [
	      ],
	      "properties": {
	        "contentLink": {
	          "uri": "[variables('Module').Uri]"
	        }
	      }
	    }
	
	  ],
	  "outputs": { }
	}




## Next steps
* [Add a view to your solution]( solutions-resources-views.md) to visualize collected data.
