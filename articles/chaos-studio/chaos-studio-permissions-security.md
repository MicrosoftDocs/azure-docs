---
title: Permissions and security for Azure Chaos Studio Preview
description: Understand how permissions work in Azure Chaos Studio Preview and how you can secure resources from accidental fault injection.
author: prasha-microsoft
ms.author: prashabora
ms.service: chaos-studio
ms.topic: conceptual
ms.date: 06/30/2023
ms.custom: template-concept, ignite-fall-2021, devx-track-arm-template
---

# Permissions and security in Azure Chaos Studio Preview

Azure Chaos Studio Preview enables you to improve service resilience by systematically injecting faults into your Azure resources. Fault injection is a powerful way to improve service resilience, but it can also be dangerous. Causing failures in your application can have more impact than originally intended and open opportunities for malicious actors to infiltrate your applications.

Chaos Studio has a robust permission model that prevents faults from being run unintentionally or by a bad actor. In this article, you learn how you can secure resources that are targeted for fault injection by using Chaos Studio.

## How can I restrict the ability to inject faults with Chaos Studio?

Chaos Studio has three levels of security to help you control how and when fault injection can occur against a resource:

* First, a chaos experiment is an Azure resource that's deployed to a region, resource group, and subscription. Users must have appropriate Azure Resource Manager permissions to create, update, start, cancel, delete, or view an experiment.

   Each permission is a Resource Manager operation that can be granularly assigned to an identity or assigned as part of a role with wildcard permissions. For example, the Contributor role in Azure has `*/write` permission at the assigned scope, which includes `Microsoft.Chaos/experiments/write` permission.

   When you attempt to control the ability to inject faults against a resource, the most important operation to restrict is `Microsoft.Chaos/experiments/start/action`. This operation starts a chaos experiment that injects faults.

* Second, a chaos experiment has a [system-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) or a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) that executes faults on a resource. If you choose to use a system-assigned managed identity for your experiment, the identity is created at experiment creation time in your Azure Active Directory tenant. User-assigned managed identites may be used across any number of experiments.

   Within a chaos experiment, you can choose to enable custom role assignment on either your system-assigned or user-assigned managed identity selection. Enabling this functionality allows Chaos Studio to create and assign a custom role containing any necessary experiment action capabilities to your experiment's identity (that do not already exist in your identity selection). If a chaos experiment is using a user-assigned managed identity, any custom roles assigned to the experiment identity by Chaos Studio will persist after experiment deletion.
  
  If you choose to grant your experiment permissions manually, you must grant its identity [appropriate permissions](chaos-studio-fault-providers.md) to all target resources. If the experiment identity doesn't have appropriate permission to a resource, it can't execute a fault against that resource.

* Third, each resource must be onboarded to Chaos Studio as [a target with corresponding capabilities enabled](chaos-studio-targets-capabilities.md). If a target or the capability for the fault being executed doesn't exist, the experiment fails without affecting the resource.

## User-assigned Managed Identity

A chaos experiment can utilize a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) to obtain sufficient permissions to inject faults on the experiment's target resources. Additionally, user-assigned managed identities may be used across any number of experiments in Chaos Studio. To utilize this functionality, you must:
* First, create a user-assigned managed identity within the [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md) service. You may assign your user-assigned managed identity required permissions to run your chaos experiment(s) at this point.
* Second, when creating your chaos experiment, select a user-assigned managed identity from your Subscription. You can choose to enable custom role assignment at this step. Enabling this functionality would grant your identity selection any required permissions it may need based on the faults contained in your experiment.
* Third, after you've added all of your faults to your chaos experiment, review if your identity configuration contains all the necessary actions for your chaos experiment to run successfully. If it does not, contact your system administrator for access or edit your experiment's fault selections.

## Agent authentication

When you run agent-based faults, you must install the Chaos Studio agent on your virtual machine (VM) or virtual machine scale set. The agent uses a [user-assigned managed identity](../active-directory/managed-identities-azure-resources/overview.md) to authenticate to Chaos Studio and an *agent profile* to establish a relationship to a specific VM resource.

When you onboard a VM or virtual machine scale set for agent-based faults, you first create an agent target. The agent target must have a reference to the user-assigned managed identity that's used for authentication. The agent target contains an *agent profile ID*, which is provided as configuration when you install the agent. Agent profiles are unique to each target and targets are unique per resource.

## Azure Resource Manager operations and roles

Chaos Studio has the following operations:

| Operation | Description |
|---|---|
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

All user interactions with Chaos Studio happen through Azure Resource Manager. If a user starts an experiment, the experiment might interact with endpoints other than Resource Manager, depending on the fault:

* **Service-direct faults**: Most service-direct faults are executed through Azure Resource Manager and don't require any allowlisted network endpoints.
* **Service-direct AKS Chaos Mesh faults:** Service-direct faults for Azure Kubernetes Service that use Chaos Mesh require access to the AKS cluster's Kubernetes API server. 
    * [Learn how to limit AKS network access to a set of IP ranges here](../aks/api-server-authorized-ip-ranges.md). You can obtain Chaos Studio's IP ranges by querying the `ChaosStudio` [service tag with the Service Tag Discovery API or downloadable JSON files](../virtual-network/service-tags-overview.md).
    * Currently, Chaos Studio can't execute Chaos Mesh faults if the AKS cluster has [local accounts disabled](../aks/manage-local-accounts-managed-azure-ad.md).
* **Agent-based faults**: To use agent-based faults, the agent needs access to the Chaos Studio agent service. A VM or virtual machine scale set must have outbound access to the agent service endpoint for the agent to connect successfully. The agent service endpoint is `https://acs-prod-<region>.chaosagent.trafficmanager.net`. You must replace the `<region>` placeholder with the region where your VM is deployed. An example is `https://acs-prod-eastus.chaosagent.trafficmanager.net` for a VM in East US.

Chaos Studio doesn't support Azure Private Link for agent-based scenarios. 

## Service tags
A [service tag](../virtual-network/service-tags-overview.md) is a group of IP address prefixes that can be assigned to inbound and outbound rules for network security groups. It automatically handles updates to the group of IP address prefixes without any intervention.

You can use service tags to explicitly allow inbound traffic from Chaos Studio without the need to know the IP addresses of the platform. Chaos Studio's service tag is `ChaosStudio`.

A limitation of service tags is that they can only be used with applications that have a public IP address. If a resource only has a private IP address, service tags can't route traffic to it.

## Data encryption

Chaos Studio encrypts all data by default. Chaos Studio only accepts input for system properties like managed identity object IDs, experiment/step/branch names, and fault parameters. An example is the network port range to block in a network disconnect fault.

These properties shouldn't be used to store sensitive data, such as payment information or passwords. For more information on how Chaos Studio protects your data, see [Azure customer data protection](../security/fundamentals/protection-customer-data.md).

## Next steps
Now that you understand how to secure your chaos experiment, you're ready to:

- [Create and run your first experiment](chaos-studio-tutorial-service-direct-portal.md)
- [Create and run your first Azure Kubernetes Service experiment](chaos-studio-tutorial-aks-portal.md)
