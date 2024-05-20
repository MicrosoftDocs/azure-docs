---
title: Configuring Microsoft Intune conditional access policies for dev boxes
titleSuffix: Microsoft Dev Box
description: Learn how to configure Microsoft Intune dynamic device groups and conditional access policies to restrict access to dev boxes.
services: dev-box
ms.service: dev-box
author: RoseHJM
ms.author: rosemalcolm
ms.date: 12/20/2023
ms.topic: how-to

# Customer intent: As a platform engineer, I want to configure conditional access policies in Microsoft Intune so that I can control access to dev boxes.

---

# Restrict access to dev boxes by using conditional access policies in Microsoft Intune

In this article, you learn how to configure conditional access policies in Microsoft Intune to control access to dev boxes. For Dev Box, it’s common to configure conditional access policies to restrict who can access dev box, what they can do, and where they can access from. To configure conditional access policies, you can use Microsoft Intune to create dynamic device groups and conditional access policies.

Some usage scenarios for conditional access in Microsoft Dev Box include: 

- Restricting access to dev box to only managed devices 
- Restricting the ability to copy/paste from the dev box 
- Restricting access to dev box from only certain geographies 

Conditional access is the protection of regulated content in a system by requiring certain criteria to be met before granting access to the content. Conditional access policies at their simplest are if-then statements. If a user wants to access a resource, then they must complete an action. Conditional access policies are a powerful tool for being able to keep your organization’s devices secure and environments compliant. 

## Prerequisites

- Microsoft Intune subscription.
- Permission to add and manage groups in Microsoft Intune.

## Create a dynamic device group 

A dynamic group uses rules to determine group membership based on user or device properties. This section shows how to set up a rule for a dynamic group in Microsoft Intune.

To create a conditional access policy that targets dev box devices, you first need to create a dynamic device group that contains your dev boxes. You can create a dynamic security device group that includes all dev boxes by identifying them using keywords specified in the device model of the machine. 

1. Sign in to the [Microsoft Intune admin center](https://intune.microsoft.com). 
 
1. Select **Groups**. 

   :::image type="content" source="media/how-to-configure-intune-conditional-access-policies/intune-admin-center.png" alt-text="Screenshot of the Microsoft Intune admin center, with groups highlighted on the left menu." lightbox="media/how-to-configure-intune-conditional-access-policies/intune-admin-center.png"::: 

1. Select **New Group**. 

   :::image type="content" source="media/how-to-configure-intune-conditional-access-policies/intune-admin-center-groups.png" alt-text="Screenshot of the Microsoft Intune admin center groups page, with New Group highlighted." lightbox="media/how-to-configure-intune-conditional-access-policies/intune-admin-center-groups.png"::: 

1. Provide a name for the new group. 

   :::image type="content" source="media/how-to-configure-intune-conditional-access-policies/intune-admin-center-new-group.png" alt-text="Screenshot of the Microsoft Intune admin new group page." lightbox="media/how-to-configure-intune-conditional-access-policies/intune-admin-center-new-group.png"::: 

1. Optionally, add a description.  

1. Set **Membership Type** to **Dynamic Device**.

1. Select **Add dynamic query** to specify rules for the group. 

   :::image type="content" source="media/how-to-configure-intune-conditional-access-policies/dynamic-membership-rules.png" alt-text="Screenshot of the dynamic membership rules page." lightbox="media/how-to-configure-intune-conditional-access-policies/dynamic-membership-rules.png"::: 

1. In **Property**, select **deviceModel**. 

1. In **Operator**, select **Starts With**.

1. In **Value** enter *Microsoft Dev Box*.

   All dev boxes list the Manufacturer as "Microsoft Corporation" and the Model as "Microsoft Dev Box 8vCPU/32GB/1024GB", where the specs will reflect the VM SKU chosen for that dev box.

1. Validate the group and select **Create**. 

1. After creating your dynamic device group, you can view and manage existing groups on the ****Groups**** pane of the Microsoft Intune admin center.

## Create a conditional access policy  

After creating your device group and validated your dev box devices are members, you can move on to create a conditional access policy for your scenario. In this example, you create a conditional access policy to restrict connections outside of specified geographic regions. 

> [!IMPORTANT]
> Thoroughly test conditional access policies before putting them into production using the *Report-Only* feature. Conditional access policies have the potential to restrict all access to your dev boxes if misconfigured. 

1. Sign in to the [Microsoft Intune admin center](https://intune.microsoft.com). 

1. Select **Endpoint Security** > **Conditional access** > **Create new policy**. 

1. Enter a **Name** for your conditional access policy. 

1. Under **Users**, select the device group you created in the previous section. 

1. Under **Cloud apps or actions**, select **No cloud apps, actions, or authentication contexts selected**. 

1. Select **Cloud apps** > **Include** > **Select apps** > **None** (under Select). 

1. In the **Select** pane, search for and select the apps you require for your scenario: 
  
   | App name | App ID | Description |
   | --- | --- | --- |
   | Windows 365 | 0af06dc6-e4b5-4f28-818e-e78e62d137a5 | Used when retrieving the list of resources for the user and when users initiate actions on their dev box like Restart. |
   | Azure Virtual Desktop | 9cdead84-a844-4324-93f2-b2e6bb768d07 | Used to authenticate to the Gateway during the connection and when the client sends diagnostic information to the service. <br>Might also appear as Windows Virtual Desktop. |
   | Microsoft Remote Desktop | a4a365df-50f1-4397-bc59-1a1564b8bb9c | Used to authenticate users to the dev box. <br>Only needed when you configure single sign-on in a provisioning policy.  |  

1. You should match your conditional access policies between these apps, which ensures that the policy applies to the developer portal, the connection to the Gateway, and the dev box for a consistent experience. If you want to exclude apps, you must also choose all of these apps. 

1. Under **Conditions** > **Locations** > **Excluded** > select the locations where users are allowed to connect from. 

1. Under **Grant**, select **Block Access**.

1. Under **Session**, select **0 controls selected**. 

1. To test the conditional access policy, use the [Report-Only](/entra/identity/conditional-access/concept-conditional-access-report-only) feature under **Enable Policy**. 

1. Select **Create** to create the policy. 

1. After creating your conditional access policy, you can view and manage existing policies in the **Conditional Access - Policies** pane of the Microsoft Intune admin center. 

## Related content

* [Dynamic membership rules for groups in Microsoft Entra ID](/entra/identity/users/groups-dynamic-membership)
* [Learn about Conditional Access and Intune](/mem/intune/protect/conditional-access)
