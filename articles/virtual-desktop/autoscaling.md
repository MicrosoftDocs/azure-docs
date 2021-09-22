---
title: Azure Virtual Desktop session host autoscaling
description: How to use the autoscaling feature to allocate resources in your deployment.
author: Heidilohr
ms.topic: how-to
ms.date: 09/21/2021
ms.author: helohr
manager: femila
---
# Autoscaling for Azure Virtual Desktop session hosts

The autoscale feature is currently in public preview. This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities. For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Automate scaling up or scaling down virtual machines to optimize the costs of your Azure Virtual Desktop deployment. Based on the needs in your environment scale VMs by:

- Time of day
- Days of the week
- Session limits per session host

>[!NOTE]
>This feature is not supported with Windows Virtual Desktop (classic). Scaling of ephemeral disks is not supported.

For best results we strongly recommend using autoscale with VMs deployed using Azure Virtual Desktop ARM templates or tools provided by Microsoft or partners.

## Requirements

Ensure you confirm these requirements before configuring your first scaling plan:

- Autoscale currently can only be configured with existing host pools of type pooled.

- Those host pools need to have the MaxSessionLimit configured (don’t use the default value). To configure the value go to the settings of the host pools you want to apply this feature or leverage PowerShell ([New-AZWvdHostPool](powershell/module/az.desktopvirtualization/new-azwvdhostpool?view=azps-5.7.0) or [Update-AZWvdHostPool](/powershell/module/az.desktopvirtualization/update-azwvdhostpool?view=azps-5.7.0))

- Azure Virtual Desktop needs to be given access on the Compute resources to power manage VMs.

## Create a Custom RBAC role

In the following we will create a custom role to allow the Windows Virtual Desktop Service to power manage the VMs in your subscription.

Set up a custom RBAC role and add the following rights for the service to power manage the VM and to allow the Autoscale service to apply actions both on host pools and VMs when no active sessions are registered.

When creating custom roles follow instructions for [Azure Custom Roles here](../role-based-access-control/custom-roles.md). Use this JSON example when creating your role:

```json
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
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read",                   "Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read"
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

1. Open the Azure portal and go to **Subscriptions**.

2. Go to **Access control (IAM)** and select **Add a custom role**.

    ![](media/0ef363a33292ebbc8864945e31ca6fb2.png)

1. Next, name the custom role and add a description. We recommend you name it “Autoscale”

2. On the **Permissions** tab, add the following permissions to the subscription you're assigning the role to:

```azcopy
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
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/sendMessage/action",
"Microsoft.DesktopVirtualization/hostpools/sessionhosts/usersessions/read",
```

3. When you're finished, select **Ok**.

After that, you'll need to assign the role to grant access to Azure Virtual Desktop.

To assign the custom role:

1. In the **Access control (IAM) tab**, select **Add role assignments**.

2. Select the role you just created.

3. In the search bar, enter and select **Windows Virtual Desktop**.

![Graphical user interface, text, application Description automatically generated](media/faf200da1a48e409516c08f76db2f414.png)

When adding the custom role in the Azure portal verify you have selected these
permissions:

![Graphical user interface, application Description automatically generated](media/89705981d48f02c2efefaae38e21fe96.png)

## Create a scaling plan

Before you create your plan, keep the following considerations in mind:

- One scaling plan can be assigned to one or more host pools of the same host pool type. This means that the same schedule will be applied across all assigned host pools.

- Each host pool can be associated with only one scaling plan.

- A scaling plan is tied and operates in a configured time zone.

- A scaling plan can have one or more schedules (E.g.: different schedule for weekday versus weekend). Understand usage patterns before you define a schedule. Take the following phases into account:

    - Ramp up covers the start of the day.
    - Peak hours: define the scaling preference.
    - Ramp-down covers shutting down VMs at the end of day.
    - Off peak hours: define the number of VMs which should be up and running outside of the regular hours.

1. Scaling plan takes effect immediately when enabled.

Also, keep these limitations in mind:

2. Don’t use autoscale in combination with other scaling Microsoft or third-party scaling tools. Ensure that you disable those for the host pools you apply the scaling plans.

3. Autoscale overwrites Drain mode. Use exclusion tags when updating VMs in host pools.

4. Load balancing algorithm configured in the host pool settings is ignored when a scaling plan is assigned to a host pool. Autoscale applies load balancing based on preferred configuration in the schedule.

### Assign a role with the Azure portal

To use the Azure portal to assign a role:

#### Create a Scaling Plan (Basics tab)

Creating a scaling plan includes the following steps:

- Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

- Navigate to Azure Virtual Desktop. Select **Scaling Plans** and select **Create.**

- In the **Basics** tab, select the correct subscription under Project details.

- Either select **Create new** to make a new resource group or select an existing resource group from the drop-down menu.

- Enter a **name** for the scaling plan.

- Optionally add a friendly name and a description of the plan.

- Select a **region** for the Scaling Plan object. The metadata for the object will be stored in the geography associated with the region. In preview only Central US and East US 2 are supported.

- **Select a time zone** to which the triggers to start or stop VMs are bound to.

- Use **Exclusion tags** associated with VMs to exclude them from scaling operations. As an example, you might want to use this functionality for maintenance. When you have set VMs on Drain mode use the tag so autoscale doesn’t override drain mode.

- Select next to move to **schedules**.

#### Configure a schedule

Schedules enable you to define the ramp up and down triggers during the day. The first schedule you create through the portal comes with suggested defaults for weekdays. Modify as needed. Note that in each phase of the schedule, VMs are only turned off if a session host reaches 0 sessions.

- Select **Add schedule**

- Give the schedule a **name.**

- Select the days the schedule should be repeated.

- Ramp Up

    - Select the **start time** to prepare virtual machines for the peak business.

    - **Load balancing algorithm** is recommended for Breath first to distribute users across existing VMs for the best experience.
        
        >[!NOTE]
        >The original preference configured in the host-pool settings will be ignored as autoscale respects the configuration here.

    - Enter a start time for the beginning of **peak hours** in the time zone you specified for your scaling plan. This is also the end time for ramp-up hours.

    - Specify the **minimum percentage of session host virtual machines** to start for ramp-up and peak hours. Example: if the minimum percentage of hosts is specified as 10% and the total number of session hosts in your host pool is 10, Autoscale will ensure a minimum of 1 session host is available to take user connections at all times during this phase.

    - Capacity Threshold: This is the percentage of used host pool capacity that will be considered to evaluate whether to turn on virtual machines during the ramp-up and peak hours.   For example, if the capacity threshold is specified as 60% and your total host pool capacity is 100 sessions, Autoscale will turn on additional session hosts once the host pool exceeds a load of 60 sessions.

- Peak hours describe the timeframe when you expect workers to be mainly logged on.

    - Load balancing: Breadth-first load balancing distributes new user sessions across all available session hosts in the host pool. Depth-first load balancing distributes new user sessions to an available session host with the highest number of connections but has not reached its maximum session limit threshold. 

    - The capacity threshold is not configurable but carried over from Ramp up phase as relevant for scaling activities.

- Ramp down

    - Start Time
    - Load balancing algorithm
    - Minimum percentage of hosts (%)
    - Capacity threshold (%)
    - Force logoff users

- Off-peak hours.

    - Configure the **Start time** for the end of ramp-down.
    - We recommend keeping load balancing algorithm to depth-first in that phase to gradually reduce the number of session hosts based on sessions on each VM.
    - The capacity threshold will be adopted from Ramp-down

#### Assign host pools

Select the host pools you want to assign the scaling plan to. If you don’t want to enable autoscale immediately check off the box and come back later to this screen.

>[!NOTE]
>When creating or updating a scaling plan that is assigned to host pools scaling changes are immediate when plan is enabled.

#### Add Tags 

Tags are name/value pairs that enable you to categorize resources and view consolidated billing by applying the same tag to multiple resources and resource groups [Learn more](..azure-resource-manager/resource-group-using-tags.md).

>[!NOTE] 
>If you create tags and then change resource settings on other tabs, your tags will be automatically updated.

#### Deploy the scaling plan

Review information under Review + create and submit the deployment plan.

### Enable a scaling plan after creating a host pool

Scaling plans can be enabled post creation for existing host pools. When the Scaling is enabled on the host pool, it would apply to all session hosts. Scaling would automatically apply to new session hosts created in that host pool. If you disable scaling, all machines managed by scaling will remain in the state they are in at the time of disabling.

Using Azure Portal
------------------

Open the Azure portal.

- Navigate to Windows Virtual Desktop

- Select **host pools** and scroll down where you can see the new option under settings Scaling plan.

![](media/f68ee5b51396fdf60e4c7d7910848b9c.png)

![Graphical user interface, application Description automatically generated](media/f68ee5b51396fdf60e4c7d7910848b9c.png)

- Select Scaling plan to either:

    ![](media/352ef2258c6a7cb862a7fec57dd881d6.png)

    Assign a scaling plan if there is none assigned.

    - When you have enabled the scaling plan during deployment you have the option to disable the plan for the selected host pool here.

        ![Graphical user interface, text, application, email Description automatically generated](media/8e65d9913651538ee18b4d3b679b1305.png)

Edit existing scaling plan using the Azure Portal
=================================================

- Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

- Navigate to “Windows Virtual Desktop”

- Select scaling plans and select the scaling plan name to view the scaling plan details.

- Navigate to

    - properties to edit friendly name, description, time zone or exclusion tags.

    - Manage section to assign host pools or edit schedules.

Set-up diagnostic for Autoscale
===============================

Limitations
-----------

In preview you can choose to select to send the logs to either an Azure Storage Account or use Event hubs to consume logs. Later in preview we are planning to enable Log Analytics for monitoring and troubleshooting scaling plans. Learn more about diagnostic settings
[here](../azure-monitor/essentials/diagnostic-settings.md). For resource log data ingestion time see this [Azure Monitor document](../azure-monitor/logs/data-ingestion-time.md).

When setting up an Azure Storage Account ensure it matches the region for the
scaling plan. To enable diagnostics:

- Sign in to the Azure portal at [https://portal.azure.com](https://portal.azure.com/).

- Select **Scaling Plans** and select a scaling plan in your list

- Navigate to **Diagnostic Settings** and select “add diagnostic setting”.

- Provide a name for the diagnostic setting.

- Next select **Autoscaling** and choose either storage account or event hub.

- Save when done.

Logs location using Azure Storage
---------------------------------

After you complete configuring diagnostics settings in scaling plan you will be able to find those logs using the following steps.

- Navigate to the Storage Group you configured diagnostics to send logs to.

- Select containers and will see folder called insight-logs-autoscaling

![Graphical user interface, application Description automatically generated](media/a1b43719aa6d9117b7e60a2a21c7d4ca.png)

- Select the insight-logs-autoscaling folder and navigate to the log you want to see. You will have to select several times till you reach the final folder and see the JSON file as in the example below. Right select the row to download the log file.

![Graphical user interface, text, application, email Description automatically generated](media/e472cf84eba5dd1c56b1d9565fbfe045.png)

- Open .json file in desired text editor

Viewing Diagnostics logs
------------------------

Logs are stored in a json format. In this documentation we would like to give an overview on the pieces of the log.

1. **CorrelationID**: Provide this ID to support for further troubleshooting when opening a support case.

2. **OperationName**: provides information on type of operation that has been executed.

3. **ResultType**: result of the operation. In case of a failed operation, you want to review the message.

4. **Message**: Contains the error message that provides information on the failed operation. Please review carefully for links to documentation that help to troubleshoot or mitigate the situation. If you are starting to build alerting based on the logs note those those are still under development and might change. We will keep you updated.

```json
{
    "host_Ring": "R0",
    "Level": 4,
    "ActivityId": "c1111111-1111-1111-b111-11111cd1ba1b1",
    "time": "2021-08-31T16:00:46.5246835Z",
    "resourceId": "/SUBSCRIPTIONS/AD11111A-1C21-1CF1-A7DE-CB1111E1D111/RESOURCEGROUPS/TEST/PROVIDERS/MICROSOFT.DESKTOPVIRTUALIZATION/SCALINGPLANS/TESTPLAN",
    "operationName": "HostPoolLoadBalancerTypeUpdated",
    "category": "Autoscaling",
    "resultType": "Succeeded",
    "level": "Informational",
    "correlationId": "35ec619b-b5d8-5b5f-9242-824aa4d2b878",
    "properties": {
        "Message": "Host pool's load balancing algorithm updated",
        "HostPoolArmPath": "/subscriptions/AD11111A-1C21-1CF1-A7DE-CB1111E1D111/resourcegroups/test/providers/microsoft.desktopvirtualization/hostpools/testHostPool ",
        "PreviousLoadBalancerType": "BreadthFirst",
        "NewLoadBalancerType": "DepthFirst"
    }
}. L
```