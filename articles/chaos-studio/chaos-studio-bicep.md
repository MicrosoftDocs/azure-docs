---
title: Use Bicep to create an experiment in Azure Chaos Studio 
description: Sample Bicep templates to create Azure Chaos Studio experiments.
services: chaos-studio
author: rsgel
ms.topic: sample
ms.date: 06/09/2023
ms.author: carlsonr
ms.service: chaos-studio
ms.custom: devx-track-bicep
---

# Use Bicep to create an experiment in Azure Chaos Studio 
[!INCLUDE [About Bicep](../../includes/resource-manager-quickstart-bicep-introduction.md)]

This article includes a sample Bicep file to get started in Azure Chaos Studio, including:

* Onboarding a resource as a target (for example, a Virtual Machine)
* Enabling capabilities on the target (for example, Virtual Machine Shutdown)
* Creating a Chaos Studio experiment
* Assigning the necessary permissions for the experiment to execute


## Build a Virtual Machine Shutdown experiment

In this sample, we create a chaos experiment with a single target resource and a single virtual machine shutdown fault. You can modify the experiment by referencing the [fault library](chaos-studio-fault-library.md) and [recommended role assignments](chaos-studio-fault-providers.md).

### Prerequisites

This sample assumes:
* The Chaos Studio resource provider is already registered with your Azure subscription
* You already have a resource group in a region supported by Chaos Studio
* A virtual machine is deployed in the resource group

### Review the Bicep file

```bicep
@description('The existing virtual machine resource you want to target in this experiment')
param targetName string

@description('Desired name for your Chaos Experiment')
param experimentName string

@description('Desired region for the experiment, targets, and capabilities')
param location string = resourceGroup().location

// Define Chaos Studio experiment steps for a basic Virtual Machine Shutdown experiment
param experimentSteps array = [
  {
    name: 'Step1'
    branches: [
      {
        name: 'Branch1'
        actions: [
          {
            name: 'urn:csci:microsoft:virtualMachine:shutdown/1.0'
            type: 'continuous'
            duration: 'PT10M'
            parameters: [
              {
                key: 'abruptShutdown'
                value: 'true'
              }
            ]
            selectorId: 'Selector1'
          }
        ]
      }
    ]
  }
]

// Reference the existing Virtual Machine resource
resource vm 'Microsoft.Compute/virtualMachines@2023-03-01' existing = {
  name: targetName
}

// Deploy the Chaos Studio target resource to the Virtual Machine
resource chaosTarget 'Microsoft.Chaos/targets@2023-11-01' = {
  name: 'Microsoft-VirtualMachine'
  location: location
  scope: vm
  properties: {}

  // Define the capability -- in this case, VM Shutdown
  resource chaosCapability 'capabilities' = {
    name: 'Shutdown-1.0'
  }
}

// Define the role definition for the Chaos experiment
resource chaosRoleDefinition 'Microsoft.Authorization/roleDefinitions@2022-04-01' existing = {
  scope: vm
  // In this case, Virtual Machine Contributor role -- see https://learn.microsoft.com/azure/role-based-access-control/built-in-roles 
  name: '9980e02c-c2be-4d73-94e8-173b1dc7cf3c'
}

// Define the role assignment for the Chaos experiment
resource chaosRoleAssignment 'Microsoft.Authorization/roleAssignments@2020-04-01-preview' = {
  name: guid(vm.id, chaosExperiment.id, chaosRoleDefinition.id)
  scope: vm
  properties: {
    roleDefinitionId: chaosRoleDefinition.id
    principalId: chaosExperiment.identity.principalId
    principalType: 'ServicePrincipal'
  }
}

// Deploy the Chaos Studio experiment resource
resource chaosExperiment 'Microsoft.Chaos/experiments@2023-11-01' = {
  name: experimentName
  location: location // Doesn't need to be the same as the Targets & Capabilities location
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    selectors: [
      {
        id: 'Selector1'
        type: 'List'
        targets: [
          {
            id: chaosTarget.id
            type: 'ChaosTarget'
          }
        ]
      }
    ]
    startOnCreation: false // Change this to true if you want to start the experiment on creation
    steps: experimentSteps
  }
}
```

## Deploy the Bicep file

1. Save the Bicep file as `chaos-vm-shutdown.bicep` to your local computer.
1. Deploy the Bicep file using either Azure CLI or Azure PowerShell, replacing `exampleRG` with the existing resource group that includes the virtual machine you want to target.

    # [CLI](#tab/CLI)

    ```azurecli
    az deployment group create --resource-group exampleRG --template-file chaos-vm-shutdown.bicep
    ```

    # [PowerShell](#tab/PowerShell)

    ```azurepowershell
    New-AzResourceGroupDeployment -ResourceGroupName exampleRG -TemplateFile ./chaos-vm-shutdown.bicep
    ```

1. When prompted, enter the following values:
    * **targetName**: the name of an existing Virtual Machine within your resource group that you want to target
    * **experimentName**: the desired name for your Chaos Experiment
    * **location**: the desired region for the experiment, targets, and capabilities
1. The template should deploy within a few minutes. Once the deployment is complete, navigate to Chaos Studio in the Azure portal, select **Experiments**, and find the experiment created by the template. Select it, then **Start** the experiment.

## Next steps

* [Learn more about Chaos Studio](chaos-studio-overview.md)
* [Learn more about chaos experiments](chaos-studio-chaos-experiments.md)
