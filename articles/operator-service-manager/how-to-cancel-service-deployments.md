---
title: Interrupt a service deployment with Azure Operator Service Manager
description: Learn how to interrupt an Azure Operator Service Manager deployment in a nonterminal state.
author: msftadam
ms.author: adamdor
ms.date: 09/30/2025
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Interrupt a service deployment operation
This article describes a method to interrupt a site network service (SNS) deployment operation in a nonterminal state. This capability only supports container network functions (CNF) and is triggered by applying a tag to the network function (NF) managed resource group (MRG). The user must later remove this tag to restore future SNS operations.

## Why interrupt a service deployment operation
Azure Operator Service Manager deploys complex CNF workloads, which are composed of many individual components (helm charts). When an SNS deployment is started, each component is processed sequentially, in the order as defined in the network function design (NFD). Depending on how many components are touched in a given deployment, the SNS operation can take an extended time to complete. As an example, consider a scenario where a CNF is composed of 30 components where each component takes 5 minutes to deploy. The total run time of this operation would exceed 2 hours. Now, consider operational issues with long running deployment operations:
* Users may wish to test deployment operation only up to a certain component.
* Users may realize, after initiating the operation, that an error exists in a component configuration. 
* The operation might create an unexpected negative impact on a customer facing service.

In such cases, an ability to interrupt the operation is desirable. Before the introduction of this interruption capability, the only option was to wait for the defective component to fail. With this interruption capability, long-running deployments can be proactively interrupted before reaching the defective component, minimizing delays and improving operational agility.

## Overview of service deployment operations
During the first deployment of an SNS, the install operation creates a managed resource group (MRG) which includes the network function resource. For subsequent SNS deployments, upgrade operations use this managed-by relationship to modify the NF within the MRG. As a prerequisite, the user must have access to the NF MRG to use the interruption feature.

> [!NOTE]
> The NF MRG has different default permissions, versus the SNS resource group (RG), which often restricts direct user access.

## Execute a service deployment operation interruption
Follow this process to execute an interruption, but note that interruption behavior differs when executed against an install operation versus an upgrade operation.
* When a user interrupts an install, the workflow only supports the pause-on-failure failure recovery method. 
* When a user interrupts an upgrade, the workflow honors the configured failure recovery method, either rollback-on-failure or pause-on-failure.

### Request interruption with a tag
To interrupt a running deployment, add the tag `cancel:1` on the NF MRG. The MRG is identified by referencing the `properties.managedResourceGroupConfiguration.name` value within the SNS resource.
* The tag is a static key value pair and must be an exact match.
* The tag can be added via any supported method such as Azure portal, Azure CLI, REST SDK, etc.
* The following example shows how to add the tag using Azure CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Merge --tags cancel=1
```

### Wait for interruption to be triggered
Once the tag is applied to the NF MRG, the interruption is executed between component operations.
* The current component operation isn't interrupted and must proceed to completion.
* Before starting the next component operation, the workflow checks for the presence of the tag on the NF MRG.
* If the tag is present, any remaining components aren't executed and set to fail state.
* If the interruption is applied to an upgrade operation, the configured failure recovery method is honored.
* After failure recovery is complete, the deployment operation terminal state is set to failed.

### Monitor state of network function components
Use the NF component view to determine state of an executed interruption. Look for the `DeploymentStatusProperties` property of the last completed component to be in a state other than installing. Component view can also be used to determine component states based on configured failure recovery method.

### Confirm interruption action via logs
Once the SNS deployment reaches a terminal state of failed, a notice of interruption is appended onto the operation output log.

#### Error emitted during install interruption
The following shows an example of the log emitted during a first install operation. The reference to `testapp` identifies the component that wasn't started, due to the interruption request. The string `deployment cancelled` indicates the interruption was applied to an initial install operation.
```powershell
{
 "code": "DeploymentFailed",
 "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-deployment-operations for usage details.",
 "details": [ 
  { 
   "code": "NetworkFunctionApplicationDeploymentFailed",
   "message": "[Application(testapp): Deployment cancelled for application: testapp due to User cancellation request]"
  }
 ]
}
```

#### Error emitted during upgrade interruption
The following shows an example of the log emitted during an upgrade operation. The reference to `testapp` identifies the next component that wasn't started, due to the interruption request. The string `NF update` indicates the interruption was applied to an upgrade operation.
```powershell
{
 "code": "DeploymentFailed",
 "message": "At least one resource deployment operation failed. Please list deployment operations for details. Please see https://aka.ms/arm-deployment-operations for usage details.",
 "details": [ 
  { 
   "code": "NetworkFunctionApplicationDeploymentFailed", 
   "message": "[Application(testapp) failed to be processed in NF update. Error: Deployment cancelled for application: testapp due to User cancellation request]" 
  } 
 ]
}
```

### Remove tag once interruption is complete
The user should remove the tag from the NF MRG to avoid unintentionally interrupting any future SNS deployment operations.
* For example, to remove the tag using Azure CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Delete --tags cancel=1
```

## Other considerations
When considering interrupting an SNS deployment operation, be aware of the following considerations:
* Interrupting deployments is supported only for Container Network Function (CNF) deployments. 
* When the tag is added to the SNS MRG, the ongoing component action isn't interrupted and must complete before interruption is executed.
