---
title: Permissions and security for Azure Chaos Studio
description: Understand how permissions work in Azure Chaos Studio and how you can secure resources from accidental fault injection.
author: prasha-microsoft 
ms.author: prashabora
ms.service: chaos-studio
ms.topic: conceptual
ms.date: 11/01/2021
ms.custom: template-concept, ignite-fall-2021
---

# Permissions and security in Azure Chaos Studio

Azure Chaos Studio enables you to improve service resilience by systematically injecting faults into your Azure resources. Fault injection is a powerful way to improve service resilience, but it can also be dangerous. Causing failures in your application can have more impact than originally intended and open opportunities for malicious actors to infiltrate your applications. Chaos Studio has a robust permission model that prevents faults from being run unintentionally or by a bad actor. In this article, you will learn how you can secure resources that are targeted for fault injection using Chaos Studio.

## How can I restrict the ability to inject faults with Chaos Studio?

Chaos Studio has three levels of security that help you to control how and when fault injection can occur against a resource.

First, a chaos experiment is an Azure resource that is deployed to a region, resource group, and subscription. Users must have appropriate Azure Resource Manager permissions to create, update, start, cancel, delete, or view an experiment. Each permission is an ARM operation that can be granularly assigned to an identity or assigned as part of a role with wildcard permissions. For example, the Contributor role in Azure has */write permission at the assigned scope, which will include Microsoft.Chaos/experiments/write permission. When attempting to control ability to inject faults against a resource, the most important operation to restrict is Microsoft.Chaos/experiments/start/action, since this operation starts a chaos experiment that will inject faults.

Second, a chaos experiment has a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) that executes faults on a resource. When you create an experiment, the system-assigned managed identity is created in your Azure Active Directory tenant with no permissions. Before running your chaos experiment, you must grant its identity [appropriate permissions](chaos-studio-fault-providers.md) to all target resources. If the experiment identity does not have appropriate permission to a resource, it will not be able to execute a fault against that resource.

Finally, each resource must be onboarded to Chaos Studio as [a target with corresponding capabilities enabled](chaos-studio-targets-capabilities.md). If a target or the capability for the fault being executed does not exist, the experiment fails without impacting the resource.

## Agent authentication

When running agent-based faults, you need to install the Chaos Studio agent on your virtual machine or virtual machine scale set. The agent uses a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate to Chaos Studio and an *agent profile* to establish relationship to a specific VM resource. When onboarding a virtual machine or virtual machine scale set for agent-based faults, you first create an agent target. The agent target must have a reference to the user-assigned managed identity that will be used for authentication. The agent target contains an *agent profile ID*, which is provided as configuration when installing the agent. Agent profiles are unique to each target and targets are unique per resource.

## ARM operations and roles

Chaos Studio has the following operations:

| Operation | Description |
| -- | -- |
| Microsoft.Chaos/targets/[Read,Write,Delete] | Get, create, update, or delete a target. |
| Microsoft.Chaos/targets/capabilities/[Read,Write,Delete] | Get, create, update, or delete a capability. |
| Microsoft.Chaos/locations/targetTypes/Read | Get all target types. |
| Microsoft.Chaos/locations/targetTypes/capabilityTypes/Read | Get all capability types. |
| Microsoft.Chaos/experiments/[Read,Write,Delete] | Get, create, update, or delete a chaos experiment. |
| Microsoft.Chaos/experiments/start/action | Start a chaos experiment. |
| Microsoft.Chaos/experiments/cancel/action | Stop a chaos experiment. |
| Microsoft.Chaos/experiments/statuses/Read | Get the execution status for a run of a chaos experiment. |
| Microsoft.Chaos/experiments/executionDetails/Read | Get the execution details (status and errors for each action) for a run of a chaos experiment. |

To assign these permissions granularly, you can [create a custom role](../role-based-access-control/custom-roles.md).

## Network security

All user interactions with Chaos Studio happen through Azure Resource Manager. If a user starts an experiment, the experiment may interact with endpoints other than Resource Manager depending on the fault.
* Service-direct faults - Most service-direct faults are executed through Azure Resource Manager. Target resources do not require any allowlisted network endpoints.
* Service-direct AKS Chaos Mesh faults - Service-direct faults for Azure Kubernetes Service that use Chaos Mesh require access that the AKS cluster have a publicly-exposed Kubernetes API server. [You can learn how to limit AKS network access to a set of IP ranges here.](../aks/api-server-authorized-ip-ranges.md)
* Agent-based faults - Agent-based faults require agent access to the Chaos Studio agent service. A virtual machine or virtual machine scale set must have outbound access to the agent service endpoint for the agent to connect successfully. The agent service endpoint is `https://acs-prod-<region>.chaosagent.trafficmanager.net`, replacing `<region>` with the region where your virtual machine is deployed, for example, `https://acs-prod-eastus.chaosagent.trafficmanager.net` for a virtual machine in East US.

Azure Chaos Studio does not support Service Tags or Private Link.

## Data encryption

Chaos Studio encrypts all data by default. Chaos Studio only accepts input for system properties like managed identity object IDs, experiment/step/branch names, and fault parameters (for example, the network port range to block in a network disconnect fault). These properties shouldn't be used to store sensitive data such as payment information or passwords. For more on how Chaos Studio protects your data, see [the Azure customer data protection article](../security/fundamentals/protection-customer-data.md).

## Next steps
Now that you understand how to secure your chaos experiment you are ready to:
- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Create and run your first Azure Kubernetes Service experiment](chaos-studio-tutorial-aks-portal.md)
