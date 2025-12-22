---
title: Enable Periodic Assessment and Scheduled Patching Using a Policy
description: In this tutorial, you learn how to enable periodic assessment and scheduled patching for virtual machines by using a policy.
ms.service: azure-update-manager
ms.date: 08/21/2025
ms.topic: tutorial 
author: habibaum
ms.author: v-uhabiba
# Customer intent: "As an IT administrator, I want to enable periodic assessment and schedule updates for Azure VMs by using a policy so that I can ensure compliance and streamline the management of updates across all machines at scale."
---

# Tutorial: Enable periodic assessment and scheduled patching on Azure VMs by using a policy

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This tutorial explains how to enable periodic assessment and scheduled patching on your Azure virtual machines (VMs) at scale by using a policy. You can use a policy to assign standards and assess compliance at scale. [Learn more](../governance/policy/overview.md).

*Periodic assessment* is the display of the latest updates available for your machines. It removes the hassle of performing an assessment manually every time you need to check the update status. After you enable this setting, Azure Update Manager fetches updates on your machine once every 24 hours.

*Scheduled patching* is the ability to target a group of machines for update deployment via Azure Policy. The grouping keeps you from having to edit your deployment to update machines. You can use a subscription, a resource group, tags, or regions to define the scope and use this feature for the built-in policies. You can customize the built-in policies according to your use case.

In this tutorial, you:

> [!div class="checklist"]
>
> - Enable periodic assessment.
> - Enable scheduled patching.

## Prerequisites

- You must have an Azure subscription. If you don't have one, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

## Enable periodic assessment

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Policy**.

1. Under **Authoring**, select **Definitions**.

1. In the **Category** dropdown list, select **Azure Update Manager**. Select **Configure periodic checking for missing system updates on Azure virtual machines** for Azure machines.

1. When the policy definition opens, select **Assign**.

1. On the **Basics** tab, select your subscription as your scope. You can also specify a resource group within the subscription as the scope. Then select **Next**.

1. On the **Parameters** tab, clear **Only show parameters that need input or review** so that you can see the values of parameters.

1. On the **Assessment** tab, select **AutomaticByPlatform** > **Operating system**. You need to create separate policies for Windows and Linux. Then select **Next**.

1. On the **Remediation** tab, select **Create a remediation task** so that periodic assessment is enabled on your machines. Then select **Next**.

1. On the **Non-compliance** tab, provide the message that you want to appear if a machine is out of compliance. For example: **Your machine doesn't have periodic assessment enabled.** Then select **Review + Create**.

1. On the **Review + Create** tab, select **Create**. This action triggers creation of an assignment and remediation task, which can take a minute or so.

On the **Policy** home page, you can monitor the compliance of resources under **Compliance** and monitor the remediation status under **Remediation**.

## Enable scheduled patching

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Policy**.

1. Under **Authoring**, select **Assignments**. Then select **Assign policy**.

1. On the **Basics** tab:

   - In **Scope**, choose your subscription and resource group, and then choose **Select**.
   - Select **Policy definition** to view a list of policies.
   - In **Available Definitions**, for **Type**, select **Built in**. In the search box, enter **Schedule recurring updates using Azure Update Manager**, and then choose **Select**.
   - Ensure that **Policy enforcement** is set to **Enabled**, and then select **Next**.
  
1. On the **Parameters** tab, by default, only **Maintenance Configuration ARM ID** is visible.

   If you don't specify any other parameters, all machines in the subscription and resource group that you selected on the **Basics** tab are covered under the scope. However, if you want to scope further based on resource group, location, OS, tags, and so on, clear **Only show parameters that need input or review** to view all parameters:

   - **Maintenance Configuration ARM ID**: This mandatory parameter denotes the Azure Resource Manager ID of the schedule that you want to assign to the machines.
   - **Resource groups**: You can specify a resource group if you want to scope down to a resource group. By default, all resource groups within the subscription are selected.
   - **Operating System types**: You can select **Windows** or **Linux**. By default, both are selected.
   - **Machines locations**: You can optionally specify regions for the machines. By default, all regions are selected.
   - **Tags on machines**: You can use tags to scope down further. By default, all are selected.
   - **Tags operator**: If you selected multiple tags, you can specify if you want the scope to be machines that have all the tags or machines that have any of those tags.

   :::image type="content" source="./media/tutorial-assessment-deployment-using-policy/tags-syntax.png" alt-text="Screenshot that shows the syntax to add tags." lightbox="./media/tutorial-assessment-deployment-using-policy/tags-syntax.png":::

1. On the **Remediation** tab, go to **Managed Identity** > **Type of Managed Identity**, and then select **System assigned managed identity**. **Permissions** is already set as **Contributor** according to the policy definition.

   > [!NOTE]
   > If you select **Remediation**, the policy is effective on all the existing machines in the scope. Otherwise, it's assigned to any new machine that you add to the scope.

1. On the **Review + Create** tab, verify your selections. Select **Create** to identify the noncompliant resources so that you can understand the compliance state of your environment.

## Related content

- Learn about [managing multiple machines](manage-multiple-machines.md).
