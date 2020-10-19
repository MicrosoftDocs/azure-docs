---
title: Enable Azure Monitor for VMs guest health (preview)
description: Describes how to enable Azure Monitor for VMs guest health in your subscription and how to onboard VMs.
ms.subservice: 
ms.topic: conceptual
author: bwren
ms.author: bwren
ms.date: 09/08/2020

---

# Enable Azure Monitor for VMs guest health (preview)
Azure Monitor for VMs guest health allows you to view the health of a virtual machine as defined by a set of performance measurements that are sampled at regular intervals. This article describes how to enable this feature in your subscription and how to enable guest monitoring for each virtual machine.

## Current limitations
Azure Monitor for VMs guest health has the following limitations in public preview:

- Only Azure virtual machines are currently supported. Azure Arc for servers is not currently supported.
- Virtual Machine must run one of the following operating systems: 
  - Ubuntu 16.04 LTS, Ubuntu 18.04 LTS
  - Windows Server 2012 or later
- Virtual machine must be located in one of the following regions:
  - East US
  - West Europe
- Log Analytics workspace must be located in one of the following regions:
  - East US
  - East US 2 EUAP
  - West Europe region

## Prerequisites

- Virtual machine must be onboarded to Azure Monitor for VMs.
- User executing onboarding steps must have a minimum Contributor level access to the subscription where virtual machine and data collection rule are located.

## Overview

You must perform the following steps in each subscription to enabled Azure Monitor for VMs guest health:

- Register required Azure resource providers.
- Create Azure Monitor Agent Data Collection Rule (DCR).

The following steps must be performed on each VM to enable it for guest health monitoring:

- Onboard the VM to Azure Monitor for VMs.
- Deploy Azure Monitor Guest VM Health Agent on target virtual machine.
- Create association for the DCR to the VM.




## Register required ARM Resource Providers

The following Azure resource providers need to registered for your subscription to enable Azure Monitor for VMs guest health. 

- Microsoft.WorkloadMonitor
- Microsoft.Insights

You can use any of the available methods to register a resource provider as described in [Azure resource providers and types](../../azure-resource-manager/management/resource-providers-and-types.md). You can also use the following sample command using armclient, postman, or another method to make authenticated call to ARM:

```
POST https://management.azure.com/subscriptions/[subscriptionId]/providers/Microsoft.WorkloadMonitor/register?api-version=2019-10-01
POST https://management.azure.com/subscriptions/[subscriptionId]/providers/Microsoft.Insights/register?api-version=2019-10-01
```

## Create Azure Monitor Data Collection Rule (DCR)
[Data Collection Rules (DCR)](../platform/data-collection-rule-overview.md) define data coming into Azure Monitor and specify where that data should be sent or stored. 

Azure Monitor Agent Data Collection Rule (Azure object) must be created in order for health data to start flowing. DCR must be created in the same region as target Log Analytics workspace of the VM. It is recommended to have one DCR containing VM Health rules per subscription and all DCRs in a dedicated resource group such as `AzureMonitor-DataCollectionRules`.

Create DCR using `Health.DataCollectionRule.template.json` Azure Resource Manager (ARM) template. Run template in the subscription and resource group where DCR is to be created. Provide the following values to template parameters:

- __Default Health Data Collection Rule Name__ - leave default.
- __Destination Workspace Resource Id__ - Log Analytics workspace used for VM data collection (can be seen in portal under Monitor/Virtual Machines). Note: see pre-requisites above to ensure workspace region is supported by this preview.
- __Data Collection Rule Location__ - region code (ex: eastus, westeurope) of the DCR. Must match region of Log Analytics workspace.

## Enable VM using the Azure portal
Click the **Upgrade** option for a VM that's already been enabled for Azure Monitor for VMs to enable guest health. This will install the guest health extension and create the association with the DCR. 

\<screenshot\>

## Enable VM using resource manager templates
You can enable a VM for guest health using the following resource manager template. This installs the guest health extension and creates the association with the data collection rule. You can deploy this template using any [deployment method for Resource Manager templates](../../azure-resource-manager/templates/deploy-powershell.md).


For example, use the following commands to deploy the template and parameters file to a resource group using PowerShell or Azure CLI.

```powershell
New-AzResourceGroupDeployment -Name AzureMonitorDeployment -ResourceGroupName my-resource-group -TemplateFile azure-monitor-deploy.json -TemplateParameterFile azure-monitor-deploy.parameters.json
```

```cli
az deployment group create --name GuestHealthDeployment --resource-group my-resource-group --template-file Health.VirtualMachine.template.json --parameters Health.VirtualMachine.template.parameters.json
```

### Template file

``` json
{
  "$schema": "http://schema.management.azure.com/schemas/2015-01-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
    "virtualMachineName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the virtual machine."
      }
    },
    "virtualMachineLocation": {
      "type": "string",
      "metadata": {
        "description": "The location code of the virtual machine region (location). Examples: eastus, westeurope, etc"
      }
    },
    "virtualMachineOsType": {
      "type": "string",
      "metadata": {
        "description": "Specifies operating system type of the target virtual machine."
      },
      "allowedValues": ["windows", "linux"]
    },
    "dataCollectionRuleAssociationName": {
      "type": "string",
      "metadata": {
        "description": "Specifies the name of the data collection rule association to create."
      },
      "defaultValue": "VM-Health-Dcr-Association"
    },
    "healthDataCollectionRuleResourceId": {
      "type": "string",
      "metadata": {
        "description": "Specifies resource id of Azure Monitor Data Collection Rule for virtual machine health data."
      }
    }
  },
  "variables": {
    "healthExtensionProperties": {
      "windows": {
        "publisher": "Microsoft.Azure.Monitor.VirtualMachines.GuestHealth",
        "type": "GuestHealthWindowsAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true
      },
      "linux": {
        "publisher": "Microsoft.Azure.Monitor.VirtualMachines.GuestHealth",
        "type": "GuestHealthLinuxAgent",
        "typeHandlerVersion": "1.0",
        "autoUpgradeMinorVersion": true
      }
    },
    "azureMonitorAgentExtensionProperties": {
      "windows": {
        "publisher": "Microsoft.Azure.Monitor", 
        "type": "AzureMonitorWindowsAgent", 
        "typeHandlerVersion": "1.0", 
        "autoUpgradeMinorVersion": false 
      },
      "linux": {
        "publisher": "Microsoft.Azure.Monitor", 
        "type": "AzureMonitorLinuxAgent", 
        "typeHandlerVersion": "1.5", 
        "autoUpgradeMinorVersion": false 
      }
    }
  },
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "name": "[parameters('virtualMachineName')]",
      "location": "[parameters('virtualMachineLocation')]",
      "apiVersion": "2017-03-30",
      "identity": {
        "type": "SystemAssigned"
      }
    },
    {
      "type": "Microsoft.Compute/virtualMachines/providers/dataCollectionRuleAssociations",
      "name": "[concat(parameters('virtualMachineName'), '/Microsoft.Insights/', parameters('dataCollectionRuleAssociationName'))]",
      "apiVersion": "2019-11-01-preview",
      "properties": {
        "description": "Association of data collection rule for VM Insights Health.",
        "dataCollectionRuleId": "[parameters('healthDataCollectionRuleResourceId')]"
      }
    },
    { 
      "type": "Microsoft.Compute/virtualMachines/extensions", 
      "apiVersion": "2019-12-01", 
      "name": "[concat(parameters('virtualMachineName'), '/', variables('azureMonitorAgentExtensionProperties')[parameters('virtualMachineOsType')].type)]",
      "location": "[parameters('virtualMachineLocation')]",
      "dependsOn": [
        "[resourceId('Microsoft.Compute/virtualMachines/providers/dataCollectionRuleAssociations', parameters('virtualMachineName'), 'Microsoft.Insights', parameters('dataCollectionRuleAssociationName'))]"
      ], 
      "properties": "[variables('azureMonitorAgentExtensionProperties')[parameters('virtualMachineOsType')]]"
    },
    {
      "type": "Microsoft.Compute/virtualMachines/extensions",
      "name": "[concat(parameters('virtualMachineName'), '/', variables('healthExtensionProperties')[parameters('virtualMachineOsType')].type)]",
      "location": "[parameters('virtualMachineLocation')]",
      "apiVersion": "2018-06-01",
      "dependsOn": [ 
        "[resourceId('Microsoft.Compute/virtualMachines/extensions', parameters('virtualMachineName'), variables('azureMonitorAgentExtensionProperties')[parameters('virtualMachineOsType')].type)]",
        "[resourceId('Microsoft.Compute/virtualMachines/providers/dataCollectionRuleAssociations', parameters('virtualMachineName'), 'Microsoft.Insights', parameters('dataCollectionRuleAssociationName'))]"
      ], 	
      "properties": "[variables('healthExtensionProperties')[parameters('virtualMachineOsType')]]"
    }				
  ]
}
```

### Sample parameter file

```json
{
  "$schema": "https://schema.management.azure.com/schemas/2015-01-01/deploymentParameters.json#",
  "contentVersion": "1.0.0.0",
  "parameters": {
      "virtualMachineName": {
        "value": "myvm"
      },
      "virtualMachineLocation": {
        "value": "eastus"
      },
      "virtualMachineOsType": {
        "value": "linux"
      },
      "healthDataCollectionRuleResourceId": {
        "value": "/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/my-resource-group/providers/Microsoft.Insights/dataCollectionRules/Microsoft-VMInsights-Health"
      },
      "healthExtensionVersion": {
        "value": "private-preview"
      }
  }
}
```
