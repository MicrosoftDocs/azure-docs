---
title: Manage the pre and post maintenance configuration events (preview) in Azure Update Manager
description: The article provides the steps to manage the pre and post maintenance events in Azure Update Manager.
ms.service: azure-update-manager
ms.date: 10/29/2023
ms.topic: how-to
ms.author: sudhirsneha
author: SnehaSudhirG
---

# Manage the pre and post maintenance events (preview)

**Applies to:** :heavy_check_mark: Windows VMs :heavy_check_mark: Linux VMs :heavy_check_mark: On-premises environment :heavy_check_mark: Azure Arc-enabled servers.

This article describes on the key capabilities of pre and post scripts, the applicable scenarios and how to enable them in Azure Update Manager.

## Key capabilities

- **Customized patching** - You can customize your patching workflows with custom execution before and after a scheduled patching.
- **Multiple end points** - You can choose to configure other endpoints such as Webhooks or Azure Functions or Storage accounts.
- **Integration with the [Event Grid](../event-grid/overview.md)** to recieve notifications.

## Workflow to configure pre and postscript maintenance activities

Review the workflow to configure the pre and post maintenance activities:

1. [Create a new maintenance configuration](#create-maintenance-configuration).
1. [Create Event Subscriptions](#create-event-subscription).


## User scenarios
The new capability ensures that by using pre and postscripts feature you can customize the patching workflows with custom execution before and after scheduled maintenance activity. Following are the scenarios where you can define the pre and post tasks:

#### [Prescript user scenarios](#tab/prescript)

| **Scenario**| **Description**|
|----------|-------------|
|Turn on machines | Turn on the machine to apply updates.|
|Create snapshot | Disk snaps used to recover data.| 
|Automation tutorial with identity | Runbooks using Managed Identity| 
|Start/configure Windows Update (WU) | Ensures that the WU is up and running before patching is attempted. | 
|Enable maintenance | Puts the machine in maintenance mode. |
|Notification email | Send a notification alert before patching is triggered. |
|Add network security group| Add the network security group.|
|Stop services | To stop services like Gateway services, NPExServices, SQL services etc.| 

#### [Postscript user scenarios](#tab/postscript)

| **Scenario**| **Description**|
|----------|-------------|
|Turn off | Turn off the machines after applying updates. | 
|Disable maintenance | Disable the maintenance mode on machines. | 
|Stop/Configure WU| Ensures that the WU is stopped after the patching is complete.|
|Notifications | Send patch summary or an alert that patching is complete.|
|Delete network security group| Delete the network security group.|
|Hybrid Worker| Configuration of Hybrid runbook worker. |
|Mute VM alerts | Enable VM alerts post patching. |
|Start services | Start services like SQL, health services etc.|
|Reports| Post patching report.|
|Tag change | Change tags and occasionally, turns off with tag change.|

---

## Create Pre and Post-tasks with the maintenance configuration

### Create maintenance configuration

To create a maintenance configuration, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configuration**.
1. Select the appropriate **Subscription ID** and **Resource Group**.
1. Provide an appropriate name for the maintenance configuration. 
1. Select **any region** and select the scope as **Guest(Azure VM, Arc enabled VMs)**.
1. Add a schedule based on your testing requirements. We recommend that you remember the time as this would be useful in the testing steps listed below.
1. After the validations pass, select **Create** to create the maintenance configuration and wait for the deployment to finish.

    :::image type="content" source="./media/manage-pre-post-events/create-maintenance-configuration.png" alt-text="Screenshot that shows how to create maintenance configuration.":::


### Create Event Subscription

To create an Event Subscription so that you can configure the pre and post scripts, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) and go to **Azure Update Manager**.
1. Under **Manage**, select **Machines**, **Maintenance Configurations**.
1. On the **Maintenance Configuration** page, select  the configuration.
1. On the **Events** page, under **Settings**, select **Events** to view the maintenance configurations that you've created.
1. Select **+Event Subscription** to create Pre/Post Maintenance Event.

    :::image type="content" source="./media/manage-pre-post-events/maintenance-events-inline.png" alt-text="Screenshot that shows the maintenance events." lightbox="./media/manage-pre-post-events/maintenance-events-expanded.png":::

1. On the **Create Event Subscription** page, enter the following details:
    - In the **Event Subscription Details** section, provide an appropriate name. 
    - Keep the schema as **Event Grid Schema**.
    - In the **Event Types** section, **Filter to Event Types**, select the event types that you want to get pushed to the endpoint or destination. You can select more than one option here.
    - In the **Endpoint details** section, select the endpoint where you want to receive the response from the **EventGrid**. It would help customers to trigger their Prescript.  
    - Select **Storage Queues** and provide the appropriate details such as **Subscription ID&**, **Storage account** and the **Queue name** where you'll receive the event.
    
      :::image type="content" source="./media/manage-pre-post-events/create-event-subscription.png" alt-text="Screenshot on how to create event subscription.":::
     

## View maintenance configuration 

You can view the details of the Maintenance configuration from Azure Resource Graph (ARG) with the following query: 

```kusto
    maintenanceresources 
    | where type =~ "microsoft.maintenance/maintenanceconfigurations/applyupdates" 
    | where properties.correlationId has "/subscriptions/<your-s-id> /resourcegroups/<your-rg-id> /providers/microsoft.maintenance/maintenanceconfigurations/<mc-name> /providers/microsoft.maintenance/applyupdates/" 
    | order by name desc 
    ```
    Ensure that you replace the following list in the above sample API so that it works:
    - Subscription ID (s-id selected in the prerequisites)
    - Resource Group (rg-id selected and created in the prerequisites)
    - Maintenance configuration name (mc-name)

    **Sample query**
    ```kusto
    maintenanceresources 
    | where type =~ "microsoft.maintenance/maintenanceconfigurations/applyupdates" 
    | where properties.correlationId has "/subscriptions/eee2cef4-bc47-4278-b4f8-cfc65f25dfd8/resourcegroups/fp02centraluseuap/providers/microsoft.maintenance/maintenanceconfigurations/prepostdemo7/providers/microsoft.maintenance/applyupdates/" 
    | order by name desc 
```
  :::image type="content" source="./media/manage-pre-post-events/resource-graph-query-inline.png" alt-text="Screenshot for ARG Query." lightbox="./media/manage-pre-post-events/resource-graph-query-expanded.png" :::

## Cancel the maintenance event

- To cancel the maintenance event, use the cancellation API. The error message in the JSON obtained from the Azure Resource Graph for the corresponding maintenance configuration would be **Maintenance canceled using Cancellation API**.

Invoke the Cancellation API as mentioned below:
    
  ```rest
    C:\ProgramData\chocolatey\bin\ARMClient.exe put https://management.azure.com/<your-c-id-obtained-from-above>?api-version=2023-09-01-preview "{\"Properties\":{\"Status\": \"Cancel\"}}" -Verbose 
  ```
> [!NOTE]
> You must replace the **Coorelation ID** received from the above ARG query and replace it in the Cancellation API.
    
  ```rest
    C:\ProgramData\chocolatey\bin\ARMClient.exe put https://management.azure.com/subscriptions/eee2cef4-bc47-4278-b4f8-cfc65f25dfd8/resourcegroups/fp02centraluseuap/providers/microsoft.maintenance/maintenanceconfigurations/prepostdemo7/providers/microsoft.maintenance/applyupdates/20230810085400?api-version=2023-09-01-preview "{\"Properties\":{\"Status\": \"Cancel\"}}" -Verbose
       
   ```
  :::image type="content" source="./media/manage-pre-post-events/cancellation-api-user-inline.png" alt-text="Screenshot for cancellation done by the user." lightbox="./media/manage-pre-post-events/cancellation-api-user-expanded.png" :::

- If the maintenance job is canceled by the system due to any reason, the error message in the JSON obtained from Azure Resource Graph for the corresponding maintenance configuration would be **Maintenance schedule canceled due to internal platform failure**.


When you invoke the cancellation flow, it is honored from 40 mins prior when the premaintenance event has been triggered till the last 10 mins from the event. For example, if you select the time as 3:00 p.m. to run the schedule, you can cancel the pre-event from 2:20 pm onwards till 2:50 p.m.

## Next steps
For issues and workarounds, see [troubleshoot](troubleshoot.md)
