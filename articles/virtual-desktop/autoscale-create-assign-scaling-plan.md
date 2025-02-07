---
title: Create and assign an autoscale scaling plan for Azure Virtual Desktop
description: How to create and assign an autoscale scaling plan to optimize deployment costs.
author: dknappettmsft
ms.topic: how-to
zone_pivot_groups: autoscale
ms.date: 11/19/2024
ms.author: daknappe
ms.custom: references_regions, devx-track-azurepowershell, docs_inherited
---

# Create and assign an autoscale scaling plan for Azure Virtual Desktop

> [!IMPORTANT]
> Dynamic autoscaling for pooled host pools with session host configuration is currently in PREVIEW. See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

Autoscale lets you scale your session host virtual machines (VMs) in a host pool up or down according to schedule to optimize deployment costs.

When using autoscale, you can choose from two different scaling methods: power management or dynamic. To learn more about autoscale, see [Autoscale scaling plans and example scenarios in Azure Virtual Desktop](autoscale-scenarios.md).

> [!NOTE]
> - You can't use autoscale and [scale session hosts using Azure Automation and Azure Logic Apps](scaling-automation-logic-apps.md) on the same host pool. You must use one or the other.
> - Power management autoscaling is available in Azure and Azure Government.
> - Dynamic autoscaling is only available in Azure and isn't supported in Azure Government.

For best results, we recommend using autoscale with session hosts you deployed with Azure Virtual Desktop Azure Resource Manager templates or first-party tools from Microsoft.

## Prerequisites

::: zone pivot="power-management"
To use a power management scaling plan, make sure you follow these guidelines:

- Scaling plan configuration data must be stored in the same region as the host pool configuration. Deploying session host VMs is supported in all Azure regions.

- When using autoscale for pooled host pools, you must have a configured *MaxSessionLimit* parameter for that host pool. Don't use the default value. You can configure this value in the host pool settings in the Azure portal or run the [New-AzWvdHostPool](/powershell/module/az.desktopvirtualization/new-azwvdhostpool) or [Update-AzWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool) PowerShell cmdlets.

- You must grant Azure Virtual Desktop access to manage the power state of your session host VMs. You must have the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions in order to assign the role-based access control (RBAC) role for the Azure Virtual Desktop service principal on those subscriptions. This is part of **User Access Administrator** and **Owner** built in roles.

- If you want to use personal desktop autoscale with hibernation, you'll need to enable the hibernation feature for VMs in your personal host pool. FSLogix and app attach currently don't support hibernate. Don't enable hibernate if you're using FSLogix or app attach for your personal host pools. For more information on using hibernation, including how hibernation works, limitations, and prerequisites, see [Hibernation for Azure virtual machines](/azure/virtual-machines/hibernate-resume).

- If you're using PowerShell to create and assign your scaling plan, you need module [Az.DesktopVirtualization](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/) version 4.2.0 or later. 

- If you're [configuring a time limit policy](#configure-a-time-limit-policy), you'll need: 
    - For Intune: a Microsoft Entra ID account that is assigned the Policy and Profile manager built-in RBAC role and a group containing the devices you want to configure.
    - For Group Policy: a domain account that has permission to create or edit Group Policy objects and a security group or organizational unit (OU) containing the devices you want to configure.
::: zone-end

::: zone pivot="dynamic"
To use a dynamic scaling plan (preview):

- Dynamic autoscaling can only be used for [pooled host pools with session host configuration](deploy-azure-virtual-desktop.md#create-a-host-pool-with-a-session-host-configuration). If you want to apply an autoscaling plan to a standard host pool without session host configuration, you need to use the power management scaling method, which is already generally available.

- You can't use dynamic scaling in conjunction with any other scaling script on the same host pool. You must use one or the other. 

- Scaling plan configuration data must be stored in the same region as the host pool configuration. You can deploy session hosts in any Azure region.

- When using autoscale for pooled host pools, you must have a set a custom max session limit for load balancing of that host pool. Don't use the default value. For more information, see [Configure host pool load balancing](configure-host-pool-load-balancing.md).

- You must grant Azure Virtual Desktop access to manage the power state of your session host VMs. You must have the `Microsoft.Authorization/roleAssignments/write` permission on your subscriptions in order to assign the role-based access control (RBAC) role for the Azure Virtual Desktop service principal on those subscriptions. This is part of **User Access Administrator** and **Owner** built in roles.

- Dynamic autoscaling currently requires access to the public Azure Storage endpoint `wvdhpustgr0prod.blob.core.windows.net` to deploy the RDAgent when creating session hosts. Until this is migrated to a [required endpoint for Azure Virtual Desktop](required-fqdn-endpoint.md), session hosts that can't access wvdhpustgr0prod.blob.core.windows.net will fail with a "CustomerVmNoAccessToDeploymentPackageException" error.

- If you're using PowerShell to create and assign your scaling plan, you need module [Az.DesktopVirtualization](https://www.powershellgallery.com/packages/Az.DesktopVirtualization/) version 4.2.0 or later. 
::: zone-end

::: zone pivot="power-management"

## Assign permissions to the Azure Virtual Desktop service principal

Before creating your first scaling plan, you'll need to assign the *Desktop Virtualization Power On Off Contributor* RBAC role to the Azure Virtual Desktop service principal with your Azure subscription as the assignable scope. Assigning this role at any level lower than your subscription, such as the resource group, host pool, or VM, will prevent autoscale from working properly.
	
You need to add each Azure subscription as an assignable scope that contains host pools and session host VMs you want to use with autoscale. This role and assignment allows Azure Virtual Desktop to manage the power state of any VMs in those subscriptions. It also lets the service apply actions on both host pools and VMs when there are no active user sessions.

To learn how to assign the *Desktop Virtualization Power On Off Contributor* role to the Azure Virtual Desktop service principal, see [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).
::: zone-end

::: zone pivot="dynamic"
## Assign permissions to the Azure Virtual Desktop service principal

Before creating your first scaling plan, you'll need to assign the *Desktop Virtualization Power On Off Contributor* and *Desktop Virtualization Virtual Machine Contributor* RBAC roles to the Azure Virtual Desktop service principal with your Azure subscription as the assignable scope. Assigning these roles at any level lower than your subscription, such as the resource group, host pool, or VM, will prevent autoscale from working properly. You'll need to add each Azure subscription as an assignable scope that contains host pools and session host VMs you want to use with autoscale. These roles and assignments allow Azure Virtual Desktop to manage the power state of any VMs and to create, delete, update, start, and stop any VMs in those subscriptions. They also let the service apply actions on both host pools and VMs when there are no active user sessions. 

To learn how to assign the *Desktop Virtualization Power On Off Contributor* role to the Azure Virtual Desktop service principal, see [Assign Azure RBAC roles or Microsoft Entra roles to the Azure Virtual Desktop service principals](service-principal-assign-roles.md).
::: zone-end

## Create a scaling plan

::: zone pivot="power-management"
### [Azure portal](#tab/portal)

Now that you've assigned the *Desktop Virtualization Power On Off Contributor* role to the service principal on your subscriptions, you can create a scaling plan. To create a scaling plan using the portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling Plans**, then select **Create**.

1. In the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the host pool in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Scaling plan name  | Enter a name for the scaling plan. Optionally, you can also add a "friendly" name that will be displayed to your users and a description for your plan. |
   | Location  | Select the Azure region where you want to create your scaling plan.  |
   | Time zone  | Select the time zone you'll use with your plan.  |
   | Host pool type  | Select the type of host pool that you want your scaling plan to apply to.  |
   | Exclusion tag | Enter a tag name for VMs you don't want to include in scaling operations. For example, you might want to tag VMs that are set to drain mode so that autoscale doesn't override drain mode during maintenance using the exclusion tag "excludeFromScaling". If you've set "excludeFromScaling" as the tag name field on any of the VMs in the host pool, autoscale won't start, stop, or change the drain mode of those particular VMs. |
   | Scaling method  | This option appears if you selected **Pooled** for **Host pool type**.  Select **Power management autoscaling**.  |

   >[!NOTE]
   >- Though an exclusion tag will exclude the tagged VM from power management scaling operations, tagged VMs will still be considered as part of the calculation of the minimum percentage of hosts.
   >- Make sure not to include any sensitive information in the exclusion tags such as user principal names or other personally identifiable information.

1. Select **Next**, which should take you to the **Schedules** tab. Schedules let you define when autoscale turns VMs on and off throughout the day. The schedule parameters are different based on the **Host pool type** you chose for the scaling plan.

    #### Pooled host pools

    In each phase of the schedule, autoscale only turns off VMs when in doing so the used host pool capacity won't exceed the capacity threshold. The default values you see when you try to create a schedule are the suggested values for weekdays, but you can change them as needed. 
    
    To create or change a schedule:
    
    1. In the **Schedules** tab, select **Add schedule** and complete the following information:   

       | Parameter | Value/Description |
       |--|--|
       | Schedule name | Enter a name for your schedule. |
       | Repeat on  | Select which days your schedule will repeat on.  |
        
    
    1. In the **Ramp up** tab, fill out the following fields:
       
       | Parameter | Value/Description |
       |--|--|
       | Start time | Select a time from the drop-down menu to start preparing VMs for peak business hours. |
       | Load balancing algorithm | We recommend selecting **breadth-first algorithm**. Breadth-first load balancing will distribute users across existing VMs to keep access times fast. The load balancing preference you select here will override the one you selected for your original host pool settings. |
       | Minimum percentage of hosts | Enter the percentage of session hosts you want to always remain on in this phase. If the percentage you enter isn't a whole number, it's rounded up to the nearest whole number. For example, in a host pool of seven session hosts, if you set the minimum percentage of hosts during ramp-up hours to **10%**, one VM will always stay on during ramp-up hours, and it won't be turned off by autoscale. |
       |Capacity threshold | Enter the percentage of available host pool capacity that will trigger a scaling action to take place. For example, if two session hosts in the host pool with a max session limit of 20 are turned on, the available host pool capacity is 40. If you set the capacity threshold to **75%** and the session hosts have more than 30 user sessions, autoscale will turn on a third session host. This will then change the available host pool capacity from 40 to 60. |
    
    1. In the **Peak hours** tab, fill out the following fields:
    
       | Parameter | Value/Description |
       |--|--|
       | Start time | Enter a start time for when your usage rate is highest during the day. Make sure the time is in the same time zone you specified for your scaling plan. This time is also the end time for the ramp-up phase. |
       | Load balancing | Select breadth-first or depth-first load balancing. Breadth-first load balancing distributes new user sessions across all available session hosts in the host pool. Depth-first load balancing distributes new sessions to any available session host with the highest number of connections that hasn't reached its session limit yet. <br /><br />For more information about load-balancing types, see [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md). |
    
        > [!NOTE]
        > You can't change the capacity threshold here. Instead, the setting you entered in **Ramp-up** will carry over to this setting.
    
    1. For **Ramp-down**, you'll enter values into similar fields to **Ramp-up**, but this time it will be for when your host pool usage drops off. This will include the following fields:
    
        - Start time
        - Load-balancing algorithm
        - Minimum percentage of hosts (%)
        - Capacity threshold (%)
        - Force logoff users
    
        > [!IMPORTANT]
        > - If you've enabled autoscale to force users to sign out during ramp-down, the feature will choose the session host with the lowest number of user sessions (active and disconnected) to shut down. Autoscale will put the session host in drain mode, send those user sessions a notification telling them they'll be signed out, and then sign out those users after the specified wait time is over. After autoscale signs out those user sessions, it then deallocates the VM.
        >    
        > - If you haven't enabled forced sign out during ramp-down, you then need to choose whether you want to shut down ‘VMs have no active or disconnected sessions’ or ‘VMs have no active sessions’ during ramp-down.
        >
        > - Whether you’ve enabled autoscale to force users to sign out during ramp-down or not, the [capacity threshold](autoscale-glossary.md#capacity-threshold) and the [minimum percentage of hosts](autoscale-glossary.md#minimum-percentage-of-hosts) are still respected, autoscale will only shut down VMs if all existing user sessions (active and disconnected) in the host pool can be consolidated to fewer VMs without exceeding the capacity threshold.
        >
        > - You can also configure a time limit policy that will apply to all phases to sign out all disconnected users to reduce the [used host pool capacity](autoscale-glossary.md#used-host-pool-capacity). For more information, see [Configure a time limit policy](#configure-a-time-limit-policy).
    
    1. Likewise, **Off-peak hours** works the same way as **Peak hours**:
    
        - Start time, which is also the end of the ramp-down period.
        - Load-balancing algorithm. We recommend choosing **depth-first** to gradually reduce the number of session hosts based on sessions on each VM.
        - Just like peak hours, you can't configure the capacity threshold here. Instead, the value you entered in **Ramp-down** carries over.
    
    #### Personal host pools
    
    In each phase of the schedule, define whether VMs should be deallocated based on the user session state. 
    
    To create or change a schedule:
    
    1. In the **Schedules** tab, select **Add schedule** and complete the following information:
    
       | Parameter | Value/Description |
       |--|--|
       | Schedule name | Enter a name for your schedule. |
       | Repeat on  | Select which days your schedule will repeat on.  |
    
    1. In the **Ramp up** tab, fill out the following fields:

       | Parameter | Value/Description |
       |--|--|
       | Start time | Select the time you want the ramp-up phase to start from the drop-down menu. |
       | Start VM on Connect | Select whether you want Start VM on Connect to be enabled during ramp up. <br /><br />We highly recommend that you enable Start VM on Connect if you choose not to start your VMs during the ramp-up phase. |
       | VMs to start | Select whether you want only personal desktops that have a user assigned to them at the start time to be started, you want all personal desktops in the host pool (regardless of user assignment) to be started, or you want no personal desktops in the pool to be started. |
       | Disconnect settings | For **When disconnected for (min)**, specify the number of minutes a user session has to be disconnected before performing a specific action. This number can be anywhere between 0 and 360. <br /><br />For **Perform**, specify what action the service should take after a user session has been disconnected for the specified time. The options are to either deallocate (shut down) the VMs, hibernate the personal desktop, or do nothing. |
       | Sign out settings | For **When logged off for (min)**, specify the number of minutes a user session has to be logged off before performing a specific action. This number can be anywhere between 0 and 360. <br /><br />For **Perform**, specify what action the service should take after a user session has been logged off for the specified time. The options are to either deallocate (shut down) the VMs, hibernate the personal desktop, or do nothing. |
    
    1. In the **Peak hours**, **Ramp-down**, and **Off-peak hours** tabs, fill out the following fields:
    
       | Parameter | Value/Description |
       |--|--|
       | Start time | Enter a start time for each phase. This time is also the end time for the previous phase. |
       | Start VM on Connect | Select whether you want Start VM on Connect to be enabled during that phase. |
       |Disconnect settings | For **When disconnected for (min)**, specify the number of minutes a user session has to be disconnected before performing a specific action. This number can be anywhere between 0 and 360. <br /><br />For **Perform**, specify what action the service should take after a user session has been disconnected for the specified time. The options are to either deallocate (shut down) the VMs, hibernate the personal desktop, or do nothing. |
       | Sign out settings | For **When logged off for (min)**, specify the number of minutes a user session has to be logged off before performing a specific action. This number can be anywhere between 0 and 360. <br /><br />For **Perform**, specify what action the service should take after a user session has been logged off for the specified time. The options are to either deallocate (shut down) the VMs, hibernate the personal desktop, or do nothing. |  
 
    ---

1. Select **Next** to take you to the **Host pool assignments** tab. Select the check box next to each host pool you want to include. If you don't want to enable autoscale, unselect all check boxes. You can always return to this setting later and change it. You can only assign the scaling plan to host pools that match the host pool type specified in the plan.

    > [!NOTE]
    > - When you create or update a scaling plan that's already assigned to host pools, its changes will be applied immediately.

1. After that, you'll need to enter **tags**. Tags are name and value pairs that categorize resources for consolidated billing. You can apply the same tag to multiple resources and resource groups. To learn more about tagging resources, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

    > [!NOTE] 
    > If you change resource settings on other tabs after creating tags, your tags will be automatically updated.

1. Once you're done, go to the **Review + create** tab and select **Create** to create and assign your scaling plan to the host pools you selected.

### [Azure PowerShell](#tab/powershell)

Here's how to create a scaling plan using the Az.DesktopVirtualization PowerShell module. The following examples show you how to create a scaling plan and scaling plan schedule. Be sure to change the `<placeholder>` values for your own.

[!INCLUDE [include-cloud-shell-local-powershell](includes/include-cloud-shell-local-powershell.md)]

2. Create a scaling plan for your pooled or personal host pools using the [New-AzWvdScalingPlan](/powershell/module/az.desktopvirtualization/new-azwvdscalingplan) cmdlet:
    
    ```azurepowershell
    $scalingPlanParams = @{
        ResourceGroupName = '<resourceGroup>'
        Name = '<scalingPlanName>'
        Location = '<AzureRegion>'
        Description = '<Scaling plan description>'
        FriendlyName = '<Scaling plan friendly name>'
        HostPoolType = '<Pooled or personal>'
        TimeZone = '<Time zone, such as Pacific Standard Time>'
        HostPoolReference = @(@{'hostPoolArmPath' = '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/<resourceGroup/providers/Microsoft.DesktopVirtualization/hostPools/<hostPoolName>'; 'scalingPlanEnabled' = $true;})
    }

    $scalingPlan = New-AzWvdScalingPlan @scalingPlanParams
    ``` 
    



3. Create a scaling plan schedule.

    * For pooled host pools, use the [New-AzWvdScalingPlanPooledSchedule](/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpooledschedule) cmdlet. This example creates a pooled scaling plan that runs on Monday through Friday, ramps up at 6:30 AM, starts peak hours at 8:30 AM, ramps down at 4:00 PM, and starts off-peak hours at 10:45 PM. 


        ```azurepowershell
        $scalingPlanPooledScheduleParams = @{
            ResourceGroupName = 'resourceGroup'
            ScalingPlanName = 'scalingPlanPooled'
            ScalingPlanScheduleName = 'pooledSchedule1'
            DaysOfWeek = 'Monday','Tuesday','Wednesday','Thursday','Friday'
            RampUpStartTimeHour = '6'
            RampUpStartTimeMinute = '30'
            RampUpLoadBalancingAlgorithm = 'BreadthFirst'
            RampUpMinimumHostsPct = '20'
            RampUpCapacityThresholdPct = '20'
            PeakStartTimeHour = '8'
            PeakStartTimeMinute = '30'
            PeakLoadBalancingAlgorithm = 'DepthFirst'
            RampDownStartTimeHour = '16'
            RampDownStartTimeMinute = '0'
            RampDownLoadBalancingAlgorithm = 'BreadthFirst'
            RampDownMinimumHostsPct = '20'
            RampDownCapacityThresholdPct = '20'
            RampDownForceLogoffUser = $true
            RampDownWaitTimeMinute = '30'
            RampDownNotificationMessage = 'Log out now, please.'
            RampDownStopHostsWhen = 'ZeroSessions'
            OffPeakStartTimeHour = '22'
            OffPeakStartTimeMinute = '45'
            OffPeakLoadBalancingAlgorithm = 'DepthFirst'
        }
        
        $scalingPlanPooledSchedule = New-AzWvdScalingPlanPooledSchedule @scalingPlanPooledScheduleParams
        ```
    

    * For personal host pools, use the [New-AzWvdScalingPlanPersonalSchedule](/powershell/module/az.desktopvirtualization/new-azwvdscalingplanpersonalschedule) cmdlet. The following example creates a personal scaling plan that runs on Monday, Tuesday, and Wednesday, ramps up at 6:00 AM, starts peak hours at 8:15 AM, ramps down at 4:30 PM, and starts off-peak hours at 6:45 PM.


        ```azurepowershell
        $scalingPlanPersonalScheduleParams = @{
            ResourceGroupName = 'resourceGroup'
            ScalingPlanName = 'scalingPlanPersonal'
            ScalingPlanScheduleName = 'personalSchedule1'
            DaysOfWeek = 'Monday','Tuesday','Wednesday'
            RampUpStartTimeHour = '6'
            RampUpStartTimeMinute = '0'
            RampUpAutoStartHost = 'WithAssignedUser'
            RampUpStartVMOnConnect = 'Enable'
            RampUpMinutesToWaitOnDisconnect = '30'
            RampUpActionOnDisconnect = 'Deallocate'
            RampUpMinutesToWaitOnLogoff = '3'
            RampUpActionOnLogoff = 'Deallocate'
            PeakStartTimeHour = '8'
            PeakStartTimeMinute = '15'
            PeakStartVMOnConnect = 'Enable'
            PeakMinutesToWaitOnDisconnect = '10'
            PeakActionOnDisconnect = 'Hibernate'
            PeakMinutesToWaitOnLogoff = '15'
            PeakActionOnLogoff = 'Deallocate'
            RampDownStartTimeHour = '16'
            RampDownStartTimeMinute = '30'
            RampDownStartVMOnConnect = 'Disable'
            RampDownMinutesToWaitOnDisconnect = '10'
            RampDownActionOnDisconnect = 'None'
            RampDownMinutesToWaitOnLogoff = '15'
            RampDownActionOnLogoff = 'Hibernate'
            OffPeakStartTimeHour = '18'
            OffPeakStartTimeMinute = '45'
            OffPeakStartVMOnConnect = 'Disable'
            OffPeakMinutesToWaitOnDisconnect = '10'
            OffPeakActionOnDisconnect = 'Deallocate'
            OffPeakMinutesToWaitOnLogoff = '15'
            OffPeakActionOnLogoff = 'Deallocate'
        }
        
        $scalingPlanPersonalSchedule = New-AzWvdScalingPlanPersonalSchedule @scalingPlanPersonalScheduleParams
        ```

        >[!NOTE]
        > We recommended that `RampUpStartVMOnConnect` is enabled for the ramp up phase of the schedule if you opt out of having autoscale start session host VMs. For more information, see [Start VM on Connect](start-virtual-machine-connect.md).

4. Use [Get-AzWvdScalingPlan](/powershell/module/az.desktopvirtualization/get-azwvdscalingplan) to get the host pool(s) that your scaling plan is assigned to.

   ```azurepowershell
   $params = @{
       ResourceGroupName = 'resourceGroup'
       Name = 'scalingPlanPersonal'
   }
    
   (Get-AzWvdScalingPlan @params).HostPoolReference | FL HostPoolArmPath,ScalingPlanEnabled
   ```

    
 You have now created a new scaling plan, one or more schedules, assigned it to your pooled or personal host pool(s), and enabled autoscale. 

---
::: zone-end

::: zone pivot="dynamic"
Now that you've assigned the *Desktop Virtualization Power On Off Contributor* and *Desktop Virtualization Virtual Machine Contributor* roles to the service principal on your subscriptions, you can create a dynamic scaling plan. 

During the preview, you can only create a scaling plan for dynamic autoscaling using the Azure portal. To create a dynamic scaling plan using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling Plans**, then select **Create**.

1. In the **Basics** tab, complete the following information:

   | Parameter | Value/Description |
   |--|--|
   | Subscription | Select the subscription you want to create the host pool in from the drop-down list. |
   | Resource group | Select an existing resource group or select **Create new** and enter a name. |
   | Scaling plan name  | Enter a name for the scaling plan. Optionally, you can also add a "friendly" name that will be displayed to your users and a description for your plan. |
   | Location  | Select the Azure region where you want to create your scaling plan.  |
   | Time zone  | Select the time zone you'll use with your plan.  |
   | Host pool type  | Select **Pooled**.  |
   | Exclusion tag | Enter a tag name for VMs you don't want to include in scaling operations. For example, you might want to tag VMs that are set to drain mode so that autoscale doesn't override drain mode during maintenance using the exclusion tag "excludeFromScaling". If you've set "excludeFromScaling" as the tag name field on any of the VMs in the host pool, autoscale won't start, stop, or change the drain mode of those particular VMs. |
   | Scaling method  | Select **Dynamic autoscaling**.  |

   >[!NOTE]
   >- Though an exclusion tag will exclude the tagged VM from power management scaling operations, tagged VMs will still be considered as part of the calculation of the minimum percentage of hosts.
   >- Make sure not to include any sensitive information in the exclusion tags such as user principal names or other personally identifiable information.

   Once you complete this tab, select **Next: Schedules**.

1. In the **Schedules** tab, select **Add schedule** and complete the following information. 

    
   1. In the **General** tab, fill out the following fields:
        
      | Parameter | Value/Description |
      |--|--|
      | Schedule name | Enter a name for your schedule. |
      | Repeat on  | Select which days your schedule will repeat on.  |
      | Minimum percentage of active hosts (%) | Enter the percentage of minimum number of running session host VMs based on the minimum host pool size that is always available. For example, if the minimum percentage of active hosts (%) is specified as 10 and the minimum host pool size is specified as 10, autoscale will ensure one session host is always available to take user connections.  |
      | Minimum host pool size | Enter the number of session host VMs to always be part of the host pool. These session hosts can either be in a running state or a stopped state.  |
      | Maximum host pool size  | Enter the maximum number of running session host VMs that can be available.  |

      Select **Next**.

    
   1. In the **Ramp up** tab, fill out the following fields:

      | Parameter | Value/Description |
      |--|--|
      | Start time | Select a time from the drop-down menu to start preparing VMs for peak business hours. |
      | Load balancing algorithm | We recommend selecting **breadth-first algorithm**. Breadth-first load balancing will distribute users across existing VMs to keep access times fast. The load balancing preference you select here will override the one you selected for your original host pool settings. |
      | Capacity threshold  | Enter the percentage of available host pool capacity that will trigger a scaling action to take place. For example, if capacity threshold is specified as 60% and your total host pool capacity is 100 sessions, autoscale will turn on additional session hosts once the host pool exceeds a load of 60 sessions. |
    
      You can modify the virtual machine limit parameters that you filled out in the **General** tab. We recommend having higher **Minimum percentage of active hosts (%)** and **Minimum host pool size** in the ramp-up phase, which will be carried over to the peak phase. 

      Select **Next**.
    
   1. In the **Peak hours** tab, fill out the following fields:

      | Parameter | Value/Description |
      |--|--|
      | Start time | Enter a start time for when your usage rate is highest during the day. Make sure the time is in the same time zone you specified for your scaling plan. This time is also the end time for the ramp-up phase. |
      | Load balancing algorithm | Select breadth-first or depth-first load balancing. Breadth-first load balancing distributes new user sessions across all available session hosts in the host pool. Depth-first load balancing distributes new sessions to any available session host with the highest number of connections that hasn't reached its session limit yet. <br /><br />For more information about load-balancing types, see [Configure the Azure Virtual Desktop load-balancing method](configure-host-pool-load-balancing.md). |
    
      > [!NOTE]
      > You can't change the capacity threshold here. Instead, the setting you entered in **Ramp-up** will carry over to this setting.
    
   1. In the **Ramp-down** tab, you'll enter values into similar fields to **Ramp-up**, but this time it will be for when your host pool usage drops off. This will include the following fields:
    
      - Start time
      - Load-balancing algorithm
      - Capacity threshold (%)
      - Force logoff users
      - Minimum percentage of active hosts (%)
      - Minimum host pool size
      - Maximum host pool size
    
      > [!IMPORTANT]
      > - If you've enabled autoscale to force users to sign out during ramp-down, the feature will choose the session host with the lowest number of user sessions (active and disconnected) to shut down or delete. Autoscale will put the session host in drain mode, send those user sessions a notification telling them they'll be signed out, and then sign out those users after the specified wait time is over. After autoscale signs out those user sessions, it then deallocates or deletes the VM.
      >    
      > - If you haven't enabled forced sign out during ramp-down, you then need to choose whether you want to shut down ‘VMs have no active or disconnected sessions’ or ‘VMs have no active sessions’ during ramp-down.
      >
      > - Whether you’ve enabled autoscale to force users to sign out during ramp-down or not, the [capacity threshold](autoscale-glossary.md#capacity-threshold) and the [minimum percentage of hosts](autoscale-glossary.md#minimum-percentage-of-hosts) are still respected, autoscale will only shut down/delete VMs if all existing user sessions (active and disconnected) in the host pool can be consolidated to fewer VMs without exceeding the capacity threshold.
    
   1. Likewise, **Off-peak hours** works the same way as **Peak hours**:
    
      - Start time, which is also the end of the ramp-down period.
      - Load-balancing algorithm. We recommend choosing **depth-first** to gradually reduce the number of session hosts based on sessions on each VM.
      - Just like peak hours, you can't configure the capacity threshold here. Instead, the value you entered in **Ramp-down** will carry over.
    
1. Select **Next** to take you to the **Host pool assignments** tab. Select the check box next to each host pool you want to include. If you don't want to enable autoscale, unselect all check boxes. You can always return to this setting later and change it. You can only assign the dynamic scaling plan to pooled host pools with session host configuration.

    > [!NOTE]
    > - When you create or update a scaling plan that's already assigned to host pools, its changes will be applied immediately.

1. After that, you'll need to enter **tags**. Tags are name and value pairs that categorize resources for consolidated billing. You can apply the same tag to multiple resources and resource groups. To learn more about tagging resources, see [Use tags to organize your Azure resources](../azure-resource-manager/management/tag-resources.md).

    > [!NOTE] 
    > If you change resource settings on other tabs after creating tags, your tags will be automatically updated.

1. Once you're done, go to the **Review + create** tab and select **Create** to create and assign your scaling plan to the host pools you selected.

> [!IMPORTANT] 
> Currently when you deploy session hosts in the Azure portal using session host configuration, by default it doesn't automatically delete the NIC and/or disk when deleting the VM. To change the default setting, see [Delete a VM and attached resources](/azure/virtual-machines/delete#force-delete-for-vms). Scaling honors the setting therefore NIC and disks for the VMs created manually in the portal won't be automatically deleted. This default setting will be changed so that NIC and disk for the VMs created by the scaling service will be automatically deleted together with the VMs. 

::: zone-end

::: zone pivot="power-management"
## Configure a time limit policy

You can configure a time limit policy that will sign out all disconnected users once a set time is reached to reduce the [used host pool capacity](autoscale-glossary.md#used-host-pool-capacity) using Microsoft Intune or Group Policy. Select the relevant tab for your scenario.

# [Microsoft Intune](#tab/intune)

To configure a time limit policy using Intune: 

1. Sign in to the [Microsoft Intune admin center](https://endpoint.microsoft.com/).

1. [Create or edit a configuration profile](/mem/intune/configuration/administrative-templates-windows) for **Windows 10 and later** devices, with the **Session Time Limits** profile type.

1. In the settings picker, browse to **Administrative templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Session Time Limits**.

1. Check the box for **Set time limit for disconnected sessions**, then close the settings picker.

1. Expand the **Administrative templates** category, then toggle the switch for **Set time limit for disconnected sessions** to **Enabled**, then select a time value from the drop-down list.

1. Select **Next**.

1. *Optional*: On the **Scope tags** tab, select a scope tag to filter the profile. For more information about scope tags, see [Use role-based access control (RBAC) and scope tags for distributed IT](/mem/intune/fundamentals/scope-tags).

1. On the **Assignments** tab, select the group containing the computers providing a remote session you want to configure, then select **Next**.

1. On the **Review + create** tab, review the settings, then select **Create**.

1. Once the policy applies to the computers providing a remote session, restart them for the settings to take effect.

# [Group Policy](#tab/group-policy)

To configure a time limit policy using Group Policy:

1. Open the **Group Policy Management** console on a device you use to manage the Active Directory domain.

1. Create or edit a policy that targets the computers providing a remote session you want to configure.

1. Navigate to **Computer Configuration** > **Policies** > **Administrative Templates** > **Windows Components** > **Remote Desktop Services** > **Remote Desktop Session Host** > **Session Time Limits**.

1. Double-click the policy setting **Set time limit for disconnected sessions** to open it.

1. Select **Enabled**, select a time value from the drop-down list, then select **OK**. 

1. Ensure the policy is applied to the computers providing a remote session, then restart them for the settings to take effect.

---

::: zone-end

## Edit an existing scaling plan

::: zone pivot="power-management"

Select the relevant tab for your scenario.

### [Azure portal](#tab/portal)

To edit an existing scaling plan using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling plans**, then select the name of the scaling plan you want to edit. The overview blade of the scaling plan should open.

1. To change the scaling plan host pool assignments, under the **Manage** heading select **Host pool assignments** and then select **+ Assign**. Select the host pools you want to assign the scaling plan to and select **Assign**. The host pools must be in the same Azure region as the scaling plan and the scaling plan's host pool type must match the type of host pools you're trying to assign it to.

    > [!TIP]
    > If you've enabled the scaling plan during deployment, then you'll also have the option to disable the plan for the selected host pool in the **Scaling plan** menu by unselecting the **Enable autoscale** checkbox, as shown in the following screenshot.
    >
    > [!div class="mx-imgBorder"]
    > ![A screenshot of the scaling plan window. The "enable autoscale" check box is selected and highlighted with a red border.](media/enable-autoscale.png)

1. To edit schedules, under the **Manage** heading, select **Schedules**.

1. To edit the plan's friendly name, description, time zone, or exclusion tags, go to the **Properties** tab.

### [Azure PowerShell](#tab/powershell)

Here's how to update a scaling plan using the Az.DesktopVirtualization PowerShell module. The following examples show you how to update a scaling plan and scaling plan schedule.

* Update a scaling plan using [Update-AzWvdScalingPlan](/powershell/module/az.desktopvirtualization/update-azwvdscalingplan). This example updates the scaling plan's timezone.

    ```azurepowershell
    $scalingPlanParams = @{
        ResourceGroupName = 'resourceGroup'
        Name = 'scalingPlanPersonal'
        Timezone = 'Eastern Standard Time'
    }
    
    Update-AzWvdScalingPlan @scalingPlanParams
    ```

* Update a scaling plan schedule using [Update-AzWvdScalingPlanPersonalSchedule](/powershell/module/az.desktopvirtualization/update-azwvdscalingplanpersonalschedule). This example updates the ramp up start time.

    ```azurepowershell
    $scalingPlanPersonalScheduleParams = @{
        ResourceGroupName = 'resourceGroup'
        ScalingPlanName = 'scalingPlanPersonal'
        ScalingPlanScheduleName = 'personalSchedule1'
        RampUpStartTimeHour = '5'
        RampUpStartTimeMinute = '30'
    }
    
    Update-AzWvdScalingPlanPersonalSchedule @scalingPlanPersonalScheduleParams
    ```

* Update a pooled scaling plan schedule using [Update-AzWvdScalingPlanPooledSchedule](/powershell/module/az.desktopvirtualization/update-azwvdscalingplanpooledschedule). This example updates the peak hours start time.

    ```azurepowershell
    $scalingPlanPooledScheduleParams = @{
        ResourceGroupName = 'resourceGroup'
        ScalingPlanName = 'scalingPlanPooled'
        ScalingPlanScheduleName = 'pooledSchedule1'
        PeakStartTimeHour = '9'
        PeakStartTimeMinute = '15'
    }
    
    Update-AzWvdScalingPlanPooledSchedule @scalingPlanPooledScheduleParams
    ```

* Assign a scaling plan to existing host pools using [Update-AzWvdScalingPlan](/powershell/module/az.desktopvirtualization/update-azwvdscalingplan). The following example assigns a personal scaling plan to two existing personal host pools.

    ```azurepowershell
   $scalingPlanParams = @{
        ResourceGroupName = 'resourceGroup'
        Name = 'scalingPlanPersonal'
        HostPoolReference = @(
            @{
               'hostPoolArmPath' = '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/resourceGroup/providers/Microsoft.DesktopVirtualization/hostPools/scalingPlanPersonal';
                'scalingPlanEnabled' = $true;
            },
            @{
               'hostPoolArmPath' = '/subscriptions/aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e/resourceGroups/resourceGroup/providers/Microsoft.DesktopVirtualization/hostPools/scalingPlanPersonal2';
                'scalingPlanEnabled' = $true;
            }
        )
    }
    
    $scalingPlan = Update-AzWvdScalingPlan @scalingPlanParams
    ```

* Use [Get-AzWvdScalingPlan](/powershell/module/az.desktopvirtualization/get-azwvdscalingplan) to get the host pool(s) that your scaling plan is assigned to.

    ```azurepowershell
    $params = @{
        ResourceGroupName = 'resourceGroup'
        Name = 'scalingPlanPersonal'
    }
    
    (Get-AzWvdScalingPlan @params).HostPoolReference | FL HostPoolArmPath,ScalingPlanEnabled
    ```

---

::: zone-end

::: zone pivot="dynamic"

To edit an existing scaling plan using the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search bar, type *Azure Virtual Desktop* and select the matching service entry.

1. Select **Scaling plans**, then select the name of the scaling plan you want to edit. The overview blade of the scaling plan should open.

1. To change the scaling plan host pool assignments, under the **Manage** heading select **Host pool assignments** and then select **+ Assign**. Select the host pools you want to assign the scaling plan to and select **Assign**. The host pools must be in the same Azure region as the scaling plan and the scaling plan's host pool type must match the type of host pools you're trying to assign it to.

    > [!TIP]
    > If you've enabled the scaling plan during deployment, then you'll also have the option to disable the plan for the selected host pool in the **Scaling plan** menu by unselecting the **Enable autoscale** checkbox, as shown in the following screenshot.
    >
    > [!div class="mx-imgBorder"]
    > ![A screenshot of the scaling plan window. The "enable autoscale" check box is selected and highlighted with a red border.](media/enable-autoscale.png)

1. To edit schedules, under the **Manage** heading, select **Schedules**.

1. To edit the plan's friendly name, description, time zone, or exclusion tags, go to the **Properties** tab.

::: zone-end



## Next steps

Now that you've created your scaling plan, here are some things you can do:

- [Monitor Autoscale operations with Insights](autoscale-diagnostics.md)

If you'd like to learn more about terms used in this article, check out our [autoscale glossary](autoscale-glossary.md). For examples of how autoscale works, see [Autoscale example scenarios](autoscale-scenarios.md). You can also look at our [Autoscale FAQ](autoscale-faq.yml) if you have other questions.
