---
title: Azure Policies for Lab Services
description: This article describes the policies available for Azure Lab Services. 
ms.topic: conceptual
ms.author: rosemalcolm
author: RoseHJM
ms.date: 08/15/2022
---

# What’s new with Azure Policy for Lab Services?

Azure Policy helps you manage and prevent IT issues by applying policy definitions that enforce rules and effects for your resource. Azure Lab Services has added four built-in Azure policies. This article summarizes the new policies available in the August 2022 Update for Azure Lab Services. 

1. Lab Services should enable all options for auto shutdown 
1. Lab Services should not allow template virtual machines for labs 
1. Lab Services should require non-admin user for labs 
1. Lab Services should restrict allowed virtual machine SKU sizes 

For a full list of built-in policies, including policies for Lab Services, see [Azure Policy built-in policy definitions](../governance/policy/samples/built-in-policies.md#lab-services).



[!INCLUDE [lab plans only note](./includes/lab-services-new-update-focused-article.md)]

## Lab Services should enable all options for auto shutdown

This policy enforces that all [shutdown options](how-to-configure-auto-shutdown-lab-plans.md) are enabled while creating the lab. During policy assignment, lab administrators can choose the following effects.  

|**Effect**|**Behavior**|
|-----|-----|
|**Audit**|Labs will show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when all shutdown options are not enabled for a lab.  |
|**Deny**|Lab creation will fail if all shutdown options are not enabled. |

## Lab Services should not allow template virtual machines for labs 

This policy can be used to restrict [customization of lab templates](tutorial-setup-lab.md). When you create a new lab, you can select to *Create a template virtual machine* or *Use virtual machine image without customization*. If this policy is enabled, only *Use virtual machine image without customization* is allowed. During policy assignment, lab administrators can choose the following effects.  

|**Effect**|**Behavior**|
|-----|-----|
|**Audit**|Labs will show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when a template virtual machine is used for a lab.|
|**Deny**|Lab creation to fail if “create a template virtual machine” option is used for a lab.|

## Lab Services requires non-admin user for labs 

This policy is used to enforce using non-admin accounts while creating a lab. With the August 2022 Update, you can choose to add a non-admin account to the VM image.  This new feature allows you to keep separate credentials for VM admin and non-admin users. For more information to create a lab with a non-admin user, see [Tutorial: Create and publish a lab](tutorial-setup-lab.md#create-a-lab), which shows how to give a student non-administrator account rather than default administrator account on the “Virtual machine credentials” page of the new lab wizard.  

During the policy assignment, the lab administrator can choose the following effects. 

|**Effect**|**Behavior**|
|-----|-----|
|**Audit**|Labs show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when non-admin accounts are not used while creating the lab.|
|**Deny**|Lab creation will fail if “Give lab users a non-admin account on their virtual machines” is not checked while creating a lab.|

## Lab Services should restrict allowed virtual machine SKU sizes
This policy is used to enforce which SKUs can be used while creating the lab. For example, a lab administrator might want to prevent educators from creating labs with GPU SKUs since they are not needed for any classes being taught. This policy would allow lab administrators to enforce which SKUs can be used while creating the lab. 
During the policy assignment, the Lab Administrator can choose the following effects.

|**Effect**|**Behavior**|
|-----|-----|
|**Audit**|Labs show on the [compliance dashboard](../governance/policy/assign-policy-portal.md#identify-non-compliant-resources) as non-compliant when a non-allowed SKU is used while creating the lab.|
|**Deny**|Lab creation will fail if SKU chosen while creating a lab is not allowed as per the policy assignment.|

## Custom policies

In addition to the new built-in policies described above, you can create and apply custom policies. This technique is helpful in situations where none of the built-in policies apply or where you need more granularity. 

Learn how to create custom policies:
- [Tutorial: Create and manage policies to enforce compliance](../governance/policy/tutorials/create-and-manage.md).
- [Tutorial: Create a custom policy definition](../governance/policy/tutorials/create-custom-policy-definition.md).

## Next steps

See the following articles:
- [How to use the Lab Services should restrict allowed virtual machine SKU sizes Azure policy](how-to-use-restrict-allowed-virtual-machine-sku-sizes-policy.md)
- [Built-in Policies](../governance/policy/samples/built-in-policies.md#lab-services)
- [What is Azure policy?](../governance/policy/overview.md)