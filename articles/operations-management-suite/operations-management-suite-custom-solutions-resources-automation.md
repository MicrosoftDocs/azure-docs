<properties
   pageTitle="Common resources in OMS custom solutions | Microsoft Azure"
   description="Many custom solutions in OMS will include runbooks in Azure Automation to automate processes such as collecting and processing monitoring data.  This article describes how to include runbooks and their related resources in a custom solution."
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
   ms.date="09/26/2016"
   ms.author="bwren" />

# Automation resources in OMS custom solutions (Preview)

>[AZURE.NOTE]This is preliminary documentation for custom solutions in OMS which are currently in preview. The schema described below is subject to change.     

[Custom solutions in OMS](operations-management-suite-custom-solutions.md) will typically include runbooks in Azure Automation to automate processes such as collecting and processing monitoring data.  In addition to runbooks, Automation accounts includes assets such as variables and schedules that support the runbooks used in the solution.  This article describes how to include runbooks and their related resources in a custom solution.

>[AZURE.NOTE]The samples in this article use parameters and variables that are either required or common to solutions  and described in [Custom solutions in Operations Management Suite (OMS)](operations-management-suite-custom-solutions.md) 

>[AZURE.NOTE]You can get sample Resource Manager templates for Automation resources from the [QuickStart templates in GitHub](https://github.com/azureautomation/automation-packs/tree/master/101-sample-automation-resource-templates).

## Automation account
All resources in Azure Automation are associated with an [Automation account](../automation/automation-security-overview.md#automation-account-overview).  Solutions require the parameter **accountName** to specify the name of an automation account, and this name is used in the **name** property of each runbook and asset to specify their full path.  It's a best practice to also define the Automation account as a resource in your solution to ensure that it exists.  

Azure Automation account resources have a type of **Microsoft.Automation/automationAccounts** and have the properties in the following table.

| Property | Description |
|:--|:--|
| sku | Subelement that includes a single property of **name** that includes the pricing tier of the account.   |

A typical Automation account resource in a solution is below.

	"name": "MyAutomationAccount",
	"type": "Microsoft.Automation/automationAccounts",
	"apiVersion": "[variables('LogAnalyticsApiVersion')]",
	"location": "[parameters('regionId')]",
	"tags": {},
	"properties": {
		"sku": {
			"name": "[variables('pricingTier')]"
		}
	}

Each Automation resource in the solution is stored in an Automation account.  There are two methods to ensure that the required Automation account is available for each resource.  One method is to define a [dependency](../resource-group-define-dependencies.md) for the resource on the account with a **dependsOn** element.  The other method is to specify the resources as subelements of the **automationAccounts** element.

The samples in this article use a **dependsOn** element for the Automation account.

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

	"name": "[concat(parameters('accountName'), '/MyRunbook'))]",
	"type": "Microsoft.Automation/automationAccounts/runbooks",
	"apiVersion": "[variables('AutomationApiVersion')]",
	"location": "[parameters('regionId')]",
	"tags": { },
	"properties": {
		"runbookType": "PowerShell",
		"logProgress": "true",
		"logVerbose": "true",
		"description": "",
		"publishContentLink": {
			"uri": "https://www.powershellgallery.com/packages/Start-AzureV2VMs/1.0/Content/Start-AzureV2VMs.ps1",
			"version": "1.0.0.0"
		}
	}


## Jobs



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
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'))]"
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
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'))]"
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
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'))]"
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
		"[concat('Microsoft.Automation/automationAccounts/', parameters('accountName'))]"
	],
	"properties": {
		"description": "Description for the variable.",
		"isEncrypted": "true",
		"type": "String",
		"value": "This is a string value."
	}



## Next steps

- [Test your solution](operations-management-suite-custom-solutions.md#testing-a-custom-solution) to ensure that it is a valid Resource Manager template.
- [Add a view to your custom solution](operations-management-suite-custom-solutions-resources-views.md) to visualize collected data.