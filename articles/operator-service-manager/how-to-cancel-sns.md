---
title: Interrupt a SNS deployment operation with Azure Operator Service Manager
description: Learn how to cancel a SNS deployment operation before it reaches terminal state.
author: msftadam
ms.author: adamdor
ms.date: 09/30/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# How-to interrupt a SNS deployment operation
This article describes a method to interrupt SNS deployment operations, for container network function (CNF) workflows only, by leveraging resource tags.

## Why interrupt a SNS deployment operation
SNS deployments can sometimes take an extended time to complete. In such cases, users may realize they initiated the operation in error or wish to abort it before completion. By applying specific tags on resources, users can proactively terminate long-running deployments, minimizing delays and improving operational agility.

## About SNS Deployments
SNS Deployment creates a managed resource group and the NetworkFunction resource is created within this managed resource group (referred to as SNS MRG).

## How to interrupt dedployments
Follow this process to execute and interruption.

### Add tag to trigger interruption
During SNS deployment, to interrupt the deployment, the user will add a tag `cancel:1` on the SNS Managed Resource Group, which is identified by properties.managedResourceGroupConfiguration.name value for the SNS resource. This SNS Managed Resource Group (MRG) is the same resource group that has the Network Function (NF) resource.
* Tags can be added/removed to the SNS MRG following the guidance here (reference link).
* There’s multiple ways to add/remove tags, for example through the Azure Portal, Az CLI etc.
* For example, to add the cancel tag using Az CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Merge --tags cancel=1
```

### Wait for interruption to be triggered
While SNS deployment is in progress and the cancel tag is applied to the SNS MRG:
* The ongoing helm deployment is not interrupted and it proceeds to completion.
* Once the ongoing helm deployment is completed, prior to the deployment of the next helm chart, AOSM will read tags present on the SNS MRG.
* If SNS MRG has the cancel tag (‘cancel:1’), AOSM will fail the remaining NF applications (components) and will fail the deployment operation.
* The failure behavior in this case can be – pause-on-failure or rollback-on-failure as per the NF configuration. More details on configuring NF level rollback behavior can be found here.

### Monitor state of SNS deployment 
Use the component view to determine if an interuption has been executed and to determine the forward or reverse state of the SNS deployment workflow.

### Confirm interruption via logs
Once the SNS deployment has reacheed a terminal state of failed, the interuption action will be included in the logs output of the operation.

Emitted during first install (rollback disabled only)
```powershell
{
 "code": "DeploymentFailed",
 "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-deployment-operations for usage details.",
 "details": [ 
  { 
   "code": "NetworkFunctionApplicationDeploymentFailed",
   "message": "[Application(testapp): Deployment cancelled for application: testapp due to User Site Network Service cancellation request]"
  }
 ]
}
```

Emitted during upgrade (rollback disabled or enabled)
```powershell
{
 "code": "DeploymentFailed",
 "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-deployment-operations for usage details.",
 "details": [ 
  { 
   "code": "NetworkFunctionApplicationDeploymentFailed", 
   "message": "[Application(testapp) failed to be processed in NF update. Error: Deployment cancelled for application: testapp due to SNS cancellation request]" 
  } 
 ]
}
```

### Remove tag once interruption is complete
The user should consider removing the cancel tag from the SNS MRG to avoid interrupting any future SNS deployments.
* For example, to remove the cancel tag using Az CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Delete --tags cancel=1
```

## Other considerations
When considering cancelling a SNS operation, be aware of the following considerations:
* Interrupting deployments is supported only for Container Network Function (CNF) deployments. 
* When the cancel tag is added to the SNS MRG, the ongoing helm deployment is not interrupted. The ongoing helm deployment proceeds to completion as earlier. 

