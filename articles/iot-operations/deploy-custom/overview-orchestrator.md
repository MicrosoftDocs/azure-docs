---
title: Deploy an edge solution
description: Deploy Azure IoT Operations to your edge environment. Use Azure IoT Orchestrator to deploy edge data services to your Kubernetes cluster.
author: kgremban
ms.author: kgremban
# ms.subservice: orchestrator
ms.topic: conceptual
ms.custom:
  - ignite-2023
ms.date: 10/25/2023
---

# Deploy a solution in Azure IoT Operations

[!INCLUDE [public-preview-note](../includes/public-preview-note.md)]

Use Azure IoT Orchestrator to deploy, configure, and update the components of your Azure IoT Operations Preview edge computing scenario.

:::image type="content" source="./media/overview-orchestrator/orchestrator-overview.svg" alt-text="Diagram that shows the architecture of Azure IoT Orchestrator components in the cloud and managing an Arc-enabled Kubernetes cluster.":::

Orchestrator is a service that manages application workloads on Kubernetes clusters that have been Arc enabled. It utilizes existing tools like Helm, Kubectl, and Arc to achieve the desired state on the target cluster. Orchestrator uses an extensibility model called *providers*, which allows it to support deployments and configuration across a wide range of OS platforms and deployment mechanisms. Orchestrator also provides reconciliation and status reporting capabilities to ensure that the desired state is maintained.

## Constructs

Several constructs help you to manage the deployment and configuration of application workloads.

### Manifests

Three types of manifests-*solution*, *target*, and *instance*-work together to describe the desired state of a cluster. For more information about creating the manifest files, see [manifests](./concept-manifests.md).

#### Solution

A *solution* is a template that defines an application workload that can be deployed on one or many *targets*. A solution describes application components. Application components are resources that you want to deploy on the target cluster and that use the infrastructural components defined in the target manifest, like PowerShell scripts or Azure IoT Data Processor (preview) pipelines.

#### Target

A *target* is a specific deployment environment, such as a Kubernetes cluster or an edge device. It describes infrastructural components, which are components installed once on a device, like PowerShell or Azure IoT Data Processor. Each target has its own configuration settings that can be customized to meet the specific needs of the deployment environment. A target also specifies provider bindings that define what types of resources are to be managed on the target (for example, Helm, PowerShell scripts, CRs, or Bash scripts).

#### Instance

An *instance* is a specific deployment of a solution to a target. It can be thought of as an instance of a solution.

### Providers

*Providers* are an extensibility model that allows Orchestrator to support deployments and configuration across a wide range of OS platforms and deployment mechanisms. Providers are responsible for executing the actions required to achieve the desired state of a resource. Orchestrator supports several industry standard tools such as Helm, Kubectl, and Arc. For more information, see [providers](./concept-providers.md).

## Reconciliation

A process of *reconciliation* ensures that the desired state of a resource is maintained. The resource manager on the cluster compares the current state of all the resources against the desired state specified within the solution manifest. If there is a discrepancy, the resource manager invokes the appropriate provider on the cluster to update the resource to the desired state.

If the resource manager can't reconcile the desired state, that deployment is reported as a failure and the cluster remains on the previous successful state.

By default, the resource manager triggers reconciliation every three minutes to check for updates to the desired state. You can configure this polling interval policy to customize it for scenarios that require more frequent checks or those that prefer less frequent checks to reduce overhead.

## Status reporting

Status reporting capabilities ensure that the desired state is maintained. When the resource manager on the cluster detects a failure for a single component, it considers the entire deployment to be a failure and retries the deployment. If a particular component fails again, the deployment is considered to have failed again, and based on a configurable reconciliation setting, the resource manager stops state seeking and updates the instance with the *failed* status. This failure (or success) state is synchronized up to the cloud and made available through resource provider APIs. Experience workflows can then be built to notify the customer, attempt to retry again, or to deploy a previous solution version.
