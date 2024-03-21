---
title: "Azure Operator Nexus: How to use Azure Policy with Operator Nexus Resources"
description: Learn how to assign Azure built-in policies or create custom policies to secure your Operator Nexus resources.
author: graymark
ms.author: graymark
ms.service: azure-operator-nexus
ms.topic: how-to
ms.date: 11/30/2023
ms.custom: template-how-to
---

# Use Azure Policy to secure your Nexus resources

In this article, you'll learn how to use Azure Policy to secure and validate the compliance status of your Nexus resources.

## Before you begin

If you're new to Azure Policy, here are some helpful resources that you can use to become more familiar with Azure Policy.

- [Azure Policy documentation](../governance/policy/overview.md)
- Interactive Learning Modules: [Azure Policy training on Microsoft Learn](/learn/browse/?terms=Azure%20Policy)

##### Understanding Policy Definitions and Assignments

- **Policy Definitions**: These are the rules that your resources need to comply with. They can be built-in or custom.
- **Assignments**: The process of applying a policy definition to your resources.

##### Steps for security enforcement

1. **Explore built-in policies**: Review built-in policies relevant to Nexus Bare Metal Machine (BMM) resources.
2. **Customize policies**: Customize policies to address specific needs of your resources.
3. **Policy assignment**: Assign policies through the Azure portal, ensuring correct scope.
4. **Monitoring and compliance**: Regularly monitor policy compliance using Azure tools.
5. **Troubleshooting**: Address common issues that arise during policy assignment.

##### Visual Guides and Examples

- Step-by-Step Policy Assignment: [Assigning policies in Azure portal](../governance/policy/assign-policy-portal.md)
- Troubleshooting Guide: [Common policy assignment issues](../governance/policy/troubleshoot/general.md)

## Prerequisites

- One or more on-premises Nexus resources that are Arc-connected to Azure.

  > [!NOTE]
  > Operator Nexus does not require you to install the Azure Policy add-on for the Undercloud Kubernetes connected cluster or BMM connected machine resources since the extensions are automatically installed during cluster deployment.

- A user account in your subscription with the appropriate role:

  - A [Resource Policy Contributor](../role-based-access-control/built-in-roles.md#resource-policy-contributor) or Owner can view, create, assign, and disable policies.
  - A Contributor or Reader can view policies and policy assignments.

  **Preparation Checklist:**

  > [!div class="checklist"]
  > * Familiarize with Azure CLI or PowerShell for policy management.
  > * Review your organization's security and compliance requirements.
  > * Identify specific Azure Policy features relevant to your needs.

## Use Azure Policy to secure your Nexus BMM resources

The Operator Nexus service offers a built-in policy definition that is recommended to be assigned to your Nexus BMM resources. This policy definition is called **[Preview]: Nexus compute machines should meet security baseline**. This policy definition is used to ensure that your Nexus BMM resources are configured with industry best practice security settings.

- [[Preview]: Nexus compute machines should meet security baseline](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec2c1bce-5ad3-4b07-bb4f-e041410cd8db)

## Use Azure Policy to secure your Nexus Kubernetes cluster

Operator Nexus Arc-connected Nexus Kubernetes do not yet have built-in policy definitions available. However, you can create custom policy definitions to meet your organization's security and compliance requirements or utilize built-in policy definitions for AKS clusters.

- [Understand Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md)
- [Azure Policy Built-in definitions for AKS](../aks/policy-reference.md)

### Customizing Policies for Nexus Kubernetes cluster

- Customize policies considering the unique aspects of Nexus Kubernetes clusters, such as network configurations and container security.
- Refer to [Custom policy definitions](../governance/policy/tutorials/create-custom-policy-definition.md) for guidance.

## Apply and validate Policies for Nexus resources

Whether you are securing Nexus BMM resources or Nexus Kubernetes clusters, the process of applying and validating policies is similar. Here's a generalized approach:

1. **Identify Suitable Policies**:

   - For Nexus Bare Metal Machine resources, consider the recommended **[Preview]: Nexus compute machines should meet security baseline** policy.
   - For Nexus Kubernetes clusters, explore [built-in AKS policies](../aks/policy-reference.md) or create custom policy definitions to meet specific security and compliance needs.
   - Review [Azure Policy Built-in definitions](../governance/policy/samples/built-in-policies.md) and [Azure Policy for Kubernetes clusters](../governance/policy/concepts/policy-for-kubernetes.md) for more insights.

2. **Assign Policies**:

   - Utilize the Azure portal to assign these policies to your Nexus resources.
   - Ensure the correct scope of assignment, which could be at the subscription, resource group, or individual resource level.
   - For custom policies, follow the guidelines in [Creating custom policy definitions](../governance/policy/tutorials/create-custom-policy-definition.md).

3. **Validate Policy Application**:
   - Post assignment, validate that the policies are correctly applied and are effectively monitoring compliance.
   - Utilize Azure compliance tools and dashboards for ongoing monitoring and reporting.
   - For detailed steps on validation, refer to [Validating Azure Policy](../governance/policy/how-to/get-compliance-data.md).

This approach ensures that all your Operator Nexus resources, regardless of their type, are secured and compliant with your organizational policies, utilizing the powerful capabilities of Azure Policy.
