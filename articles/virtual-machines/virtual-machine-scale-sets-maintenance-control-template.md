---
title: Maintenance control for OS image upgrades on Azure Virtual Machine Scale Sets using an Azure Resource Manager template
description: Learn how to control when automatic OS image upgrades are rolled out to your Azure Virtual Machine Scale Sets using Maintenance control and an Azure Resource Manager (ARM) template.
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 11/22/2022
ms.author: jushiman 
ms.custom: subject-armqs, mode-arm, devx-track-arm-template
#pmcontact: PPHILLIPS
---

# Maintenance control for OS image upgrades on Azure Virtual Machine Scale Sets using an ARM template

Maintenance control lets you decide when to apply automatic OS image upgrades to your Virtual Machine Scale Sets. For more information on using Maintenance control, see [Maintenance control for Azure Virtual Machine Scale Sets](virtual-machine-scale-sets-maintenance-control.md).

This article explains how you can use an Azure Resource Manager (ARM) template to create a maintenance configuration. You will learn how to:

- Create the configuration 
- Assign the configuration to a virtual machine

[!INCLUDE [About Azure Resource Manager](../../includes/resource-manager-quickstart-introduction.md)] 

## Create the configuration

While creating the configuration, it is important to note that there are different scopes and each will have unique properties in their creation template. Make sure you are using the right one.

For more information about this Maintenance Configuration template, see [maintenanceConfigurations](/azure/templates/microsoft.maintenance/maintenanceconfigurations?tabs=json#template-format).

### Host and OS image 

```json
{
  "type": "Microsoft.Maintenance/maintenanceConfigurations",
  "apiVersion": "2021-09-01-preview",
  "name": "string",
  "location": "string",
  "tags": {
    "tagName1": "tagValue1",
    "tagName2": "tagValue2"
  },
  "properties": {
    "extensionProperties": {},
    "installPatches": {
      "linuxParameters": {
        "classificationsToInclude": [ "string" ],
        "packageNameMasksToExclude": [ "string" ],
        "packageNameMasksToInclude": [ "string" ]
      },
      "rebootSetting": "string",
      "tasks": {
        "postTasks": [
          {
            "parameters": {},
            "source": "string",
            "taskScope": "string"
          }
        ],
        "preTasks": [
          {
            "parameters": {},
            "source": "string",
            "taskScope": "string"
          }
        ]
      },
      "windowsParameters": {
        "classificationsToInclude": [ "string" ],
        "excludeKbsRequiringReboot": "bool",
        "kbNumbersToExclude": [ "string" ],
        "kbNumbersToInclude": [ "string" ]
      }
    },
    "maintenanceScope": "string",
    "maintenanceWindow": {
      "duration": "string",
      "expirationDateTime": "string",
      "recurEvery": "string",
      "startDateTime": "string",
      "timeZone": "string"
    },
    "namespace": "string",
    "visibility": "string"
  }
}
```

## Assign the configuration

Assign the configuration to a virtual machine. 

For more information, see [configurationAssignments](/azure/templates/microsoft.maintenance/configurationassignments?tabs=json#property-values).

```json
{ 
  "type": "Microsoft.Maintenance/configurationAssignments", 
  "apiVersion": "2021-09-01-preview", 
  "name": "string", 
  "location": "string", 
  "properties": { 
    "maintenanceConfigurationId": "string", 
    "resourceId": "string" 
  } 
}
```

## Next steps

> [!div class="nextstepaction"]
> [Learn about maintenance and updates for virtual machines running in Azure](maintenance-and-updates.md)
