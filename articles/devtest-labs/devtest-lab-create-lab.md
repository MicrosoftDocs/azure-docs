---
title: 'Quickstart: Create a lab in Azure portal'
description: In this quickstart, you create a lab using the Azure portal and Azure DevTest Labs.
ms.topic: quickstart
ms.date: 11/04/2021
ms.custom: mode-portal
---

# Quickstart: Create a lab in Azure DevTest Labs in Azure portal

Get started with Azure DevTest Labs by using the Azure portal to create a lab. Azure DevTest Labs encompasses a group of resources, such as Azure virtual machines (VMs) and networks. This infrastructure lets you better manage those resources by specifying limits and quotas. This quickstart walks you through the process of creating a lab using the Azure portal.

## Prerequisites

An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F). You must be the owner of the subscription to create the lab.

## Sign in to the Azure portal

By selecting the following link, you'll be transferred to the Azure portal page that allows you to start creating a new lab in Azure DevTest Labs.

[Get started with Azure DevTest Labs in minutes](https://go.microsoft.com/fwlink/?LinkID=627034&clcid=0x409)

## Create a DevTest Labs resource

The **Create Devtest Lab** page contains five tabs. The first tab is **Basic Settings**.

> [!TIP]
> At the bottom of each page, you will find a link that allows you to **download a template for automation**.

### Basic Settings tab

Provide the following information:

|Property | Description |
|---|---|
|Subscription| From the drop-down list, select the Azure subscription to be used for the lab.|
|Resource&nbsp;group| From the drop-down list, select your existing resource group, or select **Create new**.|
|Lab name| Enter a unique name within your subscription for the lab.|
|Location| From the drop-down list, select a location that's used for the lab.|
|Public environments| Public environment repository contains a list of curated Azure Resource Manager templates that enable lab users to create PaaS resources within Labs. For more information, see [Configure and use public environments](devtest-lab-configure-use-public-environments.md).|

:::image type="content" source="./media/devtest-lab-create-lab/portal-create-basic-settings.png" alt-text="Screenshot of Basic Settings tab for Create DevTest Labs.":::


### Auto-shutdown tab

Auto-shutdown allows you to automatically shut down all machines in a lab at a scheduled time each day. The auto-shutdown feature is mainly a cost-saving feature. To change the auto-shutdown settings after creating the lab, see [Manage all policies for a lab in Azure DevTest Labs](./devtest-lab-set-lab-policy.md#set-auto-shutdown).

Provide the following information:

|Property | Description |
|---|---|
|Enabled| Select **On** to enable this policy, or **Off** to disable it.|
|Scheduled&nbsp;shutdown| Enter a time to shut down all VMs in the current lab.|
|Time zone| Select a time zone from the drop-down list.|
|Send notification before auto-shutdown? | Select **Yes** or **No** to send a notification 30 minutes before the specified auto-shutdown time. If you choose **Yes**, enter a webhook URL endpoint or email address specifying where you want the notification to be posted or sent. The user receives notification and is given the option to delay the shutdown.|
|Webhook URL| A notification will be posted to the specified webhook endpoint when the auto-shutdown is about to happen.|
|Email address| Enter a set of semicolon-delimited email addresses to receive alert notification emails.|

:::image type="content" source="./media/devtest-lab-create-lab/portal-create-auto-shutdown.png" alt-text="Screenshot of auto-shutdown schedule details.":::

### Networking tab

A default network will be created for you (that can be changed/configured later), or an existing virtual network can be selected.

Provide the following information:

|Property | Description |
|---|---|
|Virtual&nbsp;Network| Keep the default or select an existing one from the drop-down list. Virtual networks are logically isolated from each other in Azure. By default, virtual machines in the same virtual network can access each other.|
|Subnet| Keep the default or select an existing one from the drop-down list. A subnet is a range of IP addresses in your virtual network, which can be used to isolate virtual machines from each other or from the Internet.|

:::image type="content" source="./media/devtest-lab-create-lab/portal-create-networking.png" alt-text="Screenshot of networking details.":::

### Tags tab

Tags are useful to help you manage and organize lab resources by category. For more information, see [Add tags to a lab](devtest-lab-add-tag.md).

Provide the following information:

|Property | Description |
|---|---|
|Name| Tag names are case-insensitive and are limited to 512 characters.|
|Value| Tag values are case-sensitive and are limited to 256 characters.|

:::image type="content" source="./media/devtest-lab-create-lab/portal-create-tags.png" alt-text="Screenshot of tags details.":::

### Review + create tab

The **Review + create** tab validates all of your configurations. If all settings are valid, **Succeeded** will appear at the top. Review your settings and then select **Create**. You can monitor the status of the lab creation process by watching the **Notifications** area at the top-right of the portal page. 

:::image type="content" source="./media/devtest-lab-create-lab/portal-review-and-create.png" alt-text="Screenshot of review and create details.":::

## Post creation

1. After the creation process finishes, from the deployment notification, select **Go to resource**.

    :::image type="content" source="./media/devtest-lab-create-lab/creation-notification.png" alt-text="Screenshot of DevTest Labs deployment notification.":::

1. The lab's **Overview** page looks similar to the following image:

    :::image type="content" source="./media/devtest-lab-create-lab/lab-home-page.png" alt-text="Screenshot of DevTest Labs overview page.":::

## Clean up resources

Delete resources to avoid charges for running the lab on Azure. If you plan to go through the next article to add a VM to the lab, you can clean up the resources after you finish that article. Otherwise, follow these steps:

1. Return to the home page for the lab you created.

1. From the top menu, select **Delete**.

   :::image type="content" source="./media/devtest-lab-create-lab/portal-lab-delete.png" alt-text="Screenshot of lab delete button.":::

1. On the **Are you sure you want to delete it** page, enter the lab name in the text box and then select **Delete**.

1. During the deletion, you can select **Notifications** at the top of your screen to view progress. Deleting the lab takes a while. Continue to the next step once the lab is deleted.

1. If you created the lab in an existing resource group, then all of the lab resources have been removed. If you created a new resource group for this tutorial, it's now empty and can be deleted. It wouldn't have been possible to have deleted the resource group earlier while the lab was still in it.

## Next steps
In this quickstart, you created a lab. To learn how to add a VM, advance to the next article:

> [!div class="nextstepaction"]
> [Create and add virtual machines to a lab in Azure DevTest Labs](devtest-lab-add-vm.md)
