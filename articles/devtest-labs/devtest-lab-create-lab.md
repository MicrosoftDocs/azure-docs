---
title: 'Quickstart: Create a lab in the Azure portal'
description: Learn how to quickly create a lab in Azure DevTest Labs by using the Azure portal.
ms.topic: quickstart
ms.author: rosemalcolm
author: RoseHJM
ms.date: 09/30/2023
ms.custom: mode-ui, UpdateFrequency2
---

# Quickstart: Create a lab in the Azure portal

This quickstart walks you through creating a lab in Azure DevTest Labs by using the Azure portal. [Azure DevTest Labs](https://azure.microsoft.com/services/devtest-lab) is a service for easily creating, using, and managing infrastructure-as-a-service (IaaS) virtual machines (VMs) and platform-as-a-service (PaaS) environments in a lab context.

## Prerequisite

- At least [Contributor](../role-based-access-control/built-in-roles.md#contributor) access to an Azure subscription. If you don't have an Azure account, [create one for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create a lab

1. In the [Azure portal](https://portal.azure.com), search for and select *DevTest Labs*.
1. On the **DevTest Labs** page, select **Create**. The **Create DevTest Lab** page appears.
1. On the **Basic Settings** tab, provide the following information:
   - **Subscription**: Change the subscription if you want to use a different subscription for the lab.
   - **Resource group**: Select an existing resource group from the dropdown list, or select **Create new** to create a new resource group so it's easy to delete later.
   - **Lab Name**: Enter a name for the lab.
   - **Location**: If you're creating a new resource group, select an Azure region for the resource group and lab.
   - **Public environments**: Leave **On** for access to the [DevTest Labs public environment repository](https://github.com/Azure/azure-devtestlab/tree/master/Environments). Set to **Off** to disable access. For more information, see [Enable public environments when you create a lab](devtest-lab-create-environment-from-arm.md#enable-public-environments-when-you-create-a-lab).

   :::image type="content" source="./media/devtest-lab-create-lab/portal-create-basic-settings.png" alt-text="Screenshot of the Basic Settings tab in the Create DevTest Labs form.":::

1. Optionally, select each tab at the top of the page, and customize those settings
   - [**Auto-shutdown**](#auto-shutdown-tab)
   - [**Networking**](#networking-tab)
   - [**Tags**](#tags-tab) 

   You can also apply or change most of these settings after lab creation.
1. After you complete all settings, select **Review + create** at the bottom of the page.
1. If the settings are valid, **Succeeded** appears at the top of the **Review + create** page. Review the settings, and then select **Create**.

> [!TIP]
> Select **Download a template for automation** at the bottom of the page to view and download the lab configuration as an Azure Resource Manager (ARM) template. You can use the ARM template to create more labs.

### Auto-shutdown tab

Auto-shutdown helps save lab costs by shutting down all lab VMs at a certain time of day. To configure auto-shutdown:

1. On the **Create DevTest Lab** page, select the **Auto-shutdown** tab.
1. Fill out the following information:
   - **Enabled**: Select **On** to enable auto shutdown.
   - **Scheduled shutdown** and **Time zone**: Specify the daily time and time zone to shut down all lab VMs.
   - **Send notification before auto-shutdown**: Select **Yes** or **No** for the option to post or send a notification 30 minutes before the auto-shutdown time.
   - **Webhook URL** and **Email address**: If you choose to send notifications, enter a webhook URL endpoint or semicolon-separated list of email addresses where you want the notification to post or be sent. For more information, see [Configure auto shutdown for labs and VMs](devtest-lab-auto-shutdown.md).

   :::image type="content" source="./media/devtest-lab-create-lab/portal-create-auto-shutdown.png" alt-text="Screenshot of the Auto-shutdown tab in the Create DevTest Labs form.":::

### Networking tab

Azure DevTest Labs creates a new default virtual network for each lab. If you have another virtual network, you can choose to use it for the new lab instead of the default. For more information, see [Add a virtual network in Azure DevTest Labs](devtest-lab-configure-vnet.md).

To configure networking:

1. On the **Create DevTest Lab** page, select the **Networking** tab.
1. For **Virtual Network**, select a different virtual network from the dropdown list. For **Subnet**, if necessary, select a subnet from the dropdown list.
1. For **Isolate lab resources**, select **Yes** to completely isolate lab resources to the selected network. For more information, see [Network isolation in DevTest Labs](network-isolation.md).

:::image type="content" source="./media/devtest-lab-create-lab/portal-create-networking.png" alt-text="Screenshot of the Networking tab in the Create DevTest Labs form.":::

### Tags tab

You can assign tags that apply to all lab resources. Tags can help you manage and track resources. For more information, see [Add tags to a lab](devtest-lab-add-tag.md).

To add tags:

1. On the **Create DevTest Lab** page, select the **Tags** tab.
1. Under **Name** and **Value**, select or enter one or more case-sensitive name-value pairs to help identify resources.

:::image type="content" source="./media/devtest-lab-create-lab/portal-create-tags.png" alt-text="Screenshot of the Tags tab in the Create DevTest Labs form.":::

## Verify lab creation

After you select **Create**, you can monitor the lab creation process in **Notifications** at top right in the portal.

:::image type="content" source="./media/devtest-lab-create-lab/creation-notification.png" alt-text="Screenshot of DevTest Labs deployment notification.":::

When the deployment finishes, select **Go to resource**. The lab's **Overview** page appears.

:::image type="content" source="./media/devtest-lab-create-lab/lab-home-page.png" alt-text="Screenshot of DevTest Labs overview page.":::

You can now add and configure VMs, environments, users, and policies for the lab.

## Clean up resources

When you're done using the lab, delete it and its resources to avoid further charges.

1. On the lab **Overview** page, select **Delete** from the top menu.

   :::image type="content" source="./media/devtest-lab-create-lab/portal-lab-delete.png" alt-text="Screenshot of lab delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name, and then select **Delete**.

   During the deletion process, you can select **Notifications** at the top of your screen to view progress. Deleting a lab can take a while.

If you created a resource group for the lab, you can now delete the resource group. You can't delete a resource group that has a lab in it. Deleting the resource group that contained the lab deletes all resources in the resource group.

1. Select the resource group that contained the lab from your subscription's **Resource groups** list.
1. At the top of the page, select **Delete resource group**.
1. On the **Are you sure you want to delete "\<resource group name>"** page, enter the resource group name, and then select **Delete**.

## Next steps

To learn how to add VMs to your lab, go on to the next article:

> [!div class="nextstepaction"]
> [Create and add virtual machines to a lab in Azure DevTest Labs](devtest-lab-add-vm.md)