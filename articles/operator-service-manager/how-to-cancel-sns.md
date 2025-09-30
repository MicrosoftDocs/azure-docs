---
title: Interrupt an SNS deployment operation with Azure Operator Service Manager
description: Learn how to interrupt an SNS deployment operation before it reaches terminal state.
author: msftadam
ms.author: adamdor
ms.date: 09/30/2024
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Interrupt an SNS deployment operation
This article describes a method to interrupt site network service (SNS) deployment operations before the SNS operation reaching a terminal state. This interruption capability supports only container network function (CNF) workflows and is triggered by adding a tag to the network function (NF) managed resource group (MRG). Once the interruption has occurred, the user must manually remove this tag from the NF MRG to restore proper operation for the next attempt.

## Why interrupt an SNS deployment operation
Azure Operator Service Manager deploys complex CNF workloads, which are composed of many individual components. When an SNS deployment is started, each component is processed sequentially, in the order as defined in the network function design (NFD). Depending on how many components are touched in a given deployment, the SNS operation can take an extended time to complete. As an example, consider a scenario where a CNF is composed of 30 components where each component takes 5 minutes to deploy. The total run time of this SNS operation would exceed 2 hours. Now, consider operational issues with long running deployment operations:

* User may wish to test deployment operation only up to a certain component.
* User may realize, after initiating the operation, that an error exists in a component configuration. 
* The operation might create an unexpected negative impact on the customer facing service.

In such cases, the user may wish to abort the operation. Before the introduction of this interruption capability, the users only option was to wait for a timeout to be reached or for the operation to reach a terminal state. With this interruption capability, users can proactively terminate long-running deployments, minimizing delays and improving operational agility.

## About SNS Deployments
During the first deployment of an SNS, the install operation creates a managed resource group (MRG) which includes the network function resource. The MRG has a managed-by relationship with the SNS resource. Subsequent SNS deployments, beyond the initial install, referred to as upgrades, modify the NF in-place within the MRG. The user must have access to the NF MRG in order to use the interruption feature.

> [!NOTE]
> The NF MRG has different default permissions, versus the SNS resource group (RG), which often restricts direct user access.

## How to interrupt deployments
Follow this process to execute an interruption, but note that interruption capabilities differ when executed against an install operation versus am upgrade operation.
* When a user interrupts an install, the workflow only supports the pause-on-failure failure recovery method. 
* When a user interrupts an upgrade, the workflow honors the configured failure recovery method, either rollback-on-failure or pause-on-failure.

### Trigger interruption with a tag
After a user starts the SNS deployment, to interrupt the deployment, the user adds the tag `cancel:1` on the NF MRG, which is identified by referencing the `properties.managedResourceGroupConfiguration.name` value within the SNS resource.
* The tag is a static key value pair and must be an exact match.
* The tag can be added via any supported method such as Azure portal, Azure CLI, REST SDK, etc.
* The following example shows how to add the tag using Azure CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Merge --tags cancel=1
```

### Wait for interruption to be triggered
Once the tag is applied to the NF MRG, the interruption is executed between component operations.
* The current component operation isn't interrupted and must proceed to completion.
* Prior to starting the next component operation, the workflow checks for the presence of the tag on the NF MRG.
* If the tag is present, any remaining components aren't executed and set to fail state.
* If the interruption is applied to an upgrade operation, the configured failure recovery method is honored.
* After failure recovery is complete, the deployment operation terminal state is set to failed.

> [!NOTE]
> The publisher/design must still set appropriate component timeouts as the current component must complete before the interruption request can be honored.

### Monitor state of SNS deployment 
Use the component view to determine state of an executed interruption. Look for the DeploymentStatusProperties property of the last completed component to be in a state other than installing. Component view can also be used to determine reverse component states based on configured failure recovery method.

### Confirm interruption via logs
Once the SNS deployment reaches a terminal state of failed, a notice of interruption is included in the operation's output logs.

#### Error emitted during install
Example of log emitted during a first install operation. The reference to `testapp` identifies the next component that wasn't started, due to the interruption request. The string `deployment cancelled` indicates the interruption was applied to an initial install operation.
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

#### Error emitted during upgrade
Example of log emitted during upgrade operation. The reference to `testapp` identifies the next component which wasn't started, due to the interruption request. The string `NF update` indicates the interruption was applied to an upgrade operation.
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
The user should remove the tag from the NF MRG to avoid unintentionally interrupting any future SNS deployments.
* For example, to remove the tag using Azure CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Delete --tags cancel=1
```

## Other considerations
When considering canceling an SNS operation, be aware of the following considerations:
* Interrupting deployments is supported only for Container Network Function (CNF) deployments. 
* When the tag is added to the SNS MRG, the ongoing helm deployment isn't interrupted. The ongoing helm deployment proceeds to completion as earlier. 
