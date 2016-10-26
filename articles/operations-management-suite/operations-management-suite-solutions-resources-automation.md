<properties
   pageTitle="Automation resources in OMS solutions | Microsoft Azure"
   description="Solutions in OMS will typically include runbooks in Azure Automation to automate processes such as collecting and processing monitoring data.  This article describes how to include runbooks and their related resources in a solution."
   services="operations-management-suite"
   documentationCenter=""
   authors="bwren"
   manager="jwhit"
   editor="tysonn" />
<tags
   ms.service="operations-management-suite"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="10/19/2016"
   ms.author="bwren" />

# Automation resources in OMS solutions (Preview)

>[AZURE.NOTE]This is preliminary documentation for creating management solutions in OMS which are currently in preview. Any schema described below is subject to change.   

[Management solutions in OMS](operations-management-suite-solutions.md) will typically include runbooks in Azure Automation to automate processes such as collecting and processing monitoring data.  In addition to runbooks, Automation accounts includes assets such as variables and schedules that support the runbooks used in the solution.  This article describes how to include runbooks and their related resources in a solution.

>[AZURE.NOTE]The samples in this article use parameters and variables that are either required or common to management solutions  and described in [Creating management solutions in Operations Management Suite (OMS)](operations-management-suite-solutions-creating.md) 


## Prerequisites
This article assumes that you're already familiar with how to [create a management solution](operations-management-suite-solutions-creating.md) and the structure of a solution file.

## Samples
You can get sample Resource Manager templates for Automation resources from the [QuickStart templates in GitHub](https://github.com/azureautomation/automation-packs/tree/master/101-sample-automation-resource-templates).

## Automation account
All resources in Azure Automation are contained in an [Automation account](../automation/automation-security-overview.md#automation-account-overview).  As described in [OMS workspace and Automation account](operations-management-suite-solutions-creating.md#oms-workspace-and-automation-account) the Automation account isn't included in the management solution but must exist before the solution is installed.  If it isn't available, then the solution install will fail.

The name of their Automation account is in the name of each Automation resource.  This is done in the solution with the **accountName** parameter as in the following example of a runbook resource.
	
	"name": "[concat(parameters('accountName'), '/MyRunbook'))]"


## Runbooks
[Azure Automation runbook](../automation/automation-runbook-types.md) resources have a type of **Microsoft.Automation/automationAccounts/runbooks** and have the properties in the following table.

| Property | Description |
|:--|:--|
| runbookType | Specifies the types of the runbook. <br><br> Script - PowerShell script <br>PowerShell - PowerShell workflow <br> GraphPowerShell - Graphical PowerShell script runbook <br> GraphPowerShellWorkflow - Graphical PowerShell workflow runbook   |
| logProgress | Specifies whether [progress records](../automation/automation-runbook-output-and-messages.md) should be generated for the runbook. |
| logVerbose  | Specifies whether [verbose records](../automation/automation-runbook-output-and-messages.md) should be generated for the runbook. |
| description | Optional description for the runbook. |
| publishContentLink | Specifies the content of the runbook. <br><br>uri - Uri to the content of the runbook.  This will be a .ps1 file for PowerShell and Script runbooks, and an exported graphical runbook file for a Graph runbook.  <br> version - Version of the runbook for your own tracking. |

An example of a runbook resource is below.  In this case, it retrieves the runbook from the [PowerShell Gallery](https://www.powershellgallery.com).

	"name": "[concat(parameters('accountName'), '/Start-AzureV2VMs'))]",
	"type": "Microsoft.Automation/automationAccounts/runbooks",
	"apiVersion": "[variables('AutomationApiVersion')]",
	"location": "[parameters('regionId')]",
	"dependsOn": [
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('startVmsRunbookName'))]"
	],
	"tags": { },
	"properties": {
		"runbookType": "PowerShell",
		"logProgress": "true",
		"logVerbose": "true",
		"description": "",
		"publishContentLink": {
			"uri": "https://www.powershellgallery.com/api/v2/items/psscript/package/Update-ModulesInAutomationToLatestVersion/1.0/Start-AzureV2VMs.ps1",
			"version": "1.0"
		}
	}

### Starting a runbook
There are two methods to start a runbook in a management solution.

- To start the runbook when the solution is installed, create a [job resource](#automation-jobs) as described below.
- To start the runbook on a schedule, create a [schedule resource](#schedules) as described below. 


## Automation jobs
In order to start a runbook when the management solution is installed, you create a **job** resource.  Job resources have a type of **Microsoft.Automation/automationAccounts/jobs** and have the properties in the following table.

| Property | Description |
|:--|:--|
| runbook    | Single **name** entity with the name of the runbook.  |
| parameters | Entity for each parameter required by the runbook. |


The job includes the runbook name and any parameter values to be sent to the runbook.  The job must [depend on](operations-management-suite-solutions-creating.md#resources) the runbook that it's starting since the runbook must be created before the job.  You also create dependencies on other jobs for runbooks that should be completed before the current one.

The name of a job resource must contain a GUID which is typically assigned by a parameter.  You can read more about GUID parameters in [Creating solutions in Operations Management Suite (OMS)](operations-management-suite-solutions-creating.md#parameters).  

Following is an example of a job resource that starts a runbook when the management solution is installed.  One other runbooks must be completed before this one starts, so it has dependencies on the jobs for that runbook.  The details for the job are provided through parameters and variables rather than being specified directly.

	{
		"name": "[concat(parameters('accountName'), '/', parameters('startVmsRunbookGuid'))]",
		"type": "Microsoft.Automation/automationAccounts/jobs",
		"apiVersion": "[variables('AutomationApiVersion')]",
		"location": "[parameters('regionId')]",
		"dependsOn": [
			"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('startVmsRunbookName'))]",
			"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/jobs/', parameters('initialPrepRunbookGuid'))]"
		],
		"tags": { },
		"properties": {
			"runbook": {
				"name": "[variables('startVmsRunbookName')]"
			},
			"parameters": {
				"AzureConnectionAssetName": "[variables('AzureConnectionAssetName')]",
				"ResourceGroupName": "[variables('ResourceGroupName')]"
			}
		}
	}


## Certificates
[Azure Automation certificates](../automation/automation-certificates.md) have a type of **Microsoft.Automation/automationAccounts/certificates** and have the properties in the following table.

| Property | Description |
|:--|:--|
| base64Value   | Base 64 value for the certificate. |
| thumbprint    | Thumbprint for the certificate. |

An example of a certificate resource is below.

	"name": "[concat(parameters('accountName'), '/MyCertificate')]",
	"type": "certificates",
	"apiVersion": "2015-01-01-preview",
	"location": "[parameters('regionId')]",
	"tags": {},
	"dependsOn": [
	],
	"properties": {
		"base64Value": "MIIC1jCCAA8gAwIAVgIYJY4wXCXH/YAHMtALh7qEFzANAgkqhkiG5w0AAQUFGDAUMRIwEBYDVQQDEwlsA3NhAGevc3QqHhcNMTZwNjI5MHQxMjAsWhcNOjEwNjI5NKWwMDAwWjAURIwEAYDVQQBEwlsA2NhAGhvc3QwggEiMA0GCSqGSIA3DQEAAQUAA4IADwAwggEKAoIAAQDIyzv2A0RUg1/AAryI9W1DGAHAqqGdlFfTkUSDfv+hEZTAwKv0p8daqY6GroT8Du7ctQmrxJsy8JxIpDWxUaWwXtvv1kR9eG9Vs5dw8gqhjtOwgXvkOcFdKdQwA82PkcXoHlo+NlAiiPPgmHSELGvcL1uOgl3v+UFiiD1ro4qYqR0ITNhSlq5v2QJIPnka8FshFyPHhVtjtKfQkc9G/xDePW8dHwAhfi8VYRmVMmJAEOLCAJzRjnsgAfznP8CZ/QUczPF8LuTZ/WA/RaK1/Arj6VAo1VwHFY4AZXAolz7xs2sTuHplVO7FL8X58UvF7nlxq48W1Vu0l8oDi2HjvAgMAAAGjJDAiMAsGA1UdDwREAwIEsDATAgNVHSUEDDAKAggrAgEFNQcDATANAgkqhkiG9w0AAQUFAAOCAQEAk8ak2A5Ug4Iay2v0uXAk95qdAthJQN5qIVA13Qay8p4MG/S5+aXOVz4uMXGt18QjGds1A7Q8KDV4Slnwn95sVgA5EP7akvoGXhgAp8Dm90sac3+aSG4fo1V7Y/FYgAgpEy4C/5mKFD1ATeyyhy3PmF0+ZQRJ7aLDPAXioh98LrzMZr1ijzlAAKfJxzwZhpJamAwjZCYqiNZ54r4C4wA4QgX9sVfQKd5e/gQnUM8gTQIjQ8G2973jqxaVNw9lZnVKW3C8/QyLit20pNoqX2qQedwsqg3WCUcPRUUqZ4NpQeHL/AvKIrt158zAfU903yElAEm2Zr3oOUR4WfYQ==",
		"thumbprint": "F485CBE5569F7A5019CB68D7G6D987AC85124B4C"
	}

## Credentials
[Azure Automation credentials](../automation/automation-credentials.md) have a type of **Microsoft.Automation/automationAccounts/credentials** and have the properties in the following table.

| Property | Description |
|:--|:--|
| userName   | User name for the credential. |
| password   | Password for the credential. |

An example of a credential resource is below.

	"name": "[concat(parameters('accountName'), '/', variables('credentialName'))]",
	"type": "Microsoft.Automation/automationAccounts/runbooks/credentials",
	"apiVersion": "[variables('AutomationApiVersion')]",
	"location": "[parameters('regionId')]",
	"tags": { },
	"dependsOn": [
	],
	"properties": {
		"userName": "User01",
		"password": "password"
	}


## Schedules
[Azure Automation schedules](../automation/automation-schedules.md) have a type of **Microsoft.Automation/automationAccounts/schedules** and have the properties in the following table.

| Property | Description |
|:--|:--|
| description | Optional description for the schedule. |
| startTime   | Specifies the start time of a schedule as a DateTime object. A string can be provided if it can be converted to a valid DateTime. |
| isEnabled   | Specifies whether the schedule is enabled. |
| interval    | The type of interval for the schedule.<br><br>day<br>hour |
| frequency   | Frequency that the schedule should fire in number of days or hours. |

An example of a schedule resource is below.

	"name": "[concat(parameters('accountName'), '/', variables('variableName'))]",
	"type": "microsoft.automation/automationAccounts/schedules",
	"apiVersion": "[variables('AutomationApiVersion')]",
	"tags": { },
	"dependsOn": [
	],
	"properties": {
		"description": "Schedule for StartByResourceGroup runbook",
		"startTime": "10/30/2016 12:00:00",
		"isEnabled": "true",
		"interval": "day",
		"frequency": "1"
	}


## Variables
[Azure Automation variables](../automation/automation-variables.md) have a type of **Microsoft.Automation/automationAccounts/variables** and have the properties in the following table.

| Property | Description |
|:--|:--|
| description | Optional description for the variable. |
| isEncrypted | Specifies whether the variable should be encrypted. |
| type        | Data type for the variable. |
| value       | Value for the variable. |

An example of a variable resource is below.

	"name": "[concat(parameters('accountName'), '/', variables('StartTargetResourceGroupsAssetName')) ]",
	"type": "microsoft.automation/automationAccounts/variables",
	"apiVersion": "[variables('AutomationApiVersion')]",
	"tags": { },
	"dependsOn": [
	],
	"properties": {
		"description": "Description for the variable.",
		"isEncrypted": "true",
		"type": "string",
		"value": "'This is a string value.'"
	}


## Modules
Your management solution does not need to define [global modules](../automation/automation-integration-modules.md) used by your runbooks because they will always be available.  You do need to include a resource for any other module used by your runbooks, and the runbook should depend on the module resource to ensure that it's created before the runbook.

[Integration modules](../automation/automation-integration-modules.md) have a type of **Microsoft.Automation/automationAccounts/modules** and have the properties in the following table.

| Property | Description |
|:--|:--|
| contentLink | Specifies the content of the module. <br><br>uri - Uri to the content of the runbook.  This will be a .ps1 file for PowerShell and Script runbooks, and an exported graphical runbook file for a Graph runbook.  <br> version - Version of the runbook for your own tracking. |

An example of a module resource is below.

	{		
		"name": "[concat(parameters('accountName'), '/', variables('OMSIngestionModuleName'))]",
		"type": "Microsoft.Automation/automationAccounts/modules",
		"apiVersion": "[variables('AutomationApiVersion')]",
		"dependsOn": [
		],
		"properties": {
			"contentLink": {
				"uri": "https://devopsgallerystorage.blob.core.windows.net/packages/omsingestionapi.1.3.0.nupkg"
			}
		}
	}

### Updating modules
If you update a management solution that includes a runbook that uses a schedule, and the new version of your solution has a new module used by that runbook, then the runbook may use the old version of the module.  You should include the following runbooks in your solution and create a job to run them before any other runbooks.  This will ensure that any modules are updated as required before the runbooks are loaded.

- [Update-ModulesinAutomationToLatestVersion](https://www.powershellgallery.com/packages/Update-ModulesInAutomationToLatestVersion/1.03/DisplayScript) will ensure that all of the modules used by runbooks in your solution are the latest version.  
- [ReRegisterAutomationSchedule-MS-Mgmt](https://www.powershellgallery.com/packages/ReRegisterAutomationSchedule-MS-Mgmt/1.0/DisplayScript) will reregister all of the schedule resources to ensure that the runbooks linked to them with use the latest modules.


Following is a sample of the required elements of a solution to support the module update.
	
	"parameters": {
		"ModuleImportGuid": {
			"type": "string",
			"metadata": {
				"control": "guid"
			}
		},
		"ReRegisterRunbookGuid": {
			"type": "string",
			"metadata": {
				"control": "guid"
			}
		}
	},

	"variables": {
		"ModuleImportRunbookName": "Update-ModulesInAutomationToLatestVersion",
		"ModuleImportRunbookUri": "https://www.powershellgallery.com/packages/Update-ModulesInAutomationToLatestVersion/1.03/Content/Update-ModulesInAutomationToLatestVersion.ps1",
		"ModuleImportRunbookDescription": "Imports modules and also updates all Azure dependent modules that are in the same Automation Account.",
		"ReRegisterSchedulesRunbookName": "Update-ModulesInAutomationToLatestVersion",
		"ReRegisterSchedulesRunbookUri": "https://www.powershellgallery.com/packages/ReRegisterAutomationSchedule-MS-Mgmt/1.0/Content/ReRegisterAutomationSchedule-MS-Mgmt.ps1",
		"ReRegisterSchedulesRunbookDescription": "Reregisters schedules to ensure that they use latest modules."
	},

	"resources": [
		{
			"name": "[concat(parameters('accountName'), '/', variables('ModuleImportRunbookName'))]",
			"type": "Microsoft.Automation/automationAccounts/runbooks",
			"apiVersion": "[variables('AutomationApiVersion')]",
			"dependsOn": [
			],
			"location": "[parameters('regionId')]",
			"tags": { },
			"properties": {
				"runbookType": "PowerShell",
				"logProgress": "true",
				"logVerbose": "true",
				"description": "[variables('ModuleImportRunbookDescription')]",
				"publishContentLink": {
					"uri": "[variables('ModuleImportRunbookUri')]",
					"version": "1.0.0.0"
				}
			}
		},
		{
			"name": "[concat(parameters('accountName'), '/', parameters('ModuleImportGuid'))]",
			"type": "Microsoft.Automation/automationAccounts/jobs",
			"apiVersion": "[variables('AutomationApiVersion')]",
			"location": "[parameters('regionId')]",
			"dependsOn": [
				"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('ModuleImportRunbookName'))]"
			],
			"tags": { },
			"properties": {
				"runbook": {
					"name": "[variables('ModuleImportRunbookName')]"
				},
				"parameters": {
					"ResourceGroupName": "[resourceGroup().name]",
					"AutomationAccountName": "[parameters('accountName')]",
					"NewModuleName": "AzureRM.Insights"
				}
			}
		},
	    {
	      "name": "[concat(parameters('accountName'), '/', variables('ReRegisterSchedulesRunbookName'))]",
	      "type": "Microsoft.Automation/automationAccounts/runbooks",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "dependsOn": [
	      ],
	      "location": "[parameters('regionId')]",
	      "tags": { },
	      "properties": {
	        "runbookType": "PowerShell",
	        "logProgress": "true",
	        "logVerbose": "true",
	        "description": "[variables('ReRegisterSchedulesRunbookDescription')]",
	        "publishContentLink": {
	          "uri": "[variables('ReRegisterSchedulesRunbookUri')]",
	          "version": "1.0.0.0"
	        }
	      }
	    },
	    {
	      "name": "[concat(parameters('accountName'), '/', parameters('reRegisterSchedulesGuid'))]",
	      "type": "Microsoft.Automation/automationAccounts/jobs",
	      "apiVersion": "[variables('AutomationApiVersion')]",
	      "location": "[parameters('regionId')]",
	      "dependsOn": [
	        "[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'), '/runbooks/', variables('ReRegisterSchedulesRunbookName'))]"
	      ],
	      "tags": { },
	      "properties": {
	        "runbook": {
	          "name": "[variables('ReRegisterSchedulesRunbookName')]"
	        },
			"parameters": {
	          "targetSubscriptionId": "[subscription().subscriptionId]",
	          "resourcegroup": "[resourceGroup().name]",
	          "automationaccount": "[parameters('accountName')]"
			}
		}
	]


## Next steps

- [Add a view to your solution](operations-management-suite-solutions-resources-views.md) to visualize collected data.