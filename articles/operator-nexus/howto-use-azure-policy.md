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

In this article, you can learn how to use Azure Policy to secure and validate the compliance status of your Nexus resources.

## Before you begin

If you're new to Azure Policy, here are some helpful resources that you can use to become more familiar with Azure Policy.

- [Azure Policy documentation](../governance/policy/overview.md)
- Interactive Learning Modules: [Azure Policy training on Microsoft Learn](/learn/browse/?terms=Azure%20Policy)

##### Understanding Policy Definitions and Assignments

- **Policy Definitions**: The rules that your resources need to comply with. They can be built-in or custom.
- **Assignments**: The process of applying a policy definition to your resources.

##### Steps for security enforcement

1. **Explore built-in policies**: Review built-in policies relevant to Nexus Bare Metal Machine (BMM) and Compute Cluster resources.
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

  > [!NOTE]
  > Operator Nexus managed infrastructure resources may not align with custom internal policies based on the management and release patterns of the platform. Additionally, Azure baseline policies where input is required (e.g., list of authorized ports) or installed extension expectations (e.g., Azure Kubernetes Service clusters should have the Azure Policy add-on for Kubernetes installed) will fail by default. Nexus managed resources such as the Cluster Manager are not intended for direct customer interaction nor support customer deployed extensions or integrations.

## Use Azure Policy to secure your Nexus BMM resources

The Operator Nexus service offers a built-in policy definition that is recommended to assign to your Nexus BMM resources. This policy definition is called **[Preview]: Nexus compute machines should meet security baseline**. This policy definition is used to ensure that your Nexus BMM resources are configured with industry best practice security settings.

- [[Preview]: Nexus compute machines should meet security baseline](https://portal.azure.com/#blade/Microsoft_Azure_Policy/PolicyDetailBlade/definitionId/%2Fproviders%2FMicrosoft.Authorization%2FpolicyDefinitions%2Fec2c1bce-5ad3-4b07-bb4f-e041410cd8db)

## Use Azure Policy to secure your Nexus Kubernetes Compute Cluster resources

The Operator Nexus service offers a built-in initiative definition that is recommended to assign to your Nexus Kubernetes Compute Cluster resources. This initiative definition is called **[Preview]: Nexus compute cluster should meet security baseline**. This initiative definition is used to ensure that your Nexus Kubernetes Compute Cluster resources are configured with industry best practice security settings.

- [[Preview]: Nexus compute cluster should meet security baseline](https://portal.azure.com/#blade/Microsoft_Azure_Policy/InitiativeDetail.ReactView/id/%2Fproviders%2FMicrosoft.Authorization%2FpolicySetDefinitions%2F336cb876-5cb8-4795-b9d1-bd9323d3487e)

### Customizing Policies

- Customize policies considering the unique aspects of the specific resources.
- Refer to [Custom policy definitions](../governance/policy/tutorials/create-custom-policy-definition.md) for guidance.

## Apply and validate Policies for Nexus resources

Whether you're securing Nexus BMM resources or Nexus Kubernetes Compute Clusters, the process of applying and validating policies is similar. Here's a generalized approach:

1. **Identify Suitable Policies**:

   - For Nexus Bare Metal Machine resources, consider the recommended **[Preview]: Nexus compute machines should meet security baseline** policy.
   - For Nexus Kubernetes Compute Clusters, consider the recommended **[Preview]: Nexus compute cluster should meet security baseline** initiative.

2. **Assign Policies**:

   - Utilize the Azure portal to assign these policies to your Nexus resources.
   - Ensure the correct scope of assignment, which could be at the subscription, resource group, or individual resource level.
   - For custom policies, follow the guidelines in [Creating custom policy definitions](../governance/policy/tutorials/create-custom-policy-definition.md).

3. **Validate Policy Application**:
   - Post assignment, validate that the policies are correctly applied and are effectively monitoring compliance.
   - Utilize Azure compliance tools and dashboards for ongoing monitoring and reporting.
   - For detailed steps on validation, refer to [Validating Azure Policy](../governance/policy/how-to/get-compliance-data.md).

This approach ensures that all your Operator Nexus resources, regardless of their type, are secured and compliant with your organizational policies, utilizing the powerful capabilities of Azure Policy.
