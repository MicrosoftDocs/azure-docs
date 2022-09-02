---
title: Create an autoscale scaling plan for Azure Virtual Desktop
description: How to create an autoscale scaling plan to optimize deployment costs.
author: Heidilohr
ms.topic: how-to
ms.date: 08/15/2022
ms.author: helohr
manager: femila
ms.custom: references_regions
---
# Create an autoscale scaling plan for Azure Virtual Desktop

Autoscale lets you scale your session host virtual machines (VMs) in a host pool up or down to optimize deployment costs. You can create a scaling plan based on:

- Time of day
- Specific days of the week
- Session limits per session host

>[!NOTE]
> - Azure Virtual Desktop (classic) doesn't support autoscale. 
> - Autoscale doesn't support Azure Virtual Desktop for Azure Stack HCI.
> - Autoscale doesn't support scaling of ephemeral disks.
> - Autoscale doesn't support scaling of generalized VMs.
> - You can't use autoscale and [scale session hosts using Azure Automation and Azure Logic Apps](scaling-automation-logic-apps.md) on the same host pool. You must use one or the other.
> - Autoscale is currently only available in the public cloud.

For best results, we recommend using autoscale with VMs you deployed with Azure Virtual Desktop Azure Resource Manager templates or first-party tools from Microsoft.

>[!IMPORTANT]
>Deploying scaling plans with autoscale is currently limited to the following Azure regions in the public cloud:
>
>   - Australia East
>   - Canada Central
>   - Canada East
>   - Central US
>   - East US
>   - East US 2
>   - Japan East
>   - North Central US
>   - North Europe
>   - South Central US
>   - UK South
>   - UK West
>   - West Central US
>   - West Europe
>   - West US
>   - West US 2
>   - West US 3

## Prerequisites

To use scaling plans, make sure you follow these guidelines:

- You can currently only configure autoscale with existing pooled host pools.
- You must create the scaling plan in the same Azure region as the host pool you assign it to. You can't assign a scaling plan in one Azure region to a host pool in another Azure region.
- All host pools you use with autoscale must have a configured *MaxSessionLimit* parameter. Don't use the default value. You can configure this value in the host pool settings in the Azure portal or run the [New-AzWvdHostPool](/powershell/module/az.desktopvirtualization/new-azwvdhostpool) or [Update-AzWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool) PowerShell cmdlets.
- You must grant Azure Virtual Desktop access to manage the power state of your session host VMs. You must have the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions in order to assign the role-based access control (RBAC) role for the Azure Virtual Desktop service principal on those subscriptions. This is part of **User Access Administrator** and **Owner** built in roles.

## Assign the Desktop Virtualization Power On Off Contributor role with the Azure portal

Before creating your first scaling plan, you'll need to assign the *Desktop Virtualization Power On Off Contributor* RBAC role with your Azure subscription as the assignable scope. Assigning this role at any level lower than your subscription, such as the resource group, host pool, or VM, will prevent autoscale from working properly. You'll need to add each Azure subscription as an assignable scope that contains host pools and session host VMs you want to use with autoscale. This role and assignment will allow Azure Virtual Desktop to manage the power state of any VMs in those subscriptions. It will also let the service apply actions on both host pools and VMs when there are no active user sessions. 

To assign the *Desktop Virtualization Power On Off Contributor* role with the Azure portal to the Azure Virtual Desktop service principal on the subscription your host pool is deployed to:

1. Sign in to the Azure portal and go to **Subscriptions**. Select a subscription that contains a host pool and session host VMs you want to use with autoscale.

1. Select **Access control (IAM)**.

1. Select the **+ Add** button, then select **Add role assignment** from the drop-down menu.

1. Select the **Desktop Virtualization Power On Off Contributor** role and select **Next**.

1. On the **Members** tab, select **User, group, or service principal**, then select **+Select members**. In the search bar, enter and select either **Azure Virtual Desktop** or **Windows Virtual Desktop**. Which value you have depends on when the *Microsoft.DesktopVirtualization* resource provider was first registered in your Azure tenant. If you see two entries titled *Windows Virtual Desktop*, please see the tip below.

1. Select **Review + assign** to complete the assignment. Repeat this for any other subscriptions that contain host pools and session host VMs you want to use with autoscale.

> [!TIP]
> The application ID for the service principal is **9cdead84-a844-4324-93f2-b2e6bb768d07**.
>
> If you have an Azure Virtual Desktop (classic) deployment and an Azure Virtual Desktop (Azure Resource Manager) deployment where the *Microsoft.DesktopVirtualization* resource provider was registered before the display name changed, you will see two apps with the same name of *Windows Virtual Desktop*. To add the role assignment to the correct service principal, [you can use PowerShell](../role-based-access-control/role-assignments-powershell.md) which enables you to specify the application ID:
>
> To assign the *Desktop Virtualization Power On Off Contributor* role with PowerShell to the Azure Virtual Desktop service principal on the subscription your host pool is deployed to:
>
> 1. Open [Azure Cloud Shell](../cloud-shell/overview.md) with PowerShell as the shell type.
>
> 1. Get the object ID for the service principal (which is unique in each Azure tenant) and store it in a variable:
>
>    ```powershell
>    $objId = (Get-AzADServicePrincipal -AppId "9cdead84-a844-4324-93f2-b2e6bb768d07").Id
>    ```
>
> 1. Find the name of the subscription you want to add the role assignment to by listing all that are available to you:
>
>    ```powershell
>    Get-AzSubscription
>    ```
>
> 1. Get the subscription ID and store it in a variable, replacing the value for `-SubscriptionName` with the name of the subscription from the previous step:
>
>    ```powershell
>    $subId = (Get-AzSubscription -SubscriptionName "Microsoft Azure Enterprise").Id
>    ```
>
> 1. Add the role assignment:
>
>    ```powershell
>    New-AzRoleAssignment -RoleDefinitionName "Desktop Virtualization Power On Off Contributor" -ObjectId $objId -Scope /subscriptions/$subId
>    ```

## Create a scaling plan

Now that you've assigned the *Desktop Virtualization Power On Off Contributor* role to the service principal on your subscriptions, you can create a scaling plan. To create a scaling plan:

1. Open the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling Plans**, then select **Create**.

1. In the **Basics** tab, look under **Project details** and select the name of the subscription you'll assign the scaling plan to.

1. If you want to make a new resource group, select **Create new**. If you want to use an existing resource group, select its name from the drop-down menu.

1. Enter a name for the scaling plan into the **Name** field.

1. Optionally, you can also add a "friendly" name that will be displayed to your users and a description for your plan.

1. For **Region**, select a region for your scaling plan. The metadata for the object will be stored in the geography associated with the region. To learn more about regions, see [Data locations](data-locations.md).

1. For **Time zone**, select the time zone you'll use with your plan.

1. In **Exclusion tags**, enter a tag name for VMs you don't want to include in scaling operations. For example, you might want to tag VMs that are set to drain mode so that autoscale doesn't override drain mode during maintenance using the exclusion tag "excludeFromScaling". If you've set "excludeFromScaling" as the tag name field on any of the VMs in the host pool, autoscale won't start, stop, or change the drain mode of those particular VMs.
        
    >[!NOTE]
    >- Though an exclusion tag will exclude the tagged VM from power management scaling operations, tagged VMs will still be considered as part of the calculation of the minimum percentage of hosts.
    >- Make sure not to include any sensitive information in the exclusion tags such as user principal names or other personally identifiable information.

1. Select **Next**, which should take you to the **Schedules** tab.

## Configure a schedule

Schedules let you define when autoscale activates ramp-up and ramp-down modes throughout the day. In each phase of the schedule, autoscale only turns off VMs when in doing so the used host pool capacity won't exceed the capacity threshold. The default values you'll see when you try to create a schedule are the suggested values for weekdays, but you can change them as needed. 

To create or change a schedule:

1. In the **Schedules** tab, select **Add schedule**.

1. Enter a name for your schedule into the **Schedule name** field.

1. In the **Repeat on** field, select which days your schedule will repeat on.

1. In the **Ramp up** tab, fill out the following fields:

    - For **Start time**, select a time from the drop-down menu to start preparing VMs for peak business hours.

    - For **Load balancing algorithm**, we recommend selecting **breadth-first algorithm**. Breadth-first load balancing will distribute users across existing VMs to keep access times fast.
        
        >[!NOTE]
        >The load balancing preference you select here will override the one you selected for your original host pool settings.

    - For **Minimum percentage of hosts**, enter the percentage of session hosts you want to always remain on in this phase. If the percentage you enter isn't a whole number, it's rounded up to the nearest whole number. For example, in a host pool of seven session hosts, if you set the minimum percentage of hosts during ramp-up hours to **10%**, one VM will always stay on during ramp-up hours, and it won't be turned off by autoscale.
    
    - For **Capacity threshold**, enter the percentage of available host pool capacity that will trigger a scaling action to take place. For example, if two session hosts in the host pool with a max session limit of 20 are turned on, the available host pool capacity is 40. If you set the capacity threshold to **75%** and the session hosts have more than 30 user sessions, autoscale will turn on a third session host. This will then change the available host pool capacity from 40 to 60.

1. In the **Peak hours** tab, fill out the following fields:

    - For **Start time**, enter a start time for when your usage rate is highest during the day. Make sure the time is in the same time zone you specified for your scaling plan. This time is also the end time for the ramp-up phase.

    - For **Load balancing**, you can select either breadth-first or depth-first load balancing. Breadth-first load balancing distributes new user sessions across all available session hosts in the host pool. Depth-first load balancing distributes new sessions to any available session host with the highest number of connections that hasn't reached its session limit yet. For more information about load-balancing types, see [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md).

    > [!NOTE]
    > You can't change the capacity threshold here. Instead, the setting you entered in **Ramp-up** will carry over to this setting.

    - For **Ramp-down**, you'll enter values into similar fields to **Ramp-up**, but this time it will be for when your host pool usage drops off. This will include the following fields:

      - Start time
      - Load-balancing algorithm
      - Minimum percentage of hosts (%)
      - Capacity threshold (%)
      - Force logoff users

    > [!IMPORTANT]
    > - If you've enabled autoscale to force users to sign out during ramp-down, the feature will choose the session host with the lowest number of user sessions to shut down. Autoscale will put the session host in drain mode, send all active user sessions a notification telling them they'll be signed out, and then sign out all users after the specified wait time is over. After autoscale signs out all user sessions, it then deallocates the VM. If you haven't enabled forced sign out during ramp-down, session hosts with no active or disconnected sessions will be deallocated.
    > - During ramp-down, autoscale will only shut down VMs if all existing user sessions in the host pool can be consolidated to fewer VMs without exceeding the capacity threshold.

    - Likewise, **Off-peak hours** works the same way as **Peak hours**:

      - Start time, which is also the end of the ramp-down period.
      - Load-balancing algorithm. We recommend choosing **depth-first** to gradually reduce the number of session hosts based on sessions on each VM.
      - Just like peak hours, you can't configure the capacity threshold here. Instead, the value you entered in **Ramp-down** will carry over.

## Assign host pools

Now that you've set up your scaling plan, it's time to assign the plan to your host pools. Select the check box next to each host pool you want to include. If you don't want to enable autoscale, unselect all check boxes. You can always return to this setting later and change it.

> [!NOTE]
> When you create or update a scaling plan that's already assigned to host pools, its changes will be applied immediately.

## Add tags 

After that, you'll need to enter tags. Tags are name and value pairs that categorize resources for consolidated billing. You can apply the same tag to multiple resources and resource groups. To learn more about tagging resources, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

> [!NOTE] 
> If you change resource settings on other tabs after creating tags, your tags will be automatically updated.

Once you're done, go to the **Review + create** tab and select **Create** to deploy your host pool.

## Edit an existing scaling plan

To edit an existing scaling plan:

1. Open the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling plans**, then select the name of the scaling plan you want to edit. The overview blade of the scaling plan should open.

1. To change the scaling plan host pool assignments, under the **Manage** heading select **Host pool assignments** .

1. To edit schedules, under the **Manage** heading, select **Schedules**.

1. To edit the plan's friendly name, description, time zone, or exclusion tags, go to the **Properties** tab.

## Next steps

Now that you've created your scaling plan, here are some things you can do:

- [Assign your scaling plan to new and existing host pools](autoscale-new-existing-host-pool.md)
- [Enable diagnostics for your scaling plan](autoscale-diagnostics.md)

If you'd like to learn more about terms used in this article, check out our [autoscale glossary](autoscale-glossary.md). For examples of how autoscale works, see [Autoscale example scenarios](autoscale-scenarios.md). You can also look at our [Autoscale FAQ](autoscale-faq.yml) if you have other questions.
