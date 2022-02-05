---
title: Azure Virtual Desktop session host autoscale preview
description: How to use the autoscale feature to allocate resources in your deployment.
author: Heidilohr
ms.topic: how-to
ms.date: 10/19/2021
ms.author: helohr
manager: femila
ms.custom: references_regions
---
# Autoscale (preview) for Azure Virtual Desktop host pools

> [!IMPORTANT]
> The autoscale feature is currently in preview.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

The autoscale feature (preview) lets you scale your Azure Virtual Desktop deployment's virtual machines (VMs) up or down to optimize deployment costs. Based on your needs, you can make a scaling plan based on:

- Time of day
- Specific days of the week
- Session limits per session host

>[!NOTE]
> - Azure Virtual Desktop (classic) doesn't support the autoscale feature. 
> - Autoscale doesn't support Azure Virtual Desktop for Azure Stack HCI 
> - Autoscale doesn't support scaling of ephemeral disks.
> - Autoscale doesn't support scaling of generalized VMs.


For best results, we recommend using autoscale with VMs you deployed with Azure Virtual Desktop Azure Resource Manager templates or first-party tools from Microsoft.

>[!IMPORTANT]
>The preview version of this feature currently has the following limitations:
>
> - You can only use autoscale in the Azure public cloud.
> - You can only configure autoscale with the Azure portal.
> - You can only deploy the scaling plan to US and European regions.

## Requirements

Before you create your first scaling plan, make sure you follow these guidelines:

- You can currently only configure autoscale with pooled existing host pools.
- All host pools you autoscale must have a configured MaxSessionLimit parameter. Don't use the default value. You can configure this value in the host pool settings in the Azure portal or run the [New-AZWvdHostPool](/powershell/module/az.desktopvirtualization/new-azwvdhostpool?view=azps-5.7.0&preserve-view=true) or [Update-AZWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool?view=azps-5.7.0&preserve-view=true) cmdlets in PowerShell.
- You must grant Azure Virtual Desktop access to manage power on your VM Compute resources.

## Create a custom RBAC role in your subscription

To start creating a scaling plan, you'll first need to create a custom Role-based Access Control (RBAC) role in your subscription. This role will allow Windows Virtual Desktop to power manage all VMs in your subscription. It will also let the service apply actions on both host pools and VMs when there are no active user sessions. Creating this RBAC role at any level lower than your subscription, like at the host pool or VM level, will prevent the autoscale feature from working properly.

To create the custom role, follow the instructions in [Azure custom roles](../role-based-access-control/custom-roles.md) while using the following JSON template. This template already includes any permissions you need. For more detailed instructions, see [Assign custom roles with the Azure portal](#assign-custom-roles-with-the-azure-portal).
```json
 {
 "properties": {
 "roleName": "Autoscale",
 "description": "Friendly description.",
 "assignableScopes": [
 "/subscriptions/<SubscriptionID>"
 ],
  "permissions": [
   {
   "actions": [
				 "Microsoft.Insights/eventtypes/values/read",
				 "Microsoft.Compute/virtualMachines/deallocate/action",
				 "Microsoft.Compute/virtualMachines/restart/action",
				 "Microsoft.Compute/virtualMachines/powerOff/action",
				 "Microsoft.Compute/virtualMachines/start/action",
				 "Microsoft.Compute/virtualMachines/read",
				 "Microsoft.DesktopVirtualization/hostpools/read",
				 "Microsoft.DesktopVirtualization/hostpools/write",
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/read",
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/write",
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/delete",
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read",
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action"
],
  "notActions": [],
  "dataActions": [],
  "notDataActions": []
  }
 ]
}
}
```

## Assign custom roles with the Azure portal

To create and assign the custom role to your subscription with the Azure portal:

1. Open the Azure portal and go to **Subscriptions**.

2. Select the **+** button in the top left-hand corner of the screen, then select **Add custom role** from the drop-down menu, as shown in the following screenshot.

    > [!div class="mx-imgBorder"]
    > ![A screenshot showing the drop-down menu that appears when you select the plus sign button in the Azure portal control panel. The option add custom role is selected and highlighted wtih a red border.](media/add-custom-role.png)

3. Next, name the custom role and add a description. We recommend you name the role “Autoscale.”

4. On the **Permissions** tab, add the following permissions to the subscription you're assigning the role to:

    ```azcopy
   		"Microsoft.Insights/eventtypes/values/read"
				 "Microsoft.Compute/virtualMachines/deallocate/action"
				 "Microsoft.Compute/virtualMachines/restart/action"
				 "Microsoft.Compute/virtualMachines/powerOff/action"
				 "Microsoft.Compute/virtualMachines/start/action"
				 "Microsoft.Compute/virtualMachines/read"
				 "Microsoft.DesktopVirtualization/hostpools/read"
				 "Microsoft.DesktopVirtualization/hostpools/write"
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/read"
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/write"
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/delete"
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read"
				 "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action"
    ```

5. When you're finished, select **Ok**.

After that, you'll need to assign the role to grant access to Azure Virtual Desktop.

To assign the custom role to grant access:

1. In the **Access control (IAM) tab**, select **Add role assignments**.

2. Select the role you just created and continue to the next screen.

3. Select **+Select members**. In the search bar, enter and select **Windows Virtual Desktop**, as shown in the following screenshot. When you have an Azure Virtual Desktop (classic) deployment and an Azure Virtual Desktop with Azure Resource Manager Azure Virtual Desktop objects, you will see two apps with the same name. Select them both.

    > [!div class="mx-imgBorder"]
    > ![A screenshot of the add role assignment menu. The Select field is highlighted in red, with the user entering "Windows Virtual Desktop" into the search field.](media/search-for-role.png)

4. Select **Review + assign** to complete the assignment.

## How creating a scaling plan works

Before you create your plan, keep the following things in mind:

- You can assign one scaling plan to one or more host pools of the same host pool type. The scaling plan's schedule will also be applied across all assigned host pools.

- You can only associate one scaling plan per host pool. If you assign a single scaling plan to multiple host pools, those host pools can't be assigned to another scaling plan.

- A scaling plan can only operate in its configured time zone.

- A scaling plan can have one or multiple schedules. For example, different schedules during weekdays versus the weekend.

- Make sure you understand usage patterns before defining your schedule. You'll need to schedule around the following times of day:

    - Ramp-up: the start of the day, when usage picks up.
    - Peak hours: the time of day when usage is highest.
    - Ramp-down: when usage tapers off. This is usually when you shut down your VMs to save costs.
    - Off-peak hours: the time with the lowest possible usage. You can define the maximum number of VMs that can be active during this time.

- The scaling plan will take effect as soon as you enable it.

Also, keep these limitations in mind:

- Don’t use autoscale in combination with other scaling Microsoft or third-party scaling tools. Ensure that you disable those for the host pools you apply the scaling plans.

- Autoscale overwrites drain mode, so make sure to use exclusion tags when updating VMs in host pools.

- Autoscale ignores existing load-balancing algorithms in your host pool settings, and instead applies load balancing based on your schedule configuration.

## Create a scaling plan

To create a scaling plan:

1. Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

2. Go to **Azure Virtual Desktop** > **Scaling Plans**, then select **Create**.

3. In the **Basics** tab, look under **Project details** and select the name of the subscription you will assign the scaling plan to.

4. If you want to make a new resource group, select **Create new**. If you want to use an existing resource group, select its name from the drop-down menu.

5. Enter a name for the scaling plan into the **Name** field.

6. Optionally, you can also add a "friendly" name that will be displayed to your users and a description for your plan.

7. For **Region**, select a region for your scaling plan. The metadata for the object will be stored in the geography associated with the region. To learn more about regions, see [Data locations](data-locations.md).

8. For **Time zone**, select the time zone you'll use with your plan.

9. In **Exclusion tags**, enter a tag name for VMs you don't want to include in scaling operations. For example, you might want to tag VMs that are set to drain mode so that autoscale doesn't override drain mode during maintenance using the exclusion tag "excludeFromScaling". If you've set "excludeFromScaling" as the tag name field on any of the VMs in the host pool, the autoscale feature won't start, stop, or change the drain mode of those particular VMs.
        
    >[!NOTE]
    >- Though an exclusion tag will exclude the tagged VM from power management scaling operations, tagged VMs will still be considered as part of the calculation of the minimum percentage of hosts.
    >- Make sure not to include any sensitive information in the exclusion tags such as user principal names or other personally identifiable information.

10. Select **Next**, which should take you to the **Schedules** tab.

## Configure a schedule

Schedules let you define when autoscale activates ramp-up and ramp-down modes throughout the day. In each phase of the schedule, autoscale only turns off VMs when a session host has no sessions active. The default values you'll see when you try to create a schedule are the suggested values for weekdays, but you can change them as needed. 

To create or change a schedule:

1. In the **Schedules** tab, select **Add schedule**.

2. Enter a name for your schedule into the **Schedule name** field.

3. In the **Repeat on** field, select which days your schedule will repeat on.

4. In the **Ramp up** tab, fill out the following fields:

    - For **Start time**, select a time from the drop-down menu to start preparing VMs for peak business hours.

    - For **Load balancing algorithm**, we recommend selecting **breadth-first algorithm**. Breadth-first load balancing will distribute users across existing VMs to keep access times fast.
        
        >[!NOTE]
        >The load balancing preference you select here will override the one you selected for your original host pool settings.

    - For **Minimum percentage of hosts**, enter the percentage of session hosts you want to always remain on in this phase. If the percentage you enter isn't a whole number, it's rounded up to the nearest whole number. For example, in a host pool of seven session hosts, if you set the minimum percentage of hosts during ramp-up hours to **10%** , one VM will always stay on during ramp-up hours, and it won't be turned off by the autoscale feature.
    
    - For **Capacity threshold**, enter the percentage of available host pool capacity that will trigger a scaling action to take place. For example, if 2 session hosts in the host pool with a max session limit of 20 are turned on, the available host pool capacity is 40. If you set the capacity threshold to **75%** and the session hosts have more than 30 user sessions, the autoscale feature will turn on a third session host. This will then change the available host pool capacity from 40 to 60.

5. In the **Peak hours** tab, fill out the following fields:

    - For **Start time**, enter a start time for when your usage rate is highest during the day. Make sure the time is in the same time zone you specified for your scaling plan. This time is also the end time for the ramp-up phase.

    - For **Load balancing**, you can select either breadth-first or depth-first load balancing. Breadth-first load balancing distributes new user sessions across all available session hosts in the host pool. Depth-first load balancing distributes new sessions to any available session host with the highest number of connections that hasn't reached its session limit yet. For more information about load-balancing types, see [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md).

    >[!NOTE]
    >You can't change the capacity threshold here. Instead, the setting you entered in **Ramp-up** will carry over to this setting.

    - For **Ramp-down**, you'll enter values into similar fields to **Ramp-up**, but this time it will be for when your host pool usage drops off. This will include the following fields:

      - Start time
      - Load-balancing algorithm
      - Minimum percentage of hosts (%)
      - Capacity threshold (%)
      - Force logoff users

    >[!IMPORTANT]
    >- If you've enabled the autoscale feature to force users to sign out during ramp-down, the feature will choose the session host with the lowest number of user sessions to shut down. The autoscale feature will put the session host in drain mode, send all active user sessions a notification telling them they'll be signed out, and then sign out all users after the specified wait time is over. After the autoscale feature signs out all user sessions, it then deallocates the VM. If you haven't enabled forced sign out during ramp-down, session hosts with no active or disconnected sessions will be deallocated.
    >- During ramp-down, the autoscale feature will only shut down VMs if all existing user sessions in the host pool can be consolidated to fewer VMs without exceeding the capacity threshold.

    - Likewise, **Off-peak hours** works the same way as **Peak hours**:

      - Start time, which is also the end of the ramp-down period.
      - Load-balancing algorithm. We recommend choosing **depth-first** to gradually reduce the number of session hosts based on sessions on each VM.
      - Just like peak hours, you can't configure the capacity threshold here. Instead, the value you entered in **Ramp-down** will carry over.

## Assign host pools

Now that you've set up your scaling plan, it's time to assign the plan to your host pools. Select the check box next to each host pool you want to include. If you don't want to enable autoscale, unselect all check boxes. You can always return to this setting later and change it.

>[!NOTE]
>When you create or update a scaling plan that's already assigned to host pools, its changes will immediately be applied.

## Add tags 

After that, you'll need to enter tags. Tags are name and value pairs that categorize resources for consolidated billing. You can apply the same tag to multiple resources and resource groups. To learn more about tagging resources, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

>[!NOTE] 
>If you change resource settings on other tabs after creating tags, your tags will be automatically updated.

Once you're done, go to the **Review + create** tab and select **Create** to deploy your host pool.

## Next steps

Now that you've created your scaling plan, here are some things you can do:

- [Assign your scaling plan to new and existing host pools](autoscale-new-existing-host-pool.md)
- [Enable diagnostics for your scaling plan](autoscale-diagnostics.md)
