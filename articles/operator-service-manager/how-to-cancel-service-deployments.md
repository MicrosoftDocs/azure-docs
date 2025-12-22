---
title: Interrupt a Service Deployment with Azure Operator Service Manager
description: Learn how to interrupt an Azure Operator Service Manager deployment in a nonterminal state.
author: msftadam
ms.author: adamdor
ms.date: 09/30/2025
ms.topic: how-to
ms.service: azure-operator-service-manager
---

# Interrupt a service deployment operation

This article describes a method to interrupt a site network service (SNS) deployment operation in a nonterminal state. This capability supports only container network functions (CNFs). You trigger it by applying a tag to the managed resource group (MRG) for the network function (NF). You must later remove this tag to restore future SNS operations.

## Why interrupt a service deployment operation

Azure Operator Service Manager deploys complex CNF workloads, which consist of many individual components (Helm charts). When you start an SNS deployment, each component is processed sequentially, in the order that the network function design (NFD) defines. Depending on how many components are touched in a deployment, the SNS operation can take an extended time to finish.

As an example, consider a scenario where a CNF has 30 components. Each component takes 5 minutes to deploy. The total run time of this operation would exceed 2 hours. Now, consider operational issues with long-running deployment operations:

* Users might want to test the deployment operation only up to a certain component.
* Users might realize, after starting the operation, that an error exists in a component configuration.
* The operation might create an unexpected negative impact on a customer-facing service.

In such cases, an ability to interrupt the operation is desirable. Before the introduction of this interruption capability, the only option was to wait for the defective component to fail. With this interruption capability, you can proactively interrupt long-running deployments before they reach the defective component. This interruption minimizes delays and improves operational agility.

## Overview of service deployment operations

During the first deployment of an SNS, the installation operation creates a managed resource group (MRG) that includes the NF resource. For subsequent SNS deployments, upgrade operations use this managed-by relationship to modify the NF within the MRG. As a prerequisite for using the interruption feature, you must have access to the NF MRG.

> [!NOTE]
> The NF MRG has different default permissions versus the SNS resource group (RG), which often restricts direct user access.

## Interrupt a service deployment operation

Follow this process to execute an interruption. Keep in mind that interruption behavior differs when you execute it against an installation operation versus an upgrade operation:

* When you interrupt an installation, the workflow supports only the pause-on-failure failure recovery method.
* When you interrupt an upgrade, the workflow honors the configured failure recovery method. This method can be either rollback-on-failure or pause-on-failure.

### Request interruption with a tag

To interrupt a running deployment, add the tag `cancel:1` on the NF MRG. You can identify the MRG by referencing the `properties.managedResourceGroupConfiguration.name` value within the SNS resource.

The tag is a static key/value pair and must be an exact match. You can add it by using any supported method, such as the Azure portal, Azure CLI, or REST SDK.

The following example shows how to add the tag by using the Azure CLI:

```powershell
az tag update --resource-id {resourceGroup} --operation Merge --tags cancel=1
```

### Wait for interruption to be triggered

After you apply the tag to the NF MRG, the interruption is executed between component operations. The current component operation isn't interrupted and must proceed to completion.

Before the workflow starts the next component operation, it checks for the presence of the tag on the NF MRG. If the tag is present, any remaining components aren't executed and are set to a `failed` state.

If the interruption is applied to an upgrade operation, the workflow honors the configured failure recovery method. After failure recovery finishes, the deployment operation's terminal state is set to `failed`.

### Monitor the state of network function components

Use the NF component view to determine the state of an executed interruption. Look for the `DeploymentStatusProperties` property of the last completed component to be in a state other than `installing`.

You can also use the component view to determine component states based on the configured failure recovery method.

### Confirm interruption action via logs

After the SNS deployment reaches a terminal state of `failed`, a notice of interruption is appended to the operation's output log.

#### Error emitted during installation interruption

The following code shows an example of the log emitted during a first installation operation. The reference to `testapp` identifies the component that wasn't started, due to the interruption request. The string `deployment cancelled` indicates that the interruption was applied to an initial installation operation.

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

The following code shows an example of the log emitted during an upgrade operation. The reference to `testapp` identifies the next component that wasn't started, due to the interruption request. The string `NF update` indicates that the interruption was applied to an upgrade operation.

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

### Remove a tag after interruption is complete

To avoid unintentionally interrupting any future SNS deployment operations, you should remove the tag from the NF MRG. For example, to remove the tag by using the Azure CLI, run this command:

```powershell
az tag update --resource-id {resourceGroup} --operation Delete --tags cancel=1
```

## Other considerations

When you want to interrupt an SNS deployment operation, be aware of these considerations:

* Interrupting deployments is supported only for CNF deployments.
* When you add the tag to the SNS MRG, the ongoing component action isn't interrupted and must finish before the interruption starts.
