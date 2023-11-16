---
title: Azure Policies for Lab Services
description: Learn how to use Azure Policy to use built-in policies for Azure Lab Services to make sure your labs are compliant with your requirements.
ms.topic: conceptual
author: ntrogh
ms.author: nicktrog
ms.date: 11/08/2022
---

# Use policies to audit and manage Azure Lab Services

When teams create and run labs on Azure Lab Services, they might face varying requirements to the configuration of resources. Administrators might look for options to control cost, provide customization through templates, or restrict user permissions.

As a platform administrator, you can use policies to lay out guardrails for teams to manage their own resources. [Azure Policy](../governance/policy/index.yml) helps audit and govern resource state. In this article, you learn about available auditing controls and governance practices for Azure Lab Services.

[!INCLUDE [lab plans only note](./includes/lab-services-new-update-focused-article.md)]

## Policies for Azure Lab Services

[Azure Policy](../governance/policy/index.yml) is a governance tool that allows you to ensure that Azure resources are compliant with your policies.

Azure Lab Services provides a set of policies that you can use for common scenarios with Azure Lab Services. You can assign these policy definitions to your existing subscription or use them as the basis to create your own custom definitions.

Policies can be set at different scopes, such as at the subscription or resource group level. For more information, see the [Azure Policy documentation](../governance/policy/overview.md).

For a full list of built-in policies, including policies for Lab Services, see Azure Policy built-in policy definitions.

### Lab Services should enable all options for auto shutdown

This policy enforces that all [shutdown options](how-to-configure-auto-shutdown-lab-plans.md) are enabled while creating the lab.

During policy assignment, lab administrators can choose the following effects:

|**Effect**|**Behavior**|
|----------|------------|
|**Audit** | Labs will show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when all shutdown options aren't enabled for a lab.  |
|**Deny**  | Lab creation will fail if all shutdown options aren't enabled. |

### Lab Services should not allow template virtual machines for labs 

You can use this policy to restrict [customization of lab templates](tutorial-setup-lab.md). When you create a new lab, you can choose to *Create a template virtual machine* or *Use virtual machine image without customization*. If this policy is enabled, only *Use virtual machine image without customization* is allowed. 

During policy assignment, lab administrators can choose the following effects:

|**Effect**|**Behavior**|
|----------|------------|
|**Audit** |Labs will show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when a template virtual machine is used for a lab.|
|**Deny**  |Lab creation will fail if *Create a template virtual machine* option is used for a lab.|

### Lab Services requires non-admin user for labs 

Use this policy to enforce using non-admin accounts while creating a lab. With lab plans, you can choose to add a non-admin account to the VM image.  This new feature allows you to keep separate credentials for VM admin and non-admin users.

During the policy assignment, the lab administrator can choose the following effects:

|**Effect**|**Behavior**|
|----------|------------|
|**Audit** |Labs show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when non-admin accounts aren't used while creating the lab.|
|**Deny**  |Lab creation will fail if *Give lab users a non-admin account on their virtual machines* isn't checked while creating a lab.|

### Lab Services should restrict allowed virtual machine SKU sizes

This policy enforces which SKUs can be used while creating a lab. For example, a lab administrator might want to prevent educators from creating labs with GPU SKUs, since they aren't needed for any classes being taught.

During the policy assignment, the Lab Administrator can choose the following effects:

|**Effect**|**Behavior**|
|----------|------------|
|**Audit** |Labs show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when a non-allowed SKU is used while creating the lab.|
|**Deny**  |Lab creation will fail if the selected SKU while creating a lab isn't allowed as per the policy assignment.|

## Assigning built-in policies

To view the built-in policy definitions related to Azure Lab Services, use the following steps:

1. Go to **Azure Policy** in the [Azure portal](https://portal.azure.com).
1. Select **Definitions**.
1. For **Type**, select *Built-in*, and for **Category**, select **Lab Services**.

From here, you can select policy definitions to view them. While viewing a definition, you can use the **Assign** link to assign the policy to a specific scope, and configure the parameters for the policy. For more information, see [Assign a policy - portal](../governance/policy/assign-policy-portal.md).

You can also assign policies by using [Azure PowerShell](../governance/policy/assign-policy-powershell.md), [Azure CLI](../governance/policy/assign-policy-azurecli.md), and [templates](../governance/policy/assign-policy-template.md).

## Custom policies

In addition to the new built-in policies described above, you can create and apply custom policies. This technique is helpful in situations where none of the built-in policies apply or where you need more granularity.

Learn how to create custom policies:
- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md).
- [Tutorial: Create a custom policy definition](../governance/policy/tutorials/create-custom-policy-definition.md).

## Next steps

- [How to use the Lab Services should restrict allowed virtual machine SKU sizes Azure policy](how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy.md)
- [Built-in policies for Azure Lab Services](./policy-reference.md)
- [What is Azure policy?](../governance/policy/overview.md)