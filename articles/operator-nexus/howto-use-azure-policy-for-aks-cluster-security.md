---
title: "Azure Operator Nexus: How to use Azure Policy to protect on-premises Azure Kubernetes Service clusters"
description: Learn how to assign Azure built-in policies or create custom policies to secure your Operator Nexus on-premises Azure Kubernetes Service (AKS) clusters. 
author: rgendreau
ms.author: rgendreau
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 08/18/2023
ms.custom: template-how-to
---

# Use Azure Policy to secure your Azure Kubernetes Service (AKS) clusters

You can set up extra security protections for your Operator Nexus Arc-connected on-premises Azure Kubernetes Service (AKS) clusters using Azure Policy. With Azure Policy, you assign a single policy or group of related policies (called an initiative or policy set) to one or more of your clusters. Individual policies can be either built-in or custom policy definitions that you create.

This guide provides information on how to apply policy definitions to your clusters and verify those assignments are being enforced.

## Before you begin

If you're new to Azure Policy, here are some helpful resources that you can use to become more familiar with Azure Policy, how it can be used to secure your AKS clusters, and the built-in policy definitions that are available for you to use for AKS resource protection:

- [Azure Policy documentation](/azure/governance/policy/)
- [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md)
- [Azure Policy Built-in definitions for AKS](../aks/policy-reference.md) 

## Prerequisites

- One or more on-premises AKS clusters that are Arc-connected to Azure.

    > [!NOTE]
    > Operator Nexus does not require you to install the Azure Policy add-on for AKS in your clusters since the extension is automatically installed during AKS cluster deployment.

- A user account in your subscription with the appropriate role:
    * A [Resource Policy Contributor](../role-based-access-control/built-in-roles.md#resource-policy-contributor) or Owner can view, create, assign, and disable policies.
    * A Contributor or Reader can view policies and policy assignments.

## Apply and validate policies against your AKS clusters

The process for assigning a policy or initiative to your AKS clusters and validating the assignment is as follows:

1. Determine whether there is an existing [built-in AKS policy](../aks/policy-reference.md) or initiative that is suitable for your security requirements.
2. Sign in to the [Azure portal](https://portal.azure.com) to perform the appropriate type of policy or initiative assignment on your Operator Nexus subscription based on your research in Step 1.
    * If a built-in policy or initiative exists, you can assign it using the instructions [here](../aks/use-azure-policy.md?source=recommendations#assign-a-built-in-policy-definition-or-initiative).
    * Otherwise, you can create and assign a [custom policy definition](../aks/use-azure-policy.md?source=recommendations#create-and-assign-a-custom-policy-definition).

3. [Validate](../aks/use-azure-policy.md?source=recommendations#validate-an-azure-policy-is-running) that the policy or initiative has been applied to your clusters.
